---
title: "The RICE Framework in the Age of AI (don't trust it)"
date: "2026-03-06"
slug: "rice-framework-age-of-ai"
tool_label: "RICE Prioritization Tool"
tool_href: "/tools/rice"
image: "/images/rice-hero.jpg"
image_alt: "RICE prioritization framework diagram"
---

RICE is a popular framework for product managers to use to evaluate and rank new product or feature ideas, by level of priority. It considers the Reach, Impact, Confidence and Effort it will take to build an idea, and gives you a numerical score. Whichever idea has the highest score is the most bang for your buck and should be prioritized first. It's clean, understandable and easy to share with stakeholders.

![How RICE is calculated](/rice-formula.svg)

It also wasn't really built for AI work. If you're using it to evaluate new AI ideas, the score results are going to be skewed unless you make some adjustments.

---

## 1. Effort is the biggest problem

Features have traditionally been built by engineers who wrote each piece of code. When a team sees EFFORT involved, you are estimating how long it will take for your engineers to build it. I commonly used the # of SEs x # of weeks to build to get a number that symbolizes how long it will take. If all the code is written by AI, what used to take a few people weeks to do, now only takes a few hours to a few days for a machine to build. Feels like a quick win, right? Yes the time to build will be shorter, but the effort actually increases.

Take a simple example: let's say the idea is an AI feature that suggests email subject lines based off the body of the email. The code to call the API and display suggestions will take a day or two at most.

But the overall effort of the idea will take weeks, not days.

**Clear Definition**

You need to work out many things to determine whether its AI Slop or AI success including defining what a *good* subject is. Should they be under 50 characters? Do they need to match the brand voice? Can it make claims that are only partially supported by the email body? Can it use sarcasm? Is clickbait ever acceptable? This sounds obvious until you sit in a room and try to determine what kinds of subject lines are great and what subject lines the marketing team avoids. If you just trust that AI knows best, there will be lots of mistakes and failures that will slip through.

**Clear Testing with Examples**

Then someone has to build a test suite with real examples of emails and possible subject lines that are good and also not good subject lines, so there is something real and tangible to evaluate against.

**Revise Revise Revise**

The prompting instructions will go through different iterations. The first version of those instructions will look different than the final version.

Now it's three months later and the model provider has updated their model, effectively changing the personality. Nobody on the team made any changes or has given any thought about the feature since it was released. And suddenly, the model just woke up slightly different today. Sometimes it's an improvement. Sometimes the tone shifts in ways that quietly break everything you tuned. You might not even notice for a while.

**Model Updates? Have a Plan.**

Who will handle the updates? Who will be responsible for getting the email notification coming from the AI provider about an upcoming model version deprecation?

That small email subject line feature you added is going to take more effort than you originally planned for.

**Effort:** A good rule of thumb: whatever the engineering estimate is, add at least 50% for the work that happens around the code. Testing, evaluating, monitoring, adjusting. That part never makes it into the first estimate and it always adds to the final timeline.

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
