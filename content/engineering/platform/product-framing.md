---
draft: false
toc: true
title: "Platform Product Framing"
description: "How to define what an internal platform is for (its role, users, outcomes, goals, boundaries, and principles), how to build that framing from existing inputs, and why making it explicit improves platform decisions."
document_status: "draft"
linkTitle: "Product Framing"
---

**Question:** how do you decide what an internal platform is for, so that product and technical decisions about it rest on the same assumptions?

[Platform as a product]({{< ref "engineering/platform/developer-experience" >}}#platform-as-a-product) treats developers as the platform's users. This note covers the step before building capabilities: framing the product. The examples come from an AI platform, but nothing here is specific to AI.

## Start from goals, not capabilities


- **Predefined capabilities.** One way to start is to pick capabilities that seem useful and offer them to teams. That changes how teams work without managing the change, and gives no way to tell whether the capabilities are the right ones.
- **Goals tied to delivery.** The main goal of an AI platform is to improve the product delivery performance of the teams that use it. Its capabilities therefore depend on how those teams design and deliver products. For example, a team that separates discovery from delivery needs different support in each; see the [AI discovery platform]({{< ref "ai-engineering/delivery/ai-platform-discovery" >}}) and [delivery capabilities]({{< ref "engineering/platform/delivery-capabilities" >}}).
- **Shaping, not only adapting.** The platform can also shape and standardize team processes to improve delivery outcomes, rather than only adapting to the methods teams already use.
- **Existing goals are inputs.** Management, stakeholders, and earlier commitments usually supply goals already. They may not match current reality, so a product approach examines them instead of adopting them as given.

## What a framing contains


A product framing is a shared answer to these questions:

- Why does the platform exist?
- Who is it for?
- Which problems or outcomes is it responsible for?
- What role does it play in the organization?
- What does it own, and what does it deliberately leave to other teams?
- Which principles guide its evolution?
- How do we know whether it is succeeding?

The answers don't need to be known at the start. The first piece of work is a process for discovering and validating them.

| Concept | What it states | Form |
| --- | --- | --- |
| Vision | The intended future state and role of the platform: who it serves, what it enables, and the direction it provides | A concise statement or short narrative |
| Mission or role | Why the platform exists inside the organization | A sentence or two |
| Users | Who the platform serves | A short list of user groups |
| Problems and outcomes | What the platform is responsible for improving | A short list |
| Goals | The outcomes the platform should achieve or enable, specific enough to guide decisions | A small, explicit set |
| Scope and boundaries | What belongs to the platform | A list, with examples at the edges |
| Principles | Decision rules for trade-offs that recur | Optional; include them when they add decision value |
| Constraints and non-goals | What the platform deliberately avoids, defers, or treats as fixed | Optional; include them where ambiguity would otherwise remain |

One-line definition of the work: define and align on the platform's role, users, outcomes, goals, and boundaries, so that product and technical decisions are made against a shared set of assumptions.

## Three layers


Keep three things apart:

| Layer | Examples | Meaning |
| --- | --- | --- |
| Concepts and outputs | Vision, goals, principles, outcomes | What the work should produce |
| Activities | Discovery, validation, articulation, alignment | The work that establishes those concepts |
| Usage | Prioritization, roadmap decisions, trade-offs, architecture decisions | How the concepts guide later decisions |

Prioritization belongs to usage, not to the activities. It is how the framing is used once it exists.

The umbrella activity can be called *platform vision and goals definition*. If it also covers the broader reasoning and decision framework, call it *platform strategy development*.

## Building the framing

### Inputs


- Company and product strategy, and the expected role of the platform.
- Goals and expectations from management and other stakeholders.
- Needs and problems of platform users and participating teams.
- Current platform capabilities, limitations, and technical constraints.
- Existing commitments, roadmap, initiatives, architectural direction, and earlier decisions.
- Evidence: usage, feedback, support patterns, delivery friction, and operational data.

These inputs were often created at different times for different reasons. Taken together they may contain gaps, conflicts, or assumptions that no longer hold.

### Activities


1. **Discovery.**
   - Interview stakeholders and users, and inspect existing goals, plans, and decisions.
   - For each input, record where it comes from and which problem or desired outcome it represents.
2. **Validation of inputs.** Check the inputs against current reality: user needs, business relevance, technical feasibility, dependencies, and assumptions.
3. **Synthesis.**
   - Group related inputs and identify recurring needs and common themes.
   - Expose conflicts, gaps, and unclear boundaries.
   - Separate desired outcomes from proposed solutions and implementation preferences.
4. **Articulation.** Write a first version of the vision and goals in language that both product and engineering understand.
5. **Validation against use.** Test the proposed framing against actual use cases and current decisions.
6. **Alignment.** Review the framing with the people who will use it, resolve material disagreements, and agree on it as the basis for later decisions.

### Scope


The work ends when the relevant stakeholders share an explicit statement of the platform's role and the outcomes it pursues. Downstream work uses that statement as input:

- prioritization;
- roadmap planning;
- delivery planning;
- architecture choices;
- execution.

## Why make it explicit


A framing is justified by the decisions it improves, not because a vision document is useful in itself.

Without a shared framing, teams still execute, but they optimize for different readings of the platform. The symptoms:

- conflicting roadmap requests;
- unclear ownership;
- architecture driven by individual use cases;
- duplicated capabilities;
- no clear way to explain why one investment should come before another.

The argument in short: platform decisions span teams and have long-term consequences. Making them consistently requires an explicit agreement on the platform's role, users, goals, and boundaries.

**Decisions a framing settles:**

- Should the platform own this capability?
- Which user group should we optimize for?
- Does this roadmap item advance a platform goal?
- Should we build a general capability or solve this inside one product?
- Which level of abstraction belongs in the platform?
- Which technical constraints are acceptable?
- What should we measure?

**Two deliverables:**

- **The framing:** what we believe the platform is and should become.
- **The rationale:** why making those assumptions explicit improves the decisions we need to make now. It is strongest when it points to current decisions where the missing framing causes ambiguity.

## How the outputs are used


Once aligned, the vision and goals become a common reference. Use them to:

- Prioritize opportunities, initiatives, and requests.
- Build and revise the roadmap.
- Make scope and investment decisions.
- Evaluate product and technical trade-offs.
- Guide architecture decisions where several valid options exist.
- Explain whether a proposed initiative belongs in the platform's scope.
- Track progress, and revisit assumptions when the context changes.

## Quality criteria


The vision and goals should be:

- **Explicit:** participants can point to the same written statements.
- **Grounded:** each statement traces to validated needs, constraints, and business context.
- **Outcome-oriented:** goals describe what should change or become possible.
- **Usable:** they help resolve prioritization and trade-off decisions.
- **Shared and revisable:** stakeholders accept them as the current basis for decisions and review them when material assumptions change.

## Product-driven platform design


Design the platform from real product delivery needs. Concrete product work shows where teams meet friction, which capabilities repeat across use cases, and which abstractions belong in the platform.

Apply it only where needed:

- Use selected product initiatives as reference cases for platform discovery.
- Turn repeated product needs into platform capabilities, APIs, and tooling.
- Feed what delivery teaches back into platform architecture and priorities.

The same idea at different levels:

| Level | Name | What it means |
| --- | --- | --- |
| Mindset | Product-driven platform design | The platform exists to serve real product delivery |
| Method | Product-back platform design | Start from a real product case and derive what the platform must provide |
| Process | Platform discovery through product delivery | Observe real delivery: friction, gaps, and repeated needs |
| Evolution | Product-led platform evolution | Feed those observations back into the platform continuously |
| Organizational shift | Platform productization | Treat the platform as a product with users, outcomes, feedback, and a roadmap |

The [team delivery loop]({{< ref "ai-engineering/delivery/ai-platform-team-loop" >}}) applies this to AI platforms by deriving capabilities from what a feature team does at each step. The [defaults and triggers]({{< ref "system-design/elements/defaults-and-triggers" >}}) note makes the same move for service templates: build the template from the second service.

## Related notes


- [Platform engineering and developer experience]({{< ref "engineering/platform/developer-experience" >}}): platform as a product, golden paths, and measures.
- [Engineering operating model]({{< ref "engineering/platform/standards-layers" >}}): standards and how they are enforced.
- [Delivery capabilities]({{< ref "engineering/platform/delivery-capabilities" >}}): what a delivery platform must be able to do.
- AI platform notes:
  - [AI discovery platform]({{< ref "ai-engineering/delivery/ai-platform-discovery" >}});
  - [team delivery loop]({{< ref "ai-engineering/delivery/ai-platform-team-loop" >}});
  - [AI platform capability map]({{< ref "ai-engineering/delivery/ai-platform-capabilities" >}}).

## Library sources


- [Fournier and Nowland 2025](/sources/3c79e44be07e3bb68b2346dc79796c36.bin), *Platform Engineering: A Guide for Technical, Product, and People Leaders* -- platform as a product, stakeholder relationships, and alignment
- [Chankramath et al. 2026](/sources/f86bda9692a5543309568d5a8296c48b.bin), *Effective Platform Engineering* -- chapter 3, on the organizational changes a platform needs and how to scope it
