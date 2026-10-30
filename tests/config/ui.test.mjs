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
