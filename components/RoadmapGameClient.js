'use client'
import { useState, useMemo } from 'react'

const STATS_CONFIG = [
  { key: 'roadmap', label: 'Roadmap', color: 'bg-violet-500' },
  { key: 'morale',  label: 'Morale',  color: 'bg-emerald-500' },
  { key: 'trust',   label: 'Trust',   color: 'bg-sky-500' },
  { key: 'tech',    label: 'Tech',    color: 'bg-amber-500' },
  { key: 'quality', label: 'Quality', color: 'bg-rose-500' },
]

const INITIAL_STATS = { roadmap: 5, morale: 5, trust: 5, tech: 5, quality: 5 }
const STAGES = ['Discovery', 'Strategy', 'Design', 'Development', 'Testing', 'Launch']

// ── Card pools — 4+ per stage, 3 drawn per game ──────────────────────────────

const STAGE_POOLS = {
  0: [ // Discovery
    {
      id: 'PM-001', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "The CEO loves three directions from discovery. Your team has capacity for one. A competitor is moving fast. What do you do?",
      choices: [
        { label: "Go with the CEO's favorite",            effects: { trust: 1, morale: -1 },               consequence: "Team feels the direction wasn't user-driven. The CEO is happy — for now." },
        { label: "Run a quick validation sprint",         effects: { roadmap: -1, morale: 2 },             consequence: "One week slower, but everyone agrees on direction. Worth it." },
        { label: "Pick the option with strongest signal", effects: { morale: 1, trust: 1 },                consequence: "Fast and defensible. Low drama. The team appreciates the clarity." },
        { label: "Scope a hybrid of all three",           effects: { roadmap: -2, morale: -2, quality: -1 }, consequence: "Nobody's happy and now you're behind. Classic." },
      ],
    },
    {
      id: 'PM-002', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "Three different stakeholders have given you three completely different definitions of success for this product. The exec alignment meeting is next week. What do you do?",
      choices: [
        { label: "Synthesize all three into one definition",  effects: { roadmap: -1, trust: 1, morale: -1 }, consequence: "You tried to make everyone happy. The definition is vague but nobody's angry. Yet." },
        { label: "Schedule 1:1s with each before the meeting", effects: { trust: 2, morale: 1 },             consequence: "Slower but cleaner. Everyone feels heard and the meeting actually goes well." },
        { label: "Default to the CEO's view",                 effects: { trust: 1, morale: -1 },             consequence: "Expedient. But your PM instincts are quietly crying." },
        { label: "Write a framing doc and circulate it",      effects: { quality: 1, trust: 1 },             consequence: "You created alignment the right way. That's the job." },
      ],
    },
    {
      id: 'PM-003', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "Your user research is thin — 5 interviews and a survey with 40 responses. Your designer wants more before moving forward. What do you do?",
      choices: [
        { label: "Run 10 more interviews",             effects: { roadmap: -1, quality: 2 },           consequence: "It costs time. The insights you get are worth it." },
        { label: "Proceed with what you have",         effects: { quality: -1, roadmap: 1 },           consequence: "You move fast. The assumptions you're carrying will surface later." },
        { label: "Run a 2-day focused research sprint", effects: { roadmap: -1, morale: 1, quality: 1 }, consequence: "Structured and fast. The team feels good about the direction." },
        { label: "Hire a research firm",               effects: { roadmap: 1, trust: -1, quality: 1 }, consequence: "Budget raised eyebrows. Results were fine." },
      ],
    },
    {
      id: 'PM-004', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "A key assumption in your discovery — that users would pay for the premium tier — just got challenged by a sales rep who says customers keep saying no. What do you do?",
      choices: [
        { label: "Go back to users and validate",       effects: { roadmap: -1, quality: 2, trust: -1 }, consequence: "You pumped the brakes. It stings now. It would have stung more later." },
        { label: "Trust the original research",         effects: { quality: -1, roadmap: 1 },            consequence: "You pressed on. The sales rep was right." },
        { label: "Adjust pricing model and move on",    effects: { trust: 1, roadmap: -1, quality: 1 }, consequence: "Fast pivot. Messy, but the instinct was right." },
        { label: "Flag the risk and continue anyway",   effects: { trust: 1, quality: -1 },              consequence: "At least it's documented. When it comes up later, you'll have cover." },
      ],
    },
  ],

  1: [ // Strategy
    {
      id: 'PM-011', epic: 'STRATEGY', epicColor: 'bg-blue-100 text-blue-700',
      scenario: "A competitor just launched a feature you hadn't planned to include in the product. Now the CEO wants it added before launch. What do you do?",
      choices: [
        { label: "Add it to the roadmap",                  effects: { roadmap: -1, trust: 1 },            consequence: "You said yes. The team adjusts. The roadmap quietly weeps." },
        { label: "Decline and explain the tradeoff",       effects: { morale: 1, trust: 1 },              consequence: "You held the line. The CEO isn't thrilled, but the team trusts you more now." },
        { label: "Add it, cut a lower-priority feature",   effects: { morale: -1, quality: -1 },          consequence: "Churn. The team hates redoing work they already planned for." },
        { label: "Commit it to v2 with a clear rationale", effects: { trust: 1, morale: 1 },              consequence: "You bought time and gave the CEO something to say at the board meeting." },
      ],
    },
    {
      id: 'PM-012', epic: 'STRATEGY', epicColor: 'bg-blue-100 text-blue-700',
      scenario: "The engineering lead flags that the scope has quietly grown 30% since kickoff. Nobody formally approved it. What do you do?",
      choices: [
        { label: "Acknowledge it and formally cut back",  effects: { roadmap: 1, morale: 1, quality: -1 }, consequence: "Painful but honest. The team respects the reset." },
        { label: "Keep it — it all seems valuable",       effects: { roadmap: -2, morale: -1 },            consequence: "You said yes to everything. Everything is now late." },
        { label: "Document what crept in and make it official", effects: { trust: 1, roadmap: -1 },        consequence: "At least it's honest. Stakeholders now know what they're getting." },
        { label: "Push back and blame the requestors",    effects: { morale: -2, trust: -1 },              consequence: "Technically true. Politically disastrous." },
      ],
    },
    {
      id: 'PM-013', epic: 'STRATEGY', epicColor: 'bg-blue-100 text-blue-700',
      scenario: "The team can't agree on the north star metric. Marketing wants MAU. Product wants activation rate. Engineering wants uptime. What do you do?",
      choices: [
        { label: "Call a meeting and decide together",      effects: { morale: 1, trust: 1, roadmap: -1 },  consequence: "Inclusive. Slower. But everyone's bought in." },
        { label: "Pick activation rate — it best reflects value", effects: { quality: 1, morale: 1 },      consequence: "Good call. Activation actually measures whether the product works." },
        { label: "Let each team track their own metric",    effects: { roadmap: 1, quality: -1 },           consequence: "You avoided conflict. You also created three different definitions of success." },
        { label: "Escalate to the CEO to decide",           effects: { trust: -1, roadmap: 1 },             consequence: "You passed the buck. It works, but everyone noticed." },
      ],
    },
    {
      id: 'PM-014', epic: 'STRATEGY', epicColor: 'bg-blue-100 text-blue-700',
      scenario: "Your MVP scope is set, but two engineers say a core feature is technically not feasible in the timeline. This is the first you're hearing of it. What do you do?",
      choices: [
        { label: "Reset the timeline",                    effects: { roadmap: -2, trust: -1, morale: 1 },  consequence: "Honest. Expensive. The team is relieved you didn't try to force it." },
        { label: "Find a technical workaround together",   effects: { tech: 1, morale: 1, roadmap: -1 },   consequence: "You rolled up your sleeves. The solution isn't perfect but it ships." },
        { label: "Cut the feature from MVP",               effects: { roadmap: 1, quality: -1, morale: 1 }, consequence: "Clean call. Stakeholders are disappointed. Shipping is not." },
        { label: "Ask why this wasn't flagged sooner",     effects: { morale: -2, trust: -1 },              consequence: "Fair question, wrong moment. The energy in the room shifted and not in your favor." },
      ],
    },
  ],

  2: [ // Design
    {
      id: 'PM-021', epic: 'DESIGN', epicColor: 'bg-pink-100 text-pink-700',
      scenario: "User testing shows the core navigation is confusing. A full redesign would take 2 extra weeks. What do you do?",
      choices: [
        { label: "Redesign now",                              effects: { roadmap: -1, morale: 1, quality: 2 }, consequence: "Slower, but the team is proud of what they're building." },
        { label: "Ship it and iterate post-launch",           effects: { morale: -1, quality: -1 },            consequence: "The team knows it's wrong. That sits with them. It'll sit with users too." },
        { label: "Quick fix that partially addresses it",     effects: { roadmap: -1, quality: 1 },            consequence: "Not ideal, but it moves the needle. Users will notice it's better. Mostly." },
        { label: "Dismiss the finding",                       effects: { morale: -2, quality: -2, trust: -1 }, consequence: "One tester's opinion, you said. The problem doesn't go away. It multiplies." },
      ],
    },
    {
      id: 'PM-022', epic: 'DESIGN', epicColor: 'bg-pink-100 text-pink-700',
      scenario: "Brand wants a bold visual direction. UX says it will hurt usability. They've been in a standoff for two weeks. What do you do?",
      choices: [
        { label: "Side with UX — usability first",           effects: { quality: 2, morale: 1 },              consequence: "Users will thank you. Brand will not." },
        { label: "Side with Brand — it needs to stand out",  effects: { quality: -1, trust: 1 },              consequence: "It looks great. Users will find their way eventually." },
        { label: "Commission a usability test to settle it", effects: { roadmap: -1, quality: 1, morale: 1 }, consequence: "Data-driven. Slow. The standoff finally ends." },
        { label: "Split the difference — compromise design",  effects: { quality: -1, morale: -1 },            consequence: "Nobody is happy. Compromise isn't always the answer." },
      ],
    },
    {
      id: 'PM-023', epic: 'DESIGN', epicColor: 'bg-pink-100 text-pink-700',
      scenario: "An accessibility audit flags 12 issues. Fixing all of them would push design back 3 weeks. What do you do?",
      choices: [
        { label: "Fix all 12 — ship it right",               effects: { roadmap: -2, quality: 2, morale: 1 }, consequence: "The right call. It cost time but you can stand behind what shipped." },
        { label: "Fix the critical 4, log the rest",         effects: { roadmap: -1, quality: 1 },            consequence: "Reasonable triage. The 8 you logged better not stay logged forever." },
        { label: "Ship and fix in the next sprint",          effects: { quality: -1, trust: -1 },             consequence: "You know this is a promise you may not keep." },
        { label: "Deprioritize — it's not in the OKRs",     effects: { quality: -2, morale: -2 },            consequence: "The team knows this is wrong. So do you." },
      ],
    },
    {
      id: 'PM-024', epic: 'DESIGN', epicColor: 'bg-pink-100 text-pink-700',
      scenario: "Your designer wants to prototype three interaction models before committing. Engineering says they only have time to build one. What do you do?",
      choices: [
        { label: "Let the designer prototype all three",     effects: { roadmap: -1, quality: 2 },            consequence: "Time well spent. The decision is right and the designer owns it." },
        { label: "Have engineering build the first option",  effects: { roadmap: 1, quality: -1, morale: -1 }, consequence: "Fast. The designer never fully committed to it. It shows." },
        { label: "Prototype on paper — no code yet",         effects: { morale: 1, quality: 1 },              consequence: "Low-fidelity, high-signal. Everyone finds something useful in this." },
        { label: "Put it to a team vote",                    effects: { morale: 1, quality: -1 },             consequence: "Democratic. Popular vote and best UX are not the same thing." },
      ],
    },
  ],

  3: [ // Development
    {
      id: 'PM-031', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
      scenario: "Your lead dev says you're 3 weeks behind schedule. Everyone is looking at you. What do you do?",
      choices: [
        { label: "Bring in contractors",              effects: { roadmap: 2, morale: -1, tech: -1 },   consequence: "Timeline recovers but the team has friction with the new people." },
        { label: "Cut a feature",                     effects: { morale: 1, quality: 1 },              consequence: "Less to build. The team breathes again. Sometimes the right answer is less." },
        { label: "Push the team to crunch",           effects: { roadmap: 1, morale: -3 },             consequence: "You recover some time. One engineer just updated their LinkedIn." },
        { label: "Push the launch date",              effects: { roadmap: 2, morale: 1, trust: -1 },   consequence: "More time, team relieved. CEO is unhappy. That's a problem for future-you." },
      ],
    },
    {
      id: 'PM-032', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
      scenario: "The tech lead wants to refactor the authentication layer before building the next feature. It wasn't planned. What do you do?",
      choices: [
        { label: "Allow it — trust the engineer's judgment", effects: { tech: 2, morale: 1, roadmap: -1 }, consequence: "It costs time. The codebase is measurably better. Worth it." },
        { label: "Decline — scope it for next quarter",      effects: { roadmap: 1, tech: -1, morale: -1 }, consequence: "You held the line. The debt just got bigger." },
        { label: "Allow a 3-day timebox for it",             effects: { tech: 1, morale: 1 },              consequence: "A reasonable compromise. The team appreciates the trust." },
        { label: "Reframe it as a new feature request",      effects: { trust: -1, tech: -1 },             consequence: "You made a refactor look like scope creep. Nobody is fooled." },
      ],
    },
    {
      id: 'PM-033', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
      scenario: "Your team is blocked waiting on a platform team to deliver an API. It's been 2 weeks. They're saying 3 more. What do you do?",
      choices: [
        { label: "Escalate through management",              effects: { trust: -1, roadmap: 1, morale: -1 }, consequence: "It works. You now have enemies in the platform team." },
        { label: "Build a temporary workaround",             effects: { tech: -1, roadmap: 1, morale: 1 },  consequence: "Pragmatic. The workaround will outlive everyone's comfort level." },
        { label: "Reorder the sprint — build around it",    effects: { morale: 1, roadmap: -1 },           consequence: "Flexible thinking. The reorder delays some things but keeps momentum." },
        { label: "Document it and formally flag the risk",   effects: { trust: 1, roadmap: -1 },            consequence: "Clean and transparent. The delay is now officially not your fault." },
      ],
    },
    {
      id: 'PM-034', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
      scenario: "Three engineers have each flagged a different 'critical' infrastructure concern. They all want it addressed before the next feature. What do you do?",
      choices: [
        { label: "Address all three in sequence",            effects: { tech: 3, roadmap: -3, morale: 1 },  consequence: "The codebase is pristine. The timeline is a memory." },
        { label: "Triage with the team — pick one",         effects: { tech: 1, morale: 1 },               consequence: "Good process. The team accepts the decision because they made it together." },
        { label: "Push all three to post-launch",            effects: { tech: -2, roadmap: 1, morale: -1 }, consequence: "You shipped faster. The technical debt is now officially yours to manage." },
        { label: "Bring in a senior engineer to assess",     effects: { tech: 1, trust: 1, roadmap: -1 },   consequence: "Smart. An outside read defuses the debate and gives you a real answer." },
      ],
    },
  ],

  4: [ // Testing
    {
      id: 'PM-041', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
      scenario: "QA finds a critical bug 2 days before launch. It affects 20% of users but isn't a total blocker. What do you do?",
      choices: [
        { label: "Delay launch to fix it",               effects: { roadmap: -1, morale: 1, quality: 1 }, consequence: "The right call. Painful, but clean. Stakeholders grumble. Users never notice." },
        { label: "Launch and hotfix within 24 hours",    effects: { morale: -1, trust: -1 },              consequence: "You'll probably be fine. Probably. The team knows what 'probably' means here." },
        { label: "Remove the affected feature",          effects: { quality: 1 },                         consequence: "Clean solution. Nothing ships broken. Users get less, but what ships works." },
        { label: "Ship anyway",                          effects: { morale: -3, trust: -2, quality: -2 }, consequence: "Nobody said a word. On Slack, at least. Twitter is a different story." },
      ],
    },
    {
      id: 'PM-042', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
      scenario: "Your beta users submitted 200 pieces of feedback in the first week. There's no clear signal — everything from typos to architecture complaints. What do you do?",
      choices: [
        { label: "Tag and categorize everything",            effects: { quality: 1, roadmap: -1, morale: -1 }, consequence: "Thorough. The team is tired of tagging." },
        { label: "Find the top 10 by frequency and fix them", effects: { quality: 1, roadmap: 1 },             consequence: "Focused. Imperfect. You shipped better than you started." },
        { label: "Hand it to the team to self-organize",     effects: { morale: 1, quality: -1 },             consequence: "Empowering, but inconsistent. Some gems got buried." },
        { label: "Present all 200 items to stakeholders",    effects: { trust: -1, morale: -2 },              consequence: "This was not the meeting anyone wanted." },
      ],
    },
    {
      id: 'PM-043', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
      scenario: "Load testing shows the app degrades at 500 concurrent users. You're expecting 2,000 at launch. What do you do?",
      choices: [
        { label: "Delay launch until it's resolved",        effects: { roadmap: -1, quality: 2, trust: -1 }, consequence: "The right call. The CEO is unhappy. Users will never know." },
        { label: "Launch with soft rate limiting",          effects: { tech: -1, quality: -1, trust: 1 },    consequence: "You controlled the risk. You also capped your own launch." },
        { label: "Invest in performance optimization now",  effects: { tech: 2, roadmap: -2, morale: 1 },   consequence: "Full commitment. You'll be glad you did this." },
        { label: "Launch to a waitlist to control load",    effects: { trust: 1, quality: 1, roadmap: -1 }, consequence: "Actually clever. Users perceive exclusivity. Engineers get breathing room." },
      ],
    },
    {
      id: 'PM-044', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
      scenario: "Your QA lead says the test coverage is at 40% and recommends delaying launch by a week to reach 80%. Engineering says it won't matter. What do you do?",
      choices: [
        { label: "Delay for the week — get to 80%",        effects: { roadmap: -1, quality: 2, tech: 1 },  consequence: "Your QA lead is satisfied. Engineering quietly admits it was the right call." },
        { label: "Ship at 40% and monitor closely",        effects: { quality: -1, tech: -1, morale: -1 }, consequence: "You shipped. The monitors light up within 48 hours." },
        { label: "Focus coverage only on critical paths",  effects: { quality: 1, roadmap: 1 },            consequence: "Pragmatic. The uncovered areas stay quiet. This time." },
        { label: "Ask QA to justify the 80% target",       effects: { morale: -1, trust: 1 },              consequence: "Fair question. The answer was convincing. You listened, which helped." },
      ],
    },
  ],

  5: [ // Launch — single card, no pool needed
    {
      id: 'PM-051', epic: 'LAUNCH', epicColor: 'bg-green-100 text-green-700',
      scenario: "Launch day. Traffic is 3x what you load tested for. The site is slowing down. What do you do?",
      choices: [
        { label: "Rollback",                                     effects: { roadmap: -1, morale: -2, trust: -1 }, consequence: "Safe. Embarrassing. The post-mortem will be a long one." },
        { label: "Scale up servers immediately",                 effects: { morale: 1, tech: 1, trust: 1 },       consequence: "Costs more. Works. This is why you documented the runbooks." },
        { label: "Post status updates and wait",                 effects: { morale: -1, trust: -1 },              consequence: "Transparent. Users aren't happy but they know what's happening." },
        { label: "Throttle new user onboarding temporarily",     effects: { tech: 1, quality: 1 },                consequence: "Keeps the lights on. Minor friction. The existing users barely notice." },
      ],
    },
  ],
}

const LEGENDARY_CARDS = [
  {
    id: 'PM-∞', insertAfterStage: 1,
    title: 'The CEO Discovers AI',
    body: 'i listened to this podcast this weekend about AI. It sounds like its the future. Lets add AI to it.',
    choices: [
      { label: "Add AI feature immediately",              effects: { roadmap: -1, trust: 1, tech: -1 },  consequence: "It's on the roadmap. Nobody knows what the AI feature actually does yet." },
      { label: "Ask what problem it solves",              effects: { quality: 1, trust: -1 },            consequence: "Smart question. Wrong room. The CEO is now questioning your vision." },
      { label: 'Create an "AI strategy task force"',      effects: { trust: 1, morale: -1 },             consequence: "Kicked the can. The team knows what task forces actually produce." },
    ],
  },
  {
    id: 'PM-∞∞', insertAfterStage: 3,
    title: 'The All-Hands Reorg',
    body: 'hey quick heads up — restructuring announcement going out tomorrow. your team is moving under infrastructure now. no changes to your roadmap tho :)',
    choices: [
      { label: "Absorb it and move forward",              effects: { morale: -1, trust: 1 },             consequence: "You stayed calm. The new infra lead already has opinions about your backlog." },
      { label: "Schedule a team offsite immediately",     effects: { morale: 2, roadmap: -1 },           consequence: "Team loves it. Roadmap loses a week. They think it was worth it." },
      { label: "Ask for clarity before committing",       effects: { trust: 1, morale: 1 },              consequence: "Reasonable. Respected. You know what 'no changes' actually means." },
    ],
  },
]

// ── Build a shuffled card sequence each game ─────────────────────────────────

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function buildSequence() {
  const seq = []
  // Stages 0–4: draw 3 from each pool (shuffle so replays differ)
  for (let s = 0; s <= 4; s++) {
    const drawn = shuffle(STAGE_POOLS[s]).slice(0, 3).map(c => ({ ...c, type: 'stage', stage: s }))
    seq.push(...drawn)
    // Insert legendary after this stage if one is configured
    const leg = LEGENDARY_CARDS.find(l => l.insertAfterStage === s)
    if (leg) seq.push({ ...leg, type: 'legendary', stage: s })
  }
  // Launch: always 1 card
  seq.push({ ...STAGE_POOLS[5][0], type: 'stage', stage: 5 })
  return seq
}

// ── Outcome helpers ──────────────────────────────────────────────────────────

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
      morale:  "The team trusts you. They've seen you make hard calls.",
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

const PM_STYLES = {
  roadmap: { title: 'The Roadmap Zealot',    desc: "You kept the product on track when most would have caved. Stakeholders knew what was shipping and when. That's rarer than it sounds." },
  morale:  { title: 'The Culture Carrier',   desc: "Your team would follow you off a cliff. In this industry, that's not nothing." },
  trust:   { title: 'The Diplomat',          desc: "You played stakeholder management like a sport. Everyone felt heard, nothing blew up. That's a skill." },
  tech:    { title: 'The Technical PM',      desc: "You actually understood what you were asking engineers to build. They noticed — and respected it." },
  quality: { title: 'The User Advocate',     desc: "You refused to ship something bad. That instinct is worth more than any framework you'll read about." },
}

function getOutcome(stats) {
  const entries = Object.entries(stats)
  const worstEntry = entries.reduce((a, b) => b[1] < a[1] ? b : a)
  const bestEntry  = entries.reduce((a, b) => b[1] > a[1] ? b : a)
  const [worstKey, worstVal] = worstEntry
  const [bestKey] = bestEntry
  let tier
  if (worstVal >= 7) tier = 4
  else if (worstVal >= 5) tier = 3
  else if (worstVal >= 3) tier = 2
  else if (worstVal >= 1) tier = 1
  else tier = 0
  const outcome = OUTCOME_TIERS[tier]
  return {
    name: outcome.name,
    flavorText: outcome.flavor[worstKey] || outcome.flavor.default,
    tier,
    worstKey,
    pmStyle: PM_STYLES[bestKey],
  }
}

function clamp(v) { return Math.max(0, Math.min(10, v)) }
function applyEffects(stats, effects) {
  const next = { ...stats }
  for (const [k, v] of Object.entries(effects)) next[k] = clamp(next[k] + v)
  return next
}
function formatEffect(key, val) {
  const cfg = STATS_CONFIG.find(s => s.key === key)
  return `${cfg.label} ${val > 0 ? '+' : ''}${val}`
}

// ── Components ───────────────────────────────────────────────────────────────

function StatBar({ label, value, color }) {
  const barColor = value <= 2 ? 'bg-red-500' : value <= 4 ? 'bg-yellow-400' : color
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
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-400">{card.id}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${card.epicColor}`}>{card.epic}</span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-sm">✕</button>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{card.scenario}</p>
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
            <div className="px-3 py-2"><span className="text-white font-bold text-sm">Acme Product Co</span></div>
            <div className="px-2 mt-1 space-y-0.5">
              {['Home', 'DMs', 'Activity'].map(item => (
                <div key={item} className="flex items-center gap-2 px-2 py-1 rounded text-white/50 text-xs">
                  <div className="w-3.5 h-3.5 rounded-sm bg-white/20" />{item}
                </div>
              ))}
            </div>
            <div className="mt-3 px-3 mb-1"><span className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">Channels</span></div>
            {['general', 'eng-team', 'design-sync', 'all-hands'].map(ch => (
              <div key={ch} className={`mx-1 px-2 py-1 rounded flex items-center gap-1.5 text-xs ${ch === 'all-hands' ? 'bg-[#1264A3] text-white font-semibold' : 'text-white/50'}`}>
                <span className="text-white/60">#</span><span>{ch}</span>
                {ch === 'all-hands' && <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">1</span>}
              </div>
            ))}
            <div className="mt-3 px-3 mb-1"><span className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">Direct Messages</span></div>
            {[{ name: 'Jordan Chen (CEO)', dot: 'bg-green-400' }, { name: 'You', dot: 'bg-gray-500' }].map(u => (
              <div key={u.name} className="mx-1 px-2 py-1 rounded text-white/40 text-xs flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${u.dot} shrink-0`} />{u.name}
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
                  <button key={i} onClick={() => onChoice(choice)}
                    className="w-full text-left rounded border border-gray-200 px-3 py-2 text-sm bg-white hover:border-[#1264A3] hover:bg-blue-50 transition-all">
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
                  {['B', 'I', 'S'].map(f => <button key={f} className="text-xs text-gray-400 font-bold w-5 h-5 hover:bg-gray-200 rounded">{f}</button>)}
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
            return (
              <span key={k} className={`text-xs font-mono font-semibold px-2 py-1 rounded ${v > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                {cfg.label} {v > 0 ? '+' : ''}{v}
              </span>
            )
          })}
        </div>
        <button onClick={onContinue} className="w-full bg-blue-600 text-white text-sm font-medium py-2.5 rounded-md hover:bg-blue-700 transition-colors">
          Continue
        </button>
      </div>
    </div>
  )
}

function OutcomeScreen({ stats, onRestart }) {
  const { name, flavorText, tier, pmStyle } = getOutcome(stats)
  const tierColors = ['text-red-600', 'text-orange-500', 'text-yellow-600', 'text-blue-600', 'text-emerald-600']
  return (
    <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-3">
        {/* PM Style */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Your PM Style</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{pmStyle.title}</h2>
          <p className="text-sm text-gray-500 leading-relaxed">{pmStyle.desc}</p>
        </div>
        {/* Launch Outcome */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Launch Outcome</div>
          <h2 className={`text-xl font-bold mb-2 ${tierColors[tier]}`}>{name}</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">{flavorText}</p>
          <div className="space-y-2 border-t border-gray-100 pt-4">
            {STATS_CONFIG.map(s => <StatBar key={s.key} label={s.label} value={stats[s.key]} color={s.color} />)}
          </div>
        </div>
        <button onClick={onRestart} className="w-full bg-blue-600 text-white text-sm font-medium py-2.5 rounded-md hover:bg-blue-700 transition-colors">
          Play Again
        </button>
      </div>
    </div>
  )
}

// ── Main game component ──────────────────────────────────────────────────────

export default function RoadmapGameClient() {
  const [gameState, setGameState] = useState('intro')
  const [cardIndex, setCardIndex] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [stats, setStats] = useState(INITIAL_STATS)
  const [pending, setPending] = useState(null)
  const [completedCards, setCompletedCards] = useState(new Set())
  const [sequence, setSequence] = useState([])

  const currentCard = sequence[cardIndex]
  const currentStageIndex = currentCard ? currentCard.stage : 5

  function handleStart() {
    const seq = buildSequence()
    setSequence(seq)
    setCardIndex(0)
    setStats(INITIAL_STATS)
    setCompletedCards(new Set())
    setPending(null)
    setGameState('playing')
  }

  function handleChoice(choice) {
    setStats(prev => applyEffects(prev, choice.effects))
    setPending({ effects: choice.effects, consequence: choice.consequence })
    setModalOpen(false)
    setCompletedCards(prev => new Set([...prev, cardIndex]))
    setGameState('consequence')
  }

  function handleContinue() {
    const nextIndex = cardIndex + 1
    if (nextIndex >= sequence.length) {
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
    setSequence([])
  }

  if (gameState === 'outcome') {
    return <OutcomeScreen stats={stats} onRestart={handleRestart} />
  }

  if (gameState === 'intro') {
    return (
      <div className="min-h-screen bg-[#f4f5f7] font-sans flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-xl">
          <div className="mb-8">
            <div className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">Interactive Tool</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">The Product Manager's Journey</h1>
            <p className="text-gray-500 leading-relaxed">
              Think you can ship without burning the team, blowing the roadmap, or losing the CEO's trust? You have 6 sprints. Make the calls.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">How it works</p>
            <div className="space-y-2 text-sm text-gray-600">
              {[
                "You're a PM taking a product from Discovery to Launch across 6 sprints.",
                "Each sprint, click the Jira card to draw a scenario and pick your response.",
                "Watch out for urgent Slack messages — the CEO has opinions.",
                "Every decision moves your stats. Your weakest stat at launch determines your fate.",
              ].map((t, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-gray-300 font-mono mt-0.5 shrink-0">{i + 1}</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Your stats — all start at 5/10</p>
            <div className="space-y-2.5">
              {[
                { color: 'bg-violet-500',  label: 'Roadmap', desc: 'Are you still on track to ship?' },
                { color: 'bg-emerald-500', label: 'Morale',  desc: "How's the team holding up?" },
                { color: 'bg-sky-500',     label: 'Trust',   desc: 'Do stakeholders still believe in you?' },
                { color: 'bg-amber-500',   label: 'Tech',    desc: 'Is the codebase staying healthy?' },
                { color: 'bg-rose-500',    label: 'Quality', desc: 'Will users actually want this?' },
              ].map(s => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-sm shrink-0 ${s.color}`} />
                  <span className="text-sm font-medium text-gray-700 w-16 shrink-0">{s.label}</span>
                  <span className="text-sm text-gray-400">{s.desc}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleStart} className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm">
            Start Sprint 1 — Discovery
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">Click the first Jira card to draw your opening scenario</p>
        </div>
      </div>
    )
  }

  // ── Board view ──
  return (
    <div className="min-h-screen bg-[#f4f5f7] font-sans flex flex-col">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shrink-0">
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
          <button onClick={handleRestart} className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1.5 rounded hover:bg-gray-100">
            Resign from Product
          </button>
        </div>
      </div>

      {/* Body: sidebar + board */}
      <div className="flex flex-1 min-h-0">

        {/* Stats sidebar */}
        <div className="w-52 shrink-0 bg-white border-r border-gray-200 p-4 flex flex-col gap-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-3">Stats</p>
          {STATS_CONFIG.map(s => (
            <div key={s.key} className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">{s.label}</span>
                <span className="text-xs text-gray-400">{stats[s.key]}/10</span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 10 }).map((_, i) => {
                  const val = stats[s.key]
                  const barColor = val <= 2 ? 'bg-red-500' : val <= 4 ? 'bg-yellow-400' : s.color
                  return <div key={i} className={`h-2.5 flex-1 rounded-sm transition-colors ${i < val ? barColor : 'bg-gray-100'}`} />
                })}
              </div>
            </div>
          ))}

          <div className="mt-auto pt-4 border-t border-gray-100">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 mb-2">Sprint</div>
            <div className="text-sm font-bold text-gray-800">{currentStageIndex + 1} of 6</div>
            <div className="text-xs text-gray-500">{STAGES[currentStageIndex]}</div>
            {currentCard?.type === 'legendary' && (
              <span className="mt-1.5 inline-block text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded">URGENT</span>
            )}
          </div>
        </div>

        {/* Board */}
        <div className="flex-1 overflow-x-auto p-4 pb-8">
        <div className="flex gap-3 min-w-max">
          {STAGES.map((stage, si) => {
            const isActive = si === currentStageIndex
            const isCompleted = si < currentStageIndex

            const stageCards = sequence.filter(c => c.stage === si)
            const completedInStage = stageCards.filter(c => completedCards.has(sequence.indexOf(c)))
            const pendingInStage = stageCards.filter(c => !completedCards.has(sequence.indexOf(c)))

            return (
              <div key={stage} className={`w-56 transition-opacity ${!isActive && !isCompleted ? 'opacity-40' : ''}`}>
                <div className="flex items-center justify-between mb-2 px-1">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{stage}</span>
                  {isActive && pendingInStage.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 font-medium">{pendingInStage.length}</span>
                  )}
                </div>
                <div className="space-y-2">
                  {completedInStage.map((card, i) => (
                    <div key={i} className="w-full rounded border border-gray-200 bg-white p-3 opacity-50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-400">{card.id}</span>
                        <span className="text-xs text-emerald-600">Done</span>
                      </div>
                      <div className="h-2 rounded w-3/4 bg-gray-100" />
                    </div>
                  ))}

                  {isActive && pendingInStage.map((card, i) => {
                    const isCurrentCard = card === currentCard
                    const isLegendary = card.type === 'legendary'
                    return (
                      <button
                        key={i}
                        onClick={isCurrentCard ? () => setModalOpen(true) : undefined}
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
                          {isLegendary && <span className="text-xs font-semibold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">URGENT</span>}
                          {isCurrentCard && !isLegendary && <span className="text-xs text-blue-500 font-medium">Click to draw</span>}
                        </div>
                        <div className={`h-2 rounded w-3/4 mb-1.5 ${isLegendary ? 'bg-red-100' : 'bg-gray-200'}`} />
                        <div className={`h-2 rounded w-1/2 ${isLegendary ? 'bg-red-100' : 'bg-gray-200'}`} />
                      </button>
                    )
                  })}

                  {!isActive && !isCompleted && (
                    <div className="rounded border border-dashed border-gray-200 bg-gray-50 p-3 text-center">
                      <span className="text-xs text-gray-300">Locked</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        </div>{/* end board flex-1 */}
      </div>{/* end body flex */}

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
