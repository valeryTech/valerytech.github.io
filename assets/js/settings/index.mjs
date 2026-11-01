import { initSettingsForm } from "./form.mjs";
import { initSettingsDialog } from "./dialog.mjs";

export function initSettings(config, preferences) {
  for (const form of document.querySelectorAll("form[data-site-settings]"))
    initSettingsForm(form, preferences, config);
  initSettingsDialog(preferences, config);
}
