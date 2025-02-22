---
contributors: []
date: '2025-02-22T09:02:28.392283'
description: Default Description
draft: false
lastmod: '2025-02-22T09:02:28.392283'
summary: ''
title: Phrases
toc: true
weight: 810
---

Your mentioned also that we should retrieve interviews
I'm thinking about that actual interviewing.io

# Exactly what words to say in specific scenarios

## What to say when you don't know what to do

Weak interview candidates are scared to ever utter the phrase "I don't know." Stronger interview candidates say "I don't know" more often and then strengthen this with a buffer—the words you put around your uncertainty. A naked "I don't know" is a dead end, so your interviewer has nowhere to go. Adding a buffer gives your interviewer several paths they can take to move the conversation forward.

хх

Before we tell you exactly what words to say, let's unpack a concept. There are different levels of "not knowing." Sometimes you have no clue. Sometimes you have a clue. And other times, you're certain.

<https://interviewing.io/guides/system-design-interview/part-two#c-exactly-what-words-to-say-in-specific-scenarios>

# Questions

Asking High-Impact, Non-Trivial Questions
Many candidates ask basic clarifying questions (e.g., "What's the expected user base?"). A proactive candidate asks **impactful, second-order questions**, such as:

The goal is to uncover **hidden constraints and trade-offs** that shape the design's direction.

## Alternative

Maybe ask not the expected user base, but make a set of assumptions and then aks about the set itself. Does it reflect the actual situation?

# Verify phrases

0. Is that correct?
1. "Is that a fair way to describe this?"
2."Would you say that's an accurate representation of the concept?"
2."Does that seem like a correct description to you?"
3."Do you think I'm on the right track with that explanation?"
4."Have I captured the essence of the idea adequately?"
5."Do you agree with this portrayal of the system?"
6."Does that capture the idea correctly, in your opinion?"
7."Is my understanding in line with what we're aiming for?"
8."Would this be an appropriate way to articulate the design?"
9."Does this align well with your understanding?"
10."Is this depiction consistent with your perception of the system?"

# Assumption phrases

Let's assume that

1. "For the purpose of this discussion, we can consider..."
2. "In order to simplify the problem, we will suppose that..."
3. "As a starting point, let's take into account that..."
4. "To begin with, let's presume that..."
5. "In the context of this system design, we'll work under the assumption that..."
6. "For the sake of our analysis, we'll assume that..."
7. "To simplify our approach, let's suppose that..."

1. "For the sake of this discussion, let's say that..."
2. "If we consider a situation where..."
3. "Presuming that..."
5. "Under the assumption that..."
7. "Suppose that..."
8. "In a scenario where..."
9. "Assuming, for argument's sake, that..."
10. "If we take for granted that..."
11. "Let's propose a hypothetical in which..."
12. "Should we accept the premise that..."
13. "Positing that..."
14. "Given the condition that..."
15. "On the understanding that..."
16. "Taking into consideration that..."
17. "Assuming the scenario where..."
18. "Let's model a situation where..."

Remember to use these phrases to clearly outline assumptions or conditions to your design. This will help set up a clear context and constraints for your design solutions.

# Assumption questions

And just a general question. Can I assume that [your auth and authorization is already handled?]

1. "Is it safe to presume that...?"
2. "Am I correct in thinking that...?"
3. "Do we take it as a given that...?"
4. "Would it be reasonable to infer that...?"
5. "Is it correct to suppose that...?"
6. "May I consider that...?"
7. "Would you agree if I say that...?"
8. "Is it accurate to assume that...?"
9. "Can we operate under the assumption that...?"

1. "Could we establish that...?"
2. "Would it be logical to propose that...?"
3. "Are we working on the premise that...?"
4. "Can we accept the notion that...?"
5. "Is it fair to suggest that...?"
6. "Should we proceed under the belief that...?"
7. "Can we base our discussion on the idea that...?"
8. "Would it be sensible to envisage that...?"
9. "Can we build our argument on the fact that...?"
10. "Could we take for granted that...?"

# Trade-off Discussion Phrases

These phrases highlight the pros and cons of a design decision.

"If we use a relational database, we'll have strong consistency and structured data, but it may not scale horizontally as well as a NoSQL database."

"Implementing microservices will provide scalability and isolation, but it might also introduce complexity in terms of service coordination and data consistency."

1. "While using a SQL database would give us the benefits of ACID properties and structured data, we might encounter scalability issues as the user base grows."

2. "If we choose to implement a microservices architecture, we would benefit from better scalability and separation of concerns, but we also need to consider the increased complexity in service communication and data consistency."

3. "Opting for a monolithic architecture could expedite our initial development process due to its simplicity. However, in the long run, we might face issues with scalability and agility."

4. "Implementing a caching layer can significantly improve our system's performance by reducing database load. However, we would then need to address challenges related to cache invalidation and maintaining data consistency."

5. "While vertical scaling might provide us with a straightforward way to improve our system's capacity, it's not as cost-effective or flexible as horizontal scaling."

6. "Implementing data sharding can help manage large volumes of data more efficiently, but it also introduces additional complexity, such as handling distributed transactions and joins."

7. "Using a NoSQL database can offer us flexible data models and easy scalability, but we lose some of the benefits of structured querying and ACID properties that a SQL database provides."

8. "Storing data in multiple regions can improve latency and availability for users worldwide, but we'd have to carefully handle data replication and consistency."

When discussing trade-offs during a system design interview, there are several categories that you can focus on. Here are some examples:

1. **Performance vs Scalability**: These phrases discuss the trade-off between optimizing a system for performance (speed) versus scaling (handling growth).

    - "Using a cache can significantly improve performance, but it also introduces the problem of cache management as we scale."
    - "We could optimize our database for read-heavy operations for faster performance, but this could affect our ability to scale for write-heavy operations."
2. **Consistency vs Availability**: In distributed systems, there's often a trade-off between data consistency and system availability (as described in the CAP theorem).

    - "We could design for strong consistency, but that might impact our system's availability in case of network partition."
    - "If we aim for high availability, we might need to tolerate eventual consistency in our data."
3. **Speed of Development vs System Performance**: These phrases discuss the trade-off between quickly building a system and optimizing it for high performance.

    - "Using an ORM could speed up our development process, but it might not be as performant as writing raw SQL queries."
    - "A monolithic architecture may allow us to develop quickly in the early stages, but it could impact performance and scalability in the long term."
4. **Read Optimization vs Write Optimization**: These phrases discuss the trade-off between optimizing for read operations versus write operations.

    - "Denormalizing the database can speed up read operations, but it can slow down write operations due to the need for multiple updates."
    - "If we optimize for write operations, we might slow down read operations, as more complex queries might be required."
5. **Cost vs Performance**: These phrases discuss the trade-off between the cost of resources (like servers or services) and the performance they provide.

    - "While using premium server hardware or services can improve our system's performance, it will also increase our costs."
    - "We could use a CDN to improve our global load times, but this would also increase our operational expenses."

# To Sort and Review

# Common phrases and synonims

- going to do something
- Intend to do something
- Aim to do something

# Requirements

Can I assume that this system is already handled or do I need also implement it here?

Just to simplify and for the context what I'm doing here I will assume that I'll get an email address that is already validated and all that and that email address will be what I would use to refer to specific users.

I just want to get on a general overwiev so we are sure that we are on the same page so basically we are going to have like a user [situation overview]

So the first thing that we are going to have is that both will have to access some type of front end. In it the logged in

We are also going to have a some way to compile and run the code

I'm assuming here we are talking about a coding interview which is more interesting. But do you care about other types of interview.

Do you want me to cover other parts? -> No

Rewiew phrases and their aim.

And at the same time we need to have something that will be able to store the interview.
This would be bassically the audio support where we are actually going to allow users to talk to each other.

So I think discover the main features that we are going to support.

Is there anything else that is not on the list that you think I should cover?

Ok. Ok. This makes perfect sense. Okay. (Agreement)

So this service will actually have to support like multiple concurrent interviews of course like there might be more than one interview happening at the same time. But that should be fine ... so ... I'm making an assumption here and you might correct me if I'm wrong.  But assistant like interviewer dot IO it might have maybe let's say hundreds of users doing an interview at the same moment in time but it is it seems unlikely that they would have like hundreds of thousands with like different orders of magnitude right uh is this a fair assumption do you want me to assume that it will have like a reasonable number of users or do you want me to just for the sake of it assume that we are going to have I don't know a million users are doing it at the same time or something like that I think talking about how your system can scale
^ question about assumption and
REWRITED
So, this service will need to support multiple concurrent interviews, as there may be more than one interview happening simultaneously. However, I want to clarify my assumption and invite your input if I'm mistaken. For instance, Assistant Interviewer.IO might have hundreds of users conducting interviews concurrently, but it seems unlikely that it would have hundreds of thousands of users or orders of magnitude higher. Is it fair to assume that we should consider a reasonable number of users, or would you like me to assume an extreme scenario, such as a million users conducting interviews simultaneously? I believe discussing how the system can scale is important in this context.

xxxxxxxx

Design for me an interviewing.io

I'll try here to draw main components (shows drawing.io)

So, basically,

First, we are going to have the online editor and

so basically these these two users will would actually talk then as I mentioned with that at first with the general front end here uh this front end is obviously like a distributed piece of infrastructure. So for the purpose of this I will put it as a black box here. If we have time later we can try make it like to to give it a specific dimension to see how many like service we would need and all that. But because I will be more worried about allowing it to scale than to have a correct number of instance right off the bat. Then I will not discuss this at this point in time but I we can get to it like later. right? So basically yeah these users they are already authenticated

And basically what it does.

xxxx design Spotify (IGonAnOffer)

I can think of thing I mean there'are song musics, [list of ]
Lets establish some basic use cases.  
But most core thing is that I play a song and it's coming back through my phone maybe my car

Let's do some quick drilling down into some numbers here. So tell me about how many users you're thinking about here for this design?

What about number of songs?

make do
a black amish a thing?
..., I barely had any suicides, did I?
I'd say Robert's about 40-odd - [maybe](https://dictionary.cambridge.org/dictionary/english/maybe "maybe") 45.

To learn roots, you must understand the prefix and suffix pattern of words and their impact when added to different words.  

from grokking sd interview

*To handle this*, a more intelligent LB solution *can be placed* that periodically queries backend server about their load and *adjusts traffic* based on that.
