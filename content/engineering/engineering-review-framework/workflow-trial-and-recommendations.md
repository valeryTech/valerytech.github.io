---
draft: false
toc: true
description: "Engineering assessment of review quality: behavioral properties, failure reasoning, design justification, test strength, and false positives."
document_status: "proposal"
title: "Workflow Trial And Recommendations"
linkTitle: "Engineering Quality Assessment and Trial"
---
# Engineering Quality Assessment and Trial


Assessment date: 2026-04-20.

## Judgment


The framework provides a sound engineering basis for remembering the concerns that matter. It is worth keeping its guidance on requirements, the surrounding system, measured quality targets, design principles used in context, and the limits of evidence.

Its main weakness is the gap between naming a concern and showing a sound reason for a conclusion. An expert can supply the reasoning, but the documents give little help with working it out. The proposed improvements concern engineering reasoning, not team organization, approvals, or review administration.

The main addition should connect four things: what must be true, which assumptions it depends on, how the implementation keeps or breaks that requirement, and what evidence supports the conclusion. For design criticism, explain the specific difficulty, what causes it, and the benefits and costs of the proposed alternative.

## What is already justified


- **Problem and requirements before implementation judgment.** Internally consistent code can implement the wrong behavior. The framework explicitly prevents treating the implementation as the specification.
- **System context beyond the diff.** Calls, consumers, stored data, and deployment versions determine behavior that a changed function alone cannot establish.
- **Quality targets with conditions.** Latency, resource use, and similar measurements need relevant workload assumptions. The requirements guide already says this.
- **Contextual principles.** The principles guide explicitly permits duplication, discourages mechanical extraction, and treats required validation and recovery as part of simplicity.
- **Evidence with limits.** Tests, inspection, benchmarks, and automated opinions establish different things. The testing and AI guides already distinguish those claims.

These are real engineering strengths. They do not show that this particular seven-part structure measurably improves reviews. That would require comparing it with other approaches on changes whose findings have been assessed independently.

## Trial: A retry implementation that appears straightforward


Assume a logical payment must not cause duplicate debits. Also assume that, after one interruption, a subsequent successful retry must complete a payment that has not yet occurred. The local completion record is durable, and the remote provider is a separate system.

An initial implementation is:

```text
if payment is recorded as completed:
    return
charge payment
record completion
```


This is small, understandable, and can pass a normal success test. A review that mentions explicit failure handling, retries, tests, and simplicity has not yet established that it satisfies the requirements.

A specific failure trace is:

1. The provider commits the debit.
2. The response is lost or execution stops before local completion is recorded.
3. The operation is retried.
4. The local record says incomplete, so the provider is called again.
5. A provider without deduplication commits a second debit.

The finding is supported by a specific failure scenario: the payment can be debited twice. The cause is the gap between state changes in two separate systems.

Now consider a plausible proposed fix:

```text
if payment is recorded as completed:
    return
record completion
charge payment
```


If execution stops after recording completion but before calling the provider, a retry skips the charge. This change prevents that duplicate path but creates a path where the payment is never made. Reviewing the fix requires checking both properties again.

### Executed model


A local Python model exercised an initial attempt and a retry, with one injected interruption. The table reports actual debit counts; the expected count was one for each modeled scenario.

| Interruption | Record after provider call | Record before provider call | Provider deduplicates stable operation key |
| --- | --- | --- | --- |
| None | 1 | 1 | 1 |
| Before provider call | 1 | 0 | 1 |
| After provider commit, before response | 2 | 1 | 1 |
| After response, before local completion | 2 | 1 | 1 |
| After success bookkeeping | 1 | 1 | 1 |

The last variant assumes the provider durably deduplicates repeated uses of the same operation key. The result depends on that contract holding. The model does not verify a real provider, concurrent requests, key expiration, changed payloads, or all possible failures. It shows why those assumptions matter. It does not prove that an implementation is ready for production.

### What this reveals about the framework


The technical guide already names partial failure, retries, and idempotency. The requirements guide already covers failure behavior. The missing detail is how to turn those reminders into reasoning about the order of effects and the states visible after an interruption.

An improvement would ask the reviewer to state what must be true, mark the points where durable state or external effects change, and check what happens if execution stops and retries at those points. For concurrent code, also check relevant interleavings: the possible orders in which operations can run.

The example was constructed with known failures. It demonstrates a useful way to reason. It does not measure whether the framework helps find more defects.

## Change 1: Make important properties explicit


Extend the technical guide with a short section on what must be true in the states that users or other systems can observe. Examples include:

- A request cannot expose another tenant's records.
- Retrying one logical operation cannot repeat its external effect.
- A successful operation preserves the required data relationships.
- A supported reader can interpret data written during a version transition.
- Resource use stays within its limit under the specified workload.

Then ask where the implementation establishes each relevant property and what assumptions it relies on. A temporary state inside a transaction may be acceptable. The review needs to make clear when that state can be observed and what happens if execution fails.

This strengthens existing requirements and failure guidance. It does not require formal proofs or an invariant list for every small change.

## Change 2: Give design criticism a causal justification


The principles guide is appropriately qualified, but named principles still need concrete application examples.

A claim such as "this violates single responsibility" needs an explanation of which responsibilities conflict and what problem the conflict causes. "Extract this to maintain one abstraction level" needs an explanation of how extraction makes the code easier to understand, hides implementation details, improves testing, or makes changes safer.

For example, a short function may show a debit, credit, and their shared transaction together. Extracting helpers can improve naming, but separate helpers can also obscure the transaction dependency. Compare both versions on whether the atomicity requirement remains clear and enforced.

Likewise, two similar calculations may represent the same business rule or independent rules that happen to match today. DRY supports sharing knowledge; visual similarity alone does not establish shared ownership of the rule. The existing guide says this correctly. Add a worked example showing when sharing helps and when it creates coupling.

For a proposed design improvement, explain:

1. The concrete comprehension, dependency, consistency, or change problem.
2. How the current structure creates it.
3. How the alternative improves it.
4. What additional indirection, constraints, or complexity the alternative introduces.

A reasoned design argument can be sufficient. Readability and maintainability are engineering concerns even without a production incident or numerical benchmark.

The technical guide has a separate section explaining abstraction consistency. It mainly lists failure and state reasoning in a table. Give those topics a similar amount of explanation.

## Change 3: Review whether tests distinguish correct and incorrect behavior


The testing guide already asks for relevant tests and valid assertions. Ask a more specific question: would the test fail if this plausible defect were present?

Examples:

| Claimed coverage | Plausible defect the evidence should distinguish |
| --- | --- |
| Tenant isolation | The tenant restriction is removed or the wrong tenant is used. |
| Boundary handling | Equality is treated incorrectly at the boundary. |
| Retry correctness | The first attempt commits remotely but its response is lost. |
| Compatibility | The old supported reader consumes the newly written data. |

These questions can be answered through inspection, a targeted test, or an appropriate experiment. A mandatory mutation-testing tool is unnecessary.

Review the assumptions built into test doubles. A mock that always fails before producing a side effect cannot establish behavior when a real dependency can fail after producing that effect.

This is consistent with Google's review guidance, which explicitly asks whether tests fail when the code is broken and whether their assertions are useful.[1]

## Change 4: Require an attempt to disprove important findings


Review quality includes avoiding incorrect findings and harmful fixes. The technical guide already requires a connection to behavior or a concrete maintenance concern; the AI guide already discusses invented defects. Add a concise example of checking the mechanism that could make a suspicious pattern safe.

A local export function may lack a tenant predicate because its input is already restricted by a verified upstream query. Establish that contract before asserting a leak. Conversely, the mere name `authorized_rows` is insufficient evidence of the restriction.

A transaction elsewhere may protect an update, a documented input constraint may make a boundary unreachable, or an existing serializer may already escape a value. Trace those protections rather than assuming either their presence or absence.

For each important finding, identify what triggers the problem and which property it affects. Then check whether the surrounding system prevents that trigger or protects the property in another way. This need not become a separate reporting form.

## Change 5: Compare alternatives against the same requirements


The retry model demonstrates why removing the reported symptom is insufficient. A fix can replace a duplicate-operation failure with a lost-operation failure.

Check the original properties again after a proposed correction. For design changes, compare alternatives under the same supported behavior, environment, and quality constraints. Reducing line count while weakening validation does not satisfy that comparison; adding an abstraction whose cost exceeds its demonstrated benefit may not improve the design.

This follows the existing principle that simplicity includes required correctness, security, and recovery. A worked example would make the principle usable during actual judgment.

## Placement of AI guidance and tools


The AI guide's distinctions between observed results, reasoning, assumptions, and correlated code/test mistakes are valuable. Those evidence standards apply to all changes. Keep them visible in the general technical and testing guidance, with AI-specific examples and provenance concerns in the AI note.

Tools provide evidence or possible findings. Using tools, adding more tools, or getting tools to agree does not by itself show that a quality requirement is met. The current tools guide already recognizes this; preserve that treatment.

## Concrete revisions recommended


| Document | Engineering improvement |
| --- | --- |
| Technical Review Guide | Add property and assumption analysis, failure traces, relevant interleavings, and verification of surrounding protections. |
| Software Engineering Principles | Add contrasting examples that require a concrete design benefit and acknowledge the alternative's costs. |
| Testing, CI, and PR Review Guide | Add plausible-defect sensitivity and realism of dependency failure models. |
| Requirements and Quality Targets | Connect key expectations to properties and operating assumptions used in technical reasoning. |
| Engineering Review Framework | Explain the reasoning connection between requirements, mechanisms, design judgment, and evidence. Keep the categories as recall aids. |

The framework's broad coverage is defensible. Strengthening these connections would give it a better basis for producing justified findings, rejecting false positives, and assessing proposed fixes.

## References and limits


[1] Google Engineering Practices, [What to look for in a code review](https://google.github.io/eng-practices/review/reviewer/looking-for.html), particularly functionality, complexity, and tests.

[2] Google Engineering Practices, [The Standard of Code Review](https://google.github.io/eng-practices/review/reviewer/standard.html), particularly technical reasoning, design alternatives, and personal preference.

These sources support general review practices. They do not validate this framework's particular organization or demonstrate its effectiveness. The proposed changes above are engineering judgments based on the local documents and the examples given here.
