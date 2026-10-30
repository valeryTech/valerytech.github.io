import assert from "node:assert/strict";
import test from "node:test";
import { readUiConfig } from "../../scripts/ui-config.mjs";
import {
  normalizeFontPreference,
  savedFontPreference,
} from "../../assets/js/preferences/font-settings.mjs";

const { fonts } = readUiConfig().ui;

test("saved font choices retain legacy compatibility and reject unknown values", () => {
  assert.equal(normalizeFontPreference("jost", fonts), "jost");
  assert.equal(normalizeFontPreference("avenir", fonts), "system");
  for (const value of [undefined, "missing", "toString", "__proto__"]) {
    assert.equal(normalizeFontPreference(value, fonts), fonts.default);
  }
});

test("font restoration handles other cookies, encoding, and malformed values", () => {
  const name = fonts.cookie.name;
  assert.equal(savedFontPreference(`other=x;${name}=jost; third=y`, fonts), "jost");
  assert.equal(savedFontPreference(`${name}=%6aost`, fonts), "jost");
  assert.equal(savedFontPreference(`${name}=avenir`, fonts), "system");
  for (const cookies of ["", `not-${name}=jost`, `${name}=%E0%A4%A`, `${name}=unknown`]) {
    assert.equal(savedFontPreference(cookies, fonts), fonts.default);
  }
});

test("a configured default and cookie name are used by both restore paths", () => {
  const config = { ...fonts, default: "jost", cookie: { ...fonts.cookie, name: "reading-font" } };
  assert.equal(normalizeFontPreference(undefined, config), "jost");
  assert.equal(savedFontPreference("font-preference=system", config), "jost");
  assert.equal(savedFontPreference("reading-font=system", config), "system");
});
