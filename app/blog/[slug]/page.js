import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'
import Link from 'next/link'
import ReadingProgress from '../../../components/ReadingProgress'

const CATEGORY_MAP = {
  'uniswap-product-design':                     { category: 'Crypto',   color: '#ec5a8f' },
  'rice-framework-age-of-ai':                   { category: 'Product',  color: '#2bb673' },
  'instacart-ipo':                              { category: 'Fintech',  color: '#2a6fdb' },
  'mission-statements-tech':                    { category: 'Strategy', color: '#ff7a3d' },
  'apples-ai-strategy':                         { category: 'AI',       color: '#8b5cf6' },
  'tokenomics':                                 { category: 'Crypto',   color: '#ec5a8f' },
  'crypto-crash-2022':                          { category: 'Crypto',   color: '#ec5a8f' },
  'doordash-ipo':                               { category: 'Fintech',  color: '#2a6fdb' },
  'stripe-seven-lines-of-code':                 { category: 'Fintech',  color: '#2a6fdb' },
  'meta-200-billion-day':                       { category: 'Platform', color: '#00b4b4' },
  'ip-as-ecosystem-lock':                       { category: 'Strategy', color: '#ff7a3d' },
  'permissioned-vs-permissionless-blockchains': { category: 'Crypto',   color: '#ec5a8f' },
}

const ALL_ESSAYS = [
  { slug: 'uniswap-product-design',                     title: 'What Uniswap Got Right',                 category: 'Crypto',   color: '#ec5a8f' },
  { slug: 'rice-framework-age-of-ai',                   title: 'RICE Framework in the Age of AI',        category: 'Product',  color: '#2bb673' },
  { slug: 'instacart-ipo',                              title: 'The Economics of Instacart',             category: 'Fintech',  color: '#2a6fdb' },
  { slug: 'mission-statements-tech',                    title: 'Mission as Product Strategy',            category: 'Strategy', color: '#ff7a3d' },
  { slug: 'apples-ai-strategy',                         title: "Apple's AI Strategy",                    category: 'AI',       color: '#8b5cf6' },
  { slug: 'tokenomics',                                 title: 'Tokenomics Decoded',                     category: 'Crypto',   color: '#ec5a8f' },
  { slug: 'crypto-crash-2022',                          title: "When Crypto Becomes Everyone's Problem", category: 'Crypto',   color: '#ec5a8f' },
  { slug: 'doordash-ipo',                               title: 'The DoorDash Bet',                       category: 'Fintech',  color: '#2a6fdb' },
  { slug: 'stripe-seven-lines-of-code',                 title: 'Stripe: Seven Lines of Code',            category: 'Fintech',  color: '#2a6fdb' },
  { slug: 'meta-200-billion-day',                       title: "Meta's $200 Billion Day",                category: 'Platform', color: '#00b4b4' },
  { slug: 'ip-as-ecosystem-lock',                       title: 'IP Is Lock-In',                          category: 'Strategy', color: '#ff7a3d' },
  { slug: 'permissioned-vs-permissionless-blockchains', title: 'Who Gets Access?',                       category: 'Crypto',   color: '#ec5a8f' },
]

function getRelated(slug, category, count = 3) {
  const others = ALL_ESSAYS.filter(e => e.slug !== slug)
  const same = others.filter(e => e.category === category)
  const rest = others.filter(e => e.category !== category)
  return [...same, ...rest].slice(0, count)
}

function readingTime(content) {
  return Math.max(1, Math.round(content.trim().split(/\s+/).length / 200))
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'posts')
  return fs.readdirSync(postsDir).map(f => ({ slug: f.replace('.md', '') }))
}

export default async function BlogPost({ params }) {
  const { slug } = await params
  const filePath = path.join(process.cwd(), 'posts', `${slug}.md`)
  const { data, content } = matter(fs.readFileSync(filePath, 'utf8'))

  const processedContent = await remark().use(html).process(content)
  const contentHtml = processedContent.toString()

  const { category = 'Essay', color = '#111111' } = CATEGORY_MAP[slug] || {}
  const readTime = readingTime(content)
  const related = getRelated(slug, category)

  return (
    <>
      <ReadingProgress color={color} />

      {/* Top bar */}
      <header style={{
        position: 'fixed', inset: '0 0 auto 0', zIndex: 50,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '18px 28px', pointerEvents: 'none'
      }}>
        <Link href="/" style={{
          fontFamily: '"Anton", sans-serif', fontSize: 20,
          color: 'var(--ink)', textDecoration: 'none', lineHeight: 1,
          whiteSpace: 'nowrap', flex: 'none', pointerEvents: 'auto'
        }}>
          DENA MURR<span style={{ color }}>.</span>
        </Link>
        <nav style={{
          display: 'flex', gap: 4, padding: 6, borderRadius: 999,
          background: 'var(--ink)', fontFamily: '"Inter", sans-serif',
          fontWeight: 500, fontSize: 14, pointerEvents: 'auto'
        }}>
          <Link href="/#essays" className="essay-nav-link">Essays</Link>
          <Link href="/#built" className="essay-nav-link">Built</Link>
          <Link href="/#contact" className="essay-nav-link">Say hello</Link>
        </nav>
      </header>

      <article style={{ '--cat': color }}>
        {/* Header */}
        <div style={{ padding: '120px 6vw 0' }}>
          <div style={{ maxWidth: 880, margin: '0 auto' }}>
            <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 13, letterSpacing: '0.04em' }}>
              <Link href="/#essays" className="breadcrumb-link">← All essays</Link>
            </div>
            <span style={{
              display: 'inline-block', fontFamily: '"Inter", sans-serif',
              fontSize: 12, fontWeight: 600, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#fff',
              background: color, padding: '6px 12px', borderRadius: 999,
              margin: '34px 0 22px'
            }}>{category}</span>
            <h1 style={{
              fontFamily: '"Anton", sans-serif', fontWeight: 400,
              fontSize: 'clamp(40px, 6.4vw, 92px)', lineHeight: 0.96,
              letterSpacing: '-0.015em', margin: 0
            }}>{data.title}</h1>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 14,
              flexWrap: 'wrap', margin: '34px 0 0',
              fontFamily: '"Inter", sans-serif', fontSize: 14,
              color: 'rgba(27,27,27,0.6)'
            }}>
              <span style={{
                width: 34, height: 34, borderRadius: '50%', overflow: 'hidden',
                background: color, flex: 'none', display: 'inline-block'
              }}>
                <img src="/dena-illustration.png" alt="Dena Murr"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
              </span>
              <span>By <strong style={{ color: 'var(--ink)', fontWeight: 600 }}>Dena Murr</strong></span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor', opacity: 0.5, display: 'inline-block' }} />
              {data.date && <span>{formatDate(data.date)}</span>}
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'currentColor', opacity: 0.5, display: 'inline-block' }} />
              <span>{readTime} min read</span>
            </div>
          </div>
          <div style={{ maxWidth: 880, margin: '48px auto 0', height: 2, background: 'var(--ink)' }} />
        </div>

        {/* Body */}
        <div style={{ padding: '8px 6vw 40px' }}>
          <div className="body-inner" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </div>

        {/* Author card */}
        <section style={{ padding: '60px 6vw' }}>
          <div style={{
            maxWidth: '60ch', margin: '0 auto',
            display: 'flex', gap: 22, alignItems: 'center',
            background: 'var(--yellow)', border: '2px solid var(--ink)',
            borderRadius: 18, padding: '26px 30px'
          }}>
            <span style={{
              width: 74, height: 74, borderRadius: '50%', overflow: 'hidden',
              flex: 'none', border: '2px solid var(--ink)', background: color, display: 'inline-block'
            }}>
              <img src="/dena-illustration.png" alt="Dena Murr"
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
            </span>
            <div>
              <div style={{ fontFamily: '"Anton", sans-serif', fontSize: 24, lineHeight: 1 }}>Dena Murr</div>
              <p style={{
                fontFamily: '"Inter", sans-serif', fontSize: 15, lineHeight: 1.5,
                color: '#1a1a1a', margin: '8px 0 0', maxWidth: '48ch'
              }}>
                Product manager in San Francisco writing about AI, fintech, crypto, and investing. I build small PM tools and think out loud about how products win.
              </p>
              <div style={{ display: 'flex', gap: 16, marginTop: 12, fontFamily: '"Inter", sans-serif', fontSize: 14, fontWeight: 500 }}>
                <a href="https://linkedin.com/in/denamurr" className="author-social-link">LinkedIn</a>
                <a href="https://github.com/denamurr" className="author-social-link">GitHub</a>
                <a href="mailto:denamurr@gmail.com" className="author-social-link">Email</a>
              </div>
            </div>
          </div>
        </section>

        {/* Keep reading */}
        {related.length > 0 && (
          <section style={{ padding: '30px 6vw 110px' }}>
            <div style={{ maxWidth: 880, margin: '0 auto' }}>
              <div className="sec-label">
                <span>Keep reading</span><span className="bar" /><span>More musings</span>
              </div>
              <ul className="rlist">
                {related.map(({ slug: rSlug, title, category: rCat, color: rColor }) => (
                  <li key={rSlug} style={{ '--rc': rColor }}>
                    <Link href={`/blog/${rSlug}`}>
                      <span className="rc" style={{ color: rColor }}>{rCat}</span>
                      <span className="rt">{title}</span>
                      <span className="ra">↗</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </article>

      {/* Footer */}
      <footer style={{ padding: '70px 6vw 40px', background: 'var(--ink)', color: 'var(--bg)' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{
            fontFamily: '"Anton", sans-serif', fontWeight: 400,
            fontSize: 'clamp(24px, 4.5vw, 64px)', lineHeight: 0.9, letterSpacing: '-0.02em'
          }}>
            SAY<br />
            <a href="mailto:denamurr@gmail.com" className="footer-hello" style={{ color: 'var(--yellow)', textDecoration: 'none' }}>HELLO&nbsp;↗</a>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px 26px', marginTop: 34, fontFamily: '"Inter", sans-serif', fontSize: 15 }}>
            <a href="mailto:denamurr@gmail.com" className="footer-link">denamurr@gmail.com</a>
            <a href="https://linkedin.com/in/denamurr" className="footer-link">LinkedIn</a>
            <a href="https://github.com/denamurr" className="footer-link">GitHub</a>
          </div>
          <div style={{
            display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap',
            gap: 10, fontFamily: '"Inter", sans-serif', fontSize: 13, opacity: 0.55, marginTop: 48
          }}>
            <span>Co-built with AI · San Francisco, CA</span>
            <span>© 2026 Dena Murr</span>
          </div>
        </div>
      </footer>
    </>
  )
}
