---
draft: false
toc: true
title: "Heuristics for Finding LLM Product Ideas"
description: "Short rules, with the notes behind them, for working out what can be built with LLMs, where to look for product ideas, and how to decide whether an idea is worth building."
linkTitle: "Heuristics"
---

This section is a practical guide for builders who want to make something useful with LLMs: what the models can and cannot do inside software, where to look for candidate problems, and how to test whether an idea is worth building before writing commercial code. Each rule is grouped under the question where you meet it first and links to the note that develops it in detail.

## 1. What an LLM can do in a product


- **Describe the model by what you give it and what you get back.** Fifteen abilities (`U1-U15`) cover most applications: extract fields, build a model of a domain, convert between forms, classify and tag, match and link, condense and compare, answer from documents, write and rewrite, generate options and test data, write and explain code, collect information by conversation, plan and use tools, judge against a rubric, read images and speech, and adapt from instructions and examples. Each has an example and a verification check in [What LLMs are good at]({{< ref "ai/heuristics/what-llms-are-good-at" >}}).
- **Ask for structured output when you can.** Prose can only be shown and read. A label can be routed, a record validated, a query type-checked and run, and code tested—so deterministic software can check a structured output before it causes an external effect.
- **Decide where the model sits—and separate request variety from data variety.** From riskiest to safest placement: the user talks to it directly, it writes calls or queries that software runs, it performs a fixed task in the backend, or it processes a batch whose results are checked before use. Backend placement constrains what can be asked, not how messy or incomplete the underlying records are. See [Where the model sits in a product]({{< ref "ai/heuristics/what-llms-are-good-at" >}}#where-the-model-sits-in-a-product).
- **Decide what the model may change, apart from what it produces.** Use the model for interpretation while keeping authority in deterministic code and human review across five levels: inform, interpret, draft, act after approval, and act within limits. Start low and move up only as task-level evaluations earn trust. See [What the model may change]({{< ref "ai/heuristics/what-llms-are-good-at" >}}#what-the-model-may-change).
- **Plan around what the model is weak at.** Models lack a persistent world model, do not reliably know when they are wrong, do not learn across calls on their own, and resist abstaining when evidence is missing. Strong products pair the model with retrieval, authoritative registers, validators, permissions, and human review. See [Finding LLM startup opportunities]({{< ref "ai/product/strategic-analysis/opportunity-search" >}}).

Three notes break the technical stack down into reusable layers, from user-facing jobs to underlying model properties:

- [LLM capabilities]({{< ref "ai/heuristics/llm-capabilities" >}}) (`C1-C14`): fourteen reusable jobs a product can offer—from turning speech or photos into records to investigating evidence corpora, analyzing codebases, or coordinating multi-party workflows—with what makes each hard, how to evaluate it, and market examples.
- [LLM primitives, system parts, and guarantees]({{< ref "ai/heuristics/llm-primitives" >}}) (`P1-P9`, `M1-M7`, `G1-G8`): the nine operations on information underneath those capabilities, the seven non-model system parts (integration surface, environment register, context store, policy, review UI, executor, trace) needed to run them safely, and the eight trace guarantees of an evidence-and-decision layer.
- [LLM features]({{< ref "ai/heuristics/llm-features" >}}) (`N`, `A`, `B`, `D`): the properties of natural language, Transformer inference, training priors, and deployed pipelines that explain why primitives succeed or fail—and which model failures fade within ~15 months versus persist across releases.

## 2. Where to look for ideas


- **Start from problems you have seen.** Walk through jobs, projects, and teams you know, and write down what was slow, expensive, repetitive, brittle, dependent on one specialist, or held together with spreadsheets, scripts, and manual copy-pasting. Don't overlook boring, messy operational work ("schlep blindness"). See [Finding and testing product ideas]({{< ref "ai/heuristics/finding-and-testing-ideas" >}}#ideas-generation-crossing-observed-problems-with-new-abilities).
- **Keep a second list of what has recently become possible**, written as the abilities in section 1, and cross the two lists to ask which old workflow changes materially because a capability now works.
- **Describe the opportunity as people doing a job.** "Platform engineers spend hours reconstructing what changed across deployments, logs, and tickets" can be tested in interviews; "AI observability" names a technology label nobody can falsify.
- **Ask diagnostic questions about work you know.** Where does an expensive specialist spend hours reading, searching, classifying, comparing, or reconciling messy records? Which workflow spans four or five systems with a human copying information between them? Which internal tool did a team build because commercial products missed their workflow?
- **Search by the structure of the work.** Domains that look unrelated on the surface share an underlying shape: requirements with an identifiable authority and scope, a mix of explicit rules and semantic judgment, evidence spread across documents, tables, and messages, missing or conflicting facts, answers that depend on dates and versions, and separate people who supply evidence, interpret it, and approve action. See [Search for domains]({{< ref "ai/heuristics/input/search-for-domains" >}}).
- **Prefer domains where meanings are stable and procedures vary per case.** A completely fixed procedure belongs in conventional deterministic software; a task whose concepts and outcomes cannot be evaluated independently makes a poor starting point. See [the second domain-search dialogue]({{< ref "ai/heuristics/input/search-for-domains-2" >}}).
- **Walk through recurring B2B and professional jobs.** Eight product families—each naming a plausible buyer, users, a recurring job, a useful result, and specialist variants—are cataloged in [B2B and professional job families]({{< ref "ai/heuristics/b2b-job-families" >}}).
- **Scan existing software categories.** Take widely used consumer or enterprise apps and ask which high-friction workflows change when speech, vision, grounding, or multi-document synthesis is added.
- **Choose a shippable delivery form and separate technical inventions from startups.** "This app could do X with AI" describes someone else's product. Decide whether to ship a **new standalone product**, an **add-on**, **software for the operator**, or a **cross-product layer**—and if you started from a reusable technical advance, check whether a startup, an SDK/license, an integration, or open source fits best. See [Framing and commercializing product ideas]({{< ref "ai/heuristics/product-framing-and-commercialization" >}}).
- **Study how ordinary products were framed, storyboarded, and bought.** Reconstruct how products such as Slack taught users to recognize fragmented workflows as a solvable problem, and storyboard the concrete offline and online moments where users meet uncertainty or errors. See [Framing and commercializing product ideas]({{< ref "ai/heuristics/product-framing-and-commercialization" >}}#studying-how-ordinary-products-were-found-framed-and-bought).

## 3. Deciding whether to build an idea


Two questions come first: does the task require substantial language or multimodal interpretation, and is the result easy to verify?

| | Easy to check | Hard to check |
| --- | --- | --- |
| **Much language work** | **Best candidates:** extraction into a schema, entity grounding, routing, reconciling disputes across emails and invoices | **Risky:** open-ended autonomous agents, long-horizon advice nobody can verify soon |
| **Little language work** | Ordinary deterministic software is enough | Rarely a good use of an LLM |

Then test the task, evaluation, and commercial fundamentals:

- **The task repeats across inputs that vary slightly.** One-off strategic decisions rarely justify building and maintaining an AI workflow.
- **It costs well below the manual baseline with checking counted.** Sum build and inference cost, the human time spent reviewing outputs and fixing errors, and the expected cost of uncaught mistakes ([What LLMs are good at]({{< ref "ai/heuristics/what-llms-are-good-at" >}}#is-a-task-worth-building)).
- **Mistakes surface quickly and stay reversible (`G8`).** Short feedback loops and undoable links or drafts let an imperfect v1 fail safely.
- **Users actually want to hand the step off.** People welcome relief from tedious clerical or synthesis drudgery, not from work that gives them status, judgment ownership, or craft identity.
- **Someone can judge the output—or trace guarantees catch bad runs.** Without either reference checks (`RF`), domain reviewers (`HR`), or inspectable trace invariants (`G1-G8`), the system cannot improve systematically.
- **It beats a frontier model in a chat window—today and in 15 months.** If pasting the input into a general chat assistant works nearly as well, or if the idea only patches a fading capability bug rather than leveraging private registers (`M2`), live tool boundaries (`M6`), or persistent model priors (`B8`), model releases will erode it ([LLM features]({{< ref "ai/heuristics/llm-features" >}}#durability-across-model-releases)).
- **It survives incumbent bundling.** Ask why the system-of-record vendor (CRM, ERP, GIS, IDE) will not ship the same feature natively next quarter. Products hold up better when they span competing tools, manage user- or cross-company context no single vendor owns, or serve a participant the incumbent ignores.
- **The cooperation and cold-start tax is manageable (`M1`).** Count how many outside apps, data owners, or IT teams must integrate before user #1 gets value.
- **Buyer, user, and reviewer incentives align (`M5`).** In B2B, adoption stalls when management captures the reporting benefit while frontline workers get saddled with extra AI-review screens.
- **A recurring buyer and practical evaluation data exist.** Confirm who owns the budget and whether you can obtain 15–30 representative real cases, permission to test on them, and domain reviewers to judge traces.

When the opportunity improves an existing multi-step process, map the user journey, score individual steps on **value, feasibility, and desirability**, start with one step that scores high on all three, and explicitly divide responsibility between people and AI: [Assessing workflow steps for AI]({{< ref "ai/heuristics/workflow-assessment" >}}).

Before building commercial software, write the candidate as an eight-field **problem hypothesis** and test its riskiest assumption with the cheapest falsifying experiment—past-case interviews, a manual concierge pilot, offline trace evaluation, or a Wizard-of-Oz prototype containing realistic AI errors: [Finding and testing product ideas]({{< ref "ai/heuristics/finding-and-testing-ideas" >}}).

## Steps from a list of problems to a first test


1. Write down roughly 50 concrete problems observed in work you know (section 2).
2. Next to each problem, note which abilities (`U1-U15`) or capabilities (`C1-C14`) address it (section 1).
3. Filter to problems requiring substantial language work with checkable results, low cold-start cooperation, and durability against bare chat models and incumbent bundling (section 3).
4. Write the strongest ~10 candidates as explicit problem hypotheses.
5. Interview people who recently experienced the top 2–3 problems about concrete past cases—never hypothetical opinions.
6. Run one or two cheap demand and workflow experiments on the highest-conviction survivor before building full software.

## Notes in this folder


| Note | What it covers |
| --- | --- |
| [What LLMs are good at]({{< ref "ai/heuristics/what-llms-are-good-at" >}}) | Fifteen builder abilities (`U1-U15`), a seven-step ontology example, model placement, action authority (`1-5`), and task economics |
| [LLM capabilities]({{< ref "ai/heuristics/llm-capabilities" >}}) | Fourteen reusable application capabilities (`C1-C14`), evaluation focus codes, what makes each hard, and market examples |
| [LLM primitives, system parts, and guarantees]({{< ref "ai/heuristics/llm-primitives" >}}) | Nine information operations (`P1-P9`), seven non-model system parts (`M1-M7`), cross-product archetypes, and eight trace guarantees (`G1-G8`) |
| [LLM features]({{< ref "ai/heuristics/llm-features" >}}) | Five classes of language, model, and deployed-system properties (`N`, `A`, `B`, `D`) and empirical durability across model releases |
| [B2B and professional job families]({{< ref "ai/heuristics/b2b-job-families" >}}) | Eight B2B and professional job families with buyers, users, recurring jobs, useful results, and platform variants |
| [Assessing workflow steps for AI]({{< ref "ai/heuristics/workflow-assessment" >}}) | Mapping an existing journey, scoring steps on value/feasibility/desirability, dividing human-AI work, and measuring automation vs. augmentation |
| [Finding and testing product ideas]({{< ref "ai/heuristics/finding-and-testing-ideas" >}}) | Crossing problem and capability inventories, problem-hypothesis templates, combining Blank/Strategyzer/Torres/Cagan, and pre-build experiments |
| [Framing and commercializing product ideas]({{< ref "ai/heuristics/product-framing-and-commercialization" >}}) | Delivery forms, separating invention from commercialization, analyzing how products like Slack were framed and bought, and user-journey storyboarding |
| [Search for domains (1)]({{< ref "ai/heuristics/input/search-for-domains" >}}) and [Search for domains (2)]({{< ref "ai/heuristics/input/search-for-domains-2" >}}) | Saved dialogues on selecting domains by work structure, stable semantics with variable procedures, and early failure detection |
| [Finding and testing ideas (dialogue)]({{< ref "ai/heuristics/input/finding-and-testing-ideas-dialogue" >}}), [Product case studies (dialogue)]({{< ref "ai/heuristics/input/product-case-studies-dialogue" >}}), and [Airbnb storyboards (clipping)]({{< ref "ai/heuristics/input/product-storytelling" >}}) | Raw source dialogues and article clipping preserved behind the distilled discovery and framing notes |
