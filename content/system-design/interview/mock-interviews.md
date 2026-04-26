---
draft: false
toc: true
title: "Mock Interviews"
linkTitle: "Mock Interviews"
---
problem: global counter.

<https://www.youtube.com/watch?v=V1HlNh4IhUo>

<https://systemdesign.one/distributed-counter-system-design/>

ac analyzing signals:

- clarified strategy of burger assignment -> E6 kind of signal
- reasoning about single region vs cross region is good
- mentioned bloom filter at an early stage -> low-level detail -> he want to use Bloom filter instead of designing a proper solution
- you should involve interviewer more. don't do decision on behalf of customers. So you can identify trade-offs, then describe pros and cons and then ask a mention of ac. "what do you think it's important for our problem?"
- tc slightly release on of the requirements: counter could be less than 6M -> good signal for E6 (why?)
- tc *didn't handle* the critical part of the system which is the race conditions and how the things would be handled
1. 12.23

--

communication: tc iterated on the fact that marketing compain is the *key feature* of the design

tc *stated their assumption* that each user has one account

tc clarified if they should focus on tracking the order infrastructure

user experience when post promo code

phrase. tc also identified the trade-off that they can have the API as sync and async. TC also identified the pros and cons in terms of technical simplicity and user experience.

technical. tc talked about the rate-limiting to avoid the abusing the system.

sync/async

**red** flag: tc could have involved the interviewer while making the decision about sync vs async.

most common trade-offs: api, sql/nosql, caching, scaling, core problem, push/pull, sync/async

not all numbers are important. qps is always important. storage numbers usually important.

interview: get several solutions, and explicitly say about trade-offs

make several deep-dive moments (db choises, db sizes, connection with)

ac(nfr) -> what is the implications? for example, why latency p95 200 ms? why 3.2GB/day

explain for an ac it's meaning

example. 40x10^7 -> horizontal scaling?

connect you discussion with numbers and acs(nfr)

get feedback on milestones

write down your discussion

efficiency play:
> you can explain api, schema etc in a flow
> "I'm going to explain thing end to end. You know, I'm going to explain API while I'm talking about the flow."
core puzzle

what is the core puzzle. for example, for live comments this is a push vs pull trade-off

examples: push/pull in live commenting, save/process photos on instagram surfing, algorithm connecting rider and driver

spikes

push/pull and dt, frequency, numbers considerations. (example - I cannot use pull - dt < 100 ms)

fan-out

<https://codemia.io/blog/path/Re-evaluating-Fan-Out-on-Write-vs-Fan-Out-on-Read-Under-Celebrity-Traffic-Spikes-2025>

coordination

communication

ranking algorithms?

feed construction

CUCKOO vs BLOOM filter

eventual consistency patterns

consistensy model

<https://www.scylladb.com/glossary/consistency-models/>

21.12.23

It's a good practice to include a brief point about cache invalidation during system design interviews. (source?)
