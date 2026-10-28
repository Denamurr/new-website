export const metadata = {
  title: 'What Kind of Product Manager Are You? — denamurr.com',
  description: 'This page moved to /tools/pm-personality-game.',
  robots: { index: false, follow: true },
}

export default function RoadmapGameMovedPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/tools/pm-personality-game" />
      <div style={{ fontFamily: 'sans-serif', textAlign: 'center', padding: '80px 24px' }}>
        <p>
          This game moved — redirecting you to{' '}
          <a href="/tools/pm-personality-game">/tools/pm-personality-game</a>.
        </p>
      </div>
    </>
  )
}
