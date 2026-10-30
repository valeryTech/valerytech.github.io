---
draft: false
toc: true
description: "Defines requirements and proposed contracts for bounded-corpus synthesis where omission matters, exposing screening gaps, supporting and conflicting evidence, source-precedence policies, qualified findings, and abstention."
title: "06 Bounded Corpus Evidence Synthesis"
linkTitle: "06 Bounded Corpus Evidence Synthesis"
---
# Evidence synthesis over a bounded corpus


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The retained passages contain the author's requirements and the LLM's proposals for an evidence-synthesis contract, a coverage ledger, explicit outcomes, and an inspectable authority policy.

The author's original requirements come first. The original "analysis" heading marks the beginning of the LLM response. Proposed guarantees and authority rankings remain proposals rather than verified results or accepted requirements.

The complete [representation and iterative-retrieval pipeline]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}#bounded-corpus-retrieval-pipeline) is retained separately. The related [epistemic-contract note]({{< ref "ai/design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag" >}}) develops compiler obligations and runtime checks.

The source overview links the product descriptions and market hypotheses kept outside this note. Read the [separate comments]({{< ref "ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis-comments" >}}) for the grouping and limitations. The [audit map]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-4-semantic-engineering-dialogue) records the original order.

## Retained source


<!-- Semantic-engineering contract source begins below. -->

Author context: The corpus is closed and contains documents, for example in Markdown. The central problem is search and synthesis for complex questions.

Requirement: Results should trace back to the original source document.

Possible document representations include paragraph summaries, hypothetical questions, and embeddings.

A query could be transformed and processed through a semantic-search pipeline.

Requirement: The result should be a set of evidence or an abstention when evidence is insufficient. The author emphasizes the importance of abstention.

Additional concern: Source authority may need explicit justification. Search systems can rank unreliable, unsupported, or low-quality AI-generated material too highly. Source authority should be justified through evidence, provenance, and relevance to the question.

Requirement and personal motivation: The pipeline should consider all supplied documents. The author reports that chats, including GPT Pro, frequently omit critical facts, principles, and practices present in the documents.

The loop could repeat, using principles from the author's retrieval reframing: https://valery.tech/ai-engineering/retrieval/reframing/

## analysis


The "authority justification" concern changes the product materially. A useful system would have to explain why a source outranks another source--e.g. governing standard > official design doc > meeting note > personal blog--and expose contradictions instead of silently averaging them together. That is much closer to an audit/research system than a chatbot.

The working interpretation is that there is a product here, but the proposal is to define the niche much more narrowly than "semantic search over private documents."

The proposed product category is:

**Auditable evidence synthesis over a bounded corpus, for questions where omission is itself a failure.**

That distinction is important.

NotebookLM, ChatGPT, Glean, Kapa and many RAG products already do:

```text
question
→ retrieve relevant chunks
→ synthesize
→ citations
```


The proposed product would have a different contract:

```text
question
→ determine what evidence would be needed
→ systematically examine the corpus for that evidence
→ track what was examined
→ resolve authority / versions / conflicts
→ identify supporting and contradicting evidence
→ determine whether evidence is sufficient
→ answer OR abstain
→ expose the whole evidence trail
```


That is substantially more defensible.

## The key feature: a coverage ledger


Suppose the corpus has 738 documents.

A normal answer might show:

```text
Answer: ...
Sources:
- ADR-021
- principles/retrieval.md
- RFC-93
```


The system's answer should be capable of showing something like:

```text
Corpus
738 documents

Ingestion
735 successfully parsed
2 partially parsed
1 unreadable

Question decomposed into
7 evidence requirements

Corpus screening
738 / 738 documents evaluated

Potentially relevant
43 documents

Deep evidence extraction
43 / 43 documents

Evidence
18 supporting passages
4 qualifying passages
2 contradictory passages

Unresolved
1 evidence requirement

Conclusion
INSUFFICIENT EVIDENCE

Reason
The corpus establishes A and B,
but contains no authoritative source establishing C.
```


That is a product.

And it changes what "confidence" means.

The recommendation is not to even lead with a probabilistic `87% confidence`. That number is difficult to interpret.

Use explicit states:

```text
SUPPORTED

SUPPORTED WITH QUALIFICATIONS

CONFLICTING AUTHORITIES

INSUFFICIENT EVIDENCE

CORPUS DOES NOT ADDRESS THIS

COVERAGE INCOMPLETE
```


The last state is particularly important. If three PDFs failed parsing, the system shouldn't casually say "nothing in the corpus contradicts this."

It should say:

> No contradiction was found in 735/738 documents. Three documents could not be completely evaluated.

That is a much stronger trust model.

<a id="authority-is-potentially-your-second-major-differentiator"></a>

## Authority as a potential second major differentiator


The proposal is to be careful about building a magical "source quality score."

A scalar like:

```text
Authority: 82/100
```


will eventually create its own bullshit.

Authority should be inspectable and domain-specific.

For an engineering corpus:

```text
Approved architecture principle
    >
Accepted ADR
    >
Current RFC
    >
Design document
    >
Issue/PR
    >
Slack conversation
```


And:

```text
current version > superseded version

owner-approved > draft

primary evidence > somebody's summary

normative document > descriptive document
```


So when two pieces of evidence conflict, the output could say:

> ADR-031 contradicts `authentication-notes.md`. ADR-031 is controlling because it is an accepted architecture decision dated 2026-05-12; `authentication-notes.md` is an informal design note dated 2025-11-03.

That's far more useful than ranking something higher because its author has a lot of citations or LinkedIn engagement.

The need for this sort of provenance is showing up independently in current work on compliance and AI assurance. Recent research explicitly frames traceability, evidence integrity and reasoning provenance as conditions for AI-generated material to be usable in audits. ([ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0950584926001217?utm_source=chatgpt.com "AI in control: Rethinking cybersecurity compliance and auditing - ScienceDirect"))

## Task-specific context assembly


The source sketch describes the evidence needed for a particular decision or task. Its related links remain with the statement. The sketch has no speaker labels, so the passage is not assigned to a dialogue participant.

The [retrieval methods]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}#retrieval-methods-for-context-assembly) and tentative application domain are retained separately. The [comments]({{< ref "ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis-comments" >}}#task-specific-context-assembly) explain the distinction.

<!-- Context-assembly contract sketch begins below. -->

The promising gap is task-specific context assembly: selecting authoritative, sufficient evidence for a decision (or for other task) while exposing provenance, conflicts, missing support, and abstaining when warranted.

links: sem-rag, semantic search, [Reframing]({{< ref "ai-engineering/retrieval/reframing" >}}) retrieval,
