function layoutMode(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(`--site-${name}-mode`).trim();
}

export function initNavigationDrawer() {
  const trigger = document.querySelector(".hextra-hamburger-menu");
  const pane = document.getElementById("site-navigation");
  const template = document.getElementById("site-navigation-drawer-template");
  if (
    !trigger ||
    !pane ||
    !template ||
    typeof HTMLDialogElement === "undefined" ||
    typeof HTMLDialogElement.prototype.showModal !== "function"
  )
    return;
  const slot = document.createComment("Site navigation returns here when the drawer closes.");
  pane.before(slot);
  let dialog;
  let outsidePointer = false;
  let mounted = false;

  function restore() {
    if (!mounted) return;
    mounted = false;
    slot.after(pane);
    trigger.setAttribute("aria-expanded", "false");
    trigger.querySelector("svg")?.classList.remove("open");
    document.documentElement.classList.remove("site-navigation-open");
    sync();
    document.dispatchEvent(new Event("site:drawer-change"));
  }

  function close() {
    if (!dialog?.open) return;
    dialog.close();
    restore();
    if (trigger.getClientRects().length) trigger.focus({ preventScroll: true });
  }

  function sync() {
    const drawer = layoutMode("sidebar") === "drawer";
    if (!drawer && dialog?.open) close();
    if (drawer && !dialog?.open) pane.setAttribute("aria-hidden", "true");
    else pane.removeAttribute("aria-hidden");
  }

  function outside(event) {
    const box = dialog.getBoundingClientRect();
    return (
      event.clientX < box.left ||
      event.clientX > box.right ||
      event.clientY < box.top ||
      event.clientY > box.bottom
    );
  }

  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.addEventListener("click", () => {
    if (layoutMode("sidebar") !== "drawer") return;
    if (!dialog) {
      document.body.append(template.content.cloneNode(true));
      dialog = document.getElementById("site-navigation-drawer");
      dialog.querySelector("[data-navigation-close]").addEventListener("click", close);
      dialog.addEventListener("cancel", (event) => {
        event.preventDefault();
        close();
      });
      dialog.addEventListener("close", () => {
        if (!dialog.open) restore();
      });
      dialog.addEventListener("pointerdown", (event) => {
        outsidePointer = event.target === dialog && outside(event);
      });
      dialog.addEventListener("click", (event) => {
        if (outsidePointer && event.target === dialog && outside(event)) close();
        outsidePointer = false;
      });
    }
    pane.removeAttribute("aria-hidden");
    dialog.querySelector("[data-navigation-body]").append(pane);
    mounted = true;
    document.documentElement.classList.add("site-navigation-open");
    trigger.setAttribute("aria-expanded", "true");
    trigger.querySelector("svg")?.classList.add("open");
    dialog.showModal();
    document.dispatchEvent(new Event("site:drawer-change"));
    const current = pane.querySelector("[aria-current=page]");
    const scroll = pane.querySelector(".site-sidebar-scroll");
    if (current && scroll) {
      const item = current.getBoundingClientRect();
      const box = scroll.getBoundingClientRect();
      scroll.scrollTop += item.top - box.top - (box.height - item.height) / 2;
    }
  });
  window.addEventListener("resize", sync);
  document.addEventListener("site:display-change", sync);
  sync();
}

export function initOutlinePopover(swipe) {
  const panel = document.getElementById("site-outline-popover");
  const trigger = document.querySelector(".site-outline-trigger");
  if (!panel || !trigger || typeof panel.showPopover !== "function") return;
  panel.addEventListener("beforetoggle", (event) => {
    trigger.setAttribute("aria-expanded", String(event.newState === "open"));
  });
  panel.addEventListener("toggle", () => {
    if (!panel.matches(":popover-open")) return;
    const active = panel.querySelector('[aria-current="location"]');
    if (!active) return;
    active.focus({ preventScroll: true });
    const scroll = active.closest(".site-toc-scroll");
    const item = active.getBoundingClientRect();
    const box = scroll.getBoundingClientRect();
    scroll.scrollTop += item.top - box.top - (box.height - item.height) / 2;
  });
  function sync() {
    if (layoutMode("outline") !== "popup" && panel.matches(":popover-open")) panel.hidePopover();
  }
  window.addEventListener("resize", sync);
  document.addEventListener("site:display-change", sync);
  initOutlineSwipe(trigger, swipe);
}

function initOutlineSwipe(trigger, config) {
  let gesture;

  function available() {
    return (
      layoutMode("outline") === "popup" &&
      !document.querySelector("dialog[open], [popover]:popover-open")
    );
  }

  document.addEventListener(
    "touchstart",
    (event) => {
      gesture = null;
      if (event.touches.length !== 1 || !available()) return;
      if (event.target.closest?.("input, textarea, select, button, pre, [contenteditable]")) return;
      const touch = event.touches[0];
      if (touch.clientX < window.innerWidth - config.edgeWidthPixels) return;
      gesture = { id: touch.identifier, x: touch.clientX, y: touch.clientY };
    },
    { passive: true },
  );

  document.addEventListener(
    "touchmove",
    (event) => {
      if (!gesture) return;
      const touch = [...event.touches].find((touch) => touch.identifier === gesture.id);
      if (event.touches.length !== 1 || !touch) {
        gesture = null;
        return;
      }
      const dx = gesture.x - touch.clientX;
      const dy = Math.abs(touch.clientY - gesture.y);
      // Lock to the first deliberate direction, leaving vertical reading native.
      if (Math.max(Math.abs(dx), dy) < config.minimumDistancePixels / 4) return;
      if (dx <= dy * config.directionRatio) {
        gesture = null;
        return;
      }
      if (event.cancelable) event.preventDefault();
    },
    { passive: false },
  );

  document.addEventListener(
    "touchend",
    (event) => {
      const start = gesture;
      gesture = null;
      if (!start || event.touches.length || !available()) return;
      const touch = [...event.changedTouches].find((touch) => touch.identifier === start.id);
      if (!touch) return;
      const dx = start.x - touch.clientX;
      const dy = Math.abs(touch.clientY - start.y);
      if (dx < config.minimumDistancePixels || dx <= dy * config.directionRatio) return;
      // Use the existing invoker so focus, selection, and dismissal stay shared.
      trigger.click();
    },
    { passive: true },
  );

  function cancel() {
    gesture = null;
  }
  document.addEventListener("touchcancel", cancel, { passive: true });
  window.addEventListener("resize", cancel);
  document.addEventListener("site:display-change", cancel);
}
