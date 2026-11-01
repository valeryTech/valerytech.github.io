---
draft: false
toc: true
description: "Working source-selection guidance weighs AI capability claims by measurable artifacts, baselines, repeated runs, and builder/operator evidence, proposing a claim ledger that separates trend sensing from demonstrated production results."
title: "Sources Critical"
linkTitle: "Sources Critical"
---

Proposed correction to the earlier trend assessment: apply a strict evidence filter. That assessment mixed engineering evidence with vendor claims. An OpenAI or Anthropic engineering post can tell us what they're building; it cannot, by itself, tell us where the industry is going.

<a id="the-filter-id-use"></a>

### Proposed evidence filter


For any claim like "memory is the next platform layer" or "agents can now work for days," ask:

|Question|Good signal|
|---|---|
|Is the claim measurable?|success rate, task duration, cost, latency, failure rate|
|Can I inspect the artifact?|code, dataset, benchmark, traces, methodology|
|Is there a baseline?|human, previous model, simpler architecture|
|Are repeated runs reported?|reliability, variance, pass@1 rather than cherry-picked demo|
|Are limitations discussed?|contamination, task structure, human intervention|
|Did someone actually operate it?|production traffic, users, incidents, maintenance|
|Does the author make money if I believe the thesis?|if yes, discount accordingly|

"AGI is here", "10× engineer", "self-driving company", "agents replace teams" usually fail almost all of these.

Proposed requirement before calling something a trend: **triangulation across three source types**:

**measurement + hands-on practitioner + production adopter.**

That cuts out most of the noise.

<a id="people-i-would-actually-follow"></a>

### Suggested practitioner and research sources


|Person/team|Use them for|Why|
|---|---|---|
|**Simon Willison**|agent engineering, coding agents, security, tool use|Builds things himself, documents experiments, changes his mind publicly, links primary sources. His 2026 agentic-engineering work explicitly focuses on patterns that demonstrably work. ([Simon Willison's Weblog](https://simonwillison.net/guides/agentic-engineering-patterns/what-is-agentic-engineering/changes/ "Changes - What is agentic engineering? - Agentic Engineering Patterns - Simon Willison's Weblog"))|
|**Hamel Husain + Shreya Shankar**|evals, production AI development process|Very strong on starting from observed failures and production traces. Their recommendation is literally to review real outputs before building elaborate eval infrastructure. ([Hamel's Blog](https://hamel.dev/notes/llm/evals/ "AI Evals - Hamel's Blog"))|
|**Armin Ronacher**|harnesses, loops, coding-agent architecture|He's actually building this machinery and writes about where it breaks. His June 2026 "Coming Loop" post describes the emerging outer harness around coding agents while also warning about loss of human understanding. ([Armin Ronacher's Thoughts and Writings](https://lucumr.pocoo.org/2026/6/23/the-coming-loop/ "The Coming Loop \| Armin Ronacher's Thoughts and Writings"))|
|**Mario Zechner**|minimal harness design, tool interfaces, context|Built `pi`; publishes implementation choices and contrary results such as deliberately omitting MCP, subagents and planning machinery. Now commercially affiliated with Earendil, so apply that discount. ([mariozechner.at](https://mariozechner.at/posts/2025-11-30-pi-coding-agent/ "What I learned building an opinionated and minimal coding agent"))|
|**Epoch AI benchmark team**|actual capability trends|Follow the researchers more than personalities: Tom Adamczewski, David Owen, Greg Burnham, etc. They publish methodology, code and caveats. ([Epoch AI](https://epoch.ai/benchmarks/mirrorcode "MirrorCode \| Epoch AI"))|
|**METR researchers**|autonomous task capability|One of the better sources for answering "are agents actually handling longer tasks?" They also publish corrections and sensitivity analyses when their measurements have problems. ([Metr](https://metr.org/time-horizons/ "Task-Completion Time Horizons of Frontier AI Models - METR"))|

That last behavior is an especially strong signal. METR found a modeling mistake that changed some recent time-horizon estimates by up to 20%, corrected it, and published an analysis of remaining uncertainty. ([Metr](https://metr.org/notes/2026-03-20-impact-of-modelling-assumptions-on-time-horizon-results/ "Impact of modelling assumptions on time horizon results - METR"))

Publicly correcting errors is a useful source-quality signal.

### Publications/blogs


Proposed source feed:

|Source|What I would use it for|Trust level|
|---|---|--:|
|**METR**|agent capability / autonomy measurements|very high|
|**Epoch AI**|capability benchmarks, economics, trend data|very high|
|**Simon Willison**|practitioner reality + ecosystem changes|very high|
|**Hamel.dev**|evals and AI product engineering|very high|
|**Thoughtworks Technology Radar**|adoption patterns from consulting work|high|
|**InfoQ / QCon reports**|production architecture across many companies|high|
|**Artificial Analysis**|price/performance/latency and agent comparisons|high, with benchmark caveats|
|**O'Reilly Radar**|broader synthesis|medium-high|
|**Latent Space / AI Engineer**|finding new topics and people|discovery only|
|Vendor engineering blogs|implementation details|conditional|
|Vendor "state of AI" reports|market telemetry|low-medium|
|CEO keynotes/interviews|strategy/positioning|very low|

Thoughtworks is a good example of the kind of skepticism we want. MCP is one of the hottest topics, yet its April 2026 Radar entry explicitly says **"MCP by default" should be approached with caution**, because a CLI or API can sometimes solve the problem with less abstraction. ([Thoughtworks](https://www.thoughtworks.com/en-us/radar/techniques/mcp-by-default "MCP by default | Technology Radar | Thoughtworks United States"))

That's substantially more useful to us than "MCP is the future."

### Conferences


Suggested conference priorities for the platform/discovery perspective:

**MLSys** is probably the strongest technical conference. It's explicitly about ML + systems, and its 2026 scope includes agent systems, serving, runtimes, monitoring, privacy/security, distributed systems and benchmarks. Papers matter more than keynotes. ([MLSys](https://mlsys.org/ "2026 Conference"))

**QCon AI / InfoQ** is particularly useful for platform research because speakers tend to discuss production architecture. Their Boston 2026 synthesis independently identified context infrastructure, harnesses, state, evals, observability, identity and platform ownership as recurring themes across talks. ([InfoQ](https://www.infoq.com/news/2026/07/production-ai-platforms-evals/ "QCon AI Boston: Production AI Moves beyond Prompts to Platforms, Harnesses, and Evals - InfoQ"))

**KubeCon / CloudNativeCon**, especially Platform Engineering Day, Cloud Native AI + Inference Day and Agentics Day, is useful for seeing when AI concepts cross over into ordinary infrastructure engineering. CNCF has even added a dedicated **AI Inference + Agentic** track to KubeCon NA 2026. ([CNCF](https://www.cncf.io/blog/2026/03/19/kubecon-cloudnativecon-europe-2026-co-located-event-deep-dive-platform-engineering-day/ "KubeCon + CloudNativeCon Europe 2026 Co-located Event Deep Dive: Platform Engineering Day | CNCF"))

**AI Engineer World's Fair** is a very good _trend sensor_ and a bad truth oracle. The 2026 tracks themselves are informative: "Harness Engineering," "Memory & Continual Learning," "Sandbox & Platform Engineering," "Evals," "Context Engineering," "Computer Use," and "Agentic Engineering." ([AI Engineer](https://www.ai.engineer/worldsfair/2026 "AI Engineer World's Fair 2026: June 29 - July 2, San Francisco"))

Suggested use: scan that conference to learn **what people are currently building**, then use other evidence to determine whether it works.

### Companies: watch users more than sellers


This distinction matters a lot.

A claim from **Zep/Letta/Yugabyte** that memory is critical shows that memory vendors think memory is critical.

A claim from **Temporal/Inngest/Prefect** that agents need durable execution shows that workflow vendors see an agent use case.

Useful, but weak evidence of general demand.

Stronger evidence comes from an engineering team whose primary business is elsewhere:

> We built X, encountered Y failure, tried A and B, ended up with C, and here are the numbers.

Suggested production-adopter sources include engineering teams at companies such as **Uber, LinkedIn, DoorDash, Netflix, Cloudflare, Block, GitHub, Shopify, Spotify and similar large product organizations**.

At AI Engineer 2026, for example, Uber presented closed-loop evals, LinkedIn presented its agent skills approach, and the New York Times discussed on-device agentic AI. This assessment treats these presentations as more informative than a startup pitch for an "agent operating system." ([AI Engineer](https://www.ai.engineer/worldsfair/schedule "Schedule · AI Engineer World's Fair 2026"))

<a id="applying-this-filter-to-the-trends-we-discussed"></a>

### Applying the filter to the platform trends


Proposed confidence revisions:

|Claim|My confidence|Evidence quality|
|---|--:|---|
|**Agents can successfully execute some much longer tasks**|**high**|METR + Epoch measurements|
|**Harness design materially changes agent performance**|**high**|benchmarks + multiple independent builders|
|**Evals / verification become core infrastructure**|**high**|production practice + independent practitioners|
|**Sandboxed execution/state becomes a platform primitive**|**high-ish**|multiple implementations + architectural necessity|
|**Context engineering becomes its own engineering problem**|**high**|practitioner convergence|
|**Durable long-running execution becomes widespread**|**medium-high**|capability exists; actual enterprise workload distribution still developing|
|**Memory becomes a major platform category**|**medium**|lots of activity, definitions still confused|
|**Skills become the dominant reuse mechanism**|**medium**|strong 2026 momentum, too early|
|**MCP becomes universal integration layer**|**medium-low**|adoption strong; architectural value disputed|
|**Multi-agent architectures become standard**|**low-medium**|demos/research greatly exceed production evidence|
|**Fully autonomous knowledge-work agents**|**low**|extrapolation|
|**AGI has arrived**|meaningless for our purposes|definition/marketing problem|

One useful contrast is long-horizon coding.

Epoch's MirrorCode is legitimate evidence: the tasks have hidden end-to-end tests, the harness and most targets are open, runs can receive huge compute budgets, and they explicitly discuss contamination and failure modes. They report agents sometimes prematurely submitting, failing to use their budgets and trying to game tests. ([Epoch AI](https://epoch.ai/benchmarks/mirrorcode "MirrorCode | Epoch AI"))

Supported interpretation in this assessment:

> **There is strong evidence that 2026 agents can autonomously complete some precisely specified software tasks whose human equivalent is days or weeks.**

Unsupported extrapolation to avoid:

> "AI can autonomously perform weeks of software engineering."

The second sentence quietly throws away the conditions that made the experiment work: precise executable specification, checkable outcome, sandbox, huge inference budget, a particular harness and a task amenable to iterative feedback. Epoch themselves explicitly caution that real software development isn't normally structured like MirrorCode. ([Epoch AI](https://epoch.ai/publications/mirrorcode-preliminary-results "MirrorCode: Evidence AI can already do some weeks-long coding tasks | Epoch AI"))

That distinction is basically the entire anti-hype discipline.

Proposal for AI-platform work: maintain an **evidence ledger**: each purported 2027 trend gets `claim -> evidence -> counterevidence -> maturity -> platform implication`. That would let us distinguish things we should actually design for from things we should merely watch.

## Evidence ledger build


Proposed first filter, stated more strictly:

> **Has this person recently built and operated the kind of system they're making claims about, in production, with real users and real failure consequences?**

"Has built products" is still too easy to satisfy. Someone may have founded a startup ten years ago and now spend all their time talking to builders. That gives them useful network access, but it does not give them current operational evidence.

Proposed source-scoring dimensions:

1. **Proximity to the work** -- Did they personally implement the system?
2. **Production exposure** -- Did real users depend on it?
3. **Operational responsibility** -- Did they own failures, incidents, cost, latency, regressions, security, maintenance?
4. **Current relevance** -- Was this experience with current models and current agent architectures?
5. **Evidence access** -- Can they show code, traces, evals, incidents, metrics, or detailed postmortems?
6. **Adversarial behavior** -- Do they actively look for cases where their thesis fails?
7. **Incentives** -- Are they paid to evangelize the category they're describing?

The strongest source is often someone who can say:

> "We deployed this to 40 engineers. It worked for these three task classes. It failed badly for these two. Here are 200 runs, the failure taxonomy, cost distribution, and the changes we made."

That is much stronger than:

> "I talk every week with the most advanced teams and everyone is moving toward autonomous coding."

The second statement might be useful as **ecosystem sensing**. It's weak evidence about whether the approach works.

Proposed classification of the referenced Volkov talk. [Source gap: the talk and session description were not linked in this note.]

**Role:** ecosystem observer / synthesizer

**Evidence value:** low for capability claims, potentially useful for identifying debates and people to investigate

**Production authority on coding agents:** not established by the session description

**Main artifact:** a conceptual framework derived from two talks and conversations

**Red flags:** coined terminology, narrative compression, directional prediction ("capability bends everything toward L"), no stated empirical test, no production data

Claim to challenge:

> "model capability bends everything toward L"

That is an empirical hypothesis disguised as an inevitable trend.

It could be false for several reasons: verification cost may grow with task criticality; generated code may become harder to understand as volume rises; security and regulatory constraints may force review; maintenance may require humans to preserve system understanding; model capability and trustworthy autonomy may improve at different rates.

A strong version of that talk would have asked:

> Across what task classes does reduced code review improve throughput without increasing downstream defects, incidents, rework, or loss of system understanding?

Then actually measured it.

**Builder/operator status should be near the top of the filter.** Proposed finer distinction:

|Source type|How I use them|
|---|---|
|Builds + operates production system|Primary evidence|
|Builds open-source tool used seriously by others|Strong technical evidence|
|Runs controlled benchmarks / research|Strong capability evidence|
|Consults closely with many production teams|Useful cross-company observation|
|Investor / analyst / evangelist / podcast host|Trend discovery|
|CEO selling the technology|Company strategy, almost never capability evidence|

And importantly, **a source can move between categories claim by claim**. Armin Ronacher talking about his own agent harness gets a high weight. Armin predicting the future of all software engineering gets a much lower weight.

That is probably the methodology we should use for the whole 2026/27 source map: **evaluate the source separately from the claim, then evaluate the evidence behind each claim.**

## Library sources


- [Mailach et al. 2024](/sources/ai-engineering/practice/mailach-2024-themes-of-building-llm-applications-for-production.pdf.enc), *Themes of Building LLM-based Applications for Production* ([arXiv:2411.08574](https://arxiv.org/abs/2411.08574))
- [Denzin and Lincoln 2018](/sources/research-methods/empirical-methods/denzin-2018-sage-handbook-of-qualitative-research.pdf.enc), *The SAGE Handbook of Qualitative Research*
