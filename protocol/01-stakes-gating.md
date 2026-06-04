# Stakes Gating: how the audit scales itself to your app

This is the part that keeps the audit honest in both directions. It stops the audit from waving through a payments app with a quick once-over, and it stops the audit from burying a weekend to-do app under security work it will never need.

The audit knows a lot. It knows twelve subject areas (lettered A through L), and within each one it knows three depths of rigor: the floor, the standard, and the extra mile. The extra mile includes practices that even strong engineering teams treat as optional, extended effort. Running every one of them on every app would waste your time and your money. So the audit does not. It first works out how much is genuinely at stake in your specific repository, then it turns the rigor up only where the stakes earn it.

You do not have to know which parts apply. That is the whole point. The agent reads your code, asks you a few plain questions to fill the gaps, and decides. The rest of this page is the exact decision procedure the agent follows, written out so you can see there is no guesswork in it.

The three depths, in plain terms:

- **Floor** is "did anyone do the obvious thing." Every app gets the floor. No exceptions.
- **Standard** is "what a competent team would do." Applied where there is something real to protect.
- **Extra mile** is the frontier: containment patterns for AI agents, spending guardrails, formal threat models, independent review. Reserved for the apps that actually carry the risk.

---

## The six stakes signals (S1 to S6)

A "stakes signal" is a concrete, checkable property of your app that means a mistake here would actually hurt. The agent scans your repository for these six. They are observable facts about your code, not opinions, so two different agents looking at the same repo should find the same signals.

- **S1 Money.** The app handles payments, billing, payouts, or credits that have cash value. A mistake here can move real money to the wrong place.
- **S2 Identity/Auth.** The app has login, sessions, password reset, or roles and permissions. "Auth" is short for authentication and authorization: proving who someone is, and deciding what they are allowed to do. A mistake here can let the wrong person in, or let a normal user act as an admin.
- **S3 Personal data.** The app stores PII, meaning personally identifiable information: email, phone, name, health details, location, private messages. A mistake here can leak details about real people.
- **S4 Autonomy.** An AI agent in your app can take actions on its own, such as sending an email, running code, calling a tool, or spending money, without a human approving each action first. A mistake here means a tricked or confused agent acts before anyone can stop it.
- **S5 Blast radius.** One failure harms many people at once: many users, multiple separate customers sharing the same system (multi-tenant), a public API anyone can call, or shared infrastructure. A mistake here does not stay small.
- **S6 Irreversibility.** An action cannot be undone once it happens: delete, transfer, publish, send. A mistake here cannot be walked back with an apology and a refund.

Why six and not "be careful": each signal names a specific reason a bug becomes a disaster instead of an annoyance. When the agent recommends extra work, it will tell you which signal triggered it ("you store personal data and one of your delete actions cannot be undone, therefore..."). That is the gap this closes. You did not have to know to ask. The signal asked for you.

---

## How the audit decides the depth, one area at a time

The single most important rule here: **stakes are local.** A personal-finance app is high-stakes on money and personal data, and at the same time genuinely low-stakes on, say, server uptime tooling. It would be wrong to drag the uptime area up to frontier rigor just because the payments area is risky. So the agent computes a depth for each of the twelve areas separately, looking only at the stakes signals that touch that area's surface.

Here is the exact procedure the agent runs. Read it as a recipe, not as code you need to maintain:

```
for each domain A through L:
  signals_here = the stakes signals (S1 to S6) present on THIS domain's surface
  if signals_here == 0:                          tier = FLOOR
  elif signals_here == 1 and not (S4 or S6):     tier = STANDARD
  else:                                          tier = EXTRA_MILE
```

In words:

- If an area has **no** stakes signals on it, it gets the **floor**. The obvious hygiene, nothing more.
- If an area has **exactly one** signal, and that signal is not autonomy (S4) or irreversibility (S6), it gets the **standard**. One real thing to protect earns competent-team practice.
- If an area has **two or more** signals, or **any** autonomy or irreversibility signal at all, it gets the **extra mile**. Autonomy and irreversibility are singled out because each one, by itself, can turn a small bug into a catastrophe: an agent that acts on its own, or an action that cannot be undone.

This is what makes the audit comprehensive without being wasteful. The knowledge of the frontier is always there. It only switches on where your actual code earns it.

---

## The hard overrides (these escalate no matter what the count says)

A few situations are dangerous enough that the agent escalates them on principle, even if the simple count above would not. These are not optional and the agent must apply them before reporting.

- **Any S4 (an AI agent acts on its own) forces the extra mile on three areas: B (security), F (AI-generated-code patterns), and K (pen-test and professional review).** Concretely, the agent must then check for sandboxing (keeping the agent in a restricted space where it cannot do damage), least-privilege (giving the agent only the minimum powers it needs), a prompt-injection red-team (deliberately trying to trick the agent with hidden instructions before an attacker does), and at least one containment pattern (an architecture that limits what a misbehaving agent can reach). This is the non-negotiable of building anything that acts for you.
- **Any S1 (money) or S6 (irreversible action) forces at least the standard on D (data and privacy) and E (payments, monetization, and AI-cost integrity).** If that same app also has S5 (blast radius, the failure hits many people), those two areas go all the way to the extra mile.
- **Any paid AI API call running in production forces cost guardrails at the floor, on day one.** A "cost guardrail" is a spending limit and an alert: a cap per user per day, a cap per month, and a warning before you hit it. This one does not wait for a later tier. The reason is blunt: a runaway AI loop with no cap can generate a catastrophic bill while you sleep. Capping spend is part of the floor for any app that pays a provider per call.

---

## The anti-over-engineering rule (said plainly, on purpose)

Encoding when to **skip** is as important as encoding what to do. Over-applying elite practice to a low-stakes app is a failure, not diligence. It wastes the builder's time and money, and it teaches nothing.

So the rule is stated out loud, and the agent is bound by it:

> If zero stakes signals are present, the agent must NOT propose bug bounties, chaos engineering, formal SLOs, canary infrastructure, or fuzzing campaigns. Recommend only the floor.

A quick gloss on what the agent is being told to hold back, since these are exactly the terms a non-coder would not know:

- A **bug bounty** is paying outside researchers to find security holes. Pointless before you have real users and someone to handle the reports.
- **Chaos engineering** is deliberately breaking your own system to test that it recovers. There is nothing to make resilient on an app nobody depends on yet.
- A **formal SLO** (service-level objective) is a written uptime promise like "up 99.9% of the time," with a rule that you stop shipping features when you break it. That is theater at hobby scale.
- **Canary infrastructure** releases a change to a tiny slice of users first and watches it before everyone gets it. Overkill when your whole audience is a handful of people.
- A **fuzzing campaign** throws thousands of random and malformed inputs at the code to find crashes. Worth it for code that parses untrusted input under real stakes, not for a simple form with basic validation.

If your app has no money, no auth, no personal data, no autonomous agent, no blast radius, and no irreversible action, the honest answer is that you do not need any of the above, and an audit that pushed them on you would be selling you anxiety.

---

## The universal floor (never skipped, even at zero stakes)

There is a small set of practices the audit recommends for every app, including the trivial weekend ones. Not because the stakes demand them, but because they cost almost nothing and the builder usually did not know they were a named, normal thing to do. Skipping these is never justified.

1. **Dogfooding.** Use your own product the way a real customer would, doing the core task, before you ship it to anyone. This is the single most accessible practice on the whole list, and it catches "technically works, actually broken" problems that no automated test will.
2. **Free shift-left scanning.** "Shift-left" means catching problems early, while building, instead of after launch. The free version is wiring up automatic scanners that run on their own: a dependency scanner (flags known-vulnerable libraries you depend on), a secret scanner (flags passwords or API keys accidentally left in the code), and basic static analysis (reads the code for obvious mistakes without running it).
3. **One pre-mortem conversation.** Before a meaningful build, pretend it is a year later and the project failed badly, and list the reasons why. Then fix the ones you can now. It is one conversation with your agent and it reliably surfaces risks you would otherwise miss.
4. **If the app makes any paid AI call: cost caps plus one basic eval.** The cost caps are the spending limits described in the overrides above. An "eval" is a small report card for an AI feature: a handful of test cases and a way to score whether the AI's answers are still good after you change a prompt or swap a model, so you do not silently ship a worse version.

That is the floor. Cheap, universal, and enough for an app that carries no real stakes.

---

## How the agent figures out your stakes (and the five questions for you)

The agent works out your stakes signals two ways, and uses both.

**Primary: it reads your repository.** It looks at your code for the concrete evidence of each signal: payment-provider libraries and webhook handlers (S1), login and session and role-checking code (S2), database tables and fields that hold personal information (S3), code where an AI agent calls tools or takes actions without a human gate (S4), signs of multiple customers sharing one system or a public API (S5), and actions that permanently delete, transfer, publish, or send (S6). Reading the code is the primary source because code does not misremember.

**Confirmation: it asks you five plain questions.** A non-coder may not describe their own app's stakes accurately, and some signals are easier to confirm by asking than by inferring. So the agent asks, and treats a "yes" as a signal present even if it did not spot it in the code (and as a prompt to look again if the code seemed to say otherwise).

The agent must ask you these five, in plain language, and record your answers as part of the audit:

1. **Does your app touch money in any way?** Does it take payments, run subscriptions or billing, pay anyone out, or hand out credits or points that are worth real money? (Confirms S1.)
2. **Do people log in?** Is there any account, password, sign-in, password reset, or any notion of different roles such as a normal user versus an admin? (Confirms S2.)
3. **Do you store anything about real people?** Names, emails, phone numbers, addresses, location, health details, private messages, anything that identifies a person? (Confirms S3.)
4. **Can the AI in your app do things on its own?** Can it send an email, run code, call an outside service, change data, or spend money without you approving that specific action first? And separately, are there any actions in your app that cannot be undone once done, such as deleting an account, transferring something, publishing, or sending? (Confirms S4 and S6.)
5. **If something broke, how many people would it hit at once?** Just you, or a handful of friends, or many strangers, multiple separate customers on the same system, or anyone who can reach a public address? (Confirms S5.)

Five questions, six signals: question four deliberately covers both autonomy and irreversibility, since builders tend to think of "the AI acts on its own" and "this cannot be undone" together. Your answers, plus what the agent read in the code, set the stakes signals that drive every depth decision on this page. Once they are set, the per-area procedure runs, the overrides apply, the anti-over-engineering rule holds, and the audit knows exactly how hard to look at each of the twelve areas, no harder, no softer.
