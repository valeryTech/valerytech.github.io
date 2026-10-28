---
draft: false
toc: true
description: "A proposed investigation benchmark with frozen corpora, critical evidence, source precedence, conflicts, and abstention, plus controlled comparisons testing whether typed evidence contracts reduce omissions beyond extra computation."
title: "07 Investigation Evaluation And Benchmarks"
linkTitle: "07 Investigation Evaluation And Benchmarks"
---
# Investigation evaluation and benchmarks


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

This note keeps the bounded-corpus benchmark and evaluation proposal together. The source arguments below were moved from the combined evaluation note and are retained with editorial wording.

The [evaluation comments]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks-comments" >}}) distinguish this question from runtime enforcement and behavioral compilation. The original report context and bibliography links remain below.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

The passages below come from the [typed investigation report]({{< ref "ai/design-research/06-research-reports/02-typed-durable-inspectable-runtimes" >}}). The report's [shared bibliography]({{< ref "ai/design-research/06-research-reports/02-typed-durable-inspectable-runtimes" >}}#references) remains in the main report.

## Benchmarks and datasets


There is no existing benchmark in the sources reviewed that directly tests all of the desired semantics. Existing datasets divide the problem into retrieval completeness, citation faithfulness, hallucination, conflict, negative rejection and long-form research quality.

| Benchmark / dataset | What it tests | Scale / notable design | Relevance to your paper | Primary/data URL |
|---|---|---|---|---|
| **ALCE** | Long-form answers with citations: correctness, citation quality and completeness | Evaluates ASQA, QAMPARI and ELI5 settings; designed specifically around attributed generation. | Strong citation/provenance baseline; does not certify bounded-corpus screening | [Paper](https://aclanthology.org/2023.emnlp-main.398/) · [Data/code](https://github.com/princeton-nlp/ALCE) |
| **RGB** | Noise robustness, negative rejection, information integration and counterfactual robustness in RAG | English and Chinese RAG benchmark organised around four abilities. | Negative rejection is useful for your abstention dimension; counterfactuals expose blind trust in retrieved material | [Paper](https://arxiv.org/abs/2309.01431) · [Data/code](https://github.com/chen700564/RGB) |
| **RAGTruth** | Fine-grained hallucination/faithfulness in RAG outputs | 17,790 responses with 14,289 manually annotated hallucination spans in the released corpus. | Useful for unsupported-claim and false-abstention/refusal analysis | [Data/code](https://github.com/ParticleMedia/RAGTruth) |
| **MAGIC** | Reasoning under contradictions between retrieved contexts | Constructs controlled inter-context conflicts, including multi-hop and subtle conflicts. | Best direct benchmark among those reviewed for `ConflictDetected/Resolved` behaviour | [ACL Anthology](https://aclanthology.org/2025.findings-emnlp.466/) |
| **RARE / RARE-Set** | Retrieval-augmented robustness to dynamic/conflicting information | 400 time-sensitive finance/economics/policy documents and 48,322 questions with perturbations/conflicts. | Useful for authority/version/conflict experiments, especially stale versus current evidence | [Paper/data links](https://arxiv.org/abs/2506.00789) |
| **ScholarQABench** | Scientific literature retrieval, synthesis, answer coverage and citations | 2,967 expert queries with 208 long-form expert answers across several scientific fields. | Strong real-domain external benchmark; semantic coverage is evaluated rather than contract-certified | [OpenScholar/Nature](https://www.nature.com/articles/s41586-025-10072-4) |
| **LitQA2 / PaperQA2 evaluations** | Hard scientific-literature QA plus retrieval/synthesis and contradiction tasks | Used in PaperQA2's agentic literature-search evaluation. | Natural strong baseline for evidence investigation | [Paper](https://arxiv.org/abs/2409.13740) · [Repository](https://github.com/Future-House/paper-qa) |
| **DeepResearch Bench** | Long-form deep-research quality and citation effectiveness | 100 PhD-level research tasks spanning 22 fields. | Useful secondary external evaluation for final reports; weak fit for deterministic corpus coverage | [Paper](https://arxiv.org/abs/2506.11763) |
| **DeepResearch Bench II** | Fine-grained information recall, analysis and presentation | 132 grounded tasks and 9,430 binary rubrics built with more than 400 human-hours; reported systems still satisfy fewer than half the rubrics. | Particularly useful for measuring critical omission, but still does not expose your desired bounded-corpus execution certificate | [Paper](https://arxiv.org/abs/2601.08536) |
| **DeepScholar-Bench** | Live scholarly related-work research: retrieval, synthesis and verifiability | Designed for end-to-end scholarly research rather than static QA. | Good external stress test once the core contract experiment works | [Paper](https://arxiv.org/abs/2508.20033) · [Repository](https://github.com/guestrin-lab/deepscholar-bench) |
| **PaSa / RealScholarQuery** | Comprehensive paper search for complex academic queries | Evaluates paper-search agents on realistic comprehensive retrieval tasks. | Useful for evidence-recall evaluation, especially whether a search stage misses critical sources | [Paper](https://arxiv.org/abs/2501.10120) · [Repository](https://github.com/bytedance/pasa) |

The proposal is to still build a purpose-made bounded-corpus benchmark. The existing benchmarks do not give you the ground truth needed to distinguish "the system ran a search" from "the program demonstrably processed every required corpus partition", nor do they generally encode explicit source-precedence policies or a known set of evidence whose omission is critical. That benchmark is therefore part of the research contribution rather than auxiliary evaluation. This conclusion follows from the dimensions represented by ALCE, RGB, MAGIC, OpenScholar and the deep-research benchmarks above.

A good benchmark instance would have a frozen corpus plus an explicit specification:

```text
InvestigationInstance {
    question

    corpus_snapshot
    required_facets[]

    critical_evidence[]
    optional_evidence[]
    distractors[]

    source_metadata {
        authority_class
        status
        version
        supersedes
        dependency_group
    }

    conflicts[]
    acceptable_findings[]
    required_abstention_reason?
}
```


This lets you measure the distinction claimed by the proposed paper. The benchmark design follows directly from the earlier proposed evaluation around required evidence, distractors, contradictions, superseded documents and unanswerable cases. Existing work on contradiction benchmarks and citation-completeness evaluation provides useful patterns for generating and validating those cases.

### The evaluation


The primary experiment should hold the model family and corpus fixed and compare:

```text
Strong RAG / agentic RAG
        vs
Same operators inside typed investigation runtime
        vs
Runtime with individual contracts ablated
        vs
Exhaustive expensive screening baseline
```


PaperQA2 is a sensible agentic evidence baseline; OpenScholar supplies a stronger literature-synthesis comparison where practical; ordinary hybrid RAG provides the lower baseline.

The proposal is to make **critical evidence omission rate** the principal task metric, then report evidence recall, contradiction recall, authority-policy errors, unsupported-claim rate, provenance integrity, correct abstention, false abstention, contract-violation rate, cost and latency. ALCE, MAGIC, RGB and the deep-research benchmarks provide precedent for the individual citation, conflict, rejection and information-recall dimensions, but the proposed benchmark would combine them under controlled corpus ground truth.

The most convincing result would not be simply "our answers score higher". It would look like:

```text
same model + same corpus + comparable budget

                   baseline    typed-contract runtime
critical omission      14.2%             3.1%
unsupported claims      8.7%             1.8%
missed conflicts       21.0%             5.4%
correct abstention     63.0%            89.0%
invalid finalisation    —                0.0%

cost                    $1.00            $1.18
```


Those numbers are illustrative, not observed results. The scientific claim becomes compelling only if the measured improvements arise from enforcing the program semantics rather than simply spending substantially more retrieval/LLM compute.

<!-- Navigation added during reassembly on 2026-10-01. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Multiagent evidence experiment proposal


The following retained passage proposes a separate comparison involving unreliable reports and private evidence. It extends the investigation questions without selecting or running an experiment. The dedicated [comments]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks-comments" >}}) distinguish the proposal from measured results and from complete disclosure of private information.

<a id="6-the-epistemic-experiments-are-highly-relevant-to-your-first-paper"></a>

### 6. Epistemic experiments and the proposed first paper


The working interpretation is that this may be the most immediately useful part of the Anthropic work for the author's research program.

The proposed first paper asks whether coverage, provenance, authority resolution, contradiction handling, and abstention can become executable program semantics.

Anthropic's two epistemic experiments provide almost tailor-made adversarial cases.

In one, several scouts provide overlapping information and one lies. The listener must infer source unreliability from contradictions. In the other, information is distributed such that commonly shared evidence points toward the wrong answer while one participant possesses decisive private evidence. Groups often converge on the wrong consensus. ([Anthropic](https://www.anthropic.com/research/multiagent-systems "Patterns and problems in multiagent systems \ Anthropic"))

An alternative experiment could compare:

```text
free-form multiagent discussion
```


against:

```text
typed shared evidence state

Evidence {
    proposition
    source
    provenance
    confidence
    contradictions
}

Decision requires:
    registered evidence considered
    contradictions resolved | explicitly unresolved
    decisive dissent preserved
    source provenance present
```


Then measure exactly what the research notes already propose: critical evidence omission, contradiction recall, provenance integrity, unsupported conclusions, and correct abstention.

That would give the epistemic-contract work a compelling multiagent interpretation:

> Can failures that emerge from social information exchange be reduced by moving epistemic requirements out of participant cognition and into the semantics of shared computation?

That is a stronger motivation than presenting epistemic contracts primarily as a better RAG architecture.

<!-- The surrounding framework analysis remains in its report. -->

The preceding framework analysis and subsequent critique remain in the [coordination report]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics" >}}). Its complete complexity comparison joins the [complexity note]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}#coordination-and-epistemic-refinements).
