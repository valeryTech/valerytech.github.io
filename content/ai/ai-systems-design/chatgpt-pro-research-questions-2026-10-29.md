---
draft: false
toc: true
title: "Twenty research questions for ChatGPT Pro"
description: "Candidate research conversations grounded in the design-research notes and prototype observations, with prompts and suggested source attachments."
linkTitle: "Twenty research questions for ChatGPT Pro"
---

Submitted conversations are tracked in the ChatGPT Pro research conversation log.

Expanded attachment sets for all twenty questions are in the question-by-question source map. It links the broader notes, source conversations, paired critiques, and prototype records, and explains their relevance. For the existing conversations, use the additional-source packets and second questions, selected against the earlier uploads.

These are proposed conversations for selection. They develop questions across the existing twenty-problem prototype agenda rather than assigning one conversation to each directory. The emphasis is on concepts, explanations, useful distinctions, and what the prototypes should lead us to reconsider.

The source review covered the collection's introduction and research framing, the newer representations/composition/understanding synthesis, selected foundational and interaction notes and their critiques, the prototype agenda and handoffs, and recorded P01–P08 observations and next experiments. This was a focused reading, not an exhaustive audit of every source, implementation, or run. Prototype findings below are attributed to the saved records; no experiments were rerun for this document. External literature claims in the archive have not been independently verified here.

The original author questions, model-generated proposals, and subsequent editorial critiques are different voices. Both proposals and critiques remain open to challenge.

## Shared opening for a selected conversation


> I am developing a research program about systems in which people, generative models, and conventional software work together. Three interests connect it: how representations help construct ideas and programs; which properties survive composition and change; and how people develop understanding through the work. Better questions, explanations, or mental models can be valuable outcomes before anything is automated.
>
> Read the attached material as an evolving investigation. Distinguish the author's questions from generated proposals and later critiques. Examine the strongest version of each relevant idea, its alternatives, and its limitations. Treat prototype observations as bounded evidence and identify the assumptions needed to generalize them.
>
> Develop the question below through clear concepts, concrete examples, and counterexamples. Use formalism where it clarifies a relationship. When relating it to prior research, verify primary sources if search is available; identify source leads you cannot verify. Distinguish established results, your synthesis, and new conjectures. A useful conclusion may be a revised concept or a sharper question. Explain what further inquiry could distinguish the competing accounts.

For new conversations, use the common background and question-specific attachment set in the source map. The shorter source lists below preserve the original focused selections. Local links are preparation references; a ChatGPT conversation needs the actual files uploaded, selected from its library, or their relevant text pasted.

## 1. What could unify construction, composition, and understanding?


**Question:** Can the three interests support a coherent explanatory account, and where do they require different theories?

**Prompt:** The notes suggest that the same representation can guide construction, carry obligations for composition, and become an object through which people develop understanding. Examine what connects these roles. Is there a shared mechanism, a family resemblance, or simply a useful research agenda? Compare alternative accounts from programming languages, software design, and human sensemaking. Work through one example where the roles reinforce one another and another where they conflict. Identify what would be lost by studying them separately. Develop a defensible central research question and a small set of propositions, making clear which relationships are conceptual, formal, or empirical. Leave open whether a unified theory is the right outcome.

**Sources:** Research scope and hierarchy; critique of the earlier framing; purpose of the collection.

## 2. What makes a representation an instrument of construction?


**Question:** How does a representation change the useful next moves available to a person or model?

**Prompt:** Compare representations that record an answer, reject an invalid answer, and help someone construct an answer. What mechanisms might make an explicit gap, type, relationship, or diagnostic constructive? Distinguish information supplied, search-space restriction, attention guidance, and feedback timing. In the P02 repeated challenge, four trials per condition produced completion counts of 3/4, 4/4, 4/4, and 3/4; correct prose reasons sometimes accompanied the wrong requested action. Use this as a puzzle, without inferring a winner. Develop an account of useful construction that also captures discovering a missing question or revising an abstraction. Show how to distinguish the representation's contribution from better instructions or more informative feedback.

**Sources:** Program authoring and typed planning; P02 observations; P02 next experiment.

## 3. How do we discover which domain distinctions deserve to exist?


**Question:** When does a richer domain model improve reasoning, and when does it merely repackage the same checks?

**Prompt:** P01's guarded records and explicit domain objects agreed on the initial comparison cases. Both accepted a source proposal mislabeled as an observation. Examine what these results imply about domain meaning, representations, and checking. How should a builder discover distinctions such as observation versus interpretation, time period, population, or measurement unit? What would justify a distinction through its value in explanation, development, extension, or correction, even without better immediate error detection? Consider competing domain models and cases where formalizing a distinction creates false confidence. Develop a method of learning and revising the vocabulary from use, including how to identify the limits of the model's interpretation of its sources.

**Sources:** Domain semantics and operation contracts; domain-semantics comments; P01 observations.

## 4. How can formalization help people discover what they mean?


**Question:** How should intent and formalization develop together when the original question is unsettled?

**Prompt:** Treat formalization as part of inquiry. A person asks for the most reliable design, then discovers that interruption count, recovery time, readiness by a deadline, and preservation of data express different concerns. Develop an account of how examples, calculations, contradictions, and editable interpretations can change the question. P03 exposed operations that silently added objectives or dropped earlier requirements, even when the dialogue sounded reasonable. Distinguish clarification, adding a requirement, retracting one, and changing purpose. Explain how the interaction can preserve continuity while allowing a genuine change of mind, and what would count as progress when the result is a better question rather than a ranking.

**Sources:** Language intent and hybrid interaction; intent-agreement comments; P03 observations.

## 5. How can structured incompleteness preserve room for discovery?


**Question:** When should a difficulty lead to completing the work, obtaining evidence, changing the representation, or revising the goal?

**Prompt:** An empty field can expose a useful gap, but it can also imply that the designer already knows every relevant category. Compare missing values, missing evidence, undecided preferences, competing interpretations, and inadequacy of the vocabulary itself. What makes a partial representation meaningful without making its eventual completion compulsory? Develop examples in which filling a gap helps and in which it locks the inquiry into the wrong question. Explain how participants could recognize and move between repairing a candidate, extending the model, and reframing the problem. Relate the account to structured partial programs and exploratory human reasoning while being explicit about where the analogy stops.

**Sources:** P02 observations; P03 observations; sensemaking and epistemic action.

## 6. Under what conditions do constraints increase useful generativity?


**Question:** How can limiting local freedom increase what people can successfully build together?

**Prompt:** Make the proposed relationship between restriction and generativity precise enough to challenge. Distinguish the number of expressible programs, diversity of useful tasks, ease of independent extension, and dependable composition. P04's row-preserving interface admitted conversions but excluded useful aggregation that checked general code could perform. What did that restriction buy, and what did it cost? Define what “least restrictive sufficient constraints” could mean relative to a task family and chosen properties. Consider incomparable designs and avoid assuming a universal scalar measure. Develop a worked comparison in which a constraint enables new combinations, one in which it only obstructs work, and a way to learn from extensions unknown to the original designer.

**Sources:** Constrained generativity; constraint and composition models; P04 observations.

## 7. What does it mean to preserve meaning under composition?


**Question:** Which aspects of evidence, scope, assumptions, and uncertainty can survive combination by construction?

**Prompt:** Examine the gap between preserving fields and preserving what a result means. In P05's 13-case semantic challenge, composition checking accepted five of seven invalid candidates and rejected one of six valid candidates. A qualification field could be retained while the prose implied an unsupported conclusion; faithfully scoped prose could fail a required-field rule. Develop a precise account of what a composition must preserve, separating structural relations, source interpretation, and argumentative support. Compare a restricted claim language, richer relations, and semantic judgment. State where guarantees become conditional on interpretation and where restriction excludes legitimate expression. Explain how assumption failure should change the theory, rather than merely adding more special cases to the checker.

**Sources:** Constraint and composition models; P05 observations; P05 next experiment.

## 8. Can a component be substitutable independently of its use?


**Question:** Which obligations belong to a reusable component, and which emerge from the consumer's question?

**Prompt:** P06's independently developed retrieval adapter satisfied the public contract in seven default cases but omitted a rollback passage needed by one investigation; increasing selection capacity recovered it. Analyze what “acceptable replacement” should mean here. Separate faithful reporting of retrieved material, coverage of the supplied corpus, relevance, and sufficiency for a particular conclusion. Can a stable contract support unknown future consumers without anticipating every question? Compare behavioral refinement, consumer-specific requirements, and explicit negotiation of assumptions. Include lawful differences in ranking and incomplete information. Develop a replacement example that succeeds, one that fails despite conformance, and a principled account of what the boundary should communicate.

**Sources:** Semantic substrate builder method; P06 observations; P06 next experiment.

## 9. What should remain equivalent across languages and representations?


**Question:** Which observations define the same system when its code, proposal language, or user-facing representation changes?

**Prompt:** Develop a useful notion of equivalence for systems expressed as Python, Haskell, a restricted plan, or an editable view. Distinguish result equality, error behavior, effects, source relations, and explanations. P07 reports agreement between Python and Haskell on 49 original-byte cases, including a bounded evidence projection; arbitrary explanation prose remains outside that guarantee. What can such agreement establish, and how can both implementations agree on an inadequate model? Separate the implementation language, the language in which a model proposes work, and the representation a person sees. Explain which comparisons isolate a language feature and which compare complete system designs, including how development and revision costs could matter.

**Sources:** Language and formalism choices; P07 observations; P07 next experiment.

## 10. How can a builder derive boundaries from desired properties?


**Question:** How far can design proceed from a required property to suitable constraints and enforcement?

**Prompt:** Turn the proposed inverse problem—desired properties to sufficient constraints—into a credible design method. Determine what the builder must already know about behavior, observability, environment assumptions, and useful work. Compare construction rules, static checks, runtime validation, controlled effects, and human judgment through concrete examples. P08's trusted source selection recovered some useful public outputs blocked by whole-context propagation, while excluding another; the comparison also changed what information reached the model. Use this to examine how a boundary changes both guarantees and capability. Explain what can be derived, what remains a design judgment, and how counterexamples revise the boundary. Avoid assuming every application needs the same runtime or shared state.

**Sources:** Semantic substrate builder method; builder-method comments; P08 next experiment.

## 11. What makes an evidence-backed answer justified?


**Question:** What connects source material to a conclusion beyond having resolvable citations?

**Prompt:** Develop an account of support that distinguishes source authenticity, accurate extraction, entailment, contextual relevance, source reliability, and the adequacy of an inference. Work through genuine quotations that imply a misleading conclusion when combined, and a qualified conclusion supported by several imperfect sources. What should a representation expose so a person can inspect and improve the argument? Compare computation provenance with evidence-support relations, including qualifications and defeaters. Identify which obligations can be checked mechanically, which require domain judgment, and how a judgment should remain revisable. Explain the useful guarantees available even when truth and complete support cannot be established automatically.

**Sources:** Provenance and argumentation foundations; verification and acceptance; P09 handoff.

## 12. When has an investigation done enough to answer?


**Question:** How should evidence selection, unresolved questions, and resource limits determine the next step and stopping point?

**Prompt:** A bounded corpus still permits retrieval omissions, parsing failures, contradictory sources, and missed qualifications. Develop a model of investigation that keeps these conditions distinct from simple low confidence. Explain how selecting passages or structured relations changes what becomes answerable and how a person can discover an omission. Compare stopping because the information need is satisfied, because further inquiry has low expected value, and because a budget is exhausted. Include a question that cannot be answered from the available material and an answerable case where abstention would be excessive. Describe what a useful coverage record can establish and what it cannot, and derive actionable continuation choices from the unresolved conditions.

**Sources:** Bounded-corpus evidence synthesis; coverage critique; multi-representation retrieval; resource-aware investigation planning.

## 13. How should language, examples, and direct manipulation work together?


**Question:** Which interaction forms help people express, inspect, and revise complex intentions with manageable effort?

**Prompt:** Compare conversational interaction, persistent editable interpretations, familiar tables or diagrams, and interfaces assembled for a particular task. What should each form contribute, and how should a person move between them without losing meaning? Use a concrete investigation that changes halfway through. Examine discoverability, ambiguity, correction effort, stability, and the cost of learning a temporary interface. Distinguish selecting familiar components from generating a new interaction grammar. The prototypes' user feedback rejected abstract research terminology in ordinary task flows; account for that evidence without assuming every explicit representation is helpful. Develop principles for deciding what must remain visible and stable and what can be generated or hidden.

**Sources:** Language intent and hybrid interaction; generated workspaces and application composition; P03 observations.

## 14. What does it mean for collaboration to improve understanding?


**Question:** How can a system help someone develop a better explanation or mental model, including when no external task is completed?

**Prompt:** Develop a substantive account of understanding appropriate to this research. Distinguish seeing an explanation, agreeing with it, answering correctly with assistance, and being able to predict, challenge, revise, or transfer what was learned. Analyze how external representations and dialogue might contribute, including situations where fluent explanations or detailed traces create an illusion of understanding. Use an example in which the valuable outcome is recognizing why a question was mistaken. Compare possible research approaches that respect expertise, interpretation, and longer-term learning. Identify evidence for the proposed mechanism without reducing understanding to confidence, speed, or a single test score, and consider when a simple conversation could be as effective as a structured workspace.

**Sources:** Sensemaking and epistemic action; human-AI collaboration evaluation; evaluation comments.

## 15. What makes human–model–software work collaborative?


**Question:** How should initiative, information, execution, judgment, and responsibility be distributed and renegotiated?

**Prompt:** Examine collaboration among participants with different abilities, access, persistence, and responsibilities. The notes propose separating information, execution, judgment, and authority. Is that decomposition useful and sufficient? Work through a task where the best allocation changes after a surprising result and a handoff fails because an assumption was not communicated. Distinguish stored shared context from common ground that participants can actually use. Explain when joint work improves the outcome, when coordination costs dominate, and when individual work is preferable. Develop an account that allows a human, a model-backed process, and deterministic software to contribute differently without treating their roles as interchangeable or assuming every participant is an agent.

**Sources:** Joint activity and collaboration model; joint-activity comments; participant profiles and work allocation.

## 16. What remains valid when goals, sources, or methods change?


**Question:** How can an inquiry retain useful work while revising its purpose and assumptions?

**Prompt:** A source correction, a changed question, a new procedure, and a revised use of an answer affect prior work differently. Develop a notion of semantic dependence that explains when a result remains useful, needs qualification, needs rechecking, or must be recomputed. Compare this with ordinary computational dependency tracking. Use a case where an older computation finishes after the question changes and another where an earlier result becomes useful again under a later purpose. Include interruption and uncertain external effects to explain the limits of simply rerunning work. Derive a minimal account of continuity that distinguishes historical inspection, current applicability, replay of recorded results, and new execution without requiring an elaborate record for every interaction.

**Sources:** Program versions, runs, and results; history and revision comments; edits, runs, and result use; P17 handoff.

## 17. When should independent contributions be merged, compared, or kept in disagreement?


**Question:** What forms of collaboration benefit from convergence, and which require preserving alternative interpretations?

**Prompt:** Two contributors can make edits that combine cleanly while relying on incompatible assumptions. Conversely, a disagreement may be useful evidence about an unsettled problem. Develop an account of combining work that distinguishes syntactic conflict, inconsistent meaning, different purposes, and complementary perspectives. Use both a design investigation and collaborative text assembly: individually acceptable fragments may imply something new when combined. Explain what a merge must preserve, when automatic combination is appropriate, and when alternatives should remain visible. Connect formal coordination mechanisms with the human work of resolving disagreement without assuming that convergence establishes correctness or that agreement is always the desired outcome.

**Sources:** Composable investigation workspaces; collaborative writing and text assembly; P15 handoff.

## 18. When should a successful example become a reusable program?


**Question:** How can provisional model outputs help discover a procedure without becoming an unquestioned specification?

**Prompt:** Examine the proposed progression from candidate answers and examples to an executable contract and reusable program. Distinguish solving one instance, reproducing a witness, and learning behavior for a declared family of inputs. Use a maintenance-record transformation where a plausible example contains an error or hides an exception. What roles should independent domain obligations, counterexamples, and user interpretation play? Explain when a reusable procedure is preferable to another model call, taking account of synthesis, checking, maintenance, and changing conditions. Identify what the initial model outputs add beyond an ordinary specification, and when this approach is best understood as existing program synthesis rather than a distinct research contribution.

**Sources:** Behavioral compilation and specification; behavioral-compilation evaluation and failure modes; P18 handoff.

## 19. What can human interventions teach a system about future automation?


**Question:** How can corrections reveal reusable policies while preserving the context and purpose of the intervention?

**Prompt:** A person promotes a passage, changes a classification, rejects a proposal, or approves an answer. Explain how to distinguish a local repair, a preference, a missing domain rule, a temporary exception, and an independent review obligation. Develop a method for turning selected observations into candidate policies while retaining alternative explanations and disagreements. Address selective feedback: the system observes corrections to what it presented, which may hide better alternatives or unnoticed errors. Use an example where repeated corrections justify automation and another where they do not. Explain how the system should detect when the learned behavior no longer applies, and which forms of participation remain valuable even after a policy becomes dependable.

**Sources:** Exploratory pipeline design and progressive automation; inspectable pipeline workbenches; critique of automation conditions.

## 20. What research contributions can these prototypes credibly support?


**Question:** How should the program turn its examples, failures, and revisions into useful knowledge?

**Prompt:** Assess the research program using its actual evidence and conceptual aims. Distinguish a useful design vocabulary, a worked explanatory example, a mechanism claim, a formal result, an empirical effect, and a generalization. P01 found equal checked behavior across representations; P02's small repeated trial did not establish an advantage; P05 exposed semantic false acceptance; P06 showed contract conformance without task sufficiency; the human-role exercises used agents. What do these findings teach, and what competing explanations remain? Consider conceptual analysis and research through design alongside controlled studies. Propose two or three coherent contribution paths, the strongest question for each, and the next inquiry most likely to change the account. Identify synthesis value separately from claims of novelty.

**Sources:** Prototype agenda; P01–P08 next experiments and results; research method and claim validation; method critique. Add the relevant observations when examining a particular finding.

## Suggested first selection


Start with **1, 2, 6, 7, and 14** if the aim is to develop the conceptual foundations: the overall account, constructive representations, constrained generativity, preservation under composition, and human understanding. Question **20** can then reconsider the research agenda in light of those conversations.

For a closer analysis of existing prototype puzzles, select **3, 4, 7, 8, and 9**. For interaction and the development of understanding, select **4, 5, 13, 14, and 19**. These are alternative selections, not required sequences.

For each selected conversation, use the shared opening, its full prompt, and a focused set of attachments. Preserve the question number so later responses can be compared. The source lists identify preparation material; no ChatGPT conversations have been launched or files uploaded as part of drafting this list.

*Drafted with Codex from the local research collection and prototype records on 2026-10-29. These questions and suggested priorities are new proposals for the author's selection.*
