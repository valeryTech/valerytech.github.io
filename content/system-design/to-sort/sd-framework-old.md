---
draft: false
toc: true
title: "SD Framework Old"
linkTitle: "SD Framework Old"
---
# To Refactor


<https://www.youtube.com/watch?v=Gg318hR5JY0>

analyze this video from google

how candidate reason about scalability and availability?

frame an interviewer that you understand that your system would need to be distributed (in some scenarios)

design the system to be scalable

interview: make reasonable design choice and justify it

What you do is important, but how you communicate is even more important.

An interviewer is not expecting exactly correct answers that correspond with a rubric. There is, in fact, no "right" answer. Instead, they want to see comprehension of the problem at hand. A good interviewee will lead a conversant and comfortable walk through of their assumptions, calculations, trade-offs, and design choices.

Questions you may want to keep in mind include:

- How can we tell that the system is working?
- Is there a bottleneck in the design?
- If there are multiple components, what are the APIs and how do they work together?
- How can we provide great service to users all around the planet?

Things you might expect:

- Long gone are the days when everything you design could easily fit onto a single machine. You may be given a large data set to work with. You need to explain how it can be sharded among multiple worker machines.
- You may be presented with a request which can be answered by any one of a pool of machines and you need to identify the fastest machine and discard the rest.
- You should also be prepared to discuss system component properties such as latency, throughput, and storage. The interviewer would want to see numeric estimates for these properties, such as how many requests per second the system can handle. Also, be prepared to provide a clear justification of how the design backs up these numbers.

You should know industry solution patterns like:

- Sharding Data
- Replication Types
- Write-ahead Logging
- Separating Data and Metadata Storage
- Basic Kinds of Load Distribution

### Trade-offs and Compromises


As a systems designer at Google, you will have to make trade-offs and compromises.

The interviewer may ask you to identify systematic shortcomings and describe how the system responds to various failures. You are expected to lay out the trade-offs and compromises you made and explain your reasoning.

Example: Do you store data on a rotating disk and pay less money for the storage at the cost of increased latency? Or do you put the data on a flash drive where you're able to retrieve it quickly but pay more money?

Google looks for systems designers that can consider multiple solutions, commit to one, and then iterate on it.

Now that you have the focus areas, here are some overall best practices to keep in mind for your actual interview day.

- Explain: The interviewer wants to understand how you think, so it is important to explain your thought process during the interview. They are not only evaluating your technical ability but also how you solve problems.

As an engineer, we like to solve hard problems and jump into the final design; however, this approach is likely to lead you to design the wrong system.

In system design interviews, it's crucial to establish a shared understanding with the interviewer before progressing through each phase. Here's a structured approach to achieve this:

Try:

- Explore All Alternatives: Before settling on a design choice, consider various options. Discuss these alternatives with the interviewer to evaluate their feasibility and relevance.
- Confirm Assumptions:
	- Explicitly State Assumptions: Clearly articulate any assumptions you are making about the system's behavior or constraints.
	- Seek Validation: Present these assumptions to the interviewer and ask for confirmation to ensure alignment. For example, you might say, "I'm assuming the system needs to handle up to 10,000 concurrent users; does that align with your expectations?"
- Obtain Clear Approval Before Proceeding:
	- Summarize Key Points: After discussing requirements and assumptions, recap the main decisions and understandings (?)
	- Seek a Green Light: Ask the interviewer directly if they're comfortable with the discussed approach before moving to the next step. This could be phrased as, "Is there anything else we should consider, or are we ready to proceed with this design direction?"

# Algorithm

## Understand the problem and establish design scope

> Outline use cases, constraints, and assumptions. Define Feature Expectations
Just like algorithm design, system design questions will also most likely be weakly defined. So we need gather requirements and scope the problem. You have to get a sense for the scope of the problem before you start exploring the space of possible solutions.

So how do you figure out what type of service the interviewer wants you to build? Ask them! A basic prompt leaves room for you to start a conversation with your interviewer about the system you're designing -- what type of users does it serve, what type of traffic can it expect, what limits will it have? Demonstrating that you can think critically about the parameters of your service is the first step in any system design interview.

What you need to collect and define:

- Functional Requirements. May be in form of User Stories or Use Cases.
- Scenarios that will not be covered and Edge Cases
- API
- Design Goals in form of Architectural Characteristics (Non-Functional requirements). It may be such as: number of current and future users and others. Latency and Throughput requirements. Consistency vs Availability  [Weak/strong/eventual => consistency | Failover/replication => availability]. Question: what parts of my system are absolutely critical? And what parts of my system would be ok to fail?

Questions:

SLA numbers;

volume of the system: number of users,

time/flow/peaks: number of current users, peaks

data distribution

### User stories, use cases


The very first thing you should do with any system design question is to clarify the system's constraints and to identify what use cases the system needs to satisfy. Spend a few minutes questioning your interviewer and agreeing on the scope of the system. Many of the same rules we discussed while talking about algorithm design apply here as well.

Usually, part of what the interviewer wants to see is if you can gather the requirements about the problem at hand, and design a solution that covers them well.

Never assume things that were not explicitly stated.

For example, the URL-shortening service could be meant to serve just a few thousand users, but each could be sharing millions of URLs. It could be meant to handle millions of clicks on the shortened URLs, or dozens. The service may have to provide extensive statistics about each shortened URL (which will increase your data size), or statistics may not be a requirement at all.

You will also have to think about the use cases that are expected to occur. Your system will be designed based on what it's expected to do. Don't forget to make sure you know all the requirements the interviewer didn't tell you about in the beginning.

### Ask questions to clarify use cases and constraints


Do you know the constraints? What kind of inputs does your system need to handle? Discuss assumptions.

- Who is going to use it? How are they going to use it? How many users are there? What does the system do? What are the inputs and outputs of the system? How much data do we expect to handle? How many requests per second do we expect? What is the expected read to write ratio?
- How fast does the company anticipate to scale up? What are the anticipated scales in 3 months, 6 months, and a year? What is the company's technology stack? What existing services you might leverage to simplify the design?

### Define API


Define what APIs are expected from the system. This would not only establish the exact contract expected from the system but would also ensure if you haven't gotten any requirements wrong. Some examples for our Twitter-like service would be:

`

postTweet(user_id, tweet_text, image_url, user_location, timestamp, ...)

generateTimeline(user_id, current_time)

recordUserTweetLike(user_id, tweet_id, timestamp, ...)

`

If you have gathered the requirements and can identify the APIs exposed by the system, you are 50% done.

### Defining Domain Model

### Defining the Data Model


Defining the data model early will clarify how data will flow among different components of the system. Later, it will guide you towards better data partitioning and management. Candidate should be able to identify various entities of the system, how they will interact with each other and different aspect of data management like storage, transfer, encryption, etc. Here are some entities for our Twitter-like service:

`

User: UserID, Name, Email, DoB, CreationData, LastLogin, etc.

Tweet: TweetID, Content, TweetLocation, NumberOfLikes, TimeStamp, etc.

UserFollows: UserdID1, UserID2

FavoriteTweets: UserID, TweetID, TimeStamp

`

OUTPUT: ???

## Create a High Level Design


Which database system should we use? Would NoSQL like Cassandra best fits our needs, or we should use MySQL-like solution. What kind of blob storage should we use to store photos and videos?

Once you've scoped the system you're about to design, you should continue by outlining a high-level abstract design. The goal of this is to outline all the important components that your architecture will need.

It is a great idea to collaborate with the interviewer during the process: come up with an initial blueprint for the design. Ask for feedback. Treat your interviewer as a teammate and work together. Many good interviewers love to talk and get involved.

Draw box diagrams with key components on the whiteboard or paper. This might include clients (mobile/web), APIs, web servers, data stores, cache, CDN, message queue, etc.

High Level Design may express the brief functionality of each module in a form of a Usage Scenarios with functional flow. <-- Define this in a form of a Diagram

Get through main Use Cases.

You can tell the interviewer that you would like to do that and draw a simple diagram of your ideas. Sketch your main components and the connections between them. If you do this, very quickly you will be able to get feedback if you are moving in the right direction. Of course, you must be able to justify the high-level design that you just drew.

Don't get lured to dive deep into some particular aspect of the abstract design. Not yet. Rather, make sure you sketch the important components and the connections between them. Justify your ideas in front of the interviewer and try to address every constraint and use case.

Usually, this sort of high-level design is a combination of well-known techniques, which people have developed. You have to make sure you are familiar with what's out there and feel comfortable using this knowledge. In this chapter we will assume that you have enough experience to design such a high-level system. Our goal is to focus more on the next steps, where we will talk mainly about scalability and about removing bottlenecks.

If possible, go through a few concrete use cases. This will help you frame the high-level design. It is also likely that the use cases would help you discover edge cases you have not yet considered.

1. APIs for Read/Write scenarios for crucial components. Should we include API endpoints and database schema here? This depends on the problem. For large design problems like "Design Google search engine", this is a bit of too low level. For a problem like designing the backend for a multi-player poker game, this is a fair game. Communicate with your interviewer.
2. Database schema
3. Basic algorithm
4. High level design for Read/Write scenario

Outline a high level design with all important components.

- Sketch the main components and connections
- Justify your ideas

ESTIMATIONS [5 min]

1. Throughput (QPS for Read and Write queries)
2. Latency expected from the system (for read and write queries)
3. Read/Write ratio
4. Traffic estimates
- Write (QPS, Volume of data)
- Read  (QPS, Volume of data)
1. Storage estimates
2. Memory estimates
- If we are using a cache, what is the kind of data we want to store in the cache
- How much RAM and how many machines do we need for us to achieve this?
- Amount of data you want to store in disk/SSD

_Flag_: an agreement with the interviewer on the design.

Output:

## Design deep dive


At this step, you and your interviewer should have already achieved the following objectives:

- Agreed on the overall goals and feature scope
- Sketched out a high-level blueprint for the overall design
- Obtained feedback from your interviewer on the high-level design
- Had some initial ideas about areas to focus on in deep dive based on her feedback

You shall work with the interviewer to identify and prioritize components in the architecture. It is worth stressing that every interview is different. Sometimes, the interviewer may give off hints that she likes focusing on high-level design. Sometimes, for a senior candidate interview, the discussion could be on the system performance characteristics, likely focusing on the bottlenecks and resource estimations. In most cases, the interviewer may want you to dig into details of some system components. For URL shortener, it is interesting to dive into the hash function design that converts a long URL to a short one. For a chat system, how to reduce latency and how to support online/offline status are two interesting topics.

Time management is essential as it is easy to get carried away with minute details that do not demonstrate your abilities. You must be armed with signals to show your interviewer. Try not to get into unnecessary details. For example, talking about the EdgeRank algorithm of Facebook feed ranking in detail is not ideal during a system design interview as this takes much precious time and does not prove your ability in designing a scalable system.

Dig deeper into 2-3 components; interviewer's feedback should always guide you towards which parts of the system she wants you to explain further. You should be able to provide different approaches, their pros and cons, and why would you choose one? Remember there is no single answer, the only thing important is to _consider_ _tradeoffs_ between different options while keeping system constraints in mind. e.g.

1. Since we'll be storing a huge amount of data, how should we partition our data to distribute it to multiple databases? Should we try to store all the data of a user on the same database? What issues can it cause?
2. How would we handle high-traffic users e.g. celebrities who have millions of followers?
3. Since user's timeline will contain the most recent (and relevant) tweets, should we try to store our data in a way that is optimized to scan latest tweets?
4. How much and at which layer should we introduce cache to speed things up?
5. What components need better load balancing?

For example, if you were asked to design a url shortening service, discuss: Generating and storing a hash of the full url, MD5 and Base62, Hash collisions, SQL or NoSQL, Database schema, Translating a hashed url to the full url, Database lookup, API and object-oriented design

### Low Level Design


Low-level design fills in some of the gaps to provide extra detail that's necessary before developers can start writing code. It gives more specific guidance for how the parts of the system will work and how they will work together. It refines the definitions of the database, the major classes, and the internal and external interfaces.

_Expectations from the candidates_

In the LLD Interviews, they will judge you on your knowledge of creating ==modular, flexible, maintainable and reusable software==(this is common architectural characteristics of system under design), by applying [patterns, principles, tools etc].

Usually LLD talks about the class diagrams with the methods and relations between classes, program specs and other low level details for a given system. It is also known as Object Oriented Design (OOD).

Machine coding and class diagrams do come under LLD. Most interviewers aren't super interested in the exactness of UML notations. They want to see a general understanding of the class structure and how you design APIs.

Low Level Design expresses details functional logic of the module.

_How to solve LLD problems in the Interview_

1. Clarify the problem by asking the relevant questions. Gather the complete requirement and start with the basic features.
2. Define the Core Classes ( and Objects )
3. Establish the relationships between the classes / objects by observing the interactions among the classes / objects.
4. Try to fulfill all the requirements by defining the methods
5. Apply [Object Oriented, Functional etc.] Design Principles and use Design Patterns and other tools to make the system maintainable and reusable.
6. Write well structured clean code (if you are told to implement a function)

## Wrap up


In this final step, the interviewer might ask you a few follow-up questions or give you the freedom to discuss other additional points. Here are a few directions to follow:

- The interviewer might want you to identify the system bottlenecks and discuss potential improvements. Never say your design is perfect and nothing can be improved. There is always something to improve upon. This is a great opportunity to show your critical thinking and leave a good final impression.
- It could be useful to give the interviewer a recap of your design. This is particularly important if you suggested a few solutions. Refreshing your interviewer's memory can be helpful after a long session.
- Error cases (server failure, network loss, etc.) are interesting to talk about.
- Operation issues are worth mentioning. How do you monitor metrics and error logs? How to roll out the system?
- How to handle the next scale curve is also an interesting topic. For example, if your current design supports 1 million users, what changes do you need to make to support 10 million users?
- Propose other refinements you need if you had more time.

### Identifying and resolving bottlenecks


Most likely your high-level design will have one or more bottlenecks given the constraints of the problem. This is perfectly ok. You are not expected to design a system from the ground up, which immediately handles all the load in the world. It just needs to be scalable, in order for you to be able to improve it using some standard tools and techniques.

Try to discuss as many bottlenecks as possible and different approaches to mitigate them.

1. Is there any single point of failure in our system? What are we doing to mitigate it?
2. Do we've enough replicas of the data so that if we lose a few servers, we can still serve our users?
3. Similarly, do we've enough copies of different services running, such that a few failures will not cause total system shutdown?
4. How are we monitoring the performance of our service? Do we get alerts whenever critical components fail or their performance degrades?

# Principles

# Things


- How to deal with ambiguity? What questions should you ask? Is there a some framework?
- Whether this is an algorithmic problem or system design problem, it always makes sense to start with (or at least mention to the interviewer) a simple solution and evolve the solution along the interview.
- Companies widely adopt system design interviews because the communication and problem solving skills tested in these interviews are similar to those required by a software engineer's daily work.
- The system design interview simulates real-life problem solving where two co-workers collaborate on an ambiguous problem and come up with a solution that meets their goals. The problem is open-ended, and there is no perfect answer. The final design is less important compared _to the work_ you put in the _design process_. This allows you to demonstrate your design skill, defend your design choices, and respond to feedback in a constructive manner.
- The system design interview is an open-ended conversation. You are expected to lead it.
- Many think that system design interview is all about a person's technical design skills. It is much more than that. An effective system design interview gives strong signals about a person's ability to collaborate, to work under pressure, and to resolve ambiguity constructively. The ability to ask good questions is also an essential skill, and many interviewers specifically look for this skill.
- A core aim of a systems design interview is to give the candidate an opportunity to demonstrate their knowledge
- Use your background to your advantage. Your experience and background can vary widely from the next candidate. You bring a set of values and expertise to the table that no one else can. That is what makes you valuable and irreplaceable. Regardless of what field you're in, people care about what you can bring to the table.
- Focus on thought process. What we actually care about is the thought process behind your design choices. This reflects what actually working at Palantir is like. As engineers we have a tremendous amount of freedom. We aren't asked to implement fully-specced features. Instead we take ownership of open-ended problems, and it's our job to come up with the best solution to each. (Delegation). We need people we can trust to do the right thing without a lot of supervision -- people who can own large projects and take them consistently in the right direction. Invariably, this means being able to communicate effectively with the people around you. Working on problems with huge scope isn't something you can do in a vacuum.
- Remember that there is no one right answer. A system can be built in different ways. The important thing is to be able to justify your ideas.
- We've seen good candidates fail not because they lack the knowledge but because they cannot focus on the right things while discussing a problem.
- Factor: Your ability to articulate your thoughts.
- Iterative nature of design: when designing your system, these are the kind of calculations you should be doing over and over in your head.
- In short, due to the unstructured nature of software design interviews, candidates who are organized with a clear plan to attack the problem have better chances of success.
- Also, Google divides its system design into different sections: Web Development, Distributed Systems, Machine learning, Mobile Development, Database Design
- Top down + modularization principle

# Staff-Level


Can you take a vague goal ("design Twitter") and come up with a fully-developed proposal? Are you able to spot ambiguities in the requirements and ask good clarifying questions? Are you able to distinguish between features that really need to go into the MVP versus ones that are really extended/optional features that can be punted?

Do you proactively look for issues with your design, or do you need prodding from the interviewer?

Are you able to assess different options and make trade-offs, or are you attached to certain ways of doing things?

Do you have a good sense of what to prioritize, or do you get lost in the weeds?

Are you able to produce an actual deliverable within the time frame you are given? Does your design meet all functional and non-functional requirements? In particular, does it scale? While you are not expected to produce an industry-grade design in 45 minutes ー this would be quite unreasonable to ask ー what you produce should be something that can be turned over to a product team for implementation.

Are you able to achieve the basic requirements quickly so that you have time to extend your design in an interesting way?

Are you able to use speech, notes, and diagrams to communicate your ideas clearly to someone else? Are you able to take feedback?

# Applications

## Clarifying questions


One of the most useful strategies I personally employ is to ask clarification questions. What are "good" clarification questions, you ask?

A good clarification question helps you achieve one, or more, of several things:

1. Helps you narrow the scope of what you're supposed to do
2. Helps clarify what the user expectation of the system is
3. Gives you direction about where to proceed
4. Informs you of possible bottlenecks/problem areas

In the black box example, you might ask, "well, what does the box hold? How many items does it hold? And who is the intended user?"

## Handle Murphy's law


This is something that most people skip but this is one of the most important things that you must cover which talks about how resilient your system is. In the real world, things break, and when they do, you need to make sure you are in full control of your system.

Talk about how you monitor the system. What kind of alerting mechanism do you have in place? What are your KPIs (Key Performance Indicators) and how do you track them? What happens when things break, when your service crashes, your DB's master node goes down or even when one of your datacentres goes down?

Again, if you haven't done this before, see how I have been doing it, towards the later half of this video.

Now that you have your high-level design, start thinking about what bottlenecks it has. Perhaps your system needs a load balancer and many machines behind it to handle the user requests. Or maybe the data is so huge that you need to distribute your database on multiple machines. What are some of the downsides that occur from doing that? Is the database too slow and does it need some in-memory caching?

These are just examples of questions that you may have to answer in order to make your solution complete. It may be the case that the interviewer wants to direct the discussion in one particular direction. Then, maybe you won't need to address all the bottlenecks but rather talk in more depth about one particular area. In any case, you need to be able to identify the weak spots in a system and be able to resolve them.

## Scale the design


Identify and address bottlenecks, given the constraints. For example, do you need the following to address scalability issues?

- Load balancer
- Horizontal scaling
- Caching
- Database sharding

Discuss potential solutions and trade-offs. Everything is a trade-off. Address bottlenecks using principles of scalable system design.

Estimation. Estimation, especially in the form of a back-of-the-envelope calculation, is important because it helps you narrow down the list of possible solutions to only the ones that are feasible. Then you have only a few prototypes or micro-benchmarks to write.

? Evaluation

## Back-of-the-envelope capacity estimation


[Envelope_estimations]({{< ref "engineering/topics/envelope-estimations" >}})

# Follow-Up Questions


- How to scale your system to 10^7 users
- Design the system to apply some arhictetural characteristic:
- Going distributed
- Production: monitoring, alerting, logging, deploying, tracing

# to sort


This is my understanding of what interviewers are by-and-large looking for in a candidate for a Staff Software Engineer (or higher) position, at least as it pertains to the systems design interview.

Can you take a vague goal ("design Twitter") and come up with a _fully-developed proposal_? Are you able to spot ambiguities in the requirements and ask good clarifying questions? Are you able to distinguish between features that really need to go into the MVP versus ones that are really extended/optional features that can be punted?

Do you proactively look for issues with your design, or do you need prodding from the interviewer?

Are you able to assess different options and make trade-offs, or are you attached to certain ways of doing things?

Do you have a good sense of what to prioritize, or do you get lost in the weeds?

Are you able to produce an actual deliverable within the timeframe you are given? Does your design meet all functional and non-functional requirements? In particular, does it scale? While you are not expected to produce an industry-grade design in 45 minutes ー this would be quite unreasonable to ask ー what you produce should be something that can be turned over to a product team for implementation.

Are you able to achieve the basic requirements quickly so that you have time to extend your design in an interesting way?

Are you able to use speech, notes, and diagrams to communicate your ideas clearly to someone else? Are you able to take feedback?

# Examples

## Example 1


First. Single server setup. To start with something simple, everything is running on a single server. Figure 1-1 shows the illustration of a single server setup where everything is running on one server: web-app, database, cache, etc.

To understand this setup, it is helpful to investigate the request flow and traffic source.

For this, we need to move state (for instance user session data) out of the web tier. A good practice is to store session data in the persistent storage such as relational database or NoSQL. Each web server in the cluster can access state data from databases. This is called stateless web tier. Several technical challenges must be resolved to achieve multi-data center setup:

- Join and de-normalization: Once a database has been sharded across multiple servers, it is hard to perform join operations across database shards. A common workaround is to denormalize the database so that queries can be performed in a single table.

## example. IgotAnOffer interview with exMeta senior


topic: "Design Google Search". link: <https://www.youtube.com/watch?v=CsXrdpjCVFA>

interesting: interviewee start HLD with introducing an tier-based system. These tiers include: Web Tier, App Tier, Cache Tier, Data Tier, Batch compute platform (crawler), and Access Tier. Components include:

- premature optimization (adding cache, horizontal duplication, introducing queries)
- add some unused elements and services
- not usual names for system components (for example, dev panel)

to read, view ?

<https://interviewing.io/blog/never-written-code-but-passed-google-system-design>

# Model

### External Systems & Third-Party Dependencies


Role: Any external services your system interacts with.

🔹 Common Dependencies:

- Payment Providers (Stripe, PayPal) - Handling transactions.
- Authentication Services (OAuth, SSO, JWT) - User security.
- Cloud Infrastructure (AWS, GCP, Azure) - Storage, compute, networking.
- Third-Party APIs (Google Maps, Twilio, OpenAI API) - Enhancing functionality.

🔹 Considerations:

- Reliability & SLAs - Can you handle downtime of third-party services?
- Latency & Performance - Are there rate limits or high response times?
- Security & Compliance - Are APIs handling sensitive data?

# Second Level (iteration) Structures

## First-Principles Thinking (Break It Down) (?)


Why It Works:

- Prevents over-engineering and unnecessary complexity.
- Ensures decisions are based on need, not trend-following.

## The MVP (Minimum Viable Product) Model


🔹 What It Is:

Start with the simplest functional solution and iterate based on constraints and scale.

How to Apply It:

1. Design a basic working system first (e.g., a monolith instead of microservices).
2. Add complexity only when justified (e.g., introduce sharding when a single database becomes a bottleneck).
3. Iterate based on trade-offs and scalability needs.

Why It Works:

✔ Keeps the discussion structured and iterative.

✔ Prevents over-engineering too early.

^^ also maybe we can say like: ok, we have several scenatios for the future. One most probable of them is night-spikes of users. So one of the qualities of one subsystem is to hold this kind of load. We can address it now, but I'll propose that it will be in our list of bottleneck (more common name) analysis and system improvement.

## The Bottleneck-First Model


🔹 What It Is:

Identify and eliminate bottlenecks first, instead of prematurely optimizing.

🔹 How to Apply It:

1. Ask where the biggest bottleneck is. <- Maybe here we can find out most critical bottleneck for users? Future x critical bottlenecks? How we can change the design in the future to prevent this bottlenecks? Proactive

CPU-bound? (Compute-heavy tasks need parallelization)

I/O-bound? (Disk reads/writes need caching or distributed databases)

Network-bound? (Latency needs CDNs and efficient protocols)

2. Prioritize optimizations that give the biggest gain.

🔹 Example:

Q: "How would you handle millions of search queries per second in an e-commerce app?"

A (Bottleneck-First Approach):

Bottleneck 1: Full-text search in databases -> Introduce Elasticsearch or Solr.

Bottleneck 2: High read traffic -> Use Redis for caching popular searches.

Bottleneck 3: High latency due to database queries -> Precompute trending results to reduce load.

🔹 Why It Works:

✔ Focuses on real bottlenecks instead of premature optimization.

✔ Makes the solution more efficient incrementally.

### Bottleneck-Driven Optimization (Performance-First Approach)


🔹 Goal: Identify and optimize bottlenecks first instead of prematurely optimizing non-critical components.

🔹 Interview Strategy:

1. Start with a baseline design (simple monolith, single DB).
2. Identify the first bottleneck (ask interviewer for expected load, latency SLAs).
3. Propose targeted optimizations (caching, sharding, replication).

🔹 How to Use in an Interview:

💬 "Before scaling the system, let's identify where the biggest performance bottleneck is. Are we more concerned with read-heavy or write-heavy workloads?"

🔹 Common Bottlenecks & Fixes:

| Bottleneck | Optimization |
| --- | --- |
| Slow Database Queries | Indexing, query optimization, read replicas |
| High Read Traffic | Caching (Redis, Memcached, CDN) |
| API Overload | Rate limiting, API Gateway |
| Latency Issues | Load balancing, multi-region deployment |
| Write-heavy Workloads | Sharding, partitioning |

#todo apply reflection practices and improvement to sd interview, sd framework

# Core Principles of Optimizing Systems Under Design


In a system design interview, optimization is not just about improving performance -- it's about making informed trade-offs, balancing scalability, cost, reliability, and maintainability, while demonstrating a structured thought process.

🔹 1. Keep it Simple, then Optimize - Start with a functional design, optimize as scale grows.

🔹 2. Measure Before Optimizing - Profile performance first using real metrics.

🔹 3. Balance Trade-offs - No system is 100% scalable, consistent, and cost-effective at the same time.

🔹 4. Optimize the Right Bottlenecks - Don't waste effort on optimizations with little impact.

🔹 5. Design for Failure - Build resilient systems that degrade gracefully.

🔹 6. Think in Layers - Optimize frontend, backend, database, and network layers systematically.

🔹 7. Automate Scaling - Use auto-scaling and self-healing mechanisms.

# Trade-Off Analysis Tools

## Trade-Off Triangle


The Trade-Off Triangle (CAP Theorem + Scalability vs. Consistency vs. Cost)

🔹 What It Is:

Every system design decision trades off between three key constraints:

Scalability (Can the system handle increased load?)

Consistency (Does every user see the latest data immediately?)

Cost & Complexity (How expensive is it to maintain?)

🔹 How to Apply It:

Scaling reads? Use caching or read replicas.

Scaling writes? Consider partitioning or sharding.

Need strong consistency? Accept limited availability in network failures (CP system in CAP theorem).

🔹 Example:

Q: "How would you design a global social media feed?"

A (Applying Trade-offs):

1. If low latency is key -> Choose eventual consistency (AP system, with caching).
2. If real-time accuracy is key -> Choose strong consistency (CP system, but sacrifice speed).
3. Hybrid Approach: Prioritize eventual consistency for most users, but strong consistency for VIP users or trending posts.

🔹 Why It Works:

✔ Shows awareness of real-world constraints.

✔ Justifies design choices with clear reasoning.

#todo balance proactivity and premature optimization

### 50 Most Impactful Cognitive Biases in System Design Interviews


Cognitive biases can lead candidates to poor system design decisions, suboptimal trade-offs, and ineffective communication during interviews. Here's a structured list of 50 cognitive biases that affect candidates and their decision-making process in system design interviews.

# Most Influential Errors in System Design Interviews


System design interviews assess architecture skills, trade-off analysis, scalability, and real-world problem-solving. Candidates often make critical errors that reduce their effectiveness. Below is a structured review of the most influential system design mistakes and how to avoid them.

## 1. Errors in Understanding Requirements

### 1.1. Skipping Requirement Clarification


- Jumping straight into designing without asking clarifying questions.
- Assuming requirements instead of explicitly defining scale, constraints, and business goals.
- Not verifying expected read vs. write ratios, consistency vs. availability trade-offs, or peak load handling.

✅ How to Avoid:

- Ask who the users are, traffic expectations, and what problem we are solving before starting.
- Clarify functional (user-facing) and non-functional (performance, security) requirements.

💬 _"Before we design, let's define the scale: How many daily active users and peak requests per second?"_

### 1.2. Ignoring Business Context


- Designing purely from a technical perspective, ignoring cost constraints or business goals.
- Over-optimizing for performance when cost efficiency is more important.

✅ How to Avoid:

- Ask: _"What are the business priorities? Are we optimizing for speed, cost, or maintainability?"_
- Justify design choices based on business impact, not just technical feasibility.

💬 _"If cost is a concern, we could use a single-region setup with caching instead of a multi-region deployment."_

## 2. Errors in Architectural Thinking

### 2.1. Over-Engineering the Solution


- Designing for extreme scale when unnecessary.
- Using Kafka, Kubernetes, and microservices for a small-scale application.
- Adding too much redundancy and complexity when a simpler approach would suffice.

✅ How to Avoid:

- Start with a Minimal Viable Product (MVP) and optimize later.
- Prioritize simplicity, modularity, and maintainability.
- Ask: _"What's the simplest solution that meets current needs and scales later?"_

💬 _"For now, a single SQL database works. If traffic increases, we can introduce sharding."_

### 2.2. Under-Engineering the Solution


- Ignoring scalability when the problem clearly requires it.
- Assuming a single database will handle all future growth.
- Not accounting for traffic spikes, failover, and data partitioning.

✅ How to Avoid:

- Balance simplicity with future-proofing by considering scale-up vs. scale-out strategies.
- Introduce sharding, replication, or caching only if justified.

💬 _"If our user base grows beyond 100M, we can introduce sharding to distribute load."_

### 2.3. Over-Focusing on One Layer


- Spending the entire interview on database design, neglecting network, caching, and failure handling.
- Not addressing load balancing, API gateways, or data flow between components.

✅ How to Avoid:

- Use a structured approach: frontend -> backend -> database -> scaling -> failures.
- Cover end-to-end architecture instead of hyper-focusing on one part.

💬 _"We've covered storage, now let's discuss API rate limiting and load balancing."_

### 2.4. Not Handling Failures & Edge Cases


- Assuming everything will work perfectly and neglecting failure scenarios.
- No discussion on retry mechanisms, circuit breakers, or database failover.

✅ How to Avoid:

- Ask: _"What happens if the primary database crashes?"_
- Implement failover strategies, retries, and rate limiting.

💬 _"If the primary DB goes down, the system will promote a read replica as the new primary."_

## 3. Errors in Trade-Off Analysis

### 3.1. Making Technology Choices Without Justification


- Picking a specific database, queue system, or framework without explaining why.
- Always choosing PostgreSQL, Redis, or Kafka without discussing trade-offs.

✅ How to Avoid:

- Compare at least two alternatives for every major decision.
- Discuss pros, cons, and when each solution is best suited.

💬 _"We could use Redis for caching, but Memcached would be simpler if we only need key-value lookups."_

### 3.2. Ignoring Cost vs. Performance Trade-Offs


- Designing for low latency at the expense of massive infrastructure costs.
- Using multi-region replication when a single-region setup would suffice.

✅ How to Avoid:

- Balance cost, performance, and maintainability.
- Ask: _"What are the cost constraints? Do we need this level of redundancy now?"_

💬 _"A global CDN would reduce latency, but it's costly. Should we start with regional caching?"_

### 3.3. Poor Data Storage Choices


- Using SQL when NoSQL is a better fit (or vice versa).
- Not considering indexing, partitioning, or data modeling.

✅ How to Avoid:

- Choose storage based on data relationships, query patterns, and consistency needs.
- Discuss data volume, read vs. write patterns, and future growth.

💬 _"Since our queries require flexible schema, NoSQL (MongoDB) fits better than a relational DB."_

## 4. Errors in Communication & Collaboration

### 4.1. Not Thinking Out Loud


- Designing the system silently without explaining thought processes.
- Making big design jumps without discussing intermediate steps.

✅ How to Avoid:

- Narrate each design decision as you go.
- Regularly check in with the interviewer.

💬 _"I'll start with a monolith since it's easier to manage, then discuss how we scale."_

### 4.2. Ignoring Interviewer Hints


- Missing subtle cues that your solution is not aligned with the problem.
- Ignoring the interviewer's questions or redirections.

✅ How to Avoid:

- Treat the interview as a collaborative discussion.
- If the interviewer asks a question, pause and reassess your approach.

💬 _"I see your concern. Let's consider an alternative design that better addresses fault tolerance."_

### 4.3. Poor Time Management


- Spending too long on one part (e.g., database schema) and running out of time.
- Leaving no time for optimization, trade-offs, or failure scenarios.

✅ How to Avoid:

- Follow a structured time allocation:
	- 5 mins: Requirements gathering
	- 10-15 mins: High-level architecture
	- 10 mins: Scaling, trade-offs, failure handling
	- 5 mins: Recap and optimizations

💬 _"We've covered scaling; let's now discuss failover mechanisms."_

## 🔹 Summary: Most Influential Errors & Fixes


| Error Type | Common Mistake | How to Avoid It |
| ------------------------------ | ------------------------------------ | ------------------------------------- |
| Understanding Requirements | Skipping clarifying questions | Define scale, users, traffic early |
| Over-Engineering | Too complex for small systems | Start simple, scale when needed |
| Under-Engineering | Ignoring scalability needs | Plan for future growth logically |
| Ignoring Trade-Offs | Choosing tools without justification | Compare at least two options |
| Failing to Handle Failures | No redundancy or failover plans | Add retries, backups, monitoring |
| Poor Time Management | Spending too much time on one area | Allocate time for each system part |
| Bad Communication | Not thinking out loud | Narrate decisions, engage interviewer |

# 1. Design & Architecture Biases


1. Over-Engineering Bias - Designing for extreme scale before confirming actual requirements.
2. Feature Creep Bias - Adding unnecessary complexity by focusing on rare edge cases too early.
3. Familiarity Bias - Favoring technologies or architectures you already know instead of evaluating alternatives.
4. Not-Invented-Here Bias - Preferring to build custom solutions instead of using existing tools or frameworks.
5. Shiny Object Syndrome - Choosing new or trendy technologies over proven, stable solutions.
6. Monolith vs. Microservices Bias - Defaulting to microservices without considering the benefits of monolithic architectures.
7. Cloud-Native Assumption - Assuming every system must be cloud-based, ignoring on-premise or hybrid solutions.
8. Scaling Prematurely Bias - Optimizing for millions of users when the system does not need it.
9. Reinventing the Wheel Bias - Designing new algorithms or protocols when reliable ones already exist.
10. The "Best Tool" Bias - Believing that a single database, programming language, or framework is the best for all situations.

## 2. Decision-Making & Trade-Off Biases


1. Confirmation Bias - Seeking only evidence that supports your initial design choices while ignoring contradictions.
2. Recency Bias - Overweighting the latest trends or experiences instead of considering older, well-established solutions.
3. Sunk Cost Fallacy - Sticking with a bad design choice because you've already invested time in it.
4. Status Quo Bias - Resisting changes to an existing design, even when improvements are evident.
5. Optimism Bias - Underestimating system failures and assuming everything will work as expected.
6. Pessimism Bias - Assuming worst-case scenarios for every decision, leading to overcomplicated designs.
7. Risk Aversion Bias - Avoiding any risk in design, even when a higher-risk approach would provide better performance.
8. Authority Bias - Blindly following the interviewer's suggestions without critically evaluating them.
9. Groupthink Bias - Defaulting to conventional or widely accepted architectures without questioning their applicability.
10. Default Bias - Accepting the first reasonable solution without exploring alternatives.

## 3. Scalability & Performance Biases


1. Big Data Bias - Assuming that all systems require distributed storage and advanced data partitioning.
2. Strong Consistency Bias - Over-prioritizing data consistency at the expense of availability and scalability.
3. Eventual Consistency Bias - Assuming that every large-scale system should prioritize availability over consistency.
4. Zero-Downtime Bias - Designing for zero downtime even when some downtime would be acceptable.
5. Latency Insensitivity Bias - Ignoring real-world latency issues in distributed systems.
6. Throughput Overhead Bias - Assuming higher throughput is always better without considering cost.
7. Redundancy Overkill Bias - Adding too much replication or backups, leading to unnecessary resource consumption.
8. Caching Dependency Bias - Relying too heavily on caching without considering cache invalidation complexities.
9. Over-Sharding Bias - Assuming sharding is necessary even for small-scale applications.
10. Premature Optimization Bias - Optimizing performance before identifying real bottlenecks.

## 4. Security & Reliability Biases


1. Perceived Security Bias - Assuming a system is secure just because best practices were followed.
2. Compliance Overhead Bias - Overcomplicating security measures when simple protections would suffice.
3. Single Point of Failure Neglect - Forgetting to address failure points in system design.
4. Overconfidence in Failover Mechanisms - Assuming that redundancy alone guarantees high availability.
5. Observability Blindness - Ignoring the need for logging, monitoring, and real-time alerts.
6. False Sense of API Security - Assuming that API authentication alone prevents abuse.
7. Ignoring User Privacy Bias - Not considering data privacy regulations like GDPR and HIPAA.
8. Firewall and Perimeter Bias - Relying solely on network security measures instead of a zero-trust approach.
9. Ignoring Insider Threat Bias - Assuming security risks come only from external threats.
10. Trusting Third-Party Services Blindly - Failing to account for the risks of API rate limits, outages, or security vulnerabilities in third-party integrations.

## 5. Communication & Collaboration Biases


1. Jargon Overuse Bias - Using overly technical language without confirming if the interviewer understands it.
2. Excessive Detail Bias - Spending too much time on low-level implementation details instead of high-level architecture.
3. Lack of Clarification Bias - Assuming system requirements without asking enough questions.
4. Rigid Thinking Bias - Refusing to adapt your design after receiving feedback.
5. Presentation Bias - Prioritizing how an idea sounds rather than how well it works.
6. Overconfidence Bias - Overstating your expertise or making definitive statements without verifying facts.
7. Underconfidence Bias - Hesitating to make firm design decisions out of fear of being wrong.
8. Linear Thinking Bias - Failing to think in terms of parallelism, concurrency, or event-driven architectures.
9. Ignoring Business Requirements Bias - Focusing purely on technical design while neglecting business needs.
10. Time Mismanagement Bias - Spending too much time on one part of the system and running out of time for critical sections.
- A strong candidate actively challenges their biases and remains flexible in their approach.

# **Naming an Approach That Accounts for Users and Their Needs**


When designing a system while **considering users and their needs**, different approaches can be used, depending on the context. Here are some common naming conventions that reflect this mindset:

### **1️⃣ User-Centered Design (UCD)**


**Definition:**

- Focuses on **users' behaviors, needs, and goals** when designing a system.
- Ensures the system provides a good **user experience (UX)** while meeting functional requirements.

**Best For:**

✔ Frontend-heavy applications (e.g., e-commerce, social media).

✔ APIs or platforms that prioritize **developer experience (DX)**.

### **2️⃣ Human-Centered System Design**


**Definition:**

- A broader approach that focuses on **how people interact with technology** and ensures the system adapts to human needs rather than forcing users to adapt.

**Best For:**

✔ Accessibility-focused applications.

✔ AI/ML systems that involve human decision-making (e.g., recommendation systems).

### **3️⃣ Requirement-Driven Design**


**Definition:**

- Focuses on gathering and analyzing **explicit and implicit user requirements** before defining the architecture.

**Best For:**

✔ Enterprise applications with complex workflows.

✔ Business-to-business (B2B) software.

### **4️⃣ Context-Aware System Design**


**Definition:**

- Takes into account **the environment, usage patterns, and external constraints** affecting users.
- Examples include **geo-aware services (Google Maps), IoT systems, or AI-driven applications**.

**Best For:**

✔ Location-based applications.

✔ Systems that adapt to user context dynamically.

### **5️⃣ Jobs-To-Be-Done (JTBD) Approach**


**Definition:**

- Focuses on **what the user wants to accomplish**, rather than just the features they need.
- Emphasizes **user goals** over system capabilities.

**Best For:**

✔ Consumer-facing applications where users have **clear end goals**.

✔ Product development frameworks that **prioritize outcomes over features**.

### **6️⃣ Demand-Driven Architecture**


**Definition:**

- Designs the system around **actual demand from users**, ensuring that scalability, availability, and performance align with real-world usage.

**Best For:**

✔ Large-scale systems that need to handle **variable traffic patterns** (e.g., cloud services, e-commerce).

✔ SaaS platforms that evolve based on user demand.

### **7️⃣ Customer-First Engineering**


**Definition:**

- A software engineering philosophy that prioritizes **customer impact, feedback loops, and iterative improvements**.

**Best For:**

✔ Startups that iterate quickly based on customer feedback.

✔ Companies using **Agile methodologies** and **A/B testing** to refine systems.

## **Final Thoughts: Choosing the Right Naming Approach**


The best term depends on your **system design goals**:

- **If prioritizing UX & usability:** -> _User-Centered Design (UCD), Human-Centered System Design_
- **If focusing on business impact:** -> _Jobs-To-Be-Done (JTBD), Requirement-Driven Design_
- **If scaling based on usage patterns:** -> _Demand-Driven Architecture, Context-Aware System Design_
- **If iterating based on customer feedback:** -> _Customer-First Engineering_

Each of these approaches ensures the system is built **with real user needs in mind**, balancing **functionality, performance, and user experience.**
