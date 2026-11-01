---
draft: false
toc: true
title: "AI Capabilities"
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
- [Measuring What AI Systems Might Do](/sources/a7b1db57e43f6200e8de28a3f4e6e12d.bin) ([arXiv:2603.00063](https://arxiv.org/abs/2603.00063)), Voudouris et al. 2026.

The papers cited in these notes:

- Dispositions: [Aimar 2019](/sources/666e59fd95c8b7ae1add31356724b4ff.bin) ([doi:10.1007/s11098-018-1084-9](https://doi.org/10.1007/s11098-018-1084-9)), [Ryle 1949](/sources/e858a20fa17c7e6da53dd7da8794c973.bin).
- Dispositional measurement: [Voudouris et al. 2026](/sources/a7b1db57e43f6200e8de28a3f4e6e12d.bin) ([arXiv:2603.00063](https://arxiv.org/abs/2603.00063)), [Zhou et al. 2026](/sources/76e02efd0fb2f02796388644a91327d0.bin) ([doi:10.1038/s41586-026-10303-2](https://doi.org/10.1038/s41586-026-10303-2)).
- Construct validity: [Freiesleben 2026](/sources/c84d75800beb21af8a1cc54b8f79c168.bin) ([arXiv:2603.15121](https://arxiv.org/abs/2603.15121)), [Bean et al. 2025](/sources/015e29150096f262478300d13488bbc2.bin) ([NeurIPS 2025](https://proceedings.neurips.cc/paper_files/paper/2025/hash/1967e0fc3aa6cbbace562f5cb8e3954e-Abstract-Datasets_and_Benchmarks_Track.html)), [Clark and Watson 2019](/sources/7fc85943e4bd06680a1aaf4f357404b6.bin) ([doi:10.1037/pas0000626](https://doi.org/10.1037/pas0000626)), [Lambert and Newman 2023](/sources/49b689d6cd563df789695944f06ff04c.bin) ([doi:10.1177/10944281221115374](https://doi.org/10.1177/10944281221115374)), [Kearns 2025](/sources/b905bdbeb5794014d45a8888fc9b85bd.bin) ([arXiv:2602.15532](https://arxiv.org/abs/2602.15532)), [Cui et al. 2026](/sources/c0787e6b002b3193a564d0d985b75f62.bin), [Pita et al. 2026](/sources/e927379435f1073f97f490f01b8bffcf.bin) ([arXiv:2606.28574](https://arxiv.org/abs/2606.28574)).
- Benchmark critiques: [Chizhov et al. 2025](/sources/0d0f57129a2ce4bb6104c39c80966d31.bin) ([arXiv:2504.07825](https://arxiv.org/abs/2504.07825)), [Reynolds 2026](/sources/f31a48720f6829630133d42608c798d0.bin) ([arXiv:2607.26159](https://arxiv.org/abs/2607.26159)), [Dellibarda Varela et al. 2025](/sources/86edf232a4144ab902dd5f19092c91ca.bin) ([arXiv:2507.01231](https://arxiv.org/abs/2507.01231)).
- Cognitive architectures: [Nolte 2026](/sources/2af58406e13e42072bca886ec3caf534.bin) ([doi:10.1007/s10462-026-11669-5](https://doi.org/10.1007/s10462-026-11669-5)), [Sumers et al. 2024](/sources/979eab1fc41b7066edf51770802bf09d.bin).
- Empirical method: [Baltes et al. 2025](/sources/c1ccf311d88d7d8a326c7617fb00ce09.bin) ([arXiv:2508.15503](https://arxiv.org/abs/2508.15503)).
