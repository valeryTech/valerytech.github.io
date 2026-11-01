#!/usr/bin/env bash
set -euo pipefail

source "$(dirname "${BASH_SOURCE[0]}")/lib.sh"

# Bump with care: the upload runs rclone from this image, not from the toolchain image.
RCLONE_IMAGE="rclone/rclone:1.75.2"

repo="$(repo_root)"
settings="${R2_SETTINGS:-${repo}/.env.r2}"
pdf_root="${repo}/content/sources"

if [[ ! -f "${settings}" ]]; then
  fail "Missing ${settings}; see docs/runbook.md#pdf-storage"
fi

# An empty folder would make the sync delete every PDF in the bucket.
pdf_count="$(find "${pdf_root}" -name '*.pdf.enc' 2>/dev/null | wc -l | tr -d ' ')"
if [[ "${pdf_count}" == "0" ]]; then
  fail "No PDFs in content/sources/; run task content:migrate first"
fi

R2_ACCOUNT_ID=""
R2_ACCESS_KEY_ID=""
R2_SECRET_ACCESS_KEY=""
R2_BUCKET=""
R2_ENDPOINT=""
while IFS='=' read -r name value; do
  value="${value%\"}"
  value="${value#\"}"
  case "${name}" in
    R2_ACCOUNT_ID | R2_ACCESS_KEY_ID | R2_SECRET_ACCESS_KEY | R2_BUCKET | R2_ENDPOINT)
      printf -v "${name}" '%s' "${value}"
      ;;
  esac
done < <(grep -E '^[A-Z0-9_]+=' "${settings}")

for name in R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY R2_BUCKET; do
  [[ -n "${!name}" ]] || fail "${settings} does not set ${name}"
done
if [[ -z "${R2_ENDPOINT}" ]]; then
  [[ -n "${R2_ACCOUNT_ID}" ]] || fail "${settings} sets neither R2_ACCOUNT_ID nor R2_ENDPOINT"
  R2_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
fi

# Passed by name, so the keys never appear on a command line.
export RCLONE_CONFIG_R2_TYPE=s3
export RCLONE_CONFIG_R2_PROVIDER=Cloudflare
export RCLONE_CONFIG_R2_ENDPOINT="${R2_ENDPOINT}"
export RCLONE_CONFIG_R2_ACCESS_KEY_ID="${R2_ACCESS_KEY_ID}"
export RCLONE_CONFIG_R2_SECRET_ACCESS_KEY="${R2_SECRET_ACCESS_KEY}"
# A token scoped to one bucket may not list or create buckets.
export RCLONE_CONFIG_R2_NO_CHECK_BUCKET=true

log "Uploading ${pdf_count} PDFs to ${R2_BUCKET}/sources"
# The bucket mirrors content/sources/: changed files are replaced and removed ones deleted.
docker run --rm \
  -e RCLONE_CONFIG_R2_TYPE \
  -e RCLONE_CONFIG_R2_PROVIDER \
  -e RCLONE_CONFIG_R2_ENDPOINT \
  -e RCLONE_CONFIG_R2_ACCESS_KEY_ID \
  -e RCLONE_CONFIG_R2_SECRET_ACCESS_KEY \
  -e RCLONE_CONFIG_R2_NO_CHECK_BUCKET \
  -v "${pdf_root}:/sources:ro" \
  "${RCLONE_IMAGE}" \
  sync /sources "r2:${R2_BUCKET}/sources" --checksum --stats-one-line --stats 30s -v "$@"
