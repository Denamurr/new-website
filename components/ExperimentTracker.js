const experiments = [
  {
    name: 'AI-Augmented Drafting',
    description: [
      'Selected posts begin with a structured AI draft before manual refinement. AI handles scaffolding; I refine thesis and reasoning.',
    ],
    status: 'Live',
    since: 'Aug 2024',
    detail: '9 posts produced',
  },
  {
    name: 'Theme Extraction Engine',
    description: [
      'Each post is categorized by strategic themes. This experiment uses embeddings and a lightweight classifier to auto-detect recurring concepts across the corpus.',
      'The objective is consistency and signal aggregation — turning essays into structured data.',
      'This will power the "Strategic Theme Map" on the homepage.',
    ],
    status: 'In Development',
    since: 'Nov 2024',
    detail: 'Prototype in testing',
  },
  {
    name: 'Cross-Post Synthesis',
    description: [
      'Instead of analyzing posts individually, this experiment explores clustering related analyses and surfacing pattern overlap across time.',
      'The ambition is to evolve from a collection of posts into a connected intelligence system.',
    ],
    status: 'Planned',
    since: null,
    detail: null,
  },
]

const STATUS_STYLES = {
  Live: {
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    dot: 'bg-emerald-500 animate-pulse',
  },
  'In Development': {
    badge: 'bg-amber-100 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  Planned: {
    badge: 'bg-gray-100 text-gray-500 border-gray-200',
    dot: 'bg-gray-400',
  },
}

export default function ExperimentTracker() {
  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          AI Experiment Tracker
        </span>
        <span className="text-xs text-gray-400">
          {experiments.filter((e) => e.status === 'Live').length} live ·{' '}
          {experiments.filter((e) => e.status === 'In Development').length} in dev ·{' '}
          {experiments.filter((e) => e.status === 'Planned').length} planned
        </span>
      </div>

      {/* Section title + description */}
      <h3 className="text-lg font-bold text-gray-900 mb-1">How the Lab Evolves</h3>
      <p className="text-sm text-gray-500 mb-4">
        This site is a structured thinking system. These experiments directly shape how
        analyses are generated, tagged, and synthesized.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
        {experiments.map((exp) => {
          const style = STATUS_STYLES[exp.status]
          return (
            <div key={exp.name} className="flex items-start gap-4 px-5 py-5 hover:bg-gray-50 transition-colors">
              {/* Status indicator */}
              <div className="mt-1.5 flex-shrink-0">
                <span className={`block w-2 h-2 rounded-full ${style.dot}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-gray-900">{exp.name}</span>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full border ${style.badge}`}
                  >
                    {exp.status}
                  </span>
                  {exp.detail && (
                    <span className="text-xs text-gray-400">{exp.detail}</span>
                  )}
                </div>
                <div className="space-y-1.5">
                  {exp.description.map((para, i) => (
                    <p key={i} className="text-sm text-gray-500 leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </div>

              {/* Since date */}
              {exp.since && (
                <div className="flex-shrink-0 text-xs text-gray-400 tabular-nums mt-0.5 whitespace-nowrap">
                  Since {exp.since}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
