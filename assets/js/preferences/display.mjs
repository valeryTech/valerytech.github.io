import { readPreferenceCookie, writePreferenceCookie, removePreferenceCookie } from "./cookies.mjs";

const attributes = {
  breadcrumbs: "data-breadcrumbs",
  textSize: "data-text-size",
  lineSpacing: "data-line-spacing",
  pinAncestors: "data-pin-ancestors",
};

export function displayDefaults(config) {
  return Object.fromEntries(Object.keys(attributes).map((key) => [key, config[key].default]));
}

export function normalizeDisplayPreferences(value, config) {
  const preferences = displayDefaults(config);
  for (const key of ["breadcrumbs", "textSize", "lineSpacing"]) {
    if (config[key].options.some((option) => option.value === value?.[key]))
      preferences[key] = value[key];
  }
  if (typeof value?.pinAncestors === "boolean") preferences.pinAncestors = value.pinAncestors;
  return preferences;
}

export function savedDisplayPreferences(config) {
  let value;
  try {
    value = JSON.parse(readPreferenceCookie(config.cookie));
  } catch {}
  return normalizeDisplayPreferences(value, config);
}

export function applyDisplayPreferences(preferences) {
  for (const [key, attribute] of Object.entries(attributes)) {
    document.documentElement.setAttribute(attribute, preferences[key]);
  }
}

export function setDisplayPreferences(value, config) {
  const preferences = normalizeDisplayPreferences(value, config);
  const defaults = displayDefaults(config);
  const overrides = Object.fromEntries(
    Object.entries(preferences).filter(([key, entry]) => entry !== defaults[key]),
  );
  const saved =
    Object.keys(overrides).length ?
      writePreferenceCookie(config.cookie, JSON.stringify(overrides))
    : removePreferenceCookie(config.cookie);
  applyDisplayPreferences(preferences);
  document.dispatchEvent(new CustomEvent("site:display-change", { detail: { preferences } }));
  return saved;
}
