import { initSectionNavigation } from "./sections.mjs";
import { initOutline } from "./outline.mjs";
import { initOutlineMap } from "./outline-map.mjs";
import { initReadingFade, initSidebarFade } from "./reading-fade.mjs";
import { initStickyNavigation } from "./sticky-context.mjs";
import { initPaneResize } from "./resize.mjs";
import { initHeaderAlignment, initHeaderVisibility } from "./header.mjs";
import { initPaneViewport } from "./pane-viewport.mjs";
import { initSidebarVisibility, initOutlineVisibility } from "./sidebar-visibility.mjs";
import { initBreadcrumbNavigation } from "./breadcrumbs.mjs";
import { initNavigationDrawer, initOutlinePopover } from "./drawers.mjs";

export function initNavigation(config, preferences) {
  initNavigationDrawer();
  initOutlinePopover(config.swipe);
  initSidebarVisibility(preferences);
  initOutlineVisibility(preferences);
  initHeaderVisibility(preferences);
  initPaneViewport();
  initPaneResize(config.resize, preferences);
  initHeaderAlignment();
  initOutline(config.outline);
  initOutlineMap();
  initSectionNavigation();
  initBreadcrumbNavigation();
  initStickyNavigation();
  initReadingFade();
  initSidebarFade();
}
