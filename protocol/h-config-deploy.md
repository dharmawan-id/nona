# Domain H: Config and Deploy Hygiene

## What this is

This domain covers the settings around your app rather than the code inside it: how it is configured when it goes live, what got bundled into the version that ships to visitors, and which front doors the hosting and the database leave open by default. An AI tool writes your app, but it also generates configuration: environment variables, build settings, a deployment config, database defaults. A small number of those settings decide whether your secrets stay private, whether your error pages hand an attacker a map of your system, and whether your browser leaves the locks a server is supposed to add. The code can be flawless and a single misconfiguration can still expose everything.

The three failures that dominate here are a secret that escapes into the public part of the app, a default or debug setting left switched on in production, and missing security headers (small instructions your server sends the browser, telling it to enforce protections the browser will otherwise skip). None of the three is exotic. All three are the kind of thing that gets set once at deploy time and never looked at again.

## What you can't see here

You opened your live site, it loaded, the pages worked, nothing looked wrong. Configuration is invisible from that view by design. A secret embedded in the code that ships to the browser does not change how the page looks; it sits in the downloaded files where anyone who opens developer tools can read it. A debug mode left on does not announce itself; it just means that the day something breaks, the error page prints your file paths, your variable names, sometimes your database details, to whoever triggered the error. Missing headers are silence: the browser simply never receives the instruction to refuse a class of attack, and silence is exactly what you cannot notice.

The reason this slips past both you and your AI tool is that configuration is the part nobody tests on the happy path. When an AI tool wires your app to its database or its payment provider, the fastest way to make it work in the demo is to put the key where the code can reach it, and the code that runs in the browser is code the key can reach. The tool optimizes for "it runs," and "it runs" with the secret in the browser looks identical to "it runs" with the secret kept on the server. The difference only appears when a stranger goes looking, and a stranger went looking at scale: a production scan of 5,600 apps built with AI tools found more than 400 exposed secrets sitting in public, and the scanners reached most of the critical weaknesses on public addresses without logging in at all, which is why they called their own counts a lower bound (Escape.tech, 29 October 2025). The settings were not hidden. They were reachable by anyone, from the outside, with no account.

A naive self-audit misses this for a specific reason. The AI tool that generated the config reads it as correct because it generated it for the demo that worked. Asking the same tool in the same conversation "is the config safe?" tends to get back "yes, it runs," because the part that is wrong is the part that does not show up until an outsider probes it. The check that finds these problems is not "does it work." It is "what exactly did we ship to the browser, and what is each setting set to," answered by listing the actual values rather than trusting that the defaults are fine.

## When this matters (stakes signals)

The floor for this domain fires the moment your app is deployed at all. Any live app has configuration, ships a bundle to visitors, and runs on hosting with default settings, so the never-skip checks below apply to every deployed app, including a weekend project with no login and no data. A misconfiguration does not need stakes to be a misconfiguration; an exposed key is exposed whether or not you thought the app was important.

What the stakes signals decide is how deep this domain goes beyond that floor. Stakes are read on this domain's own surface: what your configuration and your deployment actually expose.

- **S1 Money** (a payment-provider key, a billing secret, or a signing secret lives in your configuration) raises this domain, because an exposed payment key is not a leak of data, it is a leak of the ability to charge, refund, or read payment records as you.
- **S3 Personal data** (your configuration or your database defaults govern access to stored personal information: emails, phone numbers, names, health details) pushes this domain to STANDARD, because a misconfigured database or an exposed connection string on a system holding real people's data is the short path from "a setting was wrong" to "everyone's records were reachable."
- **S5 Blast radius** (many users, multiple separate customers on shared infrastructure, a public API, a shared database) combined with either of the above pushes this domain to EXTRA-MILE. A configuration hole on shared infrastructure does not leak one account; it leaks the whole tenancy at once, and the hardening baselines for the database and the cloud become worth their cost.

If your app is deployed but genuinely holds no money secret, no personal data, and runs for a small single audience, the floor is the whole job here: keep the secrets out of the bundle and out of your code history, turn debug off, add the basic headers, and do not stand up a full configuration-hardening program around an app that has nothing valuable to expose.

## Floor checks

Never skip these on any deployed app.

| Check | Why it matters to your business | Evidence the agent must produce | Citation |
|---|---|---|---|
| List every secret in the app's configuration (database connection strings and keys, payment-provider keys, API tokens, signing secrets) and, for each, confirm it is read only on the server and never appears in the code bundle that ships to the browser, never sits behind a `NEXT_PUBLIC_`-prefixed variable, and was never committed to the code history. A `NEXT_PUBLIC_` prefix tells the build tool to ship that value to the browser, so any secret given that prefix is published. | A secret that reaches the browser is a secret in public: anyone who opens the page can copy your database key or your payment key and read your data or charge as you, without breaking a single lock. A key committed to your code history stays readable even after you remove it from the latest version. This is the most common way an AI-built app is breached, and a scan of real shipped apps found hundreds of these in the open. | A secret inventory: every configured secret, where it is read, and a per-secret verdict of "server-side only" or "EXPOSED" (in the browser bundle, behind a `NEXT_PUBLIC_` variable, or in git history), with every exposed one flagged for immediate rotation because a leaked secret must be replaced, not merely moved. | OWASP Top 10:2025 A02 Security Misconfiguration; OWASP Top 10:2025 A04 Cryptographic Failures; Supabase Production Checklist (keep service keys server-side) |
| Confirm debug mode, verbose error output, and any development-only setting are switched off in the live deployment, so a runtime error returns a generic message to the visitor and writes the detail only to your private logs. | A debug or verbose-error setting left on turns every crash into a free intelligence report for an attacker: file paths, framework versions, variable names, sometimes database details, printed straight to whoever made the page break. Turning it off means a stranger who triggers an error learns nothing, while you still get the full story in your logs. | The actual production configuration values for debug, error verbosity, and environment mode, shown as set (not assumed), with any development-only setting still active in production flagged. | OWASP Top 10:2025 A02 Security Misconfiguration; OWASP Top 10:2025 A10 Mishandling of Exceptional Conditions |
| Confirm no default or placeholder credential survived into production: no example admin password, no default database account left enabled, no sample API key, no seeded test login that still works against the live system. | A default or example credential that an AI tool scaffolded and nobody changed is a key the whole internet already has, because the example is published in the tool's own documentation. Leaving one enabled is leaving a door whose key is printed in a manual anyone can read. | A credentials check: each default, placeholder, seeded, or example account and credential the scaffold created, and a per-item verdict of removed, disabled, or rotated to a real value, with any still-usable default flagged. | OWASP Top 10:2025 A02 Security Misconfiguration; OWASP Top 10:2025 A07 Authentication Failures |
| Confirm the app sends the baseline security headers from the host or framework configuration, so the browser is told to enforce protections it skips by default: send pages over HTTPS only (HSTS), refuse to be embedded in another site's frame (clickjacking defense), and stop the browser from guessing a file's type. Security headers are short instructions a server attaches to each response that switch on browser-side protections. | Without these headers the browser leaves locks open that it is perfectly willing to close once asked. The gap lets an attacker frame your login page inside a fake site to harvest clicks, or downgrade a visitor to an unencrypted connection where the traffic can be read. The headers cost nothing to add and close a class of attacks the browser cannot defend against unless your server tells it to. | The actual header configuration shipped (from `vercel.json`, the framework config, or equivalent), listing which baseline headers are present and which are missing, with the missing ones named. | OWASP Top 10:2025 A02 Security Misconfiguration; OWASP Secure Headers Project (baseline response headers); Vercel and Next.js security documentation |
| Confirm the database enforces encrypted connections (SSL/TLS) and that the database's network exposure is restricted rather than open to the whole internet, using the hosting provider's production settings. SSL/TLS is the encryption that protects data moving between your app and its database. | A database reachable by anyone on the internet, or one that accepts unencrypted connections, is a database an attacker can connect to directly or eavesdrop on, skipping your app entirely. Enforcing encryption and limiting who can reach the database is the difference between "the data is behind the app" and "the data is one guessed connection string away." | The database connection and network settings as configured: SSL/TLS enforcement status and the network-access restriction in place (or a flag that the database accepts unencrypted connections or is reachable from anywhere). | OWASP Top 10:2025 A02 Security Misconfiguration; Supabase Production Checklist (enforce SSL, restrict network access) |

## Standard checks

A competent team does these once personal data or a money secret touches this domain's configuration surface, per the stakes signals above.

| Check | Why it matters to your business | Evidence the agent must produce | Citation |
|---|---|---|---|
| Apply the Level 1 hardening baseline for the database against its actual configuration, going down the non-disruptive line items (logging settings, connection limits, role and permission defaults, removal of unneeded extensions and sample data) and recording the state of each. Level 1 is the broadly-applicable, non-breaking hardening tier. | The database ships with defaults chosen for easy setup, not for a hostile internet, and the gap between "default" and "hardened" is exactly where an attacker who reaches the database operates. Walking the baseline turns a vague "it's probably fine" into a line-by-line record of what is actually set, which is the only version of this you can act on. | A database hardening checklist: each Level 1 item for the running database major version, its actual configured state, and any item not met flagged with the setting that needs changing. | OWASP Top 10:2025 A02 Security Misconfiguration; CIS PostgreSQL Benchmark, Level 1, for the running major version |
| Apply the Level 1 cloud and hosting baseline to the deployment: confirm storage buckets are not publicly readable unless intended, access to the hosting account follows least privilege, and platform-level logging is on. Then add a full security-header policy including a content security policy (a header that lists which sources the browser may load scripts and content from, blocking injected code from running). | Open storage buckets are a leading cause of mass data exposure, and a missing content security policy means an injected script runs with the full trust of your page. The floor headers stop framing and downgrade attacks; a content security policy is the one that contains an injection if input handling ever slips, so it is the header worth getting right once real data is at stake. | A cloud and headers report: storage-bucket access settings, hosting-account access scope, platform logging status, and the full header policy including the content security policy as shipped, with any public bucket or missing policy flagged. | OWASP Top 10:2025 A02 Security Misconfiguration; CIS Cloud Foundations Benchmark, Level 1; OWASP Secure Headers Project; Vercel and Next.js security documentation |
| Verify the live configuration separates environments so production secrets are not the same as development secrets, production does not point at a development database, and no `.env` file or configuration dump is reachable as a public file on the live site. | Sharing one set of secrets across development and production means a leak anywhere is a leak everywhere, and a configuration file served as a public URL hands an attacker the whole settings sheet in one request. Keeping environments separate contains a mistake to the place it was made instead of spreading it to the live system. | An environment-separation result: confirmation that production secrets differ from development secrets and that production targets the production database, plus the result of checking that no `.env` or configuration file is fetchable from a public address (clean, or the exact exposed path). | OWASP Top 10:2025 A02 Security Misconfiguration; OWASP Top 10:2025 A04 Cryptographic Failures |
| If the app exposes an AI feature, confirm its configuration does not leak the system prompt or model settings to users, and that any configuration controlling the AI surface is server-side. System prompt leakage is when the hidden instructions steering the model can be coaxed out by a user. | A system prompt or model configuration that a user can extract reveals how your feature works and how to manipulate it, and if that prompt itself contains a key or an instruction with privileges, the leak is also a secret exposure. Keeping the AI's configuration on the server is the same discipline as keeping any other secret out of the browser, applied to the part that steers the model. | The location of the AI feature's system prompt and model configuration, a verdict that it is server-side and not returned to the client, and the result of a basic attempt to extract it through the feature, with any leak flagged. | OWASP Top 10 for LLM Applications 2025 LLM07 System Prompt Leakage; OWASP Top 10:2025 A02 Security Misconfiguration |

## Extra-mile checks

Frontier rigor. Even strong engineering teams treat these as extra, extended effort. Run them on this domain's surface only when the stakes gate forces it, as annotated.

| Check | Why it matters to your business | Evidence the agent must produce | Citation | Stakes gate + frontier pattern |
|---|---|---|---|---|
| Apply the Level 2 hardening baseline for the database and the cloud foundation, the stricter tier that trades some convenience for defense in depth, and record each item's state against the live configuration. Level 2 is the higher-assurance tier intended for environments where the data justifies the friction. | On shared infrastructure holding many customers' data, the broadly-safe Level 1 baseline is the starting line, not the finish. Level 2 closes the gaps that matter when one configuration hole exposes an entire tenancy rather than one account, which is precisely the situation a multi-customer system is in. | A Level 2 hardening record: each applicable Level 2 item for the database and the cloud foundation, its configured state, and any unmet item flagged with the trade-off it carries so the decision to accept or fix it is explicit. | OWASP Top 10:2025 A02 Security Misconfiguration; CIS PostgreSQL Benchmark, Level 2, for the running major version; CIS Cloud Foundations Benchmark, Level 2 | Forced by S5 (blast radius) combined with S1 (money) or S3 (personal data) on this surface. Frontier pattern: Level 2 configuration hardening. |
| Stand up continuous configuration and secret scanning in the deployment pipeline, so a new secret committed by mistake, a header policy weakened by a change, or a default setting reintroduced is caught automatically on the next deploy rather than discovered by an attacker months later. | A configuration audit is true only for the day it was run; the next careless change can undo it silently. Automated scanning on every deploy turns a one-time pass into a standing guard, which is what a system carrying real data on shared infrastructure needs, because the riskiest misconfiguration is the one that slips back in after everyone stopped looking. | The pipeline configuration that runs secret scanning and configuration checks on each deploy, the categories it covers, and a sample of its output, with the failure behavior (does a detected secret block the deploy) stated. | OWASP Top 10:2025 A02 Security Misconfiguration; OWASP Top 10:2025 A08 Software or Data Integrity Failures | Forced by S5 (blast radius) with stored personal data (S3) or money (S1) on this surface. Frontier pattern: shift-left configuration and secret scanning in CI. |
| Verify the build provenance and the integrity of what actually deployed: confirm the live version was built from the reviewed source through the expected pipeline, that the deployment cannot be triggered from an untrusted source, and that the bundle in production matches what the pipeline produced. Provenance is a verifiable record of how and from where an artifact was built. | Without a record of how the live version was built, you cannot prove that what is running is what you reviewed, and an attacker who can influence the build or the deploy can ship tampered code that no code review would catch because the tampering happened after review. On a high-stakes system, knowing the deployed artifact is the genuine one is the floor under every other check. | A deployment-integrity record: the source and pipeline the live version was built from, the controls restricting who or what can trigger a production deploy, and confirmation that the running bundle matches the pipeline output, with any unverifiable link flagged. | OWASP Top 10:2025 A08 Software or Data Integrity Failures; OWASP Top 10:2025 A02 Security Misconfiguration | Forced by S5 (blast radius) on a system where a tampered deploy would reach many users. Frontier pattern: build-provenance and deploy-integrity verification. |

## When to stop and hire a human

Bring in an independent reviewer for this domain when any of these are true:

- The secret inventory found an exposed key on a system that handles money or stores personal data, and you cannot confirm both that the leaked key was rotated and that nothing reachable in your code history still contains a live one. A leaked production secret on a real system is a confirmed incident, not a setting to quietly correct and move on from.
- Your app holds personal data on shared infrastructure serving many customers (S3 with S5), and you cannot produce a completed hardening checklist showing the database and the cloud foundation actually meet the baseline, with the unmet items decided rather than unknown. Configuration you cannot fully account for, on a system that leaks everyone at once when it is wrong, earns a human pass before you scale.
- A configuration setting governs access to money or to personal data and you cannot demonstrate, with the actual values, that production is separated from development, debug is off, and the database is not reachable from the open internet. Guessing that the defaults are fine on a high-stakes deployment is the exact bet this domain exists to stop you making.

This protocol catches a meaningful slice of configuration and deployment problems cheaply, and it is the right first pass for every deployed app. It is not a guarantee, and an AI reviewing the configuration its own class generated is weaker than an independent human on the settings that decide whether real data is exposed. Domain K covers what a professional review adds and where its honest ceiling sits. For an app carrying real stakes on this domain, route there.

## Agent instructions

```
DOMAIN H: CONFIG AND DEPLOY HYGIENE

Scope by stakes (stakes are local to this domain's configuration and deployment surface):
  FLOOR fires for ANY deployed app. Run the floor checks on every live app, including a
  small project with no login and no data: secrets out of the browser and git, debug off,
  no default credentials, baseline headers, encrypted and network-restricted database.
  If stored personal data (S3) governs this surface, run STANDARD here.
  If money secrets (S1) or personal data (S3) combine with blast radius (S5) on shared
  infrastructure, run EXTRA-MILE.
  If the app is deployed but holds no money secret, no personal data, and serves a small
  single audience, run FLOOR only. Do not stand up Level 2 hardening, CI secret scanning,
  or deploy-provenance machinery for an app with nothing valuable to expose.

Circularity note (see the circularity-guard protocol):
  The AI tool that generated the configuration reads it as correct because it produced the
  demo that worked, and the failures here (a secret in the bundle, debug left on, a missing
  header) are invisible until an outsider probes. Run this domain in a CLEAN, fresh context
  with no access to the build rationale, and prefer a different model from the one that
  generated the config. Check by listing the ACTUAL values shipped and set, not by asking
  whether the config "works."

Produce these artifacts (not verdicts):
  FLOOR:
    1. Secret inventory: every configured secret, where it is read, "server-side only" or
       "EXPOSED" (browser bundle / NEXT_PUBLIC_ / git history), exposed ones flagged for
       rotation.
    2. Production-setting check: actual values for debug, error verbosity, and environment
       mode as set, development-only settings still active in production flagged.
    3. Credentials check: each default/placeholder/seeded/example credential the scaffold
       created, marked removed, disabled, or rotated, still-usable defaults flagged.
    4. Header configuration: the actual headers shipped (vercel.json, framework config, or
       equivalent), baseline headers present vs missing, missing ones named.
    5. Database transport and exposure: SSL/TLS enforcement status and network-access
       restriction as configured, unencrypted or internet-open database flagged.
  STANDARD (stored personal data or a money secret on this surface):
    6. Database hardening checklist: each Level 1 item for the running major version, its
       configured state, unmet items flagged with the setting to change.
    7. Cloud-and-headers report: storage-bucket access, hosting-account access scope,
       platform logging status, and the full header policy including the content security
       policy, public buckets or missing policy flagged.
    8. Environment-separation result: production secrets differ from development, production
       targets the production database, and no .env or config file is fetchable from a
       public address (clean or the exposed path).
    9. AI-config check (if an AI feature exists): system-prompt and model-config location,
       a server-side verdict, and the result of a basic extraction attempt, leaks flagged.
  EXTRA-MILE (personal data or money at blast-radius scale):
    10. Level 2 hardening record: each applicable Level 2 item for the database and cloud
        foundation, its state, unmet items flagged with the trade-off carried.
    11. Pipeline-scanning evidence: the CI configuration running secret and config scanning
        on each deploy, the categories covered, sample output, and whether a detected secret
        blocks the deploy.
    12. Deployment-integrity record: the source and pipeline the live version was built
        from, the controls on who can trigger a production deploy, and confirmation the
        running bundle matches the pipeline output, unverifiable links flagged.

Output a findings table with these columns and nothing weaker than evidence:
  | Severity | Business risk in plain words | Evidence artifact | Citation | Suggested fix |

Rules:
  - Translate every finding into a concrete business consequence a non-coder understands
    (for example: "anyone who opens your live site can read your database key out of the
    downloaded files and wipe your data," not "secret exposed in client bundle").
  - Cite only the controls named in this domain (A02, A04, A07, A08, A10, LLM07, OWASP
    Secure Headers Project, Supabase Production Checklist, Vercel and Next.js security docs,
    CIS PostgreSQL Level 1/2 for the running major version, CIS Cloud Foundations Level 1/2).
    Do not invent IDs. Cite CIS at the named-benchmark level for the running major version,
    not by line-item number.
  - No bare verdicts. "Looks secure" is not a finding. Attach the artifact (the actual
    secret list, the actual header configuration, the actual setting values) that proves the
    claim; a confident-looking verdict with no evidence manufactures false trust.
  - If you cannot produce an artifact a check demands, say so and mark that check INCOMPLETE.
```
