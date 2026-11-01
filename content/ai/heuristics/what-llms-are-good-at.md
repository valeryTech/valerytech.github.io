---
draft: false
toc: true
title: "What LLMs Are Good At"
description: "The useful abilities of LLMs for building products, in plain terms (what you give the model, what you get back, what software does next, and what to check), plus where the model sits in a product, what it may change, and when a task is worth building."
linkTitle: "LLM Abilities"
---

The abilities you can build a product on. Each row says what you give the model, what you get back, what ordinary software can do with the result, a concrete product example, and what to check before trusting the result. After the tables come where the model can sit in a product, what it may be allowed to change, and a quick test of whether a task is worth building. Why the abilities work, and where they fail, is in [LLM features]({{< ref "ai/heuristics/llm-features" >}}).

## Turning unstructured material into structure


| # | Ability | You give | You get | Software then | Example | Check |
| --- | --- | --- | --- | --- | --- | --- |
| U1 | Extract fields | A web page, email, PDF, chat, or transcript | A record with named fields (JSON, a table row) | Validates types and required fields; stores each value with the text it came from | A person's profile page into name, roles, employers, dates, skills; a payment message into a personal-finance transaction | Every field against the source; missing fields left empty, not guessed |
| U2 | Build a model of a domain | A sample of documents, profiles, or notes | Entity types, their fields, and relations, written as a schema, an ontology, or your own DSL | Turns the schema into a parser that checks every later record | Fifty company profiles into a model of company, product, market, and partner; a client's notes into the terms of their business | A person reviews the schema once; after that, extraction into it is checked per record |
| U3 | Convert between forms | Text, a table, code, a query, or a diagram | The same content in another form | Parses, type-checks, and runs the query or code; renders the diagram | "Food spending last month" into a SQL query over ledger records; a process description into a diagram; a spreadsheet into an explanation | The result answers the question that was asked, not a nearby one |
| U4 | Classify and tag | Many items and categories described in words | A label, a tag set, or a route for each item | Routes, counts, or filters by the label | Posts by a reader's stated interests; support requests by issue and urgency | A sample against labels a person set |
| U5 | Match and link | Two lists, or a mention and a list | Which items are the same thing or fit each other | Merges the records, or shows the proposed links for confirmation | The same company written three ways; a dictated name to a CRM account; a candidate to a role | The candidates that were considered, not only the chosen one |

## Working with documents


| # | Ability | You give | You get | Software then | Example | Check |
| --- | --- | --- | --- | --- | --- | --- |
| U6 | Condense and compare | One long document, or two versions | A summary, the differences, what changed | Links each statement to its passage | Two versions of a contract; a long discussion thread | Nothing important was left out |
| U7 | Answer from documents | A question and a set of documents | An answer with the passages it rests on | Checks that each quoted passage exists in the documents | An evidence workspace over internal documents; a literature research helper | It says "not in these documents" when that is true; this weakness has not faded in newer models |

## Producing text and code


| # | Ability | You give | You get | Software then | Example | Check |
| --- | --- | --- | --- | --- | --- | --- |
| U8 | Write and rewrite | Notes, a draft, or facts, plus the audience and tone | A draft, a cleaner version, or a translation | Compares names, numbers, and dates with the input | Client update messages; rewriting rough working notes into clear prose | The tone fits the reader, and nothing was added that the notes did not say |
| U9 | Generate options and test data | A goal and constraints | Many variants: names, plans, questions, test cases, synthetic records | Removes duplicates; runs the test cases against the product | Synthetic test conversations for evaluating an assistant; tailored interview practice questions | Variety: answers to open prompts tend to repeat, so ask for differences explicitly |
| U10 | Write and explain code | A description, an error, or old code | Code, tests, a fix, or an explanation of what the code does | Runs the tests in a sandbox | Recovering the business rules of a legacy system; a codebase navigation assistant | The tests check what was asked, not only what the model wrote |

## Talking and acting


| # | Ability | You give | You get | Software then | Example | Check |
| --- | --- | --- | --- | --- | --- | --- |
| U11 | Collect information by conversation | What needs to be known | A dialogue that asks, follows up, and fills a record | Validates the record and asks again for what is missing | Client intake by conversation instead of a rigid form; daily health or habit check-ins | The record holds what the person said; the model does not just agree with them |
| U12 | Plan and use tools | A goal, and tools with clear inputs | Steps, tool calls, and updates in other systems | Checks permissions, asks for confirmation, executes, and logs each call | Recruiting coordination across calendar, email, and applicant tracker | The plan fits the goal; the model stops when a tool fails instead of guessing |
| U13 | Judge against a rubric | An output and the criteria | A score or verdict with reasons | Totals the verdicts; sends low scores to a person | Reviewing another system's traces against an evaluation rubric; checking a draft against a style guide | A judge from another model family; agreement with a person on a sample |

## Inputs and setup


| # | Ability | You give | You get | Software then | Example | Check |
| --- | --- | --- | --- | --- | --- | --- |
| U14 | Read images, scans, and speech | A photo, screenshot, scanned page, or audio | Text and layout the other abilities can use | Passes the text on to U1 or U4 | A meal photo; a scanned receipt; spoken dictation | Noisy input: unclear words and numbers |
| U15 | Adapt from instructions and examples | A rule, a few examples, a schema, or a style, in the prompt | The behavior changes without training | Stores instructions and examples per client, with versions | One product configured per client: their categories, their entity list, their tone | Re-test after every change of instructions or model |

Two more things come with every model: broad background knowledge (vocabulary, common sense, domain conventions), which is good for first drafts but not for current or private facts; and one interface for all of the above, so one product can combine several abilities.

The "Software then" column is why the output form matters: prose can only be shown and reviewed, but a label can be routed, a record validated, a query type-checked and run, and code tested. The more structured the output, the more ordinary software can check it before it has any effect ([general design model]({{< ref "ai/design-research/input/reports/general-conceptual-design-model-for-llm-software-systems" >}})).

## Worked example: profiles into an ontology


Building structured knowledge from web profiles uses U2, U1, U5, and U3 in order. Code does the parts that need to be exact.

1. **Collect.** Gather 30-50 profile pages you are allowed to use.
2. **Propose a model (U2).** Give the model a sample and ask for entity types, fields, and relations in your DSL: for example `Person`, `Organization`, `Role(person, organization, title, from, to)`, `Skill`.
3. **Fix the model.** A person renames, merges, and removes types. The schema is now the contract.
4. **Extract (U1).** For each profile, the model fills the schema and attaches the quoted text each value came from. Unknown values stay empty.
5. **Link (U5).** The model proposes which records are the same organization or person ("ACME Inc." and "Acme"); a person or a rule confirms the uncertain ones.
6. **Validate (code).** A parser checks every record against the DSL: types, required fields, dates. This step is ordinary software, not the model.
7. **Use (U3).** Questions in plain language become queries over the structured data: "who worked at two of these companies?"

What to measure: field accuracy on a sample checked by a person, how many profile facts the schema has no place for, and how many proposed links were wrong.

The same pipeline fits many applications: building a structured client profile from intake notes, maintaining the private entity catalog a grounding service matches against, comparing findings across research papers, or modeling a household's recurring obligations.

## Where the model sits in a product


The same ability is safer or riskier depending on what happens to its output before it reaches anyone. Four placements, from riskiest to safest ([Lipenkova 2025](#lipenkova-2025), ch. 5):

| Placement | What happens | Risk | Example |
| --- | --- | --- | --- |
| The user talks to it | The user can type anything, and the answer goes straight back | Highest: any input, any output, and mistakes reach the user unfiltered | A chat assistant over internal documents |
| It writes something software runs | The model turns a request into a query, a tool call, or JSON, and code executes it | A wrong but valid output still runs, such as a delete instead of a read | "Food spending last month" into SQL over ledger records |
| It does a fixed task in the backend | Your code picks the input and the task; the output is structured and checked before it is shown | Low: the input is controlled and the output can be validated. Controlled means your code chose it; its content can still vary widely | Tagging posts by interest; summarizing a thread; a preliminary audit report run from a button |
| It runs in a batch | The model works through a set of inputs and writes to a database; code and people check the results before anyone uses them | Lowest, but nothing happens in real time | Profiles into an ontology (above); fields from a document archive |

The placements control the request, not the data. Going down the table, the user decides less of what is asked. The material the model works on can still vary as much as in chat. A preliminary audit report is one button and fixed steps, but each run gets a different journal-entry population: more or fewer sources, missing prior periods, totals that do not reconcile. Placement does not handle that risk. Judge and Decide sufficiency in the [primitives]({{< ref "ai/heuristics/llm-primitives" >}}) do. [Sources of variability]({{< ref "ai/system-types/project-examples/sources-of-variability" >}}) separates the three places variety comes from: the request, the flow of steps, and the data.

When users talk to the model directly, two patterns cut cost and catch more mistakes. A router sends each request to the model that suits it, or to a person. A cascade tries a small model first and passes the request on only when the answer is not confident.

The interface is a separate choice: chat, ordinary screens, or a hybrid where chat takes the open requests and buttons take the fixed actions. Chat earns its place when the intent is easy to say in words but tedious to translate into fields and filters. Language also lets users combine existing actions (search, filter, group, schedule) into requests no dedicated screen was built for. A hybrid sets how much requests vary at each entry point: a button turns a request into a bounded choice, and the chat box takes the rest.

## What the model may change


What the model produces and what it may change are separate choices—using the model for *interpretation*, while deterministic code and people hold *authority*. Five levels, adapted from [AI systems classification]({{< ref "ai/system-types/classification/ais-classification" >}}) and [Workflow design]({{< ref "ai/design/workflow-design/workflow-design" >}}):

| Level | The model may | Control around it | Example |
| --- | --- | --- | --- |
| 1. Inform | Answer, explain, summarize | The person decides what to do with it | An evidence brief over internal documents |
| 2. Interpret | Turn words into a request, a record, or a route; nothing changes yet | Code checks the result against the schema and the known options | A dictated name matched to a CRM account |
| 3. Draft | Prepare a change or a message | The person sees every choice and its effect, and can edit before confirming | A parsed expense entry waiting for confirmation; a drafted reply to a client |
| 4. Act after approval | Carry out a step once a person says yes | Code rechecks the current state before running it | Sending a meeting invite the user approved |
| 5. Act within limits | Act alone inside a set scope | Limits, a log of every action, undo, and someone who watches | Routing support requests to teams; updating low-risk CRM tags |

How high to go for a task ([augmenting human work]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}})):

- Higher when the result is easy to check, mistakes can be undone, and the model has all the context it needs.
- Lower when a mistake is costly, the goal is unclear, the case is new, or the decision rests on what only people know.
- A person keeps setting the goal, choosing between values, and approving anything that cannot be undone.

Start low and move up as evaluations show the model is reliable on that task; each move up removes a control from the screen. When the model is unsure, it can call on a person the way it calls a tool: to review a low-confidence result, state a preference, or supply missing data ([Lipenkova 2025](#lipenkova-2025), ch. 9).

## Is a task worth building


The two questions that matter most are whether the task needs a lot of language work and whether the result is easy to check ([opportunity search approach]({{< ref "ai/product/strategic-analysis/opportunity-search" >}})):

| | Easy to check | Hard to check |
| --- | --- | --- |
| **Much language work** | Best opportunities: extraction into a schema, matching, routing, resolving a dispute from emails and invoices | Risky: open-ended agents, advice nobody can verify soon |
| **Little language work** | Ordinary software is enough | Rarely worth it |

Then:

- **It repeats.** The task happens often. One-off decisions are not worth automating.
- **Many inputs that differ a little.** Ten thousand contracts checked for auto-renewal clauses is a good fit; one report is better read directly (RAG use cases).
- **It is cheaper with the checking counted.** The AI version costs building and running it, people's time finding and fixing its mistakes, and the damage from mistakes nobody catches. All of that must stay well below the manual cost ([Lipenkova 2025](#lipenkova-2025), ch. 2).
- **Mistakes show and can be undone.** Short feedback loops let a bad version fail fast.
- **People want to hand it off.** Tedious work is welcome; work that gives people status, or that they want to own, is not ([Lipenkova 2025](#lipenkova-2025), ch. 10).
- **No full explanation is required.** When every decision needs a complete "why", as in credit scoring, use rules.
- **The whole job improves.** Making one step cheap can move the bottleneck to review or coordination, so measure the outcome, not the step ([working assumptions]({{< ref "ai-engineering/working-assumptions" >}})).
- **The smallest model that works.** Once a large model does the task well, try a smaller one, or label data with the large model and train a cheap classifier on it.

When the task is one step of a larger workflow, [Assessing workflow steps for AI]({{< ref "ai/heuristics/workflow-assessment" >}}) compares the steps on value, feasibility, and desirability and picks one to start with.

## Where the abilities sit


The abilities are what [capabilities]({{< ref "ai/heuristics/llm-capabilities" >}}) `C1-C14` are made of, seen from the builder's side. `U1` and `U14` correspond to Recognize and Extract (`P1`, `P2`); `U5` corresponds to Ground and Link (`P3`, `P9`); `U7` combines Acquire, Judge, Decide sufficiency, and Compose (`P4-P7`, as in `C12`); `U10` combines Extract, Ground, Acquire, Judge, and Compose (`C13`); `U11` and `U12` depend on Decide sufficiency (`P6`), Remember (`P8`), and Link (`P9`, as in `C2` and `C14`). See [LLM primitives]({{< ref "ai/heuristics/llm-primitives" >}}).

## Other ways to look at LLMs


Other notes in the vault describe the same abilities from other sides.

What the user gets:

- Six kinds of benefit: automation, augmentation (the AI drafts, a person refines), personalization, inspiration, convenience, and emotional connection ([Lipenkova 2025](#lipenkova-2025), ch. 2).
- Automation, augmentation, and innovation, each measured differently ([Lipenkova, AI for Business 15](#lipenkova-ai-value)).

Where the model sits and what it may change:

- Placements, assisted, augmented, or autonomous work, interface types, and read, analyze, and write tools for agents ([Lipenkova 2025](#lipenkova-2025), ch. 3, 5, and 9). [Assessing workflow steps for AI]({{< ref "ai/heuristics/workflow-assessment" >}}) lines the three levels of automation up with the five levels above.
- [AI systems classification]({{< ref "ai/system-types/classification/ais-classification" >}}): action authority from A0 (information only) to A4 (autonomous within a domain).
- [Workflow design]({{< ref "ai/design/workflow-design/workflow-design" >}}): read and recommend, approved execution, then bounded autonomy.

What the output is and what software does with it:

- [General design model]({{< ref "ai/design-research/input/reports/general-conceptual-design-model-for-llm-software-systems" >}}): output forms and the checks each one allows.
- [Analyzing AI system design]({{< ref "ai/design-research/input/analyze-ai-system-design" >}}): what each part of a system (schemas, tools, validators, people) adds and what it prevents.

Who does which part:

- [Augmenting human work]({{< ref "ai/design-research/02-human-ai-collaboration/01-augmenting-human-work" >}}): work assigned by task property, and the decisions a person keeps.
- [Collaboration patterns]({{< ref "ai/design-research/02-human-ai-collaboration/06-human-ai-collaboration-patterns" >}}): elicitation, delegation, proposal and review, coaching, shared reasoning, joint construction.
- [Participant profiles]({{< ref "ai/design-research/01-foundations/11-participant-profiles-and-work-allocation" >}}): the LLM next to a person and next to ordinary software.

Where it is worth building:

- [Opportunity search approach]({{< ref "ai/product/strategic-analysis/opportunity-search" >}}): what LLMs are strong and weak at, and the language-work and checking grid.
- [Working assumptions]({{< ref "ai-engineering/working-assumptions" >}}): the LLM proposes, tools produce evidence, people and tests judge.
- [AI product framework]({{< ref "ai/product/product-framework/notes" >}}): value, feasibility, and desirability per step, and the AI design option map.
- RAG use cases: fit by volume, variety, and how checkable the output is.
- Assistant use cases: a catalogue of use cases and the signs of a good fit.

Why language helps, and what kind of system results:

- Language, intent, and hybrid interaction: requests too many to build screens for.
- LLM agents learning map: language as a universal interface, and the LLM as a controller.
- [AI project examples]({{< ref "ai/system-types/project-examples/ai-project-examples-and-design-model" >}}): eight system types, told apart by how the work moves forward.
- [Sources of variability]({{< ref "ai/system-types/project-examples/sources-of-variability" >}}): whether a system's variety comes from the request, the flow of steps, or the data, and why that decides what to test.

## Further reading


- [Huyen 2025](/sources/faff32abd78cc0963d6a4a913c8c129e.bin), *AI Engineering: Building Applications with Foundation Models*: its chapter on foundation model use cases is not yet in the notes (reading notes).

## References


- Lipenkova, J. (2025). [The Art of AI Product Development: Delivering Business Value](https://www.manning.com/books/the-art-of-ai-product-development). Manning. PDF; full text in the Lipenkova note. ^lipenkova-2025
- Lipenkova, J. [AI for Business #15: How to Measure AI Value](https://jannalipenkova.substack.com/p/ai-for-business-15-how-to-measure). Saved copy: clipping. ^lipenkova-ai-value
