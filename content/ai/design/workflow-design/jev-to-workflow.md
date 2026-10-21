---
draft: false
toc: true
title: "Jev, ontologies, and confidence-based routing"
description: "Explore how Jev classification, explicit ontologies, and confidence thresholds guide agent decisions, escalation, and evaluation."
linkTitle: "Jev and ontologies"
---
## Feed post


[link](https://www.linkedin.com/in/pauliusztin/)

Don't waste all your time improving how your AI agents reason.

Do this instead...

Spend more time defining what they should reason about.

Even the smartest model can make a bad decision if the options are poorly defined.

This is why I like using Jev and ontologies together...

Jev by [****TypeSafe AI****](https://www.linkedin.com/company/typesafe-ai/) turns unstructured inputs into structured decisions with calibrated confidence scores.

Instead of asking an LLM to reason through every decision, you define the possible outcomes in code.

Jev selects an outcome and returns its confidence. And the ontology defines what those outcomes mean.

Imagine an AI agent handling customer support tickets.

The ontology defines:

- Which issues belong to billing versus technical support.
- How customers, subscriptions, and invoices relate.
- Which categories should never overlap.

Jev classifies tickets against those categories.

Based on its confidence, your agent can:

1\. High confidence -> Execute an action.

2\. Medium confidence -> Escalate to an LLM.

3\. Low confidence -> Request human review.

So expensive reasoning is reserved for cases that need it.

But what if your ontology is wrong?

Jev can confidently choose the wrong category if the options are poorly defined.

You still need evals to identify failures, improve definitions, and test changes before deploying.

As those definitions evolve, version them like your prompts, datasets, and code.

The takeaway:

Building better AI agents isn't always about making the model smarter.

Sometimes it's about defining its world more clearly.

P.S. How are you defining the decision space for your AI agents?![View image](https://media.licdn.com/dms/image/v2/D4E22AQFuBzi07QIuZQ/feedshare-image-high-res/B4EaFKz0R8JAAY-/0/1792256460234?e=1794441600&v=beta&t=aaRpGAhUyrPYixqThmlvSWNDweIJ2gPYzonUd6jp97k)

Its really creative application for JEV. One thing worth adding is this doesn't just make agents smarter it makes them auditable. When every decision maps back to a defined ontology, you can trace exactly why the agent acted and that's huge for production. We applied similar logic to support tickets and escalations dropped ~40%. The confidence threshold is the real unlock. You're basically shifting the intelligence to the problem structure instead of hoping the model guesses right. 🔥... more

{{< figure src="jev-to-workflow.assets/pasted-image-20261020224616.png" alt="Pasted image 20261020224616" >}}
