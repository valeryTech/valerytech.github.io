---
draft: false
toc: true
title: "Discipline in AI: annotated reading map"
description: "An annotated map of notes on AI engineering as an emerging practice, scientific mindset, disciplined experimentation, evaluation, and organizational support."
linkTitle: "Discipline in AI: annotated reading map"
---

Checked against local file contents on 20 October 2026. Links point to the relevant passages as they stood on that date. Descriptions summarize the sources; comments are my assessment of their usefulness, overlap, and draft quality.

The existing AI discipline reading map is one entry point. This document adds the broader notes on language, mindset, engineering responsibility, and developing the practice itself.

## Where to start


| What you want to understand | Start here | My comment |
| --- | --- | --- |
| AI engineering as a practice still taking shape | Language, mindset, and discipline -- version 0 | The strongest starting point for the broad position. It explicitly says that both the product and the practice used to develop it need attention. |
| Discipline in discovery, delivery, and production responsibility | Language, mindset, and discipline -- version 1 | Makes the commitments and obligations more explicit. Its emphasis differs from version 0; the filename alone does not establish which version should be authoritative. |
| What makes AI experimentation disciplined | Disciplined AI Experimentation | The most direct treatment of controlled iteration and reproducibility. It contains useful explanations alongside rough fragments. |
| How evidence should change the next action | Principles and Decision Logic for AI Product Work | The clearest operational companion: name the decision, gather relevant evidence, and choose the next commitment. |

## The direct notes on discipline

### Language, mindset, and discipline -- version 0


Read the note.

**What is there:** AI product engineering combines established knowledge from several fields, while the way that knowledge is combined still needs development. The note examines language that makes the work sound settled, scientific mindset, shared understanding through concrete cases, and the company support needed to act on findings.

Its everyday-work section states:

> Discipline means carrying this way of thinking into the work consistently.

**My comment:** This is the closest match when "discipline" means a sustained intellectual and organizational practice. The important extension is that the methods themselves remain open to examination: a team should question its evaluation criteria as well as its product implementation. Its support-assistant example makes that concern concrete.

### Language, mindset, and discipline -- version 1


Read the note.

**What is there:** The same broad stance, with more explicit discussion of supported behavior, production commitments, evidence limits, experienced judgment, decision authority, and employer support.

The discipline section states:

> Discipline means applying this reasoning consistently to the next decision.

**My comment:** Read this alongside version 0. Version 0 foregrounds the emerging practice; version 1 foregrounds the engineering responsibilities and conditions for doing the work. They overlap substantially, but each preserves a useful emphasis.

### Disciplined AI Experimentation


Read the note.

**What is there:** A contrast between uncontrolled experimentation and evidence-driven iteration. The opening says:

> The engineering problem is not to eliminate experimentation. The engineering problem is to make experimentation **controlled, observable, reproducible, and decision-grade**.

The comparison table connects prompt tracking, evaluation rubrics, fixed test sets, baselines, failure analysis, logged configurations, and regression checks to concrete weaknesses in ad hoc work. The constraints section discusses nondeterminism, human review, cost, latency, and drift.

**My comment:** Useful as an explanation of why casual prompt tweaking is insufficient. It is visibly unfinished: line 25 is a fragment, line 29 is an undeveloped slogan, and line 90 ends mid-thought. Its broad contrast with conventional software also deserves the qualification provided by the behavioral-evidence note below.

The comments above refer to the revisions reviewed when this map was written. Later editorial changes may have resolved some draft issues; the line references record that earlier review context.

## The broader position and its organizational conditions


| Note and passage | What it contributes | My comment |
| --- | --- | --- |
| My perspective on production AI engineering: opening and engineering problem, plus enabling principles | Connects evaluation, scientific rigor, shared language, system behavior, and the ability to act on evidence. Names honesty, willingness to learn, trust, and cooperation. | A concise statement of the overall engineering position. Useful for explaining how the discipline connects to architecture and production work. |
| Aligning on AI product engineering: developing the practice, plus support from the start | Explains why investigating behavior and improving methods belong in the role, with time, access, capacity, and decision authority. | The clearest translation into expectations for a company or role. It explicitly links to version 0 of the language-and-mindset note. |
| Organizational principles: hypothesis-driven work, plus exploration, emerging practice, and standardization | Applies investigation to the team's own methods. Distinguishes exploration from practices that have enough repeated evidence to standardize. | A working collection with fragments and alternative formulations. Particularly useful for the question: when should a tentative approach become a shared rule? |

## How the discipline becomes practical work


| Note and passage | What is there | My comment |
| --- | --- | --- |
| Principles and Decision Logic for AI Product Work: concrete assumptions, named decisions, and proportionate commitments | Separates assumptions, evidence, uncertainty, and consequences. Defines what could justify continuing, changing, or stopping, before seeing the result. | The strongest source for deciding how much investigation a particular commitment deserves. It guards against making experimentation a ceremony. |
| Development Approaches and Modes: experimentation | Connects a hypothesis, controlled intervention, representative conditions, evaluation method, expected evidence, and decision. | A compact specification of what an experiment should contain. It also makes clear that experiments are optional modes of work, chosen for the uncertainty involved. |
| Discovery and delivery: frame before acting, learn after acting | Describes the recurring practice of framing the decision, acting within justified limits, inspecting the result, and revising the next commitment. | Useful for explaining how disciplined work can move quickly. It preserves the obligations that arise when people depend on the product. |
| AI Systems Require Behavioral Evidence: core claim | Explains why implementation reasoning needs observations of behavior under realistic conditions. It also acknowledges the testing and observation required by conventional systems. | The conceptual reason for the discipline. Its treatment of the relationship between conventional and AI systems is more qualified than the experimentation draft's. |
| Goals of AI Evaluation: framework and subsystem, plus different claims | Separates the reasoning that gives evidence meaning from the people, cases, tools, and practices that produce it. Keeps behavior, usability, adoption, and outcomes distinguishable. | Useful for spotting a team that produces scores without examining what those scores establish. It prevents a behavioral improvement from silently becoming a claim of product success. |
| AI Products Need Evals, Not Just Tests: delivery loop, plus experiment record | Gives a concrete loop through baseline, evaluation, failure inspection, targeted change, regression checks, release decisions, and production feedback. | The most immediately usable description of recurring engineering work. The small record template captures question, baseline, change, measures, result, and decision. |
| Decision records for uncertainty | Proposes records for adopting or abandoning an approach, reformulating a problem, and revising judgments about what is attainable. | Adds organizational memory: preserve why a direction changed. Treat its record types and mandatory rules as a proposal to assess, rather than assuming the team already uses them. |
| A practical way to study coding-agent improvements: questions and hypotheses, plus interpretation | Applies research thinking to agent instructions and workflows: answerable questions, suitable methods, meaningful outcomes, comparable conditions, and limits on conclusions. | A concrete example of the scientific mindset in use. It allows exploratory work before a formal hypothesis and treats disappointing results as potentially informative. |

## Suggested reading order


For the broad argument, read **Language, mindset, and discipline -- version 0**, then **My perspective**, then **Aligning on AI product engineering**.

For the working method, read **Principles and Decision Logic**, then **Development Approaches and Modes**, then the **delivery loop and experiment record**. Use **Goals of AI Evaluation** to examine whether the resulting evidence supports the claim being made.

For comparison or revision, put the two **Language, mindset, and discipline** versions side by side. Then compare **Disciplined AI Experimentation** with **Development Approaches and Modes**: the former explains the failure of uncontrolled iteration; the latter gives the more precise conditions for choosing and designing an experiment.
