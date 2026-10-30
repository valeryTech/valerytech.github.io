// Keep the original tree controls sticky, so the pinned path remains usable.
export function initStickyNavigation() {
  const breadcrumb = document.querySelector('.breadcrumb');
  const tree = document.querySelector('.section-nav');
  const root = tree?.querySelector('.sidebar-root');
  const summaries = [...(tree?.querySelectorAll('details > summary') || [])];
  const sidebarLinks = [...(tree?.querySelectorAll('a') || [])];
  const outline = document.querySelector('.hextra-toc #TableOfContents');
  const title = document.querySelector('.hextra-toc .site-toc-title');
  const outlineLinks = [...(outline?.querySelectorAll('a') || [])];
  let scheduled = false;

  function sidebarParents(element) {
    const parents = [];
    let group = element.matches('summary')
      ? element.parentElement.parentElement.closest('details')
      : element.closest('details');
    while (group && tree.contains(group)) {
      parents.unshift(group.querySelector(':scope > summary'));
      group = group.parentElement.closest('details');
    }
    return parents;
  }

  function outlineParents(link) {
    const parents = [];
    let item = link.closest('li');
    while ((item = item.parentElement.closest('li'))) {
      const parent = item.querySelector(':scope > a');
      if (parent) parents.unshift(parent);
    }
    return parents;
  }

  for (const summary of summaries) summary.classList.add('site-sticky-summary');
  for (const link of outlineLinks) {
    if (link.parentElement.querySelector(':scope > ul')) link.classList.add('site-toc-parent');
  }
  const sidebarPaths = new Map([...summaries, ...sidebarLinks].map(element => [element, sidebarParents(element)]));
  const outlinePaths = new Map(outlineLinks.map(link => [link, outlineParents(link)]));
  const panes = [
    { panel: tree?.closest('.site-sidebar-scroll'), root, rows: summaries },
    { panel: outline?.closest('.site-toc-scroll'), root: title, rows: outlineLinks.filter(link => link.classList.contains('site-toc-parent')) },
  ].filter(pane => pane.panel && pane.root);
  let pinsScheduled = false;

  function updatePins() {
    pinsScheduled = false;
    for (const { panel, root, rows } of panes) {
      const top = panel.getBoundingClientRect().top + (parseFloat(getComputedStyle(panel).paddingTop) || 0);
      const pinned = root.getBoundingClientRect().height ? [root] : [];
      for (const row of rows) {
        if ((sidebarPaths.get(row) || []).some(parent => !parent.parentElement.open)) continue;
        const style = getComputedStyle(row);
        const offset = parseFloat(style.getPropertyValue('--site-sticky-offset')) || 0;
        const rect = row.getBoundingClientRect();
        if (style.position === 'sticky' && rect.height && Math.abs(rect.top - top - offset) < 1) pinned.push(row);
      }
      pinned.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
      const visible = new Set(pinned);
      for (const row of [root, ...rows]) {
        row.classList.toggle('site-pinned', visible.has(row));
        row.classList.toggle('site-pinned-first', row === pinned[0]);
        row.classList.toggle('site-pinned-last', row === pinned.at(-1));
      }
    }
  }

  function schedulePins() {
    if (pinsScheduled) return;
    pinsScheduled = true;
    requestAnimationFrame(updatePins);
  }

  function rowHeight(element) {
    return element ? element.getBoundingClientRect().height + (parseFloat(getComputedStyle(element).marginBottom) || 0) : 0;
  }

  function measure() {
    scheduled = false;
    const breadcrumbHeight = breadcrumb?.getBoundingClientRect().height || 0;
    document.documentElement.style.setProperty('--site-breadcrumb-height', `${breadcrumbHeight}px`);
    const rootHeight = rowHeight(root);
    const titleHeight = rowHeight(title);
    // CSS owns the compact-viewport policy; keep JS measurement in sync with it.
    const stackParents = getComputedStyle(document.documentElement).getPropertyValue('--site-stack-parents').trim() !== '0';
    const heights = new Map([...summaries, ...outlineLinks].map(element => [element, rowHeight(element)]));
    for (const [element, parents] of [...sidebarPaths, ...outlinePaths]) {
      const base = sidebarPaths.has(element) ? rootHeight : titleHeight;
      const offset = (stackParents ? parents : []).reduce((sum, parent) => sum + heights.get(parent), base);
      element.style.setProperty('--site-sticky-offset', `${offset}px`);
      element.style.setProperty('--site-sticky-depth', `${parents.length}`);
    }
    root?.querySelector('a')?.style.setProperty('--site-sticky-offset', '0px');
    updatePins();
    document.dispatchEvent(new Event('site:navigation-layout'));
  }

  function scheduleMeasure() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(measure);
  }

  function revealHash() {
    let id;
    try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
    const heading = id ? document.getElementById(id) : null;
    if (!heading?.matches('.content :is(h1, h2, h3, h4, h5, h6)')) return;
    const top = heading.getBoundingClientRect().top;
    const margin = parseFloat(getComputedStyle(heading).scrollMarginTop);
    if (top >= 0 && top < margin - 1 && window.scrollY > 0) {
      window.scrollBy({ top: top - margin, behavior: 'instant' });
    }
  }

  const observer = new ResizeObserver(scheduleMeasure);
  for (const element of [breadcrumb, tree, root, outline, title]) {
    if (element) observer.observe(element);
  }
  tree?.addEventListener('toggle', scheduleMeasure, true);
  for (const { panel } of panes) panel.addEventListener('scroll', schedulePins, { passive: true });
  tree?.closest('.hextra-sidebar-container')?.addEventListener('transitionend', schedulePins);
  window.addEventListener('scroll', schedulePins, { passive: true });
  document.addEventListener('site:outline-change', scheduleMeasure);
  window.addEventListener('resize', scheduleMeasure);
  window.addEventListener('load', () => { measure(); revealHash(); });
  document.fonts?.ready.then(scheduleMeasure);
  measure();
  revealHash();
}
