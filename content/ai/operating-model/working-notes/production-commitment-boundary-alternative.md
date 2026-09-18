---
draft: false
toc: true
title: "Production Commitment Boundary Alternative"
linkTitle: "Production Commitment Boundary Alternative"
---
# Alternative views of the production commitment boundary


> **Editorial note:** This is the earlier boundary formulation. The next paragraph comes from line 21 of `HEAD:ai/product-model/mindset.md`, and its wording has been edited for grammar and flow. The current model treats production commitment as a change in obligations, not as the end of discovery and the start of delivery.

An earlier draft on discovery and delivery also points toward a commitment boundary. Discovery asks whether to solve something and how to solve it. Delivery creates an enduring system. It must meet production constraints, and customers must be able to depend on it. The boundary is the commitment to that enduring system.

> **Editorial note:** The next paragraph comes from line 77 of `HEAD:ai/product-model/mindset.md`, and its wording has been edited for grammar and flow. In the source, it appeared after the narrow-scope, production-quality example in [`production-commitment.md`]({{< ref "ai/operating-model/production-commitment" >}}). The broken reference to "the attached draft" has been removed.

A discovery prototype may take shortcuts because its purpose is learning. Production code is an enduring commitment and must meet a different standard.

## Evidence about prototypes and an earlier boundary diagram


> **Editorial note:** The headings and comments in this section are editorial. The passages with source-unit markers come from `7c21461:ai/product-model/in/discovery-deliery-separation.md`. Their wording has been edited for grammar and flow.

### Prototypes as decision tools


<!-- source-unit: DDS-14; source-lines: 138-146 -->

**Ravi Mehta** gives a good account of the same idea from a product practitioner's perspective: _"The best prototypes get thrown away."_ He describes two new failure modes when teams use AI: they polish prototypes until those prototypes begin to carry production engineering costs, or they generate more prototypes than they can learn from. He treats prototypes as tools for making decisions and explicitly says they should not be treated as the first draft of production software. ([Ravi Mehta's Blog](https://blog.ravi-mehta.com/p/the-best-prototypes-get-thrown-away "The best prototypes get thrown away - by Ravi Mehta"))

His categories are useful:

- Concept prototype: explore alternatives.
- Design prototype: reach a shared understanding of behavior.
- Research prototype: observe customers.
- Technical prototype: answer questions about feasibility, performance, and reliability.
- Production implementation: a separate engineering commitment. ([Ravi Mehta's Blog](https://blog.ravi-mehta.com/p/the-best-prototypes-get-thrown-away "The best prototypes get thrown away - by Ravi Mehta"))

<!-- end-source-unit: DDS-14 -->

> **Editorial comment:** These categories distinguish prototypes by the question each one helps answer. The final item introduces a production commitment. It does not say that engineering begins only after discovery.

### Fidelity and location do not determine production status


<!-- source-unit: DDS-15; source-lines: 148-150 -->

**WorkOS** adds an interesting qualification. Its designers sometimes prototype directly in the production codebase because doing so exposes real APIs, permissions, loading states, and other constraints. However, WorkOS explicitly says that work explored in the production codebase **does not have to ship to customers**. ([WorkOS](https://workos.com/blog/how-product-design-is-evolving-with-ai "How Product Design is Evolving with AI -- WorkOS"))

This is a useful refinement. "Throwaway" does not necessarily mean "toy."

<!-- end-source-unit: DDS-15 -->

> **Editorial comment:** This distinction matters. The repository, environment, and level of detail do not by themselves determine whether an artifact has production obligations.

### Earlier view of the boundary


<!-- source-unit: DDS-16; source-lines: 152-170 -->

Possible stages include:

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
Long-lived system in operation
```


The important boundary is the **commitment**, not the language, repository, or environment used to create the artifact.

<!-- end-source-unit: DDS-16 -->

> **Editorial comment:** The final sentence is consistent with the current model. Commitment changes the obligations attached to a solution or artifact. The vertical diagram shows an earlier view and can suggest a sequence of phases. It should not be read as discovery ending when delivery starts. Discovery and delivery can continue at the same time.
