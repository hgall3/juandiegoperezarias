import { Link } from 'react-router-dom'
import './Button.scss'

// One button, three elements. The caller never picks the tag: `to` makes it an
// in-app route link, `href` an external anchor, and neither leaves it a real
// <button>. That keeps a link a link — right-clickable, openable in a new tab —
// instead of a button that navigates by script.
function Button({ to, href, children, className = '', ...rest }) {
  const classes = ['button', className].filter(Boolean).join(' ')

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target="_blank"
        rel="noreferrer"
        {...rest}
      >
        {children}
      </a>
    )
  }

  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}

export default Button
