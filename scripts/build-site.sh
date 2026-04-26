#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/lib.sh"

ROOT="$(repo_root)"
MODE="${1:-auto}"

build_on_host() {
  cd "$ROOT"
  export HUGO_ENVIRONMENT="${HUGO_ENVIRONMENT:-production}"
  export HUGO_ENV="${HUGO_ENV:-production}"
  export TZ="${TZ:-Etc/UTC}"
  log "Running production build"
  npm run build
}

build_in_container() {
  cd "$ROOT"
  log "Running production build in Docker"
  docker compose run --rm \
    -e HUGO_ENVIRONMENT=production \
    -e HUGO_ENV=production \
    -e TZ=Etc/UTC \
    site \
    bash scripts/build-site.sh --inside
}

case "$MODE" in
  --host|--inside)
    build_on_host
    ;;
  auto)
    if [[ "${CI:-}" == "true" || "${GITHUB_ACTIONS:-}" == "true" ]]; then
      build_on_host
    else
      build_in_container
    fi
    ;;
  *)
    fail "Unsupported mode: $MODE"
    ;;
esac
