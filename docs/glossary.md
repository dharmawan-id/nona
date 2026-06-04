# Glossary

Every technical term used across this protocol, each explained in one plain sentence. The English headword is kept on purpose, because your AI agent and a web search both resolve on the original word, so you can always look a term up in full once you know what it means here.

The terms are grouped by the part of your app they belong to. If you are reading a domain file and hit a word you do not know, find it here first.

## How your app keeps people out and in

**Authentication (often shortened to "auth").** Proving who someone is, the lock on your front door that checks a password or a login before letting a person in.

**Authorization.** Deciding what a person is allowed to do once they are in, so a normal user cannot reach an admin's controls or another customer's records.

**Access control.** The whole system of who-can-see-what and who-can-do-what, the umbrella term covering both the front-door lock and the inside permissions.

**Session.** The temporary "you are logged in" state your app remembers after you sign in, so you do not retype your password on every page; if it never expires or cannot be cancelled, a stolen one stays valid.

**Role.** A label like "normal user" or "admin" that decides which actions a person is allowed to take.

**Privilege.** The power a part of your app or a user holds, such as the ability to read the database, change data, or run a payout.

**Least privilege.** Giving each part of your app, and each user, only the minimum power it actually needs, so a single compromised part cannot reach everything.

**Privilege escalation.** A route by which a low-power part of your system, or an outside attacker, reaches high-power abilities it was never meant to have.

**RLS (Row Level Security).** A database feature that limits each row of data to the user who owns it, so the database itself refuses to hand one customer another customer's records even if the app code slips.

**Default-deny.** A safety rule that makes a table or an action return nothing and allow nothing unless an explicit permission says otherwise, so a forgotten rule fails shut instead of wide open.

**IDOR (Insecure Direct Object Reference).** A hole where a stranger opens someone else's record by changing a number in the web address, for example switching `/invoice/1041` to `/invoice/1042` and reading another customer's invoice.

**BOLA (Broken Object Level Authorization).** The formal name for IDOR: the app fails to check that the record you are asking for is actually yours.

**BFLA (Broken Function Level Authorization).** A hole where a normal user can run an admin-only action (delete any account, change anyone's role) by calling it directly, because the app hid the button but never checked the caller's role.

**Object-level authorization.** Checking that you own the specific record you are touching (your order, your profile).

**Function-level authorization.** Checking that your role is allowed to perform the specific action you are calling (only an admin can refund).

**Protected route.** A page or an action that is supposed to require a valid login; it is only truly protected if the server, not just the browser, refuses an un-logged-in request.

## Secrets and keys

**Secret.** Any private value that unlocks something, such as a database key, a payment-provider key, an API token, or a signing secret; a secret in public is a door with the key taped to it.

**API token / API key.** A secret string that lets one piece of software prove its identity to another service and use it; if it leaks, a stranger can use that service as you.

**Service-role key.** The all-powerful master key to a Supabase database that bypasses every row-level rule, meant only for trusted server tasks and never to be placed in code that ships to the browser.

**Client bundle.** The package of code your app sends to every visitor's browser; anything inside it, including a secret mistakenly placed there, can be read by anyone who opens the browser's developer tools.

**`NEXT_PUBLIC_` prefix.** A naming rule in some frameworks that tells the build tool to ship that value to the browser on purpose, so any secret given this prefix is effectively published.

**Git history.** The saved record of every past version of your code; a secret committed once stays readable in the history even after you delete it from the latest version, which is why a leaked key must be replaced, not just removed.

**Rotation.** Replacing a leaked or exposed secret with a brand-new one and retiring the old, because a secret that was ever public stays compromised no matter where you move it.

**Environment variable.** A setting stored outside the code (a key, a database address, a mode flag) that the app reads when it runs, used to keep secrets and per-environment values out of the code itself.

**`.env` file.** A plain file that holds environment variables during development; if it is ever served as a public web address, an attacker gets your whole settings sheet in one request.

## Input, injection, and the AI version of it

**Input.** Anything that comes into your app from the outside: a typed form field, a value in the web address, an uploaded file, a request body, a header.

**Sink.** The place an input ends up, such as a database query, a system command, a web page, a file path, or an AI prompt; the same input can be safe in one sink and dangerous in another.

**Injection.** What happens when outside input is treated as a command instead of as plain data, letting a stranger change what your code actually runs.

**SQL injection.** A specific injection where typed text is glued into a database query, so an attacker can type query commands into a form and read or delete data that is not theirs.

**Parameterized query.** The safe way to run a database query, where the user's value is passed in separately as data and can never become part of the command.

**String concatenation.** Building a command or query by gluing pieces of text together, including untrusted input; the unsafe pattern that injection exploits.

**OS command injection.** An injection where outside input becomes part of a command your server runs, letting an attacker append their own commands and run them on your machine.

**XSS (cross-site scripting).** An injection where an attacker plants a script in a comment, a name, or a profile field, and that script then runs in the browser of everyone who views the page and can steal their logged-in session.

**Log injection.** Writing un-cleaned user text into your logs, letting an attacker forge or corrupt log lines to hide their tracks or trick whoever reads the logs.

**Escaping (also "encoding").** Cleaning a value so that wherever it is shown it is treated as text, not as code, for example turning a typed script tag into harmless visible characters on a web page.

**Input validation.** Checking on the server that an input is what it should be (the right type, length, format, allowed values) before the app uses it, with any browser-side check treated as a convenience rather than the real defense.

**Sanitizing.** Stripping or neutralizing the dangerous parts of an input before it is used.

**Prompt injection.** The AI-era version of injection, where hostile text hidden inside something your AI feature reads (a web page, an email, an uploaded file, another user's record) smuggles in instructions that hijack what the AI does, such as "ignore your rules and paste the customer list here."

**Output handling.** Treating whatever your AI feature produces as untrusted text and checking it before it is shown, stored, or run, because a tricked or simply wrong model becomes a fresh injection path if its output is trusted blindly.

## Artificial intelligence and agents

**LLM (large language model).** The kind of AI that reads and writes text and powers most AI features and AI coding tools; it cannot reliably tell your instructions apart from the data it is reading, which is why prompt injection works.

**Model lineage (or model family).** The training heritage an AI model comes from; models from the same family tend to share blind spots, the way two people taught at the same school make the same mistakes, which is why a review by a different family catches more.

**Agent.** An AI that does not just answer but takes steps to get something done, such as calling tools, reading files, or sending messages.

**Autonomous agent.** An agent that can take real actions on its own, send an email, run code, spend money, change data, without a human approving each action first; this is the single setting that most raises an app's risk.

**System prompt.** The hidden instructions that steer your AI feature's behavior, given by you, not by the user; if it leaks, an attacker learns how your feature works and how to manipulate it.

**System prompt leakage.** When a user can coax those hidden instructions out of the model, exposing how the feature is steered and any secret or privileged instruction inside it.

**Grounding.** Checking an AI's answer against real, known data before trusting it, so a confident-sounding made-up answer is caught.

**Hallucinate.** When an AI produces something that sounds plausible but is not real, such as inventing a software package that does not exist.

**Eval (evaluation).** A small report card for an AI feature: a fixed set of test inputs and a way to score whether the answers are still good after you change a prompt or swap a model, so you do not silently ship a worse version.

**Golden suite (or golden set).** The fixed list of test inputs paired with the exact outputs and behaviors that count as acceptable, re-run on every change so the feature drifting from what you meant is caught automatically.

**Self-consistency.** A cheap reliability check where the AI is asked the same thing more than once and the answers are compared; disagreement signals uncertainty and triggers a retry or a human look.

**Output-verification harness.** An automatic step that independently checks an AI feature's result against the intended outcome before that result takes effect, especially before an action that cannot be undone.

**Containment pattern.** A way of arranging an AI agent so that even a successful prompt injection has nowhere dangerous to go; the named patterns below are the main ones.

**Action-selector.** A containment pattern where the agent may only pick from a fixed list of safe, pre-approved actions and can never invent or run a free-form one.

**Plan-then-execute.** A containment pattern where the agent fixes its plan before it reads any untrusted text, so a hidden instruction in that text cannot redirect what it does.

**Map-reduce.** A containment pattern where each untrusted item is handled in isolation and the results are combined afterward, so one poisoned item cannot infect the rest.

**Dual-LLM.** A containment pattern using two separated models: one holds the tools and powers but never reads untrusted text, a second reads untrusted text but holds no powers, and they pass values between them without passing instructions.

**Context-minimization.** Dropping untrusted text from the AI's working memory once it has served its purpose, so it cannot keep steering later steps.

**Red-team.** Deliberately attacking your own app the way an adversary would, before a real attacker does, to find what breaks.

**Prompt-injection red-team.** A red-team aimed specifically at an AI agent: feeding it hidden instructions through everything it reads to see whether it can be made to leak a secret, ignore its rules, or misuse its access.

**Kill switch.** A control that stops an autonomous agent immediately, the off-button you need when an agent starts misbehaving.

**Provenance (for AI-generated code).** A record of where a piece of generated code came from: which model produced it, roughly what it was asked to do, who accepted it, and what tests passed, so a security incident or a dispute later does not meet a black box.

## Payments and money flows

**Webhook.** An automated message one service sends another in the background to confirm an event, such as a payment provider telling your app "order 123 was paid"; a forged one can fake a paid order.

**Signature (cryptographic signature).** A tamper-proof stamp a provider attaches to a webhook so your app can confirm the message genuinely came from them; skipping the check lets anyone send a fake "payment succeeded."

**Replay.** Re-sending a real, already-used message (such as a genuine payment webhook) to make the app act on it twice, for example to grant credits or trigger a payout again.

**Idempotency.** A guard that makes processing the same event a second time a safe no-op, so a retried or replayed webhook cannot double-grant a product or double-charge a customer.

**Fail closed (also "failing closed").** The safe default of denying an action when a check errors out or cannot complete, so a broken lock stays locked.

**Fail open (also "failing open").** The dangerous opposite, where the app keeps going and allows the action when a check breaks, turning a glitch into an open door (for example granting access because the permission check could not finish).

**Denial-of-wallet.** An attack where the target is your bill rather than your server: an attacker drives your app to make so many paid requests (often to a paid AI service) that the cost, not a crash, is the damage.

**Cost guardrail (or cost cap).** A spending limit and an alert on anything that spends money on your behalf, typically a hard ceiling that stops usage, a softer warning before it, and a per-user or per-month limit.

**Rate limit.** A cap on how often a single user, session, or address can do something in a given time, used to stop one actor from draining your budget, brute-forcing a login, or abusing a flow.

**Fallback chain (model fallback chain).** An ordered list of backup AI models so that if the main provider goes down, errors, or throttles, the feature automatically retries on a backup without uncapping your spending.

## Data and privacy

**PII (Personally Identifiable Information).** Any data that identifies a real person: name, email, phone, address, location, health details, payment details, private messages.

**HTTPS.** The encrypted, padlocked version of a web connection that stops anyone in between from reading the data in transit; its plain, unencrypted opposite exposes whatever is sent.

**TLS / SSL.** The encryption technology underneath HTTPS that protects data moving over the network, including between your app and its database; SSL is the older name for the same idea.

**Encryption at rest.** Protecting the stored copy of data so that a database which is stolen or accessed does not hand over readable records, as opposed to protecting data only while it travels.

**Hashing.** A one-way scramble used for passwords so the stored value cannot be turned back into the original; a properly hashed password stays useless to an attacker even if the database leaks.

**Data minimization.** Collecting only the personal data a feature actually needs and keeping it only as long as needed, because every extra field and every kept record is liability with no benefit.

**Retention.** How long you keep a piece of data before deleting it; a stated retention point is the rule that says when a category of personal data gets removed.

**Data masking.** Hiding part of a stored value (showing only the last four digits, for example) so a leak yields fragments rather than the full detail.

**Identifier separation.** Storing the direct identifiers that name a person apart from the records that describe them, so a leak of one store alone does not produce a clean list of named people.

**IBAN.** An international bank account number; named here only as an example of the sensitive financial data found exposed in real AI-built apps.

## Borrowed code and the supply chain

**Dependency.** A ready-made package of code your app pulls in to do part of the job, written by strangers; a typical app runs on dozens directly and hundreds in total.

**Package.** A single named unit of borrowed code published on a registry; the thing your app declares it depends on.

**Registry.** The public store your app downloads packages from (such as npm for JavaScript); the place where a real package is confirmed to exist.

**Direct and indirect dependencies (transitive dependencies).** The packages you chose yourself (direct) plus the further packages those packages quietly drag in to function (indirect, or transitive); both run inside your app.

**Lockfile.** A committed record that pins every dependency, direct and indirect, to one exact version and one exact verified copy, so the same code is fetched every time and what you tested is what ships.

**Slopsquatting.** A supply-chain attack where an attacker registers a real package under a fake name that AI tools reliably hallucinate, so the next builder whose AI invents that name installs the attacker's code on the first try.

**Typosquatting.** The older cousin of slopsquatting: an attacker publishes a malicious package under a name one typo away from a popular one, hoping you install the impostor by mistake.

**SBOM (Software Bill of Materials).** An itemized ingredient label for your software: the full list of every shipped dependency with its exact version, the thing that lets you answer "are we affected?" in minutes when a new hole is announced.

**Known-vulnerability scan.** An automatic check of your dependencies against a public database of disclosed security holes, flagging any package with a known weakness and the fixed version to move to.

**Content hash (hash-pinning).** A fingerprint of a package's exact contents; pinning to it means a swapped or altered copy is rejected at build time, because a hash cannot be faked the way a version number can be re-pointed.

**Agent skill (also "skill").** A small add-on that gives an AI agent a new capability; it is borrowed code that runs with the agent's full reach, so an unreviewed one can hand a stranger a hand on the controls.

**Plug-in.** Another form of add-on bolted onto an AI tool to extend it, with the same access the tool has to your files, environment, and actions.

**Tool description (tool definition).** The small instruction file that tells an agent how and when to use a given tool; because the agent acts on it, a hostile one can redirect the agent.

## Build, configuration, and deployment

**Build.** The process that assembles your finished, shippable app from your source code and its dependencies.

**Build provenance.** A verifiable record of how your shipped app was assembled and from what inputs, so a clean build can be told apart from a tampered one.

**SLSA.** A published, leveled standard for build security (Build L1 is a basic build record, L2 adds a signed record from a hosted build service, L3 adds a hardened isolated build, and the Source Track verifies the code history itself); higher levels make tampering with the assembly line progressively harder.

**Misconfiguration.** A wrong or careless setting (rather than a code bug) that exposes your app, such as a secret in the browser, a debug switch left on, or a database open to the internet.

**Debug mode.** A development setting that prints detailed error information; left on in production, it hands an attacker a free map of your system every time something breaks.

**Default credentials.** A placeholder or example login that a tool scaffolds and nobody changes, effectively a key the whole internet already has because the example is in the public documentation.

**Security headers.** Short instructions your server attaches to each response telling the browser to switch on protections it skips by default; cheap to add and impossible for the browser to apply unless asked.

**HSTS.** A security header that forces the browser to use only the encrypted HTTPS connection, blocking an attacker from downgrading a visitor to an unencrypted one that can be read.

**Clickjacking.** An attack that loads your real page invisibly inside a fake site to trick a user into clicking something they did not mean to; a header that refuses to be embedded in another site's frame defends against it.

**Content security policy (CSP).** A security header that lists which sources the browser is allowed to load scripts and content from, so an injected script has no permission to run; the header worth getting right once real data is at stake.

**CIS Benchmark.** A published, leveled hardening checklist for a specific system (such as a PostgreSQL database or a cloud account), where Level 1 is broadly safe and non-breaking and Level 2 is stricter for higher-stakes environments; cite it for your running major version rather than by line number.

**Hardening.** Going through a system's settings and closing the gap between its convenient defaults and a configuration safe for a hostile internet.

**Storage bucket.** A cloud container that holds files your app stores; left publicly readable when it should not be, it is a leading cause of mass data exposure.

**CI (continuous integration), or the pipeline.** The automated process that checks, builds, and ships your code on each change; a place to run scanners automatically so a mistake is caught on the next deploy.

**Shift-left.** Catching problems early, while building, instead of after launch; the free version is wiring up automatic scanners that run on their own.

**Static analysis.** A scanner that reads your code for obvious mistakes without running it, one of the cheap automatic checks in the universal floor.

**Secret scanner.** An automatic check that flags passwords or keys accidentally left in the code or its history.

**Dependency scanner.** An automatic check that flags packages you depend on which carry a known, published security hole.

## After launch: keeping it running

**Detection and alerting.** Being told when your app breaks, is attacked, or runs up an unexpected bill, rather than learning from a customer complaint or a credit-card statement.

**Backup.** A saved copy of anything you would hate to lose (your database, uploaded files, user content), kept so you can recover after data is lost or a bad change ships.

**Restore.** Actually bringing a backup's data back and confirming it came back whole; a backup is only proven by a restore that worked, never by its mere existence.

**Rollback.** Returning the running app to a known-good earlier version after a bad release, so a five-minute mistake does not become a multi-hour outage.

**SLO (service-level objective).** A written reliability promise such as "available 99.9% of the time," with the discipline that you pause new features and fix stability when you break it; theater at hobby scale, real on a service many people depend on.

**Error budget.** The small, agreed amount of failure an SLO allows, with the rule that once it is spent, reliability work outranks shipping; it turns a trade-off into an unemotional signal.

**Canary.** Releasing a change to a tiny slice of users or traffic first and watching it before everyone gets it, so a bad change harms a few people briefly instead of all of them for hours.

**Feature flag.** An on/off switch that enables or disables a feature without redeploying the app, used to turn off a broken change instantly.

**Staged rollout (progressive delivery).** Releasing a risky change gradually, to a growing fraction of users, expanding only while the health signals hold; the family of techniques that includes canary and feature flags.

**Chaos engineering.** Deliberately breaking part of your own system to confirm it recovers; worth it only on a system that already has real reliability needs, wasted on an app nobody depends on yet.

**Game day.** A scheduled rehearsal of an outage where you break something on purpose, in a window you chose, to find the broken backup or the alert that never fires while the stakes are a drill rather than a real disaster.

**Incident response.** A short written plan for when something breaks: who is told, the first steps to take, how to get the app to a safe state, and how the lessons feed back into a fix.

**Root-cause analysis.** Looking after an incident for the underlying cause, not just the symptom, so it becomes a lasting fix instead of a recurring surprise.

## Architecture and design

**Architecture.** The shape of your app: the parts it is made of, how they talk to each other, and where it draws the line between what is trusted and what is not.

**Trust boundary.** A line in your app where data or a request crosses from a side you do not control (a visitor's browser, a third-party response, an uploaded file) into a side you do (your server, your database); most serious design holes live at these crossings.

**Blast radius.** How far a single failure spreads: just you, a few friends, or many strangers and multiple customers sharing one system at once; the bigger it is, the more the design has to fail small.

**Multi-tenant.** A single system serving multiple separate customers at once, where one access hole can leak everyone rather than one account.

**Defense in depth.** Layering more than one protection so that a single failure is caught by the next layer instead of becoming a full breach.

**Threat model.** A structured walk through how someone would deliberately attack your design, listing what each part must withstand and confirming a control blocks each path, done on paper before an attacker does it for real.

**STRIDE.** A named checklist of six things that can go wrong at each trust boundary (someone pretending to be another user, data tampered with, an action later denied by who took it, information leaking, the system overwhelmed, and a low-power part reaching high-power abilities), used to make a threat model thorough.

**Sandbox.** A walled-off space where a risky part (one that runs code, processes uploads, or acts on the app's behalf) can do its work without being able to reach the rest of the system, so its hijack stays contained.

**Human-approval gate.** A required human sign-off placed in front of an action that cannot be undone or is high-impact, so reaching the trigger is not the same as pulling it.

## Testing, review, and the honest limits

**Pen-test (penetration test).** A test where someone tries to break into your running app on purpose, the way a real attacker would, and writes down everything they got through; the cheap automated version has a low ceiling, and a high-stakes app needs a human one.

**OWASP.** A widely used nonprofit security authority whose published lists are the field's standard checklists; the protocol cites several of them.

**OWASP Top 10.** OWASP's ranked list of the most critical web application security risks, used here as the backbone for naming what a finding maps to.

**OWASP API Security Top 10.** OWASP's companion list focused on the security risks of the behind-the-scenes interfaces (APIs) that apps talk through, where the access and business-flow holes live.

**OWASP Top 10 for LLM Apps.** OWASP's list of the top risks specific to applications built on large language models, covering prompt injection, sensitive-information disclosure, excessive agency, and unbounded consumption among others.

**API (application programming interface).** The behind-the-scenes address your app's pieces, and outside services, use to talk to each other; an attacker calls it directly rather than clicking your screens, which is why server-side checks matter more than hidden buttons.

**ASVS (Application Security Verification Standard).** OWASP's leveled checklist of what a secure app must withstand (Level 1 baseline, Level 2 for a competent team, Level 3 for high assurance); this protocol cites it at the document level and avoids printing version-fragile item numbers.

**WSTG (Web Security Testing Guide).** OWASP's canonical how-to-test manual that professional testers use as their methodology, cited here as the authority on how to actually run the tests.

**NIST SSDF (Secure Software Development Framework).** A US-government set of voluntary, recommended software-security practices (covering preparation, protection, producing secure code, and responding to vulnerabilities), cited as guidance to follow rather than a law.

**NIST AI RMF (AI Risk Management Framework).** A US-government voluntary framework for managing AI risk across four jobs (govern, map, measure, manage), cited here for the AI-specific data, monitoring, and incident practices.

**Fuzzing (property-based testing).** Throwing thousands of random, malformed, and oversized inputs at code that parses untrusted input, to find the crashes and edge cases a human would never list by hand; worth it only on a real parser under real stakes, not a simple form.

**Bug bounty.** Paying outside researchers to find and report security holes; a real program with real cost, justified only once you have real users and revenue and the capacity to handle the reports.

**Responsible disclosure.** Publishing a security contact and a short policy telling honest finders how to report a hole safely, so a stranger who spots a problem becomes a free report instead of a silent risk; the cheap precursor to a paid bounty.

**F1 (F1 score).** A combined measure of how many real bugs a review found and how few false alarms it raised, used here to state the honest ceiling that even the best AI-on-AI review caught only about 28.6 percent of injected errors.

**False sense of security.** The measured effect where people building with an AI assistant write less secure code while believing it is more secure; the exact comfort an overclaiming audit would worsen, and the failure this protocol is built to avoid.

## Practices in the universal floor

**Dogfooding.** Using your own product the way a real customer would, doing the core task, before you ship it, the cheapest practice that catches "technically works, actually broken" problems no automated test finds.

**Pre-mortem.** A short conversation before a build where you pretend it is a year later and the project failed badly, list the reasons why, and fix the ones you can now.

## Triage and the decision to escalate

**Triage.** Sorting your findings by how much a mistake would actually cost, so you fix the one that could end the company before the one that does not matter, instead of fixing whatever is easiest first.

**Severity.** The label (such as "high" or "medium") a tool prints next to a finding; one input to ranking, not the whole answer, because a "high" on a table nobody can reach matters less than a "medium" on your front door.

**Likelihood times impact.** The plain formula for business risk used to rank findings: how easy a mistake is to trigger, multiplied by how badly it would hurt.

**Residual risk.** The risk that remains after you have done what you can, stated plainly in writing so you know what you are choosing to live with rather than pretending it is gone.

**Decision log (and the ADR format).** A written record of each finding you are not fixing immediately, with the choice made (fix now, fix later by a date, or knowingly accept) and a one-line reason, so no finding sits in limbo and a future reviewer can see what was decided on purpose; ADR (Architecture Decision Record) is a common one-page format for recording such a decision.

**Risk register.** A standing list that tracks every finding with its impact, likelihood, chosen response, owner, and a date to revisit, re-run on each meaningful change so a high-stakes app stays accountable to its own risk over time rather than auditing once and forgetting.
