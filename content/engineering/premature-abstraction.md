---
draft: false
toc: true
description: "Recognize speculative generalization, model concrete workflows first, and use design probes before committing to shared abstractions."
title: "Premature Abstraction"
linkTitle: "Premature Abstraction"
---

Corrective principle:

Model the concrete domain first. Extract shared workflow concepts only after multiple real workflows force the abstraction to exist.

These terms are used publicly in software engineering, but they differ in how well known and precise they are.

|Term|Public usage|Status|
|---|---|---|
|**Speculative Generality**|Martin Fowler/Kent Beck's _Refactoring_ names it as a code smell; IBM still lists it as "unneeded code added to support hypothetical future features." ([GitHub](https://github.com/lee-dohm/code-smells "GitHub - lee-dohm/code-smells: A complete Code Smells reference · GitHub"))|**Canonical / established**|
|**Premature abstraction**|There are long-running Software Engineering discussions using exactly this term; newer practitioner writing defines it as generalizing before understanding what needs reuse. ([Software Engineering Stack Exchange](https://softwareengineering.stackexchange.com/questions/386570/what-is-premature-abstraction "design - What is \"premature abstraction\"? - Software Engineering Stack Exchange"))|**Common practitioner phrase**, not a formal named smell|
|**Premature generalization**|Jason Swett explicitly defines it as generalizing beyond current requirements in anticipation of future requirements, and calls it another name for Speculative Generality. The term also appears in software-development teaching and game-engine guidance. ([Code with Jason](https://www.codewithjason.com/premature-generalization/ "Premature generalization - Code with Jason"))|**Used publicly**, less canonical|
|**Overengineering / over-engineering**|Stitch Fix engineering defines it as doing more work than necessary for the problem at hand; Stack Overflow has used the term for excessive future-proofing, abstraction layers, extensibility, etc. since at least 2009. ([Stitch Fix Technology](https://multithreaded.stitchfix.com/blog/2016/08/15/avoiding-over-engineering/ "Avoiding Over-Engineering \| Stitch Fix Technology - Multithreaded"))|**Very common**, but broad|
|**YAGNI violation**|The phrasing appears publicly, including examples explicitly labelled "YAGNI Violation." An older software-development book likewise calls unnecessary argument flexibility a "YAGNI violation." ([Seg](https://www.seg.dev/posts/development-principles/ "Development Principles \| SEG"))|**Understandable phrase**, but YAGNI is the actual established term|
|**Wrong abstraction**|Sandi Metz's 2016 article is literally titled _The Wrong Abstraction_ and develops the principle "prefer duplication over the wrong abstraction." ([Sandi Metz](https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction "The Wrong Abstraction -- Sandi Metz"))|**Established practitioner concept**, especially around DRY/refactoring|

A bit more precisely:

**Speculative Generality** is the most established term in this list. Fowler's code smell is almost exactly:

> "We might need this someday, so build the general machinery now."

It covers unused interfaces, hooks, parameters, extension points, hierarchy, etc. ([DevIQ](https://deviq.com/code-smells/speculative-generality/ "Speculative Generality Code Smell - DevIQ"))

The workflow example involves more than unused extension points: it tries to derive a universal model from only a few concrete workflows. This is a more specific form of speculative generality:

```text
AR collection ─┐
incident mgmt ─┼─→ universal Workflow/Step/Case/Capability ontology
forecasting ───┘
```


**Premature generalization** describes that particular move quite well. One public definition is essentially "generalize a piece of code beyond its current requirements in anticipation of more general future requirements." ([Code with Jason](https://www.codewithjason.com/premature-generalization/ "Premature generalization - Code with Jason"))

**Premature abstraction** describes extracting a shared model before the relevant cases are understood. A Software Engineering Stack Exchange answer describes the concern as being too early to know the appropriate abstraction, where choosing one now can make the correct abstraction harder to discover later. ([Software Engineering Stack Exchange](https://softwareengineering.stackexchange.com/questions/386570/what-is-premature-abstraction "design - What is \"premature abstraction\"? - Software Engineering Stack Exchange")) Hyperexponential uses the phrase in a real engineering context for trying to generalize shared actuarial models before enough concrete cases exist. ([Hyperexponential](https://www.hyperexponential.com/blog/wet-models-deploy-faster-without-premature-abstraction "WET models: deploy faster without premature abstraction - hyperexponential blog"))

**Wrong abstraction** describes the result when an abstraction is introduced too early and becomes part of the system. Metz describes the pattern:

```text
two cases look similar
        ↓
extract abstraction
        ↓
new cases differ slightly
        ↓
add parameters/conditionals
        ↓
another case differs
        ↓
more conditionals
        ↓
abstraction becomes a mess
```


Her recommendation is to take the abstraction apart and allow duplication until the real shared structure becomes clear. ([Sandi Metz](https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction "The Wrong Abstraction -- Sandi Metz"))

**Overengineering** is definitely common, but it's broader. Stitch Fix's engineering blog explicitly associates it with expanding the problem beyond the actual problem being solved. ([Stitch Fix Technology](https://multithreaded.stitchfix.com/blog/2016/08/15/avoiding-over-engineering/ "Avoiding Over-Engineering | Stitch Fix Technology - Multithreaded")) It could include Kubernetes for 20 users, premature scalability, unnecessary microservices, elaborate configuration, excessive patterns, _or_ premature abstractions. It is less precise about generalization from insufficient examples.

**YAGNI violation** describes adding provider-substitution machinery before there is a proven need to change providers. The established principle is **YAGNI**. YAGNI means don't add functionality until it becomes necessary. ([Laws of Software Engineering](https://lawsofsoftwareengineering.com/laws/yagni/ "YAGNI (You Aren't Gonna Need It) | Laws of Software Engineering"))

A directly relevant corrective principle is:

**AHA -- Avoid Hasty Abstractions.**

Kent C. Dodds uses this as an explicit programming principle, derived from Sandi Metz's work:

> "Avoid Hasty Abstractions"

His core argument is that the correct abstraction is often unclear until multiple concrete cases have evolved enough to reveal it. ([Kent C. Dodds](https://kentcdodds.com/blog/aha-programming "AHA Programming 💡"))

These terms name the problem, its result, and the principles for avoiding it:

```text
Speculative Generality
    canonical code-smell name

Premature generalization
    describes generalizing from insufficient cases

Premature abstraction
    describes extracting the common model too soon

Wrong abstraction
    describes the resulting bad abstraction

AHA / Avoid Hasty Abstractions
    principle for avoiding the problem

YAGNI
    broader principle against hypothetical requirements

Overengineering
    broad umbrella
```


For the universal workflow example, **premature generalization** describes the analytical error, while **premature abstraction** describes the software-design error.

An established corrective principle is **AHA -- Avoid Hasty Abstractions**. ([Kent C. Dodds](https://kentcdodds.com/blog/aha-programming "AHA Programming 💡"))

## Equivalents in Design Science and scientific reasoning


Related concepts exist in Design Science, although the sources collected here do not establish one canonical label equivalent to "Speculative Generality."

The closest mapping is:

|Software design|Design Science|Scientific method|
|---|---|---|
|Premature abstraction|**Premature / unjustified generalization of a design artifact**|**Overgeneralization / hasty generalization**|
|Speculative generality|Generalizing a solution before validating its applicability to a problem class|Adding theoretical structure unsupported by evidence|
|Wrong abstraction|Generalized design principle that fails across contexts|Misspecified theory/model|
|YAGNI|Keep the artifact contextual until evidence supports abstraction|Parsimony / Occam's razor|
|Only 2 workflows observed|Situated artifact / insufficient cases|**Underdetermination by evidence**|

A relevant Design Science concept is **generalization from a situated artifact**.

Action Design Research assumes that the organization and its context shape the artifact being built. The artifact is first built and evaluated in that context. Generalization then moves from that specific solution to a broader group of problems and design principles that apply across them. This is described through **guided emergence** followed by **generalized outcomes**. ([ScienceDirect](https://www.sciencedirect.com/org/science/article/pii/S1753837821000309 "Action design research: integration of method support - ScienceDirect"))

This suggests the following discipline:

```text
AR workflow
    ↓
build it concretely
    ↓
observe what actually works

different workflow
    ↓
build it concretely
    ↓
observe

another context
    ↓
observe

        ↓

only now ask:
"What is invariant?"

        ↓

design principle / abstraction
```


A 2024 Design Science paper makes the warning even more explicit: because artifacts are contextual, generalization is difficult, especially from a single qualitative study. Its recommendations include **validating generalized knowledge** and finding an **appropriate generalization level**. ([AIS eLibrary](https://aisel.aisnet.org/ecis2024/track23_designresearch/track23_designresearch/6/ "AIS Electronic Library (AISeL) - ECIS 2024 Proceedings: Generalisation of Design Science Research"))

In Design Science terms, the error is **generalizing a class of solutions before establishing how widely the generalization should apply**.

Or more casually: **premature generalization of the artifact**.

There is also a useful DSR distinction between abstraction levels. Design knowledge can exist at short-, medium-, and long-range levels, and moving to a broader level requires a deliberate generalization. It is not assumed from the start. ([AIS eLibrary](https://aisel.aisnet.org/wi2011/54/ "\"Strategies for Creating, Generalising and Transferring Design Science \" by Philipp Offermann, Sören Blom et al."))

The workflow example has several possible abstraction levels:

```text
Concrete:
AR collection using QuickBooks + Gmail

↓

Intermediate:
long-running financial collection workflows

↓

More abstract:
business workflows across providers

↓

Very abstract:
universal model of enterprise execution
```


Moving straight from a concrete example to a universal model skips the evidence needed to support the steps in between.

### Scientific method


The directly relevant term is **overgeneralization**.

Scientific induction uses observations from some cases to draw a conclusion about other cases. The error happens when the conclusion reaches further than the evidence supports. There is even work describing a **generalization bias** in science: researchers can infer conclusions broader than their evidence supports. ([PubMed](https://pubmed.ncbi.nlm.nih.gov/36044007/ "Generalization Bias in Science - PubMed"))

The same inference pattern appears in the workflow example:

```text
observed:
AR workflow
construction workflow
support workflow

inference:
all business workflows have
Workflow + Step + Capability + Binding + Case
```


The question is:

> What evidence warrants the word **all**?

The few examples alone do not establish that universal scope.

There's another scientific concept that is useful here: **underdetermination**.

Several different abstractions could explain the same small set of observed workflows:

```text
Model A:
Workflow + Step + Case

Model B:
Goal + Event + Action

Model C:
State machine

Model D:
Agent + environment

Model E:
no shared model at all
```


The limited observations do not provide enough evidence to choose among these models. So the data **underdetermine the theory**.

And then **parsimony / Occam's razor** gives the design response: when several explanations fit the evidence, there needs to be a reason for adding more theoretical structure. Scientific model selection penalizes flexibility or complexity that does not improve the explanation. ([PubMed](https://pubmed.ncbi.nlm.nih.gov/36712067/ "How Occam's razor guides human decision-making - PubMed"))

### One distinction from overfitting


**Overfitting** is not the primary name for this error, although it can also occur.

Overfitting is normally:

```text
small observed dataset
      ↓
very elaborate model
      ↓
captures accidental properties of those examples
      ↓
fails on new examples
```


That could also occur in a workflow model: `Case` might exist only because the first examples happen to be case-oriented workflows. Statistical literature describes overfitting as asking more from the available observations than they can support. ([PubMed](https://pubmed.ncbi.nlm.nih.gov/15184705/ "What you see may not be what you get: a brief, nontechnical introduction to overfitting in regression-type models."))

The broader generalization error is:

```text
too few examples
      ↓
claiming an abstraction has much wider scope
```


That's **overgeneralization**.

The corresponding terms are:

**Software engineering:** premature abstraction / speculative generality

**Design Science:** inappropriate or premature **generalization of a situated artifact**

**Scientific reasoning:** **overgeneralization from insufficient evidence**

The Design Science stance suggests **building situated artifacts first and generalizing only after repeated instances reveal stable design principles**. Applied to SaaS workflows, this supports starting with one concrete end-to-end workflow before designing a universal workflow language.

## Inquiry and evolving information needs


An **inquiry** is the whole process of developing an understanding as questions and evidence change. Search is one action within it.

At the very beginning, the person may not yet have a clear "information need." They have some combination of a trigger, partial understanding, curiosity, uncertainty, and context.

One way to describe the process is:

```text
situation / trigger
        ↓
current inquiry state
  - what I know
  - what I suspect
  - what I'm uncertain about
  - what I'm trying to accomplish
  - what has caught my attention
        ↓
probe
  query, browse, follow a link,
  inspect a note, ask a question...
        ↓
evidence encountered
        ↓
interpretation / sensemaking
        ↓
updated inquiry state
        ↺
```


A query such as `DSL` is a **probe** produced from the person's current inquiry state.

The important part is that the inquiry state can itself change:

```text
"I want to look up DSL"

→ "I want to remember what DSL means"

→ "I have several conflicting ideas about DSL"

→ "I'm actually interested in DSLs as abstraction mechanisms"

→ "How are DSLs different from APIs?"
```


The person may not be trying to meet the same information need throughout. The need becomes clearer or changes as they encounter evidence.

The relevant terms can be distinguished as follows:

|Concept|Meaning|
|---|---|
|**Inquiry**|whole evolving activity|
|**Inquiry state**|person's current understanding, uncertainty, goals, questions|
|**Information seeking**|actions taken to improve that state|
|**Search**|retrieval-oriented information-seeking action|
|**Probe**|a particular move: query, filter, browse action, question|
|**Evidence**|material encountered as a result|
|**Sensemaking**|interpreting evidence and changing one's understanding|

An interactive inquiry system can represent the loop as:

```text
person
  has an inquiry state S₀

S₀
  ↓
probe: "DSL"
  ↓
system presents evidence E₁
  ↓
person interprets E₁
  ↓
new inquiry state S₁
  ↓
next probe
  ↓
...
```


**Inquiry state** is a useful central object because it does not assume that the person already knows their intent, question, or desired answer.

One possible structure for this state is:

```text
InquiryState {
  context
  current_understanding
  uncertainties
  questions
  interests
  goals
  encountered_evidence
}
```


At the very beginning, many of these may be empty or vague.

A possible framing is an **interactive inquiry system**, where retrieval supports an evolving inquiry rather than treating each query as an isolated search request.
