---
draft: false
toc: true
description: "Proposes typed contributions carrying provenance, authority, guarantees, and obligations, with proposal distinct from commitment and separate records for verification, acceptance, revision, and external effects."
title: "05 Constrained Common Substrate"
linkTitle: "05 Constrained Common Substrate"
---

Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The aspect proposed for strict constraint is therefore **the boundary, not the behavior inside components**.

The proposal is to make the "thin waist" something like:

```text
                 PARTICIPANTS

    humans   LLMs   agents   programs   tools
          \    |      |       |       /
           \   |      |       |      /
            ────────────────────────
              typed contributions
            ────────────────────────
                      │
                      ▼
              SHARED COMPUTATION
                      │
        state / artifacts / events
                      │
            ┌─────────┼──────────┐
            │         │          │
         types     effects    provenance
         roles     powers      history
      capabilities budgets   obligations
            │         │          │
            └─────────┼──────────┘
                      ▼
              committed effects
                      │
                      ▼
                     world
```


This gives participants enormous freedom above the line. An LLM can invent a new plan. A human can rewrite the plan. A critic can introduce a new question. A specialist model can generate ten scenarios. Another agent can fork the investigation.

What they cannot freely invent is what an `Approval` means, whether they possess a `financial_write` capability, whether an external action happened, which version of state is authoritative, or whether a required verification occurred.

That feels very close to the Unix philosophy in spirit:

> Make components small enough to combine freely; make the common interface strict enough that their combination still means something.

But the proposal is to add something Unix mostly didn't have:

> **The pipe carries semantics, provenance, authority and obligations along with the value.**

For example:

```text
CandidatePlan
   | critique
   | revise
   | approve<User>
   | execute
   | verify
```


The runtime knows that `approve<User>` isn't merely text saying "looks good." It is an action by a particular participant, with scope, authority, time, and provenance.

This also leads me to a slightly different name for the research object. "Neuro-symbolic system" describes an implementation technique. "Multi-agent system" describes only some participants. "Agent runtime" puts the agent at the center.

A provisional framing is the broader question as:

> How do we build programmable environments in which heterogeneous intelligent and non-intelligent participants--humans, generative models, deterministic software and tools--can collaborate freely, while shared state, authority, effects, provenance and required invariants remain explicit and enforceable?

And then the narrower technical thesis is:

> **Constrain the common computational substrate; leave intelligence and generative behavior pluggable.**

The working interpretation is that that is a better foundation for the direction than assuming the fundamental object is an LLM agent surrounded by tools.

<a id="what-i-would-change-in-the-generalization"></a>

### Proposed changes to the generalization


The proposal is to replace:

> **programmable probabilistic agent computation**

with something closer to:

> **constrained collaborative computation**

or, in more academic terms,

> **programmable shared computation with heterogeneous participants**

The object of study then isn't a probabilistic computation containing neural operators. It is:

```text
participants
    ↓
proposals / observations / artifacts
    ↓
shared computational state
    ↓
runtime-mediated transitions
    ↓
committed state + external effects
```


Humans, LLMs and deterministic programs can all occupy the first layer. The runtime doesn't need a common theory of their cognition.

This also fits the working dictionary better. The working definition of intelligence is merely task-solving capability, while agency requires persistence and effects on the participant's future relationship with its environment.

So neither "intelligent/non-intelligent" nor "agent/non-agent" needs to determine the architecture.

<a id="the-key-abstraction-i-would-take-forward"></a>

### Proposed key abstraction


The strongest thing in the newer material is, for me:

**proposal ≠ commitment**

An LLM can propose:

```text
refund($700)
```


A human can propose it too. A deterministic rule can propose it.

None of those facts means the refund happened.

The environment decides whether the transition may be committed based on identity, authority, policy, evidence, approvals, budgets and other invariants. That's already implicit in the kernel framing in the notes.

The proposal is to elevate this to the central semantic boundary:

```text
Participant space             Trusted substrate

observe
generate
reason
propose           ───────►    validate
replan                        authorize
criticize                     establish obligations
                               commit
                               record provenance
                               perform effects
```


The left side can stay open-ended.

The right side has semantics.

This feels stronger than the existing "neural versus symbolic" distinction in `research-direction.md`, where neural operations interpret/propose and symbolic operations own types, permissions and execution. The neural/symbolic split becomes one possible implementation. The actual boundary is **untrusted contribution versus authoritative transition**.

### The second important idea: the pipe has semantics


The proposal is to preserve this almost verbatim from the new notes:

> **The pipe carries semantics, provenance, authority and obligations along with the value.**

That may actually be the simplest explanation of the programming model.

Unix gave us:

```text
value | operation | operation
```


Here you want something closer to:

```text
typed value
+ provenance
+ authority
+ guarantees
+ obligations
      |
   operation
      ↓
new typed value
+ transformed guarantees
+ derived provenance
```


The proposed epistemic contracts are then one instance:

```text
EvidenceSet<
    coverage=Complete,
    provenance=Exact,
    authority=Verified,
    conflicts=Resolved
>
```


and `Approval`, `Deployment`, `Payment`, `Decision`, etc. are others.

So the investigation work isn't a side branch anymore. It is the first demonstration that metadata about **how a value may legitimately be constructed** can become executable program semantics.

<!-- Navigation added during reassembly on 2026-03-30. Source arguments are retained with editorial wording, 2026-04-20; quoted source passages remain exact. -->

## System properties from the behavioral reanalysis


The following material comes from the reanalysis in [Behavioral compilation and specification]({{< ref "ai/design-research/03-language-and-compiler/11-behavioral-compilation-and-specification" >}}#reanalysed). The original source context remains in that note. The original arguments are retained with editorial wording.

## General system properties suggested by the files


The UC-1 properties generalize well to the proposed runtime.

### Source fidelity


A derived claim or artifact must not silently alter the meaning of its source.

For the proposed system this includes:

- subject;
- polarity;
- temporal scope;
- source identity;
- units;
- domain state;
- task revision.

### Provenance


Every material result should be traceable through:

```
result statement
→ derived assertion
→ execution step
→ interpretation proposal
→ source span or domain state
```


There may be several provenance types:

- evidential provenance: why the claim is supported;
- computational provenance: how it was produced;
- decision provenance: who or what accepted it;
- revision provenance: what it supersedes.

### Epistemic discipline


The system must keep these distinct:

```
model proposed
compiler accepted
program executed
verifier accepted for a purpose
human approved
external effect confirmed
```


None should silently imply the next.

### Scope preservation


A result should retain:

- problem revision;
- source revision;
- task or branch;
- acceptance purpose;
- policy version;
- temporal scope;
- relevant entity scope.

### Uncertainty preservation


Unknown, ambiguous, unsupported, and conflicting are distinct states.

They should be represented as domain artifacts, not hidden in explanatory prose or converted into empty values.

### Revision integrity


When a source, domain contract, or policy changes:

- previous artifacts remain inspectable;
- new revisions point to superseded revisions;
- dependent results may become stale;
- acceptance for an old revision does not authorize the new one.

### Reviewability


A reviewer should be able to inspect:

- source;
- interpretation;
- program;
- run trace;
- verification findings;
- unresolved matters;
- acceptance decision.

The amount of data exposed should be controlled. A complete but unusable trace does not create effective reviewability.

### Effect boundary


A generated result or accepted artifact should not automatically produce an external effect.

For example:

```
AcceptedReport
≠ SentReport

AcceptedDatabaseMutationProposal
≠ CommittedDatabaseMutation

AcceptedClinicalDraft
≠ PublishedEHRRecord
```
