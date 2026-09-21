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

    const track = trackRef.current
    if (!track) return

    // Clear last time's verdict here rather than after the click that consumed
    // it. A drag that ends without a click — released outside the window, say —
    // would otherwise leave the flag set and swallow the next real click.
    suppressClick.current = false

    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startScroll: track.scrollLeft,
      travelled: 0,
    }

    track.setPointerCapture(event.pointerId)
    setDragging(true)
  }

  const onPointerMove = (event) => {
    const state = drag.current
    if (!state || state.pointerId !== event.pointerId) return

    const moved = event.clientX - state.startX
    // The furthest it ever got, not where it ended: a drag out and back would
    // otherwise read as a click and navigate.
    state.travelled = Math.max(state.travelled, Math.abs(moved))
    trackRef.current.scrollLeft = state.startScroll - moved
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

  // Capture phase, so the card's own link never sees the click.
  const onClickCapture = (event) => {
    if (!suppressClick.current) return

    suppressClick.current = false
    event.preventDefault()
    event.stopPropagation()
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

        {/* Hidden below $bp-sm, where swiping carries navigation instead. */}
        <div className="gallery__arrows">
          <button
            type="button"
            className="gallery__arrow"
            aria-label="Ver categorías anteriores"
            disabled={atStart}
            onClick={() => scrollByCards(-1)}
          >
            <Chevron direction="prev" />
          </button>

          <button
            type="button"
            className="gallery__arrow"
            aria-label="Ver más categorías"
            disabled={atEnd}
            onClick={() => scrollByCards(1)}
          >
            <Chevron direction="next" />
          </button>
        </div>
      </header>

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
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      >
        {galleryCards.map((card, position) => (
          <Link key={card.slug} to={card.href} className="gallery-card">
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
