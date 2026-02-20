export default function Hero() {
  const tags = [
    { label: 'AI + Product', bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
    { label: 'Fintech', bgColor: 'bg-green-50', textColor: 'text-green-700' },
    { label: 'Crypto', bgColor: 'bg-orange-50', textColor: 'text-orange-700' },
    { label: 'Investing', bgColor: 'bg-purple-50', textColor: 'text-purple-700' },
  ]

  return (
    <section className="pt-28 pb-16 px-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8">
        {/* Photo placeholder - replace src with your actual photo */}
        <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl flex-shrink-0">
          👩‍💻
        </div>
        <div className="text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
            Dena Murr
          </h1>
          <p className="text-lg text-gray-600">
            Product Manager · San Francisco
          </p>
        </div>
      </div>
      
      <p className="text-xl text-gray-800 mb-4 leading-relaxed">
        I write about <strong>Product Management</strong>, <strong>AI</strong>, <strong>Fintech</strong>, and <strong>Investing</strong>.
      </p>
      
      <p className="text-base text-gray-600 mb-8 leading-relaxed">
        6+ years in product, including 4 years as sole PM for an $800M ticketing platform. 
        Harvard Master&apos;s in Information Systems with focus on AI and crypto. 
        Currently building tools and writing about what I&apos;m learning.
      </p>

      <div className="flex flex-wrap gap-3">
        {tags.map(tag => (
          <span 
            key={tag.label}
            className={`px-4 py-1.5 rounded-full text-sm font-medium ${tag.bgColor} ${tag.textColor}`}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </section>
  )
}
