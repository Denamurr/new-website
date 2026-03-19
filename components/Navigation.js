'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { name: 'Essays', href: '#essays' },
    { name: 'About', href: '#about' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: '#131929', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-5xl mx-auto px-6 pt-4 pb-2 flex justify-between items-center">
        <Link href="/" className="font-bold text-lg tracking-tight" style={{ color: '#e8edf8' }}>
          Dena Murr
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex gap-8 items-center">
          {navItems.map(item => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm transition-colors"
              style={{ color: '#8899bb' }}
              onMouseEnter={e => e.target.style.color = '#e8edf8'}
              onMouseLeave={e => e.target.style.color = '#8899bb'}
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          style={{ color: '#8899bb' }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Subtitle bar */}
      <div className="max-w-5xl mx-auto px-6 pb-2.5">
        <p className="text-xs" style={{ color: '#8899bb' }}>
          Essays, product observations, and experiments from a PM thinking out loud.
        </p>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden px-6 py-4" style={{ background: '#1a2238', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {navItems.map(item => (
            <a
              key={item.name}
              href={item.href}
              className="block py-2 text-sm"
              style={{ color: '#8899bb' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.name}
            </a>
          ))}
        </div>
      )}
    </nav>
  )
}
