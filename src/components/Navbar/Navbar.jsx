import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { menus } from './navigation.jsx'
import Signature from '../Signature/Signature.jsx'
import ThemeToggle from '../ThemeToggle/ThemeToggle.jsx'
import './Navbar.scss'

// Scroll distances that drive the bar's two behaviours.
const HIDE_AFTER = 80 // px scrolled down before the bar leaves
const SHRINK_AFTER = 40 // px before the signature steps down in size

const COLUMN_ROWS = 3

// Split a list into columns of three that are laid out independently.
//
// One grid with `grid-template-rows: repeat(3, auto)` would be shorter, but its
// rows share a height across every column: a single long entry — Amnesia's
// subtitle, say — makes that row tall everywhere, so the entry beside it drifts
// away from its own neighbours. Chunking first gives each column its own even
// rhythm.
function toColumns(items) {
  const columns = []

  for (let i = 0; i < items.length; i += COLUMN_ROWS) {
    columns.push(items.slice(i, i + COLUMN_ROWS))
  }

  return columns
}

// A panel heading. Where it has a `to` it is the way into that section as well —
// no separate see-all link repeating it underneath.
function PanelHeading({ heading, to, onNavigate }) {
  if (!heading) return null

  if (!to) return <p className="navbar__heading">{heading}</p>

  return (
    <NavLink
      to={to}
      className="navbar__heading navbar__heading--link"
      onClick={onNavigate}
    >
      {heading}
    </NavLink>
  )
}

// One item in a dropdown. Items without a `to` are pages that don't exist yet,
// so they render as text rather than as a link to nowhere.
function PanelItem({ item, onNavigate }) {
  // Titles only. The books carry subtitles, but a menu is for finding your way,
  // not for reading — they belong on the Libros page.
  if (!item.to) {
    return (
      <span className="navbar__item navbar__item--inert">{item.label}</span>
    )
  }

  return (
    <Link to={item.to} className="navbar__item" onClick={onNavigate}>
      {item.label}
    </Link>
  )
}

function Navbar() {
  const [openMenu, setOpenMenu] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openSection, setOpenSection] = useState(null)
  const [hidden, setHidden] = useState(false)
  const [shrunk, setShrunk] = useState(false)

  const headerRef = useRef(null)
  // True only while the bar is on screen because the cursor found the reveal
  // strip. Leaving the bar re-hides it in that case and in no other — otherwise
  // the nav would vanish every time the pointer wandered off the top of a page.
  const revealedByHover = useRef(false)
  const location = useLocation()

  const closeAll = useCallback(() => {
    setOpenMenu(null)
    setMobileOpen(false)
    setOpenSection(null)
  }, [])

  // Close on navigation. Every in-app link already closes on click, but browser
  // back and forward go through no handler of ours. Adjusting state during the
  // render that follows the route change — rather than in an effect — means the
  // menu is never briefly painted open on top of the new page.
  const [lastPath, setLastPath] = useState(location.pathname)

  if (lastPath !== location.pathname) {
    setLastPath(location.pathname)
    setOpenMenu(null)
    setMobileOpen(false)
    setOpenSection(null)
  }

  // Hide on the way down, come back on the way up.
  useEffect(() => {
    let lastY = window.scrollY
    let frame = 0

    const onScroll = () => {
      if (frame) return

      // Scroll fires far faster than the screen repaints; batching into a frame
      // keeps this off the critical path.
      frame = requestAnimationFrame(() => {
        frame = 0
        const y = window.scrollY

        setShrunk(y > SHRINK_AFTER)

        if (y > HIDE_AFTER && y > lastY) {
          setHidden(true)
          setOpenMenu(null)
          revealedByHover.current = false
        } else if (y < lastY) {
          setHidden(false)
          revealedByHover.current = false
        }

        lastY = y
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])

  // Escape closes whatever is open.
  useEffect(() => {
    if (!openMenu && !mobileOpen) return

    const onKeyDown = (event) => {
      if (event.key === 'Escape') closeAll()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openMenu, mobileOpen, closeAll])

  // A press anywhere outside the header closes the open panel. pointerdown
  // rather than click, so the panel is gone before the press completes.
  useEffect(() => {
    if (!openMenu) return

    const onPointerDown = (event) => {
      if (!headerRef.current?.contains(event.target)) setOpenMenu(null)
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [openMenu])

  // Stop the page behind the full-screen mobile panel from scrolling.
  useEffect(() => {
    if (!mobileOpen) return

    document.body.classList.add('is-menu-open')
    return () => document.body.classList.remove('is-menu-open')
  }, [mobileOpen])

  const activeMenu = menus.find((menu) => menu.id === openMenu)

  return (
    <>
      {/* An invisible strip along the top edge. Only mounted while the bar is
          away, so it can never swallow a click meant for the page. */}
      {hidden && !mobileOpen && (
        <div
          className="navbar__reveal"
          aria-hidden="true"
          onMouseEnter={() => {
            revealedByHover.current = true
            setHidden(false)
          }}
        />
      )}

      <header
        ref={headerRef}
        className={`navbar${hidden ? ' is-hidden' : ''}${shrunk ? ' is-shrunk' : ''}`}
        onMouseLeave={() => {
          // Only undo a hover-reveal, and never while a panel is open — the
          // pointer has to be able to leave on its way to the page.
          if (revealedByHover.current && !openMenu) {
            revealedByHover.current = false
            setHidden(true)
          }
        }}
      >
        <div className="navbar__bar">
          <Link to="/" className="navbar__brand" onClick={closeAll}>
            <Signature className="navbar__signature" />
          </Link>

          <nav className="navbar__nav" aria-label="Principal">
            {menus.map((menu) => (
              <button
                key={menu.id}
                type="button"
                className={`navbar__trigger${openMenu === menu.id ? ' is-open' : ''}`}
                aria-expanded={openMenu === menu.id}
                aria-controls={`nav-panel-${menu.id}`}
                onClick={() =>
                  setOpenMenu((current) =>
                    current === menu.id ? null : menu.id,
                  )
                }
              >
                {menu.label}
                <span className="navbar__caret" aria-hidden="true">
                  ▾
                </span>
              </button>
            ))}
          </nav>

          {/* Grouped so both sit at the right-hand end. The burger is the
              phone's control and disappears on a desktop; the toggle stays at
              every width, which is why it is last — the corner is its place
              whether or not there is a burger beside it. */}
          <div className="navbar__actions">
            <ThemeToggle className="navbar__theme" />

            <button
              type="button"
              className="navbar__burger"
              aria-expanded={mobileOpen}
              aria-controls="nav-mobile"
              onClick={() => setMobileOpen((open) => !open)}
            >
              <span className="navbar__stroke" aria-hidden="true" />
              <span className="navbar__stroke" aria-hidden="true" />
              <span className="sr-only">Abrir menú</span>
            </button>
          </div>
        </div>

        {/* Inside the header on purpose: as a sibling it would sit outside the
            hover region, and moving the pointer into it would read as leaving
            the bar. */}
        {activeMenu && (
          <div
            id={`nav-panel-${activeMenu.id}`}
            role="region"
            aria-label={activeMenu.label}
            className="navbar__panel"
          >
            <div className="navbar__content">
              {activeMenu.layout === 'columns' ? (
                <div className="navbar__columns">
                  {activeMenu.groups.map((group) => (
                    <div key={group.heading} className="navbar__group">
                      <PanelHeading
                        heading={group.heading}
                        to={group.to}
                        onNavigate={closeAll}
                      />

                      {group.items && (
                        <div className="navbar__column">
                          {group.items.map((item) => (
                            <PanelItem
                              key={item.label}
                              item={item}
                              onNavigate={closeAll}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="navbar__group">
                  <PanelHeading
                    heading={activeMenu.featured.heading}
                    to={activeMenu.featured.to}
                    onNavigate={closeAll}
                  />

                  <div className="navbar__columns">
                    {toColumns(activeMenu.featured.items).map((column) => (
                      <div key={column[0].label} className="navbar__column">
                        {column.map((item) => (
                          <PanelItem
                            key={item.label}
                            item={item}
                            onNavigate={closeAll}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {mobileOpen && (
        <div id="nav-mobile" className="navbar__mobile">
          <div className="navbar__mobile-head">
            <button
              type="button"
              className="navbar__close"
              onClick={() => setMobileOpen(false)}
            >
              <span aria-hidden="true">✕</span>
              <span className="sr-only">Cerrar menú</span>
            </button>
          </div>

          {/* Heads the panel, above the sections. Still a link: with Inicio
              absent from the menu, this is the only way home from here. */}
          <Link to="/" className="navbar__mobile-mark" onClick={closeAll}>
            <Signature className="navbar__mark" />
          </Link>

          <nav className="navbar__mobile-nav" aria-label="Principal">
            {menus.map((menu) => {
              const expanded = openSection === menu.id

              return (
                <div key={menu.id} className="navbar__accordion">
                  <button
                    type="button"
                    className="navbar__accordion-trigger"
                    aria-expanded={expanded}
                    aria-controls={`nav-section-${menu.id}`}
                    onClick={() =>
                      setOpenSection((current) =>
                        current === menu.id ? null : menu.id,
                      )
                    }
                  >
                    {menu.label}
                  </button>

                  {expanded && (
                    <div id={`nav-section-${menu.id}`} className="navbar__sub">
                      {menu.layout === 'columns'
                        ? // On mobile a group is one link to its section page,
                          // not a second thing to expand. The titles inside it
                          // live on that page, which is where tapping it goes.
                          menu.groups.map((group) => (
                            <Link
                              key={group.heading}
                              to={group.to}
                              className="navbar__item"
                              onClick={closeAll}
                            >
                              <span>{group.heading}</span>
                            </Link>
                          ))
                        : menu.featured.items.map((item) => (
                            <PanelItem
                              key={item.label}
                              item={item}
                              onNavigate={closeAll}
                            />
                          ))}

                      {/* Kept below the full list: every entry above it is a
                          page that doesn't exist yet, so this is the only thing
                          in the section a visitor can actually follow. */}
                      {menu.layout === 'featured' && menu.featured.to && (
                        <Link
                          to={menu.featured.to}
                          className="navbar__item navbar__item--all"
                          onClick={closeAll}
                        >
                          <span>{menu.featured.heading}</span>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

        </div>
      )}
    </>
  )
}

export default Navbar
