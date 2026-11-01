---
draft: false
toc: true
description: "Proposes treating LLM solutions as provisional witnesses for contract-governed program synthesis, distinguishing instance solutions, reusable procedures, guarded reuse, independent verification, and explicit acceptance."
title: "11 Behavioral Compilation And Specification"
linkTitle: "11 Behavioral Compilation And Specification"
---

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

# Behavioral compilation and specification


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The original question, access note, and main argument are retained here. The redistributed sections are linked below. The arguments are retained with editorial wording and the original section numbers.

## question


Initial request: Analyze the following idea before choosing its conceptual framing.

Related material: [Research scope and hierarchy]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}) and [Domain semantics and operation contracts]({{< ref "ai/design-research/03-language-and-compiler/13-domain-semantics-and-operation-contracts" >}}). The worked example is a synthetic clinical-documentation workflow. Private source references from the captured request are omitted from this public edition.

Initial proposal: A problem is described in text and also has underlying domain structures, such as citations and sources, to establish provenance and other domain requirements and invariants.

Proposed sequence: First give a model assembled text input and possibly the underlying structures. Then: 1. The LLM generates one or several desired text outputs, which might include reasoning, and possibly structures such as JSON files or domain-specific entities. 2. Instead of using this output directly, another LLM-based agent writes a program to achieve that kind of LLM-level result, using tools, a DSL, and other facilities. A compiler checks the program, repeating until it is correct. 3. Run the program and verify its results against the earlier LLM-level results, repeating this loop if needed. 4. Apply this process to all results and continue through the DAG, layers, or branches.

# analysis-1

## Access note


The saved LLM analysis reported that the three `@//...` references did not resolve through the connected document sources. It therefore did not claim to have read those exact objects. It reported reading closely related domain-modeling, code-mode, evaluation-support, evidence-flow, and Python-domain-modeling documents in the author's connected repositories. The analysis below relies on those reported materials and the described architecture; terminology specific to the three unresolved documents remains provisional.

## Overall assessment


The idea is strong. It is not merely an "LLM agent that writes code." It is closer to **behavioral compilation**:

> Use direct LLM solutions as provisional demonstrations, extract an executable behavior from them, compile that behavior into a constrained program, execute it, and accept it only when independent verification shows that it satisfies the original problem contract.

The important correction is this:

> The synthesized program should not reproduce a previous answer. It should independently satisfy the same problem specification and produce a supportable result in the same acceptable-result class.

That distinction determines whether this becomes a genuine verification architecture or an expensive way to copy an LLM response.

The initial description currently combines three different processes:

1. **Solution sampling** -- generate candidate answers, structures, analyses, or plans.
2. **Program synthesis** -- derive an executable procedure capable of producing acceptable answers.
3. **Graph orchestration** -- schedule dependencies, alternatives, repair attempts, and downstream work.

They should be modeled separately and connected through explicit artifacts.

# 1. The central architectural idea


A problem instance should enter the system as more than prompt text:

```
ProblemBundle
├── narrative / assembled text
├── domain entities and state
├── source artifacts
├── evidence and citation structures
├── constraints and invariants
├── output contract
├── permitted capabilities
└── acceptance policy
```


The assembled text is a **rendered view** of this bundle for an LLM. It should not be the canonical representation of the problem.

That matters because otherwise you have two drifting sources of truth:

- the prose presented to the model;
- the underlying domain structures used later for validation.

Ideally, structured entities have stable identifiers, and the text serialization refers to them explicitly. For example, a text citation marker should resolve to a real `EvidenceUnitId`, not merely resemble a citation.

The connected domain-modeling guidance cited by the saved analysis strongly supports this direction: meaningful concepts should be represented by explicit types, invariants should live near the concepts they protect, untrusted inputs should be validated at boundaries, and loose JSON-like dictionaries should not become the internal domain model. JSON is a serialization format at the edge, not the model itself.

# 2. A better interpretation of the first LLM outputs


The first-stage LLM outputs should be called something such as **witnesses**, **demonstrations**, or **candidate solutions**--not ground truth.

A witness can contribute:

- a candidate final artifact;
- a claim set;
- an interpretation of the task;
- a proposed decomposition;
- examples of acceptable wording;
- possible tool-use sequences;
- suggested domain entities;
- candidate assertions and tests;
- detected ambiguities.

But it should not automatically establish correctness.

This is especially important for source-grounded work. The evaluation-support document cited by the saved analysis defines support as a relation among the corpus, question, and requested answer shape, and says that support should be determined before reviewing the system answer. Therefore, a fluent reference answer cannot make an unsupported claim supported.

A good first-stage output would therefore look more like:

```
CandidateWitness
├── proposed artifact
├── atomic claims
├── evidence cited for each claim
├── assumptions
├── unresolved ambiguities
├── proposed domain objects
├── proposed acceptance obligations
└── confidence or support classification
```


Generate several witnesses when the task is ambiguous or broad. Their disagreements are useful information. They can reveal:

- alternative interpretations;
- under-specified requirements;
- conflicting evidence;
- different valid solution families;
- aspects that require explicit policy rather than majority voting.

## Do not make hidden reasoning the target


"Reasoning" should preferably mean externally inspectable artifacts such as:

- claims;
- evidence selections;
- assumptions;
- decomposition decisions;
- tool choices;
- concise justifications;
- unresolved questions.

Raw chain-of-thought is neither a stable specification nor a useful semantic oracle. The program should reproduce observable decision obligations, not imitate a particular internal narrative.

# 3. Add a specification-distillation stage


There should be an explicit stage between direct LLM solving and program synthesis:

```
candidate witnesses
        ↓
validate and compare
        ↓
BehaviorSpec / AcceptanceSpec
        ↓
program synthesis
```


The `BehaviorSpec` should combine three sources:

1. **Authoritative requirements** from the original domain and problem contract.
2. **Evidence-derived obligations** from sources, citations, and invariants.
3. **Provisional examples** extracted from valid portions of the witnesses.

A specification could contain:

```
BehaviorSpec
├── required outputs
├── acceptable output variants
├── prohibited behaviors
├── claim-level support obligations
├── required domain entities
├── structural invariants
├── permitted tools and effects
├── task-specific tests
├── acceptable abstention or ambiguity behavior
└── generalization expectations
```


This prevents the synthesizer from simply hardcoding one sampled answer.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Redistributed sections 4 to 9


- [Section 4. Compilation and correctness]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}#4-compilation-and-correctness-are-different-loops)
- [Section 5. Verification]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}#5-verification-must-not-be-similarity-to-the-previous-output)
- [Section 6. Provenance in the language]({{< ref "ai/design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations" >}}#6-provenance-should-become-a-language-level-concept)
- [Section 7. Separate graphs]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#7-you-probably-need-three-graphs-not-one)
- [Section 8. Immutable repair attempts]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#8-repair-loops-and-a-dag-are-compatible)
- [Section 9. Alternatives and branches]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#9-alternatives-complements-and-branches-must-not-be-conflated)

# 10. Instance-specific synthesis versus reusable procedure induction


The initial description could refer to either of two products.

## A. Instance compiler


For one specific problem, synthesize an executable, auditable program that solves that exact instance.

Advantages:

- easier to verify;
- useful for high-value, complex tasks;
- can produce a replayable evidence trail.

Risk:

- the program may be little more than a specialized script;
- hardcoding can be acceptable unless explicitly prohibited.

## B. Procedure inducer


Given several solved cases, infer a reusable program for a class of future problems.

Advantages:

- amortized cost;
- reusable capability;
- stronger notion of "program synthesis."

Requirements:

- multiple training demonstrations;
- held-out cases;
- generalization tests;
- anti-hardcoding checks;
- stable task-family definition;
- versioning as the domain changes.

These should not share the same acceptance criteria.

A useful domain field might be:

```
SynthesisTarget =
    SolveThisInstance
  | GeneralizeAcrossTaskFamily(validation_suite)
```


Without this distinction, the system may claim to have learned a procedure when it has only generated an elaborate one-off answer.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Redistributed lifecycle and domain records


The complete [initial lifecycle]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#11-suggested-canonical-lifecycle) and [domain record catalog]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#12-core-domain-artifacts) are now in the program-history note. The detailed later problem-framing and synthesis stages remain below.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Redistributed section 13


[Section 13. Principal failure modes]({{< ref "ai/design-research/06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes" >}}#13-principal-failure-modes) is in the behavioral evaluation note.

# 14. Practical initial scope


The best first implementation would be deliberately narrow:

- one task family, such as source-grounded analytical answers;
- one canonical `ProblemBundle`;
- text sources with stable document, page, or section identifiers;
- answer plus structured claim/citation map;
- a small fixed tool set;
- a constrained typed DSL;
- explicit LLM-call nodes rather than attempting to eliminate LLMs;
- parse, type, effect, and provenance checking;
- bounded compile and verification repair;
- immutable run records;
- a held-out case suite.

The initial objective should not be "replace the LLM with ordinary code." It should be:

> Convert an opaque, one-shot LLM operation into a typed, inspectable, replayable, partially verifiable workflow.

Over time, individual LLM nodes can be replaced with deterministic implementations when the domain supports it. The DSL program may remain hybrid: deterministic operations where possible, generative operators where necessary.

## Bottom line


The architecture is coherent and potentially powerful, particularly for work where outputs must carry domain structures, citations, and traceable evidence.

Its most important design rule should be:

> **The direct LLM result is a witness, the original domain contract is the authority, the program is an executable candidate, and the verification report is the basis for acceptance.**

The strongest conceptual changes are:

- insert specification distillation between witness generation and synthesis;
- separate compilation from semantic verification;
- make provenance flow through execution rather than attaching it afterward;
- distinguish instance solving from reusable procedure induction;
- separate semantic, execution, and provenance graphs;
- represent retries as immutable DAG nodes;
- model all major outcomes as explicit domain variants;
- require independent checks beyond comparison with the original LLM output.

For a source-faithful follow-up, the three unresolved `@//...` documents need to be attached or otherwise exposed; their references did not resolve in the current connected sources.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Follow-up analyses from behavioural-specification-2


The following material comes from the later captured dialogue. The original analysis and its reanalysis remain separate. The original arguments are retained with editorial wording, and links mark the redistributed sections.

# abstraction analysis


The later LLM analysis proposes that the right level is a learning and compilation architecture. The related note already points in that direction: it treats the DSL as a mediation layer for inspecting proposed compositions before execution, while the larger architecture governs what participants may contribute and when those contributions become accepted state. 01-separation

## Fundamental abstraction


The most precise description of the proposed idea is:

> **Use a general model as a semantic interpreter, record successful solution traces, and compile those traces into guarded executable programs that can be checked, reused, and refined.**

The stages are:

```
problem instance + structured context
        ↓
general model performs the task directly
        ↓
candidate outputs + external solution traces
        ↓
program-induction agent
        ↓
program in a constrained language
        ↓
compile, execute, falsify, repair
        ↓
accepted executable behavior
        ↓
reuse in later graph nodes or related cases
```


This is an **extensional-to-intensional transformation**:

- The first model gives extensional evidence: examples of what the result should look like for concrete inputs.
- The synthesized program gives an intensional account: a procedure that explains how to produce such results.

Formally:

```
Teacher:
    T(x, s) → {(y₁, τ₁), ..., (yₙ, τₙ)}

Synthesizer:
    S({x, s, yᵢ, τᵢ}, L) → program p ∈ L

Compiler:
    C(p) → executable | diagnostics

Verifier:
    V(x, s, p(x, s), {yᵢ}) → certificate | counterexample

Refinement:
    pₖ₊₁ = S(previous evidence + counterexample)
```


Here:

- `x` is the textual problem;
- `s` is the structured context, sources, citations, entities, and state;
- `y` is a candidate result;
- `τ` is an externally observable solution trace;
- `L` is the target DSL or programming language;
- `p` is the induced program.

The first output should be understood as a **behavioral witness**, not automatically as truth. Verification against it establishes fidelity to the teacher. It does not by itself establish correctness.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Related work and execution tiers


- [Related-work comparisons]({{< ref "ai/design-research/06-research-reports/04-investigation-systems-and-related-work" >}}#the-closest-current-work)
- [Guarded execution tiers]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}#the-strongest-conceptual-analogy-a-tracing-jit-for-model-behavior)

## Four simultaneous conceptualizations


The proposal can be viewed in four valid ways.

### 1. Program induction from generated demonstrations


The first model generates demonstrations, and the second agent infers a program explaining them.

This is programming by example, except the examples are generated by another model and include richer artifacts than ordinary input-output pairs.

### 2. Distillation from a model into an executable representation


A capable teacher model transfers behavior into a student. The student is a program rather than a smaller neural network.

This is **program distillation**:

```
model behavior
→ explicit algorithm or workflow
```


The representation change is central. Knowledge moves from model parameters and prompting context into:

- code;
- control flow;
- API calls;
- queries;
- constraints;
- reusable functions;
- model calls that remain necessary.

### 3. Knowledge compilation


The system performs expensive semantic work once, then transforms its result into a representation that answers related future questions more efficiently.

This is particularly accurate when:

- the domain structures are stable;
- many related nodes will be executed;
- the synthesized procedure is reused;
- compilation cost is amortized over later runs.

### 4. Reflective or self-hosting agent programming


The system uses a model to observe the behavior of a model-driven process and create a new program that partially replaces or reorganizes that process.

Because synthesized programs may themselves call models, this is a reflective system:

```
model
→ observes model-level behavior
→ writes a program
→ program controls future model behavior
```


If successful programs become new primitives, the system gradually changes the language in which it solves later problems.

<a id="what-appears-distinct-in-your-combination"></a>

## What appears distinct in the proposed combination


Individual components already exist. The combination has a more specific shape that the saved LLM analysis did not identify as a mature general-purpose system:

1. The initial demonstrations include text plus structured artifacts, sources, citations, and provenance.
2. The induced program can be hybrid. It may use deterministic code, retrieval, databases, external tools, symbolic operations, and further LLM calls.
3. Verification concerns both the final result and its derivation. Two answers can look equivalent while using different or invalid evidence.
4. The process is recursive across a problem graph. Each accepted artifact can become input to new synthesis problems.
5. Repeated procedures can be compressed into a growing DSL or skill library.
6. Programs can carry guards defining their known applicability, with fallback to direct model execution outside that region.
7. Execution history, program revisions, counterexamples, and provenance form a persistent artifact graph.

That broader combination could be described as:

> **A tiered neuro-symbolic runtime that compiles model-generated semantic traces into guarded, evidence-carrying agent programs.**

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Synthesis problems and targets


[Underdetermination, oracle errors, and semantic equivalence]({{< ref "ai/design-research/06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes" >}}#the-fundamental-problems) are discussed in the behavioral evaluation note. The synthesis targets follow below.

### Target ambiguity


There are at least three different targets:

```
Instance program:
    Produce this result for this problem.

Task-family program:
    Solve future problems of this class.

Reusable primitive:
    Implement one recurring subproblem used by many workflows.
```


The instance-program version mainly gives replayability and inspectability. It may legitimately specialize heavily to one case.

The task-family version requires generalization tests.

The reusable-primitive version is where cumulative DSL or library growth occurs.

These targets should be researched separately.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Language, compilation cost, and execution history


- [DSL tradeoffs]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}#dsl-bias)
- [Compilation cost and reuse]({{< ref "ai/design-research/05-runtime-and-execution/03-resource-aware-investigation-planning" >}}#compilation-economics)
- [Guarded reuse and fallback]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}#distribution-shift-and-deoptimization)
- [Artifact derivation history]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#dag-versus-evolving-artifact-graph)

## Where the strongest research contribution lies


The weak formulation is:

> One LLM answers; another LLM writes code that reproduces the answer.

Existing code-generation agents already approximate that.

The stronger formulation is:

> A general model serves as a semantic interpreter. The system observes successful trajectories across related problems, induces guarded programs over a constrained mixed symbolic-generative language, verifies them using counterexamples and evidence relations, and accumulates reusable abstractions in a persistent artifact graph.

That formulation connects:

- transductive and inductive reasoning;
- program synthesis;
- CEGIS;
- model distillation;
- tracing compilation;
- library learning;
- durable agent execution;
- provenance-aware computation.

## Suggested terminology


The proposal is to use different names at different levels:

**Operation:**

**Semantic trace compilation**

**Formal method:**

**Counterexample-guided induction of evidence-carrying agent programs**

**Whole architecture:**

**Tiered generative-symbolic runtime**

**Learning process over time:**

**Cumulative agent program induction**

The clearest single description is:

> **Semantic trace compilation: compiling direct model solutions into guarded, executable, and reusable agent programs.**

The central current comparison is ReaComp. The principal extension in the proposed idea is moving from constrained program-synthesis traces to general provenance-bearing semantic artifacts and recursively compiling them across a larger execution graph.

# reanalysed


The saved LLM reanalysis reported reading all uploaded files. It identified two files with substantive material: `01-separation.md` and `uc-1-domain-model.md`. Several others are one-line redirects to moved notes, so the uploaded copies do not include their target content--for example, `problem-framing.md` and `declarative-layer.md`. problem-framing declarative-layer

## Main conclusion


The proposed architecture is coherent, but the documents change how it should be framed.

The system should not primarily be:

```
LLM result
→ synthesize a program that reproduces it
→ compare program result with LLM result
```


It should be:

```
problem revision + domain state + required properties
→ candidate interpretations and candidate results
→ executable behavior contract
→ program proposal
→ static validation
→ execution
→ property-based and semantic verification
→ purpose-specific acceptance
→ downstream eligibility
```


The direct LLM result is a proposal, example, or witness. It is not the specification and not the authority.

This follows the central method in `01-separation.md`: first state the required system property and its boundary, identify possible violations, identify the domain distinctions that must be represented, define contracts and enforcement boundaries, and only then select a combination of components. No individual model, compiler, validator, or runtime "contains" the system property. 01-separation

<a id="what-your-architecture-is-actually-doing"></a>

## What the proposed architecture is actually doing


A precise description would be:

> A property-driven runtime that uses generative models to propose results and executable procedures, then uses typed artifacts, static checks, controlled execution, semantic evaluation, and explicit acceptance decisions to determine which results may become downstream state.

The objective is not necessarily to replace an LLM with deterministic code. The generated program can still invoke LLMs. The gain comes from turning a one-shot, opaque operation into an inspectable composition with:

- declared inputs and outputs;
- explicit domain states;
- bounded capabilities and effects;
- versioned artifacts;
- provenance;
- repeatable checks;
- repair history;
- downstream acceptance gates.

That also matches the document's treatment of a DSL: the DSL is optional and becomes useful when proposed compositions of operations need to be inspected before execution. It is one enforcement mechanism within the system, not the starting point or the complete architecture. 01-separation

## The important correction: start from properties, not reference outputs


The initial sequence begins by asking an LLM to produce one or several desired outputs. That is useful, but it must happen after the system has defined at least a preliminary domain contract.

The files repeatedly place domain modeling before allocating behavior to a model, ontology, workflow, or deterministic component. They also distinguish domain meaning from its implementation: types, validators, graphs, tables, prompts, and policies preserve domain distinctions, but they do not create those distinctions. 01-separation

For a generic problem, the first canonical artifact should therefore be something like:

```
ProblemRevision
├── purpose
├── scope
├── source revisions
├── domain-state snapshot
├── required result properties
├── known invariants
├── open quality requirements
├── permitted effects
├── output contract
└── acceptance purpose
```


The assembled prompt text should be a projection of this artifact, not the canonical problem representation. The projection itself should be versioned and retain mappings between rendered text and structured source identifiers.

Otherwise the prompt and the underlying structures can drift:

- the prompt can omit a constraint represented in JSON;
- the prompt can describe an old source revision;
- the LLM can cite a textual label that no longer resolves;
- the verifier can evaluate a different problem from the one shown to the model.

<a id="mapping-your-stages-to-domain-roles"></a>

## Mapping the proposed stages to domain roles


|Your proposed stage|Better domain interpretation|
|---|---|
|Input text plus underlying structures|A versioned `ProblemRevision` and one or more prompt projections|
|First LLM output|`InterpretationProposal`, `CandidateResult`, and `UnresolvedMatter` artifacts|
|LLM-generated program|`ProcedureProposal` expressed in a constrained executable language|
|Compiler loop|Static validation and revision of the procedure proposal|
|Program execution|Immutable `ExecutionRun` with complete trace and produced artifacts|
|Comparison with first output|One part of a broader verification process|
|Passing to later DAG nodes|Purpose-specific acceptance followed by downstream eligibility|

The terminology matters because it prevents silent epistemic upgrades.

A candidate result is not an accepted result. A program that compiles is not correct. A successful run is not accepted. An accepted artifact is not necessarily externally committed or published.

The UC-1 model makes analogous boundaries explicit:

1. source and interpretation are separate;
2. interpretation and documentation are separate;
3. an accepted draft and an external published record are separate. uc-1-domain-model

The proposed architecture needs equivalent boundaries.

## A proposed lifecycle

### 1. Frame the problem


The system creates a `ProblemRevision` containing:

- source material;
- structured domain entities;
- source and entity versions;
- required properties;
- prohibited transitions;
- output purpose;
- permitted tools and effects;
- acceptance rules.

At this point, some properties should be classified as exact invariants and others as quality claims.

For example:

```
Exact:
- every citation resolves to an existing source revision;
- no undeclared network capability is used;
- a downstream node consumes the exact accepted artifact revision;
- an external effect requires a separate authorization state.

Evaluated:
- an interpretation preserves the source meaning;
- the answer is useful;
- no material claim was omitted;
- the decomposition is appropriate.
```


The documents explicitly distinguish obligations enforceable at artifact boundaries from obligations that require semantic review or empirical evaluation. A schema can prove that a provenance reference exists; it cannot prove that the referenced passage actually supports the interpretation. 01-separation

### 2. Generate candidate interpretations and results


One or more models generate:

```
CandidateResult
├── candidate artifact
├── atomic claim proposals
├── proposed structured entities
├── source references
├── assumptions
├── unresolved matters
└── proposed decomposition
```


These outputs serve several purposes:

- explore possible result shapes;
- discover ambiguities;
- propose structured interpretations;
- generate possible test cases;
- identify missing domain distinctions;
- provide examples for procedure synthesis.

Multiple outputs should not be merged automatically. Their relationship must be explicit:

```
AlternativeResults
ComplementaryResults
IndependentWitnesses
ConditionalBranches
SubproblemResults
```


Disagreement among candidates is useful. It may indicate:

- ambiguity in the source;
- an incomplete problem contract;
- a missing domain concept;
- a model error;
- more than one acceptable result.

In such cases, the system should create an `UnresolvedMatter` or an adjudication branch. It should not resolve disagreement through majority voting alone.

The UC-1 model uses exactly this distinction: an `InterpretationProposal` can be corrected or left unresolved, and its existence does not make it accepted or true. A `SourceAssertion` captures what the source is understood to report, including subject, polarity, time, provenance, and interpretation status. uc-1-domain-model

### 3. Distill an executable behavior contract


This stage is missing from the original sequence and is necessary.

The synthesizer should not work directly from raw candidate outputs alone. First produce something like:

```
BehaviorContract
├── required output properties
├── structural invariants
├── semantic obligations
├── accepted result variations
├── prohibited result states
├── capability policy
├── effect policy
├── example cases
├── held-out cases
└── verification plan
```


Sources of this contract have different authority:

```
Domain requirements           authoritative
Source material               authoritative within its scope
Human or policy decisions     authoritative for a stated purpose
Candidate model outputs       provisional
Candidate-generated tests     provisional until reviewed
```


This stage is where useful parts of the first LLM results can become examples or test hypotheses without turning the whole completion into ground truth.

For some problems, the synthesizer should see only the distilled behavior contract and a subset of examples. The verifier can retain held-out examples. This reduces the risk that the generated program simply embeds the reference answer.

### 4. Synthesize a procedure


The second agent produces a `ProcedureProposal`.

The procedure may include:

- deterministic transformations;
- retrieval;
- database reads;
- ontology or knowledge-representation queries;
- model invocations;
- human review steps;
- validation steps;
- branching;
- retries;
- artifact assembly.

The procedure should declare:

```
inputs
outputs
required capabilities
possible effects
failure variants
resource bounds
provenance behavior
acceptance checks
```


The DSL's role is to mediate between generative planning and controlled execution. It should describe a composition whose inputs, outputs, effects, and dependencies can be inspected before execution.

The DSL should not try to contain the whole domain model. The files explicitly treat an ontology as one view of the domain model and note that assertions, accepted facts, decisions, approvals, revisions, and publication states may belong elsewhere. They recommend several connected domain views rather than one giant ontology. 01-separation 01-separation

A suitable separation is:

```
Domain view
  entities, relations, constraints

Evidence view
  sources, spans, claims, interpretations, contradictions

Decision view
  reviews, acceptance purposes, authority, policy versions

Lifecycle view
  revisions, supersession, staleness, external effects

Execution view
  programs, runs, model calls, tool calls, diagnostics
```


These views can share storage while retaining different semantics.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Remaining lifecycle stages and system properties


- [Stage 5. Static validation]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}#5-compile-and-statically-validate)
- [Stage 6. Execution and traces]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#6-execute-and-retain-the-trace)
- [Stage 7. Independent verification]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}#7-verify-through-several-independent-relations)
- [System properties]({{< ref "ai/design-research/01-foundations/05-constrained-common-substrate" >}}#general-system-properties-suggested-by-the-files)
- [Related graphs and downstream gates]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#the-dag-should-probably-be-several-related-graphs)

<a id="where-your-first-llm-stage-adds-real-value"></a>

## Where the initial LLM stage adds real value


The first generation stage is useful when treated as exploration.

It can identify:

- possible interpretations;
- alternative decompositions;
- likely result structures;
- hidden assumptions;
- missing concepts;
- candidate invariants;
- semantic edge cases;
- potential tests.

It is less useful as an answer oracle.

A strong design could use different visibility boundaries:

```
Exploration agent:
  sees full problem and sources
  proposes candidates

Contract distiller:
  sees candidates, properties, and sources
  extracts obligations and unresolved matters

Program synthesizer:
  sees contract and selected examples
  does not necessarily see the final reference text

Verifier:
  sees sources, contract, run, and held-out candidates
```


This reduces direct copying and provides some independence among stages.

## Instance-specific and reusable programs must be separated


The proposal still leaves one major question open:

> Is the agent synthesizing a program for this exact problem instance, or a reusable procedure for a class of problems?

These require different acceptance rules.

For an instance-specific program, embedding instance data may be legitimate. The main benefits are auditability, controlled effects, and structured verification.

For a reusable program, you need:

- several representative cases;
- held-out cases;
- variation in source structure;
- adversarial cases;
- generalization criteria;
- versioned task-family semantics.

The resulting types should distinguish them:

```
SynthesisTarget =
    SolveProblemRevision
  | ImplementTaskFamily
```


Without this distinction, a one-off generated workflow may be mistaken for a generalized algorithm.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Experiment linked from the reanalysis


[The complete synthetic clinical experiment]({{< ref "ai/design-research/06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes" >}}#best-first-experiment) is retained in the behavioral evaluation note.

## Final assessment


The idea is sound, with four necessary changes:

1. **The domain properties and problem revision are the authority.** Initial LLM outputs are proposals.
2. **Add a contract-distillation stage before program synthesis.**
3. **Separate static program validity from semantic result acceptance.**
4. **Make downstream progression depend on purpose-specific acceptance of exact artifact revisions.**

The resulting architecture is not merely "generate an answer, then generate code for the answer." It is a system for converting open-ended generative proposals into versioned, executable, inspectable, and reviewable contributions without allowing proposals, successful execution, acceptance, and external effects to collapse into one state.

The next conceptualization should define the minimal domain types and transitions for `ProblemRevision`, `CandidateResult`, `BehaviorContract`, `ProgramRevision`, `ExecutionRun`, `VerificationFinding`, `AcceptanceDecision`, and `DownstreamGate`, using the UC-1 experiment as the first complete case.
