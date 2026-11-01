export function initPaneViewport() {
  const layout = document.querySelector(".site-page-layout");
  const header = document.querySelector(".hextra-nav-container");
  if (!layout || !header) return;
  const panes = [...layout.querySelectorAll(":scope > aside")];
  const outline = layout.querySelector("#page-outline");
  const actions = outline?.querySelector(".site-toc-controls");
  const content = layout.querySelector(".site-main > .content");
  const navigation = layout.querySelector(".site-page-nav-footer");
  let scheduled = false;
  let previousHeight;
  let previousOutlineBounds;

  function update() {
    scheduled = false;
    const visible = panes.some(
      (pane) => pane.parentElement === layout && pane.getClientRects().length,
    );
    layout.toggleAttribute("data-viewport-panes", visible);
    if (!visible) {
      layout.style.removeProperty("--site-pane-available-height");
      outline?.style.removeProperty("--site-pane-available-height");
      outline?.style.removeProperty("--site-outline-end-gap");
      previousHeight = undefined;
      previousOutlineBounds = undefined;
      return;
    }
    const bounds = layout.getBoundingClientRect();
    const top = Math.max(header.getBoundingClientRect().bottom, bounds.top);
    const height = Math.max(0, Math.min(innerHeight, bounds.bottom) - top);
    let changed = height !== previousHeight;
    if (changed) {
      previousHeight = height;
      layout.style.setProperty("--site-pane-available-height", `${height}px`);
    }
    if (outline && content && !navigation) {
      const style = getComputedStyle(outline);
      const padding = actions ? parseFloat(getComputedStyle(actions).paddingBlockEnd) || 0 : 0;
      const minimum = parseFloat(style.minBlockSize) || 0;
      // Overview endings have no navigation row. Their action stops at the
      // content boundary, including collapsed margins and the column's padding.
      const gap = Math.min(
        Math.max(0, bounds.bottom - content.getBoundingClientRect().bottom - padding),
        Math.max(0, bounds.height - minimum),
      );
      const available = Math.max(0, Math.min(innerHeight, bounds.bottom - gap) - top);
      const nextBounds = `${gap}:${available}`;
      if (nextBounds !== previousOutlineBounds) {
        previousOutlineBounds = nextBounds;
        outline.style.setProperty("--site-outline-end-gap", `${gap}px`);
        outline.style.setProperty("--site-pane-available-height", `${available}px`);
        changed = true;
      }
    }
    if (changed) document.dispatchEvent(new Event("site:navigation-layout"));
  }

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  }

  const observer = new ResizeObserver(scheduleUpdate);
  observer.observe(layout);
  observer.observe(header);
  if (content) observer.observe(content);
  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("pageshow", scheduleUpdate);
  document.addEventListener("site:display-change", scheduleUpdate);
  document.addEventListener("site:drawer-change", scheduleUpdate);
  update();
}
