---
draft: false
toc: true
title: "Fingerprinting Spec v1.3 — Canonicalization and Hash Semantics"
description: "Configuration, inputs, dependencies, and evaluators need identities that survive harmless representation changes. Canonical JSON, expanded defaults, and versioned hashes define how those identities are computed and compared."
linkTitle: "Fingerprinting v1.3"
---
# Fingerprinting Spec v1.3 -- Canonicalization and Hash Semantics


This document defines how to compute and interpret fingerprints used in the comparability contract:

- `C_fingerprint`: configuration identity
- `I_fingerprint`: input regime identity
- `E_fingerprint_fixed`: dependency identity (fixed)
- `R_fingerprint`: ruler identity

Fingerprints are designed to be:

- **stable** (same semantics -> same fingerprint),
- **composable** (sub-fingerprints can be combined),
- **auditable** (recomputable from source config),
- **versionable** (schema changes do not silently change meaning).

## 0. Normative requirements


1. Fingerprints MUST be computed from a **canonicalized representation**.
2. Fingerprints MUST use a cryptographic hash (default: SHA-256).
3. Fingerprints MUST be treated as **opaque ids**; consumers must not parse them.
4. Fingerprints MUST be logged with every state snapshot, delta, and incident packet.
5. Any comparison that mixes fingerprints without explicit exceptions is **invalid** and should be INCONCLUSIVE.

## 1. Canonicalization rules (applies to all fingerprints)

### 1.1 Canonical JSON


The canonical representation is a JSON object serialized with:

- UTF-8
- sorted keys (lexicographic)
- no insignificant whitespace
- arrays preserved in order (unless explicitly specified)
- numbers normalized (no `1.0` vs `1` ambiguity; use JSON number canonical form as produced by the canonicalizer)

### 1.2 Field inclusion rules


- Include only fields declared in the relevant fingerprint spec section.
- Exclude all runtime/observed fields (timestamps, request ids, latencies).
- Exclude derived defaults **only if** the default is explicitly part of the canonicalization contract.

**Default-handling rule (recommended):**

- Canonicalizer MUST expand defaults to explicit values before hashing.

This prevents "implicit default changed" from silently changing behavior while fingerprint stays constant.

### 1.3 Conditional knobs


Many configs have conditional parameters (e.g., retrieval settings only matter if retrieval is enabled).

**Rule:** if a feature is inactive, its configuration subtree MUST be omitted (or set to `null`) consistently.

Pick one policy and encode it in the canonicalizer. Recommended:

- omit inactive subtrees entirely.

### 1.4 Secret handling


Never include secrets (API keys, tokens) in fingerprint payloads.

Instead include:

- provider endpoint id / project id
- "auth mechanism type" (e.g., `service_account`, `api_key`) if relevant

### 1.5 Namespace and version stamping


Every fingerprint payload MUST include:

- `fingerprint_spec_version` (here `1.3`)
- `namespace` (e.g., `org.productA`)

This avoids collisions and allows concurrent evolution.

## 2. C_fingerprint (configuration identity)

### 2.1 Purpose


C_fingerprint changes when the system's behavior could change due to configuration, including:

- model choice, decoding
- prompts and prompt templates
- routers and routing policies
- tool wrappers and schema versions (if behaviorally relevant)
- retrieval settings (if enabled)
- safety policy configurations (if configurable)

### 2.2 Required payload fields (canonical)


- `fingerprint_spec_version`
- `namespace`
- `model`: `{ provider, model_id, endpoint_id? }`
- `decoding`: `{ temperature, top_p, max_tokens, stop_sequences? }`
- `prompts`: mapping from prompt role -> `{ template_id, template_version, variables_schema_version? }`
- `router`: `{ policy_id, policy_version, features_version? }`
- `tools`: list of `{ tool_name, wrapper_version, request_schema_version, response_schema_version }`
- `retrieval` (if enabled): `{ index_policy, index_snapshot_id?, top_k, query_template_id?, reranker_id? }`
- `safety` (if configurable): `{ policy_id, policy_version }`

### 2.3 Exclusions


- observed tool latencies
- tool health metrics
- runtime timestamps
- model provider "current default" pointers (must be resolved to explicit model_id)

## 3. I_fingerprint (input regime identity)

### 3.1 Purpose


I_fingerprint defines "the inputs evaluated or monitored."

### 3.2 Required payload fields


Offline:

- `dataset`: `{ dataset_id, dataset_version, sampling_spec_id, split: dev|holdout|redteam }`

Online:

- `traffic_window`: `{ window_id, time_range, eligibility_criteria_id, sampling_rate }`
- `assignment_unit`: `user|session|request`
- `experiment_id` (if applicable)

Plus:

- `slice_catalog_id` and `tier1_slice_set_id` (for comparability of slice matrices)

### 3.3 Exclusions


- raw input text (PII risk)
- per-episode ids (not stable)

## 4. E_fingerprint_fixed (dependency identity)

### 4.1 Purpose


E_fixed captures the **identity-level** dependency configuration that affects behavior:

- tool API versions and schemas
- retrieval corpus policies / index snapshot policy
- runtime library versions if they change semantics (e.g., parser or tool wrapper behavior if not already in C)
- policy dependencies (moderation endpoints, allowlists)

### 4.2 Required payload fields


- `tools`: `{ tool_name, api_version, schema_version, contract_id }`
- `retrieval`: `{ corpus_id, index_snapshot_policy, embedding_model_id? }`
- `runtime`: `{ framework_runtime_version }`
- `policies`: `{ moderation_policy_id, data_access_policy_id }` (if relevant)

### 4.3 E_observed is not hashed


Tool health is observed and belongs in state snapshots, not in fingerprints:

- tool_latency_p95, error_rate, rate_limit_rate
- provider incident flags

## 5. R_fingerprint (ruler identity)

### 5.1 Purpose


R_fingerprint defines the measurement instrument.

### 5.2 Required payload fields


- `ruler_version_id`
- `judge`: `{ provider, model_id, prompt_id, prompt_version, decoding? }`
- `rubric`: `{ rubric_id, rubric_version }`
- `validators`: list of `{ validator_id, validator_version }`
- `parsing`: `{ parser_id, parser_version }`
- `anchors`: `{ anchor_set_id, anchor_set_version }`

### 5.3 Rule: freeze during comparisons


A controlled comparison MUST use a single R_fingerprint. If ruler changes:

- re-score both A and B under the same ruler, or
- mark the delta INCONCLUSIVE.

## 6. Hash format and encoding

### 6.1 Hash algorithm


Default: SHA-256 over canonical JSON bytes.

### 6.2 Output encoding


Recommended output string:

```
<type>:v1.3:<namespace>:sha256:<hex>
```

Example:

```
C:v1.3:org.productA:sha256:9f2c...
```

## 7. Comparability rules (how to use fingerprints)

### 7.1 Strict comparability


Two state snapshots are strictly comparable if:

- `C`, `I`, `E_fixed`, `R` fingerprints match exactly, and
- missingness policy version matches, and
- observability coverage is within thresholds.

Strict comparability is required for:

- "state as truth" reporting
- release gates

### 7.2 Conditional comparability (explicit exceptions)


Some workflows allow controlled differences:

- online experiments: C differs by design; I/E_fixed/R must match
- ruler updates: R differs by design; require re-score to align R

Any exception must be explicit in the delta artifact as:

- `comparability_exceptions`: list of `{ plane, reason, mitigation_applied }`

## 8. Validation and testing


Implementers MUST provide:

- golden tests for canonicalization (same input -> same bytes)
- tests that default expansion is stable
- tests that inactive feature subtrees are handled consistently
- regression tests for fingerprint payload schema evolution

## 9. Operational guidance


- Always log fingerprint payloads (redacted) alongside the fingerprint hash for debugging.
- Store payloads as versioned artifacts in repo; treat them as configuration.
- Monitor fingerprint churn rate; unexpected churn is a sign of uncontrolled config changes.
