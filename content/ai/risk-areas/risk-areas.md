---
draft: false
toc: true
title: "Risk Areas"
linkTitle: "Risk Areas"
---
# part 1


> **Status:** Early working notes. See [`risk-areas-model.md`]({{< ref "ai/risk-areas/risk-areas-model" >}}) for the selected model. These notes are retained as source material and may contain positions that were not selected.

Calling them "risks" is defensible, but a slightly more precise name is useful.

SVPG's four are:

- Value -- will customers choose/buy/use it?
- Usability -- can users use it effectively?
- Feasibility -- can it be built within the relevant constraints?
- Viability -- does it work for the business?

SVPG itself later describes these explicitly as a **product risk taxonomy**. ([Silicon Valley Product Group](https://www.svpg.com/product-risk-taxonomies/?utm_source=chatgpt.com "Article: Product Risk Taxonomy : Silicon Valley Product Group"))

The subtle issue is that **value, usability, feasibility, and viability aren't themselves risks**. They're dimensions in which uncertainty exists. In formal risk terminology, ISO 31000 defines risk around the "effect of uncertainty on objectives." ([ISO](https://www.iso.org/news/ref2263.html?utm_source=chatgpt.com "ISO - The new ISO 31000 keeps risk management simple"))

They can be modeled like this:

|Dimension|Concrete risk|
|---|---|
|Value|Customers may not consider the problem important enough to switch/pay|
|Usability|Users may fail to complete the main workflow without assistance|
|Feasibility|The required latency may not be achievable with the available architecture|
|Viability|The solution may make the unit economics unacceptable|

This distinction becomes useful when managing discovery. "Value risk" is too broad to test directly; **specific risks within the value dimension** can be tested.

The recommended terminology is therefore:

**Four Product Risk Dimensions**

-> Value -> Usability -> Feasibility -> Viability

And underneath each dimension, capture individual **risks**.

Another possible term is **uncertainties**. For example:

> Product Discovery reduces uncertainty across four dimensions: value, usability, feasibility, and viability.

This wording is preferable when explaining discovery, because discovery is fundamentally about gathering evidence before committing to build. SVPG describes discovery similarly: gathering evidence that a solution is valuable, usable, feasible, viable, and capable of achieving the desired outcome. ([Silicon Valley Product Group](https://www.svpg.com/the-product-operating-model-an-introduction/?utm_source=chatgpt.com "The Product Operating Model: An Introduction  - Silicon Valley Product Group : Silicon Valley Product Group"))

Avoid calling the four things **"assumptions."** An assumption is slightly different:

> Assumption: "Finance managers reconcile invoices every week."
> Risk: That assumption could be false, resulting in insufficient product value.
> Dimension: Value.

The resulting hierarchy is:

**Product Risk Dimensions -> Risks -> Assumptions -> Evidence**

That produces much cleaner language than treating "Value Risk" as one giant risk.

# part 1 - reasoning


The broader SVPG material presents a coherent model, but the terminology mixes two levels: **properties of a good solution** and **risks that those properties won't hold**.

SVPG itself uses both forms. It says an effective solution is "valuable, usable, feasible and viable," while also calling value/usability/feasibility/viability a risk taxonomy. ([Silicon Valley Product Group](https://www.svpg.com/product-model-concepts/?utm_source=chatgpt.com "Product Model Concepts - Silicon Valley Product Group : Silicon Valley Product Group"))

It can be formalized this way.

### 1. The four are solution dimensions


A candidate solution needs to satisfy four conditions:

|Dimension|Definition|Core question|
|---|---|---|
|**Value**|The solution provides enough value that the relevant customer or user will choose it.|**Will they choose it?**|
|**Usability**|The intended users can successfully accomplish what they need with the solution.|**Can they use it?**|
|**Feasibility**|The team can build and deliver the solution given its technology, skills, time, and important technical constraints.|**Can the team build it?**|
|**Viability**|The organization can sustainably and responsibly offer the solution within its business constraints.|**Can the organization support it?**|

Then:

> **Value risk** = uncertainty that the solution will be valuable.
> **Usability risk** = uncertainty that the solution will be usable.
> etc.

That resolves the naming issue cleanly.

SVPG's 2023 taxonomy article effectively supports this interpretation: the taxonomy is a classification of risks, and the four categories tell the team what kinds of failure to look for. ([Silicon Valley Product Group](https://www.svpg.com/product-risk-taxonomies/ "Article: Product Risk Taxonomy : Silicon Valley Product Group"))

### 2. Value needs the most careful definition


SVPG defines value more narrowly than the word normally implies.

It means roughly:

> **Will the customer buy it, or will the user choose to use it?**

SVPG explicitly distinguishes this from usability: a user may be perfectly capable of using something while having no desire to use it. Their 2025 material calls this the distinction between "could use" and "choose to use." ([Silicon Valley Product Group](https://www.svpg.com/product-design-and-ai/ "Product, Design and AI - Silicon Valley Product Group : Silicon Valley Product Group"))

A slightly stronger definition is:

> **Value:** Will the target customer/user choose this solution given their alternatives, costs of switching/adoption, and the importance of the problem?

For a commercial product, this becomes competitive:

> Is this solution sufficiently better than the customer's current alternative that they will switch, buy, adopt, or continue using it?

That matches SVPG's newer emphasis. In 2026 they explicitly say that a commercial solution often needs to be substantially better than alternatives to cause switching. ([Silicon Valley Product Group](https://www.svpg.com/build-to-learn-vs-build-to-earn/ "Build to Learn vs Build to Earn - Silicon Valley Product Group : Silicon Valley Product Group"))

For an internal product the definition changes slightly because users may have no meaningful choice. SVPG acknowledges this. In that case, value can be defined as:

> Does the solution actually solve the intended problem well enough to produce the required benefit?

SVPG says much the same: for internal products, what counts is successfully completing the job to be done. ([Silicon Valley Product Group](https://www.svpg.com/commercial-vs-internal-products/ "Commercial vs Internal Products - Silicon Valley Product Group : Silicon Valley Product Group"))

So **"value" is probably the weakest label of the four**. "Adoption risk" would be clearer for commercial products, but worse for internal products.

**Value** is worth retaining for compatibility, with an explicit definition.

### 3. Usability is comparatively clean


It can be defined as:

> **Usability:** Can the intended users successfully accomplish the required tasks in their expected context, with an acceptable amount of learning, effort, and assistance?

The important separation is:

- "The solution can be used successfully" -> usability.
- "The solution is worth choosing or using" -> value.

A beautiful, intuitive solution to a problem nobody cares about has low usability risk and high value risk.

A highly desirable tool with a confusing workflow has low value risk and high usability risk.

This separation is one reason SVPG prefers four dimensions over IDEO's desirability/feasibility/viability taxonomy, especially for B2B products where buyer and user can be different people. ([Silicon Valley Product Group](https://www.svpg.com/product-risk-taxonomies/ "Article: Product Risk Taxonomy : Silicon Valley Product Group"))

### 4. Feasibility should mean more than "can it compile?"


SVPG's original wording is:

> Can the engineers build what is needed with the time, skills, and technology available? ([Silicon Valley Product Group](https://www.svpg.com/four-big-risks/ "The Four Big Risks - Silicon Valley Product Group : Silicon Valley Product Group"))

Their newer material talks about being able to build and deliver a **product-quality** solution. ([Silicon Valley Product Group](https://www.svpg.com/the-purpose-of-prototypes/?utm_source=chatgpt.com "The Purpose of Prototypes - Silicon Valley Product Group : Silicon Valley Product Group"))

It can therefore be defined as:

> **Feasibility:** Can the team build and deliver the required solution within the relevant technical, capability, and time constraints?

Examples of concrete feasibility risks:

- the model may not achieve required accuracy;
- latency may be too high;
- an external API may not support the required behavior;
- the team may lack a required technical capability;
- the architecture may not handle the necessary scale;
- implementation may take 18 months when the opportunity requires 3.

One boundary needs judgment. SVPG's 2026 material separates discovery risks from ordinary delivery concerns such as reliability, scale, fault tolerance, security, and operations. ([Silicon Valley Product Group](https://www.svpg.com/build-to-learn-vs-build-to-earn/ "Build to Learn vs Build to Earn - Silicon Valley Product Group : Silicon Valley Product Group"))

The following rule is useful:

> If a technical property could invalidate the **solution concept**, it is feasibility risk during discovery. If the means of satisfying it are already known and only correct implementation remains, it is delivery work.

For example, "Can inference finish within 100 ms at all?" is discovery. "Make sure the known implementation meets its 100 ms SLO" is delivery.

### 5. Viability is the broad business constraint


It can be defined as:

> **Business viability:** Can the organization offer, operate, support, and benefit from this solution within its economic, legal, strategic, commercial, and organizational constraints?

This includes things such as:

- monetization and unit economics;
- sales;
- marketing and distribution;
- customer support/service;
- legal;
- compliance;
- privacy/security requirements;
- contracts and partnerships;
- brand;
- financing/funding;
- manufacturing or operations.

SVPG explicitly places sales, marketing, finance, legal, compliance, and similar concerns here. ([Silicon Valley Product Group](https://www.svpg.com/value-and-viability/ "Value and Viability - Silicon Valley Product Group : Silicon Valley Product Group"))

It is deliberately a large bucket. Cagan acknowledges that things like ethics, compliance, and go-to-market could be separate risk categories, but argues that a short taxonomy people actually use is preferable. ([Silicon Valley Product Group](https://www.svpg.com/product-risk-taxonomies/ "Article: Product Risk Taxonomy : Silicon Valley Product Group"))

The clean distinction with value is:

> **Value asks whether the customer wants the transaction.**
> **Viability asks whether the business wants and can support the transaction.**

For example:

Customer will happily pay $10/month -> value looks good.

Serving that customer costs $35/month -> viability problem.

### 6. The four don't describe all product uncertainty


This became clearer in SVPG's newer writing.

Their current model starts with:

**Problem -> desired outcome -> candidate solution**

Then discovery asks whether the candidate solution is valuable, usable, feasible, and viable **and whether it is likely to achieve the desired outcome**. ([Silicon Valley Product Group](https://www.svpg.com/build-to-learn-faq/ "Build To Learn FAQ - Silicon Valley Product Group : Silicon Valley Product Group"))

Avoid claiming:

> "These are the four risks of building a product."

That's too broad.

Instead:

> **These are four major dimensions of solution risk.**

There are uncertainties outside them.

For example:

**Problem selection risk**

Is the problem worth spending resources on?

**Problem-understanding risk**

Are the problem and affected people understood correctly?

**Outcome risk**

Even if people adopt the solution, does it actually move the target metric or business outcome?

**Delivery/operational risks**

Will the production implementation be reliable, secure, scalable, observable, etc.?

SVPG explicitly separates problem discovery from solution discovery, and its 2026 material says the four risks primarily apply while discovering the solution. ([Silicon Valley Product Group](https://www.svpg.com/product-design-and-ai/?utm_source=chatgpt.com "Product, Design and AI - Silicon Valley Product Group : Silicon Valley Product Group"))

That scope makes the model much stronger.

### 7. Risk itself should be concrete


Avoid putting something like this into a discovery document:

> Value risk: High

It does not identify the uncertainty.

Instead:

> **Dimension:** Value
> **Risk:** Existing customers may not switch because the improvement in reconciliation time isn't large enough to justify retraining their finance teams.
> **Assumption:** Reducing reconciliation from 2 hours to 30 minutes is enough to trigger adoption.
> **Evidence needed:** Observe purchase/switching behavior or obtain sufficiently strong commitment from representative customers.

This also fits SVPG's "Discovery - Judgement" article. They argue that teams should assess which risks are significant, consider the consequence of being wrong, and choose the amount of evidence accordingly. ([Silicon Valley Product Group](https://www.svpg.com/discovery-judgement/ "Discovery - Judgement - Silicon Valley Product Group : Silicon Valley Product Group"))

The resulting conceptual hierarchy is:

**Problem + desired outcome**

↓

**Candidate solution**

↓

**Solution risk dimensions**

- Value
- Usability
- Feasibility
- Business viability

↓

**Concrete risks**

↓

**Underlying assumptions**

↓

**Evidence / experiments**

↓

**Decision**

And after launch:

**Actual outcome**

That last step is important because SVPG explicitly says the ultimate evidence that the team made the right decisions is whether the intended business impact actually happened. ([svpg.com](https://www.svpg.com/build-to-learn-faq/ "Build To Learn FAQ - Silicon Valley Product Group : Silicon Valley Product Group"))

The preferred name for the framework is therefore **Four Solution Risk Dimensions**. It preserves SVPG's vocabulary while being more precise about what the four things actually represent.

# answer 2


There is practitioner precedent for this interpretation, which separates the top-level classification from the concrete things being tested.

The closest matches are:

| Practitioner  | Top level                                                                           | Concrete level                                            | Fit with this interpretation            |
| ------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------- | --------------------------------------- |
| Teresa Torres | **Assumption categories**: desirability, viability, feasibility, usability, ethical | Individual **assumptions**                                | Very close                              |
| Roman Pichler | **Success factors**: desirability, feasibility, viability, ethicality               | Individual **risks / assumptions** related to each factor | Closest conceptual match                |
| IDEO          | **Lenses / perspectives**: desirability, feasibility, viability                     | Questions, prototypes, findings                           | Supports calling them dimensions/lenses |
| SVPG          | **Risk taxonomy / types of risk**                                                   | Risks tested during discovery                             | Compatible, but terminology is looser   |

Teresa Torres is particularly useful here. She explicitly says assumptions "fall into five categories," then expects teams to enumerate specific assumptions inside each category. So "feasibility" is a category; something like "the inference pipeline can respond in <500ms" is the actual assumption under investigation.

Roman Pichler gets even closer to this distinction. He calls desirability, feasibility, viability, and ethicality **product success factors**, then separately talks about the **risks related to** those factors. For example, under feasibility he gives concrete risks such as the necessary technology being difficult to apply or lacking people with the required skills.

IDEO doesn't call its three headings risks at all. It explicitly calls desirability, viability, and feasibility **perspectives** and **lenses**. That is strong support for the interpretation that these words describe axes along which a solution is evaluated.

Even SVPG's later terminology supports the argument. Cagan calls the model a **product risk taxonomy** and talks about "types of risk." A taxonomy is inherently a classification. So although SVPG says "value risk," it is effectively using Value as a risk category.

The important caveat is that no major practitioner appears to use this exact hierarchy verbatim:

**Product Risk Dimension -> Risk -> Assumption -> Test -> Evidence**

This hierarchy is a synthesis.

It is more useful than copying any single framework because each term has a distinct job:

> **Dimension:** Value
> **Risk:** Customers may not switch from their current workflow.
> **Assumption:** The current workflow causes enough pain to motivate switching.
> **Test:** Put a realistic prototype in front of target customers and ask for a meaningful commitment.
> **Evidence:** 7/10 agree to run a pilot.

The following terminology can therefore be standardized:

**Product Risk Dimensions**

-> **Specific Risks**

-> **Assumptions**

-> **Tests**

-> **Evidence**

-> **Decision**

For maximum alignment with existing product-discovery language, the word "Product" can be dropped after the first level:

**Product Risk Dimensions -> Risks -> Assumptions -> Tests -> Evidence**

That maps cleanly to SVPG + Pichler + Torres without pretending that the hierarchy itself is an established industry framework.
