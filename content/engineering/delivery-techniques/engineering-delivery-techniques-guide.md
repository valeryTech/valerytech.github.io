---
draft: false
toc: true
title: "Engineering Delivery Techniques Guide"
linkTitle: "Engineering Delivery Techniques Guide"
---

**Audience:** engineering teams, engineering leads, product leads, technical program managers

**Status:** draft guidance

**Purpose:** help teams choose and apply the right delivery technique based on the type of uncertainty, risk, or lifecycle phase they are dealing with.

## 1. Purpose


Engineering teams use terms such as _spike_, _proof of concept_, _prototype_, _walking skeleton_, _MVP_, _pilot_, and _canary_ to describe early or incremental work.

These terms are often used loosely. That creates planning problems:

- A throwaway experiment gets treated as a foundation.
- A prototype gets mistaken for an MVP.
- A POC bypasses the exact integration risk it was supposed to test.
- A walking skeleton becomes a large horizontal platform project.
- A pilot starts before the system has enough observability to learn from it.
- A feature flag is used to hide uncertainty that should have been resolved earlier.

This guide gives a consistent way to choose, scope, execute, and review common engineering delivery techniques.

The main rule is:

> Choose the technique based on the question you need answered or the risk you need reduced.

Do not choose a technique because it sounds lightweight, executive-friendly, or familiar.

## 2. Core Selection Model


Most techniques in this guide are ways to reduce uncertainty. The useful question is not "what do we want to build?" but:

> What do we need to learn, prove, validate, or de-risk next?

The answer determines the technique.

| Primary uncertainty or risk | Use this technique |
|---|---|
| We do not know enough to make a decision | Spike |
| We do not know whether a technical idea is feasible | Proof of Concept |
| We do not know whether users understand or want the experience | Prototype |
| We do not know whether the intended architecture can run end-to-end | Architectural Walking Skeleton |
| We need to test a technical direction through a narrow implementation | Tracer Bullet |
| We need one small behavior delivered through the full stack | Thin Vertical Slice |
| We need the smallest usable product version to validate value | MVP |
| We need to show correct usage of a component, API, or pattern | Reference Implementation |
| We need to align on a proposed design before building | RFC / Technical Design Doc |
| We need to record a decision and its tradeoffs | ADR |
| Upcoming features need a small amount of enabling technical foundation | Architecture Runway |
| We need to validate with real users or real workloads before broader launch | Pilot / Beta |
| We need internal use before external exposure | Dogfooding |
| We need controlled runtime enablement or rollback | Feature Flag |
| We need gradual production traffic exposure | Canary Release |
| We need to exercise production behavior without user-visible activation | Dark Launch |
| We need to improve readiness before broad release | Hardening |
| We need to reduce accumulated complexity or delivery drag | Refactoring / Technical Debt Paydown |
| We need to replace or move a system safely over time | Migration Slice |

## 3. Lifecycle Mapping


The techniques are not a strict sequence. Teams may skip, repeat, or combine them. However, they tend to cluster by lifecycle phase.

| Lifecycle phase | Typical goal | Common techniques |
|---|---|---|
| Discovery | Reduce ambiguity before committing | Spike, POC, Prototype, RFC |
| Architecture formation | Establish system structure | Walking Skeleton, Tracer Bullet, Reference Implementation, ADR |
| Incremental delivery | Add usable capability in small increments | Thin Vertical Slice, MVP, Feature Flag |
| Production validation | Test with real users, traffic, or workloads | Dogfooding, Pilot, Beta, Canary, Dark Launch |
| Readiness and maturity | Improve safety, scale, maintainability | Hardening, Refactoring, Architecture Runway, Migration Slice |

A common flow for a new capability:

```text
Spike or POC
  -> Prototype, if user experience is uncertain
  -> RFC / Design Doc, if alignment is needed
  -> Architectural Walking Skeleton, if integration or architecture is risky
  -> Thin Vertical Slices
  -> MVP
  -> Dogfooding / Pilot / Beta
  -> Canary / General Release
  -> Hardening / Refactoring
```


This sequence is illustrative, not mandatory.

## 4. Decision Tree


Use this as a practical selection path.

### 4.1 If the team does not know what to do yet


Use a **Spike**.

Choose this when the problem is ambiguous and the output should be a recommendation, decision, or narrowed set of options.

### 4.2 If the team knows the idea but doubts feasibility


Use a **Proof of Concept**.

Choose this when the main question is whether a technology, algorithm, integration, data source, or approach can work at all.

### 4.3 If the team doubts the user experience or product shape


Use a **Prototype**.

Choose this when the main question is whether users understand, want, or can use the proposed experience.

### 4.4 If the team doubts whether the system parts will work together


Use an **Architectural Walking Skeleton**.

Choose this when the main risk is integration, architecture, data flow, boundaries, deployment shape, or operational visibility.

### 4.5 If the team knows the architecture and needs to deliver incrementally


Use **Thin Vertical Slices**.

Choose this when each increment should add one small behavior through the stack.

### 4.6 If the team needs to validate product value


Use an **MVP**.

Choose this when the output must be usable enough to test whether the product direction creates value.

### 4.7 If the team needs production learning with controlled risk


Use **Dogfooding**, **Pilot**, **Beta**, **Feature Flags**, **Dark Launch**, or **Canary**.

Choose based on who is exposed, whether behavior is user-visible, and how rollout control is needed.

### 4.8 If the team needs stability or maintainability before scale


Use **Hardening**, **Refactoring**, **Architecture Runway**, or **Migration Slices**.

Choose based on whether the risk is operational readiness, code structure, missing enabling foundation, or migration risk.

## 5. Standard Technique Record


For any planned spike, POC, walking skeleton, MVP, pilot, or similar activity, write a short record before starting.

Use this template:

```md
# Technique Record: <name>

## Technique

<Spike / POC / Prototype / Walking Skeleton / etc.>

## Goal

What question will this work answer?

## Primary Risk

What uncertainty or risk is being reduced?

## Scope

What is included?

## Non-Goals

What is explicitly excluded?

## What Must Be Real

What cannot be faked without invalidating the result?

## What Can Be Simplified

What may be partial, rough, local, temporary, or incomplete?

## Completion Criteria

How will we know this activity is done?

## Expected Lifespan

Will the output be discarded, extended, shipped, or used as reference material?

## Decision or Next Step

What decision should this enable?
```


A technique without a clear question and completion criteria tends to expand until time runs out.

## 6. Shared Guidance

### 6.1 Be explicit about lifespan


Before starting, decide whether the output is expected to be:

- **Disposable:** useful for learning, not intended to become production code.
- **Extendable:** expected to become the basis for later work.
- **Shippable:** intended to reach users or production.
- **Reference-only:** intended to show correct usage, not necessarily become the implementation.

Many failures come from mixing these categories.

Example: if a POC is disposable, do not quietly turn it into production code. If a walking skeleton is extendable, do not take shortcuts that make the next increment replace it.

### 6.2 Distinguish minimal from fake


A minimal implementation reduces behavior while preserving the important structure.

A fake implementation bypasses the structure or risk being tested.

| Minimal | Fake |
|---|---|
| Simple implementation behind the intended interface | Hard-coded path with no real interface |
| One workflow through intended components | Demo path that skips intended components |
| Local persistence behind a storage boundary | Ad hoc state that avoids storage concerns entirely |
| Basic logs at boundaries | No way to inspect execution |
| One endpoint with intended contract | Script that cannot evolve into service behavior |

The review question is:

> Can the next step build on this, or does it need to replace it?

The answer does not need to be "build on this" for every technique. Spikes and some POCs may be intentionally disposable. The important part is that this is explicit.

### 6.3 Do not overbuild the wrong layer


Early work often fails by making one part too complete while the rest is absent.

Examples:

- Complete data model, no runnable workflow.
- Detailed UI, no backend behavior.
- Complex platform abstraction, no feature using it.
- Polished demo, no real integration.
- Robust service, no observability or failure path.

For most early delivery techniques, breadth across the relevant risk matters more than depth inside one layer.

### 6.4 Make completion observable


A technique is complete when it answers the question it was chosen to answer.

Do not use vague completion criteria such as:

- "explore options"
- "validate approach"
- "build initial version"
- "make progress"
- "prove it out"

Use concrete criteria:

- "Compare two approaches and recommend one."
- "Show that ingestion can process a representative file in under N seconds."
- "Run one workflow from API request to persisted result."
- "Complete three user sessions and identify top usability failures."
- "Serve 5% of traffic through the new path for 24 hours with no increase in error rate."

### 6.5 Record what remains unknown


A completed technique should not imply all risk is gone.

Every output should state:

- what was learned
- what was not tested
- what assumptions remain
- what risk remains
- what should happen next

## 7. Technique Reference


Each section below uses a consistent format.

## 7.1 Spike

### Definition


A spike is a time-boxed investigation used to answer a question, reduce ambiguity, or compare options.

It may involve reading, prototyping, small experiments, code, diagrams, benchmarks, or discussions. The output is usually knowledge, not production code.

### Primary question


> What do we need to learn before deciding what to build or how to build it?

### Use when


Use a spike when:

- the problem is not well understood
- there are multiple plausible approaches
- the team lacks enough information to estimate or plan
- a decision depends on technical details
- the cost of building without learning first is high

### Do not use when


Do not use a spike when:

- the team already knows the direction
- the work can be directly implemented as a small slice
- the team needs a production-ready increment
- the "spike" has no time limit or decision output

### Expected output


A spike should produce one or more of:

- recommendation
- comparison of options
- risk assessment
- small experiment
- notes with evidence
- rough code, if useful
- follow-up work items

### Expected lifespan


Usually disposable.

The knowledge should survive. The code may not.

### What must be real


The learning target must be real.

If the spike is about API limitations, use the real API. If it is about performance, use representative data. If it is about integration complexity, touch the actual integration surface.

### What can be simplified


Implementation quality, architecture, tests, error handling, UI, and deployment can be simplified unless they are part of the question being answered.

### Completion criteria


A spike is complete when:

1. The original question has an answer.
2. The answer is supported by evidence.
3. The team can make a decision or narrow options.
4. Remaining unknowns are listed.
5. Recommended next steps are clear.

### Common misuses


- Using a spike as an open-ended research bucket.
- Writing code without recording what was learned.
- Treating spike code as production code without review.
- Running a spike after the decision has already been made.
- Choosing a spike to avoid committing to scope.

### Example


A team is unsure whether to use PostgreSQL full-text search, a managed search service, or a vector index for an initial document search feature.

A spike compares the approaches on a small representative dataset, documents tradeoffs, and recommends one option for MVP.

### Related techniques


- A spike is broader than a POC.
- A spike may lead to a POC.
- A spike may precede an RFC.

## 7.2 Proof of Concept

### Definition


A proof of concept is a small implementation used to prove that a technical idea, technology, integration, or approach is feasible.

It is usually narrow and may be disposable.

### Primary question


> Can this technical idea work at all under the conditions that matter?

### Use when


Use a POC when:

- a technology choice is uncertain
- a third-party API may not support the required behavior
- an algorithm may not perform well enough
- data quality may not be sufficient
- a key technical assumption must be proven before larger investment

### Do not use when


Do not use a POC when:

- the main uncertainty is user experience
- the main uncertainty is system integration
- the goal is to deliver product value
- the result is expected to become the system foundation but is not built with that quality bar

### Expected output


A POC should produce:

- a small proof
- result data
- limitations
- decision recommendation
- next-step guidance

### Expected lifespan


Often disposable.

Sometimes a POC can evolve, but only if it was intentionally built to survive.

### What must be real


The concept being proven must be real.

If the POC tests a vendor integration, use the vendor. If it tests retrieval quality, use representative documents and queries. If it tests latency, measure under realistic enough conditions.

### What can be simplified


Architecture, UI, deployment, long-term maintainability, edge cases, and production hardening can be simplified if they are not part of the feasibility question.

### Completion criteria


A POC is complete when:

1. The feasibility question has a clear answer.
2. The conditions of the test are documented.
3. Results are recorded.
4. Limitations are stated.
5. The team knows whether to proceed, change direction, or stop.

### Common misuses


- Calling a rough implementation a POC after the fact.
- Proving the easy part and ignoring the uncertain part.
- Using toy data when data quality is the risk.
- Treating disposable code as production-ready.
- Expanding the POC into a full implementation without re-planning.

### Example


A team wants to use a document parser. A POC runs the parser on representative files, measures extraction quality, identifies unsupported cases, and decides whether the parser is viable.

### Related techniques


- A POC proves feasibility.
- A prototype tests product or interaction.
- A walking skeleton tests architecture and integration.

## 7.3 Prototype

### Definition


A prototype is an early model of a product experience, interaction, workflow, or concept.

It is used to explore whether the proposed product behavior makes sense before building the full implementation.

A prototype may be low-fidelity or high-fidelity. It may be a design mock, clickable flow, script, partial implementation, or demo.

### Primary question


> Does this product concept, user flow, or interaction make sense?

### Use when


Use a prototype when:

- user needs are uncertain
- the interaction model is unclear
- multiple UX approaches are possible
- stakeholders need something concrete to react to
- the team wants feedback before backend or production work

### Do not use when


Do not use a prototype when:

- the main risk is technical feasibility
- the main risk is system integration
- the output must be production-grade
- stakeholders may mistake the prototype for a committed implementation

### Expected output


A prototype should produce:

- mockup, demo, or partial flow
- user or stakeholder feedback
- identified usability issues
- revised product assumptions
- decision about what to build next

### Expected lifespan


Often disposable.

Design insights may survive. Code may not.

### What must be real


The user-facing behavior being tested must be realistic enough for feedback to matter.

If testing comprehension, the content should be plausible. If testing workflow, the sequence should resemble the intended workflow. If testing interaction cost, the user must perform representative actions.

### What can be simplified


Backend, data, integrations, security, scale, performance, and production quality can be simulated if the prototype is not testing them.

### Completion criteria


A prototype is complete when:

1. The target users or stakeholders have reacted to it.
2. The team has identified what worked and what did not.
3. Product assumptions are updated.
4. The next product or engineering decision is clear.

### Common misuses


- Calling a polished mock an MVP.
- Letting stakeholders assume prototype behavior already exists.
- Using fake data that makes the product seem better than it will be.
- Continuing to refine the prototype after it has answered the question.
- Treating prototype code as production code without review.

### Example


A team prototypes a document QA flow where a user uploads a document, asks a question, and sees an answer with citations. The backend is mocked. The goal is to learn whether citations, abstentions, and follow-up questions are understandable.

### Related techniques


- A prototype tests user experience.
- A POC tests technical feasibility.
- An MVP tests product value with a usable product.

## 7.4 Tracer Bullet

### Definition


A tracer bullet is a narrow implementation used to test whether a technical direction is viable by sending a small amount of real work through the intended path.

It is similar to a walking skeleton, but the emphasis is on validating direction and assumptions rather than establishing a stable architectural base.

### Primary question


> Are we aiming in the right technical direction?

### Use when


Use a tracer bullet when:

- the team has a likely direction but needs evidence
- the path crosses several uncertain areas
- fast feedback is more important than completeness
- the team wants to validate assumptions through implementation
- the result may influence architecture or product scope

### Do not use when


Do not use a tracer bullet when:

- a pure research spike is enough
- the direction is already known and the task is normal delivery
- the team needs a stable foundation immediately
- the narrow path avoids the actual risks

### Expected output


A tracer bullet should produce:

- narrow implementation
- evidence about direction
- discovered risks
- decision to continue, adjust, or stop
- possibly reusable code, depending on quality

### Expected lifespan


Mixed.

Some tracer bullets are extended. Others are discarded after learning.

State this before starting.

### What must be real


The assumptions being tested must be exercised through real behavior. If testing an integration path, the integration must be real enough. If testing latency, the timing path must be representative.

### What can be simplified


Feature completeness, edge cases, UI, scale, and long-term structure can be simplified if not central to the direction being tested.

### Completion criteria


A tracer bullet is complete when:

1. The narrow path has run.
2. Key assumptions have been tested.
3. Results are visible.
4. The team knows whether to continue in the same direction.
5. Follow-up changes are identified.

### Common misuses


- Treating a tracer bullet as a complete design.
- Picking a path that avoids the risky assumptions.
- Keeping it without assessing code quality.
- Letting it grow without converting it into normal delivery.

### Example


A team implements one end-to-end request using a new orchestration pattern. The purpose is to see whether the pattern is workable before using it broadly.

### Related techniques


- A walking skeleton is usually more explicitly foundation-oriented.
- A POC is usually more isolated.
- A thin vertical slice is usually feature-delivery oriented.

## 7.5 Architectural Walking Skeleton

### Definition


An architectural walking skeleton is a small executable version of a system that runs through the main architectural components for one narrow workflow.

It is used to verify that the intended system structure can support an end-to-end path.

The implementation should be small, but it should follow the intended component boundaries, interfaces, and data flow. Later work should usually extend it rather than replace it.

### Primary question


> Can the intended system structure support one real workflow end-to-end?

### Use when


Use an architectural walking skeleton when:

- integration risk is high
- the system has multiple components
- boundaries and contracts need early validation
- deployment shape or local run path matters
- observability and failure behavior need early design
- the team wants to avoid building disconnected horizontal layers

### Do not use when


Do not use a walking skeleton when:

- a small isolated POC would answer the question
- the main uncertainty is user experience
- the team is not ready to decide on basic architecture
- the skeleton would be built with fake paths that bypass key risks

### Expected output


A walking skeleton should produce:

- one named workflow
- main components required by that workflow
- explicit interfaces between components
- core data structures
- local run path
- basic observability
- at least one end-to-end test
- minimal failure handling

### Expected lifespan


Usually extendable.

The internal implementation may change, but the boundaries, contracts, and path should inform later work.

### What must be real


The following should normally be real, even if simple:

- component boundaries
- interfaces
- data contracts
- execution path
- basic run path
- basic logs or traces
- error propagation at major boundaries
- at least one real integration point, if integration is a major risk

### What can be simplified


Algorithms, UI, performance, scale, edge cases, infrastructure, evaluation, and production hardening can be simplified.

### Completion criteria


A walking skeleton is complete when:

1. One named workflow runs from input to output.
2. The workflow uses the main intended components.
3. Interfaces between components are explicit.
4. Core data structures are defined.
5. A developer can run the workflow from a clean checkout.
6. The workflow has at least one end-to-end test.
7. The workflow produces inspectable logs or debug output.
8. At least one representative failure case is handled.
9. The next increment can build on it without replacing the structure.
10. The team can state which architectural risks were tested and which remain.

### Common misuses


- Building a horizontal platform instead of a vertical path.
- Building one subsystem deeply while others do not exist.
- Using mocks that hide the integration risk.
- Creating a demo path that bypasses intended architecture.
- Treating "minimal" as permission to ignore interfaces and data shape.
- Treating the skeleton as a full MVP.

### Example


For a document QA system, a walking skeleton might support one Markdown file, simple chunking, indexing, retrieval, answer generation, citations, and abstention through a CLI or one API endpoint.

It would not need PDFs, UI polish, multi-tenant storage, advanced ranking, or production infrastructure.

### Related techniques


- A POC proves technical feasibility.
- A walking skeleton proves the system structure can execute a workflow.
- A thin vertical slice is a general incremental delivery unit.
- A walking skeleton is often the first architecture-focused vertical slice.

## 7.6 Thin Vertical Slice

### Definition


A thin vertical slice is a small increment of functionality that passes through the layers needed to deliver a user-visible or system-visible behavior.

It is a delivery technique for incremental construction.

### Primary question


> Can we deliver one small behavior through the necessary parts of the system?

### Use when


Use thin vertical slices when:

- the architecture is sufficiently established
- the team wants incremental progress
- each increment should be testable
- feature work spans multiple layers
- feedback is needed before building more depth

### Do not use when


Do not use a thin vertical slice when:

- the team first needs to answer feasibility questions
- the architecture is still too unclear
- the "slice" is actually a horizontal subsystem
- the slice is too large to review or test quickly

### Expected output


A thin vertical slice should produce a working increment that can be tested and potentially shipped.

### Expected lifespan


Usually production-bound.

### What must be real


The user or system behavior being delivered should be real. The slice should go through the actual path needed for that behavior.

### What can be simplified


Scope, edge cases, polish, optimization, and optional capabilities can be deferred if the slice remains useful and correct for its stated scope.

### Completion criteria


A thin vertical slice is complete when:

1. The behavior works end-to-end for the stated scope.
2. Tests cover the behavior.
3. The implementation is integrated with the main codebase.
4. The behavior can be demonstrated or validated.
5. Follow-up slices are clear.

### Common misuses


- Calling a backend-only task a vertical slice.
- Making the slice too large.
- Deferring integration until several slices later.
- Shipping a slice without clear user or system behavior.

### Example


A system adds "download invoice as PDF" for one invoice type, through UI, API, authorization, document generation, and storage.

### Related techniques


- A walking skeleton is a special early vertical slice focused on architecture.
- An MVP may consist of multiple thin vertical slices.

## 7.7 Minimum Viable Product

### Definition


An MVP is the smallest product version that can be used to validate whether the product creates value for its intended users or business context.

It is not simply the smallest technical implementation.

### Primary question


> What is the smallest usable product version that can validate value?

### Use when


Use an MVP when:

- the team needs market, user, or business validation
- enough technical feasibility is already established
- the product must be usable by real users
- learning depends on actual use, not only feedback on a mock

### Do not use when


Do not use an MVP when:

- the main uncertainty is purely technical
- the product is not usable enough to validate value
- the team only has a prototype or demo
- the release cannot produce meaningful learning

### Expected output


An MVP should produce:

- usable product increment
- real user or business feedback
- usage data
- validated or invalidated assumptions
- decision on further investment

### Expected lifespan


Usually production-bound, though parts may be replaced later.

### What must be real


The core user value must be real. Users should be able to accomplish the primary job the MVP is meant to validate.

### What can be simplified


Scope, polish, automation, edge cases, advanced features, scale, admin tooling, and optimization can be limited.

### Completion criteria


An MVP is complete when:

1. Target users can use it for the core job.
2. The team can measure or observe whether it creates value.
3. It is reliable enough for the validation context.
4. The team has defined success criteria before launch.
5. The result can support a continue, change, or stop decision.

### Common misuses


- Calling an internal demo an MVP.
- Shipping something too incomplete to validate value.
- Including too many features.
- Releasing without success criteria.
- Mistaking technical completion for product validation.

### Example


A document QA MVP may support a limited set of document types and question flows, but it must be good enough for target users to perform real document QA tasks and judge whether the product is useful.

### Related techniques


- A prototype explores the product idea before building the usable product.
- A walking skeleton validates architecture before broader capability.
- A pilot or beta validates the MVP under controlled real-world conditions.

## 7.8 Reference Implementation

### Definition


A reference implementation is a concrete implementation that demonstrates the intended way to use an API, architecture, protocol, pattern, or platform capability.

It provides a working example of correct usage.

### Primary question


> What does correct usage look like in practice?

### Use when


Use a reference implementation when:

- multiple teams need to adopt a common interface or platform
- documentation alone is insufficient
- a pattern needs an executable example
- API consumers need a known-good implementation
- the team wants to reduce inconsistent adoption

### Do not use when


Do not use a reference implementation when:

- the design is still highly uncertain
- there is no expected reuse
- the example will be maintained poorly
- teams might mistake it for the only allowed implementation

### Expected output


A reference implementation should produce:

- working example
- clear code
- setup instructions
- explanation of important choices
- tests or usage examples
- known limitations

### Expected lifespan


Reference-only or extendable, depending on context.

### What must be real


The API, contract, or pattern being demonstrated must be used correctly. The reference should not fake the usage it is meant to teach.

### What can be simplified


Scale, feature completeness, UI, and environment complexity can be simplified if the core usage remains accurate.

### Completion criteria


A reference implementation is complete when:

1. It demonstrates the intended pattern end-to-end.
2. It can be run or inspected by target users.
3. Important constraints are documented.
4. Consumers can adapt it safely.
5. It has an owner or maintenance plan.

### Common misuses


- Building a sample that is too toy-like to guide real use.
- Letting it become stale.
- Encoding assumptions not stated in documentation.
- Treating reference code as automatically production-ready.

### Example


A platform team provides a service template showing request handling, authentication, metrics, logging, deployment configuration, and test structure for services using the new platform.

### Related techniques


- A walking skeleton validates a specific system's architecture.
- A reference implementation teaches usage across systems.

## 7.9 RFC / Technical Design Doc

### Definition


An RFC or technical design doc is a written proposal used to align on a problem, design, tradeoffs, and implementation plan before significant engineering work begins.

### Primary question


> What are we proposing to build, and why is this the right approach?

### Use when


Use an RFC or design doc when:

- the work affects architecture or multiple teams
- tradeoffs need review
- implementation cost is significant
- decisions need broader alignment
- there are multiple viable approaches
- long-term maintainability matters

### Do not use when


Do not use a design doc when:

- the change is small and obvious
- a spike is needed before a proposal can be written
- the doc will be treated as a substitute for implementation validation
- the review process is heavier than the decision requires

### Expected output


A design doc should include:

- problem statement
- goals and non-goals
- proposed design
- alternatives considered
- tradeoffs
- risks
- rollout plan
- test plan
- observability plan
- migration plan, if relevant
- open questions

### Expected lifespan


Reference material.

The design may evolve, but the doc should preserve the reasoning.

### What must be real


The problem, constraints, and tradeoffs must be accurately represented.

### What can be simplified


Implementation details can remain high-level if they do not affect the decision.

### Completion criteria


A design doc is complete when:

1. Reviewers understand the proposal.
2. Major tradeoffs are explicit.
3. Open questions are either resolved or tracked.
4. The decision to proceed, revise, or stop is recorded.
5. Implementation work can be planned.

### Common misuses


- Writing a design doc after implementation only to justify it.
- Omitting alternatives.
- Hiding unresolved risks.
- Over-specifying details that should be learned through implementation.
- Treating approval as proof the design will work.

### Example


A team proposes a new event processing architecture. The design doc describes event schemas, ordering guarantees, retry behavior, storage, migration, observability, and alternatives.

### Related techniques


- A spike may produce evidence for an RFC.
- An ADR records a decision after it is made.
- A walking skeleton may validate the proposed design.

## 7.10 Architecture Decision Record

### Definition


An Architecture Decision Record records an important technical decision, the context for that decision, alternatives considered, and expected consequences.

An ADR is usually short.

### Primary question


> What decision did we make, and what tradeoffs did we accept?

### Use when


Use an ADR when:

- a decision affects architecture
- future engineers will need to understand why a choice was made
- the team considered alternatives
- the decision may be revisited later
- the decision constrains future work

### Do not use when


Do not use an ADR when:

- no meaningful decision was made
- the information belongs in normal documentation
- the decision is temporary and trivial
- the team has not actually agreed

### Expected output


An ADR should include:

- title
- status
- context
- decision
- alternatives considered
- consequences
- date
- owners or approvers, if useful

### Expected lifespan


Long-lived record.

### What must be real


The decision and context must be accurate. Do not use ADRs as retroactive justification.

### What can be simplified


Implementation details can be omitted unless they explain the decision.

### Completion criteria


An ADR is complete when:

1. The decision is stated clearly.
2. The context is sufficient.
3. Alternatives and tradeoffs are recorded.
4. Consequences are stated.
5. The status is clear.

### Common misuses


- Writing long design docs and calling them ADRs.
- Recording decisions nobody made.
- Omitting rejected alternatives.
- Letting ADRs become stale without status updates.
- Using ADRs to avoid discussion.

### Example


An ADR records the decision to use a managed search service instead of self-hosting search, including operational tradeoffs and cost assumptions.

### Related techniques


- An RFC proposes.
- An ADR records.
- A spike or POC may provide evidence for the decision.

## 7.11 Architecture Runway

### Definition


Architecture runway is a small amount of enabling technical foundation built ahead of feature work because upcoming features require it.

The goal is to avoid blocking near-term delivery, not to build a complete future platform.

### Primary question


> What minimum technical foundation is needed to support the next set of features?

### Use when


Use architecture runway when:

- upcoming features depend on shared technical capability
- repeated work would otherwise create inconsistent implementations
- the team knows near-term feature needs
- missing foundation would slow or risk delivery

### Do not use when


Do not use architecture runway when:

- future needs are speculative
- the foundation has no near-term consumer
- the work becomes a platform project without feature pull
- the team is avoiding delivery by building abstractions

### Expected output


Architecture runway should produce:

- minimal enabling capability
- clear consumers
- usage guidance
- integration path
- tests or examples
- known limitations

### Expected lifespan


Production-bound.

### What must be real


The foundation must support known upcoming work. At least one near-term consumer should be identified.

### What can be simplified


Generality, edge cases, automation, and advanced configuration should be limited to what near-term consumers require.

### Completion criteria


Architecture runway is complete when:

1. It enables a specific upcoming feature or set of features.
2. At least one consumer can use it.
3. The interface is documented.
4. It has basic tests or validation.
5. It does not include speculative capabilities with no near-term use.

### Common misuses


- Building a general platform before the product path is proven.
- Adding abstractions for hypothetical future features.
- Letting runway work consume entire delivery cycles.
- Failing to connect foundation work to actual feature increments.

### Example


Before adding multiple notification features, a team builds a minimal notification dispatch interface, queue integration, and logging path needed by the next two features.

### Related techniques


- A walking skeleton proves an end-to-end system path.
- Architecture runway provides targeted enabling capability for upcoming slices.

## 7.12 Pilot

### Definition


A pilot is a limited release to selected users, customers, teams, data sets, or workloads to validate behavior under controlled real-world conditions.

### Primary question


> Does this work in a real but limited environment?

### Use when


Use a pilot when:

- internal validation is not enough
- real users or workloads are needed
- rollout risk should be controlled
- operational behavior must be observed before broad release
- feedback from a selected group will inform changes

### Do not use when


Do not use a pilot when:

- the system is not instrumented enough to learn from
- the product is too incomplete for meaningful use
- support and rollback plans are missing
- the selected users do not represent the intended use

### Expected output


A pilot should produce:

- real usage feedback
- operational metrics
- support issues
- discovered gaps
- launch readiness decision
- changes before broader rollout

### Expected lifespan


Production-bound.

### What must be real


The environment, users, data, or workload must be representative enough for the pilot's goals.

### What can be simplified


Scale, onboarding breadth, support automation, non-critical features, and administrative tooling can be limited.

### Completion criteria


A pilot is complete when:

1. Selected users or workloads have used the system.
2. Success metrics have been collected.
3. Issues are triaged.
4. The team decides whether to expand, revise, or stop.
5. Operational readiness gaps are documented.

### Common misuses


- Running a pilot without success criteria.
- Choosing friendly users who do not represent real use.
- Ignoring support burden.
- Lacking rollback or escalation paths.
- Treating pilot success as proof of broad readiness without checking scale and edge cases.

### Example


A team releases a new document review workflow to two customer teams, monitors completion rates and support tickets, and uses feedback to adjust the flow before broader rollout.

### Related techniques


- A beta is often broader and less controlled.
- Dogfooding is internal.
- Canary controls traffic exposure, often after readiness is higher.

## 7.13 Beta

### Definition


A beta is a release to a broader but still limited set of users to validate product, quality, compatibility, and operational behavior before general availability.

### Primary question


> Is this ready for broader release, and what issues remain?

### Use when


Use a beta when:

- the product is usable
- the team needs broader real-world feedback
- the system has passed internal validation
- support and monitoring are in place
- the release can tolerate known limitations

### Do not use when


Do not use a beta when:

- the system is too unstable
- there is no feedback channel
- success criteria are undefined
- critical functionality is missing
- the team cannot respond to issues

### Expected output


A beta should produce:

- broader feedback
- defect reports
- compatibility findings
- operational data
- readiness assessment
- prioritized fixes

### Expected lifespan


Production-bound.

### What must be real


The product behavior and operational environment should be close enough to release conditions to produce meaningful feedback.

### What can be simplified


Some features, documentation, support automation, and polish may be incomplete if limitations are communicated.

### Completion criteria


A beta is complete when:

1. Enough representative users have used the product.
2. Feedback and defects are analyzed.
3. Release-blocking issues are resolved or accepted.
4. Operational metrics are acceptable.
5. The team has a general availability decision.

### Common misuses


- Using beta as a label for unfinished work.
- Releasing without monitoring.
- Collecting feedback but not acting on it.
- Failing to distinguish beta limitations from defects.
- Expanding beta before support capacity exists.

### Example


A team opens a new API to selected external developers, tracks error rates, docs issues, missing use cases, and support requests before public launch.

### Related techniques


- A pilot is usually narrower and more controlled.
- MVP validates value.
- Beta validates readiness and quality for broader use.

## 7.14 Dogfooding

### Definition


Dogfooding is internal use of a product, feature, platform, or workflow by the organization before or alongside external exposure.

### Primary question


> What problems do we discover when we use this ourselves?

### Use when


Use dogfooding when:

- internal users can represent meaningful use
- the product affects workflows the team understands
- early feedback can be gathered without external risk
- internal adoption can expose usability or reliability problems

### Do not use when


Do not use dogfooding when:

- internal users are not representative
- the team will overfit to internal needs
- external constraints are materially different
- dogfooding will be mistaken for market validation

### Expected output


Dogfooding should produce:

- internal feedback
- defects
- usability findings
- workflow gaps
- operational findings
- readiness improvements

### Expected lifespan


Production-bound or pre-production, depending on context.

### What must be real


Internal users should perform realistic tasks. Artificial demos do not count as dogfooding.

### What can be simplified


External onboarding, billing, external support flows, and full documentation can be simplified if not relevant to internal use.

### Completion criteria


Dogfooding is complete when:

1. Internal users have used the feature for real work.
2. Feedback has been collected.
3. Issues have been triaged.
4. The team understands which findings generalize externally.
5. The next exposure step is clear.

### Common misuses


- Treating internal satisfaction as proof of external product-market fit.
- Using only expert users.
- Ignoring external constraints such as compliance, billing, or integration complexity.
- Failing to collect structured feedback.

### Example


Before releasing a developer platform internally across the company, the platform team uses it to build and deploy one of its own services.

### Related techniques


- Dogfooding may precede a pilot or beta.
- It validates internal use, not necessarily external demand.

## 7.15 Feature Flag

### Definition


A feature flag is a runtime control that enables, disables, or varies behavior without deploying new code.

Feature flags are a rollout and operational control technique, not a substitute for design or validation.

### Primary question


> Can we control exposure to this behavior safely?

### Use when


Use feature flags when:

- behavior needs gradual rollout
- rollback must be fast
- different cohorts need different behavior
- incomplete work must be merged safely
- experiments require runtime control
- operational risk needs containment

### Do not use when


Do not use feature flags when:

- the system lacks ownership for flag cleanup
- the flag hides unresolved design uncertainty
- flag combinations become untestable
- permanent configuration would be more appropriate
- the change cannot safely be toggled

### Expected output


A feature flag should produce:

- controlled enablement
- rollback mechanism
- cohort targeting, if needed
- monitoring by flag state
- cleanup plan

### Expected lifespan


Usually temporary.

Some flags become long-lived configuration, but that should be explicit.

### What must be real


The flag must control the actual behavior and must be safe to change under expected conditions.

### What can be simplified


Admin UI, advanced targeting, and automation can be simple if operational needs are met.

### Completion criteria


A feature flag implementation is complete when:

1. The behavior can be enabled and disabled safely.
2. The default state is clear.
3. Monitoring can compare enabled and disabled states if needed.
4. Rollback behavior is tested.
5. Cleanup criteria and owner are defined.

### Common misuses


- Leaving flags permanently without ownership.
- Creating many interacting flags with unclear behavior.
- Using flags to merge low-quality incomplete code.
- Not testing both flag states.
- Not monitoring impact by flag state.

### Example


A new recommendation algorithm is guarded by a flag. It is enabled for internal users first, then 1% of users, then gradually expanded if metrics remain healthy.

### Related techniques


- Canary release often uses feature flags.
- Dark launch may use flags to activate backend behavior without user-visible exposure.

## 7.16 Canary Release

### Definition


A canary release gradually exposes a new version or behavior to a small percentage of production traffic before wider rollout.

The purpose is to detect problems early while limiting blast radius.

### Primary question


> Does this behave safely under a small amount of real production traffic?

### Use when


Use a canary when:

- production behavior may differ from test behavior
- rollout risk should be limited
- metrics can detect problems quickly
- rollback is available
- the change can be routed to a subset of traffic

### Do not use when


Do not use a canary when:

- impact cannot be measured
- rollback is slow or unsafe
- the change affects all users globally by design
- state changes cannot be isolated or reversed
- the system lacks monitoring

### Expected output


A canary should produce:

- limited production exposure
- health metrics
- comparison against baseline
- rollout or rollback decision
- issue findings

### Expected lifespan


Temporary rollout mechanism.

### What must be real


The canary must receive real production traffic or workload representative of what is being tested.

### What can be simplified


The rollout automation can be simple if traffic routing, monitoring, and rollback are reliable enough.

### Completion criteria


A canary is complete when:

1. A defined subset of traffic uses the change.
2. Health and business metrics are monitored.
3. Results are compared to baseline.
4. The team rolls forward, pauses, or rolls back.
5. Findings are recorded.

### Common misuses


- Running a canary without enough traffic to detect issues.
- Monitoring only infrastructure metrics while ignoring product metrics.
- Expanding too quickly.
- Lacking rollback.
- Using canary for changes that cannot be isolated.

### Example


A new service version is deployed to 5% of traffic. Error rate, latency, saturation, and key product metrics are compared before expanding.

### Related techniques


- Feature flags may control canary exposure.
- Dark launch tests production behavior without user-visible activation.
- Beta exposes to selected users, not necessarily traffic percentage.

## 7.17 Dark Launch

### Definition


A dark launch runs new production code or infrastructure in the background without exposing the new behavior to users.

It is used to validate production operation before user-visible activation.

### Primary question


> Can the new path operate in production conditions before users depend on it?

### Use when


Use a dark launch when:

- backend behavior can run alongside existing behavior
- production load or data is needed for validation
- user-visible risk should be avoided
- shadow reads, shadow writes, or parallel computation are possible
- output can be compared or inspected safely

### Do not use when


Do not use a dark launch when:

- background execution could corrupt data
- results cannot be compared or validated
- privacy or compliance rules prohibit shadow processing
- operational cost is too high
- the team may forget to remove or activate the path

### Expected output


A dark launch should produce:

- production operational data
- comparison results
- performance metrics
- error findings
- activation decision

### Expected lifespan


Temporary.

### What must be real


The production workload or data path being tested should be real enough to validate operational behavior.

### What can be simplified


User-facing UI, activation logic, and some product behavior can be absent if the launch is only testing backend operation.

### Completion criteria


A dark launch is complete when:

1. The new path has run under production-like conditions.
2. Output, errors, latency, and resource use are measured.
3. Differences from the current path are understood.
4. Risks are resolved or accepted.
5. The team decides whether to activate, continue testing, or remove the path.

### Common misuses


- Creating hidden production behavior with no monitoring.
- Running shadow writes without safety controls.
- Treating dark launch success as user validation.
- Leaving dark-launched code running indefinitely.
- Not defining comparison criteria.

### Example


A new ranking service receives a copy of production requests and computes rankings in parallel. Users still see the old rankings. Engineers compare latency and output quality before enabling it.

### Related techniques


- Canary exposes visible behavior to some traffic.
- Dark launch runs invisible behavior in production.
- Feature flags often control both.

## 7.18 Hardening

### Definition


Hardening is focused work to improve reliability, security, performance, observability, operability, and readiness before broader production use.

### Primary question


> What must be improved before this can be safely operated or broadly released?

### Use when


Use hardening when:

- functionality exists but readiness is insufficient
- reliability risks are known
- monitoring or alerting is incomplete
- security or compliance gaps remain
- performance or scale needs validation
- operational runbooks are missing

### Do not use when


Do not use hardening when:

- the product direction is still unvalidated
- the architecture is not yet stable enough
- the work is a vague cleanup bucket
- no readiness criteria exist

### Expected output


Hardening should produce:

- reliability fixes
- security fixes
- performance improvements
- monitoring and alerts
- runbooks
- load or failure testing
- readiness checklist completion

### Expected lifespan


Production-bound.

### What must be real


Readiness criteria must match the intended production environment and operational expectations.

### What can be simplified


Non-critical polish and future scalability beyond the expected launch envelope can be deferred.

### Completion criteria


Hardening is complete when:

1. Defined readiness criteria are met.
2. Known launch-blocking issues are resolved or accepted.
3. Monitoring and alerting are in place.
4. Operational runbooks exist for common failures.
5. Load, failure, or security checks relevant to the release have passed.
6. Owners agree the system can move to the next exposure level.

### Common misuses


- Using hardening as a vague phase after uncontrolled development.
- Adding hardening without measurable criteria.
- Focusing on code cleanup while ignoring operational readiness.
- Delaying all quality work until the end.
- Treating hardening as optional for critical systems.

### Example


Before general release, a team adds latency SLOs, alerting, backup validation, rate limiting, audit logging, and failure-mode tests.

### Related techniques


- Hardening often follows MVP, pilot, beta, or canary findings.
- Refactoring improves structure; hardening improves readiness.

## 7.19 Refactoring / Technical Debt Paydown

### Definition


Refactoring changes the internal structure of code without changing intended external behavior.

Technical debt paydown is targeted work to reduce accumulated complexity, risk, or delivery drag.

### Primary question


> What internal structure is making future work slower, riskier, or more expensive?

### Use when


Use refactoring or debt paydown when:

- delivery speed is declining
- code is hard to change safely
- defects cluster around specific areas
- duplicated implementations create inconsistency
- architecture no longer matches product needs
- operational risk comes from structural complexity

### Do not use when


Do not use refactoring when:

- there is no clear problem to solve
- the work is preference-driven cleanup
- the team cannot test behavior before and after
- broad rewrites are proposed without incremental safety
- refactoring is being used to avoid product decisions

### Expected output


Refactoring should produce:

- simpler structure
- preserved behavior
- tests that guard behavior
- reduced duplication or coupling
- clearer ownership
- lower change risk

### Expected lifespan


Production-bound.

### What must be real


External behavior must be preserved unless explicitly changed. Tests or validation must guard against unintended behavior changes.

### What can be simplified


Refactoring scope should be smaller than the entire ideal end state. Not all debt needs to be paid down at once.

### Completion criteria


Refactoring is complete when:

1. The targeted structural problem is improved.
2. Existing behavior is preserved or deliberate changes are documented.
3. Tests pass.
4. Future work in the affected area is easier or safer.
5. The team can describe what debt remains.

### Common misuses


- Rewriting instead of refactoring.
- Starting broad cleanup without a concrete goal.
- Changing behavior accidentally.
- Refactoring without tests.
- Refactoring areas that do not affect current or near-term work.

### Example


A team extracts duplicated authorization logic into a shared policy component before adding new permission-sensitive features.

### Related techniques


- Hardening improves production readiness.
- Refactoring improves maintainability.
- Architecture runway creates enabling foundation for upcoming work.

## 7.20 Migration Slice

### Definition


A migration slice is a small, controlled increment of a larger migration from one system, architecture, data model, vendor, or runtime path to another.

It reduces migration risk by moving one bounded piece at a time.

### Primary question


> Can we move this part safely without requiring a large cutover?

### Use when


Use migration slices when:

- replacing a system incrementally
- changing storage, APIs, infrastructure, or data models
- rollback or parallel operation is needed
- the full migration is too risky to perform at once
- compatibility must be maintained during transition

### Do not use when


Do not use migration slices when:

- the migration cannot be meaningfully segmented
- data consistency cannot be maintained
- ownership of old and new paths is unclear
- observability cannot compare old and new behavior
- the team has no rollback or reconciliation plan

### Expected output


A migration slice should produce:

- one migrated path, cohort, data segment, or capability
- validation results
- rollback plan
- compatibility handling
- reconciliation strategy, if needed
- next migration step

### Expected lifespan


Temporary transition state leading to a new steady state.

### What must be real


The migrated slice must use the new target path for the selected scope. Validation must compare old and new behavior where possible.

### What can be simplified


Migration automation, full coverage, performance optimization, and edge cases can be expanded over later slices if safety is preserved.

### Completion criteria


A migration slice is complete when:

1. The selected scope runs on the new path.
2. Data and behavior are validated.
3. Metrics are monitored.
4. Rollback or fallback is tested or clearly defined.
5. The team knows whether to continue, pause, or adjust the migration.

### Common misuses


- Migrating the easiest part that teaches little.
- Running old and new systems without reconciliation.
- Not defining rollback.
- Creating permanent dual paths.
- Failing to remove old code after migration.

### Example


A team migrates one customer cohort from a legacy billing engine to a new billing service, compares invoices, monitors errors, and then expands by cohort.

### Related techniques


- Canary controls production exposure.
- Dark launch can validate the new path before visible migration.
- Feature flags may route cohorts between old and new paths.

## 8. Common Comparisons

### 8.1 Spike vs POC vs Prototype


| Technique | Main purpose | Question answered | Output | Usually disposable? |
|---|---|---|---|---|
| Spike | Learning | What should we do? | Notes, recommendation, experiment | Often |
| POC | Technical feasibility | Can this work? | Proof and results | Often |
| Prototype | Product or UX exploration | Does this make sense to users? | Mock, demo, feedback | Often |

Use a spike when the team is unsure what to investigate or decide.

Use a POC when the team has a specific technical assumption to prove.

Use a prototype when user behavior, comprehension, or experience is the risk.

### 8.2 POC vs Walking Skeleton


| POC | Walking Skeleton |
|---|---|
| Tests feasibility of an idea | Tests executable system structure |
| May be isolated | Runs end-to-end |
| May bypass final architecture | Should follow intended architecture |
| Often disposable | Usually extendable |
| Proves "can this work?" | Proves "can these parts work together?" |

A POC can be successful even if it is a notebook, script, or isolated service.

A walking skeleton is not successful unless it runs through the main intended path.

### 8.3 Prototype vs MVP


| Prototype | MVP |
|---|---|
| Used to explore | Used to validate value |
| May be fake or mocked | Must be usable |
| Often shown to users | Used by users |
| Usually disposable | Usually production-bound |
| Tests comprehension or workflow | Tests product value |

A prototype helps decide what to build.

An MVP tests whether what was built is valuable enough to continue.

### 8.4 Walking Skeleton vs Thin Vertical Slice


| Walking Skeleton | Thin Vertical Slice |
|---|---|
| Usually early | Used throughout delivery |
| Focused on architecture validation | Focused on incremental behavior |
| May have little product value | Should add useful behavior |
| Establishes path and boundaries | Extends system capability |

A walking skeleton is often the first meaningful vertical slice, selected to validate system structure.

### 8.5 MVP vs Pilot vs Beta


| Technique | Main purpose | Exposure |
|---|---|---|
| MVP | Validate product value | Target users, minimal product |
| Pilot | Validate real-world use under controlled conditions | Selected users/customers/workloads |
| Beta | Validate readiness with broader limited use | Wider but still limited audience |

An MVP can be piloted or beta-tested. The terms describe different concerns.

### 8.6 Feature Flag vs Canary vs Dark Launch


| Technique | Main purpose | User-visible? |
|---|---|---|
| Feature Flag | Runtime control | Depends on flag |
| Canary | Gradual production exposure | Usually yes |
| Dark Launch | Production validation without visible activation | No |

Feature flags are often the mechanism. Canary and dark launch are rollout strategies.

### 8.7 Hardening vs Refactoring


| Hardening | Refactoring |
|---|---|
| Improves readiness | Improves internal structure |
| Focuses on reliability, security, performance, operations | Focuses on maintainability and change safety |
| Often before broad release | Often before or during feature development |
| May change infrastructure or controls | Should preserve external behavior |

## 9. Lifecycle Playbooks

### 9.1 New product capability


Use when building a new user-facing product area.

```text
Spike
  -> Prototype
  -> POC, if technical feasibility is uncertain
  -> Walking Skeleton, if architecture is non-trivial
  -> Thin Vertical Slices
  -> MVP
  -> Dogfooding
  -> Pilot or Beta
  -> Canary / General Release
  -> Hardening and Refactoring
```


Key review questions:

- What must be learned before building?
- Are product and technical risks separated?
- What is the first usable version?
- What metrics define MVP success?
- What rollout controls are needed?

### 9.2 New technical platform


Use when building shared technical capability for multiple consumers.

```text
Spike
  -> POC
  -> RFC
  -> Reference Implementation
  -> Walking Skeleton with first consumer
  -> Architecture Runway
  -> Pilot with selected teams
  -> Broader adoption
  -> Hardening
```


Key review questions:

- Who is the first real consumer?
- What is the minimum platform surface needed now?
- What should be reference material versus platform code?
- How will adoption be measured?
- What migration or compatibility issues exist?

### 9.3 High-risk integration


Use when multiple systems, vendors, or boundaries must work together.

```text
Spike
  -> POC against real dependency
  -> Walking Skeleton
  -> Thin Vertical Slices
  -> Dark Launch, if production behavior can be shadowed
  -> Canary
  -> Hardening
```


Key review questions:

- Which dependency is most uncertain?
- What must not be mocked?
- How will failures propagate?
- How will behavior be observed?
- What is the rollback path?

### 9.4 Data or AI system


Use when quality, data flow, evaluation, and operation are all risks.

```text
Spike
  -> POC with representative data
  -> Prototype, if human interaction matters
  -> Walking Skeleton
  -> Evaluation Harness, if quality must be tracked
  -> MVP
  -> Dogfooding / Pilot
  -> Canary or staged rollout
  -> Hardening
```


Key review questions:

- Is the data representative?
- What quality metric matters?
- What should the system do when confidence is low?
- How are outputs inspected?
- What failure cases are unacceptable?

### 9.5 Migration from legacy system


Use when replacing a live system.

```text
Spike
  -> RFC
  -> POC on risky migration mechanics
  -> Dark Launch or shadow path
  -> Migration Slice
  -> Canary by cohort or workload
  -> Progressive migration
  -> Decommission old path
```


Key review questions:

- Can old and new behavior be compared?
- What is the unit of migration?
- What is the rollback path?
- How is data consistency verified?
- When can the old path be removed?

## 10. Anti-Patterns

### 10.1 Calling every early thing a POC


A POC has a specific feasibility question. If the work is about learning, it may be a spike. If it is about user experience, it may be a prototype. If it is about integration, it may be a walking skeleton.

### 10.2 Treating disposable work as production foundation


If code was written without production expectations, review it before promoting it. Disposable code should not become production code by accident.

### 10.3 Building horizontal layers too early


A common failure mode is building storage, platform, API, UI, or infrastructure layers in isolation. Prefer a narrow end-to-end path unless the horizontal layer is clearly justified by near-term consumers.

### 10.4 Mocking the risky part


If the risky part is a vendor integration, do not mock the vendor. If the risky part is data quality, do not use toy data. If the risky part is latency, measure a representative path.

### 10.5 No exit criteria


Without exit criteria, spikes run until interest fades, POCs become projects, prototypes become products, and hardening becomes a vague cleanup phase.

### 10.6 Treating MVP as "smallest implementation"


An MVP is about validating value, not minimizing engineering work. A technically small product that users cannot use or evaluate is not an MVP.

### 10.7 Confusing rollout control with validation


Feature flags, canaries, and dark launches control exposure. They do not by themselves prove product value, user comprehension, or architectural quality.

### 10.8 Skipping observability


Any technique that runs code through a path should make that path inspectable. If the team cannot observe what happened, it will not learn enough.

### 10.9 Keeping temporary scaffolding forever


Flags, dual paths, migration adapters, and debug code need owners and cleanup criteria.

### 10.10 Overgeneralizing from one successful narrow case


A successful POC, pilot, or canary proves only what it tested. It does not automatically prove scale, edge cases, or broader product fit.

## 11. Review Questions for Engineering Leads


Use these questions during planning and review.

### 11.1 Before starting


1. What is the primary question this work answers?
2. Which technique matches that question?
3. What risk is being reduced?
4. What must be real for the result to be valid?
5. What can be simplified?
6. Is the output disposable, extendable, shippable, or reference-only?
7. What are the completion criteria?
8. What decision will this enable?
9. Who will review the result?
10. What will we do if the result is negative?

### 11.2 During execution


1. Is the work still answering the original question?
2. Has scope expanded beyond the technique?
3. Are we faking the part we need to learn about?
4. Are we overbuilding a layer that does not need depth yet?
5. Are results being recorded?
6. Can another engineer inspect or run the work?
7. Are remaining unknowns being captured?

### 11.3 At completion


1. Did the work answer the question?
2. What evidence supports the conclusion?
3. What did we learn?
4. What was not tested?
5. What risks remain?
6. What code or artifacts should be kept?
7. What should be deleted?
8. What decision is now possible?
9. What is the next technique or delivery step?
10. Who owns follow-up work?

## 12. Documentation Requirements


Each technique should leave enough documentation for future engineers to understand the result.

### 12.1 Minimum documentation


At minimum, record:

- technique used
- date
- owner
- goal
- primary risk
- scope
- non-goals
- approach
- result
- evidence
- limitations
- recommendation or next step

### 12.2 Additional documentation by technique


| Technique | Additional documentation |
|---|---|
| Spike | Options compared, recommendation, remaining unknowns |
| POC | Test conditions, result data, feasibility conclusion |
| Prototype | user feedback, usability findings, product changes |
| Walking Skeleton | workflow path, component boundaries, data contracts, run instructions |
| MVP | success metrics, target users, learning plan |
| Pilot / Beta | cohort, support plan, metrics, issues, launch decision |
| Canary | rollout percentage, metrics, baseline comparison, rollback decision |
| Dark Launch | shadow path, comparison method, operational findings |
| Hardening | readiness checklist, resolved risks, accepted risks |
| Refactoring | behavior preservation evidence, tests, remaining debt |
| Migration Slice | migrated scope, validation method, rollback, reconciliation |

### 12.3 Result note template


Use this at the end of a technique.

```md
# Result: <technique name>

## Original Question

...

## Answer

...

## Evidence

...

## What Was Tested

...

## What Was Not Tested

...

## Risks Remaining

...

## Recommendation

...

## Next Step

...
```

## 13. One-Page Reference


| Technique | Use for | Primary question | Output | Typical lifespan |
|---|---|---|---|---|
| Spike | Learning | What should we do? | Recommendation or narrowed options | Disposable |
| POC | Technical feasibility | Can this work? | Proof and results | Often disposable |
| Prototype | Product or UX exploration | Does this make sense? | Mock, demo, feedback | Often disposable |
| Tracer Bullet | Directional implementation | Are we aiming correctly? | Narrow implementation and evidence | Mixed |
| Walking Skeleton | Architecture validation | Can the system run end-to-end? | Runnable system slice | Extendable |
| Thin Vertical Slice | Incremental delivery | Can we deliver one small behavior? | Working increment | Production-bound |
| MVP | Product value validation | Is this useful enough? | Minimal usable product | Production-bound |
| Reference Implementation | Correct usage | What should usage look like? | Working example | Reference / extendable |
| RFC / Design Doc | Design alignment | What are we proposing? | Reviewed proposal | Reference |
| ADR | Decision record | What decision did we make? | Decision record | Long-lived |
| Architecture Runway | Enabling foundation | What foundation is needed soon? | Minimal platform capability | Production-bound |
| Dogfooding | Internal validation | What happens when we use it? | Internal feedback and fixes | Production-bound |
| Pilot | Controlled real-world validation | Does this work in limited real use? | Metrics, feedback, readiness decision | Production-bound |
| Beta | Broader limited validation | Is this ready for wider release? | Feedback, defects, readiness data | Production-bound |
| Feature Flag | Runtime control | Can we control exposure? | Toggle and rollout control | Usually temporary |
| Canary | Gradual exposure | Is this safe under limited production traffic? | Rollout or rollback decision | Temporary |
| Dark Launch | Invisible production validation | Can the new path run in production? | Operational data and comparison | Temporary |
| Hardening | Readiness | What must be improved before release? | Reliability, security, operational fixes | Production-bound |
| Refactoring | Maintainability | What structure is slowing us down? | Improved internal structure | Production-bound |
| Migration Slice | Safe migration | Can this bounded scope move safely? | Migrated increment and validation | Transitional |

## 14. Final Guidance


Use these techniques deliberately.

Before starting work, name the technique and write down the question it answers.

If the work is meant to learn, optimize for speed and evidence.

If the work is meant to prove feasibility, test the uncertain part directly.

If the work is meant to validate architecture, run through the intended components.

If the work is meant to validate product value, make it usable enough for real users.

If the work is meant for production rollout, define exposure, monitoring, rollback, and cleanup.

The technique is correct when its output supports a concrete decision or safely advances the system to the next lifecycle phase.
