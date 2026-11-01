import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const colors = readFileSync(
  new URL("../../assets/css/site/tokens/colors.css", import.meta.url),
  "utf8",
);

export function validatePaletteConfig(ui) {
  const palette = ui.palette;
  const text = (value, label) =>
    assert.ok(typeof value === "string" && value.trim(), `${label} must be nonempty text`);
  assert.match(palette.cookie?.name, /^[a-zA-Z0-9_-]+$/, "palette cookie name must be valid");
  assert.ok(
    Number.isInteger(palette.cookie.maxAgeSeconds) && palette.cookie.maxAgeSeconds > 0,
    "palette cookie maxAgeSeconds must be positive",
  );
  assert.match(palette.presetsStorageKey, /^[a-z][a-z0-9-]*$/, "presetsStorageKey must be stable");
  assert.ok(
    Number.isInteger(palette.maxSavedPresets) && palette.maxSavedPresets > 0,
    "maxSavedPresets must be a positive integer",
  );
  for (const key of [
    "title",
    "description",
    "presetLabel",
    "customLabel",
    "sitePresetsLabel",
    "savedPresetsLabel",
    "presetNameLabel",
    "saveLabel",
    "deleteLabel",
    "resetLabel",
    "copyLabel",
    "contrastText",
    "contrastWarning",
  ])
    text(palette[key], `palette ${key}`);
  for (const key of [
    "saved",
    "saveFailed",
    "reset",
    "copied",
    "copyFailed",
    "applied",
    "presetSaved",
    "presetDeleted",
    "presetNameRequired",
    "presetsFull",
  ])
    text(palette.messages?.[key], `palette message ${key}`);
  assert.ok(Array.isArray(palette.groups) && palette.groups.length, "palette needs groups");
  const tokens = new Set();
  for (const group of palette.groups) {
    text(group.title, "palette group title");
    assert.ok(Array.isArray(group.tokens) && group.tokens.length, "palette group needs tokens");
    for (const { token, label } of group.tokens) {
      assert.match(token, /^[a-z][a-z0-9-]*$/, "palette tokens omit the --site- prefix");
      assert.ok(!tokens.has(token), `palette token ${token} is listed twice`);
      assert.ok(
        colors.includes(`--site-${token}:`),
        `palette token ${token} must exist in tokens/colors.css`,
      );
      tokens.add(token);
      text(label, `palette token ${token} label`);
    }
  }
  for (const group of palette.groups)
    for (const { token, contrast } of group.tokens) {
      if (contrast === undefined) continue;
      assert.ok(
        tokens.has(contrast.against) && contrast.against !== token,
        `palette token ${token} must check contrast against another listed token`,
      );
      assert.ok(
        typeof contrast.minimum === "number" && contrast.minimum >= 1 && contrast.minimum <= 21,
        `palette token ${token} contrast minimum must be between 1 and 21`,
      );
    }
  for (const key of ["contrastText", "contrastWarning"])
    assert.ok(
      palette[key].includes("{ratio}") && palette[key].includes("{against}"),
      `palette ${key} needs {ratio} and {against}`,
    );
  assert.ok(Array.isArray(palette.presets) && palette.presets.length, "palette needs presets");
  const ids = new Set();
  for (const preset of palette.presets) {
    assert.match(preset.id, /^[a-z][a-z0-9-]*$/, "palette preset id must be stable");
    assert.ok(!ids.has(preset.id), `palette preset ${preset.id} is listed twice`);
    ids.add(preset.id);
    text(preset.label, `palette preset ${preset.id} label`);
    for (const profile of ["light", "dark"]) {
      assert.ok(
        preset[profile] && typeof preset[profile] === "object",
        `palette preset ${preset.id} needs ${profile} colors`,
      );
      for (const [token, color] of Object.entries(preset[profile])) {
        assert.ok(tokens.has(token), `palette preset ${preset.id} uses unlisted token ${token}`);
        assert.match(
          color,
          /^#[0-9a-f]{6}$/,
          `palette preset ${preset.id} ${token} must be #rrggbb`,
        );
      }
    }
  }
  assert.ok(
    palette.presets.some((preset) => !Object.keys({ ...preset.light, ...preset.dark }).length),
    "palette presets need one entry for the unchanged site colors",
  );
}
