import {
  loadSavedPresets,
  normalizeSavedPresets,
  storeSavedPresets,
} from "../preferences/palette.mjs";

export const SETTINGS_FORMAT = "valerytech-site-settings";
export const SETTINGS_VERSION = 1;

// One portable file: the visitor's preferences plus their named palettes.
export function exportSettings(preferences, palette, now = new Date()) {
  return {
    format: SETTINGS_FORMAT,
    version: SETTINGS_VERSION,
    exportedAt: now.toISOString(),
    preferences: preferences.snapshot(),
    palettePresets: loadSavedPresets(palette),
  };
}

export function parseSettings(text, palette) {
  const value = JSON.parse(text);
  if (value?.format !== SETTINGS_FORMAT || value.version !== SETTINGS_VERSION)
    throw new TypeError("Unsupported settings file");
  if (!value.preferences || typeof value.preferences !== "object")
    throw new TypeError("Settings file has no preferences");
  return {
    preferences: value.preferences,
    palettePresets: normalizeSavedPresets(value.palettePresets ?? [], palette),
  };
}

// Imported palettes replace saved ones with the same name and keep the rest.
export function importSettings(text, preferences, palette) {
  const { preferences: values, palettePresets } = parseSettings(text, palette);
  const names = new Set(palettePresets.map((preset) => preset.name.toLowerCase()));
  const kept = loadSavedPresets(palette).filter((preset) => !names.has(preset.name.toLowerCase()));
  const presetsSaved = storeSavedPresets(palette, [...palettePresets, ...kept]);
  return preferences.restore(values) && presetsSaved;
}
