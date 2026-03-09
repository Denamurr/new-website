'use client'

import { useState, useMemo, useRef, useEffect, Fragment } from 'react'

const CATEGORIES = {
  model_release:  { label: 'Models',   color: '#6366f1' },
  product_launch: { label: 'Products', color: '#0891b2' },
}

const ITEM_GAP = 160   // px between events
const PADDING  = 120   // px left/right padding

function formatDate(str) {
  const [y, m] = str.split('-').map(Number)
  return new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

function safeHostname(url) {
  try { return new URL(url).hostname.replace(/^www\./, '') }
  catch { return '' }
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

  // Evenly-spaced layout
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

  // Scroll to most recent on load
  useEffect(() => {
    const wrap = wrapRef.current
    if (wrap) wrap.scrollLeft = wrap.scrollWidth
  }, [items.length])

  // Drag + wheel
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

  return (
    <div className="bg-white">

      {/* Intro */}
      <div className="px-8 pt-10 pb-8 border-b border-gray-100">
        <div className="max-w-2xl">
          <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Timeline</p>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-3">
            The Timeline of AI Breakthroughs
          </h1>
          <p className="text-[15px] text-gray-500 leading-relaxed">
            AI has been advancing at a pace that&apos;s hard to follow. To make sense of it, I designed this
            interactive timeline showing the major milestones that pushed AI into the mainstream. It starts
            with a research paper, moves on to model releases and finally to the products that brought them
            to millions of users.
          </p>
        </div>
      </div>

      {/* Topbar */}
      <div className="flex items-center justify-between px-8 py-3 gap-4 border-b border-gray-100">
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setActiveCategory('all')}
            className={`text-[13px] px-2.5 py-1 rounded transition-colors ${
              activeCategory === 'all' ? 'text-gray-900 bg-gray-100' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            All
          </button>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(activeCategory === key ? 'all' : key)}
              className={`flex items-center gap-1.5 text-[13px] px-2.5 py-1 rounded transition-colors ${
                activeCategory === key ? 'text-gray-900 bg-gray-100' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cat.color }} />
              {cat.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          placeholder="Search…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border-0 border-b border-gray-200 pb-0.5 text-[13px] w-40 outline-none text-gray-900 placeholder-gray-300 bg-transparent focus:border-gray-500 transition-colors"
        />
      </div>

      {/* Timeline — relative wrapper enables edge fade overlays */}
      <div className="relative">
        {/* Left fade */}
        <div
          className="absolute inset-y-0 left-0 w-24 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to right, white 40%, transparent)' }}
        />
        {/* Right fade */}
        <div
          className="absolute inset-y-0 right-0 w-24 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to left, white 40%, transparent)' }}
        />

        <div
          ref={wrapRef}
          className="timeline-scroll overflow-x-auto overflow-y-hidden select-none"
          style={{ cursor: 'grab', scrollbarWidth: 'none', msOverflowStyle: 'none', height: 460 }}
        >
          {filtered.length === 0 ? (
            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm text-gray-300">
              No entries match your filter.
            </p>
          ) : (
            <div className="relative" style={{ width: totalWidth, height: '100%' }}>

              {/* Axis */}
              <div
                className="absolute top-1/2 bg-gray-200"
                style={{ left: 0, right: 0, height: 1, transform: 'translateY(-50%)' }}
              />

              {/* Events */}
              {items.map(entry => {
                const cat    = CATEGORIES[entry.category] || CATEGORIES.model_release
                const domain = safeHostname(entry.url)
                const src    = domain || entry.source || ''

                return (
                  <Fragment key={entry.id}>
                    {/* Diamond */}
                    <div
                      className="absolute rounded-sm"
                      style={{
                        left:      entry.x,
                        top:       '50%',
                        width:     10,
                        height:    10,
                        transform: 'translateX(-50%) translateY(-50%) rotate(45deg)',
                        background: cat.color,
                      }}
                    />

                    {/* Card */}
                    <div
                      className="absolute flex flex-col"
                      style={{
                        left:  entry.x,
                        width: 168,
                        transform: 'translateX(-50%)',
                        textAlign: 'justify',
                        ...(entry.side === 'above'
                          ? { bottom: '50%', paddingBottom: 30 }
                          : { top: '50%',    paddingTop:    30 }),
                      }}
                    >
                      {/* Connector */}
                      <div
                        className="absolute bg-gray-200"
                        style={{
                          width: 1,
                          height: 22,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          ...(entry.side === 'above' ? { bottom: 8 } : { top: 8 }),
                        }}
                      />
                      <a
                        href={entry.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[12.5px] font-medium text-gray-700 leading-snug hover:text-gray-900 transition-colors"
                        onClick={e => e.stopPropagation()}
                      >
                        {entry.title}
                      </a>
                      <span className="text-[11px] text-gray-300 mt-1.5 whitespace-nowrap">
                        {formatDate(entry.date)}
                      </span>
                      {src && (
                        <span
                          className="text-[11px] text-gray-300 mt-0.5"
                          style={{ maxWidth: 148, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        >
                          {src}
                        </span>
                      )}
                    </div>
                  </Fragment>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer bar */}
      <div className="px-8 py-3 border-t border-gray-100 flex items-center justify-between gap-4">
        <p className="text-xs text-gray-400">
          Built as an interactive visualization using React and a small dataset of model and product milestones.
        </p>
        {showHint && (
          <span className="text-xs text-gray-300 shrink-0">scroll or drag →</span>
        )}
      </div>

    </div>
  )
}
