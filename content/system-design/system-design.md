---
draft: false
toc: true
title: "System Design"
linkTitle: "System Design"
---
# What to Learn

{{< callout context="note" title="Advice" icon="outline/info-circle" >}}
Use [[learning]] principles and practices!
{{< /callout >}}

At a high level, preparing for system design interviews is really about assembling the *right* pieces: you'll need to know some core concepts, key technologies, and common patterns. On this base, you'll establish a strategy or delivery framework for executing the interview. And finally, you'll need to *practice* to ensure you're comfortable the day of your actual interview.

More detailed information and (list?) are in [Elements]({{< ref "system-design/elements/elements" >}})

About depth:
> What's the difference between knowing the path and walking the path? How can we tell when our knowledge of a subject has become a real, applicable skill?
- [ ] SDFC gihub-repo (System Design Fight Clut) road map also contains interesting 'Resources' section with differect categories as well as 'Terms & Concepts' section with concept & book list per level (senior, staff). Hovewer, it's more oriented for distributes systems and  'system'-level jobs.

# relationship / interconnections map


I would also say that System Design has connections to other fields, like as:

```
System Design
 │
 ├─ Foundations
 │   ├─ Software Engineering
 │   └─ Architecture
 │
 ├─ Core Technical Pillars
 │   ├─ Distributed Systems
 │   ├─ Data & Databases (DDiA)
 │   ├─ Microservices
 │   ├─ Communication & Protocols
 │   └─ API Engineering
 │
 ├─ Product & User Context
 │   ├─ Product Management
 │   └─ User Experience (UX)
 │
 └─ Execution & Org Context
     ├─ Project Management Aspect
     ├─ (Time & Complexity)
     └─ Organizational Context
```

The output of the SD interview is a blueprint of the system to deliver. In more common sence it would be set of signals and information to the interviewer.

It's high-level - you have only approximately 45 minutes, short term (without changes in the future), without a detailed or any plan how to implement this system. Another differences to a real system delivery: absense of org context, team and project management, ( what else?)

So here is a hypothesis to check: do sofware engineering principles and laws  have some other importance profile (statistically)

# Modeling and Discource

# How to prepare


maybe see channels with useful videos [Resources]({{< ref "system-design/resources" >}}#useful-videos)

reflect and analyze papers [Papers](#papers)

blogs on system design; technical blogs; conferences

# Advices


It's vital to master the Basic Principles first.

The best candidates trying by doing LOTS of mock interviews, with peers

start interviews early

Use engineering principles. ? [link]

# Plan v0.1


Start by developing a toolbox (Version 1) to address the time-consuming nature of selecting tools and patterns, as identifying the right tools and patterns can be a lengthy process. Apply it to practical challenges while iterating and improving it along the way.

## Action Plan Structure


0. Play through and collect information over several real-world challenges. repeat them with AI, then really implement them with llm-agents. Then reflect.
2. Apply the Toolbox to Real-World Challenges:
- Use your toolbox to design solutions for practical scenarios, such as building scalable APIs, designing a database schema, or implementing caching layers.
- Select diverse problems to cover a range of system design principles.

2a.Develop a Starter Toolbox (Version 1):

- Create a collection of foundational tools, frameworks, and design patterns to streamline the decision-making process.
- (?) Focus on essential concepts like scalability, reliability, and modularity to build a versatile starting point.
3. Iterate and Refine:
- Continuously evaluate your toolbox based on the challenges you solve.
- Identify gaps or inefficiencies and incorporate new tools, techniques, or patterns as you gain experience.
4. Practice Collaborative Design:
- Simulate interview-style system design discussions with peers or mentors to enhance your ability to explain and adapt your toolbox in real-time.
5. Document Lessons Learned:
- Keep a log of the systems you design, the tools you use, and the trade-offs you encounter.
- Use these reflections to improve your problem-solving and prepare for interviews.

## Practice


Once you have the foundation in place, it's time to practice. Passively consuming content is good, but you'll retain 10x more information by actually doing.

1. Choose a question: Select a question from the list of common questions below.
2. Read the requirements: Understand the requirements of the system you'll need to design.
3. Try to answer on your own: Either practice with our [Guided Practices](https://www.hellointerview.com/premium) (below) or on a virtual whiteboard like [Excalidraw](https://excalidraw.com/).
4. Read the answer key: Only after you have tried to answer the question, read the answer key to see how your answer compares.
5. Put your knowledge to the test: Once you've done a few questions and are feeling comfortable, put your knowledge to the test by [scheduling a mock interview](https://www.hellointerview.com/mock/schedule) with an interviewer from your target company.

## Interviewing.io


Candidates often get overwhelmed with system design. We don't blame them. There are literally hundreds of topics you can study when preparing for an interview. But does that mean that you should drop everything and go study all of them? Absolutely not. It's vital to master the basic principles first.

Professional experience with distributed systems isn't needed to pass system design interviews. And even if you do have that experience, keep in mind that many talented distributed systems engineers still struggle with the system design interview format. How you perform in an interview is not a measure of your worth as a software engineer -- it is a measure of *your ability to do system design interviews*. The two are related but not equal; being a good programmer has a surprisingly small role in passing interviews.

# Interview and Delivery Framework


My artifacts:

- [Iw Io Interview]({{< ref "system-design/interview/iw-io-interview" >}}) notes + checklist.v0.1
- 'sd-interview-framework.v0' with 'frameworks' folder

<https://interviewing.io/guides/system-design-interview/part-three>

watch, analyze and reflect mock interviews [mock_interviews](#mock-interviews)

# Mock Interview Examples


interviewing.io videos from youtube <https://www.youtube.com/watch?v=mQgKAK7y11s>

tryexponent mock videos <https://www.youtube.com/watch?v=iyLqwyFL0Zc>

hello interview <https://www.youtube.com/watch?v=tgSe27eoBG0> really interesting

<https://www.hellointerview.com/>

<http://youtube.com/watch?v=PI0yGBT9LHo>

vsevolodovich:

- <https://www.youtube.com/watch?v=JWc8L2cCnJI>

^^ analyze them:

- find out errors, try it yourself first, how would you resolve this errors?
- technical depth? alternative solutions?
- communication aspect, leadership skills, proactivity,
- interview structure.

# Projects & Examples


[[projects_gtd/projects|projects]] SD section

# Community


discord servers!

forums

meet ups

<https://launchpass.com/pminterview>

you can discuss some project on leetcode, for example

# Fundamentals & Distributed Systems


[Distributed Systems]({{< ref "engineering/topics/distributed-systems" >}})

# Microservices


[Microservices]({{< ref "engineering/topics/microservices" >}})

# Other
