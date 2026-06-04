# NONA

A free, open-source audit for the app you built with an AI tool and cannot read.

You shipped something with Lovable, Cursor, Bolt, Replit, v0, or Claude Code. It runs. People are starting to use it. And you have no real way to know whether it is safe, because you cannot read the code, and the same kind of AI that wrote it will happily tell you it looks fine. NONA closes that gap. You drop it into your project, your own AI agent runs it, and you get back a plain-language report: what could hurt your business, what to fix first, and the one moment you should stop and pay a human expert.

NONA is licensed CC-BY-4.0. It is plain text you can read yourself before you trust it. See the one-line security note at the bottom.

## What NONA is

Here is the problem NONA was built for. A non-coder who ships an app with an AI tool does not know what they do not know. You cannot ask your agent "is my code safe?" and trust the answer, because you do not know which questions a careful engineer would ask, and you cannot ask your agent the questions you have never heard of. A thumbs-up from the same tool that wrote the code is worth very little.

NONA is the checklist that careful engineer carries around in their head, written down. It holds the audit knowledge an experienced engineer already has, the same knowledge your AI agent can act on the moment it is told what to look for. The whole point is that the audit is never blocked by what you happen to know. You do not need to know what to ask. NONA already asked it, in your place, and handed the questions to your agent.

It covers twelve areas, lettered A through L, and within each it knows three depths of rigor: floor, standard, and extra-mile. The coverage goes deep on purpose, reaching practices that even strong engineering teams treat as extended effort. It stays smart instead of wasteful by reading how much is genuinely at stake in your specific project and turning the rigor up only where the stakes earn it. A payments-and-login app with an AI agent that acts on its own earns the frontier checks. A weekend to-do list earns only the floor. The honest framing: NONA is a translation and selection layer over real, named, dated security authorities, packaged so your agent can run it. It is not original security research, and it does not pretend to be. Every floor and standard check resolves to a published control you can look up.

What NONA is not: a website you visit and paste results back from, a flat security-only checklist, or a substitute for a human expert when the stakes are high. It is a comprehensive audit your own agent runs for free, and it is honest about where its limits are.

## Who it is for

You, if you built and shipped an app with an AI coding tool and cannot read the result. You know what the app is supposed to do. You do not know what a stranger could do to it, what you might be leaking, or what could quietly run up a bill while you sleep. NONA is written in everyday language for exactly that reader. Every technical term gets a one-line plain gloss the first time it appears, with the English word kept (RLS, IDOR, webhook) so you can search on it later. Every risk is stated as a concrete business consequence, not a code label.

NONA is also written for your AI agent, because the agent is the one that runs it. The two audiences share one document: you can read it to understand what is being checked and why it matters to you, and your agent can read the same file and carry out every check.

## How it works

### Drop it in

You add NONA to your project and point your agent at it. Three ways to do that are in the quickstart below. You do not configure anything, you do not sign up, and you do not send your code anywhere. The audit reads your code on your machine and reports back to you.

### Your agent detects the stakes

Before deciding how hard to look, your agent reads your app for six stakes signals. A stakes signal is a concrete, checkable property that means a mistake in that area would actually hurt.

- Money: payments, billing, payouts, or credits worth real cash.
- Identity and login: accounts, sessions, password reset, roles like user versus admin.
- Personal data: the app stores information about real people, such as emails, phones, names, addresses, location, or private messages.
- An AI that acts on its own: an AI feature in your app can send, run code, call a service, or spend, without you approving each action first.
- Blast radius: one failure would hit many people at once, because there are many users, multiple separate customers on one system, or a public way in.
- Irreversibility: an action cannot be undone once it happens, such as a permanent delete, a transfer, a publish, or a send.

Because you may not describe your own app's stakes accurately, your agent also asks you a handful of plain yes-or-no questions to fill any gaps the code did not make obvious. Reading the code is the main source. Your answers catch what the code hid.

### A per-domain, tiered audit

The stakes are local. They raise the rigor only on the area they touch. Money on your checkout page makes the payments audit deep, while your uptime monitoring, which handles no money, stays at its own lower level. For each of the twelve areas your agent picks one of three depths:

- Floor: did anyone do the obvious thing? The non-negotiable baseline every app needs, no matter how small. Skipping it is how an app ships with a wide-open door.
- Standard: what a competent team would do, for an area that holds something real like logins or customer data.
- Extra-mile: the frontier, earned only when the stakes justify it. Adversarial testing that tries to break in, spending caps on AI features, containment that boxes in an AI agent, formal threat modeling.

A few combinations are non-negotiable and override the count. An app where an AI agent can act without a human approving each step forces frontier rigor on its security, its review of the AI-written code, and its attack-simulation plan. Any paid AI call running in production forces a spending cap on day one, because a runaway loop with no ceiling can drain a budget overnight. The rule runs the other way too: if your app has none of the six stakes signals, your agent must not propose bug bounties, chaos drills, or formal uptime targets. Recommending elite practice to a low-stakes app is a failure of judgment, and NONA says so out loud.

One small floor is never skipped, even at zero stakes: use your own app like a real user before you ship, run the free automatic scanners that catch leaked secrets and risky packages, talk through "how could this go wrong" once before launch, and if you make any paid AI call, cap the spend and run one basic check that the AI feature behaves.

### Findings come back as artifacts, not verdicts

Your agent does not get to say "looks secure." It has to produce the actual list of secrets it found and where each one lives, the actual map of who can reach what, the actual result of checking whether a package your AI suggested really exists. A confidence score with nothing behind it manufactures false trust, and false trust is the exact failure NONA exists to fight. Each area returns a findings table with five columns: how serious it is, the business risk in plain words, the evidence behind it, the published control it maps to, and a suggested fix. A check that found nothing is reported as exactly that, an absence of findings, which falls short of "is safe."

### It tells you when to hire a human

The last area gathers every finding into one pile, ranks them by what a mistake would cost your business, and applies clear rules for when an AI audit has reached its limit. For an app that handles money, holds a lot of people's data, can take actions that cannot be undone, or runs an AI agent on its own, the answer is to get an independent human review, and NONA tells you so in writing. For an app that risks little, the honest answer is that you do not need to pay anyone. Knowing which one you are is the point.

## The twelve areas

- A. Intent verification. Does the code do only what you asked, and do it safely. "It works" is a claim about the screen; "it is safe" is a claim about what else the code can do when someone pushes on it.
- B. Secrets, access, RLS, IDOR, auth. The security core: keeping keys hidden and making sure each user reaches only their own data. (RLS, row-level security, is a database rule that limits which rows a user can see. IDOR, insecure direct object reference, is a stranger opening someone else's record by changing a number in the web address.)
- C. Input and injection. Cleaning everything that comes in from the outside, including prompt injection, where hostile text fed to your app's own AI feature hijacks what it does.
- D. Data and privacy. How personal information is stored, kept from leaking, and deleted when it should be.
- E. Payments, monetization, and AI-cost integrity. Charging correctly, blocking billing tricks, and stopping runaway AI spend (denial-of-wallet, where the bill, not the server, is the target). (A webhook is an automated message one service sends another to confirm an event like a payment; a forged one can fake a paid order.)
- F. AI-generated-code patterns and circularity. The signature area: the same kind of AI wrote and is auditing this code, so the usual safety margin of a fresh set of eyes is gone unless you rebuild it on purpose.
- G. Dependencies and supply chain. The outside code your app pulls in, and the risk of a package that does not really exist or was planted to look like one your AI suggested (slopsquatting, where an attacker registers a fake package name that AI tools tend to invent).
- H. Config and deploy hygiene. Settings and launch mistakes: a default password left on, a secret key shipped inside the public part of the app, missing safety headers.
- I. Ops, uptime, backup, rollback. Noticing when something breaks, failing safely, and being able to recover and undo.
- J. Architecture sanity. Whether the overall design is sound: clear lines between what is trusted and what is not, and damage kept contained when one part fails.
- K. Pen-test and professional review. What a real attack simulation should test, and the honest ceiling on what an AI checking AI can find.
- L. Decide and act. Sorting findings by business risk, and a clear rule for when to stop and hire a human.

The full reasoning and the runnable check tables for each area are in the `protocol/` folder, starting with `protocol/00-overview.md`.

## Install and quickstart

Pick the front door that matches your tool. All three run the same audit. None of them sends your code anywhere.

### Option 1: drop in `AGENTS.md` (works with most coding agents)

Copy the file `AGENTS.md` from this repository into the root of your project, alongside the other files your agent already reads. Then open your agent and ask it to audit the app, in any wording ("audit my app", "is this safe to ship", "find what could go wrong"). `AGENTS.md` is the self-contained spine: it carries the whole protocol in compact form and points your agent to the deeper `protocol/` files for any area that needs them.

### Option 2: install the Claude skill

For Claude Code, install the skill under `skills/nona-audit/`. Once it is in place, start a fresh chat and run:

```
/nona-audit
```

That is the whole trigger. You can narrow it if you want (`/nona-audit B` audits one area by its letter, `/nona-audit confirm` answers the stakes questions first), but with nothing after it the agent audits the whole project. Starting a fresh chat matters here, and the next section explains why.

### Option 3: Cursor adapter

For Cursor, copy `adapters/cursor/nona.mdc` into your project's `.cursor/rules/` folder. It is set to run only when you ask for it, not on every edit. Then ask Cursor's agent to audit, review, or security-check the project.

A note that applies to every option: run the audit in a clean, fresh session that has no memory of how the code was built. A review started in a separate session catches measurably more serious bugs than one run in the same chat that wrote the code, and a different AI model is better still, because models from the same family tend to share the same blind spots. This is the cheapest thing you can do to make the audit worth trusting, and NONA's `protocol/02-circularity-guard.md` explains the method in full.

## Evidence summary, with the caveats that keep it honest

NONA rests on published measurements, not on assertion. Read the caveats as part of each number.

The core finding is that working code is not safe code. On a set of 200 realistic, repository-level coding tasks, an AI agent paired with a frontier model produced code that was 61% functionally correct but only 10.5% secure, and adding "be secure" hints to the request did not fix it (the SUSVIBES study, arXiv:2512.03262, December 2025). That last part is why a vague instruction to your agent is not enough and a structured, check-by-check audit is. A separate controlled academic study found that people using an AI coding assistant wrote less secure code and were more likely to believe it was secure (Perry et al., ACM CCS 2023). The human check is miscalibrated upward exactly when AI is involved, which is the reason NONA hands you evidence you can see rather than a confidence score you have to take on faith.

How widespread the insecurity is depends on how you measure it, and the honest answer is a spread, not a single scary number. A commercial security vendor's study (a vendor stat, included because it points the same direction as the independent work) found that 45% of AI-generated samples introduced a known weakness, with the rate flat regardless of model size (Veracode, July 2025). A larger independent scan of 7,703 everyday AI-generated files found a much milder 12.1% carried a mapped weakness (Schreiber and Tippe, arXiv:2510.26103, October 2025). Both are true. The difference is design: the alarming figures come from curated, security-sensitive tasks, which are exactly the surfaces NONA targets, while the milder figure counts ordinary code at large. Present them together. A separate vendor scan of 5,600 publicly reachable AI-built apps reported more than 2,000 vulnerabilities, over 400 exposed secrets, and 175 instances of leaked personal data including medical and bank records, and because the scan did not break anything, those are lower-bound counts (Escape.tech, October 2025, also a vendor stat).

On the method NONA itself uses, the evidence is genuine and bounded. A credible institution named the core problem cleanly: when the same class of AI builds and tests, "the testing agents inherit the same weaknesses as the coding agents" (Stanford Law CodeX, February 2026). A direct experiment then showed that reviewing in a fresh, separate session beats reviewing in the same chat, with the largest gain on critical errors, and that a second pass in the same session bought almost nothing, which isolates context separation as the thing that helps (Cross-Context Review, arXiv:2603.12123, March 2026). The same experiment fixes the ceiling, which is in the next section.

## Honest limits

NONA reduces risk. It does not guarantee safety. Overstating it would hand you the exact false sense of security that gets AI-built apps breached, with an official-looking stamp on it, which is worse than no audit at all because you would stop looking.

- An AI checking AI-written code catches a meaningful slice of serious bugs cheaply, and misses most planted errors when it works alone. In the cleanest measurement available, even the best condition, a fresh separated context, caught only about 28.6% of injected errors by a combined score of bugs found against false alarms raised (Cross-Context Review). Roughly seven in ten survived. That is a useful first pass and a real head start. It is not a safety guarantee.
- An AI audit is not a professional penetration test. A penetration test is a hired human expert who actively tries to break into your running app. Adding a second AI model improves the odds but does not turn the result into one.
- High-stakes apps (real money, lots of users, actions that cannot be undone, an AI agent acting on its own) should still pay for an independent human review. NONA's job is to tell you the day you have crossed that line, in Domain L, not to pretend you have not.
- Some of the alarming headline figures come from vendors with an incentive to alarm. Where a number is a vendor stat, this project labels it as one and cites the independent academic counterweight beside it. The full evidence corpus, with every source and caveat, is in `docs/why-nona-exists.md`, and the standards behind every check are mapped in `CITATIONS.md`.

## License

NONA is released under the Creative Commons Attribution 4.0 International license (CC-BY-4.0). You are free to use, share, adapt, and build on it, including commercially, as long as you give appropriate credit. The full text is in `LICENSE`.

## Security

NONA is itself a file your agent ingests as trusted instructions, so it is built to be the safe link and to be read before it is run; the integrity guidance, including how to verify the copy you have is genuine, is in `SECURITY.md`.
