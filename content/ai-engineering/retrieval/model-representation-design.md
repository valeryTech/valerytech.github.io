---
draft: false
toc: true
title: "Model Representation Design"
linkTitle: "Model Representation Design"
---

| Task need                                       | Useful representation                                         |
| ----------------------------------------------- | ------------------------------------------------------------- |
| Find exact term or identifier                   | lexical index, keyword field, exact-match metadata            |
| Find semantically related policy or explanation | dense vector representation, hybrid search                    |
| Find a person, product, account, or project     | entity index, normalized metadata                             |
| Answer from tables                              | table objects, extracted rows, schema-aware search            |
| Traverse relationships                          | graph representation                                          |
| Verify authority                                | source metadata, ownership, approval status, policy hierarchy |
| Check freshness                                 | timestamps, version fields, update history                    |
| Cite evidence                                   | passage-level chunks with provenance                          |
| Summarize large documents                       | section summaries, document outline, hierarchical chunks      |

A stronger framing would be:

> **Representation Design is the process of deriving searchable access surfaces from source material so that different task-shaped information needs can reach the right evidence.**

The user request is not the retrieval query; the system first derives a task context requirement, then matches that requirement against searchable representations. Your current docs already point toward this with "chunks, summaries, entities, metadata, tables, synthetic questions, relationships, or structured fields," but the section can make this a design method rather than a list.

## A more systematic model


I would structure Representation Design around **what latent structure we want to expose**.

Raw corpus material contains many things that are not directly searchable:

```text
terms
meanings
entities
claims
facts
definitions
examples
rules
exceptions
tables
relationships
events
versions
authority signals
freshness signals
procedures
user-question affordances
```


A representation makes one or more of these searchable.

So instead of asking:

> What representations can we generate?

ask:

> What kind of access does the task require, and what latent structure must be made explicit for that access to work?

That gives you a derivation framework.

## Representation families we can derive

### 1. Source-preserving representations


These keep the source close to its original form. They are useful when the system needs grounded evidence, citations, or exact context.

Examples:

```text
document chunks
section-level chunks
paragraph passages
sentence-level evidence units
code blocks
table objects
figure/image regions
page-level units
document outline nodes
```


These are not just "chunks." The unit should reflect the evidence shape. A legal clause, a table row, a troubleshooting step, and a code function should not necessarily be represented with the same chunking strategy.

Use when the task requires:

```text
citation
grounding
close reading
answering from source text
exact reference
evidence inspection
```

### 2. Lexical and identifier representations


These expose exact language and exact identifiers.

Examples:

```text
keyword index
n-gram index
identifier index
SKU / account / ticket / policy ID fields
quoted phrase index
acronym expansion index
synonym dictionary
domain vocabulary map
```


This matters because semantic search often weakens exactness. A task such as "find policy SEC-17B" or "where is this error code mentioned?" should not rely only on embeddings.

Use when the task requires:

```text
exact match
known-item lookup
identifier search
error-code search
legal or policy term matching
auditability
```

### 3. Semantic representations


These expose meaning rather than surface wording.

Examples:

```text
dense embeddings of passages
dense embeddings of sections
hybrid lexical-semantic representations
concept embeddings
domain-adapted embeddings
task-specific embeddings
```


These are useful when the user does not know the corpus vocabulary. They are weaker when authority, exactness, versioning, or structured constraints matter.

Use when the task requires:

```text
conceptual discovery
approximate matching
policy/explanation lookup
finding related cases
matching user language to domain language
```

### 4. Summary and abstraction representations


This is where summaries belong, but they should be treated as one family among several.

Examples:

```text
section summaries
document summaries
hierarchical summaries
topic summaries
decision summaries
change summaries
exception summaries
scope summaries
```


There are also different abstraction levels:

```text
surface summary: what this section says
conceptual summary: what idea this section represents
operational summary: what the user can do with it
evidentiary summary: what claim this section supports
```


This is important: a summary is not just compression. It is a new access surface. It lets retrieval hit the **gist**, **scope**, or **role**of a source unit when the original wording is too detailed or too noisy.

Use when the task requires:

```text
broad discovery
large-document navigation
high-level comparison
routing to relevant sections
context compression
```

### 5. Synthetic demand-side representations


Instead of only representing what the document says, generate representations of **how users might look for it**.

Examples:

```text
synthetic questions
sample user queries
FAQ-style access points
hypothetical search intents
query paraphrases
problem statements this passage could answer
task descriptions supported by this source
```


This is a major category because user language and source language often diverge. Your own draft says raw corpus material is rarely searchable in the representation users need; source material is stored in one form, while users search through their own vocabulary, task context, and implicit intent.

Use when the task requires:

```text
matching user phrasing to source material
supporting vague or underspecified queries
bridging novice language to expert corpus language
retrieving answers from documents that do not phrase things as questions
```


Example:

```text
Source text:
"Employees may submit reimbursement requests within 30 days of travel completion."

Derived synthetic queries:
- "How long do I have to submit travel expenses?"
- "Can I still file a reimbursement after my trip?"
- "What is the deadline for expense claims?"
```

### 6. Entity and normalized-record representations


These expose entities that appear inside documents but are not necessarily searchable as first-class objects.

Examples:

```text
people
organizations
products
projects
customers
accounts
systems
locations
policies
teams
repositories
tickets
normalized aliases
canonical IDs
entity profiles
```


This is useful when retrieval should find "the thing" rather than merely passages mentioning the thing.

Use when the task requires:

```text
find a person, account, project, product, or system
resolve aliases
join across documents
filter by entity
aggregate evidence around one entity
```

### 7. Claim, fact, and assertion representations


Documents often contain atomic claims embedded in prose. Extracting them creates a representation suitable for verification, comparison, and contradiction detection.

Examples:

```text
atomic claims
fact triples
claim + evidence span
claim + qualifier
claim + date
claim + source
claim + confidence
claim + contradicting claims
```


Use when the task requires:

```text
fact verification
answer grounding
citation
conflict detection
claim comparison
audit
```


This is different from summarization. A summary compresses a section. A claim representation decomposes it into checkable assertions.

### 8. Rule, policy, and constraint representations


Some corpora contain rules rather than facts. Policies, contracts, product requirements, compliance docs, and SOPs often need this treatment.

Examples:

```text
rule objects
condition-action structures
eligibility criteria
exceptions
obligations
prohibitions
permissions
thresholds
deadlines
approval requirements
```


Use when the task requires:

```text
determine whether something is allowed
apply a policy
check compliance
identify exceptions
explain a decision
```


Example representation:

```text
Rule:
Employees may submit reimbursement requests within 30 days of travel completion.

Derived fields:
- actor: employee
- action: submit reimbursement request
- condition: travel completed
- deadline: 30 days after completion
- modality: permitted
```

### 9. Structural representations


These expose document organization and internal layout.

Examples:

```text
document tree
section hierarchy
heading path
table of contents
parent-child chunk links
adjacent-section links
appendix links
footnote links
cross-references
```


Use when the task requires:

```text
navigate a large document
retrieve context around a passage
understand scope
avoid isolated chunk errors
recover parent section meaning
```


This is especially important because chunk retrieval often loses hierarchy. A passage may only make sense under its parent heading.

### 10. Table, schema, and row representations


Tables should not be treated as plain text if the task requires row/column reasoning.

Examples:

```text
table object
row object
column schema
cell-level representation
table summary
table provenance
numeric field extraction
schema-aware index
```


Use when the task requires:

```text
answer from tables
compare values
filter rows
aggregate fields
extract structured data
perform calculations
```

### 11. Relationship and graph representations


These expose connections.

Examples:

```text
entity graph
document citation graph
policy dependency graph
product-component graph
ownership graph
workflow graph
system dependency graph
concept graph
```


Use when the task requires:

```text
traverse relationships
answer dependency questions
understand ownership
connect evidence across sources
perform impact analysis
```


Your draft already identifies graph traversal as a possible retrieval mechanism and graph structure as a corpus representation, but this can be elevated into a full representation family.

### 12. Temporal and version representations


These expose time, freshness, lineage, and change.

Examples:

```text
created_at
updated_at
effective_date
expiration_date
version number
document lineage
supersedes / superseded_by links
change summaries
diff representations
temporal event records
```


Use when the task requires:

```text
freshness
latest policy
compare versions
historical reconstruction
change analysis
avoid stale answers
```


This matters because many retrieval failures come from selecting stale or duplicated material, not from generation failure.

### 13. Authority, provenance, and trust representations


These expose whether a source should be trusted.

Examples:

```text
source owner
approval status
policy hierarchy
source type
canonicality
citation metadata
provenance chain
access permissions
review status
confidence score
```


Use when the task requires:

```text
verify authority
choose between conflicting sources
cite evidence
respect permissions
support auditability
```


This connects directly to your broader context model: acquired context may be stale, conflicting, unauthorized, or only partially relevant, so selection and structuring must preserve signals needed for trust.

### 14. Contradiction and conflict representations


These are derived representations that make disagreement searchable.

Examples:

```text
conflicting claims
duplicate-but-different passages
outdated-vs-current pairs
policy exception pairs
source disagreement clusters
```


Use when the task requires:

```text
compare evidence
verify answer consistency
detect stale content
surface uncertainty
resolve conflicting sources
```


This is useful for enterprise corpora where contradictions are normal.

### 15. Procedural and workflow representations


Many documents encode procedures, not just knowledge.

Examples:

```text
step sequences
preconditions
postconditions
decision points
required inputs
required approvals
fallback paths
tool/API actions
workflow state transitions
```


Use when the task requires:

```text
complete a process
troubleshoot
execute a workflow
guide a user through steps
determine next action
```


This links representation design to task completion rather than answer generation.

### 16. Evaluation and test representations


A retrieval system also needs representations used for evaluation, not just runtime retrieval.

Examples:

```text
golden queries
query-document relevance judgments
task scenarios
expected evidence sets
hard negative examples
known failure cases
coverage maps
```


Use when the task requires:

```text
measure retrieval quality
test recall
detect regressions
evaluate task utility
observe representation gaps
```


This is important because representation design should be evaluated by task utility, not semantic similarity alone.

## The deeper taxonomy


The section could say that representations are derived along several dimensions:

```text
1. Unit
   What is being represented?
   passage, section, document, table row, entity, claim, rule, event, workflow step

2. Transformation
   How is it derived?
   chunking, summarization, extraction, normalization, abstraction, generation, linking

3. Access mode
   How will it be searched?
   keyword, vector, hybrid, filter, graph traversal, SQL, table search, entity lookup

4. Task fit
   What task need does it serve?
   find, answer, verify, compare, summarize, decide, extract, route, act

5. Quality signals
   What makes it safe to use?
   provenance, authority, freshness, permissions, confidence, contradiction markers

6. Consumer fit
   Who uses it downstream?
   LLM, reranker, planner, verifier, workflow engine, UI, evaluator
```


That gives you a more systematic replacement for the shallow table.

## Possible rewrite of the section


You could replace the table with something like this:

> **Representation Design**
>
> A corpus should not be treated as one flat collection of embeddable text. Source material contains many latent structures: terms, entities, facts, claims, rules, tables, relationships, versions, authority signals, procedures, and examples of possible user intent. Representation design is the process of making these latent structures explicit and searchable.
>
> A representation is therefore not merely a storage format. It is an access surface: a derived view of source material that supports a particular class of task-shaped information need.
>
> Representations can be derived through several transformations:
>
> ```text
> segmentation      -> passages, sections, evidence units
> extraction        -> entities, fields, claims, rules, events
> normalization     -> canonical IDs, aliases, schema-aligned records
> abstraction       -> summaries, topics, concepts, document outlines
> generation        -> synthetic questions, sample queries, hypothetical intents
> structuring       -> tables, rows, workflow steps, document trees
> linking           -> graphs, citations, dependencies, lineage
> annotation        -> provenance, authority, freshness, permissions, confidence
> evaluation        -> golden queries, relevance labels, hard negatives
> ```
>
> Different representations expose different evidence shapes. A system that only embeds chunks exposes semantic similarity, but may fail on exact identifiers, tables, versions, authority, relationships, policy rules, or user phrasing. A stronger retrieval layer derives multiple representations from the same corpus and routes each task context requirement to the representation most likely to satisfy it.
>
> The design question is not "which index should we build?" but:
>
> ```text
> What must be made searchable so that this class of task can obtain sufficient,
> trustworthy, fresh, and usable context?
> ```

That would make the section more structural and less like an example table.
