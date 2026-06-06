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
        { label: "Go with the CEO's favorite",            desc: "Ship what the CEO liked in the kickoff deck.",                              effects: { trust: 1, morale: -1 },                consequence: "Team ships the CEO's gut. At least the roadmap review will be short." },
        { label: "Run a quick validation sprint",         desc: "Spend a week confirming what you probably already know.",                   effects: { scope: 1, morale: 2 },              consequence: "One week slower. The CEO doesn't love 'we did research.' They love 'research confirmed your instinct.'" },
        { label: "Pick the option with strongest signal", desc: "Use the research like it's actually there for something.",                  effects: { morale: 1, trust: 1 },                 consequence: "Fast and defensible. You'll get credit later when it works, not for the decision. For the outcome." },
        { label: "Scope a hybrid of all three",           desc: "Give everyone a little of what they want and none of what they need.",      effects: { scope: 2, morale: -2, quality: -1 }, consequence: "Congratulations. You built nobody's favorite product." },
      ],
    },
    {
      id: 'DISC-002', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "Three stakeholders have given you three completely different definitions of success; revenue, engagement and 'strategic positioning.' The executive alignment meeting is next week. You've been in the role for four months. What do you do?",
      choices: [
        { label: "Synthesize all three into one definition",   desc: "Create a definition vague enough that everyone nods.",                     effects: { scope: 1, trust: 1, morale: 1 }, consequence: "You made one definition that technically includes all three. Nobody is wrong. Nobody is aligned." },
        { label: "Schedule 1:1s with each before the meeting", desc: "Quietly align expectations before the public debate.",                     effects: { trust: 2, morale: 1 },             consequence: "You did the pre-work. The meeting runs 22 minutes. This is what good looks like." },
        { label: "Default to the CEO's view",                  desc: "'Ultimately we should align with leadership's vision.'",                   effects: { trust: 1, morale: -1 },            consequence: "Expedient. The other two stakeholders will remember." },
        { label: "Write a framing doc and circulate it",       desc: "Document the options and hope the argument happens in comments instead.",  effects: { quality: 1, trust: 1 },            consequence: "A written artifact. In 6 months this doc will either vindicate you or be used against you." },
      ],
    },
    {
      id: 'DISC-003', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "Your research consists of 5 user interviews and a survey with 40 responses. Three of the survey responses appear to be from the same person. Your lead engineer asks how much confidence the team should actually place in the findings. What do you do?",
      choices: [
        { label: "Run 10 more interviews",              desc: "Let's increase the sample size before we decide.",                    effects: { scope: -1, quality: 2 },            consequence: "It costs time. You find a behavior pattern that changes the entire approach. You say nothing about the timeline." },
        { label: "Proceed with what we have",           desc: "It's directional research.",                                         effects: { quality: -1, scope: 1 },            consequence: "Ship it and find out. This is technically a research strategy." },
        { label: "Run a 2-day research sprint",         desc: "Let's gather just enough evidence to feel confident.",                effects: { scope: -1, morale: 1, quality: 1 }, consequence: "Structured and fast. The designer stops asking questions. You consider this a win." },
        { label: "Outsource the research",              desc: "Let's get a consultant to tell us the same thing more confidently.",  effects: { scope: 1, trust: -1, quality: 1 },  consequence: "Budget questions were raised. The findings were the same as what you already had. No one says this." },
      ],
    },
    {
      id: 'DISC-004', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "A sales rep who's done 30 discovery calls tells you nobody wants to pay for the premium tier. Your research says otherwise. The sales rep is about to say this in the all-hands. What do you do?",
      choices: [
        { label: "Go back to users and validate",        desc: "Stop the train before it reaches the station.",                  effects: { scope: -1, quality: 2, trust: -1 }, consequence: "You pumped the brakes. It stings now. The alternative stings worse." },
        { label: "Trust the original research",          desc: "30 calls is anecdote. Your survey is data. Probably.",           effects: { quality: -1, scope: 1 },            consequence: "You stayed the course. The sales rep was right." },
        { label: "Adjust pricing model and move on",     desc: "Pivot fast enough that no one asks when you knew.",              effects: { trust: 1, scope: -1, quality: 1 },  consequence: "Micro-pivot. The new pricing has its own untested assumptions." },
        { label: "Flag the risk in Notion and continue", desc: "Cover your paper trail and keep the timeline.",                  effects: { trust: 1, quality: -1 },             consequence: "It's documented. When it comes up later, you will point to the document." },
      ],
    },
    {
      id: 'DISC-005', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "The CEO wants to invite three enterprise customers to a 'vision alignment session' before you finalize discovery outputs. The invites have already gone out, you can see from the calendar",
      choices: [
        { label: "Run it — customer insight is good", desc: "Customer conversations are research. Sort of.",                    effects: { morale: 1, quality: 1, scope: -1 }, consequence: "Actually useful. One customer says something that changes the entire product direction. The CEO is very pleased." },
        { label: "Redirect to structured interviews", desc: "Reframe the chaos as a methodology.",                             effects: { quality: 1, trust: -1 },              consequence: "You reframed it as user research. Nobody liked the reframe. The insights were better." },
        { label: "Let the CEO run it",                desc: "Hand over the mic and manage expectations afterward.",            effects: { trust: 1, morale: -2 },               consequence: "90 minutes of the CEO describing the product to customers while they nodded." },
        { label: "Combine it with the sprint review", desc: "Two birds, one deeply confused meeting.",                         effects: { scope: 1, quality: -1, morale: -1 }, consequence: "Two meetings became one. Neither goal was achieved." },
      ],
    },
    {
      id: 'DISC-006', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "You interview five users. Each one describes a completely different problem.",
      choices: [
        { label: "Build features for all of them",          desc: "Give everyone a feature and hope it adds up to a product.",      effects: { scope: 2, quality: 1 },   consequence: "The roadmap is five features wide and one feature deep. Each user gets one thing they wanted. None of them get what they needed." },
        { label: "Focus on the most common problem",        desc: "Find the thread and pull it.",                                   effects: { quality: 2, scope: -1 },  consequence: "You solved the thing most people mentioned. The four outliers were hiding a problem nobody mentioned yet." },
        { label: "Ignore interviews and trust the vision",  desc: "The research was directional. Direction: forward.",              effects: { trust: 1, quality: -1 },    consequence: "Comfortable. The interviews are still in a folder labeled 'Research — DO NOT DELETE.'" },
      ],
    },
    {
      id: 'DISC-007', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "The CEO explains the product idea using a whiteboard, three arrows, and the phrase 'platform strategy.'",
      choices: [
        { label: "Build exactly what they described",  desc: "The whiteboard is the PRD.",                                        effects: { scope: -1, trust: -1 },    consequence: "You built the whiteboard. The three arrows are now three features. 'Platform strategy' appears in the brief." },
        { label: "Ask users first",                    desc: "Slow down. Ground the vision in something real.",                   effects: { quality: 1,scope: 1, trust: 1 },  consequence: "Slow but grounded. Users confirmed the CEO's instinct and added nuance. This is the job." },
        { label: "Suggest starting smaller",           desc: "Propose a focused version before going broad.",                     effects: { scope: 1, trust: 1, morale: 2 },  consequence: "The CEO did not enjoy this suggestion. You are no longer invited to whiteboard sessions." },
      ],
    },
  ],

  1: [ // Strategy
  {
    id: 'STRAT-011',
    epic: 'STRATEGY',
    epicColor: 'bg-blue-100 text-blue-700',
    scenario: "A competitor launches a feature you hadn't planned. It's getting press. TechCrunch calls it 'a bold move that could reshape the category.' Your CEO forwards you the article with the subject line: 'Thoughts?' What do you do?",
    choices: [
      { label: "Pretend it was always part of the plan",   desc: "Great validation of the direction we've been thinking about.",        effects: { trust: 1, morale: 1, quality: -1, scope: -1 }, consequence: "You claimed alignment with a competitor's roadmap. Two people in the meeting nodded. The rest Googled the competitor." },
      { label: "Reply with a clear-headed tradeoff",       desc: "Explain why copying competitors is not always the strategy.",         effects: { morale: 1, trust: 1, scope: -1 }, consequence: "You held the line. The CEO forwarded your reply to the board. That's new." },
      { label: "Add it and cut something else",            desc: "Reprioritize the roadmap and hope nobody asks what got removed.",     effects: { morale: -1, quality: -1, scope: -1 }, consequence: "The team hates undoing planned work. The churn shows in the code." },
      { label: "Commit it to V2 with a written rationale", desc: "Draft a thoughtful explanation of why it belongs in the next phase.", effects: { trust: 1, morale: 1, scope: 1 }, consequence: "You gave the CEO something to say to the board. This is a skill." },
    ],
  },
  {
    id: 'STRAT-012',
    epic: 'STRATEGY',
    epicColor: 'bg-blue-100 text-blue-700',
    scenario: "Your engineering lead pulls you aside. Scope has grown 30% since kickoff. No one formally approved any of it. You added most of it. Engineering would like to discuss the concept of 'scope control.' What do you do?",
    choices: [
      { label: "Acknowledge it and cut back",             desc: "Trim the roadmap and quietly pretend it was the plan all along.",   effects: { scope: -1, morale: 1, quality: 1, trust: 1 }, consequence: "Painful but honest. You own the problem. The team respects the reset." },
      { label: "Keep it -- it's all valuable",            desc: "Explain that each addition was 'strategically important.'",         effects: { scope: 2, morale: -1 }, consequence: "You said yes to everything. Everything is now late. You will use the word 'learnings.'" },
      { label: "Document it and make it official",        desc: "Update the roadmap and call it a revised strategy.",                effects: { trust: 1, scope: 1 }, consequence: "Stakeholders receive this as 'good communication.' It is not good communication." },
      { label: "Blame the stakeholders who requested it", desc: "'I'm just representing business needs.'",                          effects: { morale: -2, trust: -1, scope: -1 }, consequence: "Technically accurate. Politically ruinous. The energy in the room shifted." },
    ],
  },
  {
    id: 'STRAT-013',
    epic: 'STRATEGY',
    epicColor: 'bg-blue-100 text-blue-700',
    scenario: "It's been two weeks and the team still can't agree on a north star metric. Marketing wants MAU. Product wants activation rate. Engineering wants uptime. The disagreement has been named 'the metric standoff' in the team Slack. What do you do?",
    choices: [
      { label: "Call a meeting and decide together",    desc: "Solve it democratically. Slowly.",                   effects: { morale: 1, trust: 1, scope: 1 }, consequence: "Inclusive. Everyone's bought in. You lost a week getting there." },
      { label: "Pick activation rate",                  desc: "Choose the metric that actually measures value.",    effects: { quality: 1, morale: 1, scope: -1 }, consequence: "The correct answer. You will spend six months explaining why to Marketing." },
      { label: "Let each team track their own metric",  desc: "Three dashboards. Three realities. One product.",   effects: { scope: -1, quality: -1 }, consequence: "You avoided conflict. You created three different realities." },
      { label: "Escalate to the CEO to decide",         desc: "Let someone else own the decision and the fallout.", effects: { trust: -1, scope: -1 }, consequence: "You passed the buck. It worked. Everyone noticed." },
    ],
  },
  {
    id: 'STRAT-014',
    epic: 'STRATEGY',
    epicColor: 'bg-blue-100 text-blue-700',
    scenario: "Two engineers inform you that a core feature isn't feasible in the timeline. This is week 4. They've known since week 2. Their explanation for the delay: 'we were hoping to find a workaround.' What do you do?",
    choices: [
      { label: "Reset the timeline",                desc: "Absorb the hit now before it becomes a crater.",           effects: { scope: 2, trust: -1, morale: 1 }, consequence: "Expensive. Honest. The team is relieved you didn't try to force it." },
      { label: "Find a workaround together",        desc: "Get in the weeds and ship something that works.",         effects: { tech: 1, morale: 1, scope: -1 }, consequence: "You rolled up your sleeves. The solution isn't elegant but it ships." },
      { label: "Cut the feature from MVP",          desc: "Ship less. Ship it clean.",                               effects: { scope: -1, quality: 1, morale: 1 }, consequence: "Clean call. Stakeholders are disappointed. The team is not." },
      { label: "Ask why this wasn't raised sooner", desc: "A fair question at entirely the wrong moment.",           effects: { morale: -2, trust: -1 }, consequence: "Fair question. Terrible timing. The answer was 'we were scared to tell you.'" },
    ],
  },
  {
    id: 'STRAT-015',
    epic: 'STRATEGY',
    epicColor: 'bg-blue-100 text-blue-700',
    scenario: "It's Q3 planning. Your OKRs are due in 48 hours. Your roadmap is 60% speculative. A VP has just added three new 'strategic initiatives' to your team's scope. No one agrees what the priorities are. What do you do?",
    choices: [
      { label: "Push back on the initiatives",                  desc: "Explain that the team cannot realistically absorb more scope.", effects: { trust: -1, morale: 1, scope: -1 }, consequence: "Necessary. Uncomfortable. The VP will find another angle." },
      { label: "Accept them and adjust the OKRs",               desc: "Rewrite the roadmap and hope the math works out later.",       effects: { scope: 2, morale: -1 }, consequence: "The OKRs are now aspirational. The team knows it. So do you." },
      { label: "Ask the VP to prioritize them",                 desc: "Politely request clarity on what actually matters.",           effects: { trust: 1, scope: 1 }, consequence: "Smart move. Slower. The VP schedules a follow-up. The follow-up is not useful." },
      { label: "Submit vague OKRs that accommodate everything", desc: "'Improve platform outcomes through strategic initiatives.'",   effects: { morale: -1, quality: -1, scope: -1 }, consequence: "On time. Unmeasurable. This may be the point." },
    ],
  },
  {
    id: 'STRAT-016',
    epic: 'STRATEGY',
    epicColor: 'bg-blue-100 text-blue-700',
    scenario: "You present the roadmap. A stakeholder asks why their feature isn't on it.",
    choices: [
      { label: "Add their feature",                desc: "Find room on the roadmap and put it there.",                  effects: { scope: 1, trust: 1 }, consequence: "The feature is added. The stakeholder is satisfied. Someone else's feature was moved to make room. Nobody told them yet." },
      { label: "Explain the prioritization",       desc: "Walk through the framework. Be transparent.",                 effects: { quality: 1, trust: -1, scope: -1 }, consequence: "Logical. Transparent. The stakeholder nods. The feature is still not on the roadmap. The stakeholder has not forgotten." },
      { label: "Say it's coming in a later phase", desc: "'It's on our radar — definitely in a later phase.'",          effects: { trust: 1, morale: -1, scope: 1 }, consequence: "'Later phase' understood. Later phase always understood. Later phase never arrives." },
    ],
  },
],
  2: [ // Design
  {
    id: 'DES-017',
    epic: 'DESIGN',
    epicColor: 'bg-pink-100 text-pink-700',
    scenario: "Design has created a sleek new dashboard. It looks amazing. It also hides half the information your power users care about in menus labeled with tasteful ambiguity. What do you do?",
    choices: [
      {
        label: "Prioritize clarity over visual purity",
        desc: "A dashboard is not a perfume ad.",
        effects: { quality: 2, trust: 1, scope: 1 },
        consequence: "The design loses some of its minimalist mystique and gains the radical ability to be useful."
      },
      {
        label: "Ship the clean version and train users",
        desc: "If they cannot find it, perhaps they did not deserve it.",
        effects: { scope: -1, quality: -2, trust: -1 },
        consequence: "The dashboard wins internal applause and external confusion in roughly equal measure."
      },
      {
        label: "Create a compromise with progressive disclosure",
        desc: "Keep the surface clean, but let serious users dig deeper.",
        effects: { quality: 1, trust: 2, tech: 1, scope: 1 },
        consequence: "The product stays polished without treating advanced users like a regrettable edge case."
      },
      {
        label: "Ask design to complete real tasks using the mockup",
        desc: "A gentle invitation to suffer like the customer.",
        effects: { trust: 1, morale: 1, quality: 1, scope: 1 },
        consequence: "Several elegant choices become less elegant once someone has to actually use them."
      },
    ],
  },
  {
    id: 'DES-018',
    epic: 'DESIGN',
    epicColor: 'bg-pink-100 text-pink-700',
    scenario: "Design presents a beautiful new flow with seven screens, three modal states, and one animation someone called 'essential to trust.' Engineering stares at it like it just asked for a kidney. What do you do?",
    choices: [
      {
        label: "Cut the flourishes and keep the core flow",
        desc: "Preserve the value. Sacrifice the interpretive dance.",
        effects: { scope: -1, trust: 1, quality: 1 },
        consequence: "The experience gets simpler, the build gets saner, and the animation is quietly escorted out of the building."
      },
      {
        label: "Approve the full design vision",
        desc: "Commit to the deluxe edition of the feature.",
        effects: { quality: 2, scope: 2, morale: -1 },
        consequence: "The product may one day be gorgeous. This sprint, however, develops new enemies."
      },
      {
        label: "Build the basic version now, polish later",
        desc: "Launch the skeleton. Add the cheekbones in a future sprint.",
        effects: { scope: -1, tech: 1, quality: -1 },
        consequence: "You preserve momentum, though the final product temporarily has the charisma of a tax portal."
      },
      {
        label: "Ask design to rank what actually matters most",
        desc: "Turn taste into tradeoffs.",
        effects: { trust: 2, scope: -1 },
        consequence: "Once forced to prioritize, even design admits not every pixel was sent from heaven."
      },
    ],
  },
  {
    id: 'DES-019',
    epic: 'DESIGN',
    epicColor: 'bg-pink-100 text-pink-700',
    scenario: "User testing reveals something impressive. All five testers failed the same task. Not one of them even got close. One tester tried clicking the company logo for help. Another tried refreshing the page three times. Your designer already knows and is staring at you in silence. A full redesign would take two extra weeks. What do you do?",
    choices: [
      { label: "Redesign now",                          desc: "Fix it properly while you still can.",                        effects: { scope: 2, morale: 1, quality: 2 }, consequence: "Slower. Better. The designer gives you a subtle nod in standup." },
      { label: "Ship it and iterate post-launch",       desc: "Let users discover the problem for you.",                    effects: { scope: -1, morale: -1, quality: -1 }, consequence: "The team knows it's broken. Users will, too. The App Store reviews will be instructive." },
      { label: "Quick fix that partially addresses it", desc: "Make it less bad. Ship it. Repeat.",                         effects: { scope: -1, quality: 1 }, consequence: "It's better. Not fixed. You'll be back here in six weeks." },
      { label: "Dismiss the finding",                   desc: "One data point. Probably an outlier. Almost certainly not.", effects: { scope: -1, morale: -2, quality: -2, trust: -1 }, consequence: "'One tester's opinion.' The finding shows up in your App Store reviews three weeks later." },
    ],
  },
  {
    id: 'DES-020',
    epic: 'DESIGN',
    epicColor: 'bg-pink-100 text-pink-700',
    scenario: "Brand wants the design to be bold. UX says bold is unusable. They've been in a standoff for 11 days, which is now being referred to in standup as a 'creative tension period.' No actual design work has happened during this time. What do you do?",
    choices: [
      { label: "Side with UX -- usability first",          desc: "Remind everyone that users still need to find the buttons.", effects: { quality: 2, morale: 1, scope: -1 }, consequence: "Users will thank you. Brand sends a passive-aggressive Slack message." },
      { label: "Side with Brand -- it needs to stand out", desc: "'Boldness is part of the experience.'",                     effects: { quality: -1, trust: 1, scope: -1 }, consequence: "It looks great. Users will figure it out eventually." },
      { label: "Commission a usability test to settle it", desc: "Introduce data into the argument and watch both sides reinterpret it.", effects: { scope: 1, quality: 1, morale: 1 }, consequence: "Data-driven. Decisive. The 'creative tension period' ends." },
      { label: "Try a compromise design",                  desc: "Produce something that disappoints everyone equally.",      effects: { quality: -1, morale: -1, scope: 1 }, consequence: "Nobody loves it. Compromise isn't always the answer. Today it really isn't." },
    ],
  },
  {
    id: 'DES-021',
    epic: 'DESIGN',
    epicColor: 'bg-pink-100 text-pink-700',
    scenario: "An accessibility audit comes back with 12 issues. Your designer reads the report, sighs audibly on the call, and says 'I flagged most of these in the design review.' Fixing all of them takes 3 weeks. What do you do?",
    choices: [
      { label: "Fix all 12 -- ship it right",      desc: "Do the thing everyone should do and almost nobody does.", effects: { scope: 2, quality: 2, morale: 1 }, consequence: "The right call. It cost time. You can stand behind everything that shipped." },
      { label: "Fix the critical 4, log the rest", desc: "Triage and document. The 8 will come back.",              effects: { scope: 1, quality: 1 }, consequence: "Reasonable triage. The 8 you logged will come back. Budget for it." },
      { label: "Ship and fix in the next sprint",  desc: "Make a promise you might not keep.",                      effects: { scope: -1, quality: -1, trust: -1 }, consequence: "You know this is a promise you may not keep. So does the team." },
      { label: "Deprioritize -- not in the OKRs",  desc: "It didn't make the list. Neither will your credibility.", effects: { scope: -1, quality: -2, morale: -2 }, consequence: "The team knows this is wrong. So do you. So do the users who need it." },
    ],
  },
  {
    id: 'DES-022',
    epic: 'DESIGN',
    epicColor: 'bg-pink-100 text-pink-700',
    scenario: "Your designer wants to prototype three interaction models before committing. Engineering says they have time for one. Your designer has already started on all three. What do you do?",
    choices: [
      { label: "Let the designer prototype all three",    desc: "Give them the runway. Get the right answer.",   effects: { scope: 2, quality: 2 }, consequence: "Time well spent. The decision is right. The designer owns it completely." },
      { label: "Have engineering build the first option", desc: "Skip validation. Ship fast. Regret later.",    effects: { scope: -1, quality: -1, morale: -1 }, consequence: "Fast. The designer never fully believed in it. The reviews will show it." },
      { label: "Prototype on paper -- no code yet",       desc: "Low cost, high information.",                   effects: { scope: 1, morale: 1, quality: 1 }, consequence: "Low-fi, high-signal. Everyone finds something useful. The designer calls it 'directional.'" },
      { label: "Put it to a team vote",                   desc: "Democracy and good UX are not the same thing.", effects: { scope: -1, morale: 1, quality: -1 }, consequence: "Democratized. The most popular option and the best UX were not the same option." },
    ],
  },
  {
    id: 'DES-023',
    epic: 'DESIGN',
    epicColor: 'bg-pink-100 text-pink-700',
    scenario: "Your lead designer wants to throw out the entire component library and start fresh. Engineering looks like you just suggested deleting the production database. The library is two years old and genuinely painful to work with. Half the components are slightly different versions of the same button. What do you do?",
    choices: [
      { label: "Allow the full rebuild",                desc: "Declare design bankruptcy and start over.",                 effects: { scope: 2, tech: 2, quality: 1 }, consequence: "Expensive. The right call. In six months the team will forget there was ever a choice." },
      { label: "Decline, patch the existing library",   desc: "'We'll improve it incrementally.'",                         effects: { scope: -1, tech: -1, morale: -1 }, consequence: "You bought time. The patches accumulate. The designer starts updating their portfolio." },
      { label: "Refactor only the critical components", desc: "Fix the parts that hurt the most.",                         effects: { scope: 1, tech: 1, morale: 1 }, consequence: "Pragmatic. Not exciting. The team accepts it and moves." },
      { label: "Bring in a contractor to assess",       desc: "Ask an outsider to tell everyone what they already know.", effects: { tech: 1, trust: 1, scope: 1 }, consequence: "Outside perspective. The assessment says rebuild. You now have the permission structure to do it." },
    ],
  },
  {
    id: 'DES-041',
    epic: 'DESIGN',
    epicColor: 'bg-pink-100 text-pink-700',
    scenario: "A designer says the current layout feels 'emotionally cramped.' Engineering asks whether emotions are now a required breakpoint. The meeting is not going well. What do you do?",
    choices: [
      {
        label: "Translate the feedback into specific UX issues",
        desc: "Turn vibes into something testable.",
        effects: { trust: 2, quality: 1 },
        consequence: "The conversation improves the second everyone is forced to use nouns instead of feelings."
      },
      {
        label: "Side with design and redo the layout",
        desc: "Honor the emotional geometry.",
        effects: { quality: 1, scope: -1, morale: -1 },
        consequence: "The design gets cleaner, but the team loses a chunk of time to a problem nobody could originally define."
      },
      {
        label: "Side with engineering and keep it moving",
        desc: "If users can still click the button, call it resolved.",
        effects: { scope: 2, trust: -1, quality: -1 },
        consequence: "Progress continues, and design begins documenting your future mistakes with unusual precision."
      },
      {
        label: "Put the design in front of users before changing it",
        desc: "Let actual humans settle the argument.",
        effects: { quality: 2, trust: 1, scope: -1 },
        consequence: "User feedback reveals the truth, which is more useful and less flattering than either side expected."
      }
    ],
  },
],
  3: [ // Development
  {
    id: 'DEV-024', epic: 'DEVELOPMENT', epicColor: 'bg-blue-100 text-blue-700',
    scenario: "Mid-sprint, a stakeholder drops in with 'one tiny change' that touches the API, UI, copy, analytics, and your remaining will to live. What do you do?",
    choices: [
      { label: "Add it to this sprint",               desc: "Let the phrase 'tiny change' continue ruining lives across the industry.", effects: { scope: 2, morale: -2, trust: -1 },  consequence: "The sprint expands like a gas leak. Nobody can agree later on what the original goal even was." },
      { label: "Push it to next sprint",              desc: "Protect focus with the sacred power of 'not now.'",                     effects: { scope: -1, trust: 1, morale: 1 },   consequence: "The sprint survives intact. The stakeholder acts disappointed in the ceremonial way." },
      { label: "Trade it for something of equal size",desc: "Scope enters, scope leaves. Nature heals.",                            effects: { scope: -1, trust: 2, quality: 1 },  consequence: "People complain less once the cost becomes visible and attached to a different ticket." },
      { label: "Ask for a written rationale and impact", desc: "A powerful filter against casual chaos.",                           effects: { trust: 1, morale: 1, scope: -1 },   consequence: "The request suddenly becomes either much smaller or much less urgent. Remarkable." },
    ],
  },
  {
    id: 'DEV-025', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
    scenario: "Your tech lead wants to refactor the authentication layer before the next feature. It wasn't on the roadmap. Engineering is describing it as 'critical.' No one can agree whether 'critical' means security risk or the code is ugly. What do you do?",
    choices: [
      { label: "Allow it, trust the engineer's judgment", desc: "'Okay. If it's critical, let's fix it.'",                     effects: { tech: 2, morale: 1, scope: 1 },      consequence: "The codebase is measurably better. The tech lead says 'thank you' for the first time in months." },
      { label: "Decline and scope it for next quarter",   desc: "Add it to the 'future improvements' section of the roadmap.", effects: { scope: -1, tech: -1, morale: -1 },  consequence: "You held the line. The debt just got a week bigger." },
      { label: "Allow a 3-day timebox",                   desc: "Give engineering a small window and hope that's enough.",     effects: { tech: 1, morale: 1, scope: 1 },      consequence: "A reasonable middle. The team gets something done. The problem is not fully fixed but everyone is honest about that." },
      { label: "Reframe it as a feature request",         desc: "'Security improvements' sounds roadmap-friendly.",            effects: { trust: -1, tech: -1, scope: -1 },    consequence: "You made a refactor look like scope creep. The tech lead now Googles your name and 'reviews.'" },
    ],
  },
  {
    id: 'DEV-026', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
    scenario: "Your team has been blocked on a platform API for 2 weeks. The platform team now says 3 more. Their lead has been 'in meetings' every time you try to reach them. What do you do?",
    choices: [
      { label: "Escalate through management",            desc: "Go above their head. Make it formal.",                       effects: { trust: -1, scope: 1, morale: -1 },   consequence: "It works. The platform lead responds within the hour. You now have an enemy on the 4th floor." },
      { label: "Build a temporary workaround",           desc: "Ship around the blocker. The workaround becomes permanent.", effects: { tech: -1, scope: -1, morale: 1 },   consequence: "Pragmatic. The workaround will outlive your employment at this company." },
      { label: "Reorder the sprint -- build around it",  desc: "Sequence your way out of someone else's delay.",            effects: { morale: 1, scope: -1 },              consequence: "Flexible. The reorder delays some things but keeps the team moving. This is the job." },
      { label: "Document it and formally flag the risk", desc: "Make the delay officially Not Your Problem.",                effects: { trust: 1, scope: -1 },               consequence: "Clean. Transparent. The delay is now officially documented as Not Your Problem." },
    ],
  },
  {
    id: 'DEV-027', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
    scenario: "Three engineers have each filed a separate Jira ticket flagging a different 'critical' infrastructure issue. None of them have spoken to each other about it. All three want it prioritized before the next sprint. What do you do?",
    choices: [
      { label: "Address all three in sequence",        desc: "Fix everything. Ship nothing on time.",                       effects: { tech: 3, scope: 3, morale: 1 },      consequence: "The codebase is pristine. The roadmap is a memory. The team is weirdly happy." },
      { label: "Triage with the team -- pick one",     desc: "Make a call together. Log the other two.",                   effects: { tech: 1, morale: 1, scope: 1 },      consequence: "Good process. One concern was real. Two were vibes. Nobody says this." },
      { label: "Push all three to post-launch",        desc: "Ship now. Pay later. With interest.",                        effects: { tech: -2, scope: -1, morale: -1 },   consequence: "You shipped faster. The three engineers now have a group chat you're not in." },
      { label: "Bring in a senior engineer to assess", desc: "Get outside credibility to end the internal debate.",        effects: { tech: 1, trust: 1, scope: 1 },       consequence: "External credibility defuses the debate. One concern was real. Two were vibes. This time you get to say it." },
    ],
  },
  {
    id: 'DEV-028', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
    scenario: "Nobody on the team writes documentation. Engineering says it's product's job. Product says it's engineering's job. Everyone agrees it's important. The codebase currently has zero documentation. Launch is in 8 weeks. What do you do?",
    choices: [
      { label: "Mandate docs in the sprint process",  desc: "Add 'documentation' to the definition of done.",              effects: { tech: 1, morale: -1, scope: 1 },     consequence: "Principled. The documentation that gets written is just good enough to comply." },
      { label: "Hire a technical writer",             desc: "Bring in someone whose entire job is explaining the system.",  effects: { trust: 1, tech: 1, scope: 1 },       consequence: "Smart. Expensive. The technical writer becomes the most popular person on the team." },
      { label: "Let it go until post-launch",         desc: "'That's a future-us problem.'",                               effects: { tech: -2, morale: 1, scope: -1 },    consequence: "You chose velocity. The next engineer who joins will handle the consequences." },
      { label: "Make documentation a launch blocker", desc: "Announce that nothing ships without docs.",                   effects: { tech: 2, morale: -2, scope: 2 },     consequence: "Nuclear option. The team delivers. They are tired and very vocal about it." },
    ],
  },
  {
    id: 'DEV-029', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
    scenario: "Leadership asks for one last feature before launch. They promise it's the final request.",
    choices: [
      { label: "Add it",                   desc: "Say yes. It's probably fine.",                          effects: { scope: 1, trust: 1 },      consequence: "The feature is added. This was not the final request." },
      { label: "Decline",                  desc: "Hold the scope. Protect the timeline.",                 effects: { scope: -1, trust: -1 },    consequence: "You held the line. Leadership's definition of 'final' is being revised as we speak." },
      { label: "Add a simplified version", desc: "Negotiate down to something shippable.",                effects: { scope: 1, quality: 1 },    consequence: "You found the middle. Leadership is satisfied. The simplified version will become the full version in the next sprint." },
    ],
  },
  {
    id: 'DEV-030', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
   scenario: "Halfway through the sprint, engineering reveals the feature is 'mostly done,' which in local dialect means the backend exists, the frontend is theoretical, and nothing has met another system yet. What do you do?",
choices: [
  {
    label: "Cut scope and finish the core flow",
    desc: "Ship one thing that works instead of four things that gesture vaguely at working.",
    effects: { roadmap: 1, quality: 1, trust: 1 },
    consequence: "The feature gets smaller, more coherent, and much less likely to humiliate you in demo."
  },
  {
    label: "Push the team to finish everything",
    desc: "Reject reality and request a more motivational version of it.",
    effects: { roadmap: 2, morale: -2, quality: -1 },
    consequence: "People work later, resent harder, and produce a version of done that requires spiritual generosity."
  },
  {
    label: "Move the unfinished work to next sprint",
    desc: "Call it sequencing, not slipping.",
    effects: { roadmap: -1, tech: 1, morale: 1 },
    consequence: "The sprint goal survives, though several Jira tickets now carry the sadness of reincarnation."
  },
  {
    label: "Ask for a live walkthrough of what actually works",
    desc: "Replace status updates with the radical act of looking.",
    effects: { trust: 2, quality: 1 },
    consequence: "Three assumptions die on the spot. This is still more efficient than finding out at the demo."
  }
]
  },
  {
    id: 'DEV-031', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
    scenario: "The team spends 45 minutes in a meeting debating the color of a button.",
    choices: [
      { label: "Let design decide",          desc: "It's a design decision. Let design decide.",         effects: { quality: 1 },              consequence: "Design decides. The button is a slightly different shade of blue. Nobody notices. Design notices." },
      { label: "End the debate and move on", desc: "Call time. Ship the existing color.",                effects: { morale: 1, quality: -1 },  consequence: "The debate ends. The color stays. Someone will bring this up in retro." },
      { label: "Escalate the decision",      desc: "Make it someone else's 45 minutes.",                 effects: { trust: 1, morale: -1 },    consequence: "Leadership picks a color. The team now has a documented process for button colors." },
    ],
  },
  {
    id: 'DEV-039', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
    scenario: "Engineering says the feature will take two more weeks. Engineering also said the last feature would take two weeks.",
    choices: [
      { label: "Trust the estimate",          desc: "Two weeks is two weeks.",                           effects: { scope: 1, tech: 1 },       consequence: "The feature takes two more weeks. This is what two weeks means here." },
      { label: "Ask for a simpler version",   desc: "Reduce scope until the estimate shrinks.",         effects: { scope: -1, quality: -1 },  consequence: "Simpler is defined in the meeting. The simpler version also takes two weeks." },
      { label: "Ask what happened last time", desc: "Raise the pattern politely.",                      effects: { morale: 1, trust: -1 },    consequence: "Last time was also two weeks. The story of last time takes fifteen minutes to tell." },
    ],
  },
  {
    id: 'DEV-032', epic: 'DEVELOPMENT', epicColor: 'bg-blue-100 text-blue-700',
    scenario: "By day six, velocity has collapsed. Standups are full of phrases like 'still looking into it' and 'almost there,' which are technically updates in the same way fog is technically weather. What do you do?",
    choices: [
      { label: "Break work into smaller deliverables today", desc: "Reduce ambiguity until progress has fewer places to hide.", effects: { scope: 1, trust: 1, quality: 1 },   consequence: "The sprint regains shape once tasks stop pretending to be manageable while secretly containing continents." },
      { label: "Push for longer hours to catch up",          desc: "Convert bad planning into human fatigue.",                  effects: { scope: -1, morale: -2, quality: -1 }, consequence: "Output rises briefly, then starts shedding judgment at an alarming rate." },
      { label: "Drop lower-priority tickets now",            desc: "Admit reality before reality schedules the meeting for you.", effects: { scope: -1, morale: 1, trust: 1 }, consequence: "The sprint goal becomes narrower and suddenly much more achievable, which annoys only the people addicted to fantasy." },
      { label: "Ask each engineer to show what changed since yesterday", desc: "Replace progress poetry with receipts.",       effects: { trust: 2, morale: -1, quality: 1 },  consequence: "The mood darkens, but clarity arrives wearing steel-toed boots." },
    ],
  },
  {
    id: 'DEV-042', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
    scenario: "The team spends 45 minutes in a meeting debating the color of a button.",
    choices: [
      { label: "Let design decide",          desc: "It's a design decision. Let design decide.",         effects: { quality: 1 },              consequence: "Design decides. The button is a slightly different shade of blue. Nobody notices. Design notices." },
      { label: "End the debate and move on", desc: "Call time. Ship the existing color.",                effects: { morale: 1, quality: -1 },  consequence: "The debate ends. The color stays. Someone will bring this up in retro." },
      { label: "Escalate the decision",      desc: "Make it someone else's 45 minutes.",                 effects: { trust: 1, morale: -1 },    consequence: "Leadership picks a color. The team now has a documented process for button colors." },
    ],
  },
],
  4: [ // Testing
  {
    id: 'TEST-033', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
    scenario: "QA files a P0 bug ticket two days before launch. It affects 20% of users but has a workaround. Your lead dev's Slack status is currently a red circle. What do you do?",
    choices: [
      { label: "Delay launch to fix it",            desc: "Do it right. Deliver the news.",                           effects: { scope: 1, morale: 1, quality: 1 },   consequence: "The right call. Painful and clean. Stakeholders grumble. Users never know." },
      { label: "Launch and hotfix within 24 hours", desc: "Ship now. Cross fingers. Monitor obsessively.",            effects: { scope: -1, morale: -1, trust: -1 }, consequence: "You'll probably be fine. 'Probably' is doing a lot of work in that sentence." },
      { label: "Remove the affected feature",       desc: "Cut the broken thing. Ship the working thing.",            effects: { scope: -1, quality: 1 },             consequence: "Nothing ships broken. Users get less, but what ships works." },
      { label: "Ship it",                           desc: "What's the worst that could happen. (Don't answer that.)", effects: { scope: -1, morale: -3, trust: -2, quality: -2 }, consequence: "Nobody said a word in the meeting. Slack was a different story." },
    ],
  },
  {
    id: 'TEST-034', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
    scenario: "User acceptance testing submitted 200 pieces of feedback. Some reports are typos. Some suggest rebuilding the entire product. One user asked if the product could 'be more like Excel.' What do you do?",
    choices: [
      { label: "Tag and categorize everything",             desc: "Create a very organized backlog of chaos.",          effects: { quality: 1, scope: 1, morale: -1 }, consequence: "Thorough. The team is exhausted from tagging. The taxonomy is actually useful." },
      { label: "Find the top 10 by frequency and fix them", desc: "Focus on the problems that appear most often.",      effects: { quality: 1, scope: 1 },             consequence: "Focused. Some important things got missed. Most important things got fixed." },
      { label: "Hand it to the team to self-organize",      desc: "Let engineering and design figure out what matters.", effects: { morale: 1, quality: -1, scope: -1 }, consequence: "Empowering. Inconsistent. A few gems got buried. Nobody admits this." },
      { label: "Present all 200 items to stakeholders",     desc: "Share the full list and ask for guidance.",          effects: { trust: -1, morale: -2, scope: -1 }, consequence: "This was not the meeting anyone wanted to be in." },
    ],
  },
  {
    id: 'TEST-035', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
    scenario: "Load testing shows the app starts degrading at 500 concurrent users. Marketing is expecting 2,000 users at launch. Engineering estimates two weeks to properly fix the issue. Launch is... sooner than that. What do you do?",
    choices: [
      { label: "Delay launch until it's resolved",       desc: "Explain that reliability is part of the product.",      effects: { scope: 1, quality: 2, trust: -1 }, consequence: "The right call. The CEO is unhappy. Users will never know this conversation happened." },
      { label: "Launch with soft rate limiting",         desc: "Quietly throttle traffic and hope nobody notices.",      effects: { scope: -1, tech: -1, quality: -1, trust: 1 }, consequence: "You controlled the risk and capped your own launch. Twitter interprets this as mystery." },
      { label: "Invest in performance optimization now", desc: "Pause feature work and focus on stability.",            effects: { tech: 2, scope: 2, morale: 1 }, consequence: "Full commitment. Expensive. The engineers will tell this story for years." },
      { label: "Launch to a waitlist to control load",   desc: "Turn the problem into an 'exclusive rollout.'",         effects: { trust: 1, quality: 1, scope: -1 }, consequence: "Users perceive exclusivity. Engineers get breathing room. Someone writes a newsletter about your 'launch strategy.'" },
    ],
  },
  {
    id: 'TEST-036', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
    scenario: "QA says the product is being held together by hope, browser cache, and Ethan, one of the engineers. You know that Ethan will be out the same week it's launched.",
    choices: [
      { label: "Push the release date by a week",          desc: "Give the bugs more time to introduce themselves.",       effects: { scope: 1, quality: 2, tech: 1 }, consequence: "The team groans, then gets weirdly productive. QA finds several issues nobody wanted to know about. Ethan fixes them while on vacation." },
      { label: "Launch anyway",                            desc: "Let production answer the questions nobody else can.",    effects: { scope: -1, quality: -1, tech: -1, morale: -1 }, consequence: "Production does answer the questions. Loudly. At 11:43 p.m." },
      { label: "Strip out the risky bits and ship the rest", desc: "A classic move for anyone who enjoys survival.",      effects: { scope: -1, quality: 1 }, consequence: "The release becomes smaller, uglier, and much less likely to ruin your weekend." },
      { label: "Ask who is covering for Ethan",           desc: "Nothing clarifies launch risk like naming the backup plan.", effects: { trust: 1, tech: 1, scope: -1 },                     consequence: "The room gets quieter once everyone realizes the backup plan was more of a spiritual concept." },
    ],
  },
  {
    id: 'TEST-037', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
    scenario: "QA approves the release saying that the feature works perfectly in staging, which would be reassuring if staging had resembled production at any point this year. What do you do?",
    choices: [
      { label: "Block launch until staging is fixed",      desc: "Stop pretending the dollhouse is the real house.",        effects: { scope: 2, tech: 2, quality: 1 }, consequence: "You lose time, but gain the radical luxury of testing in an environment that means something." },
      { label: "Ship anyway and monitor prod",             desc: "Let reality handle the final QA pass.",                    effects: { scope: -1, quality: -2, morale: -1 }, consequence: "Reality accepts the assignment and begins filing bugs immediately." },
      { label: "Manually test only the riskiest flows",    desc: "Check the parts most likely to ruin everyone's evening.", effects: { quality: 1, scope: -1, trust: 1 }, consequence: "You skip the fantasy of full coverage and focus on the places most likely to catch fire." },
      { label: "Ask engineering how staging drift got this bad", desc: "Turn discomfort into a process conversation.",     effects: { tech: 1, trust: 1, morale: -1, scope: 1 }, consequence: "Nobody enjoys the discussion, which is how you know it was overdue." },
    ],
  },
  {
    id: 'TEST-038', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
    scenario: "The internal demo fails. You're supposed to demo this in an hour to the c-suites. What do you do?",
    choices: [
      { label: "Delay the demo",             desc: "Buy time. Find the real problem.",                         effects: { trust: -1 }, consequence: "The demo is rescheduled. The root cause is a setting nobody can account for. Nobody admits touching it." },
      { label: "Proceed confidently anyway", desc: "Confidence is half the demo.",                            effects: { trust: 1, tech: -1 }, consequence: "The confidence is convincing right up until it isn't. The stakeholders remember this." },
      { label: "Blame WiFi",                 desc: "It's out of your hands.", effects: { morale: 1 }, consequence: "The Stakeholders keep pinging you saying their wifi connection is working great." },
    ],
  },
  {
    id: 'TEST-39', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
    scenario: "The staging environment has been down twice, two bugs are marked 'probably fine,' and someone just said 'we can validate in prod' without irony. Release day is approaching like a tax audit. What do you do?",
    choices: [
      { label: "Push the release a week", desc: "Choose shame now over chaos later.", effects: { scope: -2, quality: 2, tech: 1 }, consequence: "The team groans, then gets weirdly productive. Several fake-green tests are exposed and dealt with." },
      { label: "Launch anyway", desc: "Let production answer the questions nobody else can.", effects: { scope: 2, quality: -2, morale: -1 }, consequence: "Production does answer the questions. Loudly. At 11:43 p.m." },
      { label: "Strip out the risky bits and ship the rest", desc: "A classic move for anyone who enjoys survival.", effects: { scope: 1, quality: 1, trust: 1 }, consequence: "The release becomes smaller, uglier, and much less likely to ruin your weekend." },
      { label: "Make the loudest person own the launch decision", desc: "A bold governance model based entirely on consequences.", effects: { morale: -1, trust: 2 }, consequence: "Confidence levels across the room change instantly once accountability enters the chat." },
    ],
  },
  {
    id: 'TEST-40', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
    scenario: "QA logs 27 bugs before launch. Engineering says 19 are 'edge cases,' 5 are 'known issues,' and 3 are 'not reproducible,' which is a fun way of saying they still exist. What do you do?",
    choices: [
      {
        label: "Triage every bug and rank by user pain",
        desc: "Replace category theater with actual prioritization.",
        effects: { quality: 2, trust: 1, scope: -1 },
        consequence: "Several bugs keep their dramatic labels, but now everyone has to admit which ones actually matter."
      },
      {
        label: "Close the edge cases and ship",
        desc: "Trust that users will stay politely on the happy path.",
        effects: { scope: 2, quality: -2, trust: -1 },
        consequence: "Users immediately begin exploring the exact edges your team found theoretically unimportant."
      },
      {
        label: "Fix only the bugs tied to core flows",
        desc: "Protect login, checkout, save, and anything else capable of public humiliation.",
        effects: { quality: 1, scope: 1, tech: 1 },
        consequence: "The release survives, though a few weird corners of the product remain cursed."
      },
      {
        label: "Make bug owners demo the issue live",
        desc: "A miracle cure for loose opinions.",
        effects: { trust: 2, morale: 1 },
        consequence: "Half the arguments vanish once people have to reproduce their confidence in front of witnesses."
      },
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
      { label: "Add an AI feature immediately",         desc: "'Great idea -- we've actually been thinking about this.'",      effects: { scope: -1, trust: 1, tech: -1 },   consequence: "It's on the roadmap. Nobody knows what the AI feature actually does yet. Including the CEO." },
      { label: "Ask what problem it solves",            desc: "Try to connect the idea to an actual user need.",               effects: { quality: 1, trust: -1 },             consequence: "Smart question. Wrong room. The CEO is now describing a problem that doesn't exist." },
      { label: 'Create an "AI strategy task force"',    desc: "Form a group dedicated to thinking about AI.",                  effects: { trust: 1, morale: -1 },              consequence: "A task force. The team knows what task forces produce. Spoiler: it's another meeting." },
      { label: 'Add "AI" to the roadmap slide',         desc: "Update the deck. Problem solved.",                              effects: { trust: 1, morale: 1, quality: -1 },  consequence: "The slide now says AI. Nothing else has changed. The CEO is satisfied." },
    ],
  },
  {
    id: 'PM-inf2', insertAfterStage: 3,
    title: 'The All-Hands Reorg',
    body: 'hey quick heads up - restructuring announcement going out tomorrow. your team is moving under Infrastructure now. no changes to your roadmap tho :)',
    choices: [
      { label: "Absorb it and move forward",           desc: "React with a thumbs up and pretend this won't affect anything.",  effects: { morale: -1, trust: 1 },             consequence: "You stayed calm. The new infra lead already has opinions about your backlog. Several of them." },
      { label: "Schedule a team offsite immediately",  desc: "'Let's realign on priorities.'",                                  effects: { morale: 2, scope: -1 },             consequence: "Team loves it. Roadmap loses a week. They think it was worth it. You're not sure." },
      { label: "Ask for clarity before committing",    desc: "Find out what 'no changes' actually means.",                      effects: { trust: 1, morale: 1 },              consequence: "Reasonable. Respected. You know 'no changes to your roadmap' is aspirational, not operational." },
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

function clamp(v) { return Math.max(0, Math.min(10, v)) }
function applyEffects(stats, effects) {
  const next = { ...stats }
  for (const [k, v] of Object.entries(effects)) next[k] = clamp(next[k] + v)
  return next
}

// ── Design tokens ────────────────────────────────────────────────────────────

const STAT_COLORS = { scope: '#6554c0', tech: '#ff991f', morale: '#36b37e', quality: '#ec5a8f', trust: '#4bade8' }
const STAT_DESCS  = { scope: 'Roadmap on track', tech: 'Codebase health', morale: 'Team energy', quality: 'Product quality', trust: 'Stakeholder confidence' }
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
              <div style={{ height: '100%', borderRadius: 4, background: color, width: `${val * 10}%`, transition: 'width .7s cubic-bezier(.2,.8,.2,1)' }} />
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

function IssueCard({ card, onChoice, chosen, onContinue }) {
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
          {card.scenario}
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
                <div style={{ fontFamily: '"Droid Sans", sans-serif', fontWeight: 700, fontSize: 13.5, lineHeight: 1.3, letterSpacing: '.05em', textTransform: 'uppercase', color: '#172b4d' }}>
                  {choice.label}
                </div>
                {!isOther && (
                  <div style={{ fontFamily: '"Droid Sans", sans-serif', fontWeight: 400, fontSize: 14.5, color: '#172b4d', lineHeight: 1.5, marginTop: 7 }}>{choice.desc}</div>
                )}
                {!chosen && (
                  <span className="pm-opt-arrow" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%) translateX(-4px)', color: '#0065ff', fontSize: 17, opacity: 0, transition: 'opacity .15s, transform .15s', pointerEvents: 'none' }}>→</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Inline consequence strip */}
        {chosen && (
          <div style={{ marginTop: 6, padding: '16px 18px', borderRadius: 6, background: '#e3fcef', border: '1px solid #abf5d1', animation: 'gameRev .35s cubic-bezier(.2,.8,.2,1)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: '.04em', textTransform: 'uppercase', color: '#fff', background: '#00875a', padding: '4px 9px', borderRadius: 3, fontFamily: '"Droid Sans", sans-serif' }}>✓ Result</span>
            <p style={{ fontSize: 15, lineHeight: 1.5, color: '#172b4d', margin: '12px 0 0', fontFamily: '"Droid Sans", sans-serif' }}>{chosen.consequence}</p>
            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={onContinue}
                style={{ background: '#0052cc', color: '#fff', border: 'none', borderRadius: 4, fontFamily: '"Droid Sans", sans-serif', fontSize: 14, fontWeight: 600, padding: '9px 18px', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.background = '#0065ff' }}
                onMouseLeave={e => { e.currentTarget.style.background = '#0052cc' }}
              >Next issue →</button>
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
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: '#6b778c', marginBottom: 14, fontFamily: '"Droid Sans", sans-serif' }}>Sent · #all-hands</div>
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

function SlackModal({ card, onChoice }) {
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
        New urgent message · #all-hands
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
                <div key={ch} style={{ margin: '1px 8px', padding: '4px 8px', borderRadius: 4, background: ch === '#all-hands' ? '#1264a3' : 'transparent', color: ch === '#all-hands' ? '#fff' : 'rgba(255,255,255,.5)', fontSize: 13, fontFamily: '"Lato", sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {ch}
                  {ch === '#all-hands' && <span style={{ marginLeft: 'auto', background: '#de350b', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '1px 5px', fontFamily: '"Lato", sans-serif' }}>1</span>}
                </div>
              ))}
              <div style={{ padding: '10px 12px 4px', fontSize: 11, fontWeight: 900, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', fontFamily: '"Lato", sans-serif' }}>Direct Messages</div>
              {[{ name: 'Jordan Chen (CEO)', online: true }, { name: 'You', online: false }].map(u => (
                <div key={u.name} style={{ margin: '1px 8px', padding: '4px 8px', borderRadius: 4, color: 'rgba(255,255,255,.4)', fontSize: 12, fontFamily: '"Lato", sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: u.online ? '#2bac76' : '#6b778c', flexShrink: 0 }} />{u.name}
                </div>
              ))}
            </div>

            {/* Channel pane */}
            <div style={{ flex: 1, background: '#fff', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', borderBottom: '1px solid #e8e8e8', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1d1c1d', fontFamily: '"Lato", sans-serif' }}>#all-hands</span>
                <span style={{ fontSize: 13, color: '#616061', fontFamily: '"Lato", sans-serif' }}>24 members</span>
              </div>

              <div style={{ flex: 1, padding: '16px 18px', overflowY: 'auto' }}>
                {/* Faded prior message */}
                <div style={{ display: 'flex', gap: 10, marginBottom: 20, opacity: .4 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 4, background: '#7c3aed', flexShrink: 0, display: 'grid', placeItems: 'center', color: '#fff', fontSize: 12, fontWeight: 700, fontFamily: '"Lato", sans-serif' }}>SR</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: '#1d1c1d', fontFamily: '"Lato", sans-serif' }}>Sarah R.</span>
                      <span style={{ fontSize: 12, color: '#616061', fontFamily: '"Lato", sans-serif' }}>9:41 AM</span>
                    </div>
                    <p style={{ fontSize: 14, color: '#4a4a4a', margin: '2px 0 0', lineHeight: 1.46, fontFamily: '"Lato", sans-serif' }}>Anyone see the Q3 board deck yet?</p>
                  </div>
                </div>

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
                    <div style={{ fontWeight: 700, fontSize: 13, color: '#1d1c1d' }}>{choice.label}</div>
                    <div style={{ fontSize: 13, color: '#4a4a4a', marginTop: 2, lineHeight: 1.4 }}>{choice.desc}</div>
                  </div>
                ))}
              </div>

              {/* Composer */}
              <div style={{ borderTop: '1px solid #e8e8e8', padding: '8px 12px' }}>
                <div style={{ border: '1px solid #ddd', borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderBottom: '1px solid #e8e8e8', background: '#f8f8f8' }}>
                    {['B', 'I', 'S'].map(f => <button key={f} style={{ fontSize: 12, color: '#616061', fontWeight: 700, width: 20, height: 20, background: 'none', border: 'none', cursor: 'pointer', fontFamily: '"Lato", sans-serif' }}>{f}</button>)}
                  </div>
                  <div style={{ padding: '8px 12px', fontSize: 14, color: '#ccc', fontFamily: '"Lato", sans-serif' }}>Message #all-hands</div>
                </div>
              </div>
            </div>
          </div>
        </div>
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

        {/* Verdict */}
        <div style={{ display: 'flex', gap: 18, alignItems: 'center', background: '#fff', border: '1px solid #dfe1e6', borderLeft: `5px solid ${borderColor}`, borderRadius: 10, padding: '20px 22px', boxShadow: '0 1px 2px rgba(9,30,66,.1)' }}>
          <span style={{ fontSize: 40, lineHeight: 1, flexShrink: 0 }}>{emoji}</span>
          <div>
            <div style={{ fontFamily: '"Droid Sans", sans-serif', fontWeight: 700, fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase', color: borderColor }}>
              You brought a product to market · {sequence.length} cards
            </div>
            <h2 style={{ fontFamily: '"Oswald", sans-serif', fontWeight: 600, fontSize: 24, letterSpacing: '.01em', textTransform: 'uppercase', margin: '3px 0 0', color: '#172b4d' }}>{name}</h2>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: '#42526e', margin: '7px 0 0' }}>{flavorText}</p>
          </div>
        </div>

        {/* PM Style hero */}
        <div style={{
          position: 'relative', marginTop: 16, borderRadius: 12, overflow: 'hidden', color: '#fff',
          padding: '30px 32px 28px', boxShadow: '0 6px 18px rgba(9,30,66,.16)',
          background: 'radial-gradient(120% 130% at 88% 0%, rgba(255,255,255,.2), transparent 55%), linear-gradient(135deg, #ec5a8f, #c8407a)',
        }}>
          <span style={{ position: 'absolute', top: 24, right: 30, fontSize: 50, lineHeight: 1 }}>{pmStyle.emoji}</span>
          <div style={{ fontFamily: '"Droid Sans", sans-serif', fontWeight: 700, fontSize: 12, letterSpacing: '.14em', textTransform: 'uppercase', opacity: .88 }}>Your PM Style</div>
          <h1 style={{ fontFamily: '"Oswald", sans-serif', fontWeight: 700, fontSize: 'clamp(36px,7.5vw,52px)', lineHeight: 1, letterSpacing: '.01em', textTransform: 'uppercase', margin: '8px 0 0' }}>{pmStyle.title}</h1>
          <p style={{ fontSize: 15, lineHeight: 1.6, marginTop: 14, opacity: .96, maxWidth: '52ch' }}>{pmStyle.desc}</p>
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
                      {isLow && <span style={{ fontWeight: 700, fontSize: 9, color: '#fff', background: '#de350b', padding: '2px 6px', borderRadius: 3, marginLeft: 6, verticalAlign: 'middle' }}>LOW</span>}
                    </span>
                    <span style={{ fontFamily: '"Oswald", sans-serif', fontWeight: 600, fontSize: 17, color: '#42526e' }}>{val * 10}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 4, background: '#ebecf0', marginTop: 7, overflow: 'hidden' }}>
                    <div style={{ height: '100%', borderRadius: 4, background: color, width: `${val * 10}%` }} />
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
  const [gameState, setGameState] = useState('intro')  // 'intro' | 'playing' | 'outcome'
  const [cardIndex, setCardIndex] = useState(0)
  const [stats, setStats] = useState(INITIAL_STATS)
  const [chosen, setChosen] = useState(null)   // {effects, consequence, index} | null
  const [sequence, setSequence] = useState([])

  const currentCard = sequence[cardIndex]
  const stageIndex  = currentCard?.stage ?? 0
  const showSlack   = gameState === 'playing' && currentCard?.type === 'legendary' && !chosen

  function handleStart() {
    const seq = buildSequence()
    setSequence(seq)
    setCardIndex(0)
    setStats(INITIAL_STATS)
    setChosen(null)
    setGameState('playing')
  }

  function handleChoice(choice, index) {
    setStats(prev => applyEffects(prev, choice.effects))
    setChosen({ effects: choice.effects, consequence: choice.consequence, index })
  }

  function handleContinue() {
    const next = cardIndex + 1
    if (next >= sequence.length) {
      setGameState('outcome')
    } else {
      setCardIndex(next)
      setChosen(null)
    }
  }

  function handleRestart() {
    setGameState('intro')
    setCardIndex(0)
    setStats(INITIAL_STATS)
    setChosen(null)
    setSequence([])
  }

  if (gameState === 'outcome') {
    return <OutcomeScreen stats={stats} sequence={sequence} onRestart={handleRestart} />
  }

  if (gameState === 'intro') {
    return <IntroScreen onStart={handleStart} />
  }

  const dayNum    = cardIndex + 1
  const totalDays = sequence.length

  return (
    <>
      <div style={{ minHeight: '100vh', background: '#f4f5f7', fontFamily: '"Droid Sans", sans-serif', filter: showSlack ? 'blur(2px) brightness(.7)' : 'none', transition: 'filter .3s', pointerEvents: showSlack ? 'none' : 'auto' }}>
        <GameNav
          crumb={`Sprint ${stageIndex + 1} — ${STAGES[stageIndex]}`}
          dayLabel={`Day ${dayNum} / ${totalDays}`}
          onRestart={handleRestart}
        />
        <div className="pm-game-wrap" style={{ maxWidth: 980, margin: '0 auto', padding: '34px 24px 60px', display: 'grid', gridTemplateColumns: '1fr 260px', gap: 28, alignItems: 'start' }}>
          <div>
            {currentCard?.type === 'stage' && (
              <IssueCard
                card={currentCard}
                onChoice={handleChoice}
                chosen={chosen}
                onContinue={handleContinue}
              />
            )}
            {currentCard?.type === 'legendary' && chosen && (
              <ConsequencePanel chosen={chosen} onContinue={handleContinue} />
            )}
          </div>
          <StatRail stats={stats} effects={chosen?.effects} />
        </div>
      </div>
      {showSlack && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'auto' }}>
          <SlackModal card={currentCard} onChoice={handleChoice} />
        </div>
      )}
    </>
  )
}
