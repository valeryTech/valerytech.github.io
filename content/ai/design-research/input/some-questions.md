---
draft: false
toc: true
title: "Questions to Probe the Architecture"
description: "Questions to put to an agent architecture proposal: what to build first and what to reuse, what its type and effect model catches, where the formal model ends, and which guarantees survive retries and partial failures."
linkTitle: "Probing Questions"
---

Questions worth probing hard:

> You have six weeks. Which 10% of this architecture do you actually build?

> What do you use Postgres/Temporal/LangGraph for, and what do you refuse to build yourself?

> Show me a production failure that your type/effect model catches and one it cannot catch.

> Where does the formal model stop and empirical evaluation begin?

> What would make you abandon the DSL/compiler thesis?

> How do you migrate an existing messy agent product into this architecture incrementally?

> What happens at 10,000 concurrent workflows?

> Which guarantees survive retries, duplicate tool calls, stale state, and partial external failure?
