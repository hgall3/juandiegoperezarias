import { useEffect, useRef, useState } from 'react'

// Reveals an element whenever it is on screen. The caller gets a ref to attach
// and a boolean to turn into a class; the movement itself is the caller's own
// CSS, so each block can arrive in a way that suits it.
//
// Nothing here moves the page or takes an element out of the flow. The section
// keeps its place and simply transitions in where it already sits — the effect
// is the content arriving, not one layer sliding across another.
//
// The observer keeps watching for as long as the element is mounted, and the
// flag tracks whether it is currently in view rather than whether it has ever
// been. That is deliberate: a block that revealed once and then stayed put
// makes the effect feel like it has switched itself off on the way back down.
// It should read the same every time it comes round, not only on first load.

// How far into the window an element must come before it starts. A negative
// bottom margin rather than a threshold on purpose: a threshold is a fraction
// of the element, so a tall band would have to travel much further up the
// window than a short one before firing. This pulls the trigger line to 12%
// above the bottom edge for everything, whatever its height.
const ROOT_MARGIN = '0px 0px -12% 0px'

// Two reasons to show the content outright and never animate it: a reader who
// has asked for less movement, and a browser with no observer to watch with.
// The second matters more than it looks — the CSS starts the block invisible,
// so failing to reveal would leave the page permanently blank rather than
// merely unanimated.
function skipsReveal() {
  return (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

export function useReveal() {
  const ref = useRef(null)
  // Settled at the first render rather than in the effect below, so a block
  // that should not animate is never rendered hidden even for a single frame.
  const [revealed, setRevealed] = useState(skipsReveal)

  useEffect(() => {
    const node = ref.current
    if (!node || skipsReveal()) return

    // Straight from the entry: on screen is revealed, off screen is not. The
    // element only leaves this state once it is out of the window entirely, so
    // the reset is never visible — what you see is a fresh arrival each time.
    const observer = new IntersectionObserver(
      ([entry]) => setRevealed(entry.isIntersecting),
      { rootMargin: ROOT_MARGIN },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return [ref, revealed]
}
