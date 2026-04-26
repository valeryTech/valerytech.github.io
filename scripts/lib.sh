#!/usr/bin/env bash
set -euo pipefail

repo_root() {
  cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd
}

log() {
  printf '[site] %s\n' "$*"
}

fail() {
  printf '[site] %s\n' "$*" >&2
  exit 1
}
