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

// A visible pane keeps its toggle in its heading; a hidden one moves it to its rail.
function paneToggle(pane) {
  const toggle = document.querySelector(`[data-${pane}-toggle]`);
  const restoreSlot = document.querySelector(`[data-${pane}-restore-slot]`);
  const heading = document.querySelector(`[data-site-pane="${pane}"] .site-pane-heading`);
  if (!toggle || !restoreSlot || !heading) return null;
  return {
    toggle,
    place(visible) {
      const parent = visible ? heading : restoreSlot;
      if (toggle.parentElement !== parent) parent.prepend(toggle);
    },
  };
}

// The saved visibility is on the root before the first paint, so a startup script can
// put the toggle in place before the deferred scripts run.
export function placePaneToggle(pane) {
  paneToggle(pane)?.place(
    document.documentElement.getAttribute(`data-${pane}-visible`) !== "false",
  );
}

function initPaneVisibility(preferences, pane, key, name) {
  const parts = paneToggle(pane);
  if (!parts) return;
  const { toggle } = parts;

  function sync(snapshot) {
    const visible = snapshot.display[key];
    const label = `${visible ? "Hide" : "Show"} ${name}`;
    toggle.setAttribute("aria-expanded", String(visible));
    toggle.setAttribute("aria-label", label);
    toggle.title = label;
    parts.place(visible);
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
