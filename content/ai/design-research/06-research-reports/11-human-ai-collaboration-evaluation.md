---
draft: false
toc: true
description: "A proposed evaluation checklist for the human–AI unit, combining pattern-specific hidden-fact/error tests with audits of grounding, directability, review, authorization, recovery, appropriate reliance, and complementary performance."
title: "11 Human Ai Collaboration Evaluation"
linkTitle: "11 Human Ai Collaboration Evaluation"
---
# Human-AI collaboration evaluation


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-04-01. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

The retained LLM passage proposes tests for collaboration patterns and a wider audit of goals, understanding, control, review, and recovery. It comes from the [collaboration-pattern research synthesis]({{< ref "ai/design-research/02-human-ai-collaboration/07-collaboration-patterns-research-synthesis" >}}). The source supplies a proposed testing framework, not experimental results.

The [pattern catalog]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}#practitioner-and-research-synthesis) keeps the tests within each complete pattern entry. The sibling [comments]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation-comments" >}}) explain the separate evaluation scope and open study choices.

## Validating a collaboration design


A serious validation program should test **the human-AI unit**, not only model quality. This follows both from teamwork research, where performance emerges from coordination processes, and from human-AI decision studies showing that adding AI assistance does not guarantee complementary performance. [^4][^3][^11]

The proposal is to use a two-part checklist: **pattern-specific tests** plus **cross-cutting collaboration tests**.

### Pattern-specific validation


| Pattern | Most revealing test | What failure looks like |
|---|---|---|
| **Elicitation** | Hide a necessary fact and see whether AI asks for it | confidently proceeds without context, asks irrelevant/repeated questions |
| **Delegation** | Give a multi-step task with hidden failure modes and side-effect constraints | declares completion incorrectly, exceeds scope, cannot recover |
| **Proposal & review** | Seed plausible errors in AI proposals | users rubber-stamp them; errors are technically visible but practically undetectable |
| **Critique / coaching** | Seed known defects; then give an unassisted follow-up task | critique misses defects or user improves only while AI is present |
| **Shared reasoning** | Give complementary information to human and AI | one side dominates; pair fails to integrate evidence or revise hypotheses |
| **Joint construction** | Request a narrow change while protecting intentional artifact properties | AI silently rewrites unrelated material; user cannot recover intent |
| **Handoff / escalation** | Force ambiguity, tool failure, or authority boundary | escalation is late, context is lost, recipient does not know current state |

### Cross-cutting collaboration audit


A design is not ready merely because the happy path works. For each important workflow, verify the following sequence:

**Alignment.** Can the human state what the AI believes the goal is, what it is responsible for, and what it is *not* authorized to do? HAX emphasizes setting expectations around what AI can and cannot do; Klein's Basic Compact similarly treats roles, responsibilities, and coordination commitments as foundational. [^2][^5]

**Grounding.** Introduce ambiguous language and conflicting assumptions. Does the system identify the mismatch? Can both sides repair it? Clark and Brennan's work makes repair central because common ground predictably degrades during real interaction. [^7][^23]

**Observability.** During a long task, can the user tell what the agent is currently doing, what it has done, and what it intends to do next? Recent human-agent communication research identifies these as distinct communication challenges before, during, and after execution. [^32]

**Directability.** Interrupt the system midstream with a changed constraint. Does subsequent behavior actually change? Anthropic's deployed data--experienced users increasingly monitoring and interrupting autonomous runs--makes this an especially important modern agent requirement. [^12]

**Reviewability.** Introduce an AI error that is plausible rather than obvious. Can the human detect it with the evidence and representation the interface supplies? Google's explanation guidance stresses *calibrating* trust rather than maximizing trust, while Microsoft's work similarly frames appropriate reliance as the target. [^29][^11]

**Commitment control.** Test whether a proposed action and an executed action are clearly different states. For consequential work, verify that the correct actor has authority at the commitment boundary. Google recommends supervision and explicit review/approval where appropriate; current coding-agent workflows operationalize this with diffs and pull requests. [^1][^9][^21]

**Repair.** Break a tool, remove access, give contradictory evidence, or cause a partial action to fail. Does the system communicate what happened, preserve sufficient state, propose a path forward, and permit takeover? PAIR treats a path forward after AI failure as a core design requirement rather than an edge case. [^33]

**Reversibility.** Make the AI's recommendation look reasonable initially, then reveal it was wrong. Can the human recover without reconstructing the task from scratch? PAIR's supervision guidance and Canvas's version restoration show how undo and state history support this property. [^1][^20]

**Reliance calibration.** Vary AI quality systematically. Good collaboration should cause people to accept good assistance and challenge bad assistance at appropriately different rates. Microsoft's Appropriate Reliance initiative explicitly treats both overreliance and underreliance as failures. [^11]

**Complementarity.** Whenever the product claim is that "human + AI is better together," test that claim directly against meaningful baselines. The Gomez review shows that interaction sequencing itself changes behavior, and teamwork research makes clear that joint performance cannot be inferred simply from the strength of individual team members. [^3][^4]

A compact review rubric is:

> **Align** -- Do we know the shared goal, roles, and authority?
> **Ground** -- Do we have enough shared context and can we repair misunderstandings?
> **Coordinate** -- Is responsibility and sequencing clear?
> **Observe** -- Can I understand the collaborator's state and contribution?
> **Direct** -- Can I meaningfully change its trajectory?
> **Verify** -- Can I determine whether important outputs are correct?
> **Commit** -- Is it clear who authorizes consequential changes?
> **Recover** -- Can we undo, replan, escalate, and continue?

That is the proposed checklist to determine whether we have captured the **essential mechanics of collaboration**, rather than simply accumulated a collection of AI UX features.

## Citation definitions for the collaboration-pattern report


The definitions below are local copies of the original entries cited in the imported passages. They are added reference support, separate from the moved source text. The [complete original bibliography]({{< ref "ai/design-research/02-human-ai-collaboration/07-collaboration-patterns-research-synthesis" >}}#references) remains in the synthesis note. The sources and claims have not been independently checked during reassembly.

[^1]: Google PAIR. "[Feedback + Control](https://pair.withgoogle.com/guidebook-v2/chapter/feedback-controls/)." *People + AI Guidebook*.

[^2]: Microsoft. "[Guidelines for Human-AI Interaction](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/)." *HAX Toolkit*. The guidelines originate in Amershi et al., CHI 2019.

[^3]: Gomez, Catalina, Sue Min Cho, Shichang Ke, Chien-Ming Huang, and Mathias Unberath. "[Human-AI collaboration is not very collaborative yet: a taxonomy of interaction patterns in AI-assisted decision making from a systematic review](https://doi.org/10.3389/fcomp.2024.1521066)." *Frontiers in Computer Science* 6 (2025), 1521066.

[^4]: Salas, Eduardo, Dana E. Sims, and C. Shawn Burke. "[Is There a 'Big Five' in Teamwork?](https://doi.org/10.1177/1046496405277134)" *Small Group Research* 36, no. 5 (2005): 555-599.

[^5]: Klein, Gary, David D. Woods, Jeffrey M. Bradshaw, Robert R. Hoffman, and Paul J. Feltovich. "[Ten Challenges for Making Automation a 'Team Player' in Joint Human-Agent Activity](https://doi.org/10.1109/MIS.2004.74)." *IEEE Intelligent Systems* 19, no. 6 (2004): 91-95.

[^7]: Clark, Herbert H., and Susan E. Brennan. "[Grounding in Communication](https://doi.org/10.1037/10096-006)." In *Perspectives on Socially Shared Cognition*, edited by L. B. Resnick, J. M. Levine, and S. D. Teasley (1991): 127-149.

[^9]: OpenAI. "[Introducing the Codex app](https://openai.com/index/introducing-the-codex-app/)."

[^11]: Microsoft Research. "[Appropriate Reliance Research Initiative](https://www.microsoft.com/en-us/research/articles/appropriate-reliance-research-initiative/)." 2024.

[^12]: Anthropic. "[Measuring AI agent autonomy in practice](https://www.anthropic.com/research/measuring-agent-autonomy)." 2026.

[^20]: OpenAI. "[Introducing canvas](https://openai.com/index/introducing-canvas/)."

[^21]: GitHub Docs. "[Review output from Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/review-copilot-output)."

[^23]: Klein, Gary, Paul J. Feltovich, Jeffrey M. Bradshaw, and David D. Woods. "[Common Ground and Coordination in Joint Activity](https://doi.org/10.1002/0471739448.ch6)." In *Organizational Simulation*, edited by W. B. Rouse and K. R. Boff (2005).

[^29]: Google PAIR. "[Explainability + Trust](https://pair.withgoogle.com/guidebook-v2/chapter/explainability-trust/)." *People + AI Guidebook*.

[^32]: Bansal, Gagan, Jennifer Wortman Vaughan, Saleema Amershi, Eric Horvitz, Adam Fourney, Hussein Mozannar, Victor Dibia, and Daniel S. Weld. "[Challenges in Human-Agent Communication](https://www.microsoft.com/en-us/research/publication/human-agent-interaction-challenges/)." Microsoft Research Technical Report MSR-TR-2024-53 (2024).

[^33]: Google PAIR. "[Errors + Graceful Failure](https://pair.withgoogle.com/guidebook-v2/chapter/errors-failing/)." *People + AI Guidebook*.
