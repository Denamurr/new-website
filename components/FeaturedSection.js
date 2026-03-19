'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

const allPosts = [
  { slug: 'uniswap-product-design', title: 'What Uniswap Got Right', category: 'Crypto', image: '/uniswap.png' },
  { slug: 'rice-framework-age-of-ai', title: 'RICE Framework in the Age of AI', category: 'Product', image: '/rice.png' },
  { slug: 'instacart-ipo', title: 'The Economics of Instacart', category: 'Fintech', image: '/instacart.jpg' },
  { slug: 'mission-statements-tech', title: 'Mission as Product Strategy', category: 'Strategy', image: '/mission-statements.jpg' },
  { slug: 'apples-ai-strategy', title: "Apple's AI Strategy", category: 'AI', image: null },
  { slug: 'tokenomics', title: 'Tokenomics Decoded', category: 'Crypto', image: null },
  { slug: 'crypto-crash-2022', title: "When Crypto Becomes Everyone's Problem", category: 'Crypto', image: null },
  { slug: 'doordash-ipo', title: 'The DoorDash Bet', category: 'Fintech', image: null },
  { slug: 'stripe-seven-lines-of-code', title: 'Stripe: Seven Lines of Code', category: 'Fintech', image: null },
  { slug: 'meta-200-billion-day', title: "Meta\u2019s $200 Billion Day", category: 'Platform', image: null },
  { slug: 'ip-as-ecosystem-lock', title: 'IP Is Lock-In', category: 'Strategy', image: null },
  { slug: 'permissioned-vs-permissionless-blockchains', title: 'Who Gets Access?', category: 'Crypto', image: null },
]

// Palette: Tussock, Vanilla, Juniper, Cutty Sark, Ebony Clay
const PALETTE = [
  { bg: '#CA9954', text: '#2a1500', cat: '#6b4010' },
  { bg: '#D3C0AF', text: '#1e140a', cat: '#7a6050' },
  { bg: '#799191', text: '#0f1e1e', cat: '#1e3535' },
  { bg: '#4F6563', text: '#e8f0ee', cat: '#c0d4d0' },
  { bg: '#1E2D32', text: '#e8edf8', cat: '#8aabb0' },
]

export default function FeaturedSection() {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'left' ? -720 : 720, behavior: 'smooth' })
  }

  return (
    <section className="max-w-5xl mx-auto px-6 pb-10" id="essays">
      {/* Section header */}
      <div className="text-center mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#8899bb' }}>
          Musings
        </p>
        <svg width="80" height="12" viewBox="0 0 80 12" fill="none" className="mx-auto" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 6 C10 0, 20 12, 30 6 C40 0, 50 12, 60 6 C70 0, 80 12, 80 6" stroke="#5b8dee" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Carousel wrapper */}
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: '#1a2238', border: '1.5px solid rgba(255,255,255,0.14)', color: '#8899bb' }}
          aria-label="Scroll left"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {allPosts.map((post, i) => {
            const palette = PALETTE[i % PALETTE.length]
            return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block flex-shrink-0 rounded-2xl transition-transform duration-200 hover:-translate-y-1 p-2.5"
              style={{
                width: '160px',
                background: palette.bg,
                border: '1.5px solid rgba(0,0,0,0.12)',
              }}
            >
              {/* Bordered image */}
              <div
                className="relative w-full rounded-xl overflow-hidden mb-2.5"
                style={{ aspectRatio: '1 / 1', border: '1.5px solid rgba(0,0,0,0.15)' }}
              >
                {post.image ? (
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="160px"
                  />
                ) : (
                  <div className="w-full h-full" style={{ background: palette.bg, opacity: 0.6 }} />
                )}
              </div>
              <p className="text-xs font-medium mb-1 truncate" style={{ color: palette.cat }}>{post.category}</p>
              <h3
                className="text-xs font-semibold leading-snug"
                style={{
                  color: palette.text,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {post.title}
              </h3>
            </Link>
            )
          })}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: '#1a2238', border: '1.5px solid rgba(255,255,255,0.14)', color: '#8899bb' }}
          aria-label="Scroll right"
        >
          <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  )
}
