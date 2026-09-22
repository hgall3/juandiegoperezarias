import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useReveal } from '../../hooks/useReveal.jsx'
import { galleryCards } from '../../content/galleryCards.jsx'
import './GalleryCarousel.scss'

// How far a pointer may travel during a press before it counts as a drag rather
// than a click. Below this a steady hand still navigates; above it the click is
// swallowed, so pulling the row along never opens a category by accident.
const DRAG_SLOP = 6

// A couple of pixels of slack when deciding whether the track has reached an
// end. Scroll offsets are fractional once the layout involves percentages, so
// an exact comparison leaves an arrow enabled at a scrollLeft of 0.4 that does
// nothing when clicked.
const EDGE_TOLERANCE = 2

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

// A finger rather than a pointer. Asked at the moment of the tap rather than
// stored, so a device that has both — a laptop with a touchscreen — answers for
// the input actually being used.
const isCoarsePointer = () => window.matchMedia('(hover: none)').matches

// A bare chevron, matching the hero's: no plate, no border, no background. The
// whole affordance is the glyph itself. Kept local for the same reason the
// hero keeps its own — it is a render helper, not a piece of shared UI.
function Chevron({ direction }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === 'prev' ? 'M15 4 L7 12 L15 20' : 'M9 4 L17 12 L9 20'} />
    </svg>
  )
}

function GalleryCarousel() {
  const [revealRef, revealed] = useReveal()
  const trackRef = useRef(null)

  // Whether each end has been reached, which is what disables an arrow, and
  // which card is at the head of the row, which is what lights a dot.
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const [active, setActive] = useState(0)
  const [dragging, setDragging] = useState(false)
  // On a touch screen there is no hover to reveal a card with, so a press does
  // it instead. Holds the slug of the one card currently open, or null.
  const [openCard, setOpenCard] = useState(null)

  // Live drag state. A ref rather than state on purpose: it changes on every
  // pointermove, and re-rendering the whole row at that rate would make the
  // drag stutter. Nothing on screen depends on it except the cursor, which is
  // the one piece kept in state above.
  const drag = useRef(null)
  // Set when a drag travelled far enough to count, and read by the click that
  // the browser fires immediately afterwards.
  const suppressClick = useRef(false)

  const count = galleryCards.length

  // One card plus one gap, measured rather than hardcoded: the card width and
  // the gap both change at breakpoints, and the distance between two cards'
  // left edges is exactly the scroll step whatever they happen to be.
  const step = useCallback(() => {
    const track = trackRef.current
    if (!track) return 0

    const [first, second] = track.children
    if (!first) return 0
    if (!second) return first.getBoundingClientRect().width

    return second.offsetLeft - first.offsetLeft
  }, [])

  const measure = useCallback(() => {
    const track = trackRef.current
    if (!track) return

    const { scrollLeft, scrollWidth, clientWidth } = track
    setAtStart(scrollLeft <= EDGE_TOLERANCE)
    setAtEnd(scrollLeft >= scrollWidth - clientWidth - EDGE_TOLERANCE)

    const distance = step()
    setActive(distance > 0 ? Math.round(scrollLeft / distance) : 0)
  }, [step])

  // Keep the arrows and dots honest. The scroll listener is passive and
  // throttled to a frame — it fires far faster than anything here needs to
  // change, and doing the reads inline would mean a layout measurement on
  // every one of them.
  //
  // The ResizeObserver covers both cases the spec asks for beyond scrolling: a
  // window resize changes the track's own box, and anything that alters the
  // row's extent after load changes it too.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        measure()
        // Moving the row closes whatever a press had opened. Returning the same
        // value when there is nothing open lets React skip the render, so this
        // costs nothing on the scrolls where it does not apply.
        setOpenCard((current) => (current === null ? current : null))
      })
    }

    measure()
    track.addEventListener('scroll', onScroll, { passive: true })

    const observer = new ResizeObserver(measure)
    observer.observe(track)

    return () => {
      track.removeEventListener('scroll', onScroll)
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [measure])

  const scrollByCards = (direction) => {
    const track = trackRef.current
    if (!track) return

    track.scrollBy({
      left: direction * step(),
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    })
  }

  // ---- Pointer drag -------------------------------------------------------

  const onPointerDown = (event) => {
    // Touch is left entirely alone: the browser's own swipe has momentum and
    // rubber-banding that a scrollLeft assignment cannot reproduce, and
    // intercepting it would make the row feel worse on a phone, not better.
    if (event.pointerType === 'touch') return
    // Primary button only. A right-click opening a context menu would otherwise
    // begin a drag that no pointerup ever ends.
    if (event.button !== 0) return

    const track = trackRef.current
    if (!track) return

    // Clear last time's verdict here rather than after the click that consumed
    // it. A drag that ends without a click — released outside the window, say —
    // would otherwise leave the flag set and swallow the next real click.
    suppressClick.current = false

    drag.current = {
      pointerId: event.pointerId,
      // startX is only ever used to judge click-versus-drag; lastX is what the
      // scrolling works from.
      startX: event.clientX,
      lastX: event.clientX,
      travelled: 0,
    }

    track.setPointerCapture(event.pointerId)
    setDragging(true)
  }

  const onPointerMove = (event) => {
    const state = drag.current
    if (!state || state.pointerId !== event.pointerId) return

    const track = trackRef.current
    if (!track) return

    // Frame by frame, against wherever the track is now — NOT the total
    // distance from where the press began against where the track was then.
    //
    // The difference shows the moment a drag runs past an end. scrollLeft
    // clamps there, so an absolute sum keeps growing against a figure the
    // track can no longer reach, and dragging back does nothing until that
    // whole overshoot has been paid off. The row sticks, then lurches. Applying
    // each frame's delta to the current position cannot drift, because there is
    // no running total to drift from.
    const delta = event.clientX - state.lastX
    state.lastX = event.clientX

    // Still measured from the start, and still the furthest it ever got rather
    // than where it ended: a drag out and back should not read as a click.
    state.travelled = Math.max(
      state.travelled,
      Math.abs(event.clientX - state.startX),
    )

    track.scrollLeft -= delta
  }

  const endDrag = (event) => {
    const state = drag.current
    if (!state) return

    suppressClick.current = state.travelled > DRAG_SLOP
    drag.current = null
    setDragging(false)

    const track = trackRef.current
    if (track?.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId)
    }
  }

  // Capture phase, so the card's own link never sees a click this stops.
  const onClickCapture = (event) => {
    // A drag that travelled is never a click, whatever it landed on.
    if (suppressClick.current) {
      suppressClick.current = false
      event.preventDefault()
      event.stopPropagation()
      return
    }

    // With a pointer, hover has already shown what the card says and the click
    // means what it looks like it means.
    if (!isCoarsePointer()) return

    const card = event.target.closest('.gallery-card')

    // A tap that missed the cards altogether puts the open one away.
    if (!card) {
      setOpenCard(null)
      return
    }

    if (card.dataset.slug === openCard) {
      // Open: Ver más is the only thing that follows the link. It is the one
      // part of the card drawn as a target, so it should be the one part that
      // behaves like one.
      if (event.target.closest('.gallery-card__cta')) return

      // Anywhere else on an open card is a way back out — the photograph
      // returns to the row rather than navigating somewhere unasked.
      event.preventDefault()
      event.stopPropagation()
      setOpenCard(null)
      return
    }

    // Closed: the tap reveals rather than navigates. Without this a finger
    // could never read a card before opening it, since the photograph alone
    // says nothing about where it leads.
    event.preventDefault()
    event.stopPropagation()
    setOpenCard(card.dataset.slug)
  }

  // ---- Keyboard -----------------------------------------------------------

  const onKeyDown = (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return

    // The track is focusable, so without this the page would scroll as well.
    event.preventDefault()
    scrollByCards(event.key === 'ArrowLeft' ? -1 : 1)
  }

  // Tabbing through the cards has to bring each one into view, and it must move
  // the track ONLY. scrollIntoView would scroll the page as well, throwing the
  // section around underneath someone who is simply tabbing through it, so the
  // track's own offset is adjusted by the shortfall instead.
  const onFocusCapture = (event) => {
    const track = trackRef.current
    const card = event.target.closest('.gallery-card')
    if (!track || !card) return

    const cardBox = card.getBoundingClientRect()
    const trackBox = track.getBoundingClientRect()
    // Leave the first card's own gutter as the resting inset, so a card scrolled
    // to from the left doesn't end up flush against the window edge.
    const inset = track.firstElementChild
      ? track.firstElementChild.getBoundingClientRect().left - trackBox.left
      : 0

    if (cardBox.left < trackBox.left + inset) {
      track.scrollLeft -= trackBox.left + inset - cardBox.left
    } else if (cardBox.right > trackBox.right) {
      track.scrollLeft += cardBox.right - trackBox.right
    }
  }

  return (
    <section
      ref={revealRef}
      className={`gallery${revealed ? ' is-revealed' : ''}`}
      aria-labelledby="gallery-heading"
    >
      <header className="gallery__head reveal">
        <h2 className="gallery__heading" id="gallery-heading">
          Foto galería
        </h2>

      </header>

      {/* Holds the arrows against the row rather than the heading, so they sit
          over the photographs the way the hero's do. */}
      <div className="gallery__viewport">
        {/* Not merely dimmed at the ends — gone. An arrow that is visible but
            does nothing still says there is more that way. Hidden below $bp-sm,
            where swiping carries navigation instead. */}
        {!atStart && (
          <button
            type="button"
            className="gallery__arrow gallery__arrow--prev"
            aria-label="Ver categorías anteriores"
            onClick={() => scrollByCards(-1)}
          >
            <Chevron direction="prev" />
          </button>
        )}

        {!atEnd && (
          <button
            type="button"
            className="gallery__arrow gallery__arrow--next"
            aria-label="Ver más categorías"
            onClick={() => scrollByCards(1)}
          >
            <Chevron direction="next" />
          </button>
        )}

        <div
          ref={trackRef}
          className={`gallery__track reveal reveal--delayed${
            dragging ? ' is-dragging' : ''
          }`}
          role="region"
          aria-label="Categorías de la foto galería"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onFocusCapture={onFocusCapture}
          onClickCapture={onClickCapture}
          // Anchors and images are draggable by default, and the browser starting
          // its own drag cancels the pointer stream this carousel runs on — so
          // over a card, which is the whole surface, dragging would do nothing at
          // all. Refusing the gesture here leaves the pointer events intact.
          onDragStart={(event) => event.preventDefault()}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
        >
          {galleryCards.map((card, position) => (
            <Link
              key={card.slug}
              to={card.href}
              data-slug={card.slug}
              className={`gallery-card${
                card.slug === openCard ? ' is-open' : ''
              }`}
              draggable="false"
            >
              <img
                className="gallery-card__photo"
                src={card.src}
                srcSet={card.srcSet}
                sizes="(min-width: 1440px) 380px, (min-width: 1024px) 340px, (min-width: 768px) 300px, 78vw"
                alt={card.alt}
                width="750"
                height="1000"
                // The first two are the ones on screen before anything is
                // scrolled; the rest wait until they are approached.
                loading={position < 2 ? 'eager' : 'lazy'}
                decoding="async"
                draggable="false"
              />

              <div className="gallery-card__scrim" aria-hidden="true" />

              <div className="gallery-card__caption">
                <span className="gallery-card__title">{card.title}</span>
                <span className="gallery-card__cta">Ver más</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* The phone's substitute for the arrows: a nudge that the row moves, and
          a read-out of where in it you are. Both are decoration for a gesture
          the visitor makes directly — the position they report is already
          apparent from the row itself — so they are hidden from screen readers
          rather than announced as controls that cannot be operated. */}
      <div className="gallery__cue" aria-hidden="true">
        <p className="gallery__hint">Desliza →</p>

        <div className="gallery__dots">
          {galleryCards.map((card, position) => (
            <span
              key={card.slug}
              className={`gallery__dot${position === active ? ' is-active' : ''}`}
            />
          ))}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {`Categoría ${Math.min(active + 1, count)} de ${count}`}
      </p>
    </section>
  )
}

export default GalleryCarousel
