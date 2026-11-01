// Fade the article's bottom edge until its end scrolls into view. The reading startup
// script calls this before the first paint; initReadingFade keeps it current afterwards.
export function syncReadingFade() {
  const fade = document.querySelector("[data-reading-fade]");
  const end = document.querySelector("[data-reading-end]");
  if (!fade || !end) return false;
  const finished = end.getBoundingClientRect().top <= window.innerHeight;
  if (fade.hidden !== finished) fade.hidden = finished;
  return true;
}

export function initReadingFade() {
  if (!syncReadingFade()) return;
  let scheduled = false;

  function update() {
    scheduled = false;
    syncReadingFade();
  }

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate);
  window.addEventListener("pageshow", scheduleUpdate);
  const observer = new ResizeObserver(scheduleUpdate);
  observer.observe(document.querySelector(".site-main > .content"));
  update();
}

function sidebarFade() {
  const pane = document.querySelector('[data-site-pane="sidebar"]');
  const panel = pane?.querySelector(".site-sidebar-scroll");
  const fade = pane?.querySelector("[data-sidebar-fade]");
  return panel && fade ? { panel, fade } : null;
}

// Show the fade while the sidebar has entries below its bottom edge. The sidebar startup
// script calls this before the first paint; initSidebarFade keeps it current afterwards.
export function syncSidebarFade(parts = sidebarFade()) {
  if (!parts) return;
  const { panel, fade } = parts;
  const remaining = panel.scrollHeight - panel.clientHeight - panel.scrollTop;
  const hidden = !panel.getClientRects().length || remaining <= 1;
  if (fade.hidden !== hidden) fade.hidden = hidden;
}

export function initSidebarFade() {
  const parts = sidebarFade();
  if (!parts) return;
  const { panel, fade } = parts;
  let scheduled = false;

  function update() {
    scheduled = false;
    syncSidebarFade(parts);
  }

  function scheduleUpdate() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  }

  panel.addEventListener("scroll", scheduleUpdate, { passive: true });
  panel.addEventListener("focusin", (event) => {
    if (!event.target.matches(":focus-visible") || fade.hidden) return;
    const bounds = event.target.getBoundingClientRect();
    const top = fade.getBoundingClientRect().top;
    const padding = parseFloat(getComputedStyle(panel).paddingBottom) || 0;
    if (bounds.bottom > top - padding) panel.scrollTop += bounds.bottom - top + padding;
    update();
  });
  const observer = new ResizeObserver(scheduleUpdate);
  observer.observe(panel);
  const tree = panel.querySelector(".section-nav");
  if (tree) observer.observe(tree);
  document.addEventListener("site:drawer-change", scheduleUpdate);
  document.addEventListener("site:navigation-layout", scheduleUpdate);
  window.addEventListener("pageshow", scheduleUpdate);
  update();
}
