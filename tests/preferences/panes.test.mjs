import assert from "node:assert/strict";
import test from "node:test";
import { parsePaneWidths } from "../../assets/js/preferences/panes.mjs";

test("pane preferences retain only positive pixel widths for known panes", () => {
  assert.deepEqual(parsePaneWidths('{"sidebar":336.8,"outline":328,"other":100}'), {
    sidebar: 336,
    outline: 328,
  });
  assert.deepEqual(parsePaneWidths('{"sidebar":"336","outline":-1}'), {});
  assert.deepEqual(parsePaneWidths('{"sidebar":0,"outline":1e999}'), {});
  assert.deepEqual(parsePaneWidths('{"outline":320}'), { outline: 320 });
});

test("invalid or unrelated cookie values fall back to default pane sizes", () => {
  for (const value of [undefined, "", "{broken", "null", "[]", '"sidebar"', "42"]) {
    assert.deepEqual(parsePaneWidths(value), {});
  }
});
