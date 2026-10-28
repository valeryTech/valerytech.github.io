---
draft: false
toc: true
description: "A critique separating investigation quality, runtime enforcement, and program correctness, with requirements for matched comparisons, reproducible histories, and independent expected outcomes."
title: "05 Agent Runtime Evaluation And Benchmarks Comments"
linkTitle: "05 Agent Runtime Evaluation And Benchmarks Comments"
---
# Comments on the evaluation plans


These comments were added by Codex on 2026-09-30 at the user's request. They concern the three related evaluation notes. They are new commentary, not part of the original dialogues, observed results, or an agreed experiment specification.

## Three different questions


| Question | Retained plan | What a result would establish |
|---|---|---|
| Does enforcing evidence requirements improve an investigation? | [Investigation evaluation]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) | Evidence quality and omissions within a declared corpus and task. |
| Does a runtime enforce its rules and recover from failures? | [Runtime evaluation]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}) | Recorded behavior under specified policies, faults, and external effects. |
| Does a generated program do more than reproduce examples? | [Behavioral compilation evaluation]({{< ref "ai/design-research/06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes" >}}) | Behavior on independently checked cases that were not used to generate or repair the program. |

The runtime report includes metrics from several applications. Its complete metric table remains intact because it describes a shared evaluation framework. It should not be read as one experiment that establishes all three claims.

## Investigation: processing evidence is not understanding it


The proposed frozen corpus makes the required evidence and source versions inspectable. A record that every partition was screened establishes an execution property. It does not establish that the screening model recognized every relevant passage.

Report execution coverage separately from evidence recall, claim support, conflict handling, and abstention. The [typed report's coverage distinctions]({{< ref "ai/design-research/06-research-reports/02-typed-durable-inspectable-runtimes" >}}) and [epistemic contracts]({{< ref "ai/design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag" >}}#the-formal-core) already support that separation.

To test the value of the contracts, the comparison needs matched models, operators, corpus versions, and clearly reported resource limits. An ablation removes a specified contract while holding the other relevant choices fixed. More screening effort is not, by itself, evidence that a contract caused an improvement.

The percentage and cost table in [the evaluation proposal]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}#the-evaluation) is explicitly illustrative. No measured result has been added by this rearrangement.

## Runtime: enforcement and useful completion are separate


A run can obey every checked rule and still fail the task. Conversely, a useful answer can follow an unauthorized action. Report task outcomes, missed violations, and unnecessary blocking separately.

Recovery tests need an explicit expected history around each external effect. A repeated worker step, a repeated external action, and a missing confirmation are different failures. The plan should also distinguish replaying saved observations from making new model or tool calls.

For a reproducible comparison, record the program, input, policy, model, and operator versions, the injected fault, and any human approval. Define the observation window and what counts as equivalent recovered behavior. The [program-history comments]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results-comments" >}}) explain the related version and acceptance boundaries.

## Behavioral compilation: a matching example is not an independent answer check


Teacher fidelity asks whether the program reproduces the model's example. Task correctness asks whether that behavior satisfies the task. The retained failure analyses explain why these are separate.

Keep generation and repair cases separate from final evaluation cases. Changed inputs need independently specified expected changes. Reusing the same model's answer as both target and judge can preserve its error even when the program compiles and matches perfectly.

The UC-1 passage proposes a synthetic study of source fidelity, uncertainty, revisions, and a draft boundary. The local separation note (archived source 001) contains UC-1 result properties. It does not establish the identity or completeness of the originally attached `uc-1-domain-model` document. No matching UC-1 filename was found in the three checked roots: `notes`, `source archive`, and `topics`.

That source check does not validate the synthetic examples, demonstrate clinical suitability, or select UC-1 as the first experiment for the whole research program.

## What remains to decide


Each plan still needs a fixed claim, evaluation unit, baseline, budget, stopping rule, and independently checked expected outcomes. Any reusable-program claim also needs a defined task family and a clear boundary between generation cases and evaluation cases.

The benchmark descriptions, system comparisons, and literature claims were preserved rather than independently checked against their external sources. The [collection review]({{< ref "ai/design-research/00-index-comments" >}}) records the related open choices and terminology issues. The arrangement selects no implementation or research sequence.
