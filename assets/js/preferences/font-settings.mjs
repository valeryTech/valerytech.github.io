import { readPreferenceCookie, writePreferenceCookie, removePreferenceCookie } from "./cookies.mjs";

export const FONT_ATTRIBUTE = "data-font-preference";

export function normalizeFontPreference(value, config) {
  const preference = Object.hasOwn(config.aliases, value) ? config.aliases[value] : value;
  return config.options.some((option) => option.value === preference) ? preference : config.default;
}

export function savedFontPreference(config) {
  return normalizeFontPreference(readPreferenceCookie(config.cookie), config);
}

export function applyFontPreference(preference) {
  const changed = document.documentElement.getAttribute(FONT_ATTRIBUTE) !== preference;
  document.documentElement.setAttribute(FONT_ATTRIBUTE, preference);
  if (changed)
    document.dispatchEvent(new CustomEvent("site:font-change", { detail: { preference } }));
}

export function setFontPreference(value, config) {
  const preference = normalizeFontPreference(value, config);
  const saved = writePreferenceCookie(config.cookie, preference);
  applyFontPreference(preference);
  return saved;
}

export function resetFontPreference(config) {
  const saved = removePreferenceCookie(config.cookie);
  applyFontPreference(config.default);
  return saved;
}
