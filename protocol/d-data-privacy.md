# Domain D: Data and Privacy

## What this is

This domain is about the personal information your app holds and the ways it can leak. Names, emails, phone numbers, addresses, payment details, health notes, anything that identifies a real person, all of it is called PII (Personally Identifiable Information). The question here is narrow and concrete: is that data protected while it sits in your database and while it travels over the network, and is there a real way to remove it when someone asks you to. A second question rides alongside it: does the data quietly escape through places you were not watching, such as server logs, error messages, or the text your app's AI feature sends back to a user.

This is not abstract. It is the difference between a customer's medical record staying private and that same record showing up in a public web request that anyone can read.

## What you can't see here

You typed a feature into an AI tool. It built a sign-up form, a profile page, a database table, and it all worked. What you cannot see is where that data goes after it leaves the screen. A non-coder judges the app by what the interface shows. The leaks live in the parts that have no interface: the log file the server writes on every request, the error page that dumps a database row when something breaks, the network response that carries more fields than the page displays, the AI reply that repeats back a value it should have kept private. None of those have a button you can click, so none of them got checked when you watched the feature work.

There is hard, in-the-wild evidence for exactly this. A 2025 scan of 5,600 production apps built with AI tools (Escape.tech, October 2025) found 175 separate instances of exposed personal data, including medical records, bank account numbers (IBANs), phone numbers, and emails, plus more than 400 exposed secrets such as API tokens. The scan was passive, meaning it only looked at what was reachable from the outside without breaking in, so the real number is higher, not lower. These were shipped, live apps whose builders believed the data was safe. This is a vendor scan and a security vendor has an incentive to report alarming numbers, so treat the exact count as a vendor figure, but the pattern it shows (PII reachable on public endpoints of AI-built apps) is the thing this domain exists to catch.

The reason it stays invisible is structural. The data a page renders is the data you can see. The data the system also stores, copies into a log, or sends in a response is invisible from the interface, and an AI tool will often add those side channels (a debug log line, a verbose error, a wide database query) without being asked, because they are convenient defaults. You did not request the leak. The convenience did.

## When this matters (stakes signals)

This domain is FLOOR for every app, because even a small app that collects one email address is now holding PII, and "do not leak it, and let me delete it" is never optional. The stakes signals decide how deep the checks go.

- S3 Personal data (your app stores PII of any kind) is the signal that defines this domain. If S3 is present, run at least STANDARD. The moment you hold real people's data, a competent baseline becomes the minimum expectation.
- S1 Money (payments, billing, payouts, credits with cash value) touching the data: escalate to at least STANDARD. Financial details are PII with a direct cash consequence when leaked, and a leak here funds fraud against your customers.
- S6 Irreversibility (an action cannot be undone: delete, transfer, publish, send) touching the data: escalate to at least STANDARD. Data that is published or sent cannot be recalled, so the protection has to be right before the action, not after.
- S5 Blast radius (many users, multi-tenant, public API, shared infrastructure) combined with S1 or S6: escalate to EXTRA-MILE. A single leak path that exposes one record is a problem; the same path across a shared multi-tenant store exposes everyone at once.

If your app genuinely holds no personal data at all (no accounts, no contact details, no user-submitted content that identifies anyone), the standard and extra-mile checks here do not apply and the floor checks confirm that absence rather than gold-plating it. Do not bolt encryption-key-rotation ceremony onto an app that stores nothing personal; that is misdirected effort, not diligence.

## Floor checks

Never skip these, on any app that touches personal data, at any stakes level.

| Check | Why it matters to your business | Evidence the agent must produce | Citation |
|---|---|---|---|
| Confirm all personal data travels over an encrypted connection (HTTPS/TLS), with no path that sends names, emails, passwords, or payment fields in plain, readable form over the network. | Data sent unencrypted can be read by anyone positioned between your customer and your server, on shared wifi or a compromised network. A login that submits a password in the clear hands that password to a stranger. | A transport-protection result: confirmation that every endpoint carrying personal data uses HTTPS/TLS, and a flag on any request or form that submits PII over a plain, unencrypted connection. | OWASP Top 10:2025 A04 Cryptographic Failures |
| Scan the codebase and the version-control history for personal data and secrets committed where they do not belong: real user records in seed files, a test export of customer data, an API key or database password in the source. | A customer record or a live key checked into the repository is permanently in the history, visible to anyone with access to the code, and copied to every clone. Deleting the file later does not remove it from the history. | A repository-exposure list: every instance of real PII or a credential found in the working tree or commit history, with file and location, marked for removal and rotation. | OWASP Top 10:2025 A04 Cryptographic Failures; OWASP ASVS 5.0.0 (sensitive data handling, document level, FLAG-VERIFY) |
| Inspect what the application writes to its logs and what it returns in error responses. Confirm that passwords, tokens, full payment details, and other sensitive fields are never written to a log line or echoed back inside an error message. | Logs are read by far more people and systems than the database, and they are often less protected. A password or card number copied into a log line, or dumped into an error page when something breaks, is a leak that no interface ever revealed. | A no-secret-in-logs result: the list of personal-data and secret fields, each confirmed absent from log output and from error responses, with any field that does appear flagged with its location. | OWASP Top 10 for LLM Apps 2025 LLM02 Sensitive Information Disclosure; OWASP Top 10:2025 A09 Security Logging and Alerting Failures |
| For any feature where the app sends user input to an AI model and shows the reply, confirm the reply cannot disclose another person's data, a secret, or system internals it was given as context. | If your AI feature can be steered into repeating back a value from its context, a user can ask it for someone else's details or for a key it was handed, and the model will comply because it has no sense of what is private. The leak comes out as ordinary, friendly text. | A model-output disclosure result: the categories of sensitive data present in the model's context (other users' records, secrets, system prompt), each tested with a probing request, with any reply that exposed protected data flagged. | OWASP Top 10 for LLM Apps 2025 LLM02 Sensitive Information Disclosure |
| Confirm a working path exists to delete a specific person's data on request, and that running it actually removes the data rather than hiding it. | If someone asks you to remove their information and you have no real way to do it, you cannot honor the request, and the data lingers in places you have forgotten. A delete that only hides a row in the interface leaves the record fully intact underneath. | A deletion-path artifact: the actual steps or code that remove one named person's data, the list of tables and stores it touches, and confirmation that after running it the data is gone (not merely flagged hidden). | OWASP Top 10:2025 A04 Cryptographic Failures; OWASP ASVS 5.0.0 (data handling, document level, FLAG-VERIFY) |

## Standard checks

A competent team does these. Run them whenever S3 (personal data) is present, and on any data touched by S1 (money) or S6 (irreversibility), per the stakes signals above.

| Check | Why it matters to your business | Evidence the agent must produce | Citation |
|---|---|---|---|
| Confirm sensitive data is also protected at rest, meaning the stored copy is encrypted, and that especially sensitive fields (passwords, payment tokens, health or identity numbers) get stronger handling than ordinary fields. Passwords must be stored hashed, never recoverable as plain text. | Encryption in transit protects the data on the wire; it does nothing for the copy sitting in the database if that store is ever accessed or stolen. A breach of a database that stored passwords in plain text hands every account to the attacker at once. | An at-rest protection map: each category of sensitive data, where it is stored, whether that store is encrypted, and the specific handling of passwords (hashed, not plain) and payment fields, with any unprotected category flagged. | OWASP Top 10:2025 A04 Cryptographic Failures |
| Build an inventory of every place personal data lives and every place it flows to: which tables hold PII, which third-party services receive it (analytics, email senders, AI providers, payment processors), and what each one gets. | You cannot protect or delete data you have not mapped. Personal data routinely leaks to a third party nobody remembered, an analytics tool that received full email addresses, an AI provider sent a customer's private note. The map is the only way to see those flows. | A data-flow inventory: a table of every PII category, the stores that hold it, and every external service it is sent to, with the specific fields each external service receives. | NIST AI RMF generative-AI profile AI 600-1 (data-privacy actions); OWASP Top 10 for LLM Apps 2025 LLM02 Sensitive Information Disclosure |
| Confirm the app collects only the personal data the feature actually needs, and keeps it only as long as needed, rather than gathering and retaining everything by default. | Every extra field you collect and every record you keep past its usefulness is data that can leak but serves no purpose. A form that quietly captures a date of birth it never uses is pure liability with no benefit. | A data-minimization result: per feature, the personal fields collected versus the fields the feature genuinely requires, any excess flagged, plus a stated retention point for each PII category (when it gets deleted) or a flag that none exists. | NIST AI RMF generative-AI profile AI 600-1 (data-privacy actions); OWASP ASVS 5.0.0 (data handling, document level, FLAG-VERIFY) |
| For any data sent to an external AI provider, confirm what happens to it on their side: whether it is retained, whether it could be used to train a model, and that no more personal data is sent than the feature needs. | Text your app sends to an AI model leaves your control. If a customer's private message is sent in full and the provider retains it or trains on it, that data now lives somewhere you cannot delete it, and your delete-on-request path cannot reach it. | An AI-data-handling result: for each AI provider the app uses, the personal data sent to it, the provider's stated retention and training behavior for that data, and a flag where sensitive fields are sent that the feature did not require. | NIST AI RMF generative-AI profile AI 600-1 (data-privacy actions); OWASP Top 10 for LLM Apps 2025 LLM02 Sensitive Information Disclosure |

## Extra-mile checks

Frontier rigor. Even strong engineering teams treat these as extra, extended effort. Run them on this domain's surface only when the stakes gate forces it, as annotated.

| Check | Why it matters to your business | Evidence the agent must produce | Citation | Stakes gate + frontier pattern |
|---|---|---|---|---|
| Reduce the exposure of stored identifiers by separating or masking them: store data so that a leak of one part does not directly identify a person, for example by keeping direct identifiers apart from the records they describe, or masking fields not needed in full. | When the same data store serves many tenants on shared infrastructure, one leak path exposes everyone. Separating direct identifiers from their records means a partial breach yields fragments, not a clean list of named people, which is the difference between an incident and a catastrophe. | A data-separation artifact: which direct identifiers are kept apart from or masked within the main records, how a record is re-linked to a person only when genuinely required, and evidence that a leak of the primary store alone does not directly name individuals. | OWASP Top 10:2025 A04 Cryptographic Failures; NIST AI RMF generative-AI profile AI 600-1 (data-privacy actions) | Forced by S5 Blast radius combined with S1 or S6. Frontier pattern: identifier separation / data masking. |
| Add automated detection that flags personal data appearing where it should not: a check that scans outbound responses, logs, and AI replies for patterns that look like emails, card numbers, or government IDs, and alerts when one shows up in the wrong place. | Across many users and a public surface, a single new leak introduced by a later change can expose data at scale before any human notices. An automated detector turns "we found out when a customer complained" into "the system caught it the moment it shipped." | A leakage-detection artifact: the patterns the detector watches for (email, payment, ID formats), the channels it inspects (responses, logs, model output), and a sample run showing it firing on a planted test value. | OWASP Top 10:2025 A09 Security Logging and Alerting Failures; OWASP Top 10 for LLM Apps 2025 LLM02 Sensitive Information Disclosure | Forced by S5 Blast radius combined with S1 or S6. Frontier pattern: continuous PII-leak detection. |
| Apply the structured generative-AI data-risk actions to every AI surface that handles personal data: document the data category, the privacy risk, the control in place, and the residual risk, as a written record per surface. | For an autonomous or high-blast-radius AI feature, "we think it is fine" is not a position you can defend after a leak. A written risk record per surface, tied to a recognized framework, is what lets you show the protection was deliberate and lets you find the gap before an attacker does. | A generative-AI data-risk record: per AI surface handling PII, the data category, the identified privacy or disclosure risk, the control applied, and the residual risk stated plainly, mapped to the AI 600-1 data-privacy actions. | NIST AI RMF generative-AI profile AI 600-1 (data-privacy and information-security actions) | Forced by S5 Blast radius combined with S1 or S6. Frontier pattern: framework-mapped AI data-risk register. |

## When to stop and hire a human

Bring in an independent human reviewer, and where relevant a privacy professional, for this domain when any of these are true:

- Your app holds sensitive personal data (health, financial, government identity numbers) for many users (S3 plus S5), and the at-rest protection map or the data-flow inventory shows a gap you do not fully understand. A leak of this data class is the kind that ends businesses, and a gap you cannot explain is not a place to guess.
- You cannot produce a deletion path that you can confirm actually removes a person's data everywhere it lives, including data already sent to third parties and AI providers. A delete you cannot verify is a promise you cannot keep.
- Personal data flows to external services or AI providers (S3 plus S6) and you cannot establish what those providers retain or train on. Data you have lost control of needs a human to assess the real exposure.

This protocol catches a meaningful slice of data-leak paths cheaply. It is not a guarantee, and an AI checking AI is weaker than an independent human review on the cases that matter most. Domain K covers what a professional review adds and where its honest ceiling sits. For sensitive data at scale, route there. (When the Indonesian layer of this protocol lands, it adds the specific legal duties that apply to personal data under local law; the checks above are the general, cross-border baseline.)

## Agent instructions

```
DOMAIN D: DATA AND PRIVACY

Scope by stakes:
  Run FLOOR on any app that touches personal data (PII) of any kind.
  If S3 (stores personal data) is present, add STANDARD.
  If S1 (money) or S6 (irreversibility) touches the data, add STANDARD on that data.
  If S5 (blast radius) combines with S1 or S6, add EXTRA-MILE.
  If the app genuinely stores no personal data, run FLOOR to confirm that absence and stop.
  Do NOT add identifier-separation, leak-detection pipelines, or a framework-mapped risk
  register to an app that holds no personal data.

Circularity note (see the circularity-guard protocol):
  The agent that wrote the data-handling code "knows" which fields are sensitive and assumes
  they are handled; that assumption is exactly the blind spot. Run this domain in a CLEAN,
  fresh context with no access to the build rationale. Prefer a different model from the one
  that wrote the code. Trace where data actually goes from the code as written, not from what
  the author intended.

Produce these artifacts (not verdicts):
  FLOOR:
    1. Transport-protection result: every PII endpoint on HTTPS/TLS; plain-connection PII flagged.
    2. Repository-exposure list: real PII or credentials in working tree or git history, located, marked for removal + rotation.
    3. No-secret-in-logs result: sensitive fields confirmed absent from logs and error responses; any present flagged with location.
    4. Model-output disclosure result: sensitive categories in model context, each probed; any reply exposing protected data flagged.
    5. Deletion-path artifact: actual steps to delete one named person's data, the stores it touches, confirmation the data is gone.
  STANDARD (S3 present, or money/irreversible data):
    6. At-rest protection map: each sensitive category, its store, whether encrypted; passwords hashed not plain; unprotected categories flagged.
    7. Data-flow inventory: every PII category, the stores holding it, every external service receiving it, with the fields each gets.
    8. Data-minimization result: collected vs needed fields per feature, excess flagged, plus a retention point per category or a flag if none.
    9. AI-data-handling result: per AI provider, data sent, the provider's retention/training behavior, over-sent sensitive fields flagged.
  EXTRA-MILE (blast radius with money or irreversibility):
    10. Data-separation artifact: direct identifiers kept apart or masked; how re-linking happens; leak of primary store alone does not name people.
    11. Leakage-detection artifact: patterns watched (email/payment/ID), channels inspected, a sample run firing on a planted value.
    12. Generative-AI data-risk record: per AI surface, data category, privacy risk, control, residual risk, mapped to AI 600-1 data-privacy actions.

Output a findings table with these columns and nothing weaker than evidence:
  | Severity | Business risk in plain words | Evidence artifact | Citation | Suggested fix |

Rules:
  - Translate every finding into a concrete business consequence a non-coder understands.
    Not "PII in logs" but "anyone who can read the server log can read your customers' passwords."
  - Cite only the controls named in this domain (A04, A09, LLM02, AI 600-1, ASVS 5.0.0 at document level).
    Do not invent IDs. Do not print an ASVS control number beyond V1 1.2.5.
  - No bare verdicts. "Data looks secure" is not a finding. Attach the artifact that proves the claim.
  - If you cannot produce an artifact a check demands, say so and mark that check INCOMPLETE.
  - This phase covers general PII handling, a working deletion path, and no-secret-in-logs.
    Do not assert specific national legal duties here; those arrive in the localized layer.
```
