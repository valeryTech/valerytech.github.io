import { fonts, display, navigation } from "@params";
import { FONT_ATTRIBUTE, savedFontPreference } from "./font-settings.mjs";
import { applyDisplayPreferences, savedDisplayPreferences } from "./display.mjs";
import { applyPaneWidths, loadPaneWidths } from "./panes.mjs";

// Inline in <head>: restore reading preferences before the first paint.
document.documentElement.setAttribute(FONT_ATTRIBUTE, savedFontPreference(fonts));
applyDisplayPreferences(savedDisplayPreferences(display));
applyPaneWidths(loadPaneWidths(navigation.resize));
