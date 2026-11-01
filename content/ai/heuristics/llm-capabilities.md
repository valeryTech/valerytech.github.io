---
draft: false
toc: true
title: "LLM Capabilities"
description: "Fourteen reusable user-facing capabilities that LLM applications offer across consumer and B2B products, with the primitives underneath each, what makes it hard, how to evaluate it, and market examples."
linkTitle: "LLM Capabilities"
---

An application capability is a user-facing job an LLM performs inside a product—such as turning speech or photos into validated records, grounding mentions in an organization's private asset register, or investigating a question across a document set. Grouping product ideas by capability lets engineering and evaluation work on one application carry over to others that use the same capability.

Each capability is built from the information operations in [LLM primitives]({{< ref "ai/heuristics/llm-primitives" >}}) (`P1-P9`) and the non-model system parts (`M1-M7`) around them. For a builder-side catalog organized by input and output form, see [What LLMs are good at]({{< ref "ai/heuristics/what-llms-are-good-at" >}}).

## Summary


| # | Capability | Main primitives | Typical applications | Evaluate |
| --- | --- | --- | --- | --- |
| C1 | Reading feeds and streams, recommending what matters | P4, P5, P7 | News, research, and community readers | GR, HR, PS, RV |
| C2 | Learning a person's situation and wishes through conversation | P2, P6, P8 | Intake, onboarding, check-ins, discovery assistants | AP, HR, EV, PV |
| C3 | Turning everyday language, photos, or voice into structured records | P1, P2, P3, P6 | Expense, nutrition, mileage, and field-form capture | ST, TB, RF, AP, MM |
| C4 | Coaching from a person's speech or writing | P1, P5, P7 | Language, interview, sales, and writing feedback | HR, EV, MM |
| C5 | Portable memory and working context across tools and applications | P3, P4, P8, P9 | Cross-assistant memory stores, context firewalls, handoff layers | LT, PV, ST, GR |
| C6 | Structured data as the layer for answers and computation | P4, P5, P7 | Spreadsheet analysts, ledger Q&A, metrics copilots | RF, GR, CP |
| C7 | Voice commands for devices and physical environments | P1, P3, P6 | Smart-home, vehicle, and hands-free equipment control | MM, TB, RF |
| C8 | Grounding mentions in an organization's private names and assets | P1, P3, P4, P5, P6 | Context-aware dictation, CRM/ERP entity linking, GIS field lookup | GR, MM, CP, HR |
| C9 | Reconciling reports from multiple sources into one current picture | P3, P5, P6, P9 | Incident deduplication, ledger reconciliation, multi-source case state | ST, HR, LT, SC |
| C10 | Handoffs and status summaries that cite their source records | P4, P7, P9 | Shift handovers, audit or clinical case summaries, incident briefs | GR, HR, EV |
| C11 | Operating an application through language and its own screens | P3, P6, P7 | In-app copilots that filter views, draft records, and propose actions | TB, ST, AP, RF |
| C12 | Investigating questions and reviewing evidence across a document corpus | P4, P5, P6, P7 | Contract, audit, compliance, clinical, and literature workspaces | GR, HR, CP, EV |
| C13 | Analyzing, explaining, and migrating codebases and technical systems | P2, P3, P4, P5, P7 | Codebase search, bug reproduction, legacy rule recovery, change impact | RF, GR, TB, CP |
| C14 | Coordinating multi-step workflows and engagements across people and systems | P2, P6, P7, P8, P9 | Client document collection, scheduling, support resolution, follow-up | ST, AP, TB, LT |

### Evaluation focus codes


The **Evaluate** column names which aspects of an evaluation harness each capability stresses (for evaluation design, see [Evaluation]({{< ref "ai-engineering/evaluation" >}})):

- **GR** (Grounding): claims and matches rest on supplied documents, registers, or data rather than parametric memory.
- **RF** (Reference-based checks): outputs can be compared against exact expected values, test suites, or deterministic queries.
- **HR** (Human and domain review): acceptability requires user or specialist judgment rather than a fixed reference answer.
- **EV** (Evaluator validation): recurring qualitative criteria automated with a rubric or model judge calibrated against human labels.
- **ST** (State observations): actions update records or state that must be checked before and after execution.
- **TB** (Tool and action boundaries): tool calls, concrete arguments, permissions, and human confirmations.
- **AP** (Adaptive interaction): multi-turn flows where the next question or action depends on how the person responds.
- **MM** (Multimodal or noisy input): speech transcripts, photos, scans, or field audio.
- **LT** (Long-horizon behavior): consistency, staleness, and updates across shifts, days, or sessions.
- **PV** (Privacy and scope): access grants, redaction, retention, and cross-boundary leakage.
- **RV** (Run variability): stability across repeated runs and paraphrases.
- **CP** (Candidate comparison): replaying shared cases across alternative models, prompts, or retrievers.
- **PS** (Production sampling): reviewing real live traffic once deployed.
- **SC** (High-consequence review): asymmetric-cost settings where a single missed fault or false merge matters.

## C1. Reading feeds and streams, recommending what matters


**What the LLM does.** Reads a stream of posts, threads, articles, or newsletters; filters, summarizes, and recommends items for the person's stated interests rather than for platform engagement.

**What makes it hard.**

- Access: platform APIs and terms decide what can be read and from where.
- Changing preferences: the interest profile has to be explicit, inspectable, and editable by the reader.
- Groundedness: summaries must rest on the underlying posts without inventing claims.
- Filter narrowing: relevance and novelty pull in opposite directions.

**Evaluate.** GR (summaries grounded in posts), HR (the reader judges whether items were worth surfacing), PS (daily live feed samples), RV.

**Market examples.** Feedly, Readwise Reader, Ground News, Substack, Deepstash, Blinkist.

## C2. Learning a person's situation and wishes through conversation


**What the LLM does.** Asks, listens, and maintains an updated structured picture of a person's circumstances, goals, constraints, and preferences, then uses it to tailor a plan, intake brief, recommendation, or match.

**What makes it hard.**

- Asking the right question at the right moment without turning conversation into a tedious form.
- Recording only what the person actually stated rather than prefilling or inferring unconfirmed answers, or agreeing by default (`B8` in [LLM features]({{< ref "ai/heuristics/llm-features" >}})).
- Updating the profile when goals or circumstances change.
- Handling sensitive personal, health, or financial disclosures safely.

**Evaluate.** AP (each follow-up depends on the previous answer), HR, EV (criteria such as "was the question necessary and non-leading" can be automated after human calibration), PV.

**Market examples.** Noom, Finch, OkCupid (question-based matching), Cleo, client intake assistants in legal and financial practices.

## C3. Turning everyday input into structured records


**What the LLM does.** Turns everyday language, photos, scans, or voice notes into typed records with validated fields—a payment transaction, a meal log, an invoice, a mileage entry, or an inspection form.

**What makes it hard.**

- Underdetermined input: asking a brief clarifying question instead of guessing missing fields.
- Safe state changes: no write without confirmation where mistakes matter, and no silent duplicate or partial writes.
- Estimation error when the record involves physical quantities (portion sizes, line-item splits).

**Evaluate.** ST, TB, RF, AP, MM.

**Market examples.** Cronometer, Cal AI, MyFitnessPal, Dext, Expensify, MileIQ, Rocket Money.

## C4. Coaching from a person's speech or writing


**What the LLM does.** Analyzes how a person speaks or writes in realistic situations and gives targeted, actionable feedback.

**What makes it hard.**

- Specific rather than generic advice, without defaulting to empty praise (`B5`, `B8` in [LLM features]({{< ref "ai/heuristics/llm-features" >}})).
- Prioritizing one or two high-value corrections instead of overwhelming the learner.
- Speech input: transcription errors easily become false pronunciation or phrasing critiques.

**Evaluate.** HR, EV, MM.

**Related.** [Professional learning and rehearsal]({{< ref "ai/heuristics/b2b-job-families" >}}#8-professional-learning-and-rehearsal) in the B2B catalog.

**Market examples.** Duolingo, Praktika, Speak, Grammarly, Gong, Yoodli.

## C5. Portable memory and working context across tools and applications


**What the LLM does.** Keeps a user's or team's context in a controlled store and supplies scoped slices to the tools and AI services they use—or passes working findings, tasks, and decisions with provenance between independent applications under explicit read and write grants.

**What makes it hard.**

- Selecting what deserves to be stored and giving the owner clear inspection and deletion controls.
- Enforcing scope boundaries between applications and providers (`G7` in [LLM primitives]({{< ref "ai/heuristics/llm-primitives" >}}#guarantees)).
- Stale or contradicted memories continuing to steer later sessions.
- Ensuring revocation or deletion reaches downstream copies and derived artifacts (`G8`).
- Cross-application prompt injection: untrusted text written by one tool acting as an instruction inside another (`A5`).
- Cold-start incentives: why independent applications agree to read from and write to an external context store (`M1`).

**Evaluate.** LT (behavior across days and sessions), PV, ST, GR.

**Market examples.** Mem0 (application memory layer), Letta, user-held portable memory formats across assistants, browser context extensions.

## C6. Structured data as the layer for answers and computation


**What the LLM does.** Uses spreadsheets, relational tables, or ledgers as the authoritative source for answers and translates questions into deterministic queries or formulas instead of computing numbers in prose.

**What makes it hard.**

- Executable but semantically wrong queries—for example, aggregating trace durations without grouping by trace ID first ([Evaluation failure modes]({{< ref "ai-engineering/concepts/evaluation/evaluation-failure-modes" >}})).
- Evolving schemas, ambiguous business metric definitions, and loosely formatted spreadsheets.

**Evaluate.** RF (numerical answers can be checked against reference queries), GR, CP.

**Market examples.** Julius AI, Hex Magic, Microsoft Copilot in Excel, Google Workspace Gemini in Sheets, text-to-SQL BI assistants.

## C7. Voice commands for devices and physical environments


**What the LLM does.** Maps spoken requests to a closed catalog of device, appliance, or field-equipment actions.

**What makes it hard.**

- Far-field noise, clipped utterances, and deictic references ("turn down the other one").
- Requiring confirmation before irreversible or safety-relevant actions.
- Bundled competition from operating-system and hardware makers.

**Evaluate.** MM, TB, RF.

**Related.** `C11` performs the analogous job inside a software application where on-screen state supplies context and visual feedback.

**Market examples.** Amazon Alexa, Apple Siri, Google Home, SmartThings, in-vehicle voice assistants.

## C8. Grounding mentions in an organization's private names and assets


**What the LLM does.** Maps a spoken or written mention to an entity in an organization's own register—such as a customer account, repository symbol, SKU, project code, or physical pipe segment—using retrieved candidates and context rather than parametric memory, and returns either a grounded entity with evidence or a clarifying question.

**What makes it hard.**

- Private vocabulary: the model has never seen the organization's internal identifiers, so parametric guesses (`B10`) must lose to the register (`M2`).
- Noisy speech and imperfect registers: speech recognition mangles proper nouns (`Acme` heard as `acne`), and physical asset registers can themselves be incomplete or outdated.
- Spatial candidate sets: for field equipment, candidates depend on GPS proximity (often accurate only to tens of meters) alongside spoken descriptions.
- Asymmetric error cost: a confident wrong match corrupts downstream records, whereas asking costs one turn.

**Evaluate.** GR (matches trace back to register entries), MM (spoken or field input), CP (candidate generators compared on shared cases), HR.

**Market examples.** Aqua Voice and Wispr Flow (context-aware dictation with custom dictionaries), Esri Survey123 and Fulcrum (asset-linked field capture), CRM entity-linking copilots.

## C9. Reconciling reports from multiple sources into one current picture


**What the LLM does.** Ingests reports, transactions, or updates arriving from several people and systems over time and maintains one current state: which items refer to the same underlying event or obligation (`P9`), where accounts conflict, and which status is superseded.

**What makes it hard.**

- Asymmetric link errors: a false merge can hide a second active fault or duplicate payment, whereas a missed link merely creates extra review work.
- Error compounding (`D6`): once the system links two records, that link re-enters future context as apparent fact unless provenance stays separate.
- Automation bias: reviewers rubber-stamp suggested merges unless conflicting evidence is shown side by side without preselection (`M5`).
- Reversibility: merges and status transitions must remain undoable (`G8`).

**Evaluate.** ST (world state before and after each incoming report), HR, LT (over a shift or accounting period), SC.

**Market examples.** Automated accounting reconciliation (Numeric, FloQast), IT incident correlation (PagerDuty, Rootly), multi-crew field incident tracking.

## C10. Handoffs and status summaries that cite their source records


**What the LLM does.** Produces a shift turnover, case brief, or status summary across many underlying records in which every claim opens its source items and unresolved gaps stay prominent.

**What makes it hard.**

- Fluent prose easily drops the single open fault or exception that the next person most needs to see.
- Selecting what matters for the incoming role's next decisions rather than dumping a chronological log.
- Preserving uncertainty: unresolved conflicts must stay visibly open instead of being smoothed over (`B8`).
- Auditability: regulated operational logs require original entries to remain unaltered (`G1`).

**Evaluate.** GR, HR (judged by the receiving operator or reviewer), EV.

**Market examples.** Industrial shift-handover logs (Hexagon j5, eLogger), clinical sign-out summaries, incident postmortem and on-call handoff tools.

## C11. Operating an application through language and its own screens


**What the LLM does.** Inside an existing software product, translates a user's request into the application's native views, drafts, and actions, resolving references against what is currently visible on screen ("this customer," "the top cohort").

**What makes it hard.**

- Closed action vocabulary: the model must compose only from registered UI components and domain operations rather than inventing unsupported steps.
- Concrete argument validation: a syntactically valid tool call with the wrong target ID or filter still executes unless concrete arguments are checked and approved (`M6`).
- Exposing live UI state cleanly so screen-relative references resolve unambiguously.
- Enforcing permissions and business invariants in the host application (`M4`), never in the prompt.

**Evaluate.** TB, ST, AP, RF.

**Market examples.** CopilotKit (AG-UI / A2UI protocols), Vercel AI SDK generative UI, Linear and Notion in-app assistants, Salesforce Agentforce.

## C12. Investigating questions and reviewing evidence across a document corpus


**What the LLM does.** Helps a professional examine a bounded set of contracts, filings, clinical notes, policies, or research papers to answer specific questions, surface supporting and contradicting passages, and assemble a reviewable finding or synthesis (`P4`, `P5`, `P6`, `P7`).

**What makes it hard.**

- Abstaining when evidence is absent (`B8`): models continue to answer from answerless documents unless sufficiency gates (`G4`) and explicit "not in corpus" states are enforced.
- Distinguishing provenance from support: quoting an existing paragraph does not prove the passage establishes the claim under the applicable version, scope, or effective date ([Search for domains]({{< ref "ai/heuristics/input/search-for-domains" >}})).
- Bounding completeness claims (`G5`) when retrieval sees only a slice of a large repository.
- Propagating staleness (`G6`) when an underlying policy, amendment, or record changes.

**Evaluate.** GR, HR (specialist judgment on support and material omissions), CP (retrieval and reranking channels compared on recall), EV.

**Related.** [Evidence review and case preparation]({{< ref "ai/heuristics/b2b-job-families" >}}#2-evidence-review-and-case-preparation) and [Research, analysis, and professional decisions]({{< ref "ai/heuristics/b2b-job-families" >}}#3-research-analysis-and-professional-decisions).

**Market examples.** Harvey and Legora (legal review), Hebbia (financial and diligence matrices), Elicit and Consensus (scientific literature synthesis), Vanta and Anecdotes (security control evidence).

## C13. Analyzing, explaining, and migrating codebases and technical systems


**What the LLM does.** Navigates source repositories, schemas, logs, and dependency graphs to explain existing system behavior, reproduce defects, assess change impact, or extract business rules from legacy code (`P2`, `P3`, `P4`, `P5`, `P7`).

**What makes it hard.**

- Combining semantic reading with exact static and runtime facts: token prediction (`A1`, `A8`) misses call-graph edges, symbol definitions, and dynamic configuration unless paired with compilers, LSPs, and test runners.
- Separating "tests pass" from "intended specification holds": a generated test or migration patch can execute cleanly while relaxing an edge-case business rule ([Search for domains, 2]({{< ref "ai/heuristics/input/search-for-domains-2" >}})).
- Scaling across large repositories without losing cross-file invariants (`A3`, `D7`).

**Evaluate.** RF (compiler, type-checker, and test-suite verification), GR (claims tied to exact symbols and traces), TB (sandboxed execution), CP.

**Related.** [Technical and industrial work]({{< ref "ai/heuristics/b2b-job-families" >}}#4-technical-and-industrial-work).

**Market examples.** GitHub Copilot, Cursor, Sourcegraph Cody, Bloop and AWS Transform (mainframe and legacy modernization).

## C14. Coordinating multi-step workflows and engagements across people and systems


**What the LLM does.** Tracks an ongoing request, onboarding intake, or professional engagement across participants and tools—collecting missing documents, answering routine status questions, scheduling steps, drafting follow-ups, and updating operational trackers (`P2`, `P6`, `P7`, `P8`, `P9`).

**What makes it hard.**

- Asymmetric authority across participants: clients, frontline staff, and approving specialists hold different permissions and see different slices of the case (`M4`, `G7`).
- Multi-step composition hazards: individually valid API calls (rescheduling, issuing a credit, closing a ticket) can violate workflow invariants when retried or run against stale state (`M6`).
- Knowing when to stop automated follow-up and escalate an ambiguous or sensitive situation to a person (`P6`).

**Evaluate.** ST (multi-system state consistency), AP, TB, LT (behavior across days and waiting periods).

**Related.** [Professional practice and client collaboration]({{< ref "ai/heuristics/b2b-job-families" >}}#1-professional-practice-and-client-collaboration) and [Business workflows and service operations]({{< ref "ai/heuristics/b2b-job-families" >}}#5-business-workflows-and-service-operations).

**Market examples.** Sierra and Decagon (customer issue resolution), Paradox and Ashby (recruiting coordination), Karbon and Canopy (accounting client document collection).

## Related notes


- [What a capability claim says]({{< ref "ai/capabilities/01-what-is-a-capability-claim" >}}) treats a capability as a dispositional property of a model and examines what evidence is required to carry a capability claim from one task or setting to another.
