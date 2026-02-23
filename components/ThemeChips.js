'use client'

const THEME_STYLES = {
  'Platform Strategy': {
    base: 'border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100',
    active: 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700',
    count: 'bg-blue-100 text-blue-600',
    countActive: 'bg-blue-500 text-white',
  },
  'AI Infrastructure': {
    base: 'border-violet-200 text-violet-700 bg-violet-50 hover:bg-violet-100',
    active: 'bg-violet-600 text-white border-violet-600 hover:bg-violet-700',
    count: 'bg-violet-100 text-violet-600',
    countActive: 'bg-violet-500 text-white',
  },
  'Behavioral Friction': {
    base: 'border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100',
    active: 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600',
    count: 'bg-amber-100 text-amber-600',
    countActive: 'bg-amber-400 text-white',
  },
  'Ecosystem Lock-In': {
    base: 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100',
    active: 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700',
    count: 'bg-emerald-100 text-emerald-600',
    countActive: 'bg-emerald-500 text-white',
  },
  'Capital Cycles': {
    base: 'border-cyan-200 text-cyan-700 bg-cyan-50 hover:bg-cyan-100',
    active: 'bg-cyan-600 text-white border-cyan-600 hover:bg-cyan-700',
    count: 'bg-cyan-100 text-cyan-600',
    countActive: 'bg-cyan-500 text-white',
  },
  'Regulatory Risk': {
    base: 'border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100',
    active: 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700',
    count: 'bg-rose-100 text-rose-600',
    countActive: 'bg-rose-500 text-white',
  },
}

export default function ThemeChips({ themes, activeTheme, onThemeSelect }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Filter by theme
        </span>
        {activeTheme && (
          <button
            onClick={() => onThemeSelect(activeTheme)}
            className="text-xs text-gray-400 hover:text-gray-700 underline underline-offset-2"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {themes.map(({ name, count }) => {
          const styles = THEME_STYLES[name]
          const isActive = activeTheme === name
          return (
            <button
              key={name}
              onClick={() => onThemeSelect(name)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                isActive ? styles.active : styles.base
              }`}
            >
              {name}
              <span
                className={`text-xs font-semibold rounded-full px-1.5 py-0.5 leading-none ${
                  isActive ? styles.countActive : styles.count
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
