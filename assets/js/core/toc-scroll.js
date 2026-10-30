// Replace Hextra's single-heading observer with the site's reading-position
// behavior. All outline levels share one active section and its ancestor path.
document.addEventListener("DOMContentLoaded", () => {
  const outlines = [...document.querySelectorAll(".site-page-outline")];
  const links = outlines.flatMap((outline) => [...outline.querySelectorAll('a[href^="#"]')]);
  const headings = [];
  const seen = new Set();

  function targetId(hash) {
    try {
      return decodeURIComponent(hash.slice(1));
    } catch {
      return hash.slice(1);
    }
  }

  for (const link of links) {
    const id = targetId(link.hash);
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
    const stickyOffset = parseFloat(getComputedStyle(link).getPropertyValue('--site-sticky-offset')) || 0;
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
      const active = targetId(link.hash) === id;
      link.classList.toggle("active", active);
      link.classList.remove("active-ancestor");
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    }
    for (const link of links.filter((link) => targetId(link.hash) === id)) {
      let item = link.closest("li");
      while ((item = item?.parentElement.closest("li"))) {
        item.querySelector(":scope > a")?.classList.add("active-ancestor");
      }
      if (changed) keepVisible(link);
    }
    if (changed) document.dispatchEvent(new Event('site:outline-change'));
  }

  function update() {
    scheduled = false;
    const contextBottom = document.querySelector('.breadcrumb')?.getBoundingClientRect().bottom || 0;
    const readingLine = Math.max(120, contextBottom + 16, Math.round(window.innerHeight * 0.35));
    let current = headings[0].id;
    for (const { id, heading } of headings) {
      if (heading.getBoundingClientRect().top <= readingLine) current = id;
      else break;
    }
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 1 && window.scrollY >= maxScroll - 2) current = headings.at(-1).id;
    // A clicked/deep-linked heading sits at its scroll margin. Keep that exact
    // destination selected even when a short following section is also visible.
    const destination = headings.find(({ id }) => id === targetId(window.location.hash));
    if (destination) {
      const margin = parseFloat(getComputedStyle(destination.heading).scrollMarginTop) || 0;
      if (Math.abs(destination.heading.getBoundingClientRect().top - margin) < 3) current = destination.id;
    }
    markActive(current);
  }

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(update);
  }

  function followHash() {
    const id = targetId(window.location.hash);
    if (seen.has(id)) markActive(id);
    else update();
  }

  for (const outline of outlines) {
    outline.addEventListener("click", (event) => {
      const link = event.target.closest?.('a[href^="#"]');
      if (!link || event.defaultPrevented) return;
      if (outline.matches("details")) outline.open = false;
      markActive(targetId(link.hash));
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
  document.addEventListener('site:navigation-layout', () => {
    scheduleUpdate();
    links.filter((link) => link.classList.contains('active')).forEach(keepVisible);
  });
  // Mark deep links immediately; scroll events keep the state correct afterwards.
  followHash();
});
