---
draft: false
toc: true
title: "Assessing the Ecosystem-Tension Method"
aliases:
  - "/ai/product/strategic-analysis/market-research-analysis/"
description: "A critique strengthens ecosystem-tension opportunity analysis with stricter classifications, outcome-centered maps, causal and economic evidence, unilateral buyers, paid tests, and explicit kill criteria before infrastructure ambitions."
linkTitle: "Ecosystem-Tension Method"
---
## Assessment


Assessment: the ecosystem-tension method is useful as an **opportunity generator**. It needs an evidence, adoption, and validation layer before it can reliably select a startup.

The method under review has four main parts:

1. Map the actors and identify what each actor considers valuable.
2. Find places where their incentives, constraints, or desired outcomes diverge.
3. Infer possible products or "value surfaces," especially components that several sides need.
4. Score the resulting opportunities by urgency, budget, buildability, competition, and number of possible buyers.

That structure is coherent. The strongest part is the search for a shared component that sits between conflicting actors. The SaaS version then turns this into a directional scoring system.

The main conceptual problem is that the meaning of "tension" expands too far. In the companion analysis, tensions usually exist between actors: user and platform, creator and platform, platform and regulator. In the later SaaS analysis, the term also covers prototype versus production, roadmap versus uncertain AI behavior, and traditional QA versus probabilistic systems. Those are capability or process gaps inside an organization. They may produce startups, but they should not be evaluated as the same type of thing as ownership, pricing, regulation, or incentive conflicts.

## Similar approaches

### 1. Ecosystem strategy and Value Net


This is the closest established strategy work.

Ron Adner's "ecosystem as structure" starts from a focal value proposition, identifies the activities required to produce it, and then maps actors, positions, and links. This is useful because it creates a clear boundary around an otherwise unlimited system. The Value Net approach adds the economic question: how customers, suppliers, competitors, and complementors create and capture value.

The current method starts mostly from actors:

> user -> creator -> platform -> model provider -> regulator

Proposal: preserve that as an initial scan, then construct a second map around one specific outcome:

> "A user can preserve a companion relationship when the platform changes models."

That outcome determines which actors and activities belong in the detailed analysis.

### 2. Soft Systems Methodology


Soft Systems Methodology was designed for situations where actors have different interpretations of the problem. Its "rich picture" technique captures relationships, processes, influence, conflict, politics, constraints, and subjective points of view in one representation. ([The Open University](https://www.open.edu/openlearn/science-maths-technology/engineering-technology/rich-pictures "Rich pictures | OpenLearn - The Open University"))

This is close to the observation that the user, creator, platform, model provider, and regulator do not agree on what the valuable object is.

The useful addition is to record each actor's **worldview**, not only what the actor "wants":

- How does the actor define success?
- What does the actor believe the system is?
- What risks does the actor consider legitimate?
- What does the actor have authority to change?
- Which facts would the actor reject?

This matters because apparent incentive conflicts are sometimes conflicts between different models of reality.

### 3. Polarity Mapping, Theory of Constraints, and TRIZ


These methods distinguish several different forms of conflict.

Polarity Mapping is for pairs where both sides remain necessary over time, such as stability and adaptation. The objective is to obtain the benefits of both while monitoring the failure modes caused by overusing either side. ([Harvard Business Impact](https://www.harvardbusiness.org/insight/navigating-complexity-managing-polarities/ "Navigating Complexity: Managing Polarities"))

The Theory of Constraints uses tools such as the Evaporating Cloud to expose the assumptions supporting a conflict and search for a solution that satisfies the underlying needs of both sides. ([Theory of Constraints](https://www.toc-goldratt.com/en/product/TOC-Self-Learning-Program-on-Managing-People "TOC - Self Learning Program on Managing People :: Goldratt ..."))

TRIZ treats a trade-off as a contradiction: improving one property damages another. It then looks for ways to separate the requirements by time, space, condition, component, or system level. ([TRIZ.org](https://triz.org/contradictions/ "Contradictions - Home - triz.org"))

Several of the existing ideas use this logic:

- Separate stable identity from learned relationship state.
- Separate private creation from public distribution.
- Separate LLM interpretation from deterministic authorization and transaction execution.

Those are stronger than simple compromises because they change the system boundary or architecture.

### 4. System dynamics and Wardley Mapping


System dynamics adds causality and time. Causal loop diagrams show how variables affect each other through reinforcing and balancing feedback loops. They help explain why a tension intensifies, stabilizes, or produces unintended consequences. ([MIT OpenCourseWare](https://ocw.mit.edu/courses/15-871-introduction-to-system-dynamics-fall-2013/ "Introduction to System Dynamics | Sloan School of Management"))

Wardley Mapping adds user needs, capability dependencies, and the evolution of components from novel to commodity. It is useful for determining why a tension is becoming important now and which parts of a proposed product are likely to become infrastructure. ([Learn Wardley Mapping](https://learnwardleymapping.com/landscape/ "Landscape - Learn Wardley Mapping"))

The existing analyses identify many plausible tensions but usually stop before modeling the dynamics. For example:

```text
better memory
→ greater relationship value
→ more user investment
→ greater switching cost
→ more platform power
→ stronger demand for portability
```


That is a reinforcing loop. It makes the portability tension more compelling than a static statement such as "users want portability."

### 5. Jobs to Be Done, Outcome-Driven Innovation, and Opportunity Solution Trees


These methods add the demand evidence that the current approach lacks.

Jobs to Be Done examines the circumstances and forces that move a person or organization toward or away from changing behavior. It looks at the push from the current situation, pull of a new solution, anxiety about change, and existing habits. ([Christensen Institute](https://www.christenseninstitute.org/theory/jobs-to-be-done/ "Jobs to Be Done Theory - Christensen Institute"))

Opportunity Solution Trees connect a desired outcome to observed customer problems, possible solutions, and assumption tests. Their value comes from organizing actual customer evidence, not from generating a plausible tree from desk research. ([Product Talk](https://www.producttalk.org/opportunity-solution-trees/ "Opportunity Solution Trees: Visualize Your Discovery to Stay ..."))

The tension map explains **where value might exist**. JTBD and discovery methods test **whether anyone is ready to change and pay**.

<a id="how-i-would-change-the-method"></a>

## Proposed method changes

### 1. Define "market tension" more strictly


Proposed definition:

> A market tension is a persistent mismatch among incentives, required outcomes, or control rights that creates recurring cost, risk, delay, or lost revenue under the current system.

Then classify each tension.

|Type|Test|Typical product response|
|---|---|---|
|Incentive conflict|Does one actor benefit when another loses?|New pricing, intermediary, alternative business model|
|Persistent polarity|Are both sides necessary over time?|Measurement, controls, segmentation, configurable boundaries|
|Coordination failure|Does value require several independent actors to align?|Orchestration, standards, guarantees|
|Transition conflict|Does a new capability damage incumbent economics or assets?|Migration, transition tooling, economic simulation|
|Capability constraint|Do actors agree on the outcome but lack the capability?|Tool, infrastructure, service|
|Rights and risk ambiguity|Are ownership, authority, or liability unclear?|Provenance, audit, permissions, contracts, insurance|

For example:

- Per-seat revenue versus customer automation is an incentive conflict.
- Persona stability versus adaptation is a persistent polarity.
- Portable companion identity across platforms is a coordination problem.
- SaaS agentification versus incumbent seat economics is a transition conflict.
- Prototype versus production is a capability constraint.
- Agent autonomy versus accountability is partly a rights and risk problem.

The existing analyses contain examples of all of these, but score them together.

The classification matters because each type has a different discovery process and failure mode.

### 2. Use two mapping passes


**Pass one: broad market scan**

Map the whole system to generate tensions. This is a strength of the current approach.

**Pass two: outcome-centered submap**

For each promising tension, define one focal outcome and map only the activities and actors required to produce it.

For example:

```text
Focal outcome:
An enterprise can let an AI agent approve an invoice
without losing financial control.
```


Then map:

```text
evidence collection
→ policy interpretation
→ authority check
→ amount validation
→ approval
→ ERP transaction
→ reconciliation
→ audit
```


Actors follow from the activities: employee, finance owner, agent vendor, ERP, auditor, security team, regulator.

This prevents the map from expanding into every actor who might influence the market.

### 3. Add flows, control, and power


"Actor A wants X; actor B wants Y" is too abstract. For every relationship, record six flows:

```text
money
work
data
risk
rights
control
```


For every actor, record:

```text
Who pays?
Who uses?
Who receives the benefit?
Who bears failure?
Who owns the data or relationship?
Who can approve adoption?
Who can veto it?
```


This often changes the apparent opportunity. A user may have the strongest pain while having no budget or authority. A risk owner may have the budget even though they never touch the product.

### 4. Require a causal mechanism


Each tension should be written as a mechanism:

```text
Because [actor incentive, rule, or constraint],
[actor] repeatedly does [observable behavior].

This creates [cost, risk, delay, or lost revenue]
for [affected actor].

The current workaround is [process/tool/labor].
The tension is increasing because [change vector].
```


Example:

```text
Because a companion platform must upgrade models to improve
cost, safety, and capability, it changes the runtime behind
existing companions.

This can change companion behavior and produce user complaints,
support work, churn, or rollback pressure.

The current workaround is manual persona testing, prompt tuning,
or leaving some users on older models.
```


The causal mechanism is much easier to validate than a broad claim such as "identity continuity is important."

### 5. Keep evidence confidence separate from attractiveness


For every claim, attach an evidence level:

```text
0 — inference only
1 — public evidence or visible workaround
2 — practitioner interviews
3 — internal operational data
4 — paid pilot or purchase
```


A high-attractiveness, low-evidence tension belongs in the research queue. It should not rank alongside an opportunity supported by a budget, operational data, and a paid pilot.

This would make the market maps clearer about their evidence. Some of the current scores combine direct market evidence with plausible speculation.

### 6. Use hard gates before weighted scoring


The existing urgency, budget, buildability, whitespace, and multiple-buyer score is useful for initial comparison. Proposal: add hard gates before assigning a score:

1. There is a repeated, measurable cost, risk, delay, or revenue loss.
2. A specific economic buyer owns the problem.
3. The buyer already spends money or labor on a workaround.
4. The first buyer can adopt the product without requiring the whole ecosystem to cooperate.
5. Value can be demonstrated within roughly 90 days.
6. Repeated use creates an expansion path or accumulating asset.

A weighted score can hide a fatal zero. An opportunity with high urgency and technical depth still fails when no actor can buy it independently.

Proposed changes to two existing dimensions:

- **Multiple buyer types** should measure expansion potential. It can be a disadvantage at the start when several parties must agree before value appears.
- **Whitespace** should be paired with demand evidence. An empty category can indicate an opportunity or an absent market.

After the gates, score:

```text
cost left in the system
frequency
rate at which the problem is worsening
buyer urgency and budget
buyer reachability
time to prove value
technical advantage
expansion potential
```


Then subtract for:

```text
coordination burden
integration burden
liability
sales-cycle length
incumbent response
```

### 7. Separate the tension, first product, and eventual platform


The current method sometimes jumps directly from a tension to a large shared layer:

```text
tension
→ portable identity and rights standard
```


Proposed three-stage sequence:

```text
System tension
→ first unilateral product
→ later shared infrastructure
```


The first product should help one actor before other actors cooperate.

This is especially important for standards, portability, identity, rights, interoperability, and ecosystem infrastructure. They often benefit everyone in theory and have no natural first buyer.

### 8. Add dynamics and falsification


For every tension, record:

```text
Current intensity:
Direction: increasing / stable / decreasing
Primary trigger:
Important delay:
Reinforcing or balancing feedback:
Likely future equilibrium:
What evidence would disprove the opportunity?
```


The last field prevents the method from becoming a machine for generating convincing narratives.

## Revised worksheet

```text
Focal outcome
What valuable event or result are we analyzing?

Boundary and horizon
Which market, geography, segment, and time period?

Activities
What must happen for the outcome to occur?

Actors and roles
User, buyer, beneficiary, operator, supplier, blocker, risk owner.

Flows
Money, work, data, risk, rights, and control.

Tension type
Incentive, polarity, coordination, transition, constraint, or rights/risk.

Causal mechanism
Why does the tension occur, and what behavior does it produce?

Cost left in the system
Labor, delay, risk, revenue loss, compute cost, churn, or compliance cost.

Current workaround
What do actors do today, and what do they spend?

Change vector
Why is the tension becoming stronger now?

Evidence and confidence
Public evidence, interviews, data, paid experiment.

Economic buyer
Who owns the budget and the result?

Unilateral first product
What can one buyer adopt without ecosystem agreement?

Proof
What result can be demonstrated within 90 days?

Kill criteria
What findings would cause us to stop?

Expansion path
What adjacent buyers, workflows, or system layers become available?

Accumulating asset
Data, integrations, rights, workflow state, distribution, or standards position.
```

## Worked example: companion identity


The original reasoning is:

```text
platform needs model upgrades
↕
user needs personality continuity

possible shared component:
persona or relationship compatibility measurement
```


That is one of the stronger tensions in the companion analysis.

Using the revised method:

```text
Focal outcome:
A companion platform can change models without causing a perceived identity break.

Tension type:
Persistent polarity plus technology-transition risk.

Causal mechanism:
Model changes improve cost, safety, or capability but alter
behavior. Users perceive drift, leading to complaints, churn,
manual tuning, rollback pressure, or old-model support.

First buyer:
Head of AI, model quality, or product at a companion platform.

Current workaround:
Manual conversations, generic evals, prompt tuning, employee judgment, gradual rollout.

First product:
Persona-specific behavioral regression testing for model releases.

Proof:
Evaluate old and new models across 50–100 important personas.
Determine whether the system finds severe drift before human
release reviewers or production users find it.

Metrics:
Review hours saved.
High-severity regressions detected.
Agreement with creator/user judgments.
Rollbacks or post-release complaints prevented.

Kill criteria:
Platforms do not experience meaningful drift-related cost.
Existing generic eval systems handle the problem adequately.
Model changes are too infrequent.
Platforms will not provide traces or persona definitions.

Expansion:
Creator-defined identity invariants.
Cross-model compatibility certification.
Relationship-state migration.
Portable companion identity specifications.
```


The portable identity layer remains the long-term possibility. Behavioral regression testing is the more credible first product because one platform can buy and use it independently.

The same rule applies to the SaaS work. "Safe agent action infrastructure" is a plausible platform direction. A first product should control one costly transaction type, for one buyer, in one system of record. General infrastructure can emerge from repeated implementations.

<a id="what-i-would-retain"></a>

## Elements to retain


Proposal: retain two central parts of the approach:

- Study the system before selecting a product category.
- Search for repeated technical components that appear across apparently opposing strategies.

The consulting-first formation path also appears reasonable: sell the analysis, collect operating evidence, and productize the repeated bottleneck.

Proposal: make that process stricter. Every engagement should populate the same schema. Productization becomes justified when several engagements share the same buyer, input data, core operation, integration pattern, and outcome metric.

The revised sequence is:

```text
broad system scan
→ tension classification
→ outcome-centered map
→ causal and economic evidence
→ unilateral first buyer
→ paid test
→ repeated implementation
→ shared infrastructure
```


This keeps the systemic insight while reducing the risk of building a broad layer that many actors could use but none will buy first.

## Library sources


- [Meadows 2008](/sources/thinking-and-learning/systems-thinking/meadows-2008-thinking-in-systems.pdf.enc), *Thinking in Systems: A Primer* -- on *4. System dynamics and Wardley Mapping*

Further reading:

- [Hester and Adams 2017](/sources/thinking-and-learning/systems-thinking/hester-2017-systemic-decision-making.pdf.enc), *Systemic Decision Making*
