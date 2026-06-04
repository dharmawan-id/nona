# The three tiers at a glance

NONA runs each of the twelve areas at one of three depths. The stakes gate decides which depth each area earns (see `stakes-signals.md`). This card is the quick reference; the full definitions and the exact controls each tier cites are in `../../../protocol/01-stakes-gating.md` and `../../../CITATIONS.md`.

The plain idea: floor is the obvious thing every app needs, standard is what a competent team would do, and extra-mile is the frontier that even strong teams treat as extra effort. The depth matches the risk. A weekend to-do app earns the floor. A payments app with logins and an AI that acts on its own earns the extra-mile where it counts.

| Tier | Plain meaning | When an area earns it | What it cites (examples) |
|---|---|---|---|
| **Floor** | "Did anyone do the obvious thing?" The non-negotiable baseline for any app, no matter how small. Skipping it is how an app ships with a wide-open door. | Every area gets at least the floor. An area with no stakes signals on it gets the floor and stops there. | OWASP Top 10:2025 (none present), OWASP ASVS 5.0 Level 1, CIS Level 1, the LLM Top 10 floor (some prompt-injection mitigation, no obvious leaked secret or personal data, a usage cap exists), no secret in the public part of the app or in code history, and the vendor production basics (RLS on, the master database key never in the browser, SSL). |
| **Standard** | "What a competent team would do." The level a careful professional expects once the app handles something real, like logins or customer data. | An area with exactly one stakes signal that is not autonomy (S4) or irreversibility (S6). Also forced onto data and payments by any money (S1) or irreversible action (S6). | OWASP ASVS 5.0 Level 2, the full OWASP API Security Top 10 2023 (access-by-record and access-by-role checks, business-flow abuse), the full LLM Top 10 2025, NIST secure-development practices (threat model, vet third-party code, the find-and-fix vulnerability loop), the NIST AI risk framework (map, measure, manage), and proper logging and error handling. |
| **Extra-mile** | The frontier. Practices even strong engineering teams treat as extended, optional effort. NONA builds this tier out fully and earns it only when the stakes justify it. | An area with two or more stakes signals, or any autonomy (S4) or irreversibility (S6) signal at all. Forced by the hard overrides below. | OWASP ASVS Level 3, the higher supply-chain build levels, CIS Level 2, a formal threat model plus an adversarial penetration test, containment patterns that box in an AI agent (a separate model that only picks safe actions, plan-then-execute separation), evals and golden test suites, AI cost guardrails, model fallback chains, agent sandboxing and least-privilege, output-verification, provenance logs for AI-written code, review by a different model as policy, chaos drills, error budgets, fuzzing, and a bug-bounty or responsible-disclosure program. |

## The hard overrides (escalate no matter what the count says)

- Any **S4** (an AI agent acts on its own) forces **extra-mile** on **B** (security), **F** (AI-generated-code patterns), and **K** (pen-test): sandboxing, least-privilege, a prompt-injection red-team, and at least one containment pattern.
- Any **S1** (money) or **S6** (irreversible action) forces at least **standard** on **D** (data and privacy) and **E** (payments and AI cost); **extra-mile** if combined with **S5** (blast radius).
- Any **paid AI API call running in production** forces **cost guardrails at the floor**, on day one.

## The anti-over-engineering rule

If the app has zero stakes signals, recommend only the floor. Do not propose bug bounties, chaos engineering, formal uptime targets, canary releases, or fuzzing campaigns for an app that risks nothing. Over-applying elite practice to a low-stakes app is a failure of judgment.

## The universal floor (never skipped, even at zero stakes)

Every app, including the trivial ones, gets these four, because they cost almost nothing and the builder usually did not know they were a normal, named thing to do:

1. Dogfooding: use the app like a real customer, doing the core task, before shipping.
2. Free shift-left scanning: automatic scanners for risky dependencies, leaked secrets, and obvious code mistakes ("shift-left" means catching problems early, while building).
3. One pre-mortem conversation: pretend it is a year later and the project failed, list why, fix what you can now.
4. If the app makes any paid AI call: cap the spend and run one basic eval (a small report card that scores whether the AI feature still behaves after a change).

## Durable-meaning rule

The plain-language meaning of each check is the part that lasts. The citation is the defense. Where a control number is fragile across versions, state the meaning and cite the standard at the document level rather than printing an unverified number. Do not invent control IDs.
