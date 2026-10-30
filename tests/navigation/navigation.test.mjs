import assert from 'node:assert/strict';
import { before, after, test } from 'node:test';
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import path from 'node:path';

const { chromium } = createRequire(import.meta.url)('playwright-core');
const base = process.env.BASE_URL || 'http://localhost:1313';
const reference = process.env.REFERENCE_URL;
const screenshots = process.env.SCREENSHOT_DIR;
const route = '/ai/other/methodology-v1-3/usage/rfc-v1-4/';
const framework = '/system-design/frameworks/framework-iv/';
let browser;

before(async () => {
  const channel = process.env.BROWSER_CHANNEL || 'chrome';
  browser = await chromium.launch({
    channel: channel === 'chromium' ? undefined : channel,
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

test('the page outline includes H1–H4 and retains real nested lists', async (t) => {
  const page = await pageFor(t, base + framework);
  const structure = await page.evaluate(() => ({
    headingIds: [...document.querySelectorAll('.article-content h1[id], .article-content h2[id], .article-content h3[id], .article-content h4[id]')].map((heading) => heading.id),
    outlineIds: [...document.querySelectorAll('.hextra-toc a[href^="#"]')].map((link) => decodeURIComponent(link.hash.slice(1))),
    nested: document.querySelectorAll('.hextra-toc li > ul').length,
  }));
  assert.deepEqual(structure.outlineIds, structure.headingIds);
  assert.ok(structure.nested >= 4);
  await screenshot(page, 'hextra-outline');
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

test('the local outline preserves the deployed outline targets and hierarchy', { skip: !reference }, async (t) => {
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
    assert.deepEqual(await structure(local, '.hextra-toc'), await structure(deployed, '.docs-toc'));
    await screenshot(local, `hextra-comparison-${index}`);
    await screenshot(deployed, `deployed-comparison-${index}`);
  }
});
