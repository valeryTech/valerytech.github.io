import { fonts } from "@params";
import { FONT_ATTRIBUTE, savedFontPreference } from "./font-settings.mjs";

// Inline in <head>: restore the same configured choice before the first paint.
document.documentElement.setAttribute(FONT_ATTRIBUTE, savedFontPreference(document.cookie, fonts));
