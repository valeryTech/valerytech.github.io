---
draft: false
toc: true
title: "Capabilities"
description: "What it means to say an LLM has a capability such as reasoning or understanding, treated as a disposition, and what empirical evidence would support that claim."
linkTitle: "Capabilities"
---

These notes are about how we understand what LLMs can do. Their one-sentence version: a capability is a hidden property, every score is an indicator of it, and the distance between the two is where the difficulty lives. They start from the problem that capability words are used without saying what they claim. They then treat a capability as a disposition: a claim about what a system would do across a specified range of situations, inferred from limited observed behavior. Finally they connect that view with measurement and construct validity, and apply it to reasoning and to system design.

## Reading order


1. [The inference ladder]({{< ref "ai/capabilities/00-the-inference-ladder" >}}) -- the one-page version: a capability is never observed, each step from behavior to claim is an inference with its own failure, and a glossary that maps the same concepts across philosophy, psychometrics, and AI evaluation.
2. [What a capability claim says]({{< ref "ai/capabilities/01-what-is-a-capability-claim" >}}) -- the problem: labels like reasoning and planning are not established properties, and a benchmark score is not the claim.
3. [Capabilities as dispositions]({{< ref "ai/capabilities/02-capabilities-as-dispositions" >}}) -- a capability is defined by what a system would do; the move from a score to a response profile.
4. [What a disposition claim means]({{< ref "ai/capabilities/03-what-a-disposition-claim-means" >}}) -- finks, masks, and mimics, and how the speaker's context fixes the conditions and the manifestation.
5. [Dispositions as response profiles]({{< ref "ai/capabilities/04-dispositions-as-response-profiles" >}}) -- the working account: a chosen system, a declared scenario family, and an inferred response profile.
6. [Measuring dispositions]({{< ref "ai/capabilities/05-measuring-dispositions" >}}) -- vary context, hold the system fixed, recover p(v | π, θ); hypotheses as bridges to variables.
7. [Capability constructs and validity]({{< ref "ai/capabilities/06-capability-constructs-and-validity" >}}) -- the nomological network says what a capability means; response functions supply the evidence.
8. [Reasoning as a capability]({{< ref "ai/capabilities/07-reasoning-as-a-capability" >}}) -- a worked case: components of reasoning, the human literature mapped to LLMs, and a capability profile.
9. [Deriving capabilities from tasks]({{< ref "ai/capabilities/08-deriving-capabilities-from-tasks" >}}) -- using the account to design a system, from purpose and task demands to mechanisms.

## Across topics


- [Capability claims and empirical method]({{< ref "ai/capabilities/empirical-method-map" >}}) -- a cross-topic map to the notes on EBSE, experimentation, evaluation, causal investigation, design science, and research method: shared concepts, where the analogies break, and a draft protocol for capability studies.

## Sources


Main texts:

- [Dispositions](https://plato.stanford.edu/archives/spr2022/entries/dispositions/), Stanford Encyclopedia of Philosophy, Spring 2022 edition.
- [Measuring What AI Systems Might Do](/sources/ai-foundations/capabilities-and-measurement/voudouris-2026-measuring-what-ai-might-do.pdf.enc) ([arXiv:2603.00063](https://arxiv.org/abs/2603.00063)), Voudouris et al. 2026.

The papers cited in these notes:

- Dispositions: [Aimar 2019](/sources/ai-foundations/capabilities-and-measurement/aimar-2019-disposition-ascriptions.pdf.enc) ([doi:10.1007/s11098-018-1084-9](https://doi.org/10.1007/s11098-018-1084-9)), [Ryle 1949](/sources/ai-foundations/cognition-and-mind/ryle-1949-concept-of-mind.pdf.enc).
- Dispositional measurement: [Voudouris et al. 2026](/sources/ai-foundations/capabilities-and-measurement/voudouris-2026-measuring-what-ai-might-do.pdf.enc) ([arXiv:2603.00063](https://arxiv.org/abs/2603.00063)), [Zhou et al. 2026](/sources/ai-foundations/capabilities-and-measurement/zhou-2026-general-scales.pdf.enc) ([doi:10.1038/s41586-026-10303-2](https://doi.org/10.1038/s41586-026-10303-2)).
- Construct validity: [Freiesleben 2026](/sources/ai-foundations/capabilities-and-measurement/freiesleben-2026-nomological-networks.pdf.enc) ([arXiv:2603.15121](https://arxiv.org/abs/2603.15121)), [Bean et al. 2025](/sources/ai-foundations/capabilities-and-measurement/bean-2025-measuring-what-matters.pdf.enc) ([NeurIPS 2025](https://proceedings.neurips.cc/paper_files/paper/2025/hash/1967e0fc3aa6cbbace562f5cb8e3954e-Abstract-Datasets_and_Benchmarks_Track.html)), [Clark and Watson 2019](/sources/ai-foundations/capabilities-and-measurement/clark-2019-constructing-validity.pdf.enc) ([doi:10.1037/pas0000626](https://doi.org/10.1037/pas0000626)), [Lambert and Newman 2023](/sources/ai-foundations/capabilities-and-measurement/lambert-2023-construct-development-validation.pdf.enc) ([doi:10.1177/10944281221115374](https://doi.org/10.1177/10944281221115374)), [Kearns 2025](/sources/ai-foundations/capabilities-and-measurement/kearns-2025-quantifying-construct-validity.pdf.enc) ([arXiv:2602.15532](https://arxiv.org/abs/2602.15532)), [Cui et al. 2026](/sources/ai-foundations/capabilities-and-measurement/cui-2026-measuring-the-unmeasurable.pdf.enc), [Pita et al. 2026](/sources/ai-foundations/capabilities-and-measurement/pita-2026-correct-codes-wrong-reasons.pdf.enc) ([arXiv:2606.28574](https://arxiv.org/abs/2606.28574)).
- Benchmark critiques: [Chizhov et al. 2025](/sources/ai-foundations/capabilities-and-measurement/chizhov-2025-what-the-hellaswag.pdf.enc) ([arXiv:2504.07825](https://arxiv.org/abs/2504.07825)), [Reynolds 2026](/sources/ai-foundations/capabilities-and-measurement/reynolds-2026-projectibility.pdf.enc) ([arXiv:2607.26159](https://arxiv.org/abs/2607.26159)), [Dellibarda Varela et al. 2025](/sources/ai-foundations/capabilities-and-measurement/dellibarda-varela-2025-rethinking-illusion-of-thinking.pdf.enc) ([arXiv:2507.01231](https://arxiv.org/abs/2507.01231)).
- Cognitive architectures: [Nolte 2026](/sources/ai-foundations/cognition-and-mind/nolte-2026-metacognitive-architectures-review.pdf.enc) ([doi:10.1007/s10462-026-11669-5](https://doi.org/10.1007/s10462-026-11669-5)), [Sumers et al. 2024](/sources/ai-foundations/cognition-and-mind/sumers-2024-cognitive-architectures-for-language-agents.pdf.enc).
- Empirical method: [Baltes et al. 2025](/sources/research-methods/empirical-methods/baltes-2025-empirical-studies-se-llms.pdf.enc) ([arXiv:2508.15503](https://arxiv.org/abs/2508.15503)).
