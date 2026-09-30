# freeload — code with AI for $0

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/lastknownstar-bot/freeload?style=social)](https://github.com/lastknownstar-bot/freeload/stargazers)
[![Last commit](https://img.shields.io/github/last-commit/lastknownstar-bot/freeload)](https://github.com/lastknownstar-bot/freeload/commits/master)
[![Free models](https://img.shields.io/badge/models-16%20free-brightgreen)](freeload.json)

**Route every subtask to a free model. Never spend a dollar unless you say so.**

> **Works with:** OpenCode · Claude Code · Codex · Cursor — any agent that loads `SKILL.md`.
> **Costs:** $0 — OpenRouter `:free` models · Pollinations (no key) · OpenCode Zen free · Gemini free tier · local Ollama.
> **Deps:** none — one JSON file, one dependency-free Node script.

Coding agents burn money because they use one expensive model for everything — including writing session titles. freeload fixes that with a simple idea: classify each subtask (`plan` / `code` / `edit` / `chat`), send it to the strongest **free** model that can handle it, and auto-failover to the next free model on quota errors.

```
you: "add dark mode"
agent: plan  → nemotron-3-ultra-550B (free)      $0.00
agent: code  → nemotron-3-super-120B (free)      $0.00
agent: edit  → gemma-4-26B (free)                $0.00
agent: title → pollinations gpt-oss (free)       $0.00
                                            total $0.00
```

## Install (30 seconds)

```bash
git clone https://github.com/lastknownstar-bot/freeload.git
cd freeload && ./install.sh   # or install.ps1 on Windows
```

This copies `SKILL.md` into your agent skills dir (OpenCode, Claude Code, Codex, Cursor, …) — no dependencies, no API keys beyond the provider logins you already have.

Or try the router right now with nothing installed:

```bash
node bin/freeload.mjs route plan     # → strongest free model for planning
node bin/freeload.mjs route chat     # → cheapest free model for trivia
node bin/freeload.mjs models         # → full routing table
node bin/freeload.mjs doctor         # → verify setup
```

## How it works

1. **Classify** — every subtask is one of four classes: `plan`, `code`, `edit`, `chat`.
2. **Route** — `freeload.json` holds ordered chains of verified-free models per class, strongest first.
3. **Failover** — on `429` / quota / rate-limit / no-tool-support errors, advance down the chain. Never retry the same model twice. Exhausted chain? Drop one class level and continue.
4. **Escalate never (by default)** — paid models require explicit user approval, announced with model + reason + estimated cost.

Works with any free tier: OpenRouter `:free` models, Pollinations (no key), OpenCode Zen free models, Gemini free tier, local Ollama.

## The free fleet (verified 2026-09-30)

| Class | Chain (strongest → cheapest, all $0) |
|---|---|
| `plan` | nemotron-3-ultra-550B → inkling → qwen3.8-27B → big-pickle |
| `code` | nemotron-3-super-120B → qwen3.8-27B → north-mini-code → gemma-4-31B → big-pickle |
| `edit` | nemotron-3.5-lightning → gemma-4-26B → lfm-2.5 → pollinations gpt-oss |
| `chat` | pollinations gpt-oss → big-pickle → lfm-2.5 |

Free tiers change constantly — run `freeload doctor` and check the OpenRouter `:free` catalog when something 404s. PRs updating `freeload.json` welcome.

## Why this exists

A coding session easily burns $2–10 in tokens, half of it on work a free 12B model could do. The expensive models are only needed for the hardest 10% of subtasks. freeload makes the cheap path the default path.

## License

MIT — see [LICENSE](LICENSE).
