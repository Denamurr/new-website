'use client'

import HeroClient from '../components/HeroClient'
import Link from 'next/link'

const ESSAYS = [
  { title: 'What Uniswap Got Right', category: 'Crypto', color: '#ec5a8f', href: '/blog/uniswap-product-design' },
  { title: "RICE Framework in the Age of AI (don't trust it)", category: 'Product', color: '#2bb673', href: '/blog/rice-framework-age-of-ai' },
  { title: 'The Economics of Instacart', category: 'Fintech', color: '#2a6fdb', href: '/blog/instacart-ipo' },
  { title: 'Mission as Product Strategy', category: 'Strategy', color: '#ff7a3d', href: '/blog/mission-statements-tech' },
  { title: "Apple's AI Strategy", category: 'AI', color: '#8b5cf6', href: '/blog/apples-ai-strategy' },
  { title: 'Tokenomics Decoded', category: 'Crypto', color: '#ec5a8f', href: '/blog/tokenomics' },
  { title: "When Crypto Becomes Everyone's Problem", category: 'Crypto', color: '#ec5a8f', href: '/blog/crypto-crash-2022' },
  { title: 'The DoorDash Bet', category: 'Fintech', color: '#2a6fdb', href: '/blog/doordash-ipo' },
  { title: 'Stripe: Seven Lines of Code', category: 'Fintech', color: '#2a6fdb', href: '/blog/stripe-seven-lines-of-code' },
  { title: "Meta's $200 Billion Day", category: 'Platform', color: '#00b4b4', href: '/blog/meta-200-billion-day' },
  { title: 'IP Is Lock-In', category: 'Strategy', color: '#ff7a3d', href: '/blog/ip-as-ecosystem-lock' },
  { title: 'Who Gets Access?', category: 'Crypto', color: '#ec5a8f', href: '/blog/permissioned-vs-permissionless-blockchains' },
  { title: 'If Product Roadmaps Were Adventure Maps', category: 'Product', color: '#2bb673', href: '/blog/product-roadmap-adventure' },
  { title: 'Product Portfolio Decisions', category: 'Strategy', color: '#ff7a3d', href: '/blog/bcg-matrix-product-portfolio' },
  { title: 'What 256 PMs Told Reddit About Pay', category: 'Product', color: '#2bb673', href: '/blog/pm-salary-survey-2024' },
]

export default function Home() {
  return (
    <>
      {/* Fixed nav pill */}
      <div style={{
        position: 'fixed', inset: '0 0 auto 0', zIndex: 40,
        padding: '22px 28px', display: 'flex',
        justifyContent: 'flex-end', alignItems: 'flex-start',
        pointerEvents: 'none'
      }}>
        <nav style={{
          display: 'flex', gap: 4, padding: 6,
          borderRadius: 999, background: 'var(--ink)',
          fontFamily: '"Inter", sans-serif', fontWeight: 500, fontSize: 14,
          pointerEvents: 'auto'
        }}>
          {[
            { label: 'Essays', href: '#essays' },
            { label: 'Built', href: '#built' },
            { label: 'About', href: '#about', hideSm: true },
            { label: 'Say hello', href: '#contact' },
          ].map(({ label, href, hideSm }) => (
            <a
              key={label}
              href={href}
              className={hideSm ? 'hide-sm' : undefined}
              style={{
                color: 'var(--bg)', textDecoration: 'none',
                padding: '8px 16px', borderRadius: 999, opacity: 0.8
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '1'
                e.currentTarget.style.background = 'var(--yellow)'
                e.currentTarget.style.color = 'var(--ink)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '0.8'
                e.currentTarget.style.background = ''
                e.currentTarget.style.color = 'var(--bg)'
              }}
            >
              {label}
            </a>
          ))}
        </nav>
      </div>

      <style>{`
        @media (max-width: 620px) {
          .hide-sm { display: none !important; }
        }
      `}</style>

      {/* Hero scroll section */}
      <section style={{ position: 'relative', width: '100%' }}>
        <HeroClient />
      </section>

      <main style={{ position: 'relative', zIndex: 10 }}>

        {/* Intro strip */}
        <section style={{ background: 'var(--bg)', padding: '128px 6vw 72px' }}>
          <p style={{
            fontFamily: '"Anton", sans-serif', fontWeight: 400,
            fontSize: 'clamp(24px, 3vw, 44px)', lineHeight: 1.14,
            letterSpacing: '-0.005em', margin: '24px 0 0'
          }}>
            Essays, product observations, and experiments from a PM thinking out loud.
          </p>
        </section>

        {/* Essays */}
        <section id="essays" style={{ background: 'var(--bg)', padding: '40px 6vw 120px' }}>
          <div className="sec-label">
            <span>Essays</span><span className="bar" /><span>15 musings</span>
          </div>
          <ul style={{
            listStyle: 'none', margin: '36px 0 0', padding: 0,
            borderTop: '2px solid var(--ink)'
          }}>
            {ESSAYS.map(({ title, category, color, href }) => (
              <li
                key={href}
                className="essay-row"
                style={{ '--cat': color }}
              >
                <a href={`https://www.denamurr.com${href}`}>
                  <span className="essay-cat">{category}</span>
                  <span className="essay-title">{title}</span>
                  <span className="essay-arrow">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Things I Built */}
        <section id="built" style={{ background: 'var(--yellow)', color: 'var(--ink)', padding: '110px 6vw 120px' }}>
          <div className="sec-label" style={{ opacity: 0.7 }}>
            <span>Things I Built</span><span className="bar" /><span>Play with them</span>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: 22,
            marginTop: 40
          }}>
            {/* Featured card */}
            <a
              className="tool-card tool-card-featured"
              href="https://www.denamurr.com/tools/roadmap-game"
              style={{ gridColumn: 'span 12' }}
            >
              <span style={{ fontSize: 40, lineHeight: 1, marginBottom: 'auto' }}>🎮</span>
              <span className="tool-kind" style={{
                fontFamily: '"Inter", sans-serif', fontSize: 12,
                fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase'
              }}>Interactive · Game</span>
              <span style={{
                fontFamily: '"Anton", sans-serif', fontWeight: 400,
                fontSize: 'clamp(28px, 3.2vw, 40px)', lineHeight: 0.98,
                letterSpacing: '-0.01em', margin: '18px 0 10px', display: 'block'
              }}>PM Survival Game</span>
              <span className="tool-desc" style={{
                fontFamily: '"Inter", sans-serif', fontSize: 15,
                lineHeight: 1.5, maxWidth: '38ch', display: 'block'
              }}>Navigate the chaos of a product launch. Make prioritization calls, handle stakeholders, and survive the roadmap.</span>
              <span style={{
                marginTop: 18, fontFamily: '"Inter", sans-serif',
                fontSize: 14, fontWeight: 600, display: 'inline-flex',
                alignItems: 'center', gap: 8
              }}>Play now →</span>
            </a>

            {/* Standard cards */}
            {[
              {
                kind: 'Tool',
                name: 'RICE Prioritization Tool',
                desc: 'Score and rank features using the RICE framework — Reach, Impact, Confidence, Effort.',
                cta: 'Open tool →',
                href: '/tools/rice',
                internal: true
              },
              {
                kind: 'Game',
                name: 'Wordle',
                desc: 'A PM-flavored Wordle. Guess the five-letter word in six tries.',
                cta: 'Play →',
                href: '/wordle',
                internal: true
              },
              {
                kind: 'Tool',
                name: 'AI Timeline',
                desc: 'An interactive timeline tracking major milestones in AI — from GPT-2 to today.',
                cta: 'Explore →',
                href: '/timeline',
                internal: true
              },
            ].map(({ kind, name, desc, cta, href, internal }) => (
              internal ? (
                <Link
                  key={name}
                  href={href}
                  className="tool-card"
                  style={{ gridColumn: 'span 6' }}
                >
                  <span className="tool-kind" style={{
                    fontFamily: '"Inter", sans-serif', fontSize: 12,
                    fontWeight: 600, letterSpacing: '0.12em',
                    textTransform: 'uppercase', opacity: 0.6
                  }}>{kind}</span>
                  <span style={{
                    fontFamily: '"Anton", sans-serif', fontWeight: 400,
                    fontSize: 'clamp(28px, 3.2vw, 40px)', lineHeight: 0.98,
                    letterSpacing: '-0.01em', margin: '18px 0 10px', display: 'block'
                  }}>{name}</span>
                  <span style={{
                    fontFamily: '"Inter", sans-serif', fontSize: 15,
                    lineHeight: 1.5, opacity: 0.72, maxWidth: '38ch', display: 'block'
                  }}>{desc}</span>
                  <span style={{
                    marginTop: 18, fontFamily: '"Inter", sans-serif',
                    fontSize: 14, fontWeight: 600, display: 'inline-flex',
                    alignItems: 'center', gap: 8
                  }}>{cta}</span>
                </Link>
              ) : (
                <a
                  key={name}
                  href={href}
                  className="tool-card"
                  style={{ gridColumn: 'span 6' }}
                >
                  <span className="tool-kind" style={{
                    fontFamily: '"Inter", sans-serif', fontSize: 12,
                    fontWeight: 600, letterSpacing: '0.12em',
                    textTransform: 'uppercase', opacity: 0.6
                  }}>{kind}</span>
                  <span style={{
                    fontFamily: '"Anton", sans-serif', fontWeight: 400,
                    fontSize: 'clamp(28px, 3.2vw, 40px)', lineHeight: 0.98,
                    letterSpacing: '-0.01em', margin: '18px 0 10px', display: 'block'
                  }}>{name}</span>
                  <span style={{
                    fontFamily: '"Inter", sans-serif', fontSize: 15,
                    lineHeight: 1.5, opacity: 0.72, maxWidth: '38ch', display: 'block'
                  }}>{desc}</span>
                  <span style={{
                    marginTop: 18, fontFamily: '"Inter", sans-serif',
                    fontSize: 14, fontWeight: 600, display: 'inline-flex',
                    alignItems: 'center', gap: 8
                  }}>{cta}</span>
                </a>
              )
            ))}
          </div>
          <style>{`
            @media (max-width: 760px) {
              .tool-card { grid-column: 1 / -1 !important; }
            }
          `}</style>
        </section>

        {/* About */}
        <section id="about" style={{
          background: 'var(--bg)', padding: '120px 6vw',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 60, alignItems: 'start'
        }}>
          <style>{`
            @media (max-width: 820px) {
              #about { grid-template-columns: 1fr !important; gap: 30px !important; }
            }
          `}</style>
          <h2 style={{
            fontFamily: '"Anton", sans-serif', fontWeight: 400,
            fontSize: 'clamp(40px, 6vw, 88px)', lineHeight: 0.95,
            letterSpacing: '-0.01em', margin: 0
          }}>About</h2>
          <div style={{ fontFamily: '"Inter", sans-serif', fontSize: 'clamp(17px, 1.5vw, 21px)', lineHeight: 1.6 }}>
            <p style={{ margin: '0 0 20px', maxWidth: '46ch' }}>
              I'm Dena — a <span style={{ color: 'var(--accent)', fontWeight: 600 }}>product manager</span> in San Francisco writing about AI, fintech, crypto, and investing.
            </p>
            <p style={{ margin: '0 0 20px', maxWidth: '46ch' }}>
              I build small PM tools and games, and I write essays to think out loud about how products work, why some win, and what the next thing might be.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 30 }}>
              {['AI', 'Fintech', 'Crypto', 'Investing', 'Product'].map(tag => (
                <span key={tag} style={{
                  fontFamily: '"Inter", sans-serif', fontSize: 13,
                  padding: '7px 14px', border: '1.5px solid var(--ink)',
                  borderRadius: 999
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Contact footer */}
      <footer id="contact" style={{
        padding: '96px 6vw 44px',
        background: 'var(--ink)', color: 'var(--bg)'
      }}>
        <div style={{
          fontFamily: '"Anton", sans-serif', fontWeight: 400,
          fontSize: 'clamp(24px, 4.5vw, 70px)', lineHeight: 0.9,
          letterSpacing: '-0.02em'
        }}>
          SAY<br />
          <a
            href="mailto:denamurr@gmail.com"
            style={{ color: 'var(--yellow)', textDecoration: 'none' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--yellow)'}
          >HELLO&nbsp;↗</a>
        </div>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '14px 28px', marginTop: 44,
          fontFamily: '"Inter", sans-serif', fontSize: 15
        }}>
          {[
            { label: 'denamurr@gmail.com', href: 'mailto:denamurr@gmail.com' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/denamurr' },
            { label: 'GitHub', href: 'https://github.com/denamurr' },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              style={{
                color: 'var(--bg)', textDecoration: 'none', opacity: 0.8,
                borderBottom: '1px solid transparent',
                transition: 'border-color 0.2s, opacity 0.2s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.opacity = '1'
                e.currentTarget.style.borderColor = 'var(--yellow)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.opacity = '0.8'
                e.currentTarget.style.borderColor = 'transparent'
              }}
            >
              {label}
            </a>
          ))}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap',
          gap: 10, fontFamily: '"Inter", sans-serif', fontSize: 13,
          opacity: 0.55, marginTop: 64
        }}>
          <span>Co-built with AI · San Francisco, CA</span>
          <span>© 2026 Dena Murr</span>
        </div>
      </footer>
    </>
  )
}
