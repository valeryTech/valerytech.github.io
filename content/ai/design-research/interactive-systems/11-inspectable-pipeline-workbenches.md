---
draft: false
toc: true
description: "A proposed pipeline laboratory links scenarios, variants, stage artifacts, interventions, judgments, and traces; its RAG example records why evidence is selected, reordered, expanded, or judged insufficient."
title: "11 Inspectable Pipeline Workbenches"
linkTitle: "11 Inspectable Pipeline Workbenches"
---
# Inspectable pipeline workbenches


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The retained passage is sections 5 to 8 of the second exploratory-design formulation. It keeps the complete artifact vocabulary, RAG example, runtime and design-time interaction lists, and architecture proposal together. The records and checks are proposed concepts rather than an implemented system or accepted schema.

The [method note]({{< ref "ai/design-research/interactive-systems/10-exploratory-pipeline-design-and-progressive-automation" >}}) retains the opening context and requests, first answer, second formulation's framing, and closing criteria. The later [goals and principles proposal]({{< ref "ai/design-research/interactive-systems/12-exploratory-pipeline-design-goals-and-principles" >}}) remains a separate complete formulation.

The existing [retrieval note]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}#interactive-rag-and-query-understanding) concerns evidence representations and inspection. The [program and run history]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) and [application-state note]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation" >}}) provide related distinctions about revisions, runs, and views. Their existing arguments are retained with editorial wording.

Read the [sibling comments]({{< ref "ai/design-research/interactive-systems/11-inspectable-pipeline-workbenches-comments" >}}) for artifact identity, intervention records, replay, comparisons, and open execution rules. The [source overview]({{< ref "engineering/eng-exp/exploratory-design" >}}) links the surrounding formulations, and the [stage 9 audit]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-9-exploratory-pipeline-design) records the original position. Cited metrics and product descriptions were not independently checked during the split.

## Retained workbench model and example


<!-- Inspectable pipeline workbench source begins below. -->

## 5. The conceptual model


You need a domain model around **pipeline artifacts**, not just around prompts and responses.

Useful core entities:

```text
Scenario
  A repeatable task/query/problem case.

Pipeline Variant
  A concrete configuration of stages, models, prompts, retrieval policies,
  ranking policies, expansion rules, and context assembly rules.

Stage
  A pipeline step: retrieve, rerank, summarize, expand, assemble context,
  synthesize answer, validate support, cite sources.

Artifact
  A material output of a stage: chunks, summaries, evidence sets, rankings,
  context manifests, answers, citations, support assessments.

Intervention
  A human or evaluator modification: promote chunk, demote chunk, exclude source,
  add neighboring section, change ordering, change policy, mark insufficiency.

Trace
  Full execution record: inputs, stage outputs, parameters, timings, model versions,
  scores, interventions, and final output.

Judgment
  Human/evaluator assessment: relevant, irrelevant, insufficient, misleading,
  unsupported, redundant, missing evidence, wrong abstraction.

Policy
  A rule or algorithm extracted from repeated judgments.

Evaluation
  A repeatable measurement over scenarios and pipeline variants.
```


This shifts the system from:

```text
chat endpoint
```


to:

```text
pipeline laboratory
```

## 6. RAG example: what the interaction point really means


For RAG, a useful interaction surface is not just:

```text
Here are chunks. Reorder them.
```


It should expose the whole evidence-construction problem:

```text
Query
→ candidate chunks
→ chunk provenance
→ similarity score
→ reranker score
→ document structure
→ neighboring sections
→ duplicate/near-duplicate clusters
→ evidence role
→ inclusion/exclusion decision
→ final context manifest
→ generated answer
→ claim-to-evidence mapping
→ citation quality
→ support verdict
```


Then user intervention becomes engineering signal:

```text
User promoted chunk A
  → Why? exact answer-bearing evidence.

User demoted chunk B
  → Why? semantically similar but contextually irrelevant.

User added neighboring section C
  → Why? retrieved passage lacked necessary definition.

User marked answer unsupported
  → Why? generation exceeded evidence.

User changed order
  → Why? chronological reasoning mattered more than similarity rank.
```


These are not UI events. They are **training/evaluation/design observations**.

In RAG terms, this connects directly to metrics like context precision and context recall. Context precision evaluates whether relevant chunks are ranked higher than irrelevant chunks, while context recall measures whether important information was retrieved at all. ([Ragas](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/context_precision/ "Context Precision - Ragas"))

## 7. Runtime vs design-time interaction points


The initial note already makes this distinction implicitly. The proposal is to make it explicit.

### Runtime interaction points


These improve the current answer.

```text
inspect retrieved chunks
select evidence
prioritize evidence
change answer style
request broader/narrower context
validate citations
approve final response
```

### Design-time interaction points


These improve the system.

```text
create scenario sets
compare pipeline variants
annotate retrieval failures
annotate context assembly failures
mark unsupported claims
test different chunking strategies
test different graph traversal strategies
compare summary-first vs evidence-first approaches
run regression evaluations
derive new policies from repeated interventions
```


The design-time points are more strategically important. They turn the platform into an algorithm-discovery environment.

## 8. Architecture implication


The architecture should not be a linear black-box chain.

It should be closer to this:

```text
Scenario Store
    ↓
Pipeline Orchestrator
    ↓
Stage Execution
    ↓
Artifact Store
    ↓
Trace Store
    ↓
Interaction Surface
    ↓
Judgment / Annotation Store
    ↓
Evaluation Harness
    ↓
Policy Extraction
    ↓
Automated Pipeline Variant
```


Key architectural requirements:

```text
Every stage emits artifacts.
Every artifact has provenance.
Every decision has parameters.
Every intervention is captured.
Every run is replayable.
Every variant is comparable.
Every evaluation is scenario-based.
Every stable manual pattern can become policy.
```


That means you want event sourcing or at least structured trace capture early. Otherwise the team will manually discover useful behavior and lose it.
