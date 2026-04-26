#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

command_name="${1:-}"
case "${command_name}" in
  check|sync) ;;
  *)
    fail "usage: bash scripts/migrate-site.sh <check|sync>"
    ;;
esac

config_path="${MIGRATE_CONFIG:-scripts/migrate/config.toml}"
repo="$(repo_root)"
default_source_notes="/Users/val/notes"
source_notes="${SOURCE_NOTES:-${default_source_notes}}"

if [[ ! -d "${source_notes}" ]]; then
  fail "SOURCE_NOTES does not exist: ${source_notes}"
fi

log "Running migration ${command_name} from ${source_notes}"

docker compose run --rm \
  -e SOURCE_NOTES=/source-notes \
  -e UV_PROJECT_ENVIRONMENT=.migration/.venv \
  -v "$(cd "${source_notes}" && pwd):/source-notes:ro" \
  site \
  uv run --frozen python -m scripts.migrate \
    --source-root /source-notes \
    --config "${config_path}" \
    --content-root content \
    --work-root .migration/work \
    --report-root .migration/reports \
    "${command_name}"
