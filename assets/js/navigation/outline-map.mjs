import { headingId, outlineParents } from "./hierarchy.mjs";

export function initOutlineMap() {
  const outline = document.querySelector("#page-outline #TableOfContents");
  const map = document.querySelector("[data-outline-map]");
  if (!outline || !map) return;
  const rail = map.closest(".site-outline-rail");
  const scroll = map.querySelector("[data-map-scroll]");
  const list = map.querySelector("[data-map-list]");
  const preview = map.querySelector("[role=tooltip]");
  const bySource = new Map();
  const byId = new Map();

  for (const source of outline.querySelectorAll('a[href^="#"]')) {
    const id = headingId(source.hash);
    const heading = document.getElementById(id);
    if (!heading || byId.has(id)) continue;
    const parent = outlineParents(source)
      .map((link) => bySource.get(link))
      .filter(Boolean)
      .at(-1);
    const node = {
      id,
      source,
      heading,
      title: source.textContent.trim().replace(/\s+/g, " "),
      parent,
      children: [],
    };
    parent?.children.push(node);
    bySource.set(source, node);
    byId.set(id, node);
  }
  const nodes = [...byId.values()];
  if (!nodes.length) return;
  const roots = nodes.filter((node) => !node.parent);
  // An authored H1 often wraps the entire document. Its children are the main
  // sections; keep the title as a separate destination for the introduction.
  const title =
    roots.length === 1 && roots[0].heading.tagName === "H1" && roots[0].children.length ?
      roots[0]
    : null;

  for (const node of nodes) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = node.source.getAttribute("href");
    link.setAttribute("aria-label", node.title);
    link.dataset.mapLevel = node.heading.tagName.slice(1);
    item.append(link);
    (node.parent?.list || list).append(item);
    node.link = link;
    if (node.children.length) {
      node.list = document.createElement("ul");
      item.append(node.list);
    }
  }
  const byLink = new Map(nodes.map((node) => [node.link, node]));
  let active;
  let previewLink;
  let hideTimer;
  let fitScheduled = false;

  function hidePreview() {
    clearTimeout(hideTimer);
    previewLink?.removeAttribute("aria-describedby");
    previewLink = null;
    if (typeof preview.hidePopover === "function" && preview.matches(":popover-open"))
      preview.hidePopover();
    preview.hidden = true;
  }

  function positionPreview() {
    if (!previewLink) return;
    const anchor = previewLink.getBoundingClientRect();
    const panel = scroll.getBoundingClientRect();
    if (!anchor.height || anchor.bottom <= panel.top || anchor.top >= panel.bottom) {
      hidePreview();
      return;
    }
    const style = getComputedStyle(map);
    const gap = parseFloat(style.gap);
    const box = preview.getBoundingClientRect();
    const desired = style.direction === "rtl" ? anchor.right + gap : anchor.left - box.width - gap;
    const left = Math.max(
      gap,
      Math.min(desired, document.documentElement.clientWidth - box.width - gap),
    );
    const minimumTop = Math.max(gap, parseFloat(getComputedStyle(map.parentElement).top) || 0);
    const top = Math.max(
      minimumTop,
      Math.min(anchor.top + (anchor.height - box.height) / 2, innerHeight - box.height - gap),
    );
    preview.style.left = `${left}px`;
    preview.style.top = `${top}px`;
  }

  function showPreview(link) {
    const node = byLink.get(link);
    if (!node) return;
    hidePreview();
    previewLink = link;
    const parent = preview.querySelector("[data-map-preview-parent]");
    parent.textContent = node.parent?.title || "";
    parent.hidden = !node.parent;
    preview.querySelector("[data-map-preview-title]").textContent = node.title;
    link.setAttribute("aria-describedby", preview.id);
    preview.hidden = false;
    preview.showPopover?.();
    positionPreview();
  }

  function queueHidePreview() {
    if (document.activeElement === previewLink) return;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(
      hidePreview,
      parseFloat(getComputedStyle(map).getPropertyValue("--site-motion-fast")),
    );
  }

  function keepVisible(link) {
    if (!link?.getClientRects().length) return;
    const panel = scroll.getBoundingClientRect();
    const bounds = link.getBoundingClientRect();
    if (bounds.top < panel.top) scroll.scrollTop += bounds.top - panel.top;
    else if (bounds.bottom > panel.bottom) scroll.scrollTop += bounds.bottom - panel.bottom;
  }

  function fitRail() {
    if (!rail.getClientRects().length) return;
    const top = parseFloat(getComputedStyle(rail).top) || 0;
    const bottom = Math.min(innerHeight, rail.parentElement.getBoundingClientRect().bottom);
    // A full-height sticky rail would slide above the viewport when its article
    // ends. Shrink its scroller instead, keeping the map below the header.
    rail.style.setProperty("--site-map-available-height", `${Math.max(0, bottom - top)}px`);
  }

  function scheduleFit() {
    if (fitScheduled) return;
    fitScheduled = true;
    requestAnimationFrame(() => {
      fitScheduled = false;
      fitRail();
      keepVisible(active?.link);
    });
  }

  function sync() {
    fitRail();
    const current = outline.querySelector('[aria-current="location"]');
    const node = current ? byId.get(headingId(current.hash)) : nodes[0];
    const changed = active !== node;
    active = node;
    const path = new Set();
    for (let parent = active; parent; parent = parent.parent) path.add(parent);
    for (const entry of nodes) {
      if (entry === active) entry.link.setAttribute("aria-current", "location");
      else entry.link.removeAttribute("aria-current");
      entry.link.classList.toggle("site-map-ancestor", entry !== active && path.has(entry));
      if (!entry.list) continue;
      const open = entry === title || path.has(entry);
      if (!open && entry.list.contains(document.activeElement))
        entry.link.focus({ preventScroll: true });
      entry.list.hidden = !open;
    }
    if (changed || !map.getClientRects().length) hidePreview();
    keepVisible(active?.link);
  }

  map.addEventListener("click", hidePreview);
  map.addEventListener("focusin", (event) => {
    if (byLink.has(event.target)) {
      keepVisible(event.target);
      showPreview(event.target);
    } else hidePreview();
  });
  map.addEventListener("focusout", hidePreview);
  map.addEventListener("pointerover", (event) => {
    if (event.pointerType !== "touch" && byLink.has(event.target)) showPreview(event.target);
  });
  map.addEventListener("pointerout", (event) => {
    if (byLink.has(event.target) && !preview.contains(event.relatedTarget)) queueHidePreview();
  });
  preview.addEventListener("pointerenter", () => clearTimeout(hideTimer));
  preview.addEventListener("pointerleave", queueHidePreview);
  map.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !preview.hidden) {
      event.preventDefault();
      event.stopPropagation();
      hidePreview();
      return;
    }
    if (event.altKey || event.ctrlKey || event.metaKey || !byLink.has(event.target)) return;
    const visible = nodes.map((entry) => entry.link).filter((link) => link.getClientRects().length);
    const index = visible.indexOf(event.target);
    const destinations = {
      ArrowUp: Math.max(0, index - 1),
      ArrowDown: Math.min(visible.length - 1, index + 1),
      Home: 0,
      End: visible.length - 1,
    };
    const destination = destinations[event.key];
    if (destination === undefined) return;
    event.preventDefault();
    keepVisible(visible[destination]);
    visible[destination].focus({ preventScroll: true });
  });
  scroll.addEventListener("scroll", positionPreview, { passive: true });
  window.addEventListener(
    "scroll",
    () => {
      hidePreview();
      scheduleFit();
    },
    { passive: true },
  );
  window.addEventListener("resize", () => {
    hidePreview();
    sync();
  });
  document.addEventListener("site:outline-change", sync);
  document.addEventListener("site:display-change", sync);
  document.addEventListener("site:navigation-layout", sync);
  document.addEventListener("site:font-change", hidePreview);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hidePreview();
  });
  map.hidden = false;
  sync();
}
