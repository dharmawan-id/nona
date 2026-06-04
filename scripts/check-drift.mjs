#!/usr/bin/env node
/*
  NONA drift-check. Guards the single sources of truth so the distilled
  artifacts cannot quietly diverge. Run: node scripts/check-drift.mjs
  Exit 0 = consistent, exit 1 = drift found (with a list).
*/
import { readFileSync, existsSync } from "node:fs";
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

// Report.
if (problems.length) {
  console.error("DRIFT FOUND:\n - " + problems.join("\n - "));
  process.exit(1);
}
console.log("drift-check OK\n - " + ok.join("\n - "));
