// Send a missing address to the closest section that still exists, so
// /ai/old-folder/note/ opens /ai/old-folder/ or, failing that, /ai/.
// Addresses outside every section stay on this page.
import { saveNotFoundRedirect } from './analytics/not-found-redirect.mjs';

(() => {
  const data = document.getElementById('site-not-found-sections');
  if (!data) return;
  const sections = JSON.parse(data.textContent);
  const path = location.pathname.toLowerCase().replace(/\/?$/, '/');
  const target = sections
    .filter((section) => section !== '/' && section !== path && path.startsWith(section))
    .sort((a, b) => b.length - a.length)[0];
  if (!target) return;

  // The landing page reports the missing address, so this page sends nothing.
  window.siteNotFoundRedirect = target;
  saveNotFoundRedirect(location.href, document.referrer);
  location.replace(target);
})();
