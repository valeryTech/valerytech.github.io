---
draft: false
toc: true
title: "Layer 0 Natural Language Properties"
linkTitle: "Layer 0 Natural Language Properties"
---
# Natural-Language Properties: A Linguistic and Semantic Taxonomy

## Purpose


This document organizes important properties of natural language from a linguistic and semantic point of view. The focus is on how natural language differs from programming languages, formal languages, and APIs.

The document intentionally excludes AI-system-design mechanisms, implementation patterns, agent architecture, tool-use policies, and engineering solutions. The goal here is to describe the linguistic phenomena themselves and their relationships.

## Core thesis


Natural language is not simply an imprecise version of a programming language. It is a different kind of communicative system.

Programming languages and APIs are designed around explicitness, determinism, stable reference, and well-defined execution semantics. Natural language is designed around situated communication: speakers rely on context, shared background knowledge, pragmatic inference, social convention, and conversational repair.

A compact contrast:

| Dimension | Programming languages / APIs | Natural language |
|---|---|---|
| Reference | Explicit identifiers | Contextual expressions, pronouns, deixis |
| Meaning | Defined by formal semantics or schema | Interpreted through semantics, context, and pragmatics |
| Missing information | Usually invalid or rejected | Often normal and recoverable |
| Ambiguity | Usually an error | Often manageable or even useful |
| Context | External to the syntax unless explicitly modeled | Central to interpretation |
| Intent | Encoded as explicit operation | Inferred from utterance, context, and situation |
| Interaction | Usually transactional | Often incremental, corrective, and collaborative |
| Social meaning | Mostly absent | Often structurally important |

## 1. Foundational linguistic layers


Before grouping the properties, it helps to separate several layers of linguistic meaning.

### 1.1 Syntax


Syntax concerns the structure of an expression: word order, grammatical relations, phrase structure, and well-formedness.

Example:

> "Move the meeting to tomorrow."

This is syntactically well-formed. It has an imperative structure, a verb phrase, an object, and a temporal modifier.

In programming languages, syntax is usually rigid and formally specified. A syntactic error prevents interpretation or execution.

### 1.2 Semantics


Semantics concerns conventional meaning: what words, phrases, and sentences contribute independently of a specific conversational situation.

Example:

> "tomorrow" conventionally means the day after the relevant reference day.

However, even this semantic content is not fully interpretable without context: we still need to know the relevant date and timezone.

### 1.3 Pragmatics


Pragmatics concerns intended meaning in context: what the speaker is doing with the utterance and what should be inferred beyond literal content.

Example:

> "Can you send this to Anna?"

Literally, this is a question about ability. Pragmatically, it is usually a request.

### 1.4 Discourse


Discourse concerns meaning across multiple sentences, turns, paragraphs, or conversational moves.

Example:

> "Find three options. The second one looks best. Make it cheaper."

The phrase "it" depends on a previous result. The instruction "make it cheaper" modifies an ongoing task rather than starting a new independent sentence-level interpretation.

### 1.5 Social and interactional meaning


Natural language also carries signals about politeness, certainty, authority, urgency, hesitation, preference strength, and interpersonal stance.

Example:

> "Maybe we should avoid changing the public API."

This is not merely a statement about an API. It encodes uncertainty, caution, recommendation strength, and possibly a constraint.

## 2. Group A: Indeterminacy of meaning


Indeterminacy covers cases where an expression does not map cleanly to one exact interpretation. These phenomena challenge the assumption that every input has a single precise meaning.

Group A includes:

1. Ambiguity
2. Vagueness
3. Underspecification
4. Prototype-based categories
5. Metaphor

### 2.1 Ambiguity


Ambiguity occurs when an expression has more than one discrete interpretation.

Example:

> "Book a table."

Possible interpretations:

| Expression | Possible meaning |
|---|---|
| "book" | reserve, record, purchase |
| "table" | restaurant table, furniture, database table, spreadsheet table |
| Whole utterance | reserve a restaurant table, buy a table, create a table in a document/database |

Ambiguity can occur at several levels.

#### Lexical ambiguity


A single word has multiple meanings.

Examples:

| Word | Possible meanings |
|---|---|
| "bank" | financial institution, river edge |
| "table" | furniture, data structure, chart |
| "file" | document, folder-like record, legal submission, tool action |
| "run" | execute code, operate, move quickly, manage |

#### Syntactic ambiguity


A sentence structure allows multiple parses.

Example:

> "I saw the man with the telescope."

Possible interpretations:

1. I used a telescope to see the man.
2. I saw a man who had a telescope.

#### Scope ambiguity


A modifier or operator may apply to different parts of the sentence.

Example:

> "Email all managers and engineers in Berlin."

Possible interpretations:

1. Email all managers, plus engineers who are in Berlin.
2. Email managers and engineers who are both in Berlin.

#### Referential ambiguity


A referring expression could point to more than one entity.

Example:

> "Send it to Alex."

Ambiguities:

- Which item is "it"?
- Which Alex?
- Send by which channel?

### 2.2 Vagueness


Vagueness occurs when a term has fuzzy boundaries rather than a fixed exact threshold.

Examples:

| Vague term | Unclear boundary |
|---|---|
| "soon" | How soon? Minutes, hours, days? |
| "cheap" | Cheap relative to what market or budget? |
| "nearby" | How far counts as nearby? |
| "simple" | Few lines? Low conceptual complexity? Easy to maintain? |
| "senior" | Years of experience? Scope? Autonomy? Impact? |
| "fast" | Low latency? Short delivery time? High throughput? |

Vagueness differs from ambiguity.

| Phenomenon | Question it raises | Example |
|---|---|---|
| Ambiguity | Which meaning? | "table" as furniture or data table |
| Vagueness | Where is the boundary? | "nearby" as within 5, 10, or 30 minutes |

Vague terms are often gradable. Something can be somewhat cheap, very cheap, relatively cheap, cheap for Tokyo, or cheap compared with competitors.

### 2.3 Underspecification


Underspecification occurs when an utterance leaves out information that may be needed for a fully explicit interpretation.

Example:

> "Schedule a meeting with Alex."

Missing information may include:

| Missing detail | Possible issue |
|---|---|
| Which Alex? | Multiple people may match |
| Date | Not specified |
| Time | Not specified |
| Duration | Not specified |
| Topic | Not specified |
| Medium | In person, phone, video call, async? |
| Location | Physical or virtual? |

Underspecification is normal in natural language because speakers often rely on context, defaults, shared routines, and follow-up interaction.

In a programming-language or API context, omitted required parameters usually cause a validation error. In natural language, omission may be intentional, efficient, or socially expected.

### 2.4 Prototype-based categories


Many natural-language categories are not defined by strict necessary-and-sufficient conditions. Instead, they are organized around prototypes: central, typical examples of a category.

Example:

> "Find startup-like companies."

There may be no strict definition of "startup-like," but the phrase suggests a cluster of features:

- relatively young company
- growth-oriented
- technology-oriented
- venture-backed or venture-style
- experimental product culture
- relatively informal operating style
- high uncertainty
- high upside

Another example:

> "Make the design feel more enterprise."

This may imply:

- more formal visual tone
- stronger information density
- clearer compliance/security signals
- conservative color choices
- administrative workflows
- role-based access and permissions

Prototype-based meaning differs from formal classification. A database schema might require a value like:

```text
company_type = "startup"
```


Natural language often works with resemblance:

> "This feels more like a startup than an enterprise vendor."

### 2.5 Metaphor


Metaphor uses one conceptual domain to structure another.

Examples:

| Metaphor | Likely meaning |
|---|---|
| "This code is brittle." | It breaks easily under change |
| "The UI feels heavy." | It feels visually dense, slow, or overloaded |
| "The argument has holes." | It contains weaknesses or missing support |
| "The project is blocked." | Progress is prevented by dependency or obstacle |
| "The architecture is clean." | The structure is coherent, separable, understandable |
| "The team is underwater." | The team is overloaded |

Metaphor is not ornamental only. It is often a normal way of reasoning and communicating. Technical domains also use metaphor constantly: threads, locks, queues, pipelines, memory, garbage collection, parent/child processes, deadlocks, branches, forks, roots, leaves.

### 2.6 Summary of Group A


| Property | Main issue | Example |
|---|---|---|
| Ambiguity | Multiple discrete meanings | "Book a table" |
| Vagueness | Fuzzy boundaries | "soon", "cheap", "nearby" |
| Underspecification | Missing details | "Schedule a meeting" |
| Prototype categories | Category by resemblance | "startup-like" |
| Metaphor | Cross-domain meaning | "brittle code" |

These phenomena all show that natural-language meaning is often non-exact, graded, partial, or multiply interpretable.

## 3. Group B: Context dependence


Context dependence covers cases where an expression cannot be interpreted from the sentence alone. Its meaning depends on the speaker, addressee, time, place, previous discourse, shared knowledge, or current situation.

Group B includes:

1. Implicit context
2. Deixis
3. Coreference
4. Ellipsis
5. Presupposition

### 3.1 Implicit context


Implicit context is unspoken background information that speakers assume is available.

Example:

> "Do it like last time."

This utterance requires several contextual facts:

| Expression | Required context |
|---|---|
| "it" | The current task or object |
| "like" | Which properties should be repeated? |
| "last time" | Which prior event or action? |

Implicit context may come from:

- previous conversation
- shared work history
- visible interface state
- current document or object
- user preferences
- organizational conventions
- physical environment
- cultural assumptions
- task history

Implicit context is not a small edge case. It is one of the central features of natural language.

### 3.2 Deixis


Deixis refers to expressions whose interpretation depends on the situation of utterance.

Common deictic categories:

| Type | Examples | Depends on |
|---|---|---|
| Person deixis | I, you, we, they | speaker and addressee |
| Time deixis | now, today, tomorrow, later | time of utterance |
| Place deixis | here, there, nearby | location or spatial frame |
| Discourse deixis | this, that, the above, the former | surrounding discourse |
| Social deixis | sir, professor, Your Honor | social roles and relations |

Examples:

> "I need this by tomorrow."

Interpretation requires:

| Expression | Context needed |
|---|---|
| "I" | speaker identity |
| "this" | current object, document, task, or issue |
| "tomorrow" | date relative to the utterance time |

Programming languages usually avoid deictic expressions unless they are explicitly bound to runtime variables such as `currentUser`, `now`, or `selectedObject`.

### 3.3 Coreference


Coreference occurs when multiple expressions refer to the same entity.

Example:

> "Sarah sent the contract yesterday. She said it was ready. Forward it to legal."

Coreference links:

| Expression | Referent |
|---|---|
| "Sarah" | Sarah |
| "She" | Sarah |
| "the contract" | contract document |
| first "it" | contract document |
| second "it" | contract document |
| "legal" | legal team or legal contact |

Coreference can be easy or difficult depending on how many candidate referents exist.

Example with ambiguity:

> "Anna sent Maria the report after she revised it."

Possible questions:

- Who revised the report: Anna or Maria?
- What does "it" refer to: the report or something else?

Coreference is one reason natural-language interpretation is discourse-sensitive rather than sentence-isolated.

### 3.4 Ellipsis


Ellipsis occurs when part of an expression is omitted because it can be recovered from context.

Example:

> "Find flights to Berlin. Cheapest, not fastest."

The second sentence omits much of the full structure:

> "Find the cheapest flights to Berlin, not the fastest flights to Berlin."

Other examples:

| Elliptical expression | Recovered meaning |
|---|---|
| "Same as before." | Use the same settings/procedure as before |
| "Only the urgent ones." | Filter previous set to urgent items |
| "Not Friday -- Monday." | Replace Friday with Monday |
| "With more examples." | Revise the previous output to include more examples |
| "Alex too." | Add Alex to the relevant set |

Ellipsis is efficient because speakers do not need to repeat shared or recently mentioned material.

### 3.5 Presupposition


A presupposition is background information that an utterance assumes to be true.

Example:

> "Cancel my next meeting with Anna."

Presuppositions:

1. The speaker has meetings.
2. There is at least one upcoming meeting with Anna.
3. One of them is the next such meeting.
4. The speaker has authority or ability to cancel it.

Another example:

> "Stop sending weekly reports to the client."

Presuppositions:

- Weekly reports are currently being sent.
- There is a relevant client.
- The sending can be stopped.

Presuppositions are different from direct assertions. If someone says:

> "The current CEO of the company is leaving."

The sentence asserts that the CEO is leaving, while presupposing there is a current CEO and a relevant company.

### 3.6 Relationship inside Group B


Implicit context is the broadest category. Deixis, coreference, ellipsis, and presupposition are specific ways natural language depends on context.

A useful structure:

```text
Context dependence
├── Implicit context: unspoken background assumptions
├── Deixis: meaning anchored to speaker, time, place, or discourse
├── Coreference: different expressions point to the same entity
├── Ellipsis: omitted material recovered from context
└── Presupposition: background facts treated as already true
```

### 3.7 Summary of Group B


| Property | Main issue | Example |
|---|---|---|
| Implicit context | Meaning relies on unspoken background | "Do it like last time" |
| Deixis | Meaning anchored to speaker/time/place/discourse | "this", "here", "tomorrow" |
| Coreference | Multiple expressions refer to same entity | "Sarah... she... it" |
| Ellipsis | Omitted material recovered from context | "Cheapest, not fastest" |
| Presupposition | Assumed background facts | "Cancel my next meeting" |

Group B shows that natural language is not self-contained. Meaning is often distributed across the utterance, the situation, and prior discourse.

## 4. Group C: Pragmatic meaning and speaker intent


Pragmatics concerns what the speaker intends to accomplish with an utterance in context. It goes beyond conventional sentence meaning.

Group C includes:

1. Pragmatics in the broad sense
2. Speech acts
3. Implicature
4. Relevance filtering
5. Politeness and indirectness
6. Modality

### 4.1 Pragmatics in the broad sense


Pragmatics studies meaning as use: how people infer intended meaning from context, shared assumptions, communicative goals, and social norms.

Example:

> "Can you open the window?"

Literal semantic content:

> Are you able to open the window?

Pragmatic interpretation in most contexts:

> Please open the window.

The same surface form can perform different pragmatic functions depending on context.

Example:

> "You finished the report?"

Possible functions:

| Context | Function |
|---|---|
| neutral check-in | question |
| surprised tone | expression of surprise |
| manager asking before deadline | status request |
| skeptical tone | challenge |
| after seeing poor quality | criticism |

### 4.2 Speech acts


A speech act is an action performed through language.

Common speech acts:

| Speech act | Example |
|---|---|
| Request | "Please send the document." |
| Command | "Send the document now." |
| Question | "Did you send the document?" |
| Promise | "I'll send it tonight." |
| Warning | "This might break production." |
| Suggestion | "We could simplify this." |
| Apology | "Sorry for the delay." |
| Refusal | "I can't approve this." |
| Correction | "No, I meant the other branch." |
| Confirmation | "Yes, that version." |

In formal systems, operation type is usually explicit. In natural language, speech act type is inferred from form, context, tone, relationship, and task state.

### 4.3 Implicature


Implicature is meaning that is suggested or implied rather than directly stated.

Example:

> "It's getting late."

Possible implicatures:

| Context | Implied meaning |
|---|---|
| meeting | We should wrap up |
| dinner | We should leave soon |
| work session | We should stop for today |
| travel | We should hurry |
| child bedtime | It is time to start bedtime routine |

Another example:

> "Some of the tests passed."

This may imply that not all tests passed, even though the literal statement is compatible with all tests passing. The implication arises from conversational expectations: if all tests passed, the speaker would likely have said so.

### 4.4 Relevance filtering


Relevance filtering is the process by which listeners select the interpretation that is most relevant to the current context.

Example:

> "Is John available tomorrow?"

Possible meanings of "available" include:

- available for a meeting
- available for work
- available by phone
- available emotionally
- available as a contractor
- available in a calendar system

In a work scheduling context, the relevant interpretation is usually:

> Is John available for a meeting tomorrow?

Natural language permits many theoretical interpretations, but humans normally do not enumerate all of them. They select contextually relevant meanings.

### 4.5 Politeness and indirectness


Politeness and indirectness allow speakers to soften commands, avoid face-threatening acts, signal uncertainty, or preserve social relations.

Examples:

| Surface form | Likely intent |
|---|---|
| "Could you maybe make this shorter?" | Make this shorter |
| "I wonder if we should reconsider this part." | This part may need revision |
| "This might be a little too direct." | Soften the tone |
| "Do you have a minute?" | I want to ask for help or attention |
| "Maybe not the strongest argument." | This argument is weak |

Indirectness matters because literal interpretation can be misleading.

Example:

> "Could you send me the file?"

This is usually not a question about ability. It is a request.

### 4.6 Modality


Modality expresses possibility, necessity, permission, obligation, likelihood, and certainty.

Examples:

| Modal expression | Meaning type |
|---|---|
| "must" | obligation or necessity |
| "should" | recommendation or weak obligation |
| "may" | permission or possibility |
| "can" | ability or permission |
| "could" | possibility, ability, politeness |
| "might" | uncertainty or possibility |
| "probably" | likelihood |
| "definitely" | high certainty |
| "don't have to" | lack of obligation |
| "must not" | prohibition |

Modality affects how strongly an utterance constrains interpretation.

Compare:

| Utterance | Strength |
|---|---|
| "Do not change the public API." | strong prohibition |
| "Try not to change the public API." | preference, weaker constraint |
| "Maybe avoid changing the public API." | tentative recommendation |
| "You can change the public API if needed." | permission with condition |

### 4.7 Relationship between pragmatics and implicit context


Pragmatics and implicit context are closely related, but they are not the same.

A useful distinction:

```text
Implicit context supplies background information.
Pragmatics uses that background to infer speaker intent.
```


Example:

> "It's cold in here."

Semantic content:

> The temperature in this place is low.

Possible pragmatic interpretations:

| Context | Likely intended meaning |
|---|---|
| smart home | Increase the temperature |
| car with open window | Close the window |
| meeting room | Adjust thermostat |
| casual conversation | Complaint or observation |
| medical context | Check patient comfort |

The utterance itself does not explicitly command any action. Context makes a pragmatic interpretation more likely.

### 4.8 Summary of Group C


| Property | Main issue | Example |
|---|---|---|
| Pragmatics | Intended meaning in context | "Can you open the window?" |
| Speech acts | Action performed through language | request, warning, correction |
| Implicature | Implied but unstated meaning | "Some tests passed" |
| Relevance | Contextually useful interpretation | "Is John available?" |
| Politeness/indirectness | Socially softened meaning | "Could you maybe..." |
| Modality | Possibility, obligation, certainty | must, should, might |

Group C shows that natural language is not merely about what is said. It is also about what is meant, implied, requested, suggested, permitted, forbidden, or socially negotiated.

## 5. Group D: Discourse and conversational structure


Discourse phenomena concern meaning across larger stretches of language: multiple sentences, turns, paragraphs, revisions, and interaction sequences.

Group D includes:

1. Discourse structure
2. Repair and correction
3. Mixed initiative
4. Redundancy and emphasis
5. Incremental refinement

### 5.1 Discourse structure


Discourse structure concerns how parts of a text or conversation relate to each other.

Examples of discourse relations:

| Relation | Example |
|---|---|
| Sequence | "First explain the problem, then propose a fix." |
| Contrast | "The approach is simple, but it is inefficient." |
| Cause | "The service failed because the token expired." |
| Elaboration | "The issue is authentication. Specifically, refresh tokens are not rotated." |
| Condition | "If the build passes, deploy it." |
| Exception | "Use the default behavior, except for admin users." |
| Correction | "Not the staging branch -- the production branch." |
| Summary | "In short, the migration is risky." |

Natural language often uses discourse markers:

- however
- therefore
- because
- although
- first
- then
- instead
- actually
- for example
- in short
- except
- unless

These markers guide interpretation across clauses and turns.

### 5.2 Repair and correction


Repair occurs when a speaker fixes, revises, or clarifies a previous utterance.

Examples:

| Utterance | Function |
|---|---|
| "No, I meant next Friday." | correction |
| "Actually, use the other file." | revision |
| "Not Sarah from finance -- Sarah from legal." | disambiguation |
| "Sorry, I meant Berlin, not Bern." | lexical correction |
| "Let me rephrase that." | self-repair |

Repair is central to natural conversation. Speakers often do not formulate the final intended meaning in one pass. Meaning is negotiated and corrected over time.

Programming languages generally do not have conversational repair as part of the language itself. One replaces or edits code. In natural language, repair is part of the interaction.

### 5.3 Mixed initiative


Mixed initiative means that either participant can guide the direction of the conversation.

Example:

> User: "Help me compare these options."
> Other participant: "Do you care more about cost, risk, or speed?"
> User: "Risk first."

In many formal interfaces, the user must provide a complete command. In natural conversation, the participants can collaboratively determine the next relevant move.

Mixed initiative appears in:

- clarification questions
- suggestions
- objections
- reframing
- prioritization
- topic shifts
- negotiation of criteria

### 5.4 Redundancy and emphasis


Natural language often repeats or restates information. This is not necessarily noise. It may signal importance, urgency, contrast, or emotional force.

Example:

> "I need this today, before end of day, ideally by 5."

The deadline is expressed redundantly. The repetition reinforces urgency and priority.

Other examples:

| Expression | Possible function |
|---|---|
| "Really, really important" | emphasis |
| "No changes to the API -- none." | strong prohibition |
| "Today, not tomorrow." | contrast and urgency |
| "The main issue, the real issue, is trust." | focus |
| "Keep it simple. Very simple." | priority weighting |

Formal languages often avoid redundancy. Natural language uses redundancy for robustness, emphasis, and social signaling.

### 5.5 Incremental refinement


Incremental refinement occurs when a speaker gradually narrows, revises, or extends an earlier request or description.

Example:

> "Find laptops under $1500."
> "Only 14-inch ones."
> "With 32GB RAM."
> "Actually, prioritize battery life."

Each turn modifies the previous search space. The later utterances are elliptical and context-dependent.

Incremental refinement is common because users often discover their criteria while interacting. Natural language supports this naturally.

### 5.6 Summary of Group D


| Property | Main issue | Example |
|---|---|---|
| Discourse structure | Relations between clauses/turns | first, then, however, unless |
| Repair/correction | Revising previous meaning | "No, I meant next Friday" |
| Mixed initiative | Shared control of interaction | "Risk, cost, or speed?" |
| Redundancy/emphasis | Repetition as signal | "Today, before EOD" |
| Incremental refinement | Gradual narrowing or revision | "Only 14-inch ones" |

Group D shows that natural language is dynamic. Meaning develops across turns rather than appearing only as isolated complete commands.

## 6. Group E: Social and communicative framing


Social and communicative framing covers signals about the speaker's stance, certainty, authority, emotional positioning, relationship to the listener, and strength of commitment.

This group overlaps with pragmatics, but it is useful to separate because these signals affect how an utterance should be understood socially, not merely propositionally.

Group E includes:

1. Politeness and face management
2. Epistemic stance
3. Affective stance
4. Authority and obligation
5. Urgency and priority
6. Commitment strength

### 6.1 Politeness and face management


Natural language often protects the social position of speaker and listener. Speakers may soften criticism, hedge requests, or avoid direct confrontation.

Examples:

| Direct version | Politeness-managed version |
|---|---|
| "This is wrong." | "I'm not sure this is quite right." |
| "Rewrite this." | "Could you take another pass at this?" |
| "You missed the point." | "I think we may be focusing on a different issue." |
| "This argument is weak." | "This part may need stronger support." |

These forms do not merely decorate the message. They modify how the message should be interpreted socially.

### 6.2 Epistemic stance


Epistemic stance concerns how certain the speaker is and what kind of knowledge claim they are making.

Examples:

| Expression | Epistemic stance |
|---|---|
| "I know" | high certainty |
| "I think" | moderate commitment |
| "I suspect" | inference, not certainty |
| "Apparently" | based on reported evidence |
| "It seems" | appearance-based judgment |
| "Probably" | high but not complete likelihood |
| "Maybe" | possibility |

Compare:

> "This is broken."

with:

> "This seems broken."

The second version marks weaker certainty and leaves more room for revision.

### 6.3 Affective stance


Affective stance concerns the speaker's emotional or evaluative attitude.

Examples:

| Utterance | Possible stance |
|---|---|
| "This is frustrating." | dissatisfaction |
| "I'm worried about this migration." | concern |
| "This feels risky." | caution |
| "That's fine." | acceptance, possibly neutral or reluctant |
| "Great, another breaking change." | sarcasm or annoyance |

Affective stance can be explicit or implicit. It often affects how direct, careful, or explanatory the response should be in conversation.

### 6.4 Authority and obligation


Natural language encodes authority relations and obligation strength.

Examples:

| Utterance | Social/obligational meaning |
|---|---|
| "You must submit this today." | strong obligation |
| "You should submit this today." | recommendation or weak obligation |
| "You may submit this today." | permission |
| "You are not allowed to submit this yet." | prohibition |
| "I need you to submit this today." | request with authority or urgency |

Authority may come from social role, institutional context, prior agreement, or task ownership.

### 6.5 Urgency and priority


Natural language signals urgency in many ways, not only through explicit deadlines.

Examples:

| Signal | Example |
|---|---|
| Explicit deadline | "by 5 PM" |
| Relative deadline | "as soon as possible" |
| Emphasis | "really need this today" |
| Contrast | "not tomorrow -- today" |
| Consequence | "otherwise we miss the launch" |
| Repetition | "today, before end of day" |

Urgency is partly semantic and partly pragmatic. "ASAP" does not define a precise time by itself; it depends on context and expectations.

### 6.6 Commitment strength


Commitment strength concerns how strongly the speaker commits to a proposition, preference, or instruction.

Examples:

| Utterance | Commitment strength |
|---|---|
| "This is the cause." | strong factual commitment |
| "This is probably the cause." | high but defeasible commitment |
| "This might be the cause." | weak possibility |
| "I prefer option A." | preference |
| "We must choose option A." | strong directive commitment |
| "Option A seems reasonable." | tentative evaluation |

Commitment strength is important because two utterances may have similar propositional content but different force.

### 6.7 Summary of Group E


| Property | Main issue | Example |
|---|---|---|
| Politeness/face | Socially managed expression | "Could you maybe..." |
| Epistemic stance | Certainty and evidence | "I think", "probably" |
| Affective stance | Emotion or evaluation | "This feels risky" |
| Authority/obligation | Permission, duty, prohibition | "must", "may", "not allowed" |
| Urgency/priority | Importance and timing pressure | "ASAP", "before EOD" |
| Commitment strength | Degree of endorsement | "might", "must", "definitely" |

Group E shows that natural-language meaning is not only informational. It is also interpersonal and stance-bearing.

## 7. Relationship between the groups


The groups are analytically separate, but real utterances often involve several at once.

Example:

> "Could you maybe send that to Sarah before the meeting?"

Relevant phenomena:

| Phrase | Phenomenon |
|---|---|
| "Could you" | politeness, indirect request, speech act |
| "maybe" | softening, reduced imposition, weak modality |
| "send" | action verb, pragmatic intent |
| "that" | deixis / reference to context |
| "Sarah" | named entity, possibly ambiguous referent |
| "before the meeting" | context-dependent temporal reference |
| whole utterance | request rather than ability question |

Another example:

> "Actually, not that one -- the cheaper option from yesterday."

Relevant phenomena:

| Phrase | Phenomenon |
|---|---|
| "Actually" | discourse repair marker |
| "not that one" | correction + deixis |
| "the cheaper option" | vague/comparative reference |
| "from yesterday" | temporal deixis or prior discourse reference |
| whole utterance | repair of previous interpretation |

The groups are therefore not mutually exclusive boxes. They are lenses for analyzing how meaning is produced.

## 8. Why pragmatics and implicit context should be adjacent


Pragmatics and implicit context are deeply connected.

Implicit context answers questions such as:

- Who is speaking?
- What is currently being discussed?
- What objects are visible or salient?
- What happened earlier?
- What assumptions are shared?
- What is the current task?

Pragmatics answers questions such as:

- What is the speaker trying to do?
- Is this a request, question, warning, correction, complaint, or suggestion?
- What is implied but not stated?
- Which interpretation is relevant?
- How strong is the speaker's commitment?

The relationship can be summarized as:

```text
Context dependence supplies the background.
Pragmatics derives intended meaning from that background.
Discourse tracks how that meaning changes over time.
Social framing shapes how the meaning is expressed and received.
```


Example:

> "This is a little too aggressive."

Context dependence:

- What is "this"?
- Which part is being evaluated?
- What genre is it: email, legal letter, design, negotiation message?

Pragmatics:

- The speaker likely wants revision, not just description.
- "A little" may soften criticism.
- "Too aggressive" implies a desired shift in tone.

Social framing:

- The speaker avoids saying "This is bad."
- The criticism is mitigated.

Discourse:

- The utterance likely modifies a previous draft or proposal.

## 9. Comparison with programming languages and APIs


The contrast with programming languages and APIs helps clarify the distinctive nature of natural language.

### 9.1 Programming languages


Programming languages require formally valid expressions whose meaning is governed by a specification, compiler, interpreter, type system, or runtime.

Typical properties:

- explicit variables
- fixed syntax
- defined operators
- scoped bindings
- deterministic parsing where possible
- strict error behavior
- formal execution model

Example:

```text
reschedule(eventId="evt_123", date="2026-05-27")
```


The operation, target, and date are explicit.

### 9.2 APIs


APIs require inputs that conform to a schema.

Typical properties:

- named endpoints or methods
- required parameters
- optional parameters
- typed values
- validation rules
- defined response formats
- explicit success/failure states

Example:

```json
{
  "event_id": "evt_123",
  "new_date": "2026-05-27",
  "timezone": "America/Sao_Paulo"
}
```


The API does not normally infer "it," "tomorrow," "same as before," or "a bit more formal" unless those concepts are separately modeled.

### 9.3 Natural language


Natural language permits expressions such as:

> "Move it to tomorrow."

This compact utterance may involve:

| Feature | Required interpretation |
|---|---|
| "move" | reschedule, relocate, reorder, transfer? |
| "it" | which event, object, task, or file? |
| "tomorrow" | date relative to speaker and timezone |
| omitted time | preserve existing time or choose a new one? |
| omitted confirmation | should this be direct, tentative, or discussed? |

Natural language is not less structured than an API. It is structured differently: through context, inference, discourse, and social convention.

## 10. Complete taxonomy table


| Group | Property | Core question | Example |
|---|---|---|---|
| A. Indeterminacy | Ambiguity | Which meaning? | "Book a table" |
| A. Indeterminacy | Vagueness | Where is the boundary? | "nearby" |
| A. Indeterminacy | Underspecification | What is missing? | "Schedule a meeting" |
| A. Indeterminacy | Prototype categories | What does it resemble? | "startup-like" |
| A. Indeterminacy | Metaphor | What cross-domain meaning applies? | "brittle code" |
| B. Context dependence | Implicit context | What background is assumed? | "Do it like last time" |
| B. Context dependence | Deixis | What is the anchor? | "this", "tomorrow" |
| B. Context dependence | Coreference | Which expressions share a referent? | "Sarah... she... it" |
| B. Context dependence | Ellipsis | What omitted material is recoverable? | "Cheapest, not fastest" |
| B. Context dependence | Presupposition | What is treated as already true? | "Cancel my next meeting" |
| C. Pragmatic meaning | Speech acts | What act is performed? | request, warning, correction |
| C. Pragmatic meaning | Implicature | What is implied? | "Some tests passed" |
| C. Pragmatic meaning | Relevance | Which interpretation matters here? | "Is John available?" |
| C. Pragmatic meaning | Politeness/indirectness | What social softening is present? | "Could you maybe..." |
| C. Pragmatic meaning | Modality | What is possible, required, or likely? | must, should, might |
| D. Discourse | Discourse structure | How do parts relate? | first, then, however |
| D. Discourse | Repair/correction | What previous meaning is revised? | "No, I meant..." |
| D. Discourse | Mixed initiative | Who guides the next move? | "Risk, cost, or speed?" |
| D. Discourse | Redundancy/emphasis | What is being reinforced? | "today, before EOD" |
| D. Discourse | Incremental refinement | How is the task narrowed? | "Only 14-inch ones" |
| E. Social framing | Epistemic stance | How certain is the speaker? | "I think", "definitely" |
| E. Social framing | Affective stance | What attitude is expressed? | "This feels risky" |
| E. Social framing | Authority/obligation | What social force applies? | "must", "may" |
| E. Social framing | Urgency/priority | How important or time-sensitive is it? | "ASAP" |
| E. Social framing | Commitment strength | How strongly is it endorsed? | "might", "must" |

## 11. Compact final model


A concise model of the groups:

```text
Natural-language meaning
├── A. Indeterminacy of meaning
│   ├── ambiguity
│   ├── vagueness
│   ├── underspecification
│   ├── prototype-based categories
│   └── metaphor
│
├── B. Context dependence
│   ├── implicit context
│   ├── deixis
│   ├── coreference
│   ├── ellipsis
│   └── presupposition
│
├── C. Pragmatic meaning and speaker intent
│   ├── speech acts
│   ├── implicature
│   ├── relevance
│   ├── politeness and indirectness
│   └── modality
│
├── D. Discourse and conversational structure
│   ├── discourse relations
│   ├── repair and correction
│   ├── mixed initiative
│   ├── redundancy and emphasis
│   └── incremental refinement
│
└── E. Social and communicative framing
    ├── epistemic stance
    ├── affective stance
    ├── authority and obligation
    ├── urgency and priority
    └── commitment strength
```

## Constraints


**Irreducibility:** Layer 0 properties cannot be engineered away. A system cannot force users to speak in unambiguous, context-free, fully specified API payloads. Therefore, engineering effort must focus on accommodating these properties via Layer 3 system controls (e.g., semantic validators, fallback logic) rather than attempting to "fix" the natural language input.

## 12. Final summary


Natural language differs from programming languages and APIs not merely because it is less precise, but because it distributes meaning across several layers:

1. lexical and sentence meaning
2. contextual reference
3. pragmatic intention
4. discourse history
5. social and epistemic stance

The most important rearrangement is to separate **implicit context** from **pragmatics**, while keeping them adjacent.

Implicit context provides the background needed to interpret expressions like "this," "that," "tomorrow," "same as before," and "the other one." Pragmatics uses that background to infer what the speaker is trying to do: request, suggest, warn, correct, object, confirm, or imply.

A final compact formulation:

```text
Formal languages favor explicit, context-independent interpretation.
Natural language favors situated, context-sensitive, pragmatically inferred meaning.
```


That difference is the basis for the A-E taxonomy above.
