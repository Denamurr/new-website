'use client'

import { useEffect, useRef } from 'react'

export default function ReadingProgress({ color }) {
  const barRef = useRef(null)

  useEffect(() => {
    function onScroll() {
      const h = document.documentElement
      const max = h.scrollHeight - h.clientHeight
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0
      if (barRef.current) barRef.current.style.width = pct + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={barRef}
      style={{
        position: 'fixed', top: 0, left: 0, height: 4,
        width: '0%', background: color, zIndex: 60,
        transition: 'width 0.08s linear', pointerEvents: 'none'
      }}
    />
  )
}
