'use client'

import { useState, useMemo } from 'react'

const CATEGORY_STYLE = {
  model_release:  { dot: '#6366f1', badge: 'bg-indigo-50 text-indigo-700',  filter: 'bg-indigo-600 text-white',  label: 'Models'  },
  research_paper: { dot: '#16a34a', badge: 'bg-green-50 text-green-700',    filter: 'bg-green-600 text-white',   label: 'Papers'  },
  announcement:   { dot: '#ea580c', badge: 'bg-orange-50 text-orange-700',  filter: 'bg-orange-600 text-white',  label: 'News'    },
  product_launch: { dot: '#0891b2', badge: 'bg-cyan-50 text-cyan-700',      filter: 'bg-cyan-600 text-white',    label: 'Products'},
}

// Default: models, news, products visible — papers hidden
const DEFAULT_SELECTED = new Set(['model_release', 'announcement', 'product_launch'])

function formatDate(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

function EntryCard({ entry }) {
  const style = CATEGORY_STYLE[entry.category] || CATEGORY_STYLE.announcement
  return (
    <div>
      <div className="flex items-baseline gap-2 flex-wrap">
        <a
          href={entry.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors leading-snug"
        >
          {entry.title}
        </a>
        <span className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded ${style.badge}`}>
          {style.label}
        </span>
      </div>
      {entry.description && (
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">{entry.description}</p>
      )}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
        {entry.source && (
          <a
            href={entry.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 hover:text-blue-500 transition-colors"
          >
            {entry.source}
          </a>
        )}
        {(entry.tags || []).map(tag => (
          <span key={tag} className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function TimelineClient({ entries }) {
  const [selected, setSelected] = useState(DEFAULT_SELECTED)
  const [searchQuery, setSearchQuery] = useState('')

  function toggle(category) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(category) ? next.delete(category) : next.add(category)
      return next
    })
  }

  const filtered = useMemo(() => {
    return entries.filter(e => {
      if (!selected.has(e.category)) return false
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
  }, [entries, selected, searchQuery])

  const byDate = useMemo(() => {
    const map = {}
    for (const e of filtered) {
      if (!map[e.date]) map[e.date] = []
      map[e.date].push(e)
    }
    return Object.entries(map).sort(([a], [b]) => b.localeCompare(a))
  }, [filtered])

  const dateRange = useMemo(() => {
    if (entries.length === 0) return ''
    const dates = entries.map(e => e.date).sort()
    return `${formatDate(dates[0])} – ${formatDate(dates[dates.length - 1])}`
  }, [entries])

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Timeline</h1>
        <p className="text-gray-500 text-sm mt-1">
          {entries.length} entries · {dateRange}
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-12">
        <input
          type="search"
          placeholder="Search entries..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-400 bg-white"
        />
        <div className="flex gap-2 flex-wrap">
          {Object.entries(CATEGORY_STYLE).map(([key, style]) => {
            const active = selected.has(key)
            return (
              <button
                key={key}
                onClick={() => toggle(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition-colors ${
                  active
                    ? `${style.filter} border-transparent`
                    : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                }`}
              >
                {/* Checkbox indicator */}
                <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center shrink-0 transition-colors ${
                  active ? 'bg-white/25 border-white/50' : 'border-gray-300 bg-white'
                }`}>
                  {active && (
                    <svg width="8" height="7" viewBox="0 0 8 7" fill="none">
                      <path d="M1 3.5L3 5.5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </span>
                {style.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Timeline */}
      {byDate.length === 0 ? (
        <p className="text-sm text-gray-500">No entries match your filter.</p>
      ) : (
        <div className="relative">
          {/* Center line — desktop only */}
          <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-gray-200" />

          <div className="space-y-12">
            {byDate.map(([date, items], i) => {
              const isLeft = i % 2 === 0
              const dotColor = CATEGORY_STYLE[items[0]?.category]?.dot || '#9ca3af'

              return (
                <div key={date}>
                  {/* ── Mobile: left-border list ── */}
                  <div className="sm:hidden pl-5 border-l border-gray-200 relative">
                    <span
                      className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white"
                      style={{ background: dotColor }}
                    />
                    <p className="text-xs text-gray-400 mb-3">{formatDate(date)}</p>
                    <div className="space-y-5">
                      {items.map(entry => <EntryCard key={entry.id} entry={entry} />)}
                    </div>
                  </div>

                  {/* ── Desktop: alternating layout ── */}
                  <div className="hidden sm:grid grid-cols-[1fr_72px_1fr] items-start">
                    {/* Left column */}
                    <div className="pr-10 pt-0.5">
                      {isLeft && (
                        <div className="space-y-5">
                          {items.map(entry => <EntryCard key={entry.id} entry={entry} />)}
                        </div>
                      )}
                    </div>

                    {/* Center: dot + date */}
                    <div className="flex flex-col items-center gap-1.5 pt-0.5">
                      <span
                        className="w-3 h-3 rounded-full border-2 border-white shadow shrink-0"
                        style={{ background: dotColor }}
                      />
                      <span className="text-[10px] text-gray-400 text-center leading-tight">
                        {formatDate(date)}
                      </span>
                    </div>

                    {/* Right column */}
                    <div className="pl-10 pt-0.5">
                      {!isLeft && (
                        <div className="space-y-5">
                          {items.map(entry => <EntryCard key={entry.id} entry={entry} />)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
