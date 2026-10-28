---
draft: false
toc: true
description: "A position-paper proposal connecting interactive retrieval, sensemaking, mixed initiative, and provenance to editable investigation state and hypotheses about diagnosis and correction."
title: "10 Interactive Investigation Position Paper"
linkTitle: "10 Interactive Investigation Position Paper"
---
# Interactive investigation position paper


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-10-01. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

The retained LLM reply proposes a position paper about interactive information work. Its motivation, literature synthesis, seven design principles, and evaluation agenda remain together. The publication framing is a proposal, not an accepted research plan or demonstrated result.

The complete [RAG and query-understanding examples]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}#interactive-rag-and-query-understanding) are in the existing retrieval note. The sibling [comments]({{< ref "ai/design-research/06-research-reports/10-interactive-investigation-position-paper-comments" >}}) explain the split and its limits.

The [interactive systems collection]({{< ref "ai/design-research/interactive-systems/00-index" >}}) provides related interface proposals. The [joint-activity model]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}) describes general collaboration mechanics, which are distinct from the principles below.

## Motivation, literature, and design principles


The working interpretation is that there is a publishable paper here, but the proposal is to frame the motivation more carefully than "researchers know this; practitioners don't read the papers."

There is evidence for a real gap, but it seems to come from several mechanisms.

First, the relevant knowledge is split across fields. Interactive IR, information seeking, HCI, visual analytics, end-user programming, mixed-initiative systems, provenance, and AI have developed partly separate research traditions. Work on interactive IR has explicitly noted the limited overlap between system-oriented IR, interactive IR, and information-seeking research. ([ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S0306457307000489?utm_source=chatgpt.com "On the role of user-centred evaluation in the advancement of interactive information retrieval - ScienceDirect"))

Second, the dominant evaluation methods often favor systems that are easier to measure offline. Classical IR evaluation reduces the problem to something like `query -> ranking -> relevance`, while interactive systems involve reformulation, learning, changing goals, and different users. Interactive evaluation is richer but also substantially more expensive and harder to reproduce. ([ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0306457322001182?utm_source=chatgpt.com "Toward Cranfield-inspired reusability assessment in interactive information retrieval evaluation - ScienceDirect")) Bates identified the underlying mismatch decades ago: real information needs change as people encounter information, while classical retrieval evaluation tends to assume a stable need. ([GSEIS Pages](https://pages.gseis.ucla.edu/faculty/bates/berrypicking.html?utm_source=chatgpt.com "The Design of Browsing and Berrypicking Techniques"))

Third, there is an organizational boundary. A study of 21 industry practitioners across 14 organizations found that conventional separation between AI engineering and UX design breaks down for Human-AI systems: interface requirements affect model behavior, data, and system components, so teams created ad-hoc representations to communicate across those boundaries. ([arXiv](https://arxiv.org/abs/2207.01749?utm_source=chatgpt.com "Human-AI Guidelines in Practice: Leaky Abstractions as an Enabler in Collaborative Software Teams")) This is quite close to the author's concern about practitioners and organizational decision-making, but it suggests a structural problem beyond people simply not reading HCI literature.

Fourth, many of these ideas cost more to implement. A chat product needs:

```text
input
→ model
→ output
```


What we're describing needs something more like:

```text
persistent state
+ incremental computation
+ provenance
+ representations
+ branching
+ multiple views
+ interaction design
+ latency management
+ correction semantics
```


That engineering-cost explanation is my inference, rather than something the literature above directly establishes.

And there is an important counterexample: when researchers have actually built systems around these principles, the results often look a lot like what impressed you about Matrix. **AI Chains**, for example, let people inspect and modify intermediate LLM operations; in its 20-person study, chaining improved task outcomes and increased transparency, controllability, and the users' sense of collaboration. Users could compare alternative branches and debug individual steps. ([DOI](https://doi.org/10.1145/3491102.3517582?utm_source=chatgpt.com "AI Chains: Transparent and Controllable Human-AI Interaction by Chaining Large Language Model Prompts | Proceedings of the 2022 CHI Conference on Human Factors in Computing Systems"))

So the working interpretation is that the paper's motivating question could be:

> We already know a great deal about designing interactive systems for uncertain, evolving information work. Why do contemporary LLM-based retrieval systems so often reduce the interaction to a query box followed by an answer?

That is a much stronger opening.

The author's Hebbia observation then works as the contemporary trigger. What caught the author's attention was specifically that Matrix exposes intermediate computation, makes it manipulable, supports multi-stage analysis, and turns the expert into an operator of the process.

The proposal is to make the first publication a **position/synthesis paper**, rather than claiming a novel empirical theory.

A possible title:

**Beyond the Query-Answer Interface: Established Principles for Interactive AI Information Systems**

Or, more specifically:

**From Retrieval to Interactive Investigation: Human-Centered Principles for RAG and Query Understanding**

The second is probably closer to what you actually want to say.

The core thesis could be:

> Current RAG systems usually treat information access as an automated transformation from a user query to retrieved context and an answer. Decades of research in interactive information retrieval, HCI, sensemaking, mixed-initiative systems, visual analytics, end-user programming, and provenance suggest a different model: information seeking is an iterative process in which users and computational systems jointly construct and revise representations of the information need, evidence, and emerging understanding. We synthesize these traditions into a set of design principles and show how they change the architecture of RAG and query-understanding systems.

The proposal is to structure the paper in five parts.

### 1. The problem: RAG inherited the wrong interaction abstraction


Start from the dominant pattern:

```text
query
 ↓
retrieve
 ↓
generate
 ↓
answer
```


Even sophisticated implementations largely make improvements _inside_ this pipeline:

```text
rewrite
decompose
hybrid retrieval
rerank
GraphRAG
agentic search
...
```


but the user commonly still experiences:

```text
ask
 ↓
wait
 ↓
answer
```


The point shouldn't be that such RAG is technically primitive. The issue is that its **interaction model hides the evolving investigation**.

Contrast:

```text
AUTOMATED PIPELINE

user → query → opaque process → answer
```


with:

```text
INTERACTIVE INVESTIGATION

             ┌── interpretations
             ├── questions
user ↔ state ├── retrieval operations
             ├── evidence
             ├── hypotheses
             └── conclusions
                   ↕
                 agents
```

### 2. Short literature review: the ideas already exist


The proposal is to keep this section deliberately concise and organized by _design problem_, not chronologically.

|Tradition|Established idea|Consequence for AI systems|
|---|---|---|
|Direct manipulation|visible objects; rapid, incremental, reversible actions|expose important intermediate state|
|Mixed initiative|human and machine contribute according to situation|initiative can move between user and AI|
|Interactive IR|information needs evolve through interaction|query interpretation must be revisable|
|Berrypicking / information foraging|information seeking unfolds through discoveries and changing strategies|preserve paths and branches|
|Sensemaking|users construct and revise external representations|representations are working objects|
|Distributed cognition|external representations participate in cognition|workspace is part of reasoning|
|End-user programming / spreadsheets|small high-level operations + strong visual structure|expose composable investigation operations|
|Interactive ML|feedback lets users inject domain knowledge during computation|correction should happen inside the process|
|Visual analytics|computation + interactive visualization|several coordinated views over shared state|
|Provenance|explicit entities, activities, agents and derivations|results must remain traceable|
|Human-AI guidelines|support correction, control and understandable behavior under uncertainty|error handling is ordinary interaction|

You have good anchor sources.

Shneiderman gives visible objects and rapid, incremental, reversible interaction. ([UMD Computer Science](https://www.cs.umd.edu/~ben/papers/Shneiderman1983Direct.pdf?utm_source=chatgpt.com "Direct manipulation systems offer the satisfying experience of operating on visible objects. The computer becomes transparent, and users can concentrate on their tasks."))

Horvitz gives mixed initiative as a coupling of automation and direct manipulation, with each participant contributing when appropriate. ([DOI](https://doi.org/10.1145/302979.303030?utm_source=chatgpt.com "Principles of mixed-initiative user interfaces | Proceedings of the SIGCHI conference on Human Factors in Computing Systems"))

Bates gives the evolving information need. ([GSEIS Pages](https://pages.gseis.ucla.edu/faculty/bates/berrypicking.html?utm_source=chatgpt.com "The Design of Browsing and Berrypicking Techniques"))

Interactive IR has explicitly studied query reformulation and interfaces for helping users alter their queries. ([ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0306457300000558?utm_source=chatgpt.com "Iterative exploration, design and evaluation of support for query reformulation in interactive information retrieval - ScienceDirect"))

Nardi and Miller give us an especially useful precedent for the computational surface: a small number of high-level, domain-specific operations combined with strong visual structure. ([Miramontes Interactive](https://www.miramontes.com/writing/spreadsheet-eup/?utm_source=chatgpt.com "Spreadsheets and end-user programming: Jim Miller / Miramontes Interactive"))

Distributed-representation research makes an even deeper claim: the form of an external representation affects what information can be perceived and what processes and structures can be discovered. ([ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/0364021394900213?utm_source=chatgpt.com "Representations in distributed cognitive tasks - ScienceDirect"))

Interactive ML demonstrates the value of letting users inject knowledge during model construction rather than confining them to preparing input before an automated process. ([ScienceDirect](https://www.sciencedirect.com/science/article/pii/S1071581901904999?utm_source=chatgpt.com "Interactive machine learning: letting users build classifiers - ScienceDirect"))

And W3C PROV gives an established formal vocabulary for tracing entities, activities, agents, uses, generations, and derivations. ([W3C](https://www.w3.org/TR/prov-primer/?utm_source=chatgpt.com "PROV Model Primer"))

### 3. Synthesize the literature into principles


The proposal is to be careful here: the claimed contribution is not that each principle is new.

The contribution is:

> **a synthesis for LLM-mediated information systems, plus architectural consequences.**

Perhaps seven principles:

**P1 -- Externalize the evolving problem state.**

Important interpretations, questions, evidence, hypotheses, and decisions should exist as persistent objects.

**P2 -- Support mixed initiative.**

Human and AI should both be able to introduce questions, revise representations, perform operations, and request clarification.

**P3 -- Make operations incremental, inspectable, and reversible.**

The user should see the consequences of an intervention and be able to revise it locally.

**P4 -- Treat the information need as evolving.**

Query understanding is an iterative process whose previous states and branches remain available.

**P5 -- Provide composable operations over typed information objects.**

Search, decomposition, evidence extraction, comparison, critique, etc. should form a small computational vocabulary.

**P6 -- Separate shared investigation state from its views.**

Matrix, graph, source view, evidence table, timeline, and conversation are coordinated projections of the same state.

**P7 -- Preserve provenance and epistemic status throughout computation.**

Claims, transformations, evidence, uncertainty, source authority, and human/AI interventions retain their derivation.

That is already enough. The recommendation is not to try to publish 15 principles.

The worked examples from parts 4 and 5 are in the [retrieval note]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}#interactive-rag-and-query-understanding). The original reply resumes below with its evaluation agenda and closing argument.

## Evaluation agenda and closing argument


And the proposal is to end the paper with an evaluation agenda, because otherwise reviewers can reasonably ask whether these principles merely produce a more complicated UI.

The hypotheses become testable:

```text
H1  Interactive query models improve retrieval success
    on vague and exploratory information needs.

H2  Exposed intermediate representations let users
    diagnose retrieval failures more accurately.

H3  Local correction reduces recovery cost after an
    incorrect AI interpretation.

H4  Persistent investigation state improves performance
    on multi-stage information-seeking tasks.

H5  Experts benefit more from controllability as domain
    ambiguity and consequence increase.
```


Metrics shouldn't just be retrieval `nDCG` or answer correctness. Measure:

```text
task success
time / interaction cost
number of unrecovered failures
quality of final evidence set
ability to detect system error
correction cost
user understanding of system state
confidence calibration
provenance recovery
```


That also connects back to the historical problem: interactive IR evaluation has long argued that ranking metrics alone don't capture user effectiveness and usefulness. ([ScienceDirect](https://www.sciencedirect.com/science/article/pii/030645739290007M?utm_source=chatgpt.com "Evaluation measures for interactive information retrieval - ScienceDirect"))

So the working interpretation is that the publication should make one central argument:

> **LLMs made sophisticated information processing cheap enough to automate, but automation does not remove the need for decades-old principles of interactive information work. It makes those principles more important, because much more consequential computation is now hidden behind a conversational interface.**

Then RAG/query understanding becomes the worked demonstration of what happens when we take those principles seriously.

This is a credible position paper because we wouldn't claim that "we invented interactive AI." The novelty would be the **synthesis, translation into explicit architectural principles, and their application to modern RAG/query-understanding pipelines**.
