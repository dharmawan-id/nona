# Security and integrity of NONA itself

NONA is an instruction file. Your AI agent reads it and follows it, the same way it reads the other config files in your project. That is the whole point: you drop NONA in, your agent picks it up, and the audit runs. It also means NONA sits in a file class that attackers go after on purpose, so this page is about keeping NONA itself trustworthy.

If you only read one section, read "What NONA will never tell your agent to do" and "Five things to do before you trust any copy of NONA."

## Why a file like this is a target

Your agent treats files like NONA as **trusted configuration**: rules files, skills files, agent-instruction files. The agent does not second-guess them. It assumes whoever put the file there meant for it to run, and it follows the instructions inside. Researchers who tested attacks against exactly this file class (rules files, skills, agent instructions) found that planted malicious instructions succeed more than 85% of the time against the defenses that ship today, even when the defenders adapt (Maloyan and Namiot, arXiv:2601.17548). A booby-trapped rules file can quietly steer an agent into running commands the builder never approved and never sees.

The marketplaces where people share these files are wide open. A security vendor reviewed 3,984 publicly posted agent skills and found that 36.8% carried a security flaw of some kind, and roughly 36% contained a prompt-injection weakness, which means hidden text that hijacks the agent (Snyk, "ToxicSkills," 2026-02-05; this is a vendor analysis, included here because the sample is large and the finding is specific). A skill runs with the agent's full permissions: it can read and write your files, read your environment variables (the place where passwords and API keys live), and send messages on your behalf. So a poisoned file is not a small problem. It is a foothold.

Plain version of the risk: a stranger who gets a malicious instruction in front of your agent can make your agent leak your secrets, change your code, or take actions in your name, and you would have no idea it happened because the agent thought it was just following the rules.

NONA is in that file class. The rest of this page is how NONA is built so it is not the dangerous file, and how you check that the copy you have is the real one.

## What NONA will never tell your agent to do

NONA gives your agent exactly two kinds of instruction:

1. Read the builder's own code, meaning your repository on your machine.
2. Report what it found, as a findings table with plain-language business risk, the evidence it produced, a citation, and a suggested fix.

That is the entire job. Read your code, report back.

NONA contains no instruction that does any of the following, and a copy that does is not a copy you should trust:

- Fetch something from the internet and run it. NONA never says "download this and execute it," never points your agent at a remote script, never tells it to pull in outside content and act on that content's instructions.
- Send your data anywhere. No uploading, no posting to a webhook (a webhook is a URL that receives data automatically), no emailing or messaging your code, secrets, or findings to a third party.
- Reach for more power than reading code needs. No asking for elevated permissions, no installing software, no touching credentials beyond noticing that a secret is exposed and telling you so.
- Run shell commands that change your system. The audit is a read and a report. It does not modify your files, your database, or your deployment on its own.

NONA ships as plain Markdown text for this exact reason. You, or anyone, can open it and read every instruction it will ever give your agent. There is no compiled binary to trust on faith, nothing hidden, nothing that only reveals its behavior once it runs. If an instruction in your copy of NONA would exfiltrate data, escalate privilege, or run external content, it does not belong to NONA, and you have found a tampered or impersonated file.

## Five things to do before you trust any copy of NONA

You are about to hand this file to an agent that will read your code with broad access to your machine. Treat that handoff with the same care you would treat installing any tool. Before you trust a copy:

1. **Read it first.** NONA is human-auditable on purpose. Open the files and skim them. You are looking for the two-job rule above: read code, report findings. If a file is telling your agent to fetch-and-run, send data outward, or grant itself more access, stop and do not use that copy. You do not need to read code to spot a line that says "send this somewhere."

2. **Pin a specific version or tag.** When you adopt NONA, lock to a named release tag, for example a `v0.1` git tag. A moving branch like "latest" can change under you the next time you pull, and then you are running instructions you never reviewed. A pinned version is a fixed, known thing you reviewed once and can review again. (A "tag" is just a permanent label git puts on one exact snapshot of the files.)

3. **Verify the file hash.** A hash is a short fingerprint computed from a file's contents. Change one character and the fingerprint changes completely. Compare the hash of the copy you downloaded against the hash published for that version in the official repository. If they match, your copy is byte-for-byte the published one. If they do not match, your copy was altered in transit or at rest, and you should discard it. Your agent can compute and compare the hash for you if you ask it to.

4. **Treat any third-party fork or repackaged skill as untrusted until you have reviewed it.** A "fork" is someone else's copy of the project, which they are free to change. Convenient repackagings, mirror sites, and marketplace listings are exactly where a poisoned instruction would be inserted, per the marketplace findings above. Get NONA from the official repository, and if you must use a fork or a third-party skill build, read it line by line before you let it touch your project. Do not assume a fork is the same as the original just because it shares the name.

5. **Never let the audit act on untrusted outside content.** NONA points your agent at your code. Keep it that way. Do not wire NONA into a flow where it ingests a web page, a pasted snippet, an uploaded file from a stranger, or any other untrusted text and then treats that text as instructions. Untrusted content is where injection attacks ride in. The audit reads your repository and nothing else.

If you do these five things, the file your agent ingests is one you have seen, locked, fingerprinted, sourced from the right place, and pointed only at your own code.

## A note on what this page does not promise

Following this guidance keeps NONA from being the weak link. It does not make your application secure on its own, and it does not replace a professional penetration test (a hired expert who actively tries to break into your app) for an app that handles money, many users, irreversible actions, or an AI agent acting on its own. The audit itself is a risk reducer, and the honest limits of what an AI review can catch are spelled out in `docs/why-nona-exists.md`. This page is narrower: it is about trusting the auditor's own instructions before you run them.

## Reporting a security problem

NONA has two parts, and they take two reporting paths.

For the protocol text itself (a weakness in its instructions, a way the protocol could be turned against an adopter, a tampered copy circulating somewhere): open an issue in the project repository. The protocol is plain text with no secret behavior, so most of these can be discussed openly, and every adopter benefits from the fix.

For the code that ships as a package (the `nona-mcp` server and the `nona-audit` installer): if you find a vulnerability that should stay private until it is fixed, report it through GitHub Private Vulnerability Reporting on the repository (the Security tab, "Report a vulnerability"). That opens a private advisory visible only to you and the maintainer.

Response commitment for a solo-maintained project: acknowledgement within 7 days, and a fix or a published mitigation targeted within 90 days of a confirmed report. Supported version: the latest release. In either path, describe what you found and how to reproduce it.
