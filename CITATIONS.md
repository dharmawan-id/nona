# Citations

Every floor and standard check in this audit resolves to a named, dated, public control from a real authority. This file is the map. When a check says "do X," you can trace X here to OWASP, NIST, SLSA, CIS, or a vendor's own production guidance, and answer the question a skeptic will ask: "says who?"

This project is a translation layer, not original security research. The value added is selection (picking the subset that matters to someone who shipped an app with an AI tool and cannot read the code), translation (phrasing each control as a plain business risk), and agent-consumability (writing checks an AI agent can run and produce evidence for). The controls themselves come from the sources below.

Two ground rules used throughout:

- The durable part of any check is its plain-language meaning. The citation is the defense. Where a control's exact identifier is version-fragile (it can shift between editions), this file states the plain meaning and cites the document, rather than printing a fine-grained control number that may be wrong by the time you read it.
- No invented identifiers. Every ID below appears in a published standard. Where an ID could not be pinned to a printable level of detail with confidence, that is said out loud in the "Verify before you quote a fine-grained ID" section near the end.

Versions and dates were checked against the source on 2026-06-04. Standards move; re-check a version before you rely on it in anything high-stakes.

---

## How tiers map to the standards

Three rigor tiers run through the whole audit. Here is what each one leans on.

- **Floor** ("did anyone do the obvious thing?"): OWASP Top 10:2025 with no instance present, OWASP ASVS 5.0.0 Level 1, CIS Benchmarks Level 1, SLSA Build L1, the Supabase production essentials, and the LLM floor (some prompt-injection mitigation, no obvious secret or personal-data leak, a usage cap exists).
- **Standard** ("a competent team would do this"): ASVS 5.0.0 Level 2, the full OWASP API Security Top 10 2023, the full OWASP Top 10 for LLM Applications 2025, SLSA Build L2, the NIST SSDF process practices, and the NIST AI RMF MAP / MEASURE / MANAGE functions.
- **Extra-mile** (frontier; even strong teams treat this as extra effort): ASVS Level 3, SLSA Build L3 plus the Source Track, CIS Level 2, a formal threat model and adversarial pen-test, and the named containment and verification patterns described in the protocol.

---

## The standards map

### OWASP Top 10:2025

The baseline list of the most common, most impactful web application security weaknesses. Eighth edition, announced 6 November 2025 at the OWASP Global AppSec conference in Washington DC, with final prose refinement landing in early 2026. Cite it as "OWASP Top 10:2025."

Two changes in this edition matter for an AI-built app:

- "Vulnerable and Outdated Components" became **A03 Software Supply Chain Failures**, with the scope widened to build systems, CI/CD pipelines, dependencies, and provenance. This is the authority behind the dependency and supply-chain checks.
- **SSRF** (Server-Side Request Forgery, where an attacker tricks your server into making requests it should not) is no longer a standalone entry. It now sits inside **A01 Broken Access Control**. Do not cite a standalone "A10 SSRF 2025"; it does not exist in this edition.

The full list, used across the protocol:

| ID | Title |
|---|---|
| A01 | Broken Access Control (includes IDOR and SSRF) |
| A02 | Security Misconfiguration |
| A03 | Software Supply Chain Failures |
| A04 | Cryptographic Failures |
| A05 | Injection |
| A06 | Insecure Design |
| A07 | Authentication Failures |
| A08 | Software or Data Integrity Failures |
| A09 | Security Logging and Alerting Failures |
| A10 | Mishandling of Exceptional Conditions |

A glossary term used above: **IDOR** (Insecure Direct Object Reference) means a stranger can open another customer's records by changing a number in the web address. **A09** is renamed from the 2021 "Logging and Monitoring Failures" and is the authority for the ops detection and alerting checks. **A10** is new in this edition and covers error handling that fails safe instead of failing open.

Source: https://owasp.org/Top10/2025/

### OWASP ASVS 5.0.0

The Application Security Verification Standard. Where the Top 10 lists the common weaknesses, ASVS is the detailed, leveled checklist you verify an app against. Version 5.0.0, released 30 May 2025 at OWASP Global AppSec EU in Barcelona. It defines three verification levels: Level 1 (baseline), Level 2 (the standard for most production apps), and Level 3 (high assurance). This audit maps floor to Level 1 and standard to Level 2.

The 5.0.0 edition reorganized and renumbered everything. Identifiers use the form V-chapter.section.requirement. One specific identifier is stable enough to print: **V1 1.2.5 (OS command injection)**, meaning untrusted input must never be assembled into a system command; use parameterized calls instead. For any ASVS requirement beyond that one, this audit cites ASVS 5.0.0 at the document level and states the plain meaning, because the per-chapter numbering in 5.0.0 was not line-by-line confirmed and printing a wrong control number would undermine the very point of citing.

Source: https://github.com/OWASP/ASVS and https://owasp.org/www-project-application-security-verification-standard/

### OWASP WSTG (Web Security Testing Guide)

The how-to-test companion to ASVS: a methodology for how to actually test for each class of weakness, rather than a list of weaknesses. Domain K cites it as the penetration-testing methodology authority. It is cited at the document level; its exact current version was not re-verified in this pass (see "Verify before you quote a fine-grained ID" near the end).

Source: https://owasp.org/www-project-web-security-testing-guide/

### OWASP API Security Top 10 2023

The same idea as the Top 10, focused on the parts of an app that talk machine-to-machine (its API). This is where the authorization gaps an AI tool most often leaves show up. The 2023 edition is current; there is no 2025 edition yet. The four entries used in this audit:

| ID | Title | Plain meaning |
|---|---|---|
| API1 | Broken Object Level Authorization (BOLA) | A user can read or change records that belong to someone else by referencing their ID. |
| API2 | Broken Authentication | The login or token check on the API can be bypassed. |
| API5 | Broken Function Level Authorization (BFLA) | A normal user can call an admin-only action. |
| API6 | Unrestricted Access to Sensitive Business Flows | A money or quota flow (checkout, signup, redeem) can be driven by automation or abused. |

Source: https://owasp.org/API-Security/editions/2023/en/0x11-t10/

### OWASP Top 10 for LLM Applications 2025

The Top 10 equivalent for the AI surfaces inside your app: anywhere your app sends user text to a model and acts on the result. Published 12 March 2025 by the OWASP GenAI Security Project. The full list, used across the protocol:

| ID | Title |
|---|---|
| LLM01 | Prompt Injection |
| LLM02 | Sensitive Information Disclosure |
| LLM03 | Supply Chain |
| LLM04 | Data and Model Poisoning |
| LLM05 | Improper Output Handling |
| LLM06 | Excessive Agency |
| LLM07 | System Prompt Leakage |
| LLM08 | Vector and Embedding Weaknesses |
| LLM09 | Misinformation |
| LLM10 | Unbounded Consumption |

Two terms worth glossing: **prompt injection** (LLM01) is when a user, or text the model reads, smuggles in instructions that hijack what the model does. **Unbounded Consumption** (LLM10) is the authority behind the cost-cap checks; without a cap, a paid model call can run up a bill with no ceiling, sometimes called denial-of-wallet.

Source: https://genai.owasp.org/llm-top-10/

### OWASP Risk Rating Methodology

The standard way to rank a finding by how serious it is: estimate how likely the weakness is to be exploited, and how badly it would hurt if it were, then combine the two (likelihood times impact). Domain L uses this to sort findings by business risk so the most dangerous ones get fixed first. It is a methodology, not a numbered control list, so it is cited by name.

Source: https://owasp.org/www-community/OWASP_Risk_Rating_Methodology

### NIST SSDF: SP 800-218 v1.1 and SP 800-218A

The Secure Software Development Framework from the US National Institute of Standards and Technology. It describes practices for building software securely, organized into four families:

- **PO** Prepare the Organization
- **PS** Protect the Software
- **PW** Produce Well-Secured Software
- **RV** Respond to Vulnerabilities

The specific tasks this audit cites, all from SP 800-218 v1.1: **PW.1** (design software to meet security requirements and threat-model it), **PW.4** (acquire and reuse well-secured third-party software), **PS.3** (archive and protect each software release), and **RV.1 / RV.2 / RV.3** (identify and confirm vulnerabilities, assess and remediate them, and analyze root causes). They are cited at the task level by their published identifiers.

SP 800-218 version 1.1 (February 2022) is the current authoritative final. A revision is in draft; this audit cites v1.1 until the revision is promoted to final. The companion **SP 800-218A** (26 July 2024) is the generative-AI profile: the one first-party authority that speaks directly to securing AI inside the development process, including reviewing AI-produced code and tracking where generated artifacts came from.

Honesty note on status: SP 800-218A was issued under a US executive order (EO 14110) that was rescinded in January 2025. The NIST documents themselves remained published and marked final as of 2026-06-04, with no withdrawal notice. Cite them as voluntary technical guidance, not as a compliance obligation.

Sources: https://csrc.nist.gov/pubs/sp/800/218/final and https://csrc.nist.gov/pubs/sp/800/218/a/final

### NIST AI RMF: AI 100-1 and AI 600-1

The AI Risk Management Framework. AI 100-1, version 1.0 (January 2023), structures AI risk work into four functions:

- **GOVERN** (cross-cutting)
- **MAP**
- **MEASURE**
- **MANAGE**

The companion **AI 600-1** (26 July 2024) is the generative-AI profile, with twelve risk categories and a large catalog of suggested actions. The standard tier applies MAP, MEASURE, and MANAGE at the feature level; the generative-AI profile informs the AI-specific data and code-risk checks. The same EO 14110 rescission note above applies to AI 600-1: still published and final, cite as voluntary guidance.

Sources: https://nvlpubs.nist.gov/nistpubs/ai/nist.ai.100-1.pdf and https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf

### SLSA v1.2

Supply-chain Levels for Software Artifacts, pronounced "salsa." A framework for knowing how and where your software was built, so a tampered build is detectable. Version 1.2, released 24 November 2025, which added the Source Track. The Build Track levels carried forward unchanged:

- **Build L1** provenance exists (a record of how the artifact was built; it may be unsigned or incomplete).
- **Build L2** a hosted build platform generates and signs that provenance.
- **Build L3** the build runs on a hardened, isolated platform.

This audit places Build L1 at the floor, Build L2 at the standard tier, and Build L3 plus the Source Track at the extra-mile tier.

Source: https://slsa.dev/spec/v1.2/

### CIS Benchmarks

Consensus hardening baselines from the Center for Internet Security, written as concrete line-item settings. Each benchmark defines a Level 1 (broadly applicable, low-friction) and a Level 2 (stricter, more disruptive) profile. Two are relevant to a typical AI-built app:

- **CIS PostgreSQL Benchmark, Level 1**, cited for the running major version. The benchmark is published per Postgres major release (for example PG17 v1.0.0, dated 30 January 2025, and a PG18 edition in 2026). Because a managed database upgrades its major version over time, this audit cites "CIS PostgreSQL Benchmark, Level 1, for the running major version" rather than hard-coding one number.
- **CIS Cloud Foundations Benchmarks, Level 1**, published per cloud provider.

There is no CIS Benchmark for Vercel or Next.js. That gap is confirmed and deliberate to surface. For that stack, this audit uses the vendor's own security documentation plus the OWASP Secure Headers guidance.

Source: https://www.cisecurity.org/cis-benchmarks

### Vendor authorities

Where no neutral standard covers a specific platform, the platform's own production guidance is the authority. These are vendor documents and are cited as such.

- **Supabase Production Checklist** and **Row Level Security (RLS) docs**. RLS is the database feature that restricts each row to the user who owns it. The essentials cited at the floor: turn RLS on for every table in an exposed schema, never use the service_role key (the all-powerful database key) in browser or client code, and enforce SSL. The RLS docs also warn against trusting user-supplied metadata inside a policy.
- **Vercel and Next.js security documentation** plus OWASP Secure Headers, used for deploy hygiene on that stack: security headers configured, and the rule that a `NEXT_PUBLIC_` variable is visible in the browser and must never hold a secret.

Sources: https://supabase.com/docs/guides/deployment/going-into-prod , https://supabase.com/docs/guides/database/postgres/row-level-security , https://vercel.com/docs/frameworks/full-stack/nextjs

### Indonesia layer (later language pass)

The Indonesian-language edition of this audit will add the local legal authorities below. They are listed here for completeness; the checks that cite them ship with that edition.

- **UU PDP (Law 27 of 2022)**, Indonesia's personal data protection law, including the articles on lawful basis and consent, data-subject rights, security obligations, and breach notification, read together with Constitutional Court decision 151/PUU-XXII/2024.
- **PSE registration** under Permenkominfo 5/2020 for electronic system operators.
- **Payment-gateway callback signature schemes** for verifying that a payment notification is genuine: Midtrans (SHA-512), Xendit (X-CALLBACK-TOKEN), and iPaymu (HMAC-SHA256).

---

## Empirical anchors

The pitch and the "why this exists" material rest on published measurements, not assertion. Each anchor below carries its source, its date, and the honest caveat that keeps it from being oversold. Read the caveats as part of the claim.

### What AI-generated code actually ships with

**SUSVIBES: 61% correct, 10.5% secure.** The strongest single proof that "it works" is not "it is safe." On 200 real, repository-level feature tasks built from historical vulnerability fixes (spanning 77 weakness types, roughly 180 lines edited across multiple files each), an agent paired with a frontier model produced code that was 61% functionally correct but only 10.5% secure. Adding security hints to the request did not fix it, which is why a generic "be secure" instruction is not enough and a structured, check-by-check audit is. Zhao et al., arXiv:2512.03262, 2 December 2025. https://arxiv.org/abs/2512.03262

**Veracode: 45% of AI-generated code fails security tests.** Across 100-plus models on 80-plus tasks, 45% of samples introduced an OWASP Top 10 weakness, with 2.74 times more vulnerabilities than human-written code, and the failure rate was flat regardless of model size. That last point is the load-bearing one: insecurity here is structural, not a defect the next model release removes. Honesty label: Veracode is a commercial security vendor, so this is a vendor study; it is corroborated in direction by the independent academic anchors above and below. Veracode, "2025 GenAI Code Security Report," 30 July 2025. https://www.veracode.com/blog/genai-code-security-report/

**A conservative counterweight: 12.1% of real-world files.** A large-scale scan of 7,703 AI-generated files with static analysis found 87.9% had no mapped weakness and 12.1% had at least one. This looks far milder than the 45% above, and the reason is the measurement design: this study counts ordinary files of varying complexity, while the 45% and 10.5% figures come from curated, security-relevant tasks. Both are true. The scary numbers apply precisely to the security-sensitive surfaces this audit targets; the milder number applies to code at large. Always present the 10.5% / 12.1% / 45% spread together with this caveat rather than cherry-picking the most alarming one. Schreiber and Tippe, arXiv:2510.26103, 30 October 2025. https://arxiv.org/abs/2510.26103

**In the wild: 5,600 shipped apps.** A passive scan of 5,600 publicly reachable apps built with AI tools found more than 2,000 vulnerabilities, more than 400 exposed secrets, and 175 instances of leaked personal data including medical records and bank account numbers. Because the scan was non-destructive, these are explicitly lower-bound counts. Honesty label: the scanner is a commercial security vendor. Escape.tech, 29 October 2025. https://escape.tech/blog/methodology-how-we-discovered-vulnerabilities-apps-built-with-vibe-coding/

### Why the builder over-trusts the output

**The false sense of security.** In a controlled, peer-reviewed study, people using an AI coding assistant wrote less secure code and were more likely to believe their code was secure. This is the keystone for the whole premise: the human check is miscalibrated upward exactly when AI is involved. Perry et al., ACM CCS 2023, arXiv:2211.03622. https://arxiv.org/abs/2211.03622

**Confidence rises when the reviewer is wrong.** Research on non-experts overseeing AI output found that when a reviewer missed an error while being wrong, their confidence increased rather than fell (a measured effect, Hedges' g = 0.85). The practical consequence drives a core rule of this audit: surface concrete evidence and artifacts, not a confidence-scored verdict, because a confident-looking verdict manufactures false trust. Grunde-McLaughlin et al., arXiv:2602.16844, 2026. https://arxiv.org/html/2602.16844

### Why an AI auditing AI is a real method, and a limited one

**The circularity problem, named.** When the same class of AI both builds and tests, the protective mismatch that makes human review useful disappears: "the testing agents inherit the same weaknesses as the coding agents." A credible institution stated the problem cleanly and proposed no fix. That gap is what the circularity guard in this audit addresses. Stanford Law CodeX (Kahana), "Built by Agents, Tested by Agents, Trusted by Whom?", 8 February 2026. https://law.stanford.edu/2026/02/08/built-by-agents-tested-by-agents-trusted-by-whom/

**Separating the review context helps, and is cheap.** A direct experiment found that reviewing in a fresh session with no build history beat reviewing in the same session, with the largest gain on critical errors (about 11 percentage points). A control condition (reviewing twice in the same session) showed no gain, which isolates context separation, not extra passes, as the mechanism. This is why the audit runs in a clean context and prefers a different model.

**And the ceiling is honest.** In that same experiment, even the best condition caught only about 28.6% (F1) of injected errors. AI reviewing AI catches a meaningful slice of critical bugs cheaply and misses most injected errors in isolation. It is not a substitute for a professional penetration test. Claiming otherwise would recreate the false sense of security this project exists to fight. arXiv:2603.12123, 12 March 2026. https://arxiv.org/html/2603.12123

The direction of "prefer a different model lineage" has theoretical support (an information-theoretic argument that diverse agents reduce shared blind spots), but the size of that benefit is not pinned down in the literature. It is recommended as best practice, with no promised catch rate. Rajan, arXiv:2511.16708, 2025. https://arxiv.org/pdf/2511.16708

### Why this file class has to defend itself

A rules, skills, or agent-instruction file is processed by an agent as trusted configuration, which makes it a target. A systematization study reported prompt-injection success above 85% against current defenses, with the attack surfaces tested including the exact file types this kind of audit ships as. Maloyan and Namiot, arXiv:2601.17548, 2025-2026. https://arxiv.org/html/2601.17548v1

A study of 3,984 publicly published agent skills found 36.8% carried a security flaw of some severity and roughly 36% contained a prompt-injection vulnerability, with skills inheriting the agent's full permissions and the publishing barrier as low as a one-week-old account and no mandatory review. This is why this project ships integrity guidance: pin a version, verify the file hash, and treat any third-party fork as untrusted until reviewed. Snyk, "ToxicSkills," 5 February 2026. https://snyk.io/blog/toxicskills-malicious-ai-agent-skills-clawhub/

A framing rule that applies to every number on this page: the independent academic work (SUSVIBES, the large-scale file scan, Perry et al., the cross-context experiment) anchors any claim where a vendor's incentive to alarm could be challenged. Vendor figures are labeled as vendor figures and used for corroboration, not as the sole basis for a claim.

---

## The honest ceiling

State this wherever the numbers are quoted, because it is the difference between a useful tool and an overclaim:

- This audit reduces risk. It does not guarantee safety.
- AI reviewing AI catches a meaningful slice of critical bugs cheaply, and in isolation misses most injected errors (best measured around 28.6% F1). It is not a substitute for a professional penetration test.
- An app with real stakes (money, many users, irreversible actions, an autonomous agent) should still pay for an independent human audit. The audit tells you when you have crossed that line.
- The alarming headline figures come from studies with different measurement designs, and some from vendors with an incentive to alarm. The independent academic counterweights are cited alongside them on purpose.

---

## Verify before you quote a fine-grained ID

Some identifiers are version-fragile: correct today at the document level, but risky to print at a fine-grained level because the exact number can shift between editions or was not line-by-line confirmed. For these, this audit states the plain meaning and cites the document. If you are about to quote one of these at a finer level in something that matters, confirm it against the primary source first.

- **ASVS 5.0.0 control numbers beyond V1 1.2.5.** Confirmed: 17 chapters, the V-chapter.section.requirement format, V1 is Encoding and Sanitization. Not confirmed line-by-line: the per-chapter numbering for authorization and other chapters. Pull the 5.0.0 control list from the ASVS repository before printing a specific V-number.
- **OWASP Top 10:2025 final-versus-late-refinement status.** The categories and their order are stable and verified. Reports differ on whether the polished prose was finalized in November 2025 or early 2026. Re-check owasp.org/Top10/2025 for a final stamp; cite as "OWASP Top 10:2025" regardless.
- **CIS PostgreSQL major version.** Cite "for the running major version" rather than a fixed number, because a managed database changes major version over time.
- **NIST SSDF revision.** A revision of SP 800-218 is in draft. Version 1.1 remains the authoritative final; if the revision is promoted, re-map the PO / PS / PW / RV task identifiers.
- **NIST generative-AI profiles under the rescinded executive order.** SP 800-218A and AI 600-1 remained published and final as of 2026-06-04 despite the rescission of EO 14110. Cite as voluntary technical guidance, and re-verify near any launch in case NIST re-issues or renames them.
- **OWASP WSTG version.** The Web Security Testing Guide is referenced as a penetration-testing methodology authority; its current version was not re-verified in this pass. Confirm the latest version if you cite a specific one.
- **CIS Cloud Foundations versions per provider.** These exist per cloud provider; the exact current version for a given provider was not individually re-verified. Confirm the specific benchmark for the cloud the app targets.

All version and date claims on this page were checked against the source on 2026-06-04.
