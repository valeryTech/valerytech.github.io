---
draft: false
toc: true
title: "Discovery Delivery Interface Alternative"
linkTitle: "Discovery Delivery Interface Alternative"
---
> **Editorial note:** This is the earlier four-part version. Read it with [`discovery-and-delivery.md`]({{< ref "ai/operating-model/discovery-and-delivery" >}}). The same team does both kinds of work, and the interface is not a handoff.

- Discovery asks whether there is enough evidence that this is the solution worth building.
- Delivery asks whether the team can turn the selected solution into a production-quality solution that customers can depend on.

Cagan describes the transition as: once the team has evidence that it knows the solution it needs, engineers build the production-quality software. In the newer material, the prototype is the primary way the discovered solution is communicated--"prototype as spec"--with use cases and non-functional requirements supplementing it where needed

The interface can be modeled as:

DISCOVERY: effective solution + evidence + prototype + shared team understanding + relevant constraints / NFRs -> conceptual interface -> DELIVERY

### What crosses the interface?


There seem to be four things.

**1. A solution, sufficiently defined.** Discovery has moved from many possible approaches to a particular solution that the team believes is worth productizing.

A prototype is used as the main representation of that solution -- **"prototype as spec."** The prototype communicates what the intended experience should be.

**2. Evidence that justifies the investment.** The decision to productize isn't simply: prototype works -> delivery

Discovery tests the solution against the four risks. Cagan explicitly says the team seeks "evidence (or, when necessary, proof)" that something is worth building and deploying. The amount and kind of evidence depend on the risk.

Conceptually:

Solution S + Evidence Evalue + Evidence Eusability + Evidence Efeasibility + Evidence Eviability │ ▼ decision: worth production investment?

**3. Shared understanding.** This is easy to miss. The engineers who will productize the solution are already participating in discovery. They have seen prototype iterations, assessed feasibility, contributed technical ideas, and developed an understanding of why the solution looks the way it does.

When engineers have interacted with the discovery prototype, asked questions, and identified missing use cases, later implementation is faster and has fewer expensive detours.

**4. Additional delivery requirements.** The prototype doesn't necessarily encode everything required for production.

A PRD may supplement the prototype with things that are hard to represent there--for example specific use cases and non-functional requirements such as expected scale. The warning is that the PRD supplements discovery; it doesn't replace discovery.
