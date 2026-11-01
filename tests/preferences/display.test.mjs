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
    ...displayDefaults(display),
    breadcrumbs: "static",
    textSize: "larger",
    textBrightness: "bright",
    lineSpacing: "roomy",
    pinAncestors: false,
    headerVisible: false,
    sidebarVisible: false,
    outlineVisible: false,
  };
  assert.deepEqual(normalizeDisplayPreferences(choices, display), choices);
  for (const value of [
    undefined,
    null,
    "broken",
    { breadcrumbs: "toString", textSize: "huge", textBrightness: "white", pinAncestors: "false" },
  ]) {
    assert.deepEqual(normalizeDisplayPreferences(value, display), displayDefaults(display));
  }
});

test("site defaults remain configurable independently of a visitor's overrides", () => {
  const config = structuredClone(display);
  config.breadcrumbs.default = "static";
  config.textSize.default = "large";
  config.textBrightness.default = "bright";
  config.pinAncestors.default = false;
  assert.deepEqual(normalizeDisplayPreferences({ lineSpacing: "compact" }, config), {
    ...displayDefaults(config),
    breadcrumbs: "static",
    textSize: "large",
    textBrightness: "bright",
    lineSpacing: "compact",
    pinAncestors: false,
    sidebarVisible: true,
  });
});

test("older display preferences keep navigation visible and only booleans can hide it", () => {
  for (const key of ["headerVisible", "sidebarVisible", "outlineVisible"]) {
    assert.equal(normalizeDisplayPreferences({ breadcrumbs: "hidden" }, display)[key], true);
    assert.equal(normalizeDisplayPreferences({ [key]: false }, display)[key], false);
    assert.equal(normalizeDisplayPreferences({ [key]: "false" }, display)[key], true);
  }
});

test("older display cookies receive adaptive layout defaults and invalid layout values are ignored", () => {
  const old = normalizeDisplayPreferences({ breadcrumbs: "hidden" }, display);
  assert.equal(old.siteWidth, "wide");
  assert.equal(old.density, "auto");
  assert.equal(old.outline, "auto");
  const selected = normalizeDisplayPreferences(
    { siteWidth: "standard", density: "compact", outline: "prefer" },
    display,
  );
  assert.equal(selected.siteWidth, "standard");
  assert.equal(selected.density, "compact");
  assert.equal(selected.outline, "prefer");
  const invalid = normalizeDisplayPreferences(
    { siteWidth: "full", density: "tiny", outline: true },
    display,
  );
  assert.deepEqual(invalid, displayDefaults(display));
});
