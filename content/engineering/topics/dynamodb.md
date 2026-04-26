---
draft: false
toc: true
title: "Dynamodb"
linkTitle: "Dynamodb"
---
# Differences between relational data design and NoSQL


Relational database systems (RDBMS) and NoSQL databases have different strengths and weaknesses:

- In RDBMS, data can be queried flexibly, but queries are relatively expensive and don't scale well in high-traffic situations (see [First steps for modeling relational data in DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-modeling-nosql.html)).
- In a NoSQL database such as DynamoDB, data can be queried efficiently in a limited number of ways, outside of which queries can be expensive and slow.

These differences make database design different between the two systems:

- In RDBMS, you design for flexibility without worrying about implementation details or performance. Query optimization generally doesn't affect schema design, but normalization is important.
- In DynamoDB, you design your schema specifically to make the most common and important queries as fast and as inexpensive as possible. Your data structures are tailored to the specific requirements of your business use cases.

# Common


In DynamoDB, tables, items, and attributes are the core components that you work with. A _table_ is a collection of _items_, and each item is a collection of _attributes_. DynamoDB uses primary keys to uniquely identify each item in a table and secondary indexes to provide more querying flexibility. You can use DynamoDB Streams to capture data modification events in DynamoDB tables.

DynamoDb is a Key-Value Database.

DynamoDb is serverless.

Connection Model.

How DB enforces efficient data access?

Partitioning.

Sort Key. B-Tree search with `O(log n)` with 1MB limit. Result is returning with last position => so you have to use pagination

Projection Expressions.

# Data Modeling


When you switch from a relational database management system to a NoSQL database system like DynamoDB, it's important to understand the key differences and specific design approaches.

Data modeling decision based on an access patterns of my application.

Schema is holded by an application.

Joins are optimized for storage.

You don't have ad-hoc filtering in DynamoDB.

Steps for Modeling with DynamoDB

At a high level, these steps are:

- Understand your application
- Create an entity-relationship diagram ("ERD")
- Write out all of your access patterns
- Model your primary key structure
- Satisfy additional access patterns with secondary indexes and streams

## Single-Table Design


Joins are already in a table.

<https://aws.amazon.com/blogs/compute/creating-a-single-table-design-with-amazon-dynamodb/>

# Core Concepts


Key Terms:

- Table
- Item. Individual record. Analogs: Document in MongoDB, Row in RDB
- Primary key. We have 2 different types - Simple (partition key) and Composite (partition key + sort key)
- Attributes

There are two types of keys:

- partition key (hash key)
- sort key (range key). This is a way to represent a one-to-many relationship.

Importance of item collections. DB use it to partitioning and scaling. We use it in relationships modeling.

Secondary indexes.

You can reshape a data and allow additional access patterns without duplicating.

TTL. Epoch in seconds. Typically deleted within 48 hours.

Partitions

Talbe is a facade. All items with same partition key kept together. Partition key is hashed before placing. Hashing function `fx(key)` have `O(1)` time complexity. => this is a key to scalability.

More data == more partitions (10GB)

## Global Tables

# Consistency

## Write consistency


`PutItem` or another writing operations works in 2 phases: 1. Synchronous phase - write to leader and one of the followers. And then return. 2. Async phase - write to second follower (`lag < 100-200 ms`)

## Read consistency


Eventual consistency is default. You can have inconsistent data if your read request follows shortly after write and you read data from stale instance.

Strong consistency is available. You can force it if you need more accurate view of your data. Or you need most recent writes of your data. But it costs more.

Amazon DynamoDB reads data from tables, local secondary indexes (LSIs), global secondary indexes (GSIs), and streams. For more information, see [Core components of Amazon DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.CoreComponents.html). Both tables and LSIs provide two read consistency options: _eventually consistent_ (default) and _strongly consistent_ reads. All reads from GSIs and streams are eventually consistent.

When your application writes data to a DynamoDB table and receives an HTTP 200 response (OK), that means the write completed successfully and has been durably persisted. DynamoDB provides _read-committed_ isolation and ensures that read operations always return committed values for an item. The read will never present a view to the item from a write which did not ultimately succeed. Read-committed isolation does not prevent modifications of the item immediately after the read operation.

### Eventually Consistent Reads


Eventually consistent is the default read consistent model for all read operations. When issuing eventually consistent reads to a DynamoDB table or an index, the responses may not reflect the results of a recently completed write operation. If you repeat your read request after a short time, the response should return the more recent item. Eventually consistent reads are supported on tables, local secondary indexes, and global secondary indexes. Also note that all reads from a DynamoDB stream are also eventually consistent.

Eventually consistent reads are half the cost of strongly consistent reads. For more information, see [Amazon DynamoDB](https://aws.amazon.com/dynamodb/pricing/) pricing.

### Strongly Consistent Reads


Read operations such as `GetItem`, `Query`, and `Scan` provide an optional `ConsistentRead` parameter. If you set `ConsistentRead` to true, DynamoDB returns a response with the most up-to-date data, reflecting the updates from all prior write operations that were successful. Strongly consistent reads are only supported on tables and local secondary indexes. Strongly consistent reads from a global secondary index or a DynamoDB stream are not supported.

### Global tables read consistency


DynamoDB also supports [global tables](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GlobalTables.html) for multi-active and multi-Region replication. A global table is composed of multiple replica tables in different AWS Regions. Any change made to any item in any replica table is replicated to all the other replicas within the same global table, typically within a second, and are eventually consistent. For more information, see [Consistency and conflict resolution](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/V2globaltables_HowItWorks.html#V2globaltables_HowItWorks.conflict-resolution).

# Limits


Item size limit: 400KB. Mongo up to 60 MB.

Query and Scan result size. You can only receive up to 1MB in a single request.

Partition throughtput. Up to 3000 read RPS, 1000 write RPS. [Hot key] In another words, by default, every partition in the table will strive to deliver the full capacity of 3,000 RCU and 1,000 WCU

Global and Local Secondary indexes. If you use Local Search Index then item collection is limited to 10GB of data.

Overloading Keys and Indexes.

Multiple entity types in a single table.

No shared attribute names across entities.

# API-Action Types


API.

Item-based actions: `GetItem, PutItem, UpdateItem, DeleteItem`

# DynamoDB Streams

# Sources


<https://coursehunter.net/book/kniga-dynamodb>

<https://www.youtube.com/watch?v=HaEPXoXVf2k> #todo

<https://www.youtube.com/watch?v=yNOVamgIXGQ>

<https://www.youtube.com/watch?v=FQrN5aJWa_U>

<https://www.dynamodbguide.com/what-is-dynamo-db>

<https://aws.amazon.com/dynamodb/>

<https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html>

data modeling:

- <https://www.youtube.com/watch?v=yNOVamgIXGQ>
- <https://www.youtube.com/watch?v=p8phVh6HRkQ>
- <https://www.gomomento.com/blog/what-really-matters-in-dynamodb-data-modeling>
- <https://www.youtube.com/watch?v=DIQVJqiSUkE> #todo

<https://www.youtube.com/watch?v=HaEPXoXVf2k> #todo watch

<https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-relational-modeling.html>

<https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-general-nosql-design.html>

<https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-modeling-nosql.html>

<https://aws.amazon.com/blogs/compute/creating-a-single-table-design-with-amazon-dynamodb/>

projects:

<https://aws.amazon.com/blogs/compute/building-serverless-applications-with-streaming-data-part-1/>

Indexes:

<https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GSI.html>

<https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/LSI.html>

<https://www.youtube.com/watch?v=xfxBhvGpoa0> #todo

<https://www.youtube.com/watch?v=6yqfmXiZTlM>

Global Tables

<https://www.youtube.com/watch?v=Fa8Vf4Y7J_A>

architecture

<https://brooker.co.za/blog/2022/07/12/dynamodb.html>

<https://www.youtube.com/watch?v=0iGR8GnIItQ>

<https://www.alexdebrie.com/posts/dynamodb-paper/>

consistency

<https://www.alexdebrie.com/posts/dynamodb-eventual-consistency/?trk=feed_main-feed-card_reshare_feed-article-content>

<https://www.alexdebrie.com/posts/dynamodb-eventual-consistency/?trk=feed_main-feed-card_reshare_feed-article-content>
