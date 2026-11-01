import { outlineParents, updatePinnedRows } from "./hierarchy.mjs";
import { measureSidebarContext } from "./sections.mjs";

// Keep the original tree controls sticky, so the pinned path remains usable.
export function initStickyNavigation() {
  const breadcrumb = document.querySelector(".breadcrumb");
  const tree = document.querySelector(".section-nav");
  const root = tree?.querySelector(".sidebar-root");
  const sectionRows = [...(tree?.querySelectorAll(".site-sidebar-section-row") || [])];
  const outline = document.querySelector(".hextra-toc #TableOfContents");
  const title = document.querySelector(".hextra-toc .site-toc-title");
  const outlineLinks = [...(outline?.querySelectorAll("a") || [])];
  let scheduled = false;

  // Headings with subheadings stick as their row, keeping the disclosure beside the link.
  const outlineRows = [...(outline?.querySelectorAll(".site-outline-row") || [])];
  for (const row of outlineRows) row.classList.add("site-toc-parent");
  const stickyRow = (link) => link.closest(".site-outline-row") ?? link;
  const outlinePaths = new Map(outlineLinks.map((link) => [link, outlineParents(link)]));
  const panes = [
    { panel: tree?.closest(".site-sidebar-scroll"), root, rows: sectionRows },
    {
      panel: outline?.closest(".site-toc-scroll"),
      root: title,
      rows: outlineRows,
    },
  ].filter((pane) => pane.panel && pane.root);
  let pinsScheduled = false;

  function updatePins() {
    pinsScheduled = false;
    for (const { panel, root, rows } of panes) {
      updatePinnedRows(panel, root, rows);
    }
  }

  function schedulePins() {
    if (pinsScheduled) return;
    pinsScheduled = true;
    requestAnimationFrame(updatePins);
  }

  function rowHeight(element) {
    return element ?
        element.getBoundingClientRect().height +
          (parseFloat(getComputedStyle(element).marginBottom) || 0)
      : 0;
  }

  function measure() {
    scheduled = false;
    const breadcrumbPinned =
      breadcrumb && getComputedStyle(breadcrumb.parentElement).position === "sticky";
    const breadcrumbHeight = breadcrumb?.getBoundingClientRect().height || 0;
    const style = document.documentElement.style;
    // Visual controls follow the card even when it does not contribute to scroll clearance.
    if (breadcrumbHeight)
      style.setProperty("--site-breadcrumb-card-height", `${breadcrumbHeight}px`);
    else style.removeProperty("--site-breadcrumb-card-height");
    style.setProperty("--site-breadcrumb-height", `${breadcrumbPinned ? breadcrumbHeight : 0}px`);
    const titleHeight = rowHeight(title);
    // CSS owns the compact-viewport policy; keep JS measurement in sync with it.
    const stackParents =
      getComputedStyle(document.documentElement).getPropertyValue("--site-stack-parents").trim() !==
      "0";
    measureSidebarContext(tree, stackParents);
    const heights = new Map(outlineLinks.map((link) => [link, rowHeight(stickyRow(link))]));
    for (const [link, parents] of outlinePaths) {
      const offset = (stackParents ? parents : []).reduce(
        (sum, parent) => sum + heights.get(parent),
        titleHeight,
      );
      for (const element of new Set([link, stickyRow(link)])) {
        element.style.setProperty("--site-sticky-offset", `${offset}px`);
        element.style.setProperty("--site-sticky-depth", `${parents.length}`);
      }
    }
    updatePins();
    document.dispatchEvent(new Event("site:navigation-layout"));
  }

  function scheduleMeasure() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(measure);
  }

  function revealHash() {
    let id;
    try {
      id = decodeURIComponent(location.hash.slice(1));
    } catch {
      return;
    }
    const heading = id ? document.getElementById(id) : null;
    if (!heading?.matches(".content :is(h1, h2, h3, h4, h5, h6)")) return;
    const top = heading.getBoundingClientRect().top;
    const margin = parseFloat(getComputedStyle(heading).scrollMarginTop);
    if (top >= 0 && top < margin - 1 && window.scrollY > 0) {
      window.scrollBy({ top: top - margin, behavior: "instant" });
    }
  }

  const observer = new ResizeObserver(scheduleMeasure);
  for (const element of [breadcrumb, tree, root, outline, title]) {
    if (element) observer.observe(element);
  }
  for (const { panel } of panes) panel.addEventListener("scroll", schedulePins, { passive: true });
  tree?.closest(".hextra-sidebar-container")?.addEventListener("transitionend", schedulePins);
  window.addEventListener("scroll", schedulePins, { passive: true });
  document.addEventListener("site:outline-change", scheduleMeasure);
  document.addEventListener("site:display-change", scheduleMeasure);
  document.addEventListener("site:drawer-change", measure);
  document.addEventListener("site:font-change", scheduleMeasure);
  window.addEventListener("resize", scheduleMeasure);
  window.addEventListener("load", () => {
    measure();
    revealHash();
  });
  document.fonts?.ready.then(scheduleMeasure);
  document.fonts?.addEventListener("loadingdone", scheduleMeasure);
  measure();
  revealHash();
}
