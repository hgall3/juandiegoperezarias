import { useEffect, useRef, useState } from 'react'

// Reveals an element the first time it is scrolled into view. The caller gets a
// ref to attach and a boolean to turn into a class; the movement itself is the
// caller's own CSS, so each block can arrive in a way that suits it.
//
// Nothing here moves the page or takes an element out of the flow. The section
// keeps its place and simply transitions in where it already sits — the effect
// is the content arriving, not one layer sliding across another.
//
// A section that scrolled back out of view does NOT hide again. Replaying the
// entrance every time it passes would draw attention to the mechanism, which is
// exactly what a quiet reveal is trying not to do.

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
    // Already arrived — either it was never going to animate, or it has been
    // seen and the observer has done its job.
    if (!node || revealed) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setRevealed(true)
      },
      { rootMargin: ROOT_MARGIN },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [revealed])

  return [ref, revealed]
}
