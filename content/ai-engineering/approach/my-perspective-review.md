---
draft: false
toc: true
title: "Review of My Perspective on AI Engineering"
aliases:
  - "/ai-engineering/approach/my-perspective-comment/"
description: "Reviews a production AI engineering statement for company alignment, identifying missing accountability, domain participation, proportional rigor, and evidence-based planning mechanisms."
linkTitle: "Perspective Review"
---
## Overall assessment


The [production AI engineering statement]({{< ref "ai-engineering/approach/my-perspective" >}}) is a strong **technical positioning statement**, but only a partial **company-alignment document**. This review examines what it communicates and what a company would still need to clarify.

It communicates a coherent view of production AI engineering: the engineering object is not merely the model, prompt, or agent workflow, but the full system required to understand, evaluate, change, release, operate, and improve AI behavior. The opening establishes unusually broad lifecycle responsibility, from orchestration and retrieval through evaluation, observability, release, recovery, and continuous improvement.

This positions the author as an engineer concerned with turning AI capabilities into dependable products, beyond demonstrations and isolated model integrations.

However, a prospective company can agree with nearly everything in the document while still operating in a way that conflicts with the author's expectations. The document explains **the author's engineering view**, but only indirectly explains:

- how the author expects teams to work;
- which organizational conditions the author needs;
- which mechanisms should exist;
- where responsibility should sit;
- how much rigor is appropriate at different stages;
- what the author would introduce or change.

It is therefore best understood as a **philosophy and fit filter**, not yet an operating-model proposal.

## The document's real thesis


The deepest claim is not merely that "evals are important." It is:

> AI behavior is a system-level engineering concern, and the organization needs an engineering system capable of producing reliable evidence about that behavior throughout the product lifecycle.

The logic appears to be:

```text
Behavior cannot be derived from implementation structure alone
                         ↓
Small or local changes may produce broad behavioral effects
                         ↓
Behavior must be established under representative conditions
                         ↓
Evaluation, observability, experimentation and production feedback
become part of the core engineering process
                         ↓
The system must be designed not only to produce behavior,
but also to make that behavior understandable and changeable
```


That central idea is stated well. The document distinguishes between building individual AI capabilities and solving the broader engineering problem that arises when those capabilities interact inside a product. It defines that problem as making behavior understandable and evaluable while making the system itself changeable and operable.

This is the strongest part of the document.

It also correctly connects product framing, system architecture, experimentation, evaluation, observability, reliability, release engineering, and production feedback rather than treating them as separate phases or teams.

## What it aligns well

### It establishes the role's scope


The proposed role extends beyond any one of the following:

- a prompt engineer;
- a model researcher;
- an application engineer who only integrates an API;
- an infrastructure engineer detached from product behavior;
- an evaluator who enters after implementation.

The statement describes a production AI systems role spanning capability, product behavior, architecture, evidence, and operations.

That will align well with companies looking for a senior or staff-level engineer, technical lead, or early AI engineering leader who can connect these concerns.

It may align less naturally with companies hiring for a tightly segmented role. That is not necessarily a defect; it may be useful filtering.

### It rejects the "feature plus model API" view


The document implicitly rejects a common development model:

```text
Build the feature
→ attach a model
→ add tests and monitoring later
```


Instead, it presents evaluation, observability, release, and continuous improvement as constitutive parts of the AI capability itself. That is a meaningful and defensible distinction.

### It treats evaluation as a methodology, not just tooling


The evaluation section is particularly strong. It says an evaluation system needs a method for:

- identifying consequential behavior and failure modes;
- turning them into criteria;
- constructing representative cases;
- feeding experimentation and production learning back into the system.

It also recognizes that generic metrics can exist while still missing the failures that matter to the product.

This is more mature than saying "we need an eval framework."

### It expresses useful cultural constraints


The final principles make the organizational prerequisites visible:

- uncertainty must be discussed explicitly;
- evidence must affect decisions;
- failures must be exposed rather than hidden;
- architecture and product assumptions must remain revisable;
- AI behavior must not be treated as someone else's concern;
- product design must respect capability limits.

These principles are clearly stated and form a credible fit filter.

They indicate that the author is unlikely to thrive in an environment where leadership expects deterministic guarantees from weak evidence, where failures are concealed, or where teams are pressured to preserve an initial AI product concept regardless of observed limitations.

## The main ambiguity: what exactly must be shared?


The phrase **"shared ownership of behaviour"** is directionally right but organizationally ambiguous.

Shared ownership can mean:

1. several disciplines contribute to behavior quality; or
2. nobody has final accountability because responsibility is distributed.

The document appears to mean the first: product, engineering, evaluation, release, and operations should not optimize independently. But a prospective company may still ask:

- Who is ultimately accountable for the capability?
- Does the product team own behavior in production?
- Does an AI platform team own eval infrastructure only?
- Who defines quality thresholds?
- Who has release authority?
- Who decides that a capability is not reliable enough to ship?
- Who maintains the evaluation set?
- Who investigates production failures?

A stronger formulation would distinguish:

> **Cross-functional responsibility with explicit accountability.**

For example, the product team might own the capability end to end, while domain experts, platform teams, security, and operations contribute through defined interfaces.

## The second ambiguity: target specification versus empirical establishment


The most conceptually vulnerable sentence is:

> "Many important behavioural expectations cannot be specified completely in advance."

This sentence permits a broader reading than the rest of the statement supports. A team can often define:

- the JTBD;
- the target capability;
- primary product properties;
- unacceptable outcomes;
- quality dimensions;
- operational constraints;
- the human-AI workflow.

The difficult part is not necessarily specifying the product intent. It is establishing whether a particular system satisfies that intent across the relevant distribution of conditions.

A more precise underlying claim is:

> Important behavioral expectations can often be defined upfront, but their complete operationalization, coverage across real cases, and satisfaction by a particular implementation must be established empirically.

That distinction matters for company alignment. Without it, some readers may interpret the position as:

- requirements are inherently unstable;
- AI work cannot be planned;
- product specifications have limited value;
- experimentation should replace product framing.

That is not the position expressed by the document as a whole, but the sentence permits that reading.

## The third ambiguity: broad integration versus role sprawl


The document covers an extensive scope:

```text
AI capability
orchestration
tool use
context
retrieval
state and memory
long-running execution
recovery
evaluation
observability
release
operation
continuous improvement
```


That breadth communicates systems thinking. It can also create two possible concerns.

First, companies may wonder whether the proposed role requires one engineer or team to own all of these areas directly.

Second, they may wonder where the author has the greatest depth. A list covering nearly the whole lifecycle can make positioning less specific unless the document distinguishes:

- what the author personally leads;
- what the author directly implements;
- what the author influences;
- what the author expects to integrate with other teams.

The likely intended message is:

> These concerns must form one coherent engineering system, even when responsibility is distributed across multiple people or teams.

Making that explicit would prevent the document from sounding like a demand for unlimited scope.

## What is currently present and absent


|Area|Coverage in the document|Assessment|
|---|---|---|
|Engineering philosophy|Strong|Clear and differentiated|
|AI engineering system|Strong|The central subject|
|Evaluation methodology|Strong|One of the best sections|
|Engineering practices|Partial|Named, but not operationalized|
|Organizational principles|Strong|Clear fit criteria|
|Organizational mechanisms|Mostly implicit|Reviews, decisions and feedback loops are not concretely defined|
|Team structures and roles|Largely absent|No explicit ownership or collaboration model|
|Product and roadmap approach|Mostly absent|Uncertainty is discussed, but planning implications are not|
|Governance and assurance|Limited|Capability limits are present, but risk controls and oversight are not|
|Proportionality by product stage or risk|Absent|The approach can sound universal and equally heavy for every product|
|Concrete examples|Absent|The philosophy is not illustrated through a real system or decision|

This is not necessarily too much missing material for one document. It depends on the document's intended function.

If it is a personal engineering statement, the current scope is reasonable.

If it is intended to align with companies on **how AI development should operate**, then the missing mechanisms and expectations are significant.

## How different companies may read it

### An early-stage startup


Likely positive interpretation:

> This person can build across the stack and will not stop at a prototype.

Possible concern:

> Will they introduce evaluation platforms, formal processes, and production machinery before we have validated the product?

The document does not currently state that the engineering system should be proportionate to:

- product maturity;
- risk;
- autonomy;
- scale;
- reversibility;
- blast radius.

Adding that principle would make the practical limits of the approach clearer. A spreadsheet, manual review, and a small eval set can be the correct engineering system at an early stage. The important point is the feedback loop, not the sophistication of the infrastructure.

### An AI-native product company


This is probably the strongest fit. Such a company is likely to understand the connection between traces, evaluation, system architecture, release, and production behavior.

Their main questions would concern the author's concrete methods and experience rather than the engineering philosophy.

### A mature enterprise


The systems framing will likely resonate, but the document may appear incomplete without:

- security;
- privacy;
- compliance;
- model-provider governance;
- auditability;
- incident management;
- human oversight.

Those may not belong in the core statement, but enterprise readers may treat them as part of "production AI engineering."

### A highly segmented engineering organization


A company with separate product engineering, ML platform, SRE, data, and evaluation teams may agree with the integrated system view while questioning role boundaries.

For this audience, it is important to say that **integration of concerns does not require centralization of all work**.

## The cultural principles are useful, but they should become observable


The final section currently describes qualities. That is useful, but companies can claim all of them abstractly.

For example:

> "We are intellectually honest about uncertainty."

That only becomes meaningful through behavior such as:

- assumptions are written down;
- confidence levels are communicated;
- failed experiments are not hidden;
- quality evidence can change roadmap decisions;
- leadership accepts a "not currently feasible" conclusion;
- teams can reduce scope when capability limits are found.

Similarly:

> "We expose failures."

Observable evidence would include:

- access to representative production traces;
- regular error analysis;
- incident review;
- failure cases added to regression evals;
- no incentive to report only aggregate success metrics.

For alignment, converting values into **observable operating conditions** would make the document substantially stronger.

## The largest missing idea: organizational participation in behavior


The document says behavior is a shared engineering responsibility, but it does not identify the role of domain expertise.

Application-specific evaluation often requires people who can determine whether behavior is actually correct, acceptable, useful, or safe in the relevant domain. Engineers can build the evaluation system, but they may not possess the knowledge needed to define every criterion.

The document could explicitly state that production AI development often requires ongoing collaboration between:

- engineers;
- product leaders;
- domain experts;
- operations or frontline users;
- risk and assurance specialists where relevant.

This would extend the systems view from the technical system into the organizational system.

It would also clarify that evaluation is not merely an engineering-owned test suite. It is an interface through which domain knowledge becomes part of product development.

## Another missing idea: planning under capability uncertainty


The document explains why evidence and adaptability matter, but it does not explain how this affects commitments.

A company may agree that AI behavior is uncertain while still expecting:

```text
fixed feature
+ fixed scope
+ fixed quality
+ fixed date
```


The document does not state a position on:

- time-boxed capability exploration;
- feasibility work before delivery commitment;
- roadmap confidence;
- capability thresholds;
- continue, pivot, narrow, or stop decisions;
- separating product intent from implementation uncertainty.

This may be intentional--the document is focused on engineering rather than portfolio management. But if it is used to align with companies about **AI development generally**, this is one of the most important practical consequences of the thesis.

## Tone and presentation


The tone is serious, senior, and technically credible. It avoids vendor language and trend-driven terminology.

There are, however, some presentation issues.

The document is conceptually dense. Terms such as:

- partial specification;
- compositional behavior;
- runtime drift;
- non-local change effects;
- weak attribution;

are compressed into a single list.

A reader already familiar with production AI systems will understand them. A founder, generalist CTO, recruiter, or conventional engineering leader may not.

Two presentation options are available:

1. Define the most important terms through concrete consequences.
2. Remove the taxonomy and explain the practical problem directly.

For example, instead of listing "weak attribution," the statement could explain that when behavior regresses, it can be difficult to determine whether the cause was the prompt, retrieved context, model version, tool behavior, state, or interaction among them.

There is also some repetition around "connected parts," "engineering system," "behavior," and "product lifecycle." The repetition reinforces the thesis, but some of it could be compressed to create room for practical implications.

## What the document currently answers


A company reading it can answer:

> What does this person believe production AI engineering includes?

Clearly.

> What engineering problem do they think is most important?

Clearly.

> How do they think evaluation should function?

Clearly.

> What values do they expect from a team?

Reasonably clearly.

But the company cannot yet answer:

> What would this person introduce in our first three months?

> Which mechanisms do they consider essential versus optional?

> How should domain experts participate?

> How should responsibilities be divided?

> How does the approach differ for an early prototype and a high-risk production agent?

> What does this imply for planning and roadmap commitments?

> How would we know whether our current operating model is compatible with theirs?

Those are the gaps between a philosophy document and an alignment instrument.

## Recommended evolution


Recommendation: preserve the current conceptual core. It is distinctive and internally consistent.

Rather than turning it into a large operating-model document, add three compact layers.

### 1. "What this means in practice"


Five or six concrete expectations, such as:

- The product team defines explicit capability and quality expectations.
- Representative traces are easy to inspect.
- Domain experts participate in error analysis and evaluation design.
- Meaningful system changes are compared against relevant evals.
- Release decisions use behavioral evidence, not only implementation completion.
- Production failures feed back into evaluation and engineering priorities.

### 2. Applying the approach proportionately


Clarify that this does not mean building a comprehensive platform upfront.

The amount of process and infrastructure should depend on:

- product maturity;
- consequence of failure;
- autonomy;
- traffic and scale;
- reversibility;
- regulatory exposure.

This would directly address the risk that the document sounds overengineered.

### 3. Expected team conditions


Translate the final principles into observable conditions:

- access to production evidence;
- collaboration with domain experts;
- permission to surface weak evidence;
- ability to revise scope or assumptions;
- explicit ownership of product behavior;
- willingness to invest in evaluation and operations as product capabilities.

## Overall conclusion


The document already has a strong central idea:

> Production AI engineering is the design of both the behavior-producing system and the engineering system needed to understand, evaluate, change, release, and improve that behavior.

It succeeds as a statement of technical philosophy and senior engineering identity.

Its main limitation is that it stops one level before organizational practice. It says that evaluation, production learning, adaptability, and shared ownership matter, but it does not yet define the concrete structures and mechanisms through which a company would make them real.

Keep the existing statement as the conceptual layer, without expanding it into a comprehensive methodology. Add a short practical layer showing **what these beliefs require from product teams, domain experts, engineering infrastructure, release decisions, and company leadership**.
