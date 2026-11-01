---
draft: false
toc: true
description: "A research dialogue reframes language interfaces around combinatorial requests, proposing language, examples, and direct controls that turn underspecified intent into visible, editable structure instead of repeated prompting."
title: "07 Language Intent And Hybrid Interaction"
linkTitle: "07 Language Intent And Hybrid Interaction"
---
# Language intent and hybrid interaction


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The retained dialogue begins with the author's request to investigate natural language as an interface. The LLM reply reframes the problem as a large space of compositional requests, discusses usability and examples, and closes with a proposed role for language in communicating partially specified intent.

The original request, both "XXX" separator positions, reading map, and reply arguments are retained with editorial wording. The proposed reframing and closing thesis are the LLM's arguments rather than a later correction or accepted requirement from the author.

The [candidate-plan passage]({{< ref "ai/design-research/03-language-and-compiler/10-program-authoring-and-typed-planning" >}}#natural-language-requests-and-candidate-plans), [generated-workspace consequences]({{< ref "ai/design-research/interactive-systems/08-generated-workspaces-and-application-composition" >}}), and [instruction-boundary passage]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}#instructions-and-untrusted-data-in-language-interfaces) are retained separately. All passages belong to the same response.

The source overview (archived source 019) links the complete split. Read the [sibling comments]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction-comments" >}}) for ambiguity, interpretation, examples, and authority. The [audit map]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-7-natural-language-interface-dialogue) preserves the original order. Cited research was not independently checked during the split.

<a id="retained-dialogue"></a>

## Development of the proposal


<!-- Language-intent dialogue source begins below. -->

Initial research question: Investigate the claim 'Natural language therefore becomes a useful interface for systems whose input space was previously too messy to model explicitly.'

Research scope: Find papers and blog posts, then examine what the idea means and what it could enable over the long term.

TODO: Clarify the original `XXX` marker; no further text is recorded here.

The LLM research outline traces the idea from older natural-language interfaces and semantic parsing through instruction-tuned LLMs, tool use, and current "language as a control layer" systems. It distinguishes structural claims from claims that depend on current model quality.

One early correction is already clear: this idea predates LLMs by decades. Natural-language database interfaces existed in the 1970s; what changed is that we no longer need a hand-built parser for each narrow domain. The important shift is from "natural language for one schema" toward "natural language as a reusable semantic adapter."

TODO: Clarify the original `XXX` marker; no further text is recorded here.

The working interpretation is that there is a deeper idea here than "chat is a new UI."

The durable idea is closer to:

> **A learned model can act as a probabilistic compiler from human intent into formal computation.**

Natural language is valuable because humans can describe goals, constraints, examples, exceptions, and context without first translating all of that into the vocabulary of a particular application.

That framing survives even if chatbots, prompt engineering, and current transformer architectures disappear.

### Reading map


- **Burger, Leal & Shoshani, 1975 -- "Semantic-Based Parsing and a Natural-Language Interface for Interactive Data Management."** This shows how old the ambition is: map language onto operations over structured data. [ACL paper](https://aclanthology.org/J75-4013/?utm_source=chatgpt.com)
- **Zettlemoyer & Collins, 2005 -- "Learning to Map Sentences to Logical Form."** A clean formulation of the classical problem: `natural language -> formal meaning representation`. [Paper](https://people.csail.mit.edu/mcollins/papers/uai05.pdf?utm_source=chatgpt.com)
- **Brown et al., 2020 -- GPT-3.** Important because tasks and examples can be supplied as text at runtime, without training a parser specifically for each task. [Paper](https://arxiv.org/pdf/2005.14165?utm_source=chatgpt.com)
- **Wei et al., 2021 -- FLAN.** Instruction tuning shows that training across tasks expressed through natural-language instructions improves generalization to unseen tasks. ([arXiv](https://arxiv.org/abs/2109.01652?utm_source=chatgpt.com "Finetuned Language Models Are Zero-Shot Learners"))
- **Reynolds & McDonell, 2021 -- "Prompt Programming."** One of the early attempts to treat language itself as a way of controlling a general model. [Paper](https://arxiv.org/abs/2102.07350?utm_source=chatgpt.com)
- **Ahn et al., 2022 -- SayCan.** Particularly important conceptually: the language model interprets a high-level request, while a separate system constrains it to actions the robot can actually perform. [Paper](https://arxiv.org/abs/2204.01691?utm_source=chatgpt.com)
- **Liang et al., 2022 -- Code as Policies.** Natural-language instructions are compiled into programs that call deterministic robot APIs. ([arXiv](https://arxiv.org/abs/2209.07753?utm_source=chatgpt.com "Code as Policies: Language Model Programs for Embodied Control"))
- **ReAct / Toolformer, 2022-23.** Language becomes a control layer over search, APIs, calculators and other external systems. ([arXiv](https://arxiv.org/abs/2210.03629?utm_source=chatgpt.com "ReAct: Synergizing Reasoning and Acting in Language Models"))
- **Zamfirescu-Pereira et al., 2023 -- "Why Johnny Can't Prompt."** Essential counterweight. Humans don't automatically become good programmers simply because the programming language is English; semantically similar instructions can produce different behavior. [Paper PDF](https://people.eecs.berkeley.edu/~bjoern/papers/zamfirescu-johnny-chi2023.pdf?utm_source=chatgpt.com)
- **Liu et al., 2023 -- "What It Wants Me To Say."** Introduces the useful idea of an "abstraction gap": users don't know the level of abstraction at which the model understands the underlying system. [Microsoft Research](https://www.microsoft.com/en-us/research/publication/what-it-wants-me-to-say-bridging-the-abstraction-gap-between-end-user-programmers-and-code-generating-large-language-models/?utm_source=chatgpt.com)
- **Pickering et al., CHI 2025 -- human communication of programming tasks.** People with programming experience communicate computational tasks somewhat better, and providing examples/test cases can improve communication. ([EPrints Soton](https://eprints.soton.ac.uk/502151/?utm_source=chatgpt.com "How humans communicate programming tasks in natural language and implications for end-user programming with LLMs - ePrints Soton"))
- **Leviathan et al., 2025 -- Generative UI.** Pushes the idea beyond chat: infer the user's intent and generate a temporary interactive interface appropriate to that task. Human-designed interfaces still did best in their evaluation, but generated interfaces were strongly preferred over ordinary model text output. [Google Research post](https://research.google/blog/generative-ui-a-rich-custom-visual-interactive-user-experience-for-any-prompt/?authuser=6&hl=sr&utm_source=chatgpt.com)
- **Jakob Nielsen, 2023 -- "AI: First New UI Paradigm in 60 Years."** His useful term is _intent-based outcome specification_: tell the machine the result you want. He also argues that the eventual interface will probably combine this with conventional GUI controls. [Essay](https://www.nngroup.com/articles/ai-paradigm/)
- **Matt Welsh -- "The End of Programming."** The maximal version of the thesis: an LLM as a computer programmed in natural language. The working interpretation is that this goes too far, but it's useful as a boundary case. ([MIT CSAIL](https://www.csail.mit.edu/event/large-language-models-and-end-programming?utm_source=chatgpt.com "Large Language Models and The End of Programming | MIT CSAIL"))
- **Simon Willison -- prompt injection / "lethal trifecta."** Important because giving language authority over tools introduces a fundamental security boundary problem: instructions and untrusted data can enter through the same semantic channel. [Essay](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/?utm_source=chatgpt.com)

The research progression is quite coherent.

## What changed with LLMs


Consider the classical semantic-parsing system.

A user says:

```text
show me customers in Argentina with revenue above $1m
```


A domain-specific parser produces:

```sql
SELECT *
FROM customers
WHERE country = 'Argentina'
AND revenue > 1000000
```


Conceptually:

\[\text{language} \rightarrow \text{formal representation}\]

This existed long before LLMs. The problem was that the parser needed substantial domain-specific engineering. You had to define its ontology, vocabulary, grammar and mappings.

The transformation introduced by pretraining is that a huge amount of that mapping is **amortized across domains**.

The model already has representations for:

> customers, invoices, quarters, deadlines, flights, documents, meetings, repositories, dates, source code, "the ones we haven't contacted recently," etc.

So we increasingly get:

\[
\text{arbitrary language}

+

\text{local schema/context}

\rightarrow

\text{local formal operation}
\]

That is much more significant.

You can give a model a previously unseen API such as:

```text
search_customers(
    country,
    min_revenue,
    last_contact_before
)
```


and say:

```text
Find our large Argentine customers
that nobody has spoken to since March.
```


The model has a reasonable chance of constructing:

```json
{
  "country": "AR",
  "min_revenue": 1000000,
  "last_contact_before": "2026-03-01"
}
```


without being specifically trained on the CRM.

That is the new capability.

<a id="so-i-would-modify-our-original-sentence"></a>

## Proposed revision of the earlier formulation


We said:

> "Natural language becomes a useful interface for systems whose input space was previously too messy to model explicitly."

That's directionally right, but the working interpretation is that there's a better formulation:

> **Natural language becomes an interface for request spaces that are too large and compositional to enumerate explicitly.**

That's more precise.

The execution space often isn't messy at all.

An application backend might have only 40 APIs.

The difficulty is that there may be effectively unlimited ways humans can combine them and describe what they want.

Suppose the proposed system exposes:

```text
search
filter
sort
group
calculate
fetch
create
update
send
schedule
```


A traditional UI has to decide beforehand which combinations deserve screens and workflows.

So somebody explicitly builds:

```text
Customer search page
Campaign builder
Sales dashboard
Reminder dialog
Report builder
...
```


But users can ask for combinations the product team never designed:

```text
Find enterprise customers who renewed last year
but have had no support interaction in 90 days,
group them by account manager,
and prepare a short summary for each manager.
```


Every primitive may already exist.

The missing thing is the composition.

LLMs are particularly good at this layer:

\[
\text{human description}

\rightarrow

\text{composition of existing primitives}
\]

That is probably the fundamental capability.

## But natural language has a serious usability problem


There is an apparent paradox:

Natural language is the interface everyone already knows.

Yet people are often bad at using natural-language interfaces.

The HCI literature explains why.

Humans expect:

\[\text{same meaning} \Rightarrow \text{same result}\]

But current LLMs frequently behave more like:

\[
\text{same approximate meaning}

\not\Rightarrow

\text{same computation}
\]

The "Why Johnny Can't Prompt" study observed users struggling with exactly this. Small prompt changes could substantially affect behavior, and users tended to generalize from very few successful or failed interactions. ([People @ EECS](https://people.eecs.berkeley.edu/~bjoern/papers/zamfirescu-johnny-chi2023.pdf?utm_source=chatgpt.com "Why Johnny Can't Prompt: How Non-AI Experts Try (and Fail) to Design LLM Prompts"))

GenLine users similarly felt that they had to discover a hidden model-specific "syntax" despite ostensibly programming in natural language. ([Google Research](https://research.google/pubs/discovering-the-syntax-and-strategies-of-natural-language-programming-with-generative-language-models/?utm_source=chatgpt.com "Discovering the Syntax and Strategies of Natural Language Programming with Generative Language Models"))

And Liu et al. make an even deeper point: users don't know what abstraction level the machine expects. ([Microsoft](https://www.microsoft.com/en-us/research/publication/what-it-wants-me-to-say-bridging-the-abstraction-gap-between-end-user-programmers-and-code-generating-large-language-models/?utm_source=chatgpt.com "\"What It Wants Me To Say\": Bridging the Abstraction Gap Between End-User Programmers and Code-Generating Large Language Models - Microsoft Research"))

Imagine saying:

> Make sales better.

versus:

> Rank these leads by likelihood of purchasing.

versus:

> Sort rows by `conversion_probability DESC`.

All are descriptions of computation at very different abstraction levels.

A system needs to communicate what it can actually do.

The LLM forecast is that a mature UI will not be limited to a blinking chat cursor.

<a id="i-expect-natural-language--direct-manipulation--examples"></a>

## Natural language, direct manipulation, and examples as a forecast


Consider designing a trip.

Language is excellent for:

> "Somewhere warm, quiet, near the sea, under $250/night. I don't want a huge resort."

A map is excellent for examining locations.

A slider is excellent for changing:

```text
$250 → $320
```


A calendar is excellent for dates.

Checkboxes are excellent for explicit constraints.

Photos are excellent for judging accommodation.

Trying to express all of that through conversation would be painful.

Nielsen reached essentially this conclusion in 2023: intent-based interfaces are a new interaction mode, while conventional command/GUI interaction should survive inside hybrid interfaces. ([Nielsen Norman Group](https://www.nngroup.com/articles/ai-paradigm/ "AI: First New UI Paradigm in 60 Years - NN/G"))

The 2025 generative-UI work makes the next step fairly obvious:

```text
natural language describes intent
             ↓
model understands task
             ↓
system generates appropriate GUI
             ↓
human manipulates precise state
```


So natural language may eventually become the **interface that creates the interface**.

That is considerably more plausible to me than chat replacing applications.

## Examples may become as important as instructions


There's another thread in the research that may survive.

Sometimes it's easier to specify behavior with examples:

```text
"Treat these as duplicates"

Acme Corp.     → ACME
Acme Inc       → ACME
Acme Germany   → ACME Germany
```


than to write a complete natural-language rule explaining exactly what "same customer" means.

The CHI 2025 work found that asking users for test cases often improved communication of computational tasks. ([EPrints Soton](https://eprints.soton.ac.uk/502151/?utm_source=chatgpt.com "How humans communicate programming tasks in natural language and implications for end-user programming with LLMs - ePrints Soton"))

So the future specification language may effectively be:

\[
\text{language}

+

\text{examples}

+

\text{constraints}

+

\text{existing context}
\]

For a software engineer this should look familiar.

It's basically:

```text
specification + tests
```


The LLM fills in an implementation candidate between them.

That is a much stronger paradigm than "prompt engineering."

<a id="which-leads-me-to-the-long-term-thesis"></a>

## Proposed long-term thesis


The recommendation is not to make the bet:

> Natural language becomes the universal user interface.

The LLM proposes a narrower forecast that it regards as stronger:

> **Natural language becomes the standard interface for communicating partially specified intent to computers.**

The computer then turns that intent into something more formal.

That distinction explains where language is extremely powerful and where it isn't.

When I know exactly what operation I want:

```text
Ctrl+C
```


wins.

When I need to manipulate exact structure:

```text
spreadsheet / IDE / CAD / timeline
```


wins.

When I know what outcome I want but don't know the precise operations:

```text
"compare these contracts and tell me which renewal clauses expose us
to substantially higher costs next year"
```


language wins.

That's the territory LLMs opened.

And it is huge.

The fundamental transformation can therefore be written as:

```text
OLD

intent
 ↓
human decomposes intent
 ↓
human learns application's abstraction
 ↓
human finds commands
 ↓
human executes commands
 ↓
computer
```


versus:

```text
NEW

intent
 ↓
human expresses intent + constraints + examples
 ↓
model performs semantic decomposition
 ↓
formal plan / generated UI / program
 ↓
human + machine verify
 ↓
deterministic execution
```


The model is absorbing part of the **translation cost between human concepts and machine abstractions**.

That translation cost has been one of the central costs of computing since computers were invented.

If that interpretation is right, then this capability is much more likely to survive the hype cycle than "AI agents," chatbots, prompt engineering, or any particular transformer architecture.

And it suggests a further question that may be more consequential: **if natural language becomes the intent layer, what does the software stack underneath it look like?** In particular, what replaces today's notion of an "application": typed capability graphs, generated UIs, semantic schemas, permission systems, and dynamically synthesized programs. That would be the next proposed layer of investigation.

## Editable interpretation of ambiguous requests


The following passage from the language-interface architecture reply (archived source 020) extends the ambiguity discussion with a customer-selection example. The original request, proposed thresholds, complete controls, and statement about editable structure remain unchanged. The displayed interpretation is a candidate rather than evidence that the organization supplied the definitions.

The [architecture overview]({{< ref "ai/design-research/interactive-systems/09-intent-environments-and-domain-boundaries" >}}) retains the surrounding stack proposal. The [domain-semantics passage]({{< ref "ai/design-research/03-language-and-compiler/13-domain-semantics-and-operation-contracts" >}}) concerns the meanings used to resolve a request. Read the [sibling comments]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction-comments" >}}#editable-interpretation-in-the-architecture-reply) for thresholds, remaining choices, and permission to act. The [stage 8 audit]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-8-language-interfaces-and-architecture) records the original range.

<!-- Editable-interpretation passage begins below. -->

# But there is a hard limit: ambiguity


There is a tendency to imagine that better intelligence eventually eliminates ambiguity.

It can't.

Consider:

> Contact our important customers who might be concerned about the outage.

There are at least three undefined concepts:

```text
important
might be concerned
contact
```


No amount of model capability reveals information the organization hasn't specified.

A good system has several options:

```text
use established business definition
infer from previous behavior
show interpretation to user
ask
```


This is why the semantic layer and interactive UI are connected.

The system could produce:

> I interpreted "important customers" as enterprise accounts above $500k ARR and "affected" as accounts with >5% of requests to the impacted service.

And display:

```text
☑ ARR > $500k
☑ enterprise
☑ >5% requests affected

37 customers
```


Now the fuzzy interpretation has become editable state.

That may be one of the core UI patterns of this new paradigm:

> **language produces structure; the interface exposes the structure for correction.**

That's much better than endless prompt iteration.
