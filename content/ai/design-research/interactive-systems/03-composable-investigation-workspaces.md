---
draft: false
toc: true
aliases:
  - "/contributions/investigation-composition/"
description: "A dialogue on typed investigation operations, provenance-preserving composition, inspectable nested blocks, and evidence constraints, with visual graphs derived from dependencies."
title: "03 Composable Investigation Workspaces"
linkTitle: "03 Composable Investigation Workspaces"
---
# Composable investigation workspaces


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Editorial navigation added on 2026-04-01. The retained passage begins below. -->

The dialogue follows the [shared-state proposal]({{< ref "ai/design-research/interactive-systems/01-shared-investigation-state-and-views" >}}) and [interface-component proposal]({{< ref "ai/design-research/interactive-systems/02-stable-interface-components" >}}). It preserves the user's correction that matrices, cubes, and graphs could restrict the ways people combine useful operations.

The question and complete reply remain together. The reply proposes typed operations, preserved provenance, progressively inspectable blocks, and composition by people and agents. The original heading is retained below.

Related notes develop the [investigation algebra]({{< ref "ai/design-research/04-investigation-and-epistemics/01-investigation-language-and-algebra" >}}) and [epistemic contracts]({{< ref "ai/design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag" >}}). The next [retrieval dialogue]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}) asks about multidimensional representations and views.

The [comments]({{< ref "ai/design-research/interactive-systems/00-index-comments" >}}) record unresolved distinctions, and the [reassembly map]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}) records the original range.

<a id="original-dialogue"></a>

## Initial questions and proposals

# pipelines


Author concern: Hebbia's 2d Matrix and the proposed cubes and projections could make the mental model of possible graphs and processes too rigid. Open proposal: Provide small useful blocks and components while leaving users free to combine them, as in Unix pipelines.

TODO: Clarify the original `XXX` marker; no further text is recorded here.

The working interpretation is that this is a better abstraction than "we need a more powerful Matrix."

The important shift is:

> Don't choose the shape of the investigation. Define a small set of useful operations that compose.

Hebbia chose a spreadsheet as the main computational metaphor. We were starting to choose graphs/cubes. Both choices can accidentally force the investigation into the shape of the UI.

The Unix analogy is strong.

Unix gives you small operations:

```text
cat | grep | sort | uniq | head
```


Nobody designed a dedicated "find the ten most common errors in these logs" application. The user constructs it from primitives.

For this product, the equivalent could be:

```text
sources
| decompose-question
| search
| expand-context
| extract-evidence
| check-authority
| find-conflicts
| synthesize
```


Or a completely different investigation:

```text
sources
| per-document
    | summarize
    | generate-questions
| search($query)
| group-by(authority)
| compare
```


And another:

```text
sources
| filter(type="principle")
| extract-claims
| join(
    sources
    | filter(type="practice")
    | extract-claims
  )
| find-conflicts
```


No Matrix or cube needs to be fundamental.

The resulting pipeline naturally becomes a graph once there are branches, joins and loops:

```text
                         ┌─ dense-search ──────┐
query ─ decompose ───────┼─ lexical-search ───┼─ union
                         ├─ hypothetical-Q ────┤    │
                         └─ claim-search ──────┘    │
                                                   ▼
sources ─ authority-policy ──────────────────── evidence
                                                   │
                                          ┌────────┴───────┐
                                          ▼                ▼
                                      conflicts        synthesis
                                          │                │
                                          └───────┬────────┘
                                                  ▼
                                               answer
```


But critically, **the graph emerges from composition**. We don't tell the user "research is a graph."

### The Unix analogy has one important difference


Unix has an exceptionally powerful universal interface:

```text
stdin → bytes → stdout
```


That's why arbitrary programs compose.

We need our equivalent.

Plain text would be too lossy. Every operation should probably exchange a small number of typed objects:

```text
Source
SourceUnit
Query
Evidence
Claim
Finding
Entity
Task
Artifact
```


And every object carries provenance.

For example:

```typescript
Evidence {
  content
  source
  location

  generatedBy
  inputQuery
  representation
  retrievalMethod

  authority
  confidence
}
```


Then an operator doesn't output some arbitrary prose blob.

`search` produces:

```text
Query → Evidence[]
```


`extractClaims`:

```text
Evidence[] → Claim[]
```


`findContradictions`:

```text
Claim[] → Conflict[]
```


`authority`:

```text
Evidence[] × AuthorityPolicy → Evidence[]
```


`synthesize`:

```text
Evidence[] → Finding
```


This gives you something that Unix deliberately doesn't have: **lineage is preserved through the pipe**.

You could click a sentence in the final synthesis and traverse backward:

```text
conclusion
    ↓
claim
    ↓
evidence
    ↓
retrieval operation
    ↓
query representation
    ↓
paragraph summary
    ↓
original paragraph
    ↓
original document
```


That would be central to the product.

## The blocks should exist at different levels


The recommendation is not to make every primitive extremely low-level.

You want something analogous to Unix having both `read()` and `grep`.

A user might have primitive retrieval blocks:

```text
embed-search
lexical-search
hypothetical-question-search
entity-search
```


But most domain experts probably want:

```text
search
```


which internally contains those.

They can open it:

```text
┌ Search ──────────────────────────────┐
│                                     │
│ query                               │
│   │                                 │
│   ├─ dense search ──────────┐        │
│   ├─ BM25 ─────────────────┤        │
│   ├─ hypothetical-Q ───────┼─ union │
│   └─ claim matching ───────┘        │
│                                     │
│ reranker                            │
│ top-k: 80                           │
└─────────────────────────────────────┘
```


So blocks can themselves be pipelines.

That gives you abstraction without hiding everything permanently.

It also gives domain experts a way of progressively moving deeper:

```text
"I want to search the corpus."

          ↓

uses Search block

          ↓

"Why didn't it find this document?"

          ↓

opens Search block

          ↓

sees retrieval strategies and candidates

          ↓

changes hypothetical-question weighting
```


That feels substantially better than exposing a complex retrieval system from the start.

## Matrix then becomes an operator


This is a particularly promising part of the proposal.

Matrix doesn't disappear.

It becomes something like:

```text
map
```


or:

```text
evaluate-each
```


For example:

```text
documents
| matrix(
    "What is the termination clause?",
    "Who can terminate?",
    "What notice is required?"
  )
```


Produces:

|document|termination|party|notice|
|---|---|---|---|

The Matrix is simply the natural visualization for that operation.

Similarly:

```text
claims
| compare-by(source)
```


might naturally render a matrix.

And:

```text
events
| order-by(date)
```


renders a timeline.

And:

```text
claims
| trace-dependencies
```


renders a graph.

And:

```text
evidence
| group-by(authority)
```


might render a table/tree.

So instead of:

> User selects UI -> performs investigation inside UI.

it's:

> Investigation generates data -> system chooses useful projections.

The user can always change the projection.

That resolves much of the earlier cube discussion.

The really good consequence is that **humans and agents can use the same computational language**.

A human could assemble:

```text
Corpus → Search → Evidence → Synthesis
```


Then an agent sees an unresolved question and modifies it:

```text
Corpus → Search → Evidence
                    │
                    ▼
              Find Conflicts
                    │
                    ▼
               Synthesis
```


A domain expert notices that newer sources should dominate and inserts:

```text
Evidence
   ↓
Authority Policy
   ↓
Synthesis
```


A critic agent sees inadequate evidence:

```text
Evidence
   ↓
Coverage Check
   ↓
INSUFFICIENT
   ↓
Reframe Query
   ↓
Search
```


Nobody has to switch abstractions.

That gets you much closer to the collaborative investigation environment you were describing earlier.

### It could become something like a research shell


Imagine starting with:

> What governs our choice of consistency model for inventory updates?

The system initially builds:

```text
[Corpus] → [Search] → [Synthesize]
```


You get an answer and three visual blocks.

You say:

> Check all architecture principles independently.

It modifies the workspace:

```text
                     ┌ [filter: principles]
[Corpus] ────────────┤
                     └ [Search]
                          │
                          ▼
                       [Evidence]
                          │
                          ▼
                      [Synthesize]
```


Then:

> Compare those principles against our existing ADRs.

```text
[principles] → [extract claims] ──────┐
                                      ├→ [compare] → [conflicts]
[ADRs]       → [extract decisions] ───┘
```


Then:

> Investigate conflict #3.

That output becomes the input for a new branch.

You haven't "started another chat."

You've **continued the investigation**.

That is an important difference.

<a id="i-wouldnt-make-it-completely-unconstrained"></a>

## Proposed limits on composition


The LLM critique questions "don't restrict how users combine them."

Unix composition works because every program obeys a strict interface.

We need the same thing.

Users should be free in how they compose operations, while the operations themselves should have strong contracts.

For example:

```text
find-conflicts

accepts:
  Claim[]
  Evidence[]

doesn't accept:
  arbitrary string
  Chart
```


And perhaps:

```text
synthesize

requires:
  evidence with provenance

optional:
  authority policy
  coverage report
```


Otherwise you end up with an AI version of low-code workflow builders where almost anything can connect to anything and nobody can reason about what the workflow means.

The proposal is to prefer:

**small vocabulary + strong semantics + unrestricted valid composition.**

That's very Unix-like.

## And some blocks shouldn't transform data at all


This is another useful class.

There could be **assertion blocks**:

```text
[Require Corpus Coverage ≥ 99%]

[Require Primary Sources]

[Abstain If Unsupported]

[Require Two Independent Sources]

[Current Documents Only]

[Normative > Informative]
```


So:

```text
Evidence
    ↓
[Require Primary Sources]
    ↓
[Require Corpus Coverage]
    ↓
Synthesis
```


Those are research constraints expressed as computation.

That's potentially one of the strongest proposed differences from generic agent orchestration tools.

You aren't only composing:

> what the AI should do.

The model composes:

> **under what epistemic conditions its result is acceptable.**

That connects the initial concerns--abstention, authority, coverage, provenance--to the Unix-block idea extremely well.

The resulting proposal is to stop thinking of the product primarily as a "retrieval system."

The core might be closer to a **composable investigation runtime**:

```text
           small typed operations
                    +
             provenance-preserving
                data pipes
                    +
         human + agent composition
                    +
            interactive projections
                    +
           epistemic constraints
```


Hebbia's Matrix could then be seen as one very successful special case of this model:

```text
Hebbia Matrix ≈
    sources
    | for-each(row)
    | evaluate(columns)
    | table
```


And that's a much clearer way to think about how you could go beyond it without merely adding more dimensions to the Matrix.
