import { readPreferenceCookie } from "./cookies.mjs";

export const FONT_ATTRIBUTE = "data-font-preference";

export function normalizeFontPreference(value, config) {
  const preference = Object.hasOwn(config.aliases, value) ? config.aliases[value] : value;
  return config.options.some((option) => option.value === preference) ? preference : config.default;
}

export function savedFontPreference(config) {
  return normalizeFontPreference(readPreferenceCookie(config.cookie), config);
}
