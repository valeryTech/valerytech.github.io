---
draft: false
toc: true
title: "Discovery Delivery Practitioner Evidence"
linkTitle: "Discovery Delivery Practitioner Evidence"
---
# Practitioner evidence about discovery and delivery


> **Editorial note:** The title, section headings, bridges, and comments in this file are editorial. The passages between the source markers come from `HEAD:ai/product-model/in/discovery-deliery-separation.md`. Their wording has been edited for grammar and flow. The edits are intended to preserve the original claims. The citations are unchanged. This is supporting material, not the definition of the operating model.

## Purpose of the work


<!-- source-unit: DDS-02; source-lines: 4 -->

The clearest formulation in these sources appears in a Marty Cagan article published in April 2026: **"Build to Learn vs Build to Earn."** He applies the distinction directly to AI. In discovery, teams build prototypes to reduce value, usability, feasibility, and viability risks. In delivery, they build commercial software that must meet reliability, scale, performance, privacy, security, operations, and other production requirements. He also stresses that discovery and delivery are concurrent types of work, not sequential departments. ([Silicon Valley Product Group](https://www.svpg.com/build-to-learn-vs-build-to-earn/ "Build to Learn vs Build to Earn - Silicon Valley Product Group : Silicon Valley Product Group"))

<!-- end-source-unit: DDS-02 -->

> **Editorial comment:** The source called this a "newer" article, but it did not include the earlier item used for that comparison. The publication date is kept instead.

<!-- source-unit: DDS-03; source-lines: 6-19 -->

That gives a useful model:

| |Discovery: build to learn|Delivery: build to earn|
|---|---|---|
|Goal|Learn whether and how to solve something|Operate a solution that customers depend on|
|AI's advantage|Generate alternatives at extremely low cost|Speed up engineering work with a limited scope|
|Artifact|Prototype, spike, simulation, experiment|Production system|
|Code lifetime|Hours, days, or weeks|Years|
|Acceptable shortcuts|Many|Very few|
|Testing asks|"Have we learned enough?"|"Can we depend on this?"|
|AI autonomy|High autonomy can be reasonable|Depends heavily on how far the effects of a failure could spread|
|Human expertise|Problem framing and product judgment|Architecture, correctness, operations, and security|
|Failure|Learning at low cost|An incident, data loss, debt, or customer harm|
|Default fate of code|Delete it|Maintain it|
<!-- end-source-unit: DDS-03 -->

> **Editorial comment:** The goal row states the main distinction. The other rows show common patterns, not rules. Discovery can use production code and sensitive data, and its failures are not always cheap. Delivery can also use short-lived code. "Build to operate" is broader than "build to earn" because the model also covers internal and non-commercial products.

## An organization using prototypes


<!-- source-unit: DDS-04; source-lines: 21 -->

Several practitioners have arrived at the same distinction independently.

<!-- end-source-unit: DDS-04 -->

> **Editorial comment:** This sentence introduces the examples that follow. The independence of their conclusions was not checked during this rearrangement.

<!-- source-unit: DDS-05; source-lines: 23-27 -->

**Uber's product organization provides a concrete company example.** In April 2026, Uber published an account of its experience with AI prototyping. Its teams use Claude Code, Cursor, Figma Make, and similar tools to explore several solutions, help stakeholders reach a shared view, and clarify the scope of a minimum viable product _before making an engineering commitment_. One team explored six concepts in about 20 minutes. Another reported that two hours of prototyping resolved four weeks of discussion. ([Uber](https://www.uber.com/gb/en/blog/ai-prototyping/ "AI Prototyping Is Changing How We Build Products at Uber"))

Uber explicitly draws the same boundary. It describes AI prototypes as tools for testing assumptions and gathering feedback before decisions become hard to change. It recommends more caution with mature, external, compliance-sensitive, or dependency-heavy products. It explicitly says that it is still deciding how prototypes should inform engineering **without being mistaken for shippable solutions**, because "production requires rigor." ([Uber](https://www.uber.com/gb/en/blog/ai-prototyping/ "AI Prototyping Is Changing How We Build Products at Uber"))

This example is more useful to the model than a code-output claim such as "developers produced 40% more code."

<!-- end-source-unit: DDS-05 -->

> **Editorial comment:** Here, "engineering commitment" is best understood as a commitment to build and support a production solution. Engineers already take part in discovery. The reported times are examples from one organization, not general measures of improvement.

## AI used during product work


<!-- source-unit: DDS-10; source-lines: 92 -->

**Teresa Torres provides an example of using AI experimentally during discovery.** She used Claude and ChatGPT while developing an AI product. She compared Claude's analysis with her own earlier analysis of 15 interviews. Claude found points that she had missed, but it also missed important opportunities that she had found. She concluded that it was a useful thought partner but was not ready to replace her own synthesis. ([Product Talk](https://www.producttalk.org/ai-playbook/ "Building My First AI Product: 6 Lessons from My 90-Day Deep Dive"))

<!-- end-source-unit: DDS-10 -->

> **Editorial comment:** This example supports using AI to extend human analysis without giving it the final decision. The following paragraph in the source concerns evaluation. It is preserved separately in [`discovery-delivery-evaluation-evidence-deferred.md`]({{< ref "ai/operating-model/working-notes/discovery-delivery-evaluation-evidence-deferred" >}}).

<!-- source-unit: DDS-12; source-lines: 96-114 -->

This example shows AI in an exploratory role:

```text
AI in Discovery

Generate
   ↓
Compare
   ↓
Challenge human assumptions
   ↓
Explore alternatives
   ↓
Test with users and data
   ↓
A person decides
```


This is a natural fit for probabilistic systems. Several unusual answers can be useful because the goal is to expand and test the range of possible solutions.

<!-- end-source-unit: DDS-12 -->

<!-- source-unit: DDS-13; source-lines: 116-136 -->

Production work has almost the opposite objective:

```text
AI in Delivery

Intent
  ↓
Constrain
  ↓
Implement
  ↓
Verify
  ↓
Review
  ↓
Observe in production
  ↓
A human or system accepts responsibility
```


Variation that was useful during discovery becomes a source of risk.

<!-- end-source-unit: DDS-13 -->

> **Editorial comment:** These two diagrams are the source author's synthesis. They are not definitions taken from the Torres example. "Almost the opposite" describes a change in the main purpose of the work. It does not mean that discovery can ignore validity or that a production AI system cannot use controlled variation. The passages also move between AI as a tool for the team and AI behavior in the product. These are separate subjects. A system can enforce controls, but people and the organization remain responsible.

## Engineering responsibility


<!-- source-unit: DDS-06; source-lines: 29-31 -->

**Simon Willison makes almost exactly the same distinction from the engineering side.** His terms are _vibe coding_ versus _agentic engineering_. Vibe coding is acceptable when the consequences are small, such as for a personal tool whose bugs affect only its creator. Production engineering involves security, maintainability, operations, and performance, and the professional engineer remains accountable for the result. ([Simon Willison's Weblog](https://simonwillison.net/2026/May/6/vibe-coding-and-agentic-engineering/ "Vibe coding and agentic engineering are getting closer than I'd like"))

One useful point is that AI can now generate a repository with extensive tests, documentation, and commit history so quickly that these signals no longer show how much engineering care went into the work. Willison increasingly values evidence that the software has actually been put through real use over time. ([Simon Willison's Weblog](https://simonwillison.net/2026/May/6/vibe-coding-and-agentic-engineering/ "Vibe coding and agentic engineering are getting closer than I'd like"))

<!-- end-source-unit: DDS-06 -->

<!-- source-unit: DDS-07; source-lines: 33-58 -->

This suggests another way to look at AI use:

```text
                AI usefulness

Discovery      █████████████████████
               low-cost exploration
               many alternatives
               disposable output

Implementation ███████████████
               tasks with limited scope
               tests and refactoring
               boilerplate

Engineering    ████████
               requires judgment
               architecture and trade-offs

Production     ████
               real-world use reveals quality
               reliability, security, and operations
               long-term change
```


The bar lengths are not based on measurements. The overall shape reflects what the practitioner evidence suggests.

<!-- end-source-unit: DDS-07 -->

> **Editorial comment:** This is a working hypothesis, not a measured scale. It also compares different kinds of categories. Discovery and production describe purposes or operating conditions. Implementation and engineering describe kinds of work. This chart alone should not determine how much autonomy AI receives.

<!-- source-unit: DDS-08; source-lines: 60-64 -->

**Kent Beck's "augmented coding" framing fits the delivery side.** He distinguishes simply accepting generated output from using AI while retaining TDD, design control, and architectural judgment. In his experiments, he had to catch design drift, reject shortcuts such as disabled tests, and stop the agent from adding unnecessary functionality. His point is essentially that AI can contribute production code, but the AI model itself does not provide engineering discipline. ([Kent Beck](https://kentbeck.com/summaries/augmented-coding-beyond-the-vibes/ "Augmented Coding: Beyond the Vibes -- Kent Beck"))

This is an important correction to "agents write bad code." A more precise claim is:

> Agents are unusually good at generating implementations, but unusually weak at deciding which implementation decisions should survive for years.
<!-- end-source-unit: DDS-08 -->

<!-- source-unit: DDS-09; source-lines: 66-90 -->

Unusually concrete evidence comes from **Erik Doernenburg at Thoughtworks**. He had Claude Code and Windsurf add GitLab support to an existing Swift application. He then inspected the resulting code instead of only checking whether the feature worked. ([martinfowler.com](https://martinfowler.com/articles/exploring-gen-ai/ccmenu-quality.html "Assessing internal quality while coding with an agent"))

The agent repeatedly produced code that worked but made the design worse. It used empty strings instead of meaningful optional values, proposed an unnecessary cache, added complexity to address a GitLab problem that did not exist, duplicated URL construction, and failed to preserve subtle existing behavior. Doernenburg concluded that, without careful oversight, agents tended to introduce technical debt even while delivering the requested functionality. ([martinfowler.com](https://martinfowler.com/articles/exploring-gen-ai/ccmenu-quality.html "Assessing internal quality while coding with an agent"))

This is an excellent example of why a software engineering benchmark can mislead management:

```text
Agent evaluation:

✓ requirement implemented
✓ code compiles
✓ tests pass

Experienced engineer evaluation:

✓ requirement implemented
✓ code compiles
✓ tests pass
✗ semantics degraded
✗ unnecessary complexity
✗ existing abstractions ignored
✗ future cost increased
```


The benchmark reports success. The maintainer inherits the damage.

<!-- end-source-unit: DDS-09 -->

> **Editorial comment:** These examples show why working code and passing tests are not enough to judge internal quality. They do not prove that every agent, repository, or task follows the same failure pattern. The blockquote above is the source author's inference from the examples.

## Reading list


<!-- source-unit: DDS-24; source-lines: 259 -->

A useful reading order begins with Cagan's **Build to Learn vs Build to Earn** and **Prototypes vs Products** for the model. Uber shows actual organizational practice. Doernenburg provides a concrete analysis of a production-code failure. Willison and Beck explain the engineering distinction. Torres provides a disciplined example of AI-assisted discovery and evaluation. ([Silicon Valley Product Group](https://www.svpg.com/prototypes-vs-products/ "Prototypes vs Products - Silicon Valley Product Group : Silicon Valley Product Group"))

<!-- end-source-unit: DDS-24 -->

> **Editorial comment:** This is the source author's suggested reading order. The citations remain with the claims, but their accuracy was not checked during this rearrangement. The Torres evaluation passage is in [`discovery-delivery-evaluation-evidence-deferred.md`]({{< ref "ai/operating-model/working-notes/discovery-delivery-evaluation-evidence-deferred" >}}).
