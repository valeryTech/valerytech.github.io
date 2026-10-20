---
draft: false
toc: true
title: "Model and system behavior"
aliases:
  - "/ai-engineering/causal-stack/layer-1a-base-llm-mechanisms/"
  - "/ai-engineering/evaluation/causal-stack/layer-1a-base-llm-mechanisms/"
  - "/ai-engineering/causal-stack/layer-1c-ai-system-causal-features/"
  - "/ai-engineering/evaluation/causal-stack/layer-1c-ai-system-causal-features/"
description: "Scoped background on language models and the surrounding application, with sources and limits on causal inference."
linkTitle: "Model and system behavior"
---

Use this background to form questions about a product. It does not identify the cause of an incident.

## A bounded model of text generation


For a conventional autoregressive Transformer language model:

1. A tokenizer represents text as tokens.
2. The model processes the supplied sequence using learned parameters and positional information.
3. It scores possible next tokens conditioned on the input and generated prefix.
4. A decoding procedure selects a continuation, and generation proceeds.

The Transformer architecture uses attention and other transformations to combine information across positions. This describes computation, not a guarantee that every fact will be used correctly. The original paper studies an encoder-decoder architecture; it is background for the Transformer family, not a specification of every current model. [Vaswani et al., Attention Is All You Need](https://arxiv.org/abs/1706.03762).

For a fixed model checkpoint under ordinary inference, examples supplied in context can change behavior without changing the weights. Brown et al. demonstrate this in GPT-3 on the tasks they study. This distinguishes information supplied for a run from training or fine-tuning. [Language Models are Few-Shot Learners](https://arxiv.org/abs/2005.14165).

For a specific product, inspect its actual interface, context limits, model version, and decoding settings. A hosted service can manage history, retrieval, caching, or other state outside the model. "The model is stateless" is too imprecise to describe that whole service.

## Research findings with limited scope


| Finding | What the study supports | What still needs checking locally |
|---|---|---|
| Position and context length can affect use of relevant information | Liu et al. find position-dependent performance on multi-document question answering and key-value retrieval for the evaluated models | Whether the deployed model and task exhibit the effect, and whether a particular selection or layout change helps |
| A generated explanation may omit a factor that influenced the answer | Turpin et al. demonstrate unfaithful explanations under their biasing interventions | Which factors matter in a specific incident; an explanation alone cannot settle that |
| Training can improve adherence to instruction priority | Wallace et al. evaluate instruction-hierarchy training and resistance to lower-priority conflicting instructions | The deployed system's behavior and the application's enforcement of permissions and action boundaries |

Sources: [Liu et al., Lost in the Middle](https://aclanthology.org/2024.tacl-1.9/); [Turpin et al., Language Models Don't Always Say What They Think](https://arxiv.org/abs/2305.04388); [Wallace et al., The Instruction Hierarchy](https://arxiv.org/abs/2404.13208).

These studies motivate checks. They do not make the former stack's mechanism labels established diagnoses, and they do not establish current performance across all models.

## Inspect the whole application


| Condition | Practical question |
|---|---|
| Information is selected or compressed before generation | Did required facts and exceptions survive retrieval, filtering, summaries, and context limits? |
| Work crosses several components | At which handoff is the first mismatch visible? Does a successful component result remain correct when consumed by the next step? |
| Conversation or task state persists | Which values are current, where are they stored, and how are corrections or cancellations applied? |
| Tools affect external state | What actually happened, and what does the product know about partial success or failure? |
| Versions or runtime conditions change | Were the source, model, prompt, tools, environment, and relevant state comparable across runs? |
| Several outputs would be acceptable | Which differences affect the task outcome, rather than merely wording? |
| A shared component changes | Which other workflows use it, and what representative regressions should be checked? |
| Time or cost is constrained | What gets truncated, skipped, retried, or substituted when a limit is reached? |

These are observable system questions, not a taxonomy of universal AI properties. Some apply equally to ordinary software.

## Feedback can change future inputs


A generated answer might be copied into a knowledge base, indexed, and retrieved later. A workflow can also update records that become inputs to later decisions.

When this happens, distinguish original evidence, generated material, and reviewed corrections. A claim appearing in a later source does not independently corroborate it if that source copied the original output.

Similarly, a click, accepted draft, or saved summary records an event in the workflow. Check what it means before treating it as a correctness label. The product may have influenced what was available to select or how expensive correction was.

This is a possible failure path to inspect when the product stores its own output; no local occurrence is claimed here.

## Limits of attribution


A trace can show what input reached a call, which action was attempted, and what state changed. It may narrow a diagnosis considerably without revealing the model's internal mechanism.

Do not infer an attention failure from an omitted fact, a competence boundary from one failure, or accurate probability calibration from confident language. Write the observation precisely, consider alternatives, and choose a [check]({{< ref "ai-engineering/causal-stack/checks" >}}).

A control that blocks a particular bad result may be useful even while its internal model cause remains unknown. Keep that engineering decision separate from the explanatory claim.
