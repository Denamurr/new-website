export default function Tools() {
  const tools = [
    { 
      title: 'RICE Prioritization Tool', 
      description: 'Score and rank product features using the RICE framework. Input your features and get instant prioritization.',
      status: 'Coming Soon',
      icon: '📊',
      href: '#'
    },
    { 
      title: 'BCG Matrix Analyzer', 
      description: 'Plot your products on the growth-share matrix. Visualize portfolio strategy.',
      status: 'Coming Soon',
      icon: '📈',
      href: '#'
    },
  ]

  return (
    <section id="tools" className="bg-white py-16 border-t border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
            Interactive Tools
          </span>
          <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
            NEW
          </span>
        </div>
        
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">
          PM Tools I&apos;m Building
        </h2>
        
        <div className="grid gap-4">
          {tools.map(tool => (
            <a 
              key={tool.title}
              href={tool.href}
              className="block border border-gray-200 rounded-xl p-6 bg-gray-50 hover:bg-gray-100 hover:border-gray-300 transition-all group"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">{tool.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {tool.title}
                    </h3>
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
                      {tool.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {tool.description}
                  </p>
                </div>
                <span className="text-gray-300 group-hover:text-gray-500 transition-colors text-xl">
                  →
                </span>
              </div>
            </a>
          ))}
        </div>

        <p className="mt-6 text-sm text-gray-500 italic">
          This site was built with AI. The tools above are part of my ongoing exploration of AI-assisted development.
        </p>
      </div>
    </section>
  )
}
