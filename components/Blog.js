export default function Blog() {
  const blogPosts = {
    'Product Management + AI': [
      { title: "Apple's AI Strategy", date: 'Aug 2024', href: '#' },
      { title: 'Reddit Post on Product Managers', date: 'Mar 2024', href: '#' },
      { title: 'Product Portfolios', date: 'Aug 2020', href: '#' },
      { title: 'Digital Experience Platforms', date: 'Feb 2019', href: '#' },
      { title: "Stripe's 7 Lines of Code", date: 'Dec 2019', href: '#' },
    ],
    'Fintech + Crypto': [
      { title: "OpenAI's Latest Funding Round", date: 'Oct 2024', href: '#' },
      { title: 'Uniswap', date: 'Jul 2024', href: '#' },
      { title: 'Tokenomics', date: 'Apr 2024', href: '#' },
      { title: 'Blockchains: To Permission or Not?', date: 'Mar 2024', href: '#' },
      { title: 'Is Crypto Regulated?', date: 'Jan 2024', href: '#' },
    ],
    'Investing': [
      { title: "Instacart's IPO", date: 'Sept 2023', href: '#' },
      { title: 'When Crypto Crashes, Banks Burn', date: 'Mar 2023', href: '#' },
      { title: '2022: The Year Crypto Crashed', date: 'Feb 2023', href: '#' },
      { title: 'Swing Trading', date: 'Apr 2022', href: '#' },
      { title: "DoorDash's IPO", date: 'Nov 2020', href: '#' },
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
              <a 
                key={post.title}
                href={post.href}
                className={`flex items-center py-3 hover:bg-gray-50 -mx-3 px-3 rounded-lg transition-colors ${
                  index !== posts.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <span className="text-gray-900 hover:text-blue-600">
                  {post.title}
                </span>
              
              </a>
            ))}
          </div>
        </div>
      ))}
    </section>
  )
}
