import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

export function readUiConfig() {
  const read = (name) =>
    JSON.parse(readFileSync(new URL(`../data/${name}.json`, import.meta.url), "utf8"));
  return { ui: read("ui"), callouts: read("callouts"), analytics: read("analytics") };
}

export function validateUiConfig({ ui, callouts, analytics }) {
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
  assert.match(
    fonts.cookie.name,
    /^[a-zA-Z0-9_-]+$/,
    "font cookie name must be a valid identifier",
  );
  assert.ok(
    Number.isInteger(fonts.cookie.maxAgeSeconds) && fonts.cookie.maxAgeSeconds > 0,
    "font cookie maxAgeSeconds must be positive",
  );
  assert.ok(
    fonts.aliases && typeof fonts.aliases === "object",
    "ui.fonts.aliases must be an object",
  );
  for (const [alias, value] of Object.entries(fonts.aliases)) {
    assert.ok(!values.includes(alias), `font alias ${alias} must not replace an available font`);
    assert.ok(values.includes(value), `font alias ${alias} must target an available font`);
  }

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
