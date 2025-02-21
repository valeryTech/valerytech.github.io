---
contributors: []
date: 2025-02-21T17:37:47.882031
description: Default Description
draft: false
lastmod: 2025-02-21T17:37:47.882031
summary: ''
title: Envelope Estimations
toc: true
weight: 810
---

https://www.hellointerview.com/blog/mastering-estimation #todo

According to Jeff Dean, Google Senior Fellow, "back-of-the-envelope calculations are estimates you create using a combination of thought experiments and common performance numbers to get a good feel for which designs will meet your requirements"
Commonly asked back-of-the-envelope estimations: QPS, peak QPS, storage, cache, number of servers, etc. You can practice these calculations when preparing for an interview. Practice makes perfect.

* Throughput of each layer
* Latency caused between each layer
* Overall latency justification

char: rps, volumes, etc

When in doubt, just guess higher—it’s called *margin of safety*. For our Twitter example we can go for these numbers:
Reads/minute: 100k
Writes/minute: 1k

https://www.reddit.com/r/ExperiencedDevs/comments/19e19jn/what_is_the_point_of_back_of_the_envelope/

DAU (daily active users), QPS (query per seconds)
Strategy??
First, we need to recognize a limited resource in our system, then approximate the actual usage. For example, our servers are capped by 2GHz CPUs, and we would like to know if we can serve all user requests using a single server.
So how to approximate the actual usage? We need to break down the usage to its constituting factors, make a rough estimate of those factors (if needed, further breaking them down), and combining them.
For example, we might expect to have 1K active users, each issuing 15 requests per day. That's 15K requests per day, or 15K/86400 requests per second.
When combining the parts, a trick is to round aggressively. Noone wants to divide by 86400. So let's round to 20K/100K, leaving 0.2 seconds time available to serve a single request. If we know that a single request roughly takes 0.7 seconds to serve, we need to bring up at least 4 machines. Of course you don't want to live on the edge, so let's add some buffer and make that 10 machines (which is also a nicer number).
Dimensions to approximate
Find typical limited dimensions, along with exercises below.

Network bandwidth
Assuming 1Gbps link per machine, if we want to crawl 70TB of websites every day, how many machines would a crawler system need?

Storage space
How much space would it take to store the contents of 100M web pages? What if we substitute each word by an integer index? How many machines of 64GB SSD would it fit?

IO throughput
You store fetched web pages on a mechanical hard drive, with limited random access speed. Users issue requests with 100 query per sec (qps), each request typically returning the content of 20 pages. How many hard drives would you need to keep request latency low?

Engineering effort.
You need to deliver a new feature. There are 5 programmers and 40 tasks. How many weeks until possible launch?

Money.
A user pays $10 a month for your image store service, storing all their photos, each downsized to 3MB. During a month a user fetches 1K photos. Find the pricing page of your favorite cloud provider, and calculate the cost associated with each user. How much is your revenue per user? Check for different assumed photo counts.

Others include CPU time, RAM size, latencies of various kinds (disk access, RAM access, network), thread count.
Where to start?
Enumerate typical use-cases of the system and determine the most critical resources they need. A document store will need lots of storage. Guesstimating document sizes and counts is a good start, but further details will depend on usage. How often are new documents added? Are the documents searchable? Do we need any indices? Is it a write-heavy or read-heavy store?

Different use-cases will likely need very different shapes of resources. For example, serving the documents might need lots of RAM but not CPU, while preprocessing of new documents just the other way around. Hosting all those services on homogeneous machines would waste both CPU and RAM, since you need to get machines which are maxed on both dimensions.

Such differences indicate those features should be split to different services, hosted on independent sets of machines.

It's always a good idea to estimate the scale of the system you're going to design. This would also help later when you'll be focusing on scaling, partitioning, load balancing and caching.

1. What scale is expected from the system (e.g., number of new tweets, number of tweet views, how many timeline generations per sec., etc.)
1. How much storage would we need? This will depend on whether users can upload photos and videos in their tweets?
1. What network bandwidth usage are we expecting? This would be crucial in deciding how would we manage traffic and balance load between servers.
   Enumerate typical use-cases of the system and determine the most critical resources they need.
   ..
   I have seen 2 approaches taken when calculating the back of the envelope calculations.
   The first approach as you have listed out in the bullet points starts with an overall picture of the system and calculations move to a single server and memory requirements. That is if there are 330 million active users and 5700 tweets a second, how do I get to what specs will be required for a single server and thereby calculating how many servers/DBs are needed, etc.
   Under the interview pressure, I always felt this process to be a bit difficult when performing larger divisions. To quote your example "... So we need 60000 * 0.95 / 320 = 178 servers". There is no way I can do this calculation on the whiteboard in live interview without sweating myself.
   The second approach, which I always preferred is to start small and grow bigger with quite a few approximations. After all, the back of the envelope calculation is supposed to be a T-shift level "estimation". I also often start with a small number of variables preferably one.
   For example, instead of managing 2 variables like "Number of active users" and "Number of tweets", I start at the server level and ask myself a question, what factor affects my server the most? a number of active users coming to the server or number of tweets coming to the server. If my server gets 10 tweets per second, does it matter in terms of memory and threads requirements if 10 active users send 1 tweet/sec or 1 active user sends 10 tweets/sec? If it does not matter then I, for now, I will ignore the number of active users and focus on how many tweets the server receives per second. My 2 variables are down to 1.
   I also make sure, I never talk on the specifics of the functionality and instead talk/focus on the raw/common server requirements. That is instead of saying, the server receives 10 tweets per second, I will say the server receives 10 "requests" per second. Converting tweets to requests helps me memorize the same logic across twitter design where the server receives tweets and facebook design where the server receives photo upload and comments requests. Everything is incoming request no differentiation.
   Example.
   Ok so focusing on the twitter calculations, I would start something like this.

I will start saying, I will at minimum calculate servers, memory, and storage requirements

Starting small, I will say, assuming, the application gets 1000 requests per second, (1000 is an easy nice number for any calculation and we can scale up or down easily depending on the requirement. The real twitter number would be much higher)

1000 requests/sec
3600 seconds per hour, it will be 1000 * 4000 (approximating 3600 to nearest whole number 4000 as multiplication by 4K is much easier orally than 3.6K) => we get 4 million requests/hr
4M requests/hr translates to 4M * 30 hours (instead of 24 hours in a day as its much easier to multiply by 30 than 24) => 120 million requests/day
120 million requests/day translates to 120M * 400 days (instead of 365) = 50 billion requests/year (instead of 48B)
Assuming the capacity planning estimates are for 5 years, we get 50B * 5 = 250 Billion request data is what we may end up storing in our system.
Now to calculate the number of servers, From the experience of running applications in production, I know say a tomcat/jetty server running Spring boot application at a minimum will have 100 worker thread (200 default) to handle HTTP requests

The server will handle tweets, photos, video uploads
handling 1000 requests with 100 threads I would use 10 + 20% more = 12 servers.
If 1000 requests change to 10000 requests, 12 servers would more or less convert to 120 servers.
For server memory requirements of the server:
Now for server memory requirements, the capacity required to handle requests with video and images would be much higher compared to tweet,

Assuming photos are 1MB in upload size (Usually a UI side compression library will reduce a photo image size to be around 500KB, but 1 MB is easy for calculation) and videos to be 50 MB in size
To handle 100 requests/sec for video uploads, 100 * 50MB = 5GB of memory for each commodity server.
For Storage requirement, assuming we need to store data for 5 years

As previously calculated, 250 Billion request data to store for 5 years, assuming 10% to be for videos (50MB avg), 20% for photos (1MB avg) and 70% for tweets (200KB avg) we need
-- Note, usual conversions are (1000 translates to KB storage, 1 million translates to 1 MB of storage, 1 billion translates to 1 GB of stroage)
10% Video: 250 Billion request data (that is 250 GB) * 10% => 25 GB * 50MB ~~ 25000MB * 50MB ~~ 1250000 MB => 1250 GB => 1.2TB
20% Photos: 250 Billion request data * 20 % => 50 GB * 1MB => 50000 MB * 1MB => 50000 MB => 50GB
70% Tweets: 250 Billion request data * 70% ~~ 200 GB * 200 bytes => 200000MB * 0.002MB => 400MB
Total (1.2TB + 50 GB + 400 MB) ~~ 1.2TB (in reality this capacity will be much higher as video/photo storage size requirements will be much higher but I hope reader gets the point)
Summary

Start with a single variable and translate specific design requirement into raw server requirements like requests/sec (instead of tweets/sec or photos/server)
Start from a single server requirement instead of trying to divide total tweets or total storage by servers.
Remember to get all the calculations done in 5 mins. Unless the interviewer wants to focus on the specifics calcuations. Remember these contents are high-level estimates.
