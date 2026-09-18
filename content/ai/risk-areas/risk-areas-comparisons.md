---
draft: false
toc: true
title: "Risk Areas Comparisons"
linkTitle: "Risk Areas Comparisons"
---
# Naming and Operationalizing SVPG's Four Product Risk Areas


> **Status:** Supporting comparison, not canonical guidance. See [`risk-areas-model.md`]({{< ref "ai/risk-areas/risk-areas-model" >}}) for the selected model. This document preserves alternative names, the four-dimensions-with-optional-Ethics position, the practitioner survey, and the history behind the overlapping terms.

## Recommended naming conventions

### Recommended default: Product Risk Dimensions


The recommended default for most product teams is:

> **Product Risk Dimensions**
> **Value · Usability · Feasibility · Viability**

This is more precise than simply naming a section "Four Risks."

The reason is semantic as well as practical. ISO 31000 defines risk as the **effect of uncertainty on objectives**. Under that meaning, "Value" by itself is a subject or dimension; even "value risk" is still a category label. A concrete risk would say what might happen and why the product objective would suffer. SVPG itself calls its model a **risk taxonomy**, meaning a classification system for types of risk, which supports treating the four labels as categories or dimensions rather than four individual risk records. [^iso-31000][^svpg-taxonomy]

For example:

> **Dimension:** Value
> **Risk:** Target finance teams may see too little improvement over their spreadsheet workflow to switch, preventing adoption.

The second sentence is a risk that can be investigated. "Value" indicates where to look.

**Pros:** faithful to SVPG; preserves the useful Value/Usability distinction; works equally well for B2B and B2C; separates taxonomy from concrete risk statements; gives design, engineering and business teams a shared coverage checklist. [^svpg-taxonomy]

**Cons:** the word *risk* can make discovery sound like defensive risk management; people may still write vague entries such as "high value risk" instead of spelling out what could fail.

> **Decision rationale:** This preserves the label most faithful to SVPG and establishes that the four names are categories rather than individual risk records. It remains an alternative because the canonical document narrows the label to **Solution Risk Dimensions**.

### Good alternative for discovery workshops: Product Uncertainties


A softer formulation is:

> **Key Product Uncertainties**
> Value · Usability · Feasibility · Viability

This works particularly well in early discovery, where the goal is to expose what the team does not yet know and gather evidence. SVPG's own current "build to learn" language and Pichler's risk-driven strategy discovery both treat uncertainty as something to resolve before larger commitments are made. [^svpg-build-to-learn][^pichler-strategy]

Its weakness is precision. "Uncertainty" indicates that knowledge is incomplete; it does not state **what objective is threatened or what consequence follows**. That makes it a good workshop heading and a weaker risk-register item. This distinction follows the ISO definition of risk as the effect that uncertainty has on objectives. [^iso-31000]

A useful phrasing is:

> "What are the biggest uncertainties across Value, Usability, Feasibility and Viability?"

Then convert the important answers into specific risk statements.

> **Decision rationale:** "Uncertainty" is retained as workshop language because it helps elicit unknowns. It is not canonical record structure because it does not state the threatened objective or consequence.

### Best for an experiment backlog: Assumption Categories


For a team running frequent discovery tests, Torres' terminology is useful:

> **Assumption Categories**
> Desirability/Value · Usability · Feasibility · Viability · Ethics, where applicable

An assumption is naturally testable because it can be written as a proposition that needs to hold. Torres defines assumptions in essentially those terms and recommends identifying, prioritizing and testing them rather than evaluating a whole idea as one indivisible object. [^torres-five][^torres-assumption-testing]

For example:

> **Risk:** Buyers may not switch because the existing process is good enough.
> **Assumption:** The target buyer experiences the problem frequently enough that eliminating it changes purchase behavior.

The risk and assumption are related but are not the same sentence.

The disadvantage of using **Assumptions** as the name for the top level is that Value, Usability, Feasibility and Viability are not themselves assumptions. A product can contain dozens of assumptions in every category; Torres' August 2026 material continues to emphasize generating many underlying assumptions before identifying the risky ones. [^torres-aug-2026]

Avoid:

> ❌ "The four assumptions are Value, Usability, Feasibility and Viability."

and use:

> ✓ "Assumptions are evaluated across four product risk dimensions."

> **Decision rationale:** This section supplies the canonical model's atomic unit without treating the dimension labels as assumptions. The category says where to look; the assumption states what must be true and can be tested.

### When to add Ethics/Safety


SVPG places ethical, compliance and related concerns largely within business viability. Cagan has acknowledged the argument for separating ethical risk when it otherwise receives insufficient attention. Torres makes **Ethical assumptions** a fifth category, while Pichler makes **Ethicality** a first-class product-success factor. [^svpg-taxonomy][^svpg-ethics][^torres-five][^pichler-success]

For a team where potential harm, privacy, fairness, safety or societal effects are material, the recommended form is:

> **Product Risk Dimensions: Value · Usability · Feasibility · Viability · Ethics/Safety**

The advantage of a fifth category is attention: teams are forced to ask the question explicitly. The cost is another category and some overlap with viability, security, compliance and usability. SVPG's 2023 discussion correctly identifies this as a tradeoff between completeness and a taxonomy people can remember and use. [^svpg-taxonomy]

> **Decision rationale:** This preserves the source's optional-Ethics position. The canonical document resolves the tradeoff differently by making Ethics explicit, because maintaining attention to harm outweighs the cost of overlap.

## How practitioners name and operationalize the areas


The main difference between the frameworks is not whether customer, user, technical, and business questions matter. It is **what object the framework asks the team to manage**: SVPG manages risk categories; Torres manages assumptions; Lean Startup manages hypotheses and learning; IDEO and consultancies use evaluation lenses; Google Design Sprints organize around assumptions and questions; Pragmatic Institute organizes around product-management activities. [^svpg-taxonomy][^torres-five][^lean-method][^ideo-design-thinking][^google-assumptions][^pragmatic-framework]

| Practitioner / organization and source type | Exact terminology | How the four SVPG areas are operationalized |
|---|---|---|
| **SVPG** -- [*Product Risk Taxonomy*](https://www.svpg.com/product-risk-taxonomies/) (practitioner/company blog) | **"four-risk taxonomy"**: **value, usability, feasibility, viability** | **Value:** test whether customers/users choose the solution. **Usability:** test whether users can use it. **Feasibility:** determine whether engineering can deliver it under available technical/time/skill constraints. **Viability:** test business, legal, compliance, go-to-market, monetization and related constraints. SVPG recommends assessing these risks before committing to delivery. [^svpg-taxonomy][^svpg-four] |
| **Marty Cagan** -- [*The Four Big Risks*](https://www.svpg.com/four-big-risks/) and [*Build To Learn FAQ*](https://www.svpg.com/build-to-learn-faq/) (practitioner blog/books) | **value risk, usability risk, feasibility risk, business viability risk** | Cagan's current operational model is to create discovery prototypes and test them against the four risks. Customer/user testing addresses value and usability; engineers resolve feasibility; stakeholder/business work addresses viability. His 2026 formulation explicitly calls discovery "building to learn." [^svpg-four][^svpg-build-to-learn] |
| **Teresa Torres / Product Talk** -- [*The 5 Types of Assumptions that Underlie Our Ideas*](https://www.producttalk.org/five-types-of-assumptions/) (practitioner blog/book methodology) | **desirability assumptions, viability assumptions, feasibility assumptions, usability assumptions, ethical assumptions** | **Value -> desirability:** identify what must be true about willingness to act/use and run demand tests. **Usability:** surface assumptions from the proposed workflow and test whether users can find, understand and complete it. **Feasibility:** surface technical, security, legal, compliance and organizational assumptions. **Viability:** expose economics/business assumptions, including willingness to pay and cost to deliver. Teams prioritize the riskiest assumptions and define success before testing. [^torres-five][^torres-assumption-testing] |
| **Roman Pichler** -- [*Four Product Success Factors*](https://www.romanpichler.com/blog/four-product-success-factors/) and [*Product Strategy Discovery*](https://www.romanpichler.com/blog/product-strategy-discovery/) (practitioner blog/books) | **product success factors** and **strategy risks**: **desirability, feasibility, viability, ethicality** | **Value:** desirability is tested through customer/user research. **Usability:** is not a separate top-level factor; ease/convenience contributes to desirability. **Feasibility:** assess technologies and skills, including with throwaway prototypes. **Viability:** validate business-model assumptions. His process repeatedly selects the biggest strategy risk, gathers evidence, then persists, changes strategy, or stops. [^pichler-success][^pichler-strategy] |
| **Google Design Sprints** -- [*Assumptions Mapping*](https://designsprintkit.withgoogle.com/methodology/phase2-define/assumptions-mapping), [*Validate*](https://designsprintkit.withgoogle.com/methodology/phase6-validate) (official method documentation) | **assumptions**, **sprint questions**, **critical business questions**; not a canonical four-risk taxonomy | Teams deconstruct assumptions into areas for experimentation and turn solution assumptions into sprint questions. **Value/usability:** users interact with the prototype. **Feasibility:** technical review. **Viability:** stakeholder review and business questions. The Sprint is therefore primarily an experimentation process, not a four-category naming system. [^google-assumptions][^google-validate] |
| **IDEO** -- [*Design Thinking*](https://designthinking.ideo.com/) (official design-method site) | **desirability, feasibility, viability**; commonly described as three perspectives/lenses | **Value + usability -> desirability:** begin with people's needs and learn through human-centered research, making and testing. **Feasibility:** assess technological possibilities and capabilities. **Viability:** assess requirements for organizational/business success. SVPG explicitly notes that IDEO's desirability combines what SVPG separates into customer value and usability. [^ideo-design-thinking][^svpg-taxonomy] |
| **Lean Startup / Eric Ries** -- [*Lean Startup Method 101*](https://leanstartup.co/resources/articles/lean-startup-method/) and [*What Is an MVP?*](https://leanstartup.co/resources/articles/what-is-an-mvp/) (official practitioner methodology) | **assumptions, hypotheses, value hypothesis, growth hypothesis, MVP, validated learning** | **Value:** value hypotheses predict measurable customer behavior and are challenged with MVPs/experiments. **Usability and feasibility:** can become assumptions to test, but are not first-class categories in the core taxonomy. **Viability:** value and growth hypotheses test whether customers receive value and how adoption can grow into a sustainable business. The central loop is experiment -> evidence -> learning. [^lean-method][^lean-mvp] |
| **Nielsen Norman Group** -- [*Discovery: Definition*](https://www.nngroup.com/articles/discovery-phase/) and [*The Product Triad: Design's Role*](https://www.nngroup.com/articles/the-product-triad-designs-role/) (UX research/practitioner articles) | **desirable, viable, feasible**; in newer material, the **DVF model** | **Value + usability -> desirability:** NN/g explicitly says a desirable product must be both useful and usable, with user research and usability testing supplying evidence. **Feasibility:** investigate technological unknowns. **Viability:** investigate organizational/business unknowns. NN/g also uses a feasibility-desirability-viability scorecard for prioritization. [^nng-discovery][^nng-triad][^nng-prioritization] |
| **Pragmatic Institute** -- [*Pragmatic Framework*](https://www.pragmaticinstitute.com/product/framework/) (official product-management framework) | Activity names rather than four risk dimensions: **Market Problems, Win/Loss Analysis, Asset Assessment, Business Plan, Pricing, Buy/Build/Partner, Product Profitability, User Personas, Use Scenarios**, etc. | **Value:** interview/observe markets, validate market problems and analyze why prospects buy or reject. **Usability:** User Personas and Use Scenarios provide user context, though there is no standalone usability-risk category. **Feasibility:** Asset Assessment and Buy/Build/Partner. **Viability:** Business Plan, Pricing, Distribution Strategy and Product Profitability; the Business Plan explicitly asks teams to quantify risk and build a financial model. [^pragmatic-framework] |
| **Product-led growth authors / ProductLed, Wes Bush and Ramli John** -- [*Product-Led Onboarding*](https://productled.com/book/onboarding), [*Time to Value*](https://productled.com/blog/time-to-value) (books/practitioner site) | **value perception, value realization, value adoption, time-to-value, friction, value metric** | **Value:** measure when users perceive, experience and adopt meaningful value. **Usability:** reduce friction and shorten the path to value. **Feasibility:** generally outside the PLG framework and left to normal engineering/product work. **Viability:** connect experienced customer value to upgrade/conversion, pricing and value metrics. PLG is principally a value/adoption/growth system rather than a complete product-risk taxonomy. [^productled-onboarding][^productled-time-to-value] |
| **McKinsey** -- [*Accelerating customer-centric innovation in medtech*](https://www.mckinsey.com/industries/life-sciences/our-insights/accelerating-customer-centric-innovation-in-medtech) and [*CX without design only gets you halfway*](https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/cx-without-design-only-gets-you-halfway) (consultancy articles) | **customer desirability, business viability, technical feasibility** | **Value/usability:** customer research and rapid prototypes establish need/desire and experience. **Feasibility:** examine whether the solution can technically be delivered. **Viability:** consider the business case and economics. McKinsey describes an idea as ready for MVP development when customer desirability, business viability, and technical feasibility converge. [^mckinsey-medtech][^mckinsey-cx] |
| **BCG / BCG X** -- [*Placing Desirability at Center of Innovation*](https://www.bcg.com/x/the-multiplier/placing-desirability-at-center-of-innovation) (consultancy/practitioner article) | **"Four Lenses for Validation"**: **Desirability, Viability, Feasibility, Strategic Fit** | **Value/usability -> desirability:** test attractiveness to customers. **Feasibility:** evaluate technical and operational feasibility. **Viability:** estimate revenue potential, business model, market/pricing and financial outlook. BCG adds **Strategic Fit** to test whether the opportunity fits the corporation's capabilities and advantages. [^bcg-four-lenses] |
| **Productboard** -- [*Guide: Product Discovery Process & Techniques*](https://www.productboard.com/blog/step-by-step-framework-for-better-product-discovery/) (product-company practitioner blog) | Directly adopts Cagan's **value risk, usability risk, feasibility risk, business viability risk** | Productboard uses discovery to reduce these risks, then uses qualitative and quantitative research, ideation, prototypes, and testing through a Double Diamond-style process. Its terminology is a direct adoption of SVPG rather than an independent taxonomy. [^productboard-discovery] |
| **Mind the Product, practitioner example** -- [*Should you really be using machine learning?*](https://www.mindtheproduct.com/should-you-really-be-using-machine-learning/) (PM media/practitioner article) | **five product risks**: **value, usability, feasibility, viability, ethics** | The article extends the Cagan structure with a distinct ethical question, then asks concrete questions in each category to decide whether ML is appropriate. This is an article-level practitioner extension, not evidence of a universal Mind the Product house taxonomy. [^mindtheproduct-ml] |

> **Decision rationale:** This inventory shows that similar concerns are organized around different managed objects. It supports the synthesis, but the full survey belongs here because it would interrupt the canonical path from definitions to workflow.

Two patterns dominate this comparison.

First, **SVPG is one of the few prominent frameworks that deliberately keeps Value and Usability separate**. IDEO, NN/g, McKinsey and similar design-oriented frameworks usually put both under **Desirability**. Cagan says this separation became important to him particularly in B2B products, where the person deciding whether to buy a product and the person required to use it can be different people with different criteria. [^svpg-taxonomy]

> **Decision rationale:** This pattern supports keeping **Value** and **Usability** separate in the canonical taxonomy, especially where buyer and user are different people.

Second, several practitioners have shifted attention from naming broad categories to identifying the **specific belief that could be wrong**. Torres is the clearest example: an assumption is a belief that must hold for an idea to succeed, and the team should surface many such assumptions, rank them by risk, and test the important ones. Google Design Sprints similarly decomposes assumptions and converts them into sprint questions, while Lean Startup expresses uncertain beliefs as measurable hypotheses. [^torres-five][^google-assumptions][^lean-method]

> **Decision rationale:** This pattern supports making the concrete assumption, rather than the broad risk category, the atomic discovery artifact. Together, the two patterns separate coverage from unit of work.

## Alternative taxonomies and why they differ

### Desirability, feasibility, viability


The closest widespread alternative to SVPG is:

> **Desirability · Feasibility · Viability**

IDEO explicitly frames design thinking around what is desirable for people, feasible with technology, and viable for organizations. NN/g uses essentially the same DVF model, and McKinsey uses customer desirability, technical feasibility, and business viability in innovation work. [^ideo-design-thinking][^nng-triad][^mckinsey-medtech]

The mapping is approximately:

| SVPG | Three-lens design model |
|---|---|
| Value | **Desirability** |
| Usability | **Desirability** |
| Feasibility | **Feasibility** |
| Business viability | **Viability** |

This consolidation is intentional. NN/g, for example, defines desirability in terms of user value and says a desirable product must be **useful and usable**. SVPG's explanation of the competing taxonomies likewise says IDEO's desirability combines customer value and usability. [^nng-triad][^svpg-taxonomy]

The three-lens model has a clear advantage: it is compact and works well as an innovation or concept-evaluation model. The tradeoff is loss of diagnostic precision. A concept can solve a valuable problem while still having an unusable workflow. That distinction becomes especially useful in B2B, internal tools and other settings where buyers, administrators, approvers and end users are different people. This latter argument is also Cagan's stated rationale for retaining separate Value and Usability categories. [^svpg-taxonomy]

> **Decision rationale:** This is the nearest competing coverage model, so it makes the cost of merging Value and Usability explicit. The canonical synthesis chooses diagnostic precision over compactness.

### Five assumption categories


Teresa Torres' taxonomy is structurally close to SVPG but changes both the labels and the object being classified:

> **Desirability assumptions · Viability assumptions · Feasibility assumptions · Usability assumptions · Ethical assumptions**

Here, an item on the team's board is not normally "the viability risk." The team asks what specifically has to be true about economics, behavior, technology, workflow or harm for an idea to work. [^torres-five]

This distinction is operationally important. Torres explicitly argues that describing a solution as having "viability risk" leaves the test ambiguous; enumerating viability assumptions gives the team something concrete to evaluate. Her workflow uses story maps to expose desirability, usability and feasibility assumptions, traces an Opportunity Solution Tree to find viability assumptions, intentionally explores potential harm, and then prioritizes assumptions for testing. [^torres-five][^torres-assumption-testing]

The distinction can be summarized this way:

**SVPG:** "Has every important kind of product risk been covered?"

**Torres:** "What exactly is being assumed, and which assumption should be tested next?"

Those are complementary questions, not competing ones. This is an analytical synthesis of the two methods. [^svpg-taxonomy][^torres-five]

> **Decision rationale:** This is the bridge between SVPG and Torres: dimensions provide coverage, while assumptions provide testable propositions. That complementarity, rather than either framework alone, is the basis for the canonical synthesis.

### Desirability, feasibility, viability, ethicality


Roman Pichler's framework is:

> **Desirability · Feasibility · Viability · Ethicality**

He calls them **product success factors**, while in strategy-discovery work he talks about **strategy risks** within the same four areas. His validation loop starts with the most important uncertainty, applies an appropriate research method such as interviews, observation, a throwaway prototype or business-model analysis, uses the resulting evidence to change or retain the strategy, and repeats until the remaining significant risks have been addressed. [^pichler-success][^pichler-strategy]

Its conceptual difference from SVPG is revealing:

| Concern | SVPG | Pichler |
|---|---|---|
| Customer/user value | Value | Desirability |
| Ease/effectiveness of use | Usability as top level | Included within the product/user proposition rather than a separate top-level strategy factor |
| Can it be delivered? | Feasibility | Feasibility |
| Does it work economically/organizationally? | Business viability | Viability |
| Could it harm people/society/environment? | Usually embedded in viability | Ethicality as top level |

The choice reflects the **level at which the framework is being used**. Pichler is often validating product strategy; Cagan's taxonomy is heavily used during solution discovery. At a strategy level, ethics may deserve a separate gate while detailed interaction usability can sit lower in the decomposition. [^pichler-success][^pichler-strategy][^svpg-taxonomy]

> **Decision rationale:** Pichler shows that category choice changes with the level of analysis. His strategy model explains why Ethics may rise and Usability may be nested, but it does not replace the canonical solution-level model.

### Value and growth hypotheses


Lean Startup takes a different route. Its core categories are not four product properties. It asks teams to identify risky assumptions, express important ones as hypotheses, build the smallest useful experiment or MVP, measure real behavior, and generate **validated learning**. Its named high-level hypotheses are particularly **value hypotheses** and **growth hypotheses**. [^lean-method]

That means there is no clean one-to-one mapping:

- **Value** is directly represented by the value hypothesis.
- **Viability** is partly covered through value, growth, adoption and business-model economics.
- **Usability** can be a hypothesis that affects customer behavior, but it is not a canonical top-level Lean Startup category.
- **Feasibility** can likewise be tested through experiments or prototypes, but core Lean Startup terminology does not elevate it to a named sibling of value and growth. [^lean-mvp][^lean-method]

Lean Startup is therefore better understood as a **learning architecture** than as a completeness checklist.

> **Decision rationale:** Lean Startup is retained to prevent a false one-to-one taxonomy mapping. It contributes an evidence-and-learning loop, not a complete checklist of solution failure modes.

### Corporate innovation variants


BCG X shows why taxonomies change with context. Its "Four Lenses for Validation" are **Desirability, Viability, Feasibility, and Strategic Fit**. The extra question is whether a venture has synergies or advantages within the sponsoring company. [^bcg-four-lenses]

That suggests a useful general principle: the fourth or fifth category often exposes the failure mode that a particular organization is most prone to overlook. SVPG separated business viability because customer value could crowd it out. Torres and Pichler expose ethics because harm can disappear inside an overly broad business category. BCG exposes strategic fit because corporate venture ideas can look attractive in isolation while making little sense for the parent company. This is an inference from how the respective authors explain their taxonomies. [^svpg-taxonomy][^torres-five][^pichler-success][^bcg-four-lenses]

> **Decision rationale:** These variants support a general rule: an extra category is an attention mechanism for a failure mode the host organization tends to hide. That rule helps justify explicit Ethics without claiming that five categories are universal.

A compact comparison makes the pattern clearer:

| Framework | Customer value | Usability separate? | Feasibility | Business viability | Additional first-class concern |
|---|---:|---:|---:|---:|---|
| SVPG | **Value** | **Yes** | Feasibility | Business viability | Ethics embedded in viability |
| IDEO / NN/g | **Desirability** | No; under desirability | Feasibility | Viability | -- |
| Teresa Torres | **Desirability assumptions** | **Yes** | Feasibility assumptions | Viability assumptions | **Ethical assumptions** |
| Roman Pichler | **Desirability** | No separate strategy factor | Feasibility | Viability | **Ethicality** |
| Lean Startup | **Value hypothesis** | No named category | No named category | Partly value/growth/business model | **Growth hypothesis** |
| BCG X | **Desirability** | No | Feasibility | Viability | **Strategic fit** |

The practical lesson is that there are **two independent design choices** in any taxonomy:

1. **Coverage:** Which classes of failure deserve an explicit category?
2. **Unit of work:** Are the managed objects lenses, risks, assumptions, hypotheses, questions, or experiments?

Much of the apparent disagreement between practitioners disappears once those two choices are separated. [^svpg-taxonomy][^torres-five][^lean-method][^bcg-four-lenses]

> **Decision rationale:** This is the comparison's main analytical result. The canonical model makes the two choices separately: five dimensions for coverage and concrete assumptions for the unit of work.

## Source context and evolution


The terminology evolved over time, which explains some apparent contradictions between articles.

| Period | SVPG | Teresa Torres |
|---|---|---|
| **2017** | Cagan formalizes four risks: value, usability, feasibility, and business viability. [^5] | Torres had already introduced the Opportunity Solution Tree in 2016 as a representation of desired outcomes, opportunities, solutions, and experiments. [^12] |
| **2020** | Cagan says ethics is normally within viability but argues for explicitly considering a fifth "should this be built?" ethical risk. [^6] | Torres's continuous-discovery material is increasingly explicit about opportunity-space prioritization and customer framing. [^13] |
| **2021** | SVPG continues emphasizing the four product risks in discovery. [^14] | *Continuous Discovery Habits* codifies the sequence: outcome -> interviews/opportunities -> assumption testing/solutions, centered around the OST. [^15] |
| **2023** | SVPG explicitly calls the four categories a **product risk taxonomy** and says ethics, compliance, and go-to-market can sit within viability. [^10] | Torres publishes her five assumption types and directly compares them with Cagan's four risks, saying the concepts are largely the same while arguing that assumptions are easier to test. [^1] |
| **2025-2026** | SVPG sharpens discovery as "build to learn," with most attention on finding a solution that clears the four risks and produces the outcome. [^16][^11] | Product Talk continues to use outcome -> opportunity -> solution -> assumption tests and the five assumption categories, including ethics. [^17][^18] |

This history matters because neither framework is a static four-box or five-box checklist. SVPG increasingly describes the four risks as a **conceptual model for evaluating potential solutions**, while Torres embeds nearly equivalent concerns inside a broader continuous decision system. [^10][^16][^19]

> **Decision rationale:** The chronology is retained to reconcile changing source language and apparent contradictions. It comes after the conceptual comparison because history explains the terminology but does not determine the operating model.

## Citation references


> **Source limitation:** The numbered `turn...` references preserve provenance from the original research session but are not portable citations. The linked references below are the independently usable bibliography.

[^1]: Source reference: `turn8view0`

[^2]: Source reference: `turn4view5`

[^3]: Source reference: `turn3view2`

[^4]: Source reference: `turn6search0`

[^5]: Source reference: `turn4view0`

[^6]: Source reference: `turn9view0`

[^7]: Source reference: `turn9view3`

[^8]: Source reference: `turn3view1`

[^9]: Source reference: `turn4view4`

[^10]: Source reference: `turn3view6`

[^11]: Source reference: `turn9view1`

[^12]: Source reference: `turn0search12`

[^13]: Source reference: `turn11view2`

[^14]: Source reference: `turn2search3`

[^15]: Source reference: `turn8view1`

[^16]: Source reference: `turn3view9`

[^17]: Source reference: `turn1search4`

[^18]: Source reference: `turn11view0`

[^19]: Source reference: `turn8view4`

[^20]: Source reference: `turn0search17`

[^21]: Source reference: `turn4view2`

[^22]: Source reference: `turn4view3`

[^23]: Source reference: `turn4view6`

[^24]: Source reference: `turn2search2`

[^25]: Source reference: `turn5search15`

[^26]: Source reference: `turn8view3`

[^27]: Source reference: `turn10search1`

[^28]: Source reference: `turn2search13`

[^29]: Source reference: `turn4view1`

[^30]: Source reference: `turn3view3`

[^31]: Source reference: `turn8view5`

[^32]: Source reference: `turn3view7`

[^33]: Source reference: `turn11view1`

[^34]: Source reference: `turn8view2`

[^35]: Source reference: `turn5search26`

[^36]: Source reference: `turn6search5`

## References


> **Decision rationale:** This bibliography remains separate from the internal reference list because these links are reader-usable evidence rather than session-local provenance markers.

[^svpg-taxonomy]: [SVPG, "Product Risk Taxonomy."](https://www.svpg.com/product-risk-taxonomies/)

[^torres-five]: [Teresa Torres / Product Talk, "Evaluating Solutions: The 5 Types of Assumptions that Underlie Our Ideas."](https://www.producttalk.org/five-types-of-assumptions/)

[^pichler-success]: [Roman Pichler, "Four Product Success Factors."](https://www.romanpichler.com/blog/four-product-success-factors/)

[^ideo-design-thinking]: [IDEO, "Design Thinking."](https://designthinking.ideo.com/)

[^lean-method]: [Lean Startup, "Lean Startup Method 101."](https://leanstartup.co/resources/articles/lean-startup-method/)

[^iso-31000]: [ISO, "The new ISO 31000 keeps risk management simple."](https://www.iso.org/news/ref2263.html)

[^torres-assumption-testing]: [Teresa Torres / Product Talk, "Assumption Testing: Everything You Need to Know to Get Started."](https://www.producttalk.org/assumption-testing/)

[^svpg-ethics]: [Marty Cagan / SVPG, "Coaching - Ethics."](https://www.svpg.com/coaching-ethics/)

[^mindtheproduct-ml]: [Mind the Product, "Should you really be using machine learning?"](https://www.mindtheproduct.com/should-you-really-be-using-machine-learning/)

[^google-assumptions]: [Google Design Sprint Kit, "Assumptions Mapping."](https://designsprintkit.withgoogle.com/methodology/phase2-define/assumptions-mapping)

[^pragmatic-framework]: [Pragmatic Institute, "Pragmatic Framework."](https://www.pragmaticinstitute.com/product/framework/)

[^svpg-four]: [Marty Cagan / SVPG, "The Four Big Risks."](https://www.svpg.com/four-big-risks/)

[^svpg-build-to-learn]: [SVPG, "Build To Learn FAQ."](https://www.svpg.com/build-to-learn-faq/)

[^pichler-strategy]: [Roman Pichler, "Product Strategy Discovery."](https://www.romanpichler.com/blog/product-strategy-discovery/)

[^google-validate]: [Google Design Sprint Kit, "Validate."](https://designsprintkit.withgoogle.com/methodology/phase6-validate)

[^lean-mvp]: [Lean Startup, "What Is an MVP?"](https://leanstartup.co/resources/articles/what-is-an-mvp/)

[^nng-discovery]: [Nielsen Norman Group, "Discovery: Definition."](https://www.nngroup.com/articles/discovery-phase/)

[^nng-triad]: [Nielsen Norman Group, "The Product Triad: Design's Role."](https://www.nngroup.com/articles/the-product-triad-designs-role/)

[^nng-prioritization]: [Nielsen Norman Group, "5 Prioritization Methods in UX Roadmapping."](https://www.nngroup.com/articles/prioritization-methods/)

[^productled-onboarding]: [ProductLed, "Product-Led Onboarding."](https://productled.com/book/onboarding)

[^productled-time-to-value]: [ProductLed, "Time to Value."](https://productled.com/blog/time-to-value)

[^mckinsey-medtech]: [McKinsey & Company, "Accelerating customer-centric innovation in medtech."](https://www.mckinsey.com/industries/life-sciences/our-insights/accelerating-customer-centric-innovation-in-medtech)

[^mckinsey-cx]: [McKinsey & Company, "CX without design only gets you halfway."](https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/cx-without-design-only-gets-you-halfway)

[^bcg-four-lenses]: [BCG X, "Placing Desirability at Center of Innovation."](https://www.bcg.com/x/the-multiplier/placing-desirability-at-center-of-innovation)

[^productboard-discovery]: [Productboard, "Guide: Product Discovery Process & Techniques."](https://www.productboard.com/blog/step-by-step-framework-for-better-product-discovery/)

[^torres-aug-2026]: [Teresa Torres / Product Talk, "Ch. 9: Identifying Hidden Assumptions," August 3, 2026.](https://www.producttalk.org/cdh-book-club-august-2026/)

[^nng-usability]: [Nielsen Norman Group, "Usability (User) Testing 101."](https://www.nngroup.com/articles/usability-testing-101/)
