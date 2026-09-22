import { useTheme } from '../../hooks/useTheme.jsx'
import './ThemeToggle.scss'

// Sun and moon drawn as strokes rather than filled shapes, so they take the
// weight of the chevrons and the burger beside them instead of reading as a
// solid blob at this size.
function Sun() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M18.6 5.4L17 7M7 17l-1.6 1.6" />
    </svg>
  )
}

function Moon() {
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
      <path d="M20 14.2A8.2 8.2 0 0 1 9.8 4a8.4 8.4 0 1 0 10.2 10.2z" />
    </svg>
  )
}

function ThemeToggle({ className = '' }) {
  const [theme, toggle] = useTheme()
  const dark = theme === 'dark'

  return (
    <button
      type="button"
      className={['theme-toggle', className].filter(Boolean).join(' ')}
      // The glyph shows where the button goes, not where it is: in the dark it
      // offers a sun. The label says the same thing in words, since a sun on
      // its own could be read either way.
      aria-label={dark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      // Announces the mode as a state rather than only as an action, so a
      // screen reader can say which one is on.
      aria-pressed={dark}
      onClick={toggle}
    >
      {dark ? <Sun /> : <Moon />}
    </button>
  )
}

export default ThemeToggle
