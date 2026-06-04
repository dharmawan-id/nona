# Why NONA Exists

You built an app with an AI coding tool. It runs. Your customers can use it. So why audit it at all?

Because "it runs" and "it is safe" turn out to be almost unrelated, and the gap between them is where the money, the data, and the trust leak out. This page is the evidence for that claim. It is not a sales pitch. It is a short tour of what researchers and security firms measured when they looked at AI-generated code in 2025 and 2026, and what those measurements honestly do and do not prove.

Read it once. It is the reason every check in this audit exists, and it is also the reason this audit refuses to promise you more than it can deliver.

A note on how to read the numbers. Some of the figures below come from independent academic studies. Some come from commercial security vendors, who have a business reason to make the situation sound alarming. We tell you which is which, every time, and we lean on the independent work for any claim a skeptic might push back on. We also walk you through one number that looks like a contradiction and is not, because understanding why it is not is the difference between an honest tool and a scary headline.

## What AI-generated code actually ships with

### "It works" is not "it is safe"

The single cleanest piece of evidence comes from a study called SUSVIBES. Researchers built a benchmark of 200 real, repository-level tasks, drawn from actual historical bug fixes across 77 different weakness types, with roughly 180 lines of code edited across several files for each one. These are not toy puzzles. They are the kind of feature request you would give an AI tool. Then they had a capable AI agent, paired with a frontier model, complete each task, and they checked the result two ways: did it work, and was it safe.

The result: the code was 61 percent functionally correct and only 10.5 percent secure.

Sit with the distance between those two numbers. The thing you can see as a non-coder, that the feature works, was true most of the time. The thing you cannot see, that it was built without a security hole, was true almost never. The "it works" signal you naturally rely on is close to useless as a safety signal. They measured the two and found them nearly disconnected.

The study tried the obvious fix. Researchers added security hints to the request, telling the AI to watch out for vulnerabilities, and the security number did not move. This matters for how an audit has to work. Telling an AI agent "be careful, make it secure" does not make the code secure. A vague instruction is not a control. Only a structured, specific check that forces the agent to produce evidence does the job, which is exactly what this audit is. (Zhao et al., SUSVIBES, arXiv:2512.03262, 2 December 2025.)

### The big industry number, labeled as a vendor study

The security firm Veracode ran AI-generated code through its own testing across more than 100 models and more than 80 coding tasks. It reported that 45 percent of the samples introduced a known web weakness from the standard industry list, and that AI-written code carried 2.74 times more vulnerabilities than human-written code.

The load-bearing finding in that report is something subtler than the 45 percent itself. The failure rate stayed flat regardless of model size or sophistication. The newest, largest models were no safer in any meaningful way than older ones. If insecurity dropped every time a better model shipped, you could wait it out. It does not. The problem is built into how these tools work, and a fresh model release leaves it where it was. Specific failure rates were stark in places: the report put cross-site scripting failures around 86 percent and log-injection failures around 88 percent, with Java the worst language at roughly 72 percent.

The honest label: Veracode is a commercial security vendor, and a vendor selling security tools has an incentive to report an alarming number. Treat the 45 percent as a vendor figure. It earns its place here only because it points the same direction as the independent academic work above and below. The vendor saying it is not the reason to believe it; the agreement with neutral studies is. (Veracode, "2025 GenAI Code Security Report," 30 July 2025.)

### This is already happening to real, shipped apps

The two studies above are measurements in a lab. The next one is a count in the wild. The security firm Escape.tech ran a passive scan across 5,600 publicly reachable apps that had been built with AI tools, and found more than 2,000 vulnerabilities, more than 400 exposed secrets such as API keys and access tokens, and 175 instances of leaked personal data, including medical records and bank account numbers.

Two things make this number worse than it first sounds. First, the scan was passive and non-destructive, which means it only looked at what was reachable from the outside without breaking anything. The real totals run higher. These are lower-bound counts, a floor under the true figure. Second, most of those weaknesses sat on public endpoints with no login required, so a stranger did not need to be clever or to be a customer to reach them.

The honest label: Escape.tech is also a commercial security vendor. Same caution as above. The value of this figure is that it counts live, deployed apps rather than lab tasks, so it answers the question "is this a real-world problem or a theoretical one?" with a number. (Escape.tech, 29 October 2025.)

## The number that looks like a contradiction, and is not

If you go looking, you will find a much milder figure, and you deserve to have it explained rather than hidden.

A large independent academic scan by Schreiber and Tippe ran 7,703 AI-generated files through automated analysis and found that 87.9 percent had no mapped weakness at all, and only 12.1 percent had at least one. Twelve percent is a long way from forty-five percent, and further still from the 89.5 percent insecure that SUSVIBES implies. So which is true?

All three are true. The reason they disagree is the measurement design, and once you see it, the apparent contradiction dissolves.

- The 12.1 percent counts ordinary files of every kind, mixed together: simple ones, complex ones, security-relevant ones, and security-irrelevant ones. Most code in any app is plumbing that touches nothing sensitive. Average across all of it and the rate looks low.
- The 45 percent (Veracode) and the 10.5-percent-secure figure (SUSVIBES) come from curated, security-relevant tasks, the parts of an app where a mistake actually costs you. Concentrate on the dangerous surfaces and the rate looks high.

Both are honest pictures of different things. The 12.1 percent is the rate across code at large. The 45 percent and 10.5 percent are the rates on the surfaces that handle your money, your logins, and your customers' data. This audit targets precisely those surfaces. So the high numbers are the ones that describe the territory this audit walks into, and the comforting 12.1 percent describes mostly the plumbing it can safely skim past.

The rule we hold ourselves to: present the 10.5 percent, 12.1 percent, and 45 percent together, with this caveat attached, every time. Quoting the scariest one alone, stripped of context, would be the same kind of overclaim this audit exists to catch in other people's work. (Schreiber and Tippe, arXiv:2510.26103, 30 October 2025.)

## Why the builder over-trusts the output

The numbers above describe the code. The next two describe you, the human looking at it, and they are the reason a self-check is not enough.

### The false sense of security

In a controlled, peer-reviewed study, researchers gave one group of people an AI coding assistant and another group none, and had both write code. The group with the AI assistant wrote less secure code. That part you might expect from everything above. The part that should make you cautious is the second half: the group with the AI assistant was also more likely to believe their code was secure.

This is the keystone of the whole premise. The danger runs deeper than AI-assisted code simply having more holes. The person shipping it feels more confident while it has more holes. Your internal "this seems fine" sense gets miscalibrated upward exactly when an AI is involved, which is exactly the moment it should turn more careful. The one mitigating behavior the researchers noted: people who trusted the AI less and engaged more critically with its output produced fewer vulnerabilities. Skepticism protected them. Comfort left them exposed. (Perry et al., "Do Users Write More Insecure Code with AI Assistants?", ACM CCS 2023, arXiv:2211.03622.)

### Confidence rises when the reviewer is wrong

A separate study looked at non-experts overseeing AI output, the precise situation you are in when your agent hands you a report you cannot fully read. It found something unsettling. When a reviewer missed an error and was therefore wrong, their confidence tended to climb rather than fall. A reasonable-looking explanation made people trust it past the point the facts justified. The effect was measured and sizable.

This drives one of the firmest rules in this audit. Your agent does not get to hand you a confidence score and a clean verdict, because a confident-looking verdict is precisely what manufactures false trust. Instead, every finding has to come with the actual evidence behind it: the specific config line, the exact place in the code, the real list of what was found. Evidence is something you, or a human you hire, can point at and check. A score is something you have to take on faith, and faith is the failure mode here. (Grunde-McLaughlin et al., arXiv:2602.16844, 2026.)

## Why an AI auditing AI is a real method, and a limited one

You are likely going to ask your own AI agent to run this audit. That raises a fair objection, and this audit takes it seriously rather than waving it away.

### The circularity problem, named by a credible institution

A research note from Stanford Law School's CodeX program stated the problem cleanly in February 2026. Human code review works because of mismatch: a second person brings different assumptions, different habits, and different blind spots than the one who wrote the code, and that difference is what lets a reviewer catch what the author missed. When one AI both writes and tests, the mismatch is gone. In their words, "the testing agents inherit the same weaknesses as the coding agents." The reviewer is blind to the same things the builder was blind to, confident about the same things, and wrong about the same things.

The note named the problem at an institutional level and offered no fix, only a warning that the window to address it is closing. The circularity guard in this audit is the attempt at a fix, and it is honest about how far it gets. (Stanford Law CodeX (Kahana), "Built by Agents, Tested by Agents, Trusted by Whom?", 8 February 2026. The full method is in `../protocol/02-circularity-guard.md`.)

### Separating the review context helps, and it is cheap

There is good news, and it is measured. A direct experiment compared reviewing code in a fresh, separate session, with no memory of why the code was written, against reviewing it in the same session that built it. The fresh-context review won, and the gain was largest on the errors that matter most: about 11 percentage points more critical errors caught.

The cleverest part of that study was a control condition. The researchers also tried reviewing twice in the same session, to rule out the boring explanation that "looking again" is what helps. Two passes in the same session gave no real improvement. So the benefit is not from a second look. It is from a separated context, a reviewer that meets the code as a stranger would, with no story attached that explains away its flaws. That is why this audit tells you to run it in a clean session, and to prefer a different model where you can. (arXiv:2603.12123, 12 March 2026.)

### And here is the ceiling, stated plainly

This is the number this audit will not let you forget. In that same careful experiment, even the best condition, the fresh separated context, caught only about 28.6 percent of the injected errors by a combined score of how many real bugs it found and how few false alarms it raised. Roughly seven in ten planted bugs survived the best AI review on offer.

Read that as it is. An AI checking AI-written code catches a meaningful slice of serious bugs, cheaply, and misses most of them when it works alone. That is a genuinely useful filter and a hard limit at the same time. It is not a substitute for a professional penetration test by a human. An audit tool that claimed otherwise would be selling you the exact false sense of security that the Perry study documented, dressed up with an official-looking stamp, and that would be worse than no audit, because you would stop looking. This audit would rather tell you the unflattering number and keep you alert.

One related recommendation has weaker backing, and we say so. Using a different model family to audit, rather than just a fresh session of the same one, is supported in direction by an information-theoretic argument that diverse reviewers share fewer blind spots. The direction is sound. The size of the benefit is not pinned down by any measurement we found. So this audit recommends a different model as best practice and promises no specific catch rate from it. Be suspicious of anyone who does. (Rajan, arXiv:2511.16708, 2025.)

## What this adds up to

Put the evidence in a line and the case for this audit, and the limit on it, both fall out.

AI-generated code works far more often than it is safe, the gap is widest on exactly the surfaces that handle money and data, the problem is structural rather than something the next model fixes, real shipped apps are already leaking secrets and personal records by the thousands, the human shipping the code feels more confident precisely when they should be less, and an AI checking its own kind of work catches a useful minority of the bugs while missing most of them alone. Every one of those findings is a check, a tier, or a guardrail somewhere in this protocol.

And the same evidence sets the honest boundary:

- This audit reduces your risk. It does not guarantee your safety.
- AI reviewing AI catches a meaningful slice of critical bugs cheaply, and in isolation misses most injected errors, best measured at around 28.6 percent found. It is not a replacement for a professional penetration test.
- An app with real stakes, real money, many users, actions that cannot be undone, or an AI agent that acts on its own, should still pay for an independent human review. This audit is built to tell you the day you cross that line. That decision lives in Domain L (`../protocol/l-decide-and-act.md`), and what a human review actually covers is in Domain K (`../protocol/k-pentest.md`).
- The alarming headline figures come from studies built on different measurement designs, and some from vendors with a reason to alarm you. The independent academic counterweights are cited right beside them on purpose, and that is the standard the whole audit holds itself to.

The full map of every standard and control behind the checks is in `../CITATIONS.md`. Plain-language definitions for the technical terms used here are in `./glossary.md`.
