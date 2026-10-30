import assert from "node:assert/strict";
import test from "node:test";
import { readUiConfig, validateUiConfig } from "../../scripts/ui-config.mjs";

test("published UI configuration is internally consistent", () => {
  assert.doesNotThrow(() => validateUiConfig(readUiConfig()));
});

test("font defaults and aliases must resolve to one configured choice", () => {
  const config = readUiConfig();
  config.ui.fonts.default = "missing";
  assert.throws(() => validateUiConfig(config), /default must be an available font/);
  config.ui.fonts.default = config.ui.fonts.options[0].value;
  config.ui.fonts.options.push({ ...config.ui.fonts.options[0] });
  assert.throws(() => validateUiConfig(config), /unique values/);
  config.ui.fonts.options.pop();
  config.ui.fonts.aliases.old = "missing";
  assert.throws(() => validateUiConfig(config), /alias old must target/);
});

test("callout aliases cannot silently fall back after a configuration typo", () => {
  const config = readUiConfig();
  config.callouts.aliases.caution = "warnign";
  assert.throws(() => validateUiConfig(config), /unknown type warnign/);
});

test("pane resizing requires a legacy storage key and a usable keyboard step", () => {
  const config = readUiConfig();
  config.ui.navigation.resize.legacyStorageKey = "";
  assert.throws(() => validateUiConfig(config), /resize legacyStorageKey/);
  config.ui.navigation.resize.legacyStorageKey = "panes";
  config.ui.navigation.resize.keyboardStepPixels = 0;
  assert.throws(() => validateUiConfig(config), /resize keyboardStepPixels/);
});

test("preference cookies require separate valid names and positive lifetimes", () => {
  const config = readUiConfig();
  config.ui.navigation.resize.cookie.name = config.ui.fonts.cookie.name;
  assert.throws(() => validateUiConfig(config), /cookie names must be distinct/);
  config.ui.navigation.resize.cookie.name = "bad;name";
  assert.throws(() => validateUiConfig(config), /cookie name must be a valid identifier/);
  config.ui.navigation.resize.cookie.name = "panes";
  config.ui.navigation.resize.cookie.maxAgeSeconds = 0;
  assert.throws(() => validateUiConfig(config), /cookie maxAgeSeconds must be positive/);
});

test("reading and engagement thresholds reject unusable or contradictory values", () => {
  for (const fraction of [-1, 0, 1, Infinity]) {
    const config = readUiConfig();
    config.ui.navigation.outline.readingViewportFraction = fraction;
    assert.throws(() => validateUiConfig(config), /readingViewportFraction/);
  }
  const config = readUiConfig();
  config.analytics.engagement.completedVisiblePercent = 0;
  assert.throws(() => validateUiConfig(config), /completion must require at least/);
  config.analytics.engagement.completedVisiblePercent = 100;
  config.analytics.engagement.tickMilliseconds = 0;
  assert.throws(() => validateUiConfig(config), /tickMilliseconds must be a positive integer/);
});

test("display controls require supported options and coherent defaults", () => {
  const config = readUiConfig();
  config.ui.display.breadcrumbs.default = "unknown";
  assert.throws(() => validateUiConfig(config), /breadcrumbs default/);
  config.ui.display.breadcrumbs.default = "sticky";
  config.ui.display.textSize.options.push({ value: "huge", label: "Huge" });
  assert.throws(() => validateUiConfig(config), /textSize option must have styling support/);
  config.ui.display.textSize.options.pop();
  config.ui.display.pinAncestors.default = "yes";
  assert.throws(() => validateUiConfig(config), /pinAncestors default must be boolean/);
  config.ui.display.pinAncestors.default = true;
  config.ui.display.cookie.name = config.ui.fonts.cookie.name;
  assert.throws(() => validateUiConfig(config), /cookie names must be distinct/);
});
