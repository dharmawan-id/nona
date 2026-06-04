# Domain J: Architecture Sanity

## What this is

Architecture is the shape of your app: the parts it is made of, how they talk to each other, and where it draws the line between "inside, trusted" and "outside, do not trust." Every app has an architecture even when nobody drew it. An AI tool assembled one for you out of habit and convenience, and it works, which is exactly why nobody stops to ask whether the shape itself is safe.

The earlier domains ask whether each lock is fitted correctly. This one asks a different question: is the building laid out so that a single broken lock stays a single broken lock, instead of opening the whole place. A design can be made entirely of working pieces and still be unsafe because of how the pieces are arranged. The most expensive security problems are not a missing check on one screen. They are a layout that gives one tricked or compromised part the run of everything, with no wall to stop it.

## What you can't see here

You cannot see the shape of your app from inside it. You used it, feature by feature, and each feature did its job. What you never saw is the map: which part trusts which, where data crosses from the public side to the private side, what an autonomous helper is actually allowed to touch, and what happens at the seams when something arrives that the design never planned for. The "it works" signal tells you the pieces function. It says nothing about whether the arrangement contains a failure or spreads it.

There is a specific blindness here that the AI tool shares with you, and it is the one this domain exists to break. An AI builds the way it has seen things built: it reaches for the most direct wiring that makes the feature run. The direct wiring is often the unsafe one. The fast way to let a feature read the database is to hand it the master key. The fast way to let an AI helper get things done is to give it broad permissions. The fast way to connect to another service is to trust whatever that service sends back. Each shortcut works on the happy path and quietly removes a wall you would have wanted. Because the tool optimizes for "make it run," not "make it contained," the missing walls do not show up as errors. They show up later as the reason a small incident became a total one.

This is not a theoretical worry, and it is measurable that the architectural layer is where AI-built systems are getting worse, not better. A security research group tracking flaws traced to AI coding tools reported that, as these tools spread through 2026, architectural design flaws rose by 153 percent and privilege-escalation paths, the routes by which a low-power part of a system reaches high-power abilities it should not have, rose by 322 percent (Cloud Security Alliance research note, 4 April 2026; the group notes its overall total mixes confirmed cases with an estimate, so treat the trend as the firm part and the absolute counts as approximate). The pattern is plain even with that caveat. The mistakes are migrating from the individual line of code, which tools have largely learned to get right, up to the design, which they have not. Design is the part with no general right answer to copy. It depends on what your specific app is allowed to do and to whom, and that is the part the model improvises and the part you were never shown.

## When this matters (stakes signals)

Architecture sanity scales hard with two signals above all: whether something in your app acts on its own, and whether a failure spreads to many people. A small, single-user app with no autonomous parts has almost no architecture to get wrong, and over-drawing one is wasted effort. The moment an AI helper can act, or the moment one failure can reach many accounts, the shape of the system becomes the thing that decides whether a bad day is contained or catastrophic.

- **S4 Autonomy** (an AI agent in your app can take actions, send, spend, run code, change data, without a human approving each one) is the signal that dominates this domain. An autonomous part is a part that acts on its own, so the only thing standing between "it did its job" and "it did real damage" is the wall around it. There is a hard override for this: if your app has an autonomous agent (S4), this domain runs at EXTRA-MILE regardless of anything else, and a real containment design becomes mandatory, not optional. An agent with broad reach and no wall is the single highest-leverage architecture mistake an AI-built app can carry.
- **S5 Blast radius** (many users, multiple separate customers sharing one system, a public API, shared infrastructure) pushes this domain to EXTRA-MILE because the whole point of architecture is to stop one failure from reaching everyone. On a shared system, a layout with no internal walls means a single hole drains every account, not one. The more people sit behind the same shape, the more the shape has to be designed to fail small.
- **S6 Irreversibility** (an action in your app cannot be undone: delete, transfer, publish, send) raises the stakes of every trust boundary, because a design that lets the wrong part trigger a permanent action leaves no way back. Irreversible actions deserve a wall in front of them by design, a confirmation or an approval gate, so that reaching the trigger is not the same as pulling it.
- **S1 Money** (payments, billing, payouts, credits with cash value) combined with either scale (S5) or an autonomous agent (S4) forces EXTRA-MILE here, because a money flow with a weak internal boundary is a money flow an attacker, or a confused agent, can reach from the wrong side.

If your app genuinely has none of these, no autonomous agent, a handful of users, nothing irreversible, no money, then there is little architecture to defend, and this domain runs at FLOOR: confirm the public and private sides are actually separated and the obvious trust boundaries are not wide open. Do not build a containment fortress, draw a formal threat model, or design multi-layer agent isolation for an app that has nothing to contain. Over-designing the architecture of a low-stakes app is the failure here, not the diligence.

## Floor checks

Never skip these, on any app that has more than one part talking to another or any line between the public and the private.

| Check | Why it matters to your business | Evidence the agent must produce | Citation |
|---|---|---|---|
| Draw the trust boundary map: list the parts of the app (the public-facing pages, the server, the database, any outside services it calls, any AI helper), and mark every place where data or a request crosses from a side you do not control (the visitor's browser, a third-party response, an uploaded file) into a side you do (your server, your database). For each crossing, name what is checked at that line. | A trust boundary is a door between the part you control and the part you do not, and an unmarked door is a door left open. Most serious design holes live at exactly these crossings: input arriving from the browser that the server treats as already-safe, a reply from an outside service the app obeys without question. You cannot defend a line you have never drawn, and drawing it is how an assumed check that was never written becomes visible before someone walks through it. | A trust-boundary map: every part of the app, every point where untrusted input crosses into a trusted part, and for each crossing, the check performed there or a flag that nothing checks it. | OWASP Top 10:2025 A06 Insecure Design; NIST SSDF SP 800-218 v1.1 PW.1 (design software to meet security requirements) |
| Confirm the public side and the private side are actually separated: that the parts which face the visitor cannot directly reach the database, the master keys, or privileged actions except through the server, and that nothing privileged is performed in code that runs in the visitor's browser. | If the part of your app that ships to the public can reach the private machinery directly, the wall between public and private is decoration. This is the design version of leaving the keys in the front window: the visitor's side should ask the server, and the server should hold the power, so that controlling the public side never means controlling the private one. | A separation result: confirmation that public-facing code reaches privileged resources only through the server, with any path where the browser-side touches the database, the master key, or a privileged action directly, flagged. | OWASP Top 10:2025 A06 Insecure Design; A02 Security Misconfiguration |
| Confirm the design fails safe, not open: when a part is unsure, errors, or cannot reach what it needs (the login check cannot reach its service, a permission lookup fails), the system denies rather than allows. Check that a failure in the middle of an action does not leave the door open or the data half-changed in a way that grants access. | A system that opens when it breaks is a system an attacker breaks on purpose. If a failed permission check defaults to "let them in," then knocking the check over is the whole attack. Failing closed means a broken lock stays locked, which is the only safe direction for a lock to fail. | A fail-safe result: for each access or permission decision, what the system does when the check errors or a dependency is unavailable (deny or allow), with any decision that defaults to allow on failure flagged. | OWASP Top 10:2025 A10 Mishandling of Exceptional Conditions; A06 Insecure Design |

## Standard checks

A competent team does these. Run them on this domain's surface when your app has an autonomous part, shared users, money, or irreversible actions, per the stakes signals above.

| Check | Why it matters to your business | Evidence the agent must produce | Citation |
|---|---|---|---|
| Run a lightweight, structured threat-model pass over the design: for each trust boundary on the map, walk the standard categories of what can go wrong (someone pretending to be another user, data tampered with in transit, an action denied later by the person who took it, private information leaking out, the system overwhelmed, a low-power part reaching high-power abilities) and write down, per boundary, which the design already guards against and which it does not. This is the STRIDE pass, named for those six categories. | The holes you never imagined are the ones you build, because you never asked the question. Walking a fixed set of "what can go wrong" questions at each door turns a vague sense of safety into a written list of what is and is not defended, and it surfaces the gap a happy-path build never reveals. A structured pass, done in an hour and repeated, beats a perfect one never done. | A threat-model record: per trust boundary, the categories of attack considered, which the design currently mitigates, and which are unaddressed, with each unaddressed high-impact case flagged. | NIST SSDF SP 800-218 v1.1 PW.1 (threat modeling as a design activity); OWASP Top 10:2025 A06 Insecure Design |
| Map the privilege levels in the design: list each part of the app and the powers it holds (which can read the database, which can write, which can take irreversible or money actions, which an outside request can reach), and trace whether any chain lets a low-power part, or an outside request, arrive at a high-power ability. Look for the routes, not just the front doors. | Privilege-escalation paths are the routes by which a basic part of the system, or an outsider, reaches abilities meant for trusted parts only, and they are the design flaw rising fastest in AI-built apps. A part that should only read but can reach a writer, or a public endpoint that can chain its way to an admin action, is a quiet bridge to the powerful side. Finding the bridge on paper is far cheaper than finding it in a breach report. | A privilege map: each component and the powers it holds, the routes by which one part can invoke another, and any path that lets a low-privilege or externally-reachable part arrive at a high-privilege action, flagged. | OWASP Top 10:2025 A01 Broken Access Control; A06 Insecure Design; NIST AI RMF 1.0 MAP function (scope the system and map its risk surface) |
| Map the outside dependencies the design trusts: list every external service, model provider, or third-party response the app relies on, and for each, confirm the design treats the reply as untrusted input to be checked rather than as a trusted instruction to be obeyed, and that the failure of that dependency is handled rather than left to crash or stall the app. | An outside service is a part of your system you do not control, and a design that obeys whatever it returns has handed a stranger a seat at the table. A reply that gets trusted without a check, or a dependency whose outage freezes your whole app, is a design that fails on someone else's bad day. Treating every outside reply as something to verify keeps the parts you do not own from becoming the parts that break you. | A dependency-trust map: each external service the app relies on, whether its response is validated before use or trusted blindly, and how the design behaves when that dependency fails, with blindly-trusted or unhandled dependencies flagged. | OWASP Top 10:2025 A06 Insecure Design; A10 Mishandling of Exceptional Conditions; NIST AI RMF 1.0 MAP function |
| For any app where an AI feature, or a sequence of automated steps, decides a real action, confirm the design separates deciding from doing: the plan is formed and checked before any irreversible or sensitive action runs, rather than the system reading untrusted content and acting on it in one uninterrupted flow. | When reading and acting are fused, anything the system reads can steer what it does, including a hidden instruction smuggled into a document or a web page. Pulling the decision apart from the action, so a plan exists and can be checked before anything is committed, is the difference between a system that can be talked into harm mid-task and one that cannot. For automated flows touching money or irreversible actions, this separation is the load-bearing design choice. | A flow review: for each automated or AI-driven action path, evidence that the decision is formed and validated before the action executes, with any path that reads untrusted input and acts on it in one fused step flagged. | OWASP Top 10:2025 A06 Insecure Design; OWASP Top 10 for LLM Applications 2025 LLM06 Excessive Agency |

## Extra-mile checks

Frontier rigor. Even strong engineering teams treat these as extra, extended effort. Run them on this domain's surface only when the stakes gate forces it, as annotated.

| Check | Why it matters to your business | Evidence the agent must produce | Citation | Stakes gate + frontier pattern |
|---|---|---|---|---|
| Produce a full written threat model of the architecture and keep it as a living document: the system drawn out, every trust boundary, the full set of attack categories considered at each, the mitigations in place, the residual risks accepted, and a date. Revisit it when the design changes. Make it the reference the rest of the audit checks against. | On a system holding many people's data or money, the design decisions are the ones with the largest blast radius, and an undocumented design is one nobody can review or hold to account. A written, dated threat model is what lets you, a reviewer, or a future hire see what the system was built to withstand and what it was knowingly not, instead of rediscovering it during an incident. It is the artifact that turns "we think it is safe" into something checkable. | A complete threat-model document: the architecture diagram, every trust boundary, the attack categories assessed per boundary, mitigations, explicitly accepted residual risks, and a date, with any high-impact unmitigated risk flagged for a decision. | NIST SSDF SP 800-218 v1.1 PW.1 (threat modeling); OWASP Top 10:2025 A06 Insecure Design; OWASP ASVS 5.0.0 Level 3 architecture verification (cited at document level) | Forced by S5 (blast radius) or S1 with scale on this surface. Frontier pattern: formal STRIDE threat model. |
| Design and verify a containment architecture for any autonomous agent: choose and implement at least one named isolation pattern so a tricked or misbehaving agent cannot do free-form damage, and confirm in the design that it holds. The patterns, from simplest to strongest: action-selector (the agent may only pick from a fixed list of allowed actions, never invent one); plan-then-execute (the plan is fixed before the agent reads any untrusted content, so that content cannot redirect it); map-reduce (each untrusted item is handled in isolation and the results combined, so one poisoned item cannot infect the rest); and dual-LLM (one part holds the powers but never reads untrusted text, a separate quarantined part reads untrusted text but holds no powers, and they pass values between them by reference). Combine more than one when the stakes are high; no single pattern is complete. | An autonomous agent with broad reach and no containment is the highest-stakes design flaw of the agent era, because a stranger can steer it through any text it reads and it acts before anyone can intervene. Building a wall around what the agent can do, by limiting it to fixed actions, or fixing its plan before it reads untrusted content, or keeping the part that reads danger away from the part that holds power, is what turns "the agent was tricked" into "the agent was tricked and it did not matter." For an app where an agent acts on its own, this wall is the design, not an add-on. | A containment-design record: which isolation pattern (or combination) the architecture uses for the autonomous agent, where in the design the boundary sits, what the agent can and cannot reach across it, and confirmation the boundary holds when the agent is fed hostile input, with any gap where the agent can act free-form on untrusted content flagged as residual risk. | OWASP Top 10 for LLM Applications 2025 LLM06 Excessive Agency and LLM01 Prompt Injection; OWASP Top 10:2025 A06 Insecure Design; NIST AI RMF 1.0 MAP and MANAGE functions | Forced by S4 (autonomous agent), which mandates a containment pattern on this domain. Frontier pattern: containment architecture (action-selector, plan-then-execute, map-reduce, dual-LLM; Beurer-Kellner et al. 2025). |
| Define and verify the sandbox boundaries for any part that runs code, processes uploads, or executes actions on the app's behalf: confirm in the design that such a part runs with the least power that still works, inside a restricted space it cannot escape, with explicit limits on what it can reach over the network and what it can touch on the system, and with a human-approval gate in front of any irreversible or high-impact action. A sandbox is a walled-off space where a part can do its work without being able to reach the rest of the system. | A part that runs code or acts on the app's behalf is a part an attacker most wants to hijack, and a part without a sandbox is a part whose hijack becomes total. Confining it to the minimum power inside an enclosure it cannot break out of, and putting a human in front of the actions that cannot be undone, is what keeps a compromised worker from becoming a compromised system. For irreversible actions especially, the gate is the wall between a mistake and a disaster. | A sandbox-boundary record: each part that runs code or takes actions, the powers it holds and the enclosure confining it, its network and system access limits, the human-approval gate guarding irreversible or high-impact actions, and any part that runs without a real boundary or without a gate on irreversible actions, flagged. | OWASP Top 10:2025 A01 Broken Access Control; OWASP Top 10 for LLM Applications 2025 LLM06 Excessive Agency; NIST AI RMF 1.0 MANAGE function | Forced by S4 (autonomous agent), and reinforced by S6 (irreversibility) on this surface. Frontier pattern: sandbox boundaries and least-privilege containment. |

## When to stop and hire a human

Bring in an independent human reviewer for this domain when any of these are true:

- An AI agent in your app can act on its own (S4) and you cannot produce a containment-design record that names the isolation pattern in use and shows the boundary holds when the agent is fed hostile input. An autonomous agent without a demonstrable wall around it is the design flaw most likely to turn a single trick into total damage, and it should not run unreviewed.
- Your app serves many users or multiple separate customers, or moves money (S5, or S1 with scale), and you cannot produce a clear trust-boundary map and a privilege map with no unexplained path from a low-power or externally-reachable part to a high-power action. A design whose internal routes you cannot fully account for, on a shared or money-handling system, is a breach waiting for the first person who maps it for you.
- The threat model or the privilege map surfaces a high-impact case the design does not guard against, and you cannot confirm whether a fix actually closes it. A known unmitigated design risk on a high-stakes system is not a place to guess your way to "probably fine."
- An irreversible action (S6) can be reached and triggered without a gate you can point to in the design. Permanent actions reachable by the wrong part, or by a confused agent, earn a human pass before launch.

This protocol catches a meaningful slice of design and containment problems cheaply, and it is the right first pass for almost every app that has an autonomous part or real scale. It is not a guarantee. An AI reviewing the architecture an AI built is weaker than an independent human review on exactly the design judgment that matters most here, because sound design depends on what your specific app should and should not allow, and that has no general answer the model can copy from. Domain K covers what a professional review adds and where its honest ceiling sits. For an app carrying real stakes on this domain, route there.

## Agent instructions

```
DOMAIN J: ARCHITECTURE SANITY

Scope by stakes (stakes are local to this domain's surface):
  If the app has more than one part talking to another, or any line between a public and a
  private side, run FLOOR here at minimum: map the trust boundaries, confirm public/private
  separation, confirm the design fails closed.
  If the app has shared users, multiple customers, a public API, money, or irreversible actions
  (S5, S1, S6), run STANDARD here: structured threat-model pass, privilege map, dependency-trust
  map, decide-before-do flow review.
  Escalate to EXTRA-MILE when S5 (blast radius) is present, or S1 (money) combines with scale.
  HARD OVERRIDE: if an AI agent can act on its own (S4), run EXTRA-MILE here regardless of the
  signal count, and the containment-architecture record and the sandbox-boundary record are
  MANDATORY, not optional.
  If the app has no autonomous agent, few users, no money, and nothing irreversible, run FLOOR
  only: draw the boundaries, confirm separation and fail-closed, do NOT draw a formal threat
  model or design agent isolation for an app with nothing to contain.

Circularity note (see the circularity-guard protocol):
  Design is where same-context self-audit is weakest in a different way than access control:
  the agent that built the architecture reached for the most direct wiring and reads that wiring
  as normal, because it is what the model has seen built. The missing wall does not look missing
  to the builder. Run this domain in a CLEAN, fresh context with no access to the build rationale,
  and prefer a different model from the one that wrote the code. Ask of every part "what does this
  trust, and what could reach it that should not," rather than confirming the design as built.

Produce these artifacts (not verdicts):
  FLOOR:
    1. Trust-boundary map: every part of the app, every point where untrusted input crosses into a
       trusted part, and the check at each crossing or a flag that nothing checks it.
    2. Separation result: confirmation that public-facing code reaches privileged resources only
       through the server, with any direct browser-to-database / browser-to-master-key /
       browser-to-privileged-action path flagged.
    3. Fail-safe result: for each access or permission decision, what happens when the check errors
       or a dependency is unavailable (deny or allow), with allow-on-failure flagged.
  STANDARD (shared users / money / irreversible / autonomous):
    4. Threat-model record: per trust boundary, the attack categories considered, which the design
       mitigates, which are unaddressed, high-impact unaddressed cases flagged.
    5. Privilege map: each component and its powers, the routes one part can invoke another, and any
       path from a low-privilege or externally-reachable part to a high-privilege action, flagged.
    6. Dependency-trust map: each external service, whether its reply is validated or trusted blindly,
       and how the design handles its failure, with blindly-trusted or unhandled dependencies flagged.
    7. Flow review: for each automated or AI-driven action path, evidence the decision is formed and
       validated before the action runs, with read-and-act-in-one-fused-step paths flagged.
  EXTRA-MILE (blast radius, money at scale, or autonomous agent):
    8. Threat-model document: full diagram, every boundary, attack categories per boundary,
       mitigations, accepted residual risks, a date; high-impact unmitigated risks flagged.
    9. Containment-design record (if S4): the isolation pattern in use (action-selector,
       plan-then-execute, map-reduce, dual-LLM, or a combination), where the boundary sits, what the
       agent can and cannot reach, and confirmation the boundary holds under hostile input; free-form
       action on untrusted content flagged as residual risk.
    10. Sandbox-boundary record (if S4, reinforced by S6): each part that runs code or acts, its
        powers and enclosure, its network/system limits, the human-approval gate on irreversible
        actions, and any part without a real boundary or without a gate, flagged.

Output a findings table with these columns and nothing weaker than evidence:
  | Severity | Business risk in plain words | Evidence artifact | Citation | Suggested fix |

Rules:
  - Translate every finding into a concrete business consequence a non-coder understands
    (for example: "a tricked AI helper could delete every customer's records because nothing
    walls off what it can reach," not "missing containment boundary").
  - Cite only the controls named in this domain (A01, A02, A06, A10, LLM01, LLM06, SSDF PW.1,
    AI RMF MAP and MANAGE, ASVS at document level). Do not invent IDs and do not print ASVS
    V-numbers beyond V1 1.2.5.
  - No bare verdicts. "Architecture looks sound" is not a finding. Attach the artifact that proves
    the claim; a confident-looking verdict with no evidence manufactures false trust.
  - If you cannot produce an artifact a check demands, say so and mark that check INCOMPLETE.
```
