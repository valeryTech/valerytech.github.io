import { FONT_ATTRIBUTE } from "./font-settings.mjs";
import { setFontPreference, resetFontPreference } from "./font.mjs";
import { displayDefaults, savedDisplayPreferences, setDisplayPreferences } from "./display.mjs";
import { loadPaneWidths, savePaneWidths } from "./panes.mjs";

export function initSettingsPage(config) {
  const form = document.getElementById("site-settings");
  if (!form) return;
  const controls = form.querySelector("[data-settings-controls]");
  const status = form.querySelector('[role="status"]');
  const font = form.querySelector("#settings-font");
  const displayControls = [...form.querySelectorAll("[data-display-setting]")];
  const widthControls = [...form.querySelectorAll("[data-pane-preference]")];
  const reference = form.querySelector("[data-pane-size-reference]");
  const style = getComputedStyle(reference);
  const minimum = parseFloat(style.minWidth);
  const maximum = parseFloat(style.maxWidth);
  const defaultWidth = Math.round(reference.getBoundingClientRect().width);
  let widths = loadPaneWidths(config.navigation.resize);

  function savedMessage(saved) {
    status.textContent =
      saved ? "Settings saved." : (
        "Applied to this page. Your browser could not save these settings."
      );
  }

  function syncDisplay(preferences) {
    for (const input of displayControls) {
      const value = preferences[input.dataset.displaySetting];
      if (input.type === "checkbox") input.checked = value;
      else input.value = value;
    }
  }

  function describeWidth(input) {
    const label = `${input.value} px`;
    form.querySelector(`#settings-${input.dataset.panePreference}-value`).value = label;
    input.setAttribute("aria-valuetext", label);
  }

  function syncWidths() {
    for (const input of widthControls) {
      input.min = minimum;
      input.max = maximum;
      input.value = Math.max(
        minimum,
        Math.min(maximum, widths[input.dataset.panePreference] ?? defaultWidth),
      );
      describeWidth(input);
    }
  }

  function notifyWidths() {
    document.dispatchEvent(
      new CustomEvent("site:pane-widths-change", { detail: { widths: { ...widths } } }),
    );
  }

  font.value = document.documentElement.getAttribute(FONT_ATTRIBUTE) || config.fonts.default;
  font.addEventListener("change", () => savedMessage(setFontPreference(font.value, config.fonts)));
  document.addEventListener("site:font-change", (event) => {
    font.value = event.detail.preference;
  });
  syncDisplay(savedDisplayPreferences(config.display));
  document.addEventListener("site:display-change", (event) =>
    syncDisplay(event.detail.preferences),
  );
  for (const input of displayControls) {
    input.addEventListener("change", () => {
      const preferences = Object.fromEntries(
        displayControls.map((control) => [
          control.dataset.displaySetting,
          control.type === "checkbox" ? control.checked : control.value,
        ]),
      );
      savedMessage(setDisplayPreferences(preferences, config.display));
    });
  }
  syncWidths();
  document.addEventListener("site:pane-widths-change", (event) => {
    widths = { ...event.detail.widths };
    syncWidths();
  });
  for (const input of widthControls) {
    input.addEventListener("input", () => describeWidth(input));
    input.addEventListener("change", () => {
      widths[input.dataset.panePreference] = Number(input.value);
      const saved = savePaneWidths(config.navigation.resize, widths);
      notifyWidths();
      savedMessage(saved);
    });
  }
  form.querySelector("[data-settings-reset]").addEventListener("click", () => {
    const saved = [
      resetFontPreference(config.fonts),
      setDisplayPreferences(displayDefaults(config.display), config.display),
      savePaneWidths(config.navigation.resize, {}),
    ].every(Boolean);
    widths = {};
    syncWidths();
    notifyWidths();
    status.textContent =
      saved ? "Site defaults restored." : (
        "Defaults applied to this page. Your browser could not save these settings."
      );
  });
  form.addEventListener("submit", (event) => event.preventDefault());
  controls.disabled = false;
  status.textContent = "Changes are saved automatically in this browser.";
}
