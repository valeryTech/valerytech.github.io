import { PRESETS_CHANGE } from "./palette.mjs";
import { exportSettings, importSettings } from "./transfer.mjs";

export function initSettingsForm(form, preferences, config, palette) {
  const controls = form.querySelector("[data-settings-controls]");
  const status = form.querySelector('[role="status"]');
  // Segmented radio groups carry data-preference; switches and sliders are inputs.
  const inputs = [...form.querySelectorAll("[data-preference]")];
  const isGroup = (input) => input.getAttribute("role") === "radiogroup";
  const radios = (group) => [...group.querySelectorAll('input[type="radio"]')];
  const choiceLabel = (radio) =>
    radio.getAttribute("aria-label") || radio.closest("label").textContent.trim();
  const themeGroup = form.querySelector("[data-theme-setting]");
  const outputs = new Map(
    [...form.querySelectorAll("[data-preference-output]")].map((output) => [
      output.dataset.preferenceOutput,
      output,
    ]),
  );
  const references = [...form.querySelectorAll("[data-pane-size-reference]")];
  const dimensions = new Map();

  function describeWidth(input) {
    const label = `${input.value} px`;
    outputs.get(input.dataset.preference).value = label;
    input.setAttribute("aria-valuetext", label);
  }

  function refresh() {
    // A dialog is measured only after opening, never while its template is hidden.
    if (form.getClientRects().length) {
      for (const reference of references) {
        const style = getComputedStyle(reference);
        dimensions.set(reference.dataset.paneSizeReference, {
          min: parseFloat(style.minWidth),
          max: parseFloat(style.maxWidth),
          default: Math.round(reference.getBoundingClientRect().width),
        });
      }
    }
    for (const input of inputs) {
      const value = preferences.get(input.dataset.preference);
      if (input.type === "checkbox") input.checked = value;
      else if (isGroup(input)) {
        input.dataset.value = value;
        for (const radio of radios(input)) radio.checked = radio.value === value;
      } else if (input.type === "range") {
        const bounds = dimensions.get(input.dataset.preference);
        input.min = bounds.min;
        input.max = bounds.max;
        input.value = Math.max(bounds.min, Math.min(bounds.max, value ?? bounds.default));
        describeWidth(input);
      } else input.value = value;
    }
  }

  function save(input, value) {
    const saved = preferences.set(input.dataset.preference, value);
    const message = saved ? config.messages.saved : config.messages.saveFailed;
    const choice = isGroup(input) && radios(input).find((radio) => radio.checked);
    status.textContent =
      choice ? `${input.dataset.preferenceLabel}: ${choiceLabel(choice)}. ${message}` : message;
  }

  // Theme lives in the header theme control's localStorage preference, outside the store.
  function refreshTheme(theme) {
    if (!themeGroup) return;
    themeGroup.dataset.value = theme;
    for (const radio of radios(themeGroup)) radio.checked = radio.value === theme;
  }
  if (themeGroup) {
    themeGroup.addEventListener("change", (event) => {
      document.dispatchEvent(new CustomEvent("site:theme-set", { detail: event.target.value }));
      status.textContent = `${themeGroup.dataset.preferenceLabel}: ${choiceLabel(event.target)}.`;
    });
    document.addEventListener("site:theme-change", (event) => refreshTheme(event.detail));
    refreshTheme(
      document.documentElement.dataset.themePreference ||
        themeGroup.dataset.value ||
        radios(themeGroup).find((radio) => radio.checked)?.value,
    );
  }

  for (const input of inputs) {
    if (isGroup(input)) {
      input.addEventListener("change", (event) => save(input, event.target.value));
      continue;
    }
    if (input.type === "range") input.addEventListener("input", () => describeWidth(input));
    input.addEventListener("change", () => {
      const value =
        input.type === "checkbox" ? input.checked
        : input.type === "range" ? Number(input.value)
        : input.value;
      save(input, value);
    });
  }
  form.querySelector("[data-settings-reset]").addEventListener("click", () => {
    status.textContent = preferences.reset() ? config.messages.reset : config.messages.resetFailed;
  });
  form.querySelector("[data-settings-export]").addEventListener("click", () => {
    const file = new Blob([JSON.stringify(exportSettings(preferences, palette), null, 2)], {
      type: "application/json",
    });
    const link = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(file),
      download: config.exportFileName,
    });
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href));
    status.textContent = config.messages.exported;
  });
  const importFile = form.querySelector("[data-settings-import-file]");
  form.querySelector("[data-settings-import]").addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", async () => {
    const [file] = importFile.files;
    importFile.value = "";
    if (!file) return;
    try {
      const saved = importSettings(await file.text(), preferences, palette);
      document.dispatchEvent(new CustomEvent(PRESETS_CHANGE));
      status.textContent = saved ? config.messages.imported : config.messages.importSaveFailed;
    } catch {
      status.textContent = config.messages.importFailed;
    }
  });
  form.addEventListener("submit", (event) => event.preventDefault());
  preferences.subscribe(refresh);
  refresh();
  controls.disabled = false;
  status.textContent = config.messages.ready;
  return { refresh };
}
