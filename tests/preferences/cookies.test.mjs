import assert from "node:assert/strict";
import test from "node:test";
import {
  readPreferenceCookie,
  writePreferenceCookie,
  removePreferenceCookie,
} from "../../assets/js/preferences/cookies.mjs";

function browser(t, document) {
  for (const [key, value] of Object.entries({ document, location: { protocol: "https:" } })) {
    const original = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    t.after(() => {
      if (original) Object.defineProperty(globalThis, key, original);
      else delete globalThis[key];
    });
  }
}

test("preference cookies use a configured lifetime, root path, SameSite and HTTPS security", (t) => {
  let written;
  browser(t, {
    get cookie() {
      return "preference=jost";
    },
    set cookie(value) {
      written = value;
    },
  });
  const config = { name: "preference", maxAgeSeconds: 3600 };
  const before = Date.now();
  assert.equal(writePreferenceCookie(config, "jost"), true);
  assert.match(written, /; path=\//i);
  assert.match(written, /; samesite=Lax/i);
  assert.match(written, /; secure(?:;|$)/i);
  const expiry = new Date(written.match(/expires=([^;]+)/i)[1]).getTime();
  assert.ok(expiry >= before + 3599 * 1000 && expiry <= Date.now() + 3600 * 1000);
  globalThis.location.protocol = "http:";
  writePreferenceCookie(config, "jost");
  assert.doesNotMatch(written, /; secure(?:;|$)/i);
});

test("cookie failures are nonfatal and silently rejected writes are reported", (t) => {
  const document = {};
  browser(t, document);
  const config = { name: "preference", maxAgeSeconds: 3600 };
  Object.defineProperty(document, "cookie", {
    configurable: true,
    get() {
      return "";
    },
    set() {},
  });
  assert.equal(writePreferenceCookie(config, "jost"), false);
  Object.defineProperty(document, "cookie", {
    get() {
      throw new Error("Cookies unavailable");
    },
    set() {
      throw new Error("Cookies unavailable");
    },
  });
  assert.equal(readPreferenceCookie(config), undefined);
  assert.equal(writePreferenceCookie(config, "jost"), false);
  assert.equal(removePreferenceCookie(config), false);
});
