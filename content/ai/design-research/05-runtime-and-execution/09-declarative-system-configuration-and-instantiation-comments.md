---
draft: false
toc: true
description: "Distinguishes authored configuration, resolved system revisions, environment bindings, instances, and runs, explaining why configuration identity does not establish reproduced behavior or safe isolation."
title: "09 Declarative System Configuration And Instantiation Comments"
linkTitle: "09 Declarative System Configuration And Instantiation Comments"
---
# Comments on declarative system configuration and instantiation


New commentary by Codex, added on 2026-10-01. The [dialogue note]({{< ref "ai/design-research/05-runtime-and-execution/09-declarative-system-configuration-and-instantiation" >}}) retains the initial DC requirements and later SC requirements as complete separate formulations. Neither list is an implemented interface or an adopted specification.

## The later question expands the system boundary


The first formulation concerns component references, resolution, inspection, history, and configuration identity. The author's next question asks how evaluation could start the system and collect data, and how experts could use the production configuration. The second formulation adds construction of a runnable revision and a shared interface for starting, observing, and terminating instances.

The expanded proposal changes the scope rather than supplying missing fields to an otherwise settled schema. Both requirement lists stay intact so readers can see the change. The opening [prompt note]({{< ref "ai/design-research/05-runtime-and-execution/08-prompt-text-composition-and-registry" >}}) also retains the earlier manifest and replay context.

## Distinguish the records


Source configuration is the authored definition. A resolved revision identifies the assembled components and expanded defaults. Environment bindings supply dependencies for a particular instance. A run concerns particular inputs and operations within an instance.

The existing [program and run history]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) makes a related distinction between a saved program and a particular execution. The configuration discussion does not establish that a system revision and a generated program revision are the same record type.

A declarative system manifest also differs from the [declarative programming model]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model" >}}). Listing deployment components does not define the permitted behavior, completion conditions, or authority rules of every computation.

## State what can be reconstructed


The same resolved revision can run with different environment bindings, inputs, and live dependency behavior. The source already separates those conditions from configuration identity and warns that exact output reproduction should not be promised.

A later design needs to identify which dependencies are captured fixtures, immutable snapshots, or live services. It must report missing conditions and retained data rather than treating a matching configuration fingerprint as proof of incident reproduction. Changes to bindings that affect behavior need explicit records even when the system revision stays unchanged.

## The runtime interface needs further rules


The proposed start, readiness, request, output, trace, and termination operations do not define retries, cancellation, partial readiness, cleanup after failure, persistence, or resource limits. The [application-state comments]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation-comments" >}}) identify related execution questions.

Isolation also needs an enforceable effect boundary. Running the production configuration in an expert workspace must not silently grant production credentials or permission for production writes. The [trusted-effect discussion]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}) remains separate from the instance lifecycle.

## Links and limits


The next [publishing note]({{< ref "ai/design-research/05-runtime-and-execution/10-configuration-publishing-and-version-identity" >}}) discusses selecting and retaining resolved revisions. The [evaluation-plan note]({{< ref "ai/design-research/05-runtime-and-execution/11-evaluation-plans-and-system-configuration" >}}) discusses how a consumer could name the system and test conditions.

The [audit]({{< ref "ai/design-research/reassembly-map" >}}#declarative-system-configuration-dialogue) records unchanged source ranges. The split adopts no storage format, runtime implementation, or guarantee of reproducible outcomes.
