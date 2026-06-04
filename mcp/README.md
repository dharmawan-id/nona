# NONA MCP server

Run NONA (Non-Coder Audit) as an MCP server, so any MCP-capable coding agent (Claude Code, Cursor, and others) can pull the audit protocol and scope an audit on demand, without you copying any files into your project.

It is a small stdio server. It makes no network calls and sends no telemetry. It only returns the protocol and the audit plan it computes locally.

## What it gives your agent

Four tools:

- `nona_overview`: the full protocol spine: how to run the audit, the twelve domains, the three rigor tiers, the stakes-gate, the circularity guard, and the honest limits. Your agent reads this first.
- `nona_list_domains`: the twelve domains (A to L), one line each.
- `nona_scope_audit`: you tell it what is at stake (money, login, personal data, an autonomous AI, many users, irreversible actions, a paid AI API, and optionally your stack), and it returns the rigor tier for each domain, a when-to-hire-a-human verdict, and a ready-to-paste audit prompt scaled to the real risk.
- `nona_get_domain`: the summary and the link to the full protocol file for one domain.

## Install

### From npm (once published)

Add this to your MCP client config (for Claude Code, `claude mcp add` or the `mcpServers` block; for Cursor, `.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "nona": { "command": "npx", "args": ["-y", "nona-mcp"] }
  }
}
```

### From source (works now, before publishing)

Clone the repo, install once, and point your client at the server file:

```bash
git clone https://github.com/dharmawan-id/nona
cd nona/mcp && npm install
```

```json
{
  "mcpServers": {
    "nona": { "command": "node", "args": ["/absolute/path/to/nona/mcp/server.mjs"] }
  }
}
```

## A note on trust

NONA is itself an instruction set an agent ingests, the exact file class attackers target. This server only reads its own bundled protocol and returns text; it never tells your agent to fetch and run anything from the internet, and it asks for nothing about your code. Read `server.mjs` and `gate.mjs` before you trust them. The protocol's own self-defense guidance is in the repo's `SECURITY.md`.

## License

CC-BY-4.0, the same as the protocol. The `agents.md` in this folder is a bundled copy of the repo's `AGENTS.md`; regenerate it with `cp ../AGENTS.md agents.md` when the protocol changes.
