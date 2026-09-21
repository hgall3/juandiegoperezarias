import { Link } from 'react-router-dom'
import { useReveal } from '../../hooks/useReveal.jsx'
import './Feature.scss'

// One featured band: a photograph beside a piece of writing.
//
// `reversed` swaps the two sides. The markup does not change with it — the
// photograph is always first in the source, so it leads on a phone, where the
// band stacks — only which grid column each one lands in. That keeps the
// reading order the same for a screen reader whichever way the band faces.
function Feature({ item, reversed = false }) {
  const { src, srcSet, alt, breadcrumb, title, text, action } = item
  // The band rises into place whenever it is scrolled to, every time round.
  // The class is all this adds — the movement is in Feature.scss.
  const [ref, revealed] = useReveal()

  return (
    <section
      ref={ref}
      className={`feature${reversed ? ' feature--reversed' : ''}${
        revealed ? ' is-revealed' : ''
      }`}
      aria-labelledby={`feature-${item.id}`}
    >
      {/* Below the fold on every screen, so it is never part of the first
          paint. width and height are the file's own, which reserves the right
          space before it arrives and stops the text jumping. */}
      <img
        className="feature__image"
        src={src}
        srcSet={srcSet}
        sizes="(min-width: 1024px) 57vw, 100vw"
        alt={alt}
        width="1500"
        height="1000"
        loading="lazy"
        decoding="async"
      />

      <div className="feature__text">
        <p className="feature__breadcrumb">{breadcrumb}</p>

        <h2 className="feature__title" id={`feature-${item.id}`}>
          {title}
        </h2>

        <p className="feature__body text-small">{text}</p>

        {action?.to && (
          <Link to={action.to} className="feature__cta">
            {action.label}
          </Link>
        )}
      </div>
    </section>
  )
}

export default Feature
