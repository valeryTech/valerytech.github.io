import {
  savedFontPreference,
  normalizeFontPreference,
  applyFontPreference,
  setFontPreference,
  resetFontPreference,
} from "./font-settings.mjs";
import {
  displayDefaults,
  savedDisplayPreferences,
  normalizeDisplayPreferences,
  applyDisplayPreferences,
  setDisplayPreferences,
} from "./display.mjs";
import { loadPaneWidths, savePaneWidths, parsePaneWidths } from "./panes.mjs";

// One controller per document; feature modules own their storage and DOM effects.
export function createPreferenceStore(config) {
  let state = {
    font: savedFontPreference(config.fonts),
    display: savedDisplayPreferences(config.display),
    widths: loadPaneWidths(config.navigation.resize),
  };
  const listeners = new Set();
  const keys = new Set([
    "font",
    ...Object.keys(displayDefaults(config.display)).map((key) => `display.${key}`),
    "widths.sidebar",
    "widths.outline",
  ]);

  function snapshot() {
    return { font: state.font, display: { ...state.display }, widths: { ...state.widths } };
  }

  function notify() {
    for (const listener of listeners) listener(snapshot());
  }

  function notifyWidths() {
    document.dispatchEvent(
      new CustomEvent("site:pane-widths-change", { detail: { widths: { ...state.widths } } }),
    );
  }

  function setWidths(widths) {
    state.widths = parsePaneWidths(JSON.stringify(widths));
    const saved = savePaneWidths(config.navigation.resize, state.widths);
    notifyWidths();
    notify();
    return saved;
  }

  function requireKey(key) {
    if (!keys.has(key)) throw new TypeError(`Unknown preference: ${key}`);
  }

  return {
    snapshot,
    get(key) {
      requireKey(key);
      return key.split(".").reduce((value, part) => value[part], state);
    },
    apply() {
      applyFontPreference(state.font);
      applyDisplayPreferences(state.display);
    },
    set(key, value) {
      requireKey(key);
      const [group, field] = key.split(".");
      let saved;
      if (group === "widths") return setWidths({ ...state.widths, [field]: value });
      if (key === "font") {
        state.font = normalizeFontPreference(value, config.fonts);
        saved = setFontPreference(state.font, config.fonts);
      } else {
        state.display = normalizeDisplayPreferences(
          { ...state.display, [field]: value },
          config.display,
        );
        saved = setDisplayPreferences(state.display, config.display);
      }
      notify();
      return saved;
    },
    setWidths,
    reset() {
      state = { font: config.fonts.default, display: displayDefaults(config.display), widths: {} };
      const results = [
        resetFontPreference(config.fonts),
        setDisplayPreferences(state.display, config.display),
        savePaneWidths(config.navigation.resize, state.widths),
      ];
      notifyWidths();
      notify();
      return results.every(Boolean);
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
