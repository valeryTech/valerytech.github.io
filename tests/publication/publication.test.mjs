// Checks that the production build publishes reading material only: no internal
// fixtures, no empty collections, and no navigation link to a missing page.
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../../public/', import.meta.url));
const read = (file) => readFileSync(path.join(output, file), 'utf8');
const html = (route) => read(path.join(route, 'index.html'));

// Paths that must never reach production. Migration test pages stay in the
// preview and in `npm run build:fixtures`.
const internal = ['/system-design/integrated-test-pages/'];
// Collections removed until they have content; add them back here when they do.
const retired = ['/blog/', '/topics/'];

const files = (directory) => readdirSync(directory).flatMap((name) => {
  const file = path.join(directory, name);
  return statSync(file).isDirectory() ? files(file) : [file];
});

const hrefs = (markup) => [...markup.matchAll(/\bhref=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
  .map((match) => match[1] ?? match[2] ?? match[3]);

const block = (markup, pattern) => markup.match(pattern)?.[0] ?? '';

const resolves = (pathname) => {
  const local = decodeURIComponent(pathname.split(/[?#]/)[0]);
  const file = path.join(output, local);
  return local.endsWith('/') ? existsSync(path.join(file, 'index.html')) : existsSync(file) || existsSync(path.join(file, 'index.html'));
};

// The header sections, More collections, mobile drawer and footer on a sample of page types.
const navigationLinks = () => {
  const links = new Set();
  for (const route of ['', 'ai', 'system-design', 'projects', 'about']) {
    const document = html(route);
    const regions = [
      block(document, /<div class=(?:"site-header-links"|site-header-links)[\s\S]*?<\/div>/),
      block(document, /<nav id=(?:"site-more-collections"|site-more-collections)[\s\S]*?<\/nav>/),
      block(document, /<nav class=(?:"mobile-site-nav[^"]*"|mobile-site-nav)[\s\S]*?<\/nav>/),
      block(document, /<footer\b[\s\S]*?<\/footer>/),
    ];
    for (const href of regions.flatMap(hrefs)) {
      if (href.startsWith('/') && !href.startsWith('//')) links.add(href);
    }
  }
  return [...links];
};

test('internal fixtures and retired collections are not rendered', () => {
  for (const pathname of [...internal, ...retired]) {
    const directory = path.join(output, pathname);
    const rendered = existsSync(directory) ? files(directory).map((file) => path.relative(output, file)) : [];
    assert.deepEqual(rendered, [], `${pathname} should not be published`);
  }
});

test('internal fixtures and retired collections are absent from sitemaps, search, maps and navigation', () => {
  const published = files(output)
    .filter((file) => /\.(?:html|xml|json|txt|md)$/.test(file))
    .map((file) => path.relative(output, file));
  for (const pathname of [...internal, ...retired]) {
    const mentions = published.filter((file) => {
      const text = read(file);
      return text.includes(`"${pathname}`) || text.includes(`=${pathname}`) || text.includes(`(${pathname}`) || text.includes(`https://valery.tech${pathname}`) || text.includes(`<loc>${pathname}`);
    });
    assert.deepEqual(mentions, [], `${pathname} is still linked`);
  }
});

test('every header, More collections, drawer and footer link opens a published page', () => {
  const links = navigationLinks();
  assert.ok(links.length > 10, 'The navigation sample should find the site links');
  assert.deepEqual(links.filter((href) => !resolves(href)), []);
});

test('every collection in the navigation has something to read', () => {
  // Sections publish an RSS feed; single pages such as /about/ do not.
  const collections = navigationLinks().filter((href) => /^\/[^/]+\/$/.test(href) && existsSync(path.join(output, href, 'index.xml')));
  assert.ok(collections.length >= 5, 'The navigation sample should find the collections');
  for (const href of collections) {
    const main = block(html(href), /<main\b[\s\S]*?<\/main>/);
    const children = hrefs(main).filter((link) => link.startsWith(href) && link !== href);
    const text = main.replace(/<script\b[\s\S]*?<\/script>|<style\b[\s\S]*?<\/style>|<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    assert.ok(children.length > 0 || text.length > 400, `${href} renders without notes or an introduction`);
  }
});
