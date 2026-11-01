---
draft: false
toc: true
title: "Design Science Method: Excerpts from Johannesson and Perjons"
description: "Design-science source material covering problem explication, requirements, alternative designs, artifact construction, design rationale, demonstration, and evaluation."
linkTitle: "Design Science Method"
---

Source: [Johannesson and Perjons 2021](/sources/research-methods/design-science/johannesson-2021-introduction-to-design-science.pdf.enc), *An Introduction to Design Science* ([doi:10.1007/978-3-030-78132-3](https://doi.org/10.1007/978-3-030-78132-3)).

## Problem explication


The starting point for any design science project is a problem that people experience in a practice. Often, this problem is vague, unclear, and poorly articulated.

Therefore, researchers need to analyze, investigate, and reformulate the problem in order to understand it in depth. If they move into design without this understanding, they may develop a solution that is not capable of addressing the problem in an appropriate way.

The first activity of the method framework is Explicate Problem. The goal of this activity is to formulate the initial problem precisely, justify its importance, and investigate its underlying causes. In other words, it addresses the question:

> What is the problem experienced by some stakeholders of a practice and why is it important?

When explicating a problem, researchers engage in three main activities:

- Making the problem definition as precise as possible.
- Positioning and justifying the problem.
- Finding the root causes of the problem.

## Define Requirements


Researchers need a clear and deep understanding of the problem being addressed before they can design a solution to it. Sometimes, it is possible to move directly from a problem to a solution, but often this is a large and difficult step. To bridge the gap between problem and solution, researchers can define requirements for a preliminary solution. These requirements can then guide them in further designing and developing the solution. The requirements can also be used to validate the quality of the fully developed artefact; researchers do this by determining whether or not the artefact fulfills the requirements.

The second activity of the method framework is Define Requirements. The goal is to identify and outline an artefact that can address the explicated problem and to elicit requirements for that artefact. In other words, this activity addresses the question:

> What artefact can be a solution for the explicated problem and which requirements for this artefact are important to the stakeholders?


Answering this question can be viewed as an extended problem explication. In other words, researchers continue to explicate the problem further, but they do so using the proposed solution outline as a pair of glasses for guiding their examination of the problem. #todo so we also define solutions.. Thus, the question is to be answered by descriptive knowledge that specifies requirements for the artifact.

A requirement is a statement, made by a stakeholder of a practice, that a property of an artefact is desirable. We here define requirements in a broad sense, at both high and low levels of abstraction. High-level requirements are about general, sometimes even vague, properties, while low-level requirements are more specific and concrete.

High-level requirements can be useful for guiding design, though they may be somewhat vague and only provide an overall guidance.

### Outline Artefact


The sub-activity Outline Artefact starts by choosing which artefact type should be designed to solve the problem, e.g. deciding whether the solution should be a construct, a model, a method, or an instantiation. This choice is sometimes easy due to the characteristics of the explicated problem.

In other cases, it can be more difficult to choose the artefact type to be designed. For example, if IT systems need to be integrated to make a business process more efficient, a solution might be a method for integrating IT systems, a model of an integration architecture, or an instantiation in the form of an integration tool.

When the artefact type has been chosen, the artefact is to be described in broad overview, focusing on its overall structure and main functions. This description should be kept brief and include only as much detail as is needed to formulate requirements--adding too much detail may hamper creativity when designing the artefact.

## Design and Develop Artefact


The major part of many design science projects is the activity Design and Develop Artefact, which can be expressed as follows:

*Create an artefact that addresses the explicated problem and fulfills the defined requirements.*

Sub-activities of Design and Develop Artefact

Designing and developing is about moving from initial ideas of a solution all the way to a complete artefact. The activity can be divided into four sub-activities, which are carried out in parallel and iteratively:

- *Imagine and Brainstorm.* The designers brainstorm and generate new ideas or elaborate on existing ones.
- *Assess and Select.* The designers assess the generated ideas in order to select one or more of them as the basis for further design and development.
- *Sketch and Build.* The designers outline the artefact and construct it.
- *Justify and Reflect.* The designers both reflect on and justify the design decisions they have made.

### 7.1.2 Assess and Select


In the sub-activity Assess and Select, the ideas generated in the previous sub-activity are assessed in order to select one or more of them as the basis for the development of the artefact. This activity usually requires convergent thinking, i.e. an analytical approach for selecting among alternative ideas.

The previous sub-activity, Imagine and Brainstorm, can be seen as setting up a solution space consisting of possible ideas or solutions, while this sub-activity can be seen as pruning ideas in this solution space. According to this view, which was introduced by Simon (1996), the designer makes additional design decisions that further narrow the space. The process can be viewed as a systematic exploration of the solution space, which is guided by the requirements defined in the previous activity, Define Requirements.

The design decisions that narrow the solution space may be more or less well founded. To describe and justify how such decisions are taken, various models for organisational decision-making can be used, for example, the rational decision-making, the bounded rationality, and the garbage can model. In the *rational decision-making model*, all relevant ideas are evaluated in depth in order to identify the optimal one.

However, in practice, not all relevant ideas are carefully evaluated. Instead, decisions are often based on so-called *bounded rationality*, which means that decision makers stop the decision-making process when they have identified one or more sufficiently good ideas. The reason for doing so is usually that it is not worth exploring more ideas or collecting more information for making a more informed decision--it would be too expensive and time consuming.

And sometimes, decisions are made without even considering any alternative solutions at all. This way of making decisions is articulated in the *garbage can model*, which states that decisions are made on an ad hoc basis by matching problems and available solutions without any deeper discussions, often in a meeting but sometimes simply around a coffee machine. Moreover, many times decisions are made in a group. Therefore, the chosen solution is sometimes a compromise to satisfy several individuals in the group. Such compromises may make decisions easier to implement in an organisation since they recognize the needs and interests of many stakeholders in the organisation.

The decision models presented above not only describe different ways of making decisions, but they can also serve as role models for how decisions should be made. In other words, these models can also have a prescriptive function. Often, the rational decision-making model is presented as the preferred model for making decisions, but it could be argued that it is too time consuming for many types of decisions.

### 7.1.3 Sketch and Build


In the sub-activity Sketch and Build, a sketch of the artefact is made starting from the ideas selected in the previous sub-activity. Based on this sketch, the artefact can then be developed.

A sketch of an artefact provides an overview of both its core functions and its overall structure. The sketch of the functions typically displays the interface between the artefact and the user, what the artefact offers to the user, and why and how the user will use it. The sketch of the overall structure, i.e. the artefact architecture, provides an overview of the components of the artefact and their relationships. Designers make a sketch of an artefact in order to sharpen their thinking about it, facilitate communication among the stakeholders involved in its construction, and provide guidance for further development.

There are several tools that can be used for sketching the function of an artefact. A *use case diagram* graphically represents the functions of the artefact, as well as the actors in its environment, i.e. the roles of those that use the functions. Use case diagrams are often complemented with *use case descriptions* that describe in text how the users will be interacting with the artefact. Another instrument for sketching functionality is the *user story*, which is less structured than use case diagrams and use case descriptions and typically describes each function of an artefact in only a sentence or two. Yet another instrument is *story-boarding*, which consists of a number of illustrations in sequence, like a cartoon strip, describing how the user will interact with the artefact.

The form of a sketch depends upon the type of artefact at hand. If the artefact is a method, its parts are usually activities or tasks, and the relationships between them represent temporal or logical orderings of the tasks. For a static model or an instantiation, on the other hand, the parts are usually modules or components.

Before developing the final artefact, a prototype may be constructed. There is not much agreement on what should count as a prototype, but it can be seen as an early form of the final artefact, focusing on certain of its aspects. For example, a prototype of an artefact may be a drawing on a paper focusing on the artefact's major components and their relationships, a physical model focusing on the artefact's aesthetic appearance, or a software application focusing on the artefact's user friendliness. By experimenting with the prototype, the designers can learn about the design challenges for developing the final artefact. Users can also more easily provide relevant feedback through inspecting and using the prototype.

Designing and developing an artefact is a process of reusing and adapting parts from existing solutions, inventing new elements, and combining them in an innovative way. In order to clarify how the new solution builds upon and differs from existing ones, a researcher needs to analyse the latter ones by studying previous work, both theoretical and practical. Even if the solution being designed is highly original, the researcher still needs to relate and compare it to existing solutions--there are always similarities worth highlighting.

Modern design and development methods provide different instruments to support the design and development process. One such instrument that has been shown to be effective is *pair design*, based on the agile practice of pair programming, in which two designers work together to simultaneously develop an artefact. Typically, one designer makes a design decision, such as introducing an activity into a method, and the other designer immediately reviews it and suggests possible improvements or potential problems. Another instrument is the *walk-through*, a kind of peer review, in which a designer leads members of a development team and other stakeholders through an artefact. The participants can ask questions, point out problems, suggest alternative solutions, or provide feedback in any other form.

### 7.1.4 Justify and Reflect


In the sub-activity Justify and Reflect, the designers justify the design decisions that have been made and reflect on them in order to be better prepared for future design and development.

Regardless of the resources used in creating a design, it is valuable to document the *design rationale*, i.e. to make a list of the decisions made during the design process and the argumentation for these decisions. A design rationale should contain the reasons and justifications behind design decisions, alternative decisions that were considered, and the arguments leading to the decisions. A design rationale can not only support communication during a single project, but it is also useful for facilitating reuse between different projects. In fact, a design rationale can be one of the most valuable outcomes of a design science project, as it records the reasoning behind design decisions, including potential pitfalls. This knowledge can be of great value to subsequent projects; in particular, it can help designers to avoid dead ends and other kinds of problems.

## Alternative Conceptualizations and Definitions


There are many ways to skin a cat. And there are also many ways to reason and talk about design. In this book, we have chosen practices, problems, artefacts, and requirements as central notions for conceptualising the design area. But many other notions and terms are being used by other people. This should not come as a surprise, as design is relevant to so many different fields, including Human-Computer Interaction, User Experience Design, Software Engineering, Information Systems, Design Thinking, and the list goes on. People in all of these areas have come up with their own conceptualizations and definitions. The result can feel like the Tower of Babel, where people do not understand each other because they are using different words for the same things, or the same words for different things. Here are a few examples to illustrate the situation:

- *Problem.* A problem is sometimes defined as an undesirable current state. In contrast, we have defined a problem as the gap between the current state and a more desirable state.
- *Need.* A need can be defined as something that is urgently desired. A problem can be seen as an unmet need.
- *Want.* A want is also something desired, but not as urgently as a need. Thus, the borderline between needs and wants is fuzzy.
- *Goal.* A goal can be defined as a desirable state that people want to achieve. Alternatively, a goal is a desirable state that people have decided to try to achieve.
- *Design goal.* High-level requirements are sometimes called design goals.

There is no right or wrong here, only different ways of conceptualising and defining. And if you are familiar with one way of talking, it should not be difficult to switch to another way--they are all about the same design phenomena.

## Demonstrate Artefact


Researchers do not only need to design and develop an artefact; they also need to show that it works well. A bare minimum is to demonstrate

that the artefact works in one single case. This may not prove much, but at least it indicates that the artefact can also work in other cases.

The fourth activity of the method framework is Demonstrate Artefact, which illustrates the use of the artefact in a particular case, thereby verifying its feasibility. In other words, the activity addresses the question:

*How can the developed artefact be used to address the explicated problem in one case?*

The answer to this question will consist primarily of descriptive knowledge describing how the artefact works in one situation, but also explanatory knowledge explaining why the artefact works.

A demonstration shows that the artefact can, in fact, solve some aspects of a problem in one illustrative or real-life case. A demonstration can be seen as a weak form of evaluation--if the artefact can address a problem in one case it might be able to do so in other cases as well. Moreover, a demonstration can also help communicate the idea behind the artefact to an audience in a vivid and convincing way.

## Evaluate Artefact


In order to show that they have designed and developed an appropriate artefact, researchers need to evaluate it. Without an evaluation, they cannot claim that they have produced a valuable contribution.

The fifth activity of the method framework is Evaluate Artefact, in which researchers determine how well the artefact is able to solve the explicated problem and to what extent it fulfils the requirements. In other words, the activity addresses the question:

*How well does the artefact solve the explicated problem and fulfil the defined requirements?*

The answer to this question will consist primarily of descriptive knowledge but may also include explanatory knowledge explaining why the artefact is able to solve the problem.

### 9.1 Goals of Artefact Evaluation


An evaluation of an artefact may have several different goals, as discussed by Venable et al. (2012):

- To determine to what extent the artefact is effective for solving the problem for which it was proposed. In other words, the utility of the artefact is tested. This goal is usually the most important one.
- To evaluate to what extent the artefact satisfies the requirements that have been defined, functional as well as non-functional ones.
- To investigate formalised knowledge about the designed artefact and its utility, e.g. concerning its underlying kernel theories and implementation principles. In terms of design theory, this goal is to confirm, disprove, or enhance the design theory.
- To compare and not only evaluate the artefact in isolation, i.e. to study the artefact in comparison to other artefacts that are intended to address the same or a similar problem. The new artefact should offer advantages compared to existing ones.
- To investigate the side effects of using the artefact, i.e. to determine whether there are unintended and harmful effects.
- To evaluate the artefact formatively in order to identify opportunities for improvement through further design.

In a *formative* evaluation, an artefact is evaluated while it is still under design in order to obtain information about how to improve it during subsequent design activities. Thus, a formative evaluation is part of an iterative design process, in which the artefact is designed and evaluated during several iterations. A *summative evaluation*, on the other hand, aims to assess an artefact after its design and development has been completed. The results of a summative evaluation do not feed back into the design process but instead are used to obtain a final assessment of the utility of the artefact.

The evaluation goals can be combined. For example, the goals of an evaluation can be both to investigate the utility of an artefact by comparing it to other existing artefacts and to carry out a summative evaluation.
