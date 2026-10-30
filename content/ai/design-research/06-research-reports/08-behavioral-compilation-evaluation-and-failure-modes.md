---
draft: false
toc: true
description: "A behavioral-compilation failure analysis separating teacher imitation from task correctness, addressing underdetermination and semantic equivalence, and proposing transformed transcript cases to test source fidelity and revision handling."
title: "08 Behavioral Compilation Evaluation And Failure Modes"
linkTitle: "08 Behavioral Compilation Evaluation And Failure Modes"
---
# Behavioral compilation evaluation and failure modes


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

This note keeps the failure analyses and proposed synthetic experiment beside each other. The source arguments below were moved from the combined evaluation note and are retained with editorial wording.

The [evaluation comments]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks-comments" >}}) distinguish reproducing examples from solving a task. The earlier analysis, later critique, and source context remain separate below.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Source context for behavioral compilation


The following section comes from [Behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}). The original question and access caveat remain in that note. The original argument and section number are retained, with editorial wording.

# 13. Principal failure modes

## Reference-output overfitting


The synthesized program copies the witness rather than solving the problem. Counter with held-out and transformed inputs.

## Correlated self-verification


The solver, synthesizer, and verifier use the same model and make the same mistake. Counter with deterministic checks, domain validators, source-based verification, and diversified judges.

## Decorative provenance


The program emits citation-shaped objects unrelated to the evidence used. Counter with provenance-carrying values and trace-to-claim checks.

## A weak DSL


If the language cannot express types, effects, assertions, evidence flow, and bounded branching, compilation provides little semantic protection.

## An overly powerful DSL


If arbitrary code and unrestricted tools are available everywhere, meaningful static guarantees and safe execution become difficult. Begin with a constrained core plus explicit escape hatches.

## Graph overload


A single graph is used simultaneously for task decomposition, runtime execution, and evidence derivation. Counter with typed graph layers.

## Non-terminating repair


The synthesizer oscillates or repeatedly produces superficially different failures. Counter with budgets, progress measures, failure fingerprints, and escalation.

## Premature generalization


A program derived from one case is described as reusable. Counter with an explicit synthesis target and held-out evaluation.

## Drift between prose and structures


The prompt says one thing while the domain model encodes another. Counter by generating the prompt view from the canonical `ProblemBundle` and retaining stable entity references.

## False precision


The output provides page, section, or span precision not preserved during ingestion. Counter by making permissible provenance granularity part of each source artifact's contract.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Synthesis problems from the behavioral dialogue


The following material comes from the abstraction analysis in [Behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}#abstraction-analysis). The original source context remains in that note. The original arguments are retained with editorial wording.

## The fundamental problems

### Underdetermination


One result can be explained by infinitely many programs.

For example, all of these programs satisfy one observed case:

```
return observed_answer
```

```
return lookup[input_hash]
```

```
return actually_solve_the_problem(input)
```


The synthesizer cannot distinguish them from one example alone.

You need some combination of:

- multiple cases;
- transformed or adversarial cases;
- negative examples;
- held-out cases;
- a constrained DSL;
- simplicity or minimum-description-length pressure;
- reusable-library pressure;
- explicit invariants.

This is why the family-level version is stronger than the instance-level version.

### The oracle problem


If the first LLM generates the answer and another LLM checks whether the program reproduces it, the system can preserve the first model's error.

There are two separate objectives:

```
Teacher fidelity:
    Does the program reproduce the teacher's behavior?

Task correctness:
    Does that behavior solve the actual problem?
```


The proposed system can optimize the first automatically. The second requires evidence independent of the teacher:

- executable tests;
- source-grounding checks;
- consistency constraints;
- simulation;
- other models with genuinely different evidence;
- people;
- real-world observations.

### Semantic equivalence


Exact text equality is too strict. Generic embedding similarity is too weak.

The relevant equivalence relation may involve:

- claims;
- entities and relations;
- citations supporting each claim;
- decisions and effects;
- uncertainty;
- omitted information;
- ordering where ordering is meaningful;
- permissible variation in wording.

The verifier therefore defines the operational meaning of the task. This is as important as the DSL itself.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Synthetic experiment from the reanalysis


The following material comes from the reanalysis in [Behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}#reanalysed). The original source context remains in that note. The original arguments are retained with editorial wording.

## Best first experiment


The UC-1 synthetic case is a suitable first experiment because it contains both exact and semantic obligations.

The source includes:

- a patient's reported denial of allergy to Medication A;
- the mother as the subject of the allergy in the next statement;
- a report that Medication B was stopped last month;
- the requirement not to invent an exact date;
- unresolved terms that must remain unresolved. uc-1-domain-model

A focused experiment could be:

```
Input:
  immutable transcript revision
  utterances and source spans
  UC-1 result properties
  no-publication effect policy

Exploration:
  generate several interpretation proposals
  generate candidate source assertions
  generate candidate draft notes

Contract:
  preserve speaker and subject
  preserve negation
  preserve medication-use state
  preserve relative time
  expose unresolved terms
  attach every material statement to source spans
  do not represent draft acceptance as publication

Synthesis:
  produce a DSL program that constructs assertions,
  resolves or preserves ambiguities,
  produces a note draft,
  and emits claim-to-source mappings

Compilation:
  check artifact types, source references,
  revision references, effects, and branch completeness

Execution:
  run against the original case and transformed cases

Semantic evaluation:
  patient/mother subject swap
  negation removal
  stopped/active confusion
  invented date
  unknown abbreviation
  source revision change
```


This experiment would directly test the central proposed claim: whether an LLM-produced result can be converted into an inspectable program whose behavior is better constrained, evaluated, and revised than the original one-shot generation.
