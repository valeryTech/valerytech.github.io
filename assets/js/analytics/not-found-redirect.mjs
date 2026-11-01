// Carry a redirected 404 visit to the section page that reports it.
export const NOT_FOUND_REDIRECT_KEY = "site:not-found-redirect";
const MAX_AGE_MS = 30_000;

export function saveNotFoundRedirect(href, referrer, storage = globalThis.sessionStorage, now = Date.now()) {
  try {
    storage.setItem(NOT_FOUND_REDIRECT_KEY, JSON.stringify({ href, referrer, time: now }));
  } catch {
    // Without storage the redirect still happens; only the report is lost.
  }
}

// Return the saved visit once, and only when it is recent and from this site.
export function takeNotFoundRedirect(origin, storage = globalThis.sessionStorage, now = Date.now()) {
  let saved;
  try {
    saved = JSON.parse(storage.getItem(NOT_FOUND_REDIRECT_KEY) || "null");
    storage.removeItem(NOT_FOUND_REDIRECT_KEY);
  } catch {
    return null;
  }
  if (!saved || typeof saved.href !== "string" || typeof saved.time !== "number") return null;
  if (now - saved.time > MAX_AGE_MS || now < saved.time) return null;
  try {
    if (new URL(saved.href).origin !== origin) return null;
  } catch {
    return null;
  }
  return { href: saved.href, referrer: typeof saved.referrer === "string" ? saved.referrer : "" };
}
