import { loadPaneWidths, savePaneWidths } from "../preferences/panes.mjs";

const paneNames = { sidebar: "Site navigation width", outline: "Page outline width" };

export function initPaneResize(config) {
  const layout = document.querySelector(".site-page-layout");
  const column = layout?.querySelector(".site-article-column");
  if (!column) return;
  const panes = [...layout.querySelectorAll("[data-site-pane]")].map((element) => {
    const name = element.dataset.sitePane;
    const handle = document.createElement("div");
    handle.className = `site-pane-resizer site-${name}-resizer`;
    handle.tabIndex = 0;
    handle.setAttribute("role", "separator");
    handle.setAttribute("aria-label", paneNames[name]);
    handle.setAttribute("aria-orientation", "vertical");
    handle.setAttribute("aria-controls", element.id);
    handle.setAttribute("aria-describedby", "pane-resize-help");
    handle.title = "Drag to resize. Double-click or press Enter to reset.";
    (element.querySelector(".site-toc-frame") || element).append(handle);
    return { name, element, handle };
  });
  if (!panes.length) return;

  const help = document.createElement("span");
  help.id = "pane-resize-help";
  help.className = "hx:sr-only";
  help.textContent =
    "Drag or use Left and Right arrow keys to resize. Home and End select the smallest and " +
    "largest widths. Double-click or press Enter to reset. Escape cancels a drag.";
  layout.append(help);
  const desired = loadPaneWidths(config);
  let drag;
  let scheduled = false;

  function state() {
    const visible = panes.filter((pane) => pane.handle.getClientRects().length);
    for (const pane of visible) pane.defaultWidth ??= pane.element.getBoundingClientRect().width;
    const fixed = [...layout.querySelectorAll(":scope > aside")]
      .filter((element) => !visible.some((pane) => pane.element === element))
      .filter((element) => {
        const style = getComputedStyle(element);
        return style.display !== "none" && style.position !== "fixed";
      })
      .reduce((sum, element) => sum + element.getBoundingClientRect().width, 0);
    return {
      visible,
      budget: layout.clientWidth - (parseFloat(getComputedStyle(column).minWidth) || 0) - fixed,
    };
  }

  function range(pane) {
    const style = getComputedStyle(pane.element);
    return { min: parseFloat(style.minWidth), max: parseFloat(style.maxWidth) };
  }

  function limits(pane, current) {
    const { min, max } = range(pane);
    const otherWidth = current.visible
      .filter((other) => other !== pane)
      .reduce((sum, other) => sum + other.element.getBoundingClientRect().width, 0);
    return { min, max: Math.max(min, Math.min(max, current.budget - otherWidth)) };
  }

  function setWidth(pane, width) {
    layout.style.setProperty(`--site-${pane.name}-width`, `${Math.floor(width)}px`);
  }

  function describe(current) {
    for (const pane of current.visible) {
      const { min, max } = limits(pane, current);
      const value = Math.round(pane.element.getBoundingClientRect().width);
      pane.handle.setAttribute("aria-valuemin", Math.round(min));
      pane.handle.setAttribute("aria-valuemax", Math.floor(max));
      pane.handle.setAttribute("aria-valuenow", value);
      pane.handle.setAttribute("aria-valuetext", `${value} pixels`);
    }
  }

  function restore() {
    const current = state();
    const targets = current.visible.map((pane) => {
      const { min, max } = range(pane);
      return {
        pane,
        min,
        width: Math.max(min, Math.min(max, desired[pane.name] ?? pane.defaultWidth)),
      };
    });
    const minimum = targets.reduce((sum, target) => sum + target.min, 0);
    const total = targets.reduce((sum, target) => sum + target.width, 0);
    const scale =
      total > current.budget ? Math.max(0, (current.budget - minimum) / (total - minimum)) : 1;
    for (const { pane, min, width } of targets) setWidth(pane, min + (width - min) * scale);
    describe(current);
  }

  function scheduleRestore() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      if (!drag) restore();
    });
  }

  function persist() {
    savePaneWidths(config, desired);
  }

  function resize(pane, width) {
    const current = state();
    const { min, max } = limits(pane, current);
    desired[pane.name] = Math.max(min, Math.min(max, width));
    setWidth(pane, desired[pane.name]);
    describe(current);
  }

  function finish(cancel = false) {
    if (!drag) return;
    const { pane, pointerId, previous } = drag;
    drag = null;
    if (cancel) {
      if (previous === undefined) delete desired[pane.name];
      else desired[pane.name] = previous;
      restore();
    } else persist();
    describe(state());
    pane.handle.removeAttribute("data-resizing");
    document.documentElement.classList.remove("site-resizing-panes");
    if (pane.handle.hasPointerCapture(pointerId)) pane.handle.releasePointerCapture(pointerId);
  }

  function reset(pane) {
    delete desired[pane.name];
    restore();
    persist();
  }

  for (const pane of panes) {
    const { handle } = pane;
    const direction = () =>
      (pane.name === "sidebar" ? 1 : -1) * (getComputedStyle(layout).direction === "rtl" ? -1 : 1);
    handle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || !event.isPrimary || drag) return;
      event.preventDefault();
      handle.focus({ preventScroll: true });
      drag = {
        pane,
        pointerId: event.pointerId,
        x: event.clientX,
        width: pane.element.getBoundingClientRect().width,
        previous: desired[pane.name],
      };
      handle.setPointerCapture(event.pointerId);
      handle.setAttribute("data-resizing", "");
      document.documentElement.classList.add("site-resizing-panes");
    });
    handle.addEventListener("pointermove", (event) => {
      if (drag?.pane !== pane || drag.pointerId !== event.pointerId) return;
      resize(pane, drag.width + (event.clientX - drag.x) * direction());
    });
    handle.addEventListener("pointerup", () => {
      if (drag?.pane === pane) finish();
    });
    handle.addEventListener("pointercancel", () => {
      if (drag?.pane === pane) finish(true);
    });
    handle.addEventListener("lostpointercapture", () => {
      if (drag?.pane === pane) finish();
    });
    handle.addEventListener("dblclick", () => reset(pane));
    handle.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && drag) {
        event.preventDefault();
        finish(true);
        return;
      }
      if (drag) return;
      if (event.key === "Enter") {
        event.preventDefault();
        reset(pane);
        return;
      }
      const { min, max } = limits(pane, state());
      const current = pane.element.getBoundingClientRect().width;
      const step = config.keyboardStepPixels * direction();
      const next = { ArrowLeft: current - step, ArrowRight: current + step, Home: min, End: max }[
        event.key
      ];
      if (next === undefined) return;
      event.preventDefault();
      resize(pane, next);
      persist();
    });
  }

  new ResizeObserver(scheduleRestore).observe(layout);
  document.addEventListener("site:pane-widths-change", (event) => {
    finish(true);
    for (const key of Object.keys(desired)) delete desired[key];
    Object.assign(desired, event.detail.widths);
    restore();
  });
  window.addEventListener("resize", () => {
    finish(true);
    scheduleRestore();
  });
  window.addEventListener("blur", () => finish());
  restore();
}
