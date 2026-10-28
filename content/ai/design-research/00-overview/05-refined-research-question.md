---
draft: false
toc: true
description: "Critiques shared state, runtime enforcement, and open workflows as premature foundational assumptions, while preserving an earlier participant-neutral environment question as one application."
title: "05 Refined Research Question"
linkTitle: "05 Refined Research Question"
---
# Refined research question


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Scope of the general research question


The later critique below separates the general theory from the earlier human, model, and program environment question. The [revised broad research question]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}#6-i-would-therefore-reframe-the-research-question) and proposed hierarchy are now in the overview. Both formulations remain dialogue proposals, and the reassembly does not establish their claims.

### 3. The second problem framing is currently too solution-shaped


The earlier formulation is:

> How do we design programmable shared environments where heterogeneous participants ... can coordinate without a fixed workflow, while every state transition and external effect has explicit authority and provenance and must preserve runtime-enforced invariants?

The critique accepts this as a research question for one architecture, but questions whether it is the right foundational question for the broader project.

It already assumes quite a lot:

**Shared environment.** Why must state be shared? A Unix pipeline doesn't require that. Message-passing systems don't necessarily require it. Some systems might deliberately isolate state.

**State transitions.** Useful model, but some builders may primarily need streams, relations, immutable artifacts, messages, constraints, or declarative facts.

**Runtime enforcement.** Some constraints could be guaranteed by types, construction rules, cryptography, static analysis, protocols, organizational processes, or combinations of these.

**Explicit authority and provenance.** Critical for systems that perform consequential actions. They aren't necessarily fundamental requirements of every compositional system.

**No fixed workflow.** This is another design choice. A builder may deliberately choose fixed composition. The proposed theory should explain what they gain and lose from that choice.

**Observe -> propose -> commit.** This is a very good pattern for systems containing uncertain generators and consequential effects. The second document already develops it well. But it should emerge as one pattern from the theory.

So the proposal is to move all of these one level down.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## Earlier wording for a human, model, and program environment


The terminology corrections and proposed questions are retained below with editorial wording. The LLM's earlier claim about the clearest research position belongs to the environment proposal, and the later critique above questions its assumptions. The [research-scope note]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}) places the proposal among the applications of the broader theory.

Three changes to the earlier wording are proposed.

First, the proposal is to remove **"intelligent and non-intelligent."** The working dictionary defines intelligence operationally as task-solving capability, which means deterministic software can itself qualify as intelligent for some tasks; it also deliberately separates intelligence from agency. More importantly, the dictionary reserves agency for a persistent entity whose actions alter its future relationship with its environment. An isolated model invocation therefore needn't itself be an agent. This makes **participant** a particularly useful word: you don't have to pretend every model, program and human has the same kind of agency.

Second, the proposal is to distinguish **participants from tools/resources**. A human, model-backed process or deterministic service can be a participant if it has identity, state and authority and can initiate interaction. A passive database/API/tool is better modeled as a resource or effect endpoint. Otherwise "participant" becomes as broad and unclear as "agent."

Third, **"collaborate freely"** hides what may be the most important technical claim. If you mean that collaboration doesn't require a fixed DAG, workflow or predeclared choreography, say that. That directly separates this from LangGraph, Temporal and much of the session-type tradition.

The resulting proposal is to sharpen the question to:

> **How do we build participant-neutral programmable environments in which humans, generative models and deterministic programs can dynamically observe, propose and commit changes to persistent shared state, while authority, external effects, causal provenance and system invariants are explicit and enforced by the runtime?**

"Observe, propose and commit" is useful. It gives you a clean deterministic boundary. Humans and models may make proposals; possessing information doesn't grant authority; a proposal isn't an effect; and the runtime owns commitment. Agent libOS is already moving toward exactly this distinction for agents, with capabilities and causal evidence never themselves granting authority. ([arXiv](https://arxiv.org/abs/2606.03895 "[2606.03895] Agent libOS: A Runtime Substrate for Capability-Controlled Self-Evolving LLM Agents"))

If the absence of fixed orchestration is essential, the proposal is to make it even more explicit:

> **How do we design programmable shared environments where heterogeneous participants--humans, models and programs--can coordinate without a fixed workflow, while every state transition and external effect has explicit authority and provenance and must preserve runtime-enforced invariants?**

That, to me, is the clearest research position. It makes the object of study the **environment and its transition semantics**, while most current work makes the agent, workflow, communication protocol, information store, or governance layer the object of study.
