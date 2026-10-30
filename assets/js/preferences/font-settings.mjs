export const FONT_ATTRIBUTE = "data-font-preference";

export function normalizeFontPreference(value, config) {
  const preference = Object.hasOwn(config.aliases, value) ? config.aliases[value] : value;
  return config.options.some((option) => option.value === preference) ? preference : config.default;
}

export function savedFontPreference(cookies, config) {
  const prefix = `${config.cookie.name}=`;
  const cookie = cookies.split(/;\s*/).find((entry) => entry.startsWith(prefix));
  let value;
  try {
    value = cookie ? decodeURIComponent(cookie.slice(prefix.length)) : undefined;
  } catch {
    value = undefined;
  }
  return normalizeFontPreference(value, config);
}
