---
draft: false
toc: true
title: "Visual Explanations from LLMs: Approaches and Principles"
description: "Asking LLMs for diagrams, interactive pages, and animated explainers instead of text: related approaches from explorable explanations, multimedia learning, generative UI, and video agents, the evidence, and shared principles."
linkTitle: "Visual Explanations"
---

Researched on 2026-11-05 as a follow-up to the exported conversation [Karpathy Visual Prompts Practices]({{< ref "ai/design/generated-instruments/karpathy-visual-explanation-prompts" >}}). On the same day the papers saved in the library were read in full and this note was corrected against them. The web pages (Victor, Case, Distill, Willison, coverage of Karpathy's posts) were read once through page fetches. Karpathy's three posts were read in full through mirrors (x.com blocks automated reading); their main ideas are in the [exported thread]({{< ref "ai/design/generated-instruments/karpathy-visual-explanation-prompts" >}}#sources-behind-the-thread). Why the form of a representation matters, from cognitive science, is in the [section index]({{< ref "ai/design/generated-instruments" >}}).

## The question


Karpathy's suggestion is to stop reading LLM output as plain text and ask for a better form: controlled-language text, a diagram, an interactive HTML page, or a narrated explainer video. Which other approaches do the same thing, what is the evidence that they help, and what principles do they share?

## Approaches

### Karpathy: from a predicted interface to an output ladder (2025-2026)


- **1 May 2025.** Chatting with an LLM is like using a 1980s terminal; the graphical interface for LLMs is not invented yet. He predicts it will be visual (vision is the highest-bandwidth way into the brain) and generated on demand for each request. The open question is how procedural it will be: from one image model painting the whole screen to a page assembled from code components; he guesses a mix, with components as the skeleton. ([X post](https://x.com/karpathy/status/1917920257257459899), read in [Jay Taylor's notes](https://jaytaylor.com/notes/node/1769632270000.html))
- **11 May 2026.** Add "structure your response as HTML" to the end of a query and open the file in a browser; slideshows also work. People prefer audio as input to an AI but vision as its output. His ranking of output formats: raw text, markdown (today's default), HTML (forming a new default), then interactive videos or simulations that a neural network may eventually generate directly. Input is still lacking: he wants to point and gesture. ([X post](https://x.com/karpathy/status/2053872850101285137), read on [nitter.cf](https://nitter.cf/karpathy/status/2053872850101285137))
- **2 October 2026.** A ladder of four rungs, each introduced as better than the last: ASD-STE100 controlled English (or "80% of the way" to it, because the full spec is strict), then a diagram, then an HTML page, then a custom explainer video ("3b1b style", narrated with ElevenLabs or a local voice model). He is most bullish on video. His framing is that as models do more of the work on their own, people's work moves up into oversight and understanding, and cheap code makes "custom, discardable" artifacts worth building for a single question. ([X post](https://x.com/karpathy/status/2105819303471976479), read on [nitter.cf](https://nitter.cf/karpathy/status/2105819303471976479); coverage by [max.nardit.com](https://max.nardit.com/articles/karpathy-understanding-llm-outputs) and [explainx.ai](https://www.explainx.ai/blog/karpathy-understand-llm-outputs-ste100-diagrams-html-video-2026))
- **August 2026, in passing.** LLMs cannot yet efficiently watch video or play games to check their own work (known from a [list of his posts](https://topicdigg.com/x/karpathy), not read in full). This is the gap the visual critics below try to fill, and why model critics miss problems people see.
- **Caveats found by others.** The STE cheat sheet attached to the post has errors in several dictionary rows, according to [max.nardit.com](https://max.nardit.com/articles/karpathy-understanding-llm-outputs). "Write in STE" is easy to ask for and hard to check: a model can sound terse while breaking most rules ([Medium tester](https://medium.com/@visrow/karpathy-says-make-your-llm-write-like-an-aircraft-manual-i-built-a-browser-tool-to-measure-it-17f0aaeb86b4)). A community agent skill packages the ladder ([karpathy-output](https://github.com/ohernandezdev/karpathy-output)).
- **What the research below says about the top rung.** The evidence for video over a good diagram is weak. In studies reviewed by Scaife and Rogers (1996), an animation's benefit was short-lived, and narration accounted for much of what helped. The video agents below report gains mostly against plain code generation or terse text, not against a well-made diagram.

### Explorable explanations (Bret Victor, 2011)


Text should be an environment to think in, not information to consume. Three devices: *reactive documents* (the reader changes the author's assumptions and sees the consequences), *explorable examples* (abstract ideas made concrete with examples the reader can vary), and *contextual information* (look things up in place). The interactive parts sit inside text that still reads normally, and the author keeps guiding the reader. ([Explorable Explanations](https://worrydream.com/ExplorableExplanations/))

### Up and down the ladder of abstraction (Bret Victor)


Understanding comes from moving between levels: one concrete instance, a family of instances as a parameter varies, and the whole space of behaviour. Victor places the insight in the transitions between levels, not in any one level. Give the reader control of time and every parameter, not only playback. ([Ladder of Abstraction](https://worrydream.com/LadderOfAbstraction/))

### Making explorables (Nicky Case)


Start with a question the reader cares about. Start "on the ground" with a concrete experience, move up step by step, linking ideas with "therefore" and "but" rather than "and then", step back down when it gets too abstract, and end with an open sandbox. ([How I make an explorable explanation](https://blog.ncase.me/how-i-make-an-explorable-explanation/))

### Interactive articles (Hohman, Conlen, Heer, Chau, Distill 2020)


The affordances they name: connecting people and data (animation conveys transitions and causality), making systems playful (in-browser sandboxes), prompting self-reflection (predict first, then see the answer), personalizing the reading, and reducing cognitive load (details on demand). The authoring problems they name: building takes design and web skills, interactive pages break as browsers change, and accessibility is unsolved. They add that not everything needs to be interactive. ([Communicating with Interactive Articles](https://distill.pub/2020/communicating-with-interactive-articles/))

Andy Matuschak's response: such representations are too often built for showing, not for thinking. Good representations, like the Cartesian plane, were invented to do the work, not to present it. ([thread](https://threadreaderapp.com/thread/1305264244045225984))

### Multimedia learning (Richard Mayer)


The research base under most of the above. The principles most relevant here: *coherence* (leave out extra words, pictures, and sounds), *signaling* (highlight how the material is organized), *segmenting* (learner-paced chunks), *modality* (graphics with narration beat graphics with on-screen text). The count varies by edition: 12 in the 2nd, 15 in the 3rd. ([Dartmouth summary](https://services.dartmouth.edu/TDClient/1806/Portal/KB/PrintArticle?ID=171655), [Ohio State](https://u.osu.edu/multimedialearning/?p=11))

### Generative UI (Leviathan et al., Google, 2025)


The model writes a complete web page for each prompt. The system has three parts: tool endpoints (search, image generation), whose results go either to the model (better quality) or straight to the browser (faster); long system instructions; and post-processors.

- **The illustrative prompt** (about 3,000 words, from an early research prototype rather than the evaluated system) asks for an interactive app even for simple questions, no walls of text, mandatory search for any fact about a named entity, no placeholders or fake data, and a design built around the data actually fetched. Its planning steps: decide whether facts need searching, pick the interactive concept, list data and image needs, search with follow-ups, brainstorm about a dozen features, drop weak or unverified ones, then build the rest. Its technical rules: one complete HTML page with inline CSS and JS, Tailwind from a CDN, responsive layout, scripts started after the page loads, risky code wrapped so failures are logged, no access to the parent window or localStorage, and the full page re-emitted on each follow-up. Image rules: images go in `<img>` tags pointing at an endpoint; generate images for generic or very famous subjects and retrieve real photos for named people and lesser-known places; never generate schematics, graphs, or long text as images; repeat each character's full description in every image prompt.
- **Post-processors** patch the generated code: they insert API keys, add a client-side error reporter, repair JavaScript parse errors and Tailwind problems, escape text in attributes, remove citations that leak into scripts, and fix map-API misuse and made-up icons. Nothing renders the page and looks at it.
- **Style.** Replacing the short default style section with a detailed one (palette, fonts) gave a consistent look, and the model carried the style into generated images and icons. The evidence is screenshots.
- **Evaluation.** Raters chose between two results with no stated criteria, so this measures preference, not understanding; generation time was excluded. On prompts sampled from LMArena, generated pages were preferred over markdown in 82.8% of comparisons. Against pages built by Upwork freelancers (3 to 5 hours each, AI tools allowed, briefed with the same rules), the generated page was preferred 43% of the time and the expert page 56%. The full prompt beat a minimal one by only about 57 Elo, and removing the core philosophy and examples scored below the minimal prompt. Older models often failed outright: 29% output errors for Gemini 2.0 Flash and 60% for Flash-Lite.
- **Limits.** A minute or two per page (streaming roughly halves the wait), and script and style errors still occur.

([paper](https://generativeui.github.io/static/pdfs/paper.pdf), [PDF](/sources/ai-engineering/generated-interfaces/leviathan-2025-generative-ui.pdf.enc), [Google Research blog](https://research.google/blog/generative-ui-a-rich-custom-visual-interactive-user-experience-for-any-prompt/))

### Explainer-video agents


- **TheoremExplainAgent** (Ku et al., 2025). A planner writes scene plans (purpose, layout with safe margins, a technical plan naming the Manim objects) and narration; a coding agent writes Manim code; text-to-speech adds narration. When a scene fails to render, the error goes back to the coder, which revises it. It never looks at the rendered video. Retries were what mattered: success rose from 0-7% with no retries to 91-96% with five. Retrieval over the Manim documentation was a tested variant with mixed results: it lowered success for o3-mini (93.8% to 82.1%) and GPT-4o and raised it for weaker models, while using two to three times as many input tokens. "Success" means every scene rendered, not quality. Runs that failed did so mostly on Manim API calls that do not exist, then LaTeX errors; videos that rendered still showed overlapping or misaligned elements. Automatic judges agreed with people on visual relevance (Spearman 0.72) but poorly on layout (0.42), visual consistency (0.17), logical flow, and accuracy (0.14-0.16), on only 40 videos whose human raters agreed only moderately with each other. Each video took 19 to 40 minutes and cost up to $4.67. ([arXiv 2502.19400](https://arxiv.org/abs/2502.19400), [PDF](/sources/ai-engineering/generated-interfaces/ku-2025-theoremexplainagent.pdf.enc))
- **Code2Video** (Chen, Lin, Shou, 2025). A Planner writes an outline (audience, length, sections each with one example, prerequisites first) and a storyboard pairing short lecture lines with animation steps (three pairs per section, five for key sections), and gathers images for concrete objects into a reusable asset store. A Coder writes Manim code per section in parallel and fixes errors in the smallest scope first (the failing line, then its block, then the whole section). A Critic, a vision-language model, inspects the rendered video for covered text, overlaps, off-screen items, and empty regions. Layout is fixed in advance: title on top, lecture text on the left, animations on the right on a 6×6 grid of named cells, and the coder must place everything through grid helpers. The lecture lines are on-screen text; there is no narration. *TeachQuiz* measures a model, not viewers: a model told to "unlearn" the topic answers questions before and after watching. The full pipeline improved TeachQuiz by 43.5 to 46 points and aesthetic scores by 39.5 to 50.1 over direct code generation. Removing parts showed what mattered: the planner most, then the asset store, then the grid; the critic least. People rated layout much lower than the model judge did (60.2 against 90.6). In a small human study (five groups of eight), Code2Video's videos matched 3Blue1Brown's on a quiz (80.3 against 78.8) and more people finished them, but they were about 2 minutes long against 17. Each video took 9 to 17 minutes to generate. ([arXiv 2510.01174](https://arxiv.org/abs/2510.01174), [PDF](/sources/ai-engineering/generated-interfaces/chen-2025-code2video.pdf.enc))

### Single-file HTML tools (Simon Willison, 2025)


Over 150 small tools, almost all written by LLMs. Patterns: one file with inline JS and CSS, a few hundred lines, no build step, "no React" in the prompt, libraries from a CDN, state in the URL or localStorage, host on a permanent URL, and point the model at earlier tools to reuse them. ([Useful patterns for building HTML tools](https://simonwillison.net/2025/Dec/10/html-tools/))

### Evaluating generated explorables (EE-Eval, 2026)


Scores the interactivity of LLM-generated explorable explanations of algorithmic computer-science concepts. An LLM extracts a state machine from the page (states, learner actions, transitions), which is compared with an ideal one. Experts wrote a few ideal machines from principles "such as" explicit state progression, meaningful learner control, and coherent feedback loops; an LLM generated the rest with targeted human checks. Extra states count against a page just as missing ones do.

On a balanced set of 166 pages rated by two of six trained raters each, the score agreed with human interactivity ratings at r = 0.73, against 0.53 for a vision model shown the first and last screenshots and −0.60 for Playwright tests written by an LLM, which the authors blame on brittle scripts that penalise complex designs. On a set where surface features were amplified, the agreement dropped to 0.21, which is not significant. On teaching effectiveness it barely beat screenshot judging (0.58 against 0.56). It does not measure learning or whether the content is correct. Typical failures: polished pages with weak interaction structure, smooth interaction unrelated to the concept, and pages that work but leave states under-specified. Across 2,497 pages from six models, GPT-5 Mini scored highest, and GPT-3.5 Turbo beat GPT-4o-mini despite coding leaderboards. ([arXiv 2606.31012](https://arxiv.org/abs/2606.31012), [PDF](/sources/ai-engineering/generated-interfaces/wang-2026-evaluating-interactivity-explorable-explanations.pdf.enc))

### Evidence on whether it helps


- **Interactive views helped people check model reasoning, through shared scaffolding rather than one format.** In a classroom study with 125 undergraduates, people judged whether an LLM's solution to a school math problem was correct more accurately with three interactive formats (step-by-step text 80.6%, pseudo-code 82.5%, a dataflow graph 85.6%) than with plain chain-of-thought text (73.5%). They also located the wrong step more often (85.2% against 66.1% for the graph). The three interactive formats did not differ significantly from each other, and times were similar. What they shared: the problem and its key values in a fixed panel, one colour per variable, and one step at a time with back, forward, and play. Nine of ten items had one injected error, so the study cannot separate trusting too much from trusting too little, and some statistics are misreported in the paper. ([arXiv 2510.22922](https://arxiv.org/abs/2510.22922), [PDF](/sources/ai-engineering/generated-interfaces/zhou-2025-interactive-explanation-interfaces-llm-reasoning.pdf.enc))
- **Argument graphs of model rationales helped on some tasks and hurt on others.** In a study with 204 participants, graphs reduced how often people followed wrong answers on multi-step verbal puzzles and increased corrections, but only on hard items and mainly for people who enjoy effortful thinking; overall appropriate trust did not change. On visual puzzles, graphs made people reject correct answers more often and correct fewer errors, at both difficulty levels, yet were rated more engaging and helpful. Task load was higher in both. The authors attribute the harm on visual tasks to the graph not being anchored in the image, which they did not test. The graph was also read faster, so a view can feel helpful while decisions get worse. ([Graphionale, arXiv 2608.27932](https://arxiv.org/abs/2608.27932), [PDF](/sources/ai-engineering/generated-interfaces/wang-2026-graphionale-graph-visualizations-llm-rationales.pdf.enc))
- **One theorem, shown as text and then as video.** In TheoremExplainAgent's small study, all 15 participants accepted a flawed text explanation; after watching the video, 9 flagged the flaw. The order was fixed, so the second exposure may account for part of it.
- **Interactive LLM summaries beat video** for knowledge gain and engagement in a 40-person study, at higher mental effort ([KnowTI](https://onlinelibrary.wiley.com/doi/10.1111/cgf.70655); read from the abstract only).
- No study found here compares generated interactive explanations with well-written text on what people learn.

## Principles


What the approaches above agree on, in the order you would apply them.

1. **Choose the form by what the reader has to do, and by what they can read.** To read a precise statement: controlled text. To see structure: a diagram. To test how something behaves: an interactive page. To be guided through a process: a narrated video. Match the structure of the view to the task: an argument graph helped on multi-step verbal reasoning but hurt on visual puzzles, where the explanation belongs on the source image (overlays, highlights). A notation the reader cannot read offloads nothing. Not everything needs to be interactive, and the case for video over a good diagram is weak. *(Karpathy, Distill, Larkin and Simon, Scaife and Rogers, Graphionale)*
2. **Start from the reader's question and a concrete case.** State what they want to understand and what confuses them, then begin with one specific example before any general rule. *(Case, Victor, the exported thread)*
3. **Let the reader move between concrete and abstract.** One instance, then a parameter swept across its range, then the whole behaviour. Provide steps both up and down. *(Victor's ladder, Case)*
4. **Give control over what matters, and make it cheap to use.** Controls should change the model's assumptions and show consequences: parameters, time, step-by-step playback. Every control should respond instantly, give the same result for the same input, and be undoable in one step; people act in order to think only when acting is quicker and more reliable than working it out. Match the number of states and controls to the concept: extra states hurt as much as missing ones. Let the reader mark, pin, and annotate states, not only change parameters. *(Victor, Distill, Kirsh and Maglio, EE-Eval, Scaife and Rogers)*
5. **Keep the author's path, and end with a sandbox.** A bare simulation is not an explanation. Lead through explicit states, then let the reader explore freely. *(Victor, Case)*
6. **Cut load.** One idea at a time, nothing extra, structure signalled (arrows, highlight, consistent colour), learner-paced segments, details on demand. In graphs, compress each node to a few words (a short subject, predicate, and object plus a label of six words or fewer), keep concrete values and names instead of vague summaries, put the full text on hover, prune to the nodes the decision needs, and collapse branches by default. In video, prefer narration to on-screen text: people skip text shown beside an animation. *(Mayer, Distill, Graphionale, Scaife and Rogers)*
7. **Link several representations, and do the linking for the reader.** Integrating views is the hard part. Put annotations on the object itself rather than in a separate panel joined by labels. Give each variable one colour everywhere it appears, and use colour for identity, not for order. For step-by-step reasoning: the problem and its key values in a fixed panel, one colour per variable, one step at a time with back, forward, and play. *(Scaife and Rogers, Larkin and Simon, Zhang and Norman, Zhou et al.)*
8. **Ask the reader to predict before showing.** A guess before the reveal makes people explain to themselves and remember. *(Distill, Case)*
9. **Ground every fact, and never invent data.** Look up entities and numbers; no placeholders or fake data. A simulation of a mechanism is fine; made-up data is not. Draw schematics, graphs, and formulas in code, not as generated images; generate images only for generic subjects, and retrieve real photos of named people and places. Draw quantities to scale: a misdrawn picture produces wrong inferences with no effort. Check content separately from the look, because a view can feel helpful while decisions get worse. *(Generative UI, Larkin and Simon, Graphionale)*
10. **Plan before you render.** First an outline (audience, length, sections each with one example, prerequisites first), then a storyboard that pairs each short line with one visual step, then code. List the data and images needed, brainstorm features, and drop weak or unverified ones before building. When several views are needed, generate the underlying structure first (an argument map, tagged reasoning steps) and derive every view from it. Removing the planner hurt Code2Video most. *(Code2Video, TheoremExplainAgent, Generative UI, Graphionale, Zhou et al.)*
11. **Constrain while generating, then fix in the smallest scope.** Give the generator a fixed layout to place things into (title, text area, a grid of named cells) rather than relying on a critic afterwards; in Code2Video the grid did more than the critic. On an error, send back the error with the plan, ask for its cause, and fix the failing line first, then its block, then the section; retries mattered far more than retrieved documentation. Keep a list of recurring defects and patch them in code after generation. Finish with a visual check for covered text, overlaps, off-screen items, and empty space, knowing that model critics miss problems people see. *(Code2Video, TheoremExplainAgent, Generative UI)*
12. **Keep artifacts small, self-contained, and disposable.** One file, no build step, libraries from a CDN, scripts started after the page loads, risky code wrapped so failures are logged, a layout that works on small screens. Cheap enough to throw away after one question, and easy to keep and reuse if it turns out useful. Whether state may live in localStorage depends on where the page runs: Willison uses it, Generative UI's prompt forbids it. *(Willison, Karpathy, Generative UI)*
13. **Fix the style in the instructions.** A detailed style specification (palette, fonts) in place of a short default gives a consistent look, and the model carries it into generated images and icons. *(Generative UI)*
14. **Judge whether it explains, not whether it runs or pleases.** Rate correctness, visual quality, interactivity, and teaching effect separately. Write down the intended states, learner actions, and transitions, and compare the page with them. For views meant for checking, seed errors from a list of error types and measure both over- and under-reliance. Test understanding afterwards without the instrument, since a benefit may not carry over. Do not rely on preference ratings or automatic judges alone: page tests written by a model correlated negatively with human ratings, and a model judge rated generated video layout 90.6 where people gave 60.2. *(EE-Eval, Zhou et al., Graphionale, Code2Video, Scaife and Rogers)*

## Limits and open questions


- **Showing is not thinking, and doing is not learning.** Most generated explainers present an idea. Matuschak's point is that the valuable representations are the ones you work *in*. Zhang and Norman's participants followed rules held by the artifact yet could rarely state them afterwards.
- **Who benefits.** Argument graphs helped only on hard items and mainly for people who enjoy effortful thinking, and they raised task load. The step-by-step interactive views were rated well, but that study did not measure load.
- **Preference and performance diverge.** Readers rated the graph more engaging on the very tasks where it made their decisions worse.
- **Quality against expert work.** Expert-built pages were still preferred over generated ones (56% to 43%). Human-made videos scored higher on looks; on a quiz, generated videos matched them while being much shorter. Layout remains the weakest point of generated video.
- **Speed, cost, and fragility.** A minute or two per page; 9 to 40 minutes and up to a few dollars per video; recurring script, rendering, and API errors.
- **The evidence is narrow.** Injected errors in school math, logic and visual puzzles, one theorem, a model standing in for the learner. Gains are shown for checking, engagement, and against video or terse text, not clearly against well-written text.

## A prompt that applies the principles


A revision of the prompt from the exported thread:

```text
I want to understand [TOPIC]. My background: [BACKGROUND]. The part that confuses me: [CONFUSION].

Make a single self-contained HTML file (inline CSS and JS, no build step, no React).

Before coding, list the states of the explanation, the actions I can take, and the transitions between them. Keep only those the concept needs.

Explanation path:
1. Open with one concrete example of [TOPIC] before any general rule.
2. Ask me to predict what will happen, then show it.
3. Step through the process with Back / Step / Play / Reset.
4. Then add sliders for the 2-3 parameters that matter most, and show how the behaviour changes across their range.
5. End with an open sandbox and one edge case to try. Let me pin or mark a state to compare with later.

Presentation:
- One idea per step; short labels, no paragraphs over three sentences.
- Put labels on the objects themselves. Use the same color for a given quantity everywhere it appears.
- Draw quantities to scale. Draw diagrams in SVG or canvas, not as images.
- Details on demand (hover or expand), not up front.
- Every control responds instantly and can be undone.

Correctness:
- Any fact, number, or name must be correct; say where it comes from. A simulation of the mechanism is fine; no placeholder or invented data.
- Before finishing, go through every control and state against the list above, and fix overlaps, cut-off text, and script errors.
```


For a video, replace the HTML part with this, based on what worked in Code2Video and TheoremExplainAgent:

```text
Plan, code, then check.
1. Outline: audience, 2-3 minutes, 3-5 sections, each with one concrete example; prerequisites first.
2. Storyboard: per section 3 short narration lines (5 for the key one), each paired with one animation step. Animate only what words cannot show.
3. Layout: title on top, text on the left, animations on the right on a 6x6 grid of named cells (A1-F6). Place everything through grid helpers; keep labels within one cell of their object; a line and its animation share a colour.
4. Manim code per section, rendered separately. On an error, state its type and cause; fix the failing line, then the block, then rewrite the section; up to 5 attempts.
5. Inspect frames for covered text, overlaps, off-screen or lingering objects, and empty regions; fix by moving items to named cells. Check the facts separately.
```

## Checks on the exported thread


- The 2 October 2026 ladder post was read in full through a mirror; the prompts and the 80% STE caveat match. The mirror showed no attached image, so claims about an STE cheat sheet rest on secondary coverage.
- The HTML post is dated 11 May 2026, as the thread says (confirmed on two mirrors).
- The "May 1, 2025" post on generative interfaces exists (status 1917920257257459899) and says what the thread says, with more detail.
- One reply to the October post makes a point the thread missed: a wrong claim narrated over an animation is harder to catch than a wrong sentence.
- The thread's own practices (learning goal, concrete format, meaningful interaction, limited complexity, validation) match principles 2, 1, 4, 6, and 11 above.

## Library sources


Papers cited above, saved in `sources/ai-engineering/generated-interfaces/`:

- [Leviathan et al. 2025](/sources/ai-engineering/generated-interfaces/leviathan-2025-generative-ui.pdf.enc), *Generative UI: LLMs are Effective UI Generators* ([project page](https://generativeui.github.io/)).
- [Wang et al. 2026](/sources/ai-engineering/generated-interfaces/wang-2026-evaluating-interactivity-explorable-explanations.pdf.enc), *Evaluating Interactivity: Toward Automated Assessment of AI-Generated Explorable Explanations* ([arXiv:2606.31012](https://arxiv.org/abs/2606.31012)).
- [Chen et al. 2025](/sources/ai-engineering/generated-interfaces/chen-2025-code2video.pdf.enc), *Code2Video: A Code-centric Paradigm for Educational Video Generation* ([arXiv:2510.01174](https://arxiv.org/abs/2510.01174)).
- [Ku et al. 2025](/sources/ai-engineering/generated-interfaces/ku-2025-theoremexplainagent.pdf.enc), *TheoremExplainAgent: Towards Video-based Multimodal Explanations for LLM Theorem Understanding* ([arXiv:2502.19400](https://arxiv.org/abs/2502.19400)).
- [Wang et al. 2026](/sources/ai-engineering/generated-interfaces/wang-2026-graphionale-graph-visualizations-llm-rationales.pdf.enc), *Graphionale: How Graph Visualizations of LLM Rationales Affect Human Decision Making* ([arXiv:2608.27932](https://arxiv.org/abs/2608.27932)).
- [Zhou et al. 2025](/sources/ai-engineering/generated-interfaces/zhou-2025-interactive-explanation-interfaces-llm-reasoning.pdf.enc), *Improving Human Verification of LLM Reasoning through Interactive Explanation Interfaces* ([arXiv:2510.22922](https://arxiv.org/abs/2510.22922)).

Cited for principles 1, 4, 6, 7, 9, and 14, saved in `sources/thinking-and-learning/external-representations/`: [Larkin and Simon 1987](/sources/thinking-and-learning/external-representations/larkin-1987-why-a-diagram-is-worth-ten-thousand-words.pdf.enc), [Zhang and Norman 1994](/sources/thinking-and-learning/external-representations/zhang-1994-representations-in-distributed-cognitive-tasks.pdf.enc), [Scaife and Rogers 1996](/sources/thinking-and-learning/external-representations/scaife-1996-external-cognition-graphical-representations.pdf.enc), and [Kirsh and Maglio 1994](/sources/thinking-and-learning/external-representations/kirsh-1994-epistemic-vs-pragmatic-action.pdf.enc). The [section index]({{< ref "ai/design/generated-instruments" >}}) says what each contributes.
