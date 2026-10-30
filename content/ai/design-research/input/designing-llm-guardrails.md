---
draft: false
toc: true
description: "A conversation exploring guardrails against overreliance on fluent AI text, including explicit interaction modes, independent checks, and links to a research report."
title: "Designing Llm Guardrails"
linkTitle: "Designing Llm Guardrails"
---

Publication note, 2026-04-28: This dialogue is edited for public release. Private source links and account metadata are omitted; personal details may be generalized.

Conversation captured on 2026-04-25. Main turns use `##` headings. Tables, lists, code, diagrams, and source links available in the page are preserved.

The completed research report is saved separately and linked below. Its numbered citations link to source titles and URLs recovered from the original report; full citation metadata is preserved separately.

---

## User -- turn 1


Let's define interaction guardrails, such as explicit modes inspired by Vim, to reduce overreliance on fluent LLM text. People may accept a polished explanation before checking whether it makes sense. What mechanisms could keep generation, evaluation, and reliance separate?

---

## Assistant -- turn 1


I'd make **generating text a temporary, explicit action, followed by a separate decision about whether to rely on it**. That's the useful part of the Vim analogy: each mode allows different actions.

Reading fluent text and assuming that it contains sound reasoning is a concern that research supports. In a controlled study with 308 participants, explanations increased people's reliance on both correct and incorrect LLM answers. Asking for a longer explanation can therefore make a bad answer more convincing. That applies to my answers too. [arxiv.org](<https://arxiv.org/abs/2502.08554?utm_source=chatgpt.com>)

### A proposed mode system


| Mode | What happens | Guardrail |
|---|---|---|
| **Think -- default** | You state the question, your tentative view, and what you need to decide. "I don't know" is fine. | The model waits until you request an answer. |
| **Generate -- `i`** | The model gives one bounded answer: a main claim, important assumptions, and a concrete example when useful. | Start with a limit such as 150 words. More text requires an explicit request. Automatically move to Check. |
| **Check -- `v`** | You select the claim you might rely on. The model helps locate evidence or design a test. | Record **supported, rejected, or unresolved**, with the evidence attached. The model cannot certify its own answer. |
| **Pause -- `:q`** | Stop output and follow-up suggestions. Leave a short note about what remains unresolved. | You can end the session without reaching a conclusion. |

`Esc` should always stop generation and return control to you. The current mode should stay visible.

There is some support for adding this kind of deliberate effort: one experiment found that interventions requiring more active engagement reduced overreliance on AI, although they didn't eliminate it and users disliked the added friction. The particular mode system above would still need testing. [eecs.harvard.edu](<https://www.eecs.harvard.edu/~kgajos/papers/2021/bucinca21trust.pdf?utm_source=chatgpt.com>)

### Rules that address the problem you noticed


**1. Require a clear claim before spending time on the explanation.**

For analytical work, the answer should make it easy to identify:

- What exactly is being claimed?
- What does that mean in a concrete case?
- What evidence would support or weaken it?

If a paragraph still doesn't say anything clear after one targeted clarification, you can discard it or leave it unresolved. You don't need to finish reading every answer.

**2. Check the claim that affects your decision.**

Checking every sentence would be exhausting. Focus on the claim that changes what you'll do.

For example, "this change fixes the race condition" needs an explanation tied to the relevant interleaving and appropriate tests or analysis. Another paragraph saying the change is safe adds little. For factual research, open the cited source and check whether it supports the specific claim.

A second model or a "skeptical" mode can suggest objections. Agreement between models should not count as independent confirmation.

**3. Preserve uncertainty throughout the conversation.**

An assumption should remain an assumption when it appears in a summary or gets carried into another session. Repeating a claim must not promote it to an established fact.

I'd also prohibit automatic praise and agreement. The model should explain what supports a conclusion and where support is missing, without adding flattering judgments about the person proposing it.

**4. Allow checking to end without certainty.**

Repeated explanations with no new evidence should lead to an outside check or a pause. "Unresolved" needs to be an ordinary, acceptable outcome. Otherwise, the checking mode could become another endless conversation.

Use stronger checks for consequential decisions and lighter checks for creative drafts or easily reversible work.

### Mental health needs a separate safeguard


Overreliance on polished text alone should not be treated as evidence of psychosis. Psychosis involves changes in thoughts or perceptions that can make it difficult to recognize what is real; accepting an unconvincing explanation does not, by itself, establish that. [National Institute of Mental Health (NIMH)](<https://www.nimh.nih.gov/health/publications/understanding-psychosis?utm_source=chatgpt.com>)

Clinical case reports do describe chatbots appearing to reinforce delusional beliefs. They raise concerns, but they don't establish how often this happens or demonstrate that a mode system prevents it. **I'd describe this proposal as guardrails against overreliance, without claiming clinical protection.** [Springer Nature Link](<https://link.springer.com/article/10.1186/s12888-026-08137-3?utm_source=chatgpt.com>)

For wellbeing, I'd add a separate stopping rule: if use starts displacing sleep, becomes difficult to stop, or increases distress, step away from the conversation. If you're having difficulty telling what's real, involve a trusted person and seek professional support promptly. Sleep disruption and difficulty distinguishing reality are among the warning signs NIMH identifies. [National Institute of Mental Health (NIMH)](<https://www.nimh.nih.gov/health/publications/understanding-psychosis?utm_source=chatgpt.com>)

For an actual product, output limits, explicit continuation, and stopping controls should be enforced by the interface. A prompt can request these behaviors, but the model's willingness to follow the prompt shouldn't be the only safeguard.

---

## User -- turn 2


Research how psychologists, scientists, and practitioners frame overreliance on persuasive AI-generated text and what practices might reduce it. Distinguish general information-use guidance from clinical safeguards. Develop material suitable for a public website.

---

## Assistant -- turn 2


Deep Research has started. It will first present its research plan, then investigate the psychological mechanisms, scientific evidence, practitioner recommendations, and practical safeguards for LLM users.

The final report will include evidence-based practices, a proposed mode system, mental health safety guidance, and material suitable for publishing on a public website.

---

## User -- turn 3


Consider situations such as interviews and meetings where a person reads LLM-generated replies instead of listening and responding to another person's critical questions. How can interfaces preserve attention and independent reasoning?

---

## Assistant -- turn 3


This adds another problem to our research: **people can become so focused on an LLM's output that they stop engaging with the person in front of them.**

This interaction pattern illustrates something beyond accepting incorrect AI answers.

The failure can happen even when the generated answer is technically correct. The other person may:

- Miss a critical question because they're reading generated text.
- Answer a question you didn't ask.
- Ignore new information or corrections.
- Repeat an explanation without demonstrating understanding.
- Treat the LLM's response as more relevant than the person they're speaking with.

I'd call this **displacement of attention and independent judgment during human interaction**.

For a public website, it deserves its own category, separate from misinformation, excessive reliance, and mental-health risks.

### How psychology helps frame this


Three concepts are relevant:

**Cognitive offloading:** A person delegates part of the mental work to a tool. This can be helpful, but some users may also delegate the work of interpreting the question and forming a response. A 2026 review of LLM research found evidence of reduced performance on some cognitive tasks, while the evidence for lasting changes in critical-thinking ability remains inconclusive.  [Source: npj Digital Medicine]

**Automation bias:** A person follows the system's output even when their own judgment or available evidence should lead them to question it. Experimental research shows that requiring people to think before accepting AI advice can reduce this behavior.  [Source: doi.org]

**Failure of conversational grounding:** The participants stop maintaining a shared understanding of what was actually said. This directly describes the interaction pattern in the example. In five studies involving 1,225 people, researchers found that people often failed to detect when conversational partners were inattentive. That research wasn't specific to AI, but it establishes why listening itself needs attention.  [Source: pubmed.ncbi.nlm.nih.gov]

### A practical guardrail for interviews


I'd introduce a **Human-first mode**:

While another person is speaking, the AI interface cannot generate or display suggested responses. The participant listens, interprets the question, and responds independently. AI assistance can resume during an explicit break.

A useful test in a technical interview would be:

> "I just changed one requirement. Explain how that changes your solution, using your own reasoning."

This tests whether the person can update their understanding during an actual conversation.

For a public website, I'd also distinguish observed behavior from inferred causes. Someone ignoring a question may be distracted, nervous, following a script, or relying on AI. We should measure whether they respond appropriately to new information without assuming why.

**The central design question becomes: How do we preserve a person's ability to listen, reason, and respond when AI assistance is available?**

That broadens the project beyond individual overreliance. It gives us a second research area: **how AI use affects the quality of interactions between people**, especially in interviews, meetings, education, and collaborative engineering.

---

## User -- turn 4


The issue also arises when private LLM conversations replace forums or discussion with other people. Fluent text can invite people to respond as if the system were a knowledgeable person, even when they know it is unreliable. What terminology describes this problem, and what could preserve independent scrutiny?

---

## Assistant -- turn 4


This broadens the problem to **a change in where people seek understanding**: questions that once led to other people can now lead to an extended conversation with a model. Awareness of a system's limitations may stop guiding how a person responds to it.

That distinction should be central to the website.

#### What to call these texts


I'd use **"plausible-sounding but unsupported text."** When the problem is that a response sounds explanatory without explaining anything specific, **"empty explanation"** fits. When it invents facts or sources, **"fabrication"** is more precise. These distinguish different failures; researchers also debate the usefulness of terms such as "hallucination" and "confabulation." [Springer Link](<https://link.springer.com/article/10.1007/s10676-025-09828-3>)

There is also a directly relevant philosophical term: **"bullshit," meaning communication produced without sufficient concern for whether it is true.** Hicks, Humphries, and Slater argued in 2024 that this describes LLM output better than "hallucination." Their argument is contested; a 2025 response warns that applying the label categorically can itself misrepresent the technology. It's a useful perspective to discuss, not a settled scientific classification. [Springer Link](<https://link.springer.com/article/10.1007/s10676-024-09775-5>)

I'd keep *meaning*, *truth*, and *explanation* separate. A sentence can mean something definite and still be false. An answer can be correct and still provide no useful explanation. This gives us more precise questions than whether all generated text is meaningless: **What does this answer actually claim? What supports it? Does it address my question?**

#### Knowing it is software doesn't necessarily govern your behavior


This mismatch between explicit knowledge and automatic responses resembles research on **automatic social responses to computers**. Nass and Moon described people applying familiar social rules to computers without consciously deciding to treat them as people. Knowing what a system is and automatically responding to its conversational cues are different things. [spssi.onlinelibrary.wiley.com](<https://spssi.onlinelibrary.wiley.com/doi/10.1111/0022-4537.00153>)

More recent research connects interface cues to trust. In an experiment with 2,165 participants, a simulated LLM presented through speech and text received higher ratings of human likeness and information accuracy than the text-only version. First-person wording also affected perceived accuracy in one context. Those results concern specific interface manipulations; they don't establish that every conversational feature has the same effect. [Google Research](<https://research.google/pubs/believing-anthropomorphism-examining-the-role-of-anthropomorphic-cues-on-user-trust-in-large-language-models/>)

A warning saying "AI can make mistakes" may leave this problem largely untouched even for people who already know the system can be unreliable. The design problem is how to keep that knowledge active when deciding what to believe or do.

#### What changes when the forum disappears


Forums such as Stack Overflow provide another safeguard that can be lost. Its comments, alternative answers, edits, and voting provide opportunities for other people to challenge an answer and expose missing conditions. Those mechanisms don't guarantee correctness, but they make independent criticism possible and visible. [Stack Overflow](<https://stackoverflow.com/help/why-vote>)

My inference is that replacing that exchange with a private chatbot conversation can remove opportunities for correction. Asking the same model to criticize its answer can generate useful objections, but it doesn't reproduce independent community scrutiny.

For a public website, I'd frame the problem this way:

> People can know that a chatbot is unreliable while still responding to it as a knowledgeable conversation partner. When the chatbot becomes their default place to ask, discuss, and evaluate answers, independent checking and discussion with other people may fall away.

That suggests a practical guardrail to test: **an important conversation should have a planned step outside the chat.** Before starting, decide what would resolve the question--a reproducible test, a primary source, or another person's assessment. Let the model help prepare that step. Leave the question unresolved until the relevant evidence arrives.

For your mode system, this means adding an explicit **outside-check step**. A second generated explanation should not, by itself, count as completing the check.


---

## Completed research report


[Preventing Overreliance on Persuasive AI-Generated Text]({{< ref "ai/design-research/input/reports/preventing-overreliance-on-persuasive-ai-generated-text" >}})

> Export note: The following inline source controls exposed only their labels in the saved page: `npj Digital Medicine`, `doi.org`, `pubmed.ncbi.nlm.nih.gov`. Their destinations were not included in the archive.
