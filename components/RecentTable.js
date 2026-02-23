import Link from 'next/link'

const THEME_COLORS = {
  'Platform Strategy': 'bg-blue-50 text-blue-700 border-blue-200',
  'AI Infrastructure': 'bg-violet-50 text-violet-700 border-violet-200',
  'Behavioral Friction': 'bg-amber-50 text-amber-700 border-amber-200',
  'Ecosystem Lock-In': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Capital Cycles': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Regulatory Risk': 'bg-rose-50 text-rose-700 border-rose-200',
}

const CATEGORY_DOT = {
  Platform: 'bg-blue-500',
  AI: 'bg-violet-500',
  Fintech: 'bg-emerald-500',
  Crypto: 'bg-orange-500',
  Investing: 'bg-cyan-500',
}

export default function RecentTable({ posts, activeTheme }) {
  const sorted = [...posts].reverse()

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Analysis Log
        </h3>
        <span className="text-xs text-gray-400 tabular-nums">
          {activeTheme ? `${posts.length} of 14 posts` : `${posts.length} posts`}
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Title
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Category
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  AI Layer
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Themes
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Written
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sorted.map((post) => (
                <tr
                  key={post.slug}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  {/* Title */}
                  <td className="px-4 py-3 max-w-[240px]">
                    <div className="flex items-center gap-2">
                      {post.isPrediction && (
                        <span className="flex-shrink-0 text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded">
                          Pred
                        </span>
                      )}
                      <Link
                        href={`/blog/${post.slug}`}
                        className="font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                      >
                        {post.title}
                      </Link>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          CATEGORY_DOT[post.category] ?? 'bg-gray-400'
                        }`}
                      />
                      <span className="text-gray-700">{post.category}</span>
                    </div>
                  </td>

                  {/* AI Layer */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {post.aiAugmented ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium bg-violet-50 text-violet-700 border border-violet-200 px-2 py-0.5 rounded-full">
                        <span className="w-1 h-1 bg-violet-500 rounded-full" />
                        {post.aiLayer}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>

                  {/* Themes */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {post.themes.map((t) => (
                        <span
                          key={t}
                          className={`text-xs font-medium px-1.5 py-0.5 rounded border ${
                            THEME_COLORS[t] ?? 'bg-gray-50 text-gray-600 border-gray-200'
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Written */}
                  <td className="px-4 py-3 text-gray-500 whitespace-nowrap tabular-nums text-xs">
                    {post.written}
                  </td>

                  {/* Updated */}
                  <td className="px-4 py-3 text-gray-400 whitespace-nowrap tabular-nums text-xs">
                    {post.updated ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
