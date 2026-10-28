---
draft: false
toc: true
description: "Proposes explicit investigation budgets and logical-to-physical planning across cost, latency, coverage, and uncertainty, including when reusable compiled procedures justify their initial synthesis expense."
title: "03 Resource Aware Investigation Planning"
linkTitle: "03 Resource Aware Investigation Planning"
---

Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

## resources-point


The proposal is to make **resource consumption part of the semantics of the language**, because some investigation operators may differ by orders of magnitude in cost and latency.

It isn't unique to this domain--databases and scientific workflows also have expensive operators--but LLM/retrieval computations make it much more visible because cost can be data-dependent and probabilistic.

For example, these two operations may have the same logical type:

```text
search : Corpus × Query → EvidenceSet
```


but radically different execution contracts:

```text
approx_search(query)
  cost: low
  latency: seconds
  coverage: best_effort
```


versus:

```text
exhaustive_search(query)
  cost: high
  latency: minutes/hours
  coverage: complete
```


So the proposal is to avoid hiding this only inside the optimizer. Make resource properties first-class.

Something like:

```text
search[
  coverage = complete,
  max_cost = $20,
  max_time = 10m,
  parallelism = 32
](query)
```


Or at a program level:

```text
investigate question {
    budget {
        money <= $50
        wall_time <= 15m
        tokens <= 20M
    }

    require coverage == complete
    require provenance == exact

    ...
}
```


Now the compiler has a constraint-solving problem:

```text
epistemic requirements
        +
resource budget
        +
available operators
        ↓
physical execution plan
```


That is very close to a database query optimizer, except the objective function is richer.

A database optimizer mostly thinks about things such as:

```text
CPU
I/O
memory
latency
```


Ours could reason about:

```text
money
tokens
model calls
wall time
parallelism
context size
retrieval recall
coverage
semantic quality
uncertainty
```


So an operator might expose multiple physical implementations:

```text
find_evidence
├── vector_top_k
│     $0.001
│     ~100 ms
│     incomplete
│
├── hybrid_search
│     $0.01
│     ~1 s
│     better recall
│
├── summary_scan
│     $0.50
│     ~20 s
│     broad coverage
│
└── per_document_llm_scan
      $18
      ~4 min parallel
      complete corpus screening
```


Then this:

```text
find_evidence[coverage=complete]
```


cannot compile to `vector_top_k`.

While:

```text
find_evidence[
    coverage=best_effort,
    latency<2s
]
```


almost certainly should.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

The passages below come from the [typed investigation report]({{< ref "ai/design-research/06-research-reports/02-typed-durable-inspectable-runtimes" >}}). The report's [shared bibliography]({{< ref "ai/design-research/06-research-reports/02-typed-durable-inspectable-runtimes" >}}#references) remains in the main report.

### The compiler and optimiser


For paper one, the logical/physical distinction should be present but small:

```text
Logical:

find_evidence[
    screening = complete,
    provenance = exact
](question)

Physical candidates:

A. BM25 + dense top-k
   contract: best_effort

B. document-summary scan → deep candidate analysis
   contract: full_document_screening

C. per-document LLM scan
   contract: full_document_screening
```


The compiler should reject physical plan A when the logical program requires a full-corpus screening certificate. That is a clean demonstration of *semantic preservation under physical planning*. RUBICON provides the strongest database-style precedent for this separation; DSPy provides the strongest LM-program-optimisation precedent.

The proposal is to **not** make a sophisticated cost optimiser necessary for acceptance of the first paper. Two or three physical implementations per logical operator are enough to show that `(required contracts, budget, available implementations) -> valid physical plan` is meaningful. A later systems paper can learn cost/recall curves and optimise money, latency and semantic quality jointly.

### 5. Resource-aware probabilistic optimization


Database systems optimize plans because several physical implementations can satisfy the same logical query.

You have the same problem, except the cost surface is richer:

```text
money
latency
tokens
model calls
parallelism
coverage
recall
semantic quality
uncertainty
```


A logical operator such as:

```text
find_evidence[coverage=complete]
```


may have several physical implementations with radically different cost and quality.

The research problem is therefore:

> Given semantic requirements, uncertainty models, and resource constraints, choose a physical execution plan that satisfies the contract as cheaply as possible.

This is essentially **query optimization for probabilistic computation**.

## And LLMs become another physical operator


This is a very Stonebraker-compatible way to think about them.

An LLM isn't the computer.

It's something the computer can invoke:

```text
LLMClassify(...)
LLMExtract(...)
LLMCompare(...)
LLMSummarize(...)
LLMReframe(...)
```


Each operator has metadata:

```text
LLMCompare {
    deterministic: false

    estimated_cost(...)
    estimated_latency(...)

    input_type:
        Evidence × Evidence

    output_type:
        Probabilistic<Comparison>

    requires:
        provenance-preserving inputs
}
```


The optimizer may even choose among implementations:

```text
compare(a, b)

physical candidates:

1. exact comparison
2. embedding similarity
3. small LLM
4. frontier LLM
5. two-model adjudication
```


depending on the requested contract:

```text
budget
latency
quality
authority
coverage
```


This is much safer architecturally than giving the agent fifteen tools and hoping it chooses sensibly.

This also suggests an important concept: **resource effects**.

A type could carry epistemic effects and computational effects:

```text
EvidenceSet<
    coverage = complete,
    provenance = preserved,

    effects = {
        llm_inference,
        corpus_scan
    },

    estimated_cost = $12..$19,
    estimated_time = 80s..240s
>
```


The range matters because many costs won't be statically known.

Consider:

```text
corpus
| search
| for_each_candidate(extract)
| follow_up_if_ambiguous
```


The compiler doesn't know exactly how many candidates or ambiguities will exist.

So you need a distinction similar to:

```text
static cost estimate
runtime measured cost
remaining budget
```


And agents can respond to that.

For example:

```text
Budget: $20

Spent: $14.70

Unresolved requirements:
  R7
  R11

Planner:
  R7 exhaustive scan estimated $9–14
  R11 targeted scan estimated $1–2
```


The agent can decide:

```text
investigate R11
abstain on R7 because remaining budget
cannot satisfy its evidence requirement
```


Critically, that should appear in the final epistemic state:

```text
R7: UNRESOLVED

reason:
  investigation terminated due to resource budget

not:
  no evidence exists
```


That's a very important semantic distinction.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Cost of compilation and reuse


The following material comes from the abstraction analysis in [Behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}#abstraction-analysis). The original source context remains in that note. The original arguments are retained with editorial wording.

### Compilation economics


Compilation only pays when one or more of these hold:

- the operation repeats;
- later executions are costly;
- auditability has value;
- the program can be verified more strongly;
- execution latency matters;
- a reusable abstraction is discovered;
- the compiled workflow performs better than direct prompting.

For isolated, low-value problems, direct model execution may remain preferable.

### This also creates execution classes


One possible classification of operations is:

```text
cheap / local
    filter
    project
    metadata lookup

retrieval
    BM25
    vector search

moderate inference
    reranking
    extraction
    classification

expensive inference
    full-document analysis
    cross-document synthesis

very expensive
    exhaustive corpus scan
    iterative investigation
    multi-agent critique
```


Then the visual environment could make this visible.

A pipeline might show:

```text
[Corpus]
   │
   ▼
[Filter]       20ms
   │
   ▼
[Search]       1.2s / $0.03
   │
   ▼
[Deep Scan]    ~3m / ~$12       ← expensive
   │
   ▼
[Synthesize]   ~15s / ~$0.80
```


And because it's a program, the user or agent can modify it:

> Replace exhaustive scan with hierarchical screening.

The compiler estimates:

```text
Before:
$12–18
2–5 min
coverage: complete

After:
$2–4
30–70 sec
coverage: complete at document-summary level
deep coverage: candidate documents only
```


Now we're getting toward something more substantial than an agent workflow language.

The "compiler" has at least four jobs:

```text
                 Program
                    │
         ┌──────────┼──────────┐
         ▼          ▼          ▼
       types    epistemic    resource
                constraints   constraints
         │          │          │
         └──────────┼──────────┘
                    ▼
               logical plan
                    │
                    ▼
               optimizer
                    │
      quality × cost × time × coverage
                    │
                    ▼
              physical plan
```


And the working interpretation is that this gives us another strong principle:

> **The user specifies the epistemic result they require and the resources they're willing to spend; the compiler chooses how to investigate.**

For example:

```text
answer(question)
require coverage = complete
require authority = resolved
budget $10
deadline 2m
```


might fail at compile/planning time:

```text
Cannot satisfy requested contract.

Estimated minimum:
  cost: $17–24
  wall time: 3–6m

Possible relaxations:
  coverage: complete → best_effort
  deadline: 2m → 5m
  corpus: 18,420 → 6,200 documents
```


That is the kind of responsibility the proposal would move out of the LLM and into the runtime/compiler.
