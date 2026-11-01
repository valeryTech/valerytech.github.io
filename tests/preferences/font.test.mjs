import assert from "node:assert/strict";
import test from "node:test";
import { readUiConfig } from "../../scripts/ui-config.mjs";
import {
  normalizeFontPreference,
  savedFontPreference,
} from "../../assets/js/preferences/font-settings.mjs";

const { fonts } = readUiConfig().ui;

function cookieDocument(t) {
  const original = Object.getOwnPropertyDescriptor(globalThis, "document");
  const document = { cookie: "" };
  Object.defineProperty(globalThis, "document", { configurable: true, value: document });
  t.after(() => {
    if (original) Object.defineProperty(globalThis, "document", original);
    else delete globalThis.document;
  });
  return document;
}

test("saved font choices retain legacy compatibility and reject unknown values", () => {
  assert.equal(normalizeFontPreference("jost", fonts), "jost");
  assert.equal(normalizeFontPreference("avenir", fonts), "system");
  for (const value of [undefined, "missing", "toString", "__proto__"]) {
    assert.equal(normalizeFontPreference(value, fonts), fonts.default);
  }
});

test("font restoration handles other cookies, encoding, and malformed values", (t) => {
  const document = cookieDocument(t);
  const read = (cookies) => {
    document.cookie = cookies;
    return savedFontPreference(fonts);
  };
  const name = fonts.cookie.name;
  assert.equal(read(`other=x; ${name}=jost; third=y`), "jost");
  assert.equal(read(`${name}=%6aost`), "jost");
  assert.equal(read(`${name}=avenir`), "system");
  for (const cookies of ["", `not-${name}=jost`, `${name}=%E0%A4%A`, `${name}=unknown`]) {
    assert.equal(read(cookies), fonts.default);
  }
});

test("a configured default and cookie name are used by both restore paths", (t) => {
  const document = cookieDocument(t);
  const config = { ...fonts, default: "jost", cookie: { ...fonts.cookie, name: "reading-font" } };
  assert.equal(normalizeFontPreference(undefined, config), "jost");
  document.cookie = "font-preference=system";
  assert.equal(savedFontPreference(config), "jost");
  document.cookie = "reading-font=system";
  assert.equal(savedFontPreference(config), "system");
});
