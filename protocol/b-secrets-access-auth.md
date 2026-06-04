# Domain B: Secrets, Access, RLS, IDOR, Auth

## What this is

This is the security core: who is allowed to see what, who is allowed to do what, and where the keys to your app are kept. Three things have to hold. The right person gets in and the wrong person does not (authentication, often shortened to auth). Once in, each person can reach only their own data and only the actions meant for their role (authorization). And the master keys that unlock your database and your paid services are never handed to the public.

An AI tool will build you a login screen that looks finished and a database that returns the right rows when you test it as yourself. None of that proves the locks work. The screen can hide a button while the action behind it stays wide open. The database can return your rows correctly and still return everyone else's rows to anyone who asks for them by number. This is the domain where the gap between "it worked when I tried it" and "it is actually locked" is widest, and it is the gap a non-coder cannot see from the outside.

## What you can't see here

You logged in, you saw your own dashboard, your own orders, your own profile. It all matched. What you could not see is what a stranger sees, because you were never the stranger. You tested the app as its owner, and the owner has the keys, so every door opened. The question that matters is the one you cannot run from your own seat: what happens when someone who is not you, or someone who is a basic user pretending to be an admin, knocks on the same door directly.

Two specific blind spots dominate here, and both are invisible from the happy path.

The first is **IDOR**, short for Insecure Direct Object Reference. In plain terms: your app shows you your invoice at an address like `/invoice/1041`, and a stranger simply changes the number to `/invoice/1042` and reads someone else's invoice. The page looked perfectly secure to you because your number returned your data. The lock was never on the door; it was on the menu. You only saw the menu.

The second is the **secret in the wrong place**. An AI tool, wiring your app to its database or its payment provider, will sometimes embed the all-powerful key directly into the part of the app that ships to the visitor's browser, where anyone can read it by opening developer tools. With that key a stranger does not need to break your locks. They hold the master copy. A production scan of 5,600 apps built with AI tools found more than 400 exposed secrets sitting in public, alongside more than 2,000 vulnerabilities and 175 leaks of personal data, and the scanners called those counts a lower bound because they only looked at what was reachable without logging in (Escape.tech, 29 October 2025). The keys were not hidden. They were in the front window.

There is a measured reason this is the class that slips through. When tools were tested on realistic tasks, they had mostly learned to avoid the textbook injection bugs, and they kept failing at authorization and business-logic flaws, the ones that need an understanding of who is allowed to do what in your specific app (Tenzai assessment, reported January 2026; SUSVIBES, Zhao et al., arXiv:2512.03262). Authorization is exactly the kind of rule that has no general answer the model can copy. It depends on your app's idea of "mine" and "theirs," and that is the part the model guesses at and the part you cannot check by clicking around as yourself.

## When this matters (stakes signals)

This domain is the access-and-identity surface of your app, so the moment your app has any login at all, the signal that drives this domain is already present. That makes the floor for this domain non-negotiable for almost every real app, and it pushes the depth up quickly.

- **S2 Identity/Auth** (login, sessions, password reset, roles) is the defining signal here. If your app has any of these, this domain runs at STANDARD at minimum. Confirming that the locks actually hold is competent-team baseline the moment a lock exists.
- **S3 Personal data** (the app stores PII: emails, phone numbers, names, health details, private messages) on this surface, combined with the login signal above, pushes this domain to EXTRA-MILE. Access control that fails when it is guarding real people's data is the difference between a bug and a breach notification.
- **S5 Blast radius** (many users, multiple separate customers sharing one system, a public API) combined with the login signal pushes this domain to EXTRA-MILE. An access hole on a shared, multi-customer system leaks everyone at once, not just one account.
- **S6 Irreversibility** (an action here cannot be undone: delete, transfer, publish) raises the stakes of a missing authorization check, because the wrong person doing the wrong action leaves no way back.

There is a hard override that sits above the count. **If an AI agent in your app can take actions on its own without a human approving each one (S4), this domain is forced to EXTRA-MILE regardless of anything else.** An autonomous agent runs with whatever access it was given, and if that access is too broad or the keys are reachable, a tricked or confused agent acts on them before anyone can intervene. For an app with an autonomous agent, the extra-mile checks below are mandatory, not optional.

If your app genuinely has no login, no roles, no personal data, and no agent acting on its own, then there is little access to control, and this domain collapses to the floor: keep your keys out of the browser and out of your code history, and confirm nothing sensitive is reachable without a check. Do not build a permission fortress around an app that has nothing to permit.

## Floor checks

Never skip these, on any app that holds a key or has a single protected thing.

| Check | Why it matters to your business | Evidence the agent must produce | Citation |
|---|---|---|---|
| List every secret the app uses (database keys, payment-provider keys, API tokens, signing secrets) and, for each, state exactly where it lives. Confirm not one of them appears in code that ships to the browser, in a `NEXT_PUBLIC_`-prefixed variable, or anywhere in the committed code history. | A secret in the browser is a secret in public. Anyone who opens the page can copy your database key and read or wipe your data without breaking a single lock, and a key committed to your code history stays readable even after you delete it from the latest version. This is the single most common way an AI-built app is breached. | A secret inventory: every secret the app uses, its location, and a per-secret verdict of "server-side only" or "EXPOSED" (in client bundle, in a public variable, or in git history), with the exposed ones flagged for immediate rotation. | Supabase production essentials (service_role key never client-side); OWASP Top 10:2025 A07 Authentication Failures |
| Confirm the database has Row Level Security turned on for every table that holds data, and that a default-deny rule is in place so a table with no explicit policy returns nothing rather than everything. Row Level Security (RLS) is the database feature that restricts each row to the user who owns it. | Without RLS on, your database trusts the app to be careful, and one missed check anywhere means the database hands any logged-in person (or in the worst case, anyone at all) every row in the table. Turning RLS on makes the database itself refuse to leak, even when the app code slips. A single table left without it is a single open drawer in a locked cabinet. | An RLS coverage table: every table in an exposed schema listed, each marked RLS-enabled or RLS-OFF, with the off ones flagged, plus confirmation that a table with no policy denies by default. | Supabase Row Level Security docs (enable RLS on all tables in exposed schemas) |
| Pick the records a user owns (their orders, their profile, their files) and confirm the app checks ownership on the server before returning or changing one, so changing the ID in the web address to someone else's number is refused. This is the IDOR check. | This is the "change the number and read a stranger's invoice" hole stated plainly. If the only thing standing between a customer and everyone else's records is which number they type, you do not have a lock, you have a suggestion. Catching this on the floor is what keeps a curious user from becoming an accidental data thief. | An ownership-check result: for each kind of user-owned record, the exact server-side location where ownership is verified, or a flag that the record can be reached by ID with no ownership check (a live IDOR hole). | OWASP Top 10:2025 A01 Broken Access Control (includes IDOR); OWASP API Security Top 10 2023 API1 Broken Object Level Authorization (BOLA) |
| Confirm that protected pages and actions actually require a valid login on the server, not merely a redirect in the browser, and that the session check cannot be skipped by calling the underlying address directly. | A login wall enforced only by the browser is a wall with a door around the side. If the page redirects unauthenticated visitors but the data-loading address behind it answers anyone, the wall is decoration. The server, not the screen, has to be the thing that says no. | A protected-route map: each protected page or action, and evidence the server rejects an unauthenticated request to it, or a flag where only the browser blocks access. | OWASP Top 10:2025 A07 Authentication Failures; OWASP API Security Top 10 2023 API2 Broken Authentication |

## Standard checks

A competent team does these. Run them on this domain's surface when your app has login, roles, or any protected data, per the stakes signals above.

| Check | Why it matters to your business | Evidence the agent must produce | Citation |
|---|---|---|---|
| Build the authorization map: list every protected action and piece of data, the role or ownership rule that should govern it, and the exact server-side location where that rule is enforced. Then look for the gaps where the rule is assumed but never written. | This is the map you cannot draw by clicking, and it is the one that catches the holes. Authorization failures are the dominant class AI tools leave behind, precisely because the rule lives in your head, not in any standard the model could copy. Writing the map down is how an assumed rule that was never coded becomes visible before a stranger finds it for you. | An authorization map (object-level and function-level): every protected action and data type, its intended rule, the server location enforcing it, and any row where no enforcement exists, flagged. | OWASP API Security Top 10 2023 API1 BOLA and API5 Broken Function Level Authorization (BFLA); OWASP ASVS 5.0.0 Level 2 (authorization requirements, cited at document level) |
| Confirm that an admin-only action cannot be performed by a normal user who calls it directly. Find each privileged action (delete any user, change anyone's role, refund, export all data) and verify the server checks the caller's role, not just that the admin screen hides the button from non-admins. | Hiding the admin button from a normal user does nothing if the action behind it answers whoever calls it. This is how a basic account quietly promotes itself or deletes other people: the gate was on the menu, not the action. For any app with roles, this is the check between "staff only" and "anyone who knows the address." | A privileged-action list: each admin-only action, the server-side role check guarding it with its location, or a flag that the action runs without a role check (a live function-level authorization hole). | OWASP API Security Top 10 2023 API5 Broken Function Level Authorization (BFLA); OWASP Top 10:2025 A01 Broken Access Control |
| Check the RLS policies themselves for soundness, not just that they exist: confirm no policy decides access using data the user can change about themselves (such as a self-set role field), and that the policies match the ownership rules in the authorization map. | An RLS policy that trusts a value the user controls is a lock whose key the user is allowed to recut. If "are you an admin" is read from a field the user can edit, a normal user edits it and the database lets them in, believing the policy. A policy that exists but trusts the wrong input is worse than visibly absent, because it looks done. | A policy-soundness review: each RLS policy, the input it bases its decision on, a verdict on whether that input is user-controllable, and any policy trusting user-supplied data flagged. | Supabase Row Level Security docs (do not trust user-supplied metadata in policies); OWASP Top 10:2025 A01 Broken Access Control |
| Verify session and credential handling holds up: sessions expire and can be revoked, password reset cannot be used to take over an account, and login resists automated guessing through rate limiting or lockout. | A login that never forgets a session, or a password-reset flow a stranger can aim at someone else's email, is a front door with a broken latch. Reset-flow takeover and unlimited password guessing are how accounts fall without any exotic attack. Sound session and reset handling is the difference between "they need the password" and "they need patience." | A session-and-credential report: how sessions expire and revoke, how the reset flow ties a reset to its true owner, and what limits repeated login attempts, with any missing control flagged. | OWASP Top 10:2025 A07 Authentication Failures; OWASP ASVS 5.0.0 Level 2 (authentication and session requirements, cited at document level) |

## Extra-mile checks

Frontier rigor. Even strong engineering teams treat these as extra, extended effort. Run them on this domain's surface only when the stakes gate forces it, as annotated.

| Check | Why it matters to your business | Evidence the agent must produce | Citation | Stakes gate + frontier pattern |
|---|---|---|---|---|
| Run a deliberate authorization red-team: for each protected record and action, actually attempt the access as the wrong user and as a lower-privileged user, and record what the server returns. Test the boundaries (one ID above and below your own, a different customer's ID, an admin action from a basic account) rather than reasoning about them. | Reading the code tells you what the lock is supposed to do. Trying the door tells you what it actually does, and on a system holding many people's data the difference is a breach you find versus a breach a stranger finds. An attempted-access log is proof the locks were tested against a real adversary's moves, not just read. | An access-attempt log: each protected target, the request made as an unauthorized or lower-privileged user, the server's actual response, and every case where forbidden data or actions came back, flagged as a confirmed hole. | OWASP API Security Top 10 2023 API1 BOLA, API5 BFLA; OWASP ASVS 5.0.0 Level 3 (cited at document level) | Forced by S3 (personal data) or S5 (blast radius) on this surface. Frontier pattern: adversarial authorization pen-test. |
| Constrain the app's database access to least privilege: confirm the app connects with the narrowest database role that still works, that the all-powerful key is used only in trusted server tasks that genuinely need it (never in request handlers that serve users), and that an autonomous agent is sandboxed so it cannot reach the master key or act outside a restricted set of permissions. Least privilege means giving each part only the minimum power it needs. | If every part of your app runs with the master key, then any single hole anywhere becomes a total breach, and any agent that gets tricked acts with unlimited power. Narrowing each part's access turns what would be a catastrophe into a contained incident. For an app where an agent acts on its own, this is the wall between "the agent misbehaved" and "the agent emptied the database." | A privilege map: each component and the database role or key it uses, a verdict that each uses the least privilege that works, the specific places the master key is invoked, and, if an agent acts autonomously, the sandbox and permission limits constraining it, with over-privileged components flagged. | Supabase production essentials (service_role key scope); OWASP Top 10:2025 A01 Broken Access Control | Forced by S4 (autonomous agent), which mandates sandboxing and least-privilege on this domain. Frontier pattern: least-privilege and agent sandboxing. |
| Add a prompt-injection red-team against any agent that holds access in your app: deliberately feed it hidden instructions (in user input, in data it reads, in a document it processes) that try to make it reveal a secret or use its access for something it should not, and confirm a control stops each attempt. Prompt injection is when text the agent reads smuggles in instructions that hijack what it does. | An autonomous agent with access is a new kind of insider, and a stranger can whisper to it through any text it reads. If a hidden instruction in an uploaded file can talk your agent into handing over a key or deleting records, you have given an attacker your agent's powers. Trying the trick yourself first, on paper and in practice, is the only way to know the agent refuses it. | An injection-attempt log: the hidden instructions tried against the agent, the access each tried to abuse, the agent's actual behavior, and the control that blocked or failed to block each, with every successful hijack flagged as residual risk. | OWASP Top 10 for LLM Applications 2025 LLM01 Prompt Injection and LLM06 Excessive Agency; OWASP Top 10:2025 A01 Broken Access Control | Forced by S4 (autonomous agent), which mandates a prompt-injection red-team on this domain. Frontier pattern: prompt-injection red-team. |

## When to stop and hire a human

Bring in an independent human reviewer for this domain when any of these are true:

- The authorization map or the access-attempt log shows a case where the wrong user reached data or an action they should not, and you cannot fully explain why or confirm the fix closed it. A confirmed access hole on a system holding real people's data is not a place to guess your way to "probably fixed."
- Your app stores personal data and serves many users or multiple separate customers (S3 with S5), and you cannot produce a clean, complete authorization map with a server-side enforcement location for every protected thing. Access control you cannot fully account for, on a shared system, is a breach waiting for the first curious visitor.
- An AI agent in your app can act on its own (S4) and you cannot demonstrate it runs with least privilege, is sandboxed away from the master key, and survives a prompt-injection attempt. An agent with broad access and no proven containment should not run unreviewed.
- A privileged action that cannot be undone (S6 combined with roles) can be triggered without a server-side role check you can point to. Permanent actions reachable by the wrong person earn a human pass before launch.

This protocol catches a meaningful slice of access and secret problems cheaply, and it is the right first pass for almost every app. It is not a guarantee, and an AI checking AI is weaker than an independent human review on exactly the authorization logic that matters most here, because that logic is specific to your app and has no general answer to copy. Domain K covers what a professional review adds and where its honest ceiling sits. For an app carrying real stakes on this domain, route there.

## Agent instructions

```
DOMAIN B: SECRETS, ACCESS, RLS, IDOR, AUTH

Scope by stakes (stakes are local to this domain's surface):
  If the app has login, sessions, roles, or any protected data (S2), run STANDARD here.
  If S2 combines with S3 (personal data) or S5 (blast radius) on this surface, run EXTRA-MILE.
  HARD OVERRIDE: if an AI agent can act on its own (S4), run EXTRA-MILE here regardless of
  the signal count, and the least-privilege/sandboxing check and the prompt-injection
  red-team are MANDATORY, not optional.
  If the app has no login, no roles, no personal data, and no autonomous agent, run FLOOR only:
  keep secrets out of the browser and git, confirm default-deny, do not build permission
  machinery for an app with nothing to permit.

Circularity note (see the circularity-guard protocol):
  Authorization is where same-context self-audit is weakest. The agent that wrote the access
  rules "knows the intended owner" and reads the code as confirming it, instead of attacking it
  as a stranger would. Run this domain in a CLEAN, fresh context with no access to the build
  rationale, and prefer a different model from the one that wrote the code. Treat every record
  and action as something to reach from an account that should NOT reach it.

Produce these artifacts (not verdicts):
  FLOOR:
    1. Secret inventory: every secret, its location, "server-side only" or "EXPOSED" (client
       bundle / NEXT_PUBLIC_ / git history), exposed ones flagged for rotation.
    2. RLS coverage table: every table in an exposed schema, RLS-enabled or RLS-OFF, default-deny
       confirmed, off tables flagged.
    3. Ownership-check result: per user-owned record type, the server location verifying ownership,
       or a flag that it is reachable by ID with no check (a live IDOR hole).
    4. Protected-route map: each protected page/action, evidence the SERVER rejects an
       unauthenticated request, or a flag where only the browser blocks it.
  STANDARD (login / roles / protected data):
    5. Authorization map (object-level + function-level): every protected action and data type,
       its intended rule, the server location enforcing it, gaps flagged.
    6. Privileged-action list: each admin-only action, its server-side role check and location,
       or a flag it runs with no role check.
    7. Policy-soundness review: each RLS policy, the input it decides on, whether that input is
       user-controllable, policies trusting user data flagged.
    8. Session-and-credential report: session expiry/revocation, reset-flow owner-binding, login
       rate limiting/lockout, missing controls flagged.
  EXTRA-MILE (personal data + scale, or autonomous agent):
    9. Access-attempt log: each protected target attempted as the wrong/lower-privileged user, the
       server's actual response, returned-forbidden-data cases flagged as confirmed holes.
    10. Privilege map: each component and the DB role/key it uses, least-privilege verdict, where
        the master key is invoked, and (if S4) the agent sandbox and permission limits;
        over-privileged components flagged.
    11. Injection-attempt log (if S4): hidden instructions tried against the agent, the access each
        targeted, the agent's actual behavior, the blocking control, successful hijacks flagged.

Output a findings table with these columns and nothing weaker than evidence:
  | Severity | Business risk in plain words | Evidence artifact | Citation | Suggested fix |

Rules:
  - Translate every finding into a concrete business consequence a non-coder understands
    (for example: "a stranger can open any other customer's invoice by changing the number in
    the address bar," not "IDOR present").
  - Cite only the controls named in this domain (A01, A07, API1, API2, API5, API6, LLM01, LLM06,
    Supabase RLS and production essentials, ASVS at document level). Do not invent IDs and do not
    print ASVS V-numbers beyond V1 1.2.5.
  - No bare verdicts. "Looks secure" is not a finding. Attach the artifact that proves the claim;
    a confident-looking verdict with no evidence manufactures false trust.
  - If you cannot produce an artifact a check demands, say so and mark that check INCOMPLETE.
```
