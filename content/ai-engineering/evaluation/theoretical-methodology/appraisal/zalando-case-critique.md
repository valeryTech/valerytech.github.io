---
draft: false
toc: true
title: "A Zalando Case Critique"
aliases:
  - "/ai-engineering/evaluation/theoretical-methodology/appraisal/in-methodology/"
description: "Zalando's report on agentic engineering is a useful experience report and weak evidence that coding agents improve outcomes. The critique separates operational observations from causal evidence and sketches how the central thesis could be tested."
linkTitle: "Zalando Case Critique"
---

This note reads one engineering report against the principles in [Evidence in software engineering]({{< ref "engineering/evidence" >}}): [kinds of claim]({{< ref "engineering/evidence/stating-claims" >}}), [measures and constructs]({{< ref "engineering/evidence/measures-and-constructs" >}}), [causal claims]({{< ref "engineering/evidence/causal-claims" >}}) and [validity]({{< ref "engineering/evidence/validity" >}}). Part of [Evidence appraisal]({{< ref "ai-engineering/evaluation/theoretical-methodology/appraisal" >}}).

## Assessment


The article is a useful engineering experience report. It is weak evidence for whether coding agents improve software engineering outcomes.

The post does not use merged PR count as its primary proof. Its quantitative sections cover quarterly PR-size distributions, cyclomatic-complexity histories for four repositories, commit-message sizes, and a 20-40% lead-time figure for a separate risk-based approval bot. Much of the article concerns platform architecture, governance, training, and operational experience. ([Zalando Engineering](https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html "https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html"))

Methodologically, it is best treated as an **experience report with exploratory longitudinal telemetry**. It is close to an exploratory case study, but it does not provide the case-selection procedure, units of analysis, data-collection protocol, or chain of evidence expected from a formal software-engineering case study. The SIGSOFT standards explicitly distinguish experience reports from case studies that systematically collect and analyze data. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/docs/standards "https://www2.sigsoft.org/EmpiricalStandards/docs/standards"))

## Analysis of its main claims

### Platform adoption, credible descriptive evidence


The strongest part of the article is the description of Zalando's internal infrastructure: a multi-provider LLM proxy, approximately 2,000 monthly active users, six proxy pods, cost tracking, prompt-cache support, authentication integration, managed configurations, legal review, and internal knowledge-sharing processes. These are concrete operational facts and useful lessons for organizations with a similar scale and architecture. ([Zalando Engineering](https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html "https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html"))

The limitation is that adoption is not effectiveness. A monthly active user may have made one chat request, used an agent continuously, or accessed the proxy through a custom application. Direct GitHub Copilot usage is also separate from proxy usage. The article itself says that generic `User-Agent` headers make client identification difficult. Therefore, the reported MAU does not define the amount, type, or quality of agent use.

A more meaningful adoption measure would distinguish:

- chat, autocomplete, agentic coding, code review, and custom applications;
- occasional and sustained use;
- task types and agent autonomy;
- model, tool, and configuration versions;
- production and experimental work.

### PR-size distribution, a real trend with no causal attribution


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

### Cyclomatic complexity, exploratory and heavily confounded


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

### Commit-message size, an agent signature and not engineering impact


The commit-message graph may show a useful operational signature of agent activity. Extremely large commit messages, especially those containing command output, can justify linting or pre-commit constraints. ([Zalando Engineering](https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html "https://engineering.zalando.com/posts/2026/08/agentic-engineering-at-zalando-a-snapshot.html"))

It contributes little evidence about agent effectiveness. There is no evaluation of how accurately message size detects agent use, and no connection to software quality or productivity. The example containing a complete test log is an anecdotal failure case.

### Risk-based PR approval, a comparator that cannot support the causal claim


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

### Claims about behavior and learning, useful hypotheses


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

Developer productivity is particularly vulnerable to construct problems: PR count, PR size, and lead time can contribute to an evaluation, but none can stand alone. [Measures and constructs]({{< ref "engineering/evidence/measures-and-constructs" >}}#productivity-has-several-dimensions) gives the SPACE framework's dimensions.

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

## Library sources


- [Wohlin and Rainer 2022](/sources/259b57ac164515376430c68ba4848f6b.bin), *Is it a case study? A critical analysis and guidance* -- on *Assessment*

The methods behind the critique, and their sources, are in the notes of [Evidence in software engineering]({{< ref "engineering/evidence" >}}).
