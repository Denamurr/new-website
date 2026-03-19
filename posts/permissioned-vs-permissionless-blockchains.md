---
title: "Who Gets Access?"
date: "2024-03-01"
slug: "permissioned-vs-permissionless-blockchains"
---

Every platform has to answer a foundational question: who gets to participate, and who decides?

Open an App Store developer account and Apple reviews your app before anyone can download it. Publish an npm package and it goes live the moment you push it. Use Stripe's API and Stripe decides whether your business is eligible. Build on Ethereum and no one can stop you from deploying code.

These are access control decisions. Blockchains make the same kind of decision, and the choice shapes everything downstream: how the network performs, who can build on it, and what it can actually be used for.

---

## Permissionless blockchains

A permissionless blockchain has no gatekeeper. Anyone with an internet connection can run a node, validate transactions, deploy a smart contract, or send funds. No account required. No approval process.

Bitcoin and Ethereum are the main examples. They were designed this way deliberately. The goal was a financial system that couldn't be shut down or censored by any single party, including governments and corporations. The only requirement to participate is that you follow the protocol rules.

The tradeoff is performance. Reaching consensus across thousands of anonymous nodes takes time. Bitcoin processes around 7 transactions per second. Visa handles tens of thousands. When a permissionless network gets congested, fees spike and transactions slow down because the network has no way to prioritize or restrict traffic.

Security is also a constant concern. Because anyone can participate, that includes bad actors. The network defends against this through cryptographic incentives rather than trust in known participants.

What you get in exchange is genuine openness. No entity can block you from using the network, freeze your assets, or prevent someone from building a competing product on the same infrastructure. The platform is neutral by design.

---

## Permissioned blockchains

A permissioned blockchain restricts who can join and what they can do. Participation requires an invitation or approval. Once inside, roles are assigned: some participants can validate transactions, some can only read data, some can do both.

This is the model used by most enterprise blockchain deployments. A consortium of banks might run a shared ledger where only the member banks can validate transactions. A supply chain network might allow manufacturers, logistics companies, and retailers to all write to the same chain, but each limited to their own domain.

Because the participants are known and trusted, the network can reach consensus much faster. You don't need to solve for anonymous bad actors when everyone is a verified entity with a legal agreement in place. Throughput is higher and latency is lower.

The cost is that the platform is only as trustworthy as whoever controls access. If one organization runs the permissioning system, they have real power over who participates and on what terms. That's not inherently bad, but it's worth being clear-eyed about. A permissioned blockchain isn't decentralized in any meaningful way. It's a shared database with cryptographic audit trails and a governance layer on top.

---

## The product decision underneath the technical one

Choosing between permissioned and permissionless is really a decision about what you need the platform to do and who you need to trust.

If the goal is to build a system where participants don't know or trust each other, and where no central authority can intervene, permissionless is the right architecture. That's why crypto trading and decentralized finance live there. The openness isn't a side effect, it's the product.

If the goal is efficiency, privacy, and control within a defined group of known participants, permissioned makes more sense. A regulated industry sharing sensitive data across competitors doesn't need or want a public ledger. The trust problem is already solved through contracts and compliance.

Most blockchain projects that fail do so partly because they picked the wrong model for the problem. A permissioned system built for a use case that actually requires openness, or a permissionless system applied to a problem that needs speed and privacy, will always fight against its own design.

The question isn't which is better. It's which access model fits the platform you're actually trying to build.
