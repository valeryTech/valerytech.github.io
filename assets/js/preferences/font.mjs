import { FONT_ATTRIBUTE, normalizeFontPreference } from "./font-settings.mjs";
import { writePreferenceCookie, removePreferenceCookie } from "./cookies.mjs";

function applyFontPreference(preference) {
  const changed = document.documentElement.getAttribute(FONT_ATTRIBUTE) !== preference;
  document.documentElement.setAttribute(FONT_ATTRIBUTE, preference);
  if (changed)
    document.dispatchEvent(new CustomEvent("site:font-change", { detail: { preference } }));
}

export function setFontPreference(value, config) {
  const preference = normalizeFontPreference(value, config);
  const saved = writePreferenceCookie(config.cookie, preference);
  applyFontPreference(preference);
  return saved;
}

export function resetFontPreference(config) {
  const saved = removePreferenceCookie(config.cookie);
  applyFontPreference(config.default);
  return saved;
}

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

    setFontPreference(preference, config);
  });

  document.addEventListener("site:font-change", (event) => {
    select.value = normalizeFontPreference(event.detail.preference, config);
  });

  control.append(label, select);

  navigation.append(control);
}
