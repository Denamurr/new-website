---
title: "The RICE Framework in the Age of AI (and why it needs an update)"
date: "2026-03-06"
slug: "rice-framework-age-of-ai"
tool_label: "RICE Prioritization Tool"
tool_href: "/tools/rice"
image: "/images/rice-hero.jpg"
image_alt: "RICE prioritization framework diagram"
---

RICE is a popular framework for product managers to use to evaluate and rank new product or feature ideas, by level of priority. It considers the Reach, Impact, Confidence and Effort it will take to build an idea, and gives you a numerical score. Whichever idea has the highest score is the most bang for your buck and should be prioritized first. It's clean, understandable and easy to share with stakeholders.

It also wasn't really built for AI work. If you're using it to evaluate new AI ideas, the score results are going to be skewed unless you make some adjustments.

---

## 1. Effort is the biggest problem

Features have traditionally been built by engineers who wrote each piece of code. When a team sees EFFORT involved, you are estimating how long it will take for your engineers to build it. I commonly used the # of SEs x # of weeks to build to get a number that symbolizes how long it will take. If all the code is written by AI, what used to take a few people weeks to do, now only takes a few hours to a few days for a machine to build. Feels like a quick win, right? Yes the time to build will be shorter, but the effort actually increases.

Take a simple example: let's say the idea is an AI feature that suggests email subject lines based off the body of the email. The code to call the API and display suggestions will take a day or two at most.

But the overall effort of the idea will take weeks, not days.

Before you can test anything, someone first has to define what a good subject line actually looks like. Otherwise, how do you know if it's ready to be deployed? Should they be under 50 characters? Do they need to match our brand voice? Can it make claims that are only partially supported by the email body? Can it use sarcasm? Is clickbait ever acceptable? This sounds obvious until you sit in a room and try to determine what kinds of subject lines are great and what subject lines the marketing team avoids. If you just trust that AI knows best, there will be lots of mistakes and failures that will slip through.

Then someone has to build a test suite with real examples of emails and possible subject lines that are good and also not good, so there is something real and tangible to evaluate against.

The prompting instructions will go through different iterations. The first version of those instructions will not produce great results. The AI might give you results that are technically correct but just feel off. They're too formal, too generic or missing the point.

Revision of instructions. Add more context. Change the wording. Try again. Some improvement. Some results are worse. You adjust again. This back and forth is not coding in the traditional sense. There's no syntax to get right. It's closer to coaching someone who's very literal and very fast but doesn't have any common sense yet.

The feature needs to go through lots of revisions because you're not building a thing, you're nudging behavior in a system that doesn't explain itself. You try something, see what changed, guess at why, and then try again. This loop can run 10-20 rounds. Each round takes hours.

After a lot of extra effort and fine tweaking, you ship it. It took about a week, not 1-2 days. Now it's three months later and the model provider updates their model, changing the personality.

This happens because AI-generated code is more likely to default to calling by model name, because that's the most common pattern in documentation and training examples. It's the obvious way to write it. A human engineer with experience might think to be more specific with the version. An AI generating the code probably wouldn't unless explicitly told to. So any update to that model, which happens regularly, means the feature is automatically updated as well. Nobody on the team made any changes. The model just woke up slightly different one day. Sometimes it's an improvement. Sometimes the tone shifts in ways that quietly break everything you tuned. You might not even notice for a while.

If the code was written for a specific version, like gpt-4-0125 (instead of just gpt-4), then you avoid the automatic update — but eventually the provider is going to sunset that model. This means the code needs to be updated, triggering another round of quality checks.

The email from the provider notifying you about upcoming changes or model deprecation is going to whatever email set up the billing account — accounting or IT — not the PM whose feature depends on it. AI features come with ongoing maintenance, so that simple email subject line feature is weeks of initial effort and unknown future effort, compared to the hours or days used in the original RICE calculation.

**Rule of thumb:** whatever the engineering estimate is, add at least 50% for the work that happens around the code. Testing, evaluating, monitoring, adjusting. That part never makes it into the first estimate and it always adds to the final timeline.

---

## 2. Confidence is another booby trap

In standard RICE, confidence is straightforward: how sure are you that it will affect the users you think it will, and that the impact will be what you expect? It's a check on the quality of your research.

- **100%** — Data clearly supports it. You've tested it, you've seen it work.
- **80%** — Solid evidence, but some unknowns remain.
- **50%** — Mostly intuition, limited data.
- **Below 50%** — A moonshot. High uncertainty, little research done.

With AI, you're essentially adding an unknown to the equation — a second layer of uncertainty that sits underneath your estimates, no matter how much data is supporting them. So even if your Reach and Impact scores are well researched and AB tests completed, the model itself is unpredictable. It doesn't return the same output twice. It drifts when it's updated and behaves differently on edge cases.

This means that for AI features, confidence should answer two questions, not one:

1. How sure are you about your estimates? (the original question)
2. How predictable is the model's behavior? Do you have evals? Did you test the edge cases? Have you decided whether to call the model by name or pin to a specific version?

A feature can have high confidence in its estimates and low confidence in the model's reliability. Make sure both are reflected in your score.

**Rule of thumb:** If you can't answer "how will we know if this is working" before you build it, the confidence score should be low.

---

## 3. Impact is harder to measure than it used to be

When it comes to impact, AI investments are harder to justify with standard RICE. This is because they're mostly improving how well something is done, not whether it's done.

Traditional RICE measures impact by what moves a number. Revenue, activation, retention — something you can put in a graph and show a stakeholder without explanation.

AI features, at this stage, are most commonly additions to existing products rather than new products entirely. They tend to make things better, improve the experience. A better recommendation doesn't get more people to click — it gets the right people to click. An automated email compose feature doesn't mean more emails are sent, just that the email content has improved.

Quality is usually the better investment and yet it's harder to quantify in a spreadsheet. The impact score needs to account for the different ways it can be measured. Otherwise, the team will keep picking things that are easy to measure over things that are more subtle but a better overall improvement.

An AI-powered search on a product or ecommerce site that actually understands what someone is looking for — rather than just matching keywords — isn't going to increase how often people search. It will reduce the irrelevant results that cause users to search again and again to find the same thing. The metric would be something like search-to-purchase rate or search abandonment rate. Real metrics, but slower to move and harder to tie to a single feature upgrade than a button that converts.

---

## The bottom line

RICE scores for AI features will mislead you unless you make some adjustments. Sure, the coding is faster. Everything around the code is slower, fuzzier, and more collaborative than most roadmaps account for.

The effort isn't less, the confidence drops, and the impact is more nuanced.

RICE is still a good framework. In the age of AI, it just needs a few more inputs.
