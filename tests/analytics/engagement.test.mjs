import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";
import { scrollDepthBucket } from "../../assets/js/analytics/helpers.mjs";

function reader() {
  const source = readFileSync(
    new URL("../../assets/js/analytics/engagement.mjs", import.meta.url),
    "utf8",
  )
    .replace(/^import .*;\r?\n/gm, "")
    .replace("export function", "function");
  const events = [];
  const pageEvents = {};
  const documentEvents = {};
  let now = 0;
  let tick;
  let interval;
  const document = {
    hidden: false,
    documentElement: { scrollHeight: 2000 },
    addEventListener: (name, callback) => {
      documentEvents[name] = callback;
    },
  };
  const window = {
    scrollY: 300,
    innerHeight: 500,
    addEventListener: (name, callback) => {
      pageEvents[name] = callback;
    },
    setInterval: (callback, milliseconds) => {
      tick = callback;
      interval = milliseconds;
    },
  };
  const config = {
    requiredActiveSeconds: 2,
    requiredVisiblePercent: 40,
    completedVisiblePercent: 75,
    maxInteractions: 2,
    tickMilliseconds: 250,
  };
  runInNewContext(`${source}\ninitReaderEngagementAnalytics(config);`, {
    window,
    document,
    config,
    scrollDepthBucket,
    performance: { now: () => now },
    sendAnalyticsEvent: (name, parameters) => {
      events.push({ name, parameters });
    },
  });
  return {
    events,
    pageEvents,
    documentEvents,
    document,
    window,
    interval,
    advance: (milliseconds) => {
      now += milliseconds;
      tick();
    },
  };
}

test("configured reader policy requires interaction and reports completion once", () => {
  const r = reader();
  assert.equal(r.interval, 250);
  r.advance(2000);
  assert.equal(r.events.length, 0, "elapsed visible time alone is insufficient");
  r.documentEvents.keydown();
  r.advance(250);
  assert.equal(r.events[0].name, "reader_engaged");
  r.advance(1000);
  assert.equal(r.events.length, 1, "engagement fires once");
  for (let i = 0; i < 5; i++) r.documentEvents.pointerdown();
  r.window.scrollY = 1000;
  r.pageEvents.scroll();
  r.pageEvents.pagehide();
  r.pageEvents.pagehide();
  assert.equal(r.events.length, 2);
  const summary = r.events[1];
  assert.equal(summary.name, "reading_summary");
  assert.equal(summary.parameters.interaction_count, 2);
  assert.equal(summary.parameters.max_scroll_percent, 75);
  assert.equal(summary.parameters.completed, true);
});

test("background time does not satisfy configured active reading time", () => {
  const r = reader();
  r.documentEvents.keydown();
  r.advance(1000);
  r.document.hidden = true;
  r.documentEvents.visibilitychange();
  r.advance(10000);
  assert.equal(r.events.length, 0);
  r.document.hidden = false;
  r.documentEvents.visibilitychange();
  r.advance(1000);
  assert.equal(r.events[0].name, "reader_engaged");
  assert.equal(r.events[0].parameters.active_seconds, 2);
});
