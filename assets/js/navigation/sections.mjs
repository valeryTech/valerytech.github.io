import { initDisclosures } from "./disclosures.mjs";
import { sidebarParents, updatePinnedRows } from "./hierarchy.mjs";

function rowHeight(element) {
  return element ?
      element.getBoundingClientRect().height +
        (parseFloat(getComputedStyle(element).marginBottom) || 0)
    : 0;
}

// Section chevrons become disclosures before the first paint; the current
// page's branch still opens on arrival.
export function initSectionToggles(storageKey) {
  const tree = document.querySelector(".section-nav");
  if (!tree || tree.hasAttribute("data-section-toggles")) return;
  tree.setAttribute("data-section-toggles", "");
  initDisclosures({
    toggles: [...tree.querySelectorAll(".site-sidebar-section-toggle")],
    bulkButtons: [...tree.querySelectorAll("[data-sidebar-bulk]")],
    storageKey,
    keepOpen: (toggle) => toggle.closest(".sidebar-group").matches(".active, .active-ancestor"),
  });
}

// Shared by the parser-time initializer and subsequent sticky-layout updates.
export function measureSidebarContext(tree, stackParents) {
  if (!tree) return;
  const root = tree.querySelector(".sidebar-root");
  const rows = [...tree.querySelectorAll(".site-sidebar-section-row")];
  for (const row of rows) row.classList.add("site-sticky-section");
  const heights = new Map(rows.map((row) => [row, rowHeight(row)]));
  const rootHeight = rowHeight(root);
  stackParents ??=
    getComputedStyle(document.documentElement).getPropertyValue("--site-stack-parents").trim() !==
    "0";
  for (const element of [...rows, ...tree.querySelectorAll("a")]) {
    const parents = sidebarParents(element, tree);
    const offset = (stackParents ? parents : []).reduce(
      (sum, parent) => sum + heights.get(parent),
      rootHeight,
    );
    element.style.setProperty("--site-sticky-offset", `${offset}px`);
    element.style.setProperty("--site-sticky-depth", `${parents.length}`);
  }
  root?.querySelector("a")?.style.setProperty("--site-sticky-offset", "0px");
  return { root, rows };
}

export function initSectionNavigation() {
  const tree = document.querySelector(".section-nav");
  if (!tree) return;
  const { root, rows } = measureSidebarContext(tree);
  const panel = tree.closest(".site-sidebar-scroll");
  const current = tree.querySelector('a[aria-current="page"]');
  if (!panel?.getClientRects().length || !current) return;
  const bounds = panel.getBoundingClientRect();
  const item = current.getBoundingClientRect();
  const style = getComputedStyle(panel);
  const offset =
    parseFloat(getComputedStyle(current).getPropertyValue("--site-sticky-offset")) || 0;
  const top = bounds.top + (parseFloat(style.paddingTop) || 0) + offset;
  const bottom =
    bounds.bottom -
    Math.max(parseFloat(style.paddingBottom) || 0, parseFloat(style.scrollPaddingBlockEnd) || 0);
  if (item.top < top) panel.scrollTop -= top - item.top;
  else if (item.bottom > bottom) panel.scrollTop += item.bottom - bottom;
  updatePinnedRows(panel, root, rows);
}
