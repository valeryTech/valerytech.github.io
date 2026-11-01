export function initBreadcrumbNavigation() {
  const breadcrumb = document.querySelector(".breadcrumb");
  if (!breadcrumb || typeof HTMLElement.prototype.showPopover !== "function") return;

  const controls = [...breadcrumb.querySelectorAll("[data-breadcrumb-chooser]")].map((button) => ({
    button,
    panel: document.getElementById(button.getAttribute("popovertarget")),
  }));
  let active;
  let scheduled = false;

  function updateScrollHints(panel) {
    const remaining = panel.scrollHeight - panel.clientHeight - panel.scrollTop;
    panel.toggleAttribute("data-scroll-up", panel.scrollTop > 1);
    panel.toggleAttribute("data-scroll-down", remaining > 1);
  }

  function position() {
    scheduled = false;
    if (!active || !active.panel.matches(":popover-open")) return;
    const { button, panel } = active;
    const anchor = button.getBoundingClientRect();
    if (!anchor.height || anchor.bottom <= 0 || anchor.top >= innerHeight) {
      panel.hidePopover();
      return;
    }
    const style = getComputedStyle(panel);
    const scrollTop = panel.scrollTop;
    const gap = parseFloat(style.paddingTop);
    const context = breadcrumb.getBoundingClientRect();
    const bottom = Math.max(anchor.bottom, context.bottom);
    const start = Math.min(anchor.top, context.top);
    const below = Math.max(0, innerHeight - bottom - gap * 2);
    const above = Math.max(0, start - gap * 2);
    panel.style.removeProperty("--site-chooser-available-height");
    const flip = panel.getBoundingClientRect().height > below && above > below;
    panel.style.setProperty("--site-chooser-available-height", `${flip ? above : below}px`);
    panel.style.setProperty(
      "--site-chooser-title-height",
      `${panel.querySelector(".site-breadcrumb-chooser-title").getBoundingClientRect().height}px`,
    );
    const box = panel.getBoundingClientRect();
    const desired = style.direction === "rtl" ? anchor.right - box.width : anchor.left;
    const left = Math.max(gap, Math.min(desired, innerWidth - box.width - gap));
    const top = flip ? Math.max(gap, start - gap - box.height) : bottom + gap;
    panel.style.setProperty("--site-chooser-left", `${left}px`);
    panel.style.setProperty("--site-chooser-top", `${top}px`);
    panel.scrollTop = scrollTop;
    panel.dataset.positioned = "";
    if (panel.contains(document.activeElement) && document.activeElement.matches("a"))
      focusLink(panel, document.activeElement);
    updateScrollHints(panel);
  }

  function schedulePosition() {
    if (!active || scheduled) return;
    scheduled = true;
    requestAnimationFrame(position);
  }

  function close(control, restoreFocus = false) {
    if (control.panel.matches(":popover-open")) control.panel.hidePopover();
    if (restoreFocus) control.button.focus({ preventScroll: true });
  }

  function focusLink(panel, link) {
    if (!link) return;
    if (link === panel.querySelector("a")) panel.scrollTop = 0;
    link.focus({ preventScroll: true });
    const bounds = panel.getBoundingClientRect();
    const target = link.getBoundingClientRect();
    const padding = parseFloat(getComputedStyle(panel).paddingTop);
    const hintSize = panel
      .querySelector(".site-breadcrumb-scroll-hint")
      .getBoundingClientRect().height;
    const title = panel.querySelector(".site-breadcrumb-chooser-title").getBoundingClientRect();
    const top = Math.max(bounds.top, title.bottom) + padding + (panel.scrollTop > 1 ? hintSize : 0);
    const bottom =
      bounds.bottom -
      padding -
      (panel.scrollHeight - panel.clientHeight - panel.scrollTop > 1 ? hintSize : 0);
    if (target.top < top) panel.scrollTop += target.top - top;
    else if (target.bottom > bottom) panel.scrollTop += target.bottom - bottom;
    updateScrollHints(panel);
  }

  for (const control of controls) {
    const { button, panel } = control;
    panel.addEventListener("scroll", () => updateScrollHints(panel), { passive: true });
    panel.addEventListener("beforetoggle", (event) => {
      button.setAttribute("aria-expanded", String(event.newState === "open"));
      if (event.newState === "closed") {
        delete panel.dataset.positioned;
        if (active === control) active = undefined;
      }
    });
    panel.addEventListener("toggle", () => {
      if (!panel.matches(":popover-open")) return;
      active = control;
      position();
      const current = panel.querySelector('a[aria-current="page"], a[data-current-branch]');
      focusLink(panel, current || panel.querySelector("a"));
    });
    panel.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        close(control, true);
        return;
      }
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const links = [...panel.querySelectorAll("a")];
      const index = links.indexOf(document.activeElement);
      let next;
      if (event.key === "ArrowDown") next = Math.min(index + 1, links.length - 1);
      else if (event.key === "ArrowUp") next = Math.max(index - 1, 0);
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = links.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      focusLink(panel, links[next]);
    });
    button.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (panel.matches(":popover-open")) focusLink(panel, panel.querySelector("a"));
        else panel.showPopover();
      } else if (event.key === "Escape" && panel.matches(":popover-open")) {
        event.preventDefault();
        event.stopPropagation();
        close(control, true);
      }
    });
    button.hidden = false;
  }
  if (controls.length) breadcrumb.dataset.choosers = "";
  window.addEventListener("resize", schedulePosition);
  window.addEventListener(
    "scroll",
    (event) => {
      if (event.target instanceof Node && active?.panel.contains(event.target)) return;
      schedulePosition();
    },
    { capture: true, passive: true },
  );
  document.addEventListener("site:navigation-layout", schedulePosition);
}
