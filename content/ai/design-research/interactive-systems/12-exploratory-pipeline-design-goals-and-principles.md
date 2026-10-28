---
draft: false
toc: true
description: "A third formulation, marked for analysis, organizes trace-driven pipeline engineering around inspectable decisions, structured judgments, variant comparisons, and progressive automation, proposing principles and operating loops for evaluation."
title: "12 Exploratory Pipeline Design Goals And Principles"
linkTitle: "12 Exploratory Pipeline Design Goals And Principles"
---
# Exploratory pipeline design goals and principles


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The retained passage is the complete third formulation from the exploratory-design source. Its original label, "third - to analyse", remains below with the proposed names, definition, purpose, goals, non-goals, ten principles, operating loops, design objective, and manifesto. The passage is a proposal for analysis rather than an accepted method or implementation checklist.

The [method note]({{< ref "ai/design-research/interactive-systems/10-exploratory-pipeline-design-and-progressive-automation" >}}) retains the opening context and earlier formulations. The [workbench note]({{< ref "ai/design-research/interactive-systems/11-inspectable-pipeline-workbenches" >}}) retains the second formulation's complete record model, RAG example, interaction lists, and architecture. Repeated formulations remain unchanged so their differences can be inspected.

The existing [investigation evaluation note]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) provides a separate experiment proposal. The existing [verification and acceptance note]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) and [trusted-boundary note]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}) distinguish checks and permission from observations of useful behavior.

Read the [sibling comments]({{< ref "ai/design-research/interactive-systems/12-exploratory-pipeline-design-goals-and-principles-comments" >}}) for the proposed automation conditions, judgment quality, runtime review, and authority. The [source overview]({{< ref "engineering/eng-exp/exploratory-design" >}}) links the full split, and the [stage 9 audit]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-9-exploratory-pipeline-design) records the original order. The reassembly does not verify the proposal or select the proposed discipline as a research conclusion.

## Retained third formulation


<!-- Exploratory pipeline goals and principles source begins below. -->

# third - to analyse


The proposal is to formulate the approach as a distinct engineering discipline/pattern, not as a feature set.

A good working name:

> **Trace-Driven AI Pipeline Engineering**

Alternative names:

```text
Artifact-Mediated AI Pipeline Design
Interactive Pipeline Discovery
Progressive Automation Engineering
Inspectable AI Systems Development
```


My preferred formulation:

> **Trace-Driven AI Pipeline Engineering is an approach for developing AI systems by exposing uncertain pipeline decisions as inspectable artifacts, enabling structured human or evaluator intervention, capturing those interventions as traces, and progressively converting stable patterns into automated policies, algorithms, prompts, validators, or system rules.**

This directly generalizes the original RAG/context-assembly example, where retrieval chunks, priorities, ordering, and context parameters become interactive pipeline artifacts rather than hidden defaults.

# 1. Purpose


The purpose is to avoid prematurely hard-coding poorly understood AI-system behavior.

In conventional AI application development, teams often jump from:

```text
problem
→ model/prompt/pipeline
→ automated behavior
```


But many AI systems contain hidden decisions that are not yet understood well enough to automate.

This approach says:

```text
problem
→ expose uncertain decisions
→ interact with intermediate artifacts
→ capture traces
→ evaluate variants
→ formalize stable behavior
→ automate selectively
```


The core purpose:

> Make the design space of an AI pipeline visible before committing it to automation.

# 2. Primary goals

## Goal 1: Discover the right pipeline before automating it


The first goal is not to build the final automated system immediately.

The first goal is to discover:

```text
which stages are needed
which artifacts matter
which decisions affect quality
which failures occur
which interventions improve outcomes
which policies are stable enough to automate
```


In RAG, this means not assuming:

```text
vector top-k → LLM synthesis
```


Instead, it means discovering whether the system needs:

```text
query rewriting
source selection
hybrid retrieval
graph traversal
reranking
neighbor expansion
evidence clustering
context compression
claim-evidence validation
citation verification
answer abstention
```


The same applies to agents, document extraction, code generation, memory systems, tool orchestration, and graph construction.

## Goal 2: Turn hidden decisions into explicit artifacts


AI pipelines often hide critical decisions inside:

```text
model behavior
prompt wording
retrieval defaults
ranking heuristics
chunking strategy
tool routing
context assembly
implicit state
```


This approach externalizes those decisions into artifacts.

Examples:

```text
retrieval candidates
context manifest
tool-call proposal
execution plan
document layout tree
entity/relation candidates
memory candidate
graph diff
patch candidate
evaluation trace
failure label
```


Once a decision becomes an artifact, it can be inspected, edited, measured, compared, and reused.

## Goal 3: Capture human judgment as structured engineering data


The human is not just approving or rejecting outputs.

The human is revealing information about the system design.

For example:

```text
“This chunk is relevant but insufficient.”
“This answer is correct but unsupported.”
“This source is outdated.”
“This tool call is safe, but the arguments are wrong.”
“This generated patch changes too much.”
“This summary loses the legally important clause.”
```


These are not generic feedback events. They are structured signals about:

```text
retrieval quality
evidence sufficiency
source authority
context granularity
tool safety
abstraction boundaries
validation gaps
```


The goal is to preserve this information in a form that can later become policy.

## Goal 4: Build evaluation before full automation


The approach treats evaluation as a first-class system component.

Before automating behavior, the team should be able to answer:

```text
Does this pipeline variant retrieve better evidence?
Does this context assembly strategy improve answer support?
Does this tool-routing policy reduce risky calls?
Does this summarization step remove critical information?
Does this graph-update strategy introduce false relations?
Does this memory policy store too much or too little?
```


So the development loop becomes:

```text
variant
→ scenario suite
→ trace
→ judgment
→ metric
→ comparison
→ refinement
```


Not:

```text
prompt tweak
→ subjective manual test
→ deploy
```

## Goal 5: Automate only stable, understood behavior


The end state is not permanent manual control.

The end state is **progressive automation**.

Manual or interactive behavior is valuable while the decision is uncertain. Once patterns stabilize, they should become:

```text
rules
rankers
validators
retrieval policies
context assembly policies
prompt templates
tool permissions
routing policies
memory policies
test cases
regression suites
```


The approach does not reject automation. It sequences automation more responsibly.

# 3. Non-goals


It is useful to define what this approach is not.

## Not just "human-in-the-loop"


Human-in-the-loop usually means:

```text
automated system runs
→ human corrects or approves
```


This approach is broader:

```text
pipeline is not fully known
→ expose stages
→ interact with artifacts
→ learn the pipeline
→ automate later
```


So the human is not only a fallback mechanism. The human is part of system discovery.

## Not just explainability


Explainability usually asks:

```text
Why did the system do this?
```


This approach asks:

```text
Should the system be making this decision this way at all?
```


It is less about explaining a fixed model and more about designing the pipeline around observable decisions.

## Not just prototyping


A prototype may be disposable.

Here, the prototype produces durable assets:

```text
scenario sets
failure taxonomy
trace schema
artifact vocabulary
evaluation criteria
policy candidates
validated architecture boundaries
```


The first implementation may be temporary, but the learning should not be.

## Not manual operation as a product


The goal is not to make users manually assemble everything forever.

The goal is to use interaction to discover stable automation.

If manual work does not produce reusable traces, labels, policies, or evaluations, it is probably just operational overhead.

# 4. Principles

## Principle 1: Expose uncertain decisions


Do not hide a decision inside a model, prompt, or heuristic when the team does not yet understand how that decision should be made.

```text
Unknown decision → visible artifact
```


Example:

```text
Do not silently choose top-k chunks.
Expose candidate evidence and context assembly.
```

## Principle 2: Treat intermediate artifacts as first-class objects


The final answer is not the only product of the pipeline.

Intermediate artifacts matter:

```text
plans
chunks
rankings
summaries
tool calls
patches
graph diffs
memory candidates
citations
validation reports
```


Each artifact should have:

```text
identity
type
provenance
parameters
stage origin
version
relationship to other artifacts
evaluation status
```

## Principle 3: Make intervention structured, not free-form


Free-form feedback is useful, but weak.

Prefer typed intervention:

```text
promote
demote
exclude
merge
split
approve
reject
mark insufficient
mark unsupported
mark stale
mark unsafe
mark redundant
```


And typed failure labels:

```text
retrieval failure
ranking failure
context assembly failure
tool-selection failure
validation failure
source authority failure
generation failure
state mutation failure
```


Structured intervention turns product usage into engineering signal.

## Principle 4: Preserve traces


Every important run should be replayable or at least inspectable.

A trace should capture:

```text
input
pipeline version
stage outputs
model versions
parameters
retrieved artifacts
ranking scores
human interventions
tool calls
validation results
final output
latency/cost
failure labels
```


Without traces, the team repeatedly rediscovers the same problems.

## Principle 5: Compare variants, not isolated outputs


A single output tells little.

The useful unit of development is comparison:

```text
pipeline A vs pipeline B
retriever A vs retriever B
chunking strategy A vs B
summary-first vs evidence-first
tool policy A vs B
prompt version A vs B
```


The question is not:

```text
Did this answer look good?
```


The better question:

```text
Which pipeline variant performs better across known scenarios, and why?
```

## Principle 6: Keep humans at semantic boundaries


Humans should not manipulate low-level machinery unless that low-level machinery corresponds to a meaningful domain concept.

Bad interaction point:

```text
Manually adjust embedding vectors.
```


Good interaction point:

```text
Mark this passage as primary evidence.
```


Good interaction points map to concepts humans can judge:

```text
relevance
authority
sufficiency
risk
correctness
redundancy
freshness
scope
intent
```

## Principle 7: Separate runtime control from design-time discovery


Runtime interaction improves one execution.

Design-time interaction improves the system.

Both are useful, but they should not be confused.

```text
Runtime:
  help this answer become better.

Design-time:
  help future pipeline behavior become better.
```


The approach is mainly about design-time discovery.

## Principle 8: Automate progressively


Automation should be introduced when one of these becomes true:

```text
the decision pattern repeats
the intervention is predictable
the failure mode is well-classified
the evaluator can measure improvement
the policy can be tested
the blast radius is acceptable
```


Until then, keep the decision inspectable.

## Principle 9: Treat prompts, policies, and evaluators as versioned system components


Prompts are not text blobs.

They are behavioral configuration.

The same applies to:

```text
retrieval policies
context assembly policies
tool-routing policies
memory policies
validation rules
evaluation datasets
failure taxonomies
```


They should be versioned, tested, compared, and reviewed.

## Principle 10: Design for auditability from the beginning


AI systems often fail in ways that are hard to reconstruct.

So the system should be able to answer:

```text
Why was this source selected?
Why was this chunk excluded?
Why was this tool called?
Why was this answer considered supported?
Why was this memory written?
Why did this graph edge get created?
Which version of the policy made this decision?
```


Auditability is not an afterthought. It is part of the pipeline architecture.

# 5. Core operating loop


The approach can be summarized as a loop:

```text
1. Identify uncertain decisions
2. Represent them as artifacts
3. Expose interaction points
4. Capture traces and judgments
5. Classify failures
6. Compare pipeline variants
7. Extract stable policies
8. Automate selectively
9. Keep evaluating regressions
```


More compactly:

```text
Expose
→ Interact
→ Trace
→ Evaluate
→ Formalize
→ Automate
```

# 6. Design objective


The design objective is not:

```text
Build an AI feature.
```


It is:

```text
Build a system that can discover, evaluate, and harden the AI feature.
```


That changes the architecture.

The platform should include:

```text
artifact store
trace store
scenario store
pipeline variant registry
evaluation harness
annotation/failure taxonomy
policy extraction workflow
runtime execution layer
```


This is the difference between building a one-off RAG endpoint and building an AI systems workbench.

# 7. Short manifesto version


A concise statement:

> AI pipelines should not be automated before their critical decisions are understood. The system should expose uncertain decisions as intermediate artifacts, allow humans or evaluators to intervene at meaningful semantic boundaries, capture those interventions as traces, evaluate alternative pipeline variants, and progressively convert stable patterns into automated policies.

Even shorter:

```text
Do not automate hidden uncertainty.
Expose it as an artifact.
Interact with it.
Trace it.
Evaluate it.
Turn stable behavior into policy.
Then automate.
```


That can serve as the foundation for the approach.
