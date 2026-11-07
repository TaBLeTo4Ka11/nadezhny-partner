#!/usr/bin/env bash
set -euo pipefail

if ! command -v claude >/dev/null 2>&1 && ! command -v npx >/dev/null 2>&1; then
  echo "Node.js/npm are unavailable in this Codespace. Rebuild the container and try again."
  exit 1
fi

echo "RelayModels → Claude Fable 5.1"
echo "API key is read silently and is not written to this repository."
read -r -s -p "Paste your RelayModels API key, then press Enter: " RELAY_API_KEY
printf '\n'

if [[ -z "${RELAY_API_KEY//[[:space:]]/}" ]]; then
  echo "No key was entered. Nothing was started."
  exit 1
fi

export ANTHROPIC_BASE_URL="https://api.relaymodels.com/v1"
export ANTHROPIC_AUTH_TOKEN="$RELAY_API_KEY"
export ANTHROPIC_MODEL="claude-fable-5-1"
export ANTHROPIC_DEFAULT_OPUS_MODEL="claude-fable-5-1"
export ANTHROPIC_DEFAULT_SONNET_MODEL="claude-fable-5-1"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="claude-fable-5-1"

unset RELAY_API_KEY
echo "Starting Claude Code in plan mode. It should inspect first and ask before edits."

if command -v claude >/dev/null 2>&1; then
  exec claude --model claude-fable-5-1 --permission-mode plan
else
  exec npx --yes @anthropic-ai/claude-code --model claude-fable-5-1 --permission-mode plan
fi
