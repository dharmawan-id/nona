# NONA: Overview

NONA is a free, open-source audit protocol for people who built an app with an AI coding tool (Lovable, Cursor, Bolt, Replit, v0, Claude Code) and cannot read the code that came out. You drop it into your project. Your own AI agent runs it. You get back a plain-language report of what could go wrong for your business, what to fix first, and the one moment where you should stop and pay a human expert.

This page explains the idea behind NONA, why it exists, how it stays comprehensive without wasting your time on things your app does not need, the twelve areas it covers, and how to read each area's file.

## The premise

Here is the gap NONA was built to close. A non-coder who ships an app with an AI tool does not know what they do not know. You cannot ask your agent "is my code safe?" and trust the answer, because you do not know which questions a careful engineer would ask, and a thumbs-up from the same tool that wrote the code is not proof of anything. You do not have the checklist in your head. You do not even know the checklist exists.

NONA is that checklist, written down. It carries the audit knowledge a competent engineer already has, the same knowledge your AI agent can act on once it is told what to look for. The point is that the audit is never blocked by what you happen to know. You do not need to know what to ask. NONA already asked it, in your place, and handed the questions to your agent.

A second, sharper problem sits underneath the first. The same kind of AI that wrote your code is the one you are now asking to check it. When the builder and the reviewer share the same blind spots, the reviewer waves through the exact mistakes the builder made. NONA treats that circularity as a first-class problem and gives your agent a method to work around it. That method has its own page (`02-circularity-guard.md`) and runs through the whole protocol.

## What makes NONA different

Plenty of vibe-coding security tools exist as of June 2026. Scanners check your live site for known patterns and hand you a fix to paste back. Open-source checklists list security rules your agent can read. Human auditors will review your app for a few hundred to a few thousand dollars per pass. Each one is useful. Each one covers a slice.

NONA sits at an intersection that, as of June 2026, no existing tool occupies:

- Free and open-source. You can read every line of it. It is plain markdown on purpose, so you (or anyone you trust) can audit the auditor before running it.
- Made for your AI agent to consume and run, not a website you visit or a PDF you print.
- Comprehensive across twelve areas (A through L below), not security alone. The bugs that actually sink AI-built apps are often logic and business-rule mistakes that a security scanner is built to miss: a checkout that can be tricked into charging zero, a delete button that wipes the wrong account, an AI feature that runs up a four-figure bill overnight.
- Tiered. Three levels of rigor (floor, standard, extra-mile) so the depth of the audit matches the real risk of your app.
- Written for someone who cannot read code. Every technical term gets a one-line plain gloss the first time it appears. Every risk is stated as a concrete business consequence in everyday words.
- Bilingual by design. English is complete now. An Indonesian layer comes next, at the same depth, so the meaning survives the translation instead of being a thin afterthought.

The honest framing of what NONA is: a translation and selection layer over real, named, dated security authorities, packaged so your agent can run it. It is not original security research, and it does not pretend to be. Every floor and standard check resolves to a published control you can look up. The map of those controls lives in `../CITATIONS.md`.

## How the tiers and the stakes-gate work together

The hard part of a comprehensive audit is that comprehensive can easily mean wasteful. If NONA ran every elite practice on every app, it would tell the person who built a weekend to-do list to set up bug bounties and chaos drills. That is not diligence. That is gold-plating, and it would teach you to ignore the report.

NONA solves this with two pieces that work together: three tiers of rigor, and a gate that decides which tier each area earns.

The three tiers:

- Floor. "Did anyone do the obvious thing?" The non-negotiable baseline every app needs, no matter how small. Skipping the floor is how apps ship with a wide-open door.
- Standard. "What a competent team would do." The level a careful professional would expect for an app that handles real stakes like logins or customer data.
- Extra-mile. The frontier. Practices that even strong engineering teams treat as extended, optional effort: adversarial penetration testing, AI cost guardrails, containment patterns that box in an AI agent, formal threat modeling. NONA treats this tier as a fully built-out star and earns it only when the stakes justify it.

The gate that assigns the tiers reads your app for six stakes signals: real money, login and identity, personal data, an AI that can act on its own, a large blast radius (many users or shared infrastructure), and actions that cannot be undone. The full list, with exact definitions, is on the next page (`01-stakes-gating.md`). The signals are local. They escalate only the area they touch. Money on your payments page raises the rigor on payments, not on, say, your uptime monitoring.

So the logic runs like this. An area with no stakes signal on it gets the floor and stops there. An area with one signal (and not the riskiest kinds) climbs to standard. An area with serious or stacked stakes earns the extra-mile. A few combinations are non-negotiable: an app where an AI agent can take actions without a human approving each one forces extra-mile rigor on its security, its AI-code review, and its penetration-test plan. Any paid AI API call running in production forces cost guardrails on day one, at the floor, because a runaway loop can drain a budget while you sleep.

That is what keeps the comprehensiveness smart. NONA knows every area from floor to frontier, including the elite practices, and then applies only the rigor your actual risk demands. The protocol states the opposite case out loud too: if your app has none of the six stakes signals, your agent must not propose bug bounties, chaos engineering, formal uptime targets, or fuzzing campaigns. Recommending elite practice to a low-stakes app counts as a failure of judgment.

One small floor is never skipped, even at zero stakes: use your own app like a real user before you ship, run the free automatic scanners that catch obvious leaked secrets and risky dependencies, talk through "how could this go wrong" once before launch, and if you make any paid AI call, cap the spend and run one basic check that the AI feature behaves.

## The twelve areas (A to L)

NONA covers twelve areas. The letters are fixed. Each has its own file in this folder.

- A. Intent verification. Does the code do only what you asked, and do it safely. "It works" is not the same as "it is safe."
- B. Secrets, access, RLS, IDOR, auth. The security core: keeping keys hidden, and making sure each user can reach only their own data. (RLS, row-level security, is a database rule that limits which rows a user can see. IDOR, insecure direct object reference, is when a stranger opens someone else's record by changing a number in the web address.)
- C. Input and injection. Cleaning everything that comes in from the outside world, including prompt injection, where hostile text fed to your app's own AI feature hijacks what it does.
- D. Data and privacy. How personal information is stored, kept from leaking, and deleted when it should be.
- E. Payments, monetization, and AI-cost integrity. Charging correctly, blocking billing tricks, and stopping runaway AI spend (a "denial-of-wallet" attack, where the bill, not the server, is the target). (A webhook is a message one service sends another to confirm an event, like a payment going through; a forged one can fake a paid order.)
- F. AI-generated-code patterns and circularity. The signature area: the same kind of AI wrote and is auditing this code, so the usual safety margin of a fresh set of eyes is gone unless you rebuild it on purpose.
- G. Dependencies and supply chain. The outside code your app pulls in, and the risk of a package that does not really exist or was planted to look like one your AI suggested ("slopsquatting", where an attacker registers a fake package name that AI tools tend to hallucinate).
- H. Config and deploy hygiene. Settings and launch mistakes: default passwords left on, a secret key shipped inside the public part of the app, missing safety headers.
- I. Ops, uptime, backup, rollback. Noticing when something breaks, failing safely, and being able to recover and undo.
- J. Architecture sanity. Whether the overall design is sound: clear boundaries between what is trusted and what is not, and damage kept contained when one part fails.
- K. Pen-test and professional review. What a real attack-simulation should test, and the honest ceiling on what an AI checking AI can find.
- L. Decide and act. Sorting findings by business risk, and a clear rule for when to stop and hire a human.

## How to read a domain file

Every area file (A through L) is laid out the same way, so once you have read one you can read them all. In order, each file gives you:

- What this is. Two to four plain sentences on what the area covers.
- What you can't see here. The specific blind spot for this area: what you, and a naive self-check by your own agent, would miss, and why.
- When this matters. Which of the six stakes signals raise this area above the floor, and what level it lands on.
- Floor, standard, and extra-mile checks. Three tables, one per tier. Each row is a single check written as an instruction your agent can carry out, paired with why it matters to your business in plain words, the evidence your agent must produce, and the published control it maps to. The extra-mile rows also name the stakes signal that earned them and the frontier practice they apply.
- When to stop and hire a human. The line, for this area, where an AI audit has reached its limit and an independent human review is the right next step.
- Agent instructions. The block NONA hands your agent to actually run the area: scope it to your stakes signals, run in a clean separate session where circularity matters, produce the listed evidence, and return a findings table (severity, the business risk in plain words, the evidence, the control it maps to, and a suggested fix).

Two rules run through every file and are worth holding in mind as you read.

First, NONA demands artifacts, not verdicts. Your agent does not get to say "looks secure." It has to produce the actual list of secrets it found, the actual map of who can reach what, the actual result of checking whether a suggested package really exists. A confidence score with nothing behind it manufactures false trust, and false trust is the very failure NONA exists to fight. Evidence you can see beats a number you have to take on faith.

Second, NONA is honest about its own ceiling. An AI checking AI-written code catches a meaningful slice of serious bugs cheaply, and in measured tests it misses most planted errors when it works in isolation. That is a real gain at a real limit. It is not a replacement for a professional penetration test, and where a study comes from a vendor with a reason to alarm you, NONA says so and cites the independent academic counterweight beside it. The evidence behind these claims, with its caveats, is collected in `../docs/why-nona-exists.md`. The honest-limits stance is in `../README.md`. The plain-language glossary for every technical term is in `../docs/glossary.md`.

NONA reduces your risk. It does not guarantee your safety. Read it, run it, fix what it finds, and pay for the human audit on the day Domain L tells you to.
