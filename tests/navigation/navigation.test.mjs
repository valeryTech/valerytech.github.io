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

async function screenshot(page, name) {
  if (screenshots) await page.screenshot({ path: path.join(screenshots, `${name}.png`) });
}

async function readAt(page, id) {
  await page.locator(`[id="${id}"]`).evaluate((heading) => {
    window.scrollTo({ top: heading.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.35 + 8, behavior: 'instant' });
  });
  await page.waitForFunction((id) => document.querySelector('.hextra-toc a[aria-current="location"]')?.hash === `#${id}`, id);
}

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
