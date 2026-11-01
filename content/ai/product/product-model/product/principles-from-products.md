---
draft: false
toc: true
description: "A working synthesis generalizes Cagan’s risk profiles and Torres’s testable assumptions into principles for proportional learning and commitment, with discovery, delivery, and observation as recurring work modes."
title: "Principles From Products"
linkTitle: "Principles From Products"
---

Torres and Cagan should be major inputs to this system. Their contribution is different from Agile, Kanban, or Deming: they provide a model for deciding **how much learning is needed before committing resources**, based on the risk of being wrong.

Teresa Torres does not advocate a sequential `discovery -> delivery` process. She explicitly argues that teams should be "discovering and delivering all the time." ([Product Talk](https://www.producttalk.org/time-in-product-discovery/ "How Much Time Should You Spend in Product Discovery?")) Cagan makes the conceptual distinction more strongly. Discovery and delivery are therefore **two modes of work that can run concurrently**.

The underlying logic is something like:

`start with a desired outcome or problem`

-> `whether a proposed approach will work is uncertain`

-> `identify what could make it fail`

-> `reduce the important uncertainties cheaply`

-> `commit more resources as confidence grows`

-> `deliver`

-> `observe reality`

-> `feed that evidence back into discovery`

This closely matches the emerging architecture.

### Cagan: discovery as risk reduction


Cagan's framing is particularly clear. Discovery determines whether a solution is worth building before the full cost of building it is paid. He explicitly says discovery should tackle the important risks early and that different work has a different **risk profile**. The four risks are not equally important for every change. ([Silicon Valley Product Group](https://www.svpg.com/four-big-risks/ "The Four Big Risks - Silicon Valley Product Group : Silicon Valley Product Group"))

His four risks are:

- **Value:** Will people choose, use, or pay for it?
- **Usability:** Can they successfully use it?
- **Feasibility:** Can the team build and operate it with the available technology, skills, and time?
- **Viability:** Does it work for the business and its broader constraints? ([Silicon Valley Product Group](https://www.svpg.com/four-big-risks/ "The Four Big Risks - Silicon Valley Product Group : Silicon Valley Product Group"))

The important idea for this framework is **risk profile**, rather than those exact four categories.

Cagan explicitly says different initiatives have different significant risks. A minor change may warrant almost no discovery; another may have one dominant uncertainty that should be investigated before anything else. ([Silicon Valley Product Group](https://www.svpg.com/discovery-judgement/ "Discovery - Judgement - Silicon Valley Product Group : Silicon Valley Product Group"))

A possible principle is:

> **Match discovery to the risk profile.**
> Before committing substantial effort, identify what must be true for the work to succeed and reduce the uncertainties whose consequences are unacceptable.

This principle is broader than product discovery.

It could apply to:

- architecture;
- organizational change;
- standards;
- AI evaluation systems;
- process changes;
- infrastructure;
- shared dictionaries;
- even the principles framework itself.

It also connects to an earlier principle:

> **Match commitment to confidence, reversibility, and risk.**

These may eventually form one larger principle.

### Torres: turn "risk" into testable assumptions


Torres provides something that Cagan's four risks do not provide as directly: a mechanism for turning an abstract risk into **something concrete that can be investigated**.

She defines assumptions as beliefs that need to be true for an idea to succeed, and uses five categories:

- desirability;
- viability;
- feasibility;
- usability;
- ethical assumptions. ([Product Talk](https://www.producttalk.org/five-types-of-assumptions/ "Evaluating Solutions: The 5 Types of Assumptions that Underlie Our Ideas"))

She explicitly compares this to Cagan and says they are conceptually talking about essentially the same thing. Her reason for talking about **assumptions** is practical: saying "there is viability risk" does not identify what to test; enumerating the assumptions underneath that risk does. ([Product Talk](https://www.producttalk.org/five-types-of-assumptions/ "Evaluating Solutions: The 5 Types of Assumptions that Underlie Our Ideas"))

That distinction is useful for this model.

For example:

> "There is feasibility risk."

is weak.

Turn it into:

> GPT-5 class models can distinguish these evaluation categories consistently enough.

> Regressions can be detected with fewer than N evaluation cases.

> Reviewers can resolve ambiguous results in less than X minutes.

> Inference cost stays below Y.

This makes it possible to decide:

- confidence;
- consequence if false;
- cheapest useful test;
- evidence needed before proceeding.

This creates a reusable pattern:

`risk area`

-> `assumptions`

-> `risk of each assumption`

-> `test / evidence`

-> `decision`

This is compatible with the principle **make uncertainty explicit and resolve it deliberately**.

### Torres also provides a strong problem/outcome structure


Her Opportunity Solution Tree starts from a **desired outcome**, moves through customer opportunities/problems, explores multiple possible solutions, and then tests the assumptions underlying those solutions. ([Product Talk](https://www.producttalk.org/discovering-solutions/ "Discovering Solutions: Quickly Determine Which Ideas Will Work (And Which Won't)"))

Abstracted away from product management, the logic is:

`desired outcome`

-> `understand problem/opportunity space`

-> `consider multiple interventions`

-> `identify assumptions`

-> `test important assumptions`

-> `act`

This matches the earlier discussion of:

- frame the problem before solving it;
- continuously reconnect work to its problem/context;
- preserve alternatives while uncertainty is high;
- make assumptions explicit;
- use evidence to converge.

Torres also explicitly calls **externalizing thinking**, outcome focus, and collaborative decision-making guiding principles of continuous discovery. ([Product Talk](https://www.producttalk.org/no-single-right-way/ "Why There's No Single "Right" Way to Do Discovery: Part 1")) This connects directly with the "share your work" and visibility themes.

## Why this becomes stronger for AI


Cagan himself now argues that AI products tend to make the existing product risks more demanding. His AI product-management treatment covers probabilistic outputs, data quality, acceptable error rates, model limitations, trust, explainability, latency/cost tradeoffs, privacy, copyright, bias, abuse, regulation, and ethical consequences. ([Silicon Valley Product Group](https://www.svpg.com/ai-product-management/ "AI Product Management - Silicon Valley Product Group : Silicon Valley Product Group"))

The four categories still map surprisingly well.

|Risk|AI version|
|---|---|
|Value|Does AI actually improve the user's outcome over the baseline?|
|Usability|Can users understand when to trust, verify, correct, or override it?|
|Feasibility|Can the system reach the required quality, latency, cost, data, reliability, and operational characteristics?|
|Viability|Are privacy, security, compliance, IP, abuse, economics, legal and organizational consequences acceptable?|

This framework should **not require those four categories**.

Cagan himself says the higher-order point is to use a risk taxonomy and that other taxonomies can work. ([Silicon Valley Product Group](https://www.svpg.com/product-risk-taxonomies/ "Article: Product Risk Taxonomy : Silicon Valley Product Group"))

Torres also explicitly pulls **ethics** into its own assumption category because surfacing neglected assumptions can be more useful than maintaining a minimal taxonomy. ([Product Talk](https://www.producttalk.org/five-types-of-assumptions/ "Evaluating Solutions: The 5 Types of Assumptions that Underlie Our Ideas"))

For AI, a risk profile could visibly expose categories such as:

`outcome/value`

`quality/reliability`

`human interaction/trust`

`technical feasibility`

`data`

`safety/harm`

`security/abuse`

`legal/compliance`

`economics/operations`

Not all nine categories need to be evaluated every time. The first act of discovery is to identify **which ones dominate this particular piece of work**.

This follows Cagan's logic.

## Discovery and delivery become a general organizing distinction


This may be one of the most useful ideas for the overall system.

**Discovery** can be generalized beyond "what product feature should be built?"

**Discovery:** reduce decision-relevant uncertainty.

**Delivery:** turn a sufficiently supported decision into an operational result.

This produces examples such as:

**Evaluation framework**

Discovery:

`What properties matter?`

`Can they be measured?`

`Which definitions are contested?`

`Do proposed metrics correlate with the target outcomes?`

Delivery:

`Implement eval infrastructure`

`publish terminology`

`integrate it into CI`

`train teams`

`operate it`

**New engineering standard**

Discovery:

`What failures are occurring?`

`Would this policy have prevented them?`

`What burden does it impose?`

`Can tooling automate it?`

Delivery:

`publish standard`

`build tooling`

`migrate`

`enforce`

**AI capability**

Discovery:

`Can the model actually perform the task?`

`Under what distribution?`

`Which failures occur?`

`Are those failures acceptable?`

`Does it beat the current approach?`

Delivery:

`build production system`

`instrument`

`deploy`

`operate`

Production also generates new evidence and sends work back into discovery.

The model should not use:

`Discovery -> Delivery`

as a lifecycle that happens once.

A better model is:

`Discovery ⇄ Delivery ⇄ Observation`

with different amounts of discovery depending on the current risk profile.

This gives the emerging framework a clearer causal chain:

**Start from problem and outcome.**

↓

**Identify uncertainty and the risk profile.**

↓

**Turn important risks into explicit assumptions.**

↓

**Use discovery to reduce unacceptable uncertainty cheaply.**

↓

**Match commitment and controls to evidence, reversibility, and consequences.**

↓

**Deliver in small enough units to obtain useful feedback.**

↓

**Observe actual use/outcomes.**

↓

**Update assumptions, practices, and understanding.**

**Torres and Cagan together provide the strongest precedent so far for the "epistemic" part of this system.** Deming provides the deeper theory of knowledge, while Torres and Cagan make it operational: _what remains uncertain, what could make this fail, and what is the cheapest useful evidence available before further commitment?_

One consequence is that **"discovery" may not belong as a principle**. It may be better treated as a fundamental mode of work enabled by several principles: problem orientation, explicit uncertainty, risk-based commitment, experimentation, and feedback.
