# The Circularity Guard

A cross-cutting protocol for Domain F (AI-generated-code patterns and circularity). It applies to every domain audit, but it is the whole point of Domain F, so it lives here once and the domain files point back to it.

## Why this exists

Your app was built by an AI agent. If you now ask that same agent, in the same chat, to check its own work, you have asked the author to grade the author. That is weaker than it sounds, and the weakness is not laziness on the agent's part. It is structural.

The reason human code review works at all is mismatch. A second person brings different assumptions, different habits, and different blind spots than the person who wrote the code. The bug the author could not see, the reviewer sometimes can, precisely because the reviewer is not the author. When one AI both writes and tests, that mismatch disappears. The testing agent inherits the same weaknesses as the coding agent. It tends to be blind to the same things, confident about the same things, and wrong about the same things. A research note from Stanford's CodeX program (February 2026) named this exact problem at the institutional level and offered no fix, only a warning that the window to address it is narrow.

There is a second trap that rides along with the first. An agent asked "is this secure?" in the same context where it just declared the feature done will often answer yes, because it already believes it did a good job. Telling an agent to "be careful" or "make it secure" does not repair this. On a benchmark of 200 real repository tasks, code that was 61 percent functionally correct was only 10.5 percent secure, and adding security hints to the request did not move the security number (SUSVIBES, arXiv:2512.03262). Good intentions in the prompt are not a control. A structured check that forces the agent to produce evidence is.

In plain business terms: a self-audit by the agent that built your app can hand you a clean-looking report while the same money bug, the same login hole, the same data leak sits untouched, because the inspector and the builder are the same mind looking at the same code the same way.

## The guard, in four parts

The guard does not try to make AI review perfect. It makes the review structurally different from the build, demands proof instead of a thumbs-up, and tells you in writing when the result is not enough. Four parts, all four required.

### Part 1. Run the audit in a clean, fresh context

Start the audit in a new session that has no memory of why the code was written the way it was. No build chat history, no design rationale, no running commentary about what the agent intended. The reviewer should meet your code the way a stranger would: as a finished thing to be inspected, with no story attached that explains away its flaws.

This is the cheapest lever and it is measured. In a controlled experiment, a review run in a fresh session with no production history beat a review run in the same session, and the gain was largest on critical errors (a difference of about eleven percentage points in critical-error detection; Cross-Context Review, arXiv:2603.12123). A deciding control in that same study mattered: reviewing twice in the same session gave no real improvement over reviewing once. So the benefit does not come from "look again." It comes from looking from a separated context. More passes in the same chat buys you almost nothing. A clean context buys you the critical-bug gain.

Practically, this means: open a new conversation, or clear the working context, before you run NONA. Do not run the audit as a continuation of the build session.

### Part 2. Prefer a different model lineage

Stronger than a fresh session is a fresh mind. If one model family built the app, have a different model family run the audit. If the code was written with a Claude-based agent, run the NONA audit with a different model where you can, and vice versa.

The reasoning: models from the same family tend to share training, and therefore share blind spots, the same way two engineers trained at the same shop make the same mistakes. A different lineage is more likely to be blind to different things, which is exactly the mismatch that makes review useful. There is an information-theoretic argument that diverse reviewers reduce shared blind spots (Rajan, arXiv:2511.16708). That argument supports the direction. It does not pin a number.

So this part is a recommendation, not a promise. Use a different model when you can. NONA does not claim a specific catch rate from doing so, and you should be suspicious of anyone who does. If you only have one model available, still do Part 1: a clean context with the same model is worth doing and is independently measured to help.

### Part 3. Demand artifacts, not verdicts

A verdict is "looks secure." An artifact is the actual thing the agent had to produce to earn that verdict. NONA refuses verdicts and requires artifacts, because a verdict can be asserted without doing the work, and an artifact cannot.

For each domain, NONA names the specific artifact the agent must output. The actual list of secrets it found and where. The actual map of who is allowed to reach which data and how that is enforced. The actual result of checking that every imported package exists and is the one intended. A finding always carries its evidence: the config line, the query, the route, the exact place in your code, alongside the plain-language business risk and the citation. No bare "passed."

This is not bureaucratic. It is the mechanism that makes the agent do the check instead of claiming it did. It also protects you, the reader, from a known failure of the human side. When an AI explanation merely seems reasonable, people tend to trust it past the point the facts justify, and in one oversight study, when reviewers missed an error their confidence actually went up rather than down (a measured effect, Hedges' g = 0.85). A confidence score manufactures trust. An artifact lets you, or a real engineer you hire, point at the evidence and check it. Evidence beats a number every time.

### Part 4. State residual risk explicitly and route high-stakes cases to a human

After the audit, NONA does not declare your app safe. It states what was checked, what could not be checked this way, and what remains uncertain. Silence is never treated as success. "The agent found nothing here" is reported as exactly that, not as "this is fine."

Then it routes. If your app handles money, holds a lot of people's personal data, can take actions that cannot be undone, or runs an AI agent that acts on its own without a human approving each step, NONA tells you in writing to get an independent human review (see Domain K and Domain L). The guard reduces your risk cheaply. It does not retire the risk. Knowing where the floor of this method is, and saying so, is part of the method.

## The honesty clause (mandatory, not optional)

This is the line NONA will not cross, because crossing it would make NONA the very problem it exists to fight.

AI reviewing AI catches a meaningful slice of serious bugs, cheaply, and it misses most of them when working alone. In the cleanest measurement available, even the best condition, a fresh separated context, caught only about 28.6 percent of injected errors by F1 (a combined score of how many real bugs were found and how few false alarms were raised; Cross-Context Review, arXiv:2603.12123). Roughly seven in ten injected bugs survived the best AI review in that study. That is a useful filter. It is not a safety guarantee.

So NONA states plainly:

- NONA reduces risk. It does not prove your app is safe.
- An AI audit, even a cross-model one run in a clean context, is not a substitute for a professional penetration test by a human (see Domain K). It is a cheap first pass that catches a meaningful share of critical bugs and lets a paid human start from a higher floor.
- High-stakes apps, money, many users, irreversible actions, or an autonomous agent, still need an independent human audit. NONA's job is to tell you when you have crossed into that territory, not to pretend you have not.

The reason this clause is mandatory is the failure it prevents. The documented danger of AI coding assistants is that people write less secure code while believing it is more secure: a false sense of security, measured in a peer-reviewed study (Perry et al., CCS 2023). An audit tool that overstated its own power would hand you that same false comfort with an official-looking stamp on it. That would be worse than no audit, because you would stop looking. NONA would rather tell you the unflattering number and keep you alert.

## Why structure, and not a better prompt

A fair question: if the agent is smart, why not just tell it to be thorough? Because that was tested and it failed. Generic security hints did not improve the security of generated code in the benchmark cited above. Exhortation does not work. Structure does. NONA's value is the domain-by-domain checklist with a named artifact required at each step, run from a separated context, with the residual risk written down. That is what forces the agent to perform the check rather than assert that everything is fine, and that is what gives you something a human can verify when the stakes say you need one.

For teams that want the strongest version of containment around an autonomous agent, the frontier patterns (a separate model that only chooses among safe actions, plan-then-execute separation, and related designs; Beurer-Kellner et al. 2025) appear in the extra-mile tier of Domain F and Domain B. They are extra effort, reserved for apps where an agent can act on its own. The four-part guard above is the baseline that applies to everyone.

---

Related reading: Domain F (`protocol/f-ai-code-circularity.md`) for the full domain audit, Domain K (`protocol/k-pentest.md`) for what a human review covers and why it is still needed, Domain L (`protocol/l-decide-and-act.md`) for the explicit when-to-hire-a-human decision, and the honest-limits write-up in `docs/why-nona-exists.md` for the evidence corpus behind these numbers with its measurement caveats.
