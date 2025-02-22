---
contributors: []
date: '2025-02-22T09:02:28.392283'
description: Default Description
draft: false
lastmod: '2025-02-22T09:02:28.392283'
summary: ''
title: Sd Algo Interviewing.Io
toc: true
weight: 810
---

# Framework IO

Framework for SD interviews from interviewing.io consists of three steps:

Requirements ->

- List of functional requirements and architectural characteristics

Data Types, API and Scale ->

- List of Data Types we need to store.
- Access patterns for these data types.  
- Scale of the data and requests the system needs to serve.

Design ->

- Data Storage
- Microservices

points:
consider mutability
ranking

# step 1. requirements

## functional

{{< callout context="note" title="Remember" icon="outline/info-circle" >}}

1. Identify the main objects and their relations.
2. What information do these objects hold? Are they mutable?
3. Think about access patterns. "Given object X, return all related objects Y." Consider the cross product of all related objects.
4. List all the requirements you've identified and validate with your interviewer.
{{< /callout >}}

### main objects & relations

### information & mutability

### access patterns

Think about the possible access patterns for these objects

Access patterns are probably the single most influential part of design because they determine how data will be stored.

Let's think about the cross product of our objects again. This time we want to identify how data will be retrieved from the system.

The general shape of an access pattern requirement is:
    Given [object A], get all related [object B]

We're not suggesting you blindly implement all of these, but rather that *you consider them as possible access patterns* for your clarification questions. For example, should we be able to get all accounts that liked a tweet? Or would the number be enough?

> For these access patterns, you should also consider ranking.

Are there any access patterns that require ranking the object? In this example, "creating a curated feed of tweets" will require further clarification. Strive for simplicity first. Can you return them sorted by chronological time? Identify these access patterns of interest, like the curated feed, and get a feel for what your interviewer is looking for: do they want you to suggest an algorithm for a feed?

## characteristics

[Consistency]({{< ref "system-design/nfr/consistency" >}}): performance, availability, consistency, security, ?scalability

NFRs will strongly influence our design. They define what we should be optimizing for. Bear in mind that you cannot optimize for everything, and you should not overcomplicate your solution. This is a game of trade-offs.

{{< callout context="tip" title="Rule of thumb" icon="outline/rocket" >}}
There is an opportunity to relax one or several specific requirements
{{< /callout >}}

Good candidates can view non-functional requirements mainly as opportunities to relax one specific requirement, such as "We don't need to focus on [Insert requirement, such as "consistency"] as much in this case because [Insert reason, such as "it's okay in this scenario of TikTok if some users get access to certain videos later than the rest of our users"]."

### performance

### availability

### consistency

> Remember: Non-Functional Requirements

Consider the three main non-functional requirements: performance, availability, and security.
    Performance: Which access patterns, if any, require good performance?
    Availability: What's the cost of downtime for this system?
    Security: Is there any workflow that requires special security considerations (e.g., code execution)?

# step 2. Data Types, API and Scale

We've gathered functional and non-functional requirements. At this point we understand what the system is supposed to do as *a black box*. It's now time to take our first steps toward designing it.

However, you should not begin drawing boxes and discussing implementation right away. There's a bit of *pre-work* needed before we can start thinking about a concrete design. We need to answer the following three questions:

1. What data types does the system need to store?
2. What does the API look like?
3. What volume of requests do we need to support?

These can be answered pretty quickly from your requirements. In fact, you can probably answer these in just a few minutes. Let's walk through how we might answer each of these questions for our Twitter example:

## 2.1 data types

What data types does the system need to store?

Think about the objects the system needs to hold and their data type. There are largely two types of data we might need to store:

- **Structured data.** Think business objects, like accounts, tweets, likes.
- **Media and blobs.** Think images, videos, or any type of large binary data such as TAR or ZIP files.

## 2.2 api

2.2 What does the API look like?

{{< callout context="note" title="Rule of thumb" icon="outline/info-circle" >}}

{{< /callout >}}
More than 90% of the time, users will interact with the system through HTTPS, and as such we encourage you to think about the API in terms of HTTPS requests.

## 2.3 scale

What volume of requests do we need to support?

Finally, we should consider the volume of requests that the service needs to serve, as that will influence our design.

As a starting point, I recommend that you ask yourself whether this system is read-heavy or write-heavy. Go back to your API and figure out which endpoints are likely to be called more frequently. Do you think our Twitter API would be read-heavy or write-heavy? You guessed it: it's probably read-heavy. Users will be calling `getFeed` and `getTweets` far more often than they would call `putTweet` or `retweet`.

Normally, it's enough to think about how people will be using the system and apply some common sense to figure out which endpoints get called the most. In case this is not immediately obvious to you (perhaps you are not familiar with these kinds of systems), it's totally fine to just ask your interviewer. For example: "What's the behavior of a typical user using this app?" Or be even more direct: "What does the distribution of requests look like?"

## 2.4 back-of-the-envelope math

# step 3. design

The time has come. We've got all the information we need to start drawing boxes and calling this a "system." Yay!

There are several reasons that we spent considerable time in steps 1 and 2. Too often people dive straight into design and fail in spectacular ways. It's easy to make that mistake—isn't this interview called "system design" after all? No one told these candidates that good design is 70%+ requirements and planning.

In fact, we can go as far as saying that if you've executed the last two steps correctly, design should be pretty systematic. This is because system design questions are usually open ended and don't have one single correct answer. Let's use this to our advantage! 💪

> We know the **what** (steps 1 and 2), so now we focus on the **where** and the **how**. We will start with designing the data storage layer first and then think about the microservices that access this data.

## 3.1 data storage

### blob storage

Let's get some of the more obvious components out of the way first. Did you identify any type of media or blobs in step 2.1? If so, these are great candidates to store in blob storage. A blob (Binary Large Object) is basically just binary data. We store and retrieve these as a single item. For example, ZIP files or other binaries.

Some popular blob stores are Amazon S3 and Azure Blob storage. In general, you don't need to worry too much about the specific brand you'd be using. Just tell your interviewer that these images/blobs you identified are good candidates to store in some blob storage, and then draw a "blob" box.

>[!Rule of thumb]
Say the generic name of the component, not the brand name. Unless you are very familiar with a specific brand (like S3), don't say the specific brand. Instead, say "some kind of blob storage." Because if you say, "we should use S3 here," the next question out of your interviewer's mouth will be, "why not Azure blob instead of S3?"

There's a chance you might want to couple the blob storage with a CDN, but that's something we'll look into in step 3.2. This step is all about identifying how to store content, not how to distribute it.

### database

There are a few considerations for this step:

1. Relational vs. Non-Relational
2. Entities to store

# todo learn guide from interviewing.io

main source:
<https://interviewing.io/guides/system-design-interview/part-three>
