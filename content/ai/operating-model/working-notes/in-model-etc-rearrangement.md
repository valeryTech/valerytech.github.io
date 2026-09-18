---
draft: false
toc: true
title: "In Model Etc Rearrangement"
linkTitle: "In Model Etc Rearrangement"
---
# Rearrangement record for `in-model-etc.md`


This is an editorial record. It explains how the source text was arranged. It is not part of the source text.

## Rules used


- The baseline is `7c21461:ai/product-model/in/in-model-etc.md`.
- Its SHA-256 is `0a4867af53db6ddf0c4d5421b0b4ea104606d800bb266f90baad5c507a115e0d`.
- The original working-tree file had already been removed during the earlier split. The Git version is the preserved baseline.
- During the initial rearrangement, source text could be split and moved but not rewritten.
- A later grammar and flow edit changed wording while intending to preserve meaning.
- The recovered source-notes file summarizes some draft fragments. The Git baseline remains the authority for their exact wording.
- Short status notes may be added when a file could otherwise be mistaken for the current position. They must be marked as editorial.
- Every source passage must appear once across the output files.
- File names, marked status notes, and this record are editorial.

## Place in the model


The current position is in [`operating-model.md`]({{< ref "ai/operating-model/operating-model" >}}). It says that product leadership selects a strategic problem and desired outcome, while the product team owns solution decisions and takes part in both discovery and delivery.

The source also contains comparisons, older versions, and proposals that do not belong in the current position. They are kept in separate files.

The unit here is one problem and the work around possible solutions. This material does not explain company strategy or portfolio funding.

## File roles


| File | Role |
|---|---|
| [`feature-team-and-empowered-team.md`]({{< ref "ai/operating-model/comparisons/feature-team-and-empowered-team" >}}) | Comparison. It explains the change from a feature team to an empowered team. It contains a stronger outcome-accountability claim than the current model. |
| [`discovery-and-delivery.md`]({{< ref "ai/operating-model/discovery-and-delivery" >}}) | Selected explanation of discovery, delivery, and their interface. |
| [`capability-funnel.md`]({{< ref "ai/operating-model/working-notes/capability-funnel" >}}) | Working proposal for evaluating levels of AI product utility. |
| [`solution-as-central-object.md`]({{< ref "ai/operating-model/working-notes/solution-as-central-object" >}}) | Working proposal that treats the solution, rather than the feature, as the main object. |
| [`solution-states-and-terms-alternative.md`]({{< ref "ai/operating-model/working-notes/solution-states-and-terms-alternative" >}}) | Alternative state sequence and vocabulary. |
| [`experiment-as-primary-unit-alternative.md`]({{< ref "ai/operating-model/working-notes/experiment-as-primary-unit-alternative" >}}) | Alternative claim about the experiment and feature as units of work. |
| [`discovery-delivery-interface-alternative.md`]({{< ref "ai/operating-model/working-notes/discovery-delivery-interface-alternative" >}}) | Earlier four-part interface. |
| [`in-model-etc-source-notes.md`]({{< ref "ai/operating-model/working-notes/in-model-etc-source-notes" >}}) | Planning text, broken references, repeated text, revision comments, and placeholders. |

## Source disposition


| Source lines | Destination |
|---|---|
| 2-6 | `in-model-etc-source-notes.md` |
| 8, 304 | `experiment-as-primary-unit-alternative.md` |
| 10-46, 50-60, 62, 66, 70-145, 147-261, 265-298 | `feature-team-and-empowered-team.md`, in dependency order rather than source order |
| 48, 64, 68, 300, 302, 306, 310, 321, 324-334, 338-340, 369-371, 397, 486, 509-517, 560, 566, 582, the third sentence of 584, 609 | `in-model-etc-source-notes.md` |
| 263 | `comparisons/feature-team-and-empowered-team.md` |
| 308, 312-319, 322, 336, 351, 353, 355-367, 519-558, 562-564, 568-580, the first two sentences of 584, 586-607 | `discovery-and-delivery.md`, in dependency order rather than source order |
| 342-349, 373-395 | `discovery-delivery-interface-alternative.md` |
| 398-463 | `capability-funnel.md` |
| 465-471 | `solution-as-central-object.md` |
| 473-484, 488-507 | `solution-states-and-terms-alternative.md` |

## Decisions

### Outcome accountability


The source says that the empowered team is accountable for solving the problem or achieving the result. The current model says the limit is unresolved because a business result may also depend on pricing, sales, support, market conditions, and other teams.

The stronger source position remains in the comparison. It is not treated as current policy.

### Discovery and delivery interface


The later three-part version was selected:

- candidate solution;
- evidence and remaining risk;
- known constraints.

The earlier four-part version remains in its own file. Shared understanding is still important, but the later text treats it as a property of the continuing team rather than something passed between groups.

### Order of discovery and delivery


The source contains diagrams that look sequential. The selected document now defines discovery and delivery by purpose before showing those diagrams. The no-handoff statement and the two-way flow are kept with the interface.

### Solution and solution states


The claim that the solution is more useful than the feature as the main object is separate from the proposed sequence of solution states. The two claims are now in different files. The state names remain unsettled.

### Experiment and feature


The claim that the experiment is the main unit during AI discovery and the feature becomes the main unit later conflicts with the production-behavior model. It remains an alternative.

### Source notes


Text with placeholders, editing comments, broken references such as "the attached article" and "your draft," and claims that would need rewriting was moved out of the main reading path. Line 584 was split at a sentence boundary so its evidence rule could remain in the selected document while its reference to "your draft" moved here.

## Checks


- The disposition table assigns every nonblank source line to a current file. Line 584 is split at a sentence boundary between two destinations.
- The broken causal table was repaired. Its rows are together again.
- The selected and older interface versions are separate.
- The comparison, current explanation, alternatives, and raw source notes are separate.
- All new prose in source-derived files is visibly marked as editorial. Source-derived files state when wording was edited for grammar and flow.
- Conversational wording has been removed from the reader-facing text, except where it is part of an example or a quoted source title.

## Still open


- What result can a product team reasonably be accountable for?
- Does "capability" describe an ability of a live product, a level of solution utility, or both under different scopes?
- Are "discovered solution," "effective solution," and "production solution" useful states?
