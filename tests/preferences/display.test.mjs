import assert from "node:assert/strict";
import test from "node:test";
import { readUiConfig } from "../../scripts/ui-config.mjs";
import {
  displayDefaults,
  normalizeDisplayPreferences,
} from "../../assets/js/preferences/display.mjs";

const { display } = readUiConfig().ui;

test("display preferences accept known choices and retain defaults for malformed values", () => {
  const choices = {
    breadcrumbs: "static",
    textSize: "larger",
    lineSpacing: "roomy",
    pinAncestors: false,
  };
  assert.deepEqual(normalizeDisplayPreferences(choices, display), choices);
  for (const value of [
    undefined,
    null,
    "broken",
    { breadcrumbs: "toString", textSize: "huge", pinAncestors: "false" },
  ]) {
    assert.deepEqual(normalizeDisplayPreferences(value, display), displayDefaults(display));
  }
});

test("site defaults remain configurable independently of a visitor's overrides", () => {
  const config = structuredClone(display);
  config.breadcrumbs.default = "static";
  config.textSize.default = "large";
  config.pinAncestors.default = false;
  assert.deepEqual(normalizeDisplayPreferences({ lineSpacing: "compact" }, config), {
    breadcrumbs: "static",
    textSize: "large",
    lineSpacing: "compact",
    pinAncestors: false,
  });
});
