---
draft: false
toc: true
title: "Evidence in Software Engineering"
description: "What evidence a claim about engineering practice needs: ten principles, from stating the claim and arguing for the measure to comparison, method, replication and scrutiny of the evidence itself, with the practices that apply them."
linkTitle: "Evidence"
---

Much of what engineers believe about their own practice reaches them as advice, experience reports, conference talks and numbers repeated from one book to the next. Methodologies are adopted and abandoned with little tested evidence either way. These notes ask what evidence a claim about engineering practice should have, how to read the evidence that exists, and what to do when there is none.

The question is older than AI tools and does not depend on them. Claims that coding agents make teams faster are the newest case of it, and most examples in these notes come from that case. The [evidence appraisal]({{< ref "ai-engineering/evaluation/theoretical-methodology/appraisal" >}}) notes apply the same principles to claims about AI tools.

## Principles


1. **Say exactly what is claimed.** Name the outcome, population, intervention, comparison and time, and say whether the claim is descriptive, associational, causal or speculative. → [Stating a claim]({{< ref "engineering/evidence/stating-claims" >}})
2. **Argue that the measure measures the thing.** A count stands for a concept such as productivity only with an argument that it does, and a count that becomes a target stops measuring. → [Measures and constructs]({{< ref "engineering/evidence/measures-and-constructs" >}})
3. **A causal claim needs a comparison.** Name the experiment that would settle the claim, then look for confounders and for patterns that only look like effects. → [Causal claims need a comparison]({{< ref "engineering/evidence/causal-claims" >}})
4. **Fix what counts before looking.** Choose the primary outcome, exclusions and analysis before the data is seen. → [Preregistration]({{< ref "engineering/evidence/running-experiments" >}}#preregistration)
5. **Report how big, how sure and how far.** An effect estimate with its uncertainty, its practical significance and the population it covers, not a verdict. → [Reporting an estimate]({{< ref "engineering/evidence/stating-claims" >}}#reporting-an-estimate), [Four kinds of validity]({{< ref "engineering/evidence/validity" >}})
6. **Match the method to the question.** Benchmarks, experiments, case studies, longitudinal studies and reviews each answer a different kind of question. → [Choosing a method]({{< ref "engineering/evidence/choosing-a-method" >}})
7. **Look past the moment of change.** Some costs appear months after the change that caused them. → [Longitudinal studies]({{< ref "engineering/evidence/choosing-a-method" >}}#longitudinal-studies)
8. **One study is a finding.** Confidence comes from replication and synthesis, and repetition by citation is not replication. → [Replication and synthesis]({{< ref "engineering/evidence/ebse" >}}#replication-and-synthesis), [Claims without evidence]({{< ref "engineering/evidence/claims-without-evidence" >}})
9. **Evidence informs a decision, and the decision is checked.** Evidence is combined with expertise and the circumstances of use, and the result is evaluated afterwards. → [Evidence-based software engineering]({{< ref "engineering/evidence/ebse" >}})
10. **Question the evidence too.** Ask whether the metric fits, whether the study was biased and what was left out, and revise. → [Critical stance]({{< ref "engineering/evidence/critical-stance" >}})

## Notes


**The problem**

- [Claims without evidence]({{< ref "engineering/evidence/claims-without-evidence" >}}) -- essays on why software methodologies fail to deliver what they promise, and Bossavit's account of software engineering "facts" that spread by citation alone.

**Principles**

- [Stating a claim]({{< ref "engineering/evidence/stating-claims" >}}) -- what a precise claim names, four kinds of claim, evidence rather than proof, and reporting an estimate.
- [Measures and constructs]({{< ref "engineering/evidence/measures-and-constructs" >}}) -- metrics as operationalizations, the dimensions of productivity, and measures that become targets.
- [Causal claims need a comparison]({{< ref "engineering/evidence/causal-claims" >}}) -- the target trial, confounders, and six patterns that look like effects.
- [Four kinds of validity]({{< ref "engineering/evidence/validity" >}}) -- construct, internal, external and conclusion validity, plus reproducibility.
- [Critical stance and evidence-based practice]({{< ref "engineering/evidence/critical-stance" >}}) -- the vocabulary around empirical, evidence-based and hypothesis-driven engineering, and why measuring a metric is not yet an answer.

**Practices**

- [Choosing a method]({{< ref "engineering/evidence/choosing-a-method" >}}) -- which method answers which claim: benchmarks, case studies, mixed methods, longitudinal studies, and why an experience report is not a case study.
- [Running an experiment]({{< ref "engineering/evidence/running-experiments" >}}) -- the five-stage experiment process, method-specific standards, and preregistration.
- [Evidence-based software engineering]({{< ref "engineering/evidence/ebse" >}}) -- the five steps for using evidence, the skill and lifecycle factors, and how replication and synthesis build confidence.

**Applied to AI tools**

- [AI engineering evidence protocol]({{< ref "ai-engineering/evaluation/theoretical-methodology/appraisal/evidence-protocol" >}}) -- evidence requirements for a productivity claim about coding agents.
- [A Zalando case critique]({{< ref "ai-engineering/evaluation/theoretical-methodology/appraisal/zalando-case-critique" >}}) -- one company's report on agentic engineering, read against these principles.

## Open questions


- **What would show that a practice works?** For Scrum, TDD, code review or microservices, what outcome would count, compared with what, and for which teams? The [skill factor]({{< ref "engineering/evidence/ebse" >}}#skill-and-lifecycle-factors) says outcomes depend heavily on the people involved.
- **Which of the "facts" I repeat have a source?** Bossavit traces the cone of uncertainty, the 10x programmer and the rising cost of defects back to their citations and finds them weaker than their reputation. Which other claims in these notes need the same check?
- **How long until a practice can be judged?** The *lifecycle factor* says some effects only appear after deployment, such as a change that looks cheap when merged and costs more in maintenance months later.
- **What replaces research when it is missing or does not fit?** EBSE's fourth step combines evidence with expertise and the circumstances of use. Where does the line run between that and opinion, and when is a small local experiment the better source?
- **What can an experience report or a vendor case study show?** It can describe what happened. It rarely shows what caused it.
- **Is the measure the right one?** A critical empirical stance asks whether the metric fits the question, as well as what the metric says.

## Related


- [AI systems require behavioral evidence]({{< ref "ai-engineering/approach/behavioral-evidence" >}}) -- the AI-specific case: why the quality of an AI system has to be shown by observing its behavior.
- [Disciplined AI experimentation]({{< ref "ai-engineering/approach/experimentation" >}}) -- what a useful AI experiment names, from the decision to the judgment rule.
- [A practical way to study coding-agent improvements]({{< ref "ai-engineering/agents/agents-md/coding-agent-experimentation-primer" >}}) -- EBSE, experiments, case studies, design science and grounded theory applied to `AGENTS.md`.
- [Capability claims and empirical method]({{< ref "ai/capabilities/empirical-method-map" >}}) -- where these ideas reappear across the AI notes.
- [Engineering experiments]({{< ref "engineering/eng-exp" >}}) -- exploratory design and experiments as a way to learn about a system.

## Library sources


- [Bossavit 2015](/sources/software-engineering/process-and-agile/bossavit-2015-leprechauns-of-software-engineering.pdf.enc), *The Leprechauns of Software Engineering* -- folklore that spreads by citation; on *Why you should care about empirical results* (ch. 3) and *A new model of inquiry* (ch. 15)
- [Wohlin et al. 2024](/sources/research-methods/empirical-methods/wohlin-2024-experimentation-in-software-engineering.pdf.enc), *Experimentation in Software Engineering* -- the standard text on empirical studies and experiments in software engineering, cited across the principles and practices notes
- [Trochim et al. 2016](/sources/research-methods/empirical-methods/trochim-2016-research-methods-essential-knowledge-base.pdf.enc), *Research Methods: The Essential Knowledge Base* -- measurement, causality, validity and inference, cited in the principles notes
- [Felderer and Travassos 2020](/sources/research-methods/empirical-methods/felderer-2020-contemporary-empirical-methods-in-software-engineering.pdf.enc), *Contemporary Empirical Methods in Software Engineering* -- study strategies, data analysis and evidence synthesis; on *The Evolution of Empirical Methods in Software Engineering*

Further reading:

- [Mendez et al. 2024](/sources/research-methods/empirical-methods/mendez-2024-handbook-on-teaching-empirical-software-engineering.pdf.enc), *Handbook on Teaching Empirical Software Engineering*
- [Wohlin and Runeson 2021](/sources/research-methods/empirical-methods/wohlin-2021-guiding-selection-of-research-methodology.pdf.enc), *Guiding the selection of research methodology in industry-academia collaboration in software engineering*
- [Farley 2022](/sources/software-engineering/craft/farley-2022-modern-software-engineering.pdf.enc), *Modern Software Engineering* -- software engineering framed as empirical learning and managing complexity
