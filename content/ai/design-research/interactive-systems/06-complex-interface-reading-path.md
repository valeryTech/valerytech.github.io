---
draft: false
toc: true
description: "A saved research dialogue shifts from UI theory to builders’ editor architectures, using tldraw, ProseMirror, Figma, and xi to examine state, transactions, synchronization, and costly asynchronous boundaries."
title: "06 Complex Interface Reading Path"
linkTitle: "06 Complex Interface Reading Path"
---
# Complex interface reading path


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The retained dialogue begins with a request for research on hybrid interfaces and complex processing. The later request asks for practitioners, and the LLM response changes its resource list. Both questions are retained; their wording and dialogue role labels have been reformulated for standalone reading.

The [architecture passage]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation" >}}) is retained separately from the first reply. Its initial resource list and reading sequence remain here in their original relative order, followed by the complete practitioner exchange.

The saved descriptions include the tldraw and ProseMirror diagrams, other application cases, and the revised reading sequence. Resource descriptions, product claims, publication dates, and author roles were not independently checked during the split.

The source overview (archived source 018) links the complete split. Read the [sibling comments]({{< ref "ai/design-research/interactive-systems/06-complex-interface-reading-path-comments" >}}) for the change in emphasis and the limits of the descriptions. The [audit map]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-6-complex-ui-design-dialogue) records the original positions.

<a id="retained-reading-dialogue"></a>

## Reading questions and proposed resources


<!-- Complex-interface reading dialogue begins below. -->

# Research complex UI design


<a id="user"></a>

## Author requirement or open question


Initial author question: Which research, books, or other resources explain how to build complex interfaces? The author wants a hybrid interactive UI with complex logic and processing.

<a id="assistant-reasoning"></a>

## LLM rationale for the proposal


The LLM rationale organizes resources by problem: interaction semantics, state architecture, computational complexity, visualization, performance, and human factors. It distinguishes foundational books and papers from practical implementation guidance, since no single source covers everything well.

<a id="assistant"></a>

## LLM proposal


The material exists, but it's split across several disciplines. For a UI with rich interaction, asynchronous work, and substantial domain logic, the proposal is to start with these.

1. **David Harel -- "Statecharts: A Visual Formalism for Complex Systems"**. Probably the single most relevant paper. Statecharts extend state machines with hierarchy, concurrency, and communication, which maps well to complex UI behavior: dialogs, editors, background jobs, cancellation, retries, modes, selection state, etc. ([ScienceDirect](https://www.sciencedirect.com/science/article/pii/0167642387900359))
2. **Martin Fowler -- "GUI Architectures"**. A good historical and conceptual tour through MVC, MVP, Presentation Model, and related approaches. The important idea is separating presentation state from domain logic and making synchronization explicit. ([martinfowler.com](https://martinfowler.com/eaaDev/uiArchs.html))
3. **The Elm Architecture / Model-View-Update**. Even if you never use Elm, study this architecture. `Model -> View`, and `Message + Model -> Model` gives you a very strong mental model for complex interactive software. Redux and many later architectures borrow from this approach. ([Elm Guide](https://guide.elm-lang.org/architecture/))
4. **Moseley & Marks -- "Out of the Tar Pit."** This is broader software architecture, but extremely applicable to UI. Their main argument is that mutable state and control flow are major sources of software complexity. The useful takeaway is to keep domain state and domain logic explicit, while deriving everything you can. ([Moss](https://moss.cs.iit.edu/cs100/papers/out-of-the-tar-pit.pdf))
5. **Jenifer Tidwell et al. -- _Designing Interfaces_, 3rd ed.** This covers interaction patterns rather than software architecture: selection, navigation, progressive disclosure, complex input, direct manipulation, information organization, and UI systems. ([O'Reilly Media](https://www.oreilly.com/library/view/designing-interfaces-3rd/9781492051954/))
6. **Ben Shneiderman -- "Direct Manipulation: A Step Beyond Programming Languages."** Foundational if your UI involves manipulating objects directly: diagrams, timelines, editors, CAD-like tools, node graphs, dashboards, etc. The core idea is keeping objects/actions visible and providing rapid incremental feedback. ([University of Maryland Computer Science](https://www.cs.umd.edu/~ben/publications.html))
7. **Conal Elliott & Paul Hudak -- "Functional Reactive Animation."** This is worth reading if your interface has continuous values, animation, streams, time-dependent state, dragging, simulations, or live computation. It introduced influential ideas around behaviors and events in functional reactive programming. ([CiNii Research](https://cir.nii.ac.jp/crid/1362825895858915968))
8. **Martin Kleppmann & Chris Riccomini -- _Designing Data-Intensive Applications_, 2nd ed.** The second edition came out in February 2026. This becomes relevant once the "processing" part is substantial: concurrency, derived data, streaming, distributed computation, consistency, caching, background work, and synchronization. ([O'Reilly Media](https://www.oreilly.com/library/view/designing-data-intensive-applications/9781098119058/))

If your app is also offline-capable, collaborative, or splits authoritative state between browser/device/server, read Kleppmann et al.'s **"Local-first software"**. It gets directly into the architectural consequences of local state, synchronization, CRDTs, and responsive applications. ([Ink & Switch](https://www.inkandswitch.com/essay/local-first/))

There's also a useful design counterweight: Bret Victor's **"Magic Ink."** It argues that designers often make software unnecessarily interactive when the system could derive and present the information the user actually needs. It's useful when deciding which complexity should appear as controls and which should disappear behind computation. ([Worry Dream](https://worrydream.com/MagicInk/))

For building a **Figma/IDE/Blender/data-analysis-style application**, the proposed reading order is:

**Statecharts -> Elm Architecture -> Out of the Tar Pit -> Designing Interfaces -> Fowler GUI Architectures -> DDIA.**

That combination gets much closer to "how do I engineer a complicated interactive application?" than conventional frontend books about components, CSS, React hooks, etc.

<a id="user-1"></a>

## Author requirement or open question


Author preference: Prioritize practitioners rather than scientists, and seek accounts showing what they have built. The condition in the original sentence is unclear.

<a id="assistant-reasoning-1"></a>

## LLM rationale for the proposal


The revised LLM rationale prioritizes material by people who built complex products: concrete case studies, source code, and implementation-focused books. This changes the earlier emphasis on academic theory.

<a id="assistant-1"></a>

## LLM proposal


Then the proposal is to change the list substantially. For the stated problem, the proposal is to study **working editors and tools**, especially where the authors expose the architecture and source.

The proposed first choice is **tldraw**. It's almost a reference implementation for the proposed kind of application. Their editor combines a reactive record store, derived state/signals, transactions, a hierarchical state machine for interactions, undo/redo, snapping, input management, geometry, rendering, and multiplayer. Their docs actually explain how those pieces fit together. ([tldraw](https://tldraw.dev/sdk-features/editor))

The important part is that they don't model the application as a tree of React components. Conceptually it looks closer to:

```text
document records
      │
      ▼
reactive store ───► derived computations
      │                    │
      │                    ▼
      │                   UI
      │
      ├──── history / transactions
      │
      └──── editor
              │
              ├── interaction statechart
              ├── snapping
              ├── selection
              ├── inputs
              ├── text/layout
              └── camera
```


That separation is worth studying in detail. Their selection tool alone has states such as `idle`, `pointing`, `brushing`, etc., instead of spreading pointer logic across event handlers. ([tldraw](https://tldraw.dev/sdk-features/editor))

**Marijn Haverbeke -- CodeMirror + ProseMirror** would be my second stop. He actually built both editors. ProseMirror is especially good for understanding a pattern that may apply far beyond text editors:

```text
Model
  ↓
State
  ↓
Transaction
  ↓
new State
  ↓
View
```


The document has an explicit model; selection is state; modifications are transactions; undo/collaboration work in terms of those transformations. ([ProseMirror](https://prosemirror.net/docs/guide/))

His writing about CodeMirror is also valuable because he explains why abstractions appeared as actual requirements appeared, including places where the architecture had to evolve. ([Marijn Haverbeke](https://marijnhaverbeke.nl/blog/codemirror-shared-documents.html))

Then **Figma engineering**, particularly Evan Wallace and the editor team. This is useful once your UI becomes a serious computational system instead of a normal application. Figma's document is effectively a tree/database of objects and properties; the client maintains its own document state and synchronizes changes continuously. Evan Wallace's multiplayer article describes the actual production architecture and their reasons for building it that way. ([Figma](https://www.figma.com/blog/how-figmas-multiplayer-technology-works/))

Their engineering archive is also worth browsing selectively. Recent articles cover things like rebuilding component instances on a reactive foundation, speeding up huge layer trees through computation and caching, WebGPU rendering, incremental loading, and their code editor/collaboration architecture. ([Figma](https://www.figma.com/blog/engineering/))

For the **data/processing side of an interactive application**, read what **Tuomas Artman / Linear** have published about their sync engine. Linear keeps a local database on the client so common operations don't need a server round trip, then synchronizes changes. That's a useful architecture when you want UI interaction to remain independent of expensive/network processing. ([Linear](https://linear.app/now/scaling-the-linear-sync-engine))

Another proposed author to read is **Raph Levien**. His *xi-editor retrospective* is more valuable than a polished architecture book because he built the thing and then explains which architectural bets caused trouble. Xi used Rust, ropes, separate processes, async processing, incremental syntax highlighting, plugins, and CRDTs. His conclusion is essentially that some of those boundaries introduced more complexity than their benefits justified. ([Raph Levien's blog](https://raphlinus.github.io/xi/2020/06/27/xi-retrospective.html))

That article is particularly relevant to the "complex logic and processing" requirement. Xi deliberately ran things like syntax highlighting asynchronously so typing couldn't be blocked by computation. Then Levien describes the synchronization and caching complexity that architecture created. ([Raph Levien's blog](https://raphlinus.github.io/xi/2020/06/27/xi-retrospective.html))

For local-first architecture, **James Long's Actual** material is good. He built a complete finance application with SQLite locally and his own synchronization engine, then wrote about using CRDTs in the actual shipped product and about performance problems he encountered. ([JLongster](https://jlongster.com/work))

And there is one book proposed as a high priority: **Web Browser Engineering**. One of the authors, Chris Harrelson, leads Blink rendering at Google and previously worked on Google Maps. The book builds a browser as you read: layout, event handling, rendering, JavaScript, threads, task scheduling, compositing, GPU animation, accessibility, caching and invalidation. ([Web Browser Engineering](https://web.browser.engineering/))

The chapters on **task scheduling** and **reusing previous computation/invalidation** are especially relevant to a UI that has heavy processing. ([Browser Engineering](https://browser.engineering/))

For these requirements, the proposed sequence is:

1. **tldraw source + architecture docs** -- complex interactive state.
2. **ProseMirror source + guide** -- transactions and domain models.
3. **Figma engineering** -- very large interactive editor.
4. **Raph Levien's xi retrospective** -- async computation and architectural mistakes.
5. **Linear sync-engine talks** -- local data + async/server state.
6. **James Long / Actual** -- one person building the whole thing.
7. **Web Browser Engineering** -- rendering, scheduling, invalidation, processing.

The proposal is to largely skip generic React architecture books. Once an application gets into Figma/IDE/CAD/data-tool territory, **React becomes the last few centimeters of the architecture**. The more important questions are how you represent the document, operations, derived state, interaction state, jobs, invalidation, undo, persistence and synchronization.

Further scoping question: Is the application a *node editor + computation engine*, *IDE*, *CAD-ish canvas*, *data analysis UI*, *AI tool*, or another kind of system? This could narrow the proposed reading list to about **5 codebases/articles matching the needed architecture**.
