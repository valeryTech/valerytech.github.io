---
draft: false
toc: true
title: "Coupling and Modularity"
description: "Coupling as a design tool rather than a defect: Khononov's balanced coupling model (integration strength, distance, volatility), the connascence vocabulary behind it, and how it turns the laws of architecture into a rule for boundaries."
linkTitle: "Coupling and Modularity"
---

**TL;DR:** coupling is how components cooperate, so the aim is to put it in the right places, not to remove it. Three questions decide whether a dependency is healthy: how much knowledge it shares (**integration strength**), how far that knowledge travels (**distance**), and how often the shared part changes (**volatility**). Khononov's balance rule: a dependency is balanced when strength and distance are opposite (strong and close, or weak and far), or when the upstream component rarely changes.

```text
BALANCE = (STRENGTH XOR DISTANCE) OR NOT VOLATILITY
```

## Why this belongs with the laws


The [laws of software architecture]({{< ref "engineering/architecture/laws" >}}) say what kind of reasoning architecture needs. The coupling model is one place where that reasoning can be made concrete.

- **First law (everything is a trade-off):** decoupling has a cost. If everything were fully decoupled, nothing could communicate. *The Hard Parts* quotes Paracelsus: the dose alone makes the poison. Reuse is implemented through coupling, so reuse and decoupling trade against each other.
- **Third law (decisions sit on a spectrum):** "coupled or decoupled" is a false binary. Strength, distance, and volatility each vary along a scale.
- **Corollary 2 (you can't do it just once):** a balanced design does not stay balanced. New features, reorganizations, and business shifts move one dimension, and the others have to be adjusted. See [rebalancing](#rebalancing).
- **Second law (why over how):** the three dimensions give words for the why of a boundary in an ADR, for example: "strong functional coupling, kept inside one service because the logic is a core subdomain and changes often".

## What coupling is


- **Ford et al.:** two parts of a system are coupled if a change in one might cause a change in the other.
- **Khononov:** coupling comes from components sharing **knowledge**, a **lifecycle**, or both. The more knowledge they share, the more often they have to change together. Components with no shared knowledge can still be coupled through a shared lifecycle: they are built, tested, and deployed together.
- **Coupling is a tool.** A system is its components plus the interactions between them, and the interactions are what let the components achieve the system's goal. Khononov's first chapter argues against treating coupling as a synonym for bad design.

### Modularity and complexity


- **Modularity** manages how knowledge is distributed across modules. Its purpose is to let the system evolve toward future goals, so modular design needs a view of changes that have not yet been requested. Learning the business domain, its history of changes, and what competitors do builds that view.
- **Too much of a good thing:** a system flexible enough to absorb any change is overly complicated. The aim is a balance between rigid and overly flexible.
- **A module** has a function (its purpose), logic (its implementation), and a context (where and how it is meant to be used). An effective module can state its function without revealing its logic, and states its context explicitly rather than relying on assumptions. This builds on Ousterhout's deep modules.
- **Complexity** (Khononov, chapters 2-3), in Cynefin terms, is a situation where the outcome of an action can only be understood in hindsight. In design it comes from complex (non-linear) interactions between components, which can be global (between components) or local (inside one). Constraints reduce the degrees of freedom an interface exposes and so reduce the room for complex interactions.

## Vocabulary: three generations of coupling models


| Model | Origin | Levels | Use today |
| --- | --- | --- | --- |
| Module coupling | Structured design, 1970s | Content, common, external, control, stamp, data (strongest to weakest) | Spotting shared databases (common and external coupling), extra fields passed in data structures (stamp coupling), and dependence on internals (content coupling). |
| Connascence | Page-Jones, 1990s; popularized by Jim Weirich | Static: name, type, meaning, algorithm, position. Dynamic: execution, timing, value, identity. | Code review vocabulary, for example "this is connascence of meaning; turn it into connascence of name with a named constant". |
| Integration strength | Khononov 2025 | Intrusive, functional, model, contract | Combines the two earlier models and works at every scale, from methods to services. |

**Connascence in *Fundamentals* (chapter 3)** has three properties:

- **strength:** how hard the coupling is to refactor (static is preferable to dynamic, because tools can find and improve it);
- **locality:** how close the coupled modules are;
- **degree:** how many modules a change affects.

Page-Jones gives three guidelines: break the system into encapsulated elements, minimize the connascence that crosses encapsulation boundaries, and maximize connascence inside them. Weirich gives two rules:

- **Rule of Degree:** convert strong forms of connascence into weaker ones.
- **Rule of Locality:** as the distance between elements grows, use weaker forms of connascence.

The Rule of Locality is already the core of Khononov's balance rule.

**Not the same "distance":** *Fundamentals* chapter 3 also covers Robert Martin's metrics: afferent and efferent coupling, abstractness, instability, and "distance from the main sequence". That last metric measures how far a component is from the ideal balance of abstractness and instability. It has nothing to do with Khononov's distance, which measures how far shared knowledge travels.

## The three dimensions

### Integration strength: how much knowledge is shared


| Level | What the downstream depends on | Examples | Degree measured by |
| --- | --- | --- | --- |
| **Intrusive** (strongest) | Implementation details of the upstream that were never meant for integration | Reading another component's database tables, reflection on private members, patching a vendor system's source to add a missing hook | (all or nothing) |
| **Functional** | Knowledge of the business functionality itself: the modules implement closely related behavior | Sequential: operations must run in a set order. Transactional: operations must succeed or fail together. Symmetric: the same business logic is duplicated and must change in step. | Dynamic connascence |
| **Model** | The upstream's internal model of the business domain | An API or event that exposes the internal domain objects | Static connascence |
| **Contract** (weakest) | An integration-specific model designed to share as little as possible | A published API or event schema that hides the internal model | Static connascence |

Two consequences:

- **Duplicated business logic is strong coupling**, even with no call between the two copies: it is symmetric functional coupling. DRY is about knowledge, not text.
- **Asynchrony alone does not set the strength; what the message carries does.** An event with an integration-specific schema is contract coupling, and an event that dumps the producer's internal model is model coupling.

### Distance: how far the knowledge travels


- **Measure it by the closest common ancestor** of the two components. From near to far: methods of one object, objects in one package, different packages, different libraries, services in a distributed system, systems built by different vendors.
- **Cost of distance:** the farther apart the components, the more coordination a change across them takes: more codebases, reviews, releases, and teams.
- **Social distance counts:** different teams or organizations add distance even inside one codebase.
- **Asynchrony and distance:** asynchronous integration reduces lifecycle coupling, which increases distance. If the messages expose the producer's internal model, a change can then cost more than with a synchronous call, for example an intermediate consumer version that reads both the old and new message formats.
- **The cost of proximity:** being close creates lifecycle coupling. Components located together change, get tested, and get deployed together even when they are otherwise unrelated.

### Volatility: how often the shared part changes


- **Domain analysis:** core subdomains, where the business competes, are the most volatile. Supporting and generic subdomains change less. A legacy system that is no longer evolved hardly changes at all.
- **Source-control analysis:** change frequency in the history is a second signal.
- **Kinds of change:** solution changes, where the problem stays the same (bug fixes, refactoring and paying down technical debt, reorganizations that reshape the design through Conway's law), versus problem changes (new or changed requirements from the business).
- **Inferred volatility:** a component strongly integrated with a volatile one becomes volatile itself.

## Combining the dimensions


**Strength and distance** decide between modularity and complexity:

| | Low distance | High distance |
| --- | --- | --- |
| **Low strength** | Local complexity: unrelated things sit together, and the hosting module churns | Loose coupling |
| **High strength** | High cohesion | Global complexity: strong dependencies across far-apart parts |

```text
MODULARITY         = STRENGTH XOR DISTANCE
GLOBAL COMPLEXITY  = STRENGTH AND DISTANCE
LOCAL COMPLEXITY   = NOT STRENGTH AND NOT DISTANCE
```


**Pairs with volatility:**

- **Stability = NOT (VOLATILITY AND STRENGTH):** a dependency is stable if the upstream rarely changes or little knowledge is shared. This is the reuse rule from the [first law's corollary]({{< ref "engineering/architecture/laws" >}}#corollary-1-the-trade-off-you-havent-found-yet): share strongly only what is stable.
- **Cost of change = VOLATILITY AND DISTANCE:** changes are expensive when a volatile part is far away.
- **Maintenance effort = STRENGTH × DISTANCE × VOLATILITY:** if any one of them is low, the effort is low. Example: reading a legacy system's database is high strength over high distance, but the legacy system does not change, so the integration is acceptable.

**The balance rule:**

```text
BALANCE = NOT (COMPLEXITY AND VOLATILITY)
        = (STRENGTH XOR DISTANCE) OR NOT VOLATILITY
```


The two unbalanced combinations are complexity that keeps changing:

- high strength, high distance, high volatility: global complexity in a part that changes often;
- low strength, low distance, high volatility: local complexity in a part that changes often.

### Numeric version


Khononov warns that this is not an exact science: the values are judgment, and they change with the level of abstraction you look at. On a 1-10 scale:

| Value | Integration strength | Distance | Volatility |
| --- | --- | --- | --- |
| 1 | Contract | Methods of one object | Legacy system no longer evolved |
| 2 | | Objects in one package | |
| 3 | Model | 3-7: different packages | Supporting or generic subdomain |
| 8 | Functional | Different libraries | |
| 9 | Symmetric functional | Services in a distributed system | |
| 10 | Intrusive | Systems from different vendors | Core subdomain, or volatility inferred from one |

```text
MODULARITY = |STRENGTH - DISTANCE| + 1
BALANCE    = max(|STRENGTH - DISTANCE|, 10 - VOLATILITY) + 1
```

## Rebalancing


**Tactical changes** change how the system implements its functionality and fit the existing design. **Strategic changes** break the assumptions the design was built on, by moving one dimension:

- **Strength grows** as features add new integrations. In one of Khononov's cases, a "pause assignment" feature turned an asynchronous event integration between two services into one that needed strongly consistent data (transactional coupling) in a core, volatile subdomain. A synchronous API would still allow stale reads and would add runtime coupling. Merging the services would create local complexity. The team moved the feature into the consuming service, which reduced the distance.
- **Distance grows** through refactoring or reorganization, such as a team split or a module moved to another repository.
- **Volatility shifts** with the business, for example when a supporting subdomain becomes core.

The fix is to adjust another dimension: weaken the strength (introduce a contract, stop exposing the model), reduce the distance (move or merge functionality), or accept strong coupling where volatility is low. An imbalance that goes unnoticed becomes technical debt and accidental complexity. A few harmless-looking `if`s for an "edge case" can be a sign that the domain model has changed.

## The same rule at every scale


Khononov treats software design as a network that carries knowledge across interfaces. As functionality grows, complexity grows faster than the system does. His answer is **fractal modularity**: balance interactions at every level of abstraction, from methods and objects to modules, services, and systems.

His case studies (chapter 13) read familiar patterns as the same rule: microservices, bounded contexts, vertical slices, layered architecture, ports and adapters, event sourcing, aggregates, the single responsibility principle, and the interface segregation principle. He suggests applying it to event-driven architecture, DDD context mapping (open-host service, published language, anti-corruption layer), DIP, LSP, DRY, and the Law of Demeter.

## Same idea, other vocabularies


- **Ford et al., service scale:** *static coupling* is how parts are wired: dependencies, libraries, frameworks, operational requirements. *Dynamic coupling* is how they communicate at runtime, synchronously or asynchronously. An *architecture quantum* is an independently deployable artifact with high functional cohesion, high static coupling, and synchronous dynamic coupling, such as a well-formed microservice. In Khononov's terms, a quantum is a boundary drawn so that strong coupling stays inside it.
- ***Fundamentals*, component scale (chapter 8):** static coupling, temporal coupling, and the Law of Demeter, which limits how much a component knows about its collaborators' collaborators.
- **Modular monolith:** the boundaries are enforced inside one deployable unit. Lifecycle distance stays short, and contract-level strength between modules keeps the boundaries meaningful. See [boundaries]({{< ref "system-design/elements/boundaries" >}}#architectural-style) and Khononov's [The Golden Age of Modularity](https://vladikk.com/2025/03/30/golden-age-of-modularity/).
- **ETC (Thomas and Hunt):** decoupled code is easier to change. Balanced coupling says which coupling makes change hard. See [the essence of good design]({{< ref "engineering/architecture/toolbox" >}}#the-essence-of-good-design-etc).

## Applying it


Questions for any dependency, in a design review or an ADR:

1. **Strength:** what does the downstream need to know? Implementation details, shared business logic, the internal model, or only a contract?
2. **Distance:** what is the closest common ancestor? Same class, package, library, service, team, or vendor?
3. **Volatility:** is the upstream core, supporting, or generic? What does the change history say?
4. **Balance:** is strong coupling kept close, and is coupling across distance kept weak? If not, is the upstream stable enough that it does not matter?
5. **Drift:** which planned feature, reorganization, or business change could move one of the three?

Where it is already used in these notes:

- [Architecture style and service boundaries]({{< ref "system-design/elements/boundaries" >}}#where-to-draw-boundaries): the boundary heuristics.
- [Laws of Software Architecture]({{< ref "engineering/architecture/laws" >}}): the reuse, shared library, and queue-versus-topic examples are coupling trade-offs.
- [Design Pressure Toward Modularity]({{< ref "engineering/eng-exp/design-pressure" >}}): module boundaries for RAG and tool-calling systems, chosen by what must change and be tested independently.
- [Changeability]({{< ref "engineering/architecture/changeability" >}}).

## Gaps


- A worked example: score one real boundary on the numeric scale, then rebalance it.
- Examples of each connascence level in code, with the refactoring that weakens it.
- A closer mapping between Khononov's model and Ford's static and dynamic coupling and architecture quantum.

## Library sources


- [Khononov 2025](/sources/d01916d843bdf15a2ab54159c7c865bf.bin), *Balancing Coupling in Software Design* -- the model: Part I (coupling, complexity, modularity), Part II (module coupling, connascence, integration strength, distance, volatility), Part III (balance, rebalancing, fractal modularity, case studies)
- [Richards and Ford 2025](/sources/2d49b5a0c9a1eb1beeb05703a3d3d23e.bin), *Fundamentals of Software Architecture, 2nd Edition* -- chapter 3 (modularity: cohesion, coupling metrics, connascence), chapter 8 (component coupling), chapter 27 (reuse versus decoupling)
- [Ford et al. 2022](/sources/08f60e529d971e5ad6408c46accea44c.bin), *Software Architecture: The Hard Parts* -- chapter 2 (coupling definition, static and dynamic coupling, architecture quantum)

Further reading:

- [Ousterhout 2018](/sources/0a09675129a4612b2260dbb60c83b051.bin), *A Philosophy of Software Design* -- deep modules and information hiding
- [Thomas and Hunt 2020](/sources/afd55006a2d41c959c6eb8f3c81eb883.bin), *The Pragmatic Programmer, 2nd Edition* -- ETC, DRY as knowledge, "Decoupled Code Is Easier to Change"
- [Martin 2018](/sources/0f46f5de730b51708bc07368aedb47d5.bin), *Clean Architecture* -- component cohesion and coupling principles
