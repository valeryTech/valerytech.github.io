---
draft: false
toc: true
title: "Mapping the Draft Model to Dialogue Frameworks"
description: "Maps Quick Add’s draft manager, slots, repair, validation, confirmation, and fulfillment to frame-based dialogue, Rasa, and Lex, highlighting added provenance and execution boundaries."
weight: "80"
linkTitle: "Dialogue Framework Mapping"
---

[Reading map]({{< ref "ai/design/dialogue-approach/00-index" >}})

## Closest conceptual and product analogs


The closest existing family is **frame-based task-oriented dialogue**, where the system maintains a structured frame or slots, fills them over multiple turns, validates them, and only proceeds once the information is complete enough for the task. The proposed Quick Add model is also very close to the typed-action pattern in its specification, where natural language produces a transaction draft, the backend validates it, and execution only happens after confirmation. ([Jurafsky & Martin 2026](#jurafsky-2026); [Schulz et al. 2017](#schulz-2017); see Quick Add feature specification)

### Closest matches


The strongest conceptual match is **frame-based dialogue systems**: the user has a task, the system tracks a structured representation of that task, fills missing slots, and asks follow-up questions when required. In Quick Add, the "frame" is the transaction draft, and the refinement loop is essentially a productized form of dialogue state tracking plus slot filling. ([Jurafsky & Martin 2026](#jurafsky-2026); [Sun et al. 2022](#sun-2022))

A second close match is **frame tracking**, which extends plain slot filling by keeping track of frames over time rather than treating each utterance as a one-shot parse. That maps well to the proposal that "4.50" should update the existing draft rather than create a new interpretation from scratch. ([Schulz et al. 2017](#schulz-2017))

### Product analogs


| Existing approach | Why it is similar |
| :--- | :--- |
| Frame-based dialogue systems | They are built around task completion through structured frames and slot filling rather than free-form chat. ([Jurafsky & Martin 2026](#jurafsky-2026)) |
| Dialogue state tracking | DST explicitly maintains slot values across turns and is responsible for extracting and preserving state over the dialogue. ([Sun et al. 2022](#sun-2022)) |
| Rasa Forms | Rasa forms collect required slots, validate extracted values, and keep prompting until the form is complete enough to proceed. ([Rasa, Forms](#rasa-forms)) |
| Amazon Lex slot elicitation + confirmation | Lex uses slots to gather required fields and supports a confirmation prompt after slot values are filled to verify the action before proceeding. ([AWS, Slots](#aws-lex-slots); [AWS, Confirmation](#aws-lex-confirmation)) |
| Memory-enhanced frame tracking | This line of work models dialogue as operating over the list of frames created so far, not just the latest user message. ([Schulz et al. 2017](#schulz-2017)) |

### Where the draft model adds structure


The proposed draft model is more robust than classic slot filling because the draft is not just a bag of fields; it also carries **status, provenance, warnings, readiness, and next-step policy**. Traditional form systems usually emphasize collecting required values, while the proposed design explicitly separates parsing, grounding, validation, policy, confirmation, and execution boundaries. ([Rasa, Forms](#rasa-forms); [AWS, Confirmation](#aws-lex-confirmation); see Quick Add feature specification)

That separation is especially close to production assistant architecture: Rasa distinguishes slot collection and validation, and Lex distinguishes slot completion from confirmation, but the proposed model goes further by making the draft itself the orchestrated object and by keeping execution behind a typed backend boundary. In other words, this is less "chatbot form filling" and more **execution-gated stateful command completion**. ([AWS, Confirmation](#aws-lex-confirmation); [Jurafsky & Martin 2026](#jurafsky-2026); [Rasa, Forms](#rasa-forms); see Quick Add feature specification)

### Best labels


For an NLP and conversational-systems audience, the closest label is **frame-based, task-oriented dialogue with dialogue state tracking and slot filling**. For product and architecture descriptions, **draft-centric action pipeline** or **execution-gated typed action pipeline** is clearer and better aligned with the transaction-confirmation boundary. ([Sun et al. 2022](#sun-2022); [Jurafsky & Martin 2026](#jurafsky-2026); see Quick Add feature specification)

A concise way to position it in a spec would be: "Quick Add uses a frame-based dialogue pattern in which the system maintains a transaction draft, incrementally fills and validates it, and executes a typed action only after readiness and confirmation." ([Jurafsky & Martin 2026](#jurafsky-2026); [Rasa, Forms](#rasa-forms); [AWS, Confirmation](#aws-lex-confirmation); [Sun et al. 2022](#sun-2022); see Quick Add feature specification)

## Component mapping to Rasa and Lex


The proposed components map **cleanly** onto classic task-oriented dialogue terminology, with Rasa and Lex providing concrete product analogs for different layers of the loop. ([Jurafsky & Martin 2026](#jurafsky-2026); see Quick Add feature specification)

### Core mapping


At the highest level, the **transaction draft** corresponds to the dialogue **frame/state**: frame-based systems define a frame with slots the system needs to complete the task, and dialogue state tracking is responsible for maintaining that state over turns. In Rasa, this looks like the evolving set of form slots plus `requested_slot` and `active_loop`; in Lex, it looks like the current intent with its slot values and next dialog step. ([Jurafsky & Martin 2026](#jurafsky-2026); [Sun et al. 2022](#sun-2022); see Quick Add feature specification)

| Quick Add component | General DST term | Rasa term | Lex term |
| :--- | :--- | :--- | :--- |
| Transaction Draft | Dialogue state / frame | Form state plus slots. | Intent state plus slot values. ([Jurafsky & Martin 2026](#jurafsky-2026); [Rasa, Forms](#rasa-forms); [AWS, Slots](#aws-lex-slots)) |
| `action: create_transaction` | Intent / task schema | Triggering intent that activates a form. | Intent. ([Jurafsky & Martin 2026](#jurafsky-2026); [Rasa, Forms](#rasa-forms); [AWS, Slots](#aws-lex-slots)) |
| Fields like amount, date, account, category | Slots / slot-value pairs | Slots. | Slots. ([Jurafsky & Martin 2026](#jurafsky-2026); [Rasa, Forms](#rasa-forms); [AWS, Slots](#aws-lex-slots)) |
| Draft Manager | Dialogue state tracker / dialogue manager | Form loop logic with validation and slot updates. | Dialog manager plus code-hook-controlled next steps. ([Jurafsky & Martin 2026](#jurafsky-2026); [Rasa, Forms](#rasa-forms); [AWS, Next steps](#aws-lex-next-steps)) |
| Missing fields | Unfilled required slots | `required_slots` not yet filled. | Required slots still to elicit. ([Jurafsky & Martin 2026](#jurafsky-2026); [Rasa, Forms](#rasa-forms); [AWS, Slots](#aws-lex-slots)) |
| `next_step.ask_user` | Slot elicitation | `utter_ask_*` or `action_ask_*` for requested slot. | Slot prompt / `ElicitSlot` behavior. ([Jurafsky & Martin 2026](#jurafsky-2026); [Rasa, Forms](#rasa-forms); [AWS, Next steps](#aws-lex-next-steps)) |
| Readiness check | Dialogue policy / completion condition | Form deactivates when all required slots are filled. | Move to confirmation or fulfillment after slots are filled. ([Jurafsky & Martin 2026](#jurafsky-2026); [Rasa, Forms](#rasa-forms); [AWS, Next steps](#aws-lex-next-steps)) |
| Confirmation card | Intent confirmation | Custom submit/confirmation step after form completion. | Confirmation prompt / `ConfirmIntent`. ([Rasa, Forms](#rasa-forms); [AWS, Confirmation](#aws-lex-confirmation); [AWS, PostText](#aws-lex-posttext)) |
| Typed backend execution | Fulfillment / action execution | Submit action or downstream custom action after form completion. | Fulfillment step after confirmation. ([Rasa, Forms](#rasa-forms); [AWS, Next steps](#aws-lex-next-steps)) |

### State and loop


The **draft lifecycle** maps most naturally to dialogue state tracking plus a dialogue manager that chooses the next action from the current state. DST literature defines the state as the accumulated slot-value representation over the full conversation, not just what was said in the last turn, which explains why the draft object is the central object in this design. ([Jacqmin 2022](#jacqmin-2022); [Sun et al. 2022](#sun-2022); [Jurafsky & Martin 2026](#jurafsky-2026))

For Rasa specifically, `active_loop` is the closest analog to the refinement loop, because a form stays active until enough information is collected, and `requested_slot` marks the exact field currently being elicited. In Lex, the equivalent is the configured conversation path where the system elicits required slots, optionally branches, and then moves to confirmation and fulfillment. ([AWS, Next steps](#aws-lex-next-steps); [Janik 2021](#janik-2021); [Jurafsky & Martin 2026](#jurafsky-2026); see Quick Add feature specification)

### Validation and repair


The **enrich, validate, repair** phases split across standard components rather than belonging to one monolithic parser. In Rasa, extraction and validation happen during the form via slot mappings, `extract_<slot>`, and `validate_<form_name>` or `validate_<slot>` methods; invalid values can be reset to `None`, causing the system to ask again. In Lex, slot capture can invoke a Lambda dialog code hook to validate or normalize values and determine the next step after each capture attempt. ([Rasa, Forms](#rasa-forms); [Jurafsky & Martin 2026](#jurafsky-2026); see Quick Add feature specification)

"Clarification as draft repair" maps directly to **re-elicitation after failed validation**. The "blocked" or "unsupported" states map to Rasa unhappy paths or form deactivation, and to Lex failure responses, conditional branches, or routing back to intent elicitation. ([Jurafsky & Martin 2026](#jurafsky-2026); see Quick Add feature specification)

### Tool grounding


The **grounding services** do not have a single first-class name in classic DST, but they fit as business-logic-backed slot resolution and validation. In Rasa, this is usually custom extraction/validation code inside forms; in Lex, it is primarily dialog code hooks and conditional branching attached to slot capture or confirmation. ([Jurafsky & Martin 2026](#jurafsky-2026); [Rasa, Forms](#rasa-forms); see Quick Add feature specification)

Possible module labels:

- Category/account resolver -> custom slot extraction or slot resolution layer. ([Jurafsky & Martin 2026](#jurafsky-2026); see Quick Add feature specification)
- Duplicate detector -> validation/business rule layer before confirmation. ([Rasa, Forms](#rasa-forms); see Quick Add feature specification)
- Defaults/history enrichment -> dialogue-context-informed slot filling or business-logic enrichment. ([Sun et al. 2022](#sun-2022); see Quick Add feature specification)
- Provenance/confidence -> not a standard Rasa/Lex primitive, but an **observability extension** on top of DST state. (see Quick Add feature specification)

### Recommended terminology


A design document can use two vocabularies so both NLP and product readers can follow the design. ([Jurafsky & Martin 2026](#jurafsky-2026); see Quick Add feature specification)

- **NLP/conversational AI:** task-oriented dialogue, frame-based state, slot filling, dialogue state tracking, slot elicitation, validation, confirmation, fulfillment. ([Sun et al. 2022](#sun-2022); [Jurafsky & Martin 2026](#jurafsky-2026))
- **Product/architecture:** transaction draft, draft manager, enrichment, readiness criteria, action policy, execution gate, typed action executor. (see Quick Add feature specification)

A tight mapping sentence would be: "The draft manager is effectively a dialogue state tracker plus policy layer; it maintains the transaction frame, elicits and validates missing slots, and only hands off to fulfillment once the draft is confirmation-ready." ([Rasa, Forms](#rasa-forms); [Jurafsky & Martin 2026](#jurafsky-2026); see Quick Add feature specification)

### One nuance


The only place this design is **strictly richer** than default Rasa/Lex terminology is field provenance, patch history, and explicit separation between `ready_for_confirmation` and `execution_ready`. Classic frameworks support slot collection, validation, and confirmation, but the proposed draft object adds a more modern orchestration layer for explainability, observability, and safe typed execution boundaries. ([Rasa, Forms](#rasa-forms); see Quick Add feature specification)

A practical renamed component set could be:

- Draft Manager -> Dialogue State Tracker + Policy Orchestrator. ([Sun et al. 2022](#sun-2022); [Jurafsky & Martin 2026](#jurafsky-2026))
- Missing fields -> Required unfilled slots. ([Jurafsky & Martin 2026](#jurafsky-2026); see Quick Add feature specification)
- Clarification loop -> Slot elicitation loop. ([AWS, Next steps](#aws-lex-next-steps); see Quick Add feature specification)
- Readiness scorer -> Policy/completion gate. ([Jacqmin 2022](#jacqmin-2022); [Rasa, Forms](#rasa-forms))
- Confirm step -> Intent confirmation. ([Rasa, Forms](#rasa-forms))
- Executor -> Fulfillment / typed action execution. ([Rasa, Forms](#rasa-forms); see Quick Add feature specification)

---

Related: [Draft state and lifecycle]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/02-draft-state-and-lifecycle" >}}) · [Clarification as draft repair]({{< ref "ai/design/dialogue-approach/02-draft-pipeline/06-clarification-as-draft-repair" >}}) · [Dialogue systems and mixed-initiative interaction]({{< ref "ai/design/dialogue-approach/01-framing/04-dialogue-and-mixed-initiative" >}}).

Original text: [example.md](/ai/design/dialogue-approach/02-draft-pipeline/08-dialogue-framework-mapping.assets/example.txt) · [mapping.md](/ai/design/dialogue-approach/02-draft-pipeline/08-dialogue-framework-mapping.assets/mapping.txt).

## References


- Amazon Web Services. [Configure next steps in the conversation](https://docs.aws.amazon.com/lexv2/latest/dg/paths-nextstep.html). Amazon Lex V2 Developer Guide. ^aws-lex-next-steps
- Amazon Web Services. [Confirmation](https://docs.aws.amazon.com/lexv2/latest/dg/intent-confirm.html). Amazon Lex V2 Developer Guide. ^aws-lex-confirmation
- Amazon Web Services. [PostText](https://docs.aws.amazon.com/lex/latest/dg/API_runtime_PostText.html). Amazon Lex V1 API Reference. ^aws-lex-posttext
- Amazon Web Services. [Slots](https://docs.aws.amazon.com/lexv2/latest/dg/intent-slots.html). Amazon Lex V2 Developer Guide. ^aws-lex-slots
- Jacqmin, L. (2022). [Dialogue State Tracking: past, present, and future](https://talep.lis-lab.fr/seminars/2022-01-13-jacqmin.pdf). TALEP seminar slides, Aix-Marseille University, 13 January 2022. ^jacqmin-2022
- Janik, P. (2021). [RASA - requested_slot](https://dev.to/petr7555/rasa-requestedslot-4ai7). DEV Community. ^janik-2021
- Jurafsky, D., & Martin, J. H. (2026). [Frame-Based Dialogue Systems](https://web.stanford.edu/~jurafsky/slp3/K.pdf). Appendix K of *Speech and Language Processing*, 3rd edition draft. [PDF](/sources/15c773945807396b696ab2a8e25a9595.bin). ^jurafsky-2026
- Rasa. [Forms](https://rasa.com/docs/rasa/forms/). Rasa documentation. ^rasa-forms
- Schulz, H., Zumer, J., El Asri, L., & Sharma, S. (2017). [A Frame Tracking Model for Memory-Enhanced Dialogue Systems](https://aclanthology.org/W17-2626/). 2nd Workshop on Representation Learning for NLP. [doi:10.18653/v1/W17-2626](https://doi.org/10.18653/v1/W17-2626). ^schulz-2017
- Sun, Z., Huang, Z., & Ding, N. (2022). [On Tracking Dialogue State by Inheriting Slot Values in Mentioned Slot Pools](https://www.ijcai.org/proceedings/2022/607). IJCAI 2022. [doi:10.24963/ijcai.2022/607](https://doi.org/10.24963/ijcai.2022/607). ^sun-2022
