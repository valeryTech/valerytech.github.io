import assert from "node:assert/strict";
import test from "node:test";

import {
  NOT_FOUND_REDIRECT_KEY,
  saveNotFoundRedirect,
  takeNotFoundRedirect,
} from "../../assets/js/analytics/not-found-redirect.mjs";

function memoryStorage() {
  const values = new Map();
  return {
    getItem: (key) => (values.has(key) ? values.get(key) : null),
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: (key) => values.delete(key),
  };
}

const origin = "https://valery.tech";
const href = "https://valery.tech/ai/old-folder/note/";

test("a saved redirect is returned once to the landing page", () => {
  const storage = memoryStorage();
  saveNotFoundRedirect(href, "https://www.aocr.org/links", storage, 1_000);
  assert.deepEqual(takeNotFoundRedirect(origin, storage, 2_000), {
    href,
    referrer: "https://www.aocr.org/links",
  });
  assert.equal(takeNotFoundRedirect(origin, storage, 2_000), null);
});

test("an old or foreign redirect is dropped", () => {
  const storage = memoryStorage();
  saveNotFoundRedirect(href, "", storage, 1_000);
  assert.equal(takeNotFoundRedirect(origin, storage, 40_000), null);
  assert.equal(storage.getItem(NOT_FOUND_REDIRECT_KEY), null);

  saveNotFoundRedirect("https://example.com/ai/", "", storage, 1_000);
  assert.equal(takeNotFoundRedirect(origin, storage, 2_000), null);

  storage.setItem(NOT_FOUND_REDIRECT_KEY, "not json");
  assert.equal(takeNotFoundRedirect(origin, storage, 2_000), null);
});

test("blocked storage neither throws nor reports", () => {
  const blocked = {
    getItem() {
      throw new Error("blocked");
    },
    setItem() {
      throw new Error("blocked");
    },
    removeItem() {
      throw new Error("blocked");
    },
  };
  assert.doesNotThrow(() => saveNotFoundRedirect(href, "", blocked));
  assert.equal(takeNotFoundRedirect(origin, blocked), null);
});
