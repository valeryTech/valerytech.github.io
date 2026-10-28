---
draft: false
toc: true
description: "Proposes an investigation abstract machine combining evidence operations, dataflow, iteration, provenance, and epistemic contracts, with reusable programs shared by visual editors, engineers, and agents."
title: "01 Investigation Language And Algebra"
linkTitle: "01 Investigation Language And Algebra"
---

Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

Initial question: Could investigation be represented as abstract computation on a machine and connected to more fundamental theory without excessive abstraction? Would a DSL provide a useful way to enter this domain?

TODO: Clarify the original `XXX` marker; no further text is recorded here.

The working interpretation is that there's a useful level of theory here, and it sits somewhere between "workflow builder" and "formal calculus."

The proposal is to model it as an abstract machine for investigations.

The machine has state:

```text
MachineState {
  corpus
  representations
  intermediate_results
  claims
  evidence
  lineage
  authority_policy
  coverage_state
  work_queue
}
```


and a relatively small instruction set:

```text
search
filter
map
expand
extract
join
group
compare
rank
reduce
branch
iterate
assert
abstain
```


Then an investigation is a program executed by that machine.

For example:

```text
corpus
| search(query)
| expand(parent=section)
| extract(claims)
| filter(authority >= normative)
| find_conflicts
| synthesize
```


That gives you a DSL almost immediately.

The key is that the DSL should describe the investigation, while the runtime decides how to execute it.

For example:

```text
search(query)
```


might compile internally to:

```text
dense_search
|| lexical_search
|| hypothetical_question_search
|| claim_search
→ union
→ rerank
```


So the user works at one abstraction level, while an expert can open the block and inspect or modify the lower-level plan.

There are several pieces of existing theory that fit without becoming academic decoration.

First, relational algebra.

A surprising amount of research work is:

```text
select
project
join
group
filter
aggregate
```


Evidence retrieval fits this naturally.

Example:

```text
principles
| join(practices, on=topic)
| filter(conflicts)
```


Matrix is basically one projection of this relational computation.

Second, dataflow systems.

The proposed operators naturally form a DAG:

```text
               ┌ search A ─┐
query → split ─┼ search B ─┼→ merge → evidence → synthesis
               └ search C ─┘
```


This gives you scheduling, parallelism, caching and incremental recomputation almost for free conceptually.

If one source changes, you don't recompute the entire investigation.

```text
source changed
    ↓
invalidate dependent nodes
    ↓
recompute affected branch
```


This makes the system feel somewhat like `make`, Bazel, spreadsheets or reactive programming.

The product might be closer to a **build system for knowledge** than to a chatbot.

Third, fixed-point computation.

Investigations frequently contain loops:

```text
retrieve
→ learn vocabulary
→ reformulate
→ retrieve again
→ discover another distinction
→ retrieve again
```


You need some condition that says when the loop has converged.

For example:

```text
repeat {
    evidence = search(query)
    gaps = identify_gaps(evidence)
    query = reframe(query, gaps)
}
until no_new_evidence
   or all_requirements_satisfied
   or budget_exhausted
```


This is essentially fixed-point evaluation.

Datalog and database recursion have decades of theory around this exact kind of problem. The recommendation is not to expose Datalog to users, but the semantics are useful.

Fourth, provenance algebra.

This one may be particularly valuable for the proposed product.

Suppose:

```text
Claim C
```


exists because:

```text
Evidence A AND Evidence B
```


while another claim is supported by:

```text
Evidence C OR Evidence D
```


You want provenance itself to survive composition.

So instead of a result being just:

```text
"value"
```


it is closer to:

```text
Result<T> {
    value: T
    lineage: ...
}
```


Every operator combines lineage according to explicit rules.

For example:

```text
A ─┐
   ├─ join → X
B ─┘
```


means X carries dependency on both A and B.

While:

```text
A ─┐
   ├─ union → X
B ─┘
```


means X may have alternative provenance paths.

Database provenance research formalizes this with provenance semirings. You probably don't need to expose that term in the product, but the underlying idea is almost exactly what you need.

It lets you answer:

> Why is this claim here?

> Which source would need to disappear for this conclusion to stop being supported?

> Does this conclusion depend entirely on one low-authority document?

Those are much deeper provenance queries than simple citations.

Fifth, types.

The working interpretation is that the DSL should be strongly typed.

Not:

```text
block → block → block
```


where everything is arbitrary JSON.

More like:

```text
search:
    Query × Corpus → EvidenceSet

extract_claims:
    EvidenceSet → ClaimSet

find_conflicts:
    ClaimSet → ConflictSet

synthesize:
    EvidenceSet → Finding
```


Then the editor itself can tell the user what can legally connect.

And you can introduce semantic types:

```text
PrimaryEvidence
NormativeSource
Claim
Contradiction
CoverageReport
AuthorityPolicy
```


That matters because:

```text
synthesize(EvidenceSet)
```


is different from:

```text
synthesize(VerifiedEvidenceSet)
```


You could even make constraints part of the type system.

For example:

```text
evidence
| require(primary_sources)
| require(corpus_coverage >= .99)
| require(no_unresolved_conflicts)
| synthesize
```


The output becomes something like:

```text
Finding<
  coverage=complete,
  authority=verified,
  conflicts=resolved
>
```


That's effectively a lightweight proof system.

The recommendation is not to go too far into theorem proving. But this gives you a clean way of expressing the initial requirement:

> An answer is only valid if certain evidence conditions were satisfied.

That's stronger than adding a confidence score.

A proposed theoretical stack is:

```text
User DSL
    ↓
typed investigation program
    ↓
logical execution graph
    ↓
optimizer / planner
    ↓
physical operators
    ↓
LLMs + indexes + tools
```


Very much like a database:

```text
SQL
 ↓
logical query plan
 ↓
query optimizer
 ↓
physical plan
 ↓
indexes / joins / scans
```


That analogy may be more useful than OLAP.

The proposed DSL becomes to investigation what SQL is to relational data: a description of what result you want and some constraints on how it should be established.

The runtime can decide whether a `search` means vector retrieval, corpus-wide LLM screening, hypothetical-question matching, BM25, or a combination.

A simple DSL could look like:

```text
from corpus("architecture")

let principles =
    search("governing principles for retries")
    | authority(type="normative")

let practices =
    search("current retry practices")

let conflicts =
    compare(principles, practices)
    | contradictions()

return synthesize(conflicts)
    require coverage >= 0.99
    require citations
    abstain if unsupported
```


Then power users could descend a level:

```text
search "retry principles" {
    parallel {
        dense(top=50)
        lexical(top=50)
        hypothetical_questions(top=50)
    }

    union
    expand parent_section
    rerank(top=30)
}
```


That gives you a very nice property:

**the visual editor and the DSL are two representations of the same program.**

A domain expert manipulates blocks:

```text
[Corpus] → [Search] → [Authority] → [Compare] → [Synthesize]
```


An engineer sees:

```text
corpus
| search(...)
| authority(...)
| compare(...)
| synthesize
```


An agent manipulates the underlying AST/graph.

All three are editing the same thing.

The proposal is to resist going much further into lambda calculus, category theory, tensor algebra, etc. They can provide elegant descriptions, but they probably won't improve the product architecture much.

The theories considered useful here are:

- relational algebra for manipulating sets of evidence;
- dataflow graphs for execution;
- fixed-point semantics for iterative investigation;
- provenance algebra for lineage;
- type/effect systems for epistemic constraints;
- query optimization for choosing efficient execution strategies.

Together, these suggest a tentative model of an **investigation language + runtime**, with Matrix, graph, report, evidence ledger, and other UIs as views over programs and their execution state.

And there is a deeper product idea hiding in this: the reusable artifact may eventually be the **investigation program itself**, not the answer.

Someone could publish:

```text
"Architecture proposal review"
```


as a reusable program containing:

```text
find governing principles
→ locate previous decisions
→ inspect relevant incidents
→ find contradictions
→ identify missing evidence
→ produce review
```


Then humans and agents run that program repeatedly over new questions and new corpora.

That starts to look like an actual domain-specific computing environment rather than another research UI.

<a id="where-i-think-a-new-theory-actually-belongs"></a>

## A proposed place for new theory


The proposal is to **not** start by inventing a new database model.

The novel layer is above the DBMS:

```text
relational algebra
       +
investigation algebra
       +
provenance semantics
       +
epistemic effects
```


Maybe:

```text
Find<Q, C>           Corpus → CandidateSet
Screen<R>            Corpus → ScreeningResult
Extract<E>           CandidateSet → EvidenceSet
Support              Evidence × Claim → Relation
Contradict           Evidence × Claim → Relation
Resolve<A>           Evidence × AuthorityPolicy → Evidence
Synthesize           EvidenceSet → Finding
VerifyCoverage       Run → CoverageCertificate
```


And each operator has semantics.

For example:

```text
Find[best_effort]
```


and:

```text
Find[complete]
```


have different contracts.

The compiler knows:

```text
Find[complete]
    requires a plan whose
    corpus participation = complete
```


while:

```text
Find[best_effort]
```


can compile into top-k retrieval.

This is where the new research could live.

The recommendation is not to call it "field theory," because mathematically a field has a very specific meaning and we don't seem to need that structure.

**Algebra**, **calculus**, **query language**, or **computational model** are more accurate.

Perhaps:

> investigation algebra

would be the least presumptuous working name.

<a id="one-place-where-i-would-depart-from-rubicon"></a>

## A proposed departure from Rubicon


Rubicon deliberately pushes toward relations:

```text
everything
    ↓
logical tables
    ↓
relational optimizer
```


That makes sense for its target.

The recommendation is not to force all of our semantics into flat tables.

The proposal is to distinguish:

```text
Logical values

Set<T>
Relation<A,B>
Tree<T>
Graph<N,E>
Stream<T>
Scalar<T>
```


while still allowing the physical implementation to live in relational storage.

For example:

```text
DocumentTree
```


has semantic operations:

```text
parent
children
ancestors
descendants
siblings
```


A claim graph has:

```text
supports
contradicts
depends_on
supersedes
```


The compiler can lower those to joins/recursive SQL.

That's exactly what compilers do:

```text
high-level semantics
        ↓
lower-level representation
```


We shouldn't let the capabilities of Postgres dictate the semantics of the language.
