import { initDisclosures } from "./disclosures.mjs";
import { headingId, outlineParents } from "./hierarchy.mjs";

// The page outline's disclosures share one state per page with its popover copy
// and apply before the first paint. A deep-linked heading's branches open on arrival.
export function initOutlineDisclosures(storageKey) {
  const outlines = [...document.querySelectorAll(".site-page-outline")];
  const target = location.hash;
  initDisclosures({
    toggles: outlines.flatMap((outline) => [
      ...outline.querySelectorAll(".site-outline-branch-toggle"),
    ]),
    bulkButtons: [...document.querySelectorAll("[data-outline-bulk]")],
    storageKey: `${storageKey}:${location.pathname}`,
    keepOpen: (toggle) =>
      Boolean(target) &&
      [...document.getElementById(toggle.getAttribute("aria-controls")).querySelectorAll("a")].some(
        (link) => link.hash === target,
      ),
  });
}

// A new page opens at its top, where the reading position is the first heading. Mark it
// before the first paint; initOutline takes over once the deferred scripts run. Reloads,
// history visits and deep links restore a scroll position, so they wait for initOutline.
export function markInitialOutline() {
  if (location.hash || window.scrollY > 0) return;
  const [entry] = performance.getEntriesByType?.("navigation") ?? [];
  if (entry && entry.type !== "navigate") return;
  for (const outline of document.querySelectorAll(".site-page-outline")) {
    const link = outline.querySelector('a[href^="#"]');
    if (!link) continue;
    link.classList.add("active");
    link.setAttribute("aria-current", "location");
  }
}

// Replace Hextra's single-heading observer with the site's reading-position
// behavior. All outline levels share one active section and its ancestor path.
export function initOutline(config) {
  const outlines = [...document.querySelectorAll(".site-page-outline")];
  const links = outlines.flatMap((outline) => [...outline.querySelectorAll('a[href^="#"]')]);
  const headings = [];
  const seen = new Set();

  for (const link of links) {
    const id = headingId(link.hash);
    const heading = document.getElementById(id);
    if (heading && !seen.has(id)) {
      headings.push({ id, heading });
      seen.add(id);
    }
  }
  if (!headings.length) return;

  let activeId = null;
  let scheduled = false;

  function keepVisible(link) {
    // A collapsed branch keeps its nearest visible heading in view instead.
    link = [link, ...outlineParents(link).reverse()].find((item) => item.getClientRects().length);
    if (!link) return;
    const panel = link.closest(".site-toc-scroll");
    if (!panel || !panel.getClientRects().length) return;
    const bounds = panel.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    const padding = parseFloat(getComputedStyle(panel).scrollPaddingTop) || 0;
    const stickyOffset =
      parseFloat(getComputedStyle(link).getPropertyValue("--site-sticky-offset")) || 0;
    const top = bounds.top + Math.max(padding, stickyOffset);
    if (rect.top < top) {
      panel.scrollTop -= top - rect.top;
    } else if (rect.bottom > bounds.bottom - padding) {
      panel.scrollTop += rect.bottom - bounds.bottom + padding;
    }
  }

  function markActive(id) {
    const changed = activeId !== id;
    activeId = id;
    for (const link of links) {
      const active = headingId(link.hash) === id;
      link.classList.toggle("active", active);
      link.classList.remove("active-ancestor");
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
    for (const link of links.filter((link) => headingId(link.hash) === id)) {
      for (const parent of outlineParents(link)) parent.classList.add("active-ancestor");
      if (changed) keepVisible(link);
    }
    if (changed) document.dispatchEvent(new Event("site:outline-change"));
  }

  function update() {
    scheduled = false;
    const visibleHeadings = headings.filter(({ heading }) => heading.getClientRects().length);
    if (!visibleHeadings.length) return;
    const readingLine = Math.max(
      config.minimumReadingLinePixels,
      parseFloat(getComputedStyle(visibleHeadings[0].heading).scrollMarginTop) || 0,
      Math.round(window.innerHeight * config.readingViewportFraction),
    );
    let current = visibleHeadings[0].id;
    for (const { id, heading } of visibleHeadings) {
      if (heading.getBoundingClientRect().top <= readingLine) current = id;
      else break;
    }
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 1 && window.scrollY >= maxScroll - config.bottomTolerancePixels)
      current = visibleHeadings.at(-1).id;
    // A clicked/deep-linked heading sits at its scroll margin. Keep that exact
    // destination selected even when a short following section is also visible.
    const destination = visibleHeadings.find(({ id }) => id === headingId(window.location.hash));
    if (destination) {
      const margin = parseFloat(getComputedStyle(destination.heading).scrollMarginTop) || 0;
      if (
        Math.abs(destination.heading.getBoundingClientRect().top - margin) <
        config.targetTolerancePixels
      )
        current = destination.id;
    }
    markActive(current);
  }

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  }

  function followHash() {
    const id = headingId(window.location.hash);
    if (seen.has(id)) {
      revealHeading(id);
      markActive(id);
    } else update();
  }

  function revealHeading(id) {
    let parent = document.getElementById(id)?.parentElement;
    while (parent) {
      if (parent.tagName === "DETAILS") parent.open = true;
      parent = parent.parentElement;
    }
  }

  for (const outline of outlines) {
    outline.closest("[popover]")?.addEventListener("beforetoggle", (event) => {
      // Refresh before opening even if the latest page scroll has not painted yet.
      if (event.newState === "open") update();
    });
    outline.addEventListener("click", (event) => {
      const link = event.target.closest?.('a[href^="#"]');
      if (!link || event.defaultPrevented) return;
      revealHeading(headingId(link.hash));
      const popover = outline.closest("[popover]");
      if (popover?.matches(":popover-open")) popover.hidePopover();
      markActive(headingId(link.hash));
    });
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", () => {
    update();
    links.filter((link) => link.classList.contains("active")).forEach(keepVisible);
  });
  window.addEventListener("hashchange", followHash);
  document.querySelector(".section-overview")?.addEventListener("toggle", scheduleUpdate, true);
  window.addEventListener("pageshow", scheduleUpdate);
  window.addEventListener("load", scheduleUpdate);
  document.addEventListener("site:navigation-layout", () => {
    // A viewport resize can follow a page scroll in the same frame. Refresh the
    // reading position before revealing a link from the previous scroll position.
    update();
    links.filter((link) => link.classList.contains("active")).forEach(keepVisible);
  });
  // Mark deep links immediately; scroll events keep the state correct afterwards.
  followHash();
}
