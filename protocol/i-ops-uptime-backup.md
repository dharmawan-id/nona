# Domain I: Ops, Uptime, Backup, Rollback

## What this is

This domain is about what happens after launch, when something goes wrong and nobody is watching the screen. Three things have to hold. You can tell when your app breaks or gets attacked, because it tells you (detection and alerting). When a part of it fails, it fails safely instead of swinging the doors open (error handling). And when data is lost or a bad change ships, you can get back to a known-good state, because a backup exists and a way to undo the change exists (backup and rollback).

An AI tool builds you an app that runs in the demo. It does not, on its own, build you the boring machinery that catches a failure at three in the morning, refuses to grant access when a check errors out, or restores last night's data after a bad deploy. That machinery is invisible while everything works, which is exactly why it is the part that is missing when everything stops working. This is the domain of the failure you did not plan for, handled by the safety net you did not know you needed.

## What you can't see here

Your app has been up for weeks. You open it, it loads, orders come in. Nothing tells you that the part you cannot see has never been tested, because the only test that counts is a real failure, and you have not had one yet. Three blind spots hide in that calm.

The first is **a backup that was never restored**. Your hosting provider may take automatic backups, and that line in the dashboard feels like safety. It is not, until someone has actually restored one and watched the data come back whole. Backups fail quietly: a job that silently stopped running months ago, a backup that captures the database but not the uploaded files, a copy that restores into an empty shell because a step was missing. You find out which kind you have on the day you need it, and that is the worst possible day to find out. The only proof a backup works is a restore that worked.

The second is **failing open instead of failing closed**. When a check in your app errors out (the database is slow, a service it calls times out, an unexpected input arrives), the code has to decide what to do, and an AI tool writing the happy path will often write the version that keeps going. Keeping going can mean granting access when the permission check could not complete, treating a payment as successful when the verification call failed, or showing data when the filter that hides other people's data threw an error. The app looks more robust because it never shows an error to the user. It is actually less safe, because "I could not check, so I will allow it" is an open door dressed as resilience. OWASP added this exact failure to its 2025 top-ten list as its own category, mishandling of exceptional conditions, because it is that common and that quiet (OWASP Top 10:2025 A10).

The third is **silence when you should be hearing alarms**. If your app is being probed, if errors are spiking, if a background job died, if your AI usage is climbing toward a bill you cannot pay, you only know if something is built to tell you. Most AI-built apps log nothing useful and alert on nothing, so the first notification of a problem is a customer complaint or a credit-card statement. OWASP lists insufficient logging and alerting as its own top-ten category for the same reason: not seeing the attack is how the attack succeeds for months (OWASP Top 10:2025 A09).

A naive self-audit misses all three because they are absences, not mistakes. There is no broken line of code to point at. The AI tool that built the app reads "no error handling here" as "this path does not error," and reads "no alerting" as "nothing to alert about," because in the demo nothing errored and nothing went wrong. The check that finds these is not "does it run." It is "show me the last restore that worked, show me what the code does when this check fails, and show me what would have to break before anyone is told."

## When this matters (stakes signals)

The floor for this domain is light and it applies to every real app: errors should fail safe, and a backup of anything you would hate to lose should exist with at least one restore proven. That floor is cheap and it is never skipped. What the stakes signals decide is whether you go beyond it into the reliability machinery that elite teams run, and the honest answer for most small apps is that you do not.

Stakes are read on this domain's own surface: what an outage, a silent failure, or lost data would actually cost on this app.

- **S5 Blast radius** (many users, multiple separate customers on shared infrastructure, a public API, a shared system) is the defining signal here. When one failure harms many people at once, the cost of an undetected outage or a botched deploy multiplies, and the practices that contain that cost (an agreed uptime target, staged rollouts, real monitoring) start to earn their keep. S5 pushes this domain toward STANDARD and, combined with another signal, to EXTRA-MILE.
- **S6 Irreversibility** (an action here cannot be undone: delete, transfer, publish, send) sharpens the backup-and-rollback half of this domain. If the app does things that cannot be taken back, a proven restore and a tested way to roll back a bad change are the only safety net there is, and a working one becomes worth more than a hopeful one.
- **S1 Money** or **S3 Personal data** on this surface raises the cost of a failure going unseen, because an undetected outage on a paying or data-holding service is lost revenue or an unnoticed breach, not just downtime. Either signal pushes the detection-and-logging half of this domain to STANDARD.

There is a day-one rule that sits above the count, the same one Domain E enforces from the cost side. **If your app calls a paid AI service in production, usage and cost monitoring with an alert belongs at the FLOOR.** The hard spending cap itself lives in the payments-and-cost domain; what lives here is being told when usage climbs, because a runaway loop you cannot see is a bill you cannot stop, and the person running an agent loop is the least likely to notice it before the statement arrives.

If your app genuinely serves a small single audience, holds nothing you cannot rebuild, and does nothing irreversible, then the floor is the whole job here. Make errors fail closed, keep one working backup of anything precious, and stop. The anti-over-engineering rule is sharpest in this domain of any: **do not build chaos-engineering rehearsals, formal uptime targets, canary infrastructure, or game-day drills for an app that has nothing to be resilient about yet.** Resilience machinery built before there is anything worth protecting is wasted effort dressed as diligence, and recommending it for a weekend app is a failure of judgment, not a sign of rigor.

## Floor checks

Never skip these on any real app. They are cheap, and they are the difference between a recoverable bad day and an unrecoverable one.

| Check | Why it matters to your business | Evidence the agent must produce | Citation |
|---|---|---|---|
| Find each place where a security-relevant check can fail (a permission or ownership check, a payment or signature verification, a filter that hides other users' data) and confirm that when it errors or cannot complete, the app denies the action rather than allowing it. The safe default is to refuse when you cannot verify, sometimes called failing closed. | When a check errors out, the code either stops or keeps going, and "keeps going" can mean granting access, accepting an unverified payment, or showing data the filter was supposed to hide, all because something further down broke. An app that allows on error looks smoother to a user and is quietly wide open. Failing closed means a broken check costs you a visible error, not an invisible breach. | An error-handling map for security-relevant paths: each such check, what the code does when it errors or times out (deny or allow), and every path that allows or proceeds on a failed or incomplete check flagged as a fail-open hole. | OWASP Top 10:2025 A10 Mishandling of Exceptional Conditions; OWASP Top 10:2025 A01 Broken Access Control |
| Confirm a backup exists for anything you would not want to lose (the database, and any uploaded files or user content stored outside it), and confirm at least one restore has actually been performed and verified to bring the data back whole. A backup is only proven by a restore that worked. | A backup nobody has ever restored is a guess, and the common failures are silent: a backup job that stopped months ago, a copy that saves the database but not the uploaded files, a restore that lands in an empty shell. The day you need it is the worst day to learn which kind you have. One tested restore now turns "we think we have backups" into "we know we can come back." | A backup-and-restore record: what is backed up (database, files, content) and how often, plus the result of at least one actual restore (what was restored, whether the data came back complete), or an explicit flag that no restore has ever been verified. | NIST AI RMF 1.0 / AI 100-1 MANAGE (recovery from incidents); NIST SSDF SP 800-218 v1.1 RV.2 (remediate and recover) |
| Confirm you can undo a bad release: that the live version can be rolled back to the previous working version through the hosting platform or the deploy process, and that someone knows the steps. Rolling back means returning the running app to a known-good earlier version. | A change that breaks the app or opens a hole is only as dangerous as the time it takes to undo it. If there is no known way back to the last good version, a five-minute mistake becomes a multi-hour outage while someone reverse-engineers a fix under pressure. Knowing the rollback path in advance turns a bad deploy into a quick reversal. | A rollback note: the exact mechanism that returns the app to the previous working version (platform feature, redeploy of a prior build, or documented steps), confirmed to exist, or a flag that no rollback path is known. | OWASP Top 10:2025 A08 Software or Data Integrity Failures; NIST SSDF SP 800-218 v1.1 RV.2 (remediate) |
| Confirm the app records enough of what happens to investigate later: that security-relevant events (failed logins, permission denials, errors, and any administrative action) are written to a log you can reach, with enough detail to tell what happened, and that the log does not itself capture secrets or full personal data. | If nothing is recorded, the first sign of a problem is a customer complaint or a surprise bill, and you have no trail to reconstruct what went wrong. A usable log is how you find out an attack was underway, prove what an account did, and learn from a failure instead of repeating it. A log that quietly stores passwords or personal data, on the other hand, becomes its own leak. | A logging inventory: which security-relevant events are logged, a sample entry showing the detail captured, where the log can be read, and confirmation that secrets and full personal data are kept out of it, with any unlogged critical event or any secret-leaking log flagged. | OWASP Top 10:2025 A09 Security Logging and Alerting Failures; OWASP Top 10 for LLM Applications 2025 LLM02 Sensitive Information Disclosure |
| If the app calls a paid AI service, confirm usage and spend are monitored with an alert that fires before the bill becomes a problem, separate from the hard cap that stops it. Monitoring tells you it is happening; the cap stops it. | A hard spending cap stops a runaway eventually, but by the time it trips you have already spent up to the ceiling. An alert that fires on climbing usage gives you the chance to find and kill a stuck loop or an abusive user while the bill is still small. Without it, the first notification is the statement. | The usage-and-cost monitor as configured: what it watches (token spend, request volume), the alert threshold, and how the alert reaches a human, or a flag that paid AI usage runs unmonitored. | OWASP Top 10 for LLM Applications 2025 LLM10 Unbounded Consumption; OWASP Top 10:2025 A09 Security Logging and Alerting Failures |

## Standard checks

A competent team does these once the app serves many people, holds money or personal data, or does things that cannot be undone, per the stakes signals above.

| Check | Why it matters to your business | Evidence the agent must produce | Citation |
|---|---|---|---|
| Extend error handling beyond the security paths into every place the app calls something that can fail (the database, a payment provider, an AI service, any external service) and confirm each failure is caught and resolved into a correct, safe state, with the user shown a clear message and the detail written to your logs. | A single unhandled failure deep in the app can leave a half-finished action behind: a charge taken with no product granted, a record updated but its companion not, a job that died mid-way and left the data inconsistent. Handling each failure deliberately is what keeps one slow service or one timeout from quietly corrupting the state your customers depend on. | An exceptional-condition review: each external call or fallible operation, what the code does on failure (the resulting state and the user-facing message), and any path that crashes, hangs, or leaves an inconsistent state flagged. | OWASP Top 10:2025 A10 Mishandling of Exceptional Conditions |
| Turn the logging into actual alerting: confirm that the security-relevant and failure events being recorded trigger a notification to a human when they cross a threshold (a spike in errors, a burst of failed logins, a background job that stopped, a service that went down), rather than sitting unread in a log. | A log that nobody reads is a security camera pointed at a wall. The events that matter (an attack probing your app, a job silently dead for a week, an outage at night) are only useful if something pushes them to a person in time to act. Alerting is the line between finding a problem in minutes and finding it when a customer does. | An alerting map: which recorded events raise an alert, the threshold for each, the channel the alert reaches a human through, and confirmation an alert was tested to actually arrive, with critical events that raise no alert flagged. | OWASP Top 10:2025 A09 Security Logging and Alerting Failures; NIST AI RMF 1.0 / AI 100-1 MANAGE (monitor and respond) |
| Set a backup schedule matched to how much data you can afford to lose, confirm backups are stored separately from the live system (so one failure does not take both), and re-confirm a restore on the current backups, not a one-time test from months ago. State plainly how much recent data a restore would lose. | A backup taken once a week means a failure can cost you a week of orders; a backup stored on the same system that failed can be lost alongside it. Deciding the schedule against what you can afford to lose, keeping the copy somewhere separate, and re-testing the restore on today's setup is the difference between a recovery plan and a recovery hope. The amount of recent data a restore would lose is a number you should know before you need it, not after. | A backup-plan record: the backup frequency tied to the acceptable data-loss window, confirmation the backups are stored separately from the live system, and the result of a current restore test with the realistic data-loss window stated, gaps flagged. | NIST AI RMF 1.0 / AI 100-1 MANAGE (recovery and resilience); NIST SSDF SP 800-218 v1.1 RV.2 (remediate and recover) |
| Have a written incident response and recovery process, however short: who is told, what the first steps are, how to take the app to a safe state, and how findings get fed back into a fix. After a real incident, confirm a root-cause review happened and produced at least one concrete change. | When something breaks, the time you spend deciding what to do is downtime, and panic decisions in the moment tend to make things worse. A short written plan turns chaos into steps, and a root-cause review after the fact is how an incident becomes a fix instead of a recurring surprise. The point is to learn from the failure in a way that holds, not to assign blame for it. | An incident process document with the notification path, the first containment steps, and the recovery steps, plus, for any incident that has occurred, a short root-cause record naming the contributing cause and the change it produced. | NIST SSDF SP 800-218 v1.1 RV.1, RV.2, RV.3 (identify, remediate, and analyze the root cause of vulnerabilities and incidents); NIST AI RMF 1.0 / AI 100-1 MANAGE |

## Extra-mile checks

Frontier rigor. Even strong engineering teams treat these as extra, extended effort, and they are wasted on a small app. Run them on this domain's surface only when the stakes gate forces it, as annotated. If zero stakes signals touch this surface, none of these apply, and proposing them anyway is over-engineering.

| Check | Why it matters to your business | Evidence the agent must produce | Citation | Stakes gate + frontier pattern |
|---|---|---|---|---|
| Set an explicit reliability target for the service (for example, available 99.9% of the time) and an error budget: the small amount of failure that target allows, with a rule that when the budget is spent, new features pause and stability work takes priority. Then track availability against it. An error budget is the agreed room to fail before reliability work outranks shipping. | On a service many people depend on, "ship faster" and "stay reliable" pull against each other, and without an agreed line the reliability quietly erodes until an outage forces the issue. A target and a budget make the trade-off a rule instead of an argument: the service earns the right to ship by staying inside its budget, and a spent budget is an automatic, unemotional signal to stop and fix. | A reliability-target record: the stated availability target, the error budget derived from it, the rule for what happens when the budget is exhausted, and the measurement showing current availability against the target. | NIST AI RMF 1.0 / AI 100-1 MANAGE (manage and monitor risk over time); OWASP Top 10:2025 A09 Security Logging and Alerting Failures | Forced by S5 (blast radius) on a service with a real uptime promise or paying users. Frontier pattern: error budgets and service level objectives. |
| Release risky changes progressively rather than to everyone at once: ship to a small fraction of users or traffic first, watch the error and health signals, and expand only if they hold, with the ability to switch a change off instantly through a feature flag (an on/off switch that disables a feature without redeploying). | A change pushed to everyone at once that turns out to be broken is an outage for your entire audience with no quick exit. Releasing to a slice first means a bad change harms a few people for a few minutes instead of all of them for hours, and an instant off-switch means you stop the damage without a frantic redeploy. On a shared system, this is the difference between a contained stumble and a full outage. | A progressive-delivery record: the mechanism that releases a change to a subset first (staged rollout, canary, or feature flag), the signals watched before expanding, and confirmation a feature can be switched off without a redeploy, gaps flagged. | OWASP Top 10:2025 A08 Software or Data Integrity Failures; NIST AI RMF 1.0 / AI 100-1 MANAGE | Forced by S5 (blast radius), where a bad release reaches many users at once. Frontier pattern: progressive delivery (canary, feature flags, staged rollout). |
| Rehearse failure on purpose: run a controlled drill where you deliberately break a part of the system (take the database offline, cut a dependency, simulate the AI provider going down) and confirm the app degrades safely, the alerts fire, and the recovery and restore steps actually work under realistic conditions. A scheduled rehearsal of an outage is sometimes called a game day. | The first real test of your safety net should not be a real disaster. Deliberately breaking a piece, in a window you chose, surfaces the broken backup, the alert that never fires, and the recovery step nobody documented, while the stakes are a rehearsal instead of a live incident. This earns its cost only on a system that already has redundancy and real reliability needs; on a small app there is nothing yet to rehearse against. | A failure-drill record: the failure deliberately induced, what the system and the alerts actually did, whether recovery and restore worked, and every gap the drill exposed with the fix it prompted. | NIST AI RMF 1.0 / AI 100-1 MANAGE (resilience and incident response); NIST SSDF SP 800-218 v1.1 RV.3 (root-cause analysis) | Forced by S5 (blast radius) on a system with real reliability needs and redundancy already in place. Frontier pattern: chaos engineering and game days. |
| For an app with an autonomous agent that takes actions on its own, confirm there is a kill switch that stops the agent immediately, that its actions are logged in enough detail to reconstruct what it did, and that an alert fires on abnormal agent behavior (a burst of actions, repeated failures, an action outside its normal pattern). | An agent acting on its own with no off-switch is a process you cannot stop when it goes wrong, and one whose actions are not logged is a process you cannot explain after the fact. A tricked or looping agent can cause real damage fast; the ability to halt it instantly, see exactly what it did, and be warned the moment it misbehaves is what keeps an agent incident from becoming an agent catastrophe. | An agent-control record: the kill switch and where it is triggered, a sample of the agent's action log showing the detail captured, and the alert that fires on abnormal behavior with its threshold, gaps flagged. | OWASP Top 10 for LLM Applications 2025 LLM06 Excessive Agency; OWASP Top 10:2025 A09 Security Logging and Alerting Failures; NIST AI RMF 1.0 / AI 100-1 MANAGE | Forced by S4 (autonomous agent), where an agent's unsupervised actions need a stop, a record, and a warning. Frontier pattern: agent kill switch, action logging, and anomaly alerting. |

## When to stop and hire a human

Bring in an independent reviewer, and do not rely on AI self-review alone, for this domain when any of these are true:

- A real incident or outage has happened on a system that serves many people, holds money, or holds personal data (S5 with S1 or S3), and you cannot fully explain the root cause or confirm the change you made actually closed it. An incident you cannot account for on a high-stakes system tends to recur, and guessing your way to "probably fixed" is how the second outage arrives.
- Your app does things that cannot be undone (S6) and you cannot produce a backup with a proven restore and a rollback path you have actually used. Irreversible actions with an unproven safety net are the case where a single bad day has no way back, and that is not a bet to confirm on an automated check.
- The error-handling map shows a security-relevant check that allows or proceeds when it fails (a fail-open hole) on a surface carrying real stakes, and you cannot confirm the fix makes it fail closed everywhere it should. A door that opens whenever a lock errors out is exactly the quiet failure this domain exists to catch.
- The app runs an autonomous agent (S4) and you cannot demonstrate a working kill switch, an action log, and an alert on abnormal behavior. An agent you cannot stop, cannot reconstruct, and are not warned about should not run unreviewed on anything that matters.

This protocol catches a meaningful slice of operational and recovery problems cheaply, and it is the right first pass for almost every app. It is not a guarantee. An AI reviewing the operational setup its own class generated is weaker than an independent human review on exactly the failure paths that only show up under real load, because the demo never produced them and the same reasoning that skipped the safety net tends to read its absence as fine. Domain K covers what a professional review adds and where its honest ceiling sits. For an app carrying real stakes on this domain, route there.

## Agent instructions

```
DOMAIN I: OPS, UPTIME, BACKUP, ROLLBACK

Scope by stakes (stakes are local to this domain's operational and recovery surface):
  FLOOR fires for any real app: errors on security-relevant checks fail closed (deny when a
  check cannot complete), a backup exists for anything precious with at least one restore
  proven, a rollback path is known, security-relevant events are logged usefully (and the
  log leaks no secrets or full PII).
  If the app serves many users or shares infrastructure (S5), or holds money (S1) or personal
  data (S3) on this surface, run STANDARD here.
  If S5 combines with another signal, run EXTRA-MILE.
  HARD OVERRIDE: if an AI agent acts on its own (S4), the agent kill-switch, action-logging,
  and anomaly-alerting check is MANDATORY at EXTRA-MILE regardless of the signal count.
  DAY-ONE RULE: if the app calls a paid AI service in production, usage-and-cost MONITORING
  with an alert is FLOOR here (the hard spend cap lives in the payments-and-cost domain).
  ANTI-OVER-ENGINEERING: if zero stakes signals touch this surface, run FLOOR only. Do NOT
  propose error budgets, formal uptime targets, progressive-delivery infrastructure, or
  chaos-engineering game days for an app with nothing to be resilient about yet. Over-applying
  reliability machinery to a low-stakes app is a failure, not diligence.

Circularity note (see the circularity-guard protocol):
  The failures here are absences, not broken lines: no error handling, no tested restore, no
  alerting. The AI that built the app reads "no error path here" as "this cannot error" and
  "no alert" as "nothing to alert about," because in the demo nothing failed. Run this domain
  in a CLEAN, fresh context with no access to the build rationale, and prefer a different model
  from the one that wrote the code. Check by demanding the proof (the last restore that worked,
  what the code does when a check fails, what must break before anyone is told), not by asking
  whether the app "runs."

Produce these artifacts (not verdicts):
  FLOOR:
    1. Error-handling map (security paths): each security-relevant check, what it does on error
       or timeout (deny or allow), every fail-open path (allows or proceeds on a failed check)
       flagged.
    2. Backup-and-restore record: what is backed up (database, files, content) and how often,
       plus the result of at least one ACTUAL restore, or a flag that no restore was ever
       verified.
    3. Rollback note: the exact mechanism that returns the app to the previous working version,
       confirmed to exist, or a flag that no rollback path is known.
    4. Logging inventory: which security-relevant events are logged, a sample entry, where the
       log is read, and confirmation it leaks no secrets or full PII; unlogged critical events
       or secret-leaking logs flagged.
    5. Usage-and-cost monitor (if a paid AI call exists): what it watches, the alert threshold,
       and how the alert reaches a human, or a flag that paid AI usage is unmonitored.
  STANDARD (many users, or money/personal data on this surface):
    6. Exceptional-condition review: each external call or fallible operation, what the code
       does on failure (resulting state and user message), crashes/hangs/inconsistent-state
       paths flagged.
    7. Alerting map: which recorded events raise an alert, the threshold each, the channel to a
       human, and confirmation an alert was tested to arrive; critical events with no alert
       flagged.
    8. Backup-plan record: backup frequency tied to the acceptable data-loss window, backups
       stored separately from the live system, a current restore test, and the realistic
       data-loss window stated; gaps flagged.
    9. Incident-process document: the notification path, first containment steps, and recovery
       steps; plus, for any incident that occurred, a root-cause record naming the contributing
       cause and the concrete change it produced.
  EXTRA-MILE (blast radius with another signal, or autonomous agent):
    10. Reliability-target record: the availability target, the error budget, the rule when the
        budget is exhausted, and current availability measured against it.
    11. Progressive-delivery record: the mechanism that releases to a subset first, the signals
        watched before expanding, and confirmation a feature can be switched off without a
        redeploy; gaps flagged.
    12. Failure-drill record: the failure deliberately induced, what the system and alerts did,
        whether recovery and restore worked, and every gap exposed with its fix.
    13. Agent-control record (if S4): the kill switch and where it is triggered, a sample of the
        agent's action log, and the anomaly alert with its threshold; gaps flagged.

Output a findings table with these columns and nothing weaker than evidence:
  | Severity | Business risk in plain words | Evidence artifact | Citation | Suggested fix |

Rules:
  - Translate every finding into a concrete business consequence a non-coder understands
    (for example: "the day your database fails you discover the backups stopped running three
    months ago and there is no way to get your customers' data back," not "no verified restore").
  - Cite only the controls named in this domain (A01, A08, A09, A10, LLM02, LLM06, LLM10,
    NIST SSDF RV.1-RV.3, NIST AI RMF MANAGE). Do not invent IDs and do not print ASVS
    V-numbers. Backup and rollback are not a single named OWASP control; back them with NIST
    SSDF RV.2 and AI RMF MANAGE, and state the plain meaning as the durable part.
  - No bare verdicts. "Looks reliable" is not a finding. Attach the artifact that proves the
    claim (the restore result, the error-handling decision, the alert that fired); a confident
    verdict with no evidence manufactures false trust.
  - If you cannot produce an artifact a check demands, say so and mark that check INCOMPLETE.
    An untested backup reported as "fine" is the exact failure this domain is built to expose.
```
