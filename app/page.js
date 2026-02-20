import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
import Tools from '../components/Tools'
import Blog from '../components/Blog'
import Projects from '../components/Projects'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa]">
      <Navigation />
      <Hero />
      <Tools />
      <Blog />
      <Projects />
      <Footer />
    </main>
  )
}
