const experiments = [
  {
    name: 'AI-Augmented Post Drafts',
    description:
      'Using GPT-4 to generate structured first drafts, then editing for accuracy, voice, and original analysis.',
    status: 'Live',
    since: 'Aug 2024',
    detail: '9 posts produced',
  },
  {
    name: 'Theme Auto-Tagger',
    description:
      'Extracting strategic themes from post content using embeddings + a small classifier. Goal: auto-populate theme metadata on publish.',
    status: 'In Development',
    since: 'Nov 2024',
    detail: 'Prototype in testing',
  },
  {
    name: 'Prediction Accuracy Tracker',
    description:
      'Scoring historical predictions against actual outcomes to build a calibration record and surface forecasting biases.',
    status: 'In Development',
    since: 'Jan 2025',
    detail: '3 predictions queued',
  },
  {
    name: 'Competitive Signal Monitor',
    description:
      'Automated monitoring of earnings calls, SEC filings, and industry RSS feeds for platform strategy signals.',
    status: 'Planned',
    since: null,
    detail: null,
  },
  {
    name: 'Trend Forecasting Model',
    description:
      'Fine-tuned model to identify emerging strategic themes before they reach mainstream press coverage.',
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
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          AI Experiment Tracker
        </h3>
        <span className="text-xs text-gray-400">
          {experiments.filter((e) => e.status === 'Live').length} live ·{' '}
          {experiments.filter((e) => e.status === 'In Development').length} in dev ·{' '}
          {experiments.filter((e) => e.status === 'Planned').length} planned
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
        {experiments.map((exp) => {
          const style = STATUS_STYLES[exp.status]
          return (
            <div key={exp.name} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
              {/* Status indicator */}
              <div className="mt-1 flex-shrink-0">
                <span className={`block w-2 h-2 rounded-full ${style.dot}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
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
                <p className="text-sm text-gray-500 leading-relaxed">{exp.description}</p>
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
