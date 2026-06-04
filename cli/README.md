# nona-audit (CLI)

Install the NONA (Non-Coder Audit) protocol into your project with one command. No dependencies.

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

## License

MIT (this is code). The protocol text it installs is CC BY 4.0. See the repo root.
