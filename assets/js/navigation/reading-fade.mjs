export function initReadingFade() {
  const fade = document.querySelector("[data-reading-fade]");
  const end = document.querySelector("[data-reading-end]");
  if (!fade || !end) return;
  let scheduled = false;

  function update() {
    scheduled = false;
    const finished = end.getBoundingClientRect().top <= window.innerHeight;
    if (fade.hidden !== finished) fade.hidden = finished;
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

export function initSidebarFade() {
  const pane = document.querySelector('[data-site-pane="sidebar"]');
  const panel = pane?.querySelector(".site-sidebar-scroll");
  const fade = pane?.querySelector("[data-sidebar-fade]");
  if (!panel || !fade) return;
  let scheduled = false;

  function update() {
    scheduled = false;
    const remaining = panel.scrollHeight - panel.clientHeight - panel.scrollTop;
    const hidden = !panel.getClientRects().length || remaining <= 1;
    if (fade.hidden !== hidden) fade.hidden = hidden;
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
