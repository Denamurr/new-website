import Image from 'next/image'
import Link from 'next/link'

const tools = [
  {
    href: '/tools/roadmap-game',
    title: 'PM Survival Game',
    label: 'Interactive',
    description: 'Navigate the chaos of a product launch. Make prioritization calls, handle stakeholders, and survive the roadmap.',
    image: null,
    gradient: 'linear-gradient(135deg, #0f2b1f 0%, #1a4a32 50%, #0a1f17 100%)',
    icon: '🎮',
    accentColor: '#3ecf8e',
  },
  {
    href: '/tools/rice',
    title: 'RICE Prioritization Tool',
    label: 'Tool',
    description: 'Score and rank features using the RICE framework — Reach, Impact, Confidence, Effort.',
    image: '/rice.png',
    gradient: null,
    accentColor: '#5b8dee',
  },
  {
    href: '/wordle',
    title: 'Wordle',
    label: 'Game',
    description: 'A PM-flavored Wordle. Guess the five-letter word in six tries.',
    image: '/wordle-preview.svg',
    gradient: null,
    accentColor: '#a78bfa',
  },
  {
    href: '/timeline',
    title: 'AI Timeline',
    label: 'Tool',
    description: 'An interactive timeline tracking major milestones in AI — from GPT-2 to today.',
    image: '/ai-timeline.png',
    gradient: 'linear-gradient(135deg, #0a1a2e 0%, #0f2744 50%, #071525 100%)',
    accentColor: '#38bdf8',
    imageBlend: 'multiply',
  },
]

export default function ToolsSection() {
  return (
    <section className="max-w-5xl mx-auto px-6 pb-16" id="tools">
      {/* Section header */}
      <div className="text-center mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: '#8899bb' }}>
          Things I Built
        </p>
        <svg width="80" height="12" viewBox="0 0 80 12" fill="none" className="mx-auto" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 6 C10 0, 20 12, 30 6 C40 0, 50 12, 60 6 C70 0, 80 12, 80 6" stroke="#5b8dee" strokeWidth="2" fill="none" strokeLinecap="round"/>
        </svg>
      </div>

      <div className="flex flex-col gap-4">
        {tools.map(tool => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex flex-col md:flex-row rounded-2xl overflow-hidden transition-transform duration-200 hover:-translate-y-0.5"
            style={{ background: '#1a2238', border: '1.5px solid rgba(255,255,255,0.14)' }}
          >
            {/* Image / gradient side */}
            <div className="relative w-full md:w-2/5 min-h-[180px] md:min-h-[220px] flex-shrink-0 flex items-center justify-center p-6" style={{ background: tool.gradient || 'rgba(255,255,255,0.03)' }}>
              {tool.image ? (
                <div className="relative w-full h-full">
                  <Image
                    src={tool.image}
                    alt={tool.title}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    style={tool.imageBlend ? { mixBlendMode: tool.imageBlend } : undefined}
                  />
                </div>
              ) : (
                <span className="text-5xl opacity-60">{tool.icon}</span>
              )}
            </div>

            {/* Content side */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <span
                className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3 self-start"
                style={{ background: `${tool.accentColor}22`, color: tool.accentColor }}
              >
                {tool.label}
              </span>
              <h2 className="text-xl md:text-2xl font-bold mb-3" style={{ color: '#e8edf8' }}>
                {tool.title}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: '#8899bb' }}>
                {tool.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
