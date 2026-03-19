import Navigation from '../components/Navigation'
import FeaturedSection from '../components/FeaturedSection'
import ToolsSection from '../components/ToolsSection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen" style={{ background: '#131929' }}>
      <Navigation />
      <FeaturedSection />
      <ToolsSection />
      <Footer />
    </main>
  )
}
