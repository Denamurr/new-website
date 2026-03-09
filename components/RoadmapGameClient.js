'use client'
import { useState } from 'react'

const STATS_CONFIG = [
  { key: 'roadmap', label: 'Roadmap', color: 'bg-violet-500' },
  { key: 'morale',  label: 'Morale',  color: 'bg-emerald-500' },
  { key: 'trust',   label: 'Trust',   color: 'bg-sky-500' },
  { key: 'tech',    label: 'Tech',    color: 'bg-amber-500' },
  { key: 'quality', label: 'Quality', color: 'bg-rose-500' },
]

const INITIAL_STATS = { roadmap: 5, morale: 5, trust: 5, tech: 5, quality: 5 }

const STAGES = ['Discovery', 'Strategy', 'Design', 'Development', 'Testing', 'Launch']

// Cards in play order — legendaries interleaved
const CARD_SEQUENCE = [
  {
    type: 'stage',
    stage: 0,
    id: 'PM-001',
    title: "The Founder's Vision",
    epic: 'DISCOVERY',
    epicColor: 'bg-purple-100 text-purple-700',
    scenario: "The CEO loves three directions from discovery. Your team has capacity for one. A competitor is moving fast.",
    choices: [
      { label: "Go with the CEO's favorite",              effects: { trust: 1, morale: -1 },              consequence: "Team feels the direction wasn't user-driven. The CEO is happy — for now." },
      { label: "Run a quick validation sprint",           effects: { roadmap: -1, morale: 2 },            consequence: "One week slower, but everyone agrees on direction. Worth it." },
      { label: "Pick the option with strongest signal",   effects: { morale: 1, trust: 1 },               consequence: "Fast and defensible. Low drama. The team appreciates the clarity." },
      { label: "Scope a hybrid of all three",             effects: { roadmap: -2, morale: -2, quality: -1 }, consequence: "Nobody's happy and now you're behind. Classic." },
    ],
  },
  {
    type: 'stage',
    stage: 1,
    id: 'PM-012',
    title: 'The Competitor Move',
    epic: 'STRATEGY',
    epicColor: 'bg-blue-100 text-blue-700',
    scenario: "A competitor just launched a feature you hadn't planned. The CEO wants it added before launch.",
    choices: [
      { label: "Add it to the roadmap",                   effects: { roadmap: -1, trust: 1 },             consequence: "You said yes. The team adjusts. The roadmap quietly weeps." },
      { label: "Decline and explain the tradeoff",        effects: { morale: 1, trust: 1 },               consequence: "You held the line. CEO isn't thrilled, but the team trusts you more now." },
      { label: "Add it, cut a lower-priority feature",    effects: { morale: -1, quality: -1 },           consequence: "Churn. The team hates redoing work they already planned for." },
      { label: "Commit it to v2 with a clear rationale",  effects: { trust: 1, morale: 1 },               consequence: "You bought time and gave the CEO something to say at the board meeting." },
    ],
  },
  {
    type: 'legendary',
    stage: 1,
    id: 'PM-∞',
    title: 'The CEO Discovers AI',
    body: 'i listened to this podcast this weekend about AI. It sounds like its the future. Lets add AI to it.',
    choices: [
      { label: "Add AI feature immediately",              effects: { roadmap: -1, trust: 1, tech: -1 },   consequence: "It's on the roadmap. Nobody knows what the AI feature actually does yet." },
      { label: "Ask what problem it solves",              effects: { quality: 1, trust: -1 },             consequence: "Smart question. Wrong room. The CEO is now questioning your vision." },
      { label: 'Create an "AI strategy task force"',      effects: { trust: 1, morale: -1 },              consequence: "Kicked the can. The team knows what task forces actually produce." },
    ],
  },
  {
    type: 'stage',
    stage: 2,
    id: 'PM-023',
    title: 'The Confusing Navigation',
    epic: 'DESIGN',
    epicColor: 'bg-pink-100 text-pink-700',
    scenario: "User testing shows the core navigation is confusing. A full redesign would take 2 extra weeks.",
    choices: [
      { label: "Redesign now",                            effects: { roadmap: -1, morale: 1, quality: 2 }, consequence: "Slower, but the team is proud of what they're building." },
      { label: "Ship it and iterate post-launch",         effects: { morale: -1, quality: -1 },            consequence: "The team knows it's wrong. That sits with them. It'll sit with users too." },
      { label: "Quick fix that partially addresses it",   effects: { roadmap: -1, quality: 1 },            consequence: "Not ideal, but it moves the needle. Users will notice it's better. Mostly." },
      { label: "Dismiss the finding",                     effects: { morale: -2, quality: -2, trust: -1 }, consequence: "One tester's opinion, you said. The problem doesn't go away. It multiplies." },
    ],
  },
  {
    type: 'stage',
    stage: 3,
    id: 'PM-034',
    title: 'Three Weeks Behind',
    epic: 'DEVELOPMENT',
    epicColor: 'bg-orange-100 text-orange-700',
    scenario: "Your lead dev says you're 3 weeks behind schedule. Everyone is looking at you.",
    choices: [
      { label: "Bring in contractors",                    effects: { roadmap: 2, morale: -1, tech: -1 },  consequence: "Timeline recovers but the team has friction with the new people." },
      { label: "Cut a feature",                           effects: { morale: 1, quality: 1 },             consequence: "Less to build. The team breathes again. Sometimes the right answer is less." },
      { label: "Push the team to crunch",                 effects: { roadmap: 1, morale: -3 },            consequence: "You recover some time. One engineer just updated their LinkedIn." },
      { label: "Push the launch date",                    effects: { roadmap: 2, morale: 1, trust: -1 },  consequence: "More time, team relieved. CEO is unhappy. That's a problem for future-you." },
    ],
  },
  {
    type: 'legendary',
    stage: 3,
    id: 'PM-∞∞',
    title: 'The All-Hands Reorg',
    body: 'hey quick heads up — restructuring announcement going out tomorrow. your team is moving under infrastructure now. no changes to your roadmap tho :)',
    choices: [
      { label: "Absorb it and move forward",              effects: { morale: -1, trust: 1 },              consequence: "You stayed calm. The team noticed. So did the new infra lead, who has opinions about your backlog." },
      { label: "Schedule a team offsite immediately",     effects: { morale: 2, roadmap: -1 },            consequence: "Team loves it. Roadmap loses a week. The team thinks it was worth it." },
      { label: "Ask for clarity before committing",       effects: { trust: 1, morale: 1 },               consequence: "Reasonable. Respected. You've been around long enough to know what 'no changes' actually means." },
    ],
  },
  {
    type: 'stage',
    stage: 4,
    id: 'PM-045',
    title: 'The Critical Bug',
    epic: 'TESTING',
    epicColor: 'bg-red-100 text-red-700',
    scenario: "QA finds a critical bug 2 days before launch. It affects 20% of users but isn't a total blocker.",
    choices: [
      { label: "Delay launch to fix it",                  effects: { roadmap: -1, morale: 1, quality: 1 }, consequence: "The right call. Painful, but clean. Stakeholders grumble. Users never notice." },
      { label: "Launch and hotfix within 24 hours",       effects: { morale: -1, trust: -1 },              consequence: "You'll probably be fine. Probably. The team knows what 'probably' means here." },
      { label: "Remove the affected feature",             effects: { quality: 1 },                         consequence: "Clean solution. Nothing ships broken. Users get less, but what ships works." },
      { label: "Ship anyway",                             effects: { morale: -3, trust: -2, quality: -2 }, consequence: "Nobody said a word. On Slack, at least. Twitter is a different story." },
    ],
  },
  {
    type: 'stage',
    stage: 5,
    id: 'PM-056',
    title: 'Traffic Spike',
    epic: 'LAUNCH',
    epicColor: 'bg-green-100 text-green-700',
    scenario: "Launch day. Traffic is 3x what you load tested for. The site is slowing down.",
    choices: [
      { label: "Rollback",                                effects: { roadmap: -1, morale: -2, trust: -1 }, consequence: "Safe. Embarrassing. The post-mortem will be a long one." },
      { label: "Scale up servers immediately",            effects: { morale: 1, tech: 1, trust: 1 },       consequence: "Costs more. Works. This is why you documented the runbooks." },
      { label: "Post status updates and wait",            effects: { morale: -1, trust: -1 },              consequence: "Transparent. Users aren't happy but they know what's happening." },
      { label: "Throttle new user onboarding temporarily", effects: { tech: 1, quality: 1 },               consequence: "Keeps the lights on. Minor friction. The existing users barely notice." },
    ],
  },
]

const OUTCOME_TIERS = [
  {
    name: 'Complete Disaster',
    flavor: {
      roadmap: "The roadmap was aspirational. The timeline was fiction. You shipped... something.",
      morale:  "The team is gone. Not literally — but spiritually, they left three sprints ago.",
      trust:   "Nobody believes the estimates anymore. Not the CEO, not the board, not your dog.",
      tech:    "Technical debt has accrued to the point where 'refactor' is just a way of saying goodbye.",
      quality: "Users found the bugs before QA did. All of them. At once.",
      default: "Every resource hit zero. This is a learning experience. A very expensive one.",
    },
  },
  {
    name: 'Multiple System Failures',
    flavor: {
      roadmap: "You shipped late, and the roadmap tells the story of every decision that led here.",
      morale:  "The team is intact but tired. There will be a lot of 1:1s in your immediate future.",
      trust:   "Stakeholders are managing expectations downward. Quietly.",
      tech:    "The codebase has feelings now. They are not positive.",
      quality: "The product works. 'Works' is doing a lot of heavy lifting in that sentence.",
      default: "You made it to launch. Several things are on fire but you made it.",
    },
  },
  {
    name: 'Rough Ride',
    flavor: {
      roadmap: "The roadmap looked different in Q1. It looks different now. It'll probably change again.",
      morale:  "The team is fine. 'Fine' in the way that means functional but not inspired.",
      trust:   "Trust is intact but thinner than you'd like. Handle with care.",
      tech:    "Tech health is serviceable. It won't win awards but it won't wake you up at 3am. Probably.",
      quality: "Users can feel the shortcuts. They'll give you one more chance.",
      default: "You got there, but you felt every bump. The retro will be long.",
    },
  },
  {
    name: 'Battle-Worn PM',
    flavor: {
      roadmap: "Not every deadline was honored, but every decision was deliberate. Mostly.",
      morale:  "The team trusts you. They've seen you make hard calls. They'd follow you into another sprint.",
      trust:   "Stakeholders know what they're getting. No surprises. That's worth something.",
      tech:    "The codebase is holding. It's not elegant but it's honest.",
      quality: "Good product. A few rough edges. Shippable. Improvable.",
      default: "You took some hits and kept moving. This is what experienced PMs look like.",
    },
  },
  {
    name: 'The Clean Launch',
    flavor: {
      roadmap: "You shipped what you said you'd ship, when you said you'd ship it. Frame this.",
      morale:  "The team is proud. That's the one metric that doesn't go in a dashboard.",
      trust:   "Stakeholders are already asking about v2. That's trust.",
      tech:    "The codebase is clean. Engineers are writing about it in their internal wikis.",
      quality: "Users noticed. In a good way. For once.",
      default: "You made the calls that mattered. The team trusted you. The product shipped clean.",
    },
  },
]

function getOutcome(stats) {
  const entries = Object.entries(stats)
  const worstEntry = entries.reduce((a, b) => (b[1] < a[1] ? b : a))
  const [worstKey, worstVal] = worstEntry
  let tier
  if (worstVal >= 7) tier = 4
  else if (worstVal >= 5) tier = 3
  else if (worstVal >= 3) tier = 2
  else if (worstVal >= 1) tier = 1
  else tier = 0
  const outcome = OUTCOME_TIERS[tier]
  return { name: outcome.name, flavorText: outcome.flavor[worstKey] || outcome.flavor.default, tier, worstKey }
}

function clamp(v) { return Math.max(0, Math.min(10, v)) }

function applyEffects(stats, effects) {
  const next = { ...stats }
  for (const [k, v] of Object.entries(effects)) next[k] = clamp(next[k] + v)
  return next
}

function formatEffect(key, val) {
  const cfg = STATS_CONFIG.find(s => s.key === key)
  const sign = val > 0 ? '+' : ''
  return `${cfg.label} ${sign}${val}`
}

// ── Components ──────────────────────────────────────────────────────────────

function StatBar({ label, value, color }) {
  let barColor = color
  if (value <= 2) barColor = 'bg-red-500'
  else if (value <= 4) barColor = 'bg-yellow-400'
  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="text-xs text-gray-500 w-14 shrink-0">{label}</span>
      <div className="flex gap-0.5">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={`w-3 h-3 rounded-sm transition-colors ${i < value ? barColor : 'bg-gray-200'}`} />
        ))}
      </div>
      <span className="text-xs text-gray-400 w-4">{value}</span>
    </div>
  )
}

function JiraModal({ card, onChoice, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-lg shadow-2xl overflow-hidden">
        <div className="bg-white px-5 pt-5 pb-4">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-mono text-gray-400">{card.id}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${card.epicColor}`}>{card.epic}</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-900">{card.title}</h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm shrink-0 mt-1">✕</button>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{card.scenario}</p>
        </div>
        <div className="bg-gray-50 px-5 pb-5 pt-4 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">Choose a response</p>
          {card.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => onChoice(choice)}
              className="w-full text-left rounded-md border border-gray-200 bg-white px-4 py-3 text-sm hover:border-blue-400 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="text-gray-800">{choice.label}</span>
                <span className="text-xs shrink-0 mt-0.5 font-mono text-gray-400">
                  {Object.entries(choice.effects).map(([k, v]) => formatEffect(k, v)).join(' · ')}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function SlackModal({ card, onChoice, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden" style={{ background: '#1a1d21' }}>
        <div className="flex items-center gap-1.5 px-3 pt-2.5 pb-2" style={{ background: '#1a1d21' }}>
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28ca41]" />
        </div>
        <div className="flex" style={{ minHeight: '400px' }}>
          <div className="w-52 shrink-0 flex flex-col pt-1" style={{ background: '#3F0E40' }}>
            <div className="px-3 py-2 flex items-center justify-between">
              <span className="text-white font-bold text-sm">Acme Product Co</span>
            </div>
            <div className="px-2 mt-1 space-y-0.5">
              {['Home', 'DMs', 'Activity'].map(item => (
                <div key={item} className="flex items-center gap-2 px-2 py-1 rounded text-white/50 text-xs">
                  <div className="w-3.5 h-3.5 rounded-sm bg-white/20" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-3 px-3 mb-1">
              <span className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">Channels</span>
            </div>
            {['general', 'eng-team', 'design-sync', 'all-hands'].map(ch => (
              <div key={ch} className={`mx-1 px-2 py-1 rounded flex items-center gap-1.5 text-xs ${ch === 'all-hands' ? 'bg-[#1264A3] text-white font-semibold' : 'text-white/50'}`}>
                <span className="text-white/60">#</span>
                <span>{ch}</span>
                {ch === 'all-hands' && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">1</span>}
              </div>
            ))}
            <div className="mt-3 px-3 mb-1">
              <span className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">Direct Messages</span>
            </div>
            {[{ name: 'Jordan Chen (CEO)', dot: 'bg-green-400' }, { name: 'You', dot: 'bg-gray-500' }].map(u => (
              <div key={u.name} className="mx-1 px-2 py-1 rounded text-white/40 text-xs flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${u.dot} shrink-0`} />
                {u.name}
              </div>
            ))}
          </div>
          <div className="flex-1 bg-white flex flex-col min-w-0">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900"># all-hands</span>
                <span className="text-xs text-gray-400">24 members</span>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
            </div>
            <div className="flex-1 px-4 py-3 overflow-y-auto">
              <div className="flex gap-2.5 mb-4 opacity-40">
                <div className="w-8 h-8 rounded bg-violet-400 shrink-0 flex items-center justify-center text-white text-xs font-bold">SR</div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-bold text-gray-900">Sarah R.</span>
                    <span className="text-[11px] text-gray-400">9:41 AM</span>
                  </div>
                  <p className="text-xs text-gray-500">Anyone see the Q3 board deck yet?</p>
                </div>
              </div>
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded bg-amber-400 shrink-0 flex items-center justify-center text-white text-sm font-bold">JC</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-sm font-bold text-gray-900">Jordan Chen</span>
                    <span className="text-[11px] text-gray-400">just now</span>
                    <span className="text-[10px] bg-green-100 text-green-700 px-1 rounded">active</span>
                  </div>
                  <p className="text-sm text-gray-800 leading-relaxed">{card.body}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className="text-base hover:bg-gray-100 rounded px-1 cursor-pointer">😰</span>
                    <span className="text-base hover:bg-gray-100 rounded px-1 cursor-pointer">🤔</span>
                    <span className="text-base hover:bg-gray-100 rounded px-1 cursor-pointer">🙃</span>
                  </div>
                  <button className="mt-1.5 text-[11px] text-[#1264A3] font-semibold">3 replies · View thread</button>
                </div>
              </div>
              <div className="flex items-center gap-2 my-3">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-[11px] text-gray-400 font-medium">Reply as yourself</span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>
              <div className="space-y-1.5">
                <p className="text-[11px] text-gray-400 mb-2">How do you respond?</p>
                {card.choices.map((choice, i) => (
                  <button
                    key={i}
                    onClick={() => onChoice(choice)}
                    className="w-full text-left rounded border border-gray-200 px-3 py-2 text-sm bg-white hover:border-[#1264A3] hover:bg-blue-50 transition-all"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-gray-800">{choice.label}</span>
                      <span className="text-[11px] shrink-0 font-mono text-gray-400">
                        {Object.entries(choice.effects).map(([k, v]) => formatEffect(k, v)).join(' · ')}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-gray-200 px-3 py-2">
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className="flex items-center gap-2 px-2 py-1.5 border-b border-gray-200 bg-gray-50">
                  {['B', 'I', 'S'].map(f => (
                    <button key={f} className="text-xs text-gray-400 font-bold w-5 h-5 hover:bg-gray-200 rounded">{f}</button>
                  ))}
                </div>
                <div className="px-3 py-2 text-sm text-gray-300">Message #all-hands</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConsequenceScreen({ consequence, effects, onContinue }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full max-w-sm bg-white rounded-xl shadow-2xl p-6">
        <p className="text-sm text-gray-700 leading-relaxed mb-5">{consequence}</p>
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(effects).map(([k, v]) => {
            const cfg = STATS_CONFIG.find(s => s.key === k)
            const positive = v > 0
            return (
              <span key={k} className={`text-xs font-mono font-semibold px-2 py-1 rounded ${positive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                {cfg.label} {positive ? '+' : ''}{v}
              </span>
            )
          })}
        </div>
        <button
          onClick={onContinue}
          className="w-full bg-blue-600 text-white text-sm font-medium py-2.5 rounded-md hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

function OutcomeScreen({ stats, onRestart }) {
  const { name, flavorText, tier } = getOutcome(stats)
  const tierColors = ['text-red-600', 'text-orange-500', 'text-yellow-600', 'text-blue-600', 'text-emerald-600']
  return (
    <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-4">
          <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">Launch Outcome</div>
          <h1 className={`text-2xl font-bold mb-4 ${tierColors[tier]}`}>{name}</h1>
          <p className="text-sm text-gray-600 leading-relaxed mb-6">{flavorText}</p>
          <div className="space-y-2 border-t border-gray-100 pt-5">
            {STATS_CONFIG.map(s => (
              <StatBar key={s.key} label={s.label} value={stats[s.key]} color={s.color} />
            ))}
          </div>
        </div>
        <button
          onClick={onRestart}
          className="w-full bg-blue-600 text-white text-sm font-medium py-2.5 rounded-md hover:bg-blue-700 transition-colors"
        >
          Play Again
        </button>
      </div>
    </div>
  )
}

// ── Main game component ──────────────────────────────────────────────────────

export default function RoadmapGameClient() {
  const [gameState, setGameState] = useState('intro') // intro | playing | consequence | outcome
  const [cardIndex, setCardIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [stats, setStats] = useState(INITIAL_STATS)
  const [pending, setPending] = useState(null) // { effects, consequence }
  const [completedCards, setCompletedCards] = useState(new Set())

  const currentCard = CARD_SEQUENCE[cardIndex]
  const currentStageIndex = currentCard ? currentCard.stage : 5

  function handleStart() {
    setGameState('playing')
    setModalOpen(false)
  }

  function handleCardClick() {
    setModalOpen(true)
  }

  function handleChoice(choice) {
    const newStats = applyEffects(stats, choice.effects)
    setStats(newStats)
    setPending({ effects: choice.effects, consequence: choice.consequence })
    setModalOpen(false)
    setCompletedCards(prev => new Set([...prev, cardIndex]))
    setGameState('consequence')
  }

  function handleContinue() {
    const nextIndex = cardIndex + 1
    if (nextIndex >= CARD_SEQUENCE.length) {
      setGameState('outcome')
    } else {
      setCardIndex(nextIndex)
      setGameState('playing')
    }
    setPending(null)
  }

  function handleRestart() {
    setGameState('intro')
    setCardIndex(0)
    setModalOpen(false)
    setStats(INITIAL_STATS)
    setPending(null)
    setCompletedCards(new Set())
  }

  if (gameState === 'outcome') {
    return <OutcomeScreen stats={stats} onRestart={handleRestart} />
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7] font-sans">

      {/* Top nav */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-600 rounded grid grid-cols-3 gap-0.5 p-1">
            {Array.from({ length: 9 }).map((_, i) => <div key={i} className="bg-white rounded-sm opacity-80" />)}
          </div>
          <div>
            <div className="text-xs text-gray-400">Projects</div>
            <div className="text-sm font-semibold text-gray-800">The Product Manager's Journey</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {['bg-violet-400', 'bg-sky-400', 'bg-emerald-400', 'bg-amber-400'].map((c, i) => (
              <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white`} />
            ))}
          </div>
          {gameState === 'intro' ? (
            <button onClick={handleStart} className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded font-medium hover:bg-blue-700">
              Start Sprint
            </button>
          ) : (
            <button onClick={handleRestart} className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5 rounded hover:bg-gray-100">
              Resign from Product
            </button>
          )}
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 max-w-5xl">
          {STATS_CONFIG.map(s => (
            <StatBar key={s.key} label={s.label} value={stats[s.key]} color={s.color} />
          ))}
        </div>
      </div>

      {/* Sprint label */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <span className="text-sm font-semibold text-gray-700">
          {gameState === 'intro' ? 'Sprint 1 of 6' : `Sprint ${currentStageIndex + 1} of 6`}
        </span>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">
          {STAGES[currentStageIndex]}
        </span>
        {currentCard?.type === 'legendary' && (
          <span className="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded">URGENT</span>
        )}
      </div>

      {/* Board */}
      <div className="px-4 pb-8 overflow-x-auto">
        <div className="flex gap-3 min-w-max">
          {STAGES.map((stage, si) => {
            const isActive = si === currentStageIndex
            const isCompleted = si < currentStageIndex
            const isLocked = si > currentStageIndex

            // Cards to show in this column
            const stageCards = CARD_SEQUENCE.filter(c => c.stage === si)
            const completedInStage = stageCards.filter((_, i) => {
              const globalIdx = CARD_SEQUENCE.indexOf(stageCards[i])
              return completedCards.has(globalIdx)
            })
            const pendingInStage = stageCards.filter((_, i) => {
              const globalIdx = CARD_SEQUENCE.indexOf(stageCards[i])
              return !completedCards.has(globalIdx)
            })

            return (
              <div key={stage} className={`w-56 ${isLocked && gameState !== 'intro' ? 'opacity-40' : ''} ${gameState === 'intro' && si > 0 ? 'opacity-40' : ''}`}>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
                    {stage}
                  </span>
                  {isActive && gameState === 'playing' && (
                    <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 font-medium">
                      {pendingInStage.length}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {/* Completed cards in this stage */}
                  {completedInStage.map((card, i) => (
                    <div key={i} className="w-full rounded border border-gray-200 bg-white p-3 opacity-50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">{card.id}</span>
                        <span className="text-xs text-emerald-600">Done</span>
                      </div>
                      <p className="text-xs text-gray-400 line-through">{card.title}</p>
                    </div>
                  ))}

                  {/* Active/pending cards */}
                  {isActive && gameState === 'playing' && pendingInStage.map((card, i) => {
                    const isCurrentCard = card === currentCard
                    const isLegendary = card.type === 'legendary'
                    return (
                      <button
                        key={i}
                        onClick={isCurrentCard ? handleCardClick : undefined}
                        className={`w-full text-left rounded border-2 p-3 transition-all ${
                          isCurrentCard
                            ? isLegendary
                              ? 'border-red-400 bg-red-50 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                              : 'border-dashed border-blue-400 bg-blue-50 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
                            : 'border-dashed border-gray-200 bg-gray-50 opacity-50 cursor-default'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className={`h-2.5 rounded w-16 ${isLegendary ? 'bg-red-200' : 'bg-gray-200'}`} />
                          {isLegendary && (
                            <span className="text-xs font-semibold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">URGENT</span>
                          )}
                          {isCurrentCard && !isLegendary && (
                            <span className="text-xs text-blue-500 font-medium">Click to draw</span>
                          )}
                        </div>
                        <div className={`h-2 rounded w-3/4 mb-1.5 ${isLegendary ? 'bg-red-100' : 'bg-gray-200'}`} />
                        <div className={`h-2 rounded w-1/2 ${isLegendary ? 'bg-red-100' : 'bg-gray-200'}`} />
                      </button>
                    )
                  })}

                  {/* Intro state — face down placeholder */}
                  {gameState === 'intro' && si === 0 && (
                    <div className="w-full rounded border-2 border-dashed border-gray-300 bg-gray-50 p-3">
                      <div className="h-2.5 rounded w-16 bg-gray-200 mb-2" />
                      <div className="h-2 rounded w-3/4 mb-1.5 bg-gray-200" />
                      <div className="h-2 rounded w-1/2 bg-gray-200" />
                    </div>
                  )}

                  {/* Locked columns */}
                  {(isLocked || (gameState === 'intro' && si > 0)) && (
                    <div className="rounded border border-dashed border-gray-200 bg-gray-50 p-3 text-center">
                      <span className="text-xs text-gray-300">Locked</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Modals */}
      {modalOpen && currentCard?.type === 'stage' && (
        <JiraModal card={currentCard} onChoice={handleChoice} onClose={() => setModalOpen(false)} />
      )}
      {modalOpen && currentCard?.type === 'legendary' && (
        <SlackModal card={currentCard} onChoice={handleChoice} onClose={() => setModalOpen(false)} />
      )}
      {gameState === 'consequence' && pending && (
        <ConsequenceScreen consequence={pending.consequence} effects={pending.effects} onContinue={handleContinue} />
      )}
    </div>
  )
}
