import { normalizeFontPreference } from "./font-settings.mjs";

export function initFontPreference(config, preferences) {
  const navigation = document.querySelector("#font-preference-container");

  if (!navigation || document.getElementById("fontPreference")) {
    return;
  }

  const button = document.createElement("button");
  button.id = "fontPreference";
  button.type = "button";
  button.className = "font-preference-control site-control site-control-icon-only";
  button.textContent = "Aa";

  let nextPreference;
  function render(preference) {
    const value = normalizeFontPreference(preference, config);
    const index = config.options.findIndex((option) => option.value === value);
    const current = config.options[index];
    const next = config.options[(index + 1) % config.options.length];
    nextPreference = next.value;
    const description = `Font: ${current.label}. Switch to ${next.label}.`;
    button.setAttribute("aria-label", description);
    button.title = description;
  }

  button.addEventListener("click", () => preferences.set("font", nextPreference));
  preferences.subscribe((snapshot) => render(snapshot.font));
  render(preferences.get("font"));
  navigation.append(button);
}
