---
draft: false
toc: true
description: "An annotated map of scientific workflows, provenance, DSPy, evidence agents, and program synthesis, distinguishing executable contracts from empirical quality and reusable investigation procedures."
title: "04 Investigation Systems And Related Work"
linkTitle: "04 Investigation Systems And Related Work"
---

Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

## analogues


The saved LLM review reports substantial prior work around the pieces, but did not identify one established system that combines them in the proposed form.

The closest conceptual map is:

|Area|What it contributes|How close|
|---|---|--:|
|Database provenance / provenance semirings|Algebra for preserving "why did this result exist?" through compositions|★★★★★|
|Scientific workflow DSLs|Typed operations, DAG execution, caching, reproducibility, provenance|★★★★★|
|DSPy|Programs composed of LM modules + compiler/optimizer|★★★★★|
|Palantir AIP / Foundry|Visual blocks + semantic objects + functions + agents + lineage|★★★★★|
|Co-STORM|Human + multi-agent collaborative investigation + evolving knowledge structure|★★★★☆|
|LangGraph|Stateful graph runtime for human/agent computation|★★★★☆|
|Argumentation theory|Claims connected by support/attack relations and formal acceptance semantics|★★★★☆|
|W3C PROV|Standard model of entities, activities, agents, derivation, revisions and plans|★★★★☆|
|Hebbia|Domain-expert research computation surface|★★★★☆|
|OpenScholar / PaperQA|Iterative evidence retrieval + synthesis + source attribution|★★★☆☆|

Several subjects merit particularly careful study.

<a id="2-scientific-workflow-systems-already-solved-a-lot-of-your-runtime-problem"></a>

### 2. Scientific workflow systems and existing runtime solutions


Look at **Nextflow, CWL and Snakemake**.

Nextflow explicitly describes itself as a DSL for data-driven computational pipelines built around a dataflow model. ([GitHub](https://github.com/nextflow-io/nextflow?utm_source=chatgpt.com "GitHub - nextflow-io/nextflow: A DSL for data-driven computational pipelines · GitHub"))

CWL has basically the philosophy we independently arrived at:

```text
small reusable tools
       ↓
explicit inputs/outputs
       ↓
compose into workflows
       ↓
DAG inferred from dependencies
       ↓
parallel execution
       ↓
provenance + reproducibility
```


CWL explicitly argues that workflow abstraction provides scaling, automation and provenance, with portable/reusable individual components. ([Common Workflow Language (CWL)](https://www.commonwl.org/features/?utm_source=chatgpt.com "Features | Common Workflow Language (CWL)"))

And CWLProv records execution provenance using W3C PROV. ([GitHub](https://github.com/common-workflow-language/cwlprov?utm_source=chatgpt.com "GitHub - common-workflow-language/cwlprov: Profile for provenance research object of a CWL workflow run · GitHub"))

This gives us a very useful precedent.

Imagine adapting the scientific-workflow idea:

```text
Nextflow

FASTQ
| align
| call_variants
| annotate
| report
```


into:

```text
Investigation DSL

Corpus
| search(question)
| extract_evidence
| find_conflicts
| verify_authority
| synthesize
```


The important difference is that their computation is mostly deterministic.

Ours has **epistemic effects**:

```text
may miss evidence
may hallucinate
may disagree
may abstain
may discover a new question
may require another pass
```


That means the language needs semantics scientific workflow DSLs don't have.

That's potentially research territory by itself.

### 3. DSPy is extremely close to the "programming language for LM computation" part


DSPy explicitly describes LM systems as **computational graphs composed of declarative modules**, and introduces compilation/optimization of those programs. ([ICLR Proceedings](https://proceedings.iclr.cc/paper_files/paper/2024/hash/f1cf02ce09757f57c3b93c0db83181e0-Abstract-Conference.html?utm_source=chatgpt.com "DSPy: Compiling Declarative Language Model Calls into State-of-the-Art Pipelines"))

Conceptually:

```text
program structure
      │
      ├── module
      ├── module
      └── module
           │
           ↓
       compiler
           ↓
choose prompts /
demonstrations /
model parameters
```


That separation is powerful.

We could borrow it at a different layer:

```text
Investigation program
        │
        ▼
logical operators

search
compare
validate
synthesize
        │
        ▼
investigation planner
        │
        ▼
physical operators

BM25
dense retrieval
generated-Q retrieval
LLM scan
reranker
GPT-5.x
Claude
etc.
```


So:

```text
search(query)
```


doesn't prescribe how search occurs.

Exactly like:

```sql
SELECT ...
```


doesn't prescribe whether PostgreSQL uses a sequential scan, B-tree or hash join.

That database/compiler model remains one of the strongest architectural directions here.

<a id="4-palantir-may-be-the-product-i-would-study-next"></a>

### 4. Palantir as a candidate for further study


This surprised me somewhat.

Palantir's current AIP Logic is a visual environment where functions consist of **blocks with inputs and outputs**, and blocks can read/write semantic objects, perform calculations, call functions or LLMs, loop and branch. Outputs feed subsequent blocks. ([Palantir](https://www.palantir.com/docs/foundry/logic/overview?utm_source=chatgpt.com "AIP Logic • Overview • Palantir"))

They also have an Ontology underneath:

```text
real-world objects
relationships
properties
actions
functions
```


and the same layer is accessible to humans and AI. Palantir explicitly describes this as enabling hybrid human-AI workflows. ([Palantir](https://www.palantir.com/docs/foundry/platform-overview?utm_source=chatgpt.com "Platform overview • Overview • Palantir"))

Then they have **Workflow Lineage**, which gives an interactive graph showing functions, models, applications, inputs and downstream dependencies. ([Palantir](https://www.palantir.com/docs/foundry/workflow-lineage/overview?utm_source=chatgpt.com "Workflow Lineage • Overview • Palantir"))

So conceptually they have:

```text
semantic domain model
        +
composable computation
        +
LLM operators
        +
human review
        +
agents
        +
lineage
        +
visual interfaces
```


That's very close structurally.

Their focus is operational enterprise computation:

```text
"Should we reroute this shipment?"
"Update this supplier."
"Resolve this customer issue."
```


The proposed focus is epistemic computation:

```text
"What is supported?"
"Why?"
"What contradicts it?"
"What wasn't examined?"
"Which source governs?"
"Do we know enough to conclude?"
```


That's a meaningful distinction, but the proposal is to study Palantir almost as closely as Hebbia.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

The passages below come from the [typed investigation report]({{< ref "ai/design-research/06-research-reports/02-typed-durable-inspectable-runtimes" >}}). The report's [shared bibliography]({{< ref "ai/design-research/06-research-reports/02-typed-durable-inspectable-runtimes" >}}#references) remains in the main report.

### Investigation and evidence systems


**PaperQA2** is probably the strongest academic baseline for the first experiment because it already combines literature retrieval, evidence-backed synthesis and contradiction detection. Beating generic RAG alone would be insufficient; the question should be whether typed contracts reduce omissions or invalid conclusions relative to an already competent evidence agent.

**OpenScholar** is the strongest warning against defining novelty as "iterative scientific RAG with better coverage and citations". It already performs adaptive retrieval and self-feedback at large scale and evaluates answer coverage and citation quality on ScholarQABench. The proposed paper needs to distinguish *coverage as a score that the system tries to improve* from *coverage obligations represented and enforced in the program*.

**STORM/Co-STORM** covers a substantial part of the collaborative-investigation story: multiple perspectives, evolving knowledge structure and human steering. It leaves open the more formal shared state you are proposing, where questions, evidence, conflicts and coverage are typed runtime objects with admissibility rules.

**Hebbia Matrix** is the closest commercial analogue to the inspectable user experience. It demonstrates the value of materialising intermediate research rather than hiding everything behind a final chat response. Its public material does not establish a generic type/effect discipline where a corpus-coverage certificate, authority policy and contradiction certificate must exist before finalisation. That distinction should be made carefully; proprietary implementation details are unknown.

**RA-RAG** occupies part of the "authority" space, but its notion is learned/estimated *source reliability*: cross-source agreement produces reliability estimates that guide retrieval and weighted voting. The proposed authority semantics are potentially different and, in many enterprise investigations, stronger: explicit precedence such as legislation > policy > guidance, accepted > draft, current > superseded, or primary > secondary. That policy-oriented authority model remains one of the clearest gaps identified by the saved review.

**FaithfulRAG** shows that contradiction handling itself is not novel. Its contribution explicitly detects fact-level conflict between retrieved context and parametric knowledge and reasons through it. The author's research claim needs contradiction to be a *state transition and acceptance condition*: an unresolved relevant conflict should prevent construction of a sufficiently strong finding or force a qualified/abstaining result.

**TRAQ** is perhaps the most important adjacent work conceptually. It demonstrates that RAG can carry a mathematical correctness guarantee when uncertainty is formulated appropriately, using conformal prediction. Rather than competing with this idea, the proposal is to cite it as evidence for a hierarchy of contracts: deterministic structural certificates, policy certificates, and statistical semantic guarantees can coexist in one typed result.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Related work from the behavioral dialogue


The following material comes from the abstraction analysis in [Behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}#abstraction-analysis). The original source context remains in that note. The original arguments are retained with editorial wording.

## The closest current work

### 1. ReaComp is the closest direct match


As of September 2026, the closest work identified by the saved review is **ReaComp: Compiling LLM Reasoning into Symbolic Solvers for Efficient Program Synthesis** by Atharva Naik and colleagues.

ReaComp gives a coding agent a collection of LLM reasoning traces. The coding agent writes a reusable symbolic solver over constrained DSLs. The resulting solver then handles new instances without LLM calls. This is nearly the proposed central transition:

```
LLM traces → coding agent → reusable symbolic program
```


The difference is scope. ReaComp focuses on program-synthesis benchmarks with clear executable semantics. The proposal applies the same transformation to richer outputs: text, claims, citations, domain entities, tool operations, and branches in a larger graph. The proposed target may also remain hybrid, containing both deterministic operations and model calls. [arXiv](https://arxiv.org/abs/2605.05485?utm_source=chatgpt.com)

### 2. Transductive and inductive program synthesis gives the right formal vocabulary


**Transductively Informed Inductive Program Synthesis**, published in 2025, separates two modes:

- a transductive model predicts outputs directly for concrete inputs;
- an inductive model generates a reusable program.

The transductive model then constrains and refines the inductive search. This is mathematically close to the proposal. The first LLM in the proposed design is the transductive solver; the second agent is the inductive synthesizer. [arXiv](https://arxiv.org/abs/2505.14744?utm_source=chatgpt.com)

This distinction is important:

```
Transductive capability:
    solve this instance

Inductive capability:
    infer a procedure that solves this class of instances
```


The proposed architecture explicitly places both inside one runtime.

### 3. CEGIS is the formal skeleton of the repair loop


**Counterexample-Guided Inductive Synthesis**, or CEGIS, alternates between:

1. proposing a candidate program;
2. checking it;
3. returning a counterexample when it fails;
4. synthesizing a new candidate that handles all accumulated counterexamples.

That is the clean formal model for the proposed compiler and verification loops. The major difference is that classical CEGIS usually has a precise logical specification and a sound verifier. The proposed system operates partly over open-ended semantics, so some counterexamples will be produced by tests, evidence checks, other models, or people. [EECS at UC Berkeley](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2008/EECS-2008-177.html?utm_source=chatgpt.com)

A suitable description is therefore:

> **CEGIS with a mixed symbolic and semantic verifier.**

Or more compactly:

> **soft CEGIS for agent programs.**

### 4. DSPy, GEPA, and TextGrad optimize compound model programs


**DSPy** represents model pipelines as programs and "compiles" them by optimizing prompts, demonstrations, and sometimes model weights against a metric. Its optimizers can collect execution traces, retain successful demonstrations, generate instructions, and search over candidate configurations. [arXiv](https://arxiv.org/abs/2310.03714?utm_source=chatgpt.com)

**GEPA** samples complete trajectories containing reasoning, tool calls, and tool outputs, reflects on failures, and evolves the prompts of a compound system. **TextGrad** propagates textual feedback through a computation graph to improve its components. [arXiv](https://arxiv.org/abs/2507.19457?utm_source=chatgpt.com)

These systems are close in optimization structure:

```
program → execute → score or critique → modify program
```


The difference is that DSPy generally starts from a developer-authored program skeleton. The proposal allows the structure of the program itself--its operations, branches, tools, intermediate artifacts, and decomposition--to be inferred from direct model behavior.

### 5. DreamCoder, LILO, and ReGAL address cumulative abstraction


**DreamCoder** solves tasks by synthesizing programs and periodically extends its DSL with reusable abstractions discovered across solutions. **LILO** combines LLM-guided synthesis, symbolic compression, and automatic documentation to create readable domain-specific libraries. **ReGAL** refactors existing programs into reusable functions and verifies the transformations by execution. [arXiv](https://arxiv.org/abs/2006.08381?utm_source=chatgpt.com)

This line of work becomes relevant after the proposed system has synthesized many node-level programs. The programs should eventually be compressed into reusable operations:

```
many executions
→ repeated subgraphs
→ learned reusable abstractions
→ expanded DSL or skill library
```


Without this step, the system repeatedly synthesizes similar workflows from scratch. With it, the DAG becomes a mechanism for **cumulative procedural knowledge**.

### 6. Voyager and Code as Policies compile language into executable skills


**Voyager** generates executable code skills, improves them using execution errors and self-verification, and stores successful programs in a growing skill library. **Code as Policies** generates executable robot policy code that composes available APIs and conventional programming constructs. [arXiv](https://arxiv.org/abs/2305.16291?utm_source=chatgpt.com)

These systems demonstrate the value of using code as the persistent representation of learned behavior:

- it is compositional;
- it can be executed repeatedly;
- it can be inspected;
- errors can be localized;
- skills can be reused.

They differ from the proposal because the environment supplies relatively direct success or failure signals. The proposed domains may require evaluating whether a textual claim is supported, whether citations preserve provenance, or whether a structured result satisfies a semantic constraint.

### 7. Logic-LM, PAL, and LMQL cover the executable-reasoning substrate


**Logic-LM** translates natural-language problems into symbolic formulations, executes them with a solver, and uses solver errors to repair the formalization. **PAL** has an LLM produce a runnable program as the reasoning representation and delegates execution to a Python interpreter. **LMQL** combines model prompting with scripting, control flow, and output constraints. [arXiv](https://arxiv.org/abs/2305.12295?utm_source=chatgpt.com)

These approaches assume a predefined execution model. The proposed approach goes one level higher: it attempts to infer the execution model or procedure from direct task performance.

### 8. Code-generation agents demonstrate the compiler-feedback loop


AlphaCodium, Self-Debugging, LEVER, SWE-agent, and related coding systems generate programs, run compilers or tests, inspect failures, and revise the program. [arXiv](https://arxiv.org/abs/2401.08500?utm_source=chatgpt.com)

They validate the practical value of:

```
generate
→ compile
→ execute
→ inspect errors
→ repair
```


Their correctness oracle is usually much stronger than yours because software tests have executable pass/fail semantics. The research challenge in this proposed setting is creating comparable feedback for text and structured knowledge outputs.

### 9. Graph and durable runtimes solve the execution part


AutoGen GraphFlow supports sequential, parallel, conditional, and looping agent graphs. Temporal provides persistent, replayable workflow execution across failures. These systems can implement the runtime substrate for the proposed DAG, retries, long-running tasks, and human review, but they do not infer the workflow from behavioral demonstrations. [Microsoft GitHub](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/graph-flow.html?utm_source=chatgpt.com)

### 9. Recent AI research is starting to approach the same concerns


There are several signals from 2025-26.

OpenScholar uses retrieval plus iterative self-feedback to synthesize scientific literature with source attribution, and explicitly evaluates answer coverage and citation accuracy. ([Nature](https://www.nature.com/articles/s41586-025-10072-4?utm_source=chatgpt.com "Synthesizing scientific literature with retrieval-augmented language models | Nature"))

A 2025 paper studies **document-level attribution in RAG**, including cases where documents are redundant, complementary or synergistic--which gets close to our question of how individual evidence contributes to a conclusion. ([arXiv](https://arxiv.org/abs/2507.04480?utm_source=chatgpt.com "Source Attribution in Retrieval-Augmented Generation"))

A July 2026 paper called **HIERARCHRAG** explicitly argues that flattening a corpus into a knowledge graph can destroy provenance and silently merge contradictory sources. It proposes preserving claim-level provenance through a hierarchical graph. It's very new, so the proposal is to treat it as exploratory work, but the problem statement is almost exactly one part of ours. ([SSRN](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7042057&utm_source=chatgpt.com "HIERARCHRAG: A Three-Layer Hierarchical Knowledge Graph for Provenance-Aware Retrieval-Augmented Generation by Luigi Barbato, Francesco Gargiulo :: SSRN"))

And the 2026 Nature paper on **Robin** shows an actual multi-agent scientific process where literature search, hypothesis generation, experimental analysis, and subsequent hypothesis refinement form a continuous loop. ([DOI](https://doi.org/10.1038/s41586-026-10652-y?utm_source=chatgpt.com "A multi-agent system for automating scientific discovery | Nature"))

There is even a 2026 perspective on MCP-native AI scientist ecosystems that argues for specialized workers communicating through explicit **information contracts**, with shared provenance linking high-level conclusions back to raw executions. ([Frontiers](https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2026.1820375/full?utm_source=chatgpt.com "Frontiers | Building MCP-native hierarchical AI scientist ecosystems: a perspective on scaling multi-agent scientific discovery"))

So several communities are converging on pieces of this.

The research gap proposed by the saved review is:

```text
                  Existing systems

Scientific workflows       AI agent runtimes
        │                         │
        │                         │
        └──────────┐   ┌──────────┘
                   │   │
             ?? INVESTIGATION ??
                   │   │
        ┌──────────┘   └──────────┐
        │                         │
Database provenance       Evidence synthesis
```


The saved review did not identify a system whose fundamental abstraction is:

```text
A typed, composable investigation program

where

• operations preserve provenance
• evidence has explicit source identity
• claims maintain support/contradiction structure
• authority is computable/configurable
• coverage is part of execution state
• insufficiency can cause abstention
• humans and agents can modify the same program
• programs can branch and iterate
• execution can be visualized in multiple ways
• programs themselves are reusable artifacts
```


Palantir gets surprisingly close on the **computational platform** side.

Hebbia gets closest on the **domain-expert investigation** side.

DSPy gets closest on the **LM programming model** side.

CWL/Nextflow get closest on the **DSL/runtime/reproducibility** side.

Provenance semirings get closest on the **formal lineage** side.

Co-STORM gets closest on the **collaborative human/MAS investigation** side.

Argumentation theory gets closest on the **claim/support/conflict semantics** side.

The working interpretation is that those six or seven bodies of work are more useful to study than another fifty RAG papers.

And this makes me more positive about the direction, because the pieces have strong precedents, but the composition appears underexplored. The central research question could eventually be something like:

> **What is the right computational model for evidence-seeking investigations performed jointly by humans and probabilistic agents?**

That's abstract enough to connect to existing CS theory, while still mapping directly onto a product.
