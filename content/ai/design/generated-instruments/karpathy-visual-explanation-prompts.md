---
draft: false
toc: true
title: "Karpathy Visual Prompts Practices"
description: "A conversation about Andrej Karpathy's advice to ask LLMs for diagrams, interactive HTML, and animated explainers instead of text, with prompting practices and a reusable prompt."
linkTitle: "Karpathy Visual Prompts"
---

Follow-up research on similar approaches, the principles they share, and checks on this thread's dates: [Visual explanations from LLMs]({{< ref "ai/design/generated-instruments/visual-explanations-from-llms" >}}).

The thread's citation chips are kept as numbered footnotes, listed under [Citation links](#citation-links); the links behind them were recovered from the shared page on 2026-11-05. What the three Karpathy posts actually say is summarized in [Sources behind the thread](#sources-behind-the-thread) at the end.

Related: generated interfaces in [language intent and hybrid interaction]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction" >}}) and [generated workspaces and application composition]({{< ref "ai/design-research/interactive-systems/08-generated-workspaces-and-application-composition" >}}).

## User -- turn 1


I remember that Karpathy said that the LM should not write you the responses to you in text and it should generate a graphic, explain yourself in animation maybe. Could you find out if we talk about the prompts he used to do it? And what are the practices?

## Assistant -- turn 1


Yes. I found the posts you're remembering. Andrej Karpathy has discussed this several times, most explicitly on October 2, 2026, when he shared concrete prompting techniques for getting LLMs to explain things visually.

His broader idea is that the future of LLM interfaces is a **generative graphical interface**: the model creates a diagram, animation, interactive webpage, or video specifically for the question you're asking. [^1][^2]

### 1. The prompts Karpathy actually recommended


In his [October 2 post](https://x.com/karpathy/status/2105819303471976479), he described four levels of explanation:

| Format | His suggested prompt or instruction |
| --- | --- |
| Clear technical writing | Ask for `ASD-STE100` or `80% of the way to ASD-STE100`. |
| Diagrams | Ask the LLM to create a diagram explaining the concept. |
| Interactive webpage | Ask for the output in HTML. |
| Animated explainer video | `Create a 3b1b style video explainer on X. Use my ElevenLabs API key for audio narration` |

The last example refers to the mathematical animation style of 3Blue1Brown. Karpathy notes that free, locally running narration tools can also be used.

He specifically recommends generating small, custom applications or videos for a single question--even when you'll discard them after you've understood the concept. [^3][^1]

### 2. His earlier post about HTML


In a [May 11, 2026 post](https://x.com/karpathy/status/2053872850101285137), Karpathy gave an even simpler instruction: append `structure your response as HTML` to your query, then open the generated file in a browser.

He suggested that HTML is becoming a useful default because it supports visual layouts, animations, and interaction. He also mentioned success with slideshows. [^4][^5]

### 3. Practical prompting techniques


These are my recommendations based on his approach, rather than verbatim Karpathy instructions.

- **Specify the learning goal.** Tell the model what you want to understand, your background, and which part is confusing.
- **Request a concrete visual format.** Use SVG for static diagrams, HTML with JavaScript for interactive explanations, and Manim or another animation renderer for videos.
- **Make interactions meaningful.** Ask for sliders, step-by-step playback, pause controls, and visual comparisons that reveal how the system behaves.
- **Limit visual complexity.** Introduce one concept at a time, keep labels readable, and use color consistently.
- **Require validation.** Ask the model to run the implementation, inspect the result, check the underlying facts, and fix rendering errors.

### 4. A reusable prompt


For technical concepts, I would start with this:

**Interactive explanation prompt**

```text
Explain [TOPIC] to a software engineer through an interactive visual demonstration.

Create a self-contained HTML page with CSS and JavaScript.

Requirements:
- Start with an intuitive visual example.
- Animate the process step by step.
- Add Play, Pause, Reset and Step controls.
- Include sliders to change important parameters.
- Show how changes affect the system in real time.
- Use short labels and minimal explanatory text.
- Include one concrete example and an edge case.
- Ensure the simulation is technically accurate.
- Test the page and fix rendering or interaction issues.

Prioritize understanding through interaction over long paragraphs.
```


For example, replace `[TOPIC]` with `how an LSM tree handles writes, compaction, and reads`. This should encourage the model to build a small simulation that lets you watch the data move.

For a narrated animation, change the output request to: `Create a 90-second mathematical animation using Manim. Explain the concept through progressive visual scenes, synchronize narration with each scene, and render a final MP4.`

**My recommendation:** Start with interactive HTML for learning technical concepts. It lets you manipulate parameters and test your understanding. Use a rendered video when you want a guided explanation that you can watch or share.

The larger idea comes from Karpathy's [May 1, 2025 discussion of generative interfaces](https://jaytaylor.com/notes/node/1769632270000.html): LLMs may eventually create a temporary, purpose-built graphical interface for each question, with diagrams, controls, animations, and simulations assembled on demand. [^2][^6]

If you want, I can:

- Generate an interactive HTML visual explainer for a technical concept
- Create a Manim-style narrated animation prompt for a math video explainer
- Produce a concise HTML structure prompt for embedding diagrams and sliders

## Sources behind the thread


The thread cites three Karpathy posts. x.com blocks automated reading, so each was read in full through a mirror on 2026-11-05. Read in date order, they move from a prediction about interfaces (2025) to a one-line tip (May 2026) to a method (October 2026).

### 1 May 2025: chatting with an LLM feels like an 80s terminal


[Original post](https://x.com/karpathy/status/1917920257257459899), read in [Jay Taylor's notes](https://jaytaylor.com/notes/node/1769632270000.html), a public archive of clipped web posts (clipped 2026-01-28, no added commentary).

- **Premise.** Talking to an LLM through chat is like using a computer through a 1980s terminal. The graphical interface for LLMs has not been invented yet, but some of its properties can be predicted.
- **It will be visual.** Vision is the highest-bandwidth way into the brain, which he calls "the 10-lane highway into brain", and a large share of the brain's compute goes to it. So the interface will lean on pictures, charts, and animations, with less reading.
- **It will be generated for each request.** The interface is produced on demand from the prompt and reconfigured for the immediate purpose, instead of being a fixed app.
- **How procedural is the open question.** At one end a single image model paints the whole screen; at the other the model assembles a page from ordinary code components (he names React). He guesses a mix, with components as the skeleton, and bets that, as models improve, the result will be a fluid, temporary, interactive 2D canvas written for the user.
- **Early signs.** Code highlighting, LaTeX, markdown, emoji, and the Artifacts tab (Mermaid charts, small apps) are primitive versions of this. Interfaces in science fiction (Iron Man, and less so Star Trek and Minority Report) point the same way.

### 11 May 2026: ask for HTML


[Original post](https://x.com/karpathy/status/2053872850101285137), read in full on [nitter.cf](https://nitter.cf/karpathy/status/2053872850101285137). The [X to Image](https://xtoimage.com/karpathy/status/2053872850101285137) page that ChatGPT cited shows only a truncated preview.

- **The tip.** End a query with "structure your response as HTML" and open the generated file in a browser. Asking for slideshows has also worked for him.
- **Audio in, vision out.** People prefer to give input to an AI by voice, but prefer its output as something to look at: images, animations, video.
- **A ranking of output formats.** Raw text, then markdown (today's default), then HTML (early, but forming a new default), and beyond that interactive videos or simulations, which he thinks a neural network may eventually generate directly.
- **Input is still missing.** Text, audio, or video alone are not enough; he wants to point and gesture at the screen.
- **His summary:** try asking for HTML.

### 2 October 2026: understanding the outputs of language models


[Original post](https://x.com/karpathy/status/2105819303471976479), read in full on [nitter.cf](https://nitter.cf/karpathy/status/2105819303471976479); also on [TwStalker](https://x.twstalker.com/karpathy/status/2105819303471976479). A single post, not a thread; the mirror showed no attached image, so the STE cheat sheet mentioned in coverage could not be checked there.

- **Opening claim.** People will spend much more time trying to understand what language models produce, and he offers tips for that.
- **Writing.** Ask the model to explain in ASD-STE100, a controlled English from aerospace maintenance manuals whose strict rules give readable prose. The spec is stringent, so he sometimes asks for "80% of the way to ASD-STE100".
- **Diagrams, then HTML.** Better than prose: ask for a diagram, which is easier to process and understand. Better still: ask for the output "in HTML", since models are good at front-end work and animation and can build an interactive page.
- **Video, the rung he is most bullish on.** Custom explainer videos on any topic, for example "Create a 3b1b style video explainer on X. Use my ElevenLabs API key for audio narration", or free narration tools on your own machine. He says this is starting to work.
- **Where human work goes.** As models do more of the work on their own, human work moves up into oversight and understanding. Because code is now cheap, it makes sense to ask for "large, custom, discardable software artifacts" such as web apps and video explainers, which would never have been worth building before.
- **From the replies** (other people, not Karpathy): tools people use for this (Manim, the Kokoro local voice model, Excalidraw, an ASD-STE100 skill for Claude Code), and one warning that a wrong claim narrated over an animation is harder to catch than a wrong sentence.

### The two post lists


[TopicDigg](https://topicdigg.com/x/karpathy) and [teapawt](https://teapawt.net/karpathy?filter=posts) list Karpathy's recent posts. Related ones, known only from these listings (not read in full):

- **August 2026.** A model rendered a scene in three.js; he notes that LLMs cannot yet efficiently watch video or play games to check their own work.
- **June 2026.** A model launch post mentions explainers, visualizers, and research projects that present results as custom HTML.
- **April 2026.** "LLM Knowledge Bases": a markdown wiki compiled by an LLM and viewed in Obsidian, with slides; and "file over app", meaning that plain files can be viewed through any interface.
- **July 2026.** Rambling voice input as the input side of working with models.

## Citation links


[^1]: [Andrej Karpathy, "We'll be spending a lot more time trying to understand the outputs of language models", 2 October 2026 (nitter.cf mirror)](<https://nitter.cf/karpathy/status/2105819303471976479>). Original on [x.com](<https://x.com/karpathy/status/2105819303471976479>).

[^2]: [Andrej Karpathy, "Chatting with LLM feels like using an 80s computer terminal", 1 May 2025 (Jay Taylor's notes)](<https://jaytaylor.com/notes/node/1769632270000.html>). Original on [x.com](<https://x.com/karpathy/status/1917920257257459899>).

[^3]: [Andrej Karpathy (@karpathy), post of 2 October 2026 (TwStalker mirror)](<https://x.twstalker.com/karpathy/status/2105819303471976479>).

[^4]: [Andrej Karpathy's post, 11 May 2026 (X to Image, truncated preview)](<https://xtoimage.com/karpathy/status/2053872850101285137>). Full text on [nitter.cf](<https://nitter.cf/karpathy/status/2053872850101285137>); original on [x.com](<https://x.com/karpathy/status/2053872850101285137>).

[^5]: [Andrej Karpathy (@karpathy), list of posts (TopicDigg)](<https://topicdigg.com/x/karpathy>).

[^6]: [Posts from @karpathy (teapawt)](<https://teapawt.net/karpathy?filter=posts>).
