---
draft: false
toc: true
description: "A research synthesis distinguishing six collaboration modes from handoff transitions and underlying mechanics, arguing that joint performance and calibrated review matter more than AI accuracy alone."
title: "07 Collaboration Patterns Research Synthesis"
linkTitle: "07 Collaboration Patterns Research Synthesis"
---
# Human-AI Collaboration Patterns: A Practitioner and Research Synthesis


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

## Executive summary


There is **no single, settled practitioner taxonomy of human-AI collaboration patterns**. The field is converging, but different traditions describe different layers of the problem. Google PAIR and Microsoft HAX mostly formulate **interaction mechanics**--feedback, correction, explanations, supervision, control, graceful failure, and automation levels. Modern agent products from OpenAI, Anthropic, and GitHub increasingly embody **work-allocation patterns** such as delegation, plan/review, monitoring/intervention, and explicit handoff. HCI papers, meanwhile, use terms such as *AI-first assistance*, *AI-follow assistance*, *dialogic engagement*, *mixed initiative*, *co-creation*, and *delegation*. Teamwork and joint-activity research supplies the deeper requirements: common ground, mutual predictability, mutual directability, performance monitoring, backup behavior, and adaptability. [^1][^2][^3][^4][^5]

The first-principles taxonomy is therefore **substantially right**, but the proposal is to refactor it slightly. The research suggests **six primary collaboration modes**, plus **handoff/escalation as a transition pattern rather than a peer mode**:

> **Elicit -> Delegate -> Propose & review -> Critique/coach -> Reason together -> Construct together**
> with **handoff/escalation** moving responsibility between those modes.

This distinction matters. *Delegation*, for example, specifies who performs the work. *Proposal & review* specifies who generates versus who commits. *Shared reasoning* specifies how judgment is distributed. *Handoff* specifies how that allocation changes over time. Those are different dimensions of collaboration rather than interchangeable UI patterns. This interpretation is consistent with systematic HCI taxonomies, mixed-initiative research, and human-automation research. [^3][^6][^5]

A second important conclusion is that **the pattern is not enough**. Any collaboration mode needs a common substrate:

**alignment -> grounding -> coordination -> observability/directability -> review/commitment -> repair/adaptation**

Clark and Brennan's grounding research explains why collaborators continually establish sufficient shared understanding; Klein and colleagues add mutual predictability and directability; Salas and colleagues emphasize monitoring, backup behavior, adaptability, shared mental models, trust, and closed-loop communication. Modern AI guidelines translate these requirements into concrete UX mechanisms such as showing what the system is doing, enabling correction, explaining consequential outputs, preserving control, and providing takeover paths. [^7][^5][^4][^8]

The practical design question is therefore not:

> "Should this be a copilot, agent, or chatbot?"

It is:

> **Who has the information? Who should do the work? Who should exercise judgment? Who has authority to commit? Who needs to learn from doing the task? And when should responsibility move?**

Those answers determine the collaboration pattern.

The strongest finding for the earlier **proposal interface** is also clear: **"transparency" is too vague**. In collaborative work, the relevant design contract is more concrete:

`AI contribution -> make it observable -> make evidence available -> allow challenge/edit -> explicit commitment -> retain reversibility`

That combines **inspectability, verifiability, directability, and commitment control**. Google calls related mechanics "supervise automation" and "review and approve"; Microsoft calls for efficient correction, explanations, consequence visibility, and controls; current coding agents expose plans, diffs, comments, approvals, and review gates. [^1][^2][^9][^10]

Finally, the best way to validate a collaborative AI is **not AI accuracy alone**. Test whether the *human-AI system* can establish common ground, detect and repair misunderstandings, appropriately allocate work, catch seeded AI errors, maintain calibrated reliance, transfer control without losing situational awareness, and outperform sensible human-only and AI-only baselines where complementarity is the goal. Research on AI-assisted decisions repeatedly finds that adding advice, confidence, or explanations does not automatically produce better joint performance; interaction order and cognitive biases matter. [^3][^11]

<!-- Navigation added during reassembly on 2026-04-01. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

The original report summary and complete bibliography remain here. The report is a retained LLM synthesis, not an adopted taxonomy or independently verified review. The sibling [comments]({{< ref "ai/design-research/02-human-ai-collaboration/07-collaboration-patterns-research-synthesis-comments" >}}) explain the split and the status of its claims.

## Redistributed report sections


- The [collaboration patterns note]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}#practitioner-and-research-synthesis) retains the terminology comparison, complete catalog, selection diagram, and design worksheet.
- The [joint-activity model]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}#research-synthesis-of-collaboration-mechanics) retains the general mechanics, consolidated model, complete workflow, and closing argument.
- The [collaboration evaluation note]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation" >}}) retains the pattern tests, collaboration audit, and review rubric.

The [original source redirect]({{< ref "ai/collab-and-joint-work/human-ai-collaboration-patterns-report" >}}) links all destinations. The mapping log records the original ranges and checksums.

## Citation index added during reassembly


The source labels below refer to every original bibliography entry, including entries cited only in the redistributed sections. They are added navigation, not new references.

Original source labels: 1[^1], 2[^2], 3[^3], 4[^4], 5[^5], 6[^6], 7[^7], 8[^8], 9[^9], 10[^10], 11[^11], 12[^12], 13[^13], 14[^14], 15[^15], 16[^16], 17[^17], 18[^18], 19[^19], 20[^20], 21[^21], 22[^22], 23[^23], 24[^24], 25[^25], 26[^26], 27[^27], 28[^28], 29[^29], 30[^30], 31[^31], 32[^32], 33[^33], 34[^34], 35[^35].

## References


[^1]: Google PAIR. "[Feedback + Control](https://pair.withgoogle.com/guidebook-v2/chapter/feedback-controls/)." *People + AI Guidebook*.

[^2]: Microsoft. "[Guidelines for Human-AI Interaction](https://www.microsoft.com/en-us/haxtoolkit/ai-guidelines/)." *HAX Toolkit*. The guidelines originate in Amershi et al., CHI 2019.

[^3]: Gomez, Catalina, Sue Min Cho, Shichang Ke, Chien-Ming Huang, and Mathias Unberath. "[Human-AI collaboration is not very collaborative yet: a taxonomy of interaction patterns in AI-assisted decision making from a systematic review](https://doi.org/10.3389/fcomp.2024.1521066)." *Frontiers in Computer Science* 6 (2025), 1521066.

[^4]: Salas, Eduardo, Dana E. Sims, and C. Shawn Burke. "[Is There a 'Big Five' in Teamwork?](https://doi.org/10.1177/1046496405277134)" *Small Group Research* 36, no. 5 (2005): 555-599.

[^5]: Klein, Gary, David D. Woods, Jeffrey M. Bradshaw, Robert R. Hoffman, and Paul J. Feltovich. "[Ten Challenges for Making Automation a 'Team Player' in Joint Human-Agent Activity](https://doi.org/10.1109/MIS.2004.74)." *IEEE Intelligent Systems* 19, no. 6 (2004): 91-95.

[^6]: Horvitz, Eric. "[Principles of Mixed-Initiative User Interfaces](https://www.microsoft.com/en-us/research/publication/principles-mixed-initiative-user-interfaces/)." In *Proceedings of CHI '99* (1999): 159-166. DOI: 10.1145/302979.303030.

[^7]: Clark, Herbert H., and Susan E. Brennan. "[Grounding in Communication](https://doi.org/10.1037/10096-006)." In *Perspectives on Socially Shared Cognition*, edited by L. B. Resnick, J. M. Levine, and S. D. Teasley (1991): 127-149.

[^8]: Google PAIR. "[People + AI Guidebook -- Chapters](https://pair.withgoogle.com/guidebook-v2/chapters)."

[^9]: OpenAI. "[Introducing the Codex app](https://openai.com/index/introducing-the-codex-app/)."

[^10]: Anthropic. "[Claude Code: Best practices for agentic coding](https://www.anthropic.com/engineering/claude-code-best-practices)."

[^11]: Microsoft Research. "[Appropriate Reliance Research Initiative](https://www.microsoft.com/en-us/research/articles/appropriate-reliance-research-initiative/)." 2024.

[^12]: Anthropic. "[Measuring AI agent autonomy in practice](https://www.anthropic.com/research/measuring-agent-autonomy)." 2026.

[^13]: Lubars, Brian, and Chenhao Tan. "[Ask Not What AI Can Do, But What AI Should Do: Towards a Framework of Task Delegability](https://papers.neurips.cc/paper/8301-ask-not-what-ai-can-do-but-what-ai-should-do-towards-a-framework-of-task-delegability)." *Advances in Neural Information Processing Systems 32* (NeurIPS 2019).

[^14]: OpenAI. "[Introducing deep research](https://openai.com/index/introducing-deep-research/)."

[^15]: GitHub Docs. "[Get started with Copilot agents on GitHub](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/overview)."

[^16]: OpenAI. "[ChatGPT Study Mode -- FAQ](https://help.openai.com/en/articles/11780217-chatgpt-study-mode-faq)."

[^17]: GitHub Docs. "[Using GitHub Copilot code review on GitHub](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/copilot-code-review)."

[^18]: Anthropic. "[Code Review](https://code.claude.com/docs/en/code-review)." *Claude Code Docs*.

[^19]: Rezwana, Jeba, and Mary Lou Maher. "[Designing Creative AI Partners with COFI: A Framework for Modeling Interaction in Human-AI Co-Creative Systems](https://doi.org/10.1145/3519026)." *ACM Transactions on Computer-Human Interaction* 30, no. 5 (2023), Article 67.

[^20]: OpenAI. "[Introducing canvas](https://openai.com/index/introducing-canvas/)."

[^21]: GitHub Docs. "[Review output from Copilot](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/review-copilot-output)."

[^22]: Rezwana, Jeba, and Mary Lou Maher. "[Understanding User Perceptions, Collaborative Experience and User Engagement in Different Human-AI Interaction Designs for Co-Creative Systems](https://arxiv.org/abs/2204.13217)." arXiv:2204.13217 (2022).

[^23]: Klein, Gary, Paul J. Feltovich, Jeffrey M. Bradshaw, and David D. Woods. "[Common Ground and Coordination in Joint Activity](https://doi.org/10.1002/0471739448.ch6)." In *Organizational Simulation*, edited by W. B. Rouse and K. R. Boff (2005).

[^24]: Anthropic. "[Automate work with routines](https://code.claude.com/docs/en/routines)." *Claude Code Docs*.

[^25]: Anthropic. "[Beyond permission prompts: making Claude Code more secure and autonomous](https://claude.com/blog/beyond-permission-prompts-making-claude-code-more-secure-and-autonomous)." 2025.

[^26]: Anthropic. "[How we built Claude Code auto mode: a safer way to skip permissions](https://www.anthropic.com/engineering/claude-code-auto-mode)." 2026.

[^27]: Anthropic. "[Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)." 2025.

[^28]: Spitzer, Philipp, Joshua Holstein, Patrick Hemmer, Michael Vössing, Niklas Kühl, Dominik Martin, and Gerhard Satzger. "[Human Delegation Behavior in Human-AI Collaboration: The Effect of Contextual Information](https://arxiv.org/abs/2401.04729)." arXiv:2401.04729 (2024).

[^29]: Google PAIR. "[Explainability + Trust](https://pair.withgoogle.com/guidebook-v2/chapter/explainability-trust/)." *People + AI Guidebook*.

[^30]: Buçinca, Zana, Maja Barbara Malaya, and Krzysztof Z. Gajos. "[To Trust or to Think: Cognitive Forcing Functions Can Reduce Overreliance on AI in AI-Assisted Decision-Making](https://doi.org/10.1145/3449287)." *Proceedings of the ACM on Human-Computer Interaction* 5, CSCW1 (2021).

[^31]: OpenAI. "[Introducing GPT-5.5](https://openai.com/index/introducing-gpt-5-5/)." 2026.

[^32]: Bansal, Gagan, Jennifer Wortman Vaughan, Saleema Amershi, Eric Horvitz, Adam Fourney, Hussein Mozannar, Victor Dibia, and Daniel S. Weld. "[Challenges in Human-Agent Communication](https://www.microsoft.com/en-us/research/publication/human-agent-interaction-challenges/)." Microsoft Research Technical Report MSR-TR-2024-53 (2024).

[^33]: Google PAIR. "[Errors + Graceful Failure](https://pair.withgoogle.com/guidebook-v2/chapter/errors-failing/)." *People + AI Guidebook*.

[^34]: Anthropic. "[Our framework for developing safe and trustworthy agents](https://www.anthropic.com/news/our-framework-for-developing-safe-and-trustworthy-agents)." 2025.

[^35]: Naikar, Neelam, Robert R. Hoffman, Emilie M. Roth, Gary Klein, Laura G. Militello, Cindy Dominguez, et al. "[Should we Make AI More Tool-like or Teammate-Like?](https://doi.org/10.1177/15553434251346904)" *Journal of Cognitive Engineering and Decision Making* 20, no. 2 (2026).
