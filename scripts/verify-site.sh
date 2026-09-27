#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "$0")/lib.sh"

ROOT="$(repo_root)"
STARTED_BY_SCRIPT=0
WAS_RUNNING=0
BASE_URL="${BASE_URL:-http://127.0.0.1:1313}"
ROUTES=(
  "/"
  "/ai/"
  "/ai/collab-and-joint-work/"
  "/engineering/topics/api/"
)

cleanup() {
  if [[ "$STARTED_BY_SCRIPT" -eq 1 ]]; then
    cd "$ROOT"
    log "Stopping preview service"
    docker compose down >/dev/null
  fi
}

trap cleanup EXIT

wait_for_server() {
  local attempt
  for attempt in $(seq 1 30); do
    if curl -fsS -o /dev/null "$BASE_URL/"; then
      return 0
    fi
    sleep 1
  done
  cd "$ROOT"
  docker compose logs --tail 50 site >&2 || true
  fail "Preview server did not become ready at $BASE_URL"
}

check_route() {
  local route="$1"
  local url="${BASE_URL}${route}"
  local status
  status="$(curl -sS -o /dev/null -w '%{http_code}' "$url")"
  if [[ "$status" != "200" ]]; then
    fail "Expected 200 from $url, got $status"
  fi
  log "Verified $url"
}

cd "$ROOT"
log "Running analytics unit tests"
docker compose run --rm site npm run test:analytics

bash scripts/build-site.sh

if [[ ! -f "$ROOT/public/404.html" ]]; then
  fail "Expected the production build to generate public/404.html"
fi

if ! grep -Fq 'page_kind:"404"' "$ROOT/public/404.html"; then
  fail "Expected the custom 404 page to include its analytics context"
fi

log "Verified production 404 output"

if docker compose ps --status running --services | grep -Fxq "site"; then
  WAS_RUNNING=1
fi

log "Starting preview service"
docker compose up -d site >/dev/null

if [[ "$WAS_RUNNING" -eq 0 ]]; then
  STARTED_BY_SCRIPT=1
fi

wait_for_server

for route in "${ROUTES[@]}"; do
  check_route "$route"
done
