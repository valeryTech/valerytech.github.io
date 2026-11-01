import {
  contrastRatio,
  loadSavedPresets,
  normalizePalette,
  paletteSource,
  samePalette,
  storeSavedPresets,
} from "../preferences/palette.mjs";

export const PRESETS_CHANGE = "site:palette-presets-change";

// The async clipboard API exists only on secure origins (https, localhost); plain-http
// hosts such as mbp.local copy through a selected text area inside the click instead.
async function copyText(text, host) {
  if (window.isSecureContext && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const focused = document.activeElement;
  const area = document.createElement("textarea");
  area.value = text;
  area.readOnly = true;
  area.style.cssText = "position: fixed; inset: 0 auto auto 0; opacity: 0; pointer-events: none;";
  host.append(area);
  area.select();
  const copied = document.execCommand("copy");
  area.remove();
  focused?.focus({ preventScroll: true });
  if (!copied) throw new Error("Copy was blocked");
}

// Resolve any CSS color (aliases, color-mix) to the #rrggbb a color input accepts.
function resolver() {
  const probe = document.createElement("span");
  probe.hidden = true;
  const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  return (token) => {
    document.body.append(probe);
    probe.style.color = `var(--site-${token})`;
    const color = getComputedStyle(probe).color;
    probe.remove();
    context.clearRect(0, 0, 1, 1);
    context.fillStyle = "#000";
    context.fillStyle = color;
    context.fillRect(0, 0, 1, 1);
    const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
    return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
  };
}

export function initPaletteEditor(config, preferences) {
  const template = document.getElementById("site-palette-template");
  if (!template || typeof HTMLElement.prototype.showPopover !== "function") return;
  const dialogTemplate = document.getElementById("site-settings-dialog-template");
  for (const root of [document, dialogTemplate?.content])
    for (const button of root?.querySelectorAll("[data-palette-open]") ?? []) button.hidden = false;

  let panel;
  let rows = [];
  let status;
  let resolve;
  let controls;
  let savedPresets = loadSavedPresets(config);
  const sitePresets = new Map(
    config.presets.map((preset) => [`site:${preset.id}`, normalizePalette(preset, config)]),
  );
  const labels = new Map(
    config.groups.flatMap((group) => group.tokens.map((entry) => [entry.token, entry.label])),
  );
  const profile = () => (document.documentElement.classList.contains("dark") ? "dark" : "light");
  const open = () => panel?.matches(":popover-open");

  function presetFor(value) {
    if (sitePresets.has(value)) return sitePresets.get(value);
    const preset = savedPresets.find((entry) => `saved:${entry.name}` === value);
    return preset && normalizePalette(preset, config);
  }

  function renderPresets() {
    const group = controls.select.querySelector("[data-palette-saved]");
    group.replaceChildren(
      ...savedPresets.map((preset) => new Option(preset.name, `saved:${preset.name}`)),
    );
    group.hidden = !savedPresets.length;
  }

  function refresh() {
    const palette = preferences.get("palette");
    const colors = palette[profile()];
    panel.querySelector("[data-palette-profile]").textContent =
      profile() === "dark" ? "· Dark" : "· Light";
    const values = Object.fromEntries(rows.map(({ token }) => [token, resolve(token)]));
    for (const { token, input, output, revert, contrast } of rows) {
      const value = values[token];
      input.value = value;
      output.value = value.toUpperCase();
      revert.hidden = !colors[token];
      input.closest(".site-palette-row").toggleAttribute("data-palette-changed", !!colors[token]);
      if (contrast) showContrast(contrast, value, values[contrast.against]);
    }
    const match = [...controls.select.querySelectorAll("option[value]")]
      .map((option) => option.value)
      .find((value) => value && samePalette(presetFor(value), palette));
    controls.custom.hidden = !!match;
    controls.select.value = match ?? "";
    controls.remove.hidden = !match?.startsWith("saved:");
  }

  function showContrast({ element, against, minimum }, value, background) {
    const ratio = contrastRatio(value, background);
    const low = ratio < minimum;
    // Truncate so 4.49 never displays as a passing 4.5.
    const text = (low ? config.contrastWarning : config.contrastText)
      .replace("{ratio}", (Math.floor(ratio * 10) / 10).toFixed(1))
      .replace("{against}", labels.get(against))
      .replace("{minimum}", minimum);
    element.textContent = text;
    element.toggleAttribute("data-palette-low", low);
  }

  function commit(palette, message) {
    const saved = preferences.set("palette", palette);
    status.textContent = saved ? message : config.messages.saveFailed;
  }

  function edit(change) {
    const palette = preferences.get("palette");
    change(palette[profile()]);
    commit(palette, config.messages.saved);
  }

  function savePresets(presets, message) {
    savedPresets = presets;
    const saved = storeSavedPresets(config, presets);
    status.textContent = saved ? message : config.messages.saveFailed;
    document.dispatchEvent(new CustomEvent(PRESETS_CHANGE));
  }

  const wide = matchMedia("(width >= 40rem)");

  function clamp() {
    if (!wide.matches) {
      // Phones dock the panel as a bottom sheet.
      panel.classList.remove("site-palette-placed");
      panel.style.left = panel.style.top = "";
    }
    if (!panel.style.left) return;
    const box = panel.getBoundingClientRect();
    const left = Math.max(0, Math.min(box.left, innerWidth - box.width));
    const top = Math.max(0, Math.min(box.top, innerHeight - box.height));
    panel.style.left = `${left}px`;
    panel.style.top = `${top}px`;
  }

  function drag(event) {
    if (event.button !== 0 || event.target.closest("button") || !wide.matches) return;
    const header = event.currentTarget;
    const box = panel.getBoundingClientRect();
    const offset = { x: event.clientX - box.left, y: event.clientY - box.top };
    header.setPointerCapture(event.pointerId);
    panel.classList.add("site-palette-placed");
    const move = (moveEvent) => {
      panel.style.left = `${moveEvent.clientX - offset.x}px`;
      panel.style.top = `${moveEvent.clientY - offset.y}px`;
      clamp();
    };
    const end = () => {
      header.removeEventListener("pointermove", move);
      header.removeEventListener("pointerup", end);
      header.removeEventListener("pointercancel", end);
    };
    header.addEventListener("pointermove", move);
    header.addEventListener("pointerup", end);
    header.addEventListener("pointercancel", end);
    event.preventDefault();
  }

  function build() {
    document.body.append(template.content.cloneNode(true));
    panel = document.getElementById("site-palette");
    status = panel.querySelector('[role="status"]');
    resolve = resolver();
    controls = {
      select: panel.querySelector("[data-palette-preset]"),
      custom: panel.querySelector("[data-palette-custom]"),
      name: panel.querySelector("[data-palette-name]"),
      save: panel.querySelector("[data-palette-save]"),
      remove: panel.querySelector("[data-palette-delete]"),
    };
    rows = [...panel.querySelectorAll("[data-palette-token]")].map((row) => ({
      token: row.dataset.paletteToken,
      input: row.querySelector("input"),
      output: row.querySelector("output"),
      revert: row.querySelector("[data-palette-revert]"),
      contrast: row.dataset.paletteAgainst && {
        element: row.querySelector("[data-palette-contrast]"),
        against: row.dataset.paletteAgainst,
        minimum: Number(row.dataset.paletteMinimum),
      },
    }));
    for (const { token, input, revert } of rows) {
      input.addEventListener("input", () =>
        edit((colors) => (colors[token] = input.value.toLowerCase())),
      );
      revert.addEventListener("click", () => {
        edit((colors) => delete colors[token]);
        input.focus();
      });
    }
    renderPresets();
    controls.select.addEventListener("change", () => {
      const preset = presetFor(controls.select.value);
      if (preset) commit(preset, config.messages.applied);
    });
    controls.save.addEventListener("click", () => {
      const name = controls.name.value.trim();
      if (!name) {
        status.textContent = config.messages.presetNameRequired;
        controls.name.focus();
        return;
      }
      const others = savedPresets.filter(
        (preset) => preset.name.toLowerCase() !== name.toLowerCase(),
      );
      if (others.length >= config.maxSavedPresets) {
        status.textContent = config.messages.presetsFull;
        return;
      }
      savePresets(
        [...others, { name, ...preferences.get("palette") }],
        config.messages.presetSaved,
      );
      controls.name.value = "";
    });
    controls.name.addEventListener("keydown", (event) => {
      if (event.key === "Enter") controls.save.click();
    });
    controls.remove.addEventListener("click", () => {
      const value = controls.select.value;
      savePresets(
        savedPresets.filter((preset) => `saved:${preset.name}` !== value),
        config.messages.presetDeleted,
      );
    });
    panel.querySelector("[data-palette-reset]").addEventListener("click", () => {
      const palette = preferences.get("palette");
      palette[profile()] = {};
      commit(palette, config.messages.reset);
    });
    panel.querySelector("[data-palette-copy]").addEventListener("click", async () => {
      try {
        await copyText(paletteSource(preferences.get("palette")), panel);
        status.textContent = config.messages.copied;
      } catch {
        status.textContent = config.messages.copyFailed;
      }
    });
    panel
      .querySelector("[data-palette-close]")
      .addEventListener("click", () => panel.hidePopover());
    panel.querySelector("[data-palette-drag]").addEventListener("pointerdown", drag);
    panel.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      panel.hidePopover();
    });
    // Theme switches, resets and imports change which colors are in view.
    new MutationObserver(() => open() && refresh()).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-text-brightness"],
    });
    preferences.subscribe(() => open() && refresh());
    document.addEventListener(PRESETS_CHANGE, () => {
      savedPresets = loadSavedPresets(config);
      renderPresets();
      if (open()) refresh();
    });
    addEventListener("resize", clamp);
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-palette-open]");
    if (!button) return;
    if (!panel) build();
    const focus = () => controls.select.focus({ preventScroll: true });
    const dialog = button.closest("dialog");
    // Close modal Settings so the page stays usable; it refocuses its opener, so refocus after.
    if (dialog?.open) {
      dialog.addEventListener("close", focus, { once: true });
      dialog.close();
    }
    if (!panel.matches(":popover-open")) panel.showPopover();
    refresh();
    if (!dialog) focus();
  });
}
