---
draft: false
toc: true
title: "Generated Instruments"
description: "An LLM can use text generation to build an instrument instead of writing an answer: a diagram, interactive page, simulation, query, or small tool that something else runs, chosen because it fits the task and the reader better than prose."
linkTitle: "Generated Instruments"
---

Usually the model's text is the answer, and a person reads it. Here the text is code, markup, or a script, and something other than the model runs or renders it: a diagram, an interactive page, a simulation, a query, a small tool, a narrated video. The model produces the means, not the result.

## What is introduced


The chain gets a new link, and often a loop back:

```text
request -> model -> text -> person reads

request -> model -> artifact (code, markup, spec) -> executor (browser, renderer, runtime) -> a person or a program works with it
             ^                                          |
             +------- result, error, or critique -------+
```


The loop is optional. Program-aided reasoning runs the program once and takes the result. Agents and video generators send errors or critiques back to the model, so the artifact becomes a draft revised over several turns ([Wang et al. 2024](/sources/ai-engineering/agents/wang-2024-executable-code-actions-codeact.pdf.enc); [Chen et al. 2025](/sources/ai-engineering/generated-interfaces/chen-2025-code2video.pdf.enc)).

There are two ways to get a visual result from a model. In the *procedural* way, described here, the model writes code that a separate executor runs. In the *neural* way, a model generates the pixels directly. Karpathy expects the interface of the future to mix them, with code components as the skeleton, and imagines that interactive videos or simulations may one day come straight from a neural network ([1 May 2025](https://x.com/karpathy/status/1917920257257459899), [11 May 2026](https://x.com/karpathy/status/2053872850101285137); summaries in the [exported thread]({{< ref "ai/design/generated-instruments/karpathy-visual-explanation-prompts" >}}#sources-behind-the-thread)). For now the procedural way wins where correctness matters: in Code2Video's comparison, a pixel video model (Veo 3) scored 9.0 on aesthetics and 2.5 on the quiz, against 87.9 and 86.0 for Code2Video's code-generated video with Claude Opus 4.1 ([Chen et al. 2025](/sources/ai-engineering/generated-interfaces/chen-2025-code2video.pdf.enc)). Only the procedural way gives an artifact that can be read, checked, and edited.

The artifact brings three things that text does not have.

1. **A form chosen for the task and the reader.** Larkin and Simon call two representations *informationally equivalent* when each can be rebuilt from the other, and *computationally equivalent* only when the same work is equally easy in both. They split the use of a representation into search (finding the elements a rule needs), recognition (seeing that a rule applies), and inference (applying it). Diagrams mainly cut search and recognition: things used together sit together, and perception does the matching. The domain rules stay in the reader's head, and inference costs about the same in either form. So a diagram helps only a reader who already knows how to use it ([Larkin and Simon 1987](/sources/thinking-and-learning/external-representations/larkin-1987-why-a-diagram-is-worth-ten-thousand-words.pdf.enc)). Zhang and Norman call the broader finding the *representational effect*: different representations of the same abstract structure produce very different behaviour. In their Tower of Hanoi variants, moving rules from the instructions into physical constraints made the problem easier, while adding constraints that changed the rules made it harder ([Zhang and Norman 1994](/sources/thinking-and-learning/external-representations/zhang-1994-representations-in-distributed-cognitive-tasks.pdf.enc)). Choosing the form is a design decision. The model now makes it per task, and it has to be made per reader as well.
2. **An executor other than the model.** A browser, renderer, interpreter, or database decides what the artifact does, not a reader's interpretation, so it can do exact work. In program-aided reasoning the model writes a program and an interpreter computes the answer. Three things each matter: actual execution (the same code with the model predicting its output scores far lower), one step per line, and meaningful variable names. A calculator added after prose reasoning recovers only a small part of the gain ([Gao et al. 2022](/sources/llms/prompting/gao-2022-pal-program-aided-language-models.pdf.enc); [Chen et al. 2022](/sources/llms/prompting/chen-2022-program-of-thoughts-prompting.pdf.enc)). The executor can hold rules, not only data: in Zhang and Norman's experiments, rules built into physical constraints were never broken and left working memory free for planning. An interactive page whose controls allow only legal moves is such an external problem space. All of this needs a model fluent in the executor's language; models weak at code do worse with programs than with prose.
3. **A working model of the subject instead of statements about it.** Text gives conclusions. A simulation gives a mechanism that produces conclusions, including for inputs the author did not anticipate. Realism is not the value: in studies reviewed by Scaife and Rogers, virtual-reality training taught skills that did not carry over to the real task. The design question is what to include, leave out, or add ([Scaife and Rogers 1996](/sources/thinking-and-learning/external-representations/scaife-1996-external-cognition-graphical-representations.pdf.enc)).

The third point answers the [amortized generation problem]({{< ref "ai/design/amortized-generation-problem" >}}) in one way. Prose can imitate the result of a problem-solving process without running it. An artifact has to spell out the problem's structure (variables, states, transitions) and then run it. That makes errors locatable, in a line, a variable, or a state, but not self-revealing. A program that runs can still be wrong: in the Program of Thoughts error analysis, most failures were wrong values read from the problem or wrong logic, both computed exactly ([Chen et al. 2022](/sources/llms/prompting/chen-2022-program-of-thoughts-prompting.pdf.enc)). A clean run can persuade as well as fluent prose, so someone still has to check.

The model's role shifts from giving the answer to building the instrument through which the work is done.

## To do what


The artifact changes how a task is done. It moves work from what is costly for a person (reading, holding things in memory, simulating in their head, taking claims on trust) to what can be cheaper (seeing, manipulating, running, checking).

Scaife and Rogers gather three ideas from earlier work: *computational offloading* (how much one representation reduces effort compared with another that holds the same information), *re-representation* (the same structure in another form changes the problem), and *graphical constraining* (the closer the display's relations match the problem's, the fewer wrong inferences it allows). Their main point was that how graphical representations help was still largely unknown. They doubted that animation, 3-D, and virtual reality helped as much as assumed, and named interaction with representations as the critical, under-studied question ([Scaife and Rogers 1996](/sources/thinking-and-learning/external-representations/scaife-1996-external-cognition-graphical-representations.pdf.enc)). Zhang and Norman list what external representations do: they aid memory, give information that can be picked up without interpretation, anchor and structure behaviour, and change the nature of the task.

Kirsh and Maglio show that people act on the world to make thinking easier, not only to reach the goal. Tetris players rotate a piece to see whether it fits, or move it to the wall and back to check its column. These *epistemic* actions reduce the memory, steps, or errors of mental computation. They pay off when the action is faster than the mental step it replaces, its effect is fully predictable, and the information is worth its cost, and players learn them with practice ([Kirsh and Maglio 1994](/sources/thinking-and-learning/external-representations/kirsh-1994-epistemic-vs-pragmatic-action.pdf.enc)). An interactive instrument makes such actions possible. It pays off when its controls respond instantly, behave predictably, can be undone, and readers learn to use them.

| Goal | What the instrument does | Example |
| --- | --- | --- |
| Understand | Moves between one example and the general rule | An explorable explanation; an explainer video ([Ku et al. 2025](/sources/ai-engineering/generated-interfaces/ku-2025-theoremexplainagent.pdf.enc), [Chen et al. 2025](/sources/ai-engineering/generated-interfaces/chen-2025-code2video.pdf.enc)) |
| Verify | Lays out reasoning so errors can be found and judged | Step-by-step interactive views of LLM reasoning ([Zhou et al. 2025](/sources/ai-engineering/generated-interfaces/zhou-2025-interactive-explanation-interfaces-llm-reasoning.pdf.enc)); argument graphs of model rationales ([Wang et al. 2026](/sources/ai-engineering/generated-interfaces/wang-2026-graphionale-graph-visualizations-llm-rationales.pdf.enc)) |
| Decide | Arranges options against criteria | A view that follows the decision logic: criteria, comparison, elimination, summary |
| Explore | Lets assumptions vary and shows what follows | A sandbox, a parameter sweep |
| Act | Becomes the tool, or the action itself | A generated app for one request ([Leviathan et al. 2025](/sources/ai-engineering/generated-interfaces/leviathan-2025-generative-ui.pdf.enc)); code as an agent's action, chaining several tools with variables and loops in one step ([Wang et al. 2024](/sources/ai-engineering/agents/wang-2024-executable-code-actions-codeact.pdf.enc)) |
| Compute | Does exactly what prose approximates | A query over one's own records; a program run by an interpreter ([Gao et al. 2022](/sources/llms/prompting/gao-2022-pal-program-aided-language-models.pdf.enc)) |
| Work together | Gives people a shared object to point at and revise | A model or diagram the group edits |

The instrument's user can be a person, who looks and manipulates, or a program, which executes. The move is the same in both cases, but which form is better depends on what that user can do: what a person has learned to read, what a runtime can execute.

## Choosing what to put in the instrument


Zhang and Norman's *representational analysis* gives a method for the choice. Go through the task one level at a time:

1. Which rules define the task?
2. Which rules does the artifact hold (as constraints, layout, or code), and which must the person remember?
3. Which visual property encodes each dimension? In their experiments, location beat size and colour for showing order, and order shown by colour had to be memorised.
4. Which objects carry it all? Choices at this level usually matter least.

Larkin and Simon add practical rules for diagrams: put together what is used together, let position rather than labels identify things, make the features the reasoning needs (slope, intersection, length) easy to see, and draw quantities to scale so the picture can serve as a check.

## What it costs


- **The reader must know how to read the form.** Diagrams are useful only to those who know how to use them (Larkin and Simon). A new throwaway form for each question may be one the reader cannot use, while familiar notations come with trained skills.
- **Not every form helps.** Some diagrams do not group the needed information. In studies reviewed by Scaife and Rogers, the benefit of an animation was short-lived and did not carry over to a static diagram. Argument graphs of model reasoning hurt on visual puzzles ([Wang et al. 2026](/sources/ai-engineering/generated-interfaces/wang-2026-graphionale-graph-visualizations-llm-rationales.pdf.enc)). Scaife and Rogers warn against the *resemblance fallacy*: assuming that motion or realism in the display produces matching understanding.
- **Doing is not learning.** Zhang and Norman's participants followed rules held by the artifact without breaking them, yet few could state those rules afterwards. An instrument that does the work helps people finish the task but may not teach it.
- **Feeling helped is not being helped.** In Graphionale the graph felt helpful and was read faster, while decisions on visual tasks got worse. Preference and performance can point in opposite directions.
- **It can run and still be wrong.** A program with misread values or wrong logic runs cleanly, and a misdrawn diagram produces wrong inferences as effortlessly as a correct one produces right ones.
- **The model must know the executor.** Models weak at code do worse with programs than with prose, and the interface of the executor has to be described to the model.
- **Time and money.** Generative UI takes a minute or two per page. Code2Video took 9 to 17 minutes per video of about two minutes; TheoremExplainAgent took 19 to 40 minutes and up to $4.67 per video.
- **A second correctness question.** The artifact has to be right, and it has to match the claim or system it illustrates.

So the question is not only how to build an instrument but when the indirection is worth it, and for which reader.

## Notes


- [Visual explanations from LLMs]({{< ref "ai/design/generated-instruments/visual-explanations-from-llms" >}}) collects approaches that ask models for diagrams, interactive pages, and explainer videos instead of text, the principles they share, and the evidence on whether they help.
- [Karpathy Visual Prompts Practices]({{< ref "ai/design/generated-instruments/karpathy-visual-explanation-prompts" >}}) is the exported ChatGPT conversation that started this section.

## Open questions


- Which form fits which goal and which reader, and who chooses it: the person, the model, or the system around it?
- How is an instrument planned, run, inspected, and corrected before someone relies on it?
- When is the indirection worth its cost compared with well-written text?
- How can one check that the instrument matches the claim or system it represents?
- If the goal is learning rather than getting the task done, what should the instrument do and what should the reader still do?
- How can readers leave traces (mark, pin, annotate) and build part of the instrument themselves? Scaife and Rogers note that static diagrams let people leave traces but give no feedback, while simulations give feedback but leave few traces, and they suggest that producing a representation helps one understand it.
- When should a disposable instrument made for one question become a tool that is kept and built on?

## Related


- [Representations, composition, and understanding]({{< ref "ai/design/ai-system-design/representations-composition-and-understanding" >}}): Principle 1 (representations as instruments of construction) and Principle 4 (explicit representations as objects of shared inquiry). This section is the case where the model chooses and builds the representation per task.
- [Amortized generation]({{< ref "ai/design/amortized-generation-problem" >}}): why making the problem structure explicit matters.
- [Sensemaking and epistemic action]({{< ref "ai/design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-action" >}}): artifacts used in thinking.
- Language intent and hybrid interaction and generated workspaces and application composition: generated interfaces as part of system construction.
- What LLMs are good at: converting content between forms (U3) is the basic ability this builds on.

## Library sources


Why the form of a representation matters (`sources/thinking-and-learning/external-representations/`):

- [Larkin and Simon 1987](/sources/thinking-and-learning/external-representations/larkin-1987-why-a-diagram-is-worth-ten-thousand-words.pdf.enc), *Why a Diagram is (Sometimes) Worth Ten Thousand Words* ([doi:10.1111/j.1551-6708.1987.tb00863.x](https://doi.org/10.1111/j.1551-6708.1987.tb00863.x)): informational versus computational equivalence; diagrams cut search and recognition, while inference and domain knowledge stay with the reader.
- [Zhang and Norman 1994](/sources/thinking-and-learning/external-representations/zhang-1994-representations-in-distributed-cognitive-tasks.pdf.enc), *Representations in Distributed Cognitive Tasks* ([doi:10.1207/s15516709cog1801_3](https://doi.org/10.1207/s15516709cog1801_3)): the representational effect, shown with Tower of Hanoi isomorphs; rules held by the artifact; representational analysis.
- [Scaife and Rogers 1996](/sources/thinking-and-learning/external-representations/scaife-1996-external-cognition-graphical-representations.pdf.enc), *External Cognition: How Do Graphical Representations Work?* ([doi:10.1006/ijhc.1996.0048](https://doi.org/10.1006/ijhc.1996.0048)): offloading, re-representation, graphical constraining; doubt about animation, 3-D and virtual reality; interaction as the open question.
- [Kirsh and Maglio 1994](/sources/thinking-and-learning/external-representations/kirsh-1994-epistemic-vs-pragmatic-action.pdf.enc), *On Distinguishing Epistemic from Pragmatic Action* ([PhilArchive](https://philarchive.org/rec/KIRODE)): actions taken to reduce the memory, steps, or errors of mental computation, and when they pay off.

The model writes code that something else runs (`sources/llms/prompting/`, `sources/ai-engineering/agents/`):

- [Gao et al. 2022](/sources/llms/prompting/gao-2022-pal-program-aided-language-models.pdf.enc), *PAL: Program-aided Language Models* ([arXiv:2211.10435](https://arxiv.org/abs/2211.10435)): execution, step-by-step code, and meaningful names each matter.
- [Chen et al. 2022](/sources/llms/prompting/chen-2022-program-of-thoughts-prompting.pdf.enc), *Program of Thoughts Prompting* ([arXiv:2211.12588](https://arxiv.org/abs/2211.12588)): separating reasoning from computation; error analysis of programs that run but are wrong.
- [Wang et al. 2024](/sources/ai-engineering/agents/wang-2024-executable-code-actions-codeact.pdf.enc), *Executable Code Actions Elicit Better LLM Agents* ([arXiv:2402.01030](https://arxiv.org/abs/2402.01030)): code as the action format, with execution results fed back over several turns.

Generated interfaces and explanations (`sources/ai-engineering/generated-interfaces/`), discussed in [Visual explanations from LLMs]({{< ref "ai/design/generated-instruments/visual-explanations-from-llms" >}}):

- [Leviathan et al. 2025](/sources/ai-engineering/generated-interfaces/leviathan-2025-generative-ui.pdf.enc), *Generative UI: LLMs are Effective UI Generators* ([project page](https://generativeui.github.io/)).
- [Wang et al. 2026](/sources/ai-engineering/generated-interfaces/wang-2026-evaluating-interactivity-explorable-explanations.pdf.enc), *Evaluating Interactivity: Toward Automated Assessment of AI-Generated Explorable Explanations* ([arXiv:2606.31012](https://arxiv.org/abs/2606.31012)).
- [Chen et al. 2025](/sources/ai-engineering/generated-interfaces/chen-2025-code2video.pdf.enc), *Code2Video* ([arXiv:2510.01174](https://arxiv.org/abs/2510.01174)).
- [Ku et al. 2025](/sources/ai-engineering/generated-interfaces/ku-2025-theoremexplainagent.pdf.enc), *TheoremExplainAgent* ([arXiv:2502.19400](https://arxiv.org/abs/2502.19400)).
- [Wang et al. 2026](/sources/ai-engineering/generated-interfaces/wang-2026-graphionale-graph-visualizations-llm-rationales.pdf.enc), *Graphionale* ([arXiv:2608.27932](https://arxiv.org/abs/2608.27932)).
- [Zhou et al. 2025](/sources/ai-engineering/generated-interfaces/zhou-2025-interactive-explanation-interfaces-llm-reasoning.pdf.enc), *Improving Human Verification of LLM Reasoning through Interactive Explanation Interfaces* ([arXiv:2510.22922](https://arxiv.org/abs/2510.22922)).

Further reading (web, not in the library):

- Bret Victor, [Explorable Explanations](https://worrydream.com/ExplorableExplanations/) (2011) and [Up and Down the Ladder of Abstraction](https://worrydream.com/LadderOfAbstraction/).
- Hohman, Conlen, Heer and Chau, [Communicating with Interactive Articles](https://distill.pub/2020/communicating-with-interactive-articles/) (Distill, 2020).
- Andy Matuschak, [thread on interactive articles](https://threadreaderapp.com/thread/1305264244045225984) (2020): representations for showing versus for thinking.
- Richard E. Mayer, *Multimedia Learning* (3rd ed., Cambridge University Press, 2020): the multimedia learning principles.
