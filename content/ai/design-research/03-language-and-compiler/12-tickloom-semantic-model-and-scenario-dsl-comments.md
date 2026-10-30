---
draft: false
toc: true
description: "Critiques Tickloom reliability claims by separating valid declarations, faithful test scenarios, deterministic executions, protocol correctness, and coverage of possible distributed-system interleavings."
title: "12 Tickloom Semantic Model And Scenario Dsl Comments"
linkTitle: "12 Tickloom Semantic Model And Scenario Dsl Comments"
---
# Comments on the Tickloom case study


The comments were added by Codex on 2026-03-30 at the user's request. They explain the sibling [case-study note]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl" >}}) and record open questions. They are new commentary, not part of the captured article or an agreed implementation specification.

## Why the examples are together


The article describes a semantic model and then a language built on that model. A semantic model is the set of types and operations used to represent the domain. The scenario DSL is the constrained language used to declare tests.

Keeping the passages together lets the reader follow the model, the quorum-store code, and the tests in their original order. The general [kernel design]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) and [compiler design]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) remain separate from the worked example.

## What the example shows


First, the framework supplies named operations and choices about execution. Second, the LLM generates protocol code using the framework's vocabulary. Third, a scenario DSL describes the clients, operations, and faults used in a test.

The article's progressive interfaces restrict the order in which a scenario can be declared. For example, the article says an action cannot be declared before selecting a client. A compiler rejection of an invalid declaration is a narrower result than establishing that the distributed algorithm is correct.

The clock-skew and quorum-read examples describe executions that expose unwanted behavior. A test can successfully reproduce a protocol failure, so a passing test does not always mean the protocol has the desired property.

## Questions to keep open

### Separate compilation, test results, and intended behavior


A generated scenario can compile while describing the wrong experiment. Review should check the scenario against the request, as well as checking its syntax and observed result.

The [verification note]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) already distinguishes compilation from result correctness. The case study supplies an example of why the distinction is useful.

### Measure the reliability claim


The captured article argues that a small language leaves less room for generation errors. The worked examples do not, by themselves, measure the size or generality of the improvement.

A later experiment could compare DSL generation and ordinary Java generation on matched requests. It should report compilation success, agreement with the requested scenario, and the expected behavior of the resulting test separately. The comparison is a proposal, not an experiment performed during this rearrangement.

### Keep deterministic execution separate from test coverage


Even if a chosen execution is deterministic, observing that execution does not establish every possible execution of the algorithm. A later evaluation should state which failures and operation orderings its tests cover.

The examples should remain examples until a separate evaluation establishes wider claims. The repository links and generated code have not been run or independently checked in this rearrangement.

### Define the boundary for generated Java


The case study uses an internal Java DSL. The earlier compiler dialogue discusses restricting generated programs and separating generation from execution.

A design that uses a similar DSL as a security boundary must specify which Java constructs it accepts and how execution is isolated. The case study alone does not define that boundary, and compilation alone does not establish permission to perform external actions.

## Why the interview moved to the database note


The NoSQL exchange concerns database transactions, query optimizers, and developer experience. It is now between the [DBOS discussion]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}#specialized-engines-and-dbos-from-the-stonebraker-interview) and the [text-to-SQL discussion]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}#text-to-sql-rubicon-and-benchmarks-from-the-interview), in its original interview order.

Stonebraker's argument about compilers is a related perspective, not evidence that the proposed agent DSL has the same guarantees as a database system. The interview claims remain attributed source material and have not been independently verified here.
