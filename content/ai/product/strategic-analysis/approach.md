---
draft: false
toc: true
title: "Strategic Analysis Approach"
description: "A proposed opportunity-search method targets expensive, verifiable semantic workflows, combining LLM capability limits, deterministic controls, recovery, historical cases, buyer access, and a narrow automation boundary."
linkTitle: "Approach"
---

Initial proposition: many SaaS and B2B providers appear to be introducing AI while assuming that LLM task performance implies broader intellectual capabilities. LLMs may lack many properties associated with AGI. The hypothesis is that this mismatch will cause many projects to fail. [Source gap: the files originally attached to support this proposition are not identified here.]

Personal starting point: I propose considering both LLM strengths and weaknesses, including processing large amounts of unstructured data and providing a natural-language interface. I also use evals and observability as core parts of reliable delivery. This understanding and approach could be a business advantage.

Goal: define an approach for finding opportunities and possibilities.

## reasoning


Proposed starting premise for the opportunity search:

**Find workflows where LLMs' specific capabilities solve an expensive problem, while the parts LLMs are weak at can be controlled by system design.**

The referenced files make this distinction explicit. "Intelligence" is defined operationally as task-solving capability; it doesn't imply understanding, grounding, agency, autonomy, learning, or reflection. And the relevant unit can be the whole `model + scaffold` system, not the bare model.

That gives us a much better startup thesis than "AI agents will replace employees."

### 1. Define the actual capability profile


Think of an LLM as a component with an asymmetric capability profile.

|Strong / useful|Weak / dangerous to assume|
|---|---|
|Read large amounts of unstructured text|Persistent understanding of a domain|
|Map messy language into structured representations|Reliable causal world models|
|Semantic search and retrieval|Knowing when its internal model is wrong|
|Generate language in arbitrary formats|Accurate self-reflection|
|Recognize patterns across heterogeneous documents|Persistent learning from experience|
|Handle fuzzy classification|Long-horizon autonomous operation|
|Produce candidate plans / actions|Stable goals and state over time|
|Use tools when properly scaffolded|Reliable open-world action selection|
|Adapt to context|Genuine learning merely because context changed|
|Work across many linguistic interfaces|Guaranteed factual correctness|

The referenced definition of learning is useful here: behavior changing because previous conversation is still in context is context-conditioned adaptation, not evidence that the model learned. Likewise, asking a model to critique its own output doesn't establish reliable reflection.

Those distinctions should directly shape product architecture.

### 2. Search for the right task shape


The most attractive workflow looks approximately like this:

```text
messy information
        ↓
LLM interpretation
        ↓
bounded decision / candidate action
        ↓
deterministic checks + retrieval + tools
        ↓
verifier / human / external outcome
        ↓
action
        ↓
logged result
        ↓
evals
```


The key property is:

**The input is difficult for conventional software, but the output is relatively easy to verify.**

That's where LLMs have a structural advantage.

Consider two examples.

```text
Read 40 emails, contracts and invoices
→ determine why customer disputed invoice
→ locate evidence
→ prepare response
→ check required fields
→ send
```


Very attractive.

Compare:

```text
Understand company's strategic situation
→ independently decide what company should do
→ execute strategy for six months
```


Much worse. Verification is delayed, causality is unclear, the environment changes, and errors compound.

Proposed search dimensions:

||Easy to verify|Hard to verify|
|---|--:|--:|
|**Requires substantial semantic work**|**Best AI opportunities**|Dangerous "agent" products|
|**Little semantic work**|Traditional software/RPA|Usually unattractive|

Proposal: spend most of the search effort on the upper-left cell.

### 3. Add the business filter


Technical fit alone isn't enough. Proposed scoring dimensions for each workflow, on a scale from 0-5:

1. **Economic value:** How much does the company currently spend or lose?
2. **Volume:** Are there thousands or millions of similar cases?
3. **Semantic complexity:** Does the job involve documents, language, ambiguity, exceptions?
4. **Boundedness:** Can the work be decomposed into relatively short decisions?
5. **Verifiability:** Can we determine whether an answer/action was correct?
6. **Recoverability:** Can bad actions be stopped, reversed, or escalated?
7. **Historical data:** Are previous cases and outcomes available for evals?
8. **Observability:** Can we see inputs, decisions, actions, and eventual outcomes?
9. **Integration feasibility:** Can software actually perform the required actions?
10. **Buyer economics:** Is there already budget for employees, BPOs, agencies, write-offs, or software?

A rough opportunity equation could be:

```text
Opportunity value

≈ existing spend / economic leakage
× case volume
× automatable fraction
× LLM advantage
× verification quality

÷ failure cost
÷ integration difficulty
÷ sales friction
```


We don't need to treat this formula literally. It forces us to ask the right questions.

<a id="4-your-evalobservability-approach-changes-which-markets-are-viable"></a>

### 4. Evals and observability change which markets are viable


Possible business advantage: the note author's use of evals and observability may offer more than simply "I know how to use LLMs better."

Suppose competitors build:

```text
prompt
→ LLM
→ action
```


They can demo quickly. Then they discover that 2-5% of cases behave badly, prompts interact in unexpected ways, models change, edge cases accumulate, and nobody knows whether the latest release improved the actual business outcome.

The proposed architecture makes **automation percentage an empirical variable**.

```text
Cases
│
├── clearly safe → automate
├── uncertain → human review
└── unsupported → don't attempt
```


Then:

```text
production traces
      ↓
failure taxonomy
      ↓
eval dataset
      ↓
system/model change
      ↓
offline evaluation
      ↓
controlled deployment
      ↓
business outcome
```


The startup can progressively move the boundary:

```text
20% automated
→ 40%
→ 65%
→ 85%
```


while measuring whether quality remains acceptable.

That creates a real economic advantage. Every additional percentage point of safe automation reduces marginal operating cost.

And importantly, this doesn't require us to claim that the model became an autonomous agent. The referenced dictionary explicitly separates a persistent agent-like system from the model inside it.

### 5. This suggests specific classes of opportunities


Proposed search priority: businesses with this structure:

**High-volume case operations.**

A "case" arrives containing emails, PDFs, notes, database records and previous actions. Someone understands the case, decides what to do, communicates with somebody, updates systems, and waits for a response.

Examples include claims, disputes, collections, appeals, underwriting support, compliance review, procurement exceptions, freight problems, warranty cases, billing problems and customer escalations.

Another strong category is **evidence assembly**:

```text
question / claim
→ search many heterogeneous sources
→ determine relevant evidence
→ construct argument
→ submit it
→ receive externally observable result
```


This includes chargebacks, insurance claims, supplier deductions, audits, reimbursement claims and contract disputes.

A third is **communication as operations**. Communication isn't the final product; language is the interface through which an economic process happens:

```text
understand counterparty
→ choose next communication
→ explain options
→ collect information
→ negotiate bounded choices
→ cause measurable outcome
```


LLMs are naturally useful because the underlying protocol is language.

<a id="6-where-i-would-actively-avoid-the-hype"></a>

### 6. Claims to reject without evidence


Proposed initial rejection rule: reject startup ideas whose thesis depends on statements such as:

> "The agent will understand the business."

> "It will learn how to do the job over time."

> "It will reflect on its mistakes."

> "Give it a goal and it will figure everything out."

Those claims correspond precisely to concepts that the referenced framework says require stronger evidence than successful output or fluent language. For example, the referenced definition of understanding requires evidence across prediction, interventions, counterfactuals, transfer and robustness, not merely correct answers.

That doesn't mean the product can't perform complex work. It means we should design the complexity at the **system level**, where state, control, verification and feedback are explicit.

### 7. A concrete opportunity-search process


Proposed search order:

```text
INDUSTRY
    ↓
find expensive operational workflows
    ↓
identify unit of work ("case")
    ↓
inspect inputs / decisions / actions / outcome
    ↓
measure semantic complexity
    ↓
find verifier or objective outcome
    ↓
identify catastrophic failure modes
    ↓
design system boundary around LLM weaknesses
    ↓
estimate achievable automation %
    ↓
calculate economics
```


And for each candidate, create a one-page record:

```text
Workflow:
Buyer:
Unit of work:
Annual volume:
Current cost per case:
Input types:
Required decisions:
Required actions:
Objective outcome:
How success is verified:
LLM advantage:
LLM failure modes:
Deterministic controls:
Human escalation:
Historical eval data:
Possible pricing:
Initial narrow wedge:
```


Working judgment: this is a better foundation for the search than starting with "fintech", "healthcare", "legal", etc.

Proposed central hypothesis:

**Search for expensive, high-volume workflows where semantic interpretation is the bottleneck and correctness can ultimately be checked. Then build a controlled system around the LLM and use evals and production observability to expand the safe automation boundary.**

From there, we can systematically generate perhaps **30-50 candidate workflows across industries**, score them with this framework, and see which 5-10 have the strongest combination of technical fit and business economics.

# reasoning 2

# Core thesis


Proposed startup thesis:

> Companies often infer system-level properties from model-level performance. A reliable product uses the LLM for scoped task-solving, while the surrounding system supplies current data, persistent state, permissions, verification, feedback, and accountability.

This follows the referenced dictionary. [Source gap: the exact dictionary and version were not linked in this note.] It defines intelligence as task-solving capability under specified conditions and explicitly says that intelligence alone does not imply understanding, grounding, agency, autonomy, learning, meaning, or consciousness. It also requires the unit of analysis--model, invocation, process, entity, or system--to be stated.

Proposed correction to the thesis: avoid depending on a categorical claim that LLMs have no understanding. The referenced dictionary defines understanding as graded and domain-specific. The commercial rule is stronger and easier to defend:

> Do not depend on understanding, agency, learning, reflection, or autonomy unless the deployed system demonstrates the required behavior under the target workflow conditions.

Correct answers or fluent explanations alone are insufficient evidence of understanding. The proposed evidence includes changed conditions, interventions, counterfactuals, transfer, and removal of shortcuts.

The timing supports this position. McKinsey's August 25, 2026 survey found that nearly nine in ten organizations regularly use AI in at least one function and 44% report enterprise-scale adoption, while only 37% attribute any EBIT impact to AI and about 6% qualify as high performers. Those high performers tend to redesign workflows and apply operational discipline. A separate vendor survey of more than 1,300 AI practitioners found quality was the most frequently cited production barrier; 89% reported some observability, while 52% reported using evals. ([McKinsey & Company][1])

# The opportunity model


Search for workflows satisfying this equation:

```text
valuable business problem
× strong LLM task fit
× clear evaluability
× bounded authority
× accessible data and feedback
× buyer urgency
= viable opportunity
```


The strongest opportunities usually have these properties:

| Property       | Good signal                                                                                                          |
| -------------- | -------------------------------------------------------------------------------------------------------------------- |
| Input          | Large volumes of emails, PDFs, tickets, transcripts, notes, images, or loosely structured records                    |
| Transformation | Extraction, comparison, classification, synthesis, drafting, reconciliation, or explanation                          |
| Output         | A structured record, review packet, recommendation, draft, routing decision, or bounded action                       |
| Verification   | A human, rule, source document, database state, or downstream outcome can determine whether the output is acceptable |
| Risk           | Errors are detectable, reversible, or can be routed for approval                                                     |
| Feedback       | Corrections and outcomes arrive frequently enough to improve the system                                              |
| Economics      | High case volume, expensive review, slow cycle time, missed revenue, or measurable error cost                        |
| Buyer          | One role owns the workflow, metric, and budget                                                                       |

Weak opportunities commonly depend on long-horizon open-ended behavior, hidden context that exists only in experts' heads, irreversible actions, outcomes observed months later, or quality judged only by whether the output "looks good."

# Separate model capability from system capability


For every candidate, write down what the LLM does and what the product must provide around it.

| Required property                        | What the product must provide                                                                                                             |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Connection to current business reality   | Retrieval from approved sources, direct system APIs, timestamps, citations, and freshness checks                                          |
| Persistent identity and history          | Database state, workflow engine, event log, case identity, and versioned memory                                                           |
| Reliable action                          | Tool allowlists, schemas, deterministic validation, permission checks, approvals, and rollback                                            |
| Learning from experience                 | Stored corrections, labeled outcomes, rule updates, retrieval updates, prompt releases, fine-tuning where justified, and regression tests |
| Verification or reflection-like behavior | Independent validators, comparison with source evidence, task-specific evaluators, and human review                                       |
| Controlled delegation                    | Explicit limits on what may be read, proposed, approved, committed, or executed                                                           |

This distinction is central to the proposed approach. A single LLM invocation is not an agent under the strict definition. A runtime may form an agent-like system while the model remains a replaceable component. Changes caused by conversational context are not model learning, and generated self-criticism does not establish reflection.

A suitable product architecture often looks like this:

```text
unstructured inputs
        ↓
LLM produces a structured proposal
        ↓
source checks + deterministic validation
        ↓
risk and permission policy
        ↓
human approval when required
        ↓
business action
        ↓
outcome and correction captured
        ↓
evaluation set and regression gate
```


The model proposes. The system decides what can be trusted and what authority the proposal receives.

# Six opportunity patterns

## 1. Unstructured intake into a system of record


Convert emails, attachments, forms, calls, and documents into a complete structured case.

Examples include claims intake, freight orders, vendor onboarding, property-management requests, purchase requests, and customer escalation intake.

Measure:

* field-level accuracy;
* missing-information detection;
* routing accuracy;
* reviewer minutes per case;
* percentage of cases processed without correction;
* total cycle time.

This is a strong starting pattern because the input is messy while the expected output is relatively clear.

## 2. Evidence-backed review packets


Find relevant evidence across documents and systems, map it to a question or requirement, and prepare a review-ready response with citations.

Examples include security questionnaires, audit preparation, due diligence, policy reviews, contract obligations, quality reviews, and regulatory evidence collection.

Measure evidence coverage, citation correctness, unsupported-claim rate, reviewer edits, and completion time.

The product's value comes from assembling and checking evidence. It does not need to claim general understanding of the organization.

## 3. Exception triage


Read operational events, messages, records, and policies; identify cases that need attention; explain why; and propose the next step.

Examples include order exceptions, billing disputes, account anomalies, service escalations, inventory issues, and failed integrations.

Measure recall for important exceptions, false-positive burden, resolution time, escalation accuracy, and downstream outcomes.

This pattern works well when normal cases can be handled by deterministic software and the LLM focuses on messy exceptions.

## 4. Policy-constrained drafting and action


Draft messages, decisions, forms, or system changes based on current data and explicit policies.

Start with proposals and human approval. Expand authority only for narrow, reversible actions after enough evidence exists.

Measure approval rate, edit distance, policy violations, unsupported statements, rollback rate, and cost per accepted output.

## 5. Natural-language access to fragmented or legacy systems


Let users ask operational questions across databases, documents, reports, and older software.

Begin with read-only access and source-backed answers. Later stages can create reports or propose actions.

Measure answer correctness, source coverage, freshness, abstention quality, query completion time, and whether users still need an analyst to verify every answer.

## 6. Reliability and recovery for existing AI products


Many SaaS providers have already added an assistant, search feature, or workflow automation. A service could help them determine where it works, where it fails, and whether it produces business value.

A product or initial service could provide:

* a clear system and capability boundary;
* a test set based on real customer cases;
* failure categories and high-risk slices;
* traces for retrieval, tool calls, validation, and human overrides;
* release regression gates;
* online quality and business metrics;
* fallback and approval policies.

This directly uses the note author's eval and observability skills. The best differentiation will come from defining what "correct" means for a particular workflow, customer type, or industry.

# A capability-assumption audit


One way to discover opportunities is to examine current AI products and failed projects for unsupported assumptions.

| Product claim or assumption        | Question to investigate                                                                                     |
| ---------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| "It understands the customer"      | Does it work under changed wording, conflicting evidence, new cases, and interventions?                     |
| "It learns from every interaction" | What persistent state changes, and how does that change cause later behavior?                               |
| "It is an autonomous agent"        | What persists? Where is state stored? What selects actions? What authority does it have?                    |
| "It reflects and fixes itself"     | Is an independent signal evaluating actual processing, or is the model generating another plausible answer? |
| "It knows our company"             | Which current sources are connected, what happens when sources conflict, and how is freshness established?  |
| "It completes the workflow"        | Does it merely produce text, or does the surrounding system validate and commit the result?                 |

An opportunity exists when the underlying workflow is valuable but the current implementation relies on an unsupported assumption. A possible intervention is to redesign it as a bounded, observable system.

# How to find candidate workflows

## Examine work, not AI feature requests


Search for roles and teams that repeatedly:

* read many documents before taking one action;
* copy information between email, spreadsheets, PDFs, CRM, ERP, and ticketing systems;
* prepare the same report or review packet repeatedly;
* reconcile conflicting records;
* spend time checking completeness and policy compliance;
* handle many routine cases plus a smaller number of messy exceptions.

Useful sources include customer-support communities, software reviews, implementation consultants, job descriptions, process manuals, operations teams, and companies that have paused an AI pilot.

Search language such as the following often reveals useful pain:

```text
"[workflow] manual review"
"[role] copy and paste spreadsheet"
"[software category] reporting takes hours"
"[industry] document intake process"
"[workflow] backlog"
"[workflow] exceptions"
"[software] missing integration"
"[industry] AI pilot accuracy"
```

## Ask for real cases


Avoid interviews that stay at the level of "Would AI be useful?"

Ask the person to show the last five cases and reconstruct:

1. What triggered the case?
2. Which inputs were used?
3. Which systems were opened?
4. Which judgment was required?
5. What made the case difficult?
6. How was an error detected?
7. Who approved the result?
8. What happened after the decision?
9. What did the complete case cost in time or money?

Real artifacts are more useful than stated preferences. They also become the first evaluation set.

# The opportunity card


The strict dictionary uses working definition, unit of analysis, observable requirements, evidence, counterexamples, boundaries, and invalid inferences. That structure can be adapted directly to startup research.

Use one card per candidate:

```text
Workflow:
User:
Budget owner:
Trigger:
Input artifacts:
Current steps and systems:
Current time, cost, and error baseline:
Required output or action:

Model-level task:
System-level responsibilities:
Unit of analysis being evaluated:

Sources of truth:
Action authority:
Human approval points:
Fallback behavior:

Observable success criteria:
Offline evaluation set:
Important failure slices:
Online outcome metrics:
Observability required:

Expected value per case:
Expected review cost:
Expected error cost:
Integration cost:

Initial paid scope:
Expansion path:
Defensible data or integration:
Main invalid assumption:
Main reason to reject this opportunity:
```

# Score candidates before building


Score each dimension from 0 to 5 and multiply by the weight.

| Dimension                                      | Weight |
| ---------------------------------------------- | -----: |
| Pain, urgency, and available budget            |     20 |
| Case frequency and volume                      |     10 |
| Fit with unstructured or language-heavy work   |     15 |
| Ability to evaluate output objectively         |     15 |
| Ability to detect, contain, and reverse errors |     10 |
| Availability of historical data and feedback   |     10 |
| Access to systems and integrations             |     10 |
| Your access to users and distribution          |     10 |

Reject a candidate early when any of these are missing:

* a named buyer;
* access to representative artifacts;
* a measurable current baseline;
* a credible evaluation method;
* a way to contain high-cost errors.

The financial model should include review and error costs:

```text
net value per case =
    labor saved
  + faster-cycle value
  + avoided errors
  + additional revenue
  - human review cost
  - model and infrastructure cost
  - expected loss from incorrect outputs
```


A prototype that saves ten minutes but requires twelve minutes of checking has negative value even when its benchmark accuracy appears good.

<a id="where-i-would-start"></a>

# Proposed starting point


Proposed initial company shape: a **vertical workflow product with reliability built into the product**, using a paid AI reliability assessment as the discovery channel.

The initial offer to a SaaS provider or operations team could be:

1. Select one existing AI feature or workflow.
2. Map its model and system claims using the strict dictionary.
3. Build an evaluation set from actual cases.
4. Measure quality by case type, risk, and business outcome.
5. Add tracing, validation, abstention, approval, and fallback.
6. Compare the result with the current process.
7. Productize the repeated domain-specific components.

This allows the business to earn money while learning which problems repeat. After several engagements, the repeated evaluation rules, failure patterns, integrations, and workflow controls point toward the vertical product.

A good first thesis would be:

> We turn a document-heavy business workflow into a measured system in which the LLM interprets and proposes, approved sources provide evidence, software enforces policy, people retain defined authority, and every correction becomes evaluation data.

That thesis uses current LLM strengths without requiring claims about AGI, general understanding, intrinsic agency, or autonomous learning. It also makes evals and observability part of the customer value: lower review cost, visible quality, controlled failures, and measurable business outcomes.

[1]: https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai "The State of AI: Global Survey 2026 | McKinsey"
