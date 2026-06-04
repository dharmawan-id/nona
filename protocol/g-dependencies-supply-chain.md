# Domain G: Dependencies and Supply Chain

## What this is

Almost none of the code in your app is code your AI tool wrote. The bulk of it is borrowed: ready-made packages, pulled in from a public registry, that handle the boring parts so the tool does not have to build them from scratch. A typical app depends on dozens of these directly, and each of those drags in dozens more it needs to function, so a small app can easily run on hundreds of packages written by strangers. Your supply chain is all of that borrowed code, plus the machinery that fetches it and assembles your app from it.

This domain asks a few plain questions about that borrowed code. Does every package your app claims to use actually exist and is it the real one, not an impostor with a similar name. Are the exact versions you tested the exact versions that ship, every time, rather than whatever the registry happened to serve that day. Does any package you depend on carry a known, published security hole. And one more that applies to AI-built apps in particular: the AI tools, plug-ins, and agent skills you installed to help build or run the app are themselves borrowed code with full reach into your machine, so they belong in the same accounting.

## What you can't see here

You asked the AI tool to add a feature, it imported a package to do the job, and the feature worked. What you cannot see is the chain of code that came in behind that one import, who wrote it, whether it is even the package the tool meant to install, and whether any link in that chain has a hole an attacker already knows about. A non-coder reads the app by its screens. A supply-chain problem has no screen. It is a name in a configuration file and a pile of downloaded code you will never open, and "it works" tells you nothing about whether one of those packages is hostile or broken.

AI tools add a failure mode that did not exist before, and it is the headline risk of this domain: they invent packages. When an AI model is asked to write code, it sometimes imports a package that does not exist, a plausible-sounding name it produced from pattern, not from reality. A research note from the Cloud Security Alliance (2026-04-04, a mix of measured and estimated figures) put roughly one in five AI code samples as referencing a non-existent package, and found these invented names are not random: about 43% of them repeat across similar prompts, and 58% reappear within ten runs of the same request. That repetition is the danger. An attacker watches for the invented names that keep coming back, registers a real package under one of those names, fills it with malicious code, and waits. The next builder whose AI hallucinates that same name installs the attacker's code on the first try and never suspects a thing, because the install succeeded and the app ran. The plain name for this is slopsquatting: squatting on the package names that AI tools reliably invent.

There is a second blind spot that is specific to how AI apps get built. The helpers you bolted onto your AI tool to assist with the work (its plug-ins, its agent skills, the small tool descriptions it loads) are borrowed code too, and they run with the same reach your tool has: your files, your environment variables, your ability to send messages or run commands. A study of 3,984 publicly published agent skills (Snyk, 2026-02-05) found that 36.82% carried a security flaw of some severity and roughly a third contained a way for hostile text to hijack the skill, with the barrier to publishing one as low as a week-old account and no required review. You installed those helpers to build faster. Each one is a stranger's code with a key to the house, and none of it showed up as a feature on a screen.

The reason all of this stays invisible is the same reason it is dangerous. The borrowed code is the part you were never going to read, by design, because reading it was the work you were trying to skip. A naive self-check by your own agent tends to confirm "the package is imported and the code runs" and stop there, which is exactly the check that a hallucinated name, a silently-shifted version, or a known-vulnerable dependency sails straight through.

## When this matters (stakes signals)

This domain runs at FLOOR for every app, with no exception, because the slopsquatting risk does not care how small or low-stakes your app is. An invented package name installs the same hostile code on a weekend hobby project as it does on a payments platform. The floor here (every imported package proven real, the exact versions locked, no dependency with a known critical hole) is the baseline for anyone who built with an AI tool, period.

The stakes signals decide how deep the checks go on this domain's surface.

- S5 Blast radius (many users, multi-tenant, a public API, shared infrastructure) is the main escalator here. Run at least STANDARD when it is present. A poisoned or vulnerable package in an app that one person runs is one person's problem; the same package in a shared, multi-tenant app is a single hole that reaches every customer at once, because they all run the same borrowed code.
- S4 Autonomy (an AI agent in your app can take actions on its own: send an email, run code, call a tool, spend money, without a human approving each action) escalates this domain's AI-component surface to EXTRA-MILE. An autonomous agent that loads plug-ins, skills, or tool descriptions is installing instructions it will then act on, so a hostile one of those is not just bad code sitting there, it is a hand on the controls. This matches the protocol-wide rule that any autonomous agent forces frontier rigor on the security, AI-code, and pen-test areas, and the supply chain of what that agent loads belongs to the same escalation.
- S1 Money or S6 Irreversibility (the app moves money or credits with cash value, or performs actions that cannot be undone) present together with S5: escalate this domain to EXTRA-MILE. When a single compromised dependency can reach money or an irreversible action across many users, the integrity of the build (signed provenance, verified hashes, a watched component list) stops being optional polish.

If your app is small, single-user, handles no money or personal data, and runs no autonomous agent, the standard and extra-mile checks here do not apply, and the floor checks are the whole job. Do not build a signed-provenance pipeline or a continuous component-monitoring system for a to-do list. That is effort spent where there is no stake. The floor (real packages, locked versions, no known-critical holes) is genuinely enough for a low-stakes app, and over-applying build-integrity ceremony to it is a failure of judgment, not diligence.

## Floor checks

Never skip these, on any app, at any stakes level.

| Check | Why it matters to your business | Evidence the agent must produce | Citation |
|---|---|---|---|
| Take every package the app imports or declares as a dependency and confirm each one actually exists on its official registry and is the genuine package, not a look-alike with a transposed letter, an extra word, or a slightly different name. Pay special attention to any package whose name the AI tool produced. | This is the slopsquatting check, and it is the single most important thing in this domain for an AI-built app. An invented or impostor package name installs a stranger's code into your app on the first try, and the install succeeding tells you nothing, because a hostile package is built to install cleanly and run normally while it does its real work. | A package-existence result: every imported and declared package listed, each marked "exists on the official registry as the genuine package" or "not found / suspected impostor," with the suspicious ones (nonexistent, name-typo, or unexpectedly recent or unpopular for what it claims to do) flagged by name and location. | OWASP Top 10:2025 A03 Software Supply Chain Failures; OWASP Top 10:2025 A08 Software or Data Integrity Failures |
| Confirm a lockfile is committed to the repository and that the app builds from it. A lockfile is the record that pins every dependency, direct and indirect, to one exact version and one exact verified copy, so the same code is fetched every time. | Without a locked file, your app fetches whatever version the registry serves at build time, which means the code you tested and the code that ships can quietly differ, and a dependency you never chose can change under you between one deploy and the next. The lockfile makes the build repeatable, so what you reviewed is what runs. | A lockfile artifact: confirmation that the lockfile exists, is committed to version control (not ignored), and covers the full dependency tree, with a flag if it is missing, stale relative to the declared dependencies, or not actually used by the build. | OWASP Top 10:2025 A08 Software or Data Integrity Failures; SLSA v1.2 Build L1 |
| Scan the full dependency tree, direct and indirect, against a known-vulnerability database and confirm no dependency carries a publicly known critical or high-severity security hole. List what is found. | A known hole in a package you depend on is a hole in your app, already published, with attackers already aware of it. These are the cheapest breaches in the world because the work is done for the attacker; the fix is usually a version bump, but only if you know the hole is there. | A dependency-vulnerability result: the scan output listing every dependency with a known critical or high-severity vulnerability, each with the package, the affected version, the issue in plain terms, and the fixed version to move to, or an explicit confirmation that none were found. | OWASP Top 10:2025 A03 Software Supply Chain Failures |
| Confirm a record exists of how the app's deliverable was built: which build process produced it and from what inputs (even a basic, automatically-generated record counts). This is the first rung of build provenance. | If you cannot say how your shipped app was assembled, you cannot tell a clean build from a tampered one, and a swapped-in malicious build looks identical to a real one. A build record, even an unsigned one, is the start of being able to prove what you shipped is what you meant to ship. | A build-provenance artifact: confirmation that a record of the build process and its inputs exists for the deliverable, with a flag if no provenance is produced at all. | SLSA v1.2 Build L1 |

## Standard checks

A competent team does these. Run them on this domain's surface when S5 (blast radius) is present, per the stakes signals above.

| Check | Why it matters to your business | Evidence the agent must produce | Citation |
|---|---|---|---|
| Produce an inventory of every component the app ships with: an itemized list of all dependencies, direct and indirect, with their names and exact versions. This list is often called an SBOM (Software Bill of Materials), the ingredient label for your software. | You cannot protect, patch, or even reason about code you have never listed. When a serious hole is announced in some widely-used package next month, the only way to answer "are we affected?" in minutes instead of days is to already hold the list of what you ship and check it. Across many users, that speed is the difference between a quiet patch and a public incident. | A component inventory (SBOM): the full itemized list of shipped dependencies with names and exact versions, direct and indirect, generated from the locked build, with a flag if the list cannot be produced completely. | NIST SSDF SP 800-218 v1.1 PS.3 (archive and protect each release); OWASP Top 10:2025 A03 Software Supply Chain Failures |
| Vet each third-party dependency the app relies on for whether it is reasonable to trust: is it actively maintained, widely used, free of a recent ownership or maintainer change that came with suspicious code, and is it actually needed. Flag dependencies that are abandoned, obscure for what they do, or pulled in but unused. | Every package you depend on is a team of strangers you have decided to trust with code that runs inside your app. An abandoned package stops getting security fixes; an obscure one nobody audits is where malicious code hides; an unused one is pure risk with zero benefit. Choosing what to trust, instead of importing on reflex, is the work an AI tool skips. | A dependency-vetting result: per third-party dependency, its maintenance status (actively maintained or stale), a rough trust signal (widely used or obscure), whether it is actually used in the code, and a flag on any that are abandoned, suspiciously obscure, or unused and removable. | NIST SSDF SP 800-218 v1.1 PW.4 (acquire and reuse well-secured third-party software); OWASP Top 10:2025 A03 Software Supply Chain Failures |
| Confirm the app's deliverable is built by a hosted build service that generates and signs a provenance record, rather than assembled by hand or on a developer's own machine. The signature is what lets someone verify the record was not forged. | A build that runs on a known, hosted service and signs its output gives you a provenance record an attacker cannot quietly fake, so a tampered or substituted build becomes detectable instead of invisible. For an app many people depend on, "we can prove this build is genuine" is a real defense against someone slipping altered code into the supply chain. | A signed-provenance artifact: confirmation that the build runs on a hosted build platform that produces and signs provenance for the deliverable, the signature is verifiable, and a flag if the build is unsigned or runs only on a local machine. | SLSA v1.2 Build L2 |
| For any AI model, AI service, or AI dataset the app pulls in as a dependency, confirm it comes from a known, trusted source and has not been swapped for a tampered version, and that the app does not load an AI component from an unverified place. | A model file or AI service is borrowed code in another shape, and a poisoned or substituted one can behave normally until the moment it does not. Treating your AI dependencies with the same care as your software dependencies closes a gap that the AI-specific guidance calls out directly and that ordinary dependency scanners do not cover. | An AI-component provenance result: each AI model, service, or dataset the app depends on, its source, confirmation that the source is trusted and the component is the intended one, and a flag on any AI dependency loaded from an unverified or unexpected origin. | OWASP Top 10 for LLM Apps 2025 LLM03 Supply Chain; OWASP Top 10:2025 A08 Software or Data Integrity Failures |

## Extra-mile checks

Frontier rigor. Even strong engineering teams treat these as extra, extended effort. Run them on this domain's surface only when the stakes gate forces it, as annotated.

| Check | Why it matters to your business | Evidence the agent must produce | Citation | Stakes gate + frontier pattern |
|---|---|---|---|---|
| Harden the build to the top rung: run it on an isolated, locked-down build platform whose provenance an attacker cannot tamper with even by compromising the build itself, and extend the same rigor to the source so the history of the code is itself verifiable. | When a compromised dependency could reach money or an irreversible action across many users, a build an attacker can subvert is an unacceptable single point of failure. A hardened, isolated build with verifiable source history is what closes the path where someone tampers with the assembly line rather than the parts, the most expensive class of supply-chain attack to clean up after. | A hardened-build artifact: evidence the build runs on a hardened, isolated platform with tamper-resistant provenance, plus source-history verification, and a flag on any gap between the current build setup and that bar. | SLSA v1.2 Build L3 and Source Track | Forced by S5 Blast radius combined with S1 money or S6 irreversibility. Frontier pattern: hardened isolated build (SLSA Build L3) plus Source Track. |
| Pin every dependency not just to a version but to a verified exact copy (a content hash), so the build refuses any package whose contents do not match what you approved, and stand up continuous monitoring that re-checks the whole component list against new vulnerability disclosures and alerts when a new hole lands in something you ship. | A version number can be re-pointed at different contents; a content hash cannot be faked, so hash-pinning means a swapped package is rejected at build time rather than silently accepted. Continuous monitoring turns "we find out we are vulnerable when we get breached" into "we get alerted the morning a new hole is published in a package we use," which across a large user base is the difference between a patch and a headline. | A pinning-and-monitoring artifact: confirmation that dependencies are pinned to verified content hashes (a swapped copy is rejected), plus the monitoring setup that re-scans the component inventory against new disclosures, with a sample alert and any unpinned or unmonitored dependency flagged. | OWASP Top 10:2025 A08 Software or Data Integrity Failures; OWASP Top 10:2025 A03 Software Supply Chain Failures | Forced by S5 Blast radius combined with S1 money or S6 irreversibility. Frontier pattern: hash-pinned dependencies plus continuous component monitoring. |
| Treat every AI plug-in, agent skill, and tool description the app or its agent loads as untrusted third-party code until reviewed: inventory each one, read what it actually does and what reach it has (files, environment variables, network, the ability to act), pin it to a reviewed version, and refuse to load any that is unreviewed, unpinned, or fetched live from an open marketplace. | For an autonomous agent, a loaded skill is not passive code, it is instructions the agent will act on, with the agent's full reach. A study of nearly four thousand published skills found a third carried a way to hijack them, so loading one unreviewed hands a stranger a hand on the controls of an agent that can already send, spend, or delete. Pinning and reviewing them is the only thing standing between "we use a helpful skill" and "an attacker's skill is driving our agent." | An AI-component vetting artifact: every plug-in, skill, and tool definition the agent loads, what each one does and the reach it has, its pinned reviewed version, and a flag on any loaded unreviewed, unpinned, or pulled live from an untrusted source. | OWASP Top 10 for LLM Apps 2025 LLM03 Supply Chain; NIST SSDF generative-AI profile SP 800-218A (provenance and review of AI components) | Forced by S4 Autonomy (an agent that loads and acts on third-party skills or tools). Frontier pattern: pinned, reviewed, least-reach AI components. |

## When to stop and hire a human

Bring in an independent human reviewer for this domain when any of these are true:

- Your package-existence check flagged a dependency you cannot confirm is the genuine package, or you found a name your AI tool produced that you cannot trace to a real, trusted source, and the app is already shipped or handles money or personal data. A possibly-hostile package already running in a real app is not a place to guess; treat it as a live compromise until a professional says otherwise.
- The app serves many users or moves money (S5 with S1 or S6) and you cannot produce a complete component inventory or cannot confirm the build is genuine, meaning you cannot answer "what exactly do we ship and was it tampered with." An unauditable supply chain under real stakes is the kind of gap a professional review exists for.
- An autonomous agent (S4) loads plug-ins, skills, or tools and you cannot establish what each one does and what reach it has, or you found one with a way to be hijacked that you cannot fully contain. An agent that can act, running code you cannot vouch for, is past the point where an AI self-check is enough.

This protocol catches a meaningful slice of supply-chain risk cheaply: the invented package, the missing lockfile, the dependency with a known hole, the unreviewed skill. It is not a guarantee, and an AI checking the borrowed code another AI pulled in is weaker than an independent human review on the cases that matter most, especially a quiet, well-disguised poisoned package. Domain K covers what a professional review and a real penetration test add, and where their honest ceiling sits. For a high-stakes supply chain, route there. (When the Indonesian layer of this protocol lands, it adds the local obligations that apply to the components and data an app ships with; the checks above are the general, cross-border baseline.)

## Agent instructions

```
DOMAIN G: DEPENDENCIES AND SUPPLY CHAIN

Scope by stakes:
  Always run FLOOR. The slopsquatting risk hits every AI-built app regardless of stakes;
  the floor runs even at zero stakes.
  If S5 (blast radius: many users, multi-tenant, public API, shared infra) is present, add STANDARD.
  If S5 combines with S1 (money) or S6 (irreversibility), add EXTRA-MILE on the build-integrity checks.
  If S4 (an autonomous agent loads and acts on plug-ins, skills, or tools), add EXTRA-MILE on the
  AI-component checks. This is the protocol-wide S4 override applied to the agent's own supply chain.
  If the app is small, single-user, and handles no money, no personal data, and no autonomous agent,
  run FLOOR only. Do NOT build signed-provenance pipelines, hash-pinning, or continuous component
  monitoring for a low-stakes app.

Circularity note (see the circularity-guard protocol):
  The agent that wrote the code "knows" which packages it imported and assumes they are real and
  intended; that assumption is exactly the blind spot a hallucinated or impostor package hides in.
  Run this domain in a CLEAN, fresh context with no access to the build rationale. Prefer a different
  model from the one that wrote the code. Verify every package against the real registry as written,
  not against what the author meant to install.

Produce these artifacts (not verdicts):
  FLOOR:
    1. Package-existence result: every imported/declared package marked "genuine on official registry"
       or "not found / suspected impostor", suspicious ones flagged by name and location (slopsquatting check).
    2. Lockfile artifact: lockfile exists, is committed, covers the full tree, and the build uses it;
       missing/stale/unused flagged.
    3. Dependency-vulnerability result: full tree scanned, every dep with a known critical/high hole listed
       with affected version, plain-terms issue, and fixed version; or an explicit "none found".
    4. Build-provenance artifact: a record of how the deliverable was built and from what inputs exists;
       flag if no provenance is produced.
  STANDARD (S5 blast radius present):
    5. Component inventory (SBOM): full itemized list of shipped deps with exact versions, from the locked build;
       flag if it cannot be produced completely.
    6. Dependency-vetting result: per third-party dep, maintenance status, trust signal, actually-used, with
       abandoned/obscure/unused ones flagged.
    7. Signed-provenance artifact: build runs on a hosted platform that signs provenance, signature verifiable;
       unsigned or local-only build flagged.
    8. AI-component provenance result: each AI model/service/dataset dependency, its source, confirmation it is
       trusted and intended; unverified-origin AI dependency flagged.
  EXTRA-MILE (S5 with money or irreversibility; or S4 autonomy for the AI-component check):
    9. Hardened-build artifact: build on a hardened, isolated platform with tamper-resistant provenance plus
       source-history verification; gaps to that bar flagged.
    10. Pinning-and-monitoring artifact: deps pinned to verified content hashes (swapped copy rejected) plus
        continuous re-scan of the inventory against new disclosures, with a sample alert; unpinned/unmonitored flagged.
    11. AI-component vetting artifact: every plug-in/skill/tool the agent loads, what it does and its reach,
        its pinned reviewed version; unreviewed/unpinned/live-from-untrusted-source flagged.

Output a findings table with these columns and nothing weaker than evidence:
  | Severity | Business risk in plain words | Evidence artifact | Citation | Suggested fix |

Rules:
  - Translate every finding into a concrete business consequence a non-coder understands
    (not "package not found in registry" but "your app installs a stranger's code under a name your
    AI tool made up, and an attacker can register that name and own your app").
  - Cite only the controls named in this domain (A03, A08, SLSA Build L1/L2/L3 + Source Track,
    SSDF PS.3, SSDF PW.4, LLM03, SP 800-218A). Do not invent IDs.
  - No bare verdicts. "Dependencies look fine" is not a finding. Attach the artifact that proves it:
    the actual package-existence result, the actual scan output, the actual component list.
  - Verify package existence against the real registry, not against the agent's own memory of what
    it imported. A name the agent is confident about can still be one it invented.
  - If you cannot produce an artifact a check demands, say so and mark that check INCOMPLETE.
```
