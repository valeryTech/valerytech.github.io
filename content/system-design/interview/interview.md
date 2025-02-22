---
contributors: []
date: '2025-02-21T23:36:39.648300'
description: Default Description
draft: false
lastmod: '2025-02-21T23:36:39.648300'
summary: ''
title: Interview
toc: true
weight: 810
---

# Checklist

paper with checklist

(tool)
Ask your recruiter what software you'll be using for your interview and practice with it ahead of time. You don't want to be fumbling with the software during your interview.

# Advices | Principles | Tricks

(beginning)
What it’s like to walk into a system design interview
When beginning an interview, try to imagine what the interviewer is looking for. What are their goals for the session? How can you help them achieve those goals in a way that persuades them that you’ll be a strong hire?

Put simply, the interviewer's goal is to find enough data to hire you. Given the limited time available to them, an interviewer has to try to get enough positive signal about your ability so they can justify giving you a “hire” rating. In one hour you have to show your interviewer that you understand the fundamentals of a system (end to end). You also should be able to name and explain (at least at a high level) each part of the system, describe the tradeoffs you make, and find a solution.

>The best way to accomplish this is to imagine that you’re explaining a design doc to a group of more junior engineers. They will ask you questions about your decisions and want to know what you’re trying to solve. Anticipating these questions and your responses will set you up for success in the interview.

# Proactivity

Being proactive in a system design (SD) interview is essential to demonstrate leadership, structured thinking, and problem-solving skills. A proactive candidate does not wait for the interviewer to lead the discussion but instead takes charge, guiding the conversation effectively while remaining open to feedback.

✔ **Guide the Interview**: Set a clear structure and lead the discussion.  
✔ **Be Adaptable**: Accept feedback and modify your approach.  
✔ **Engage the Interviewer**: Continually check in to align on priorities.  
✔ **Explain Trade-offs**: Justify decisions with pros and cons.  
✔ **Communicate Clearly**: Structure your thoughts and articulate them effectively.

**Define a High-Level System Approach**
- **Set a Roadmap**: Before diving into details, outline a step-by-step process:
    - "I'll start with high-level architecture, then discuss data storage, API design, scaling, and trade-offs. Does that sound good?"
- **Propose an Initial Architecture**: Start with a simple design that meets core requirements.
    - Example: "I’ll begin with a monolithic service since the initial scale is low, but I’ll discuss how we can migrate to a microservices-based architecture as traffic grows."
- **Encourage Feedback**: Keep the interviewer engaged by asking:
    - "Does this approach align with what you had in mind?"
    - "Would you like me to explore alternative solutions at this stage?"

 Asking High-Impact, Non-Trivial Questions


## There is not one single best solution

> Always consider trade-offs especially in SD interview

In system design, there isn't a single "best" solution; instead, multiple viable
approaches exist, each with its own set of trade-offs. This is because system design problems are often complex and multifaceted.

For engineers new to system design, this complexity can be daunting. A common pitfall is approaching design challenges as if they have one correct answer, similar to solving a well-defined engineering problem. However, system design requires a different mindset—*one that embraces ambiguity and focuses on evaluating different options based on their trade-offs*.

Trade-off analysis is central to effective system design. It involves systematically comparing different design alternatives to understand their advantages and disadvantages in the context of specific requirements and constraints. By conducting a thorough trade-off analysis, engineers can make informed decisions that align with the project's goals and constraints.

## Creation Lens

Instead of finding (or “retrieving”) a solution, you are creating a solution. In this way, coding is akin to a science, while system design is more like an art.

(Mental Way)
Here’s another way to think about it. You aren’t solving a problem—you’re creating a map to help someone else find the solution. Instead of coloring inside some lines, you’ll need to draw the lines for someone else to color in. In a system design interview, there are no correct answers—though there are certainly incorrect ones—so there is nothing to solve. Instead, you’ll ask questions, make stuff, and explain how and why the stuff you made was reasonable.

>“Pretend it’s 1999, so a lot of the stuff we have access to today simply doesn’t exist. You and a group of your schoolmates are in your garage, hoping to make something. You're the most senior one there. You will design it and your friends will code it up, and the thing is: the Minimum Viable Product has to be completed by tomorrow. So, there’s no time to prep and no need to worry about the intricacies of system architecture that you don’t know. Just answer this: How would you design this system so your friends could code it up today, right now? **It doesn’t have to be pretty. It doesn’t have to be complicated. It doesn’t have to impress anyone. It just has to get done**.”

To succeed in a system design interview, you *want to collaborate with your interviewer*, try crazy stuff, and try more crazy stuff until the design “feels right.”

## Lean towards your strengths

What if your measurement of success in an interview isn’t what you say, but instead it’s what you get the interviewer to say? Imagine you say something that engages the interviewer’s curiosity so much that they have no choice but to follow up with a “tell me more about that.” If the areas you get them to dig into the deepest, are things you’re good at: congratulations you are doing the Jedi mind trick.

A candidate doing a system design interview will usually experience confusion. The interview format is so open-ended, you cannot know about everything they'll ask you. However, there will be opportunities to strut your stuff. There will be moments when they ask you about something you know very well, and when this happens put your shoulders back and flex your muscles on this topic.

## Two Types of Interviewers

We need to act differently with cold and warm interviewers (take strategies from interviewing.io website).


## There’s no right way to design a system

By now you’ve heard (or read) that 'there’s no right way to design a system," and you might think it’s true. But how do you know for sure?

Watch this video of two experts designing the same system side by side. By the time you’re done, you’ll have a practical example that proves “there’s no right way to design a system”. Pay attention, and you’ll notice how effective it is when you guide the interview toward your strengths and when you’re open about gaps in your understanding. The video is split into two parts.

> This is one of the most important lessons!


We have “rules of thumb” scattered throughout this guide. In those cases, they apply directly to the material. But in this instance, these rules of thumb don’t fit anywhere, because they apply to, well, everything.

## Interviewer behavior

As an interviewer, it’s hard to tell the difference between a bad candidate and a good candidate who is stuck.

> If the interviewer interrupts you, it's probably because you’re going off track.

If your interviewer interrupts you to suggest that you explore another avenue, then most likely you're designing the system in contradiction to what the interviewer expects. In this case, let the interviewer explain what they expect, and then you should ask clarifying questions to ensure you understand the new direction before moving on.

It’s fine if the interviewer asks you questions, but it’s a bad sign if the interviewer starts telling you how to do things. This is a negative signal because the interviewer feels that you need help to move forward, and this will lower your score.

### Prior experience affects both sides

In a system design interview, you may encounter two different situations:

1. The interviewer has read your resume and wants to see you demonstrate your experience in building something you’re familiar with. This should be easy because you can apply your knowledge from your current/previous position.
2. The interviewer has read your resume and decides to purposely challenge you by asking you to design something you have not worked on. In this case, don’t worry—just remember that “there is no right way to design a system.” Use your best judgment and industry knowledge to come up with something reasonable. Also, be honest about gaps in your knowledge and don’t be afraid to ask questions. Demonstrate that you are curious and willing to learn.  

    When the interviewer decides to challenge you with something new, it may be a topic that is based on their own particular expertise or skill set.

>[!tip]
If you know a little about your interviewer’s background, you should have a hint about what to expect, which can allow you to prepare a little ahead of time.

## Time management

It's more important to cover everything broadly than it is to explain every small thing in detail.

By the end of the interview, the interviewer is inherently asking themselves “Could this person get an MVP off the ground?” If the answer is “no”, then you’ve drastically reduced your chances of passing the interview.

## Approaching the problem

Whatever decision you make, explain **why**. In a system design interview, **why** is more important than **what**. For anything you say, be prepared to explain **why**.

>[!important]
>Your interviewer cares less about whether your design is good in itself, and more about whether you are able to talk about the trade-offs (positives and negatives) of your decisions.

Keep it simple. The first rule of distributed systems is that you should avoid them if you don’t need them! Always consider maintenance costs. People don’t build distributed systems for fun. If all of Google could run on just one machine, you can bet they would do it.

In other words, if there is a simple way to do things and a complex way to do things, aim for the simple path. Not because the simple way is more likely to be correct, but because you have to make more assumptions for more complicated explanations to be true.

Accept that there are some things that you will not know, and be ready to admit this to your interviewer. In the third core concept (below), we will teach you exactly how to say this without losing points in the interview.

## Design is an iterative process

Iterative process: Systems, in reality, improve over iterations. We often start with something simple, but when bottlenecks arise in one or more of the system’s parts, a new design becomes necessary. In some design problems, we make one design, identify bottlenecks, and improve on it.

Working under time constraints might not permit iterations on the design. However, we still recommend two iterations—first, where we do our best to come up with a design (that takes about 80 percent of our time), and a second iteration for improvements. Another choice is to change things as we figure out new insights. Inevitably, we discover new details as we spend more time working with a problem.

> Start with simple solution and evolve it during the interview to the MVP

At the risk of oversimplifying, we suggest that you *start small*. Just follow some rules of thumb depending on what you identified in steps 1 and 2. We can guarantee you that you’ll get a decent design. Then you can use the remaining time to iterate on it.

name it **First Pass**, Naive Design, Baseline Solution


collect only main features
components prioritization
draw only critical components

no premature optimization - follow the steps in this interview SD framework

prioritization of the components to further process

## Immutability Trick

tip 1. Here is one way to get unstuck during a system design interview: consider the immutable case. This is a practical way to dumb the problem down. Tackle the dumber problem, and then add in complexity after that. Considering the immutable case also helps with identifying bottlenecks, as well as with capacity planning.

## Other

(invention point of view)
“When you have a desired outcome (a truly portable laptop computer) but no clear solution in sight, that’s when you brainstorm, try crazy stuff, improvise, and keep ‘building your way forward’ until you come up with something that works. You know it when you see it. A great design comes together in a way that can’t be solved with equations and spreadsheets and data analysis. It has a look and feel all of its own - a beautiful aesthetic that speaks to you.”

The less code you write in a system design interview, the better.

Be prepared to adapt. Be flexible and ready to adjust your design based on feedback from the interviewer.

# Types of SD Interviews

Each company (and sometimes, each interviewer) will conduct a system design interview a little differently. Often, the differences are not important and you can prepare for all of them with the same material. But some interview types require different preparation.

## Product Design

Product design interviews (sometimes called "Product Architecture" interviews, or ambiguously "System Design" interviews) are the most common type of system design interview. In these interviews, you'll be asked to design a system behind a product. For example, you might be asked to design the backend for a chat application, or the backend for a ride sharing application. Often these interviews are described in terms of a "use case" - for example, "design the backend for a chat application that supports 1:1 and group chats" and frequently referred to by the most noteworthy company that uses that use case. For example, "design the backend for a chat application like Slack".

## Infrastructure Design

Infrastructure design interviews are less common than product design interviews, but still relatively common. In these interviews, you'll be asked to design a system that supports a particular infrastructure use case. For example, you might be asked to design a message broker or a rate limiter. Since these interviews are deeper in the stack, your interviewer will be looking for more emphasis on system-level mastery (e.g. consensus algorithms, durability considerations) than high-level design.

This guide **will** be useful for Infrastructure Design interviews, with a stronger emphasis on the Concepts section.

## Object Oriented Design

Object oriented design (sometimes called "Low Level Design") interviews are less common than product design interviews, but still occur at particularly at companies that use an object-oriented language like Java (Amazon is notable for these interviews). In these interviews, you'll be asked to design a system that supports a particular use-case, but the emphasis on the interview is assembling the correct class structure, adhering to [SOLID principles](https://en.wikipedia.org/wiki/SOLID), coming up with a sensible entity design, etc. For example, you might be asked to design a Parking Lot reservation system or a Vending Machine, but rather than breaking this problem down into services and describing the backend database you're instead asked to describe the class structure of a solution.

This guide is **not** as useful for an Object Oriented Design interview. We instead recommend (until we get to it!) [Grokking the Low Level Design Interview](https://www.educative.io/courses/grokking-the-low-level-design-interview-using-ood-principles).

# Interview Assessment

At the senior level, system design interviews are common.

The difference in levelling is most frequently the depth of the solution and your knowledge. While all candidates are expected to complete a full design satisfying the requirements, a mid-level engineer might only do this with 80% breadth and 20% depth, while a senior engineer might do this with 60% breadth and 40% depth.

> Remember that the top-level goal for your interview is to give your interviewer *sufficient confidence* to advocate for a hire decision. While the mechanics of your interview are important, they are ultimately in service of signaling to your interviewer that you are a strong candidate.

{{< callout warning "Remember" >}}
The most common reason for a candidate to fail a system design interview is not delivering a working system. This is often due to a lack of structure in their approach. We recommend following the structure outlined in the [Delivery](https://www.hellointerview.com/learn/system-design/in-a-hurry/delivery) section.
{{< /callout >}}

## Problem Navigation

Your interviewer is looking to assess your ability to navigate a complex problem. This means that you should be able to break down the problem into smaller, more manageable pieces, prioritize the most important ones, and then navigate through those pieces to a solution. This is often the most important part of the interview, and the part that most candidates (especially those new to system design) struggle with.

The most common ways that candidates fail with this competency are:
- Insufficiently exploring the problem and gathering requirements.
- Focusing on uninteresting/trivial aspects of the problem vs the most important ones.
- Getting stuck on a particular piece of the problem and not being able to move forward.

## High-Level Design

With a problem broken down, your interviewer wants to see how you can solve each of the constituent pieces. This is where your knowledge of the [Core Concepts](https://www.hellointerview.com/learn/system-design/in-a-hurry/core-concepts) comes into play. You should be able to describe how you would solve each piece of the problem, and how those pieces fit together into a cohesive whole.

The most common ways that candidates fail with this competency are:
- Not having a strong enough understanding of the core concepts to solve the problem.
- Ignoring scaling and performance considerations.
- "Spaghetti design" - a solution that is not well-structured and difficult to understand.

## Technical Excellence

To be able to design a great system, you'll need to know about best practices, current technologies, and how to apply them. This is where your knowledge of the [Key Technologies](https://www.hellointerview.com/learn/system-design/in-a-hurry/key-technologies) is important. You should be able to describe how you would use current technologies, with well-recognized patterns, to solve the problems.

The most common ways that candidates fail with this competency are:
- Not knowing about available technologies.
- Not knowing how to apply those technologies to the problem at hand.
- Not recognizing common patterns and best practices.

## Communication and Collaboration

Technical interviews are also a way to get to know what it would be like to work with you as a colleague. Interviews are frequently collaborative, and your interviewer will be looking to see *how you work with them to solve the problem*. This will include your ability to communicate complex concepts, respond to feedback and questions, and in some cases work together with the interviewer to solve the problem.

The most common ways that candidates fail with this competency are:
- Not being able to communicate complex concepts clearly.
- Being defensive or argumentative when receiving feedback.
- Getting lost in the weeds and not being able to work with the interviewer to solve the problem.

(interviewing.io point of view)
With that said, sometimes you’ll have an interviewer who is cold or not very collaborative. Dealing with these interviewers requires practice. The more senior you become, the more important it is to learn how to adjust your communication style to match your audience. We recommend completing mock interviews with a variety of interviewers to help you become a seasoned, fearless veteran of system design interviews.

# Interview Assessment (Other)

What your interviewer looks for, and what they don't

With this basic model in mind, let's consider the main elements that system design interviewers look for, and the elements that don’t matter.

What your interviewer wants to see
1. a broad, base-level understanding of system design fundamentals.
2. back-and-forth about problem constraints and parameters.
3. well-reasoned, qualified decisions based on engineering trade-offs.
4. the unique direction your experience and decisions take them.
5. a holistic view of a system and its users.

What your interviewer is not looking for
1. deep expertise in the given problem domain.
2. assumptions about the prompt.
3. specific answers with ironclad certainty.
4. a predefined path from the beginning to end of the problem.
5. strictly technical considerations.

## Understanding Fundamentals

You do not need to display deep expertise in the given problem domain. Interviewers want to see that you have a broad, base-level understanding of system design fundamentals.

Your interviewer will expect you to have knowledge of a wide range of basic topics, but they won't expect you to be an expert in any of them. For instance, you should understand the difference between SQL and NoSQL databases, their broad performance characteristics, and the types of applications each might be useful for (which we’ll teach you later in this guide). But you would not need to know how the internals of either type of database work at any kind of detailed level.

In spite of this, you still might be asked to design those internals! Keep in mind, though, that your answer doesn't need to be optimal or reflect real-world implementations. For example, if an interviewer asks you to design a database/SQL query engine, they're not trying to discern if you're familiar with the academic literature on query engines or discover how much time you've spent working on database internals.

Instead, they want to see how you would approach the problem based on what you do know, starting from first principles and collaborating with them. Your answer will probably not be anywhere near optimal, and that's OK! The interviewer will focus on the process, not the result.

## Problem Navigation

Interviewers want to engage you in a back-and-forth conversation about problem constraints and parameters, so avoid making assumptions about the prompt.
Initial prompts to system design problems tend to be intentionally light on detail. Many candidates make a mistake by extrapolating details from the initial prompt and crafting a solution based on those assumptions.

For example, imagine that the interviewer instructs you to design a "photo sharing service" with some minimally defined capabilities. This may cause some candidates to imagine that they're rebuilding Instagram and start designing around the assumption that all images will be relatively small, not examined closely, and that extensive compression to save storage and bandwidth is acceptable.

But the interviewer didn’t tell you to rebuild Instagram, so you’ll need to keep in mind that there are many different types of photo sharing services. The interviewer may have had in mind something like Imgur or Photobucket, sites that cater more to basic image hosting for the web. Or they could be thinking about something like Flickr or 500px, services built for photographers to show off their work in high resolution.

So how do you figure out what type of service the interviewer wants you to build? Ask them! A basic prompt leaves room for you to start a conversation with your interviewer about the system you're designing—what type of users does it serve, what type of traffic can it expect, what limits will it have? Demonstrating that you can think critically about the parameters of your service is the first step in any system design interview.

## Ironclad Certainty

Interviewers are not looking for specific answers with ironclad certainty. They want to see well-reasoned, qualified decisions based on engineering trade-offs.

Be very careful any time you find yourself responding immediately to a prompt in a system design interview. Even aspects of your design that seem insignificant need at least cursory consideration. Let’s use IDs as an example.

A candidate will often start a discussion of a data model with a statement like, "I'll use auto incrementing IDs," or "I'll use GUID here" as kind of a default approach to assigning IDs to data. In many applications, however, the type of ID you assign to your data has practical consequences.

Is this ID going to be exposed to users? If so, how long does it need to be to avoid collisions? If we auto-increment it, are we worried about the visibility that will give third parties into our traffic patterns or the possibilities of users guessing the IDs to each others' data? If it's intended to be shared, is it convenient to type? If you print it on a business card or a flier, does it contain characters that you could confuse for each other (e.g., “1” and “I”, “0” and “O”)?

You don't need to hold an inquiry for every minor detail, but always be sure to give some justification for the decisions you make and let your interviewer know how your decisions would change in different circumstances. System design problems don't have a single definitive answer, so interviewers just want to see that you can justify your answers.

## Choose your Own Adventure

Interviewers are not looking for a predefined path from the beginning to end of the problem. They want to see the unique direction your experience and decisions take them.
Coding problems usually have an expected path. Typically you'll begin with an obvious but inefficient solution, and then the interviewer will prompt you for a series of improvements. Those improvements lead you to increasingly efficient solutions until you finally arrive at the optimal implementation.

System design problems, on the other hand, resemble a Choose Your Own Adventure book rather than a linear novel. A complex system contains a multitude of sub-components, each one of which could serve as a design problem on its own. After you've sketched the overall layout of your system, an interviewer may decide to keep your focus on the big picture or dive into a deeper examination of one particular component.

The path your interview takes will be steered by your interviewer, but they're likely to take cues from the sub-problems in which you display interest or aptitude. In some cases they may explicitly ask you which part of the problem you'd prefer to focus on.

> Even if you're not choosing directly, you can still influence an interview's direction. As you talk your way through a solution, it’s OK to specifically note the parts that you have experience in and explain when you're making educated guesses. Your interviewer won't expect you to know everything, but giving them a better idea of what you do know will help them steer the interview in ways that reveal your strengths and problem-solving ability.

## Holistic View

Interviewers seek a holistic view of a system and its users.

When faced with a choice in a design interview, it's easy to focus on the technical details, but remember that computer systems serve human users, so you’ll want to anchor your technical decisions to the user experience they enable.

Suppose, for instance, that the image sharing service you're designing will require users to log in before uploading an image. In technical terms, you might want to avoid login to keep the database schema simpler, or you could introduce login to gather better metrics. An anonymous experience may be best for a public image-hosting site intended for quick turnaround and low interaction, while a logged-in experience offers the possibility of community features like commenting and sharing, personalized metrics, and the ability to restrict an upload to authorized viewers. You may want to take either approach or even both, allowing a limited anonymous experience with extra features for logged-in users.

{{< callout note "User Experience" >}}

{{< /callout >}}
The important thing is to discuss the possible approaches and their consequences for the user experience with your interviewer before making a decision. You can never go wrong by making the end user the driving force in your design.

# Flags

Think of red and green flags as signposts you can use to orient yourself in the interview. Green flags indicate that things are going well, that you're engaging with the interviewer and making a positive impression. Red flags warn you that you may be going astray and should try to get the interview back on track.

## Red Flag #1

You believe that to pass a system design interview, you should just “play the game, keep talking, and make sure nobody explodes.”

Following this quote’s advice has steered many interviewees in the wrong direction. There is no game, and talking for the sake of talking is one way to hang yourself with the rope the interviewer gives you. Also, if the goal is to not explode, well, you’re wasting your and your interviewer’s time.

## Green Flag #1 You communicate honestly about what you know and what you don’t

As we mentioned earlier, this guide will teach you the basic information that you’ll be asked about in 80% of system design interviews. Although these are great odds, you still may encounter a scenario that’s beyond your level of understanding. If this happens to you, don’t worry! Just engage in an honest dialogue with your interviewer, explaining when you lack certain knowledge or have gaps in your understanding. When you do have a sense of how to proceed, but you’re uncertain, you should communicate from first principles. Later in this guide, we will explain how to overcome that uncertainty and still score points with your interviewer.

## Red Flag #2: You find yourself pushing against interviewer feedback

Keep in mind that your interviewers use the same problems over and over again, and they frequently see candidates make the same mistakes. If they try to divert you from a course of action, it's likely because they've seen others flounder when using the same approach. You may be the one candidate in a hundred who finds a unique and better solution—we've had this happen before!—but carefully consider the odds before proceeding with a solution against the interviewer's advice.

With that said, there is an art to pushing back against your interviewer when the situation calls for it, and later in this guide we’ll teach you how and when to employ this strategy .

## Green Flag #2: The interview feels like a collaboration between you and the interviewer

When the interviewer offers feedback, you integrate it into your design. You ask probing questions and receive useful answers about the system you're designing, its users, and its traffic. **Try to establish a tone as if you were working through a problem with a coworker rather than proving yourself to an interviewer.** In the real world, when you’re assigned a project, you’ll have to ask a variety of people several questions to ensure that you fully understand the problem before making decisions. That’s what interviewers want to see.

## Red Flag #3: You skip over questions and ignore interviewer prompts, trying to move the interview ahead without addressing their concerns

It's OK to not know things—no one will have every answer—but it's better to admit that to your interviewer than to avoid the questions altogether. Your interviewer may be able to offer you a hint or help you reason about alternatives if they know you're struggling, but if you skip right ahead you'll miss the opportunity to provide them with any positive signal from that portion.

## Green Flag #3: Your role determines who should drive the focus and pace of the interview

If you’re looking for a mid-level position or below, your interviewer should determine the direction and speed of the interview. Given an initial overview of your design, they may ask you for clarification on some aspects of it. They may ask you to produce a more detailed design for one or more components. And they may also change the requirements and ask how you could adapt your solution to accommodate this new view of the world. Wherever they take the interview, follow along and focus on the areas they direct you to.

If you’re applying for a senior role (or above), it’s a good sign if you direct more of the interview. In junior system design interviews, the interviewer expects to drive the interview, but as you reach senior levels the expectation shifts to the interviewee.

>[!Anecdote from a seasoned interviewer]
​​Being overly confident and talking too much might count against a mid-level candidate. Some interviewers (especially off-script ones) love giving candidates more rope to hang themselves with, and then they ask specific questions that focus on what the candidate struggles with.
>
If your goal is to maximize a mid-level offer, not improve your "average passing rate" (i.e., if you are comfortable sacrificing some senior-plus chances to increase your mid-level chances), then you might be better off consciously "giving control away" to your interviewer.
>
Simply put, at the above-senior level an awkward pause will be held against you—that’s basically guaranteed. But at mid-level, most of your attempts to fill in an awkward pause may hurt you more than keeping silent.
>
Another way to think of it: when you are not leading the conversation, you signal that you’re not really far above mid-level. (But if you are comfortable at mid-level, this is not a downside!)

The saying, ‘Better to remain silent and be thought a fool than to speak out and remove all doubt’ can be true for mid-level interviews but not for seniors or above-senior.”

## Red Flag #4: You leave long stretches (several minutes) of silence multiple times throughout the interview

If you're struggling to provide an answer, give yourself a little bit of time to come up with something. If you're truly stuck, however, you should ask your interviewer for help. They can't tell that you're at an impasse unless you tell them, and you may waste valuable interview time while they debate whether it's been long enough to interrupt you.

## Green Flag #4: You take time to collect your thoughts and refine solutions before offering them up out loud/on the board

An interview doesn't need to be a continuous stream of consciousness, and it never hurts to sanity check your ideas before verbalizing them.

## Make a decision

A common failure point occurs when candidates don’t make decisions

Often, candidates will say things like: “we could use this type of DB, or this other, or that other, and these are some pros and cons…” and then they move on to another component. It’s a good practice to talk about benefits and tradeoffs, but then you have to make a decision. In the real world you have to make decisions—the same thing applies to the interview. If the interviewer challenges you with some questions, it’s totally fine to change your mind and alter the component (if you think there are better choices).

Don’t say.  We could use this type of DB, or this other, or that other, and these are some pros and cons…
Do say.  "We could use this type of DB, or this other, or that other, and these are some pros and cons… **And based on all these tradeoffs, I’ll use THAT type of DB.**"

## Brand Names

Interviewers want to identify “impostors”: people who just learned a few words and try to pass the interview.

*Don’t say things because you think you’re supposed to say them.* This often occurs when candidates name specific brands of technologies (e.g., “Kafka” or “Cassandra”). Not being familiar with specific databases or other components is fine. Be smart and don’t say brand names just for the sake of saying them.

Don’t say
Thumbs down icon
I’m going to use Cassandra...” unless you are VERY familiar with that, because the next question will be: “Why Cassandra and not some_other_db?

Do say
I’m going to use a NoSQL db because of [insert brief rationale].

Don’t say
I will use Kafka…” unless you’re prepared to explain how Kafka works. Don’t say “I will use Kafka” unless you are prepared to talk about other types of queues, because they may ask you: “Oh, Kafka, interesting choice. Why that instead of [some other queue]?

Do say
I will use a queue because of [insert brief rationale].

{{< callout info "Remember" >}}

{{< /callout >}}
Say the generic name of the component, not the brand name unless you are very familiar with it. Don’t say Kafka. Instead, say "a queue".

# Technical (kind of) Flags

## Red: Overengineering

A good interviewer also looks for red flags. Over-engineering is a real disease of many engineers as they delight in design purity and ignore tradeoffs. They are often unaware of the compounding costs of over-engineered systems, and many companies pay a high price for that ignorance. You certainly do not want to demonstrate this tendency in a system design interview. Other red flags include narrow mindedness, stubbornness, etc.
#todo and other engineering / architect practices and methods

Over-engineering or making rigid design choices.

# Model

blueprint evaluation

Candidate Evaludation
Code, Solve, Communicate

introduce real-world constraints, UX practices, working backward, time consideration (change of FR, NFR after time), user expectations, system dynamic (what can we do in future if there will be more users, changes in traffic, geopositions)
product approach

how can we be sure that this system does work?
system evaluation

## The System’s Users (End-Users)

**Role:** The **consumers of the system** who interact with the product.

🔹 **Key Considerations:**
- Who are the primary **users**? (e.g., general consumers, enterprise clients, developers via APIs)
- What are their **key expectations**? (low latency, reliability, security, ease of use)
- How does user behavior **impact system design**? (e.g., peak traffic patterns, read vs. write ratios)

# back-of-the-envelope estimations

You should check with your interviewer to see if they want to see you do some math or if they’d rather go into design.

>Tell your interviewer: ”It seems like we’ve identified the main requirements, we have an API in place, and we know how the distribution of requests looks. If I were designing this system for real, I’d probably want to do some back-of-the-envelope math to estimate the number of requests and average volume of data we need to store. Do you want me to do the math or do you want me to skip it?”

If they agree, you should assign these requests some ballpark numbers in terms of writes/minute and reads/minute. It really does not matter at all if you are right or wrong. In fact, you’ll most likely be wrong. Believe me, your interviewer doesn’t care. We just want to agree on some numbers so we can do some back-of-the-envelope math.

link to envelope estimations
