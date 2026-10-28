---
draft: false
toc: true
description: "An LLM architecture proposal separates authoritative domain data, semantics, capabilities, and policy from task-specific interfaces, placing probabilistic intent compilation over checked execution rather than dissolving application boundaries."
title: "09 Intent Environments And Domain Boundaries"
linkTitle: "09 Intent Environments And Domain Boundaries"
---
# Intent environments and domain boundaries


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The retained reply proposes separating a domain's data, meanings, operations, and authority from the interface used for a task. Its opening diagrams, Semantic Web Services discussion, and complete eight-layer overview remain together. The later application-boundary discussion, engineering implications, reliability argument, and closing predictions follow in their original order.

The source contains one LLM reply without the preceding user prompt. First-person statements, confidence levels, and the proposed next experiment belong to the LLM. They are not decisions made by the author or a selected implementation plan.

The related passages now concern [domain semantics and operation contracts]({{< ref "ai/design-research/03-language-and-compiler/13-domain-semantics-and-operation-contracts" >}}), [intent compilation]({{< ref "ai/design-research/03-language-and-compiler/10-program-authoring-and-typed-planning" >}}#intent-compilation-and-bounded-program-synthesis), and [concrete operation authorization]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}#authorization-of-concrete-operations). The interface passages extend [stable controls]({{< ref "ai/design-research/interactive-systems/02-stable-interface-components" >}}#task-specific-views-and-trusted-controls), [temporary-workflow economics]({{< ref "ai/design-research/interactive-systems/08-generated-workspaces-and-application-composition" >}}#economics-of-small-and-temporary-workflows), and [editable interpretation]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction" >}}#editable-interpretation-of-ambiguous-requests).

Read the [sibling comments]({{< ref "ai/design-research/interactive-systems/09-intent-environments-and-domain-boundaries-comments" >}}) for authority, interpretation, interface checks, and the limits of the predictions. The source overview (archived source 020) links every part, and the [stage 8 audit]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-8-language-interfaces-and-architecture) records the original order. The cited research, protocol descriptions, security claims, and economic predictions were not independently checked during the split.

<a id="retained-architecture-reply"></a>

## Architecture proposal


<!-- Intent-environment architecture source begins below. -->

After looking at the earlier work and what is appearing now, the working interpretation is that there is a fairly coherent architecture hiding underneath the current "agent" terminology.

My current thesis is:

> **The application does not disappear as a data/security/business boundary. It becomes less important as an interaction boundary.**

Today an application bundles five things:

```text
Application
=
state
+ domain semantics
+ operations
+ permissions / business rules
+ user interface
```


LLMs make it possible to pull the last item away from the other four.

The future could look more like:

```text
                    human
                      │
                natural intent
                      │
                      ▼
              ┌───────────────┐
              │ intent compiler│
              │     (LLM)      │
              └───────┬───────┘
                      │
                 typed plan / IR
                      │
          ┌───────────┼────────────┐
          ▼           ▼            ▼
       CRM domain   GitHub       Calendar
       semantics    semantics    semantics
       actions      actions      actions
       state        state        state
       policy       policy       policy
          │           │            │
          └───────────┼────────────┘
                      ▼
              execution runtime
                      │
                      ▼
              task-specific UI
```


The interesting part is that we have been trying to build versions of this architecture for about 25 years. LLMs may remove one of the obstacles that stopped those earlier attempts.

## The first precursor: Semantic Web Services


This surprised me when following the literature.

Read the 2004 W3C OWL-S proposal. Its goal was explicitly to let software agents **discover, invoke, compose and monitor services automatically**. A service was described in three pieces: what it does, how it behaves, and how to invoke it. ([W3C](https://www.w3.org/submissions/OWL-S/?utm_source=chatgpt.com "OWL-S: Semantic Markup for Web Services"))

Sycara et al. were already writing in 2003 about automatic discovery and composition:

```text
goal
 ↓
discover appropriate services
 ↓
compose them
 ↓
invoke them
 ↓
monitor results
```


They identified essentially the same problem we're talking about now: syntactic APIs aren't sufficient because an agent needs to understand what an operation _means_. ([ScienceDirect](https://www.sciencedirect.com/science/article/abs/pii/S1570826803000039?utm_source=chatgpt.com "Automated discovery, interaction and composition of Semantic Web services - ScienceDirect"))

That's very close to:

```text
user: "find customers likely affected by this release
       and create follow-ups for their account owners"

              ↓

discover telemetry API
discover release API
discover CRM API
discover task API
compose them
execute
```


So why didn't we get this world in 2005?

One major problem was semantic annotation. Computers required very precise ontologies describing everything. Ontology engineering proved expensive, specialized, and difficult to maintain. Research continued to describe ontology construction as complex and time-consuming, and real-world adoption of semantic web services remained limited. ([South African Computer Journal](https://sacj.cs.uct.ac.za/index.php/sacj/article/view/185?utm_source=chatgpt.com "iSemServ: A model-driven approach for developing semantic web services | South African Computer Journal"))

LLMs change this equation.

We might no longer require this:

```text
every service
    ↓
perfect universal formal ontology
    ↓
formal logical matching
```


We may get away with:

```text
typed interface
+
reasonably good descriptions
+
local business semantics
+
examples
        ↓
LLM performs fuzzy semantic alignment
        ↓
formal execution layer checks result
```


That is a much cheaper proposition.

The working interpretation is that this is an important way to understand the current wave:

> **LLMs may make parts of the Semantic Web vision practical without requiring the entire world to agree on a Semantic Web ontology.**

We still need schemas. We no longer necessarily need a globally perfect schema.

## What the future software stack probably needs


The LLM proposal identifies eight layers it expects to be fairly durable.

1. **System of record.** Databases, files, event streams, repositories, CRM records, calendars and so on remain authoritative state. The language model should not become the database.
2. **Semantic domain model.** The system describes what `customer`, `active subscription`, `revenue`, `release`, `account owner`, `renewal`, etc. actually mean. This layer is substantially richer than an API's TypeScript types.
3. **Typed capabilities.** Domains expose operations such as `findCustomers`, `scheduleMeeting`, `createInvoice`, `queryTelemetry`, with typed inputs and outputs plus descriptions of their effects.
4. **Authority and policy.** The runtime determines which concrete actions the current user or model is permitted to take. This must be enforced outside the LLM.
5. **Intent compiler.** The probabilistic model translates language, examples and context into a structured representation.
6. **Plan and execution runtime.** A conventional system checks the plan, executes operations, handles retries, idempotency, transactions, partial failure and compensation.
7. **Task-specific interaction surface.** The system creates or selects the UI appropriate for the current task: table, graph, form, diff, map, approval screen, timeline, IDE view, etc.
8. **Audit and provenance.** The system records what information was used, which actions were proposed, which were authorized and what changed.

Everything interesting follows from the interaction among these layers.

# What happens to the "app"?


The proposal may have strategic consequences here.

Take Salesforce.

Today Salesforce owns:

```text
customer state
customer semantics
CRM operations
permissions
workflow logic
UI
navigation
```


In the architecture we're discussing, it might increasingly own:

```text
customer state
customer semantics
CRM capabilities
permissions
business invariants
specialized trusted UI components
```


A different system provides the interaction environment.

The user asks:

> Who are the customers most exposed to the outage we had yesterday? Prioritize by ARR and create follow-up tasks for their account owners.

The runtime might use:

```text
Datadog
     +
GitHub
     +
Salesforce
     +
Linear
     +
Google Calendar
```


without the user conceptualizing the task as:

```text
open Datadog
→ find incident
→ copy service names
→ open GitHub
→ find release
→ open Salesforce
→ search accounts
→ export
→ sort
→ open Linear
→ create tasks
...
```


That sequence exists because our software architecture exposes **applications** to humans.

An intent-driven architecture exposes **domain capabilities**.

This distinction could be enormous.

## So apps probably split into two things


The current object:

```text
┌──────────────────────┐
│      Salesforce      │
│                      │
│ data                 │
│ logic                │
│ permissions          │
│ workflow             │
│ UI                   │
└──────────────────────┘
```


may become:

```text
DOMAIN PROVIDER

┌──────────────────────┐
│ Salesforce           │
│                      │
│ authoritative data   │
│ semantics            │
│ capabilities         │
│ policy               │
│ invariants           │
└──────────────────────┘

EXPERIENCE

┌───────────────────────────────────────┐
│ Intent runtime                        │
│                                       │
│ language → task → tools → transient UI│
│                                       │
│ Salesforce + GitHub + Calendar + ... │
└───────────────────────────────────────┘
```


You could call the first a **domain service** and the second an **intent environment**.

The exact terminology isn't important.

The separation is.

# This changes what software engineers build


If this model holds, a lot of engineering effort moves.

Currently a large product team spends enormous effort on:

```text
pages
routing
forms
wizards
filters
dashboard variants
workflow screens
navigation
```


Some of that remains.

But more engineering effort moves toward:

```text
good domain models
precise semantics
clean capabilities
invariants
authorization
idempotency
event models
provenance
tests
high-quality reusable UI primitives
```


That's an important point because it contradicts one version of the "AI writes the software" narrative.

The backend doesn't become less important.

It becomes the substrate from which many interfaces and workflows can be synthesized.

A badly modeled business domain will be extremely difficult for an agent to operate.

A clean one might suddenly become accessible through thousands of workflows nobody explicitly programmed.

# Reliability gives us another clue


Current agents remain far from reliable enough to own arbitrary workflows.

τ-bench explicitly evaluates agents interacting with tools while following domain rules. Its initial results found large inconsistency even when models had clearly specified APIs and policy documents. ([arXiv](https://arxiv.org/abs/2406.12045?utm_source=chatgpt.com "\(τ\)-bench: A Benchmark for Tool-Agent-User Interaction in Real-World Domains"))

That tells me the likely route forward isn't merely:

```text
make LLM smarter
```


It is also:

```text
move more correctness outside LLM
```


So:

```text
LLM:
interpret
decompose
match semantics
propose
generate

runtime:
authorize
validate
transact
enforce invariants
retry
commit
audit
```


That division feels durable.

<a id="my-long-term-prediction"></a>

# Long-term prediction in the LLM proposal


The revised proposal is to state the thesis more strongly than in our previous discussion:

> **The fundamental technology may be the replacement of application-specific interaction logic with a probabilistic intent compiler over deterministic domain capabilities.**

The LLM doesn't become the application.

The LLM sits between the human conceptual model and the software's formal model.

```text
 HUMAN WORLD                         MACHINE WORLD

 goals                              schemas
 examples                           identifiers
 vague concepts                     types
 context                            APIs
 preferences        LLM             capabilities
 exceptions         ───→            rules
 terminology                         transactions
 incomplete specs                   databases
                                     permissions
```


That middle translation layer is what was prohibitively expensive to build manually.

We previously solved it through:

```text
UI designers
product managers
forms
menus
documentation
training
support
custom integrations
```


LLMs can absorb part of that translation work dynamically.

If they can do this reliably enough, the implications extend much further than chat.

<a id="what-id-bet-on"></a>

# Confidence levels in the LLM forecast


Over a 10-20 year horizon, the saved LLM forecast assigns high confidence to the view that fixed application UIs lose some importance; typed capabilities, domain semantics and permission systems gain importance; language becomes a common way to begin underspecified tasks; examples become another important specification mechanism; and software increasingly generates task-specific views and short-lived workflows.

The saved LLM forecast assigns medium confidence to the view that a common "intent environment" becomes the main place where knowledge workers interact with many otherwise separate systems, and that SaaS products increasingly compete on authoritative data, domain semantics, trusted operations and ecosystem access while their UI becomes a weaker boundary.

The saved LLM forecast assigns low confidence to the stronger claim that autonomous general agents simply replace applications. There are too many persistent requirements around authority, ambiguity, auditability, transactions, specialized interaction and deterministic behavior.

The historical connection proposed for further investigation is especially useful: **Semantic Web Services + capability security + program synthesis + HCI are converging into one architecture because of LLMs.** Those four fields each solved a different part of the problem long before modern LLMs appeared.

For reading, the strongest starting set is Rastogi et al.'s Schema-Guided Dialogue work [AAAI paper](https://ojs.aaai.org/index.php/AAAI/article/view/6394?utm_source=chatgpt.com); the OWL-S service ontology [W3C OWL-S specification](https://www.w3.org/submissions/OWL-S/?utm_source=chatgpt.com); Sycara et al. on automatic service discovery and composition [CMU publication](https://publications.ri.cmu.edu/automated-discovery-interaction-and-composition-of-semantic-web-services?utm_source=chatgpt.com); Gulwani's Flash Fill work [Microsoft Research paper page](https://www.microsoft.com/en-us/research/publication/automating-string-processing-spreadsheets-using-input-output-examples/?utm_source=chatgpt.com); Miller, Yee and Shapiro on capability security [Capability Myths Demolished](https://www.erights.org/elib/capability/duals/?utm_source=chatgpt.com); τ-bench on tool-using agent reliability [τ-bench paper](https://arxiv.org/abs/2406.12045?utm_source=chatgpt.com); and Google's Generative UI work [Generative UI paper](https://generativeui.github.io/static/pdfs/paper.pdf?utm_source=chatgpt.com).

The next useful step would be to **design this architecture ourselves as if we were building an operating system for intent-driven software**: define the capability format, semantic model, IR, permission model, runtime and UI protocol, and then run several concrete workflows through it. That should expose which parts actually require an LLM and which parts are conventional computer science.
