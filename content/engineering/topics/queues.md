---
draft: false
toc: true
description: "Brief notes on message queues for buffering traffic spikes, decoupling processing, and distributing messages to multiple systems."
title: "Queues"
linkTitle: "Queues"
---
# Types


message queues

# Advantages


- buffering traffic spikes
- Messages requiring expensive processing can wait in a queue while earlier messages are processed, reducing the risk of server overload.
- Queues can deliver messages to multiple systems, instead of the client having to send them to all the required systems.
- Queues decouple the client from the server by eliminating the need to know the server address.

Based on the different implementations of message queues, there can be different combinations of the following properties:

~ Guaranteed delivery.

~ No duplicate messages are delivered.

~ Ensure that the order of messages is maintained.

~ At least once delivery with idempotent consumers.
