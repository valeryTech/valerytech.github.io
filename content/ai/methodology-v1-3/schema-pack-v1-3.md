---
draft: false
toc: true
title: "Schema Pack v1.3 — Normative Contracts for Framework Artifacts"
description: "A normative catalog of framework artifact contracts, specifying required fields, provenance, coverage, and compatibility rules so traces, estimates, change packets, and gate reports remain interpretable."
linkTitle: "Schema Pack v1.3"
---
# Schema Pack v1.3 -- Normative Contracts for Framework Artifacts


This document defines the canonical data contracts for the framework. These schemas are **normative**:

- If a producer cannot emit these objects, the framework cannot enforce comparability.
- If a consumer sees an object that violates schema, the correct response is **reject / INCONCLUSIVE** depending on context.

The goal is not to prescribe storage technology; it is to standardize **shape**, **semantics**, **versioning**, and **minimum required fields**.

This pack includes:

- `trace_v1.3.json`
- `state_key_v1.3.json`
- `state_estimate_v1.3.json`
- `state_delta_v1.3.json`
- `change_packet_v1.3.json`
- `gate_report_v1.3.json`
- `ruler_version_v1.3.json`
- `slice_catalog_v1.3.json`
> Notes:
> - Schemas are intentionally **minimal but sufficient**. Optional extensions should live under `extensions.{namespace}`.
> - All objects MUST contain a `schema_version` and SHOULD contain a `producer` section for provenance.
> - All timestamps MUST be ISO-8601 with timezone (e.g., `2026-01-05T12:34:56-03:00`).

## 0. Shared conventions

### 0.1 Versioning


- `schema_version`: semantic version string for the schema itself (here `1.3`).
- Domain objects (ruler, slice catalog, gate policy) have their own version ids:
	- `ruler_version_id`, `slice_catalog_id`, `gate_policy_id`.

### 0.2 Fingerprints


Every object that participates in comparisons MUST include or reference fingerprints:

- `C_fingerprint`
- `I_fingerprint`
- `E_fingerprint_fixed`
- `R_fingerprint`

Fingerprints are **opaque strings** computed by the fingerprinting spec (see `fingerprinting-spec-v1.3.md`).

### 0.3 Missingness and coverage


Any object that reports performance MUST include:

- explicit missingness counters (what was excluded and why),
- coverage rates (trace completeness, judge availability, validator coverage).

### 0.4 Metrics representation


Metrics are represented as structured records with:

- `name`, `type`, `estimate`, `unit`, `n`,
- `ci` (if applicable),
- `method` (estimator/inference method),
- `margin` (if used in gating).

## 1. Trace schema (`trace_v1.3.json`)


**Purpose:** The atomic record of an episode execution, sufficient for:

- slice membership computation,
- driver metrics,
- regime conditioning,
- attribution (R/I/E/C),
- replay/debug at a coarse level.

**Required:**

- stable ids and timestamps
- assignment (variant)
- routing decision + policy versions
- tool calls + latencies/errors
- retrieval summary + empty flag
- termination reason + budgets
- spans for major phases

See file: `trace_v1.3.json`.

## 2. StateKey schema (`state_key_v1.3.json`)


**Purpose:** identity of a state snapshot: the **comparability key**.

A StateKey is the tuple:

- `C_fingerprint`, `I_fingerprint`, `E_fingerprint_fixed`, `R_fingerprint`

See file: `state_key_v1.3.json`.

## 3. StateEstimate schema (`state_estimate_v1.3.json`)


**Purpose:** snapshot of observed behavior over a window/dataset:

- global + slice + regime metrics with uncertainty
- driver metrics
- ruler health
- observability/coverage
- input mix summaries
- environment summaries

See file: `state_estimate_v1.3.json`.

## 4. StateDeltaReport schema (`state_delta_v1.3.json`)


**Purpose:** controlled comparison between two StateEstimates:

- deltas for primary endpoints + Tier-1 slices + key regimes
- inference method and uncertainty
- driver deltas
- comparability checks (fingerprint equality or explicit exceptions)

See file: `state_delta_v1.3.json`.

## 5. ChangePacket schema (`change_packet_v1.3.json`)


**Purpose:** canonical incident/change-detection artifact:

- integrity (ruler + observability + data integrity)
- what changed (outcome deltas)
- where (slice/regime deltas)
- why (drivers + fingerprint diffs)
- recommendation + exemplars

See file: `change_packet_v1.3.json`.

## 6. GateReport schema (`gate_report_v1.3.json`)


**Purpose:** mechanical gate evaluator output:

- gate policy id + version
- PASS/FAIL/INCONCLUSIVE verdict
- per-metric classifications (beyond margin / within margin / low power)
- constraint violations
- references to the exact StateDeltaReport used

See file: `gate_report_v1.3.json`.

## 7. RulerVersion schema (`ruler_version_v1.3.json`)


**Purpose:** versioned measurement instrument contract:

- judge model/prompt, rubric, validators, parsing
- calibration/anchor sets
- health thresholds
- change protocol metadata

See file: `ruler_version_v1.3.json`.

## 8. SliceCatalog schema (`slice_catalog_v1.3.json`)


**Purpose:** versioned list of slices:

- predicate definition
- type (input_defined/trace_defined/env_defined/outcome_defined/ruler_defined)
- treatment_time (pre/post)
- gating_role (gate/monitor/stratify_only)
- tier (1/2/3)
- required fields (trace features)
- owner and governance metadata
- deprecation and rename mapping

See file: `slice_catalog_v1.3.json`.

## 9. Compatibility and extension rules

### 9.1 Backward compatibility


- Additive fields are allowed.
- Removing/renaming required fields requires a schema major version bump.
- Producers MUST NOT change semantics of a field without a schema bump.

### 9.2 Extensions


Use:

```json
"extensions": {
  "org.myteam": { "..." : "..." }
}
```

Never overload core fields for team-specific needs.

## 10. Minimal implementation checklist


A team has "schema compliance" when:

1. Runtime emits `trace_v1.3` with required fields and trace completeness is monitored.
2. Eval runner produces `state_estimate_v1.3` and `state_delta_v1.3`.
3. Monitoring produces `change_packet_v1.3`.
4. Gates produce `gate_report_v1.3`.
5. Ruler and slice catalogs are versioned and referenced by id in all produced artifacts.
