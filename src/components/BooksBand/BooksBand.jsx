import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../Button/Button.jsx'
import { useReveal } from '../../hooks/useReveal.jsx'
import { featuredBook, shelfBooks } from '../../content/homeBooks.jsx'
import parqueCajas900 from '../../assets/books/parque-cajas-900.jpg'
import parqueCajas1500 from '../../assets/books/parque-cajas-1500.jpg'
import './BooksBand.scss'

// How far the photograph drifts, as a percentage of its own height, across the
// whole time the band is on screen.
//
// The figure is not free. The photograph is 130% of the band's height and sits
// pulled up by 15%, so there is exactly 15% hidden above and 15% below. Drifting
// half of this either side of centre uses 5% of that 15% and can never pull an
// edge into view, whatever the band's height or the window's.
const PARALLAX = 10

function BooksBand() {
  const [revealRef, revealed] = useReveal()
  const bandRef = useRef(null)
  const photoRef = useRef(null)
  const [reduced, setReduced] = useState(false)

  // Respect a reader who has asked for less movement, and keep respecting it if
  // they change the setting while the page is open.
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(query.matches)

    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  // The photograph drifts against the page as the band passes. This is movement
  // inside the band's own frame — the band keeps its place in the flow and
  // never travels over or under anything else.
  useEffect(() => {
    if (reduced) return

    let frame = 0

    const onScroll = () => {
      if (frame) return

      frame = requestAnimationFrame(() => {
        frame = 0
        const band = bandRef.current
        const photo = photoRef.current
        if (!band || !photo) return

        const { top, height } = band.getBoundingClientRect()
        // 0 as the band's top edge first appears at the bottom of the window,
        // 1 once its bottom edge has left the top. Measured over the band plus
        // a window so the drift is spread across the whole time it is visible
        // rather than finishing before it has been read.
        const travel = window.innerHeight + height
        const progress = Math.min(Math.max((window.innerHeight - top) / travel, 0), 1)

        // Centred on zero, so the photograph sits where it was framed when the
        // band is halfway up the window and leans equally either side of that.
        const offset = (progress - 0.5) * PARALLAX
        photo.style.transform = `translate3d(0, ${offset}%, 0)`
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [reduced])

  return (
    <section
      ref={(node) => {
        bandRef.current = node
        revealRef.current = node
      }}
      className={`books${revealed ? ' is-revealed' : ''}`}
      aria-labelledby="books-label"
    >
      {/* Decorative: the band's subject is the books, and the landscape behind
          them is atmosphere. Announcing it would only get in the way. */}
      <img
        ref={photoRef}
        className="books__photo"
        src={parqueCajas1500}
        srcSet={`${parqueCajas900} 900w, ${parqueCajas1500} 1500w`}
        sizes="100vw"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        draggable="false"
      />

      {/* Closes the corners while leaving the middle of the photograph open. */}
      <div className="books__radial" aria-hidden="true" />

      {/* The defining move: a photograph at the top that is wholly gone by
          three-quarters, so the band ends in flat black. */}
      <div className="books__fade" aria-hidden="true" />

      <div className="books__inner reveal">
        <p className="books__label">
          <span className="books__rule" aria-hidden="true" />
          <span className="books__label-text" id="books-label">
            Libros
          </span>
        </p>

        <article className="books__featured">
          <Link
            to={featuredBook.href}
            className="books__featured-cover"
            tabIndex={-1}
            aria-hidden="true"
          >
            <img
              src={featuredBook.cover}
              alt=""
              width="210"
              height="230"
              loading="lazy"
              decoding="async"
            />
          </Link>

          <div className="books__featured-text">
            <p className="books__byline">{featuredBook.byline}</p>

            <h2 className="books__featured-title">{featuredBook.title}</h2>

            <p className="books__blurb">{featuredBook.blurb}</p>

            {/* The cover above is a second route to the same page, so it is
                hidden from screen readers and skipped by Tab — this link is the
                one that carries the book's name. */}
            <Button to={featuredBook.href} className="books__cta">
              Ver libro
              <span className="sr-only"> — {featuredBook.title}</span>
            </Button>
          </div>
        </article>

        <div className="books__shelf">
          {shelfBooks.map((book) => (
            <article className="book" key={book.slug}>
              <Link
                to={book.href}
                className="book__cover"
                tabIndex={-1}
                aria-hidden="true"
              >
                <img
                  src={book.cover}
                  alt=""
                  width="74"
                  height="110"
                  loading="lazy"
                  decoding="async"
                />
              </Link>

              <div className="book__text">
                <h3 className="book__title">{book.title}</h3>

                {/* Guarded because `books` is a shared list and not every
                    entry in it carries a subtitle. Rendering nothing beats an
                    empty element, which would still take its share of the gap
                    and leave the title floating. */}
                {book.subtitle && (
                  <p className="book__subtitle">{book.subtitle}</p>
                )}

                <Button to={book.href} className="books__cta">
                  Ver libro
                  <span className="sr-only"> — {book.title}</span>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BooksBand
