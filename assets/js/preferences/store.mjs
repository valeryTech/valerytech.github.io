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
import { normalizePalette, savedPalette, setPalette, applyPalette } from "./palette.mjs";

// One controller per document; feature modules own their storage and DOM effects.
export function createPreferenceStore(config) {
  let state = {
    font: savedFontPreference(config.fonts),
    display: savedDisplayPreferences(config.display),
    widths: loadPaneWidths(config.navigation.resize),
    palette: savedPalette(config.palette),
  };
  const listeners = new Set();
  const keys = new Set([
    "font",
    ...Object.keys(displayDefaults(config.display)).map((key) => `display.${key}`),
    "widths.sidebar",
    "widths.outline",
    "palette",
  ]);
  const copyPalette = (palette) => ({ light: { ...palette.light }, dark: { ...palette.dark } });

  function snapshot() {
    return {
      font: state.font,
      display: { ...state.display },
      widths: { ...state.widths },
      palette: copyPalette(state.palette),
    };
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

  // Replace every preference at once, for resets and imported settings.
  function restore(value = {}) {
    state = {
      font: normalizeFontPreference(value.font, config.fonts),
      display: normalizeDisplayPreferences(value.display, config.display),
      widths: parsePaneWidths(JSON.stringify(value.widths ?? {})),
      palette: normalizePalette(value.palette, config.palette),
    };
    const results = [
      state.font === config.fonts.default ?
        resetFontPreference(config.fonts)
      : setFontPreference(state.font, config.fonts),
      setDisplayPreferences(state.display, config.display),
      savePaneWidths(config.navigation.resize, state.widths),
      setPalette(state.palette, config.palette),
    ];
    notifyWidths();
    notify();
    return results.every(Boolean);
  }

  function requireKey(key) {
    if (!keys.has(key)) throw new TypeError(`Unknown preference: ${key}`);
  }

  return {
    snapshot,
    get(key) {
      requireKey(key);
      if (key === "palette") return copyPalette(state.palette);
      return key.split(".").reduce((value, part) => value[part], state);
    },
    apply() {
      applyFontPreference(state.font);
      applyDisplayPreferences(state.display);
      applyPalette(state.palette);
    },
    set(key, value) {
      requireKey(key);
      const [group, field] = key.split(".");
      let saved;
      if (group === "widths") return setWidths({ ...state.widths, [field]: value });
      if (key === "palette") {
        state.palette = normalizePalette(value, config.palette);
        saved = setPalette(state.palette, config.palette);
      } else if (key === "font") {
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
    restore,
    reset() {
      return restore();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
