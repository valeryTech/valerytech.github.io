---
draft: false
toc: true
description: "Maps Quick Add’s draft manager, slots, repair, validation, confirmation, and fulfillment to frame-based dialogue, Rasa, and Lex, highlighting added provenance and execution boundaries."
title: "08 Dialogue Framework Mapping"
linkTitle: "08 Dialogue Framework Mapping"
---
# Mapping the draft model to dialogue frameworks


[Reading map]({{< ref "ai/design/dialogue-approach/00-index" >}})

## Closest conceptual and product analogs


The closest existing family is **frame-based task-oriented dialogue**, where the system maintains a structured frame or slots, fills them over multiple turns, validates them, and only proceeds once the information is complete enough for the task. The proposed Quick Add model is also very close to the typed-action pattern in its specification, where natural language produces a transaction draft, the backend validates it, and execution only happens after confirmation.[^analog-1][^analog-2][^analog-3]

### Closest matches


The strongest conceptual match is **frame-based dialogue systems**: the user has a task, the system tracks a structured representation of that task, fills missing slots, and asks follow-up questions when required. In Quick Add, the "frame" is the transaction draft, and the refinement loop is essentially a productized form of dialogue state tracking plus slot filling.[^analog-2][^analog-4]

A second close match is **frame tracking**, which extends plain slot filling by keeping track of frames over time rather than treating each utterance as a one-shot parse. That maps well to the proposal that "4.50" should update the existing draft rather than create a new interpretation from scratch.[^analog-3]

### Product analogs


| Existing approach | Why it is similar |
| :--- | :--- |
| Frame-based dialogue systems | They are built around task completion through structured frames and slot filling rather than free-form chat.[^analog-2] |
| Dialogue state tracking | DST explicitly maintains slot values across turns and is responsible for extracting and preserving state over the dialogue.[^analog-4] |
| Rasa Forms | Rasa forms collect required slots, validate extracted values, and keep prompting until the form is complete enough to proceed.[^analog-5] |
| Amazon Lex slot elicitation + confirmation | Lex uses slots to gather required fields and supports a confirmation prompt after slot values are filled to verify the action before proceeding.[^analog-6][^analog-7] |
| Memory-enhanced frame tracking | This line of work models dialogue as operating over the list of frames created so far, not just the latest user message.[^analog-3] |

<a id="where-your-framing-is-stronger"></a>

### Where the draft model adds structure


The proposed draft model is more robust than classic slot filling because the draft is not just a bag of fields; it also carries **status, provenance, warnings, readiness, and next-step policy**. Traditional form systems usually emphasize collecting required values, while the proposed design explicitly separates parsing, grounding, validation, policy, confirmation, and execution boundaries.[^analog-5][^analog-7][^analog-1]

That separation is especially close to production assistant architecture: Rasa distinguishes slot collection and validation, and Lex distinguishes slot completion from confirmation, but the proposed model goes further by making the draft itself the orchestrated object and by keeping execution behind a typed backend boundary. In other words, this is less "chatbot form filling" and more **execution-gated stateful command completion**.[^analog-7][^analog-1][^analog-2][^analog-5]

### Best labels


For an NLP and conversational-systems audience, the closest label is **frame-based, task-oriented dialogue with dialogue state tracking and slot filling**. For product and architecture descriptions, **draft-centric action pipeline** or **execution-gated typed action pipeline** is clearer and better aligned with the transaction-confirmation boundary.[^analog-4][^analog-1][^analog-2]

A concise way to position it in a spec would be: "Quick Add uses a frame-based dialogue pattern in which the system maintains a transaction draft, incrementally fills and validates it, and executes a typed action only after readiness and confirmation."[^analog-1][^analog-2][^analog-5][^analog-7][^analog-4]

## Component mapping to Rasa and Lex


The proposed components map **cleanly** onto classic task-oriented dialogue terminology, with Rasa and Lex providing concrete product analogs for different layers of the loop.[^mapping-1][^mapping-2]

### Core mapping


At the highest level, the **transaction draft** corresponds to the dialogue **frame/state**: frame-based systems define a frame with slots the system needs to complete the task, and dialogue state tracking is responsible for maintaining that state over turns. In Rasa, this looks like the evolving set of form slots plus `requested_slot` and `active_loop`; in Lex, it looks like the current intent with its slot values and next dialog step.[^mapping-2][^mapping-3][^mapping-1]

| Quick Add component | General DST term | Rasa term | Lex term |
| :--- | :--- | :--- | :--- |
| Transaction Draft | Dialogue state / frame | Form state plus slots.[^mapping-1] | Intent state plus slot values.[^mapping-2] |
| `action: create_transaction` | Intent / task schema | Triggering intent that activates a form.[^mapping-1] | Intent.[^mapping-2] |
| Fields like amount, date, account, category | Slots / slot-value pairs | Slots.[^mapping-1] | Slots.[^mapping-2] |
| Draft Manager | Dialogue state tracker / dialogue manager | Form loop logic with validation and slot updates.[^mapping-1] | Dialog manager plus code-hook-controlled next steps.[^mapping-2] |
| Missing fields | Unfilled required slots | `required_slots` not yet filled.[^mapping-1] | Required slots still to elicit.[^mapping-2] |
| `next_step.ask_user` | Slot elicitation | `utter_ask_*` or `action_ask_*` for requested slot.[^mapping-1] | Slot prompt / `ElicitSlot` behavior.[^mapping-2][^mapping-4] |
| Readiness check | Dialogue policy / completion condition | Form deactivates when all required slots are filled.[^mapping-1] | Move to confirmation or fulfillment after slots are filled.[^mapping-2][^mapping-5] |
| Confirmation card | Intent confirmation | Custom submit/confirmation step after form completion.[^mapping-1] | Confirmation prompt / `ConfirmIntent`.[^mapping-5][^mapping-6] |
| Typed backend execution | Fulfillment / action execution | Submit action or downstream custom action after form completion.[^mapping-1] | Fulfillment step after confirmation.[^mapping-5] |

### State and loop


The **draft lifecycle** maps most naturally to dialogue state tracking plus a dialogue manager that chooses the next action from the current state. DST literature defines the state as the accumulated slot-value representation over the full conversation, not just what was said in the last turn, which explains why the draft object is the central object in this design.[^mapping-7][^mapping-3][^mapping-2]

For Rasa specifically, `active_loop` is the closest analog to the refinement loop, because a form stays active until enough information is collected, and `requested_slot` marks the exact field currently being elicited. In Lex, the equivalent is the configured conversation path where the system elicits required slots, optionally branches, and then moves to confirmation and fulfillment.[^mapping-4][^mapping-8][^mapping-1][^mapping-2]

### Validation and repair


The **enrich, validate, repair** phases split across standard components rather than belonging to one monolithic parser. In Rasa, extraction and validation happen during the form via slot mappings, `extract_<slot>`, and `validate_<form_name>` or `validate_<slot>` methods; invalid values can be reset to `None`, causing the system to ask again. In Lex, slot capture can invoke a Lambda dialog code hook to validate or normalize values and determine the next step after each capture attempt.[^mapping-5][^mapping-1][^mapping-2]

"Clarification as draft repair" maps directly to **re-elicitation after failed validation**. The "blocked" or "unsupported" states map to Rasa unhappy paths or form deactivation, and to Lex failure responses, conditional branches, or routing back to intent elicitation.[^mapping-1][^mapping-2]

### Tool grounding


The **grounding services** do not have a single first-class name in classic DST, but they fit as business-logic-backed slot resolution and validation. In Rasa, this is usually custom extraction/validation code inside forms; in Lex, it is primarily dialog code hooks and conditional branching attached to slot capture or confirmation.[^mapping-2][^mapping-5][^mapping-1]

Possible module labels:

- Category/account resolver -> custom slot extraction or slot resolution layer.[^mapping-1][^mapping-2]
- Duplicate detector -> validation/business rule layer before confirmation.[^mapping-5][^mapping-1]
- Defaults/history enrichment -> dialogue-context-informed slot filling or business-logic enrichment.[^mapping-3][^mapping-1]
- Provenance/confidence -> not a standard Rasa/Lex primitive, but an **observability extension** on top of DST state.[^mapping-1]

### Recommended terminology


A design document can use two vocabularies so both NLP and product readers can follow the design.[^mapping-2][^mapping-1]

- **NLP/conversational AI:** task-oriented dialogue, frame-based state, slot filling, dialogue state tracking, slot elicitation, validation, confirmation, fulfillment.[^mapping-3][^mapping-2]
- **Product/architecture:** transaction draft, draft manager, enrichment, readiness criteria, action policy, execution gate, typed action executor.[^mapping-1]

A tight mapping sentence would be: "The draft manager is effectively a dialogue state tracker plus policy layer; it maintains the transaction frame, elicits and validates missing slots, and only hands off to fulfillment once the draft is confirmation-ready."[^mapping-5][^mapping-2][^mapping-1]

### One nuance


The only place this design is **strictly richer** than default Rasa/Lex terminology is field provenance, patch history, and explicit separation between `ready_for_confirmation` and `execution_ready`. Classic frameworks support slot collection, validation, and confirmation, but the proposed draft object adds a more modern orchestration layer for explainability, observability, and safe typed execution boundaries.[^mapping-5][^mapping-1]

A practical renamed component set could be:

- Draft Manager -> Dialogue State Tracker + Policy Orchestrator.[^mapping-3][^mapping-2]
- Missing fields -> Required unfilled slots.[^mapping-2][^mapping-1]
- Clarification loop -> Slot elicitation loop.[^mapping-4][^mapping-1]
- Readiness scorer -> Policy/completion gate.[^mapping-7][^mapping-5]
- Confirm step -> Intent confirmation.[^mapping-5]
- Executor -> Fulfillment / typed action execution.[^mapping-1][^mapping-5]

## References


[^analog-1]: Quick Add feature specification

[^analog-2]: [Speech and Language Processing: dialogue systems](https://web.stanford.edu/~jurafsky/slp3/K.pdf)

[^analog-3]: [ACL 2017: frame tracking reference](https://aclanthology.org/W17-2626/)

[^analog-4]: [IJCAI 2022: dialogue state tracking reference](https://www.ijcai.org/proceedings/2022/0607.pdf)

[^analog-5]: [Rasa Forms](https://rasa.com/docs/rasa/forms/)

[^analog-6]: [Amazon Lex: intent slots](https://docs.aws.amazon.com/lexv2/latest/dg/intent-slots.html)

[^analog-7]: [Amazon Lex: intent confirmation](https://docs.aws.amazon.com/lexv2/latest/dg/intent-confirm.html)

[^mapping-1]: Quick Add feature specification

[^mapping-2]: [Speech and Language Processing: dialogue systems](https://web.stanford.edu/~jurafsky/slp3/K.pdf)

[^mapping-3]: [IJCAI 2022: dialogue state tracking reference](https://www.ijcai.org/proceedings/2022/0607.pdf)

[^mapping-4]: [Amazon Lex: conversation next steps](https://docs.aws.amazon.com/lexv2/latest/dg/paths-nextstep.html)

[^mapping-5]: [Rasa Forms](https://rasa.com/docs/rasa/forms/)

[^mapping-6]: [Amazon Lex V1: PostText](https://docs.aws.amazon.com/lex/latest/dg/API_runtime_PostText.html)

[^mapping-7]: [Jacqmin: dialogue state tracking seminar](https://talep.lis-lab.fr/seminars/2022-01-13-jacqmin.pdf)

[^mapping-8]: [Rasa requested slot (DEV Community)](https://dev.to/petr7555/rasa-requestedslot-4ai7)

---

Related: [Draft state and lifecycle]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/02-draft-state-and-lifecycle" >}}) · [Clarification as draft repair]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/06-clarification-as-draft-repair" >}}) · [Dialogue systems and mixed-initiative interaction]({{< ref "ai/design/dialogue-approach/01-framing/04-dialogue-and-mixed-initiative" >}}).

Original text: [example.md](/ai/design/dialogue-approach/02-draft-pipeline/08-dialogue-framework-mapping.assets/example.txt) · [mapping.md](/ai/design/dialogue-approach/02-draft-pipeline/08-dialogue-framework-mapping.assets/mapping.txt).

## Library sources


- [Jurafsky and Martin 2026](/sources/nlp/dialogue-systems/jurafsky-2026-slp3-appendix-k-frame-based-dialogue.pdf.enc), *SLP3 Appendix K: Frame-Based Dialogue Systems* -- on *Closest matches*
