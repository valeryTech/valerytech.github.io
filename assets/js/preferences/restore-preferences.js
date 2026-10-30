import { fonts, display } from "@params";
import { FONT_ATTRIBUTE, savedFontPreference } from "./font-settings.mjs";
import { applyDisplayPreferences, savedDisplayPreferences } from "./display.mjs";

// Inline in <head>: restore reading preferences before the first paint.
document.documentElement.setAttribute(FONT_ATTRIBUTE, savedFontPreference(fonts));
applyDisplayPreferences(savedDisplayPreferences(display));
