---
contributors: []
date: 2025-02-21T17:37:47.896407
description: Default Description
draft: false
lastmod: 2025-02-21T17:37:47.896407
summary: ''
title: Chat Room
toc: true
weight: 810
---

I had a SD question to design a public chat room. For something large scale as quora, twitter, reddit, 4chan where users can pop in to a room anytime, read, send, like past/live messages and then exit the chat room, and also see a list of currently running chat rooms. Each chat room can have several 1000s of users at any time.

After laying out reqts-read heavy, where async delays are acceptable, immutable msgs with append only wide columns as a persistent store sharded on chat_room_id.

Focused mostly on the read msgs part, proposed a write through cache, holding the last ~500 msgs in the cache and then run a timer every 2s to scan the web socket ids from another cache (backed by a let's call it socket relation table), dispatch the msgs on the sockets & mark the low water mark for the active clients on that socket relation table. Also TTL the cache to 2s.

The active clients will only see the last ~500 msgs, and if past history is required that will be fetched from the persistent store on demand. And then talked a few mins on book-keeping client entry exit, and also a few mins on ingestion flow.

I was unable to explain what happens when more than 500 msgs comes in \<2s. I proposed a time based instead of a count based cache. But follow up questions and me being on shaky ground. Had a reject. Any ideas?
