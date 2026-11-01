import assert from "node:assert/strict";
import test from "node:test";
import { readUiConfig } from "../../scripts/ui-config.mjs";
import {
  contrastRatio,
  decodePalette,
  encodePalette,
  normalizePalette,
  normalizeSavedPresets,
  paletteCss,
  paletteSource,
  samePalette,
} from "../../assets/js/preferences/palette.mjs";

const { palette: config } = readUiConfig().ui;

test("palette overrides keep only listed tokens with six-digit hex colors", () => {
  assert.deepEqual(
    normalizePalette(
      {
        light: { "page-background": "#FFFFF0", "muted": "red", "unknown": "#000000" },
        dark: { "link-color": "#123456", "accent": "#12345" },
        sepia: { "page-background": "#000000" },
      },
      config,
    ),
    { light: { "page-background": "#fffff0" }, dark: { "link-color": "#123456" } },
  );
  for (const value of [undefined, null, "broken", { light: "broken" }])
    assert.deepEqual(normalizePalette(value, config), { light: {}, dark: {} });
});

test("the cookie form round-trips by token name and fits one cookie with every role set", () => {
  const palette = { light: { muted: "#64748b" }, dark: { "page-background": "#111111" } };
  assert.equal(encodePalette(palette), "light=muted:64748b&dark=page-background:111111");
  assert.deepEqual(decodePalette(encodePalette(palette), config), palette);
  for (const value of [undefined, "", "sepia=muted:000000", "light=muted:zzz|=", "light"])
    assert.deepEqual(decodePalette(value, config), { light: {}, dark: {} });
  const full = { light: {}, dark: {} };
  for (const group of config.groups)
    for (const { token } of group.tokens) full.light[token] = full.dark[token] = "#abcdef";
  assert.ok(encodeURIComponent(encodePalette(full)).length < 3000);
});

test("site presets apply valid colors and match equal palettes", () => {
  for (const preset of config.presets) {
    const palette = normalizePalette(preset, config);
    assert.deepEqual(palette, { light: preset.light, dark: preset.dark });
    assert.ok(samePalette(palette, structuredClone(palette)));
  }
  assert.ok(!samePalette({ light: { muted: "#000000" }, dark: {} }, { light: {}, dark: {} }));
});

test("saved palettes need unique names and respect the configured limit", () => {
  const presets = normalizeSavedPresets(
    [
      { name: " Night ", dark: { muted: "#aaaaaa" } },
      { name: "night", dark: {} },
      { name: "", dark: {} },
      ...Array.from({ length: config.maxSavedPresets + 2 }, (_, index) => ({ name: `P${index}` })),
    ],
    config,
  );
  assert.equal(presets[0].name, "Night");
  assert.deepEqual(presets[0].dark, { muted: "#aaaaaa" });
  assert.equal(presets.length, config.maxSavedPresets);
  assert.deepEqual(normalizeSavedPresets("broken", config), []);
});

test("palette CSS outranks the brightness profiles in each theme", () => {
  assert.equal(paletteCss({ light: {}, dark: {} }), "");
  assert.equal(
    paletteCss({ light: { border: "#cccccc" }, dark: { "body-foreground": "#eeeeee" } }),
    "html:root:not(.dark) { --site-border: #cccccc; }\nhtml:root.dark { --site-body-foreground: #eeeeee; }",
  );
});

test("copied source uses the authored :root and .dark profiles", () => {
  assert.equal(
    paletteSource({ light: { muted: "#111111" }, dark: { muted: "#eeeeee", border: "#222222" } }),
    ":root {\n  --site-muted: #111111;\n}\n\n.dark {\n  --site-muted: #eeeeee;\n  --site-border: #222222;\n}",
  );
});

test("contrast ratios follow WCAG relative luminance in either order", () => {
  assert.equal(contrastRatio("#000000", "#ffffff"), 21);
  assert.equal(contrastRatio("#ffffff", "#ffffff"), 1);
  assert.equal(contrastRatio("#767676", "#ffffff").toFixed(2), "4.54");
  assert.equal(contrastRatio("#ffffff", "#767676"), contrastRatio("#767676", "#ffffff"));
});
