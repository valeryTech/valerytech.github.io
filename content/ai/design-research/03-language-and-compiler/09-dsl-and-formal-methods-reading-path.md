---
draft: false
toc: true
description: "Connects Fowler-style DSL design and verified agent research to formal ancestors including GOLOG, comparing how declared constraints, planning engines, and symbolic checks limit model-generated programs."
title: "09 Dsl And Formal Methods Reading Path"
linkTitle: "09 Dsl And Formal Methods Reading Path"
---

Editorial context, 2026-04-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

## Unmesh-comparison


Martin Fowler has written extensively about DSLs for about two decades.

Most directly:

- In 2010 he published the book _Domain Specific Languages_, with Rebecca Parsons. It covers internal DSLs, external DSLs, parsing, code generation, fluent interfaces, and language workbenches. ([martinfowler.com](https://martinfowler.com/books/dsl.html?utm_source=chatgpt.com "Domain Specific Languages"))
- His 2008 article defines a DSL as a language targeted at a specific kind of problem and distinguishes internal DSLs embedded in a host language from external DSLs with their own syntax. ([martinfowler.com](https://martinfowler.com/bliki/DomainSpecificLanguage.html?utm_source=chatgpt.com "Domain Specific Language"))
- His 2019 DSL guide collects his work and specifically discusses rules engines, decision tables, state machines, interpretation, and code generation. ([martinfowler.com](https://martinfowler.com/dsl.html?utm_source=chatgpt.com "DSL Guide"))
- Fowler also stresses that DSLs should usually have limited scope and capability. That property is particularly relevant to the agent architecture we're discussing. ([martinfowler.com](https://martinfowler.com/bliki/DslBoundary.html?utm_source=chatgpt.com "Dsl Boundary"))

There is also a very relevant new article on Fowler's site, **"DSLs Enable Reliable Use of LLMs," published July 14, 2026**. It argues almost exactly what we were discussing: constrain LLM output using a DSL so that types, invariants, executable semantics, and examples provide boundaries to the model. ([martinfowler.com](https://martinfowler.com/articles/llm-and-dsls.html?utm_source=chatgpt.com "DSLs Enable Reliable Use of LLMs"))

One distinction: that 2026 article is **written by Unmesh Joshi**, not Fowler himself. Fowler reviewed it and is thanked in the acknowledgments. ([martinfowler.com](https://martinfowler.com/articles/llm-and-dsls.html?utm_source=chatgpt.com "DSLs Enable Reliable Use of LLMs"))

Joshi's argument is close to the proposal in these notes, but the LLM analysis suggests a further extension. His focus is roughly:

```text
natural language
      ↓
     LLM
      ↓
domain DSL
      ↓
domain implementation
```


The proposed design adds a stronger programming-languages layer:

```text
natural language
      ↓
     LLM
      ↓
typed/effectful DSL program
      ↓
compiler
 ├─ syntax
 ├─ types
 ├─ effects
 ├─ capabilities
 ├─ information flow
 ├─ state transitions
 └─ formal predicates
      ↓
verified plan
      ↓
small interpreter
```


That second architecture moves the DSL from being mainly an abstraction that helps the LLM generate reliable code into being an actual **security and correctness boundary**.

And Fowler's old definition supports this nicely: good DSLs deliberately lack much of the expressive power of general-purpose languages. ([martinfowler.com](https://martinfowler.com/bliki/DslBoundary.html?utm_source=chatgpt.com "Dsl Boundary")) That loss of expressive power is exactly what can make verification tractable.

If you're exploring this as a research direction, the proposal is to read Fowler's DSL material for language-design principles, but then look at **effect systems, capability security, refinement types, typestate, linear types, and proof-carrying code**. Those are probably the PL concepts that turn Fowler-style DSLs into a serious LLM-agent harness.

## application: similar


There is now a fairly active research line that looks a lot like a return of neuro-symbolic AI, with an LLM used as a flexible proposal/reasoning component and a more rigid system around it that checks, constrains, or vetoes its actions.

The terminology is fragmented. Useful search terms are **verified AI**, **formal methods for LLM agents**, **neuro-symbolic agents**, **runtime assurance**, **constrained generation**, **agent security**, and **AI control**.

![Image](https://people.eecs.berkeley.edu/~sseshia/SanjitSeshia_photograph.jpg)

The proposed researchers to follow are:

- **Sanjit Seshia -- UC Berkeley.** Probably the closest match to what you are describing. His group combines formal methods, automated reasoning, synthesis, and ML. The architecture is essentially: let the learned component propose something, then use symbolic machinery such as SAT/SMT solvers, specifications, and verification to determine whether it is acceptable. His group explicitly works on both "AI-enabled formal methods" and "verified AI", including LLM auto-formalization. ([people.eecs.berkeley.edu](https://people.eecs.berkeley.edu/~sseshia/?utm_source=chatgpt.com "Sanjit Seshia's Home"))
- **Clark Barrett -- Stanford, Thomas Henzinger -- ISTA, and Seshia.** Their recent idea of **certifiable AI** is particularly relevant. An AI should produce an answer together with a machine-checkable certificate; a simpler trusted verifier checks the certificate. Their 2026 CACM article is literally titled _Certificates in AI: Learn but Verify_. ([theory.stanford.edu](https://theory.stanford.edu/~barrett/pubs/BHS25-abstract.html?utm_source=chatgpt.com "<a href=\"https://dl.acm.org/doi/full/10.1145/3737447\">Certificates in AI: Learn but Verify</a>"))
- **Sasa Misailovic and Gagandeep Singh -- UIUC.** This is perhaps the most concrete current example of an actual LLM "harness". Their **Agent-C** system lets an LLM agent generate tool calls while a formal layer enforces temporal rules such as "authenticate before accessing customer data." Policies are translated to logic, checked with an SMT solver, and generation is constrained when the proposed action would violate the policy. ([arxiv.org](https://arxiv.org/abs/2512.23738?utm_source=chatgpt.com "Enforcing Temporal Constraints for LLM Agents"))
- **Swarat Chaudhuri -- UT Austin.** His Trishul lab works at the intersection of program synthesis, automated reasoning, programming languages, and ML. He explicitly describes the goal as building intelligent systems that are "reliable by construction." His recent work includes neuro-symbolic theorem proving, LLM agents for formal reasoning, and formal constraints on learned policies. ([cs.utexas.edu](https://www.cs.utexas.edu/~swarat/?utm_source=chatgpt.com "Swarat Chaudhuri | Computer Science, University of Texas at Austin"))
- **Dawn Song -- UC Berkeley, and Bo Li and collaborators.** Their direction comes from computer security. **Progent** puts a programmable privilege layer around an LLM agent: the LLM can propose tool operations, while a small policy language determines which calls are allowed. **GuardAgent** and **ShieldAgent** similarly place a separate guard around an agent and translate safety requirements into executable or logically checkable rules. This is very close to OS-style capability security applied to LLMs. ([arxiv.org](https://arxiv.org/abs/2504.11703?utm_source=chatgpt.com "Progent: Programmable Privilege Control for LLM Agents"))
- **Zico Kolter and Matt Fredrikson -- CMU.** They approach the problem from adversarial robustness and security: jailbreaks, adversarial inputs, agent safety, circuit breakers, and mechanisms that remain effective when someone deliberately tries to defeat the safety layer. CMU has an active cluster around LLM safety, verification, and neuro-symbolic reliability. ([CMU School of Computer Science](https://www.cs.cmu.edu/news/2025/kolter-ai-safety-science?utm_source=chatgpt.com "Kolter Joins New $10M AI Safety Science"))
- **Ryan Greenblatt, Buck Shlegeris, Fabien Roger and the Redwood Research / UK AI Security Institute community.** Their term is **AI control**. Here you explicitly assume the powerful model might be untrustworthy. A weaker trusted model, monitors, sandboxing, limited privileges, auditing, resampling, and human escalation form a control protocol around it. That is a different intellectual lineage from neuro-symbolic AI, but architecturally it is very much the "LLM inside a harness" idea. ([ML Anthology](https://mlanthology.org/icml/2024/greenblatt2024icml-ai/?utm_source=chatgpt.com "AI Control: Improving Safety Despite Intentional Subversion | ML Anthology"))
- **Yoshua Bengio and LawZero.** Bengio is exploring a more architectural version of the same question. His **Scientist AI** proposal aims for a non-agentic predictor that can estimate consequences and serve as a guardrail for more agentic systems. This goes beyond adding restrictions to an existing LLM: it asks whether the underlying model should be designed so that prediction, planning, and agency are separated. ([lawzero.org](https://lawzero.org/en/research?utm_source=chatgpt.com "Research | LawZero"))

There is also a softer, model-internal branch: **Constitutional AI** and **deliberative alignment**. There the model is trained to reason about an explicit written specification. OpenAI's work by Melody Guan, Boaz Barak and collaborators is a good example. This gives the LLM an explicit policy to reason over, although the enforcement mechanism still depends heavily on the LLM itself. ([OpenAI](https://openai.com/index/deliberative-alignment/?utm_source=chatgpt.com "Deliberative alignment: reasoning enables safer language models | OpenAI"))

An architectural pattern that may be becoming important is roughly:

**natural-language request -> LLM proposes plan -> formal/policy layer checks plan -> LLM proposes action -> capability/security layer checks action -> deterministic tool executes -> monitor checks resulting state -> repeat**

In that architecture, the LLM supplies semantic understanding, decomposition and search over possible actions. Authority remains with smaller components whose behavior is easier to specify: type systems, schemas, capability controls, SAT/SMT solvers, model checkers, conventional programs, transaction rules, or human approval.

This is conceptually quite close to older neuro-symbolic thinking. The difference is that the neural component has become capable enough that you can use it as a general-purpose **proposal generator / formalizer**, while symbolic machinery handles the parts where you want invariants and guarantees. The 2025-26 literature is moving quite visibly in this direction; for example, there is now explicit work arguing that trustworthy LLM agents require combining LLMs with formal methods. ([Proceedings of Machine Learning Research](https://proceedings.mlr.press/v267/zhang25ds.html?utm_source=chatgpt.com "Position: Trustworthy AI Agents Require the Integration of Large Language Models and Formal Methods"))

The proposed **five people to start reading** are **Sanjit Seshia, Sasa Misailovic, Swarat Chaudhuri, Dawn Song, and Ryan Greenblatt**. Together they cover formal verification, constrained generation, neuro-symbolic reasoning, security boundaries, and adversarial control.

## existing lines


There are several existing lines of work that are quite close. The saved LLM analysis did not identify one established framework that combines all of the proposed pieces, but the core architecture already exists in several forms.

|Approach|What author declares|What engine does|How close|
|---|---|---|---|
|**GOLOG / ConGolog / IndiGolog / DTGolog**|World model plus a high-level program containing tests, procedures, nondeterministic choices, concurrency, etc.|Reasons about the world and resolves legal executions; IndiGolog interleaves execution, sensing and planning; DTGolog can complete a partially specified program optimally.|**Closest formal ancestor.** This is almost "write an underspecified executable specification, let the engine resolve remaining freedom." ([U of T Computer Science](https://www.cs.toronto.edu/kr/papers/GOLOGlang.pdf?utm_source=chatgpt.com "J. LOGIC PROGRAMMING 1994:19, 201-679 1"))|
|**PDDL / automated planning**|Actions with preconditions/effects, initial state, goals and constraints.|Finds an action sequence that achieves the goal.|Very close to your `current state + allowed operations + desired state -> execution`. PDDL deliberately separates domain specification from planner implementation. ([Information Sciences Institute](https://www.isi.edu/results/publications/62624/pddl-the-planning-domain-definition-language/?utm_source=chatgpt.com "Pddl--the planning domain definition language \| Information Sciences Institute"))|
|**ANML / EUROPA / MAPGEN**|Rich actions, resources, temporal constraints and goals. A human can interactively modify the plan.|Constraint propagation and automated planning maintain consistency and suggest/build plans.|**Closest historical example of collaborative human + engine authoring.** MAPGEN was actually used for Mars rover operations and combines interactive plan editing with a constraint-based planning engine. ([NASA Technical Reports Server](https://ntrs.nasa.gov/api/citations/20040084378/downloads/20040084378.pdf?utm_source=chatgpt.com "U <br>.- <br>hL4PGEN: Mixed-initiative activity planning"))|
|**SKETCH / SyGuS**|A partial program, holes, semantic constraints, and sometimes a grammar restricting allowable implementations.|Synthesizes a completion satisfying the specification.|Very close to your idea of a **progressively refined program**. The main difference is that the output is generally another program, rather than an ongoing world-interacting execution. ([MIT CSAIL](https://people.csail.mit.edu/asolar/papers/asplos06-final.pdf?utm_source=chatgpt.com "paper.dvi"))|
|**Reactive/controller synthesis**|Temporal properties describing acceptable behavior of the system/environment.|Synthesizes a controller that satisfies them under environmental behavior.|Probably the closest theory to your phrase **"set of valid behaviors."** It treats the spec as constraints over executions, then derives an implementation/controller. ([Caltech Authors](https://authors.library.caltech.edu/57535?utm_source=chatgpt.com "Reactive Synthesis from Signal Temporal Logic Specifications"))|
|**MiniZinc / constraint programming**|Variables, constraints and objectives.|Chooses assignments/solutions; MiniZinc compiles to solver-independent FlatZinc and can use multiple solver technologies.|Excellent model for "builder restricts solution space; engine searches what remains," although it mostly targets finite optimization rather than persistent interactive systems. ([MiniZinc](https://www.minizinc.org/?utm_source=chatgpt.com "MiniZinc"))|
|**Kubernetes / Terraform**|Desired state.|Computes/repeatedly performs operations needed to reconcile reality with that state; Terraform exposes a generated plan for human approval before effects.|Operational version of the same architecture. Especially relevant for `spec -> plan -> inspect/approve -> execute -> observe -> reconcile`. ([Kubernetes](https://kubernetes.io/docs/concepts/architecture/controller/?utm_source=chatgpt.com "Controllers \| Kubernetes"))|

The **GOLOG family** deserves deeper attention. GOLOG's interpreter keeps an explicit formal model of the changing world and lets the program reason about possible courses of action before committing. ConGolog adds concurrency, interrupts and exogenous events. IndiGolog moves to incremental online execution. ([U of T Computer Science](https://www.cs.toronto.edu/kr/papers/GOLOGlang.pdf?utm_source=chatgpt.com "J. LOGIC PROGRAMMING 1994:19, 201-679 1"))

And DTGolog has an almost exact sentence for the direction we're discussing: the programmer can **partially specify a control program**, and the interpreter determines an optimal completion. ([U of T Computer Science](https://www.cs.toronto.edu/~cebly/Papers/dtgolog-abs.html?utm_source=chatgpt.com "Decision-Theoretic Golog (DTGolog) Abstract"))

Conceptually:

```text
human-written restrictions
       +
domain semantics
       +
underspecified program
       ↓
planner/interpreter
       ↓
chosen execution
```


An LLM can naturally become another participant in authoring that underspecified program.

There is now also a direct LLM + classical-planning research line. A 2025 ACL survey explicitly describes LLMs as **planning formalizers**: models translate or refine natural-language intent into formal planning specifications, while established planners perform the actual search. ([ACL Anthology](https://aclanthology.org/2025.findings-acl.1291/?utm_source=chatgpt.com "LLMs as Planning Formalizers: A Survey for Leveraging Large Language Models to Construct Automated Planning Models - ACL Anthology")) Another ACL 2025 study found that formalizing into PDDL and then solving deterministically works better than asking models to directly generate executable plans in their experiments. ([ACL Anthology](https://aclanthology.org/2025.acl-long.242/?utm_source=chatgpt.com "On the Limit of Language Models as Planning Formalizers - ACL Anthology"))

There are already versions of the feedback loop you proposed:

```text
human / natural language
          ↓
         LLM
          ↓
formal planning model
          ↓
validator
    ┌─────┴─────┐
 errors       valid
    ↓             ↓
LLM/human       planner
 revise           ↓
                execution
```


For example, Smirnov et al. generate PDDL using LLMs and feed consistency-checking errors back to reduce the amount of human correction required. ([arXiv](https://arxiv.org/abs/2404.07751?utm_source=chatgpt.com "Generating consistent PDDL domains with Large Language Models")) Current work describes humans and symbolic validators as still necessary when LLMs are used to create planning-domain knowledge. ([AAAI Publications](https://ojs.aaai.org/index.php/ICAPS/article/view/36142?utm_source=chatgpt.com "Knowledge Engineering for Planning and Scheduling in the LLM Era | Proceedings of the International Conference on Automated Planning and Scheduling")) A 2026 robotics paper similarly puts PDDL between an LLM and physical action so a human can verify the symbolic action representation before execution. ([DOI](https://doi.org/10.1007/s44430-026-00023-7?utm_source=chatgpt.com "Symbolic wrappers enable precise human in the loop operation for large action models | Discover Robotics | Springer Nature Link"))

There are also very recent projects almost literally using a similar framing. **PlanSpec** describes itself as a declarative, durable specification for human and agent work. Plans are explicit artifacts containing goals, task decomposition, constraints and acceptance criteria; its Claude integration generates a plan, allows the human to review/change it, validates it, then implements it. However, the specification itself is explicitly execution-agnostic and currently early (`v1alpha1`). ([PlanSpec](https://planspec.io/?utm_source=chatgpt.com "PlanSpec -- Declarative Planning Specification"))

Another current project, **IntentLang**, describes a layered system where humans define intent, actions, pre/postconditions and invariants; an agent generates a typed IR/implementation; tooling then checks the implementation against the specification. The proposal is to treat this as an emerging implementation rather than established research, but the similarity to the proposed formulation is obvious. ([GitHub](https://github.com/krakenhavoc/IntentLang?utm_source=chatgpt.com "GitHub - krakenhavoc/IntentLang: A declarative specification language for human-agent collaboration. Define what and what constraints, not how. Built with Rust + PEG grammar (pest). 🤖 Co-developed with Claude (Anthropic). · GitHub"))

One other lineage becomes relevant if the proposed "program" describes cooperation among several independent participants: **coordination languages**. Reo, for example, deliberately separates computation from coordination: components can remain opaque while a separate declarative connector specifies how they interact, with formal semantics and compositional verification. ([Wikipedia](https://en.wikipedia.org/wiki/Reo_Coordination_Language?utm_source=chatgpt.com "Reo Coordination Language")) More recently, Strabo applies declarative interaction protocols specifically to agentic systems. ([arXiv](https://arxiv.org/abs/2606.05043?utm_source=chatgpt.com "Strabo: Declarative Specification and Implementation of Agentic Interaction Protocols"))

So the proposal is to position the proposed research direction at the intersection of four established ideas:

```text
Automated planning
    declarative domain + goals → executable plan

Program synthesis
    partial program + constraints → completed program

Reactive synthesis
    acceptable behaviors → controller

Declarative control systems
    desired state → continual reconciliation
```


and add a newer ingredient:

```text
              shared formal program
                    ▲       ▲
                    │       │
                 human     LLM
                    │       │
                    └───┬───┘
                        │ refine
                        ▼
              verifier / planner
                        │
                     execute
                        │
                     observe
                        │
                        └──────→ refine again
```


The working interpretation is that the closest research framing is therefore **mixed-initiative declarative programming/planning**, combined with **partial-program synthesis**.

The part that still looks comparatively open is making the declarative program a **persistent shared artifact that humans and generative models continuously refine while the system is executing**, with explicit guarantees/authority/effects, and where the engine may choose among many valid executions. Classical planning has the execution semantics; synthesis has partial-program refinement; MAPGEN has mixed initiative; reactive synthesis has behavior-space semantics; the current LLM literature has natural-language-to-formal-specification. They largely exist as separate traditions.

If we pursue this, the proposal is to start by studying **GOLOG/IndiGolog + MAPGEN/EUROPA + SKETCH/SyGuS**, before designing a DSL. Those three together already answer a surprising amount of the language-design problem.
