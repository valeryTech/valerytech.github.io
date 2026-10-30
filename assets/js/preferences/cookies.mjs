import Cookies from "js-cookie";

function attributes() {
  return { path: "/", sameSite: "Lax", secure: globalThis.location?.protocol === "https:" };
}

export function readPreferenceCookie(config) {
  try {
    return Cookies.get(config.name);
  } catch {
    return undefined;
  }
}

export function writePreferenceCookie(config, value) {
  try {
    Cookies.set(config.name, value, {
      ...attributes(),
      expires: new Date(Date.now() + config.maxAgeSeconds * 1000),
    });
    return Cookies.get(config.name) === value;
  } catch {
    return false;
  }
}

export function removePreferenceCookie(config) {
  try {
    Cookies.remove(config.name, attributes());
    return Cookies.get(config.name) === undefined;
  } catch {
    return false;
  }
}
