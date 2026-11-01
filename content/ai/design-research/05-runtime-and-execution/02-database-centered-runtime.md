---
draft: false
toc: true
title: "5.2 Database-Centered Runtime"
description: "Analyzes DBOS durability and Rubicon query planning, proposing an investigation compiler over existing databases rather than a new DBMS, alongside Stonebraker interview passages on metadata and transactions."
weight: "20"
linkTitle: "5.2 Database-Centered Runtime"
---
## Stonebraker proposition


Yes--**Michael Stonebraker** is the person. The relevant ideas are his **DBOS** proposal and his newer **Rubicon** approach to LLM-assisted data access. He does _not_ advocate putting an unconstrained LLM agent in charge of the database; he argues for letting the database/SQL system orchestrate work and using LLMs only for parts they handle well.[[heavybit](https://www.heavybit.com/library/podcasts/data-renegades/ep-11-contrarian-bets-and-ai-skepticism-with-michael-stonebraker)]

## DBOS: database as runtime


Stonebraker's original DBOS research premise was that Linux-scale systems would be better built with a database at their core:

1. Put application and OS state in distributed database tables.
2. Access that state solely through transactions.
3. Build services such as scheduling, filesystem functions, and inter-process communication above the DBMS.[[dbos-project.github](https://dbos-project.github.io/blog/intro-blog.html)]

In the podcast, he says this insight came from observing that Databricks scheduled roughly a million Spark instances by storing scheduler state in Postgres and running the scheduler as a database application. From that, he generalized that Linux scheduling, the filesystem, and other OS functions could benefit from a database implementation.[[heavybit](https://www.heavybit.com/library/podcasts/data-renegades/ep-11-contrarian-bets-and-ai-skepticism-with-michael-stonebraker)]

The primary gain is not merely performance. It is **durability and correctness**: atomic updates, recovery after failure, concurrency control, logging, provenance, and auditability become properties inherited from transactions rather than application code each team must rebuild.[[dbos-project.github](https://dbos-project.github.io/blog/intro-blog.html)]

## His LLM-agent position


Stonebraker's view is notably skeptical of mainstream agentic AI:

- Public text-to-SQL benchmarks can show roughly 80%-plus accuracy, but he reports about **10% accuracy** when applying the touted models to an MIT Oracle warehouse with approximately **1,400 tables**.[[heavybit](https://www.heavybit.com/library/podcasts/data-renegades/ep-11-contrarian-bets-and-ai-skepticism-with-michael-stonebraker)]
- Providing the correct `FROM` clause and join predicates raised results only to the 30%-plus range in that example.[[heavybit](https://www.heavybit.com/library/podcasts/data-renegades/ep-11-contrarian-bets-and-ai-skepticism-with-michael-stonebraker)]
- He attributes the gap to proprietary/unseen data, idiosyncratic local terms, messy and overlapping schemas, obscure column names, materialized views, and long production queries--rather than short, clean benchmark queries.[[heavybit](https://www.heavybit.com/library/podcasts/data-renegades/ep-11-contrarian-bets-and-ai-skepticism-with-michael-stonebraker)]

So his claim is **not** "agents will operate the database autonomously." It is closer to:

> A database-native planner should control the workflow; the LLM should be a bounded component used where its language or extraction skills are useful.

## Rubicon's architecture


Stonebraker calls the project **Rubicon**. It is an interactive data-access system that requires a human to supply semantic metadata such as appropriate tables and join paths, rather than asking an LLM to infer everything from a natural-language question.[[heavybit](https://www.heavybit.com/library/podcasts/data-renegades/ep-11-contrarian-bets-and-ai-skepticism-with-michael-stonebraker)]

For multi-source questions, his team's direction is to convert heterogeneous resources into structured tables and perform joins/query planning with SQL-like machinery. The LLM is then used as a component, rather than as the high-level orchestrator that decides every retrieval and tool call.[[heavybit](https://www.heavybit.com/library/podcasts/data-renegades/ep-11-contrarian-bets-and-ai-skepticism-with-michael-stonebraker)]

Illustration:

```
\text{User request} \rightarrow
\text{human/metadata-guided schema selection} \rightarrow
\text{SQL-style plan and joins} \rightarrow
\text{LLM for limited interpretation or generation} \rightarrow
\text{validated result}
```


This is almost the reverse of a typical agent system:

|Conventional agentic pattern|Stonebraker's Rubicon direction|
|---|---|
|LLM chooses tools, plans, retrieves, and synthesizes|SQL/database planner controls data access and combination|
|Schema and joins inferred by the model|Essential tables, joins, and metadata explicitly supplied|
|LLM maintains working state implicitly or in prompts|Database holds durable, queryable state|
|Output plausibility may substitute for verification|Database constraints, transaction semantics, and structured queries supply control|

## Why DBOS matters for agents


DBOS gives a natural runtime model for agents and workflows: each step can be a transaction, each workflow state is durable, retries are recoverable, and concurrent activity can be coordinated without handwritten distributed-systems logic. DBOS's published design specifically uses a database for scheduler/task state and uses transactional operations to manage concurrent access and failure recovery.[[dbos-project.github](https://dbos-project.github.io/blog/intro-blog.html)]

But Stonebraker's key warning is that **database durability does not make an LLM's reasoning reliable**. DBOS can make an agent execution traceable and recoverable; Rubicon aims to make the data-retrieval portion more accurate by replacing free-form agent orchestration with explicit metadata plus SQL-style planning.

<a id="answer"></a>

# Proposed analysis


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The working interpretation is that Stonebraker's direction is highly relevant here. The proposal is to separate three decisions: what should be delegated to an existing DBMS, what belongs in our investigation runtime/compiler, and whether any new storage/index structure is justified by requirements existing systems can't express.

The strongest conclusion from Rubicon is that we probably **shouldn't build a database first**. We should build a new _logical layer_--types, algebra, compiler, provenance and epistemic contracts--then compile it onto existing data/search/workflow engines. Rubicon itself makes almost exactly this move: wrappers normalize heterogeneous sources into logical relations, then a query processor handles joins, source selection and cost-aware execution.

TODO: Clarify the original `XXX` marker; no further text is recorded here.

Stonebraker's direction is probably the best systems precedent we've found so far.

My recommendation would be:

> **Do not build a database initially. Build an investigation language, algebra, compiler, and runtime on top of existing databases and retrieval engines. Treat those engines as physical execution backends.**

That is also quite close to where Rubicon is going. Its 2026 paper explicitly introduces a small AQL algebra, source wrappers, materialized intermediate results, and database-style cost optimization; retrieval itself becomes an operator inside query processing. ([arxiv.org](https://arxiv.org/abs/2604.21413 "An Alternate Agentic AI Architecture (It's About the Data)"))

The proposed extension beyond Rubicon is from an **enterprise data integration/query system** to an **evidence-seeking computation system**.

<a id="the-architecture-i-would-use"></a>

### Proposed architecture


Think like PostgreSQL rather than like LangChain:

```text
User / Agent
    │
    ▼
Investigation DSL
    │
    ▼
Typed AST
    │
    ▼
Static analysis
    │
    ├── type checking
    ├── provenance requirements
    ├── coverage requirements
    ├── authority constraints
    ├── resource constraints
    └── policy checking
    │
    ▼
Logical Investigation Plan
    │
    ▼
Cost / quality optimizer
    │
    ▼
Physical Plan
    │
    ├── SQL
    ├── BM25
    ├── vector search
    ├── LLM calls
    ├── corpus scans
    ├── rerankers
    ├── graph traversal
    └── external tools
    │
    ▼
Durable execution runtime
    │
    ▼
Investigation database
```


The important boundary is between the **logical plan** and the **physical plan**.

The logical plan might say:

```text
evidence =
    corpus
    | find(question)
    | require_coverage(complete)
    | extract_evidence
```


It doesn't say:

```text
use HNSW k=100
then BM25 k=100
then Gemini on paragraph summaries
then rerank with model X
```


That's a physical implementation chosen by the optimizer.

Exactly like:

```sql
SELECT ...
FROM ...
WHERE ...
```


doesn't tell PostgreSQL which join algorithm or index scan to use.

That separation could become very valuable.

### Stonebraker gives us two different pieces


DBOS and Rubicon solve different parts of our problem.

**Rubicon gives us the query-processing model.**

The current paper explicitly says that its core is `AQL + wrappers + intermediate results`. It converts heterogeneous sources into logical relations, keeps intermediate computation inspectable, and supports compiled execution with predicate pushdown, join reordering, source selection, and costs including latency, tool calls and token use. ([arxiv.org](https://arxiv.org/abs/2604.21413 "An Alternate Agentic AI Architecture (It's About the Data)"))

That's extremely close to our recent discussion.

Rubicon effectively says:

```text
heterogeneous world
        ↓
source wrappers
        ↓
common logical representation
        ↓
query algebra
        ↓
optimizer
        ↓
execution
```


We could use the same architecture.

But our common logical representation doesn't need to be just:

```text
Relation<Row>
```


It could contain domain types:

```text
Corpus
Source
SourceUnit
Representation

Question
Requirement
QueryRepresentation

Candidate
Evidence
Claim
Conflict

Authority
Coverage
Finding
```


And operators such as:

```text
find
screen
expand
extract
compare
support
contradict
resolve
verify
synthesize
```


A possible research direction is something like an **epistemic extension of query processing**.

**DBOS gives us the execution model.**

DBOS's original proposition is to keep system state in database tables and change it transactionally, obtaining durability, concurrency control, recovery, logging and inspectability from the DBMS. ([Stanford MAST Lab](https://mast.stanford.edu/pubs/dbos_a_proposal_for_a_data_centric_operating_system/ "DBOS: a DBMS-oriented operating system | Stanford MAST Lab"))

And DBOS has since become directly relevant to long-running workflows. Its current implementation uses Postgres-backed durable workflows that resume from completed steps after failures; recent releases also expose queryable workflow state and support durable streams useful for long-running LLM operations. ([DBOS](https://www.dbos.dev/blog/new-in-dbos-july-2026 "What's New in DBOS - July 2026 | DBOS"))

That maps very cleanly to an investigation:

```text
Investigation #8192
    │
    ├── plan version 7
    ├── running nodes
    ├── completed nodes
    ├── evidence produced
    ├── tokens consumed
    ├── budget remaining
    ├── human modifications
    └── unresolved requirements
```


All of that should be durable, queryable state.

If a 40-minute corpus analysis crashes at minute 37, restarting from scratch is ridiculous.

A DBOS-style runtime lets you treat:

```text
screen_document(182)
```


as completed durable computation.

This is particularly important because, as you pointed out earlier, some operators can be expensive.

<a id="i-would-make-postgres-the-initial-kernel"></a>

## Postgres as the proposed initial "kernel"


For the first serious implementation, the proposal is to be boring.

Something like:

```text
                    Investigation Runtime

                         Postgres
                  ┌─────────┴─────────┐
                  │                   │
             control state        domain state
                  │                   │
             executions             sources
             checkpoints            units
             budgets                claims
             dependencies            evidence
             caches                 lineage
             statistics             authority
                                    coverage
```


Original documents can remain in files/object storage.

Search representations can be physical indexes:

```text
Postgres / vector index
full-text index
external search engine
object store
```


The logical runtime doesn't care.

For a Markdown corpus at the initial scale described in the research notes, you may even get surprisingly far with Postgres alone:

```text
relational tables
JSONB
full-text search
vector extension
recursive queries
transactions
materialized views
```


You don't need a graph database merely because the logical model contains graphs. Edges are relations:

```text
claim_support(
    claim_id,
    evidence_id
)

derived_from(
    child_id,
    parent_id
)
```


and recursive SQL can take you a long way.

Likewise, you don't need an OLAP database simply because some UI behaves like a cube.

<a id="when-would-i-actually-build-a-database"></a>

## When would a new database be justified?


Much later, and only if profiling tells us an existing engine is structurally wrong.

For example, suppose we discover the dominant workload is:

```text
millions of source units
×
multiple representations
×
thousands of query facets
×
provenance propagation
×
hierarchical expansion
×
incremental recomputation
```


and every investigation repeatedly performs something like:

```text
semantic retrieval
→ hierarchical tree traversal
→ provenance propagation
→ authority joins
→ recursive evidence graph evaluation
```


Maybe existing engines perform badly enough that a specialized execution engine makes sense.

Then we could build:

```text
Investigation DBMS
```


with native operators/indexes.

But that should be an empirical conclusion after we understand the workload.

Stonebraker himself is a good example here: even DBOS did not argue that one storage engine should handle everything. Its research architecture described a **polystore** with different DBMSs suited to OLTP and OLAP behind a common interface. ([VLDB](https://vldb.org/cidrdb/papers/2022/p26-li.pdf "A Progress Report on DBOS:   A Database-oriented Operating System"))

That's likely the right instinct for us too.

## What to build and what to reuse


<a id="so-id-draw-the-boundary-like-this"></a>

### Proposed boundary

```text
WE BUILD

Investigation DSL
Investigation algebra
Type/effect system
Compiler
Static verifier
Logical optimizer
Cost/quality model
Provenance semantics
Coverage semantics
Authority semantics
Agent programming environment
UI projections

WE REUSE

Postgres
transactions
indexes
object storage
vector search
full-text search
LLMs
workflow durability
distributed execution
```


And possibly DBOS itself for part of the last category.

The working interpretation is that this formulation also sharpens what the company/research contribution would be. We're not claiming to have invented a superior database.

We're asking whether **evidence-seeking investigation deserves the same treatment that databases gave data queries**:

> a language, algebra, optimizer, execution engine, cost model, correctness contracts, inspectable intermediate state, and durable computation.

The saved LLM analysis regarded Rubicon as the strongest evidence it had found that database researchers were independently moving in this general direction. The proposed research opportunity would be to take it from **heterogeneous enterprise querying** into **evidence, knowledge, and defensible investigation**. ([arxiv.org](https://arxiv.org/abs/2604.21413 "An Alternate Agentic AI Architecture (It's About the Data)"))

rubicon: https://github.com/fabian-wenz/rubicon
