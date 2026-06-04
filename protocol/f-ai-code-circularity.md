# Domain F: AI-Generated-Code Patterns and Circularity

## What this is

Your app was written by an AI agent, and almost certainly the audit will be run by an AI agent too. This domain is about the problem that creates. When the same kind of mind builds the code and checks the code, the check is weaker than it looks, because the checker tends to be blind to the same things the builder was blind to. This is not a knock on any one tool. It is a structural fact about asking an author to grade its own work.

This domain does two jobs. It encodes the safeguard that makes an AI audit worth trusting at all (run it as a stranger, in a clean context, ideally on a different model, and demand proof instead of a thumbs-up). And it tells you plainly where that safeguard runs out, so you know when a cheap AI pass is enough and when you have to pay a human. The full method lives in the circularity-guard protocol (`protocol/02-circularity-guard.md`); this file is the domain audit that applies it and tracks the AI-built patterns most likely to bite.

## What you can't see here

You watched the feature work. You did not watch how it was made, and you have no way to judge whether the way it was made is sound, because reading the code is the one skill the situation assumes you do not have. So you are trusting two layers you cannot inspect: the AI that wrote the code, and (if you run a self-check) the AI that says the code is fine. Both layers can be confidently wrong in the same direction at the same time, and from your seat the two errors cancel into a clean-looking report.

The circularity problem was named at the institutional level. A research note from Stanford's CodeX program (February 2026) put it cleanly: human review works because the reviewer brings different assumptions and different mistakes than the author, and that mismatch is what makes the review catch things. When one AI both writes and tests, the mismatch evaporates, because "the testing agents inherit the same weaknesses as the coding agents." The note named the gap and offered no fix, only a warning that the window to address it is closing.

There is a measured reason a plain self-check does not rescue you. On a benchmark of 200 real repository tasks, an AI agent produced code that was 61 percent functionally correct and only 10.5 percent secure, and adding "be secure" hints to the request did not move the security number (SUSVIBES, Zhao et al., arXiv:2512.03262). Telling the agent to try harder is not a control. There is also a reason the next, smarter model will not save you: across more than 100 models on 80-plus tasks, security performance was flat regardless of model size or sophistication, with roughly 45 percent of generated code failing security tests (Veracode 2025 GenAI Code Security Report, 30 July 2025; this is a security-vendor study, and the figure is on security-relevant tasks). The insecurity is built into how these models work right now, not a bug the next release quietly patches. So "I will just use the best model" is not a plan, and "the model checked its own work" is not evidence.

## When this matters (stakes signals)

This domain runs on every AI-built app, because the circularity problem is present the moment an AI wrote the code, which for the reader of this protocol is always. The floor here is therefore universal. The stakes signals decide how strict the separation has to be and how much frontier machinery you add on top.

- **S4 Autonomy** (an AI agent in your app can take actions without a human approving each one) is the hard override for this domain. If your app has an autonomous agent, this domain is forced to EXTRA-MILE regardless of anything else. An agent that acts on its own is the case where a self-trusting AI loop does real damage before a human can intervene, so the different-model review, the provenance record, and the output-verification harness become mandatory, not optional. This override fires together with the same S4 override on Domain B (security) and Domain K (pen-test).
- **S1 Money** (payments, billing, payouts, credits with cash value) on this app: escalate to at least STANDARD. AI-written money logic that no independent mind checked is the place where a circular self-audit is most expensive to get wrong.
- **S3 Personal data** (the app stores PII) on this app: escalate to at least STANDARD. The same circular-review weakness over code that touches real people's data is the difference between a quiet bug and a breach notification.
- **S6 Irreversibility** (an action cannot be undone: delete, transfer, publish, send) on this app: escalate to at least STANDARD, and toward EXTRA-MILE when it combines with the signals above. A self-approved mistake that cannot be taken back gives you no second look.

If your app is a genuinely low-stakes, AI-built tool with no money, no auth, no personal data, no autonomous agent, and nothing irreversible, the floor still applies: run the audit in a clean context, prefer a different model, and demand artifacts. Do not bolt evals, provenance pipelines, and verification harnesses onto a weekend app. Over-applying frontier rigor to a low-stakes tool is a failure of judgment, not extra diligence.

## Floor checks

Never skip these. They apply to every AI-built app, at any stakes level, because they are what make any AI audit (including this one) structurally honest rather than a circle.

| Check | Why it matters to your business | Evidence the agent must produce | Citation |
|---|---|---|---|
| Run this entire audit in a clean, fresh session that has no memory of why the code was written, no build chat history, and no design rationale attached. Confirm the review is not a continuation of the build conversation. | If the same chat that just declared your feature done is the one grading it, it grades to what it believes it built, not to what is actually there. Starting fresh is the cheapest thing that measurably catches more critical bugs, and skipping it is how a clean-looking report hides the same hole the builder left. | A context-separation statement: confirmation the audit ran in a fresh session with no build history, and a note of any build-rationale the reviewer was exposed to (which would weaken the result). | NIST SSDF SP 800-218A (review of AI-produced code, cited at document level as voluntary technical guidance) |
| State which model wrote the app and which model is running this audit. If they are the same model family, flag it as a weaker review and recommend re-running the high-stakes domains on a different model lineage. | Models from the same family share training, so they share blind spots, the way two people taught at the same shop make the same mistakes. A different reviewer is more likely to catch what the author missed. Naming the lineage is how you know whether your audit had that advantage or graded itself. | A model-provenance line: the model/provider that generated the code (best known) and the model/provider running the audit, with a same-lineage warning if they match. | NIST SSDF SP 800-218A (provenance of generated artifacts, cited at document level) |
| Produce findings as artifacts with evidence, never as bare verdicts. Every claim of "checked" must carry the actual thing inspected (the file and line, the query, the route, the package name), the plain-language business risk, and a citation. Reject "looks fine" anywhere it appears. | A verdict can be asserted without doing the work; an artifact cannot. Demanding the evidence is the mechanism that forces the agent to actually run the check instead of claiming it did, and it is what lets a human you hire later point at the proof and verify it rather than trust a number. | A findings set where each row attaches its evidence artifact; any row reading only "passed," "looks secure," or "no issues" with no inspected artifact behind it is itself flagged as an incomplete check. | OWASP Top 10 for LLM Apps 2025 LLM05 Improper Output Handling; OWASP Top 10:2025 A08 Software or Data Integrity Failures |
| Write down the residual risk in plain words at the end: what was checked, what could not be checked this way, and what remains uncertain. Treat the agent finding nothing as "nothing was found," never as "this is safe." | An audit that quietly converts silence into a safety guarantee hands you the exact false comfort this whole protocol exists to fight. Saying out loud where the method's floor sits keeps you looking instead of trusting a stamp, and it tells you honestly whether you have crossed into territory that needs a human. | A residual-risk statement: a short list of what was verified, what this AI method cannot verify, and an explicit "not a safety guarantee" line, with high-stakes domains routed to Domain K and Domain L. | OWASP Top 10 for LLM Apps 2025 LLM09 Misinformation (AI output, including this audit, can be wrong and must not be over-trusted) |

## Standard checks

A competent team does these. Run them when S1 (money), S3 (personal data), or S6 (irreversibility) touches the app, per the stakes signals above. They harden the AI-built code itself against the patterns AI tools most reliably get wrong.

| Check | Why it matters to your business | Evidence the agent must produce | Citation |
|---|---|---|---|
| Inventory the AI-generated code that reaches production and confirm a separate review actually looked at each meaningful block, rather than assuming the build was self-correct. List which parts were AI-written, and for each high-stakes part, what independent check covered it. | "An AI wrote it and it ran" is the entire basis of trust in most AI-built apps, and it is the thinnest possible basis. Knowing which code was generated and whether anything other than the generator ever scrutinized it is the difference between a reviewed system and an unreviewed one wearing a green checkmark. | An AI-code review map: the meaningful AI-generated blocks that ship, and per high-stakes block, the independent review that covered it (different-context pass, different-model pass, or human), with un-reviewed high-stakes blocks flagged. | NIST SSDF SP 800-218A (review AI-produced code, cited at document level); OWASP Top 10:2025 A08 Software or Data Integrity Failures |
| Look for the specific failure class AI tools leave behind: business-logic and authorization mistakes that need an understanding of your app's own rules, which a general model cannot copy from training. Read the money, permission, and workflow logic for "does this match how my app is supposed to work," not just "does this run." | Tested on realistic tasks, AI tools had mostly learned to avoid the textbook bugs and kept failing at authorization and business-logic flaws, the class that depends on your specific app's idea of who may do what. These are invisible from the happy path and are exactly what a self-audit in the build context waves through, because the builder already assumed its own logic was right. | A business-logic review: the app's money, permission, and workflow rules as the builder intended them, checked against what the code actually enforces, with each mismatch (a step that can be skipped, an amount that can go negative, an action a wrong role can reach) flagged with its location. | OWASP Top 10:2025 A06 Insecure Design; OWASP Top 10 for LLM Apps 2025 LLM05 Improper Output Handling |
| Where the app's own AI feature produces output that is then used (shown to users, stored, or acted on), confirm that output is validated before it hits anything that matters, instead of being trusted because the model produced it. | An AI feature's output is untrusted input the moment it leaves the model, and treating a generated answer, snippet, or command as automatically safe is how a wrong or hostile output flows straight into your data or your users. For a non-coder this is invisible, because on screen the output simply "looked like an answer." | An output-handling review: each place the app's AI output is used, the validation applied before use (format checks, grounding against real data, escaping before display or storage), and any path where raw model output reaches a sink unchecked, flagged. | OWASP Top 10 for LLM Apps 2025 LLM05 Improper Output Handling; OWASP Top 10 for LLM Apps 2025 LLM09 Misinformation |
| Confirm a minimum provenance record exists for the AI-generated code that ships: for each meaningful generated block, what produced it, roughly what it was asked to do, who accepted it, and what tests passed. The light version is a commit-message convention, not a heavy system. | When no record says what produced a piece of code or whether a human ever signed off, you cannot answer the questions that arrive with a security incident, a customer dispute, or a legal request: where did this come from, did anyone check it, what does it depend on. A cheap receipt now is the difference between a traceable system and a black box you have to defend blind. | A provenance record (or a flag that none exists): per meaningful generated block, the model/provider, the task it implemented, the human who accepted it, and the tests it passed. | NIST SSDF SP 800-218A (provenance of generated artifacts, cited at document level); OWASP Top 10:2025 A08 Software or Data Integrity Failures |

## Extra-mile checks

Frontier rigor. Even strong engineering teams treat these as extra, extended effort. Run them on this domain only when the stakes gate forces it, as annotated.

| Check | Why it matters to your business | Evidence the agent must produce | Citation | Stakes gate + frontier pattern |
|---|---|---|---|---|
| Make different-model review a standing policy, not a one-off: for the high-stakes code in this app, have a model from a different family review what the building model produced, and record the second model's findings separately so its distinct blind spots show up against the first model's. | A second model from the same family rubber-stamps the same mistakes. A genuinely different reviewer is the closest cheap stand-in for the mismatch that makes human review work, and on the code that runs your app on its own, that mismatch is what stands between a self-approved bug and a caught one. The direction is supported by theory; no specific catch rate is promised, and you should distrust anyone who promises one. | A different-model review record: the building model and the reviewing model (different families), the high-stakes blocks covered, the second model's findings listed separately, and any block where only the original model ever reviewed, flagged. | NIST SSDF SP 800-218A (cited at document level); OWASP Top 10:2025 A08 Software or Data Integrity Failures | Forced by S4 Autonomy (mandatory), escalated by S1/S3/S6. Frontier pattern: different-model review as policy. |
| Build an evals-and-golden-suite around the AI-built behavior: a fixed set of inputs (including hostile ones) paired with the outputs and behaviors that are acceptable, run on every change so a regression or an intent drift is caught automatically rather than by hand. | When an agent can act on its own, you cannot watch every action, and "it still works" is no longer something you can confirm by clicking around. A golden suite turns "the code still does what I meant" into something a machine re-checks for you on every change, which is the only scalable defense against an AI-built system silently drifting under you. | A golden-suite artifact: the input cases, the asserted acceptable output/behavior for each, and a pass/fail run of the current code against every case, with failures flagged. | OWASP Top 10 for LLM Apps 2025 LLM09 Misinformation; NIST SSDF SP 800-218A (cited at document level) | Forced by S4 Autonomy; escalated by S1 or S6. Frontier pattern: evals and golden suites. |
| Add an output-verification harness around any AI output that drives an automated action or an irreversible step: validate format, check the output is grounded in real data, and use self-consistency (generate more than once and compare; disagreement triggers a retry or a human) before the result is committed. | If the action cannot be undone, catching a hallucinated or off-intent output afterward is worthless. A harness that runs before the action commits is the line between "we caught it" and "it is gone," and self-consistency is a cheap way to make the model's own uncertainty visible instead of acting on a confident guess. | An output-verification artifact: the checks run on the AI output before use (schema/format, grounding, multi-generation comparison), what each compares against, and what happens on a mismatch (block, hold for human, roll back), with evidence the harness fires before the irreversible step. | OWASP Top 10 for LLM Apps 2025 LLM05 Improper Output Handling; OWASP Top 10:2025 A08 Software or Data Integrity Failures | Forced by S4 Autonomy or S6 Irreversibility. Frontier pattern: output-verification harness (self-consistency). |
| Keep full provenance and accountability logs for AI-generated code as an ongoing record, not a one-time note: model and version, the prompt or task, the human approver, the tests passed, and a link from each shipped block back to its record, retained because this is becoming a regulatory expectation as well as good practice. | On an app carrying real stakes, "where did this code come from and who checked it" is a question that arrives with every incident, audit, and dispute, and a black box is indefensible. A maintained log is also moving from nice-to-have toward an expectation under emerging AI regulation, so the cheap habit now is insurance against a costly reconstruction later. | A provenance-log artifact: the per-block records (model/version, task, approver, tests passed), the link from shipped code back to each record, and a flag for any high-stakes block with no record. | NIST SSDF SP 800-218A (provenance of generated artifacts, cited at document level); OWASP Top 10:2025 A08 Software or Data Integrity Failures | Forced by S1, S3, or S6 at scale; mandatory under S4. Frontier pattern: provenance and accountability logs for AI-generated code. |

## When to stop and hire a human

Bring in an independent human reviewer for this domain when any of these are true:

- An AI agent in your app can take actions on its own (S4) and you cannot show that a different-model review, the output-verification harness, and the provenance record are all in place and clean. A self-trusting autonomous loop with no independent mind in it is the single case this domain treats as unsafe to run unreviewed.
- The business-logic review found a money, permission, or workflow mismatch you cannot fully explain or confirm is fixed. The authorization and business-logic class is exactly where an AI checking AI is weakest, because the rule is specific to your app and has no general answer the model could copy, so a confirmed mismatch here is not a place to guess.
- Your app handles money or personal data, or performs irreversible actions, and the only review the high-stakes code ever received was the building model checking its own work. Same-mind review over high-stakes AI-written code is the thinnest basis for trust, and crossing that line is what Domain K and Domain L exist to catch.

This is the honest core of the whole protocol, so it carries the honesty clause directly. An AI auditing AI catches a meaningful slice of serious bugs cheaply, and it misses most of them when working alone. In the cleanest measurement available, even the best condition, a fresh separated context, caught only about 28.6 percent of injected errors by a combined found-versus-false-alarm score; roughly seven in ten injected bugs survived the best AI review (Cross-Context Review, arXiv:2603.12123). That is a useful filter, not a safety guarantee, and it does not become a professional penetration test by adding a second model. Domain K covers what a human review adds and where its honest ceiling sits; Domain L is the explicit when-to-hire decision. For an app carrying real stakes on this domain, route there, and do not let a clean AI report talk you out of it.

## Agent instructions

```
DOMAIN F: AI-GENERATED-CODE PATTERNS AND CIRCULARITY

Scope by stakes (this domain runs on every AI-built app; the floor is universal):
  Always run FLOOR. The circularity problem is present the moment an AI wrote the code.
  If S1 (money), S3 (personal data), or S6 (irreversibility) touches the app, add STANDARD.
  HARD OVERRIDE: if an AI agent can act on its own (S4), run EXTRA-MILE here regardless of
  the signal count, and the different-model review, the output-verification harness, and the
  provenance log are MANDATORY, not optional. This fires together with the S4 override on
  Domain B and Domain K.
  If the app is genuinely low-stakes (no money, no auth, no personal data, no autonomous
  agent, nothing irreversible), run FLOOR only. Do NOT add evals, provenance pipelines, or
  verification harnesses to a weekend app.

Circularity note (this domain IS the circularity guard; see protocol/02-circularity-guard.md):
  Run this audit in a CLEAN, fresh context with no access to the build rationale, and PREFER a
  DIFFERENT model lineage from the one that wrote the code. Do not reconstruct the author's
  reasoning; meet the code as a stranger would. A same-session or same-family review is weaker
  and must be flagged as such. The four-part guard (clean context, different model, artifacts
  not verdicts, residual risk stated) is the baseline for the entire protocol, not just this file.

Produce these artifacts (not verdicts):
  FLOOR:
    1. Context-separation statement: confirmation the audit ran in a fresh session with no build
       history; note any build-rationale the reviewer saw (which weakens the result).
    2. Model-provenance line: the model/provider that generated the code and the one running the
       audit; same-lineage warning if they match.
    3. Evidence-not-verdict findings: every "checked" carries the inspected artifact (file/line,
       query, route, package); any bare "looks fine" flagged as an incomplete check.
    4. Residual-risk statement: what was verified, what this method cannot verify, an explicit
       "not a safety guarantee" line, high-stakes domains routed to Domain K and Domain L.
  STANDARD (money / personal data / irreversibility):
    5. AI-code review map: the meaningful AI-generated blocks that ship; per high-stakes block,
       the independent review that covered it; un-reviewed high-stakes blocks flagged.
    6. Business-logic review: intended money/permission/workflow rules vs what the code enforces;
       each mismatch flagged with location (this is the dominant AI failure class).
    7. Output-handling review: each place the app's own AI output is used, the validation before
       use, any path where raw model output reaches a sink unchecked, flagged.
    8. Provenance record: per meaningful generated block, model/provider, task, human approver,
       tests passed; or a flag that no record exists.
  EXTRA-MILE (autonomous agent, or high-stakes at scale):
    9. Different-model review record: building model vs reviewing model (different families),
       high-stakes blocks covered, the second model's findings listed separately, single-model
       blocks flagged.
    10. Golden suite: input cases (including hostile) + asserted acceptable behavior + current
        pass/fail run.
    11. Output-verification artifact: pre-commit checks on AI output (format, grounding,
        multi-generation self-consistency), what each compares, action on mismatch; evidence it
        fires before any irreversible step.
    12. Provenance log: maintained per-block records (model/version, task, approver, tests),
        the link from shipped code back to each record, high-stakes blocks with no record flagged.

Output a findings table with these columns and nothing weaker than evidence:
  | Severity | Business risk in plain words | Evidence artifact | Citation | Suggested fix |

Rules:
  - Translate every finding into a concrete business consequence a non-coder understands.
  - Cite only the controls named in this domain (A06, A08, LLM05, LLM09, and SP 800-218A at the
    document level as voluntary technical guidance). Do not invent IDs.
  - No bare verdicts. "Looks fine" is not a finding. Attach the artifact that proves the claim.
  - Honesty clause is mandatory: do NOT claim this AI audit equals a professional pen-test. Even
    the best cross-context AI review caught only about 28.6% of injected errors; most survive.
    State the residual risk and route high-stakes apps to Domain K and Domain L.
  - If you cannot produce an artifact a check demands, say so and mark that check INCOMPLETE.
```
