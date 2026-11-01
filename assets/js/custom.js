import { ui, engagement } from "@params";
import { initNavigation } from "./navigation/index.mjs";
import { initFontPreference } from "./preferences/font.mjs";
import { createPreferenceStore } from "./preferences/store.mjs";
import { initSettings } from "./settings/index.mjs";
import { initInteractionAnalytics } from "./analytics/interactions.mjs";
import { initReaderEngagementAnalytics } from "./analytics/engagement.mjs";

function initSite() {
  const preferences = createPreferenceStore(ui);
  preferences.apply();
  initFontPreference(ui.fonts, preferences);
  initNavigation(ui.navigation, preferences);
  initSettings(ui.settings, preferences, ui.palette);
  initInteractionAnalytics();
  initReaderEngagementAnalytics(engagement);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSite, { once: true });
} else {
  initSite();
}
