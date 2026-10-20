---
draft: false
toc: true
title: "Communicating During a System Design Interview"
description: "Practical interview phrasing for clarifying scope, stating assumptions, explaining flows, comparing choices, handling disagreement and uncertainty, and managing time."
document_status: "canonical"
linkTitle: "Communication Phrases"
---

Use these as prompts for clear reasoning. Adapt them to what you actually know and to the discussion; there is no need to memorize a script.

## Establish the scope


> "Let me check the core use case: the user wants to ___. I suggest we focus on ___ and leave ___ for later. Does that match the problem?"

> "Should I include authentication in this design, or assume an existing service provides it?"

> "What happens from the user's perspective if this operation is delayed or fails?"

Ask questions whose answers could change the design. When proposing a scope, make the assumption visible and leave room for correction.

## State an assumption


> "I'll assume ___ as a starting point. If it were ___ instead, the main design change would be ___."

> "I'm assuming hundreds of concurrent interviews for this example. Should we examine a substantially larger workload?"

> "For the initial design, I'll treat ___ as an existing dependency with this contract: ___."

Distinguish a fact supplied by the interviewer from a number or condition you are proposing.

## Explain a flow


> "I'll walk through this end to end: the request enters here, this component validates it, this state changes, and the client receives ___."

> "I'll define the relevant API and fields alongside the flow so we can see how they fit together."

Keep the explanation grounded in a concrete request and the state it touches.

## Compare alternatives and decide


> "Option A helps with ___ but introduces ___. Option B is simpler in ___ but gives up ___. Given our requirement for ___, I'll choose A."

> "The estimate matters because it tells us whether ___ fits on one instance or needs to be partitioned."

> "This decision depends on ___. I'd revisit it if ___ changed."

Tie trade-offs to the actual workload, access patterns, and guarantees. Avoid treating a database category or architectural style as a complete argument.

## Respond to disagreement


> "We can remove the cache. My reason for including it was ___. Without it, how should we meet ___?"

> "I may be missing a constraint. Is your concern the added complexity, the consistency behavior, or something else?"

> "That changes the assumption I was using. I'll update the design here and check the affected flow."

Treat the discussion as collaborative design. Acknowledge the concern, explain your reasoning, and use the feedback to move the design forward.

## Make uncertainty useful


> "I don't know that product's exact guarantee. The behavior this design needs is ___. I'd verify whether the product provides it."

> "I'm unsure about ___. Let me work through a concrete example."

> "I see two possible approaches. I'll compare them against our requirements before choosing."

## Manage depth and time


> "The difficult part here is ___. I'll finish the core flow, then return to that decision."

> "For now, this component must provide ___. I'll keep its internals as a deep-dive topic."

> "We have an end-to-end design. The highest-risk remaining issue is ___. I'll focus the next few minutes there."

Defer implementation detail deliberately, while keeping the component's responsibility and required behavior clear.

## Check agreement and conclude


> "Is this the flow you intended us to support?"

> "We've covered ___. The design meets ___ under these assumptions. The main unresolved risk is ___, and the next thing I'd check is ___."

For the source discussion, see [interviewing.io's communication guide](https://interviewing.io/guides/system-design-interview/part-two#c-exactly-what-words-to-say-in-specific-scenarios). The [original phrase collection]({{< ref "system-design/archive/interview-phrases-v0" >}}) preserves the longer examples, synonym lists, and transcript fragments.
