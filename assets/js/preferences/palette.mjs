import { readPreferenceCookie, writePreferenceCookie, removePreferenceCookie } from "./cookies.mjs";

// Visitor color overrides, stored per profile and applied over tokens/colors.css.
export const PALETTE_STYLE_ID = "site-palette-overrides";
export const PALETTE_PROFILES = ["light", "dark"];
const HEX = /^#[0-9a-f]{6}$/;
// One extra element/attribute outranks `.dark[data-text-brightness]` profiles.
const SELECTORS = { light: "html:root:not(.dark)", dark: "html:root.dark" };

export function paletteTokens(config) {
  return config.groups.flatMap((group) => group.tokens.map((entry) => entry.token));
}

export function normalizePalette(value, config) {
  const palette = { light: {}, dark: {} };
  for (const profile of PALETTE_PROFILES) {
    const colors = value?.[profile];
    if (!colors || typeof colors !== "object") continue;
    for (const token of paletteTokens(config)) {
      const color = String(colors[token] ?? "").toLowerCase();
      if (HEX.test(color)) palette[profile][token] = color;
    }
  }
  return palette;
}

export function isEmptyPalette(palette) {
  return PALETTE_PROFILES.every((profile) => !Object.keys(palette[profile]).length);
}

export function samePalette(a, b) {
  return PALETTE_PROFILES.every((profile) => {
    const keys = Object.keys(a[profile]);
    return (
      keys.length === Object.keys(b[profile]).length &&
      keys.every((token) => a[profile][token] === b[profile][token])
    );
  });
}

// Cookie form keeps token names, so reordering palette.json never scrambles saved colors:
// `light=page-background:ffffff|muted:64748b&dark=...`, about 1 KB with every role set.
export function encodePalette(palette) {
  return PALETTE_PROFILES.filter((profile) => Object.keys(palette[profile]).length)
    .map(
      (profile) =>
        `${profile}=${Object.entries(palette[profile])
          .map(([token, color]) => `${token}:${color.slice(1)}`)
          .join("|")}`,
    )
    .join("&");
}

export function decodePalette(value, config) {
  const palette = { light: {}, dark: {} };
  for (const part of String(value ?? "").split("&")) {
    const [profile, entries = ""] = part.split("=");
    if (!PALETTE_PROFILES.includes(profile)) continue;
    for (const entry of entries.split("|")) {
      const [token, color] = entry.split(":");
      palette[profile][token] = `#${color}`;
    }
  }
  return normalizePalette(palette, config);
}

export function savedPalette(config) {
  return decodePalette(readPreferenceCookie(config.cookie), config);
}

export function setPalette(value, config) {
  const palette = normalizePalette(value, config);
  const saved =
    isEmptyPalette(palette) ?
      removePreferenceCookie(config.cookie)
    : writePreferenceCookie(config.cookie, encodePalette(palette));
  applyPalette(palette);
  return saved;
}

// Named palettes outgrow a cookie, so they stay in this browser's local storage.
export function loadSavedPresets(config) {
  try {
    const presets = JSON.parse(localStorage.getItem(config.presetsStorageKey) || "[]");
    return normalizeSavedPresets(presets, config);
  } catch {
    return [];
  }
}

export function normalizeSavedPresets(value, config) {
  if (!Array.isArray(value)) return [];
  const names = new Set();
  const presets = [];
  for (const preset of value) {
    const name = typeof preset?.name === "string" ? preset.name.trim().slice(0, 40) : "";
    if (!name || names.has(name.toLowerCase())) continue;
    names.add(name.toLowerCase());
    presets.push({ name, ...normalizePalette(preset, config) });
  }
  return presets.slice(0, config.maxSavedPresets);
}

export function storeSavedPresets(config, presets) {
  try {
    const value = normalizeSavedPresets(presets, config);
    if (value.length) localStorage.setItem(config.presetsStorageKey, JSON.stringify(value));
    else localStorage.removeItem(config.presetsStorageKey);
    return true;
  } catch {
    return false;
  }
}

// WCAG 2 contrast ratio between two #rrggbb colors, from 1 to 21.
export function contrastRatio(a, b) {
  const luminance = (hex) => {
    const [r, g, b] = [1, 3, 5].map((index) => {
      const channel = parseInt(hex.slice(index, index + 2), 16) / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

function declarations(colors) {
  return Object.keys(colors)
    .map((token) => `--site-${token}: ${colors[token]};`)
    .join(" ");
}

export function paletteCss(palette) {
  return PALETTE_PROFILES.filter((profile) => Object.keys(palette[profile]).length)
    .map((profile) => `${SELECTORS[profile]} { ${declarations(palette[profile])} }`)
    .join("\n");
}

// The authored form for tokens/colors.css: `:root` holds Light and `.dark` holds Dark.
export function paletteSource(palette) {
  return PALETTE_PROFILES.filter((profile) => Object.keys(palette[profile]).length)
    .map((profile) => {
      const lines = Object.keys(palette[profile]).map(
        (token) => `  --site-${token}: ${palette[profile][token]};`,
      );
      return `${profile === "light" ? ":root" : ".dark"} {\n${lines.join("\n")}\n}`;
    })
    .join("\n\n");
}

export function applyPalette(palette) {
  const css = paletteCss(palette);
  let style = document.getElementById(PALETTE_STYLE_ID);
  if (!css) {
    style?.remove();
    return;
  }
  if (!style) {
    style = document.createElement("style");
    style.id = PALETTE_STYLE_ID;
    document.head.append(style);
  }
  style.textContent = css;
}
