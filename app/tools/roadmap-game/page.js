import Navigation from '../../../components/Navigation'
import RoadmapGameClient from '../../../components/RoadmapGameClient'

export const metadata = {
  title: "The Product Manager's Journey",
  description: 'A PM decision-making game. Six stages, five stats, one launch.',
}

export default function RoadmapGamePage() {
  return (
    <>
      <Navigation />
      <div className="pt-[61px]">
        <RoadmapGameClient />
      </div>
    </>
  )
}
