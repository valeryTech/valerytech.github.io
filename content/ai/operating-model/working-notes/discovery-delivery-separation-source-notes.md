---
draft: false
toc: true
title: "Discovery Delivery Separation Source Notes"
linkTitle: "Discovery Delivery Separation Source Notes"
---
# Source notes from `discovery-deliery-separation.md`


> **Editorial note:** This file keeps source material that does not belong in the current argument. The passages have been edited for grammar and flow. The edits are intended to preserve their meaning. The original wording is preserved in `7c21461:ai/product-model/in/discovery-deliery-separation.md`.

## Comparison with a role-based model


<!-- source-unit: DDS-01; source-lines: 2 -->

Discovery and delivery are a more useful way to classify the work than "citizens, agents, and experts." Discovery and delivery describe the purpose and risk of the work. The other model assigns capabilities to roles.

<!-- end-source-unit: DDS-01 -->

<!-- source-unit: DDS-22; source-lines: 228-238 -->

There is a risk in describing the model as "citizens build, agents execute, experts govern." It can be understood as this sequence:

```text
business person makes thing
        ↓
agent codes
        ↓
engineer approves
```


This can turn engineers into a cleanup and approval service.

<!-- end-source-unit: DDS-22 -->

<!-- source-unit: DDS-23; source-lines: 240-257 -->

The discovery and delivery distinction gives a clearer boundary:

```text
Everyone can participate in discovery.
Everyone may use AI.

             ↓

Once we decide to create an enduring system,
we have made an engineering commitment.

             ↓

Production engineering standards apply
regardless of who or what generated the code.
```


This was the model the source proposed presenting to management.

<!-- end-source-unit: DDS-23 -->

> **Editorial comment:** The current operating model does not use role labels to define discovery or delivery. The useful point retained here is that classifying work by purpose is separate from deciding who participates. Production obligations do not depend on who or what produced the implementation.

## Open question about production commitment


<!-- source-unit: DDS-25; source-lines: 261 -->

The next useful research question is narrower: **what should the actual "commitment gate" between AI-powered discovery and production delivery contain?** A concrete set of obligations could be derived from these practitioners. It could cover the evidence required, code that must be rewritten, security checks, checks of non-functional requirements, ownership, and criteria for deciding when prototype code may safely move into production.

<!-- end-source-unit: DDS-25 -->

> **Editorial comment:** The questions about evidence, ownership, controls, and the reuse of prototype code are still useful. "Commitment gate" is no longer the selected frame. The current model treats production commitment as a decision that adds obligations while discovery and delivery can continue together.
