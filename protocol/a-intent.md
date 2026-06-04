# Domain A: Intent Verification

## What this is

Intent verification asks one question that sounds obvious and almost never gets answered: does this code do only what you asked, and does it do it safely? An AI tool can hand you a feature that runs, looks right, and passes its own tests, while quietly doing extra things you never requested or doing the requested thing in an unsafe way. "It works" is a statement about whether the screen does what you expected. "It is safe" is a statement about what else the code can do when someone pushes on it. They are not the same claim, and the gap between them is wide.

This is the universal floor of the whole audit. Every other domain in this protocol assumes you have first confirmed the code matches your actual intent. If you skip this, you are auditing the security of a feature you have not yet confirmed is the feature you wanted.

## What you can't see here

You described a feature in plain words. The agent turned it into code. You read the result on the screen, it behaved, and you shipped. The thing you cannot see is the distance between the sentence you typed and the code that shipped. That distance is where the danger lives, and it is invisible to a non-coder by definition: you judged the output by watching it work, and watching it work tells you nothing about what it does in the cases you did not click through.

There is hard evidence for exactly this gap. In a 2025 academic benchmark of an AI coding agent on 200 real-world feature requests (SUSVIBES, Zhao et al., arXiv:2512.03262), the code was 61% functionally correct and only 10.5% secure. Read that again: most of the time it did the job, and almost none of the time it did the job safely. Functional correctness and security were nearly unrelated. The same study found that adding "be secure" hints to the request did not close the gap, so the fix is not a better prompt. It is a structured check, after the fact, by something that did not write the code.

There is a second, human reason the gap is invisible. A peer-reviewed Stanford study (Perry et al., ACM CCS 2023, arXiv:2211.03622) found that people building with an AI assistant wrote less secure code while believing it was more secure than people without one. The assistance raised confidence and lowered safety at the same time. So the builder's own sense of "this looks fine" is not just unreliable here, it bends in the wrong direction precisely when an AI is involved. Your confidence is not evidence. The artifacts this domain forces the agent to produce are the evidence.

## When this matters (stakes signals)

Intent verification is the one domain that runs at FLOOR even when nothing is at stake. A weekend to-do app with no login, no money, and no real user data still earns the floor checks below, because "does this do only what I asked" is never optional. There is no such thing as a feature too small to do something you did not intend.

The stakes signals decide how DEEP the intent check goes on this domain's surface, not whether it runs:

- S1 Money (payments, billing, payouts, credits with cash value) on this feature: escalate to STANDARD. Confirm the feature does not also move, grant, or expose money in a path you never described.
- S2 Identity/Auth (login, sessions, password reset, roles) on this feature: escalate to STANDARD. Confirm the feature does not also change who someone is or what they are allowed to do.
- S4 Autonomy (an AI agent in your app can take actions without a human approving each one): escalate to EXTRA-MILE. An autonomous action that drifts from intent executes itself, with no human moment to catch it.
- S6 Irreversibility (an action cannot be undone: delete, transfer, publish, send): escalate to EXTRA-MILE. If the unintended behavior is permanent, you do not get a second look.

If none of S1 through S6 touch this feature, run FLOOR only. Do not gold-plate a low-stakes feature with frontier checks; that is a failure of judgment, not extra diligence.

## Floor checks

Never skip these, on any app, at any stakes level.

| Check | Why it matters to your business | Evidence the agent must produce | Citation |
|---|---|---|---|
| Write down, in one or two plain sentences per feature, what the builder actually asked this code to do. Then list, from reading the code, what it actually does. Put the two lists side by side. | If you never wrote down what you wanted, you cannot tell whether you got it. The side-by-side is the only way to see a feature that does more than you asked. | An "intent vs behavior" table: left column the builder's stated intent per feature, right column the observed behavior from the code, with any row where they differ flagged. | A06 Insecure Design; NIST SSDF PW.1 |
| List every action this code can take beyond the one feature described: every other table it writes to, every other endpoint it calls, every email/message/file it sends, every record it deletes. | A login form that also writes to the billing table, or a "save draft" that also publishes, is the classic AI over-reach. You asked for one thing; the code does three. The two you did not ask for are where customers get hurt. | A "side-effects list": every write, call, send, or delete the feature performs, each marked as "expected" (matches intent) or "unexpected" (flag for review). | A06 Insecure Design |
| Confirm the feature was tested for what should NOT happen, not only for what should. List the cases the code handles when given bad, empty, or hostile input instead of the happy path. | Passing tests prove the feature works when used correctly. They say nothing about what happens when someone uses it wrong on purpose. The cases nobody tested are the cases an attacker will find first. | A short list of the "unhappy path" cases the code actually handles (empty input, wrong type, missing permission, oversized input) and the cases it does not, so the gaps are visible. | A06 Insecure Design; NIST SSDF PW.1 |
| State plainly what "correct and safe" means for each feature before judging the code against it, so success is measured against a written standard rather than a gut feeling. | If the standard for "done" is only "it looked right when I tried it," you are trusting the same gut feeling that the Stanford evidence shows points the wrong way when AI is involved. A written standard is something the agent can check against; a vibe is not. | A one-paragraph "definition of correct and safe" per feature, written before the code is judged, that the intent vs behavior table is then checked against. | NIST SSDF PW.1 |

## Standard checks

A competent team does these. Run them on this domain's surface when S1 (money) or S2 (identity/auth) touches the feature, per the stakes signals above.

| Check | Why it matters to your business | Evidence the agent must produce | Citation |
|---|---|---|---|
| For any feature that touches money or identity, trace every code path the input can take from entry to outcome, not just the path you clicked. Confirm each branch still matches intent. | The path you tested is one of several. A "transfer $10" feature that also accepts a negative number and transfers money the other way passed your test and failed everyone else. Branches you never walked are unaudited by definition. | A path trace per money/identity feature: each branch the code can take (each `if`, each error case, each role) listed with its outcome, and any branch whose outcome does not match the stated intent flagged. | OWASP API Security Top 10 2023 (API6 Unrestricted Access to Sensitive Business Flows) |
| Confirm the feature enforces the rule you intended, not merely displays it. A hidden button is not a closed door; check that the server refuses the action, not just that the screen omits the option. | Hiding the "delete other users" button in the interface does not stop someone from calling the underlying action directly. If intent was "only admins can do this," the code, not the screen, has to enforce it. Otherwise the rule is decoration. | For each rule the builder intended ("only the owner can edit," "only paid users can export"), evidence that the server-side code checks it, with the exact location of the check, or a flag that the rule exists only in the interface. | OWASP Top 10:2025 A06 Insecure Design |
| Check that the feature's design includes the safety controls the builder assumed were there, rather than assuming the AI added them because they are "obvious." | Non-coders assume an AI fills in the obvious guards (rate limits, ownership checks, input limits) because a human professional would. The evidence says it often does not, and saying "be secure" does not make it. An assumed-but-absent control is a hole shaped exactly like your expectation. | A "missing-control list": the safety controls a reasonable person would expect this feature to have, each marked present (with location) or absent (flag), measured against the written definition of correct and safe. | NIST SSDF PW.1; OWASP Top 10:2025 A06 Insecure Design |

## Extra-mile checks

Frontier rigor. Even strong engineering teams treat these as extra, extended effort. Run them on this domain's surface only when the stakes gate forces it, as annotated.

| Check | Why it matters to your business | Evidence the agent must produce | Citation | Stakes gate + frontier pattern |
|---|---|---|---|---|
| Build a small evals-and-golden-suite for the feature: a fixed set of inputs (including hostile ones) paired with the exact outputs and behaviors that are acceptable, and run the feature against it on every change so intent drift is caught automatically. | When an AI agent can act on its own, you cannot watch every action by hand. A golden suite is the only thing standing between "the feature still does what I meant" and "the feature changed under me and nobody noticed." It turns intent into something a machine re-checks for you. | A golden-suite artifact: the list of input cases, the asserted acceptable output/behavior for each, and a pass/fail run showing the current code against every case. | NIST SSDF PW.1; OWASP Top 10 for LLM Apps 2025 LLM09 Misinformation | Forced by S4 Autonomy. Frontier pattern: evals + golden suites. |
| Add an output-verification step that independently checks the feature's result against the intended outcome before the result is committed, especially for irreversible actions, so an off-intent result is caught before it takes effect. | If the action cannot be undone (a transfer, a deletion, a public post, a sent message), catching the mistake afterward is worthless. A verification step that runs before the action commits is the difference between "we caught it" and "it is gone." | An output-verification artifact: the independent check the code runs on its own result, what it compares against (the intended outcome), and what it does when they disagree (block, hold for human, roll back), with evidence the check fires before the irreversible step. | OWASP Top 10:2025 A08 Software or Data Integrity Failures; OWASP Top 10 for LLM Apps 2025 LLM05 Improper Output Handling | Forced by S6 Irreversibility (and S4 Autonomy). Frontier pattern: output-verification harness (self-consistency). |
| Subject the feature to a formal, written threat model: walk through how someone would deliberately make it do something other than intended, document each abuse path, and confirm a control blocks each one. | The floor checks ask "what does it do." This asks "what could a determined person make it do." For a feature that runs itself or cannot be undone, the gap between those two questions is where a real attacker operates, and the only way to close it is to think like one on paper first. | A written threat model for the feature: the list of intent-subversion paths an attacker could use, the control that blocks each, and any path with no control flagged as residual risk. | OWASP Top 10:2025 A06 Insecure Design; NIST SSDF PW.1 | Forced by S4 Autonomy or S6 Irreversibility. Frontier pattern: formal threat model. |

## When to stop and hire a human

Bring in an independent human reviewer for this domain when any of these are true:

- The feature touches money or identity AND the intent-vs-behavior table or the path trace shows a difference you do not fully understand. A mismatch you cannot explain on a money or identity path is not a place to guess.
- An AI agent in your app can take actions on its own (S4), and you cannot get a clean, complete side-effects list and golden suite for those actions. Autonomy you cannot fully account for is autonomy you should not run unreviewed.
- The feature performs an irreversible action (S6) and the output-verification step does not reliably fire before the action commits. Permanent actions with no pre-commit check earn a human pass.

This protocol catches a meaningful slice of intent gaps cheaply. It is not a guarantee, and an AI checking AI is weaker than an independent human review on the cases that matter most. Domain K covers what a professional review adds and where its honest ceiling sits. For high-stakes features, route there.

## Agent instructions

```
DOMAIN A: INTENT VERIFICATION

Scope by stakes:
  Always run FLOOR. Intent is the universal floor; it runs even at zero stakes.
  If S1 (money) or S2 (identity/auth) touches a feature, add STANDARD on that feature.
  If S4 (autonomy) or S6 (irreversibility) touches a feature, add EXTRA-MILE on that feature.
  If a feature has zero stakes signals, run FLOOR only. Do NOT add evals, output-verification
  harnesses, or formal threat models to a zero-stakes feature.

Circularity note (see the circularity-guard protocol):
  Intent verification is exactly where same-context self-audit fails: the agent that wrote the
  code "knows what it meant" and grades to that, not to what was actually asked. Run this domain
  in a CLEAN, fresh context with no access to the build rationale. Prefer a different model from
  the one that wrote the code. Read the builder's stated intent and the code as given; do not
  reconstruct the author's reasoning.

Produce these artifacts (not verdicts):
  FLOOR:
    1. Intent-vs-behavior table: per feature, stated intent vs observed behavior, differences flagged.
    2. Side-effects list: every write/call/send/delete the feature performs, each "expected" or "unexpected".
    3. Unhappy-path list: the bad/empty/hostile-input cases the code handles, and the gaps it does not.
    4. Definition of correct-and-safe: one paragraph per feature, written before judging the code.
  STANDARD (money/identity features):
    5. Path trace: every branch the input can take, with outcome, off-intent branches flagged.
    6. Server-enforcement evidence: per intended rule, where the server (not the screen) enforces it, or a flag.
    7. Missing-control list: expected safety controls present (with location) or absent (flagged).
  EXTRA-MILE (autonomy/irreversible features):
    8. Golden suite: input cases + asserted acceptable behavior + current pass/fail run.
    9. Output-verification artifact: the pre-commit check, what it compares, what it does on mismatch.
    10. Threat model: intent-subversion paths, the control blocking each, uncontrolled paths as residual risk.

Output a findings table with these columns and nothing weaker than evidence:
  | Severity | Business risk in plain words | Evidence artifact | Citation | Suggested fix |

Rules:
  - Translate every finding into a concrete business consequence a non-coder understands.
  - Cite only the controls named in this domain (A06, A08, PW.1, API6, LLM05, LLM09). Do not invent IDs.
  - No bare verdicts. "Looks fine" is not a finding. Attach the artifact that proves the claim.
  - If you cannot produce an artifact a check demands, say so and mark that check INCOMPLETE.
```
