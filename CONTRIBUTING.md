# Contributing to NONA

Thank you for wanting to make NONA better. The most valuable thing you can add is a new check: one more thing the audit looks for, written so a non-coder can understand the stakes and an AI agent can actually run it. This page explains how to propose one, how to keep the project's many files in sync, and the writing rules every contribution follows.

NONA is read by two audiences at once: a person who built an app with an AI tool and cannot read the code, and that person's AI agent. Everything you write has to serve both. Hold that in mind and most of the rules below will feel obvious.

## How to propose a new check

A check earns its place when it survives three tests. Skip any one of them and a maintainer will send the proposal back.

### 1. It resolves to a real, named authority

Every floor and standard check in NONA maps to a published, dated control: an OWASP Top 10 item, an ASVS requirement, a NIST SSDF practice, a SLSA build level, a CIS benchmark, a vendor production checklist. The check is the plain-language translation; the citation is what makes it defensible. A proposal that rests only on your own opinion of good practice is not yet a NONA check, however sensible the advice.

So before anything else, find the authority. Name the standard, its version, and its date. The full map of what NONA already cites lives in `CITATIONS.md`. If your check fits an authority already listed there, point to it. If it needs a new one, add the source to `CITATIONS.md` in the same change, with its version and publication date.

Two hard rules on citations. Never invent a control identifier. If you are not certain a control number is real and current, do not print it. And where a control is version-fragile (an ASVS V-number, an exact CIS benchmark section that shifts between releases), state the plain meaning of the check and cite the standard at the document level rather than naming a number that may be wrong by the next release. The plain meaning is the durable part; the citation is the defense behind it.

Extra-mile checks are the one place a check may rest on a named frontier practice or a research result rather than a baseline standard (a containment pattern, an evaluation harness, a published study). Name the practice or the paper plainly, and say honestly how strong the evidence is. If a claim comes from a vendor with a reason to alarm, label it a vendor stat. If the effect is real but its size is not pinned down, recommend the practice as good policy and do not promise a catch rate.

### 2. It is written for someone who cannot read code

A NONA check is not a line for engineers. It is an instruction a non-coder can read and an agent can run. That means:

- Plain language. The first time a technical term appears, gloss it in one short clause and keep the English word, because the reader's agent and any web search resolve on the English term. Write "RLS (row-level security, a database rule that limits which rows a user can see)" once, then use RLS freely.
- A business consequence, never a bare label. Do not write "IDOR present." Write what it costs the person who owns the app: a stranger can open any other customer's invoices by changing a number in the web address. The reader decides what to fix by understanding what breaks, so spell out what breaks.
- Honesty about limits. If a check reduces a risk without removing it, say so. NONA exists to fight false confidence, so a check that oversells itself works against the whole project.

If you are unsure whether your wording lands for a non-coder, read it aloud as if to someone who has never opened a code editor. If it needs a glossary they do not have, rewrite it.

### 3. It demands an artifact, not a verdict

This is the test most proposals fail, and it is the one NONA cares about most. A check must tell the agent to produce evidence a human can look at, not to deliver a judgment a human has to trust.

"Confirm authentication is secure" is not a check. It asks the agent for an opinion, and an opinion from the same kind of AI that wrote the code is worth very little. "List every route that changes data, and for each one show the exact line that confirms the user is allowed to make that change; flag any route with no such line" is a check. It forces the agent to do the work and hand back something the owner, or a hired human, can inspect.

So write your check as an imperative the agent can carry out, and name the artifact it must produce: the actual list of secrets found, the actual map of who can reach what, the actual result of checking whether a suggested package really exists on the registry. Evidence you can see beats a confidence number you have to take on faith.

### Where the check goes

NONA covers twelve areas, A through L, each with a file under `protocol/`. Find the area your check belongs to and decide its tier:

- floor, the non-negotiable baseline every app needs.
- standard, what a competent team would do for an app that handles real stakes.
- extra-mile, the frontier, applied only when the stakes justify it.

If your check belongs at standard or extra-mile, say which of the six stakes signals raises the area to that level: S1 Money, S2 Identity/Auth, S3 Personal data, S4 Autonomy (an AI can act without a human approving each action), S5 Blast radius (many users, multi-tenant, public API, shared infrastructure), or S6 Irreversibility (an action cannot be undone). A check that only fires when real money is on the page does not belong at the floor. Putting it there would make NONA recommend heavy work to someone who does not need it, and over-applying elite practice to a low-stakes app is a failure of judgment, not diligence. Match the rigor to the risk.

Open an issue first to discuss a new check before you write the change, especially for a whole new area or tier. It saves you rework if a maintainer sees a problem early.

## The single source of truth: edit `protocol/`, regenerate the rest together

NONA is written once and handed to different agents through different files. Cursor reads a `.mdc` rule. The Claude-native skill reads `SKILL.md`. The cross-agent drop-in is `AGENTS.md`. There is a slash-command definition under `commands/`. These are front doors. None of them is where NONA lives.

NONA lives in `protocol/`. Every other file that describes the audit is a shorter view of it. A check, a tier definition, a stakes signal, or a citation is only ever allowed to originate in `protocol/` (or in `CITATIONS.md` for an authority, `SECURITY.md` for integrity guidance). The front doors restate the protocol and route the agent into it. They may not add anything the protocol does not already contain.

This matters because the thing it guards against is drift. Fix a wording in the Cursor rule and forget the skill, and now two front doors say different things, two agents run two different audits under the same name, and the person who trusted the report cannot tell which audit they got. A protocol whose copies have quietly diverged is more dangerous than a single honest source, because nobody sees the disagreement until it has already done damage.

So when your check is accepted, the change lands in the canonical source first, and the distilled files are brought back into line inside the same change rather than left for later:

1. Edit the canonical source. Add the check to the right `protocol/` area file, and add or reference its authority in `CITATIONS.md`.
2. Regenerate every distilled file in the same pass, so `AGENTS.md`, `skills/nona-audit/SKILL.md` and its `reference/` cards, `commands/nona-audit.md`, and `adapters/cursor/nona.mdc` all match. They are outputs of the protocol, refreshed as a set. Editing one in isolation is how drift begins.
3. Check the invariants. Every file keeps the same twelve area letters (A to L), the same three tier names (floor, standard, extra-mile), and the same six stakes-signal names (S1 through S6 above). Where a distilled file points into `protocol/`, it points at a filename that is actually on disk.
4. Do not mint citations in a distilled file. Every control a front door names already exists in `CITATIONS.md`. Version-fragile controls state the plain meaning and cite at the document level, the same way the protocol does.

The full version of this discipline, including how a generator script will mechanize it later, is in `adapters/README.md`. Read it before you touch more than one file. The order holds either way: the protocol is the source, the adapters are its output, and they move together. If a front door ever contradicts the protocol, the protocol wins, and the fix is to regenerate the front door, never to edit the protocol to match a stale copy.

## Writing rules for every contribution

NONA's credibility rests on its prose reading like a careful engineer wrote it for a worried founder, not like a generated checklist. A few rules keep it there:

- Write in plain, varied prose. Mix short sentences with longer ones. Do not open every list item with a bold word and a colon as a reflex, and do not pad sentences with trailing "-ing" clauses that add nothing. State things directly.
- No em-dash anywhere in shipped text. Use a comma, a colon, parentheses, or a new sentence.
- Do not frame a point as a contrast ("not X, but Y"). State what is true and give the detail that shows why.
- Do not let inanimate things act. Code does not "understand," a report does not "tell you," a scanner does not "decide." Name the person or the agent doing the thing, or state the finding directly.
- Keep the reader in view. Every risk is a business consequence in everyday words. Every technical term is glossed once on first use, with the English headword kept.

Run your wording past these before you open a pull request. A maintainer will check the same things, plus the three check tests above, and the firewall rules below.

## The firewall: what may never appear in a shipped file

NONA is a public project. The files under `protocol/`, `adapters/`, `skills/`, `commands/`, `docs/`, and the top-level documents are all read by strangers and their agents. Some things must never leak into them:

- No internal working language, code names, person names, team names, workstream identifiers, or any reference to how NONA was built. A shipped file talks about the audit and the reader, never about its own production.
- Do not attribute NONA's central idea to a named person. The idea that a non-coder does not know what they do not know is product copy now. State it as the reason NONA exists. Do not credit an individual for it.
- The stakes-gate, the three tiers, and the circularity guard are product concepts and stay. Describe them in plain reader-facing language. They are part of the audit, so they belong in the open.

If you are editing only the internal `_build/` or `_research/` trees, none of this applies; those never ship and `.gitignore` keeps them out of the public repo. The moment your change touches a public file, the firewall is in force.

## Submitting

Open an issue to discuss a new check or a substantial change. For a small fix, a pull request is fine. Either way, in your description, name the authority your change rests on, name the artifact any new check demands, and confirm you regenerated the distilled files alongside the protocol. By contributing you agree your work is released under the project's CC-BY-4.0 license, the same terms in `LICENSE`.
