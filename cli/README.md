# nona-audit (CLI)

[![npm version](https://img.shields.io/npm/v/nona-audit)](https://www.npmjs.com/package/nona-audit)
![node](https://img.shields.io/badge/node-%3E%3D18-brightgreen)
![license](https://img.shields.io/badge/license-MIT-blue)

Install the NONA (Non-Coder Audit) protocol into your project with one command. No dependencies.

Requirements: Node 18 or newer. Nothing else, no API key, no account.

## Use

```bash
npx nona-audit init      # drop AGENTS.md into this folder (works with most coding agents)
npx nona-audit cursor    # add the Cursor adapter (.cursor/rules/nona.mdc)
npx nona-audit skill     # add the Claude skill (.claude/skills/nona-audit/)
npx nona-audit all       # do all three
```

Add `--force` to overwrite files that already exist.

After installing, open your coding agent and ask it to audit your app. The agent reads `AGENTS.md` and runs the protocol. Nothing leaves your machine.

The templates in this package are copies of the repo's `AGENTS.md`, `adapters/cursor/nona.mdc`, and `skills/nona-audit/`. The repo's drift-check (`scripts/check-drift.mjs`) keeps them identical to the source.

## Support

- Questions or bugs: open an issue at [github.com/dharmawan-id/nona/issues](https://github.com/dharmawan-id/nona/issues).
- A security problem in the code: see [SECURITY.md](https://github.com/dharmawan-id/nona/blob/main/SECURITY.md) for the private reporting path.
- The full protocol and the reasoning behind each check live in the [main repository](https://github.com/dharmawan-id/nona).

## License

MIT (this is code). The protocol text it installs is CC BY 4.0. See the repo root.
