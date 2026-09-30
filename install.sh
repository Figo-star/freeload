#!/usr/bin/env bash
# freeload one-command installer: copies SKILL.md into known agent skills dirs.
set -euo pipefail
SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/SKILL.md"
targets=(
  "$HOME/.config/opencode/skills/freeload/SKILL.md"
  "$HOME/.claude/skills/freeload/SKILL.md"
  "$HOME/.codex/skills/freeload/SKILL.md"
)
installed=0
for t in "${targets[@]}"; do
  if [ -d "$(dirname "$(dirname "$t")")" ]; then
    mkdir -p "$(dirname "$t")"
    cp "$SRC" "$t"
    echo "installed: $t"
    installed=$((installed + 1))
  fi
done
if [ "$installed" -eq 0 ]; then
  echo "no agent skills dir found; manual install: copy SKILL.md to your agent's skills/freeload/ directory"
fi
node "$(dirname "${BASH_SOURCE[0]}")/bin/freeload.mjs" doctor
