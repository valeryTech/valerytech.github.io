import { ui, engagement } from "@params";
import { initNavigation } from "./navigation/index.mjs";
import { initFontPreference } from "./preferences/font.mjs";
import { initInteractionAnalytics } from "./analytics/interactions.mjs";
import { initReaderEngagementAnalytics } from "./analytics/engagement.mjs";

function initSite() {
  initFontPreference(ui.fonts);
  initNavigation(ui.navigation);
  initInteractionAnalytics();
  initReaderEngagementAnalytics(engagement);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initSite, { once: true });
} else {
  initSite();
}
