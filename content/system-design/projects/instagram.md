---
draft: false
toc: true
title: "Instagram"
linkTitle: "Instagram"
---
# Interesting Example


["System Design Mock Interview: Design Instagram"](https://www.youtube.com/watch?v=VJpfO6KdyWE)

[link to the question](https://www.tryexponent.com/questions/1303/design-instagram)

this is 'design Instagram' interview video. But it is not mock video.

Critique:

[@JovaCoder](https://www.youtube.com/@JovaCoder)

The title is a bit misleading. Although this video is a great explanation of how to design a system such as Instagram but this is far from a mock interview. It does not capture the essence of an on-site interview with an interviewer asking you to design a system where you are responsible for getting a buy in of your use-cases and requirements of the system by the interviewer. In this demonstration the requirements are perfect since they are made up by the only person attending the interview. Again this is great for designing a system and how to speak out loud about your design but not a mock interview. There is a big difference.

This approach is misleading and totally wrong. Almost the first 15 minutes are spent on APIs data models, etc etc before even getting into the problem. This strategy will not work will setup the interviewer for failure and you will be left with no time left. I suggest revising these videos to be more realistic. I have done Google, Facebook, and Amazon interviews about 5 times and I have never seen this be the way to go. The data model, APIs, and capacity calculations should flow organically on an as needed basis, they shouldn't use up valuable time. After you have successfully been able to solve a system design problem you can start worrying about these other elements as needed. What typically happens when you take this approach is you get into the design and don't have time to complete it.

I'm not versed in evaluating design interview questions. However, in a general design session, my first question would be what does designing Instagram actually mean?

- Users might have the outdated mind map that Instagram is essentially a bunch of posts. However, if you look how Instagram itself discusses itself, it's a few products: stories is the snapchat competitor, Reels is the TikTok competitor, Threads is the Twitter competitor, messaging... . You'd really want to design a system where all these products can co-live together.
- From a business perspective, Instagram is an ads business. Serving ads fast and well targeted is what makes the business money. Tracking and identifying signals for ads targeting is business critical and should get a lot of design considerations.
- From a competitive perspective, a system that can show a post is easily cloned and trivial these days. The competitive advantage and why TikTok is so competitive is the algorithm for picking stories to share makes TikTok so much more viral. There should be a lot of design thought on how you are going to design systems that analyze what your friends like, analyze photos/videos, etc.
- From a current hot topic discussion, thinking about connected vs. disconnected content is a big deal. Traditionally, Instagram used to focus more on showing connected content (your friends). Yet, the success of TikTok made Instagram re-evaluate to show more disconnected content. In another twist, Mark Zuckerberg talked about how really in messaging is a lot of valuable activity where you only interact with yours friends. This whole debate on connected vs. unconnected content goes deep both into UX and system design.
- From the creator perspective, they are looking at Instagram to create posts/reels with tools in the app and schedule/collaborate on them. They are a critical part of Instagram. And head of Instagram said that they'll be a big focus this year. A user may not see that. However, as an engineer designing the system, demonstrating that you understand the actual business needs seems important.

You also have lots of interesting sub-problems to talk about:

- Getting the feed to the user fast has a lot of smart optimizations. Finding the best story with all the signals and the possible choices in extremely fast times offers lots of opportunities for optimization strategies. E.g., what about pushing content to the app before the user even opens the app? Would you re-order the newsfeed in the app based on signals you can get by how the user is currently interacting?
- Designing a CDN that serves so much media across the entire world also has lots of interesting sub problems - or simply to only explain the high level working of a CDN.
- The social graph used to be a big point of discussion - how friends are connected to friends and so on. How that is modeled and signal is extracted could be an interesting sub discussion.
- What is the journey of an image? You might pre-process it in the app so that the upload is a smaller file size. You might re-process it again on the server in a pipeline. You might extract signal from the photo to figure out what it is about. You probably need a queue to scan/review images for really bad content (e.g. dead bodies or crime). You might want to push it out to different tiers of the CDN. To be fancy, if you know that the user's friend in Paris is going to look at the post, can you push the image already into the CDN cache near Paris?

I would have imagined if you were to spend an actual hour to doing a high-level design of Instagram, there'd be a lot bigger considerations and systems/pipelines that need to be designed rather than thinking about the columns of the post table.

# To Process


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

We need to support two scenarios at a high-level, one is to upload photos, and another is to view/search photos. Our system would need some [object storage](https://en.wikipedia.org/wiki/Object_storage) servers to store photos and some database servers to store metadata information.

Defining the database schema is the first phase of understanding the data flow between different components of the system.
