---
contributors: []
date: '2025-02-22T09:02:28.392283'
description: Default Description
draft: false
lastmod: '2025-02-22T09:02:28.392283'
summary: ''
title: Queues
toc: true
weight: 810
---

message queues


Advantages:
- buffering traffic spikes
- If a message has to be processed by some very expensive code, you may also hold them in a queue while previous messages are being processed so you don't overload (and potentially kill) servers. 
- Queues can deliver messages to multiple systems, instead of the client having to send them to all the required systems.
- Queues decouple the client from the server by eliminating the need to know the server address.
  

Based on the different implementations of message queues, there can be different combinations of the following properties:
~ Guaranteed delivery.
~ No duplicate messages are delivered.
~ Ensure that the order of messages is maintained.
~ At least once delivery with idempotent consumers.

- se
- sdfw


