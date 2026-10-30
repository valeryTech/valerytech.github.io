import { headingId, outlineParents } from "./hierarchy.mjs";

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
    const readingLine = Math.max(
      config.minimumReadingLinePixels,
      parseFloat(getComputedStyle(headings[0].heading).scrollMarginTop) || 0,
      Math.round(window.innerHeight * config.readingViewportFraction),
    );
    let current = headings[0].id;
    for (const { id, heading } of headings) {
      if (heading.getBoundingClientRect().top <= readingLine) current = id;
      else break;
    }
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 1 && window.scrollY >= maxScroll - config.bottomTolerancePixels)
      current = headings.at(-1).id;
    // A clicked/deep-linked heading sits at its scroll margin. Keep that exact
    // destination selected even when a short following section is also visible.
    const destination = headings.find(({ id }) => id === headingId(window.location.hash));
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
    if (seen.has(id)) markActive(id);
    else update();
  }

  for (const outline of outlines) {
    outline.addEventListener("click", (event) => {
      const link = event.target.closest?.('a[href^="#"]');
      if (!link || event.defaultPrevented) return;
      if (outline.matches("details")) outline.open = false;
      markActive(headingId(link.hash));
    });
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", () => {
    update();
    links.filter((link) => link.classList.contains("active")).forEach(keepVisible);
  });
  window.addEventListener("hashchange", followHash);
  window.addEventListener("pageshow", scheduleUpdate);
  window.addEventListener("load", scheduleUpdate);
  document.addEventListener("site:navigation-layout", () => {
    scheduleUpdate();
    links.filter((link) => link.classList.contains("active")).forEach(keepVisible);
  });
  // Mark deep links immediately; scroll events keep the state correct afterwards.
  followHash();
}
