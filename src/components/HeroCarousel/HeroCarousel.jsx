import { useCallback, useEffect, useRef, useState } from 'react'
import Button from '../Button/Button.jsx'
import './HeroCarousel.scss'

const INTERVAL = 14000 // ms between slides
const SWIPE = 40 // px of horizontal travel that counts as a swipe
// How far the photo drifts, as a percentage of its own height. The frame hides
// 12% above and below, so this can never pull an edge into view.
const PARALLAX = 6

const pad = (n) => String(n).padStart(2, '0')

// A bare chevron: no plate, no border, no background. The whole affordance is
// the glyph moving and brightening on hover.
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

function HeroCarousel({ slides }) {
  const [index, setIndex] = useState(0)
  // Three independent reasons to stop advancing, tracked separately so one
  // resuming doesn't override another that still holds.
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [tabHidden, setTabHidden] = useState(false)
  const [reduced, setReduced] = useState(false)

  const rootRef = useRef(null)
  const frameRef = useRef(null)
  const touchX = useRef(null)

  const count = slides.length
  const slide = slides[index]
  const paused = hovered || focused || tabHidden

  const go = useCallback((next) => setIndex((next + count) % count), [count])

  // Respect a reader who has asked for less movement, and keep respecting it if
  // they change the setting while the page is open.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)

    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden)

    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  // Auto-advance. `index` is a dependency on purpose: any manual move remounts
  // this timer, so a visitor who just clicked gets a full interval rather than
  // the tail of the previous one.
  useEffect(() => {
    if (paused || reduced || count < 2) return

    const id = setTimeout(() => go(index + 1), INTERVAL)
    return () => clearTimeout(id)
  }, [index, paused, reduced, count, go])

  // Parallax: the photo drifts as the hero leaves the viewport.
  useEffect(() => {
    if (reduced) return

    let frame = 0

    const onScroll = () => {
      if (frame) return

      frame = requestAnimationFrame(() => {
        frame = 0
        const root = rootRef.current
        const layer = frameRef.current
        if (!root || !layer) return

        const { top, height } = root.getBoundingClientRect()
        // 0 while the hero sits at the top of the viewport, 1 once it has
        // scrolled its full height past it.
        const progress = Math.min(Math.max(-top / height, 0), 1)
        layer.style.transform = `translate3d(0, ${progress * PARALLAX}%, 0)`
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [reduced])

  const onKeyDown = (event) => {
    if (event.key === 'ArrowLeft') go(index - 1)
    if (event.key === 'ArrowRight') go(index + 1)
  }

  return (
    <section
      ref={rootRef}
      className="hero"
      aria-roledescription="carousel"
      aria-label="Obra destacada"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyDown={onKeyDown}
      onTouchStart={(event) => {
        touchX.current = event.changedTouches[0].clientX
      }}
      onTouchEnd={(event) => {
        if (touchX.current === null) return

        const travelled = event.changedTouches[0].clientX - touchX.current
        touchX.current = null

        if (Math.abs(travelled) > SWIPE) {
          go(index + (travelled < 0 ? 1 : -1))
          return
        }

        // Barely moved, so it was a tap rather than a swipe: advance. Only for
        // touch — a click handler here would fire on desktop too, where the
        // arrows already do this job.
        //
        // Taps that land on the button, an arrow or a progress bar are that
        // control's own; without this check the call to action would navigate
        // and change the slide in the same gesture.
        if (!event.target.closest('a, button')) go(index + 1)
      }}
    >
      <div className="hero__frame" ref={frameRef}>
        {slides.map((item, position) => (
          <div
            key={item.id}
            className={`hero__slide${position === index ? ' is-active' : ''}`}
            role="group"
            aria-roledescription="slide"
            aria-label={`${position + 1} de ${count}`}
            aria-hidden={position !== index}
          >
            <img
              className="hero__photo"
              style={{ '--slide-focus': item.mobileFocus }}
              src={item.src}
              srcSet={item.srcSet}
              sizes="100vw"
              alt={item.alt}
              // The first two load immediately — one is on screen, the other is
              // a cross-fade away. The rest wait until they are needed.
              loading={position < 2 ? 'eager' : 'lazy'}
              fetchPriority={position === 0 ? 'high' : 'auto'}
              draggable="false"
            />
          </div>
        ))}
      </div>

      {/* Legibility comes from this, not from a lighter colour: the caption is
          white over photographs that may be white themselves. */}
      <div className="hero__scrim" aria-hidden="true" />

      {/* Keyed by slide so the caption re-enters on every change. */}
      <div className="hero__caption" key={slide.id}>
        {/* Rendered only when there is one — an empty element would still take
            its share of the gap. */}
        {slide.breadcrumb && (
          <p className="hero__breadcrumb">{slide.breadcrumb}</p>
        )}

        <h1 className="hero__title">{slide.title}</h1>
        <p className="hero__subtitle">{slide.subtitle}</p>

        <Button to={slide.action.to} className="hero__button">
          {slide.action.label}
        </Button>
      </div>

      <button
        type="button"
        className="hero__arrow hero__arrow--prev"
        aria-label="Imagen anterior"
        onClick={() => go(index - 1)}
      >
        <Chevron direction="prev" />
      </button>

      <button
        type="button"
        className="hero__arrow hero__arrow--next"
        aria-label="Imagen siguiente"
        onClick={() => go(index + 1)}
      >
        <Chevron direction="next" />
      </button>

      <div className="hero__controls">
        <div className="hero__bars">
          {slides.map((item, position) => (
            <button
              key={item.id}
              type="button"
              className={`hero__bar${position === index ? ' is-active' : ''}`}
              aria-label={`Ir a la imagen ${position + 1}`}
              aria-current={position === index ? 'true' : undefined}
              onClick={() => go(position)}
            />
          ))}
        </div>

        <p className="hero__counter">
          {pad(index + 1)} / {pad(count)}
        </p>
      </div>

      <p className="sr-only" aria-live="polite">
        {`Imagen ${index + 1} de ${count}: ${slide.title}`}
      </p>
    </section>
  )
}

export default HeroCarousel
