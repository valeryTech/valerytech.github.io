---
draft: false
toc: true
description: "Compares session-type choreography with information protocols and social commitments, proposing hybrid work-unit contracts checked at interaction boundaries for opaque human and LLM participants."
title: "03 Behavioral Types And Protocols"
linkTitle: "03 Behavioral Types And Protocols"
---

Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

The working interpretation is that the relevant research area already exists, but it is split across several communities. The strongest established framing for the stated goal is **Joint Cognitive Systems / Cognitive Systems Engineering**: treat the human, agents, tools, and environment as one system whose behavior you design. Hollnagel and Woods explicitly argue for studying human-machine interaction as the behavior of a unified system. ([Routledge](https://www.routledge.com/Joint-Cognitive-Systems-Foundations-of-Cognitive-Systems-Engineering/Hollnagel-Woods/p/book/9780849328213?utm_source=chatgpt.com "Joint Cognitive Systems: Foundations of Cognitive Systems Engineering"))

There's also a connection to our previous discussion about types that is especially relevant: **behavioral types**. Ordinary types describe values; behavioral types describe permitted interactions over time. Session types and behavioral contracts can specify protocols such as "A requests -> B accepts/rejects -> if accepted B eventually reports completion," and mechanically check whether components are compatible. ([eprints IMT Lucca](https://eprints.imtlucca.it/3695/?utm_source=chatgpt.com "Foundations of Session Types and Behavioural Contracts - IMT Institutional Repository")) Interface Automata takes a similar approach, modeling assumptions about inputs and guarantees about outputs, including their allowed ordering. ([ResearchGate](https://www.researchgate.net/publication/2881209_Interface_Automata?utm_source=chatgpt.com "Interface automata"))

The proposal is to map the relevant traditions this way:

|Research tradition|What it gives you|LLM/human-agent use|
|---|---|---|
|**Behavioral types / session types**|Legal sequences of interaction|Agent protocols, tool protocols, handoffs|
|**Contract-based design**|Assumptions + guarantees between components|"Agent may act if X; must guarantee Y"|
|**Interface automata**|Temporal component interfaces and compatibility|Check whether agent behaviors compose|
|**Joint Cognitive Systems**|Human + automation + environment as one functional system|Design overall behavior, not individual chatbot behavior|
|**Joint Activity / Common Ground**|Predictability, directability, shared knowledge, coordination|What an agent must communicate to function as a teammate|
|**SharedPlans / multi-agent teamwork**|Formal models of commitments, partial plans and joint goals|Represent collaborative task state explicitly|
|**Mixed initiative**|How control and initiative move between participants|Decide when agent acts, asks, proposes, or yields|
|**Runtime verification / assurance**|Check actual traces against behavioral requirements|Constrain stochastic LLM behavior during execution|

### The basic architecture


The proposal is to separate four things:

```text
                 HUMAN OWNER
            goals / constraints / authority
                       │
                       ▼
                 TASK CONTRACT
        outcome, constraints, risk, permissions
                       │
                       ▼
             WORK DECOMPOSITION
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
      LLM worker   Human worker   Tools/code
          │            │            │
          └────────────┼────────────┘
                       ▼
                  VERIFICATION
            tests / evidence / review
                       │
               ┌───────┴────────┐
               │                │
          within authority   decision needed
               │                │
               ▼                ▼
             ACT            HUMAN GATE
               │                │
               └───────┬────────┘
                       ▼
                 WORLD / OUTCOME
                       │
                       ▼
                 SHARED STATE
```


The key unit isn't an "agent." It is a **work unit with a contract**.

Each work unit should say what needs to be achieved, what evidence/context is available, what tools may be used, what output is expected, how that output will be checked, what side effects are permitted, and under what conditions it must escalate.

This makes an LLM replaceable. GPT-N, a future world-model-based system, a human expert, or deterministic software can all fill the same work unit if they satisfy its requirements.

Contract-based system engineering contributes another useful idea. Components have an assumption/guarantee contract:

```text
ASSUME:
    repository state is S
    user authorized modifications to files A and B

GUARANTEE:
    don't modify anything outside A and B
    tests remain passing
    report every externally visible change
```


Contracts can compose: if one component's guarantees satisfy another component's assumptions, larger systems can be reasoned about incrementally. That's precisely the purpose of contract-based design research. ([University of Trento IRIS](https://iris.unitn.it/handle/11572/225821?utm_source=chatgpt.com "Contracts for System Design"))

LLMs introduce a complication: the agent implementation is probabilistic and cannot generally be statically proved to obey such a specification.

So the proposal is to separate:

```text
desired behavior
       ↓
behavioral specification
       ↓
┌───────────────────────────┐
│ stochastic LLM/controller │
└───────────────────────────┘
       ↓
actual actions/events
       ↓
runtime monitor
       ↓
allow / reject / ask / recover
```


That leads directly to **runtime verification**: monitor execution traces against formal behavioral properties. Runtime verification is already used for autonomous systems where complete static verification isn't practical. ([Springer Nature](https://link.springer.com/article/10.1007/s10703-019-00337-w?utm_source=chatgpt.com "A survey of challenges for runtime verification from advanced application domains (beyond software) | Formal Methods in System Design | Springer Nature Link")) There is now explicit work proposing this combination for LLM-based autonomy as well. ([arXiv](https://arxiv.org/abs/2511.14435?utm_source=chatgpt.com "Watchdogs and Oracles: Runtime Verification Meets Large Language Models for Autonomous Systems"))

A proposed methodology for collaborative LLM systems would define six things:

1. **Capabilities and roles** -- what each human/agent/tool can know, decide and do.
2. **Joint task model** -- goals, subgoals, dependencies, commitments and ownership.
3. **Interaction protocols** -- allowed sequences of messages/actions, including cancellation and failure.
4. **Authority and initiative** -- who can act under which conditions and how control changes hands.
5. **Common ground** -- what relevant state must be mutually visible, acknowledged or synchronized.
6. **Behavioral invariants and monitors** -- properties the system must preserve even when an LLM behaves unexpectedly.

Then the LLM is one implementation mechanism inside this system. It isn't the architecture.

Recent LLM research is beginning to describe this explicitly. The 2026 ACL survey _LLM-Based Human-Agent Collaboration and Interaction Systems_ organizes systems around environment/profiling, human feedback, interaction types, orchestration, and communication. ([ACL Anthology](https://aclanthology.org/2026.findings-acl.1811/?utm_source=chatgpt.com "LLM-Based Human-Agent Collaboration and Interaction Systems: A Survey - ACL Anthology")) Multi-agent LLM surveys similarly classify collaboration by actors, topology, roles, strategies and coordination protocols. ([arXiv](https://arxiv.org/abs/2501.06322?utm_source=chatgpt.com "Multi-Agent Collaboration Mechanisms: A Survey of LLMs"))

My assessment, though, is that the older literature is currently more useful for **design theory**. A lot of LLM-agent work starts with "multiple LLMs exchanging messages" and then studies orchestration. Joint Cognitive Systems starts with a harder question:

> What behavior must the overall human-machine system exhibit to accomplish its work?

This appears closer to the initial research question.

A very good reading path would therefore be:

**Hollnagel & Woods -> Klein/Feltovich/Bradshaw/Woods -> Grosz & Kraus -> Horvitz -> behavioral types/session types -> contract-based design -> runtime verification -> current LLM human-agent work.**

In particular, the proposal is to start with _Joint Cognitive Systems_ and _Common Ground and Coordination in Joint Activity_. Then read the behavioral-types survey. Those three together give you a useful bridge from **human teamwork -> system behavior -> machine-checkable interaction protocols**. ([Routledge](https://www.routledge.com/Joint-Cognitive-Systems-Foundations-of-Cognitive-Systems-Engineering/Hollnagel-Woods/p/book/9780849328213?utm_source=chatgpt.com "Joint Cognitive Systems: Foundations of Cognitive Systems Engineering"))

The working interpretation is that there is a promising research/programming-model idea sitting at that intersection: something like a **behavioral type system for joint human-agent systems**, where the "types" express roles, authority, commitments, information state and allowed interaction traces, while an LLM supplies flexible behavior within those constraints. That would give you a principled way to talk about the behavior of an agentic system beyond prompts, tools, and workflows.

## some protocol languages


There is a fairly mature methodology for constructing behavioral type systems. For the human-LLM-agent problem, the proposal is to distinguish two traditions because they make different design choices.

The first is the literal behavioral-type tradition: **session types / multiparty session types (MPST)**. The second is **interaction-oriented multi-agent systems**, especially information protocols and social commitments. A useful human-agent type system may need ideas from both.

### 1. Session types already give a construction recipe


The MPST workflow is almost exactly a methodology for building a behavioral type system:

```text
requirements
    ↓
global protocol / choreography
    ↓
well-formedness + realizability checks
    ↓
projection
    ↓
local type for each role
    ↓
implementation checking / generated API
    ↓
runtime monitoring where static checking isn't possible
```


A global type might say:

```text
Human -> Agent : Task
Agent -> Human : Proposal

Human -> Agent :
    approve:
        Agent -> Tool : Execute
        Tool  -> Agent : Result
        Agent -> Human : Done

    revise:
        Agent -> Human : Proposal

    reject:
        end
```


The important operation is **projection**. From one global behavioral specification, you automatically derive what each participant is allowed to see and do:

```text
Human:
    send Task
    receive Proposal
    choose approve | revise | reject
    ...

Agent:
    receive Task
    send Proposal
    wait for approve | revise | reject
    ...
```


This is the central construction technique in multiparty session types. Global protocols are projected into local behavioral types, and local implementations can then be checked against them. ([PLS Lab](https://www.pls-lab.org/MPST?utm_source=chatgpt.com "Multiparty Session Types | PLS Lab"))

Scribble is an actual protocol language built around this approach: define roles and a global protocol, validate it, then project it to local protocols. ([PLS Lab](https://www.pls-lab.org/Scribble_%28MPSTs%29?utm_source=chatgpt.com "Scribble (MPSTs) | PLS Lab"))

There is also substantial work on embedding the resulting behavioral states into ordinary language type systems. For example, StMungo turns Scribble protocols into typestate specifications for Java; other work generates endpoint APIs whose types represent the current protocol state. ([PubMed Central (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7281875/?utm_source=chatgpt.com "Typechecking Java Protocols with [St]Mungo - PMC"))

So this is already quite close to:

> design behavior -> compile behavior into types -> make illegal transitions impossible.

### 2. There is a standard formal structure underneath it


If you wanted to invent your own behavioral type system, you would normally define at least these pieces.

First, define your **observable events**:

```text
send(message)
receive(message)
call(tool)
approve(action)
delegate(task)
cancel(task)
commit(goal)
complete(goal)
```


Then define a semantic model. Common choices are:

```text
finite-state machines
labelled transition systems
traces
process calculi
Petri nets
temporal logic
```


A behavioral type can then denote a set of allowed traces:

```text
[[T]] = {
    Task Proposal Approve Execute Result Done,
    Task Proposal Reject,
    Task Proposal Revise Proposal Approve ...
}
```


Typing becomes something approximately like:

```text
Γ ⊢ Agent : T
```


meaning that every relevant behavior produced by `Agent` conforms to `T`.

Then you define the usual type-system machinery:

```text
composition
subtyping / refinement
duality / compatibility
projection
recursion
choice
parallelism
failure
```


And finally prove properties such as:

```text
type preservation
communication safety
progress
deadlock freedom
protocol conformance
```


The 2016 survey _Behavioral Types in Programming Languages_ is probably the single best overview of this design space; it explicitly covers interfaces, protocols, contracts, choreography, representation in programming languages, design methodologies, and monitoring. ([Enlighten Publications](https://eprints.gla.ac.uk/121537/?utm_source=chatgpt.com "Behavioral types in programming languages"))

### 3. Refinement is particularly important


One thing you asked earlier was how types help us _build systems_, rather than merely verify finished programs.

Behavioral-type research has a direct analogue of ordinary type refinement.

Imagine:

```text
P = ask → answer
```


Later you refine it into:

```text
P' =
    ask
    → acknowledge
    → search
    → answer
```


You want to know whether `P'` is still substitutable for `P` from the rest of the system's perspective.

Protocol-refinement research explicitly studies this question. In multi-agent systems, Christie, Chopra, and Singh define refinement so that safety and liveness properties are preserved when one protocol replaces another. ([IFAAMAS](https://aamas.csc.liv.ac.uk/Proceedings/aamas2020/pdfs/p258.pdf?utm_source=chatgpt.com "Refinement for Multiagent Protocols"))

That's an important feature for the proposed system because you could imagine an engineering process like:

```text
very abstract collaboration contract
               ↓
        refined workflow
               ↓
       agent protocol
               ↓
implementation
```


with machine checks between each level.

### 4. But session types may be too operational for human-agent systems


This is where the other research tradition becomes important.

A session type commonly specifies _which communication happens next_:

```text
A sends x
then B sends y
then A chooses z or q
```


For autonomous agents and humans, you often don't want to constrain the interaction that tightly.

Suppose I delegate:

> Investigate bug #123 and send me a proposed fix before changing production.

The important facts may be:

```text
Agent is responsible for investigating bug #123.

Agent may choose its own investigation procedure.

Agent must obtain approval before production change.

If Agent accepts the task, Agent owes Human either:
    a result,
    a failure report,
    or an explicit cancellation.
```


There may be hundreds of valid interaction traces.

That is exactly the problem studied in the **social commitments / Interaction-Oriented Software Engineering (IOSE)**literature.

IOSE explicitly argues that autonomous participants shouldn't be modeled as components controlled by a central machine. Instead, systems should be specified through their observable interactions and protocols. ([arXiv](https://arxiv.org/abs/1211.4123?utm_source=chatgpt.com "Interaction-Oriented Software Engineering: Concepts and Principles"))

A commitment might conceptually look like:

```text
C(
    debtor = Agent,
    creditor = Human,
    antecedent = accept(Task),
    consequent = deliver(Result) OR report(Failure)
)
```


This doesn't dictate how the agent achieves the result.

That distinction is very relevant to LLMs.

### 5. There's even research on generating protocols from such requirements


This gets close to the system you appear to be thinking about.

The **Clouseau** approach starts from a specification of social commitments and synthesizes an executable communication protocol. The authors prove that the generated protocol is correct, safe, and live. ([AAAI](https://aaai.org/papers/07244-clouseau-generating-communication-protocols-from-commitments/?utm_source=chatgpt.com "Clouseau: Generating Communication Protocols from Commitments - AAAI"))

Conceptually:

```text
requirements / commitments
           ↓
      synthesis
           ↓
communication protocol
           ↓
local agent behavior
```


Then in 2025 the same research line introduced **Mambo**, which is explicitly a methodology for engineering multi-agent interaction protocols from reusable **requirement patterns**, together with a verification procedure. ([IJCAI](https://www.ijcai.org/proceedings/2025/5?utm_source=chatgpt.com "Requirement Patterns for Engineering Multiagent Interaction Protocols | IJCAI"))

That paper is particularly relevant to the research question because it asks essentially:

> How do we systematically go from interaction requirements to a valid protocol?

The broader 2020 comparison of protocol languages is also useful. It compares session types/Scribble, trace-based approaches, hierarchical state machines, and information-causality-based protocols, then extracts design principles for protocol languages. ([arXiv](https://arxiv.org/abs/1901.08441?utm_source=chatgpt.com "An Evaluation of Communication Protocol Languages for Engineering Multiagent Systems"))

### 6. LLMs change where the "type checking" occurs


For ordinary typed software, you can hope for:

```text
implementation
      ↓
static type checker
      ↓
accepted / rejected
```


An LLM is effectively a black-box stochastic participant. You generally can't statically prove that all of its future outputs conform to a behavioral type.

So the architecture becomes:

```text
                    Behavioral type
                          │
                          ▼
                    compile monitor
                          │
                          ▼
 Human ──────► LLM ───► proposed action
                          │
                          ▼
                   protocol monitor
                     /           \
                 allowed        illegal
                    │              │
                    ▼              ▼
                  Tool       reject / repair /
                             request approval
```


This isn't merely hypothetical. Session-type research has formal results about what can and cannot be enforced through runtime monitors, including soundness and completeness properties. ([DROPS](https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ECOOP.2021.20?utm_source=chatgpt.com "On the Monitorability of Session Types, in Theory and Practice"))

Hybrid verification also already exists: statically check what can be statically checked and put runtime checks around the rest. ([Imperial College London Documentation](https://www.doc.ic.ac.uk/~rhu/scribble/index.html?utm_source=chatgpt.com "Hybrid Session Verification through Endpoint API Generation"))

Recent LLM-agent work has started moving explicitly in this direction. **Agent-C**, for example, specifies temporal constraints such as "authentication must happen before accessing sensitive data" and enforces them around LLM agent actions at runtime. ([arXiv](https://arxiv.org/abs/2512.23738?utm_source=chatgpt.com "Enforcing Temporal Constraints for LLM Agents"))

There's even a 2026 proposal for a protocol language specifically describing responsibility boundaries, approval gates, and governance constraints between human and AI participants in software development. It's early work, but conceptually very close to what we're discussing. ([arXiv](https://arxiv.org/abs/2606.20615?utm_source=chatgpt.com "Specifying AI-SDLC Processes: A Protocol Language for Human-Agent Boundaries"))

<a id="7-i-think-the-promising-design-is-a-hybrid-behavioral-type"></a>

### 7. A hybrid behavioral type as a promising design


For human-agent collaboration, the recommendation is not to make the core type simply:

```text
message A;
message B;
message C;
```


The proposal is to make several dimensions explicit:

```text
Role
Capability
Authority
Knowledge
Commitment
Protocol state
Data invariant
Temporal obligation
```


For example:

```text
role Agent

can:
    read(repo)
    run(tests)

requires approval Human:
    write(production)

commitment:
    on accept(Task)
    eventually Result(Task) | Failure(Task) | Cancel(Task)

information:
    before propose(Fix)
    Agent knows TestResult

protocol:
    propose(Fix)
    -> Human.(approve | revise | reject)

invariant:
    productionWrite
    implies previously(approve(Human, productionWrite))
```


Some of these belong naturally to existing formalisms:

|Concern|Existing theory|
|---|---|
|Message ordering|Session types|
|Distributed protocol|Multiparty session types|
|State-dependent APIs|Typestate|
|Data constraints|Refinement types|
|"X must occur before Y"|Temporal logic|
|Authority|Capability/security types|
|Obligations|Commitment protocols / norms|
|Autonomous collaboration|IOSE|
|Runtime enforcement|Runtime verification|
|Replace one behavior with another|Behavioral refinement|

This appears to remain an open research area.

We have good theories for each column. We don't yet have a broadly accepted, integrated behavioral type system for:

```text
human + LLM + deterministic code + tools + organizations
```


that combines **flexible autonomy**, **social/organizational semantics**, **machine-checkable protocols**, and **runtime enforcement**.

For this research direction, the proposed starting point is **IOSE/commitment protocols as the high-level semantics**, use **multiparty session types or automata as one executable refinement**, and use **runtime monitors around LLM/tool boundaries**. That gives a plausible stack:

```text
stakeholder requirements
        ↓
commitments / authority / obligations
        ↓
behavioral contracts
        ↓
protocol synthesis / refinement
        ↓
local behavioral types
        ↓
static checking     runtime monitors
      │                   │
 ordinary code          LLM/human
      └─────────┬─────────┘
                ↓
          joint system
```


That is much closer to a programming model for collaborative intelligent systems than current "prompt + agent loop + tools" frameworks.

If your eventual objective is research in this area, **Mambo -> IOSE -> behavioral-types survey -> MPST/Scribble -> Clouseau -> runtime session monitoring** is the proposed reading sequence. It gets you from requirements engineering all the way down to enforceable behavior.
