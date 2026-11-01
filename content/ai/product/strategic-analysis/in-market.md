---
draft: false
toc: true
description: "Exploratory economic scenarios model workload migration among frontier APIs, cheaper providers, hosted open weights, and local inference, separating task quality and failure cost from provider-financing and price forecasts."
title: "In Market"
linkTitle: "In Market"
---

<!-- Original excerpt boundary: +++ -->

[David Zhu](https://reevo.ai/about), an ex-[DoorDash](https://www.cnbc.com/quotes/DASH/) head of engineering, said that after the "ChatGPT moment" he looked across the software landscape -- from startups to medium-sized firms funded with private credit to the largest public SaaS companies -- and saw a seismic shift on the horizon.

"The thesis I had was that all workflow-driven enterprise SaaS companies will be either disrupted or dead in the next decade," Zhu told CNBC.

The SaaS model, where companies embed themselves in employee workflows and often charge by the user, is especially threatened by the rise of autonomous agents. After leaving DoorDash, where he led more than 200 engineers, Zhu founded [Reevo](https://reevo.ai/)[,](https://reevo.ai/see-reevo-p1) an AI platform that automates corporate sales and marketing teams.

"Unless they make a stark, 180-degree pivot to rebuild the exact same thing from scratch, they're going to slowly fail," Zhu said. "What that means is that investors would rather just bet on new entrepreneurs at lower valuations rather than double down on older startups." #idea search for SaaS companies

<a id="model-prompt"></a>

## Initial model request


Model objective: analyze possible consequences and scenarios raised by https://garymarcus.substack.com/p/breaking-openais-unraveling-has-begun

Initial proposal: include model quality and token cost. Some local models can already perform simple tasks; an OpenAI bankruptcy could push workloads toward local or private open-weight models. Token costs could also decline.

## model 1


The proposed model is broader than "probability OpenAI goes bankrupt." We should model how AI workloads migrate between frontier APIs, cheaper APIs, hosted open-weight models, and local models as quality and cost change.

Marcus's article gives us a trigger, not yet a conclusion. The underlying reported facts are that OpenAI's Q2 revenue rose 18% to \(6.7B while losses worsened; Marcus interprets this, the IPO pressure, and the training pause as signs of an emerging financial problem. ([Gary Marcus](https://garymarcus.substack.com/p/breaking-openais-unraveling-has-begun "BREAKING: OpenAI's unraveling has begun - by Gary Marcus")) OpenAI had already reportedly burned \)3.7B in Q1. ([Reuters](https://www.reuters.com/business/openai-burned-37-billion-first-quarter-2026-information-reports-2026-06-16/ "OpenAI burned $3.7 billion in first quarter of 2026, The Information reports | Reuters")) We should therefore keep "observations" and "Marcus hypothesis" separate in the model.

### 1. The fundamental unit should be a task


For task class (i) and model (m), define:

```text
expected_cost(model, task) =
    inference_cost(model, task)
  + (1 - quality(model, task)) * failure_loss(task)
  + latency_cost(model, task)
  + privacy_cost(model, task)
  + operations_cost(model, task)
```


Where:

- `Q(model, task)` = probability the task is completed acceptably.
- `failure_loss(task)` = economic cost of a bad result.
- inference cost = input tokens × input price + output tokens × output price.
- privacy cost captures sending sensitive data externally.
- ops cost is especially important for self-hosted models.

Then route a task to:

```text
selected_model(task) = model with the lowest expected_cost(model, task)
```


subject to:

```text
quality(model, task) >= minimum_quality(task)
```


This formalizes the initial proposal.

A local model doesn't need to become as good as GPT-5.6 Sol. It only needs to become good enough for a particular workload.

For example, suppose:

> "Classify this support ticket" requires 97% acceptable outputs.

Once a local 8B/20B/30B model gets to 98%, additional frontier quality has almost no economic value for that task. The task moves local if its total cost is lower.

There is already evidence for this effect. Specialized sub-3B open-weight models can perform well on narrow structured tasks after adaptation, and one recent study saw improvements of 19-27 percentage points from lightweight fine-tuning. ([arXiv](https://arxiv.org/abs/2607.16202 "[2607.16202] Democratizing AI with Small Language Models: Structured Benchmarking and Parameter-Efficient Fine-Tuning for Local Deployment")) On a much harder financial-document benchmark, an open-weight model ranked third among twenty tested models. ([arXiv](https://arxiv.org/abs/2608.08634 "[2608.08634] Can Open-Weight Models Compete on Financial Text Comprehension?"))

### 2. Split workloads into a few classes


Proposed v0: use five workload classes rather than hundreds of benchmarks:

|Workload|Failure cost|Quality needed|Local substitution potential|
|---|--:|--:|--:|
|Extraction / classification / formatting|Low|Medium|Very high|
|Basic writing / summarization / simple Q&A|Low-medium|Medium|High|
|RAG / business workflows / routine coding|Medium|High|High|
|Complex coding / analysis / agents|High|Very high|Medium|
|Frontier reasoning / research / high-stakes work|Very high|Frontier|Low initially|

Each class gets its own `Q(model, task)`.

This avoids the misleading statement that "model A is 80% as good as model B." A 20B local model might be effectively 100% as useful as Sol for extraction and only 40% as useful for a difficult autonomous coding task.

### 3. Cost needs four supply categories


At minimum:

```text
model categories = {
  frontier proprietary,
  cheap proprietary,
  hosted open-weight,
  local/private
}
```


This matters because OpenAI itself is already price-segmenting heavily. GPT-5.6 Luna is currently \(0.20/M input and \)1.20/M output versus \(5/M and \)30/M for Sol. ([OpenAI Developers](https://developers.openai.com/api/docs/pricing "Pricing | OpenAI API"))

Meanwhile DeepSeek V4-Flash was recently priced at \(0.14/M input and \)0.28/M output. Reuters reports that its average benchmark-test inference cost was about \(0.03 versus \)1.86 for GPT-5.6 Sol. ([Reuters](https://www.reuters.com/business/retail-consumer/alibaba-unveils-its-most-capable-ai-model-date-not-far-behind-moonshots-size-2026-02-03/ "Alibaba unveils its largest AI model yet, DeepSeek's latest model is ultra-low cost | Reuters"))

So we already have a large price/quality curve:

```text
cheap local
  -> cheap hosted open-weight
  -> cheap proprietary
  -> frontier
```


The economically interesting question is how that curve moves.

### 4. Local inference needs a different cost equation


Local tokens aren't free.

Proposed cost model:

```text
local_cost =
  (hardware_cost / hardware_lifetime
   + electricity_cost
   + operations_cost
   + idle_capacity_cost)
  / tokens
```


plus the expected error cost.

Utilization is critical.

A \(3,000-\)10,000 GPU sitting idle can be much more expensive than Luna. A heavily utilized GPU can become extremely cheap.

One 2026 study measured electricity-only inference around \(0.001-\)0.04/M tokens and estimated consumer hardware could break even against API use within months at sufficiently high volume. ([arXiv](https://arxiv.org/abs/2601.09527 "[2601.09527] Private LLM Inference on Consumer Blackwell GPUs: A Practical Guide for Cost-Effective Local Deployment in SMEs"))

So we need:

```text
local_cost = f(GPU price, utilization, watts, model, quantization)
```


rather than assuming a constant local token price.

### 5. Then model technological progress


For every model category:

```text
quality(model, task, time)
```


and

```text
price(model, time)
```


change over time.

One useful representation for open weights is:

```text
quality(open-weight, task, time)
  ~= quality(frontier, task, time - quality_lag(task))
```


where `quality_lag(task)` is the "open-weight lag."

That lag might be:

- 18 months for difficult agentic reasoning;
- 6 months for routine coding;
- close to zero for extraction/classification.

The single most important variable in our simulation might therefore be:

```text
quality_lag(task, time)
```


If frontier models keep improving but open weights remain 18-24 months behind, frontier labs retain significant pricing power.

If that lag falls toward 3-6 months, the industry economics change drastically.

### 6. Token prices create a feedback loop


Proposed explicit variables:

```text
price(model, time + 1) = price(model, time) * (1 - annual_price_decline(model))
```


where `annual_price_decline(model)` is the annual price decline.

But falling token prices don't necessarily reduce revenue.

Cheaper inference creates more usage:

```text
demand(task, time) =
  initial_demand(task)
  * (1 + growth_rate(task)) ^ time
  * (price(task, time) / initial_price(task)) ^ (-price_elasticity(task))
```


where `price_elasticity(task)` is price elasticity.

This gives us two very different futures.

If:

```text
price elasticity > 1
```


a 50% price reduction can generate enough additional AI usage to increase revenue.

If:

```text
price elasticity < 1
```


commoditization destroys revenue faster than demand grows.

Proposal: treat price elasticity as another first-class parameter.

### 7. OpenAI needs its own financial state


Then put OpenAI on top of the workload market:

```text
cash(time + 1) =
    cash(time)
  + revenue(time)
  - inference_cost(time)
  - research_and_development(time)
  - sales_general_and_administrative_cost(time)
  - capital_expenditure(time)
  + financing(time)
```


And:

```text
revenue(time) = sum over all task classes of:
  demand(task, time)
  * OpenAI_share(task, time)
  * OpenAI_price(task, time)
```


The important feedback becomes:

```text
open models improve
  -> low-value tasks migrate
  -> pricing pressure
  -> gross profit pressure
  -> less cash / more financing required
```


Potentially followed by:

```text
lower R&D
  -> smaller frontier advantage
  -> more migration
```

That's the possible "unraveling" loop we actually want to test.

It may turn out to be weak. It may also turn out to be strongly self-reinforcing.

### 8. "OpenAI bankruptcy" should not mean "GPT disappears"


Proposed state variables:

```text
corporate survival
API survival
model availability
frontier research continuity
```


OpenAI could restructure, get acquired, recapitalize, cut frontier research, or sell assets while its models and API keep operating.

So a corporate failure might result in:

> Microsoft/SoftBank/another party obtains or funds the assets -> API continues -> prices change -> research spending falls.

That's very different from:

> OpenAI shuts down -> API disappears overnight.

The latter should probably be an extreme scenario, not our default bankruptcy outcome.

<a id="9-i-would-start-with-five-scenarios"></a>

### 9. Proposed starting scenarios


|Scenario|Main mechanism|Expected direction|
|---|---|---|
|Frontier recovery|New models create enough economic value to support premium prices|OpenAI survives; local handles simple tasks|
|Managed commoditization|Token prices fall while demand grows quickly|Providers survive on huge volumes|
|Open-weight acceleration|Quality lag collapses|Local/private captures simple + medium workloads|
|OpenAI restructuring|OpenAI financing fails but assets remain valuable|Ownership changes; APIs largely survive|
|AI capital shock|OpenAI problems damage confidence in the whole AI investment chain|Capex falls, frontier progress slows, local/open-weight importance rises|

The last one is close to the systemic consequence Marcus raises. His article explicitly suggests that an OpenAI failure could spread beyond the company. ([Gary Marcus](https://garymarcus.substack.com/p/breaking-openais-unraveling-has-begun "BREAKING: OpenAI's unraveling has begun - by Gary Marcus"))

<a id="10-the-output-i-want-from-the-model"></a>

### 10. Proposed model outputs


Proposed monthly outputs for, say, 2026-2031:

```text
frontier_quality(task)
open_weight_quality(task)
frontier_price
cheap_model_price
local_cost
local_share(task)
OpenAI_share(task)
OpenAI_revenue
OpenAI_cash_burn
OpenAI_survival_probability
```


Then we can plot things like:

**% of economically useful AI workloads that can run locally**

and

**quality-adjusted cost per task**

over time.

That is much more informative than "tokens cost $X."

Conceptual hypothesis to test:

```text
future AI economics ~= f(
  quality threshold crossing,
  open-weight lag,
  cost decline,
  demand elasticity,
  capital availability
)
```


OpenAI's financial health becomes an endogenous result of those variables, rather than the assumption driving the model.

One possibility from the initial proposal: **OpenAI can fail while AI becomes cheaper and more available.** In that scenario, there is a short-term disruption in frontier capability, followed by rapid migration toward local/private/open-weight systems. The aggregate availability of AI doesn't collapse; the ownership and economics of inference change.

Proposed next step: turn this into a small simulator with ~20 parameters and monthly timesteps, starting with 2026 values and running Monte Carlo scenarios through 2031. Then we can change assumptions like "open-weight lag = 12 -> 3 months" or "token costs fall 60%/year" and see what happens to local-model share and OpenAI's finances.

## Addition with Qwen


Working assessment: Qwen3.8-27B is a significant data point for this model.

It was released on August 14, 2026 as a 27B dense, Apache-2.0 open-weight model with a native 262k context window. It is explicitly trained for coding, tool use, and long-horizon agent tasks. ([Hugging Face](https://huggingface.co/Qwen/Qwen3.8-27B "Qwen/Qwen3.8-27B · Hugging Face"))

The official coding results are unusually strong:

|Benchmark|Qwen3.8-27B|Opus 4.6 Max|
|---|--:|--:|
|Terminal-Bench 2.1|73.0|78.2|
|SWE-bench Pro|**61.7**|53.4|
|NL2Repo|42.3|47.6|
|DeepSWE 1.1|42.2|--|
|QwenSWEBench|**79.0**|63.8|
|LiveCodeBench v6|**90.3**|88.8|

And on agent tasks:

|Benchmark|Qwen3.8-27B|Opus 4.6 Max|
|---|--:|--:|
|CoWorkBench|**70.7**|68.2|
|OSWorld-Verified|**84.3**|72.7|
|AndroidWorld|**81.9**|62.0|
|SWE-MM|**38.6**|27.1|

Those are Alibaba/Qwen evaluations, so the absolute comparison with Opus should be treated as unsettled. Some benchmarks are also Qwen's own internal benchmarks. ([Hugging Face](https://huggingface.co/Qwen/Qwen3.8-27B "Qwen/Qwen3.8-27B · Hugging Face"))

There is, however, already independent evidence that this isn't purely benchmark marketing. Artificial Analysis gives Qwen3.8-27B an Intelligence Index score of **52**, ranking it #1 in its comparison class on their current page. Their index includes Terminal-Bench, SciCode, agentic banking, long-context and other evaluations. ([Artificial Analysis](https://artificialanalysis.ai/models/qwen3-8-27b "Qwen3.8 27B - Intelligence, Performance & Price Analysis")) Independent agent-specific replication is still thin because the weights have only been out for five days.

The local deployment part is especially relevant to our model. Simon Willison ran a ~17 GB Q4_K_M quantization locally on an M5 Max MacBook Pro and DGX Spark. He reported roughly 15-30 tokens/s. His main problem was excessive reasoning: the default `xhigh` setting can consume tens of thousands of reasoning tokens, making trivial tasks very slow. Qwen exposes `low`, `medium`, and `xhigh` reasoning levels, so this is partly a routing/configuration issue. ([Simon Willison's Weblog](https://simonwillison.net/2026/Aug/16/qwen-38-27b/ "Qwen 3.8 27B is excellent, but it defaults to wildly overthinking things"))

This changes one of our assumptions substantially.

Previously we had something like:

```text
local -> simple tasks
```


Qwen3.8-27B suggests:

```text
local 27B ->
  simple tasks: clearly
  routine coding: clearly
  repo-level coding: often
  terminal agents: often
  computer-use agents: plausibly
  hard frontier coding: still mixed
```


That is a much bigger economic threat to frontier API pricing.

Proposed simulator refinement: change the workload buckets. Instead of assuming local models mainly capture "cheap/simple" inference, give them a growing share of **high-token agentic workloads**.

That matters because agent workflows can consume enormous numbers of tokens. Migrating a classification request from OpenAI to local saves little in absolute dollars. Migrating a coding agent that runs for 30 minutes, reads a repository, invokes tools repeatedly and generates 100k+ tokens can save much more.

Proposed additional parameter:

```text
local_agent_quality(time)
```


and specifically track the threshold:

```text
frontier_equivalence_date =
  first date a locally runnable model reaches acceptable agent quality
```


Qwen3.8-27B suggests that date may effectively be **2026**, at least for a meaningful subset of coding and computer-use tasks.

And there's an important second variable:

```text
cost_per_successful_task =
  (inference cost + hardware cost) / P(task succeeds)
```


because Qwen's tendency to overthink means "free local tokens" can still have high latency and GPU cost. A 27B local model consuming 30k reasoning tokens to accomplish something a frontier API does in 5k tokens changes the comparison.

Proposed revision to the OpenAI scenario model: make **open-weight agent quality** one of the top 3 variables, alongside frontier/open-weight quality lag and inference cost decline. Qwen3.8-27B is evidence that the quality lag for coding agents may already be much shorter than the 12-18 months proposed earlier.

## another one about token cost


Proposed forecast for engineering and architecture planning, as of August 2026:

|Metric|~12 months|~24 months|Confidence|
|---|--:|--:|---|
|Raw API price for economy/mid-tier tokens|~1.5-2× cheaper|~2-4× cheaper|High|
|Cost to get a fixed 2026 level of model quality|~5-10× cheaper|~20-50× cheaper|Medium|
|Cost per successful bounded agent task|~2-5× cheaper|~5-15× cheaper|Medium|
|Frontier-model $/token|~flat to 2× cheaper|~1.5-4× cheaper|Low/medium|
|Agent task-length capability|~3× longer|~10× longer if trend holds|Low/medium|

The distinction between the first two rows is important. A 2026 study of inference pricing finds economy-tier prices roughly halving every 1.1 years and mid-tier prices every 1.55 years. But the cost of obtaining a fixed level of intelligence has historically fallen much faster: roughly 5-10× per year in one large study, while Epoch AI measured even larger drops for some benchmarks and explicitly cautioned that the fastest rates probably won't persist. ([arXiv](https://arxiv.org/abs/2603.28576 "Tiered Super-Moore's Law: Price Evolution, Production Frontiers, and Market Competition in Large Language Model Inference Services"))

For agents, the proposed budget is more conservative. Reasoning models can consume radically different amounts of thinking tokens for the same task; one 2026 study found that the model with the lower listed price ended up more expensive in 21.8% of model comparisons, with reversals as large as 28×. So **cost per successful task** is becoming the useful metric, not $/million tokens. ([arXiv](https://arxiv.org/abs/2603.23971 "The Price Reversal Phenomenon: When Cheaper Reasoning Models End Up Costing More"))

### Open-weight quality


The open/closed distinction is already much smaller than it was a year ago. Artificial Analysis currently gives Claude Opus 5 a score of 63 and the leading open-weight Kimi K3 a 60. Qwen3.8 2.4T scores 58, DeepSeek V4 Pro 53, and even the open Qwen3.8 27B scores 52. ([Artificial Analysis](https://artificialanalysis.ai/models "Comparison of AI Models across Intelligence, Performance, and Price"))

My forecast is therefore:

**By mid/late 2027:** top open-weight models will probably be good enough to reproduce today's frontier quality for nearly all text, coding, tool-use, RAG, and structured workflow use cases. They will likely remain somewhat behind the _2027_frontier on the hardest long-horizon and reliability-sensitive tasks.

**By 2028:** I expect choosing proprietary frontier models for every call to look unusual. A common architecture will be cheap/open models for most calls, with a frontier model used as an escalation path when confidence is low or a task is unusually difficult. The remaining proprietary advantage will increasingly be measured in reliability per task, latency, multimodal integration, and very long autonomous execution.

There is already evidence for this routing architecture. Sub-32B open models reached roughly GPT-5-level aggregate intelligence earlier this year; the remaining weakness was disproportionately factual knowledge and hallucination avoidance. That means small models are especially attractive where the workflow supplies the facts through retrieval, tools, databases, or deterministic APIs. ([Artificial Analysis](https://artificialanalysis.ai/articles/sub-32b-open-weights "Sub-32B Open Weights"))

### By use case


**Extraction, classification, transformation, summarization, basic RAG.** I expect these to become almost commodity inference. Small open models should cover the overwhelming majority of production workloads. Token cost will often become smaller than retrieval, storage, observability, and engineering costs. Reasoning mode usually won't be economical here; Artificial Analysis already finds large token reductions from switching small models from reasoning to non-reasoning modes with relatively modest quality loss. ([Artificial Analysis](https://artificialanalysis.ai/articles/sub-32b-open-weights "Sub-32B Open Weights"))

**LLM-based application workflows.** Think routing, generating queries, interpreting API responses, producing structured JSON, evaluating intermediate results, and similar steps. This is probably the category where costs fall fastest because each step can use a model matched to its difficulty. The forecast is for a 2027 workflow to use small 3-30B-active-parameter models for most steps and reserve a large reasoning model for planning or recovery. Current open models are already moving strongly toward sparse mixture-of-experts designs with very few active parameters relative to total model size. ([Artificial Analysis](https://artificialanalysis.ai/models/open-source "Comparison of Open Source AI Models across Intelligence, Performance, Price, Context Window, and more | Artificial Analysis"))

**Agentic SaaS/business workflows.** Open weights are already competitive at the frontier. Kimi K3 currently ranks first on Artificial Analysis's AutomationBench-AA and second on its long-horizon knowledge-work benchmark. ([Artificial Analysis](https://artificialanalysis.ai/articles/kimi-k3-achieves-3-in-the-artificial-analysis-intelligence-index-comparable-to-opus-4-8-and-gpt-5-5 "Kimi K3 achieves #3 in the Artificial Analysis Intelligence Index, comparable to Opus 4.8 and GPT-5.5")) The problem is economics: on that knowledge-work benchmark, Kimi K3 averages 83 turns, about 120k output tokens and **$10.57 per completed benchmark task**. ([Artificial Analysis](https://artificialanalysis.ai/articles/kimi-k3-agentic-knowledge-benchmark "Kimi K3: second only to Fable 5 on AA-Briefcase")) This is why I expect agent optimization over the next two years to focus heavily on reducing turns, context, retries, and unnecessary reasoning.

**Coding agents.** Open-weight models should be one of the earliest categories to reach practical parity. Current Terminal-Bench v2.1 leaders are still proprietary, around 89%, but open models are progressing quickly and the aggregate gap is already small. ([Artificial Analysis](https://artificialanalysis.ai/evaluations/terminalbench-v2-1 "Terminal-Bench v2.1 Benchmark Leaderboard | Artificial Analysis")) For a software organization, the forecast is that the economically optimal setup may become multiple inexpensive open-model workers handling well-specified coding jobs, with a stronger model invoked for ambiguous debugging, architecture, large refactors, or failed attempts.

**Long-running autonomous agents.** Extrapolation needs caution here. METR continues to find approximately a seven-month doubling in the human-equivalent length of software/research tasks that frontier agents can complete at 50% reliability. Mathematically, that is about **3.3× more task horizon per year** and ~11× over two years if the trend continues. ([METR](https://metr.org/blog/2026-1-29-time-horizon-1-1/ "Time Horizon 1.1")) But METR says measurements above 16 hours are currently unreliable, and the benchmark consists mostly of clean, verifiable software/ML/security tasks. Real organizational work is messier. ([METR](https://metr.org/time-horizons/ "Task-Completion Time Horizons of Frontier AI Models - METR")) The forecast allows for large gains without predicting literally that a 2028 agent can autonomously operate a project for weeks.

**High-trust factual work.** This will lag. Smaller open models can have impressive reasoning/agent scores while remaining substantially worse at factual recall and hallucination avoidance. ([Artificial Analysis](https://artificialanalysis.ai/articles/sub-32b-open-weights "Sub-32B Open Weights")) Retrieval, citations, deterministic checks and domain-specific verification will therefore remain useful even after general benchmark parity.

<a id="what-i-would-design-around"></a>

### Proposed design assumptions


The economically important change is likely to be:

`one expensive frontier call`

-> `many cheap specialized calls + occasional frontier escalation`

Proposed metric for agent systems in particular:

`$/successful task = input + cached context + reasoning + output + retries + tool costs`

rather than model price alone. Artificial Analysis now explicitly measures cost per task this way, including cache, reasoning and answer tokens. ([Artificial Analysis](https://artificialanalysis.ai/models "Comparison of AI Models across Intelligence, Performance, and Price"))

Caching will be especially important for agents. DeepSeek's current V4 Pro, for example, has a nominal \(1.32/M input and \)3.96/M output price according to Artificial Analysis, but its cache-heavy blended rate is about $0.69/M. DeepSeek also now supports a 1M-token context and configurable reasoning effort specifically aimed at agent workloads. ([Artificial Analysis](https://artificialanalysis.ai/models/deepseek-v4-pro "DeepSeek V4 Pro 0813 (max)"))

So for planning purposes, my central expectation is: **by 2027, model intelligence itself will rarely be the bottleneck for ordinary LLM workflows. Agent reliability and total tokens consumed per completed task will become the dominant optimization problems. Open weights will handle most volume, while frontier APIs handle the difficult tail.**

## Library sources


- [Kleijnen 2015](/sources/research-methods/modeling-and-simulation/kleijnen-2015-design-and-analysis-of-simulation-experiments.pdf.enc), *Design and Analysis of Simulation Experiments*
- [Kleijnen 2017](/sources/research-methods/modeling-and-simulation/kleijnen-2017-design-analysis-simulation-experiments-tutorial.pdf.enc), *Design and Analysis of Simulation Experiments: Tutorial*
- [Law 2015](/sources/research-methods/modeling-and-simulation/law-2015-simulation-modeling-and-analysis.pdf.enc), *Simulation Modeling and Analysis*
- [Sokolowski and Banks 2010](/sources/research-methods/modeling-and-simulation/sokolowski-2010-modeling-and-simulation-fundamentals.pdf.enc), *Modeling and Simulation Fundamentals*
