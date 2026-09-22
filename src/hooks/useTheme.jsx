import { useCallback, useEffect, useState } from 'react'

// The light/dark mode, and the one way to change it.
//
// The decision itself is not made here. A script in index.html makes it before
// the first paint — it has to, or the page would flash the wrong mode — and
// this reads back what that script settled on. Deciding twice is how the two
// would come to disagree.
//
// What this owns is the change: flipping the mode, remembering that the visitor
// chose, and following the browser for as long as they have not.

const STORAGE_KEY = 'theme'

// Storage throws in a private window and where site data is blocked. A visitor
// whose choice cannot be remembered should still get a working toggle, so every
// access is guarded and failure simply means "nothing chosen".
function storedChoice() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'dark' || value === 'light' ? value : null
  } catch {
    return null
  }
}

function remember(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // Nothing to do: the mode still applies for this visit.
  }
}

export function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || 'light',
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  // Follow the browser while it is still the thing deciding. Once the visitor
  // has used the toggle, their choice outranks it and the system changing
  // underneath them must not undo it.
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')

    const onChange = (event) => {
      if (storedChoice()) return
      setTheme(event.matches ? 'dark' : 'light')
    }

    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      remember(next)
      return next
    })
  }, [])

  return [theme, toggle]
}
