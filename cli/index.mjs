#!/usr/bin/env node
/*
  nona-audit: install the NONA (Non-Coder Audit) protocol into your project.
  Zero dependencies. Copies bundled templates into the right place.
*/
import { existsSync, mkdirSync, cpSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const T = join(here, "templates");
const cwd = process.cwd();
const args = process.argv.slice(2);
const cmd = (args[0] || "").toLowerCase();
const force = args.includes("--force");
const REPO = "https://github.com/dharmawan-id/nona";

function place(src, dest, label) {
  const d = join(cwd, dest);
  if (existsSync(d) && !force) { console.log("skipped: " + dest + " already exists (use --force to overwrite)"); return; }
  mkdirSync(dirname(d), { recursive: true });
  cpSync(join(T, src), d);
  console.log("added: " + dest + "  (" + label + ")");
}

function agents() { place("AGENTS.md", "AGENTS.md", "the protocol spine, read by most coding agents"); }
function cursor() { place("nona.mdc", ".cursor/rules/nona.mdc", "Cursor adapter"); }
function skill() {
  place("SKILL.md", ".claude/skills/nona-audit/SKILL.md", "Claude skill");
  place("reference/tiers.md", ".claude/skills/nona-audit/reference/tiers.md", "skill reference: tiers");
  place("reference/stakes-signals.md", ".claude/skills/nona-audit/reference/stakes-signals.md", "skill reference: stakes signals");
}

const help = [
  "nona-audit: install the NONA (Non-Coder Audit) protocol into your project.",
  "",
  "  npx nona-audit init      drop AGENTS.md into this folder (works with most coding agents)",
  "  npx nona-audit cursor    add the Cursor adapter (.cursor/rules/nona.mdc)",
  "  npx nona-audit skill     add the Claude skill (.claude/skills/nona-audit/)",
  "  npx nona-audit all       do all three",
  "  --force                  overwrite files that already exist",
  "",
  "Then open your coding agent and ask it to audit your app.",
  "Full protocol and the free audit scoper: " + REPO
].join("\n");

switch (cmd) {
  case "init": agents(); console.log("\nNext: open your agent and ask it to audit your app. For Cursor, run nona-audit cursor; for Claude, nona-audit skill."); break;
  case "cursor": cursor(); break;
  case "skill": skill(); break;
  case "all": agents(); cursor(); skill(); break;
  default: console.log(help);
}
