// Walk actual list parents rather than inferring ancestry from heading numbers.
export function outlineParents(link) {
  const parents = [];
  let item = link.closest("li");
  while ((item = item?.parentElement.closest("li"))) {
    const parent = item.querySelector(":scope > a");
    if (parent) parents.unshift(parent);
  }
  return parents;
}

export function sidebarParents(element, tree) {
  const parents = [];
  let group = element.closest(".sidebar-group");
  if (element.closest(".site-sidebar-section-row"))
    group = group?.parentElement.closest(".sidebar-group");
  while (group && tree.contains(group)) {
    parents.unshift(group.querySelector(":scope > .site-sidebar-section-row"));
    group = group.parentElement.closest(".sidebar-group");
  }
  return parents;
}

export function headingId(hash) {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return hash.slice(1);
  }
}

export function updatePinnedRows(panel, root, rows) {
  if (!panel.getClientRects().length) return;
  const top =
    panel.getBoundingClientRect().top + (parseFloat(getComputedStyle(panel).paddingTop) || 0);
  const pinned = root.getBoundingClientRect().height ? [root] : [];
  for (const row of rows) {
    const style = getComputedStyle(row);
    const offset = parseFloat(style.getPropertyValue("--site-sticky-offset")) || 0;
    const rect = row.getBoundingClientRect();
    if (
      panel.scrollTop > 0 &&
      style.position === "sticky" &&
      rect.height &&
      Math.abs(rect.top - top - offset) < 1
    )
      pinned.push(row);
  }
  pinned.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
  const visible = new Set(pinned);
  // The heading is its own card, separated from the pinned ancestor stack.
  const parents = pinned.filter((row) => row !== root);
  for (const row of [root, ...rows]) {
    row.classList.toggle("site-pinned", visible.has(row));
    row.classList.toggle(
      "site-pinned-first",
      row === root ? visible.has(root) : row === parents[0],
    );
    row.classList.toggle(
      "site-pinned-last",
      row === root ? visible.has(root) : row === parents.at(-1),
    );
  }
}
