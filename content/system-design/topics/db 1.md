---
contributors: []
date: 2025-02-21T15:53:28.148991
description: Default Description
draft: false
lastmod: 2025-02-21T15:53:28.148991
summary: ''
title: Db 1
toc: true
weight: 810
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

https://jepsen.io/analyses
