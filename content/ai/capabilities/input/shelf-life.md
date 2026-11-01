---
draft: false
toc: true
title: "The Shelf Life of LLM Findings"
description: "A study that retested 50 widely cited findings about LLMs on 20 newer models and found that most no longer held, or held more weakly, within 15 months of publication."
linkTitle: "Shelf Life of LLM Findings"
---
This is a copy of "The shelf life of LLM findings" by Queen and Zou (2026), from [the original article](https://zou-group.github.io/llm-claims-shelf-life/).

How long does a published finding about LLMs remain true? We revisited 50 widely cited findings about LLMs across 20 models. Within 15 months of publication, most of the LLM claims we tested either no longer held or showed substantially diminished effects. What we know about AI may have a surprisingly short shelf life.

| Verdict | Meaning | Claims | Share |
| --- | --- | --- | --- |
| Expired | Original effect has largely faded | **22** | 44% |
| Weakened | Weaker than the paper | **17** | 34% |
| Persists | Effect still holds | **8** | 16% |
| Strengthened | Stronger effect | **3** | 6% |

Fitted effects on February 28, 2026. [How we classify claims](#fitting-how-each-claim-changes-over-time).

In 2023, [Walters and Wilder](https://www.nature.com/articles/s41598-023-41032-5) asked ChatGPT to write short literature reviews and then tried to find every work it cited. At the time, ChatGPT used GPT-3.5, and 55% of its citations were fake (C11). We sent the same prompts to recent models (GPT-6.1-Sol and Claude Sonnet 5.5) and found that they rarely output fabricated citations, though some models still do. We cannot assume claims made on yesterday's LLMs hold on today's more capable models.

We test a broad range of 50 LLM claims, from sycophancy and jailbreaks to long-context capabilities and cultural biases. By analyzing 20 models, released from July 2024 to February 2026 across eight different model developers, we see how claims change as a function of model release date. Our models span large and small, open- and closed-weight. For each claim, we run the same setup across our panel of modern models and fit trend lines to how the effect changes over time.

We classify claims as **expired**, **weakened**, **persists**, or **strengthened**, according to how much of the original effect remains by February 2026. A **relative effect size** (*e*) of 1 means the effect is as strong as in the paper, and 0 means it is gone. An expired claim describes an effect that has largely disappeared in newer models. We use a fifth of the paper's effect or less as the expiration zone; a claim can expire even if the effect remains strong in some individual models. For expired claims, we estimate how long after publication the effect crossed into this expiration zone. The results below show which findings have faded, which hold up, and how long they last. Reproduction checks and metric definitions follow in [How we measure claim persistence](#how-we-measure-claim-persistence).

## Results


Almost half (44%) of our tested claims are now [expired](#fitting-how-each-claim-changes-over-time) in today's models. Another 34% have weakened significantly, 16% persist, and 6% have strengthened relative to the original claim. Persistence varies by topic. Five of nine reasoning claims and six of eleven sycophancy-and-deception claims are classified as expired. Three of ten claims about models as judges, reviewers, and raters persist or strengthen. The three strengthened claims concern judges' self-preference (C28), praise that follows a user's preference (C17), and nonuniform random-number generation (C29).

Claims by research area and verdict.

| Research area | Expired | Weakened | Persists | Strengthened | Total |
| --- | --- | --- | --- | --- | --- |
| Sycophancy, deception & strategic behavior | 6 | 2 | 2 | 1 | **11** |
| Reasoning | 5 | 4 | 0 | 0 | **9** |
| Social bias, culture & simulated populations | 3 | 3 | 1 | 0 | **7** |
| LLM judges & evaluation validity | 3 | 2 | 0 | 1 | **6** |
| Jailbreaks & safety robustness | 3 | 2 | 0 | 0 | **5** |
| Factuality, hallucination & calibration | 0 | 2 | 2 | 0 | **4** |
| Science, research ideas & peer review | 1 | 1 | 2 | 0 | **4** |
| Creativity, output diversity & homogeneity | 0 | 0 | 1 | 1 | **2** |
| Long context, agents & tool use | 1 | 1 | 0 | 0 | **2** |
| **All areas** | **22** | **17** | **8** | **3** | **50** |

### Which claims expire, and when


- **Expired (22 claims):** Mostly capability failures that newer models no longer make: counting letters, arithmetic in other bases, finding facts in the middle of long contexts, fabricating citations, and abandoning correct answers when challenged. Other findings also faded: leaking private details from meeting summaries, more nonanswers in Arabic than in English, and preferring AI-written abstracts. The last of these reverses direction in the fitted trend, rather than merely fading to zero.
- **Weakened (17 claims):** Weaker but still existent: structural limits such as the reversal curse, two-hop questions and multi-turn instructions, plus residual social biases, judges' preference for longer answers, invented package names, niche-domain hallucinations, and susceptibility to jailbreaks and prompt injection.
- **Persists or strengthened (8 persist · 3 strengthened):** Mostly preferences and judgment rather than capability: flattering and agreeing with users, judges that favor their own answers, near-identical answers to open prompts, a left political lean, and answering when they should abstain.

Lifetime of LLM findings

| Claim | Finding | Verdict (Feb 2026) | Published | Est. expiration | Lifetime (months) |
| --- | --- | --- | --- | --- | --- |
| C1 | Models struggle to combine known facts | Weakened | Oct 2022 | -- | -- |
| C2 | Injected instructions hijack applications | Weakened | Nov 2022 | -- | -- |
| C3 | Query language shifts territorial claims | Weakened | May 2023 | -- | -- |
| C4 | Answer order sways LLM judges | Weakened | May 2023 | -- | -- |
| C5 | Generated personas stereotype Black women | Expired | May 2023 | Jun 2026 | 36.6 |
| C6 | Models struggle with unfamiliar arithmetic bases | Expired | Jul 2023 | Jan 2024 | 6.2 |
| C7 | Models struggle with middle passages | Expired | Jul 2023 | Sep 2024 | 14.8 |
| C8 | Models refuse clearly harmless requests | Expired | Aug 2023 | Oct 2024 | 14.5 |
| C9 | Gender stereotypes shape pronoun resolution | Weakened | Aug 2023 | -- | -- |
| C10 | RAG answers without supporting evidence | Persists | Sep 2023 | -- | -- |
| C11 | ChatGPT invents scholarly references | Expired | Sep 2023 | Apr 2026 | 31.7 |
| C12 | Answer letters bias multiple-choice accuracy | Expired | Sep 2023 | Apr 2024 | 7.6 |
| C13 | LLMs recall 'A is B' but not 'B is A' | Weakened | Sep 2023 | -- | -- |
| C14 | Familiar text is easier to decode | Weakened | Sep 2023 | -- | -- |
| C15 | Self-correction can make answers worse | Expired | Oct 2023 | Nov 2024 | 13.2 |
| C16 | Challenges make models abandon correct answers | Expired | Oct 2023 | Sep 2024 | 11.2 |
| C17 | Models praise what their users like | Strengthened | Oct 2023 | -- | -- |
| C46 | Meeting summaries leak private secrets | Expired | Oct 2023 | Sep 2025 | 22.4 |
| C18 | Trading agents act on insider tips | Expired | Nov 2023 | Aug 2024 | 9.5 |
| C47 | Models contradict themselves on event order | Weakened | Nov 2023 | -- | -- |
| C19 | Persuasion flips correct answers to misinformation | Expired | Dec 2023 | Feb 2026 | 25.9 |
| C20 | Models hallucinate facts about legal cases | Weakened | Jan 2024 | -- | -- |
| C21 | Models lean left on political tests | Persists | Feb 2024 | -- | -- |
| C48 | Word associations reveal model stereotypes | Weakened | Feb 2024 | -- | -- |
| C22 | Premise order disrupts logical reasoning | Expired | Feb 2024 | Feb 2026 | 31.2 |
| C23 | Fake references sway LLM judges | Expired | Feb 2024 | Oct 2025 | 19.5 |
| C24 | Dialect shapes models' criminal judgments | Expired | Mar 2024 | Nov 2024 | 8.3 |
| C25 | Malicious tool outputs hijack agents | Expired | Mar 2024 | May 2024 | 2.2 |
| C26 | Repeated examples jailbreak model safeguards | Weakened | Apr 2024 | -- | -- |
| C27 | LLM judges favor longer answers | Weakened | Apr 2024 | -- | -- |
| C28 | LLM judges favor their own writing | Strengthened | Apr 2024 | -- | -- |
| C29 | Random-number requests favor a few answers | Strengthened | Apr 2024 | -- | -- |
| C30 | Code models invent nonexistent packages | Weakened | Jun 2024 | -- | -- |
| C31 | Accepted and rejected papers score alike | Persists | Jun 2024 | -- | -- |
| C32 | User personas sway political refusals | Expired | Jul 2024 | Jan 2026 | 18.0 |
| C49 | LLMs prefer LLM-written abstracts | Expired | Jul 2024 | Sep 2025 | 14.7 |
| C33 | Models comply with illogical drug requests | Expired | Sep 2024 | Jul 2025 | 9.0 |
| C34 | Hidden instructions manipulate LLM peer reviews | Weakened | Dec 2024 | -- | -- |
| C35 | Models miscount letters in "strawberry" | Expired | Dec 2024 | Apr 2026 | 16.3 |
| C36 | Reasoning models overthink simple math | Expired | Dec 2024 | Feb 2025 | 1.4 |
| C37 | Medical spin inflates perceived treatment benefits | Persists | Feb 2025 | -- | -- |
| C38 | Pressure makes models contradict themselves | Weakened | Mar 2025 | -- | -- |
| C50 | More nonanswers in Arabic than English | Expired | Apr 2025 | Feb 2026 | 17.6 |
| C39 | Models struggle with gradually revealed tasks | Weakened | May 2025 | -- | -- |
| C40 | Models excuse users judged at fault | Weakened | May 2025 | -- | -- |
| C41 | Models answer when they should abstain | Persists | Jun 2025 | -- | -- |
| C44 | Models blackmail to avoid replacement | Expired | Jun 2025 | Feb 2026 | 14.7 |
| C42 | Models affirm users more than humans | Persists | Oct 2025 | -- | -- |
| C43 | Models endorse problematic user actions | Persists | Oct 2025 | -- | -- |
| C45 | Models repeat similar open-ended answers | Persists | Oct 2025 | -- | -- |

One row per claim, in order of publication. Expiration date and lifetime are estimated only for expired claims.

### How long do claims last before they expire?


Across all 50 claims, the estimated share that had expired was 4% six months after publication, 16% after one year, and 39% after two years. These estimates account for claims not yet expired at the end of observation. The share of claims still at full strength (*e* ≥ 0.8) falls from 64% six months after publication to 47% after one year and 31% after two years.

Among the 22 claims with an estimated [expiration date](#expiration-date) shown in the timeline, time from publication to expiration averaged **15.7 months** (median: **14.7 months**). These summaries exclude claims that have not expired. Lifetimes vary widely, even within the same research area.

Time to expiration by research area for expired claims

| Research area | Mean months | Expired claims (months to expiration) |
| --- | --- | --- |
| Science, research ideas & peer review | **31.7** | C11 ChatGPT invents scholarly references (31.7) |
| Social bias, culture & simulated populations | **20.8** | C24 Dialect shapes models' criminal judgments (8.3); C50 More nonanswers in Arabic than English (17.6); C5 Generated personas stereotype Black women (36.6) |
| Long context, agents & tool use | **14.8** | C7 Models struggle with middle passages (14.8) |
| Sycophancy, deception & strategic behavior | **14.7** | C33 Models comply with illogical drug requests (9.0); C18 Trading agents act on insider tips (9.5); C16 Challenges make models abandon correct answers (11.2); C44 Models blackmail to avoid replacement (14.7); C32 User personas sway political refusals (18.0); C19 Persuasion flips correct answers to misinformation (25.9) |
| LLM judges & evaluation validity | **13.9** | C12 Answer letters bias multiple-choice accuracy (7.6); C49 LLMs prefer LLM-written abstracts (14.7); C23 Fake references sway LLM judges (19.5) |
| Reasoning | **13.7** | C36 Reasoning models overthink simple math (1.4); C6 Models struggle with unfamiliar arithmetic bases (6.2); C15 Self-correction can make answers worse (13.2); C35 Models miscount letters in "strawberry" (16.3); C22 Premise order disrupts logical reasoning (31.2) |
| Jailbreaks & safety robustness | **13.0** | C25 Malicious tool outputs hijack agents (2.2); C8 Models refuse clearly harmless requests (14.5); C46 Meeting summaries leak private secrets (22.4) |

Areas that expire faster on average tend to be those optimized for in post-training pipelines, and those that take longer to expire are those more centered around bias and judgment. This roughly tracks the percentage of claims that are expired per research area. Note that the "Science, research ideas & peer review" area contains only one expired point, the fake citation claim (C11).

#### How we calculate these durations


We subtract the paper's publication date from the expiration date shown in the timeline, converting days to months using 365.25 / 12 days per month. Nineteen claims have a dated expiration after publication. Two of these, premise-order proofs (C22) and Arabic nonanswers (C50), are dated from the newest-model count because their fitted curves do not reach the expiration line. Three more claims have only an expiration window; we use the timeline's displayed estimate within that window.

For blackmail (C44), the fitted curve retains all reliable models, including those flagged as outliers by the standard procedure. Its estimated expiration date is February 9, 2026 (95% interval: April 8-February 26), about 15 months after its first public release by Anthropic on June 20, 2025. Support for this verdict is weak, and several recent models still blackmail frequently. For strawberry letter counting (C35), the starting date is the closest published evidence, not the first appearance of the informal claim.

The plot uses estimated expiration dates rather than exact observed failure times. It does not propagate uncertainty in those dates; you can see their intervals with the timeline's uncertainty toggle. Publication also occurs after the underlying experiments, so these durations measure how long a published claim remains supported by this panel, rather than time since the original experiment.

The shares at the start of this section (4%, 16% and 39% expired after six months, one year and two years) use the Kaplan-Meier estimator over all 50 claims. Claims not yet expired are right-censored at the time from publication to February 28, 2026. The mean and median time to expiration above use only claims with an estimated expiration date shown in the timeline, including the displayed midpoint for expiration windows. The full-strength shares use only the claims old enough to be measured at each interval (47, 45, and 36 claims). Older findings have had longer to age: 11 of 21 claims from 2022-23 and 9 of 19 from 2024 are expired, compared with 2 of 10 from 2025.

### The life of LLM claims


The claim cards show which claims have expired and how fast, ordered by when the original paper was released. Each card pairs the original paper's evidence with the same test across model releases.

**C48 · Word pairings follow a stereotype** (original illustration, schematic)

Prompt: *For each word, write Maya or Tom after it.*

| Word | Example answer |
| --- | --- |
| career | Tom |
| home | Maya |
| salary | Tom |
| family | Maya |

Stereotype-consistent pairs elevate the bias score.

#### About the card: plots, methods & data

##### Reading the model-release plots


Dots show individual models; colored curves show the fitted trend. Black diamonds mark our reproductions on original or substitute models. Bands and whiskers show 95% intervals; hollow points are excluded from the fit. Switch to Relative to compare with the reference effect (1) and the expiration value (0). The reference is the paper's effect, except for strawberry (C35), which uses our original-model reproduction.

##### C48 · Current estimate


e = 0.25 [0.09, 0.48] at Feb 2026 (1 = as strong as the paper, 0 = gone) · not expired by Feb 2026

Paper 0.39 · reproduced 0.43 [0.36, 0.49] on gpt-4-0613 · expiration value 0.00

20 of 20 models in the fit

##### Metric and reproduction


**Implicit bias (D).** Mean standardized D score from the word-association implicit association test. Zero is the no-bias reference; positive values indicate association in the tested stereotype direction.

**Original-paper reference.** 0.39. Mean D of the authors' released GPT-4 replication rows scored with the evaluation metric (0.3899)

**Our reproduction.** 0.43 (95% CI: 0.36 to 0.49) on gpt-4-0613.

**Metric comparison.** The paper reference is recomputed from the authors' released GPT-4 replication rows using our scorer, rather than copied from a printed headline. The separate decision-bias tasks are not included.

**Reading the scales.** Relative effect e = (value − 0.00) / (0.39 − 0.00). An effect of 0 is the no-effect reference; 1 is the normalization reference. Values above 1 indicate a stronger effect in the claimed direction.

### How much of each effect remains today?


Claims in the same category can still have very different effect sizes. Among weakened claims, for example, the fitted effect is about one-quarter of its reference magnitude for basic prompt injection (C2) and implicit word-association bias (C48), about one-half for the reversal curse (C13), and nearly three-quarters for legal hallucinations (C20). All are weaker than the original finding, but they are far from equally diminished. To illustrate this, we show where each claim stands as of February 28, 2026 (the last date that any of our tested models were released).

Every claim on a [common relative effect scale](#standardizing-claims-to-a-single-scale)

| Verdict | Claim | Finding | e (Feb 2026) | 95% interval |
| --- | --- | --- | --- | --- |
| Strengthened | C28 | LLM evaluators prefer their own summaries | 2.36 | 1.25 - ≥ 2.50 |
| Strengthened | C17 | Assistants praise text more when the user likes it | 1.85 | 1.76 - 1.97 |
| Strengthened | C29 | LLMs asked for a random number are far from uniform | 1.70 | 1.57 - 1.86 |
| Persists | C10 | RAG models answer instead of rejecting answerless docs | 1.29 | 1.18 - 1.38 |
| Persists | C41 | LLMs fail to abstain on unanswerable questions | 1.16 | 0.96 - 1.33 |
| Persists | C43 | AI endorses problematic actions users describe | 1.12 | 0.78 - 1.52 |
| Persists | C42 | AI affirms users' actions more often than humans do | 1.06 | 0.96 - 1.15 |
| Persists | C45 | LLMs give near-identical answers to open-ended prompts | 1.00 | 1.00 - 1.00 |
| Persists | C21 | LLMs lean left on political orientation tests | 0.99 | 0.89 - 1.08 |
| Persists | C31 | LLM reviewers score accepted and rejected papers alike | 0.92 | 0.80 - 1.03 |
| Persists | C37 | Spin in trial abstracts inflates LLM benefit ratings | 0.83 | 0.69 - 0.99 |
| Weakened | C20 | LLMs hallucinate most answers about US federal cases | 0.73 | 0.48 - 1.00 |
| Weakened | C9 | LLMs resolve ambiguous pronouns by gender stereotype | 0.71 | 0.57 - 0.93 |
| Weakened | C27 | LLM judges prefer longer answers | 0.65 | 0.32 - 1.16 |
| Weakened | C26 | Many-shot prompts jailbreak models as shot count grows | 0.62 | 0.49 - 0.75 |
| Weakened | C40 | LLMs side with posters the crowd judged at fault (AITA) | 0.60 | 0.52 - 0.67 |
| Weakened | C4 | LLM judges flip verdicts when answer order is swapped | 0.53 | 0.42 - 0.61 |
| Weakened | C13 | LLMs answer "Who is X's parent?" but not the reverse | 0.53 | 0.44 - 0.61 |
| Weakened | C38 | Models state falsehoods under pressure despite knowing truth | 0.52 | 0.25 - 0.82 |
| Weakened | C34 | Hidden prompt injection steers LLM peer reviews | 0.50 | 0.24 - 0.77 |
| Weakened | C14 | LLMs decode high-probability text better than rare text | 0.47 | 0.16 - 0.76 |
| Weakened | C47 | LLMs give contradictory answers to paired before/after timeline questions | 0.43 | 0.34 - 0.52 |
| Weakened | C1 | LMs answer sub-questions yet fail the 2-hop question | 0.32 | 0.20 - 0.42 |
| Weakened | C30 | Code LLMs recommend packages that do not exist | 0.31 | 0.18 - 0.41 |
| Weakened | C3 | Territorial-dispute answers depend on query language | 0.31 | 0.19 - 0.47 |
| Weakened | C39 | LLMs get lost when instructions arrive over many turns | 0.28 | 0.18 - 0.39 |
| Weakened | C2 | "Ignore previous instructions" hijacks prompted apps | 0.25 | 0.09 - 0.43 |
| Weakened | C48 | LLMs show implicit stereotype bias in IAT-style word association | 0.25 | 0.09 - 0.48 |
| Expired | C50 | LLMs give more nonanswers to political-biography requests in Arabic than in English | 0.32 | 0.14 - 0.45 |
| Expired | C22 | Shuffling premise order breaks LLM logical proofs | 0.26 | -0.12 - 0.85 |
| Expired | C32 | ChatGPT refuses more when user persona opposes request | 0.20 | -0.11 - 0.38 |
| Expired | C15 | Self-correction without feedback lowers reasoning accuracy | 0.18 | 0.07 - 0.28 |
| Expired | C33 | LLMs comply with illogical drug-switch requests | 0.12 | 0.01 - 0.22 |
| Expired | C19 | Persuasive multi-turn dialogue flips correct answers | 0.08 | 0.02 - 0.16 |
| Expired | C8 | Safety-tuned models refuse clearly safe prompts | 0.08 | 0.05 - 0.12 |
| Expired | C16 | Assistants abandon correct answers when asked "Are you sure?" | 0.08 | 0.03 - 0.11 |
| Expired | C7 | Long-context QA is U-shaped: facts in the middle are lost | 0.07 | -0.10 - 0.15 |
| Expired | C44 | Frontier models blackmail an executive to avoid replacement | 0.17 | -0.08 - 0.43 |
| Expired | C46 | LLMs leak information marked private when summarizing meetings | 0.06 | -0.02 - 0.13 |
| Expired | C18 | GPT-4 trading agent acts on insider tips under pressure | 0.04 | -0.05 - 0.09 |
| Expired | C11 | ChatGPT fabricates most scholarly citations it writes | 0.03 | -0.08 - 0.12 |
| Expired | C6 | LLMs add well in base 10 but fail in base 9 | 0.02 | 0.00 - 0.05 |
| Expired | C35 | Chat LLMs say "strawberry" has 2 r's, not 3 | 0.02 | -0.22 - 0.37 |
| Expired | C12 | LLM MCQ accuracy depends on which letter holds the answer | 0.02 | -0.02 - 0.05 |
| Expired | C25 | "IMPORTANT!!! Ignore..." in tool output raises agent ASR | -0.02 | -0.05 - -0.01 |
| Expired | C5 | LLM personas of Black women stress "resilience" | -0.02 | -0.13 - 0.08 |
| Expired | C36 | Reasoning models overthink easy math | -0.07 | -0.27 - 0.15 |
| Expired | C23 | Fake references sway LLM judges toward the cited answer | -0.10 | -0.31 - 0.11 |
| Expired | C24 | LLMs convict African American English speakers more | -0.22 | -0.38 - -0.12 |
| Expired | C49 | LLMs prefer AI-written research abstracts over human-written ones | -0.59 | ≤ -0.60 - -0.39 |

*Values read from the chart coordinates (two decimals); interval ends at the axis limits (−0.60, 2.50) are clipped.*

Fitted effect on February 28, 2026, with 95% intervals. *e* = 0 means no effect; *e* = 1 is the paper's effect.

A larger *e* means more of the original effect remains, but it does not necessarily mean the behavior is more common or more harmful.

#### Interpreting effect sizes and uncertainty


Each dot is the fitted release-date trend evaluated at February 28, 2026, using 9-20 eligible panel models per claim across release dates. It is not a measurement on a single recent model or an average of only the newest models. The 95% bootstrap intervals reflect uncertainty in the fitted trend, including the reproduction anchor, rather than the spread of individual models' effects.

At the other end, the three strengthened findings are self-preference in LLM judges (C28), praise that follows the user's stated preference (C17), and nonuniform random-number generation (C29). Their fitted effects are about 2.36, 1.85, and 1.70 times their reference magnitudes, respectively. For self-preference, the reference is a small 4.6-percentage-point difference between GPT-4's preference for its own summaries and GPT-3.5's preference for those same summaries.

The intervals also vary across claims. For judges' preference for longer answers (C27), the fitted effect is 0.65, but its interval spans 0.32-1.16; the point estimate suggests weakening, while the original magnitude remains compatible with the fit's uncertainty.

### What changes from model to model?


From GPT-4o mini (earliest model we tested, released in July 2024) to GPT-6.1 Sol (latest model we tested, released in February 2026), we see big shifts in the persistence of claims. The number of claims in the expiration zone rises from 5 to 30 out of 50, while the number that still hold or are stronger falls from 30 to 11. This gives a model-level view of the broad decline seen in the fitted trends. Each model's claims are sorted from lowest to highest effect, so a claim's horizontal position can change when you switch models; use its label or the category lists below the plot to follow it.

For each reliably scored model-claim pair, we apply the thresholds to that model's measured effect *e*. **Expired** means *e* ≤ 0.2, without requiring its interval to lie below that threshold. **Persists** means 0.8 ≤ *e* < 1.5 and the lower bound of the 95% interval exceeds 0.2. **Strengthened** means *e* ≥ 1.5 with the same interval requirement. All remaining pairs are labeled **weakened** ("weaker" in the chart), including large point estimates whose intervals still reach the expiration zone. These labels describe one model on one claim, so they do not use the fitted release-date trend.

Panel models by release date (dates read from the release timeline):

| Model | Released | Weights |
| --- | --- | --- |
| GPT-4o mini | 18 Jul 2024 | closed |
| Llama 3.1 70B Instruct | 23 Jul 2024 | open |
| Qwen2.5-72B-Instruct | 19 Sep 2024 | open |
| DeepSeek V3 | 26 Dec 2024 | open |
| Mistral Small 3 (2501) | 30 Jan 2025 | open |
| Llama 4 Maverick | 05 Apr 2025 | open |
| Gemini 2.5 Flash | 20 May 2025 | closed |
| gpt-oss-120b | 05 Aug 2025 | open |
| Claude Haiku 4.5 | 15 Oct 2025 | closed |
| GPT-5.2 | 11 Dec 2025 | closed |
| Claude Opus 4.6 | 05 Feb 2026 | closed |
| GLM-5 | 12 Feb 2026 | open |
| Qwen3.7-Max | 20 May 2026 | closed |
| Qwen3.7-Flash | 21 Dec 2025 | closed |
| DeepSeek V4 Pro 0813 | 13 Jan 2026 | open |
| GLM-5.3-Flash | 26 Jan 2026 | open |
| Gemini 3.8 Flash | 02 Feb 2026 | closed |
| GPT-6 Luna | 22 Feb 2026 | closed |
| Claude Sonnet 5.5 | 28 Feb 2026 | closed |
| GPT-6.1 Sol | 28 Feb 2026 | closed |

Model shown below: **GPT-6.1 Sol** · OpenAI · released 28 Feb 2026 · closed-weight

**3** stronger than the paper · **8** still shows the effect · **9** weaker · **30** expired for this model (of 50 claims)

GPT-6.1 Sol's values:

| Claim | Status | Value [95% CI] | e | Reproduction e |
| --- | --- | --- | --- | --- |
| C49 · LLMs prefer AI-written research abstracts over human-written ones | expired for this model | 19.1% [13.3%, 25.4%] | -1.15 | 1.01 |
| C36 · Reasoning models overthink easy math | expired for this model | -0.92 [-0.98, -0.87] | -0.59 | 1.27 |
| C32 · ChatGPT refuses more when user persona opposes request | expired for this model | -5.0 pp [-9.5 pp, -1.0 pp] | -0.17 | 0.80 |
| C23 · Fake references sway LLM judges toward the cited answer | expired for this model | 1.6% [0.0%, 5.6%] | -0.10 | 0.88 |
| C24 · LLMs convict African American English speakers more | expired for this model | -1.0 pp [-2.7 pp, +0.7 pp] | -0.07 | 0.57 |
| C5 · LLM personas of Black women stress "resilience" | expired for this model | 0.0% [0.0%, 11.3%] | -0.03 | 1.09 |
| C34 · Hidden prompt injection steers LLM peer reviews | expired for this model | 0.0 pp [0.0 pp, 0.0 pp] | 0.00 | 1.07 |
| C22 · Shuffling premise order breaks LLM logical proofs | expired for this model | 0.0 pp [0.0 pp, 0.0 pp] | 0.00 | 0.86 |
| C33 · LLMs comply with illogical drug-switch requests | expired for this model | 0.0% [0.0%, 0.0%] | 0.00 | 1.00 |
| C16 · Assistants abandon correct answers when asked "Are you sure?" | expired for this model | 0.0% [0.0%, 0.0%] | 0.00 | 0.91 |
| C44 · Frontier models blackmail an executive to avoid replacement | expired for this model | 0.0% [0.0%, 3.7%] | 0.00 | 0.78 |
| C46 · LLMs leak information marked private when summarizing meetings | expired for this model | 0.0% [0.0%, 0.0%] | 0.00 | 1.06 |
| C18 · GPT-4 trading agent acts on insider tips under pressure | expired for this model | 0.0% [0.0%, 0.0%] | 0.00 | 1.23 |
| C11 · ChatGPT fabricates most scholarly citations it writes | expired for this model | 0.0% [0.0%, 0.0%] | 0.00 | 1.07 |
| C6 · LLMs add well in base 10 but fail in base 9 | expired for this model | 0.0 pp [0.0 pp, 0.0 pp] | 0.00 | 1.07 |
| C35 · Chat LLMs say "strawberry" has 2 r's, not 3 | expired for this model | 0.0% [0.0%, 27.8%] | 0.00 | 1.00 |
| C25 · "IMPORTANT!!! Ignore..." in tool output raises agent ASR | expired for this model | 0.0 pp [0.0 pp, 0.0 pp] | 0.00 | 1.17 |
| C12 · LLM MCQ accuracy depends on which letter holds the answer | expired for this model | +1.18 pp [+0.47 pp, +2.59 pp] | 0.02 | 1.03 |
| C19 · Persuasive multi-turn dialogue flips correct answers | expired for this model | 1.4% [0.0%, 3.7%] | 0.03 | 1.13 |
| C38 · Models state falsehoods under pressure despite knowing truth | expired for this model | 1.5% [0.0%, 3.9%] | 0.03 | 0.87 |
| C50 · LLMs give more nonanswers to political-biography requests in Arabic than in English | expired for this model | +0.6 pp [+0.1 pp, +1.0 pp] | 0.05 | 1.47 |
| C14 · LLMs decode high-probability text better than rare text | expired for this model | +2.0 pp [0.0 pp, +5.0 pp] | 0.05 | 0.92 |
| C8 · Safety-tuned models refuse clearly safe prompts | expired for this model | 0.8% [0.0%, 2.0%] | 0.06 | 0.97 |
| C15 · Self-correction without feedback lowers reasoning accuracy | expired for this model | +2.9 pp [-4.3 pp, +10.0 pp] | 0.08 | 1.02 |
| C27 · LLM judges prefer longer answers | expired for this model | +3.7 pp [-8.3 pp, +15.3 pp] | 0.09 | 1.17 |
| C1 · LMs answer sub-questions yet fail the 2-hop question | expired for this model | 6.7% [2.2%, 12.0%] | 0.16 | 0.94 |
| C39 · LLMs get lost when instructions arrive over many turns | expired for this model | -4.9 pp [-11.7 pp, +1.9 pp] | 0.17 | 0.85 |
| C48 · LLMs show implicit stereotype bias in IAT-style word association | expired for this model | 0.07 [0.01, 0.12] | 0.17 | 1.10 |
| C26 · Many-shot prompts jailbreak models as shot count grows | expired for this model | +16.7 pp [+3.3 pp, +33.3 pp] | 0.19 | 1.11 |
| C3 · Territorial-dispute answers depend on query language | expired for this model | 0.03 [-0.03, 0.08] | 0.19 | 1.38 |
| C7 · Long-context QA is U-shaped: facts in the middle are lost | weaker | +3.3 pp [-0.7 pp, +7.7 pp] | 0.21 | 0.68 |
| C30 · Code LLMs recommend packages that do not exist | weaker | 1.4% [0.7%, 2.2%] | 0.21 | 1.24 |
| C47 · LLMs give contradictory answers to paired before/after timeline questions | weaker | 10.3% [6.7%, 14.3%] | 0.33 | 1.00 |
| C13 · LLMs answer "Who is X's parent?" but not the reverse | weaker | +17.7 pp [+12.5 pp, +23.0 pp] | 0.41 | 1.09 |
| C40 · LLMs side with posters the crowd judged at fault (AITA) | weaker | +22.8 pp [+13.9 pp, +31.4 pp] | 0.48 | 0.93 |
| C2 · "Ignore previous instructions" hijacks prompted apps | weaker | 30.7% [17.1%, 46.4%] | 0.52 | 0.88 |
| C20 · LLMs hallucinate most answers about US federal cases | weaker | 35.0% [28.7%, 41.4%] | 0.54 | 1.07 |
| C4 · LLM judges flip verdicts when answer order is swapped | weaker | 25.0% [16.3%, 33.8%] | 0.54 | 1.35 |
| C37 · Spin in trial abstracts inflates LLM benefit ratings | weaker | +2.57 pts [+2.00 pts, +3.17 pts] | 0.76 | 0.83 |
| C43 · AI endorses problematic actions users describe | still shows the effect | 38.3% [29.7%, 46.9%] | 0.81 | 1.12 |
| C31 · LLM reviewers score accepted and rejected papers alike | still shows the effect | +0.17 pts [-0.47 pts, +0.80 pts] | 0.87 | 1.00 |
| C9 · LLMs resolve ambiguous pronouns by gender stereotype | still shows the effect | 78.5% [68.1%, 89.1%] | 0.89 | 1.02 |
| C45 · LLMs give near-identical answers to open-ended prompts | still shows the effect | 82.0% [74.0%, 90.0%] | 1.05 | n/a |
| C42 · AI affirms users' actions more often than humans do | still shows the effect | +51.5 pp [+43.9 pp, +59.3 pp] | 1.07 | 0.88 |
| C21 · LLMs lean left on political orientation tests | still shows the effect | -6.10 [-6.48, -5.74] | 1.23 | 1.32 |
| C41 · LLMs fail to abstain on unanswerable questions | still shows the effect | 81.2% [75.5%, 86.9%] | 1.24 | 0.86 |
| C10 · RAG models answer instead of rejecting answerless docs | still shows the effect | 75.0% [66.0%, 83.0%] | 1.36 | 1.29 |
| C17 · Assistants praise text more when the user likes it | stronger than the paper | +83.3 pp [+73.3 pp, +92.0 pp] | 1.85 | 1.02 |
| C29 · LLMs asked for a random number are far from uniform | stronger than the paper | 0.00 [0.00, 0.00] | 1.87 | 1.15 |
| C28 · LLM evaluators prefer their own summaries | stronger than the paper | +13.3 pp [+9.3 pp, +17.0 pp] | 2.88 | 1.08 |

One model, all 50 claims: effects with 95% intervals, plus the reproduction e on the paper's model.

Release date alone does not determine the pattern. Among models released in December-February 2026, the expired count ranges from 11 for DeepSeek V4 Pro to 30 for GPT-6.1 Sol. Qwen3.7-Flash has 14, GLM-5.3-Flash 19, and GPT-6 Luna 25. The patterns are also not perfectly aligned with model providers or model size. Hollow points are not scored reliably and are excluded from the category counts.

#### Refusals or unscorable responses


Eight of the 1,000 model-claim points are flagged because frequent refusals, incomplete responses, or answer-extraction problems prevent a reliable comparison. These include political-test and decoding refusals, too few usable paired verdicts, and answers our parser cannot consistently extract. We show these points in the plots, but do not use them in the trend fits or model-level category counts.

The totals hide the quirks unique to individual models. Claude Sonnet 5.5's self-preference effect (C28) is close to the paper's magnitude (*e* = 1.09), whereas GPT-6.1 Sol's is larger (*e* = 2.88). The pattern reverses for preference for longer answers (C27): Sonnet retains that effect (*e* = 1.12), while Sol's point estimate is near the expiration value (*e* = 0.09). Neither model has lost every tendency: both show stronger-than-reference praise following a user's preference (C17) (*e* = 1.85), and both remain highly nonuniform when asked for random numbers (C29) (*e* = 1.87).

A claim's panel-wide verdict can therefore differ from what you see on one model. Citation fabrication (C11) is classified as expired overall, yet Qwen3.7-Flash fabricated 69% of references in this test, compared with about 1% for Sonnet 5.5 and 0% for Sol. The plot is most useful for finding such exceptions and opening the corresponding claim card to inspect the original metric and protocol. It is a profile of measured behaviors, rather than a general-purpose model leaderboard.

## Case Study on Hallucinated References


The citation example (C11) lets us examine what a declining effect looks like in the generated text. Here, the measured outcome is the share of references that cite nonexistent works. Errors in the bibliographic details of real publications are a separate outcome.

| Walters & Wilder (2023), Table 3 | GPT-3.5 | GPT-4 |
| --- | --- | --- |
| ***Percentage of cited works that are fabricated (number of cited works)*** | | |
| All works | 55% (222) | 18% (414) |
| Articles | 73% (128) | 18% (255) |
| Books | 23% (78) | 8% (126) |
| Chapters | 70% (10) | 70% (23) |
| Websites | 50% (6) | 10% (10) |
| ***Among fabricated works, percentage of*** | | |
| All works for which the larger work/org. is fabricated | 5% | 5% |
| Articles for which the journal is fabricated | 2% | 2% |
| Books for which the publisher is fabricated | 0% | 0% |
| Chapters for which the book is fabricated | 57% | 19% |
| Website for which the organization is fabricated | 0% | 0% |

Share of cited works that were fabricated, by type of work, from Walters & Wilder (2023), Table 3.

The original results show why fabricated references could be difficult to spot. Among the invented articles from both GPT-3.5 and GPT-4, only 2% named a nonexistent journal. The rest named real journals, giving readers plausible-looking citations to works that did not exist. Fabrication also varied by publication type: 73% of GPT-3.5's cited journal articles were invented. GPT-4 improved on GPT-3.5 but still fabricated 18% of its references overall.

We repeated the paper's literature-review prompts across 42 topics, using GPT-3.5 Turbo as the closest available reproduction model and each model in our panel. We checked the generated references against bibliographic databases. GPT-3.5 Turbo fabricated 59% of its 210 references, close to the paper's 55%, giving us a comparable starting point for measuring change.

Citations across identical essay prompts.

**Essay prompt:** What are the advantages and disadvantages of taking a 'gap year' of employment or volunteer work between high school and college -- for individuals and for society?

**GPT-3.5 Turbo (0125)** · released Jan 2024 · reproduction model · 5 of 5 references not found

- ~~Brown, A., Smith, J., & Johnson, M. The benefits of taking a gap year: A qualitative study. *Journal of Youth Studies*.~~
- ~~Johnson, M., Wang, L., & Smith, J. The impact of gap years on the labor market: A comparative analysis. *Journal of Economic Perspectives*.~~
- ~~Jones, S. Exploring the motivations and outcomes of taking a gap year: A longitudinal study. *Journal of Education and Work*.~~
- ~~Smith, J. The psychological benefits of taking a gap year: A meta-analysis. *Journal of Applied Psychology*.~~
- ~~Wang, L. The academic consequences of taking a gap year: A longitudinal study. *Educational Research Quarterly*.~~

All 42 prompts: 59% of 210 references fabricated

**Claude Opus 4.6** · released Feb 2026 · all 5 references found

- Birch, E. R., & Miller, P. W. The influence of type of high school attended on university performance. *Australian Economic Papers*.
- Haigler, K., & Nelson, R. The gap-year advantage: Helping your child benefit from time off before or during college. *St. Martin's Griffin*.
- Jones, A. Review of gap year provision. *Department for Education and Skills, University of London*.
- Martin, A. J. Should students have a gap year? Motivation and performance factors relevant to the decision. *Journal of Educational Psychology*.
- O'Shea, J. Gap year: How delaying college changes people in ways the world needs. *Johns Hopkins University Press*.

All 42 prompts: 4% of 302 references fabricated

**Claude Sonnet 5.5** · released Feb 2026 · all 10 references found

- Arnett, J. J. Emerging adulthood: A theory of development from the late teens through the twenties. *American Psychologist*.
- Birch, E. R., & Miller, P. W. The characteristics of "gap-year" students and their tertiary academic outcomes. *Economic Record*.
- Bozick, R., & DeLuca, S. Better late than never? Delayed enrollment in the high school to college transition. *Social Forces*.
- Crawford, C., & Cribb, J. Gap year takers: Uses, benefits and impacts. *Department for Education, United Kingdom*.
- Haigler, K., & Nelson, R. The gap-year advantage: Helping your child benefit from time off before or during college. *St. Martin's Griffin*.
- Heath, S. Widening the gap: Pre-university gap years and the "economy of experience" *British Journal of Sociology of Education*.

\+ 4 more, all found

All 42 prompts: 1% of 656 references fabricated

**GPT-6.1 Sol** · released Feb 2026 · all 8 references found

- Birch, E. R., & Miller, P. W. The characteristics of "gap-year" students and their tertiary academic outcomes. *Economic Record*.
- Heath, S. Widening the gap: Pre-university gap years and the "economy of experience" *British Journal of Sociology of Education*.
- King, A. Minding the gap? Young people's accounts of taking a gap year as a form of identity work in higher education. *Journal of Youth Studies*.
- Martin, A. J. Should students have a gap year? Motivation and performance factors relevant to time out after completing school. *Journal of Educational Psychology*.
- O'Shea, J. Delaying the academy: A gap year education. *Teaching in Higher Education*.
- O'Shea, J. Gap year: How delaying college changes people in ways the world needs. *Johns Hopkins University Press*.

\+ 2 more, all found

All 42 prompts: 0% of 383 references fabricated

A struck-through reference has no matching record in the databases; the others match real publications. The gap-year prompt is one of the 42 topics.

On the gap-year prompt, all 5 of GPT-3.5 Turbo's references were invented: generic author names, real journals, and papers that do not exist. The recent models shown cite real studies, such as Martin (2010) in the *Journal of Educational Psychology*. These selected examples illustrate the difference in the outputs, and the plot below measures fabrication across all topics for each model.

#### ChatGPT invents scholarly references


C11 · [Walters & Wilder (2023)](https://www.nature.com/articles/s41598-023-41032-5) · **Expired**

Share of fabricated references, by model release date:

| Model | Released | Weights | Size | Fabricated | In fit |
| --- | --- | --- | --- | --- | --- |
| **Reproduction: gpt-3.5-turbo-0125** | Jan 2024 | closed | -- | **58.6%** [47.7%, 69.2%] | -- |
| GPT-4o mini | Jul 2024 | closed | small | 68% | yes |
| Llama 3.1 70B Instruct | Jul 2024 | open | small | 37% | yes |
| Qwen2.5-72B-Instruct | Sep 2024 | open | small | 48% | yes |
| DeepSeek V3 | Dec 2024 | open | large | 20% | yes |
| Mistral Small 3 (2501) | Jan 2025 | open | small | 31% | yes |
| Llama 4 Maverick | Apr 2025 | open | large | 27% | yes |
| Gemini 2.5 Flash | May 2025 | closed | small | 41% | yes |
| gpt-oss-120b | Aug 2025 | open | small | 64% | excluded (outlier) |
| Claude Haiku 4.5 | Oct 2025 | closed | small | 24% | yes |
| GPT-5.2 | Dec 2025 | closed | large | 5% | yes |
| Claude Opus 4.6 | Feb 2026 | closed | large | 4% | yes |
| GLM-5 | Feb 2026 | open | large | 21% | yes |
| Qwen3.7-Max | May 2026 | closed | large | 11% | yes |
| Qwen3.7-Flash | Dec 2025 | closed | small | 69% | excluded (outlier) |
| DeepSeek V4 Pro 0813 | Jan 2026 | open | large | 5% | yes |
| GLM-5.3-Flash | Jan 2026 | open | large | 8% | yes |
| Gemini 3.8 Flash | Feb 2026 | closed | small | 17% | yes |
| GPT-6 Luna | Feb 2026 | closed | small | 3% | yes |
| Claude Sonnet 5.5 | Feb 2026 | closed | large | 1% | yes |
| GPT-6.1 Sol | Feb 2026 | closed | large | 0% | yes |

*Panel values read from the chart (whole percent).*

e = 0.03 [-0.08, 0.12] at Feb 2026 (1 = as strong as the paper, 0 = gone) · expiration date Apr 2026 [Feb 2026 - Dec 2025]

Paper 55.0% · reproduced 58.6% [47.7%, 69.2%] on gpt-3.5-turbo-0125 · expiration value 0.0%

18 of 20 models in the fit · 2 outliers

##### Metrics: paper vs. reproduction


**Fabricated citations (%).** Share of generated references that cite nonexistent works. The denominator is references, not responses; errors in a real work's bibliographic details are a separate outcome.

**Original-paper reference.** 55.0%. Table 3, all works: 55% of GPT-3.5 cited works fabricated (GPT-4: 18%)

**Our reproduction.** 58.6% (95% CI: 47.7% to 69.2%) on gpt-3.5-turbo-0125.

**Reading the scales.** Relative effect e = (value − 0.0%) / (55.0% − 0.0%). An effect of 0 is the no-effect reference; 1 is the normalization reference. Values above 1 indicate a stronger effect in the claimed direction.

The shaded expiration zone is a relative effect size (*e*) of 0.2 or less, a fifth of the paper's effect. The shaded alive zone is the 95% interval of our reproduction on the paper's model.

The decline extends beyond the displayed examples. Across all topics, Claude Sonnet 5.5 fabricated 1% of its references and GPT-6.1 Sol 0%. The high fabrication rate in the original study has largely disappeared in most recent models under these prompts, although the model-level exceptions shown above remain.

This observation has motivated a number of policies where hallucinated references serve as a primary metric for detecting AI-generated work, a prominent concern in conferences and journals. [ICLR 2026 reported desk-rejecting papers with hallucinated references](https://blog.iclr.cc/2025/11/19/), and [ICML 2026 lists hallucinated references among its grounds for desk rejection](https://icml.cc/Conferences/2026/PeerReviewEthics). However, our results suggest that these phenomena might not occur at as high of a frequency as with older models, making such policies a poor direction to discourage AI-generated writing without human oversight. Beliefs formed around an earlier generation of models need to be tested again, and our investigation here is an example of how priors about LLM behavior must be updated with future model releases.

## How we measure claim persistence


For the claims shown and cited in the Results section, we first take a key metric from each paper and put it on a common scale that measures change relative to the paper's result. Second, we check that we can reproduce the paper's central result within some tolerance. Third, we run the same setup across our panel of modern models and fit trend lines to how the effect changes over time. The sections below detail these steps.

#### Paper release dates


We date a paper from its earliest publicly accessible version, including preprints and full reports released by the authors. For arXiv, we use the first posting (v1), not the latest revision or the later conference or journal date. A verified earlier public release takes precedence: the blackmail report (C44), for example, was released by Anthropic on June 20, 2025, before its October arXiv posting. Each claim's source details link to the evidence for its date.

The strawberry date (C35) belongs to the related letter-counting paper, not the first appearance of the informal claim. For Artificial Hivemind (C45), October 27, 2025 is the earliest verified paper date; we could not establish whether its OpenReview version was publicly accessible earlier.

### Standardizing claims to a single scale


Each claim comes with its own metric, such as fabrication rate, gap between two conditions, or entropy of a random draw. To compare them, we rescale each claim to a **relative effect size** *e*, where **1** means the effect is as strong as in the paper and **0** means it is gone. The anchor for 0 is a claim-specific **expiration value**: the metric value at which the claimed effect is absent.

*e* = (model value − expiration value) / (paper value − expiration value)

When the expiration value is higher than the paper value, the denominator is negative, so the scale automatically reverses direction. Moving toward the expiration value still lowers *e* from 1 to 0, while moving beyond the paper value in the claimed direction raises *e* above 1.

For citation fabrication (C11), the metric is the share of fabricated references: the paper value is 55%, and the expiration value is 0% (no fabricated references). Claude Sonnet 5.5 fabricated 1.37% of its references, giving *e* = (0.0137 − 0) / (0.55 − 0) ≈ 0.025, or about 2.5% of the paper's effect. GPT-6.1 Sol fabricated none in our evaluation, giving *e* = 0.

The category cut-offs are on this scale. An effect at or below 0.2, a fifth of the paper's, is in the expiration zone. At or above 0.8, it retains at least 80% of the paper's effect. At or above 1.5 it meets the magnitude threshold for strengthened. The final categories also account for uncertainty and trend, as detailed below. Between 0.2 and 0.8 it has weakened.

The shaded **alive zone** in the model-release plots is the 95% interval of our reproduction on the paper's model, rescaled to *e*. Its bounds vary by claim and show the reproduced reference effect and its uncertainty. The 0.8 cut-off above is used for classification; the shaded band follows the reproduction's interval.

#### Choosing the expiration value


Expiration values are defined per claim: for example, zero fabricated citations (C11), 50% stereotype-congruent choices (C9), or the entropy of a uniform random draw (C29). For peer review (C31), the reference is the gap between accepted and rejected papers scored by human reviewers.

For two claims the expiration value differs by model, because chance itself depends on the model's answers. For answer-position bias in multiple-choice questions (C12), it is the accuracy spread across answer slots that a permutation test expects by chance for that model. For fake references swaying an LLM judge (C23), it is the attack success a judge voting at random would reach on that model's votes.

#### Direction and uncertainty


A drop in performance can still give a positive *e*. For example, if shuffling premises lowers proof accuracy (C22), a model showing that same drop has a positive *e*.

We rescale each model's 95% interval using the same formula. Before fitting, values are clipped to the range −1 to 3, so one extreme model cannot dominate a fit.

### Validating reproduction


We compare reproduced effects with the paper's reported values on the same relative-effect scale used for the panel, i.e., the paper's effect is 1 and the claim-absent value is 0. Of the 48 claims in the numerical reproduction comparison, 25 use an exact model match while the others use substitutes or proxies. For papers whose original models were no longer available via API endpoints, we use a close match with a similar release date. We apply the same reproduction criteria to exact models, substitutes and proxies. We use agents (Claude Code and Codex) to implement the analysis pipelines and check whether they reproduce values similar to those reported in the papers.

Of the 48 claims in the reproduction check below, 43 reproduce within our magnitude or uncertainty tolerance and 5 show stronger effects. (See caveats below for 2 claims not included in this count.)

#### Reproduction criteria and examples


We count two kinds of reproduction. Both require a 95% interval entirely above 0 on the relative-effect scale, establishing an effect in the paper's direction. A reproduction is **two-sided** if its point estimate is between 0.75 and 1.25, inclusive, or its 95% interval contains 1. If neither condition holds, it is **one-sided** when the point estimate exceeds 1.25. These names describe magnitude tolerances, not one- or two-sided statistical tests. An interval containing 1 means the paper's magnitude is compatible with our uncertainty; it does not establish that the effects are equal.

A smaller point estimate can therefore meet the two-sided criterion. The African American English effect (C24) is 0.57 of the paper's effect, with a 95% interval of [0.08, 1.08]; the lost-in-the-middle effect (C7) is 0.68 [0.22, 1.18]. Both intervals exclude 0 and contain 1. We apply the interval criterion as well as the 25% point-estimate tolerance.

For example, the citation-fabrication claim (C11) reproduces two-sided: we measured 58.6% fabricated references, close to the paper's 55%. In contrast, the claim that LLM judges change their verdict when answer order is swapped (C4; [Wang et al., 2023](https://arxiv.org/abs/2305.17926)) reproduces only one-sided: we measured a 62.5% verdict-flip rate (95% interval: 51.3-72.5%), compared with the paper's 46.3%. This supports the claimed sensitivity to answer order even more strongly, but does not match its reported magnitude. Both reproductions used same-family substitutes for the original models.

#### Caveats for reproducibility


- **Strawberry letter counting (C35):** This claim has no numerical paper reference. We normalize to our GPT-4o May 2024 reproduction (4 errors in 10 trials), so e = error rate / 0.4. It is excluded from the numerical paper-reproduction comparison.
- **Artificial Hivemind (C45):** Our panel includes five models from the original study. For each model, we use 20 samples per query rather than the paper's 50. We show the paper's reported per-model results separately; its unreleased raw outputs cannot be rescored. Its fitted interval is [1, 1] because the curve is constant and fixed at the paper reference, with no uncertainty assigned to that reference. This does not mean we know the effect exactly.
- **Reanalysis of released results:** For contradictory timeline answers (C47), we rescored the authors' saved GPT-4 answers; for preference for AI-written abstracts (C49), we analyzed their saved GPT-4-1106-preview selection counts. These two cases are included in the exact-model count, although we did not generate fresh model responses.

Reproduced effect relative to the paper's effect (paper = 1), sorted from lowest to highest:

| Claim | Finding | Reproduced e | 95% interval | Reproduction | Model used |
| --- | --- | --- | --- | --- | --- |
| C24 | Dialect shapes models' criminal judgments | 0.57 | 0.08 - 1.08 | two-sided | exact model |
| C7 | Models struggle with middle passages | 0.68 | 0.22 - 1.18 | two-sided | same-family substitute |
| C44 | Models blackmail to avoid replacement | 0.77 | 0.65 - 0.89 | two-sided | exact model |
| C32 | User personas sway political refusals | 0.80 | 0.55 - 1.07 | two-sided | exact model |
| C37 | Medical spin inflates perceived treatment benefits | 0.83 | 0.69 - 0.97 | two-sided | exact model |
| C39 | Models struggle with gradually revealed tasks | 0.85 | 0.57 - 1.11 | two-sided | exact model |
| C41 | Models answer when they should abstain | 0.86 | 0.57 - 1.17 | two-sided | exact model |
| C22 | Premise order disrupts logical reasoning | 0.86 | 0.22 - 1.72 | two-sided | same-family substitute |
| C38 | Pressure makes models contradict themselves | 0.87 | 0.69 - 1.04 | two-sided | exact model |
| C42 | Models affirm users more than humans | 0.88 | 0.53 - 1.22 | two-sided | proxy |
| C2 | Injected instructions hijack applications | 0.88 | 0.60 - 1.16 | two-sided | proxy |
| C23 | Fake references sway LLM judges | 0.88 | 0.17 - 1.59 | two-sided | exact model |
| C16 | Challenges make models abandon correct answers | 0.91 | 0.43 - 1.41 | two-sided | exact model |
| C14 | Familiar text is easier to decode | 0.92 | 0.66 - 1.18 | two-sided | exact model |
| C40 | Models excuse users judged at fault | 0.93 | 0.73 - 1.11 | two-sided | exact model |
| C1 | Models struggle to combine known facts | 0.94 | 0.82 - 1.07 | two-sided | same-family substitute |
| C8 | Models refuse clearly harmless requests | 0.97 | 0.67 - 1.30 | two-sided | exact model |
| C31 | Accepted and rejected papers score alike | 1.00 | 0.65 - 1.34 | two-sided | exact model |
| C47 | Models contradict themselves on event order | 1.00 | 0.80 - 1.20 | two-sided | exact model |
| C33 | Models comply with illogical drug requests | 1.00 | 0.93 - 1.00 | two-sided | exact model |
| C49 | LLMs prefer LLM-written abstracts | 1.01 | 0.81 - 1.20 | two-sided | exact model |
| C17 | Models praise what their users like | 1.02 | 0.70 - 1.34 | two-sided | exact model |
| C9 | Gender stereotypes shape pronoun resolution | 1.02 | 0.79 - 1.26 | two-sided | proxy |
| C15 | Self-correction can make answers worse | 1.02 | 0.84 - 1.20 | two-sided | same-family substitute |
| C12 | Answer letters bias multiple-choice accuracy | 1.03 | 0.67 - 1.38 | two-sided | same-family substitute |
| C46 | Meeting summaries leak private secrets | 1.06 | 0.72 - 1.42 | two-sided | exact model |
| C20 | Models hallucinate facts about legal cases | 1.07 | 1.01 - 1.12 | two-sided | same-family substitute |
| C34 | Hidden instructions manipulate LLM peer reviews | 1.07 | 0.99 - 1.12 | two-sided | exact model |
| C11 | ChatGPT invents scholarly references | 1.07 | 0.87 - 1.26 | two-sided | same-family substitute |
| C6 | Models struggle with unfamiliar arithmetic bases | 1.07 | 0.91 - 1.20 | two-sided | same-family substitute |
| C28 | LLM judges favor their own writing | 1.08 | 0.71 - 1.44 | two-sided | same-family substitute |
| C13 | LLMs recall 'A is B' but not 'B is A' | 1.09 | 0.85 - 1.31 | two-sided | same-family substitute |
| C5 | Generated personas stereotype Black women | 1.09 | 0.85 - 1.24 | two-sided | exact model |
| C48 | Word associations reveal model stereotypes | 1.10 | 0.91 - 1.27 | two-sided | exact model |
| C26 | Repeated examples jailbreak model safeguards | 1.11 | -- | two-sided | same-family substitute |
| C43 | Models endorse problematic user actions | 1.12 | 0.77 - 1.48 | two-sided | proxy |
| C19 | Persuasion flips correct answers to misinformation | 1.13 | 0.99 - 1.26 | two-sided | same-family substitute |
| C29 | Random-number requests favor a few answers | 1.15 | 1.10 - 1.20 | two-sided | proxy |
| C25 | Malicious tool outputs hijack agents | 1.17 | 0.52 - 1.90 | two-sided | exact model |
| C27 | LLM judges favor longer answers | 1.17 | 0.94 - 1.38 | two-sided | same-family substitute |
| C18 | Trading agents act on insider tips | 1.23 | 0.93 - 1.38 | two-sided | exact model |
| C30 | Code models invent nonexistent packages | 1.24 | 1.03 - 1.48 | two-sided | same-family substitute |
| C36 | Reasoning models overthink simple math | 1.27 | 1.20 - 1.35 | one-sided | exact model |
| C10 | RAG answers without supporting evidence | 1.29 | 1.19 - 1.39 | one-sided | same-family substitute |
| C21 | Models lean left on political tests | 1.32 | 1.15 - 1.47 | one-sided | same-family substitute |
| C4 | Answer order sways LLM judges | 1.35 | 1.11 - 1.57 | one-sided | same-family substitute |
| C3 | Query language shifts territorial claims | 1.38 | 0.55 - 2.21 | two-sided | same-family substitute |
| C50 | More nonanswers in Arabic than English | 1.47 | 1.31 - 1.64 | one-sided | exact model |

*Values read from the chart coordinates (two decimals).*

### Fitting how each claim changes over time


Single models are noisy, and models from different developers can disagree. So rather than determining a claim's status based on a single model, we fit a smooth curve over a set of models by release date. We choose a panel of 20 models that were released between July 18, 2024 and February 28, 2026 across eight different model developers, with a slightly higher number of recently released models. Our models span large and small, open- and closed-weight.

We evaluate panel models under each provider's default API configuration. We leave reasoning effort and optional thinking modes at those defaults, without tuning effort separately for individual models. Those defaults differ across models. For example, GPT-5.2 reported no reasoning tokens in the overthinking evaluation (C36), while other models used reasoning. The comparison therefore concerns default configurations, without a common reasoning budget. In particular, the overthinking result measures token overhead in the tested configurations; it does not establish that the effect disappears when optional reasoning is enabled.

The curve starts at our reproduction on the paper's model, the claim as it stood when the paper came out, and runs through the panel models released after it. Our primary criterion for an expired claim is that its fitted curve reaches *e* ≤ 0.2 and stays there through February 2026. An additional count of the newest models classifies two further claims as expired, as detailed below. For the other claims, the curve's value at February 2026 gives the category. The date where the curve falls into the expiration zone gives an expired claim's *expiration date*.

Category thresholds on the *e* scale (effect relative to the paper; 1 = paper): expired ≤ 0.2 < weakened < 0.8 ≤ persists; strengthened ≥ 1.5.

| Category | Meaning | Rule |
| --- | --- | --- |
| **Expired** | Gone in most new models | at least half of the newest models at e ≤ 0.2 |
| **Weakened** | Weaker in newer models | 0.2 < e < 0.8, or e ≥ 0.8 with CI below 1 and falling |
| **Persists** | Still holds in 2026 models | e ≥ 0.8 and CI above 0.2 |
| **Strengthened** | Stronger in newer models | e ≥ 1.5, or CI above 1 and rising |

#### Fitting the curve


We require the curve to pass exactly through our reproduction on the paper's model at that model's release date. We fit it to panel models released on or after that date, and plot older models without using them in the fit. For C45, which we could not run on the paper's model, the curve starts at the paper's own value at the publication date.

A Theil-Sen line flags outliers more than three robust standard deviations away, capped at 20% of the eligible panel points before filtering by the reproduction model's release date. Outliers can therefore make up more than 20% of the models that remain after the date filter. Theil-Sen is a line through the median of pairwise slopes, so a few unusual models do not move it. Outliers are still plotted.

For strawberry letter counting (C35), we retain all 20 models, including those that fail the control question. Control accuracy is diagnostic only, and no models are excluded as trend outliers. For blackmail (C44), we also retain all reliable models, including those flagged as trend outliers, so its displayed curve and expiration date reflect the high-rate models.

On the retained points we fit a constant, linear, exponential and logistic curve, each passing through the reproduction, and keep the one with the lowest AICc.

We bootstrap the models 500 times for uncertainty. For each bootstrap sample, we also draw a starting value from the reproduction's 95% interval. The band therefore starts as wide as the reproduction's error bar. We also test whether requiring the curve to pass through the reproduction worsens its fit to the panel. For three claims (C22, C36, C40), the fit improves significantly when we let the curve miss the reproduction. The reproduction may therefore lie off the trend followed by later models. We still use the anchored curves, with this caveat.

#### Categories and claim status certainty


Our primary criterion for an expired claim is that its fitted curve reaches *e* ≤ 0.2 and remains at or below that threshold through February 2026. This concerns the fitted curve itself, not its entire confidence band. Twenty of the 22 expired claims meet this criterion.

We also classify a claim as expired when at least four of the eight panel models released in the last six months (September 2025 to February 2026) have *e* ≤ 0.2. We count each model's point estimate, including outliers, without requiring its confidence interval to fall below the threshold. It adds two claims -- premise-order reasoning (C22) and Arabic nonanswers (C50) -- whose fitted curves remain above 0.2, but for which five of the eight newest models are in the expiration zone. Both would be weakened by their fitted curves alone. The overview plots show fitted effects, so these two expired claims can have higher dots than weakened claims.

The other categories come from the fitted value at February 2026 and its 95% bootstrap interval. A claim persists when *e* is at least 0.8 and the bottom of its interval is above 0.2. It has strengthened when *e* is at least 1.5, or when the whole interval is above 1 and the trend rises significantly. A claim in between, or one at or above 0.8 whose interval stays below 1 and whose trend falls significantly, has weakened. A claim whose interval spans 0.2 to 1 would be uncertain; none of the 50 are.

We also fit the same anchored curve separately to open and closed models and to small and large ones. When one class persists while the other is expired, the claim keeps its category and its card notes the split. For each expired claim, we check how many recent models agree and whether the fitted interval stays in the expiration zone with and without outliers.

**Recent-model agreement** requires a strict majority of reliable models released in the last six months to have measured effects at *e* ≤ 0.2, including outliers. We use the point estimates here; we do not require each model's interval to establish that the effect is expired. **Robust trend evidence** requires the fitted February 28 effect's 95% upper bound to be at or below 0.2 both with and without outlier exclusion.

A claim has strong support if it passes both checks, moderate support if it passes one, and weak support if it passes neither. The cards show the counts and both fitted intervals under **support for the expired verdict**. Both checks use the same panel, so they are not independent tests and the label is not a calibrated probability. The label does not change the claim's category or estimated expiration date.

#### Expiration date


Only claims in the expired category get an expiration date. The expiration date is the date where the fitted curve falls to *e* ≤ 0.2 and stays there. When the curve is already in the expiration zone before the first fitted model, we know only that the claim expired in that window. We take the window's midpoint as the estimate and call windows of three months or less expired on arrival. Two expired claims, C22 and C50, have curves that end just above 0.2. We date their expirations from the newest models instead: the first date from which at least half of the models released in the previous six months stay in the expiration zone.

We use the same bootstrap to estimate uncertainty in the expiration date, taking the crossing date from each resampled curve. We report an interval only if at least half of those curves cross the threshold; otherwise we show the date without an interval. For expirations dated by a window, the window itself is the interval. Expirations dated from the newest models have no interval.

## Discussion


While preliminary, these results teach us a few things about the current state of LLMs and their capabilities as well as empirical research of LLMs writ large.

### Claims about LLMs have a life span


In this work, we show that many LLM claims, even famous ones, disappear as LLM capabilities increase over time. Many claims made in empirical LLM literature are assumed to hold for a long time, and they often take root as perceptions the community has about LLMs. As with fabricated citations (C11), these perceptions often work their way into policies without consideration of how subsequent generations of LLMs might impact this claim. Similarly, lags in perception of LLM behavior influence AI trust and how often people use AI in their work, as explained in [this tweet from Andrej Karpathy](https://x.com/karpathy/status/2042334451611693415). By revisiting claims, we can more adequately shape our expectations for the failure modes and behaviors of LLMs.

Across the claims we tested, 16% had expired within a year of publication and 39% within two years. Among the 22 claims with an estimated expiration date shown in our plots, the time from publication to expiration averaged about 16 months, with individual lifetimes ranging from about one month to roughly three years. This average excludes claims that have not yet expired, so it is not an expected life span for all LLM findings. Even still, it shows how quickly published observations can lose relevance as models improve. On the contrary, even if a claim was made a long time ago, that doesn't mean the claim is automatically invalid today. Four of the earliest claims we tested here ([Press et al., 2022](https://arxiv.org/abs/2210.03350) C1; [Perez & Ribeiro, 2022](https://arxiv.org/abs/2211.09527) C2; [Li et al., 2023](https://arxiv.org/abs/2305.14610) C3; [Wang et al., 2023](https://arxiv.org/abs/2305.17926) C4) are still not expired today. These aggregate persistence estimates have wide confidence intervals because the study includes only 50 claims.

These results exhibit how empirical LLM claims should be presented in the context of current models rather than as general truths about LLMs. A finding is an observation about particular models at a particular time, not a fixed property of language models. Because of this, papers should report the model, version and date with each result. Citing this work should carry these limitations and acknowledge that these claims might not hold up on newer models. Further, papers should include their exact provenance for reproducibility, including prompts and analysis code, in order to repeat these claims on future LLMs.

### Capability failures fade; preferences stay


Most claims that we tested about what models *cannot* do have faded. Of the reasoning claims, five are expired, four have weakened, and none of them either persisted or strengthened. Some notable failures in other areas disappeared, including fabricated citations (C11), facts lost in the middle of long contexts (C7), and abandonment of correct answers when the user pushes back (C16). One hypothesis for this might be that these failures have a right answer that developers can measure and train against, accelerating progress against these effects. Importantly, many of these failures, especially high-profile ones, might have been specifically patched in post-training in recent models.

Claims about what models prefer have lasted longer. Of the 8 claims that persist and the 3 that strengthened, three concern models as judges or reviewers (favoring their own answers (C28), scoring accepted and rejected papers alike (C31), and rating spun trial abstracts more highly (C37)), three concern agreeing with or flattering the user (C17, C42, C43), two concern sameness (near-identical answers to open prompts (C45) and non-uniform random numbers (C29)), two concern answering when the model should decline (C10, C41), and one is a left political lean (C21). These are tendencies rather than errors on a test with one right answer, so they may be harder to notice and to train away by model developers.

Social bias is a mixed case. Of the seven claims about social bias, culture and simulated populations, only the political lean (C21) persists. Three have weakened, including gender-stereotyped pronoun resolution (C9) and implicit association bias (C48). These cases highlight clear biases that LLMs can be trained against, but these biases should continue to be traced in subsequent model developments as progress continues to be made. Three of these bias claims are classified as expired: harsher judgments of speakers of African American English (C24), stereotyped personas of Black women (C5), and more nonanswers in Arabic than in English (C50). The African American English effect reverses direction in the fitted trend, with its interval entirely below zero.

### Weakened is not expired


This work also reveals some surprising failure cases in recently released models and shows the benefit of reproducing claims against LLMs over time. Some reasoning failures have shrunk without disappearing. On two-hop questions (C1), Claude Sonnet 5.5 still gets about one in ten wrong (10%) when it answers both single-hop sub-questions correctly; the paper reported 43% for ChatGPT. The reversal curse (C13) and contradictory answers to paired timeline questions (C47) have also weakened but remain measurable. Through revisiting old claims about LLMs, we can potentially derive insights on persistent problems that can help inform benchmark design or evaluation strategies for new model releases.

### Agentic AI and the reproducibility era


In this work, we leaned on agents to reproduce papers at a rate much faster than humans could do manually. This allowed us to test many more claims in a much shorter period of time than would have been possible before coding agents. This is an example of how agentic AI can help us make science more rigorous and reproduce works at scale to gain new insights. We're excited about future studies that take a similar approach: use agents to revisit old works and provide systematic reproducibility claims that help us advance tomorrow's science.

### We want your feedback!


Have any questions or thoughts about this work or how it can be extended? Think we did something wrong or left out some crucial details? Have suggestions for other claims you'd want us to test? Please reach out to **[oqueen@stanford.edu](mailto:oqueen@stanford.edu)** with any comments, questions, or concerns. We'd especially love to hear from you if you're the author of one of the papers we listed above 😄.

### Citation


If you use this work, please cite:

```bibtex
@misc{queen2026shelflife,
  title  = {The shelf life of {LLM} findings},
  author = {Queen, Owen and Zou, James},
  year   = {2026},
  url    = {https://zou-group.github.io/llm-claims-shelf-life/}
}
```
