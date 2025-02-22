---
contributors: []
date: '2025-02-22T09:02:28.392283'
description: Default Description
draft: false
lastmod: '2025-02-22T09:02:28.392283'
summary: ''
title: Trade Off Db
toc: true
weight: 810
---

# relational-vs-nosql

Don't oversell a solution. Every solution has positive and negative aspects and needs to be approached with a sense of realism. If you're being unrealistic, you probably won't change your mind (even when it benefits you to change your mind!). For example, sometimes the interviewer will give you an out by asking some follow-up questions, giving you a chance to see your own mistake and change your mind. But if you're too fixated on being right, you'll miss the opportunity.

Therefore, we're giving you two very powerful tools: (1) A rule of thumb to pick Relational (SQL) vs. Non-Relational (NoSQL), and (2) A list of trade-offs that you should mention to your interviewer after stating your decision.

At the risk of oversimplifying the decision, we can assert with confidence that if you don't fall into any of the above cases, you are probably fine picking either SQL or NoSQL. However, many interesting system design questions require strong consistency, unstructured data, or both. Actually, using both is also somewhat common, and something we'll touch on.

{{< callout context="tip" title="(Tell your interviewer)" icon="outline/rocket" >}}
**If you picked relational:**
"Although I think a relational database better fits this requirement, we should also be mindful of the downsides. For example, our database will have a more rigid structure and schema, so it might be harder for us to incorporate changes. We'll also need to scale up vertically, meaning that as we get more load we'll upscale existing servers rather than dividing the work over more servers."

**If you picked non-relational:**
"Although I think a non-relational database better fits this requirement, we should also be mindful of the downsides. We'll be able to scale horizontally at the cost of not having ACID guarantees. I'm assuming there will be no need for strong consistency in the future."
{{< /callout >}}

So which one is a better fit for our Twitter example? Let's run our requirements through these questions:

**Do we need strong consistency?** We probably don't. It's fine if after publishing a tweet, some users can see it before others. Same for likes and followers. We don't need to treat these as atomic, consistent operations. Eventual consistency works fine for our requirements.

**Do we have large volumes of unstructured data?** Not necessarily. Our entities, tweets and accounts, will have some well-defined static fields that are unlikely to change in meaningful ways.

Given the answer to these two questions is "no," this is yet another example where we are good with either choice. It comes down to how we justify it. In fact, Twitter started using MySQL and then moved to NoSQL seeking better scalability and availability.

If you ask us, we'd probably go for NoSQL and justify it as: (1) It doesn't look like we need strong consistency, and (2) NoSQL will scale horizontally and likely have better availability.

#### Examples

##### 1. Design a banking system

This is a textbook example of strong consistency. Transactions in a banking system need ACID guarantees. As such, we are probably better off picking a relational database that can give us this strong consistency.

##### 2. Design a system to help doctors diagnose potential illnesses given symptoms

Let's say this is mainly a querying system. Doctors enter a list of symptoms and get back potential illnesses and treatments. The data we will be storing is unstructured in nature, and it will likely be an ever increasing database as we add more illnesses, symptoms, and diagnoses. In this example, it might be wise to pick a non-relational database where we can store large volumes of unstructured data, scale horizontally, and be fine with just eventual consistency.

##### 3. Design Amazon

Amazon is a good example of a system where we might want to use both of these. We'd want to have consistency for product transactions, while being flexible about the data in our product catalog. It wouldn't be crazy to suggest using a relational database to keep track of purchases and stock, while using a non-relational database for the product catalog.
