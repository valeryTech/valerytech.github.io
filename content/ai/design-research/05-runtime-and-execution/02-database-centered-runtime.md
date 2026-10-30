---
draft: false
toc: true
description: "Analyzes DBOS durability and Rubicon query planning, proposing an investigation compiler over existing databases rather than a new DBMS, alongside Stonebraker interview passages on metadata and transactions."
title: "02 Database Centered Runtime"
linkTitle: "02 Database Centered Runtime"
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

DBOS's original proposition is to keep system state in database tables and change it transactionally, obtaining durability, concurrency control, recovery, logging and inspectability from the DBMS. ([Stanford MAST Lab](https://mast.stanford.edu/pubs/dbos_a_proposal_for_a_data_centric_operating_system/?utm_source=chatgpt.com "DBOS: a DBMS-oriented operating system | Stanford MAST Lab"))

And DBOS has since become directly relevant to long-running workflows. Its current implementation uses Postgres-backed durable workflows that resume from completed steps after failures; recent releases also expose queryable workflow state and support durable streams useful for long-running LLM operations. ([DBOS](https://www.dbos.dev/blog/new-in-dbos-july-2026?utm_source=chatgpt.com "What's New in DBOS - July 2026 | DBOS"))

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

Stonebraker himself is a good example here: even DBOS did not argue that one storage engine should handle everything. Its research architecture described a **polystore** with different DBMSs suited to OLTP and OLAP behind a common interface. ([VLDB](https://vldb.org/cidrdb/papers/2022/p26-li.pdf?utm_source=chatgpt.com "A Progress Report on DBOS:   A Database-oriented Operating System"))

That's likely the right instinct for us too.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Specialized engines and DBOS from the Stonebraker interview


The following exchanges come from the [captured Data Renegades interview]({{< ref "ai/design-research/07-sources/01-stonebraker-data-renegades-transcript" >}}#transcript). The preceding database history remains in that source note. CL Kao's questions and Michael Stonebraker's answers are retained with their speaker labels. The interview passages are source material, separate from the LLM dialogue above, and their claims have not been independently verified or updated.

**CL:** Okay, so I want to talk to you about your paper in 2005 arguing one size fits all was bad. And then kind of the general purpose database will fracture to kind of purpose built one like columnar store streaming in memory and all that.

What was the signal or what you observed in the industry that kind of drew that conclusion?

**Michael:** Well, it wasn't that at all. So I was involved in a company called StreamBase. And so we had a streaming platform way back when and it was architected nothing like the Postgres row stores of the world. And I had started to be involved in an enterprise that had the gist of an idea for a column store. And it was totally obvious that column stores were an order of magnitude faster than row stores on data warehouses.

So here were three technical examples of markets where you could just beat the heck out of a traditional row store with something else. And so based on a sample of three, there were at least three perfectly reasonable, totally different implementations that were each wildly faster than the other guys in a vertical market.

And so that was the gist of the 2004 paper and I think it's completely and totally true today. I mean, I think ClickStore is an exemplar of a new system, I think-- Is it Pine Tree that does vectors?

**CL:** Oh. Pinecone?

**Michael:** Pinecone, yeah.

**CL:** Right, right, right. And ClickHouse.

**Michael:** Right and ClickHouse. And so I think, you know, there continue to be examples of special purpose systems that are considerably faster than the general purpose ones. And I think meanwhile, you know, Postgres is of course being extended to support all kinds of stuff, but it is still a single node system and it is not a column store.

And they've deliberately chosen not to make it a column store because in effect if you want to support a column store and a row store, it's two different engines supported by a common parser. And the Postgres guys decided not to do that. Also in the data warehouse market the databases get gigantic and you need a multi node system. And so again the Postgres guys decided to pass on that.

> So I think they've engineered really smart for a lowest common denominator system that has been extended with all kinds of stuff. And simultaneously there are a bunch of special purpose engines and I expect that to continue. I mean I don't see that stopping.

**CL:** Yeah. I think that the interesting part that, for example, PostgreSQL is so extensible. So there are like say vector store extensions or columnar extensions. And it seems like people are still putting things into that. Right? Even like the stored procedures or different language runtime.

**Michael:** One of the things that mystifies me is stored procedures, user defined types, user defined functions are really a terrific idea and you would think they would just take over the world because they really, they work beautifully. And so back to my example of the 360 day calendar.

If you have a 30 day bond time, that's a factor of three faster than if you have to retrieve two dates out to user code, do the subtraction out there and then put the answer back. It's just wildly performant in all kinds of areas.

> The only explanation I can give is that there isn't really a good debugger for stored procedures. It would be a great idea if somebody built the tooling necessary to support types, functions and stored procedures. And I hope that happens someday.

**CL:** So what I'm hearing is that stored procedure or kind of putting compute to the data kind of makes sense when of course you don't have to round trip to Userland.

**Michael:** Right, Exactly.

**CL:** But ergonomics for debugging or-- That is harder than the other way around.

**Michael:** Yes.

**CL:** Okay.

**Michael:** So I mean it's tough to build stored, you know, user defined functions. It's tough to build them, tough to debug them. So the tooling just isn't there.

**CL:** Yeah, I had a firsthand experience. It was early, like I guess almost 10 years ago, trying to build the entire REST server into Postgres through PLV8. And then, yeah, you helped me, it's very hard to debug. Haha.

So I think there is still room for innovation there. And then I'm curious about one of your latest ventures like DBOS. Right? It's essentially Postgres as kind of a durable kind of execution engine. Can you tell us more about that?

**Michael:** Well sure. I mean like all the other things I've done, that started off as an academic research prototype. And I think it started off with, you know, Linux is 40 years old and it doesn't scale worth the crap. And so one of my colleagues, Matei Zaharia, who was at Stanford at the time, is now at Berkeley and was the founder of Databricks.

So he told me this was maybe 2019 or anyway quite a while ago he said that Databricks on a day in, day out basis was managing a million Spark instances, trying to execute them in parallel and they needed a scheduler that would operate on a million things. And they quickly discarded the Linux scheduler, saying it just doesn't scale. And so they said, well, the answer is you put the scheduling data in a Postgres database and then you run the scheduler as a database application.

> And that made me realize that not only scheduling, but the file system and most everything else in Linux would be better off as a database application.

So as a research project we constructed DBOS, which was intended to be a Linux replacement. And we got enough of it to work that it was clear it was performance viable and had all kinds of nice features. Like scheduling was transactional, file system was transactional. If you run multi-node, multi-user and the research prototype ran that way it had all kinds of really nice features.

The students were, like students everywhere are, completely focused on let's do a startup. We said, let's do a startup. So we had this replacement for Linux and we also had this bunch of extensions to JavaScript that would allow you to very easily provide durability.

And so those were the two ideas we could leverage. And the VCs, when we started trying to raise money, immediately barfed all over the Replace Linux idea and say, maybe in your next lifetime. So focus on this programming environment that does durability. And so this was basically a requirement of getting funding.

And so that's what the commercial DBOS company has focused on is the programming environment. And they've moved to run on top of Postgres, they've moved to TypeScript and Go and Java. And so you know, they're building out, you know a complete runtime and they seem to be doing very well.

So check it out. It's very, very easy to use and blindingly fast.

<!-- Navigation added during reassembly on 2026-03-30. Original source text is unchanged. -->

## NoSQL, SQL optimizers, and transactions from the interview


The following exchange comes from the [captured Data Renegades interview with CL Kao and Michael Stonebraker]({{< ref "ai/design-research/07-sources/01-stonebraker-data-renegades-transcript" >}}). The preceding [specialized-engine and DBOS discussion](#specialized-engines-and-dbos-from-the-stonebraker-interview) is retained above. Speaker labels and the complete transaction, optimizer, developer-experience, and JSON discussion remain unchanged. The interview claims are separate from the LLM dialogue and have not been independently verified.

**CL:** All right, we'll definitely link in the show notes. So in 2010 you were pretty loudly critical of NoSQL, when like MongoDB and Cassandra were the hottest thing in tech. And then you called Hadoop dead before the rest of the industry caught on. So both times you were right.

So how do you develop such conviction against, I guess that was the hype at that time, right?

**Michael:** Well who do you want me to pick on? Hadoop or Cassandra or Mongo?

**CL:** Let's do Mongo because they're still public. Haha.

**Michael:** Okay, so Mongo, I mean at the time was a complete piece of crap. I mean their transactions didn't really work. They had a bunch of ad hoc, I mean they-- Here was the marketing message: Transactions are too slow, so we're going to do an anemic version of them and you don't want a high level language because it's too slow.

> And over 40 years I've learned that don't ever bet against the compiler.

**CL:** Okay.

**Michael:** Compilers, database optimizers, think of them as a SQL compiler, may not have been terrific in the 80s, but they've gotten awfully good. And so betting against the optimizer and betting against transactions just seems stupid.

And of course at the time the NoSQL world was 40 or 50 different systems all with different query notations. There was no standard. Over time what's happened is Mongo has junked their implementation and replaced it with one they bought from WiredTiger I think. Okay. Which had a real transaction system in it. And they've added joins and you know, now they have this strange mix of, of SQL and NoSQL.

And so unless you squint, Mongo has moved towards SQL. But I think at the time, you know, it was technically foolish to bet against the compiler and the entire world needs transactions. Even though at the time Jeff Dean of Google claimed eventual consistency was the answer, it was crystal clear to most everybody that that was nonsense.

**CL:** Yeah, I remember playing with MongoDB and Couchbase when they were first out. It was like, okay, so you are expecting me as a user to do all this kind of denormalization myself because there is no transaction. Okay.

**Michael:** Right. I think, you know, Mongo was never very fast. You know, this was just all marketing bullshit. But I think in their defense, they had an astronomic amount of technical debt. They managed to get enough sales that they got enough money that they could then replace the implementation. And so now they just have a thing that doesn't quite look like anything.

But I think what's really true is that Mongo and Cassandra are moving toward looking like SQL. Meanwhile, Mongo and Cassandra did have a couple of very good ideas.

> The trouble with a relational database system is you gotta define a schema up front, you gotta define tables upfront, you gotta define cursors, you gotta define a query. And so there's all this crap you have to do in order to get going. So the out of box experience is miserable, whereas it's much better with the NoSQL guys.

And so the relational guys are moving in that direction. Also supporting-- The big thing that Mongo and Cassandra have done is support JSON as a data type. And the SQL guys have all done that and that's a good way to encode what amounts to sparse matrices. So I think the two camps have drifted very close together.

**CL:** Yeah, I feel it's almost like the industry trying to innovate on the front. And then I remember after the NoSQL movement, people were saying "not just SQL," so traditional SQL, but plus the document store, especially like Postgres not only have JSON but JSON binary. So it's extremely fast to do queries for JSON traversal.

**Michael:** My favorite joke is to say at the beginning the NoSQL guys said "no, don't use SQL." Then that quickly morphed into "not only SQL," which is what you mentioned. In my opinion, it's now moving toward "not yet SQL."

<!-- Navigation added during reassembly on 2026-03-30. Original source text is unchanged. -->

The interview continues below with [text-to-SQL failures, RUBICON, and benchmark comparisons](#text-to-sql-rubicon-and-benchmarks-from-the-interview). The next exchange refers back to the NoSQL discussion above.

<!-- Navigation added during reassembly on 2026-03-30. Original source text is unchanged. -->

## Text-to-SQL, RUBICON, and benchmarks from the interview


The preceding [NoSQL and compiler exchange](#nosql-sql-optimizers-and-transactions-from-the-interview) is retained above, in the original interview order. The complete discussion below keeps Stonebraker's reported warehouse results, failure causes, human metadata requirements, RUBICON example, BEAVER and DAB comparisons, and qualifications together. The claims retain their original wording and interview attribution.

**CL:** Haha. Not yet SQL. Indeed. So for those kinds of contrarian takes, have you ever been contrarian but wrong?

**Michael:** Have I ever been wrong? Let me talk about large language models, agentic AI.

**CL:** Oh great.

**Michael:** We started playing with trying to do what's now called Text-to-SQL. And so there are a couple of public benchmarks, Spider and BERGEN, where large LLMs are pretty good at it. Like the leaderboard is 80 something percent in accuracy. And so you would think that the stuff ought to work. But we've been trying large language models and agentic AI on real data warehouses, we've got access to four of them.

One of them is the MIT Data Administration Warehouse, which is an Oracle database with 1400 tables. And we tried out the LLMs that everyone else was touting as well as our own, and accuracy was about 10%, not 80%, 10%. And if you gave the LLM the FROM clause, meaning here are all the tables that you need to use and here's all the join connectors you need to use. If you gave it the joint terms and the FROM clause, then accuracy improved to 30 something percent, but again there's a 50% gap.

And so on real warehouses, LLMs and agentic AI don't work worth the crap. And the reason for it is actually not unusual. Number one, the MIT data warehouse is of course not in what's called the pile, so LLMs can't train on it. And the general wisdom is that if you haven't seen the data a couple times before, you have no chance of being able to retrieve it.

So data not in the pile is number one. Number two, real data warehouse queries are like 100 lines of SQL and Spider and BIRD are 20 lines of SQL. So undergraduates producing simple SQL is just not the workload that real warehouses are subjected to. So more complicated queries.

The third thing is idiosyncratic data. So for example, at MIT, buildings have a number, they don't have a name. So the status center is officially, which is the computer science building, is officially Building 32. And MIT has a thing called the J term, which is a one month term in January. And so there's just all kinds of idiosyncratic data, which of course an LLM train on the pile is not going to do well on.

And then the fourth thing is that real data warehouses have materialized views, have overlapping semantic schemas, you know, they're not clean schemas. And the names of columns are often bizarre things that are not mnemonic. So bizarre schema, bizarre data, complicated queries and not in the pile sort of makes it extremely difficult for Text-to-SQL to work. And so I'm not expecting it to work in the absence of being able to train--

You know, I suppose you could train, you know, a large language model on the actual MIT data, but that's a petabyte of stuff and that's not exactly cheap. And so I'm not expecting the technology to work, but the entire world thinks it will.

And so what I've been working on is very contrarian, which is the following, which is unless you give it the joint terms and the FROM clause, you know, it's hopeless on real, real warehouses unless they have for some reason are in the public domain or have simple queries or don't have idiosyncratic data or have clean schemas. If you get all of those aren't true, then I withdraw my objection.

But I've never seen a data warehouse that looks like that. So anyway you've got to give it the FROM clause and the JOIN terms and that takes a human.

**CL:** Right.

**Michael:** And so we've designed an interactive system called Rubicon, where you have to tell it this metadata information. And in addition a lot of the-- I guess my favorite example is we started working with the Munich Germany Department of Transportation because my student who's working on this stuff is German and is back at the Technical University of Munich.

So the Department of Transportation, which is called the Department of Mobility in German. So think of it as the Department of Transportation. They have six full time engineers who are answering citizens queries or citizens complaints. And a typical complaint is I don't have time to cross this intersection before either the trolley goes by or the light turns.

And so the data that they have a variable to be responsive to that sort of query is, one, German Federal government regulations which are text, City of Munich regulations which are text, CAD drawings of all the intersections, that's CAD, the trolley schedule which is SQL database and the light sequencing which is a SQL database.

So you've got to query those five databases and it seems to me that if you want to downscale all this stuff to text and then try and do the joins in an LLM or in agentic AI is just not very likely to work, that you want to upscale everything to SQL. And so we are upscaling data to tables and then doing the join and what looks like a query optimizer.

So instead of betting on an LLM as the overall orchestrator, we're betting on SQL and using an LLM where it looks like it will work. So this is a very contrarian point of view and one that I'd say a trillion dollars is arrayed against us saying no, no, no, no, no let's do it with traditional agentic AI.

**CL:** We'll fix everything. Haha.

**Michael:** We'll see how it works out.

> But in the research racket you never are successful by doing what the other guys are doing. It always pays to be a renegade.

**CL:** Yeah. What an amazing theme. Okay, so you say the project is called Rubicon.

**Michael:** Called Rubicon, yeah.

**CL:** Okay. Okay. And I know you're also involved in the Beaver benchmark set.

**Michael:** Yeah.

**CL:** How are they connected?

**Michael:** Well Beaver is a Text-to-SQL benchmark on which the best stuff in the world gets 30ish percent. Even after you give it the JOIN terms and the FROM clause. And so we've abstracted the details of these various data warehouses into a benchmark. And I'm tired of people saying BIRD is a good benchmark. So my systematic answer is prove you can do this on Beaver and then we can talk.

**CL:** Mhm. Right.

**Michael:** And so we've learned from how difficult Beaver is in building Rubicon. So it's the same group that's doing this.

**CL:** Okay, very cool. And I think there was just a new benchmark set released by Berkeley called DAB. Also cross database queries and all that looks pretty interesting.

**Michael:** Yes. Rubicon and Beaver are focused on being able to retrieve information. The Berkeley benchmark is focused on taking actions.

**CL:** Mhm.

**Michael:** Which is fundamentally a great deal harder.

**CL:** I see. I see.

**Michael:** And so I'm not optimistic that anything harder than what we're doing-- I say Rubicon is a query notation dumbed down to something that looks like it might work. And I think the Berkeley guys, that's a great goal. But I don't see without a breakthrough in LLMs and agentic orchestration, I think this stuff is turning out to be very, very, very hard.

> And I keep reading that the number of successful production agentic AI projects is like 20% or 10%. People are having trouble just getting the basics. And so I expect the going is going to get is a lot tougher than people think. And picking the low hanging fruit I think is of course a great idea. And I think Claude and Anthropic is the fabulous success story. But I think that this stuff is not going to universally be true. We'll see.

<!-- Navigation added during reassembly on 2026-03-30. Original source text is unchanged. -->

## Return to the database runtime design


The interview continues with the [research and career discussion]({{< ref "ai/design-research/07-sources/01-stonebraker-data-renegades-transcript" >}}#research-commercialization-and-careers). The following boundary between what to build and what to reuse resumes the original database runtime dialogue.

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

The saved LLM analysis regarded Rubicon as the strongest evidence it had found that database researchers were independently moving in this general direction. The proposed research opportunity would be to take it from **heterogeneous enterprise querying** into **evidence, knowledge, and defensible investigation**. ([arxiv.org](https://arxiv.org/abs/2604.21413?utm_source=chatgpt.com "An Alternate Agentic AI Architecture (It's About the Data)"))

rubicon: https://github.com/fabian-wenz/rubicon
