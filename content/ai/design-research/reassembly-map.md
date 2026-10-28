---
draft: false
toc: true
description: "A historical audit of the design-research reorganization, documenting unchanged source transfers, subsequent splits, redirects, citation copies, editorial additions, byte ranges, and reconstruction checksums."
title: "Reassembly Map"
linkTitle: "Reassembly Map"
---

Public-edition note, 2026-10-28: Private source locations and machine-specific audit details are omitted or replaced with neutral archive labels. Historical coordinates and checksums describe earlier snapshots, not the edited public files.

Editorial context, 2026-10-20: This map is a historical record of the reassembly before the plain-language editorial pass. Its checksums, byte counts, line ranges, and statements of unchanged wording describe the text at that earlier stage, not the current edited notes.

Reassembled on 2026-09-30 from `ai/architecture-dsl-like/` into `ai/design-research/`.

All 24 Markdown source notes were read and moved as complete, unchanged text units with `_scripts/move_text.py`. Each move used the inclusive source range shown below and `--at-end --apply`. After verification, the old Markdown files received one-line redirect stubs so existing Obsidian links still lead to the reorganized notes. The non-note `.DS_Store` file was not moved.

The first destination was subsequently recognized as a captured user-LLM dialogue and split into six logical pieces. That second-stage split is recorded after the original reassembly table.

Verification after the move:

- 24 of 24 destination payloads match their pre-move SHA-256 checksum.
- Before redirect stubs were added, 24 of 24 original Markdown files contained zero bytes.
- Total migrated payload: 704,687 bytes.
- Line counts include a final unterminated line, matching the move script's `splitlines` behavior.

| Original source | Destination | Lines | Bytes | SHA-256 |
|---|---|---:|---:|---|
| `architecture-dsl-like/dsl-approach/problem-framing.md` | `design-research/00-overview/01-problem-framing.md` | 354 | 21,976 | `b62b59c763e643ac00223648e80a40d02d3d67d0dd4d24772ca00b5cad721cf6` |
| `architecture-dsl-like/research-direction.md` | `design-research/00-overview/02-research-direction.md` | 690 | 25,260 | `376a1bc4b3b1788eedbd15815bb8176e5ed23bfe0421c5356b2993c3ea54b66c` |
| `architecture-dsl-like/_index-dsl.md` | `design-research/00-overview/03-original-index-notes.md` | 4 | 197 | `f9f9bebf4c76f3233bfcec001ca3b44c8ce64088c149a81635b057e127aa2ba9` |
| `architecture-dsl-like/creator-approach.md` | `design-research/01-foundations/01-constrained-generativity.md` | 1,139 | 47,474 | `e3f08362c6bfc57032cc9c52e9c5787f5402ce3da0b16d4202a9ed4a751a7127` |
| `architecture-dsl-like/dsl-approach/constrained-generativity-semantic-substrate-design.md` | `design-research/01-foundations/02-semantic-substrate-design-report.md` | 1,766 | 71,631 | `ed38e513fd8fa91770012d790bce1a31a78d0e69430ec16696c0774f44d3fc81` |
| `architecture-dsl-like/bts.md` | `design-research/01-foundations/03-behavioral-types-and-protocols.md` | 578 | 25,180 | `faa62e403d66862a06fc46491933d5dee039bc3d4fab57e355ca5983d8cca527` |
| `architecture-dsl-like/some-augmenting.md` | `design-research/02-human-ai-collaboration/01-augmenting-human-work.md` | 335 | 20,718 | `3e6459633b0f8f40842684801e6c55867fad02eaa85de08cf893e20fde57522e` |
| `architecture-dsl-like/sensemaking.md` | `design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-partnership.md` | 119 | 7,697 | `4b7a3a9bc4666eee14990d6b52b4ae7978f9252ed4d22241e0157ec98e2a3db8` |
| `architecture-dsl-like/programmable-environments-human-ai-collaboration.md` | `design-research/02-human-ai-collaboration/03-programmable-human-ai-environments-report.md` | 606 | 77,682 | `5db18ba69d758e99c8715bb30e93829bdca2b766b35a26b76feba8727c05bc26` |
| `architecture-dsl-like/dsl-approach/DSLs Enable Reliable Use of LLMs.md` | `design-research/03-language-and-compiler/01-dsl-reliability.md` | 300 | 26,812 | `47f7dc284fa764905fdb01938c4c36a93db63bc8f69ec8c0b8bdcf1b0d5e3772` |
| `architecture-dsl-like/dsl-approach/dsl-ai.md` | `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | 1,196 | 37,366 | `314c22d8778876dbbd4f6292011f4a331ead6b41ecc5e4367a690cd60b9f05da` |
| `architecture-dsl-like/dsl-approach/declarative-approach.md` | `design-research/03-language-and-compiler/03-declarative-programming-model.md` | 482 | 19,274 | `b6d7c959ccffc4a09ceb4ec7c4d14f971093e34f0556a3bfbeee901ac78cadb2` |
| `architecture-dsl-like/dsl-approach/declarative-layer.md` | `design-research/03-language-and-compiler/04-dsl-as-mediation-layer.md` | 412 | 12,019 | `8157a2967b79483f704fd142f8d1ad3fb99a38265cf4200e34eda3484d2f1967` |
| `architecture-dsl-like/dsl-approach/design-model.md` | `design-research/03-language-and-compiler/05-layered-design-model.md` | 482 | 11,425 | `90a866bd1109a3ac565a40b9ce38cd655ccb7ef369a52f7cab09660fc862350d` |
| `architecture-dsl-like/dsl-approach/languages.md` | `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 759 | 22,903 | `7452669c8c579e6d0d56eea276cd6197e4d4d3635aad7dc50b0c3484d2a91fd2` |
| `architecture-dsl-like/semantic-kernel.md` | `design-research/03-language-and-compiler/07-semantic-kernel.md` | 618 | 11,441 | `51844f36adc939b917ddec8cd1e66e06fcb141dea520032fe652ec9d0eeb9769` |
| `architecture-dsl-like/investigation-lang-alg.md` | `design-research/04-investigation-and-epistemics/01-investigation-language-and-algebra.md` | 990 | 25,461 | `b7f56872d4c2c814541c5fdcba69a6482cee108381ffed9a1e05f5698801bdee` |
| `architecture-dsl-like/investigation-lang-alg-llm-layer.md` | `design-research/04-investigation-and-epistemics/02-llm-operated-investigation-runtime.md` | 700 | 11,811 | `2b5b352b5b805c76c49fdc38b07201cf02d6a7bf823165a5f3cba248142f7f6c` |
| `architecture-dsl-like/dsl-approach/dsl-for-rag.md` | `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 858 | 14,726 | `a71594404daf21b5b412db7bfde65750cf941716df0ba44a41e5bebea4b1d2df` |
| `architecture-dsl-like/architecture-generalization.md` | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 926 | 20,143 | `80046e60ad993e2b27b1b1b834242ea59085900ea735b3ddea417ec42ad2b2a0` |
| `architecture-dsl-like/dsl-approach/db-approach.md` | `design-research/05-runtime-and-execution/02-database-centered-runtime.md` | 681 | 20,298 | `8b511dde793b8cb4498dcba003b118c659007c0eeed0035355071be853f8b97a` |
| `architecture-dsl-like/dsl-approach/deep-research-report-formatted.md` | `design-research/06-research-reports/01-programmable-probabilistic-agent-computation.md` | 727 | 65,976 | `984fe69cd243e6be69a379200dcb7ce7f03ceb6e8502f9ebae942469438311d8` |
| `architecture-dsl-like/dsl-approach/typed-durable-inspectable-runtimes-report.md` | `design-research/06-research-reports/02-typed-durable-inspectable-runtimes.md` | 518 | 69,287 | `e1eb14184dc8a7874f8bfc0f54bf6393eaf5b2b3eea2df0c2f9f8a4934ccfaa7` |
| `architecture-dsl-like/Data Renegades  Ep. 11, Contrarian Bets and AI Skepticism with Michael Stonebraker.md` | `design-research/07-sources/01-stonebraker-data-renegades-transcript.md` | 399 | 37,930 | `d48ca91722c7512229813f8f771ca93e973eba2a5751fdf0344604764f0b42b3` |

## Second-stage split: problem-framing dialogue


The ranges below refer to the 354-line first-stage destination before it was split. They were moved from bottom to top with `_scripts/move_text.py`, leaving lines 1-14 in the original destination. Concatenating the six current files in source order yields 21,976 bytes and the original SHA-256 checksum `b62b59c763e643ac00223648e80a40d02d3d67d0dd4d24772ca00b5cad721cf6`.

| Original lines | Current destination | Lines | Bytes | SHA-256 |
|---:|---|---:|---:|---|
| 1-14 | `design-research/00-overview/01-problem-framing.md` | 14 | 756 | `369cf5c7b01b0ca6d998ae32fa550769aa9e4fe5338b9718825dbb423c35b14f` |
| 15-68 | `design-research/01-foundations/04-participant-neutral-system-model.md` | 54 | 1,756 | `4358ec282f1157729086facfff9a2a9e489bc0924710a80999e310f1046eca2a` |
| 69-228 | `design-research/00-overview/04-architectural-framings.md` | 160 | 5,279 | `ce2b96824a342a0f2f7178bf5740e0855fde39ff8e086831693a5ae97e465bb2` |
| 229-298 | `design-research/01-foundations/05-constrained-common-substrate.md` | 70 | 3,184 | `a0c60aca06298184c095cf1fdca2da3fcee630eb38d0797227a75cbb7d594f83` |
| 299-334 | `design-research/06-research-reports/03-shared-runtime-landscape.md` | 36 | 8,115 | `723f35c8c1e15dd1d9ca8e53766561e27ac863674fbc3294507ec798f3c6cdcb` |
| 335-354 | `design-research/00-overview/05-refined-research-question.md` | 20 | 2,886 | `c874a12bd953da09aa31cd392643f11067c79358d8860c4bf57944b982fc150b` |

## Third-stage redistribution: research-direction dialogue


The 690-line `research-direction.md` dialogue was redistributed by concept into existing notes. All moves used `_scripts/move_text.py` from the bottom of the source upward. The retained ranges were allowed to close together naturally in `00-overview/02-research-direction.md`.

The current source contains original lines 1-71, 316-379 and 607-690, totaling 219 logical lines and 13,605 bytes. Its SHA-256 checksum is `eb9e2ce0736224dc92100a94446f9f79310685701b630fbcccd4af3f5f850dcf`.

Reassembling the retained ranges and the ten moved blocks in original order produces the original 25,260 bytes and SHA-256 checksum `376a1bc4b3b1788eedbd15815bb8176e5ed23bfe0421c5356b2993c3ea54b66c`.

| Original lines | Current destination | Placement | Lines | Bytes | SHA-256 |
|---:|---|---|---:|---:|---|
| 72-138 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | Before `### 4. Durable execution and controlled adaptation` | 67 | 1,669 | `013851091196d9415aa859dca72814ea54a4ed964fda0ff5c74e2f14198478b0` |
| 139-173 | `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | Before `## for the future` | 35 | 728 | `91210e4be9e4b31ec651fcaf96598dfdbb02415dd2cf61acadcc71a06cecdba3` |
| 174-215 | `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | Before `## for the future` (relocated in the tenth stage) | 42 | 843 | `68a6697d492a94db988b17e1546a234c6a0944edaa1e574410b8123a883b5da8` |
| 216-239 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | Before `## this separation` | 24 | 779 | `03a44a46a2e907e854c1ab80669874a03e87231a82031551083b424516fc1a2e` |
| 240-271 | `design-research/05-runtime-and-execution/02-database-centered-runtime.md` | Before `## Where I think a new theory actually belongs` | 32 | 761 | `74a516c47a4ab3ebd0a817a2bb7c9242a0272beb808aa22ea91b51e9ec09cf8f` |
| 272-315 | `design-research/02-human-ai-collaboration/01-augmenting-human-work.md` | Before `## review` | 44 | 1,324 | `d88eb58e627da344923c7d312c8e0ca0e35b965eb9d81287c4d4ede179599a86` |
| 380-453 | `design-research/01-foundations/05-constrained-common-substrate.md` | Before `### The second important idea: the pipe has semantics` | 74 | 2,384 | `0d69fa5a1208032ed251fba72691c7cef17341aa5cc317959dcb884b7c2f8416` |
| 454-518 | `design-research/01-foundations/04-participant-neutral-system-model.md` | At end | 65 | 1,216 | `ee1db7bb36aab369d6178a1ea099b3c33e678f32080f2ae6d2c30d7646e427ec` |
| 519-563 | `design-research/01-foundations/05-constrained-common-substrate.md` | At end | 45 | 981 | `311f09c3bf6d6e5f642279fb1b30cebea35fa9540e8971f3f1d1446327fd5897` |
| 564-606 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | Before `## So we may want several calculi, not one giant theory` | 43 | 970 | `bddb0172285fe4365c8f27a3ba846fda6a9e6c76ccf9631f54890034e887106f` |

## Fourth-stage redistribution: behavioral-types dialogue


The 578-line `behavioral-types-and-protocols.md` dialogue contained a joint-activity passage that belongs with the human-work material. Original lines 18-109 were moved unchanged with `_scripts/move_text.py` before `### The deeper model` in `02-human-ai-collaboration/01-augmenting-human-work.md`.

Immediately after this redistribution, the source retained original lines 1-17 and 110-578, totaling 486 logical lines and 21,645 bytes. Its SHA-256 checksum at that stage was `f5fe492c1f77a63399b8bc6594b3248cfc1b0fb9108351b2e8228cf9e7b28168`.

Reassembling the retained source around the moved block produces the original 25,180 bytes and SHA-256 checksum `faa62e403d66862a06fc46491933d5dee039bc3d4fab57e355ca5983d8cca527`.

| Original lines | Current destination | Placement | Lines | Bytes | SHA-256 |
|---:|---|---|---:|---:|---|
| 1-17, 110-578 | `design-research/01-foundations/03-behavioral-types-and-protocols.md` | Retained in source order | 486 | 21,645 | `f5fe492c1f77a63399b8bc6594b3248cfc1b0fb9108351b2e8228cf9e7b28168` |
| 18-109 | `design-research/02-human-ai-collaboration/01-augmenting-human-work.md` | Before `### The deeper model` | 92 | 3,535 | `a45668e15b11f6b8776c55933822cfc9247370f532087fa22b831b6d466beefe` |

## Fifth-stage redistribution: augmenting-human-work dialogue


The 335-line `some-augmenting.md` dialogue was separated into its human-work design argument, two reusable system foundations, and a focused literature note. All four source passages were moved unchanged with `_scripts/move_text.py`.

Before this redistribution, `01-augmenting-human-work.md` also contained two passages received during earlier stages: the 92-line joint-activity passage from `behavioral-types-and-protocols.md` and the 44-line shared-computation passage from `research-direction.md`. Those passages remain in the human-work note and retain their recorded checksums.

Immediately after this redistribution, `01-augmenting-human-work.md` contained 367 logical lines and 15,487 bytes, including those two earlier imports. Its SHA-256 checksum at that stage was `0c80c32e91cd020ffb0ab37503f6c33d68b488e569d6220a2792fbe49c55ecce`. The new literature note then contained 33 logical lines and 7,481 bytes with SHA-256 checksum `ca1ac84dce71ab5ca9d3d42dccbfc3c5e634fa8ccf214e6eee3d26d13b82e40f`.

Reassembling the seven original ranges below in source order produces the original 20,718 bytes and SHA-256 checksum `3e6459633b0f8f40842684801e6c55867fad02eaa85de08cf893e20fde57522e`.

| Original lines | Current destination | Placement | Lines | Bytes | SHA-256 |
|---:|---|---|---:|---:|---|
| 1-5 | `design-research/02-human-ai-collaboration/04-augmentation-literature-and-reading-path.md` | At beginning | 5 | 34 | `d1f93fb71da86488bbcb78a50d3ed030e2a69490d17d250a62813dbb3f0b4608` |
| 6-21 | `design-research/02-human-ai-collaboration/01-augmenting-human-work.md` | Retained at beginning | 16 | 2,004 | `83027114079af719873137d69002fe3af30dd41ea11c321c90163027e9e0dee6` |
| 22-66 | `design-research/01-foundations/03-behavioral-types-and-protocols.md` | Before the assumption/guarantee contract discussion | 45 | 1,853 | `1458c5834266e2b1f9105d70035be8e2ec741724a6d0c5cf69f4e68fcf27a1c7` |
| 67-92 | `design-research/01-foundations/04-participant-neutral-system-model.md` | Before `### That changes the abstract machine` | 26 | 756 | `b7a524740fec89a49b6c135cf47a62d1bccb1f09957bd368ef22adf0dae3b2ed` |
| 93-267 | `design-research/02-human-ai-collaboration/01-augmenting-human-work.md` | Retained before the earlier joint-activity import | 175 | 6,877 | `b4cc721cd557969c9242bf7af2e4f8fa7947d9042b528a35dca979f24d5f1c8e` |
| 268-307 | `design-research/02-human-ai-collaboration/01-augmenting-human-work.md` | Retained between the two earlier imports | 40 | 1,747 | `a40614230fcdbefca67924a8a432496cd193c2242cffe6a695dbdd7953407863` |
| 308-335 | `design-research/02-human-ai-collaboration/04-augmentation-literature-and-reading-path.md` | After the reading reminder | 28 | 7,447 | `d7241b57e95b6a8a8e38f8fa14b1fc76729568aec90ad4dfe73cf88f8bc20e53` |

## Sixth-stage redistribution: sensemaking dialogue


The 119-line `sensemaking.md` dialogue was separated into a compact conceptual note, a related-work passage, and a human-AI collaboration taxonomy. Both source passages were moved unchanged with `_scripts/move_text.py`. The 65-line conceptual note was then renamed to `02-sensemaking-and-epistemic-action.md` to reflect its remaining scope.

The taxonomy's final source line had no line terminator. To preserve that byte-level property, the move script appended the block to `01-augmenting-human-work.md` rather than inserting it before another line. The related-work block was placed at the end of the literature note so the fifth-stage blocks in that note remain contiguous.

Immediately after the sixth stage, the conceptual note contained 65 logical lines and 2,580 bytes with SHA-256 checksum `328f116b4af4609e71dcec96fff9456f4978d491fc50555043e37ddddeca31b2`. The literature note then contained 59 logical lines and 11,610 bytes with SHA-256 checksum `c235f7b1e6a2dea48568b798a6a149f6ed5068f82f7159e645fb3b797dda6a02`. The human-work note then contained 395 logical lines and 16,475 bytes with SHA-256 checksum `b4bfb08037870f00ab6e8bd83f23eb3854d7b6bcb65075077993d4a1d04b4bf5`.

Reassembling the three ranges below in source order produces the original 7,697 bytes, preserves the absent final line terminator, and yields SHA-256 checksum `4b7a3a9bc4666eee14990d6b52b4ae7978f9252ed4d22241e0157ec98e2a3db8`.

| Original lines | Current destination | Placement | Lines | Bytes | SHA-256 |
|---:|---|---|---:|---:|---|
| 1-65 | `design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-action.md` | Retained as the conceptual core | 65 | 2,580 | `328f116b4af4609e71dcec96fff9456f4978d491fc50555043e37ddddeca31b2` |
| 66-91 | `design-research/02-human-ai-collaboration/04-augmentation-literature-and-reading-path.md` | At end | 26 | 4,129 | `8d17147dce65ddb4ef53bc63f53996171e994cd86c9a6cba231d15f74321862e` |
| 92-119 | `design-research/02-human-ai-collaboration/01-augmenting-human-work.md` | At end | 28 | 988 | `42a3c801bbebe933819c9b0aeb8059d651958ac3ec1cf71a2b8bd1a9f2be4e8f` |

## Seventh-stage redistribution: typed-DSL dialogue


The 1,196-line `dsl-ai.md` dialogue was separated into its typed-language and compiler core, a comparative set of research-project candidates, and a focused literature and researcher reading path. All three source passages were moved unchanged with `_scripts/move_text.py`, from the bottom of the source upward.

Before this redistribution, `02-typed-dsl-and-compiler.md` also contained a 35-line type/effect passage received from `research-direction.md` during the third stage. That imported passage remains in the core note and retains its checksum `91210e4be9e4b31ec651fcaf96598dfdbb02415dd2cf61acadcc71a06cecdba3`.

The current core note contains 684 logical lines and 18,584 bytes, including that earlier import, with SHA-256 checksum `16a42be823b463df258dbe56eccd3e326be3a5f1a79e1e23880576858dcd92b6`. The project-candidates note contains 460 lines and 8,750 bytes with checksum `1d595721bf86a6ddd9277e2bd464102fa51485ed5a008e30cabfee633679428a`. The reading-path note contains 87 lines and 10,760 bytes with checksum `b07922ca9c2e08a165c5fd2eb5df89d955ddeb129a7969e38fbff3449ec8c6b6`.

Reassembling the six original ranges below in source order, while excluding the earlier 35-line import, produces the original 37,366 bytes and SHA-256 checksum `314c22d8778876dbbd4f6292011f4a331ead6b41ecc5e4367a690cd60b9f05da`.

| Original lines | Current destination | Placement | Lines | Bytes | SHA-256 |
|---:|---|---|---:|---:|---|
| 1-239 | `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | Retained at beginning | 239 | 8,193 | `08c8bc114d80ec3bf16ade23825d27a86e26b155f94d2ffeb040c1043f50ffed` |
| 240-295 | `design-research/03-language-and-compiler/09-dsl-and-formal-methods-reading-path.md` | At beginning | 56 | 3,385 | `f85a7f07daeaf294fd43ae4e2cb0b94b814a779c75a09497db6116ded0c03527` |
| 296-528 | `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | Retained after the architectural core | 233 | 5,933 | `860cefd1a242400bd0e263a4630be363b08eef528234df7746261b6795dc1ede` |
| 529-988 | `design-research/03-language-and-compiler/08-typed-dsl-project-candidates.md` | Entire note | 460 | 8,750 | `1d595721bf86a6ddd9277e2bd464102fa51485ed5a008e30cabfee633679428a` |
| 989-1019 | `design-research/03-language-and-compiler/09-dsl-and-formal-methods-reading-path.md` | After the DSL comparison | 31 | 7,375 | `2c25e9f7ba81cc340cc1a2cf033c902a01f36750b03edf5c66b9c9be394332b7` |
| 1020-1196 | `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | Retained after the earlier type/effect import | 177 | 3,730 | `a49a476193141f45cd2b5c6cf1fa98fd338f08237e63596fb9b359314082dfdb` |

## Eighth-stage redistribution: declarative-programming dialogue


The 482-line `declarative-approach.md` dialogue was separated into its declarative-programming core, an implementation-language passage, and a survey of related planning and synthesis traditions. Both source passages were moved unchanged with `_scripts/move_text.py`, from the bottom of the source upward.

The survey block includes the source file's final line, which had no line terminator. It was appended to `09-dsl-and-formal-methods-reading-path.md`, rather than inserted before another section, so that this byte-level property remained unchanged.

The current declarative-programming core contains 336 logical lines and 7,059 bytes with SHA-256 checksum `41fc42117df4c9701b25c938476becd146113429e06845cf4d920829764d92ea`. The language-and-formalism note contains 23,920 bytes with checksum `71b3cc1639393d0cd4ce62e29d0332cb45487a640cf2e3bf23da1a080c30d3c2`. The reading-path note contains 191 logical lines and 21,958 bytes with checksum `8e75fff65357e19ce87f20ad79aa5f7435cdb60c6129482e914084413597833a`.

Reassembling the four original ranges below in source order produces the original 482 logical lines and 19,274 bytes, preserves the absent final line terminator, and yields SHA-256 checksum `b6d7c959ccffc4a09ceb4ec7c4d14f971093e34f0556a3bfbeee901ac78cadb2`.

| Original lines | Current destination | Placement | Lines | Bytes | SHA-256 |
|---:|---|---|---:|---:|---|
| 1-277 | `design-research/03-language-and-compiler/03-declarative-programming-model.md` | Retained at beginning | 277 | 5,779 | `a5f2bc5ccdcde8cdb894bc6a06e97ab584da841e4a82d70ce8fd378aa6444fa9` |
| 278-319 | `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | Before `## other?` | 42 | 1,017 | `ab6c92e0a26ef35b945d3946282756e986810b47e7a2e38ba8714be7a252212e` |
| 320-378 | `design-research/03-language-and-compiler/03-declarative-programming-model.md` | Retained at end | 59 | 1,280 | `f29318555f8092214c9b60d75b43d013f3dfee6dfac99dba4e4322f56c4cbb4a` |
| 379-482 | `design-research/03-language-and-compiler/09-dsl-and-formal-methods-reading-path.md` | At end | 104 | 11,198 | `0881ef25a1e91a2e66913210d8d08b8d520e4058ffcd17d772281cf0c2f46e7a` |

## Ninth-stage redistribution: DSL-mediation dialogue


The 412-line `declarative-layer.md` dialogue was separated into its semantic-mediation core and a concrete iterative-RAG example. The example was moved unchanged with `_scripts/move_text.py` into the project-candidates note, immediately before its final recommendation to begin with iterative RAG.

Before this redistribution, `08-typed-dsl-project-candidates.md` consisted of the 460-line project-comparison passage received from `dsl-ai.md` during the seventh stage. That earlier passage remains unchanged and retains its recorded checksum.

The current mediation note contains 330 logical lines and 10,119 bytes, preserves the original absent final line terminator, and has SHA-256 checksum `437b7533707970985469be17037582b328203c5b63dabe6b38b377a4ab9d3abc`. The project-candidates note contains 542 logical lines and 10,650 bytes with checksum `fe08f696d9f03ce7f81d6c0afa49cca2cd1712da998add3fc6240bd23306fd54`.

Reassembling the three original ranges below in source order produces the original 412 logical lines and 12,019 bytes, preserves the absent final line terminator, and yields SHA-256 checksum `8157a2967b79483f704fd142f8d1ad3fb99a38265cf4200e34eda3484d2f1967`.

| Original lines | Current destination | Placement | Lines | Bytes | SHA-256 |
|---:|---|---|---:|---:|---|
| 1-284 | `design-research/03-language-and-compiler/04-dsl-as-mediation-layer.md` | Retained at beginning | 284 | 8,558 | `7072023e3ce90de0a85727b091a75797e94418b0250fd64b4b21744b61e70542` |
| 285-366 | `design-research/03-language-and-compiler/08-typed-dsl-project-candidates.md` | Before `I would start with project 1: iterative RAG.` | 82 | 1,900 | `95fe489bda40efef0e15da17acece331652e016298e2d1b68fad12a2b46d8fb1` |
| 367-412 | `design-research/03-language-and-compiler/04-dsl-as-mediation-layer.md` | Retained at end | 46 | 1,561 | `d849c2aff8f4b8282bdb4bf6836312b6e4c461c5f6ae14d0722c7571a6c6b61e` |

## Tenth-stage redistribution: layered-design dialogue


The 482-line `design-model.md` dialogue was separated into its general architectural model, staged commitment, compiler contracts and repair feedback, and runtime recovery and replay. All four moves used `_scripts/move_text.py` from the bottom of the source upward. The core retains original lines 1-168 and 425-482, totaling 226 logical lines.

Before this redistribution, `05-layered-design-model.md` also contained the 42-line compilation-and-verification passage imported from `research-direction.md` during the third stage. It was moved from then-current lines 442-483 to `02-typed-dsl-and-compiler.md`, before `## for the future`. Immediately after that stage, it occupied lines 679-720 in that note. This passage still contains 843 bytes and has SHA-256 checksum `68a6697d492a94db988b17e1546a234c6a0944edaa1e574410b8123a883b5da8`. The third-stage mapping above now points to this current destination.

The following file checksums describe the state immediately after this redistribution. Existing destination text was preserved byte-for-byte, and the combined size of these four files remains 64,532 bytes.

| Current file | Logical lines | Bytes | SHA-256 |
|---|---:|---:|---|
| `design-research/03-language-and-compiler/05-layered-design-model.md` | 226 | 6,269 | `7c9d43c51123b0feeb3f3946c374c159c222a53e0befb39b1bc2112813567d86` |
| `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | 897 | 22,780 | `5ff208aa63f48b07e079a58c20040937931739c03ab81866856bc745d3c4c718` |
| `design-research/03-language-and-compiler/04-dsl-as-mediation-layer.md` | 363 | 10,649 | `eef1a174f4cc3438ec2f996e3fa2d1748f0cd72df51c6487ef300ccb827fdf04` |
| `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 1,112 | 24,834 | `462e259e2a318f9900d99fc1a8b429b64777cec7f0f99650fd3458ab46912b94` |

The ranges below refer to the original `design-model.md` dialogue, excluding the earlier research-direction import. Concatenating them in source order reproduces all 482 logical lines and 11,425 bytes, including the absent final line terminator, with the original SHA-256 checksum `90a866bd1109a3ac565a40b9ce38cd655ccb7ef369a52f7cab09660fc862350d`.

| Original lines | Current destination | Current lines | Placement | Lines | Bytes | SHA-256 |
|---:|---|---:|---|---:|---:|---|
| 1-168 | `design-research/03-language-and-compiler/05-layered-design-model.md` | 1-168 | Retained at beginning | 168 | 4,643 | `1d21fcff9e0f612ae9b44504b4752e1a7043adb60a3ceb0d16fb2306aa3550cc` |
| 169-201 | `design-research/03-language-and-compiler/04-dsl-as-mediation-layer.md` | 235-267 | Before `## Where transactions belong` | 33 | 530 | `8b99e63123d69b05979a97506178f92c811f5f688813c568e472ae97201bf731` |
| 202-372 | `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | 473-643 | Before `### 2. Language and type/effect system` | 171 | 3,353 | `51543a0fc8c2a559c0be510e59409904cf27e9b3b38f70345b4397dc36f02c7a` |
| 373-424 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 471-522 | Before `## this separation` | 52 | 1,273 | `d5eeefd5078e74ce70ca3fa10c5bab2238e234aed628905e26ed6a1e71339908` |
| 425-482 | `design-research/03-language-and-compiler/05-layered-design-model.md` | 169-226 | Retained at end | 58 | 1,626 | `5ea61c0d4ad2625c2e9afbcd3fc5486979d26c3d499738c19dff722881aadfe1` |

The full `research-direction.md` dialogue was also reconstructed from its retained text and the ten third-stage blocks at their current destinations. It still matches the original 690 logical lines, 25,260 bytes, and SHA-256 checksum `376a1bc4b3b1788eedbd15815bb8176e5ed23bfe0421c5356b2993c3ea54b66c`.

## Eleventh-stage redistribution: language-and-formalism dialogue


The 759-line `languages.md` dialogue was separated into its language comparison and formalism survey, an effect vocabulary, and a shared semantic-IR architecture. Both passages were moved unchanged with `_scripts/move_text.py`, from the bottom of the source upward. The moves selected then-current lines 639-778 for the semantic-kernel note and 542-577 for the compiler note.

Immediately after the eleventh stage, the language-choice note retained 583 original lines plus the 42-line implementation-language passage received from `declarative-approach.md` during the eighth stage. That earlier import occupied lines 332-373, contained 1,017 bytes, and retained SHA-256 checksum `ab6c92e0a26ef35b945d3946282756e986810b47e7a2e38ba8714be7a252212e`. The complete note then contained 625 logical lines.

The following file checksums describe the state immediately after this redistribution. Existing destination text was preserved byte-for-byte. The combined size of the three affected content notes remains 58,141 bytes, and their final-line-terminator states are unchanged.

| Current file | Logical lines | Bytes | SHA-256 |
|---|---:|---:|---|
| `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 625 | 20,034 | `f77749e293b950a0d2e492ca2e340535b6b2615e7b8adfeee766ce84d828c8d8` |
| `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | 933 | 23,945 | `7aa962ae87c09a704df399975b0e048d315b7654fe83a92e1a3170aa6c052f18` |
| `design-research/03-language-and-compiler/07-semantic-kernel.md` | 758 | 14,162 | `dfacecaee1820b80c4557c972838f43fddd2c3ab852ed780833671629f8b71d9` |

The ranges below refer to the original `languages.md` dialogue, excluding the earlier declarative import. Concatenating them in source order reproduces all 759 logical lines and 22,903 bytes, including the absent final line terminator, with the original SHA-256 checksum `7452669c8c579e6d0d56eea276cd6197e4d4d3635aad7dc50b0c3484d2a91fd2`.

| Original lines | Current destination | Current lines | Placement | Lines | Bytes | SHA-256 |
|---:|---|---:|---|---:|---:|---|
| 1-331 | `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 1-331 | Retained at beginning | 331 | 9,337 | `49d89ec403f3560fe186327e75a215cf3df75b98880075117744e2d3f7edde99` |
| 332-499 | `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 374-541 | Retained after the earlier declarative import | 168 | 6,132 | `5cd52364132f1a71a213cab6e4674a003f0c9413d593b78e2fd66588b9167dff` |
| 500-535 | `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | 473-508 | Before `### 5. Make effects explicit` | 36 | 1,165 | `c106db86d1b6bf8d1463fd68169975fd6cdf6901c93f6990407fce1f0437b712` |
| 536-596 | `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 542-602 | Retained before the implementation-stack summary | 61 | 2,316 | `94a3dddf031bf526122a2e7f0606ffccf0a1348a3db17896c8e1dae6ba6b8725` |
| 597-736 | `design-research/03-language-and-compiler/07-semantic-kernel.md` | 472-611 | Before `### I would keep the kernel separate from execution` | 140 | 2,721 | `f3c846c18ec824fb92ae93514b699f28af5b57fcfc7e930476bf17c235dda98b` |
| 737-759 | `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 603-625 | Retained at end | 23 | 1,232 | `e647b47f0b572c8dfa251fb0d7d4742f8afc6c228b82783835a14508b4a2f70e` |

Adding the effect-vocabulary block shifted two earlier compiler imports without changing their text or checksums. Their updated locations in `02-typed-dsl-and-compiler.md` are:

| Original source and lines | Current lines | Bytes | SHA-256 |
|---|---:|---:|---|
| `design-model.md:202-372` | 509-679 | 3,353 | `51543a0fc8c2a559c0be510e59409904cf27e9b3b38f70345b4397dc36f02c7a` |
| `research-direction.md:174-215` | 715-756 | 843 | `68a6697d492a94db988b17e1546a234c6a0944edaa1e574410b8123a883b5da8` |

Two additional source reconstructions were checked. Excluding the new 140-line import from `07-semantic-kernel.md` reproduces its original 618 logical lines, 11,441 bytes, and SHA-256 checksum `51844f36adc939b917ddec8cd1e66e06fcb141dea520032fe652ec9d0eeb9769`. Reassembling `declarative-approach.md` from its retained core, the unchanged 42-line language passage, and the reading-path survey still reproduces its original 482 logical lines, 19,274 bytes, and checksum `b6d7c959ccffc4a09ceb4ec7c4d14f971093e34f0556a3bfbeee901ac78cadb2`.

## Twelfth-stage redistribution: semantic-kernel dialogue


The original 618-line `semantic-kernel.md` dialogue was separated into kernel design, program authoring and typed planning, an implementation-language comparison, and run versioning. The current note also contained a 140-line shared semantic-IR passage imported from `languages.md` during the eleventh stage. That imported text stays in the kernel note unchanged.

All three moves used `_scripts/move_text.py` without rewriting source text. They were applied from the bottom of the source upward: then-current lines 661-704 went to the runtime note before `## this separation`; lines 449-471 went to the language-choice note before `### My choice`; and lines 186-448 became the complete new authoring-and-planning note. The kernel now retains 288 original lines plus the 140-line import, totaling 428 logical lines. Its final implementation roadmap remains with the kernel design.

The following file checksums describe the state immediately after this redistribution. Each move was checked against the exact expected byte splice. All preexisting destination text was preserved byte-for-byte, and the combined size of these four content files remains 59,030 bytes. The three preexisting notes still have no final line terminator; the new authoring note retains its source block's final line terminator.

Whitespace checks pass for the tracked edits. The new authoring note ends with the original separator blank line from source line 448. Git reports that preserved line as a blank line at EOF; it was not trimmed, so the source block remains byte-for-byte intact.

| Current file | Logical lines | Bytes | SHA-256 |
|---|---:|---:|---|
| `design-research/03-language-and-compiler/07-semantic-kernel.md` | 428 | 8,438 | `b5eadcb49c584ed3de9f5f6bbb7be528588078e7b8a6664d8ececbbfdbae1b93` |
| `design-research/03-language-and-compiler/10-program-authoring-and-typed-planning.md` | 263 | 4,206 | `9ad9cbab5be507bd8f5f3f49b8bfadd6df4d8ad5c5462148a02c03aeb1576e3b` |
| `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 648 | 20,930 | `555e2396b1109bdd4488251848cd466eeaa2a1fde5d141aa1cee2b7d3b08e265` |
| `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 1,156 | 25,456 | `d62d3270de92b613c42a523e806d52c60808d607efbddab76e17767288d7157b` |

The ranges below refer to the original `semantic-kernel.md` dialogue, excluding the earlier language import. Concatenating them in source order reproduces all 618 logical lines and 11,441 bytes, including the absent final line terminator, with SHA-256 checksum `[repository fingerprint omitted]`. The reconstructed bytes were compared directly with the original file in Git HEAD.

| Original lines | Current destination | Current lines | Placement | Lines | Bytes | SHA-256 |
|---:|---|---:|---|---:|---:|---|
| 1-185 | `design-research/03-language-and-compiler/07-semantic-kernel.md` | 1-185 | Retained at beginning | 185 | 3,658 | `198dfe1b6b7711d1383406859dede7f0341a8383e33cfe04fa30f49adad682c4` |
| 186-448 | `design-research/03-language-and-compiler/10-program-authoring-and-typed-planning.md` | 1-263 | Entire new note | 263 | 4,206 | `9ad9cbab5be507bd8f5f3f49b8bfadd6df4d8ad5c5462148a02c03aeb1576e3b` |
| 449-471 | `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 308-330 | Before `### My choice` | 23 | 896 | `9c228b0687f5b170eeeed4618d8ce3f85ded6fe16f7b330fc7b5dc194d71f074` |
| 472-520 | `design-research/03-language-and-compiler/07-semantic-kernel.md` | 326-374 | After shared semantic-IR import | 49 | 838 | `83c3ca7d345f26fece9340ccbefc09b9ed626b7b018965c99ac3ddccae49638f` |
| 521-564 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 523-566 | Before `## this separation` | 44 | 622 | `6c223c326249660cf1b051d5008b76d8abb592fd30b068a59d482043de381eb5` |
| 565-618 | `design-research/03-language-and-compiler/07-semantic-kernel.md` | 375-428 | Retained at end | 54 | 1,221 | `679ca7103f5d1a1d4d38ee95c61a813162eb68d4b6ae685d6116ad653aa1a4f5` |

The following earlier imports retain their original bytes and checksums. The first two have new line positions; the runtime import remains at the same position, directly before the newly moved versioning passage.

| Original source and lines | Current destination | Current lines | Bytes | SHA-256 |
|---|---|---:|---:|---|
| `languages.md:597-736` | `design-research/03-language-and-compiler/07-semantic-kernel.md` | 186-325 | 2,721 | `f3c846c18ec824fb92ae93514b699f28af5b57fcfc7e930476bf17c235dda98b` |
| `declarative-approach.md:278-319` | `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 355-396 | 1,017 | `ab6c92e0a26ef35b945d3946282756e986810b47e7a2e38ba8714be7a252212e` |
| `design-model.md:373-424` | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 471-522 | 1,273 | `d5eeefd5078e74ce70ca3fa10c5bab2238e234aed628905e26ed6a1e71339908` |

The current locations of all original `languages.md` passages are recorded below. Its first retained block is now interrupted by the semantic-kernel language comparison. These seven ranges, concatenated in source order, reproduce the original 759 logical lines and 22,903 bytes with SHA-256 checksum `[repository fingerprint omitted]`. The reconstructed bytes were compared directly with Git HEAD.

| Original lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---:|---|---:|---:|---:|---|
| 1-307 | `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 1-307 | 307 | 8,544 | `78fe1fa9270c80da91fe34a6c975801012c9ccb22efa7cb5a3a785bc6bd3856e` |
| 308-331 | `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 331-354 | 24 | 793 | `b4dd678c7387a3c737d91fa4ba1cabf55e698de6745a693263d938abdf79ec84` |
| 332-499 | `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 397-564 | 168 | 6,132 | `5cd52364132f1a71a213cab6e4674a003f0c9413d593b78e2fd66588b9167dff` |
| 500-535 | `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | 473-508 | 36 | 1,165 | `c106db86d1b6bf8d1463fd68169975fd6cdf6901c93f6990407fce1f0437b712` |
| 536-596 | `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 565-625 | 61 | 2,316 | `94a3dddf031bf526122a2e7f0606ffccf0a1348a3db17896c8e1dae6ba6b8725` |
| 597-736 | `design-research/03-language-and-compiler/07-semantic-kernel.md` | 186-325 | 140 | 2,721 | `f3c846c18ec824fb92ae93514b699f28af5b57fcfc7e930476bf17c235dda98b` |
| 737-759 | `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 626-648 | 23 | 1,232 | `e647b47f0b572c8dfa251fb0d7d4742f8afc6c228b82783835a14508b4a2f70e` |

Two further reconstruction checks passed:

- The complete 758-line kernel note as it stood before this split was reconstructed by inserting the moved blocks around its retained text and unchanged shared-IR import. It reproduces all 14,162 bytes and checksum `dfacecaee1820b80c4557c972838f43fddd2c3ab852ed780833671629f8b71d9`.
- The original `declarative-approach.md` dialogue was reconstructed from `03-declarative-programming-model.md` lines 1-277, the language-choice import now at lines 355-396, the declarative core's lines 278-336, and `09-dsl-and-formal-methods-reading-path.md` lines 88-191. It matches Git HEAD exactly: 482 logical lines, 19,274 bytes, and checksum `[repository fingerprint omitted]`.

Earlier stage tables describe the state immediately after their respective redistributions. This stage supplies the current line locations for passages shifted by the semantic-kernel split.

## Thirteenth-stage redistribution: investigation-language dialogue


The 990-line `investigation-lang-alg.md` dialogue was separated into its complete investigation-machine design argument, provenance and argumentation foundations, a systems and related-work survey, a Co-STORM collaboration example, and a LangGraph execution-backend comparison. The design argument remains intact as original lines 1-455. The foundations and systems survey became two new notes; the collaboration and runtime comparisons were placed in existing notes.

All seven source-range moves used `_scripts/move_text.py` without rewriting source text, from the bottom of the source upward. Source ranges 918-990 and 835-917 first populated the empty related-work and foundations notes. Range 786-834 went to the investigation-runtime note before `## 1. Start with a small algebra`. Range 735-785 went to the augmentation-literature note. Ranges 534-734, 477-533, and 456-476 were then inserted into the new notes before their existing section headings, preserving each note's source-order passages. A final same-file move placed the Co-STORM block at the end of the literature note, after its complete 59-line prior content, keeping its heading with the example and the earlier sensemaking discussion together.

The following file checksums describe the state immediately after this redistribution. Every move was compared against the exact expected byte splice. All preexisting destination bytes were preserved, and the combined size of these five content files remains 48,882 bytes.

| Current file | Logical lines | Bytes | SHA-256 |
|---|---:|---:|---|
| `design-research/04-investigation-and-epistemics/01-investigation-language-and-algebra.md` | 455 | 8,796 | `7cbd34411ef711e41ef7507f605efe7c6a0a060c85f4d0d89a2b66ab5d0c4486` |
| `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 140 | 3,463 | `de1e5a68cb0fca5bbceac67bf669bb5e153ed79ac304b7899b196173dd3d0397` |
| `design-research/06-research-reports/04-investigation-systems-and-related-work.md` | 295 | 10,879 | `69cb4f98fa59c654161faa226b2361dda10e6ba161699e8537001848cc1f31d1` |
| `design-research/02-human-ai-collaboration/04-augmentation-literature-and-reading-path.md` | 110 | 12,883 | `1986d40e476134477a4bc3c216edd32c0e0d0a018a87a05a53669ded4a3b2eeb` |
| `design-research/04-investigation-and-epistemics/02-llm-operated-investigation-runtime.md` | 749 | 12,861 | `06ba84e7044c5782064a00e5aa7b32b688b836304e2ac79547c79eea236d8102` |

The source file's final unterminated line now ends the related-work note, so it was not joined to any following text or given a new terminator. The runtime and literature notes retain their prior final-line-terminator states. The core, foundations, and literature notes retain their source passages' final separator blank lines. Git's whitespace check flags those three preserved lines as blank lines at EOF; they were not trimmed.

The ranges below refer to the original `investigation-lang-alg.md` dialogue. Each original line is represented exactly once. Concatenating the eight ranges in source order reproduces all 990 logical lines and 25,461 bytes, preserves the absent final line terminator, and yields SHA-256 checksum `[repository fingerprint omitted]`. The reconstructed bytes were compared directly with Git HEAD.

| Original lines | Current destination | Current lines | Placement | Lines | Bytes | SHA-256 |
|---:|---|---:|---|---:|---:|---|
| 1-455 | `design-research/04-investigation-and-epistemics/01-investigation-language-and-algebra.md` | 1-455 | Retained as the complete design argument | 455 | 8,796 | `7cbd34411ef711e41ef7507f605efe7c6a0a060c85f4d0d89a2b66ab5d0c4486` |
| 456-476 | `design-research/06-research-reports/04-investigation-systems-and-related-work.md` | 1-21 | Related-work introduction and comparison table | 21 | 1,312 | `d19fe0abdbf4951d2f3b468349e68f3a8529718540273d77a26a5c3cc264ef16` |
| 477-533 | `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 1-57 | Provenance semirings | 57 | 1,574 | `074cf619a16970fa892c425b05dd0f0e0559833da7d8f7cb868c7a273c8c2058` |
| 534-734 | `design-research/06-research-reports/04-investigation-systems-and-related-work.md` | 22-222 | Scientific workflows, DSPy and Palantir | 201 | 5,057 | `2fea90c4ea48a8f9640fc06cee434916f30194d03a2f992f62587419563ca60a` |
| 735-785 | `design-research/02-human-ai-collaboration/04-augmentation-literature-and-reading-path.md` | 60-110 | At end, after the complete existing literature note | 51 | 1,273 | `2d4b7314c6489ef83dadf711005d50cb14e8de3a98a401c9b0fe0cc381813c30` |
| 786-834 | `design-research/04-investigation-and-epistemics/02-llm-operated-investigation-runtime.md` | 49-97 | Before `## 1. Start with a small algebra` | 49 | 1,050 | `15c5edfde8be79727cdf876259783e9c96a4b18a5781b6015837c6cc78c5f9bd` |
| 835-917 | `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 58-140 | Argumentation theory and W3C PROV | 83 | 1,889 | `f0456381ad7d09d8d2033d6f73705f6a852b55f873f10943db1ec18c3ae3f411` |
| 918-990 | `design-research/06-research-reports/04-investigation-systems-and-related-work.md` | 223-295 | Recent research and the proposed research gap | 73 | 4,510 | `c9514f7f556f4b6ced1c4c43bb2c7831a67dcc87326280c987f321823dfb178e` |

The original `investigation-lang-alg-llm-layer.md` runtime dialogue is unchanged around the new 49-line import. Its current ranges are recorded below. Concatenating them reproduces the original 700 logical lines, 11,811 bytes, absent final line terminator, and SHA-256 checksum `[repository fingerprint omitted]` exactly against Git HEAD.

| Original lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---:|---|---:|---:|---:|---|
| 1-48 | `design-research/04-investigation-and-epistemics/02-llm-operated-investigation-runtime.md` | 1-48 | 48 | 1,105 | `9a320758d6ac213b1f292f236bcd4d75645be0f028887f1835d7d9afb88d1a6a` |
| 49-700 | `design-research/04-investigation-and-epistemics/02-llm-operated-investigation-runtime.md` | 98-749 | 652 | 10,706 | `7966fc3520b2741487b80786948f9e63ffd78b759b865627d3b057a8128f60a5` |

The Co-STORM block was appended after the literature note's prior content. The earlier 26-line sensemaking-related-work import therefore remains contiguous at literature-note lines 34-59, with 4,129 bytes and checksum `8d17147dce65ddb4ef53bc63f53996171e994cd86c9a6cba231d15f74321862e`. The full current mapping for the original `sensemaking.md` dialogue is:

| Original lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---:|---|---:|---:|---:|---|
| 1-65 | `design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-action.md` | 1-65 | 65 | 2,580 | `328f116b4af4609e71dcec96fff9456f4978d491fc50555043e37ddddeca31b2` |
| 66-91 | `design-research/02-human-ai-collaboration/04-augmentation-literature-and-reading-path.md` | 34-59 | 26 | 4,129 | `8d17147dce65ddb4ef53bc63f53996171e994cd86c9a6cba231d15f74321862e` |
| 92-119 | `design-research/02-human-ai-collaboration/01-augmenting-human-work.md` | 368-395 | 28 | 988 | `42a3c801bbebe933819c9b0aeb8059d651958ac3ec1cf71a2b8bd1a9f2be4e8f` |

Reassembling those three ranges matches Git HEAD exactly: 119 logical lines, 7,697 bytes, no final line terminator, and SHA-256 checksum `[repository fingerprint omitted]`.

The fifth-stage literature passages from `some-augmenting.md` remain unchanged at literature-note lines 1-5 and 6-33. The complete 335-line original augmentation dialogue was also reconstructed from its seven fifth-stage destinations and compared with Git HEAD. It still contains 20,718 bytes with checksum `[repository fingerprint omitted]`. Removing the Co-STORM import virtually from the literature note also reproduces its complete pre-split 59-line, 11,610-byte state with checksum `[repository fingerprint omitted]`.

Earlier stage tables describe the state immediately after their respective redistributions. This stage supplies the current locations for the runtime and sensemaking passages affected by this split.

## Fourteenth-stage redistribution: LLM-operated investigation-runtime dialogue


The original 700-line `investigation-lang-alg-llm-layer.md` dialogue was separated into its runtime architecture and five related topics: program synthesis and repair, epistemic checks, intrinsic provenance, program-derived UI views, and capability-scoped collaboration. All material went to existing notes; no new notes were created.

Before the split, the runtime note contained 749 logical lines, including the 49-line LangGraph comparison imported from `investigation-lang-alg.md` during the thirteenth stage. The core retains then-current lines 1-306 and 708-749. It now contains 299 original lines plus that unchanged import, totaling 348 logical lines.

All six moves used `_scripts/move_text.py` without rewriting source text, from the bottom of the source upward. The collaboration, UI, provenance, and authoring meta-operation passages were appended after existing destination content. The 101-line epistemic-check passage was inserted before `## resources-point`. The 85-line synthesis-and-repair passage was inserted before the newly appended `## 9. Give the agent meta-operations too` section, keeping both investigation-authoring passages together in their original order.

The following file checksums describe the state immediately after this redistribution. Every move was compared with the exact expected byte splice. All preexisting destination bytes were preserved, and the combined size of these six content notes remains 41,564 bytes. Every note retains its prior final-line-terminator state, including the runtime core's absent final terminator.

| Current file | Logical lines | Bytes | SHA-256 |
|---|---:|---:|---|
| `design-research/04-investigation-and-epistemics/02-llm-operated-investigation-runtime.md` | 348 | 6,662 | `1acfbf78bb80e94997ac5d3b091c5b95cce7473258b9971169025b0a7f316511` |
| `design-research/03-language-and-compiler/10-program-authoring-and-typed-planning.md` | 412 | 6,860 | `4ec741cb9448d8f3ce529070712603fbb26af87051f0f99d6ebe6cfabd5a6019` |
| `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 959 | 16,104 | `8a20db744166dbeaa68ca02990e37c392c60c2b7510aa79a7daaa2712e3be242` |
| `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 193 | 4,194 | `59fefc199581aa51fd698da32543597a1a809a67a083f88b6597f495d7a5ecc4` |
| `design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-action.md` | 121 | 3,219 | `cba6b200ab7627dc5709b0645055d26241c13812cedf9ffcd8ab5c8844ea7ff4` |
| `design-research/01-foundations/04-participant-neutral-system-model.md` | 187 | 4,525 | `1e9181a6999c5f275b848676772a54b113e6503aaf94946b4a5553990145105f` |

The selected source ranges below refer to the 749-line runtime note immediately before this split, including its earlier LangGraph import. The two retained ranges are now at runtime-core lines 1-306 and 307-348. Reassembling those retained ranges and these six moved passages in their former source order reproduces all 12,861 bytes and SHA-256 checksum `06ba84e7044c5782064a00e5aa7b32b688b836304e2ac79547c79eea236d8102` exactly.

| Before-split lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---:|---|---:|---:|---:|---|
| 307-391 | `design-research/03-language-and-compiler/10-program-authoring-and-typed-planning.md` | 264-348 | 85 | 1,561 | `a116bf86d74ffe7629d6649cf2685518fd1ec0cfd18360efd193988a2683c351` |
| 392-492 | `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 514-614 | 101 | 1,378 | `4cb25f9c53d081c210e9ba06ce0823419f2e61b28cc6d545e89bc26cd74e92df` |
| 493-545 | `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 141-193 | 53 | 731 | `a1e564dc7e3446fb1cae9262058c280867ada34e1f8e0ac283d340c8f8322db6` |
| 546-609 | `design-research/03-language-and-compiler/10-program-authoring-and-typed-planning.md` | 349-412 | 64 | 1,093 | `47fbe612b6da7f191713f38fd978c6fcf48b589652b3ab40d3b60a43fdc21b59` |
| 610-665 | `design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-action.md` | 66-121 | 56 | 639 | `9eeaf587e538b9c61252c7708576232c3254248bb3ad89fe21e4f8b9279276f2` |
| 666-707 | `design-research/01-foundations/04-participant-neutral-system-model.md` | 146-187 | 42 | 797 | `41442e8d9378c4349d091709c150287fca3d63eea2b75985c571e7b897713646` |

The next table refers to the original 700-line `investigation-lang-alg-llm-layer.md` dialogue, excluding the LangGraph import. Each original line is represented exactly once. Concatenating the nine ranges in source order matches Git HEAD byte-for-byte: 700 logical lines, 11,811 bytes, no final line terminator, and SHA-256 checksum `[repository fingerprint omitted]`.

| Original lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---:|---|---:|---:|---:|---|
| 1-48 | `design-research/04-investigation-and-epistemics/02-llm-operated-investigation-runtime.md` | 1-48 | 48 | 1,105 | `9a320758d6ac213b1f292f236bcd4d75645be0f028887f1835d7d9afb88d1a6a` |
| 49-257 | `design-research/04-investigation-and-epistemics/02-llm-operated-investigation-runtime.md` | 98-306 | 209 | 2,771 | `bb8660d7c8c30a2eabf595e42018738efa081fc374be448b39d720452c867390` |
| 258-342 | `design-research/03-language-and-compiler/10-program-authoring-and-typed-planning.md` | 264-348 | 85 | 1,561 | `a116bf86d74ffe7629d6649cf2685518fd1ec0cfd18360efd193988a2683c351` |
| 343-443 | `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 514-614 | 101 | 1,378 | `4cb25f9c53d081c210e9ba06ce0823419f2e61b28cc6d545e89bc26cd74e92df` |
| 444-496 | `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 141-193 | 53 | 731 | `a1e564dc7e3446fb1cae9262058c280867ada34e1f8e0ac283d340c8f8322db6` |
| 497-560 | `design-research/03-language-and-compiler/10-program-authoring-and-typed-planning.md` | 349-412 | 64 | 1,093 | `47fbe612b6da7f191713f38fd978c6fcf48b589652b3ab40d3b60a43fdc21b59` |
| 561-616 | `design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-action.md` | 66-121 | 56 | 639 | `9eeaf587e538b9c61252c7708576232c3254248bb3ad89fe21e4f8b9279276f2` |
| 617-658 | `design-research/01-foundations/04-participant-neutral-system-model.md` | 146-187 | 42 | 797 | `41442e8d9378c4349d091709c150287fca3d63eea2b75985c571e7b897713646` |
| 659-700 | `design-research/04-investigation-and-epistemics/02-llm-operated-investigation-runtime.md` | 307-348 | 42 | 1,736 | `f127ca3894352f0d483bfa0c71749489fd47e1288f790da2e78eb77450c64541` |

The earlier LangGraph passage remains at runtime-core lines 49-97. It still matches original `investigation-lang-alg.md` lines 786-834 exactly: 49 lines, 1,050 bytes, and checksum `15c5edfde8be79727cdf876259783e9c96a4b18a5781b6015837c6cc78c5f9bd`.

Four complete preexisting destination payloads remain as unchanged prefixes:

| Current destination | Preserved current lines | Lines | Bytes | SHA-256 |
|---|---:|---:|---:|---|
| `design-research/03-language-and-compiler/10-program-authoring-and-typed-planning.md` | 1-263 | 263 | 4,206 | `9ad9cbab5be507bd8f5f3f49b8bfadd6df4d8ad5c5462148a02c03aeb1576e3b` |
| `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 1-140 | 140 | 3,463 | `de1e5a68cb0fca5bbceac67bf669bb5e153ed79ac304b7899b196173dd3d0397` |
| `design-research/02-human-ai-collaboration/02-sensemaking-and-epistemic-action.md` | 1-65 | 65 | 2,580 | `328f116b4af4609e71dcec96fff9456f4978d491fc50555043e37ddddeca31b2` |
| `design-research/01-foundations/04-participant-neutral-system-model.md` | 1-145 | 145 | 3,728 | `e52f761998c07e78776ab181408f0865f1e4fccd3e65221ed0114b116b882ef5` |

The original `dsl-for-rag.md` payload remains unchanged around its new 101-line import. Its current mapping is recorded below. Concatenating the two ranges matches Git HEAD exactly: 858 logical lines, 14,726 bytes, no final line terminator, and checksum `[repository fingerprint omitted]`.

| Original lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---:|---|---:|---:|---:|---|
| 1-513 | `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 1-513 | 513 | 8,624 | `e5fee5537a43034143a6d5fe29abcfb1a92ec44e7863f333dffc8fdcac9ca3aa` |
| 514-858 | `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 615-959 | 345 | 6,102 | `2eac8d3e2b77e29777a3f7edb6a1ae4e006129228d86c9f60c5df263b9ed6c0f` |

Three further original-dialogue reconstructions were checked using the twelfth- and thirteenth-stage mappings, whose passage ranges remain valid after these additions:

- `semantic-kernel.md`: 618 logical lines, 11,441 bytes, checksum `51844f36adc939b917ddec8cd1e66e06fcb141dea520032fe652ec9d0eeb9769`. Its authoring passage remains intact at authoring-note lines 1-263.
- `investigation-lang-alg.md`: 990 logical lines, 25,461 bytes, checksum `b7f56872d4c2c814541c5fdcba69a6482cee108381ffed9a1e05f5698801bdee`. Its provenance passages remain at foundations-note lines 1-140, and its LangGraph passage remains at runtime-core lines 49-97.
- `sensemaking.md`: 119 logical lines, 7,697 bytes, checksum `4b7a3a9bc4666eee14990d6b52b4ae7978f9252ed4d22241e0157ec98e2a3db8`. Its conceptual core remains at sensemaking-note lines 1-65, before the new UI passage.

The participant-neutral note's preserved 145-line prefix was also compared directly with the concatenation of original `problem-framing.md` lines 15-68, `some-augmenting.md` lines 67-92, and `research-direction.md` lines 454-518. All three earlier imports retain their original bytes and positions.

The appended authoring, provenance, sensemaking, and participant-neutral passages keep their original final separator blank lines. Git's whitespace checks flag those preserved lines at destination EOF; they were not trimmed. Earlier stage tables describe historical post-stage states, and this stage records the runtime redistribution's current locations.

## Fifteenth-stage redistribution: epistemic-contracts dialogue


The original `dsl-for-rag.md` dialogue was separated into epistemic contracts, compiler diagnostics and program repair, and resource constraints for investigation planning. Before the split, the epistemic note contained 959 logical lines, including the 101-line passage on gaps, failures, and assertions imported from `investigation-lang-alg-llm-layer.md` during the fourteenth stage. The earlier import stays in the epistemic note unchanged.

First, `_scripts/move_text.py` moved then-current lines 615 to 959 into the new resource-planning note with `--at-end --apply`. Second, the script moved then-current lines 357 to 403 into the existing authoring note before `## 9. Give the agent meta-operations too`. The repair example now follows the earlier investigation-program repair passage. The cost estimates, execution classes, and cost and coverage views stay together in the resource-planning note.

The epistemic note retains 466 original lines plus the unchanged 101-line import, totaling 567 logical lines. The authoring note now contains 459 logical lines, and the new resource-planning note contains 345 logical lines.

Every move was compared with the exact expected byte splice. Removing the new repair passage from the authoring note reproduces all 6,860 bytes of its previous contents with checksum `4ec741cb9448d8f3ce529070712603fbb26af87051f0f99d6ebe6cfabd5a6019`. The combined size of the three content notes remains 22,964 bytes.

All retained and moved blocks keep their original line terminators. The epistemic note now ends with the earlier import's separator blank line, while the resource-planning note retains the original dialogue's absent final line terminator. The authoring note still ends with its previous separator blank line.

| Current file | Logical lines | Bytes | SHA-256 |
|---|---|---|---|
| `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 567 | 9,338 | `aa06a1d9eea0883b869dbc6f55442e51b547553f76084d3f1ba1de2e96f2ce3a` |
| `design-research/03-language-and-compiler/10-program-authoring-and-typed-planning.md` | 459 | 7,524 | `d191845dd483a966c5496af6fb9290ae043094fb26e83246f8612d01046f6bc4` |
| `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 345 | 6,102 | `2eac8d3e2b77e29777a3f7edb6a1ae4e006129228d86c9f60c5df263b9ed6c0f` |

The ranges below refer to the complete 959-line epistemic note immediately before the split, including the earlier import. Each line is represented exactly once. Concatenating the four ranges in their previous order reproduces all 16,104 bytes and checksum `8a20db744166dbeaa68ca02990e37c392c60c2b7510aa79a7daaa2712e3be242`.

| Before-split lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 356 | `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 1 to 356 | 356 | 6,223 | `94a2944483cf207b22a7c5a053719cb272e274323aed7d853b7501f5745e890d` |
| 357 to 403 | `design-research/03-language-and-compiler/10-program-authoring-and-typed-planning.md` | 349 to 395 | 47 | 664 | `268b7d3723fbcd402d24def6da367422897deb8322f8184f80e2d2a4e953530d` |
| 404 to 614 | `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 357 to 567 | 211 | 3,115 | `5973a657babcc4cfe9e10052031211b2b27fefcdcfbd385d5cd8055a0685d69a` |
| 615 to 959 | `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 1 to 345 | 345 | 6,102 | `2eac8d3e2b77e29777a3f7edb6a1ae4e006129228d86c9f60c5df263b9ed6c0f` |

The next table refers to the original 858-line `dsl-for-rag.md` dialogue, excluding the imported runtime passage. Concatenating the four ranges in source order matches Git HEAD exactly, including all 14,726 bytes and the absent final line terminator. Its checksum remains `[repository fingerprint omitted]`.

| Original lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 356 | `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 1 to 356 | 356 | 6,223 | `94a2944483cf207b22a7c5a053719cb272e274323aed7d853b7501f5745e890d` |
| 357 to 403 | `design-research/03-language-and-compiler/10-program-authoring-and-typed-planning.md` | 349 to 395 | 47 | 664 | `268b7d3723fbcd402d24def6da367422897deb8322f8184f80e2d2a4e953530d` |
| 404 to 513 | `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 357 to 466 | 110 | 1,737 | `21ca6ba324d68243f2fc461bfe2a4fd8bd4662e516ed9d2cc5f8789324500592` |
| 514 to 858 | `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 1 to 345 | 345 | 6,102 | `2eac8d3e2b77e29777a3f7edb6a1ae4e006129228d86c9f60c5df263b9ed6c0f` |

The earlier runtime imports have the current locations recorded below. In the epistemic note, the 101-line import shifted from lines 514 to 614 to lines 467 to 567. In the authoring note, the meta-operation and API passage shifted from lines 349 to 412 to lines 396 to 459. The earlier synthesis passage, semantic-kernel authoring passage, and LangGraph passage kept their previous locations.

| Original source and lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| `investigation-lang-alg-llm-layer.md:343 to 443` | `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 467 to 567 | 101 | 1,378 | `4cb25f9c53d081c210e9ba06ce0823419f2e61b28cc6d545e89bc26cd74e92df` |
| `investigation-lang-alg-llm-layer.md:258 to 342` | `design-research/03-language-and-compiler/10-program-authoring-and-typed-planning.md` | 264 to 348 | 85 | 1,561 | `a116bf86d74ffe7629d6649cf2685518fd1ec0cfd18360efd193988a2683c351` |
| `investigation-lang-alg-llm-layer.md:497 to 560` | `design-research/03-language-and-compiler/10-program-authoring-and-typed-planning.md` | 396 to 459 | 64 | 1,093 | `47fbe612b6da7f191713f38fd978c6fcf48b589652b3ab40d3b60a43fdc21b59` |
| `semantic-kernel.md:186 to 448` | `design-research/03-language-and-compiler/10-program-authoring-and-typed-planning.md` | 1 to 263 | 263 | 4,206 | `9ad9cbab5be507bd8f5f3f49b8bfadd6df4d8ad5c5462148a02c03aeb1576e3b` |
| `investigation-lang-alg.md:786 to 834` | `design-research/04-investigation-and-epistemics/02-llm-operated-investigation-runtime.md` | 49 to 97 | 49 | 1,050 | `15c5edfde8be79727cdf876259783e9c96a4b18a5781b6015837c6cc78c5f9bd` |

The complete original dialogues listed below were reconstructed from their current destinations and compared directly with Git HEAD. Every reconstruction matched exactly, and each original line was represented once.

| Original dialogue | Logical lines | Bytes | SHA-256 |
|---|---|---|---|
| `dsl-approach/dsl-for-rag.md` | 858 | 14,726 | `a71594404daf21b5b412db7bfde65750cf941716df0ba44a41e5bebea4b1d2df` |
| `investigation-lang-alg-llm-layer.md` | 700 | 11,811 | `2b5b352b5b805c76c49fdc38b07201cf02d6a7bf823165a5f3cba248142f7f6c` |
| `semantic-kernel.md` | 618 | 11,441 | `51844f36adc939b917ddec8cd1e66e06fcb141dea520032fe652ec9d0eeb9769` |
| `investigation-lang-alg.md` | 990 | 25,461 | `b7f56872d4c2c814541c5fdcba69a6482cee108381ffed9a1e05f5698801bdee` |

Git's whitespace checks report preserved separator blank lines at epistemic-note line 567 and authoring-note line 459. The source blank lines were not trimmed. No other source text was changed, and no files were staged or committed.

Earlier stage tables describe historical states. The runtime mapping from the fourteenth stage remains valid apart from the two imported passages whose updated locations are recorded above.

## Sixteenth-stage redistribution: generalized-agent-runtime dialogue


The original `architecture-generalization.md` dialogue was separated into runtime architecture, product strategy, formal execution models, blackboard coordination, Datalog reasoning, and argumentation. A passage on shared programs from `research-direction.md` was also moved to the declarative-programming note.

Before the split, the runtime note contained 1,156 logical lines. It held 926 original lines and 230 lines imported during earlier stages. The runtime core now retains 436 original lines and 187 imported lines, totaling 623 logical lines. The new formal-model note contains 360 logical lines.

All eight moves used `_scripts/move_text.py` from the bottom of the source upward, without rewriting dialogue text. The source ranges were 1099 to 1156, 981 to 1023, 929 to 980, 901 to 928, 861 to 900, 817 to 860, 567 to 816, and 356 to 373. The final ranges and destinations are recorded below.

The new formal-model note keeps the original order of its three passages. First, the final DSL passage was moved into the empty note. Second, the process-calculus and behavior-tree passage was inserted before `## A DSL could hide almost all of that machinery`. Third, the Petri-net, resource, type/effect, and temporal-verification passage was inserted before `### 8. Process calculi may be useful, but I'd keep them underneath`.

The shared-program passage was inserted before `### Partial programs are probably necessary` in the declarative note. The argumentation passage was inserted before `### 8. W3C PROV gives a ready-made vocabulary for lineage`, and the Datalog passage was inserted before `### Cedar shows why separate small languages can work`. The blackboard passage was appended to the participant-neutral note. The product-strategy passage was inserted before `## reframing` in the research-direction note.

Each move was compared with the exact expected byte splice. Every existing destination's previous contents were preserved, and the combined size of the seven content notes remains 75,769 bytes. The runtime core now ends with the separator blank line from then-current source line 1098. The new formal-model note keeps the original dialogue's absent final line terminator, and all five existing destinations keep their previous final-line-terminator states.

| Current file | Logical lines | Bytes | SHA-256 |
|---|---|---|---|
| `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 623 | 11,979 | `940d27033d07df3696b7cee71ef536612fa50152c5201877d71ce32ca0c6a8ef` |
| `design-research/00-overview/02-research-direction.md` | 237 | 14,258 | `01fb457980b1d0496f5c9a0a8c8dd7563a7a7376f6f4d8313a5d598aecd79685` |
| `design-research/01-foundations/04-participant-neutral-system-model.md` | 231 | 5,855 | `e33ada284880e33f1af4b3fa441e3bfa8ec0d8172e877c091f5496f0fae81233` |
| `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 688 | 21,613 | `7e459aee0b26868fcb631f06112c5b003f86dc6ce64eb370b3777d7c7a547190` |
| `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 221 | 4,692 | `aaf4002a917820c5fb91585773148666df6d968a78d7494725dc6ffa4a76c70d` |
| `design-research/03-language-and-compiler/03-declarative-programming-model.md` | 379 | 8,029 | `a7c25a891230c4a6b8853e8f7bec0875d20419146e5a00f08a110ed9d5e271f6` |
| `design-research/05-runtime-and-execution/04-formal-models-for-agent-execution.md` | 360 | 9,343 | `d65e5f25178fb3bc3244fadc6f76cc28f5e36a64518c648765f1e44329c2ba4c` |

The next table maps every line of the complete 1,156-line runtime note immediately before the split, including its earlier imports. Each line is represented exactly once. Concatenating the eleven ranges in their previous order reproduces all 25,456 bytes and checksum `d62d3270de92b613c42a523e806d52c60808d607efbddab76e17767288d7157b`.

| Before-split lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 355 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 1 to 355 | 355 | 5,244 | `6607f7021ee2c64e35f326311b05dd84c3d2a1c867ef4166c25813d4e3d18b7c` |
| 356 to 373 | `design-research/00-overview/02-research-direction.md` | 98 to 115 | 18 | 653 | `80476ee0493f5a96196c7c7ae72a005487e5f043a1757b23ee757634c69b7f9f` |
| 374 to 566 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 356 to 548 | 193 | 4,675 | `7b52120c67bd2a8907f0c6f7862e3c3453893e2cba79d8ccd535583f9d48b82f` |
| 567 to 816 | `design-research/05-runtime-and-execution/04-formal-models-for-agent-execution.md` | 1 to 250 | 250 | 6,132 | `f0238dab1c49c710cd4f37763b0184d85a279305d340de58966cc4271deb8ba1` |
| 817 to 860 | `design-research/01-foundations/04-participant-neutral-system-model.md` | 188 to 231 | 44 | 1,330 | `ac640c9bca39d40cb2147d266a7ae6d2d9cdeff1b546143086ffbb92954014e7` |
| 861 to 900 | `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 565 to 604 | 40 | 683 | `34b83631d57c6ee5108f55fc9ae82c71dd78e5fd6f1820e2b957086fe1872ad6` |
| 901 to 928 | `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 100 to 127 | 28 | 498 | `fd0948d84e5c54023114e887b226defd6abcc855bc66affc8226d8223ccf758d` |
| 929 to 980 | `design-research/05-runtime-and-execution/04-formal-models-for-agent-execution.md` | 251 to 302 | 52 | 1,677 | `37cc559878a614c18ab8e94a468aa6f93786dd96fea2c63d1abfc53e057e0654` |
| 981 to 1023 | `design-research/03-language-and-compiler/03-declarative-programming-model.md` | 168 to 210 | 43 | 970 | `bddb0172285fe4365c8f27a3ba846fda6a9e6c76ccf9631f54890034e887106f` |
| 1024 to 1098 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 549 to 623 | 75 | 2,060 | `a56348fdec89897b1ea60f7d421fd7b204771b324ae72eb1ddc628ef5c6185e7` |
| 1099 to 1156 | `design-research/05-runtime-and-execution/04-formal-models-for-agent-execution.md` | 303 to 360 | 58 | 1,534 | `b4314cb317f7b4e7dd4e22586ff528c6fa94718253e2e9c0b926c7ba820024f9` |

The following table maps the original 926-line `architecture-generalization.md` dialogue, excluding the earlier imports. Concatenating the ten ranges in original order matches Git HEAD exactly, including all 20,143 bytes and the absent final line terminator. Its checksum remains `[repository fingerprint omitted]`.

| Original lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 355 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 1 to 355 | 355 | 5,244 | `6607f7021ee2c64e35f326311b05dd84c3d2a1c867ef4166c25813d4e3d18b7c` |
| 356 to 373 | `design-research/00-overview/02-research-direction.md` | 98 to 115 | 18 | 653 | `80476ee0493f5a96196c7c7ae72a005487e5f043a1757b23ee757634c69b7f9f` |
| 374 to 379 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 356 to 361 | 6 | 332 | `7d6bd208abbcced1cd23484fa6013540c61f780ac3e852d9feee56f2787dfe2b` |
| 380 to 629 | `design-research/05-runtime-and-execution/04-formal-models-for-agent-execution.md` | 1 to 250 | 250 | 6,132 | `f0238dab1c49c710cd4f37763b0184d85a279305d340de58966cc4271deb8ba1` |
| 630 to 673 | `design-research/01-foundations/04-participant-neutral-system-model.md` | 188 to 231 | 44 | 1,330 | `ac640c9bca39d40cb2147d266a7ae6d2d9cdeff1b546143086ffbb92954014e7` |
| 674 to 713 | `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 565 to 604 | 40 | 683 | `34b83631d57c6ee5108f55fc9ae82c71dd78e5fd6f1820e2b957086fe1872ad6` |
| 714 to 741 | `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 100 to 127 | 28 | 498 | `fd0948d84e5c54023114e887b226defd6abcc855bc66affc8226d8223ccf758d` |
| 742 to 793 | `design-research/05-runtime-and-execution/04-formal-models-for-agent-execution.md` | 251 to 302 | 52 | 1,677 | `37cc559878a614c18ab8e94a468aa6f93786dd96fea2c63d1abfc53e057e0654` |
| 794 to 868 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 549 to 623 | 75 | 2,060 | `a56348fdec89897b1ea60f7d421fd7b204771b324ae72eb1ddc628ef5c6185e7` |
| 869 to 926 | `design-research/05-runtime-and-execution/04-formal-models-for-agent-execution.md` | 303 to 360 | 58 | 1,534 | `b4314cb317f7b4e7dd4e22586ff528c6fa94718253e2e9c0b926c7ba820024f9` |

The earlier runtime imports remain unchanged at the locations below. The computational-model, durability, failure/replay, and versioning passages stay in the runtime core. The complete 43-line shared-program passage now occupies declarative-note lines 168 to 210.

| Original source and lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| `research-direction.md:72 to 138` | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 362 to 428 | 67 | 1,669 | `013851091196d9415aa859dca72814ea54a4ed964fda0ff5c74e2f14198478b0` |
| `research-direction.md:216 to 239` | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 429 to 452 | 24 | 779 | `03a44a46a2e907e854c1ab80669874a03e87231a82031551083b424516fc1a2e` |
| `dsl-approach/design-model.md:373 to 424` | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 453 to 504 | 52 | 1,273 | `d5eeefd5078e74ce70ca3fa10c5bab2238e234aed628905e26ed6a1e71339908` |
| `semantic-kernel.md:521 to 564` | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 505 to 548 | 44 | 622 | `6c223c326249660cf1b051d5008b76d8abb592fd30b068a59d482043de381eb5` |
| `research-direction.md:564 to 606` | `design-research/03-language-and-compiler/03-declarative-programming-model.md` | 168 to 210 | 43 | 970 | `bddb0172285fe4365c8f27a3ba846fda6a9e6c76ccf9631f54890034e887106f` |

The current mapping for the complete original `research-direction.md` dialogue is recorded below because the product-strategy insertion split one of its retained passages. Concatenating the thirteen ranges reproduces its original 690 logical lines and 25,260 bytes, with checksum `376a1bc4b3b1788eedbd15815bb8176e5ed23bfe0421c5356b2993c3ea54b66c`.

| Original lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 71 | `design-research/00-overview/02-research-direction.md` | 1 to 71 | 71 | 7,341 | `f852d0c87a3054afe4327d90bc2f6cb496971d8452fedc50655378a03f2e97c3` |
| 72 to 138 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 362 to 428 | 67 | 1,669 | `013851091196d9415aa859dca72814ea54a4ed964fda0ff5c74e2f14198478b0` |
| 139 to 215 | `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | 680 to 756 | 77 | 1,571 | `aa178af1e18471665ad91d22f40a4f81f8c58d52ee74d887c0fda5feb3dbbecc` |
| 216 to 239 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 429 to 452 | 24 | 779 | `03a44a46a2e907e854c1ab80669874a03e87231a82031551083b424516fc1a2e` |
| 240 to 271 | `design-research/05-runtime-and-execution/02-database-centered-runtime.md` | 335 to 366 | 32 | 761 | `74a516c47a4ab3ebd0a817a2bb7c9242a0272beb808aa22ea91b51e9ec09cf8f` |
| 272 to 315 | `design-research/02-human-ai-collaboration/01-augmenting-human-work.md` | 324 to 367 | 44 | 1,324 | `d88eb58e627da344923c7d312c8e0ca0e35b965eb9d81287c4d4ede179599a86` |
| 316 to 341 | `design-research/00-overview/02-research-direction.md` | 72 to 97 | 26 | 1,394 | `bcd63cf2ddd20378ad0c094677dbc4376d1f23294b8746458445b0218c191e6e` |
| 342 to 379 | `design-research/00-overview/02-research-direction.md` | 116 to 153 | 38 | 1,753 | `02ce0cdb2cad16c17fa29f156bf0ce6c8d4337a75a58284752702d94ff56c3e3` |
| 380 to 453 | `design-research/01-foundations/05-constrained-common-substrate.md` | 71 to 144 | 74 | 2,384 | `0d69fa5a1208032ed251fba72691c7cef17341aa5cc317959dcb884b7c2f8416` |
| 454 to 518 | `design-research/01-foundations/04-participant-neutral-system-model.md` | 81 to 145 | 65 | 1,216 | `ee1db7bb36aab369d6178a1ea099b3c33e678f32080f2ae6d2c30d7646e427ec` |
| 519 to 563 | `design-research/01-foundations/05-constrained-common-substrate.md` | 145 to 189 | 45 | 981 | `311f09c3bf6d6e5f642279fb1b30cebea35fa9540e8971f3f1d1446327fd5897` |
| 564 to 606 | `design-research/03-language-and-compiler/03-declarative-programming-model.md` | 168 to 210 | 43 | 970 | `bddb0172285fe4365c8f27a3ba846fda6a9e6c76ccf9631f54890034e887106f` |
| 607 to 690 | `design-research/00-overview/02-research-direction.md` | 154 to 237 | 84 | 3,117 | `6924a315924b7d76af6c2555b80e02f6095318b95f74d45b53dab0a7bfe8426d` |

The insertions shifted or divided the earlier passages recorded below without changing their bytes. The original declarative core's first passage is now divided around the 43-line shared-program import. The earlier argumentation and W3C PROV passage is now divided around the new 28-line argumentation passage.

| Original source and lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| `dsl-approach/languages.md:536 to 596` | `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 605 to 665 | 61 | 2,316 | `94a3dddf031bf526122a2e7f0606ffccf0a1348a3db17896c8e1dae6ba6b8725` |
| `dsl-approach/languages.md:737 to 759` | `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 666 to 688 | 23 | 1,232 | `e647b47f0b572c8dfa251fb0d7d4742f8afc6c228b82783835a14508b4a2f70e` |
| `dsl-approach/declarative-approach.md:1 to 167` | `design-research/03-language-and-compiler/03-declarative-programming-model.md` | 1 to 167 | 167 | 3,825 | `4819e5576118485017924365ae3a3e9f62f8581d03921f250d1837dc62f18014` |
| `dsl-approach/declarative-approach.md:168 to 277` | `design-research/03-language-and-compiler/03-declarative-programming-model.md` | 211 to 320 | 110 | 1,954 | `620822ec27a94a5c381cb321b310bd0e797c33f926d36dca816a59137d8cdd9f` |
| `dsl-approach/declarative-approach.md:320 to 378` | `design-research/03-language-and-compiler/03-declarative-programming-model.md` | 321 to 379 | 59 | 1,280 | `f29318555f8092214c9b60d75b43d013f3dfee6dfac99dba4e4322f56c4cbb4a` |
| `investigation-lang-alg.md:835 to 876` | `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 58 to 99 | 42 | 1,064 | `42e751709e1a05cd32e158112342ccf76fc558794d4fc0902464e8e9451af010` |
| `investigation-lang-alg.md:877 to 917` | `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 128 to 168 | 41 | 825 | `3e38143769e78ea345438bec7906c6e665a9916b769550673d75a9904acd177a` |
| `investigation-lang-alg-llm-layer.md:444 to 496` | `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 169 to 221 | 53 | 731 | `a1e564dc7e3446fb1cae9262058c280867ada34e1f8e0ac283d340c8f8322db6` |

Removing only the newly inserted passages from each destination reproduces its complete previous contents. The checksums below were verified against the captured state before the split. The participant-neutral note's previous contents remain an unchanged prefix at lines 1 to 187.

| Existing destination | Previous logical lines | Preserved bytes | Previous SHA-256 |
|---|---|---|---|
| `design-research/00-overview/02-research-direction.md` | 219 | 13,605 | `eb9e2ce0736224dc92100a94446f9f79310685701b630fbcccd4af3f5f850dcf` |
| `design-research/01-foundations/04-participant-neutral-system-model.md` | 187 | 4,525 | `1e9181a6999c5f275b848676772a54b113e6503aaf94946b4a5553990145105f` |
| `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 648 | 20,930 | `555e2396b1109bdd4488251848cd466eeaa2a1fde5d141aa1cee2b7d3b08e265` |
| `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 193 | 4,194 | `59fefc199581aa51fd698da32543597a1a809a67a083f88b6597f495d7a5ecc4` |
| `design-research/03-language-and-compiler/03-declarative-programming-model.md` | 336 | 7,059 | `41fc42117df4c9701b25c938476becd146113429e06845cf4d920829764d92ea` |

The complete original dialogues listed below were reconstructed from their current destinations and compared directly with Git HEAD. Every reconstruction matched exactly, and every original line was represented once.

| Original dialogue | Logical lines | Bytes | SHA-256 |
|---|---|---|---|
| `architecture-generalization.md` | 926 | 20,143 | `80046e60ad993e2b27b1b1b834242ea59085900ea735b3ddea417ec42ad2b2a0` |
| `research-direction.md` | 690 | 25,260 | `376a1bc4b3b1788eedbd15815bb8176e5ed23bfe0421c5356b2993c3ea54b66c` |
| `dsl-approach/design-model.md` | 482 | 11,425 | `90a866bd1109a3ac565a40b9ce38cd655ccb7ef369a52f7cab09660fc862350d` |
| `semantic-kernel.md` | 618 | 11,441 | `51844f36adc939b917ddec8cd1e66e06fcb141dea520032fe652ec9d0eeb9769` |
| `dsl-approach/languages.md` | 759 | 22,903 | `7452669c8c579e6d0d56eea276cd6197e4d4d3635aad7dc50b0c3484d2a91fd2` |
| `dsl-approach/declarative-approach.md` | 482 | 19,274 | `b6d7c959ccffc4a09ceb4ec7c4d14f971093e34f0556a3bfbeee901ac78cadb2` |
| `investigation-lang-alg.md` | 990 | 25,461 | `b7f56872d4c2c814541c5fdcba69a6482cee108381ffed9a1e05f5698801bdee` |
| `investigation-lang-alg-llm-layer.md` | 700 | 11,811 | `2b5b352b5b805c76c49fdc38b07201cf02d6a7bf823165a5f3cba248142f7f6c` |
| `dsl-approach/dsl-for-rag.md` | 858 | 14,726 | `a71594404daf21b5b412db7bfde65750cf941716df0ba44a41e5bebea4b1d2df` |

All affected notes have closed code blocks. Full-file whitespace checks report preserved separator blank lines at runtime-core line 623, participant-neutral-note line 231, and provenance-note line 221. The source blank lines were not trimmed. No files were staged or committed.

Earlier stage tables describe historical states. The tables above record the current locations for the passages moved or shifted during the runtime split. The remaining earlier passages keep their previous locations and bytes.

## Seventeenth-stage redistribution: database-centered-runtime dialogue


The existing database-centered-runtime note contained 713 logical lines before this split. These consisted of the original 681-line `dsl-approach/db-approach.md` dialogue and a 32-line passage imported earlier from `research-direction.md`. All 713 lines are accounted for below.

No new notes were created. The database core keeps the DBOS and RUBICON discussion, Postgres control and domain state, durable state, profiling before custom storage, and what to build or reuse. Resource optimization and LLM physical operators moved into resource-aware investigation planning. Investigation algebra and logical value semantics moved into investigation language and algebra. Agent planning above the compiler moved into program authoring and typed planning.

All source moves used `_scripts/move_text.py` without changing dialogue text. The inclusive source ranges were moved in descending order: 570 to 625, 508 to 569, 367 to 507, and 335 to 366. The 56-line authoring passage was inserted before `## 9. Give the agent meta-operations too`. The 62-line LLM operator passage was inserted before the resource-effects paragraph. The 141-line algebra passage was appended. The 32-line research import was then inserted before the LLM operator passage.

The four resulting notes are recorded below. Their combined content remains 43,481 bytes. The database core and resource-planning note still have no final newline. The algebra and authoring notes still end with a newline.

| Current note | Logical lines | Bytes | SHA-256 |
|---|---|---|---|
| `design-research/05-runtime-and-execution/02-database-centered-runtime.md` | 422 | 15,682 | `682cc4e338e8013734bcc5a806b8cdc0aab2259b87f42e481f6fa3091191046b` |
| `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 439 | 7,822 | `65a0af389866e44cb848b6c42af185a42af209ccee270210ae2f857bf5d54a44` |
| `design-research/04-investigation-and-epistemics/01-investigation-language-and-algebra.md` | 596 | 11,068 | `6c9daf7daf68766446ca6e615742581e950b98dfc5d2445abea6326ebfc8b2cf` |
| `design-research/03-language-and-compiler/10-program-authoring-and-typed-planning.md` | 515 | 8,909 | `0b7129765149d252e1f429a6b944bb5f8e8ea70868e8a9f6e8e3cb7de1a9f87e` |

The following table uses line numbers from the complete 713-line database note immediately before this split. Concatenating its six destination ranges in source order reproduces all 21,059 bytes, with checksum `9843321fc98014d00ba79a82c29bfc84dea068e71b5a6b1d1318707a24427808`. Each source line appears once.

| Original lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 334 | `design-research/05-runtime-and-execution/02-database-centered-runtime.md` | 1 to 334 | 334 | 13,062 | `49332647605b308554f9ef2a143028747b5318822a97d13e7ca53256b82ee800` |
| 335 to 366 | `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 143 to 174 | 32 | 761 | `74a516c47a4ab3ebd0a817a2bb7c9242a0272beb808aa22ea91b51e9ec09cf8f` |
| 367 to 507 | `design-research/04-investigation-and-epistemics/01-investigation-language-and-algebra.md` | 456 to 596 | 141 | 2,272 | `d0a967bf041768c6f3b82355e5989b39fcbc0259801517f62d2aeb5b1c07a296` |
| 508 to 569 | `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 175 to 236 | 62 | 959 | `f13ba5dd1029f324ec72b003f3bcf0bb20766b8798a6a0490e75de88b6c6e2e2` |
| 570 to 625 | `design-research/03-language-and-compiler/10-program-authoring-and-typed-planning.md` | 396 to 451 | 56 | 1,385 | `428a2edb9efe4270e6f492f3ed31ef48b3850b6b77923f4f91406d6829843edc` |
| 626 to 713 | `design-research/05-runtime-and-execution/02-database-centered-runtime.md` | 335 to 422 | 88 | 2,620 | `58637e1618b6adb0305ee07c358741db7dc54c97015d66f7980575ee6fc42ba6` |

The table below records the complete original `dsl-approach/db-approach.md` dialogue, without the later research import. Concatenating these five ranges reproduces its 681 logical lines and 20,298 bytes exactly.

| Original lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 334 | `design-research/05-runtime-and-execution/02-database-centered-runtime.md` | 1 to 334 | 334 | 13,062 | `49332647605b308554f9ef2a143028747b5318822a97d13e7ca53256b82ee800` |
| 335 to 475 | `design-research/04-investigation-and-epistemics/01-investigation-language-and-algebra.md` | 456 to 596 | 141 | 2,272 | `d0a967bf041768c6f3b82355e5989b39fcbc0259801517f62d2aeb5b1c07a296` |
| 476 to 537 | `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 175 to 236 | 62 | 959 | `f13ba5dd1029f324ec72b003f3bcf0bb20766b8798a6a0490e75de88b6c6e2e2` |
| 538 to 593 | `design-research/03-language-and-compiler/10-program-authoring-and-typed-planning.md` | 396 to 451 | 56 | 1,385 | `428a2edb9efe4270e6f492f3ed31ef48b3850b6b77923f4f91406d6829843edc` |
| 594 to 681 | `design-research/05-runtime-and-execution/02-database-centered-runtime.md` | 335 to 422 | 88 | 2,620 | `58637e1618b6adb0305ee07c358741db7dc54c97015d66f7980575ee6fc42ba6` |

The earlier research import moved to resource-planning lines 143 to 174 without changing its 761 bytes. The earlier runtime meta-operations and data/orchestration API passage shifted to authoring lines 452 to 515 without changing its bytes. Their original-source mappings are recorded here.

| Original source and lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| `research-direction.md:240 to 271` | `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 143 to 174 | 32 | 761 | `74a516c47a4ab3ebd0a817a2bb7c9242a0272beb808aa22ea91b51e9ec09cf8f` |
| `investigation-lang-alg-llm-layer.md:497 to 560` | `design-research/03-language-and-compiler/10-program-authoring-and-typed-planning.md` | 452 to 515 | 64 | 1,093 | `47fbe612b6da7f191713f38fd978c6fcf48b589652b3ab40d3b60a43fdc21b59` |

The insertions divided the earlier resource-planning passage from `dsl-approach/dsl-for-rag.md` into two ranges. The table below records the current locations for its complete original 858-line dialogue. Concatenating all five ranges reproduces 14,726 bytes, with checksum `a71594404daf21b5b412db7bfde65750cf941716df0ba44a41e5bebea4b1d2df`.

| Original lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 356 | `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 1 to 356 | 356 | 6,223 | `94a2944483cf207b22a7c5a053719cb272e274323aed7d853b7501f5745e890d` |
| 357 to 403 | `design-research/03-language-and-compiler/10-program-authoring-and-typed-planning.md` | 349 to 395 | 47 | 664 | `268b7d3723fbcd402d24def6da367422897deb8322f8184f80e2d2a4e953530d` |
| 404 to 513 | `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 357 to 466 | 110 | 1,737 | `21ca6ba324d68243f2fc461bfe2a4fd8bd4662e516ed9d2cc5f8789324500592` |
| 514 to 655 | `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 1 to 142 | 142 | 2,340 | `58a97f583f712c482807751e435cd007d0e655ef61b0e4633d7debb36a7e0956` |
| 656 to 858 | `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 237 to 439 | 203 | 3,762 | `02b09ae6a7326f0a332cb76f600238515cc4fe5cdb569e9560c240abfff28ea1` |

Removing only the newly inserted database-note passages from each existing destination reproduces its complete contents from before this split. The checksums below matched the captured pre-split state. The algebra note's previous contents remain an unchanged prefix at lines 1 to 455.

| Existing destination | Previous logical lines | Preserved bytes | Previous SHA-256 |
|---|---|---|---|
| `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 345 | 6,102 | `2eac8d3e2b77e29777a3f7edb6a1ae4e006129228d86c9f60c5df263b9ed6c0f` |
| `design-research/04-investigation-and-epistemics/01-investigation-language-and-algebra.md` | 455 | 8,796 | `7cbd34411ef711e41ef7507f605efe7c6a0a060c85f4d0d89a2b66ab5d0c4486` |
| `design-research/03-language-and-compiler/10-program-authoring-and-typed-planning.md` | 459 | 7,524 | `d191845dd483a966c5496af6fb9290ae043094fb26e83246f8612d01046f6bc4` |

The current HEAD, `[repository fingerprint omitted]`, contains redirects at the old source paths. The original dialogues were therefore compared with historical revision `[repository fingerprint omitted]`, which contains the complete source texts. Each of the six reconstructions below matched that revision byte for byte, and every original line was represented once.

| Original dialogue | Logical lines | Bytes | SHA-256 |
|---|---|---|---|
| `dsl-approach/db-approach.md` | 681 | 20,298 | `8b511dde793b8cb4498dcba003b118c659007c0eeed0035355071be853f8b97a` |
| `research-direction.md` | 690 | 25,260 | `376a1bc4b3b1788eedbd15815bb8176e5ed23bfe0421c5356b2993c3ea54b66c` |
| `investigation-lang-alg.md` | 990 | 25,461 | `b7f56872d4c2c814541c5fdcba69a6482cee108381ffed9a1e05f5698801bdee` |
| `semantic-kernel.md` | 618 | 11,441 | `51844f36adc939b917ddec8cd1e66e06fcb141dea520032fe652ec9d0eeb9769` |
| `investigation-lang-alg-llm-layer.md` | 700 | 11,811 | `2b5b352b5b805c76c49fdc38b07201cf02d6a7bf823165a5f3cba248142f7f6c` |
| `dsl-approach/dsl-for-rag.md` | 858 | 14,726 | `a71594404daf21b5b412db7bfde65750cf941716df0ba44a41e5bebea4b1d2df` |

All four affected notes have closed code blocks. The tracked diff passes `git diff --check`. Full-file whitespace checks report preserved separator blank lines at algebra-note line 596 and authoring-note line 515. Those source blank lines were not trimmed. No files were staged or committed.

Earlier stage tables describe historical states. The tables above record the current locations for passages moved or shifted during the database split. The remaining earlier passages keep their previous locations and bytes.

## Eighteenth-stage redistribution: programmable-probabilistic-agent-computation report


The 727-line `dsl-approach/deep-research-report-formatted.md` report was split at its existing section boundaries. Four sections were moved unchanged with `_scripts/move_text.py`. The inclusive source ranges were moved in descending order: 396 to 458, 326 to 395, 273 to 325, and 107 to 272.

The formal-foundations section moved into the existing formal-models note before `## A DSL could hide almost all of that machinery`. The durable-systems and stochastic-replay section was appended to the existing generalized-runtime note. The evaluation and governance sections became two new research-report notes.

The main report retains original lines 1 to 106 and 459 to 727. The retained source text contains 375 logical lines and 40,944 bytes, with checksum `9db9608e3cd1ba4df7297a723293e5035b0c8f429f9f210438d77a844e4c9c5c`. The report keeps its framing, comparisons, research agenda, reading list, all 52 bibliography entries, and original index.

Separate navigation text was added without rewriting the source passages. The main report received four links with anchors for its moved sections. Each destination received local reference anchors that link to the shared bibliography. The additions are marked with comments identifying them as reassembly navigation. Temporary navigation files were created and moved with the same script, then removed.

The source payload across the report and both existing destinations remains 87,298 bytes. The navigation adds 86 logical lines and 7,648 bytes. The five resulting notes contain 94,946 bytes in total. The formal-models note still has no final newline, and the other four notes still end with a newline.

| Current note | Logical lines | Bytes | SHA-256 |
|---|---|---|---|
| `design-research/06-research-reports/01-programmable-probabilistic-agent-computation.md` | 386 | 42,032 | `f5ed118bc4e610a134042ac5c376e64dc0ff2eb9c40800b80f9a6c8dc8e6e5be` |
| `design-research/05-runtime-and-execution/04-formal-models-for-agent-execution.md` | 545 | 18,131 | `198efdcb9b2c335788a2e06dd66d9ae055fc999cd2b1399d40e7e2f58f8529be` |
| `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 695 | 19,554 | `f70c6f04df6ab7181a77321f75a40f655a37a50daddca3e46eb503756ec16f1b` |
| `design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` | 91 | 8,550 | `a4c89efebff1a44263c49f6b887e82d0b88b78234949789ca394f92b942004ef` |
| `design-research/06-research-reports/06-governance-patents-and-specification-trust.md` | 79 | 6,679 | `e92c86ea5912ab7db3800af1b668fe00ffd24dfe2feddc812eec81ef3854ff9c` |

The table below accounts for all 727 original report lines once. Concatenating its seven source ranges in order reproduces the original 65,976 bytes, with checksum `984fe69cd243e6be69a379200dcb7ce7f03ceb6e8502f9ebae942469438311d8`. The last retained range is separated from the earlier report text by the new navigation section.

| Original lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 106 | `design-research/06-research-reports/01-programmable-probabilistic-agent-computation.md` | 1 to 106 | 106 | 19,441 | `1b1831d62277ff105c142e12f5c1d58fb3ceec5da834294b352672dfdc62e055` |
| 107 to 272 | `design-research/05-runtime-and-execution/04-formal-models-for-agent-execution.md` | 303 to 468 | 166 | 7,057 | `d18e3abe907b738cb9f8ca3c977972387ec629bde0b30b688e69ac9be1fce74f` |
| 273 to 325 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 624 to 676 | 53 | 5,715 | `072f8dd98ecc0f6d5c60f7ed6d25543638f741da2d2be19d2f3547fda95ffc3c` |
| 326 to 395 | `design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` | 1 to 70 | 70 | 6,831 | `c97ec28d481884a406651f82cfe3b8aca4d4f4061d84ff82bc468caa1322860c` |
| 396 to 458 | `design-research/06-research-reports/06-governance-patents-and-specification-trust.md` | 1 to 63 | 63 | 5,429 | `dba5886b99629382df15bbe4377be9e96a890ad87066939ff52c1198e309f966` |
| 459 to 659 | `design-research/06-research-reports/01-programmable-probabilistic-agent-computation.md` | 107 to 307 | 201 | 11,019 | `e08d0ceb72f0d610cf062ebc1104a1d6d214978b5353fe577fba231be07bf93f` |
| 660 to 727 | `design-research/06-research-reports/01-programmable-probabilistic-agent-computation.md` | 319 to 386 | 68 | 10,484 | `53ccb73b5562b92a6817d4817391acfb9857e3a45e398873636ceb403ec18e40` |

The source bibliography remains at main-report lines 319 to 373, and the unchanged original index remains at lines 374 to 386. The added navigation is recorded separately below and is excluded from all source reconstructions.

| Added navigation | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| `report-navigation` | `design-research/06-research-reports/01-programmable-probabilistic-agent-computation.md` | 308 to 318 | 11 | 1,088 | `6906e125fbcf26e441523204373d91f46aa4738ae58d28669b27042cfa43d3cd` |
| `formal-citations` | `design-research/05-runtime-and-execution/04-formal-models-for-agent-execution.md` | 469 to 487 | 19 | 1,731 | `87a609a1d3f732fab71a71a4bdda33fa6274ff8503a8129d35076c19a89a9425` |
| `runtime-citations` | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 677 to 695 | 19 | 1,860 | `d8eb1943e85d688927a467a5b950a24f5d733cfa2f61bb8e7c298758745a120f` |
| `evaluation-citations` | `design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` | 71 to 91 | 21 | 1,719 | `dba141a3ccd63a09f06e877c0e98ea579c157c1ed3d3404c3e8de0c85edcc3a5` |
| `governance-citations` | `design-research/06-research-reports/06-governance-patents-and-specification-trust.md` | 64 to 79 | 16 | 1,250 | `b72c3825661bf89b045151fe8b34cadea6becd38e4c7a86fa53e6bf6fce42d7d` |

The formal-models insertion shifted its earlier 58-line DSL passage from lines 303 to 360 to lines 488 to 545 without changing its bytes. The table below records the current mapping for the complete original `architecture-generalization.md` dialogue. The other earlier runtime imports keep their previous locations within runtime-note lines 1 to 623.

| Original lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 355 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 1 to 355 | 355 | 5,244 | `6607f7021ee2c64e35f326311b05dd84c3d2a1c867ef4166c25813d4e3d18b7c` |
| 356 to 373 | `design-research/00-overview/02-research-direction.md` | 98 to 115 | 18 | 653 | `80476ee0493f5a96196c7c7ae72a005487e5f043a1757b23ee757634c69b7f9f` |
| 374 to 379 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 356 to 361 | 6 | 332 | `7d6bd208abbcced1cd23484fa6013540c61f780ac3e852d9feee56f2787dfe2b` |
| 380 to 629 | `design-research/05-runtime-and-execution/04-formal-models-for-agent-execution.md` | 1 to 250 | 250 | 6,132 | `f0238dab1c49c710cd4f37763b0184d85a279305d340de58966cc4271deb8ba1` |
| 630 to 673 | `design-research/01-foundations/04-participant-neutral-system-model.md` | 188 to 231 | 44 | 1,330 | `ac640c9bca39d40cb2147d266a7ae6d2d9cdeff1b546143086ffbb92954014e7` |
| 674 to 713 | `design-research/03-language-and-compiler/06-language-and-formalism-choices.md` | 565 to 604 | 40 | 683 | `34b83631d57c6ee5108f55fc9ae82c71dd78e5fd6f1820e2b957086fe1872ad6` |
| 714 to 741 | `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 100 to 127 | 28 | 498 | `fd0948d84e5c54023114e887b226defd6abcc855bc66affc8226d8223ccf758d` |
| 742 to 793 | `design-research/05-runtime-and-execution/04-formal-models-for-agent-execution.md` | 251 to 302 | 52 | 1,677 | `37cc559878a614c18ab8e94a468aa6f93786dd96fea2c63d1abfc53e057e0654` |
| 794 to 868 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 549 to 623 | 75 | 2,060 | `a56348fdec89897b1ea60f7d421fd7b204771b324ae72eb1ddc628ef5c6185e7` |
| 869 to 926 | `design-research/05-runtime-and-execution/04-formal-models-for-agent-execution.md` | 488 to 545 | 58 | 1,534 | `b4314cb317f7b4e7dd4e22586ff528c6fa94718253e2e9c0b926c7ba820024f9` |

Removing the imported report sections and the separately recorded navigation from both existing destinations reproduces their complete previous contents. The checksums below matched the captured state before the split.

| Existing destination | Previous logical lines | Preserved bytes | Previous SHA-256 |
|---|---|---|---|
| `design-research/05-runtime-and-execution/04-formal-models-for-agent-execution.md` | 360 | 9,343 | `d65e5f25178fb3bc3244fadc6f76cc28f5e36a64518c648765f1e44329c2ba4c` |
| `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 623 | 11,979 | `940d27033d07df3696b7cee71ef536612fa50152c5201877d71ce32ca0c6a8ef` |

The complete original texts below were reconstructed from their current destinations and compared with historical revision `[repository fingerprint omitted]`. The current HEAD, `[repository fingerprint omitted]`, contains redirects at the old source paths. Every reconstruction matched byte for byte, and every original line was represented once.

| Original source | Logical lines | Bytes | SHA-256 |
|---|---|---|---|
| `architecture-generalization.md` | 926 | 20,143 | `80046e60ad993e2b27b1b1b834242ea59085900ea735b3ddea417ec42ad2b2a0` |
| `research-direction.md` | 690 | 25,260 | `376a1bc4b3b1788eedbd15815bb8176e5ed23bfe0421c5356b2993c3ea54b66c` |
| `dsl-approach/design-model.md` | 482 | 11,425 | `90a866bd1109a3ac565a40b9ce38cd655ccb7ef369a52f7cab09660fc862350d` |
| `semantic-kernel.md` | 618 | 11,441 | `51844f36adc939b917ddec8cd1e66e06fcb141dea520032fe652ec9d0eeb9769` |
| `dsl-approach/deep-research-report-formatted.md` | 727 | 65,976 | `984fe69cd243e6be69a379200dcb7ce7f03ceb6e8502f9ebae942469438311d8` |

All five affected notes have closed code blocks. All 268 internal Markdown links checked across the notes and collection index resolve, including 146 local numbered citations and 50 links to the shared bibliography. All 52 bibliography entries and all 11 original report-index links remain available. The collection index now contains 53 valid links.

The tracked diff and all five full-file whitespace checks pass. The source text, final newline states, move script, redirect files, and unrelated notes were preserved. Earlier working-tree changes were left untouched. No files were staged or committed.

Earlier stage tables describe historical states. The tables above record the current locations for passages moved or shifted during the report split. The remaining earlier passages keep their previous locations and bytes.

## Nineteenth-stage redistribution: typed-durable-inspectable-runtimes report


The 518-line `dsl-approach/typed-durable-inspectable-runtimes-report.md` report was redistributed into six existing notes. No new notes were created. All eight source moves used `_scripts/move_text.py` without rewriting the selected passages.

The inclusive source ranges were moved in descending order: 334 to 368, 306 to 333, 238 to 305, 181 to 229, 165 to 180, 128 to 164, 114 to 127, and 100 to 113. The earlier passages were placed before headings introduced by the corresponding later passages where needed.

The main report retains original lines 1 to 99, 230 to 237, and 369 to 518. The retained source text contains 257 logical lines and 48,168 bytes, with checksum `3a0750c46692058da6f3151e014b6ccf9add86e06722f6b4f71fc85358e5b2a5`. The comparison table and its legend remain together. All 42 bibliography entries, the original index, and the novelty argument remain in the main report.

The verification precedents and certificate model moved into the epistemic-contracts note. Provenance precedents moved into the provenance note. The durable-backend discussion and certificate-based architecture moved into the investigation-runtime note. Evidence-system comparisons moved into the related-work note. Benchmarks and evaluation moved into the existing evaluation note. The compiler and physical-planning example moved into resource-aware planning.

Separate navigation was added at the moved sections and in the main report. Eight section links preserve the original index targets, and six destination backlinks point to the main report and shared bibliography. The additions are marked as reassembly navigation. Temporary navigation files were created and moved with the same script, then removed.

The complete pre-split contents of the seven affected notes total 117,230 bytes, including earlier navigation. Every byte of that content remains. The new navigation adds 42 logical lines and 3,811 bytes, for a total of 121,041 bytes. The three notes that had no final newline still have none, and the other four still end with a newline.

| Current note | Logical lines | Bytes | SHA-256 |
|---|---|---|---|
| `design-research/06-research-reports/02-typed-durable-inspectable-runtimes.md` | 275 | 49,893 | `f7aa78b50821d94b4a37c219bbd1924bf0b9919adaf5ab70799cd243f8fbe3c7` |
| `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 653 | 14,561 | `045c07cc71b5e4750b5cb58bd29c778c32ae8757c9a59d5d8626c97934bdb3a1` |
| `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 239 | 7,565 | `990b8aa77ba0d065c580556bb4200968a0456e8d17c03fd7468ab0524f53f74b` |
| `design-research/04-investigation-and-epistemics/02-llm-operated-investigation-runtime.md` | 389 | 9,130 | `710015a94d4ac3bc8fb9575d4a99ba656eb87b15a818b767e57c624706648e9c` |
| `design-research/06-research-reports/04-investigation-systems-and-related-work.md` | 315 | 14,247 | `a216a7223e0411a0c9a67f3398ff6c0a2eee1c42a23bc0c89b0978609ddd8dc8` |
| `design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` | 179 | 16,304 | `65d3c4129354e62697b3c67a952f62591940337dbfb67b916003e4fe4b1693d9` |
| `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 471 | 9,341 | `bd8f39d4a73366723b9e185bc7cb2a0c821d5687b5eac1768cf6e9312c7684c2` |

The table below accounts for all 518 original report lines once. Concatenating its eleven destination ranges in source order reproduces all 69,287 bytes, with checksum `e1eb14184dc8a7874f8bfc0f54bf6393eaf5b2b3eea2df0c2f9f8a4934ccfaa7`. Navigation text is excluded from the reconstruction.

| Original lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 99 | `design-research/06-research-reports/02-typed-durable-inspectable-runtimes.md` | 1 to 99 | 99 | 38,172 | `160b01cb63dc7493e7e61f4d4f3ad7243d8a26a5d1c89c77d9df78b1244aa46e` |
| 100 to 113 | `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 572 to 585 | 14 | 2,679 | `58a5694532e2023980ea1ded5742d03775f35e2d617729f96f2dd479cee27b7f` |
| 114 to 127 | `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 226 to 239 | 14 | 2,510 | `363b55f41165770b032b7b8b888b6329af68f83a9127edb18c4d6f1f583fedca` |
| 128 to 164 | `design-research/04-investigation-and-epistemics/02-llm-operated-investigation-runtime.md` | 53 to 89 | 37 | 2,105 | `9512ba47d970c1795f2186aac22d586b7df80a3eacc5dc52b9610bf67f3083af` |
| 165 to 180 | `design-research/06-research-reports/04-investigation-systems-and-related-work.md` | 227 to 242 | 16 | 3,051 | `91dc7da4dd0bd1720b54b00c61e4a0ac2c214c090746e1b2a517f51272bec3d4` |
| 181 to 229 | `design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` | 5 to 53 | 49 | 5,711 | `457368a7200c14178cf29f2c03b068b66d9163f32e009c914556ffdc03adbcee` |
| 230 to 237 | `design-research/06-research-reports/02-typed-durable-inspectable-runtimes.md` | 110 to 117 | 8 | 717 | `d1d8d459fc17519807d883b39f6b4fcadacf2c729af7ff88d6d8f289b596b529` |
| 238 to 305 | `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 586 to 653 | 68 | 2,181 | `4ca60043557d2100e509e3c04a04d856ff698ab09f4fa6bbb9e3febfb926f193` |
| 306 to 333 | `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 147 to 174 | 28 | 1,156 | `a94661761c7cc997fad6e8bc59fc7458c42ca17fb82629de8a07cb0b8a1223eb` |
| 334 to 368 | `design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` | 54 to 88 | 35 | 1,726 | `8f34f1d797cb6b3c40e5833009a6efec5276735c9450c4eee2b8486ca11c0849` |
| 369 to 518 | `design-research/06-research-reports/02-typed-durable-inspectable-runtimes.md` | 126 to 275 | 150 | 9,279 | `86ecb6bf0fe7089dfbd821d7fea6a5b740d394397d3d24e5833f6d5f5403186a` |

The bibliography remains at main-report lines 171 to 215, and the unchanged original index remains at lines 216 to 275. The source's warning that the example evaluation numbers are illustrative, not observed results, remains beside the example at evaluation-note line 87.

| Added navigation | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| `report-annotations` | `design-research/06-research-reports/02-typed-durable-inspectable-runtimes.md` | 100 to 109 | 10 | 1,128 | `8dd58f0cd8390109a6eb0b715665b9a7a2389e79941f4adb7c2377364fa1176c` |
| `report-paper-design` | `design-research/06-research-reports/02-typed-durable-inspectable-runtimes.md` | 118 to 125 | 8 | 597 | `31ef4c78b4ecdb074bcec0c640a407d468487be3bb4a180fb7c70d00d039decb` |
| `contracts-report-link` | `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 568 to 571 | 4 | 363 | `76824b85b51301e913d133a90cb9d8e17ea365793f3417679ec5a927a37c4c22` |
| `provenance-report-link` | `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 222 to 225 | 4 | 363 | `76824b85b51301e913d133a90cb9d8e17ea365793f3417679ec5a927a37c4c22` |
| `runtime-report-link` | `design-research/04-investigation-and-epistemics/02-llm-operated-investigation-runtime.md` | 49 to 52 | 4 | 363 | `76824b85b51301e913d133a90cb9d8e17ea365793f3417679ec5a927a37c4c22` |
| `systems-report-link` | `design-research/06-research-reports/04-investigation-systems-and-related-work.md` | 223 to 226 | 4 | 317 | `bb88725c0d3fa1e48101255c2cea10213f1e20f485270b0a7de75e44472bfeb5` |
| `evaluation-report-link` | `design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` | 1 to 4 | 4 | 317 | `bb88725c0d3fa1e48101255c2cea10213f1e20f485270b0a7de75e44472bfeb5` |
| `planning-report-link` | `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 143 to 146 | 4 | 363 | `76824b85b51301e913d133a90cb9d8e17ea365793f3417679ec5a927a37c4c22` |

The insertions shifted the earlier passages below without changing their bytes. Earlier source passages not listed here retain their previous locations. The updated ranges allow the earlier investigation, resource-planning, and evaluation splits to be reconstructed.

| Original source and lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| `investigation-lang-alg.md:786 to 834` | `design-research/04-investigation-and-epistemics/02-llm-operated-investigation-runtime.md` | 90 to 138 | 49 | 1,050 | `15c5edfde8be79727cdf876259783e9c96a4b18a5781b6015837c6cc78c5f9bd` |
| `investigation-lang-alg.md:918 to 990` | `design-research/06-research-reports/04-investigation-systems-and-related-work.md` | 243 to 315 | 73 | 4,510 | `c9514f7f556f4b6ced1c4c43bb2c7831a67dcc87326280c987f321823dfb178e` |
| `investigation-lang-alg-llm-layer.md:49 to 257` | `design-research/04-investigation-and-epistemics/02-llm-operated-investigation-runtime.md` | 139 to 347 | 209 | 2,771 | `bb8660d7c8c30a2eabf595e42018738efa081fc374be448b39d720452c867390` |
| `investigation-lang-alg-llm-layer.md:659 to 700` | `design-research/04-investigation-and-epistemics/02-llm-operated-investigation-runtime.md` | 348 to 389 | 42 | 1,736 | `f127ca3894352f0d483bfa0c71749489fd47e1288f790da2e78eb77450c64541` |
| `research-direction.md:240 to 271` | `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 175 to 206 | 32 | 761 | `74a516c47a4ab3ebd0a817a2bb7c9242a0272beb808aa22ea91b51e9ec09cf8f` |
| `dsl-approach/db-approach.md:476 to 537` | `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 207 to 268 | 62 | 959 | `f13ba5dd1029f324ec72b003f3bcf0bb20766b8798a6a0490e75de88b6c6e2e2` |
| `dsl-approach/dsl-for-rag.md:656 to 858` | `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 269 to 471 | 203 | 3,762 | `02b09ae6a7326f0a332cb76f600238515cc4fe5cdb569e9560c240abfff28ea1` |
| `dsl-approach/deep-research-report-formatted.md:326 to 395` | `design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` | 89 to 158 | 70 | 6,831 | `c97ec28d481884a406651f82cfe3b8aca4d4f4061d84ff82bc468caa1322860c` |

The earlier evaluation-note citation links moved together and remain unchanged. The other navigation blocks added during the previous report split retain their previous locations and checksums.

| Earlier navigation | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| `evaluation-citations` | `design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` | 159 to 179 | 21 | 1,719 | `dba141a3ccd63a09f06e877c0e98ea579c157c1ed3d3404c3e8de0c85edcc3a5` |

Removing only the newly imported report passages and newly added navigation from each destination reproduces its complete contents before the split. The checksums below matched the captured pre-split state, including all earlier navigation.

| Existing destination | Previous logical lines | Preserved bytes | Previous SHA-256 |
|---|---|---|---|
| `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 567 | 9,338 | `aa06a1d9eea0883b869dbc6f55442e51b547553f76084d3f1ba1de2e96f2ce3a` |
| `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 221 | 4,692 | `aaf4002a917820c5fb91585773148666df6d968a78d7494725dc6ffa4a76c70d` |
| `design-research/04-investigation-and-epistemics/02-llm-operated-investigation-runtime.md` | 348 | 6,662 | `1acfbf78bb80e94997ac5d3b091c5b95cce7473258b9971169025b0a7f316511` |
| `design-research/06-research-reports/04-investigation-systems-and-related-work.md` | 295 | 10,879 | `69cb4f98fa59c654161faa226b2361dda10e6ba161699e8537001848cc1f31d1` |
| `design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` | 91 | 8,550 | `a4c89efebff1a44263c49f6b887e82d0b88b78234949789ca394f92b942004ef` |
| `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 439 | 7,822 | `65a0af389866e44cb848b6c42af185a42af209ccee270210ae2f857bf5d54a44` |

The complete original texts below were reconstructed from their current destinations and compared with historical revision `[repository fingerprint omitted]`. The current HEAD, `[repository fingerprint omitted]`, contains redirects at the old source paths. Every reconstruction matched byte for byte, and every original line was represented once.

| Original source | Logical lines | Bytes | SHA-256 |
|---|---|---|---|
| `architecture-generalization.md` | 926 | 20,143 | `80046e60ad993e2b27b1b1b834242ea59085900ea735b3ddea417ec42ad2b2a0` |
| `research-direction.md` | 690 | 25,260 | `376a1bc4b3b1788eedbd15815bb8176e5ed23bfe0421c5356b2993c3ea54b66c` |
| `investigation-lang-alg.md` | 990 | 25,461 | `b7f56872d4c2c814541c5fdcba69a6482cee108381ffed9a1e05f5698801bdee` |
| `investigation-lang-alg-llm-layer.md` | 700 | 11,811 | `2b5b352b5b805c76c49fdc38b07201cf02d6a7bf823165a5f3cba248142f7f6c` |
| `dsl-approach/dsl-for-rag.md` | 858 | 14,726 | `a71594404daf21b5b412db7bfde65750cf941716df0ba44a41e5bebea4b1d2df` |
| `dsl-approach/db-approach.md` | 681 | 20,298 | `8b511dde793b8cb4498dcba003b118c659007c0eeed0035355071be853f8b97a` |
| `dsl-approach/deep-research-report-formatted.md` | 727 | 65,976 | `984fe69cd243e6be69a379200dcb7ce7f03ceb6e8502f9ebae942469438311d8` |
| `dsl-approach/typed-durable-inspectable-runtimes-report.md` | 518 | 69,287 | `e1eb14184dc8a7874f8bfc0f54bf6393eaf5b2b3eea2df0c2f9f8a4934ccfaa7` |

All seven affected notes have closed code blocks. All 119 internal Markdown links checked outside code blocks resolve. All 15 original report-index links and all 53 collection-index links remain valid.

The tracked unstaged diff passes `git diff --check`. Full-file whitespace checks report preserved separator blank lines at epistemic-contracts-note line 653 and provenance-note line 239. The original blank lines were not trimmed.

The move script, redirect files, unrelated notes, and earlier staged changes were preserved. No staging or commits were performed during this split.

Earlier stage tables describe historical states. The tables above record the current locations for passages moved or shifted during the typed-investigation report split. The remaining earlier passages keep their previous locations and bytes.

## Twentieth-stage redistribution: behavioral-specification dialogue


The 742-line `architecture-dsl-like/behavioural-specification.md` dialogue was split into one new note and five existing notes. The dialogue was outside the original 24-note reassembly inventory. Its complete text contained 24,801 bytes, with checksum `80833b7d13c9cf4a4a5190f24646e3e24d63596102d9a52b52a012efac1e413c`.

All eight source moves used `_scripts/move_text.py` without rewriting the selected passages. The inclusive ranges were moved in descending order: 700 to 742, 656 to 699, 501 to 655, 371 to 500, 340 to 370, 252 to 339, 167 to 251, and 1 to 166. The retained core passages were inserted before their following source headings so their original order was preserved.

The new behavioral-compilation note contains original lines 1 to 166, 501 to 655, and 700 to 742. Its original source text contains 364 logical lines and 13,817 bytes, with checksum `23c3f269087726ce202bd6fe42ed3271e924b170e31f80dfa708ee4885245acc`. The original question, unresolved-reference access note, and closing caveat remain together. The new title and section links are separate navigation.

The other 378 original lines moved into existing notes. The compilation and verification loops moved into the typed-DSL note. The complete verification stack moved into the epistemic-contracts note. The provenance rules moved into the provenance note. The three graphs, immutable repair attempts, and branch gates moved together into the generalized-runtime note. The failure modes moved into the evaluation note.

All five imports were appended after the existing destination text. No earlier source passage or navigation block changed its line location. Removing the imported passages and new navigation reproduces each destination's complete pre-split contents.

| Existing destination | Preserved logical lines | Preserved bytes | Previous SHA-256 |
|---|---|---|---|
| `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | 933 | 23,945 | `7aa962ae87c09a704df399975b0e048d315b7654fe83a92e1a3170aa6c052f18` |
| `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 653 | 14,561 | `045c07cc71b5e4750b5cb58bd29c778c32ae8757c9a59d5d8626c97934bdb3a1` |
| `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 239 | 7,565 | `990b8aa77ba0d065c580556bb4200968a0456e8d17c03fd7468ab0524f53f74b` |
| `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 695 | 19,554 | `f70c6f04df6ab7181a77321f75a40f655a37a50daddca3e46eb503756ec16f1b` |
| `design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` | 179 | 16,304 | `65d3c4129354e62697b3c67a952f62591940337dbfb67b916003e4fe4b1693d9` |

The table below accounts for all 742 original lines once. Concatenating the eight current ranges in source order reproduces the complete original bytes and checksum. Added navigation is excluded.

| Original lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 166 | `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 6 to 171 | 166 | 7,468 | `bdf57b3656477ed7801f85731f8993ffa7e7ce849b2059b64e1c8ddd59849c1b` |
| 167 to 251 | `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | 940 to 1024 | 85 | 2,001 | `dee8b40ba08464f42e3f48021c8acb916a1005dc59b4fd35da90b74ee55b2886` |
| 252 to 339 | `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 660 to 747 | 88 | 2,884 | `25769ffa1762ee7f9fafd4900bbc62289f64eb9962e80527731b5f6dd7c09bc5` |
| 340 to 370 | `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 246 to 276 | 31 | 1,043 | `b59ef64aeede4a5b4c8f1b3a677585ced2149a92ccbb961b06a6842533c25651` |
| 371 to 500 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 702 to 831 | 130 | 3,162 | `db8115dd32e7487c4e7c7678dffb028921e4a2ec0058198530df5d2126e6c514` |
| 501 to 655 | `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 182 to 336 | 155 | 4,218 | `ae2a3701de6e641a2939f18e081c4a890c87288aa120f79f4976cd41929a2b4f` |
| 656 to 699 | `design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` | 186 to 229 | 44 | 1,894 | `9aaa017b30aca7e3e09f1782366a224ba2b5b3a7cd96e9c7e654d85ea832c38e` |
| 700 to 742 | `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 342 to 384 | 43 | 2,131 | `e324d933d50937bb58e395d8f6981bdfd8d21b973ed0df1b8df26d2ae12d5f6c` |

Separate navigation adds 50 logical lines and 3,650 bytes. The complete source and previous destination text total 106,730 bytes, and the six final notes total 110,380 bytes. All six notes retain a final newline. All original blank lines and the source's Markdown hard-break spaces are preserved.

| Added navigation | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| `core-title` | `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 1 to 5 | 5 | 313 | `53cf8bfea493e72d484142d556f3e48088c07f507c4ae848663290d50f0724b0` |
| `core-sections-4-to-9` | `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 172 to 181 | 10 | 1,027 | `130cd37bd462da061f12dbbae6016c3e1f8e55539e946409e1b483009de2129b` |
| `core-section-13` | `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 337 to 341 | 5 | 286 | `b3c3f4919e212b7f2682087c089d657471b7ccea758c05a86af1501f8d759449` |
| `compiler-source-context` | `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | 934 to 939 | 6 | 382 | `7d9d85ec05f54969a44aab553e89966fe50f70ba5341e776935e1e0d52784fba` |
| `contracts-source-context` | `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 654 to 659 | 6 | 410 | `d274bc0665a2b5fec953249b2acae7b07a754220382845ee4160c1bb461130f8` |
| `provenance-source-context` | `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 240 to 245 | 6 | 410 | `d274bc0665a2b5fec953249b2acae7b07a754220382845ee4160c1bb461130f8` |
| `runtime-source-context` | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 696 to 701 | 6 | 412 | `1fde7da7e7b025abeaf9e80be353a72cf337b6e2e0b0fa56182edda7fdedf398` |
| `evaluation-source-context` | `design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` | 180 to 185 | 6 | 410 | `d274bc0665a2b5fec953249b2acae7b07a754220382845ee4160c1bb461130f8` |

| Current note | Logical lines | Bytes | SHA-256 |
|---|---|---|---|
| `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 384 | 15,443 | `78d623ab0695daed889d9771fd6f6a3f9ff7aa69bf27b6f1315566240ac043c5` |
| `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | 1024 | 26,328 | `75950193abb7094214bfd86e5ae6e80806d2e9809df39b817f9745656205048e` |
| `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 747 | 17,855 | `1ea426672da1d9bdb629943005cd5142cc2e82691e7d62f23eb1d5f905656260` |
| `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 276 | 9,018 | `4fad2728883ccebc5eb4b814fd05435e5ab842580ff257b225444c4c861e7f30` |
| `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 831 | 23,128 | `2a5e3d783710090df4d3f6b444ae89d364386862de219a60dd6a879208a51c7b` |
| `design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` | 229 | 18,608 | `0d4c8e211524c22080da82acc3423c6ee8507250e0d7f1bb3007988a2df87ad3` |

After the source file was verified empty, it received a one-line Obsidian redirect to the new main note. The redirect contains 143 bytes, with checksum `6af872c972eff20dd084176910ee33896c2ecf8cf4acee2aa90b1e5846cf75f6`. The redirect is separate from the original source payload. The collection index adds the new note and updates the five destination descriptions.

The new dialogue was reconstructed and compared with its tracked original at revision `[repository fingerprint omitted]`. The eight earlier originals below were also reconstructed from their unchanged current ranges and compared with historical revision `[repository fingerprint omitted]`. Every comparison matched byte for byte.

| Original source | Logical lines | Bytes | SHA-256 |
|---|---|---|---|
| `architecture-generalization.md` | 926 | 20,143 | `80046e60ad993e2b27b1b1b834242ea59085900ea735b3ddea417ec42ad2b2a0` |
| `research-direction.md` | 690 | 25,260 | `376a1bc4b3b1788eedbd15815bb8176e5ed23bfe0421c5356b2993c3ea54b66c` |
| `investigation-lang-alg.md` | 990 | 25,461 | `b7f56872d4c2c814541c5fdcba69a6482cee108381ffed9a1e05f5698801bdee` |
| `investigation-lang-alg-llm-layer.md` | 700 | 11,811 | `2b5b352b5b805c76c49fdc38b07201cf02d6a7bf823165a5f3cba248142f7f6c` |
| `dsl-approach/dsl-for-rag.md` | 858 | 14,726 | `a71594404daf21b5b412db7bfde65750cf941716df0ba44a41e5bebea4b1d2df` |
| `dsl-approach/db-approach.md` | 681 | 20,298 | `8b511dde793b8cb4498dcba003b118c659007c0eeed0035355071be853f8b97a` |
| `dsl-approach/deep-research-report-formatted.md` | 727 | 65,976 | `984fe69cd243e6be69a379200dcb7ce7f03ceb6e8502f9ebae942469438311d8` |
| `dsl-approach/typed-durable-inspectable-runtimes-report.md` | 518 | 69,287 | `e1eb14184dc8a7874f8bfc0f54bf6393eaf5b2b3eea2df0c2f9f8a4934ccfaa7` |

All six affected notes have closed code blocks. All 140 internal Markdown links checked outside code blocks resolve, including all 54 collection-index links. The original external references were not rechecked.

The tracked whitespace check reports preserved separator blank lines at generalized-runtime-note line 831 and evaluation-note line 229. Full-file checks also report the retained final blank line in each affected note and the original Markdown hard-break spaces at main-note line 10. Every reported location belongs to unchanged source text. The blank lines and spaces were not trimmed.

The byte check caught a trailing blank line removed by the navigation edit in each affected note. Each line was restored with `_scripts/move_text.py` using a temporary one-line file. The temporary files were then emptied and removed. The complete reconstruction and destination checks passed after restoration.

The previous reassembly-log text, the move script, unrelated notes, and existing redirects were preserved. The Git index bytes, staged entries, and HEAD remained unchanged. No staging or commits were performed.

Earlier stage tables describe historical states. All earlier passage locations remain valid after the behavioral-specification split.

## Twenty-first-stage redistribution: second behavioral-specification dialogue


The 1,292-line `architecture-dsl-like/behavioural-specification-2.md` dialogue was redistributed into eight existing notes. No new notes were created. The source was outside the original 24-note reassembly inventory. Its complete text contained 43,309 bytes, with checksum `a0024010e5572594e1f5c98a11fe0e90a35848ba7c8f0c7cec622c1124048a6c`.

All nineteen original-content moves used `_scripts/move_text.py` without rewriting the selected passages. The inclusive source ranges were moved in descending order: 1281 to 1292, 1222 to 1280, 1155 to 1221, 1091 to 1154, 981 to 1090, 928 to 980, 893 to 927, 847 to 892, 524 to 846, 486 to 523, 472 to 485, 453 to 471, 433 to 452, 410 to 432, 334 to 409, 254 to 333, 189 to 253, 66 to 188, 1 to 65. Earlier passages were inserted before later source headings when needed to keep their original order.

The existing behavioral-compilation note received 570 original lines and 20,838 bytes, with checksum `6569b4bb200dd9b1e31335155d526f29aa86eb6088ba9e7ce7087f6760ddf119`. The retained ranges are 1 to 65, 254 to 333, 410 to 432, 524 to 846, 1155 to 1221, and 1281 to 1292. The abstraction analysis and reanalysis keep their original labels and order. The reanalysis note about uploaded sources and redirect coverage remains with its argument.

The other 722 original lines moved into seven existing notes. The complete nine-part literature comparison moved into related work. Guarded execution tiers, fallback, immutable history, and downstream gates moved into the generalized runtime. Verification problems and the complete synthetic clinical experiment moved into evaluation. Language tradeoffs and static checks moved into the compiler note. Compilation cost moved into resource planning. The verification stack moved into epistemic contracts. All eight system properties stayed together in the common-substrate note.

All previous content in the eight destinations remains byte for byte, including earlier navigation and blank lines. Removing only the imported source passages and new navigation reproduces the captured pre-split contents.

| Existing destination | Previous logical lines | Preserved bytes | Previous SHA-256 |
|---|---|---|---|
| `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 384 | 15,443 | `78d623ab0695daed889d9771fd6f6a3f9ff7aa69bf27b6f1315566240ac043c5` |
| `design-research/06-research-reports/04-investigation-systems-and-related-work.md` | 315 | 14,247 | `a216a7223e0411a0c9a67f3398ff6c0a2eee1c42a23bc0c89b0978609ddd8dc8` |
| `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 831 | 23,128 | `2a5e3d783710090df4d3f6b444ae89d364386862de219a60dd6a879208a51c7b` |
| `design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` | 229 | 18,608 | `0d4c8e211524c22080da82acc3423c6ee8507250e0d7f1bb3007988a2df87ad3` |
| `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | 1024 | 26,328 | `75950193abb7094214bfd86e5ae6e80806d2e9809df39b817f9745656205048e` |
| `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 471 | 9,341 | `bd8f39d4a73366723b9e185bc7cb2a0c821d5687b5eac1768cf6e9312c7684c2` |
| `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 747 | 17,855 | `1ea426672da1d9bdb629943005cd5142cc2e82691e7d62f23eb1d5f905656260` |
| `design-research/01-foundations/05-constrained-common-substrate.md` | 189 | 6,549 | `bf77c2bf2ee49c3e4957fa92c3559115ed3522cf1790ff5c008e1690ad6276a2` |

The table below accounts for all 1,292 original lines once. Concatenating the nineteen destination ranges in source order reproduces all 43,309 original bytes and the original checksum. Added navigation is excluded.

| Original lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 65 | `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 391 to 455 | 65 | 2,135 | `f900e68d99451a3566175fc9e69fd2329beb5415633b9942aec9d457631ad3cd` |
| 66 to 188 | `design-research/06-research-reports/04-investigation-systems-and-related-work.md` | 249 to 371 | 123 | 7,681 | `69ef807e2369d1f7257df4feaf345e48803cfda57b273e4164b44ba4cad3bfff` |
| 189 to 253 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 838 to 902 | 65 | 2,055 | `413660f24d1fd46460e409588578f3827235db7a4eb549445d2a378191847b8d` |
| 254 to 333 | `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 462 to 541 | 80 | 3,051 | `3c7256504b706c40f7a6aa7f5ba70da8bdb65aeeb7d5c9666647306c228affa9` |
| 334 to 409 | `design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` | 236 to 311 | 76 | 1,805 | `7c9fa42dcd304912a1cd367fcf964c06de6b80aa274a22856aa85a3905c94db2` |
| 410 to 432 | `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 547 to 569 | 23 | 598 | `b176008e0a8f953485b1a66d077f3ccffff9438f422219fef1ad6b97af115d1b` |
| 433 to 452 | `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | 1031 to 1050 | 20 | 492 | `49ea306e510fb228da397a4d6d7677347b25fd6358dee620655c1e0a6ccd7c5b` |
| 453 to 471 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 903 to 921 | 19 | 537 | `942291f4454c88248a4af147a118aca0f521243d3bdc2a6154570d1c5540926e` |
| 472 to 485 | `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 355 to 368 | 14 | 423 | `920870ced855a3f94d3db395da6b4432cdab289a4f8a26bef337556c5cd5398e` |
| 486 to 523 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 922 to 959 | 38 | 664 | `ca3af9b128a6355244bcdb7cc2105be0906c38af95ec5ea17d08085e10e4efc6` |
| 524 to 846 | `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 578 to 900 | 323 | 12,245 | `ffc0088e8bd36f84abed66dd1ad25f37b0b5da93ca878ac8ae973cc146bbee01` |
| 847 to 892 | `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | 1057 to 1102 | 46 | 1,355 | `f768736e52b9ba35da00f83b2e611a35005c16bfceb7a64ee6a213618db4bfe3` |
| 893 to 927 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 966 to 1000 | 35 | 774 | `3ed265c21a640b6b3ff6764d4555db045ba5327c31371bcd235e61c4da4e8887` |
| 928 to 980 | `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 754 to 806 | 53 | 1,615 | `b2d1dec5da6ac3f99ce2ac1db7e5139b965f5d67315715f676cf90c678ef4ec5` |
| 981 to 1090 | `design-research/01-foundations/05-constrained-common-substrate.md` | 196 to 305 | 110 | 2,258 | `a9d95b1cbc9b9b05b6c22987c5b61c7776231740ed07407eb6d335d65b13c814` |
| 1091 to 1154 | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 1001 to 1064 | 64 | 1,078 | `2fc269281a968ef85a84a1d2b0ff54cbd7765353cbc5333c31ba578cc329da93` |
| 1155 to 1221 | `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 910 to 976 | 67 | 1,738 | `84582dcabed914115194f6c507bdd09bc7128b32c80811094aa25fa8f90c544c` |
| 1222 to 1280 | `design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` | 318 to 376 | 59 | 1,734 | `6dff463033d68b4b359663329f092810eefe7614b3c394cf7311227d93c0c4d3` |
| 1281 to 1292 | `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 982 to 993 | 12 | 1,071 | `04861923d726ad3366d9457657b2742021beb0aecbbabd69af28f4a4f77f4709` |

Separate navigation adds 99 logical lines and 6,984 bytes. The source and previous destination text total 174,808 bytes, and the eight final notes total 181,792 bytes. Each navigation block was created in a temporary file and moved with `_scripts/move_text.py`. The empty temporary files and directory were then removed.

The source's final line has no newline and now ends the behavioral-compilation note. The related-work and resource-planning notes still have no final newline. The other five notes retain their final newline. No original line endings were added or removed.

| Added navigation | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| `core-follow-up-context` | `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 385 to 390 | 6 | 351 | `9ef34fe686c750d1c41c01d25c0229f4b1f5c72db6cc1ff0b8b40ee85937d0f5` |
| `core-related-work-and-tiers` | `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 456 to 461 | 6 | 410 | `c2dd121ffee87938192bf6d0a220f8c20b15d2d7f90e360f8d0ef061413ddb41` |
| `core-synthesis-problems` | `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 542 to 546 | 5 | 361 | `f5f6b510f35d950489e4b435e90e96351a69d2d62b42426650b98f7f1ad8091a` |
| `core-language-cost-and-history` | `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 570 to 577 | 8 | 590 | `f33f3c0f5ad94ba727883ef7f97d2f67d3232f0a0d71ffb6338e53c3ac19a7f2` |
| `core-reanalysis-lifecycle-links` | `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 901 to 909 | 9 | 800 | `97c46df761c12d0300a889b5c410e7dc2e2a2d7348deeeaf7fe203867a18a8c1` |
| `core-synthetic-experiment-link` | `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 977 to 981 | 5 | 310 | `d0b6878441955436ade61344441ec2589c2c1cc68f1654882397bbbd2eb107ef` |
| `related-work-context` | `design-research/06-research-reports/04-investigation-systems-and-related-work.md` | 243 to 248 | 6 | 430 | `4b8c7e328096ffdd33743a6a09f9e6778c511a9a46eccba0fb490477465cb408` |
| `runtime-abstraction-context` | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 832 to 837 | 6 | 433 | `c6cf49b752d24e49e24120e3fc58537b13adad7cc48eeee3700cd63620cf0227` |
| `runtime-reanalysis-context` | `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 960 to 965 | 6 | 419 | `71fd0ebbe08ff2c8a32157b05ff6e36c785f726c1f5e31ecb84aeec3d1fc80c0` |
| `evaluation-abstraction-context` | `design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` | 230 to 235 | 6 | 436 | `21cd3ab9ea716cec709008104a17d70f0157cfcc748aa29d946aa9d6020ab267` |
| `evaluation-reanalysis-context` | `design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` | 312 to 317 | 6 | 409 | `77bfec28c963d1bd5047038cf53cb2038dacd45ff21a915984c5e0662eaf3403` |
| `compiler-abstraction-context` | `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | 1025 to 1030 | 6 | 410 | `ce8e84a15bfca59361d5b4ecfbec37a95f848a092ed628d71d3b73ddea9ca49f` |
| `compiler-reanalysis-context` | `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | 1051 to 1056 | 6 | 378 | `7be47845f2d17357f410c6e802fe9a700fcd67b98335e2c2b71ceeaf3b259036` |
| `planning-abstraction-context` | `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 349 to 354 | 6 | 418 | `1cfe994ff2561ec289980d070109251ffa357fa77dae6dc7dd6b81c46933d46f` |
| `contracts-reanalysis-context` | `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 748 to 753 | 6 | 412 | `b6e25fa3fdd934ae8be57da4cdbba00e267c8d396898eb7ed92c04840443f88c` |
| `substrate-reanalysis-context` | `design-research/01-foundations/05-constrained-common-substrate.md` | 190 to 195 | 6 | 417 | `523f8ad067d8a32a555bc9692eb23a7d7eddbc6ce2045e6340621c046a0c3d98` |

| Current note | Logical lines | Bytes | SHA-256 |
|---|---|---|---|
| `design-research/03-language-and-compiler/11-behavioral-compilation-and-specification.md` | 993 | 39,103 | `e38a4733b8028d153bbc9468a0a17fbf241d29507239e68da1f92d470ae39804` |
| `design-research/06-research-reports/04-investigation-systems-and-related-work.md` | 444 | 22,358 | `1175c2dec61f2acde59f05cdabcaaa45577755499be4db890dd1d8b29f7ecdc1` |
| `design-research/05-runtime-and-execution/01-generalized-agent-runtime.md` | 1064 | 29,088 | `4a3541583ebb908ec30e2c90c396ca375127fe54f1ab908450462cd0515252c2` |
| `design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` | 376 | 22,992 | `b0b2c8921074d41a8aa898239897db58a2bc30d7b89e37771ef38da24734338e` |
| `design-research/03-language-and-compiler/02-typed-dsl-and-compiler.md` | 1102 | 28,963 | `506058cedb6a8eb2e4f96049da24725f67923ebd8c1804ab1e809ec32ee35086` |
| `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 491 | 10,182 | `a443f81b275caa9b21a44f8c5ad07d35bb5aad449638d1fac569084f4cf678b7` |
| `design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md` | 806 | 19,882 | `182147764401f031f36461851129589c9025ffcc90f292f793719e4a877e23d3` |
| `design-research/01-foundations/05-constrained-common-substrate.md` | 305 | 9,224 | `772ea30a89eeee7c012d306fc6d959467a3af7e2aeaff1e9c017e59cd7a5ec30` |

The source file was verified empty before receiving a one-line Obsidian redirect to the behavioral-compilation note. The redirect contains 143 bytes, with checksum `6af872c972eff20dd084176910ee33896c2ecf8cf4acee2aa90b1e5846cf75f6`. The redirect is separate from the original payload. The collection index updates the eight destination descriptions without adding entries.

The related-work insertion shifted an earlier investigation-language passage. The resource-planning insertion divided an earlier RAG passage into an unchanged prefix and a shifted suffix. The current ranges below replace the corresponding earlier locations. All other earlier source and navigation ranges retain their previous locations.

| Earlier original source and lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| `investigation-lang-alg.md:918 to 990` | `design-research/06-research-reports/04-investigation-systems-and-related-work.md` | 372 to 444 | 73 | 4,510 | `c9514f7f556f4b6ced1c4c43bb2c7831a67dcc87326280c987f321823dfb178e` |
| `dsl-approach/dsl-for-rag.md:656 to 735` | `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 269 to 348 | 80 | 1,258 | `ec3b1a9972b37cac5c33022c0345616cf3121458c46d1384dea766075d0a3d6c` |
| `dsl-approach/dsl-for-rag.md:736 to 858` | `design-research/05-runtime-and-execution/03-resource-aware-investigation-planning.md` | 369 to 491 | 123 | 2,504 | `5af4468f304f07b999f8236469edeae8a927624c205c3cb89db6a0bf8e8433d9` |

The new dialogue and the first behavioral-specification dialogue were reconstructed and compared with their tracked originals at revision `[repository fingerprint omitted]`. The other eight originals below were reconstructed and compared with historical revision `[repository fingerprint omitted]`. Every reconstruction matched byte for byte.

| Earlier original source | Logical lines | Bytes | SHA-256 |
|---|---|---|---|
| `architecture-generalization.md` | 926 | 20,143 | `80046e60ad993e2b27b1b1b834242ea59085900ea735b3ddea417ec42ad2b2a0` |
| `research-direction.md` | 690 | 25,260 | `376a1bc4b3b1788eedbd15815bb8176e5ed23bfe0421c5356b2993c3ea54b66c` |
| `investigation-lang-alg.md` | 990 | 25,461 | `b7f56872d4c2c814541c5fdcba69a6482cee108381ffed9a1e05f5698801bdee` |
| `investigation-lang-alg-llm-layer.md` | 700 | 11,811 | `2b5b352b5b805c76c49fdc38b07201cf02d6a7bf823165a5f3cba248142f7f6c` |
| `dsl-approach/dsl-for-rag.md` | 858 | 14,726 | `a71594404daf21b5b412db7bfde65750cf941716df0ba44a41e5bebea4b1d2df` |
| `dsl-approach/db-approach.md` | 681 | 20,298 | `8b511dde793b8cb4498dcba003b118c659007c0eeed0035355071be853f8b97a` |
| `dsl-approach/deep-research-report-formatted.md` | 727 | 65,976 | `984fe69cd243e6be69a379200dcb7ce7f03ceb6e8502f9ebae942469438311d8` |
| `dsl-approach/typed-durable-inspectable-runtimes-report.md` | 518 | 69,287 | `e1eb14184dc8a7874f8bfc0f54bf6393eaf5b2b3eea2df0c2f9f8a4934ccfaa7` |
| `behavioural-specification.md` | 742 | 24,801 | `80833b7d13c9cf4a4a5190f24646e3e24d63596102d9a52b52a012efac1e413c` |

All eight affected notes have closed code blocks. All 164 internal Markdown links checked outside code blocks resolve, including all 54 collection-index links. External literature claims and uploaded-file references were retained without verification as part of the reorganization.

The tracked whitespace check reports preserved separator blank lines at generalized-runtime-note line 1064 and evaluation-note line 376. Full-file checks also report original spaces and final blank lines in the captured text. Every reported location belongs to preserved source or previous destination text. The new navigation introduces no whitespace warnings.

The earlier reassembly-log text, the move script, unrelated notes, earlier redirects, and existing staged and unstaged work were preserved. Git index bytes, staged entries, and HEAD remained unchanged. No staging or commits were performed.

Earlier stage tables describe historical states. The new mapping and shifted-range tables above record the current locations for the second behavioral-specification split.

## Twenty-second-stage split: constrained-generativity dialogue


The 1,139-line `architecture-dsl-like/creator-approach.md` dialogue had remained intact in `design-research/01-foundations/01-constrained-generativity.md` after the first-stage move. Its complete text contained 47,474 bytes, with checksum `e3f08362c6bfc57032cc9c52e9c5787f5402ce3da0b16d4202a9ed4a751a7127`.

All four original-content moves used `_scripts/move_text.py` without rewriting the passages. The inclusive source ranges were moved in descending order: 945 to 1019, 921 to 944, 859 to 920, and 1 to 248. The builder passages were inserted before the report's research-gaps section, with the earlier passage placed before the later passage.

The general-principle note retains original lines 249 to 858 and 1020 to 1139. Its 730 original lines contain 28,189 bytes, with checksum `2fc1ebf8349bab9c435cae7e186c7c0a6c72d9e34d3ccf8639efa42373e4ff66`. The complete examples, independent restatement, analysis prompt, construction-rule argument, inverse constraints-to-guarantees problem, and final research question stay together.

The opening question, its answer, and the complete historical survey moved together into the new architectural-least-commitment note. The builder questions and complete three-builder comparison joined the existing semantic-substrate report. The critique of architecture-specific assumptions joined the existing refined-question note.

The refined-question note now presents the later critique first, followed by a separately labeled section containing all of its previous wording. Added context explains the order and links to the revised broad research question in the general-principle note. The original section numbers, citations, repetitions, and dialogue separators were retained.

Both existing destination notes preserve all previous text byte for byte. Removing only the imported passages and new navigation reproduces their captured pre-split contents.

| Existing destination | Previous logical lines | Preserved bytes | Previous SHA-256 |
|---|---|---|---|
| `design-research/01-foundations/02-semantic-substrate-design-report.md` | 1,766 | 71,631 | `ed38e513fd8fa91770012d790bce1a31a78d0e69430ec16696c0774f44d3fc81` |
| `design-research/00-overview/05-refined-research-question.md` | 20 | 2,886 | `c874a12bd953da09aa31cd392643f11067c79358d8860c4bf57944b982fc150b` |

The table below accounts for all 1,139 original lines once. Concatenating the six destination ranges in original order reproduces all 47,474 original bytes and the original checksum. Added navigation is excluded.

| Original lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 248 | `design-research/01-foundations/06-architectural-least-commitment-and-precedents.md` | 7 to 254 | 248 | 14,589 | `5ad08523fa53ba53a13f03c203e5f511e41faf6c3573c9effcf1a6e26f6f4706` |
| 249 to 858 | `design-research/01-foundations/01-constrained-generativity.md` | 7 to 616 | 610 | 24,973 | `c9ac6370296d5cf764a4f3633c7dd5ced512b8cd3cb2f7f1a035d2b7265d8e08` |
| 859 to 920 | `design-research/01-foundations/02-semantic-substrate-design-report.md` | 1257 to 1318 | 62 | 1,594 | `904ce43edc0672a57b2316e2cd9d67b9fb589ad81fdbd94445d9daec0c9f77e5` |
| 921 to 944 | `design-research/00-overview/05-refined-research-question.md` | 9 to 32 | 24 | 1,698 | `a75b4f8e33ff0cda896eac9e7f3096da047d15f34e3128aa4b699c2937214e32` |
| 945 to 1019 | `design-research/01-foundations/02-semantic-substrate-design-report.md` | 1323 to 1397 | 75 | 1,404 | `3fda5c6ae4fd12ccc68eb07643149c0139300c2256c7ff0dcc9a51d87c0c3e30` |
| 1020 to 1139 | `design-research/01-foundations/01-constrained-generativity.md` | 621 to 740 | 120 | 3,216 | `3e7ef516a3250ad75d8512290a2bd7d4409613436b10640038cd69eef6736aa5` |

Separate navigation adds 40 logical lines and 3,287 bytes. The original dialogue and previous destination text total 121,991 bytes, and the four final notes total 125,278 bytes. Each navigation block was created with `apply_patch` in a temporary file and moved with `_scripts/move_text.py`. The empty temporary files and directory were then removed.

| Added navigation | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| `core-opening` | `design-research/01-foundations/01-constrained-generativity.md` | 1 to 6 | 6 | 393 | `e1f2b68ad9454240fdb96638e805df5b855c4c70c0dba87295169eba702836ad` |
| `core-builder-and-framing-links` | `design-research/01-foundations/01-constrained-generativity.md` | 617 to 620 | 4 | 605 | `089607f6902df9052dc9d8e217990c34e95d3f167e0eee6596dcc4abd98f1af5` |
| `report-builder-context` | `design-research/01-foundations/02-semantic-substrate-design-report.md` | 1251 to 1256 | 6 | 436 | `a0401851457fe839b734281424720ba67a6f2a646c7dea1a87950df617e37a7e` |
| `report-framing-link` | `design-research/01-foundations/02-semantic-substrate-design-report.md` | 1319 to 1322 | 4 | 530 | `bd7e176d18cea909ffc18f519ef5d4be3f1e07f2857f317410d12d20d8d7c9a8` |
| `refined-scope-context` | `design-research/00-overview/05-refined-research-question.md` | 1 to 8 | 8 | 518 | `6643e6804ad642e3beb9da1e4c2c22a15e6a497be35651a45bd75fee43a6fe3c` |
| `refined-earlier-wording-context` | `design-research/00-overview/05-refined-research-question.md` | 33 to 38 | 6 | 431 | `b2c946b14140507471208575789d4535afc73ac29bd9c94d1799d74db1a998e2` |
| `least-commitment-opening` | `design-research/01-foundations/06-architectural-least-commitment-and-precedents.md` | 1 to 6 | 6 | 374 | `8bd46587a4a396c0c41ef1154d21fa86780a83a9246978079e258871443ee8aa` |

The source's final line still has no newline and remains at the end of the general-principle note. The refined-question note also retains its unterminated final line. The report and new least-commitment note end with newlines. No original line endings were added or removed.

| Current note | Logical lines | Bytes | SHA-256 |
|---|---|---|---|
| `design-research/01-foundations/01-constrained-generativity.md` | 740 | 29,187 | `e3252175ad272f4bdd45bf623412ac2f056a83ef14ab48289b9420bd9f69cfc5` |
| `design-research/01-foundations/02-semantic-substrate-design-report.md` | 1,913 | 75,595 | `c22e5741b2e14ea51572048fafa3ea487c91526809da7f601bcd364c3dd4c0db` |
| `design-research/00-overview/05-refined-research-question.md` | 58 | 5,533 | `2fc3b2e070c4d87cfce9666f0e22a1ef3dcc40f1c213a9c7ea314c8251f4d03f` |
| `design-research/01-foundations/06-architectural-least-commitment-and-precedents.md` | 254 | 14,963 | `8460fdedadb0ec7ab5d4170da86f155c7c57d4134144fde75f4a5ddd8cae429a` |

The report insertion splits its earlier whole-file mapping into an unchanged prefix and a shifted suffix. The refined-question insertion shifts the earlier problem-framing passage without splitting it. The current ranges below replace the corresponding earlier locations. All other earlier passage and navigation locations remain unchanged.

| Earlier original source and lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| `dsl-approach/constrained-generativity-semantic-substrate-design.md:1 to 1250` | `design-research/01-foundations/02-semantic-substrate-design-report.md` | 1 to 1250 | 1,250 | 52,863 | `d0060c05fce1c9deffdb9c34f2ec805e3756bb14a42de71b693aba94e036525a` |
| `dsl-approach/constrained-generativity-semantic-substrate-design.md:1251 to 1766` | `design-research/01-foundations/02-semantic-substrate-design-report.md` | 1398 to 1913 | 516 | 18,768 | `1dc19ed8a9e82e5e5c1391ff096f97315a398953570831b97a725b3e902330ab` |
| `dsl-approach/problem-framing.md:335 to 354` | `design-research/00-overview/05-refined-research-question.md` | 39 to 58 | 20 | 2,886 | `c874a12bd953da09aa31cd392643f11067c79358d8860c4bf57944b982fc150b` |

The current dialogue, semantic-substrate report, and complete problem-framing dialogue were reconstructed and compared with historical revision `[repository fingerprint omitted]`. The ten originals verified in the preceding stage were reconstructed again. The behavioral-specification originals were compared with revision `[repository fingerprint omitted]`, and the others with the historical revision. Every reconstruction matched byte for byte.

| Original source checked | Logical lines | Bytes | SHA-256 |
|---|---|---|---|
| `architecture-generalization.md` | 926 | 20,143 | `80046e60ad993e2b27b1b1b834242ea59085900ea735b3ddea417ec42ad2b2a0` |
| `research-direction.md` | 690 | 25,260 | `376a1bc4b3b1788eedbd15815bb8176e5ed23bfe0421c5356b2993c3ea54b66c` |
| `investigation-lang-alg.md` | 990 | 25,461 | `b7f56872d4c2c814541c5fdcba69a6482cee108381ffed9a1e05f5698801bdee` |
| `investigation-lang-alg-llm-layer.md` | 700 | 11,811 | `2b5b352b5b805c76c49fdc38b07201cf02d6a7bf823165a5f3cba248142f7f6c` |
| `dsl-approach/dsl-for-rag.md` | 858 | 14,726 | `a71594404daf21b5b412db7bfde65750cf941716df0ba44a41e5bebea4b1d2df` |
| `dsl-approach/db-approach.md` | 681 | 20,298 | `8b511dde793b8cb4498dcba003b118c659007c0eeed0035355071be853f8b97a` |
| `dsl-approach/deep-research-report-formatted.md` | 727 | 65,976 | `984fe69cd243e6be69a379200dcb7ce7f03ceb6e8502f9ebae942469438311d8` |
| `dsl-approach/typed-durable-inspectable-runtimes-report.md` | 518 | 69,287 | `e1eb14184dc8a7874f8bfc0f54bf6393eaf5b2b3eea2df0c2f9f8a4934ccfaa7` |
| `behavioural-specification.md` | 742 | 24,801 | `80833b7d13c9cf4a4a5190f24646e3e24d63596102d9a52b52a012efac1e413c` |
| `behavioural-specification-2.md` | 1,292 | 43,309 | `a0024010e5572594e1f5c98a11fe0e90a35848ba7c8f0c7cec622c1124048a6c` |
| `creator-approach.md` | 1,139 | 47,474 | `e3f08362c6bfc57032cc9c52e9c5787f5402ce3da0b16d4202a9ed4a751a7127` |
| `dsl-approach/constrained-generativity-semantic-substrate-design.md` | 1,766 | 71,631 | `ed38e513fd8fa91770012d790bce1a31a78d0e69430ec16696c0774f44d3fc81` |
| `dsl-approach/problem-framing.md` | 354 | 21,976 | `b62b59c763e643ac00223648e80a40d02d3d67d0dd4d24772ca00b5cad721cf6` |

All four affected notes have closed code blocks. All 65 internal Markdown links checked outside code blocks resolve, including all 55 collection-index links. The original `[another](#another)` link remains valid because its heading stays in the general-principle note. External literature claims and captured citations were retained without verification as part of the reorganization.

The tracked whitespace check still reports the earlier preserved separator blank lines at generalized-runtime-note line 1064 and evaluation-note line 376. The new least-commitment note's full-file check reports its final blank line at current line 254, which is original source line 248. The other three affected notes have no whitespace warnings. New navigation introduces no whitespace warnings, and the preserved blank lines were not trimmed.

The collection index adds the least-commitment note and updates the three affected note descriptions and the refined-question reading-path entry. The earlier reassembly-log text, move script, unrelated notes, redirects, and existing staged and unstaged work were preserved. Git index bytes, staged entries, and HEAD remained unchanged. No staging or commits were performed.

Earlier stage tables describe historical states. The source, navigation, and shifted-range tables above record the current locations for the constrained-generativity split.

## Twenty-third-stage split: semantic-substrate design report


The first-stage semantic-substrate report originally contained 1,766 logical lines and 71,631 bytes. The preceding split added 137 unchanged lines from `creator-approach.md` and 10 navigation lines. The resulting 1,913-line pre-split document contained 75,595 bytes, with checksum `c22e5741b2e14ea51572048fafa3ea487c91526809da7f601bcd364c3dd4c0db`.

All six content moves used `_scripts/move_text.py` without rewriting the selected passages. The inclusive current-source ranges were moved in descending order: 1683 to 1774, 1637 to 1682, 1068 to 1397, 1036 to 1067, 497 to 1035, and 70 to 496. Earlier passages were inserted before later headings to preserve their order within each destination.

The report retains 447 pre-split lines containing the executive summary, general research gaps, and complete original bibliography. The literature foundations, applied systems, and complete comparison table moved together into the existing least-commitment note. The provenance passage and complete payment-approval example joined the existing provenance note.

New `07-constraint-guarantee-and-composition-models.md` contains 631 pre-split lines. The complete general derivation, proposal/commit proof, CRDT and capability models, proposed extension-set measure, and concluding thesis stay together. The measure's original caveat about being a proposed research formulation is retained.

New `08-semantic-substrate-builder-method.md` contains all 330 pre-split builder-method lines. The method, semantic dimensions, enforcement choices, unknown-component tests, and complete three-builder dialogue remain together. The two earlier navigation blocks moved with that dialogue without changes.

Both existing receiving notes preserve all previous text byte for byte. Removing only the imported passages and new navigation reproduces their captured pre-split contents.

| Existing receiving note | Previous logical lines | Preserved bytes | Previous SHA-256 |
|---|---|---|---|
| `design-research/01-foundations/06-architectural-least-commitment-and-precedents.md` | 254 | 14,963 | `8460fdedadb0ec7ab5d4170da86f155c7c57d4134144fde75f4a5ddd8cae429a` |
| `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 276 | 9,018 | `4fad2728883ccebc5eb4b814fd05435e5ab842580ff257b225444c4c861e7f30` |

The following table uses positions in the 1,913-line document immediately before this split. Every pre-split line appears once. Concatenating the nine destination ranges in pre-split order reproduces all 75,595 bytes and the pre-split checksum.

| Pre-split lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 69 | `design-research/01-foundations/02-semantic-substrate-design-report.md` | 1 to 69 | 69 | 3,482 | `11a191a1914cded6a258923084f8f6a7274fca32d03b57928b497532c98f696e` |
| 70 to 496 | `design-research/01-foundations/06-architectural-least-commitment-and-precedents.md` | 259 to 685 | 427 | 23,722 | `538d2d4ba4bcc617e696cc460524b43412d60278efbb7b7a488a61d2f22b7d9d` |
| 497 to 1035 | `design-research/01-foundations/07-constraint-guarantee-and-composition-models.md` | 7 to 545 | 539 | 9,730 | `5ba277884569a3208092e9b8a502286d9b02d986cded6dabfeb9dccc95cd657c` |
| 1036 to 1067 | `design-research/01-foundations/06-architectural-least-commitment-and-precedents.md` | 690 to 721 | 32 | 7,231 | `fb1dd256b568bc45bfeaf0e87480ebe557ceda6520dfd0febe65a1bf38812096` |
| 1068 to 1397 | `design-research/01-foundations/08-semantic-substrate-builder-method.md` | 7 to 336 | 330 | 12,662 | `b044dc7ada357221eebf93b968b692a55cab52ee0dd2cd747c0a94953c2b3425` |
| 1398 to 1636 | `design-research/01-foundations/02-semantic-substrate-design-report.md` | 74 to 312 | 239 | 6,624 | `766a15478fc744d28e99c1895f80c61d64279c45f904184e30642d8f38ee19b5` |
| 1637 to 1682 | `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 283 to 328 | 46 | 1,080 | `28634131d6ab3dc09e845a4629646ed59a050b68fbee47bc70d506c8cb2c187b` |
| 1683 to 1774 | `design-research/01-foundations/07-constraint-guarantee-and-composition-models.md` | 550 to 641 | 92 | 2,251 | `15306c84e6d69acab05ec2ddedeb4dc12811069d957d8fb6a13392d017bf415b` |
| 1775 to 1913 | `design-research/01-foundations/02-semantic-substrate-design-report.md` | 317 to 455 | 139 | 8,813 | `5b8b638f8fed0cb676c6755487b435b4f4e0572cbd98eb15d16ae49b3760ec65` |

The table below maps the original 1,766-line report separately from the imported dialogue and prior navigation. Its nine ranges reproduce all 71,631 original bytes and checksum `ed38e513fd8fa91770012d790bce1a31a78d0e69430ec16696c0774f44d3fc81`.

| Original report lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 69 | `design-research/01-foundations/02-semantic-substrate-design-report.md` | 1 to 69 | 69 | 3,482 | `11a191a1914cded6a258923084f8f6a7274fca32d03b57928b497532c98f696e` |
| 70 to 496 | `design-research/01-foundations/06-architectural-least-commitment-and-precedents.md` | 259 to 685 | 427 | 23,722 | `538d2d4ba4bcc617e696cc460524b43412d60278efbb7b7a488a61d2f22b7d9d` |
| 497 to 1035 | `design-research/01-foundations/07-constraint-guarantee-and-composition-models.md` | 7 to 545 | 539 | 9,730 | `5ba277884569a3208092e9b8a502286d9b02d986cded6dabfeb9dccc95cd657c` |
| 1036 to 1067 | `design-research/01-foundations/06-architectural-least-commitment-and-precedents.md` | 690 to 721 | 32 | 7,231 | `fb1dd256b568bc45bfeaf0e87480ebe557ceda6520dfd0febe65a1bf38812096` |
| 1068 to 1250 | `design-research/01-foundations/08-semantic-substrate-builder-method.md` | 7 to 189 | 183 | 8,698 | `3d363bab392d66648c33c0d17a2569348b6e0e4b91ecc22ad5b3229b8f540bc2` |
| 1251 to 1489 | `design-research/01-foundations/02-semantic-substrate-design-report.md` | 74 to 312 | 239 | 6,624 | `766a15478fc744d28e99c1895f80c61d64279c45f904184e30642d8f38ee19b5` |
| 1490 to 1535 | `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 283 to 328 | 46 | 1,080 | `28634131d6ab3dc09e845a4629646ed59a050b68fbee47bc70d506c8cb2c187b` |
| 1536 to 1627 | `design-research/01-foundations/07-constraint-guarantee-and-composition-models.md` | 550 to 641 | 92 | 2,251 | `15306c84e6d69acab05ec2ddedeb4dc12811069d957d8fb6a13392d017bf415b` |
| 1628 to 1766 | `design-research/01-foundations/02-semantic-substrate-design-report.md` | 317 to 455 | 139 | 8,813 | `5b8b638f8fed0cb676c6755487b435b4f4e0572cbd98eb15d16ae49b3760ec65` |

The earlier creator-dialogue passages now have the locations below. Their source text is unchanged. All other creator-dialogue passage locations remain unchanged.

| Earlier original source and lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| `creator-approach.md:859 to 920` | `design-research/01-foundations/08-semantic-substrate-builder-method.md` | 196 to 257 | 62 | 1,594 | `904ce43edc0672a57b2316e2cd9d67b9fb589ad81fdbd94445d9daec0c9f77e5` |
| `creator-approach.md:945 to 1019` | `design-research/01-foundations/08-semantic-substrate-builder-method.md` | 262 to 336 | 75 | 1,404 | `3fda5c6ae4fd12ccc68eb07643149c0139300c2256c7ff0dcc9a51d87c0c3e30` |

The earlier builder navigation retains its text and checksums at the new locations below.

| Previous report lines | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1251 to 1256 | `design-research/01-foundations/08-semantic-substrate-builder-method.md` | 190 to 195 | 6 | 436 | `a0401851457fe839b734281424720ba67a6f2a646c7dea1a87950df617e37a7e` |
| 1319 to 1322 | `design-research/01-foundations/08-semantic-substrate-builder-method.md` | 258 to 261 | 4 | 530 | `bd7e176d18cea909ffc18f519ef5d4be3f1e07f2857f317410d12d20d8d7c9a8` |

The general-principle note has one explicit navigation update at line 619. The two builder links now point to the new builder-method note rather than the report. No original dialogue text changed. Substituting the prior navigation line reproduces all 29,187 pre-split bytes and checksum `e3252175ad272f4bdd45bf623412ac2f056a83ef14ab48289b9420bd9f69cfc5`.

The prior line contained 509 bytes, including its final newline, with checksum `4f706809e8d747fb074b8d8e2ec577f0a61ae94d118617fa43cb26dd267693c6`. Its exact text is recorded below so the metadata change can be reversed:

```text
The intervening passages are now in the [builder questions](02-semantic-substrate-design-report.md#2-this-changes-what-you-give-builders), the [critique of the earlier question](../00-overview/05-refined-research-question.md#3-the-second-problem-framing-is-currently-too-solution-shaped), and the [complete comparison of three builders](02-semantic-substrate-design-report.md#4-start-from-guarantees-then-derive-constraints). The dialogue continues below with the relation between constraints and guarantees.
```


The replacement line contains 511 bytes, including its final newline, with checksum `d3b4200d6e58b079b2f15b9f73fa11d940d7a49066d8e43a67f091f35f2731ca`. The replacement changes the total byte count by 2 bytes without changing the logical line count. The navigation line was replaced through two `_scripts/move_text.py` moves using temporary files.

New navigation and local citation definitions add 246 logical lines and 17,218 bytes. The pre-split document and previous receiving and general-principle notes total 128,763 bytes. After the additions and the two-byte navigation update, the six affected notes total 145,983 bytes.

| Added navigation or citation block | Current destination | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| `report-section-links` | `design-research/01-foundations/02-semantic-substrate-design-report.md` | 70 to 73 | 4 | 546 | `755f649235c976a637e9f50ae9e8f8be42119164d51b961d69baeb6fdefc0be9` |
| `report-provenance-and-generativity-links` | `design-research/01-foundations/02-semantic-substrate-design-report.md` | 313 to 316 | 4 | 535 | `bca826e4826d21706dbf94deb198576136b08da533c5df546715bcfac982e366` |
| `precedents-report-context` | `design-research/01-foundations/06-architectural-least-commitment-and-precedents.md` | 255 to 258 | 4 | 462 | `1fb7f66dbdb4903bcbe36eb96d9c052ecc287c5af801586eac7d74a6a5768d84` |
| `precedents-formal-model-link` | `design-research/01-foundations/06-architectural-least-commitment-and-precedents.md` | 686 to 689 | 4 | 285 | `a6decb21192e04962b73fd2b26b60fdd92c533c4f487db8389ab5f8b0ed8679d` |
| `precedents-local-citations` | `design-research/01-foundations/06-architectural-least-commitment-and-precedents.md` | 722 to 849 | 128 | 8,160 | `4b7ef05a219c9783b9bae41b42e6c129b46dd2c67e785b1a71b0657aafbb0953` |
| `theory-opening-context` | `design-research/01-foundations/07-constraint-guarantee-and-composition-models.md` | 1 to 6 | 6 | 548 | `339e13486878d6947251f044d78f0626d2524ea0966931509695d5ffc1dce264` |
| `theory-generativity-context` | `design-research/01-foundations/07-constraint-guarantee-and-composition-models.md` | 546 to 549 | 4 | 397 | `148acdc89ef53c711f396b1c679be0bacc9dfdc10df9e999aa59902f1a2b183b` |
| `theory-local-citations` | `design-research/01-foundations/07-constraint-guarantee-and-composition-models.md` | 642 to 679 | 38 | 2,709 | `28c677e89bef1106c35a873f637ee41ef36500c8e91ffd0fd54a1f17ce366b18` |
| `builder-opening-context` | `design-research/01-foundations/08-semantic-substrate-builder-method.md` | 1 to 6 | 6 | 501 | `1e1def46effdb636c2ce67e9ff3f87be98ffd8373c7534d6c6daa4c3789a5bdf` |
| `builder-local-citations` | `design-research/01-foundations/08-semantic-substrate-builder-method.md` | 337 to 368 | 32 | 1,909 | `93c94ccc3a194b7dd38ff9ff0ffbbc19c64620cbefd78dde7a66d65cbf4902de` |
| `provenance-validation-context` | `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 277 to 282 | 6 | 442 | `b60806f039c000aa2e4780040471ed6ecc8f946b271be5ace4531ea55ce0a008` |
| `provenance-local-citations` | `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 329 to 338 | 10 | 724 | `7724823227216ca78c3b22560a57abbdb22fb83df3743b07ee272598f378e095` |

All 69 original reference definitions remain unchanged in the report. The four receiving notes have 92 local definition copies in total, containing only the definitions used by their imported passages. Each copied definition was checked against the original line in the report. The copies are separately marked additions and are excluded from original-source reconstruction.

| Note checked | Footnote identifiers used | Definitions present | Missing definitions | Duplicate definitions |
|---|---|---|---|---|
| `design-research/01-foundations/02-semantic-substrate-design-report.md` | 22 | 69 | 0 | 0 |
| `design-research/01-foundations/06-architectural-least-commitment-and-precedents.md` | 61 | 61 | 0 | 0 |
| `design-research/01-foundations/07-constraint-guarantee-and-composition-models.md` | 16 | 16 | 0 | 0 |
| `design-research/01-foundations/08-semantic-substrate-builder-method.md` | 13 | 13 | 0 | 0 |
| `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 2 | 2 | 0 | 0 |

The local definition blocks and navigation were created with `apply_patch` in temporary files and moved with `_scripts/move_text.py`. The empty temporary files, the temporary copy of the replaced navigation line, and the temporary directory were removed. The replaced line remains recoverable from the exact text and checksum above.

| Current note | Logical lines | Bytes | SHA-256 |
|---|---|---|---|
| `design-research/01-foundations/02-semantic-substrate-design-report.md` | 455 | 20,000 | `61fe0961915ab486a45b924c2316ae4139e3576eea15f83abb0e46377550eb48` |
| `design-research/01-foundations/06-architectural-least-commitment-and-precedents.md` | 849 | 54,823 | `bdcb64a7727c053478e15972d659289905d9b0b50331e1eeefd0459c815fb741` |
| `design-research/01-foundations/07-constraint-guarantee-and-composition-models.md` | 679 | 15,635 | `dec210fd3aa13cd4f06c27cb6e7971e2a5b97ddea96723c130fce8e66466a1e2` |
| `design-research/01-foundations/08-semantic-substrate-builder-method.md` | 368 | 15,072 | `a4afe960465e1eb026ae0b9128432ea5f0eb4e3afb1e9fe26877202df2455a86` |
| `design-research/04-investigation-and-epistemics/04-provenance-and-argumentation-foundations.md` | 338 | 11,264 | `89c9dc246bf19ce86707e2e4d78973654251069ffdf478ae92d22f8fee26d264` |
| `design-research/01-foundations/01-constrained-generativity.md` | 740 | 29,189 | `088d43acd34d870501713f6079584f1e1442ac3e3315114dcfd003fa0ecda6aa` |

All five report-related notes end with newlines. The general-principle note retains its original unterminated final line. No original line endings were added, removed, or normalized.

All thirteen originals below were reconstructed again. The two behavioral-specification originals were compared with revision `[repository fingerprint omitted]`. The other originals were compared with historical revision `[repository fingerprint omitted]`. Every reconstruction matched byte for byte.

| Original source checked | Logical lines | Bytes | SHA-256 |
|---|---|---|---|
| `architecture-generalization.md` | 926 | 20,143 | `80046e60ad993e2b27b1b1b834242ea59085900ea735b3ddea417ec42ad2b2a0` |
| `research-direction.md` | 690 | 25,260 | `376a1bc4b3b1788eedbd15815bb8176e5ed23bfe0421c5356b2993c3ea54b66c` |
| `investigation-lang-alg.md` | 990 | 25,461 | `b7f56872d4c2c814541c5fdcba69a6482cee108381ffed9a1e05f5698801bdee` |
| `investigation-lang-alg-llm-layer.md` | 700 | 11,811 | `2b5b352b5b805c76c49fdc38b07201cf02d6a7bf823165a5f3cba248142f7f6c` |
| `dsl-approach/dsl-for-rag.md` | 858 | 14,726 | `a71594404daf21b5b412db7bfde65750cf941716df0ba44a41e5bebea4b1d2df` |
| `dsl-approach/db-approach.md` | 681 | 20,298 | `8b511dde793b8cb4498dcba003b118c659007c0eeed0035355071be853f8b97a` |
| `dsl-approach/deep-research-report-formatted.md` | 727 | 65,976 | `984fe69cd243e6be69a379200dcb7ce7f03ceb6e8502f9ebae942469438311d8` |
| `dsl-approach/typed-durable-inspectable-runtimes-report.md` | 518 | 69,287 | `e1eb14184dc8a7874f8bfc0f54bf6393eaf5b2b3eea2df0c2f9f8a4934ccfaa7` |
| `behavioural-specification.md` | 742 | 24,801 | `80833b7d13c9cf4a4a5190f24646e3e24d63596102d9a52b52a012efac1e413c` |
| `behavioural-specification-2.md` | 1,292 | 43,309 | `a0024010e5572594e1f5c98a11fe0e90a35848ba7c8f0c7cec622c1124048a6c` |
| `creator-approach.md` | 1,139 | 47,474 | `e3f08362c6bfc57032cc9c52e9c5787f5402ce3da0b16d4202a9ed4a751a7127` |
| `dsl-approach/constrained-generativity-semantic-substrate-design.md` | 1,766 | 71,631 | `ed38e513fd8fa91770012d790bce1a31a78d0e69430ec16696c0774f44d3fc81` |
| `dsl-approach/problem-framing.md` | 354 | 21,976 | `b62b59c763e643ac00223648e80a40d02d3d67d0dd4d24772ca00b5cad721cf6` |

All six affected notes have closed code blocks. All 90 internal Markdown links checked outside code blocks resolve, including all 59 collection-index links. Local footnote definitions have no missing or duplicate identifiers. External literature claims and captured references were retained without verification as part of the reorganization.

The six affected notes pass full-file whitespace checks. The tracked check still reports only the earlier preserved separator blank lines at generalized-runtime-note line 1064 and evaluation-note line 376. Original blank lines and spaces were preserved.

The collection index adds the two new notes and updates the report, least-commitment, and provenance descriptions and the report's reading-path entry. The earlier reassembly-log text, move script, unrelated notes, redirects, and existing staged and unstaged work were preserved. Git index bytes, staged entries, and HEAD remained unchanged. No staging or commits were performed.

Earlier stage tables describe historical states. The pre-split, original-report, creator-dialogue, navigation, and citation tables above record the current semantic-substrate split.

## Twenty-fourth-stage split: programmable human-AI environments report


The approved split was applied on 2026-09-30. The source was [the programmable human-AI environments report]({{< ref "ai/design-research/02-human-ai-collaboration/03-programmable-human-ai-environments-report" >}}), first assembled from `architecture-dsl-like/programmable-environments-human-ai-collaboration.md`. Before this split, the complete report had 606 logical lines and 77,682 bytes, with a final newline. Its SHA-256 was `5db18ba69d758e99c8715bb30e93829bdca2b766b35a26b76feba8727c05bc26`. It matched the historical original at `[repository fingerprint omitted]` exactly.

The split retains 359 source lines in the report, moves 82 to the existing augmentation literature note and 102 to the existing shared-runtime landscape note, and creates one note with the complete 63-line trusted execution section. The complete architectural synthesis and research agenda stay with the executive summary and original bibliography. The historical timeline stays with both paragraphs interpreting it. Both comparison matrices stay together with the current systems discussion and all four conclusions. The trusted execution diagram, provenance example, capability distinctions, threat-model qualifications, protocol-versus-policy analysis, and verification taxonomy stay together.

No captured prose, tables, diagrams, repetitions, citations, temporal claims, blank lines, or line endings were rewritten. The empirical collaboration study remains in the complete current systems discussion, including its qualifications. The literature note links to that discussion. New navigation and local citation copies are marked separately from source text. The plain-writing skill (archived source 003) shaped only the new navigation, index, and audit prose; it did not alter the captured report or copied definitions.

### Original-content moves


All five source moves used `_scripts/move_text.py --apply`. They were applied in descending source-line order, so these inclusive ranges still refer to the complete pre-split report. The script also inserted the separately prepared navigation and citation blocks. One additional blank line separates the unchanged landscape prefix from its new navigation block.

| Source lines | Destination | Placement | Source lines moved | Bytes | SHA-256 of moved block |
|---|---|---|---:|---:|---|
| 245 to 289 | [Augmentation literature and reading path]({{< ref "ai/design-research/02-human-ai-collaboration/04-augmentation-literature-and-reading-path" >}}) | At end | 45 | 3281 | `bd2c3847b5ac63be65b1a47e2e64031aba8f8f2bf1a838abab0e58a415895cac` |
| 196 to 244 | [Shared-runtime landscape]({{< ref "ai/design-research/06-research-reports/03-shared-runtime-landscape" >}}) | At end | 49 | 13723 | `e762600b31c034a84131e94a99a97acc3ab1e077efa2a0b0a6b34379c0148026` |
| 133 to 195 | [Trusted effect boundaries]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}) | At end | 63 | 8918 | `46dce8f090c0f5989505041ab2a80ed65ef61c1bb388c4789daadaff40a05fb9` |
| 80 to 132 | [Shared-runtime landscape]({{< ref "ai/design-research/06-research-reports/03-shared-runtime-landscape" >}}) | Before `## Comparative source matrix` | 53 | 8385 | `65bf10f153261541eab54b4164006446f3214276e6aaf20a74126a1302cdb696` |
| 43 to 79 | [Augmentation literature and reading path]({{< ref "ai/design-research/02-human-ai-collaboration/04-augmentation-literature-and-reading-path" >}}) | Before `## Timeline of selected influential works` | 37 | 9383 | `5ee6a5c207ef413944b4d4dfc54593ddb3b8b9f1c200c95b31ff85ae19892e5c` |

### Preexisting receiving text


The complete preexisting prefixes of both receiving notes remain at their former line positions and match their pre-split bytes exactly. No earlier mapping ranges shifted.

| Note | Previous and current lines | Lines | Bytes | SHA-256 |
|---|---|---:|---:|---|
| [Augmentation literature and reading path]({{< ref "ai/design-research/02-human-ai-collaboration/04-augmentation-literature-and-reading-path" >}}) | 1 to 110 | 110 | 12883 | `1986d40e476134477a4bc3c216edd32c0e0d0a018a87a05a53669ded4a3b2eeb` |
| [Shared-runtime landscape]({{< ref "ai/design-research/06-research-reports/03-shared-runtime-landscape" >}}) | 1 to 36 | 36 | 8115 | `723f35c8c1e15dd1d9ca8e53766561e27ac863674fbc3294507ec798f3c6cdcb` |

### Current source mapping


These ranges cover all 606 original report lines exactly once. Reading the current ranges in original-line order reconstructs the complete report byte for byte. Added navigation and citation copies are excluded from that reconstruction.

| Original lines | Current note | Current lines | Source lines | Bytes | SHA-256 |
|---|---|---|---:|---:|---|
| 1 to 42 | [Programmable human-AI environments report]({{< ref "ai/design-research/02-human-ai-collaboration/03-programmable-human-ai-environments-report" >}}) | 1 to 42 | 42 | 5626 | `71f07ef743ffe1d1aab6fa39862d7080f9bcae49796e3acef7eca3e9ae95448f` |
| 43 to 79 | [Augmentation literature and reading path]({{< ref "ai/design-research/02-human-ai-collaboration/04-augmentation-literature-and-reading-path" >}}) | 117 to 153 | 37 | 9383 | `5ee6a5c207ef413944b4d4dfc54593ddb3b8b9f1c200c95b31ff85ae19892e5c` |
| 80 to 132 | [Shared-runtime landscape]({{< ref "ai/design-research/06-research-reports/03-shared-runtime-landscape" >}}) | 44 to 96 | 53 | 8385 | `65bf10f153261541eab54b4164006446f3214276e6aaf20a74126a1302cdb696` |
| 133 to 195 | [Trusted effect boundaries]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}) | 7 to 69 | 63 | 8918 | `46dce8f090c0f5989505041ab2a80ed65ef61c1bb388c4789daadaff40a05fb9` |
| 196 to 244 | [Shared-runtime landscape]({{< ref "ai/design-research/06-research-reports/03-shared-runtime-landscape" >}}) | 101 to 149 | 49 | 13723 | `e762600b31c034a84131e94a99a97acc3ab1e077efa2a0b0a6b34379c0148026` |
| 245 to 289 | [Augmentation literature and reading path]({{< ref "ai/design-research/02-human-ai-collaboration/04-augmentation-literature-and-reading-path" >}}) | 158 to 202 | 45 | 3281 | `bd2c3847b5ac63be65b1a47e2e64031aba8f8f2bf1a838abab0e58a415895cac` |
| 290 to 606 | [Programmable human-AI environments report]({{< ref "ai/design-research/02-human-ai-collaboration/03-programmable-human-ai-environments-report" >}}) | 49 to 365 | 317 | 28366 | `bee841d47e0d3e9906cc58fcd81a304be8526c2a2629f7d97873f3d00b1219e6` |

The reconstructed report has 77,682 bytes and SHA-256 `5db18ba69d758e99c8715bb30e93829bdca2b766b35a26b76feba8727c05bc26`. It matches both the complete pre-split file and the historical original.

### Added navigation and local citation definitions


The six navigation blocks and three local citation blocks add 267 logical lines and 29535 bytes. The blocks are new text and are not part of the original source reconstruction. Each citation block includes its heading, context, blank lines, and verbatim copies of the needed original definitions.

| Added block | Current note | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---:|---:|---|
| `report-navigation` | [Programmable human-AI environments report]({{< ref "ai/design-research/02-human-ai-collaboration/03-programmable-human-ai-environments-report" >}}) | 43 to 48 | 6 | 636 | `8f40ee1315c05bcf9b418ac3fd2ab12dc21cb0a38f91fb6efb9cd40acc971754` |
| `history-context` | [Augmentation literature and reading path]({{< ref "ai/design-research/02-human-ai-collaboration/04-augmentation-literature-and-reading-path" >}}) | 111 to 116 | 6 | 629 | `41a8c1fd120df353ec955d730258fc4bf574379f07d023d0489b7d557a6601f0` |
| `history-transition` | [Augmentation literature and reading path]({{< ref "ai/design-research/02-human-ai-collaboration/04-augmentation-literature-and-reading-path" >}}) | 154 to 157 | 4 | 509 | `c068db9b37c8481458a6a0f36a800b05435bb64182ea7158d69172b873def20f` |
| `history-citations` | [Augmentation literature and reading path]({{< ref "ai/design-research/02-human-ai-collaboration/04-augmentation-literature-and-reading-path" >}}) | 203 to 284 | 82 | 8950 | `b52d452cd439ef17a42d42bcf24a58972ffddbe5ec69958f0dd892ba9e20db53` |
| `landscape-context` | [Shared-runtime landscape]({{< ref "ai/design-research/06-research-reports/03-shared-runtime-landscape" >}}) | 37 to 43 | 7 | 560 | `6d9fef407324ad1c09773efd93dd467b01a424820d37cfc6150b06dc3f61c7bf` |
| `landscape-transition` | [Shared-runtime landscape]({{< ref "ai/design-research/06-research-reports/03-shared-runtime-landscape" >}}) | 97 to 100 | 4 | 536 | `545778eb364c563e5cba0256435b75f85b2b80e505a2759dd650ac44fa864c3c` |
| `landscape-citations` | [Shared-runtime landscape]({{< ref "ai/design-research/06-research-reports/03-shared-runtime-landscape" >}}) | 150 to 247 | 98 | 10821 | `8c502512001ed61a58fa5595ef6a8fcd65ad51a449854d38ae55fc313bb3bcc3` |
| `trusted-context` | [Trusted effect boundaries]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}) | 1 to 6 | 6 | 728 | `cea686893f38104331c3b79d09dfa61cd7047e2d1fa6d4feccbb64a80854ee8a` |
| `trusted-citations` | [Trusted effect boundaries]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}) | 70 to 123 | 54 | 6166 | `55e7d15ac9ae204ac1e78a4bfaf5ab8aa2cf8fae70caaaa43cf7329c3d0bc4ee` |

The report retains all 60 original definitions. The receiving notes add 38, 46, and 24 local copies, respectively, for 108 copied definitions in total. Every copy matches its original definition exactly. No original definition was moved out of the report. All used footnotes resolve locally, with no duplicate definition IDs in any affected note.

| Note | Used footnote IDs | Local definitions | Missing definitions | Duplicate IDs |
|---|---:|---:|---:|---:|
| [Programmable human-AI environments report]({{< ref "ai/design-research/02-human-ai-collaboration/03-programmable-human-ai-environments-report" >}}) | 33 | 60 | 0 | 0 |
| [Augmentation literature and reading path]({{< ref "ai/design-research/02-human-ai-collaboration/04-augmentation-literature-and-reading-path" >}}) | 38 | 38 | 0 | 0 |
| [Shared-runtime landscape]({{< ref "ai/design-research/06-research-reports/03-shared-runtime-landscape" >}}) | 46 | 46 | 0 | 0 |
| [Trusted effect boundaries]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}) | 24 | 24 | 0 | 0 |

### Whole-note checksums after the split


The four affected notes contain 128,215 bytes in total: 77,682 original report bytes, 20,998 preserved receiving-note bytes, and 29,535 added navigation and citation bytes. All four notes retain their final newlines.

| Note | Logical lines | Bytes | SHA-256 |
|---|---:|---:|---|
| [Programmable human-AI environments report]({{< ref "ai/design-research/02-human-ai-collaboration/03-programmable-human-ai-environments-report" >}}) | 365 | 34628 | `8e9505097ac7cb10d508fb95df604dc8e7e19dcafb7ce9d7fa2c7093b7e0f836` |
| [Augmentation literature and reading path]({{< ref "ai/design-research/02-human-ai-collaboration/04-augmentation-literature-and-reading-path" >}}) | 284 | 35635 | `e0a33370efbc0664dff66726ca6df93e0aaedb7fd5fd7bd8d87e0a59c421634a` |
| [Shared-runtime landscape]({{< ref "ai/design-research/06-research-reports/03-shared-runtime-landscape" >}}) | 247 | 42140 | `49d6fdba988d0182ba77396d188c24176130d273d0d397d4381d21b67a7f4f3b` |
| [Trusted effect boundaries]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}) | 123 | 15812 | `61cd0d279605dbf415c9f886ab7a6edcc07c9a51a7a10898949a31e196b9bb11` |

### Reconstruction checks for earlier originals


The 13 previously mapped originals also reconstruct exactly from their current note ranges. Together with this report, 14 originals were checked. Their earlier mapping positions did not change in this split. The two behavioural-specification originals use the pre-split HEAD revision `[repository fingerprint omitted]`; the other originals use historical revision `[repository fingerprint omitted]`.

| Original document | Logical lines | Bytes | SHA-256 | Reconstruction |
|---|---:|---:|---|---|
| `architecture-generalization.md` | 926 | 20143 | `80046e60ad993e2b27b1b1b834242ea59085900ea735b3ddea417ec42ad2b2a0` | Exact |
| `research-direction.md` | 690 | 25260 | `376a1bc4b3b1788eedbd15815bb8176e5ed23bfe0421c5356b2993c3ea54b66c` | Exact |
| `investigation-lang-alg.md` | 990 | 25461 | `b7f56872d4c2c814541c5fdcba69a6482cee108381ffed9a1e05f5698801bdee` | Exact |
| `investigation-lang-alg-llm-layer.md` | 700 | 11811 | `2b5b352b5b805c76c49fdc38b07201cf02d6a7bf823165a5f3cba248142f7f6c` | Exact |
| `dsl-approach/dsl-for-rag.md` | 858 | 14726 | `a71594404daf21b5b412db7bfde65750cf941716df0ba44a41e5bebea4b1d2df` | Exact |
| `dsl-approach/db-approach.md` | 681 | 20298 | `8b511dde793b8cb4498dcba003b118c659007c0eeed0035355071be853f8b97a` | Exact |
| `dsl-approach/deep-research-report-formatted.md` | 727 | 65976 | `984fe69cd243e6be69a379200dcb7ce7f03ceb6e8502f9ebae942469438311d8` | Exact |
| `dsl-approach/typed-durable-inspectable-runtimes-report.md` | 518 | 69287 | `e1eb14184dc8a7874f8bfc0f54bf6393eaf5b2b3eea2df0c2f9f8a4934ccfaa7` | Exact |
| `behavioural-specification.md` | 742 | 24801 | `80833b7d13c9cf4a4a5190f24646e3e24d63596102d9a52b52a012efac1e413c` | Exact |
| `behavioural-specification-2.md` | 1292 | 43309 | `a0024010e5572594e1f5c98a11fe0e90a35848ba7c8f0c7cec622c1124048a6c` | Exact |
| `creator-approach.md` | 1139 | 47474 | `e3f08362c6bfc57032cc9c52e9c5787f5402ce3da0b16d4202a9ed4a751a7127` | Exact |
| `dsl-approach/constrained-generativity-semantic-substrate-design.md` | 1766 | 71631 | `ed38e513fd8fa91770012d790bce1a31a78d0e69430ec16696c0774f44d3fc81` | Exact |
| `dsl-approach/problem-framing.md` | 354 | 21976 | `b62b59c763e643ac00223648e80a40d02d3d67d0dd4d24772ca00b5cad721cf6` | Exact |
| `programmable-environments-human-ai-collaboration.md` | 606 | 77682 | `5db18ba69d758e99c8715bb30e93829bdca2b766b35a26b76feba8727c05bc26` | Exact |

### Navigation and workspace checks


All 75 internal Markdown links in the four affected notes and collection index resolve, including heading anchors. The index has 60 internal links after adding the trusted effect note. All fenced code blocks in the four affected notes close. Whole-file whitespace checks report no warnings for the four notes. The tracked diff still has only the two earlier blank-line-at-EOF warnings in `05-runtime-and-execution/01-generalized-agent-runtime.md` at line 1064 and `06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md` at line 376; their bytes were preserved.

The collection index adds the trusted effect note and updates the report, augmentation literature, and shared-runtime landscape descriptions. Its post-split SHA-256 is `2e10a5b8a9d7a3415d6d69fd87c4ab6e3fcf8944ad8747f549c05ffc616e096f`. The earlier 177,323 reassembly-log bytes are preserved; their SHA-256 is `bfe1346e4981d1268a8e26d894e03cf9369cc39dc8030131f655b609e92fc332`. The move script is unchanged, with SHA-256 `402ff2e48ddf908900a296236ec9758b27f72d39d4bac28511359f860efe17d5`. The 66 unrelated files in the two note directories, all redirects, and all existing file permission bits are unchanged. Exactly one new note was added, and no existing file was removed.

Git index bytes, staged entries, and HEAD remained unchanged. Existing staged and unstaged work was preserved. No staging or commits were performed. The captured references were preserved and checked for local completeness, not fact-checked or updated.

Earlier stage tables describe historical states. The source mapping, preserved-prefix, navigation, citation, and whole-note tables above record the current programmable human-AI environments report split.

## Twenty-fifth-stage split: captured DSL reliability article


The approved split was applied on 2026-09-30 to [DSL reliability]({{< ref "ai/design-research/03-language-and-compiler/01-dsl-reliability" >}}), originally assembled from `architecture-dsl-like/dsl-approach/DSLs Enable Reliable Use of LLMs.md`. The source is a captured article, not a user and LLM dialogue. Before the split, the article contained 300 logical lines and 26,812 bytes, with no final newline. Its SHA-256 was `47f7dc284fa764905fdb01938c4c36a93db63bc8f69ec8c0b8bdcf1b0d5e3772`. Its bytes matched the historical original at `[repository fingerprint omitted]`.

The split uses existing notes only. The reliability note retains 83 source lines, including the original metadata, reliability argument and caveats, and complete presentation example. The builder method note receives 28 lines on iterative design and the two phases of LLM involvement. The semantic kernel note receives the complete 76-line Tickloom model and quorum-store example. The compiler note receives the complete 110-line scenario DSL case study. The declarative programming note receives the article's complete three-line source-of-truth section.

Each prompt, code example, source link, and explanation stays with its section. The presentation example retains both PlantUML and YAML. The Tickloom test case study retains the imperative test, matching DSL test, scenario representation, grammar discussion, and complete generated read scenario. The article's qualifications about training familiarity, novel DSLs, smaller models, language size, and design and maintenance costs remain unchanged. Compilation and domain correctness remain distinct in the new navigation and the earlier compiler discussion.

The original source metadata, prose, code, whitespace, and missing final newline were preserved. Article attribution separates the imported passages from the existing reports and dialogues. All new navigation is marked. The plain-writing skill (archived source 003) shaped only the new navigation, index, and audit prose.

### Original-content moves


All five moves used `_scripts/move_text.py --apply`, in descending original-line order. The inclusive ranges below refer to the complete pre-split article. Every move was checked against the expected byte splice immediately after execution.

| Original lines | Destination | Placement | Lines | Bytes | SHA-256 of moved block |
|---|---|---|---:|---:|---|
| 298 to 300 | [Declarative programming model]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model" >}}) | At end | 3 | 917 | `313150b287857619d9e7abbb1b4ed1c2c3311f0d926e65f60f05b33589c176e4` |
| 290 to 297 | [Semantic substrate builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | Before the earlier citation block, previously at line 338 | 8 | 1840 | `a201865838b0da4eeb3f54c2054a010cce50e65daa76cfe810613eab6e81d645` |
| 180 to 289 | [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | At end | 110 | 7514 | `c6b71a56f83355357da7190fd7c1ffdc0621f3b3b842ad510196c89fa2768f8b` |
| 104 to 179 | [Semantic kernel]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | Before `### One further design choice I'd make` | 76 | 6756 | `d8b6470568ac0a294ef02dbe97ef81b4aaebd5a111c1706ce99d74529b1ca285` |
| 7 to 26 | [Semantic substrate builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | Before `## Two phases working with LLMs` | 20 | 3529 | `edabdf839fe471527c01352e5cb5816665face5074a62bae33ade5bf31e8a5e5` |

The kernel import was inserted before the complete closing implementation roadmap. Its original final paragraph and missing final newline remain at the end of the note. The article's final paragraph was appended to the declarative programming note without adding a newline. All context for that closing article section was inserted before it.

### Current article mapping


The ranges below cover all 300 original article lines exactly once. Reading the current ranges in original-line order reconstructs the article byte for byte, excluding new navigation.

| Original lines | Current note | Current lines | Source lines | Bytes | SHA-256 |
|---|---|---|---:|---:|---|
| 1 to 6 | [DSL reliability]({{< ref "ai/design-research/03-language-and-compiler/01-dsl-reliability" >}}) | 1 to 6 | 6 | 177 | `e659e69cf777ea607c4e4d97c4c4747a81fb10a8cb96718b102966ea6bced8b9` |
| 7 to 26 | [Semantic substrate builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | 344 to 363 | 20 | 3529 | `edabdf839fe471527c01352e5cb5816665face5074a62bae33ade5bf31e8a5e5` |
| 27 to 103 | [DSL reliability]({{< ref "ai/design-research/03-language-and-compiler/01-dsl-reliability" >}}) | 14 to 90 | 77 | 6079 | `0fe3515f68415a5359deb985f5c025bf9d13e397cb4d125bb3700c19d3629adc` |
| 104 to 179 | [Semantic kernel]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 381 to 456 | 76 | 6756 | `d8b6470568ac0a294ef02dbe97ef81b4aaebd5a111c1706ce99d74529b1ca285` |
| 180 to 289 | [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1109 to 1218 | 110 | 7514 | `c6b71a56f83355357da7190fd7c1ffdc0621f3b3b842ad510196c89fa2768f8b` |
| 290 to 297 | [Semantic substrate builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | 368 to 375 | 8 | 1840 | `a201865838b0da4eeb3f54c2054a010cce50e65daa76cfe810613eab6e81d645` |
| 298 to 300 | [Declarative programming model]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model" >}}) | 387 to 389 | 3 | 917 | `313150b287857619d9e7abbb1b4ed1c2c3311f0d926e65f60f05b33589c176e4` |

The reconstructed article contains 26,812 bytes and has SHA-256 `47f7dc284fa764905fdb01938c4c36a93db63bc8f69ec8c0b8bdcf1b0d5e3772`. It matches the complete pre-split file and historical original, including the absent final newline.

### Preserved receiving notes


All preexisting receiving-note bytes reconstruct exactly after excluding the imported article and new navigation. The four receiving notes contained 60,502 bytes before the split.

| Receiving note | Previous logical lines | Preserved bytes | Pre-split SHA-256 | Previous final newline |
|---|---:|---:|---|---|
| [Semantic substrate builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | 368 | 15072 | `a4afe960465e1eb026ae0b9128432ea5f0eb4e3afb1e9fe26877202df2455a86` | Present |
| [Semantic kernel]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 428 | 8438 | `b5eadcb49c584ed3de9f5f6bbb7be528588078e7b8a6664d8ececbbfdbae1b93` | Absent |
| [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1102 | 28963 | `506058cedb6a8eb2e4f96049da24725f67923ebd8c1804ab1e809ec32ee35086` | Present |
| [Declarative programming model]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model" >}}) | 379 | 8029 | `a7c25a891230c4a6b8853e8f7bec0875d20419146e5a00f08a110ed9d5e271f6` | Present |

The current ranges for all preserved receiving text are recorded below. The builder note's earlier citation block moved from lines 338 to 368 to lines 380 to 410. Its copied definitions and previous navigation remain unchanged. The kernel roadmap moved from lines 375 to 428 to lines 463 to 516. The other preexisting prefixes retain their line positions.

| Receiving note | Previous lines | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---:|---:|---|
| [Semantic substrate builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | 1 to 337 | 1 to 337 | 337 | 13164 | `998d946ebaf8f774525c82fa4edefde1e679c1564254e98eda5a25fc87d2e832` |
| [Semantic substrate builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | 338 to 368 | 380 to 410 | 31 | 1908 | `be1d086c153a0c6393e7c18bb134aa94eb227165c4c918df1620c28325738586` |
| [Semantic kernel]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 1 to 374 | 1 to 374 | 374 | 7217 | `2782cbaac80ef6ba0134c2f25d208191f80daf06c6e5af372e8f15f7519945d9` |
| [Semantic kernel]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 375 to 428 | 463 to 516 | 54 | 1221 | `679ca7103f5d1a1d4d38ee95c61a813162eb68d4b6ae685d6116ad653aa1a4f5` |
| [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1 to 1102 | 1 to 1102 | 1102 | 28963 | `506058cedb6a8eb2e4f96049da24725f67923ebd8c1804ab1e809ec32ee35086` |
| [Declarative programming model]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model" >}}) | 1 to 379 | 1 to 379 | 379 | 8029 | `a7c25a891230c4a6b8853e8f7bec0875d20419146e5a00f08a110ed9d5e271f6` |

### Added navigation


The ten added navigation blocks contain 54 logical lines and 5,144 bytes. Their headings and links identify the source article and connect its separated sections. The return heading in the kernel note distinguishes the article from the original implementation roadmap. The earlier builder citation block is explicitly identified as belonging to the semantic substrate report excerpts.

| Added block | Note | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---:|---:|---|
| `reliability-context` | [DSL reliability]({{< ref "ai/design-research/03-language-and-compiler/01-dsl-reliability" >}}) | 7 to 13 | 7 | 523 | `cdf172ab4760432868a2ae1bd751386e5625e3d055d075a7d3168fccad29f534` |
| `reliability-continuation` | [DSL reliability]({{< ref "ai/design-research/03-language-and-compiler/01-dsl-reliability" >}}) | 91 to 95 | 5 | 681 | `c1973a5e608d49373bc4336ef41f08bef138f9ecb25c42bc3e1d5faa1bfabe8b` |
| `builder-article-context` | [Semantic substrate builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | 338 to 343 | 6 | 466 | `04f58cc7edad10db6c25263cce2c9d1ccd3267c18ad817102b47989aa181531e` |
| `builder-article-transition` | [Semantic substrate builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | 364 to 367 | 4 | 589 | `93225412cc015baba2bb132d99bae3c3ce21f76815d651009eae0fb447266f07` |
| `builder-article-continuation` | [Semantic substrate builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | 376 to 379 | 4 | 370 | `7b17f6b713b3ae5a934f1babf4f2a49fe1f80765a6055773c4238b7b2718c470` |
| `kernel-article-context` | [Semantic kernel]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 375 to 380 | 6 | 557 | `d1fd430027b147844fa143ae4136646f9fa53c148f93f61b7c8b6104066b97e7` |
| `kernel-dialogue-return` | [Semantic kernel]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 457 to 462 | 6 | 356 | `cce49ca837a95404c044eecf1dfc7d520f061c85f5d500c402128682b17972ab` |
| `compiler-article-context` | [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1103 to 1108 | 6 | 667 | `ff550935b87f3f28906e7c51124f5cf9821546a9c97eb116c73e067b1d0c02c0` |
| `compiler-article-continuation` | [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1219 to 1221 | 3 | 400 | `ad156fa9801333bda59b076f7404c0e8cdaa2e7b1e894dd386076c5f41882950` |
| `declarative-article-context` | [Declarative programming model]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model" >}}) | 380 to 386 | 7 | 535 | `482bcdd814545b1839ae0120911dd85aff0d727590393f0cc3194369131d487a` |

The article has no footnote definitions, and no citation definitions were added. Its original inline external links and pinned GitHub source links moved with their sections. The builder note retains all 13 earlier footnote definitions, with no missing or duplicate IDs. The other affected notes have no footnote references or definitions.

### Complete code examples


All six original fenced examples remain contiguous and unchanged. No new navigation was inserted inside a code block.

| Original fenced lines | Current note | Current fenced lines | Bytes | Verification |
|---|---|---|---:|---|
| 45 to 84 | [DSL reliability]({{< ref "ai/design-research/03-language-and-compiler/01-dsl-reliability" >}}) | 32 to 71 | 522 | Exact |
| 92 to 96 | [DSL reliability]({{< ref "ai/design-research/03-language-and-compiler/01-dsl-reliability" >}}) | 79 to 83 | 79 | Exact |
| 122 to 168 | [Semantic kernel]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 399 to 445 | 2133 | Exact |
| 184 to 215 | [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1113 to 1144 | 1276 | Exact |
| 223 to 239 | [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1152 to 1168 | 781 | Exact |
| 251 to 284 | [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1180 to 1213 | 1818 | Exact |

### Earlier originals and changed positions


The 14 originals checked during the preceding split still reconstruct exactly. The earlier semantic-kernel, language-choice, and declarative-programming originals were also reconstructed from their current ranges. Together with the article, 18 originals were checked. The only earlier source range shifted by this split is semantic-kernel lines 565 to 618, now at kernel-note lines 463 to 516. No earlier source bytes changed.

The current full mapping for `semantic-kernel.md` follows. The ranges were checked against the historical original and locate all its source bytes.

| Original lines | Current note | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---:|---:|---|
| 1 to 185 | [Semantic kernel]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 1 to 185 | 185 | 3658 | `198dfe1b6b7711d1383406859dede7f0341a8383e33cfe04fa30f49adad682c4` |
| 186 to 448 | [Program authoring and typed planning]({{< ref "ai/design-research/03-language-and-compiler/10-program-authoring-and-typed-planning" >}}) | 1 to 263 | 263 | 4206 | `9ad9cbab5be507bd8f5f3f49b8bfadd6df4d8ad5c5462148a02c03aeb1576e3b` |
| 449 to 471 | [Language and formalism choices]({{< ref "ai/design-research/03-language-and-compiler/06-language-and-formalism-choices" >}}) | 308 to 330 | 23 | 896 | `9c228b0687f5b170eeeed4618d8ce3f85ded6fe16f7b330fc7b5dc194d71f074` |
| 472 to 520 | [Semantic kernel]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 326 to 374 | 49 | 838 | `83c3ca7d345f26fece9340ccbefc09b9ed626b7b018965c99ac3ddccae49638f` |
| 521 to 564 | [Generalized agent runtime]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) | 505 to 548 | 44 | 622 | `6c223c326249660cf1b051d5008b76d8abb592fd30b068a59d482043de381eb5` |
| 565 to 618 | [Semantic kernel]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 463 to 516 | 54 | 1221 | `679ca7103f5d1a1d4d38ee95c61a813162eb68d4b6ae685d6116ad653aa1a4f5` |

The current full mapping for `dsl-approach/languages.md` follows. The ranges were checked against the historical original and locate all its source bytes.

| Original lines | Current note | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---:|---:|---|
| 1 to 307 | [Language and formalism choices]({{< ref "ai/design-research/03-language-and-compiler/06-language-and-formalism-choices" >}}) | 1 to 307 | 307 | 8544 | `78fe1fa9270c80da91fe34a6c975801012c9ccb22efa7cb5a3a785bc6bd3856e` |
| 308 to 331 | [Language and formalism choices]({{< ref "ai/design-research/03-language-and-compiler/06-language-and-formalism-choices" >}}) | 331 to 354 | 24 | 793 | `b4dd678c7387a3c737d91fa4ba1cabf55e698de6745a693263d938abdf79ec84` |
| 332 to 499 | [Language and formalism choices]({{< ref "ai/design-research/03-language-and-compiler/06-language-and-formalism-choices" >}}) | 397 to 564 | 168 | 6132 | `5cd52364132f1a71a213cab6e4674a003f0c9413d593b78e2fd66588b9167dff` |
| 500 to 535 | [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 473 to 508 | 36 | 1165 | `c106db86d1b6bf8d1463fd68169975fd6cdf6901c93f6990407fce1f0437b712` |
| 536 to 596 | [Language and formalism choices]({{< ref "ai/design-research/03-language-and-compiler/06-language-and-formalism-choices" >}}) | 605 to 665 | 61 | 2316 | `94a3dddf031bf526122a2e7f0606ffccf0a1348a3db17896c8e1dae6ba6b8725` |
| 597 to 736 | [Semantic kernel]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 186 to 325 | 140 | 2721 | `f3c846c18ec824fb92ae93514b699f28af5b57fcfc7e930476bf17c235dda98b` |
| 737 to 759 | [Language and formalism choices]({{< ref "ai/design-research/03-language-and-compiler/06-language-and-formalism-choices" >}}) | 666 to 688 | 23 | 1232 | `e647b47f0b572c8dfa251fb0d7d4742f8afc6c228b82783835a14508b4a2f70e` |

The current full mapping for `dsl-approach/declarative-approach.md` follows. The ranges were checked against the historical original and locate all its source bytes.

| Original lines | Current note | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---:|---:|---|
| 1 to 167 | [Declarative programming model]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model" >}}) | 1 to 167 | 167 | 3825 | `4819e5576118485017924365ae3a3e9f62f8581d03921f250d1837dc62f18014` |
| 168 to 277 | [Declarative programming model]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model" >}}) | 211 to 320 | 110 | 1954 | `620822ec27a94a5c381cb321b310bd0e797c33f926d36dca816a59137d8cdd9f` |
| 278 to 319 | [Language and formalism choices]({{< ref "ai/design-research/03-language-and-compiler/06-language-and-formalism-choices" >}}) | 355 to 396 | 42 | 1017 | `ab6c92e0a26ef35b945d3946282756e986810b47e7a2e38ba8714be7a252212e` |
| 320 to 378 | [Declarative programming model]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model" >}}) | 321 to 379 | 59 | 1280 | `f29318555f8092214c9b60d75b43d013f3dfee6dfac99dba4e4322f56c4cbb4a` |
| 379 to 482 | [DSL and formal-methods reading path]({{< ref "ai/design-research/03-language-and-compiler/09-dsl-and-formal-methods-reading-path" >}}) | 88 to 191 | 104 | 11198 | `0881ef25a1e91a2e66913210d8d08b8d520e4058ffcd17d772281cf0c2f46e7a` |

The following whole-original checks passed. The behavioural-specification originals were compared with pre-split HEAD `[repository fingerprint omitted]`. The remaining originals were compared with historical revision `[repository fingerprint omitted]`.

| Original document | Logical lines | Bytes | SHA-256 | Reconstruction |
|---|---:|---:|---|---|
| `architecture-generalization.md` | 926 | 20143 | `80046e60ad993e2b27b1b1b834242ea59085900ea735b3ddea417ec42ad2b2a0` | Exact |
| `research-direction.md` | 690 | 25260 | `376a1bc4b3b1788eedbd15815bb8176e5ed23bfe0421c5356b2993c3ea54b66c` | Exact |
| `investigation-lang-alg.md` | 990 | 25461 | `b7f56872d4c2c814541c5fdcba69a6482cee108381ffed9a1e05f5698801bdee` | Exact |
| `investigation-lang-alg-llm-layer.md` | 700 | 11811 | `2b5b352b5b805c76c49fdc38b07201cf02d6a7bf823165a5f3cba248142f7f6c` | Exact |
| `dsl-approach/dsl-for-rag.md` | 858 | 14726 | `a71594404daf21b5b412db7bfde65750cf941716df0ba44a41e5bebea4b1d2df` | Exact |
| `dsl-approach/db-approach.md` | 681 | 20298 | `8b511dde793b8cb4498dcba003b118c659007c0eeed0035355071be853f8b97a` | Exact |
| `dsl-approach/deep-research-report-formatted.md` | 727 | 65976 | `984fe69cd243e6be69a379200dcb7ce7f03ceb6e8502f9ebae942469438311d8` | Exact |
| `dsl-approach/typed-durable-inspectable-runtimes-report.md` | 518 | 69287 | `e1eb14184dc8a7874f8bfc0f54bf6393eaf5b2b3eea2df0c2f9f8a4934ccfaa7` | Exact |
| `behavioural-specification.md` | 742 | 24801 | `80833b7d13c9cf4a4a5190f24646e3e24d63596102d9a52b52a012efac1e413c` | Exact |
| `behavioural-specification-2.md` | 1292 | 43309 | `a0024010e5572594e1f5c98a11fe0e90a35848ba7c8f0c7cec622c1124048a6c` | Exact |
| `creator-approach.md` | 1139 | 47474 | `e3f08362c6bfc57032cc9c52e9c5787f5402ce3da0b16d4202a9ed4a751a7127` | Exact |
| `dsl-approach/constrained-generativity-semantic-substrate-design.md` | 1766 | 71631 | `ed38e513fd8fa91770012d790bce1a31a78d0e69430ec16696c0774f44d3fc81` | Exact |
| `dsl-approach/problem-framing.md` | 354 | 21976 | `b62b59c763e643ac00223648e80a40d02d3d67d0dd4d24772ca00b5cad721cf6` | Exact |
| `programmable-environments-human-ai-collaboration.md` | 606 | 77682 | `5db18ba69d758e99c8715bb30e93829bdca2b766b35a26b76feba8727c05bc26` | Exact |
| `semantic-kernel.md` | 618 | 11441 | `51844f36adc939b917ddec8cd1e66e06fcb141dea520032fe652ec9d0eeb9769` | Exact |
| `dsl-approach/languages.md` | 759 | 22903 | `7452669c8c579e6d0d56eea276cd6197e4d4d3635aad7dc50b0c3484d2a91fd2` | Exact |
| `dsl-approach/declarative-approach.md` | 482 | 19274 | `b6d7c959ccffc4a09ceb4ec7c4d14f971093e34f0556a3bfbeee901ac78cadb2` | Exact |
| `dsl-approach/DSLs Enable Reliable Use of LLMs.md` | 300 | 26812 | `47f7dc284fa764905fdb01938c4c36a93db63bc8f69ec8c0b8bdcf1b0d5e3772` | Exact |

### Whole-note checksums after the split


The five affected notes contain 92,458 bytes in total, consisting of 26,812 article bytes, 60,502 preserved receiving-note bytes, and 5,144 navigation bytes.

| Note | Logical lines | Bytes | SHA-256 | Final newline |
|---|---:|---:|---|---|
| [DSL reliability]({{< ref "ai/design-research/03-language-and-compiler/01-dsl-reliability" >}}) | 95 | 7460 | `ac984be1986b08c8f6609aae7e94017892626ad7450b269a55d9a9199bee9a6e` | Present |
| [Semantic substrate builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | 410 | 21866 | `09948342d33e351a423250472318d63a8e7f1917e8940866d2d3d205b72bd13a` | Present |
| [Semantic kernel]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 516 | 16107 | `2445ea460d7f7dbe165d059610daa23e654af52327bc8ebbaec05dfa017af5a0` | Absent |
| [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1221 | 37544 | `afbfe68359602e86f99406d6e35154fd10f4c936a8ead7e0736487883c52451a` | Present |
| [Declarative programming model]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model" >}}) | 389 | 9481 | `1c1642f545e1f5fca2af4b30d5d058fc76bf92a470e1075835778663c9fe0f54` | Absent |

### Links, whitespace, and workspace checks


All 88 internal Markdown links in the five affected notes and collection index resolve, including heading anchors. The index still has 60 internal links. All fenced code blocks in the five affected notes close. The original front matter remains at the start of the reliability note.

The new navigation introduces no whitespace warnings. Git reports five trailing-space lines from original article code that moved to new files. Those spaces are preserved, not newly written. Their current and original positions are recorded below.

| Current note | Current line | Original article line | Warning |
|---|---:|---:|---|
| [Semantic kernel]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 421 | 144 | Preserved trailing spaces |
| [Semantic kernel]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 422 | 145 | Preserved trailing spaces |
| [Semantic kernel]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 439 | 162 | Preserved trailing spaces |
| [Semantic kernel]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 440 | 163 | Preserved trailing spaces |
| [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1153 | 224 | Preserved trailing spaces |

The two earlier blank-line-at-EOF warnings remain at generalized-runtime-note line 1064 and evaluation-note line 376. Their original separator bytes were not changed. The three other affected notes pass whole-file whitespace checks.

The collection index updates the five affected note descriptions, with no added or removed note entries. Its post-split SHA-256 is `c48a159800e42ebc6f800e33f5274f0df6b8c6b35fed793421dfbde6e32181b4`. The earlier 192,145 reassembly-log bytes are preserved, with SHA-256 `ac2602c63a035ab46fe7f80776314fa53b52b89c888737a4928515dbdce27fdd`. The move script remains unchanged, with SHA-256 `402ff2e48ddf908900a296236ec9758b27f72d39d4bac28511359f860efe17d5`. All 65 unrelated files in the two note directories, all redirects, and all existing permission bits are unchanged. No note was created or removed.

Git index bytes, staged entries, and HEAD remained unchanged. Existing staged and unstaged work was preserved. No staging or commits were performed. The captured article's external claims and links were retained without fact-checking or updating them.

Earlier stage tables describe historical states. The article, preserved-destination, navigation, code-example, and earlier-source mappings above record the current DSL reliability split.

## Twenty-sixth-stage split: Stonebraker interview transcript


Date: 2026-09-30. This split was approved after the complete interview had been read and its destinations discussed. The captured source is an external interview with CL Kao and Michael Stonebraker, not a user-LLM dialogue.

The original path is `ai/architecture-dsl-like/Data Renegades  Ep. 11, Contrarian Bets and AI Skepticism with Michael Stonebraker.md`. Before this split, its complete payload was in [Stonebraker interview source]({{< ref "ai/design-research/07-sources/01-stonebraker-data-renegades-transcript" >}}). It contained 399 logical lines and 37,930 bytes, with SHA-256 `d48ca91722c7512229813f8f771ca93e973eba2a5751fdf0344604764f0b42b3`. It matches historical revision `[repository fingerprint omitted]` exactly and has no final newline.

Speaker labels, questions, answers, quoted pullouts, qualifications, repeated wording, transcription errors, blank lines, and source metadata were retained without rewriting. The technical passages are identified as interview source material, separate from the existing design dialogues. External claims and links were not independently verified or updated.

### Applied text moves


All original-content moves used `_scripts/move_text.py --apply`, in the following order. Source ranges are inclusive and refer to the interview before this stage. Descending ranges kept the remaining source positions valid. Each source removal and destination insertion was checked against its expected byte splice.

| Order | Original interview lines | Destination | Placement at the time of the move | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|---|
| 1 | 187 to 258 | [Database-centered runtime]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | Before previous receiving-note line 381 | 72 | 7380 | `d043a0dd97136f6647c9934d7d8785c6add0f56fda7c0d3eefddfafc5f0dc044` |
| 2 | 153 to 186 | [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | At the end | 34 | 3900 | `a841abae799cd56900841ee1779c0574974c2e9929f20febbe666c7a876240fd` |
| 3 | 91 to 152 | [Database-centered runtime]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | Before the imported original interview line 187 | 62 | 6722 | `59ea758a72bf970d0f6ea4590bcafca4a397b635fd9ce1e78b1415a32f1c6b83` |

### Current interview mapping


These seven ranges contain all 399 original interview lines exactly once. Concatenating them in original-line order reconstructs the complete 37,930-byte historical source, including the absent final newline.

| Original interview lines | Current note | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 8 | [Stonebraker interview source]({{< ref "ai/design-research/07-sources/01-stonebraker-data-renegades-transcript" >}}) | 1 to 8 | 8 | 288 | `8a623ccd46aba3a46f693716c8e325dadc4f5db983ebd83c774dce0586f390e0` |
| 9 to 90 | [Stonebraker interview source]({{< ref "ai/design-research/07-sources/01-stonebraker-data-renegades-transcript" >}}) | 15 to 96 | 82 | 7954 | `16139627d3bc0a5de3fc04a461acc896c29a12acaa0ae38cbac0a367afee39d7` |
| 91 to 152 | [Database-centered runtime]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 387 to 448 | 62 | 6722 | `59ea758a72bf970d0f6ea4590bcafca4a397b635fd9ce1e78b1415a32f1c6b83` |
| 153 to 186 | [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1229 to 1262 | 34 | 3900 | `a841abae799cd56900841ee1779c0574974c2e9929f20febbe666c7a876240fd` |
| 187 to 258 | [Database-centered runtime]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 455 to 526 | 72 | 7380 | `d043a0dd97136f6647c9934d7d8785c6add0f56fda7c0d3eefddfafc5f0dc044` |
| 259 to 380 | [Stonebraker interview source]({{< ref "ai/design-research/07-sources/01-stonebraker-data-renegades-transcript" >}}) | 103 to 224 | 122 | 10671 | `7c4070320541735d41c22c1a41be11228e37130d440ea2e3e4acbb74ed4c26d2` |
| 381 to 399 | [Stonebraker interview source]({{< ref "ai/design-research/07-sources/01-stonebraker-data-renegades-transcript" >}}) | 231 to 249 | 19 | 1015 | `533ec31d9c03fffc87d2ff3dcf38cdc55c92e7e07c6c4802b9de8d5d3eba1dad` |

By topic, the source note retains 231 original lines and 19,928 bytes of metadata, history, research and career discussion, closing, and captured page footer. The database note receives 134 original lines and 14,102 bytes on specialized engines, stored procedures, DBOS, text-to-SQL, RUBICON, and benchmarks. The compiler note receives the complete 34-line, 3,900-byte NoSQL, optimizer, transaction, developer-experience, and JSON exchange.

The evaluation note links to the complete database interview passage. It receives no duplicated original interview text. The warehouse failures, human metadata requirements, mixed-source Munich example, BEAVER and DAB comparisons, and production qualifications remain together.

### Preserved receiving-note text


Every preexisting byte in the database, compiler, and evaluation notes was preserved. The complete database closing section, including its final Rubicon URL without a final newline, resumes after the interview excerpts. The following ranges exclude the newly imported source and new navigation.

| Note | Previous lines | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| [Database-centered runtime]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 1 to 380 | 1 to 380 | 380 | 14335 | `20acabe1a0249a9c61ce8d8d34b2838ca58f81f6b83e275d0ae56feedf433ee6` |
| [Database-centered runtime]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 381 to 422 | 533 to 574 | 42 | 1347 | `c9195024e79cde8f44b208e11d9f4f9b3be2b48762811276d7b8958f4e3058bd` |
| [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1 to 1221 | 1 to 1221 | 1221 | 37544 | `afbfe68359602e86f99406d6e35154fd10f4c936a8ead7e0736487883c52451a` |
| [Agent-runtime evaluation and benchmarks]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}) | 1 to 376 | 1 to 376 | 376 | 22992 | `b0b2c8921074d41a8aa898239897db58a2bc30d7b89e37771ef38da24734338e` |

| Complete receiving note before this stage | Logical lines | Bytes | SHA-256 | Final newline |
|---|---|---|---|---|
| [Database-centered runtime]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 422 | 15682 | `682cc4e338e8013734bcc5a806b8cdc0aab2259b87f42e481f6fa3091191046b` | Absent |
| [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1221 | 37544 | `afbfe68359602e86f99406d6e35154fd10f4c936a8ead7e0736487883c52451a` | Present |
| [Agent-runtime evaluation and benchmarks]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}) | 376 | 22992 | `b0b2c8921074d41a8aa898239897db58a2bc30d7b89e37771ef38da24734338e` | Present |

### Added attribution and navigation


Nine separately marked blocks add 51 logical lines and 5,076 bytes. They identify the interview, connect the technical exchanges in their original sequence, mark the return to the design dialogue, separate the captured library footer, and add the evaluation link. Temporary files were created with `apply_patch`, inserted with `move_text.py`, then removed after becoming empty. No original text was edited with those patches.

| Added block | Note | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| `interview-source-context` | [Stonebraker interview source]({{< ref "ai/design-research/07-sources/01-stonebraker-data-renegades-transcript" >}}) | 9 to 14 | 6 | 694 | `1fd67d1eda55b088e3806737684b1a4ddc97d54c0048cd82de0e1a847962db86` |
| `interview-career-transition` | [Stonebraker interview source]({{< ref "ai/design-research/07-sources/01-stonebraker-data-renegades-transcript" >}}) | 97 to 102 | 6 | 754 | `6c00f403d0c463f8f6fae616317476a42680e28f006679d082cb5ece776eb966` |
| `interview-footer-context` | [Stonebraker interview source]({{< ref "ai/design-research/07-sources/01-stonebraker-data-renegades-transcript" >}}) | 225 to 230 | 6 | 262 | `d4d0085a5aa61b098f5d216448ee72979dacd7e0d0911d5b2d9b5bd72bb870cc` |
| `database-interview-context` | [Database-centered runtime]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 381 to 386 | 6 | 606 | `eafe6c6a929eda44fba2279a133ac7388f2baad9f605110ba1a41fe1e6ed588f` |
| `database-benchmark-transition` | [Database-centered runtime]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 449 to 454 | 6 | 607 | `dfc19a7c127538637d9468d5b9cd8dfbf9e8275b75795896590c542b437659fa` |
| `database-dialogue-return` | [Database-centered runtime]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 527 to 532 | 6 | 414 | `1772df9dba6e3312644e03c5d52647f17a1fe1ba5b85ac614e134701a63f3a66` |
| `compiler-interview-context` | [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1222 to 1228 | 7 | 771 | `7c2be8abe952a7132a5571650b25927c2110229dfa5e85a21e79b8f061645e2e` |
| `compiler-interview-continuation` | [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1263 to 1265 | 3 | 360 | `756bdcf3acebc9fc1805c6ede7f4dda8d461971665995f7fec29b9b9e36a7fec` |
| `evaluation-interview-link` | [Agent-runtime evaluation and benchmarks]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}) | 377 to 381 | 5 | 608 | `3357d17c7369514c6b162346ee0b49b05842623a758f56279279d784a7474a01` |

No footnotes were introduced or copied. The four affected notes have no missing or duplicate footnote definitions. The interview itself contains no fenced code examples. All existing fenced code blocks in the affected notes still close.

### Earlier source mappings


The insertion interrupts the former database mapping for `dsl-approach/db-approach.md` original lines 594 to 681, which occupied receiving-note lines 335 to 422. Its 2,620 source bytes and SHA-256 `58637e1618b6adb0305ee07c358741db7dc54c97015d66f7980575ee6fc42ba6` are unchanged. That range now has two contiguous pieces: original lines 594 to 639 at current database lines 335 to 380, and original lines 640 to 681 at current database lines 533 to 574.

The current full mapping for `dsl-approach/db-approach.md` follows. It replaces the positions in earlier stage tables for this original, without changing any source bytes. No other earlier original range changed position.

| Original lines | Current note | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 334 | [Database-centered runtime]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 1 to 334 | 334 | 13062 | `49332647605b308554f9ef2a143028747b5318822a97d13e7ca53256b82ee800` |
| 335 to 475 | [Investigation language and algebra]({{< ref "ai/design-research/04-investigation-and-epistemics/01-investigation-language-and-algebra" >}}) | 456 to 596 | 141 | 2272 | `d0a967bf041768c6f3b82355e5989b39fcbc0259801517f62d2aeb5b1c07a296` |
| 476 to 537 | [Resource-aware investigation planning]({{< ref "ai/design-research/05-runtime-and-execution/03-resource-aware-investigation-planning" >}}) | 207 to 268 | 62 | 959 | `f13ba5dd1029f324ec72b003f3bcf0bb20766b8798a6a0490e75de88b6c6e2e2` |
| 538 to 593 | [Program authoring and typed planning]({{< ref "ai/design-research/03-language-and-compiler/10-program-authoring-and-typed-planning" >}}) | 396 to 451 | 56 | 1385 | `428a2edb9efe4270e6f492f3ed31ef48b3850b6b77923f4f91406d6829843edc` |
| 594 to 639 | [Database-centered runtime]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 335 to 380 | 46 | 1273 | `665b8e7b81a1973923cce38421ad3405045e6ef6295abe3b222937eec0884c88` |
| 640 to 681 | [Database-centered runtime]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 533 to 574 | 42 | 1347 | `c9195024e79cde8f44b208e11d9f4f9b3be2b48762811276d7b8958f4e3058bd` |

All 18 originals checked during the preceding stage still reconstruct exactly. Together with this interview, 19 originals totaling 658,195 bytes were checked. The behavioural-specification originals were compared with pre-split HEAD `[repository fingerprint omitted]`. All other originals were compared with historical revision `[repository fingerprint omitted]`.

| Original document | Logical lines | Bytes | SHA-256 | Reconstruction |
|---|---|---|---|---|
| `architecture-generalization.md` | 926 | 20143 | `80046e60ad993e2b27b1b1b834242ea59085900ea735b3ddea417ec42ad2b2a0` | Exact |
| `research-direction.md` | 690 | 25260 | `376a1bc4b3b1788eedbd15815bb8176e5ed23bfe0421c5356b2993c3ea54b66c` | Exact |
| `investigation-lang-alg.md` | 990 | 25461 | `b7f56872d4c2c814541c5fdcba69a6482cee108381ffed9a1e05f5698801bdee` | Exact |
| `investigation-lang-alg-llm-layer.md` | 700 | 11811 | `2b5b352b5b805c76c49fdc38b07201cf02d6a7bf823165a5f3cba248142f7f6c` | Exact |
| `dsl-approach/dsl-for-rag.md` | 858 | 14726 | `a71594404daf21b5b412db7bfde65750cf941716df0ba44a41e5bebea4b1d2df` | Exact |
| `dsl-approach/db-approach.md` | 681 | 20298 | `8b511dde793b8cb4498dcba003b118c659007c0eeed0035355071be853f8b97a` | Exact |
| `dsl-approach/deep-research-report-formatted.md` | 727 | 65976 | `984fe69cd243e6be69a379200dcb7ce7f03ceb6e8502f9ebae942469438311d8` | Exact |
| `dsl-approach/typed-durable-inspectable-runtimes-report.md` | 518 | 69287 | `e1eb14184dc8a7874f8bfc0f54bf6393eaf5b2b3eea2df0c2f9f8a4934ccfaa7` | Exact |
| `behavioural-specification.md` | 742 | 24801 | `80833b7d13c9cf4a4a5190f24646e3e24d63596102d9a52b52a012efac1e413c` | Exact |
| `behavioural-specification-2.md` | 1292 | 43309 | `a0024010e5572594e1f5c98a11fe0e90a35848ba7c8f0c7cec622c1124048a6c` | Exact |
| `creator-approach.md` | 1139 | 47474 | `e3f08362c6bfc57032cc9c52e9c5787f5402ce3da0b16d4202a9ed4a751a7127` | Exact |
| `dsl-approach/constrained-generativity-semantic-substrate-design.md` | 1766 | 71631 | `ed38e513fd8fa91770012d790bce1a31a78d0e69430ec16696c0774f44d3fc81` | Exact |
| `dsl-approach/problem-framing.md` | 354 | 21976 | `b62b59c763e643ac00223648e80a40d02d3d67d0dd4d24772ca00b5cad721cf6` | Exact |
| `programmable-environments-human-ai-collaboration.md` | 606 | 77682 | `5db18ba69d758e99c8715bb30e93829bdca2b766b35a26b76feba8727c05bc26` | Exact |
| `semantic-kernel.md` | 618 | 11441 | `51844f36adc939b917ddec8cd1e66e06fcb141dea520032fe652ec9d0eeb9769` | Exact |
| `dsl-approach/languages.md` | 759 | 22903 | `7452669c8c579e6d0d56eea276cd6197e4d4d3635aad7dc50b0c3484d2a91fd2` | Exact |
| `dsl-approach/declarative-approach.md` | 482 | 19274 | `b6d7c959ccffc4a09ceb4ec7c4d14f971093e34f0556a3bfbeee901ac78cadb2` | Exact |
| `dsl-approach/DSLs Enable Reliable Use of LLMs.md` | 300 | 26812 | `47f7dc284fa764905fdb01938c4c36a93db63bc8f69ec8c0b8bdcf1b0d5e3772` | Exact |
| `Data Renegades  Ep. 11, Contrarian Bets and AI Skepticism with Michael Stonebraker.md` | 399 | 37930 | `d48ca91722c7512229813f8f771ca93e973eba2a5751fdf0344604764f0b42b3` | Exact |

### Whole-note checksums after the split


The four affected notes contain 119,224 bytes: 37,930 original interview bytes, 76,218 preserved receiving-note bytes, and 5,076 new navigation bytes. Their logical line counts also balance: 399 interview lines plus 2,019 previous receiving-note lines plus 51 navigation lines equals 2,469 lines.

| Note | Logical lines | Bytes | SHA-256 | Final newline |
|---|---|---|---|---|
| [Stonebraker interview source]({{< ref "ai/design-research/07-sources/01-stonebraker-data-renegades-transcript" >}}) | 249 | 21638 | `8c8e5f66a43594e880f8e2eed69659d34cdaf36bfc5915946eb71ce3938671ae` | Absent |
| [Database-centered runtime]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 574 | 31411 | `ddb78e9b3a4bd46a48657411c8869eb9a839504d8700afaefab544cd5c899811` | Absent |
| [Typed DSL and compiler]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1265 | 42575 | `b882ccd3a3662184e6d68bab62342715ba2c483f281ab72f374483b2cb8d5410` | Present |
| [Agent-runtime evaluation and benchmarks]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}) | 381 | 23600 | `eeef5eb523d8c31dedda81de3265cf13a4d008ce40aa9c6e400931f75cf6ac03` | Present |

### Links, whitespace, index, and workspace checks


All 115 internal Markdown links in the four affected notes and the collection index resolve, including heading anchors. The index still has 60 internal links. The interview front matter remains at the start of its source note. The absent final newlines in the source and database notes are preserved.

The new navigation introduces no whitespace warnings. Whole-file checks of the source, database, and evaluation notes pass. The compiler note retains the original article's trailing spaces at current line 1153, corresponding to article line 224. The four earlier trailing-space lines in the unchanged semantic-kernel note remain at lines 421, 422, 439, and 440. The earlier generalized-runtime blank line at EOF remains at line 1064. The evaluation note's previous blank line at line 376 is preserved, but is now an interior separator before the added link, so its prior EOF warning no longer applies.

The index updates four note descriptions without adding or removing entries. It contains 93 logical lines and 16,845 bytes, with SHA-256 `9dd0dac20a7bacc35add52901bcb3083bf48d2617bc0a5843f4f2f49b41f42c6`. The previous 215,704 reassembly-log bytes are preserved, with SHA-256 `2c3db098a78679fc57fa953bcf096c11ada0883fc5aa149c31e51593b0867cbb`. The move script is unchanged, with SHA-256 `402ff2e48ddf908900a296236ec9758b27f72d39d4bac28511359f860efe17d5`. All 66 unrelated files in the two note directories, all redirect files, and all existing permission bits are unchanged. No note was created or removed.

Git index bytes, staged entries, and HEAD remained unchanged. Existing staged and unstaged work was preserved. No staging or commits were performed. Plain-writing (archived source 003) was used only for the new attribution, navigation, index, and audit prose, not for captured source text.

Earlier stage tables describe historical states. The interview, preserved receiving-note, navigation, and updated database-source mappings above record the current Stonebraker split.

## Second reassembly session, stage 1: overview and research scope


Date: 2026-09-30. The user approved the collection reassessment and another rearrangement session. The implemented first step changes the overview and research-question hierarchy. General verification, artifact lifecycle, compiler case studies, and evaluation-plan redistribution remain for later steps.

The arrangement separates the general theory, the builder method, and applications. It identifies investigation, behavioral compilation, and human collaboration as different research tracks. The retained LLM recommendations remain proposals. The arrangement does not choose the first experiment or establish an implementation requirement, a theorem, or a literature claim.

### Source move and dialogue context


The only substantive-content move used `_scripts/move_text.py --lines 549:740 --at-end --apply`. Its source was [Constrained generativity]({{< ref "ai/design-research/01-foundations/01-constrained-generativity" >}}), and its destination was the new [Research scope and hierarchy]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}).

The selected block contained 192 logical lines and 5,886 bytes, with SHA-256 `456c4c6266795a7881c439d4a46027f1ad14af2d2a0f562e72a5edce9fe44538`. It included 188 original dialogue lines and 5,279 original bytes, plus four lines and 607 bytes of previous navigation. The original user prompt, construction-rule argument, constraints-to-guarantees discussion, and final proposed question remain in their previous order. The already separated builder examples and critique are linked at their positions in the dialogue.

The new overview contains 44 lines of separately marked context before the moved block. One line of moved navigation was replaced to correct its relative paths. No original dialogue line was rewritten. The absent final newline in the original dialogue is now preserved at the end of the new overview. The retained principle note ends after a new continuation link.

The original `[another](#another)` reference remains unchanged in the moved prompt. Its intended target is now in another note, so the added overview context supplies a working Markdown link to the original discussion. Legacy wiki references were retained rather than rewritten.

Each move was dry-run first. Every source removal and destination insertion was then compared with an independently calculated byte splice. Original content and added navigation were moved with the user's script. New text and index changes were created with `apply_patch`.

### Preserved pre-session text


The table excludes new context and replacement navigation. The builder-method note preserves every previous byte except its two added navigation lines at positions 194 and 260. The refined-question note preserves its original critique and earlier question at the same positions.

| Previous note | Previous lines | Current note | Current lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| [00-overview/01-problem-framing.md]({{< ref "ai/design-research/00-overview/01-problem-framing" >}}) | 1 to 14 | [00-overview/01-problem-framing.md]({{< ref "ai/design-research/00-overview/01-problem-framing" >}}) | 9 to 22 | 756 | `369cf5c7b01b0ca6d998ae32fa550769aa9e4fe5338b9718825dbb423c35b14f` |
| [00-overview/02-research-direction.md]({{< ref "ai/design-research/00-overview/02-research-direction" >}}) | 1 to 237 | [00-overview/02-research-direction.md]({{< ref "ai/design-research/00-overview/02-research-direction" >}}) | 15 to 251 | 14258 | `01fb457980b1d0496f5c9a0a8c8dd7563a7a7376f6f4d8313a5d598aecd79685` |
| [00-overview/04-architectural-framings.md]({{< ref "ai/design-research/00-overview/04-architectural-framings" >}}) | 1 to 160 | [00-overview/04-architectural-framings.md]({{< ref "ai/design-research/00-overview/04-architectural-framings" >}}) | 9 to 168 | 5279 | `ce2b96824a342a0f2f7178bf5740e0855fde39ff8e086831693a5ae97e465bb2` |
| [00-overview/05-refined-research-question.md]({{< ref "ai/design-research/00-overview/05-refined-research-question" >}}) | 9 to 32 | [00-overview/05-refined-research-question.md]({{< ref "ai/design-research/00-overview/05-refined-research-question" >}}) | 9 to 32 | 1698 | `a75b4f8e33ff0cda896eac9e7f3096da047d15f34e3128aa4b699c2937214e32` |
| [00-overview/05-refined-research-question.md]({{< ref "ai/design-research/00-overview/05-refined-research-question" >}}) | 39 to 58 | [00-overview/05-refined-research-question.md]({{< ref "ai/design-research/00-overview/05-refined-research-question" >}}) | 39 to 58 | 2886 | `c874a12bd953da09aa31cd392643f11067c79358d8860c4bf57944b982fc150b` |
| [01-foundations/01-constrained-generativity.md]({{< ref "ai/design-research/01-foundations/01-constrained-generativity" >}}) | 7 to 548 | [01-foundations/01-constrained-generativity.md]({{< ref "ai/design-research/01-foundations/01-constrained-generativity" >}}) | 7 to 548 | 22910 | `d1e781ea210fcf2794459a29f2a7a3ed23b287138bb5eb02948d4d47f49a5f8c` |
| [01-foundations/01-constrained-generativity.md]({{< ref "ai/design-research/01-foundations/01-constrained-generativity" >}}) | 549 to 616 | [00-overview/06-research-scope-and-hierarchy.md]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}) | 45 to 112 | 2063 | `fdd11a271f04d1419fc6647b75de2ac4f9b410ec8b59173c45e150af40c21529` |
| [01-foundations/01-constrained-generativity.md]({{< ref "ai/design-research/01-foundations/01-constrained-generativity" >}}) | 621 to 740 | [00-overview/06-research-scope-and-hierarchy.md]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}) | 117 to 236 | 3216 | `3e7ef516a3250ad75d8512290a2bd7d4409613436b10640038cd69eef6736aa5` |

### Current original-source mappings


The following tables replace the affected positions in earlier stage tables. The 16 other originals in the checked mapping set retain their previous positions.

#### creator-approach.md


| Original lines | Current note | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 248 | [01-foundations/06-architectural-least-commitment-and-precedents.md]({{< ref "ai/design-research/01-foundations/06-architectural-least-commitment-and-precedents" >}}) | 7 to 254 | 248 | 14589 | `5ad08523fa53ba53a13f03c203e5f511e41faf6c3573c9effcf1a6e26f6f4706` |
| 249 to 790 | [01-foundations/01-constrained-generativity.md]({{< ref "ai/design-research/01-foundations/01-constrained-generativity" >}}) | 7 to 548 | 542 | 22910 | `d1e781ea210fcf2794459a29f2a7a3ed23b287138bb5eb02948d4d47f49a5f8c` |
| 791 to 858 | [00-overview/06-research-scope-and-hierarchy.md]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}) | 45 to 112 | 68 | 2063 | `fdd11a271f04d1419fc6647b75de2ac4f9b410ec8b59173c45e150af40c21529` |
| 859 to 920 | [01-foundations/08-semantic-substrate-builder-method.md]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | 196 to 257 | 62 | 1594 | `904ce43edc0672a57b2316e2cd9d67b9fb589ad81fdbd94445d9daec0c9f77e5` |
| 921 to 944 | [00-overview/05-refined-research-question.md]({{< ref "ai/design-research/00-overview/05-refined-research-question" >}}) | 9 to 32 | 24 | 1698 | `a75b4f8e33ff0cda896eac9e7f3096da047d15f34e3128aa4b699c2937214e32` |
| 945 to 1019 | [01-foundations/08-semantic-substrate-builder-method.md]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | 262 to 336 | 75 | 1404 | `3fda5c6ae4fd12ccc68eb07643149c0139300c2256c7ff0dcc9a51d87c0c3e30` |
| 1020 to 1139 | [00-overview/06-research-scope-and-hierarchy.md]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}) | 117 to 236 | 120 | 3216 | `3e7ef516a3250ad75d8512290a2bd7d4409613436b10640038cd69eef6736aa5` |

#### dsl-approach/problem-framing.md


| Original lines | Current note | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 14 | [00-overview/01-problem-framing.md]({{< ref "ai/design-research/00-overview/01-problem-framing" >}}) | 9 to 22 | 14 | 756 | `369cf5c7b01b0ca6d998ae32fa550769aa9e4fe5338b9718825dbb423c35b14f` |
| 15 to 68 | [01-foundations/04-participant-neutral-system-model.md]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model" >}}) | 1 to 54 | 54 | 1756 | `4358ec282f1157729086facfff9a2a9e489bc0924710a80999e310f1046eca2a` |
| 69 to 228 | [00-overview/04-architectural-framings.md]({{< ref "ai/design-research/00-overview/04-architectural-framings" >}}) | 9 to 168 | 160 | 5279 | `ce2b96824a342a0f2f7178bf5740e0855fde39ff8e086831693a5ae97e465bb2` |
| 229 to 298 | [01-foundations/05-constrained-common-substrate.md]({{< ref "ai/design-research/01-foundations/05-constrained-common-substrate" >}}) | 1 to 70 | 70 | 3184 | `a0c60aca06298184c095cf1fdca2da3fcee630eb38d0797227a75cbb7d594f83` |
| 299 to 334 | [06-research-reports/03-shared-runtime-landscape.md]({{< ref "ai/design-research/06-research-reports/03-shared-runtime-landscape" >}}) | 1 to 36 | 36 | 8115 | `723f35c8c1e15dd1d9ca8e53766561e27ac863674fbc3294507ec798f3c6cdcb` |
| 335 to 354 | [00-overview/05-refined-research-question.md]({{< ref "ai/design-research/00-overview/05-refined-research-question" >}}) | 39 to 58 | 20 | 2886 | `c874a12bd953da09aa31cd392643f11067c79358d8860c4bf57944b982fc150b` |

#### research-direction.md


| Original lines | Current note | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| 1 to 71 | [00-overview/02-research-direction.md]({{< ref "ai/design-research/00-overview/02-research-direction" >}}) | 15 to 85 | 71 | 7341 | `f852d0c87a3054afe4327d90bc2f6cb496971d8452fedc50655378a03f2e97c3` |
| 72 to 138 | [05-runtime-and-execution/01-generalized-agent-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) | 362 to 428 | 67 | 1669 | `013851091196d9415aa859dca72814ea54a4ed964fda0ff5c74e2f14198478b0` |
| 139 to 215 | [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 680 to 756 | 77 | 1571 | `aa178af1e18471665ad91d22f40a4f81f8c58d52ee74d887c0fda5feb3dbbecc` |
| 216 to 239 | [05-runtime-and-execution/01-generalized-agent-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) | 429 to 452 | 24 | 779 | `03a44a46a2e907e854c1ab80669874a03e87231a82031551083b424516fc1a2e` |
| 240 to 271 | [05-runtime-and-execution/03-resource-aware-investigation-planning.md]({{< ref "ai/design-research/05-runtime-and-execution/03-resource-aware-investigation-planning" >}}) | 175 to 206 | 32 | 761 | `74a516c47a4ab3ebd0a817a2bb7c9242a0272beb808aa22ea91b51e9ec09cf8f` |
| 272 to 315 | [02-human-ai-collaboration/01-augmenting-human-work.md]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}) | 324 to 367 | 44 | 1324 | `d88eb58e627da344923c7d312c8e0ca0e35b965eb9d81287c4d4ede179599a86` |
| 316 to 341 | [00-overview/02-research-direction.md]({{< ref "ai/design-research/00-overview/02-research-direction" >}}) | 86 to 111 | 26 | 1394 | `bcd63cf2ddd20378ad0c094677dbc4376d1f23294b8746458445b0218c191e6e` |
| 342 to 379 | [00-overview/02-research-direction.md]({{< ref "ai/design-research/00-overview/02-research-direction" >}}) | 130 to 167 | 38 | 1753 | `02ce0cdb2cad16c17fa29f156bf0ce6c8d4337a75a58284752702d94ff56c3e3` |
| 380 to 453 | [01-foundations/05-constrained-common-substrate.md]({{< ref "ai/design-research/01-foundations/05-constrained-common-substrate" >}}) | 71 to 144 | 74 | 2384 | `0d69fa5a1208032ed251fba72691c7cef17341aa5cc317959dcb884b7c2f8416` |
| 454 to 518 | [01-foundations/04-participant-neutral-system-model.md]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model" >}}) | 81 to 145 | 65 | 1216 | `ee1db7bb36aab369d6178a1ea099b3c33e678f32080f2ae6d2c30d7646e427ec` |
| 519 to 563 | [01-foundations/05-constrained-common-substrate.md]({{< ref "ai/design-research/01-foundations/05-constrained-common-substrate" >}}) | 145 to 189 | 45 | 981 | `311f09c3bf6d6e5f642279fb1b30cebea35fa9540e8971f3f1d1446327fd5897` |
| 564 to 606 | [03-language-and-compiler/03-declarative-programming-model.md]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model" >}}) | 168 to 210 | 43 | 970 | `bddb0172285fe4365c8f27a3ba846fda6a9e6c76ccf9631f54890034e887106f` |
| 607 to 690 | [00-overview/02-research-direction.md]({{< ref "ai/design-research/00-overview/02-research-direction" >}}) | 168 to 251 | 84 | 3117 | `6924a315924b7d76af6c2555b80e02f6095318b95f74d45b53dab0a7bfe8426d` |

### New and replacement navigation


The new context and replacement navigation contain 85 logical lines and 9416 bytes. The replacements retire six earlier navigation lines totaling 2121 bytes. Original source bytes are excluded from both counts. The collection index is recorded separately.

| Block | Note | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| `scope-overview-context` | [00-overview/06-research-scope-and-hierarchy.md]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}) | 1 to 44 | 44 | 4817 | `e03f53c8c2f16dc6004a31298def5b8d448d698aac244146f265bcdaa2fd3b62` |
| `refined-earlier-context-insert` | [00-overview/05-refined-research-question.md]({{< ref "ai/design-research/00-overview/05-refined-research-question" >}}) | 37 to 37 | 1 | 366 | `ef9b6d9dff365d41e6667b063bbf25bd3f7865e053c1a83c941e8adbce966b04` |
| `refined-scope-context-insert` | [00-overview/05-refined-research-question.md]({{< ref "ai/design-research/00-overview/05-refined-research-question" >}}) | 7 to 7 | 1 | 388 | `17e3f6f4b28df1905f0b130135d2b0afa8e86e7dce7c667dfec5bc336120439a` |
| `builder-framing-link-insert` | [01-foundations/08-semantic-substrate-builder-method.md]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | 260 to 260 | 1 | 453 | `813a62c1d71d5a462dbb69b23c9b30cf0af112b2b4517e7f19c6af02d8caab5e` |
| `builder-construction-link-insert` | [01-foundations/08-semantic-substrate-builder-method.md]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | 194 to 194 | 1 | 305 | `2c6c88125d154c7278a07d6bfbfd7aa8089df7c36a7d90cd86208973312540a4` |
| `scope-builder-and-framing-links-insert` | [00-overview/06-research-scope-and-hierarchy.md]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}) | 115 to 115 | 1 | 532 | `cb69ea71d69c8b738e9ac6cce7dbe51527c767b44346269127f7b549a3d20b78` |
| `principle-context-insert` | [01-foundations/01-constrained-generativity.md]({{< ref "ai/design-research/01-foundations/01-constrained-generativity" >}}) | 5 to 5 | 1 | 391 | `b1acf1406424dbd00c1b5b1dde1b564b76058f680848789a487d6a503118b2ae` |
| `framing-context` | [00-overview/01-problem-framing.md]({{< ref "ai/design-research/00-overview/01-problem-framing" >}}) | 1 to 8 | 8 | 362 | `8f8dcd8fa380736a23f239ef870879b750f4d34ca40653eb3c2cc9b8778292e8` |
| `research-direction-context` | [00-overview/02-research-direction.md]({{< ref "ai/design-research/00-overview/02-research-direction" >}}) | 1 to 14 | 14 | 850 | `bf3b459f8ca1bd710e908a70df6cf7d9d71444274be47c9f53806166c762535b` |
| `architectural-framings-context` | [00-overview/04-architectural-framings.md]({{< ref "ai/design-research/00-overview/04-architectural-framings" >}}) | 1 to 8 | 8 | 446 | `ab2525b8a37ca41ab141178ed7135167b08aed05f5ad4001138c9f33867fb340` |
| `principle-continuation` | [01-foundations/01-constrained-generativity.md]({{< ref "ai/design-research/01-foundations/01-constrained-generativity" >}}) | 549 to 553 | 5 | 506 | `d21b587761f39fee4e60c84e921d069df434da2edaafaeb2784fb02984e379dc` |

The following previous navigation lines are retained in their retirement order for audit. Their combined SHA-256 is `54680a3693145334381a63805fa08996bf5226b55623ec04675e5dde073a4b85`. The lines were moved into a temporary file with the script, recorded here, then the temporary file was removed. The earlier source positions were refined-question lines 37 and 7, builder-method lines 260 and 194, constrained-generativity line 619, and constrained-generativity line 5.

```text
The original terminology corrections and proposed questions remain unchanged below. Read them as an application of the broader theory described in [Constrained generativity](../01-foundations/01-constrained-generativity.md), rather than as requirements for every system.
The later critique below separates the general theory from the earlier human, model, and program environment question. The [revised broad research question](../01-foundations/01-constrained-generativity.md#6-i-would-therefore-reframe-the-research-question) remains with the theory discussion. The earlier wording follows in a separate section below.
The intervening section 3 critiques the earlier architecture-specific question and is now in [Refined research question](../00-overview/05-refined-research-question.md#3-the-second-problem-framing-is-currently-too-solution-shaped). After the examples below, the dialogue continues with the [relation between constraints and guarantees](01-constrained-generativity.md#5-the-theory-needs-a-relation-between-constraints-and-guarantees).
The following captured passages expand the builder method above. Their original section numbers are retained. The preceding [construction-rule discussion](01-constrained-generativity.md#1-your-core-research-object-should-be-the-construction-rule) remains in the general-principle note.
The intervening passages are now in the [builder questions](08-semantic-substrate-builder-method.md#2-this-changes-what-you-give-builders), the [critique of the earlier question](../00-overview/05-refined-research-question.md#3-the-second-problem-framing-is-currently-too-solution-shaped), and the [complete comparison of three builders](08-semantic-substrate-builder-method.md#4-start-from-guarantees-then-derive-constraints). The dialogue continues below with the relation between constraints and guarantees.
The retained dialogue develops the general principle, construction rules, and the revised broad research question. The opening discussion and historical survey are in [Architectural least commitment and precedents](06-architectural-least-commitment-and-precedents.md).
```

### Reconstruction checks


All 19 originals in the preceding checked mapping set were reconstructed again. Their 658,195 original bytes match their historical Git versions exactly. The behavioral-specification originals use revision `[repository fingerprint omitted]`. The other originals use revision `[repository fingerprint omitted]`.

The original-source ranges are contiguous and complete in original-line order, with no overlaps or gaps. The complete pre-session framing prompt, research-direction dialogue, and architectural-framings response also match their current shifted ranges byte for byte. The unchanged historical index note was not reformatted.

| Original source directly affected | Logical lines | Bytes | SHA-256 | Reconstruction |
|---|---|---|---|---|
| `research-direction.md` | 690 | 25260 | `376a1bc4b3b1788eedbd15815bb8176e5ed23bfe0421c5356b2993c3ea54b66c` | Exact |
| `creator-approach.md` | 1139 | 47474 | `e3f08362c6bfc57032cc9c52e9c5787f5402ce3da0b16d4202a9ed4a751a7127` | Exact |
| `dsl-approach/problem-framing.md` | 354 | 21976 | `b62b59c763e643ac00223648e80a40d02d3d67d0dd4d24772ca00b5cad721cf6` | Exact |

### Whole-note checksums


| Note | Logical lines | Bytes | SHA-256 | Final newline |
|---|---|---|---|---|
| [00-index.md]({{< ref "ai/design-research/00-index" >}}) | 98 | 17554 | `4b6283e6af3453438ba8f77abfdf6a2bc7a7d0cb823975816887c26075fee0ee` | Present |
| [00-overview/01-problem-framing.md]({{< ref "ai/design-research/00-overview/01-problem-framing" >}}) | 22 | 1118 | `9c96c34cd2edbe816b7072de8205e881ba9a129d351b750ee7b9bccc6e692262` | Present |
| [00-overview/02-research-direction.md]({{< ref "ai/design-research/00-overview/02-research-direction" >}}) | 251 | 15108 | `a815afa73d9ff461762aa97750d85813087ee34826acb671b635b2b89bfabe06` | Absent |
| [00-overview/04-architectural-framings.md]({{< ref "ai/design-research/00-overview/04-architectural-framings" >}}) | 168 | 5725 | `002e43f4771898365144424fcc8ef738035532a144448a65268933cfafd1dcd4` | Present |
| [00-overview/05-refined-research-question.md]({{< ref "ai/design-research/00-overview/05-refined-research-question" >}}) | 58 | 5666 | `d52393594ae9e8bc382bb200be2a7f014c3285c1715f042c48fd7bfcff731ba2` | Absent |
| [01-foundations/01-constrained-generativity.md]({{< ref "ai/design-research/01-foundations/01-constrained-generativity" >}}) | 553 | 23931 | `a14185f96ae4ce876e27afeb7bfe31a22a0b7b31dc930f8b0f1e669c84764663` | Present |
| [01-foundations/08-semantic-substrate-builder-method.md]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | 410 | 21904 | `a8b36484818f0c5a2afd6674eed2f83828d054eaa2b2b51d4ac99b9732279cf8` | Present |
| [00-overview/06-research-scope-and-hierarchy.md]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}) | 236 | 10724 | `bb450fbefe13d26165d80f0ca5833659a110ae2e540081594716f60c84bb8e93` | Absent |

### Links and workspace checks


Before adding this audit section, all 588 internal Markdown links across 47 collection Markdown files resolved, including heading anchors. The affected notes and index contain 105 checked links, and the index contains 64. All checked code fences close. The affected notes have no missing or duplicate footnote definitions. External URLs and legacy wiki references were not independently verified.

The collection index now starts with the general theory and builder method. It adds the scope note, identifies the shared-runtime model as an application, and preserves entries for all existing notes. The reading order is not a required research sequence.

The previous 233432 audit bytes are preserved as an unchanged prefix, with SHA-256 `ca32516a2b9dd927fe5a92832304bb09f25ebcd63fd5c500688de73cf61db07a`. The move script remains unchanged, with SHA-256 `402ff2e48ddf908900a296236ec9758b27f72d39d4bac28511359f860efe17d5`. All 66 files outside the affected notes, index, and audit retain their previous bytes and permission bits. All redirect files are unchanged.

Git was clean before the step. HEAD remains `[repository fingerprint omitted]`, and Git index bytes and staged entries remain unchanged. No staging or commits were performed. Temporary navigation files were removed after their text was inserted or recorded in this audit.

Plain-writing (archived source 003) was used only for new context, navigation, index, and audit prose. It did not change the retained dialogue or captured source text.

Earlier stage tables describe historical states. The mappings and whole-note checksums in this section record the current overview reassembly.

## Second reassembly session, stage 2: verification and acceptance


Date: 2026-09-30. The user approved the proposed shared verification note and the move of the compilation-versus-correctness dialogue and both verification versions. The implementation preserves the earlier and later analyses as separate passages.

The new [Verification and acceptance]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) note distinguishes compilation, result verification, acceptance for an exact revision and purpose, and authorization for external effects. Its added context identifies the retained checks as proposals. The earlier `Accepted` wording remains unchanged and is read alongside the later lifecycle distinction.

The RAG note retains its evidence-specific obligations, certificates, and conditional structural-soundness claim. The compiler note retains language design, operator contracts, and static validation. Benchmarks, experiment designs, and synthesis failure analyses remain in the evaluation note, which receives a link to the shared framework. No original passage was duplicated into those navigation links.

### Applied content moves


Both selected blocks were moved with `_scripts/move_text.py --at-end --apply`. The source ranges below are inclusive and refer to the notes before this stage. Each move was dry-run first, then both resulting files were compared with an independently calculated byte splice.

| Order | Source note | Previous lines | Receiving note | Receiving lines at insertion | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|---|---|
| 1 | [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 935 to 1025 | [01-foundations/09-verification-and-acceptance.md]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | 38 to 128 | 91 | 2383 | `690803e8fd6b5e1a19cc6c880ef551e005b4d5aae49dcebb99c39af08d593402` |
| 2 | [04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md]({{< ref "ai/design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag" >}}) | 655 to 806 | [01-foundations/09-verification-and-acceptance.md]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | 129 to 280 | 152 | 5320 | `2dd411ec3a04bd26e98b1bc8724c3ddcda953ed889f2c1559d3f89e949a82f48` |

The selected blocks contain 243 logical lines and 7,703 bytes. Of those, 226 lines and 6,500 bytes are original dialogue text. The remaining 17 lines and 1,203 bytes are navigation and separators added in earlier stages.

The new note contains 37 added context lines before the moved blocks. Three moved navigation lines were replaced to label the initial compilation and verification sections and correct a relative link. The original section titles, examples, formulas, outcome variants, qualifications, and final blank line were retained.

### Current moved-original mapping


The ranges below exclude every added navigation line and separator. Their original bytes and checksums are unchanged.

| Original source | Original lines | Current note | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|---|
| `behavioural-specification.md` | 167 to 251 | [01-foundations/09-verification-and-acceptance.md]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | 43 to 127 | 85 | 2001 | `dee8b40ba08464f42e3f48021c8acb916a1005dc59b4fd35da90b74ee55b2886` |
| `behavioural-specification.md` | 252 to 339 | [01-foundations/09-verification-and-acceptance.md]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | 134 to 221 | 88 | 2884 | `25769ffa1762ee7f9fafd4900bbc62289f64eb9962e80527731b5f6dd7c09bc5` |
| `behavioural-specification-2.md` | 928 to 980 | [01-foundations/09-verification-and-acceptance.md]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | 228 to 280 | 53 | 1615 | `b2d1dec5da6ac3f99ce2ac1db7e5139b965f5d67315715f676cf90c678ef4ec5` |

### Preserved pre-stage note text


Every original byte in the four affected content notes was preserved. The complete evaluation note remains an unchanged prefix. The compiler and RAG notes reconstruct exactly from their retained text and moved blocks after restoring the replaced navigation lines from the archive below. The behavioral-compilation note changes only three previously added navigation links at lines 175, 176, and 906.

| Previous complete note | Logical lines | Bytes | SHA-256 | Reconstruction |
|---|---|---|---|---|
| [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1265 | 42575 | `b882ccd3a3662184e6d68bab62342715ba2c483f281ab72f374483b2cb8d5410` | Exact |
| [04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md]({{< ref "ai/design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag" >}}) | 806 | 19882 | `182147764401f031f36461851129589c9025ffcc90f292f793719e4a877e23d3` | Exact |
| [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 993 | 39103 | `e38a4733b8028d153bbc9468a0a17fbf241d29507239e68da1f92d470ae39804` | Exact |
| [06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}) | 381 | 23600 | `eeef5eb523d8c31dedda81de3265cf13a4d008ce40aa9c6e400931f75cf6ac03` | Exact |

| Previous note | Previous lines | Current note | Current lines | Previous bytes | Previous SHA-256 | Navigation restoration |
|---|---|---|---|---|---|---|
| [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1 to 934 | [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1 to 934 | 23946 | `f3344b91475030e9f9f8ad758b766737b3108344442f7b1af3fc5acb9d3e0fe3` | None |
| [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 935 to 1025 | [01-foundations/09-verification-and-acceptance.md]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | 38 to 128 | 2383 | `690803e8fd6b5e1a19cc6c880ef551e005b4d5aae49dcebb99c39af08d593402` | Restore the archived navigation lines before comparing |
| [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1026 to 1265 | [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 940 to 1179 | 16246 | `16019cfeb7f5e147072ee6865e63b92528ee69ce1737819c84ca214d818d2637` | None |
| [04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md]({{< ref "ai/design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag" >}}) | 1 to 654 | [04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md]({{< ref "ai/design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag" >}}) | 1 to 654 | 14562 | `b581389199e4bf5e677cb02b77ba5c49e0d18883abca497d849949ef2096e39d` | None |
| [04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md]({{< ref "ai/design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag" >}}) | 655 to 806 | [01-foundations/09-verification-and-acceptance.md]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | 129 to 280 | 5320 | `2dd411ec3a04bd26e98b1bc8724c3ddcda953ed889f2c1559d3f89e949a82f48` | Restore the archived navigation lines before comparing |
| [06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}) | 1 to 381 | [06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}) | 1 to 381 | 23600 | `eeef5eb523d8c31dedda81de3265cf13a4d008ce40aa9c6e400931f75cf6ac03` | None |

### Changed earlier-source positions


The seven locations below replace their positions in earlier stage tables. All other original-source locations in the checked mapping set remain unchanged. The compiler suffix moves up by 86 lines after the 91-line block is replaced with a five-line link.

| Original source | Original lines | Previous note | Previous lines | Current note | Current lines | Bytes | SHA-256 |
|---|---|---|---|---|---|---|---|
| `behavioural-specification.md` | 167 to 251 | [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 940 to 1024 | [01-foundations/09-verification-and-acceptance.md]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | 43 to 127 | 2001 | `dee8b40ba08464f42e3f48021c8acb916a1005dc59b4fd35da90b74ee55b2886` |
| `behavioural-specification.md` | 252 to 339 | [04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md]({{< ref "ai/design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag" >}}) | 660 to 747 | [01-foundations/09-verification-and-acceptance.md]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | 134 to 221 | 2884 | `25769ffa1762ee7f9fafd4900bbc62289f64eb9962e80527731b5f6dd7c09bc5` |
| `behavioural-specification-2.md` | 433 to 452 | [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1031 to 1050 | [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 945 to 964 | 492 | `49ea306e510fb228da397a4d6d7677347b25fd6358dee620655c1e0a6ccd7c5b` |
| `behavioural-specification-2.md` | 847 to 892 | [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1057 to 1102 | [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 971 to 1016 | 1355 | `f768736e52b9ba35da00f83b2e611a35005c16bfceb7a64ee6a213618db4bfe3` |
| `behavioural-specification-2.md` | 928 to 980 | [04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md]({{< ref "ai/design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag" >}}) | 754 to 806 | [01-foundations/09-verification-and-acceptance.md]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | 228 to 280 | 1615 | `b2d1dec5da6ac3f99ce2ac1db7e5139b965f5d67315715f676cf90c678ef4ec5` |
| `dsl-approach/DSLs Enable Reliable Use of LLMs.md` | 180 to 289 | [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1109 to 1218 | [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1023 to 1132 | 7514 | `c6b71a56f83355357da7190fd7c1ffdc0621f3b3b842ad510196c89fa2768f8b` |
| `Data Renegades  Ep. 11, Contrarian Bets and AI Skepticism with Michael Stonebraker.md` | 153 to 186 | [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1229 to 1262 | [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1143 to 1176 | 3900 | `a841abae799cd56900841ee1779c0574974c2e9929f20febbe666c7a876240fd` |

### New and replacement navigation


The new context and replacement navigation contain 57 logical lines and 5771 bytes. They retire six previous navigation lines totaling 767 bytes. Original source bytes and index edits are excluded from those counts.

| Block | Note | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| `verification-overview` | [01-foundations/09-verification-and-acceptance.md]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | 1 to 37 | 37 | 3611 | `9043fd0ad8bef7b6eb51ab3f29739ea7c95d796643f4149ca6d732955929ead5` |
| `compilation-section-context-insert` | [01-foundations/09-verification-and-acceptance.md]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | 39 to 39 | 1 | 57 | `88770e1b9ef8f2bcba1291e0bf6189002e2641211aaec90355db4a65f4a5f584` |
| `compilation-source-link-insert` | [01-foundations/09-verification-and-acceptance.md]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | 41 to 41 | 1 | 268 | `010b165ba04132e3d040b425068ce2c227dbcff0da180d2d74210e79fde3e468` |
| `verification-section-context-insert` | [01-foundations/09-verification-and-acceptance.md]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | 130 to 130 | 1 | 42 | `19592845b9659470059c4d01fed21c73795215d8d1d3408be64cd75adb7f0d1c` |
| `hub-verification-stage-link-insert` | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 906 to 906 | 1 | 138 | `a585c008e277225a03c6a06aaeb16c20374c4eb35344674d85df8b2c5eeec98e` |
| `hub-verification-section-link-insert` | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 176 to 176 | 1 | 142 | `42f4469bac2e46a59cab30c6779dba0143ccbcf9ca8f17332850afefbaacf2ce` |
| `hub-compilation-section-link-insert` | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 175 to 175 | 1 | 146 | `4517de9d1ab33d04fd99344c86c3508fb50825c5d46e2124aee3b19f22b39cf1` |
| `compiler-verification-link` | [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 935 to 939 | 5 | 392 | `b5091350bebeaa37d31e1584ffb1b2491d5d46b6e9f7c8bc9d97430112da7d9e` |
| `rag-verification-link` | [04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md]({{< ref "ai/design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag" >}}) | 655 to 658 | 4 | 559 | `43e4a3aa09ca5828d123277c89057a434071581e9a9cb1b8b6217b031bd68577` |
| `evaluation-verification-link` | [06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}) | 382 to 386 | 5 | 416 | `3110acfb07b6069ca733149ea280de43b7148342d6465450848d9c8a4a2c27fa` |

The retired navigation lines below remain in their retirement order for audit. Their combined SHA-256 is `9b153cbdee41d028d99fbb7d1632f9299d7c01042ab1636841c808e89d6aa37f`. Their previous locations were compiler-note lines 936 and 938, RAG-note line 656, and behavioral-compilation-note lines 906, 176, and 175.

```text
## Source context for behavioral compilation
The following section comes from [Behavioral compilation and specification](11-behavioral-compilation-and-specification.md). The original question and access caveat remain in that note. The original wording and section number is unchanged.
## Source context for behavioral compilation
- [Stage 7. Independent verification](../04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md#7-verify-through-several-independent-relations)
- [Section 5. Verification](../04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md#5-verification-must-not-be-similarity-to-the-previous-output)
- [Section 4. Compilation and correctness](02-typed-dsl-and-compiler.md#4-compilation-and-correctness-are-different-loops)
```


All original-content and navigation replacements used the move script. New navigation was created with `apply_patch` in temporary files. The retired navigation was also moved into a temporary file and recorded above. Temporary files were removed only after their contents were inserted or recorded.

### Reconstruction and balance checks


All 19 originals in the preceding checked mapping set were reconstructed again. Their 658,195 bytes match their historical Git versions exactly. The behavioral-specification originals use revision `[repository fingerprint omitted]`. The other originals use revision `[repository fingerprint omitted]`.

The original ranges are complete and contiguous in original-line order, with no gaps or overlaps. Every original block retains its previous checksum. The two behavioral-specification originals, captured DSL article, and Stonebraker interview are the only originals whose mapped positions changed in this stage.

The four pre-stage content notes contained 125160 bytes and 3445 logical lines. After adding 5771 navigation bytes and retiring 767, the affected content notes and the new note contain 130164 bytes. Their line count balances as 3445 plus 57 minus 6, giving 3496 logical lines. The index and audit are recorded separately.

### Whole-note checksums


| Note | Logical lines | Bytes | SHA-256 | Final newline |
|---|---|---|---|---|
| [00-index.md]({{< ref "ai/design-research/00-index" >}}) | 100 | 17897 | `d4a3288956b515b1d3145045a41ea9c3919ad5f78609ebd23ceff8fed962f583` | Present |
| [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1179 | 40584 | `ddc8c569e18655523cf73342a5efd59240dcd161d7b1cf53ccedd6415f44dd3e` | Present |
| [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 993 | 39092 | `fc599efcc651da63805b54413976a4e1c6ac68ae0f6da665f48e65d9eb2891df` | Absent |
| [04-investigation-and-epistemics/03-epistemic-contracts-for-rag.md]({{< ref "ai/design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag" >}}) | 658 | 15121 | `da71c530fc1ef79d90fbae0d8dcfa02494004f89bf01a5805fa86e455317714f` | Present |
| [06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}) | 386 | 24016 | `5366cbc5824404dc1afa27d7bfa8e84b59fc01f73ffeab1ece7ef24eed6e86b5` | Present |
| [01-foundations/09-verification-and-acceptance.md]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | 280 | 11351 | `31e5b6a5395fd0b5673c6cd922f08893ff36f37588b6f5b136b243f52d658045` | Present |

### Links, whitespace, and workspace checks


Before this audit section was appended, all 666 internal Markdown links across 48 collection Markdown files resolved, including heading anchors. The affected notes and index contain 149 checked links, and the index contains 66. All checked code fences close, and the affected notes have no missing or duplicate footnote definitions. External URLs, legacy wiki references, and attached domain-guide claims were not independently verified.

The tracked whitespace check passes. The new verification note retains an original blank line at EOF, at current line 280. It is behavioral-specification-2 original line 980, previously at RAG-note line 806. The compiler note retains the captured article's trailing spaces at current line 1067, previously at line 1153 and corresponding to article line 224. The behavioral-compilation note retains its previous trailing spaces at lines 10, 524, 526, 528, 530, 532, 534, 536, 605, 608, 611, and 614. No new navigation has trailing spaces. No original whitespace was trimmed.

The index adds the shared verification note to the foundations and reading path. It updates the compiler and RAG descriptions without removing any note entry. The earlier overview rearrangement, all unrelated notes, and all redirects are unchanged.

The previous 254515 audit bytes remain an unchanged prefix, with SHA-256 `e75b78444c6a9e4c5f57949e4be75ecd2fe6cd0683f6a113461fb476c1c44e36`. The move script is unchanged, with SHA-256 `402ff2e48ddf908900a296236ec9758b27f72d39d4bac28511359f860efe17d5`. All 69 files outside the affected content notes, index, and audit retain their previous bytes and permission bits.

The preexisting staged and unstaged state was preserved. HEAD remains `[repository fingerprint omitted]`, and Git index bytes and staged entries remain unchanged. No staging or commits were performed.

Plain-writing (archived source 003) guided only the new context, navigation, index, and audit prose. It did not alter the retained dialogue or captured source text.

Earlier stage tables describe historical states. The changed original-source locations, preserved-note reconstruction, navigation, and whole-note checksums above record the current verification reassembly.

## Second reassembly session, stage 3: program versions, runs, and results


Date: 2026-09-30. The user approved grouping the program and result history passages and requested a sibling document for new comments. The original dialogues remain separate from those comments.

The new [05-runtime-and-execution/06-program-versions-runs-and-results.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) groups the initial lifecycle and record catalog, graph distinctions, repair attempts, branch joins, execution runs, and rules for later use of results. The sibling [05-runtime-and-execution/06-program-versions-runs-and-results-comments.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results-comments" >}}) explains the terms and example in plain language and identifies open questions. The comments are not part of the original dialogues or an agreed implementation specification.

The behavioral-compilation note retains the original questions, access caveats, detailed synthesis stages, and implementation scope. The generalized runtime retains durability, failure recovery, replay, execution tiers, and guarded reuse. The verification note retains its original passages; only one previously added link changes. No original passage was copied into the comments or navigation.

### Applied content moves


All three selected blocks were moved with `_scripts/move_text.py --apply`. The ranges below refer to the notes before this stage. Each move was dry-run first, then both resulting files were compared with an independently calculated byte splice. Insertion was before the next context heading or at the end of the new note. The final receiving ranges account for later insertions.

| Order | Source note | Previous lines | Current receiving lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|---|
| 1 | [05-runtime-and-execution/01-generalized-agent-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) | 922 to 1064 | 258 to 400 | 143 | 2935 | `0bcbfe409e8221c58350680332d0893fb8d0598c016e7ca9067a6ca32545f917` |
| 2 | [05-runtime-and-execution/01-generalized-agent-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) | 697 to 832 | 118 to 253 | 136 | 3574 | `924616f98325f70c544c13dcd348b5a3b1653c345aadbdb7323f547f7d59ea21` |
| 3 | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 234 to 336 | 11 to 113 | 103 | 2992 | `4f315eaf0638d967654f019eab07ceeea0c70c151fdb53b3560628fbe4cdaeda` |

The selected blocks contain 382 logical lines and 9,501 bytes. They contain 370 original dialogue lines and 8,670 original bytes, plus 12 lines and 831 bytes of navigation and separators added in earlier stages. The moved blocks remain byte-for-byte unchanged, including their earlier navigation, original section numbers, trailing spaces, and final blank line.

### Current moved-original mapping


These ranges exclude added navigation and separators.

| Original source | Original lines | Current note | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|---|
| `behavioural-specification.md` | 371 to 500 | [05-runtime-and-execution/06-program-versions-runs-and-results.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) | 123 to 252 | 130 | 3162 | `db8115dd32e7487c4e7c7678dffb028921e4a2ec0058198530df5d2126e6c514` |
| `behavioural-specification.md` | 553 to 655 | [05-runtime-and-execution/06-program-versions-runs-and-results.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) | 11 to 113 | 103 | 2992 | `4f315eaf0638d967654f019eab07ceeea0c70c151fdb53b3560628fbe4cdaeda` |
| `behavioural-specification-2.md` | 486 to 523 | [05-runtime-and-execution/06-program-versions-runs-and-results.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) | 258 to 295 | 38 | 664 | `ca3af9b128a6355244bcdb7cc2105be0906c38af95ec5ea17d08085e10e4efc6` |
| `behavioural-specification-2.md` | 893 to 927 | [05-runtime-and-execution/06-program-versions-runs-and-results.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) | 302 to 336 | 35 | 774 | `3ed265c21a640b6b3ff6764d4555db045ba5327c31371bcd235e61c4da4e8887` |
| `behavioural-specification-2.md` | 1091 to 1154 | [05-runtime-and-execution/06-program-versions-runs-and-results.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) | 337 to 400 | 64 | 1078 | `2fc269281a968ef85a84a1d2b0ff54cbd7765353cbc5333c31ba578cc329da93` |

### Preserved pre-stage notes


All three complete content notes reconstruct exactly from retained text, moved blocks, and the archived navigation below. The index matches the four planned navigation edits. No original source text was edited.

| Previous note | Logical lines | Bytes | SHA-256 | Reconstruction |
|---|---|---|---|---|
| [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 993 | 39092 | `fc599efcc651da63805b54413976a4e1c6ac68ae0f6da665f48e65d9eb2891df` | Exact |
| [05-runtime-and-execution/01-generalized-agent-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) | 1064 | 29088 | `4a3541583ebb908ec30e2c90c396ca375127fe54f1ab908450462cd0515252c2` | Exact |
| [01-foundations/09-verification-and-acceptance.md]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | 280 | 11351 | `31e5b6a5395fd0b5673c6cd922f08893ff36f37588b6f5b136b243f52d658045` | Exact |

To reconstruct the previous behavioral-compilation note, restore its six archived navigation lines at current lines 178, 179, 180, 478, 807, and 810. Concatenate current lines 1 to 233, the new note's lines 11 to 113, and current lines 239 to 895. This excludes the five new source-link lines.

To reconstruct the previous runtime, concatenate current runtime lines 1 to 696, the new note's lines 118 to 253, current runtime lines 702 to 790, and the new note's lines 258 to 400. This excludes the nine new source-link lines. Restoring verification-note line 16 from the seventh archived line reconstructs its previous text exactly.

### Changed original-source positions


The rows below supersede their earlier positions. Original `behavioural-specification.md` lines 501 to 655, previously one block, are now split into lines 501 to 552 and 553 to 655. Each part was compared with the corresponding historical source bytes; its separate checksum is recorded below. All other mapped original locations outside these rows remain unchanged.

| Original source | Original lines | Previous note | Previous lines | Current note | Current lines | Bytes | SHA-256 |
|---|---|---|---|---|---|---|---|
| `behavioural-specification.md` | 371 to 500 | [05-runtime-and-execution/01-generalized-agent-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) | 702 to 831 | [05-runtime-and-execution/06-program-versions-runs-and-results.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) | 123 to 252 | 3162 | `db8115dd32e7487c4e7c7678dffb028921e4a2ec0058198530df5d2126e6c514` |
| `behavioural-specification.md` | 501 to 552 | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 182 to 233 | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 182 to 233 | 1226 | `8664296f87d7958cb9014898f7d4e984db63f984f65d3787cfb1ed406a3e31a2` |
| `behavioural-specification.md` | 553 to 655 | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 234 to 336 | [05-runtime-and-execution/06-program-versions-runs-and-results.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) | 11 to 113 | 2992 | `4f315eaf0638d967654f019eab07ceeea0c70c151fdb53b3560628fbe4cdaeda` |
| `behavioural-specification.md` | 700 to 742 | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 342 to 384 | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 244 to 286 | 2131 | `e324d933d50937bb58e395d8f6981bdfd8d21b973ed0df1b8df26d2ae12d5f6c` |
| `behavioural-specification-2.md` | 1 to 65 | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 391 to 455 | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 293 to 357 | 2135 | `f900e68d99451a3566175fc9e69fd2329beb5415633b9942aec9d457631ad3cd` |
| `behavioural-specification-2.md` | 189 to 253 | [05-runtime-and-execution/01-generalized-agent-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) | 838 to 902 | [05-runtime-and-execution/01-generalized-agent-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) | 707 to 771 | 2055 | `413660f24d1fd46460e409588578f3827235db7a4eb549445d2a378191847b8d` |
| `behavioural-specification-2.md` | 254 to 333 | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 462 to 541 | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 364 to 443 | 3051 | `3c7256504b706c40f7a6aa7f5ba70da8bdb65aeeb7d5c9666647306c228affa9` |
| `behavioural-specification-2.md` | 410 to 432 | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 547 to 569 | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 449 to 471 | 598 | `b176008e0a8f953485b1a66d077f3ccffff9438f422219fef1ad6b97af115d1b` |
| `behavioural-specification-2.md` | 453 to 471 | [05-runtime-and-execution/01-generalized-agent-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) | 903 to 921 | [05-runtime-and-execution/01-generalized-agent-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) | 772 to 790 | 537 | `942291f4454c88248a4af147a118aca0f521243d3bdc2a6154570d1c5540926e` |
| `behavioural-specification-2.md` | 486 to 523 | [05-runtime-and-execution/01-generalized-agent-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) | 922 to 959 | [05-runtime-and-execution/06-program-versions-runs-and-results.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) | 258 to 295 | 664 | `ca3af9b128a6355244bcdb7cc2105be0906c38af95ec5ea17d08085e10e4efc6` |
| `behavioural-specification-2.md` | 524 to 846 | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 578 to 900 | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 480 to 802 | 12245 | `ffc0088e8bd36f84abed66dd1ad25f37b0b5da93ca878ac8ae973cc146bbee01` |
| `behavioural-specification-2.md` | 893 to 927 | [05-runtime-and-execution/01-generalized-agent-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) | 966 to 1000 | [05-runtime-and-execution/06-program-versions-runs-and-results.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) | 302 to 336 | 774 | `3ed265c21a640b6b3ff6764d4555db045ba5327c31371bcd235e61c4da4e8887` |
| `behavioural-specification-2.md` | 1091 to 1154 | [05-runtime-and-execution/01-generalized-agent-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) | 1001 to 1064 | [05-runtime-and-execution/06-program-versions-runs-and-results.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) | 337 to 400 | 1078 | `2fc269281a968ef85a84a1d2b0ff54cbd7765353cbc5333c31ba578cc329da93` |
| `behavioural-specification-2.md` | 1155 to 1221 | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 910 to 976 | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 812 to 878 | 1738 | `84582dcabed914115194f6c507bdd09bc7128b32c80811094aa25fa8f90c544c` |
| `behavioural-specification-2.md` | 1281 to 1292 | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 982 to 993 | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 884 to 895 | 1071 | `04861923d726ad3366d9457657b2742021beb0aecbbabd69af28f4a4f77f4709` |

### New navigation and separate comments


New navigation and replacement links total 39 logical lines and 4,161 bytes. They retire seven earlier navigation lines totaling 1,259 bytes. Index edits, new comments, and original dialogue text are excluded from those counts.

| Block | Note | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| main overview | [05-runtime-and-execution/06-program-versions-runs-and-results.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) | 1 to 10 | 10 | 830 | `0eee4bfc40fe69d5f011c9ac9f872bd9b1ed9faf49e81d4438dfbad7e90042db` |
| initial graph context | [05-runtime-and-execution/06-program-versions-runs-and-results.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) | 114 to 117 | 4 | 161 | `e9b761516a6af397cbf6b521358d5c7d1c95741962c0556e11d13bb0a0903b8e` |
| later history context | [05-runtime-and-execution/06-program-versions-runs-and-results.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) | 254 to 257 | 4 | 362 | `37da4d441c6635d303d2248db7aa8bf19d491f94d2fa92facd66efe2bf736b48` |
| hub-lifecycle-link | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 234 to 238 | 5 | 506 | `fc3c3f2292bc54d6498b2879aabe4383b9ca56dd7db3cdf15cc6b591a5dfa7e2` |
| runtime-history-link | [05-runtime-and-execution/01-generalized-agent-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) | 697 to 701 | 5 | 482 | `37d90f8ca8d1254077040d48066b6001de96a9a6741496240f582a2224235841` |
| runtime-later-history-link | [05-runtime-and-execution/01-generalized-agent-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) | 791 to 794 | 4 | 505 | `237ba271f955bf4b14e7538a33fd08b3ffb45883400bf1b43750553737630223` |
| hub-graphs-link | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 178 to 178 | 1 | 141 | `bfc7b61287d2c88ac3819e746da2775d6643071dad682d7b740ab5108ab56e5c` |
| hub-repair-link | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 179 to 179 | 1 | 150 | `4cbd902b551ebba24253901d429c05512fbac242a3ceed54dc76ff28acf4208b` |
| hub-branches-link | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 180 to 180 | 1 | 172 | `731326d5d44321fce57615bce1b68300aa6573e12268a034299491e67d45c829` |
| hub-derivation-link | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 478 to 478 | 1 | 136 | `7f748d139d95b7a01200d40a8ed274aacdf0bdd34aeedaa766c6cd3835f9073a` |
| hub-run-link | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 807 to 807 | 1 | 134 | `0b6a2b58756b8930a916c77dc52151d12b5a8e79c784aabf6fedbb82519ce334` |
| hub-gates-link | [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 810 to 810 | 1 | 159 | `2ab55066f41b7acbc79a3c096d6fc0bd1d853908e89b1f9795dcbaf00401fdce` |
| verification-gates-link | [01-foundations/09-verification-and-acceptance.md]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | 16 to 16 | 1 | 423 | `31964ffab23b993ff50e7aef9e94d9952a7c1ca42d52d5f62cc5f25ff0b45341` |

The initial 18-line scaffold is distributed across new-note lines 1 to 10, 114 to 117, and 254 to 257. Concatenating those ranges gives 1,353 bytes and SHA-256 `a505860ecf6c03f537fd1aeb29443ef83c37afcb6d0496929f8d094f5aa5cf2c`, exactly matching the scaffold before any moves.

The sibling comments file contains 76 logical lines and 6,477 bytes of new commentary. It distinguishes program changes from repeated runs, explains the record names without assuming they are identical types, and raises questions about acyclic history links, changed inputs and acceptance, retries, branch joins, evidence support, and replay. No runtime or implementation was built. The comments make proposals rather than reporting established requirements.

The retired navigation below is preserved in retirement order: behavioral-compilation lines 178, 179, 180, 478, 807, and 810 in this stage, followed by verification line 16. The combined seven lines have SHA-256 `039f2d7372f198938faca128d59592d10dc055ae4363fb62cb980106720bb231`.

```text
- [Section 7. Separate graphs](../05-runtime-and-execution/01-generalized-agent-runtime.md#7-you-probably-need-three-graphs-not-one)
- [Section 8. Immutable repair attempts](../05-runtime-and-execution/01-generalized-agent-runtime.md#8-repair-loops-and-a-dag-are-compatible)
- [Section 9. Alternatives and branches](../05-runtime-and-execution/01-generalized-agent-runtime.md#9-alternatives-complements-and-branches-must-not-be-conflated)
- [Artifact derivation history](../05-runtime-and-execution/01-generalized-agent-runtime.md#dag-versus-evolving-artifact-graph)
- [Stage 6. Execution and traces](../05-runtime-and-execution/01-generalized-agent-runtime.md#6-execute-and-retain-the-trace)
- [Related graphs and downstream gates](../05-runtime-and-execution/01-generalized-agent-runtime.md#the-dag-should-probably-be-several-related-graphs)
The later [lifecycle proposal](../03-language-and-compiler/11-behavioral-compilation-and-specification.md#a-proposed-lifecycle) distinguishes candidate results, compiled programs, successful runs, and accepted artifacts. Its [downstream gates](../05-runtime-and-execution/01-generalized-agent-runtime.md#the-dag-should-probably-be-several-related-graphs) depend on exact artifact revisions and acceptance purposes.
```


All original-content moves and navigation replacements used the move script. New navigation was created with `apply_patch` in temporary files, then moved into the notes. Retired navigation was moved into a temporary file and archived above. Temporary helpers are removed only after their contents are inserted or recorded. No original note is deleted.

### Reconstruction and balance checks


All 19 originals in the preceding checked mapping set reconstruct exactly again, totaling 658,195 bytes. Each original range matches its historical source bytes, and the ranges are complete and contiguous in original-line order, without gaps or overlaps. The two behavioral-specification originals use Git revision `[repository fingerprint omitted]`; the other originals use `[repository fingerprint omitted]`. This check covers the existing 19-source mapping set, not every original dialogue in the former collection.

The three previous source-bearing notes contained 79,531 bytes and 2,337 logical lines. After adding 4,161 navigation bytes and retiring 1,259, those notes and the new dialogue note contain 82,433 bytes. Their line count balances as 2,337 plus 39 minus 7, giving 2,369 logical lines. The new comments add another 6,477 bytes and 76 lines. The index and audit are recorded separately.

### Whole-note checksums


| Note | Logical lines | Bytes | SHA-256 | Final newline |
|---|---|---|---|---|
| [00-index.md]({{< ref "ai/design-research/00-index" >}}) | 103 | 18599 | `0832bd5b9a67f3c6f9d9df1b513a315a4fbbe0fe1485dfe270918dc5acc5d3f3` | Present |
| [01-foundations/09-verification-and-acceptance.md]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | 280 | 11359 | `05d1e4d295a1849072eab1d4d35886691d0dad17a94976b86bed903527e8c634` | Present |
| [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 895 | 36654 | `a3e7233e055bbdce8cdd35923aa17aa45cfae86af9e13a57c6ee4ab1b5794ebb` | Absent |
| [05-runtime-and-execution/01-generalized-agent-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) | 794 | 23566 | `c862df726f0c44b19ea8d023f62ed8aa111d5f1be30eab62a7cd4dec2681e0dc` | Present |
| [05-runtime-and-execution/06-program-versions-runs-and-results.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) | 400 | 10854 | `3c23915f962e5b5b576977b42e3b80b2e085e78f581a9eebf4804e93ba2d22fa` | Present |
| [05-runtime-and-execution/06-program-versions-runs-and-results-comments.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results-comments" >}}) | 76 | 6477 | `9e639681e6a6412e5013a14b998a4fc0325fe54e546e87229575bbe74251df68` | Present |

### Links, whitespace, and workspace checks


Before this audit was appended, all 746 internal Markdown links across 50 collection Markdown files resolved, including heading anchors. All checked code fences close, and the affected notes have no missing or duplicate footnote definitions. External URLs, legacy wiki references, attached domain guides, and cited literature claims were not independently verified.

The tracked whitespace check passes. The new dialogue note retains an original blank line at EOF at line 400, corresponding to `behavioural-specification-2.md` original line 1154, previously at runtime line 1064. The verification note retains its earlier original blank line at EOF. Existing source trailing spaces and the behavioral-compilation note's missing final newline remain intact. The new comments contain no whitespace warnings. No original whitespace was trimmed.

The index adds the dialogue note to the runtime collection and reading path, links its sibling comments, and updates the behavioral-compilation and runtime descriptions. All existing note entries remain. The previous overview and verification rearrangements, unrelated notes, and redirects remain unchanged.

The previous 274231 audit bytes remain an unchanged prefix, with SHA-256 `604bc0370c1f988e7104324d1b23a180fb854290fee238393dcf4554d4cea24e`. The move script is unchanged, with SHA-256 `402ff2e48ddf908900a296236ec9758b27f72d39d4bac28511359f860efe17d5`. All 71 snapshot files outside the affected notes, index, and audit retain their previous bytes and permission bits.

The preexisting worktree changes were preserved. HEAD remains `[repository fingerprint omitted]`. Git index bytes and staged entries remain unchanged. No staging or commits were performed.

Plain-writing (archived source 003) guided only new comments, navigation, index, and audit prose. It did not alter the retained dialogue text.

Earlier stage tables describe historical states. This section records the current program-history reassembly and separate new commentary.

## Second reassembly session, stage 4: Tickloom case study and database interview


Date: 2026-09-30. The user approved separating the worked Tickloom example from the general compiler and kernel notes and placing the NoSQL interview exchange beside the other database discussions. The approval includes a sibling comments document. Evaluation-plan rearrangement remains a later step.

The new [03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl.md]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl" >}}) keeps the captured article's semantic model, quorum-store code, abstractions without a DSL, imperative test, corresponding DSL test, and generated quorum-read scenario together in their original order. The article metadata, reliability argument, and presentation example remain in the reliability note. The general compiler design and kernel design remain in their existing notes.

The NoSQL, optimizer, transaction, developer-experience, and JSON exchange is now between the specialized-engine/DBOS and text-to-SQL/RUBICON passages in [05-runtime-and-execution/02-database-centered-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}). The technical interview passages follow their original interview order, with speaker labels and qualifications retained. The captured interview's history and research/career passages remain in its source note.

The sibling [03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl-comments.md]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl-comments" >}}) contains new explanations and open questions. It distinguishes a valid declaration, a correctly requested test, an observed result, and wider algorithm correctness. The comments are not original source text or an agreed implementation specification. No Tickloom code was compiled or executed, and no external claims were independently verified during the rearrangement.

### Applied content moves


The selected blocks were moved with `_scripts/move_text.py --apply`. Each move was dry-run first, then both resulting files were compared with an independently calculated byte splice. Source ranges below refer to the pre-stage notes. The scenario block was appended before the semantic-model block was inserted ahead of it.

| Order | Source note | Previous lines | Receiving note | Receiving lines at insertion | Current lines | Lines | Bytes | SHA-256 at move |
|---|---|---|---|---|---|---|---|---|
| 1 | [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1137 to 1179 | [05-runtime-and-execution/02-database-centered-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 449 to 491 | 449 to 491 | 43 | 5030 | `cfce3f161daf7b8ffff0f6e0aad1d243012c41dd0c2906c299d848cf7e44013e` |
| 2 | [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1023 to 1132 | [03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl.md]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl" >}}) | 15 to 124 | 91 to 200 | 110 | 7514 | `c6b71a56f83355357da7190fd7c1ffdc0621f3b3b842ad510196c89fa2768f8b` |
| 3 | [03-language-and-compiler/07-semantic-kernel.md]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 381 to 456 | [03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl.md]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl" >}}) | 11 to 86 | 11 to 86 | 76 | 6756 | `d8b6470568ac0a294ef02dbe97ef81b4aaebd5a111c1706ce99d74529b1ca285` |

The selected blocks contain 229 logical lines and 19,300 bytes. Of those, 220 lines and 18,170 bytes are original source text. The remaining nine lines and 1,130 bytes are earlier interview navigation. Only two navigation lines within the moved interview block were later replaced. Restoring their archived text reproduces the entire 5,030-byte block exactly. Both moved article blocks remain unchanged in their entirety.

### Current moved-original mapping


The ranges below exclude all added navigation and separators.

| Original source | Original lines | Current note | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|---|
| `dsl-approach/DSLs Enable Reliable Use of LLMs.md` | 104 to 179 | [03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl.md]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl" >}}) | 11 to 86 | 76 | 6756 | `d8b6470568ac0a294ef02dbe97ef81b4aaebd5a111c1706ce99d74529b1ca285` |
| `dsl-approach/DSLs Enable Reliable Use of LLMs.md` | 180 to 289 | [03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl.md]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl" >}}) | 91 to 200 | 110 | 7514 | `c6b71a56f83355357da7190fd7c1ffdc0621f3b3b842ad510196c89fa2768f8b` |
| `Data Renegades  Ep. 11, Contrarian Bets and AI Skepticism with Michael Stonebraker.md` | 153 to 186 | [05-runtime-and-execution/02-database-centered-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 455 to 488 | 34 | 3900 | `a841abae799cd56900841ee1779c0574974c2e9929f20febbe666c7a876240fd` |

The original interview ranges 91 to 152, 153 to 186, and 187 to 258 now occur in the database note at lines 387 to 448, 455 to 488, and 498 to 569. Added section context separates the passages, without changing their source order.

### Preserved pre-stage note text


The complete text of all six affected content notes reconstructs exactly from the retained and moved text after restoring the earlier navigation below. The index matches the five planned navigation edits. Original code, article claims, LLM proposals, interview wording, and whitespace were not rewritten.

| Previous note | Logical lines | Bytes | SHA-256 | Reconstruction |
|---|---|---|---|---|
| [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1179 | 40584 | `ddc8c569e18655523cf73342a5efd59240dcd161d7b1cf53ccedd6415f44dd3e` | Exact |
| [03-language-and-compiler/07-semantic-kernel.md]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 516 | 16107 | `2445ea460d7f7dbe165d059610daa23e654af52327bc8ebbaec05dfa017af5a0` | Exact |
| [05-runtime-and-execution/02-database-centered-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 574 | 31411 | `ddb78e9b3a4bd46a48657411c8869eb9a839504d8700afaefab544cd5c899811` | Exact |
| [03-language-and-compiler/01-dsl-reliability.md]({{< ref "ai/design-research/03-language-and-compiler/01-dsl-reliability" >}}) | 95 | 7460 | `ac984be1986b08c8f6609aae7e94017892626ad7450b269a55d9a9199bee9a6e` | Exact |
| [01-foundations/08-semantic-substrate-builder-method.md]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | 410 | 21904 | `a8b36484818f0c5a2afd6674eed2f83828d054eaa2b2b51d4ac99b9732279cf8` | Exact |
| [07-sources/01-stonebraker-data-renegades-transcript.md]({{< ref "ai/design-research/07-sources/01-stonebraker-data-renegades-transcript" >}}) | 249 | 21638 | `8c8e5f66a43594e880f8e2eed69659d34cdaf36bfc5915946eb71ce3938671ae` | Exact |

The previous compiler note is reconstructed from current lines 1 to 1016, the archived six-line article context, new-case-study lines 91 to 200, the archived four-line article continuation, and database lines 449 to 491. The two replaced interview navigation lines in the last block must be restored first.

The previous kernel note is reconstructed from current lines 1 to 374, its archived six-line article context, new-case-study lines 11 to 86, its archived six-line return context, and current lines 380 to 433. The previous database note is reconstructed from current lines 1 to 448 and 492 to 617 after restoring current line 496. The reliability and builder notes each restore one archived navigation line; the source transcript restores two.

### Changed earlier-source positions


The six rows below supersede their earlier positions. All other original-source locations in the checked mapping set remain unchanged. No original range needed to be split in this stage.

| Original source | Original lines | Previous note | Previous lines | Current note | Current lines | Bytes | SHA-256 |
|---|---|---|---|---|---|---|---|
| `dsl-approach/db-approach.md` | 640 to 681 | [05-runtime-and-execution/02-database-centered-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 533 to 574 | [05-runtime-and-execution/02-database-centered-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 576 to 617 | 1347 | `c9195024e79cde8f44b208e11d9f4f9b3be2b48762811276d7b8958f4e3058bd` |
| `semantic-kernel.md` | 565 to 618 | [03-language-and-compiler/07-semantic-kernel.md]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 463 to 516 | [03-language-and-compiler/07-semantic-kernel.md]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 380 to 433 | 1221 | `679ca7103f5d1a1d4d38ee95c61a813162eb68d4b6ae685d6116ad653aa1a4f5` |
| `dsl-approach/DSLs Enable Reliable Use of LLMs.md` | 104 to 179 | [03-language-and-compiler/07-semantic-kernel.md]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 381 to 456 | [03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl.md]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl" >}}) | 11 to 86 | 6756 | `d8b6470568ac0a294ef02dbe97ef81b4aaebd5a111c1706ce99d74529b1ca285` |
| `dsl-approach/DSLs Enable Reliable Use of LLMs.md` | 180 to 289 | [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1023 to 1132 | [03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl.md]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl" >}}) | 91 to 200 | 7514 | `c6b71a56f83355357da7190fd7c1ffdc0621f3b3b842ad510196c89fa2768f8b` |
| `Data Renegades  Ep. 11, Contrarian Bets and AI Skepticism with Michael Stonebraker.md` | 153 to 186 | [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1143 to 1176 | [05-runtime-and-execution/02-database-centered-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 455 to 488 | 3900 | `a841abae799cd56900841ee1779c0574974c2e9929f20febbe666c7a876240fd` |
| `Data Renegades  Ep. 11, Contrarian Bets and AI Skepticism with Michael Stonebraker.md` | 187 to 258 | [05-runtime-and-execution/02-database-centered-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 455 to 526 | [05-runtime-and-execution/02-database-centered-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 498 to 569 | 7380 | `d043a0dd97136f6647c9934d7d8785c6add0f56fda7c0d3eefddfafc5f0dc044` |

### New navigation and separate comments


The final new scaffold and replacement navigation contain 35 logical lines and 5,450 bytes. They replace 29 earlier navigation lines totaling 5,525 bytes. Index edits, new comments, and original source text are excluded from those counts.

| Block | Note | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|
| case-study overview | [03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl.md]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl" >}}) | 1 to 10 | 10 | 766 | `5e927ee9da939adccd410a358ece0bd79c4e4bbbe47b7f63004b630732278f6a` |
| scenario transition | [03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl.md]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl" >}}) | 87 to 90 | 4 | 327 | `64b1f5b22bc6034159cd02fc57f3d20604ef81d4d6cbce3b2722c61095ef141a` |
| kernel-case-link | [03-language-and-compiler/07-semantic-kernel.md]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 375 to 379 | 5 | 335 | `89e3c879c7fcfd7924ac70c8bb95affb110612c9179fc2b73f49aa671745b7a1` |
| compiler-case-link | [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1017 to 1021 | 5 | 403 | `b655ad35e6950a1ea8b4fcd58a56cffabd4b247027f5a591acee3a62a40cb39c` |
| compiler-interview-link | [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1022 to 1025 | 4 | 405 | `edc2490c06abd05fa43508ca5cc4b1a728fd0b1ce98d13977616e1c4488ad3f4` |
| database-interview-context | [05-runtime-and-execution/02-database-centered-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 453 to 453 | 1 | 520 | `8dbb4def5606aa620fc27282c9fa859ac8f4f067d2cdcb3bdfdbaa05e88b32fc` |
| database-interview-continuation | [05-runtime-and-execution/02-database-centered-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 491 to 491 | 1 | 212 | `e27c98279876df238683cb662518c11cab0d0b30bd7184cb9d797a587288affb` |
| database-sql-context | [05-runtime-and-execution/02-database-centered-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 496 to 496 | 1 | 420 | `786c7b568acb367a39cef86b36d78fed4fbb7c5951927ea5768e7b81c68eadbe` |
| reliability-case-continuation | [03-language-and-compiler/01-dsl-reliability.md]({{< ref "ai/design-research/03-language-and-compiler/01-dsl-reliability" >}}) | 95 to 95 | 1 | 594 | `37600c1878b50ef0d9de847d049275948003f47e0007fd9133184819638c830a` |
| builder-case-continuation | [01-foundations/08-semantic-substrate-builder-method.md]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | 366 to 366 | 1 | 408 | `8e863ba6b65acd8f1ead54ad59e85370d977c9cdceba1c6ebd9fee4ab2c07d8a` |
| source-interview-overview | [07-sources/01-stonebraker-data-renegades-transcript.md]({{< ref "ai/design-research/07-sources/01-stonebraker-data-renegades-transcript" >}}) | 13 to 13 | 1 | 431 | `db2dca8dec1f4df5c47bc490f8bae97524fe2880e134195b2462e3b7b322a3b2` |
| source-interview-continuation | [07-sources/01-stonebraker-data-renegades-transcript.md]({{< ref "ai/design-research/07-sources/01-stonebraker-data-renegades-transcript" >}}) | 101 to 101 | 1 | 629 | `ca1be01572e993bb5b6118e0704a4dfcdef02692aea8ed9e637084ec03d5d35b` |

The initial 14-line case-study scaffold is distributed across current lines 1 to 10 and 87 to 90. Concatenating those ranges reproduces its 1,093 bytes exactly, with SHA-256 `b5caf82143fd11aeb6addb753a3d6d7cac51bbe7b1dfa7e7d1c01dc77405dc46`.

The sibling comments contain 49 logical lines and 4,365 bytes of new prose. They explain the grouping and propose separate checks for compilation, requested scenario, observed behavior, and coverage. They also raise questions about measuring the reliability claim and defining the boundary for generated Java. Their proposed comparison is not an experiment performed here.

The retired navigation below remains in retirement order. The first ten lines are the compiler's former article context and continuation, at pre-stage lines 1017 to 1022 and 1133 to 1136. The next twelve lines are the kernel's former article context and return, at pre-stage lines 375 to 380 and 457 to 462. The final seven lines are the moved interview context and continuation, the database text-to-SQL context, the reliability continuation, the builder continuation, and source-transcript lines 13 and 101. Their combined SHA-256 is `1dd5165a23d14e54c11e478a7df04a5cd70854ad8d601f71c949d0494f2776ed`.

```text
<!-- Navigation added during reassembly on 2026-09-30. Original source text is unchanged. -->

## Scenario DSL example from the captured article

The following case study comes from the captured article ["DSLs Enable Reliable Use of LLMs"](01-dsl-reliability.md), whose [Tickloom semantic model and quorum-store example](07-semantic-kernel.md#semantic-model-example-from-the-captured-dsl-article) provide the preceding context. The imperative test, matching DSL test, generated read scenario, and original source links remain together. The compiler checks the declared grammar; the earlier discussion in this note keeps compilation separate from domain correctness.

<!-- Navigation added during reassembly on 2026-09-30. Original source text is unchanged. -->

The article concludes with [LLM roles during design and use](../01-foundations/08-semantic-substrate-builder-method.md#two-phases-working-with-llms) and [the DSL as the source of truth](03-declarative-programming-model.md#the-dsl-as-the-source-of-truth). The wording of the case study above is unchanged.

<!-- Navigation added during reassembly on 2026-09-30. Original source text is unchanged. -->

## Semantic model example from the captured DSL article

The following section comes from the captured article ["DSLs Enable Reliable Use of LLMs"](01-dsl-reliability.md). The preceding [presentation example](01-dsl-reliability.md#example-using-llms-to-generate-diagram-rich-powerpoint-presentations) remains in the reliability note. The complete Tickloom model, quorum-store prompt and code, and discussion of abstractions without a DSL remain together below.

<!-- Navigation added during reassembly on 2026-09-30. Original source text is unchanged. -->

## Return to the kernel design dialogue

The article continues with the [scenario DSL case study](02-typed-dsl-and-compiler.md#scenario-dsl-example-from-the-captured-article). The following implementation roadmap resumes the original semantic kernel dialogue.

The following exchange comes from the [captured Data Renegades interview with CL Kao and Michael Stonebraker](../07-sources/01-stonebraker-data-renegades-transcript.md). The preceding [specialized-engine and DBOS discussion](../05-runtime-and-execution/02-database-centered-runtime.md#specialized-engines-and-dbos-from-the-stonebraker-interview) is in the database runtime note. Speaker labels, follow-up questions, and the complete transaction, optimizer, developer-experience, and JSON discussion remain unchanged. The passages are interview claims, separate from the LLM dialogue and article excerpts above.
The interview continues with [text-to-SQL failures, RUBICON, and benchmark comparisons](../05-runtime-and-execution/02-database-centered-runtime.md#text-to-sql-rubicon-and-benchmarks-from-the-interview). The next exchange refers back to the NoSQL discussion above.
The intervening [NoSQL and compiler exchange](../03-language-and-compiler/02-typed-dsl-and-compiler.md#nosql-sql-optimizers-and-transactions-from-the-interview) is in the compiler note. The complete discussion below keeps Stonebraker's reported warehouse results, failure causes, human metadata requirements, RUBICON example, BEAVER and DAB comparisons, and qualifications together. The claims retain their original wording and interview attribution.
The article continues with the [Tickloom semantic model](07-semantic-kernel.md#semantic-model-example-from-the-captured-dsl-article) and the [complete scenario DSL case study](02-typed-dsl-and-compiler.md#scenario-dsl-example-from-the-captured-article). The closing discussions of [LLM roles during design and use](../01-foundations/08-semantic-substrate-builder-method.md#two-phases-working-with-llms) and [the DSL as the source of truth](03-declarative-programming-model.md#the-dsl-as-the-source-of-truth) are also preserved in related notes.
The article's intervening examples are now in [DSL reliability](../03-language-and-compiler/01-dsl-reliability.md#example-using-llms-to-generate-diagram-rich-powerpoint-presentations), [Semantic kernel](../03-language-and-compiler/07-semantic-kernel.md#semantic-model-example-from-the-captured-dsl-article), and [Typed DSL and compiler](../03-language-and-compiler/02-typed-dsl-and-compiler.md#scenario-dsl-example-from-the-captured-article). The closing discussion of the two phases follows.
The source note retains the original episode metadata, database history, research and career discussion, and interview closing. The technical exchanges are now in [Database-centered runtime](../05-runtime-and-execution/02-database-centered-runtime.md#specialized-engines-and-dbos-from-the-stonebraker-interview) and [Typed DSL and compiler](../03-language-and-compiler/02-typed-dsl-and-compiler.md#nosql-sql-optimizers-and-transactions-from-the-interview). All passages remain attributed to the captured Data Renegades interview with CL Kao and Michael Stonebraker.
The preceding [specialized-engine and DBOS discussion](../05-runtime-and-execution/02-database-centered-runtime.md#specialized-engines-and-dbos-from-the-stonebraker-interview), [NoSQL and compiler exchange](../03-language-and-compiler/02-typed-dsl-and-compiler.md#nosql-sql-optimizers-and-transactions-from-the-interview), and [text-to-SQL, RUBICON, and benchmark discussion](../05-runtime-and-execution/02-database-centered-runtime.md#text-to-sql-rubicon-and-benchmarks-from-the-interview) are now in related notes. The interview resumes below with the complete venture, research, career, and closing exchanges.
```


One additional LF byte was initially added after the compiler's new closing navigation paragraph. It was moved out to remove a new blank line at EOF. The byte was new navigation, not original source whitespace, and is excluded from both final-navigation and retired-earlier-navigation counts. Its SHA-256 is `01ba4719c80b6fe911b091a7c05124b64eeece964e09c058ef8f9805daca546b`. The following fenced block preserves the one LF byte.

```text

```


All original-content and navigation changes used the move script. New navigation was created with `apply_patch` in temporary files, then moved into the notes. Retired navigation was moved into a temporary file and archived above. Temporary helpers are removed only after their contents are inserted or recorded. No original note is deleted.

### Reconstruction and balance checks


All 19 originals in the preceding checked mapping set reconstruct exactly again, totaling 658,195 bytes. Every mapped block matches its historical source bytes. Original ranges remain complete and contiguous in original-line order, without gaps or overlaps. The two behavioral-specification originals use Git revision `[repository fingerprint omitted]`; the other originals use `[repository fingerprint omitted]`. The reconstruction covers the existing 19-source mapping set, not every original dialogue in the former collection.

The six pre-stage source-bearing notes contained 139,104 bytes and 3,023 logical lines. Adding 5,450 final navigation bytes and retiring 5,525 gives 139,029 bytes in the affected content notes and new case study. The line count balances as 3,023 plus 35 minus 29, giving 3,029 logical lines. The comments add 4,365 bytes and 49 lines. The index and audit are recorded separately.

### Whole-note checksums


| Note | Logical lines | Bytes | SHA-256 | Final newline |
|---|---|---|---|---|
| [00-index.md]({{< ref "ai/design-research/00-index" >}}) | 104 | 19126 | `07d77694abf15de8fd714d7adc1d99b6171dabbde51ee29d1e9c928adaf8cc43` | Present |
| [01-foundations/08-semantic-substrate-builder-method.md]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | 410 | 21819 | `64ae5006d0f11cbd6344d9a89498508e83d256a2e4e130344982aef7665764a1` | Present |
| [03-language-and-compiler/01-dsl-reliability.md]({{< ref "ai/design-research/03-language-and-compiler/01-dsl-reliability" >}}) | 95 | 7509 | `1c9bfb3eb5a59a8cd90102f687a5be6052d542ca2ac94e62b839a978d39801df` | Present |
| [03-language-and-compiler/02-typed-dsl-and-compiler.md]({{< ref "ai/design-research/03-language-and-compiler/02-typed-dsl-and-compiler" >}}) | 1025 | 27780 | `5f2456123e2272b12680e5b13be9978219c740f11500f09be1a1753021e63fdd` | Present |
| [03-language-and-compiler/07-semantic-kernel.md]({{< ref "ai/design-research/03-language-and-compiler/07-semantic-kernel" >}}) | 433 | 8773 | `c00f902605226a6a935e8cc21caca46db6c580e06bb2358c813dfc0f87b673b5` | Absent |
| [05-runtime-and-execution/02-database-centered-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}) | 617 | 36266 | `baf531272f9a2f56ff497d817485e9201e4e636b03690d860d98a1a17a67d24a` | Absent |
| [07-sources/01-stonebraker-data-renegades-transcript.md]({{< ref "ai/design-research/07-sources/01-stonebraker-data-renegades-transcript" >}}) | 249 | 21519 | `4900e8d814bf61c2f229f43c306f7f38a33e43b79d1807a11e3be6b0c634e434` | Absent |
| [03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl.md]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl" >}}) | 200 | 15363 | `9668a8ad2e05fbee76f55d422173f5402182fd25a77b6c12f98f80050f5d6b60` | Present |
| [03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl-comments.md]({{< ref "ai/design-research/03-language-and-compiler/12-tickloom-semantic-model-and-scenario-dsl-comments" >}}) | 49 | 4365 | `678594198de3f2f8c6c6a3b3d2aad3f7838f33de71b24c2382669733d3e55104` | Present |

### Links, whitespace, and workspace checks


Before this audit was appended, all 820 internal Markdown links across 52 collection Markdown files resolved, including heading anchors. Checked code fences close, and the affected notes have no missing or duplicate footnote definitions. External URLs, legacy wiki references, cited claims, and repository contents were not independently verified.

The tracked whitespace check passes. The new case study retains original trailing spaces at lines 51, 52, 69, 70, and 135, corresponding to article lines 144, 145, 162, 163, and 224. Its blank line at EOF, current line 200, is original article line 289. The missing final newlines in the kernel, database, and source-transcript notes remain intact. New navigation and comments introduce no whitespace warnings. No original whitespace was trimmed.

The index adds the case study and sibling comments to the language collection and links the example from the reading path. The compiler and kernel descriptions now describe the general design notes, while the database description includes the restored NoSQL exchange. All existing note entries remain. Earlier rearrangements, unrelated notes, and redirects are unchanged.

The previous 298058 audit bytes remain an unchanged prefix, with SHA-256 `4c66d70c35839188d0f38fc240a429e2296d519c093720fad8c007261ff7b2b2`. The move script remains unchanged, with SHA-256 `402ff2e48ddf908900a296236ec9758b27f72d39d4bac28511359f860efe17d5`. All 70 snapshot files outside the affected notes, index, and audit retain their previous bytes and permission bits.

The preexisting worktree changes were preserved. HEAD remains `[repository fingerprint omitted]`, and Git index bytes and staged entries remain unchanged. No staging or commits were performed.

Plain-writing (archived source 003) guided only new comments, navigation, index, and audit prose. It did not change the retained dialogue, article, or interview text.

Earlier stage tables describe historical states. The mappings and checksums in this section record the current case-study and interview rearrangement.

## Second-pass stage 5: evaluation plans and collection review


Date: 2026-09-30. The user approved separating the evaluation material by research question, keeping the synthesis failure analyses beside their proposed tests, adding sibling comments, and recording an internal consistency review separately from the original dialogues.

### Scope and resulting notes


The former combined evaluation note now retains the complete runtime framework, including its cross-application metric table and numbered citation links. Two new notes contain the bounded-corpus investigation plan and the behavioral compilation failure analyses and synthetic experiment.

- [06-research-reports/07-investigation-evaluation-and-benchmarks.md]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) contains the unchanged investigation benchmark and evaluation passages.
- [06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}) contains the unchanged runtime evaluation passage and existing citation links.
- [06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes.md]({{< ref "ai/design-research/06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes" >}}) contains the unchanged initial failure analysis, later synthesis problems, and proposed UC-1 experiment.
- [06-research-reports/05-agent-runtime-evaluation-and-benchmarks-comments.md]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks-comments" >}}) contains new comments about the three plans, their evidence limits, and remaining experiment choices.
- [00-index-comments.md]({{< ref "ai/design-research/00-index-comments" >}}) contains the new collection review, separately from the retained dialogues.

The review records unresolved language and operator-extension choices, the limits of compiler validity, distinctions among coverage and provenance claims, acceptance and external-effect boundaries, graph relationships, replay, and missing evaluation designs. These are review findings and proposals, not newly accepted requirements. No first experiment, implementation, or research sequence was selected.

The local UC-1 separation note (archived source 001) was read and found to contain relevant result properties. That does not establish that it is the originally attached domain-model document. No matching UC-1 filename was found in the checked notes, source archive, and topics roots. The legacy [sensemaking redirect]({{< ref "ai/architecture-dsl-like/sensemaking" >}}) still names an outdated destination; the finding is recorded in the comments and the legacy note remains unchanged. External literature and benchmark claims were not independently checked.

### Moves from the combined evaluation note


The source is [06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}). The ranges below refer to its 386-line pre-stage state. The behavioral block was moved first, then the investigation block, so the second source range still referred to lines 1 to 88. Each invocation used the user's move script with a dry run followed by `--apply`.

| Pre-stage source lines | Destination | Current destination lines | Selected lines | Selected bytes | SHA-256 |
|---|---|---|---|---|---|
| 181 to 376 | [06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes.md]({{< ref "ai/design-research/06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes" >}}) | 9 to 204 | 196 | 6687 | `68bf42a8887e41082129281a8c658c82ed73e07c0390051421c5b3acc403c830` |
| 1 to 88 | [06-research-reports/07-investigation-evaluation-and-benchmarks.md]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) | 9 to 96 | 88 | 7754 | `4a360985e1ddca4234378a52449916eef33b57d59db842836f1f87d247a8df89` |

The selected blocks contain 284 lines and 14,441 bytes. Of these, 263 lines and 12,870 bytes are original source text. The remaining 21 lines and 1,571 bytes are earlier navigation and separators, which moved unchanged with their source context. No passage was duplicated or summarized in place of its original text.

Pre-stage runtime lines 89 to 180 now occupy lines 13 to 104. They include the 70-line original report passage and its previously added citation navigation. The former closing navigation at lines 377 to 386 now occupies lines 105 to 114, with its final link paragraph updated separately.

### Current original-source mappings


This table supersedes the earlier positions for these six blocks only. Every other block in the checked 19-source mapping set retains its preceding stage position and checksum.

| Original path | Original lines | Pre-stage evaluation lines | Current destination | Current lines | Original lines | Bytes | SHA-256 |
|---|---|---|---|---|---|---|---|
| `dsl-approach/deep-research-report-formatted.md` | 326 to 395 | 89 to 158 | [06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}) | 13 to 82 | 70 | 6831 | `c97ec28d481884a406651f82cfe3b8aca4d4f4061d84ff82bc468caa1322860c` |
| `dsl-approach/typed-durable-inspectable-runtimes-report.md` | 181 to 229 | 5 to 53 | [06-research-reports/07-investigation-evaluation-and-benchmarks.md]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) | 13 to 61 | 49 | 5711 | `457368a7200c14178cf29f2c03b068b66d9163f32e009c914556ffdc03adbcee` |
| `dsl-approach/typed-durable-inspectable-runtimes-report.md` | 334 to 368 | 54 to 88 | [06-research-reports/07-investigation-evaluation-and-benchmarks.md]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) | 62 to 96 | 35 | 1726 | `8f34f1d797cb6b3c40e5833009a6efec5276735c9450c4eee2b8486ca11c0849` |
| `behavioural-specification.md` | 656 to 699 | 186 to 229 | [06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes.md]({{< ref "ai/design-research/06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes" >}}) | 14 to 57 | 44 | 1894 | `9aaa017b30aca7e3e09f1782366a224ba2b5b3a7cd96e9c7e654d85ea832c38e` |
| `behavioural-specification-2.md` | 334 to 409 | 236 to 311 | [06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes.md]({{< ref "ai/design-research/06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes" >}}) | 64 to 139 | 76 | 1805 | `7c9fa42dcd304912a1cd367fcf964c06de6b80aa274a22856aa85a3905c94db2` |
| `behavioural-specification-2.md` | 1222 to 1280 | 318 to 376 | [06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes.md]({{< ref "ai/design-research/06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes" >}}) | 146 to 204 | 59 | 1734 | `6dff463033d68b4b359663329f092810eefe7614b3c394cf7311227d93c0c4d3` |

The two investigation blocks total 84 original lines and 7,437 bytes. The three behavioral blocks total 179 original lines and 5,433 bytes. The original runtime block remains in the runtime evaluation note, totaling 70 lines and 6,831 bytes.

### New and replaced navigation


The new investigation and behavioral notes each begin with eight new navigation lines. Twelve new lines introduce the runtime note. Seven earlier one-line navigation entries were replaced: two report links, three behavioral dialogue links, one verification-note link, and the runtime closing paragraph. Existing alias anchors in the typed report remain available.

| Note | Current lines | Lines | Bytes | SHA-256 |
|---|---|---|---|---|
| [06-research-reports/07-investigation-evaluation-and-benchmarks.md]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) | 1 to 8 | 8 | 527 | `c66884e4baa27b25aae7182dc211deae4cd5ef9b3199a009a97e7260515bed31` |
| [06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes.md]({{< ref "ai/design-research/06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes" >}}) | 1 to 8 | 8 | 540 | `748892632a0cca1751731466c73a4275d34024c7f4db2ea76d795dd40c81c47e` |
| [06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}) | 1 to 12 | 12 | 902 | `3bf905e163eec765775762bce11ba735dc28b55d39bfcf6c81f8e3ca4bc16805` |
| [06-research-reports/02-typed-durable-inspectable-runtimes.md]({{< ref "ai/design-research/06-research-reports/02-typed-durable-inspectable-runtimes" >}}) | 108 to 108 | 1 | 135 | `895092ae4c75c545ab3826bd56232e61517358b7882398c06672442a77c9aa6b` |
| [06-research-reports/02-typed-durable-inspectable-runtimes.md]({{< ref "ai/design-research/06-research-reports/02-typed-durable-inspectable-runtimes" >}}) | 124 to 124 | 1 | 108 | `f886edff439aa0a02277539de84011a446437d2924320cfd71220c99691f70cb` |
| [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 242 to 242 | 1 | 185 | `22566a37d0b9e55bd2ee84ba16bdb38956e80e6b28527d690c6c538b87433c0c` |
| [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 447 to 447 | 1 | 254 | `acdd21adb4ee4a9e46cdee2aca398744b394778ee23a2a02897f18e4aeb1a2a4` |
| [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 882 to 882 | 1 | 196 | `1350d93f76c006c94a25cf2987cf75fc7ba831c774069b9b2344f2d2bd96ece7` |
| [01-foundations/09-verification-and-acceptance.md]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | 34 to 34 | 1 | 360 | `aab83aed907104b0c011bc4608ddd6a85c04d1bb792c0ea93d20277014ca7a12` |
| [06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}) | 114 to 114 | 1 | 538 | `ee2d95f781e86f1953b411f897f52d828b87fc1cf476fe6da91e13f96f664748` |

These final navigation blocks total 35 lines and 3,745 bytes. They are separate from original source text.

The two new commentary files add 112 logical lines and 12,067 bytes: 47 lines and 5,141 bytes in the evaluation comments, and 65 lines and 6,926 bytes in the collection comments. They explain and qualify the retained proposals without rewriting them.

The seven retired navigation lines are archived below in replacement order. They formerly occupied typed-report lines 108 and 124; behavioral-note lines 242, 447, and 882; verification-note line 34; and combined-evaluation line 386. Their combined 1,255 bytes have SHA-256 `72fcb22cc268c081d71c46d7c60d3fae67ae850591c6964acb624181d7b3c9f8`. Each archived line was checked against its pre-stage snapshot.

```text
- <a id="benchmarks-and-datasets"></a>[Benchmarks and datasets](05-agent-runtime-evaluation-and-benchmarks.md#benchmarks-and-datasets)
- <a id="the-evaluation"></a>[The evaluation](05-agent-runtime-evaluation-and-benchmarks.md#the-evaluation)
[Section 13. Principal failure modes](../06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md#13-principal-failure-modes) is in the evaluation note.
[Underdetermination, oracle errors, and semantic equivalence](../06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md#the-fundamental-problems) are discussed in the evaluation note. The synthesis targets follow below.
[The complete synthetic clinical experiment](../06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md#best-first-experiment) is retained in the evaluation note.
- [Evaluation and benchmarks](../06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md) retains experiment designs and synthesis failure analyses.
[Verification and acceptance](../01-foundations/09-verification-and-acceptance.md) distinguishes compiler checks, result verification, acceptance for a purpose, and authorization for external effects. The experiment designs and synthesis failure analyses remain in this evaluation note.
```


All changes to source-bearing notes used `_scripts/move_text.py`. New navigation was created in temporary files with `apply_patch`, then moved into the notes. New comments and generated index prose used `apply_patch`. Each move had an independent byte-splice check. Temporary helpers are removed after insertion or archival. No original note is deleted.

### Reconstruction and balance checks


All 19 originals in the preceding checked mapping set reconstruct exactly again, totaling 658,195 bytes. Every mapped block matches its historical source, and each original's ranges remain complete and contiguous in original order, with no gaps or overlaps. The behavioral-specification originals use Git revision `[repository fingerprint omitted]`; the other originals use `[repository fingerprint omitted]`. This verifies the existing 19-source mapping set, not every original in the former collection.

The four pre-stage source-bearing notes contained 121,922 bytes and 1,836 logical lines. Adding 3,745 final navigation bytes and retiring 1,255 gives 124,412 bytes across those four notes and the two new source-bearing notes. The line count balances as 1,836 plus 35 minus 7, giving 1,864 logical lines. The two commentary files, generated index, and audit are counted separately.

The entire pre-stage combined evaluation note reconstructs exactly from the two moved blocks and the retained runtime blocks after restoring its retired closing navigation. Restoring only the replaced navigation also reconstructs the complete typed report, behavioral compilation note, and verification note exactly. The index matches the four planned navigation edits, with no unrelated changes.

### Whole-note checksums


| Note | Logical lines | Bytes | SHA-256 | Final newline |
|---|---|---|---|---|
| [06-research-reports/05-agent-runtime-evaluation-and-benchmarks.md]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks" >}}) | 114 | 10728 | `5015d21ec8f188aba4a1aeecedf5663fe092a0a4f22c72c335f9fdf4baaa7189` | Present |
| [06-research-reports/02-typed-durable-inspectable-runtimes.md]({{< ref "ai/design-research/06-research-reports/02-typed-durable-inspectable-runtimes" >}}) | 275 | 49893 | `249e52d3a94756ee1fc6b6a388b4da2c9af4ae6fdf4af33e3e64e8a502f42c0f` | Present |
| [03-language-and-compiler/11-behavioral-compilation-and-specification.md]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}) | 895 | 36723 | `114fd7d9e9e341ea605e9b337bdc7a6740af5375185b14ae7c8e62bd6291547c` | Absent |
| [01-foundations/09-verification-and-acceptance.md]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}) | 280 | 11560 | `81ce9de6583361b09ce0ff74d9a8ec82721547b96f881c21e42bc00de63c09f1` | Present |
| [06-research-reports/07-investigation-evaluation-and-benchmarks.md]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) | 96 | 8281 | `a92525204056a7030fad072f676ddec4b63b661844feab9da2601d64ea2f01de` | Present |
| [06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes.md]({{< ref "ai/design-research/06-research-reports/08-behavioral-compilation-evaluation-and-failure-modes" >}}) | 204 | 7227 | `f27e9ec5a1a0564344670a206193d75e0d50ffcbfa0a469eec3319bc69348a03` | Present |
| [06-research-reports/05-agent-runtime-evaluation-and-benchmarks-comments.md]({{< ref "ai/design-research/06-research-reports/05-agent-runtime-evaluation-and-benchmarks-comments" >}}) | 47 | 5141 | `cff0fc7176d86fe8672aaf4b9682a6c281b17e030f49451d47669069596b66bb` | Present |
| [00-index-comments.md]({{< ref "ai/design-research/00-index-comments" >}}) | 65 | 6926 | `02d68acb21e140bc09876cd5bc5f4c0e6f3838900f7c85a1c273c9e8e3016522` | Present |
| [00-index.md]({{< ref "ai/design-research/00-index" >}}) | 108 | 20159 | `44420ca9b95283de37d715547bab7e3722dc92b4a2b9f279257f67b4ba189ef5` | Present |

### Links, whitespace, and workspace checks


Before this audit was appended, all 920 internal Markdown links across 56 collection Markdown files resolved, including checked heading anchors. The checked code fences close, and the affected notes have no missing or duplicate footnote definitions. External URLs, legacy wiki references, and cited claims were not independently verified. The stale sensemaking redirect is recorded as a separate legacy navigation finding.

The tracked whitespace check passes. Both new source-bearing notes retain their original blank line at EOF. The behavioral compilation note retains its missing final newline. Original spaces and blank lines were not trimmed. New navigation and commentary introduce no trailing whitespace.

The index now names the three evaluation plans separately and links both commentary files. Existing note entries remain. The legacy redirects and all earlier commentary files remain unchanged.

The previous 324566 audit bytes remain an unchanged prefix, with SHA-256 `9c9e8493d0a8284d2af47ba2e43ab824c024cf2b7824a7c9589287bb422cac58`. The move script remains unchanged, with SHA-256 `402ff2e48ddf908900a296236ec9758b27f72d39d4bac28511359f860efe17d5`. All 74 snapshot files outside the affected notes, index, and audit retain their previous bytes and permission bits.

Preexisting worktree changes were preserved. HEAD remains `[repository fingerprint omitted]`; Git index bytes and staged entries remain unchanged. No staging or commits were performed.

Plain-writing (archived source 003) guided only new comments, navigation, index, and audit prose. It did not change the retained dialogue or report text.

Earlier stage tables describe historical states. The mappings and checksums in this section record the current evaluation rearrangement.

## Related-notes pass 1: complexity and work structure


Date: 2026-10-01. Only the first related source was split in this pass. The user approved the split and separate sibling comments. The next document has not been redistributed.

### Original and placement


The source was `archived source 023`, reached through the linked archive. Before the moves it contained 252 logical lines and 6,120 bytes, with SHA-256 `[private-source checksum omitted]`. Its final line had no newline.

The reply is not a new theory of complex adaptive systems. It proposes a profile for describing work, examples of requirements, and a possible work-model hierarchy. The profile, all three examples, continuity discussion, task versus execution distinction, and hierarchy remain together in [Complexity and work structure]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}). The complete requirements and checkpointing example belongs in the [builder-method note]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}#deriving-requirements-from-work-complexity). No comparison row or example was moved alone.

The [foundation comments]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure-comments" >}}) and [builder-method comments]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method-comments" >}}) are new commentary. They explain placement, limits of the proposed ratings, incomplete requirements coverage, conditions needed for recovery, and the untested automatic-derivation proposal. They do not change the original reply or select an experiment or architecture.

### Original-text mapping


All source ranges below refer to the original 252-line reply. Destination ranges describe the state at the end of this pass.

| Original lines | Destination | Destination lines | Original line count | Original bytes | Block SHA-256 |
|---|---|---|---|---|---|
| 1:72 | [01-foundations/10-complexity-and-work-structure.md]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}) | 11:82 | 72 | 2442 | `c6ddb177cdc1a36445853de759c169a79be8873c4fc9078831e89ae4eba7c2bc` |
| 73:135 | [01-foundations/08-semantic-substrate-builder-method.md]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | 13:75 | 63 | 1079 | `6718cee1c278ba39c6f71315fe37248f9b00e6d462e6fe48045b79e7a66d2eeb` |
| 136:175 | [01-foundations/10-complexity-and-work-structure.md]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}) | 87:126 | 40 | 794 | `f6c27b4f8ad2441bd26a700f7c7d139d2ac101c588dc3a2540c0d73f8ab4ad2d` |
| 176:203 | [01-foundations/10-complexity-and-work-structure.md]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}) | 127:154 | 28 | 740 | `2247f96d1131e26723f20360ad5d80b37c41d8a48374575ac6202953fad74c70` |
| 204:252 | [01-foundations/10-complexity-and-work-structure.md]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}) | 155:203 | 49 | 1065 | `5bccc7bcaae097971b466c79c853892e63ca630c0fe468b49ed52a5e4a886d48` |

The three physical source moves were original lines 136:252 to the new note's end, 73:135 to the builder note, and 1:72 before the new note's intervening navigation. The first move ended at new-note lines 87:203 after the opening block was inserted. Its 2,599 bytes have SHA-256 `3faf09cf9b5bd0eeead58f87d665f0cdfbd4df104c3218e9a886de5e0dec5e8e`.

The new note retains 189 original lines and 5,041 original bytes. The builder note receives 63 original lines and 1,079 original bytes. These sum to all 252 original lines and 6,120 original bytes. Reading the mapped blocks in source order reconstructs the original byte for byte, including blank lines and the missing final newline.

### New text and preservation checks


New foundation navigation occupies lines 1:10 and 83:86, totaling 14 lines and 1,020 bytes. New builder navigation occupies lines 7:12, totaling six lines and 496 bytes. HTML comments mark these introductions as new navigation.

The builder note's preexisting lines 1:6 stay at 1:6. Its preexisting lines 7:410 now occupy 76:479, a shift of 69 lines. Removing only the new 69-line insertion reconstructs the entire 21,819-byte pre-stage builder note, with SHA-256 `64ae5006d0f11cbd6344d9a89498508e83d256a2e4e130344982aef7665764a1`. Earlier audit tables record historical locations; they are not silently rewritten.

The source-bearing balance is 21,819 plus 6,120 original bytes, plus 1,516 new navigation bytes, giving 29,455 bytes across the two destinations. The line balance is 410 plus 252 original lines, plus 20 navigation lines, giving 682 logical lines. Comments, index prose, the source redirect, and this audit are separate.

The original path now contains an eight-line redirect, not a deleted file. It links both destinations, both comments, and this mapping. Its original permission bits, 0664, remain. Existing destination permission bits remain 0644; new notes use 0644.

Every source move and navigation insertion used `_scripts/move_text.py`, with a dry run before `--apply`. Each dry run was checked to make no writes, and each applied move was compared against an independently calculated byte splice. New helper files, comments, and generated index changes used `apply_patch`. Temporary helper files are removed after insertion.

The index adds this document to the reading path and foundations list and links both comment files. Another session had already added interactive-systems links to the index after the initial snapshot. Those edits were preserved. Comparing with the index immediately before this pass's own edits confirms only the four planned additions.

### Whole-note checksums


These checksums describe the files at this pass's verification point. Other editing sessions may later update shared navigation.

| Note | Logical lines | Bytes | SHA-256 | Final newline |
|---|---|---|---|---|
| Original path redirect (archived source 023) | 8 | 1028 | `[private-source checksum omitted]` | Present |
| [01-foundations/08-semantic-substrate-builder-method.md]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) | 479 | 23394 | `c983e5438625edd829481269aceabee2b833ca5914e0f6c3902080cb6d6253a2` | Present |
| [00-index.md]({{< ref "ai/design-research/00-index" >}}) | 115 | 21855 | `b1d320bb1dd0d1fac565ff80e7ff289eb665f36374ededcaf10d56f469aff8aa` | Present |
| [01-foundations/10-complexity-and-work-structure.md]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}) | 203 | 6061 | `b2064b5433540bce409e70d3d143388c57889e85b73264081b4cdb6c49010645` | Absent |
| [01-foundations/10-complexity-and-work-structure-comments.md]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure-comments" >}}) | 43 | 4410 | `6d4ec9b5cc0ba1f8add784e0ce94b62bc0b1272ceaf182d418322c3e3fda0d19` | Present |
| [01-foundations/08-semantic-substrate-builder-method-comments.md]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method-comments" >}}) | 33 | 3379 | `361e22544fb03a638741f77e03c8966a1ccf2732f56d722fc18a453304f9448a` | Present |

### Scope of verification


The complete original reply and the entire pre-stage builder note reconstruct exactly. All 55 baseline files outside the source, builder note, and index retained their bytes and permission bits before this audit was appended. This includes the unchanged prior audit and move script. It does not assert a fresh independent reconstruction of every historical source in earlier passes.

The prior 341,851 audit bytes remain an unchanged prefix, with SHA-256 `cd41d2f53076522bd27e98d32e43f1ccdd09f8d21c4fe6c15de3cd5589138dd0`. The move script remains unchanged, with SHA-256 `402ff2e48ddf908900a296236ec9758b27f72d39d4bac28511359f860efe17d5`.

New internal links are checked before handoff. External URLs, cited claims, and legacy wiki references are not independently verified. The broader link scan initially found two unrelated links to the interactive-systems audit while that sibling collection was being edited. Those links were not changed by this pass.

The tracked whitespace check passes. HEAD remains `[repository fingerprint omitted]`; Git index bytes and staged entries remain unchanged from the start of this pass. No staging or commits were performed.

Plain-writing (archived source 003) guided only new commentary and navigation. It did not alter the retained reply. The next source, long-running-init-reason.md (archived source 024), remains for a separate read and split decision.

## Related-notes pass 2: joint activity and collaboration patterns


Date: 2026-10-01. The user approved the proposed split of `ai/collab-and-joint-work/collab-transfer.md` and sibling comments. Only that dialogue was redistributed in this pass.

### Source and arrangement


The original contained 563 logical lines and 26,200 bytes, with SHA-256 `755cd1f2aebac12c1b285cfa818eec54ddfabaae749f5e1af0714f3060cd301b`. Its final line had no newline.

[Joint activity and collaboration model]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}) retains the opening framing, complete initial principles and contribution properties, coverage reasoning, full six-part discussion, and compact model. Earlier and later versions remain together, including the original `XXX` placeholder and literature attributions.

[Human-AI collaboration patterns]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}) retains the shared reasoning loop, complete Teresa-attributed discussion, and later derivation from distributed information, capability, judgment, and authority. The earlier eight-pattern discussion, proposed five-pattern core, and later seven-pattern derivation are not silently merged or normalized.

The [model comments]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model-comments" >}}) explain placement and distinctions between common ground and stored context, recurring mechanics and sequential stages, review and authority, and coverage and completeness. The [pattern comments]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns-comments" >}}) explain changes between the lists, overlapping patterns, selection limits, and different purposes of shared reasoning and joint construction. Comments are new interpretation, not original dialogue or verified research findings.

### Original-text mapping


Ranges refer to the original dialogue and the destinations at the end of this pass.

| Original lines | Destination | Destination lines | Original line count | Original bytes | Block SHA-256 |
|---|---|---|---|---|---|
| 1:114 | [02-human-ai-collaboration/05-joint-activity-and-collaboration-model.md]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}) | 11:124 | 114 | 5909 | `8e6695e8ef6f22d4e5128f61829066e63ae886c8919f185c54058c1968405a9b` |
| 115:308 | [02-human-ai-collaboration/05-joint-activity-and-collaboration-model.md]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}) | 125:318 | 194 | 9544 | `3b744454ed6912601813b40739c1b554e1a1f24d6bdc01b440ddd19f3d5a0f98` |
| 309:333 | [02-human-ai-collaboration/05-joint-activity-and-collaboration-model.md]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}) | 319:343 | 25 | 1739 | `6281caa4641a00be0f0348eb0552bf74260ba59cbe43b4990e67c9687372b4c7` |
| 334:426 | [02-human-ai-collaboration/06-human-ai-collaboration-patterns.md]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}) | 11:103 | 93 | 4287 | `82f8fe2201d4be1c3eb8327f31e170fdf57f4bdf2b3ea20ec3eb7f9699512546` |
| 427:563 | [02-human-ai-collaboration/06-human-ai-collaboration-patterns.md]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}) | 104:240 | 137 | 4721 | `3a087b28347138e210b3b8082c0e5a82be368f11e41daa7e9f2c289182290c3e` |

The physical original-text moves were lines 334:563 to the pattern note, then lines 1:333 to the model note. Both went after ten lines of new navigation. The model block contains 17,192 bytes, with SHA-256 `af5dc7e919af872de48d5c4129670f41f844ebba550e1e6e1cf9feedf92ef5f9`. The pattern block contains 9,008 bytes, with SHA-256 `75fb15a60dc9a1f9b0dad26776cd6d3ea3fe26daf5583ac3ac732c4fb651e923`.

Reading all mapped blocks in original order reconstructs all 26,200 bytes and 563 logical lines exactly. The ranges cover the original without gaps or overlaps. The original blank line at the end of the model block remains, and the original missing final newline remains at the end of the pattern note.

### Navigation and existing-note preservation


The model note has ten new navigation lines and 810 new navigation bytes. The pattern note has ten new navigation lines and 793 new navigation bytes. HTML comments identify the introductions as new text, and links connect the model, patterns, existing notes, comments, and source redirect.

The existing [augmentation note]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}) receives four new navigation lines and 400 bytes at lines 5:8, before `## first reasoning`. Its original lines 1:4 remain at 1:4, and original lines 5:395 now occupy 9:399. Removing only the new navigation reconstructs the complete pre-stage note, including its missing final newline, with SHA-256 `b4bfb08037870f00ab6e8bd83f23eb3854d7b6bcb65075077993d4a1d04b4bf5`. Earlier audit locations after its fourth line now shift by four lines; no historical table was silently rewritten.

The source-bearing balance is 26,200 plus 16,475 original bytes, plus 2,003 new navigation bytes, giving 44,678 bytes across the model, pattern, and augmentation notes. The line balance is 563 plus 395 original lines, plus 24 new navigation lines, giving 982 logical lines. Comments, index prose, source redirect, and audit are separate.

The original path now contains an eight-line redirect, rather than a deleted file. It links the two destinations, both comment files, and this mapping. Its original mode, 0664, remains. The augmentation note keeps mode 0644, and the new notes use 0644.

All original-text and navigation moves used `_scripts/move_text.py`. Every move had a dry run checked to make no writes and an applied move checked against an independently calculated byte splice. New files and generated index prose used `apply_patch`. The audit was appended from a temporary helper with the same dry-run and splice checks. Empty helpers are removed after use.

The generated index has only the three planned edits relative to its pre-stage bytes. The related-dialogues introduction and reading path now link the model and patterns. The human-AI collection list adds both notes and both comment files. Existing index content and preexisting worktree changes are preserved.

### Whole-note checksums


| Note | Logical lines | Bytes | SHA-256 | Final newline |
|---|---|---|---|---|
| [Original path redirect]({{< ref "ai/collab-and-joint-work/collab-transfer" >}}) | 8 | 965 | `5e0ed2e7f03ec9becd82ba765c70be34543a16d92096f4134a429de28001779d` | Present |
| [02-human-ai-collaboration/01-augmenting-human-work.md]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}) | 399 | 16875 | `0eea9dc2de6691cc50382344dfaebf0216c244c1cba4ef6c113ff776a4efbe3f` | Absent |
| [00-index.md]({{< ref "ai/design-research/00-index" >}}) | 117 | 23225 | `71fc5f390fc53180e4fe83cacba0d8fe3eeb4f9ab37beb5c037e56f1e47e498e` | Present |
| [02-human-ai-collaboration/05-joint-activity-and-collaboration-model.md]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}) | 343 | 18002 | `dab6eaf02d930d1b1cbabc7dc0a67dc266d798bfa7a244ff4c7e98da11ce826e` | Present |
| [02-human-ai-collaboration/06-human-ai-collaboration-patterns.md]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}) | 240 | 9801 | `fc23e5bf01888ebae4ebf1fe976fe95d13e0a100a664371a911b00c012d4c4d6` | Absent |
| [02-human-ai-collaboration/05-joint-activity-and-collaboration-model-comments.md]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model-comments" >}}) | 45 | 4520 | `fbe1dc997e52b2cf1f87515d7c4c1a726fd5ab01166c24e92e4f9e02c09e9d31` | Present |
| [02-human-ai-collaboration/06-human-ai-collaboration-patterns-comments.md]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns-comments" >}}) | 43 | 4300 | `30118a3c4b755ae6ffe324651a550f3effefc8712de98337e436519c3afba393` | Present |

### Verification scope and remaining work


The original dialogue reconstructs exactly, and the augmentation note's entire pre-stage text reconstructs exactly. Before this audit was appended, all 64 baseline files outside the source, augmentation note, and index retained their bytes and permission bits. After appending, the other 63 baseline files remain unchanged. The baseline covered the existing design-research collection, all three collaboration-source notes, the move script, and the long-running-work source and its comments.

The prior 350,313 audit bytes remain an unchanged prefix, with SHA-256 `616438eb264ae7cfa6eda4ccd54e0a035fbab5c42faacf10fc5fc8d7b4b4f3a4`. The move script remains unchanged, with SHA-256 `402ff2e48ddf908900a296236ec9758b27f72d39d4bac28511359f860efe17d5`.

Internal links and heading anchors are checked before handoff. Checked code fences close, and new prose has no trailing whitespace. The tracked whitespace check passes. Original spaces, blank lines, and missing final newlines were not normalized. External URLs, legacy wiki references, literature descriptions, and Teresa-attributed examples are not independently verified.

HEAD remains `[repository fingerprint omitted]`. Git index bytes and staged entries remain unchanged, and no staging or commits were performed.

Plain-writing (archived source 003) guided only the new commentary, navigation, and audit prose. It did not change the original dialogue. No experiment, architecture, or pattern-selection algorithm is adopted by the arrangement.

The earlier long-running-work reply (archived source 024) still has comments (archived source 016) only, and has not been redistributed. The other collaboration sources remain unchanged for separate review.

## Related-notes pass 3: interactive investigation position paper


Date: 2026-10-01. The user approved the proposed split of `ai/collab-and-joint-work/joint-and-collap-principles.md` and sibling comments. Only that source dialogue was redistributed in this pass.

### Original and arrangement


The original reply contained 398 logical lines and 18,500 bytes, with SHA-256 `22cd4af8a9634e8c07d83018ff43660ace6b7f028bc783a571d92f5551f13a0a`. Its first line was blank, and its final line had no newline. Both details remain in the retained text.

[Interactive investigation position paper]({{< ref "ai/design-research/06-research-reports/10-interactive-investigation-position-paper" >}}) retains the motivation, publication framing, critique of query-answer interaction, complete short literature review, seven principles, evaluation hypotheses and metrics, and closing argument. The paper remains a proposal, not an adopted research plan or a completed study.

The complete [interactive RAG and query-understanding examples]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}#interactive-rag-and-query-understanding) belong together in the existing retrieval note. The second example makes the information need editable, so the connection to the first example's retrieval plan remains visible. Neither example, diagram, nor comparison was divided.

The sibling [paper comments]({{< ref "ai/design-research/06-research-reports/10-interactive-investigation-position-paper-comments" >}}) explain the placement, claimed novelty, explicit engineering-cost inference, and untested evaluation hypotheses. The [retrieval comments]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections-comments" >}}) explain representation and evidence distinctions, interpretation revisions, correction scope, and outcomes still to measure. Comments are new interpretation, separate from original dialogue.

### Original-text mapping


All source ranges refer to the original 398-line reply. Destination ranges describe the end of this pass.

| Original lines | Destination | Destination lines | Original line count | Original bytes | Block SHA-256 |
|---|---|---|---|---|---|
| 1:124 | [06-research-reports/10-interactive-investigation-position-paper.md]({{< ref "ai/design-research/06-research-reports/10-interactive-investigation-position-paper" >}}) | 13:136 | 124 | 6398 | `b0febb9f24c7d7d832d0d05f675e061b8d575de071cfc5278737fdd73ff8f76a` |
| 125:200 | [06-research-reports/10-interactive-investigation-position-paper.md]({{< ref "ai/design-research/06-research-reports/10-interactive-investigation-position-paper" >}}) | 137:212 | 76 | 5643 | `f7b47229cc0be0729f791db6200f6b9dddff4bb32670e92cc8619305f06acc8a` |
| 201:281 | [04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections.md]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}) | 441:521 | 81 | 1865 | `a0101ae3367a30fe9b8ec4f565e0482225b37aaef0241419ab80356041e631a5` |
| 282:354 | [04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections.md]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}) | 522:594 | 73 | 2477 | `b6dfac42fbdd41f7ea3e606ae40a005e87d0e5614205b443c45508c8f53b736c` |
| 355:398 | [06-research-reports/10-interactive-investigation-position-paper.md]({{< ref "ai/design-research/06-research-reports/10-interactive-investigation-position-paper" >}}) | 217:260 | 44 | 2117 | `a8c94032f1f8d76512e4540ac58c9d79f2acc7386b894061240a06b08c0c86b3` |

The physical original-text moves ran from the end toward the beginning. Original lines 355:398 went to the paper note's end, 201:354 went to the retrieval note's end after its new section introduction, and 1:200 went before the paper note's bridge to the relocated examples. The initial 355:398 move occupied paper lines 17:60 before the opening block was inserted, and occupies 217:260 afterward.

The opening 1:200 block contains 12,041 bytes, with SHA-256 `9a3c020b159945da3c1396abb53e6050a9bda8741725702a02b9fe6577ae8d9a`. The complete 201:354 worked-example block contains 4,342 bytes, with SHA-256 `8415d66ece9f567f925792f46d7dae2bcb42075fd81e818d8615ddee6ab6ae89`. The final block contains 2,117 bytes. The logical table above records the smaller agreed pieces within the physical moves.

The paper retains 244 original lines and 14,158 original bytes. The retrieval note receives 154 original lines and 4,342 original bytes. Reading the mapped blocks in source order reconstructs all 398 lines and 18,500 bytes exactly, with no gaps, overlaps, or rewritten original text.

### New navigation and prior-note preservation


New paper navigation occupies lines 1:12 and 213:216, totaling 16 lines and 1,429 bytes. It links the relocated examples without replacing them with a summary. Original source lines 1:200 occupy 13:212, and the final 44-line block remains at the end without a final newline.

The retrieval note's existing 433 lines and 11,330 bytes remain an unchanged prefix, with SHA-256 `df573977188870f75140dfb6985a89dd7ce235c1b949d9ea9fc0704d7620d53e`. New navigation occupies 434:440, totaling seven lines and 500 bytes. The new section heading is at line 437, and the complete worked examples occupy 441:594. No earlier heading or original passage changed position.

The source-bearing balance is 18,500 plus 11,330 original bytes, plus 1,929 new navigation bytes, giving 31,759 bytes across the two destinations. The line balance is 398 plus 433 original lines, plus 23 navigation lines, giving 854 logical lines. Comments, generated indexes, the redirect, and this audit are separate.

The source path now contains an eight-line redirect linking the destinations, both comments, and the mapping. No original note path was deleted. Existing permission bits remain 0644, and new notes use 0644.

All original-text and source-bearing navigation moves used `_scripts/move_text.py`, with dry runs before `--apply`. Every dry run was checked to make no writes, and every applied move was checked against an independently calculated byte splice. New files and generated index prose used `apply_patch`. The audit was appended from a helper with the same dry-run and splice checks. Empty temporary helpers are removed after use.

### Index changes


The design-research index has only the three planned edits relative to its pre-stage bytes. Its investigation reading-path item links the paper and worked examples. The retrieval entry distinguishes the original visual-programming dialogue from the new import and links both mapping records. The reports list adds the paper and its comments.

The interactive-systems index has only its three planned edits. A related-reading paragraph links the paper, worked examples, and comments. The pending-pass introduction now acknowledges the completed principles split, and the source is removed from the awaiting-pass list. No other candidate is marked processed.

Preexisting index content and worktree changes were preserved. The seven principles remain distinct from the six collaboration mechanics, and the evaluation agenda remains distinct from the existing investigation benchmark.

### Whole-note checksums


| Note | Logical lines | Bytes | SHA-256 | Final newline |
|---|---|---|---|---|
| [Original path redirect]({{< ref "ai/collab-and-joint-work/joint-and-collap-principles" >}}) | 8 | 1054 | `fc1177a9aaa6e1d26d10dd44598d6a1253dbdf350c8db3619499f5137bdc7048` | Present |
| [04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections.md]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections" >}}) | 594 | 16172 | `9a0e594553738dce8496beafdbec8ebf1217d18ea542261d4cfc6a77cdf8d6e3` | Present |
| [06-research-reports/10-interactive-investigation-position-paper.md]({{< ref "ai/design-research/06-research-reports/10-interactive-investigation-position-paper" >}}) | 260 | 15587 | `613fa9be61c2ad9b8201f8a571a424f79294c5dad8882b110dbdbb2e8facf1fb` | Absent |
| [06-research-reports/10-interactive-investigation-position-paper-comments.md]({{< ref "ai/design-research/06-research-reports/10-interactive-investigation-position-paper-comments" >}}) | 43 | 4951 | `4e8c81b5eaf431e74a853e5e3c4419a9573ce9cbedd67f75c86cfced95411c57` | Present |
| [04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections-comments.md]({{< ref "ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections-comments" >}}) | 43 | 4674 | `94fc9e62c2648ace509b1f70e87693c6dce7114f206d028cca1d942aa90e9115` | Present |
| [00-index.md]({{< ref "ai/design-research/00-index" >}}) | 118 | 24459 | `6e21c26d0e26319d20077a77cb41d3fe927c79f35bf6bc38a7e15584804902a9` | Present |
| [Interactive systems index]({{< ref "ai/design-research/interactive-systems/00-index" >}}) | 37 | 4327 | `69668fb8a0efa153f98e2ebc89d00e21fd4c6f6c371e7c7e05dc9f0c4c2aa4a3` | Present |

### Reconstruction and verification scope


The current original reply reconstructs exactly, and the full pre-stage retrieval note remains an unchanged prefix. The earlier visual-programming source also reconstructs from its five historical mapped blocks, totaling 1469 lines and 32,504 bytes, with SHA-256 `441741dea228316e6c7f3911b6e6d15c2e674c160a607cf3a457e69e302b8c68`. Every historical block and destination prefix matches the existing interactive-systems JSON manifest.

The earlier interactive-systems audit and JSON manifest remain unchanged as records of their original stage. Their complete destination checksums describe that stage's file prefixes, not a claim that the retrieval note still has no later append. The current whole-note checksum and new ranges are recorded above. Verification does not claim a new reconstruction of every other historical source in design research.

Before this audit was appended, all 75 baseline files outside the source, retrieval note, and two indexes retained their bytes and permission bits. After appending, the other 74 baseline files remain unchanged. The baseline covered the existing design-research and interactive-systems collections, all three collaboration-source notes, the move script, and the long-running-work source notes and comments.

The prior 359,953 audit bytes remain an unchanged prefix, with SHA-256 `caffa37d090fab59f0254d70e30274d2cc5be8183dcdb2c2d8741a98456fb235`. The move script remains unchanged, with SHA-256 `402ff2e48ddf908900a296236ec9758b27f72d39d4bac28511359f860efe17d5`.

Internal links and heading anchors are checked before handoff. Checked code fences close, and new prose has no trailing whitespace. The tracked whitespace check passes. Original blank lines, spaces, mathematical notation, diagrams, and the missing final newline were not normalized.

External URLs, literature descriptions, product claims, novelty claims, and performance hypotheses are not independently verified. No paper, study, or implementation is selected by arranging the material.

HEAD remains `[repository fingerprint omitted]`. Git index bytes and staged entries remain unchanged. No staging or commits were performed.

Plain-writing (archived source 003) guided only the new commentary, navigation, and audit prose. It did not alter the retained reply. The earlier long-running-work reply remains comments only, and the other collaboration report remains for separate review.

## Related-notes pass 4: collaboration patterns research synthesis


Date: 2026-10-01. The user approved the proposed split of [human-ai-collaboration-patterns-report.md]({{< ref "ai/collab-and-joint-work/human-ai-collaboration-patterns-report" >}}) after the complete source was read and compared with the existing collaboration notes. The move script performed all original-text transfers, with a dry run followed by application and an independent byte-splice check.

### Original and arrangement


The original report contained 563 logical lines and 57578 bytes, with a final newline and mode 0664. Its SHA-256 was `061cb7a87d3d706b13f7926e3385b569d25f78ee001e5b2fcb88ca9b839ad5ba`. Every original line is assigned once in the table below, including the complete original bibliography.

The executive summary and bibliography remain in the new [research synthesis]({{< ref "ai/design-research/02-human-ai-collaboration/07-collaboration-patterns-research-synthesis" >}}). The complete catalog and selection guidance extend the existing [patterns note]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}). The general mechanics, consolidated model, complete workflow, and closing argument extend the existing [joint-activity model]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}).

The [collaboration evaluation note]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation" >}}) retains the complete test table, wider audit, and final rubric. Each catalog entry still retains its definition, terminology, examples, mechanics, failures, and suggested tests.

The earlier taxonomies remain intact. The later report's six-mode proposal and treatment of handoff and escalation as transitions are retained as a later version, rather than replacing the earlier seven-item derivation.

### Original-text mapping


Line and byte ranges are inclusive and one-based. The checksums cover only the original moved bytes, not added navigation or local reference copies.

| Original lines | Destination | Current lines | Current bytes | Original lines retained | Original bytes | SHA-256 |
|---|---|---|---|---|---|---|
| 1 to 36 | [02-human-ai-collaboration/07-collaboration-patterns-research-synthesis.md]({{< ref "ai/design-research/02-human-ai-collaboration/07-collaboration-patterns-research-synthesis" >}}) | 1 to 36 | 1 to 4386 | 36 | 4386 | `8ac6899d891d96a0495796bb9035585316e85b16f906cd0c19df7d7106b89ba7` |
| 37 to 220 | [02-human-ai-collaboration/06-human-ai-collaboration-patterns.md]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}) | 248 to 431 | 10390 to 38172 | 184 | 27783 | `11328d6b845ce9f42009f48db409195f20b17966e61729d7d9478897d86ef80d` |
| 221 to 261 | [02-human-ai-collaboration/05-joint-activity-and-collaboration-model.md]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}) | 351 to 391 | 18527 to 23084 | 41 | 4558 | `1c1ce41e49e4cdb8b637bdcfbdb3b3c63dd6652cca185a6081df481a58937e97` |
| 262 to 328 | [02-human-ai-collaboration/06-human-ai-collaboration-patterns.md]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}) | 434 to 500 | 38458 to 42404 | 67 | 3947 | `62f5b9889f0a2101e7b0fac2c4df477401fd4fdaa0147b162ca9c916b9b9a9d2` |
| 329 to 383 | [06-research-reports/11-human-ai-collaboration-evaluation.md]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation" >}}) | 9 to 63 | 805 to 6559 | 55 | 5755 | `f962243eb00260f74bca0f35750b65fdf78e4365482b3d45b8bbdff5346e100c` |
| 384 to 492 | [02-human-ai-collaboration/05-joint-activity-and-collaboration-model.md]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}) | 394 to 502 | 23541 to 28043 | 109 | 4503 | `9c78774445887c0ea68cb73205e64c359e794a6d5dc84b15e3196c9b9fbb9b83` |
| 493 to 563 | [02-human-ai-collaboration/07-collaboration-patterns-research-synthesis.md]({{< ref "ai/design-research/02-human-ai-collaboration/07-collaboration-patterns-research-synthesis" >}}) | 55 to 125 | 6214 to 12859 | 71 | 6646 | `5fa0462a034af05b40fbe217bda0036624b585858d36b8f31bc5b74e1ad897bf` |

### Applied original-text moves


The source was processed from the bottom upward, so each selected source range still had its original line numbers when moved. All seven dry runs left both files unchanged. Every application matched the independently computed byte splice and preserved both files' modes.

| Original source range at move | Destination | Placement | Destination lines immediately after that move |
|---|---|---|---|
| 493 to 563 | [02-human-ai-collaboration/07-collaboration-patterns-research-synthesis.md]({{< ref "ai/design-research/02-human-ai-collaboration/07-collaboration-patterns-research-synthesis" >}}) | At end | 19 to 89 |
| 384 to 492 | [02-human-ai-collaboration/05-joint-activity-and-collaboration-model.md]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}) | Before the added citation-definition heading | 353 to 461 |
| 329 to 383 | [06-research-reports/11-human-ai-collaboration-evaluation.md]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation" >}}) | Before the added citation-definition heading | 9 to 63 |
| 262 to 328 | [02-human-ai-collaboration/06-human-ai-collaboration-patterns.md]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}) | Before the added citation-definition heading | 250 to 316 |
| 221 to 261 | [02-human-ai-collaboration/05-joint-activity-and-collaboration-model.md]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}) | Before the added pattern-catalog bridge | 351 to 391 |
| 37 to 220 | [02-human-ai-collaboration/06-human-ai-collaboration-patterns.md]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}) | Before the added mechanics bridge | 248 to 431 |
| 1 to 36 | [02-human-ai-collaboration/07-collaboration-patterns-research-synthesis.md]({{< ref "ai/design-research/02-human-ai-collaboration/07-collaboration-patterns-research-synthesis" >}}) | Before the added navigation comment | 1 to 36 |

The final mapping table accounts for later insertions shifting an earlier moved block. No source-bearing passage was rewritten or replaced by a summary.

### Added navigation and citation support


| Destination | Added navigation and reference lines in current note | Added lines | Added bytes |
|---|---|---|---|
| Research synthesis | 37 to 54 | 18 | 1827 |
| Joint-activity model | 344 to 350, 392 to 393, 503 to 533 | 40 | 4169 |
| Collaboration patterns | 241 to 247, 432 to 433, 501 to 569 | 78 | 7464 |
| Collaboration evaluation | 1 to 8, 64 to 96 | 41 | 4154 |

The old pattern note lacked a final newline. A single LF byte was added at byte 9802 to end its last existing line before appending navigation. All 9801 prior bytes remain an unchanged prefix. The added terminator belongs to the new boundary, not the original dialogue. The initial blank line of the pattern-navigation block follows that terminator.

The added reference and navigation total is 17615 bytes. It includes 11797 bytes and 121 lines of local citation definitions, plus 5818 bytes of new navigation and the single boundary LF. The combined added navigation and reference blocks contain 177 logical lines. The LF terminating the old final line does not add a separate logical line.

The original bibliography is moved once into the synthesis note. Marked local copies provide definitions for the unchanged footnote labels used in the other notes. A new citation index in the synthesis note refers to all 35 original entries, including entries cited only in redistributed sections.

| Destination citation copies | Entries | Original labels | Copy-block lines | Copy-block bytes | Copy-block SHA-256 |
|---|---|---|---|---|---|
| [02-human-ai-collaboration/05-joint-activity-and-collaboration-model.md]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}#citation-definitions-for-the-collaboration-pattern-report) | 14 | 1, 2, 4, 5, 6, 7, 9, 12, 20, 23, 29, 32, 33, 35 | 27 | 2754 | `9ea1f808f0d74dabe6cd692afe04a0503769753290c97d57d62500ca480e368b` |
| [02-human-ai-collaboration/06-human-ai-collaboration-patterns.md]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}#citation-definitions-for-the-collaboration-pattern-report) | 33 | 1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34 | 65 | 6157 | `8033167514e9429438d7f5f02db6b2e0b1a5ed5745f565ef15ff66dfa426c2e1` |
| [06-research-reports/11-human-ai-collaboration-evaluation.md]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation" >}}#citation-definitions-for-the-collaboration-pattern-report) | 15 | 1, 2, 3, 4, 5, 7, 9, 11, 12, 20, 21, 23, 29, 32, 33 | 29 | 2886 | `dde39f88d9ae6c5320e27ac6ceec30c1bb1630e8ed525772c70c8e81f821e6bf` |

The three copy blocks contain 62 entry occurrences across their separate destinations. They are reference support, not additional original moved text. Every copied definition matches its original entry exactly. The synthesis has 35 definitions, the model has 14, the pattern note has 33, and the evaluation note has 15. There are no missing, duplicate, or unused definitions in those four notes.

### Earlier text and source mappings


The pre-stage model, pattern note, and both comments notes remain unchanged byte prefixes.

| Existing note | Preserved prefix bytes | Prefix SHA-256 |
|---|---|---|
| [02-human-ai-collaboration/05-joint-activity-and-collaboration-model.md]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}) | 18002 | `dab6eaf02d930d1b1cbabc7dc0a67dc266d798bfa7a244ff4c7e98da11ce826e` |
| [02-human-ai-collaboration/06-human-ai-collaboration-patterns.md]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}) | 9801 | `fc23e5bf01888ebae4ebf1fe976fe95d13e0a100a664371a911b00c012d4c4d6` |
| [02-human-ai-collaboration/05-joint-activity-and-collaboration-model-comments.md]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model-comments" >}}) | 4520 | `fbe1dc997e52b2cf1f87515d7c4c1a726fd5ab01166c24e92e4f9e02c09e9d31` |
| [02-human-ai-collaboration/06-human-ai-collaboration-patterns-comments.md]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns-comments" >}}) | 4300 | `30118a3c4b755ae6ffe324651a550f3effefc8712de98337e436519c3afba393` |

The earlier collab-transfer source also reconstructs exactly from the preserved prefixes. Its opening 17192 bytes remain at model bytes 811 to 18002, on lines 11 to 343. Its concluding 9008 bytes remain at pattern bytes 794 to 9801, starting on line 11 and ending within line 240 before the newly added boundary LF.

Concatenating those two original byte intervals produces 26200 bytes and 563 logical lines with SHA-256 `755cd1f2aebac12c1b285cfa818eec54ddfabaae749f5e1af0714f3060cd301b`. Because the original concluding block lacked a final newline, reconstruction uses its recorded byte interval rather than including the new LF after line 240. The earlier audit's whole-note hashes are historical snapshots, while the current hashes are recorded below.

The earlier comments remain intact. New commentary is appended at model-comments lines 46 to 63 and pattern-comments lines 44 to 67. New sibling comments accompany the synthesis and evaluation notes. The comments explain placement, taxonomy changes, overlapping modes, critique versus learning goals, authority and recovery, and the limits of proposed studies.

### Index and source navigation


The design-research index has four planned edits. Reading-path item 7 now links the synthesis and collaboration tests. The model and pattern entries describe the added passages, and the pattern entry is followed by the new synthesis entry. The interactive-investigation report entry is followed by the new collaboration-evaluation entry. No other index text was changed by this pass.

The original source path now contains a 10-line, 1690-byte redirect linking all destinations, sibling comments, and this audit. Its mode remains 0664. No original source path was deleted.

### Whole-note checksums


The following values were checked after the moves and index changes, before this audit was appended.

| Note | Logical lines | Bytes | Mode | Final newline | SHA-256 |
|---|---|---|---|---|---|
| [02-human-ai-collaboration/07-collaboration-patterns-research-synthesis.md]({{< ref "ai/design-research/02-human-ai-collaboration/07-collaboration-patterns-research-synthesis" >}}) | 125 | 12859 | 0644 | Present | `ebfca3e275bf8003dd466534c6e3d484165c1dddca8ff3213cd6f0c8be673bbf` |
| [02-human-ai-collaboration/05-joint-activity-and-collaboration-model.md]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}) | 533 | 31232 | 0644 | Present | `00b27b162d0e162f23cb5cb2e132605447ce1e24f34744d0cf73f8cd246bfc58` |
| [02-human-ai-collaboration/06-human-ai-collaboration-patterns.md]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}) | 569 | 48996 | 0644 | Present | `33f062c45a27dfde034bd610ed62b81c430d088a5be324a81ae0d9da3caf51a3` |
| [06-research-reports/11-human-ai-collaboration-evaluation.md]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation" >}}) | 96 | 9909 | 0644 | Present | `0635c777d710e6c187700e30e3adfdcd0d81a1066303b5afe5ce065fdcbf6341` |
| [02-human-ai-collaboration/05-joint-activity-and-collaboration-model-comments.md]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model-comments" >}}) | 63 | 6399 | 0644 | Present | `301b90d0da45a5d26d6174b3e1e337253d223ec156199c93794baa379fd0e2b3` |
| [02-human-ai-collaboration/06-human-ai-collaboration-patterns-comments.md]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns-comments" >}}) | 67 | 6762 | 0644 | Present | `89d3d1f480e4a066ab94d58a53e2f93ff7f3676cfd57d841f412563bab4d2d97` |
| [02-human-ai-collaboration/07-collaboration-patterns-research-synthesis-comments.md]({{< ref "ai/design-research/02-human-ai-collaboration/07-collaboration-patterns-research-synthesis-comments" >}}) | 41 | 4257 | 0644 | Present | `53944bdbeca5809430e51858db645b967f13a7ae8798d42a7a7dd10f28d2b7a5` |
| [06-research-reports/11-human-ai-collaboration-evaluation-comments.md]({{< ref "ai/design-research/06-research-reports/11-human-ai-collaboration-evaluation-comments" >}}) | 45 | 4473 | 0644 | Present | `71ccba90cec561f020bd21e36b95e88cbf40521f4400e644c99ae4c96c75426a` |
| [../collab-and-joint-work/human-ai-collaboration-patterns-report.md]({{< ref "ai/collab-and-joint-work/human-ai-collaboration-patterns-report" >}}) | 10 | 1690 | 0664 | Present | `a95e02e63d7ee0e39b1b110881173752fc8535c6c06dedaa74cc0a6044bd3388` |
| [00-index.md]({{< ref "ai/design-research/00-index" >}}) | 120 | 25650 | 0644 | Present | `09832695cd7a8dab7266c52922afd9021f40fb50cf257963a989d0a7be9e930c` |

### Reconstruction and balance


The seven destination blocks reconstruct all 57578 original bytes and 563 logical lines in original order, with SHA-256 `061cb7a87d3d706b13f7926e3385b569d25f78ee001e5b2fcb88ca9b839ad5ba`. The reconstruction equals the complete pre-stage source byte for byte.

The four source-bearing destinations balance as 57578 original source bytes + 27803 earlier destination bytes + 17615 new navigation and reference bytes = 102996 final bytes. The logical-line balance is 563 original lines + 583 earlier destination lines + 177 new lines = 1323 final lines.

The redirect, comments, design index, and this audit are accounted for separately. The old audit's 371153 bytes remain an unchanged prefix with SHA-256 `7eceae06c89ae459d76a950558f616626a4d7b93e0695089e0125de1d20ced1d`.

### Verification scope and concurrent work


All internal Markdown links and checked heading anchors across 82 files in design research, interactive systems, and the three collaboration-source redirects resolved in the final collection check. The check covered 1313 internal references and skipped 640 external URLs. External URL availability, publication details, product behavior, and cited research claims were not independently verified.

The affected notes' code fences close. Newly authored text has no trailing whitespace, and the workspace diff check passes. The pre-stage source and both destinations were confirmed unchanged from the approved analysis before editing. Each new text block and all four planned index edits were checked against their exact expected bytes.

Separate edits appeared in the interactive-systems collection during this session. This pass did not write those files. Their changed snapshots are recorded only to distinguish concurrent work from this split.

| Concurrent file, not edited by this pass | Before bytes | Before SHA-256 | Observed after bytes | Observed after SHA-256 |
|---|---|---|---|---|
| `ai/interactive-systems/00-index.md` | 4327 | `69668fb8a0efa153f98e2ebc89d00e21fd4c6f6c371e7c7e05dc9f0c4c2aa4a3` | 5244 | `d42ec4032cd040b6f3956ae1956fd78758ab9bd7f762af88320a49838569432d` |
| `ai/interactive-systems/reassembly-map.json` | 9748 | `4a3fb04fa8f00c5ed241541ccd1cdd1c5235cd4f8a15195630d6d277a666d4f2` | 10037 | `c762008ae8a55d9757b1fc0a900e2fd43d9192e85ae01bd995d4bd8c9f97dd28` |
| `ai/interactive-systems/00-index-comments.md` | 3590 | `ea81dd3fbf2a70cdbfb75bef02d247d609457d9e210eb959c8e89a284ef96973` | 3809 | `bcbd868eff9fd0985d3be0a8289c4a43dad0ee22f6606bb9a1cba318562e5120` |
| `ai/interactive-systems/reassembly-map.md` | 6150 | `3596142e98b6e5ca115c0b067c2de0784e4d2d155a5276af8a3a2fa00bdb8e2d` | 17035 | `25f9fc19fd7232fede8b3114e52b85fa5c5b674b12a392322489984ace22aa50` |

Before this audit append, 69 other baseline files retained their exact bytes and modes. The design-research audit was one of those files and is changed only by appending this section. This count excludes concurrent files and the files intentionally changed by this pass.

Git HEAD, the index bytes, and the staged-change listing remained unchanged. No files were staged or committed. Temporary navigation, comment, redirect, and audit helpers were removed after their content was moved and their emptiness was checked.

Reassembly does not verify the report's taxonomy, select an experiment, or authorize an implementation. The report's literature, product, and numerical claims remain retained source claims.

## Related-notes pass 5: participant profiles and design practices


Date: 2026-10-01. The user approved the proposed split after [build-approach.md]({{< ref "ai/collab-and-joint-work/build-approach" >}}) was read completely and compared with the existing notes. All original-text transfers used `_scripts/move_text.py`, with a non-mutating dry run followed by application and an independent byte-splice check.

### Source and arrangement


The original source contained 881 logical lines and 32908 bytes, with no final newline and mode 0644. Its SHA-256 was `16d6226242b01f491344325d4432a1e5b5a8ba2ff362d872297bf53b6c28180a`.

The new [participant-profile note]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation" >}}) retains the initial question, participant tables, and complete derivation of approaches, followed by the dictionary-based revision. The later reply remains a revision rather than silently replacing the earlier model.

The existing [augmentation note]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}#from-conversational-interfaces-to-collaborative-work) retains the intervening question and reply about collaboration, active participation, and augmentation. The new [design-practices note]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices" >}}) retains the complete practices question, three-part framework, ten shared practices, and final design test.

The source's tables, examples, headings, blank lines, questions, and placeholders remain unchanged. The heading marked "first part (to rewrite)" is retained as source text, not followed as an instruction to rewrite it.

### Original-text mapping


Ranges are inclusive and one-based. The checksums cover only original source bytes, excluding new navigation, comments, and index entries.

| Original lines | Destination | Current lines | Current bytes | Original lines retained | Original bytes | SHA-256 |
|---|---|---|---|---|---|---|
| 1 to 273 | [01-foundations/11-participant-profiles-and-work-allocation.md]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation" >}}) | 11 to 283 | 941 to 10967 | 273 | 10027 | `77d59698e072fd4776771a1f307501c7caecf4c344ae41c4e529440d84750ced` |
| 274 to 328 | [02-human-ai-collaboration/01-augmenting-human-work.md]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}) | 407 to 461 | 17547 to 20342 | 55 | 2796 | `c3721ff285b0f53717c5d994b3c137ea537265f4011030f72dd76904b230a0c6` |
| 329 to 628 | [02-human-ai-collaboration/08-collaborative-system-design-practices.md]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices" >}}) | 9 to 308 | 931 to 11432 | 300 | 10502 | `a054349fba800f5f75a436d223af1956edc5734d8292f3a24bb51ec665eff587` |
| 629 to 881 | [01-foundations/11-participant-profiles-and-work-allocation.md]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation" >}}) | 288 to 540 | 11245 to 20827 | 253 | 9583 | `9b566f721c568900091a88b13c8f12232b578751af7f1a6cc79d3027a82e62d2` |

All four ranges cover the original source exactly once. Concatenating their current byte intervals in original order reproduces 32908 bytes and 881 logical lines with SHA-256 `16d6226242b01f491344325d4432a1e5b5a8ba2ff362d872297bf53b6c28180a`, equal to the complete pre-stage source.

### Applied moves


The four source blocks moved from the bottom upward, so their selected source line numbers remained the original numbers. Each dry run left source and destination unchanged. Every applied result matched the independently calculated byte splice and retained file modes.

| Source range at move | Destination | Placement | Destination lines immediately after move |
|---|---|---|---|
| 629 to 881 | [01-foundations/11-participant-profiles-and-work-allocation.md]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation" >}}) | At end | 15 to 267 |
| 329 to 628 | [02-human-ai-collaboration/08-collaborative-system-design-practices.md]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices" >}}) | At end | 9 to 308 |
| 274 to 328 | [02-human-ai-collaboration/01-augmenting-human-work.md]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}) | At end | 407 to 461 |
| 1 to 273 | [01-foundations/11-participant-profiles-and-work-allocation.md]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation" >}}) | Before the added revised-model heading | 11 to 283 |

The final mapping accounts for the initial model later shifting the already moved revised model from lines 15 to 267 into lines 288 to 540. The original final line remains without a newline at the end of the participant-profile note.

### Added navigation and comments


| Note | New navigation lines | Navigation lines | Navigation bytes |
|---|---|---|---|
| Participant profiles | 1 to 10, 284 to 287 | 14 | 1217 |
| Design practices | 1 to 8 | 8 | 930 |
| Augmenting human work | 400 to 406, 462 | 8 | 936 |

The augmentation note previously lacked a final newline. One LF byte was added after its existing 16875 bytes, at current byte 16876. It terminates the old final line before the new navigation starts, while all prior bytes remain an unchanged prefix. The added LF is separate from the 936 navigation bytes in the table and does not add another logical line.

The imported framing passage ends with an original blank line. A new closing navigation paragraph follows it at line 462, linking the source redirect and mapping. Keeping the paragraph after the original blank line preserves source bytes and avoids a new blank line at the tracked note's EOF. The original passage was not trimmed.

New sibling comments accompany all three destinations. The [profile comments]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation-comments" >}}) explain conditional participant profiles, capability versus authority, dictionary context, grounding, and persistence versus learning. The [augmentation comments]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work-comments" >}}) explain the added framing and its limits. The [practices comments]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices-comments" >}}) distinguish the proposed guide from a required architecture or validated method.

The source names a dictionary without identifying a path or version. The matching archive dictionary (archived source 005) was read as terminology context, not redistributed or adopted as a standard. Its 15124 bytes retain SHA-256 `[private-source checksum omitted]`. The exact historical dictionary version remains unconfirmed.

The dialogue and new notes contain no footnote labels requiring copied definitions. Their original content was moved without adding research citations or verifying the retained capability claims.

### Earlier augmentation text


The complete pre-stage augmentation note remains a byte prefix of 16875 bytes and 399 logical lines, with SHA-256 `0eea9dc2de6691cc50382344dfaebf0216c244c1cba4ef6c113ff776a4efbe3f`. Its last original byte precedes the new LF at byte 16876.

The earlier augmentation source also reconstructs exactly. Removing only the four previously added navigation lines 5 to 8 from the preserved pre-stage prefix produces 16475 bytes and 395 logical lines, with SHA-256 `b4bfb08037870f00ab6e8bd83f23eb3854d7b6bcb65075077993d4a1d04b4bf5`.

The earlier source's original lines 1 to 4 remain at current lines 1 to 4. Its original lines 5 to 395 remain at current lines 9 to 399. Reconstruction uses the preserved byte prefix so it does not include the newly added LF after current line 399. No earlier dialogue was rewritten.

### Index and source redirect


The design-research index has four planned edits. Reading-path item 7 now links the profile and practices notes. The foundations list adds participant profiles after complexity and work structure. The augmentation entry describes the new framing and links its comments. The collaboration list adds the practices note after the research synthesis entry. All other pre-stage index text remains unchanged.

The original source path now contains a 9-line, 1308-byte redirect linking the three destinations, all comments, and this audit. Its mode remains 0644. No original path was deleted.

### Whole-note checksums


The following values were checked after the moves and planned index changes, before this audit append.

| Note | Logical lines | Bytes | Mode | Final newline | SHA-256 |
|---|---|---|---|---|---|
| [01-foundations/11-participant-profiles-and-work-allocation.md]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation" >}}) | 540 | 20827 | 0644 | Absent | `87cd0cf642884ee55daadfabd6b27228e864f9876199d0ddc36d896c3df48252` |
| [02-human-ai-collaboration/08-collaborative-system-design-practices.md]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices" >}}) | 308 | 11432 | 0644 | Present | `c5a1ab847e93e468408b6b4dd1ea6c9c7358727447798493423367b9d45edc11` |
| [02-human-ai-collaboration/01-augmenting-human-work.md]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}) | 462 | 20608 | 0644 | Present | `b4524afa33b539da47f24ca225b14fce3c8f7519f98109fdc2a6fd72a0ad66d2` |
| [../collab-and-joint-work/build-approach.md]({{< ref "ai/collab-and-joint-work/build-approach" >}}) | 9 | 1308 | 0644 | Present | `e23d9cc66ab6f7480b3c0b1f8fa2afdce3cd1b13b0d2bbe61f2f3627b21cc3af` |
| [00-index.md]({{< ref "ai/design-research/00-index" >}}) | 124 | 27727 | 0644 | Present | `06703c5c214b76d45618435960354884eba5320a1695737bc99696858502c844` |
| [01-foundations/11-participant-profiles-and-work-allocation-comments.md]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation-comments" >}}) | 53 | 5513 | 0644 | Present | `c406843d582ec2dc8132a01e6d3b13e545afc264e5d5797df4be5fc98d8d9ca1` |
| [02-human-ai-collaboration/01-augmenting-human-work-comments.md]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work-comments" >}}) | 29 | 2456 | 0644 | Present | `07b6f6ee11f8fb4899ded79b561e991ded93232a9efac2a9b78a487ad8cf1ab6` |
| [02-human-ai-collaboration/08-collaborative-system-design-practices-comments.md]({{< ref "ai/design-research/02-human-ai-collaboration/08-collaborative-system-design-practices-comments" >}}) | 43 | 3937 | 0644 | Present | `7033cec970c968e1ed075d725c9ccc4b8d263a6646aacc763d6ec236caa43745` |

### Reconstruction and balance


The source-bearing notes balance as 32908 original source bytes + 16875 earlier augmentation bytes + 3084 new navigation and boundary bytes = 52867 final bytes.

The logical-line balance is 881 original source lines + 399 earlier augmentation lines + 30 new navigation lines = 1310 final lines. Comments, the redirect, index changes, and this audit are counted separately.

The previous audit's 389037 bytes remain an unchanged prefix with SHA-256 `294f8cd41b487291306efa92182599d50e9de9a2187a0744457e6409a7e81d0d`. The new section was appended through the move script after checking the helper and the old prefix against their expected bytes.

### Verification scope and concurrent changes


The collection link check covered 1447 internal Markdown references across 90 files, including checked heading anchors, with no unresolved internal targets. It skipped 643 external URLs. External URL availability, legacy wiki references, empirical claims, and the exact historical dictionary version were not independently verified.

The affected notes' code fences close, and their footnote checks show no missing or duplicate definitions. New text has no trailing whitespace. The workspace diff check passes. All newly authored note text and the four index edits match their exact expected bytes.

Before this audit append, 83 other baseline files retained their bytes and modes. The design-research audit was included in that count and is changed only by this append. Separately observed changes appeared in interactive systems and evidence notes, which this pass did not edit.

| Concurrent file, not edited by this pass | Before bytes | Before SHA-256 | Observed after bytes | Observed after SHA-256 |
|---|---|---|---|---|
| `ai/interactive-systems/00-index.md` | 5939 | `5376be026edbec2492bccfa84dc102a3b7bec1d812845801d0afb73cc79ba078` | 6624 | `8244e968b7e98c22255d3ebe3f8035b482577b62dad2999e219556455a2add86` |
| `ai/interactive-systems/reassembly-map.md` | 24102 | `473107bcc90c149c327231997760b637da20c5c926e7a7f75a49a8f59194f0d5` | 28874 | `8fa3352c01de306caf589467151312016241c36533acbc459c44c72e96cfd7b3` |
| `ai/design-research/04-investigation-and-epistemics/05-multirepresentation-retrieval-and-projections.md` | 20066 | `f6cee6b05d5ad357acb0ab0103ea4cf9e1cf2c2588f29a8a78f6a01684019ee2` | 20803 | `34b3842db81ee27719080204a8902eb2c4fda9eed97200e2d2561d001ed00af9` |
| `ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis-comments.md` | 4873 | `15a4044bb2130c964481f5cea6340b33c8c0e2a5b90a90f2ff5ada8591d2d1bb` | 6762 | `54fa1609c6b4040bc8780b3a192f33c0e06d2cd8dc65e8f6f43de26bb595831a` |
| `ai/design-research/04-investigation-and-epistemics/06-bounded-corpus-evidence-synthesis.md` | 6475 | `d15547e86f90a58eeb3f65deece89fed361e2b84e37a001c1961289861dd9368` | 7524 | `2c34e6065169325af14f6593f22aa08dfd9249b53b87b34f7f308cbac7c275f0` |

The concurrent snapshots are observations during this pass, not claims that separate editing has finished. Their changes were preserved. Verification of the split depends on its own source blocks, destination text, and preserved augmentation prefix rather than on unrelated notes remaining unchanged.

Git HEAD, index bytes, and the staged-change listing remained unchanged. No files were staged or committed. Temporary navigation, redirect, and audit helpers were removed after their moved contents and emptiness were checked.

The arrangement does not adopt the participant tables as fixed facts, establish a complete taxonomy, select an implementation, or select an experiment. The new comments distinguish design proposals from verified results.

### Final scoped link check


After the append, the design-research collection and four collaboration source redirects passed a check of 1319 internal Markdown references across 82 files, with no unresolved targets or heading anchors. This check skipped 643 external URLs.

A wider, later snapshot included four newly created interactive-systems files and checked 1468 internal references across 94 files. It found six unfinished heading links in those separate edits: two to the reading-path research heading and four to their pending stage-6 audit heading. None belong to the split destinations, comments, source redirect, or design-research index. Those files were not changed by this pass. The earlier 90-file, 1447-reference check above records its own snapshot, not the later concurrent state.

## Related-notes pass 6: collaboration framework


Date: 2026-10-01. The user approved the proposed split after framework.md (archived source 013) was read completely and compared with existing notes. The archive contained one saved LLM reply without its initiating question. No missing question was invented.

### Arrangement and source mapping


The new [collaboration framework]({{< ref "ai/design-research/05-runtime-and-execution/07-collaboration-framework" >}}) retains the three software layers, original examples, proposed commitment guarantees, and project framing. The complete [responsibility allocation and handoff passage]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}#responsibility-allocation-and-handoff) joins the existing joint-activity model. A link at the passage's former position preserves the connection within the reply.

The original source contained 333 logical lines and 6340 bytes, with no final newline and mode 0664. Its SHA-256 was `f50f758be0abfb5b5aedd510cb82ddaeb5a6735a272140aa2c8ec645cbbe38a5`. All ranges below are inclusive and one-based. Checksums cover original bytes only.

| Original lines | Destination | Current lines | Current bytes | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|---|
| 1 to 196 | [05-runtime-and-execution/07-collaboration-framework.md]({{< ref "ai/design-research/05-runtime-and-execution/07-collaboration-framework" >}}) | 11 to 206 | 709 to 4556 | 196 | 3848 | `1b01666691630bafae26a22f46b5447578d1d70787c7e7dbdcc6bc31aa90cb09` |
| 197 to 271 | [02-human-ai-collaboration/05-joint-activity-and-collaboration-model.md]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}) | 509 to 583 | 28545 to 29512 | 75 | 968 | `5d15fe1cd0ad7983295f9668ce1b0788395ee50697f2b4e478de980527cc3e8e` |
| 272 to 333 | [05-runtime-and-execution/07-collaboration-framework.md]({{< ref "ai/design-research/05-runtime-and-execution/07-collaboration-framework" >}}) | 213 to 274 | 4965 to 6488 | 62 | 1524 | `92f543cf997c6585c76557a8ee6f9bf8883806a1f0a0ae9e96ab65920f5f0eec` |

The three ranges cover every original line exactly once. Concatenating the recorded destination byte intervals in source order reproduces all 6340 bytes and 333 logical lines with the original SHA-256. The original final line remains without a newline at the end of the framework note. No original text was rewritten or duplicated.

### Transfers and added navigation


All transfers used `_scripts/move_text.py`. Each dry run left both files unchanged, and every applied result matched an independently calculated byte splice. The move script retained source and destination modes.

First, six new navigation lines were inserted before the model's citation-definition heading. Second, source lines 272 to 333 were appended to the new framework scaffold. Third, source lines 197 to 271 moved before the model's citation definitions. Fourth, source lines 1 to 196 moved before the framework's responsibility link. Finally, the redirect helper moved into the empty source. Moving the original blocks from the bottom upward kept the selected line numbers stable.

The framework note contains 16 new navigation lines and 1116 navigation bytes at lines 1 to 10 and 207 to 212. The model contains six new navigation lines and 501 navigation bytes at lines 503 to 508. No boundary newline was added to original text.

The source-bearing notes balance as 6340 original source bytes + 31232 earlier model bytes + 1617 new navigation bytes = 39189 final bytes. Their line balance is 333 original source lines + 533 earlier model lines + 22 new navigation lines = 888 final lines.

### Preservation of existing notes


Removing only the inserted navigation and responsibility block from the model reconstructs its complete earlier 31232 bytes and 533 lines, with SHA-256 `00b27b162d0e162f23cb5cb2e132605447ce1e24f34744d0cf73f8cd246bfc58`.

Earlier model lines 1 to 502 remain at current lines 1 to 502. Earlier lines 503 to 533, containing the local citation definitions, now occupy lines 584 to 614. All earlier passages and citation definitions remain unchanged. The new source passage has no footnote references requiring additional definitions.

The earlier model comments remain an unchanged prefix of 6399 bytes and 63 logical lines, with SHA-256 `301b90d0da45a5d26d6174b3e1e337253d223ec156199c93794baa379fd0e2b3`. The new section adds 1771 bytes and 14 lines. The [responsibility comments]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model-comments" >}}#framework-responsibility-allocation) explain work assignment, accountability, owner fields, unresolved authority, and handoff questions.

The new [framework comments]({{< ref "ai/design-research/05-runtime-and-execution/07-collaboration-framework-comments" >}}) explain the arrangement and distinguish declared annotations from enforced checks. They also discuss missing assumptions, evidence and review, and the limits of restoring recorded state after external actions. Plain-writing guided only the new prose, leaving the saved reply unchanged.

### Index and redirect


The design-research index has only three planned edits. Reading-path item 7 now links the framework proposal. The existing joint-activity entry describes the added allocation object and handoff examples. The runtime list adds the framework note and its comments after the program-history note. All other pre-stage index text remains unchanged.

The original source path contains a 10-line, 1055-byte redirect linking both destinations, their comments, and this mapping. Its mode remains 0664. The path was retained, so earlier references can still lead to the redistributed text.

### Whole-note checksums


The values below were checked after the moves and planned index changes, before the audit append.

| Note | Logical lines | Bytes | Mode | Final newline | SHA-256 |
|---|---|---|---|---|---|
| [05-runtime-and-execution/07-collaboration-framework.md]({{< ref "ai/design-research/05-runtime-and-execution/07-collaboration-framework" >}}) | 274 | 6488 | 0644 | Absent | `2acaef7e5bc493ced3c8c3f23b9fc95430e5b22dbb6417cdb3075b920a05f499` |
| [02-human-ai-collaboration/05-joint-activity-and-collaboration-model.md]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model" >}}) | 614 | 32701 | 0644 | Present | `5bb2a8ca4e440fb40f13fa0e7c540731d538cf0b1887483813da88f5e355822f` |
| [02-human-ai-collaboration/05-joint-activity-and-collaboration-model-comments.md]({{< ref "ai/design-research/02-human-ai-collaboration/05-joint-activity-and-collaboration-model-comments" >}}) | 77 | 8170 | 0644 | Present | `994e00d0f69aa92aa058244a9757fddc11ebc84f1b146ee9ee3b1b554783faf8` |
| [05-runtime-and-execution/07-collaboration-framework-comments.md]({{< ref "ai/design-research/05-runtime-and-execution/07-collaboration-framework-comments" >}}) | 37 | 4072 | 0644 | Present | `1770f76f074711c2bfccac8077ccc28b14c013c362f9af23bce81c657676d09d` |
| archived source 013 | 10 | 1055 | 0664 | Present | `[private-source checksum omitted]` |
| [00-index.md]({{< ref "ai/design-research/00-index" >}}) | 125 | 28399 | 0644 | Present | `da96952933372e6398b959d992710fbb4ca435ba6ff513fd6389d8727c780b4f` |

### Verification scope


The design-research collection, four earlier collaboration redirects, and this source redirect passed a check of 1358 internal Markdown references across 85 files, including checked heading anchors. The check skipped 643 external URLs. External availability, legacy wiki references, literature attributions, and product comparisons were not independently verified.

The affected notes' code fences close, and the footnote checks show no missing or duplicate definitions. Newly authored text has no trailing whitespace. The workspace diff check passes. All changed notes, comments, the redirect, and the three index edits match their exact expected bytes.

Before the audit append, 77 other baseline files retained their bytes and modes. The audit is included in that count and is changed only by appending this section. After the append, the other 76 baseline files remain unchanged. The previous audit's 403664 bytes remain an unchanged prefix with SHA-256 `b1f645079c718c976bc51560d62dc6c824bc2941341e294affc94de22f4f0424`.

Git HEAD, index bytes, and the staged-change listing remained unchanged. No files were staged or committed. Temporary navigation, redirect, and audit helpers were removed after their transferred contents and emptiness were checked.

The arrangement does not choose an implementation, establish a guarantee, transfer accountability, or select an experiment. Original claims remain source material, separate from the new comments.

## Related-notes pass 7: collaboration framework research routes


Date: 2026-10-01. The user approved the proposed split after framework-route.md (archived source 002) was read completely and compared with the existing programming model, architectural framings, and research scope. The saved analysis and routes sections contain different recommendations. They remain unchanged, and no initiating questions were invented.

### Arrangement and original-text mapping


The new [research-routes note]({{< ref "ai/design-research/00-overview/07-collaboration-framework-research-routes" >}}) retains the five design perspectives, proposed layered architecture, initial investigation proposal, complete build-route comparison, suggested order, narrow contract experiment, and closing application comparison. The complete [declarative pattern passage]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model" >}}#collaboration-patterns-as-declarative-constraints) joins the existing programming-model note. Its proposal/review, delegation, and shared-reasoning examples remain together.

A link at the passage's original position connects the route analysis to the declarative examples. The route-specific incident-response examples remain in the comparison. No route was scattered across separate implementation notes, and no recommendation was adopted as a selected plan.

The source contained 609 logical lines and 14730 bytes, with no final newline and mode 0664. Its SHA-256 was `74216e55fff051af9be9ce6779460f256ead471829f402498d633bc700c57fa8`. Ranges below are inclusive and one-based. Checksums cover original bytes only.

| Original lines | Destination | Current lines | Current bytes | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|---|
| 1 to 198 | [00-overview/07-collaboration-framework-research-routes.md]({{< ref "ai/design-research/00-overview/07-collaboration-framework-research-routes" >}}) | 11 to 208 | 860 to 6453 | 198 | 5594 | `c10d8e4670e3d77d74533e09ba0edfd03d78db37803874ca3846bc832d85b039` |
| 199 to 275 | [03-language-and-compiler/03-declarative-programming-model.md]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model" >}}) | 387 to 463 | 8534 to 10004 | 77 | 1471 | `1c6d18fa961e73c4a23463922d24aa373d296653b2a71f6b65cf7aea74578e89` |
| 276 to 609 | [00-overview/07-collaboration-framework-research-routes.md]({{< ref "ai/design-research/00-overview/07-collaboration-framework-research-routes" >}}) | 213 to 546 | 6869 to 14533 | 334 | 7665 | `7e2a1cfe425f2d12ad4f1801f3ae162bba6706d864efbbdc825cf4667e5eb3d2` |

The three ranges cover every original line exactly once. Concatenating their recorded destination byte intervals in original order reproduces all 14730 bytes and 609 logical lines with the original SHA-256. The source's final line remains without a newline at the end of the research-routes note. Original headings, tables, code examples, and whitespace were not rewritten.

### Applied transfers and added navigation


All transfers used `_scripts/move_text.py`. Each dry run left both files unchanged, and every applied result matched an independently calculated byte splice. Source and destination modes were retained.

First, six new navigation lines were inserted before the captured-article navigation in the programming-model note. Second, source lines 276 to 609 were appended to the new routes scaffold. Third, source lines 199 to 275 moved before the captured-article navigation. Fourth, source lines 1 to 198 moved before the routes note's link to the declarative examples. Finally, the redirect helper moved into the empty source. Original blocks moved from the bottom upward, keeping the selected source line numbers stable.

The routes note has 14 new navigation lines and 1274 navigation bytes at lines 1 to 10 and 209 to 212. The programming-model note has six new navigation lines and 503 navigation bytes at lines 381 to 386. No boundary newline was added to either original text.

The source-bearing notes balance as 14730 source bytes + 9481 earlier programming-model bytes + 1777 navigation bytes = 25988 final bytes. Their logical-line balance is 609 source lines + 389 earlier programming-model lines + 20 navigation lines = 1018 final lines.

### Preservation of the earlier programming model


Removing only the inserted navigation and pattern block reconstructs all earlier 9481 bytes and 389 logical lines, with SHA-256 `1c1642f545e1f5fca2af4b30d5d058fc76bf92a470e1075835778663c9fe0f54`.

Earlier lines 1 to 380 remain at current lines 1 to 380. Earlier lines 381 to 389, including the captured article's navigation and closing passage, now occupy lines 464 to 472. The article's final paragraph and absent final newline remain unchanged. Neither the earlier dialogue nor the article was trimmed or edited.

The new source passage has no footnote references requiring copied definitions. No research citations were added to the saved dialogue.

### Separate comments and index changes


The new [routes comments]({{< ref "ai/design-research/00-overview/07-collaboration-framework-research-routes-comments" >}}) explain why the comparison stays together. They distinguish the five perspectives from the build routes and narrow experiment. They retain the difference between independent prototypes, the suggested API/runtime/declarative sequence, and the final comparison of two implementations.

The comments link the existing [contract discussion]({{< ref "ai/design-research/04-investigation-and-epistemics/03-epistemic-contracts-for-rag" >}}#the-formal-core), which qualifies static guarantee labels and develops runtime certificates. No qualification was silently substituted into the original contract example. The new [declarative comments]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model-comments" >}}) distinguish permitted behavior from completion, review, authority, and accepted changes to a running specification.

Plain-writing guided only the new prose. The comments are interpretation and open design questions, not original dialogue or verified findings.

The index has only three planned edits. Reading-path item 13 now links the proposed routes. The overview list adds the new note after research scope and hierarchy. The declarative-programming entry links the imported examples and their comments. All other pre-stage index text remains unchanged.

The source path contains a 10-line, 1165-byte redirect linking both destinations, their comments, and this audit. Its mode remains 0664, and the original path was retained.

### Whole-note checksums


The values below were checked after the moves and planned index changes, before this audit append.

| Note | Logical lines | Bytes | Mode | Final newline | SHA-256 |
|---|---|---|---|---|---|
| [00-overview/07-collaboration-framework-research-routes.md]({{< ref "ai/design-research/00-overview/07-collaboration-framework-research-routes" >}}) | 546 | 14533 | 0644 | Absent | `e0858b950ac4e026f8b64d693efba030e84ddf9b7a01feb904b326e33cb7ecf4` |
| [03-language-and-compiler/03-declarative-programming-model.md]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model" >}}) | 472 | 11455 | 0644 | Absent | `b38be070be98dbd17d7bba4d937aee4273ccf9c2ec6893ec2b5dcb1e3bb58cb6` |
| [00-overview/07-collaboration-framework-research-routes-comments.md]({{< ref "ai/design-research/00-overview/07-collaboration-framework-research-routes-comments" >}}) | 41 | 4479 | 0644 | Present | `a0297f658aae5cfd9487f0e5c71923564558255172cd0ddea88b531820de2797` |
| [03-language-and-compiler/03-declarative-programming-model-comments.md]({{< ref "ai/design-research/03-language-and-compiler/03-declarative-programming-model-comments" >}}) | 31 | 3413 | 0644 | Present | `2d285b07a7053f22e8249e479cf700fece7fb373cbb29f30eaffb9e51df6925b` |
| archived source 002 | 10 | 1165 | 0664 | Present | `[private-source checksum omitted]` |
| [00-index.md]({{< ref "ai/design-research/00-index" >}}) | 126 | 29427 | 0644 | Present | `03a58a6df114c22bbdc142d32becfee39f34e372528261a1e38afd933f1bce5c` |

### Verification scope


The two source-bearing notes, two sibling comments, index, source redirect, and audit passed a check of 711 internal Markdown references across 7 files, including checked heading anchors. The scoped check encountered 0 external URLs. External availability, legacy wiki references, literature attributions, and product claims were not independently verified.

The affected notes' code fences close, and their footnote checks show no missing or duplicate definitions. Newly authored text has no trailing whitespace. The affected-file diff check passes. A separate whole-workspace snapshot reported a new blank line at EOF at line 175 in the concurrently edited `05-runtime-and-execution/05-trusted-effect-boundaries.md`. The concurrent content was left untouched. All changed notes, new comments, the redirect, and the three index edits match their exact expected bytes.

In a pre-append snapshot, 78 baseline files outside the planned edits retained their bytes and modes. The count includes the audit, whose earlier 412245 bytes remain an unchanged prefix with SHA-256 `8df1e9155ae25ebd203c7086f35fc000cf33daa0e0fb0734da3dec980370e038`. The audit is changed only by appending this section.

Separate edits appeared in the following notes. The values are observed snapshots, rather than claims that concurrent work has finished. Neither note was edited by this pass.

| Concurrent note | Before bytes | Before SHA-256 | Observed bytes | Observed SHA-256 |
|---|---|---|---|---|
| [03-language-and-compiler/10-program-authoring-and-typed-planning.md]({{< ref "ai/design-research/03-language-and-compiler/10-program-authoring-and-typed-planning" >}}) | 8909 | `0b7129765149d252e1f429a6b944bb5f8e8ea70868e8a9f6e8e3cb7de1a9f87e` | 12741 | `45723fdcddcec3a4387fc24327af480cda19f2786c6a6eb84f9ef083e96df403` |
| [05-runtime-and-execution/05-trusted-effect-boundaries.md]({{< ref "ai/design-research/05-runtime-and-execution/05-trusted-effect-boundaries" >}}) | 15812 | `61cd0d279605dbf415c9f886ab7a6edcc07c9a51a7a10898949a31e196b9bb11` | 17920 | `ae5217504b31d081845b87863c0165e4ddf952dcdc406629a9accd4a47b4a2e7` |

A separate pre-append collection scan checked 1398 internal references across 89 files and skipped 646 external URLs. Besides the three references to this then-pending audit section, it found two pending `stage-7-natural-language-interface-dialogue` heading links in the concurrent notes. The scoped check above includes the present audit heading and resolves all links in this split. Unrelated outgoing links were not changed by this pass.

Git HEAD, index bytes, and the staged-change listing remained unchanged. No files were staged or committed. Temporary navigation, redirect, and audit helpers were removed after their transferred contents and emptiness were checked.

The arrangement does not select an application, API, language, runtime, guarantee, or experiment. The different recommendations remain available for a separate decision.

## Related-notes pass 8: multiagent coordination analysis and Alice scope


Date: 2026-10-01. The user approved the proposed split after archived source 025 was read completely. The captured article (archived source 017) was also read for context, and it was not redistributed or independently verified against live sources.

### Arrangement and original-text mapping


The new [coordination report]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics" >}}) retains the initial framing, framework analysis, broader research framing, proposed coordination regimes, and complete methodological critique. The first reply's endorsement and the second reply's criticism remain separate positions within the same note.

The complete [complexity comparison]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}#coordination-and-epistemic-refinements) joins the earlier work profile. The complete [evidence experiment proposal]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}#multiagent-evidence-experiment-proposal) joins the earlier investigation evaluation. Links occupy their original positions in the framework analysis, and the source's section numbering remains unchanged.

The complete [Alice correction]({{< ref "ai/design-research/00-overview/08-collaborative-computation-and-alice-research-scope" >}}#alice) has its own overview note. The earlier connection to Alice remains in the second reply, with a link to the later correction. No earlier argument was silently corrected, and no missing initiating questions were invented.

The source contained 945 logical lines and 37420 bytes, with no final newline and mode 0664. Its SHA-256 was `6810e8f082afb2a87f63410023121188dda62da5bb3acdc21c438df565160957`. Ranges below are inclusive and one-based. Checksums cover original bytes only.

| Original lines | Destination | Current lines | Current bytes | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|---|
| 1 to 6 | [06-research-reports/12-multiagent-coordination-and-system-semantics.md]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics" >}}) | 11 to 16 | 990 to 1732 | 6 | 743 | `fccbd2abc76b58a1eccdcfdbfee4a1947adb646221205a854737c1b4cb2a012b` |
| 7 to 53 | [01-foundations/10-complexity-and-work-structure.md]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}) | 211 to 257 | 6658 to 10496 | 47 | 3839 | `a29c9e4d38521a8e67fde8723f36ef0ea7e0294f5ec721d96db9bd73ba4857b2` |
| 54 to 245 | [06-research-reports/12-multiagent-coordination-and-system-semantics.md]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics" >}}) | 21 to 212 | 2062 to 9323 | 192 | 7262 | `1448470b9da15bbca227dbb3d9e76527be7c7da4f486b266ae3e12a765419024` |
| 246 to 289 | [06-research-reports/07-investigation-evaluation-and-benchmarks.md]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) | 103 to 146 | 8800 to 10646 | 44 | 1847 | `2d4a49071ca035fe2c9132572103ed2875ae104abe0a55e399660e34b98da72d` |
| 290 to 738 | [06-research-reports/12-multiagent-coordination-and-system-semantics.md]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics" >}}) | 217 to 665 | 9661 to 25742 | 449 | 16082 | `47984de6bd5b4a69af1f59cf01defbd52e188ffad0dcb2300d427caf24119e22` |
| 739 to 945 | [00-overview/08-collaborative-computation-and-alice-research-scope.md]({{< ref "ai/design-research/00-overview/08-collaborative-computation-and-alice-research-scope" >}}) | 9 to 215 | 891 to 8537 | 207 | 7647 | `c88bcd122616f99a30ffa9993d5601afca14ebb4bc8059b0dd0375ccb763270e` |

The six ranges cover every original line exactly once. Concatenating the recorded destination byte intervals in original order reproduces all 37420 bytes and 945 logical lines with the original SHA-256. Original headings, tables, examples, citations, and whitespace remain unchanged. The final original line remains without a newline at the end of the Alice note.

### Applied transfers and navigation


All original transfers used `_scripts/move_text.py`. Every dry run left its files unchanged, and each applied result matched an independently calculated byte splice. All source and destination permission modes were retained.

First, source lines 739 to 945 moved to the new Alice scaffold. Second, lines 290 to 738 moved before the report's Alice link. Third, lines 246 to 289 moved before the evaluation footer. Fourth, lines 54 to 245 moved before the report's evaluation link. Fifth, lines 7 to 53 moved before the complexity footer. Sixth, lines 1 to 6 moved before the report's complexity link. The source blocks moved from the bottom upward, keeping the selected source line numbers stable. A redirect helper then moved into the empty source.

The source-bearing notes contain 4704 new navigation bytes. The report adds 2076 bytes, the Alice note adds 890 bytes, the complexity note adds 848 bytes, and the evaluation note adds 890 bytes. The complexity addition begins with one LF byte to terminate the earlier note's final line, followed by separation and navigation. All earlier bytes remain an exact prefix.

A later navigation edit added a blank line before the original Alice heading. The edit also added an unwanted LF byte at the end of the file. The verifier identified the exact one-byte difference, and a mechanical final-newline formatting command removed only the added byte. The full original ending and permission mode were then checked again. No original line was trimmed or rewritten.

The source-bearing byte balance is 37420 source bytes + 14342 earlier destination bytes + 4704 navigation bytes = 56466 final bytes. The logical-line balance is 945 source lines + 299 earlier destination lines + 48 new navigation lines = 1292 final lines.

### Preservation of earlier notes and contextual source


The earlier complexity note, evaluation note, and complexity comments remain exact byte prefixes of their updated files.

| Earlier note | Logical lines | Preserved bytes | SHA-256 |
|---|---|---|---|
| [01-foundations/10-complexity-and-work-structure.md]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}) | 203 | 6061 | `b2064b5433540bce409e70d3d143388c57889e85b73264081b4cdb6c49010645` |
| [06-research-reports/07-investigation-evaluation-and-benchmarks.md]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) | 96 | 8281 | `a92525204056a7030fad072f676ddec4b63b661844feab9da2601d64ea2f01de` |
| [01-foundations/10-complexity-and-work-structure-comments.md]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure-comments" >}}) | 43 | 4410 | `6d4ec9b5cc0ba1f8add784e0ce94b62bc0b1272ceaf182d418322c3e3fda0d19` |

The earlier evaluation's illustrative result table and its disclaimer remain together. No illustrative value was treated as an observed result. The source has no footnote references requiring transferred definitions.

The captured article remains unchanged at 139 logical lines, 28783 bytes, mode 0664, and no final newline. Its SHA-256 remains `[private-source checksum omitted]`. Reading the capture did not verify its reported experiments or the dialogue's interpretation of them.

### Comments, index, and source redirect


The new [coordination comments]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics-comments" >}}) explain the change of position, distinguish a configured system from internal model properties, and qualify the proposed coordination mechanisms. The new [Alice comments]({{< ref "ai/design-research/00-overview/08-collaborative-computation-and-alice-research-scope-comments" >}}) explain the independent research question and limits of the speculative proposal.

The new [investigation comments]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks-comments" >}}) distinguish registered evidence from undisclosed private information, source records from truth, and proposed metrics from measured results. The [complexity comments]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure-comments" >}}#imported-coordination-and-epistemic-refinements) add qualifications for coupling, goal compatibility, behavioral correlation, and different sources of uncertainty. All earlier complexity comments remain unchanged.

Plain-writing guided only the new comments, navigation, index entries, redirect, and audit prose. The retained source claims, literature criticisms, novelty judgments, and terminology conventions were not independently established by the reassembly.

The index has five planned edits. Reading-path item 13 links the new report and Alice correction. The overview list adds the Alice scope note. The complexity entry links its refinements. The investigation evaluation entry links its added proposal and comments. The research reports list adds the coordination report. All other pre-stage index text remains unchanged.

The original source path contains a 12-line, 1441-byte redirect linking the four destinations, contextual article, and this audit. Its mode remains 0664. The original path was retained.

### Whole-note checksums


The values below were checked after the moves and index changes, before this audit append.

| Note | Logical lines | Bytes | Mode | Final newline | SHA-256 |
|---|---|---|---|---|---|
| [06-research-reports/12-multiagent-coordination-and-system-semantics.md]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics" >}}) | 668 | 26163 | 0644 | Present | `f1ff55e3cec08fdeafe85ef433fc9f05f5318446d2747d1beab8b22290f92071` |
| [00-overview/08-collaborative-computation-and-alice-research-scope.md]({{< ref "ai/design-research/00-overview/08-collaborative-computation-and-alice-research-scope" >}}) | 215 | 8537 | 0644 | Absent | `6cc8cf38ac0d216ab8d9f90e05f853bdb592c881e3ccc1f5da82ccf92f3ce0b4` |
| [01-foundations/10-complexity-and-work-structure.md]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}) | 260 | 10748 | 0644 | Present | `12436357e672a6c45169a5f04887c11ea03b383d81fe73d7d91e0c060f74ea50` |
| [06-research-reports/07-investigation-evaluation-and-benchmarks.md]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks" >}}) | 149 | 11018 | 0644 | Present | `e96ae512aa65a5c8675a7babd04286405f4aa1e36b5503a5877e9a006cabe927` |
| [01-foundations/10-complexity-and-work-structure-comments.md]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure-comments" >}}) | 53 | 5649 | 0644 | Present | `23dabeb8e8c1eff39c821841906b39bc8084af6ba61a496e847963d7f969e567` |
| [06-research-reports/12-multiagent-coordination-and-system-semantics-comments.md]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics-comments" >}}) | 33 | 4055 | 0644 | Present | `a1f551c718d8c89d405336633fcf573117af0e57496f248f65a80249b7f88793` |
| [00-overview/08-collaborative-computation-and-alice-research-scope-comments.md]({{< ref "ai/design-research/00-overview/08-collaborative-computation-and-alice-research-scope-comments" >}}) | 25 | 2665 | 0644 | Present | `9519bed94ea8cb52423bf151aeeefebaa8a577d767657b811eb23fee753248ae` |
| [06-research-reports/07-investigation-evaluation-and-benchmarks-comments.md]({{< ref "ai/design-research/06-research-reports/07-investigation-evaluation-and-benchmarks-comments" >}}) | 25 | 2838 | 0644 | Present | `b87e8a50eae74d8b0c368f7b114324ab6cb1d648f2e20d22b0c37f0a2e2335f5` |
| [00-index.md]({{< ref "ai/design-research/00-index" >}}) | 128 | 31150 | 0644 | Present | `f4549ac6ab4b06d30e5209a5d8f5cc4fa95f06743d157574cc9e8ae12b22a3d4` |
| archived source 025 | 12 | 1441 | 0664 | Present | `[private-source checksum omitted]` |

### Verification scope


The four source-bearing notes, four sibling comments, index, source redirect, and audit passed a scoped check of 779 internal Markdown references across 11 files, including heading anchors. The checker skipped 36 external URLs. External availability, reference-style citations, legacy wiki references, literature attributions, and experimental claims were not independently verified.

The affected notes' code fences close, and the footnote check found no missing or duplicate definitions. Newly authored text has no trailing whitespace. Both the affected-file diff check and the separate whole-workspace diff snapshot passed at the pre-append check. All changed notes and index edits match their exact expected bytes.

In the pre-append snapshot, 80 baseline files outside the planned edits retained their bytes and modes. The captured article is included in that count. The earlier audit was checked separately and remains an unchanged 423061-byte prefix, with SHA-256 `eabab9373de9a9e2d68eb8ba45535e48bd7dcab6e3f79494e2b35426c5965a74`. The audit is changed only by appending this section.

Git HEAD remained `[repository fingerprint omitted]` at the pre-append snapshot. Git staging changed during this pass without a staging or commit command from this operation. The initial staged listing was empty and the index SHA-256 was `[repository fingerprint omitted]`. The later observed listing contained 84 paths, with listing SHA-256 `[repository fingerprint omitted]` and index SHA-256 `[repository fingerprint omitted]`. The external staging state was left untouched. No files were staged or committed by this operation.

The temporary redirect and audit helpers were removed after their transferred contents and emptiness were checked. The arrangement selects no implementation, guarantee, experiment, theory of cognition, or required sequence between the two research branches.

## Related-notes pass 9: long-running work model and field study


Date: 2026-10-01. The user approved the revised five-part split after long-running-init-reason.md (archived source 024) was reread completely and compared with the current collection. The earlier source comments (archived source 016) described an unapplied plan. The revised placement moves the goal-revision passage to the version-history note instead of the complexity note.

### Arrangement and original-text mapping


The complete opening framing, work types, task dimensions, and comparison join [complexity and work structure]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}#work-types-and-task-dimensions). The complete [role passage]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model" >}}#roles-in-long-running-work) joins the participant-neutral architecture, with the original distinction between roles and participants intact.

The complete [intent-evolution passage]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}#goal-revisions-and-dependent-work) joins the version-history note. Its feature example, `GoalRevision` record, and questions about plans, completed work, and approvals remain together. The complete [runtime passage]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}#runtime-support-for-long-running-work) retains the mechanism list and coding-harness example.

The new [field-study note]({{< ref "ai/design-research/06-research-reports/09-long-running-work-failures-and-field-study" >}}) retains the complete failure taxonomy, proposed study, annotation questions, consolidated work model, and closing definition. The opening five layers and closing model remain distinct proposals. Links preserve the five-layer sequence across the destinations. No initiating user question was saved in the source, and none was invented.

The source contained 392 logical lines and 11748 bytes, with no final newline and mode 0664. Its SHA-256 was `a5b340327f640f28d86ccad961cf38e360b03d911561c16c5d6e68262679b2a0`. Ranges below are inclusive and one-based. Checksums cover original bytes only.

| Original lines | Destination | Current lines | Current bytes | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|---|
| 1 to 77 | [01-foundations/10-complexity-and-work-structure.md]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}) | 268 to 344 | 11216 to 14743 | 77 | 3528 | `030e05e96d8df7fb538b17e38451cfdd362f8063445bd80b28747ac8768e998e` |
| 78 to 117 | [01-foundations/04-participant-neutral-system-model.md]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model" >}}) | 239 to 278 | 6316 to 7543 | 40 | 1228 | `7a3a4f61c1a3584b7c8ad01b49984bb611f569abcba75148663544bdd84cdb71` |
| 118 to 193 | [05-runtime-and-execution/06-program-versions-runs-and-results.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) | 408 to 483 | 11436 to 12785 | 76 | 1350 | `1da99f53c7f018aae0e79fe1f4105203c6f0037f132f5d0e8355d8d2fc11a373` |
| 194 to 224 | [05-runtime-and-execution/01-generalized-agent-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) | 802 to 832 | 24073 to 25246 | 31 | 1174 | `b515bc35798f882375136e23b184747919082d190132e1ce70b7bf161a584734` |
| 225 to 392 | [06-research-reports/09-long-running-work-failures-and-field-study.md]({{< ref "ai/design-research/06-research-reports/09-long-running-work-failures-and-field-study" >}}) | 19 to 186 | 1629 to 6096 | 168 | 4468 | `7a6215210ca26c70f011d0ecf5d4f9db8067e094079dca458fbbebb84914ce91` |

The five ranges cover every original line exactly once. Concatenating the recorded destination byte intervals in original order reproduces all 11748 bytes and 392 logical lines with the original SHA-256. Original headings, tables, examples, citations, and whitespace remain unchanged. The original final line remains without a newline at the end of the new field-study note.

### Applied transfers and navigation


All original transfers used `_scripts/move_text.py`. Every dry run left both files unchanged, and each applied result matched an independently calculated byte splice. Source and destination permission modes were retained.

First, original lines 225 to 392 moved to the new field-study scaffold. Second, lines 194 to 224 moved before the runtime continuation. Third, lines 118 to 193 moved before the history note's runtime link. Fourth, lines 78 to 117 moved before the role note's goal-revision link. Fifth, lines 1 to 77 moved before the complexity note's role link. The source blocks moved from the bottom upward, keeping the selected source line numbers stable. A redirect helper then moved into the empty source.

The source-bearing notes contain 5280 new navigation bytes. The complexity note adds 1034 bytes, the role note adds 863 bytes, the history note adds 905 bytes, the runtime note adds 850 bytes, and the new field-study note adds 1628 bytes. Each existing note adds ten navigation lines, and the new research note adds eighteen. No boundary newline was added to the original source or earlier destination text.

The source-bearing byte balance is 11748 source bytes + 51023 earlier destination bytes + 5280 navigation bytes = 68051 final bytes. The logical-line balance is 392 source lines + 1685 earlier destination lines + 58 navigation lines = 2135 final lines.

### Preservation of earlier notes and comments


All four earlier destination notes and both existing sibling comments remain exact byte prefixes of their updated files.

| Earlier note | Logical lines | Preserved bytes | SHA-256 |
|---|---|---|---|
| [01-foundations/10-complexity-and-work-structure.md]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}) | 260 | 10748 | `12436357e672a6c45169a5f04887c11ea03b383d81fe73d7d91e0c060f74ea50` |
| [01-foundations/04-participant-neutral-system-model.md]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model" >}}) | 231 | 5855 | `e33ada284880e33f1af4b3fa441e3bfa8ec0d8172e877c091f5496f0fae81233` |
| [05-runtime-and-execution/06-program-versions-runs-and-results.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) | 400 | 10854 | `3c23915f962e5b5b576977b42e3b80b2e085e78f581a9eebf4804e93ba2d22fa` |
| [05-runtime-and-execution/01-generalized-agent-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) | 794 | 23566 | `c862df726f0c44b19ea8d023f62ed8aa111d5f1be30eab62a7cd4dec2681e0dc` |
| [01-foundations/10-complexity-and-work-structure-comments.md]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure-comments" >}}) | 53 | 5649 | `23dabeb8e8c1eff39c821841906b39bc8084af6ba61a496e847963d7f969e567` |
| [05-runtime-and-execution/06-program-versions-runs-and-results-comments.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results-comments" >}}) | 76 | 6477 | `9e639681e6a6412e5013a14b998a4fc0325fe54e546e87229575bbe74251df68` |

The earlier architecture passages, complexity profile, coordination refinements, program histories, runtime mechanisms, and bibliography links were not rewritten or trimmed. Original source passages contain no footnote references requiring transferred definitions.

The earlier source comments had 62 logical lines and 6614 bytes, with SHA-256 `d229a019d562cac15cde81dde7e31c09dfebb184e4c63675f1d1288428b9abad`. Seven planned edits update the source-path description, applied-placement heading, placement paragraph, table header, revised goal-revision destination, and the two field-study destination rows. An appended 1168-byte section records the approved change and links this audit.

Removing only the addition and reversing the seven edits reproduces all earlier 6614 bytes with the original SHA-256. The earlier interpretation and design questions remain unchanged outside the documented edits. The six logical rows in the comments distinguish the failure taxonomy and study proposal, while the contiguous mapping above transfers them together as original lines 225 to 392.

### Separate comments and index changes


The new [role comments]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model-comments" >}}) explain why functions belong with the participant-neutral model. They distinguish roles from participant profiles, verification adequacy from a verifier label, and authority from a role name.

The extended [complexity comments]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure-comments" >}}#imported-work-types-and-task-dimensions) distinguish task descriptions from difficulty measures. They retain the differences among the profile, five layers, work hierarchy, and consolidated model. Their earlier "next source" wording is preserved as a historical review state and qualified by the new section.

The extended [history comments]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results-comments" >}}#imported-goal-revisions-and-dependent-work) distinguish goal revisions, program revisions, and execution runs. They identify the unresolved rules for accepted intent, stale plans, reusable work, and approvals requiring reconsideration. The original record is a proposal, not an implemented dependency algorithm.

The new [runtime comments]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime-comments" >}}) qualify the necessity of the mechanism list and distinguish persisted state from appropriate recovery. The new [field-study comments]({{< ref "ai/design-research/06-research-reports/09-long-running-work-failures-and-field-study-comments" >}}) keep overlapping failure categories, unestablished sample size, task-selection rules, and controlled evaluation separate from source claims.

Plain-writing guided only the new comments, navigation, source-review updates, index entries, redirect, and audit prose. The retained literature and product claims were not independently verified. The proposed 30 to 50 tasks do not describe a completed dataset or a justified sample size.

The index has six planned edits. The participant-neutral, complexity, runtime, and history entries describe the added passages and link their comments where needed. Reading-path item 13 links the field-study proposal. The research report list adds the new note after behavioral-compilation evaluation. All other pre-stage index text remains unchanged.

The source path contains a 13-line, 1688-byte redirect linking all five destinations in their original sequence, the updated source comments, and this audit. Its mode remains 0664. The original path was retained.

### Whole-note checksums


The values below were checked after the moves and planned comment and index changes, before this audit append.

| Note | Logical lines | Bytes | Mode | Final newline | SHA-256 |
|---|---|---|---|---|---|
| [01-foundations/10-complexity-and-work-structure.md]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure" >}}) | 347 | 15310 | 0644 | Present | `6bb46287abd24ba07691721fbaa54f61432b4a1f7bb811a371fd6736cf662d3c` |
| [01-foundations/04-participant-neutral-system-model.md]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model" >}}) | 281 | 7946 | 0644 | Present | `af263da8fa740e059789283dcb3269d1acac71b1c08c8b9a76bb2341da302605` |
| [05-runtime-and-execution/06-program-versions-runs-and-results.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results" >}}) | 486 | 13109 | 0644 | Present | `dc27793c3cd573b4661eb8913cc4458ff0c2b41455c612c85eee63e2c1e82315` |
| [05-runtime-and-execution/01-generalized-agent-runtime.md]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime" >}}) | 835 | 25590 | 0644 | Present | `42038fa78a951a2e7c9ee990a78502e155efba311f2cb63cc8aac098e1144d33` |
| [06-research-reports/09-long-running-work-failures-and-field-study.md]({{< ref "ai/design-research/06-research-reports/09-long-running-work-failures-and-field-study" >}}) | 186 | 6096 | 0644 | Absent | `2f59c165cea56a4eab650e8cb3c9b2d9277b57b84baed3c6d8518719a2f3e478` |
| [01-foundations/10-complexity-and-work-structure-comments.md]({{< ref "ai/design-research/01-foundations/10-complexity-and-work-structure-comments" >}}) | 65 | 7292 | 0644 | Present | `0f409375dbaa28cfb0a78b6ff4cf0315c8eb67a39db856c14d56bc2e2266f826` |
| [05-runtime-and-execution/06-program-versions-runs-and-results-comments.md]({{< ref "ai/design-research/05-runtime-and-execution/06-program-versions-runs-and-results-comments" >}}) | 88 | 8235 | 0644 | Present | `8c4544e40863f7e35f77d5460ed22278863dd594a267d1a5c3d2fb9a74f89792` |
| [01-foundations/04-participant-neutral-system-model-comments.md]({{< ref "ai/design-research/01-foundations/04-participant-neutral-system-model-comments" >}}) | 23 | 2355 | 0644 | Present | `006c2f9f90a33abc52f66beb541e536b5724184e094906eb464df82667bc98d5` |
| [05-runtime-and-execution/01-generalized-agent-runtime-comments.md]({{< ref "ai/design-research/05-runtime-and-execution/01-generalized-agent-runtime-comments" >}}) | 25 | 2702 | 0644 | Present | `4ed5160868775f585e9c2d2e2c229f91b4adb753cec906d80e44a38907937074` |
| [06-research-reports/09-long-running-work-failures-and-field-study-comments.md]({{< ref "ai/design-research/06-research-reports/09-long-running-work-failures-and-field-study-comments" >}}) | 35 | 3685 | 0644 | Present | `0d2afe6f80de9daa040267e9c2dc348b7093d095c9d8d43ead166a876cdf9e82` |
| archived source 016 | 70 | 8107 | 0644 | Present | `[private-source checksum omitted]` |
| [00-index.md]({{< ref "ai/design-research/00-index" >}}) | 129 | 32783 | 0644 | Present | `c753b02536c2abf18b0e8aa3d556f4843a3c99426246d7cb259ffda2ffe5c37b` |
| archived source 024 | 13 | 1688 | 0664 | Present | `[private-source checksum omitted]` |

### Verification scope


The five source-bearing notes, five sibling comments, updated source comments, index, source redirect, and audit passed a scoped check of 917 internal Markdown references across 14 files, including heading anchors. The checker skipped 14 external URLs. External availability, reference-style citations, legacy wiki references, literature attributions, and experimental claims were not independently verified.

The affected notes' code fences close, and the footnote check found no missing or duplicate definitions. Newly authored text has no trailing whitespace. Both the affected-file working-tree and staged diff checks passed. A separate whole-workspace working-tree diff snapshot also passed. All changed files match their exact expected bytes.

In the pre-append snapshot, 82 baseline files outside the planned edits retained their bytes and modes. The earlier audit was checked separately and remains an unchanged 436568-byte prefix, with SHA-256 `7f4b8a616d73d0dae3cf3ae0f378ad5a415918b41c780b1da15591a2e75eff0c`. The audit is changed only by appending this section.

Git HEAD, index bytes, and the staged listing remained unchanged at the pre-append verification. HEAD was `[repository fingerprint omitted]`, the index SHA-256 was `[repository fingerprint omitted]`, and the existing 84-path staged listing had SHA-256 `[repository fingerprint omitted]`. Existing staging was left untouched. No files were staged or committed by this operation.

The temporary redirect and audit helpers were removed after their transferred contents and emptiness were checked. The arrangement selects no implementation, validated taxonomy, guarantee, experiment, study size, or required research sequence.

## Related-notes pass 10: research terms and claim validation


Date: 2026-10-01. The user approved the four-block split of 01-reason-about-dict.md (archived source 009) after the whole reply was read and compared with the existing participant, provenance, evaluation, scope, and multiagent notes. The related dictionary drafts and Wei dialogue were read as context. Only the approved source was redistributed.

### Arrangement and original-text mapping


The opening motivation, complete six-field dictionary-entry template, learning example, and levels of analysis remain together in the new [research-terms note]({{< ref "ai/design-research/01-foundations/12-research-terms-and-levels-of-analysis" >}}). The general vocabulary is separate from the participant profiles and participant-neutral architecture.

The complete concept-testing discussion, six-part claim structure and example, ten research practices, LLM-use policy, and evidence-record fields remain together in the new [research-method note]({{< ref "ai/design-research/06-research-reports/13-research-method-and-claim-validation" >}}#research-practices-and-claim-records). The complete closing five-artifact proposal remains in the same note under [proposed research artifacts]({{< ref "ai/design-research/06-research-reports/13-research-method-and-claim-validation" >}}#proposed-research-artifacts).

The complete capability-first research critique and institutional-framing passage join the existing [multiagent analysis]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics" >}}#research-paradigms-and-institutional-framing). The warning against inferring individual researchers' motives stays with the bias hypothesis. Links preserve the original sequence across all four blocks. No initiating user question was saved in the source, and none was invented.

The original source contained 352 logical lines and 16883 bytes, with no final newline and mode 0664. Its SHA-256 was `f91eb64ccf54eee6e12ed9b2aeb1beb186f07ac459d3480f46e212e7b00babf9`. All ranges below are inclusive and one-based. The checksums cover original source bytes only.

| Original lines | Destination | Current lines | Current bytes | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|---|
| 1 to 99 | [01-foundations/12-research-terms-and-levels-of-analysis.md]({{< ref "ai/design-research/01-foundations/12-research-terms-and-levels-of-analysis" >}}) | 11 to 109 | 878 to 5367 | 99 | 4490 | `6bbc84dad0caa16f21b04244f6d4b7522d241149872679e57ed8e70e6ffbbcb8` |
| 100 to 245 | [06-research-reports/13-research-method-and-claim-validation.md]({{< ref "ai/design-research/06-research-reports/13-research-method-and-claim-validation" >}}) | 11 to 156 | 1102 to 8111 | 146 | 7010 | `28810199149fbc9420f0602b99e39fd9092f77b576eab9fdb742fd5c5e8e79f6` |
| 246 to 307 | [06-research-reports/12-multiagent-coordination-and-system-semantics.md]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics" >}}) | 677 to 738 | 26898 to 30807 | 62 | 3910 | `bb0a6aa3bd62bfc7c6d871644122a0d4ac0c6ab5f8651849cfb9b61f8ffa777a` |
| 308 to 352 | [06-research-reports/13-research-method-and-claim-validation.md]({{< ref "ai/design-research/06-research-reports/13-research-method-and-claim-validation" >}}) | 165 to 209 | 8816 to 10288 | 45 | 1473 | `44a7c623d39199a04a60e0b6cc38ed291d1f93641ebec4504e8b56302e9a3b80` |

The four ranges cover every original line exactly once. Concatenating the destination byte intervals in original order reproduces all 16883 bytes and 352 logical lines with the original SHA-256. The original headings, code blocks, tables, examples, citations, and whitespace remain unchanged. The last original line remains without a newline at the end of the new method note.

### Applied transfers and navigation


All original transfers used `_scripts/move_text.py`. Every transfer was dry-run first, and the dry run left both files unchanged. Each applied result matched an independently calculated byte splice, and the script retained the source and destination permission modes.

First, original lines 308 to 352 moved to the end of the new method scaffold. Second, lines 246 to 307 moved before the critique note's artifact-plan continuation. Third, lines 100 to 245 moved before the method note's critique continuation. Fourth, lines 1 to 99 moved before the terms note's method continuation. The moves proceeded from the bottom upward, keeping the selected source line numbers stable. A redirect helper then moved into the empty source path.

The terms scaffold adds 1261 bytes and 13 lines. The method scaffold adds 1805 bytes and 18 lines. The appended critique navigation adds 1252 bytes and 11 lines. The source-bearing notes therefore contain 4318 new navigation bytes and 42 navigation lines. No boundary newline was added to the original text or earlier destination text.

The source-bearing byte balance is 16883 original source bytes + 26163 earlier note bytes + 4318 navigation bytes = 47364 final bytes. The logical-line balance is 352 source lines + 668 earlier note lines + 42 navigation lines = 1062 final lines.

The original path remains as a 12-line, 1688-byte redirect linking the four pieces in order, their separate comments, and this audit. Its mode remains 0664. The redirect SHA-256 is `[private-source checksum omitted]`.

### Preservation of earlier notes and contextual sources


The earlier multiagent note and its sibling comments remain exact byte prefixes of the updated files.

| Earlier note | Logical lines | Preserved bytes | SHA-256 |
|---|---|---|---|
| [06-research-reports/12-multiagent-coordination-and-system-semantics.md]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics" >}}) | 668 | 26163 | `f1ff55e3cec08fdeafe85ef433fc9f05f5318446d2747d1beab8b22290f92071` |
| [06-research-reports/12-multiagent-coordination-and-system-semantics-comments.md]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics-comments" >}}) | 33 | 4055 | `a1f551c718d8c89d405336633fcf573117af0e57496f248f65a80249b7f88793` |

The initial framework endorsement, complete later methodological critique, and link to the separate Alice correction were not rewritten or trimmed. The additional critique is identified as part of a separate saved reply, rather than part of the earlier captured article.

The contextual notes below were read without redistribution or edits. Their final lines and permission modes remain unchanged.

| Contextual source | Logical lines | Bytes | SHA-256 |
|---|---|---|---|
| archived source 005 | 245 | 15124 | `[private-source checksum omitted]` |
| archived source 006 | 832 | 21233 | `[private-source checksum omitted]` |
| archived source 007 | 733 | 15116 | `[private-source checksum omitted]` |
| archived source 008 | 471 | 28638 | `[private-source checksum omitted]` |

The source does not identify the exact dictionary path or version supplied during the original exchange. The new comments retain the distinction between the original six-field template and the v0.2 draft's additional boundaries, invalid inferences, status, and open questions. The contextual drafts were not merged or adopted as a standard.

### Separate comments and index changes


The new [terms comments]({{< ref "ai/design-research/01-foundations/12-research-terms-and-levels-of-analysis-comments" >}}) explain why the dictionary template and examples stay together. They distinguish working definitions from settled definitions, proposed evidence tests from validated tests, and the levels-of-analysis sequence from a complete ontology or required architecture.

The new [method comments]({{< ref "ai/design-research/06-research-reports/13-research-method-and-claim-validation-comments" >}}) distinguish claim types from calibrated confidence. They separate provenance records from evidence that supports an interpretation and distinguish LLM output used as experimental data from LLM output treated as independent factual support. The complete five-artifact list remains a proposal, and no separate dictionary, ontology, claim ledger, or evidence ledger was created from it.

The extended [multiagent comments]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics-comments" >}}#research-paradigms-and-institutional-framing) retain scoped performance evaluation as distinct from claims about understanding or causes. They keep the explicit political-motive caveat beside the institutional-bias hypothesis. The earlier comments remain unchanged.

The index has three planned replacements. Reading-path item 13 adds the terms and method notes. The participant-profile entry is retained with the new terms entry immediately after it. The multiagent entry retains its earlier text, adds the institutional-framing link, and is followed by the new method entry. All other pre-stage index text remains unchanged.

Plain-writing guided only the new comments, navigation, index additions, redirect, and audit prose. The retained literature claims, public statements, novelty judgments, and named-paper interpretations were not independently verified. The arrangement adopts no research policy, theory of cognition, validated test, experiment, or required sequence between the collaboration and Alice programs.

### Whole-note checksums


The values below were checked after the moves, comments, and index edits, before this audit append.

| Note | Logical lines | Bytes | Mode | Final newline | SHA-256 |
|---|---|---|---|---|---|
| [01-foundations/12-research-terms-and-levels-of-analysis.md]({{< ref "ai/design-research/01-foundations/12-research-terms-and-levels-of-analysis" >}}) | 112 | 5751 | 0644 | Present | `fc2e2fe029c1e2260e45343aefd2150f44c42d8be95e9a707a4c9434dd9a8a8e` |
| [06-research-reports/13-research-method-and-claim-validation.md]({{< ref "ai/design-research/06-research-reports/13-research-method-and-claim-validation" >}}) | 209 | 10288 | 0644 | Absent | `a71f01b4d53b2ac1f675091c78dbdea935c3925301f712105829f5f500e74683` |
| [06-research-reports/12-multiagent-coordination-and-system-semantics.md]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics" >}}) | 741 | 31325 | 0644 | Present | `064f374ed708ea4380197166f1f995df915de2e7774a8ba7518435eceeddfca7` |
| [01-foundations/12-research-terms-and-levels-of-analysis-comments.md]({{< ref "ai/design-research/01-foundations/12-research-terms-and-levels-of-analysis-comments" >}}) | 27 | 3377 | 0644 | Present | `6c791fb809f5e84e1297ef645ce7a28ce51b71dc387d7a4959f68e291d06e847` |
| [06-research-reports/13-research-method-and-claim-validation-comments.md]({{< ref "ai/design-research/06-research-reports/13-research-method-and-claim-validation-comments" >}}) | 33 | 4062 | 0644 | Present | `f91466242574354db24e8c3526e1ac88fa9edba065bbf0aa21ad2a92b6f1de3e` |
| [06-research-reports/12-multiagent-coordination-and-system-semantics-comments.md]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics-comments" >}}) | 46 | 5749 | 0644 | Present | `684813267e519d83623e1dbc31a5c468e52f8fb151cafd5b703c093b0cc659dc` |
| archived source 009 | 12 | 1688 | 0664 | Present | `[private-source checksum omitted]` |
| [00-index.md]({{< ref "ai/design-research/00-index" >}}) | 131 | 34189 | 0644 | Present | `a508dd7ac7f522f3f3a328aa9a4a9924efea286581080430ac6869fd981c9266` |

### Verification scope


The three source-bearing notes, three sibling comments, index, source redirect, and audit passed a scoped check of 861 internal Markdown references across nine files, including heading anchors. The checker skipped 28 external URLs. External availability, legacy wiki links, reference-style citations, literature claims, and experimental interpretations were not independently verified.

All eight affected notes outside the audit match their exact independently constructed expected bytes. Their code fences close, and the footnote check found no missing or duplicate definitions. New prose has no trailing whitespace. Scoped working-tree and staged diff checks passed, and permission modes were retained.

All 95 other baseline files retain their bytes and modes. The audit was checked separately, and its earlier 451887 bytes remain an unchanged prefix with SHA-256 `767645240cc69d2d772bf3eb87b77417762378f77056842a1a7064920fd48c26`. Only the present section was appended.

Git HEAD, index bytes, and the staged name-status listing remained unchanged at the pre-append verification. HEAD was `[repository fingerprint omitted]`, the index SHA-256 was `[repository fingerprint omitted]`, and the existing 84-path name-status listing had SHA-256 `[repository fingerprint omitted]`. Existing staging was left untouched. No files were staged or committed by this operation.

The temporary redirect and audit helpers were removed after their transferred contents and emptiness were checked. The source remains available through its original path, and the original reply reconstructs exactly from the recorded destinations.

## Related-notes pass 11: working dictionary and disputed concepts


Date: 2026-10-01. The user approved keeping both complete replies from dictionary.md (archived source 005) as separate sections in the existing research-terms note. The source was read completely and compared with the current terms note, its comments, the participant-profile comments, the Alice scope dialogue, and the contextual dictionary drafts. Only the approved dictionary dialogue was redistributed.

### Arrangement and original-text mapping


The [initial working dictionary]({{< ref "ai/design-research/01-foundations/12-research-terms-and-levels-of-analysis" >}}#initial-working-dictionary) retains the full 17-term table, distinction between capability and stronger cognitive claims, Wei interpretation, and comparison with Alice terminology. The [disputed-concepts section]({{< ref "ai/design-research/01-foundations/12-research-terms-and-levels-of-analysis" >}}#disputed-cognitive-concepts) retains the narrowed six-concept table, all explanations and Alice examples, dependency diagram, causal-order caveat, and closing convention.

Both complete replies belong with research vocabulary rather than a required participant model or runtime architecture. General definitions and Alice assumptions are interleaved within the source, so no table row or example was extracted to create a supposedly general dictionary. The original heading `problematic segment` remains unchanged. No initiating user questions were saved, and none were invented.

The original source contained 245 logical lines and 15124 bytes, with no final newline and mode 0664. Its SHA-256 was `edc68a0c58959ecb526f8c3464b391b265f24b8bf14e867e57e0382a86e804d7`. All ranges below are inclusive and one-based. Checksums cover original source bytes only.

| Original lines | Destination | Current lines | Current bytes | Lines | Bytes | SHA-256 |
|---|---|---|---|---|---|---|
| 1 to 53 | [01-foundations/12-research-terms-and-levels-of-analysis.md]({{< ref "ai/design-research/01-foundations/12-research-terms-and-levels-of-analysis" >}}) | 121 to 173 | 6383 to 13780 | 53 | 7398 | `31c07f8e3bc3bf0611de38d1523bb2627e13be9ce849c3e950b33116fbb7fec2` |
| 54 to 245 | [01-foundations/12-research-terms-and-levels-of-analysis.md]({{< ref "ai/design-research/01-foundations/12-research-terms-and-levels-of-analysis" >}}) | 182 to 373 | 14421 to 22146 | 192 | 7726 | `fe808dc6ec7ae0856fcebc26e1619f6b32004a34601d5e52b18e6c54d2bbc484` |

The two ranges cover every original line exactly once. Concatenating the destination byte intervals in original order reproduces all 15124 bytes and 245 logical lines with the original SHA-256. The original leading blank line, tables, definitions, examples, code block, qualifications, and whitespace remain unchanged. The final original line remains without a newline at the end of the terms note.

### Applied transfers and navigation


All transfers used `_scripts/move_text.py`. Every transfer was dry-run first, and each dry run left both files unchanged. Every applied result matched an independently calculated byte splice, and source and destination modes were retained.

The navigation patch initially omitted the final authored blank line. Before any original text moved, a one-line helper containing one LF restored the planned blank line through a checked text transfer. The restored byte belongs to the new navigation and is included in the navigation count below. No byte was added to an original source block or the earlier terms passage.

First, original lines 54 to 245 moved to the end of the prepared terms-note navigation. Second, lines 1 to 53 moved before the initial reply's continuation marker. Moving from the bottom upward kept the selected source line numbers stable. A redirect helper then moved into the empty source path.

The appended navigation contains 1271 bytes and 16 lines. The source-bearing byte balance is 15124 source bytes + 5751 earlier note bytes + 1271 navigation bytes = 22146 final bytes. The logical-line balance is 245 source lines + 112 earlier note lines + 16 navigation lines = 373 final lines.

The original source path remains as a 10-line, 960-byte redirect linking both replies in order, the separate sibling comments, and this audit. Its mode remains 0664, and its SHA-256 is `[private-source checksum omitted]`.

### Preservation of earlier notes and comments


All 5751 earlier terms-note bytes remain an exact prefix of the updated note. The prefix contains 112 logical lines with SHA-256 `fc2e2fe029c1e2260e45343aefd2150f44c42d8be95e9a707a4c9434dd9a8a8e`. The complete earlier method-reply passage and its continuation links were not rewritten or trimmed.

The earlier sibling comments contained 3377 bytes and 27 logical lines, with SHA-256 `6c791fb809f5e84e1297ef645ce7a28ce51b71dc387d7a4959f68e291d06e847`. One planned paragraph replacement updates the earlier context-only description. The old paragraph contains 481 bytes, and the replacement contains 805 bytes. The replacement links the redistributed dictionary sections, retains the uncertainty about the exact originally supplied dictionary version, and states that the strict drafts remain unchanged.

The appended comments contain 4466 bytes and 33 lines. Removing only the addition and reversing the single paragraph replacement reproduces all earlier comment bytes with the original SHA-256. Every other earlier comment remains unchanged.

The contextual sources below retain their bytes, permission modes, and final-line endings. They were not merged or adopted as a standard.

| Contextual source | Logical lines | Bytes | SHA-256 |
|---|---|---|---|
| archived source 006 | 832 | 21233 | `[private-source checksum omitted]` |
| archived source 007 | 733 | 15116 | `[private-source checksum omitted]` |
| archived source 008 | 471 | 28638 | `[private-source checksum omitted]` |

The earlier audits describe the dictionary as context at their recorded stages. The present section records its later approved redistribution without changing the historical audit entries.

### Separate comments and index changes


The extended [dictionary comments]({{< ref "ai/design-research/01-foundations/12-research-terms-and-levels-of-analysis-comments" >}}#imported-dictionary-dialogue) explain why both replies stay intact. They distinguish chosen vocabulary from settled definitions and separate Alice's viability, mattering, relational meaning, and internal regulation from requirements of collaborative-system design.

The comments retain changes in wording rather than combining them into one definition. The initial reply defines general intelligence, while the narrowed reply suggests postponing it. The initial learning definition requires improvement, while the strict drafts describe persistent change in behavior or capability. The initial understanding definition explicitly requires grounding, while the narrowed functional definition omits that phrase and the v0.2 draft leaves the degree of necessary grounding open.

The comments distinguish causal grounding, evidence supporting an answer, and common ground between participants. They also distinguish permission for unattended action from internally regulated activity. The dependency diagram remains beside the source's explicit warning that its causal order is unestablished.

The index has one planned edit. Its terms entry retains all earlier text and adds links to both dictionary sections, with their complete tables, Alice examples, and diagram caveat. All other pre-stage index bytes remain unchanged.

Plain-writing guided only the new navigation, comments, status update, index addition, redirect, and audit prose. No source dialogue was rewritten. Empirical claims about LLMs, the interpretation of Wei, and the Alice theory were not independently verified. The arrangement adopts no definition, ontology, cognitive test, runtime requirement, or experiment.

### Whole-note checksums


The values below were checked after the transfers, comments, and index edit, before this audit append.

| Note | Logical lines | Bytes | Mode | Final newline | SHA-256 |
|---|---|---|---|---|---|
| [01-foundations/12-research-terms-and-levels-of-analysis.md]({{< ref "ai/design-research/01-foundations/12-research-terms-and-levels-of-analysis" >}}) | 373 | 22146 | 0644 | Absent | `ad165f88dd2d95b2680a4849d234237b43cbe72a4b6706de0d4620725d725b7f` |
| [01-foundations/12-research-terms-and-levels-of-analysis-comments.md]({{< ref "ai/design-research/01-foundations/12-research-terms-and-levels-of-analysis-comments" >}}) | 60 | 8167 | 0644 | Present | `ed3256f207b31c09037fd5b688c0bd705a650c393d9643262fde007dcfdc94d5` |
| [00-index.md]({{< ref "ai/design-research/00-index" >}}) | 131 | 34534 | 0644 | Present | `5fb7701001c56ef960b87c5d11dda4bb0bf2ff1d65a6f1561467b10fb87f7fb1` |
| archived source 005 | 10 | 960 | 0664 | Present | `[private-source checksum omitted]` |

### Verification scope


The terms note, sibling comments, index, source redirect, and audit passed a scoped check of 845 internal Markdown references across five files, including heading anchors. The checker skipped 1 external URLs. External availability, legacy wiki references, reference-style citations, source claims, and experimental interpretations were not independently verified.

The four affected notes outside the audit match their exact independently constructed expected bytes. Code fences close, and the footnote check found no missing or duplicate definitions. New prose has no trailing whitespace. Scoped working-tree and staged diff checks passed, and permission modes were retained.

All 99 other baseline files retain their bytes and modes. The audit was checked separately, and its earlier 465272 bytes remain an unchanged prefix with SHA-256 `931ae50bb32fa88e50310763ba6f26d42ebe1b161b8eaa5def7c95af86b0b8a5`. Only the present section was appended.

Git HEAD, index bytes, and the staged name-status listing remained unchanged at the pre-append verification. HEAD was `[repository fingerprint omitted]`, the index SHA-256 was `[repository fingerprint omitted]`, and the existing 84-path name-status listing had SHA-256 `[repository fingerprint omitted]`. Existing staging was left untouched. No files were staged or committed by this operation.

The temporary boundary, redirect, and audit helpers were removed after their transferred contents and emptiness were checked. The original source remains reachable through its original path, and the complete dialogue reconstructs exactly from the two recorded destination ranges.

## Declarative system configuration dialogue


Date: 2026-10-01. The user approved the proposed four-note split of 0921-declarative-system-config.md (archived source 015), with separate sibling comments. The source had been read completely. Original exchanges, role labels, reasoning labels, embedded prior context, examples, corrections, citations, and whitespace were retained without rewriting.

### Original source and reconstruction


The original source contained 2803 LF-terminated lines and 74103 bytes, with mode 0644. Its SHA-256 was `99743ee8617246be0e14070a980a74f3555ada1b92593b7ea0e5b3b5413aa7ed`. Ranges below are inclusive and one-based. Byte positions and checksums concern source text only, excluding new navigation and comments.

The original heading remains at line 1 and bytes 1 to 28 of the source overview. Its 28 bytes have SHA-256 `db5eb7f72a566b1b3244eeb86fa99030cb44292a78639de5c2567bbe8d7feb3d`. The heading and the four destination ranges below cover every original byte and line exactly once.

| Original lines | Original bytes | Destination | Destination lines | Destination bytes | Bytes | SHA-256 |
|---|---|---|---|---|---|---|
| 2 to 1789 | 29 to 49610 | [05-runtime-and-execution/08-prompt-text-composition-and-registry.md]({{< ref "ai/design-research/05-runtime-and-execution/08-prompt-text-composition-and-registry" >}}) | 12 to 1799 | 1584 to 51165 | 49582 | `bef6b054b1796b8287ee8423a765a7fed75b52143b90deb20368d6fb6c7b7f42` |
| 1790 to 2073 | 49611 to 59530 | [05-runtime-and-execution/09-declarative-system-configuration-and-instantiation.md]({{< ref "ai/design-research/05-runtime-and-execution/09-declarative-system-configuration-and-instantiation" >}}) | 12 to 295 | 1355 to 11274 | 9920 | `cd02bbae78b9b0e6d3885332b5536a98a74c97761534c8c5559432a72b533c0c` |
| 2074 to 2596 | 59531 to 70016 | [05-runtime-and-execution/10-configuration-publishing-and-version-identity.md]({{< ref "ai/design-research/05-runtime-and-execution/10-configuration-publishing-and-version-identity" >}}) | 12 to 534 | 1299 to 11784 | 10486 | `c37e3e57a002412c85c9cd48d078ea2c37dd08966c87d27fc9b3fa289c471ad9` |
| 2597 to 2803 | 70017 to 74103 | [05-runtime-and-execution/11-evaluation-plans-and-system-configuration.md]({{< ref "ai/design-research/05-runtime-and-execution/11-evaluation-plans-and-system-configuration" >}}) | 12 to 218 | 1335 to 5421 | 4087 | `684101a8f78ca42ba12930a64dbb3283e33eea84a0b99f146c37d14f4c7c5acd` |

Concatenating the retained heading and the four destination byte intervals in original order reconstructs all 74103 original bytes and 2803 lines with the original SHA-256. The moved body contains 74075 bytes and 2802 lines. The four new navigation prefixes contain 5569 bytes and 44 lines, giving 79644 bytes and 2846 lines across the four source-bearing notes. No source boundary newline was added or removed.

### Duplicate source accounting


The prompt-registry archive (archived source 014) remains unchanged at 49606 bytes and 1788 lines, with mode 0644 and SHA-256 `[private-source checksum omitted]`. Only its title differs from the corresponding opening of the longer dialogue.

Its body, original lines 2 to 1788 and bytes 26 to 49606, contains 49581 bytes with SHA-256 `c33369539b5c055f33aa6f3a3177545ec2b53aaa8e9ed98cbc9921dd7f17b3b3`. The body is retained at lines 12 to 1798 and bytes 1584 to 51164 of the prompt note. The primary source's additional following blank line is also preserved in the primary mapping. Combining the archive's unchanged 25-byte heading with the shared destination bytes reproduces its full original checksum. The shared body was imported once, and the archive was neither shortened nor overwritten.

### Transfers and new comments


All original-text transfers used `_scripts/move_text.py`. Each transfer was dry-run before application, and each dry run left both files unchanged. Applied results matched independently calculated byte splices, and permission modes were retained. Transfers ran in descending original line order, starting with the final evaluation exchange and ending with the opening prompt discussion.

The [machine-readable mapping](/ai/design-research/reassembly-map.assets/declarative-system-config-reassembly.json) records the source and destination byte intervals, block and whole-file checksums, navigation prefixes, duplicate-source relationship, move commands, and verified reconstruction results.

The separate sibling comments explain the author's narrowing of the prompt requirements, open rendering rules, configuration versus environment and execution identity, publication enforcement, repository tradeoffs, authority, replay limits, and evaluation conditions. The comparison of prompt libraries remains saved source material rather than newly verified documentation.

The original path remains a 12-line, 2176-byte overview with SHA-256 `[private-source checksum omitted]`. Its original heading and mode remain unchanged. The overview links the four pieces in order, their separate comments, the unchanged archive, and both audit formats.

### Existing notes and index


The design-research index received four runtime-section entries. Removing exactly the 1809 added bytes and four lines reproduces its earlier bytes. No earlier index entry was rewritten or removed. Existing program history, workbench, language, authority, and evaluation notes were linked rather than edited.

At the pre-audit verification, all 131 other baseline collection files retained their bytes and modes. The earlier 476294 audit bytes remain an unchanged prefix with SHA-256 `[repository fingerprint omitted]`. Only the present section was appended. Both repositories retained their Git HEAD, index bytes, and staged name-status listings. No files were staged or committed by this operation.

Plain-writing guided only new comments, navigation, index entries, the source overview, and audit prose. The retained dialogue was not rewritten. The split adopts no prompt grammar, registry implementation, deployment policy, runtime interface, evaluation schema, or reproducibility guarantee.

### Final verification


The new notes, comments, source overview, and new index and audit passages passed a scoped check of 81 local Markdown references, including heading anchors. The checker skipped 11 external URLs. Source product claims and external documentation were not independently verified.

Code fences close in all four source-bearing notes. New commentary and navigation have no trailing whitespace. Scoped working-tree diff checks passed in both repositories. The saved mapping reconstructs both original source checksums from the recorded destination byte intervals.

All 131 unrelated baseline collection files retain their bytes and modes. Existing Git HEAD, index bytes, and staged name-status listings remain unchanged in both repositories. No files were staged or committed.

## Co-writer sketches


Date: 2026-10-01. The co-writer sketch and its complete examples were split between a new [writing case]({{< ref "ai/design-research/interactive-systems/14-collaborative-writing-and-text-assembly" >}}) and the existing [augmentation note]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}#from-rewriting-prompts-to-a-shared-writing-workspace). Separate [case comments]({{< ref "ai/design-research/interactive-systems/14-collaborative-writing-and-text-assembly-comments" >}}) and [meaning comments]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work-comments" >}}#co-writer-meaning-and-collaboration) contain new analysis.

The complete [audit]({{< ref "ai/design-research/interactive-systems/reassembly-map" >}}#stage-10-co-writer-sketches) and JSON mapping are maintained with interactive systems. They record all 2,120 original bytes and 39 logical lines, with exact reconstruction of both source checksums. The earlier augmentation text and comments remain unchanged prefixes.
