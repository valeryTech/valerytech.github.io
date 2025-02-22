---
contributors: []
date: '2025-02-22T08:51:50.971720'
description: Default Description
draft: false
lastmod: '2025-02-22T08:51:50.971720'
summary: ''
title: Caching
toc: true
weight: 810
---

# ontology

Cache definitions:

1. Caching is a commonly used *performance optimization* (<= really important that it is an optimization) whereby the previous result of some operation is stored so that subsequent requests can use this stored value rather than spending time and resources recalculating the value.

2. In computing, a cache is a component that stores data so that future requests for that data can be served faster; the data stored in a cache might be the result of an earlier computation or a copy of data stored elsewhere.

3. Structurally, cache can be viewed as a high-speed storage layer that sits between the application and the original source of the data, such as a database, a file system, or a remote web service.

*As locigal layer:* in computing, a cache is a high-speed data storage layer which stores a subset of data, typically transient in nature, so that future requests for that data are served up faster than is possible by accessing the data's primary storage location.

# common


In computing, a cache is a component that stores data so that future requests for that data can be served faster; the data stored in a cache might be the result of an earlier computation or a copy of data stored elsewhere.

  

Cache can be viewed as a high-speed storage layer that sits between the application and the original source of the data, such as a database, a file system, or a remote web service.


Caches can store the results of simple lookups, as in this example, but really they *can store any piece of data*, such as the result of a complex calculation. We can cache to help improve the performance of our system as part of helping reduce latency, to scale our application, and in some cases even to improve the robustness of our system. 

{{< callout tip "Treat caching primarily as a performance optimization. Cache in as few places as possible to make it easier to reason about the freshness of data." >}}

{{< /callout >}}

{{< callout tip "Generally, caching is used only in cases where the external *data doesn't change often* or you can replicate all the data on your systems. Also if you don't care about data consistency then cache is really useful. " >}}

{{< /callout >}}


>[!Rule of thumb]
> Generally, caching is used for *read-heavy systems*. Popular read-heavy systems are Twitter and YouTube. Are most of their millions of users tweeting and posting videos? No, their most common users are reading tweets and watching videos.

another rule

The 80/20 rule: You want to store 80% of read requests in 20% of storage (or memory). Generally, these are the most popular requests.

For example, if there is a tweet from a very popular person on twitter you would cache it everywhere (on a device, on a CDN, on the application) so that whenever that tweet is finished you can fetch it very quickly and serve it up to your users.

A CDN (content delivery network) is something that's commonly used to deliver cached data.

***

To maintain coherence of the external data, you should apply a periodic refresh strategy to the cache so it doesn't become outdated.

Updating cache: cache-aside, write-through, write-behind, refresh-ahead. 

# purposes

A cache can reduce load on system which data it holds. A primary reason to set up caching outside of your database is to reduce load within your database engine. 

Cases: when you want to speed up a system
=> When you douing a lot of network requests
=> Very computationaly long computations
=> Don't want to send an identical request from multiple clients to DB (for example, star instargam profile)

**For Performance.** 

With microservices, we are often concerned about the adverse impact of network latency and about the cost of needing to interact with multiple microservices to get some data. Fetching data from a cache can help greatly here, as we avoid the need for network calls to be made, which also has the impact of reducing load on downstream microservices. Aside from avoiding network hops, it reduces the need to create the data on each request.

**For Scale.**

If you can divert reads to caches, you can *avoid contention on parts of your system* to allow it to better scale. An example of this that we've already covered in this chapter is the use of database read replicas. The read traffic is served by the read replicas, reducing the load on the primary database node and allowing reads to be scaled effectively. The reads on a replica are done against data that might be stale. The read replica will eventually get updated by the replication from primary to replica node—this form of cache invalidation is handled automatically by the database technology. 
More broadly, caching for scale is useful in any situation in which the origin is a point of contention. Putting caches between clients and the origin can reduce the load on the origin, better allowing it to scale.

**For Robustness.** 

If you have an entire set of data available to you in a local cache, you have the potential to operate even if the origin is unavailable—this in turn could improve the robustness of your system.

# parameters

side of a cache: client/server

# Where to Cache 

As we have covered multiple times, microservices give you options. And this is absolutely the case with caching. We have *lots of different places* where we could cache. The different cache locations I'll outline here have different trade-offs, and what sort of optimization you're trying to make will likely point you toward the cache location that makes the most sense for you.

**Client-side**. With client-side caching, the data is cached outside the scope of the origin. In our example, this could be done as simply as holding an in-memory hashtable.

In general, client-side caches tend to be pretty effective, as they avoid the network call to the downstream microservice. This makes them suitable not only for caching for improved latency but also for caching for robustness. 

It's important to note that our client cache could decide to cache *only some of the information* we get from the microservice.

Client-side caching has a few downsides, though. Firstly, you tend to be more restricted in your options around invalidation mechanisms. Secondly, when there's a lot of client-side caching going on, you can see a degree of inconsistency between clients. This means that you could see a different view of the cached data in each of those clients at the same time. The more clients you have, the more problematic this is likely to be. Techniques such as notification-based invalidation, which we'll look at shortly, can help reduce this problem, but they won't eliminate it. 

Another mitigation for this is to have a *shared client-side cache*, perhaps making use of a dedicated caching tool like Redis or memcached, as we see in Figure 13-11. Here, we avoid the problem of inconsistency between the different clients. This can also be more efficient in terms of resource use, as we are reducing the number of copies of this data we need to manage (caches often end up being in memory, and memory is often one of the biggest infrastructural constraints). The flip side is that our clients now need to make a round trip to the shared cache.

Another thing to consider here is who is responsible for this shared cache. Depending on who owns it and how it is implemented, a shared cache like this can blur the lines between client-side caching and server-side caching, which we explore next.

**Server-side.** A server itself maintains a cache on behalf of his consumers. Here, the Catalog microservice has full responsibility for managing the cache. Due to the nature of how these caches are typically implemented—such as an in-memory data structure, or a local dedicated caching node—it's easier to implement more sophisticated cache invalidation mechanisms. Write-through caches, for example (which we'll look at shortly), would be much simpler to implement in this situation. Having a server-side cache also makes it easier to avoid the issue with different consumers seeing different cached values that can occur with client-side caching.

The major issue with this form of caching is that it has reduced scope for optimizing for latency, as a round trip by consumers to the microservice is still needed. This also reduces the effectiveness of this form of caching for any form of robustness.

This might make this form of caching seem less useful, but there is huge value to transparently improving performance for all consumers of a microservice just by making a decision to implement caching internally. A microservice that is widely used across an organization may benefit hugely by implementing some form of internal caching, helping perhaps to improve response times for a number of consumers while also allowing the microservice to scale more effectively.

# Request cache

With a request cache, we store a cached answer for the original request. So in Figure 13-13 for example, we store the actual top ten entries. Subsequent requests for the top ten best sellers result in the cached result being returned. No lookups in the Sales data needed, no round trips to Catalog—this is far and away the most effective cache in terms of optimizing for speed.
The benefits here are obvious. This is super efficient, for one thing. However, we need to recognize that this form of caching is highly specific.

# cache invalidation

Data eviction rules (policies). We need to know when to delete stale data or redundant data. 
Policies: LRU, LFU, combined, etc.

Invalidation is the process by which we evict data from our cache. It's an idea that is simple in concept but complex in execution, if for no other reason than there are a wealth of options in terms of how to implement it, and numerous trade-offs to consider in terms of making use of data that might be out of date. Fundamentally, though, it comes down to deciding in which situations a piece of cached data should be removed from your cache.Sometimes this happens because we are told a new version of a piece of data is available; at other times it might require us to assume our cached copy is stale and fetch a new copy from the origin.

**TTL** 
This is one of the simplest mechanisms to use for cache invalidation. Each entry in the cache is assumed to be valid for only a certain duration in time. After that time has passed, the data is invalidated, and we fetch a new copy. But the simplicity of implementation needs to be balanced against how much tolerance you have around operating on out-of-date data.
Even if you're not using HTTP, the idea of the origin giving hints to the client as to how (and if) data should be cached is a *really powerful concept*. This means you don't have to guess about these things on the client side; you can actually make an informed choice about how to handle a piece of data.

**Notification-based** 
With notification-based invalidation, we use events to help subscribers know if their local cache entries need to be invalidated. To my mind, this is *the most elegant mechanism for invalidation*, though that is balanced by its relative complexity with respect to TTL-based invalidation.
The main benefit of this mechanism is that it reduces the potential window wherein the cache is serving stale data. The window in which a cache might now be serving stale data is limited to the time taken for the notification to be sent and processed.

Conditional GETS

LRU

For most systems 20% of the data accounts for 80% of the reads. So using LRU will result in fewer cache misses. Because of the 80/20 rule, we want to give special treatment to the most popular data! That’s why we use LRU. As a result, we can throw stuff in the cache (and not miss), which reduces latency for 80% of your requests.

# Writing to cache

**Write-through** 

With a write-through cache, the cache is updated at the same time as the state in the origin. "At the same time" is where write-through caches get tricky, of course. Implementing a write-through mechanism on a server-side cache is somewhat straightforward, as you could update a database and an in-memory cache within the same transaction without too much difficulty. If the cache is elsewhere, it's more difficult to reason about what "at the same time" means in terms of these entries being updated.

Due to this difficulty, you’d typically see write-through caching being used in a microservice architecture on the server side. The benefits are pretty clear—the win‐ dow in which a client might see stale data could be practically eliminated. This is bal‐ anced against the fact that server-side caches may well be less generally useful, limiting the circumstances in which a write-through cache would be effective in microservices.

**Write-behind** (write-back)

With a write-behind cache, the cache itself is updated first, and then the origin is updated. Conceptually, you can think of the cache as a buffer. Writing into the cache is faster than updating the origin. So we write the result into the cache, allowing faster subsequent reads, and trust that the origin will be updated afterward. The main concern around write-behind caches is going to be the potential for data loss. If the cache itself isn't durable, we could lose the data before the data is written to the origin. Additionally, we're now in an interesting spot—what is the origin in this context? We'd expect the origin to be the microservice where this data is sourced from—but if we update the cache first, is that really the origin?

# Freshness Versus Optimization 

Coming back to our example of TTL-based invalidation, I explained earlier that if we request a fresh copy of the data that has a five-minute TTL, and a second later the data at the origin changes, then our cache will be operating on out-of-date data for the remaining four minutes and 59 seconds. If this is unacceptable, one solution would be to reduce the TTL, thereby reducing the duration in which we could operate on stale data. So perhaps we reduce the TTL to one minute. This means that our window of staleness is reduced to one-fifth of what it was, but we've made five times as many calls to the origin, so we have to consider the associated latency and load impact. 

Balancing these forces is going to come down to understanding the requirements of the end user and of the wider system. Users will obviously always want to operate on the freshest data, but not if that means the system falls down under load. Likewise, *sometimes the safest thing to do is to turn off features if a cache fails*, in order to avoid an overload on the origin causing more serious issues. When it comes to finetuning what, where, and how to cache, you'll often find yourself having to balance along a number of axes. This is just another reason to try to keep things as simple as possible—the fewer the caches, the easier it can be to reason about the system. #principle #architecture/tip 

# The Golden Rule of Caching

{{< callout tip "Treat caching primarily as a performance optimization. Cache in as few places as possible to make it easier to reason about the freshness of data." >}}

{{< /callout >}}

Be careful about caching in too many places! The more caches between you and the source of fresh data, the more stale the data can be, and the harder it can be to determine the freshness of the data that a client eventually sees. It can also be more difficult to reason about where data needs to be invalidated. The trade-off around caching—balancing freshness of data against optimization of your system for load or latency—is a delicate one, and if you cannot easily reason about how fresh (or not) data might be, this becomes difficult.

Coming back to the famous quote from Knuth earlier, premature optimization can cause issues. Caching adds complexity, and we want to add as little complexity as possible. The ideal number of places to cache is zero. Anything else should be an optimization you have to make—but be aware of the complexity it can bring.


# patterns

## cache-aside

This is the most popular cache pattern. In this pattern, we have an application which will try to fetch data from the cache, and if the data is not found (also known as a “cache miss”) it will fetch data from the database. Or it will do an expensive computation. And then it will put that data back to the cache before returning the query back to the user.

In this pattern we only cache the data that we need, which is advantageous. One disadvantage of this pattern is that the data can become stale if there are lots of updates to the database. This disadvantage can be mitigated by having a “Time To Live” (or any other expiry pattern)—this is a concept we can skip for now since we’ll return to it later.

Another disadvantage to this pattern: If there are a lot of cache misses in our application, then the application has to do a lot more work than in the regular flow of just fetching data solely from the database. In this case, the application will first go to the cache, then there will be a cache miss, then it will go back to the database, and then write that data back to the cache before going back to the user.

If there are a lot of cache misses, then this cache is causing more problems than it’s worth.


## write-through

In these patterns, the application directly writes the data to the cache. And then the cache synchronously (or asynchronously) writes the data to the database. When we write it synchronously it’s called “write-through,” and when we write it asynchronously it’s called “write-back” (or “write-behind”). In the asynchronous example, we put the data in a queue, which writes the data back to the database and improves the latency of writes on your application.

>[!fix]
>If you’re experiencing slow writes, a quick fix is async writes to the database.

In both of these patterns, there is an obvious disadvantage. Here we are writing all the data to the cache, which might not even be read. Hence, we are overloading the cache (or cache memory) with expensive calls that might not even be required. For example, there are some accounts on Twitter that are not followed by many people. If we put every tweet in the cache from these unpopular accounts, it will take up expensive memory. Also, if the database goes down before the data is written to the database, this causes inconsistency.

https://redisson.org/glossary/write-through-and-write-behind-caching.html
https://www.reddit.com/r/AskProgramming/comments/16bkua0/why_use_a_writethrough_cache_in_distributed/

# in-memory type
As example of this solution we can pick Redis. 

# Policies

While the LFU method may seem like an intuitive approach to memory management it is not without faults. Consider an item in memory which is referenced repeatedly for a short period of time and is not accessed again for an extended period of time. Due to how rapidly it was just accessed its counter has increased drastically even though it will not be used again for a decent amount of time. This leaves other blocks which may actually be used more frequently susceptible to purging simply because they were accessed through a different method.[3](https://en.wikipedia.org/wiki/Least_frequently_used#cite_note-3)

Moreover, new items that just entered the cache are subject to being removed very soon again, because they start with a low counter, even though they might be used very frequently after that. Due to major issues like these, an explicit LFU system is fairly uncommon; instead, there are hybrids that utilize LFU concepts. https://en.wikipedia.org/wiki/Least_frequently_used#cite_note-4

Processes when working with cache


Cache efficiency

Problems
Cache Breakdown (Thundering herd problem). A cache breakdown increases the load on the database dramatically especially when lots of hot keys expire at the same time.

# sharding (consistent hashing)



Cache warming


Links
https://levelup.gitconnected.com/3-caching-problems-every-developer-should-know-1449f07e9166
https://devblogs.microsoft.com/buckh/caching-what-could-go-wrong/
https://netflixtechblog.com/cache-warming-agility-for-a-stateful-service-2d3b1da82642


