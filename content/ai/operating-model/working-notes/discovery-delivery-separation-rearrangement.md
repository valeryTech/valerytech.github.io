---
draft: false
toc: true
title: "Discovery Delivery Separation Rearrangement"
linkTitle: "Discovery Delivery Separation Rearrangement"
---
# Rearrangement record for `discovery-deliery-separation.md`


This editorial record explains how the source text was arranged. It is not part of the source text.

## Rules used


- The preserved baseline is `HEAD:ai/product-model/in/discovery-deliery-separation.md`.
- Its SHA-256 is `9fec88e8b31b7bbfceb05cae57e8b318129ee019ab86e7702aabc25437019e1a`.
- The working-tree source file was removed after the split. The Git version is the authority.
- Removing the working-tree source was explicitly authorized after the annotated split was complete.
- During the rearrangement, source text could be split and moved but not rewritten.
- After the rearrangement was verified, the user asked for a separate grammar and flow edit. The wording in the output files may therefore differ from the source, but its meaning should not.
- Source-unit markers and line ranges record where each passage came from. They no longer mean that the passage is a verbatim copy.
- The Git baseline remains the authority for the original wording.
- File titles, editorial section headings, bridges, comments, source-unit markers, and this record are editorial.
- Editorial comments are visible because this is an annotated rearrangement.
- Citations are preserved with their source passages. Their accuracy was not checked in this rearrangement.
- The source file has no final newline. During the rearrangement, its last line gained a newline before the output unit's closing marker. This was the only normalization before the later language edit.

## Selected position


The current position remains the one stated in [`operating-model.md`]({{< ref "ai/operating-model/operating-model" >}}):

- Discovery and delivery are concurrent kinds of work defined mainly by purpose.
- A production commitment changes the obligations attached to a solution.
- Production commitment does not end discovery and start delivery as sequential phases.

The source file mixes five other questions into this distinction:

- what obligations an artifact carries;
- where AI is useful;
- how much AI autonomy is safe;
- what platform controls are needed;
- which people take part and what roles they have.

These questions are related, but they are not one scale. The rearrangement separates them.

## File roles


| File | Role |
|---|---|
| [`discovery-delivery-practitioner-evidence.md`]({{< ref "ai/operating-model/working-notes/discovery-delivery-practitioner-evidence" >}}) | Practitioner examples and the source author's conclusions about AI use. |
| [`production-commitment-boundary-alternative.md`]({{< ref "ai/operating-model/working-notes/production-commitment-boundary-alternative" >}}) | Earlier boundary formulations, prototype purpose, production context, and the effect of a production commitment. |
| [`discovery-delivery-platform-proposal.md`]({{< ref "ai/operating-model/working-notes/discovery-delivery-platform-proposal" >}}) | A proposed platform design kept outside the current model. |
| [`discovery-delivery-evaluation-evidence-deferred.md`]({{< ref "ai/operating-model/working-notes/discovery-delivery-evaluation-evidence-deferred" >}}) | Evaluation evidence held for the separate evaluation section. |
| [`discovery-delivery-separation-source-notes.md`]({{< ref "ai/operating-model/working-notes/discovery-delivery-separation-source-notes" >}}) | The remaining future research question. |

## Source disposition


The units are listed in source order. The units assigned to the evidence file appear there in a different order.

| Unit | Source lines | Destination |
|---|---:|---|
| DDS-01 | 2 | Removed with `comparisons/discovery-delivery-and-role-model.md` after the split. The original remains in Git. |
| DDS-02 | 4 | `working-notes/discovery-delivery-practitioner-evidence.md` |
| DDS-03 | 6-19 | `working-notes/discovery-delivery-practitioner-evidence.md` |
| DDS-04 | 21 | `working-notes/discovery-delivery-practitioner-evidence.md` |
| DDS-05 | 23-27 | `working-notes/discovery-delivery-practitioner-evidence.md` |
| DDS-06 | 29-31 | `working-notes/discovery-delivery-practitioner-evidence.md` |
| DDS-07 | 33-58 | `working-notes/discovery-delivery-practitioner-evidence.md` |
| DDS-08 | 60-64 | `working-notes/discovery-delivery-practitioner-evidence.md` |
| DDS-09 | 66-90 | `working-notes/discovery-delivery-practitioner-evidence.md` |
| DDS-10 | 92 | `working-notes/discovery-delivery-practitioner-evidence.md` |
| DDS-11 | 94 | `working-notes/discovery-delivery-evaluation-evidence-deferred.md` |
| DDS-12 | 96-114 | `working-notes/discovery-delivery-practitioner-evidence.md` |
| DDS-13 | 116-136 | `working-notes/discovery-delivery-practitioner-evidence.md` |
| DDS-14 | 138-146 | `working-notes/production-commitment-boundary-alternative.md` |
| DDS-15 | 148-150 | `working-notes/production-commitment-boundary-alternative.md` |
| DDS-16 | 152-170 | `working-notes/production-commitment-boundary-alternative.md` |
| DDS-17 | 172 | `working-notes/discovery-delivery-platform-proposal.md` |
| DDS-18 | 174-176 | `working-notes/discovery-delivery-platform-proposal.md` |
| DDS-19 | 178-216 | `working-notes/discovery-delivery-platform-proposal.md` |
| DDS-20 | 218-222 | `working-notes/discovery-delivery-platform-proposal.md` |
| DDS-21 | 224-226 | `working-notes/discovery-delivery-platform-proposal.md` |
| DDS-22 | 228-238 | Removed with `comparisons/discovery-delivery-and-role-model.md` after the split. The original remains in Git. |
| DDS-23 | 240-257 | Removed with `comparisons/discovery-delivery-and-role-model.md` after the split. The original remains in Git. |
| DDS-24 | 259 | `working-notes/discovery-delivery-practitioner-evidence.md` |
| DDS-25 | 261 | `working-notes/discovery-delivery-separation-source-notes.md` |

## Order of the evidence


The source moves from one practitioner to another. The rearranged evidence follows the argument instead:

1. the purpose distinction and its comparison table;
2. an organizational example;
3. AI used during discovery and delivery work;
4. engineering responsibility and internal quality;
5. the source author's reading list.

The evaluation paragraph was removed from this sequence because evaluation is being handled separately. An editorial note restores its reference to Teresa Torres.

## Decisions

### Purpose is the definition


The source table mixes the purpose of the work with code lifetime, acceptable shortcuts, AI autonomy, expertise, and the cost of failure. The purpose row gives the definition. The other rows describe patterns that may or may not apply in a particular case.

### Work and roles are separate axes


Discovery and delivery classify work. Citizens, agents, and experts classify participants. The source warns that a role-based sequence could turn engineers into an approval service. The user later removed the comparison file that contained this passage, but the original remains in Git. The two models are not treated as direct substitutes.

### Commitment changes obligations


The prototype material contains a useful claim: language, repository, environment, and fidelity do not decide whether something is a production solution. Commitment changes the obligations attached to it.

Its vertical diagram is kept with a comment because it can look like discovery ends and delivery begins. That is not the current position.

### AI usefulness is not one scale


The source's chart of AI usefulness is kept as a working hypothesis. It is not based on measurements, and it compares categories that are not parallel. It is not used to define discovery, delivery, or a general autonomy policy.

### Responsibility remains with people


One source diagram says that a human or system accepts responsibility. A system may enforce controls, run checks, or block an action. It does not hold organizational responsibility. That remains with people and the organization.

### The platform model is a proposal


The two-mode platform diagram and platform principle are kept in a separate working note. They are not part of the current operating model. Discovery can still require strong identity, privacy, security, cost, and data controls. Delivery can still need fast feedback and tools that are easy to use.

### Evaluation remains separate


The paragraph about production traces, human labels, LLM judges, and release decisions is preserved in a deferred evaluation file. No change was made to the evaluation model.

### The commitment gate is not selected


The final source question uses "commitment gate." Its concrete questions remain useful, but the gate framing is preserved only as a source note.

## Checks


- The Git baseline matches its recorded checksum.
- The working-tree source file has been removed.
- Before the language edit, all 25 source units matched their recorded source spans. The final-line newline normalization is recorded above.
- Before the language edit, all 192 nonblank source lines appeared once across the six source-derived output files. No nonblank source line was missing or duplicated.
- After the language edit, 22 units remain in their recorded destination files. The user removed the comparison file containing DDS-01, DDS-22, and DDS-23. The disposition table records those removals.
- The original wording can still be recovered from the Git baseline.
- All external citation links from the retained units are unchanged.
- All local Markdown links in these files resolve.
- Every output file identifies its editorial text.
- `git diff --check` passes.

## Still open


- What evidence and approvals does each kind of production commitment require?
- Which controls should be shared by discovery and delivery environments?
- When can prototype code be used in a production implementation?
- How should AI autonomy depend on data, exposure, reversibility, and possible harm?
- How should the deferred evaluation evidence be used in the evaluation section?
