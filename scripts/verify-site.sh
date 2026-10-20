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
  "/agent-map/"
  "/agent-map/ai/"
  "/agent-map/ai-engineering/"
  "/agent-map/engineering/"
  "/agent-map/system-design/"
  "/agent-map/projects/"
  "/llms.txt"
  "/site-map.md"
  "/ai/llms.txt"
  "/engineering/llms.txt"
  "/system-design/llms.txt"
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

for map_path in "" "/ai" "/ai-engineering" "/engineering" "/system-design" "/projects"; do
  html_route="/agent-map${map_path}/"
  html_content_type="$(curl -fsS -o /dev/null -w '%{content_type}' "${BASE_URL}${html_route}")"
  if [[ "${html_content_type}" != text/html* ]]; then
    fail "Expected text/html for ${html_route}, got ${html_content_type}"
  fi
  html_map="$(curl -fsS "${BASE_URL}${html_route}")"
  if [[ "${html_map}" != *'<main '* || "${html_map}" != *'Website navigation map'* ]]; then
    fail "Expected readable HTML navigation at ${html_route}"
  fi
  map_content_type="$(curl -fsS -o /dev/null -w '%{content_type}' "${BASE_URL}${map_path}/llms.txt")"
  if [[ "${map_content_type}" != text/plain* ]]; then
    fail "Expected text/plain for ${map_path}/llms.txt, got ${map_content_type}"
  fi
  plain_map="$(curl -fsS "${BASE_URL}${map_path}/llms.txt")"
  markdown_map="$(curl -fsS "${BASE_URL}${map_path}/site-map.md")"
  if [[ "${plain_map}" != "${markdown_map}" ]]; then
    fail "Expected matching plain-text and Markdown maps for ${map_path:-/}"
  fi
  if [[ "${plain_map}" != "# "* ]]; then
    fail "Expected ${map_path}/llms.txt to contain a navigation document"
  fi
done
log "Verified HTML map content types and companion text downloads for all six maps"

for removed_map in "/ai/discovery/llms.txt" "/system-design/nfr/llms.txt"; do
  status="$(curl -sS -o /dev/null -w '%{http_code}' "${BASE_URL}${removed_map}")"
  if [[ "${status}" != "404" ]]; then
    fail "Expected the merged subsection map ${removed_map} to be absent, got ${status}"
  fi
done
log "Verified former subsection maps are no longer generated"
