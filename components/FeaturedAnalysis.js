import Link from 'next/link'

const THEME_COLORS = {
  'Platform Strategy': 'bg-blue-100 text-blue-700',
  'AI Infrastructure': 'bg-violet-100 text-violet-700',
  'Behavioral Friction': 'bg-amber-100 text-amber-700',
  'Ecosystem Lock-In': 'bg-emerald-100 text-emerald-700',
  'Capital Cycles': 'bg-cyan-100 text-cyan-700',
  'Regulatory Risk': 'bg-rose-100 text-rose-700',
}

const CATEGORY_COLORS = {
  Platform: 'bg-blue-600 text-white',
  AI: 'bg-violet-600 text-white',
  Fintech: 'bg-emerald-600 text-white',
  Crypto: 'bg-orange-500 text-white',
  Investing: 'bg-cyan-600 text-white',
}

export default function FeaturedAnalysis({ post }) {
  if (!post) return null

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-blue-500 to-emerald-500" />

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              Featured Analysis
            </span>
            {post.aiAugmented && (
              <span className="inline-flex items-center gap-1 text-xs font-medium bg-violet-50 text-violet-600 border border-violet-200 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
                AI-Augmented
              </span>
            )}
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-md flex-shrink-0 ${
              CATEGORY_COLORS[post.category] ?? 'bg-gray-100 text-gray-700'
            }`}
          >
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
          {post.title}
        </h3>

        {/* Theme chips */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {post.themes.map((t) => (
            <span
              key={t}
              className={`text-xs font-medium px-2 py-0.5 rounded ${
                THEME_COLORS[t] ?? 'bg-gray-100 text-gray-600'
              }`}
            >
              {t}
            </span>
          ))}
        </div>

        {/* AI TL;DR */}
        {post.tldr && post.tldr.length > 0 && (
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                AI TL;DR
              </span>
              <span className="text-xs text-gray-400">· {post.aiLayer}</span>
            </div>
            <ul className="space-y-1.5">
              {post.tldr.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>Written {post.written}</span>
            {post.updated && <span>· Updated {post.updated}</span>}
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
          >
            Read analysis →
          </Link>
        </div>
      </div>
    </div>
  )
}
