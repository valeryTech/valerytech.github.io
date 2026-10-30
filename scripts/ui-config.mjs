import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

export function readUiConfig() {
  const read = (name) =>
    JSON.parse(readFileSync(new URL(`../data/${name}.json`, import.meta.url), "utf8"));
  return { ui: read("ui"), callouts: read("callouts"), analytics: read("analytics") };
}

export function validateUiConfig({ ui, callouts, analytics }) {
  function validateCookie(cookie, feature) {
    assert.match(
      cookie.name,
      /^[a-zA-Z0-9_-]+$/,
      `${feature} cookie name must be a valid identifier`,
    );
    assert.ok(
      Number.isInteger(cookie.maxAgeSeconds) && cookie.maxAgeSeconds > 0,
      `${feature} cookie maxAgeSeconds must be positive`,
    );
  }

  const fonts = ui.fonts;
  assert.ok(
    Array.isArray(fonts.options) && fonts.options.length,
    "ui.fonts.options must list the available fonts",
  );
  const values = fonts.options.map((option) => option.value);
  assert.equal(new Set(values).size, values.length, "ui.fonts.options must use unique values");
  for (const option of fonts.options) {
    assert.match(option.value, /^[a-z][a-z0-9-]*$/, "font values must be stable identifiers");
    assert.ok(typeof option.label === "string" && option.label.trim(), "each font needs a label");
  }
  assert.ok(values.includes(fonts.default), "ui.fonts.default must be an available font");
  validateCookie(fonts.cookie, "font");
  assert.ok(
    fonts.aliases && typeof fonts.aliases === "object",
    "ui.fonts.aliases must be an object",
  );
  for (const [alias, value] of Object.entries(fonts.aliases)) {
    assert.ok(!values.includes(alias), `font alias ${alias} must not replace an available font`);
    assert.ok(values.includes(value), `font alias ${alias} must target an available font`);
  }

  const resize = ui.navigation.resize;
  validateCookie(resize.cookie, "navigation resize");
  const display = ui.display;
  validateCookie(display.cookie, "display");
  assert.equal(
    new Set([resize.cookie.name, fonts.cookie.name, display.cookie.name]).size,
    3,
    "preference cookie names must be distinct",
  );
  for (const [key, supported] of Object.entries({
    breadcrumbs: ["sticky", "static", "hidden"],
    textSize: ["standard", "large", "larger"],
    lineSpacing: ["comfortable", "compact", "roomy"],
  })) {
    const setting = display[key];
    assert.ok(
      Array.isArray(setting.options) && setting.options.length,
      `display ${key} needs options`,
    );
    const values = setting.options.map((option) => option.value);
    assert.equal(new Set(values).size, values.length, `display ${key} options must be unique`);
    assert.ok(
      values.includes(setting.default),
      `display ${key} default must be an available option`,
    );
    for (const option of setting.options) {
      assert.ok(
        supported.includes(option.value),
        `display ${key} option must have styling support`,
      );
      assert.ok(
        typeof option.label === "string" && option.label.trim(),
        `display ${key} options need labels`,
      );
    }
  }
  assert.equal(
    typeof display.pinAncestors.default,
    "boolean",
    "display pinAncestors default must be boolean",
  );
  assert.ok(
    typeof resize.legacyStorageKey === "string" && resize.legacyStorageKey.trim(),
    "navigation resize legacyStorageKey must be a nonempty string",
  );
  assert.ok(
    Number.isInteger(resize.keyboardStepPixels) && resize.keyboardStepPixels > 0,
    "navigation resize keyboardStepPixels must be a positive integer",
  );

  const outline = ui.navigation.outline;
  assert.ok(
    Number.isFinite(outline.readingViewportFraction) &&
      outline.readingViewportFraction > 0 &&
      outline.readingViewportFraction < 1,
    "outline readingViewportFraction must be between 0 and 1",
  );
  for (const key of [
    "minimumReadingLinePixels",
    "bottomTolerancePixels",
    "targetTolerancePixels",
  ]) {
    assert.ok(
      Number.isFinite(outline[key]) && outline[key] >= 0,
      `outline ${key} must be a nonnegative number`,
    );
  }

  assert.ok(
    callouts.types && Object.keys(callouts.types).length,
    "callouts.types must list the supported types",
  );
  for (const [type, style] of [
    ...Object.entries(callouts.types),
    ["fallback", callouts.fallback],
  ]) {
    assert.ok(
      typeof style?.icon === "string" && style.icon.trim(),
      `callout ${type} needs an icon`,
    );
    assert.ok(
      typeof style?.class === "string" && style.class.trim(),
      `callout ${type} needs a class`,
    );
  }
  for (const [alias, type] of Object.entries(callouts.aliases)) {
    assert.ok(
      !Object.hasOwn(callouts.types, alias),
      `callout alias ${alias} must not replace a type`,
    );
    assert.ok(
      Object.hasOwn(callouts.types, type),
      `callout alias ${alias} targets unknown type ${type}`,
    );
  }
  for (const [alias, icon] of Object.entries(callouts.legacyIcons)) {
    assert.ok(typeof icon === "string" && icon.trim(), `legacy icon ${alias} needs a destination`);
  }

  const engagement = analytics.engagement;
  assert.ok(
    Number.isFinite(engagement.requiredActiveSeconds) && engagement.requiredActiveSeconds > 0,
    "engagement requiredActiveSeconds must be positive",
  );
  for (const key of ["requiredVisiblePercent", "completedVisiblePercent"]) {
    assert.ok(
      Number.isFinite(engagement[key]) && engagement[key] >= 0 && engagement[key] <= 100,
      `engagement ${key} must be between 0 and 100`,
    );
  }
  assert.ok(
    engagement.completedVisiblePercent >= engagement.requiredVisiblePercent,
    "completion must require at least as much visibility as engagement",
  );
  for (const key of ["maxInteractions", "tickMilliseconds"]) {
    assert.ok(
      Number.isInteger(engagement[key]) && engagement[key] > 0,
      `engagement ${key} must be a positive integer`,
    );
  }
}
