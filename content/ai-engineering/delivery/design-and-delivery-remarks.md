---
draft: false
toc: true
title: "Design and Delivery Framework: Principles and Remarks"
description: "Companion principles for the delivery framework: work backwards, retain feedback between phases, establish deterministic tool contracts, and place domain invariants deliberately."
linkTitle: "Principles and Remarks"
---

- Many existing AI-engineering approaches, including evaluation-centered approaches such as Hamel's, concentrate primarily on evals. This framework is intended to provide a broader end-to-end system view: product framing, system design, implementation, evaluation, release, and operation, grounded in a concrete project and codebase.
- The phases are ordered, but they are not a one-way waterfall. Evidence from implementation, evaluation, and production can send the project back to framing or design.
- **Deterministic foundations of AI tooling.** Establish API and service behavior before exposing those capabilities as tools to an AI system. The AI layer should operate on implemented, testable contracts rather than substitute for missing product foundations.
- **Faster iteration, experimentation, and interaction.** AI delivery often begins before detailed needs are known. Connect the delivery approach to experimentation and faster iteration. Include interactive debugging and design, such as embedding debugging and design.
- **Working backwards.** Make working backwards an explicit principle across product framing, system design, implementation, and evaluation.

The LLM should interact with domain operations rather than manipulating database records directly.

DDD guidance: decide which invariants and behavior belong inside the domain model and which belong in the service layer. This is more specific than simply making entities bigger.

## Library sources


- [Royce 1970](/sources/fc5d2cb35838539fa78fad5a122063ea.bin), *Managing the Development of Large Software Systems*
