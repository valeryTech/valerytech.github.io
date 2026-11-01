---
draft: false
toc: true
title: "Search for Domains by Work Structure (Dialogue 1)"
description: "Saved dialogue on selecting candidate domains by the underlying structure of the work—requirements, distributed evidence, uncertainty, temporal scope, and separate authority—rather than by industry."
linkTitle: "Search for Domains (1)"
---
# Search for domains by work structure


Saved dialogue kept as written; distilled rules appear in [Heuristics for finding LLM product ideas]({{< ref "ai/heuristics" >}}).

Yes. **Start with the structure of the work, then identify domains that share that structure.** That will give you a better basis for both research and product selection.

I would treat the architecture in the passage as a hypothesis. We should test which parts recur across domains before committing to a horizontal framework.

There are three separate questions:

1. Which workflows share the same underlying problems?
2. Which provide accessible data and meaningful tests for your research?
3. Which offer a viable business?

A domain can be useful for the first two without being a good market to enter.

## 1. Define the underlying properties


The class I would initially investigate is:

> **Workflows where people must make and maintain a justified assessment using explicit requirements, incomplete evidence, and expert interpretation, with controlled authority to act.**

"Complex," "regulated," and "document-heavy" are insufficient selection criteria. The following properties are more useful.

|Property|What to look for in a workflow|Why it matters for your research|
|---|---|---|
|**Requirements with identifiable authority and scope**|Policies, contracts, standards, protocols, or specifications apply to a particular subject, jurisdiction, version, and period.|Tests requirement representation, applicability, exceptions, and faithful interpretation.|
|**A mixture of explicit rules and semantic judgment**|Some conditions are arithmetic or logical; others require interpreting what a document or event means.|Creates a reason to combine LLMs with deterministic components.|
|**Evidence distributed across representations**|Relevant facts appear in documents, tables, logs, measurements, messages, and structured records.|Tests retrieval, entity matching, extraction, and evidence integration.|
|**Incomplete and conflicting knowledge**|Missing information and disagreement can change the assessment or require more investigation.|Requires explicit uncertainty and conflict handling.|
|**Temporal and contextual dependence**|The answer depends on what was true at a particular time, under a particular requirement version.|Tests state reconstruction, dates, scope, and stale evidence.|
|**Dependencies between conclusions**|Changing one requirement, fact, or interpretation can affect several downstream findings.|Makes revision tracking and reassessment meaningful.|
|**Separate responsibility and authority**|Different people may supply evidence, interpret it, approve a conclusion, and authorize an action.|Tests review protocols, permissions, and execution boundaries.|
|**Consequences that can be evaluated**|Errors, omissions, delays, and review effort have observable effects.|Allows testing whether the architecture improves the work.|

I would use these as a **profile**, rather than requiring every workflow to score highly on everything.

Your document map already preserves several distinctions needed here: evidence support versus provenance, structural validity versus semantic truth, acceptance versus authority to act, and evidence-quality evaluation versus runtime and human-collaboration evaluation. Those are useful dimensions for the comparison. document-map

One additional boundary: the quoted pipeline primarily describes **assessment against requirements**. Broader investigation -- such as diagnosing a failure -- also involves generating hypotheses, choosing what evidence to collect, and revising the question. I would study that as an adjacent class rather than assume the same pipeline covers it completely.

## 2. Refine the proposed model before looking for matches


Three refinements would make the comparison more precise.

### Requirements need their own evidence and review


The step from "authoritative specification" to "typed requirements" is itself a fallible interpretation.

A requirement representation needs to preserve its source, applicability, exceptions, effective dates, and review status. A generated rule that passes a type checker can still misrepresent the source.

Catala is relevant precedent: its approach connects legislative text with executable definitions and provides a representation intended for review by legal experts. It does not make arbitrary natural-language interpretation automatically correct. [GitHub](https://github.com/catalalang/catala)

### Evidence status, requirement outcome, and approval are different


I would avoid one universal status field containing everything.

A case can have:

|Dimension|Example states or records|
|---|---|
|Evidence assessment|Supporting evidence, counterevidence, insufficient evidence, unresolved conflict|
|Requirement assessment|Satisfied, violated, unresolved, not applicable|
|Review|Proposed, reviewed, accepted, rejected|
|Action authority|Permission for a specified action, scope, and result version|

For example, an assessor can accept the conclusion **"insufficient evidence to determine compliance."** That is an accepted assessment, but it does not establish compliance or authorize an operational action.

Likewise, provenance records how something was produced. W3C PROV provides models for entities, activities, agents, and derivation. Whether a source actually supports a particular conclusion requires an additional assessment. [W3C](https://www.w3.org/TR/prov-overview/)

### The workflow needs revision and further investigation


Consider this **hypothetical** security requirement:

> Every production administrator account must have enforced multifactor authentication throughout the review period.

A policy document expresses the obligation. A current configuration export provides evidence about one point in time. Neither alone establishes compliance throughout the period.

The system needs to ask whether the account inventory is complete, which identity systems are covered, what historical evidence exists, and whether an exception applies.

That gives you several different problems: interpreting "administrator," identifying the population, evaluating configuration, checking time coverage, and deciding what evidence is still needed. A single generated "compliant" label hides them.

This is the kind of concrete case I would use to identify structural similarities.

## 3. Candidate domains and the specific workflows to examine


The sources below establish existing workflows, standards, or research resources. **The proposed prototype scopes are my judgments about research fit; they do not establish weak competition or commercial demand.**

|Domain and workflow|How it matches the properties|Useful prototype boundary|
|---|---|---|
|**Security control evidence assessment**|Requirements must be connected to observations, evidence, risks, findings, and assessment scope. OSCAL already represents these objects and distinguishes assessors from authorizing officials. [NIST Pages](https://pages.nist.gov/OSCAL/learn/concepts/layer/assessment/assessment-results/)|Assess a small set of controls using configuration exports, policies, logs, and exception records. Produce reviewable findings and evidence gaps.|
|**Engineering verification and change review**|Requirements connect to designs, tests, and other requirements. NASA's requirements-management process explicitly includes bidirectional traceability, change-impact analysis, configuration control, and approval. [NASA](https://www.nasa.gov/reference/6-2-requirements-management/)|Given a changed requirement, identify affected tests, design documents, and previously accepted verification results. An engineer reviews the proposed impact analysis.|
|**Manufacturing quality and batch-record review**|Production records, laboratory results, deviations, and procedures must be reconciled against the correct specifications. FDA's API manufacturing guidance explicitly describes these records and quality-unit review before release. [U.S. Food and Drug Administration](https://www.fda.gov/regulatory-information/search-fda-guidance-documents/q7a-good-manufacturing-practice-guidance-active-pharmaceutical-ingredients)|Prepare a batch-review package: missing records, inconsistent identifiers, unresolved deviations, and evidence for each check. Keep batch release outside the prototype's authority.|
|**Financial audit evidence review**|An assertion requires evidence that is relevant and reliable; inconsistent sources require additional procedures. PCAOB AS 1105 explicitly separates these concerns. [Default](https://pcaobus.org/oversight/standards/auditing-standards/details/AS1105)|Support one audit procedure, such as matching selected transactions to supporting documents and identifying discrepancies. Preserve the auditor's judgment and sign-off.|
|**Contract obligation and exception analysis**|Obligations depend on definitions, cross-references, exceptions, and amendments. ContractNLI provides a public research task involving supported, contradicted, and unmentioned hypotheses with evidence spans. [arXiv](https://arxiv.org/abs/2110.01799)|Assess a bounded set of questions against a contract and amendments, showing supporting and opposing passages. Add operational evidence only in a later study.|
|**Tax or benefit eligibility preparation**|Rules combine thresholds, dates, household or entity relationships, and exceptions. OpenFisca separates a reusable calculation engine from jurisdiction-specific rules and parameters. [OpenFisca](https://openfisca.org/doc/key-concepts/tax_and_benefit_system.html)|Assemble a reviewable case from supporting documents, identify missing inputs, and pass verified values to an existing rule implementation. Avoid autonomous adverse determinations.|
|**Construction information and specification review**|Project requirements must be matched to delivered building information. buildingSMART's IDS represents machine-readable requirements for IFC models and supports automated checking of specified information. [buildingSMART](https://www.buildingsmart.org/standards/bsi-standards/information-delivery-specification-ids/)|Help convert a bounded written information requirement into a reviewed specification, then connect documents and model properties to deterministic validation. Treat geometric and physical-safety analysis separately.|
|**Software supply-chain assurance**|Artifact identity, provenance, expected build properties, and trust configuration are explicit. SLSA defines verification of signatures, artifact digests, builder identity, and expected parameters. [SLSA](https://slsa.dev/spec/v1.2/verifying-artifacts)|Use existing verifiers. Investigate the surrounding work: interpreting requirements, reviewing exceptions, and assembling an assurance record.|

The last example is particularly useful as a **boundary test**. Much of supply-chain verification should remain deterministic. Its similarity to healthcare does not imply that an LLM improves the verification step.

OPA makes the same boundary visible: it evaluates policies over structured data and separates policy decisions from enforcement. Your research could examine how evidence becomes suitable input to that evaluator, and how the resulting decision is reviewed and used. [Open Policy Agent](https://www.openpolicyagent.org/docs)

## 4. What actually transfers between domains?


The strongest evidence of a shared abstraction would be **the same failure and the same corrective mechanism appearing in different workflows**.

For example:

|Shared problem|Manifestations in different domains|Candidate shared mechanism|
|---|---|---|
|**Wrong version**|A finding uses an obsolete contract amendment, specification, or policy.|Bind every assessment to exact source versions and effective dates.|
|**Wrong subject**|A certificate refers to another batch; a log refers to another system; a record refers to another patient.|Explicit subject identity and scope checks.|
|**Missing evidence treated as a negative fact**|No record of a treatment, payment, inspection, or exception is interpreted as proof it never occurred.|Preserve missing-information states and record assumptions about completeness.|
|**A citation is present but does not support the claim**|A policy statement is presented as evidence of implementation, or a test report covers a different requirement.|Separate source linkage from support assessment.|
|**A correction leaves accepted downstream work stale**|A changed requirement or corrected fact affects an earlier decision.|Dependency tracking and targeted reassessment.|
|**A generated proposal causes an unauthorized effect**|A model submits, releases, pays, deploys, or changes an authoritative record.|Enforce permissions and approval checks outside the model.|

These are proposed mechanisms to test. They are not established guarantees merely because a framework exposes fields for them.

For example, you can implement checks that every finding references an existing evidence span and an exact requirement version. Those checks do not establish that the span supports the finding. Support accuracy needs its own evaluation.

That distinction should remain visible in both the API and the user interface.

## 5. How I would conduct the investigation

### First, collect cases at the workflow level


Choose a small number of workflows and document a complete case for each: the user's question, applicable requirements, available evidence, missing information, interpretations, review steps, final artifact, and possible external actions.

Start with perhaps **10-20 cases per workflow for discovery**, deliberately including straightforward cases and cases with missing evidence, contradictions, exceptions, and revisions. That is a proposed exploration size, not a validation dataset sufficient for deployment.

The unit of comparison should be something like "review this supplier's evidence for these controls," not "cybersecurity."

### Second, separate structural fit from practical access


For each workflow, investigate two independent profiles.

The **structural profile** comes from the properties above: interpretation, uncertainty, time, dependencies, and authority.

The **practical profile** concerns access to representative cases, permission to use them, available experts, evaluation cost, integration requirements, and access to the people doing the work.

Public standards can make a prototype possible without providing representative production evidence. For instance, CUAD supplies expert-annotated contracts for clause identification, but that does not supply the communications and delivery records needed to evaluate actual contract performance. [Atticus Project AI](https://www.atticusprojectai.org/cuad/)

This distinction prevents mistaking "I can build a demo" for "I can evaluate the intended workflow."

### Third, run comparable failure tests


Apply the same kinds of changes across workflows:

Remove a necessary evidence item. Introduce a conflicting source. Change the applicable requirement version. Supply evidence about the wrong subject. Duplicate a source. Add an exception. Correct an upstream fact after review. Put malicious instructions inside a retrieved document.

Then specify the expected behavior separately for each case.

For example, duplication should not create independent corroboration. An upstream correction should trigger review of dependent findings where the correction affects them. Instructions inside evidence should not acquire permission to operate tools.

These tests would reveal whether the proposed framework has common behavior or merely common terminology.

### Fourth, compare against simpler implementations


I would compare at least a conventional rules-based implementation where applicable, a retrieval-and-generation baseline, and your proposed system with explicit evidence, checks, revisions, and review.

Measure distinct outcomes: supported conclusions, consequential omissions, conflict detection, appropriate uncertainty, reviewer correction time, affected findings caught after changes, and unauthorized state transitions.

Use expert-reviewed cases for semantic quality and software tests for enforcement. Include component ablations so you can determine whether a particular mechanism provides benefit.

**The framework earns its complexity only when it improves those outcomes enough to justify the additional work.**

## 6. Which domains I would use first for your project


For testing the generality of your research, I would choose a deliberately varied set.

**Keep one healthcare workflow as the primary application.** It supplies the domain depth. Avoid expanding across several clinical workflows while simultaneously trying to generalize the infrastructure.

**Use security control evidence assessment as the first implementation outside healthcare.** You can construct a controlled test environment with known configurations and changes, while OSCAL supplies established assessment objects. This gives you a way to test both semantic interpretation and deterministic checks against evidence you control. The proposed system should extend or integrate with those objects rather than duplicate the entire standard. [NIST Pages](https://pages.nist.gov/OSCAL/learn/concepts/layer/assessment/assessment-results/)

**Use contract reasoning as an independent semantic benchmark.** ContractNLI's task includes identifying whether a hypothesis is supported, contradicted, or unmentioned, together with evidence spans. That offers a public test of interpretation and support, although it does not validate a complete legal decision workflow. [arXiv](https://arxiv.org/abs/2110.01799)

Engineering change review would be the next candidate when you have an engineering partner and representative cases. Its value for your research is the explicit relationship between changes, dependencies, verification, and approval. [NASA](https://www.nasa.gov/reference/6-2-requirements-management/)

I would then extract a small shared implementation from what survives these comparisons: evidence references and scope, assessment records, version dependencies, interfaces to deterministic checks, review and authority boundaries, and evaluation records. A universal natural-language policy compiler would remain a separate research problem.

**My recommendation is to investigate shared failure modes first, implement two contrasting workflows second, and extract the horizontal framework third.** That gives you evidence about what generalizes while keeping the healthcare workflow grounded in a specific user's work.
