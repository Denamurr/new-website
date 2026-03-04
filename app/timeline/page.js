import Navigation from '../../components/Navigation'
import TimelineClient from '../../components/TimelineClient'
import entries from '../../data/timeline-entries.json'

export const metadata = {
  title: 'AI Timeline | Dena Murr',
  description: 'Key AI model releases, research papers, and announcements — curated by hand.',
}

export default function TimelinePage() {
  return (
    <main className="bg-white">
      <Navigation />
      <TimelineClient entries={entries} />
    </main>
  )
}
