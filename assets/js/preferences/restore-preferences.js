import { fonts, display, navigation, palette, theme } from "@params";
import { FONT_ATTRIBUTE, savedFontPreference } from "./font-settings.mjs";
import { applyDisplayPreferences, savedDisplayPreferences } from "./display.mjs";
import { applyPaneWidths, loadPaneWidths } from "./panes.mjs";
import { applyPalette, savedPalette } from "./palette.mjs";

// Inline in <head>: restore reading preferences before the first paint.
document.documentElement.setAttribute(FONT_ATTRIBUTE, savedFontPreference(fonts));
applyDisplayPreferences(savedDisplayPreferences(display));
applyPaneWidths(loadPaneWidths(navigation.resize));
applyPalette(savedPalette(palette));

// Match the theme toggle icon to the saved choice; Hextra's head script applies the colors.
let themePreference = theme;
try {
  themePreference = localStorage.getItem("color-theme") || theme;
} catch {}
document.documentElement.dataset.themePreference =
  ["light", "dark", "system"].includes(themePreference) ? themePreference : "system";
