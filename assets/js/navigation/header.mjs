export function initHeaderVisibility(preferences) {
  const toggle = document.querySelector("[data-header-toggle]");
  const home = document.querySelector("[data-header-toggle-home]");
  const heading = document.querySelector("#page-outline .site-toc-title");
  const rail = document.querySelector("[data-outline-restore-slot]");
  if (!toggle || !home) return;

  function placeToggle() {
    const parent = [heading, rail].find((element) => element?.getClientRects().length) || home;
    const focused = document.activeElement === toggle;
    if (toggle.parentElement !== parent) parent.append(toggle);
    home.hidden = parent !== home;
    if (focused) toggle.focus({ preventScroll: true });
  }

  function sync(snapshot) {
    const visible = snapshot.display.headerVisible;
    const label = `${visible ? "Hide" : "Show"} top bar`;
    toggle.setAttribute("aria-expanded", String(visible));
    toggle.setAttribute("aria-label", label);
    toggle.title = label;
    placeToggle();
  }

  toggle.addEventListener("click", () => {
    preferences.set("display.headerVisible", !preferences.get("display.headerVisible"));
    const target =
      toggle.getClientRects().length ? toggle : document.querySelector(".site-settings-link");
    target?.focus({ preventScroll: true });
  });
  preferences.subscribe(sync);
  window.addEventListener("resize", placeToggle);
  window.addEventListener("pageshow", placeToggle);
  sync(preferences.snapshot());
}

export function initHeaderAlignment() {
  const header = document.querySelector(".site-header");
  const panes = [
    ...document.querySelectorAll(
      ".site-page-layout > #page-outline, .site-page-layout > .site-outline-rail, .site-page-layout > .site-outline-placeholder",
    ),
  ];
  if (!header || !panes.length) return;

  function sync() {
    const pane = panes.find((element) => element.getClientRects().length);
    const property = "--site-header-outline-width";
    if (pane) {
      // Use the fitted width, including when the other pane squeezes the outline.
      header.style.setProperty(property, `${pane.getBoundingClientRect().width}px`);
    } else header.style.removeProperty(property);
  }

  const observer = new ResizeObserver(sync);
  for (const pane of panes) observer.observe(pane);
  sync();
}
