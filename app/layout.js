import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'Dena Murr | Product Manager',
  description: 'Product Manager writing about AI, Fintech, Crypto, and Investing. Building PM tools and sharing what I learn.',
  keywords: ['product manager', 'fintech', 'AI', 'crypto', 'investing', 'San Francisco'],
  authors: [{ name: 'Dena Murr' }],
  openGraph: {
    title: 'Dena Murr | Product Manager',
    description: 'Product Manager writing about AI, Fintech, Crypto, and Investing.',
    url: 'https://denamurr.com',
    siteName: 'Dena Murr',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dena Murr | Product Manager',
    description: 'Product Manager writing about AI, Fintech, Crypto, and Investing.',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-B57M7XDXQV" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-B57M7XDXQV');
        `}</Script>
        {children}
      </body>
    </html>
  )
}
