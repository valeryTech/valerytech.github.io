---
draft: false
toc: true
description: "Compares six candidate DSL experiments, favoring iterative RAG with explicit evidence state, bounded loops, coverage conditions, and budgets before broader query planning or software repair."
title: "08 Typed Dsl Project Candidates"
linkTitle: "08 Typed Dsl Project Candidates"
---

Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

## starting project examples


Initial project question: Which examples could test the proposed approach? The author wants to avoid a system with a closed set of capabilities. Candidate starting points include query processing with loops and exit criteria, or RAG.

TODO: Clarify the original `XXX` marker; no further text is recorded here.

The working interpretation is that iterative query processing / RAG is a better starting point than a capability-control system, because it gives us real planning, loops, intermediate state, exit criteria, optimization, and measurable outcomes.

The proposal is to structure the DSL so the core language is small, while the set of domain operators is extensible. Think more like SQL + UDFs or a compiler IR:

```text
Core language:
  let
  if / match
  loop / until
  parallel
  map
  return
  assert

Extensible operators:
  search
  retrieve
  rerank
  embed
  sqlQuery
  inspectSchema
  summarize
  classify
  evaluate
  ...
```


An operator can be added by registering its type, effect, cost model, and runtime implementation. So the language is constrained, but the available actions aren't permanently fixed.

The proposed candidate projects, roughly in order of preference, are:

### 1. Iterative RAG / research query processor


This is probably the best first experiment.

Instead of:

```text
question → retrieve top 10 → LLM → answer
```


we let the model synthesize a query program:

```text
question
   ↓
generate initial queries
   ↓
retrieve
   ↓
inspect evidence
   ↓
identify missing information
   ↓
generate new queries
   ↓
retrieve again
   ↓
...
   ↓
exit when sufficient
   ↓
answer
```


A possible DSL:

```text
let state = ResearchState(
    question = input,
    evidence = [],
    gaps = [input]
)

loop state
until (
    state.gaps.isEmpty
    or iterations >= 5
    or tokenBudget.remaining < 2000
) {
    let queries =
        formulateQueries(state.gaps)

    let results =
        parallelMap(queries) {
            retrieve(it, topK = 10)
        }

    let evidence =
        rerank(results)
        |> select(top = 15)

    let gaps =
        assessGaps(
            question = state.question,
            evidence = state.evidence + evidence
        )

    continue state.update(
        evidence += evidence,
        gaps = gaps
    )
}

let answer =
    answerFrom(
        question = state.question,
        evidence = state.evidence
    )

assert citationsSupported(answer)

return answer
```


Here the compiler can immediately verify things that normally live inside prompts:

- `loop` has an exit condition.
- There is a hard iteration bound.
- `retrieve` produces `Evidence`.
- `answerFrom` accepts only evidence available in the state.
- Every query has a bounded `topK`.
- parallel branches return compatible types.
- state updates are valid.
- certain expensive operations cannot appear inside an unbounded loop.

Runtime evaluation handles things we cannot statically prove:

```text
assessGaps(...)
citationsSupported(...)
relevance(...)
coverage(...)
```


That gives us a nice split between static verification and runtime evaluation.

### 2. Multi-stage database/query planning


This would look like an LLM-generated logical query plan.

For example:

```text
inspectSchema("orders")

let customers =
    sql {
        select customer_id
        from orders
        where year(created_at) = 2025
    }

let profiles =
    batch(customers, size = 100) {
        lookupCRM(it)
    }

let result =
    filter(profiles) {
        it.segment == "enterprise"
    }

return aggregate(result)
```


This project would let us experiment with compiler techniques directly:

```text
LLM-generated plan
       ↓
type checking
       ↓
logical plan
       ↓
rewrite/optimization
       ↓
physical execution plan
```


And the compiler can optimize the LLM's program:

```text
filter after retrieval
```


could become:

```text
push filter into SQL
```


where possible.

This starts looking less like an "agent DSL" and more like a proper query language whose programs happen to be synthesized by an LLM.

### 3. Data exploration agent


Suppose the user asks:

> Why did revenue drop in August?

The program might be:

```text
let schema = inspect(data)

let revenue =
    query(schema, metric = Revenue, period = August)

let baseline =
    compare(revenue, previousMonths = 6)

let dimensions =
    candidateDimensions(schema)

loop dimensions
until explanation.confidence > threshold
   or remaining.isEmpty {

    let dimension = chooseMostInformative(remaining)

    let breakdown =
        breakdown(revenue, by = dimension)

    let anomalies =
        detectAnomalies(breakdown)

    updateExplanation(anomalies)
}

return explanation
```


This is attractive because "analysis" becomes an explicit program we can inspect.

We can answer questions like:

```text
Why did the agent query region?
Why did it query product next?
Why did it stop?
Which evidence supports the conclusion?
```


without reconstructing those decisions from chain of thought.

### 4. Test-driven software repair


This is another very good fit.

```text
let failures = runTests()

loop state
until failures.isEmpty
   or attempts >= 10 {

    let diagnosis =
        inspectFailures(failures)

    let patch =
        proposePatch(
            source,
            diagnosis
        )

    applyTemporary(patch)

    let result =
        runAffectedTests()

    if result.regressed {
        rollback()
    } else {
        accept(patch)
    }

    failures = result.failures
}

return acceptedPatches
```


The DSL provides structure around what coding agents already do informally.

The compiler can enforce:

```text
applyTemporary must precede accept
rollback is valid only after apply
tests must run before accepting
loop is bounded
```


while the runtime handles compilation and test execution.

This would also give very objective benchmarks: success rate, number of iterations, test regressions, token usage, wall-clock time.

### 5. Evidence-based literature research


Similar to RAG, but with explicit claims:

```text
let papers =
    searchPapers(topic)

let candidates =
    filterRelevant(papers)

let claims =
    map(candidates) {
        extractClaims(it)
    }

let clusters =
    groupByClaim(claims)

loop clusters
until coverage >= target {
    let unsupported =
        findUnsupportedClaims(clusters)

    let queries =
        formulateQueries(unsupported)

    let additional =
        searchPapers(queries)

    clusters += extractClaims(additional)
}

let synthesis =
    synthesize(clusters)

assert everyClaimHasCitation(synthesis)

return synthesis
```


The important object becomes something like:

```text
Claim<T> {
    value: T
    evidence: Set<Evidence>
}
```


That can become a type-level property:

```text
UnsupportedClaim
SupportedClaim
ConflictingClaim
```


Then `publish` might only accept:

```text
Document<SupportedClaims>
```


That starts showing why the DSL approach can be more powerful than prompting.

### 6. Federated information retrieval


A query might involve several backends:

```text
searchWeb
searchVectorDB
queryPostgres
searchGitHub
searchEmail
```


The interesting problem becomes planning where information should come from:

```text
let issue =
    searchGitHub(query)

let relatedDocs =
    searchVectorDB(issue.description)

if relatedDocs.confidence < 0.7 {
    let emails =
        searchEmail(issue.project)
}

join(...)
```


The compiler can reason about schemas and provenance, while a query optimizer can reason about cost and ordering.

This is especially relevant if we eventually want declarative syntax such as:

```text
find {
    explanation for production incident X
}

using {
    github
    documentation
    logs
}

requirements {
    evidenceCoverage >= 0.9
}
```


and let a planner synthesize the operational program.

## A concrete RAG example

```text
program Research(question: Question): Answer {
    let state = ResearchState(
        question = question,
        evidence = [],
        previousResultIds = []
    )

    repeat max 5
    until coverage(state) >= 0.85
       or noNewEvidence(state)
       or remainingBudget() < 1000 {

        let queries = formulateQueries(
            question = state.question,
            evidence = state.evidence
        )

        let results = parallelMap(queries, maxConcurrency = 4) {
            search(query = it, topK = 10)
        }

        let selected = rerank(
            question = state.question,
            candidates = flatten(results),
            topK = 12
        )

        state = mergeEvidence(state, selected)
    }

    let answer = synthesize(
        question = question,
        evidence = state.evidence
    )

    assert citationsSupported(
        answer = answer,
        evidence = state.evidence
    )

    return answer
}
```


Before running it, the compiler could verify:

- the loop has a maximum iteration count;
- all exit conditions return `Boolean`;
- parallel branches return compatible values;
- `topK` and concurrency are bounded;
- only `Evidence` values reach `synthesize`;
- the final assertion is evaluated before returning;
- all variables are initialized;
- the state update preserves its type.

During execution, the runtime evaluates facts that cannot be established statically:

- actual retrieval results;
- evidence coverage;
- whether results are duplicates;
- elapsed time;
- citation support;
- service availability.

Compiler feedback might look like:

```text
E021: repeat requires a static upper bound
  at research.dsl:7

E114: rerank expects List[SearchResult]
  found List[List[SearchResult]]

Suggested operation:
  flatten(results)
```


The model repairs the candidate and resubmits only the changed AST.

The proposal is to start with project 1: iterative RAG.

It has a particularly useful combination:

```text
               Static       Runtime
               checking      evaluation

types             ✓
control flow      ✓
bounded loops     ✓
state             ✓
budgets           ✓ / ~
retrieval quality                 ✓
evidence coverage                 ✓
answer quality                    ✓
exit criteria      ✓             ✓
```


And we can start with a very small language:

```text
let
retrieve
rerank
evaluate
if
loop/until
parallel
return
```


That's enough to test the main hypothesis:

> Can an LLM produce a small executable query program, use compiler feedback to repair it, and outperform a prompt-driven RAG agent while giving us a plan that is inspectable, optimizable, and reproducible?

If that works, the proposal is to expand toward data querying and tool execution. The RAG version gives us most of the language-design problems without immediately introducing dangerous side effects.
