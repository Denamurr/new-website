'use client'

import { useState, useMemo, useRef, useEffect, Fragment } from 'react'

const CATEGORIES = {
  model_release:  { label: 'Models',   color: '#6366f1' },
  product_launch: { label: 'Products', color: '#0891b2' },
}

const ITEM_GAP   = 100   // px between events
const PADDING    = 200   // px left/right padding
const CARD_WIDTH = 160   // px card width
const CIRCLE_R   = 6     // axis diamond half-size
const DOT_R      = 3     // card-end dot radius
const CONNECTOR  = 28    // connector line height

function formatDate(str) {
  const [y, m] = str.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function cleanTitle(title) {
  return title.replace(/\s*—\s*/g, ', ')
}

export default function TimelineClient({ entries }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery]       = useState('')
  const [showHint, setShowHint]             = useState(true)
  const wrapRef     = useRef(null)
  const isDragging  = useRef(false)
  const startX      = useRef(0)
  const scrollStart = useRef(0)

  const filtered = useMemo(() => {
    return entries.filter(e => {
      if (activeCategory !== 'all' && e.category !== activeCategory) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return (
          e.title.toLowerCase().includes(q) ||
          (e.description || '').toLowerCase().includes(q) ||
          (e.source || '').toLowerCase().includes(q) ||
          (e.tags || []).some(t => t.toLowerCase().includes(q))
        )
      }
      return true
    })
  }, [entries, activeCategory, searchQuery])

  const { items, totalWidth } = useMemo(() => {
    if (filtered.length === 0) return { items: [], totalWidth: 800 }
    const sorted = [...filtered].sort((a, b) => a.date.localeCompare(b.date))
    const items = sorted.map((entry, i) => ({
      ...entry,
      x:    PADDING + i * ITEM_GAP,
      side: i % 2 === 0 ? 'above' : 'below',
    }))
    const totalWidth = PADDING * 2 + (sorted.length - 1) * ITEM_GAP
    return { items, totalWidth }
  }, [filtered])

  useEffect(() => {
    const wrap = wrapRef.current
    if (wrap) wrap.scrollLeft = wrap.scrollWidth
  }, [items.length])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return

    const onMouseDown = e => {
      if (e.button !== 0) return
      isDragging.current  = true
      startX.current      = e.clientX
      scrollStart.current = wrap.scrollLeft
      wrap.style.cursor   = 'grabbing'
      e.preventDefault()
    }
    const onMouseMove = e => {
      if (!isDragging.current) return
      wrap.scrollLeft = scrollStart.current - (e.clientX - startX.current)
    }
    const onMouseUp = () => {
      isDragging.current = false
      wrap.style.cursor  = 'grab'
    }
    const onWheel = e => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
      e.preventDefault()
      wrap.scrollLeft += e.deltaY
    }
    const onScroll = () => setShowHint(false)

    wrap.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    wrap.addEventListener('wheel', onWheel, { passive: false })
    wrap.addEventListener('scroll', onScroll, { once: true })

    return () => {
      wrap.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      wrap.removeEventListener('wheel', onWheel)
    }
  }, [])

  const btnBase = {
    fontFamily: '"Inter", sans-serif', fontSize: 13, padding: '5px 12px',
    borderRadius: 999, border: 'none', cursor: 'pointer',
    display: 'flex', alignItems: 'center', gap: 6, background: 'transparent',
  }

  return (
    <div style={{ background: '#fff' }}>

      {/* Intro */}
      <div style={{ padding: '32px 40px 28px', borderBottom: '1px solid #f0f0f0' }}>
        <span style={{
          display: 'inline-block', fontFamily: '"Inter", sans-serif',
          fontSize: 12, fontWeight: 600, letterSpacing: '0.12em',
          textTransform: 'uppercase', color: '#fff',
          background: '#8b5cf6', padding: '5px 12px', borderRadius: 999, marginBottom: 18
        }}>AI</span>
        <h1 style={{
          fontFamily: '"Anton", sans-serif', fontWeight: 400,
          fontSize: 'clamp(32px, 4vw, 56px)', lineHeight: 0.96,
          letterSpacing: '-0.015em', margin: '0 0 18px', color: 'var(--ink)'
        }}>
          The Timeline of AI Breakthroughs
        </h1>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 15, lineHeight: 1.65, color: '#555', maxWidth: 600, margin: '0 0 12px' }}>
          AI has been advancing at a pace that&apos;s hard to follow. This timeline tracks the milestones — the model releases and products that genuinely moved things forward. First launches only, curated by hand. Drag or scroll to explore.
        </p>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, lineHeight: 1.6, color: '#aaa', maxWidth: 600, margin: 0 }}>
          For a more comprehensive history,{' '}
          <a href="https://nhlocal.github.io/AiTimeline/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ink)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
            see this full AI timeline ↗
          </a>
        </p>
      </div>

      {/* Filter + Search bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 40px', borderBottom: '1px solid #f0f0f0', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              ...btnBase,
              background: activeCategory === 'all' ? 'var(--ink)' : 'transparent',
              color: activeCategory === 'all' ? '#fff' : '#999',
            }}
          >
            All
          </button>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(activeCategory === key ? 'all' : key)}
              style={{
                ...btnBase,
                background: activeCategory === key ? 'var(--ink)' : 'transparent',
                color: activeCategory === key ? '#fff' : '#999',
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
              {cat.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{
            fontFamily: '"Inter", sans-serif', fontSize: 13, width: 160,
            border: 'none', borderBottom: '1px solid #e5e7eb', outline: 'none',
            background: 'transparent', color: 'var(--ink)', paddingBottom: 3,
          }}
        />
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 80, pointerEvents: 'none', zIndex: 10, background: 'linear-gradient(to right, #fff 40%, transparent)' }} />
        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 80, pointerEvents: 'none', zIndex: 10, background: 'linear-gradient(to left, #fff 40%, transparent)' }} />

        <div
          ref={wrapRef}
          className="timeline-scroll"
          style={{ overflowX: 'auto', overflowY: 'hidden', userSelect: 'none', cursor: 'grab', scrollbarWidth: 'none', msOverflowStyle: 'none', height: 440 }}
        >
          {filtered.length === 0 ? (
            <p style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: '"Inter", sans-serif', fontSize: 14, color: '#ccc' }}>
              No entries match your filter.
            </p>
          ) : (
            <div style={{ position: 'relative', width: totalWidth, height: '100%' }}>

              {/* Axis line */}
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: '#e5e7eb', transform: 'translateY(-50%)' }} />

              {items.map(entry => {
                const cat     = CATEGORIES[entry.category] || CATEGORIES.model_release
                const isAbove = entry.side === 'above'

                const cardText = (
                  <div style={{ width: '100%' }}>
                    <a
                      href={entry.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block', fontFamily: '"Inter", sans-serif', fontSize: 12.5, fontWeight: 600, color: '#1a1a1a', lineHeight: 1.35, textDecoration: 'none' }}
                      onClick={e => e.stopPropagation()}
                    >
                      {cleanTitle(entry.title)}
                    </a>
                  </div>
                )

                const dateLabel = (
                  <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 10, fontWeight: 500, color: '#bbb', whiteSpace: 'nowrap' }}>
                    {formatDate(entry.date)}
                  </span>
                )

                const endDot = (
                  <div style={{ width: DOT_R * 2, height: DOT_R * 2, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
                )

                const connector = (
                  <div style={{ width: 1, height: CONNECTOR, background: '#e5e7eb', flexShrink: 0 }} />
                )

                return (
                  <Fragment key={entry.id}>
                    {/* Axis diamond */}
                    <div
                      style={{
                        position: 'absolute',
                        left: entry.x, top: '50%',
                        width: CIRCLE_R * 2, height: CIRCLE_R * 2,
                        transform: 'translateX(-50%) translateY(-50%) rotate(45deg)',
                        background: cat.color, zIndex: 1,
                      }}
                    />

                    {/* Card */}
                    <div
                      style={{
                        position: 'absolute', left: entry.x, width: CARD_WIDTH,
                        transform: 'translateX(-50%)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        ...(isAbove
                          ? { bottom: `calc(50% + ${CIRCLE_R}px)` }
                          : { top:    `calc(50% + ${CIRCLE_R}px)` }),
                      }}
                    >
                      {isAbove ? (
                        <>
                          {cardText}
                          <div style={{ marginTop: 8 }}>{endDot}</div>
                          {connector}
                          <div style={{ marginTop: 6, marginBottom: 4 }}>{dateLabel}</div>
                        </>
                      ) : (
                        <>
                          <div style={{ marginTop: 4, marginBottom: 6 }}>{dateLabel}</div>
                          {connector}
                          <div style={{ marginBottom: 8 }}>{endDot}</div>
                          {cardText}
                        </>
                      )}
                    </div>
                  </Fragment>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '10px 40px', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <p style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#bbb', margin: 0 }}>
          Models and products only · curated by hand · {entries.length} entries
        </p>
        {showHint && (
          <span style={{ fontFamily: '"Inter", sans-serif', fontSize: 12, color: '#ccc', flexShrink: 0 }}>scroll or drag →</span>
        )}
      </div>

    </div>
  )
}
