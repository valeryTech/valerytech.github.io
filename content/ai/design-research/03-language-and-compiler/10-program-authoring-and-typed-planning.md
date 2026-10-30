---
draft: false
toc: true
description: "Proposes human and agent authoring over one typed program model, with introspection, compiler-guided repair, type-directed planning, and candidate intent compiled from natural-language requests."
title: "10 Program Authoring And Typed Planning"
linkTitle: "10 Program Authoring And Typed Planning"
---

Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<a id="i-would-expose-two-authoring-interfaces"></a>

### Two proposed authoring interfaces


This is where the two LLM scenarios become particularly useful.

#### 1. Human + LLM authoring


The user writes a domain DSL, perhaps with an LLM helping:

```text
procedure RevenueAnalytics {

    require revenue : Evidence<Revenue>

    derive monthly : MonthlyRevenue
        from revenue
        using AggregateRevenueByMonth

    derive variance : RevenueVariance
        from monthly
        using PeriodComparison

    analyze findings : RevenueFindings
        from variance
        using RevenueVarianceAnalysis

    require findings satisfies
        NumericTraceability
        EvidenceTraceability
        ScopeTransparency

    review findings using AuditReview

    produce RevenueReport
}
```


The compiler gives domain-specific feedback:

```text
ERROR

RevenueVarianceAnalysis requires:
    CurrentPeriodRevenue
    PriorPeriodRevenue

The supplied dataset contains:
    CurrentPeriodRevenue

Missing:
    PriorPeriodRevenue
```


Then the LLM can repair the program.

This gives you a powerful loop:

```text
intent
 ↓
LLM proposes program
 ↓
compiler
 ↓
domain errors
 ↓
LLM revises
 ↓
valid program
```


Compiler/type-checker feedback is far more useful than relying purely on the LLM to judge whether its workflow is valid.

### 2. Agent authoring


For an autonomous agent, one tentative proposal is to _not_ have it emit arbitrary Haskell or Scala source.

Give it an API for constructing the same program:

```text
create_procedure(...)
require_evidence(...)
derive(...)
analyze(...)
require_property(...)
review(...)
produce(...)
validate_program(...)
```


or allow it to generate a constrained serialized AST:

```json
{
  "kind": "derive",
  "artifact": "RevenueVariance",
  "from": ["MonthlyRevenue"],
  "using": "PeriodComparison"
}
```


The important distinction is:

```text
JSON AST

        ≠

JSON is the language semantics
```


JSON is simply one encoding of the typed program.

The semantic kernel validates it.

This is safer for agents because they only have access to known constructors and registered methods.

### The LLM then becomes a client of the language


That's a useful conceptual shift.

Today:

```text
LLM
 ↓
does the workflow
```


Later:

```text
LLM
 ↓
writes / modifies a program
 ↓
semantic kernel
 ↓
validates + plans
 ↓
runtime executes
 ↓
LLM inspects result
 ↓
modifies program if necessary
```


The agent doesn't define the semantics. The kernel does.

That is much more controllable.

### You can also expose introspection


The semantic component should probably provide operations such as:

```text
describe_type(RevenueDataset)

list_methods(
  input = RevenueDataset
)

describe_method(PeriodComparison)

validate(program)

explain_error(error)

compile(program)

diff(program_v17, program_v18)

required_inputs(program)

produced_artifacts(program)

required_capabilities(program)

required_properties(program)
```


This is useful both for the workbench and for agents.

An agent can ask:

> What operations can produce `RevenueFindings` from the artifacts currently available?

The language environment can answer deterministically.

That begins to resemble a planning system.

### Eventually the agent can plan against types


Suppose it has:

```text
RevenueTransactions
PriorYearRevenue
CustomerMaster
```


and wants:

```text
RevenueFindings
```


The method catalog says:

```text
AggregateByMonth:
    RevenueTransactions
    → MonthlyRevenue

ComparePeriods:
    MonthlyRevenue × PriorYearRevenue
    → RevenueVariance

AnalyzeVariance:
    RevenueVariance
    → RevenueFindings
```


The agent can construct:

```text
RevenueTransactions
      ↓
MonthlyRevenue
      ↓
RevenueVariance
      ↓
RevenueFindings
```


The type system eliminates many nonsensical plans before they run.

Then policy might say:

```text
RevenueFindings used for ReportDraft
must satisfy:

EvidenceTraceability
NumericTraceability
ScopeTransparency
```


So planning becomes:

```text
Find a program P such that

P :
    AvailableEvidence
    → RevenueFindings

and

RevenueFindings satisfies required policies
```


That's a much more precise formulation of "agent builds a workflow."

## 4. The LLM becomes a program synthesizer


Suppose the user says:

> Find the principles governing retries, compare them against current practices, and tell me where practices violate principles. Use approved sources where possible and don't answer if coverage is incomplete.

The agent could synthesize:

```text
principles =
  corpus
  | filter(type="principle", status="approved")
  | search("retry principles")
  | extract_claims()

practices =
  corpus
  | filter(type="practice")
  | search("retry behavior")
  | extract_claims()

conflicts =
  compare(principles, practices)
  | find_conflicts()

return synthesize(conflicts)
  | require_coverage(1.0)
  | abstain_if_unsupported()
```


Then show the generated plan to the user.

The user can change it.

The agent can change it.

The runtime executes it.

That's much cleaner than having an agent make opaque tool calls and finally emit prose.

## 5. The agent should operate through state transitions


The proposal is to define something like:

```text
observe()
plan()
execute()
inspect()
revise()
```


For example:

```text
1. Agent creates initial plan.

2. Runtime executes.

3. Runtime reports:

   coverage: 100%
   evidence requirements: 7
   satisfied: 5
   partial: 1
   unsatisfied: 1
   conflicts: 2

4. Agent sees unsatisfied requirement #6.

5. Agent adds another branch:

   requirement_6
   | reframe
   | search
   | web?          // if policy allows
   | extract

6. Runtime executes only new branch.

7. Agent reevaluates.
```


So the agent is doing something close to interactive program repair.

This becomes especially powerful with agents.

The LLM could generate:

```text
Plan v1
```


Compiler responds:

```text
ERROR E204:
Final synthesis requires CompleteCoverage.

The branch `practices` performs top-k retrieval only.

Suggested remedies:
- add corpus_screen()
- weaken result type to PreliminaryFinding
- remove CompleteCoverage requirement
```


Then the agent repairs the program.

So the loop becomes:

```text
LLM proposes program
        ↓
compiler checks
        ↓
diagnostics
        ↓
LLM repairs
        ↓
compiler accepts
        ↓
execute
```


That is much safer than:

```text
LLM decides what to do
→ immediately does it
```

## The agent operates above the compiler


This reconciles our earlier "LLM should orchestrate" idea with Stonebraker's skepticism.

The proposal is to allow the LLM to propose the logical program:

```text
User
 ↓
LLM Planner

"I think this investigation should be:

 corpus
 | decompose(...)
 | find(...)
 | extract(...)
 | counterevidence(...)
 | verify(...)
 | synthesize(...)
"
```


Then:

```text
LLM's proposed program
        ↓
compiler
        ↓
type errors
constraint errors
budget errors
policy errors
        ↓
LLM repairs program
        ↓
valid logical program
        ↓
optimizer
        ↓
runtime
```


So the agent has substantial agency, but it operates in a constrained computational environment.

That is somewhat between Stonebraker and mainstream agent architectures.

Rubicon is skeptical about automatically producing the full AQL program; its paper explicitly says it doesn't expect that mode to be sufficiently reliable. ([arxiv.org](https://arxiv.org/abs/2604.21413 "An Alternate Agentic AI Architecture (It's About the Data)"))

We can accept that concern and still ask a slightly different question:

> Can an LLM reliably synthesize an investigation program when a compiler can reject invalid programs, the user can inspect the plan, and runtime state exposes failures?

That's a much stronger setup than asking an LLM to orchestrate opaque tool calls.

## 9. Give the agent meta-operations too


The agent shouldn't only operate on evidence.

It should be able to inspect and manipulate the investigation itself.

For example:

```text
inspect(node)
explain(node)
replace(node, ...)
insert_after(node, ...)
branch_from(node, ...)
retry(node)
invalidate(node)
change_parameter(node, ...)
compare_runs(a, b)
```


Then an agent can say:

> Hypothetical-question retrieval found 11 unique pieces of evidence that dense search missed. Increase that branch's retrieval budget.

Or:

> 92% of supporting evidence came from one source. Add a counterevidence search over independent sources.

That's much more sophisticated than a generic ReAct loop.

## 10. You probably want two APIs


One data API:

```text
search(...)
extract(...)
claims(...)
coverage(...)
provenance(...)
```


And one orchestration API:

```text
create_program(...)
execute(...)
pause(...)
resume(...)
modify(...)
inspect(...)
fork(...)
```


So agents can work at two levels.

A simple agent might call:

```text
search(...)
```


A planning agent might manipulate the whole program.

## Natural-language requests and candidate plans


The following passage from the natural-language interface dialogue (archived source 011) compares declarative requests with ambiguous language, then proposes candidate intent and a typed plan. Its complete calendar example and research references remain unchanged. The proposal does not establish that a well-formed plan matches the user's intended meaning.

The [opening argument and hybrid-interaction discussion]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction" >}}) remain separate. Read the [comments]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction-comments" >}}) for assumptions, interpretation, and the relation to the existing [mediation model]({{< ref "ai/design-research/03-language-and-compiler/04-dsl-as-mediation-layer" >}}). The [audit map]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-7-natural-language-interface-dialogue) records the passage's original range.

<!-- Natural-language candidate-plan passage begins below. -->

## It resembles declarative programming


SQL was already a huge step in this direction.

With SQL you say approximately:

> Give me these records satisfying these properties.

You don't specify B-trees, joins algorithms, memory allocation or disk access.

The database figures out how.

So:

```text
imperative code
       ↓
SQL
       ↓
natural language
```


can be viewed as successive increases in abstraction.

But there's one crucial difference.

SQL has formal semantics.

Natural language doesn't.

Consider:

> "Send the report to the important customers."

What does _important_ mean?

Revenue?

Strategic accounts?

Accounts at risk?

Customers personally marked important by Valery?

The ambiguity exists in the request itself. A better language model can't eliminate information that the human never supplied.

This gives us a proposed eventual architecture.

## Natural language probably becomes a compiler front-end


The model shouldn't directly control reality.

Instead:

```text
                     context
                        ↓
human intent ──→ language model
                        ↓
                candidate intent
                        ↓
                  typed plan / IR
                        ↓
                rules + permissions
                        ↓
                  deterministic
                     execution
                        ↓
                  observable result
```


IR here means an intermediate representation, just as a compiler converts source code into a more formal internal representation.

For example:

```text
"Move my meeting with Sarah to sometime
 Thursday afternoon when we're both free."
```


could become:

```yaml
intent: reschedule_event
event: <resolved event id>
participants:
  - Sarah
constraints:
  date: 2026-02-27
  start_after: "13:00"
  end_before: "18:00"
  require_all_available: true
```


Then conventional software handles calendars, permissions, collision detection and the actual update.

The language model's task ends where precision becomes mandatory.

SayCan is almost a textbook demonstration of this principle. The LLM knows that cleaning a spill might involve finding something absorbent and bringing it to the spill. The robot's learned skills determine which actions are actually feasible. ([arXiv](https://arxiv.org/abs/2204.01691?utm_source=chatgpt.com "Do As I Can, Not As I Say: Grounding Language in Robotic Affordances"))

PICARD showed a similar idea in a different domain: constrain model decoding so that generated SQL actually belongs to the SQL grammar. ([ACL Anthology](https://aclanthology.org/2021.emnlp-main.779/?utm_source=chatgpt.com "PICARD: Parsing Incrementally for Constrained Auto-Regressive Decoding from Language Models - ACL Anthology"))

This pattern keeps appearing.

## Intent compilation and bounded program synthesis


The following passage from the language-interface architecture reply (archived source 012) retains the complete customer-follow-up example, intent representation, compiler diagram, and restricted-program proposal. The model's use of the term compiler does not establish that interpretation has formal semantics or that a candidate plan matches the user's intent.

The [architecture overview]({{< ref "ai/design-research/interactive-systems/09-intent-environments-and-domain-boundaries" >}}) retains the complete stack proposal. The related [domain and operation passage]({{< ref "ai/design-research/03-language-and-compiler/13-domain-semantics-and-operation-contracts" >}}) describes business definitions and operation contracts. Read the [architecture comments]({{< ref "ai/design-research/interactive-systems/09-intent-environments-and-domain-boundaries-comments" >}}#interpretation-and-checking-answer-different-questions) for unresolved meanings, preview, and checking. The [stage 8 audit]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-8-language-interfaces-and-architecture) records the passage's original range.

<!-- Intent-compilation and bounded-program passage begins below. -->

## Then the LLM starts looking like a compiler


Suppose you say:

> Find customers whose usage dropped substantially after release 4.2, exclude churned accounts, and create follow-up tasks for the appropriate account owners. Show me what you're going to create first.

The LLM shouldn't immediately start clicking buttons.

Its output could be approximately:

```yaml
goal:
  type: customer_followup

inputs:
  release: "4.2"

selection:
  customers:
    usage_change:
      relative_to: release_date
      threshold: significant_drop

constraints:
  account_status:
    exclude: churned

actions:
  - resolve_account_owner
  - create_followup_task

execution:
  require_preview: true
```


This is an **intermediate representation**, or IR.

Then another component resolves:

```text
"usage dropped substantially"
```


using the company's semantic definition.

It discovers:

```text
release.get
telemetry.compare_usage
crm.find_accounts
crm.get_owner
tasks.create
```


And produces an execution graph.

The analogy to a compiler becomes quite strong:

```text
natural language
      │
      ▼
semantic interpretation
      │
      ▼
intent IR
      │
      ▼
planning / optimization
      │
      ▼
typed operations
      │
      ▼
execution
```


The difference is that the front-end is probabilistic.

Everything after it can become progressively more formal.

The LLM proposal regards that architecture as much more trustworthy than:

```text
prompt → giant agent loop → hope
```


<a id="generated-code-will-exist-but-i-dont-think-arbitrary-code-is-the-final-abstraction"></a>

## Generated code and the proposed final abstraction


Code as Policies demonstrated something powerful: an LLM can translate instructions into programs that compose existing APIs, including loops, conditionals and calculations. ([arXiv](https://arxiv.org/abs/2209.07753?utm_source=chatgpt.com "Code as Policies: Language Model Programs for Embodied Control"))

But there is a much older precedent that may point toward the safer long-term form: Flash Fill.

Gulwani's programming-by-example work takes a few examples and synthesizes a program inside a restricted language. That restriction is important. The resulting search space and semantics are controlled, and ambiguities can be surfaced to the user. ([Microsoft](https://www.microsoft.com/en-us/research/publication/automating-string-processing-spreadsheets-using-input-output-examples/?lang=ko-kr&utm_source=chatgpt.com "Automating String Processing in Spreadsheets using Input-Output Examples - Microsoft Research"))

The LLM forecast is:

```text
LLM writes arbitrary Python that can do anything
```


to be common during experimentation.

For mature systems, the LLM forecast goes further:

```text
LLM synthesizes program
       │
       ▼
bounded capability language
       │
       ├── query
       ├── filter
       ├── transform
       ├── call tool
       ├── branch
       ├── iterate
       └── request approval
```


In other words, the model creates a small program, but the language it programs in defines exactly what is possible.

This gives us something like:

> natural-language programming with a strongly constrained target language.

That's much easier to audit.
