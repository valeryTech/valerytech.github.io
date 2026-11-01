---
draft: false
toc: true
title: "Evidence-Based Software Engineering"
description: "Evidence-based software engineering connects answerable questions, literature search, critical appraisal, practitioner expertise, and stakeholder values, then evaluates the effects of the chosen practice."
linkTitle: "EBSE"
---

Part of [Evidence in software engineering]({{< ref "engineering/evidence" >}}). [Claims without evidence]({{< ref "engineering/evidence/claims-without-evidence" >}}) describes the problem EBSE responds to.

Evidence-based software engineering (EBSE) is a research approach that utilizes empirical research methods to evaluate software engineering practices, tools, and standards. It aims to integrate the best available evidence from research with practical experience in software development. It relies on observation and experimentation to gather data about software engineering techniques.

## The five steps


Kitchenham, Dybå, and Jørgensen proposed Evidence-Based Software Engineering (EBSE) in 2004-2005, adapting evidence-based medicine ([doi:10.1109/ICSE.2004.1317449](https://doi.org/10.1109/ICSE.2004.1317449)). Their practitioner process is essentially:

1. Convert a practical problem into an answerable question.
2. Find the best available evidence.
3. Critically evaluate its validity, impact, and applicability.
4. Combine that evidence with practical experience and the actual context.
5. Evaluate what happened after applying the decision. ([ResearchGate](https://www.researchgate.net/publication/4083466_Evidence-based_software_engineering "(PDF) Evidence-based software engineering"))

Step 4 is often stated as integrating the evidence with expertise and stakeholder values. Step 1 is [stating a claim]({{< ref "engineering/evidence/stating-claims" >}}) precisely, and step 3 uses the [four kinds of validity]({{< ref "engineering/evidence/validity" >}}).

EBSE supplies the guiding principle:

> Engineering decisions should be based on critically evaluated evidence, with explicit applicability limits.

## Skill and lifecycle factors


There is an interesting detail in the original paper. The authors identified a **skill factor**--software outcomes depend heavily on the people involved--and a **lifecycle factor**--it can be difficult to know how a technology will behave after deployment. They warned that these make SE experiments particularly vulnerable to bias and incomplete conclusions. ([ResearchGate](https://www.researchgate.net/publication/4083466_Evidence-based_software_engineering "(PDF) Evidence-based software engineering"))

Coding agents amplify both problems. An expert who knows exactly when to reject an agent's output may get very different results from a junior developer. And a PR that looks successful today may produce maintenance cost six months later. [Longitudinal studies]({{< ref "engineering/evidence/choosing-a-method" >}}#longitudinal-studies) address the second.

## Using evidence and producing it


EBSE primarily guides the consumption and synthesis of evidence. A complete methodology also needs rules for **producing** good evidence: [Choosing a method]({{< ref "engineering/evidence/choosing-a-method" >}}) and [Running an experiment]({{< ref "engineering/evidence/running-experiments" >}}).

## Replication and synthesis


Replication and evidence synthesis should determine confidence in a finding.

One company study should create a finding, not an industry truth. Systematic reviews, a core tool in EBSE, summarize the high-quality empirical studies on a specific question.

Independent teams should repeat the experiment using other repositories, engineers, task distributions, and models. Eventually systematic reviews and meta-analysis can combine those experiments. The SIGSOFT standards already define systematic-review requirements including reproducible search procedures, inclusion criteria, study-quality assessment, extraction procedures, bias mitigation, and a clear chain from evidence to conclusions. ([ACM SIGSOFT](https://www2.sigsoft.org/EmpiricalStandards/docs/standards "Standards | Empirical Standards"))

This connects back to EBSE: individual experiments create evidence; replication tests its stability; systematic reviews accumulate it; practitioners decide whether that accumulated evidence applies to their situation. ([ResearchGate](https://www.researchgate.net/publication/4083466_Evidence-based_software_engineering "(PDF) Evidence-based software engineering"))

Repetition by citation is the opposite case: a claim that is quoted often but was never replicated. Bossavit's leprechauns in [Claims without evidence]({{< ref "engineering/evidence/claims-without-evidence" >}}#folklore) are examples.

## Why EBSE emerged


EBSE emerged from the need for more reliable software engineering practices, moving away from recommendations based solely on expert opinion. It emphasizes the importance of data-driven decision-making in software development.

- **Improved Practices**: By using empirical data, EBSE helps identify effective software engineering practices.
- **Cost-Effectiveness**: It promotes an engineering approach that can be more efficient than traditional craft-based methods.

## Resources and community


EBSE has a growing community with dedicated journals, conferences, and educational resources. Key publications include:

- **[Empirical Software Engineering: An International Journal](https://link.springer.com/journal/10664)**
- **[International Symposium on Empirical Software Engineering and Measurement](https://www.esem-conferences.org/)** (ESEM)

These resources support ongoing research and education in the field, helping practitioners stay informed about the latest findings and methodologies.

Other starting points:

- [Evidence-Based Software Engineering](https://ebse.webspace.durham.ac.uk/) at Durham, with a [bibliography](https://ebse.webspace.durham.ac.uk/ebse-bibliography/evidence-based-software-engineering/) that starts from the 2004 paper.
- The [ACM SIGSOFT Empirical Standards](https://www2.sigsoft.org/EmpiricalStandards/), method-specific requirements for empirical studies; see [Running an experiment]({{< ref "engineering/evidence/running-experiments" >}}#method-specific-standards).
- Kitchenham, Budgen and Brereton, *Evidence-Based Software Engineering and Systematic Reviews* (2015), the book-length treatment. It is not in the library.

## Related


- [Critical stance and evidence-based practice]({{< ref "engineering/evidence/critical-stance" >}}) -- EBSE among its neighbouring terms, and scrutiny of the evidence itself.
- [A practical way to study coding-agent improvements]({{< ref "ai-engineering/agents/agents-md/coding-agent-experimentation-primer" >}}) -- EBSE as the first method for testing `AGENTS.md` recommendations: check the existing evidence before running new evaluations.
- [Claims to check in product work]({{< ref "ai-engineering/causal-stack/claims" >}}) and [Learning through real product use]({{< ref "ai-engineering/causal-stack/learning-from-real-use" >}}) -- EBSE as the broader method behind reviewing recommendations before treating them as established practice.
- [Capability claims and empirical method]({{< ref "ai/capabilities/empirical-method-map" >}}) -- EBSE as the outer loop around a capability study, and "productivity" as a construct in the same position as "reasoning".

## Library sources


- [Felderer and Travassos 2020](/sources/2d3e93f9d3f8e092f8131153aae98740.bin), *Contemporary Empirical Methods in Software Engineering* -- the editors' opening chapter places EBSE, proposed in 2004, in the history of empirical methods, and Part III covers how evidence is aggregated; on *The Evolution of Empirical Methods in Software Engineering*, *Research Synthesis in Software Engineering* and *Guidelines for Managing Threats to Validity of Secondary Studies in Software Engineering*
- [Wohlin et al. 2024](/sources/c07438c70e29bb5bfa57fbc2bc8ae6b6.bin), *Experimentation in Software Engineering* -- replications and systematic reviews; on *Replications* (3.2) and *Systematic Literature Studies* (ch. 4)
