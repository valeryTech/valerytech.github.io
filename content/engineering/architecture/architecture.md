---
draft: false
toc: true
title: "Software Architecture"
description: "A working outline of software architecture concepts, quality characteristics, decisions, practices, and resources for developing architectural judgment."
document_status: "draft"
linkTitle: "Software Architecture"
---
[Draft]

Why you need to understand what is Software Architecture and how to use it concepts?

**TL;DR:** This page presents various foundational concepts, principles, methods, patterns, heuristics, and best practices related to software architecture.

<https://handbook.gitlab.com/handbook/engineering/architecture/>

# Definition


definitions list and it's analysis

# Ontology


key components, terminology

key elements

basic concepts

# Practicality Lens


Different authors ans scholars highlight numerous diverse concepts for building software systems. There is a wide range of concept types: (best) practices, approaches, methods, laws, principles, theories, heuristics, and more.

However, what matters most to me is the ability to adapt and employ this variety as a **practical toolbox** for creating effective systems.
> Looking ahead, my key focus will be to develop a **holistic set** of tools, clearly structured and integrated, for practical use in software architecture and design.
A key challenge in this pursuit is that principles can sometimes conflict and contradict each other. The real question is not just which principles to follow but *how to balance and apply them effectively* to the problem at hand.

# Underlying Common Concepts


complexity, simplicity

driving forces

# Toolbox


The [system design flow]({{< ref "system-design" >}}) is a working version of this toolbox for system-level choices: design questions with their options, paired with lifecycle techniques.

One notable example is provided by Mark Richards and Neal Ford, who identified several universally applicable ideas about software architecture and codified them as "laws." You can find more details about these laws in [Laws of Software Architecture]({{< ref "engineering/architecture/laws" >}}), and their application to module and service boundaries in [Coupling and Modularity]({{< ref "engineering/architecture/coupling" >}}). The [Architecture Toolbox]({{< ref "engineering/architecture/toolbox" >}}) collects these with the other heuristics.

common principles

engineering principles, like

acronyms sets, like KISS, YAGNI, SOLID

.. (insert other tools here) ..

Concepts such as the definition of software architecture or architectural characteristics could also fit into this toolbox, as they guide our understanding and modeling of software systems. However, I've chosen not to explicitly include these foundational definitions as part of the toolbox, viewing them instead as general conceptual instruments that underlie our practical work. Nevertheless, keep in mind their implicit importance and usage.

# Architectural Characteristics


list of characteristics, applicability, mapping to the parts of the system, definitions, how to specify them

# Decisions


paper "Decision-Making Techniques for Software Architecture Design: A Comparative Survey" ([PDF](/sources/software-engineering/architecture-decisions/falessi-2011-decision-making-techniques-software-architecture.pdf.enc))

Software architects must understand and analyze software systems deeply, in all their complexity, and must make important trade-off decisions, sometimes with incomplete information (analyze). Software architects make exactly the kinds of decisions that AI cannot, evaluating trade-offs within complex, changing contexts.

Architecture, like much art, can only be understood in context. Architects base their decisions on the realities of their environment.

add link to decision making framework

decisions withing a more broad context of businness discource

<https://www.reddit.com/r/softwarearchitecture/comments/1ad40ia/how_can_i_become_better_in_architectural_decision/>

<https://en.wikipedia.org/wiki/Architectural_decision>

<https://adr.github.io/>

<https://github.com/joelparkerhenderson/architecture-decision-record?tab=readme-ov-file>

## ADRs

# Resources

# Personalies


Ralph Johnson, Martin Fowler

Neal Ford, Mark Richards

Barry O'reilly and residual theory

(?) Derek Comartin and Code Opinion youtube channel

# Sources


<https://martinfowler.com/architecture/>

<https://www.youtube.com/watch?v=DngAZyWMGR0>

<https://www.youtube.com/watch?v=u_LnubpBDCA>

<https://www.youtube.com/watch?v=lurbDAEU0KM>

<https://www.youtube.com/watch?v=0TwoubGSXpc>

<https://www.youtube.com/watch?v=CjCJ76oZXTE>

<https://www.youtube.com/watch?v=MZnrxjw602E>

<https://www.youtube.com/watch?v=LcJKxPXYudE>

war stories, reflections

<https://www.reddit.com/r/softwarearchitecture/comments/16usw23/megathread_software_architecture_books_resources/>

"# Fundamentals of Software Architecture: A Modern Engineering Approach" 2nd Edition by Mark Richards, Neal Ford

<https://www.youtube.com/watch?v=bmSAYlu0NcY>

interesting

"What Software Architects Do That Programmers DON'T" <https://www.youtube.com/watch?v=IwrvE-wHm84>

Barry

<https://www.youtube.com/watch?v=H8ZOp8ayluU>

<https://www.youtube.com/watch?v=36I_eW8K1EY> interesting advices and reflections

<https://www.reddit.com/r/architecture/comments/16crcsv/architecture_vs_software_engineering/>

<https://www.youtube.com/watch?v=wQYRl--58zM>

<https://www.youtube.com/watch?v=_ZvwRJnSsQ4>

<https://www.youtube.com/watch?v=0tEBv2kAuNY>

<https://www.youtube.com/watch?v=n6G5qtJHmgw>

<https://www.youtube.com/watch?v=W7Krz__jJUg>

<https://www.youtube.com/watch?v=v_nhv6aY1Kg>

<https://www.youtube.com/watch?v=9Az0q2XHtH8>

<https://www.cloudwaydigital.com/>

<https://www.youtube.com/watch?v=_CXPDDRn6to> agility and architecture

<https://www.youtube.com/watch?v=CXCkDKM0OX0> hopre and farley

<https://www.youtube.com/watch?v=aCiejroMUmc>

paper "Agility and Architecture" by Babel

<https://levelup.gitconnected.com/from-software-developer-to-software-architect-roadmap-to-success-695951521d9b>

<https://github.com/justinamiller/SoftwareArchitect>

<https://levelup.gitconnected.com/software-architecture-things-that-no-one-has-told-you-c098bbb70a61>

<https://www.thoughtworks.com/insights/topic/architecture>

"Good Enough Architecture"

<https://www.youtube.com/watch?v=RtRpL3Ndi0c>

katas, practice

<https://fundamentalsofsoftwarearchitecture.com/katas/list.html>

<https://www.reddit.com/r/softwarearchitecture/comments/16usw23/megathread_software_architecture_books_resources/>

<https://martinfowler.com/architecture/>

<https://roadmap.sh/software-design-architecture>

<https://roadmap.sh/software-architect>

<https://khalilstemmler.com/articles/software-design-architecture/full-stack-software-design/>

# Common dev practices


<https://www.youtube.com/@HealthyDev/videos>

<https://www.youtube.com/watch?v=2ClljZaK6_A>

<https://handbook.gitlab.com/handbook/engineering/architecture/design-documents/>

other

<https://awesome-architecture.com/>

Simon Brown videos

- <https://www.youtube.com/watch?v=9Az0q2XHtH8>
- and book

<https://learn.microsoft.com/en-us/azure/architecture/patterns/>

Vsevolodovich (?)

<https://www.youtube.com/@architectureweekly/videos>

also it has some system design interviews

and blog <https://blog.vvsevolodovich.dev/>

book "Cloud Native Spring in Action" contains in its first chapters good material about cloud native and what does it mean

<https://www.thoughtworks.com/insights/blog/architecture/software-architecture-decisions-andrew-harmel-law>

to sort

[Evidence in software architecture, a systematic literature review](https://dl.acm.org/doi/abs/10.1145/2460999.2461014)

architecture

<https://www.infoq.com/articles/architecture-experimentation/>

<https://www.industrialempathy.com/posts/design-docs-at-google/>

other resources to read:

<http://onsites.fyi/blog/article/apple-ict2-software-engineer-interview-questions>

<https://interviewing.io/blog/technical-interview-performance-is-kind-of-arbitrary-heres-the-data>

## Library sources


- [Abrahamsson et al. 2010](/sources/software-engineering/architecture/abrahamsson-2010-agility-and-architecture.pdf.enc), *Agility and Architecture*
- [Harmel-Law 2025](/sources/software-engineering/architecture/harmel-law-2025-facilitating-software-architecture.pdf.enc), *Facilitating Software Architecture* -- on *Decisions*
- [Malan 2025](/sources/software-engineering/architecture/malan-2025-architecture-principles.pdf.enc), *Architecture Principles* -- on *Practicality Lens*
- [Richards and Ford 2025](/sources/software-engineering/architecture/richards-2025-fundamentals-of-software-architecture.pdf.enc), *Fundamentals of Software Architecture, 2nd Edition*

Further reading:

- [Brown 2022](/sources/software-engineering/architecture/brown-2022-software-architecture-for-developers.pdf.enc), *Software Architecture for Developers*
- [Fowler 2003](/sources/software-engineering/architecture/fowler-2003-who-needs-an-architect.pdf.enc), *Who Needs an Architect?*
- [Hohpe 2017](/sources/software-engineering/architecture/hohpe-2017-37-things-one-architect-knows.pdf.enc), *37 Things One Architect Knows About IT Transformation*
- [Mekni et al. 2017](/sources/software-engineering/architecture/mekni-2017-software-architecture-methodology-agile-environments.pdf.enc), *Software Architecture Methodology in Agile Environments* ([doi:10.4172/2165-7866.1000195](https://doi.org/10.4172/2165-7866.1000195))
- [Yépez et al. 2024](/sources/software-engineering/architecture/pantoja-yepez-2024-training-software-architects.pdf.enc), *Training software architects suiting software industry needs* ([doi:10.1007/s10639-023-12149-x](https://doi.org/10.1007/s10639-023-12149-x))
- [Bhat et al. 2020](/sources/software-engineering/architecture-decisions/bhat-2020-evolution-of-architectural-decision-making.pdf.enc), *The Evolution of Architectural Decision Making as a Key Focus Area of Software Architecture Research*
- [Buchgeher et al. 2023](/sources/software-engineering/architecture-decisions/buchgeher-2023-architecture-decision-records-open-source.pdf.enc), *Using Architecture Decision Records in Open Source Projects* ([doi:10.1109/ACCESS.2023.3287654](https://doi.org/10.1109/ACCESS.2023.3287654))
- [Demir et al. 2024](/sources/software-engineering/architecture-decisions/ozdes-demir-2024-factors-architectural-decision-making.pdf.enc), *Factors affecting architectural decision-making process and challenges in software projects* ([doi:10.1002/smr.2703](https://doi.org/10.1002/smr.2703))
- [Pretorius et al. 2024](/sources/software-engineering/architecture-decisions/pretorius-2024-when-rationality-meets-intuition.pdf.enc), *When rationality meets intuition* ([doi:10.1002/smr.2664](https://doi.org/10.1002/smr.2664))
- [Tofan et al. 2013](/sources/software-engineering/architecture-decisions/tofan-2013-difficulty-of-architectural-decisions.pdf.enc), *Difficulty of Architectural Decisions*
- [Tofan et al. 2014](/sources/software-engineering/architecture-decisions/tofan-2014-past-future-software-architectural-decisions.pdf.enc), *Past and future of software architectural decisions*
- [Farley 2022](/sources/software-engineering/craft/farley-2022-modern-software-engineering.pdf.enc), *Modern Software Engineering*
- [Gruhn and Striemer 2018](/sources/software-engineering/process-and-agile/gruhn-2018-essence-of-software-engineering.pdf.enc), *The Essence of Software Engineering* ([doi:10.1007/978-3-319-73897-0](https://doi.org/10.1007/978-3-319-73897-0))
- Keeling 2017, *Design It! From Programmer to Software Architect* -- Activity 20, architecture decision records, Activity 26, paths not taken, and chapter 11 on explaining the rationale for decisions, on *Decisions* and *ADRs*
