#!/usr/bin/env bash
set -euo pipefail

WORKDIR="${WORKDIR:-/workspace}"
LOCKFILE="$WORKDIR/package-lock.json"
NODE_MODULES="$WORKDIR/node_modules"
STAMP_FILE="$NODE_MODULES/.package-lock.sha256"

if [[ ! -f "$LOCKFILE" ]]; then
  echo "Missing package-lock.json in $WORKDIR" >&2
  exit 1
fi

mkdir -p "$NODE_MODULES"
cd "$WORKDIR"

current_hash="$(sha256sum "$LOCKFILE" | awk '{print $1}')"
installed_hash=""

if [[ -f "$STAMP_FILE" ]]; then
  installed_hash="$(<"$STAMP_FILE")"
fi

if [[ ! -f "$NODE_MODULES/.package-lock.json" || "$current_hash" != "$installed_hash" ]]; then
  npm ci
  printf '%s\n' "$current_hash" > "$STAMP_FILE"
fi

exec "$@"
