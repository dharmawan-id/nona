---
name: nona-audit
description: Use when someone asks to audit, security-check, or review an app that was built with an AI coding tool (Lovable, Cursor, Bolt, Replit, v0, Claude Code, Codex, Windsurf, Copilot, Antigravity, and others) or otherwise vibe-coded, especially when the person who built it cannot read the code. Runs a free, comprehensive, plain-language audit across twelve areas (security, data, payments, AI cost, dependencies, deploy, ops, architecture, and more), scaled to the app's real stakes, and tells the builder when to stop and hire a human. Triggers on "audit my app", "is my app safe", "security review", "check the code my AI wrote", "/nona-audit".
---

# NONA audit skill

This skill runs the NONA audit. NONA is a free, open-source protocol for someone who built an app with an AI coding tool and cannot read the code that came out. The builder drops NONA into the project, an AI agent runs it, and the builder gets back a plain-language report: what could go wrong for their business, what to fix first, and the one moment to stop and pay a human expert.

The point of this skill is that the builder does not need to know what to ask. The protocol already carries the questions a careful engineer would ask. The agent reads the code, asks the builder a few plain questions to fill the gaps, scales the depth of the audit to the app's real risk, and reports findings as evidence the builder (or a human they hire later) can check.

## When this skill runs

Run it when a user asks any of these, in any wording:

- "Audit my app" or "audit this repo" or "review my code."
- "Is my app safe" or "is this secure" or "did my AI build this safely."
- "Security-check the thing I built with Lovable / Cursor / Bolt / Replit / v0 / Claude Code / Codex / Windsurf / Copilot / Antigravity."
- "Check the code my AI wrote, I can't read it."
- The explicit trigger: `/nona-audit`.

The defining case is a non-coder who shipped an app with an AI tool and wants to know what is wrong with it before more people use it. Treat the user as someone who cannot read code unless they tell you otherwise. Define every technical term in one short plain gloss the first time it appears, and keep the English headword (RLS, IDOR, webhook) so the user can search on it later. State every risk as a concrete business consequence, never as a code label on its own.

## What the skill does, start to finish

The audit has five steps. Walk them in order.

### Step 1. Separate the review from the build (the circularity guard)

Before reading any code, establish that this audit is a fresh, separate review rather than a continuation of whatever session built the app.

The reason matters and the user should hear it once, in plain words: the same kind of AI that wrote the code is now being asked to check it, and a checker tends to be blind to the same things the builder was blind to. A review started in a clean, separate session catches measurably more critical bugs than one run in the same chat that wrote the code, and a different AI model (a different lineage) is better still, because it is more likely to be blind to different things. The full method is in `protocol/02-circularity-guard.md`. Apply it:

- Confirm this audit is not running as a continuation of the build conversation. If it is, tell the user to start a fresh session (a new chat with no build history) and run the audit there.
- If you can tell which model built the app, and you are the same model family, say so plainly and recommend the user re-run the high-stakes areas on a different model. Do not claim a specific catch rate from doing this. It is a recommendation, not a promise.
- Record a short context-separation note as the first artifact of the audit: confirmation that the review ran in a clean context, and which model built versus which model is auditing.

### Step 2. Find the stakes (scale the audit to the real risk)

NONA is comprehensive on purpose: it knows all twelve areas from the floor to the frontier, including practices strong engineering teams treat as extra effort. Running every elite practice on every app would be wasteful and would teach the user to ignore the report. So the audit scales itself. It reads the app for six stakes signals and turns the rigor up only where the signals earn it.

The six signals (full definitions in `reference/stakes-signals.md` and `protocol/01-stakes-gating.md`):

- S1 Money, S2 Identity/Auth, S3 Personal data, S4 Autonomy (an AI agent can act on its own), S5 Blast radius (many users or shared infrastructure), S6 Irreversibility (an action cannot be undone).

Detect them two ways and use both:

- Read the repository. This is the primary source, because code does not misremember. Look for payment libraries and webhook handlers, login and session and role code, database fields holding personal information, code where an AI agent calls tools without a human gate, signs of multiple customers on one system or a public API, and actions that permanently delete, transfer, publish, or send.
- Ask the user the five plain confirmation questions in `protocol/01-stakes-gating.md`, because a non-coder may not describe their own app's stakes accurately. Treat a "yes" as a signal present even if the code did not obviously show it. Record the answers as part of the audit.

### Step 3. Decide the depth, one area at a time

Stakes are local. A signal escalates only the area it touches. Compute a tier for each of the twelve areas separately using only the signals on that area's surface. The three tiers are floor, standard, and extra-mile (quick table in `reference/tiers.md`). The exact procedure:

```
for each domain A through L:
  signals_here = the stakes signals (S1 to S6) present on THIS domain's surface
  if signals_here == 0:                          tier = FLOOR
  elif signals_here == 1 and not (S4 or S6):     tier = STANDARD
  else:                                          tier = EXTRA_MILE
```

Then apply the hard overrides, which escalate on principle no matter what the count says (full text in `protocol/01-stakes-gating.md`):

- Any S4 (an AI agent acts on its own) forces extra-mile on B (security), F (AI-generated-code patterns), and K (pen-test): sandboxing, least-privilege, a prompt-injection red-team, and at least one containment pattern.
- Any S1 (money) or S6 (irreversible action) forces at least standard on D (data and privacy) and E (payments and AI cost); extra-mile if it also has S5 (blast radius).
- Any paid AI API call running in production forces cost guardrails at the floor, on day one. A runaway loop can drain a budget overnight.

Honor the anti-over-engineering rule. If the app has zero stakes signals, do not propose bug bounties, chaos engineering, formal uptime targets, canary releases, or fuzzing campaigns. Recommend only the floor. Pushing elite practice on a low-stakes app is a failure of judgment, not diligence. The universal floor still applies to every app: use the app like a real user before shipping (dogfooding), run the free automatic scanners for leaked secrets and risky dependencies, hold one "how could this go wrong" pre-mortem conversation, and if the app makes any paid AI call, cap the spend and run one basic check that the AI feature behaves.

### Step 4. Run the twelve areas at their assigned depth

For each area, load its file from `protocol/` and run the checks for the tier the gate assigned (floor, standard, or extra-mile). Each domain file holds three check tables, a "when to stop and hire a human" line for that area, and a runnable agent-instructions block. Run the agent-instructions block for the assigned tier and produce the artifacts it names.

The twelve area files (the letters are fixed):

- A. Intent verification: `protocol/a-intent.md`
- B. Secrets, access, RLS, IDOR, auth: `protocol/b-secrets-access-auth.md`
- C. Input and injection: `protocol/c-input-injection.md`
- D. Data and privacy: `protocol/d-data-privacy.md`
- E. Payments, monetization, and AI-cost integrity: `protocol/e-payments-ai-cost.md`
- F. AI-generated-code patterns and circularity: `protocol/f-ai-code-circularity.md`
- G. Dependencies and supply chain: `protocol/g-dependencies-supply-chain.md`
- H. Config and deploy hygiene: `protocol/h-config-deploy.md`
- I. Ops, uptime, backup, rollback: `protocol/i-ops-uptime-backup.md`
- J. Architecture sanity: `protocol/j-architecture.md`
- K. Pen-test and professional review: `protocol/k-pentest.md`
- L. Decide and act: `protocol/l-decide-and-act.md`

Two rules bind every area and you do not get to break them:

- Artifacts, not verdicts. The agent does not get to say "looks secure." It produces the actual secret list, the actual map of who can reach what, the actual result of checking that a suggested package really exists. A confidence score with nothing behind it manufactures false trust, and false trust is the failure this protocol exists to fight. Evidence the user can see beats a number they have to take on faith.
- Cite only the published controls named in each domain file and in `../CITATIONS.md`. Do not invent control IDs. Where a control number is fragile across versions, state its plain meaning and cite the standard at the document level rather than printing an unverified number.

For every area, output a findings table with these columns:

```
| Severity | Business risk in plain words | Evidence artifact | Citation | Suggested fix |
```

If a check demands an artifact you cannot produce, say so and mark that check INCOMPLETE rather than guessing or asserting it passed.

### Step 5. Triage and the hire-a-human decision (Domain L)

Domain L (`protocol/l-decide-and-act.md`) closes the audit. It collects every finding from all twelve areas into one list, ranks them by business risk (how likely a mistake is, multiplied by how badly it would hurt), records an explicit decision for every finding the user is not fixing immediately, and applies the written rule for when to stop and hire a human.

This is where over-trust bites hardest, so handle it carefully. A clean-looking report manufactures a calm the facts have not earned; in a measured oversight study, when reviewers missed an error their confidence went up rather than down. Present the ranked consequences and the evidence, never a bare reassurance. Report a check that found nothing as exactly "found nothing," which is an absence of findings and falls short of "is safe."

End the audit with the honest ceiling stated plainly: an AI checking AI-written code catches a meaningful slice of serious bugs cheaply and misses most planted errors when it works alone (in the cleanest measurement available, even the best separated-context condition caught only about 28.6% of injected errors by F1). It is a cheap, valuable first pass. It is not a substitute for a professional penetration test, which is a hired human expert who actively tries to break into the app. For an app that handles money, holds many people's personal data, takes actions that cannot be undone, or runs an AI agent that acts on its own, route the user to an independent human review and say so in plain words. The evidence behind these numbers, with its measurement caveats, is in `docs/why-nona-exists.md`.

## What this skill loads and when

Load on demand, not all at once, to keep the working context clean:

- Always, at the start: `protocol/00-overview.md` (the idea and how to read a domain file), `protocol/01-stakes-gating.md` (the six signals, the per-area procedure, the overrides, the five questions), and `protocol/02-circularity-guard.md` (how to run the review as a separate, fresh mind).
- The two quick cards in this skill's `reference/` folder, for fast lookup without re-reading the long protocol files:
  - `reference/tiers.md`: floor / standard / extra-mile at a glance, what each level means and what it cites.
  - `reference/stakes-signals.md`: S1 to S6 at a glance, with the gate rule and the hard overrides.
- Per area, when you reach it in Step 4: that area's file from `protocol/` (the list above). Load each as you run it rather than all twelve up front.
- The citation map, `../CITATIONS.md`, when you need the exact version or date of a control you are citing.

## The /nona-audit trigger

`/nona-audit` runs this skill end to end on the current repository: separate the review, find the stakes, decide the per-area depth, run the twelve areas at their assigned tiers, and finish with Domain L triage and the hire-a-human decision. The slash-command spec lives in `commands/nona-audit.md`. The user can also scope it, for example "run NONA on the payments area only" or "just the floor checks", and the skill runs the requested subset against the same stakes gate.

## A note on trusting NONA itself

NONA is an instruction file an agent reads, which is exactly the file class attackers target. NONA is built so it is safe to run: it only ever instructs the agent to read the builder's own code and report what it found. It never tells an agent to fetch and run remote content, send data anywhere, ask for more access than reading code needs, or change the system. It ships as plain markdown so anyone can read every instruction before running it. Before trusting any copy, the user should read it, pin a specific version, verify the file hash against the published one, treat any third-party fork or repackaged skill as untrusted until reviewed, and never wire the audit to act on untrusted outside content. The full guidance is in `../SECURITY.md`.
