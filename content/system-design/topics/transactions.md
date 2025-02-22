---
contributors: []
date: '2025-02-22T09:02:28.392283'
description: Default Description
draft: false
lastmod: '2025-02-22T09:02:28.392283'
summary: ''
title: Transactions
toc: true
weight: 810
---

# Definition

How do you figure out whether you need transactions? In order to answer that question, we first need to understand exactly *what safety guarantees transactions can provide*, and what costs are associated with them. Although transactions seem straightforward at first glance, there are actually many subtle but important details that come into play.

The truth is not that simple: like every other technical design choice, transactions have advantages and limitations. In order to understand those trade-offs, let's go into the details of the guarantees that transactions can provide—both in normal operation and in various extreme (but realistic) circumstances.

# ACID

## Atomicity

Rather, ACID atomicity describes what happens if a client wants to make several writes, but a fault occurs after some of the writes have been processed—for example, a process crashes, a network connection is interrupted, a disk becomes full, or some integrity constraint is violated. If the writes are grouped together into an *atomic transaction*, and the transaction cannot be completed (*committed*) due to a fault, then the transaction is *aborted* and the database must discard or undo any writes it has made so far in that transaction.

The ability to abort a transaction on error and have all writes from that transaction discarded is the defining feature of ACID atomicity. Perhaps abortability would have been a better term than atomicity, but we will stick with atomicity since that's the usual word.

## Consistency

## Isolation

## Durability

isolation levels: read commited and serializable

Implementing read committed
Read committed is a very popular isolation level. It is the default setting in Oracle
11g, PostgreSQL, SQL Server 2012, MemSQL, and many other databases [8].
Most commonly, databases prevent dirty writes by using row-level locks: when a
transaction wants to modify a particular object (row or document), it must first
acquire a lock on that object. It must then hold that lock until the transaction is com‐
mitted or aborted. Only one transaction can hold the lock for any given object; if
another transaction wants to write to the same object, it must wait until the first
transaction is committed or aborted before it can acquire the lock and continue. This
locking is done automatically by databases in read committed mode (or stronger iso‐
lation levels).
How do we prevent dirty reads? *One option* would be to use the same lock, and to
require any transaction that wants to read an object to briefly acquire the lock and
then release it again immediately after reading. This would ensure that a read
couldn't happen while an object has a dirty, uncommitted value (because during that
time the lock would be held by the transaction that has made the write).

However, the approach of requiring read locks does not work well in practice,
because one long-running write transaction can force many read-only transactions to
wait until the long-running transaction has completed. This harms the response time
of read-only transactions and is bad for operability: a slowdown in one part of an
application can have a knock-on effect in a completely different part of the applica‐
tion, due to waiting for locks.

For that reason, most databasesvi prevent dirty reads using the approach illustrated in
Figure 7-4: for every object that is written, the database remembers both the old com‐
mitted value and the new value set by the transaction that currently holds the write
lock. While the transaction is ongoing, any other transactions that read the object are
simply given the old value. Only when the new value is committed do transactions
switch over to reading the new value.

Snapshot Isolation and Repeatable Read
If you look superficially at read committed isolation, you could be forgiven for think‐
ing that it does everything that a transaction needs to do: it allows aborts (required
for atomicity), it prevents reading the incomplete results of transactions, and it pre‐
vents concurrent writes from getting intermingled. Indeed, those are useful features,
and much stronger guarantees than you can get from a system that has no transac‐
tions.

implementing

Like read committed isolation, implementations of snapshot isolation typically use
write locks to prevent dirty writes (see "Implementing read committed" on page 236),
which means that a transaction that makes a write can block the progress of another
transaction that writes to the same object. However, reads do not require any locks.
From a performance point of view, a key principle of snapshot isolation is readers
never block writers, and writers never block readers. This allows a database to handle
long-running read queries on a consistent snapshot at the same time as processing
writes normally, without any lock contention between the two.
To implement snapshot isolation, databases use a generalization of the mechanism
we saw for preventing dirty reads in Figure 7-4. The database must potentially keep
several different committed versions of an object, because various in-progress trans‐
actions may need to see the state of the database at different points in time. Because it
maintains several versions of an object side by side, this technique is known as multi-
version concurrency control (MVCC).

<https://www.postgresql.org/docs/7.2/mvcc.html>
