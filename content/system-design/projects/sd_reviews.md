---
contributors: []
date: '2025-02-22T08:51:50.982161'
description: Default Description
draft: false
lastmod: '2025-02-22T08:51:50.982161'
summary: ''
title: Sd Reviews
toc: true
weight: 810
---



# tiny url

offline key generation. 
We can have a standalone Key Generation Service (KGS) that generates random six letter strings *beforehand* and *stores* them in a database (let’s call it key-DB). Whenever we want to shorten a URL, we will just take one of the already-generated keys and use it. 
This approach will make things quite simple and fast. Not only are we not encoding the URL, but we won’t have to worry about duplications or collisions. [trade-offs]
Concurrency problems. 
Can concurrency cause problems? As soon as a key is used, it should be marked
in the database to ensure it doesn’t get used again. If there are multiple servers
reading keys concurrently, we might get a scenario where two or more servers try to
read the same key from the database. How can we solve this concurrency problem?
Servers can use KGS to read/mark keys in the database. KGS can use two tables to
store keys: one for keys that are not used yet, and one for all the used keys. As soon
as KGS gives keys to one of the servers, it can move them to the used keys table. 

KGS can always keep some keys in memory so that it can quickly provide them whenever a server needs them.

For simplicity, as soon as KGS loads some keys in memory, it can move them to the
used keys table. This ensures each server gets unique keys. If KGS dies before
assigning all the loaded keys to some server, we will be wasting those keys–which is
acceptable, given the huge number of keys we have.
KGS also has to make sure not to give the same key to multiple servers. For that, it
must synchronize (or get a lock on) the data structure holding the keys before
removing keys from it and giving them to a server

scheme with commiting?

# dropbox

Internally, files can be stored in small parts or chunks (say 4MB); this can
provide a lot of benefits i.e. all failed operations shall only be retried for
smaller parts of a file. If a user fails to upload a file, then only the failing chunk
will be retried.

We can reduce the amount of data exchange by transferring updated chunks
only.
By removing duplicate chunks, we can save storage space and bandwidth
usage.
Keeping a local copy of the metadata (file name, size, etc.) with the client can
save us a lot of round trips to the server.
For small changes, clients can intelligently upload the diffs instead of the
whole chunk.

How can clients **efficiently listen to changes** happening with other clients?
One solution could be that the clients periodically check with the server if there are
any changes. The problem with this approach is that we will have a delay in
reflecting changes locally as clients will be checking for changes periodically
compared to a server notifying whenever there is some change. If the client
frequently checks the server for changes, it will not only be wasting bandwidth, as
the server has to return an empty response most of the time, but will also be keeping
the server busy. Pulling information in this manner is not scalable.
A solution to the above problem could be to use HTTP long polling. With long
polling the client requests information from the server with the expectation that the
server may not respond immediately. If the server has no new data for the client
when the poll is received, instead of sending an empty response, the server holds the
request open and waits for response information to become available. Once it does
have new information, the server immediately sends an HTTP/S response to the
client, completing the open HTTP/S Request. Upon receipt of the server response,
the client can immediately issue another server request for future updates.

**differences**
The Synchronization Service should be designed in such a way that it transmits less
data between clients and the Cloud Storage to achieve a better response time. To
meet this design goal, the Synchronization Service can employ a differencing
algorithm to reduce the amount of the data that needs to be synchronized. Instead of
transmitting entire files from clients to the server or vice versa, we can just transmit
the difference between two versions of a file. Therefore, only the part of the file that
has been changed is transmitted. This also decreases bandwidth consumption and
cloud data storage for the end user.
As described above, we will be dividing our files into 4MB chunks and will be transferring modified chunks only. Server and clients can calculate a hash (e.g., SHA-256) to see whether to update the local copy of a 54chunk or not. On the server, if we already have a chunk with a similar hash (even from another user), we don’t need to create another copy, we can use the same chunk. This is discussed in detail later under Data Deduplication.

To be able to provide an efficient and scalable synchronization protocol we can
consider using a communication middleware between clients and the
Synchronization Service. The messaging middleware should provide scalable
message queuing and change notifications to support a high number of clients using
pull or push strategies. This way, multiple Synchronization Service instances can
receive requests from a global request Queue, and the communication middleware
will be able to balance its load.

**data deduplication**
We can implement deduplication in two ways in our system:
a. Post-process deduplication
With post-process deduplication, new chunks are first stored on the storage device
and later some process analyzes the data looking for duplication. The benefit is that
clients will not need to wait for the hash calculation or lookup to complete before
storing the data, thereby ensuring that there is no degradation in storage
performance. Drawbacks of this approach are 1) We will unnecessarily be storing
duplicate data, though for a short time, 2) Duplicate data will be transferred
consuming bandwidth.
b. In-line deduplication
Alternatively, deduplication hash calculations can be done in real-time as the clients
are entering data on their device. If our system identifies a chunk that it has already
stored, only a reference to the existing chunk will be added in the metadata, rather
than a full copy of the chunk. This approach will give us optimal network and storage
usage.

# facebook messenger

At a high-level, we will need a chat server that will be the central piece, orchestrating
all the communications between users. When a user wants to send a message to
another user, they will connect to the chat server and send the message to the server;
the server then passes that message to the other user and also stores it in the
database.

**Messages Handling**
How would we efficiently send/receive messages? To send messages, a user
needs to connect to the server and post messages for the other users. To get a
message from the server, the user has two options:
1. Pull model: Users can periodically ask the server if there are any new
messages for them.
2. Push model: Users can keep a connection open with the server and can
depend upon the server to notify them whenever there are new messages.
If we go with our first approach, then the server needs to keep track of messages that
are still waiting to be delivered, and as soon as the receiving user connects to the
server to ask for any new message, the server can return all the pending messages.
To minimize latency for the user, they have to check the server quite frequently, and
most of the time they will be getting an empty response if there are no pending
message. This will waste a lot of resources and does not look like an efficient
solution.

If we go with our second approach, where all the active users keep a connection open
with the server, then as soon as the server receives a message it can immediately
pass the message to the intended user. This way, the server does not need to keep
track of the pending messages, and we will have minimum latency, as the messages
are delivered instantly on the opened connection.

**How will clients maintain an open connection with the server?** 
We can use HTTP Long Polling or WebSockets. In long polling, clients can request information from the server with the expectation that the server may not respond immediately. If the server has no new data for the client when the poll is received, instead of sending an empty response, the server holds the request open and waits for responseinformation to become available. Once it does have new information, the server immediately sends the response to the client, completing the open request. Upon receipt of the server response, the client can immediately issue another server request for future updates. This gives a lot of improvements in latencies, throughputs, and performance. The long polling request can timeout or can receive a disconnect from the server, in that case, the client has to open a new request.

**How can the server keep track of all the opened connection*** to redirect messages to the users efficiently? 

The server can maintain a hash table, where
“key” would be the UserID and “value” would be the connection object. So whenever
the server receives a message for a user, it looks up that user in the hash table to find
the connection object and sends the message on the open request.
What will happen when the server receives a message for a user who has
gone offline? If the receiver has disconnected, the server can notify the sender
about the delivery failure. If it is a temporary disconnect, e.g., the receiver’s long-poll
request just timed out, then we should expect a reconnect from the user. In that
case, we can ask the sender to retry sending the message. This retry could be
embedded in the client’s logic so that users don’t have to retype the message. The
server can also

**Managing user’s status**
We need to keep track of user’s online/offline status and notify all the relevant users
whenever a status change happens. Since we are maintaining a connection object on
the server for all active users, we can easily figure out the user’s current status from
this. With 500M active users at any time, if we have to broadcast each status change
to all the relevant active users, it will consume a lot of resources. We can do the
following optimization around this:
1. Whenever a client starts the app, it can pull the current status of all users in
their friends’ list.
2. Whenever a user sends a message to another user that has gone offline, we can
send a failure to the sender and update the status on the client.
3. Whenever a user comes online, the server can always broadcast that status
with a delay of a few seconds to see if the user does not go offline immediately.
4. Client’s can pull the status from the server about those users that are being
shown on the user’s viewport. This should not be a frequent operation, as the
server is broadcasting the online status of users and we can live with the stale
offline status of users for a while.
5. Whenever the client starts a new chat with another user, we can pull the status
at that time.

# twitter

sharding
**Sharding based on UserID:** We can try storing all the data of a user on one server.
While storing, we can pass the UserID to our hash function that will map the user to
a database server where we will store all of the user’s tweets, favorites, follows, etc.
While querying for tweets/follows/favorites of a user, we can ask our hash function
where can we find the data of a user and then read it from there. This approach has a
couple of *issues*:
1. What if a user becomes hot? There could be a lot of queries on the server
holding the user. This high load will affect the performance of our service.
2. *Over time* some users can end up storing a lot of tweets or having a lot of
follows compared to others. *Maintaining a uniform distribution* of growing
user data is quite difficult.
To recover from these situations either we have to repartition/redistribute our data
or use consistent hashing.

We can further improve our performance by introducing cache to store hot tweets in
front of the database servers.

caching 

# youtube

Consistency can take a hit (in the interest of availability); if a user doesn’t see a video for a while, it should be fine.

**How should we efficiently manage read traffic?** 
We should segregate our read
traffic from write traffic. Since we will have multiple copies of each video, we can
distribute our read traffic on different servers. For metadata, we can have master-
slave configurations where writes will go to master first and then gets applied at all
the slaves. Such configurations can cause some staleness in data, e.g., when a new
video is added, its metadata would be inserted in the master first and before it gets
applied at the slave our slaves would not be able to see it; and therefore it will be
returning stale results to the user. This staleness might be acceptable in our system
as it would be very short-lived and the user would be able to see the new videos after
a few milliseconds.

We have many options to shard our
data. Let’s go through different strategies of sharding this data one by one:

Sharding based on UserID: We can try storing all the data for a particular user on
one server. While storing, we can pass the UserID to our hash function which will
map the user to a database server where we will store all the metadata for that user’s
videos. While querying for videos of a user, we can ask our hash function to find the
server holding the user’s data and then read it from there. To search videos by titles
we will have to query all servers and each server will return a set of videos. A
centralized server will then aggregate and rank these results before returning them
to the user.
This approach has a couple of issues:
1. What if a user becomes popular? There could be a lot of queries on the server
holding that user; this could create a performance bottleneck. This will also
affect the overall performance of our service.
2. Over time, some users can end up storing a lot of videos compared to others.
Maintaining a uniform distribution of growing user data is quite tricky.
To recover from these situations either we have to repartition/redistribute our data
or used consistent hashing to balance the load between servers.

# rate-limiter

Our system can get huge benefits from caching recent active users. Application
servers can quickly check if the cache has the desired record before hitting backend
servers. Our rate limiter can significantly benefit from the Write-back cache by
updating all counters and timestamps in cache only. The write to the permanent
storage can be done at fixed intervals. This way we can ensure minimum latency
added to the user’s requests by the rate limiter. The reads can always hit the cache
first; which will be extremely useful once the user has hit their maximum limit and
the rate limiter will only be reading data without any updates.

# twitter search

To deal with hot tweets we can introduce a cache in front of our database. We can
use Memcached, which can store all such hot tweets in memory. Application servers,
before hitting the backend database, can quickly check if the cache has that tweet.
Based on clients’ usage patterns, we can adjust how many cache servers we need.

# things



sd language: trade-off, compromise; estimation, estimate, assumption; guess, valuate
api gw
it it not obvious if caching is a win. 
We estimated earlier that the dataset for the business table with 200M businesses is in the terabyte range. The dataset size is on the borderline where sharding might have make sense. For this table the update rate is low, and it's read-heavy we should be able to get away without sharding if we put cache in front of it. This cache would take most of the read load of the frequency accessed businesses. 

If read performance is the bottlenech we can add read replicas to help.


# payments

https://www.youtube.com/watch?v=olfaBgJrUBI
https://www.youtube.com/watch?v=zsD4R_aQctw
https://www.youtube.com/watch?v=shipSEFMzHs
https://www.youtube.com/watch?v=g8XqFuDkga0
https://newsletter.pragmaticengineer.com/p/designing-a-payment-system
https://hackernoon.com/system-design-interview-designing-payment-systems-follow-up-questions-and-probable-issues
https://hiringfor.tech/2020/05/11/system-design-practice-designing-a-payment-system.html
https://devoxsoftware.com/blog/the-2022-manual-to-payment-system-architecture/
https://www.cockroachlabs.com/blog/cockroachdb-payments-system-architecture/

# file storage

why four-nines? not five nines? alternatives -> high availability in common as a AC (nfr)
how to reason about read/write heavy property?
in terms of latency: "very low latency"? 

batch vs stream. cdc. 

tbd: the ac gived a hint: 20,000 rps. They gived this hint intentionally. Why? What do they want?
there are 4 stages in meta: scoping, designing for scale, communication

# finding nearby friends

+tc clarified definition of 'nearby'
+tc clarified number of friends to show
+tc shared an assumption that is out of scope for this discussion
-he ask a question "how to interact with feature" -> instead you should get several options
+tc asked average number of interaction from a user to this feature
+tc clarified how much delay is acceptable in terms of real-time location of the user

# proximity servers

## Static Locations

my notes: 
This service's fundamental operation is searching. User should be able to search all nearby friends within a specified radius for any particular location. 
phrase: Given a user's location, return top X points of interest near the user

! static locations
pipeline: design iteration (Naive Approach) -> 

*first iteration*
lat, lon

*second iteration*
geohashing algorithms and proximity servers, geohash4, geohash5, and geohash6 ... find neighbours and query `select .. like 'asdfn%'`
index on geohash

*third iteration*
problems: `LIKE` can be slow; every request still makes a DB query which can be a bottleneck; diffucult to scale

solution: introduce 4, 5, 6 prefixes(and index these columns) and denormalizing
solution 2: add business cache and 3 leveled caches (return ids of bussinesses with this geohash)

write flow: introduce CDC in Kafka - cdc from mysql to kafka and then to 'business post processing' service to write changes to caches

language: first pass

https://www.youtube.com/watch?v=UCaVJsyq8ac

## dynamic locations



---

# Other

problem: global counter.
https://www.youtube.com/watch?v=V1HlNh4IhUo
https://systemdesign.one/distributed-counter-system-design/


ac analyzing signals:
- clarified strategy of burger assignment -> E6 kind of signal
- reasoning about single region vs cross region is good
- mentioned bloom filter at an early stage -> low-level detail -> he want to use Bloom filter instead of designing a proper solution
- you should involve interviewer more. don't do decision on behalf of customers. So you can identify trade-offs, then describe pros and cons and then ask a mention of ac. "what do you think it's important for our problem?"
- tc slightly release on of the requirements: counter could be less than 6M -> good signal for E6 (why?)
- tc *didn't handle* the critical part of the system which is the race conditions and how the things would be handled




23.12.23

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

coordination
communication

ranking algorithms?
feed construction
CUCKOO vs BLOOM filter

eventual consistency patterns
consistensy model
https://www.scylladb.com/glossary/consistency-models/


---
21.12.23

It’s a good practice to include a brief point about cache invalidation during system design interviews.

