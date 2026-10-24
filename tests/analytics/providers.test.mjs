import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import test from "node:test";
import { createAnalyticsBus } from "../../assets/js/analytics/event-bus.mjs";
import {
  getNotFoundDetails,
  sanitizePostHogEvent,
} from "../../assets/js/analytics/helpers.mjs";

function providerSource(name) {
  return readFileSync(
    new URL(`../../assets/js/analytics/${name}.js`, import.meta.url),
    "utf8"
  ).replace(/^import .*;\r?\n/gm, "");
}

test("the GA4 adapter forwards queued 404 parameters including the release", () => {
  const bus = createAnalyticsBus();
  const details = getNotFoundDetails(
    "https://valery.tech/missing/",
    "https://valery.tech/ai/?private=yes",
    "release-123"
  );
  bus.emit("not_found_viewed", details);
  const template = readFileSync(
    new URL("../../layouts/partials/head/analytics.html", import.meta.url),
    "utf8"
  );
  const source = template
    .match(/<script>\s*([\s\S]*?)<\/script>/)[1]
    .replace(/\{\{.*?\}\}/g, '"test-value"');
  const window = { siteAnalytics: bus };
  runInNewContext(source, { window, Date });
  const events = window.dataLayer.filter((entry) => entry[0] === "event");
  assert.equal(events.length, 1);
  assert.equal(events[0][1], "not_found_viewed");
  assert.deepEqual(events[0][2], details);
});

test("the Clarity adapter replays 404 context as bounded tags before the event", () => {
  const bus = createAnalyticsBus();
  const details = getNotFoundDetails(
    "https://valery.tech/missing/",
    "https://valery.tech/ai/?private=yes",
    "release-123"
  );
  bus.emit("not_found_viewed", details);
  const calls = [];
  runInNewContext(providerSource("clarity"), {
    params: { clarityProjectId: "test-project" },
    window: { siteAnalytics: bus },
    Clarity: {
      init() {},
      consentV2() {},
      setTag: (key, value) => calls.push([key, value]),
      event: (name) => calls.push(["event", name]),
    },
  });
  assert.deepEqual(calls, [
    ["page_kind", "404"],
    ...Object.entries(details),
    ["event", "not_found_viewed"],
  ]);
  bus.emit("not_found_viewed", {
    requested_path: "/" + "x".repeat(300),
    referrer_path: "",
    arbitrary: "private",
  });
  assert.equal(calls.at(-2)[1].length, 255);
  assert.deepEqual(calls.at(-1), ["event", "not_found_viewed"]);
  assert.equal(
    calls.some(([key]) => key === "arbitrary"),
    false
  );
  bus.emit("internal_navigation", {
    source_path: "/missing/",
    destination_path: "/",
  });
  assert.deepEqual(calls.at(-1), ["event", "internal_navigation"]);
});

test("the PostHog adapter retains 404 source and release on queued events", () => {
  const bus = createAnalyticsBus({
    site_release: "release-123",
    page_kind: "404",
  });
  const details = getNotFoundDetails(
    "https://valery.tech/missing/?private=yes",
    "https://source.example/private?secret=yes",
    "release-123"
  );
  bus.emit("not_found_viewed", details);
  const calls = [];
  runInNewContext(providerSource("posthog"), {
    params: { posthogProjectToken: "test-project" },
    window: {
      siteAnalytics: bus,
      location: { href: "https://valery.tech/missing/" },
    },
    ANALYTICS_SCHEMA_VERSION: 1,
    sanitizePostHogEvent,
    posthog: {
      init() {},
      register() {},
      capture: (name, properties) => calls.push({ name, properties }),
    },
  });
  const event = calls.find(({ name }) => name === "not_found_viewed");
  assert.deepEqual({ ...event.properties }, { schema_version: 1, ...details });
  assert.equal(event.properties.referrer_path, "");
  assert.equal(event.properties.site_release, "release-123");
});
