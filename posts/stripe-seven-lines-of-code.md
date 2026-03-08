---
title: "Stripe's Seven Lines of Code"
date: "2024-03-01"
slug: "stripe-seven-lines-of-code"
---

There's a story that gets told about Stripe: two brothers turned seven lines of code into a $9 billion company. It's a satisfying headline. But it skips over the part that actually explains how Stripe got there.

The seven lines are real. In 2010, integrating payments into a website required weeks of work. Developers had to establish relationships with banks, set up merchant accounts, wire up payment gateways, navigate PCI compliance (a set of security standards for handling card data), and handle a dozen other requirements before a single transaction could go through. The existing solutions, like PayPal and traditional bank processors, had reduced some of that burden but not solved it.

Stripe took all of that complexity and hid it behind a clean interface. You dropped seven lines into your codebase and payments worked. Card data was tokenized, fraud checks ran, regulatory requirements were met, currency conversions happened. None of it was visible to the developer. It all ran in milliseconds behind those seven lines.

That's not a clever marketing story. That's years of work building banking relationships worldwide, getting licensed in multiple jurisdictions, and building infrastructure that could handle millions of transactions reliably. The simplicity on the surface required an enormous amount of complexity underneath.

---

## The real customer was the developer

Before Stripe, the decision to use a payment processor was usually made by a CFO or finance team. Stripe went around them. They built directly for the developer, the person actually doing the integration.

This was a deliberate choice. Developers are the ones who feel the friction of a bad integration. They're the ones who know, from experience, which tools are a headache and which ones just work. And developers talk to each other. They write about tools they like, recommend them at new jobs, and advocate for them in architecture discussions.

Stripe understood that if they won developers, the sales motion would take care of itself. It largely did. Developers who integrated Stripe at one company carried it to their next. The developer community became Stripe's distribution channel before that term became common.

The API documentation played a big role in this. Stripe's documentation is widely considered the best in the industry. Companies have started using it as a benchmark for their own. Good documentation sounds like table stakes, but most API documentation is written for someone who already understands the system. Stripe's was written for someone trying to get something working. That's a different goal, and it reflected the same principle: remove the friction that stands between someone and the thing they're trying to do.

---

## Proximity to the problem

When you're integrated into the payment flow for tens of thousands of online businesses, you have an unusual view of what those businesses actually struggle with.

Stripe could see that the friction didn't stop at payments. Starting a company involved navigating outdated formation processes. Fraud was a constant problem that required expertise most small businesses didn't have. Marketplaces had to manage payment routing across multiple sellers in ways that existing tools handled poorly.

Each of those was a version of the same problem Stripe had already solved: something genuinely complicated that nobody had made simple yet.

So Stripe built products for each of them. Stripe Atlas handles company formation. Stripe Radar handles fraud detection. Stripe Connect handles marketplace payments and multi-seller routing. Each follows the same pattern: take the hard parts, handle them behind the scenes, and expose a clean interface.

This is what "What else can we simplify?" looks like as a product strategy. Proximity to the problem gave Stripe a continuous view of where friction existed. The trust developers already had in Stripe made adoption of each new product easier. You don't need to convince someone to try your fraud tool if they already trust your payment infrastructure.

---

## Platform strategy through trust

The same playbook shows up across the industry. Apple built trust with consumers through hardware, then expanded into services. Salesforce built trust with salespeople through CRM, then expanded into a platform other companies built on. The pattern is consistent: build something practitioners rely on, earn trust at the individual level, then expand.

Stripe's version of this is notable because developers are a particularly influential group. They make or influence infrastructure decisions. They have opinions that carry weight in engineering and product discussions. And they remember which tools made their lives easier.

The seven lines of code were the entry point. The trust that came from those seven lines being genuinely simple and genuinely reliable is what let Stripe keep expanding. Each new product was an extension of a relationship that started with removing one specific friction.

That's the actual story. Not two brothers and a neat number of lines. A company that figured out which customer to earn trust with first, and then kept finding new ways to be useful to them.
