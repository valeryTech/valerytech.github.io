---
draft: false
toc: true
title: "Premature Abstraction"
linkTitle: "Premature Abstraction"
---


Corrective principle:
Model the concrete domain first. Extract shared workflow concepts only after multiple real workflows force the abstraction to exist.


I checked each phrase against public software-engineering usage. They’re all used, but they differ a lot in how established they are.

|Term|Public usage|Status|
|---|---|---|
|**Speculative Generality**|Martin Fowler/Kent Beck’s _Refactoring_ names it as a code smell; IBM still lists it as “unneeded code added to support hypothetical future features.” ([GitHub](https://github.com/lee-dohm/code-smells?utm_source=chatgpt.com "GitHub - lee-dohm/code-smells: A complete Code Smells reference · GitHub"))|**Canonical / established**|
|**Premature abstraction**|There are long-running Software Engineering discussions using exactly this term; newer practitioner writing defines it as generalizing before understanding what needs reuse. ([Software Engineering Stack Exchange](https://softwareengineering.stackexchange.com/questions/386570/what-is-premature-abstraction?utm_source=chatgpt.com "design - What is \"premature abstraction\"? - Software Engineering Stack Exchange"))|**Common practitioner phrase**, not a formal named smell|
|**Premature generalization**|Jason Swett explicitly defines it as generalizing beyond current requirements in anticipation of future requirements, and calls it another name for Speculative Generality. The term also appears in software-development teaching and game-engine guidance. ([Code with Jason](https://www.codewithjason.com/premature-generalization/?utm_source=chatgpt.com "Premature generalization - Code with Jason"))|**Used publicly**, less canonical|
|**Overengineering / over-engineering**|Stitch Fix engineering defines it as doing more work than necessary for the problem at hand; Stack Overflow has used the term for excessive future-proofing, abstraction layers, extensibility, etc. since at least 2009. ([Stitch Fix Technology](https://multithreaded.stitchfix.com/blog/2016/08/15/avoiding-over-engineering/?utm_source=chatgpt.com "Avoiding Over-Engineering \| Stitch Fix Technology – Multithreaded"))|**Very common**, but broad|
|**YAGNI violation**|The phrasing appears publicly, including examples explicitly labelled “YAGNI Violation.” An older software-development book likewise calls unnecessary argument flexibility a “YAGNI violation.” ([Seg](https://www.seg.dev/posts/development-principles/?utm_source=chatgpt.com "Development Principles \| SEG"))|**Understandable phrase**, but YAGNI is the actual established term|
|**Wrong abstraction**|Sandi Metz's 2016 article is literally titled _The Wrong Abstraction_ and develops the principle “prefer duplication over the wrong abstraction.” ([Sandi Metz](https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction?utm_source=chatgpt.com "The Wrong Abstraction — Sandi Metz"))|**Established practitioner concept**, especially around DRY/refactoring|

A bit more precisely:

**Speculative Generality** has the strongest pedigree. Fowler's code smell is almost exactly:

> “We might need this someday, so build the general machinery now.”

It covers unused interfaces, hooks, parameters, extension points, hierarchy, etc. ([DevIQ](https://deviq.com/code-smells/speculative-generality/?utm_source=chatgpt.com "Speculative Generality Code Smell – DevIQ"))

That fits part of what we were doing, but our problem is slightly more specific. We weren't merely adding unused extension points. We were looking at a few workflows and attempting to infer a universal model:

```text
AR collection ─┐
incident mgmt ─┼─→ universal Workflow/Step/Case/Capability ontology
forecasting ───┘
```


**Premature generalization** describes that particular move quite well. One public definition is essentially “generalize a piece of code beyond its current requirements in anticipation of more general future requirements.” ([Code with Jason](https://www.codewithjason.com/premature-generalization/?utm_source=chatgpt.com "Premature generalization - Code with Jason"))

**Premature abstraction** is also used exactly the way we meant it. A Software Engineering Stack Exchange answer describes the concern as being too early to know the appropriate abstraction, where choosing one now can make the correct abstraction harder to discover later. ([Software Engineering Stack Exchange](https://softwareengineering.stackexchange.com/questions/386570/what-is-premature-abstraction?utm_source=chatgpt.com "design - What is \"premature abstraction\"? - Software Engineering Stack Exchange")) Hyperexponential uses the phrase in a real engineering context for trying to generalize shared actuarial models before enough concrete cases exist. ([Hyperexponential](https://www.hyperexponential.com/blog/wet-models-deploy-faster-without-premature-abstraction?utm_source=chatgpt.com "WET models: deploy faster without premature abstraction - hyperexponential blog"))

**Wrong abstraction** describes what happens after premature abstraction has already succeeded in getting into the system. Metz describes the pattern:

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


Her recommendation is to dismantle the abstraction and allow duplication to expose the true common structure. ([Sandi Metz](https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction?utm_source=chatgpt.com "The Wrong Abstraction — Sandi Metz"))

**Overengineering** is definitely common, but it's broader. Stitch Fix's engineering blog explicitly associates it with expanding the problem beyond the actual problem being solved. ([Stitch Fix Technology](https://multithreaded.stitchfix.com/blog/2016/08/15/avoiding-over-engineering/?utm_source=chatgpt.com "Avoiding Over-Engineering | Stitch Fix Technology – Multithreaded")) It could include Kubernetes for 20 users, premature scalability, unnecessary microservices, elaborate configuration, excessive patterns, _or_ premature abstractions. So it loses the exact point we're discussing.

**YAGNI violation** works conversationally:

> “We're designing provider substitution even though we haven't needed to substitute a provider yet. That's YAGNI.”

But I'd name the principle **YAGNI**, not the phenomenon “YAGNI violation.” YAGNI means don't add functionality until it becomes necessary. ([Laws of Software Engineering](https://lawsofsoftwareengineering.com/laws/yagni/?utm_source=chatgpt.com "YAGNI (You Aren't Gonna Need It) | Laws of Software Engineering"))

There is also one term I should have mentioned earlier because it maps especially well to our discussion:

**AHA — Avoid Hasty Abstractions.**

Kent C. Dodds uses this as an explicit programming principle, derived from Sandi Metz's work:

> “Avoid Hasty Abstractions”

His core argument is that you often don't know what the correct abstraction is until multiple concrete cases have evolved enough to reveal it. ([Kent C. Dodds](https://kentcdodds.com/blog/aha-programming?utm_source=chatgpt.com "AHA Programming 💡"))

That gives us a useful vocabulary:

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


For what we just caught ourselves doing with the universal workflow model, I would use **premature generalization** when describing the analytical error, and **premature abstraction** when describing the software-design error.

If I wanted a known engineering principle to cite as the corrective, I'd use **AHA — Avoid Hasty Abstractions**. ([Kent C. Dodds](https://kentcdodds.com/blog/aha-programming?utm_source=chatgpt.com "AHA Programming 💡"))

## equivalents


Yes. There are close equivalents, although Design Science doesn’t seem to have one canonical label as crisp as “Speculative Generality.”

The closest mapping is:

|Software design|Design Science|Scientific method|
|---|---|---|
|Premature abstraction|**Premature / unjustified generalization of a design artifact**|**Overgeneralization / hasty generalization**|
|Speculative generality|Generalizing a solution before validating its applicability to a problem class|Adding theoretical structure unsupported by evidence|
|Wrong abstraction|Generalized design principle that fails across contexts|Misspecified theory/model|
|YAGNI|Keep the artifact contextual until evidence supports abstraction|Parsimony / Occam’s razor|
|“We only saw 2 workflows”|Situated artifact / insufficient cases|**Underdetermination by evidence**|

In Design Science, the concept I find most relevant is **generalization from a situated artifact**.

Action Design Research explicitly assumes that an artifact is shaped by its organizational context. You first build and evaluate it in that context. Only later do you move from the particular solution toward a broader class of problems and eventually formulate generalized design principles. This is described through **guided emergence** followed by **generalized outcomes**. ([ScienceDirect](https://www.sciencedirect.com/org/science/article/pii/S1753837821000309?utm_source=chatgpt.com "Action design research: integration of method support - ScienceDirect"))

That is almost exactly the discipline we were discussing:

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


A 2024 Design Science paper makes the warning even more explicit: because artifacts are contextual, generalization is difficult, especially from a single qualitative study. Its recommendations include **validating generalized knowledge** and finding an **appropriate generalization level**. ([AIS eLibrary](https://aisel.aisnet.org/ecis2024/track23_designresearch/track23_designresearch/6/?utm_source=chatgpt.com "AIS Electronic Library (AISeL) - ECIS 2024 Proceedings: Generalisation of Design Science Research"))

So if we wanted Design Science language for what we almost did, I'd say:

> **We generalized the solution class before establishing the appropriate level of generalization.**

Or more casually: **premature generalization of the artifact**.

There is also a useful DSR distinction between abstraction levels. Design knowledge can exist at short-, medium-, and long-range levels, and moving upward is an explicit act of generalization rather than something assumed from the beginning. ([AIS eLibrary](https://aisel.aisnet.org/wi2011/54/?utm_source=chatgpt.com "\"Strategies for Creating, Generalising and Transferring Design Science \" by Philipp Offermann, Sören Blom et al."))

That maps nicely to our case:

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


We jumped almost directly from level 1 to level 4.

### Scientific method


Here I think the strongest term is simply **overgeneralization**.

Scientific induction takes observations from some cases and extends a conclusion beyond them. The error happens when the evidence doesn't justify that scope. There is even work describing a **generalization bias** in science: researchers can infer conclusions broader than their evidence supports. ([PubMed](https://pubmed.ncbi.nlm.nih.gov/36044007/?utm_source=chatgpt.com "Generalization Bias in Science - PubMed"))

Our reasoning was structurally similar:

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

> What evidence warrants the word **all**?

Currently, very little.

There's another scientific concept that is useful here: **underdetermination**.

Given a handful of observed workflows, many different abstractions could explain them:

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


Our observations don't yet give us enough evidence to choose among them. So the data **underdetermine the theory**.

And then **parsimony / Occam's razor** gives the design response: when multiple explanations fit what we know, don't introduce extra theoretical structure without reason. Scientific model selection explicitly treats unnecessary flexibility/complexity as something that should be penalized. ([PubMed](https://pubmed.ncbi.nlm.nih.gov/36712067/?utm_source=chatgpt.com "How Occam's razor guides human decision-making - PubMed"))

### One distinction from overfitting


I wouldn't primarily call our problem **overfitting**.

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


That could happen to us—for example, `Case` might exist only because our first examples happen to be case-oriented workflows. Statistical literature describes overfitting as asking more from the available observations than they can support. ([PubMed](https://pubmed.ncbi.nlm.nih.gov/15184705/?utm_source=chatgpt.com "What you see may not be what you get: a brief, nontechnical introduction to overfitting in regression-type models."))

But the broader mistake we're worried about is:

```text
too few examples
      ↓
claiming an abstraction has much wider scope
```


That's **overgeneralization**.

So I'd use:

**Software engineering:** premature abstraction / speculative generality  
**Design Science:** inappropriate or premature **generalization of a situated artifact**  
**Scientific reasoning:** **overgeneralization from insufficient evidence**

And I particularly like the Design Science stance for our project: **build situated artifacts first; generalize only after repeated instances reveal stable design principles.** That gives us a methodological justification for starting with one concrete E2E SaaS workflow rather than designing the universal workflow language first.
