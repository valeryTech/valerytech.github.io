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
    preferences.set(`display.${key}`, !preferences.get(`display.${key}`));
    toggle.focus({ preventScroll: true });
  });
  preferences.subscribe(sync);
  sync(preferences.snapshot());
  toggle.hidden = false;
}

export function initSidebarVisibility(preferences) {
  initPaneVisibility(preferences, "sidebar", "sidebarVisible", "left navigation");
}

export function initOutlineVisibility(preferences) {
  initPaneVisibility(preferences, "outline", "outlineVisible", "page outline");
}
