// Point a missing address at the collections its first path segment names.
// "ai" matches both AI and AI Engineering, since notes move between them.
(() => {
  const list = document.querySelector('.site-not-found-collections');
  const segment = location.pathname.split('/').find(Boolean)?.toLowerCase();
  if (!list || !segment) return;

  const matches = [...list.children].filter((item) => {
    const collection = item.dataset.collection;
    return collection === segment || collection.startsWith(`${segment}-`);
  });
  if (!matches.length) return;

  // Keep the exact match on top, then the related collections in their order.
  matches.sort((a, b) => (b.dataset.collection === segment) - (a.dataset.collection === segment));
  for (const item of matches.reverse()) {
    item.classList.add('is-match');
    list.prepend(item);
  }
  const notice = document.querySelector('.site-not-found-match');
  const link = notice.querySelector('a');
  const first = list.querySelector('.site-not-found-collection');
  link.href = first.href;
  link.textContent = first.textContent;
  notice.hidden = false;
})();
