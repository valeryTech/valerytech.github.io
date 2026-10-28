---
draft: false
toc: true
description: "Proposes typestate and runtime certificates for evidence coverage, authority, conflicts, and provenance, allowing qualified findings or abstention while limiting soundness claims to explicit operator assumptions."
title: "03 Epistemic Contracts For Rag"
linkTitle: "03 Epistemic Contracts For Rag"
---

Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

here we're not talking about feedback loops, optimization, and other questions arisen in the common discussion in [Dsl Ai]({{< ref "ai/architecture-dsl-like/dsl-approach/dsl-ai" >}})

later we should extract a set of underlying principles and framings:

- treat the investigation as a program
- move as many failures as possible from runtime into compilation

LLMs are good at proposing programs and

## main reasoning flow


what if we define a kind of language (DSL?) and introduce use compiler where we move all work (as always in best practices) to check and verify program correctness?

## flow


The useful framing (of what?) is:

> Treat the investigation as a program, and move as many failures as possible from runtime into compilation.

That fits this domain especially well because LLMs are good at proposing programs and bad at being the only thing responsible for whether those programs are valid.

The compiler could check several layers.

First, ordinary structural correctness:

```text
search : Corpus × Query -> CandidateSet
extract : CandidateSet -> EvidenceSet
claims : EvidenceSet -> ClaimSet
compare : ClaimSet × ClaimSet -> ConflictSet
```


So this fails before execution:

```text
search(...)
| find_conflicts()
```


because `find_conflicts` expects claims, not candidates.

Second, semantic constraints.

For example:

```text
synthesize(evidence)
require coverage == complete
require authority >= approved
```


The compiler can see that the program never computes `coverage`.

So it rejects:

```text
Compile error:
`synthesize` requires CompleteCoverage,
but this program produces UncheckedCoverage.
```


That is much more useful than discovering after the final answer that the corpus was only partially scanned.

You can push this pretty far with types.

For example:

```text
EvidenceSet<
  Coverage = Complete,
  Authority = Verified,
  Provenance = Preserved
>
```


Then:

```text
finalize :
  EvidenceSet<
    Complete,
    Verified,
    Preserved
  >
  -> DefensibleFinding
```


while:

```text
EvidenceSet<
  Partial,
  Unknown,
  Preserved
>
```


cannot become a `DefensibleFinding`.

It may only become:

```text
PreliminaryFinding
```


or:

```text
Abstention
```


This is close to a type-and-effect system.

The value has a normal type:

```text
EvidenceSet
```


and effects/properties:

```text
coverage=partial
authority=unchecked
conflicts=unresolved
```


Operators transform those properties.

For example:

```text
check_coverage
:
EvidenceSet<coverage=unknown>
->
EvidenceSet<coverage=complete | incomplete>
```


And:

```text
resolve_authority
:
EvidenceSet<authority=unknown>
->
EvidenceSet<authority=verified>
```


Then the compiler can reason about the whole pipeline without executing the LLM work.

A more complete compilation pipeline could look like this:

```text
DSL
 ↓
parser
 ↓
typed AST
 ↓
semantic validation
 ↓
epistemic validation
 ↓
logical plan
 ↓
optimizer
 ↓
physical plan
 ↓
runtime
```


The interesting part is `epistemic validation`.

The compiler could check rules like:

```text
Every final claim must have a provenance path.

Every required question facet must reach
either evidence or explicit abstention.

A complete-coverage claim requires a corpus scan.

A normative conclusion cannot depend only
on informal sources.

Unresolved higher-authority contradictions
prevent finalization.

A source marked superseded cannot dominate
a current source.

A finding cannot be called "supported"
if all supporting evidence comes from
one dependent source chain.
```


Now the DSL starts becoming genuinely domain-specific.

You could write:

```text
investigate "retry semantics" {

  principles =
    corpus
    | select(type = principle)
    | search(question)
    | extract_claims

  practices =
    corpus
    | select(type = practice)
    | search(question)
    | extract_claims

  conflicts =
    compare(principles, practices)

  evidence =
    conflicts
    | resolve_authority
    | check_coverage

  return synthesize(evidence)

  require coverage == complete
  require provenance == preserved
  require conflicts.high_authority == resolved
  abstain if unsupported
}
```


The compiler can derive obligations from that program.

Conceptually:

```text
Program says:
require coverage == complete

Compiler derives:
must prove all corpus partitions were screened

Program says:
require provenance == preserved

Compiler derives:
every transformation must implement lineage propagation

Program says:
abstain if unsupported

Compiler derives:
synthesis must preserve evidence sufficiency state
```


That is very close to proof obligations in formal methods.

The proposal is to avoid trying to formally prove the LLM's semantic judgment itself.

You cannot realistically prove:

> this paragraph genuinely supports this claim

with a compiler.

But you can prove many surrounding properties:

```text
the paragraph exists

the source span is valid

the source belongs to the declared corpus

the extraction came from that source

the evidence was processed by the declared operator

the corpus coverage requirement was executed

the authority rule was applied

no required branch was silently skipped

all final claims have source lineage

the program cannot produce FinalAnswer
from IncompleteEvidence
```


That distinction is important.

The compiler verifies the computation's structure and contracts.

The runtime evaluates uncertain semantic operations.

You could even make probabilistic operations explicit in the type system.

For example:

```text
LLMExtract : SourceUnit -> Probabilistic<ClaimSet>
```


while:

```text
ExactFilter : SourceSet -> Deterministic<SourceSet>
```


Then a final result could carry information such as:

```text
Finding {
  deterministic_lineage: true
  semantic_judgments: 7
  unresolved_judgments: 1
}
```


Or define effects:

```text
effects {
  retrieval_uncertainty
  semantic_inference
  external_source
  incomplete_coverage
}
```


The compiler can forbid some effects in certain contexts.

For example:

```text
policy ComplianceReview {
    deny external_source
    deny incomplete_coverage
    require provenance
}
```


Then:

```text
compile investigation under ComplianceReview
```


will fail if the plan attempts web search or leaves coverage unchecked.

And after execution you can have another validation stage:

```text
compile-time verification
        +
runtime assertions
        +
post-execution validation
```


For example:

```text
compile time:
all final claims require provenance

runtime:
coverage scanner actually visited 4,182/4,182 documents

post execution:
every final claim resolves to valid source spans
```


The proposal is to call these three layers:

```text
static guarantees
dynamic guarantees
evidence guarantees
```


The optimizer can then work underneath without changing semantics.

A program says:

```text
search(question)
```


and the compiler may choose:

```text
summary scan
→ lexical candidates
→ dense candidates
→ union
→ parent expansion
```


or:

```text
per-document screening
```


provided both implementations satisfy the same declared contract.

For example:

```text
search[coverage=complete]
```


cannot compile to ordinary top-k vector retrieval.

But:

```text
search[coverage=best_effort]
```


can.

That is a very useful separation between logical intent and physical execution.

The working interpretation is that the deepest design principle here is:

> Make epistemic guarantees part of the program semantics.

Not comments.

Not prompt instructions like:

> "Please make sure you considered all documents."

Actual constraints that the compiler and runtime must satisfy.

Then something like:

```text
answer(question)
```


is just a weak program.

While:

```text
answer(question)
require corpus_coverage == complete
require provenance == exact
require authority == resolved
require contradictions == surfaced
abstain if evidence < sufficient
```


is a different program with stronger semantics.

That could become one of the core differentiators of the whole system

## 6. Make gaps and failures first-class values


This is important.

A search shouldn't only return:

```text
Evidence[]
```


It should probably return something like:

```text
SearchResult {
    candidates
    coverage
    failures
    unexplored
    diagnostics
}
```


And synthesis shouldn't just return text:

```text
Finding {
    claims
    support
    counterevidence
    unresolved
    coverage
    authority
    status
}
```


With:

```text
status =
  supported
  qualified
  conflicting
  insufficient
  incomplete
```


Then the agent can reason over explicit state.

Otherwise the LLM has to infer failure from prose.

## 7. Assertions could become part of the language


Something like:

```text
require coverage == complete
require primary_sources >= 1
require unresolved_conflicts == 0
require authority >= approved
```


Or:

```text
assert corpus.screened == corpus.available

assert every(claim,
    has_support(claim)
)

assert no_unresolved_high_authority_conflict
```


These aren't just runtime checks.

They define when an investigation is allowed to produce a conclusion.

That is close to an effect/type system.

You could imagine:

```text
Finding<
    coverage=complete,
    authority=verified,
    conflicts=resolved
>
```


versus:

```text
Finding<
    coverage=partial,
    authority=unknown
>
```


A downstream operator could refuse the second type.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

The passages below come from the [typed investigation report]({{< ref "ai/design-research/06-research-reports/02-typed-durable-inspectable-runtimes" >}}). The report's [shared bibliography]({{< ref "ai/design-research/06-research-reports/02-typed-durable-inspectable-runtimes" >}}#references) remains in the main report.

### Formal languages and verification


**λ_A** is the strongest warning against presenting "typed agents" as the contribution. Agent composition, probabilistic choice and bounded iterative behaviour already have a typed-calculus treatment. The proposed research gap is to make *evidence state* and *admissibility of conclusions* part of the calculus: for example, `Evidence<Screened, Provenanced, AuthorityChecked>` and a finalisation rule that consumes appropriate certificates.

**Lean4Agent** goes further toward actual agent verification by modelling workflows and trajectories in a dependent-type language. Its key lesson is methodological: formal guarantees must state the assumptions under which semantic consistency is proved. A first paper on the proposed system should similarly state operator assumptions explicitly--for example, a `screen_all` physical operator can guarantee execution over a corpus snapshot, while an `llm_relevant` predicate cannot deterministically guarantee semantic recall.

**PlanCompiler** is the closest direct empirical precedent for the "move errors into compilation" thesis. It establishes that typed plans plus static graph validation can materially outperform free-form generation on structured workflows. It leaves the research opening you care about because its type errors concern workflow schemas and persistence boundaries rather than provenance, source precedence, evidence sufficiency or justified abstention.

**Causal Past Logic/ZipperGen** shows how properties that depend on execution history can live outside ordinary types. That is relevant to contracts such as "every finalised claim must previously have passed evidence validation" or "every conflicting high-authority source must eventually reach adjudicated or unresolved state". This suggests a clean split: types/refinements for local data states, temporal monitors for trace properties.

**AutoSpec+** validates another part of the proposed architecture: let an LLM propose a structured artefact, then let a deterministic symbolic component reject it and return diagnostics. Its subject is program specification, not investigation, so "compiler-guided repair of an investigation plan" remains available as a domain contribution.

**Caesar/HeyVL and Ellora** are important because they prevent an over-simple deterministic/probabilistic dichotomy. Existing program logics can prove quantitative properties of probabilistic programs; the long-term version of the proposed type/effect system could therefore permit contracts richer than `Probabilistic<T>`, such as bounded failure probability or expected resource consumption. Neither work supplies evidence provenance, authority or investigation semantics.

### The formal core


The proposal is to avoid putting all properties into a static type such as:

```text
EvidenceSet<
    Coverage = Complete,
    Authority = Verified,
    Conflicts = Resolved
>
```


because some of those facts only become known after execution. A better model is typestate plus runtime certificates:

```text
EvidenceSet<Unchecked>
    |
    | screen(snapshot)
    v
EvidenceSet<Screened<CoverageCertificate>>

    |
    | resolve_authority(policy)
    v
EvidenceSet<
    Screened<CoverageCertificate>,
    AuthorityChecked<AuthorityCertificate>
>

    |
    | analyse_conflicts
    v
EvidenceSet<
    ...,
    ConflictsChecked<ConflictCertificate>
>
```


Then make the public result an algebraic data type:

```text
InvestigationResult =
    DefensibleFinding {
        claims,
        provenance_certificate,
        coverage_certificate,
        authority_certificate,
        conflict_certificate
    }
  | QualifiedFinding {
        claims,
        unresolved_obligations
    }
  | Abstention {
        reason,
        unresolved_obligations,
        evidence_so_far
    }
```


That formulation follows the lessons from typed workflow checking, dependent-type verification and probabilistic guarantees: static structure can be proved, dynamic observations can be certified, and uncertain semantics should remain explicit assumptions or probabilities.

A realistic first theorem would therefore be **structural soundness**, along roughly these lines:

> For every well-typed investigation \(P\), if each physical operator satisfies its declared contract, successful evaluation cannot return `DefensibleFinding<C>` without runtime evidence satisfying every certificate required by \(C\); otherwise evaluation yields a weaker result or explicit abstention.

This deliberately does **not** prove that an LLM correctly judged semantic entailment. It proves that the system cannot silently skip the required verification path, lose lineage, ignore a declared source-precedence check, or turn an unresolved obligation into the strongest result type. That boundary is consistent with formal agent workflow work and the broader probabilistic-program-verification literature.

<!-- Navigation added during reassembly on 2026-09-30. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

## General verification and acceptance


The [initial verification stack]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}#5-verification-must-not-be-similarity-to-the-previous-output) and [later independent relations]({{< ref "ai/design-research/01-foundations/09-verification-and-acceptance" >}}#7-verify-through-several-independent-relations) are now in the shared verification note. The evidence-specific contracts, certificates, and conditional structural-soundness claim remain here.
