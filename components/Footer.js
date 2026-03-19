'use client'

export default function Footer() {
  const links = [
    { name: 'LinkedIn', href: 'https://linkedin.com/in/denamurr' },
    { name: 'GitHub', href: 'https://github.com/denamurr' },
    { name: 'Email', href: 'mailto:denamurr@gmail.com' },
  ]

  return (
    <footer className="py-12" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-5xl mx-auto px-6 text-center">
        <p className="text-sm mb-4" style={{ color: '#8899bb' }}>
          Built with AI · San Francisco, CA
        </p>
        <div className="flex justify-center gap-6">
          {links.map(link => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm transition-colors"
              style={{ color: '#8899bb' }}
              onMouseEnter={e => e.target.style.color = '#e8edf8'}
              onMouseLeave={e => e.target.style.color = '#8899bb'}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.name}
            </a>
          ))}
        </div>
        <p className="text-xs mt-6" style={{ color: '#4a5568' }}>
          © {new Date().getFullYear()} Dena Murr
        </p>
      </div>
    </footer>
  )
}
