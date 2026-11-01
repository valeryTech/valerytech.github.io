// Toggling a pane reflows the article; keep the passage at the reading line in place.
function keepReadingPosition(update) {
  const line = innerHeight * 0.35;
  const anchor = [...document.querySelectorAll(".article-content > *")].find(
    (element) => element.getBoundingClientRect().bottom > line,
  );
  const top = anchor?.getBoundingClientRect().top;
  update();
  if (!anchor) return;
  const restore = () =>
    window.scrollBy({ top: anchor.getBoundingClientRect().top - top, behavior: "instant" });
  restore();
  // Pane widths settle through resize observers in the next frame.
  requestAnimationFrame(restore);
}

function initPaneVisibility(preferences, pane, key, name) {
  const toggle = document.querySelector(`[data-${pane}-toggle]`);
  const restoreSlot = document.querySelector(`[data-${pane}-restore-slot]`);
  if (!toggle || !restoreSlot) return;
  const heading = toggle.parentElement;

  function sync(snapshot) {
    const visible = snapshot.display[key];
    const label = `${visible ? "Hide" : "Show"} ${name}`;
    toggle.setAttribute("aria-expanded", String(visible));
    toggle.setAttribute("aria-label", label);
    toggle.title = label;
    const parent = visible ? heading : restoreSlot;
    if (toggle.parentElement !== parent) parent.prepend(toggle);
  }

  toggle.addEventListener("click", () => {
    keepReadingPosition(() =>
      preferences.set(`display.${key}`, !preferences.get(`display.${key}`)),
    );
    toggle.focus({ preventScroll: true });
  });
  preferences.subscribe(sync);
  sync(preferences.snapshot());
}

export function initSidebarVisibility(preferences) {
  initPaneVisibility(preferences, "sidebar", "sidebarVisible", "left navigation");
}

export function initOutlineVisibility(preferences) {
  initPaneVisibility(preferences, "outline", "outlineVisible", "page outline");
}
