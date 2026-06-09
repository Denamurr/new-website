'use client'
import { useState } from 'react'
import Link from 'next/link'

const STATS_CONFIG = [
  { key: 'scope', label: 'Scope', color: 'bg-violet-500' },
  { key: 'morale',  label: 'Morale',  color: 'bg-emerald-500' },
  { key: 'trust',   label: 'Trust',   color: 'bg-sky-500' },
  { key: 'tech',    label: 'Tech',    color: 'bg-amber-500' },
  { key: 'quality', label: 'Quality', color: 'bg-yellow-400' },
]

const INITIAL_STATS = { scope: 5, morale: 5, trust: 5, tech: 5, quality: 5 }
const STAGES = ['Discovery', 'Strategy', 'Design', 'Development', 'Testing']

// ── Card pools — 5 per stage, 3 drawn per game ───────────────────────────────

const STAGE_POOLS = {
  0: [ // Discovery
    {
      id: 'DISC-001', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "The CEO attended one discovery session, the kickoff, and has since developed three fully-formed product visions. Your team has capacity for one. The CEO considers this a minor logistical detail. What do you do?",
      choices: [
        { label: "Go with the CEO's favorite",            desc: "Why waste research when you already have a CEO?",               effects: { trust: 1, quality: -1 },              consequence: "Team ships the CEO's gut. At least the roadmap review will be short." },
        { label: "Run a quick validation sprint",         desc: "Spend a week confirming what you probably already know.",        effects: { quality: 1, scope: -1 },               consequence: "The research disagrees with the CEO. This is described as a research problem." },
        { label: "Pick the option with strongest signal", desc: "Use the user research before it expires.",                      effects: { scope: 1, trust: -1 },               consequence: "The data was right. Nobody sends data a thank-you note." },
        { label: "Scope a hybrid of all three",           desc: "Give everyone a little of what they want and none of what they need.", effects: { trust: 1, scope: -1 }, consequence: "Congratulations. You built nobody's favorite product." },
      ],
    },
    {
      id: 'DISC-002', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "Three stakeholders have given you three completely different definitions of success; revenue, engagement and strategic positioning. The executive alignment meeting is next week. You've been in the role for four months. What do you do?",
      choices: [
        { label: "Synthesize all three into one definition",   desc: "Create a definition vague enough that everyone nods.",                     effects: { scope: 1, morale: -1 }, consequence: "You made one definition that technically includes all three. Nobody is wrong. Nobody is aligned." },
        { label: "Schedule 1:1s with each before the meeting", desc: "Do the meeting before the meeting.",                                        effects: { trust: 1, scope: -1 },           consequence: "The stakeholders politely agree in public after disagreeing professionally in private." },
        { label: "Default to the CEO's view",                  desc: "Ultimately we should align with leadership's vision.",                      effects: { trust: 1, morale: -1 },          consequence: "Expedient. The other two stakeholders will remember." },
        { label: "Write a framing doc and circulate it",       desc: "Document the options and hope the argument happens in comments instead.",   effects: { quality: 1, trust: -1 },          consequence: "A written artifact. In 6 months this doc will either vindicate you or be used against you." },
      ],
    },
    {
      id: 'DISC-003', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "Your research consists of 5 user interviews and a survey with 40 responses. Three of the survey responses appear to be from the same person. Your lead engineer asks how much confidence the team should actually place in the findings. What do you do?",
      choices: [
        { label: "Run 10 more interviews",      desc: "Continue gathering evidence until someone tells you to stop.",          effects: { quality: 1, scope: -1 },            consequence: "You discover all three duplicate survey responses belonged to your CEO." },
        { label: "Proceed with what we have",   desc: "Good enough for a roadmap.",                                           effects: { scope: 1, quality: -1 },            consequence: "The team ships. Future-you inherits the consequences." },
        { label: "Run a 2-day research sprint", desc: "Let's gather just enough evidence to feel confident.",                 effects: { quality: 1, scope: -1 }, consequence: "Just enough rigor to survive the stakeholder meeting." },
        { label: "Outsource the research",      desc: "Let's get a consultant to tell us the same thing more confidently.",   effects: { scope: 1, trust: -1 },  consequence: "A 68-slide deck arrives. Slide 67 contains your original conclusion. Slide 68 says 'next steps.'" },
      ],
    },
    {
      id: 'DISC-004', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "A sales rep who's done 30 discovery calls tells you nobody wants to pay for the premium tier. Your research says otherwise. The sales rep is about to say this in the all-hands. What do you do?",
      choices: [
        { label: "Go back to users and validate",        desc: "Talk to the people who actually pay you.",          effects: { quality: 1, scope: -1 }, consequence: "After eight more interviews, the answer is 'it depends.' Research has once again delivered." },
        { label: "Trust the original research",          desc: "In surveys we trust.",                              effects: { scope: 1, trust: -1 },            consequence: "Survey respondents continue being your most enthusiastic customers." },
        { label: "Adjust pricing model and move on",     desc: "If you pivot fast enough, it's strategy.",          effects: { scope: 1, quality: -1 },  consequence: "Your pricing now contains the word 'Enterprise.' Revenue does not." },
        { label: "Flag the risk in Notion and continue", desc: "Future archaeologists will find your warning.",      effects: { trust: 1, quality: -1 },            consequence: "Three months later, someone discovers the note and reacts with a thumbs up." },
      ],
    },
    {
      id: 'DISC-005', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "The CEO wants to invite three enterprise customers to a vision alignment session before you finalize discovery outputs. The invites have already gone out. You can see them on the calendar.",
      choices: [
        { label: "Run it. Customer insight is good.", desc: "Customer conversations are research. Sort of.",    effects: { quality: 1, scope: -1 }, consequence: "One customer casually mentions a problem nobody on the team had considered. Six months of roadmap planning immediately enter the witness protection program." },
        { label: "Redirect to structured interviews", desc: "Reframe the chaos as a methodology.",             effects: { quality: 1, trust: -1 },            consequence: "The CEO wanted a vision session. The customers got interview questions. Everyone was mildly annoyed, but the notes were surprisingly useful." },
        { label: "Let the CEO run it.",               desc: "What could possibly go wrong?",                   effects: { trust: 1, quality: -1 },             consequence: "Ninety minutes later the customers know everything about the product and you've learned absolutely nothing about them." },
        { label: "Combine it with the sprint review", desc: "Two birds, one deeply confused meeting.",         effects: { trust: 1, morale: -1 }, consequence: "Customers watched bug fixes. Engineers watched customer feedback. Nobody knew which audience they were supposed to be performing for." },
      ],
    },
    {
      id: 'DISC-006', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "You interview five users. Each one describes a completely different problem.",
      choices: [
        { label: "Build features for all of them",         desc: "Five edge cases enter the roadmap.",                          effects: { quality: 1, scope: -1 },    consequence: "The core experience leaves quietly through the back door." },
        { label: "Focus on the most common problem",       desc: "The squeakiest wheel receives the roadmap.",                  effects: { scope: 1, quality: -1 },   consequence: "You fixed the biggest issue. Users immediately begin discussing the second biggest issue." },
        { label: "Ignore interviews and trust the vision", desc: "The research was directional. Direction: forward.",           effects: { scope: 1, quality: -1 },   consequence: "Comfortable. The interviews are still in a folder labeled 'Research — DO NOT DELETE.'" },
        { label: "Segment the users",                      desc: "Maybe they're not actually the same customer.",               effects: { quality: 1, scope: -1 }, consequence: "You discover there are two user types. Marketing discovers there are seven." },
      ],
    },
    {
      id: 'DISC-007', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "The CEO explains the product idea using a whiteboard, three arrows, and the phrase platform strategy.",
      choices: [
        { label: "Build exactly what they described", desc: "The whiteboard has spoken.",                              effects: { trust: 1, quality: -1 },           consequence: "The arrows survive every planning meeting. Nobody remembers what they originally pointed to." },
        { label: "Ask users first",                   desc: "Let's see if customers agree with the whiteboard.",       effects: { quality: 1, scope: -1 }, consequence: "The research created clarity. Several stakeholders found this inconvenient." },
        { label: "Suggest starting smaller",          desc: "Attempt to make the project survivable.",                 effects: { scope: 1, trust: -1 },  consequence: "The CEO did not enjoy this suggestion. You are no longer invited to whiteboard sessions." },
        { label: "Schedule a strategy workshop",      desc: "Surely another meeting will help.",                       effects: { trust: 1, morale: -1 }, consequence: "Four new arrows are added. Progress remains theoretical." },
      ],
    },
  ],

  1: [ // Strategy
  {
    id: 'STRAT-011',
    epic: 'STRATEGY',
    epicColor: 'bg-blue-100 text-blue-700',
    scenario: "A competitor launches a feature you hadn't planned. TechCrunch calls it 'a bold move that could reshape the category.' Your CEO forwards you the article with the subject line: 'Thoughts?' What do you do?",
    choices: [
      { label: "Pretend it was always part of the plan",   desc: "History is written by whoever updates the roadmap.",      effects: { trust: 1, quality: -1 }, consequence: "Three people nod. One of them built the roadmap and knows you're lying." },
      { label: "Reply with a clear-headed tradeoff",       desc: "A risky amount of honesty.",                              effects: { trust: 1, morale: -1 },              consequence: "The CEO responds with 'Good points.' This is either very good or very bad." },
      { label: "Add it and cut something else",            desc: "Practice the lost art of prioritization.",                effects: { scope: 1, morale: -1 },          consequence: "The competitor changes your roadmap more effectively than your customers do." },
      { label: "Commit it to V2 with a written rationale", desc: "Buy time using paragraphs.",                              effects: { scope: 1, trust: -1 },               consequence: "The board receives an answer. The roadmap survives another quarter." },
    ],
  },
  {
    id: 'STRAT-012',
    epic: 'STRATEGY',
    epicColor: 'bg-blue-100 text-blue-700',
    scenario: "Engineering presents a chart showing scope growth over time. The chart resembles a cryptocurrency bubble.",
    choices: [
      { label: "Acknowledge it and cut back",             desc: "Trim the roadmap and quietly pretend it was the plan all along.", effects: { scope: 1, trust: -1 }, consequence: "Three features disappear. Nobody remembers who asked for them. Progress accelerates." },
      { label: "Keep it. It's all valuable.",             desc: "Explain that each addition was strategically important.",          effects: { morale: 1, scope: -1 },                        consequence: "The project enters a new phase known as 'just one more thing.'" },
      { label: "Document it and make it official",        desc: "Put the scope creep in a PowerPoint and see what happens.",       effects: { trust: 1, scope: -1 },                          consequence: "The project is no longer off track. The track has been redrawn." },
      { label: "Blame the stakeholders who requested it", desc: "An exciting new approach to relationship management.",            effects: { scope: 1, trust: -1 },            consequence: "The room suddenly becomes very interested in who requested what." },
    ],
  },
  {
    id: 'STRAT-013',
    epic: 'STRATEGY',
    epicColor: 'bg-blue-100 text-blue-700',
    scenario: "It's been two weeks and the team still can't agree on a north star metric. Marketing wants MAU. Product wants activation rate. Engineering wants uptime. The disagreement has its own Slack channel and a custom emoji. What do you do?",
    choices: [
      { label: "Call a meeting and decide together",  desc: "Surely one more meeting will fix this.",               effects: { trust: 1, scope: -1 },    consequence: "Alignment is achieved shortly after everyone gets tired." },
      { label: "Pick activation rate",                desc: "A dangerous amount of faith in product thinking.",      effects: { quality: 1, trust: -1 }, consequence: "Product wins. Marketing creates a new deck and calendar invite." },
      { label: "Let each team track their own metric", desc: "Three dashboards. Three realities. One product.",      effects: { morale: 1, quality: -1 },           consequence: "A VP asks for the north star metric. Three people answer simultaneously." },
      { label: "Create a North Star Task Force",       desc: "Nothing says urgency like a committee.",               effects: { trust: 1, morale: -1 },   consequence: "The problem disappears from your calendar and reappears in performance reviews." },
    ],
  },
  {
    id: 'STRAT-014',
    epic: 'STRATEGY',
    epicColor: 'bg-blue-100 text-blue-700',
    scenario: "Two engineers inform you that a core feature isn't feasible in the timeline. This is week 4. They've known since week 2. Their explanation for the delay: we were hoping to find a workaround. What do you do?",
    choices: [
      { label: "Reset the timeline",                desc: "Tell the truth while it's still affordable.",                     effects: { morale: 1, trust: -1 },   consequence: "Expensive. Honest. The team is relieved you didn't try to force it." },
      { label: "Find a workaround together",        desc: "Convert a blocker into a creative writing exercise.",             effects: { tech: 1, scope: -1 },   consequence: "The workaround becomes a permanent architecture decision." },
      { label: "Cut the feature from MVP",          desc: "The MVP yearns to be smaller.",                                   effects: { scope: 1, morale: -1 }, consequence: "You removed one feature and gained three executive conversations." },
      { label: "Ask why this wasn't raised sooner", desc: "A reasonable question with terrible timing.",                    effects: { quality: 1, morale: -1 },            consequence: "The postmortem starts before the incident ends." },
    ],
  },
  {
    id: 'STRAT-015',
    epic: 'STRATEGY',
    epicColor: 'bg-blue-100 text-blue-700',
    scenario: "It's Q3 planning. Your OKRs are due in 48 hours. Your roadmap is 60% speculative. A VP has just added three new 'strategic initiatives' to your team's scope. Nobody can explain how they relate to each other. What do you do?",
    choices: [
      { label: "Push back on the initiatives",                  desc: "Treat scope as a finite resource.",                              effects: { scope: 1, trust: -1 },    consequence: "Necessary. Uncomfortable. The VP will find another angle." },
      { label: "Accept them and adjust the OKRs",               desc: "Rewrite the roadmap and hope the math works out later.",         effects: { trust: 1, scope: -1 },               consequence: "The roadmap now contains enough work for several timelines." },
      { label: "Ask the VP to prioritize them",                 desc: "A surprisingly controversial request.",                          effects: { trust: 1, morale: -1 },                 consequence: "The VP responds, 'They're all important.'" },
      { label: "Submit vague OKRs that accommodate everything", desc: "Improve platform outcomes through strategic initiatives.",       effects: { morale: 1, quality: -1 }, consequence: "The OKRs survive review because nobody can disagree with them." },
    ],
  },
  {
    id: 'STRAT-016',
    epic: 'STRATEGY',
    epicColor: 'bg-blue-100 text-blue-700',
    scenario: "You present the roadmap. Five minutes in, a stakeholder asks why their feature isn't on it. They describe it as 'critical.' This is the first time you've heard about it. What do you do?",
    choices: [
      { label: "Add their feature",                        desc: "Make the roadmap everyone's problem.",                      effects: { trust: 1, scope: -1 },               consequence: "The stakeholder is delighted. Somewhere else in the company, a PM experiences a sudden unexplained sense of loss." },
      { label: "Explain the prioritization",               desc: "Introduce logic into an emotional conversation.",           effects: { trust: 1, morale: -1 }, consequence: "The stakeholder agrees the process is fair and remains completely unsatisfied." },
      { label: "Say it's coming in a later phase",         desc: "The safest place for a feature request is the future.",    effects: { trust: 1, scope: -1 },   consequence: "Future-you inherits a commitment present-you never intended to make." },
      { label: "Ask what problem they're trying to solve", desc: "A dangerous amount of curiosity.",                         effects: { quality: 1, trust: -1 },            consequence: "The requested feature disappears. Three new problems appear." },
    ],
  },
],
  2: [ // Design
  {
    id: 'DES-017',
    epic: 'DESIGN',
    epicColor: 'bg-pink-100 text-pink-700',
    scenario: "Design has created a sleek new dashboard. It looks amazing. It also hides half the information your power users check everyday. Design describes this as 'intentional simplification.' What do you do?",
    choices: [
      { label: "Prioritize clarity over visual purity",        desc: "A dashboard is not a perfume ad.",                       effects: { quality: 1, morale: -1 },        consequence: "The design loses some of its minimalist mystique and gains the radical ability to be useful." },
      { label: "Ship the clean version and train users",       desc: "If they cannot find it, perhaps they did not deserve it.", effects: { scope: 1, quality: -1 },    consequence: "Support tickets become the product's most successful engagement channel." },
      { label: "Create a compromise with progressive disclosure", desc: "Keep the surface clean, but let serious users dig deeper.", effects: { quality: 1, scope: -1 }, consequence: "The advanced controls move one click deeper instead of three." },
      { label: "Ask design to complete real tasks using the mockup", desc: "A gentle invitation to suffer like the customer.", effects: { quality: 1, morale: -1 }, consequence: "The phrase 'where did we put that?' enters the design review." },
    ],
  },
  {
    id: 'DES-018',
    epic: 'DESIGN',
    epicColor: 'bg-pink-100 text-pink-700',
    scenario: "Design presents a new onboarding flow. It has seven screens, three modal states, one custom animation, and a loading sequence described as 'critical to emotional reassurance.' Engineering has stopped taking notes. What do you do?",
    choices: [
      { label: "Cut the flourishes and keep the core flow",    desc: "Preserve the value. Sacrifice the interpretive dance.",   effects: { scope: 1, quality: -1 }, consequence: "The experience gets simpler, the build gets saner, and the animation is quietly escorted out of the building." },
      { label: "Approve the full design vision",               desc: "Commit to the deluxe edition of the feature.",           effects: { morale: 1, scope: -1 }, consequence: "Several developers develop a personal relationship with technical debt." },
      { label: "Build the basic version now, polish later",    desc: "Launch the skeleton. Add the cheekbones in a future sprint.", effects: { scope: 1, quality: -1 }, consequence: "You preserve momentum, though the final product temporarily has the charisma of a tax portal." },
      { label: "Ask design to rank what actually matters most", desc: "Turn taste into tradeoffs.",                            effects: { trust: 1, morale: -1 },             consequence: "Several pixels are asked to justify their existence." },
    ],
  },
  {
    id: 'DES-019',
    epic: 'DESIGN',
    epicColor: 'bg-pink-100 text-pink-700',
    scenario: "User testing produces a rare moment of alignment. All five participants fail the same task. None complete it. One clicks the company logo for help. One refreshes the page three times. One apologizes and assumes it's their fault. Your designer has already seen the results and is now communicating exclusively through facial expressions. What do you do?",
    choices: [
      { label: "Redesign now",                          desc: "Fix it properly while you still can.",        effects: { quality: 1, scope: -1 },            consequence: "The designer stops making that face." },
      { label: "Ship it and iterate post-launch",       desc: "Let users discover the problem for you.",    effects: { scope: 1, quality: -1 },         consequence: "You collect a statistically significant amount of disappointment." },
      { label: "Quick fix that partially addresses it", desc: "Make it less bad. Ship it. Repeat.",         effects: { scope: 1, quality: -1 },                      consequence: "Failure drops from 100% to a more respectable number." },
      { label: "Dismiss the finding",                   desc: "One data point. Probably an outlier. Almost certainly not.", effects: { scope: 1, quality: -1 }, consequence: "'One tester's opinion.' The finding shows up in your App Store reviews three weeks later." },
    ],
  },
  {
    id: 'DES-020',
    epic: 'DESIGN',
    epicColor: 'bg-pink-100 text-pink-700',
    scenario: "Brand wants the design to be bold. UX says bold is unusable. They've spent 11 days debating button size, color contrast, and whether users enjoy mystery. Standups now refer to this as a 'creative tension period.' No screens have been finalized. What do you do?",
    choices: [
      { label: "Side with UX. Usability first.",          desc: "Remind everyone that users still need to find the buttons.",              effects: { quality: 1, trust: -1 }, consequence: "Users will thank you. Brand sends a passive-aggressive Slack message." },
      { label: "Side with Brand. It needs to stand out.", desc: "Boldness is part of the experience.",                                    effects: { trust: 1, quality: -1 }, consequence: "It looks great. Users will figure it out... eventually." },
      { label: "Commission a usability test to settle it", desc: "Introduce data into the argument and watch both sides reinterpret it.", effects: { quality: 1, scope: -1 }, consequence: "The creative tension period is replaced by a findings interpretation period." },
      { label: "Try a compromise design",                  desc: "Produce something that disappoints everyone equally.",                  effects: { morale: 1, quality: -1 }, consequence: "Two weeks of debate successfully produce one shade of blue." },
    ],
  },
  {
    id: 'DES-021',
    epic: 'DESIGN',
    epicColor: 'bg-pink-100 text-pink-700',
    scenario: "An accessibility audit comes back with 12 issues. Your designer reads the report, sighs audibly on the call, and says, 'I flagged most of these in the design review.' Nobody responds. Fixing all of them takes 3 weeks. What do you do?",
    choices: [
      { label: "Fix all 12. Ship it right.",       desc: "Do the thing everyone should do and almost nobody does.", effects: { quality: 1, scope: -1 },   consequence: "Three weeks disappear. So do twelve accessibility issues." },
      { label: "Fix the critical 4, log the rest", desc: "Triage and document. The 8 will come back.",             effects: { quality: 1, trust: -1 },             consequence: "The highest-risk problems disappear. The others secure long-term housing in the backlog." },
      { label: "Ship and fix in the next sprint",  desc: "Make a promise you might not keep.",                     effects: { scope: 1, quality: -1 }, consequence: "Everyone agrees the issues should be fixed eventually. Eventually remains flexible." },
      { label: "Deprioritize. Not in the OKRs.",   desc: "It didn't make the list. Neither will your credibility.", effects: { scope: 1, quality: -1 }, consequence: "The designer mutes their microphone before responding." },
    ],
  },
  {
    id: 'DES-022',
    epic: 'DESIGN',
    epicColor: 'bg-pink-100 text-pink-700',
    scenario: "Your designer wants to prototype three interaction models before committing. Engineering says they have time for one. Your designer has already named the files Final_v12, Final_v12_Actual, and Final_v12_Actual_2. What do you do?",
    choices: [
      { label: "Let the designer prototype all three",    desc: "Let the ideas fight.",                                  effects: { quality: 1, scope: -1 },            consequence: "Three ideas enter. One leaves. The process works." },
      { label: "Have engineering build the first option", desc: "Move fast and become attached to it.",                 effects: { scope: 1, quality: -1 }, consequence: "The feature ships. The designer develops a thousand-yard stare." },
      { label: "Prototype on paper. No code yet.",        desc: "A surprisingly offensive amount of practicality.",      effects: { quality: 1, morale: -1 }, consequence: "Everyone learns something. Nobody gets attached to pixels." },
      { label: "Put it to a team vote",                   desc: "Destroy bad ideas before they acquire code.",           effects: { morale: 1, quality: -1 }, consequence: "You discover that preference and performance are different metrics." },
    ],
  },
  {
    id: 'DES-023',
    epic: 'DESIGN',
    epicColor: 'bg-pink-100 text-pink-700',
    scenario: "Your lead designer wants to throw out the entire component library and start fresh. Engineering looks like you just suggested deleting the production database. The library is two years old and genuinely painful to work with. Half the components are slightly different versions of the same button. What do you do?",
    choices: [
      { label: "Allow the full rebuild",                desc: "Choose violence against technical debt.",          effects: { tech: 1, scope: -1 },   consequence: "You spend six months paying off debt instead of refinancing it." },
      { label: "Decline. Patch the existing library.",  desc: "Keep the patient comfortable.",                   effects: { scope: 1, tech: -1 }, consequence: "Button_Primary_Final becomes Button_Primary_Final_v2." },
      { label: "Refactor only the critical components", desc: "Treat the symptoms.",                             effects: { tech: 1, scope: -1 },    consequence: "The biggest pain disappears. The weirdness remains." },
      { label: "Bring in a contractor to assess",       desc: "Buy a second opinion.",                           effects: { trust: 1, scope: -1 },     consequence: "The rebuild gains legitimacy through the ancient ritual of being expensive." },
    ],
  },
  {
    id: 'DES-024',
    epic: 'DESIGN',
    epicColor: 'bg-pink-100 text-pink-700',
    scenario: "A designer says the current layout feels 'emotionally cramped.' Engineering asks whether emotions are now a required breakpoint. Someone opens Figma. Someone else opens Jira. The meeting has stopped producing progress and started producing metaphors. What do you do?",
    choices: [
      { label: "Translate the feedback into specific UX issues", desc: "Take the scenic route to clarity.",        effects: { quality: 1, trust: -1 },          consequence: "The team rediscovers the power of concrete nouns." },
      { label: "Side with design and redo the layout",           desc: "The mockup has spoken.",                  effects: { quality: 1, scope: -1 }, consequence: "The design gets cleaner, but the team loses a chunk of time to a problem nobody could originally define." },
      { label: "Side with engineering and keep it moving",       desc: "The button can be clicked. What more do you want?", effects: { scope: 1, trust: -1 }, consequence: "Progress continues, and design begins documenting your future mistakes with unusual precision." },
      { label: "Put the design in front of users before changing it", desc: "Let civilians decide.",              effects: { quality: 1, scope: -1 }, consequence: "Users identify a completely different problem." },
    ],
  },
],
  3: [ // Development
  {
    id: 'DEV-024', epic: 'DEVELOPMENT', epicColor: 'bg-blue-100 text-blue-700',
    scenario: "Mid-sprint, a stakeholder drops in with 'one tiny change' that touches the API, UI, copy, analytics, and your remaining will to live. What do you do?",
    choices: [
      { label: "Add it to this sprint",               desc: "The sprint yearns to grow.",                        effects: { trust: 1, scope: -1 }, consequence: "The stakeholder remains convinced it was small. Three engineers quietly update their resumes." },
      { label: "Push it to next sprint",              desc: "Future-you has availability.",                      effects: { scope: 1, trust: -1 }, consequence: "The sprint survives intact. The stakeholder acts disappointed in the ceremonial way." },
      { label: "Trade it for something of equal size", desc: "Conservation of suffering.",                       effects: { scope: 1, morale: -1 }, consequence: "The request remains urgent right up until it costs something." },
      { label: "Ask for a written rationale and impact", desc: "Introduce paperwork.",                           effects: { trust: 1, morale: -1 }, consequence: "Additional context is requested. The request is never mentioned again." },
    ],
  },
  {
    id: 'DEV-025', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
    scenario: "Your tech lead wants to refactor the authentication layer before the next feature. It wasn't on the roadmap. Engineering describes it as 'critical.' When asked why, one engineer says 'security concerns' and another says 'have you seen the code?' What do you do?",
    choices: [
      { label: "Allow it.",                         desc: "Pay the maintenance bill voluntarily.",                    effects: { tech: 1, scope: -1 },   consequence: "The refactor prevents several future disasters and creates no PowerPoint slides." },
      { label: "Decline and scope it for next quarter", desc: "Kick the can with executive precision.",              effects: { scope: 1, tech: -1 }, consequence: "The debt compounds at a competitive interest rate." },
      { label: "Allow a 3-day timebox",             desc: "Place boundaries around hope.",                            effects: { tech: 1, scope: -1 },   consequence: "Three days becomes four. Everyone pretends not to notice." },
      { label: "Reframe it as a feature request",   desc: "If it has a name, it can have a roadmap slot.",            effects: { scope: 1, trust: -1 }, consequence: "You solved a prioritization problem by renaming it." },
    ],
  },
  {
    id: 'DEV-026', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
    scenario: "Your team has been blocked on a platform API for two weeks. The platform team now estimates another three. Every attempt to contact their lead is met with 'currently in meetings.' At this point you're no longer sure if the lead exists or is just a calendar event. What do you do?",
    choices: [
      { label: "Escalate through management",            desc: "Convert a dependency into a political event.",        effects: { scope: 1, trust: -1 }, consequence: "It works. The platform lead responds within the hour. You now have an enemy on the 4th floor." },
      { label: "Build a temporary workaround",           desc: "Nothing is more permanent than temporary.",           effects: { scope: 1, tech: -1 }, consequence: "Future engineers will assume it exists for a reason." },
      { label: "Reorder the sprint. Build around it.",   desc: "Practice agile in its natural habitat.",              effects: { morale: 1, scope: -1 },           consequence: "Nothing moves forward exactly as planned. Everything moves forward enough." },
      { label: "Document it and formally flag the risk", desc: "Escalate the issue to Confluence.",                   effects: { trust: 1, scope: -1 },            consequence: "The problem remains unsolved but exceptionally well documented." },
    ],
  },
  {
    id: 'DEV-027', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
    scenario: "Three engineers have each filed a separate Jira ticket labeled 'CRITICAL.' None of the tickets reference each other. None of the engineers have discussed them together. All three insist their issue must be addressed before the next sprint. The word 'critical' has lost all meaning. What do you do?",
    choices: [
      { label: "Address all three in sequence",        desc: "Fix everything. Ship nothing on time.",                 effects: { tech: 1, scope: -1 },  consequence: "The infrastructure improves dramatically. Product development becomes a seasonal activity." },
      { label: "Triage with the team. Pick one.",      desc: "Make a call together. Log the other two.",             effects: { tech: 1, morale: -1 },  consequence: "Good process. One concern was real. Two were vibes. Nobody says this." },
      { label: "Push all three to post-launch",        desc: "Ship now. Pay later. With interest.",                  effects: { scope: 1, tech: -1 }, consequence: "You shipped faster. The three engineers now have a group chat you're not in." },
      { label: "Bring in a senior engineer to assess", desc: "Get outside credibility to end the internal debate.",  effects: { tech: 1, trust: -1 },   consequence: "The debate ends when someone everyone respects says the same thing." },
    ],
  },
  {
    id: 'DEV-028', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
    scenario: "Nobody on the team writes documentation. Engineering says it's Product's job. Product says it's Engineering's job. The codebase currently contains more tribal knowledge than written knowledge. Launch is in 8 weeks. What do you do?",
    choices: [
      { label: "Mandate docs in the sprint process",  desc: "Make forgetting more difficult.",                        effects: { tech: 1, morale: -1 },  consequence: "The code becomes self-documenting in the same way cats are self-walking." },
      { label: "Hire a technical writer",             desc: "Summon the chosen one.",                                 effects: { tech: 1, scope: -1 },    consequence: "Greg, the technical writer becomes the most popular person on the team." },
      { label: "Let it go until post-launch",         desc: "Tomorrow's problem deserves tomorrow's attention.",       effects: { morale: 1, tech: -1 }, consequence: "Institutional knowledge continues its proud tradition of being institutional and not knowledge." },
      { label: "Make documentation a launch blocker", desc: "Weaponize process.",                                     effects: { tech: 1, morale: -1 },  consequence: "Critical business logic is preserved in Slack messages from 2024." },
    ],
  },
  {
    id: 'DEV-029', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
    scenario: "Launch is two weeks away. Leadership appears in your roadmap review with 'one final feature request.' They promise it's the final request. What do you do?",
    choices: [
      { label: "Add it.",                   desc: "The scope hungers.",                                          effects: { trust: 1, scope: -1 },           consequence: "The launch checklist gains a new item. The team gains a new eye twitch." },
      { label: "Decline.",                  desc: "Scope is a finite resource. Allegedly.",                      effects: { scope: 1, trust: -1 },         consequence: "The feature is rejected. The PowerPoint advocating for it is quietly becoming longer." },
      { label: "Add a simplified version.", desc: "Build the smallest thing everyone can still complain about.", effects: { trust: 1, scope: -1 },         consequence: "Leadership immediately renames the simplified version to Phase 1." },
      { label: "Ask for the business impact.", desc: "Require the request to survive contact with numbers.",     effects: { trust: 1, morale: -1 }, consequence: "Someone says 'strategic value.' Nobody can define it." },
    ],
  },
  {
    id: 'DEV-030', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
    scenario: "Halfway through the sprint, engineering reports the feature is 'mostly done.' Upon investigation, this means the backend exists, the frontend is a Figma file, QA has seen screenshots, and no component has ever met another component in the wild. What do you do?",
    choices: [
      { label: "Cut scope and finish the core flow",          desc: "Save the feature from itself.",                    effects: { scope: 1, quality: -1 }, consequence: "The feature gets smaller, more coherent, and much less likely to humiliate you in demo." },
      { label: "Push the team to finish everything",          desc: "Reality is a mindset.",                            effects: { trust: 1, morale: -1 }, consequence: "The team delivers everything. Quality Assurance files a missing persons report." },
      { label: "Move the unfinished work to next sprint",     desc: "Delay with professional vocabulary.",              effects: { scope: 1, trust: -1 }, consequence: "Several tickets achieve seniority." },
      { label: "Ask for a live walkthrough of what actually works", desc: "The demo cannot hurt you if you hurt it first.", effects: { quality: 1, morale: -1 }, consequence: "Three blockers, two assumptions, and one architectural crime are discovered." },
    ],
  },
  {
    id: 'DEV-031', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
    scenario: "The team spends 45 minutes debating the color of a button. No user has ever mentioned the button. No metric is affected by the button. The button has become the most discussed feature in the product. What do you do?",
    choices: [
      { label: "Let design decide.",          desc: "The adults are handling it.",         effects: { quality: 1, morale: -1 },              consequence: "Design chooses a slightly different shade of orange. The conversion rate remains blissfully unaware." },
      { label: "End the debate and move on.", desc: "Declare victory and continue.",       effects: { morale: 1, quality: -1 },  consequence: "The debate ends. The color stays. Someone will bring this up in retro." },
      { label: "Escalate the decision.",      desc: "The button deserves governance.",     effects: { trust: 1, morale: -1 },    consequence: "The button receives executive sponsorship." },
      { label: "Run an A/B test.",            desc: "The scientific method enters the chat.", effects: { quality: 1, scope: -1 }, consequence: "Months later, the button is still orange." },
    ],
  },
  {
    id: 'DEV-039', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
    scenario: "Engineering says the feature will take two more weeks. Engineering also said the last feature would take two weeks.",
    choices: [
      { label: "Trust the estimate.",          desc: "What are the odds it happens twice?",                     effects: { trust: 1, scope: -1 },       consequence: "The roadmap quietly updates itself to local time." },
      { label: "Ask for a simpler version.",   desc: "Negotiate with the laws of software development.",        effects: { scope: 1, quality: -1 },  consequence: "Simpler is defined in the meeting. The simpler version also takes two weeks." },
      { label: "Ask what happened last time.", desc: "Compare the estimate to its natural habitat.",            effects: { quality: 1, trust: -1 },    consequence: "The team discovers 'two weeks' is a unit of optimism, not time." },
      { label: "Double the estimate privately.", desc: "Apply the industry standard conversion rate.",          effects: { scope: 1, trust: -1 }, consequence: "Engineering estimates in dog years." },
    ],
  },
  {
    id: 'DEV-032', epic: 'DEVELOPMENT', epicColor: 'bg-blue-100 text-blue-700',
    scenario: "By day six, velocity has collapsed. Standups are full of phrases like 'still looking into it' and 'almost there,' which are technically updates in the same way fog is technically weather. What do you do?",
    choices: [
      { label: "Break work into smaller deliverables today",         desc: "Reduce ambiguity until progress has fewer places to hide.",    effects: { quality: 1, scope: -1 },   consequence: "Several tickets are discovered to be ecosystems." },
      { label: "Push for longer hours to catch up",                  desc: "Convert bad planning into human fatigue.",                    effects: { scope: 1, morale: -1 }, consequence: "The team works nights. The bugs work weekends." },
      { label: "Drop lower-priority tickets now",                    desc: "Admit reality before reality schedules the meeting for you.", effects: { scope: 1, morale: -1 },   consequence: "Reality arrives carrying scissors. Everyone agrees the cuts make sense and privately believes their ticket should have survived." },
      { label: "Ask each engineer to show what changed since yesterday", desc: "Replace progress poetry with receipts.",                 effects: { trust: 1, morale: -1 }, consequence: "Status updates evolve into evidence." },
    ],
  },
],
  4: [ // Testing
  {
    id: 'TEST-033', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
    scenario: "QA files a P0 bug ticket two days before launch. It affects 20% of users but has a workaround. Your lead dev's Slack status is currently a red circle. What do you do?",
    choices: [
      { label: "Delay launch to fix it.",           desc: "Protect users from your calendar.",              effects: { quality: 1, trust: -1 },           consequence: "Stakeholders are upset for a week. Users remain blissfully unaware forever." },
      { label: "Launch and hotfix within 24 hours", desc: "The bug can enjoy a brief production tour.",     effects: { trust: 1, quality: -1 },          consequence: "The hotfix becomes the real launch." },
      { label: "Remove the affected feature.",      desc: "Save the product from one of its features.",    effects: { scope: 1, quality: -1 },                     consequence: "The feature is escorted out of the release with dignity." },
      { label: "Ship it.",                          desc: "A bold commitment to learning.",                 effects: { scope: 1, quality: -1 }, consequence: "The bug was successfully promoted to production." },
    ],
  },
  {
    id: 'TEST-034', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
    scenario: "User acceptance testing submitted 200 pieces of feedback. Some reports are typos. Some suggest rebuilding the entire product. One user asked if the product could be more like Excel. What do you do?",
    choices: [
      { label: "Tag and categorize everything",             desc: "Turn user pain into color-coded tabs.",             effects: { quality: 1, morale: -1 }, consequence: "Nothing has been fixed yet, but the spreadsheet is magnificent." },
      { label: "Find the top 10 by frequency and fix them", desc: "Let the complaints compete for resources.",         effects: { quality: 1, scope: -1 },             consequence: "The phrase 'more like Excel' becomes a recurring character." },
      { label: "Hand it to the team to self-organize",      desc: "Throw 200 opinions into a room and lock the door.", effects: { morale: 1, quality: -1 }, consequence: "The signal emerges slowly from the noise, like a submarine surfacing." },
      { label: "Present all 200 items to stakeholders",     desc: "Share every thought a user has ever had.",          effects: { trust: 1, morale: -1 }, consequence: "Three hours later, the group has strong opinions about item #183." },
    ],
  },
  {
    id: 'TEST-035', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
    scenario: "Load testing shows the app starts degrading at 500 concurrent users. Marketing is expecting 2,000 users at launch. Engineering estimates two weeks to properly fix the issue. Launch is… sooner than that. What do you do?",
    choices: [
      { label: "Delay launch until it's resolved.",       desc: "The infrastructure has requested diplomatic talks.",            effects: { quality: 1, trust: -1 },          consequence: "A future postmortem quietly fails to occur." },
      { label: "Launch with soft rate limiting.",         desc: "First come, first served. Everyone else gets character development.", effects: { scope: 1, quality: -1 }, consequence: "You successfully solve a scaling problem by preventing scale." },
      { label: "Invest in performance optimization now.", desc: "The code would like to discuss its lifestyle choices.",        effects: { tech: 1, scope: -1 },             consequence: "The optimization effort uncovers several crimes against software." },
      { label: "Launch to a waitlist to control load.",   desc: "Turn server limitations into brand mystique.",                 effects: { quality: 1, trust: -1 },          consequence: "The app can support 500 users comfortably and 2,000 users spiritually." },
    ],
  },
  {
    id: 'TEST-036', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
    scenario: "QA says the product is being held together by hope, browser cache, and Ethan, one of the engineers. You know that Ethan will be out the same week it's launched.",
    choices: [
      { label: "Push the release date by a week.",          desc: "Give the bugs more time to introduce themselves.",       effects: { tech: 1, scope: -1 },                consequence: "Three critical bugs are discovered. Ethan already knew about all of them." },
      { label: "Launch anyway.",                            desc: "Let production answer the questions nobody else can.",   effects: { trust: 1, quality: -1 }, consequence: "At 11:43 p.m., Ethan achieves legendary status from a beach." },
      { label: "Strip out the risky bits and ship the rest.", desc: "A classic move for anyone who enjoys survival.",      effects: { scope: 1, quality: -1 },                        consequence: "The release becomes smaller, uglier, and much less likely to ruin your weekend." },
      { label: "Ask who is covering for Ethan.",            desc: "Nothing clarifies launch risk like naming the backup plan.", effects: { trust: 1, morale: -1 },            consequence: "For the first time, the company attempts to determine exactly what Ethan does all day." },
    ],
  },
  {
    id: 'TEST-037', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
    scenario: "QA approves the release saying that the feature works perfectly in staging, which would be reassuring if staging had resembled production at any point this year. What do you do?",
    choices: [
      { label: "Block launch until staging is fixed.",      desc: "Stop pretending the dollhouse is the real house.",          effects: { tech: 1, scope: -1 },       consequence: "You spend a week fixing staging and accidentally improve engineering culture." },
      { label: "Ship anyway and monitor prod.",             desc: "Let reality handle the final QA pass.",                    effects: { scope: 1, quality: -1 }, consequence: "The monitoring dashboard achieves sentience." },
      { label: "Manually test only the riskiest flows.",   desc: "Check the parts most likely to ruin everyone's evening.", effects: { quality: 1, trust: -1 },     consequence: "Production continues its role as the company's most realistic testing environment." },
      { label: "Ask engineering how staging drift got this bad.", desc: "Turn discomfort into a process conversation.",      effects: { tech: 1, morale: -1 }, consequence: "Several temporary decisions are discovered to be celebrating birthdays." },
    ],
  },
  {
    id: 'TEST-038', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
    scenario: "The internal demo fails. You're supposed to demo this in an hour to the C-suite. What do you do?",
    choices: [
      { label: "Delay the demo.",             desc: "Buy time. Find the real problem.",         effects: { quality: 1, trust: -1 },          consequence: "The demo moves. The panic stays exactly where it was." },
      { label: "Proceed confidently anyway.", desc: "Confidence is half the demo.",             effects: { trust: 1, tech: -1 }, consequence: "The demo works for the first three clicks, which briefly feels like victory." },
      { label: "Blame WiFi.",                 desc: "It's out of your hands.",                  effects: { morale: 1, trust: -1 },          consequence: "The stakeholders keep pinging you saying their WiFi connection is working great." },
      { label: "Use screenshots and a backup recording.", desc: "Demo the dream, not the implementation.", effects: { trust: 1, quality: -1 }, consequence: "Nobody notices until someone asks to click something." },
    ],
  },
  {
    id: 'TEST-039', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
    scenario: "The staging environment has been down twice, two bugs are marked 'probably fine,' and someone just said 'we can validate in prod' without irony. Release day is approaching like a tax audit. What do you do?",
    choices: [
      { label: "Push the release a week.",                          desc: "Choose shame now over chaos later.",                               effects: { tech: 1, trust: -1 }, consequence: "The product is ready for launch in the same way a raccoon is ready for a wedding." },
      { label: "Launch anyway.",                                    desc: "Let production answer the questions nobody else can.",              effects: { scope: 1, quality: -1 }, consequence: "Several assumptions complete their final journey." },
      { label: "Strip out the risky bits and ship the rest.",       desc: "A classic move for anyone who enjoys survival.",                   effects: { scope: 1, quality: -1 }, consequence: "The release approaches with the confidence of a student who has not opened the textbook." },
      { label: "Make the loudest person own the launch decision.",  desc: "A bold governance model based entirely on consequences.",          effects: { trust: 1, morale: -1 },           consequence: "Risk tolerance falls sharply once someone suggests being on call." },
    ],
  },
  {
    id: 'TEST-040', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
    scenario: "QA logs 27 bugs before launch. Engineering says 19 are edge cases, 5 are known issues, and 3 are not reproducible, which is a fun way of saying they still exist. What do you do?",
    choices: [
      { label: "Triage every bug and rank by user pain", desc: "Replace category theater with actual prioritization.",           effects: { quality: 1, scope: -1 }, consequence: "Several bugs are downgraded from 'critical' to 'annoying.' One moves in the opposite direction." },
      { label: "Close the edge cases and ship.",         desc: "Trust that users will stay politely on the happy path.",        effects: { scope: 1, quality: -1 }, consequence: "The release goes smoothly for the fictional user you optimized for." },
      { label: "Fix only the bugs tied to core flows.",  desc: "Protect login, checkout, save, and anything else capable of public humiliation.", effects: { quality: 1, scope: -1 }, consequence: "One bug survives every triage session through sheer charisma." },
      { label: "Make bug owners demo the issue live.",   desc: "A miracle cure for loose opinions.",                            effects: { trust: 1, morale: -1 },             consequence: "Half the arguments vanish once people have to reproduce their confidence in front of witnesses." },
    ],
  },
],
}

// ── Legendary cards — fire after stages 1 and 3 ──────────────────────────────

const LEGENDARY_CARDS = [
  {
    id: 'PM-inf', insertAfterStage: 1,
    title: 'The CEO Discovers AI',
    body: 'i listened to this podcast this weekend about AI. It sounds like the future. We should add AI to this.',
    choices: [
      { label: "Add an AI feature immediately",         desc: "'Great idea -- we've actually been thinking about this.'",      effects: { scope: -1 },   consequence: "It's on the roadmap. Nobody knows what the AI feature actually does yet. Including the CEO." },
      { label: "Ask what problem it solves",            desc: "Try to connect the idea to an actual user need.",               effects: { quality: 1 },             consequence: "Smart question. Wrong room. The CEO is now describing a problem that doesn't exist." },
      { label: 'Create an "AI strategy task force"',    desc: "Form a group dedicated to thinking about AI.",                  effects: { morale: -1 },              consequence: "A task force. The team knows what task forces produce. Spoiler: it's another meeting." },
      { label: 'Add "AI" to the roadmap slide',         desc: "Update the deck. Problem solved.",                              effects: { trust: 1 },  consequence: "The slide now says AI. Nothing else has changed. The CEO is satisfied." },
    ],
  },
  {
    id: 'PM-inf2', insertAfterStage: 3,
    title: 'The All-Hands Reorg',
    body: 'hey quick heads up - restructuring announcement going out tomorrow. your team is moving under Infrastructure now. no changes to your roadmap tho :)',
    choices: [
      { label: "Absorb it and move forward",           desc: "React with a thumbs up and pretend this won't affect anything.",  effects: { trust: 1 },             consequence: "You stayed calm. The new infra lead already has opinions about your backlog. Several of them." },
      { label: "Schedule a team offsite immediately",  desc: "'Let's realign on priorities.'",                                  effects: { morale: 1 },             consequence: "Team loves it. Roadmap loses a week. They think it was worth it. You're not sure." },
      { label: "Ask for clarity before committing",    desc: "Find out what 'no changes' actually means.",                      effects: { scope: 1 },              consequence: "Reasonable. Respected. You know 'no changes to your roadmap' is aspirational, not operational." },
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
  for (let s = 0; s <= 4; s++) {
    const drawn = shuffle(STAGE_POOLS[s]).slice(0, 3).map(c => ({ ...c, type: 'stage', stage: s }))
    seq.push(...drawn)
    const leg = LEGENDARY_CARDS.find(l => l.insertAfterStage === s)
    if (leg) seq.push({ ...leg, type: 'legendary', stage: s })
  }
  return seq
}

// ── Outcome helpers ──────────────────────────────────────────────────────────

const OUTCOME_TIERS = [
  {
    name: 'Complete Disaster',
    emoji: '💥',
    flavor: "Something went catastrophically wrong. The product technically launched, but the project collapsed under the weight of scope, chaos, or exhaustion. You shipped... something.",
  },
  {
    name: 'Multiple System Failures',
    emoji: '🚨',
    flavor: "The product launched, but several systems were already cracking. Deadlines slipped. Technical issues piled up. Confidence dropped. Everyone is calling this \"phase one.\"",
  },
  {
    name: 'Rough Ride',
    emoji: '🌧',
    flavor: "You made it to launch, but the road was bumpy. Tradeoffs were made. Corners were cut. Everyone felt the pressure. The product works, but nobody is celebrating yet.",
  },
  {
    name: 'Battle-Worn PM',
    emoji: '🪖',
    flavor: "This was a hard project. You negotiated scope, managed expectations, and made difficult calls. The team trusts you. The product shipped. That counts.",
  },
  {
    name: 'The Clean Launch',
    emoji: '🚀',
    flavor: "Everything came together. The roadmap held. The team stayed motivated. The product delivered real value. People are already asking what comes next.",
  },
]

const PM_STYLES = {
  tech_good:    { emoji: '⚙️', title: 'The Technical PM',          desc: "You actually understood what you were asking engineers to build. They noticed, and respected it. Several engineers said things like \"finally\" and \"💯\"" },
  tech_bad:     { emoji: '🔧', title: 'The Builder',               desc: "You worked closely with engineering and respected the craft. The architecture improved. Technical debt stayed under control. The codebase appreciates you." },
  trust_good:   { emoji: '🤝', title: 'The Diplomat',              desc: "You kept everyone aligned. Design felt heard. Engineering felt supported. Stakeholders felt informed. You spent half your time translating between groups." },
  trust_bad:    { emoji: '🗣️', title: 'The Stakeholder Whisperer', desc: "Executives rarely panicked. You anticipated concerns and framed decisions carefully. Meetings were shorter when you ran them." },
  quality_good: { emoji: '🎯', title: 'The Product Purist',        desc: "You never lost sight of the user problem. Features came and went. Ideas changed. The product stayed focused." },
  quality_bad:  { emoji: '🔍', title: 'The Researcher',            desc: "You kept going back to users. Assumptions were tested. Signals were questioned. The team made fewer guesses." },
  morale_good:  { emoji: '🛡️', title: 'The Team Champion',         desc: "The team trusted you. You protected focus, handled chaos, and made sure credit was shared. Morale stayed high even when the roadmap didn't." },
  morale_bad:   { emoji: '🔥', title: 'The Chaos Manager',         desc: "The project never really stabilized. You managed interruptions, pivots, and emergencies with impressive calm. The roadmap may not remember you fondly, but the team does." },
  roadmap_good: { emoji: '🔮', title: 'The Visionary',             desc: "You thought about the long game. The roadmap looked beyond the next sprint. Sometimes far beyond." },
  roadmap_bad:  { emoji: '🗺️', title: 'The Roadmap Warrior',       desc: "Deadlines meant something to you. Scope was negotiated. Features were cut. The schedule survived. Mostly." },
  strategist:   { emoji: '♟️', title: 'The Strategist',            desc: "You thought in systems. Features fit into a larger story. Tradeoffs were deliberate. People asked you to explain the roadmap more than once." },
  survivor:     { emoji: '🏃', title: 'The Survivor',              desc: "The project threw everything at you. Scope creep. Executive requests. Last-minute surprises. You kept the product moving anyway." },
}

function getOutcome(stats) {
  const entries = Object.entries(stats)
  const values = Object.values(stats)
  const maxVal = Math.max(...values)
  const minVal = Math.min(...values)
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
  const isBalanced = (maxVal - minVal) <= 2
  const isGoodOutcome = tier >= 3
  const pmStyleKey = isBalanced
    ? (isGoodOutcome ? 'strategist' : 'survivor')
    : `${bestKey}_${isGoodOutcome ? 'good' : 'bad'}`
  const outcome = OUTCOME_TIERS[tier]
  return {
    name: outcome.name,
    emoji: outcome.emoji,
    flavorText: outcome.flavor,
    tier,
    worstKey,
    pmStyle: PM_STYLES[pmStyleKey] || PM_STYLES.survivor,
  }
}

function clamp(v) { return Math.max(0, v) }
function applyEffects(stats, effects) {
  const next = { ...stats }
  for (const [k, v] of Object.entries(effects)) next[k] = clamp(next[k] + Math.max(-1, Math.min(1, v)))
  return next
}

// ── Design tokens ────────────────────────────────────────────────────────────

const STAT_COLORS = { scope: '#6554c0', tech: '#ff991f', morale: '#36b37e', quality: '#ec5a8f', trust: '#4bade8' }
const STAT_DESCS  = { scope: 'Roadmap focus', tech: 'Codebase health', morale: 'Team energy', quality: 'Product quality', trust: 'Stakeholder confidence' }
const EPIC_STYLES = {
  DISCOVERY:   { bg: '#eae6ff', color: '#6554c0' },
  STRATEGY:    { bg: '#deebff', color: '#0052cc' },
  DESIGN:      { bg: '#fce4ec', color: '#c2185b' },
  DEVELOPMENT: { bg: '#deebff', color: '#0052cc' },
  TESTING:     { bg: '#e3fcef', color: '#00875a' },
  URGENT:      { bg: '#ffebe6', color: '#de350b' },
}
const TIER_COLORS = ['#de350b', '#ff991f', '#ffab00', '#0052cc', '#00875a']

// ── GameNav ───────────────────────────────────────────────────────────────────

function GameNav({ crumb, dayLabel, onRestart }) {
  const nav = { background: '#fff', borderBottom: '1px solid #dfe1e6', display: 'flex', alignItems: 'center', gap: 14, padding: '0 20px', height: 48, position: 'sticky', top: 0, zIndex: 10 }
  return (
    <div style={nav}>
      <span style={{ fontFamily: '"Anton", sans-serif', fontSize: 17, letterSpacing: '-.01em' }}>
        PM SURVIVAL<span style={{ color: '#ec5a8f' }}>.</span>
      </span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: '#6b778c', fontSize: 13, fontFamily: '"Droid Sans", sans-serif' }}>
        <Link href="/" style={{ color: '#6b778c', textDecoration: 'none' }}>Home</Link>
        <span style={{ opacity: .45 }}>/</span>
        <span style={{ color: '#172b4d', fontWeight: 600 }}>{crumb}</span>
      </div>
      <div style={{ flex: 1 }} />
      {dayLabel && (
        <span style={{ fontSize: 12, fontWeight: 600, color: '#fff', background: '#0052cc', padding: '5px 11px', borderRadius: 3, fontFamily: '"Droid Sans", sans-serif' }}>{dayLabel}</span>
      )}
      {onRestart && (
        <button onClick={onRestart} style={{ fontSize: 12, color: '#6b778c', background: 'none', border: '1px solid #dfe1e6', borderRadius: 3, padding: '5px 10px', cursor: 'pointer', fontFamily: '"Droid Sans", sans-serif' }}>Restart</button>
      )}
      <div style={{ width: 28, height: 28, borderRadius: 999, background: '#ec5a8f', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 12, fontFamily: '"Droid Sans", sans-serif' }}>DM</div>
    </div>
  )
}

// ── StatRail ──────────────────────────────────────────────────────────────────

function StatRail({ stats, effects }) {
  return (
    <div className="pm-stat-rail" style={{ position: 'sticky', top: 70, background: '#fff', border: '1px solid #dfe1e6', borderRadius: 6, padding: '18px 18px 8px' }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#6b778c', fontFamily: '"Droid Sans", sans-serif' }}>Sprint Health</div>
      <div style={{ fontSize: 12, color: '#6b778c', margin: '3px 0 14px', fontFamily: '"Droid Sans", sans-serif' }}>5 stats · start at 5 / 10</div>
      {STATS_CONFIG.map(({ key, label }) => {
        const val = stats[key]
        const delta = effects?.[key]
        const color = STAT_COLORS[key]
        return (
          <div key={key} style={{ padding: '13px 0', borderTop: '1px solid #ebecf0', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#172b4d', fontFamily: '"Droid Sans", sans-serif' }}>{label}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#42526e', fontVariantNumeric: 'tabular-nums', fontFamily: '"Oswald", sans-serif' }}>{val}</span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: '#ebecf0', marginTop: 8, overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 4, background: color, width: `${Math.min(val * 10, 100)}%`, transition: 'width .7s cubic-bezier(.2,.8,.2,1)' }} />
            </div>
            {delta != null && (
              <span style={{ position: 'absolute', right: 0, top: 9, fontSize: 13, fontWeight: 700, color: delta > 0 ? '#00875a' : '#de350b', fontFamily: '"Droid Sans", sans-serif', animation: 'pmStatDelta 2s ease forwards' }}>
                {delta > 0 ? `+${delta}` : delta}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── IssueCard ─────────────────────────────────────────────────────────────────

function IssueCard({ card, onChoice, chosen, onContinue, continueLabel }) {
  const epic = EPIC_STYLES[card.epic] || { bg: '#f4f5f7', color: '#6b778c' }
  return (
    <div style={{ background: '#fff', border: '1px solid #dfe1e6', borderRadius: 6, boxShadow: '0 1px 2px rgba(9,30,66,.1)', overflow: 'hidden' }}>
      {/* Issue header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '13px 22px', borderBottom: '1px solid #ebecf0' }}>
        <span style={{ width: 18, height: 18, borderRadius: 3, background: '#36b37e', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 11, fontWeight: 700, flexShrink: 0, fontFamily: '"Droid Sans", sans-serif' }}>›</span>
        <span style={{ fontWeight: 600, color: '#6b778c', fontSize: 13, fontFamily: '"Droid Sans", sans-serif' }}>{card.id}</span>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 3, background: epic.bg, color: epic.color, fontFamily: '"Droid Sans", sans-serif' }}>{card.epic}</span>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: '#0052cc', background: '#deebff', padding: '5px 10px', borderRadius: 3, fontFamily: '"Droid Sans", sans-serif' }}>● In Progress</span>
      </div>

      {/* Issue body */}
      <div style={{ padding: '22px 24px 26px' }}>
        <p style={{ fontFamily: '"Oswald", sans-serif', fontWeight: 600, fontSize: 27, lineHeight: 1.28, letterSpacing: '.012em', margin: 0, color: '#172b4d' }}>
          {card.scenario.replace(/\s*What do you do\?$/i, '')}
        </p>

        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#6b778c', margin: '34px 0 14px', fontFamily: '"Droid Sans", sans-serif' }}>
          What do you do?
        </div>

        <div>
          {card.choices.map((choice, i) => {
            const isChosen = chosen?.index === i
            const isOther  = chosen && !isChosen
            return (
              <button
                key={i}
                onClick={!chosen ? () => onChoice(choice, i) : undefined}
                disabled={!!chosen}
                className={chosen ? undefined : 'pm-game-opt'}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  background: isChosen ? '#e3fcef' : '#fff',
                  border: `1.5px solid ${isChosen ? '#00875a' : '#dfe1e6'}`,
                  borderRadius: 8,
                  padding: isOther ? '11px 18px' : '16px 44px 16px 18px',
                  cursor: chosen ? 'default' : 'pointer',
                  marginBottom: 10, position: 'relative',
                  opacity: isOther ? .38 : 1,
                  boxShadow: isChosen ? '0 0 0 1px #00875a' : 'none',
                  transition: 'padding .2s',
                }}
              >
                <div style={{ fontFamily: '"Droid Sans", sans-serif', fontWeight: 700, fontSize: 15.5, lineHeight: 1.3, color: '#172b4d' }}>
                  {choice.label}
                </div>
                {!isOther && (
                  <div style={{ fontFamily: '"Droid Sans", sans-serif', fontWeight: 400, fontStyle: 'italic', fontSize: 16.5, color: '#172b4d', lineHeight: 1.5, marginTop: 7 }}>{choice.desc}</div>
                )}
                {!chosen && (
                  <span className="pm-opt-arrow" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%) translateX(-4px)', color: '#0065ff', fontSize: 17, opacity: 0, transition: 'opacity .15s, transform .15s', pointerEvents: 'none' }}>→</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Resolved modal */}
        {chosen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(9,30,66,.5)', animation: 'gameRev .2s ease' }}>
            <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 8px 32px rgba(9,30,66,.3)', padding: '32px 36px', maxWidth: 480, width: '90%', textAlign: 'center' }}>
              <div style={{ background: '#f4f5f7', borderRadius: 6, padding: '18px 20px', marginBottom: 20 }}>
                <p style={{ fontSize: 18, lineHeight: 1.6, color: '#172b4d', margin: 0, fontFamily: '"Droid Sans", sans-serif' }}>{chosen.consequence}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 }}>
                {Object.entries(chosen.effects).map(([k, v]) => {
                  const cfg = STATS_CONFIG.find(s => s.key === k)
                  const clamped = Math.max(-1, Math.min(1, v))
                  return (
                    <span key={k} style={{ fontSize: 14, fontWeight: 700, padding: '4px 10px', borderRadius: 3, background: clamped > 0 ? '#e3fcef' : '#ffebe6', color: clamped > 0 ? '#00875a' : '#de350b', fontFamily: '"Droid Sans", sans-serif' }}>
                      {cfg?.label} {clamped > 0 ? `+${clamped}` : clamped}
                    </span>
                  )
                })}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#fff', background: '#00875a', padding: '10px 14px', borderRadius: 4, fontFamily: '"Droid Sans", sans-serif' }}>✓ Resolved</div>
                <button
                  onClick={onContinue}
                  style={{ background: '#0052cc', color: '#fff', border: 'none', borderRadius: 4, fontFamily: '"Droid Sans", sans-serif', fontSize: 14, fontWeight: 600, padding: '10px 22px', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#0065ff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#0052cc' }}
                >{continueLabel ?? '← Back to jira'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── ConsequencePanel (for legendary/Slack cards after choice) ─────────────────

function ConsequencePanel({ chosen, onContinue }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #dfe1e6', borderRadius: 6, boxShadow: '0 1px 2px rgba(9,30,66,.1)', padding: '28px 28px 24px', animation: 'gameRev .35s cubic-bezier(.2,.8,.2,1)' }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#6b778c', marginBottom: 14, fontFamily: '"Droid Sans", sans-serif' }}>Sent · Jordan Chen (CEO)</div>
      <p style={{ fontSize: 16, lineHeight: 1.55, color: '#172b4d', margin: 0, fontFamily: '"Droid Sans", sans-serif' }}>{chosen.consequence}</p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 18 }}>
        {Object.entries(chosen.effects).map(([k, v]) => {
          const cfg = STATS_CONFIG.find(s => s.key === k)
          return (
            <span key={k} style={{ fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: 3, background: v > 0 ? '#e3fcef' : '#ffebe6', color: v > 0 ? '#00875a' : '#de350b', fontFamily: '"Droid Sans", sans-serif' }}>
              {cfg.label} {v > 0 ? `+${v}` : v}
            </span>
          )
        })}
      </div>
      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onContinue}
          style={{ background: '#0052cc', color: '#fff', border: 'none', borderRadius: 4, fontFamily: '"Droid Sans", sans-serif', fontSize: 14, fontWeight: 600, padding: '9px 18px', cursor: 'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#0065ff' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#0052cc' }}
        >Next issue →</button>
      </div>
    </div>
  )
}

// ── SlackModal ────────────────────────────────────────────────────────────────

function SlackModal({ card, onChoice, chosen, onContinue }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50 }}>
      {/* Scrim */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(9,30,66,.72)' }} />

      {/* Alert pill */}
      <div style={{
        position: 'absolute', top: 64, left: '50%',
        transform: 'translateX(-50%)',
        background: '#de350b', color: '#fff', borderRadius: 999,
        padding: '8px 18px', fontSize: 13, fontWeight: 700,
        display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
        boxShadow: '0 4px 14px rgba(222,53,11,.5)', zIndex: 52,
        fontFamily: '"Droid Sans", sans-serif',
        animation: 'pmAlertDrop .4s cubic-bezier(.2,.8,.2,1)',
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'pmPulse 1.2s ease-in-out infinite' }} />
        New direct message · Jordan Chen (CEO)
      </div>

      {/* Slack window */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 24px 24px' }}>
        <div style={{ width: '100%', maxWidth: 680, borderRadius: 10, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,.5)' }}>
          {/* Mac traffic lights */}
          <div style={{ background: '#1a1d21', display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px 8px' }}>
            {['#ff5f57', '#ffbd2e', '#28ca41'].map(c => <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />)}
          </div>

          <div style={{ display: 'flex', minHeight: 460 }}>
            {/* Sidebar */}
            <div style={{ width: 200, background: '#3f0e40', display: 'flex', flexDirection: 'column', padding: '8px 0', flexShrink: 0 }}>
              <div style={{ padding: '4px 12px 8px', fontFamily: '"Lato", sans-serif', fontWeight: 700, fontSize: 15, color: '#fff' }}>Acme Product Co</div>
              {['Home', 'DMs', 'Activity'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 20px', color: 'rgba(255,255,255,.5)', fontSize: 13, fontFamily: '"Lato", sans-serif' }}>
                  <div style={{ width: 14, height: 14, borderRadius: 3, background: 'rgba(255,255,255,.2)', flexShrink: 0 }} />{item}
                </div>
              ))}
              <div style={{ padding: '10px 12px 4px', fontSize: 11, fontWeight: 900, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', fontFamily: '"Lato", sans-serif' }}>Channels</div>
              {['#general', '#eng-team', '#design-sync', '#all-hands'].map(ch => (
                <div key={ch} style={{ margin: '1px 8px', padding: '4px 8px', borderRadius: 4, background: 'transparent', color: 'rgba(255,255,255,.5)', fontSize: 13, fontFamily: '"Lato", sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {ch}
                </div>
              ))}
              <div style={{ padding: '10px 12px 4px', fontSize: 11, fontWeight: 900, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', fontFamily: '"Lato", sans-serif' }}>Direct Messages</div>
              {[{ name: 'Jordan Chen (CEO)', online: true }, { name: 'You', online: false }].map(u => (
                <div key={u.name} style={{ margin: '1px 8px', padding: '4px 8px', borderRadius: 4, background: u.name === 'Jordan Chen (CEO)' ? '#1264a3' : 'transparent', color: u.name === 'Jordan Chen (CEO)' ? '#fff' : 'rgba(255,255,255,.4)', fontSize: 12, fontFamily: '"Lato", sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: u.online ? '#2bac76' : '#6b778c', flexShrink: 0 }} />{u.name}
                  {u.name === 'Jordan Chen (CEO)' && <span style={{ marginLeft: 'auto', background: '#de350b', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '1px 5px', fontFamily: '"Lato", sans-serif' }}>1</span>}
                </div>
              ))}
            </div>

            {/* Channel pane */}
            <div style={{ flex: 1, background: '#fff', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', borderBottom: '1px solid #e8e8e8', gap: 8 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#f59e0b', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 10, fontWeight: 700, fontFamily: '"Lato", sans-serif', flexShrink: 0 }}>JC</div>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1d1c1d', fontFamily: '"Lato", sans-serif' }}>Jordan Chen</span>
                <span style={{ fontSize: 11, background: '#dcf0e4', color: '#007a5a', padding: '1px 5px', borderRadius: 3, fontFamily: '"Lato", sans-serif' }}>active</span>
              </div>

              <div style={{ flex: 1, padding: '16px 18px', overflowY: 'auto' }}>
                {/* CEO message */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 4, background: '#f59e0b', flexShrink: 0, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: '"Lato", sans-serif' }}>JC</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#1d1c1d', fontFamily: '"Lato", sans-serif' }}>Jordan Chen</span>
                      <span style={{ fontSize: 12, color: '#616061', fontFamily: '"Lato", sans-serif' }}>just now</span>
                      <span style={{ fontSize: 11, background: '#dcf0e4', color: '#007a5a', padding: '1px 5px', borderRadius: 3, fontFamily: '"Lato", sans-serif' }}>active</span>
                    </div>
                    <p style={{ fontSize: 14, color: '#1d1c1d', margin: 0, lineHeight: 1.46, fontFamily: '"Lato", sans-serif' }}>{card.body}</p>
                    <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                      {['😰', '🤔', '🙃'].map(e => <span key={e} style={{ fontSize: 16, padding: '2px 4px', borderRadius: 4, cursor: 'pointer' }}>{e}</span>)}
                    </div>
                  </div>
                </div>

                {!chosen ? (
                  <>
                    {/* Reply separator */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '14px 0 10px' }}>
                      <div style={{ flex: 1, height: 1, background: '#e8e8e8' }} />
                      <span style={{ fontSize: 12, color: '#616061', fontFamily: '"Lato", sans-serif' }}>Reply as yourself</span>
                      <div style={{ flex: 1, height: 1, background: '#e8e8e8' }} />
                    </div>
                    <div style={{ fontSize: 12, color: '#616061', marginBottom: 8, fontFamily: '"Lato", sans-serif' }}>How do you respond?</div>
                    {card.choices.map((choice, i) => (
                      <div
                        key={i}
                        className="pm-slack-reply"
                        onClick={() => onChoice(choice, i)}
                        style={{ padding: '10px 12px', borderRadius: 4, cursor: 'pointer', marginBottom: 4, borderLeft: '3px solid transparent', fontFamily: '"Lato", sans-serif' }}
                      >
                        <div style={{ fontWeight: 700, fontSize: 13, color: '#1d1c1d', fontFamily: '"Droid Sans", sans-serif' }}>{choice.label}</div>
                        <div style={{ fontSize: 13, color: '#4a4a4a', marginTop: 2, lineHeight: 1.4, fontFamily: '"Droid Sans", sans-serif' }}>{choice.desc}</div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div style={{ marginTop: 14, padding: '14px 16px', background: '#e3fcef', border: '1px solid #abf5d1', borderRadius: 6, animation: 'gameRev .35s cubic-bezier(.2,.8,.2,1)' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#fff', background: '#00875a', padding: '3px 9px', borderRadius: 3, fontFamily: '"Lato", sans-serif' }}>Result</span>
                    <p style={{ fontSize: 14, lineHeight: 1.5, color: '#172b4d', margin: '10px 0 0', fontFamily: '"Lato", sans-serif' }}>{chosen.consequence}</p>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                      {Object.entries(chosen.effects).map(([k, v]) => {
                        const cfg = STATS_CONFIG.find(s => s.key === k)
                        return cfg ? (
                          <span key={k} style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 3, background: v > 0 ? '#e3fcef' : '#ffebe6', color: v > 0 ? '#00875a' : '#de350b', fontFamily: '"Lato", sans-serif' }}>
                            {cfg.label} {v > 0 ? `+${v}` : v}
                          </span>
                        ) : null
                      })}
                    </div>
                    <div style={{ marginTop: 14, display: 'flex', justifyContent: 'flex-end' }}>
                      <button
                        onClick={onContinue}
                        style={{ background: '#0052cc', color: '#fff', border: 'none', borderRadius: 4, fontFamily: '"Lato", sans-serif', fontSize: 13, fontWeight: 700, padding: '8px 16px', cursor: 'pointer' }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#0065ff' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#0052cc' }}
                      >Continue →</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Composer */}
              <div style={{ borderTop: '1px solid #e8e8e8', padding: '8px 12px' }}>
                <div style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderBottom: '1px solid #e8e8e8', background: '#f8f8f8' }}>
                    {['B', 'I', 'S'].map(f => <button key={f} style={{ fontSize: 12, color: '#616061', fontWeight: 700, width: 20, height: 20, background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"Lato", sans-serif' }}>{f}</button>)}
                  </div>
                  <div style={{ padding: '8px 12px', fontSize: 14, color: '#ccc', fontFamily: '"Lato", sans-serif' }}>Message Jordan Chen</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── BoardTicket ───────────────────────────────────────────────────────────────

function BoardTicket({ card, epic, clickable, done, onCardClick }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={clickable ? () => onCardClick(card.seqIdx) : undefined}
      onMouseEnter={clickable ? () => setHovered(true)  : undefined}
      onMouseLeave={clickable ? () => setHovered(false) : undefined}
      style={{
        background: '#fff',
        border: `1px solid ${hovered ? '#0065ff' : '#dfe1e6'}`,
        borderRadius: 4,
        padding: '12px 14px',
        marginBottom: 8,
        cursor: clickable ? 'pointer' : 'default',
        opacity: done ? 0.6 : 1,
        boxShadow: hovered ? '0 2px 8px rgba(0,101,255,.18)' : '0 1px 2px rgba(9,30,66,.08)',
        transition: 'border-color .15s, box-shadow .15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', padding: '2px 7px', borderRadius: 3, background: epic.bg, color: epic.color, fontFamily: '"Droid Sans", sans-serif' }}>
          {card.epic}
        </span>
        {done && <span style={{ marginLeft: 'auto', fontSize: 11, color: '#00875a', fontWeight: 700, fontFamily: '"Droid Sans", sans-serif' }}>✓ Done</span>}
      </div>
      <p style={{ fontFamily: '"Droid Sans", sans-serif', fontSize: 13, lineHeight: 1.45, color: '#172b4d', margin: '0 0 10px' }}>
        {card.scenario.length > 88 ? card.scenario.slice(0, 88) + '…' : card.scenario}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: '#6b778c' }}>{card.id}</span>
        {clickable && (
          <span style={{ fontSize: 11, color: hovered ? '#0052cc' : '#6b778c', fontWeight: 600, fontFamily: '"Droid Sans", sans-serif', transition: 'color .15s' }}>
            Open →
          </span>
        )}
      </div>
    </div>
  )
}

// ── JiraBoard ─────────────────────────────────────────────────────────────────

function JiraBoard({ stageIdx, stageCards, doneSet, onCardClick }) {
  const todos = stageCards.filter(c => !doneSet.has(c.seqIdx))
  const done  = stageCards.filter(c =>  doneSet.has(c.seqIdx))

  const COLUMNS = [
    { id: 'todo',   label: 'To Do',       dotColor: '#dfe1e6', cards: todos, clickable: true  },
    { id: 'inprog', label: 'In Progress',  dotColor: '#0052cc', cards: [],    clickable: false },
    { id: 'done',   label: 'Done',         dotColor: '#00875a', cards: done,  clickable: false },
  ]

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b778c', fontFamily: '"Droid Sans", sans-serif' }}>
          Sprint {stageIdx + 1} of 5
        </div>
        <h1 style={{ fontFamily: '"Oswald", sans-serif', fontWeight: 600, fontSize: 26, letterSpacing: '.02em', textTransform: 'uppercase', color: '#172b4d', margin: '4px 0 6px' }}>
          {STAGES[stageIdx]}
        </h1>
        <div style={{ fontSize: 13, color: '#6b778c', fontFamily: '"Droid Sans", sans-serif' }}>
          {done.length} of {stageCards.length} tickets resolved · click a ticket to open it
        </div>
      </div>

      <div className="pm-board-grid">
        {COLUMNS.map(col => (
          <div key={col.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 9, padding: '0 2px' }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: col.dotColor }} />
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: '#6b778c', fontFamily: '"Droid Sans", sans-serif' }}>
                {col.label}
              </span>
              <span style={{ fontSize: 11, color: '#6b778c', background: '#ebecf0', borderRadius: 10, padding: '1px 7px', fontFamily: '"Droid Sans", sans-serif' }}>
                {col.cards.length}
              </span>
            </div>
            <div style={{ background: '#ebecf0', borderRadius: 6, padding: 8, minHeight: 100 }}>
              {col.cards.map(card => {
                const epic = EPIC_STYLES[card.epic] || { bg: '#f4f5f7', color: '#6b778c' }
                return (
                  <BoardTicket
                    key={card.id}
                    card={card}
                    epic={epic}
                    clickable={col.clickable}
                    done={col.id === 'done'}
                    onCardClick={onCardClick}
                  />
                )
              })}
              {col.cards.length === 0 && (
                <div style={{ display: 'grid', placeItems: 'center', minHeight: 70, color: '#c1c7d0', fontSize: 12, fontFamily: '"Droid Sans", sans-serif' }}>
                  No tickets
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── IntroScreen ───────────────────────────────────────────────────────────────

function IntroScreen({ onStart }) {
  return (
    <div style={{ background: '#f4f5f7', minHeight: '100vh', fontFamily: '"Droid Sans", sans-serif' }}>
      <GameNav crumb="New game" />
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '44px 24px 70px' }}>

        {/* Hero row */}
        <div className="pm-intro-hero" style={{ display: 'flex', gap: 30, alignItems: 'flex-start' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: '"Droid Sans", sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '.16em', textTransform: 'uppercase', color: '#ec5a8f' }}>A realistic PM simulation</div>
            <h1 style={{ fontFamily: '"Oswald", sans-serif', fontWeight: 700, fontSize: 'clamp(40px,7vw,62px)', lineHeight: .98, letterSpacing: '.005em', textTransform: 'uppercase', margin: '12px 0 0', color: '#172b4d' }}>The PM Survival Game</h1>
            <p style={{ fontSize: 16, lineHeight: 1.6, color: '#42526e', margin: '16px 0 0', maxWidth: '46ch' }}>
              Think you can ship the product without burning out the team, blowing the roadmap, or losing your stakeholders&rsquo; trust? Five sprints. Fifteen tickets. No good options.
            </p>
          </div>
          {/* Tilted ticket badge */}
          <div className="pm-intro-badge" style={{ flexShrink: 0, width: 168, background: '#fff', border: '1px solid #dfe1e6', borderRadius: 10, boxShadow: '0 6px 18px rgba(9,30,66,.12)', padding: '15px 16px', transform: 'rotate(3deg)' }}>
            <div style={{ fontSize: 11, color: '#6b778c', fontFamily: 'monospace' }}>DISC—001</div>
            <span style={{ display: 'inline-block', fontSize: 9, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#fff', background: '#6554c0', padding: '2px 7px', borderRadius: 3, marginTop: 8 }}>Discovery</span>
            <div style={{ fontFamily: '"Oswald", sans-serif', fontWeight: 500, fontSize: 14, lineHeight: 1.32, marginTop: 9, color: '#172b4d' }}>The CEO has three product visions. You have room for one.</div>
            <div style={{ fontFamily: '"Droid Sans", sans-serif', fontWeight: 700, fontSize: 11, color: '#ec5a8f', marginTop: 10 }}>What do you do?</div>
          </div>
        </div>

        {/* How to play */}
        <div style={{ background: '#fff', border: '1px solid #dfe1e6', borderRadius: 12, padding: '24px 26px', marginTop: 22 }}>
          <h2 style={{ fontFamily: '"Oswald", sans-serif', fontWeight: 600, fontSize: 13, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6b778c', margin: '0 0 16px' }}>How to Play</h2>
          <div className="pm-how-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 26px' }}>
            {[
              ['5 sprints', 'Take the product from discovery to launch across 5 sprints — each with 3 Jira tickets to resolve, in order.'],
              ['Tradeoffs', 'Every choice is a tradeoff. Pick a response and live with the consequence.'],
              ['Slack interrupts', 'Urgent Slack messages will interrupt you — the CEO with a quick thought. Handle it.'],
              ['5 / 10 start', 'Every stat starts at 5 / 10. Keep them balanced — your lowest stat decides how the launch goes.'],
            ].map(([title, text], i) => (
              <div key={i} style={{ display: 'flex', gap: 11, fontSize: 14, lineHeight: 1.5, color: '#42526e' }}>
                <span style={{ fontFamily: '"Oswald", sans-serif', fontWeight: 600, fontSize: 15, color: '#ec5a8f', flexShrink: 0 }}>{i + 1}</span>
                <span><strong style={{ fontFamily: '"Droid Sans", sans-serif' }}>{title}</strong> — {text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ background: '#fff', border: '1px solid #dfe1e6', borderRadius: 12, padding: '24px 26px', marginTop: 16 }}>
          <h2 style={{ fontFamily: '"Oswald", sans-serif', fontWeight: 600, fontSize: 13, letterSpacing: '.12em', textTransform: 'uppercase', color: '#6b778c', margin: '0 0 4px' }}>The 5 Stats — all start at 5 / 10</h2>
          {STATS_CONFIG.map(({ key, label }) => {
            const color = STAT_COLORS[key]
            return (
              <div key={key} style={{ display: 'grid', gridTemplateColumns: '108px 1fr', gap: 16, alignItems: 'center', padding: '11px 0', borderTop: '1px solid #ebecf0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: '"Oswald", sans-serif', fontWeight: 600, fontSize: 15, textTransform: 'uppercase', letterSpacing: '.04em', color: '#172b4d' }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: color, flexShrink: 0 }} />
                  {label}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ fontSize: 13, color: '#6b778c', lineHeight: 1.45, fontFamily: '"Droid Sans", sans-serif' }}>{STAT_DESCS[key]}</span>
                  <div style={{ width: 130, flexShrink: 0, display: 'flex', gap: 4 }}>
                    {Array.from({ length: 10 }).map((_, j) => (
                      <div key={j} style={{ height: 12, flex: 1, borderRadius: 3, background: j < 5 ? color : '#ebecf0' }} />
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Start */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginTop: 30 }}>
          <button
            onClick={onStart}
            className="pm-start-btn"
            style={{ fontFamily: '"Oswald", sans-serif', fontWeight: 600, fontSize: 19, letterSpacing: '.03em', textTransform: 'uppercase', background: '#ec5a8f', color: '#fff', border: 'none', borderRadius: 8, padding: '15px 40px', cursor: 'pointer', boxShadow: '0 4px 0 #c8407a' }}
          >Start Sprint 1 · Discovery</button>
          <p style={{ fontSize: 12.5, color: '#6b778c', margin: 0, fontFamily: '"Droid Sans", sans-serif' }}>15 tickets · Slack interrupts · no good options</p>
        </div>
      </div>
    </div>
  )
}

// ── OutcomeScreen ─────────────────────────────────────────────────────────────

function OutcomeScreen({ stats, sequence, onRestart }) {
  const { name, emoji, flavorText, tier, pmStyle } = getOutcome(stats)
  const borderColor = TIER_COLORS[tier]
  const allVals = Object.values(stats)
  const maxVal = Math.max(...allVals)
  const minVal = Math.min(...allVals)

  return (
    <div style={{ background: '#f4f5f7', minHeight: '100vh', fontFamily: '"Droid Sans", sans-serif' }}>
      <GameNav crumb="Sprint Report" />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '34px 24px 70px' }}>

        {/* PM Style hero */}
        <div style={{
          position: 'relative', borderRadius: 12, overflow: 'hidden', color: '#fff',
          padding: '30px 32px 28px', boxShadow: '0 6px 18px rgba(9,30,66,.16)',
          background: 'radial-gradient(120% 130% at 88% 0%, rgba(255,255,255,.2), transparent 55%), linear-gradient(135deg, #ec5a8f, #c8407a)',
        }}>
          <span style={{ position: 'absolute', top: 24, right: 30, fontSize: 50, lineHeight: 1 }}>{pmStyle.emoji}</span>
          <div style={{ fontFamily: '"Droid Sans", sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', opacity: .88 }}>Your PM Style</div>
          <h1 style={{ fontFamily: '"Oswald", sans-serif', fontWeight: 700, fontSize: 'clamp(36px,7.5vw,52px)', lineHeight: 1, letterSpacing: '.01em', textTransform: 'uppercase', margin: '8px 0 0' }}>{pmStyle.title}</h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, marginTop: 14, opacity: .96, maxWidth: '52ch' }}>{pmStyle.desc}</p>
        </div>

        {/* Verdict */}
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', background: '#fff', border: '1px solid #dfe1e6', borderLeft: `5px solid ${borderColor}`, borderRadius: 10, padding: '20px 22px', marginTop: 16, boxShadow: '0 1px 2px rgba(9,30,66,.1)' }}>
          <span style={{ fontSize: 40, lineHeight: 1, flexShrink: 0 }}>{emoji}</span>
          <div>
            <div style={{ fontFamily: '"Droid Sans", sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: borderColor }}>
              You brought a product to market · {sequence.length} cards
            </div>
            <h2 style={{ fontFamily: '"Oswald", sans-serif', fontWeight: 600, fontSize: 24, letterSpacing: '.01em', textTransform: 'uppercase', margin: '3px 0 0', color: '#172b4d' }}>{name}</h2>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: '#42526e', margin: '7px 0 0' }}>{flavorText}</p>
          </div>
        </div>

        {/* Final stats */}
        <div style={{ marginTop: 16, background: '#fff', border: '1px solid #dfe1e6', borderRadius: 10, padding: '24px 28px 26px' }}>
          <div style={{ fontFamily: '"Oswald", sans-serif', fontWeight: 600, fontSize: 13, letterSpacing: '.1em', textTransform: 'uppercase', color: '#6b778c', margin: '0 0 14px' }}>Final Sprint Health</div>
          <div className="pm-stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 24px' }}>
            {STATS_CONFIG.map(({ key, label }) => {
              const val = stats[key]
              const color = STAT_COLORS[key]
              const isTop = val === maxVal
              const isLow = val === minVal && val < maxVal
              return (
                <div key={key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700, fontSize: 13, color: '#172b4d', fontFamily: '"Droid Sans", sans-serif' }}>
                      {label}
                      {isTop && <span style={{ fontWeight: 700, fontSize: 9, color: '#fff', background: '#00875a', padding: '2px 6px', borderRadius: 3, marginLeft: 6, verticalAlign: 'middle' }}>TOP</span>}
                      {isLow && <span style={{ fontWeight: 700, fontSize: 9, color: '#fff', background: '#de350b', padding: '2px 6px', borderRadius: 3, marginLeft: 6, verticalAlign: 'middle' }}>{key === 'scope' ? 'BLOATED' : 'LOW'}</span>}
                    </span>
                    <span style={{ fontFamily: '"Oswald", sans-serif', fontWeight: 600, fontSize: 17, color: '#42526e' }}>{val}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: '#ebecf0', marginTop: 7, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 4, background: color, width: `${Math.min(val * 10, 100)}%` }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: 30, marginTop: 26, paddingTop: 22, borderTop: '1px solid #ebecf0' }}>
            {[
              { n: `${sequence.filter(c => c.type === 'stage').length}`, l: 'Cards resolved' },
              { n: `${sequence.filter(c => c.type === 'legendary').length}`, l: 'Slack interrupts' },
              { n: `${STATS_CONFIG.filter(s => stats[s.key] <= 3).length}`, l: 'Stats in the red' },
            ].map(({ n, l }) => (
              <div key={l}>
                <div style={{ fontFamily: '"Oswald", sans-serif', fontWeight: 600, fontSize: 26, color: '#172b4d' }}>{n}</div>
                <div style={{ fontSize: 12, color: '#6b778c', marginTop: 2, fontFamily: '"Droid Sans", sans-serif' }}>{l}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <button
              onClick={onRestart}
              style={{ fontFamily: '"Droid Sans", sans-serif', fontWeight: 700, fontSize: 14, borderRadius: 6, padding: '12px 22px', cursor: 'pointer', background: '#0052cc', color: '#fff', border: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#0065ff' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#0052cc' }}
            >Play again</button>
            <Link href="/" style={{ fontFamily: '"Droid Sans", sans-serif', fontWeight: 700, fontSize: 14, borderRadius: 6, padding: '12px 22px', cursor: 'pointer', background: '#fff', color: '#172b4d', border: '1.5px solid #dfe1e6', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>← Back to site</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main game component ───────────────────────────────────────────────────────

export default function RoadmapGameClient() {
  const [gameState, setGameState]           = useState('intro')  // 'intro' | 'playing' | 'outcome'
  const [viewMode,  setViewMode]            = useState('board')  // 'board' | 'card'
  const [activeIdx, setActiveIdx]           = useState(null)
  const [doneSet,   setDoneSet]             = useState(new Set())
  const [stats,     setStats]               = useState(INITIAL_STATS)
  const [chosen,    setChosen]              = useState(null)
  const [sequence,  setSequence]            = useState([])
  const [pendingLegendary, setPendingLeg]   = useState(null)

  // First stage that still has unresolved cards
  const currentStage = (() => {
    if (!sequence.length) return 0
    for (let s = 0; s <= 4; s++) {
      if (sequence.some((c, i) => c.type === 'stage' && c.stage === s && !doneSet.has(i))) return s
    }
    return 4
  })()

  const currentStageCards = sequence
    .map((c, i) => ({ ...c, seqIdx: i }))
    .filter(c => c.type === 'stage' && c.stage === currentStage)

  const activeCard = activeIdx !== null ? sequence[activeIdx] : null
  const showSlack  = !!pendingLegendary

  function handleStart() {
    const seq = buildSequence()
    setSequence(seq)
    setDoneSet(new Set())
    setStats(INITIAL_STATS)
    setChosen(null)
    setActiveIdx(null)
    setViewMode('board')
    setPendingLeg(null)
    setGameState('playing')
  }

  function handleCardClick(seqIdx) {
    setActiveIdx(seqIdx)
    setChosen(null)
    setViewMode('card')
  }

  function handleChoice(choice, index) {
    setStats(prev => applyEffects(prev, choice.effects))
    setChosen({ effects: choice.effects, consequence: choice.consequence, index })
  }

  function handleBackToBoard() {
    const newDone = new Set(doneSet)
    newDone.add(activeIdx)
    const stage = sequence[activeIdx].stage
    const stageIndices = sequence
      .map((c, i) => (c.type === 'stage' && c.stage === stage ? i : -1))
      .filter(i => i !== -1)
    const stageComplete = stageIndices.every(i => newDone.has(i))

    setDoneSet(newDone)
    setActiveIdx(null)
    setChosen(null)
    setViewMode('board')

    if (stageComplete) {
      const leg = sequence.find(c => c.type === 'legendary' && c.stage === stage)
      if (leg) { setPendingLeg(leg); return }
      if (sequence.every((c, i) => c.type !== 'stage' || newDone.has(i))) {
        setGameState('outcome')
      }
    }
  }

  function handleLegendaryChoice(choice) {
    setStats(prev => applyEffects(prev, choice.effects))
    setChosen({ effects: choice.effects, consequence: choice.consequence })
  }

  function handleLegendaryContinue() {
    setPendingLeg(null)
    setChosen(null)
    if (sequence.every((c, i) => c.type !== 'stage' || doneSet.has(i))) {
      setGameState('outcome')
    }
  }

  function handleRestart() {
    setGameState('intro')
    setViewMode('board')
    setActiveIdx(null)
    setDoneSet(new Set())
    setStats(INITIAL_STATS)
    setChosen(null)
    setSequence([])
    setPendingLeg(null)
  }

  if (gameState === 'outcome') {
    return <OutcomeScreen stats={stats} sequence={sequence} onRestart={handleRestart} />
  }

  if (gameState === 'intro') {
    return <IntroScreen onStart={handleStart} />
  }

  // ── Card view ──────────────────────────────────────────────────────────────
  if (viewMode === 'card' && activeCard) {
    return (
      <div style={{ minHeight: '100vh', background: '#f4f5f7', fontFamily: '"Droid Sans", sans-serif' }}>
        <GameNav
          crumb={`Sprint ${activeCard.stage + 1} — ${STAGES[activeCard.stage]}`}
          dayLabel={`Sprint ${activeCard.stage + 1} of 5`}
          onRestart={handleRestart}
        />
        <div className="pm-game-wrap" style={{ maxWidth: 980, margin: '0 auto', padding: '34px 24px 60px', display: 'grid', gridTemplateColumns: '1fr 260px', gap: 28, alignItems: 'start' }}>
          <IssueCard
            card={activeCard}
            onChoice={handleChoice}
            chosen={chosen}
            onContinue={handleBackToBoard}
            continueLabel="← Back to jira"
          />
          <StatRail stats={stats} effects={chosen?.effects} />
        </div>
      </div>
    )
  }

  // ── Board view ─────────────────────────────────────────────────────────────
  return (
    <>
      <div style={{ minHeight: '100vh', background: '#f4f5f7', fontFamily: '"Droid Sans", sans-serif', filter: showSlack ? 'blur(2px) brightness(.7)' : 'none', transition: 'filter .3s', pointerEvents: showSlack ? 'none' : 'auto' }}>
        <GameNav
          crumb={`Sprint ${currentStage + 1} — ${STAGES[currentStage]}`}
          dayLabel={`Sprint ${currentStage + 1} of 5`}
          onRestart={handleRestart}
        />
        <div style={{ maxWidth: 980, margin: '0 auto', padding: '34px 24px 60px', display: 'grid', gridTemplateColumns: '1fr 260px', gap: 28, alignItems: 'start' }}>
          <JiraBoard
            stageIdx={currentStage}
            stageCards={currentStageCards}
            doneSet={doneSet}
            onCardClick={handleCardClick}
          />
          <StatRail stats={stats} effects={null} />
        </div>
      </div>
      {showSlack && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'auto' }}>
          <SlackModal
            card={pendingLegendary}
            onChoice={handleLegendaryChoice}
            chosen={chosen}
            onContinue={handleLegendaryContinue}
          />
        </div>
      )}
    </>
  )
}
