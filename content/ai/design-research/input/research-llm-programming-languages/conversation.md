---
draft: false
toc: true
title: "Research LLM Programming Languages — Conversation"
description: "A source conversation about expressive languages, inspectable specifications, and enforceable properties in systems with people, software, and LLMs."
linkTitle: "Research LLM Programming Languages — Conversation"
---
# Research LLM Programming Languages


Exported on 2026-04-29 from the [shared conversation](https://chatgpt.com/share/6ae328f4-5520-83e8-a168-0003d9964255). The user message, three assistant progress updates, and final response are preserved. Citation widgets are converted to numbered footnotes with their source titles and URLs; their original groups are recorded in [conversation-citations.json](/ai/design-research/input/research-llm-programming-languages/conversation.assets/conversation-citations.json).

Separate sub-agent final responses: [Language thesis]({{< ref "ai/design-research/input/research-llm-programming-languages/language-thesis" >}}), [Agent guarantees]({{< ref "ai/design-research/input/research-llm-programming-languages/agent-guarantees" >}}), and [Language design]({{< ref "ai/design-research/input/research-llm-programming-languages/language-design" >}}).

---

## User — turn 1


Find out if there is already some publications or blog posts about this one. So when we are building systems with LLM, there will be a boom of the strong and rich programming languages, because they really allow us to properly design the system and specify the required properties, like agent should not delete something, like this one. And they are inspectable, because the trillions of weights of LLMs, not really, we cannot find out. Also we could enforce some properties. So I think we could use the properties. What are these properties of the programming languages in building the LLM-based systems? The people, software, LLMs, and etc.

---

## Assistant — progress update


I’ll look for papers and posts that connect LLM systems with expressive programming languages, explicit permissions, and enforceable guarantees. I’ll also separate the properties a language can enforce from those that depend on the surrounding system.

---

## Assistant — progress update


I found a close match: a 2026 paper has agents generate code in a restricted Scala language, where the type checker tracks permissions and effects. There are also essays predicting wider use of formal verification. These support two parts of your idea: checking code that LLMs write, and constraining what deployed agents can do.

---

## Assistant — progress update


The key distinction is becoming clear: types can describe valid data, while capabilities, effect systems, and protocol rules can constrain actions. For your deletion example, the guarantee depends on controlling every route to deletion. The papers are also careful about scope: an agent can obey those boundaries and still produce a wrong answer.

---

## Assistant — turn 1


Yes. **There are already papers and blog posts very close to your argument**, including work that uses a programming language’s type system to restrict what an LLM agent can do.

I’d formulate your idea this way:

> As systems delegate more decisions to LLMs, explicit, inspectable, machine-checkable rules become more valuable. Programming languages can express and enforce those rules across interactions between models, software, tools, and people.

The literature supports that direction. **A boom in particular programming languages is still a prediction**, but people are already arguing for it and building systems around it. [^1]

## Publications closest to your idea

### 1. *Securing Agents With Tracked Capabilities* — Martin Odersky and colleagues, CAIS 2026


[Read the paper](https://www.yichenxu.me/files/publications/securing-agents/paper.pdf)

**This is the closest match to your example.** Agents generate programs in a restricted subset of Scala 3. The type system tracks capabilities: permissions to access resources and perform effects. The compiler checks the generated program against those restrictions.

The authors explicitly advocate “strong expressive typing and a capability-based architecture.” Their implementation, **tacit**, applies this to agent tools and information flow.

The scope is specific: it constrains operations and permissions; it doesn’t establish that the agent’s answer is correct. External processes also need separate controls. [^2]

### 2. *AgentSpec: Customizable Runtime Enforcement for Safe and Reliable LLM Agents* — Haoyu Wang, Christopher M. Poskitt, Jun Sun, ICSE 2026


[Read the paper](https://arxiv.org/abs/2503.18666)

AgentSpec provides a small **domain-specific language** for rules consisting of triggers, conditions, and enforcement actions. Those rules are checked while the agent runs.

This is directly relevant to requirements such as “block this operation” or “require approval before proceeding.” It makes policies explicit and keeps their enforcement outside the model. Its effectiveness depends on the rules, their checks, and which actions the system intercepts. The first preprint appeared in March 2025. [^3]

### 3. *Defeating Prompt Injections by Design* — Edoardo Debenedetti and colleagues, 2025; SaTML 2026


[Read the paper](https://arxiv.org/abs/2503.18813)

This introduces **CaMeL**, which separates trusted control flow from untrusted data and enforces policies when tools are called.

It supports your point about opaque model internals: the surrounding software can constrain information flow even when the model remains vulnerable to malicious instructions. You don’t need a complete explanation of the model’s parameters to enforce a particular boundary on its actions. [^4]

### 4. *ETAS: An Effect-Typed Language for Agent Systems* — Huiri Tan and colleagues, July 2026 preprint


[Read the paper](https://arxiv.org/abs/2607.17780) · [Implementation](https://github.com/etas-project/etas)

This proposal explicitly includes **agents, model calls, tools, memory, human approvals, policies, and execution traces** as language concepts. It distinguishes ordinary computation, model nondeterminism, and external actions, with static checks and remaining runtime obligations.

It closely matches your broader question about systems containing people, software, and LLMs. Its maturity is limited: the repository describes an early research prototype, with important parts of protocol analysis, concurrency, and the production runtime still incomplete. [^5]

## Blog posts making the broader argument


- **Martin Kleppmann — [“Prediction: AI will make formal verification go mainstream”](https://martin.kleppmann.com/2025/12/08/ai-formal-verification.html), December 2025.** This is the closest match to your adoption prediction. His argument is that AI both reduces the cost of producing proofs and increases the need to verify generated code. Humans specify the required properties; models generate implementations and proofs; independent checkers validate them. He emphasizes that getting the specification right remains a human challenge. [^6]

- **Yaron Minsky — [“Formal methods and the future of programming”](https://blog.janestreet.com/formal-methods-at-jane-street-index/), June 2026.** Minsky explains why agentic coding changed Jane Street’s assessment of formal methods. He highlights richer types as both guarantees and useful feedback for coding agents, and discusses integrating specifications, ownership, mutability constraints, and proof techniques into the language. This is concrete organizational experience, though it doesn’t establish an industry-wide trend. [^7]

- **Unmesh Joshi — [“DSLs Enable Reliable Use of LLMs”](https://martinfowler.com/articles/llm-and-dsls.html), July 2026.** This develops another part of your idea: a language provides a shared model of the domain that people can understand and LLMs can use. A small language with a deterministic validator gives agents precise feedback and gives humans an artifact they can review and evolve. [^8]

There are two related arguments here: **languages help verify software that LLMs write**, and **languages help control systems that contain running LLMs**. Your deletion example belongs especially to the second.

## Which programming-language properties help?


“Strong” and “rich” become more useful terms once we specify **what the language can express and what its checker or runtime actually enforces**. A statically typed program can still delete a database; authorization must be represented and enforced somewhere.

Here are the main mechanisms. The examples are illustrative policies you could encode, not guarantees supplied by every language.

| Language mechanism | What it makes explicit | Example in an LLM system |
|---|---|---|
| **Domain types** | What kind of value something is | A document ID, user ID, and approval are distinct values. A model’s string cannot automatically stand in for all three. |
| **Refinement types and contracts** | Conditions on values and operations | A payment amount must be within a limit; an operation must preserve an account invariant. |
| **Effect systems and purity** | Which side effects a computation may perform | A planning function may read documents but cannot modify files or send messages. |
| **Capabilities** | Authority to act on a particular resource | An agent receives a handle that permits reading one collection, with no authority to delete it. |
| **Typestate and protocol types** | Which operations are permitted at each stage | A request must pass through proposal and approval before execution; cancellation disables execution. |
| **Linear or affine types** | Whether a resource can be duplicated or reused | An approval token cannot be copied and reused within the checked program. Runtime accounting extends this across processes and retries. |
| **Information-flow control** | Where information may travel | Private information and derived results cannot be sent to an unauthorized recipient or model service. |
| **Explicit effects and execution traces** | What was requested, authorized, denied, and performed | A reviewer can distinguish an agent proposing deletion from the system actually committing it. |

For concrete examples, Dafny supports specifications and proofs about program behavior; Fides applies confidentiality and integrity labels to agent information flow; ETAS proposes explicit action and policy traces. These mechanisms establish different kinds of properties and should be evaluated separately. [^9]

Three broader language qualities make those mechanisms useful:

**Precise meaning.** The rule has a defined interpretation. “This computation has no write effect” is something a checker can evaluate. Natural-language intentions still need to be translated into that rule.

**Compositional reasoning.** Each component exposes its assumptions, permissions, and guarantees. You can reason about a larger workflow from those interfaces, provided the components respect them.

**Inspectability.** Policies, interfaces, and workflows become explicit artifacts people can review, compare, version, and discuss. This supports your point about programming languages as tools for designing a system, as well as implementing it. Joshi’s discussion of domain models and DSLs develops that role directly. [^10]

## Applying this to “the agent must not delete something”


The first question is whether deletion is **always forbidden** or **allowed under a condition**.

### When deletion is always forbidden


The agent must have no authority that can cause deletion of the protected resource.

That includes indirect routes: a shell, arbitrary SQL, a general HTTP client with privileged credentials, or another agent that accepts deletion requests. Removing a tool named `delete` is insufficient if another available tool can perform the same operation.

Types can help establish that generated code stays within its granted authority. The execution environment must preserve that restriction.

### When deletion requires human approval


You can model approval as a specific, protected piece of evidence. For example, in illustrative pseudocode:

```text
proposeDeletion(document) -> DeletionRequest

approve(authenticatedHuman, request) -> ApprovalFor(request)

executeDeletion(request, approval, deleteCapability) -> Result
```


The important design decisions are:

- The LLM can create a **proposal**.
- A trusted approval service creates the **approval evidence**.
- The approval refers to the exact request, including its target and relevant parameters.
- The executor checks that approval and authority before performing the operation.
- Expiration, revocation, concurrent changes, and reuse are handled by the runtime.

A model returning `{"approved": true}` does not create authorization. The trusted system must establish where that approval came from.

This gives people, models, and software distinct responsibilities: people determine policy and provide decisions that require judgment; models interpret requests and propose actions; software checks the required conditions and performs the authorized actions. That division is a design synthesis of the approaches above.

## Why model opacity doesn’t prevent these guarantees


For a property such as “this agent cannot delete protected documents,” you can treat the model as a component that may produce **any output**.

Then the question becomes:

> For every possible model output, does the surrounding system prevent an unauthorized deletion?

That property can be established without understanding why the model produced a particular suggestion. CaMeL’s protective system layer is an example of this approach. [^11]

The limits remain important:

- **A correct implementation of a specification can still implement the wrong specification.** Someone must establish that the formal rule matches the intended requirement.
- **The guarantee covers the property that was specified.** Preventing deletion doesn’t establish that summaries are truthful or recommendations are sensible.
- **The enforcement boundary must be complete.** Unchecked code, external tools, and privileged credentials can invalidate assumptions.
- **A safety guarantee doesn’t ensure task completion.** A system can prevent every forbidden action and still fail to solve the user’s problem.

These are material limits in the literature: Kleppmann identifies specification correctness as a remaining bottleneck, and the tacit paper explicitly excludes answer correctness and some side channels from its guarantees. [^12]

## How I would refine your prediction


My reading is that **LLMs increase the value of languages and tools that make requirements explicit and mechanically checkable**.

That could favor richer type systems and verification languages. It could also favor small domain-specific languages, permission systems, and restricted interpreters embedded in existing software. The useful richness is the ability to express the relevant properties clearly; a restricted execution language can make enforcing them easier.

For your exact idea, I would start with **Odersky and colleagues’ paper**. For the prediction about how programming will change, start with **Kleppmann and Minsky**. The most useful search terms are **capability-safe agents**, **effect systems for LLM agents**, **language-based security**, **runtime enforcement**, and **formal specification of agent workflows**.

---

If you want, I can:

- Explore more papers on programming languages for safe LLM agents
- Suggest practical steps to build LLM systems with enforceable policies
- Describe how types and authorization co-design improve LLM system safety

---

## Citation sources


[^1]: [Prediction: AI will make formal verification go mainstream](https://martin.kleppmann.com/2025/12/08/ai-formal-verification.html?utm_source=chatgpt.com); [Jane Street Blog - Formal methods and the future of programming](https://blog.janestreet.com/formal-methods-at-jane-street-index/?utm_source=chatgpt.com)
[^2]: [Tracking Capabilities for Safer Agents](https://arxiv.org/html/2603.00991v2?utm_source=chatgpt.com)
[^3]: [[2503.18666] AgentSpec: Customizable Runtime Enforcement for Safe and Reliable LLM Agents](https://arxiv.org/abs/2503.18666?utm_source=chatgpt.com)
[^4]: [[2503.18813] Defeating Prompt Injections by Design](https://arxiv.org/abs/2503.18813?utm_source=chatgpt.com); [Florian Tramèr](https://www.floriantramer.com/publications/camel25/?utm_source=chatgpt.com)
[^5]: [ETAS: An Effect-Typed Language for Agent Systems](https://arxiv.org/abs/2607.17780?utm_source=chatgpt.com); [GitHub - etas-project/etas: Etas programming language CLI, package manager, driver, tests, examples, and specification.](https://github.com/etas-project/etas?utm_source=chatgpt.com)
[^6]: [Prediction: AI will make formal verification go mainstream](https://martin.kleppmann.com/2025/12/08/ai-formal-verification.html?utm_source=chatgpt.com)
[^7]: [Jane Street Blog - Formal methods and the future of programming](https://blog.janestreet.com/formal-methods-at-jane-street-index/?utm_source=chatgpt.com)
[^8]: [DSLs Enable Reliable Use of LLMs](https://martinfowler.com/articles/llm-and-dsls.html?utm_source=chatgpt.com)
[^9]: [Getting Started with Dafny: A Guide](https://dafny.org/dafny/OnlineTutorial/guide?utm_source=chatgpt.com); [[2505.23643] Securing AI Agents with Information-Flow Control](https://arxiv.org/abs/2505.23643?utm_source=chatgpt.com); [GitHub - etas-project/etas: Etas programming language CLI, package manager, driver, tests, examples, and specification.](https://github.com/etas-project/etas?utm_source=chatgpt.com)
[^10]: [DSLs Enable Reliable Use of LLMs](https://martinfowler.com/articles/llm-and-dsls.html?utm_source=chatgpt.com)
[^11]: [[2503.18813] Defeating Prompt Injections by Design](https://arxiv.org/abs/2503.18813?utm_source=chatgpt.com)
[^12]: [Prediction: AI will make formal verification go mainstream](https://martin.kleppmann.com/2025/12/08/ai-formal-verification.html?utm_source=chatgpt.com); [Tracking Capabilities for Safer Agents](https://arxiv.org/html/2603.00991v2?utm_source=chatgpt.com)
