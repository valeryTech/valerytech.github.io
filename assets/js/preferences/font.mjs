import { FONT_ATTRIBUTE, normalizeFontPreference } from "./font-settings.mjs";

export function initFontPreference(config) {
  const validPreferences = new Set(config.options.map((option) => option.value));
  const navigation = document.querySelector("#font-preference-container");

  if (!navigation || document.getElementById("fontPreference")) {
    return;
  }

  const control = document.createElement("div");
  control.className = "font-preference-control";

  const label = document.createElement("label");
  label.htmlFor = "fontPreference";
  label.textContent = "Font";

  const select = document.createElement("select");
  select.id = "fontPreference";
  select.className = "font-preference-select";

  for (const { value, label } of config.options) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    select.append(option);
  }

  const savedPreference = document.documentElement.getAttribute(FONT_ATTRIBUTE);
  select.value = normalizeFontPreference(savedPreference, config);

  select.addEventListener("change", () => {
    const preference = select.value;
    if (!validPreferences.has(preference)) {
      return;
    }

    document.documentElement.setAttribute(FONT_ATTRIBUTE, preference);
    document.cookie = `${config.cookie.name}=${encodeURIComponent(preference)}; Max-Age=${config.cookie.maxAgeSeconds}; Path=/; SameSite=Lax`;
    document.dispatchEvent(new CustomEvent("site:font-change", { detail: { preference } }));
  });

  control.append(label, select);

  navigation.append(control);
}
