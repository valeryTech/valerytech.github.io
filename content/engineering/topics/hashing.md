---
draft: false
toc: true
description: "Brief notes and references on rendezvous and consistent hashing for distributing keys across servers while limiting remapping when membership changes."
title: "Hashing"
linkTitle: "Hashing"
---
# Hashing strategies

## Rendezvous Hashing


<https://randorithms.com/2020/12/26/rendezvous-hashing.html>

Rendezvous hashing - rank server set.

## Consistent Hashing


Consistent hashing is a way to effectively distribute the keys in any distributed storage system -- cache, database, or otherwise -- to a large number of nodes or servers while allowing nodes to be added or removed without incurring a large performance hit.

sources

<https://akshatm.svbtle.com/consistent-hash-rings-theory-and-implementation>

Additional reading source: interviewing.io.

Both strategies require a suitable hash function and preserve some consistency in mappings, such as mappings between clients and servers.
