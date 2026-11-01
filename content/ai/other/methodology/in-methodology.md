---
draft: false
toc: true
description: "Empirical software engineering, causal inference, and mixed methods give AI claims a testable basis. A critique of Zalando’s agent report separates operational observations from causal evidence."
title: "In Methodology"
linkTitle: "In Methodology"
---
# Methodological foundations for AI engineering


An evidence methodology for AI engineering can build on established scientific traditions, adapted to stochastic systems and human participation.

A useful combination is:

**Evidence-Based Software Engineering + Empirical Software Engineering + causal inference/social-science experiment design + open-science practices + HCI/qualitative methods.**

Together, these traditions support a coherent evidence discipline for AI engineering.

### 1. Evidence-Based Software Engineering should be the outer framework


Kitchenham, Dybå, and Jørgensen proposed Evidence-Based Software Engineering (EBSE) in 2004-2005, adapting evidence-based medicine. Their practitioner process is essentially:

1. Convert a practical problem into an answerable question.
2. Find the best available evidence.
3. Critically evaluate its validity, impact, and applicability.
4. Combine that evidence with practical experience and the actual context.
5. Evaluate what happened after applying the decision. ([ResearchGate](https://www.researchgate.net/publication/4083466_Evidence-based_software_engineering?utm_source=chatgpt.com "(PDF) Evidence-based software engineering"))

There is an interesting detail in the original paper that is especially relevant to AI engineering. The authors identified a **skill factor**--software outcomes depend heavily on the people involved--and a **lifecycle factor**--it can be difficult to know how a technology will behave after deployment. They warned that these make SE experiments particularly vulnerable to bias and incomplete conclusions. ([ResearchGate](https://www.researchgate.net/publication/4083466_Evidence-based_software_engineering?utm_source=chatgpt.com "(PDF) Evidence-based software engineering"))

Coding agents amplify both problems. An expert who knows exactly when to reject an agent's output may get very different results from a junior developer. And a PR that looks successful today may produce maintenance cost six months later.

EBSE supplies the guiding principle:

> Engineering decisions should be based on critically evaluated evidence, with explicit applicability limits.

EBSE primarily guides the consumption and synthesis of evidence. A complete methodology also needs rules for **producing** good evidence.

### 2. Empirical Software Engineering already has a methodology for experiments


This is probably the strongest thing to borrow.

Wohlin et al.'s _Experimentation in Software Engineering_, updated in 2024, describes experimentation as a five-stage process: **scoping -> planning -> execution -> analysis -> result presentation**. The new edition explicitly covers research design, A/B testing, replication, open science, validity threats, surveys, and case studies. ([Lund University](https://portal.research.lu.se/en/publications/experimentation-in-software-engineering-2024-edition/ "Experimentation in Software Engineering (2024 edition) - Lund University"))

Even more useful is the ACM SIGSOFT **Empirical Standards for Software Engineering** project. It contains different standards for controlled experiments, benchmarking, case studies, longitudinal studies, repository mining, surveys, mixed methods, replication, systematic reviews, and other methods. The authors explicitly argue that evidence standards need to be method-specific because the standard for a controlled experiment is different from the standard for an ethnographic case study. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/about/ "About | Empirical Standards"))

For controlled experiments, their requirements are close to the needs of an AI-engineering protocol. They require formal hypotheses; defined dependent and independent variables; discussion of confounding variables; justified sample sizes; explicit experimental design and treatment allocation; justified experimental objects; appropriate statistical analysis; effect sizes with confidence intervals; and discussion of construct, internal, external, and conclusion validity. Preregistration and publishing protocols, raw data, and analysis scripts are recommended. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/docs/standards "Standards | Empirical Standards"))

One requirement directly addresses claims based on PR counts: **construct validity**.

If someone says:

> "Agents improved engineering productivity."

"Engineering productivity" is a theoretical construct. Its operational definition must be explicit.

If the operationalization is:

> productivity = number of merged PRs

the immediate scientific question becomes:

> Does merged-PR count actually measure engineering productivity?

The SIGSOFT standards explicitly warn against bad proxy variables and unvalidated operationalizations--for example, using a simple observable metric as a proxy for a more complex construct. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/docs/standards "Standards | Empirical Standards"))

That seems like a foundational AI-engineering rule:

**Every metric must come with an argument for why it measures the thing being claimed.**

### 3. Social science provides a framework for reasoning about causality


This becomes important when someone moves from:

> "Teams using agents merged 30% more PRs."

to:

> "Agents caused a 30% productivity improvement."

Those are different claims.

Causal inference requires specifying the intervention, outcome, population, time period, competing intervention, and plausible confounders. Randomized experiments are the cleanest way of controlling many confounders. When randomization isn't feasible, causal-inference research uses observational and quasi-experimental designs while making the assumptions explicit. Harvard's CAUSALab, for example, uses the "target trial" idea: define an ideal randomized experiment, then structure the observational analysis to emulate it as closely as possible. ([Harvard Chan School](https://hsph.harvard.edu/research/causalab/ "CAUSALab | Harvard T.H. Chan School of Public Health"))

That transfers extremely well to engineering organizations.

Suppose a company says:

> "After adopting coding agents, feature delivery became 25% faster."

Before attributing that change to agents, ask what the hypothetical experiment would have been.

An example definition is:

`Population`: experienced backend engineers working on ordinary product tasks

`Treatment`: coding agent with defined model/tools/configuration

`Control`: existing IDE/tooling

`Outcome`: total human engineering time required for an accepted production change

`Assignment`: comparable tasks randomly assigned to treatment/control

`Follow-up`: 90 days after merge

Now the claim has a scientific meaning.

Without that framing, organizational data can have dozens of confounders: different projects, engineer skill, deadlines, team changes, improved tooling, task selection, management pressure, or engineers selectively using agents on easy work.

### 4. The four kinds of validity are especially useful


Experimental social science distinguishes several different ways an experiment can be wrong. The SIGSOFT standards use essentially the same framework, and a July 2026 paper specifically proposing standards for randomized AI evaluations builds on these established validity frameworks. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/docs/standards "Standards | Empirical Standards"))

An AI-engineering evaluation should address four validity questions:

|Validity|Question for AI engineering|
|---|---|
|Construct validity|Does the measurement capture the claimed construct? Does "PR count" measure productivity?|
|Internal validity|Did the agent cause the observed difference, or was something else responsible?|
|External validity|Does the result apply to other engineers, repositories, tasks, models, and organizations?|
|Conclusion validity|Do the data and statistical analysis actually support the conclusion?|

This is much more useful than asking simply, "Was the experiment successful?"

A coding-agent experiment could have excellent internal validity and terrible external validity: perhaps the agent performs well on 30 carefully selected CRUD tasks completed by experienced Python engineers. That's meaningful evidence for that population. It isn't evidence that "AI agents improve software engineering."

### 5. Hypothesis testing should be used, but "proof" needs careful language


The discipline benefits from a consistent vocabulary for evidence and proof.

Formal mathematical statements can be proven. Empirical claims accumulate **evidence** under assumptions.

So instead of:

> "Agents have been proven to improve developer productivity."

the scientifically appropriate claim looks more like:

> "Under conditions X, treatment A produced an estimated 17% reduction in engineering time compared with B, with this uncertainty interval and these identified limitations."

The ACM experimental standard requires hypotheses, appropriate statistical tests, effect sizes and confidence intervals, and explicit discussion of alternative explanations. It also recommends separating evidence-based results from interpretation and speculation. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/docs/standards "Standards | Empirical Standards"))

And the statistical literature strongly cautions against reducing evidence to whether `p < 0.05`; the American Statistical Association has issued formal guidance specifically because p-values are commonly overinterpreted. ([Amstat Magazine](https://magazine.amstat.org/blog/2016/03/07/pvalue-mar16/?utm_source=chatgpt.com "ASA Releases 'Statement on Statistical Significance and P ..."))

Engineering evaluations should therefore emphasize:

`effect estimate + uncertainty + practical significance + assumptions`

A 3% productivity gain can be statistically convincing and economically irrelevant. A 30% estimated gain with huge uncertainty may be commercially interesting but scientifically weak.

### 6. Preregistration solves a surprisingly important AI problem


Before running an experiment, record:

> hypothesis
> primary outcome
> secondary outcomes
> dataset/task selection procedure
> exclusion rules
> statistical analysis
> stopping rule

Then run it.

This is called **preregistration**. Registered Reports go further by having the experimental protocol reviewed before the results are known. The Center for Open Science describes this specifically as a mechanism for separating hypothesis-driven analysis from decisions made after observing results. ([Center for Open Science](https://www.cos.io/initiatives/registered-reports "Registered Reports"))

This would be valuable in AI because there are often dozens of possible metrics.

A comparison of agent A with agent B might show:

- A generates code faster.
- B produces fewer lines.
- A gets higher test coverage.
- B requires fewer review comments.
- A gets more PRs merged.

Choosing "merged PRs" after observing that it favors A introduces researcher degrees of freedom.

Preregistering:

> "The primary outcome is total engineer minutes from task assignment through accepted merge"

makes the experiment considerably harder to manipulate unconsciously.

### 7. Benchmarking is useful, but benchmark design itself needs evidence


The SIGSOFT benchmarking standard says a benchmark should define what quality is being measured, the metrics, the measurement method, and the workload/task sample. It should justify why that workload represents the intended use, run enough repetitions to assess stability, and provide enough information for independent replication. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/docs/standards "Standards | Empirical Standards"))

This is extremely relevant to LLMs.

A 72% benchmark success rate is insufficient without a description of the benchmark and its limits.

The evaluation should establish:

> Where did those tasks come from?
> What distribution do they represent?
> Could the model have seen them?
> How were tasks selected?
> What constitutes success?
> How many attempts were allowed?
> What tools and context were available?
> How variable are results across repeated runs?

For stochastic systems, the unit of evaluation often needs to become a **distribution of outcomes**, rather than one successful run.

### 8. Case studies and qualitative methods are also necessary


Controlled experiments answer certain questions well. They can lose the context that determines why an agent succeeds or fails.

Runeson and Höst's software-engineering case-study methodology came directly from social-science and information-systems research. They argue that case studies are appropriate when software-engineering phenomena need to be studied in their real organizational context. They define a process of study design, preparation, evidence collection, analysis, and reporting. ([Springer](https://link.springer.com/article/10.1007/s10664-008-9102-8 "Guidelines for conducting and reporting case study research in software engineering | Empirical Software Engineering | Springer Nature Link"))

For agents, this could answer questions like:

> Why do senior engineers abandon generated solutions?
> When do engineers stop checking agent output?
> What kinds of architectural errors escape normal review?
> How does agent use change code-review behavior?
> What causes developers to trust incorrect suggestions?

Those aren't secondary questions. They can explain why a quantitative result exists.

This leads to **mixed methods**: combine quantitative experiments with interviews, observations, think-aloud sessions, repository analysis, and production data. The SIGSOFT standard explicitly treats multiple methods as a way to corroborate, complement, and expand findings, including investigation of cases where the different methods disagree. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/docs/standards "Standards | Empirical Standards"))

### 9. Longitudinal studies solve the "merged today, expensive tomorrow" problem


Longitudinal evaluation is particularly useful for detecting overengineering costs.

The empirical-SE standards explicitly define longitudinal studies for phenomena such as productivity and technical debt that need repeated observation over time. They require appropriate treatment of repeated measurements, attrition/missing data, construct validity, confounding, and time-related analysis. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/docs/standards "Standards | Empirical Standards"))

So a serious coding-agent evaluation might measure:

`T0`: task completed

`T+1 day`: review effort

`T+30 days`: bugs/rework

`T+90 days`: modifications and maintenance

`T+180 days`: incidents, complexity, abandonment/refactoring

That could reveal a hidden cost transfer: an agent appears productive at merge time while transferring work into future maintenance.

### 10. Replication and evidence synthesis should determine confidence in a finding


One company study should create a finding, not an industry truth.

Independent teams should repeat the experiment using other repositories, engineers, task distributions, and models. Eventually systematic reviews and meta-analysis can combine those experiments. The SIGSOFT standards already define systematic-review requirements including reproducible search procedures, inclusion criteria, study-quality assessment, extraction procedures, bias mitigation, and a clear chain from evidence to conclusions. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/docs/standards "Standards | Empirical Standards"))

This connects back to EBSE: individual experiments create evidence; replication tests its stability; systematic reviews accumulate it; practitioners decide whether that accumulated evidence applies to their situation. ([ResearchGate](https://www.researchgate.net/publication/4083466_Evidence-based_software_engineering?utm_source=chatgpt.com "(PDF) Evidence-based software engineering"))

### Implications for AI engineering


These established methods support the following framing:

**AI Engineering = engineering of probabilistic systems using explicit empirical methodology.**

The protocol wouldn't prescribe "always run an RCT." Different claims require different methods.

A benchmark can establish **capability under defined conditions**. A randomized controlled experiment can support **causal claims** about productivity. A case study can establish **how and why** a workflow behaves as it does. A longitudinal study can establish **how outcomes evolve over time**. A systematic review can establish **what the total evidence currently supports**.

And every one of them should expose its assumptions, sampling, measurement, protocol, analysis, uncertainty, limitations, and artifacts.

Interestingly, there is already movement specifically in this direction for AI. A July 2026 preprint proposes 33 guidelines for randomized controlled trials in AI evaluation, explicitly drawing from software engineering, economics, psychology, health sciences, validity theory, and open science. Its stated goal addresses a shared methodological problem: AI evaluation lacks shared standards for producing cumulative, comparable evidence. ([arXiv](https://arxiv.org/abs/2605.02050 "[2605.02050] Principles and Guidelines for Randomized Controlled Trials in AI Evaluation"))

These traditions provide a substantial methodological foundation.

A coherent AI-engineering methodology can **combine the scientific machinery** from these disciplines--hypothesis formulation, construct definition, experimental units, randomization, controls, confounders, power, effect sizes, causal diagrams, preregistration, replication, validity analysis, triangulation, etc.--and turn it into a coherent methodology specifically for evaluating GenAI and agentic software systems. This supplies concrete mechanisms for an AI Engineering Evidence Protocol.

# informal analysis of zalando case

## Assessment


The article is a useful engineering experience report. It is weak evidence for whether coding agents improve software engineering outcomes.

The post does not use merged PR count as its primary proof. Its quantitative sections cover quarterly PR-size distributions, cyclomatic-complexity histories for four repositories, commit-message sizes, and a 20-40% lead-time figure for a separate risk-based approval bot. Much of the article concerns platform architecture, governance, training, and operational experience. ([Zalando Engineering](https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html "https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html"))

Methodologically, it is best treated as an **experience report with exploratory longitudinal telemetry**. It is close to an exploratory case study, but it does not provide the case-selection procedure, units of analysis, data-collection protocol, or chain of evidence expected from a formal software-engineering case study. The SIGSOFT standards explicitly distinguish experience reports from case studies that systematically collect and analyze data. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/docs/standards "https://www2.sigsoft.org/EmpiricalStandards/docs/standards"))

## Analysis of its main claims

### Platform adoption: credible descriptive evidence


The strongest part of the article is the description of Zalando's internal infrastructure: a multi-provider LLM proxy, approximately 2,000 monthly active users, six proxy pods, cost tracking, prompt-cache support, authentication integration, managed configurations, legal review, and internal knowledge-sharing processes. These are concrete operational facts and useful lessons for organizations with a similar scale and architecture. ([Zalando Engineering](https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html "https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html"))

The limitation is that adoption is not effectiveness. A monthly active user may have made one chat request, used an agent continuously, or accessed the proxy through a custom application. Direct GitHub Copilot usage is also separate from proxy usage. The article itself says that generic `User-Agent` headers make client identification difficult. Therefore, the reported MAU does not define the amount, type, or quality of agent use.

A more meaningful adoption measure would distinguish:

- chat, autocomplete, agentic coding, code review, and custom applications;
- occasional and sustained use;
- task types and agent autonomy;
- model, tool, and configuration versions;
- production and experimental work.

### PR-size distribution: a real trend, with no causal attribution


The chart shows a gradual change in the percentage distribution of PR sizes. The share of very small PRs decreases, while some larger categories increase. That is a legitimate descriptive result. ([Zalando Engineering](https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html "https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html"))

Several methodological problems prevent an attribution to coding agents.

First, the chart reports **percentage share**, not the absolute number of PRs. Because the categories sum to 100%, a decrease in one category necessarily raises the combined share of others. It does not establish whether Zalando produced more large PRs, fewer small PRs, or both.

Second, the data-selection process is missing. The report does not specify whether the analysis includes:

- dependency-update bots;
- generated code and lockfiles;
- bulk migrations;
- vendor files;
- documentation;
- repository imports;
- abandoned or unmerged PRs;
- all teams and repositories consistently across quarters.

Third, this appears to be an organization-level aggregate. A change in the mix of active teams or project types can produce an organization-wide trend even when no individual team changes its behavior.

Fourth, the release of Sonnet 4 is used as a temporal reference, but the article does not measure agent exposure at the PR level. Many other organizational, technical, and product changes occurred during the same period. Temporal coincidence provides a hypothesis, not a counterfactual.

The appropriate conclusion is:

> The aggregate PR-size distribution changed during a period of increasing agent adoption.

The article does not establish that agents caused the change.

PR size is also a risk and workflow indicator. It is not a success measure by itself. To assess consequences, Zalando would need to connect PR size with review time, defects found during review, reviewer participation, time to merge, reverts, incidents, and subsequent rework.

### Cyclomatic complexity: exploratory and heavily confounded


This is the weakest analytical section.

The article plots **total cyclomatic complexity** against commit number for four codebases: two Go and two Java repositories, with different ages, purposes, development stages, and adoption patterns. The selection procedure is not reported. ([Zalando Engineering](https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html "https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html"))

There are several problems:

1. **Total complexity mostly grows as software grows.** Adding ten simple functions increases total cyclomatic complexity even when each function remains easy to understand. The metric combines codebase size and local control-flow complexity.
2. **Commit number is not time or engineering effort.** One repository may make many small commits, another may squash large changes, and agent use may itself alter commit granularity. The x-axis is partly affected by the phenomenon under investigation.
3. **The repositories are not matched controls.** A new agent-built Go project, a ten-year-old open-source Go project, a four-year-old Java service, and a twelve-year-old macroservice undergoing code extraction do not provide comparable counterfactuals.
4. **Agent adoption is measured inconsistently.** The article acknowledges that `Co-authored-by` markers are incomplete. This creates exposure misclassification: some supposedly non-agent commits may be agent-assisted, and adoption is likely gradual rather than a clean breakpoint.
5. **No formal change-point analysis is reported.** The statement that inflection points can be "pinpointed" appears to be based on visual inspection. There are no slope estimates, uncertainty intervals, alternative breakpoints, or control series.
6. **The measurement tooling is unspecified.** The analyzer, version, exclusions, language-specific rules, generated-code treatment, and aggregation procedure are unspecified.

A stronger analysis would use calendar time, actual agent exposure, complexity per function or per thousand lines, the distribution of high-complexity functions, code size as a covariate, and matched repositories. It would use segmented time-series analysis or an event-study design and check whether the pre-adoption trends were comparable.

Even then, cyclomatic complexity would remain a proxy. The important outcomes are maintainability, review burden, defects, incidents, and future modification cost.

### Commit-message size: an agent signature, not engineering impact


The commit-message graph may show a useful operational signature of agent activity. Extremely large commit messages, especially those containing command output, can justify linting or pre-commit constraints. ([Zalando Engineering](https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html "https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html"))

It contributes little evidence about agent effectiveness. There is no evaluation of how accurately message size detects agent use, and no connection to software quality or productivity. The example containing a complete test log is an anecdotal failure case.

### Risk-based PR approval: the causal claim is unsupported by the comparator


The most concrete performance figure is that 33% of PRs are classified as low risk and auto-approved, with lead time reported as 20-40% lower "when compared with all PRs." The bot's rules are based on incident patterns and Zalando-specific infrastructure risks. ([Zalando Engineering](https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html "https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html"))

This is a useful intervention, but the reported comparison does not estimate its causal effect.

Low-risk PRs are likely to differ from medium- and high-risk PRs in size, affected systems, urgency, author experience, review difficulty, and team practices. Comparing auto-approved low-risk PRs with all PRs mixes the effect of auto-approval with the characteristics that made those PRs low risk.

The necessary comparison is one of:

- eligible low-risk PRs before and after auto-approval, with adjustment for time and repository;
- contemporaneous eligible low-risk PRs randomly assigned to auto-approval or ordinary review;
- a staggered rollout across teams, analyzed as a controlled longitudinal intervention.

Lead time is also only half of the evaluation. Removing an approval gate will mechanically shorten waiting time. The important safety questions are:

- How many low-risk classifications were wrong?
- Did auto-approved PRs have more reverts, incidents, emergency fixes, or later rework?
- How often were safe PRs unnecessarily classified as medium or high risk?
- How well calibrated was each risk category?
- What review effort was saved?
- Did authors split changes in ways that created hidden dependencies?

The reported 20-40% should therefore be described as a **difference in observed lead time**, not a demonstrated reduction caused by the bot.

It is also separate from coding-agent effectiveness. The article describes an incident-derived rule set; it does not state that the approval system is an LLM coding agent.

### Claims about behavior and learning: useful hypotheses


The article also states that engineers become attached to particular tools, that the approval bot changes how people divide PRs, and that using coding agents during training usually inhibits learning. Some of these observations are explicitly called anecdotal. ([Zalando Engineering](https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html "https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html"))

These are social and behavioral claims. Each requires a different method.

Tool attachment could be studied through interviews, surveys, and a crossover experiment in which engineers perform comparable work with different tools.

Behavior change from the approval bot could be studied using repository data before and after rollout, combined with interviews explaining why developers changed their PR structure.

Learning requires a randomized educational experiment with immediate tests, delayed retention tests, and transfer tasks. Completing an exercise faster does not show that a participant learned the concept. A useful design would compare manual coding, unrestricted agent use, and guided agent use, then test participants again several weeks later without assistance.

## Validity assessment


Using the standard empirical-software-engineering validity categories:

- **Construct validity:** "Agent adoption," "impact," "engineering quality," and "success" are not precisely defined. PR size, total complexity, MAU, and commit-message size are narrow proxies.
- **Internal validity:** There is no counterfactual for agent adoption. Project lifecycle, team composition, migrations, model releases, process changes, and repository characteristics are plausible alternative explanations.
- **Conclusion validity:** Sample sizes, distributions, uncertainty intervals, statistical models, and sensitivity analyses are absent.
- **External validity:** The evidence comes from one organization and four non-comparable repositories. Transfer to other organizations, languages, teams, and architectures is unknown.
- **Reproducibility:** The dataset, queries, repository-selection rules, analyzer configuration, and analysis scripts are not published.

The SIGSOFT experimental standards expect explicit variables, treatment definitions, confounders, sample-size justification, effect sizes with confidence intervals, alternative explanations, and validity analysis. Longitudinal studies should also account for repeated observations, missing data, third variables, and the operationalization of constructs. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/docs/standards "https://www2.sigsoft.org/EmpiricalStandards/docs/standards"))

Developer productivity is particularly vulnerable to construct problems. The SPACE framework argues that productivity cannot be represented by one activity metric or one dimension. It includes outcomes, activity, collaboration, satisfaction, and efficiency or flow. PR count, PR size, and lead time can contribute to such an evaluation, but none can stand alone. ([Microsoft](https://www.microsoft.com/en-us/research/publication/the-space-of-developer-productivity-theres-more-to-it-than-you-think/ "https://www.microsoft.com/en-us/research/publication/the-space-of-developer-productivity-theres-more-to-it-than-you-think/"))

## Session-data ethics


The article describes inspecting coding-agent session data and identifying an individual user with an unusually low cache-hit ratio. It does not describe employee notice, consent, data access, retention, de-identification, re-identification risk, or separation from performance management. Those controls may exist internally; they simply are not reported. ([Zalando Engineering](https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html "https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html"))

A scientific AI-engineering protocol should treat prompt logs, agent sessions, repository activity, and review behavior as employee behavioral data. The method should state who can access it, what purposes are allowed, how long it is retained, how individual identities are protected, and whether employees can challenge or withdraw data. Empirical-software-engineering ethics guidance explicitly identifies privacy, workplace monitoring, participant consent, reputation, and data protection as relevant concerns. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/docs/supplements "https://www2.sigsoft.org/EmpiricalStandards/docs/supplements"))

## What the article does well


The article is more credible than typical AI-adoption marketing because it reports inconvenient observations: larger PRs, rapidly accumulating complexity, cache failures, platform instability, poor tool metadata, tool attachment, training problems, and teams slowing delivery after generating oversized changes. It explicitly labels some findings as anecdotal and admits that more time is needed before interpreting the complexity curves. ([Zalando Engineering](https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html "https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html"))

It also combines several evidence sources: infrastructure telemetry, repository histories, incidents, agent sessions, training experience, and organizational observation. That is the beginning of a useful mixed-methods program.

Its strongest contribution is therefore:

> A detailed operational account of how a large engineering organization is enabling and governing agent use.

Its weakest contribution is:

> Evidence that coding agents improve productivity, software quality, or economic outcomes.

## How Zalando could test its central thesis


The central thesis appears to be that agents amplify existing engineering practices. That is testable.

A credible study could use the following protocol:

1. **Define the primary question.** For comparable production tasks, how does agent-assisted development affect total human effort and post-merge quality?
2. **Define the treatment.** Record the agent, model version, tool version, autonomy level, context sources, instructions, and actual session usage. "Agent adoption" is too vague.
3. **Define the experimental unit.** Usually the task or change request, with engineers, repositories, and teams treated as clustered sources of variation.
4. **Establish a counterfactual.** Randomize comparable tasks to agent-assisted and ordinary workflows, preferably using a counterbalanced crossover design. A staggered team rollout is another option. For already collected observational data, specify the hypothetical randomized trial first and emulate its eligibility criteria, treatment strategies, time zero, follow-up, and outcomes. This is the target-trial approach used in causal inference. ([OUP Academic](https://academic.oup.com/aje/article/183/8/758/1739860 "https://academic.oup.com/aje/article/183/8/758/1739860"))
5. **Measure several outcome classes.** The primary measure could be total human effort from task start through accepted deployment. Secondary measures should include review effort, review rounds, rework, reverts, defects, incidents, maintenance changes over 30-180 days, developer cognitive load, model and platform cost, and delivered product value.
6. **Pre-register and analyze uncertainty.** Define primary and secondary outcomes, exclusions, stopping rules, subgroup analyses, and statistical models before examining results. Report effect sizes and confidence intervals. Use team, repository, task type, and engineer experience in a multilevel analysis.

For the "amplification" hypothesis specifically, measure repository readiness before agent exposure and test an interaction such as:

`agent use × baseline repository health`

The repository-health measure must be defined before looking at agent outcomes. The hypothesis should then be tested on repositories that were not used to develop the readiness score.

## Final conclusion


The post supports these conclusions:

- Zalando has built substantial infrastructure and governance around LLM use.
- Agent-related activity is widespread enough to leave observable traces in engineering telemetry.
- Zalando's aggregate PR-size distribution changed over time.
- Four selected repositories show structural changes that are interesting enough for further investigation.
- Agent adoption creates operational, review, learning, security, and governance problems that need explicit controls.

The post leaves these questions unresolved:

- Whether coding agents caused the observed PR and complexity changes.
- Whether coding agents reduce total engineering effort.
- Whether they improve or degrade production quality and maintainability.
- Whether the benefits exceed model, platform, review, and rework costs.
- Whether the results transfer beyond Zalando.

For an AI Engineering Evidence Protocol, this article exposes a useful first rule: **every important statement should be labelled as descriptive, associational, causal, or speculative**. Most of Zalando's post is descriptive or associational. A few uses of words such as "impact" and "reduced" imply stronger causal evidence than the reported methodology provides.
