---
draft: false
toc: true
title: "In Model Etc Source Notes"
linkTitle: "In Model Etc Source Notes"
---
# Source notes from `in-model-etc.md`


> **Editorial note:** These are planning notes, repeated statements, broken references, and draft comments that were not selected for the main documents. They are kept so the rearrangement does not discard source material. They are not the current operating model. The original wording is preserved in `7c21461:ai/product-model/in/in-model-etc.md`.

## Initial planning list


<!-- source-lines: 2-6 -->

- Capability funnel
- Experimental-based planning
- Timeboxes
- Evaluation infrastructure, as well as CI/CD and test infrastructure
- Sharing failed experiments

## Notes tied to missing context


<!-- source-lines: 48 -->

Cagan's attached article describes essentially this chain: stakeholders understand their own needs, select features or projects they believe will address them, and give those priorities to feature teams through a roadmap. The designer designs the feature and engineers build it. Value and viability of the selected feature remain with whoever requested it.

<!-- source-lines: 64, 68 -->

The source says that this separation creates a structural problem, followed by an editing note to introduce the problem analysis. It also contains the placeholder `XX`.

## Connections proposed for the wider model


<!-- source-lines: 300, 302 -->

The source proposes this connection: product strategy supplies the problems; empowered teams turn problems into solutions; discovery manages uncertainty around those solutions; delivery turns selected ideas into production changes; and outcome measurement closes the loop.

It proposes a later step of placing the four risks inside this system as checks and feedback loops. The aim was to explain what discovery does and why product management, design, and engineering work together.

## Draft structure and interface fragments


<!-- source-lines: 306, 310, 321 -->

The source contains the draft headings `structuring` and `feature/capability discussion`, plus the separator `++`.

<!-- source-lines: 324-334 -->

The source describes the discovery and delivery interface as a conceptual interface inside one team, not a handoff between phases or groups. It says both kinds of work continue and the same cross-functional team owns both. It lists possible parts of the interface:

- enough evidence that the solution is worth building;
- a representation of the solution;
- shared understanding;
- relevant constraints.

The passage ends with the separator `+++`.

<!-- source-lines: 338-340, 369-371, 397, 486 -->

The source contains more `+++` separators, the incomplete comment `What happens at this point (to change - because th):`, and the draft heading `Discovery`.

<!-- source-lines: 509-517 -->

The source repeats that the feature should not be the main lifecycle object. It then introduces a proposed simplification of an earlier discovery-to-delivery interface. The earlier version contained a defined solution, evidence, shared understanding, and additional delivery requirements. The proposed version reduces this to three items.

<!-- source-lines: 560, 566, 582, third sentence of 584, 609 -->

The source says that shared understanding matters but is a property of the continuing team, not an item passed across an interface. It repeats that the interface is two-way, that discovery mainly reduces uncertainty, and that delivery mainly creates something customers can depend on. It also notes that an "effective solution" has not proved the business result. It ends by saying that prototype-as-spec, non-functional requirements, experiment design, evidence strength, and individual risk tests can be explained below the main model.

> **Editorial comment:** Most of these points now appear in [`discovery-and-delivery.md`]({{< ref "ai/operating-model/discovery-and-delivery" >}}) or in separate alternative notes. They remain here because the source included them in draft or repeated form.
