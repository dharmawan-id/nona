/*
  NONA stakes-gate + audit-prompt builder.
  Single source of the gate logic for the MCP server (mirrors the protocol's
  01-stakes-gating and the in-browser scoper). Pure functions, no dependencies.
*/

export const DOMAINS = [
  { letter: "A", name: "Intent", blurb: "does the code do only what you asked, safely", file: "a-intent.md" },
  { letter: "B", name: "Secrets, access, auth", blurb: "keys hidden, each user reaches only their own data", file: "b-secrets-access-auth.md" },
  { letter: "C", name: "Input & injection", blurb: "clean outside input, including prompt injection", file: "c-input-injection.md" },
  { letter: "D", name: "Data & privacy", blurb: "personal data stored, kept from leaking, deletable", file: "d-data-privacy.md" },
  { letter: "E", name: "Payments & AI cost", blurb: "charge correctly, block billing tricks, cap runaway AI spend", file: "e-payments-ai-cost.md" },
  { letter: "F", name: "AI-code & circularity", blurb: "the same AI wrote and audits the code; rebuild the fresh eyes", file: "f-ai-code-circularity.md" },
  { letter: "G", name: "Dependencies & supply chain", blurb: "every package real, locked, no known holes (slopsquatting)", file: "g-dependencies-supply-chain.md" },
  { letter: "H", name: "Config & deploy", blurb: "no default creds, no secret in the bundle, safety headers", file: "h-config-deploy.md" },
  { letter: "I", name: "Ops, uptime, backup", blurb: "notice breakage, fail safe, recover and roll back", file: "i-ops-uptime-backup.md" },
  { letter: "J", name: "Architecture", blurb: "sound trust boundaries, damage kept contained", file: "j-architecture.md" },
  { letter: "K", name: "Pen-test & review", blurb: "what a real attack tests, and the honest ceiling of AI-on-AI", file: "k-pentest.md" },
  { letter: "L", name: "Decide & act", blurb: "rank by business risk, and when to hire a human", file: "l-decide-and-act.md" }
];

const SIGTEXT = {
  S1: "real money flows through it",
  S2: "people log in (accounts, roles)",
  S3: "it stores personal data",
  S4: "an AI feature can act on its own without per-action approval",
  S5: "one failure would hit many people at once",
  S6: "it can take actions that cannot be undone",
  paidAI: "it calls a paid AI API in production"
};

const STACKNOTE = {
  supabase: "check Row Level Security (RLS) on every table and that the service_role key is never in the browser",
  vercel: "check no secret ships in a NEXT_PUBLIC_ variable and that security headers are set",
  payments: "verify every payment webhook signature, re-check amount and status against your own database, and make it idempotent",
  indonesia: "apply the UU PDP minimal set (consent, deletion path, 72-hour breach notice, cross-border consent) and PSE registration"
};

const REPO = "https://github.com/dharmawan-id/nona";

function rank(x) { return x === "extra-mile" ? 3 : x === "standard" ? 2 : 1; }
function up(a, b) { return rank(a) >= rank(b) ? a : b; }
function count(s) { let n = 0; ["S1", "S2", "S3", "S4", "S5", "S6"].forEach(k => { if (s[k]) n++; }); return n; }

export function tierFor(letter, s) {
  const F = "floor", S = "standard", X = "extra-mile"; let tr = F;
  switch (letter) {
    case "A": tr = F; if (s.S1 || s.S2) tr = up(tr, S); if (s.S4 || s.S6) tr = up(tr, X); return tr;
    case "B": if (!(s.S2 || s.S3 || s.S4 || s.S5)) return F; tr = S; if (s.S2 && (s.S3 || s.S5)) tr = X; if (s.S4) tr = X; return tr;
    case "C": tr = F; if (s.S3) tr = up(tr, S); if (s.S4) tr = X; return tr;
    case "D": if (!(s.S3 || s.S1 || s.S6)) return F; tr = S; if (s.S5 && (s.S1 || s.S6)) tr = X; return tr;
    case "E": tr = (s.S1 || s.S6) ? S : F; if ((s.S1 || s.S6) && s.S5) tr = X; return tr;
    case "F": tr = F; if (s.S1 || s.S3 || s.S6) tr = up(tr, S); if (s.S4) tr = X; return tr;
    case "G": tr = F; if (s.S5) tr = up(tr, S); if (s.S5 && (s.S1 || s.S6)) tr = X; if (s.S4) tr = X; return tr;
    case "H": tr = F; if (s.S3) tr = up(tr, S); if ((s.S1 || s.S3) && s.S5) tr = X; return tr;
    case "I": tr = F; if (s.S5 || s.S1 || s.S3) tr = up(tr, S); if (s.S5 && count(s) >= 2) tr = X; if (s.S4) tr = X; return tr;
    case "J": tr = F; if (s.S5 || s.S1 || s.S6) tr = up(tr, S); if (s.S5) tr = up(tr, X); if (s.S4) tr = X; return tr;
    case "K": tr = (s.S2 || s.S1 || s.S3) ? S : F; if ((s.S1 || s.S3) && s.S5) tr = X; if (s.S4) tr = X; return tr;
    case "L": tr = (s.S1 || s.S2 || s.S3 || s.S5) ? S : F; if ((s.S3 && s.S5) || count(s) >= 3) tr = X; return tr;
  }
  return F;
}

function hireVerdict(s) {
  if (s.S4) return "Yes. An AI that can act on its own needs an independent human review before you trust it in production.";
  if ((s.S1 && s.S5) || (s.S6 && (s.S1 || s.S5))) return "Yes. Money or irreversible actions at scale warrant an independent human pen-test before launch.";
  if (s.S1 || s.S2 || s.S3 || s.S5 || s.S6) return "Not yet, but plan one. Run this audit now; at real scale, pay for an independent human review.";
  return "Probably not yet. Your stakes are low: run the floor and ship. Re-scope when money, logins, or many users arrive.";
}

// scopeAudit(stakes, opts) -> { tiers, prompt, hire, text }
export function scopeAudit(stakes, opts = {}) {
  const s = stakes || {};
  const stack = (opts.stack || []).filter(x => STACKNOTE[x]);
  const present = ["S1", "S2", "S3", "S4", "S5", "S6", "paidAI"].filter(k => s[k]);
  const stakesLine = present.length ? present.map(k => SIGTEXT[k]).join("; ") : "no high-stakes signals";
  const tiers = DOMAINS.map(d => ({ letter: d.letter, name: d.name, tier: tierFor(d.letter, s) }));
  const tierLines = tiers.map(t => "  " + t.letter + " " + t.name + ": " + t.tier).join("\n");
  const notes = stack.map(x => "- " + STACKNOTE[x]);
  if (s.paidAI) notes.push("- a paid AI API runs in production, so cap spend on day one (a hard total cap and a per-user rate limit) and watch usage");
  const notesBlock = notes.length ? ("\nStack-specific checks:\n  " + notes.join("\n  ")) : "";

  const prompt =
    "Run a NONA audit on this codebase. The protocol is at " + REPO + " (read AGENTS.md in the repo, or copy AGENTS.md into this project).\n\n" +
    "What is at stake in this app: " + stakesLine + ".\n\n" +
    "Audit these domains at these tiers:\n" + tierLines + notesBlock + "\n\n" +
    "Rules: run this in a clean, fresh context (ideally a different AI model than the one that built this app); produce artifacts, not verdicts; output a findings table with the columns Severity | Business risk in plain words | Evidence artifact | Citation | Suggested fix; mark any check you cannot evidence as INCOMPLETE; finish with Domain L: rank findings by business risk and give an explicit when-to-hire-a-human verdict. Start with the highest-tier domains.";

  const hire = hireVerdict(s);
  const text =
    "NONA audit scope\n================\n\n" +
    "What is at stake: " + stakesLine + ".\n\n" +
    "Rigor per domain:\n" + tierLines + "\n\n" +
    "When to hire a human: " + hire + "\n\n" +
    "----- paste this into your coding agent -----\n\n" + prompt;

  return { tiers, prompt, hire, text };
}
