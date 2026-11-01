---
draft: false
toc: true
title: "Product Model Actions"
description: "A product-management research agenda combines reference links with a critique of Cagan’s model, emphasizing decision authority, strategic constraints, deployability, and context when adapting it to AI engineering."
linkTitle: "Actions"
---

Understand common product management concepts, practices, and language so that explanations of the framework align with established terminology.

For example, Marty Cagan's normative model could serve as a reference.

Resurces:

- https://www.svpg.com/ai-resource-guide/
- https://www.svpg.com/build-to-learn-vs-build-to-earn/
- https://www.svpg.com/four-big-risks/
- https://www.svpg.com/the-product-operating-model-an-introduction/
- https://www.svpg.com/discovery-problem-vs-solution/

other

- https://blog.logrocket.com/product-management/product-discovery-vs-delivery/
- https://www.thoughtworks.com/en-us/insights/decoder/d/dual-track-development
- https://www.thoughtworks.com/en-us/insights/blog/understanding-how-design-thinking-lean-and-agile-work-together
- https://www.productboard.com/glossary/product-prioritization-frameworks/
- interesting: Tim Herbig article on [Product Discovery](https://herbig.co/product-discovery/):
- as well interesting https://herbig.co/product-discovery-problem-space/

Personalities: Teresa Torres;

- https://medium.com/@amydunn92/1-the-two-phases-discovery-and-delivery-81d42ccc5e6c

This article from Mind the Product discusses how to decide [when to apply discovery, delivery, or both](https://www.mindtheproduct.com/product-discovery-or-product-delivery-how-do-you-decide/). It presents a helpful concept, the Uncertainty Rubric. Answer the questions below, then review the rubric to determine the position on the certainty scale. See also the [Product Discovery Playbook](https://www.productboard.com/wp-content/uploads/2021/03/The-Product-Discovery-Playbook.pdf).

## "Inspired" critique from perplexity


Resources:

- https://www.reddit.com/r/ProductManagement/comments/1mo26vv/why_is_this_sub_so_sour_about_marty_cagan/ <- this one is important

_Inspired_ is valuable as a **normative model** of empowered product teams, but it is often too Silicon Valley-centric, under-specified about organizational power, and weak on contexts where discovery is expensive, constrained, or not the main bottleneck (?).

### The strongest critique


|Claim in _Inspired_|What is useful|Where it breaks down|
|---|---|---|
|Empower teams to solve customer problems, not merely ship feature requests|Correctly rejects ticket-factory product development|Teams cannot be genuinely empowered if strategy, incentives, budgets, architecture, or sales commitments remain centralized|
|Continuous discovery prevents building the wrong thing|Strong default for consumer and SaaS products|Discovery is much harder in enterprise, regulated, hardware, infrastructure, internal-platform, and procurement-driven products|
|PM, design, and engineering should collaborate closely|A healthy antidote to sequential handoffs|It can blur accountability; someone must still make hard calls about sequencing, economics, risk, and organizational trade-offs|
|Good product teams own outcomes|Shifts attention from output to impact|Many outcomes are not attributable to one team: pricing, distribution, brand, sales execution, market timing, and platform shifts matter enormously|
|Great teams resemble the best tech companies|Provides a compelling aspirational standard|It can turn into "copy Spotify/Netflix/Silicon Valley" without accounting for company stage, talent density, funding, or market structure|

### Main limitations


1. **It describes the destination better than the transition.**
    Cagan is excellent at showing what a capable product organization looks like, but comparatively less concrete on how a company with legacy architecture, contractual delivery commitments, weak research capacity, or command-and-control leadership gets there. A team cannot simply adopt empowerment through ceremony.
2. **It assumes unusually favorable conditions.**
    The model implicitly benefits from stable, cross-functional teams; skilled product/design/engineering counterparts; accessible customers; leadership willing to delegate; and enough slack for experimentation. Those are scarce conditions, not defaults.
3. **The framework can become product-management theater itself.**
    Teams may run interviews, opportunity assessments, prototype tests, OKRs, and discovery rituals while avoiding the core question: _was the bet strategically sound, and did it work economically?_ Process compliance is not product judgment.
4. **"Customer value" can be too narrow a decision criterion.**
    Particularly in B2B and AI infrastructure, a product can be valuable and usable yet fail due to integration burden, security review, data governance, switching costs, procurement, deployment reliability, or poor go-to-market fit. Cagan's value/usability/feasibility framing is useful, but often needs **viability**, distribution, trust, and operational ownership added explicitly. The book itself emphasizes validating value, usability, feasibility, and stakeholder support, but real-world adoption has more constraints than those categories capture.[[maa1.medium](https://maa1.medium.com/book-review-inspired-how-to-create-tech-products-customers-love-4fc8e8f26739)]
5. **It risks underselling strategy.**
    Discovery helps decide _how_ to solve a problem. It does not reliably determine _which market, wedge, capability, or business model_ is worth pursuing. Customers can explain pain and evaluate prototypes; they are less reliable guides to non-obvious strategic moves, platform shifts, or category creation.
6. **It is relatively weak for technical products.**
    For developer platforms, ML systems, data infrastructure, and APIs, technical architecture can create or eliminate entire product options. "Can engineers build it?" is not a late validation check. It often shapes the strategy from the start. Technical constraints, reliability SLOs, evaluation quality, cost curves, and ecosystem compatibility should be first-class discovery dimensions.
7. **Its presentation can feel prescriptive and repetitive.**
    Reviews have noted Silicon Valley jargon, prescriptions that lack sufficient reasoning, and an overprocessed writing style. Another critique says the book's chapter organization does not build the argument clearly, despite valuable content.[[pmbookreview](https://www.pmbookreview.com/p/review-inspired-marty-cagan)][[jonathanduchcom.wordpress](https://jonathanduchcom.wordpress.com/2018/06/29/book-review-inspired-how-to-create-tech-products-customers-love-by-marty-cagan/)]

### A better interpretation for AI/ML products


For an AI product, Cagan's framework can be translated into:

```
\text{Product bet} =
\text{desirable} \land
\text{usable} \land
\text{technically feasible} \land
\text{economically viable} \land
\text{safe/trustworthy} \land
\text{deployable}
```


"Deployable" matters: can the customer connect data, pass security, evaluate outputs, operate the system, and realize value in their workflow?

For example, a RAG copilot can test well in a prototype and still fail in production because retrieval quality varies by corpus, citations are inadequate, latency is too high, permissioning leaks information, or users cannot tell when to trust it. Those are not merely engineering delivery details; they determine whether there is a product.

### Bottom line


Read _Inspired_ as a critique of feature factories and a vocabulary for healthier product teams, not as a universally applicable operating manual. It is likely most useful for early-to-mid-career PMs or organizations that lack product fundamentals; more experienced builders may find it clarifies and validates existing instincts rather than offering radically new insight.[[linkedin](https://www.linkedin.com/posts/himanshu-sharma-a8ba3385_bookreview-inspired-martycagan-activity-7342538967222738944-o3ET)]

The practical question is not whether the team is empowered like a Cagan team. It is: **what decisions can this team truly own, what evidence is affordable to obtain, and what non-customer constraints determine whether this product can succeed?**
