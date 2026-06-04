# The six stakes signals at a glance

A stakes signal is a concrete, checkable property of the app that means a mistake there would actually hurt. The agent scans the repository for these six and uses them to decide how deep to audit each area. They are observable facts about the code, not opinions, so two agents looking at the same repo should find the same signals. This card is the quick reference; the full definitions, the per-area procedure, the hard overrides, and the five confirmation questions are in `../../../protocol/01-stakes-gating.md`.

## S1 to S6

| Signal | Plain meaning | What it looks like in the code |
|---|---|---|
| **S1 Money** | The app handles payments, billing, payouts, or credits that have cash value. A mistake can move real money to the wrong place. | A payment-provider library, a checkout flow, a webhook handler that confirms payments, subscription or billing logic, a credit or points balance worth real money. (A webhook is a message one service sends another to confirm an event, like a payment going through.) |
| **S2 Identity/Auth** | The app has login, sessions, password reset, or roles. A mistake can let the wrong person in, or let a normal user act as an admin. "Auth" is short for authentication (proving who someone is) and authorization (deciding what they may do). | Sign-in and sign-up code, session handling, a password-reset flow, a notion of roles such as user versus admin. |
| **S3 Personal data** | The app stores PII (personally identifiable information): email, phone, name, health details, location, private messages. A mistake can leak details about real people. | Database tables and fields holding personal information, profile records, message stores, anything that identifies a person. |
| **S4 Autonomy** | An AI agent in the app can take actions on its own (send an email, run code, call a tool, spend money) without a human approving each action first. A mistake means a tricked or confused agent acts before anyone can stop it. | Code where an AI model's output triggers a real action with no human approval gate: an agent that calls tools, writes data, sends messages, or makes purchases on its own. |
| **S5 Blast radius** | One failure harms many people at once: many users, multiple separate customers sharing one system (multi-tenant), a public API anyone can call, or shared infrastructure. A mistake does not stay small. | A multi-tenant design, a public API, a large or open user base, shared infrastructure that many depend on. |
| **S6 Irreversibility** | An action cannot be undone once it happens: delete, transfer, publish, send. A mistake cannot be walked back with an apology and a refund. | Code that permanently deletes records, transfers something, publishes to the public, or sends an irreversible message or payment. |

## How the signals set the depth

Stakes are local. A signal escalates only the area it touches. The agent computes a tier for each of the twelve areas separately, using only the signals on that area's surface:

```
for each domain A through L:
  signals_here = the stakes signals (S1 to S6) present on THIS domain's surface
  if signals_here == 0:                          tier = FLOOR
  elif signals_here == 1 and not (S4 or S6):     tier = STANDARD
  else:                                          tier = EXTRA_MILE
```

In words: no signal on an area means the floor. Exactly one signal that is not autonomy or irreversibility means standard. Two or more signals, or any autonomy or irreversibility at all, means extra-mile. Autonomy and irreversibility are singled out because each one alone can turn a small bug into a catastrophe.

## The hard overrides (escalate no matter what the count says)

- **Any S4** (an AI agent acts on its own) forces **extra-mile** on **B** (security), **F** (AI-generated-code patterns), and **K** (pen-test): check for sandboxing (keeping the agent in a restricted space), least-privilege (giving it only the minimum powers it needs), a prompt-injection red-team (deliberately trying to trick the agent with hidden instructions before an attacker does), and at least one containment pattern.
- **Any S1 (money) or S6 (irreversible action)** forces at least **standard** on **D** (data and privacy) and **E** (payments and AI cost). If the app also has **S5** (blast radius), those two areas go to **extra-mile**.
- **Any paid AI API call running in production** forces **cost guardrails at the floor**, on day one. A runaway AI loop with no cap can generate a catastrophic bill overnight. A cost guardrail is a spending limit and an alert: a cap per user per day, a cap per month, and a warning before the cap is hit.

## How the agent finds the signals

Two sources, both used:

1. **Read the repository (primary).** Code does not misremember. Look for the concrete evidence of each signal listed in the table above.
2. **Ask the five plain confirmation questions** in `../../../protocol/01-stakes-gating.md`, because a non-coder may not describe their own app's stakes accurately. A "yes" counts as a signal present even if the code did not obviously show it. Record the answers as part of the audit. Question four deliberately covers both autonomy (S4) and irreversibility (S6), since builders tend to think of "the AI acts on its own" and "this cannot be undone" together.
