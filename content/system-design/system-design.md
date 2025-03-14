---
contributors: []
date: '2025-02-22T09:02:28.392283'
description: Default Description
draft: false
lastmod: '2025-02-22T09:02:28.392283'
menus:
- main
- footer
summary: ''
tags:
- system-design
- architecture
- advice
title: System Design
toc: true
url: /system-design/about
weight: 810
---
# Common Guide



Difference between SD and architecture, software design

The output of the SD interview is a blueprint of the system to deliver. High-level - you have only 1-hour, short term (without changes in the future), without a detailed or any plan how to implement this system

Hypothesis to check: some of the principles of common software engineering could not be useful here, another have more importance

# Courses

There are numerous sources available for learning System Design (SD). To help avoid "tutorial hell," this selection focuses on core tutorials, videos and courses that provide a structured learning path.

- ["System Design for Interviews and Beyond"](https://systemdesignthinking.thinkific.com/courses/system-design-for-interviews-and-beyond) course and [youtube videos](<https://www.youtube.com/@SystemDesignInterview/videos>) video serie containing examples. 

"In this video-based course, we will take you on a journey to learn the *fundamental concepts* of system design. ... In addition to the knowledge and understanding of system design concepts, this course will teach you *the thought process behind system design*. We will discuss the questions you should ask yourself when designing a system and how to evaluate available options. ... "

- Algoexpert 2 courses (fundamentals and examples)

- Zerotomastery "Master the Coding Interview: System Design + Architecture (Part 1)"

- HelloInterview  examples + youtube channel + premium subscription
<https://interviewing.io/guides/system-design-interview/part-four#chapter-one>


# SD Framework

steps, checklists

<https://interviewing.io/guides/system-design-interview/part-three>

## Common / Preparations

interviewing.io guides
<https://blog.pragmaticengineer.com/preparing-for-the-systems-design-and-coding-interviews/>
<https://github.com/Sairyss/system-design-patterns>

interview process guides
interview guide +
interviewing.io
<https://www.tryexponent.com/blog/system-design-interview-guide>

Fightclub Guide
<https://github.com/systemdesignfightclub/SDFC/tree/main>
and videos: https://www.youtube.com/@SDFC/videos
Stopped 1 year ago. 

watch, analyze and reflect mock interviews [Mock interviews](#mock_interviews)

maybe see channels with useful videos [Useful videos](#useful_videos)

# Other

codemia.io (?)

reflect and analyze papers [Papers](#papers)

blogs on system design; technical blogs; conferences

# Plan

Start by developing a toolbox (Version 1) to address the time-consuming nature of selecting tools and patterns, as identifying the right tools and patterns can be a lengthy process. Apply it to practical challenges while iterating and improving it along the way.

## Action Plan Structure

1.Develop a Starter Toolbox (Version 1):
    - Create a collection of foundational tools, frameworks, and design patterns to streamline the decision-making process.
    - Focus on essential concepts like scalability, reliability, and modularity to build a versatile starting point.

2.Apply the Toolbox to Real-World Challenges:
    - Use your toolbox to design solutions for practical scenarios, such as building scalable APIs, designing a database schema, or implementing caching layers.
    - Select diverse problems to cover a range of system design principles.

3.Iterate and Refine:
    - Continuously evaluate your toolbox based on the challenges you solve.
    - Identify gaps or inefficiencies and incorporate new tools, techniques, or patterns as you gain experience.

4.Practice Collaborative Design:
    - Simulate interview-style system design discussions with peers or mentors to enhance your ability to explain and adapt your toolbox in real-time.

5.Document Lessons Learned:
    - Keep a log of the systems you design, the tools you use, and the trade-offs you encounter.
    - Use these reflections to improve your problem-solving and prepare for interviews.

# SD Interview

{{< callout context="note" title="Advice" icon="outline/info-circle" >}}
Use [Learning]({{< ref "projects/foundations/learning" >}}) principles and practices!
{{< /callout >}}

At a high level, preparing for system design interviews is really about assembling the *right* pieces: you'll need to know some core concepts, key technologies, and common patterns. On this base, you'll establish a strategy or delivery framework for executing the interview. And finally, you'll need to *practice* to ensure you're comfortable the day of your actual interview.

HelloInterview structured learning process into these blocks:
Core Concepts =>
{ Key Technologies, Patterns } =>
Delivery Framework =>
Common Problems Practicing

## Practice 

Once you have the foundation in place, it's time to practice. Passively consuming content is good, but you'll retain 10x more information by actually doing.

1. Choose a question: Select a question from the list of common questions below.
2. Read the requirements: Understand the requirements of the system you'll need to design.
3. Try to answer on your own: Either practice with our [Guided Practices](https://www.hellointerview.com/premium) (below) or on a virtual whiteboard like [Excalidraw](https://excalidraw.com/).
4. Read the answer key: Only after you have tried to answer the question, read the answer key to see how your answer compares.
5. Put your knowledge to the test: Once you've done a few questions and are feeling comfortable, put your knowledge to the test by [scheduling a mock interview](https://www.hellointerview.com/mock/schedule) with an interviewer from your target company.

## Interviewing.io

Candidates often get overwhelmed with system design. We don't blame them. There are literally hundreds of topics you can study when preparing for an interview. But does that mean that you should drop everything and go study all of them? Absolutely not. It's vital to master the basic principles first.

Professional experience with distributed systems isn't needed to pass system design interviews. And even if you do have that experience, keep in mind that many talented distributed systems engineers still struggle with the system design interview format. How you perform in an interview is not a measure of your worth as a software engineer -- it is a measure of *your ability to do system design interviews*. The two are related but not equal; being a good programmer has a surprisingly small role in passing interviews.

# Mock Interview Examples

interviewing.io videos from youtube <https://www.youtube.com/watch?v=mQgKAK7y11s>

tryexponent mock videos <https://www.youtube.com/watch?v=iyLqwyFL0Zc>

hello interview <https://www.youtube.com/watch?v=tgSe27eoBG0> really interesting
<https://www.hellointerview.com/>

<http://youtube.com/watch?v=PI0yGBT9LHo>

vsevolodovich:
- https://www.youtube.com/watch?v=JWc8L2cCnJI
- 

^^ analyze them:

- find out errors, try it yourself first, how would you resolve this errors?
- technical depth? alternative solutions?
- communication aspect, leadership skills, proactivity,
- interview structure.

# Advices

It's vital to master the Basic Principles first.

The best candidates trying by doing LOTS of mock interviews, with peers

Use engineering principles. ? [link]

# Interview Process

[Interview]({{< ref "system-design/interview/interview" >}})

# What to Learn

[Elements]({{< ref "system-design/elements/elements" >}})

Areas (from algoexpert):

- foundational SD knowledge
- key characteristics of systems
- actual components of the system like LB, caches, proxies, leader election
- actual tuck; real-life tools, existing products to use in SD to build your system
- system design patterns

(refactor)
Topics to research and grok:
building blocks (systems approach?)
nfu reasoning
trade-offs:

- commong trade-off reasoning
- make a list of these in one place and refine them after you get more and more practice
async patterns, communication, protocols,
distributed coordination, transactions and sagas..
common technical problems
data and databases
api construction
fundamental things: vector clocks

(hellointerview) classification

(interviewing.io)
12 fundamental (technical) system design concepts:
a. APIs
b. Databases (SQL vs NoSQL)
c. Scaling
d. CAP Theorem
e. Web authentication and basic security
f. Load balancers
g. Caching
h. Message queues
i. Indexing
j. Failover
k. Replication
l. Consistent hashing

# Projects & Examples

first in themes file, also we have a big amount of mock interviews
algoexpert videos
hellointerview
smarchok
etc
+this one <https://interviewing.io/guides/system-design-interview/part-four>
from distributed-systems (link) (? some examples)

# Community

discord servers!
forums
meet ups

<https://launchpass.com/pminterview>

you can discuss some project on leetcode, for example

# Fundamentals & Distributed Systems

[Distributed-systems]({{< ref "system-design/topics/distributed-systems" >}})

# Microservices

[Microservices]({{< ref "system-design/topics/microservices" >}})

# Sources

<https://www.hellointerview.com/learn/system-design/problem-breakdowns/leetcode>

Also there are another materials:
- "Systems Design Interview Tips" by Algoexpert.
- [System Design Patterns](<https://github.com/Sairyss/system-design-patterns>) project has interesting cirriculim with examples.
- Designgurus website has a set of SD [courses playbook](https://www.designgurus.io/path/system-design-interview-playbook).
- Bytebytego has many useful materials

tryexponent courses ?

## Other

<https://mlengineer.io/facebook-system-design-interview-4-must-watched-videos-212e07d4fbc2>
Scaling Instagram Infrastructure - <https://www.youtube.com/watch?v=hnpzNAPiC0E&t=669s>
Scaling Facebook Live Videos to a Billion Users - <https://www.youtube.com/watch?v=IO4teCbHvZw&t=1692s>
Building Real Time Infrastructure at Facebook - Facebook - SRECon2017 - <https://www.youtube.com/watch?v=ODkEWsO5I30>
USENIX ATC '13 - TAO: Facebook's Distributed Data Store for the Social Graph - <https://www.youtube.com/watch?v=sNIvHttFjdI>

<https://muratbuffalo.blogspot.com/2023/10/hints-for-distributed-systems-design.html>

## useful_videos

common overview
<https://www.youtube.com/watch?v=F2FmTdLtb_4>

channels with useful videos:
<https://www.youtube.com/@hello_interview> staff engineer
<https://www.youtube.com/@irtizahafiz>
<https://www.youtube.com/@interviewpen> ??
<https://www.youtube.com/@ByteByteGo>

## Papers

<https://www.confluent.io/blog/kafka-streams-tables-part-1-event-streaming/>
<https://levelup.gitconnected.com/system-design-interview-all-or-none-ordered-peer-to-peer-broadcast-45b33fb2f6be>

sla, slo and other: <https://sre.google/sre-book/service-level-objectives/>

papers:
• Amazon - Dynamo paper
• Google - Map-reduce paper
• Google - GFS paper
• Facebook - TAO paper
• Jeff Dean's talk at Stanford: /watch?v=modXC5IWTJI
• Building Billion user Load Balancer at Facebook: /watch?v=bxhYNfFeVF4
• Netflix Guide to Microservices: /watch?v=CZ3wIuvmHeM
• Amazon DynamoDB deep dive: /watch?v=HaEPXoXVf2k
