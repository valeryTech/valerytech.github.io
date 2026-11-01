---
draft: false
toc: true
description: "A critique rejects the proposed automation conditions as sufficient release rules, requiring tested generalization, evaluator checks, separate runtime-review purposes, explicit authority, and defined replay behavior."
title: "12 Exploratory Pipeline Design Goals And Principles Comments"
linkTitle: "12 Exploratory Pipeline Design Goals And Principles Comments"
---
# Comments on exploratory pipeline design goals and principles


The comments are new analysis of the [complete third formulation]({{< ref "ai/design-research/interactive-systems/12-exploratory-pipeline-design-goals-and-principles" >}}). The original label marking the formulation for analysis remains unchanged. The goals, non-goals, principles, operating loop, objective, and manifesto remain a proposal rather than an accepted checklist.

## Retain the complete formulation and its status


The third formulation gives the proposed approach a name and organizes it into goals and principles. The reassembly preserves the organization without establishing that the named approach is a recognized discipline or a selected method for the user's projects.

The [method note]({{< ref "ai/design-research/interactive-systems/10-exploratory-pipeline-design-and-progressive-automation" >}}) retains the preceding context and formulations. The [workbench note]({{< ref "ai/design-research/interactive-systems/11-inspectable-pipeline-workbenches" >}}) retains the concrete artifact model and RAG example. The repeated ideas are preserved so changes in wording and scope remain inspectable.

## Automation conditions need further justification


Principle 8 proposes introducing automation when one of several conditions becomes true. The conditions concern different questions, including repetition, predictability, classification, measurement, testing, and consequences of failure.

Being able to test a policy does not establish that the policy passed a test. A recurring intervention does not establish that it generalizes beyond the observed cases. A measurable improvement also needs a stated baseline and a decision about acceptable failures.

A later design needs to identify which conditions are necessary for its particular operation and what evidence demonstrates that they hold. The source's list should not be treated as a sufficient release rule merely because it appears among the principles.

The existing [verification and acceptance note]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) distinguishes successful checks from acceptance for a purpose. The proposed automation conditions do not replace that distinction.

## Judgments and evaluator outputs need their own checks


The goals propose treating human and evaluator judgments as engineering data. A typed label can record a judgment without establishing that the judgment is correct or that every participant interprets the label in the same way.

A later design needs to preserve disagreements and uncertainty rather than converting all recorded behavior into unquestioned training targets. Policy evaluation also needs to distinguish examples used to derive a rule from cases used to test the rule.

The [workbench comments]({{< ref "ai/design-research/interactive-systems/11-inspectable-pipeline-workbenches-comments" >}}#record-an-intervention-separately-from-its-meaning) concern the records behind the observations. The existing [investigation evaluation note]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) provides a separate experiment proposal without proving the new approach's effectiveness.

## Runtime decisions can have an independent purpose


The proposal emphasizes learning from manual control and later automating stable behavior. A person can still need to review a current answer or authorize an action even after the pipeline's behavior is well understood.

Runtime review and design discovery therefore need stated purposes rather than a universal claim that manual work without reusable learning is overhead. An intervention can serve both purposes while retaining separate records of the current decision and the later observation.

Principle 6 proposes interaction at concepts that people can judge. The appropriate level depends on the participant and the question under investigation. An operation involving model internals may be useful to a specialist without being a suitable control for an end user.

## Learned behavior does not establish authority


The proposed outputs of progressive automation include tool permissions. Observing useful tool use or a repeated approval pattern does not establish who may grant permission to perform an operation.

The existing [trusted-boundary note]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}) distinguishes operation descriptions and proposed actions from enforced authority. Any learned policy that affects external actions needs a defined route for review and authorization rather than automatic adoption from usage traces.

The principle about versioned prompts, policies, and evaluators also leaves governance rules open. A saved version identifies a configuration without proving that the configuration is accepted for the current purpose or principal.

## Traces and architecture do not establish reproducibility


The proposal permits inspection as an alternative to replay, while the second formulation makes an unconditional replay statement. Both remain visible in the retained text.

The [run-history comments]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results-comments" >}}#inspection-and-replay) distinguish recorded results from new operations. The store list and operating loop do not define how changing inputs, external services, model calls, or side effects are handled during a new run.

The proposal needs those rules before its architecture can support a stated reproducibility or safety claim. The reassembly does not supply an implementation or a guarantee that the loop discovers the correct pipeline.

## Audit and source limits


The [source overview]({{< ref "engineering/eng-exp/exploratory-design" >}}) links all three notes. The [stage 9 mapping]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-9-exploratory-pipeline-design) records the complete third formulation, including every example and the original absence of a final newline.

Research descriptions, project references, unavailable attachments, and empirical claims remain unverified source material. The source's manifesto is retained as a proposed formulation rather than a research result or author commitment.
