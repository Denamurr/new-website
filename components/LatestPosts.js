import Image from 'next/image'
import Link from 'next/link'

// All posts with their images (featured ones have real images, others use gradient placeholders)
const posts = [
  {
    slug: 'uniswap-product-design',
    title: 'What Uniswap Got Right',
    category: 'Crypto',
    image: '/uniswap.png',
    date: 'Mar 2024',
  },
  {
    slug: 'rice-framework-age-of-ai',
    title: 'RICE Framework in the Age of AI',
    category: 'Product',
    image: '/rice.png',
    date: 'Apr 2024',
  },
  {
    slug: 'instacart-ipo',
    title: 'The Economics of Instacart',
    category: 'Fintech',
    image: '/instacart.jpg',
    date: 'May 2024',
  },
  {
    slug: 'mission-statements-tech',
    title: 'Mission as Product Strategy',
    category: 'Strategy',
    image: '/mission-statements.jpg',
    date: 'Jun 2024',
  },
  {
    slug: 'apples-ai-strategy',
    title: "Apple's AI Strategy",
    category: 'AI',
    image: null,
    gradient: 'linear-gradient(135deg, #1e3a5f 0%, #0f2027 100%)',
    date: 'Aug 2024',
  },
  {
    slug: 'tokenomics',
    title: 'Tokenomics Decoded',
    category: 'Crypto',
    image: null,
    gradient: 'linear-gradient(135deg, #2d1b4e 0%, #1a0533 100%)',
    date: 'Sep 2024',
  },
  {
    slug: 'crypto-crash-2022',
    title: "When Crypto Becomes Everyone's Problem",
    category: 'Crypto',
    image: null,
    gradient: 'linear-gradient(135deg, #3d1a1a 0%, #1a0a0a 100%)',
    date: 'Oct 2024',
  },
  {
    slug: 'doordash-ipo',
    title: 'The DoorDash Bet',
    category: 'Fintech',
    image: null,
    gradient: 'linear-gradient(135deg, #1a3a2a 0%, #0a1f15 100%)',
    date: 'Nov 2024',
  },
  {
    slug: 'stripe-seven-lines-of-code',
    title: 'Stripe: Seven Lines of Code',
    category: 'Fintech',
    image: null,
    gradient: 'linear-gradient(135deg, #1e2a4a 0%, #0a1230 100%)',
    date: 'Jan 2025',
  },
  {
    slug: 'meta-200-billion-day',
    title: "Meta\u2019s $200 Billion Day",
    category: 'Platform',
    image: null,
    gradient: 'linear-gradient(135deg, #3a2a1a 0%, #1f1208 100%)',
    date: 'Feb 2025',
  },
  {
    slug: 'ip-as-ecosystem-lock',
    title: 'IP Is Lock-In',
    category: 'Strategy',
    image: null,
    gradient: 'linear-gradient(135deg, #1a2a3a 0%, #0d1520 100%)',
    date: 'Mar 2025',
  },
  {
    slug: 'permissioned-vs-permissionless-blockchains',
    title: 'Who Gets Access?',
    category: 'Crypto',
    image: null,
    gradient: 'linear-gradient(135deg, #1e1e3f 0%, #0d0d24 100%)',
    date: 'Apr 2025',
  },
]

function CategoryPill({ category }) {
  return (
    <span
      className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mb-3"
      style={{ background: 'rgba(91,141,238,0.15)', color: '#5b8dee' }}
    >
      {category}
    </span>
  )
}

export default function LatestPosts() {
  const [first, ...rest] = posts

  return (
    <section className="max-w-5xl mx-auto px-6 pb-24">
      {/* Section header */}
      <div className="text-center mb-10">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#8899bb' }}>
          Latest Posts
        </p>
        <svg width="80" height="12" viewBox="0 0 80 12" fill="none" className="mx-auto" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 6 C10 0, 20 12, 30 6 C40 0, 50 12, 60 6 C70 0, 80 12, 80 6" stroke="#5b8dee" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Hero post — large card */}
      <Link
        href={`/posts/${first.slug}`}
        className="group flex flex-col md:flex-row rounded-2xl overflow-hidden mb-6 transition-transform duration-200 hover:-translate-y-0.5"
        style={{ background: '#1a2238', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="relative w-full md:w-1/2 aspect-video md:aspect-auto min-h-[200px] overflow-hidden">
          {first.image ? (
            <Image
              src={first.image}
              alt={first.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full" style={{ background: first.gradient }} />
          )}
        </div>
        <div className="p-6 md:p-8 flex flex-col justify-center md:w-1/2">
          <CategoryPill category={first.category} />
          <h2 className="text-2xl md:text-3xl font-bold leading-tight" style={{ color: '#e8edf8' }}>
            {first.title}
          </h2>
          <p className="mt-3 text-sm" style={{ color: '#8899bb' }}>{first.date}</p>
        </div>
      </Link>

      {/* Remaining posts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rest.map(post => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group flex rounded-xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: '#1a2238', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            {/* Thumbnail */}
            <div className="relative w-28 flex-shrink-0 overflow-hidden">
              {post.image ? (
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="112px"
                />
              ) : (
                <div className="w-full h-full" style={{ background: post.gradient }} />
              )}
            </div>
            {/* Content */}
            <div className="p-4 flex flex-col justify-center">
              <span className="text-xs font-medium mb-1.5" style={{ color: '#5b8dee' }}>{post.category}</span>
              <h3 className="text-sm font-semibold leading-snug" style={{ color: '#e8edf8' }}>
                {post.title}
              </h3>
              <p className="text-xs mt-1.5" style={{ color: '#8899bb' }}>{post.date}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
