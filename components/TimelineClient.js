'use client'

import { useState, useMemo } from 'react'

const CATEGORIES = {
  all:            { label: 'All',      dotColor: '#9ca3af', activeClass: 'bg-gray-900 text-white border-gray-900' },
  model_release:  { label: 'Models',   dotColor: '#6366f1', activeClass: 'bg-indigo-600 text-white border-indigo-600' },
  research_paper: { label: 'Papers',   dotColor: '#16a34a', activeClass: 'bg-green-600 text-white border-green-600' },
  announcement:   { label: 'News',     dotColor: '#ea580c', activeClass: 'bg-orange-600 text-white border-orange-600' },
  product_launch: { label: 'Products', dotColor: '#0891b2', activeClass: 'bg-cyan-600 text-white border-cyan-600' },
}

function formatDate(str) {
  const [y, m, d] = str.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })
}

export default function TimelineClient({ entries }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

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
    const first = formatDate(dates[0])
    const last = formatDate(dates[dates.length - 1])
    return `${first} – ${last}`
  }, [entries])

  return (
    <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">AI Timeline</h1>
        <p className="text-gray-500 text-sm mt-1">
          {entries.length} key developments · {dateRange}
        </p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <input
          type="search"
          placeholder="Search entries..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-gray-400 bg-white"
        />
        <div className="flex gap-2 flex-wrap">
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                activeCategory === key
                  ? cat.activeClass
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {byDate.length === 0 ? (
        <p className="text-sm text-gray-500">No entries match your filter.</p>
      ) : (
        <div className="space-y-10">
          {byDate.map(([date, items]) => (
            <div key={date} className="sm:grid sm:grid-cols-[140px_1fr] gap-6">
              <div className="text-sm text-gray-400 mb-3 sm:mb-0 sm:pt-0.5 sm:text-right">
                {formatDate(date)}
              </div>
              <div className="border-l border-gray-200 pl-6 space-y-6">
                {items.map(entry => {
                  const cat = CATEGORIES[entry.category] || CATEGORIES.announcement

                  return (
                    <div key={entry.id} className="relative">
                      <span
                        className="absolute -left-[25px] top-1.5 w-2.5 h-2.5 rounded-full"
                        style={{ background: cat.dotColor }}
                      />
                      <a
                        href={entry.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors leading-snug"
                      >
                        {entry.title}
                      </a>
                      {entry.description && (
                        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{entry.description}</p>
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
                          <span
                            key={tag}
                            className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
