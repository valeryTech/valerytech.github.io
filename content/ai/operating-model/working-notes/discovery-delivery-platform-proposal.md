---
draft: false
toc: true
title: "Discovery Delivery Platform Proposal"
linkTitle: "Discovery Delivery Platform Proposal"
---
# A platform proposal for discovery and delivery


> **Editorial note:** The file title, the heading marked as editorial, and all comments are editorial. The passages with source-unit markers come from `HEAD:ai/product-model/in/discovery-deliery-separation.md`. Their wording has been edited for grammar and flow. This is a platform proposal, not the current definition of discovery and delivery.

## Editorial grouping: proposed platform design


<!-- source-unit: DDS-17; source-lines: 172 -->

### Reframing the AI platform around discovery and delivery


<!-- end-source-unit: DDS-17 -->

<!-- source-unit: DDS-18; source-lines: 174-176 -->

The distinction between discovery and delivery considerably changes the earlier platform model.

The proposal defines **two explicit operating modes** in an AI-enabled product organization:

<!-- end-source-unit: DDS-18 -->

> **Editorial comment:** The earlier platform model is not included in this source file. The proposal below applies the distinction between discovery and delivery to platform design.

<!-- source-unit: DDS-19; source-lines: 178-216 -->

```text
                    DISCOVERY
                  Build to Learn

Product manager / designer / engineer / domain expert
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

       product and engineering intent
                     ↓
           experienced engineers
                     ↓
              coding agents
                     ↓
      tests / architecture / security
                     ↓
         review and observability
                     ↓
                production
                     ↓
            measured outcomes
                     │
                     └──────────→ Discovery
```

<!-- end-source-unit: DDS-19 -->

> **Editorial comment:** The source used "experienced engineering." This edit reads it as "experienced engineers" because the surrounding nodes name actors. The diagram can help compare what each mode needs from a platform. However, its vertical layout suggests two sequential phases. That is not the current model. Discovery and delivery can happen at the same time. Product managers, designers, engineers, and domain experts also remain involved after a production commitment.

<!-- source-unit: DDS-20; source-lines: 218-222 -->

The two modes have very different platform requirements.

**Discovery** needs cheap sandboxes, instant environments, model access, mock data that is easy to obtain, create, or use, disposable databases, UI generation, temporary integrations, and little formal process.

**Delivery** needs stronger controls: repository rules, identity boundaries, secret management, architectural constraints, CI, evaluation, test suites, dependency policies, observability, gradual rollout, audit trails, and human ownership.

<!-- end-source-unit: DDS-20 -->

> **Editorial comment:** These lists describe different levels of control and exposure. They do not require two separate physical platforms. Discovery can still require identity, privacy, security, cost, and data controls. Delivery also benefits from fast feedback and tools that are easy to use.

<!-- source-unit: DDS-21; source-lines: 224-226 -->

This leads to a fairly provocative platform principle:

> **Do not make the Discovery platform so safe for production use that people use it in production by accident. Do not make the Delivery platform frictionless enough that experiments silently become systems.**
<!-- end-source-unit: DDS-21 -->

> **Editorial comment:** This proposal is preserved here, but it is not part of the current model. If taken literally, the first sentence could justify an unsafe discovery environment, and the second could justify avoidable friction. The useful point is narrower: an experimental artifact should not become a supported production system without an explicit decision and the required controls.
