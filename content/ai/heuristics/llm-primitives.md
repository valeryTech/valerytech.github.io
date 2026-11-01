---
draft: false
toc: true
title: "LLM Primitives, System Parts, and Guarantees"
description: "The nine information operations (P1-P9) underneath LLM product capabilities, the seven non-model system parts (M1-M7) required to run them safely, and the eight trace guarantees (G1-G8) of an evidence-and-decision layer."
linkTitle: "LLM Primitives"
---

[LLM capabilities]({{< ref "ai/heuristics/llm-capabilities" >}}) (`C1-C14`) describe user-facing jobs an application performs. Underneath those capabilities sit **primitives** (`P1-P9`): recurring operations on information that appear across consumer and enterprise AI products alike. Because language models are stateless token predictors (`A1-A10` in [LLM features]({{< ref "ai/heuristics/llm-features" >}})), those primitives become reliable only when paired with **non-model system parts** (`M1-M7`) and evaluated against explicit **trace guarantees** (`G1-G8`).

## How the layers fit together


| Layer | Question | Examples | Defined in |
| --- | --- | --- | --- |
| **Application capability** | What job does the product do for a user or buyer? | `C3` turning everyday input into records; `C12` investigating evidence across documents | [LLM capabilities]({{< ref "ai/heuristics/llm-capabilities" >}}) |
| **Primitive** | What operation does the system perform on information? | `P3` ground a mention; `P6` decide whether evidence suffices to act | This note |
| **System part** | What non-model component stores state, enforces policy, or executes effects? | `M2` environment register; `M5` review surface; `M6` deterministic executor | This note |
| **Guarantee** | What invariant must every execution trace preserve? | `G2` provenance back to sources; `G4` ask or abstain when under-supported | This note |
| **LLM feature** | Why does the operation work, fail, or require surrounding software? | `A2` static prior lacks private names; `B8` cooperative completion resists abstaining | [LLM features]({{< ref "ai/heuristics/llm-features" >}}) |

Engineering and evaluation work at the primitive and system-part layers compounds across products: improving candidate grounding (`P3`), sufficiency thresholds (`P6`), or side-by-side review (`M5`) in one workflow transfers directly to other capabilities built on the same core.

## Primitives


| # | Primitive | What the system does | Capabilities | Concrete examples |
| --- | --- | --- | --- | --- |
| P1 | Recognize | Turn speech, photos, or scans into text and layout | C3, C4, C7, C8 | Voice dictation; receipt, meal, or field-equipment photo capture |
| P2 | Extract | Turn unstructured text into a typed record with named fields | C2, C3, C13, C14 | Payment message to ledger entry; intake chat to structured case fields; legacy code to rule schema |
| P3 | Ground | Map a mention to a known entity in an environment or register | C3, C5, C7, C8, C11, C13 | Spoken client name to CRM account; "this customer" to on-screen object; symbol reference to AST node |
| P4 | Acquire | Retrieve candidate passages, records, or entities for a request | C1, C5, C6, C8, C10, C12, C13 | Lexical, semantic, phonetic, or spatial candidate search over documents, tables, or asset catalogs |
| P5 | Judge | Evaluate a candidate against evidence, schemas, or rubrics: keep, exclude, or flag conflict | C1, C4, C6, C8, C9, C12, C13 | Passage support vs. mere mention; duplicate transaction check; phonetic and context fit |
| P6 | Decide sufficiency | Determine whether evidence is strong enough to act, ask a question, or abstain | C2, C3, C7, C8, C9, C11, C12, C14 | Confirm before writing; ask instead of guessing missing fields; leave unsupported claims unresolved |
| P7 | Compose | Assemble grounded evidence into an answer, draft, query, or action call that keeps provenance | C1, C4, C6, C10, C11, C12, C13, C14 | Source-linked brief; deterministic SQL query over a ledger; drafted UI action for approval |
| P8 | Remember | Decide what to retain across turns, sessions, or tools with scope and validity metadata | C2, C5, C14 | Confirmed user preferences, scoped domain terminology, ongoing engagement timeline |
| P9 | Link | Connect a new record to earlier system records that describe the same underlying entity or event | C5, C9, C10, C14 | Multiple crew reports tied to one water-main break; new memory superseding or contradicting an older one |

**Context vs. memory (`P4` vs. `P8`).** `P8 Remember` decides what is worth keeping from an interaction and writes it to a store (`M3`) with source, timestamp, and scope. Selecting which stored records enter the prompt for a specific request is `P4 Acquire` over that store. Separating retention from per-request context assembly prevents stale or out-of-scope records from leaking silently into unrelated tasks.

**Ground vs. Link (`P3` vs. `P9`).** `P3 Ground` resolves a mention against an authoritative external register (`M2`) that exists independently of the model. `P9 Link` connects a newly created record to earlier records produced inside the system over time. `P9` is distinct for two reasons: its errors are asymmetric (a false merge can hide a second active fault, whereas a missed link merely duplicates review), and the system's own prior links re-enter later context as input (`D6` in [LLM features]({{< ref "ai/heuristics/llm-features" >}})), allowing an early false merge to cascade unless links stay separate and reversible (`G8`).

## System parts around the primitives


Primitives describe operations on information, but a safe product also requires deterministic components that language models cannot supply on their own:

| # | System part | What it holds or does | Why the model cannot supply it |
| --- | --- | --- | --- |
| M1 | Integration surface | Where the product meets users and host software: clipboard, browser extension, mobile app, SDK, webhook, or API | Determines who must integrate or grant access before the product works at all |
| M2 | Environment model | The authoritative register of private entities, schemas, aliases, states, and valid domain operations | Private entities are absent from parametric weights (`A2`), and guesses must lose to the register (`B10`) |
| M3 | Context and memory store | Persistent records with source, timestamp, scope, version, and validity, plus scoped snapshot selection | Models keep no native state across calls (`A6`) and condition only on bounded context (`A3`) |
| M4 | Policy and permissions | Read/write grants, role and tenant boundaries, purpose restrictions, consent, and deletion rules | Instructions and untrusted data share one token channel (`A5`), so access rules must run outside the model (`D9`) |
| M5 | Review surface | UI where a person inspects candidates, conflicting evidence, and concrete action parameters before deciding | Model confidence prose is uncalibrated (`B6`), and users rubber-stamp suggestions when evidence is hidden |
| M6 | Executor | Deterministic code that re-validates preconditions and concrete arguments against `M4` before causing external effects | Authorizing a tool class is not authorizing any specific call; valid syntax with wrong IDs still causes damage |
| M7 | Trace | Immutable log of original inputs, retrieved candidates, judgments, human edits, and executed effects | Required to verify guarantees `G1-G8`, audit incidents, and keep model outputs from masquerading as primary facts (`D6`) |

## Where primitives appear across product archetypes


Different product shapes run variations of the same seven-step pipeline. Reading across rows shows what stays reusable and what changes per application:

| Step | Primitives | Record capture (expenses, meals, forms) | Conversational intake and check-ins | Corpus evidence investigation | Environment-grounded dictation or copilot |
| --- | --- | --- | --- | --- | --- |
| Capture | P1 | Voice note, text, receipt or meal photo | Multi-turn dialogue | Research or audit question | Spoken or typed command |
| Interpret | P2 | Extract candidate fields and amounts | Extract stated facts and goals | Parse question scope and constraints | Identify entity spans and intent |
| Ground | P3, P4 | Match merchant, category, or asset ID | Retrieve prior session context | Retrieve passages from versioned corpus | Match mention to codebase symbol or CRM record |
| Judge | P5 | Duplicate check; range and schema plausibility | Stated by user vs. inferred | Support, contradiction, and source authority | Phonetic, lexical, and context fit per candidate |
| Sufficiency | P6 | Confirm before ledger write; ask if ambiguous | Ask clarifying question instead of guessing | Pass support assertions or mark unresolved | Accept match, keep literal words, or ask |
| Act | P7 | Commit validated record via `M6` | Update profile or draft plan | Produce source-linked synthesis | Insert grounded text or propose tool call |
| Review | P8, P9 | Period-end reconciliation across entries | Longitudinal summary and trend checks | Propagate staleness when sources change | Record scoped terminology corrections |

Read horizontally, **Ground (`P3`, `P4`), Judge (`P5`), and Sufficiency (`P6`)** are populated in every column—they form a reusable core. **Capture (`P1`)** and **Act (`P7`)** vary sharply by domain and delivery surface; they are what turn that core into a specific product.

## The evidence-and-decision layer


The same underlying machine appears at both small and large scales whenever a product must connect messy language to authoritative sources without inventing facts:

| Aspect | Span-level entity grounding | Corpus-level evidence investigation |
| --- | --- | --- |
| Input | A spoken or typed mention that may be noisy or ambiguous | A question or requirement checked against a bounded document set |
| Candidates | Phonetic, lexical, semantic, or spatial lookup in an entity catalog (`M2`) | Multi-channel lexical and semantic retrieval with recorded routes |
| Evidence | Local context, entity relations, domain types, and acoustic/spelling similarity | Quoted source passages bound to an exact document snapshot and authority level |
| Decision | Accept entity, preserve literal text, or ask the user | Emit supported claims, flag conflicts, or leave the question unresolved |
| Result | Grounded request kept distinct from retrieved background context | Source-linked brief that marks downstream findings stale when inputs change |
| Organizing rule | Sufficiency is relative to the cost of a wrong action | "Unresolved" is a first-class valid output; primary sources stay authoritative |

The shared structure—**input -> candidate set -> explicit evidence -> sufficiency gate that may abstain -> provenance-preserving output**—is the evidence-and-decision layer.

### Guarantees


Rather than trusting fluent prose, an evidence-and-decision layer is specified and tested through **trace guarantees**. Many of these invariants can be checked mechanically or by a generalist reviewer inspecting the trace (`M7`), even before domain specialists judge nuanced edge cases (evaluation codes follow [LLM capabilities]({{< ref "ai/heuristics/llm-capabilities" >}}#evaluation-focus-codes)):

| # | Guarantee | Meaning | Concrete design rule | Evaluate |
| --- | --- | --- | --- | --- |
| G1 | Preserve | Original user words and raw sensor/source records are never overwritten silently | Store transcripts, photos, and raw reports immutably; attach corrections or links as separate annotations | GR, EV |
| G2 | Provenance | Every output claim, field, or link opens the exact inputs and evidence that produced it | Bind generated statements to document snapshot IDs, character spans, or register keys | GR, PV |
| G3 | Candidates visible | Reviewers and traces can inspect which alternatives were considered, not only the winner | Persist top candidates, retrieval routes, and rejection reasons in `M7` and expose close ties in `M5` | GR, CP |
| G4 | Sufficiency | Act only when evidence meets an explicit threshold; otherwise ask, escalate, or abstain and name the gap | Enforce pre-action assertions and two-threshold routing (auto-accept / ask human / leave unmatched) | AP, TB, RF |
| G5 | No implied completeness | A bounded search or partial register explicitly states its coverage limits | Report which corpora, date ranges, or systems were searched rather than implying exhaustive proof | GR, HR |
| G6 | Staleness | When an upstream source, schema, or fact changes, derived conclusions are marked stale | Track derivation edges in `M3`/`M7` and trigger targeted re-evaluation on source updates | ST, LT |
| G7 | Scope | Consumers receive only what their grant and purpose allow, and records retain the scope where they were confirmed | Scope learned terms and memories by user, project, or tenant; log disclosure receipts per read | PV, TB |
| G8 | Reversible | Links, merges, corrections, and stored memories can be undone, and deletions propagate to derived copies | Store entity links separately from raw records; propagate revocations and deletions across `M3` | ST, LT, PV |

`G6` handles inputs that **change**; `G8` handles inputs or consents that are **withdrawn**. `G7` and `G8` carry the heaviest weight whenever context or reconciled state is shared across people, shifts, or independent applications (`C5`, `C9`, `C14`).
