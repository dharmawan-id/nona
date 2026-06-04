# Domain L: Decide and Act

## What this is

This is the domain where the audit turns into decisions. Every other domain hands you findings: a secret in the wrong place, a missing ownership check, a payment webhook nobody verifies, a package that does not exist. Domain L is where you decide which of those you fix tonight, which can wait, which you can knowingly live with, and which is the moment to stop fixing things yourself and pay a human to look. It is triage, plain-language risk translation, and one explicit decision: when do you hand this to an independent reviewer.

The reason this domain exists as its own thing is that a list of findings is not a plan. A non-coder handed twenty findings of mixed severity has no way to tell the one that ends the company from the one that does not matter, and the natural human move under that pile is either to freeze or to fix whatever is easiest first. Both are wrong. This domain gives the agent a procedure for ranking by what a mistake actually costs your business, and it gives you a clear line for when the honest answer is "this is past what an AI audit can settle, get a person."

## What you can't see here

You cannot see which finding is the dangerous one. They all arrive looking similar: a row in a table, a severity word, a suggested fix. To you, "Row Level Security is off on one table" and "the login redirect can be skipped" read as roughly equal-weight problems, because you have no way to feel the blast difference between them. One might be a table nobody can reach; the other might be the front door standing open on a system holding ten thousand people's data. The severity label alone does not tell you that, and a non-coder cannot supply the missing context by reading the code.

There is a second thing you cannot see, and it is the more dangerous one: your own over-trust. When an AI hands you a tidy report and the reasoning sounds reasonable, people believe it past the point the facts justify. This is a measured effect. In an oversight study where reviewers missed an error, their confidence in the result actually went up rather than down (Hedges' g = 0.85; Grunde-McLaughlin et al., arXiv:2602.16844). The cleaner the report looks, the more it can manufacture a calm you have not earned. The earliest version of this finding is older: people using AI assistants wrote less secure code while believing it was more secure, the documented "false sense of security" (Perry et al., ACM CCS 2023). So the thing you most need to decide, which findings are safe to set aside, is exactly the decision your instinct will get wrong, in the confident direction.

The third blind spot is the hire-a-human line itself. Nobody tells a non-coder where it is. The scanners hand you fixes and go quiet. The frameworks built for engineers assume you can judge for yourself when you are out of your depth. So the builder ships, the report looked clean, and the question "should a real person have checked this before launch" never gets asked, because there was nothing in the process whose job was to ask it. That gap is what this domain closes. The decision to escalate is not left to a feeling. It is a rule, written down, that the agent applies for you.

## When this matters (stakes signals)

This domain is different from the others in one important way, and it is worth stating plainly so you read its results correctly. Every other domain looks at one surface of your app. Domain L looks at the whole pile of findings from all of them at once. So its stakes are not local to one feature. Its stakes are the sum of everything the rest of the audit turned up, weighed against everything genuinely at risk in your repository.

That means the depth of this domain follows the depth of your app overall.

- If your app carries real stakes anywhere (any of **S1 money**, **S2 identity and auth**, **S3 personal data**, **S5 blast radius**), then triage here runs at STANDARD at minimum: every finding gets ranked by likelihood and business impact rather than left at a bare severity label, and the ranking is written down so you and a future human reviewer can both see the reasoning.
- If your app combines several of those signals, or holds personal data at scale (**S3 with S5**), this domain runs at EXTRA-MILE: a full risk register, an explicit accept-or-fix decision recorded for every finding you are not fixing immediately, and a residual-risk statement that says in writing what you are choosing to live with.

There are two hard lines that sit above the count, because they decide the escalation, which is this domain's whole job.

**If an AI agent in your app can take actions on its own without a human approving each one (S4), the hire-a-human decision is forced to "yes" for the security-critical findings.** An autonomous agent that can act with broad access is the single configuration most likely to turn a missed bug into a live incident before anyone notices. An AI audit reduces that risk; it does not retire it. For an app with an autonomous agent, an independent human review of the access and containment findings is not optional.

**If an action in your app cannot be undone (S6) and combines with money (S1) or scale (S5), any unresolved finding touching that action forces escalation.** A permanent action reached by the wrong person, or fired by a bug, leaves no path back. There is no "we will fix it in the next release" for a transfer that already left or a record already destroyed. So the bar for shipping with an open finding on an irreversible, high-value, or wide-reaching action is not "probably fine." It is a clean fix you can point to, or a human who signed off.

If your app genuinely has no money, no auth, no personal data, no autonomous agent, no blast radius, and no irreversible action, then triage here is light and the honest escalation answer is "you do not need to pay anyone." Rank the few floor findings, fix the obvious ones, and ship. Do not buy a professional audit for a weekend to-do app. Spending money to review an app that risks nothing is the same mistake as skipping the review on an app that risks everything, run backward.

## Floor checks

Never skip these. Even a zero-stakes app produces a few findings, and a builder who cannot tell which to act on first will act on none of them.

| Check | Why it matters to your business | Evidence the agent must produce | Citation |
|---|---|---|---|
| Collect every finding from all twelve domains into one list, and for each one record three plain things: what could happen in business terms, how easy it would be for someone to make it happen, and whether the affected thing carries any stakes signal. Do not rank yet; first make the full picture visible in one place. | You cannot decide across findings you cannot see together. Findings scattered across twelve reports, each in its own format, are impossible for a non-coder to weigh against each other. One consolidated list, each item phrased as a consequence rather than a code defect, is the difference between a decision and a shrug. This is the step that turns "here are some problems" into something you can actually act on. | A consolidated findings list: every finding from every domain, each with its plain-language business consequence, a rough likelihood (easy or hard to trigger), and the stakes signal it touches if any. Nothing summarized away; the full list. | NIST SSDF SP 800-218 v1.1 RV.2 (assess and prioritize vulnerabilities); OWASP risk rating model (likelihood and impact) |
| Rank the list by business risk, where risk is how likely a mistake is multiplied by how badly it would hurt, and translate every top item into a sentence a non-coder understands. The dangerous finding goes to the top on the strength of what it costs your business, even when a tool printed a milder word next to it. | A severity label alone misleads you. "High" on a table nobody can reach matters less than "medium" on your front door. Ranking by likelihood times impact, and saying the impact in money-and-people terms, is what surfaces the one finding that actually deserves your night. Without this, builders fix the easy things first and leave the expensive one open because it looked the same on the page. | A ranked findings list, highest business risk first, each top item carrying one sentence of plain consequence (for example: "a stranger can read any customer's invoices by changing a number in the address bar," not "IDOR, high"). | OWASP risk rating model (risk = likelihood x impact); NIST SSDF SP 800-218 v1.1 RV.2 |
| For each finding you decide NOT to fix right now, record the decision and the reason in one line: fixing it now, fixing it later (with when), or knowingly accepting it (with why it is acceptable). Silence is not a decision. A finding with no recorded choice is treated as unhandled, and an unhandled finding is the breach you do not remember allowing. | An unwritten decision is a forgotten decision. The finding you "meant to get to" becomes the breach you do not remember choosing to allow. Writing down accept-or-defer, with a reason, does two things: it forces you to actually decide rather than drift, and it leaves a record so a future you, or a human you hire, can see what was chosen on purpose versus what was simply missed. | A decision log: every finding not being fixed immediately, with its disposition (fix now, fix later by a stated date, or accept) and a one-line reason, so no finding sits in limbo. | NIST AI RMF 1.0 MANAGE (decide the risk response and document accepted residual risk) |
| State, in writing, what this audit did not and could not settle. List the checks that came back clean as exactly that ("the agent found nothing here"), word it so it reads as an absence of findings rather than a guarantee, and name anything that could not be checked this way at all. | A clean report is a long way from a safe app, and treating the two as the same thing is the precise trap this whole protocol exists to fight. An AI audit catches a meaningful slice of serious bugs and misses most of them when working alone. Saying so, in writing, on your own report keeps you alert instead of comfortable, and it is the honest input to the next decision: do you need a human. | A residual-risk statement: what was checked and came back clean (worded as "found nothing," which is an absence of findings and falls short of "is safe"), what could not be checked by this method, and a plain note that an AI audit reduces risk without proving safety. | NIST AI RMF 1.0 MANAGE (document residual risk); NIST SSDF SP 800-218 v1.1 RV.2 |

## Standard checks

A competent team does these. Run them when your app carries any real stakes (S1, S2, S3, or S5), per the signals above.

| Check | Why it matters to your business | Evidence the agent must produce | Citation |
|---|---|---|---|
| Turn the ranked list into a real fix order with a cutoff: name which findings block launch (must be fixed before you ship or expose this to anyone), which are fix-soon (fix within a set window after launch), and which are accepted. Tie each blocker to the stakes signal that makes it a blocker. | "We will fix the important ones" is not a plan a non-coder can execute, because you cannot tell which ones those are. A blocking list with a launch cutoff converts the ranking into an action you can actually take: these doors must be locked before anyone walks in, these can be reinforced next week, these we have chosen to leave. The stakes link is what makes the cutoff defensible rather than arbitrary. | A remediation plan: findings split into block-launch, fix-soon (with a window), and accepted, each blocker annotated with the stakes signal forcing it, so the launch decision rests on stated reasons. | NIST SSDF SP 800-218 v1.1 RV.2 (prioritize and remediate); NIST AI RMF 1.0 MANAGE (risk response) |
| For every finding marked fixed, confirm the fix with the same evidence that exposed the bug rather than the agent's say-so, and confirm it in a clean context so the agent that may have written the original bug is not the sole judge that it is gone. A fix is not done because the agent says "fixed." It is done when the artifact that exposed the bug now comes back clean. | The agent that built a bug, asked to confirm its own fix in the same breath, will tend to say it is fixed because it believes it did good work. That is the same circularity that lets the original bug through. Re-checking the fix from a fresh context, against the same evidence that found the problem, is the difference between "the agent says the door is locked" and "the door, tried again, is locked." For a fix on a money or access finding, the second is the only one worth trusting. | A fix-verification record: per fixed finding, the original evidence artifact and the re-run result showing the problem no longer reproduces, produced in a clean context (see the circularity guard), with any fix that cannot be confirmed flagged as still open. | NIST SSDF SP 800-218 v1.1 RV.2 (verify remediation); NIST AI RMF 1.0 MANAGE |
| Apply the explicit hire-a-human decision tree and record its output. Walk these gates in order: is there an unresolved finding on a money, auth, or personal-data surface that you cannot fully explain or confirm fixed; does the app hold many people's personal data; can an action be undone or not; does an AI agent act on its own. Any gate that trips routes you to an independent human review, and the agent must say so in plain words. | This is the decision no scanner and no engineer-built framework makes for a non-coder, and it is the one with the highest cost when it goes unasked. Left to instinct, a builder ships because the report looked clean and the false-sense-of-security effect did the rest. A written decision tree removes the instinct from the choice: the gate either trips or it does not, and if it trips, the audit tells you to spend the money rather than hoping. | A hire-a-human decision: each gate, its yes-or-no answer with the evidence behind it, and the resulting verdict (proceed, or get an independent human review) stated in plain language with the reason. | NIST AI RMF 1.0 MANAGE (risk response includes transfer to independent review); NIST SSDF SP 800-218 v1.1 RV.2 |

## Extra-mile checks

Frontier rigor. Even strong engineering teams treat these as extra, extended effort. Run them only when the stakes gate forces it, as annotated.

| Check | Why it matters to your business | Evidence the agent must produce | Citation | Stakes gate + frontier pattern |
|---|---|---|---|---|
| Build and maintain a standing risk register: every finding as a tracked entry that records its business impact and likelihood, the chosen response (fix, accept, transfer to a human, or avoid by removing the feature), who owns it, and the date to revisit it. Re-run it each meaningful change rather than treating the audit as a one-time event. | An app that carries serious stakes is not audited once and finished; it keeps shipping, and each change can open a new hole or reopen an old one. A one-shot report goes stale the day after you read it. A living register is how a high-stakes app stays accountable to its own risk over time: nothing is forgotten, every accepted risk has a name attached and a date to revisit, and a human you bring in later starts from a complete picture instead of a snapshot. | A risk register: each finding tracked with impact, likelihood, response, owner, and review date, with a note of when it was last re-run against the current code, accepted risks explicitly carried with their justification. | NIST AI RMF 1.0 MANAGE (ongoing risk management and documented residual risk); NIST SSDF SP 800-218 v1.1 RV.2 | Forced by S3 with S5 (personal data at scale), or several stakes signals together. Frontier pattern: standing risk register with periodic re-run. |
| Commission an independent human audit as the explicit escalation, and record the decision to do so as part of the audit output. Treat the AI audit as the cheap first pass that lifts a paid human to a higher starting floor: hand the reviewer the consolidated findings, the decision log, the fix-verification records, and the residual-risk statement, so they spend their hours on judgment rather than re-discovery. | This is the line where the honest answer stops being "the agent checked" and becomes "a person must." An independent human review of an app handling money, lots of people's data, irreversible actions, or an autonomous agent is paid work, and it is worth it precisely when the cost of being wrong dwarfs the fee. Such reviews exist in the market at a real range, commonly USD 500 to USD 3,000 for a focused audit and into the thousands per month for ongoing fractional engineering oversight, and arriving with your findings already organized is how you buy judgment instead of paying someone to re-read your code from scratch. | An escalation record: the gate that forced human review, the package handed to the reviewer (consolidated findings, decision log, fix-verification records, residual-risk statement), and confirmation that the AI audit's role is framed as a first pass that hands the human a head start. | NIST AI RMF 1.0 MANAGE (transfer risk to independent review); NIST SSDF SP 800-218 v1.1 RV.2 | Forced by S4 (autonomous agent) on security-critical findings, or S6 combined with S1 or S5 on an unresolved finding. Frontier pattern: independent human audit as escalation target. |

## When to stop and hire a human

This domain owns the escalation decision for the whole audit, so the line is drawn here in full. Bring in an independent human reviewer when any of these are true:

- A finding on a money, login, or personal-data surface came back open, and you cannot fully explain why it happened or confirm that the fix closed it. A confirmed hole you do not understand, on a surface that matters, is not a place to talk yourself into "probably fixed."
- Your app stores personal data and serves many users or multiple separate customers (S3 with S5), and the consolidated findings include anything you are choosing to accept rather than fix. Accepting a risk on a shared system holding real people's data is a decision that deserves a second, paid set of eyes before you make it final.
- An action in your app cannot be undone, and it combines with money or scale (S6 with S1 or S5), and any open finding touches that action. Permanent, high-value, or wide-reaching actions earn a human pass before launch, because there is no rollback to fall back on.
- An AI agent in your app can act on its own (S4), and the security or containment findings are not all cleanly closed. An autonomous agent with unresolved access findings should not run unreviewed.
- The pile is simply bigger or more tangled than you can reason about, and you find yourself trusting the clean-looking report because reading further is hard. That feeling is the documented over-trust effect, and it is itself a reason to escalate.

What a human adds, and what this audit honestly cannot, is covered in Domain K (pen-test and professional review). The short version belongs here too, because it is the input to this decision. An AI audit run well, in a clean context and ideally with a different model, catches a meaningful slice of serious bugs cheaply. It also misses most injected bugs when working alone: in the cleanest measurement available, even the best condition caught only about 28.6 percent of injected errors (Cross-Context Review, arXiv:2603.12123). Roughly seven in ten survived. That is a useful first pass and a genuine head start for a paid reviewer. It is not a safety guarantee, and treating it as one would hand you the exact false comfort this protocol exists to remove. For an app carrying real stakes, the right move is not to choose between the AI audit and the human one. It is to run the AI audit first, fix what it finds, and then pay the human to start from the higher floor it leaves behind.

## Agent instructions

```
DOMAIN L: DECIDE AND ACT

Scope by stakes (this domain's surface is the FULL set of findings from all domains,
so its stakes are the union of stakes across the whole repo):
  If the app carries any real stakes anywhere (S1 money, S2 auth, S3 personal data,
  S5 blast radius), run STANDARD here: rank every finding by likelihood x impact and
  record the reasoning.
  If several stakes combine, or personal data at scale (S3 with S5), run EXTRA-MILE:
  a standing risk register plus an explicit accept-or-fix decision recorded per finding.
  HARD LINES on the escalation (this domain's core job):
    - If an AI agent acts on its own (S4), the hire-a-human decision is forced to YES
      for the security-critical findings.
    - If an action cannot be undone (S6) and combines with money (S1) or scale (S5),
      any unresolved finding touching that action forces escalation.
  If the app has no money, no auth, no personal data, no autonomous agent, no blast
  radius, and no irreversible action, triage is light and the escalation answer is
  "you do not need to pay anyone": rank the few floor findings, fix the obvious ones,
  ship. Do not recommend a paid audit for an app that risks nothing.

Over-trust note (this is the domain where it bites hardest):
  A clean-looking report manufactures confidence the facts have not earned. When
  reviewers miss an error their confidence tends to RISE (a measured effect,
  Hedges' g = 0.85). Present EVIDENCE and the ranked consequences, never a bare
  reassurance. Treat a check that "found nothing" as exactly that. A clean check
  is not a proof of safety.

Circularity note (see the circularity-guard protocol):
  The agent that wrote a bug, asked to confirm its own fix in the same context, tends
  to say it is fixed. Verify every claimed fix in a CLEAN, fresh context against the
  same artifact that exposed the bug, ideally with a different model. "Fixed" is not a
  verdict; it is the original evidence now coming back clean.

Produce these artifacts (not verdicts):
  FLOOR:
    1. Consolidated findings list: every finding from every domain, each with its
       plain-language business consequence, a rough likelihood (easy/hard to trigger),
       and the stakes signal it touches if any. The full list, nothing summarized away.
    2. Ranked findings list: ordered by business risk (likelihood x impact), highest
       first, each top item carrying one sentence of plain consequence (e.g. "a stranger
       can read any customer's invoices by changing a number in the address bar," not
       "IDOR, high").
    3. Decision log: every finding NOT fixed immediately, with its disposition (fix now /
       fix later by a stated date / accept) and a one-line reason. No finding left in limbo.
    4. Residual-risk statement: what was checked and came back clean (worded as "found
       nothing," an absence of findings that stops short of "is safe"), what could not be
       checked this way, and a plain note that an AI audit reduces risk without proving safety.
  STANDARD (any real stakes: S1 / S2 / S3 / S5):
    5. Remediation plan: findings split into block-launch, fix-soon (with a window), and
       accepted, each blocker annotated with the stakes signal forcing it.
    6. Fix-verification record: per fixed finding, the original evidence artifact and the
       re-run result showing the problem no longer reproduces, done in a clean context;
       fixes that cannot be confirmed flagged as still open.
    7. Hire-a-human decision: each gate (unexplained open finding on money/auth/PII; PII
       at scale; irreversibility; autonomous agent) with its yes/no answer and evidence,
       and the resulting verdict (proceed, or get an independent human review) in plain
       words with the reason.
  EXTRA-MILE (personal data at scale, or several stakes, or the forced escalation):
    8. Risk register: each finding tracked with impact, likelihood, response (fix / accept
       / transfer to human / avoid), owner, and review date; the date it was last re-run
       against current code; accepted risks carried with their justification.
    9. Escalation record (if a hard line tripped): the gate that forced human review, the
       package handed to the reviewer (consolidated findings, decision log, fix-verification
       records, residual-risk statement), and confirmation the AI audit is framed as a
       first pass that gives the human reviewer a head start.

Output a findings table with these columns and nothing weaker than evidence:
  | Severity | Business risk in plain words | Evidence artifact | Citation | Suggested fix |

For THIS domain, also output the decision summary the rest of the audit feeds into:
  - the ranked list,
  - the disposition (fix now / later / accept) per finding,
  - the residual-risk statement,
  - the hire-a-human verdict (proceed or escalate) with its reason.

Rules:
  - Translate every finding into a concrete business consequence a non-coder understands.
    Rank by what a mistake costs (likelihood x impact). Treat a tool's severity label as
    one input to that ranking, then rank on the business cost itself.
  - Cite only the controls named in this domain (SSDF RV.2, AI RMF MANAGE, OWASP risk
    rating: likelihood x impact). Do not invent IDs.
  - No bare verdicts. "Looks fine, ship it" is not a finding and not a decision. Every
    disposition carries its reason; every "fixed" carries the re-run evidence.
  - Silence is never success. A check that found nothing is reported as "found nothing."
    Report an undecided finding as unhandled; an unhandled finding has not been accepted,
    it has been missed.
  - When a hard line trips, say "get an independent human review" in plain words and say
    why. Do not soften the escalation into a maybe.
  - State the honest ceiling: this audit catches a meaningful slice of serious bugs and
    misses most injected bugs alone (best measured ~28.6% F1). It is a cheap first pass
    that lifts a paid human reviewer to a higher floor. Do not overstate it into a
    substitute for a professional review.
  - If you cannot produce an artifact a check demands, say so and mark that check INCOMPLETE.
```
