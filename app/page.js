import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import Tools from '../components/Tools'
import LabDashboard from '../components/LabDashboard'
import Projects from '../components/Projects'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Navigation />
      <Hero />
      <Tools />
      <LabDashboard />
      <Projects />
      <Footer />
    </main>
  )
}
