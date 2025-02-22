---
contributors: []
date: '2025-02-22T09:02:28.392283'
description: Default Description
draft: false
lastmod: '2025-02-22T09:02:28.392283'
summary: ''
title: Sd Algorithm
toc: true
weight: 810
---
# SD algorithm

This document describes step-by-step framework on how to tackle a system design question

## 1. Understand the problem and establish Design Scope

What you need to collect and define:

- Functional Requirements. They may reside in a form of User Stories or Use Cases.
- Edge Cases and Scenarios that will not be covered
- Constraints
- Architectural Characteristics for the whole system or its parts
- Borders of the system under construction

Flag: an agreement with the interviewer on the design.
Output (list of artifacts to be obtained): FR (User Stories, Corner Cases), AR+quantitative characteristics

## 2. Create a High-Level Design

Sketch your main components/parts/subsystems and the connections between them. Justify, refactor and repeat.
If possible, go through a few concrete use cases.

?? Estimations
?? Define Data model (Logical and Physical ERD etc) .

=> maybe add some APIs for Read/Write scenarios for crucial components/parts then define these API and borders.

Flag: an agreement with the interviewer on the design.
Output: blueprint of a system under construction. Only main components.

## 3. Design Deep Dive

identify and prioritize components in the architecture
dig deeper into 2–3 components
and select DB types
provide different approaches, their pros and cons, and why would you choose one

Flag: does your design meet all functional and non-functional requirements?
Output: ??

## 4. Wrapping up

Try to answer these follow-up questions:
identify the system bottlenecks and discuss potential improvements
it could be useful to give the interviewer a recap of your design.
you can talk about error cases (network faults, server failure),
operation issues (maybe properties of production-ready systems)
how to handle next scale curve
