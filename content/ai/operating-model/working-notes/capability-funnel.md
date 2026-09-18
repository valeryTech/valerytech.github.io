---
draft: false
toc: true
title: "Capability Funnel"
linkTitle: "Capability Funnel"
---
## Capability funnel


> **Status:** Superseded working note. The current model is in [`solution-utility-ladder.md`]({{< ref "ai/operating-model/solution-utility-ladder" >}}), which separates utility, coverage, required conditions, and production operation.

The capability funnel shows progressive levels of utility for an AI system, from basic operation to fully solving the user's job. It shows progress across syntax, execution, relevance, intent, and job completion.

The term "funnel" is not used for the path from problems to possible solutions. That structure is better described as an **option tree**, **solution space**, or simply a decision process.

It is **not another phase in the lifecycle**. It is an evaluation model that can be applied to an AI solution while the solution is being discovered and improved.

The capability funnel applies to the **solution**, or more precisely to the solution's ability to solve the user's job.

The solution is the evolving object. Capabilities describe what that solution must do. Experiments evolve the solution. The capability funnel shows how far the solution has progressed toward solving the job.

### Query assistant example


Suppose the problem is:

> Operations managers depend on analysts to answer routine questions from company data.

Potential solution:

> Let managers ask questions in natural language and get trustworthy answers directly.

The central value path could be:

```
User question
     │
     ▼
Understand intent
     │
     ▼
Map intent to company data / semantics
     │
     ▼
Construct correct query
     │
     ▼
Execute query
     │
     ▼
Interpret result
     │
     ▼
Give user a useful answer
```


The resulting funnel:

```
User job:
Get a trustworthy answer from company data without depending on an analyst.

        ▲
        │
L5  User can complete the analytical task
        ▲
        │
L4  Answer matches the user's actual intent
        ▲
        │
L3  Result is correct and relevant
        ▲
        │
L2  Generated query executes successfully
        ▲
        │
L1  System can generate a valid query
```
