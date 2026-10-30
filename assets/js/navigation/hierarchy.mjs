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
  let group =
    element.matches("summary") ?
      element.parentElement.parentElement.closest("details")
    : element.closest("details");
  while (group && tree.contains(group)) {
    parents.unshift(group.querySelector(":scope > summary"));
    group = group.parentElement.closest("details");
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
