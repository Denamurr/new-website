'use client'

import { useState } from 'react'

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { name: 'Home', href: '#' },
    { name: 'Tools', href: '#tools' },
    { name: 'Blog', href: '#blog' },
    { name: 'Projects', href: '#projects' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#" className="font-bold text-lg text-gray-900 hover:text-gray-900">
          Dena Murr
        </a>
        
        {/* Desktop nav */}
        <div className="hidden md:flex gap-8">
          {navItems.map(item => (
            <a
              key={item.name}
              href={item.href}
              className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-gray-600"
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

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-6 py-4">
          {navItems.map(item => (
            <a
              key={item.name}
              href={item.href}
              className="block py-2 text-gray-600 hover:text-blue-600"
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
