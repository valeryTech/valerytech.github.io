---
draft: false
toc: true
title: "Data Foundation: A Cross-Cutting Workstream"
description: "Defines the cross-cutting data foundation for AI delivery, covering trustworthy source and evaluation data, synthetic-data validation, sufficiency, production shifts, and evidence traceability."
linkTitle: "Data Foundation"
---
## Definition


The **Data Foundation** workstream establishes and governs the data assets, evaluation evidence, instrumentation, and feedback mechanisms required to design, deliver, and continuously improve an AI or GenAI product.

It ensures that:

- product and model decisions are grounded in observed data;
- intended users, tasks, contexts, and failure modes are understood;
- training, retrieval, evaluation, and production datasets are representative, traceable, legally usable, and appropriately protected;
- product quality can be measured using repeatable evaluation methods;
- changes in user behaviour, data distributions, model behaviour, and operating conditions are detected and acted upon.

The workstream spans discovery, design, implementation, validation, release, and production operation.

## Guiding principle


**Look at the data before designing the AI solution.**

Before selecting models, prompts, architectures, or optimisation techniques, the team should examine the available data to understand:

- what users are attempting to accomplish;
- how frequently different tasks occur;
- what inputs actually look like;
- where ambiguity, noise, missing information, and edge cases occur;
- which user groups, languages, domains, or workflows require separate treatment;
- what constitutes a successful outcome;
- what failures already exist in the current process;
- whether sufficient evidence exists to evaluate the proposed solution.

This analysis should influence product scope, model selection, system architecture, evaluation strategy, and release criteria.

## Scope


The Data Foundation workstream covers four connected areas.

### 1. Product and production data


This area describes how the product is used in real operating conditions.

It includes:

- user requests and task distributions;
- workflow and interaction data;
- input and output characteristics;
- user corrections, retries, overrides, and abandonment;
- operational outcomes and downstream impact;
- production incidents and failure examples;
- segmentation by customer, geography, language, channel, use case, risk level, and other relevant dimensions.

Production data should be used to identify representative workloads, high-value scenarios, long-tail cases, and emerging failure modes.

### 2. Evaluation data


This area provides the evidence used to determine whether the system is fit for purpose.

It includes:

- curated reference datasets;
- production-derived evaluation samples;
- synthetic test data;
- adversarial and safety test cases;
- regression datasets;
- edge-case and rare-event datasets;
- human-evaluation samples;
- task-specific scoring rubrics;
- critical performance slices.

Synthetic data generation should be treated as a deliberate engineering capability. It can expand coverage, generate controlled variations, test rare conditions, and exercise safety boundaries. Synthetic datasets should be validated against real data distributions and clearly identified by provenance, generation method, intended use, and limitations.

### 3. Model-facing data


This area includes all data directly used by the AI system.

Depending on the solution, it may include:

- training and fine-tuning data;
- labelled examples;
- few-shot examples;
- prompt templates and system instructions;
- retrieval corpora;
- documents, chunks, embeddings, and metadata;
- tool definitions and structured schemas;
- taxonomies, ontologies, and business rules;
- user or organisational context supplied at inference time.

For retrieval-augmented generation, the retrieval corpus should be managed as a production data product with ownership, quality checks, freshness requirements, access controls, lineage, and measurable retrieval performance.

### 4. Data operations and governance


This area ensures that data remains usable, controlled, and observable.

It includes:

- data ownership and stewardship;
- data contracts;
- source and transformation lineage;
- dataset and schema versioning;
- quality rules;
- access control;
- privacy and retention controls;
- licensing and intellectual-property constraints;
- consent and permitted-use management;
- annotation standards;
- reproducibility;
- drift monitoring;
- incident investigation;
- remediation and re-evaluation processes.

## Lifecycle activities

### Discovery


The team should:

- inventory available data sources;
- profile data volume, completeness, quality, and representativeness;
- analyse real user journeys and task frequencies;
- identify important data segments and risk-sensitive slices;
- determine whether labels or outcomes are available;
- identify privacy, security, licensing, and retention constraints;
- assess gaps between available data and the intended product scope.

Key outputs include a data landscape, initial data profile, task taxonomy, risk assessment, and feasibility assessment.

### Design


The team should:

- define the populations, tasks, and contexts the product will support;
- establish the product's evaluation dimensions;
- specify required datasets and sampling strategies;
- define critical slices and minimum acceptable performance by slice;
- design synthetic-data and augmentation approaches;
- establish data contracts and lineage requirements;
- define production telemetry and feedback signals;
- establish drift definitions and response thresholds.

Key outputs include the evaluation strategy, dataset specifications, data contracts, telemetry design, and data-risk controls.

### Build


The team should:

- implement data ingestion and transformation pipelines;
- create versioned evaluation datasets;
- build synthetic-data generation pipelines where appropriate;
- implement annotation and review workflows;
- prepare retrieval corpora and indexing pipelines;
- add data-quality tests;
- instrument the product for production analysis;
- prevent test-set leakage and evaluation contamination.

Key outputs include reproducible pipelines, versioned datasets, annotation guidance, evaluation harness inputs, and monitoring instrumentation.

### Validate and release


The team should:

- evaluate the system on representative real-world data;
- test critical product and risk slices separately;
- compare synthetic-data results with production-derived samples;
- conduct adversarial, safety, robustness, and misuse testing;
- establish baseline distributions for production monitoring;
- document known data limitations and unsupported scenarios;
- confirm that production telemetry can detect material degradation.

Release evidence should include evaluation results, slice analysis, data provenance, known limitations, monitoring baselines, and agreed remediation actions.

### Operate and improve


The team should:

- analyse production data continuously;
- identify new tasks, behaviours, and failure categories;
- detect changes in data and workload distributions;
- update evaluation datasets using production evidence;
- investigate user corrections and negative feedback;
- refresh retrieval corpora and knowledge sources;
- re-run regression evaluations after data, model, prompt, or system changes;
- maintain an auditable link between production issues and evaluation coverage.

The production feedback loop should convert observed failures into new test cases, dataset improvements, product changes, and monitoring rules.

## Data shifts to monitor


AI systems may be affected by several distinct forms of shift:

- **Input or covariate shift:** the characteristics of incoming inputs change.
- **Task-mix shift:** the relative frequency of supported tasks changes.
- **Population shift:** the user, customer, language, geography, or domain mix changes.
- **Concept shift:** the relationship between inputs and correct outcomes changes.
- **Behaviour shift:** users change how they interact with the product.
- **Knowledge shift:** external facts, policies, documents, or business rules become outdated.
- **Retrieval shift:** corpus coverage, document quality, ranking behaviour, or metadata changes.
- **Feedback shift:** the users who provide feedback differ from the broader user population.
- **Model shift:** a model, model version, provider, or inference configuration changes.
- **Prompt and tool shift:** prompts, system instructions, tool interfaces, or schemas change.

Each monitored shift should have an owner, baseline, metric, threshold, investigation procedure, and defined response.

## AI and GenAI characteristics that affect the workstream


The workstream should account for the following characteristics.

### Probabilistic behaviour


Outputs may vary between runs, model versions, or inference configurations. Evaluation should therefore consider distributions, repeated trials, confidence intervals, and stability where appropriate.

### Dependence on operating context


Performance depends heavily on the actual task distribution, user population, language, domain, input quality, available context, and surrounding workflow. Aggregate metrics can conceal severe degradation in important slices.

### Unstructured and multimodal data


Inputs and outputs may include free text, documents, images, audio, code, or mixed formats. Quality checks, annotation practices, and privacy controls must support these data types.

### Subjective and weakly defined quality


Correctness may be only one dimension. Evaluation may also need to address relevance, completeness, groundedness, safety, tone, usefulness, consistency, and task completion.

### Long-tail failure modes


Many serious failures are rare, context-dependent, or difficult to observe in average metrics. Targeted sampling, synthetic generation, adversarial testing, and production feedback are required to expose them.

### Data and evaluation leakage


Foundation models may already have encountered benchmark material, public documents, or common evaluation examples. Evaluation datasets should be protected, refreshed, and assessed for contamination risk.

### Feedback loops


Model outputs can influence future user behaviour and future datasets. Accepted suggestions, generated labels, automated decisions, and user corrections may create self-reinforcing patterns or selection bias.

### Retrieval and knowledge freshness


For GenAI systems that use external knowledge, answer quality depends on corpus coverage, document freshness, chunking, metadata, access permissions, and retrieval quality as well as generation quality.

### Prompt, model, and data coupling


Behaviour can change when any of the following changes:

- the model or provider;
- system instructions;
- prompt templates;
- examples;
- retrieval configuration;
- tool schemas;
- context-window strategy;
- decoding parameters;
- safety controls.

These components should be versioned and evaluated together as a system configuration.

### Safety, privacy, and provenance


The system may reproduce sensitive, harmful, biased, copyrighted, confidential, or unverifiable material. Data provenance, permitted use, redaction, access control, safety evaluation, and human escalation should form part of the delivery process.

### Cost and latency dependence on data


Input size, output length, retrieval volume, document structure, and interaction patterns directly affect latency and operating cost. Production data analysis should therefore cover quality, cost, and performance together.

## Core artefacts


The workstream should maintain:

- data-source inventory and ownership map;
- data profile and representativeness assessment;
- task and failure-mode taxonomy;
- dataset catalogue with provenance and permitted use;
- evaluation dataset and regression suite;
- synthetic-data specifications and validation results;
- annotation guidelines and scoring rubrics;
- critical-slice definitions;
- data contracts and quality rules;
- retrieval-corpus specification;
- production telemetry and feedback-event schema;
- drift baselines and thresholds;
- data and evaluation lineage;
- known-limitations register;
- production issue-to-test-case traceability.

## Delivery controls


Typical governance controls include:

- no solution design approval without an initial data profile;
- no evaluation claim without documented dataset provenance and sampling;
- no release without representative evaluation and critical-slice analysis;
- no material model, prompt, retrieval, or data change without regression evaluation;
- no production operation without telemetry, drift baselines, and an accountable response process;
- periodic review of evaluation coverage against current production behaviour.

# Additional Areas


The following additions extend the data foundation to support the **entire AI system**, including prompts, retrieval, tools, models, user interaction, and operational controls.

## 1. Treat data as executable system configuration


In conventional applications, data is often an input to stable business logic. In AI systems, data can directly determine behaviour.

This includes:

- training and fine-tuning examples;
- system prompts and few-shot examples;
- retrieval documents and metadata;
- evaluation cases and scoring rubrics;
- tool descriptions and schemas;
- safety policies and refusal examples;
- user memory and contextual information.

These assets should be versioned, reviewed, tested, and released with the same discipline as code.

A useful principle is:

> A production AI system version is the combination of model, prompts, data, retrieval configuration, tools, policies, and inference parameters.

## 2. Separate evaluation data by purpose


A single "golden dataset" is usually insufficient. Distinguish the following purposes:

|Dataset|Purpose|
|---|---|
|Development set|Fast iteration during implementation|
|Acceptance set|Release decisions against product requirements|
|Regression set|Detection of previously fixed failures|
|Safety set|Harmful, adversarial, privacy, and misuse scenarios|
|Production sample|Measurement of actual workload performance|
|Challenge set|Rare, difficult, or high-risk scenarios|
|Drift reference set|Comparison against production distributions|
|Human-evaluation set|Calibration of subjective quality criteria|

This separation reduces overfitting to one benchmark and makes evaluation evidence more interpretable.

## 3. Preserve evaluation independence


AI teams frequently optimise against the same examples they use to claim quality. Over time, prompts, models, and developers become implicitly tuned to the evaluation set.

Controls should include:

- restricted access to final acceptance datasets;
- holdout datasets that are not used during development;
- periodic refresh of evaluation cases;
- checks for duplicate and near-duplicate examples;
- separation between prompt-development and release-evaluation data;
- tracking which datasets influenced each system version.

For foundation models, contamination can also occur before the project begins because public benchmark material may have appeared in model training data.

## 4. Validate synthetic data as a hypothesis


Synthetic data is valuable for coverage, but it should not automatically be treated as representative evidence.

For each synthetic dataset, capture:

- why synthetic generation is necessary;
- which production population it is intended to represent;
- generation model, prompt, parameters, and source examples;
- targeted dimensions and failure modes;
- similarity and diversity analysis;
- comparison against real production samples;
- known artefacts and limitations;
- whether synthetic examples are used for development, acceptance, or safety testing.

Synthetic data is particularly useful for:

- controlled variations;
- boundary and adversarial cases;
- rare scenarios;
- multilingual coverage;
- privacy-preserving experimentation;
- systematic testing of combinations.

It is weaker evidence for estimating real-world occurrence rates or overall production quality.

## 5. Model the task distribution, not only the raw data distribution


For GenAI systems, token-, embedding-, or field-level drift may not reveal the most important changes. The team should understand the distribution of user intents and tasks.

For example:

- summarisation versus extraction;
- informational versus transactional requests;
- single-document versus cross-document reasoning;
- simple versus multi-step tasks;
- supported versus unsupported use cases;
- low-risk versus high-risk decisions;
- queries requiring current information;
- requests requiring tools or human escalation.

A change in task mix may materially change product quality even where conventional statistical drift metrics remain stable.

## 6. Define an error taxonomy before selecting metrics


The evaluation system should distinguish failure classes rather than collapse them into one quality score.

Typical GenAI failure classes include:

- factually incorrect output;
- unsupported or ungrounded claims;
- omission of required information;
- incorrect interpretation of intent;
- retrieval failure;
- reasoning or calculation failure;
- tool-selection failure;
- tool-execution failure;
- invalid structured output;
- instruction-following failure;
- privacy or security violation;
- unsafe content;
- excessive refusal;
- inappropriate confidence;
- stale information;
- inconsistent output;
- poor interaction or recovery behaviour.

Each failure class may require different data, metrics, owners, and remediation.

## 7. Evaluate the pipeline, components, and final outcome separately


An AI product should be evaluated at several layers.

### Component evaluation


Measure individual mechanisms such as:

- document parsing;
- chunking;
- embedding quality;
- retrieval recall and ranking;
- reranking;
- classification;
- entity extraction;
- tool argument generation;
- structured-output validity.

### End-to-end evaluation


Measure whether the complete system successfully performs the user task.

### Outcome evaluation


Measure whether the product creates the intended business or operational result.

For example, a support assistant might generate a highly rated answer while still increasing resolution time or escalating cases incorrectly. Model-quality metrics alone would miss this.

## 8. Capture intermediate traces


For multi-stage GenAI systems, storing only the user input and final output is insufficient for diagnosis.

Subject to privacy and security constraints, telemetry should capture:

- system and prompt-template versions;
- model and inference configuration;
- retrieved document identifiers and scores;
- reranker results;
- tool selections and arguments;
- tool responses;
- validation and guardrail outcomes;
- retry and fallback behaviour;
- token usage;
- latency by stage;
- user corrections and final outcomes.

These traces allow the team to determine whether a failure came from data, retrieval, reasoning, tool execution, or presentation.

## 9. Distinguish quality monitoring from drift monitoring


Drift is an indicator, not proof that product quality has degraded. Conversely, quality can degrade without obvious distribution shift.

The production strategy should therefore include both:

### Distribution monitoring


- input length and structure;
- language and domain mix;
- intent and task mix;
- retrieval-score distributions;
- document and corpus composition;
- tool-use frequency;
- output characteristics.

### Quality monitoring


- task success;
- groundedness;
- correctness sampling;
- structured-output validity;
- escalation and override rates;
- user corrections;
- repeat queries;
- abandonment;
- downstream operational outcomes.

The strongest signals usually combine automated monitoring with periodically sampled human review.

## 10. Account for weak and delayed ground truth


Many AI products do not receive an immediate correct answer label.

Possible proxy signals include:

- user acceptance or rejection;
- edits to generated content;
- retries and reformulations;
- whether retrieved sources were opened;
- downstream task completion;
- escalation to a human;
- later reversals or corrections;
- operational outcomes observed days or weeks later.

These signals should be interpreted carefully. For example, user acceptance may indicate convenience rather than correctness.

## 11. Treat feedback data as biased


Production feedback is rarely representative.

Users who submit feedback may be:

- disproportionately dissatisfied;
- expert users who notice subtle errors;
- highly engaged users;
- users from particular regions or workflows;
- people affected by especially severe failures.

Implicit signals are also ambiguous. A user copying an answer does not prove that it was correct.

The workstream should document:

- who provides feedback;
- who does not;
- how feedback is sampled;
- how feedback is weighted;
- whether feedback can be manipulated;
- whether feedback enters training or evaluation datasets.

## 12. Introduce data flywheel controls


The production feedback loop should be explicit:

1. Observe production interactions.
2. Detect or sample failures.
3. Classify the failure.
4. Determine the responsible subsystem.
5. Add or update an evaluation case.
6. Implement remediation.
7. Run regression and acceptance evaluations.
8. Release through controlled rollout.
9. Confirm improvement in production.

A critical control is that production data should not automatically enter prompts, retrieval corpora, fine-tuning datasets, or evaluation sets without validation and governance.

## 13. Include model-change resilience


Hosted model providers can change model versions, behaviour, limits, pricing, latency, and safety policies.

The data foundation should support:

- repeatable evaluation across models;
- provider and model comparison;
- migration test suites;
- model-specific baselines;
- recording the exact model identifier where available;
- detection of behavioural changes;
- fallback and rollback testing.

Evaluation cases should represent product requirements rather than being written around one model's capabilities.

## 14. Make cost and latency first-class evaluation dimensions


AI system behaviour affects infrastructure and product economics.

The evaluation harness should record:

- input and output token counts;
- retrieval volume;
- number of model calls;
- number of tool calls;
- retry frequency;
- latency percentiles;
- cache hit rate;
- cost per task;
- cost by customer, use case, or quality tier.

Optimisation should be evaluated for quality impact. Reducing context size, model capability, retrieval depth, or reasoning effort can lower cost while creating subtle regressions.

## 15. Test variability and reproducibility


Because model outputs can vary, evaluation results should not always be based on one execution per case.

Depending on risk, the harness may need:

- repeated runs;
- fixed and varied seeds where supported;
- multiple temperature settings;
- stability measures;
- worst-case and percentile results;
- pass-rate confidence intervals;
- comparison across time windows.

A system that passes a scenario 70% of the time may still be unsuitable for a critical workflow.

## 16. Design for adversarial and untrusted data


GenAI applications commonly process content that can influence model behaviour.

Examples include:

- prompt injection in retrieved documents;
- malicious tool output;
- poisoned knowledge-base content;
- user attempts to expose system prompts;
- encoded or obfuscated instructions;
- documents designed to manipulate retrieval;
- indirect requests for confidential information.

The data foundation should therefore include adversarial corpora, provenance controls, trust classification, content sanitisation, and security-specific evaluation datasets.

## 17. Evaluate abstention and escalation


The system should be evaluated on when it should:

- answer;
- ask for clarification;
- retrieve more information;
- call a tool;
- state uncertainty;
- refuse;
- escalate to a human.

This is particularly important for incomplete, ambiguous, stale, conflicting, or high-risk inputs.

An AI product should not be evaluated only on the quality of answers it generates. It should also be evaluated on the quality of its decisions about whether and how to answer.

## 18. Test interactions, not only single turns


Many GenAI failures emerge over multiple turns:

- instruction drift;
- incorrect accumulation of context;
- propagation of an earlier error;
- privacy leakage between sessions;
- inconsistent answers;
- failure to recover after correction;
- excessive dependence on previous assistant output;
- context-window truncation.

Evaluation datasets should therefore include conversations, workflows, and state transitions rather than only isolated input-output pairs.

## 19. Make slices operationally meaningful


Slices should correspond to decisions the organisation can act on.

Useful slices might include:

- language;
- customer tier;
- document type;
- task complexity;
- risk category;
- user expertise;
- input length;
- retrieval availability;
- geographic or regulatory region;
- model or provider;
- tool dependency;
- supported versus unsupported task.

Each critical slice should have:

- an owner;
- minimum coverage;
- acceptance criteria;
- production monitoring;
- an escalation path.

## 20. Link data quality to product boundaries


Data analysis should sometimes lead to a decision not to automate a workflow.

Examples include:

- no reliable ground truth;
- insufficient representative data;
- outcomes cannot be observed;
- unacceptable label disagreement;
- high-risk edge cases cannot be detected;
- source data is stale or unauthoritative;
- required contextual information is unavailable.

The Data Foundation workstream should therefore inform:

- supported use cases;
- unsupported use cases;
- automation level;
- required human oversight;
- confidence and escalation behaviour;
- release sequencing.

## Suggested engineering principle


A proposed workstream principle is:

> **Every material production failure should become observable, classifiable, reproducible, and--where appropriate--represented in the evaluation system.**

And a second principle:

> **No AI quality claim should be made without specifying the dataset, population, task distribution, system version, metric, and uncertainty behind it.**

These make the Data Foundation workstream more operational and prevent it from becoming limited to dataset preparation and governance.

# Detailed guidance

## Production Data Understanding


The Data Foundation workstream should establish a systematic understanding of the data generated by real users, workflows, and operating environments.

Production data analysis should begin before detailed solution design and continue throughout the product lifecycle. It should inform product scope, model and architecture choices, evaluation coverage, risk controls, and improvement priorities.

The team should analyse:

- what users are attempting to accomplish;
- the distribution and frequency of tasks and intents;
- the characteristics, formats, quality, and complexity of inputs;
- differences across users, customers, languages, domains, channels, and operating contexts;
- common failure patterns, corrections, retries, overrides, escalations, and abandonment;
- unsupported or ambiguous requests;
- downstream outcomes and indicators of task success;
- changes in usage and traffic composition over time.

The analysis should identify both common workloads and rare but consequential scenarios.

Production data should not be treated as automatically representative or complete. The team should document which interactions are observable, which are excluded, and where instrumentation, privacy constraints, retention policies, or technical limitations create gaps.

### Key questions


The workstream should be able to answer:

- What does actual production usage look like?
- Which tasks and user populations account for most activity?
- Which scenarios create the greatest product or operational risk?
- Which important cases are missing or underrepresented in the available data?
- How does observed production usage differ from the assumptions made during design?
- Is the available production data sufficiently current and complete to support decisions?

### Core artefacts


- production data inventory;
- task and intent taxonomy;
- production data profile;
- user and workload segmentation;
- production coverage assessment;
- known data gaps and limitations;
- failure-mode taxonomy;
- production analysis dashboard.

## Production Sampling and Representativeness


The Data Foundation workstream should define how production traffic is sampled for analysis, labelling, evaluation, and monitoring.

The sampling process should provide a credible representation of real system usage while also ensuring sufficient coverage of important, rare, or high-risk scenarios.

The sampling strategy should define:

- the target production population;
- the unit of analysis, such as request, conversation, user, case, or completed workflow;
- the sampling frame and eligibility criteria;
- the sampling method;
- the sampling period and frequency;
- required coverage across critical slices;
- treatment of repeated interactions from the same users or workflows;
- handling of seasonality and traffic changes;
- privacy, access, consent, and retention requirements;
- known sources of selection or observation bias.

A combined sampling approach will normally be required.

### Random sampling


Random sampling should be used to estimate overall production behaviour and quality without deliberately favouring particular cases.

It supports questions such as:

- What proportion of production interactions succeed?
- What are the most frequent tasks and failure categories?
- What is the overall false-positive or false-negative rate?
- How has average production quality changed?

### Stratified sampling


Stratified sampling should ensure adequate representation of important production segments, including:

- languages;
- customer types;
- user groups;
- document or input types;
- task categories;
- geographic or regulatory regions;
- risk levels;
- input-complexity bands;
- supported product channels.

### Risk-based and targeted sampling


Risk-based and targeted sampling should be used for scenarios that are too rare to appear reliably in random samples.

Examples include:

- safety or security incidents;
- privacy-sensitive interactions;
- high-impact business decisions;
- prompt-injection attempts;
- low-confidence outputs;
- guardrail activations;
- user corrections;
- retrieval failures;
- tool-execution failures;
- escalations and operational incidents.

Where rare cases are intentionally oversampled, aggregate results should be weighted or reported separately so that they are not misrepresented as production prevalence.

### Representativeness controls


The workstream should periodically compare sampled data with the broader production population.

This comparison should cover:

- task and intent distribution;
- user and customer distribution;
- language and geographic distribution;
- input lengths and formats;
- model, channel, and product configuration;
- time periods and seasonality;
- risk categories;
- outcome availability;
- feedback availability.

Sampling gaps and biases should be documented as limitations of any resulting analysis or quality claim.

### Core artefacts


- production sampling plan;
- sampling-frame definition;
- sample dataset specification;
- sampling coverage dashboard;
- critical-slice coverage report;
- production representativeness assessment;
- sampling-bias register;
- sample weighting methodology.

## Ground Truth, Labels, and Annotation


The Data Foundation workstream should establish how correct, acceptable, or expected outcomes are defined and captured.

Ground truth may be derived from:

- authoritative business records;
- verified downstream outcomes;
- subject-matter expert decisions;
- human annotation;
- user corrections;
- operational resolutions;
- trusted reference documents;
- formally defined rules.

The team should define:

- what constitutes ground truth for each task;
- whether an objective correct outcome exists;
- which sources are authoritative;
- who is qualified to assign labels;
- when the outcome becomes available;
- how ambiguous cases are represented;
- how disagreement is resolved;
- how label confidence is recorded;
- how labels are versioned and reviewed.

For subjective GenAI tasks, a single binary label may be insufficient. Structured rubrics may be required for dimensions such as:

- correctness;
- completeness;
- relevance;
- groundedness;
- instruction following;
- safety;
- consistency;
- usefulness;
- task completion.

### Annotation quality controls


Annotation processes should include:

- clear annotation guidelines;
- representative examples;
- reviewer training;
- calibration exercises;
- double-labelling of selected cases;
- inter-reviewer agreement analysis;
- adjudication procedures;
- explicit treatment of uncertain cases;
- periodic review of label consistency;
- traceability to source evidence.

Cases for which no reliable outcome can be determined should be marked as ambiguous or unresolvable rather than forced into an unreliable label.

### False positives and false negatives


The Data Foundation workstream should ensure that the labelled data required to analyse false positives and false negatives is available and trustworthy.

This requires:

- a defined positive and negative condition;
- reliable reference outcomes;
- sufficient positive and negative examples;
- known class prevalence;
- representative sampling;
- slice and contextual information;
- traceability between inputs, system outputs, and verified outcomes.

Calculation and interpretation of precision, recall, sensitivity, specificity, and related metrics may sit within an Evaluation capability, but the validity of those measures depends on the Data Foundation.

### Core artefacts


- ground-truth definition;
- label taxonomy;
- annotation guidelines;
- scoring rubrics;
- reviewer qualification criteria;
- adjudication procedure;
- label-quality report;
- inter-reviewer agreement analysis;
- labelled production sample;
- ambiguous-case register.

## Evaluation Data Foundation


The Data Foundation workstream should provide the datasets required to evaluate the AI system across development, release, and production operation.

Evaluation data should reflect:

- real production tasks;
- expected user populations;
- common usage patterns;
- critical product slices;
- rare and high-impact cases;
- known historical failures;
- safety and security risks;
- unsupported and ambiguous scenarios;
- expected operating conditions.

Evaluation datasets should be separated by purpose.

### Development datasets


Used for rapid iteration during implementation. Developers may inspect and repeatedly use these cases.

### Acceptance datasets


Used to determine whether the system meets release requirements. Access and reuse should be controlled to reduce overfitting.

### Regression datasets


Used to ensure that previously identified and corrected failures do not reappear.

### Production-derived datasets


Constructed from representative samples of production traffic and used to estimate real-world quality.

### Challenge datasets


Designed to exercise rare, complex, adversarial, or high-risk conditions.

### Safety and security datasets


Used to test harmful requests, privacy leakage, prompt injection, data exfiltration, unsafe tool use, and other misuse scenarios.

### Drift reference datasets


Used as baselines for detecting changes in workload, data characteristics, and system behaviour.

### Evaluation data controls


Each evaluation dataset should have:

- a clearly defined purpose;
- a target population;
- documented sampling methodology;
- provenance and lineage;
- versioning;
- ownership;
- labelling methodology;
- known limitations;
- critical-slice coverage;
- access controls;
- leakage and contamination controls;
- refresh criteria.

Evaluation datasets should not be treated as permanent. They should be updated as production usage, system capabilities, risks, and failure modes change.

## Synthetic Data


Synthetic data generation should be treated as a controlled data-engineering capability used to expand evaluation coverage and test specific hypotheses about system behaviour.

Synthetic data is particularly useful for:

- rare scenarios;
- boundary conditions;
- adversarial and safety cases;
- controlled parameter variations;
- multilingual and format variations;
- privacy-sensitive experimentation;
- systematic combinations of conditions;
- testing scenarios that have not yet occurred in production.

Synthetic data should complement rather than replace production-derived evidence.

It is generally less suitable for estimating:

- real production prevalence;
- average production quality;
- natural user behaviour;
- unexpected failure patterns;
- real-world linguistic and contextual variation.

### Synthetic data specification


Each synthetic dataset should document:

- its intended purpose;
- the production population or scenario it is intended to approximate;
- the source examples or distributions used;
- the generation model and version;
- prompts, templates, rules, and parameters;
- targeted dimensions of variation;
- expected labels or outcomes;
- validation procedures;
- known artefacts and limitations.

### Synthetic data validation


Synthetic datasets should be assessed for:

- realism;
- diversity;
- duplicate and near-duplicate cases;
- coverage of intended dimensions;
- artefacts introduced by the generating model;
- similarity to production examples;
- differences from production distributions;
- label consistency;
- contamination or leakage;
- excessive dependence on one model's style or assumptions.

Synthetic results should be reported separately from production-derived results where their evidential meaning differs.

### Core artefacts


- synthetic data specification;
- generation pipeline;
- generation prompt and configuration registry;
- provenance record;
- synthetic-to-production comparison;
- diversity and duplication analysis;
- validation report;
- synthetic data limitations statement.

## Data Sufficiency


The Data Foundation workstream should assess whether available data is sufficient to support the intended analysis, evaluation, or product decision.

Data sufficiency should not be determined by record count alone.

A dataset may be insufficient when:

- the relevant event is rare;
- there are too few positive or negative examples;
- critical slices have limited coverage;
- observations are highly correlated;
- labels are unreliable;
- data is stale;
- important populations are missing;
- the outcome cannot be observed;
- missing data is systematic;
- the sample is biased;
- the expected effect is small relative to natural variation.

The assessment should consider:

- sample volume;
- class prevalence;
- positive and negative case counts;
- critical-slice coverage;
- recency;
- independence of observations;
- missingness;
- representativeness;
- label quality;
- outcome availability;
- expected variability;
- intended use of the dataset.

### Data sufficiency statement


Material evaluation or analysis results should include a data sufficiency statement describing:

- the population represented;
- the sampling method;
- the number of observations;
- relevant class counts;
- slice coverage;
- missing or excluded data;
- label reliability;
- known biases;
- limitations on interpretation.

The workstream should distinguish between:

- sufficient data for exploratory analysis;
- sufficient data for directional comparison;
- sufficient data for release evaluation;
- sufficient data for estimating production quality;
- insufficient data to support a conclusion.

Statistical power, hypothesis testing, and causal attribution may be owned by an Evaluation or Experimentation capability. The Data Foundation should supply the reliable, representative, and appropriately characterised data required for that analysis.

### Core artefacts


- data sufficiency assessment;
- class-prevalence analysis;
- critical-slice coverage report;
- missing-data analysis;
- observation-dependence assessment;
- data limitations statement;
- evidence-readiness checklist.

## Production Data Shift


The Data Foundation workstream should detect and characterise changes in production data and operating conditions that may affect system quality.

Relevant changes include:

- input distribution shift;
- task-mix shift;
- user or customer population shift;
- language or geographic shift;
- changes in input complexity or format;
- class-prevalence shift;
- changes in user behaviour;
- changes in feedback patterns;
- changes in source documents or retrieval corpora;
- changes in knowledge freshness;
- changes in upstream systems or schemas.

The purpose of data-shift monitoring is to identify when the assumptions behind evaluation datasets, sampling strategies, labels, and release evidence may no longer hold.

### Shift monitoring design


For each material shift, the team should define:

- the monitored population;
- baseline period;
- relevant features and dimensions;
- comparison method;
- alert threshold;
- minimum volume requirements;
- critical slices;
- investigation procedure;
- accountable owner;
- remediation options.

Data-shift alerts should trigger investigation rather than automatically being interpreted as quality degradation.

A shift may require:

- refreshed production analysis;
- changes to the sampling strategy;
- new evaluation cases;
- updated slice definitions;
- re-labelling;
- retrieval-corpus refresh;
- product-scope changes;
- additional monitoring;
- re-evaluation of the system.

### Core artefacts


- production data baseline;
- shift-monitoring specification;
- drift and shift dashboard;
- threshold definitions;
- traffic-composition report;
- shift investigation record;
- dataset refresh decision;
- remediation and re-evaluation plan.

## Production Evidence Traceability


The Data Foundation workstream should maintain traceability between production observations and the datasets used to improve and evaluate the system.

The team should be able to trace:

- a production issue to the originating interaction or workflow;
- the issue to a defined failure category;
- the failure category to a labelled or reviewed example;
- the example to an evaluation or regression dataset;
- the dataset to the system versions evaluated against it;
- the resulting remediation to subsequent production evidence.

Production interactions should not automatically enter evaluation, training, fine-tuning, retrieval, or prompt datasets.

Before reuse, production data should be subject to:

- privacy and access review;
- permitted-use verification;
- quality checks;
- deduplication;
- labelling or adjudication;
- provenance capture;
- security review;
- dataset assignment;
- versioning.

### Engineering principle


> Every material production failure should be observable, classifiable, reproducible, and, where appropriate, represented in the evaluation data.

### Core artefacts


- production issue-to-dataset traceability;
- failure-example register;
- dataset inclusion record;
- provenance and permitted-use record;
- regression-case history;
- data remediation backlog.

## Data Foundation Boundary


The Data Foundation workstream is responsible for ensuring that evidence is:

- observable;
- accessible under appropriate controls;
- representative;
- traceable;
- sufficiently complete;
- correctly labelled;
- appropriately segmented;
- current enough for its intended use;
- accompanied by explicit limitations.

Adjacent Evaluation and Experimentation capabilities are responsible for determining:

- which metrics should be calculated;
- how model and product quality should be assessed;
- whether observed differences are statistically or operationally meaningful;
- whether a hypothesis is supported;
- whether an observed effect can be attributed to a change;
- whether release or rollback criteria have been met.

A concise boundary statement is:

> **Data Foundation establishes whether the available evidence is trustworthy and fit for use. Evaluation and experimentation determine what conclusions can validly be drawn from that evidence.**

## Library sources


- [Guerdan et al. 2024](/sources/2478056b91cd37d03393aedc5b4b14b3.bin), *A Framework for Evaluating LLMs Under Task Indeterminacy* ([arXiv:2411.13760](https://arxiv.org/abs/2411.13760))
- [Huyen 2022](/sources/5bbe42519087c94b06ff1a96c39c6566.bin), *Designing Machine Learning Systems* -- on *Data shifts to monitor*

Further reading:

- [Bean et al. 2025](/sources/015e29150096f262478300d13488bbc2.bin), *Measuring what Matters*
- [Chizhov et al. 2025](/sources/0d0f57129a2ce4bb6104c39c80966d31.bin), *What the HellaSwag? On the Validity of Common-Sense Reasoning Benchmarks* ([arXiv:2504.07825](https://arxiv.org/abs/2504.07825))
- [Eriksson et al. 2025](/sources/5078ee4dc38d25871465fce92643eb36.bin), *Can We Trust AI Benchmarks? An Interdisciplinary Review of Current Issues in AI Evaluation* ([arXiv:2502.06559](https://arxiv.org/abs/2502.06559))
- [Wagner-Kaiser 2026](/sources/a971bcbca65dc7fbbfd3db846ca8eb23.bin), *Teaching Computers to Read* ([doi:10.1201/9781003389057](https://doi.org/10.1201/9781003389057))
- [Crowe et al. 2025](/sources/9bdb311d9dc70483a0a6259884229758.bin), *Machine Learning Production Systems*
- Dowling 2025, *Building Machine Learning Systems with a Feature Store*
- [Confluent 2025](/sources/58d654d85ac8cbe08a56759f02bbfc35.bin), *The Developer's Guide to RAG with Data Streaming*
