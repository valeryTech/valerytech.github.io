---
contributors: []
date: 2025-02-21T17:37:47.882444
description: Default Description
draft: false
lastmod: 2025-02-21T17:37:47.882444
summary: ''
title: Streaming
toc: true
weight: 810
---

# Sources and Links

https://trueaccord.atlassian.net/wiki/spaces/DS/pages/815105668/Data+Streaming+overview

https://drive.google.com/file/d/1wyP1aUBAwhLLonENwIJjVXxXWyUfJ5nN/view
https://drive.google.com/file/d/1QeIte_uFbKYlPr4bIVuBVQCx1vWSb0l\_/edit
https://trueaccord.atlassian.net/wiki/spaces/DS/pages/815105668/Data+Streaming+overview

https://trueaccord.atlassian.net/wiki/spaces/DS/pages/815727051/Glossary

old. Streaming Platform overview [link](https://trueaccord.atlassian.net/wiki/x/jAHvNg)

local repos?
streaming/platform...

Sources:
"Data Streaming" space
slack channel

https://trueaccord.atlassian.net/wiki/x/\_QRmbg
https://trueaccord.atlassian.net/wiki/spaces/DS/settings/home

https://systemdesignschool.io/fundamentals/stream-processing
https://aws.amazon.com/what-is/batch-processing/
https://www.youtube.com/watch?v=1xgBQTF24mU

really interesting analysis
https://www.reddit.com/r/ExperiencedDevs/comments/183f70f/tradeoffs_between_batch_processing_and_streaming/

reviews:
https://www.kai-waehner.de/blog/2023/12/21/the-data-streaming-landscape-2024/

kai has also various use cases review
https://www.kai-waehner.de/blog/2024/11/28/data-streaming-in-healthcare-and-pharma-use-cases-cardinal-health/
https://www.kai-waehner.de/blog/2022/04/04/real-time-analytics-machine-learning-with-apache-kafka-in-the-healthcare-industry/
https://www.kai-waehner.de/blog/2022/03/28/apache-kafka-data-streaming-healthcare-industry/

kappa vs lambda
https://www.kai-waehner.de/blog/2021/09/23/real-time-kappa-architecture-mainstream-replacing-batch-lambda/
https://www.youtube.com/watch?v=j7D29eyysDw
kappa is a single real-time pipeline?

videos:
kafka summit conference

product RedPanda documentation
https://www.redpanda.com/blog/streaming-data-examples-best-practices-tools
https://www.redpanda.com/blog/data-streaming-architecture
https://www.redpanda.com/blog/batch-vs-streaming-data-processing
https://www.redpanda.com/blog/kafka-stream-processors

and many tutorials here
https://www.redpanda.com/blog/monetize-real-time-ads-gaming
https://www.redpanda.com/blog/build-inventory-management-flink-mongodb-redpanda

**Blogs**
Uber Engineering Blog. Articles regarding streaming and events.

## Books

"Grokking Streaming"
Hueske "Stream Processing with Apache Flink: Fundamentals, Implementation, and " examples?

on kafka:

For Kafka Streams
"Kafka Streams in Action" 2nd edition

# to sort

Stream processing approach frequently has been comparing with batch processing. So we can use it and find some definitive features and other things from this comparing. To do what?
(next ->) I can see that this comparison exists on two levels: 1. stream vs batch on communication level; 2. Kappa vs Lambda architecture;

Data Streaming Use Cases by Business Value

topic: streaming ETL?

also there is a topic of some foundations: `foundations-streaming` library and tasks from DeGoe. You can search for other fundamental things also.

# Community & Events

https://www.redpanda.com/streamfest #todo register

register fro https://events.confluent.io/5thingsyouneedtoknow2025

# Actions

write your own vision of current and future state of the streaming platform
ask other teams and people ...
communicate to them

collaborate

communication

topics:

* future problems

# Future Problems

prevention

practices

# Flow?

# Exercise One: "Vision Before Reference"

Without any prior research, challenge yourself to define "streaming", "streaming platform", and other key concepts: their characteristics, approaches, and typical components — purely based on your current knowledge and intuition. Work entirely from your current knowledge. Create an 'Ontology Map' (reflection: tried to systemize approach, #todo define) #todo rewrite this

Then compare these to industry-standard definitions.

What’s the benefit?
By contrasting your ideas with established definitions, you can:

* Build on your foundational knowledge.
* Advance your learning strategy

## Iteration One

Let's begin with the concept of a **"Stream."** The first defining characteristic that comes to mind is its **endlessness**—a stream flows without a defined endpoint. Another key feature is its **continuity**, where elements appear in a steady sequence without significant interruptions.

(try to draw it on the paper).
Producer emits messages to store.
These elements are messages or events depending on the level of abstraction..

**Contrasting** (comparing to existing)

As a senior backend developer, when we consider the concept of a **"Stream,"** the first defining feature is its **unbounded or infinite nature**—it represents a continuous flow of data without a predetermined endpoint. Additionally, a stream is characterized by its **uninterrupted continuity**, where elements are processed in a steady, sequential manner without significant pauses or delays. This seamless flow is essential for real-time data processing, allowing for efficient handling of data as it arrives.

Ok, we contrasted these. But what knowledge have we gotten? ...

Identify several use cases and corresponding user requirements. Analyze the limitations and shortcomings of existing approaches in these scenarios. Use the identified user requirements as a foundation to develop and justify the adoption of the streaming method.

 > 
 > Use Specific and Concrete Example

## Recommendation Engine Example (comparing approaches)

Other thing that came up: why one should use it? Which problems can it solve? Trade offs? So you can consider 'streaming' approach as a tool and approach to solve some problems.

near real-time insights

## Reflection

This type of exercise can be broadly classified under **reflective learning** or **self-assessment exercises**. The primary goal is to encourage learners to engage with their prior knowledge, articulate their understanding, and then refine it by comparing it with authoritative sources.

(other definition)
**Constructivist Learning Activity**
Definition: An exercise rooted in constructivist learning theory, where individuals construct their understanding of a topic before comparing it to shared or formalized knowledge.

Constructivism is the theory that says learners *construct knowledge* rather than just passively take in information. As people experience the world and reflect upon those experiences, they build their own representations and incorporate new information into their pre-existing knowledge (schemas)

reflection2: really use it helped me to understand that this kind of exercise 'create first, then evaluate and contrast to established standards' is already exist as a part of Constructivism Learning

### The Importance of Specific Examples

When attempting to compare streaming to other approaches, I found myself stuck with vague ideas and struggling to identify anything concrete. Even when I tried to create a diagram, it ended up being overly abstract, with generic producers, messages, and events—I couldn’t even name an intermediate buffer.

To address this, I decided to focus on constructing and using a specific, concrete example. This approach provided the clarity needed for meaningful comparison and better understanding.

these are example of

* **Case-Based Learning (CBL):** A method where insights are derived by analyzing and understanding specific cases or examples.
* **Experiential Learning:** Gaining knowledge through direct experience and reflection on specific situations.

^^ kind of bottom-up approach

# Dynamic Pricing Use Case

https://www.kai-waehner.de/blog/2024/11/14/a-new-era-in-dynamic-pricing-real-time-data-streaming-with-apache-kafka-and-flink/
https://www.confluent.io/events/kafka-summit-apac-2021/kafka-tiered-storage/

# RedPanda

## Analytics Use Case

In this track you will learn how to create a web analytics platform using Redpanda and Clickhouse.

Welcome back. In this lesson, we’ll discuss the reference architecture for building a cutting-edge analytics product. We’ll leverage modern technologies to create a powerful, scalable, and privacy-focused solution that can adapt to various deployment needs.

Hono
At the heart of our data collection process lies Hono, an ultrafast web framework for *edge computing*. Hono allows us to create lightweight, high-performance edge services that can handle incoming analytics data with minimal latency.

By deploying our data collection endpoint at the edge, we ensure that user interactions are captured swiftly and efficiently, regardless of their geographic location. Hono will serve the JavaScript snippet that collects user data and also handle the incoming analytics events, acting as the first point of contact in our data pipeline.

Redpanda

Once the data is received by our Hono-powered edge service, we’ll immediately forward it to Redpanda. Redpanda serves as a high-performance buffer between our data collection layer and our analytics database. This buffering is crucial for handling traffic spikes and ensuring data durability.

Redpanda's ability to handle millions of events per second with low latency makes it an ideal choice for real-time analytics pipelines. Also, its Kafka compatibility means we can leverage a rich ecosystem of tools and connectors while benefiting from Redpanda's improved performance and simpler operational model.

Clickhouse
From Redpanda, our data will stream into ClickHouse, a column-oriented database that’s designed for real-time analytics on large datasets. ClickHouse's architecture allows for blazing-fast query execution, making it possible to analyze billions of rows in milliseconds.

This capability is essential for providing real-time insights and interactive dashboards. ClickHouse also offers excellent data compression, reducing storage costs while maintaining query performance. By combining Redpanda and ClickHouse, we can handle massive amounts of data while providing near-instantaneous query results.

Grafana
To bring our analytics to life, we'll use Grafana, an open-source platform for monitoring and observability. Grafana will connect to ClickHouse and provide a rich, interactive interface for creating dashboards, alerts, and visualizations. Its flexibility allows us to create custom panels and graphs that cater to specific analytics needs, from high-level overviews to detailed drill-downs.

Grafana's ability to combine data from multiple sources also means we can integrate our analytics with other metrics and logs, providing a comprehensive view of our system's performance and user behavior.

Benefits
One of the key strengths of this architecture is its flexibility in deployment options. Each component - from Hono to Grafana - can be self-hosted or used as a managed service, allowing you to choose the approach that best fits your needs and resources.

This flexibility extends to the data collection layer, where companies can implement custom tracking solutions or integrate with existing analytics libraries. By providing this freedom, we ensure that our analytics platform can adapt to various privacy requirements, regulatory needs, and scaling demands. If you aim to run every component in-house, you can do that. If you want to minimize overhead for certain pieces (e.g. Redpanda or Clickhouse), you can swap in their cloud offerings.

Especially noteworthy is Redpanda's Bring Your Own Cloud (BYOC) service, which allows you to deploy Redpanda in-house within your own cloud environment. This approach ensures that your data remains secure and under your control while benefiting from professional management services provided directly by Redpanda's expert team. This model offers the best of both worlds: the security and compliance of an on-premises solution with the convenience and expertise of a managed service.

Summary
This reference architecture combines the speed of edge computing, the reliability of event streaming, the power of columnar databases, and the flexibility of modern visualization tools to create a comprehensive analytics solution.

As we progress through this course, you'll gain hands-on experience with each of these technologies, learning how to harness their individual strengths and integrate them into a cohesive, powerful analytics platform.

Whether you're building a privacy-first solution or a large-scale enterprise system, the skills you'll acquire will enable you to create fast, scalable, and insightful analytics products.

With this architectural blueprint in place, let's move on to the prerequisites.

We're trying to connect to the service, but it seems like it's not quite ready yet...  
Depending on the service you are trying to reach this may take a few minutes.

This page will try to reload once the service is available,  
or you can try to refresh the page yourself.

````
source ~/.bash_profile 
git clone https://github.com/redpanda-data-university/rp-use-cases-web-analytics.git -b instruqt 
cd rp-use-cases-web-analytics
````

**Create the ingestion endpoints**
Since the marketing website (which we intend to capture analytics from) is referencing an endpoint called /js in our Hono application, let's implement that.

This confirms that our data collection endpoint is wired up to our website, but it's not doing much yet. Let's modify the code to collect some information about the page visit.

**Collecting data**
Now, we want to collect the page that the user is visiting (`/pricing`, `/about`, etc).

Enrich the payload

In addition to tracking which page the user visited (`/pricing`, `/blog`, etc), there's more information that would be useful to collect. For example:

* The user's browser / client information
* IP address
* Approximate geolocation

While we needed to collect the page URL client-side (using the JS snippet we returned from the `js/` endpoint), we can collect the rest of this information from the server side.

Improve the formatting

This payload is starting to look pretty good. But thinking ahead, the highly nested structure of the client field could complicate the way we query and process the data later on. So let's add the following helper function to flatten the structure.

Finalizing the payload

Before we starting publishing this data to Redpanda and Clickhouse, lets add two more fields to the payload: `ip` and `country`. This is where our implementation gets a little Cloudflare-specific. While the main Hono application can be deployed to many different edge runtimes, the methods for accessing certain data points may differ according to the runtime.

The following methods for getting the IP address (`c.req.header("CF-Connecting-IP")`) and the user's country (`c.req.raw?.cf?.country`) in the code snippet below can be adapted accordingly if you decide to deploy your application to one of the non-Cloudflare edge runtimes.

What’s Next?
You have now completed one of the most important tasks for building an analytics system: collecting the raw data. In the next two chapters, you learn how to store this data in Redpanda and Clickhouse, and implement more advanced features, as well. See you in the next chapter!

# Chapter 2: Intro

In this lesson, you’ll create the Redpanda topic for storing user analytics, and then start writing data to it.

Setting Up Redpanda

We have included a local Redpanda cluster in the `docker-compose.yml` file. To interact with this cluster, we'll use the `rpk` CLI, which is installed alongside the broker.

To make the CLI available, run the following command to set an alias that points to the `rpk` executable.

With the `website_visits` topic created, we're almost ready to write the data to Redpanda. However, since Redpanda gives us a couple of different options for producing data, we need to decide which method to use:

* The HTTP proxy allows us to produce requests by submitting HTTP requests to Redpanda's REST API
* Kafka producer libraries write data using a different wire format

Since Redpanda includes the HTTP proxy inside its binary, and Javascript has native support for making HTTP requests, we'll pursue that option in this tutorial. Another factor influencing our decision is that npm modules don't always work as expected in edge runtimes, so we'll pursue the path of least surprise by simply issuing HTTP requests instead of using one of the Kafka Node modules.

It’s time to start producing data to Redpanda.

Producing to Redpanda
The [Redpanda documentation](https://docs.redpanda.com/current/develop/http-proxy/?tab=tabs-5-curl) includes many examples of how to interact with Redpanda's HTTP Proxy API. For example, to produce data to a Redpanda topic, you’ll need to issue a POST request to the `topics/{topic_name}` endpoint.

````bash
alias rpk="docker exec -ti redpanda-1 rpk" 
rpk topic consume website_visits
````

Now that the page visit data is flowing through Redpanda, we can do a couple of things with it:
Write the data to a data warehouse to visualize and query the data
Start building event-driven systems to utilize this data for various business use cases
We'll start with the first option and show you how to ingest this data into Clickhouse. Proceed to the next lesson to continue the tutorial.

Ingesting the data into Clickhouse

In this lesson, you’ll pipe the analytics data from Redpanda into a real-time data warehouse called [Clickhouse](https://github.com/ClickHouse/ClickHouse?utm_source=clickhouse&utm_medium=website&utm_campaign=website-nav).

Setting Up Clickhouse

Clickhouse is a popular analytics database that is great for low-latency queries on large analytic datasets. It's open-source and easy to get started with.

We've included a Clickhouse deployment in the `docker-compose.yaml` file, so it should have automatically started after you ran `docker-compose up -d` earlier. To verify that it's running, run the following command from the [Terminal](https://play.instruqt.com/redpanda/invite/q5vbkxkqrtuj/tracks/analytics/challenges/clickhouse-ingestion/assignment#tab-0):

then create database

````
CREATE DATABASE analytics;
````

Next, create a Clickhouse table that uses the Kafka table engine to read data from Redpanda into Clickhouse. The columns in the DDL statement below correspond to the field names in the payload we constructed in Chapter 1.

````
CREATE OR REPLACE TABLE analytics.web_kafka (
    url String,
    ip String,
    country String,
    ua String,
    browser_name String,
    browser_version String,
    browser_major String,
    engine_name String,
    engine_version String,
    os_name String,
    os_version String,
    device_vendor String,
    device_model String,
    timestamp DateTime
) ENGINE = Kafka SETTINGS
    kafka_broker_list = 'redpanda-1:9092',
    kafka_topic_list = 'website_visits',
    kafka_group_name = 'rp',
    kafka_format = 'JSONEachRow',
    kafka_num_consumers = 1;
````

A materialized view is a special type of view that stores the results of a query physically in the database, unlike a regular view which does not store any data and only represents a query. Materialized views in ClickHouse are used to improve query performance by precomputing and storing the results of complex queries, which can then be queried directly instead of recomputing the results each time the query is run.

Finally, set up a materialized view to query the data. Run the following command to DDL statement to create thie view:

````
CREATE MATERIALIZED VIEW analytics.web
ENGINE = Memory
AS
SELECT *
FROM analytics.web_kafka
SETTINGS
stream_like_engine_allow_direct_select = 1;
````

With the table and materialized view setup, the data can now flow from Redpanda into Clickhouse. Open the Marketing Website again and click around a few pages. Then go back to the Clickhouse UI, and run the following query:

````
SELECT * FROM analytics.web LIMIT 10
````

You should see multiple rows of data.

You can also run aggregate queries like the following:

````
SELECT COUNT() as count, country
FROM analytics.web
GROUP BY country
````

Note
If you experience any issues creating these tables, you can always check the Clickhouse system errors with the following query: SELECT * FROM system.errors;

Once you've confirmed that the data is flowing into Clickhouse, proceed to the next section to learn how to visualize the data in Grafana. We’ll cover this topic in the next lesson.

You've made a lot of progress in the last few lessons! Your Hono application is now collecting web analytics from the example marketing website, and this data is flowing through Redpanda and Clickhouse.

However, in order to extract even more value from our analytics data, we need a way to visualize it. Fortunately, Clickhouse integrates with many different data visualization tools to enable this functionality.

For this tutorial, we'll be choosing a well-established open-source option for visualizing our data: Grafana.

grafana -> connections-> "ClickHouse" -> install

Next, click **Dashboards** in the left navigation, then click **+ Create dashboard**, and finally, click **Add visualization**.

Select your new Clickhouse connection, and then from the SQL Editor tab, type in the following query:

````
SELECT timestamp AS time, country, count() AS requests
FROM analytics.web
GROUP BY country, timestamp
ORDER BY timestamp
````

And that’s all there is to start visualizing your data. From here, you have limitless possibilities thanks to Grafana's wide range of chart / visualization types.

We won’t go through the process of building an entire analytics dashboard, but the process should be clear now. As an exercise for the reader, try adding a few more visualizations in Grafana by writing some additional queries. Some examples of visualizations you can add include:

In this lesson, you’ll make some slight updates to the data collection script to improve the response times and modularize the code for producing data to Redpanda. This will pave the path for storing session recordings in Redpanda and Clickhouse.

Async ingestion
One of the benefits of running our analytics service on the edge is that our code for collecting information is deployed close to the end user. This allows us to initiate data collection very quickly after a user visits our website.

However, depending on where your Redpanda cluster is deployed, the cluster itself may not be geographically close to the user. Consequently, producing data to Redpanda may incur a few hundred milliseconds of additional latency.

The current implementation of our `track/` handler won't return a response until after the data is produced to Redpanda. This is okay, but session recordings can generate a lot of data. If we can minimize the number of open requests that clients are waiting on at any given point in time, we can mitigate certain types of client-side performance issues.

Let's address this performance concern before we implement session recordings.

Preparing Redpanda

Let's make a slight modification to our code so that we can return a response to the client right after receiving the analytic events. We’ll then produce the events to Redpanda in a non-blocking way to improve our service's response time and address the issues mentioned above.

To accomplish this, we can use a built-in function called [waitUntil.](https://developers.cloudflare.com/workers/runtime-apis/context/#waituntil) This function takes a promise that will continue executing even after a response is returned to the client. It’s basic usage looks like this:

By using `waitUntil`, our service will acknowledge tracking requests much faster. Also, by creating a dedicated function for producing data to Redpanda, we can now avoid some boilerplate when producing data from new endpoints (e.g. the upcoming session recording endpoints).

# Session Recording

Many third-party vendors offer session recording as one of their most advanced features. Unfortunately, this feature also raises some data privacy concerns.

The idea is that whenever a user visits your website, everything they do, from mouse movements, clicks, to keystrokes, is recorded so that it can be replayed in the future. The recordings can be used for a variety of reasons:

* Improving customer support
* Fraud and security investigations
* Fine-grained product research
* and more

To enable these use cases, the session recorder needs to watch every user movement and reconstruct the entire layout, style, and content of your webpage so that it can replay user events in a visually meaningful way.

This leads to session recorders like rrweb having multiple event types. Some events will be large as they need to capture metadata about your website (i.e. structure and style information to reconstruct your website at replay time). Other events will be small, since they only contain x/y coordinates of mouse movements.

When processed and stored correctly, this data will allow you to watch a video of your user interacting with your website.

If you're hesitant to ship such detailed information about your users’ behaviors and also your platform to a third party, or if you just want a better understanding of how this works, we're going to show you how to implement this advanced feature yourself using rrweb, Redpanda, and Clickhouse.

# Session Recording

To get started, you'll need to create a new Redpanda topic for storing the session recordings.

As mentioned in the previous section, certain metadata messages that occur at the beginning of each recording may be on the larger side. These payloads can exceed Redpanda's default max message size of 1MB.

1. create topics with session recordings.

1. Session Recording: Clickhouse setup

Next, you’ll need to create a new table in Clickhouse for storing the session recordings. Run the following DDL statement from your local Clickhouse UI to create the table:

````
CREATE OR REPLACE TABLE analytics.recordings_kafka (
    id String,
    page_title String,
    recording String,
    timestamp DateTime64(3)
) ENGINE = Kafka SETTINGS
    kafka_broker_list = 'redpanda-1:9092',
    kafka_topic_list = 'session_recordings',
    kafka_group_name = 'rp',
    kafka_format = 'JSONEachRow',
    kafka_num_consumers = 1;
````

The `analytics.recordings_kafka` table uses the Kafka engine to read session recordings from a Redpanda topic called `session_recordings`. The fields names correspond to the following values:

Finally, create a materialized view that we can use to query the session recording data.

````
CREATE MATERIALIZED VIEW analytics.recordings
ENGINE = Memory
AS
SELECT
    id,
    page_title,
    recording,
    timestamp
FROM analytics.recordings_kafka
SETTINGS
stream_like_engine_allow_direct_select = 1;
````

Session Recording: Hono Updates

To implement the session recording, we're going to use an open source library called [rrweb](https://github.com/rrweb-io/rrweb). You can read about that library in detail in the Github repo, but to summarize the implementation, we need to:

* Inject the rrweb library into the webpage
* Initialize start recording when the page is loaded
* Post all recording events to our Hono service
* Save these events to Redpanda and Clickhouse
* Build a page to watch / replay the recording events

We could implement all of this in our existing `/js` endpoint, but to improve readability for this tutorial, we will create a new endpoint called `record.js`.

Whether or not you ultimately decide to move some of your analytic workloads in-house, we hope this course provided some useful experience with Hono, Redpanda, and Clickhouse. The skills you built here can be applied to a wide range of use cases, and familiarity with the core components (a data collector, a streaming layer, and a real-time analytics database) will ensure a smooth journey for whatever you decide to build next.
