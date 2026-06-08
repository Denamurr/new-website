'use client'

import { useEffect, useRef } from 'react'

const HERO_SCROLL_VH = 130
const P1_END = 0.08
const P2_END = 0.45
const IMG_ASPECT = 1122 / 1402

const easeOutCubic = x => 1 - Math.pow(1 - x, 3)
const easeInOutCubic = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
const lerp = (a, b, t) => a + (b - a) * t
const clamp01 = x => Math.min(1, Math.max(0, x))

export default function HeroClient() {
  const bleedRef = useRef(null)
  const wrapRef = useRef(null)
  const wordmarkRef = useRef(null)
  const outlineRef = useRef(null)
  const scrollHintRef = useRef(null)
  const bigRef = useRef(null)

  function layoutBigWordmark() {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const fontPx = Math.min(vw * 0.215, 360)
    const wm = wordmarkRef.current
    const out = outlineRef.current
    wm.style.fontSize = fontPx + 'px'
    out.style.fontSize = fontPx + 'px'
    const rect = wm.getBoundingClientRect()
    return { vw, vh, fontPx, w: rect.width, h: rect.height }
  }

  function render() {
    const bleed = bleedRef.current
    const wrap = wrapRef.current
    const wordmark = wordmarkRef.current
    const outline = outlineRef.current
    const hint = scrollHintRef.current
    if (!bleed || !wrap || !wordmark || !outline) return

    if (!bigRef.current) bigRef.current = layoutBigWordmark()
    const { vw, vh, w, h, fontPx } = bigRef.current

    const spacerPx = (HERO_SCROLL_VH / 100) * window.innerHeight
    const p = clamp01(window.scrollY / spacerPx)
    const textFade = clamp01(p / P1_END)
    const collapse = clamp01((p - P1_END) / (P2_END - P1_END))
    const pin = clamp01((p - P2_END) / (1 - P2_END))

    // Layer A: full-bleed fades out
    bleed.style.opacity = String(1 - easeInOutCubic(collapse))

    // Layer B: wordmark transform
    const s = lerp(1, 22 / fontPx, easeOutCubic(pin))
    const x = lerp((vw - w) / 2, 28, easeOutCubic(pin))
    const y = lerp((vh - h) / 2, 24, easeOutCubic(pin))
    wrap.style.transform = `translate(${x}px, ${y}px) scale(${s})`

    // Background size/position interpolation (viewport-locked -> self-cover)
    const t = easeInOutCubic(collapse)
    let vpW, vpH
    if (vw / vh > IMG_ASPECT) { vpW = vw; vpH = vw / IMG_ASPECT }
    else { vpH = vh; vpW = vh * IMG_ASPECT }
    let selfW, selfH
    if (w / h > IMG_ASPECT) { selfW = w * 1.5; selfH = (w * 1.5) / IMG_ASPECT }
    else { selfH = h * 1.5; selfW = (h * 1.5) * IMG_ASPECT }
    const curBgW = lerp(vpW, selfW, t)
    const curBgH = lerp(vpH, selfH, t)
    // character sits at ~55% horizontal in illustration — shift left so it spans both words
    const posX = vw / 2 - x - curBgW * 0.62
    const posY = vh * 0.38 - curBgH * 0.38 - y

    wordmark.style.backgroundSize = `${curBgW}px ${curBgH}px`
    wordmark.style.backgroundPosition = `${posX}px ${posY}px`
    wordmark.style.opacity = String(easeInOutCubic(collapse))

    // Cream background on wrap once pinned, so scrolled content doesn't bleed through
    wrap.style.background = pin > 0 ? `rgba(247,242,234,${easeOutCubic(pin)})` : ''
    wrap.style.borderRadius = '4px'
    wrap.style.padding = pin > 0 ? '4px 8px' : '0'

    // Outline
    const outOp = textFade * (1 - easeOutCubic(pin) * 0.85)
    outline.style.opacity = String(outOp)
    outline.style.setProperty('--stroke', Math.max(1, fontPx * 0.012) + 'px')

    // Scroll hint
    if (hint) hint.style.opacity = String(clamp01(1 - p * 6))
  }

  function rebuild() {
    bigRef.current = null
    render()
  }

  useEffect(() => {
    const wm = wordmarkRef.current
    if (wm) {
      wm.style.backgroundImage = 'url(/dena-illustration.png)'
    }

    const ready = () => rebuild()
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(ready)
    const bleed = bleedRef.current
    if (bleed) {
      if (bleed.complete) ready()
      else bleed.addEventListener('load', ready)
    }
    rebuild()

    window.addEventListener('scroll', render, { passive: true })
    window.addEventListener('resize', rebuild)
    return () => {
      window.removeEventListener('scroll', render)
      window.removeEventListener('resize', rebuild)
    }
  }, [])

  return (
    <>
      {/* hero spacer creates scroll distance */}
      <div style={{ height: `${HERO_SCROLL_VH}vh` }} />

      {/* fixed full-viewport stage */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 30,
        pointerEvents: 'none', overflow: 'hidden'
      }}>
        {/* Layer A: full-bleed illustration */}
        <img
          ref={bleedRef}
          src="/dena-illustration.png"
          alt="Illustration of Dena at her desk"
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 38%',
            willChange: 'opacity'
          }}
        />

        {/* Layer B: wordmark */}
        <div
          ref={wrapRef}
          style={{
            position: 'absolute', left: 0, top: 0,
            transformOrigin: 'top left', willChange: 'transform'
          }}
        >
          <h1
            ref={wordmarkRef}
            className="wordmark"
            style={{ opacity: 0 }}
          >
            DENA MURR
          </h1>
          <h1
            ref={outlineRef}
            className="wordmark-outline"
            aria-hidden="true"
            style={{ opacity: 0 }}
          >
            DENA MURR
          </h1>
        </div>
      </div>

      {/* scroll hint */}
      <div
        ref={scrollHintRef}
        style={{
          position: 'fixed', bottom: 30, left: '50%', transform: 'translateX(-50%)',
          fontFamily: '"Inter", sans-serif', fontSize: 12, letterSpacing: '0.2em',
          textTransform: 'uppercase', color: 'var(--ink)', zIndex: 35,
          transition: 'opacity 0.4s ease', pointerEvents: 'none'
        }}
      >
        Scroll
        <style>{`
          @keyframes dropline {
            0%,100% { transform: scaleY(0.2); opacity: 0.2 }
            50% { transform: scaleY(1); opacity: 1 }
          }
        `}</style>
        <div style={{
          width: 1, height: 30, margin: '12px auto 0',
          background: 'currentColor',
          animation: 'dropline 1.8s ease-in-out infinite',
          transformOrigin: 'top'
        }} />
      </div>
    </>
  )
}
