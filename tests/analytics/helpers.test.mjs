import assert from "node:assert/strict";
import test from "node:test";

import { createAnalyticsBus } from "../../assets/js/analytics/event-bus.mjs";
import {
  classifyOutboundDestination,
  getDownloadDetails,
  getNavigationArea,
  sanitizePostHogEvent,
  scrollDepthBucket,
  searchQueryLengthBucket,
} from "../../assets/js/analytics/helpers.mjs";

test("the event bus replays queued events once to late subscribers", () => {
  const bus = createAnalyticsBus({ page_path: "/ai/" });
  bus.emit("reader_engaged", { active_seconds: 10 });

  const received = [];
  const unsubscribe = bus.subscribe((event) => received.push(event));
  bus.emit("reading_summary", { completed: true });
  unsubscribe();
  bus.emit("ignored_after_unsubscribe");

  assert.deepEqual(
    received.map((event) => event.name),
    ["reader_engaged", "reading_summary"]
  );
  assert.equal(bus.context.page_path, "/ai/");
});

test("the event bus caps its replay queue", () => {
  const bus = createAnalyticsBus({}, 2);
  bus.emit("first");
  bus.emit("second");
  bus.emit("third");

  const received = [];
  bus.subscribe((event) => received.push(event.name));
  assert.deepEqual(received, ["second", "third"]);
});

test("search lengths and scroll depths use stable buckets", () => {
  assert.equal(searchQueryLengthBucket(0), "0");
  assert.equal(searchQueryLengthBucket(7), "4-7");
  assert.equal(searchQueryLengthBucket(40), "16+");
  assert.equal(scrollDepthBucket(24), "0-24");
  assert.equal(scrollDepthBucket(90), "90-100");
});

test("navigation areas use stable semantic labels", () => {
  const link = {
    closest(selector) {
      return selector.includes(".docs-sidebar") ? {} : null;
    },
  };
  assert.equal(getNavigationArea(link), "section_navigation");
});

test("outbound destinations are categorized without exposing addresses", () => {
  assert.equal(
    classifyOutboundDestination(new URL("https://chatgpt.com/?q=private")),
    "ai_tool"
  );
  assert.equal(
    classifyOutboundDestination(
      new URL("https://example.com/source"),
      "content"
    ),
    "reference"
  );
  assert.equal(
    classifyOutboundDestination(new URL("mailto:person@example.com")),
    "contact"
  );
});

test("download detection keeps only the public path and file type", () => {
  const link = { hasAttribute: () => false };
  assert.deepEqual(
    getDownloadDetails(
      link,
      new URL("https://example.com/files/report.pdf?key=secret")
    ),
    { file_type: "pdf", resource_path: "/files/report.pdf" }
  );
});

test("PostHog URL properties remove query strings, fragments, and contact values", () => {
  const secret = "never-send-this-search";
  const event = sanitizePostHogEvent(
    {
      event: "$autocapture",
      properties: {
        $current_url: `https://valery.tech/ai/?q=${secret}#heading`,
        $referrer: `https://search.example/?query=${secret}`,
        $elements: [
          { attr__href: `https://example.com/read?term=${secret}` },
          { attr__href: `mailto:${secret}@example.com` },
        ],
      },
    },
    "https://valery.tech/"
  );

  assert.equal(event.properties.$current_url, "https://valery.tech/ai/");
  assert.equal(event.properties.$referrer, "https://search.example/");
  assert.equal(event.properties.$elements[1].attr__href, "mailto:");
  assert.equal(JSON.stringify(event).includes(secret), false);
});
