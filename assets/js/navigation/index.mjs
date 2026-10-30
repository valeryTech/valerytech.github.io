import { initTopLevelSidebarAccordion } from "./accordion.mjs";
import { initOutline } from "./outline.mjs";
import { initStickyNavigation } from "./sticky-context.mjs";
import { initPaneResize } from "./resize.mjs";

export function initNavigation(config) {
  initPaneResize(config.resize);
  initOutline(config.outline);
  initTopLevelSidebarAccordion();
  initStickyNavigation();
}
