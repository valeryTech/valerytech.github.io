---
draft: false
toc: true
description: "A critique of the multiagent evidence experiment distinguishing undisclosed, unregistered, and unused evidence, and requiring ground truth and controlled ablations to assess provenance, dissent, and contradiction handling."
title: "07 Investigation Evaluation And Benchmarks Comments"
linkTitle: "07 Investigation Evaluation And Benchmarks Comments"
---
# Investigation evaluation and benchmarks: comments


New commentary by Codex, added on 2026-10-01. The [evaluation note]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) preserves its earlier benchmark proposal and the imported multiagent evidence passage. The comments focus on the added proposal, and they do not independently verify the earlier benchmark descriptions.

## Why the evidence proposal belongs here


The complete [imported passage]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}#multiagent-evidence-experiment-proposal) compares free-form discussion with explicit evidence records. Its unreliable-scout and private-information examples connect directly to the earlier omission, contradiction, provenance, and abstention measures.

The passage is a separate proposed study, not a result of the bounded-corpus experiment. The earlier illustrative numbers and their disclaimer remain together and unchanged. The broader [evaluation comments]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks-comments" >}}) still distinguish investigation, runtime enforcement, and behavioral compilation.

## Registered evidence and undisclosed information


A rule requiring consideration of registered evidence only governs evidence that was registered. It does not establish that participants disclosed all private information. An experiment should distinguish failure to disclose information, failure to register a disclosed report, and failure to use a registered report.

Provenance records identify the reported source or derivation under specified conditions. They do not establish that the report is true. A typed evidence object can preserve a false claim or an incorrect confidence value without detecting either error.

The proposed requirements for resolving contradictions and preserving dissent also need operational definitions. Recording that a contradiction was resolved is different from showing that the chosen conclusion follows from the evidence.

## Comparisons still to design


A later study should define the ground truth and control which participant receives each item of information. Comparisons should also control the task, model, communication rules, and available budget. Ablations could distinguish the effect of evidence records from additional disclosure prompts, review steps, or computation.

The listed metrics need rules for identifying a critical omission, correct abstention, unsupported conclusion, and preserved decisive dissent. No experiment was run or selected by the reassembly.

The [coordination report]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics" >}}) retains the surrounding framework argument and critique. The [mapping log]({{< ref "ai/design-research/reassembly-map" >}}#related-notes-pass-8-multiagent-coordination-analysis-and-alice-scope) records the imported range and exact preservation of the earlier evaluation note.
