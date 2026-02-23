'use client'

import { useState, useMemo } from 'react'
import postsData from '../data/posts.json'
import DashboardMetrics from './DashboardMetrics'
import ThemeChips from './ThemeChips'
import FeaturedAnalysis from './FeaturedAnalysis'
import RecentTable from './RecentTable'
import ExperimentTracker from './ExperimentTracker'

// Compute theme counts from data to keep in sync with posts.json
const THEME_ORDER = [
  'Platform Strategy',
  'AI Infrastructure',
  'Behavioral Friction',
  'Ecosystem Lock-In',
  'Capital Cycles',
  'Regulatory Risk',
]

function buildThemeCounts(posts) {
  const counts = {}
  posts.forEach((p) => p.themes.forEach((t) => { counts[t] = (counts[t] || 0) + 1 }))
  return THEME_ORDER.map((name) => ({ name, count: counts[name] ?? 0 }))
}

export default function LabDashboard() {
  const [activeTheme, setActiveTheme] = useState(null)

  const themes = useMemo(() => buildThemeCounts(postsData), [])
  const featuredPost = useMemo(() => postsData.find((p) => p.featured), [])

  const filteredPosts = useMemo(
    () =>
      activeTheme
        ? postsData.filter((p) => p.themes.includes(activeTheme))
        : postsData,
    [activeTheme]
  )

  function handleThemeSelect(theme) {
    setActiveTheme((prev) => (prev === theme ? null : theme))
  }

  return (
    <section id="lab" className="py-14 px-6 border-t border-gray-200">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">
            Product Intelligence Lab
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            live
          </span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Analysis Dashboard</h2>

        {/* Row 1: Metrics */}
        <DashboardMetrics />

        {/* Row 2: Theme filter */}
        <div className="mt-8">
          <ThemeChips
            themes={themes}
            activeTheme={activeTheme}
            onThemeSelect={handleThemeSelect}
          />
        </div>

        {/* Row 3: Featured analysis */}
        <div className="mt-8">
          <FeaturedAnalysis post={featuredPost} />
        </div>

        {/* Row 4: Recent table */}
        <div className="mt-8">
          <RecentTable posts={filteredPosts} activeTheme={activeTheme} />
        </div>

        {/* Row 5: Experiment tracker */}
        <div className="mt-8">
          <ExperimentTracker />
        </div>
      </div>
    </section>
  )
}
