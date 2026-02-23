const metrics = [
  {
    label: 'Analyses Published',
    value: '14',
    subtext: 'total pieces',
    accentClass: 'bg-blue-500',
    valueClass: 'text-blue-700',
    bgClass: 'bg-blue-50',
  },
  {
    label: 'AI-Augmented',
    value: '9',
    subtext: '64% of corpus',
    accentClass: 'bg-violet-500',
    valueClass: 'text-violet-700',
    bgClass: 'bg-violet-50',
  },
  {
    label: 'Prediction Posts',
    value: '3',
    subtext: 'forecasts tracked',
    accentClass: 'bg-amber-500',
    valueClass: 'text-amber-700',
    bgClass: 'bg-amber-50',
  },
  {
    label: 'Strategic Categories',
    value: '5',
    subtext: 'domains covered',
    accentClass: 'bg-emerald-500',
    valueClass: 'text-emerald-700',
    bgClass: 'bg-emerald-50',
  },
  {
    label: 'Last Deployment',
    value: 'Feb 23, 2026',
    subtext: 'site updated',
    accentClass: 'bg-gray-400',
    valueClass: 'text-gray-700',
    bgClass: 'bg-gray-50',
  },
]

export default function DashboardMetrics() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="bg-white border border-gray-200 rounded-xl overflow-hidden"
        >
          <div className={`h-1 w-full ${m.accentClass}`} />
          <div className="p-4">
            <div className={`text-2xl font-bold tabular-nums ${m.valueClass}`}>
              {m.value}
            </div>
            <div className="text-sm font-medium text-gray-800 mt-1 leading-snug">
              {m.label}
            </div>
            <div className="text-xs text-gray-400 mt-0.5">{m.subtext}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
