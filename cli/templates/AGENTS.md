# AGENTS.md: NONA

This is the drop-in entrypoint. If you are an AI agent and this file is in the project you are working on, the person who built this app wants you to audit it for them. They cannot read the code. Your job is to find what could hurt their business, prove each finding with evidence, tell them what to fix first, and tell them the one moment they should stop and pay a human expert.

This file is the runnable spine. It carries the whole protocol in compact form so you can run the audit from here alone. Each section links to a longer file under `protocol/` for the full reasoning, the complete check tables, and the citations. Read the linked file for any domain before you go deep on it. The standards behind every check are mapped in `CITATIONS.md`. The plain-language meaning of any technical term is in `docs/glossary.md`.

A note for the person who built the app, before the agent starts: NONA is free and open-source, it is plain markdown you can read yourself, and it only ever instructs the agent to read your own code and report back. It never tells an agent to fetch and run anything from outside, never asks for your keys, and never sends your code anywhere. If you forked it or installed it as a skill, read `SECURITY.md` first and confirm it is the genuine version before trusting it.

---

## What NONA does

A person built an app with an AI coding tool and cannot read the result. They do not know which questions a careful engineer would ask, so they cannot ask their own agent the right ones, and a thumbs-up from the same tool that wrote the code proves nothing. NONA is the checklist that careful engineer carries, written down, so the audit is never blocked by what the builder happens to know. The builder does not need to know what to ask. NONA already asked it, and handed the questions to you.

NONA covers twelve areas, lettered A through L, and within each it knows three depths of rigor: floor, standard, and extra-mile. The coverage is comprehensive on purpose, reaching practices that even strong engineering teams treat as extended effort. It stays smart instead of wasteful by reading how much is genuinely at stake in this specific repository and turning the rigor up only where the stakes earn it. A payments-and-login app with an autonomous agent earns the frontier checks. A weekend to-do app earns only the floor.

Two rules run through everything you do. First, produce artifacts, not verdicts. You do not get to say "looks secure." You produce the actual list of secrets and where each one lives, the actual map of who can reach what, the actual result of checking that a package exists. A confidence score with nothing behind it manufactures false trust, and false trust is the exact failure NONA exists to fight. Second, be honest about the ceiling. An AI checking AI-written code catches a meaningful slice of serious bugs cheaply and misses most of them when it works alone. That is a real gain at a real limit, and you state the limit plainly rather than hand the builder an official-looking clean report they will stop questioning.

---

## How to run the audit

Six steps, in order. Do not skip the setup steps; they are what make an AI audit worth trusting at all.

### Step 0. Run as a stranger, in a clean context

Start in a fresh session that has no memory of how this code was written: no build chat history, no design rationale. Meet the code the way an outsider would, as a finished thing to inspect, with no story attached that explains away its flaws. This is the cheapest lever and it is measured: a review in a separated context beat a same-session review, and the gain was largest on critical errors (about eleven percentage points more critical-error detection; Cross-Context Review). Reviewing twice in the same session bought almost nothing. The gain comes from looking from a separated context, so more passes in the same chat buy you little.

Stronger still is a different model. If a Claude-based agent built this app, run the audit with a different model family where you can, and the reverse if a different family built it. Models from the same family share training, so they share blind spots, the way two engineers from the same shop make the same mistakes. Treat this as a recommendation. The evidence supports the direction; it does not pin a catch rate, and you should distrust anyone who claims one. If you only have the same model, still run in a clean context, which is independently measured to help.

State, in the audit output, which model wrote the app (best known) and which model is running this audit. If they are the same family, flag the review as weaker and recommend re-running the high-stakes domains on a different model. The full method is in `protocol/02-circularity-guard.md`.

### Step 1. Detect the stakes signals

Scan the repository for six stakes signals. A stakes signal is a concrete, checkable property that means a mistake here would actually hurt. Each one is an observable fact about the code, so two agents reading the same repo should find the same signals.

- **S1 Money.** Payments, billing, payouts, or credits with cash value. Evidence: payment-provider libraries, checkout code, webhook handlers, credit or balance logic.
- **S2 Identity/Auth.** Login, sessions, password reset, or roles and permissions. ("Auth" is authentication and authorization: proving who someone is, and deciding what they may do.) Evidence: login and session code, role checks.
- **S3 Personal data.** The app stores PII, personally identifiable information: email, phone, name, health details, location, private messages. Evidence: database tables and fields holding personal information.
- **S4 Autonomy.** An AI agent in the app can take actions on its own (send an email, run code, call a tool, spend money) without a human approving each action. Evidence: code where an AI calls tools or acts with no human gate.
- **S5 Blast radius.** One failure harms many people at once: many users, multiple separate customers on one system (multi-tenant), a public API, shared infrastructure. Evidence: multi-tenant patterns, a public API, shared infra.
- **S6 Irreversibility.** An action cannot be undone: delete, transfer, publish, send. Evidence: permanent delete, transfer, publish, or send actions.

Reading the code is the primary source, because code does not misremember. But a non-coder may not describe their own app's stakes accurately, so also ask these five plain questions and record the answers. Treat a "yes" as a signal present even if the code did not obviously show it.

1. Does your app touch money in any way (payments, subscriptions, payouts, credits worth real money)? (S1)
2. Do people log in (accounts, passwords, sign-in, password reset, or roles like user versus admin)? (S2)
3. Do you store anything about real people (names, emails, phones, addresses, location, health, private messages)? (S3)
4. Can the AI in your app do things on its own (send, run code, call a service, change data, spend) without you approving that action first? And separately, are there actions that cannot be undone once done (delete an account, transfer, publish, send)? (S4 and S6)
5. If something broke, how many people would it hit at once: just you, a handful, or many strangers and multiple customers on the same system? (S5)

The full engine, with the exact detection guidance and the anti-over-engineering rule, is in `protocol/01-stakes-gating.md`.

### Step 2. Pick a tier per domain (stakes are local)

Compute a tier for each of the twelve domains separately, looking only at the stakes signals that touch that domain's surface. Stakes are local. Money on the payments surface raises the rigor on the payments domain while the uptime tooling, which carries no money, stays at its own lower tier. The base rule, read as a recipe:

```
for each domain A through L:
  signals_here = the stakes signals (S1 to S6) present on THIS domain's surface
  if signals_here == 0:                          tier = FLOOR
  elif signals_here == 1 and not (S4 or S6):     tier = STANDARD
  else:                                          tier = EXTRA_MILE
```

In words: no signal on a domain gets the floor; exactly one signal that is not autonomy or irreversibility gets the standard; two or more signals, or any autonomy or irreversibility at all, gets the extra-mile. Autonomy and irreversibility are singled out because each one alone can turn a small bug into a catastrophe.

The three depths:

- **Floor.** "Did anyone do the obvious thing?" Non-negotiable baseline for any app. Skipping it is how apps ship with a wide-open door.
- **Standard.** "What a competent team would do." For an app with something real to protect, like logins or customer data.
- **Extra-mile.** The frontier. Practices even strong teams treat as extended effort: adversarial penetration testing, AI cost guardrails, containment patterns that box in an AI agent, formal threat modeling. A fully built-out tier, earned only when the stakes justify it.

**Hard overrides (apply these before reporting, they sit above the count):**

- **Any S4 (an AI agent acts on its own) forces EXTRA-MILE on B (security), F (AI-generated code), and K (pen-test).** Then sandboxing, least-privilege, a prompt-injection red-team, and at least one containment pattern become mandatory, not optional.
- **Any S1 (money) or S6 (irreversible) forces at least STANDARD on D (data and privacy) and E (payments and AI-cost).** If the same app also has S5 (blast radius), those two domains go to EXTRA-MILE.
- **Any paid AI API call in production forces cost guardrails (a hard spending cap and a soft warning) at the FLOOR, on day one,** because a runaway loop with no cap can drain a budget overnight.

**The anti-over-engineering rule (binding):** if zero stakes signals are present, do NOT propose bug bounties, chaos engineering, formal uptime targets (SLOs), canary infrastructure, or fuzzing campaigns. Recommend only the floor. Over-applying elite practice to a low-stakes app is a failure of judgment, not diligence.

**The universal floor, never skipped even at zero stakes:** dogfood the app (use it as a real user before shipping); run the free shift-left scanners (dependency, secret, and basic static analysis) that catch obvious leaks and risky packages; have one pre-mortem conversation (pretend it is a year later and the project failed, list why, fix what you can now); and if there is any paid AI call, cap the spend and run one basic eval (a small report card for the AI feature).

### Step 3. Run each domain's agent-instruction block

For each domain, at the tier you picked, run the domain's audit. Each per-domain section below carries a compact checklist and links to the full file under `protocol/` that contains the complete check tables and the runnable agent-instruction block. Run that block. Where circularity matters (it matters most on A, B, C, F, J, K, and on fix-verification in L, because those are the checks a same-context self-review waves through), run the domain in the clean, separated context from Step 0. Verify packages against the real registry rather than your own memory of what you imported, because a name you are confident about can still be one a model invented.

### Step 4. Output findings as artifacts, not verdicts

Every domain produces the named artifacts in its block, and then a findings table with these exact columns:

```
| Severity | Business risk in plain words | Evidence artifact | Citation | Suggested fix |
```

Rules for the table, enforced on every row:

- Translate every finding into a concrete business consequence the builder understands. Not "IDOR present" but "a stranger can open any other customer's invoices by changing a number in the address bar." Not "missing signature verification" but "a stranger can get the paid plan for free by sending a forged payment message."
- No bare verdicts. "Looks secure," "passed," "no issues" with no inspected artifact behind it is itself flagged as an incomplete check. Attach the evidence: the file and line, the query, the route, the package name, the actual setting value.
- Cite only the controls named in the domain you are running and mapped in `CITATIONS.md`. Do not invent control IDs. Where a control ID is version-fragile, state the plain meaning and cite at the document level. In particular, do not print OWASP ASVS control numbers beyond V1 1.2.5; cite ASVS at the document level otherwise. Cite CIS benchmarks at the named-benchmark level for the running major version, not by line-item number.
- If you cannot produce an artifact a check demands, say so and mark that check INCOMPLETE. An untested backup reported as "fine" is the exact failure this protocol exists to expose.

### Step 5. State residual risk and the hire-a-human decision

Do not declare the app safe. State what you checked, what you could not check this way, and what remains uncertain. Report a check that found nothing as exactly that, "found nothing," which is an absence of findings and falls short of "is safe." Silence is never success.

Then route. Run the triage and the explicit hire-a-human decision in Domain L (`protocol/l-decide-and-act.md`), which looks at the whole pile of findings at once, ranks them by what a mistake costs the business (likelihood times impact), and applies the escalation gates. The honest ceiling belongs in this statement: an AI audit run well, in a clean context and ideally on a different model, catches a meaningful slice of serious bugs and misses most injected errors when it works alone. In the cleanest measurement available, even the best condition, a fresh separated context, caught only about 28.6 percent of injected errors by F1 (a combined score of bugs found against false alarms raised; Cross-Context Review). Roughly seven in ten survived. That is a useful first pass and a genuine head start for a paid human. It is not a safety guarantee, and adding a second model does not turn it into a professional penetration test. For an app that handles money, holds a lot of people's data, can take actions that cannot be undone, or runs an autonomous agent, tell the builder in writing to get an independent human review. NONA's job is to tell them when they have crossed that line, not to pretend they have not.

---

## The twelve domains (compact checklists)

Each block below is the short version. Read the linked `protocol/` file for the full check tables, the "what you can't see here" reasoning, the exact citations, and the runnable agent-instruction block. The letters, the tier names, and the stakes signals are the same everywhere.

### A. Intent verification: does the code do only what you asked, safely

Full file: `protocol/a-intent.md`. The universal floor of the whole audit. "It works" is a claim about the screen; "it is safe" is a claim about what else the code can do when someone pushes on it.

- Tier: FLOOR always, even at zero stakes. S1 or S2 on a feature adds STANDARD; S4 or S6 adds EXTRA-MILE.
- Floor artifacts: an intent-vs-behavior table per feature (stated intent beside observed behavior, differences flagged); a side-effects list (every write, call, send, delete, each marked expected or unexpected); an unhappy-path list (the bad, empty, hostile-input cases the code handles and the gaps it does not); a one-paragraph definition of "correct and safe" per feature, written before judging the code.
- Standard (money/identity features): a path trace per feature with off-intent branches flagged; server-enforcement evidence (the rule is enforced by the server, not just hidden in the screen); a missing-control list.
- Extra-mile (autonomy/irreversible): a golden suite (input cases and asserted acceptable behavior with a pass/fail run); an output-verification artifact (a check that fires before an irreversible action commits); a written threat model.

### B. Secrets, access, RLS, IDOR, auth: the security core

Full file: `protocol/b-secrets-access-auth.md`. Who can see what, who can do what, and where the keys live. (RLS, row-level security, is a database rule limiting which rows a user can reach. IDOR, insecure direct object reference, is a stranger opening someone else's record by changing a number in the web address.)

- Tier: any login (S2) makes this STANDARD at minimum. S2 with S3 or S5 makes it EXTRA-MILE. **Hard override: any S4 forces EXTRA-MILE, and the least-privilege/sandboxing check plus the prompt-injection red-team are mandatory.** No login, no roles, no PII, no agent collapses to FLOOR.
- Floor artifacts: a secret inventory (every secret, its location, "server-side only" or "EXPOSED" in the browser bundle, behind a `NEXT_PUBLIC_` prefix, or in git history, exposed ones flagged for rotation); an RLS coverage table (every table in an exposed schema, RLS on or off, default-deny confirmed); an ownership-check result per user-owned record type (the live IDOR check); a protected-route map (the server, not the browser, rejects an unauthenticated request).
- Standard: an authorization map (every protected action and data type, its rule, the server location enforcing it, gaps flagged); a privileged-action list (admin actions guarded by a server-side role check, not a hidden button); a policy-soundness review (no RLS policy trusts a value the user can change about themselves); a session-and-credential report (expiry, revocation, reset-flow owner-binding, login rate limiting).
- Extra-mile: an access-attempt log (actually try the door as the wrong user and record what the server returned); a privilege map (each component uses least privilege; the master key is invoked only in trusted server tasks; an autonomous agent is sandboxed); an injection-attempt log (hidden instructions tried against the agent, with the control that blocked or failed to block each).

### C. Input and injection: including prompt injection on your own AI

Full file: `protocol/c-input-injection.md`. Injection is when text from the outside world gets treated as a command instead of data. Covers SQL injection, cross-site scripting, command injection, and prompt injection (hostile text fed to your app's AI feature overriding its instructions).

- Tier: FLOOR always. S3 behind an injectable input adds STANDARD. An AI feature that reads untrusted outside text (a web page, an email, an upload, a record another user wrote) earns STANDARD prompt-injection handling regardless of other signals; if that AI can also act on its own (S4), it earns EXTRA-MILE with a red-team and a containment pattern. An AI surface that only reads trusted fixed input you wrote drops to FLOOR.
- Floor artifacts: an input-to-sink map (every external input and where it lands); a database-query list (each query touching input marked parameterized or string-built); an output-encoding list (each place input is shown on a page marked encoded or raw); a command/path list; a log-injection list; an AI-feature note (how user text is kept separate from your instructions, and where model output goes).
- Standard: a validation map (server-side validation on personal-data input paths); a destination-encoding table (the value is encoded for the specific destination it reaches, not merely "validated"); an untrusted-input inventory per AI feature; an AI-output handling map (model output is untrusted input; treat it as such).
- Extra-mile: a red-team log (prompt-injection attempts and their results); a containment-design note (action-selector, plan-then-execute, dual-LLM, or context-minimization, with what each blocks); a fuzzing summary for a complex untrusted-input parser under real stakes.

### D. Data and privacy: PII handling, leakage, deletion

Full file: `protocol/d-data-privacy.md`. The personal information the app holds and the ways it can leak: logs, error pages, over-wide network responses, and AI replies that repeat back something private.

- Tier: FLOOR on any app touching PII. S3 present adds STANDARD; money (S1) or irreversibility (S6) on the data adds STANDARD; S5 combined with S1 or S6 adds EXTRA-MILE. An app that genuinely stores nothing personal confirms that absence and stops.
- Floor artifacts: a transport-protection result (all PII over HTTPS/TLS); a repository-exposure list (real PII or credentials in the working tree or git history, marked for removal and rotation); a no-secret-in-logs result (sensitive fields absent from logs and error responses); a model-output disclosure result (probe whether the AI reply can leak another person's data or a secret); a deletion-path artifact (the actual steps that remove one named person's data, with confirmation it is gone, not merely hidden).
- Standard: an at-rest protection map (stored data encrypted; passwords hashed, not plain); a data-flow inventory (every PII category, the stores holding it, every external service receiving it and the fields each gets); a data-minimization result (collected versus needed fields, plus a retention point); an AI-data-handling result (what each AI provider retains or trains on).
- Extra-mile: a data-separation artifact (direct identifiers kept apart or masked); a leakage-detection artifact (a detector watching responses, logs, and AI output for email, payment, or ID patterns); a generative-AI data-risk record per AI surface.

### E. Payments, monetization, and AI-cost integrity

Full file: `protocol/e-payments-ai-cost.md`. Charging correctly, blocking billing tricks, and stopping runaway AI spend (denial-of-wallet, where the bill, not the server, is the target). (A webhook is an automated server-to-server message confirming an event like a payment; a forged one can fake a paid order.)

- Tier: money (S1) or irreversibility (S6) makes this STANDARD at minimum; S1 or S6 with S5 makes it EXTRA-MILE. **Day-one rule: any paid AI call in production forces the two cost-cap floor checks even with no payments.**
- Floor artifacts: the webhook-route list with the exact signature-check line, or a named "NO SIGNATURE CHECK" route; the server code showing price, plan, and paid-status are re-read from your own database or the provider, never from the browser's request; the idempotency mechanism (a replayed webhook is a safe no-op); the client-bundle and git secret-scan result for provider keys; the hard total spend cap with its value; the per-user or per-session rate limit on the paid-AI path.
- Standard: a business-flow abuse table (checkout, upgrade, refund, payout, credit grant, coupon, each with its abuse protection or "UNPROTECTED"); an ownership check on every billing record; billing-event logging; fail-closed handling of payment and provider errors; layered AI cost caps (per session, per user per day) plus a soft warning threshold.
- Extra-mile: a business-flow red-team log (attempt the abuse and record what the app allowed); a model fallback chain that keeps the caps; a different-model review plus a human-approval gate before an irreversible money action; a small eval and a runtime usage-and-cost monitor for the paid AI feature.

### F. AI-generated-code patterns and circularity: the signature domain

Full file: `protocol/f-ai-code-circularity.md`. The same kind of AI wrote and is auditing this code, so the usual safety margin of a fresh set of eyes is gone unless you rebuild it on purpose. This domain is the circularity guard applied, plus the AI-built patterns most likely to bite. The cross-cutting method is in `protocol/02-circularity-guard.md`.

- Tier: FLOOR always (the circularity problem is present the moment an AI wrote the code). S1, S3, or S6 adds STANDARD. **Hard override: any S4 forces EXTRA-MILE, and the different-model review, the output-verification harness, and the provenance log are mandatory.** A genuinely low-stakes weekend tool runs FLOOR only.
- Floor artifacts: a context-separation statement (the audit ran in a fresh session with no build history; note any build rationale the reviewer saw, which weakens the result); a model-provenance line (which model wrote the app, which is auditing, with a same-family warning if they match); evidence-not-verdict findings (every "checked" carries the inspected artifact; bare "looks fine" flagged); a residual-risk statement with an explicit "not a safety guarantee" line.
- Standard: an AI-code review map (which meaningful blocks were AI-written and what independent check covered each high-stakes one); a business-logic review (the money, permission, and workflow rules as intended versus what the code enforces; this is the dominant AI failure class); an output-handling review; a provenance record.
- Extra-mile: a different-model review record (a different family reviews the high-stakes code, findings listed separately); a golden suite; an output-verification harness with self-consistency before an irreversible step; a maintained provenance log.

### G. Dependencies and supply chain: hallucinated and typosquatted packages

Full file: `protocol/g-dependencies-supply-chain.md`. The borrowed code the app pulls in. AI tools invent packages: about one in five AI code samples references a non-existent package, and the invented names repeat, so an attacker registers one and waits. The plain name is slopsquatting. The AI plug-ins, skills, and tool descriptions installed to build or run the app are borrowed code too, with full reach.

- Tier: FLOOR always (the slopsquatting risk does not care how small the app is). S5 adds STANDARD. S5 with S1 or S6 adds EXTRA-MILE on the build-integrity checks. **S4 (an agent that loads and acts on plug-ins, skills, or tools) adds EXTRA-MILE on the AI-component checks.** A small single-user app with no money, no PII, no agent runs FLOOR only.
- Floor artifacts: a package-existence result (every imported and declared package marked "genuine on the official registry" or "not found / suspected impostor," suspicious ones flagged by name; the slopsquatting check); a lockfile artifact (a committed lockfile covers the full tree and the build uses it); a dependency-vulnerability result (the full tree scanned, every known critical or high hole listed with its fixed version); a build-provenance artifact (a record of how the deliverable was built).
- Standard: a component inventory (an itemized list of everything shipped, often called an SBOM, the ingredient label for your software); a dependency-vetting result (maintained, widely used, actually needed, with abandoned or unused ones flagged); a signed-provenance artifact (the build runs on a hosted platform that signs its output); an AI-component provenance result.
- Extra-mile: a hardened-build artifact (isolated, tamper-resistant build plus source-history verification); a pinning-and-monitoring artifact (dependencies pinned to verified content hashes plus continuous re-scanning); an AI-component vetting artifact (every plug-in, skill, and tool the agent loads, what it does, its reach, its pinned reviewed version).

### H. Config and deploy hygiene: misconfig, default creds, secret in the bundle, headers

Full file: `protocol/h-config-deploy.md`. The settings around the app: what shipped to the browser, what got left on a default, and which front doors the host and database leave open. (Security headers are short instructions a server attaches to each response that switch on browser-side protections the browser otherwise skips.)

- Tier: FLOOR for any deployed app, including a weekend project with no login. Stored PII (S3) adds STANDARD. Money secrets (S1) or PII (S3) combined with S5 adds EXTRA-MILE.
- Floor artifacts: a secret inventory (every configured secret, "server-side only" or "EXPOSED" in the bundle, behind `NEXT_PUBLIC_`, or in git history; a `NEXT_PUBLIC_` prefix ships a value to the browser, so any secret with it is published); a production-setting check (debug off, verbose errors off, environment mode set, shown as actual values); a credentials check (no default, placeholder, or seeded login still works); the header configuration shipped (baseline headers present versus missing); the database transport and exposure settings (encrypted connections enforced, network access restricted).
- Standard: a database hardening checklist (the broadly-safe Level 1 baseline for the running major version, each item's actual state); a cloud-and-headers report (storage buckets not public unless intended, least-privilege account access, platform logging on, plus a content security policy); an environment-separation result (production secrets differ from development, no `.env` fetchable as a public URL); an AI-config check (the system prompt and model config are server-side and not extractable).
- Extra-mile: a Level 2 hardening record (the stricter tier for the database and cloud foundation); pipeline-scanning evidence (secret and config scanning on each deploy); a deployment-integrity record (the live version was built from reviewed source through the expected pipeline).

### I. Ops, uptime, backup, rollback: detection, fail-safe, recover

Full file: `protocol/i-ops-uptime-backup.md`. What happens after launch when something breaks and nobody is watching: detection and alerting, error handling, and backup and rollback. The failures here are absences (no error handling, no tested restore, no alert), which a self-audit reads as "nothing to handle."

- Tier: FLOOR for any real app. S5, or money (S1) or PII (S3) on this surface, adds STANDARD. S5 with another signal adds EXTRA-MILE. **Hard override: any S4 makes the agent kill-switch, action-logging, and anomaly-alerting check mandatory at EXTRA-MILE.** **Day-one rule: any paid AI call makes usage-and-cost monitoring with an alert a FLOOR check here** (the hard spend cap itself lives in Domain E). **Anti-over-engineering: at zero stakes, run FLOOR only; do not propose error budgets, formal uptime targets, canary infrastructure, or chaos game-days for an app with nothing to be resilient about yet.**
- Floor artifacts: an error-handling map for security paths (each security-relevant check denies, not allows, when it errors or times out; every fail-open path flagged); a backup-and-restore record (what is backed up, plus the result of at least one actual restore, because a backup is proven only by a restore that worked); a rollback note (the exact way back to the previous working version); a logging inventory (security-relevant events logged usefully, and the log leaks no secrets or full PII); a usage-and-cost monitor if a paid AI call exists.
- Standard: an exceptional-condition review (every external call resolves to a safe state on failure); an alerting map (recorded events raise a tested alert to a human); a backup-plan record (frequency tied to acceptable data loss, backups stored separately, the realistic data-loss window stated); an incident-process document with a root-cause record for any incident that happened.
- Extra-mile: a reliability-target record (an availability target and an error budget); a progressive-delivery record (release to a slice first, with an instant off-switch); a failure-drill record (a controlled outage rehearsal); an agent-control record (kill switch, action log, anomaly alert).

### J. Architecture sanity: trust boundaries, containment

Full file: `protocol/j-architecture.md`. The shape of the app: which parts trust which, where data crosses from untrusted to trusted, and whether one broken lock stays one broken lock instead of opening the whole place. Architectural design flaws and privilege-escalation paths are the class rising fastest in AI-built apps, because design has no general right answer to copy.

- Tier: FLOOR for any app with more than one part talking to another or a public/private line. Shared users, money, or irreversible actions (S5, S1, S6) adds STANDARD. S5, or S1 with scale, adds EXTRA-MILE. **Hard override: any S4 forces EXTRA-MILE, and the containment-architecture record plus the sandbox-boundary record are mandatory.** A small app with no agent, few users, no money, nothing irreversible runs FLOOR only.
- Floor artifacts: a trust-boundary map (every part, every point where untrusted input crosses into a trusted part, and the check at each crossing); a separation result (public-facing code reaches the database, the master key, or privileged actions only through the server); a fail-safe result (decisions deny, not allow, when a check errors or a dependency is down).
- Standard: a threat-model record (walk the standard categories of what can go wrong at each boundary, sometimes called a STRIDE pass); a privilege map (trace whether any low-power or externally-reachable part can reach a high-power ability); a dependency-trust map (outside replies are validated, not blindly obeyed); a flow review (the decision is formed and checked before an irreversible action runs).
- Extra-mile: a full, dated threat-model document kept as a living reference; a containment-design record (a named isolation pattern for the autonomous agent: action-selector, plan-then-execute, map-reduce, or dual-LLM, confirmed to hold under hostile input); a sandbox-boundary record (the part that runs code or acts is confined to least power with a human gate on irreversible actions).

### K. Pen-test and professional review: the honest ceiling

Full file: `protocol/k-pentest.md`. Trying the doors as an adversary against the running app, and stating where the cheap AI version stops being trustworthy. This domain carries the honesty clause: it exists to say, out loud, when free is not safe enough.

- Tier: login (S2) makes this STANDARD. Money (S1) or PII (S3) makes it STANDARD at least, EXTRA-MILE with S5. **Hard override: any S4 forces EXTRA-MILE, and the prompt-injection red-team is mandatory.** No login, no money, no PII, no agent, nothing irreversible runs FLOOR only; do not recommend a commissioned pen-test or a paid bug bounty for an app with nothing worth attacking.
- Floor artifacts: a scan-result artifact (dependency scan, secret scan, and static-analysis pass, each confirmed run against this repo); an attempt log (actually try the obvious attacks against the running app: reach another record by changing the ID, hit a protected route without logging in, submit hostile input, and record what came back); a limits statement (what was tested and what was not, an explicit "this is not a professional pen-test and does not guarantee safety" line, and the measured AI-review ceiling, about 28.6 percent of injected errors caught in the best condition).
- Standard: a verification-checklist run (work against the recognized application-security verification standard at the baseline and standard level, marking each item tested or not); an access-attack log (attempt to reach another user's data, act as an admin from a basic account, abuse login and reset); a business-flow attack log (attempt to skip a paid step, forge or replay a payment confirmation, abuse a quota).
- Extra-mile: a human-review handoff package (the findings and artifacts gathered for a human tester, plus a written "independent human pen-test required before launch" statement); an injection-attempt log against the agent; a disclosure-readiness artifact (a published security contact and policy, with a paid bounty reserved for real users and revenue).

### L. Decide and act: triage by business risk, and when to hire a human

Full file: `protocol/l-decide-and-act.md`. Where the audit turns into decisions. This domain looks at the whole pile of findings at once, ranks them by what a mistake costs the business, records an explicit decision for each, and applies the hire-a-human gates. It owns the escalation decision for the whole audit.

- Tier: any real stakes anywhere (S1, S2, S3, or S5) makes this STANDARD. Several signals together, or PII at scale (S3 with S5), makes it EXTRA-MILE. **Hard lines: if an AI agent acts on its own (S4), the hire-a-human decision is forced to "yes" for the security-critical findings. If an irreversible action (S6) combines with money (S1) or scale (S5), any unresolved finding touching that action forces escalation.** An app that risks nothing gets light triage and the honest answer "you do not need to pay anyone."
- Floor artifacts: a consolidated findings list (every finding from every domain, each with its plain-language consequence, a rough likelihood, and the stakes signal it touches); a ranked findings list (ordered by likelihood times impact, highest business risk first); a decision log (every finding not fixed immediately, with "fix now," "fix later by a date," or "accept," and a one-line reason; silence is not a decision); a residual-risk statement.
- Standard: a remediation plan (block-launch, fix-soon, accepted, each blocker tied to its stakes signal); a fix-verification record (re-run the original evidence in a clean context to confirm the bug is gone, because the agent that wrote a bug tends to say its own fix worked); a hire-a-human decision (each gate, its yes-or-no answer with evidence, and the verdict).
- Extra-mile: a standing risk register re-run on each meaningful change; an escalation record handing a human reviewer the organized package so they spend their hours on judgment rather than re-discovery.

Over-trust caution for this domain: a clean-looking report manufactures confidence the facts have not earned. When reviewers miss an error, their confidence tends to rise rather than fall (a measured effect). Present evidence and ranked consequences, never a bare reassurance, and treat a check that found nothing as exactly that.

---

## The honest limits (read this before trusting the result)

NONA reduces risk. It does not guarantee safety. State this plainly in the audit output, because overstating it would hand the builder the exact false sense of security that gets AI-built apps breached, with an official-looking stamp on it, which is worse than no audit because they would stop looking.

- An AI checking AI-written code catches a meaningful slice of critical bugs cheaply and misses most injected errors when it works alone (best measured about 28.6 percent caught by F1 in a clean, separated context; Cross-Context Review). Adding a second model improves the odds but does not turn the result into a professional penetration test.
- High-stakes apps (money, lots of users, irreversible actions, autonomous agents) should still pay for an independent human audit. Domain L tells the builder when they have crossed that line.
- Some of the alarming headline numbers come from vendors with an incentive to alarm. Where a figure is a vendor stat, say so, and cite the independent academic counterweight beside it. The full evidence corpus, with its measurement caveats, is in `docs/why-nona-exists.md`.

The full standards map, with versions and dates, is in `CITATIONS.md`. The self-defense and integrity guidance for anyone adopting NONA is in `SECURITY.md`. The plain-language glossary is in `docs/glossary.md`.
