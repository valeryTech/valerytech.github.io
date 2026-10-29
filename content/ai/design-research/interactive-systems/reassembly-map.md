---
draft: false
toc: true
description: "A historical reconstruction audit maps original dialogue ranges to reorganized notes, recording extraction stages, relocations, added commentary, checksums, and preservation checks without validating the retained design or product claims."
title: "Reassembly Map"
linkTitle: "Reassembly Map"
---
# Interactive systems reassembly map


Public-edition note, 2026-10-28: Private source locations and machine-specific audit details are omitted or replaced with neutral archive labels. Historical coordinates and checksums describe earlier snapshots, not the edited public files.

Editorial context, 2026-10-20: This map is a historical record of the reassembly before the plain-language editorial pass. Its checksums, byte counts, line ranges, and statements of unchanged wording describe the text at that earlier stage, not the current edited notes.

## Hebbia folder relocation, 2026-10-05


The Hebbia case folder moved from `projects/input/hebbia-sem/` to `ai/input/hebbia-sem/`. Links below point to its current location. Historical JSON manifests retain their original paths and checksums; resolve that old prefix through the [relocation record](/ai/design-research/interactive-systems/reassembly-map.assets/relocation-map.json). Only navigation links were edited, with no retained dialogue changes or line-range shifts.

## Stage 1: visual-programming dialogue


The mapping and whole-file checksums in stage 1 describe its historical snapshot. Stage 3 extracts the author's observation from the first case note. Use the [current dialogue mapping](/ai/design-research/interactive-systems/reassembly-map.assets/03-hebbia-design-observations-reassembly.json) for reconstruction after that extraction.

Date: 2026-10-01. The user approved splitting documents one at a time and separating Hebbia-specific material from general design ideas.

The source was visual-programming-env.md. Before the split, it contained 1469 lines and 32,504 bytes. Its SHA-256 checksum was `441741dea228316e6c7f3911b6e6d15c2e674c160a607cf3a457e69e302b8c68`.

Only that source dialogue was split in this pass. The other Hebbia inputs and the other candidate dialogues remain available for separate passes.

## Source-to-destination mapping


The ranges below are inclusive and one-based. Original source positions refer to the complete document before any moves. Destination positions exclude the new navigation before each passage.

| Original source lines | Destination passage | Destination lines | Lines | Bytes | Passage SHA-256 |
|---|---|---|---|---|---|
| 1 to 179 | Hebbia Matrix observations and initial critique | 13 to 191 | 179 | 4644 | `e11888fe9791134b6eadca95b2261ab24d2ec62fd7939de283e17f11ff8d801c` |
| 180 to 408 | [Shared state, coordinated views, and participants]({{< ref "ai/design-research/interactive-systems/01-shared-investigation-state-and-views" >}}) | 13 to 241 | 229 | 4063 | `b55224138baf7ec87f8e68c55802fbb26daa207a6033ad9f1b4a56f35c89e8fe` |
| 409 to 484 | [Stable interaction grammar and composable interface components]({{< ref "ai/design-research/interactive-systems/02-stable-interface-components" >}}) | 13 to 88 | 76 | 2393 | `0b3dc43627b89038e1daefde37ee9c10084783cc95c547d9a2d248c08fbbf88d` |
| 485 to 1050 | [User correction, typed operations, progressive inspection, and composition]({{< ref "ai/design-research/interactive-systems/03-composable-investigation-workspaces" >}}) | 15 to 580 | 566 | 11386 | `3c78370aa0c8c9f384d49eb26760d8b9722f776cffc82afd8edba69c69d741d4` |
| 1051 to 1469 | [Complete multi-representation retrieval dialogue and inspection projections]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}) | 15 to 433 | 419 | 10018 | `5d2857e78449cb21a7b9da16329999afd24efad9a5c91aacffe75ff4772a723b` |

The moved passages total 1469 lines and 32,504 bytes. The source ranges cover every original line exactly once, with no gaps or overlaps.

The [JSON manifest](/ai/design-research/interactive-systems/reassembly-map.assets/reassembly-map.json) records the same mapping, destination-prefix checksums, complete destination checksums, move commands, and verification results.

## Move procedure


Every move used `_scripts/move_text.py` with a dry run before `--apply`. New destination navigation was created before the moves, and each unchanged source passage was appended with `--at-end`.

The moves ran from the end of the source toward the beginning:

1. Original lines 1051 to 1469 moved to the retrieval-model note.
2. Original lines 485 to 1050 moved to the composition note.
3. Original lines 409 to 484 moved to the interface-component note.
4. Original lines 180 to 408 moved to the shared-state note.
5. Original lines 1 to 179 moved to the Matrix case note.

Moving the later ranges first kept the remaining source line numbers unchanged. Each applied move was checked against the expected source remainder and destination bytes.

The source had zero bytes after the moves. It then received a navigation stub with links in the original reading order, so its existing path remains usable.

## Dialogue context


The first user question and the opening critique remain together in the Matrix case note. The remainder of the first reply was split into shared representations and collaboration, followed by stable interface components. Both continuation notes link to the question and to the later correction.

The second user question challenges fixed matrices, cubes, and graphs. Its complete reply remains in the composition note, including the operator examples, inspection blocks, collaboration examples, and proposed contracts.

The third user question and its complete reply remain together in the retrieval-model note. No code block was divided by a split.

Original wording, headings, diagrams, code, blank lines, and line endings were retained. No passage was replaced by a summary.

## New editorial text


The destination titles and introductory navigation are new text, outside the mapped passage ranges. The [collection index]({{< ref "ai/design-research/interactive-systems/00-index" >}}) provides the reading order and lists documents awaiting a separate pass.

The sibling [comments note]({{< ref "ai/design-research/interactive-systems/00-index-comments" >}}) contains new analysis. It distinguishes the early graph proposal from the later composition correction, operations from views, and inspection records from evidence guarantees.

The design-research index received links to the new collection and retrieval-model note. No existing source-bearing design-research passage was edited by this pass.

Hebbia references remain within the retained general-design passages where they were part of the original argument. Separating the case from the general proposals did not require rewriting those references. Product and literature claims were not independently verified.

## Verification


The five destination passages were reconstructed in ascending original-source order. Their concatenation matched the original source byte for byte:

- Reconstructed lines: 1469.
- Reconstructed bytes: 32,504.
- Reconstructed SHA-256: `441741dea228316e6c7f3911b6e6d15c2e674c160a607cf3a457e69e302b8c68`.
- Retained passages: five, each matching its recorded checksum.
- Source text omitted or duplicated in the reconstruction: zero bytes.

All 60 other files in the captured design-research and Hebbia baseline were unchanged immediately after the source moves. The intended index additions were made afterward.

Unrelated work-complexity edits appeared in the workspace during the pass, including changes to the builder-method note and the shared design-research index. Those edits were preserved, and the manifest records the observed differences separately. Verification of this split depends on its own mapped passages and source checksum, not on unrelated files remaining unchanged.

No original note path was deleted. No files were staged or committed.

## Stage 2: Hebbia product analysis


Date: 2026-10-01. This pass continues the document-by-document split and keeps product-specific analysis separate from general design proposals.

The source was hebbia-analysis-1.md. Before the split, it contained 856 logical lines and 30,899 bytes. The final line had no newline. Its SHA-256 checksum was `9dd7ccc02c76319dbe2e9696136cc9909e685629351a27461e9596ce8a7eb94c`.

### Mapping


The ranges below are inclusive and one-based. Destination ranges contain only retained source text; each note has 13 new navigation lines before its first passage.

| Original source lines | Destination passage | Destination lines | Lines | Bytes | Passage SHA-256 |
|---|---|---|---|---|---|
| 1 to 32 | Product and workflow context | 14 to 45 | 32 | 2369 | `9aef28804a9e4515dbed5238937dcdecd05082e0c518480428b4aae8e4b88a80` |
| 33 to 134 | Matrix execution and analysis modes | 14 to 115 | 102 | 3442 | `bb77f52a30cfdab5d1be1fffb7c5406325843b4a5cc1f10daeca88696d658166` |
| 135 to 350 | Document understanding and retrieval | 14 to 229 | 216 | 8206 | `d5d8dcbb834a7f1884cb7b60cf11a4f248c753501835515654310a496648d53d` |
| 351 to 454 | Evidence contracts and product comparison | 14 to 117 | 104 | 4665 | `04bba89bde434626b1e2c1f2c8c7486f5a37575713b7f11337ea473d78258d93` |
| 455 to 479 | Matrix execution and analysis modes | 116 to 140 | 25 | 856 | `93c545bed108856ca00b5e20c96dd5415bd3e640cc7e4834cf8de72ecb7cbf76` |
| 480 to 571 | Evidence contracts and product comparison | 118 to 209 | 92 | 2687 | `a62b7289a816f46373f3f51bb988bc6eb3d24e7cd7918e56e2f00056a2d0f19b` |
| 572 to 627 | Document understanding and retrieval | 230 to 285 | 56 | 1976 | `156bc0b42245d5f64ccd9970de574bfe2b2da3430f1236351d678234fa249a74` |
| 628 to 781 | Product and workflow context | 46 to 199 | 154 | 3656 | `1fae0721d1cf61aaf066f4eccbbf11ba4304aa4db354df268a51c47275c93fbb` |
| 782 to 856 | Evidence contracts and product comparison | 210 to 284 | 75 | 3042 | `73dba14903d2c629bab546637babca7b2328084d509d0e41dad0ca7e8e2d017d` |

These nine source ranges cover every original line exactly once. Within each destination, passages remain in their original relative order. The four-note thematic reading path differs from the original sequence, which the table preserves.

The [stage 2 JSON manifest](/ai/design-research/interactive-systems/reassembly-map.assets/02-hebbia-analysis-reassembly.json) records the ranges, checksums, destination prefixes, commands, and verification results. The stage 1 manifest remains a separate record.

### Procedure and context


Every passage moved through `_scripts/move_text.py`, with a non-mutating dry run followed by `--apply`. Moves ran in descending original-source order, from lines 782 to 856 through lines 1 to 32. Each passage was inserted after the destination's unique retained-source marker. Inserting earlier passages before already moved later passages preserved their order within each note.

The source was empty after all nine moves. It then received a navigation stub at the same path. No original path was deleted.

The citation correction remains with the product introduction. The complete capability table, conclusion, and proposed Research Result schema remain together with the evidence comparison. All original headings, links, diagrams, tables, blank lines, and line endings were retained. No code fence was divided.

The separate comments explain why this response remains a case study. They distinguish undocumented capabilities from proven absence, and coverage records from evidence correctness or completeness. Product claims were not independently verified.

The [interactive-systems index]({{< ref "ai/design-research/interactive-systems/00-index" >}}) now links the four case notes and no longer lists this source as awaiting a pass. No existing general-design payload was edited. Related concepts are linked rather than copied.

### Verification


Reconstructing the nine passages in ascending original-source order reproduced the original bytes exactly:

- Reconstructed logical lines: 856.
- Reconstructed bytes: 30,899.
- Reconstructed SHA-256: `9dd7ccc02c76319dbe2e9696136cc9909e685629351a27461e9596ce8a7eb94c`.
- Omitted or duplicated source bytes: zero.
- Applied moves: nine, each checked against the expected source remainder and destination.
- Other files in the captured baseline: 79, all unchanged immediately after the source moves.
- Final local links checked: 87, including eight heading anchors, with no missing targets.
- Retained stage 1 passages: all five still reconstruct the original 32,504 bytes exactly.

The neighbouring chat, "Reassemble design research notes (2)", was inspected read-only. Its interactive-investigation and collaboration work was left intact. Retained stage 1 passages can be checked separately even when later work appends new text to a destination; historical whole-file checksums describe the earlier snapshot.

Later changes appeared in the shared design-research index and the joint-activity and collaboration-patterns notes and comments. They were preserved and are recorded separately in the stage 2 manifest. At the final chat check, the neighbour had moved the collaboration-report passages and was checking their reconstruction.

No files were staged or committed.

## Stage 3: author's design observations


Date: 2026-10-01. The user asked to extract their own reaction to the ideas proposed by Hebbia.

The complete original observation moved from lines 13 to 21 of the Matrix case note into [design observations prompted by Hebbia]({{< ref "ai/design-research/interactive-systems/04-design-observations-from-hebbia" >}}), at lines 13 to 21. The passage contains nine lines and 869 bytes. Its SHA-256 checksum is `fe1eb8fc6b7a56714039b97666f1421895214e439e2b1cf84a7bd2558a705835`.

The source at the time of extraction was matrix-interface-observations.md, with 191 lines, 5760 bytes, and SHA-256 `c8c190ea6eb1a265e92cb262323d48f1ec69582c29a3fc6fb3074f29fe220dad`.

The move used `_scripts/move_text.py` with `--lines 13:21 --at-end`, first as a non-mutating dry run and then with `--apply`. The resulting source and destination were checked against the expected bytes. New navigation was edited afterward.

### Current mapping for the complete first dialogue


The table below replaces the historical stage 1 destination positions for current reconstruction. Original source positions still refer to the complete visual-programming dialogue before its first split.

| Original source lines | Current destination passage | Destination lines | Lines | Bytes | Passage SHA-256 |
|---|---|---|---|---|---|
| 1 to 9 | [Author's original reaction and design proposals]({{< ref "ai/design-research/interactive-systems/04-design-observations-from-hebbia" >}}) | 13 to 21 | 9 | 869 | `fe1eb8fc6b7a56714039b97666f1421895214e439e2b1cf84a7bd2558a705835` |
| 10 to 179 | Original separator and complete opening LLM critique | 13 to 182 | 170 | 3775 | `25f7704b72a4fb1348203e71aae29a0f832d0284b7c91471909b5a60ea458e21` |
| 180 to 408 | [Shared state, coordinated views, and participants]({{< ref "ai/design-research/interactive-systems/01-shared-investigation-state-and-views" >}}) | 13 to 241 | 229 | 4063 | `b55224138baf7ec87f8e68c55802fbb26daa207a6033ad9f1b4a56f35c89e8fe` |
| 409 to 484 | [Stable interaction grammar and composable interface components]({{< ref "ai/design-research/interactive-systems/02-stable-interface-components" >}}) | 13 to 88 | 76 | 2393 | `0b3dc43627b89038e1daefde37ee9c10084783cc95c547d9a2d248c08fbbf88d` |
| 485 to 1050 | [User correction, typed operations, progressive inspection, and composition]({{< ref "ai/design-research/interactive-systems/03-composable-investigation-workspaces" >}}) | 15 to 580 | 566 | 11386 | `3c78370aa0c8c9f384d49eb26760d8b9722f776cffc82afd8edba69c69d741d4` |
| 1051 to 1469 | [Complete multi-representation retrieval dialogue and inspection projections]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}) | 15 to 433 | 419 | 10018 | `5d2857e78449cb21a7b9da16329999afd24efad9a5c91aacffe75ff4772a723b` |

The [current JSON manifest](/ai/design-research/interactive-systems/reassembly-map.assets/03-hebbia-design-observations-reassembly.json) records the complete mapping and the extraction command. The historical stage 1 manifest retains its snapshot values and points to this current mapping.

### Interpretation and navigation


The author's observation is now the first entry in the interactive-systems reading path. The LLM critique remains in the case folder and links back to it. The visual-programming navigation stub links both in their original order.

The [new sibling comments]({{< ref "ai/design-research/interactive-systems/04-design-observations-from-hebbia-comments" >}}) distinguish the author's observations, their proposed extensions, and the LLM's later elaboration. The author's original wording was not replaced by a summary.

The original separator and the complete opening LLM reply remain unchanged. The later question challenging rigid matrices and graphs remains with its complete reply. The semantic-engineering note's selected Hebbia descriptions were linked but not moved in this pass.

### Verification


All six current passages reconstruct the complete original dialogue exactly:

- Original and reconstructed logical lines: 1469.
- Original and reconstructed bytes: 32,504.
- Reconstructed SHA-256: `441741dea228316e6c7f3911b6e6d15c2e674c160a607cf3a457e69e302b8c68`.
- Omitted or duplicated original bytes: zero.
- The extracted observation and remaining opening reply together reproduce the old first passage's checksum.
- The other original stage 1 passages retain their recorded checksums.
- The stage 2 product-analysis passages also reconstruct their original 30,899 bytes exactly.
- Final local links checked: 100, including four heading anchors, with no missing targets.

Only new navigation and separate comments were written around the unchanged source passages. No original path was deleted, and no files were staged or committed.

## Stage 4: semantic-engineering dialogue


Date: 2026-10-01. The pass continues with semantic-eng.md. The complete source was read before the split.

Before the split, the source contained 439 logical lines and 17,434 bytes. The final line had no newline. Its SHA-256 checksum was `798105771b8191e04ab9de78a0b0e2302212ab0381cb7623530a7557e5e7e4ee`.

### Source-to-destination mapping


The inclusive, one-based source ranges refer to the complete document before any moves. Destination ranges contain retained source text, not the new navigation.

| Original source lines | Destination passage | Destination lines | Lines | Bytes | Passage SHA-256 |
|---|---|---|---|---|---|
| 1 to 16 | [Author's closed-corpus requirements]({{< ref "ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis" >}}) | 14 to 29 | 16 | 1110 | `74e698c501459427e29eb8335a263f738dbdab9684726fb8c8efffe8056cd3cd` |
| 17 to 50 | Selected Hebbia descriptions, marked interesting | 148 to 181 | 34 | 1334 | `aca51d51f5b26342cf66e8029d57f6c2d843d87c9ae471e40d14c7db065ae2f9` |
| 51 to 87 | [Opening LLM evidence-synthesis framing]({{< ref "ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis" >}}) | 30 to 66 | 37 | 1253 | `be0bb041871410a161af05e2f9b428f4f03b0277aa3858c84fd3bf7e84fa2707` |
| 88 to 107 | Competitor comparison and market-gap hypothesis | 14 to 33 | 20 | 2908 | `da3639f3676ec4eb2472720024cf20115f9d5676926845dd86b88621fbd344d3` |
| 108 to 190 | [Coverage ledger and proposed outcome states]({{< ref "ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis" >}}) | 67 to 149 | 83 | 1406 | `4cee79a1e060ff2a90ec1b5c90628c18190a4fcc0c2b007f438a649505e8e94c` |
| 191 to 277 | [Document representations and iterative retrieval pipeline]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}) | 602 to 688 | 87 | 3266 | `6878942042391c5a15f1bf7366a79f89a50c306ff47bba171fa46cebd7eefca2` |
| 278 to 327 | [Inspectable authority and conflict policy]({{< ref "ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis" >}}) | 150 to 199 | 50 | 1464 | `c0bb5ce577afe059ca2c22cb2f6b78979984c08bebee69024c70e06eedfb0ebe` |
| 328 to 439 | Markets, complete governance example, analogues, and MVP | 34 to 145 | 112 | 4693 | `da3426c9cf889579738501088b253d68fc052c1b205322d49da1edc4b308c474` |

The eight source ranges cover all 439 original lines exactly once. Within each destination, the imported passages remain in their original relative order. The original cross-document sequence can be reconstructed from the table.

The [stage 4 JSON manifest](/ai/design-research/interactive-systems/reassembly-map.assets/04-semantic-engineering-reassembly.json) records the complete mapping, destination prefixes, commands, previous destination checksums, and verification results.

### Procedure


All eight moves used `_scripts/move_text.py`, with a non-mutating dry run followed by `--apply`. They ran from original lines 328 to 439 down to lines 1 to 16. Earlier passages were inserted after a unique marker and before already moved later passages in the same destination.

The source was empty after the moves and then received a navigation stub at its existing path. The source's original final line remains without a newline in the product-hypothesis note. No original path was deleted.

New section navigation was appended to the existing Matrix and retrieval notes before their imports. Their complete pre-existing contents remained byte-identical:

- Matrix note, previous 140 lines and 5384 bytes, SHA-256 `cf4d71a03cfbf9f6ed2d6375d5514ecba846ec25c805ce56435d6c343abf1868`.
- Retrieval note, previous 594 lines and 16,172 bytes, SHA-256 `9a0e594553738dce8496beafdbec8ebf1217d18ea542261d4cfc6a77cdf8d6e3`.

### Placement and authorship


The new [bounded-corpus evidence-synthesis note]({{< ref "ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis" >}}) retains the author's complete requirements. The original "analysis" heading marks the start of the LLM response. The same note retains its evidence-contract framing, coverage ledger, outcome proposals, and authority policy.

The passage marked "hebbia - interesting" now follows the existing Matrix case analysis. It remains a selected description, not the author's exact spoken reaction. Its incomplete final sentence was retained as found; no diagram was discarded.

The complete multi-representation retrieval diagram and iterative loop now follow the existing retrieval discussions. All prior dialogues and interactive-investigation examples in that note were preserved.

Market rankings, competitor claims, the complete governance example, commercial analogues, and initial product scope remain in a separate product-hypothesis note. They are saved proposals rather than verified demand or accepted decisions.

The [sibling comments]({{< ref "ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis-comments" >}}) distinguish coverage records from completeness, authority policies from universal rankings, and illustrative counts from measured results. They also link the later Hebbia citation correction. Original citations and wording were not edited or independently verified.

The design-research and interactive-systems indexes received links. The earlier comments on the author's Hebbia observation now link to the selected passage's current location. No source-bearing passage outside this dialogue was rewritten.

### Verification


- Reconstructed logical lines: 439.
- Reconstructed bytes: 17,434.
- Reconstructed SHA-256: `798105771b8191e04ab9de78a0b0e2302212ab0381cb7623530a7557e5e7e4ee`.
- Omitted or duplicated original bytes: zero.
- Applied moves: eight, each checked against its expected source remainder and destination bytes.
- No code fence, complete pipeline diagram, market table, or governance example was divided.
- Other captured files: 90, all unchanged immediately after the source moves.
- The earlier product-analysis and current visual-programming mappings still reconstruct 30,899 and 32,504 bytes respectively.
- Final local links checked: 245, including 21 heading anchors, with no missing targets.

Whole-file checksums in older manifests describe their snapshots. This pass appends to two recipients, so current reconstruction uses the recorded passage ranges and checksums rather than requiring those files to remain frozen.

No files were staged or committed.

## Stage 5: task-specific context assembly


Date: 2026-10-01. The source was task-specific-context-assembly.md, a short sketch without speaker labels. It contained eight logical lines and 690 bytes, and its final line had no newline. Its SHA-256 checksum was `fe390ad48532c036ce9a792909c8eca2afe2786457daf008181d129521c00697`.

### Mapping


The ranges below are inclusive and one-based, and all blank lines are included. Destination ranges contain only the unchanged source passages.

| Original source lines | Destination passage | Destination lines | Lines | Bytes | Passage SHA-256 |
|---|---|---|---|---|---|
| 1 to 4 | [Evidence contract and related links]({{< ref "ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis" >}}#task-specific-context-assembly) | 207 to 210 | 4 | 279 | `b2290868d8c35362c8cc9844df2b38d0387f05dc92c56f08c85f892e3ac31f88` |
| 5 to 7 | [Retrieval methods]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}#retrieval-methods-for-context-assembly) | 696 to 698 | 3 | 118 | `d627f62882986c86b87b198d57bbd1daf82d8f36a58e7b97cf91ade4066c1cef` |
| 8 | Regulated quality systems as a possible application | 14 | 1 | 293 | `bd55f9057003aa065b899948f3c431e1e965048b6ede00114d06ed2f8f489338` |

The [stage 5 JSON manifest](/ai/design-research/interactive-systems/reassembly-map.assets/05-context-assembly-reassembly.json) records the complete mapping, destination prefixes, prior destination checksums, move commands, and verification.

### Procedure and placement


All three moves used `_scripts/move_text.py`, with a non-mutating dry run before `--apply`. They ran from original line 8 to lines 5 to 7, followed by lines 1 to 4. Each move was checked against the expected source remainder and destination bytes.

The source was empty after the moves and then received a navigation note at its existing path. Original blank lines, the abbreviated links, the wiki link, and the final line's missing newline were retained.

The general statements join existing notes rather than creating new general notes. Their complete prior contents remain byte-identical:

- Evidence-synthesis note, previous 199 lines and 6475 bytes, SHA-256 `d15547e86f90a58eeb3f65deece89fed361e2b84e37a001c1961289861dd9368`.
- Retrieval note, previous 688 lines and 20,066 bytes, SHA-256 `f6cee6b05d5ad357acb0ab0103ea4cf9e1cf2c2588f29a8a78f6a01684019ee2`.

The domain sentence remains a tentative application hypothesis, with its original "(?)". Its regulatory claim was not checked. The sentence is not a claim about Hebbia or a replacement for the engineering-governance candidate in the existing product hypotheses.

A separate linked case note preserves the domain sentence's missing final newline. Appending it to the existing product-hypothesis note would require changing that note's original ending, which also has no newline. Only an editorial navigation line in the existing note was expanded, and all of its retained source ranges remain unchanged. The editor added a final newline during that navigation edit, so a formatting command restored the original ending before verification.

The [existing sibling comments]({{< ref "ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis-comments" >}}#task-specific-context-assembly) now explain the split. The interactive-systems index links the completed sketch and no longer lists it as pending.

### Verification


- Reconstructed logical lines: eight.
- Reconstructed bytes: 690.
- Reconstructed SHA-256: `fe390ad48532c036ce9a792909c8eca2afe2786457daf008181d129521c00697`.
- Omitted or duplicated original bytes: zero.
- Previous mappings still reconstruct the product-analysis dialogue, visual-programming dialogue, and semantic-engineering dialogue as 30,899, 32,504, and 17,434 bytes respectively.
- Earlier retained passage ranges and checksums are unchanged.
- Local links checked in the eight changed Markdown files: 147, including 31 heading anchors, with no missing targets.
- The scoped whitespace check passed.

At the final verification snapshot, 88 of the 90 captured files outside the intended edits were unchanged. Unrelated changes appeared in the shared design-research index and augmentation note during the pass. Neither file was edited or reverted by this pass, and the JSON manifest records the observed checksums separately.

Whole-file checksums in earlier manifests remain historical snapshots. The two appended notes are reconstructed from their retained passage ranges rather than compared with older complete-file snapshots.

No original note path was deleted, and no files were staged or committed.

## Stage 6: complex UI design dialogue


Date: 2026-10-01. The source was 0919-research-complex-ui-design.md (archived source 018), in the linked source archive collection. Before the split, it contained 173 lines and 14,749 bytes, with a final newline. Its SHA-256 checksum was `[private-source checksum omitted]`.

### Mapping


The ranges below are inclusive and one-based, and all blank lines are included. Destination ranges contain only original source text.

| Original source lines | Destination passage | Destination lines | Lines | Bytes | Passage SHA-256 |
|---|---|---|---|---|---|
| 1 to 26 | [Opening question, role labels, and initial resource list]({{< ref "ai/design-research/interactive-systems/06-complex-interface-reading-path" >}}) | 14 to 39 | 26 | 4506 | `f0811a9296a44091363e16e710d551d161c48fa546de15f6cc57ce78b1f3e69d` |
| 27 to 80 | [Complete architecture diagram, TypeScript example, and asynchronous-result explanation]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation" >}}) | 14 to 67 | 54 | 2873 | `711b90e4d5efd0ce1309b565d9535f681a52ada30356bb4fd79001e035327b82` |
| 81 to 173 | [First reading sequence, practitioner request, and complete revised reply and reading sequence]({{< ref "ai/design-research/interactive-systems/06-complex-interface-reading-path" >}}) | 40 to 132 | 93 | 7370 | `48e84e14f36dbbcfcb0a6e756fab309caed9ad607100e48c6cb4ee9374c7a67c` |

The [stage 6 JSON manifest](/ai/design-research/interactive-systems/reassembly-map.assets/06-complex-ui-reassembly.json) records the complete mapping, destination prefixes, commands, source navigation checksum, and verification.

### Procedure and dialogue context


All three moves used `_scripts/move_text.py`, with a non-mutating dry run before `--apply`. They ran from original lines 81 to 173 through lines 27 to 80, followed by lines 1 to 26. Earlier reading material was inserted before the already moved later material after the same unique source marker.

Each move was checked against its expected source remainder and destination bytes. The source was empty after the moves and then received a navigation note at its existing path. The move script resolved the source in source archive and the destinations in notes without copying the source through a summary.

The architecture note retains the first reply's complete proposal, diagram, TypeScript example, and explanation. It links to the original question in the reading note rather than presenting the passage as an independent user requirement.

The reading note retains the opening question, initial resource list, first reading order, later practitioner request, and complete revised reply. The tldraw and ProseMirror diagrams remain with their case descriptions. Both original role-label sequences and the source's original title remain unchanged.

The original reading order begins in the reading note, continues through the architecture note, and returns to the reading note for the first reading sequence and practitioner exchange. The source overview and mapping preserve that order even though the collection offers a thematic reading path.

### New comments and navigation


The [architecture comments]({{< ref "ai/design-research/interactive-systems/05-application-state-and-computation-comments" >}}) distinguish document, interaction, job, and derived state. They identify missing rules for applying state changes, accepting asynchronous results, cancellation, undo, and replay. The comments present possible policies as open choices rather than changing the original code example.

The [reading-path comments]({{< ref "ai/design-research/interactive-systems/06-complex-interface-reading-path-comments" >}}) preserve the change from a broad resource list to practitioners and built systems. They keep case descriptions and the xi caution identifiable, and they record that cited resources and product claims were not independently checked.

The existing shared-state and composition notes are linked rather than rewritten. The index now includes both new notes and no longer lists the complex UI dialogue as pending. The collection comments link the completed split in place of the earlier candidate-source paragraph.

### Verification


- Reconstructed lines: 173.
- Reconstructed bytes: 14,749.
- Reconstructed SHA-256: `d19e366aaa9db8af6e9dd70e5432872c40c7a0ac326b5693009d29da890e1e4e`.
- Omitted or duplicated original bytes: zero.
- Complete original code blocks: four, all retained without dividing a code fence.
- Original final newline: preserved.
- Previous mappings still reconstruct the product-analysis, visual-programming, semantic-engineering, and context-assembly sources as 30,899, 32,504, 17,434, and 690 bytes respectively.
- Local links checked in the eight changed Markdown files: 138, including 16 heading anchors, with no missing targets.
- The scoped whitespace checks passed in both notes repositories.

At the final verification snapshot, 100 of the 101 captured files outside the intended edits were unchanged. The shared design-research audit changed during the pass. The audit was not edited or reverted by this pass, and the JSON manifest records the observed checksums separately.

Older whole-file checksums remain historical snapshots. The existing retained source passages were not edited, and their recorded ranges and checksums still reconstruct the earlier dialogues.

No original note path was deleted, and no files were staged or committed.

## Stage 7: natural-language interface dialogue


Date: 2026-10-01. The source was nlp-interface.md (archived source 019), in the linked source archive collection. Before the split, it contained 764 lines and 23,745 bytes, with a final newline. Its SHA-256 checksum was `[private-source checksum omitted]`.

### Mapping


The ranges below are inclusive and one-based, and all blank lines are included. Destination ranges contain only unchanged source passages.

| Original source lines | Destination passage | Destination lines | Lines | Bytes | Passage SHA-256 |
|---|---|---|---|---|---|
| 1 to 198 | [Opening request, reading map, and request-space argument]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction" >}}) | 14 to 211 | 198 | 9220 | `521afd0c3686cd279eb5f1ffcd0d231efe38b10c69fcfa2f8625a3a12b1a72f2` |
| 199 to 303 | [Declarative comparison and complete candidate-plan example]({{< ref "ai/design-research/03-language-and-compiler/10-program-authoring-and-typed-planning" >}}#natural-language-requests-and-candidate-plans) | 523 to 627 | 105 | 2822 | `7357ccc4148e609c959b659bee83a635716bba14d912afc0cae8627b476772d7` |
| 304 to 488 | [Generated-workspace and application-composition consequences]({{< ref "ai/design-research/interactive-systems/08-generated-workspaces-and-application-composition" >}}) | 14 to 198 | 185 | 3922 | `bd986b8da32779fe39515563ef28406f90cf0c2e0d6916cff9cfc8e1fa901acd` |
| 489 to 634 | [Usability, direct manipulation, and examples]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction" >}}) | 212 to 357 | 146 | 4453 | `ab6e56decad13e980f2e2be20d94ed25e1d94e8edf40c77c2db617b96efe7d44` |
| 635 to 678 | [Instructions, untrusted data, and the complete email example]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}#instructions-and-untrusted-data-in-language-interfaces) | 132 to 175 | 44 | 1184 | `4723bdc7239128012611fddb4d6568816786b70feea06173b4fb1dcc69c67625` |
| 679 to 764 | [Closing thesis and complete interaction diagrams]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction" >}}) | 358 to 443 | 86 | 2144 | `61aba6c01adc4c0d19a77a288ef4bf987228fb5a520e77782429232824c1fb2a` |

The six source ranges cover every original line exactly once. The [stage 7 JSON manifest](/ai/design-research/interactive-systems/reassembly-map.assets/07-nlp-interface-reassembly.json) records the mapping, destination prefixes, previous destination checksums, commands, and verification.

### Procedure and original order


Every move used `_scripts/move_text.py`, with a non-mutating dry run before `--apply`. Moves ran from original lines 679 to 764 down to lines 1 to 198. Earlier language-intent passages were inserted before already moved later passages after the same unique marker.

Each applied move was checked against the expected source remainder and destination bytes. The source was empty after all six moves and then received a navigation note at its existing path.

The original order begins with the language-intent note, continues through candidate plans and generated-workspace consequences, returns to the usability discussion, passes through the security section, and closes in the language-intent note. The mapping preserves that order even though the collection offers a thematic reading path.

The existing recipients retain their complete prior contents byte for byte:

- Program authoring and typed planning, previous 515 lines and 8909 bytes, SHA-256 `0b7129765149d252e1f429a6b944bb5f8e8ea70868e8a9f6e8e3cb7de1a9f87e`.
- Trusted effect boundaries, previous 123 lines and 15,812 bytes, SHA-256 `61cd0d279605dbf415c9f886ab7a6edcc07c9a51a7a10898949a31e196b9bb11`.

Their new section headings and navigation precede only the newly imported passages. All earlier source ranges remain at their prior positions.

### Author voice and new comments


The opening request and both original "XXX" separators remain in the language-intent note. The correction from a messy input space to a compositional request space remains the LLM's argument, not a later instruction from the author. The complete reading map, CRM examples, usability discussion, duplicate-name example, and closing thesis are retained.

The declarative comparison, ambiguity discussion, complete formal-plan diagram, and calendar example stay together in the existing authoring note. All three interface and application consequences stay together in the generated-workspace note. The full email example and proposed safeguard list stay together in the existing trusted-boundary note.

The [language-intent comments]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction-comments" >}}) distinguish interpretation choices, intent agreement, structural checks, examples, and authority. The [generated-workspace comments]({{< ref "ai/design-research/interactive-systems/08-generated-workspaces-and-application-composition-comments" >}}) distinguish economic predictions, familiar controls, cross-application mappings, and recorded state from accepted requirements.

The interactive-systems index now links both new notes and both existing recipients. The collection comments record the distinction between interpreted intent and committed state. The source is no longer listed as pending. Other source-bearing notes were linked rather than rewritten.

Original wording, citations, examples, dates, blank lines, formulas, and line endings remain unchanged. Research and product descriptions, security claims, and economic predictions were not independently checked during the split.

### Verification


- Reconstructed lines: 764.
- Reconstructed bytes: 23,745.
- Reconstructed SHA-256: `9b1fd64b805a735e131feb43b491c3130f258d6471fd5e7e578435d0e2866a0e`.
- Omitted or duplicated original bytes: zero.
- Complete original code blocks: 35, all retained without dividing a code fence.
- Complete original display formulas: eight, all retained without dividing a formula.
- Original final newline: preserved.
- Earlier mappings still reconstruct the product-analysis, visual-programming, semantic-engineering, context-assembly, and complex-UI sources as 30,899, 32,504, 17,434, 690, and 14,749 bytes respectively.
- Local links checked in the ten changed Markdown files: 191, including 40 heading anchors, with no missing targets.
- The standard whitespace check passed in source archive. In notes, it reported one new blank line at the end of the trusted-boundary note, at destination line 175. That line is original source line 678 and remains unchanged. The scoped notes check passed with only the blank-at-end-of-file warning disabled.

At the final verification snapshot, 107 of the 109 captured files outside the intended edits were unchanged. The shared design-research index and audit changed during the pass. Neither was edited or reverted by this pass. The JSON manifest records their observed checksums separately.

Whole-file checksums in older manifests remain historical snapshots. The two recipients have new appended sections, while their previously retained source passages and original line positions remain unchanged.

No original note path was deleted, and no files were staged or committed.

## Stage 8: language interfaces and architecture


Date: 2026-10-01. The source was nlp-interface-to-architecture.md (archived source 020), in the linked source archive collection. Before the split, it contained 962 logical lines and 28,361 bytes, without a final newline. Its SHA-256 checksum was `[private-source checksum omitted]`.

### Mapping


The ranges below are inclusive and one-based, and all blank lines are included. Destination ranges contain only unchanged source passages.

| Original source lines | Destination passage | Destination lines | Lines | Bytes | Passage SHA-256 |
|---|---|---|---|---|---|
| 1 to 146 | [Opening architecture, historical precedent, and complete layer overview]({{< ref "ai/design-research/interactive-systems/09-intent-environments-and-domain-boundaries" >}}) | 14 to 159 | 146 | 5968 | `23f338ebe7f3ded184e755230601f02ae5b96574107d91fc520347e5e44e766b` |
| 147 to 302 | [Business semantics and complete operation contract]({{< ref "ai/design-research/03-language-and-compiler/13-domain-semantics-and-operation-contracts" >}}) | 14 to 169 | 156 | 4347 | `6e597b2d669353c554613d2098f63ad5b59cbd0c8ae7624dbe8fd667bc1600c1` |
| 303 to 431 | [Intent representation, complete follow-up example, and bounded programs]({{< ref "ai/design-research/03-language-and-compiler/10-program-authoring-and-typed-planning" >}}) | 635 to 763 | 129 | 3191 | `4422bd7ad0d0e9604a4fc0ede0228139cbb4de069acd94ae1b17f044e9ce9b3e` |
| 432 to 493 | [Concrete authorization and complete refund-denial example]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}) | 183 to 244 | 62 | 1641 | `c2e26bc23ec4e297d427abb68766dcb91ec07e73f17123feecd0b6e19181e33a` |
| 494 to 580 | [Hybrid task views and supplied controls]({{< ref "ai/design-research/interactive-systems/02-stable-interface-components" >}}) | 96 to 182 | 87 | 2006 | `1f854d592b956329947807dfef212bc277fb2e3cda85ba9a86a38316ac52776a` |
| 581 to 744 | [Application boundaries and complete engineering discussion]({{< ref "ai/design-research/interactive-systems/09-intent-environments-and-domain-boundaries" >}}) | 160 to 323 | 164 | 3589 | `03ccb4b331e1e14de32c869685ca6c89c7b7983f02cc298bfa7224237996974a` |
| 745 to 813 | [Complete cost argument and economic diagrams]({{< ref "ai/design-research/interactive-systems/08-generated-workspaces-and-application-composition" >}}) | 206 to 274 | 69 | 1639 | `c79537dcbf5162d5261711a1c96927056f7f44c8966bb93c6e19beb5405c4498` |
| 814 to 866 | [Complete editable-interpretation example]({{< ref "ai/design-research/interactive-systems/07-language-intent-and-hybrid-interaction" >}}) | 452 to 504 | 53 | 1157 | `5d84a08a4c267d53ff1ed8f87340b4c1191d65862f4e0a832de3f3a03ac0bf03` |
| 867 to 962 | [Reliability, closing thesis, confidence levels, bibliography, and suggested experiment]({{< ref "ai/design-research/interactive-systems/09-intent-environments-and-domain-boundaries" >}}) | 324 to 419 | 96 | 4823 | `07c979cbc1f4e46e2d574c5cb0d97d6cc929dc8c382078be7f78dfa19b6a4bbe` |

The nine source ranges cover every original line exactly once. The [stage 8 JSON manifest](/ai/design-research/interactive-systems/reassembly-map.assets/08-intent-architecture-reassembly.json) records the mapping, destination prefixes, previous recipient checksums, commands, and verification.

### Procedure and original order


Every move used `_scripts/move_text.py`, with a non-mutating dry run before `--apply`. Moves ran from original lines 867 to 962 down to lines 1 to 146. Earlier architecture passages were inserted before already moved later passages after the same unique marker.

Each applied move was checked against the expected source remainder and destination bytes. The source was empty after all nine moves and then received a navigation note at its existing path.

The original reading order starts with the architecture overview and proceeds through domain meanings, planning, authority, and interfaces. It returns to application boundaries and engineering, continues through costs and ambiguity, and ends with reliability, predictions, the complete bibliography, and the suggested experiment. The mapping preserves that order across the seven notes.

The last original passage has no final newline. It was placed at the end of the architecture note, and later moves inserted earlier passages before it. Its original ending remains unchanged.

The five existing recipients retain their complete prior contents byte for byte:

- 03-language-and-compiler/10-program-authoring-and-typed-planning.md, previous 627 lines and 12,741 bytes, SHA-256 `45723fdcddcec3a4387fc24327af480cda19f2786c6a6eb84f9ef083e96df403`.
- 05-runtime-and-execution/05-trusted-effect-boundaries.md, previous 175 lines and 17,920 bytes, SHA-256 `ae5217504b31d081845b87863c0165e4ddf952dcdc406629a9accd4a47b4a2e7`.
- 02-stable-interface-components.md, previous 88 lines and 3,181 bytes, SHA-256 `54898077c65cdb2b209eb9f186faf856048ca04fe3c36d013348b9c5fccaad69`.
- 08-generated-workspaces-and-application-composition.md, previous 198 lines and 5,711 bytes, SHA-256 `c9d66674ae35d4b042584762af49204a13ad5193ddbb2c05fe1316172480aa5d`.
- 07-language-intent-and-hybrid-interaction.md, previous 443 lines and 17,378 bytes, SHA-256 `a07ac8642dd1c48765754ae0a2a86c77af9e0f5f113b92866fbaa52b694e4ec0`.

Their new headings and navigation precede only the newly imported passages. Earlier retained source ranges remain at their prior positions.

The [semantic-kernel note]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) was linked rather than edited. It retains its original contents, source positions, and absence of a final newline. The new domain-contract note provides the general discussion beside that note's audit-analytics example.

### Source voice and new comments


The saved source contains one LLM reply without the preceding user prompt. Its opening agreement, first-person reactions, confidence levels, and suggested next experiment remain the LLM's statements. No author prompt or agreement was invented.

The opening stack diagram, Semantic Web Services precedent, and complete eight-layer list stay together in the architecture note. The later application-boundary diagrams, complete engineering discussion, reliability argument, closing predictions, bibliography, and suggested experiment also stay in that note.

The domain note retains the complete business-semantics discussion and refund-operation contract. The remaining passages retain the complete follow-up plan, restricted-program discussion, refund-denial example, hybrid-interface sequence, trusted-control example, economic diagrams, and editable customer-selection example.

The new [architecture comments]({{< ref "ai/design-research/interactive-systems/09-intent-environments-and-domain-boundaries-comments" >}}) distinguish source voice, interpretation, checking, authority, interfaces, retained work, and predictions. The new [domain-contract comments]({{< ref "ai/design-research/03-language-and-compiler/13-domain-semantics-and-operation-contracts-comments" >}}) identify undefined business rules and the distinction between an operation description and permission to execute it. Existing language-intent and generated-workspace comments have separate appended sections concerning the imported examples.

The interactive-systems index now links the architecture and domain notes. The source is no longer listed as pending. The existing collection comments explain the domain and interface distinction without selecting an architecture or implementation. The shared design-research root index and audit were not edited by this pass.

Original wording, citations, diagrams, examples, dates, blank lines, and line endings remain unchanged. Historical, research, protocol, security, and economic claims were not independently checked during the split.

### Verification


- Reconstructed lines: 962.
- Reconstructed bytes: 28,361.
- Reconstructed SHA-256: `e8073fcd06535419dcb4f0dfb652baae6a4f36ba9765cd07052967b68ee40aac`.
- Omitted or duplicated original bytes: zero.
- Complete original code blocks: 51, all retained without dividing a code fence.
- Original absence of a final newline: preserved.
- Earlier mappings still reconstruct the product-analysis, visual-programming, semantic-engineering, context-assembly, complex-UI, and natural-language interface sources as 30,899, 32,504, 17,434, 690, 14,749, and 23,745 bytes respectively.
- Local links checked in the fifteen changed Markdown files: 296, including 81 heading anchors, with no missing targets.
- Standard scoped whitespace checks passed in both notes repositories.

At the final verification snapshot, 107 of the 111 captured files outside the intended edits were unchanged. The shared design-research index, complexity note and comments, and investigation-evaluation note changed during the pass. None was edited or reverted by this pass. The JSON manifest records their observed checksums separately.

Whole-file checksums in older manifests remain historical snapshots. The five recipients have new appended sections, while their previously retained source passages and original line positions remain unchanged.

No original note path was deleted, and no files were staged or committed.

## Stage 9: exploratory pipeline design


Date: 2026-10-01. The source was [exploratory-design.md]({{< ref "engineering/eng-exp/exploratory-design" >}}). Before the split, it contained 1,315 logical lines and 40,096 bytes, without a final newline. Its SHA-256 checksum was `c0588f3696a3a97967e7c1d22c32f4c0bd2b51c74439b6c782f7189f0f8f9b17`.

### Mapping


The ranges below are inclusive and one-based, and all blank lines are included. Destination ranges contain only unchanged source passages.

| Original source lines | Destination passage | Destination lines | Lines | Bytes | Passage SHA-256 |
|---|---|---|---|---|---|
| 1 to 453 | [Opening context, complete first answer, and second formulation's framing]({{< ref "ai/design-research/interactive-systems/10-exploratory-pipeline-design-and-progressive-automation" >}}) | 14 to 466 | 453 | 19929 | `653e66cff6fb01d94e2ce9f405ce4109fcd177d674d9b6fbd8df381a207d726a` |
| 454 to 637 | [Complete artifact model, RAG example, interaction lists, and architecture]({{< ref "ai/design-research/interactive-systems/11-inspectable-pipeline-workbenches" >}}) | 14 to 197 | 184 | 4613 | `c956f1e09e02713049dd5af797eda7a4e70a7cce46c2c43e58374accd46c8bf7` |
| 638 to 718 | [Second formulation's interaction criteria, anti-patterns, and closing formulations]({{< ref "ai/design-research/interactive-systems/10-exploratory-pipeline-design-and-progressive-automation" >}}) | 467 to 547 | 81 | 3114 | `3ae3336b98803a14b39d0a9f14572a8f2b100be2ab298fd98519cd92c8f2d779` |
| 719 to 1315 | [Complete third formulation marked for analysis]({{< ref "ai/design-research/interactive-systems/12-exploratory-pipeline-design-goals-and-principles" >}}) | 14 to 610 | 597 | 12440 | `dbaf86ad930a5f8a318010866d1b3a13d4cbf5ca1b65916dc7ac637483c2f592` |

The four source ranges cover every original line exactly once. The [stage 9 JSON manifest](/ai/design-research/interactive-systems/reassembly-map.assets/09-exploratory-design-reassembly.json) records the mapping, destination prefixes, commands, and verification.

### Procedure and original order


Every move used `_scripts/move_text.py`, with a non-mutating dry run before `--apply`. Moves ran from original lines 719 to 1315 down to lines 1 to 453. The earlier method passage was inserted before its already moved closing passage after the same unique marker.

Each applied move was checked against the expected source remainder and destination bytes. The source was empty after all four moves and then received a navigation note at its existing path.

The original order begins in the method note, continues through the workbench model and example, returns to the second formulation's interaction criteria and closing statements, and ends with the complete third formulation. The mapping preserves that order across the three notes.

The last original passage has no final newline and was placed at the end of the goals-and-principles note. Its original ending remains unchanged.

No existing source-bearing destination was extended or rewritten. The related builder-method, framework-routes, run-history, retrieval, application-state, and evaluation notes were linked rather than edited by this pass.

### Source voice and complete formulations


The opening framing statements, labelled problem, additional notes, and request for broader engineering approaches remain together. The authorship of unlabelled fragments was not inferred. The original answer 1, second, and third-formulation labels remain unchanged.

The first answer remains complete in the method note. The second formulation's artifact vocabulary, full RAG example, runtime and design-time interaction lists, and architecture remain together in the workbench note. Its general framing, interaction criteria, complete anti-pattern list, and closing formulations remain in the method note.

The complete third formulation retains its original label, "third - to analyse". Its proposed names, definition, purpose, goals, non-goals, ten principles, operating loops, design objective, and manifesto remain together. The label is not treated as an approval, and no proposed discipline or checklist was adopted through reassembly.

Repeated claims and different formulations remain visible. In particular, the second formulation's unconditional replay statement and the third formulation's allowance for replay or inspection were not silently reconciled.

### New comments and navigation


The new [method comments]({{< ref "ai/design-research/interactive-systems/10-exploratory-pipeline-design-and-progressive-automation-comments" >}}) distinguish source voice, runtime review, design learning, automatic baselines, observations, and policy adoption. The new [workbench comments]({{< ref "ai/design-research/interactive-systems/11-inspectable-pipeline-workbenches-comments" >}}) identify open rules for revisions, interventions, evidence, replay, execution, and comparisons. The new [comments on goals and principles]({{< ref "ai/design-research/interactive-systems/12-exploratory-pipeline-design-goals-and-principles-comments" >}}) examine the proposed automation conditions, judgment quality, runtime decisions, authority, and reproducibility.

The index now links all three notes and their comments. The source is no longer listed as pending, and no documents remain on the selected pending list. Completion concerns the selected source passes rather than every related note in either repository.

The original path now links the three destinations, separate comments, and audit. The shared design-research root index and audit were not edited by this pass.

Original wording, proposed names, markers, examples, diagrams, citations, blank lines, and line endings remain unchanged. Research descriptions, project references, product and metric claims, and unavailable attachments were not independently checked during the split.

### Verification


- Reconstructed lines: 1,315.
- Reconstructed bytes: 40,096.
- Reconstructed SHA-256: `c0588f3696a3a97967e7c1d22c32f4c0bd2b51c74439b6c782f7189f0f8f9b17`.
- Omitted or duplicated original bytes: zero.
- Complete original code blocks: 80, all retained without dividing a code fence.
- Original absence of a final newline: preserved.
- Earlier mappings still reconstruct the product-analysis, visual-programming, semantic-engineering, context-assembly, complex-UI, natural-language interface, and architecture-reply sources as 30,899, 32,504, 17,434, 690, 14,749, 23,745, and 28,361 bytes respectively.
- Local links checked: 246, including 36 heading anchors across 10 Markdown files. No missing targets or anchors were found.
- New prose passed the whitespace checks. The scoped `git diff --check` also passed.
- The 27 existing staged entries in the checked scope remained unchanged. This pass performed no staging, unstaging, or commit operations.

At the recorded final snapshot, 121 of the 129 baseline files outside the intended edits were unchanged. Eight design-research files changed externally: the root index and audit, the participant model, the complexity note and its comments, the runtime note, and the program-history note and its comments. This pass did not edit or revert those changes. The JSON manifest records their observed checksums separately.

Whole-file checksums in older manifests remain historical snapshots. Previously retained source passages and their recorded positions were not edited by this pass.

The workspace contained existing staged entries before this pass. No original note path was deleted, and this pass did not stage, unstage, or commit files.

## Stage 10: co-writer sketches


Date: 2026-10-01. The sources were co-writer.md (archived source 021) and examples.md (archived source 022). The saved notes contain no speaker labels, so the split does not infer authorship for unlabelled sentences.

| Original source | Logical lines | Bytes | Final newline | SHA-256 |
|---|---|---|---|---|
| co-writer.md | 32 | 1608 | Absent | `273ec00d504d7b7f058fe4d15fdef7cdc32e62d74e6bf0a1a6d8d71f330e7530` |
| examples.md | 7 | 512 | Present | `7ab9511c69e79da3c837d487ee7d2672ae7676d2d2a93f49a7cd93ef965f4381` |

### Mapping


All ranges are inclusive and one-based. Blank lines and original line endings are included, and the destination ranges contain only unchanged source text.

| Source | Original lines | Original bytes | Destination | Destination lines | Destination bytes | Passage SHA-256 |
|---|---|---|---|---|---|---|
| co-writer.md | 1 to 11 | 1 to 753 | [Writing workflow]({{< ref "ai/design-research/interactive-systems/14-collaborative-writing-and-text-assembly" >}}#original-workflow-sketch) | 12 to 22 | 1124 to 1876 | `8904af00436c15bc81e03e31190f59fee50ad663dbc610ce79caba8406b5fbfa` |
| co-writer.md | 12 to 32 | 754 to 1608 | [Meaning and collaboration]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}#from-rewriting-prompts-to-a-shared-writing-workspace) | 471 to 491 | 21500 to 22354 | `76f2695bfeb790a5dcfb5e6c6703a252f1fa1e664a01a63eaf34cec777e07859` |
| examples.md | 1 to 7 | 1 to 512 | [Complete examples]({{< ref "ai/design-research/interactive-systems/14-collaborative-writing-and-text-assembly" >}}#retained-examples) | 28 to 34 | 2111 to 2622 | `7ab9511c69e79da3c837d487ee7d2672ae7676d2d2a93f49a7cd93ef965f4381` |

The [JSON mapping](/ai/design-research/interactive-systems/reassembly-map.assets/10-co-writer-reassembly.json) records the commands, existing prefixes, new navigation ranges, file snapshots, and reconstruction results.

### Procedure and original order


Every transfer used `_scripts/move_text.py`, with a dry run before `--apply`. Each dry run left both files unchanged, and each applied transfer matched independently calculated source and destination bytes.

First, original lines 12 to 32 moved to the end of the augmentation note. Second, lines 1 to 11 moved into the new writing case. Third, the complete example note moved to the end of the writing case.

The final line of the communication passage still has no newline. Both original source paths now contain navigation, and their original permission mode of `0664` remains unchanged.

The workflow begins the original sketch, and the meaning and collaboration passage completes it. The complete companion examples follow the workflow in the writing case.

### Comments and boundaries


The new [case comments]({{< ref "ai/design-research/interactive-systems/14-collaborative-writing-and-text-assembly-comments" >}}) address fragment selection, review of the assembled text, and the retained revision history. The existing [augmentation comments]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work-comments" >}}#co-writer-meaning-and-collaboration) now distinguish faithful rewriting from developing a claim.

Both example formulations and the removal remark remain intact. The remark was not treated as an instruction to delete text. The paragraph about competence and AI engineering remains sample input, rather than a verified account or an adopted design principle.

The meaning requirements, communication proposal, task context, Matrix idea, and closing reflection remain together. Related language-intent and workspace-composition notes are linked without copying their text.

Plain-writing guided only new comments, navigation, index entries, source overviews, and audit prose. The source wording was not rewritten. The split selects no interface, implementation, authority to publish, or evaluation result.

### Preservation checks


The two sources reconstruct exactly as 1,608 and 512 bytes, with their original SHA-256 checksums. All 2,120 original bytes and 39 logical lines occur once in the recorded moved passages.

The earlier 20,608 bytes of the augmentation note remain an unchanged prefix with SHA-256 `b4524afa33b539da47f24ca225b14fce3c8f7519f98109fdc2a6fd72a0ad66d2`. The earlier 2,456 bytes of its comments also remain an unchanged prefix. Previously retained source passages and their recorded positions were not edited.

Both collection indexes received additions without rewriting earlier entries. Both earlier audit files remain unchanged prefixes, with only the present audit and its design-research cross-reference appended.

At the pre-audit check, all 139 unrelated baseline collection files retained their bytes and modes. Both repositories retained their Git HEAD, index bytes, and staged listings. No files were staged, unstaged, committed, or deleted by this pass.

### Final verification


The new notes, source overviews, and new index, comment, and audit passages passed checks of 55 local Markdown references, including 24 heading anchors. No missing files or headings were found.

The saved destination byte and line ranges agree, and both original source checksums reconstruct exactly. Code fences close in both recipient notes. New prose has no trailing whitespace, and scoped working-tree whitespace checks passed in both repositories.

All 139 unrelated baseline collection files retain their bytes and modes. Both repositories retain their Git HEAD, index bytes, and staged listings. No files were staged or committed.
