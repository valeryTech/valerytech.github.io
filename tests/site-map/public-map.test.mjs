import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const output = path.join(root, 'public');
const document = readFileSync(path.join(output, 'site-map.md'), 'utf8');
const links = [...document.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((match) => new URL(match[1]));
const normalize = (route) => decodeURIComponent(route).replace(/\/$/, '') || '/';
const mappedPaths = new Set(links.map((link) => normalize(link.pathname)));

function htmlFiles(directory) {
  return readdirSync(directory).flatMap((name) => {
    const filename = path.join(directory, name);
    if (statSync(filename).isDirectory()) return htmlFiles(filename);
    return filename.endsWith('.html') ? [filename] : [];
  });
}

test('the public Markdown map covers the built website, including aliases and generated pages', () => {
  assert.match(document, /^# .+website map for agents/);
  assert.doesNotMatch(document, /\{\{/);
  for (const filename of htmlFiles(output)) {
    let route = `/${path.relative(output, filename).split(path.sep).join('/')}`;
    route = route.replace(/\/index\.html$/, '/');
    // Pagination repeats a collection already in the map.
    if (/\/page\/\d+\/$/.test(route)) continue;
    assert.ok(mappedPaths.has(normalize(route)), `Missing website route: ${route}`);
  }
});

test('map links lead to published website output and expose no repository navigation', () => {
  assert.ok(links.length > 0);
  const origin = links[0].origin;
  for (const link of links) {
    assert.equal(link.origin, origin, `Unexpected external navigation link: ${link}`);
    const route = decodeURIComponent(link.pathname);
    const relative = route.replace(/^\//, '');
    const filename = path.join(output, /\.[^/]+$/.test(route) ? relative : `${relative}/index.html`);
    assert.ok(statSync(filename).isFile(), `Missing destination: ${link}`);
  }
  assert.doesNotMatch(document, /\/Users\/|SOURCE_NOTES|\.\.\/content\/|file:\/\//);
});

test('the homepage and articles expose the map in the footer and page metadata', () => {
  for (const relative of ['index.html', 'ai-engineering/working-assumptions/index.html']) {
    const html = readFileSync(path.join(output, relative), 'utf8');
    const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
    assert.ok(footer?.includes('/site-map.md'), `Map missing from footer: ${relative}`);
    assert.ok(footer?.includes('Agent map (Markdown)'), `Footer label missing: ${relative}`);
    assert.match(html, /<link\b[^>]*type=["']?text\/markdown["']?[^>]*>/);
    assert.ok(html.match(/<head\b[\s\S]*?<\/head>/)?.[0].includes('/site-map.md'));
  }
});
