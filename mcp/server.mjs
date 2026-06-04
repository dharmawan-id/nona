#!/usr/bin/env node
/*
  NONA MCP server. Exposes the Non-Coder Audit protocol to any MCP-capable
  coding agent: read the protocol spine, list the domains, scope an audit
  from what is at stake, and get a per-domain rigor plan plus a ready-to-paste
  audit prompt. stdio transport, no network, no telemetry.
*/
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { DOMAINS, scopeAudit } from "./gate.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const REPO = "https://github.com/dharmawan-id/nona";
function load(name) { try { return readFileSync(join(here, name), "utf8"); } catch { return ""; } }
const AGENTS = load("agents.md");

const server = new McpServer({ name: "nona", version: "0.1.0" });

server.tool(
  "nona_overview",
  "Return the full NONA (Non-Coder Audit) protocol spine: how to run the audit, the twelve domains, the three rigor tiers, the stakes-gate, the circularity guard (run in a clean context, ideally a different model), and the honest limits. Read this first before auditing an app the user built with an AI tool but cannot read.",
  {},
  async () => ({ content: [{ type: "text", text: AGENTS || ("The NONA protocol spine is at " + REPO + "/blob/main/AGENTS.md") }] })
);

server.tool(
  "nona_list_domains",
  "List the twelve NONA audit domains (A to L), each with a one-line description.",
  {},
  async () => ({ content: [{ type: "text", text: DOMAINS.map(d => d.letter + ". " + d.name + ": " + d.blurb).join("\n") }] })
);

server.tool(
  "nona_scope_audit",
  "Scope a NONA audit for one app. Given what is at stake, return the rigor tier (floor, standard, or extra-mile) for each of the twelve domains, an explicit when-to-hire-a-human verdict, and a ready-to-paste audit prompt scaled to the real risk. Pass true only for what applies; everything defaults to not present.",
  {
    money: z.boolean().optional().describe("payments, billing, payouts, or credits worth real cash"),
    login: z.boolean().optional().describe("accounts, sessions, password reset, or roles"),
    personalData: z.boolean().optional().describe("stores personal data (names, emails, phones, health, messages)"),
    autonomousAI: z.boolean().optional().describe("an AI feature can act on its own without per-action approval"),
    manyUsers: z.boolean().optional().describe("many users, multi-tenant, or a public API (blast radius)"),
    irreversible: z.boolean().optional().describe("can take actions that cannot be undone"),
    paidAI: z.boolean().optional().describe("calls a paid AI API in production"),
    stack: z.array(z.enum(["supabase", "vercel", "payments", "indonesia"])).optional().describe("optional: tailors the checks to the stack")
  },
  async (a) => {
    const s = { S1: !!a.money, S2: !!a.login, S3: !!a.personalData, S4: !!a.autonomousAI, S5: !!a.manyUsers, S6: !!a.irreversible, paidAI: !!a.paidAI };
    const r = scopeAudit(s, { stack: a.stack || [] });
    return { content: [{ type: "text", text: r.text }] };
  }
);

server.tool(
  "nona_get_domain",
  "Get the summary and the link to the full protocol file for one NONA domain, by its letter (A to L).",
  { letter: z.string().describe("a domain letter, A to L") },
  async (a) => {
    const L = String(a.letter || "").trim().toUpperCase().slice(0, 1);
    const d = DOMAINS.find(x => x.letter === L);
    if (!d) return { content: [{ type: "text", text: "Unknown domain. Use a letter A to L. " + DOMAINS.map(x => x.letter).join(", ") }] };
    return { content: [{ type: "text", text: d.letter + ". " + d.name + "\n" + d.blurb + "\n\nFull protocol file: " + REPO + "/blob/main/protocol/" + d.file }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
