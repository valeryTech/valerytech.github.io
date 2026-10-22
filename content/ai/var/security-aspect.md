---
draft: false
toc: true
description: "Security in AI design asks which access, information, and authority boundaries survive hostile inputs, separating behavioral detection, architectural enforcement, and evidence checks by the properties each can support."
title: "Security Aspect"
linkTitle: "Security Aspect"
---
# Security in AI system design


Security should have **an explicit place in the design framework**, with its own threat models, controls, and evaluation.

It connects closely to reliability, but separating the questions helps:

|Concern|Main question|Example failure|
|---|---|---|
|Task reliability|Does the system consistently complete the intended work?|A retry creates two bookings.|
|Epistemic reliability|Are claims justified by the available evidence?|The assistant invents an explanation for a charge.|
|Security|Do access, information, and authority boundaries hold, including under hostile input?|A retrieved document redirects the assistant into disclosing private data.|
|Safety|Could the system’s behavior produce unacceptable harm?|Someone acts on a harmful recommendation.|

These concerns overlap. An attacker might deliberately induce a false conclusion; an entirely accurate answer might disclose confidential information. NIST similarly distinguishes reliability, safety, security, and privacy within its trustworthiness framework. [NIST’s distinctions](https://airc.nist.gov/airmf-resources/airmf/3-sec-characteristics/).

**“Guardrails” describes mechanisms used across these concerns.** A proposed grouping distinguishes three kinds:

- **Behavioral guidance and detection:** instructions, refusal training, classifiers, and model-based critics. Their effectiveness needs empirical evaluation, including attempts to bypass them.
- **Architectural enforcement:** access controls, sandboxing, permitted operations, argument validation, information-flow restrictions, and resource limits. These can enforce specific properties within their technical assumptions.
- **Evidence and result checks:** provenance, source comparison, deterministic calculations, contradiction checks, qualification, and abstention. These address whether a result deserves to be used.

For hallucinations, the distinction between **generating a candidate and accepting its result** becomes especially useful. A system can require that every citation resolves to an actual source, every reported total comes from a calculation, or every finding passes an evidence check. Whether a passage actually supports an interpretation can still involve fallible judgment. The epistemic-contracts note states this limitation.

The common architectural idea is to put checks between model proposals and consequential use. CaMeL provides a concrete security example: it separates control and data flow and enforces policies around tool calls, while assuming the underlying model remains susceptible to prompt injection. [CaMeL paper](https://arxiv.org/abs/2503.18813).

Three implications for the related collections:

1. **In the project examples, security crosses all the cases.** The support assistant needs account isolation and disclosure controls even with read-only access. Investigation systems need protection against malicious evidence influencing conclusions. Coding agents need execution isolation and constrained access to files, credentials, and networks. Each case could have a short security and reliability profile.

2. **In the classification, security and trust boundaries should be an explicit dimension.** Record protected resources, untrusted inputs, authenticated principals, permitted reads and effects, enforcement locations, and supporting evidence. This makes “uses guardrails” a much more precise description.

3. **In design research, security could become a distinct research strand.** Its existing foundation is trusted effect boundaries, connected to epistemic contracts and verification and acceptance. That strand would ask which boundaries continue to hold when model behavior or external content is adversarial.

A useful shared research question would be: **Which properties can the surrounding system enforce despite unreliable model behavior, and which properties remain dependent on the quality of model judgment?**
