---
draft: false
toc: true
description: "Successive design proposals use inspectable pipeline artifacts, targeted interventions, traces, and controlled comparisons to discover uncertain algorithmic decisions before formalizing reusable policies, extending the initial RAG example."
title: "10 Exploratory Pipeline Design And Progressive Automation"
linkTitle: "10 Exploratory Pipeline Design And Progressive Automation"
---
# Exploratory pipeline design and progressive automation


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The retained material concerns using inspection and intervention to discover how a pipeline should work before committing uncertain decisions to automation. The opening context, labelled requests, and complete first answer remain together. The second formulation's diagnosis, research-practice comparison, engineering framing, interaction criteria, and closing formulations follow in their original order.

The second formulation's intervening artifact model, complete RAG example, interaction lists, and architecture are in [Inspectable pipeline workbenches]({{< ref "ai/design-research/interactive-systems/11-inspectable-pipeline-workbenches" >}}). The complete third formulation remains in [Exploratory pipeline design goals and principles]({{< ref "ai/design-research/interactive-systems/12-exploratory-pipeline-design-goals-and-principles" >}}), including its original label marking it for analysis.

The existing [builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}#design-and-llm-roles-from-the-captured-dsl-article) and [framework research routes]({{< ref "ai/design-research/00-overview/07-collaboration-framework-research-routes" >}}#how-i-would-investigate-it) provide related discussion of learning through implementation and comparing prototypes. They remain separate from the retained pipeline-design proposal.

Read the [sibling comments]({{< ref "ai/design-research/interactive-systems/10-exploratory-pipeline-design-and-progressive-automation-comments" >}}) for source voice, runtime review, research descriptions, and the relation between observations and policies. The [source overview]({{< ref "engineering/eng-exp/exploratory-design" >}}) links the full split, and the [stage 9 audit]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-9-exploratory-pipeline-design) records every original range. References to attachments, project documents, research, and products remain unverified statements in the saved material.

<a id="retained-context-and-method-formulations"></a>

## Context and method formulations


<!-- Exploratory pipeline design source begins below. -->

The opening research outline broadens the frame from RAG to engineering methodology. The useful target is not "manual RAG," but a family of practices around staged pipelines, inspection surfaces, human steering, exploratory design, and progressive automation.

A naive AI pipeline prematurely commits to hidden policies for retrieval, ranking, Context Assembly, synthesis, and validation. During early development, these policies should be treated as hypotheses rather than fixed implementation details. The system should expose intermediate artifacts at selected stage boundaries, allow controlled intervention, persist traces of modifications and outcomes, and use those traces to derive, evaluate, and eventually automate stable policies.

problem:

Initial author question: How should this approach be conceptualized? Retrieval is the example, with an attached file referenced but not identified in this passage.

Initial example: A simple or complex RAG pipeline retrieves chunks by vector similarity and passes them to an LLM to generate an answer.

Proposed interaction point: The developer or user could inspect retrieved chunks, set priorities, order, or other parameters, and only then send them to the LLM.

--

Another example could be interactive algorithm adjustment based on summaries, or something similar.

--

The question concerns algorithm or pipeline development.

additional:

**interaction points**

Additional proposal: Introduce points for manually managing Context Assembly or other pipeline decisions. An interactive platform could support this work.

## Human-in-the-loop systems


**HITL systems** are about placing review, correction, approval, and escalation points inside an AI workflow. The purpose is risk control, quality improvement, compliance, and feedback capture.

**Human, system, and evaluator feedback loops**

That lets you include faster feedback from:

- human reviewers,
- domain experts,
- end users,
- automated judges,
- policy engines,
- deterministic validators,
- downstream system signals,
- production outcomes.

Strictly speaking, when the feedback comes from another model or system, it is no longer purely "human-in-the-loop." It becomes a **control loop**, **review loop**, or **evaluator loop**. That distinction is useful.

Relevant patterns include human review queues, approval gates, escalation paths, judge calibration, feedback flywheels, online and offline evaluation loops, production signal capture, edit-to-fix workflows, audit trails, and confidence-based routing.

TODO: Clarify the original `xxx` marker; no further text is recorded here.

You can design AI workflows with human review, feedback capture, escalation paths, and auditability where full automation is unsafe or immature.

This matters for startups selling into legal, healthcare, finance, operations, support, sales, and enterprise workflows. "Allus" explicitly mentions human feedback, review loops, and iterative task refinement.

Human-in-the-loop workflows, judge calibration. Feedback flywheels, online/offline feedback systems, production signal capture, edit-to-fix workflows.

### some thoughts on algorithm/pipeline development


Author hypothesis: Treating 'just get vector search results and give it to the machine to synthesize' as a fixed pipeline may be premature optimization. Open question: Why commit to that design before experimenting with different graphs or algorithms and then moving to automation and implementation?

Author scope correction: The question extends beyond RAG. Which broader engineering practices or approaches correspond to this style?

<a id="answer-1"></a>

# Proposed analysis 1


That is a different and broader point.

The LLM reframing treats the proposal as **interaction as a design method**, extending beyond **human-in-the-loop execution**: building the product and its algorithms through inspectable artifacts, feedback loops, experiments, and progressive formalization.

A compact name for this style:

> **model-first, experiment-driven pipeline design**

or, more specifically for the author's project:

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

The workflow document cited by the saved discussion already points in this direction. It says the durable value is not the first codebase, but the conceptual model, evidence model, invariants, and validated understanding of real boundaries. It explicitly shifts from architecture-first delivery to **model-first, prototype-assisted architectural discovery**.

## The broader family of approaches


Several established practices overlap with this style.

### 1. Design Science Research


Design Science Research treats artifacts as vehicles for inquiry. The artifact may be a construct, model, method, or implementation, and its value must be demonstrated through evaluation. Hevner et al.'s design-science guidelines explicitly frame design as artifact creation plus rigorous evaluation of utility, quality, and efficacy. ([WISE](https://wise.vub.ac.be/sites/default/files/thesis_info/design_science.pdf?utm_source=chatgpt.com "Design Science in Information Systems Research"))

This maps closely to the proposal:

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

In the proposed terminology:

```text
interaction point
  = not only a UI control
  = a thinking instrument
```


A context assembly interface is therefore not just a convenience. It is a way to discover what "good context" means.

### 3. Participatory / co-design


Participatory design treats users and domain experts as participants in shaping the system, not merely subjects who validate finished designs. Recent design literature describes participatory design as an iterative, flexible process involving stakeholders, often end users. ([Cambridge University Press & Assessment](https://www.cambridge.org/core/journals/design-science/article/participatory-design-a-systematic-review-and-insights-for-future-practice/C310A25B481980BE14AD4B38C0EE46D1?utm_source=chatgpt.com "Participatory design: a systematic review and insights for ..."))

For this design context, this does not need to mean a broad democratic design process. The useful kernel is:

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

For this design problem, the equivalent is:

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


This connects directly to the proposed failure taxonomy and evaluation harness. The workflow document cited by the saved discussion already says failure taxonomy should help derive evaluations, compare prototype variants, interpret regressions, and decide which boundaries are under pressure.

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


For the author's project, the proposal is to call this:

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


This matches the cited workflow document's delivery loop: define scenarios, define conceptual objects and evidence semantics, implement an evaluation harness and prototype, pressure the prototype, refine the model, then extract durable architecture from what held under pressure.

## The design-time interaction points


The proposal is to define two categories.

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

The author's clarification is mostly about the second category.

## Better framing for the document


The proposal is to write it like this:

> The system should not begin by assuming that the correct RAG pipeline is "vector search followed by synthesis." That pipeline is only one candidate baseline. At this stage, the design problem is to discover which intermediate artifacts, policies, failure modes, and evidence semantics matter.
>
> Therefore, the platform should expose interaction points not only for end-user control, but also for design-time experimentation. These interaction points allow the team to inspect intermediate artifacts, compare pipeline variants, collect feedback, annotate failures, and progressively convert repeated human or evaluator judgments into automated policy.

## The useful slogan

```text
Do not automate the unknown decision.
Expose it, interact with it, trace it, evaluate it, then automate it.
```


That is the broader engineering principle behind the proposed direction.

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

The strongest framing from the initial note is this:

> Do not automate an unknown decision.
> Expose it, interact with it, trace it, evaluate it, then automate it.

The proposal is to name the approach:

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

The most relevant combination for this design context is:

```text
Design Science
+ Interactive ML
+ Human-AI Interaction
+ Empirical Software Engineering
+ LLMOps Observability
+ Evaluation-driven development
```


This is why "human-in-the-loop" is too narrow. HITL often implies a mostly automated system with occasional human correction. The proposal is earlier and deeper: the interaction exists to **discover the correct system**.

## 4. Principal-engineer framing


The proposal is to frame the platform as:

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
