#!/usr/bin/env node
/*
  NONA drift-check. Guards the single sources of truth so the distilled
  artifacts cannot quietly diverge. Run: node scripts/check-drift.mjs
  Exit 0 = consistent, exit 1 = drift found (with a list).
*/
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { DOMAINS } from "../mcp/gate.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const problems = [];
const ok = [];
const check = (cond, fail, pass) => { if (cond) { if (pass) ok.push(pass); } else { problems.push(fail); } };
const read = (p) => existsSync(join(root, p)) ? readFileSync(join(root, p), "utf8") : null;

// 1. The AGENTS.md spine and its bundled copies must be identical.
const agents = read("AGENTS.md");
check(agents !== null, "AGENTS.md missing", "AGENTS.md present");
for (const copy of ["mcp/agents.md", "cli/templates/AGENTS.md"]) {
  const c = read(copy);
  if (c === null) continue; // copy not present yet is fine
  check(c === agents, copy + " differs from AGENTS.md (regenerate: cp AGENTS.md " + copy + ")", copy + " matches AGENTS.md");
}

// 1b. Other bundled copies must match their source.
for (const [copy, src] of [
  ["cli/templates/nona.mdc", "adapters/cursor/nona.mdc"],
  ["cli/templates/SKILL.md", "skills/nona-audit/SKILL.md"],
  ["cli/templates/reference/tiers.md", "skills/nona-audit/reference/tiers.md"],
  ["cli/templates/reference/stakes-signals.md", "skills/nona-audit/reference/stakes-signals.md"]
]) {
  const c = read(copy), s = read(src);
  if (c === null) continue;
  check(s !== null && c === s, copy + " differs from " + src + " (regenerate: cp " + src + " " + copy + ")", copy + " matches " + src);
}

// 2. The twelve domains must be consistent across gate.mjs, the web tool, and protocol/.
check(DOMAINS.length === 12, "mcp/gate.mjs DOMAINS is not 12 (" + DOMAINS.length + ")", "gate.mjs has 12 domains");

// Text-based consistency check (no eval): every domain in gate.mjs must
// appear, by letter and English name, in the web tool's data file.
const nonaSrc = read("assets/data/nona.js") || "";
const webDomainCount = (nonaSrc.match(/letter:\s*"/g) || []).length;
check(webDomainCount === 12, "assets/data/nona.js does not declare 12 domains (found " + webDomainCount + ")", "web tool declares 12 domains");

DOMAINS.forEach((d) => {
  check(nonaSrc.includes('letter: "' + d.letter + '"'), "domain " + d.letter + " letter not found in assets/data/nona.js");
  check(nonaSrc.includes('en: "' + d.name + '"'), "domain " + d.letter + " name \"" + d.name + "\" not found in assets/data/nona.js (name drift vs gate.mjs)");
  check(existsSync(join(root, "protocol", d.file)), "protocol/" + d.file + " missing (referenced by gate.mjs)");
});
check(problems.filter(p => p.startsWith("domain")).length === 0, null, "12 domain letters + names match across gate.mjs and the web tool, and every referenced protocol file exists");

// 3. The cross-cutting protocol files must exist.
for (const f of ["00-overview.md", "01-stakes-gating.md", "02-circularity-guard.md"]) {
  check(existsSync(join(root, "protocol", f)), "protocol/" + f + " missing", "protocol/" + f + " present");
}

// 4. The English spine must reference every one of the twelve domain files.
//    AGENTS.md is hand-distilled from protocol/ (not machine-generated, on purpose:
//    the spine is a careful compaction that a transform would degrade). This guards
//    the one mechanical invariant a distillation must still hold: no domain silently
//    drops out of the spine when gate.mjs and protocol/ evolve.
const agentsTxt = agents || "";
DOMAINS.forEach((d) => {
  check(agentsTxt.includes("protocol/" + d.file), "AGENTS.md does not reference protocol/" + d.file + " (domain " + d.letter + " dropped from the spine)");
});
check(problems.filter(p => p.startsWith("AGENTS.md does not reference")).length === 0, null, "AGENTS.md references all 12 domain files");

// 5. The Indonesian mirror must stay in structural parity with the English tree.
//    Bilingual coverage is a deliberate surface; a protocol file added to English
//    must not silently leave id/ behind, and an id/ file must not orphan (point at
//    an English file that no longer exists). This checks structure, not translation
//    content (that is a human review), but structure is where silent drift hides.
const MIRROR_ROOT_FILES = ["AGENTS.md", "CITATIONS.md", "CONTRIBUTING.md", "README.md", "SECURITY.md"];
const MIRROR_DIRS = ["protocol", "adapters", "commands", "docs", "skills"];
const walk = (abs, relBase) => {
  if (!existsSync(abs)) return [];
  return readdirSync(abs, { recursive: true })
    .map((f) => String(f).split(/[\\/]/).join("/"))
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdc"))
    .map((f) => relBase + "/" + f);
};
if (existsSync(join(root, "id"))) {
  // 5a. Every English mirrored file has an id/ counterpart.
  const enMirror = [
    ...MIRROR_ROOT_FILES,
    ...MIRROR_DIRS.flatMap((d) => walk(join(root, d), d))
  ];
  enMirror.forEach((rel) => {
    check(existsSync(join(root, "id", rel)), "id/" + rel + " missing (English " + rel + " has no Indonesian counterpart)");
  });
  // 5b. Every id/ file maps back to an English file (no orphan translation).
  walk(join(root, "id"), "").map((f) => f.replace(/^\//, "")).forEach((rel) => {
    check(existsSync(join(root, rel)), "id/" + rel + " is an orphan (no English " + rel + " to mirror)");
  });
  check(problems.filter(p => p.includes("Indonesian counterpart") || p.includes("orphan")).length === 0, null, "English and Indonesian trees are in structural parity");
}

// Report.
if (problems.length) {
  console.error("DRIFT FOUND:\n - " + problems.join("\n - "));
  process.exit(1);
}
console.log("drift-check OK\n - " + ok.join("\n - "));
