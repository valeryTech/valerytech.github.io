---
contributors: []
date: '2025-02-22T08:51:50.972074'
description: Default Description
draft: false
lastmod: '2025-02-22T08:51:50.972074'
summary: ''
title: Partitioning
toc: true
weight: 810
---


For very large datasets, or very high query throughput, that is not sufficient: we need to break the data up into partitions, also known as sharding.


# Partitioning of Key-Value Data

If the partitioning is unfair, so that some partitions have more data or queries than
others, we call it *skewed*. The presence of skew makes partitioning much less effective.
In an extreme case, all the load could end up on one partition, so 9 out of 10 nodes
are idle and your bottleneck is the single busy node. A partition with disproportion‐
ately high load is called a *hot spot*.

The simplest approach for avoiding hot spots would be to assign records to nodes
randomly. That would distribute the data quite evenly across the nodes, but it has a
big disadvantage: when you’re trying to read a particular item, you have no way of
knowing which node it is on, so you have to query all nodes in parallel.

## by key range

One way of partitioning is to assign a continuous range of keys (from some minimum to some maximum) to each partition. 

## hash partitioning

Because of this risk of skew and hot spots, many distributed datastores use a hash
function to determine the partition for a given key.

For partitioning purposes, the hash function need not be cryptographically strong:
for example, Cassandra and MongoDB use MD5, and Voldemort uses the Fowler–
Noll–Vo function.

Once you have a suitable hash function for keys, you can assign each partition a
range of hashes (rather than a range of keys), and every key whose hash falls within a
partition’s range will be stored in that partition.

This technique is good at distributing keys fairly among the partitions. The partition
boundaries can be evenly spaced, or they can be chosen pseudorandomly (in which
case the technique is sometimes known as consistent hashing).

consistent hashing. this particular approach actually doesn’t work very well for databases [8], so it is rarely used in practice (the documentation of some databases still refers to consistent hashing, but it is often inaccurate). Because this is so confusing, it’s best to avoid the term consistent hashing and just call it hash partitioning instead.

Unfortunately however, by using the hash of the key for partitioning we lose a nice
property of key-range partitioning: the ability to do efficient range queries.

# skewed workloads

and relieving hot-spots

# Partitioning and Secondary Indexes


# Rebalancing Partitions

Over time, things change in a database:
• The query throughput increases, so you want to add more CPUs to handle the load.
• The dataset size increases, so you want to add more disks and RAM to store it.
• A machine fails, and other machines need to take over the failed machine’s responsibilities.

All of these changes call for data and requests to be moved from one node to another.

The process of moving load from one node in the cluster to another is called rebalancing.

No matter which partitioning scheme is used, rebalancing is usually expected to meet some minimum requirements:
• After rebalancing, the load (data storage, read and write requests) should be shared fairly between the nodes in the cluster.
• While rebalancing is happening, the database should continue accepting reads and writes.
• No more data than necessary should be moved between nodes, to make rebalancing fast and to minimize the network and disk I/O load.



# request routing

We have now partitioned our dataset across multiple nodes running on multiple
machines. But there remains an open question: when a client wants to make a
request, how does it know which node to connect to? As partitions are rebalanced,
the assignment of partitions to nodes changes. Somebody needs to stay on top of
those changes in order to answer the question: if I want to read or write the key “foo”,
which IP address and port number do I need to connect to?
This is an instance of a more general problem called service discovery, which isn’t
limited to just databases. Any piece of software that is accessible over a network has
this problem, especially if it is aiming for high availability (running in a redundant
configuration on multiple machines). Many companies have written their own in-
house service discovery tools, and many of these have been released as open source
[30].
On a high level, there are a few different approaches to this problem (illustrated in
Figure 6-7):
1. Allow clients to contact any node (e.g., via a round-robin load balancer). If that
node coincidentally owns the partition to which the request applies, it can handle
the request directly; otherwise, it forwards the request to the appropriate node,
receives the reply, and passes the reply along to the client.
2. Send all requests from clients to a routing tier first, which determines the node
that should handle each request and forwards it accordingly. This *routing tier*
does not itself handle any requests; it only acts as a *partition-aware load balancer*.
3. Require that clients *be aware of the partitioning* and *the assignment of partitions*
to nodes. In this case, a client can connect directly to the appropriate node,
without any intermediary.
In all cases, the key problem is: how does the component making the routing decision
(which may be one of the nodes, or the routing tier, or the client) *learn about changes*
in the assignment of partitions to nodes?

This is a challenging problem, because it is important that *all participants agree*—
otherwise requests would be sent to the wrong nodes and not handled correctly.
There are protocols for achieving consensus in a distributed system, but they are hard
to implement correctly

Many distributed data systems rely on a separate coordination service such as Zoo‐
Keeper to keep track of this cluster metadata, as illustrated in Figure 6-8. Each node
registers itself in ZooKeeper, and ZooKeeper maintains the authoritative mapping of
partitions to nodes. Other actors, such as the routing tier or the partitioning-aware
client, can subscribe to this information in ZooKeeper. Whenever a partition changes
ownership, or a node is added or removed, ZooKeeper notifies the routing tier so that
it can keep its routing information up to date.

For example, LinkedIn’s Espresso uses Helix [31] for cluster management (which in
turn relies on ZooKeeper), implementing a routing tier as shown in Figure 6-8.
HBase, SolrCloud, and Kafka also use ZooKeeper to track partition assignment.
MongoDB has a similar architecture, but it relies on its own config server implemen‐
tation and mongos daemons as the routing tier.
Cassandra and Riak take a different approach: they use a gossip protocol among the
nodes to disseminate any changes in cluster state. Requests can be sent to any node,
and that node forwards them to the appropriate node for the requested partition
(approach 1 in Figure 6-7). This model puts more complexity in the database nodes
but avoids the dependency on an external coordination service such as ZooKeeper.
Couchbase does not rebalance automatically, which simplifies the design. Normally it
is configured with a routing tier called moxi, which learns about routing changes
from the cluster nodes [32].
When using a routing tier or when sending requests to a random node, clients still
need to find the IP addresses to connect to. These are not as fast-changing as the
assignment of partitions to nodes, so it is often sufficient to use DNS for this purpose.










