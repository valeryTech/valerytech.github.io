import assert from "node:assert/strict";
import test from "node:test";
import { readUiConfig, validateUiConfig } from "../../scripts/ui-config.mjs";

test("published UI configuration is internally consistent", () => {
  assert.doesNotThrow(() => validateUiConfig(readUiConfig()));
});

test("surface corners accept square and fractional radii but reject unusable CSS values", () => {
  const config = readUiConfig();
  for (const value of [-1, Infinity, NaN, null, "12px"]) {
    config.ui.style.cornerRadiusPixels = value;
    assert.throws(() => validateUiConfig(config), /cornerRadiusPixels/);
  }
  for (const value of [0, 7.5]) {
    config.ui.style.cornerRadiusPixels = value;
    assert.doesNotThrow(() => validateUiConfig(config));
  }
});

test("unified spacing accepts nonnegative pixels and rejects unusable CSS values", () => {
  const config = readUiConfig();
  for (const value of [-1, Infinity, NaN, null, undefined, "8px"]) {
    config.ui.style.layoutGapPixels = value;
    assert.throws(() => validateUiConfig(config), /layoutGapPixels/);
  }
  for (const value of [0, 7.5]) {
    config.ui.style.layoutGapPixels = value;
    assert.doesNotThrow(() => validateUiConfig(config));
  }
});

test("layout dimensions are positive and the wide shell cannot be narrower than standard", () => {
  for (const key of ["standardWidthRem", "wideWidthRem", "readingWidthCh"]) {
    const config = readUiConfig();
    config.ui.style.layout[key] = 0;
    assert.throws(() => validateUiConfig(config), /must be positive/);
  }
  const config = readUiConfig();
  config.ui.style.layout.wideWidthRem = config.ui.style.layout.standardWidthRem - 1;
  assert.throws(() => validateUiConfig(config), /at least as wide/);
});

test("navigation proportions are finite percentages that leave room for the article", () => {
  for (const key of ["sidebarWidthPercent", "outlineWidthPercent"]) {
    for (const value of [-1, 0, 100, Infinity, NaN, null, undefined, "20%"]) {
      const config = readUiConfig();
      config.ui.style.layout[key] = value;
      assert.throws(() => validateUiConfig(config), new RegExp(key));
    }
  }
  const config = readUiConfig();
  config.ui.style.layout.sidebarWidthPercent = 50;
  config.ui.style.layout.outlineWidthPercent = 50;
  assert.throws(() => validateUiConfig(config), /leave space for the article/);
});

test("settings field definitions must reference the owning configuration and supported controls", () => {
  const config = readUiConfig();
  config.ui.settings.sections[0].fields[1].source = "fonts";
  assert.throws(() => validateUiConfig(config), /owning configuration source/);
  config.ui.settings.sections[0].fields[1].source = "display.textSize";
  config.ui.settings.sections[0].fields[1].type = "checkbox";
  assert.throws(() => validateUiConfig(config), /unsupported control/);
  config.ui.settings.sections[0].fields[1].type = "cycle";
  config.ui.settings.sections[0].fields.push({ ...config.ui.settings.sections[0].fields[0] });
  assert.throws(() => validateUiConfig(config), /field keys must be unique/);
});

test("settings sections can be reordered or reduced without duplicating preference definitions", () => {
  const config = readUiConfig();
  config.ui.settings.sections.reverse();
  config.ui.settings.sections[1].fields.pop();
  assert.doesNotThrow(() => validateUiConfig(config));
  config.ui.settings.sections[0].id = config.ui.settings.sections[1].id;
  assert.throws(() => validateUiConfig(config), /section ids must be unique/);
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

test("outline swipe thresholds require usable distances and a horizontal direction bias", () => {
  for (const key of ["edgeWidthPixels", "minimumDistancePixels"]) {
    for (const value of [0, -1, 1.5, Infinity, undefined]) {
      const config = readUiConfig();
      config.ui.navigation.swipe[key] = value;
      assert.throws(() => validateUiConfig(config), new RegExp(`swipe ${key}`));
    }
  }
  for (const value of [0, 1, Infinity, undefined]) {
    const config = readUiConfig();
    config.ui.navigation.swipe.directionRatio = value;
    assert.throws(() => validateUiConfig(config), /swipe directionRatio/);
  }
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

test("navigation visibility defaults must be boolean", () => {
  for (const key of ["headerVisible", "sidebarVisible", "outlineVisible"]) {
    const config = readUiConfig();
    config.ui.display[key].default = "hidden";
    assert.throws(() => validateUiConfig(config), new RegExp(`${key} default must be boolean`));
  }
});

test("text brightness requires a supported profile and a matching default", () => {
  const config = readUiConfig();
  config.ui.display.textBrightness.default = "bright";
  assert.doesNotThrow(() => validateUiConfig(config));
  config.ui.display.textBrightness.default = "white";
  assert.throws(() => validateUiConfig(config), /textBrightness default/);
  config.ui.display.textBrightness.default = "soft";
  config.ui.display.textBrightness.options.push({ value: "white", label: "White" });
  assert.throws(() => validateUiConfig(config), /textBrightness option must have styling support/);
});
