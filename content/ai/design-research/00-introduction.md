---
draft: false
toc: true
title: "AI systems design: purpose and reading map"
description: "Why these working notes are being shared, what they aim to offer practitioners, and how to navigate the earlier DSL exploration, reorganized research, source conversations, and next stage of work."
linkTitle: "AI systems design: purpose and reading map"
---

I am sharing these working notes to help people reason about systems that combine humans, conventional software, data, models, and LLMs. The collection records an investigation in progress: questions, proposed explanations, designs, objections, and changes in direction. I plan to develop a more coherent set of notes and, later, a set of research papers. The notebook makes the exploration available now; the later synthesis will explain my considered position, and the papers will develop focused scholarly contributions. These forms can build on the same ideas while serving different reading needs.

Two interests run together here. One is how to design useful systems: how their parts contribute to the work, how those parts fit together, and which properties the system needs to preserve. The other is how people develop an understanding of the situation they are designing for. That includes formulating a problem, finding useful concepts, comparing possibilities, and discovering that an earlier question needs to change. A better explanation or a sharper question can be a meaningful result of this work, even before a system is built.

For practitioners, I hope the material provides:

- **A language for design decisions.** Distinctions such as model capability, system behavior, human responsibility, verification, and authority can help people explain a design and compare alternatives. The aim is to connect a mechanism to the work it supports and the assumptions it requires.
- **Ways to support human thinking and understanding.** The notes explore shared representations, inspectable intermediate work, dialogue, and opportunities to revise a question or interpretation. I am interested in systems that help people participate in and understand the work they are doing.
- **A bridge between research and practical design.** The collection brings together ideas from programming languages, software architecture, human-computer interaction, and information work. Worked examples and design questions are intended to help readers consider where those ideas might apply in their own setting.
- **An inspectable account of inquiry with an LLM.** The conversations expose proposals, misunderstandings, objections, and revisions. Readers can examine how a formulation developed and decide which parts of that process are useful to them.

These aims are connected. A design choice depends on how the problem has been understood: what counts as useful work, which distinctions matter, what people need to control, and what remains uncertain. Explaining those choices makes the ideas easier to adapt and challenge. Measurements, implementations, and formal arguments can then address particular claims. The conceptual work helps determine which claims are worth examining and what the results would mean.

The material is spread across the following places:

| Part of the work | Where to start | What it contains |
|---|---|---|
| V0: the earlier DSL exploration | [Earlier entry point]({{< ref "ai/architecture-dsl-like/_index-dsl" >}}) and [original index notes]({{< ref "ai/design-research/00-overview/03-original-index-notes" >}}) | The initial exploration of types, protocols, domain models, and domain-specific languages as ways to express and constrain system behavior. The former paths now redirect to reorganized notes. |
| The reorganized research collection | [Design-research index]({{< ref "ai/design-research/00-index" >}}) | Thematic notes on foundations, collaboration, languages, investigation, runtimes, interfaces, and possible studies. This is the collection introduced here. |
| Conversations and other inputs | [Saved-conversation index]({{< ref "ai/design-research/input/pinned-chats-index" >}}) | An entry into the exported dialogues and their accompanying generated reports. The wider `input/` directory also holds earlier reports and reading material; source and authorship labels distinguish them. |
| The next stage | [AI systems design]({{< ref "ai/ai-systems-design" >}}) | A neighboring workspace where I intend to develop clearer explanations, worked examples, and more focused questions from this exploration. |

V0 names an earlier stage of the investigation. Its material was moved into `design-research`, and some dialogues were subsequently edited for standalone reading. The [reassembly history]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}) records that reorganization. The current folder is arranged by topic, so its reading order differs from the order in which the conversations happened.

The DSL thread remains one part of the broader question. It explores how a language, domain model, or compiler can make certain operations expressible and certain checks possible. The collection also asks how people and software share work, how interfaces support investigation, and how a proposed explanation becomes something a person is willing to rely on. The [research-scope note]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}) explains the relationships between these questions.

Choose a reading route according to your interest:

1. **Designing an AI system.** Begin with [Analyze AI System Design]({{< ref "ai/design-research/input/analyze-ai-system-design" >}}), which considers the whole system and the contributions assigned to an LLM. Continue with [Verification and acceptance]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) and the [builder-method proposal]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) to examine what a design needs to establish and how mechanisms might support it.
2. **Thinking and learning through LLM dialogue.** Start with the [guardrails conversation]({{< ref "ai/design-research/input/designing-llm-guardrails" >}}), where I question reliance on fluent generated explanations. Then compare the [initial framing]({{< ref "ai/design-research/00-overview/01-problem-framing" >}}) with its [later critique]({{< ref "ai/design-research/00-overview/05-refined-research-question" >}}). The [collection comments]({{< ref "ai/design-research/00-index-comments" >}}) provide a separate editorial review of unresolved assumptions and distinctions.
3. **Supporting human understanding through interaction.** Read [Sensemaking and epistemic action]({{< ref "ai/design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-action" >}}), then follow the [interactive-systems map]({{< ref "ai/design-research/interactive-systems/00-index" >}}). These notes explore representations and operations through which people can inspect, compare, and revise intermediate work.
4. **Developing a research contribution.** Start with [Research scope and hierarchy]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}), then consult the [research-method proposal]({{< ref "ai/design-research/06-research-reports/13-research-method-and-claim-validation" >}}) and its [critique]({{< ref "ai/design-research/06-research-reports/13-research-method-and-claim-validation-comments" >}}). The [full index]({{< ref "ai/design-research/00-index" >}}) links the separate language, investigation, runtime, and collaboration tracks and their proposed evaluations.

For a broader view, the [document map]({{< ref "ai/design-research/document-map" >}}) describes relationships across the collection. You can follow a question through several notes without reading the entire archive in sequence.

The process material deserves a particular kind of attention. Look at what a question assumes, which distinctions a reply introduces, where a response misses the point, and what changes after an objection. Progress can include becoming able to explain a choice, recognize a limitation, or formulate a better question.

For example, an [early compiler proposal]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) says, "Hallucinated programs simply don't compile." The [later editorial critique]({{< ref "ai/design-research/00-index-comments" >}}#compiler-validity-and-semantic-truth), attributed to Codex, identifies the missing distinction: a program can pass structural checks while making an incorrect judgment. The [verification note]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) separates compilation from task correctness, acceptance, and authorization. Following these passages gives a reader a concrete design lesson and an example of questioning a persuasive explanation. It also exposes a useful next question: which property does each check actually establish?

As I develop the collection, I intend to add short personal reflections to selected exchanges, with the longer conversations available for context. Each reflection can address four questions:

- What was I trying to understand or decide?
- What did the model contribute, and which assumptions did it introduce?
- What did I accept, reject, or revise, and why?
- What remains open, and what observation, argument, or experience could change my view?

These reflections can make my judgment visible alongside the generated material. They should also help readers distinguish a change in wording from a change in understanding. The conversations provide examples of a practice to examine; broader claims about its effectiveness would need further support.

Authorship and editing matter when reading that process. The collection contains my questions and observations, model-generated proposals and reports, captured external sources, and later editorial commentary. Several comments explicitly identify Codex as their author. Many thematic notes disclose that dialogue has been reformulated for standalone reading. Use those labels to distinguish the captured exchanges, edited accounts, and later interpretations. The exported conversations offer another view of the work where they are available.

Treat the reports and bibliographies as working research material. Some source references remain unresolved, and proposed evaluations include illustrative examples. A suggestion may recur across several notes while its justification remains open. The useful question is what supports a particular statement and what further work could change it.

I intend to continue in [AI systems design]({{< ref "ai/ai-systems-design" >}}), developing a more coherent account while keeping earlier questions and revisions available for comparison. As the work develops, I plan to date substantive revisions and link later explanations and papers to the earlier material they develop or correct. The aim is for readers to follow what I currently think, how that view developed, and what is still open. Readers can contribute by identifying an unclear distinction, offering a counterexample, pointing to relevant prior work, or describing a practical situation in which an idea helps or fails.

*Editorial note, 2026-10-28: This introduction was drafted with Codex from the author's stated aims and the existing collection. It is new framing for the material, separate from the retained dialogues.*

Publication note, 2026-10-28: The public edition omits private account links, raw browser snapshots, machine-specific source metadata, and personal or case-identifying details. Some dialogue passages are generalized for privacy.
