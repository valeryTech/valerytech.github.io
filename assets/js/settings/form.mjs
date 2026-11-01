import { PRESETS_CHANGE } from "./palette.mjs";
import { exportSettings, importSettings } from "./transfer.mjs";

export function initSettingsForm(form, preferences, config, palette) {
  const controls = form.querySelector("[data-settings-controls]");
  const status = form.querySelector('[role="status"]');
  const inputs = [...form.querySelectorAll("[data-preference]")];
  const choices = new Map(
    inputs
      .filter((input) => input.type === "button")
      .map((input) => [input, [...input.querySelectorAll("[data-preference-choice]")]]),
  );
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

  function nextChoice(input) {
    const options = choices.get(input);
    const index = options.findIndex(
      (option) => option.dataset.preferenceChoice === preferences.get(input.dataset.preference),
    );
    return options[(index + 1) % options.length];
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
      else if (input.type === "button") {
        input.value = value;
        for (const option of choices.get(input))
          option.hidden = option.dataset.preferenceChoice !== value;
        const current = choices
          .get(input)
          .find((option) => !option.hidden)
          .textContent.trim();
        const next = nextChoice(input).textContent.trim();
        const description = `${input.dataset.preferenceLabel}: ${current}. Switch to ${next}.`;
        input.setAttribute("aria-label", description);
        input.title = description;
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
    const choice = choices.get(input)?.find((option) => !option.hidden);
    status.textContent =
      choice ?
        `${input.dataset.preferenceLabel}: ${choice.textContent.trim()}. ${message}`
      : message;
  }

  for (const input of inputs) {
    if (input.type === "button") {
      input.addEventListener("click", () =>
        save(input, nextChoice(input).dataset.preferenceChoice),
      );
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
