import { readPreferenceCookie, writePreferenceCookie, removePreferenceCookie } from "./cookies.mjs";

export function parsePaneWidths(value) {
  try {
    const saved = JSON.parse(value);
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return {};
    return Object.fromEntries(
      ["sidebar", "outline"]
        .filter((name) => Number.isFinite(saved[name]) && Math.floor(saved[name]) > 0)
        .map((name) => [name, Math.floor(saved[name])]),
    );
  } catch {
    return {};
  }
}

function removeLegacyWidths(config) {
  try {
    localStorage.removeItem(config.legacyStorageKey);
  } catch {
    // The cookie remains authoritative if legacy storage is inaccessible.
  }
}

export function savePaneWidths(config, widths) {
  const saved = parsePaneWidths(JSON.stringify(widths));
  const success =
    Object.keys(saved).length ?
      writePreferenceCookie(config.cookie, JSON.stringify(saved))
    : removePreferenceCookie(config.cookie);
  if (success) removeLegacyWidths(config);
  return success;
}

export function loadPaneWidths(config) {
  const cookie = readPreferenceCookie(config.cookie);
  if (cookie !== undefined) return parsePaneWidths(cookie);
  try {
    const widths = parsePaneWidths(localStorage.getItem(config.legacyStorageKey));
    if (Object.keys(widths).length) savePaneWidths(config, widths);
    return widths;
  } catch {
    return {};
  }
}
