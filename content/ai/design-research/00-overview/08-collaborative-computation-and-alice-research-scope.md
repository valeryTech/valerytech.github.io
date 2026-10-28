---
draft: false
toc: true
description: "Separates coordination among existing humans, models, and programs from Alice: an artificial-universe research proposal that studies whether agency, cognition, and communication emerge from minimal conditions."
title: "08 Collaborative Computation And Alice Research Scope"
linkTitle: "08 Collaborative Computation And Alice Research Scope"
---
# Collaborative computation and Alice research scope


Editorial context, 2026-10-20: The questions, constraints, proposals, disagreements, and caveats below are reformulated from the saved research discussion. LLM recommendations remain attributed proposals, not decisions by the author or independently verified findings. Technical examples and quoted source passages retain their original wording.

<!-- Navigation added during reassembly on 2026-10-01. Source arguments are retained with editorial wording, 2026-10-20; quoted source passages remain exact. -->

The complete final reply below corrects an earlier connection between two research directions. Collaborative computation concerns coordination among existing participants. The Alice proposal concerns conditions under which agency and cognition might emerge. The distinction is retained as a scope discussion, not an adopted theory or runtime requirement.

The [preceding analysis and critique]({{< ref "ai/design-research/06-research-reports/12-multiagent-coordination-and-system-semantics" >}}) preserves the earlier connection. The [research hierarchy]({{< ref "ai/design-research/00-overview/06-research-scope-and-hierarchy" >}}) provides context for the collaboration branch. Sibling [comments]({{< ref "ai/design-research/00-overview/08-collaborative-computation-and-alice-research-scope-comments" >}}) explain the separate placement and limits.

## Alice


The earlier LLM analysis merged two research directions that should stay separate.

The Alice direction is much more fundamental. It is not "how should we make LLM agents better?" and not "how should we give an LLM a better world model?" It asks how to construct conditions under which genuinely new artificial intelligent beings could arise.

Current LLMs start very far downstream. They learn from traces produced by already existing intelligent, embodied, social humans and human culture. The research notes capture the inversion well:

```text
current LLM route

human world
→ human cognition
→ human society/culture
→ language and artifacts
→ training corpus
→ LLM
```


The model therefore receives something like a compressed historical surface of the products of intelligence. It doesn't itself go through the causal developmental path that produced those products. The related research notes make the same distinction as `human language -> infer an implicit model of the world`, while the Alice direction could be `world -> internal representation -> communication -> language`.

That is why adding an "agent loop" around an LLM doesn't solve the Alice problem. A normal agent loop serializes observations, tool calls, and previous outputs into context. The author's neuroscience notes correctly distinguish that from an entity whose body, memory, expectations, goals, relationships, and other internal states continue changing through time. A transcript gives ordered event memory; it does not intrinsically provide persistent dynamical time.

So the proposal is to keep two research programs explicitly separate.

The first is the one around `framework.md`:

```text
Existing capable participants
humans + LLMs + programs + tools

        ↓

How can they participate in
shared computation safely?

        ↓

state
authority
provenance
coordination
commitment
recovery
invariants
```


Here we don't care much how an LLM internally produces a proposal. It can remain an opaque component. This is a programming-languages / distributed-systems / HCI / coordination problem.

Alice asks almost the inverse question:

```text
Universe
↓
persistent processes
↓
individuality
↓
self-maintenance / viability
↓
perception ↔ action
↓
mattering
↓
agency
↓
learning / development
↓
prediction / simulation
↓
sociality
↓
communication
↓
language?
↓
reflection?
↓
self-created concepts / goals?
```


Here we care intensely about how the being itself comes to exist and develop.

And crucially, the question is not:

> What modules should Alice contain?

It is closer to:

> What minimal universe, organization, developmental mechanisms, and pressures make the emergence of increasingly rich cognition possible?

That is already stated quite cleanly in the author's construction notes: putting `LLM + JEPA + memory + planner` into the creature selects one very narrow region of possible minds. The stronger methodological principle is to put assumptions into the universe where possible and avoid placing the cognitive properties you want to explain into the initial creature.

This also explains why "world model" may be premature. If Alice begins with a JEPA-like world model, and later demonstrates predictive representation, we have largely built the result into the experiment. A stronger experiment creates partial observability, consequences, intervention possibilities, persistence, and costs where prediction is useful, then asks whether something functionally equivalent to a world model develops.

The same applies to many other properties:

```text
don't give:
    language
    self representation
    reflection
    explicit object ontology
    human concepts
    fixed goals
    social norms

construct conditions where some of these
could become useful

then observe what actually develops
```


The author's `phylosophy-constructing.md` pushes this even further. It suggests that you may not even want `agent` to be primitive. One possible universe begins with events, causal relations, transformations, resources, etc., and asks whether persistent structures, self-maintenance, agency and eventually cognition emerge.

The correction recognizes this as a much larger departure from contemporary "agentic AI" than the earlier LLM analysis acknowledged.

The basic object of Alice research therefore isn't an AI model. It is something like:

```text
U = artificial universe

within U:

processes
→ persistent organization
→ possible individuals
→ possible autonomous beings
→ possible cognition
```


And the object of study becomes the mapping:

```text
Universe conditions
+
initial substrate
+
development/evolution
+
history
        ↓
forms of possible cognition
```


That is why the research question about different universes is important. You can vary causality, locality, time, persistence, mortality, observability, resource structure, social dependence, perhaps even logic, and ask which cognitive structures recur. The research notes eventually formulate the very strong version:

> Which properties of mind are consequences of intelligence itself, and which are consequences of our particular universe?

That is a whole research direction in its own right.

It sits near Artificial Life, synthetic cognitive science, embodied/enactive cognition, open-ended evolution, developmental systems, emergent communication, neuroscience and philosophy of mind, but its unifying experimental object is different: **construct possible worlds and study which possible minds become instantiated in them.** The research notes already arrive at "synthetic study of possible cognition in artificial universes" as a reasonable academic description.

And this means the Anthropic paper should probably not be connected directly to Alice at all.

Anthropic is studying:

```text
LLM capability
+
agent scaffold
+
environment
+
multiple copies
→ interaction phenomena
```


Alice is studying something closer to:

```text
universe
+
minimal generative conditions
→ ?
```


If something that deserves the name `agent`, `language`, `reflection`, `society`, or even `intelligence` appears downstream, that is the result.

There is one later connection. If Alice eventually produces multiple persistent autonomous beings, then coordination, institutions, trust, norms, authority and culture become endogenous phenomena of that universe. At that point Anthropic-like questions become relevant--but you can ask the much deeper question of whether these mechanisms **emerge**, how they emerge, and which environmental conditions produce them.

So the revised proposal is to keep the research map as two major independent branches:

```text
                       YOUR RESEARCH
                       /           \
                      /             \
                     /               \
    Collaborative computation       Alice

    existing participants           possible beings
    ↓                               ↓
    shared semantics                artificial universes
    ↓                               ↓
    coordination                    individuality
    authority                       viability
    provenance                      agency
    effects                         development
    contracts                       cognition
    durability                      language
                                    reflection
                                    culture
```


They share an interest in systems, state, time, interaction and emergence, but they ask fundamentally different questions.

The Alice branch is closer to **constructing and experimentally studying new forms of intelligent existence** than to improving current AI agents. That distinction should stay explicit in the research notes.
