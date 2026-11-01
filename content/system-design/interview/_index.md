---
draft: false
toc: true
title: "System Design Interview Practice"
description: "The interview route through the system design flow: study plan, interview frameworks, communication, mock review, assessment criteria, source guidance, and practitioner comments."
linkTitle: "Interview Practice"
---

An interview is one route through the [system design flow]({{< ref "system-design" >}}), compressed into about an hour and spoken aloud. The technical content is the same as for prototyping or reviewing a design. What changes is the time limit, the need to narrate choices, and the absence of real feedback from running code.

## How an interview maps onto the flow


The correspondence below is a working interpretation, not a claim made by the frameworks themselves.

| Interview step | Step in the flow | Counterpart when prototyping |
| --- | --- | --- |
| Requirements and scope | Context, goal, and [forces]({{< ref "system-design/nfr" >}}) | Backward design from the outcome |
| Core entities and API | [Contracts]({{< ref "system-design/elements/communication" >}}#contracts-and-api-design) between components | Interfaces in a walking skeleton |
| High-level design | [Structure patterns]({{< ref "system-design/elements" >}}), mostly at their [defaults]({{< ref "system-design/elements/defaults-and-triggers" >}}) | A walking skeleton drawn on a whiteboard |
| Tracing a request through the design | The [request path]({{< ref "system-design/elements/request-path" >}}) and data flow | A tracer bullet |
| Deep dives | The hub for the riskiest question | A spike |
| Wrap-up | Decision and trigger | An architecture decision record |

## Preparation


- [Study and practice plan]({{< ref "system-design/interview/study-and-practice" >}}): what to learn, a practice loop, and how to review a mock interview.
- [Interview frameworks]({{< ref "system-design/interview/frameworks" >}}): Hello Interview, interviewing.io, the four-step outline, a personal draft, and an extended collection, with a comparison of their emphases.
- [Practice cases]({{< ref "system-design/projects" >}}) and the [case template]({{< ref "system-design/projects/case-template" >}}).
- [Problem-solving checklist]({{< ref "system-design/problem-solving-checklist" >}}): questions that apply inside any framework, and outside interviews.

## Communication and review


- [Communication phrases]({{< ref "system-design/interview/phrases" >}}): clarify scope, state assumptions, compare choices, and respond to feedback.
- [Mock-review method and observations]({{< ref "system-design/interview/mock-interviews" >}}): review a complete attempt and select the next practice target.
- [Practice review rubric]({{< ref "system-design/interview/practice-review-rubric" >}}): a detailed scoring draft with behavioral examples. Its weights and thresholds are proposed practice tools.

## Source material


- [interviewing.io interview notes]({{< ref "system-design/interview/iw-io-interview" >}}): interview types, assessment dimensions, collaboration, warning signs, and technical depth.
- [Collected interview comments]({{< ref "system-design/interview/collected-interview-comments" >}}): practitioner opinions and discussion excerpts. Read them in their original context.

## Library sources


- А как собеседоваться? (How to do job interviews)
