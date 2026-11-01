---
draft: false
toc: true
description: "A preliminary reading guide for reflective agent memory, linking CoALA, Generative Agents, complementary learning systems, and Soar while distinguishing historical memory concepts from consciousness claims."
title: "Memory 1"
linkTitle: "Memory 1"
---

For reflective agent memory, the following sources are proposed as alternatives to an earlier Du recommendation. The Du source is not identified in this note; that attribution remains unresolved.

- **Sumers, Yao, Narasimhan, Griffiths -- _Cognitive Architectures for Language Agents_ ([PDF](/sources/ai-foundations/cognition-and-mind/sumers-2024-cognitive-architectures-for-language-agents.pdf.enc)), TMLR 2024.** Peer-reviewed; Princeton; gives a clean framework for working, episodic, semantic, and procedural memory in language agents. ([OpenReview](https://openreview.net/pdf/07475727a2787df12052196b9f2624497ef3c3bd.pdf "Published in Transactions on Machine Learning Research (02/2024)"))
- **Park et al. -- _Generative Agents_, UIST 2023.** This is a key paper for periodic reflection sessions: memories are periodically synthesized into higher-level reflections. It is an ACM UIST paper, with authors from Stanford and Google. ([DOI](https://doi.org/10.1145/3586183.3606763 "Generative Agents: Interactive Simulacra of Human Behavior | Proceedings of the 36th Annual ACM Symposium on User Interface Software and Technology"))
- **Shinn et al. -- _Reflexion_, NeurIPS 2023.** Explicitly stores verbal reflection in episodic memory and reuses it in later attempts. ([NeurIPS Papers](https://papers.neurips.cc/paper_files/paper/2023/hash/1b44b878bb782e6954cd888628510e90-Abstract-Conference.html "Reflexion: language agents with verbal reinforcement learning"))
- **Kumaran, Hassabis, McClelland -- _What Learning Systems do Intelligent Agents Need?_, Trends in Cognitive Sciences 2016.** Probably the strongest theoretical support for the offline "sleep/consolidation" proposal: fast episodic storage plus slower integration of structure through replay. ([ScienceDirect](https://www.sciencedirect.com/science/article/pii/S1364661316300432 "What Learning Systems do Intelligent Agents Need? Complementary Learning Systems Theory Updated - ScienceDirect"))
- **Laird -- _The Soar Cognitive Architecture_, MIT Press.** A proper book on episodic, semantic, and procedural memory inside a long-lived agent. ([MIT Press](https://mitpress.mit.edu/9780262538534/the-soar-cognitive-architecture/ "The Soar Cognitive Architecture"))
- **Baddeley, Eysenck, Anderson -- _Memory_, 4th ed., 2025.** The proposed textbook for the human-memory side. ([Routledge](https://www.routledge.com/Memory/Baddeley-Eysenck-Anderson/p/book/9781003453536 "Memory - 4th Edition - Alan Baddeley - Michael W. Eysenck - Michael C."))

The earlier Du recommendation was judged poorly screened. The proposed reading order is **CoALA -> Generative Agents -> Complementary Learning Systems -> Soar**. This provides a basis for designing periodic reflection/consolidation without depending on that disputed survey; its identity and the reason for the screening judgment remain unresolved here.

- **Zhang et al., 2024 -- _A Survey on the Memory Mechanism of LLM-based Agents_.** Earlier broad survey; good for seeing where the current taxonomy came from. [2024 memory survey](https://arxiv.org/abs/2404.13501)
- **Park et al., 2023 -- _Generative Agents_.** Read §4.2 on reflection. It is probably the cleanest prototype of a reflection session. [Generative Agents](https://arxiv.org/abs/2304.03442)
- **LightMem, 2026.** Direct implementation of offline "sleep-time" memory consolidation. [LightMem](https://arxiv.org/abs/2510.18866)
- **Kumaran, Hassabis & McClelland, 2016 -- _What Learning Systems do Intelligent Agents Need?_** A recommended cognitive-science bridge.
- **John Laird -- _The Soar Cognitive Architecture_.** The most relevant traditional AI/cognitive-architecture book: separate semantic and episodic memory, procedural knowledge, learning and integration inside an agent architecture. [The Soar Cognitive Architecture -- MIT Press](https://mitpress.mit.edu/9780262538534/the-soar-cognitive-architecture/)
- **Baddeley, Eysenck & Anderson -- _Memory_, 4th ed., 2025.** A current textbook on human memory for cognitive foundations beyond LLM-specific techniques. [Memory, 4th edition](https://www.routledge.com/Memory/Baddeley-Eysenck-Anderson/p/book/9781003453536)
- **The Oxford Handbook of Human Memory, 2024.** The recommended chapters are _Computational Models of Event Memory_, _Generalization and Abstraction_, and _Sleep and Memory_. Those three map surprisingly well onto episodic storage -> reflection/abstraction -> consolidation. [Oxford Handbook of Human Memory](https://academic.oup.com/edited-volume/57928)

## some history


The historical reason for memory in cognitive architectures is more specific than "conscious beings have memory."

In AI and cognitive science, memory became part of a cognitive architecture because cognition was modeled as a process that unfolds over time. A system needs some way to preserve state, past observations, learned knowledge, goals, and intermediate results. Without that, it can only react to the current input.

The tradition is roughly this.

In the 1950s-60s, the "cognitive revolution" replaced behaviorism with an information-processing view of the mind. Newell and Simon treated thinking as computation over internal symbols. Programs such as the General Problem Solver had a current problem state, goals, operators, and stored knowledge. Memory was therefore part of the computational machinery of thought.

Psychology was developing a similar decomposition. The influential Atkinson-Shiffrin model separated sensory memory, short-term memory, and long-term memory. Baddeley later developed the concept of working memory. Tulving distinguished episodic memory from semantic memory. Procedural memory became another major category.

AI cognitive architectures then imported and formalized these distinctions.

ACT and later ACT-R, associated with John Anderson, distinguish things like declarative knowledge and procedural knowledge. Declarative memory contains facts and experiences; procedural memory contains production rules--roughly, knowledge of what to do.

Soar, associated with Allen Newell and later John Laird, similarly has working memory, procedural memory, semantic memory, and episodic memory. The explicit goal was a "unified theory of cognition": one architecture that could explain reasoning, learning, planning, problem solving, and memory together.

This is probably the tradition reflected in current agent papers.

There is an important distinction, though:

**memory is central to cognition and agency; it is not necessarily a defining property of consciousness.**

A conscious experience can occur without a durable memory of it. Neurological cases make this distinction very clear. The famous patient H.M., for example, remained conscious and could converse normally, while being severely impaired in forming new long-term declarative memories.

Conversely, a system can have memory without anything we would normally call consciousness. A thermostat has a tiny amount of state. A database has persistent memory. A reinforcement-learning agent can remember states or encode experience in its weights. None of that implies consciousness.

So the implication

`consciousness -> memory`

is philosophically and scientifically contentious.

The implication

`temporally extended intelligent behavior -> some mechanism carrying information forward`

is much stronger.

That mechanism doesn't even have to look like a conventional "memory module."

This became an explicit debate in AI. Rodney Brooks's behavior-based robotics in the late 1980s and 1990s argued against large internal symbolic world models. His robots could exhibit fairly complex behavior with minimal explicit representation: "the world is its own best model." Yet even these systems still had local state, learned parameters, environmental feedback loops, and so on.

Connectionism shifted the issue further. A neural network's weights are themselves a kind of long-term memory. There may be no database record saying:

```text
cats have four legs
```


The knowledge is distributed across parameters.

So cognitive science gradually acquired several meanings of "memory":

- a temporary workspace;
- stored explicit facts;
- remembered events;
- learned skills;
- learned statistical structure;
- persistent internal state.

Modern LLM agents inherit all of these traditions, sometimes somewhat carelessly.

When an agent paper says:

```text
working memory
episodic memory
semantic memory
procedural memory
```


it is borrowing quite directly from cognitive psychology and cognitive architectures such as ACT-R and Soar.

But when an engineering paper calls a vector database "long-term memory," that is a much looser analogy. The vector database is only a storage and retrieval component. Human long-term memory also involves consolidation, interference, forgetting, reconstruction, abstraction, and modification of earlier knowledge.

This connects directly to the offline "sleep" proposal.

Classical cognitive architectures often treated memory as a set of persistent stores:

```text
perception
    ↓
working memory ↔ long-term memory
    ↓
reasoning/action
```


The offline-reflection proposal is closer to a later understanding:

```text
experience
    ↓
episodic storage
    ↓
offline replay / reflection
    ↓
integration with existing knowledge
    ↓
revised semantic model
```


That brings in neuroscience and the theory of **memory consolidation**, rather than just classical symbolic AI.

There is therefore a useful historical progression:

**computer state -> psychological memory stores -> cognitive architectures -> learning systems -> consolidation and continual learning.**

For this historical question, Allen Newell is a proposed starting point. His 1990 book _Unified Theories of Cognition_ explains why researchers started talking about an architecture at all: intelligence shouldn't be understood as a collection of independent tricks. There should be persistent mechanisms for knowledge, goals, actions, learning, and memory that interact across tasks.

The proposed next readings are Anderson's ACT-R and Laird's Soar to see how the memory taxonomy became concrete.

And there is a deeper point relevant to agent design: **memory is what turns a computation into something with a history.** Once an agent's current behavior can depend on what happened to _that same agent_ earlier, learning, continuity, adaptation, and eventually something resembling a persistent model of self and others become possible.

That is why memory keeps reappearing in cognitive architectures even when the architecture's authors have no claim whatsoever about consciousness.

## Library sources


- [Baddeley et al. 2020](/sources/ai-foundations/cognition-and-mind/baddeley-2020-memory.pdf.enc), *Memory*

Further reading:

- [Hu et al. 2025](/sources/ai-engineering/agents/hu-2025-memory-in-the-age-of-ai-agents.pdf.enc), *Memory in the Age of AI Agents* ([arXiv:2512.13564](https://arxiv.org/abs/2512.13564))
- [Butlin et al. 2023](/sources/ai-foundations/cognition-and-mind/butlin-2023-consciousness-in-ai.pdf.enc), *Consciousness in Artificial Intelligence* ([arXiv:2308.08708](https://arxiv.org/abs/2308.08708))
- [Klinzing et al. 2019](/sources/ai-foundations/cognition-and-mind/klinzing-2019-memory-consolidation-during-sleep.pdf.enc), *Mechanisms of systems memory consolidation during sleep* ([doi:10.1038/s41593-019-0467-3](https://doi.org/10.1038/s41593-019-0467-3))
- [Kotseruba and Tsotsos 2020](/sources/ai-foundations/cognition-and-mind/kotseruba-2020-40-years-of-cognitive-architectures.pdf.enc), *40 years of cognitive architectures* ([doi:10.1007/s10462-018-9646-y](https://doi.org/10.1007/s10462-018-9646-y))
