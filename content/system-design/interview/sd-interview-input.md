---
draft: false
toc: true
title: "Sd Interview Input"
linkTitle: "Sd Interview Input"
---
---

title: "System Design Interview Input"

linkTitle: "System Design Interview Input"

other comment:

A senior SWE also has nuanced understanding of time and cost with regards to a project. When asked to design a system one of the first questions I have is about the timeline for implementation so I don't end up with something very grand that can't be shipped on time. A senior SWE is also cognizant of the tradeoffs between ideal-state (design dogma), costs (recurring server costs, engineering builder-hours) , and timeline. Demonstrating good navigation of the tension between these factors during system design questions (not a new grad requirement) will also signal seniority.

## Comments

> **kdn86** • [205 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m81hins/) •
>
> If you know what you're talking about beyond a sketch (e.g. Which caching solution would you choose here? Why that one over the others?), and if you can put together a system that seems reasonable for the challenge (not overly complex or simple, well-reasoned, and understanding the trade-offs). They're probably peppering you with questions to get signal on the former.
>
> track me
>
> > **dfltr** • [115 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m82iabe/) •
> >
> > It's kinda like system design is a T-shaped interview. Once there's enough signal to show that someone can draw the horizontal bar across the system, I try to pick the vertical slice of it that's either the most interesting in general or just the least-defined / least-confident part of the answer so far and see how the candidate breaks the flowchart down into clearly defined chains of input -> process -> output.
> **originalchronoguy** • [97 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m81j1yl/) •
>
> The drill down is necessary in my opinion. Most people prep and train based on some of the common system design tutorials -- design the next uber, twitter, netflix, or design a parking garage.
>
> On the surface, they get the high level overview. Some systems require queuing mechanism so often they throw an answer like Kafka , Celery, or BullMQ. But they really only know the generality from their prep. So when you drill down and give them requirements that the queue isn't mission critical, that it can be done FIFO, the candidate isn't listening to the interviewer's requirement. So when you tell them your process needs retries or doesn't care about retries if the 3rd party endpoint is down, many people freeze. It is more a judge to see if they were actually listening to the original requirements laid out. An example is intercepting an email for processing spam. You only get one chance. If the Spam filter is down, you still have to send the message to the recipient regardless in that short time frame. There is no need for retries.
>
> Ther other reason is to measure their depth of understanding vs spewing the bullet points they prepped for.
>
> > **Qinistral** • [28 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m8308jw/) •
> >
> > I agree.
> >
> > Buuut, there's also a sense in which a skilled interviewer/presenter can be thorough or anticipates enough the common gotchas and questions and includes the answers into their explanation that a drill down isn't necessary.
> >
> > Like I've interviewed some bad-ass staff candidates that kinda left me nearly question-less because their experience+intelligence+communication sufficiently covered everything ahead of time.
> >
> > And that should be a candidates north star. If all your interviews are getting lost in the weeds it might be because you're not presenting a clear enough solution ahead of time or not pro-actively explaining the choices you make and their justifications or trade-offs etc.
> >
> > But again just a 'north star', the typical interview, esp for non-staff, doesn't expect this level of home run, some amount of drill down is common and doesn't need to make you anxious.
> >
> > **loosed-moose** • [14 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m83ufeh/) •
> >
> > Damn am I that old that RabbitMQ is no longer in that short list?
> **ccb621** • [45 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m81hrxe/) •
>
> Communication. I want you to ask questions to ensure you understand the problem. If you make assumptions, note them. Yes, I may want to drill into specific component to better gauge your understanding or get clarification. This is what would happen during a team review, so shouldn't be unexpected during an interview.
>
> Again, I especially care about communication. It is easier for me to teach you system design, if I have to, than to teach you to communicate.
> **CoderPenguin** • [37 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m81rtk8/) •
>
> To add to the others, also remember this is a job interview, not a college exam. The goal is simply to convince the interviewer you'd be a good hire, you don't fail if you run out of time.  Your goal is to create an engaging discussion so the person on the other side says "yeah thats a personal I'd want to collaborate with". If you just talked for 30 mins straight with no discussion or engagement that's a much worse sign.
> **axtran** • [40 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m81jm3k/) •
>
> Thought process, experience, and whether you're just bullshitting.
> **Y3VkZGxl** • [14 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m81iqu0/) •
>
> My goal would be to get the most signal in the time I have available. If you're going down a path I won't get much signal from, I'm going to nudge you towards somewhere I will get signal.
>
> That could mean jumping around a bit if you're showing good depth of knowledge, or it could mean going deep on a specific topic if you seem keen to move on and avoid the details.
>
> You don't need to complete everything, you just need to leave the interviewer feeling confident that you have the skills and experience to solve it given enough time.
>
> Ideally every interviewer would approach this the same way. The reality is different interviewers are looking for different signals, may make assumptions based on signals they've seen already, or may interpret your answers differently and decide to go deeper on different topics.
>
> There's no perfect way to approach the interview, but it's totally fine to ask for feedback in real time and use that to adjust how you proceed.
> **Mountain\_Sandwich126** • [11 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m81lc5r/) •
>
> I look for
>
> - do you understand the problem
> - do you understand the underlying tech strengths + weaknesses
> - can you make pragmatic decisions based on the context provided
> - are you just cv crafting
> **\[deleted\]** • [9 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m81xnse/) •
>
> Experience. I don't want to see someone who memorized some terms or studied some diagrams. I want them to explain why they can't just have 10 backend instances with sessions on and why apps with static thread sessions don't work when scaled etc and how to solve that problem (like redis or a session hub server etc). Someone who understand enough about the architecture of computers, cpus, threads, ram, disk drives etc to understand how to architect scalable designs etc.
>
> And some real world experience.
>
> A lot of people can study architecture and no (from patterns) how to architect something decent, but not a lot of them actually understand why things are done a certain way or the problem that async code/threads cause with process based session on scalable environments.
>
> But imo, you don't get hired for a system design job without job experience from lower levels. I would never hire someone with no experience into a system design role, that just doesn't happen.
> **bobaduk** • [7 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m81s9x2/) •
>
> - Can you form a coherent mental model.of the problem
> - Are you making trade offs when choosing technology
> - Does your understanding of a piece of technology go deeper than surface level (hence the drill down)
> - How do you respond to being challenged on your ideas (ditto)
> - Can you communicate clearlly about complex technical matters
> **DangerousMoron8** • [6 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m834f56/) •
>
> This is because your interviewer is just another person, with different experience. They might know a lot about a certain area and they want to see what you know, because you will likely be working on it in the job.
>
> These SD interview "templates" that people sell are really just for less experienced engineers. Anyone can memorize those, it is theory and not application. You really need to understand every aspect about what you are talking about which usually means you have actually designed and built these types of systems in production and at scale.
>
> I am referring to my own experience with senior and staff level interviews. Expect to skip around.
> **cortex-** • [15 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m832ih8/) •
>
> Real talk: the "system design interview" is a bullshit vibe check interview that varies wildly from company to company, interviewer to interviewer. It's only recently that it's become a strange formula copied from bigcorp interview loops and popularized with books like cracking the system design interview.
>
> At worst people use this interview to excruciatingly bore down on people with technical minutia and edge case gotchas, or just to straight up haze them with super difficult questions to see if they flinch.
>
> At best, the system design interview is an honest appraisal of a candidate's ability to think through and communicate about an ambiguous technical problem.
>
> When I do system design interviews I'm looking for:
>
> - Does the person actually know what the fuck they're talking about? I've encountered people who just make things up on the spot, seriously. Don't pretend you know what something is if you don't.
> - Can they take some sort of ambiguous brief and break it down, ask questions, propose some ideas, and talk to me about it, accept some critical questions about their ideas, be willing to adapt and change their approach when given new constraints.
> - Can they communicate technical ideas clearly in a conversational fashion in a way that makes me want to work with them. I've interviewed people who just straight up argued with me, gave me a tedious lecture without accepting any feedback, or otherwise just weren't willing to talk shop about some silly interview prompt. A good meter to use is if the conversion was fun then you probably did well. If it was a grueling slog, then maybe not.
>
> I honestly don't care if they get to the "correct" or any sort of optimal solution to whatever the problem. That's not the point. The point is can you pass the vibe check. I've seen plenty of geniuses who crush technical challenges get rejected because they absolutely ooze bad vibes like pus from an open wound.
>
> Be a sincere person who's fun to talk to, and do your homework so you know what you're talking about. System design interviews are easy if you do this.
> **jeffbell** • [5 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m81hjrq/) •
>
> System Design interviews are intentionally underspecified. You shouldn't try to come up with the whole design based on the initial information but should ask good questions as you go.
> **titogruul** • [11 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m81kyba/) •
>
> See below my [my previous comment](https://www.reddit.com/r/ExperiencedDevs/s/oXLECYMSgB) on the topic. There is some more details in thread too, but let me know if anything catches your eye.
>
> I'm most familiar with Google's L6.
>
> For both L5 and L6 system design I'd throw an ambiguous technical problem with a couple of quarters horizon and ambiguity (I like migrations, but any high level problem would do really). The difference is for L5 i would expect them to map out the path. For L6 I would expect them not to only map out the path but also anticipate and address risks (technical, political, cross team, etc) especially as I throw wrenches at them and/or their approach. Communication is key: not only do I need to be convinced that they know how to address the problem, I need to make sure they can also deal with buy in, managers, partners, etc.
>
> > **Incorrect\_ASSertion** • [8 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m81na4q/) •
> >
> > How TF to even prepare for an interview like that?
> **NoIncrease299** • [4 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m81labm/) •
>
> Getting into specific issues is kinda sorta the point.
>
> Like yeah, we wanna hear a broad overview of how you'd develop a platform - but there'll be some key components that show a full understanding of the approach to the system to design.
>
> Last time I was on the other side of this; I was asked by my now good friend and immensely respected colleague ... let's build a system to run a sandwich shop. The drill down was "How do we know when we can't make a particular sandwich anymore?"
>
> That was a really fun conversation.
> **IrrationalSwan** • [4 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m81m1tw/) •
>
> For me it's much more about understanding how you think, whether you can defend your design in terms of tradeoffs involved, adapt the design to new information, communicate well,  react constructively to criticism and so on.
>
> Having strong technical knowledge and a design that doesn't suck are prerequisites to doing that, but honestly both these things tend to become apparent pretty quickly while I probe for the other things.
>
> It also pushes people off of the script they may have crammed in order to deliver, and gets to what they really understand.
>
> If the loop is setup right, hopefully you've already been vetted for basic technical competence in previous rounds, which is all that's required to lookup some reasonable design for something and parrot it.  (But much less than what if required to adapt, defend or explain it )
> **sigmoid\_balance** • [4 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m822s6k/) •
>
> Design interviews are based on open-ended questions. Ask a lot of questions to understand what the interviewer is actually asking you to build. Don't assume you are being asked to design the next FAANG, when they might want something extremely simple.
>
> A design interview is a very good way to asses the seniority of the candidate. The same question asked to a mid career and a very senior candidate will result in two completely different interviews. The very senior engineer will understand and discuss technical aspects (what everyone usually talks about), but not only - they will likely touch on business, legal, organization, etc aspects as well.
>
> Especially in a FAANG, avoid mentioning a list of technologies. Explain what the components in your design are supposed to do and avoid saying "I'm going to use this AWS service". A company doesn't want a sales pitch for cloud services, but instead wants to make sure someone who is in charge of choosing the technical implementation is able to reason on pros and cons.
>
> Also, and this applies to all interview types, don't copy stuff from the internet. The interviewer likely heard all that before and you're not very convincing by just being like all the others before you. Make sure you are able to discuss pros and cons of something you propose, not just tick a box by mentioning "load-balancer", "queue processing", etc.
> **the\_collectool** • [4 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m8jnjei/) •
>
> I asked this question months ago.
>
> The answers you are getting are pretty much a repetition of the ones you are getting: [https://www.reddit.com/r/ExperiencedDevs/s/iAbwwtup9r](https://www.reddit.com/r/ExperiencedDevs/s/iAbwwtup9r)
>
> > **\[deleted\]** • [1 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m8jzl7b/) •
> >
> > Thanks for linking this, it did not come up on my initial search on system design in this sub before I made this post. Though it is true that our question overlaps and there are many similarities in the answer, I think my question is more about getting to the interviewer's intentions whereas yours is more about how detailed of an answer to give and when to give (which I do have the same question as well, as shown in my comments). This is because I am noticing that unlike coding questions, where I have a pretty good guess of what the interviewer is looking for because it is such a set format, system design is so vast and interviewers could be looking for anything.
> >
> > That being said, I appreciate you link your post - approaching this interview style from another angle helps me understand system design interviews more, given how broad and vague it is
> **Comprehensive-Pin667** • [3 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m81uwmw/) •
>
> I want to know if you can build such a thing. The basic template can be learned in any youtube video in 1hr. So we ask questions to see if you actually know how to build stuff, or if you just learned the template.
> **DeterminedQuokka** • [3 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m8237q5/) •
>
> So a good interviewer is going to help you be successful. So if they are interrupting you to redirect there is a good reason
>
> Some options:
>
> - your brief structure overview is taking too long and they are grading you on the quality of the structure so if you spend 40 minutes on a general overview the score will be poor
> - they have a particular interest in a specific system. Usually it's because it comes up a lot for their engineers could be a lot of things
> - you have said part of something super smart/confusing and they want you to say the rest/clarify to get more points.
>
> The thing about these interviews is there will never be an answer that would work at all or even most of these interviews. I've worked at 4 different places that all use "design Airbnb" as the question. And they are all looking for different focus in the answer. A good interviewer will direct you via questions to the thing they are actually looking for.
>
> > **\[deleted\]** • [2 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m85r9fo/) •
> >
> > I see, that makes sense. I guess this would be easy with a good interviewer, but how do I pick up what the focus is for an interviewer that is not so good? I guess that means I would probably be screwed with a bad interviewer who is unable to communicate his focus clearly?
> **horserino** • [3 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m824kua/) •
>
> The main points I'm looking for are (in the context of sys design interviews for a backend/infra team):
>
> - That you can find a solution to a problem: Straightforward. I give you a task, some constraints and requirements and you come up with a solution. The problem to solve will probably have multiple things you need to work around to figure out an implementation. It'll never be simply an API in front of a DB. The solution doesn't have to be perfect or the most efficient, it just needs to account for whatever specific tricky details the problem may have. Good candidates ask a lot of questions here and the solution design becomes more of a conversation than a test.
> - That you can design some basic architecture and infrastructure around your solution. You have a potential solution to the problem, now what actual technology would you use and why. Why one DB instead of the other? (Sometimes the answer can be just "because I know how that works and I am not familiar with X". It's better than trying to bullshit). If it needs a cache why and what does it look like? What does monitoring look like? Deployments? How would it handle failures?
> - That you can react appropriately to new requirements or constraints. Like now that your system can handle X, what would you change if now we wanted it to do Y. What parts of the solution wouldn't work anymore? What would still work?
> - That you can clearly communicate your ideas. You ask questions when things aren't clear. That you're comfortable with discussing a technical topic through multiple angles and discussing details about it. That you have a good intuition on when it makes sense to describe something simply at a high level and when it makes sense to dig deeper into the details.
> - How you react to criticism. If I explain that your solution has X problem, how do you take it? Like if I am right and I explain it, can you understand the new info quickly and adapt the solution based on it? And if it turns out I am wrong, can you explain clearly how and why?
> - And the last one (and I'd say this is a pretty subjective one), whether you're just trying to bullshit your way through the interview. Everything else pretty much boils down to this. I want a teammate I can work with and trust in their work, regardless of seniority. The slightest sign of bullshiting quickly becomes a red flag. I'd much rather have a candidate who says "I don't know", "I'm not sure", "I'm lost here, can you point me in the right direction" than someone who tries to hide that they don't know something or act as if they did.
>
> So I think you're right in that a system design interview is very non linear. If a candidate starts rambling on a cookie cutter system design architecture, I'll probably cut them off to try and get them to focus on solving the problem first. I don't yet care about the infrastructure if you haven't figured out how the system should work. Conversely, if we've talked a lot about the problem and different solutions and approaches, I might cut them of to ask about infra related stuff. It doesn't mean that they're doing bad at all. It varies a lot from candidate to candidate on all stuff that is covered. It isn't by itself a sign of the interview going poorly.
>
> In my experience, the solution doesn't even have to be a "good" or realistic one. More than once with a candidate we've focused on far fetched approaches just for the hell of it, talk about what would be good/bad about it, as compared to some other solution or whatever.
> **flavius-as** • [3 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m82abi7/) •
>
> The candidate's ability to deal with change.
>
> No cognitive dissonance.
>
> He proposes a good solution, I challenge him, he is able to adapt.
>
> Software architecture is about change without overengineering.
> **Main-Eagle-26** • [3 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m82q6f7/) •
>
> If you sound like you know what you're talking about and can have a technical conversation.
>
> It's probably the best interview format there is for determining someone's experience level. Some people can probably bs their way through it with practice but not most.
> **Eire\_Banshee** • [3 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m82vjz8/) •
>
> Do you know the basics? Can you extrapolate requirements? Can you explain your thoughts clearly? Can you accept feedback gracefully? Can you stand your ground on arbitrary decisions (IE, don't flip-flop to try to say what you think I want to hear)? Can you articulate the differences in tech stack choices (IE, why mongo instead of postgres, etc)?
> **nsxwolf** • [3 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m83mwc1/) •
>
> Mostly they're looking at the clock and panicking about all the actual work they have to get done today. The interview is a very unwelcome distraction.
> **chesterjosiah** • [3 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m83pyd2/) •
>
> Some are looking for your ability to design the full system at a high level.
>
> Some are looking for your ability to dive deep into a particular area (usually one that ***they*** have spent significant time working on).
>
> Some are looking for both.
>
> You could ask up front, which the interviewer is most interested in.
>
> **More importantly:**
>
> A good system design interviewer is taking note of when your answers are "in the past I did X to solve problem Y" as opposed to "I would do X to solve problem Y". Experience building a thing is way more valuable than theoretical knowledge of how you would build a thing.
>
> So keep that in mind -- if you ever can tie in your actual experience, do yourself a favor and mention it.
> **nutrecht** • [3 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m855d4x/) •
>
> > But a lot of the time, the interviewer would stop me halfway and is more interested in drill down into a particular issue rather than completing the whole structure.
>
> Because if I see that you understand a certain subject I'm not going to let you talk about it for 30 more minutes. It's a waste of our time.
>
> I'm most interested in your ability to weigh the different trade-offs between certain choices. I don't need to hear you talk about elastic search for 30 more minutes when I feel you know enough about it, I want to know why you'd pick it over other options.
>
> A very large amount of devs I interview can regurgitate some shit they read online, but actually never were involved in making any actual choices. Reading a book and appearing smart is pretty easy, but I need to know you're not just "book smart". By the time I get to interview you, you've already managed to impress the people with no in-depth knowledge anyway.
>
> > This interview type feels very nonlinear
>
> Well yeah. It's a *conversation* after all.
>
> > I also freak out that they ask clarifying questions, thinking that I missed something and that's a point against me
>
> You need to get over that. You're not a junior dev anymore and we are not going down a "checklist" of shit. I'm trying to figure out what you know exactly and I have a limited amount of time to talk with you.
> **Antique-Echidna-1600** • [3 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m85fz1v/) •
>
> Just say repeatedly LRU caching BTREE. Interviewers love low latency data.
>
> > **ElliotAlderson2024** • [1 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m86tng1/) •
> >
> > That's fine until they ask what that means in detail.
> **incredulitor** • [2 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m82wkjg/) •
>
> Any particular niche you're working in?
>
> > **\[deleted\]** • [2 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m85s1qa/) •
> >
> > I am a Machine Learning Engineer, but the range of system design interviews for this role is wide because I think the industry definition of this role is not certain. I get a fair bit of typical system design interviews along with interviews on designing a system to scale a model. Then, there are 'system design interviews' that are straight up modelling questions, which are a whole other ballpark.
> **ballpointpin** • [2 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m83k1yc/) •
>
> Don't worry about non-linearity. Time is very limited, so as soon as interviewer has sufficient info, they should move on. If I'm convinced the candidate is flying through a question and there's no doubt they'd finish it, I will start throwing in one or more additional constraints to see how they would deal with it....or I just move to a new question.
>
> If you feel they're drilling down into a specific area, it could simply be them trying to understand the depth of your knowledge or understanding of the problem. Also, it could be an incredibly specific area the interviewer themselves has a good personal grasp of, so they feel more at ease asking questions and understanding your answers.
> **jonathanmeeks** • [2 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m83qdi0/) •
>
> Watch "Mastering the System Design Interview" by Frank Kane. It's on udemy.
> **loosed-moose** • [2 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m83ub24/) •
>
> We want to see how you digest a problem and ideate and discuss solutioning. Gives us a sneak peek of what it might be like to work with you
> **WickedProblems** • [2 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m83vc6c/) •
>
> You have to remember where you're asking this question.
>
> With that said, us normal developers and where I work in the mid-west at some no name saas company... the final interview is a panel. The dev director, manager, senior/architect and we bring usually a junior or mid so they understand the interview process.
>
> Which I've been to atleast 10+ of these grill and drill them about system design over the years.
>
> Half the shit they ask even I don't know. We've hired people who could answer these questions in depth and struggled on the job. We've hired people who couldn't answer well but we needed bodies to code and they ended up really good.
>
> I'm a mid level and tbh I'm confused too for that one day when I look for a new job.
>
> In my personal opinion, it just depends if you studied the right questions. This is my personal take on it. Some of these guys sounded so elegant in those interviews.
> **LogicRaven\_** • [2 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m83xfcx/) •
>
> The goal of the interview is that you provide enough signals for a positive hiring decision. Not to have a complete design or follow certain steps.
>
> The interviewer likely has seen designs for the interview tasks multiple times, they are not interested in the design itself. They are curious about your skills, trying to find your strengths and possible gaps. So they are probing different topics and might jump between different aspects of the design.
>
> You need to have technical skills to create the design, but also communication skills to show the stuff and to figure out what they are looking for. Ask questions and confirm uncertain things and your assumptions. Focus on figuring out their concerns and answer them, not on a complete design.
> **cristiand90** • [2 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m8502ct/) •
>
> They look to find out if you "actually" know or you just memorised the answers.
> **Charming\_Complex\_538** • [2 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m85g2w7/) •
>
> As an interviewer who has used system design myself, here are the things I would be looking for during a 45-minute discussion.
>
> - Ability to engage in a conversation to extract the necessary amount of detail from a deliberately vague description of a problem. Not extracting NFRs is a flag for a senior role.
> - Big picture thinking that identifies the critical higher order components and assembles them appropriately.
> - For senior roles, ability to use sketches to quickly help me understand their perspective.
> - Reasoning about choices by indulging in a discussion around pros and cons for alternate approaches. Not having alternates is a flag. Not being able to logically tie a choice to a functional or non-functional requirement is a flag.
> - Sound foundational understanding of components that are critical to this design. In some cases this is a DB, in other cases it is a queueing system, etc.
>
> As a candidate, I would therefore approach this as follows -
>
> 1. Spend 5 mins discussing the problem and clarifying the requirements. Get to numerical values for NFRs just to ensure you know what kind of scale the design is expected to handle.
> 2. Get to a very high-level sketch first showing the major components. Then add detail after you explain this high-level sketch. Try to talk through what you are doing and why.
> 3. Touch upon alternatives that you considered and discarded. Go into details if the interviewer is interested.
> 4. Write or sketch on a shared screen or whiteboard so the interviewer stays focused on your work.
> 5. Seek feedback to see where the details aren't sufficient for the interviewer and where they would like to dive deeper.
>
> All the best for your next one!
> **\[deleted\]** • [2 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m85lwma/) •
>
> - Critical thinking skills and problem solving unfamiliar problems
> - not over engineering problems
> - communication skills
>
> I've been giving system design interviews for maybe 8 years or so and this is usually what I look for and is on the rubric. We generally try to make it as conversational as possible, and caveat that it does not matter if you finish the entire exercise at all, it's all about the individual situations that a developer might find themselves in day to day and to make sure that they would make good decisions on the job
>
> EDIT: also, for more junior engineers, usually instead of watching out for over engineering, I look for the flip side of that i.e. a curiosity-driven mindset, and if they are open to learning and taking what they learn and apply it. Sometimes in more junior interviews, it's super positive signal if they don't know what a good technology would be for a specific task and they ask us, that's exactly what we'd do on the job too and that's great to see
>
> Honestly, for a more junior role, sometimes if someone is going through the motions like you said, yes it can be useful and I judge if it's a personal thing to keep organized, but sometimes I also definitely see people that lean on process way way too much, so I would be careful about that because that sounds like a yellow flag to me. That is probably also why the interviewers you've seen jump around, work is just not that structured day to day and they're trying to make sure you can handle that
> **Hey-buuuddy** • [2 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m85oa2g/) •
>
> They're stopping you to "drill down" into the details because they sense you don't understand them. That's a sign of a good workplace actually, as opposed to interviewers just validating high level design pattern by throwing around word salad.
> **\[deleted\]** • [0 points](https://reddit.com/) •
>
> I agree, however the feedback from my mocks is that I took too much time to discuss requirements before designing the system. I can spend the whole interview talking about requirements to be honest, especially with a very wide question like "design Instagram". So what is a good limit for this?
>
> > **\[deleted\]** • [1 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m86cvni/) •
> >
> > I agree, however the feedback from my mocks is that I took too much time to discuss requirements before designing the system. I can spend the whole interview talking about requirements to be honest, especially with a very wide question like "design Instagram". So what is a good limit for this?
> **mailed** • [2 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m8bopwj/) •
>
> I have no idea. In every system design interview I've left feeling like I completely fucked it up and got the job anyway.
> **Entyl** • [2 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m8grigo/) •
>
> I have done dozens of system design interviews and also have been the interviewee for a good amount as well
>
> Here are few tips on how I do them
>
> - Pretend you are talking to product(who know a bit about engineering) and you are gathering requirements. It is okay to miss a few things and have to ask later in the question, but if you miss to many or go straight into the solution, you will get a knock against you. Talk about MVP and Post-MVP work
> - After requirement gathering, act like you are designing a system and explaining it to peers that will work on it with(or for) you
> - If interviewers keep stopping you halfway, try to explain a bit more for following components. However, there is also a decent chance the interviewer is not trained well enough if they keep upending the interview to probe where *they* want to go. You are the lead in this meeting, they should follow you
> - Code minimally. Writing up some simple data structures for important pieces of data is fine. The more junior someone is, the more they are allowed to write code
> - The more senior you are, the more you should be leading the interview. Start wherever you think is best and make a logic path to explain the architecture. If you are applying to a senior+ role, please do NOT ask the interviewer "what do you want me to explain next?"
> - Make choices between different technologies and explain why you would choose x over y(even if you would always choose x)
> - For bonus points: If you are doing a back-end interview try to explain a little how the front-end would ingest the data and if you are doing front-end explain the basics of the API. Stick to your domain but show that you understand the contract
> - You will NOT complete everything in time and that is okay
> - I will always let the interviewee explain as much as possible before I start a ton of probing questions. People think differently and sometimes a solution that looked really wrong can end up being very good
> - I personally look for someone who has one or two strong opinions and can defend them. Hopefully I agree with them, but even if I don't, it shows me that they care a little bit and also will defend their ideas when someone shoots holes in them
> **phoggey** • [2 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m8b081n/) •
>
> It's completely subjective and made up on the spot. It's supposed be vague so the interviewer can just cast out anyone they want.
> **ammuench** • [1 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m849urk/) •
>
> I've done over 50 system design interviews in my last two years as a staff engineer, mostly focused on senior or higher level engineers, and I think the biggest thing I try to sort out during them is:
>
> 1. Do you know your basics
>
> As a web dev, I have a non-insignificant number of devs come in that only understand react and the "popular" library of the current point in time. The number of times I see devs jump immediately into `react-query` because it "does caching" for the "frequently-updating real time search" app we present as our prompt is really frustrating sometimes, and is almost always a big red flag for me. In a similar vein, I see folks recommend the last state management library they used very often. I respect the ones that say "I'm using this because it's familiar", I have concerns about the ones who tell me "well this is the best state management library out there". I think there is a class of software engineer who is really good in one particular pattern, probably to a senior level, but outside of that I think they'd struggle -- and I think it is my duty to suss that out during these interviews. If I ask you to justify a decision I expect you to give me solid reasons for it, even it's fairly high level (eg: "this library has broad support and is well adopted, it will give us the best DX and ability to hire for devs and ramp people up") or lower level (eg: "this library tackles this problem more effectively for XYZ reasons, anything else would be less effective") I think that shows you have an understanding somewhere in the stack
>
> 1. Can you properly assess needs beyond the barebone designs.
>
> We leave our system design prompt fairly undetailed in an attempt to get engineers to ask questions. Having done this for 13 years now, I think that's one of the most undervalued skills of a senior+ engineer. If we show you a list of results on a search page in a design with nothing else, I would expect a good engineer to ask about pagination/infinite-scrolling. If we only show a desktop design will you ask about responsiveness. Will you ask about minutia about how backend wants payload formatted or limitations of our API. I think there is a lot of wiggle-room in this space, but an candidate who doesn't even ask a single question to get clarity or push for more detail is usually a huge red flag for me at the senior level. We know design and product aren't perfect, I want to work with engineers who will explore those areas to get good details
>
> 1. How do you handle the unexpected
>
> I usually throw one random curveball in my system interview towards the end. Something like a "oh lets say product just said we had to show partial search results for conversion metrics" or "hey, what if our backend team said they would allow us to dictate the data shape of the API to make it more performant" or I simply just challenge them on a library or architecture decision from earlier. This is where I think I catch most candidates out. Some people double down on their decision being "the best" and they wouldn't change it no matter what -- which I think shows an inflexibility that will clash with the company at large. I've seen folks just be lost going off of the beaten path solutions. And I've seen engineers just properly explain their justifications, talk through alternatives, and say why they might push back but ultimately be able to adjust accordingly. That last group tends to be the ones I recommend for hire. Strong convictions held weakly goes really far in the senior+ role I feel.
>
> ---
>
> All in all, I think a system design interview is a bit dependent on how the interview reads things. While I've paired with other devs on them, we've both walked away with different opinions. I can sometimes find things completely disqualifying (eg: a candidate telling me there was never going to be a problem using search params as a cache key for a real-time results db, telling me that using nextjs was the only way to prevent leaking environment variables??), while others would see differently (eg: my shadow seeing that they solved a lot of curveball questions easily, they did well on their technical interview).
>
> I think they should be intended for senior or higher level engineers, and I think you should treat it as you would a detailed tech design with higher ups in engineering or product-management. Sometimes folks will fixate on the technical, sometimes folks will fixate on the functionality implications.
>
> They are definitely difficult interviews, and I think the best way to practice is to do some mock tech designs for yourself, then critique them. I often find myself building trello boards for requirements for a side project, then going back and re-evaluating those cards a few days later after sketching things out and thinking about it more and finding a lot of areas for improvement -- and that's taught me a lot through those iterations that have been invaluable for system designs in both interview and in practice
> **ElliotAlderson2024** • [1 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m86pmsc/) •
>
> I honestly don't understand why a senior role below staff even gets asked system design, much less hard gates the offer on it.
> **ummaycoc** • [\-1 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m81sxho/) •
>
> An excuse to down level you and pay less?
> **cballowe** • [1 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/m85a47k/) •
>
> Don't panic about finishing on time. During the interview I'm not necessarily looking for a complete discussion. I'm looking for how you think about the problems you might run into, how you approach mitigating them, and how you evaluate tradeoffs in various decisions.
>
> At many steps in the process there are constraints that affect whether a particular solution will be effective or which of some set of possibilities will be best. If you throw an answer at me without confirming the constraints or telling me which set of parameters indicated it was the right choice, I might just throw constraints that break that choice at you and see if you adapt.
>
> As an example, if you're about to insert a cache, ask about properties of the system that you'd need to know to determine whether the cache will be effective for your purpose and whether the resources required are reasonable. If you're picking a piece of off the shelf software for one of the components, tell me why you're picking it and what properties it has that fit the constraints of the system.
>
> Don't forget really basic questions like "where will this be deployed", "what are the users" as they might add some major constraints. And anything that might simplify the problem is worth asking. (Not system design, but on code problems, if the problem is "write a function that takes a list/array/vector/whatever of objects..." And you can do something clever if the list is sorted, you're welcome to ask "can I require that the list be sorted before my method is called" and I'll often say "yes, that's fine").
>
> Be prepared to drill down - if the biggest pain point in the system is likely to be I/O related, there might need to be some discussion of how that's handled. If load balancing or data sharding is required, understanding the strategies there, possibly even down to disk layout.
> **Leather\_Grand2896** • [1 points](https://reddit.com/r/ExperiencedDevs/comments/1i57tmt/comment/mnztfbc/) •
>
> Having been on both sides of system design interviews, I've found that interviewers are looking for much more than memorized solutions. Based on my experience, here's what actually matters:
>
> 1. **Clarification before solution** - Strong candidates always spend time understanding requirements and constraints before jumping into solutions. When I started using System Design School's framework for this, my interview performance improved dramatically because it forced me to gather requirements systematically.
> 2. **Depth beyond buzzwords** - As the top comment mentions, interviewers will "drill down" to see if you actually understand the components you're suggesting. I used to think naming technologies was enough (Redis for caching!), but now I know explaining *why* you'd choose Redis over alternatives shows real understanding.
> 3. **Trade-off discussions** - The strongest system designers don't present their solution as perfect but discuss the pros and cons openly. This shows maturity and practical experience.
> 4. **Adaptability** - Interviewers often introduce new constraints midway ("what if we need to support 10x the traffic?"). They're testing if you can pivot and adjust your design, not if you got it "right" the first time.
>
> What helped me most was practicing designs with actual implementation considerations in mind, not just theoretical diagrams. System Design School's templated to build on and Hello Interview's approach of building components while discussing trade-offs gave me both breadth and depth that pure theoretical resources couldn't.
>
> Remember that most interviewers aren't looking for perfection - they're looking for structured thinking and someone they'd want to collaborate with on real system designs.
