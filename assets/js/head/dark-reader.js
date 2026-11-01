// Dark Reader for Safari paints every element #181a1b from the start of each page load and
// keeps that fallback until its main script finds the darkreader-lock meta, often after the
// first paint. The site has its own Dark theme, so drop the fallback whenever it appears.
(function () {
  const root = document.documentElement;
  // Its fallback stylesheet applies only until the page carries this attribute.
  root.setAttribute("data-darkreader-white-flash-suppressor", "active");
  const strip = () => {
    for (const style of document.querySelectorAll("style.darkreader--fallback")) style.remove();
  };
  strip();
  // The extension may inject late, into the root before <head> exists or into <head>.
  const observer = new MutationObserver(strip);
  observer.observe(root, { childList: true });
  if (document.head) observer.observe(document.head, { childList: true });
})();
