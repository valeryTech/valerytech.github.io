---
draft: false
toc: true
description: "Argues that API schemas need business definitions and discoverable operation contracts, using account meaning and refunds to connect inputs, preconditions, effects, authority, and retry requirements."
title: "13 Domain Semantics And Operation Contracts"
linkTitle: "13 Domain Semantics And Operation Contracts"
---
# Domain semantics and operation contracts


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The retained passage distinguishes an API's input types from the business meanings needed to use it. The complete account example and domain sketch remain with the refund-operation contract. The reply calls the described operation a capability, which needs to be distinguished from authority to invoke it.

The passage comes from the language-interface architecture reply (archived source 012). Its [architecture overview]({{< ref "ai/design-research/interactive-systems/09-intent-environments-and-domain-boundaries" >}}) retains the historical precedent, eight-layer proposal, application boundaries, and closing bibliography. The related passages concern [intent compilation]({{< ref "ai/design-research/03-language-and-compiler/10-program-authoring-and-typed-planning" >}}#intent-compilation-and-bounded-program-synthesis) and [concrete operation authorization]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}#authorization-of-concrete-operations).

The existing [semantic-kernel discussion]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) develops typed domain operations, checks, and the boundary between a kernel and execution. The new passage provides a general discussion beyond that note's audit-analytics example. The existing kernel arguments are retained with editorial wording.

Read the [sibling comments]({{< ref "ai/design-research/03-language-and-compiler/13-domain-semantics-and-operation-contracts-comments" >}}) for business definitions, operation descriptions, and enforcement. The [stage 8 audit]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-8-language-interfaces-and-architecture) records the passage's original range. The cited research and protocol claims remain unverified statements from the saved reply.

## Retained domain and operation discussion


<!-- Domain semantics and operation contracts source begins below. -->

## The semantic model may become one of the most important assets


Consider an API:

```ts
getAccounts({
  status: string,
  min_arr: number
})
```


Types tell us very little.

What does `status = active` mean?

Does ARR include contracted future revenue?

Do parent companies aggregate subsidiaries?

Are trial customers accounts?

Which currency does `min_arr` use?

Can suspended customers be contacted?

These aren't type-system questions. They're **business semantics**.

That means this:

```text
API schema
```


is insufficient.

We need something closer to:

```text
Domain

Customer
Account
Subscription
Contract
Invoice
Product
AccountOwner

Relations

Customer owns Accounts
Account has Subscription
Subscription governed by Contract

Definitions

active_customer := ...
ARR := ...
at_risk := ...

Capabilities

find_accounts(...)
create_followup(...)
contact_customer(...)

Constraints

do not contact ...
requires approval when ...
```


There is good historical evidence for this direction. Google's Schema-Guided Dialogue work explicitly supplied models with descriptions of intents and parameters and tested generalization to completely unseen APIs. A single model could then operate against a dynamic set of services without retraining for each service. ([AAAI Publications](https://ojs.aaai.org/index.php/AAAI/article/view/6394?utm_source=chatgpt.com "Towards Scalable Multi-Domain Conversational Agents: The Schema-Guided Dialogue Dataset | Proceedings of the AAAI Conference on Artificial Intelligence"))

And a current 2026 line of research is seeing the same phenomenon in enterprise data. One recent study found that giving frontier models explicit business semantics substantially improved natural-language analytics compared with giving them only the physical database schema. Another system introduces a semantic intermediate representation and deterministically compiles it to SQL. These are recent preprints, so the proposal is to treat the exact numbers cautiously, but the architectural result is persuasive. ([arXiv](https://arxiv.org/abs/2604.25149?utm_source=chatgpt.com "Semantic Layers for Reliable LLM-Powered Data Analytics: A Paired Benchmark of Accuracy and Hallucination Across Three Frontier Models"))

So there's a subtle inversion here.

People currently think:

> models get smarter -> schemas matter less.

The LLM hypothesis is:

> models get better at consuming schemas -> **good schemas become more valuable.**

The model needs somewhere to ground its interpretation.

## The API evolves into a capability


There's also a conceptual change between an API and the proposed concept of a capability.

Traditional API documentation mostly answers:

```text
How do I call this?
```


An agent needs:

```text
What does this accomplish?
When should it be used?
What does it require?
What can change if I invoke it?
What authority does it require?
What can it return?
Can it be retried?
Can it be reversed?
```


Something like:

```yaml
capability: refund_payment

description:
  Refund a captured payment.

inputs:
  payment_id: PaymentId
  amount: Money

preconditions:
  - payment is captured
  - amount <= refundable_balance

effects:
  - refundable_balance decreases
  - customer receives refund

authority:
  requires: payments.refund

risk:
  side_effect: financial
  reversible: false

idempotency:
  required: true
```


This starts looking surprisingly similar to OWL-S's old notion of inputs, outputs, preconditions and effects. ([W3C](https://www.w3.org/submissions/OWL-S/?utm_source=chatgpt.com "OWL-S: Semantic Markup for Web Services"))

But natural-language descriptions can carry much of the fuzzy meaning while formal fields carry properties where correctness matters.

Current MCP is an early, incomplete version of this direction. A server can expose discoverable tools with JSON Schema input and output contracts; the July 28, 2026 protocol revision expanded those tool definitions to full JSON Schema 2020-12. ([Model Context Protocol Blog](https://blog.modelcontextprotocol.io/posts/2026-07-28/?utm_source=chatgpt.com "The 2026-07-28 Specification | Model Context Protocol Blog"))

The recommendation is not to bet that MCP specifically dominates computing twenty years from now.

The proposal is to bet on its underlying abstraction:

> **Software dynamically advertises machine-readable capabilities to an intent interpreter.**

That's durable.
