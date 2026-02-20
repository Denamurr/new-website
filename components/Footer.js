export default function Footer() {
  const links = [
    { name: 'LinkedIn', href: 'https://linkedin.com/in/denamurr' },
    { name: 'GitHub', href: 'https://github.com/denamurr' },
    { name: 'Email', href: 'mailto:denamurr@gmail.com' },
  ]

  return (
    <footer className="py-12 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p className="text-sm text-gray-500 mb-4">
          Built with AI · San Francisco, CA
        </p>
        <div className="flex justify-center gap-6">
          {links.map(link => (
            <a 
              key={link.name}
              href={link.href}
              className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.name}
            </a>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} Dena Murr
        </p>
      </div>
    </footer>
  )
}
