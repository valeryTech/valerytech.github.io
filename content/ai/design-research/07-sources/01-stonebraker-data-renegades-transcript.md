---
draft: false
toc: true
title: "Data Renegades | Ep. #11, Contrarian Bets and AI Skepticism with Michael Stonebraker"
description: "A captured Michael Stonebraker interview tracing Ingres and Postgres, extensible data types, commercialization, research incentives, and practical career advice, with technical runtime exchanges linked separately."
linkTitle: "Data Renegades | Ep. #11, Contrarian Bets and AI Skepticism with Michael Stonebraker"
---
light mode

<!-- Navigation added during reassembly on 2026-09-30. Original source text is unchanged. -->

# Stonebraker interview source


The source note retains the original episode metadata, database history, research and career discussion, and interview closing. The technical exchanges are now together in [Database-centered runtime]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}#specialized-engines-and-dbos-from-the-stonebraker-interview). All passages remain attributed to the captured Data Renegades interview with CL Kao and Michael Stonebraker.

### transcript


**CL Kao:** I'm CL, CEO and founder of Recce and your host on Data Renegades. Today, our guest is Mike Stonebraker.

Mike is a computer scientist who has shaped the way the world stores and manages data for over 50 years. He created Ingres and Postgres, which became PostgreSQL, now arguably the most important database in the world.

He has founded more than 10 venture backed startups as well. Well, Mike, thank you so much for being here. Welcome to the podcast.

**Michael Stonebraker:** My pleasure.

**CL:** Well, I can't tell you how pumped I am, talking to you on this podcast because, you know, I'm a computer science dropout and you are a Turing Award winner. So thank you again.

I wanted to start with your journey. Everyone talks about the Ingres and Postgres period and I think at one point you joked about that being kind of your hustle, for being a fresh assistant professor fighting for tenure. But you read a paper on designing the first working relational database. Did you have any sense how big this would become at the time?

**Michael:** Oh, absolutely not. I was just intent on getting tenure. I mean, as I say, when you take an assistant professor position, even now you're given five years to prove that you have research chops. And I was betting the ranch on Ingres.

And my colleague Gene Wong was the one responsible for suggesting we read Ted Codd's original 1970 CACM paper and this was the next year. And we also read the codicil proposal, which is probably way before your time. And codicil proposal, I couldn't understand how anything that complicated could be good. And it had all kinds of horrible properties.

Like the minute the schema changed, you had to redo the entire database. And so Ted Cod's ideas made a lot of sense. And it was obvious that what would make sense would be to try an implementation. And so we did. And the only thing that's different is that a lot of people, you know, get prototypes to where they can make them work but no one else can.

And so that's the first 90% of the effort. The second 90% is getting it to where other people can use it. And we kept going and putting in the other 90%. And so we got to where Ingres was readily usable and we had maybe 100 installations running it around the country. And the rest is history.

**CL:** Right. Maybe walk us through kind of the leap from Ingres to Postgres. What was broken about Ingres that made you almost start over?

**Michael:** Well, it turned out Larry Ellison in 1979 said that Oracle was 10 times faster than Ingres, when in fact it didn't even run at all. And that got my hackles up. Also, we got asked by everyone who visited Berkeley, what's your biggest installation? And we'd be forced to admit not very big.

And this was made crystal clear in 1979 by Arizona State University, which wanted to put their entire student record system onto an Ingres database. And they could get by that-- You had to get this unsupported database system from these goofy professors at Berkeley. They could get by that you had to get an unsupported operating system, namely Unix, from some folks in North Carolina.

But the project came to a screeching halt when they realized that there was no COBOL available for Unix and they were a COBOL shop. So, unsupported operating system, unsupported database system, no COBOL basically doomed Ingres to be a curiosity. And the only way around that was to start a company. And so we did.

And so Ingres Corporation, as it turned out to be called, was started in 1980 and they had 10 engineers working on the code. They moved it to deck VMS and started adding features. And it was crystal clear that we couldn't compete with that. The academic research project had to do something else.

What got my interest up was it turned out that one of the original use cases for Ingres was supposed to be geographic data. You know, that's point lines, polygons, point in polygon, all that stuff.

**CL:** Yep.

**Michael:** And of Course in a relational database system, that stuff, you know, worked horribly. I mean, it was incredibly slow. And a simpler use case, which was brought to my attention a little bit later, but it's easier to explain, is that I got a call one day from a programmer at one of those large investment banks.

And this was after the commercial version of Ingres had just implemented date and time. And so the ANSI standard was about to come out. And so I said, "what do you mean? We implemented date and time according to the Gregorian calendar, which is what the standards say, so what's wrong with it?"

And the guy proceeded to explain to me that at least at the time, in his corner of the bond market, you got the same amount of interest on a financial bond during every month, regardless of how long the month was.

So what he wanted was he wanted to take the date sold, subtract it from the date bought, and multiply it by the interest rate. But of course that got the wrong answer. And so he said, why can't I overload subtraction and use a calendar of 360 days divided into equal lengths? And of course Ingres wasn't written that way.

And so that plus the previous example of wanting geographic types made it clear to me that you had to support what came to be called user defined types and user defined functions. And it was crystal clear that wasn't going to be put into the commercial system anytime soon.

So the academic project, you know, threw everything, threw the academic Ingres code off the cliff and started building Postgres.

**CL:** Right, and then that was actually before SQL, right?

**Michael:** Yes.

**CL:** So this is its own DSL, right?

**Michael:** Yes.

**CL:** Okay.

**Michael:** But this was a Quell based system. And one of the things that's kind of interesting was that Oracle Corporation started a year earlier than we did. And so they had kind of a little bit of a head start, but we were gaining traction against them and winning a lot of deals.

And that abruptly stopped in 1984 when IBM released Db2, which Oracle had a SQL system and we didn't. And although we got SQL within 18 months, the damage was done and Oracle rocketed ahead. So the only reason Ingres and Oracle didn't change places in the commercial landscape was Db2.

**CL:** So Postgres was created like almost 40 years ago, but at that time you kind of moved on to work on early like columnar store or stream processing database, among others. Right? And then meanwhile the community kind of picked up and added a SQL to Postgres to become PostgreSQL.

**Michael:** Well, that's not quite right.

**CL:** Okay, tell the story.

**Michael:** What happened was Postgres was a Quell based system. And in 1994 two Berkeley students, Jolly Chen and Wei Hong, picked up a SQL parser and created PostgreSQL. That was done by the academic project.

Then in the miracle of open source, of the way open source is supposed to be, this pickup team of programmers who had nothing to do with Berkeley, who I didn't know, picked up the public domain Berkeley PostgreSQL and ran with it and have been running with it for the last 30 years.

> And I think that Postgres is the only database system that is not controlled by some commercial venture. And I think it's the way open source is supposed to work.

**CL:** Yeah, totally. It just feels so amazing that you weren't like really directly involved in that transition. Right?

**Michael:** No.

**CL:** And then how does it feel like watching kind of like a child grow and like growing up without you? Or is it exactly what you expect for open source, like you say?

**Michael:** Well, I mean at the time I was involved in commercializing Postgres with a different venture. And so the fact that some other people picked up the Berkeley code line I thought was wonderful. And so, I mean it didn't at all conflict with what we were trying to do and so it was totally independent of me or the commercial Postgres company.

<!-- Navigation added during reassembly on 2026-09-30. Original source text is unchanged. -->

## Research, commercialization, and careers


The preceding [specialized-engine and DBOS discussion]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}#specialized-engines-and-dbos-from-the-stonebraker-interview), [NoSQL and compiler exchange]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}#nosql-sql-optimizers-and-transactions-from-the-interview), and [text-to-SQL, RUBICON, and benchmark discussion]({{< ref "ai/design-research/05-runtime-and-execution/02-database-centered-runtime" >}}#text-to-sql-rubicon-and-benchmarks-from-the-interview) are now together in the database note. The interview resumes below with the complete venture, research, career, and closing exchanges.

**CL:** Yeah. So I wanted to kind of ask you about your kind of like the venture side of things because I don't think I know anyone that started more than 10 companies. And you had a lot of bets, a lot of them came from academic. But which idea have you killed along the way that you didn't think was worthwhile turning into a venture?

**Michael:** I think--

> I have this philosophy to only work on stuff for which somebody cares what the answer is. I mean that's the difference between theory and systems. And so everything I've done has been because somebody was interested in the answer.

We commercialized a system called Morpheus back in the late 90s and that turned out not to go anywhere. I mean that was a wide scale data integration project which didn't really work very well.

> I think the problem with data integration is the data is always dirty and the cost of cleaning it is really, really high.

And so my ideas in that area haven't, haven't been very successful. And I think, you know, StreamBase was ahead of its time. You know, it got an exit, but it wasn't a very good one. I think Vertica was very, very successful. Postgres was very successful. Ingres was very successful. Vertica was very successful.

I think Tamer is still a private company, but I think it will be very successful and I have high hopes for DBOS. I think that will be very successful. And I think the gist of DBOS is that the world is working on foundation models, but I think the big boys are going to win that battle because they have 100 times more money than anybody else.

And that infrastructure is where the big play is, which is what DBOS is doing. And a bunch of other companies are providing the underpinnings underneath foundation models. So I think that's where the real action is. And so I'm a big fan of companies in that area, which is again, kind of contrarian.

**CL:** Not chasing the fad. Right. And then I think this is like such inspiring wisdom. You only work on things that people care about answering. Right? And then you famously, I think, say that the best way to get your idea into real world is to start a company and threaten the elephants.

**Michael:** Well, I think the-- Well, two things. One is most academics, you know, it takes shoe leather to go find real world applications. And that's, you know, painful. You know, like getting access to 4 real world data warehouses was a huge pain in the butt. And I think, you know, going to that level of effort is something almost nobody is willing to do because you get rewarded for writing papers, not for making sure that you're doing something that people care about.

> So I think the whole academic field is moving into what I call least publishable units, which is working on problems that are easy to solve, not problems that are important and for which who knows if anyone's interested. And so I think for some reason I just can't do that.

First of all, I'm not a very good theoretician and so, I'm using my skills at what I'm better at, which is not theory. And so after you start a few companies, you get to know a lot of people. And so I can talk to a lot of people and they all tell me where their pain points are. And that's incredibly helpful.

**CL:** Yeah. Solve hard problems. So I think like over the years you've trained like generations of engineers and researchers at both Berkeley and MIT. What's your advice for someone kind of relatively new to data or their career? What should they learn and what should they ignore?

**Michael:** I have a whole bunch of reactions.

> First of all, I think 90% of all enterprise programmers are doing maintenance. And I think figuring out how to get Claude to do maintenance for you in an existing system is really something that could bear a lot of fruit.

And I think the problem is that-- Here's my cynical way of describing how real development works. You started out 30 years ago with a green field and you wrote something fairly clean and that it has been migrated and patched and extended and changed once per year since then. And it's now a complete mess.

And it's difficult to do maintenance on code that's a complete mess. It remains to be seen how successful Claude would be, but I think that that's something, you know, apply LLMs to something important I think is first piece of advice.

Another piece of advice is there's no reason for me to believe, again, this is my cynical view of things, that you start off with-- You have a big application doing something or other and it's split up across groups until you've got four or five groups or more working on any given release.

And so you have to coordinate between all of them. And you start off with management saying, I want this implemented as quickly as possible with minimum budget. So the way to do that is to make a current mess a bigger mess.

**CL:** Yeah. Cheap, fast, good. Haha.

**Michael:** And so I think somehow that has to change. And so I would be working on how you can cost effectively, inside the enterprise, not just pile band aids upon band aids. I think schema evolution is a huge problem, which is what we're talking about. And I think somehow getting better at doing that--

The other thing one of my good friends is Andy Palmer, who used to be the CEO of Tamer and Vertica. And for a while he worked at Novartis, the drug company. And his whole shtick was you want to outsource everything that isn't your crown jewels.

There's no reason in the world why anybody is running their own email system for example. So MIT is running their own email system and that's the dumbest thing on the planet. The lab I'm in, CSAIL, is also running its own email system.

> So go through and figure out what your crown jewels are and try and outsource everything else. You know, try and knock down the amount of stuff you've got to deal with.

If you're in the research racket and you have a PhD, get an academic job at the absolute best place that you get an offer. When I took an academic job, I accepted the offer at Berkeley, which was by far the lowest paid position. So bank on high prestige and low pay because that will get you the best students.

**CL:** Right.

**Michael:** Because without good students you have no chance of doing anything. And then get a mentor like Gene Wong was for me, who can help you get going. So somebody who knows the ropes. So don't take any position where you're the only person in an area because that means you don't have a mentor.

And if you absolutely have to, figure out how to deal with that. So for instance, when I arrived at MIT in 2000, there was nobody in databases, no courses, no faculty, no students, no nothing.

**CL:** Wow you're bootstrapping that. Haha.

**Michael:** And so what I did was, well, Brown, Worcester, Polytech, Brandeis, UMass Boston, all had database presence. So we formed a multi campus research group in effect and that allowed us to get going. But figure out how you can get a research group off the ground.

And if you're in industry, my point of view is go work for a startup. There's absolutely no downside to doing that because if you fail, you can just go get another job and you'll get much better experience than if you work for one of the big boys.

And I think the only counterexample to that is the big web platforms have all the data and they don't share it with anybody. And so if you need to do cloud oriented research, you pretty much have to work for one of the big boys. I don't see how to get the data any other way.

**CL:** Yeah, thank you for sharing the wisdom. I think this is clearly the thing to pick the important thing, prioritize, execute, regardless of the field. Right? So thank you for sharing that.

**Michael:** Sure.

**CL:** One thing I want to ask before we go into the lightning round is that, well, you are like 82 and still starting companies, publishing papers and then fighting with incumbents. What keep you going? What's kind of the motivation for you?

**Michael:** I would be bored to tears otherwise. I'm always expecting to run out of ideas and become irrelevant. And when that happens, I hope I have the good sense to vanish into the sunset like a lot of people my age have done.

But until that time, I like what I'm doing, I'm having fun, and I don't really have any interest in spending my life on the golf course. And hanging around MIT, it has some of the smartest people on the planet and they really keep you on your toes, which I really like. So I can't imagine going off to a gated community in Florida or any such thing.

**CL:** Yeah, and then, well, the ideas keep flowing and then you keep having new ideas and then keep doing it.

**Michael:** So far.

**CL:** So, before we wrap, we're going to put you in the Data Debug round. so, very quick fire question, short answers. Are you ready?

**Michael:** Sure.

**CL:** Okay, first programming language you loved or hated.

**Michael:** Fortran.

**CL:** Love or hate? Haha.

**Michael:** I loved it. I mean, the first language I ever learned was Fortran. And of course Luddites, you know, like the first thing they learned.

**CL:** What is your go to data set if you're testing for something?

**Michael:** The dirty secret, which will be told to you by most of my colleagues is I don't really code, so the answer is, "not applicable."

**CL:** Okay, so depending on what their go to data sets are.

**Michael:** I mean I think the answer is there are 10 startups who I know people at, and depending on what I'm interested in, I get them to test out whatever I want to know.

**CL:** Right.

**Michael:** And also I get students to do it too.

**CL:** Right. And then you don't dictate what data set they use?

**Michael:** No.

**CL:** What's one lesson outside of tech that influences how you build and work?

**Michael:**

> Simplicity is the answer. It's always the answer. Anything that's complicated is unlikely to be a good idea.

**CL:** Wow, that's real wisdom there. Okay, what's your favorite podcast or book that is not about tech or data or anything in our field?

**Michael:** well, there's a lady named Heather Cox Richardson. I don't know if you know her. She's a professor at Boston College and writes a political historical commentary that I really enjoy a lot. So I read her religiously.

I think I read Apple News religiously. I read pieces of the New York Times. I keep up on current affairs. I read some technical blogs these days on agentic AI mostly.

**CL:** Thank you for sharing. Well, that's all we have today. Thank you so much, Mike, again, for being here on the podcast.

**Michael:** Sure, CL. Thanks for all the interesting questions.

<!-- Navigation added during reassembly on 2026-09-30. Original source text is unchanged. -->

## Captured page footer


The following library suggestions were captured with the original page. They are retained as source text, separate from the interview above.

### Content from the Library


May 26, 2026 Podcast

### [Data Renegades Ep. #12, Agent Orchestration at Scale with Maxime Beauchemin](https://www.heavybit.com/library/podcasts/data-renegades/ep-12-agent-orchestration-at-scale-with-maxime-beauchemin)


On episode 12 of Data Renegades, CL Kao sits down with Maxime Beauchemin to explore what happens when software teams start...

Apr 21, 2026 Podcast

### [Generationship Ep. #54, Human-like Memory with Vishakha Gupta](https://www.heavybit.com/library/podcasts/generationship/ep-54-human-like-memory-with-vishakha-gupta)


On episode 54 of Generationship, Rachel Chalmers sits down with Vishakha Gupta to explore the hidden infrastructure challenges...

Podcast

### [Data Renegades Ep. #10, Data Modeling Matters Most with Toby Mao](https://www.heavybit.com/library/podcasts/data-renegades/ep-10-data-modeling-matters-most-with-toby-mao)


On episode 10 of Data Renegades, CL Kao and Dori Wilson sit down with Toby Mao. They explore how real-world data problems at...
