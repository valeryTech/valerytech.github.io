---
draft: false
toc: true
title: "Causal Stack Layer Notes (Restored Copy)"
description: "Four layer notes from the earlier causal stack, restored from the 2026-09-28 snapshot because they are not in the vault or its git history, with links to their sections on observability."
linkTitle: "Causal Stack Layers"
---
These four notes come from the earlier version of the causal stack, which lived at `ai-engineering/causal-stack/` before the vault's git history starts on 2026-11-01. They were copied unchanged on 2026-11-16 from the 2026-09-28 snapshot of the notes. The 2026-08-30 snapshot holds identical copies. The current causal stack is in [Causal stack]({{< ref "ai-engineering/causal-stack" >}}) and is a rewrite with different notes.

The rest of the earlier causal stack (layers 0, 1A, 1B, and the `layer-2/` folder) is still only in the snapshot.

## Notes in this folder


- [Layer 1C -- AI-System-Level Causal Features]({{< ref "ai-engineering/other/causal-stack/layer-1c-ai-system-causal-features" >}}) -- features of AI systems that cause failures, starting from the principle that AI systems are empirical systems.
- [Layer 3 -- System Fault Families]({{< ref "ai-engineering/other/causal-stack/layer-3-system-fault-families" >}}) -- failures in the application around the model that let model-derived faults reach users.
- [Layer 3 -- System Controls and System Faults]({{< ref "ai-engineering/other/causal-stack/layer-3-controls-and-faults" >}}) -- the controls, design choices, runtime safeguards, monitoring, and processes that decide whether faults are prevented, detected, bounded, or recovered from.
- [Layer 3 -- System Control Families]({{< ref "ai-engineering/other/causal-stack/layer-3-control-families" >}}) -- the canonical list of control families, grouped by architectural boundary, with observability requirements for each family.

## Sections on observability


- [C6. Weak Native Observability and Attribution]({{< ref "ai-engineering/other/causal-stack/layer-1c-ai-system-causal-features" >}}#c6-weak-native-observability-and-attribution) -- AI systems are weakly observable by default: a final output does not show its causal path, and model explanations are not reliable evidence, so observability has to be designed in. Separates system-level observability from limits on model interpretability.
- [L3S9. Observability and Diagnosis Faults]({{< ref "ai-engineering/other/causal-stack/layer-3-system-fault-families" >}}#l3s9-observability-and-diagnosis-faults) -- the system lacks the traces, metadata, logs, or attribution needed to reproduce, explain, or localize failures.
- [L3CF13 -- Observability and Trace Controls]({{< ref "ai-engineering/other/causal-stack/layer-3-controls-and-faults" >}}#l3cf13-observability-and-trace-controls) -- what to capture to debug, audit, monitor, reproduce, and explain behavior, and which faults these controls address.
- [Treating observability as optional]({{< ref "ai-engineering/other/causal-stack/layer-3-controls-and-faults" >}}#treating-observability-as-optional) -- a common mistake listed in the same note.
- [4. Controls should be observable]({{< ref "ai-engineering/other/causal-stack/layer-3-control-families" >}}#4-controls-should-be-observable) -- a design principle for all control families.
- [L3-X. Cross-Cutting Observability, Evaluation, and Governance Boundary]({{< ref "ai-engineering/other/causal-stack/layer-3-control-families" >}}#l3-x-cross-cutting-observability-evaluation-and-governance-boundary) -- the boundary that holds controls used across all other boundaries.
- [L3-X -- Cross-Cutting Controls]({{< ref "ai-engineering/other/causal-stack/layer-3-control-families" >}}#l3-x-cross-cutting-controls) -- the detailed families for that boundary:
	- [L3X1. Traceability Controls]({{< ref "ai-engineering/other/causal-stack/layer-3-control-families" >}}#l3x1-traceability-controls)
	- [L3X2. Evaluation Gate Controls]({{< ref "ai-engineering/other/causal-stack/layer-3-control-families" >}}#l3x2-evaluation-gate-controls)
	- [L3X3. Runtime Monitoring Controls]({{< ref "ai-engineering/other/causal-stack/layer-3-control-families" >}}#l3x3-runtime-monitoring-controls)
	- [L3X4. Incident Review Controls]({{< ref "ai-engineering/other/causal-stack/layer-3-control-families" >}}#l3x4-incident-review-controls)
	- [L3X5. Human Escalation Controls]({{< ref "ai-engineering/other/causal-stack/layer-3-control-families" >}}#l3x5-human-escalation-controls)

## Related notes


- [AI Production Readiness]({{< ref "ai-engineering/delivery/production-ready" >}}) -- the production-readiness notes; [the building note]({{< ref "ai-engineering/delivery/production-ready/building" >}}) has a section on observability designed for operation and intervention.
- [Evaluation v1 Notes on Observability (Restored Copy)]({{< ref "ai-engineering/other/evaluation" >}}) -- two early evaluation notes that define semantic observability and relate AI observability to evaluation through traces.
- Observability and AI Evals: Terminology -- defines AI observability as the evidence and inspection layer of the evaluation system.
- Observability in LLM Applications -- Hamel Husain's office-hours notes on observability in complex LLM systems.
