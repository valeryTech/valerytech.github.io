---
draft: false
toc: true
title: "Review of the AI Project Foundation Draft"
description: "Review of the AI Project Foundation note: what its opening should name and promise, a plainer framing of uncertainty, fixes for the evaluation, execution, workbench and starter-kit bullets, and what discovery means."
linkTitle: "Draft Review"
---

The wording I used was too abstract, and the long qualifications made it harder to understand the actual work. Your underscores expose three decisions that the opening tries to compress into one sentence.

1. **What are we naming?**
    "The __ we are developing" needs a noun, but choosing _platform_, _framework_, or _architecture_ would already commit to a particular kind of result. "Our effort to develop tools and practices" gives us room to describe the work while its eventual form remains open.
2. **What does it help us do?**
    "Support experimentation with AI systems" is vague. It could mean trying models, exploring possible applications, comparing system designs, or investigating failures. The document should name the activities that matter here. Your additions suggest that experimentation belongs within a broader scope that includes discovery and delivery.
3. **What do we want to learn?**
    "Developed effectively" and "delivered successfully" leave the criteria unspecified. "Systems can be discovered" is also awkward: we might discover useful applications, user needs, capabilities, or limitations. Those meanings lead to different descriptions.

**The uncertainty paragraph also needs a different emphasis.** Its useful content is the approach: start with concrete applications, observe what happens, and revise tentative ideas through comparison. That gets buried under repeated qualifications. "Inspired by grounded theory" already expresses a limited claim; the additional methodological disclaimer interrupts the introduction.

"Shared elements are ... not an expected outcome" is especially strong. We can reasonably hope to find useful common ground while leaving its extent open. A clearer formulation would be:

> Whether tools and practices can be shared across applications, and under what conditions, remains an open question.

If _discovery_ means finding useful applications for AI, a provisional opening could read:

The **AI Project Foundation** is a working name for our effort to develop tools and practices for AI projects. Through concrete applications, we explore useful roles for AI, build and evaluate systems, and learn what it takes to put them into use.

The approach is **inspired by grounded theory**: we start with applications and observations, form tentative ideas, and revise them as we compare experiences across projects. Whether tools and practices can be shared across applications, and under what conditions, remains an open question.

Elsewhere in the document:

- **The evaluation bullet mixes several kinds of work.** "Evaluation framework," "evaluation subsystem," and "operating model" need concrete explanations: methods for evaluating systems, software that runs evaluations, and arrangements for how people participate and make decisions.
- **The execution bullet is still a working note.** Its purpose could be expressed as "running and configuring systems, and keeping track of the versions used in experiments." The implementation details can follow later.
- **The workbench description has the clearest concrete idea:** experts and engineers exploring system behavior together. "Umbrella concept" adds little. I would lead with that collaborative activity and clarify how datasets and evaluations support it.
- **The starter-kit definition is circular.** "A usable implementation of the foundation" depends on a definition we have not established. Describing its contents would help: an initial package of tools, examples, and guidance for starting a project. The repository arrangement is a later packaging decision.

The most consequential choice is what **discovery** means here. Finding worthwhile applications for AI and discovering how a particular system behaves are related activities, but each gives the opening a different focus.
