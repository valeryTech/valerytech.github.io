---
draft: false
toc: true
description: "Separates compiler admissibility, execution verification, acceptance of an exact artifact for a purpose, and authorization of external effects, with distinct diagnostics and counterexamples for repair."
title: "09 Verification And Acceptance"
linkTitle: "09 Verification And Acceptance"
---
# Verification and acceptance


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Scope and status


The retained dialogues propose checks for generated programs and results. The checks apply beyond RAG, but the requirements depend on the task and its contract. The note distinguishes proposed checks from acceptance decisions and authorization for external effects.

| Concern | Question | Limit |
|---|---|---|
| Compilation | Is the program admissible under the language and declared constraints? | Passing static checks does not establish task correctness. |
| Verification | Does the result satisfy the relevant structural, source, and behavioral requirements? | The conclusion depends on the checks, evidence, and assumptions used. |
| Acceptance | Is an exact result revision suitable for a declared purpose? | Acceptance for one purpose does not imply acceptance for every use. |
| External effects | Is an action authorized under the applicable policy? | An accepted result is not automatically authorized for publication or another external effect. |

The later [lifecycle proposal]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}#a-proposed-lifecycle) distinguishes candidate results, compiled programs, successful runs, and accepted artifacts. Its [downstream gates]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#the-dag-should-probably-be-several-related-graphs) depend on exact artifact revisions and acceptance purposes.

Acceptance is separate from the [external-effect boundary]({{< ref "ai/design-research/01-foundations/05-constrained-common-substrate" >}}#effect-boundary). Human review can contribute to acceptance, but a review requirement depends on the task. A schema check alone does not establish effective human review.

For reusable procedures, verification also needs evidence beyond one observed example. The [instance-versus-procedure distinction]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}#10-instance-specific-synthesis-versus-reusable-procedure-induction) explains why their acceptance criteria differ.

## Development of the argument


The first retained analysis separates compilation from correctness, then proposes a verification stack. The later reanalysis makes source, contract, and candidate comparisons separate relations. Both versions remain intact, with their original section numbers.

The earlier examples use `Accepted` as a verification outcome. Read the label alongside the later distinction between verification, acceptance for a purpose, and authorization for an external effect. The reassembly preserves the wording rather than silently changing the earlier model.

The checks are design proposals, not demonstrated guarantees. The original questions and access caveats remain in [Behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}). References to attached domain guides and UC-1 material were retained without independently verifying those documents.

## Related notes


- [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) retains language design, compiler checks, and static validation.
- [Epistemic contracts for RAG]({{< ref "ai/design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag" >}}) retains evidence-specific obligations, runtime certificates, and the conditional investigation soundness claim.
- The [investigation]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}), [runtime]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}), and [behavioral compilation]({{< ref "ai/design-research/06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes" >}}) notes retain their distinct experiment plans and related failure analyses.

## Retained dialogues


<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Compilation and correctness from the initial dialogue


The following section comes from [Behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}). The original question and access caveat remain in that note. The original argument and section number are retained, with editorial wording.

# 4. Compilation and correctness are different loops


The phrase "use the compiler to check the program, repeat until correct" needs to be split into two distinct loops.

## Compilation loop


A compiler can establish things such as:

- syntactic validity;
- static type correctness;
- valid tool signatures;
- declared capability availability;
- effect restrictions;
- output schema conformance;
- DAG well-formedness;
- exhaustive handling of closed states;
- absence of dangling artifact references;
- provenance-type compatibility;
- bounded retry declarations.

Compilation establishes **well-formedness**, not task correctness.

```
ProgramCandidate
    ↓ compile
CompiledProgram | CompileRejected(diagnostics)
```

## Execution and verification loop


Only execution and verification can establish whether the program actually solves the problem:

```
CompiledProgram
    ↓ execute
RunRecord
    ↓ verify
Accepted
| Repairable(counterexamples)
| Rejected(reason)
| Escalated(ambiguity)
```


A program may compile perfectly and still:

- retrieve irrelevant evidence;
- produce unsupported claims;
- omit a required entity;
- misinterpret the question;
- generate decorative but invalid citations;
- overfit one reference answer;
- fail on slightly changed inputs.

Compiler diagnostics and verifier counterexamples should therefore be separate typed artifacts.

The cited domain-modeling guide's separation of **resolution, validation, and execution** is directly applicable here. It also recommends closed variants and exhaustive dispatch rather than a status field surrounded by optional data.

For example:

```
CompilationOutcome =
    Compiled(compiled_program)
  | CompileRejected(diagnostics)

VerificationOutcome =
    Accepted(report)
  | Repairable(counterexamples, retained_candidate)
  | Rejected(reason)
  | Escalated(ambiguity)
```


This is safer than:

```
{
  "status": "failed",
  "program": null,
  "diagnostics": null,
  "result": null,
  "retry": true
}
```


<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Verification from the initial dialogue


The following section comes from [Behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}). The original question and access caveat remain in that note. The original argument and section number are retained, with editorial wording.

# 5. Verification must not be "similarity to the previous output"


Reference comparison is useful, but it must be only one component.

A strong verification stack would have several layers.

## Structural verification


Check that:

- all expected artifacts exist;
- domain schemas are valid;
- identifiers resolve;
- invariants hold;
- closed alternatives were handled;
- outputs are parseable;
- DAG dependencies were respected.

## Provenance verification


Check that:

- every citation resolves to an actual source snapshot;
- every materially factual claim is linked to evidence;
- the cited evidence supports the relevant claim;
- pages, sections, or anchors were not invented;
- the evidence used to generate the answer is the evidence rendered to the user;
- unsupported claims are qualified or removed.

The cited evidence-flow document makes the critical point that the question path must not invent what the document path failed to preserve. It also requires the same evidence path to support retrieval, the support decision, answer construction, and rendered provenance.

This implies provenance cannot be appended after answer generation. It must flow through execution.

## Behavioral verification


Check task-specific obligations:

- Did the output answer the requested question?
- Were all required subproblems handled?
- Was the appropriate output form used?
- Were required entities created?
- Were domain transitions legal?
- Was ambiguity surfaced rather than silently resolved?

## Reference-relative verification


Compare against the witness set, but at the right level:

- claim equivalence;
- entity equivalence;
- coverage of obligations;
- compatible conclusions;
- acceptable differences in wording;
- presence of an alternative valid solution.

Exact text similarity should be low priority except where exact wording is itself a requirement.

## Robustness and anti-hardcoding verification


A synthesizer that sees the reference output may simply embed it. To establish that you synthesized a procedure rather than a replay script, test with:

- paraphrased questions;
- changed but structurally equivalent inputs;
- irrelevant source additions;
- source-order changes;
- held-out problem instances;
- removed evidence;
- intentionally conflicting evidence;
- altered domain values.

This exposes programs whose outputs depend on constants copied from the witness rather than on actual inputs.

## Safety and capability verification


Generated programs must run with:

- explicit capability allowlists;
- sandboxed execution;
- scoped filesystem and network access;
- no ambient credentials;
- bounded resource consumption;
- declared side effects;
- untrusted source content separated from agent instructions.

Prompt injection from source documents is particularly important here: source text is data, not a command to the program-synthesis agent.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Verification from the behavioral reanalysis


The following material comes from the reanalysis in [Behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}#reanalysed). The original source context remains in that note. The original arguments are retained with editorial wording.

### 7. Verify through several independent relations


Comparing the run output with the initial LLM output is useful, but only as one check.

A useful verification stack is:

#### Structural verification


- output schema;
- required entities;
- reference integrity;
- revision integrity;
- declared effect boundaries;
- complete branch handling.

#### Source-relative verification


- each material claim has support;
- references resolve to exact source revisions;
- the cited material is relevant to the claim;
- subject, polarity, time, scope, and attribution are preserved;
- uncertainty remains visible.

#### Contract-relative verification


- required properties hold;
- prohibited states are absent;
- downstream artifact requirements are satisfied;
- acceptance is correctly scoped.

#### Candidate-relative verification


- compare claims and coverage with initial candidate results;
- explain meaningful differences;
- detect omissions and contradictions;
- accept valid alternative formulations.

#### Robustness verification


- paraphrase the problem;
- reorder sources;
- add irrelevant sources;
- remove required evidence;
- change a domain value;
- introduce conflicting evidence;
- run held-out examples.

This is how you detect a program that merely memorized or copied a candidate completion.

#### Human or domain review


For some properties, inspectability alone is insufficient. The UC-1 document notes that reviewability requires evidence about review effort, omissions, and correction burden; a schema check does not establish that a human can effectively review the result. uc-1-domain-model
