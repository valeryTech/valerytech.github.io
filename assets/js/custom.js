import { ui, engagement } from "@params";
import { initNavigation } from "./navigation/index.mjs";
import { initFontPreference } from "./preferences/font.mjs";
import { applyDisplayPreferences, savedDisplayPreferences } from "./preferences/display.mjs";
import { initSettingsPage } from "./preferences/settings.mjs";
import { initInteractionAnalytics } from "./analytics/interactions.mjs";
import { initReaderEngagementAnalytics } from "./analytics/engagement.mjs";

function initSite() {
  applyDisplayPreferences(savedDisplayPreferences(ui.display));
  initFontPreference(ui.fonts);
  initNavigation(ui.navigation);
  initSettingsPage(ui);
  initInteractionAnalytics();
  initReaderEngagementAnalytics(engagement);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSite, { once: true });
} else {
  initSite();
}
