---
draft: false
toc: true
description: "Formalizes the search for least restrictive constraints preserving guarantees under compatible composition and replacement, with proposal-and-commit, CRDT, capability, and extension-set models."
title: "07 Constraint Guarantee And Composition Models"
linkTitle: "07 Constraint Guarantee And Composition Models"
---
# Constraint, guarantee, and composition models


Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

The formal argument and worked models come from the [semantic-substrate report]({{< ref "ai/design-research/01-foundations/02-semantic-substrate-design-report" >}}). The [literature survey]({{< ref "ai/design-research/01-foundations/06-architectural-least-commitment-and-precedents" >}}#foundations-in-the-literature) and [builder method]({{< ref "ai/design-research/01-foundations/08-semantic-substrate-builder-method" >}}) provide the surrounding context. The proposed extension-set measure and concluding thesis remain together below.

## Formalising constraint, guarantee, and composition


The most useful theoretical contribution you can make is probably to connect several existing formalisms into one builder-facing model.

### Behaviour spaces


Let \(\Sigma\) be the observable vocabulary of a component boundary: messages, events, calls, returned values, state transitions, effects, or some mixture of these.

Let

\[\mathcal T_\Sigma\]

be the universe of possible observable traces over that vocabulary.

A component \(M\) denotes a set of behaviours:

\[\llbracket M\rrbracket\subseteq\mathcal T_\Sigma.\]

A semantic constraint \(C\) defines an admissible subset:

\[C\subseteq\mathcal T_\Sigma.\]

Then:

\[
M\models C

\quad\Longleftrightarrow\quad

\llbracket M\rrbracket\subseteq C.
\]

A guarantee \(G\) can similarly be represented as a property of traces:

\[G\subseteq\mathcal T_\Sigma.\]

A sufficient constraint satisfies:

\[C\subseteq G.\]

Then every conforming component receives the guarantee immediately:

\[
M\models C

\Rightarrow

M\models G.
\]

This is deliberately simple. Real interface theories distinguish inputs from outputs, assumptions from guarantees and safety from progress; probabilistic, timed and security properties may require richer semantic domains than trace sets. [^turn14search3][^turn15search11]

### Refinement as semantic strengthening


Define behavioural refinement by:

\[
M'\sqsubseteq M

\quad\Longleftrightarrow\quad

\llbracket M'\rrbracket

\subseteq

\llbracket M\rrbracket.
\]

\(M'\) makes at least as strong a commitment: it permits no behaviour forbidden by \(M\).

For a trace property \(P\):

\[
M\models P

\land

M'\sqsubseteq M

\Rightarrow

M'\models P.
\]

This is the formal core of "restrict behaviour to strengthen what callers may assume". Refinement mappings are a richer state-based mechanism for establishing corresponding implementation relationships. [^turn1search0]

### Composition needs more than conformance


Let

\[M\otimes N\]

denote composition.

A useful substrate needs at least three properties.

**Compatibility**

\[\operatorname{Compat}(M,N)\]

says the two interfaces may legally be connected. Interface automata and architectural connector theories make this an explicit semantic judgement rather than assuming any matching syntax is meaningful. [^turn14search3][^turn16search14]

**Closure or preservation**

For the property of interest \(P\):

\[
M\models C_M,\;

N\models C_N,\;

\operatorname{Compat}(M,N)

\Rightarrow

M\otimes N\models P.
\]

The local contracts are useful only when they imply something about their composite.

**Substitutivity**

For any compatible context \(K[-]\):

\[
M'\sqsubseteq M

\Rightarrow

K[M']\sqsubseteq K[M].
\]

This is the property that lets a future implementation replace an existing component without invalidating reasoning performed against the boundary. Behavioural subtyping and interface refinement both target variants of this requirement. [^turn16search0][^turn14search8]

Together they give a better definition of **open-ended composition**:

> Future components need not be enumerated in advance. They are admitted by satisfying a stable conformance and compatibility relation, and the relevant guarantees are preserved when those components are composed or substituted.

"Open-ended" therefore does **not** mean "every component may be composed with every other component".

### Assume-guarantee contracts


For environment-sensitive properties, use:

\[\Gamma=(A,G)\]

with assumption \(A\) and guarantee \(G\).

Schematically:

\[M\models(A,G)\]

when \(M\) guarantees \(G\) in every environment satisfying \(A\).

Two components can then discharge parts of each other's assumptions. Actual composition rules vary by contract theory, but the key pattern is:

\[
\begin{aligned}

M_1 &: A_1\Rightarrow G_1\\

M_2 &: A_2\Rightarrow G_2\\

\text{compatibility/discharge conditions}

&\Rightarrow

M_1\otimes M_2\models G_{\mathrm{system}}.

\end{aligned}
\]

Modern assume-guarantee frameworks define parallel composition, logical conjunction and **quotient** operations with soundness/completeness results for their chosen component models. [^turn15search11]

This is probably the strongest existing mathematical foundation for a general "constraints -> guarantees -> composition" layer.

### The inverse problem


The proposed inverse problem is:

\[
\boxed{

G_{\text{desired}}

\longrightarrow

C_{\text{required}}

}
\]

There are at least three established versions.

Dijkstra computes the weakest initial-state condition for a program \(S\) to terminate in a state satisfying \(R\):

\[wp(S,R).\]

The "weakest" part is important: any weaker predicate would admit some initial states from which the guarantee can fail. [^turn15search0]

Assumption-generation systems ask:

\[\text{What is the weakest useful assumption on environment }E\]

such that:

\[M\otimes E\models P?\]

Counterexample-guided assume-guarantee verification can learn such assumptions iteratively. [^turn15search4]

Contract quotient asks, schematically:

\[X = S/M\]

for the most general missing component \(X\) such that:

\[
M\otimes X

\preceq

S,
\]

subject to the exact ordering and semantics of the contract theory. Quotient is explicitly used for incremental synthesis in assume-guarantee frameworks. [^turn15search11]

These suggest a general formulation for semantic substrate design.

Let \(\mathfrak C\) be a family of candidate substrate constraints. Instead of asking for the "smallest" constraint syntactically, order them by allowed behaviour.

A constraint \(C_2\) is more permissive than \(C_1\) when:

\[C_1\subseteq C_2.\]

Then seek a maximally permissive sufficient constraint:

\[
C^\star

\in

\operatorname{Max}

\left\{

C\in\mathfrak C

\;\middle|\;

\forall M_1,\ldots,M_n,

\;\left(

\bigwedge_i M_i\models C

\land

\operatorname{Compat}(M_1,\ldots,M_n)

\right)

\Rightarrow

\bigotimes_iM_i\models G

\right\}.
\]

There may be several incomparable maximal solutions or no effectively computable optimum. That is why **"minimal semantic constraints" should mean "least restrictive sufficient constraints relative to a defined guarantee and composition model"**, not "fewest rules".

### A proposal/commit transition model


The pattern from the participant-neutral system can be formalised very simply.

Let:

- \(S\) be canonical system states;
- \(P\) be possible proposals;
- \(V:S\times P\rightarrow\{\text{true},\text{false}\}\) be the validation predicate;
- \(\delta:S\times P\rightarrow S\) be the commit transition.

Define authoritative transitions only by:

\[
s\rightarrow s'

\quad\Longleftrightarrow\quad

\exists p:

V(s,p)

\land

s'=\delta(s,p).
\]

The proposal generator:

\[g:\text{Context}\rightarrow\mathcal P(P)\]

may be deterministic, stochastic, human, neural or adversarial. It is outside the trusted state-transition semantics.

Suppose the desired invariant is:

\[I:S\rightarrow\{\text{true},\text{false}\}.\]

If:

\[I(s_0)\]

and

\[
\forall s,p:

I(s)\land V(s,p)

\Rightarrow

I(\delta(s,p)),
\]

then by induction:

\[
\forall s\in\operatorname{Reachable}(s_0):

I(s).
\]

This is a powerful design result for the intended application:

> You do not need to constrain how a participant *imagines* possible next states if all authoritative transitions pass through a boundary that preserves the system invariant.

Authority can simply become part of \(V\):

\[
V(s,p)

=

V_{\text{type}}

\land

V_{\text{invariant}}

\land

V_{\text{authority}}

\land

V_{\text{provenance}}

\land

V_{\text{resource}}.
\]

Fabric's execute/order/validate model provides a concrete distributed analogue of this separation. [^turn10search16]

There is one major caveat: an external effect that occurs **before** validation or outside the committed state machine is not covered by this proof. External effects therefore need mediation, transactional semantics, compensation, idempotency, or an authority boundary of their own.

### CRDT algebra as constraint-derived coordination freedom


For the state-based CRDT family, the familiar sufficient structure is a join-semilattice:

\[(L,\sqcup)\]

where merge is associative, commutative and idempotent, and local updates move state monotonically upward in the partial order.

Then different delivery orders of the same information collapse to the same join:

\[
a\sqcup b

=

b\sqcup a
\]

\[
(a\sqcup b)\sqcup c

=

a\sqcup(b\sqcup c)
\]

\[a\sqcup a=a.\]

The algebra restricts what constitutes a legal replicated datatype, and in exchange much execution-order coordination becomes unnecessary. CRDT verification literature formalises and machine-checks corresponding convergence arguments for concrete replicated data types. [^turn11search6][^turn11search12]

This is an especially clean example of:

\[
\text{stronger local algebra}

\rightarrow

\text{weaker global coordination requirement}.
\]

### Capability semantics as an authority invariant


Let \(H(p,r,o)\) mean principal/component \(p\) holds authority \(r\) over object \(o\).

An effect:

\[\operatorname{effect}(p,r,o)\]

is permitted only if:

\[H(p,r,o).\]

If references are unforgeable and new authority can only arise through controlled creation or delegation from existing authority, the system can reason about future authority through reachability in the capability graph. That is the structural basis of object-capability reasoning and seL4's capDL analysis. [^turn3search0][^turn14search9]

The crucial insight is that a capability model does not need to predict what code a component will execute. It limits what consequences that code can have.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

The following section originally concluded the report's research-gap discussion. Its extension-set measure is a proposed research formulation, as the original text explains. The other [research gaps]({{< ref "ai/design-research/01-foundations/02-semantic-substrate-design-report" >}}#research-gaps-and-promising-directions) remain in the report.

### Generativity itself needs a better formal measure


Computer science has mature measures for correctness, refinement and compatibility. "How generative is this substrate?" is less well formalised.

A useful starting point is to avoid counting raw programs and instead define the **extension set** of a substrate:

\[
\operatorname{Ext}(C,G)

=

\{

X

\mid

X\models C

\land

\forall K\in\mathcal K_C:

K[X]\models G

\}.
\]

This is the set of future components admissible under constraint \(C\) while preserving \(G\) in the relevant compatible contexts.

Then two substrates can be compared:

\[
C_1

\text{ is at least as extension-permissive as }

C_2
\]

when:

\[
\operatorname{Ext}(C_2,G)

\subseteq

\operatorname{Ext}(C_1,G).
\]

This is a proposed research formulation, not an established metric. Its attraction is that it makes "generativity" explicitly relative to a guarantee. A completely unconstrained interface may admit more implementations in a trivial sense while supporting almost no useful system-level guarantees.

That leads to a proposed, more precise formulation of the overall research thesis:

> **A semantic substrate is well designed when it is maximally permissive among the substrates that preserve the chosen system guarantees under compatible composition, refinement, replacement and evolution, and when future components can establish conformance without requiring knowledge of the implementations already present.**

This reframes the project from designing one human/LLM/software architecture into a theory for builders:

\[
\boxed{

\text{desired guarantees}

\rightarrow

\text{weakest sufficient semantics}

\rightarrow

\text{enforceable boundaries}

\rightarrow

\text{composition laws}

\rightarrow

\text{open-ended systems}

}
\]

That chain has direct foundations in refinement, interface and contract theory, weakest-precondition reasoning, capability security, algebraic distributed systems, type/effect systems, Unix composition and declarative programming. What remains open is their integration into a practical theory of **semantic substrate design**. [^turn1search0][^turn15search11][^turn15search0][^turn14search9][^turn11search6][^turn5search0][^turn2search0][^turn7search0]

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## Citation definitions for the imported report sections


The definitions below are local copies of the entries used in these passages. The [complete original bibliography]({{< ref "ai/design-research/01-foundations/02-semantic-substrate-design-report" >}}#references) remains in the report. The copies are separate from the original source text.

[^turn1search0]: [The Existence of Refinement Mappings](https://www.microsoft.com/en-us/research/publication/the-existence-of-refinement-mappings/)

[^turn14search3]: [Interface theories for component-based design](https://research-explorer.ista.ac.at/record/4623)

[^turn15search11]: [Compositional assume-guarantee reasoning for input/output component theories](https://www.sciencedirect.com/science/article/pii/S0167642314000057)

[^turn15search0]: [Guarded commands, non-determinacy and formal derivation of programs (EWD 472)](https://www.cs.utexas.edu/~EWD/transcriptions/EWD04xx/EWD472.html)

[^turn15search4]: [Learning Assumptions for Compositional Verification](https://ntrs.nasa.gov/citations/20030017771)

[^turn14search8]: [On Relational Interfaces](https://www2.eecs.berkeley.edu/Pubs/TechRpts/2009/EECS-2009-60.html)

[^turn16search0]: [Family Values: A Behavioral Notion of Subtyping](https://www.cs.cmu.edu/afs/cs/project/venari/www/subtype-tr.html)

[^turn5search0]: [Koka: Programming with Row-Polymorphic Effect Types](https://www.microsoft.com/en-us/research/publication/koka-programming-with-row-polymorphic-effect-types/)

[^turn16search14]: [Formalizing Architectural Connection](https://www.cs.cmu.edu/~Compose/paper_abstracts/wright-icse16.html)

[^turn2search0]: [Kafka, Samza, and the Unix philosophy of distributed data](https://martin.kleppmann.com/2015/08/05/kafka-samza-unix-philosophy-distributed-data.html)

[^turn3search0]: [Overview: An Ode to the Granovetter Diagram](https://erights.org/elib/capability/ode/overview.html)

[^turn14search9]: [Capability Distribution Language (capDL)](https://docs.sel4.systems/projects/capdl/index.html)

[^turn11search6]: [Verifying Strong Eventual Consistency in Distributed Systems](https://martin.kleppmann.com/2017/10/25/verifying-crdt-isabelle.html)

[^turn11search12]: [OpSets: Sequential Specifications for Replicated Datatypes (Extended Version)](https://martin.kleppmann.com/2018/05/11/opsets-sequential-specifications.html)

[^turn7search0]: [A Relational Model of Data for Large Shared Data Banks](https://research.ibm.com/publications/a-relational-model-of-data-for-large-shared-data-banks)

[^turn10search16]: [Ledger -- Hyperledger Fabric documentation](https://hyperledger-fabric.readthedocs.io/en/release-2.4/ledger.html)
