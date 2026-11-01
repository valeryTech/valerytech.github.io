import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const { chromium, webkit, devices } = createRequire(import.meta.url)('playwright-core');
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

async function pageFor(t, url = base + route, width = 1440, device = {}) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce', ...device });
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

function cycleSetting(scope, label) {
  return scope.getByRole('button', { name: new RegExp('^' + label + ': ') });
}

async function chooseSetting(scope, label, value) {
  const button = cycleSetting(scope, label);
  const count = await button.locator('[data-preference-choice]').count();
  for (let index = 0; index < count; index++) {
    if (await button.getAttribute('value') === value) return;
    await button.click();
  }
  assert.equal(await button.getAttribute('value'), value, label);
}

async function settleLayout(page) {
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
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

test('the theme button cycles through Light, Dark and System with saved and keyboard selections', async (t) => {
  for (const [width, height] of [[1440, 900], [768, 900], [390, 900], [390, 320]]) {
    const page = await pageFor(t);
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ colorScheme: 'light' });
    await settleLayout(page);
    const trigger = page.locator('.site-header-preferences .hextra-theme-toggle');
    const bounds = await trigger.boundingBox();
    assert.equal(await trigger.getAttribute('aria-haspopup'), null);
    assert.equal(await page.locator('.hextra-theme-toggle-options').count(), 0, 'Cycling does not open a menu');

    async function expectMode(mode, dark) {
      await page.waitForFunction(({ mode, dark }) => {
        const button = document.querySelector('.hextra-theme-toggle');
        return button.parentElement.dataset.theme === mode && document.documentElement.classList.contains('dark') === dark;
      }, { mode, dark });
      assert.equal(await trigger.locator('.site-theme-icon:visible').count(), 1, 'Only the current mode occupies the icon frame');
      assert.ok(await trigger.locator(`[data-theme-choice="${mode}"]`).first().isVisible());
      const next = { light: 'Dark', dark: 'System', system: 'Light' }[mode];
      const label = `Theme: ${mode[0].toUpperCase() + mode.slice(1)}. Switch to ${next}.`;
      assert.equal(await trigger.getAttribute('aria-label'), label, 'The accessible name identifies the current and next modes');
      assert.equal(await trigger.getAttribute('title'), label);
    }

    await expectMode('system', false);
    await trigger.click();
    await expectMode('light', false);
    assert.equal(await page.evaluate(() => localStorage.getItem('color-theme')), 'light');
    await trigger.press('Enter');
    await expectMode('dark', true);
    assert.equal(await page.evaluate(() => localStorage.getItem('color-theme')), 'dark');
    await page.reload({ waitUntil: 'networkidle' });
    await expectMode('dark', true);

    await trigger.press('Space');
    await expectMode('system', false);
    assert.equal(await trigger.evaluate(element => element === document.activeElement), true, 'Keyboard cycling retains focus');
    assert.equal(await page.evaluate(() => localStorage.getItem('color-theme')), 'system');
    await page.emulateMedia({ colorScheme: 'dark' });
    await expectMode('system', true);
    await page.reload({ waitUntil: 'networkidle' });
    await expectMode('system', true);
    await screenshot(page, `theme-cycle-${width}-${height}`);
    await page.emulateMedia({ colorScheme: 'light' });
    await expectMode('system', false);

    await trigger.click();
    await expectMode('light', false);
    await page.emulateMedia({ colorScheme: 'dark' });
    await expectMode('light', false);
    await page.reload({ waitUntil: 'networkidle' });
    await expectMode('light', false);
    assert.deepEqual(await trigger.boundingBox(), bounds, 'Theme changes keep the button and shared header alignment fixed');
    assert.ok(bounds.y + bounds.height <= height, 'The theme control stays within the viewport');
  }
});

test('the top bar toggle keeps its state across pages and stays in the expanded or collapsed outline heading', async (t) => {
  const page = await pageFor(t);
  const toggle = page.locator('[data-header-toggle]');
  const header = page.getByRole('navigation', { name: 'Primary', exact: true });
  assert.equal(await toggle.getAttribute('aria-label'), 'Hide top bar');
  assert.equal(await toggle.evaluate(button => button.parentElement.classList.contains('site-toc-title')), true);
  const before = await page.locator('.breadcrumb').boundingBox();
  const headerHeight = await page.locator('#site-header').evaluate(element => element.getBoundingClientRect().height);
  await toggle.press('Enter');
  assert.equal(await header.isVisible(), false);
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(await toggle.getAttribute('aria-label'), 'Show top bar');
  assert.equal(await toggle.evaluate(button => button === document.activeElement), true);
  await settleLayout(page);
  const after = await page.locator('.breadcrumb').boundingBox();
  assert.ok(Math.abs(before.y - after.y - headerHeight) < 1, 'Hiding the top bar releases its height');
  assert.equal(after.x, before.x);
  assert.equal(after.width, before.width);
  await screenshot(page, 'top-bar-hidden');

  await page.getByRole('button', { name: 'Hide page outline', exact: true }).click();
  assert.equal(await toggle.evaluate(button => button.parentElement.hasAttribute('data-outline-restore-slot')), true);
  assert.equal(await toggle.isVisible(), true);
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await header.isVisible(), false);
  assert.equal(await toggle.isVisible(), true);
  await toggle.press('Space');
  assert.equal(await header.isVisible(), true);
  await page.getByRole('button', { name: 'Show page outline', exact: true }).click();
  await toggle.click();
  await page.getByRole('navigation', { name: 'Breadcrumb', exact: true }).getByRole('link', { name: 'Usage', exact: true }).click();
  await page.waitForURL(url => url.pathname === '/ai/other/methodology-v1-3/usage/');
  await toggle.waitFor({ state: 'visible' });
  assert.equal(await header.isVisible(), false, 'Following a link preserves the hidden top bar');
  await toggle.click();
  assert.equal(await header.isVisible(), true);
});

test('the top bar can always be restored on compact layouts and pages without an outline', async (t) => {
  const page = await pageFor(t);
  const toggle = page.locator('[data-header-toggle]');
  for (const viewport of [{ width: 390, height: 900 }, { width: 820, height: 320 }, { width: 320, height: 480 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport);
    await settleLayout(page);
    if (viewport.width < 768) {
      assert.equal(await toggle.isVisible(), false, 'The visible mobile bar has no floating control over the text');
      await page.locator('.site-header-preferences .site-settings-link').click();
      await page.getByRole('dialog', { name: 'Site settings' }).getByLabel('Show top bar', { exact: true }).uncheck();
      await page.locator('[data-settings-close]').click();
      await page.waitForFunction(() => document.activeElement?.matches('[data-header-toggle]'));
      assert.equal(await toggle.evaluate(button => button === document.activeElement), true, 'Closing Settings focuses the restore button when the bar is hidden');
    } else {
      await toggle.click();
    }
    assert.equal(await page.locator('#site-header').isVisible(), false);
    const before = await toggle.boundingBox();
    assert.ok(before.x >= 0 && before.y >= 0 && before.x + before.width <= viewport.width && before.y + before.height <= viewport.height);
    await page.reload({ waitUntil: 'networkidle' });
    await toggle.click();
    assert.equal(await page.locator('#site-header').isVisible(), true);
    if (viewport.width < 768) {
      assert.equal(await toggle.isVisible(), false);
      assert.equal(await page.locator('.site-header-preferences .site-settings-link').evaluate(button => button === document.activeElement), true, 'Restoring the mobile bar returns focus to Settings');
    }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  }
  await page.goto(base + '/settings/', { waitUntil: 'networkidle' });
  assert.equal(await toggle.evaluate(button => button.parentElement.hasAttribute('data-header-toggle-home')), true);
  await toggle.click();
  await page.locator('[data-settings-reset]').click();
  assert.equal(await page.locator('#site-header').isVisible(), true, 'Reset restores the default visible bar');

  const context = await browser.newContext({ javaScriptEnabled: false });
  t.after(() => context.close());
  await context.addCookies([{ name: 'display-preferences', value: encodeURIComponent(JSON.stringify({ headerVisible: false })), url: base }]);
  const noScript = await context.newPage();
  await noScript.goto(base + route);
  assert.equal(await noScript.locator('#site-header').isVisible(), true, 'Without JavaScript the navigation stays available');
  assert.equal(await noScript.locator('[data-header-toggle]').isVisible(), false);
});

test('context headings share one configured minimum height and shrink again after resizing', async (t) => {
  const config = JSON.parse(readFileSync(new URL('../../data/ui/style.json', import.meta.url), 'utf8'));
  const page = await pageFor(t);
  const selectors = ['.breadcrumb', '.sidebar-root > a', '.site-toc-title', '.site-sidebar-toggle', '.site-outline-toggle'];
  assert.equal(await page.locator('.breadcrumb').evaluate(element => parseFloat(getComputedStyle(element).minHeight)), config.contextHeaderMinHeightPixels);

  async function expectHeight(height) {
    await page.waitForFunction(({ selectors, height }) => selectors.every(selector => {
      const element = document.querySelector(selector);
      return element && Math.abs(element.getBoundingClientRect().height - height) < 1;
    }), { selectors, height });
  }

  for (const width of [1440, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await settleLayout(page);
    await page.waitForFunction(selectors => {
      const height = document.querySelector('.breadcrumb').getBoundingClientRect().height;
      return selectors.every(selector => Math.abs(document.querySelector(selector).getBoundingClientRect().height - height) < 1);
    }, selectors);
    const original = await page.locator('.breadcrumb').evaluate(element => element.getBoundingClientRect().height);
    const larger = original + 16;
    await page.evaluate(height => document.documentElement.style.setProperty('--site-context-header-min-height', `${height}px`), larger);
    await expectHeight(larger);
    await page.evaluate(() => document.documentElement.style.removeProperty('--site-context-header-min-height'));
    await expectHeight(original);
    assert.ok(await page.locator('.sidebar-root > [data-sidebar-toggle]').evaluate(button => {
      const heading = button.parentElement.getBoundingClientRect();
      const bounds = button.getBoundingClientRect();
      return Math.abs(bounds.top + bounds.height / 2 - heading.top - heading.height / 2) < 1;
    }), 'The collapse control stays centered in the navigation heading');
  }
});

test('the header and page context share alignment guides without overflowing at smaller widths', async (t) => {
  const config = JSON.parse(readFileSync(new URL('../../data/ui/style.json', import.meta.url), 'utf8'));
  const collections = ['AI Engineering', 'AI', 'Engineering', 'Evaluation', 'System Design'];
  for (const width of [1920, 1440, 1280, 1152, 1024, 960, 820, 768, 390, 320]) {
    const spacing = width < 384 ? Math.min(config.layoutGapPixels, 8) : config.layoutGapPixels;
    const page = await pageFor(t, base + framework, width);
    assert.equal(await page.locator('.site-brand-title').count(), 0, 'The header uses the V mark without a repeated wordmark');
    assert.equal(await page.locator('.site-brand-link').getAttribute('aria-label'), 'Systems & Engineering — Home');
    assert.deepEqual(await page.locator('.site-header-links > a').allTextContents().then(labels => labels.map(label => label.trim())), collections);
    for (const font of ['system', 'jost']) {
      await page.evaluate(font => { document.documentElement.dataset.fontPreference = font; }, font);
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => {
        const rect = selector => document.querySelector(selector)?.getBoundingClientRect();
        const textLeft = selector => {
          const element = document.querySelector(selector);
          const range = document.createRange();
          range.selectNodeContents(element);
          return range.getBoundingClientRect().left;
        };
        const header = rect('.site-header');
        const search = rect('.hextra-search-trigger');
        const crumb = rect('.breadcrumb');
        const headerContentCenter = (header.top + crumb.top) / 2;
        const links = [...document.querySelectorAll('.site-header-links > a')].filter(link => link.getClientRects().length).map(link => link.getBoundingClientRect());
        const brand = rect('.site-header-brand a');
        const mark = rect('.site-brand-mark');
        const sections = rect('.site-header-links');
        const headerGap = parseFloat(getComputedStyle(document.querySelector('.site-header-links')).marginInlineStart);
        const rootAction = rect('.sidebar-root [data-sidebar-toggle]');
        return {
          overflow: document.documentElement.scrollWidth > innerWidth,
          brandLeft: brand.left,
          brandRight: brand.right,
          brandCenter: brand.left + brand.width / 2,
          rootActionCenter: rootAction.left + rootAction.width / 2,
          headerGap,
          continuousLinks: links.slice(1).every((link, i) => Math.abs(link.left - links[i].right) < 1),
          sectionsLeft: sections.left,
          sectionsRight: sections.right,
          logoPadding: [mark.left - brand.left, mark.top - brand.top, brand.right - mark.right, brand.bottom - mark.bottom],
          brandCentered: Math.abs(brand.top + brand.height / 2 - headerContentCenter) < 1,
          linksInside: links.every(link => link.left >= 0 && link.right <= innerWidth && Math.abs(link.top + link.height / 2 - headerContentCenter) < 1),
          firstLinkLeft: links[0]?.left,
          lastLinkRight: links.at(-1)?.right,
          searchLeft: search.left,
          preferencesLeft: rect('.site-header-preferences').left,
          searchLabelVisible: document.querySelector('.hextra-search-trigger-label').getClientRects().length > 0,
          searchRight: search.right,
          searchCentered: Math.abs(search.top + search.height / 2 - headerContentCenter) < 1,
          crumbTop: crumb.top,
          crumbBottom: crumb.bottom,
          crumbLeft: crumb.left,
          crumbRight: crumb.right,
          crumbTextLeft: textLeft('.breadcrumb ol > li:first-child > a'),
          crumbRootRight: rect('.site-breadcrumb-root').right,
          crumbIconLeft: rect('.site-breadcrumb-home svg').left,
          crumbGap: parseFloat(getComputedStyle(document.querySelector('.breadcrumb')).columnGap),
          headerBottom: header.bottom,
          rootTop: rect('.sidebar-root').top,
          rootRight: rect('.sidebar-root').right,
          contentLeft: rect('main > .content').left,
          contentRight: rect('main > .content').right,
          contentTop: rect('main > .content').top,
          outlineTop: rect('.site-toc-title').top,
          outlineLeft: rect('.site-toc-title').left,
          outlineRight: rect('.site-toc-title').right,
          outlineTextLeft: textLeft('.site-toc-title-label'),
          outlineIconLeft: rect('.site-outline-toggle [data-pane-icon="hide"] svg').left,
          searchLeadingLeft: rect('.hextra-search-trigger-icon').left,
          searchTextLeft: textLeft('.hextra-search-trigger-label'),
        };
      });
      assert.equal(layout.overflow, false, `${width}px ${font}: no horizontal overflow`);
      assert.ok(layout.brandLeft >= 0 && layout.linksInside && layout.searchRight <= width, `${width}px ${font}: header contents fit`);
      assert.ok(layout.brandCentered && layout.searchCentered, `${width}px ${font}: brand and controls center in the full space above the context row`);
      assert.ok(layout.logoPadding.every(padding => Math.abs(padding - layout.logoPadding[0]) < 1), 'The logo has equal padding on all sides');
      assert.ok(Math.abs(layout.crumbTop - layout.headerBottom - spacing) < 1, `${width}px ${font}: context follows the shared spacing below the header`);
      assert.ok(Math.abs(layout.crumbTextLeft - layout.crumbRootRight - layout.crumbGap) < 1, `${width}px ${font}: the trail follows the home controls with the shared gap`);
      assert.ok(layout.crumbLeft < layout.contentLeft && layout.crumbRight >= layout.contentRight, 'The breadcrumb surface supplies padding around the reading guide');
      assert.ok(Math.abs(layout.contentTop - layout.crumbBottom - config.articleTopGapPixels) < 1, `${width}px ${font}: content follows the configured article spacing below the context surface`);
      if (width >= 1024) {
        assert.ok(layout.firstLinkLeft >= layout.brandRight - 1, `${width}px ${font}: brand and collection links do not overlap`);
        assert.ok(layout.lastLinkRight <= layout.searchLeft - 1, `${width}px ${font}: links leave space before search`);
        assert.ok(Math.abs(layout.crumbTop - layout.rootTop) < 1, `${width}px ${font}: left navigation and breadcrumbs share a top edge`);
      }
      if (width >= 1024) {
        assert.ok(Math.abs(layout.brandCenter - layout.rootActionCenter) < 1, 'The Home control aligns with the leading sidebar action');
        assert.ok(Math.abs(layout.sectionsLeft - layout.brandRight - layout.headerGap) < 1 && layout.continuousLinks, 'Sections form one continuous surface after the Home control');
        assert.ok(Math.abs(layout.sectionsRight - layout.crumbRight) < 1, 'The shared sections bar ends on the breadcrumb guide');
        assert.ok(Math.abs((layout.crumbIconLeft - layout.crumbLeft) - (layout.outlineIconLeft - layout.outlineLeft)) < 1, 'Breadcrumb and outline icons share the same leading inset');
        assert.ok(Math.abs(layout.preferencesLeft - layout.outlineLeft) < 1, 'Preferences and search together share the outline heading’s start');
        assert.ok(Math.abs(layout.searchRight - layout.outlineRight) < 1, 'Search follows the visible outline card’s right edge');
        assert.ok(Math.abs(layout.crumbTop - layout.outlineTop) < 1, 'Outline title and breadcrumbs share a top edge');
        assert.ok(Math.abs((layout.crumbLeft - layout.rootRight) - (layout.outlineLeft - layout.crumbRight)) < 1, 'Breadcrumbs have the same gap to both navigation panes');
        if (layout.searchLabelVisible) {
          assert.ok(layout.searchLeadingLeft < layout.searchTextLeft, 'The search icon precedes its text');
          assert.ok(Math.abs(layout.searchTextLeft - layout.searchLeft - layout.outlineTextLeft + layout.outlineLeft) < 1, 'Search and outline labels use the same inset');
        }
      }
    }
    const documentSearchRight = await page.locator('.hextra-search-trigger').evaluate(element => element.getBoundingClientRect().right);
    const documentBrandLeft = await page.locator('.site-brand-link').evaluate(element => element.getBoundingClientRect().left);
    await page.goto(base + '/', { waitUntil: 'networkidle' });
    const home = await page.evaluate(() => ({ title: document.querySelector('main h1').getBoundingClientRect().left, contentLeft: document.querySelector('main').getBoundingClientRect().left, contentInset: parseFloat(getComputedStyle(document.querySelector('main')).paddingInlineStart), brand: document.querySelector('.site-brand-link').getBoundingClientRect().left, contentRight: document.querySelector('.homepage-details').getBoundingClientRect().right, searchRight: document.querySelector('.hextra-search-trigger').getBoundingClientRect().right }));
    assert.ok(Math.abs(home.brand - documentBrandLeft) < 1, `${width}px: the Home control stays in place between document and homepage`);
    assert.ok(Math.abs(home.title - home.contentLeft - home.contentInset) < 1, `${width}px: homepage content retains its reading inset`);
    assert.ok(Math.abs(home.searchRight - documentSearchRight) < 1, `${width}px: search stays in place between document and homepage`);
    if (width >= 1280) assert.ok(Math.abs(home.contentRight - home.searchRight) < 1, `${width}px: homepage content follows the search and outline right guide`);
    await screenshot(page, `aligned-home-${width}`);
    if (width >= 1280) {
      for (const path of ['/ai-engineering/', '/about/']) {
        await page.goto(base + path, { waitUntil: 'networkidle' });
        const edges = await page.evaluate(() => {
          const search = document.querySelector('.hextra-search-trigger').getBoundingClientRect();
          const outline = document.querySelector('.site-toc-title')?.getBoundingClientRect();
          return {
            content: document.querySelector('main > .content').getBoundingClientRect().right,
            breadcrumb: document.querySelector('.breadcrumb').getBoundingClientRect().right,
            search: search.right,
            searchLeft: search.left,
            preferencesLeft: document.querySelector('.site-header-preferences').getBoundingClientRect().left,
            outline: outline?.width ? { left: outline.left, right: outline.right } : null,
            overflow: document.documentElement.scrollWidth > innerWidth,
          };
        });
        assert.equal(edges.overflow, false, `${width}px ${path}: no horizontal overflow`);
        if (edges.outline) {
          assert.ok(Math.abs(edges.outline.left - edges.preferencesLeft) < 1 && Math.abs(edges.outline.right - edges.search) < 1, `${width}px ${path}: preferences and search follow the section outline surface`);
          assert.ok(edges.content <= edges.breadcrumb && edges.breadcrumb < edges.outline.left, `${width}px ${path}: section content and breadcrumbs clear the outline`);
        } else {
          assert.ok(Math.abs(edges.content - edges.search) < 1 && Math.abs(edges.breadcrumb - edges.search) < 1, `${width}px ${path}: full-width content and breadcrumbs share the search right guide`);
        }
      }
    }
  }
  // This page omits both navigation panes; breadcrumbs still follow the header.
  const settings = await pageFor(t, base + '/settings/');
  const gap = await settings.evaluate(() => document.querySelector('.breadcrumb').getBoundingClientRect().top - document.querySelector('.site-header').getBoundingClientRect().bottom);
  assert.ok(Math.abs(gap - config.layoutGapPixels) < 1);
});

test('desktop and mobile sections select the same most specific direction without JavaScript', async (t) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  t.after(() => context.close());
  const page = await context.newPage();
  await page.route(/googletagmanager\.com|google-analytics\.com|posthog\.com|clarity\.ms/, request => request.abort());
  for (const [path, section, state] of [
    ['/', null, null],
    ['/ai-engineering/approach/edd/', 'AI Engineering', 'true'],
    ['/ai-engineering/evaluation/', 'Evaluation', 'page'],
    ['/ai-engineering/evaluation/v2/failure-understanding/', 'Evaluation', 'true'],
    ['/ai/design-research/', 'AI', 'true'],
    ['/engineering/topics/api/', 'Engineering', 'true'],
    ['/system-design/projects/ticketmaster/', 'System Design', 'true'],
  ]) {
    const response = await page.goto(base + path);
    assert.equal(response.status(), 200);
    const sections = page.getByRole('group', { name: 'Sections', exact: true });
    assert.ok(await sections.isVisible());
    for (const navigation of [sections, page.locator('.mobile-site-nav')]) {
      assert.equal(await navigation.locator('a').count(), 5);
      const current = navigation.locator('[aria-current]');
      assert.equal(await current.count(), section ? 1 : 0, path);
      if (section) {
        assert.equal((await current.textContent()).trim(), section);
        assert.equal(await current.getAttribute('aria-current'), state);
      }
    }
    assert.deepEqual(
      await page.locator('.mobile-site-nav a').evaluateAll(links => links.map(link => link.getAttribute('href'))),
      await sections.locator('a').evaluateAll(links => links.map(link => link.getAttribute('href'))),
    );
  }
  await page.getByRole('group', { name: 'Sections', exact: true }).getByRole('link', { name: 'Evaluation', exact: true }).click();
  await page.waitForURL(url => url.pathname === '/ai-engineering/evaluation/');
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

test('the font button cycles choices that persist and restore independently of the deferred controls', async (t) => {
  const page = await pageFor(t, base + '/');
  await page.context().addCookies([{ name: 'font-preference', value: 'avenir', url: base }]);
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('data-font-preference'), 'system');
  const button = page.locator('#fontPreference');
  assert.equal(await button.getAttribute('aria-label'), 'Font: System. Switch to Jost.');
  assert.equal(await button.getAttribute('title'), 'Font: System. Switch to Jost.');
  assert.equal(await page.locator('#font-preference-container select').count(), 0);
  const shape = await button.evaluate(button => {
    const box = button.getBoundingClientRect();
    return { width: box.width, height: box.height, radius: getComputedStyle(button).borderRadius };
  });
  assert.equal(shape.width, shape.height);
  assert.equal(shape.radius, '50%');
  await button.click();
  assert.equal(await button.getAttribute('aria-label'), 'Font: Jost. Switch to System.');
  await button.press('Enter');
  await page.waitForFunction(() => document.documentElement.getAttribute('data-font-preference') === 'system');
  assert.equal(await button.getAttribute('aria-label'), 'Font: System. Switch to Jost.');
  await page.evaluate(() => {
    window.fontEvents = [];
    window.siteAnalytics = { emit: (name, parameters) => window.fontEvents.push({ name, parameters }) };
  });
  await page.keyboard.press('Space');
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

test('text brightness previews, saves and restores text, headings and menus on desktop and mobile', async (t) => {
  for (const width of [1440, 390]) {
    const page = await pageFor(t, base + '/settings/', width, width === 390 ? devices['iPhone 13'] : {});
    const settings = page.getByRole('form', { name: 'Site settings' });
    const brightness = cycleSetting(settings, 'Text brightness');
    const color = selector => page.locator(selector).first().evaluate(element => getComputedStyle(element).color);
    const previewColors = async () => ({
      body: await color('.site-settings-preview p'),
      heading: await color('.site-settings-preview-heading'),
    });
    const expectArticleColors = async expected => {
      await page.waitForFunction(expected => {
        const body = document.querySelector('.article-content > p:not(.page-description)');
        const heading = document.querySelector('.article-content h1');
        return getComputedStyle(body).color === expected.body && getComputedStyle(heading).color === expected.heading;
      }, expected);
      assert.equal(await color('.article-content > p:not(.page-description)'), expected.body);
      assert.equal(await color('.article-content h1'), expected.heading);
    };
    const expectMenuColors = async expected => {
      const selectors = [
        '.site-header-links > a:not([aria-current]):not(:hover):not(:focus-visible)',
        '.section-nav a:not([aria-current]):not(:hover):not(:focus-visible)',
        '.site-sidebar-section-row',
        '.site-page-outline a:not([aria-current]):not(:hover):not(:focus-visible)',
        '.site-toc-title',
      ];
      await page.waitForFunction(({ selectors, expected }) => selectors.every(selector => {
        const element = document.querySelector(selector);
        return element && getComputedStyle(element).color === expected;
      }), { selectors, expected });
      for (const selector of selectors) assert.equal(await color(selector), expected, selector);
    };
    const softMenu = 'rgb(163, 163, 163)';
    const brightMenu = 'rgb(229, 229, 229)';
    const softAccent = 'rgb(143, 175, 206)';
    const brightAccent = 'rgb(183, 210, 235)';
    const expectAccentColors = async expected => {
      for (const selector of [
        '.breadcrumb',
        '.breadcrumb a',
        '.site-header-preferences .site-settings-link',
        '.site-header-preferences .hextra-theme-toggle',
        '.site-header-tools .hextra-search-trigger',
        '.article-content a',
      ]) {
        await page.waitForFunction(({ selector, expected }) => getComputedStyle(document.querySelector(selector)).color === expected, { selector, expected });
        assert.equal(await color(selector), expected, selector);
      }
    };
    const soft = { body: 'rgb(199, 199, 199)', heading: 'rgb(221, 221, 221)' };
    const bright = { body: 'rgb(229, 229, 229)', heading: 'rgb(255, 255, 255)' };
    await page.emulateMedia({ colorScheme: 'light' });
    await page.waitForFunction(() => !document.documentElement.classList.contains('dark'));
    const light = await previewColors();
    assert.equal(await brightness.getAttribute('value'), 'soft');
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForFunction(() => document.documentElement.classList.contains('dark'));
    assert.deepEqual(await previewColors(), soft);
    await chooseSetting(settings, 'Text brightness', 'bright');
    assert.deepEqual(await previewColors(), bright);
    assert.equal((await displayCookie(page)).textBrightness, 'bright');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await screenshot(page, 'text-brightness-settings-' + width);
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await expectArticleColors(bright);
    await expectMenuColors(brightMenu);
    await expectAccentColors(brightAccent);
    await page.locator('.site-header-preferences .site-settings-link').click();
    const dialog = page.getByRole('dialog', { name: 'Site settings', exact: true });
    assert.equal(await cycleSetting(dialog, 'Text brightness').getAttribute('value'), 'bright');
    await chooseSetting(dialog, 'Text brightness', 'soft');
    await expectArticleColors(soft);
    await expectMenuColors(softMenu);
    await expectAccentColors(softAccent);
    assert.equal(await color('.site-settings-dialog'), soft.body);
    assert.equal(await color('.site-settings-dialog-header h2'), soft.heading);
    await chooseSetting(dialog, 'Text brightness', 'bright');
    assert.equal(await color('.site-settings-dialog'), bright.body);
    assert.equal(await color('.site-settings-dialog-header h2'), bright.heading);
    assert.equal(await color('.site-settings-dialog .site-settings-help'), soft.body);
    await page.keyboard.press('Escape');
    if (width === 390) {
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      assert.equal(await color('.mobile-site-nav a'), brightMenu);
      assert.equal(await color('.site-navigation-panel-header'), brightMenu);
      await screenshot(page, 'text-brightness-mobile-menu');
      await page.keyboard.press('Escape');
      await page.locator('.site-outline-trigger').click();
      assert.equal(await color('.site-outline-popover .site-navigation-panel-header'), brightMenu);
      await page.keyboard.press('Escape');
    } else await screenshot(page, 'text-brightness-desktop-menu');
    const chooser = await openBreadcrumbChooser(page, 'Methodology v1.3');
    assert.equal(await chooser.panel.locator('.site-breadcrumb-chooser-group').first().evaluate(element => getComputedStyle(element).color), brightMenu);
    await page.keyboard.press('Escape');
    // The head script restores the profile before deferred settings/navigation code runs.
    await page.route(/\/js\/custom[^/]*\.js(?:\?|$)/, request => request.abort());
    await page.reload({ waitUntil: 'networkidle' });
    await expectArticleColors(bright);
    await expectMenuColors(brightMenu);
    await expectAccentColors(brightAccent);
    await page.unroute(/\/js\/custom[^/]*\.js(?:\?|$)/);
    await page.goto(base + '/settings/', { waitUntil: 'networkidle' });
    await page.emulateMedia({ colorScheme: 'light' });
    await page.waitForFunction(() => !document.documentElement.classList.contains('dark'));
    assert.deepEqual(await previewColors(), light);
    assert.equal(await brightness.getAttribute('value'), 'bright');
    await settings.getByRole('button', { name: 'Reset to site defaults' }).click();
    assert.equal(await brightness.getAttribute('value'), 'soft');
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForFunction(() => document.documentElement.classList.contains('dark'));
    assert.deepEqual(await previewColors(), soft);
  }
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

function desktopPaneDefaults(width = 1440) {
  const { layout } = JSON.parse(readFileSync(new URL('../../data/ui/style.json', import.meta.url), 'utf8'));
  const frame = Math.min(width, layout.wideWidthRem * 16);
  return { sidebar: Math.round(frame * layout.sidebarWidthPercent / 100), outline: Math.round(frame * layout.outlineWidthPercent / 100) };
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

test('settings cycle buttons wrap through choices with clicks, touch, Enter and Space', async (t) => {
  for (const width of [1440, 390]) {
    const page = await pageFor(t, base + '/settings/', width, width === 390 ? devices['iPhone 13'] : {});
    const settings = page.getByRole('form', { name: 'Site settings' });
    const brightness = cycleSetting(settings, 'Text brightness');
    assert.equal(await settings.locator('select').count(), 0);
    assert.equal(await brightness.getAttribute('aria-label'), 'Text brightness: Soft. Switch to Bright.');
    assert.equal(await brightness.getAttribute('title'), await brightness.getAttribute('aria-label'));
    assert.equal(await brightness.locator('[data-preference-choice]:visible').count(), 1);
    await brightness.press('Enter');
    assert.equal(await brightness.getAttribute('value'), 'bright');
    assert.equal(await brightness.getAttribute('aria-label'), 'Text brightness: Bright. Switch to Soft.');
    assert.equal(await brightness.evaluate(button => button === document.activeElement), true);
    await brightness.press('Space');
    assert.equal(await brightness.getAttribute('value'), 'soft');
    assert.match(await settings.getByRole('status', { name: 'Settings status' }).textContent(), /Text brightness: Soft/);
    const size = cycleSetting(settings, 'Article text size');
    for (const value of ['large', 'larger', 'standard']) {
      if (width === 390) await size.tap();
      else await size.click();
      assert.equal(await size.getAttribute('value'), value);
      assert.equal(await size.locator('[data-preference-choice]:visible').count(), 1);
    }
    assert.equal(await page.locator('html').getAttribute('data-text-size'), 'standard');
    const bounds = await brightness.boundingBox();
    assert.ok(bounds.height >= 48, 'Cycle buttons share the standard control target height');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await screenshot(page, 'settings-cycle-' + width, { fullPage: true });
  }
});

test('the settings page offers editable reading and navigation preferences on desktop and mobile', async (t) => {
  for (const width of [1440, 390]) {
    const page = await pageFor(t, base + '/settings/', width);
    const settings = page.getByRole('form', { name: 'Site settings' });
    await chooseSetting(settings, 'Font', 'jost');
    await chooseSetting(settings, 'Article text size', 'larger');
    await chooseSetting(settings, 'Line spacing', 'roomy');
    await chooseSetting(settings, 'Breadcrumbs', 'static');
    await settings.getByLabel('Keep parent sections visible').uncheck();
    await settings.getByRole('slider', { name: 'Left navigation width' }).focus();
    await page.keyboard.press('End');
    await settings.getByRole('slider', { name: 'Page outline width' }).focus();
    await page.keyboard.press('Home');
    const outlineMinimum = Number(await settings.getByRole('slider', { name: 'Page outline width' }).getAttribute('min'));
    const savedWidths = await savedPaneWidths(page);
    assert.equal(savedWidths.sidebar, 448);
    // A compact default can already be the minimum, producing no range change.
    assert.equal(savedWidths.outline ?? outlineMinimum, outlineMinimum);
    assert.equal(Number(await settings.getByRole('slider', { name: 'Page outline width' }).inputValue()), outlineMinimum);
    assert.deepEqual(await displayCookie(page), { breadcrumbs: 'static', textSize: 'larger', lineSpacing: 'roomy', pinAncestors: false });
    assert.equal(await page.locator('#fontPreference').getAttribute('aria-label'), 'Font: Jost. Switch to System.');
    await page.locator('#fontPreference').click();
    assert.equal(await cycleSetting(settings, 'Font').getAttribute('value'), 'system');
    await chooseSetting(settings, 'Font', 'jost');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await cycleSetting(settings, 'Font').getAttribute('value'), 'jost');
    assert.equal(await cycleSetting(settings, 'Breadcrumbs').getAttribute('value'), 'static');
    assert.equal(await cycleSetting(settings, 'Article text size').getAttribute('value'), 'larger');
    assert.equal(await cycleSetting(settings, 'Line spacing').getAttribute('value'), 'roomy');
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
      const breadcrumb = document.querySelector('.breadcrumb');
      const crumb = breadcrumb.getBoundingClientRect();
      const style = getComputedStyle(breadcrumb);
      const inset = -parseFloat(style.marginInlineStart);
      const insetEnd = -parseFloat(style.marginInlineEnd);
      const settings = document.getElementById('site-settings').getBoundingClientRect();
      return Math.abs(crumb.left + inset - settings.left) < 1 && Math.abs(crumb.right - insetEnd - settings.right) < 1;
    });
    assert.ok(alignment, 'The breadcrumb surface extends evenly around the settings form column');
    await screenshot(page, `settings-${width}-light`, { fullPage: true });
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForFunction(() => document.documentElement.classList.contains('dark'));
    await screenshot(page, `settings-${width}-dark`, { fullPage: true });
  }
});

test('settings links open a native dialog with focus containment, dismissal and saved values', async (t) => {
  for (const width of [1440, 390]) {
    const page = await pageFor(t, base + '/', width);
    const trigger = page.getByRole('navigation', { name: 'Footer', exact: true }).getByRole('link', { name: 'Settings', exact: true });
    await trigger.scrollIntoViewIfNeeded();
    await trigger.focus();
    const before = await page.evaluate(() => ({ url: location.href, scroll: scrollY }));
    await trigger.click();
    const dialog = page.getByRole('dialog', { name: 'Site settings', exact: true });
    await dialog.waitFor({ state: 'visible' });
    assert.equal(await dialog.evaluate(element => element.matches(':modal')), true);
    const close = dialog.getByRole('button', { name: 'Close settings', exact: true });
    assert.equal(await close.evaluate(element => element === document.activeElement), true);
    await page.keyboard.press('Shift+Tab');
    assert.ok(await dialog.evaluate(element => element.contains(document.activeElement)), 'Keyboard focus remains inside the dialog');
    await page.keyboard.press('Escape');
    await dialog.waitFor({ state: 'hidden' });
    await page.waitForFunction(() => !document.documentElement.classList.contains('site-settings-open'));
    assert.equal(page.url(), before.url);
    assert.ok(Math.abs(await page.evaluate(() => scrollY) - before.scroll) < 2, 'Opening and closing keeps the reading position');
    assert.equal(await trigger.evaluate(element => element === document.activeElement), true);
    await trigger.click();
    const form = dialog.getByRole('form', { name: 'Site settings' });
    await chooseSetting(form, 'Font', 'jost');
    await chooseSetting(form, 'Article text size', 'larger');
    await form.getByRole('slider', { name: 'Left navigation width' }).focus();
    await page.keyboard.press('End');
    assert.equal(await page.locator('#fontPreference').getAttribute('aria-label'), 'Font: Jost. Switch to System.');
    await close.click();
    await trigger.click();
    assert.equal(await cycleSetting(form, 'Font').getAttribute('value'), 'jost');
    assert.equal(await form.getByRole('slider', { name: 'Left navigation width' }).inputValue(), '448');
    assert.ok(await dialog.evaluate(element => element.getBoundingClientRect().width <= innerWidth));
    await dialog.evaluate(element => { element.scrollTop = 0; });
    await screenshot(page, `settings-dialog-${width}-light`);
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.waitForFunction(() => document.documentElement.classList.contains('dark'));
    const contrast = await dialog.evaluate(element => {
      const label = element.querySelector('label');
      return {
        text: getComputedStyle(label).color,
        body: getComputedStyle(element).color,
        scheme: getComputedStyle(element.querySelector('.site-settings-cycle')).colorScheme,
      };
    });
    assert.equal(contrast.text, contrast.body, 'Dialog labels follow the chosen body text profile');
    assert.equal(contrast.scheme, 'dark', 'Native controls follow the dialog theme');
    assert.ok((await cycleSetting(dialog, 'Font').boundingBox()).height >= 40, 'Cycle controls keep a comfortable target height');
    await screenshot(page, `settings-dialog-${width}-dark`);
    await page.mouse.click(2, 2);
    await dialog.waitFor({ state: 'hidden' });
    assert.equal(page.url(), before.url);
  }
});

test('the reusable settings form stays synchronized with pane resizing and the full settings page', async (t) => {
  const page = await pageFor(t);
  const defaults = desktopPaneDefaults();
  await dragPane(page, page.getByRole('separator', { name: 'Site navigation width' }), 64);
  const trigger = page.locator('.site-header-preferences .site-settings-link');
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Site settings', exact: true });
  assert.equal(await dialog.getByRole('slider', { name: 'Left navigation width' }).inputValue(), String(defaults.sidebar + 64));
  await dialog.getByRole('slider', { name: 'Left navigation width' }).focus();
  await page.keyboard.press('End');
  assert.equal((await paneWidths(page)).sidebar, 448);
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  await settleLayout(page);
  await dragPane(page, page.getByRole('separator', { name: 'Page outline width' }), -32);
  await trigger.click();
  assert.equal(await dialog.getByRole('slider', { name: 'Page outline width' }).inputValue(), String(defaults.outline + 32));
  await dialog.getByRole('button', { name: 'Reset to site defaults' }).click();
  assert.deepEqual(await paneWidths(page), defaults);
  await page.keyboard.press('Escape');
  await page.goto(base + '/settings/', { waitUntil: 'networkidle' });
  const fullPage = page.locator('#site-settings');
  await page.getByRole('navigation', { name: 'Footer', exact: true }).getByRole('link', { name: 'Settings', exact: true }).click();
  await chooseSetting(dialog, 'Font', 'jost');
  await page.keyboard.press('Escape');
  assert.equal(await cycleSetting(fullPage, 'Font').getAttribute('value'), 'jost');
  await page.locator('#fontPreference').click();
  assert.equal(await cycleSetting(fullPage, 'Font').getAttribute('value'), 'system');
  await page.getByRole('navigation', { name: 'Footer', exact: true }).getByRole('link', { name: 'Settings', exact: true }).click();
  assert.equal(await cycleSetting(dialog, 'Font').getAttribute('value'), 'system');
  assert.equal(await page.evaluate(() => { const ids = [...document.querySelectorAll('[id]')].map(element => element.id); return ids.length === new Set(ids).size; }), true, 'Page and dialog controls have unique identifiers');
});

test('mobile settings opens from the header and returns focus without opening navigation', async (t) => {
  const page = await pageFor(t, base + route, 390);
  const menu = page.locator('.hextra-hamburger-menu');
  const trigger = page.locator('.site-header-preferences .site-settings-link');
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Site settings', exact: true });
  await dialog.waitFor({ state: 'visible' });
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
  assert.equal(await trigger.evaluate(element => element === document.activeElement), true);
  await menu.click();
  await page.keyboard.press('Escape');
  assert.equal(await menu.getAttribute('aria-expanded'), 'false');
});

test('settings links retain page navigation when the dialog API is unavailable', async (t) => {
  const page = await pageFor(t, base + '/');
  await page.context().addInitScript(() => { HTMLDialogElement.prototype.showModal = undefined; });
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('navigation', { name: 'Footer', exact: true }).getByRole('link', { name: 'Settings', exact: true }).click();
  await page.waitForURL(url => url.pathname === '/settings/');
  assert.equal(await cycleSetting(page.getByRole('form', { name: 'Site settings' }), 'Font').isEnabled(), true);
});

test('breadcrumb settings control visibility and sticky clearance on deeply linked pages', async (t) => {
  const page = await pageFor(t, base + '/settings/');
  const id = 'level-3--slices-and-state-snapshots';
  let stickyClearance;
  for (const mode of ['sticky', 'static', 'hidden']) {
    if (mode !== 'sticky') await page.goto(base + '/settings/', { waitUntil: 'networkidle' });
    await chooseSetting(page.getByRole('form', { name: 'Site settings' }), 'Breadcrumbs', mode);
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
  await chooseSetting(settings, 'Font', 'jost');
  await chooseSetting(settings, 'Breadcrumbs', 'hidden');
  await chooseSetting(settings, 'Article text size', 'large');
  await settings.getByLabel('Keep parent sections visible').uncheck();
  await settings.getByRole('slider', { name: 'Left navigation width' }).focus();
  await page.keyboard.press('End');
  await page.goto(base + route, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('.site-sticky-section').first().evaluate(element => getComputedStyle(element).position), 'relative');
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
  assert.equal(await cycleSetting(settings, 'Font').getAttribute('value'), 'system');
  assert.equal(await cycleSetting(settings, 'Breadcrumbs').getAttribute('value'), 'sticky');
  assert.equal(await cycleSetting(settings, 'Article text size').getAttribute('value'), 'standard');
  assert.equal(await settings.getByLabel('Keep parent sections visible').isChecked(), true);
  assert.equal(await settings.getByRole('slider', { name: 'Left navigation width' }).inputValue(), String(desktopPaneDefaults().sidebar));
  assert.equal(await settings.getByRole('status', { name: 'Settings status' }).textContent(), 'Site defaults restored.');
  const cookies = await page.context().cookies();
  assert.ok(cookies.some(cookie => cookie.name === 'unrelated'));
  assert.ok(cookies.every(cookie => !['font-preference', 'navigation-widths', 'display-preferences'].includes(cookie.name)));
  await page.goto(base + route, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('data-breadcrumbs'), 'sticky');
  assert.equal(await page.locator('.site-sticky-section').first().evaluate(element => getComputedStyle(element).position), 'sticky');
  assert.deepEqual(await paneWidths(page), desktopPaneDefaults());
});

test('settings remain usable when cookies are blocked and explain unsaved changes', async (t) => {
  const page = await pageFor(t, base + '/settings/');
  await page.context().addInitScript(() => Object.defineProperty(document, 'cookie', {
    get() { throw new DOMException('Cookies blocked', 'SecurityError'); },
    set() { throw new DOMException('Cookies blocked', 'SecurityError'); },
  }));
  await page.reload({ waitUntil: 'networkidle' });
  const settings = page.getByRole('form', { name: 'Site settings' });
  await chooseSetting(settings, 'Breadcrumbs', 'hidden');
  assert.equal(await page.locator('html').getAttribute('data-breadcrumbs'), 'hidden');
  assert.match(await settings.getByRole('status', { name: 'Settings status' }).textContent(), /could not save/);
  await chooseSetting(settings, 'Font', 'jost');
  assert.equal(await page.locator('html').getAttribute('data-font-preference'), 'jost');
  assert.match(await settings.getByRole('status', { name: 'Settings status' }).textContent(), /could not save/);
  await chooseSetting(settings, 'Article text size', 'large');
  assert.equal(await page.locator('html').getAttribute('data-breadcrumbs'), 'hidden');
});

test('saved pane widths and breadcrumb geometry are stable before the navigation bundle loads', async (t) => {
  for (const width of [1440, 1280, 820, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    t.after(() => page.close());
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    t.after(() => assert.deepEqual(errors, [], 'No navigation JavaScript errors'));
    await page.route(/googletagmanager\.com|google-analytics\.com|posthog\.com|clarity\.ms/, request => request.abort());
    await page.context().addCookies([{ name: 'navigation-widths', value: encodeURIComponent('{"sidebar":448,"outline":448}'), url: base }]);
    let release;
    const deferred = new Promise(resolve => { release = resolve; });
    t.after(() => release());
    await page.route(/\/js\/custom[^/]*\.js(?:\?|$)/, async request => {
      await deferred;
      await request.continue();
    });
    await page.goto(base + route, { waitUntil: 'commit' });
    await page.locator('.article-content h1').waitFor({ state: 'visible' });
    const geometry = () => page.evaluate(() => {
      const rect = selector => {
        const { x, y, width, height } = document.querySelector(selector).getBoundingClientRect();
        return { x, y, width, height };
      };
      return {
        breadcrumb: rect('.breadcrumb'), heading: rect('.article-content h1'),
        sidebar: rect('[data-site-pane="sidebar"]'), outline: rect('[data-site-pane="outline"]'),
        treeHeight: rect('.sidebar-tree').height,
        overflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    const before = await geometry();
    assert.equal(before.overflow, false, `${width}px: initial layout fits the window`);
    release();
    await page.waitForLoadState('networkidle');
    const after = await geometry();
    assert.deepEqual(after, before, `${width}px: initializing navigation cannot move the article or resize its context`);
    await screenshot(page, `stable-initial-layout-${width}`);
  }
});

test('layout settings persist width, density and outline choices independently of reading size', async (t) => {
  const page = await pageFor(t, base + '/settings/', 1920);
  const form = page.getByRole('form', { name: 'Site settings' });
  const shellWidth = () => page.locator('.site-header').evaluate(el => el.getBoundingClientRect().width);
  assert.equal(await shellWidth(), 1440);
  await chooseSetting(form, 'Site width', 'standard');
  assert.equal(await shellWidth(), 1280);
  await chooseSetting(form, 'Interface density', 'compact');
  await chooseSetting(form, 'Page outline', 'prefer');
  await chooseSetting(form, 'Article text size', 'larger');
  await page.setViewportSize({ width: 700, height: 900 });
  await page.goto(base + route, { waitUntil: 'networkidle' });
  assert.ok(await page.locator('#page-outline').isVisible(), 'Prefer visible keeps the outline beside the article at smaller widths');
  assert.equal(await page.locator('.site-outline-trigger').isVisible(), false);
  assert.equal(await page.locator('html').getAttribute('data-density'), 'compact');
  const fontSize = () => page.locator('.article-content > p:not(.page-description)').first().evaluate(el => getComputedStyle(el).fontSize);
  assert.equal(await fontSize(), '20px', 'Compacting does not reduce the chosen reading size');
  await page.getByRole('navigation', { name: 'Footer', exact: true }).getByRole('link', { name: 'Settings', exact: true }).click();
  const dialog = page.getByRole('dialog', { name: 'Site settings', exact: true });
  await chooseSetting(dialog, 'Page outline', 'hidden');
  assert.equal(await page.locator('#page-outline').isVisible(), false);
  assert.equal(await page.locator('.site-outline-trigger').isVisible(), false);
  await chooseSetting(dialog, 'Interface density', 'comfortable');
  assert.equal(await fontSize(), '20px');
  await page.keyboard.press('Escape');
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('html').getAttribute('data-outline'), 'hidden');
  assert.equal(await page.locator('html').getAttribute('data-site-width'), 'standard');
  assert.equal(await page.locator('html').getAttribute('data-density'), 'comfortable');
  await page.goto(base + '/settings/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Reset to site defaults' }).click();
  assert.equal(await page.locator('html').getAttribute('data-site-width'), 'wide');
  assert.equal(await page.locator('html').getAttribute('data-density'), 'auto');
  assert.equal(await page.locator('html').getAttribute('data-outline'), 'auto');
});

test('responsive layouts keep outline access at zoom-equivalent widths and preserve enlarged text', async (t) => {
  const page = await pageFor(t);
  await page.context().addCookies([{ name: 'display-preferences', value: encodeURIComponent('{"textSize":"larger"}'), url: base }]);
  await page.reload({ waitUntil: 'networkidle' });
  for (const zoom of [0.75, 1, 1.25, 1.5, 1.75, 2, 4]) {
    const width = Math.round(1440 / zoom);
    await page.setViewportSize({ width, height: Math.round(900 / zoom) });
    assert.equal(await page.locator('.article-content > p:not(.page-description)').first().evaluate(el => getComputedStyle(el).fontSize), '20px');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${zoom * 100}% equivalent: no page-level horizontal scrolling`);
    const inline = await page.locator('#page-outline').isVisible();
    const context = await page.locator('.site-breadcrumb-sticky').boundingBox();
    assert.ok(context.y + context.height < Math.round(900 / zoom) - 40, 'Sticky context leaves space to read at high zoom');
    assert.equal(inline, width >= 768);
    assert.equal(await page.locator('.site-outline-trigger').isVisible(), !inline);
    if (!inline) {
      await page.locator('.site-outline-trigger').click();
      const panel = page.locator('#site-outline-popover');
      const bounds = await panel.boundingBox();
      assert.ok(bounds.x >= 0 && bounds.y >= 0 && bounds.x + bounds.width <= width + 1 && bounds.y + bounds.height <= Math.round(900 / zoom) + 1);
      await page.keyboard.press('Escape');
      await panel.waitFor({ state: 'hidden' });
    }
    await screenshot(page, `zoom-equivalent-${Math.round(zoom * 100)}`);
  }
});

test('navigation drawers preserve focus and reading position and return to inline layout on resize', async (t) => {
  const page = await pageFor(t, base + route, 960);
  await page.evaluate(() => window.scrollTo(0, 1000));
  const before = await page.evaluate(() => scrollY);
  const trigger = page.locator('.hextra-hamburger-menu');
  await trigger.click();
  const dialog = page.getByRole('dialog', { name: 'Navigation', exact: true });
  assert.ok(await dialog.isVisible());
  // macOS WebKit uses Option+Tab to include links in keyboard traversal.
  await page.keyboard.press(process.platform === 'darwin' && process.env.BROWSER_ENGINE === 'webkit' ? 'Alt+Tab' : 'Tab');
  assert.ok(await dialog.evaluate(el => el.contains(document.activeElement)), 'Keyboard focus stays inside the modal drawer');
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  assert.equal(await trigger.evaluate(el => el === document.activeElement), true);
  assert.equal(await page.evaluate(() => scrollY), before);
  await trigger.click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await dialog.waitFor({ state: 'hidden' });
  assert.equal(await page.locator('#site-navigation').count(), 1);
  assert.ok(await page.locator('.site-page-layout > #site-navigation').isVisible());
  assert.equal(await page.locator('#site-navigation').getAttribute('aria-hidden'), null);
  assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
});

test('the compact outline opens and navigates without JavaScript', async (t) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  t.after(() => context.close());
  const page = await context.newPage();
  await page.goto(base + route);
  await page.getByRole('button', { name: 'On this page', exact: true }).click();
  const panel = page.locator('#site-outline-popover');
  assert.ok(await panel.isVisible());
  await panel.locator('a[href="#level-3--slices-and-state-snapshots"]').click();
  assert.equal(new URL(page.url()).hash, '#level-3--slices-and-state-snapshots');
});

test('header preferences and search share the fitted outline width and growth limit', async (t) => {
  const page = await pageFor(t);
  const gap = JSON.parse(readFileSync(new URL('../../data/ui/style.json', import.meta.url), 'utf8')).layoutGapPixels;
  const headerLimit = 2 * (desktopPaneDefaults().outline - 2 * gap);
  const right = page.getByRole('separator', { name: 'Page outline width' });
  const left = page.getByRole('separator', { name: 'Site navigation width' });
  const sectionStart = await page.locator('.site-header-links > a').first().evaluate(element => element.getBoundingClientRect().left);

  async function expectAlignment(maxWidth = headerLimit) {
    await page.waitForFunction(maxWidth => {
      const search = document.querySelector('.hextra-search-trigger').getBoundingClientRect();
      const heading = document.querySelector('.site-toc-title').getBoundingClientRect();
      const preferences = document.querySelector('.site-header-preferences').getBoundingClientRect();
      const sections = document.querySelector('.site-header-links').getBoundingClientRect();
      const breadcrumb = document.querySelector('.breadcrumb').getBoundingClientRect();
      return Math.abs(search.right - preferences.left - Math.min(heading.width, maxWidth)) < 1 &&
        Math.abs(search.right - heading.right) < 1 && Math.abs(sections.right - breadcrumb.right) < 1;
    }, maxWidth);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  }

  await expectAlignment();
  const buttons = page.locator('.site-header-preferences .site-header-icon-button');
  assert.equal(await buttons.count(), 2);
  for (const button of await buttons.all()) {
    const box = await button.boundingBox();
    assert.equal(box.width, box.height, 'Preference controls are square');
    assert.equal((await button.innerText()).trim(), '', 'Preference controls show only icons');
    assert.ok(await button.getAttribute('aria-label'), 'Icon buttons retain accessible names');
  }
  await right.press('Home');
  await expectAlignment();
  const minimumWidth = (await paneWidths(page)).outline;
  assert.equal(await right.getAttribute('aria-valuemin'), String(minimumWidth));
  assert.equal(await page.locator('.hextra-search-trigger').evaluate(element => element.getBoundingClientRect().width), 48, 'At the minimum, search is as wide as each preference button');
  await dragPane(page, right, 160);
  assert.equal((await paneWidths(page)).outline, minimumWidth, 'Dragging cannot shrink the outline below the three controls');
  await page.locator('.site-header-preferences .site-settings-link').click();
  const settings = page.getByRole('dialog', { name: 'Site settings', exact: true });
  assert.equal(await settings.getByRole('slider', { name: 'Page outline width' }).getAttribute('min'), String(minimumWidth), 'Settings uses the same outline minimum');
  assert.equal(await settings.getByRole('slider', { name: 'Left navigation width' }).getAttribute('min'), '192', 'The left navigation retains its own minimum');
  await page.keyboard.press('Escape');
  await page.context().addCookies([{ name: 'navigation-widths', value: encodeURIComponent('{"outline":1}'), url: base }]);
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal((await paneWidths(page)).outline, minimumWidth, 'Restored widths cannot bypass the minimum');
  await expectAlignment();
  await dragPane(page, right, -48);
  await expectAlignment();
  assert.equal(await page.locator('.hextra-search-trigger').evaluate(element => element.getBoundingClientRect().width), 96);
  await right.press('End');
  await expectAlignment();
  const outlineSurfaceWidth = (await page.locator('.site-toc-title').boundingBox()).width;
  assert.equal(await page.locator('.hextra-search-trigger').evaluate(element => element.getBoundingClientRect().width), Math.min(outlineSurfaceWidth, headerLimit) - 96 - 2 * gap);
  assert.equal(await page.locator('.site-header-links > a').first().evaluate(element => element.getBoundingClientRect().left), sectionStart);

  await left.press('End');
  await page.setViewportSize({ width: 1280, height: 900 });
  await expectAlignment();
  await page.reload({ waitUntil: 'networkidle' });
  await expectAlignment();
  for (const width of [1152, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expectAlignment(2 * (desktopPaneDefaults(width).outline - 2 * gap));
  }

  const searchBefore = await page.locator('.hextra-search-trigger').boundingBox();
  await page.getByRole('button', { name: 'Hide page outline' }).click();
  await settleLayout(page);
  assert.deepEqual(await page.locator('.hextra-search-trigger').boundingBox(), searchBefore, 'Collapsing the outline preserves search width and alignment');
  await page.getByRole('button', { name: 'Show page outline' }).click();
  await expectAlignment();
  await right.press('Enter');
  await expectAlignment();
  await screenshot(page, 'search-outline-alignment');
});

test('the outline expands 60% farther while respecting reading space and saved widths', async (t) => {
  for (const width of [1440, 1024]) {
    const page = await pageFor(t, base + route, width);
    const right = page.getByRole('separator', { name: 'Page outline width' });
    const previousCap = await page.locator('[data-site-pane="sidebar"]').evaluate(element => parseFloat(getComputedStyle(element).maxWidth));
    const expandedCap = await page.locator('#page-outline').evaluate(element => parseFloat(getComputedStyle(element).maxWidth));
    assert.ok(Math.abs(expandedCap - previousCap * 1.6) < 1, 'The outline cap is 60% larger than the original pane cap');
    await dragPane(page, right, -1000);
    const expanded = (await paneWidths(page)).outline;
    assert.ok(expanded >= previousCap * 1.5, `${width}px: dragging left reaches at least 50% beyond the previous limit`);
    assert.equal(await right.getAttribute('aria-valuemax'), String(expanded));
    assert.ok(await page.locator('.site-article-column').evaluate(element => element.getBoundingClientRect().width >= parseFloat(getComputedStyle(element).minWidth) - 1), 'The article retains its minimum reading width');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if (width === 1440) {
      await page.getByRole('button', { name: 'Hide left navigation', exact: true }).click();
      await settleLayout(page);
      await right.press('End');
      const maximum = (await paneWidths(page)).outline;
      assert.equal(maximum, Math.floor(expandedCap), 'The full expanded range is available when the layout has room');
      await page.locator('.site-header-preferences .site-settings-link').click();
      const dialog = page.getByRole('dialog', { name: 'Site settings', exact: true });
      assert.ok(Math.abs(Number(await dialog.getByRole('slider', { name: 'Page outline width' }).getAttribute('max')) - expandedCap) < 1, 'Settings exposes the same expanded cap');
      await page.keyboard.press('Escape');
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal((await paneWidths(page)).outline, maximum);
      assert.equal((await savedPaneWidths(page)).outline, maximum);
    }
    await screenshot(page, `expanded-outline-${width}`);
  }
});

test('default columns follow the configured proportions across screen and zoom-equivalent widths', async (t) => {
  const { layout } = JSON.parse(readFileSync(new URL('../../data/ui/style.json', import.meta.url), 'utf8'));
  const page = await pageFor(t, base + '/ai/operating-model/solution-utility-ladder/', 2048);
  for (const siteWidth of ['wide', 'standard']) {
    await page.evaluate(value => {
      document.documentElement.dataset.siteWidth = value;
      document.dispatchEvent(new Event('site:display-change'));
    }, siteWidth);
    for (const width of [2048, 1536, 1440, 1280, 1152, 1024, 960, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      await settleLayout(page);
      const columns = await page.evaluate(() => {
        const pane = selector => {
          const element = document.querySelector(selector);
          const style = getComputedStyle(element);
          return { width: element.getBoundingClientRect().width, min: parseFloat(style.minWidth), max: parseFloat(style.maxWidth) };
        };
        return {
          frame: document.querySelector('.site-page-layout').getBoundingClientRect().width,
          sidebar: pane('[data-site-pane="sidebar"]'),
          outline: pane('#page-outline'),
          article: document.querySelector('.site-article-column').getBoundingClientRect().width,
          overflow: document.documentElement.scrollWidth > innerWidth,
        };
      });
      assert.equal(columns.overflow, false, `${width}px/${siteWidth}: columns fit`);
      for (const [name, percent] of [['sidebar', layout.sidebarWidthPercent], ['outline', layout.outlineWidthPercent]]) {
        const pane = columns[name];
        if (!pane.width) continue;
        const expected = Math.max(pane.min, Math.min(pane.max, columns.frame * percent / 100));
        assert.ok(Math.abs(pane.width - expected) < 1, `${name} follows its configured share at ${width}px/${siteWidth}`);
      }
      assert.ok(Math.abs(columns.article + columns.sidebar.width + columns.outline.width - columns.frame) < 1, 'The article receives the remaining space');
      if (width >= 768) assert.ok(columns.article >= 480, 'The reading column retains its usable minimum');
    }
  }
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  t.after(() => context.close());
  const staticPage = await context.newPage();
  await staticPage.goto(base + route);
  assert.deepEqual(await paneWidths(staticPage), desktopPaneDefaults(), 'Proportions are applied before JavaScript runs');
});

test('both navigation panes resize independently and keep their widths across pages and reloads', async (t) => {
  const page = await pageFor(t);
  const defaults = desktopPaneDefaults();
  const resized = { sidebar: defaults.sidebar + 80, outline: defaults.outline + 72 };
  const left = page.getByRole('separator', { name: 'Site navigation width' });
  const right = page.getByRole('separator', { name: 'Page outline width' });
  assert.deepEqual(await paneWidths(page), defaults);
  await dragPane(page, left, 80);
  assert.deepEqual(await paneWidths(page), { sidebar: resized.sidebar, outline: defaults.outline });
  await dragPane(page, right, -72);
  assert.deepEqual(await paneWidths(page), resized);
  assert.equal(await right.getAttribute('aria-valuenow'), String(resized.outline));
  assert.deepEqual(await savedPaneWidths(page), resized);
  const cookie = await paneCookie(page);
  assert.equal(cookie.path, '/');
  assert.equal(cookie.sameSite, 'Lax');
  assert.equal(cookie.secure, new URL(base).protocol === 'https:');
  assert.ok(cookie.expires > Date.now() / 1000 + 86400);
  assert.equal(await page.evaluate(() => localStorage.getItem('site-navigation-widths')), null);
  await page.goto(base + framework, { waitUntil: 'networkidle' });
  assert.deepEqual(await paneWidths(page), resized);
  await page.reload({ waitUntil: 'networkidle' });
  assert.deepEqual(await paneWidths(page), resized);
  await page.evaluate(() => localStorage.setItem('site-navigation-widths', JSON.stringify({ sidebar: 448, outline: 448 })));
  await page.reload({ waitUntil: 'networkidle' });
  assert.deepEqual(await paneWidths(page), resized);
  await screenshot(page, 'resized-panes');
  await right.dblclick();
  assert.deepEqual(await paneWidths(page), { sidebar: resized.sidebar, outline: defaults.outline });
  await left.focus();
  await page.keyboard.press('Enter');
  assert.deepEqual(await paneWidths(page), defaults);
  assert.equal(await paneCookie(page), undefined);
  assert.equal(await page.evaluate(() => localStorage.getItem('site-navigation-widths')), null);
  await page.reload({ waitUntil: 'networkidle' });
  assert.deepEqual(await paneWidths(page), defaults);
  await page.setViewportSize({ width: 1280, height: 900 });
  await settleLayout(page);
  assert.deepEqual(await paneWidths(page), desktopPaneDefaults(1280), 'Reset returns both panes to automatic proportions');
});

test('the left navigation collapses to an aligned rail and restores its width and focus', async (t) => {
  for (const width of [1440, 1152]) {
    const page = await pageFor(t, base + route, width);
    const sidebar = page.locator('[data-site-pane="sidebar"]');
    await dragPane(page, page.getByRole('separator', { name: 'Site navigation width' }), 64);
    const widths = await savedPaneWidths(page);
    const mainWidth = (await page.locator('.site-article-column').boundingBox()).width;
    const headerPositions = () => page.locator('.site-header').evaluate(header => [
      header, header.querySelector('.site-header-brand'),
      header.querySelector('.site-header-links'), header.querySelector('.hextra-search-trigger'),
    ].map(element => {
      const { x, y, width, height } = element.getBoundingClientRect();
      return { x, y, width, height };
    }));
    const header = await headerPositions();
    const hide = page.getByRole('button', { name: 'Hide left navigation', exact: true });
    assert.equal(await page.locator('.sidebar-root > [data-sidebar-toggle]').count(), 1);
    assert.equal(await page.locator('.site-article-column [data-sidebar-toggle]').count(), 0);
    await hide.focus();
    await page.keyboard.press('Enter');
    assert.equal(await sidebar.isVisible(), false);
    const show = page.getByRole('button', { name: 'Show left navigation', exact: true });
    assert.ok(await show.isVisible());
    assert.equal(await page.locator('.site-sidebar-rail [data-sidebar-toggle]').count(), 1);
    assert.equal(await page.locator('.site-header-tools [data-sidebar-toggle]').count(), 0);
    assert.equal(await show.evaluate(element => element === document.activeElement), true);
    const rail = await page.locator('.site-sidebar-rail').boundingBox();
    const button = await show.boundingBox();
    const breadcrumb = await page.locator('.breadcrumb').boundingBox();
    const inset = await page.locator('.site-sidebar-rail').evaluate(element => parseFloat(getComputedStyle(element).paddingInlineStart));
    assert.equal(rail.width, button.width + 2 * inset, 'The collapsed rail reserves one control and equal outer spacing');
    assert.ok(button.x >= rail.x && button.x + button.width <= rail.x + rail.width);
    assert.ok(Math.abs(button.y - breadcrumb.y) < 1 && Math.abs(button.height - breadcrumb.height) < 1, 'The reopen button shares the breadcrumb row');
    assert.equal(await show.getAttribute('aria-expanded'), 'false');
    assert.ok((await page.locator('.site-article-column').boundingBox()).width > mainWidth);
    assert.deepEqual(await savedPaneWidths(page), widths);
    assert.equal((await displayCookie(page)).sidebarVisible, false);
    assert.deepEqual(await headerPositions(), header, 'Brand, section navigation and search stay anchored when the pane collapses');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await sidebar.isVisible(), false);
    await page.goto(base + '/ai/', { waitUntil: 'networkidle' });
    assert.equal(await sidebar.isVisible(), false);
    await page.getByRole('button', { name: 'Show left navigation', exact: true }).click();
    await sidebar.waitFor({ state: 'visible' });
    assert.equal(await page.locator('.site-sidebar-rail').isVisible(), false);
    assert.equal(await page.locator('.sidebar-root > [data-sidebar-toggle]').count(), 1);
    await page.waitForFunction(width => Math.round(document.querySelector('[data-site-pane="sidebar"]').getBoundingClientRect().width) === width, widths.sidebar);
    assert.deepEqual(await savedPaneWidths(page), widths);
    assert.ok(await page.getByRole('button', { name: 'Hide left navigation', exact: true }).isVisible());
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await screenshot(page, `sidebar-restored-${width}`);
  }
});

test('the page outline collapses without moving the content edges and restores independently of the left menu', async (t) => {
  for (const width of [1440, 1024, 768]) {
    const page = await pageFor(t, base + route, width);
    const outline = page.locator('#page-outline');
    await dragPane(page, page.getByRole('separator', { name: 'Page outline width' }), -32);
    const widths = await savedPaneWidths(page);
    const hide = page.getByRole('button', { name: 'Hide page outline', exact: true });
    const outlineBounds = await outline.boundingBox();
    const buttonBounds = await hide.boundingBox();
    const contentEdges = () => page.locator('.site-article-column, .breadcrumb').evaluateAll(elements => elements.map(element => {
      const bounds = element.getBoundingClientRect();
      return { left: bounds.left, right: bounds.right };
    }));
    const expandedEdges = await contentEdges();
    assert.equal(await page.locator('.site-toc-title > [data-outline-toggle]').count(), 1);
    await hide.focus();
    await page.keyboard.press('Enter');
    assert.equal(await outline.isVisible(), false);
    const show = page.getByRole('button', { name: 'Show page outline', exact: true });
    assert.equal(await show.evaluate(element => element === document.activeElement), true);
    await page.waitForFunction(() => {
      const button = document.querySelector('[data-outline-toggle]').getBoundingClientRect();
      const breadcrumb = document.querySelector('.breadcrumb').getBoundingClientRect();
      return Math.abs(button.top - breadcrumb.top) < 1 && Math.abs(button.height - breadcrumb.height) < 1;
    });
    const rail = await page.locator('.site-outline-rail').boundingBox();
    const breadcrumb = await page.locator('.breadcrumb').boundingBox();
    assert.equal(rail.width, outlineBounds.width, 'Collapsing preserves the outline column width');
    assert.deepEqual(await contentEdges(), expandedEdges, 'Article and breadcrumb edges stay fixed');
    const showBounds = await show.boundingBox();
    assert.ok(Math.abs(showBounds.x + showBounds.width / 2 - buttonBounds.x - buttonBounds.width / 2) < 1, 'The reopen icon stays in the same horizontal position');
    assert.ok(showBounds.x > breadcrumb.x + breadcrumb.width, 'The outline reopens from the right side of the breadcrumb row');
    assert.equal((await displayCookie(page)).outlineVisible, false);
    assert.deepEqual(await savedPaneWidths(page), widths);
    if (width === 1440) {
      await page.getByRole('button', { name: 'Hide left navigation', exact: true }).click();
      assert.equal(await page.locator('.site-sidebar-rail').isVisible(), true);
    }
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('.site-outline-rail [data-outline-toggle]').isVisible(), true);
    const collapsedEdges = await contentEdges();
    await show.click();
    assert.equal(await outline.isVisible(), true);
    assert.equal(await page.locator('.site-outline-rail').isVisible(), false);
    assert.equal(await hide.evaluate(element => element === document.activeElement), true);
    assert.deepEqual(await savedPaneWidths(page), widths);
    assert.deepEqual(await contentEdges(), collapsedEdges, 'Reopening also preserves the content edges');
    if (width === 1440) assert.equal(await page.locator('.site-sidebar-rail').isVisible(), true);
    await screenshot(page, `outline-restored-${width}`);
  }
});

test('the collapsed document map shows main sections and expands the current heading branch', async (t) => {
  const page = await pageFor(t);
  const map = page.getByRole('navigation', { name: 'Document map', exact: true });
  assert.equal(await map.isVisible(), false);
  await page.getByRole('button', { name: 'Hide page outline', exact: true }).click();
  assert.equal(await map.isVisible(), true);
  const mainSections = await page.locator('.article-content h2[id]').evaluateAll(headings => headings.map(heading => heading.id));
  assert.ok(mainSections.length > 10, 'The document has many main sections');
  for (const id of mainSections) assert.equal(await map.locator(`a[href="#${id}"]`).isVisible(), true);
  const firstChild = map.locator('a[href="#21-why-standard-observability-is-insufficient"]');
  const otherChild = map.locator('a[href="#31-goals"]');
  assert.equal(await firstChild.isVisible(), false, 'Inactive sections keep their children folded');
  await readAt(page, '21-why-standard-observability-is-insufficient');
  assert.equal(await firstChild.getAttribute('aria-current'), 'location');
  assert.equal(await firstChild.isVisible(), true);
  assert.equal(await otherChild.isVisible(), false);
  const parent = map.locator('a[href="#2-motivation-and-problem-statement"]');
  assert.ok((await parent.getAttribute('class')).includes('site-map-ancestor'));
  const markerWidth = link => link.evaluate(element => parseFloat(getComputedStyle(element, '::before').width));
  assert.ok(await markerWidth(firstChild) < await markerWidth(parent), 'Subsection marks are shorter and indented');
  await readAt(page, '31-goals');
  assert.equal(await firstChild.isVisible(), false);
  assert.equal(await otherChild.getAttribute('aria-current'), 'location');
  assert.equal(await map.locator('[aria-current="location"]').count(), 1);
  await screenshot(page, 'outline-document-map');
});

test('document map previews work with a pointer and keyboard and markers follow native heading links', async (t) => {
  for (const [width, height] of [[1440, 900], [768, 320]]) {
    const page = await pageFor(t, base + route, width);
    await page.setViewportSize({ width, height });
    await page.getByRole('button', { name: 'Hide page outline', exact: true }).click();
    const map = page.getByRole('navigation', { name: 'Document map', exact: true });
    const section = map.getByRole('link', { name: '2. Motivation and problem statement', exact: true });
    const preview = page.getByRole('tooltip');
    await section.hover();
    await preview.waitFor({ state: 'visible' });
    assert.ok((await preview.textContent()).includes('2. Motivation and problem statement'));
    await page.keyboard.press('Escape');
    assert.equal(await preview.isVisible(), false, 'Escape also dismisses pointer previews while focus is outside the map');
    await page.mouse.move(0, 200);
    await section.hover();
    await preview.waitFor({ state: 'visible' });
    await preview.hover();
    assert.equal(await preview.isVisible(), true, 'The preview remains available when the pointer moves onto it');
    await section.click();
    await page.waitForURL(url => url.hash === '#2-motivation-and-problem-statement');
    await page.waitForFunction(() => document.querySelector('[data-outline-map] [aria-current="location"]')?.hash === '#2-motivation-and-problem-statement');
    await section.focus();
    await page.keyboard.press('ArrowDown');
    const child = map.getByRole('link', { name: '2.1 Why “standard observability” is insufficient', exact: true });
    assert.equal(await child.evaluate(element => element === document.activeElement), true);
    await preview.waitFor({ state: 'visible' });
    assert.ok((await preview.textContent()).includes('2.1 Why “standard observability” is insufficient'));
    const bounds = await preview.boundingBox();
    assert.ok(bounds.x >= 0 && bounds.y >= 56 && bounds.x + bounds.width <= width && bounds.y + bounds.height <= height, 'The full heading preview fits the viewport');
    await screenshot(page, `outline-map-preview-${width}`);
    await page.keyboard.press('Escape');
    assert.equal(await preview.isVisible(), false);
    assert.equal(await child.evaluate(element => element === document.activeElement), true, 'Dismissing a preview preserves keyboard focus');
    await page.keyboard.press('Enter');
    await page.waitForURL(url => url.hash === '#21-why-standard-observability-is-insufficient');
    await page.waitForFunction(() => document.querySelector('[data-outline-map] [aria-current="location"]')?.hash === '#21-why-standard-observability-is-insufficient');
    const placement = await page.locator('[id="21-why-standard-observability-is-insufficient"]').evaluate(heading => ({ top: heading.getBoundingClientRect().top, margin: parseFloat(getComputedStyle(heading).scrollMarginTop) }));
    assert.ok(Math.abs(placement.top - placement.margin) < 3, 'Heading links respect the fixed reading context');
  }
});

test('the document map starts with heading marks and remains reachable at the document end', async (t) => {
  const page = await pageFor(t);
  await page.getByRole('button', { name: 'Hide page outline', exact: true }).click();
  const map = page.getByRole('navigation', { name: 'Document map', exact: true });
  assert.equal(await map.getByRole('button').count(), 0, 'Section arrow buttons are absent');
  const bounds = await map.boundingBox();
  const firstMark = await map.getByRole('link').first().boundingBox();
  assert.ok(Math.abs(firstMark.y - bounds.y) < 1, 'Heading marks start at the top of the map');
  await map.getByRole('link', { name: 'Appendix B: What to read next', exact: true }).click();
  await page.waitForFunction(() => document.querySelector('[data-outline-map] [aria-current="location"]')?.hash === '#appendix-b-what-to-read-next');
  await settleLayout(page);
  const restore = await page.getByRole('button', { name: 'Show page outline', exact: true }).boundingBox();
  assert.ok(restore.y >= 56 && restore.y + restore.height <= 900, 'The restore control stays reachable when the footer comes into view');
});

test('deep document map entries remain reachable in short windows and survive collapse restoration', async (t) => {
  const page = await pageFor(t, base + '/system-design/projects/ticketmaster/');
  await page.setViewportSize({ width: 1440, height: 320 });
  const id = await page.locator('.article-content h6[id]').first().getAttribute('id');
  await page.getByRole('button', { name: 'Hide page outline', exact: true }).click();
  await readAt(page, id);
  const map = page.getByRole('navigation', { name: 'Document map', exact: true });
  const active = map.locator('[aria-current="location"]');
  assert.equal(await active.isVisible(), true);
  assert.ok(await map.locator('.site-map-ancestor').count() >= 3, 'The active path retains deeply nested ancestors');
  const levels = await map.locator('a').evaluateAll(links => {
    const widths = new Map();
    for (const link of links) {
      const heading = document.getElementById(decodeURIComponent(link.hash.slice(1)));
      widths.set(Number(heading.tagName.slice(1)), parseFloat(getComputedStyle(link, '::before').width));
    }
    return [...widths].sort(([left], [right]) => left - right);
  });
  const authoredLevels = await page.locator('.article-content :is(h1, h2, h3, h4, h5, h6)[id]').evaluateAll(headings => [...new Set(headings.map(heading => Number(heading.tagName.slice(1))))].sort((left, right) => left - right));
  assert.deepEqual(levels.map(([level]) => level), authoredLevels, 'Marks preserve authored heading levels, including skipped levels');
  assert.ok(levels[0][1] <= 20, 'Even the largest mark stays compact');
  assert.ok(levels.every(([, width], index) => index === 0 || width < levels[index - 1][1]), 'Every deeper heading level has a distinct, shorter mark');
  const placement = await active.evaluate(link => {
    const bounds = link.getBoundingClientRect(), panel = link.closest('[data-map-scroll]').getBoundingClientRect();
    return { top: bounds.top, bottom: bounds.bottom, panelTop: panel.top, panelBottom: panel.bottom };
  });
  assert.ok(placement.top >= placement.panelTop && placement.bottom <= placement.panelBottom, 'The map scrolls only its own panel to reveal the current heading');
  const position = await page.evaluate(() => scrollY);
  await active.focus();
  await page.keyboard.press('End');
  assert.equal(await page.evaluate(() => scrollY), position, 'Keyboard browsing of the map leaves the document at its reading position');
  await page.keyboard.press('Home');
  assert.equal(await page.evaluate(() => scrollY), position);
  // Follow the active heading as a native link so the same deep link is restored.
  await map.locator(`a[href="#${id}"]`).click();
  await page.waitForURL(url => decodeURIComponent(url.hash.slice(1)) === id);
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await map.isVisible(), true);
  // Reading-position restoration belongs to the browser. In particular, WebKit
  // can reload at the page top, so the map must agree with the full outline.
  await page.waitForFunction(() => document.querySelector('[data-outline-map] [aria-current="location"]')?.hash === document.querySelector('#page-outline [aria-current="location"]')?.hash);
  await readAt(page, id);
  await page.getByRole('button', { name: 'Show page outline', exact: true }).click();
  assert.equal(await map.isVisible(), false);
  assert.equal(await page.locator('.hextra-toc [aria-current="location"]').getAttribute('href'), `#${id}`);
});

test('a collapsed outline keeps mobile access and explicit Hidden layout still removes its rail', async (t) => {
  const page = await pageFor(t);
  await page.getByRole('button', { name: 'Hide page outline', exact: true }).click();
  await page.setViewportSize({ width: 390, height: 900 });
  assert.equal(await page.locator('.site-outline-rail').isVisible(), false);
  await page.locator('.site-outline-trigger').click();
  assert.equal(await page.locator('#site-outline-popover').isVisible(), true);
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 1440, height: 900 });
  assert.equal(await page.locator('.site-outline-rail').isVisible(), true);
  await page.goto(base + '/settings/', { waitUntil: 'networkidle' });
  await chooseSetting(page, 'Page outline', 'hidden');
  await page.goto(base + route, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('#page-outline').isVisible(), false);
  assert.equal(await page.locator('.site-outline-rail').isVisible(), false);
  await page.goto(base + '/settings/', { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Reset to site defaults' }).click();
  await page.goto(base + route, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('#page-outline').isVisible(), true);
});

test('sidebar visibility stays synchronized with Settings and focus returns to the header', async (t) => {
  const page = await pageFor(t);
  await page.locator('.site-header-preferences .site-settings-link').click();
  const dialog = page.getByRole('dialog', { name: 'Site settings', exact: true });
  await dialog.getByLabel('Show left navigation', { exact: true }).uncheck();
  assert.equal(await page.locator('[data-site-pane="sidebar"]').isVisible(), false);
  await page.keyboard.press('Escape');
  await dialog.waitFor({ state: 'hidden' });
  const show = page.getByRole('button', { name: 'Show left navigation', exact: true });
  assert.equal(await page.locator('.site-header-preferences .site-settings-link').evaluate(element => element === document.activeElement), true);
  await screenshot(page, 'sidebar-hidden');
  await show.click();
  await page.locator('.site-header-preferences .site-settings-link').click();
  assert.equal(await dialog.getByLabel('Show left navigation', { exact: true }).isChecked(), true);
  await dialog.getByLabel('Show left navigation', { exact: true }).uncheck();
  await dialog.getByRole('button', { name: 'Reset to site defaults' }).click();
  assert.equal(await page.locator('[data-site-pane="sidebar"]').isVisible(), true);
  assert.equal(await dialog.getByLabel('Show left navigation', { exact: true }).isChecked(), true);
});

test('a saved hidden sidebar leaves the mobile drawer available and blocked cookies do not prevent toggling', async (t) => {
  const page = await pageFor(t, base + route, 390);
  await page.context().addCookies([{ name: 'display-preferences', value: encodeURIComponent(JSON.stringify({ sidebarVisible: false })), url: base }]);
  await page.reload({ waitUntil: 'networkidle' });
  assert.equal(await page.locator('[data-sidebar-toggle]').isVisible(), false);
  await page.locator('.hextra-hamburger-menu').click();
  assert.ok(await page.locator('.section-nav').isVisible());
  await page.getByRole('button', { name: 'Close navigation', exact: true }).click();
  await page.setViewportSize({ width: 1440, height: 900 });
  assert.equal(await page.locator('[data-site-pane="sidebar"]').isVisible(), false);
  await page.getByRole('button', { name: 'Show left navigation', exact: true }).click();
  assert.equal(await page.locator('[data-site-pane="sidebar"]').isVisible(), true);
  await page.context().addInitScript(() => Object.defineProperty(document, 'cookie', {
    get() { throw new DOMException('Cookies blocked', 'SecurityError'); },
    set() { throw new DOMException('Cookies blocked', 'SecurityError'); },
  }));
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'Hide left navigation', exact: true }).click();
  assert.equal(await page.locator('[data-site-pane="sidebar"]').isVisible(), false);
  await page.getByRole('button', { name: 'Show left navigation', exact: true }).click();
  assert.equal(await page.locator('[data-site-pane="sidebar"]').isVisible(), true);
  await page.getByRole('button', { name: 'Hide page outline', exact: true }).click();
  assert.equal(await page.locator('.site-outline-rail').isVisible(), true);
  await page.getByRole('button', { name: 'Show page outline', exact: true }).click();
  assert.equal(await page.locator('#page-outline').isVisible(), true);
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
  const defaults = desktopPaneDefaults();
  const left = page.getByRole('separator', { name: 'Site navigation width' });
  const right = page.getByRole('separator', { name: 'Page outline width' });
  await left.focus();
  await page.keyboard.press('ArrowRight');
  await right.focus();
  await page.keyboard.press('ArrowLeft');
  assert.deepEqual(await paneWidths(page), { sidebar: defaults.sidebar + 16, outline: defaults.outline + 16 });
  const minimum = Number(await right.getAttribute('aria-valuemin'));
  await page.keyboard.press('Home');
  assert.equal((await paneWidths(page)).outline, minimum);
  await left.press('Home');
  await right.focus();
  const maximum = Number(await right.getAttribute('aria-valuemax'));
  await page.keyboard.press('End');
  assert.equal((await paneWidths(page)).outline, maximum);
  await left.focus();
  await page.keyboard.press('Home');
  const box = await left.boundingBox();
  const y = box.y + box.height / 2;
  await page.mouse.move(box.x + box.width / 2, y);
  await page.mouse.down();
  await page.mouse.move(box.x + 80, y);
  await page.keyboard.press('Escape');
  await page.mouse.up();
  assert.deepEqual(await paneWidths(page), { sidebar: 192, outline: maximum });
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
  const preferred = await savedPaneWidths(page);
  await page.reload({ waitUntil: 'networkidle' });
  for (const width of [1280, 820, 768]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForFunction(() => document.documentElement.scrollWidth <= innerWidth && document.querySelector('.site-article-column').getBoundingClientRect().width >= 384);
    if (width < 1280) assert.equal(await page.getByRole('separator', { name: /width$/ }).count(), 1);
  }
  await page.setViewportSize({ width: 390, height: 900 });
  assert.equal(await page.getByRole('separator', { name: /width$/ }).count(), 0);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  assert.equal((await paneWidths(page)).sidebar, await page.locator('.hextra-nav-container').evaluate(element => Math.round(element.getBoundingClientRect().width)), 'The mobile drawer and header share the available width, excluding a reserved scrollbar gutter');
  await page.getByRole('button', { name: 'Close navigation', exact: true }).click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForFunction(widths => Object.entries(widths).every(([name, width]) => Math.round(document.querySelector(`[data-site-pane="${name}"]`).getBoundingClientRect().width) === width), preferred);
  assert.deepEqual(await savedPaneWidths(page), preferred);
});

test('pane resizing works with malformed cookies and retains legacy settings if cookies are blocked', async (t) => {
  const page = await pageFor(t);
  await page.context().addCookies([{ name: 'navigation-widths', value: encodeURIComponent('{broken'), url: base }]);
  await page.reload({ waitUntil: 'networkidle' });
  assert.deepEqual(await paneWidths(page), desktopPaneDefaults());
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
  const response = await page.goto(base + '/');
  assert.equal(response.status(), 200);
  await page.getByRole('navigation', { name: 'Footer', exact: true }).getByRole('link', { name: 'Settings', exact: true }).click();
  await page.waitForURL(url => url.pathname === '/settings/');
  const settings = page.getByRole('form', { name: 'Site settings' });
  assert.equal(await cycleSetting(settings, 'Font').isDisabled(), true);
  assert.equal(await page.getByText('Enable JavaScript to change your site settings.').isVisible(), true);
});

test('the sidebar distinguishes section links with fixed chevrons that navigate to their pages', async (t) => {
  for (const width of [1440, 390]) {
    const page = await pageFor(t, base + '/ai-engineering/', width);
    if (width === 390) await page.getByRole('button', { name: 'Menu', exact: true }).click();
    const navigation = page.locator('.section-nav');
    assert.equal(await navigation.locator('.sidebar-root > a').textContent(), 'AI Engineering');
    assert.equal(await navigation.locator('.sidebar-root + .sidebar-tree').count(), 1);
    assert.deepEqual(await navigation.locator('.site-sidebar-group-label').allTextContents(), ['Documents', 'Topics']);
    assert.equal(await navigation.getByRole('list', { name: 'Documents', exact: true }).getByRole('link', { name: 'Working Assumptions', exact: true }).count(), 1);
    assert.equal(await navigation.locator('.sidebar-overview').count(), 0);
    assert.equal(await navigation.locator('.site-sidebar-current-document').count(), 0);
    assert.equal(await navigation.locator('.site-sidebar-section-row button').count(), 0, 'Section rows remain direct links without disclosure buttons');
    await screenshot(page, `grouped-sidebar-${width}`);
    const evaluation = navigation.locator('.site-sidebar-section-row').filter({ has: page.locator('a[href="/ai-engineering/evaluation/"]') });
    const link = evaluation.getByRole('link', { name: 'Evaluation', exact: true });
    const marker = await link.evaluate(link => {
      const style = getComputedStyle(link, '::before');
      return { width: style.width, border: style.borderTopWidth, background: style.backgroundColor, clip: style.clipPath, transform: style.transform };
    });
    assert.equal(marker.width, '6px');
    assert.ok(parseFloat(marker.border) > 0, 'The section marker has a visible stroke');
    assert.equal(marker.background, 'rgba(0, 0, 0, 0)');
    assert.equal(marker.clip, 'none');
    assert.equal(await evaluation.locator(':scope + .list-nested').isVisible(), false);
    // Click the chevron itself: the whole row is one navigation link.
    await link.click({ position: { x: 11, y: 16 } });
    await page.waitForURL(url => url.pathname === '/ai-engineering/evaluation/');
    if (width === 390) await page.getByRole('button', { name: 'Menu', exact: true }).click();
    const sectionLink = page.locator('.section-nav a[aria-current="page"]');
    assert.equal(await sectionLink.getAttribute('href'), '/ai-engineering/evaluation/');
    assert.equal(await sectionLink.evaluate(link => getComputedStyle(link, '::before').transform), marker.transform, 'The chevron stays fixed on the current section');
    assert.equal(await sectionLink.locator('..').locator(':scope + .list-nested').isVisible(), true);
    assert.equal(await page.locator('.section-nav .site-sidebar-current-document').count(), 0);
    await navigation.locator('.sidebar-root > a').click();
    await page.waitForURL(url => url.pathname === '/ai-engineering/');
  }
});

test('section links retain reading guides and pinned parent links open their own overviews', async (t) => {
  const page = await pageFor(t, base + '/ai/design-research/');
  const navigation = page.locator('.section-nav');
  assert.equal(await navigation.getByRole('link', { name: 'Design Research', exact: true }).getAttribute('href'), '/ai/design-research/');
  const guide = navigation.getByRole('link', { name: '00 Index', exact: true });
  assert.equal(await guide.count(), 1);
  await guide.click();
  await page.waitForURL(url => url.pathname === '/ai/design-research/00-index/');
  assert.equal(await navigation.locator('a.site-sidebar-current-document').getAttribute('href'), '/ai/design-research/00-index/');
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.locator('.site-sidebar-scroll').evaluate(panel => { panel.scrollTop = panel.scrollHeight; });
  const parent = navigation.locator('.site-sidebar-section-row').filter({ has: page.locator('a[href="/ai/other/"]') });
  await page.waitForFunction(() => document.querySelector('.sidebar-group.depth-1.active-ancestor > .site-sidebar-section-row')?.classList.contains('site-pinned'));
  await screenshot(page, 'linked-parent-stack');
  await parent.getByRole('link', { name: 'Other', exact: true }).click();
  await page.waitForURL(url => url.pathname === '/ai/other/');
  assert.equal(await navigation.locator('.site-sidebar-current-document').count(), 0);
});

test('without JavaScript section links still navigate and reveal the current branch', async (t) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  t.after(() => context.close());
  const page = await context.newPage();
  assert.equal((await page.goto(base + '/ai-engineering/')).status(), 200);
  const navigation = page.locator('.section-nav');
  assert.equal(await navigation.getByRole('button').count(), 0);
  assert.ok(await navigation.locator('.list-nested[hidden]').count() > 0);
  await navigation.getByRole('link', { name: 'Evaluation', exact: true }).click();
  await page.waitForURL(url => url.pathname === '/ai-engineering/evaluation/');
  const section = navigation.locator('a[aria-current="page"]').locator('..');
  assert.equal(await section.locator(':scope + .list-nested').isVisible(), true);
  await navigation.getByRole('link', { name: 'Working Assumptions', exact: true }).click();
  await page.waitForURL(url => url.pathname === '/ai-engineering/working-assumptions/');
  assert.equal(await navigation.locator('a.site-sidebar-current-document').getAttribute('aria-current'), 'page');
});

test('clicking a sidebar link paints its final menu before deferred scripts load', async (t) => {
  for (const width of [1440, 1024]) {
    const page = await pageFor(t, base + '/ai/other/methodology-v1-3/usage/', width);
    let release;
    const gate = new Promise(resolve => { release = resolve; });
    await page.route(/\/js\/custom\.[^/]+\.js$/, async request => {
      await gate;
      await request.continue();
    });
    const menu = () => page.locator('.section-nav').evaluate(tree => {
      const panel = tree.closest('.site-sidebar-scroll');
      const bounds = panel.getBoundingClientRect();
      const current = tree.querySelector('a[aria-current="page"]').getBoundingClientRect();
      return {
        scroll: panel.scrollTop,
        width: bounds.width,
        currentTop: current.top,
        currentBottom: current.bottom,
        panelBottom: bounds.bottom,
        branches: [...tree.querySelectorAll('.sidebar-group.depth-1')].filter(group => !group.querySelector(':scope > .list-nested').hidden).map(group => group.querySelector(':scope > .site-sidebar-section-row > a').getAttribute('href')),
        pinned: [...tree.querySelectorAll('.site-pinned')].map(row => ({ label: row.textContent.trim(), top: row.getBoundingClientRect().top })),
      };
    });
    let initial;
    try {
      await page.locator(`.section-nav a[href="${route}"]`).click({ noWaitAfter: true });
      await page.waitForURL(url => url.pathname === route, { waitUntil: 'commit' });
      await page.waitForFunction(pathname => document.readyState === 'interactive' && document.querySelector('.section-nav a[aria-current="page"]')?.getAttribute('href') === pathname, route);
      await settleLayout(page);
      initial = await menu();
    } finally {
      release();
    }
    await page.waitForLoadState('networkidle');
    await settleLayout(page);
    const ready = await menu();
    assert.ok(initial.scroll > 0 && initial.currentBottom <= initial.panelBottom, 'The selected document is visible before the deferred controller runs');
    assert.deepEqual(ready, initial, 'Script initialization cannot scroll, collapse or restyle the painted menu');
    await screenshot(page, `sidebar-first-paint-${width}`);
  }
});

test('a deeply nested sidebar opens the full current path and marks its parent groups', async (t) => {
  const page = await pageFor(t);
  const current = page.locator('.section-nav a[aria-current="page"]');
  assert.equal(await current.count(), 1);
  assert.equal(new URL(await current.getAttribute('href'), base).pathname, route);
  const ancestors = await current.evaluate((link) => {
    const result = [];
    for (let group = link.closest('.sidebar-group'); group; group = group.parentElement.closest('.sidebar-group')) {
      const row = group.querySelector(':scope > .site-sidebar-section-row');
      result.push({ open: !group.querySelector(':scope > .list-nested').hidden, marked: group.classList.contains('active-ancestor'), label: row.querySelector('a').textContent });
    }
    return result;
  });
  assert.ok(ancestors.length >= 3);
  assert.ok(ancestors.every((group) => group.open && group.marked));
  assert.deepEqual(ancestors.map((group) => group.label), ['Usage', 'Methodology v1.3', 'Other']);
  const placement = await current.evaluate(link => {
    const bounds = link.getBoundingClientRect();
    const panel = link.closest('.site-sidebar-scroll').getBoundingClientRect();
    const clearance = parseFloat(getComputedStyle(link).scrollMarginBlockStart);
    return { top: bounds.top, bottom: bounds.bottom, minTop: panel.top + clearance, maxBottom: panel.bottom };
  });
  assert.ok(placement.top >= placement.minTop - 1 && placement.bottom <= placement.maxBottom, 'The current document remains visible below its pinned parent stack after initial expansion');
});

test('the sidebar fills the freed footer space and fades only when more links remain', async (t) => {
  for (const width of [1440, 390]) {
    const page = await pageFor(t, base + route, width);
    if (width === 390) await page.getByRole('button', { name: 'Menu', exact: true }).click();
    const panel = page.locator('.site-sidebar-scroll');
    const fade = page.locator('[data-sidebar-fade]');
    await settleLayout(page);
    if (width === 1440) {
      assert.ok(await panel.locator('a[aria-current="page"]').evaluate(link => {
        const fade = document.querySelector('[data-sidebar-fade]');
        return fade.hidden || link.getBoundingClientRect().bottom <= fade.getBoundingClientRect().top;
      }), 'The selected note is readable above the fade on first render');
    }
    const size = await panel.evaluate(element => ({ bottom: element.getBoundingClientRect().bottom, viewport: innerHeight }));
    assert.ok(Math.abs(size.bottom - size.viewport) < 1, 'The menu uses the old button area down to the viewport edge');
    for (const scheme of ['light', 'dark']) {
      await page.emulateMedia({ colorScheme: scheme });
      await page.waitForFunction(scheme => document.documentElement.classList.contains('dark') === (scheme === 'dark'), scheme);
      await panel.evaluate(element => { element.scrollTop = 0; });
      await fade.waitFor({ state: 'visible' });
      const presentation = await fade.evaluate(element => {
        const style = getComputedStyle(element);
        return { background: style.backgroundImage, article: getComputedStyle(document.querySelector('.site-reading-fade')).backgroundImage, pointerEvents: style.pointerEvents };
      });
      if (width === 1440) assert.equal(presentation.background, presentation.article, 'The sidebar shares the article’s reading fade');
      else assert.match(presentation.background, /linear-gradient/, 'The drawer retains its bottom fade');
      assert.equal(presentation.pointerEvents, 'none');
      await panel.evaluate(element => { element.scrollTop = element.scrollHeight; });
      await fade.waitFor({ state: 'hidden' });
      const last = panel.locator('.section-nav a:visible').last();
      assert.ok(await last.evaluate(link => {
        const bounds = link.getBoundingClientRect();
        const panel = link.closest('.site-sidebar-scroll').getBoundingClientRect();
        return bounds.top >= panel.top && bounds.bottom <= panel.bottom;
      }), 'The last link is fully readable at the end');
    }
    await panel.evaluate(element => { element.scrollTop = 0; });
    await fade.waitFor({ state: 'visible' });
    const nearBottom = await panel.locator('.section-nav a:visible').evaluateAll(links => {
      const bottom = links[0].closest('.site-sidebar-scroll').getBoundingClientRect().bottom;
      return links.find(link => {
        const box = link.getBoundingClientRect();
        return box.top > bottom - 80 && box.bottom <= bottom;
      })?.getAttribute('href');
    });
    assert.ok(nearBottom);
    await page.keyboard.press('Tab');
    const target = panel.locator(`a[href="${nearBottom}"]`).first();
    await target.focus();
    await settleLayout(page);
    assert.ok(await target.evaluate(link => {
      const fade = document.querySelector('[data-sidebar-fade]');
      const bounds = link.getBoundingClientRect();
      const panel = link.closest('.site-sidebar-scroll').getBoundingClientRect();
      return bounds.bottom <= (fade.hidden ? panel.bottom : fade.getBoundingClientRect().top) + 1;
    }), 'Keyboard focus remains above the fading area');
    await page.setViewportSize({ width, height: 2000 });
    await fade.waitFor({ state: 'hidden' });
    assert.ok(await panel.evaluate(element => element.scrollHeight <= element.clientHeight + 1), 'A menu that fits needs no fade');
    await page.setViewportSize({ width, height: 480 });
    await panel.evaluate(element => { element.scrollTop = 0; });
    await fade.waitFor({ state: 'visible' });
    await screenshot(page, `sidebar-full-height-fade-${width}`);
  }
});

test('scrolling a long sidebar keeps its collection and parent section links visible', async (t) => {
  for (const width of [1440, 390]) {
    const page = await pageFor(t, base + route, width);
    await page.setViewportSize({ width, height: 600 });
    if (width === 390) await page.getByRole('button', { name: 'Menu', exact: true }).click();
    await page.locator('.site-sidebar-scroll').evaluate(panel => { panel.scrollTop = panel.scrollHeight; });
    await settleLayout(page);
    const context = await page.locator('.section-nav a[aria-current="page"]').evaluate(link => {
      const panel = link.closest('.site-sidebar-scroll').getBoundingClientRect();
      const root = link.closest('.section-nav').querySelector('.sidebar-root').getBoundingClientRect();
      const parents = [];
      for (let group = link.closest('.sidebar-group'); group; group = group.parentElement.closest('.sidebar-group')) {
        const row = group.querySelector(':scope > .site-sidebar-section-row');
        const bounds = row.getBoundingClientRect();
        parents.unshift({ label: row.querySelector('a').textContent, top: bounds.top, bottom: bounds.bottom });
      }
      return { top: panel.top, bottom: panel.bottom, rootTop: root.top, rootBottom: root.bottom, parents };
    });
    assert.deepEqual(context.parents.map(parent => parent.label), ['Other', 'Methodology v1.3', 'Usage']);
    assert.ok(context.rootTop >= context.top);
    assert.ok(context.parents.every(parent => parent.top >= context.rootBottom - 1 && parent.bottom <= context.bottom));
    const contextGap = JSON.parse(readFileSync(new URL('../../data/ui/style.json', import.meta.url), 'utf8')).layoutGapPixels;
    assert.ok(Math.abs(context.parents[0].top - context.rootBottom - contextGap) < 1);
    assert.ok(Math.abs(context.parents[1].top - context.parents[0].bottom - 4) < 1);
    await screenshot(page, `sticky-sidebar-${width}`);
    const parent = page.locator('.section-nav .sidebar-group.depth-1.active-ancestor > .site-sidebar-section-row > a');
    await parent.focus();
    await page.keyboard.press('Enter');
    await page.waitForURL(url => url.pathname === '/ai/other/');
  }
});

test('layout spacing controls the shell while article spacing stays independent', async (t) => {
  const config = JSON.parse(readFileSync(new URL('../../data/ui/style.json', import.meta.url), 'utf8'));
  for (const width of [1440, 1024, 768, 390, 320]) {
    const page = await pageFor(t, base + route, width);
    for (const scheme of ['light', 'dark']) {
      await page.emulateMedia({ colorScheme: scheme });
      await page.waitForFunction(scheme => document.documentElement.classList.contains('dark') === (scheme === 'dark'), scheme);
      for (const configuredGap of [config.layoutGapPixels, config.layoutGapPixels + 8]) {
        const gap = width < 384 ? Math.min(configuredGap, 8) : configuredGap;
        await page.evaluate(gap => {
          document.documentElement.style.setProperty('--site-layout-gap-configured', `${gap}px`);
          document.dispatchEvent(new Event('site:display-change'));
          window.scrollTo({ top: 0, behavior: 'instant' });
          document.querySelector('.site-sidebar-scroll').scrollTop = 0;
          document.querySelector('#page-outline .site-toc-scroll').scrollTop = 0;
        }, configuredGap);
        await settleLayout(page);
        const context = await page.evaluate(() => {
          const contexts = [
            ['.sidebar-root', '.sidebar-tree'],
            ['.breadcrumb', '.site-main > .content'],
            ['.site-toc-title', '#page-outline #TableOfContents'],
          ].map(([header, body]) => ({ header: document.querySelector(header), body: document.querySelector(body) })).filter(({ header }) => header.getClientRects().length);
          const headers = contexts.map(({ header }) => header);
          const frame = document.querySelector('.site-page-layout').getBoundingClientRect();
          const crumb = document.querySelector('.breadcrumb').getBoundingClientRect();
          const left = document.querySelector('.sidebar-root');
          const right = document.querySelector('.site-toc-title');
          const leftBox = left.getClientRects().length ? left.getBoundingClientRect() : null;
          const rightBox = right.getClientRects().length ? right.getBoundingClientRect() : null;
          const controls = ['.hextra-theme-toggle', '.site-settings-link', '.hextra-search-trigger'].map(selector => document.querySelector(selector).getBoundingClientRect());
          return {
            gaps: contexts.map(({ header, body }) => ({
              article: header.matches('.breadcrumb'),
              pixels: body.getBoundingClientRect().top - header.getBoundingClientRect().bottom,
            })),
            buttonGaps: [controls[1].left - controls[0].right, controls[2].left - controls[1].right],
            rowGaps: headers.map(header => header.getBoundingClientRect().top - document.querySelector('.hextra-nav-container').getBoundingClientRect().bottom),
            outer: [(leftBox || crumb).left - frame.left, frame.right - (rightBox || crumb).right],
            columns: [leftBox ? crumb.left - leftBox.right : null, rightBox ? rightBox.left - crumb.right : null].filter(value => value !== null),
            top: document.querySelector('.site-brand-link').getBoundingClientRect().top,
            navigationGap: parseFloat(getComputedStyle(document.querySelector('.page-nav')).gap),
            masks: headers.map(header => {
              const style = getComputedStyle(header, '::after');
              return { height: parseFloat(style.height), image: style.backgroundImage, background: style.backgroundColor, pointerEvents: style.pointerEvents };
            }),
            background: getComputedStyle(document.body).backgroundColor,
            pinnedParentsAtTop: document.querySelectorAll('.site-sidebar-section-row.site-pinned, #page-outline #TableOfContents .site-pinned').length,
          };
        });
        assert.ok(context.gaps.every(({ article, pixels }) => Math.abs(pixels - (article ? config.articleTopGapPixels : gap)) < 1), `Content gaps follow their own parameters at ${width}px: ${JSON.stringify(context.gaps)}`);
        assert.ok([...context.rowGaps, ...context.outer, ...context.columns, context.top].every(value => Math.abs(value - gap) < 1), `Rows, columns and page edges share the layout gap at ${width}px: ${JSON.stringify(context)}`);
        assert.ok([...context.buttonGaps, context.navigationGap].every(value => Math.abs(value - gap) < 1), `Buttons, rows, columns and outer edges use the same gap at ${width}px: ${JSON.stringify(context)}`);
        assert.ok(context.masks.every(mask => mask.height === gap && mask.image === 'none' && mask.background === context.background && mask.pointerEvents === 'none'), 'Every heading gap matches the page background and masks scrolling content');
        assert.equal(context.pinnedParentsAtTop, 0, 'The first section is not styled as pinned before its menu has scrolled');
        await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
        await settleLayout(page);
        const bottomGaps = await page.evaluate(() => {
          const edge = Math.min(innerHeight, document.querySelector('.site-page-layout').getBoundingClientRect().bottom);
          return [[...document.querySelectorAll('.page-nav a')].at(-1), document.getElementById('backToTop')]
            .filter(button => button.getClientRects().length)
            .map(button => edge - button.getBoundingClientRect().bottom);
        });
        assert.ok(bottomGaps.every(value => Math.abs(value - gap) < 1), `Bottom actions keep the same outer spacing: ${JSON.stringify(bottomGaps)}`);
      }
    }
  }
});

test('breadcrumbs stay below the top bar and deep-linked headings stay below the breadcrumbs', async (t) => {
  const id = 'level-3--slices-and-state-snapshots';
  const spacing = JSON.parse(readFileSync(new URL('../../data/ui/style.json', import.meta.url), 'utf8')).layoutGapPixels;
  for (const width of [1440, 390]) {
    const page = await pageFor(t, base + route + `#${id}`, width);
    await page.waitForFunction(({ id, spacing }) => {
      const heading = document.getElementById(id).getBoundingClientRect();
      const breadcrumb = document.querySelector('.breadcrumb').getBoundingClientRect();
      return heading.top >= breadcrumb.bottom + spacing - 1 && heading.top < innerHeight;
    }, { id, spacing });
    const bounds = await page.locator('.breadcrumb').boundingBox();
    const header = await page.locator('.hextra-nav-container').boundingBox();
    assert.ok(Math.abs(bounds.y - header.y - header.height - spacing) < 1);
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
      { x: width / 2, y: header.y + 1 },
      { x: crumb.x + 1, y: crumb.y - 6 },
      { x: crumb.x + crumb.width - 2, y: crumb.y - 6 },
      { x: crumb.x + 1, y: crumb.y + 1 },
      { x: crumb.x + 1, y: crumb.y + crumb.height - 1 },
      { x: crumb.x + crumb.width / 2, y: crumb.y + crumb.height + 1 },
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

test('previous and next stay at the article end while the reading fringe fades toward the side controls', async (t) => {
  const page = await pageFor(t);
  const fade = page.locator('[data-reading-fade]');
  const navigation = page.locator('.page-nav');
  const heights = await page.locator('.site-page-nav-footer').evaluate(wrapper => ({
    bar: wrapper.getBoundingClientRect().height,
    buttons: [...wrapper.querySelectorAll('.page-nav a')].map(link => link.getBoundingClientRect().height),
    sideBar: document.querySelector('.site-toc-controls').getBoundingClientRect().height,
    sideButton: document.getElementById('backToTop').getBoundingClientRect().height,
  }));
  assert.ok(Math.abs(heights.bar - heights.sideBar) < 1 && heights.buttons.every(height => Math.abs(height - heights.sideButton) < 1), 'Long page titles cannot increase the footer beyond the side controls height');
  assert.ok(await navigation.evaluate(element => element.getBoundingClientRect().top >= innerHeight), 'Previous/Next are below the article instead of covering the reading area');
  for (const scheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.waitForFunction(scheme => document.documentElement.classList.contains('dark') === (scheme === 'dark'), scheme);
    await page.evaluate(() => {
      window.scrollTo({ top: 1400, behavior: 'instant' });
      const probe = document.createElement('div');
      probe.id = 'reading-footer-probe';
      probe.style.cssText = 'position:fixed;inset:0;background:#ff00ff;z-index:5;pointer-events:none';
      document.body.append(probe);
    });
    await fade.waitFor({ state: 'visible' });
    assert.ok(await navigation.evaluate(element => element.getBoundingClientRect().top >= innerHeight));
    const points = await fade.evaluate(element => {
      const box = element.getBoundingClientRect(), button = document.getElementById('backToTop').getBoundingClientRect();
      const x = box.left + box.width / 2;
      return [
        { x, y: box.top + 1 },
        { x, y: (box.top + button.bottom) / 2 },
        { x, y: button.bottom + 1 },
      ];
    });
    const png = await page.screenshot({ scale: 'css' });
    const paint = await page.evaluate(async ({ png, points }) => {
      const image = new Image();
      image.src = `data:image/png;base64,${png}`;
      await image.decode();
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext('2d');
      context.fillStyle = getComputedStyle(document.querySelector('.site-page-nav-footer')).backgroundColor;
      context.fillRect(0, 0, 1, 1);
      const expected = [...context.getImageData(0, 0, 1, 1).data];
      context.drawImage(image, 0, 0);
      return { expected, pixels: points.map(({ x, y }) => [...context.getImageData(Math.floor(x), Math.floor(y), 1, 1).data]) };
    }, { png: png.toString('base64'), points });
    const distances = paint.pixels.map(pixel => pixel.slice(0, 3).reduce((sum, value, index) => sum + Math.abs(value - paint.expected[index]), 0));
    assert.ok(distances[0] > distances[1] && distances[1] > distances[2] && distances[2] === 0, 'Text fades gradually into the page background by the side buttons’ lower edge');
    await page.locator('#reading-footer-probe').evaluate(element => element.remove());
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await fade.waitFor({ state: 'hidden' });
    assert.ok(await navigation.evaluate(element => {
      const box = element.getBoundingClientRect();
      return box.top >= 0 && box.bottom <= innerHeight;
    }), 'Previous/Next appear at the end without being covered by the fade');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await fade.waitFor({ state: 'visible' });
  }
  for (const viewport of [{ width: 390, height: 900 }, { width: 1440, height: 480 }]) {
    await page.setViewportSize(viewport);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    assert.equal(await fade.isVisible(), false, 'Compact reading windows retain unobstructed article space');
    assert.equal(await page.locator('.site-page-nav-footer').evaluate(element => getComputedStyle(element).position), 'static');
  }
});

test('notes without outlines reserve the usual column and align short-page navigation with side controls', async (t) => {
  for (const width of [390, 768, 1024, 1440]) {
    const page = await pageFor(t, base + '/engineering/architecture/changeability/', width);
    const referencePage = await pageFor(t, base + route, width);
    const outlineWidth = await referencePage.locator('#page-outline').evaluate(element => element.getBoundingClientRect().width);
    const expectedMain = await referencePage.locator('.site-main').boundingBox();
    const placeholder = page.locator('.site-outline-placeholder');
    assert.equal(await placeholder.getAttribute('aria-hidden'), 'true');
    assert.equal(await placeholder.locator('*').count(), 0, 'The reserved column contains no outline controls');
    assert.equal(await page.locator('.site-outline-trigger, [data-outline-toggle], .site-outline-resizer').count(), 0);
    const reservedWidth = await placeholder.evaluate(element => element.getBoundingClientRect().width);
    assert.ok(Math.abs(reservedWidth - outlineWidth) < 1, `${width}: same fitted outline width`);
    const main = await page.locator('.site-main').boundingBox();
    assert.ok(Math.abs(main.x - expectedMain.x) < 1 && Math.abs(main.width - expectedMain.width) < 1, `${width}: standard article column`);
    const controls = await page.evaluate(() => {
      const rect = element => { const box = element.getBoundingClientRect(); return { top: box.top, bottom: box.bottom, height: box.height }; };
      return {
        links: [...document.querySelectorAll('.page-nav a')].map(rect),
        layoutBottom: document.querySelector('.site-page-layout').getBoundingClientRect().bottom,
        footerBottom: document.querySelector('.site-page-nav-footer').getBoundingClientRect().bottom,
        titleOffset: document.querySelector('.article-content > h1').getBoundingClientRect().top - document.querySelector('.site-main > .content').getBoundingClientRect().top,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    });
    assert.ok(controls.links.length === 2 && controls.links.every(link => Math.abs(link.height - 48) < 1));
    assert.ok(Math.abs(controls.titleOffset) < 1, 'The footer layout preserves the title’s context gap');
    assert.ok(Math.abs(controls.footerBottom - controls.layoutBottom) < 1, `${width}: navigation stays at the page end`);
    assert.ok(controls.overflow <= 1);
    await screenshot(page, `no-outline-navigation-${width}`);
  }
});

test('empty outline columns preserve saved widths and release their space when the outline is hidden', async (t) => {
  const page = await pageFor(t);
  await dragPane(page, page.getByRole('separator', { name: 'Page outline width' }), -32);
  const width = await page.locator('#page-outline').evaluate(element => element.getBoundingClientRect().width);
  await page.goto(base + '/engineering/architecture/changeability/', { waitUntil: 'networkidle' });
  const placeholder = page.locator('.site-outline-placeholder');
  assert.ok(Math.abs(await placeholder.evaluate(element => element.getBoundingClientRect().width) - width) < 1);
  await page.evaluate(() => {
    document.documentElement.dataset.outline = 'hidden';
    document.dispatchEvent(new Event('site:display-change'));
  });
  assert.equal(await placeholder.isVisible(), false);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1));
});

test('bottom controls share colors, breadcrumb edges and the unified spacing', async (t) => {
  const config = JSON.parse(readFileSync(new URL('../../data/ui/style.json', import.meta.url), 'utf8'));
  const page = await pageFor(t);
  assert.equal(await page.evaluate(() => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--site-layout-gap'))), config.layoutGapPixels);
  for (const scheme of ['light', 'dark']) {
    await page.emulateMedia({ colorScheme: scheme });
    await page.waitForFunction(scheme => document.documentElement.classList.contains('dark') === (scheme === 'dark'), scheme);
    for (const { width, density, outline } of [
      { width: 1440, density: 'comfortable', outline: 'auto' },
      { width: 1440, density: 'compact', outline: 'auto' },
      { width: 1024, density: 'auto', outline: 'auto' },
      { width: 768, density: 'auto', outline: 'auto' },
      { width: 390, density: 'auto', outline: 'auto' },
      { width: 1440, density: 'auto', outline: 'hidden' },
    ]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(({ density, outline }) => {
        document.documentElement.dataset.density = density;
        document.documentElement.dataset.outline = outline;
        document.dispatchEvent(new Event('site:display-change'));
        window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
      }, { density, outline });
      await settleLayout(page);
      const controls = await page.evaluate(() => {
        const previous = document.querySelector('.page-nav-previous');
        const next = document.querySelector('.page-nav-next');
        const theme = document.querySelector('.site-header-preferences .hextra-theme-toggle');
        const settings = document.querySelector('.site-settings-link');
        const back = document.getElementById('backToTop');
        const breadcrumb = document.querySelector('.breadcrumb');
        const crumb = breadcrumb.getBoundingClientRect();
        const prevBox = previous.getBoundingClientRect(), nextBox = next.getBoundingClientRect();
        const visible = element => element.getClientRects().length > 0;
        const rowGap = getComputedStyle(document.querySelector('.page-nav')).columnGap;
        const gaps = [prevBox.top === nextBox.top ? nextBox.left - prevBox.right : nextBox.top - prevBox.bottom];
        const sectionGaps = [];
        const search = document.querySelector('.hextra-search-trigger');
        const content = [previous, next, back, search,
          breadcrumb.querySelector('ol'), document.querySelector('.sidebar-root > a'),
          document.querySelector('.site-toc-title-label')].filter(visible);
        const presentation = element => {
          const style = getComputedStyle(element);
          return [style.fontSize, style.lineHeight, style.fontWeight, style.paddingBlockStart, style.paddingBlockEnd];
        };
        const iconControls = [previous, next, theme, settings, back, search,
          document.querySelector('.sidebar-root'), document.querySelector('.site-toc-title')].filter(visible);
        if (visible(back) && nextBox.top === back.getBoundingClientRect().top) sectionGaps.push(back.getBoundingClientRect().left - nextBox.right);
        return {
          edges: [prevBox.left - crumb.left, nextBox.right - crumb.right],
          gaps,
          sectionGaps,
          gap: parseFloat(rowGap),
          background: getComputedStyle(breadcrumb).backgroundColor,
          foreground: getComputedStyle(breadcrumb).color,
          colors: [previous, next, back].filter(visible).map(element => {
            const style = getComputedStyle(element);
            return { background: style.backgroundColor, foreground: style.color };
          }),
          labelColors: [...document.querySelectorAll('.page-nav-title')].map(element => getComputedStyle(element).color),
          presentation: content.map(presentation),
          referencePresentation: presentation(breadcrumb.querySelector('ol')),
          heights: [previous, next, back, search].filter(visible).map(element => element.getBoundingClientRect().height),
          icons: iconControls.map(element => {
            const icon = [...element.querySelectorAll('svg')].find(icon => icon.getClientRects().length);
            const box = icon.getBoundingClientRect();
            const style = getComputedStyle(icon);
            const left = box.left + parseFloat(style.paddingLeft);
            const right = box.right - parseFloat(style.paddingRight);
            const frame = icon.closest('.site-surface-leading').getBoundingClientRect();
            const artwork = icon.getBBox();
            const artworkCenter = new DOMPoint(artwork.x + artwork.width / 2, artwork.y + artwork.height / 2).matrixTransform(icon.getScreenCTM());
            const control = element.getBoundingClientRect();
            const chevron = element.matches('.page-nav-previous, .page-nav-next, .sidebar-root, .site-toc-title') ? icon.getBBox() : null;
            const text = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
            let firstText;
            for (let node = text.nextNode(); node; node = text.nextNode()) {
              if (!node.textContent.trim()) continue;
              const range = document.createRange();
              range.selectNodeContents(node);
              const bounds = range.getBoundingClientRect();
              if (bounds.height) { firstText = bounds; break; }
            }
            return {
              width: right - left,
              height: box.height - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom),
              leading: !firstText || right <= firstText.left,
              borderGap: left - element.getBoundingClientRect().left,
              textGap: firstText ? firstText.left - right : null,
              centeredInFrame: Math.abs(box.left + box.right - frame.left - frame.right) < 1 && Math.abs(box.top + box.bottom - frame.top - frame.bottom) < 1,
              artworkCenteredInFrame: Math.abs(artworkCenter.x - frame.left - frame.width / 2) < 0.1 && Math.abs(artworkCenter.y - frame.top - frame.height / 2) < 0.1,
              centerOffset: (left + right - control.left - control.right) / 2,
              chevronAspect: chevron ? chevron.width / chevron.height : null,
            };
          }),
          endInsets: [previous, next, theme, settings, back, breadcrumb,
            document.querySelector('.sidebar-root'), document.querySelector('.site-toc-title')]
            .filter(visible).flatMap(element => {
              const label = element.querySelector(':scope > .site-control-label, :scope > .site-surface-content');
              const action = element.querySelector(':scope > .site-header-toggle');
              const actionWidth = action && visible(action) ? action.getBoundingClientRect().width + parseFloat(getComputedStyle(element).columnGap) : 0;
              return label && visible(label) ? [element.getBoundingClientRect().right - label.getBoundingClientRect().right - actionWidth] : [];
            }),
          overflow: document.documentElement.scrollWidth - innerWidth,
        };
      });
      assert.ok(controls.edges.every(offset => Math.abs(offset) < 1), `Navigation matches breadcrumb edges at ${width}px`);
      assert.ok(controls.gaps.every(gap => Math.abs(gap - controls.gap) < 1), `Gaps within each section match at ${width}px/${density}/${outline}: ${JSON.stringify(controls.gaps)}`);
      assert.ok(controls.sectionGaps.every(gap => Math.abs(gap - controls.gap) < 1), 'Sections and the buttons within them share the same gap');
      assert.ok(controls.colors.every(color => color.background === controls.background && color.foreground === controls.foreground), `Bottom controls share breadcrumb colors in ${scheme} mode`);
      assert.ok(controls.labelColors.every(color => color === controls.foreground), 'Article titles inherit the shared foreground');
      assert.ok(controls.presentation.every(style => JSON.stringify(style) === JSON.stringify(controls.referencePresentation)), 'Filled controls share typography and vertical padding with the context row');
      assert.ok(controls.heights.every(height => Math.abs(height - controls.heights[0]) < 1), 'Single-line filled controls share one height');
      assert.ok(controls.icons.every(icon => icon.width === 20 && icon.height === 20 && icon.leading), 'Control icons have one size and precede their labels');
      assert.ok(controls.icons.every(icon => icon.centeredInFrame), 'Artwork stays centered in the shared icon frame');
      assert.ok(controls.icons.every(icon => icon.artworkCenteredInFrame), 'The visible symbols are centered horizontally and vertically inside their frames');
      const labelledIcons = controls.icons.filter(icon => icon.textGap !== null);
      assert.ok(labelledIcons.every(icon => Math.abs(icon.borderGap - labelledIcons[0].borderGap) < 1 && Math.abs(icon.textGap - labelledIcons[0].textGap) < 1), 'Labelled controls share border-to-icon and icon-to-text spacing');
      assert.ok(controls.icons.filter(icon => icon.textGap === null).every(icon => Math.abs(icon.centerOffset) < 1), 'Icon-only controls center their frame between both edges');
      assert.ok(controls.icons.every(icon => icon.chevronAspect === null || icon.chevronAspect < 0.6), 'Left and right chevrons retain their narrow proportions');
      assert.ok(controls.endInsets.every(inset => Math.abs(inset - 12) < 1), 'Labels share a trailing inset instead of different compact-button padding');
      assert.ok(controls.overflow <= 0, 'Aligned controls fit the reading window');
    }
  }
});

test('side menu headings and bottom controls stay synchronized as the site footer enters and leaves view', async (t) => {
  for (const { width, height } of [{ width: 1440, height: 900 }, { width: 1024, height: 900 }, { width: 1440, height: 600 }]) {
    for (const pathname of [route, '/ai-engineering/evaluation/', '/engineering/architecture/']) {
      const page = await pageFor(t, base + pathname, width);
      await page.setViewportSize({ width, height });
      await settleLayout(page);
      const originalHeight = await page.evaluate(() => document.documentElement.scrollHeight);
      const end = originalHeight - height;
      const footerHeight = await page.locator('.hextra-footer').evaluate(element => element.getBoundingClientRect().height);
      for (const position of [Math.max(0, end - footerHeight / 2), end, Math.max(0, end - 100), 0]) {
        const frames = await page.evaluate(async top => {
          const sample = () => {
            const breadcrumbTop = document.querySelector('.breadcrumb').getBoundingClientRect().top;
            const bottom = Math.min(innerHeight, document.querySelector('.site-page-layout').getBoundingClientRect().bottom);
            const actions = document.querySelector('#page-outline .site-toc-controls');
            const padding = parseFloat(getComputedStyle(actions).paddingBottom);
            const readingEnd = (document.querySelector('.page-nav') || document.querySelector('.site-main > .content')).getBoundingClientRect().bottom;
            return {
              headings: ['.sidebar-root', '.site-toc-title'].map(selector => document.querySelector(selector).getBoundingClientRect().top - breadcrumbTop),
              controls: [
                document.querySelector('.site-sidebar-fade-anchor').getBoundingClientRect().bottom - bottom,
                document.getElementById('backToTop').getBoundingClientRect().bottom - Math.min(innerHeight - padding, readingEnd),
              ],
            };
          };
          window.scrollTo({ top, behavior: 'instant' });
          // Read before the scroll handler can resize the panes, then on each
          // frame: waiting for alignment alone misses a visible up/down bounce.
          const frames = [sample()];
          for (let frame = 0; frame < 3; frame++) {
            await new Promise(resolve => requestAnimationFrame(resolve));
            frames.push(sample());
          }
          return frames;
        }, position);
        assert.ok(frames.flatMap(frame => frame.headings).every(offset => Math.abs(offset) < 1), `Headings stay pinned throughout scrolling: ${JSON.stringify(frames)}`);
        assert.ok(frames.flatMap(frame => frame.controls).every(offset => Math.abs(offset) < 1), `The sidebar follows the footer and the outline action follows the reading boundary on every frame: ${JSON.stringify(frames)}`);
        await page.waitForFunction(() => {
          const top = document.querySelector('.breadcrumb').getBoundingClientRect().top;
          const footerTop = document.querySelector('.hextra-footer').getBoundingClientRect().top;
          const headings = ['.sidebar-root', '.site-toc-title'].map(selector => document.querySelector(selector).getBoundingClientRect());
          const buttons = ['#backToTop'].map(selector => document.querySelector(selector));
          return headings.every(box => Math.abs(box.top - top) < 1) && buttons.every(button => {
            const box = button.getBoundingClientRect();
            return box.top >= 0 && box.bottom <= Math.min(innerHeight, footerTop) && button.contains(document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2));
          });
        });
        assert.ok(Math.abs(await page.evaluate(() => document.documentElement.scrollHeight) - originalHeight) < 1, 'Fitting menus above the footer does not change the document height');
        if (position === end) {
          const beforeFocus = await page.evaluate(() => scrollY);
          for (const name of ['Site navigation width', 'Page outline width']) {
            await page.getByRole('separator', { name }).focus();
            assert.equal(await page.evaluate(() => scrollY), beforeFocus, 'Focusing a pane divider at the footer preserves the reading position');
          }
        }
      }
      await screenshot(page, `pinned-menu-footer-${width}-${height}-${pathname === route ? 'article' : 'section'}`);
    }
  }
});

test('overview scroll-to-top alignment follows expanded content and survives returning from the page bottom', async (t) => {
  const page = await pageFor(t, base + '/engineering/');
  assert.equal(await page.locator('.page-nav').count(), 0);
  const group = page.locator('.section-map-disclosure:visible').last();
  for (const open of [true, false, true]) {
    await group.evaluate((element, open) => { element.open = open; }, open);
    await settleLayout(page);
    const documentHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const end = documentHeight - 900;
    for (const top of [end, Math.max(0, end - 100), Math.max(0, end - 250), end]) {
      await page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), top);
      await settleLayout(page);
      const offset = await page.evaluate(() => {
        const padding = parseFloat(getComputedStyle(document.querySelector('#page-outline .site-toc-controls')).paddingBottom);
        const end = document.querySelector('.site-main > .content').getBoundingClientRect().bottom;
        return document.getElementById('backToTop').getBoundingClientRect().bottom - Math.min(innerHeight - padding, end);
      });
      assert.ok(Math.abs(offset) < 1, 'The action aligns with the visible overview boundary after either scroll direction');
      assert.equal(await page.evaluate(() => document.documentElement.scrollHeight), documentHeight, 'Fitting the action cannot move the page ending');
    }
  }
});

test('scroll to top stays available outside the outline scroller and aligns with navigation actions', async (t) => {
  for (const height of [900, 320]) {
    const page = await pageFor(t);
    await page.setViewportSize({ width: 1440, height });
    const button = page.locator('#backToTop');
    const outline = page.locator('#page-outline .site-toc-scroll');
    for (const [pagePosition, outlinePosition] of [[0, 0], [1200, 1], [400, 0.5], [0, 1]]) {
      await page.evaluate(position => window.scrollTo({ top: position, behavior: 'instant' }), pagePosition);
      await outline.evaluate((panel, fraction) => { panel.scrollTop = panel.scrollHeight * fraction; }, outlinePosition);
      await page.waitForFunction(() => {
        const button = document.getElementById('backToTop'), box = button.getBoundingClientRect();
        const space = document.querySelector('.site-sidebar-fade-anchor');
        const left = space.getBoundingClientRect();
        const inset = parseFloat(getComputedStyle(document.querySelector('#page-outline .site-toc-controls')).paddingBottom);
        return getComputedStyle(button).opacity === '1' && box.top >= 0 && box.bottom <= innerHeight && Math.abs(box.bottom - left.bottom + inset) < 1 && button.contains(document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2));
      });
      assert.notEqual(await button.getAttribute('tabindex'), '-1', 'The action stays keyboard accessible, including at the top of the page');
    }
    const edges = await button.evaluate(button => {
      const box = button.getBoundingClientRect(), title = document.querySelector('.site-toc-title').getBoundingClientRect();
      return { left: box.left - title.left, width: box.width, height: box.height };
    });
    assert.ok(Math.abs(edges.left) < 1, 'The action shares the outline heading left edge');
    assert.ok(Math.abs(edges.width - edges.height) < 1, 'The icon-only action is square');
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.waitForFunction(() => Math.abs(document.getElementById('backToTop').getBoundingClientRect().bottom - document.querySelector('.page-nav').getBoundingClientRect().bottom) < 1);
    await button.focus();
    await page.keyboard.press('Enter');
    await page.waitForFunction(() => scrollY === 0 && document.querySelector('#page-outline .site-toc-scroll').scrollTop === 0);
    await settleLayout(page);
    assert.deepEqual(await page.evaluate(() => [scrollY, document.querySelector('#page-outline .site-toc-scroll').scrollTop]), [0, 0], 'Expanding the outline after returning to the top cannot restore its old scroll position');
    assert.equal(await button.evaluate(button => getComputedStyle(button).opacity), '1');
    await screenshot(page, `outline-scroll-to-top-${height}`);
  }
});

test('the compact outline keeps scroll to top visible and closes after returning to the page top', async (t) => {
  const page = await pageFor(t, base + route, 390);
  await page.evaluate(() => window.scrollTo({ top: 1400, behavior: 'instant' }));
  await page.locator('.site-outline-trigger').click();
  const panel = page.locator('#site-outline-popover');
  const scroll = panel.locator('.site-toc-scroll');
  const button = panel.getByRole('button', { name: 'Scroll to top', exact: true });
  for (const fraction of [1, 0, 0.6]) {
    await scroll.evaluate((element, fraction) => { element.scrollTop = element.scrollHeight * fraction; }, fraction);
    assert.ok(await button.evaluate(button => {
      const box = button.getBoundingClientRect();
      return box.top >= 0 && box.bottom <= innerHeight && button.contains(document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2));
    }), 'Scrolling the outline cannot hide or cover the action');
  }
  await button.click();
  await panel.waitFor({ state: 'hidden' });
  await page.waitForFunction(() => scrollY === 0);
  await page.locator('.site-outline-trigger').click();
  assert.equal(await scroll.evaluate(element => element.scrollTop), 0);
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
        const pane = document.querySelector('.hextra-sidebar-container');
        const sidebar = pane.getBoundingClientRect();
        const header = document.querySelector('.hextra-nav-container nav');
        const title = header.querySelector('a').getBoundingClientRect();
        const gutter = parseFloat(getComputedStyle(header).paddingInlineStart);
        return { mainLeft: main.left, sidebarRight: sidebar.right, sidebarWidth: sidebar.width, titleLeft: title.left, gutter, hit: Boolean(document.elementFromPoint(main.left + main.width / 2, 400)?.closest('main')) };
      });
      assert.ok(layout.titleLeft >= layout.gutter - 1, `${width}px ${font}: header title stays inside its gutter`);
      assert.ok(layout.hit, `${width}px ${font}: the sidebar does not cover the article`);
      if (layout.sidebarWidth > 0) {
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
    for (const pinned of [true, false]) {
      await page.evaluate(pinned => { document.documentElement.dataset.pinAncestors = String(pinned); }, pinned);
      const guideEnds = await page.locator('.hextra-toc li > ul').evaluateAll(lists => lists.map(list => {
        const items = [...list.children];
        if (items.length === 1) return { single: true, hidden: getComputedStyle(items[0], '::before').content === 'none' };
        const first = items[0], last = items.at(-1);
        const firstLink = first.querySelector(':scope > a'), lastLink = last.querySelector(':scope > a');
        if (!firstLink || !lastLink) return null;
        const firstLineCenter = link => {
          const style = getComputedStyle(link);
          return link.getBoundingClientRect().top + parseFloat(style.paddingTop) + parseFloat(style.lineHeight) / 2;
        };
        const firstGuide = getComputedStyle(first, '::before'), lastGuide = getComputedStyle(last, '::before');
        const joins = items.slice(0, -1).map((item, index) => {
          const guide = getComputedStyle(item, '::before'), next = items[index + 1], nextGuide = getComputedStyle(next, '::before');
          return item.getBoundingClientRect().top + parseFloat(guide.top) + parseFloat(guide.height) - next.getBoundingClientRect().top - parseFloat(nextGuide.top);
        });
        return {
          continuous: joins.every(gap => Math.abs(gap) < 0.5),
          start: first.getBoundingClientRect().top + parseFloat(firstGuide.top) - firstLineCenter(firstLink),
          end: last.getBoundingClientRect().top + parseFloat(lastGuide.top) + parseFloat(lastGuide.height) - firstLineCenter(lastLink),
        };
      }).filter(Boolean));
      assert.ok(guideEnds.every(guide => guide.single ? guide.hidden : guide.continuous && Math.abs(guide.start) < 0.5 && Math.abs(guide.end) < 0.5), 'Guides connect first text lines continuously and single-item groups have no dangling line');
    }
    await page.evaluate(() => { document.documentElement.dataset.pinAncestors = 'true'; });
    const sixthLevel = page.locator('.article-content h6[id]');
    const deepestHeading = await sixthLevel.count() ? sixthLevel.first() : page.locator('.article-content h5[id]').first();
    const deepest = await deepestHeading.getAttribute('id');
    assert.ok(deepest);
    await readAt(page, deepest);
    const outline = await page.locator(`.hextra-toc a[href="#${deepest}"]`).evaluate((link) => {
      let item = link.closest('li');
      let parent;
      while (!parent && (item = item.parentElement.closest('li'))) parent = item.querySelector(':scope > a');
      const itemWithGuide = link.parentElement;
      const guide = getComputedStyle(itemWithGuide, '::before');
      const marker = getComputedStyle(link, '::before');
      return {
        left: link.getBoundingClientRect().left,
        parentLeft: parent?.getBoundingClientRect().left,
        guideVisible: guide.content !== 'none',
        guideCenter: itemWithGuide.getBoundingClientRect().left + parseFloat(guide.left) + parseFloat(guide.width) / 2,
        markerCenter: link.getBoundingClientRect().left + parseFloat(marker.left) + parseFloat(marker.width) / 2,
      };
    });
    assert.ok(outline.left > outline.parentLeft, 'Child headings are visibly indented');
    if (outline.guideVisible) assert.ok(Math.abs(outline.guideCenter - outline.markerCenter) < 0.5, 'The nesting guide and selected heading indicator share a vertical centerline');
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

test('mobile and tablet readers retain multi-level outline access and navigation drawers', async (t) => {
  for (const width of [390, 820, 1024]) {
    const page = await pageFor(t, base + route, width);
    const floating = await page.locator('.site-outline-trigger').isVisible();
    const outline = page.locator(floating ? '#site-outline-popover' : '#page-outline');
    if (floating) await page.locator('.site-outline-trigger').click();
    assert.ok(await outline.isVisible());
    assert.ok(await outline.locator('li > ul li > ul li > ul').count() > 0);
    await outline.locator('a[href="#level-3--slices-and-state-snapshots"]').click();
    if (floating) await outline.waitFor({ state: 'hidden' });
    assert.equal(new URL(page.url()).hash, '#level-3--slices-and-state-snapshots');
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    if (width < 1024) {
      await page.getByRole('button', { name: 'Menu', exact: true }).click();
      assert.ok(await page.locator('.section-nav a[aria-current="page"]').isVisible());
      await screenshot(page, `navigation-drawer-${width}`);
      await page.getByRole('button', { name: 'Close navigation', exact: true }).click();
    }
  }
});

async function swipeTouch(page, from, to) {
  const points = Array.from({ length: 7 }, (_, index) => ({
    x: from.x + (to.x - from.x) * index / 6,
    y: from.y + (to.y - from.y) * index / 6,
    id: 1,
  }));
  if (browser.browserType() === chromium) {
    const session = await page.context().newCDPSession(page);
    try {
      await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [points[0]] });
      for (const point of points.slice(1)) {
        await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point] });
      }
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    } finally {
      await session.detach();
    }
  } else {
    // Playwright exposes native touch swipes through CDP only. Exercise the same
    // DOM touch sequence in WebKit, including its native popover and focus APIs.
    await page.evaluate(points => {
      const target = document.elementFromPoint(points[0].x, points[0].y);
      function dispatch(type, point) {
        const touch = { identifier: point.id, clientX: point.x, clientY: point.y };
        const event = new Event(type, { bubbles: true, cancelable: true });
        Object.assign(event, { touches: type === 'touchend' ? [] : [touch], changedTouches: [touch] });
        target.dispatchEvent(event);
      }
      dispatch('touchstart', points[0]);
      for (const point of points.slice(1)) dispatch('touchmove', point);
      dispatch('touchend', points.at(-1));
    }, points);
  }
  await settleLayout(page);
}

test('right-edge touch swipes open the mobile outline at the current heading even with the top bar hidden', async (t) => {
  const id = 'level-3--slices-and-state-snapshots';
  for (const width of [390, 700]) {
    const page = await pageFor(t, base + route + '#' + id, width, { hasTouch: true, isMobile: true });
    const panel = page.locator('#site-outline-popover');
    const trigger = page.locator('.site-outline-trigger');
    for (const hiddenHeader of [false, true]) {
      if (hiddenHeader) {
        await page.context().addCookies([{ name: 'display-preferences', value: encodeURIComponent(JSON.stringify({ headerVisible: false })), url: base }]);
        await page.reload({ waitUntil: 'networkidle' });
        assert.equal(await page.locator('#site-header').isVisible(), false);
      }
      await readAt(page, id);
      const before = await page.evaluate(() => scrollY);
      await swipeTouch(page, { x: width - 8, y: 500 }, { x: width - 120, y: 504 });
      await panel.waitFor({ state: 'visible' });
      assert.equal(await trigger.getAttribute('aria-expanded'), 'true');
      const active = panel.locator('[aria-current="location"]');
      assert.equal(await active.getAttribute('href'), '#' + id);
      await page.waitForFunction(() => document.activeElement?.matches('#site-outline-popover [aria-current="location"]'));
      assert.equal(await page.evaluate(() => scrollY), before, 'Opening preserves the reading position');
      await screenshot(page, `outline-swipe-${width}${hiddenHeader ? '-hidden-header' : ''}`);
      await panel.locator('a[href="#8-adoption-plan-phased-rollout-with-exit-criteria"]').click();
      await panel.waitFor({ state: 'hidden' });
      assert.equal(new URL(page.url()).hash, '#8-adoption-plan-phased-rollout-with-exit-criteria');
      assert.equal(await trigger.getAttribute('aria-expanded'), 'false');
    }
  }
});

test('outline swipes leave reading gestures, other dialogs, and inline or hidden outlines alone', async (t) => {
  const page = await pageFor(t, base + route, 390, { hasTouch: true, isMobile: true });
  const panel = page.locator('#site-outline-popover');
  for (const [from, to] of [
    [{ x: 250, y: 500 }, { x: 130, y: 500 }], // Away from the edge.
    [{ x: 382, y: 500 }, { x: 360, y: 500 }], // Short movement.
    [{ x: 365, y: 500 }, { x: 387, y: 500 }], // Wrong direction.
    [{ x: 382, y: 600 }, { x: 378, y: 420 }], // Vertical scrolling.
    [{ x: 382, y: 600 }, { x: 290, y: 420 }], // Mostly vertical diagonal.
  ]) {
    await swipeTouch(page, from, to);
    assert.equal(await panel.isVisible(), false);
  }
  if (browser.browserType() === chromium) assert.ok(await page.evaluate(() => scrollY > 0), 'Native touch scrolling still moves the article');
  await page.locator('.site-header-preferences .site-settings-link').click();
  await swipeTouch(page, { x: 382, y: 500 }, { x: 270, y: 500 });
  assert.equal(await panel.isVisible(), false, 'Settings retains its touch gestures');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await swipeTouch(page, { x: 382, y: 500 }, { x: 270, y: 500 });
  assert.equal(await panel.isVisible(), false, 'The navigation drawer stays in control');
  await page.getByRole('button', { name: 'Close navigation', exact: true }).click();
  await page.context().addCookies([{ name: 'display-preferences', value: encodeURIComponent(JSON.stringify({ outline: 'hidden' })), url: base }]);
  await page.reload({ waitUntil: 'networkidle' });
  await swipeTouch(page, { x: 382, y: 500 }, { x: 270, y: 500 });
  assert.equal(await panel.isVisible(), false, 'Explicitly hiding the outline also disables its gesture');
  await page.context().clearCookies();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload({ waitUntil: 'networkidle' });
  await swipeTouch(page, { x: 1432, y: 500 }, { x: 1320, y: 500 });
  assert.equal(await panel.isVisible(), false, 'Desktop keeps the inline outline');
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto(base + '/settings/', { waitUntil: 'networkidle' });
  await swipeTouch(page, { x: 382, y: 500 }, { x: 270, y: 500 });
  assert.equal(await panel.count(), 0, 'Pages without headings have no outline to open');
});

test('cancelled and multi-touch gestures cannot open the outline or leave it stuck', async (t) => {
  const page = await pageFor(t, base + route, 390, { hasTouch: true, isMobile: true });
  const panel = page.locator('#site-outline-popover');
  for (const interruption of ['cancel', 'multi-touch']) {
    await page.evaluate(interruption => {
      const target = document.elementFromPoint(382, 500);
      const start = { identifier: 1, clientX: 382, clientY: 500 };
      const end = { ...start, clientX: 270 };
      const second = { identifier: 2, clientX: 340, clientY: 520 };
      function dispatch(type, touches, changedTouches) {
        const event = new Event(type, { bubbles: true, cancelable: true });
        Object.assign(event, { touches, changedTouches });
        target.dispatchEvent(event);
      }
      dispatch('touchstart', [start], [start]);
      if (interruption === 'cancel') {
        dispatch('touchmove', [end], [end]);
        dispatch('touchcancel', [], [end]);
      } else {
        dispatch('touchstart', [start, second], [second]);
        dispatch('touchmove', [end, second], [end]);
        dispatch('touchend', [end], [second]);
      }
      dispatch('touchend', [], [end]);
    }, interruption);
    assert.equal(await panel.isVisible(), false, interruption);
  }
  await swipeTouch(page, { x: 382, y: 500 }, { x: 270, y: 500 });
  await panel.waitFor({ state: 'visible' });
  await page.getByRole('button', { name: 'Close page outline', exact: true }).click();
  await panel.waitFor({ state: 'hidden' });
});

async function openBreadcrumbChooser(page, label) {
  const button = page.getByRole('navigation', { name: 'Breadcrumb', exact: true }).getByRole('button', { name: `Browse sections and documents in ${label}`, exact: true });
  const panel = page.locator(`[id="${await button.getAttribute('popovertarget')}"]`);
  await button.click();
  await panel.waitFor({ state: 'visible' });
  return { button, panel };
}

test('breadcrumb chevrons open nonmodal child selectors with keyboard navigation on desktop and mobile', async (t) => {
  for (const width of [1440, 390]) {
    const page = await pageFor(t, base + route, width);
    const before = await page.evaluate(() => ({ path: location.pathname, scroll: scrollY }));
    const { button, panel } = await openBreadcrumbChooser(page, 'Methodology v1.3');
    assert.equal(await button.getAttribute('aria-expanded'), 'true');
    assert.equal(await panel.getAttribute('popover'), 'auto');
    assert.equal(await page.getByRole('dialog').count(), 0);
    assert.equal(await panel.getByRole('heading', { name: 'Documents', exact: true }).count(), 1);
    assert.equal(await panel.getByRole('heading', { name: 'Sections', exact: true }).count(), 1);
    const branch = panel.locator('a[data-current-branch]');
    assert.equal(await branch.getAttribute('href'), '/ai/other/methodology-v1-3/usage/');
    assert.equal(await branch.evaluate(element => element === document.activeElement), true);
    assert.ok((await panel.locator('a').evaluateAll(links => links.map(link => link.pathname))).every(path => path.startsWith('/ai/other/methodology-v1-3/')));
    await page.keyboard.press('Home');
    const links = panel.locator('a');
    assert.equal(await links.first().evaluate(element => element === document.activeElement), true);
    assert.equal(await panel.evaluate(element => element.scrollTop), 0);
    const crumbBox = await page.locator('.breadcrumb').boundingBox();
    const popupBox = await panel.boundingBox();
    assert.ok(popupBox.y >= crumbBox.y + crumbBox.height, 'The selector leaves the whole breadcrumb trail visible');
    await screenshot(page, `breadcrumb-chooser-${width}-light`);
    await page.keyboard.press('ArrowDown');
    assert.equal(await links.nth(1).evaluate(element => element === document.activeElement), true);
    await page.keyboard.press('End');
    assert.equal(await links.last().evaluate(element => element === document.activeElement), true);
    const focused = await links.last().boundingBox();
    const bounds = await panel.boundingBox();
    assert.ok(focused.y >= bounds.y && focused.y + focused.height <= bounds.y + bounds.height + 1);
    assert.deepEqual(await page.evaluate(() => ({ path: location.pathname, scroll: scrollY })), before);
    await page.keyboard.press('Escape');
    await panel.waitFor({ state: 'hidden' });
    assert.equal(await button.getAttribute('aria-expanded'), 'false');
    assert.equal(await button.evaluate(element => element === document.activeElement), true);
    await button.press('ArrowDown');
    await panel.waitFor({ state: 'visible' });
    await panel.getByRole('link', { name: 'Usage', exact: true }).click();
    await page.waitForURL(url => url.pathname === '/ai/other/methodology-v1-3/usage/');
  }
});

test('breadcrumb selectors switch branches, dismiss outside, and preserve parent and document links', async (t) => {
  for (const width of [1440, 390]) {
    const page = await pageFor(t, base + route, width);
    const root = page.getByRole('navigation', { name: 'Breadcrumb', exact: true }).getByRole('button', { name: 'Browse top-level sections', exact: true });
    const rootPanel = page.locator(`[id="${await root.getAttribute('aria-controls')}"]`);
    await root.press('ArrowDown');
    await rootPanel.waitFor({ state: 'visible' });
    assert.deepEqual(await rootPanel.locator('.site-breadcrumb-chooser-group').allTextContents(), ['Sections']);
    const sections = await rootPanel.locator('a').evaluateAll(links => links.map(link => new URL(link.href).pathname));
    assert.ok(sections.length > 0 && sections.every(path => path.split('/').filter(Boolean).length === 1), 'The home chooser contains only top-level sections');
    assert.equal(await rootPanel.locator('a[data-current-branch]').getAttribute('href'), '/ai/');
    await screenshot(page, `breadcrumb-root-chooser-${width}`);
    const ai = await openBreadcrumbChooser(page, 'AI');
    assert.equal(await root.getAttribute('aria-expanded'), 'false');
    assert.equal(await rootPanel.isVisible(), false);
    const other = await openBreadcrumbChooser(page, 'Other');
    assert.equal(await page.locator('.site-breadcrumb-chooser:popover-open').count(), 1);
    assert.equal(await ai.button.getAttribute('aria-expanded'), 'false');
    assert.equal(await ai.panel.isVisible(), false);
    await page.mouse.click(width - 4, 896);
    await other.panel.waitFor({ state: 'hidden' });
    assert.equal(await other.button.getAttribute('aria-expanded'), 'false');
    const { panel } = await openBreadcrumbChooser(page, 'Usage');
    const current = panel.locator('a[aria-current="page"]');
    assert.equal(await current.getAttribute('href'), route);
    assert.equal(await current.evaluate(element => element === document.activeElement), true);
    const documentLink = panel.getByRole('link', { name: 'Developer Guide', exact: true });
    const destination = await documentLink.getAttribute('href');
    await documentLink.click();
    await page.waitForURL(url => url.pathname === destination);
    assert.equal(await page.locator('.section-nav a.site-sidebar-current-document').getAttribute('href'), destination);
    await page.getByRole('navigation', { name: 'Breadcrumb', exact: true }).getByRole('link', { name: 'Methodology v1.3', exact: true }).click();
    await page.waitForURL(url => url.pathname === '/ai/other/methodology-v1-3/');
    await root.click();
    await rootPanel.getByRole('link', { name: 'Engineering', exact: true }).click();
    await page.waitForURL(url => url.pathname === '/engineering/');
  }
});

test('breadcrumb scroll hints track available items without covering keyboard focus or changing list height', async (t) => {
  const page = await pageFor(t);
  const button = page.getByRole('button', { name: 'Browse top-level sections', exact: true });
  const rootPanel = page.locator(`[id="${await button.getAttribute('aria-controls')}"]`);
  for (const [width, height, scheme] of [[1440, 900, 'light'], [390, 480, 'light'], [820, 320, 'dark']]) {
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ colorScheme: scheme });
    const panel = height === 900 ? (await openBreadcrumbChooser(page, 'Usage')).panel : rootPanel;
    if (!(await panel.isVisible())) await button.click();
    await panel.waitFor({ state: 'visible' });
    await settleLayout(page);
    const dimensions = await panel.evaluate(element => ({ height: element.clientHeight, content: element.scrollHeight }));
    const maximum = dimensions.content - dimensions.height;
    assert.equal(maximum > 1, height < 900, 'Only lists with hidden items receive hints');
    for (const [position, name] of [[0, 'top'], [maximum / 2, 'middle'], [maximum, 'bottom']]) {
      await panel.evaluate((element, position) => { element.scrollTop = position; }, position);
      await page.waitForFunction(id => {
        const element = document.getElementById(id);
        return element.hasAttribute('data-scroll-up') === (element.scrollTop > 1) && element.hasAttribute('data-scroll-down') === (element.scrollHeight - element.clientHeight - element.scrollTop > 1);
      }, await panel.getAttribute('id'));
      const state = await panel.evaluate(element => ({
        up: getComputedStyle(element.querySelector('.site-breadcrumb-scroll-up')).visibility,
        down: getComputedStyle(element.querySelector('.site-breadcrumb-scroll-down')).visibility,
        height: element.clientHeight,
        content: element.scrollHeight,
        scrollbar: getComputedStyle(element).scrollbarWidth,
      }));
      assert.equal(state.up, maximum > 1 && position > 1 ? 'visible' : 'hidden');
      assert.equal(state.down, maximum > 1 && maximum - position > 1 ? 'visible' : 'hidden');
      assert.equal(state.height, dimensions.height, 'Hint changes keep the panel stable');
      assert.equal(state.content, dimensions.content, 'Hints do not create extra overflow');
      assert.equal(state.scrollbar, 'none');
      await screenshot(page, `breadcrumb-scroll-hints-${width}-${height}-${name}`);
    }
    await panel.locator('a').first().focus();
    for (const key of ['Home', 'End', 'ArrowUp', 'Home']) {
      await page.keyboard.press(key);
      assert.ok(await panel.evaluate(element => {
        const link = document.activeElement.getBoundingClientRect();
        const title = element.querySelector('.site-breadcrumb-chooser-title').getBoundingClientRect();
        const bounds = element.getBoundingClientRect();
        return link.top >= title.bottom && link.bottom <= bounds.bottom && [...element.querySelectorAll('.site-breadcrumb-scroll-hint')].every(hint => {
          const rect = hint.getBoundingClientRect();
          return getComputedStyle(hint).visibility !== 'visible' || link.bottom <= rect.top || link.top >= rect.bottom;
        });
      }), `${width}: keyboard focus stays clear of scroll hints`);
    }
    if (maximum > 1) {
      await panel.hover();
      await page.mouse.wheel(0, 160);
      await page.waitForFunction(id => document.getElementById(id).scrollTop > 1, await panel.getAttribute('id'));
    }
  }
});

test('breadcrumb selectors fit narrow and short screens and dismiss when static breadcrumbs scroll away', async (t) => {
  const page = await pageFor(t);
  const { panel } = await openBreadcrumbChooser(page, 'Methodology v1.3');
  for (const viewport of [{ width: 390, height: 900 }, { width: 820, height: 320 }]) {
    await page.setViewportSize(viewport);
    await page.waitForFunction(() => {
      const panel = document.querySelector('.site-breadcrumb-chooser:popover-open');
      const rect = panel?.getBoundingClientRect();
      return rect && rect.left >= 0 && rect.right <= innerWidth && rect.top >= 0 && rect.bottom <= innerHeight;
    });
    await panel.locator('a').first().focus();
    await page.keyboard.press('End');
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    const visible = await panel.evaluate(element => {
      const bounds = element.getBoundingClientRect();
      const title = element.querySelector('.site-breadcrumb-chooser-title').getBoundingClientRect();
      const focused = document.activeElement.getBoundingClientRect();
      return focused.top >= title.bottom && focused.bottom <= bounds.bottom + 1;
    });
    assert.ok(visible, 'Long selector lists keep keyboard focus visible on short screens');
  }
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.waitForFunction(() => document.documentElement.classList.contains('dark'));
  const text = await panel.evaluate(element => getComputedStyle(element).color.match(/[\d.]+/g).slice(0, 3).map(Number));
  assert.ok(text.every(channel => channel > 200));
  await screenshot(page, 'breadcrumb-chooser-short-dark');
  await page.context().addCookies([{ name: 'display-preferences', value: encodeURIComponent(JSON.stringify({ breadcrumbs: 'static' })), url: base }]);
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.reload({ waitUntil: 'networkidle' });
  const staticChooser = await openBreadcrumbChooser(page, 'Usage');
  await page.evaluate(() => window.scrollTo({ top: 1400, behavior: 'instant' }));
  await staticChooser.panel.waitFor({ state: 'hidden' });
  assert.equal(await staticChooser.button.getAttribute('aria-expanded'), 'false');
});

test('breadcrumb selectors fall back to ordinary links without JavaScript or the Popover API', async (t) => {
  const page = await pageFor(t);
  await page.context().addInitScript(() => { HTMLElement.prototype.showPopover = undefined; });
  await page.reload({ waitUntil: 'networkidle' });
  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb', exact: true });
  assert.equal(await breadcrumb.getByRole('button').count(), 0);
  assert.equal(await breadcrumb.getAttribute('data-choosers'), null);
  assert.equal(await page.locator('.site-breadcrumb-chooser:visible').count(), 0);
  await breadcrumb.getByRole('link', { name: 'Usage', exact: true }).click();
  await page.waitForURL(url => url.pathname === '/ai/other/methodology-v1-3/usage/');
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  t.after(() => context.close());
  const noScript = await context.newPage();
  assert.equal((await noScript.goto(base + route)).status(), 200);
  const noScriptTrail = noScript.getByRole('navigation', { name: 'Breadcrumb', exact: true });
  assert.equal(await noScriptTrail.getByRole('button').count(), 0);
  assert.equal(await noScript.locator('.site-breadcrumb-chooser:visible').count(), 0);
  await noScriptTrail.getByRole('link', { name: 'Usage', exact: true }).click();
  await noScript.waitForURL(url => url.pathname === '/ai/other/methodology-v1-3/usage/');
});

test('short and deeply nested breadcrumb trails wrap on mobile and navigate to their parents', async (t) => {
  const cases = [
    { pathname: '/system-design/', labels: ['System Design'], parents: ['/'] },
    { pathname: '/system-design/frameworks/framework-iv/', labels: ['System Design', 'Frameworks', 'Interviewing.io System Design Framework'], parents: ['/', '/system-design/', '/system-design/frameworks/'] },
    { pathname: '/system-design/integrated-test-pages/callouts/', labels: ['System Design', 'Migration Test Pages', 'Callouts'], parents: ['/', '/system-design/', '/system-design/integrated-test-pages/'] },
    { pathname: route, labels: ['AI', 'Other', 'Methodology v1.3', 'Usage', 'Overview and Adoption RFC'], parents: ['/', '/ai/', '/ai/other/', '/ai/other/methodology-v1-3/', '/ai/other/methodology-v1-3/usage/'] },
  ];
  for (const width of [1440, 390]) {
    const page = await pageFor(t, base + cases[0].pathname, width);
    for (const { pathname, labels, parents } of cases) {
      await page.goto(base + pathname, { waitUntil: 'networkidle' });
      const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb', exact: true });
      assert.deepEqual(await breadcrumb.locator('li').allTextContents(), labels);
      const home = breadcrumb.getByRole('link', { name: 'Home', exact: true });
      assert.equal((await home.innerText()).trim(), '');
      assert.equal(await home.locator('svg').count(), 1);
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

test('section overviews share the reading width and expose their generated outline on every layout', async (t) => {
  for (const width of [390, 768, 1440]) {
    for (const pathname of ['/engineering/architecture/', '/engineering/', '/ai/design-research/']) {
      const page = await pageFor(t, base + pathname, width);
      for (const size of ['standard', 'larger']) {
        await page.evaluate(size => document.documentElement.dataset.textSize = size, size);
        await settleLayout(page);
        const geometry = await page.locator('.section-overview').evaluate(overview => {
          const bounds = overview.getBoundingClientRect();
          return {
            width: bounds.width,
            limit: parseFloat(getComputedStyle(overview).maxInlineSize),
            children: [...overview.children].map(element => {
              const rect = element.getBoundingClientRect();
              return { left: rect.left - bounds.left, right: rect.right - bounds.right };
            }),
            pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          };
        });
        assert.ok(geometry.width <= geometry.limit + 1, `${pathname}: reading width`);
        assert.ok(geometry.children.every(rect => Math.abs(rect.left) < 1 && Math.abs(rect.right) < 1), `${pathname}: introduction and browse groups align`);
        assert.ok(geometry.pageOverflow <= 1, `${pathname}: no page overflow`);
      }
      const desktop = page.locator('#page-outline #TableOfContents');
      const compact = page.locator('#mobileTableOfContents');
      const headings = await desktop.locator('a').evaluateAll(links => links.map(link => ({ hash: link.hash, title: link.textContent })));
      assert.ok(headings.some(heading => heading.hash === '#section-index-title'));
      assert.deepEqual(await compact.locator('a').evaluateAll(links => links.map(link => ({ hash: link.hash, title: link.textContent }))), headings);
      assert.ok(await desktop.locator('a').evaluateAll(links => links.every(link => document.getElementById(decodeURIComponent(link.hash.slice(1))))));
      if (width === 390) {
        await page.locator('.site-outline-trigger').click();
        await compact.locator('a[href="#section-index-title"]').click();
        assert.equal(await page.locator('#site-outline-popover').isVisible(), false);
        assert.equal(new URL(page.url()).hash, '#section-index-title');
      }
      await screenshot(page, `overview-${pathname.split('/').filter(Boolean).join('-')}-${width}`);
    }
  }
});

test('overview outline links reveal nested browse headings and skip collapsed headings while scrolling', async (t) => {
  const page = await pageFor(t, base + '/engineering/');
  const nested = page.locator('.section-map-disclosure:not([open]) .section-map-heading').first();
  const id = await nested.getAttribute('id');
  assert.ok(id);
  assert.equal(await nested.isVisible(), false);
  await page.locator(`#page-outline a[href="#${id}"]`).click();
  await page.waitForFunction(id => document.getElementById(id).getClientRects().length > 0, id);
  await page.waitForFunction(id => document.querySelector('#page-outline [aria-current="location"]')?.hash === `#${id}`, id);
  const destination = await page.locator(`[id="${id}"]`).boundingBox();
  assert.ok(destination.y >= 56 && destination.y < 900, 'Nested destination clears the header');
  await page.evaluate(id => document.getElementById(id).closest('details').open = false, id);
  await page.evaluate(() => { history.replaceState(null, '', location.pathname); window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }); });
  await page.waitForFunction(() => {
    const active = document.querySelector('#page-outline [aria-current="location"]');
    return active && document.getElementById(decodeURIComponent(active.hash.slice(1))).getClientRects().length > 0;
  });
  await page.goto(`${base}/engineering/#${id}`, { waitUntil: 'networkidle' });
  assert.equal(await page.locator(`[id="${id}"]`).isVisible(), true, 'Direct nested links reveal their group');
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
