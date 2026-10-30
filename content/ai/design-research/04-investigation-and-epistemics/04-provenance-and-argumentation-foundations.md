---
draft: false
toc: true
description: "Connects provenance semirings, argumentation, and W3C PROV to compositional evidence dependencies, source invalidation, disagreement, and trust-sensitive rules that govern accepted claims and effects."
title: "04 Provenance And Argumentation Foundations"
linkTitle: "04 Provenance And Argumentation Foundations"
---
### 1. Provenance semirings may be directly useful


The 2007 Green/Karvounarakis/Tannen work on **provenance semirings** is surprisingly aligned with what we were discussing.

The question they attack is essentially:

> If a database result is produced by a computation over many inputs, can provenance propagate through the computation algebraically?

And the answer is yes. Their framework applies provenance annotations compositionally through relational algebra and even Datalog. ([UC Davis Computer Science](https://www.cs.ucdavis.edu/~green/papers/pods07.pdf?utm_source=chatgpt.com "Provenance Semirings"))

Imagine:

```text
A = evidence from ADR-13
B = evidence from principle.md
C = evidence from RFC-8
```


and the conclusion depends on:

```text
(A AND B) OR C
```


Then provenance isn't merely:

```text
citations = [A, B, C]
```


The provenance contains the structure:

```text
(A × B) + C
```


That's a big difference.

It lets you later ask:

```text
Why does X hold?

What are the alternative evidence paths for X?

If source B is removed, does X remain supported?

Is X completely dependent on one source?

Which source contributes to the largest number
of downstream conclusions?
```


This is probably the theoretical area proposed for initial investigation in the research discussion.

There's even continuing work around database provenance and formal verification; ProvSQL, for example, implements provenance-aware relational querying based on the semiring framework. ([ProvSQL](https://provsql.org/lean-docs/Provenance.html?utm_source=chatgpt.com "Provenance"))

### 7. Argumentation theory is relevant to the claim/evidence graph


There's a large AI field called **abstract argumentation**.

Its basic abstraction is startlingly simple:

```text
Arguments = nodes
Attack = edges
```


Then formal semantics determine which sets of arguments can coherently be accepted.

Later **bipolar argumentation frameworks** add both:

```text
supports
attacks
```


between arguments. ([ScienceDirect](https://www.sciencedirect.com/science/article/pii/S0888613X13000509?utm_source=chatgpt.com "Bipolarity in argumentation graphs: Towards a better understanding - ScienceDirect"))

That's very close to our:

```text
Claim
   ↑ supports
Evidence A

Claim
   ↑ contradicts
Evidence B
```


The recommendation is not to adopt argumentation theory wholesale. Our evidence has source lineage, authority, versions and retrieval provenance that an abstract argument doesn't necessarily have.

But if you eventually ask:

> Given this graph of support and contradiction, which conclusions are defensible?

there's decades of formal work you shouldn't reinvent.

### 7. Argumentation theory handles disagreement


For investigation systems in particular:

```text
Claim A
    ↑ supports
Evidence 1

Claim A
    ↑ attacks
Evidence 2
```


could have formal semantics based on argumentation frameworks.

Then authority and contradiction become genuine reasoning operations rather than prompt instructions.

You could combine:

```text
Datalog             derivation
Argumentation       disagreement
Provenance algebra  lineage
```


in the knowledge substrate.

### 8. W3C PROV gives a ready-made vocabulary for lineage


W3C PROV defines:

```text
Entity
Activity
Agent
```


and relations around:

```text
generated-by
used
derived-from
attributed-to
associated-with
revision-of
quoted-from
```


It also has the concept of a **Plan**, where an activity follows a predefined workflow. ([W3C](https://www.w3.org/TR/prov-primer/?utm_source=chatgpt.com "PROV Model Primer"))

You can almost directly map:

```text
Source paragraph      Entity
Query                 Entity
Search execution      Activity
Agent                  Agent
Extracted evidence    Entity
Synthesis execution   Activity
Claim                 Entity
Investigation DSL     Plan
```


The recommendation is not to necessarily expose RDF/PROV-O anywhere in the product.

But it's useful prior work for getting the proposed lineage ontology correct.

## 8. Provenance should be intrinsic to every value


Every object produced by the runtime should know how it was created.

For example:

```text
Evidence {
    value
    source
    source_span

    produced_by:
      ExtractEvidence#82

    inputs:
      Candidate#17

    query:
      QueryRepresentation#4

    retrieval_paths:
      dense_rank: 7
      bm25_rank: 38
      hypo_question_rank: 2

    derived_from:
      SourceUnit#318
}
```


Then every transformation automatically extends lineage.

That gives you:

```text
final claim
    ↓
support relation
    ↓
evidence
    ↓
retrieval candidate
    ↓
query representation
    ↓
source unit
    ↓
document
```


The agent can query this graph programmatically.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

The passages below come from the [typed investigation report]({{< ref "ai/design-research/06-research-reports/02-typed-durable-inspectable-runtimes" >}}). The report's [shared bibliography]({{< ref "ai/design-research/06-research-reports/02-typed-durable-inspectable-runtimes" >}}#references) remains in the main report.

### Provenance, query processing and scientific workflows


**Provenance semirings** are probably the most directly reusable piece of mature theory. Suppose finding \(F\) can be supported by evidence \(e_3\), or jointly by \(e_1\) and \(e_2\). A provenance expression can retain that dependency structure rather than flattening it into `[e1,e2,e3]`. This gives you principled answers to "which evidence paths sustain this conclusion?" and "does invalidating source B invalidate the result?".

**ProvSQL** makes that idea more than mathematical decoration: provenance circuits can be maintained inside an ordinary relational system, and the project has invested in formalising its algebraic core in Lean. A prototype therefore does not require a new provenance database; a relational provenance substrate is a plausible implementation choice.

**W3C PROV** is useful for interoperability and vocabulary. In particular, concepts such as derivation, revision and primary source overlap with what an investigation system needs to record. It does not answer the domain-policy question "accepted ADR outranks draft RFC", so the proposal is to model authority as a separate policy relation over provenance/source metadata.

**CWL** demonstrates that a declarative workflow can become a reproducible artefact independent of a particular execution engine. The missing semantic difference is the one the research notes already identify: scientific workflow stages generally promise deterministic input/output behaviour, whereas an LLM `extract`, `relevance`, `support` or `contradict` operator carries uncertainty that must remain visible to the rest of the program.

**DSPy** is very close to the programming model at the LM layer: programmers declare modules and let an optimiser improve their implementation. DSPy Assertions also demonstrates that constraints can participate in runtime refinement. The proposed distinction would be that some constraints are *admissibility conditions for an investigation result* and produce certificates that survive through the type/effect system, rather than being only an optimisation signal or retry instruction.

**RUBICON** is the closest systems architecture to the logical/physical-plan proposal. It supports the argument that LLM/data work should be expressed in a higher-level algebra and lowered using database-style planning. The research gap is to extend this query-processing model from "produce the requested data/result efficiently" to "produce a result only under declared evidence conditions".

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Source context for behavioral compilation


The following section comes from [Behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}). The original question and access caveat remain in that note. The original argument and section number are retained, with editorial wording.

# 6. Provenance should become a language-level concept


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The DSL will add much more value if provenance is represented in its semantics rather than merely in output JSON.

Conceptually, the language should distinguish:

```
RawText
ModelGeneratedText
SourceArtifact
EvidenceUnit
SupportedClaim
UnsupportedClaim
GroundedArtifact
```


Possible rules:

- `retrieve` returns evidence-bearing values, not detached strings.
- A `SupportedClaim` can only be constructed from one or more `EvidenceUnit`s.
- A `GroundedAnswer` requires a collection of claims plus their support mappings.
- An unverified model output cannot silently become a supported claim.
- Source-location precision cannot exceed what ingestion preserved.
- Merging claims also merges their provenance dependencies.

This gives the compiler something meaningful to enforce.

Without such types, the DSL risks becoming a YAML workflow syntax whose compiler can only catch misspelled fields. With evidence, effect, and artifact types, it becomes a real semantic boundary.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Provenance in validation and transition rules


The following passage comes from the [semantic-substrate report]({{< ref "ai/design-research/01-foundations/02-semantic-substrate-design-report" >}}). It extends the lineage discussion above by making provenance a condition for permitting a state transition or effect. The complete payment-approval example remains intact.

### Provenance should become operational semantics when it affects trust


Provenance is often treated as logging: useful after execution but irrelevant to whether an effect is permitted.

For systems where trust depends on where information came from, that is insufficient.

The stronger model is:

\[V(s,p,\pi)\]

where \(\pi\) is provenance and validation depends on it.

For example:

\[\operatorname{approve}(payment)\]

might require:

\[
\begin{aligned}

&\text{proposal derived from invoice }x\\

&\land\;\text{invoice }x\text{ authenticated}\\

&\land\;\text{reviewer distinct from proposer}\\

&\land\;\text{reviewer's approval capability valid}.

\end{aligned}
\]

Then provenance is part of the transition semantics, not an audit annotation.

Recent agent-security work is exploring this direction by binding authority-bearing tool arguments to their provenance, but this is still emerging research. [^turn19academia48] The broader principle has clear roots in capability reasoning: authority should flow through explicit, inspectable paths. [^turn3search0]

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Citation definitions for the imported report sections


The definitions below are local copies of the entries used in these passages. The [complete original bibliography]({{< ref "ai/design-research/01-foundations/02-semantic-substrate-design-report" >}}#references) remains in the report. The copies are separate from the original source text.

[^turn3search0]: [Overview: An Ode to the Granovetter Diagram](https://erights.org/elib/capability/ode/overview.html)

[^turn19academia48]: [The Granularity Mismatch in Agent Security: Argument-Level Provenance Solves Enforcement and Isolates the LLM Reasoning Bottleneck](https://arxiv.org/abs/2605.11039)
