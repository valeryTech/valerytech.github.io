---
draft: false
toc: true
title: "00 Refactor"
linkTitle: "00 Refactor"
---
The evaluation mechanics are already compatible with the new delivery mindset; the main changes are at the top of the model: what the product commits to, what a delivery change is, and what "release readiness" means.

```
ai-evaluation.md
product-and-evaluation-model.md
20-failure-understanding.md
```

XXX

The framework is already close. I would not redesign the evaluation subsystem. I would change the **product model around it**.

The strongest parts already fit the new framing:

- evaluation starts from a decision/uncertainty, expected behavior, and observed behavior;
- Quality Understanding and Evidence Capability evolve independently from the product implementation;
- evaluation produces scoped evidence and findings, while product owners make product and release decisions;
- failure understanding builds product-specific knowledge from actual traces rather than assuming a fixed generic taxonomy.

The classical framing is mostly visible **above** those mechanisms.

### 1. The main conceptual change


Today the model contains language like:

> AI Product = intended value-producing capability

and:

> MVP scope
> supported capabilities
> introduce a feature
> build the MVP

Your goal tree even has `G3. Deliver product capabilities -> Build the MVP -> Introduce new features`.

That is where I'd make the change.

Instead of making the central delivery object a **feature/MVP/capability**, make it a:

> **Committed product behavior within a bounded production scope.**

So the conceptual flow becomes:

```text
DISCOVERY

Target opportunity
        ↓
Solution hypothesis
        ↓
Risk reduction / evidence
        ↓
PRODUCTIZATION COMMITMENT
        │
        │ "We are willing to operate this
        │  bounded behavior in production."
        ▼

DELIVERY

Production slice
= functional scope
+ committed behavior
+ production constraints
        ↓
Candidate AI System
        ↓
Probe / observe
        ↓
Evaluation
        ↓
Release decision
        ↓
Controlled production
        ↓
Production evidence
        ↺
```


The evaluation subsystem sits across this entire structure.

### 2. I would redefine `AI Product`


Your current definition is:

> An AI Product is an intended value-producing capability offered to a defined set of actors.

"Capability" is now causing us trouble because we're using the same word for model abilities, product functionality, and roadmap units.

I'd change it to something like:

> **An AI Product is a set of intended product behaviors offered to defined actors to produce intended outcomes.**

Its normative structure then becomes:

```text
AI Product
├── Purpose and intended outcomes
├── Target users and affected actors
├── Jobs
├── Functional scope
├── Committed product behaviors
├── Guarantees and invariants
├── Boundaries and unsupported situations
└── Unacceptable failures
```


I would remove `MVP scope`.

For a delivered product, use:

> **current production scope**

or:

> **committed production slices**

Discovery can still have prototypes and solution scopes. They don't need to masquerade as an MVP.

### 3. Production slice becomes the delivery planning unit


For Wallet:

```text
Solution B
One-shot natural-language transaction capture
```


is the selected solution.

Then Delivery may commit:

```text
Production slice B1

Functional scope:
Common determinate expenses

Committed behavior:
Natural-language description
→ structured editable draft
→ explicit review
→ deterministic validation
→ guarded persistence

Production constraints:
Safety
Latency
Privacy
Reliability
Observability
Rollback
Cost
```


That is what evaluation should ultimately attach to.

Not:

```text
feature = transaction capture
evals = tests for that feature
```


but:

```text
production slice
    ↓
committed behaviors
    ↓
conditions under which they must hold
    ↓
evidence needed
    ↓
evaluation questions / cases / criteria
```

### 4. This changes the meaning of the Product Improvement Loop


Your current Product Improvement Loop is very broad. It owns things such as:

> identifying and framing opportunities; deciding which problems to pursue; defining a change hypothesis; implementing; releasing; monitoring.

That mixes Discovery and Delivery.

I would narrow it.

After the productization commitment, the **Delivered Product Improvement Loop** would ask:

> How should the currently committed and delivered product state change?

For example:

```text
Production finding:
Expense requests containing two amounts are often
interpreted incorrectly.
        ↓
Does existing product intent clearly say what should happen?
        │
      yes
        ↓
Delivery problem
        ↓
change hypothesis
        ↓
candidate implementation
        ↓
evaluation
        ↓
release
```


But:

```text
Production finding:
Users consistently expect one-shot capture to resolve
something we intentionally leave unresolved.
        ↓
We don't know what the product should promise here.
        ↓
Discovery
```


That boundary becomes useful.

Delivery improves the implementation of a sufficiently clear commitment.

Discovery revisits what we should commit to.

### 5. Keep `Delivered AI Product State`, but decompose it


Your current definition is:

> product intent + configured AI System + operating/rollout policy.

I actually like this aggregate concept for the improvement loop.

But for evaluation traceability, don't treat it as one indivisible version.

Keep three independently versioned things:

```text
Product Behavior Contract
What should happen?

AI System Configuration
How is it currently implemented?

Operating / Rollout Policy
Who experiences which configuration and under what conditions?
```


Then evaluation compares:

```text
Behavior Contract v12
        +
System Candidate v37
        +
Operating conditions
        ↓
Observed execution
        ↓
Judgment
```


This makes failures much easier to interpret.

A changed prompt does not mean product intent changed.

A changed product guarantee does.

### 6. Your core evaluation definition survives almost unchanged


Your current definition is strong:

> AI evaluation is an iterative, evidence-driven engineering practice that frames a decision or knowledge need, makes intended behaviour explicit, probes and observes actual behaviour, applies validated judgement, builds reusable Quality Understanding, and uses the resulting findings to support product improvement and governance decisions.

I wouldn't materially change it.

The change is what feeds `intended behaviour`.

Previously:

```text
Product definition
→ MVP / feature / capability
→ expected behavior
```


Now:

```text
Productization commitment
        ↓
Production slice
        ↓
Committed product behavior
        ↓
Expected behavior
        ↓
Evaluation
```


That is a cleaner normative source.

### 7. The three loops become clearer


Your three-loop model remains useful.

I would interpret it like this:

|Loop|Persistent object|Delivery question|
|---|---|---|
|**Delivered Product Improvement**|Delivered AI Product State|How should we change the delivered system while meeting our product commitments?|
|**Quality Understanding**|Quality Understanding|What does good/bad behavior mean, what have we observed, and what remains unknown?|
|**Evidence Capability**|Evidence Capability|Can we produce trustworthy evidence for the decisions we need to make?|

Then Discovery sits around this system and can be entered whenever evidence challenges the product commitment itself.

So you don't need a fourth "Discovery loop" inside the evaluation architecture.

### 8. Your failure-understanding work fits especially well


I wouldn't change much there.

The important addition is a routing question after a failure is understood:

```text
Observed failure
      ↓
Does it violate an existing committed behavior?
      │
  yes │
      ↓
Delivery / Product Improvement
```


or:

```text
Observed behavior
      ↓
Existing commitment does not tell us whether this is good or bad
      ↓
Product-intent uncertainty
      ↓
Discovery
```


or:

```text
Observed behavior
      ↓
Cannot determine what happened because trace is incomplete
      ↓
Evidence Capability
```


Your current framework already has the latter two distinctions between product failure, Quality Understanding problems, and missing evidence.

We are adding the **Discovery vs Delivery routing dimension**.

### 9. The biggest change to your lifecycle


Your current lifecycle says:

```text
Product goal, problem, or opportunity
        ↓
Frame intended change
        ↓
Define change hypothesis
        ↓
Design and implement candidate
...
```


I would split that explicitly:

```text
DISCOVERY LIFECYCLE

Outcome / opportunity
        ↓
Solution candidates
        ↓
Risk hypotheses
        ↓
Prototypes / research / evals
        ↓
Evidence
        ↓
Productization commitment
```


then:

```text
DELIVERY LIFECYCLE

Productization commitment
        ↓
Select production slice
        ↓
Define committed behavior
and production constraints
        ↓
Define delivery change hypothesis
        ↓
Implement candidate
        ↓
Offline evaluation + software tests
        ↓
Release decision
        ↓
Progressive exposure
        ↓
Online evidence
        ↓
Evaluate gaps
        ↓
Improve delivery
or reopen discovery
```


There are therefore **two kinds of hypothesis**.

During Discovery:

> Will Solution B solve the opportunity?

During Delivery:

> Will changing the interpreter in this way reduce account-reference failures while preserving the other committed behaviors?

The same hypothesis/evidence discipline applies, but the decision context is different.

### 10. And this gives evals a very precise role


Your original Teresa-inspired statement still works:

> define good behavior -> observe actual behavior -> evaluate gaps -> improve the product -> evaluate again

I'd only make one thing explicit:

```text
                     ┌── Discovery
                     │   "Is our definition of good behavior
                     │    or solution itself wrong?"
                     │
gap ─────────────────┤
                     │
                     └── Delivery
                         "The intended behavior is clear;
                          the system doesn't meet it."
```


And a third route already present in your framework:

```text
                     └── Evaluation subsystem
                         "We cannot judge this reliably yet."
```


That is probably the conceptual connection your framework was missing.

So I would **preserve most of the evaluation architecture**. The larger rewrite should be around `AI Product`, the product-owner goal tree, the Product Improvement Loop's scope, and the Delivery Lifecycle. The cases, traces, Quality Understanding, failure models, evaluators, offline/online planes, and Evidence Capability all survive with relatively minor terminology changes.
