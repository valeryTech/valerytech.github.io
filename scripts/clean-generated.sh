#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/lib.sh"

ROOT="$(repo_root)"

cd "$ROOT"
log "Removing generated site artifacts"
rm -rf public resources hugo_stats.json .hugo_build.lock
