import Link from 'next/link'

export default function Blog() {
  const blogPosts = {
    'Product Management + Business': [
      { title: "Apple's AI Strategy", slug: 'apples-ai-strategy' },
      { title: 'Reddit Post on Product Managers', slug: 'reddit-post-on-product-managers' },
      { title: 'Global Intellectual Property Rights', slug: 'global-intellectual-property-rights' },
      { title: 'The Power of Mission Statements', slug: 'the-power-of-mission-statements' },
      { title: 'Should You Start a Side Hustle?', slug: 'should-you-start-a-side-hustle' },
      { title: 'If Product Roadmaps Were Adventure Maps', slug: 'if-product-roadmaps-were-adventure-maps' },
      { title: 'Product Portfolios', slug: 'product-portfolios' },
      { title: 'Digital Experience Platforms', slug: 'digital-experience-platforms' },
      { title: "Stripe's 7 Lines of Code", slug: 'stripes-7-lines-of-code' },
    ],
    'Investing': [
      { title: "OpenAI's Latest Funding Round", slug: 'openai-latest-funding-round' },
      { title: 'Uniswap', slug: 'uniswap' },
      { title: 'Tokenomics', slug: 'tokenomics' },
      { title: 'Blockchains: To Permission or Not?', slug: 'blockchains-to-permission-or-not' },
      { title: 'Is Crypto Regulated?', slug: 'is-crypto-regulated' },
      { title: "Instacart's IPO", slug: 'instacarts-ipo' },
      { title: '2022: The Year Crypto Crashed - Pt 1', slug: '2022-the-year-crypto-crashed-pt1' },
      { title: 'When Crypto Crashes, Banks Burn - Pt 2', slug: 'when-crypto-crashes-banks-burn-pt2' },
      { title: 'Swing Trading', slug: 'swing-trading' },
      { title: "Facebook's Unbelievable Stock Surge", slug: 'facebooks-unbelievable-stock-surge' },
      { title: 'Byzantine Generals Problem', slug: 'byzantine-generals-problem' },
      { title: "DoorDash's IPO", slug: 'doordashs-ipo' },
    ],
    'Misc': [
      { title: 'My Detour into Entrepreneurship', slug: 'my-detour-into-entrepreneurship' },
      { title: 'Steve Jobs Keynotes', slug: 'steve-jobs-keynotes' },
      { title: 'Poor Communication Skills Could Be Holding You Back', slug: 'poor-communication-skills-could-be-holding-you-back' },
    ],
  }

  return (
    <section id="blog" className="py-16 px-6 max-w-4xl mx-auto">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
        Writing
      </h2>
      
      {Object.entries(blogPosts).map(([category, posts]) => (
        <div key={category} className="mb-10">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            {category}
          </h3>
          <div className="flex flex-col">
            {posts.map((post, index) => (
              <Link 
                key={post.slug}
                href={`/blog/${post.slug}`}
                className={`flex justify-between items-center py-3 hover:bg-gray-50 -mx-3 px-3 rounded-lg transition-colors ${
                  index !== posts.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <span className="text-gray-900 hover:text-blue-600">
                  {post.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
