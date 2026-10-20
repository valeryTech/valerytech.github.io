import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const output = path.join(root, 'public');
const normalize = (route) => decodeURIComponent(route).replace(/\/$/, '') || '/';
const extractLinks = (document) => [...document.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((match) => new URL(match[1]));

function outputFile(route) {
  const relative = decodeURIComponent(route).replace(/^\//, '');
  return path.join(output, /\.[^/]+$/.test(route) ? relative : `${relative}/index.html`);
}

function files(directory) {
  return readdirSync(directory).flatMap((name) => {
    const filename = path.join(directory, name);
    return statSync(filename).isDirectory() ? files(filename) : [filename];
  });
}

// Discover maps exactly as a reader would: follow links from the main map.
function discoverMaps() {
  const documents = new Map();
  const pending = ['/llms.txt'];
  while (pending.length) {
    const route = pending.shift();
    if (documents.has(route)) continue;
    const document = readFileSync(outputFile(route), 'utf8');
    documents.set(route, document);
    for (const link of extractLinks(document)) {
      if (link.pathname.endsWith('/llms.txt') && !documents.has(link.pathname)) pending.push(link.pathname);
    }
  }
  return documents;
}

const maps = discoverMaps();
const main = maps.get('/llms.txt');
const links = [...maps.values()].flatMap(extractLinks);
const mappedPaths = new Set(links.map((link) => normalize(link.pathname)));

test('the main map stays short and links to section maps and selected documents', () => {
  assert.match(main, /^# .+website map for agents/);
  assert.ok(Buffer.byteLength(main) < 6000, 'Main map should remain a short discovery index');
  assert.ok(extractLinks(main).length < 40, 'Main map should not become a full article inventory');
  assert.match(main, /## Main documents/);
  assert.match(main, /\/ai-engineering\/working-assumptions\//);
  for (const section of ['ai', 'ai-engineering', 'engineering', 'system-design', 'projects']) {
    assert.ok(extractLinks(main).some((link) => link.pathname === `/${section}/llms.txt`));
  }
});

test('only the main index and five merged collection maps are generated', () => {
  const expected = ['/llms.txt', '/ai/llms.txt', '/ai-engineering/llms.txt', '/engineering/llms.txt', '/system-design/llms.txt', '/projects/llms.txt'];
  assert.deepEqual([...maps.keys()].sort(), expected.sort());
  const ai = extractLinks(maps.get('/ai/llms.txt'));
  assert.ok(ai.some((link) => link.pathname === '/ai/discovery/analysis-or-operation-model/'));
  assert.ok(ai.some((link) => link.pathname === '/ai/methodology-v1-3/usage/rfc-v1-4/'));
  assert.ok(!ai.some((link) => link.pathname === '/ai/discovery/llms.txt'));
  assert.ok(!ai.some((link) => link.pathname.startsWith('/system-design/')));
  for (const [route, document] of maps) {
    if (route === '/llms.txt') continue;
    assert.ok(extractLinks(document).some((link) => link.pathname === '/llms.txt'), `Missing main map link: ${route}`);
  }
  assert.ok(extractLinks(main).some((link) => link.pathname === '/blog/example-post/'));
  assert.ok(extractLinks(main).some((link) => link.pathname === '/topics/'));
});

test('following the maps covers the complete built website, including aliases and generated pages', () => {
  for (const document of maps.values()) assert.doesNotMatch(document, /\{\{/);
  for (const filename of files(output).filter((filename) => filename.endsWith('.html'))) {
    let route = `/${path.relative(output, filename).split(path.sep).join('/')}`;
    route = route.replace(/\/index\.html$/, '/');
    // Pagination repeats a collection already in the maps.
    if (/\/page\/\d+\/$/.test(route)) continue;
    assert.ok(mappedPaths.has(normalize(route)), `Missing website route: ${route}`);
  }
  const generated = files(output).filter((filename) => path.basename(filename) === 'llms.txt');
  assert.equal(maps.size, generated.length, 'Every generated map must be reachable from the main map');
});

test('every plain-text map has an identical Markdown version', () => {
  for (const [route, document] of maps) {
    assert.equal(document, readFileSync(outputFile(route.replace(/llms\.txt$/, 'site-map.md')), 'utf8'));
  }
});

test('all map links lead to published website output and expose no repository navigation', () => {
  assert.ok(links.length > 0);
  const origin = links[0].origin;
  for (const link of links) {
    assert.equal(link.origin, origin, `Unexpected external navigation link: ${link}`);
    assert.ok(statSync(outputFile(link.pathname)).isFile(), `Missing destination: ${link}`);
  }
  for (const document of maps.values()) assert.doesNotMatch(document, /\/Users\/|SOURCE_NOTES|\.\.\/content\/|file:\/\//);
});

test('pages expose the main map in the footer and their collection map in metadata', () => {
  const pages = [
    ['index.html', '/llms.txt'],
    ['ai-engineering/working-assumptions/index.html', '/ai-engineering/llms.txt'],
    ['system-design/nfr/consistency/index.html', '/system-design/llms.txt'],
    ['blog/example-post/index.html', '/llms.txt']
  ];
  for (const [relative, mapRoute] of pages) {
    const html = readFileSync(path.join(output, relative), 'utf8');
    const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
    assert.ok(footer?.includes('/llms.txt'), `Main map missing from footer: ${relative}`);
    assert.ok(footer?.includes('Agent map'), `Footer label missing: ${relative}`);
    const alternates = html.match(/<link\b[^>]*type=["']?text\/plain["']?[^>]*>/g) || [];
    assert.ok(alternates.some((link) => link.includes(mapRoute)), `Section map missing from metadata: ${relative}`);
  }
});
