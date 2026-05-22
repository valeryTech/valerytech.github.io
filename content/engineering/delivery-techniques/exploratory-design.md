---
draft: false
toc: true
title: "Exploratory Design"
linkTitle: "Exploratory Design"
---

I'll broaden the frame from RAG to engineering methodology. The useful target is not "manual RAG," but a family of practices around staged pipelines, inspection surfaces, human steering, exploratory design, and progressive automation.

A naive AI pipeline prematurely commits to hidden policies for retrieval, ranking, context construction, synthesis, and validation. During early development, these policies should be treated as hypotheses rather than fixed implementation details. The system should expose intermediate artifacts at selected stage boundaries, allow controlled intervention, persist traces of modifications and outcomes, and use those traces to derive, evaluate, and eventually automate stable policies.

problem:

help me conceptualize and reason about this. Here is retrieval as an example (in attached file)

When we're introducing RAG as simple / or complex pipeline where we first search chunks by vector similarity and then just give them to llm to generate answer.

At the same time we could introduce here some 'interaction point' where we (or user) could see these chunks, set the priority, order or other parameters to them and only then send them to llm.

--

Another example could be interactive algorithm adjustment based on summaries, or something similar.

--

We're talking here about some kind of algorithm or pipeline development.

additional:

**interaction points**

we could introduce some 'points' in the pipeline where we manually manage the context assembly, for example. so providing interactive platform/base will be beneficial

### some thoughts on algorithm/pipeline development


we could consider this 'just get vector search results and give it to the machine to synthesize' as a premature optimization. why would you do that? perhaps we should just experiment before with different graph/algorithms here and then after ... move to automatization.. and implementation.

I'm talking not only RAG. Could you find out more broad engineering practices/approaches corresponding to this style?

# answer 1


Yes. That is a different and broader point.

You are not mainly describing **human-in-the-loop execution**. You are describing **interaction as a design method**: building the product and its algorithms through inspectable artifacts, feedback loops, experiments, and progressive formalization.

A compact name for this style:

> **model-first, experiment-driven pipeline design**

or, more specifically for your project:

> **interactive pipeline discovery before automation**

## The distinction


HITL execution says:

```text
Automated pipeline exists.
Human intervenes at runtime.
```


What you mean is closer to:

```text
Pipeline is not yet known.
Expose its stages.
Interact with intermediate artifacts.
Learn which decisions matter.
Turn stable decisions into algorithms later.
```


That is a design-process posture, not just a product feature.

Your workflow document already points in this direction. It says the durable value is not the first codebase, but the conceptual model, evidence model, invariants, and validated understanding of real boundaries. It explicitly shifts from architecture-first delivery to **model-first, prototype-assisted architectural discovery**.

## The broader family of approaches


Several established practices overlap with this style.

### 1. Design Science Research


Design Science Research treats artifacts as vehicles for inquiry. The artifact may be a construct, model, method, or implementation, and its value must be demonstrated through evaluation. Hevner et al.'s design-science guidelines explicitly frame design as artifact creation plus rigorous evaluation of utility, quality, and efficacy. ([WISE](https://wise.vub.ac.be/sites/default/files/thesis_info/design_science.pdf?utm_source=chatgpt.com "Design Science in Information Systems Research"))

This maps closely to your idea:

```text
build artifact
  -> use artifact to expose unknowns
  -> evaluate behavior
  -> refine model
  -> stabilize design
```


For DocForge, the artifact is not only the final QA system. It may be a retrieval workbench, context assembly surface, evidence trace viewer, failure annotation tool, or algorithm comparison harness.

### 2. Research through Design / reflective practice


This is the idea that design activity itself generates knowledge. You do not fully understand the problem before building; you build partial artifacts to think with. Schön's reflective-practitioner frame is relevant here: practitioners reason through action, observe the situation's response, and adjust their framing while working. ([Ragged University](https://raggeduniversity.co.uk/wp-content/uploads/2025/03/1_x_Donald-A.-Schon-The-Reflective-Practitioner_-How-Professionals-Think-In-Action-Basic-Books-1984_redactedaa_compressed3.pdf?utm_source=chatgpt.com "Donald A, Schon - The Reflective Practitioner"))

In your terms:

```text
interaction point
  = not only a UI control
  = a thinking instrument
```


A context assembly interface is therefore not just a convenience. It is a way to discover what "good context" means.

### 3. Participatory / co-design


Participatory design treats users and domain experts as participants in shaping the system, not merely subjects who validate finished designs. Recent design literature describes participatory design as an iterative, flexible process involving stakeholders, often end users. ([Cambridge University Press & Assessment](https://www.cambridge.org/core/journals/design-science/article/participatory-design-a-systematic-review-and-insights-for-future-practice/C310A25B481980BE14AD4B38C0EE46D1?utm_source=chatgpt.com "Participatory design: a systematic review and insights for ..."))

For your case, this does not need to mean a broad democratic design process. The useful kernel is:

```text
domain experts interact with prototype artifacts
  -> their judgments reveal hidden domain structure
  -> design model changes
```


In RAG terms, when a user says "this passage is relevant but not sufficient," that is not merely feedback. It is domain data about support semantics.

### 4. Action Research


Action research is explicitly intervention-based: the team changes a real situation, observes the effect, reflects, and revises. Common formulations use cycles such as diagnosis, action planning, action taking, evaluation, and specifying learning. ([ResearchGate](https://www.researchgate.net/publication/337496478_Action_Research_as_Research_Methodology_in_Software_Engineering?utm_source=chatgpt.com "Action Research as Research Methodology in Software ..."))

That fits the engineering process you are describing:

```text
diagnose pipeline uncertainty
  -> introduce interaction point
  -> observe how people use it
  -> classify failures
  -> update model / algorithm / UI
```


This is especially relevant when the thing being built changes the work practice itself.

### 5. Continuous discovery and Lean Startup


Continuous discovery and Lean Startup are product-development versions of the same epistemic stance: reduce assumptions by running small learning loops. Continuous discovery emphasizes regular customer touchpoints and small research activities in pursuit of product outcomes. ([Product Talk](https://www.producttalk.org/getting-started-with-discovery/?srsltid=AfmBOop96c7-3EtHv2R7onyiZvnZvoUls76gtQSNxyO9rUp9QeRTMg_z&utm_source=chatgpt.com "Everyone Can Do Continuous Discovery--Even You! ...")) Lean Startup frames progress as validated learning under uncertainty and emphasizes Build-Measure-Learn feedback loops. ([The Lean Startup](https://theleanstartup.com/principles?utm_source=chatgpt.com "The Lean Startup | Methodology"))

For your problem, the equivalent is:

```text
Do not assume the right retrieval/context algorithm.
Create a small artifact that lets you observe the decision.
Measure what breaks.
Then automate.
```

### 6. Experimental / empirical software engineering


This is the engineering discipline of testing methods, tools, and processes through systematic observation, measurement, and experiments. Empirical software engineering is commonly defined around systematic observation, measurement, and experimentation. ([Nature](https://www.nature.com/nature-index/topics/l3/empirical-software-engineering?utm_source=chatgpt.com "Empirical Software Engineering"))

For DocForge, this suggests treating algorithm choices as hypotheses:

```text
Hypothesis:
section-aware neighbor expansion improves support completeness.

Experiment:
compare baseline vector top-k vs vector top-k + section expansion.

Measure:
retrieval quality, context quality, support assessment accuracy, citation usefulness.
```


This connects directly to your failure taxonomy and evaluation harness. Your workflow doc already says failure taxonomy should help derive evaluations, compare prototype variants, interpret regressions, and decide which boundaries are under pressure.

## The core pattern


The pattern is not:

```text
manual now, automated later
```


It is:

```text
make the design space observable
  -> interact with it
  -> collect traces
  -> compare alternatives
  -> extract stable rules
  -> automate only what has become understood
```


For your project, I would call this:

> **trace-driven design discovery**

or:

> **artifact-mediated pipeline discovery**

Because the interaction happens through concrete artifacts:

```text
retrieved passages
evidence sets
context manifests
support assessments
citation bundles
failure labels
evaluation traces
```


The design process becomes structured around those artifacts.

## How this changes the platform idea


The platform is not merely an app for running RAG.

It is a **design workbench** for developing document-grounded algorithms.

That means it should support at least four activities:

```text
1. Inspect
   See intermediate artifacts produced by each pipeline stage.

2. Intervene
   Modify evidence selection, ordering, grouping, expansion, or policy.

3. Compare
   Run alternative algorithms or policies against the same scenarios.

4. Learn
   Preserve traces, labels, failures, and decisions so stable patterns can become automation.
```


This matches your workflow document's delivery loop: define scenarios, define conceptual objects and evidence semantics, implement an evaluation harness and prototype, pressure the prototype, refine the model, then extract durable architecture from what held under pressure.

## The design-time interaction points


I would define two categories.

### Runtime interaction points


These are used inside a single query/session.

```text
retrieval results
evidence selection
context assembly
support assessment
answer mode
citation review
```


These help produce a better answer now.

### Design-time interaction points


These are used to discover the right system.

```text
scenario authoring
pipeline variant configuration
retrieval-policy comparison
context-policy comparison
failure annotation
trace review
regression analysis
ablation testing
```


These help produce a better system later.

Your clarification is mostly about the second category.

## Better framing for the document


I would write it like this:

> The system should not begin by assuming that the correct RAG pipeline is "vector search followed by synthesis." That pipeline is only one candidate baseline. At this stage, the design problem is to discover which intermediate artifacts, policies, failure modes, and evidence semantics matter.
>
> Therefore, the platform should expose interaction points not only for end-user control, but also for design-time experimentation. These interaction points allow the team to inspect intermediate artifacts, compare pipeline variants, collect feedback, annotate failures, and progressively convert repeated human or evaluator judgments into automated policy.

## The useful slogan

```text
Do not automate the unknown decision.
Expose it, interact with it, trace it, evaluate it, then automate it.
```


That is the broader engineering principle behind your direction.

# second

## 1. Core diagnosis


You are describing a **design-time control surface for discovering algorithms**, not merely a RAG UI.

The attached note already identifies the central distinction: the pipeline is not known yet; its stages should be exposed, manipulated, traced, evaluated, and only then stabilized into automation. The important move is from:

```text
retrieve chunks → send to LLM → answer
```


to:

```text
retrieve candidates
→ inspect intermediate artifacts
→ intervene on uncertain decisions
→ compare alternatives
→ capture traces and judgments
→ formalize stable behavior into policy/algorithm
→ automate
```


That is broader than RAG. RAG is just a convenient example because retrieval, ranking, context assembly, citation choice, and answer synthesis are all visible algorithmic seams.

The strongest framing from your note is this:

> Do not automate an unknown decision.
> Expose it, interact with it, trace it, evaluate it, then automate it.

I would name the approach:

> **Artifact-mediated pipeline discovery**

or, more engineering-oriented:

> **Instrumented pipeline design before automation**

"Model-first, experiment-driven pipeline design" is close, but "model-first" may be confused with ML model selection. "Artifact-mediated" is more precise: the team learns by manipulating artifacts such as retrieved chunks, summaries, evidence sets, rankings, traces, failure labels, and context manifests.

## 2. What kind of problem this actually is


This is not primarily a UX problem.

It is an **epistemic engineering problem**: the system contains decisions whose correct form is not yet known.

Examples:

```text
Which chunks are relevant?
Which chunks are merely semantically close but not useful?
Which evidence is primary vs supporting?
Should adjacent sections be included?
Should summaries replace raw text?
Should evidence be ordered chronologically, structurally, or by relevance?
When should the system ask for more information instead of answering?
When is the answer unsupported?
Which failures are retrieval failures vs synthesis failures vs source-modeling failures?
```


A naive RAG pipeline collapses these questions into hidden defaults:

```text
embedding model choice
chunking strategy
top-k
reranker behavior
prompt template
context order
LLM synthesis behavior
```


That is the actual issue. The "vector search -> LLM" pipeline is not only simplistic; it **prematurely hides the decision surface**.

A better engineering stance is:

```text
Unknown decision → make it observable.
Observable decision → make it editable.
Editable decision → make it traceable.
Traceable decision → make it measurable.
Measurable decision → make it automatable.
```

## 3. Broader families of practice this belongs to


|Practice family|Why it maps to your idea|
|---|---|
|**Design Science Research**|Treats artifacts as a way to generate understanding. In IS research, design science explicitly frames knowledge of a problem domain and its solution as something achieved through building and applying artifacts. ([AIS eLibrary](https://aisel.aisnet.org/misq/vol28/iss1/6/ "\"Design Science in Information Systems Research\" by Alan R. Hevner, Salvatore T. March et al."))|
|**Interactive Machine Learning**|Studies systems that learn through interaction with end users, and explicitly argues that users should be involved during exploration and refinement, not only after the model is finished. ([AAAI Publications](https://ojs.aaai.org/aimagazine/index.php/aimagazine/article/view/2513/0 "Power to the People: The Role of Humans in Interactive Machine Learning<br>\| AI Magazine"))|
|**Human-AI Interaction / Mixed-initiative systems**|Focuses on how AI systems should behave during initial use, regular use, error conditions, and over time. Microsoft's Human-AI Interaction Guidelines were built around those phases. ([microsoft.com](https://www.microsoft.com/en-us/research/project/guidelines-for-human-ai-interaction/ "Guidelines for Human-AI Interaction - Microsoft Research"))|
|**Empirical / experimental software engineering**|Treats algorithmic and architectural choices as hypotheses to test through measurement, not assumptions to encode immediately.|
|**LLMOps / AI observability**|Turns internal steps into traces. LangSmith, for example, models LLM application behavior as traces and runs, where a run may be an LLM call, prompt formatting step, retrieval call, or other unit of work. ([LangChain Docs](https://docs.langchain.com/langsmith/observability-concepts "Observability concepts - Docs by LangChain"))|
|**Evaluation-driven RAG development**|RAG evaluation separates retrieval quality, context quality, faithfulness, and generation quality. RAGAs explicitly frames RAG evaluation as multi-dimensional: retrieval must identify relevant context, and generation must use it faithfully. ([ACL Anthology](https://aclanthology.org/2024.eacl-demo.16/ "RAGAs: Automated Evaluation of Retrieval Augmented Generation - ACL Anthology"))|
|**Participatory / domain-expert design**|Domain expert interventions are not just "feedback"; they are data about domain semantics, evidence quality, and decision policy.|
|**Progressive automation**|Start with human-visible decisions, collect traces, then automate repeated stable patterns.|

The most relevant combination for your case is:

```text
Design Science
+ Interactive ML
+ Human-AI Interaction
+ Empirical Software Engineering
+ LLMOps Observability
+ Evaluation-driven development
```


This is why "human-in-the-loop" is too narrow. HITL often implies a mostly automated system with occasional human correction. Your idea is earlier and deeper: the interaction exists to **discover the correct system**.

## 4. Principal-engineer framing


I would frame the platform as:

> A workbench for discovering, evaluating, and progressively automating AI pipelines through inspectable intermediate artifacts.

Not:

> A RAG application with manual controls.

That distinction matters architecturally.

A product feature says:

```text
User can reorder chunks before answer generation.
```


A systems-engineering capability says:

```text
The platform captures retrieval candidates, ranking scores, user adjustments,
context assembly choices, generated output, evidence-support relationship,
failure labels, and evaluation outcomes as a reusable trace.
```


The second one creates durable engineering value.

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


Your note already makes this distinction implicitly. I would make it explicit.

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

## 9. Important design principle: interaction points are not all equal


Do not expose every internal detail just because it exists. Expose points where one of these is true:

```text
1. The decision is currently uncertain.
2. The decision has high effect on output quality.
3. The decision is hard to evaluate automatically.
4. Domain expertise materially changes the decision.
5. The decision may later become a rule, policy, or model feature.
6. Failure at this point is hard to diagnose from final output alone.
```


Good interaction point:

```text
“This chunk is relevant but insufficient; include parent section.”
```


Bad interaction point:

```text
“Manually edit embedding vector weights.”
```


The former reveals a domain/pipeline rule. The latter is not a useful human abstraction.

## 10. Anti-patterns to avoid

### 1. Treating manual control as the product


Manual reordering is useful only if it produces reusable understanding. Otherwise it becomes labor.

### 2. Capturing feedback without semantics


A thumbs-up/down is weak. You need typed judgments:

```text
irrelevant
redundant
missing context
wrong granularity
unsupported claim
bad citation
answerable but not from retrieved evidence
retrieval missed canonical source
```

### 3. Evaluating only final answers


Final-answer quality hides whether the failure came from retrieval, ranking, context assembly, reasoning, citation, or generation. RAG evaluation work explicitly separates retrieval/context dimensions from generation dimensions. ([ACL Anthology](https://aclanthology.org/2024.eacl-demo.16/ "RAGAs: Automated Evaluation of Retrieval Augmented Generation - ACL Anthology"))

### 4. Automating before artifact vocabulary stabilizes


If the team cannot name the intermediate artifacts and decisions, automation will encode accidental behavior.

### 5. Building a pipeline instead of a pipeline workbench


At this stage, the deliverable is not only an answer generator. It is the environment in which the right answer generator can be discovered.

## 11. Suggested formulation


Use this in the problem analysis:

> The goal is not to add manual controls to an otherwise fixed RAG pipeline. The goal is to create an instrumented pipeline workbench where uncertain algorithmic decisions are exposed as inspectable artifacts. Users, domain experts, and evaluators can intervene at selected points, compare pipeline variants, annotate failures, and generate traces. Over time, repeated interventions and stable judgments are converted into explicit policies, evaluation criteria, or automated algorithms.

A shorter version:

> We should treat interaction points as design-time probes. They expose unknown decisions, collect evidence about how those decisions should be made, and provide the transition path from exploratory human judgment to automated pipeline policy.

Most compact version:

```text
Expose uncertain decisions as artifacts.
Let humans and evaluators operate on them.
Trace the interventions.
Measure the outcomes.
Automate the stable patterns.
```


That is the broader engineering practice you are pointing at.

# third - to analyse


Yes. I would formulate the approach as a distinct engineering discipline/pattern, not as a feature set.

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
