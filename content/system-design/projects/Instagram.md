---
contributors: []
date: '2025-02-22T09:02:28.392283'
description: Default Description
draft: false
lastmod: '2025-02-22T09:02:28.392283'
summary: ''
title: Instagram
toc: true
weight: 810
---
Design common cloud client service as Instagram

todo next:
see data sharding (Twitter, Grokking)
see News Feed generation (Facebook, Grokking)
see CDN and load balancers
make blueprints of HLD

- sharding algorithm
- instagram sharding: <https://instagram-engineering.com/sharding-ids-at-instagram-1cf5a71e5a5c>
- instagram caching <https://instagram-engineering.com/making-instagram-com-faster-part-3-cache-first-6f3f130b9669>
- instagram caching and promises: <https://instagram-engineering.com/thundering-herds-promises-82191c8af57d>
- moving to multiple data centers: <https://medium.com/instagram-engineering/instagration-pt-2-scaling-our-infrastructure-to-multiple-data-centers-5745cbad7834>

- scaling instagram <https://www.youtube.com/watch?v=hnpzNAPiC0E>

some calculations: <https://medium.com/interviewnoodle/instagram-system-architecture-fdbec22e48ee>

article <https://instagram-engineering.com/what-powers-instagram-hundreds-of-instances-dozens-of-technologies-adf2e22da2ad>

article one: <https://towardsdatascience.com/system-design-analysis-of-instagram-51cd25093971>

scaling instagram from founder <https://www.youtube.com/watch?v=bLyv8zKa5DU>
some technical details <https://www.youtube.com/watch?v=E708csv4XgY>

- All the web and async servers run in a distributed environment and are stateless.

High-Level Design
We need to support two scenarios at a high-level, one is to upload photos, and another is to view/search photos. Our system would need some [object storage](https://en.wikipedia.org/wiki/Object_storage) servers to store photos and some database servers to store metadata information.

Defining the database schema is the first phase of understanding the data flow between different components of the system.
