import assert from "node:assert/strict";
import test from "node:test";
import { readUiConfig } from "../../scripts/ui-config.mjs";
import { createPreferenceStore } from "../../assets/js/preferences/store.mjs";
import { exportSettings, importSettings } from "../../assets/js/settings/transfer.mjs";

function browser(t, { blocked = false, initial = {}, legacy = {} } = {}) {
  const jar = new Map(
    Object.entries(initial).map(([key, value]) => [key, encodeURIComponent(value)]),
  );
  const storage = new Map(Object.entries(legacy));
  const attributes = new Map();
  const document = new EventTarget();
  document.documentElement = {
    getAttribute: (key) => attributes.get(key),
    setAttribute: (key, value) => attributes.set(key, String(value)),
  };
  const elements = new Map();
  document.head = { append: (element) => elements.set(element.id, element) };
  document.getElementById = (id) => elements.get(id) ?? null;
  document.createElement = () => ({
    remove() {
      elements.delete(this.id);
    },
  });
  Object.defineProperty(document, "cookie", {
    get() {
      return [...jar].map(([key, value]) => `${key}=${value}`).join("; ");
    },
    set(value) {
      if (blocked) return;
      const [entry, ...parts] = value.split(";");
      const at = entry.indexOf("=");
      const key = entry.slice(0, at);
      const expiry = parts.find((part) => part.trim().toLowerCase().startsWith("expires="));
      if (expiry && new Date(expiry.slice(expiry.indexOf("=") + 1)).getTime() < Date.now())
        jar.delete(key);
      else jar.set(key, entry.slice(at + 1));
    },
  });
  const globals = {
    document,
    location: { protocol: "https:" },
    localStorage: {
      getItem: (key) => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, String(value)),
      removeItem: (key) => storage.delete(key),
    },
  };
  for (const [key, value] of Object.entries(globals)) {
    const original = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    t.after(() => {
      if (original) Object.defineProperty(globalThis, key, original);
      else delete globalThis[key];
    });
  }
  return { document, elements, jar, storage };
}

test("one preference controller normalizes saved values and migrates existing pane storage", (t) => {
  const config = readUiConfig().ui;
  const { storage, jar } = browser(t, {
    initial: { "font-preference": "avenir", "display-preferences": '{"breadcrumbs":"hidden"}' },
    legacy: { "site-navigation-widths": '{"sidebar":336,"outline":328}' },
  });
  const preferences = createPreferenceStore(config);
  assert.equal(preferences.get("font"), "system");
  assert.equal(preferences.get("display.breadcrumbs"), "hidden");
  assert.deepEqual(preferences.snapshot().widths, { sidebar: 336, outline: 328 });
  assert.equal(storage.has(config.navigation.resize.legacyStorageKey), false);
  assert.ok(jar.has("navigation-widths"));
  preferences.apply();
  assert.equal(document.documentElement.getAttribute("data-breadcrumbs"), "hidden");
});

test("updates notify all views with independent snapshots and preserve other setting groups", (t) => {
  browser(t);
  const preferences = createPreferenceStore(readUiConfig().ui);
  const changes = [];
  preferences.subscribe((snapshot) => {
    snapshot.display.breadcrumbs = "corrupted";
  });
  const unsubscribe = preferences.subscribe((snapshot) => changes.push(snapshot));
  assert.equal(preferences.set("display.breadcrumbs", "static"), true);
  assert.equal(preferences.set("font", "jost"), true);
  assert.equal(preferences.set("widths.sidebar", 321.9), true);
  assert.equal(preferences.get("display.breadcrumbs"), "static");
  assert.equal(preferences.get("widths.sidebar"), 321);
  assert.equal(changes.at(-1).font, "jost");
  assert.equal(changes.at(-1).display.breadcrumbs, "static");
  assert.equal(changes.length, 3);
  unsubscribe();
  preferences.set("widths.outline", 300);
  assert.equal(changes.length, 3);
  assert.throws(() => preferences.set("display.__proto__", "bad"), /Unknown preference/);
  assert.throws(() => preferences.get("missing"), /Unknown preference/);
});

test("blocked cookies retain successive changes in memory and leave legacy widths available", (t) => {
  const { storage } = browser(t, {
    blocked: true,
    legacy: { "site-navigation-widths": '{"sidebar":320}' },
  });
  const preferences = createPreferenceStore(readUiConfig().ui);
  assert.equal(preferences.set("display.breadcrumbs", "hidden"), false);
  assert.equal(preferences.set("display.textSize", "large"), false);
  assert.equal(preferences.set("display.headerVisible", false), false);
  assert.equal(preferences.get("display.breadcrumbs"), "hidden");
  assert.equal(preferences.get("display.textSize"), "large");
  assert.equal(preferences.get("display.headerVisible"), false);
  assert.equal(document.documentElement.getAttribute("data-breadcrumbs"), "hidden");
  assert.equal(document.documentElement.getAttribute("data-header-visible"), "false");
  assert.ok(storage.has("site-navigation-widths"));
});

test("text brightness restores older cookies, saves across pages, and resets to the configured default", (t) => {
  const config = readUiConfig().ui;
  const { jar } = browser(t, {
    initial: { "display-preferences": '{"textSize":"large"}' },
  });
  const preferences = createPreferenceStore(config);
  assert.equal(preferences.get("display.textBrightness"), "soft");
  assert.equal(preferences.set("display.textBrightness", "bright"), true);
  assert.equal(document.documentElement.getAttribute("data-text-brightness"), "bright");
  assert.equal(preferences.get("display.textSize"), "large");
  assert.deepEqual(JSON.parse(decodeURIComponent(jar.get(config.display.cookie.name))), {
    textSize: "large",
    textBrightness: "bright",
  });
  const restored = createPreferenceStore(config);
  assert.equal(restored.get("display.textBrightness"), "bright");
  assert.equal(restored.reset(), true);
  assert.equal(document.documentElement.getAttribute("data-text-brightness"), "soft");
  config.display.textBrightness.default = "bright";
  const changedDefault = createPreferenceStore(config);
  assert.equal(changedDefault.get("display.textBrightness"), "bright");
  changedDefault.set("display.textBrightness", "soft");
  assert.equal(changedDefault.reset(), true);
  assert.equal(document.documentElement.getAttribute("data-text-brightness"), "bright");
  assert.equal(jar.has(config.display.cookie.name), false);
});

test("reset restores configured defaults in one notification and preserves unrelated cookies", (t) => {
  const config = readUiConfig().ui;
  config.fonts.default = "jost";
  config.display.breadcrumbs.default = "static";
  const { jar } = browser(t, { initial: { unrelated: "keep" } });
  const preferences = createPreferenceStore(config);
  preferences.set("font", "system");
  preferences.set("display.breadcrumbs", "hidden");
  preferences.set("display.headerVisible", false);
  preferences.set("display.outlineVisible", false);
  preferences.setWidths({ sidebar: 400, outline: 300 });
  let notifications = 0;
  preferences.subscribe(() => notifications++);
  assert.equal(preferences.reset(), true);
  assert.equal(notifications, 1);
  assert.equal(preferences.get("font"), "jost");
  assert.equal(preferences.get("display.breadcrumbs"), "static");
  assert.equal(preferences.get("display.headerVisible"), true);
  assert.equal(preferences.get("display.outlineVisible"), true);
  assert.deepEqual(preferences.snapshot().widths, {});
  assert.deepEqual([...jar.keys()], ["unrelated"]);
});

test("palette colors save to their own cookie, restore before paint and reset with the rest", (t) => {
  const config = readUiConfig().ui;
  const { elements, jar } = browser(t);
  const preferences = createPreferenceStore(config);
  assert.deepEqual(preferences.get("palette"), { light: {}, dark: {} });
  const palette = preferences.get("palette");
  palette.dark["heading-foreground"] = "#FFCC66";
  palette.light["page-background"] = "#fffff0";
  palette.light["--not-a-token"] = "#000000";
  assert.equal(preferences.set("palette", palette), true);
  assert.equal(
    decodeURIComponent(jar.get(config.palette.cookie.name)),
    "light=page-background:fffff0&dark=heading-foreground:ffcc66",
  );
  assert.match(
    elements.get("site-palette-overrides").textContent,
    /--site-heading-foreground: #ffcc66/,
  );
  const restored = createPreferenceStore(config);
  assert.deepEqual(restored.get("palette"), {
    light: { "page-background": "#fffff0" },
    dark: { "heading-foreground": "#ffcc66" },
  });
  restored.get("palette").dark.muted = "#000000";
  assert.equal(restored.get("palette").dark.muted, undefined, "reads are copies");
  assert.equal(restored.reset(), true);
  assert.equal(jar.has(config.palette.cookie.name), false);
  assert.equal(elements.has("site-palette-overrides"), false);
});

test("settings export round-trips preferences and merges named palettes on import", (t) => {
  const config = readUiConfig().ui;
  const { jar, storage } = browser(t);
  const source = createPreferenceStore(config);
  source.set("font", "jost");
  source.set("display.breadcrumbs", "hidden");
  source.setWidths({ sidebar: 320 });
  source.set("palette", { light: {}, dark: { muted: "#aaaaaa" } });
  storage.set(
    config.palette.presetsStorageKey,
    JSON.stringify([{ name: "Night", light: {}, dark: { muted: "#aaaaaa" } }]),
  );
  const file = JSON.stringify(exportSettings(source, config.palette, new Date(0)));
  assert.equal(JSON.parse(file).exportedAt, "1970-01-01T00:00:00.000Z");

  source.reset();
  storage.set(
    config.palette.presetsStorageKey,
    JSON.stringify([
      { name: "night", light: { muted: "#111111" }, dark: {} },
      { name: "Paper", light: { "page-background": "#fbf7ef" }, dark: {} },
    ]),
  );
  const target = createPreferenceStore(config);
  assert.equal(importSettings(file, target, config.palette), true);
  assert.equal(target.get("font"), "jost");
  assert.equal(target.get("display.breadcrumbs"), "hidden");
  assert.equal(target.get("widths.sidebar"), 320);
  assert.deepEqual(target.get("palette").dark, { muted: "#aaaaaa" });
  assert.ok(jar.has(config.palette.cookie.name));
  assert.deepEqual(
    JSON.parse(storage.get(config.palette.presetsStorageKey)).map((preset) => preset.name),
    ["Night", "Paper"],
  );
  for (const broken of ["not json", "{}", '{"format":"valerytech-site-settings","version":2}'])
    assert.throws(() => importSettings(broken, target, config.palette));
  assert.equal(target.get("font"), "jost", "a rejected file changes nothing");
});
