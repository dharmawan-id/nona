# Adapters: one source of truth, many front doors

NONA is written once and then handed to different AI agents through different files, because each agent reads its instructions from a different place. Cursor reads a `.mdc` rule. A Claude-native skill reads `SKILL.md`. The cross-agent drop-in is `AGENTS.md`. There is also a slash-command definition under `commands/`. All of these are front doors into NONA. None of them is where NONA actually lives.

This note exists so the front doors never start saying different things.

## The rule

The `protocol/` tree at the repository root is canonical. Every other file that describes the audit is a distilled view of it.

The full audit, in full detail, is the set of files under `protocol/`. The overview file (`00-overview.md`) carries the premise, the twelve areas, and the three tiers. The stakes-gating file (`01-stakes-gating.md`) carries the six stakes signals and the exact procedure that scales the audit to the app. The circularity-guard file (`02-circularity-guard.md`) carries the method for auditing AI-written code without inheriting its blind spots. The twelve area files, `a-intent.md` through `l-decide-and-act.md`, each follow the same layout and each end with a runnable block for the agent. The authorities every check resolves to live in `CITATIONS.md`, the guidance for trusting and pinning NONA itself lives in `SECURITY.md`, and the evidence corpus and the plain-language glossary live in `docs/`.

The files below are distilled from `protocol/`. They restate it in a shorter form and route the agent into it. What they may not do is add anything the protocol does not already contain: no new check, no new tier name, no new stakes signal, no new citation.

- `AGENTS.md`, the cross-agent spine, a drop-in entrypoint many coding agents read by convention.
- `skills/nona-audit/SKILL.md` with its `reference/` cards, the Claude-native payload behind the `/nona-audit` trigger.
- `commands/nona-audit.md`, the slash-command definition.
- `adapters/cursor/nona.mdc`, the Cursor rule shim that sits next to this note.

## Why this matters to you

If you are a developer running NONA, you can skip this section. Pick the front door for your tool and run it.

The rest is for anyone who edits NONA or forks it, and the thing it guards against is drift. Suppose someone fixes a wording in the Cursor rule and forgets the skill, or adds a check to `AGENTS.md` that never makes it back into the area file. Now two front doors disagree, and two agents run two different audits under the same name. A developer who trusted the report has no way to tell which audit they actually got. A protocol whose copies have quietly diverged is more dangerous than a single honest source, because nobody can see the disagreement until it has already done its damage.

## The discipline: author once, regenerate together

When NONA changes, the change lands in `protocol/` first, and the distilled files are brought back into line with it inside the same change rather than left for later.

In practice that is four steps. First, edit the canonical source: make the change in the relevant `protocol/` file, or in `CITATIONS.md` for an authority, or in `SECURITY.md` for integrity guidance. A check, a tier definition, a stakes signal, or a citation is only ever allowed to originate there. Second, regenerate every distilled file in the same pass, so that `AGENTS.md`, `skills/nona-audit/SKILL.md` and its `reference/` cards, `commands/nona-audit.md`, and `adapters/cursor/nona.mdc` all match the new canonical source. They are outputs of the protocol, refreshed as a set, and editing one in isolation is how drift begins.

Third, check the load-bearing invariants. Every distilled file has to keep the same twelve area letters (A to L), the same three tier names (floor, standard, extra-mile), and the same six stakes-signal names (S1 Money, S2 Identity/Auth, S3 Personal data, S4 Autonomy, S5 Blast radius, S6 Irreversibility). When a distilled file points into `protocol/`, it has to point at the area filename that is actually on disk; a pointer to a file that has since been renamed is a broken pointer. Fourth, do not invent citations in a distilled file. Every control a distilled file names has to exist already in `CITATIONS.md`. A front door cannot mint a control identifier the protocol never claimed, and where a control is version-fragile, the distilled file states the plain meaning and cites at the document level, the same way the protocol does.

A generator script that emits the distilled files from `protocol/` is the intended way to enforce all of this, so that regeneration is mechanical and drift becomes structurally impossible rather than merely frowned upon. In this version of NONA the discipline is documented and applied by hand, and the script can follow later. The order holds either way: the protocol is the source, the adapters are its output, and they move together.

## If a front door disagrees with the protocol

The protocol wins. A distilled file that contradicts `protocol/` is out of date, and the fix is to regenerate it from the protocol. The reverse, editing the protocol to match a stale adapter, is never the fix. If you are running NONA and a front door seems to tell you something the area files do not, trust the area files and report the mismatch.
