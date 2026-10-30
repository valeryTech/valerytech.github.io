import { initTopLevelSidebarAccordion } from "./accordion.mjs";
import { initOutline } from "./outline.mjs";
import { initStickyNavigation } from "./sticky-context.mjs";

export function initNavigation(config) {
  initOutline(config.outline);
  initTopLevelSidebarAccordion();
  initStickyNavigation();
}
