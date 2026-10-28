---
draft: false
toc: true
description: "Why product purpose, collaboration, action authority, evidence acceptance, and platform scope need separate treatment, with targeted changes to the taxonomy, practitioner guide, and estimation method."
title: "Ai Product Types Improvement Proposal"
linkTitle: "Ai Product Types Improvement Proposal"
---
# Improving the AI product taxonomy and practitioner guide


Date: 2026-10-18. Proposed revisions to the earlier AI product taxonomy (now superseded by the [worked project examples]({{< ref "ai/var/02-ai-project-examples/ai-project-examples-and-design-model" >}})) and the [practitioner guide]({{< ref "ai/var/practitioner-guide-seven-ai-product-types" >}}).

Status: implemented in both documents on 2026-10-18. The review below records the reasoning about the earlier drafts; the rewritten documents contain the current synthesis.

This review starts from the [research map]({{< ref "ai/design-research/document-map" >}}) and follows selected notes on work structure, collaboration, verification, evidence synthesis, operation authority, and interactive systems, including their editorial comments. It is a conceptual review, not an exhaustive rereading of the collection or an independent fact check of the guide's external references. The research contains retained dialogues, later corrections, and proposals; the recommendations below are a conceptual synthesis, not claims that the collection has validated a single architecture.

## 1. Keep the seven archetypes; change the comparison model


The short note already recognizes that its categories overlap. The guide also makes useful distinctions about evidence, permissions, evaluation, and integration. Preserve those strengths, including the concrete workflow examples, MVPs, and product-specific failure modes.

The main inconsistency is that the short note then introduces four architectural "levels," while the guide describes a progression from Type 1 to Type 7. The categories mix interaction format, business purpose, specialization, execution behavior, and infrastructure scope. They cannot support one ordering of sophistication, cost, autonomy, or data sensitivity.

For example, a bounded booking workflow can execute consequential writes. A research workspace can be difficult to build while having no external write authority. A general work assistant can handle very sensitive documents. A forecasting application can serve one decision without being a reusable platform.

Use two complementary descriptions:

1. **Product archetype:** What work does the product primarily help someone do?
2. **Deployment profile:** What context, collaboration, authority, evidence, continuity, and integration does this particular implementation require?

This follows the research's [work-complexity discussion]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}#complexity-profile-and-examples), which treats complexity as a profile, and its [responsibility-allocation model]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}#responsibility-allocation-and-handoff), which separates information, execution, judgment, and authority.

## 2. Proposed changes to ai-product-types.md

### Replace the current table with a clearer set of archetypes


The numbering below preserves correspondence with the existing documents. It does not describe a sequence.

| # | Proposed archetype | Primary work and objects | Defining design question |
|---|---|---|---|
| 1 | Bounded workflow assistant | A request moves through known states toward a defined outcome: booking, account recovery, form submission. | Can permitted requests reach the correct state, including exceptions and handoffs? |
| 2 | General work assistant | People ask, draft, explain, compare, and explore across many tasks. Objects may include messages, documents, code, and analyses. | Which intended tasks produce useful results, and how can users evaluate and revise them? |
| 3 | Contextual support assistant | A customer issue is resolved using product knowledge, authenticated account state, and case history. | Does the assistance fit this customer's actual state, and can unresolved work transfer with its context? |
| 4 | Investigation and evidence-synthesis system | Questions, source passages, claims, contradictions, and evidence requirements develop into findings or reports. Audit is one application. | What supports the finding, what was examined, and what remains unresolved? |
| 5 | Domain work copilot | A professional develops or checks a domain artifact: a clinical note, translated transcript, reviewed document, or classified receipt. | Which domain properties must hold, and what can the professional meaningfully inspect and change? |
| 6 | Delegated operations and coordination system | A delegated goal becomes plans, tool operations, waits, exceptions, and handoffs across systems. | Who chooses the next step, who may commit each effect, and how does work recover? |
| 7 | Analytical and decision system | Rules, calculations, forecasts, simulations, or optimization produce estimates and decision options. | Does the analysis improve a defined decision under stated assumptions and changing conditions? |

These are intentionally overlapping archetypes. An investigation product can include a domain copilot and delegate operations. A support product can use a bounded workflow for refunds while offering broader issue diagnosis.

Three naming changes matter most:

- **"General chatbot" -> "General work assistant."** Chat describes a channel. It does not distinguish drafting in a document, working through an analysis, or discussing a question.
- **"Reporting and audit" -> "Investigation and evidence synthesis."** This includes exploratory questions, contradictions, incomplete evidence, and abstention. A report is one possible output; improved understanding can also be the outcome.
- **Separate analytical systems from platform scope.** The original Type 7 includes complex rules and pipelines. The guide narrows this to an ML training and serving platform. Retain rule-based and hybrid analytical systems, and describe a reusable platform as an architectural scope available to every archetype.

The [sensemaking note]({{< ref "ai/design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-action" >}}) motivates understanding as an outcome. The [composition dialogue]({{< ref "ai/design-research/interactive-systems/03-composable-investigation-workspaces" >}}#original-dialogue) also preserves the author's concern that a fixed matrix, cube, or graph could constrain useful combinations of operations.

### Replace the four levels with one deployment profile


For any example product, answer the same questions:

| Dimension | What to specify |
|---|---|
| Work and outcome | Is this a bounded transaction, investigation, document, ongoing case, monitoring activity, or decision? What counts as progress or completion? |
| Context and meaning | Which sources and live systems matter? Who owns definitions, permissions, freshness, and source precedence? |
| Collaboration | Who supplies information, performs work, judges contributions, and holds authority? How can people steer or disagree? |
| Effects and autonomy | Which actions are read-only, proposed, prepared, or executed? Under whose authority, with what limits and consequences? |
| Evidence and acceptance | What checks support the result? Who or what can accept which result revision for which purpose? |
| Continuity and recovery | What survives across sessions, waits, source changes, interruptions, and failures? What becomes stale? |
| Integration and reuse | Which systems must coordinate? Is this one application, a shared service, or a platform for multiple products? |

These are description fields, not a numerical score. Autonomy belongs to particular actions; sensitivity belongs to the data and use; platform scope belongs to deployment architecture.

Also qualify the assistant/agent/platform distinction. Those labels describe compatible aspects of a system: assistance describes a relationship to a person, agentic behavior describes delegated action selection and execution, and a platform describes reusable provision of capabilities. Tool use alone does not distinguish a fixed workflow from an agentic one.

Because the short file begins with a source dialogue, preserve that original passage if it is intended as a record. Put an authoritative revised taxonomy in a clearly marked synthesis section or companion note rather than silently rewriting the original question.

## 3. Proposed changes to the practitioner guide

### A. Rewrite the opening and remove the implied ladder


Replace the executive summary's "practical progression" and the conclusion's "moving from Type 1 towards Type 7" with an explicit account of overlapping requirements.

Suggested opening:

> AI products combine different kinds of work, context, collaboration, and authority. These seven archetypes describe common product purposes; they are not maturity levels. For each deployment, define the work people and software share, the evidence required to use a result, the actions each participant may perform, and how the work remains understandable and recoverable over time. Those choices determine architecture, evaluation, and cost more reliably than the presence of a chat interface or an "agent" label.

Revise the decision test accordingly. Health or financial consequences should trigger questions about consequences and assurance across all types. Changing another system should trigger effect controls even in Type 1. Needing shared infrastructure should change the reuse profile rather than reclassify the application's purpose.

### B. Add collaboration design to every product section


The existing template covers architecture, engineering effort, data, validation, security, MVPs, and launch gates. Add a compact subsection before the architecture:

- **Shared work:** Which objects, assumptions, decisions, and unresolved questions can people inspect?
- **Responsibilities:** Who contributes information, executes work, judges the result, and authorizes commitment?
- **Interaction:** Where should people use language, direct editing, filters, comparisons, or review controls?
- **Steering and recovery:** How can people change constraints, interrupt, reject, resume, or hand off work?

Choose only the objects needed for that workflow; a universal workspace ontology is unnecessary. A support case may need issue state and an escalation package. A document copilot may need protected passages and proposed edits. A forecast may need scenario assumptions and an editable comparison with the baseline.

The [design-practices note]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices" >}}#practices-that-apply-across-all-three-shifts) provides useful questions. Its [comments]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices-comments" >}}) qualify confidence, reversibility, and shared state. Stored context alone does not establish shared understanding, and a generated explanation is not necessarily a faithful execution record.

Do not add a mandatory approval dialog to every operation. Give review a defined purpose and enough evidence for the reviewer to exercise judgment. Choose delegation, proposal/review, joint construction, critique, or shared reasoning according to the work. See the [pattern-selection discussion]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}#choosing-the-right-pattern).

### C. Separate checks, acceptance, and authority


The opening asks how strongly output must be "proved correct." The closing correctness table then treats traceability or professional acceptance as sufficient for some categories. Both need qualification.

Ask separate questions:

| Concern | Question |
|---|---|
| Intent | Did the system interpret the intended task and important terms correctly? |
| Admissibility | Are the proposed inputs, operations, and transitions valid under the relevant contracts? |
| Execution | What actually ran, completed, failed, or produced an uncertain external outcome? |
| Result quality | What checks and evidence support the required factual, behavioral, and domain properties? |
| Acceptance | Is this exact result suitable for this purpose, under the stated conditions? |
| Authority | May this principal perform this concrete action on these resources with these arguments? |

These are distinct questions, not necessarily six sequential screens or a requirement to build a compiler. A typed request can express the wrong intent. A traceable claim can be unsupported. A professional can approve an error. An accepted internal finding can still lack authorization for publication.

The [verification-and-acceptance note]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}#scope-and-status) supplies the central distinctions. The [concrete-operation authority discussion]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}#authorization-of-concrete-operations) explains why access to a tool is insufficient.

### D. Strengthen the evidence contract for Types 3-5


The guide already covers citations and lineage. Extend this to the questions those records must answer:

- Which source revision and passage support each material claim?
- Which required evidence was sought, and what remains missing?
- What failed ingestion, parsing, retrieval, or examination?
- Which sources conflict, and which applicability or precedence policy was used?
- When should the system qualify a finding, return a partial result, or abstain?

Keep claim support, examination coverage, and source conflicts separate. A claim can have supporting evidence while corpus coverage remains incomplete. Processing every document does not prove that every relevant fact was found.

Use the [bounded-corpus evidence proposal]({{< ref "ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis" >}}) together with its [comments on completeness and authority]({{< ref "ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis-comments" >}}). Describe coverage methods and measured limitations instead of adopting an unconditional completeness guarantee.

### E. Add continuity and recovery for work that outlives one interaction


Types 3-6 can involve waits, changed goals, concurrent edits, asynchronous results, and external state changes. Type 7 can involve changing data and assumptions. Logging model and prompt versions is useful but insufficient.

Specify the relationships between the goal revision, input snapshots, procedure/configuration version, execution attempt, result revision, checks, acceptance purpose, and any external effect.

The guide should state what happens when:

- An older run finishes after a newer one.
- A source or user constraint changes while work is running.
- An external write times out and its outcome is unknown.
- Someone cancels work after an effect has already occurred.
- A person edits an accepted artifact.

Distinguish inspecting recorded observations, rerunning computation, and executing external operations again. The current requirement that "a run can be replayed from its trace" needs these qualifications. Specify idempotency where the operation supports it, reconciliation for uncertain outcomes, and compensation where appropriate; avoid promising universal rollback.

The [run-history comments]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results-comments" >}}#inspection-and-replay) and [edits/runs/result-use proposal]({{< ref "ai/design-research/interactive-systems/13-edits-runs-and-result-use" >}}) provide concrete starting points.

### F. Evaluate the human and system together


Keep the existing model, retrieval, workflow, and business measures. Add tests of the collaboration claim:

- Can reviewers detect plausible errors with the supplied evidence? Include correct cases to measure unnecessary rejection.
- Does a changed instruction affect subsequent behavior?
- Can a person explain what has completed, what remains unresolved, and who owns the next step after a handoff?
- Can people recover from a partial failure without rebuilding the case?
- Do time savings remain after review, correction, and exception handling?
- If understanding or learning is the goal, does it improve beyond assisted task completion?

Compare against the existing process, a simpler workflow, and alternative interaction designs where relevant. Test human-alone and AI-alone baselines when claiming complementarity.

Replace the statement that professional workflows "naturally provide ground truth and sign-off." They provide opportunities for expert review, but judgments can be mistaken, disagree, or address different purposes. Preserve assessor, reason, uncertainty, and disagreement. See the [collaboration-evaluation comments]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation-comments" >}}).

### G. Rework estimates and source presentation


The guide appropriately labels its cost figures as planning synthesis. The remaining problem is that the comparison table still presents precise "typical" ROI windows and assigns sensitivity and autonomy by category without an estimation method.

Keep numerical estimates only as named scenarios with explicit scope, staffing assumptions, integration inventory, data readiness, evaluation burden, and rollout conditions. Separate implementation cost from operating cost, reviewer effort, exception handling, and continuing maintenance. Estimate payback from the organization's volume, baseline cost, realized benefit, adoption, and ongoing costs rather than from the archetype number.

For source claims, distinguish vendor-reported deployments, engineering descriptions, measured studies, design proposals, and the guide author's estimates. A customer success percentage illustrates one deployment; it does not establish a general architectural rule or expected ROI.

Before publication, separately revalidate model names/prices, legal timelines, and dated deployment claims. In particular, check the Opus 5.5 pricing passage and reference 15 against a dated pricing source, and replace broad landing pages such as Workiva's investor-relations reference with the exact source supporting the claimed release. These are verification requests, not findings that the claims are false.

### H. Derive shared infrastructure from required properties


Keep the guide's advice to start with a thin shared platform. Add one step before its component diagrams:

**Desired property -> observable failure -> constraint or check -> enforcement owner -> evidence that it works.**

For example, "a prepared refund must not be executed under an approval for a different amount" motivates binding the authorization to the concrete operation and checking it at execution. A tool registry or audit store alone does not establish that property.

The [builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}#a-builder-method-for-minimal-semantic-constraints) motivates this approach. Its [comments]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method-comments" >}}) explicitly caution that proposed mechanisms are not proven consequences of a complexity profile.

## 4. A worked example to add to the guide


Use one example to make the relationships tangible:

1. An analyst asks whether a contract collection complies with policy revision P1. The product records the scope, source snapshot, evidence requirements, and unresolved interpretations.
2. A run produces extracted clauses, candidate findings, supporting passages, and examination gaps. A table or source viewer lets the analyst inspect and correct them.
3. The analyst changes a materiality threshold. That changes the task interpretation or configuration, so affected findings need reconsideration. Sorting the display alone does not change the analysis.
4. The analyst accepts finding F2 for an internal review. The decision concerns that revision and purpose. It does not authorize filing or emailing a final report.
5. Policy P2 arrives. The system preserves the earlier result and decision while identifying dependent work that may need another check. It does not silently present F2 as accepted under P2.
6. If repeated analyst interventions suggest a reusable extraction rule, record it as a policy candidate, evaluate it on separate cases, and decide whether to adopt it. One useful correction is not automatically a future default or a grant of authority.

This combines investigation, domain work, and potentially delegated operations. It shows how archetypes compose, why several views can help, and why result acceptance differs from action authority. It does not require a particular database, DSL, or orchestration framework.

The final step also reflects the research's distinction between [runtime review and design learning]({{< ref "ai/design-research/interactive-systems/10-exploratory-pipeline-design-and-progressive-automation-comments" >}}#separate-runtime-review-from-design-learning). Review can be valuable for the current task even when it produces no new automation.

## 5. Suggested editorial sequence


1. Revise the short taxonomy first: keep seven recognizable archetypes, remove the four levels, separate platform scope, and add the deployment profile.
2. Align the guide's introduction, comparison table, decision test, and conclusion with that framing.
3. Add collaboration design, evidence conditions, and continuity/recovery to the existing per-type template. Retain concrete architecture and MVP material where it still fits.
4. Add the worked example and joint evaluation questions.
5. Recast quantitative estimates as scenarios, perform the separate citation check, and move repeated vendor stories into a compact case-study appendix.

The short note should explain how to classify and compare a product. The guide should show how a deployment profile leads to design decisions, validation, operating requirements, and an estimate.
