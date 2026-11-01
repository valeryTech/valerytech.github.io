#!/usr/bin/env bash
set -euo pipefail

# Check that the host has what the Docker workflow needs and nothing it installs.
# With --fix, remove packages, environments and caches that tools left in the checkout.

source "$(dirname "$0")/lib.sh"

ROOT="$(repo_root)"
FIX=0
PROBLEMS=0

case "${1:-}" in
  --fix) FIX=1 ;;
  "") ;;
  *) fail "usage: bash scripts/check-host.sh [--fix]" ;;
esac

problem() {
  printf '[site] problem: %s\n' "$*" >&2
  PROBLEMS=$((PROBLEMS + 1))
}

# Removable leftovers: report them, or delete them with --fix.
leftover() {
  local path="$1" reason="$2"
  if [[ "$FIX" -eq 1 ]]; then
    rm -rf "$path"
    log "Removed ${path#"$ROOT"/} ($reason)"
  else
    problem "${path#"$ROOT"/} exists ($reason); run task repo:doctor -- --fix"
  fi
}

cd "$ROOT"

for tool in docker git curl task; do
  command -v "$tool" >/dev/null || problem "$tool is not installed"
done

if command -v docker >/dev/null; then
  docker compose version >/dev/null 2>&1 || problem "docker compose is unavailable"
  docker info >/dev/null 2>&1 || problem "Docker daemon is not reachable; start OrbStack with orb start"
fi

[[ -n "$(ls -A themes/hextra 2>/dev/null)" ]] ||
  problem "Hextra submodule is not checked out; run task repo:init"

# node_modules is the mount point for the Docker volume, so the host side stays empty.
# Empty it in place: a running container may hold the directory as its mount point.
if [[ -d node_modules ]] && [[ -n "$(ls -A node_modules)" ]]; then
  if [[ "$FIX" -eq 1 ]]; then
    find node_modules -mindepth 1 -delete
    log "Emptied node_modules (host npm install)"
  else
    problem "node_modules has host-installed packages; run task repo:doctor -- --fix"
  fi
fi

if [[ -e .venv ]]; then
  leftover "$ROOT/.venv" "host Python environment; uv uses the valerytech-uv-venv volume"
fi
if [[ -e .migration/.venv ]]; then
  leftover "$ROOT/.migration/.venv" "former uv environment location"
fi

for lockfile in yarn.lock pnpm-lock.yaml; do
  if [[ -e "$lockfile" ]]; then
    problem "$lockfile exists; the repository is npm-only"
  fi
done

while IFS= read -r -d '' cache; do
  leftover "$cache" "Python bytecode cache"
done < <(find . \( -path ./themes -o -path ./.git -o -path ./node_modules \) -prune -o -type d -name __pycache__ -print0)

if [[ "$PROBLEMS" -gt 0 ]]; then
  fail "$PROBLEMS problem(s) found"
fi
log "Host is ready: tools present, no host installs in the checkout"
