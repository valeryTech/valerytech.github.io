import { initSettingsForm } from "./form.mjs";
import { initSettingsDialog } from "./dialog.mjs";
import { initPaletteEditor } from "./palette.mjs";

export function initSettings(config, preferences, palette) {
  for (const form of document.querySelectorAll("form[data-site-settings]"))
    initSettingsForm(form, preferences, config, palette);
  initSettingsDialog(preferences, config, palette);
  initPaletteEditor(palette, preferences);
}
