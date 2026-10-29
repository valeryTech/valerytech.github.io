---
draft: false
toc: true
description: "A conversation and research overview about integrating LLMs into work systems, covering candidate representations, domain models, controlled execution, and verification."
title: "Designing Llm Systems"
linkTitle: "Designing Llm Systems"
---

Publication note, 2026-10-28: This dialogue is edited for public release. Private source links and account metadata are omitted; personal details may be generalized.

Conversation captured on 2026-10-25. Main turns use `##` headings. Tables, lists, code, diagrams, and source links available in the page are preserved.

The completed research report is saved separately and linked below. Its numbered citations link to source titles and URLs recovered from the original report; full citation metadata is preserved separately.

---

## User -- turn 1


Now let's reason about these things.

First, we have systems with people, code, data, and the usual components, and now we also have LLMs. LLMs have a set of features, including unreliability and the ability to generate text. Formally, they generate text, but what can they produce through that text? They can propose actions, process information, and perform familiar NLP tasks, but they can also produce structured output.

[https://valery.tech/ai/var/02-ai-project-examples/ai-project-examples-and-design-model/](<https://valery.tech/ai/var/02-ai-project-examples/ai-project-examples-and-design-model/>) Then, regarding AI system types, maybe we should reason from a common perspective. Later, or even now, we could consider a specific example, such as an agentic application.

So one direction is security and limiting LLM unreliability. We could identify different ways to achieve this, including through system architecture. We could introduce software graphs as a kind of harness. We also need to understand what else we can use. It could be type modeling within a language, or perhaps giving the LLM a specific set of tools in a sandbox or another restricted environment. It could also involve different guardrails, automatic judges, and other classifiers. For example, with Jev, we could use models to assess what the system or LLM proposes. So this is one direction.

And the next direction is: could we use the strengths of LLMs, such as text generation? It has downsides, but it also has benefits. For example, LLMs can analyze known structured information and propose different ways for us to achieve a goal. We need to understand how to support and make use of these benefits. It could involve type modeling, domain modeling, DSLs—what else? We need to find out. Let's analyze my product or problem framing conceptually.

---

## Assistant -- turn 1

### Conceptual framing: Designing systems with LLMs


I think your two directions can form the basis of a broader approach to AI system design:

1. **Controlling LLM behavior and its consequences:** How do we build dependable systems using components whose outputs may be incorrect, unpredictable, or unsafe?
2. **Exploiting LLM capabilities:** How do we use their ability to interpret information, generate representations, construct solutions, and adapt to new situations?

These directions are closely related. Domain models, type systems, DSLs, execution environments, and software architecture can contribute to both.

However, I would introduce a more fundamental question before exploring specific techniques:

**What role does an LLM play in a software system, and what makes its generated output useful?**

Your existing [AI project examples and design model](<https://valery.tech/ai/var/02-ai-project-examples/ai-project-examples-and-design-model/?utm_source=chatgpt.com>) provides a useful starting point. It separates activities, capabilities, workflows, products, and implementations. It also recognizes that one product can combine several kinds of AI-assisted work. [Systems & Engineering](<https://valery.tech/ai/var/02-ai-project-examples/ai-project-examples-and-design-model/?utm_source=chatgpt.com>)

I'd preserve that separation and develop an additional model specifically for designing systems around generative components.

### 1. The fundamental capability: Generating candidate representations


An LLM generates tokens. Those tokens can form natural language, structured data, code, queries, formal expressions, or instructions to tools.

From a software engineering perspective, the important property is that **an LLM can construct representations of information, problems, decisions, and possible actions.**

Consider several examples:

| LLM output | What it represents |
|---|---|
| Explanation | An interpretation of available information |
| JSON object | Structured information extracted or generated according to a schema |
| SQL query | A proposed computation over data |
| DSL expression | A proposed operation within a defined domain |
| Execution plan | A proposed sequence of actions |
| Code | A proposed implementation of behavior |
| Hypothesis | A possible explanation requiring investigation |
| Tool call | A request to perform an operation |
| Report | A synthesis of evidence, calculations, and interpretations |

These outputs have different purposes and require different forms of validation.

For example, a syntactically valid SQL query might answer the wrong question. A correctly typed tool call might attempt an unauthorized operation. A logically consistent report might contain unsupported factual claims.

Therefore, generating a representation and establishing its validity are separate concerns.

This leads to a useful basic model:

```text
Intent + Context + Available Knowledge
                  |
                  v
            LLM Generation
                  |
                  v
        Candidate Representation
                  |
                  v
       Interpretation / Validation
                  |
                  v
        Accepted Result or Action
                  |
                  v
        Feedback / Observation
```


The LLM may generate many possible representations. The surrounding system determines their meaning, checks their suitability, and governs their use.

This gives us a common foundation for both of your directions.

### 2. Direction A: Controlling LLM unreliability and risk


I would avoid treating unreliability as one problem.

Different failures require different mechanisms. Your existing security note already separates task reliability, epistemic reliability, security, and safety. That distinction is important for architecture. [Systems & Engineering](<https://valery.tech/ai/var/security-aspect/?utm_source=chatgpt.com>)

Consider these separate questions:

| Concern | Design question | Possible mechanisms |
|---|---|---|
| Structural correctness | Does the output have the expected structure? | Schemas, constrained decoding, parsers, type systems |
| Domain correctness | Is the proposed operation valid in this domain? | Domain models, invariants, semantic validation |
| Factual correctness | Is the information supported by evidence? | Retrieval, provenance, calculations, independent verification |
| Decision quality | Is the proposed decision appropriate? | Classifiers, LLM judges, evaluation models, human review |
| Security | Can the model access or affect protected resources? | Access control, capability restrictions, sandboxes, information-flow control |
| Execution reliability | Can the operation execute safely and recover from failure? | Transactions, idempotency, workflow engines, retry policies |
| Outcome correctness | Did the intended result actually occur? | Postcondition checks, external state verification |
| Operational reliability | Does the system behave acceptably over many runs? | Evals, monitoring, failure analysis, regression testing |

A distinction here is between **properties we can enforce mechanically and properties we can only evaluate with limited confidence**.

For example:

A JSON Schema can enforce structural properties, within its supported constraints. It cannot establish that the generated values accurately reflect the user's intention. [OpenAI Developers](<https://developers.openai.com/api/docs/guides/structured-outputs?utm_source=chatgpt.com>)

A tool permission system can prevent a model from accessing a resource without authorization. It cannot guarantee that an authorized operation is appropriate for the user's goal.

An LLM judge can assess whether an explanation appears supported. Its judgment remains fallible, including when it agrees with the model that generated the explanation.

This suggests a research direction:

**Which properties can the surrounding system guarantee independently of the LLM, and which require empirical evaluation of model behavior?**

That question should guide the choice of mechanisms.

#### Architectural enforcement versus behavioral control


Another useful distinction concerns where constraints are applied.

A system prompt may instruct an LLM to avoid particular actions. A classifier may detect questionable proposals. Both depend on model behavior or classification quality.

A runtime can independently reject an unauthorized tool call.

A sandbox can restrict which resources are accessible, even when a model generates an unsafe command.

This is closely related to capability-based security. For example, the CaMeL research uses explicit data-flow and control-flow policies to protect an agent against prompt injection without assuming that the model itself is immune. [IEEE Xplore](<https://ieeexplore.ieee.org/abstract/document/11691650?utm_source=chatgpt.com>)

The general design principle is that the strength of a guarantee depends on where and how it is enforced.

### 3. Direction B: Exploiting LLM generative capabilities


Here, I'd expand your original idea.

Text generation is the underlying mechanism, but the useful capabilities are broader than producing human-readable text.

An LLM can interpret loosely specified intentions, map between representations, propose new structures, combine available operations, generate executable procedures, and adapt proposals in response to feedback.

We can organize these capabilities into several areas.

**Semantic interpretation and transformation**

The model can translate between natural language and structured representations.

Examples include extracting entities from documents, converting requirements into domain objects, mapping user intentions into operations, or translating between different data models.

Schemas, ontologies, and domain models help by defining the representations the LLM can produce and work with.

**Generation and composition**

The model can construct candidates that were never explicitly enumerated by the application developer.

For example, suppose a system provides five computational operations.

A conventional application might expose five corresponding functions.

An LLM operating over a suitable DSL could potentially construct many valid combinations of those operations.

This is particularly useful when the number of possible task combinations is large.

Here, DSLs, compositional APIs, type systems, and programming environments become important.

**Planning and adaptive decision-making**

Given a goal, current state, constraints, and available operations, the model can propose how to proceed.

It can select an operation, examine its result, revise a plan, or propose a different approach.

This introduces requirements for explicit state, observations, execution feedback, and exception handling.

**Analysis and hypothesis generation**

The model can propose interpretations, questions, explanations, and possible relationships between pieces of information.

An investigation system can use this ability to explore possibilities that a fixed analytical pipeline might never enumerate.

Evidence models, provenance graphs, domain rules, and verification tools help establish which generated conclusions deserve acceptance.

**Iterative construction using feedback**

This is particularly visible in coding agents.

An agent generates code, compiles it, examines errors, runs tests, and modifies the implementation.

The same pattern can apply to SQL, analytical programs, workflow definitions, and domain-specific expressions.

The useful capability is a combination of generation, execution, observation, and revision.

This explains why the environment around an LLM can substantially change what it can accomplish.

Your [sandbox-first capability discovery](<https://valery.tech/ai/design/workflow-design/sandbox-first-capability-discovery-llm-agents/?utm_source=chatgpt.com>) notes already develop this point: providing general-purpose tools in a controlled environment can expose capabilities that a narrowly prescribed workflow would prevent the model from using. [Systems & Engineering](<https://valery.tech/ai/design/workflow-design/sandbox-first-capability-discovery-llm-agents/?utm_source=chatgpt.com>)

#### An important design tension


We should distinguish two forms of constraint:

**Constraints on how the model searches for a solution.** These determine which strategies, representations, tools, and compositions it can explore.

**Constraints on what effects the model can cause.** These determine which resources it may access or modify, under which conditions, and with whose authority.

This distinction creates an important architectural opportunity.

We can allow considerable freedom in constructing and evaluating solutions while strictly controlling their external consequences.

For example, an agent could write programs, generate alternative scheduling plans, compare possibilities, and run simulations inside a sandbox. Actual calendar modifications would remain subject to a separate authorization mechanism.

That is a way of increasing the useful capabilities of the system through architectural controls.

---

### 4. The shared mechanisms


Now we can examine your original intuition: many mechanisms appear in both directions.

| Mechanism | How it increases useful capabilities | How it controls unreliability |
|---|---|---|
| **Type systems and schemas** | Provide representations that models can generate and manipulate | Reject structurally invalid outputs |
| **Domain models and ontologies** | Expose entities, relationships, operations, and domain meaning | Support consistency checks and domain invariants |
| **DSLs** | Enable generation and composition of domain-specific programs | Restrict syntax, available operations, and expressible effects |
| **Workflow graphs and state machines** | Represent dependencies, alternatives, and progression | Enforce permitted states and transitions |
| **Tools and APIs** | Connect the model to real computations, information, and operations | Bound execution through permissions and validated interfaces |
| **Sandboxes** | Enable experimentation and program generation | Isolate resources and limit consequences |
| **Classifiers and model judges** | Route work, compare candidates, and provide evaluation feedback | Detect some invalid, unsupported, or risky outputs |
| **Tests and deterministic verifiers** | Provide feedback for iterative improvement | Check specified properties of generated artifacts |
| **Retrieval and knowledge systems** | Supply domain information and context | Enable grounding and evidence checks |
| **Harnesses** | Manage context, tools, state, execution loops, and feedback | Coordinate validation, authorization, resource limits, and recovery |

The important insight is that **a mechanism's value comes from the properties it provides, not from whether we classify it as a guardrail or an enabling technology**.

Consider a typed DSL.

It limits the expressions an LLM can generate. That is a restriction.

At the same time, it can enable the LLM to construct complex programs whose behavior the application knows how to interpret and execute.

The same mechanism increases expressiveness within a domain and makes certain properties easier to check.

However, neither a DSL nor a type system automatically establishes that a generated solution satisfies the user's underlying intention.

Your existing work on [constrained generativity and semantic substrates](<https://valery.tech/ai/design/workflow-design/langs-aspects/?utm_source=chatgpt.com>) already explores this idea. It also identifies a crucial engineering cost: creating comprehensive semantic contracts can require more effort than the benefits justify. [Systems & Engineering](<https://valery.tech/ai/design/workflow-design/langs-aspects/?utm_source=chatgpt.com>)

That suggests we should investigate how much formal structure is actually necessary for a particular system.

### 5. A concrete example: An agentic coordination system


Let's use the recruiting coordinator from your examples.

The user's goal is:

> Coordinate interviews for a candidate with three interviewers, find suitable times, handle conflicts, and notify the participants.

The system contains people, calendars, applicant records, communication services, business rules, and an LLM.

#### First: What can we model?


We might define domain entities such as:

```text
Candidate
Interviewer
Availability
Interview
Invitation
SchedulingConstraint
```


We might also define available operations:

```text
GetAvailability
FindSuitableSlots
ProposeSchedule
RequestConfirmation
BookInterview
SendNotification
```


Each operation has input types, preconditions, possible effects, and execution requirements.

For example, `BookInterview` may require a valid time slot, appropriate permissions, and confirmation from the relevant participants.

#### Second: What does the LLM contribute?


The model can interpret the user's goal, determine which information is missing, select suitable operations, generate possible scheduling plans, and adapt when conflicts arise.

It could generate a plan such as:

```text
GetAvailability(interviewers)
    |
    v
FindSuitableSlots(constraints)
    |
    v
ProposeSchedule(candidate)
    |
    v
WaitForConfirmation
    |
    v
BookInterview
    |
    v
SendNotification
```


That plan is a generated representation of proposed behavior.

The application can inspect it, validate its structure, and determine whether its operations are permitted.

A workflow engine can then manage execution, including waiting for responses and recovering from failures.

The scheduling and notification services can independently check permissions and report what actually happened.

#### Third: Where are the two directions?


The LLM's ability to construct and adapt a plan creates value.

Domain modeling provides the concepts used to build that plan.

A DSL or typed action model could allow the LLM to express the plan in a form suitable for automatic inspection.

A workflow runtime manages its state and progression.

Authorization mechanisms govern external effects.

Verification determines whether the intended interviews were actually booked.

Notice that the same system can be quite flexible in planning while strict about execution.

#### Fourth: What happens if we remove the formal structure?


The LLM could potentially perform the same task through direct tool calls.

That might be sufficient.

Introducing an intermediate DSL, execution graph, or formal plan representation adds complexity.

We therefore need to test whether those additions improve task success, reduce failures, enable reuse, or simplify verification.

**The existence of an architectural mechanism does not establish that a system needs it.**

This also connects to your sandbox-first approach. We can initially study what the model accomplishes with general-purpose tools, then introduce structure where experiments identify a reason to do so.

---

### 6. How I would develop the design framework


I would retain your current activity-based model, then add several independent design dimensions.

The goal would be a framework that applies across your eight product examples without prescribing the same implementation for all of them.

| Dimension | Core question |
|---|---|
| **Work and outcomes** | What activity is being performed, and what constitutes a successful result? |
| **Generative role** | What does the LLM interpret, propose, construct, or revise? |
| **Representation** | What form does the generated information or behavior take? |
| **Available capabilities** | What information, computations, tools, and operations can the system use? |
| **Freedom of composition** | How much flexibility does the LLM have in combining operations and choosing procedures? |
| **Assurance** | Which properties must be checked, and which can be guaranteed? |
| **Authority and effects** | Who can authorize changes, and where are those permissions enforced? |
| **Execution and feedback** | How does work progress, recover, and establish that outcomes occurred? |

These dimensions connect directly to your existing terms.

An **activity** establishes the desired result.

**Capabilities** describe what people, LLMs, and ordinary software can contribute.

**Representations** connect generated proposals to the domain and execution environment.

A **workflow or operating regime** governs how work progresses.

**Assurance and authority** determine what the system can accept, execute, and claim.

The **implementation** realizes these properties through specific components.

This gives us a systematic way to compare architectures without beginning with decisions such as whether to use LangGraph, a custom harness, an ontology, or a DSL.

### 7. What I would change in your original problem framing


There are three conceptual adjustments I'd make.

#### A. Go beyond text generation as the central property


Text generation is necessary to understand the mechanism, but it is too general to guide architecture.

The more useful design property is the ability to **construct and revise representations of possible results and behavior from partially specified information**.

These representations can be informal or formal.

Their value depends on how the surrounding system can interpret, evaluate, compose, or execute them.

This framing covers ordinary NLP applications, investigation systems, analytical agents, coding agents, and delegated operations.

It also gives a more precise reason to investigate domain modeling, programming languages, and execution environments.

#### B. Separate assurance from authority


An output might be correct and still unauthorized.

A proposed action might be authorized and still inappropriate.

A well-formed program might be safe to execute in a sandbox yet unsuitable for production.

So I'd explicitly distinguish:

- **Validity:** Does the representation satisfy the specified constraints?
- **Acceptance:** Is it suitable for the intended task, given the available evidence?
- **Authorization:** Is the proposed effect permitted?
- **Execution:** What actually happened?

These distinctions allow different components to make different guarantees.

#### C. Don't assume that more structure is always better


There is a real trade-off between formal structure and generative flexibility.

A tightly constrained domain language can make certain properties easier to verify, but it can exclude approaches that the designer did not anticipate.

General-purpose tools expose a larger solution space, but make it harder to establish useful guarantees about every generated procedure.

Neither approach is universally preferable.

The design problem becomes:

**What is the minimum structure needed to achieve the required properties while preserving enough generative freedom to perform the work effectively?**

That is a research question with direct consequences for architecture.

---

### 8. A possible research direction


I see the beginnings of a coherent research program here.

Its central question would be:

> How can software systems use LLMs to generate and compose useful behavior while preserving explicitly selected correctness, security, and execution guarantees?

Your two directions become complementary parts of that question.

The capability side investigates representation, semantic modeling, tool composition, programmable environments, and adaptive workflows.

The assurance side investigates contracts, type systems, policies, isolation, evidence, verification, and evaluation.

The integration problem investigates how those mechanisms interact and which combinations deliver measurable benefits.

I would initially test this using one agentic application, comparing three architectures:

| Architecture | Characteristics |
|---|---|
| Direct tool-calling agent | LLM selects and invokes available tools; runtime enforces permissions |
| Structured workflow agent | LLM proposes typed operations within application-managed workflows |
| Programmable agent | LLM composes operations using a DSL or executable environment, with validation and controlled execution |

The experiments should measure task completion, flexibility under changing requirements, unauthorized actions, invalid operations, recovery behavior, implementation complexity, and cost.

This would help determine where formal representations improve a system and where general-purpose generation is sufficient.

### 9. My assessment of the framing


I think the strongest direction is to investigate the relationship between **generative freedom, formal structure, and enforceable guarantees**.

It covers both the strengths and the limitations of LLMs. It also connects naturally to existing software engineering disciplines: programming languages, type systems, domain-driven design, security engineering, workflow systems, and formal verification.

However, I would keep three research questions distinct.

**Capability discovery:** What can an LLM accomplish when supplied with particular representations, tools, information, and execution environments?

**System assurance:** Which properties can we enforce independently of the LLM's behavior, and which remain dependent on empirical reliability?

**Architecture selection:** Which combination of mechanisms produces the best result for a given activity, with acceptable complexity and cost?

The third question is what turns the conceptual research into a practical system design method.

Your existing project classification can supply the application cases. Your operating regimes can describe how work progresses. The additional framework would explain how to select representations, capabilities, controls, and verification mechanisms for those cases.

**My recommendation is to develop this as a general design model first, using agentic coordination as the initial worked example.** Once the model can explain that case, test it against investigation systems and coding agents. Those cases have different correctness requirements and different kinds of generative freedom, making them useful tests of whether the model generalizes.

---

## User -- turn 2


[Deep research](<https://chatgpt.com/settings/plugins-settings/apps/connector_openai_deep_research>) Okay, let's develop this as a general design model. We need to work at the conceptual level first, and then we could rebuild the systems—for example, the different types in our examples—from the ground up using this model. Let's do some deep research on this.

---

## Assistant -- turn 2


Deep Research has started.

It will develop a **general conceptual design model for LLM-enabled systems**, grounded in your existing framework and relevant software engineering research.

The research will focus on generative capabilities, representations, system architecture, reliability, security, formal constraints, and the trade-off between flexibility and control.

The intended outcome is a reusable model that we can subsequently apply to reconstruct your AI system examples from first principles.

Deep Research will present its research plan and deliver the full report in the research interface.

---

## User -- turn 3


Analyze the report. How could we start building the system from the ground up? Maybe we could begin with conceptualization. What are the main building blocks of the system—perhaps modes? What are the features of these building blocks? How could we combine them?

---

## Assistant -- turn 3


I would start by defining a **small set of fundamental building blocks**, then describe their properties, relationships, and possible combinations.

The research report gives us a foundation, particularly its separation of work, generation, representations, capabilities, composition, authority, and execution.

Referenced file: `General_Conceptual_Design_Model_with_References(1).md` (the saved page contains the reference but not the original file data).

However, I would make one adjustment: **we should avoid treating the report's proposed architecture as the universal architecture of an AI system.** Its proposal-validation-authorization-execution cycle is useful, but it's already one particular way of organizing the components.

We should begin one level above that.

### 1. Start with a general model of a system


At the most abstract level, a system contains:

| Building block | Meaning | Examples |
|---|---|---|
| **Participants** | Entities that perform work | Human, LLM, software service |
| **Activities** | Work performed toward an outcome | Analyze, generate, decide, execute |
| **Information** | Material used or produced during activities | Documents, data, observations, knowledge |
| **Representations** | Forms in which information, intent, or procedures are expressed | Text, JSON, domain objects, plans, programs |
| **Capabilities** | Operations available to participants | Search, calculate, retrieve, send, modify |
| **State** | Information about the system at a particular moment | Current task, progress, environment, history |
| **Control** | How activities are initiated, ordered, and coordinated | User interaction, workflow, agent loop |
| **Constraints** | Rules governing valid behavior | Types, policies, permissions, invariants |
| **Evaluation** | How results are assessed | Tests, verification, human judgment |

These are conceptual roles. A component can implement several roles, and a role can be distributed across several components.

For example, an LLM can generate a plan, evaluate a response, and select an operation. A conventional program can perform the same roles in a different way.

This gives us a foundation that doesn't depend on any particular AI architecture.

### 2. Define the properties of each building block


The next step is to identify the dimensions along which each block can vary.

Consider **capabilities**.

A capability can have several properties:

| Dimension | Possible values |
|---|---|
| Function | Retrieve, transform, compute, communicate, modify |
| Implementation | Deterministic code, LLM, human, external service |
| Effects | Read-only, local modification, external modification |
| Input | Natural language, structured data, typed domain objects |
| Output | Text, data, artifact, state change |
| Reliability | Deterministic under stated conditions, probabilistic, externally dependent |
| Composition | Standalone, sequential, conditional, programmable |
| Authority | Unrestricted within scope, permission-controlled, approval-required |

These properties are largely independent.

For example, a capability might use an LLM internally, return structured data, be read-only, and participate in a deterministic workflow.

Another capability might be implemented entirely in code but produce consequential external effects requiring human approval.

We can apply the same analysis to representations, activities, state, control, and evaluation.

This is where the model becomes useful: **we can describe a system through combinations of properties without first assigning it to a product category.**

### 3. Distinguish building blocks from operating modes


I think *modes* should be another concept in the model.

A mode describes how a system operates during a particular activity.

Consider these possible modes:

| Mode | Description |
|---|---|
| **Interactive** | A human directs successive steps |
| **Generative** | A participant constructs a candidate artifact or representation |
| **Deterministic** | Explicit rules determine the next operation |
| **Exploratory** | The next activity depends on discoveries and observations |
| **Workflow-driven** | Activities follow defined states and transitions |
| **Goal-directed** | The system selects activities to pursue a specified outcome |
| **Programmable** | The system constructs and executes procedures |
| **Review-driven** | Progress depends on evaluation or approval |

These are preliminary categories. They are not necessarily mutually exclusive.

For example, an investigation system might be interactive, exploratory, and programmable simultaneously.

A coding agent might be goal-directed while operating inside a deterministic test-and-review workflow.

This raises an important modeling question: should these be called modes, or should some be treated as independent dimensions?

My preference is to distinguish:

- **Dimensions:** fundamental properties that can vary independently.
- **Modes:** recognizable configurations of those properties.
- **Architectures:** arrangements of components implementing those configurations.

This avoids making a long list of overlapping modes the foundation of the model.

### 4. Define how building blocks compose


Composition is one of the most important concepts in the report.

I would distinguish at least four forms.

#### A. Functional composition


The output of one capability becomes the input of another.

```text
Retrieve documents
       ↓
Extract information
       ↓
Transform information
       ↓
Generate report
```

#### B. Control composition


Activities are connected through sequencing, conditions, loops, or events.

```text
Observe
   ↓
Decide
   ↓
Execute
   ↓
Evaluate
   └────→ Observe
```

#### C. Representational composition


A participant constructs a representation that another component can interpret.

```text
Human intention
       ↓
LLM
       ↓
Structured plan
       ↓
Plan interpreter
       ↓
Operations
```


This is where typed plans, DSLs, and generated code become useful.

#### D. Organizational composition


Multiple participants collaborate, with responsibilities divided among them.

```text
Human
  ↓ delegates
LLM
  ↓ proposes
Software
  ↓ executes
External system
  ↓ reports
Human / LLM
  ↓ evaluates
```


These forms can be combined.

For example, an LLM could generate a workflow that coordinates several deterministic capabilities, with human approval required for selected operations.

### 5. Introduce a minimal system model


I would initially express a system as:

\[S = (P, A, I, R, C, Q, F, K, E)\]

Where:

- \(P\): participants
- \(A\): activities and intended outcomes
- \(I\): information
- \(R\): representations
- \(C\): capabilities
- \(Q\): state
- \(F\): control and composition
- \(K\): constraints
- \(E\): evaluation

This is a **proposed conceptual model**, not an established formalism.

It gives us the vocabulary for describing a system.

We would then define relationships such as:

```text
Participant performs Activity

Activity uses Information

Activity produces Representation

Participant invokes Capability

Capability reads or changes State

Control coordinates Activities

Constraints restrict Activities,
Representations and Capabilities

Evaluation assesses Results
and observed State
```


Notice that nothing here requires an LLM.

An LLM becomes a particular type of participant or capability with generative properties.

This lets us explain precisely what changes when an LLM is introduced into an existing software system.

### 6. Build systems through successive design decisions


Once the conceptual model is defined, we can use it to construct systems.

I suggest the following sequence.

**Step 1 -- Define the work.**

What activity are we supporting? What outcome should be produced?

**Step 2 -- Identify the information and state.**

What does the system need to know? What changes during the activity?

**Step 3 -- Allocate responsibilities.**

What should people, LLMs, and conventional software do?

**Step 4 -- Define representations.**

What objects should participants exchange? Natural language, structured records, domain models, plans, programs?

**Step 5 -- Define capabilities.**

What operations are necessary to perform the work?

**Step 6 -- Choose composition and control.**

Can the sequence be predetermined? Must it be discovered? Can participants construct new procedures?

**Step 7 -- Define constraints and evaluation.**

Which properties must always hold? Which outcomes require empirical assessment or human judgment?

Only after these decisions would we choose specific implementation mechanisms such as an agent loop, workflow engine, DSL, sandbox, or policy engine.

---

### 7. What I would develop next


I would organize the conceptual work into three stages.

#### Stage 1: Ontology of building blocks


Define the fundamental concepts, their properties, and relationships.

The main challenge is ensuring that the concepts are sufficiently independent. For example, generation is an activity, an LLM is a participant, and a generated plan is a representation. These belong at different levels.

#### Stage 2: Composition and operating modes


Define how building blocks combine.

We should examine whether concepts such as interactive, autonomous, exploratory, deterministic, workflow-driven, and programmable are genuinely distinct modes or configurations of more fundamental dimensions.

#### Stage 3: System construction


Start with a minimal configuration and progressively add capabilities.

For example:

```text
1. Human → LLM → Answer

2. Human → LLM → Structured representation

3. Human → LLM → Tool → Result

4. Human → LLM → Multiple tools → Result

5. Human → LLM → Plan → Executor → Result

6. Human → LLM → Program → Runtime → Result

7. Goal → LLM + State + Tools + Feedback
          → Verified outcome
```


These are illustrative configurations, not a required progression. More components do not automatically produce a better system.

Each configuration introduces different possibilities, constraints, and failure modes.

We could then reconstruct your existing examples using the same vocabulary.

### My proposed starting point


I would begin with **three foundational questions**:

1. **What exists in the system?** Participants, information, representations, capabilities, state, and environment.
2. **What can happen?** Activities, generation, transformations, decisions, execution, observation, and evaluation.
3. **How is behavior organized?** Composition, control, constraints, authority, and operating modes.

This separation gives us a clearer foundation than starting with agents, workflows, or DSLs.

The first concrete deliverable should be a **conceptual metamodel**: a precise definition of the building blocks, their independent properties, and their allowed relationships.

Once we have that, we can derive operating modes and architectures systematically, and then test whether the model can explain the different AI systems without introducing special cases for each one.


---

## Completed research report


[A General Conceptual Design Model for Software Systems That Integrate LLMs]({{< ref "ai/design-research/input/reports/general-conceptual-design-model-for-llm-software-systems" >}})
