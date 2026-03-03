import Navigation from '../../../components/Navigation'
import RiceClient from '../../../components/RiceClient'

export const metadata = {
  title: 'RICE Prioritization | Dena Murr',
  description: 'Score and rank features using the RICE framework — Reach, Impact, Confidence, Effort.',
}

export default function RicePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navigation />
      <RiceClient />
    </main>
  )
}
