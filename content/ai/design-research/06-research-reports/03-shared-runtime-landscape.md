---
draft: false
toc: true
description: "A saved landscape survey of shared human–AI runtimes and historical computing precedents, comparing candidate generation, authoritative commitments, permissions, durable state, and the risks of prescribing collaboration too tightly."
title: "03 Shared Runtime Landscape"
linkTitle: "03 Shared Runtime Landscape"
---

Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<a id="other"></a>

## Related shared-runtime systems


The proposed framing is broader than both because it treats humans, models, deterministic software and tools as peers in one programmable environment, rather than centering the LLM agent.

TODO: Clarify the original `XX` marker; no further text is recorded here.

The pattern is clearer now: the 2026 market is converging on "shared runtime," "control plane," and "governed agent runtime," while older systems research already has strong answers for individual pieces such as capabilities, durable state, protocol checking, and effect typing. The gap is a single participant-neutral programming model that composes those pieces.

TODO: Clarify the original `XX` marker; no further text is recorded here.

As of August 25, 2026, several groups are converging on almost the same problem. The strongest overlap is no longer "multi-agent orchestration"; it is the idea of a persistent, governed runtime shared by humans and AI.

The closest wording identified by the saved LLM review is ServiceNow Action Fabric. ServiceNow explicitly says: "Humans and AI agents need a shared runtime," with governed actions, connected workflows, and a common operational substrate. ([ServiceNow Newsroom](https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-opens-its-full-system-of-action-to-every-AI-Agent-in-the-enterprise/default.aspx?utm_source=chatgpt.com "ServiceNow opens its full system of action to every AI Agent in the enterprise - ServiceNow Newsroom")) Visca independently frames the problem as "shared, persistent, governed AI work," with persistent participant identities, shared context, explicit authority, human approval, and one operational record. ([Visca](https://www.visca.ai/whitepaper/ "Thesis -- The collaboration runtime for humans and AI · Visca")) Spacebar is also very close: a "persistent, programmable surface" in which humans and models see the same state, operate under the same permission model, and write into one event stream. ([Spacebar](https://www.spacebar.ai/ "Spacebar: Runtime for Real-Time Multimodal AI Agents"))

A proposed map of the nearest work follows:

|Work|Strong overlap with your framing|Where your framing can differ|
|---|---|---|
|**ServiceNow Action Fabric**|Humans + agents, shared runtime, governed effects, existing workflows and enterprise state. ([ServiceNow Newsroom](https://newsroom.servicenow.com/press-releases/details/2026/ServiceNow-opens-its-full-system-of-action-to-every-AI-Agent-in-the-enterprise/default.aspx?utm_source=chatgpt.com "ServiceNow opens its full system of action to every AI Agent in the enterprise - ServiceNow Newsroom"))|Enterprise "system of action." Agents enter existing business workflows. It isn't trying to define a general programming model for arbitrary human/model/program participants.|
|**Visca**|Persistent participants, shared context, explicit authority, actions, approvals, attributable record. ([Visca](https://www.visca.ai/whitepaper/ "Thesis -- The collaboration runtime for humans and AI · Visca"))|Collaboration/product runtime. Less emphasis on state-transition semantics, typed effects, or general invariants as language/runtime constructs.|
|**Spacebar**|Humans and models are first-class participants in one persistent programmable surface; shared state, permissions, event stream. ([Spacebar](https://www.spacebar.ai/ "Spacebar: Runtime for Real-Time Multimodal AI Agents"))|Strongly oriented toward live multimodal interaction and UI. Provenance and invariant enforcement aren't the central abstraction.|
|**Agentic Workspace Protocol**|Explicitly proposes "multiplayer agent environments": N humans + M agents, identity, approvals, queues, versioned state and shared resources. ([GitHub](https://github.com/agentic-workspaces/agentic-workspace "GitHub - agentic-workspaces/agentic-workspace: Agentic Workspace Protocol -- reference implementation · GitHub"))|Primarily a multiplayer protocol around agent sessions. Deterministic programs/tools aren't symmetric participants, and effect/invariant semantics are limited.|
|**Hao Zhang / Shared Information World**|Extremely close on shared state: provenance, time, authority/permissions, versions, conflicts and reversible derivation for humans, agents, tools and databases. ([Hao Zhang](https://h20zhang.github.io/blog/2026/shared-information-world-ai-agents/?utm_source=chatgpt.com "Shared Information World for Humans and AI Agents \| Hao Zhang"))|Focuses on the **information substrate**. It doesn't yet supply the corresponding execution/effect semantics.|
|**Agent libOS**|Process identity, persistent state, explicit capabilities, human approval, causal evidence, budgets and controlled side effects. It explicitly separates visibility from authority. ([arXiv](https://arxiv.org/abs/2606.03895 "[2606.03895] Agent libOS: A Runtime Substrate for Capability-Controlled Self-Evolving LLM Agents"))|The fundamental subject is an LLM agent process. Humans are approval authorities and tools/providers are resources; they aren't symmetric inhabitants of the environment.|
|**Stochastic-deterministic boundary work**|Srinivasan explicitly models model output -> verifier -> commit/reject and organizes agent runtimes around coordination, state and control. ([arXiv](https://arxiv.org/abs/2605.20173?utm_source=chatgpt.com "A Methodology for Selecting and Composing Runtime Architecture Patterns for Production LLM Agents"))|It isolates the stochastic/deterministic boundary inside production agents, rather than defining a general multi-participant world.|
|**LangGraph / Temporal**|Persistent state, durable execution, replay, interruptions, human intervention and controlled side effects. ([Docs by LangChain](https://docs.langchain.com/oss/python/langgraph/persistence?utm_source=chatgpt.com "Persistence - Docs by LangChain"))|Workflow is the organizing abstraction. Authority, provenance and participant semantics generally sit outside that abstraction.|
|**Multiparty session types / choreographies**|Probably the strongest older theoretical ancestor: specify global interaction among participants and mechanically guarantee protocol properties such as communication safety, progress and deadlock freedom. ([Springer](https://link.springer.com/article/10.1007/s10270-022-01040-x?utm_source=chatgpt.com "Composable partial multiparty session types for open systems \| Software and Systems Modeling \| Springer Nature Link"))|Usually assumes protocol-shaped, largely deterministic participants and declared interaction structure. It doesn't address epistemic/probabilistic participants, shared semantic state or authority/provenance.|

There are also several mature technologies that each solve one slice of the research question. MCP and A2A solve connectivity and interoperability; notably, A2A deliberately leaves the meaning, scope and revocation semantics of authorization to implementations. ([Model Context Protocol Blog](https://blog.modelcontextprotocol.io/posts/2026-01-28/?utm_source=chatgpt.com "The 2026-01-28 Specification | Model Context Protocol Blog")) Cedar, Biscuit and UCAN make authority explicit; Biscuit and UCAN additionally support attenuated/delegated capability chains. ([Cedar Policy Language Reference Guide](https://docs.cedarpolicy.com/auth/authorization.html?utm_source=chatgpt.com "Authorization | Cedar Policy Language Reference Guide")) Automerge gives you replicated shared state plus complete change history. ([Automerge](https://automerge.org/blog/automerge-3/?utm_source=chatgpt.com "Automerge 3.0")) Koka and Unison make computational effects visible in types, with Unison extending the idea into distributed computation. ([Unison](https://www.unison-lang.org/docs/language-reference/abilities-and-ability-handlers/?utm_source=chatgpt.com "Abilities and ability handlers · Unison programming language"))

The review argues that the differentiation is not "nobody has thought about state/authority/provenance." Every one of those has substantial prior art. The potentially distinct thesis is their **unification around a participant-neutral environment**:

`heterogeneous participants + persistent shared world + authority + effects + causal provenance + invariants + dynamic coordination`

The saved review did not identify a system that makes all seven the same semantic object.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Systems survey from the programmable environments report


The following current systems discussion and both comparison matrices come from the [programmable human-AI environments report]({{< ref "ai/design-research/02-human-ai-collaboration/03-programmable-human-ai-environments-report" >}}). They complement the earlier landscape above. The empirical collaboration study, the qualifications on system claims, and all four conclusions from the matrices remain with their source sections.

## Current LLM systems and human augmentation


Recent LLM work adds a computational primitive that older workflow and MAS literature did not have at comparable scale: **cheap generation of plausible alternatives in high-dimensional symbolic spaces**. An LLM can generate candidate code, plans, queries, explanations, decompositions, tool calls, hypotheses, simulations and role-specific responses. That is better modelled as `Context -> Candidate<T>*` than as a noisy implementation of `Input -> CorrectAnswer`.

The cleanest recent systems explicitly exploit that asymmetry between **generation** and **judgement**.

AlphaGeometry runs symbolic deduction until it becomes stuck, then uses a language model to propose a useful auxiliary construction and returns to the symbolic engine. The language model expands the search space; proof validity resides in symbolic deduction. [^turn18search12] FunSearch similarly asks an LLM to generate candidate programs, executes and scores them with an automated evaluator, retains high-scoring candidates and feeds them back into an evolutionary search. It demonstrated this on the cap-set problem and bin packing. [^turn18search1] AlphaEvolve generalises this generator-evaluator pattern to larger program/codebase optimisation, using multiple Gemini models for proposals, automated evaluators for objective scoring, and an evolutionary database of candidates; Google reports applications in data-centre scheduling, chip design, AI training and algorithm discovery. Its explicit limitation is also revealing: this pattern is easiest where candidates can be objectively and automatically evaluated. [^turn18search0]

These systems suggest a useful primitive:

```text
Proposal<T> {
    candidate: T
    produced_by: Participant
    based_on: Evidence*
    confidence?: Estimate
}

evaluate(Proposal<T>) -> Assessment
commit(Proposal<T>, Authority, Policy) -> Result | Rejection
```


The **proposal is not yet a state transition**. This is an architectural synthesis rather than terminology used uniformly by those papers, but it captures their common structure. [^turn18search12][^turn18search1][^turn18search0]

A related line makes the symbolic intermediate representation explicit. LLM+P translates a natural-language planning problem into PDDL, delegates plan construction to an external classical planner, and converts the result back to natural language. Its evaluations on planning benchmarks show the value of assigning different parts of the problem to the model and the formal planner. [^turn8academia3] ReAct takes a looser approach: it interleaves generated reasoning with actions against external environments and evaluated the pattern on knowledge tasks such as HotpotQA and FEVER and interactive environments including ALFWorld and WebShop. [^turn8academia0] ReAct greatly improved the programming model for tool-using LLMs, but its natural-language reasoning/action loop does not itself enforce a distinction between an instruction, untrusted observation and authorised effect.

Programming-language research around LLMs is beginning to make such structure more explicit. LMQL frames prompting as language-model programming: ordinary program control is combined with model generation and constraints on generated outputs, and the compiler turns those constraints into an inference procedure. Its reported evaluations showed comparable or improved task performance while reducing model/API cost in tested workloads. [^turn18academia34] DSPy moves the abstraction up again: developers declare LM modules and a computational graph, and a compiler/optimiser tunes model-facing parameters against a metric. Its ICLR evaluation covered mathematical reasoning, multi-hop retrieval/QA and agent loops. [^turn19search2][^turn19academia23] Neither, in its foundational formulation, is primarily an authority or multi-principal security model; their compiler abstractions mostly concern how to produce good model computations.

Recent agent runtimes have independently rediscovered several older distributed-systems abstractions.

**AutoGen** originally framed complex LLM applications as conversations among configurable agents that may incorporate LLMs, humans and tools. Its later redesign introduced an actor-style core with asynchronous messages and an event-driven runtime, while higher layers expose agent state, memory and workflow patterns. [^turn9academia14][^turn9search1] The actor model is a good boundary for heterogeneous implementation and distribution. The price is that many global properties are emergent properties of conversations unless an additional supervisory/runtime layer enforces them.

**LangGraph** makes shared program state central. A `StateGraph` has state, nodes and edges; checkpointing persists graph state by execution thread and permits durable pause/resume. Its current human-in-the-loop middleware intercepts proposed tool calls according to a configurable policy, persists the graph at an interrupt, and supports explicit human `approve`, `edit` and `reject` decisions before execution. [^turn11search17][^turn11search2][^turn21search11] This is close to the `Proposal -> Approval -> Effect` type distinction suggested above, although the primitives are framework-level constructs rather than a general formal semantics of authority.

**Temporal** draws an even sharper deterministic/nondeterministic boundary. Its current AI-agent reference architecture states that Workflow code orchestrates and must remain replay-deterministic, while every LLM call, tool invocation, external API request and database access belongs in an Activity whose result is recorded in durable history. [^turn21search3] That boundary is important beyond reliability: it tells us exactly which computations can be replayed as program logic and which interactions represent observations/effects that must be recorded once. Temporal's architecture also supports external messages and approval-oriented agent workflows, although Temporal itself does not decide the semantic security policy of each effect. [^turn13search9][^turn13search7]

**Magentic-UI** takes the human-participation problem directly. It argues that current agents remain imperfect while becoming capable of consequential computer interaction, and introduces mechanisms including co-planning, co-tasking, multitasking, action guards and long-term memory on top of a multi-agent system that can browse, run code and manipulate files. Its evaluation deliberately spans autonomous benchmark performance, simulated users, qualitative real-user work and targeted safety tests. [^turn21academia49] This is important methodologically: if the system's object is a human-AI team, "agent task success without the human" is an incomplete dependent variable.

There is also evidence that the **shape of collaboration itself must be treated as a design variable**. Microsoft's 2026 field experiment with 388 employees held the AI tool constant while varying collaboration scaffolding. A prescribed joint-use behavioural protocol was associated with lower document quality and substantially lower production, while the cognitive-framing condition had a different effect concentrated toward the upper part of the quality distribution; the researchers explicitly caution about session confounding, differential attrition and sensitivity of model-based grading. [^turn15search0] This reinforces a distinction between two kinds of constraint:

```text
Usually valuable to constrain             Often costly to over-constrain

who may perform an effect                  how a person explores the problem
what state is authoritative                how many hypotheses an LLM generates
what must be recorded                      which participant speaks next
what invariants must hold                  exact decomposition of open-ended work
what evidence an approval refers to        internal reasoning strategy
resource / time / money bounds             collaboration topology
```


There are domains in which the right-hand side also must be prescribed--regulated processes, safety procedures and formally verified protocols are obvious examples. Workflow research exists precisely because some sequence constraints are domain invariants. [^turn4search2][^turn4search1] The architectural point is to distinguish those genuine invariants from incidental orchestration choices.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

The original report places its [trusted execution discussion]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}) between the current systems discussion above and the complete comparison matrices below. Its [historical survey]({{< ref "ai/design-research/02-human-ai-collaboration/04-augmentation-literature-and-reading-path" >}}#historical-foundations-and-the-boundaries-they-introduced) provides the context for the earlier traditions in the first matrix.

## Comparative source matrix


The following matrix extracts the requested dimensions for a curated set of foundational and current sources. "Limit" means a limitation for **this research question**, not necessarily a flaw in the work.

| Source | Problem framing | Explicit boundary / constraints | Primitives and architecture | Evaluation | Limitation for heterogeneous collaborative runtimes |
|---|---|---|---|---|---|
| **Wiener, _Cybernetics_ (1948)** [^turn7search3] | Communication and control through feedback | Controller acts on environment and observes consequences | signal, feedback, controller, environment | Primarily theoretical/interdisciplinary foundation | Says little about software composition, authority or multiple principals |
| **Ritchie & Thompson, Unix (1974; later account 1984)** [^turn17search0][^turn17search7] | General computing as composition of processes through uniform I/O | Programs need only respect common process/file/stream interfaces | process, file/device, pipe, command | Implemented operating system and extensive practical adoption | Byte streams are too weak semantically for trust, provenance and approval |
| **HEARSAY-II / blackboard architecture (1980)** [^turn3search1][^turn3search12] | Integrate independent knowledge sources to resolve uncertain interpretations | Knowledge sources interact through shared hypothesis structure; control chooses promising work | blackboard, knowledge source, hypothesis, levels of abstraction, control | Speech-understanding system | Shared workspace lacks modern multi-principal permissions/effect semantics |
| **Lucassen & Gifford, polymorphic effect systems (1988)** [^turn6search0] | Make side effects statically visible so computations can be reasoned about/composed | Type system conservatively approximates effects/regions | value type, effect, region, polymorphism | Formal soundness plus FX implementation/experiments | Describes computational effects, not whether an effect is semantically desirable |
| **van der Aalst, Petri nets for workflow (1998)** [^turn4search2][^turn4search1] | Represent process logic explicitly so business processes can be executed and checked | Valid token/state transitions encode ordering, concurrency and synchronisation | task/transition, place/state, token, workflow net | Structural/formal workflow analysis and error detection | Open-ended replanning is awkward if process topology is fixed too early |
| **Horvitz, mixed-initiative interaction (1999)** [^turn7search0][^turn7search6] | Allocate initiative dynamically between human and automated service | Automation should account for uncertainty, user goals and cost of interruption/control | user model, initiative, automated action, direct manipulation | Implemented intelligent-interface examples such as LookOut | Interaction principles, not an execution or security semantics |
| **FIPA agent architecture/ACL (c. 2000-02)** [^turn2search2][^turn2search4][^turn2search10] | Interoperability among heterogeneous autonomous agents and services | Interaction crosses standard message/platform interfaces; local implementation may vary | Agent, ACL message/speech act, sender, receiver, ontology, service, platform/AMS/directory | Specification/conformance/interoperability focus | Global state and system-wide invariants remain distributed |
| **Garcez, Broda & Gabbay, _Neural-Symbolic Learning Systems_ (2002)** [^turn2search1] | Combine neural learning with symbolic knowledge representation/reasoning | Formal representation/reasoning layer constrains or communicates with learned system | neural model, logical knowledge, symbolic representation, inference | Formal constructions and application examples across the book | Primarily representation/reasoning integration; human authority and effects are outside scope |
| **Wooldridge, _An Introduction to MultiAgent Systems_ (2009)** [^turn16search0] | Design autonomous agents and societies of interacting agents | Agent autonomy/locality is assumed; cooperation/competition happens through interactions | agent, action, environment, protocol, goals, society | Textbook synthesis of theory and applications | "Agent" is often too strong a primitive for stateless models, tools and ordinary programs |
| **seL4 verification / capability microkernel (2009-)** [^turn5search2][^turn5search7] | Build systems from isolated components with a small trusted kernel mediating resources | All protected resource access crosses kernel; authority represented by security capabilities | process/address space, object, security capability, IPC, kernel | Machine-checked functional-correctness and security proofs under explicit assumptions | Kernel can enforce authority/isolation but does not know whether a task result is sensible |
| **W3C PROV (2013)** [^turn14search0] | Interchange machine-readable provenance across heterogeneous systems | Provenance relationships are explicit and extensible | `Entity`, `Activity`, `Agent`, `Plan`, generation, use, derivation, attribution, delegation | W3C formal data model/ontology rather than task benchmark | Descriptive/auditable; does not prevent forbidden actions |
| **Garcez & Lamb, "Neurosymbolic AI: The 3rd Wave" (2020)** [^turn2academia38] | Principled integration of learning and symbolic reasoning for trustworthy AI | Learned and symbolic components retain complementary roles | neural learning, symbolic KR/reasoning | Position/synthesis paper | Still component/representation-centric relative to full socio-technical execution |

The modern systems make the division of concerns even clearer:

| Source/system | Problem framing | Explicit boundary / constraints | Primitives and architecture | Evaluation | Limitation |
|---|---|---|---|---|---|
| **ReAct (2022)** [^turn8academia0] | Interleave language-model reasoning and environmental actions | Action APIs delimit how model changes environment | reasoning trace, action, observation | HotpotQA, FEVER, ALFWorld, WebShop | Model-generated text still largely carries both cognition and control |
| **LMQL (2022-23)** [^turn18academia34] | Treat prompting as programming | Programmer specifies control and constraints; compiler constrains generation | query/program, variables, constraints, model call | Multiple NLP/reasoning tasks; cost/computation comparisons | Output constraints are not a general model of identity or authority |
| **LLM+P (2023)** [^turn8academia3] | Use LLM for semantic translation and classical planner for actual planning | PDDL is the formal interface; planner constrains valid plan search | problem, PDDL domain/state/action, plan | Classical planning benchmarks | Depends on correct LLM translation and domains representable in PDDL |
| **FunSearch (2023)** [^turn18search1] | Use LLM as generator inside evolutionary program search | Candidate code must execute and pass objective evaluator | program candidate, evaluator score, program database | Cap-set and bin-packing problems | Requires strong executable/objective evaluator; not enough for subjective work |
| **DSPy (2023-24)** [^turn19search2][^turn19academia23] | Compile declarative LM pipelines against task metrics | Program topology/modules separated from parameters that optimiser searches | signature/module, computational graph, metric, optimiser | GSM8K, retrieval/multi-hop QA and agent-loop case studies | Optimises task quality; does not define a trusted authority/effect model |
| **AutoGen (2023-present)** [^turn9academia14][^turn9search1] | Build applications as interactions among configurable LLM/human/tool agents | Actor/message/runtime interface separates participants | agent/actor, message, event, runtime, state/memory | Original work uses diverse example applications; later system is engineering-oriented | Conversation protocols do not by themselves establish global invariants |
| **LangGraph (current)** [^turn11search17][^turn11search2][^turn21search11] | Agent/workflow as stateful graph with durable checkpoints | Nodes mutate shared graph state; interrupts mediate selected tool calls | StateGraph, node, edge, checkpoint/thread, interrupt, `approve/edit/reject` | Production framework/docs rather than one canonical academic benchmark | Policy semantics/application authority remain developer-defined |
| **Temporal AI architecture (current)** [^turn21search3] | Durable execution of nondeterministic agent workflows | Deterministic Workflow orchestration separated from nondeterministic Activities | Workflow, Activity, history, update/signal, task state | Reference implementation and production-derived architecture | Reliability boundary is very strong; semantic correctness/authorisation still external |
| **Magentic-UI (2025)** [^turn21academia49] | Human oversight and collaboration can compensate for imperfect autonomous agents | Human can participate in planning, work and consequential-action control | orchestrator/agents, task/plan, co-planning, co-tasking, action guards, memory | Agent benchmarks, simulated users, real-user qualitative studies, targeted safety | Early research system; no complete formal model of human authority |
| **AlphaEvolve (2025)** [^turn18search0] | LLMs supply creative program proposals; objective evaluators select and evolve them | Only evaluator-scored executable candidates enter evolutionary selection | program, proposal, evaluator, score, program database | Mathematics/algorithm tasks and reported Google infrastructure applications | Depends on computable high-quality objective functions |
| **CaMeL (2025; SaTML 2026)** [^turn21search0][^turn21search8] | Protect tool-using LLMs even when the model itself is susceptible to prompt injection | Trusted user control flow separated from untrusted data; tool policies enforce data/security capabilities | trusted/quarantined model roles, data-flow graph, security capability, tool policy | AgentDojo; revised paper reports 77% secure task completion vs 84% undefended | Strong guarantees rely on explicit threat-model and flow/policy assumptions |
| **AgentSpec (2025)** [^turn20academia24] | Constrain autonomous model behaviour using runtime rules | Effects are intercepted against trigger/predicate/enforcement rules | rule, trigger, predicate, enforcement action | Code, embodied-agent and autonomous-driving evaluations | Complete safety depends on policy coverage; generated policies are imperfect |
| **MCP 2026-01-28** [^turn14search2][^turn14search10] | Standard interface between AI applications and external services/tools | Stateless protocol boundary; self-describing requests; transport authorisation; Tasks extension | request, Tool, resource, Task handle, capability/extension, auth context | Protocol/implementation adoption rather than task-quality benchmark | Standardises connectivity more than application-level authority semantics |
| **A2A current specification** [^turn15search3][^turn15search1] | Let independently implemented, opaque agents discover one another and coordinate long-running tasks | HTTP/protocol boundary; agent internals deliberately opaque; authorisation local to server | `AgentCard`, `Task`, `Message`, `Part`, `Artifact`, `Context`, lifecycle | Interoperability standard, not cognitive benchmark | Distributed policy and global invariants remain application concerns |
| **AttriGuard, USENIX Security '26** [^turn20search4] | Decide whether a requested tool effect is causally grounded in user intent | Proposed tool calls are checked at runtime against counterfactual executions with external-control influence attenuated | proposed tool call, observation, shadow execution, causal attribution | Four LLMs, two agent benchmarks; static and adaptive prompt-injection attacks | Extra model execution/latency; causal test remains an approximation of intent |

Several patterns stand out from the matrix.

First, the most generalisable primitive is not `Agent`. **`Participant` or `Principal` is more neutral.** FIPA and A2A need agent autonomy because they model independent remote actors; PROV can already describe a person, organisation or software agent under the same responsibility ontology. [^turn2search10][^turn15search3][^turn14search0] For a programming substrate, requiring everything to masquerade as an autonomous agent buys little.

Second, **`Task` is useful but insufficient**. A2A and current MCP explicitly standardise tasks because durable/asynchronous work needs identity and lifecycle. [^turn15search1][^turn14search10] A general system additionally needs to distinguish inputs, evidence, speculative proposals, accepted decisions, generated artefacts, observations, approvals and effects. Conflating all of these into "messages" recreates precisely the ambiguity that agent-security work is now trying to remove. [^turn21search0][^turn20search3]

Third, **shared state has several legitimate implementations**. A blackboard exposes evolving hypotheses; a workflow engine exposes process state/history; LangGraph exposes checkpointed graph state; Temporal exposes event-sourced workflow history; A2A exposes task lifecycle and artefacts. [^turn3search1][^turn4search2][^turn11search2][^turn21search3][^turn15search3] The choice should depend on semantics, not on a universal preference for "agent memory".

Fourth, **conversation should not be the authoritative substrate**. A2A's own current design distinguishes communication `Message`s from deliverable `Artifact`s and warns against relying on transient messages for critical information. [^turn15search3] The security literature reaches the same conclusion from another direction: a single undifferentiated natural-language context is a bad place to encode both untrusted data and trusted control. [^turn21search0][^turn20search3]

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Citation definitions for the imported report sections


These definitions are local copies from the [complete original bibliography]({{< ref "ai/design-research/02-human-ai-collaboration/03-programmable-human-ai-environments-report" >}}#references). They were added so the imported sections can be read on their own. They are not part of the moved source text.

[^turn3search1]: Lee D. Erman, Frederick Hayes-Roth, Victor R. Lesser, and D. Raj Reddy, "The HEARSAY-II Speech Understanding System: Integrating Knowledge to Resolve Uncertainty," *ACM Computing Surveys* 12(2), 1980. <https://doi.org/10.1145/356810.356816> Original Deep Research source key: `turn3search1`.

[^turn4search2]: Wil M. P. van der Aalst, "The Application of Petri Nets to Workflow Management," *Journal of Circuits, Systems and Computers* 8(1), 1998. <https://doi.org/10.1142/S0218126698000043> Original Deep Research source key: `turn4search2`.

[^turn7search0]: Eric Horvitz, "Principles of Mixed-Initiative User Interfaces," *CHI '99*, 1999. <https://doi.org/10.1145/302979.303030> Original Deep Research source key: `turn7search0`.

[^turn6search0]: John M. Lucassen and David K. Gifford, "Polymorphic Effect Systems," *POPL '88*, 1988. <https://doi.org/10.1145/73560.73564> Original Deep Research source key: `turn6search0`.

[^turn14search0]: W3C, *PROV-DM: The PROV Data Model*, W3C Recommendation, 2013. <https://www.w3.org/TR/prov-dm/> Original Deep Research source key: `turn14search0`.

[^turn18search12]: Trieu H. Trinh et al., "Solving olympiad geometry without human demonstrations," *Nature* 625, 2024. <https://doi.org/10.1038/s41586-023-06747-5> Original Deep Research source key: `turn18search12`.

[^turn18search1]: Bernardino Romera-Paredes et al., "Mathematical discoveries from program search with large language models," *Nature* 625, 2024. <https://doi.org/10.1038/s41586-023-06924-6> Original Deep Research source key: `turn18search1`.

[^turn18search0]: Alexander Novikov et al., "AlphaEvolve: A coding agent for scientific and algorithmic discovery," 2025. <https://arxiv.org/abs/2506.13131> Original Deep Research source key: `turn18search0`.

[^turn8academia3]: Bo Liu et al., "LLM+P: Empowering Large Language Models with Optimal Planning Proficiency," 2023. <https://arxiv.org/abs/2304.11477> Original Deep Research source key: `turn8academia3`.

[^turn21search3]: Temporal, "AI Agent Reference Architecture," current product/reference documentation. <https://go.temporal.io/platform-hub/ai-engineering/ai-reference-architecture> Original Deep Research source key: `turn21search3`.

[^turn21search11]: LangChain, "Human-in-the-loop," current LangGraph/LangChain documentation. <https://docs.langchain.com/oss/python/langchain/human-in-the-loop> Original Deep Research source key: `turn21search11`.

[^turn21search0]: Edoardo Debenedetti et al., "Defeating Prompt Injections by Design" (CaMeL), 2025; revised for IEEE SaTML 2026. <https://arxiv.org/abs/2503.18813> Original Deep Research source key: `turn21search0`.

[^turn17search0]: Dennis M. Ritchie and Ken Thompson, "The UNIX Time-Sharing System," *Communications of the ACM* 17(7), 1974. <https://doi.org/10.1145/361011.361061> Original Deep Research source key: `turn17search0`.

[^turn15search0]: Alex Farach, Alexia Cambon, Lev Tankelevitch, Connie Hsueh, and Rebecca Janssen, "Scaffolding Human-AI Collaboration: A Field Experiment on Behavioral Protocols and Cognitive Reframing," 2026. <https://arxiv.org/abs/2604.08678> Original Deep Research source key: `turn15search0`.

[^turn17search7]: Dennis M. Ritchie, "The Evolution of the Unix Time-sharing System," 1979/1984 historical account. <https://pdos.csail.mit.edu/6.828/2009/readings/ritchie79evolution.html> Original Deep Research source key: `turn17search7`.

[^turn2search1]: Artur S. d'Avila Garcez, Krysia B. Broda, and Dov M. Gabbay, *Neural-Symbolic Learning Systems: Foundations and Applications*, Springer, 2002. <https://doi.org/10.1007/978-1-4471-0211-3> Original Deep Research source key: `turn2search1`.

[^turn2academia38]: Artur d'Avila Garcez and Luis C. Lamb, "Neurosymbolic AI: The 3rd Wave," 2020. <https://arxiv.org/abs/2012.05876> Original Deep Research source key: `turn2academia38`.

[^turn7search3]: Norbert Wiener, *Cybernetics or Control and Communication in the Animal and the Machine*, 1948. <https://direct.mit.edu/books/oa-monograph/4581/Cybernetics-or-Control-and-Communication-in-the> Original Deep Research source key: `turn7search3`.

[^turn16search0]: Michael Wooldridge, *An Introduction to MultiAgent Systems*, 2nd ed., Wiley, 2009. <https://www.wiley-vch.de/en/areas-interest/computing-computer-sciences/an-introduction-to-multiagent-systems-978-0-470-51946-2> Original Deep Research source key: `turn16search0`.

[^turn2search10]: FIPA, *Abstract Architecture Specification*. <https://www.fipa.org/specs/fipa00001/> Original Deep Research source key: `turn2search10`.

[^turn4search1]: Wil M. P. van der Aalst, "Workflow Verification: Finding Control-Flow Errors Using Petri-Net-Based Techniques," 2000. <https://doi.org/10.1007/3-540-45594-9_11> Original Deep Research source key: `turn4search1`.

[^turn5search2]: Gerwin Klein et al., "seL4: Formal Verification of an OS Kernel," *SOSP '09*, 2009. <https://cgi.cse.unsw.edu.au/~kleing/papers/sosp09.html> Original Deep Research source key: `turn5search2`.

[^turn7search6]: Eric Horvitz, "Principles of Mixed-Initiative User Interfaces," *CHI '99*, 1999. <https://doi.org/10.1145/302979.303030> Original Deep Research source key: `turn7search6`.

[^turn3search12]: Victor R. Lesser, Richard D. Fennell, Lee D. Erman, and D. Raj Reddy, "Organization of the HEARSAY-II Speech Understanding System." <https://mas.cs.umass.edu/pub/paper_detail.php/280> Original Deep Research source key: `turn3search12`.

[^turn2search2]: FIPA, *ACL Message Structure Specification*. <https://www.fipa.org/specs/fipa00061/> Original Deep Research source key: `turn2search2`.

[^turn2search4]: FIPA, *Agent Management Specification*. <https://www.fipa.org/specs/fipa00023/> Original Deep Research source key: `turn2search4`.

[^turn5search7]: seL4 Foundation, "Verification / Proofs," official seL4 verification documentation. <https://sel4.systems/Verification/proofs.html> Original Deep Research source key: `turn5search7`.

[^turn8academia0]: Shunyu Yao et al., "ReAct: Synergizing Reasoning and Acting in Language Models," 2022/ICLR 2023. <https://arxiv.org/abs/2210.03629> Original Deep Research source key: `turn8academia0`.

[^turn18academia34]: Luca Beurer-Kellner, Marc Fischer, and Martin Vechev, "Prompting Is Programming: A Query Language for Large Language Models" (LMQL), 2022/PLDI 2023. <https://arxiv.org/abs/2212.06094> Original Deep Research source key: `turn18academia34`.

[^turn19search2]: Omar Khattab et al., "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines," ICLR 2024. <https://arxiv.org/abs/2310.03714> Original Deep Research source key: `turn19search2`.

[^turn19academia23]: Omar Khattab et al., "DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines," ICLR 2024. <https://arxiv.org/abs/2310.03714> Original Deep Research source key: `turn19academia23`.

[^turn9academia14]: Qingyun Wu et al., "AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation," 2023. <https://arxiv.org/abs/2308.08155> Original Deep Research source key: `turn9academia14`.

[^turn9search1]: Microsoft AutoGen, "Core" documentation: actor-model, event-driven agent runtime. <https://microsoft.github.io/autogen/dev/user-guide/core-user-guide/index.html> Original Deep Research source key: `turn9search1`.

[^turn11search17]: LangChain, "Persistence," current LangGraph documentation. <https://docs.langchain.com/oss/python/langgraph/persistence> Original Deep Research source key: `turn11search17`.

[^turn11search2]: LangChain, "Persistence," current LangGraph documentation (checkpointed state and threads). <https://docs.langchain.com/oss/python/langgraph/persistence> Original Deep Research source key: `turn11search2`.

[^turn13search9]: Temporal, "AI Agent Reference Architecture," current reference documentation. <https://go.temporal.io/platform-hub/ai-engineering/ai-reference-architecture> Original Deep Research source key: `turn13search9`.

[^turn13search7]: Temporal, "AI Agent Reference Architecture," including messages/approval-oriented durable workflow patterns. <https://go.temporal.io/platform-hub/ai-engineering/ai-reference-architecture> Original Deep Research source key: `turn13search7`.

[^turn21academia49]: Hussein Mozannar et al., "Magentic-UI: Towards Human-in-the-loop Agentic Systems," Microsoft Research, 2025. <https://www.microsoft.com/en-us/research/publication/magentic-ui-report/> Original Deep Research source key: `turn21academia49`.

[^turn20search3]: Edoardo Debenedetti et al., "AgentDojo: A Dynamic Environment to Evaluate Prompt Injection Attacks and Defenses for LLM Agents," NeurIPS 2024. <https://arxiv.org/abs/2406.13352> Original Deep Research source key: `turn20search3`.

[^turn21search8]: Edoardo Debenedetti et al., "Defeating Prompt Injections by Design" (CaMeL), 2025; revised for IEEE SaTML 2026. <https://arxiv.org/abs/2503.18813> Original Deep Research source key: `turn21search8`.

[^turn20academia24]: Haoyu Wang, Christopher M. Poskitt, and Jun Sun, "AgentSpec: Customizable Runtime Enforcement for Safe and Reliable LLM Agents," ICSE 2026. <https://doi.org/10.1145/3744916.3764546> Original Deep Research source key: `turn20academia24`.

[^turn20search4]: Yu He et al., "AttriGuard: Defeating Indirect Prompt Injection in LLM Agents via Causal Attribution of Tool Invocations," USENIX Security 2026. <https://www.usenix.org/conference/usenixsecurity26/presentation/he-yu> Original Deep Research source key: `turn20search4`.

[^turn15search3]: Agent2Agent (A2A) Protocol, current specification and core concepts. <https://a2a-protocol.org/latest/topics/key-concepts/> Original Deep Research source key: `turn15search3`.

[^turn15search1]: Agent2Agent (A2A) Protocol, current enterprise/security and authorization guidance. <https://a2a-protocol.org/latest/topics/enterprise-ready/> Original Deep Research source key: `turn15search1`.

[^turn14search2]: Model Context Protocol maintainers, "The 2026-01-28 Specification," 28 July 2026. <https://blog.modelcontextprotocol.io/posts/2026-01-28/> Original Deep Research source key: `turn14search2`.

[^turn14search10]: Model Context Protocol maintainers, "The 2026-01-28 MCP Specification Release Candidate," including the Tasks extension redesign. <https://blog.modelcontextprotocol.io/posts/2026-01-28-release-candidate/> Original Deep Research source key: `turn14search10`.
