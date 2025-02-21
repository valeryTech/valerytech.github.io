---
contributors: []
date: 2025-02-21T15:53:28.158302
description: Default Description
draft: false
lastmod: 2025-02-21T15:53:28.158302
summary: ''
title: Tik Tok
toc: true
weight: 810
---

Let's say you are not familiar with TikTok. What do you do next? Probably ask your interviewer, right? Even if you know the platform well, it’s wise to start by clarifying rather than assuming. The flow might go something like this:

**Interviewer:** Design TikTok.

**Candidate:** I’m not very familiar with the platform. Would you be able to give me a high-level overview of what we are looking for?

**Interviewer:** Sure. TikTok is a mobile app for video sharing between users. Basically, you can upload a video to TikTok, and you can view a feed of videos. You can follow other users and perform basic actions over videos, such as “like,” “favorite,” and “comment.”

### Note:

If this is still not clear to you, or you think your interviewer is still withholding functional requirements from you, by all means go ahead and ask more questions. In this example, it seems like the interviewer has given us a pretty good overview, so we can move into our steps for functional requirements.

###### 1. Identify the main objects and their relations

It appears there will be primarily two objects of interest: accounts and videos. What are their relations?

* Account -> Video

* Can post

* Can like

* Can comment

* Account -> Account

* Can follow

###### 2. What information do these objects hold?

Check with your interviewer, but we can have some basic information like:

* Account: username, description
* Video: description

Are they mutable? Good question for your interviewer.

**Candidate:** Can videos be changed after uploading them?

**Interviewer:** No, let’s assume that once a video is uploaded it will stay immutable.

###### 3. Think about the access patterns

Remember, we are looking for statements of the form “Given object X, return all related objects Y.” Check with your interviewer to learn what different access patterns are needed here. Example:

* Given a user, get all videos they’ve posted.
* Given a user, get their feed (videos posted by people they follow).
* Given a video, get likes/comments.

Then add the writes:

* Post a video.
* Follow an account.
* Like/comment on a video.

# Non-Functional Requirements

Discuss with your interviewer, but you probably want to optimize for performance and availability because of reasons that are similar to our Twitter example.
