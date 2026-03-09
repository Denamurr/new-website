'use client'
import { useState } from 'react'

const STATS_CONFIG = [
  { key: 'roadmap', label: 'Roadmap', color: 'bg-violet-500' },
  { key: 'morale',  label: 'Morale',  color: 'bg-emerald-500' },
  { key: 'trust',   label: 'Trust',   color: 'bg-sky-500' },
  { key: 'tech',    label: 'Tech',    color: 'bg-amber-500' },
  { key: 'quality', label: 'Quality', color: 'bg-yellow-400' },
]

const INITIAL_STATS = { roadmap: 5, morale: 5, trust: 5, tech: 5, quality: 5 }
const STAGES = ['Discovery', 'Strategy', 'Design', 'Development', 'Testing']

// ── Card pools — 5 per stage, 3 drawn per game ───────────────────────────────

const STAGE_POOLS = {
  0: [ // Discovery
    {
      id: 'PM-001', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "The CEO attended one discovery session, the kickoff, and has since developed three fully-formed product visions. Your team has capacity for one. The CEO considers this a minor logistical detail. What do you do?",
      choices: [
        { label: "Go with the CEO's favorite",            desc: "Ship what the CEO liked in the kickoff deck.",                              effects: { trust: 1, morale: -1 },                consequence: "Team ships the CEO's gut. At least the roadmap review will be short." },
        { label: "Run a quick validation sprint",         desc: "Spend a week confirming what you probably already know.",                   effects: { roadmap: -1, morale: 2 },              consequence: "One week slower. The CEO doesn't love 'we did research.' They love 'research confirmed your instinct.'" },
        { label: "Pick the option with strongest signal", desc: "Use the research like it's actually there for something.",                  effects: { morale: 1, trust: 1 },                 consequence: "Fast and defensible. You'll get credit later when it works, not for the decision. For the outcome." },
        { label: "Scope a hybrid of all three",           desc: "Give everyone a little of what they want and none of what they need.",      effects: { roadmap: -2, morale: -2, quality: -1 }, consequence: "Congratulations. You built nobody's favorite product." },
      ],
    },
    {
      id: 'PM-002', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "Three stakeholders have given you three completely different definitions of success. One cares about revenue. One cares about engagement. One says success is 'strategic positioning.' The executive alignment meeting is next week. You've been in the role for four months. What do you do?",
      choices: [
        { label: "Synthesize all three into one definition",   desc: "Create a definition vague enough that everyone nods.",                     effects: { roadmap: -1, trust: 1, morale: -1 }, consequence: "You made one definition that technically includes all three. Nobody is wrong. Nobody is aligned." },
        { label: "Schedule 1:1s with each before the meeting", desc: "Quietly align expectations before the public debate.",                     effects: { trust: 2, morale: 1 },             consequence: "You did the pre-work. The meeting runs 22 minutes. This is what good looks like." },
        { label: "Default to the CEO's view",                  desc: "'Ultimately we should align with leadership's vision.'",                   effects: { trust: 1, morale: -1 },            consequence: "Expedient. The other two stakeholders will remember." },
        { label: "Write a framing doc and circulate it",       desc: "Document the options and hope the argument happens in comments instead.",  effects: { quality: 1, trust: 1 },            consequence: "A written artifact. In 6 months this doc will either vindicate you or be used against you." },
      ],
    },
    {
      id: 'PM-003', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "Your research consists of 5 user interviews and a survey with 40 responses. Three of the survey responses appear to be from the same person. Your designer raises an eyebrow. Your lead engineer asks if any of this is statistically significant. You briefly consider googling 'statistically significant.' What do you do?",
      choices: [
        { label: "Run 10 more interviews",              desc: "Let's increase the sample size before we decide.",                    effects: { roadmap: -1, quality: 2 },            consequence: "It costs time. You find a behavior pattern that changes the entire approach. You say nothing about the timeline." },
        { label: "Proceed with what we have",           desc: "It's directional research.",                                         effects: { quality: -1, roadmap: 1 },            consequence: "Ship it and find out. This is technically a research strategy." },
        { label: "Run a 2-day research sprint",         desc: "Let's gather just enough evidence to feel confident.",                effects: { roadmap: -1, morale: 1, quality: 1 }, consequence: "Structured and fast. The designer stops asking questions. You consider this a win." },
        { label: "Outsource the research",              desc: "Let's get a consultant to tell us the same thing more confidently.",  effects: { roadmap: 1, trust: -1, quality: 1 },  consequence: "Budget questions were raised. The findings were the same as what you already had. No one says this." },
      ],
    },
    {
      id: 'PM-004', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "A sales rep who's done 30 discovery calls tells you nobody wants to pay for the premium tier. Your research says otherwise. The sales rep is about to say this in the all-hands. What do you do?",
      choices: [
        { label: "Go back to users and validate",        desc: "Stop the train before it reaches the station.",                  effects: { roadmap: -1, quality: 2, trust: -1 }, consequence: "You pumped the brakes. It stings now. The alternative stings worse." },
        { label: "Trust the original research",          desc: "30 calls is anecdote. Your survey is data. Probably.",           effects: { quality: -1, roadmap: 1 },            consequence: "You stayed the course. The sales rep was right." },
        { label: "Adjust pricing model and move on",     desc: "Pivot fast enough that no one asks when you knew.",              effects: { trust: 1, roadmap: -1, quality: 1 },  consequence: "Micro-pivot. The new pricing has its own untested assumptions." },
        { label: "Flag the risk in Notion and continue", desc: "Cover your paper trail and keep the timeline.",                  effects: { trust: 1, quality: -1 },             consequence: "It's documented. When it comes up later, you will point to the document." },
      ],
    },
    {
      id: 'PM-005', epic: 'DISCOVERY', epicColor: 'bg-purple-100 text-purple-700',
      scenario: "The CEO wants to invite three enterprise customers to a 'vision alignment session' before you finalize discovery outputs. The invites have already gone out. You have never heard the term 'vision alignment session' before. What do you do?",
      choices: [
        { label: "Run it — customer insight is good", desc: "Customer conversations are research. Sort of.",                    effects: { morale: 1, quality: 1, roadmap: -1 }, consequence: "Actually useful. One customer says something that changes the entire product direction. The CEO is very pleased." },
        { label: "Redirect to structured interviews", desc: "Reframe the chaos as a methodology.",                             effects: { quality: 1, trust: -1 },              consequence: "You reframed it as user research. Nobody liked the reframe. The insights were better." },
        { label: "Let the CEO run it",                desc: "Hand over the mic and manage expectations afterward.",            effects: { trust: 1, morale: -2 },               consequence: "90 minutes of the CEO describing the product to customers while they nodded." },
        { label: "Combine it with the sprint review", desc: "Two birds, one deeply confused meeting.",                         effects: { roadmap: 1, quality: -1, morale: -1 }, consequence: "Two meetings became one. Neither goal was achieved." },
      ],
    },
  ],

  1: [ // Strategy
    {
      id: 'PM-011', epic: 'STRATEGY', epicColor: 'bg-blue-100 text-blue-700',
      scenario: "A competitor launches a feature you hadn't planned. It's getting press. TechCrunch calls it 'a bold move that could reshape the category.' Your CEO forwards you the article with the subject line: 'Thoughts?' What do you do?",
      choices: [
        { label: "Pretend it was always part of the plan",    desc: "Great validation of the direction we've been thinking about.",              effects: { trust: 1, morale: 1, quality: -1 },  consequence: "You claimed alignment with a competitor's roadmap. Two people in the meeting nodded. The rest Googled the competitor." },
        { label: "Reply with a clear-headed tradeoff",        desc: "Explain why copying competitors is not always the strategy.",               effects: { morale: 1, trust: 1 },               consequence: "You held the line. The CEO forwarded your reply to the board. That's new." },
        { label: "Add it and cut something else",             desc: "Reprioritize the roadmap and hope nobody asks what got removed.",           effects: { morale: -1, quality: -1 },           consequence: "The team hates undoing planned work. The churn shows in the code." },
        { label: "Commit it to V2 with a written rationale",  desc: "Draft a thoughtful explanation of why it belongs in the next phase.",       effects: { trust: 1, morale: 1 },               consequence: "You gave the CEO something to say to the board. This is a skill." },
      ],
    },
    {
      id: 'PM-012', epic: 'STRATEGY', epicColor: 'bg-blue-100 text-blue-700',
      scenario: "Your engineering lead pulls you aside. Scope has grown 30% since kickoff. No one formally approved any of it. You added most of it. Engineering would like to discuss the concept of 'scope control.' What do you do?",
      choices: [
        { label: "Acknowledge it and cut back",             desc: "Trim the roadmap and quietly pretend it was the plan all along.",         effects: { roadmap: 1, morale: 1, quality: -1 }, consequence: "Painful but honest. You own the problem. The team respects the reset." },
        { label: "Keep it -- it's all valuable",            desc: "Explain that each addition was 'strategically important.'",               effects: { roadmap: -2, morale: -1 },            consequence: "You said yes to everything. Everything is now late. You will use the word 'learnings.'" },
        { label: "Document it and make it official",        desc: "Update the roadmap and call it a revised strategy.",                      effects: { trust: 1, roadmap: -1 },              consequence: "Stakeholders receive this as 'good communication.' It is not good communication." },
        { label: "Blame the stakeholders who requested it", desc: "'I'm just representing business needs.'",                                effects: { morale: -2, trust: -1 },              consequence: "Technically accurate. Politically ruinous. The energy in the room shifted." },
      ],
    },
    {
      id: 'PM-013', epic: 'STRATEGY', epicColor: 'bg-blue-100 text-blue-700',
      scenario: "It's been two weeks and the team still can't agree on a north star metric. Marketing wants MAU. Product wants activation rate. Engineering wants uptime. The disagreement has been named 'the metric standoff' in the team Slack. What do you do?",
      choices: [
        { label: "Call a meeting and decide together",     desc: "Solve it democratically. Slowly.",                             effects: { morale: 1, trust: 1, roadmap: -1 },  consequence: "Inclusive. Everyone's bought in. You lost a week getting there." },
        { label: "Pick activation rate",                  desc: "Choose the metric that actually measures value.",               effects: { quality: 1, morale: 1 },              consequence: "The correct answer. You will spend six months explaining why to Marketing." },
        { label: "Let each team track their own metric",  desc: "Three dashboards. Three realities. One product.",              effects: { roadmap: 1, quality: -1 },            consequence: "You avoided conflict. You created three different realities." },
        { label: "Escalate to the CEO to decide",         desc: "Let someone else own the decision and the fallout.",           effects: { trust: -1, roadmap: 1 },              consequence: "You passed the buck. It worked. Everyone noticed." },
      ],
    },
    {
      id: 'PM-014', epic: 'STRATEGY', epicColor: 'bg-blue-100 text-blue-700',
      scenario: "Two engineers inform you that a core feature isn't feasible in the timeline. This is week 4. They've known since week 2. Their explanation for the delay: 'we were hoping to find a workaround.' What do you do?",
      choices: [
        { label: "Reset the timeline",                 desc: "Absorb the hit now before it becomes a crater.",                 effects: { roadmap: -2, trust: -1, morale: 1 },  consequence: "Expensive. Honest. The team is relieved you didn't try to force it." },
        { label: "Find a workaround together",         desc: "Get in the weeds and ship something that works.",               effects: { tech: 1, morale: 1, roadmap: -1 },    consequence: "You rolled up your sleeves. The solution isn't elegant but it ships." },
        { label: "Cut the feature from MVP",           desc: "Ship less. Ship it clean.",                                     effects: { roadmap: 1, quality: -1, morale: 1 }, consequence: "Clean call. Stakeholders are disappointed. The team is not." },
        { label: "Ask why this wasn't raised sooner",  desc: "A fair question at entirely the wrong moment.",                 effects: { morale: -2, trust: -1 },              consequence: "Fair question. Terrible timing. The answer was 'we were scared to tell you.'" },
      ],
    },
    {
      id: 'PM-015', epic: 'STRATEGY', epicColor: 'bg-blue-100 text-blue-700',
      scenario: "It's Q3 planning. Your OKRs are due in 48 hours. Your roadmap is 60% speculative. A VP has just added three new 'strategic initiatives' to your team's scope. No one agrees what the priorities are. What do you do?",
      choices: [
        { label: "Push back on the initiatives",                    desc: "Explain that the team cannot realistically absorb more scope.",        effects: { trust: -1, morale: 1 },               consequence: "Necessary. Uncomfortable. The VP will find another angle." },
        { label: "Accept them and adjust the OKRs",                 desc: "Rewrite the roadmap and hope the math works out later.",              effects: { roadmap: -2, morale: -1 },            consequence: "The OKRs are now aspirational. The team knows it. So do you." },
        { label: "Ask the VP to prioritize them",                   desc: "Politely request clarity on what actually matters.",                  effects: { trust: 1, roadmap: -1 },              consequence: "Smart move. Slower. The VP schedules a follow-up. The follow-up is not useful." },
        { label: "Submit vague OKRs that accommodate everything",   desc: "'Improve platform outcomes through strategic initiatives.'",          effects: { morale: -1, quality: -1 },            consequence: "On time. Unmeasurable. This may be the point." },
      ],
    },
  ],

  2: [ // Design
    {
      id: 'PM-021', epic: 'DESIGN', epicColor: 'bg-pink-100 text-pink-700',
      scenario: "User testing reveals something impressive. All five testers failed the same task. Not one of them even got close. One tester tried clicking the company logo for help. Another tried refreshing the page three times. Your designer already knows and is staring at you in silence. A full redesign would take two extra weeks. What do you do?",
      choices: [
        { label: "Redesign now",                          desc: "Fix it properly while you still can.",                              effects: { roadmap: -1, morale: 1, quality: 2 }, consequence: "Slower. Better. The designer gives you a subtle nod in standup." },
        { label: "Ship it and iterate post-launch",       desc: "Let users discover the problem for you.",                          effects: { morale: -1, quality: -1 },            consequence: "The team knows it's broken. Users will, too. The App Store reviews will be instructive." },
        { label: "Quick fix that partially addresses it", desc: "Make it less bad. Ship it. Repeat.",                               effects: { roadmap: -1, quality: 1 },            consequence: "It's better. Not fixed. You'll be back here in six weeks." },
        { label: "Dismiss the finding",                   desc: "One data point. Probably an outlier. Almost certainly not.",       effects: { morale: -2, quality: -2, trust: -1 }, consequence: "'One tester's opinion.' The finding shows up in your App Store reviews three weeks later." },
      ],
    },
    {
      id: 'PM-022', epic: 'DESIGN', epicColor: 'bg-pink-100 text-pink-700',
      scenario: "Brand wants the design to be bold. UX says bold is unusable. They've been in a standoff for 11 days, which is now being referred to in standup as a 'creative tension period.' No actual design work has happened during this time. What do you do?",
      choices: [
        { label: "Side with UX -- usability first",           desc: "Remind everyone that users still need to find the buttons.",          effects: { quality: 2, morale: 1 },              consequence: "Users will thank you. Brand sends a passive-aggressive Slack message." },
        { label: "Side with Brand -- it needs to stand out",  desc: "'Boldness is part of the experience.'",                              effects: { quality: -1, trust: 1 },              consequence: "It looks great. Users will figure it out eventually." },
        { label: "Commission a usability test to settle it",  desc: "Introduce data into the argument and watch both sides reinterpret it.",  effects: { roadmap: -1, quality: 1, morale: 1 }, consequence: "Data-driven. Decisive. The 'creative tension period' ends." },
        { label: "Try a compromise design",                   desc: "Produce something that disappoints everyone equally.",               effects: { quality: -1, morale: -1 },            consequence: "Nobody loves it. Compromise isn't always the answer. Today it really isn't." },
      ],
    },
    {
      id: 'PM-023', epic: 'DESIGN', epicColor: 'bg-pink-100 text-pink-700',
      scenario: "An accessibility audit comes back with 12 issues. Your designer reads the report, sighs audibly on the call, and says 'I flagged most of these in the design review.' Fixing all of them takes 3 weeks. What do you do?",
      choices: [
        { label: "Fix all 12 -- ship it right",          desc: "Do the thing everyone should do and almost nobody does.",         effects: { roadmap: -2, quality: 2, morale: 1 }, consequence: "The right call. It cost time. You can stand behind everything that shipped." },
        { label: "Fix the critical 4, log the rest",    desc: "Triage and document. The 8 will come back.",                    effects: { roadmap: -1, quality: 1 },            consequence: "Reasonable triage. The 8 you logged will come back. Budget for it." },
        { label: "Ship and fix in the next sprint",     desc: "Make a promise you might not keep.",                            effects: { quality: -1, trust: -1 },             consequence: "You know this is a promise you may not keep. So does the team." },
        { label: "Deprioritize -- not in the OKRs",     desc: "It didn't make the list. Neither will your credibility.",        effects: { quality: -2, morale: -2 },            consequence: "The team knows this is wrong. So do you. So do the users who need it." },
      ],
    },
    {
      id: 'PM-024', epic: 'DESIGN', epicColor: 'bg-pink-100 text-pink-700',
      scenario: "Your designer wants to prototype three interaction models before committing. Engineering says they have time for one. Your designer has already started on all three. What do you do?",
      choices: [
        { label: "Let the designer prototype all three",    desc: "Give them the runway. Get the right answer.",                 effects: { roadmap: -1, quality: 2 },            consequence: "Time well spent. The decision is right. The designer owns it completely." },
        { label: "Have engineering build the first option", desc: "Skip validation. Ship fast. Regret later.",                  effects: { roadmap: 1, quality: -1, morale: -1 }, consequence: "Fast. The designer never fully believed in it. The reviews will show it." },
        { label: "Prototype on paper -- no code yet",       desc: "Low cost, high information.",                               effects: { morale: 1, quality: 1 },              consequence: "Low-fi, high-signal. Everyone finds something useful. The designer calls it 'directional.'" },
        { label: "Put it to a team vote",                   desc: "Democracy and good UX are not the same thing.",             effects: { morale: 1, quality: -1 },             consequence: "Democratized. The most popular option and the best UX were not the same option." },
      ],
    },
    {
      id: 'PM-025', epic: 'DESIGN', epicColor: 'bg-pink-100 text-pink-700',
      scenario: "Your lead designer wants to throw out the entire component library and start fresh. Engineering looks like you just suggested deleting the production database. The library is two years old and genuinely painful to work with. Half the components are slightly different versions of the same button. What do you do?",
      choices: [
        { label: "Allow the full rebuild",                effects: { roadmap: -2, tech: 2, quality: 1 },   desc: "Declare design bankruptcy and start over.",                                consequence: "Expensive. The right call. In six months the team will forget there was ever a choice." },
        { label: "Decline, patch the existing library",  effects: { roadmap: 1, tech: -1, morale: -1 },   desc: "'We'll improve it incrementally.'",                                        consequence: "You bought time. The patches accumulate. The designer starts updating their portfolio." },
        { label: "Refactor only the critical components", effects: { roadmap: -1, tech: 1, morale: 1 },   desc: "Fix the parts that hurt the most.",                                        consequence: "Pragmatic. Not exciting. The team accepts it and moves." },
        { label: "Bring in a contractor to assess",       effects: { tech: 1, trust: 1, roadmap: -1 },    desc: "Ask an outsider to tell everyone what they already know.",                  consequence: "Outside perspective. The assessment says rebuild. You now have the permission structure to do it." },
      ],
    },
  ],

  3: [ // Development
    {
      id: 'PM-031', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
      scenario: "Your lead developer says the team is three weeks behind schedule. The root cause is unclear. Engineering says requirements changed. Design says engineering underestimated. Engineering says design changed things again. The standup has quietly become a daily blame archaeology session. What do you do?",
      choices: [
        { label: "Bring in contractors",       desc: "Add more people and hope it somehow speeds things up.",              effects: { roadmap: 2, morale: -1, tech: -1 },   consequence: "Timeline recovers. The team has friction with the new people. The new people will outlast the friction." },
        { label: "Cut a feature",              desc: "Reduce scope and pretend it was always the plan.",                   effects: { morale: 1, quality: 1 },              consequence: "Less to build. The team breathes. Sometimes the answer is less." },
        { label: "Push the team to crunch",    desc: "Declare a 'focus period.'",                                         effects: { roadmap: 1, morale: -3 },             consequence: "You recovered some time. One engineer updated their LinkedIn during standup." },
        { label: "Push the launch date",       desc: "Announce a revised timeline and prepare the explanation.",           effects: { roadmap: 2, morale: 1, trust: -1 },   consequence: "More time. Team relieved. CEO is in your calendar tomorrow morning." },
      ],
    },
    {
      id: 'PM-032', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
      scenario: "Your tech lead wants to refactor the authentication layer before the next feature. It wasn't on the roadmap. Engineering is describing it as 'critical.' No one can agree whether 'critical' means security risk or the code is ugly. What do you do?",
      choices: [
        { label: "Allow it, trust the engineer's judgment", desc: "'Okay. If it's critical, let's fix it.'",                          effects: { tech: 2, morale: 1, roadmap: -1 },  consequence: "The codebase is measurably better. The tech lead says 'thank you' for the first time in months." },
        { label: "Decline and scope it for next quarter",   desc: "Add it to the 'future improvements' section of the roadmap.",      effects: { roadmap: 1, tech: -1, morale: -1 }, consequence: "You held the line. The debt just got a week bigger." },
        { label: "Allow a 3-day timebox",                   desc: "Give engineering a small window and hope that's enough.",          effects: { tech: 1, morale: 1 },               consequence: "A reasonable middle. The team gets something done. The problem is not fully fixed but everyone is honest about that." },
        { label: "Reframe it as a feature request",         desc: "'Security improvements' sounds roadmap-friendly.",                 effects: { trust: -1, tech: -1 },              consequence: "You made a refactor look like scope creep. The tech lead now Googles your name and 'reviews.'" },
      ],
    },
    {
      id: 'PM-033', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
      scenario: "Your team has been blocked on a platform API for 2 weeks. The platform team now says 3 more. Their lead has been 'in meetings' every time you try to reach them. What do you do?",
      choices: [
        { label: "Escalate through management",            desc: "Go above their head. Make it formal.",                        effects: { trust: -1, roadmap: 1, morale: -1 }, consequence: "It works. The platform lead responds within the hour. You now have an enemy on the 4th floor." },
        { label: "Build a temporary workaround",           desc: "Ship around the blocker. The workaround becomes permanent.",  effects: { tech: -1, roadmap: 1, morale: 1 },  consequence: "Pragmatic. The workaround will outlive your employment at this company." },
        { label: "Reorder the sprint -- build around it",  desc: "Sequence your way out of someone else's delay.",             effects: { morale: 1, roadmap: -1 },           consequence: "Flexible. The reorder delays some things but keeps the team moving. This is the job." },
        { label: "Document it and formally flag the risk", desc: "Make the delay officially Not Your Problem.",                 effects: { trust: 1, roadmap: -1 },            consequence: "Clean. Transparent. The delay is now officially documented as Not Your Problem." },
      ],
    },
    {
      id: 'PM-034', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
      scenario: "Three engineers have each filed a separate Jira ticket flagging a different 'critical' infrastructure issue. None of them have spoken to each other about it. All three want it prioritized before the next sprint. What do you do?",
      choices: [
        { label: "Address all three in sequence",        desc: "Fix everything. Ship nothing on time.",                        effects: { tech: 3, roadmap: -3, morale: 1 },  consequence: "The codebase is pristine. The roadmap is a memory. The team is weirdly happy." },
        { label: "Triage with the team -- pick one",     desc: "Make a call together. Log the other two.",                    effects: { tech: 1, morale: 1 },               consequence: "Good process. One concern was real. Two were vibes. Nobody says this." },
        { label: "Push all three to post-launch",        desc: "Ship now. Pay later. With interest.",                         effects: { tech: -2, roadmap: 1, morale: -1 }, consequence: "You shipped faster. The three engineers now have a group chat you're not in." },
        { label: "Bring in a senior engineer to assess", desc: "Get outside credibility to end the internal debate.",          effects: { tech: 1, trust: 1, roadmap: -1 },   consequence: "External credibility defuses the debate. One concern was real. Two were vibes. This time you get to say it." },
      ],
    },
    {
      id: 'PM-035', epic: 'DEVELOPMENT', epicColor: 'bg-orange-100 text-orange-700',
      scenario: "Nobody on the team writes documentation. Engineering says it's product's job. Product says it's engineering's job. Everyone agrees it's important. The codebase currently has zero documentation. Launch is in 8 weeks. What do you do?",
      choices: [
        { label: "Mandate docs in the sprint process", desc: "Add 'documentation' to the definition of done.",               effects: { tech: 1, morale: -1, roadmap: -1 }, consequence: "Principled. The documentation that gets written is just good enough to comply." },
        { label: "Hire a technical writer",            desc: "Bring in someone whose entire job is explaining the system.",   effects: { trust: 1, tech: 1, roadmap: -1 },   consequence: "Smart. Expensive. The technical writer becomes the most popular person on the team." },
        { label: "Let it go until post-launch",        desc: "'That's a future-us problem.'",                                effects: { tech: -2, morale: 1 },              consequence: "You chose velocity. The next engineer who joins will handle the consequences." },
        { label: "Make documentation a launch blocker", desc: "Announce that nothing ships without docs.",                    effects: { tech: 2, morale: -2, roadmap: -1 }, consequence: "Nuclear option. The team delivers. They are tired and very vocal about it." },
      ],
    },
  ],

  4: [ // Testing
    {
      id: 'PM-041', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
      scenario: "QA files a P0 bug ticket two days before launch. It affects 20% of users but has a workaround. Your lead dev's Slack status is currently a red circle. What do you do?",
      choices: [
        { label: "Delay launch to fix it",            desc: "Do it right. Deliver the news.",                              effects: { roadmap: -1, morale: 1, quality: 1 }, consequence: "The right call. Painful and clean. Stakeholders grumble. Users never know." },
        { label: "Launch and hotfix within 24 hours", desc: "Ship now. Cross fingers. Monitor obsessively.",               effects: { morale: -1, trust: -1 },              consequence: "You'll probably be fine. 'Probably' is doing a lot of work in that sentence." },
        { label: "Remove the affected feature",       desc: "Cut the broken thing. Ship the working thing.",               effects: { quality: 1 },                         consequence: "Nothing ships broken. Users get less, but what ships works." },
        { label: "Ship it",                           desc: "What's the worst that could happen. (Don't answer that.)",    effects: { morale: -3, trust: -2, quality: -2 }, consequence: "Nobody said a word in the meeting. Slack was a different story." },
      ],
    },
    {
      id: 'PM-042', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
      scenario: "Beta users submitted 200 pieces of feedback in the first week. There is no clear signal. Some reports are typos. Some suggest rebuilding the entire product. One user asked if the product could 'be more like Excel.' What do you do?",
      choices: [
        { label: "Tag and categorize everything",             desc: "Create a very organized backlog of chaos.",                     effects: { quality: 1, roadmap: -1, morale: -1 }, consequence: "Thorough. The team is exhausted from tagging. The taxonomy is actually useful." },
        { label: "Find the top 10 by frequency and fix them", desc: "Focus on the problems that appear most often.",                 effects: { quality: 1, roadmap: 1 },              consequence: "Focused. Some important things got missed. Most important things got fixed." },
        { label: "Hand it to the team to self-organize",      desc: "Let engineering and design figure out what matters.",           effects: { morale: 1, quality: -1 },              consequence: "Empowering. Inconsistent. A few gems got buried. Nobody admits this." },
        { label: "Present all 200 items to stakeholders",     desc: "Share the full list and ask for guidance.",                     effects: { trust: -1, morale: -2 },               consequence: "This was not the meeting anyone wanted to be in." },
      ],
    },
    {
      id: 'PM-043', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
      scenario: "Load testing shows the app starts degrading at 500 concurrent users. Marketing is expecting 2,000 users at launch. Engineering estimates two weeks to properly fix the issue. Launch is... sooner than that. What do you do?",
      choices: [
        { label: "Delay launch until it's resolved",       desc: "Explain that reliability is part of the product.",              effects: { roadmap: -1, quality: 2, trust: -1 }, consequence: "The right call. The CEO is unhappy. Users will never know this conversation happened." },
        { label: "Launch with soft rate limiting",         desc: "Quietly throttle traffic and hope nobody notices.",              effects: { tech: -1, quality: -1, trust: 1 },    consequence: "You controlled the risk and capped your own launch. Twitter interprets this as mystery." },
        { label: "Invest in performance optimization now", desc: "Pause feature work and focus on stability.",                    effects: { tech: 2, roadmap: -2, morale: 1 },    consequence: "Full commitment. Expensive. The engineers will tell this story for years." },
        { label: "Launch to a waitlist to control load",   desc: "Turn the problem into an 'exclusive rollout.'",                 effects: { trust: 1, quality: 1, roadmap: -1 },  consequence: "Users perceive exclusivity. Engineers get breathing room. Someone writes a newsletter about your 'launch strategy.'" },
      ],
    },
    {
      id: 'PM-044', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
      scenario: "QA wants to delay launch a week to go from 40% to 80% test coverage. Engineering says coverage doesn't predict bugs. They are both correct. The argument is now three days old. What do you do?",
      choices: [
        { label: "Delay for the week -- get to 80%",      desc: "Spend the week. Ship with confidence.",                     effects: { roadmap: -1, quality: 2, tech: 1 },  consequence: "Your QA lead is satisfied. Engineering quietly admits it was the right call. Nobody says this out loud." },
        { label: "Ship at 40% and monitor closely",       desc: "Launch into the unknown. Watch the dashboards.",            effects: { quality: -1, tech: -1, morale: -1 }, consequence: "You shipped. The monitors lit up within 48 hours. The argument was resolved empirically." },
        { label: "Focus coverage only on critical paths", desc: "Cover what matters. Ignore the rest. Mostly.",              effects: { quality: 1, roadmap: 1 },            consequence: "Pragmatic. The uncovered areas stay quiet. This time." },
        { label: "Ask QA to justify the 80% target",      desc: "Challenge the number. Listen to the answer.",               effects: { morale: -1, trust: 1 },              consequence: "Fair question. The answer was convincing. You listened. That helped more than you expected." },
      ],
    },
    {
      id: 'PM-045', epic: 'TESTING', epicColor: 'bg-red-100 text-red-700',
      scenario: "The automated smoke test just failed on the production deploy. No one knows why. Launch is in 18 hours. The on-call engineer has been awake since 4am and is communicating mostly through sighs. What do you do?",
      choices: [
        { label: "Delay launch",                          desc: "Call it a 'stability-first decision.'",                      effects: { roadmap: -1, quality: 1, morale: 1 }, consequence: "Everyone gets some sleep. The root cause turns out to be a one-line fix. Nobody says this was the wrong call." },
        { label: "Push through and fix live",             desc: "'We'll monitor it closely.'",                                effects: { morale: -2, tech: -1, quality: -1 },  consequence: "Heroic in a way that shouldn't be heroic. The engineer finds the bug at 2am. Nobody celebrates." },
        { label: "Roll back to the previous build",       desc: "Return to the last version that mostly worked.",             effects: { tech: 1, roadmap: -1, morale: -1 },   consequence: "Safe. The rollback procedure worked perfectly, which is itself meaningful." },
        { label: "Investigate for 2 hours, then decide", desc: "Buy time and hope the root cause reveals itself.",            effects: { trust: 1, tech: 1 },                  consequence: "Measured response. The 2 hours surface the issue. You launch on time with the fix in place." },
      ],
    },
  ],
}

const LEGENDARY_CARDS = [
  {
    id: 'PM-inf', insertAfterStage: 1,
    title: 'The CEO Discovers AI',
    body: 'i listened to this podcast this weekend about AI. It sounds like the future. We should add AI to this.',
    choices: [
      { label: "Add an AI feature immediately",         desc: "'Great idea -- we've actually been thinking about this.'",      effects: { roadmap: -1, trust: 1, tech: -1 },   consequence: "It's on the roadmap. Nobody knows what the AI feature actually does yet. Including the CEO." },
      { label: "Ask what problem it solves",            desc: "Try to connect the idea to an actual user need.",               effects: { quality: 1, trust: -1 },             consequence: "Smart question. Wrong room. The CEO is now describing a problem that doesn't exist." },
      { label: 'Create an "AI strategy task force"',   desc: "Form a group dedicated to thinking about AI.",                  effects: { trust: 1, morale: -1 },              consequence: "A task force. The team knows what task forces produce. Spoiler: it's another meeting." },
      { label: 'Add "AI" to the roadmap slide',        desc: "Update the deck. Problem solved.",                              effects: { trust: 1, morale: 1, quality: -1 },  consequence: "The slide now says AI. Nothing else has changed. The CEO is satisfied." },
    ],
  },
  {
    id: 'PM-inf2', insertAfterStage: 3,
    title: 'The All-Hands Reorg',
    body: 'hey quick heads up - restructuring announcement going out tomorrow. your team is moving under Infrastructure now. no changes to your roadmap tho :)',
    choices: [
      { label: "Absorb it and move forward",           desc: "React with a thumbs up and pretend this won't affect anything.",  effects: { morale: -1, trust: 1 },             consequence: "You stayed calm. The new infra lead already has opinions about your backlog. Several of them." },
      { label: "Schedule a team offsite immediately",  desc: "'Let's realign on priorities.'",                                  effects: { morale: 2, roadmap: -1 },           consequence: "Team loves it. Roadmap loses a week. They think it was worth it. You're not sure." },
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

// ── Choice card -- shared by both modals ──────────────────────────────────────

function ChoiceButton({ choice, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-md border border-gray-200 bg-white px-4 py-3 hover:border-blue-400 hover:shadow-sm transition-all"
    >
      <div className="font-semibold text-sm text-gray-900 mb-0.5">{choice.label}</div>
      {choice.desc && <div className="text-xs text-gray-500 mb-2">{choice.desc}</div>}
      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
        {Object.entries(choice.effects).map(([k, v]) => {
          const cfg = STATS_CONFIG.find(s => s.key === k)
          return (
            <span key={k} className="inline-flex items-center gap-0.5 text-xs font-semibold text-gray-800">
              {v > 0 ? '+' : '-'}
              {Array.from({ length: Math.abs(v) }).map((_, i) => (
                <span key={i} className={`inline-block w-2.5 h-2.5 rounded-sm shrink-0 ${cfg.color}`} />
              ))}
            </span>
          )
        })}
      </div>
    </button>
  )
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
            <ChoiceButton key={i} choice={choice} onClick={() => onChoice(choice)} />
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
                  <ChoiceButton key={i} choice={choice} onClick={() => onChoice(choice)} />
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
  const { name, emoji, flavorText, tier, pmStyle } = getOutcome(stats)
  const tierColors = ['text-red-600', 'text-orange-500', 'text-yellow-600', 'text-blue-600', 'text-emerald-600']
  return (
    <div className="min-h-screen bg-[#f4f5f7] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Your PM Style</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">{pmStyle.emoji} {pmStyle.title}</h2>
          <p className="text-sm text-gray-500 leading-relaxed">{pmStyle.desc}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">Launch Outcome</div>
          <h2 className={`text-xl font-bold mb-2 ${tierColors[tier]}`}>{emoji} {name}</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{flavorText}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Final Stats</div>
          <div className="space-y-2">
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
  const currentStageIndex = currentCard ? currentCard.stage : 4

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
              Think you can ship without burning the team, blowing the roadmap, or losing the CEO's trust? You have 5 sprints. Make the calls.
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">How it works</p>
            <div className="space-y-2 text-sm text-gray-600">
              {[
                "You're a PM taking a product from Discovery through Testing across 5 sprints.",
                "Each sprint, click the Jira card to draw a scenario and pick your response.",
                "Watch out for urgent Slack messages -- the CEO has opinions.",
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
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Your stats -- all start at 5/10</p>
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
            Start Sprint 1: Discovery
          </button>
          <p className="text-center text-xs text-gray-400 mt-3">Click the first Jira card to draw your opening scenario</p>
        </div>
      </div>
    )
  }

  // ── Board view ──
  return (
    <div className="min-h-screen bg-[#f4f5f7] font-sans flex flex-col">
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

      <div className="flex flex-1 min-h-0">
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
            <div className="text-sm font-bold text-gray-800">{currentStageIndex + 1} of 5</div>
            <div className="text-xs text-gray-500">{STAGES[currentStageIndex]}</div>
            {currentCard?.type === 'legendary' && (
              <span className="mt-1.5 inline-block text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded">URGENT</span>
            )}
          </div>
        </div>

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
        </div>
      </div>

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
