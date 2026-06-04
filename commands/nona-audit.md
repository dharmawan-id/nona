# /nona-audit

The slash command that starts a NONA audit. You type it; your AI agent runs the whole protocol and hands back a plain-language report.

NONA is a free audit protocol for people who built an app with an AI coding tool (Lovable, Cursor, Bolt, Replit, v0, Claude Code) and cannot read the code. This page is the spec for the trigger: what you type, what the agent does after you type it, and what you get back. The audit knowledge itself lives in the `protocol/` files; this command just sets the agent loose on them in the right order.

## What you type

In an agent that supports slash commands (such as Claude Code), type:

```
/nona-audit
```

That is the whole trigger. You do not need to know which checks apply to your app or which questions a security engineer would ask. The point of NONA is that you do not have to. The protocol already holds the questions, and this command tells your agent to work through them on your code, in your place.

Optional ways to narrow or widen the run, for builders who want them (each is optional; with none of them, the agent audits the whole repo):

```
/nona-audit B            # audit one area only, by its letter (here, Domain B: secrets, access, auth)
/nona-audit B,E,G        # audit a few areas, comma-separated
/nona-audit confirm      # answer the five stakes questions first, then audit
```

The letters are the twelve areas NONA covers, A through L. They are listed at the bottom of this page and explained in full in `../protocol/00-overview.md`.

## What the agent does after you type it

The command runs the protocol in a fixed order. The steps below are what your agent carries out so you can see there is no guesswork in it.

### Step 0. Run from a clean, separate session

Before anything else, the agent should run this audit in a fresh context with no memory of why the code was written the way it was. A review that starts from the build conversation tends to wave through the same mistakes the build made, because the inspector and the author are the same mind looking at the same code the same way. A separated context is measured to catch meaningfully more critical bugs, and a different model family is better still. The full reasoning is in `../protocol/02-circularity-guard.md`. In practice: start the audit in a new conversation, not as a continuation of the build, and use a different model from the one that wrote the app where you can.

If you type `/nona-audit` inside the same session that built the app, the agent should say so plainly and recommend you re-run it from a clean context (and ideally a different model) before you trust the result.

### Step 1. Work out what is at stake

The agent reads your repository for six stakes signals, the concrete properties that decide how hard each area gets audited:

- S1 Money. Payments, billing, payouts, or credits worth real cash.
- S2 Identity/Auth. Login, sessions, password reset, or roles. ("Auth" is short for authentication and authorization: proving who someone is, and deciding what they may do.)
- S3 Personal data. The app stores personal information about real people (email, phone, name, location, health, private messages).
- S4 Autonomy. An AI agent in your app can take actions on its own (send, run, call, spend) without a human approving each one.
- S5 Blast radius. One failure hits many people at once: many users, multiple separate customers on the same system, a public API.
- S6 Irreversibility. An action cannot be undone once it happens (delete, transfer, publish, send).

Reading the code is the primary source, because code does not misremember. To fill the gaps a non-coder may not describe accurately, the agent also asks you five plain questions and records your answers as part of the audit: does your app touch money; do people log in; do you store anything about real people; can the AI in your app act on its own (and are any actions impossible to undo); if something broke, how many people would it hit. The exact questions and the full procedure are in `../protocol/01-stakes-gating.md`. (Typing `confirm` makes the agent ask these up front; otherwise it asks them as part of the run.)

### Step 2. Decide the depth of each area, separately

Stakes are local. The agent computes a tier for each of the twelve areas on its own, looking only at the signals that touch that area's surface:

- No stakes signal on an area: floor ("did anyone do the obvious thing").
- Exactly one signal, and not autonomy (S4) or irreversibility (S6): standard ("what a competent team would do").
- Two or more signals, or any autonomy or irreversibility signal at all: extra-mile (the frontier, the rigor even strong teams treat as extended effort).

A few hard overrides sit above that count and the agent applies them no matter what: any autonomous agent (S4) forces extra-mile on B (security), F (AI-generated-code patterns), and K (pen-test); any money (S1) or irreversible action (S6) forces at least standard on D (data and privacy) and E (payments and AI cost); and any paid AI API call running in production forces spending caps at the floor, on day one, because a runaway loop can drain a budget overnight.

The same rule runs the other way, and the agent is bound by it. If your app has none of the six stakes signals, the agent must not propose bug bounties, chaos drills, formal uptime targets, or fuzzing campaigns. It recommends only the floor. Pushing elite practice onto a low-stakes app is a failure of judgment, not diligence. A small universal floor still applies to every app: use your own app like a real user before shipping, run the free automatic scanners for leaked secrets and risky dependencies, talk through "how could this go wrong" once, and cap the spend on any paid AI call.

### Step 3. Run each area and produce evidence, not verdicts

For every area in scope, the agent works through that area's file (`../protocol/<letter>-<slug>.md`) at the tier the gate assigned, and it produces the actual artifacts the file names rather than a thumbs-up. The real list of secrets and where each lives. The real map of who can reach which data and where that is enforced on the server. The real result of checking that every imported package exists and is the one intended. A confidence score with nothing behind it manufactures false trust, and false trust is the failure NONA exists to fight. Evidence you can point at beats a number you have to believe.

Every finding is translated into a concrete business consequence in everyday words. Not "IDOR present" but "a stranger can open any other customer's invoices by changing a number in the address bar."

### Step 4. Decide and act (Domain L)

Last, the agent runs Domain L over the whole pile of findings from every area. It collects them into one list, ranks them by business risk (how likely a mistake is, multiplied by how badly it would hurt), records a decision for each finding it is not fixing immediately, and applies an explicit rule for the one moment that matters most to a non-coder: when to stop fixing things yourself and pay a human to look. The full method is in `../protocol/l-decide-and-act.md`.

## What you get back

The agent's output has two parts.

A findings table, with these columns and nothing weaker than evidence in any row:

```
| Severity | Business risk in plain words | Evidence artifact | Citation | Suggested fix |
```

Each row carries the actual artifact that proves the finding, the plain business consequence, the published control it maps to, and a concrete fix. "Looks secure" is not a finding. A check the agent could not complete is marked INCOMPLETE rather than passed.

A decision summary, from Domain L, that turns the table into a plan:

- the ranked list, highest business risk first, each top item in one plain sentence;
- a disposition for every finding (fix now, fix later by a stated date, or knowingly accept, each with a one-line reason);
- a residual-risk statement that says what was checked and came back clean (worded as "found nothing," which is an absence of findings, not a proof of safety), and what could not be checked this way at all;
- a hire-a-human verdict: proceed, or get an independent human review, stated in plain words with the reason.

## The honest limit (the agent states this in the report)

NONA reduces your risk. It does not guarantee your safety. An AI checking AI-written code catches a meaningful slice of serious bugs cheaply, and in the cleanest measured tests it misses most planted bugs when it works alone (roughly seven in ten survived even the best condition). That is a real gain at a real limit. It is not a substitute for a professional penetration test by a human. High-stakes apps (money, lots of users, irreversible actions, an AI agent that acts on its own) should still pay for an independent human review, and Domain L tells you the day you have crossed into that territory. The evidence behind these claims, with its caveats, is in `../docs/why-nona-exists.md`.

## Before you run it: trust the file first

NONA is itself an instruction file your agent reads, the exact kind of file an attacker targets. So treat it the way NONA treats your code. NONA only ever tells the agent to read your own code and report; it never tells an agent to fetch and run anything from the internet. Before you rely on a copy, pin a version, check the file against the published hash, and treat any third-party fork or repackaging as untrusted until you have read it. It is plain markdown on purpose so you, or anyone you trust, can read it first. The full guidance is in `../SECURITY.md`.

## How this command relates to the other formats

This slash command, the cross-agent entrypoint (`../AGENTS.md`), and the Claude Skill (`../skills/nona-audit/SKILL.md`) are three doors into the same protocol. They use the same twelve areas (A to L), the same three tiers (floor, standard, extra-mile), and the same six stakes signals (S1 to S6). They never diverge, because all of them are derived from the `protocol/` files, which are the single source the audit content is authored in. If a check changes, it changes in `protocol/` and the formats are re-emitted from it; the discipline that keeps them in step is described in `../adapters/README.md`.

## The twelve areas, for reference

You can pass any of these letters to audit one area only.

- A. Intent verification: does the code do only what you asked, safely.
- B. Secrets, access, RLS, IDOR, auth: the security core.
- C. Input and injection: including prompt injection on your app's own AI features.
- D. Data and privacy: how personal information is stored, kept from leaking, and deleted.
- E. Payments, monetization, and AI-cost integrity: charging correctly, blocking billing tricks, stopping runaway AI spend.
- F. AI-generated-code patterns and circularity: working around the missing safety margin when the same kind of AI wrote and is checking the code.
- G. Dependencies and supply chain: outside code you pull in, and packages that do not really exist or were planted to look like ones your AI suggested.
- H. Config and deploy hygiene: settings and launch mistakes, default passwords, a secret shipped to the browser, missing safety headers.
- I. Ops, uptime, backup, rollback: noticing breakage, failing safely, recovering.
- J. Architecture sanity: sound boundaries between trusted and untrusted, damage kept contained.
- K. Pen-test and professional review: what a real attack-simulation tests, and the honest ceiling of an AI checking AI.
- L. Decide and act: ranking findings by business risk, and the clear rule for when to hire a human.

Full explanations of every area are in `../protocol/00-overview.md`.
