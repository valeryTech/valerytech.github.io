---
draft: false
toc: true
title: "Separating Discovery and Delivery"
description: "An earlier source-backed argument for separating learning prototypes from enduring production commitments, deriving different AI-platform needs from concurrent discovery and delivery responsibilities."
linkTitle: "Separation"
---

Working interpretation: **Discovery vs Delivery is a better model than "citizens / agents / experts."** It describes the purpose and risk of the work instead of assigning capabilities to roles.

The strongest formulation I found is actually a newer Marty Cagan piece from April 2026: **"Build to Learn vs Build to Earn."** He explicitly applies the distinction to AI. Discovery builds prototypes to reduce value, usability, feasibility and viability risk. Delivery builds commercial software that has to satisfy reliability, scale, performance, privacy, security, operations and other production constraints. He also stresses that these are concurrent modes of work, not sequential departments. ([Silicon Valley Product Group](https://www.svpg.com/build-to-learn-vs-build-to-earn/ "Build to Learn vs Build to Earn - Silicon Valley Product Group : Silicon Valley Product Group"))

That gives a useful model:

||Discovery -- build to learn|Delivery -- build to earn|
|---|---|---|
|Goal|Learn whether/how to solve something|Operate a solution customers depend on|
|AI's advantage|Generate alternatives extremely cheaply|Accelerate bounded engineering work|
|Artifact|Prototype, spike, simulation, experiment|Production system|
|Code lifetime|Hours/days/weeks|Years|
|Acceptable shortcuts|Many|Very few|
|Testing asks|"Did we learn enough?"|"Can we depend on this?"|
|AI autonomy|High can be rational|Depends heavily on blast radius|
|Human expertise|Problem framing, product judgment|Architecture, correctness, operations, security|
|Failure|Cheap learning|Incident, data loss, debt, customer harm|
|Default fate of code|Delete it|Maintain it|

That distinction is now showing up independently among several credible practitioners.

**Uber's product organization may be the best real-company example I found.** They published their experience with AI prototyping in April 2026. Their teams use Claude Code, Cursor, Figma Make, etc. to explore multiple solutions, align stakeholders and clarify MVP scope _before engineering commitment_. One team explored six concepts in about 20 minutes. Another reported that two hours of prototyping resolved four weeks of discussion. ([Uber](https://www.uber.com/gb/en/blog/ai-prototyping/ "AI Prototyping Is Changing How We Build Products at Uber"))

Uber explicitly distinguishes prototypes from production. They describe AI prototypes as tools for testing assumptions and gathering feedback before decisions harden. They recommend more caution for mature, external, compliance-sensitive or dependency-heavy products. And they explicitly say they are still working through how prototypes should inform engineering **without being mistaken for shippable solutions** because "production requires rigor." ([Uber](https://www.uber.com/gb/en/blog/ai-prototyping/ "AI Prototyping Is Changing How We Build Products at Uber"))

That is a substantially more useful enterprise story than "our developers produced 40% more code."

**Simon Willison makes almost exactly the same distinction from the engineering side.** His terms are _vibe coding_ versus _agentic engineering_. Vibe coding is acceptable when the consequences are low--for example, a personal tool whose bugs hurt only you. Production engineering involves security, maintainability, operations and performance, with the professional engineer still accountable for the result. ([Simon Willison's Weblog](https://simonwillison.net/2026/May/6/vibe-coding-and-agentic-engineering/ "Vibe coding and agentic engineering are getting closer than I'd like"))

One useful point from Willison: AI can now generate a repository with extensive tests, documentation and commit history so quickly that these signals no longer tell you how much engineering care went into it. He increasingly values evidence that the software has actually been exercised over time. ([Simon Willison's Weblog](https://simonwillison.net/2026/May/6/vibe-coding-and-agentic-engineering/ "Vibe coding and agentic engineering are getting closer than I'd like"))

That gives another dimension:

```text
                AI usefulness

Discovery      █████████████████████
               cheap exploration
               many alternatives
               disposable output

Implementation ███████████████
               bounded tasks
               tests/refactoring
               boilerplate

Engineering    ████████
               requires judgment
               architecture/tradeoffs

Production     ████
               reality determines quality
               reliability/security/operations
               long-term change
```


The exact lengths aren't empirical. The shape is what the practitioner evidence suggests.

**Kent Beck's "augmented coding" framing fits on the Delivery side.** He distinguishes accepting generated output from using AI while retaining TDD, design control and architectural judgment. In his own experiments, he had to catch design drift, reject shortcuts such as disabled tests and prevent the agent from adding unnecessary functionality. His summary is essentially: AI can contribute production code, but the engineering discipline remains external to the model. ([Kent Beck](https://kentbeck.com/summaries/augmented-coding-beyond-the-vibes/ "Augmented Coding: Beyond the Vibes -- Kent Beck"))

That is an important correction to "agents write bad code." A more precise claim is:

> Agents are unusually good at generating implementation and unusually weak at deciding which implementation decisions should survive for years.

And there is unusually concrete evidence for this from **Erik Doernenburg at Thoughtworks**. He had Claude Code/Windsurf add GitLab support to an existing Swift application and inspected the resulting code, rather than simply asking whether the feature worked. ([martinfowler.com](https://martinfowler.com/articles/exploring-gen-ai/ccmenu-quality.html "Assessing internal quality while coding with an agent"))

The agent repeatedly generated code that functionally worked while degrading the design: it replaced meaningful optionality with empty-string conventions, proposed an unnecessary cache, implemented complexity for a nonexistent GitLab problem, duplicated URL construction and missed subtle existing behavior. His conclusion was that without careful oversight, agents tended to introduce technical debt even while delivering the requested functionality. ([martinfowler.com](https://martinfowler.com/articles/exploring-gen-ai/ccmenu-quality.html "Assessing internal quality while coding with an agent"))

This is an excellent example of why a SWE benchmark can tell management the wrong story:

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


The benchmark says success. The maintainer inherits damage.

**Teresa Torres is interesting because she demonstrates the Discovery side experimentally.** She used Claude and ChatGPT while developing an AI product and tested Claude against 15 interviews she had previously analyzed herself. Claude found things she missed, but also missed important opportunities she identified. Her conclusion was that it was valuable as a thought partner and wasn't ready to replace her synthesis. ([Product Talk](https://www.producttalk.org/ai-playbook/ "Building My First AI Product: 6 Lessons from My 90-Day Deep Dive"))

She then built an evaluation system from actual production traces: human annotations, specific failure categories, LLM judges checked against human labels, separate development and larger test sets, and release decisions based on measured regressions. She also continued manually reviewing every coaching email during beta. ([Product Talk](https://www.producttalk.org/interview-coach-evals/ "How I Designed & Implemented Evals for Product Talk's Interview Coach"))

I like this example because it reveals a different role for AI:

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
Test with users/data
   ↓
Human decides
```


That is a natural fit for probabilistic systems. Multiple strange answers can be valuable because the point is expanding and testing the solution space.

Production has almost the opposite objective:

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
Human/system accepts responsibility
```


Variance that was helpful during discovery becomes risk.

There is also a good product-practitioner articulation from **Ravi Mehta**: _"The best prototypes get thrown away."_ His argument is that teams are developing two new failure modes with AI: polishing prototypes until they begin carrying production engineering cost, and generating more prototypes than they can learn from. He describes prototypes as decision-making tools and explicitly says they should not be treated as the first draft of production software. ([Ravi Mehta's Blog](https://blog.ravi-mehta.com/p/the-best-prototypes-get-thrown-away "The best prototypes get thrown away - by Ravi Mehta"))

His decomposition is useful:

- Concept prototype -> explore alternatives.
- Design prototype -> align on behavior.
- Research prototype -> observe customers.
- Technical prototype -> answer feasibility/performance/reliability questions.
- Production implementation -> separate engineering commitment. ([Ravi Mehta's Blog](https://blog.ravi-mehta.com/p/the-best-prototypes-get-thrown-away "The best prototypes get thrown away - by Ravi Mehta"))

There's an interesting nuance from **WorkOS**. Their designers sometimes prototype directly in the production codebase because doing so exposes real APIs, permissions, loading states and other constraints. But they explicitly say that something explored in production **doesn't therefore have to ship to customers**. ([WorkOS](https://workos.com/blog/how-product-design-is-evolving-with-ai "How Product Design is Evolving with AI -- WorkOS"))

A useful refinement: "throwaway" does not necessarily mean "toy."

Possible progression:

```text
Low-fidelity disposable prototype
            ↓
High-fidelity disposable prototype
            ↓
Production-context experiment
            ↓
────────────────────────────────
     DELIVERY COMMITMENT
────────────────────────────────
            ↓
Production implementation
            ↓
Long-lived operated system
```


The important boundary is the **commitment**, rather than which language, repository or environment produced the artifact.

<a id="how-id-reframe-ai-platform-around-this"></a>

### Proposed AI platform framing


This proposal considerably changes the earlier platform model.

Proposal: define **two explicit operating modes** in an AI-enabled product organization:

```text
                    DISCOVERY
                  Build to Learn

PM / Designer / Engineer / Domain expert
                     ↓
                AI builders
                     ↓
        many cheap working prototypes
                     ↓
            customer experiments
         feasibility / viability tests
                     ↓
               evidence gained
                     ↓
             discard most work
                     │
                     │ commitment
                     ▼
────────────────────────────────────────────
                    DELIVERY
                  Build to Earn

       product + engineering intent
                     ↓
          experienced engineering
                     ↓
              coding agents
                     ↓
      tests / architecture / security
                     ↓
          review + observability
                     ↓
                production
                     ↓
            measured outcomes
                     │
                     └──────────→ Discovery
```


The platform requirements for those sides are quite different.

For **Discovery**, the proposed requirements are cheap sandboxes, instant environments, model access, easy mock data, disposable databases, UI generation, temporary integrations and very low ceremony.

For **Delivery**, the proposed requirements are: repository rules, identity boundaries, secret management, architectural constraints, CI, evaluation, test suites, dependency policies, observability, gradual rollout, audit trails and human ownership.

That leads to a fairly provocative platform principle:

> **Don't make the Discovery platform production-safe enough to encourage accidental production. Don't make the Delivery platform frictionless enough that experiments silently become systems.**

Critique: Rachel Laycock's formulation points in a useful direction but could be misread. "Citizens build, agents execute, experts govern" can be interpreted organizationally as:

```text
business person makes thing
        ↓
agent codes
        ↓
engineer approves
```


which risks turning engineers into a cleanup and approval service.

The Discovery/Delivery model gives a cleaner boundary:

```text
Everyone can participate in Discovery.
Everyone may use AI.

             ↓

Once we decide to create an enduring system,
we have made an engineering commitment.

             ↓

Production engineering standards apply
regardless of who or what generated the code.
```


Proposed audience: management.

Suggested reading order: Cagan's **Build to Learn vs Build to Earn** and **Prototypes vs Products** for the model; Uber for actual organizational practice; Doernenburg for a concrete production-code failure analysis; Willison and Beck for the engineering distinction; and Torres for a surprisingly disciplined example of AI-assisted discovery/evaluation. ([Silicon Valley Product Group](https://www.svpg.com/prototypes-vs-products/ "Prototypes vs Products - Silicon Valley Product Group : Silicon Valley Product Group"))

Open research question: **what should the actual "commitment gate" between AI-powered Discovery and production Delivery contain?** Possible next step: derive a concrete gate from these practitioners, including evidence required, code that must be rewritten, security/NFR checks, ownership, and criteria for when prototype code may safely survive into production.

## Library sources


- Wille and Torres 2025, *AI Evals podcast transcript*
