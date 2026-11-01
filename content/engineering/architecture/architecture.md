---
draft: false
toc: true
title: "Software Architecture: A Working Outline"
description: "A working outline of software architecture concepts, quality characteristics, decisions, practices, and resources for developing architectural judgment."
document_status: "draft"
linkTitle: "Working Outline"
---
[Draft]

Why you need to understand what is Software Architecture and how to use it concepts?

**TL;DR:** This page presents various foundational concepts, principles, methods, patterns, heuristics, and best practices related to software architecture.

[GitLab handbook: architecture](https://handbook.gitlab.com/handbook/engineering/architecture/)

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


paper "Decision-Making Techniques for Software Architecture Design: A Comparative Survey" ([PDF](/sources/ddf58eacb5f53833fa4bf6a8793168b6.bin))

Software architects must understand and analyze software systems deeply, in all their complexity, and must make important trade-off decisions, sometimes with incomplete information (analyze). Software architects make exactly the kinds of decisions that AI cannot, evaluating trade-offs within complex, changing contexts.

Architecture, like much art, can only be understood in context. Architects base their decisions on the realities of their environment.

add link to decision making framework

decisions withing a more broad context of businness discource

[r/softwarearchitecture: how can I become better in architectural decision](https://www.reddit.com/r/softwarearchitecture/comments/1ad40ia/how_can_i_become_better_in_architectural_decision/)

[Architectural decision](https://en.wikipedia.org/wiki/Architectural_decision)

[Architectural Decision Records (ADRs)](https://adr.github.io/)

[joelparkerhenderson/architecture-decision-record (GitHub)](https://github.com/joelparkerhenderson/architecture-decision-record?tab=readme-ov-file)

## ADRs

# Resources

# Personalies


Ralph Johnson, Martin Fowler

Neal Ford, Mark Richards

Barry O'reilly and residual theory

(?) Derek Comartin and Code Opinion youtube channel

# Sources


[Software Architecture Guide](https://martinfowler.com/architecture/)

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

[r/softwarearchitecture megathread: software architecture books and resources](https://www.youtube.com/watch?v=bmSAYlu0NcY)

interesting

"[What Software Architects Do That Programmers DON'T](https://www.youtube.com/watch?v=IwrvE-wHm84)"

Barry

<https://www.youtube.com/watch?v=H8ZOp8ayluU>

[YouTube video: advice and reflections](https://www.youtube.com/watch?v=36I_eW8K1EY) interesting advices and reflections

[r/architecture: architecture vs software engineering](https://www.reddit.com/r/architecture/comments/16crcsv/architecture_vs_software_engineering/)

<https://www.youtube.com/watch?v=wQYRl--58zM>

<https://www.youtube.com/watch?v=_ZvwRJnSsQ4>

<https://www.youtube.com/watch?v=0tEBv2kAuNY>

<https://www.youtube.com/watch?v=n6G5qtJHmgw>

<https://www.youtube.com/watch?v=W7Krz__jJUg>

<https://www.youtube.com/watch?v=v_nhv6aY1Kg>

<https://www.youtube.com/watch?v=9Az0q2XHtH8>

[CloudWay Digital](https://www.cloudwaydigital.com/)

[YouTube video: agility and architecture](https://www.youtube.com/watch?v=_CXPDDRn6to) agility and architecture

[YouTube video: hopre and farley](https://www.youtube.com/watch?v=CXCkDKM0OX0) hopre and farley

<https://www.youtube.com/watch?v=aCiejroMUmc>

paper "Agility and Architecture" by Babel

[From Software Developer to Software Architect -- Roadmap to Success](https://levelup.gitconnected.com/from-software-developer-to-software-architect-roadmap-to-success-695951521d9b)

[justinamiller/SoftwareArchitect (GitHub)](https://github.com/justinamiller/SoftwareArchitect)

[Software Architecture -- Things That No One Has Told You](https://levelup.gitconnected.com/software-architecture-things-that-no-one-has-told-you-c098bbb70a61)

[Architecture Insights (Thoughtworks)](https://www.thoughtworks.com/insights/topic/architecture)

"Good Enough Architecture"

<https://www.youtube.com/watch?v=RtRpL3Ndi0c>

katas, practice

[List of Architecture Katas](https://fundamentalsofsoftwarearchitecture.com/katas/list.html)

[r/softwarearchitecture megathread: software architecture books and resources](https://www.reddit.com/r/softwarearchitecture/comments/16usw23/megathread_software_architecture_books_resources/)

[Software Architecture Guide](https://martinfowler.com/architecture/)

[Software Design and Architecture Roadmap](https://roadmap.sh/software-design-architecture)

[Software Architect Roadmap](https://roadmap.sh/software-architect)

[The Full-stack Software Design & Architecture Map](https://khalilstemmler.com/articles/software-design-architecture/full-stack-software-design/)

# Common dev practices


[HealthyDev YouTube channel](https://www.youtube.com/@HealthyDev/videos)

<https://www.youtube.com/watch?v=2ClljZaK6_A>

[Architecture Design Documents (GitLab Handbook)](https://handbook.gitlab.com/handbook/engineering/architecture/design-documents/)

other

[Awesome Architecture](https://awesome-architecture.com/)

Simon Brown videos

- <https://www.youtube.com/watch?v=9Az0q2XHtH8>
- and book

[Cloud Design Patterns (Azure Architecture Center)](https://learn.microsoft.com/en-us/azure/architecture/patterns/)

Vsevolodovich (?)

[architectureweekly YouTube channel](https://www.youtube.com/@architectureweekly/videos)

also it has some system design interviews

and blog [vvsevolodovich.dev blog](https://blog.vvsevolodovich.dev/)

book "Cloud Native Spring in Action" contains in its first chapters good material about cloud native and what does it mean

[Software architecture decisions: who should be involved?](https://www.thoughtworks.com/insights/blog/architecture/software-architecture-decisions-andrew-harmel-law)

to sort

[Evidence in software architecture, a systematic literature review](https://dl.acm.org/doi/abs/10.1145/2460999.2461014)

architecture

[Software Architecture and the Art of Experimentation](https://www.infoq.com/articles/architecture-experimentation/)

[Design Docs at Google](https://www.industrialempathy.com/posts/design-docs-at-google/)

other resources to read:

[Apple ICT2 Software Engineer 2026 Interview Questions](http://onsites.fyi/blog/article/apple-ict2-software-engineer-interview-questions)

[Technical interview performance is kind of arbitrary. Here's the data](https://interviewing.io/blog/technical-interview-performance-is-kind-of-arbitrary-heres-the-data)

## Library sources


- [Abrahamsson et al. 2010](/sources/edea986f585230de4a92ace2a66936f2.bin), *Agility and Architecture*
- [Harmel-Law 2025](/sources/0504f0a13beb3cf493c31190f42b04e5.bin), *Facilitating Software Architecture* -- on *Decisions*
- [Malan 2025](/sources/8e4cfc35c9bc5b1e5e2cc980c49ec3c9.bin), *Architecture Principles* -- on *Practicality Lens*
- [Richards and Ford 2025](/sources/2d49b5a0c9a1eb1beeb05703a3d3d23e.bin), *Fundamentals of Software Architecture, 2nd Edition*

Further reading:

- [Brown 2022](/sources/9b2553a52ca010f88ecb3ccc2dd55bc8.bin), *Software Architecture for Developers*
- [Fowler 2003](/sources/78bfbf4e780deabc5ec452a29c46fc2c.bin), *Who Needs an Architect?*
- [Hohpe 2017](/sources/0371de3c81af6c31efaf60a82eff66b2.bin), *37 Things One Architect Knows About IT Transformation*
- [Mekni et al. 2017](/sources/2d611076095397cc58ac029923abb624.bin), *Software Architecture Methodology in Agile Environments* ([doi:10.4172/2165-7866.1000195](https://doi.org/10.4172/2165-7866.1000195))
- [Yépez et al. 2024](/sources/cc45a94bb48c63e23ba7135fd6625b15.bin), *Training software architects suiting software industry needs* ([doi:10.1007/s10639-023-12149-x](https://doi.org/10.1007/s10639-023-12149-x))
- [Bhat et al. 2020](/sources/584e2c1383d3ace8e510a143f092c1ae.bin), *The Evolution of Architectural Decision Making as a Key Focus Area of Software Architecture Research*
- [Buchgeher et al. 2023](/sources/5c446ae84aa48fee878017f550a6970e.bin), *Using Architecture Decision Records in Open Source Projects* ([doi:10.1109/ACCESS.2023.3287654](https://doi.org/10.1109/ACCESS.2023.3287654))
- [Demir et al. 2024](/sources/007399c0fa6ace5e5f27d35ca676bfd1.bin), *Factors affecting architectural decision-making process and challenges in software projects* ([doi:10.1002/smr.2703](https://doi.org/10.1002/smr.2703))
- [Pretorius et al. 2024](/sources/ae3795b155e01d5c8501e33d20979158.bin), *When rationality meets intuition* ([doi:10.1002/smr.2664](https://doi.org/10.1002/smr.2664))
- [Tofan et al. 2013](/sources/1caad42589ce79dbd5d21f186e6208e5.bin), *Difficulty of Architectural Decisions*
- [Tofan et al. 2014](/sources/a94e65b7c88f4eca12fbbb357d61cd49.bin), *Past and future of software architectural decisions*
- [Farley 2022](/sources/974d11f571d53a0bd5809c67541d563b.bin), *Modern Software Engineering*
- [Gruhn and Striemer 2018](/sources/73b070633ea142b1aac0adae84164891.bin), *The Essence of Software Engineering* ([doi:10.1007/978-3-319-73897-0](https://doi.org/10.1007/978-3-319-73897-0))
- Keeling 2017, *Design It! From Programmer to Software Architect* -- Activity 20, architecture decision records, Activity 26, paths not taken, and chapter 11 on explaining the rationale for decisions, on *Decisions* and *ADRs*
