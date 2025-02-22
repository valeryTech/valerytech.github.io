---
contributors: []
date: '2025-02-22T09:02:28.392283'
description: Default Description
draft: false
lastmod: '2025-02-22T09:02:28.392283'
summary: ''
title: Replication
toc: true
weight: 810
---

# Types

Database replication

Replication means keeping a copy of the same data on multiple machines that are connected via a network.

# benefits

There are several reasons why you might want to replicate data:
~ To keep data geographically close to your users (and thus reduce latency)
~ To allow the system to continue working even if some of its parts have failed (and thus increase availability)
~ To scale out the number of machines that can serve read queries (and thus increase read throughput)

# problem

Each node that stores a copy of the database is called a replica. With multiple replicas, a *question* inevitably arises: how do we ensure that all the data ends up on all the replicas?

Every write to the database needs to be processed by every replica; otherwise, the replicas would no longer contain the same data. The most common solution for this is called *leader-based replication* (also known as active/passive or master–slave replication). It works as follows:

1. One of the replicas is designated the *leader* (also known as master or primary). When clients want to write to the database, they must send their requests to the leader, which first writes the new data to its local storage.
2. The other replicas are known as *followers* (read replicas, slaves, secondaries, or hot standbys).Whenever the leader writes new data to its local storage, it also sends the data change to all of its followers as part of a *replication log* or *change stream*. Each follower takes the log from the leader and updates its local copy of the database accordingly, by applying all writes in the same order as they were processed on the leader.
3. When a client wants to read from the database, it can query either the leader or any of the followers. However, writes are only accepted on the leader (the followers are read-only from the client's point of view).

# regime

An important detail of a replicated system is whether the replication happens **synchronously or asynchronously**. (In relational databases, this is often a configurable option; other systems are often hardcoded to be either one or the other.)

## sync / async replication

## semi-synchronous

## chain replication

## reasoning

reasoning example from DDIA

*pros/cons*: The advantage of synchronous replication is that the follower is guaranteed to have an up-to-date copy of the data that is consistent with the leader. If the leader suddenly fails, we can be sure that the data is still available on the follower. The disadvantage is that if the synchronous follower doesn't respond (because it has crashed, or there is a network fault, or for any other reason), the write cannot be processed. The leader must block all writes and wait until the synchronous replica is available again.

reasoning: For that reason, it is impractical for all followers to be synchronous: any one node outage would cause the whole system to grind to a halt. In practice, if you enable synchronous replication on a database, it usually means that one of the followers is synchronous, and the others are asynchronous. If the synchronous follower becomes unavailable or slow, one of the asynchronous followers is made synchronous. This guarantees that you have an up-to-date copy of the data on at least two nodes: the leader and one synchronous follower. This configuration is sometimes also called semi-synchronous.

Often, leader-based replication is configured to be completely asynchronous. In this case, if the leader fails and is not recoverable, any writes that have not yet been replicated to followers are lost. This means that a write is not guaranteed to be durable, even if it has been confirmed to the client. However, a fully asynchronous configuration has the advantage that the leader can continue processing writes, even if all of its followers have fallen behind.

Weakening durability may sound like a bad trade-off, but asynchronous replication is nevertheless widely used, especially if there are many followers or if they are geographically distributed.

We will discuss three popular algorithms for replicating changes between nodes: single-leader, multi-leader, and leaderless replication.

# replication log

How does leader-based replication work under the hood? Several different replication methods are used in practice, so let's look at each one briefly.

# replication lag problems

Unfortunately, if an application reads from an asynchronous follower, it may see out‐
dated information if the follower has fallen behind. This leads to apparent inconsis‐
tencies in the database: if you run the same query on the leader and a follower at the
same time, you may get different results, because not all writes have been reflected in
the follower. This inconsistency is just a temporary state—if you stop writing to the
database and wait a while, the followers will eventually catch up and become consis‐
tent with the leader. For that reason, this effect is known as eventual consistency

When the lag is so large, the inconsistencies it introduces are not just a theoretical
issue but a real problem for applications. In this section we will highlight three exam‐
ples of problems that are likely to occur when there is replication lag and outline
some approaches to solving them.

We looked at some strange effects that can be caused by replication lag, and we dis‐
cussed a few consistency models which are helpful for deciding how an application
should behave under replication lag:

## Reading Your Own Writes

Users should always see data that they submitted themselves.

problem roots, formulation and consiquences. -> we need *read-after-write consistency*, also known as read-your-writes consistency

How can we implement read-after-write consistency in a system with leader-based replication? There are various possible techniques. To mention a few:

## Monotonic Reads

After users have seen the data at one point in time, they shouldn't later see the
data from some earlier point in time.

Our second example of an anomaly that can occur when reading from asynchronous followers is that it's possible for a user to see things moving backward in time.

This can happen if a user makes several reads from different replicas.

## Consistent Prefix Reads

Users should see the data in a state that makes causal sense: for example, seeing a
question and its reply in the correct order.

Preventing this kind of anomaly requires another type of guarantee: consistent prefix
reads. This guarantee says that if a sequence of writes happens in a certain order,
then anyone reading those writes will see them appear in the same order.

# Solutions for Replication Lag

how to think about this?

When working with an eventually consistent system, it is worth thinking about how the application behaves if the replication lag increases to several minutes or even hours. If the answer is "no problem," that's great. However, if the result is a bad experience for users, it's important to design the system to provide a stronger guarantee, such as read-after-write.

As discussed earlier, there are ways in which an application can provide a stronger guarantee than the underlying database—for example, by performing certain kinds of reads on the leader. However, dealing with these issues in application code is complex and easy to get wrong.

> It would be better if application developers didn't have to worry about subtle replication issues and could just trust their databases to "do the right thing." This is why transactions exist: they are a way for a database to provide stronger guarantees so that the application can be simpler.

Also, the replication itself should be transparent to an external user.

Single-node transactions have existed for a long time. However, in the move to dis‐
tributed (replicated and partitioned) databases, many systems have abandoned them,
claiming that transactions are too expensive in terms of performance and availability,
and asserting that eventual consistency is inevitable in a scalable system. There is
some truth in that statement, but it is overly simplistic, and we will develop a more
nuanced view

# multi-leader replication

As multi-leader replication is a somewhat retrofitted feature in many databases, there
are often subtle configuration pitfalls and surprising interactions with other database
features. For example, autoincrementing keys, triggers, and integrity constraints can
be problematic. For this reason, multi-leader replication is often considered danger‐
ous territory that should be avoided if possible [28].

crdt
<https://ably.com/blog/crdts-distributed-data-consistency-challenges>

what is the conflict?

scalable approaches for detecting and resolving conflicts in a replicated system.

# trade-offs

There are many trade-offs to consider with replication: for example, whether to use
synchronous or asynchronous replication, and how to handle failed replicas. Those
are often configuration options in databases, and although the details vary by data‐
base, the general principles are similar across many different implementations. We
will discuss the consequences of such choices in this chapter.

# Choosing the Right Replication Strategy

Factors:

sources:
ddia,

# replication

Replication is done to achieve one or more of the following goals:

1. To avoid a single point of failure and increase availability when machines go down.
2. To better serve the global users by organizing copies by distinct geological locations in order to serve users from copies that are close by.
3. To increase throughput. With more machines, more requests can be served.

language:
replica, leader, follower

sync and async replication, semy-sinc.
pros, cons;

common types of replication:

**single leader**
In system design, a single machine acts as a leader, and all write requests (or updates to the data store) go through that machine. All the other machines are used to cater to the read requests. This was previously known as "master-slave" replication, but it's currently known as "primary-standby" or "active-passive" replication.

The leader also needs to pass down the information about all the writes to the follower nodes to keep them up to date. In case the leader goes down, one of the follower nodes (mostly with the most up-to-date data) is promoted to be the leader. This is called failover.

**multi leader**
In system design, this means that more than one machine can take the write requests. This makes the system more reliable in case a leader goes down. This also means that every machine (including leaders) needs to catch up with the writes that happen over other machines.

?? Conflict resolution for concurrent writes: #todo

1. Keeping the update with the largest client timestamp.
2. Sticky routing—writes from same client/index go to the same leader.
3. Keeping and returning all the updates.

# Leaderless Replication

In such a system, all machines can cater to write and read requests. In some cases, the client directly writes to all the machines, and requests are read from all the machines based on quorum. Quorum refers to the minimum number of acknowledgements (for writes) and consistent data values (for reads) for the action to be valid. In other cases, the client request reaches the coordinator that broadcasts the request to all the nodes.
