import { FaLinkedinIn, FaYoutube } from 'react-icons/fa'
import { email, phone, location, socials } from '../../content/contact.jsx'
import './Footer.scss'

// Which mark stands for each account. This is a display decision, so it stays
// in the component: content/contact.jsx only knows the account's name and URL.
const icons = {
  LinkedIn: FaLinkedinIn,
  YouTube: FaYoutube,
}

// The same rule the navbar follows: an entry with a `to` is a link, one without
// renders as plain text. Neither page exists yet, and a footer link that lands
// on a 404 is worse than a label. Building them later means adding `to`.
const legal = [{ label: 'Aviso legal' }, { label: 'Privacidad' }]

// A phone dials the digits, so the href drops the spaces the number is written
// with. The visible text keeps them.
const dial = phone.replace(/\s/g, '')

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__inner">
          <section className="footer__block">
            <h2 className="footer__label text-small">Contacto</h2>

            <ul className="footer__list">
              <li>
                <a className="footer__line text-small" href={`mailto:${email}`}>
                  {email}
                </a>
              </li>
              <li>
                <a className="footer__line text-small" href={`tel:${dial}`}>
                  {phone}
                </a>
              </li>
              <li className="footer__place text-small">{location}</li>
            </ul>
          </section>

          <section className="footer__block footer__block--social">
            <ul className="footer__socials" aria-label="Redes sociales">
              {socials.map(({ name, url }) => {
                const Icon = icons[name]

                return (
                  <li key={name}>
                    <a
                      className="footer__social"
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {/* The icon carries no text, so it is hidden from screen
                          readers and the .sr-only label is what gets announced. */}
                      <Icon aria-hidden="true" />
                      <span className="sr-only">
                        {name} (se abre en una pestaña nueva)
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </section>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__inner">
          {/* The year is read from the clock rather than typed, so it can't be
              left showing one that has already passed. */}
          <p className="footer__legal text-xs">
            © {new Date().getFullYear()} Juan Diego Perez Arias · Todos los
            derechos reservados
          </p>

          <ul className="footer__legal-links">
            {legal.map(({ label }) => (
              <li key={label} className="footer__legal text-xs">
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export default Footer
