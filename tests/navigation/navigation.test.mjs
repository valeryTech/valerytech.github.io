import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const { chromium, webkit } = createRequire(import.meta.url)('playwright-core');
const base = process.env.BASE_URL || 'http://localhost:1313';
const reference = process.env.REFERENCE_URL;
const screenshots = process.env.SCREENSHOT_DIR;
const route = '/ai/other/methodology-v1-3/usage/rfc-v1-4/';
const framework = '/system-design/frameworks/framework-iv/';
let browser;

before(async () => {
  const channel = process.env.BROWSER_CHANNEL || 'chrome';
  const engine = process.env.BROWSER_ENGINE === 'webkit' ? webkit : chromium;
  browser = await engine.launch({
    channel: engine === chromium && channel !== 'chromium' ? channel : undefined,
    executablePath: process.env.BROWSER_EXECUTABLE || undefined,
    headless: true,
  });
  if (screenshots) mkdirSync(screenshots, { recursive: true });
  // CI starts the static production preview immediately before these tests.
  for (let attempt = 0; attempt < 60; attempt++) {
    try { if ((await fetch(base)).ok) return; } catch {}
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Preview did not start at ${base}`);
});

after(async () => { await browser?.close(); });

async function pageFor(t, url = base + route, width = 1440) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
  page.setDefaultTimeout(8000);
  t.after(() => page.close());
  // Reviewing the deployed site should not count as visitor activity.
  await page.route(/googletagmanager\.com|google-analytics\.com|posthog\.com|clarity\.ms/, (request) => request.abort());
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  if (new URL(url).origin === new URL(base).origin) {
    t.after(() => assert.deepEqual(errors, [], 'No navigation JavaScript errors'));
  }
  const response = await page.goto(url, { waitUntil: 'networkidle' });
  assert.equal(response.status(), 200, url);
  return page;
}

async function screenshot(page, name, options = {}) {
  if (screenshots) await page.screenshot({ ...options, path: path.join(screenshots, `${name}.png`) });
}

async function readAt(page, id) {
  await page.locator(`[id="${id}"]`).evaluate((heading) => {
    window.scrollTo({ top: heading.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.35 + 8, behavior: 'instant' });
  });
  await page.waitForFunction((id) => document.querySelector('.hextra-toc a[aria-current="location"]')?.hash === `#${id}`, id);
}

test('local search finds indexed notes and opens the selected result from the keyboard', async (t) => {
  for (const width of [1440, 768, 390]) {
    const page = await pageFor(t, base + '/', width);
    await page.locator('[data-search-open]').first().click();
    const input = page.locator('.hextra-search-input');
    await input.fill('ticketmaster');
    const results = page.locator('#hextra-search-results a[role="option"]');
    await results.first().waitFor({ state: 'visible' });
    assert.ok(await results.evaluateAll(links => links.some(link => link.pathname === '/system-design/projects/ticketmaster/')));
    await input.press('ArrowDown');
    const selected = page.locator('#hextra-search-results a[aria-selected="true"]');
    const target = new URL(await selected.getAttribute('href'), base);
    await screenshot(page, `search-${width}`);
    await input.press('Enter');
    await page.waitForURL(url => url.pathname === target.pathname && url.hash === target.hash);
    assert.equal(new URL(page.url()).pathname, target.pathname);
  }
});

test('math uses the local KaTeX stylesheet and loads its display fonts', async (t) => {
  for (const width of [1440, 390]) {
    const page = await pageFor(t, base + '/ai-engineering/approach/edd/', width);
    const formula = page.locator('.article-content .katex').first();
    await page.evaluate(() => document.fonts.ready);
    await formula.evaluate(element => element.scrollIntoView({ block: 'center', behavior: 'instant' }));
    assert.equal(await page.locator('link[rel="stylesheet"][href^="/vendor/katex/katex"]').count(), 1);
    const rendering = await formula.evaluate(element => {
      const html = element.querySelector('.katex-html');
      const mathml = element.querySelector('.katex-mathml');
      return {
        width: html.getBoundingClientRect().width,
        mathmlPosition: getComputedStyle(mathml).position,
        fontsLoaded: [...document.fonts].some(font => font.family.startsWith('KaTeX_') && font.status === 'loaded'),
      };
    });
    assert.ok(rendering.width > 0, 'The visual formula is laid out');
    assert.equal(rendering.mathmlPosition, 'absolute', 'The matching stylesheet hides the duplicate MathML visually');
    assert.ok(rendering.fontsLoaded, 'Math display fonts load locally');
    await screenshot(page, `math-${width}`);
  }
});

test('font choices persist and restore independently of the deferred controls', async (t) => {
  const page = await pageFor(t, base + '/');
  await page.context().addCookies([{ name: 'font-preference', value: 'avenir', url: base }]);
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('data-font-preference'), 'system');
  assert.equal(await page.locator('#fontPreference').inputValue(), 'system');
  await page.evaluate(() => {
    window.fontEvents = [];
    window.siteAnalytics = { emit: (name, parameters) => window.fontEvents.push({ name, parameters }) };
  });
  await page.locator('#fontPreference').selectOption('jost');
  assert.equal(await page.locator('html').getAttribute('data-font-preference'), 'jost');
  assert.ok((await page.context().cookies()).some(cookie => cookie.name === 'font-preference' && cookie.value === 'jost'));
  assert.deepEqual(await page.evaluate(() => window.fontEvents), [{
    name: 'display_preference_changed', parameters: { preference_type: 'font', preference_value: 'jost' },
  }]);
  // The head script must restore a saved choice even if the deferred bundle fails.
  await page.route(/\/js\/custom[^/]*\.js(?:\?|$)/, request => request.abort());
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('#fontPreference').count(), 0);
  assert.equal(await page.locator('html').getAttribute('data-font-preference'), 'jost');
  assert.match(await page.locator('body').evaluate(element => getComputedStyle(element).fontFamily), /Jost/);
});

async function dragPane(page, handle, distance) {
  const box = await handle.boundingBox();
  const x = box.x + box.width / 2;
  const y = box.y + Math.min(box.height / 2, 160);
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + distance, y, { steps: 8 });
  await page.mouse.up();
}

async function paneWidths(page) {
  return page.locator('[data-site-pane]').evaluateAll(panes => Object.fromEntries(panes.map(pane => [pane.dataset.sitePane, Math.round(pane.getBoundingClientRect().width)])));
}

async function paneCookie(page) {
  return (await page.context().cookies()).find(cookie => cookie.name === 'navigation-widths');
}

async function savedPaneWidths(page) {
  const cookie = await paneCookie(page);
  return cookie ? JSON.parse(decodeURIComponent(cookie.value)) : undefined;
}

async function displayCookie(page) {
  const cookie = (await page.context().cookies()).find(cookie => cookie.name === 'display-preferences');
  return cookie ? JSON.parse(decodeURIComponent(cookie.value)) : undefined;
}

test('site settings link opens editable reading and navigation preferences on desktop and mobile', async (t) => {
  for (const width of [1440, 390]) {
    const page = await pageFor(t, base + '/', width);
    await page.getByRole('navigation', { name: 'Footer', exact: true }).getByRole('link', { name: 'Settings', exact: true }).click();
    await page.waitForURL(url => url.pathname === '/settings/');
    const settings = page.getByRole('form', { name: 'Site settings' });
    await settings.getByLabel('Font', { exact: true }).selectOption('jost');
    await settings.getByLabel('Article text size').selectOption('larger');
    await settings.getByLabel('Line spacing').selectOption('roomy');
    await settings.getByLabel('Breadcrumbs', { exact: true }).selectOption('static');
    await settings.getByLabel('Keep parent sections visible').uncheck();
    await settings.getByRole('slider', { name: 'Left navigation width' }).focus();
    await page.keyboard.press('End');
    await settings.getByRole('slider', { name: 'Page outline width' }).focus();
    await page.keyboard.press('Home');
    assert.deepEqual(await savedPaneWidths(page), { sidebar: 448, outline: 192 });
    assert.deepEqual(await displayCookie(page), { breadcrumbs: 'static', textSize: 'larger', lineSpacing: 'roomy', pinAncestors: false });
    assert.equal(await page.locator('#fontPreference').inputValue(), 'jost');
    await page.locator('#fontPreference').selectOption('system');
    assert.equal(await settings.getByLabel('Font', { exact: true }).inputValue(), 'system');
    await settings.getByLabel('Font', { exact: true }).selectOption('jost');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await settings.getByLabel('Font', { exact: true }).inputValue(), 'jost');
    assert.equal(await settings.getByLabel('Breadcrumbs', { exact: true }).inputValue(), 'static');
    assert.equal(await settings.getByLabel('Article text size').inputValue(), 'larger');
    assert.equal(await settings.getByLabel('Line spacing').inputValue(), 'roomy');
    assert.equal(await settings.getByLabel('Keep parent sections visible').isChecked(), false);
    assert.equal(await settings.getByRole('slider', { name: 'Left navigation width' }).inputValue(), '448');
    await page.evaluate(() => document.fonts.ready);
    const reading = await page.locator('.site-settings-preview').evaluate(element => {
      const style = getComputedStyle(element);
      return { size: style.fontSize, lineHeight: style.lineHeight, font: style.fontFamily };
    });
    assert.equal(reading.size, '20px');
    assert.equal(reading.lineHeight, '39px');
    assert.match(reading.font, /Jost/);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
    const alignment = await page.evaluate(() => {
      const crumb = document.querySelector('.breadcrumb').getBoundingClientRect();
      const settings = document.getElementById('site-settings').getBoundingClientRect();
      return Math.abs(crumb.left - settings.left) < 1 && Math.abs(crumb.right - settings.right) < 1;
    });
    assert.ok(alignment, 'The settings form and breadcrumb share one content column');
    await screenshot(page, `settings-${width}-light`, { fullPage: true });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForFunction(() => document.documentElement.classList.contains('dark'));
    await screenshot(page, `settings-${width}-dark`, { fullPage: true });
  }
});

test('breadcrumb settings control visibility and sticky clearance on deeply linked pages', async (t) => {
  const page = await pageFor(t, base + '/settings/');
  const id = 'level-3--slices-and-state-snapshots';
  let stickyClearance;
  for (const mode of ['sticky', 'static', 'hidden']) {
    if (mode !== 'sticky') await page.goto(base + '/settings/', { waitUntil: 'networkidle' });
    await page.getByRole('form', { name: 'Site settings' }).getByLabel('Breadcrumbs', { exact: true }).selectOption(mode);
    await page.goto(base + route + '#' + id, { waitUntil: 'networkidle' });
    const layout = await page.evaluate(id => {
      const heading = document.getElementById(id);
      const crumb = document.querySelector('.site-breadcrumb-sticky');
      return { headingTop: heading.getBoundingClientRect().top, clearance: parseFloat(getComputedStyle(heading).scrollMarginTop), navbarBottom: document.querySelector('.hextra-nav-container').getBoundingClientRect().bottom, position: getComputedStyle(crumb).position, display: getComputedStyle(crumb).display, crumbBottom: crumb.getBoundingClientRect().bottom, pinnedHeight: parseFloat(document.documentElement.style.getPropertyValue('--site-breadcrumb-height')) };
    }, id);
    assert.ok(layout.headingTop >= layout.navbarBottom + 16, mode + ': heading stays clear of the navbar');
    if (mode === 'sticky') {
      stickyClearance = layout.clearance;
      assert.equal(layout.position, 'sticky');
      assert.ok(layout.pinnedHeight > 0);
      assert.ok(layout.headingTop >= layout.crumbBottom - 1);
    } else {
      assert.equal(layout.pinnedHeight, 0);
      assert.ok(layout.clearance < stickyClearance, mode + ': no space is reserved for an unpinned breadcrumb');
      if (mode === 'static') {
        assert.equal(layout.position, 'relative');
        assert.ok(layout.crumbBottom < 0);
      } else assert.equal(layout.display, 'none');
    }
  }
});

test('reading and parent-stack preferences restore before the deferred bundle and reset together', async (t) => {
  const page = await pageFor(t, base + '/settings/');
  const settings = page.getByRole('form', { name: 'Site settings' });
  await settings.getByLabel('Font', { exact: true }).selectOption('jost');
  await settings.getByLabel('Breadcrumbs', { exact: true }).selectOption('hidden');
  await settings.getByLabel('Article text size').selectOption('large');
  await settings.getByLabel('Keep parent sections visible').uncheck();
  await settings.getByRole('slider', { name: 'Left navigation width' }).focus();
  await page.keyboard.press('End');
  await page.goto(base + route, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('.site-sticky-summary').first().evaluate(element => getComputedStyle(element).position), 'relative');
  assert.equal(await page.locator('.hextra-toc .site-toc-parent').first().evaluate(element => getComputedStyle(element).position), 'relative');
  await page.route(/\/js\/custom[^/]*\.js(?:\?|$)/, request => request.abort());
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('data-breadcrumbs'), 'hidden');
  assert.equal(await page.locator('html').getAttribute('data-font-preference'), 'jost');
  assert.equal(await page.locator('html').getAttribute('data-pin-ancestors'), 'false');
  assert.equal(await page.locator('.article-content > p:not(.page-description)').first().evaluate(element => getComputedStyle(element).fontSize), '18px');
  await page.unroute(/\/js\/custom[^/]*\.js(?:\?|$)/);
  await page.context().addCookies([{ name: 'unrelated', value: 'keep', url: base }]);
  await page.goto(base + '/settings/', { waitUntil: 'networkidle' });
  await settings.getByRole('button', { name: 'Reset to site defaults' }).click();
  assert.equal(await settings.getByLabel('Font', { exact: true }).inputValue(), 'system');
  assert.equal(await settings.getByLabel('Breadcrumbs', { exact: true }).inputValue(), 'sticky');
  assert.equal(await settings.getByLabel('Article text size').inputValue(), 'standard');
  assert.equal(await settings.getByLabel('Keep parent sections visible').isChecked(), true);
  assert.equal(await settings.getByRole('slider', { name: 'Left navigation width' }).inputValue(), '256');
  assert.equal(await settings.getByRole('status', { name: 'Settings status' }).textContent(), 'Site defaults restored.');
  const cookies = await page.context().cookies();
  assert.ok(cookies.some(cookie => cookie.name === 'unrelated'));
  assert.ok(cookies.every(cookie => !['font-preference', 'navigation-widths', 'display-preferences'].includes(cookie.name)));
  await page.goto(base + route, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('data-breadcrumbs'), 'sticky');
  assert.equal(await page.locator('.site-sticky-summary').first().evaluate(element => getComputedStyle(element).position), 'sticky');
  assert.deepEqual(await paneWidths(page), { sidebar: 256, outline: 256 });
});

test('settings remain usable when cookies are blocked and explain unsaved changes', async (t) => {
  const page = await pageFor(t, base + '/settings/');
  await page.context().addInitScript(() => Object.defineProperty(document, 'cookie', {
    get() { throw new DOMException('Cookies blocked', 'SecurityError'); },
    set() { throw new DOMException('Cookies blocked', 'SecurityError'); },
  }));
  await page.reload({ waitUntil: 'networkidle' });
  const settings = page.getByRole('form', { name: 'Site settings' });
  await settings.getByLabel('Breadcrumbs', { exact: true }).selectOption('hidden');
  assert.equal(await page.locator('html').getAttribute('data-breadcrumbs'), 'hidden');
  assert.match(await settings.getByRole('status', { name: 'Settings status' }).textContent(), /could not save/);
  await settings.getByLabel('Font', { exact: true }).selectOption('jost');
  assert.equal(await page.locator('html').getAttribute('data-font-preference'), 'jost');
  assert.match(await settings.getByRole('status', { name: 'Settings status' }).textContent(), /could not save/);
});

test('both navigation panes resize independently and keep their widths across pages and reloads', async (t) => {
  const page = await pageFor(t);
  const left = page.getByRole('separator', { name: 'Site navigation width' });
  const right = page.getByRole('separator', { name: 'Page outline width' });
  assert.deepEqual(await paneWidths(page), { sidebar: 256, outline: 256 });
  await dragPane(page, left, 80);
  assert.deepEqual(await paneWidths(page), { sidebar: 336, outline: 256 });
  await dragPane(page, right, -72);
  assert.deepEqual(await paneWidths(page), { sidebar: 336, outline: 328 });
  assert.equal(await right.getAttribute('aria-valuenow'), '328');
  assert.deepEqual(await savedPaneWidths(page), { sidebar: 336, outline: 328 });
  const cookie = await paneCookie(page);
  assert.equal(cookie.path, '/');
  assert.equal(cookie.sameSite, 'Lax');
  assert.equal(cookie.secure, new URL(base).protocol === 'https:');
  assert.ok(cookie.expires > Date.now() / 1000 + 86400);
  assert.equal(await page.evaluate(() => localStorage.getItem('site-navigation-widths')), null);
  await page.goto(base + framework, { waitUntil: 'networkidle' });
  assert.deepEqual(await paneWidths(page), { sidebar: 336, outline: 328 });
  await page.reload({ waitUntil: 'networkidle' });
  assert.deepEqual(await paneWidths(page), { sidebar: 336, outline: 328 });
  await page.evaluate(() => localStorage.setItem('site-navigation-widths', JSON.stringify({ sidebar: 448, outline: 448 })));
  await page.reload({ waitUntil: 'networkidle' });
  assert.deepEqual(await paneWidths(page), { sidebar: 336, outline: 328 });
  await screenshot(page, 'resized-panes');
  await right.dblclick();
  assert.deepEqual(await paneWidths(page), { sidebar: 336, outline: 256 });
  await left.focus();
  await page.keyboard.press('Enter');
  assert.deepEqual(await paneWidths(page), { sidebar: 256, outline: 256 });
  assert.equal(await paneCookie(page), undefined);
  assert.equal(await page.evaluate(() => localStorage.getItem('site-navigation-widths')), null);
  await page.reload({ waitUntil: 'networkidle' });
  assert.deepEqual(await paneWidths(page), { sidebar: 256, outline: 256 });
});

test('existing pane widths migrate to a cookie and remain after legacy storage is cleared', async (t) => {
  const page = await pageFor(t);
  await page.evaluate(() => localStorage.setItem('site-navigation-widths', JSON.stringify({ sidebar: 336, outline: 328 })));
  await page.reload({ waitUntil: 'networkidle' });
  assert.deepEqual(await paneWidths(page), { sidebar: 336, outline: 328 });
  assert.deepEqual(await savedPaneWidths(page), { sidebar: 336, outline: 328 });
  assert.equal(await page.evaluate(() => localStorage.getItem('site-navigation-widths')), null);
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  assert.deepEqual(await paneWidths(page), { sidebar: 336, outline: 328 });
});

test('pane dividers support the keyboard, cancel dragging and keep resized sticky stacks usable', async (t) => {
  const page = await pageFor(t);
  const left = page.getByRole('separator', { name: 'Site navigation width' });
  const right = page.getByRole('separator', { name: 'Page outline width' });
  await left.focus();
  await page.keyboard.press('ArrowRight');
  await right.focus();
  await page.keyboard.press('ArrowLeft');
  assert.deepEqual(await paneWidths(page), { sidebar: 272, outline: 272 });
  await page.keyboard.press('Home');
  assert.equal((await paneWidths(page)).outline, 192);
  await page.keyboard.press('End');
  assert.equal((await paneWidths(page)).outline, 448);
  await left.focus();
  await page.keyboard.press('Home');
  const box = await left.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + 140);
  await page.mouse.down();
  await page.mouse.move(box.x + 80, box.y + 140);
  await page.keyboard.press('Escape');
  await page.mouse.up();
  assert.deepEqual(await paneWidths(page), { sidebar: 192, outline: 448 });
  assert.equal(await page.locator('.site-resizing-panes').count(), 0);
  await right.focus();
  await page.keyboard.press('Home');
  await page.locator('.site-sidebar-scroll').evaluate(panel => { panel.scrollTop = panel.scrollHeight; });
  await readAt(page, 'level-3--slices-and-state-snapshots');
  await page.waitForFunction(() => {
    for (const selector of ['.site-sidebar-scroll', '.site-toc-scroll']) {
      const panel = document.querySelector(selector);
      const rows = [...panel.querySelectorAll('.site-pinned')].filter(row => row.getBoundingClientRect().height);
      for (let i = 1; i < rows.length; i++) if (rows[i].getBoundingClientRect().top < rows[i - 1].getBoundingClientRect().bottom - 1) return false;
    }
    return true;
  });
  await screenshot(page, 'resized-sticky-stacks');
});

test('saved pane widths fit narrow windows without changing the mobile drawer or losing preferences', async (t) => {
  const page = await pageFor(t);
  await page.getByRole('separator', { name: 'Site navigation width' }).focus();
  await page.keyboard.press('End');
  await page.getByRole('separator', { name: 'Page outline width' }).focus();
  await page.keyboard.press('End');
  await page.reload({ waitUntil: 'networkidle' });
  for (const width of [1280, 820, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth && document.querySelector('.site-article-column').getBoundingClientRect().width >= 384);
    if (width < 1280) assert.equal(await page.getByRole('separator', { name: /width$/ }).count(), 1);
  }
  await page.setViewportSize({ width: 390, height: 900 });
  assert.equal(await page.getByRole('separator', { name: /width$/ }).count(), 0);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  assert.equal((await paneWidths(page)).sidebar, 390);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForFunction(() => [...document.querySelectorAll('[data-site-pane]')].every(pane => Math.round(pane.getBoundingClientRect().width) === 448));
  assert.deepEqual(await savedPaneWidths(page), { sidebar: 448, outline: 448 });
});

test('pane resizing works with malformed cookies and retains legacy settings if cookies are blocked', async (t) => {
  const page = await pageFor(t);
  await page.context().addCookies([{ name: 'navigation-widths', value: encodeURIComponent('{broken'), url: base }]);
  await page.reload({ waitUntil: 'networkidle' });
  assert.deepEqual(await paneWidths(page), { sidebar: 256, outline: 256 });
  await page.context().clearCookies();
  await page.evaluate(() => localStorage.setItem('site-navigation-widths', JSON.stringify({ sidebar: 336, outline: 328 })));
  await page.context().addInitScript(() => {
    Object.defineProperty(document, 'cookie', {
      get() { throw new DOMException('Cookies blocked', 'SecurityError'); },
      set() { throw new DOMException('Cookies blocked', 'SecurityError'); },
    });
  });
  await page.reload({ waitUntil: 'networkidle' });
  assert.deepEqual(await paneWidths(page), { sidebar: 336, outline: 328 });
  assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('site-navigation-widths'))), { sidebar: 336, outline: 328 });
  await page.getByRole('separator', { name: 'Site navigation width' }).focus();
  await page.keyboard.press('ArrowRight');
  assert.equal((await paneWidths(page)).sidebar, 352);
});

test('settings remain understandable when JavaScript is unavailable', async (t) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  t.after(() => context.close());
  const page = await context.newPage();
  const response = await page.goto(base + '/settings/');
  assert.equal(response.status(), 200);
  const settings = page.getByRole('form', { name: 'Site settings' });
  assert.equal(await settings.getByLabel('Font', { exact: true }).isDisabled(), true);
  assert.equal(await page.getByText('Enable JavaScript to change your site settings.').isVisible(), true);
});

test('a deeply nested sidebar opens the full current path and marks its parent groups', async (t) => {
  const page = await pageFor(t);
  const current = page.locator('.section-nav a[aria-current="page"]');
  assert.equal(await current.count(), 1);
  assert.equal(new URL(await current.getAttribute('href'), base).pathname, route);
  const ancestors = await current.evaluate((link) => {
    const result = [];
    for (let group = link.closest('details'); group; group = group.parentElement.closest('details')) {
      result.push({ open: group.open, marked: group.parentElement.classList.contains('active-ancestor'), label: group.querySelector(':scope > summary').textContent });
    }
    return result;
  });
  assert.ok(ancestors.length >= 3);
  assert.ok(ancestors.every((group) => group.open && group.marked));
  assert.deepEqual(ancestors.map((group) => group.label), ['Usage', 'Methodology v1.3', 'Other']);
});

test('scrolling a long sidebar keeps its collection and parent section controls visible', async (t) => {
  for (const width of [1440, 390]) {
    const page = await pageFor(t, base + route, width);
    if (width === 390) await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.locator('.site-sidebar-scroll').evaluate(panel => { panel.scrollTop = panel.scrollHeight; });
    const context = await page.locator('.section-nav a[aria-current="page"]').evaluate(link => {
      const panel = link.closest('.site-sidebar-scroll').getBoundingClientRect();
      const root = link.closest('.section-nav').querySelector('.sidebar-root').getBoundingClientRect();
      const parents = [];
      for (let group = link.closest('details'); group; group = group.parentElement.closest('details')) {
        const summary = group.querySelector(':scope > summary');
        const bounds = summary.getBoundingClientRect();
        parents.unshift({ label: summary.textContent, top: bounds.top, bottom: bounds.bottom });
      }
      return { top: panel.top, bottom: panel.bottom, rootTop: root.top, rootBottom: root.bottom, parents };
    });
    assert.deepEqual(context.parents.map(parent => parent.label), ['Other', 'Methodology v1.3', 'Usage']);
    assert.ok(context.rootTop >= context.top);
    assert.ok(context.parents.every(parent => parent.top >= context.rootBottom - 1 && parent.bottom <= context.bottom));
    assert.ok(Math.abs(context.parents[0].top - context.rootBottom - 4) < 1);
    assert.ok(Math.abs(context.parents[1].top - context.parents[0].bottom - 4) < 1);
    await screenshot(page, `sticky-sidebar-${width}`);
    const parent = page.locator('.section-nav .sidebar-group.depth-1.active-ancestor > details');
    await parent.locator(':scope > summary').click();
    assert.equal(await parent.getAttribute('open'), null);
    await page.keyboard.press('Enter');
    assert.ok(await parent.getAttribute('open') !== null, 'Pinned section controls still work with the keyboard');
  }
});

test('breadcrumbs stay below the top bar and deep-linked headings stay below the breadcrumbs', async (t) => {
  const id = 'level-3--slices-and-state-snapshots';
  for (const width of [1440, 390]) {
    const page = await pageFor(t, base + route + `#${id}`, width);
    await page.waitForFunction((id) => {
      const heading = document.getElementById(id).getBoundingClientRect();
      const breadcrumb = document.querySelector('.breadcrumb').getBoundingClientRect();
      return heading.top >= breadcrumb.bottom + 8 && heading.top < innerHeight;
    }, id);
    const bounds = await page.locator('.breadcrumb').boundingBox();
    const header = await page.locator('.hextra-nav-container').boundingBox();
    assert.ok(Math.abs(bounds.y - header.y - header.height - 8) < 1);
    assert.ok(await page.evaluate(() => scrollY > 500));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await screenshot(page, `sticky-breadcrumb-${width}`);
    await page.getByRole('navigation', { name: 'Breadcrumb', exact: true }).getByRole('link').last().click();
    assert.equal(new URL(page.url()).pathname, '/ai/other/methodology-v1-3/usage/');
  }
});

test('opaque navigation hides page content above and around the rounded breadcrumb corners', async (t) => {
  for (const width of [1440, 390]) for (const scheme of ['light', 'dark']) {
    const page = await pageFor(t, base + route, width);
    await page.emulateMedia({ colorScheme: scheme });
    await page.waitForFunction(scheme => document.documentElement.classList.contains('dark') === (scheme === 'dark'), scheme);
    await page.evaluate(() => {
      window.scrollTo({ top: 1400, behavior: 'instant' });
      // Bright content behind the sticky layers makes any paint gap visible.
      const probe = document.createElement('div');
      probe.style.cssText = 'position:fixed;inset:0;background:#ff00ff;z-index:5;pointer-events:none';
      document.body.append(probe);
      return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    });
    const crumb = await page.locator('.breadcrumb').boundingBox();
    const header = await page.locator('.hextra-nav-container').boundingBox();
    const points = [
      { x: width / 2, y: header.y + header.height - 2 },
      { x: crumb.x + 1, y: crumb.y - 6 },
      { x: crumb.x + crumb.width - 2, y: crumb.y - 6 },
      { x: crumb.x + 1, y: crumb.y + 1 },
      { x: crumb.x + 1, y: crumb.y + crumb.height + 6 },
    ];
    const png = await page.screenshot({
      scale: 'css',
      path: screenshots ? path.join(screenshots, `opaque-navigation-${width}-${scheme}.png`) : undefined,
    });
    const paint = await page.evaluate(async ({ png, points }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${png}`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      context.fillStyle = getComputedStyle(document.body).backgroundColor;
      context.fillRect(0, 0, 1, 1);
      const expected = [...context.getImageData(0, 0, 1, 1).data];
      context.drawImage(image, 0, 0);
      return { expected, pixels: points.map(({ x, y }) => [...context.getImageData(Math.floor(x), Math.floor(y), 1, 1).data]) };
    }, { png: png.toString('base64'), points });
    assert.ok(paint.pixels.every(pixel => pixel.every((value, i) => value === paint.expected[i])), 'Page content is fully masked at the top bar, gaps, and rounded corners');
  }
});

test('the scrolling outline keeps its title and parent heading stack above the active heading', async (t) => {
  const page = await pageFor(t, base + '/system-design/projects/ticketmaster/');
  const id = await page.locator('.article-content h6[id]').first().getAttribute('id');
  await readAt(page, id);
  const current = page.locator('.hextra-toc a[aria-current="location"]');
  await current.evaluate(link => {
    const panel = link.closest('.site-toc-scroll');
    const offset = parseFloat(getComputedStyle(link).getPropertyValue('--site-sticky-offset'));
    panel.scrollTop += link.getBoundingClientRect().top - panel.getBoundingClientRect().top - offset - 8;
  });
  const context = await current.evaluate(link => {
    const panel = link.closest('.site-toc-scroll');
    const bounds = panel.getBoundingClientRect();
    const title = panel.querySelector('.site-toc-title').getBoundingClientRect();
    const parents = [];
    for (let item = link.closest('li').parentElement.closest('li'); item; item = item.parentElement.closest('li')) {
      const parent = item.querySelector(':scope > a');
      if (parent) {
        const rect = parent.getBoundingClientRect();
        parents.unshift({ top: rect.top, bottom: rect.bottom });
      }
    }
    return { top: bounds.top, bottom: bounds.bottom, titleTop: title.top, titleBottom: title.bottom, parents, currentTop: link.getBoundingClientRect().top };
  });
  assert.ok(context.parents.length >= 3);
  assert.ok(Math.abs(context.titleTop - context.top) < 1);
  let previous = context.titleBottom;
  for (const parent of context.parents) {
    assert.ok(parent.top >= previous - 1, 'Pinned parent labels do not overlap');
    previous = parent.bottom;
  }
  assert.ok(context.currentTop >= previous - 1, 'The active heading is below its pinned ancestors');
  await screenshot(page, 'sticky-outline');
  const ancestor = page.locator('.hextra-toc a.active-ancestor').first();
  const target = await ancestor.getAttribute('href');
  await ancestor.click();
  await page.waitForURL(url => url.hash === target);
  assert.equal(new URL(page.url()).hash, target);
});

test('the desktop breakpoint keeps the article visible and the navbar title inside its gutter', async (t) => {
  for (const width of [767, 768, 769, 820]) {
    const page = await pageFor(t, base + route, width);
    for (const font of ['system', 'jost']) {
      await page.evaluate(font => { document.documentElement.dataset.fontPreference = font; }, font);
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => {
        const main = document.querySelector('main').getBoundingClientRect();
        const sidebar = document.querySelector('.hextra-sidebar-container').getBoundingClientRect();
        const header = document.querySelector('.hextra-nav-container nav');
        const title = header.querySelector('a').getBoundingClientRect();
        const gutter = parseFloat(getComputedStyle(header).paddingInlineStart);
        return { mainLeft: main.left, sidebarRight: sidebar.right, sidebarWidth: sidebar.width, titleLeft: title.left, gutter, hit: Boolean(document.elementFromPoint(main.left + main.width / 2, 400)?.closest('main')) };
      });
      assert.ok(layout.titleLeft >= layout.gutter - 1, `${width}px ${font}: header title stays inside its gutter`);
      assert.ok(layout.hit, `${width}px ${font}: the sidebar does not cover the article`);
      if (width >= 768) {
        assert.ok(layout.mainLeft >= layout.sidebarRight - 1, `${width}px ${font}: sidebar and article occupy separate columns`);
        assert.ok(layout.sidebarWidth < width / 2, `${width}px ${font}: sidebar stays within its desktop column`);
      }
    }
    await screenshot(page, `desktop-boundary-${width}`);
  }
});

test('short viewports leave room for the active outline entry below the pinned title', async (t) => {
  const page = await pageFor(t);
  await page.setViewportSize({ width: 1440, height: 480 });
  await readAt(page, 'level-3--slices-and-state-snapshots');
  await page.waitForFunction(() => {
    const active = document.querySelector('.hextra-toc a.active').getBoundingClientRect();
    const title = document.querySelector('.site-toc-title').getBoundingClientRect();
    return active.top >= title.bottom && active.bottom <= innerHeight;
  });
  assert.ok(await page.locator('.hextra-toc .site-toc-parent').evaluateAll(links => links.every(link => getComputedStyle(link).position !== 'sticky')));
  await screenshot(page, 'sticky-short-viewport');
});

test('the page outline includes all six heading levels with nested indentation and highlighting', async (t) => {
  for (const pathname of [framework, '/system-design/projects/ticketmaster/']) {
    const page = await pageFor(t, base + pathname);
    const structure = await page.evaluate(() => ({
      headingIds: [...document.querySelectorAll('.article-content :is(h1, h2, h3, h4, h5, h6)[id]')].map((heading) => heading.id),
      outlineIds: [...document.querySelectorAll('.hextra-toc a[href^="#"]')].map((link) => decodeURIComponent(link.hash.slice(1))),
      nested: document.querySelectorAll('.hextra-toc li > ul').length,
    }));
    assert.deepEqual(structure.outlineIds, structure.headingIds);
    assert.ok(structure.nested >= 4);
    const sixthLevel = page.locator('.article-content h6[id]');
    const deepestHeading = await sixthLevel.count() ? sixthLevel.first() : page.locator('.article-content h5[id]').first();
    const deepest = await deepestHeading.getAttribute('id');
    assert.ok(deepest);
    await readAt(page, deepest);
    const outline = await page.locator(`.hextra-toc a[href="#${deepest}"]`).evaluate((link) => {
      let item = link.closest('li');
      let parent;
      while (!parent && (item = item.parentElement.closest('li'))) parent = item.querySelector(':scope > a');
      return { left: link.getBoundingClientRect().left, parentLeft: parent?.getBoundingClientRect().left };
    });
    assert.ok(outline.left > outline.parentLeft, 'Child headings are visibly indented');
    assert.ok(await page.locator('.hextra-toc a.active-ancestor').count() >= 2);
    await screenshot(page, pathname === framework ? 'hextra-outline' : 'hextra-six-level-outline');
  }
});

test('scrolling updates the current heading and its ancestors, including between headings', async (t) => {
  const page = await pageFor(t);
  const first = '21-why-standard-observability-is-insufficient';
  const second = '22-why-ad-hoc-evaluation-is-insufficient';
  await readAt(page, first);
  assert.equal(await page.locator('.hextra-toc a.active-ancestor').count(), 2);
  await readAt(page, second);
  assert.equal(await page.locator(`.hextra-toc a[href="#${first}"]`).getAttribute('aria-current'), null);
  // Jump into a different section's body with its heading above the viewport.
  // An observer of visible headings alone cannot select this section reliably.
  const bodySection = '61-normative-specifications-mustshould-schemas-conformance';
  await page.evaluate((id) => {
    const heading = document.getElementById(id);
    window.scrollTo({ top: heading.getBoundingClientRect().top + window.scrollY + 100, behavior: 'instant' });
  }, bodySection);
  await page.waitForFunction((id) => document.querySelector('.hextra-toc a[aria-current="location"]')?.hash === `#${id}`, bodySection);
  assert.equal(await page.locator('.hextra-toc a.active-ancestor').count(), 2);
  assert.equal(await page.locator('.hextra-toc [aria-current="location"]').count(), 1);
  await screenshot(page, 'hextra-active-outline');
});

test('deep links and clicked outline entries select the exact heading below the fixed header', async (t) => {
  const id = 'level-3--slices-and-state-snapshots';
  const page = await pageFor(t, base + route + `#${id}`);
  await page.waitForFunction((id) => document.querySelector('.hextra-toc [aria-current="location"]')?.hash === `#${id}`, id);
  assert.equal(await page.locator('.hextra-toc a.active-ancestor').count(), 3);
  // Use an actual existing target rather than relying on a title's spelling.
  const destination = page.locator('.hextra-toc a[href="#8-adoption-plan-phased-rollout-with-exit-criteria"]');
  await destination.click();
  await page.waitForFunction(() => location.hash === '#8-adoption-plan-phased-rollout-with-exit-criteria');
  await page.waitForFunction(() => {
    const top = document.getElementById('8-adoption-plan-phased-rollout-with-exit-criteria').getBoundingClientRect().top;
    return top >= 56 && top < 160;
  });
  const bounds = await page.locator('[id="8-adoption-plan-phased-rollout-with-exit-criteria"]').boundingBox();
  assert.ok(bounds.y >= 56 && bounds.y < 160, `Heading visible below navbar: ${bounds.y}`);
});

test('late active headings remain visible inside the scrolling outline', async (t) => {
  const page = await pageFor(t);
  await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await page.waitForFunction(() => document.querySelector('.hextra-toc a[aria-current="location"]')?.hash === '#appendix-b-what-to-read-next');
  const result = await page.locator('.hextra-toc .site-toc-scroll').evaluate((panel) => {
    const active = panel.querySelector('a[aria-current="location"]').getBoundingClientRect();
    const bounds = panel.getBoundingClientRect();
    return { top: active.top, bottom: active.bottom, panelTop: bounds.top, panelBottom: bounds.bottom, scrollTop: panel.scrollTop };
  });
  assert.ok(result.scrollTop > 0);
  assert.ok(result.top >= result.panelTop && result.bottom <= result.panelBottom);
  await screenshot(page, 'hextra-late-outline');
});

test('mobile and tablet readers can navigate a multi-level page outline and the section menu', async (t) => {
  for (const width of [390, 1024]) {
    const page = await pageFor(t, base + route, width);
    const outline = page.locator('.site-mobile-toc');
    assert.ok(await outline.isVisible());
    await outline.locator('summary').focus();
    await page.keyboard.press('Enter');
    assert.ok(await outline.getAttribute('open') !== null);
    assert.ok(await outline.locator('li > ul li > ul li > ul').count() > 0);
    const destination = outline.locator('a[href="#level-3--slices-and-state-snapshots"]');
    await destination.click();
    assert.equal(await outline.getAttribute('open'), null);
    assert.equal(new URL(page.url()).hash, '#level-3--slices-and-state-snapshots');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if (width === 390) {
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      const current = page.locator('.section-nav a[aria-current="page"]');
      assert.ok(await current.isVisible());
      await screenshot(page, 'hextra-mobile-menu');
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
    }
  }
});

test('short and deeply nested breadcrumb trails wrap on mobile and navigate to their parents', async (t) => {
  const cases = [
    { pathname: '/system-design/', labels: ['Home', 'System Design'], parents: ['/'] },
    { pathname: '/system-design/frameworks/framework-iv/', labels: ['Home', 'System Design', 'Frameworks', 'Interviewing.io System Design Framework'], parents: ['/', '/system-design/', '/system-design/frameworks/'] },
    { pathname: '/system-design/integrated-test-pages/callouts/', labels: ['Home', 'System Design', 'Migration Test Pages', 'Callouts'], parents: ['/', '/system-design/', '/system-design/integrated-test-pages/'] },
    { pathname: route, labels: ['Home', 'AI', 'Other', 'Methodology v1.3', 'Usage', 'Overview and Adoption RFC'], parents: ['/', '/ai/', '/ai/other/', '/ai/other/methodology-v1-3/', '/ai/other/methodology-v1-3/usage/'] },
  ];
  for (const width of [1440, 390]) {
    const page = await pageFor(t, base + cases[0].pathname, width);
    for (const { pathname, labels, parents } of cases) {
      await page.goto(base + pathname, { waitUntil: 'networkidle' });
      const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb', exact: true });
      assert.deepEqual(await breadcrumb.locator('li').allTextContents(), labels);
      assert.deepEqual(await breadcrumb.locator('a').evaluateAll((links) => links.map((link) => new URL(link.href).pathname)), parents);
      assert.equal(await breadcrumb.locator('[aria-current="page"]').count(), 1);
      assert.equal(await breadcrumb.locator('[aria-current="page"] a').count(), 0);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      if (screenshots && pathname === route) await screenshot(page, `breadcrumbs-${width}`);
      await breadcrumb.locator('a').last().click();
      assert.equal(new URL(page.url()).pathname, parents.at(-1));
    }
  }
});

test('all ten imported callout styles retain their titles, icons, lists and code in light/dark and mobile layouts', async (t) => {
  const pathname = '/system-design/integrated-test-pages/callouts/';
  const page = await pageFor(t, base + pathname);
  const titles = ['Note', 'Tip', 'Caution', 'Danger', 'Important', 'Radiation hazard', 'Info', 'Question', 'Thumbup', 'Thumbdown'];
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const scheme of ['light', 'dark']) {
      await page.emulateMedia({ colorScheme: scheme });
      await page.waitForFunction((scheme) => document.documentElement.classList.contains('dark') === (scheme === 'dark'), scheme);
      const boxes = await page.locator('.site-callout-title').evaluateAll((headings) => headings.map((title) => {
        const box = title.closest('[class~="hx:overflow-x-auto"]');
        return {
          title: title.textContent.trim(),
          background: getComputedStyle(box).backgroundColor,
          icon: box.querySelector('svg')?.innerHTML,
          list: [...box.querySelectorAll('li')].map((item) => item.textContent.trim()),
          code: [...box.querySelectorAll('pre code')].map((code) => code.textContent.trim()),
        };
      }));
      assert.deepEqual(boxes.map((box) => box.title), titles);
      assert.ok(boxes.every((box) => box.icon && box.background !== 'rgba(0, 0, 0, 0)'));
      assert.equal(new Set(boxes.map((box) => box.background)).size, 4);
      // Existing source meanings are preserved: Important/Info use Note's style,
      // while warnings and Thumbdown use Caution's style.
      for (const title of ['Important', 'Info', 'Question', 'Thumbup']) {
        assert.equal(boxes.find((box) => box.title === title).background, boxes[0].background);
      }
      for (const title of ['Radiation hazard', 'Thumbdown']) {
        assert.equal(boxes.find((box) => box.title === title).background, boxes[2].background);
      }
      assert.deepEqual(boxes[2].list, ['First caution item', 'Second caution item']);
      assert.deepEqual(boxes[3].code, ['npm create thulite@latest -- --template doks']);
      const aliasIcons = ['Note', 'Question', 'Thumbup', 'Thumbdown'].map((title) => boxes.find((box) => box.title === title).icon);
      assert.equal(new Set(aliasIcons).size, 4);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      await screenshot(page, `callouts-${scheme}-${width}`);
    }
  }
});

test('the expanded outline preserves deployed heading paths while adding deeper headings', { skip: !reference }, async (t) => {
  for (const [index, pathname] of [route, framework].entries()) {
    const local = await pageFor(t, base + pathname);
    const deployed = await pageFor(t, reference + pathname);
    async function structure(page, selector) {
      return page.locator(selector).evaluate((outline) => [...outline.querySelectorAll('a[href^="#"]')].map((link) => {
        const parents = [];
        let item = link.closest('li');
        while ((item = item?.parentElement.closest('li'))) {
          const parent = item.querySelector(':scope > a');
          if (parent) parents.unshift(parent.hash);
        }
        return { hash: link.hash, parents };
      }));
    }
    const previous = await structure(deployed, '.docs-toc');
    const previousIds = new Set(previous.map((heading) => heading.hash));
    const current = (await structure(local, '.hextra-toc'))
      .filter((heading) => previousIds.has(heading.hash))
      .map((heading) => ({ ...heading, parents: heading.parents.filter((hash) => previousIds.has(hash)) }));
    assert.deepEqual(current, previous);
    await screenshot(local, `hextra-comparison-${index}`);
    await screenshot(deployed, `deployed-comparison-${index}`);
  }
});
