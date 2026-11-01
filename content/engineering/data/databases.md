---
draft: false
toc: true
title: "Databases and Access Patterns"
description: "Study notes for matching storage types to access patterns and exploring sharding, indexing, denormalization, and database engineering resources."
linkTitle: "Databases"
---
data access pattern

Types: SQL, Key-Value Stores, Blob Stores (S3, GCS), Timelines DB, Graph(Neo4j), Spatial (QuadTree)

# sql


Pros: ACID transactions, imposing very strict structure => querying capabilities, DB indexing, Data Normalization.

# k-v stores


pros: caching, no-strict scheme, speed

examples

# functional partitioning

# sharding


Divide a data store into a set of horizontal partitions or shards. This can improve scalability when storing and accessing large volumes of data.

There are some questions to answer: how to split up a data? Where shards need to be placed? How to prevent hot spots and deal with them?

Shard number determination logic should be placed in RP (reversed proxy) doing this on behalf of database' shards.

**Context and problem**

what is it? trade-offs

# denormalization

# indexing


definitions.

Indexing is a mechanism by which the underlying data is mapped for faster retrieval.

For a system to process an instruction involving data access, these are the certain steps involved:

problems

cons:

-> This means that by maintaining an index, we could reduce the I/O calls to the disk substantially, from 25 calls before the index to 2 calls (one for the index and the other for the specific block).

multilevel index

B-Trees, B+ trees

<https://jepsen.io/analyses>

# resources


"Fundamentals of Database Engineering" course by Hussein Nasser

"Relational Databases" by Oz Nova

## Library sources


- [Chen and Lee 2019](/sources/ff4ac0aafff5f0a0078bfc6df2bf770d.bin), *An Introduction of NoSQL Databases Based on Their Categories and Application Industries*
- [Gessert et al. 2016](/sources/fc53b69af61018fb92068967d9d83656.bin), *NoSQL database systems: a survey and decision guidance* ([doi:10.1007/s00450-016-0334-3](https://doi.org/10.1007/s00450-016-0334-3))
- [LearnSQL 2020](/sources/dafe82d337664e03121d79e4aeaf5437.bin), *SQL Cheat Sheets*
- [Xu 2023](/sources/33fcb5890500f2e2720163aa593e49a0.bin), *Key Steps in the Database Selection Process*
