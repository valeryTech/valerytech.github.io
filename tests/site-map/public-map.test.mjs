import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const output = path.join(root, 'public');
const normalize = (route) => decodeURIComponent(route).replace(/\/$/, '') || '/';
const origin = 'https://valery.tech';
const extractLinks = (document) => [...document.matchAll(/\bhref=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
  .map((match) => new URL((match[1] ?? match[2] ?? match[3]).replaceAll('&amp;', '&'), origin));
const extractMarkdownLinks = (document) => [...document.matchAll(/\]\(([^)]+)\)/g)].map((match) => new URL(match[1], origin));
const mainContent = (document) => document.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];

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
  const pending = ['/agent-map/'];
  while (pending.length) {
    const route = pending.shift();
    if (documents.has(route)) continue;
    const document = mainContent(readFileSync(outputFile(route), 'utf8'));
    assert.ok(document, `HTML map must have readable main content: ${route}`);
    documents.set(route, document);
    for (const link of extractLinks(document)) {
      if (link.pathname.startsWith('/agent-map/') && !documents.has(link.pathname)) pending.push(link.pathname);
    }
  }
  return documents;
}

const maps = discoverMaps();
const main = maps.get('/agent-map/');
const links = [...maps.values()].flatMap(extractLinks);
const mappedPaths = new Set(links.map((link) => normalize(link.pathname)));

test('the main map stays short and links to section maps and selected documents', () => {
  assert.match(main, /<h1\b[^>]*>[^<]+website map for agents<\/h1>/);
  assert.ok(Buffer.byteLength(main) < 6000, 'Main map should remain a short discovery index');
  assert.ok(extractLinks(main).length < 40, 'Main map should not become a full article inventory');
  assert.match(main, /<h2\b[^>]*>Main documents<\/h2>/);
  assert.match(main, /\/ai-engineering\/working-assumptions\//);
  for (const section of ['ai', 'ai-engineering', 'engineering', 'system-design', 'projects']) {
    assert.ok(extractLinks(main).some((link) => link.pathname === `/agent-map/${section}/`));
  }
});

test('only the main index and five merged collection maps are generated', () => {
  const expected = ['/agent-map/', '/agent-map/ai/', '/agent-map/ai-engineering/', '/agent-map/engineering/', '/agent-map/system-design/', '/agent-map/projects/'];
  assert.deepEqual([...maps.keys()].sort(), expected.sort());
  const ai = extractLinks(maps.get('/agent-map/ai/'));
  assert.ok(ai.some((link) => link.pathname === '/ai/discovery/analysis-or-operation-model/'));
  assert.ok(ai.some((link) => link.pathname === '/ai/other/methodology-v1-3/usage/rfc-v1-4/'));
  assert.ok(!ai.some((link) => link.pathname === '/agent-map/ai/discovery/'));
  assert.ok(!ai.some((link) => link.pathname.startsWith('/system-design/')));
  for (const [route, document] of maps) {
    if (route === '/agent-map/') continue;
    assert.ok(extractLinks(document).some((link) => link.pathname === '/agent-map/'), `Missing main map link: ${route}`);
  }
  assert.ok(!extractLinks(main).some((link) => link.pathname === '/blog/example-post/'));
  assert.ok(!extractLinks(main).some((link) => link.pathname === '/404.html'));
  assert.doesNotMatch(main, /Example Post|Page not found/);
  assert.ok(extractLinks(main).some((link) => link.pathname === '/topics/'));
});

test('following the maps covers published material, including aliases, with explicit utility and template exclusions', () => {
  for (const document of maps.values()) assert.doesNotMatch(document, /\{\{/);
  for (const filename of files(output).filter((filename) => filename.endsWith('.html'))) {
    let route = `/${path.relative(output, filename).split(path.sep).join('/')}`;
    route = route.replace(/\/index\.html$/, '/');
    // Pagination repeats a collection already in the maps.
    if (/\/page\/\d+\/$/.test(route)) continue;
    if (['/404.html', '/blog/example-post/'].includes(route)) continue;
    assert.ok(mappedPaths.has(normalize(route)), `Missing website route: ${route}`);
  }
  const generated = files(path.join(output, 'agent-map')).filter((filename) => filename.endsWith('.html'));
  assert.equal(maps.size, generated.length, 'Every generated map must be reachable from the main map');
});

test('maps distinguish preferred entry points, published drafts, and archived history without guessing from version names', () => {
  const systemDesign = maps.get('/agent-map/system-design/');
  assert.match(systemDesign, /href=["']?\/system-design\/system-design\/["']?>[^<]+<\/a> <strong>\[Canonical\]<\/strong>/);
  assert.match(systemDesign, /href=["']?\/system-design\/archive\/study-plan-v0\/["']?>[^<]+<\/a> <strong>\[Archived\]<\/strong>/);
  const engineering = maps.get('/agent-map/engineering/');
  assert.match(engineering, /href=["']?\/engineering\/architecture\/architecture\/["']?>[^<]+<\/a> <strong>\[Draft\]<\/strong>/);
  const versioned = maps.get('/agent-map/ai-engineering/').match(/<li><a href=["']?\/ai-engineering\/evaluation\/v1\/guide\/["']?>[\s\S]*?<\/li>/)?.[0];
  assert.ok(versioned, 'Versioned documents remain discoverable');
  assert.doesNotMatch(versioned, /\[(Canonical|Archived|Draft)\]/);
});

test('migrated documents have curated descriptions, including honest descriptions for placeholders', () => {
  const engineering = maps.get('/agent-map/engineering/');
  assert.match(engineering, /Compare DRY, WET, and AHA to decide when duplication is acceptable/);
  assert.match(engineering, /An empty placeholder for SQL notes; no technical guidance has been written yet/);
  for (const collection of ['ai', 'ai-engineering', 'engineering', 'system-design', 'projects']) {
    const articles = files(path.join(root, 'content', collection)).filter((filename) => filename.endsWith('.md') && path.basename(filename) !== '_index.md');
    assert.ok(articles.length > 0, `No articles found in ${collection}`);
    for (const filename of articles) {
      const description = readFileSync(filename, 'utf8').match(/^description: "(.+)"$/m)?.[1];
      assert.ok(description?.trim() && description !== 'Default Description', `Missing curated description: ${filename}`);
      assert.ok(description.length <= 250, `Description should fit the map: ${filename}`);
    }
  }
});

test('Hugo renders the assembled Markdown and retains the text download URLs', () => {
  for (const [route, document] of maps) {
    const section = route.slice('/agent-map/'.length).replace(/\/$/, '');
    const prefix = section ? `/${section}` : '';
    const markdown = readFileSync(outputFile(`${prefix}/site-map.md`), 'utf8');
    const source = readFileSync(path.join(root, 'content/agent-map', section ? `${section}.md` : '_index.md'), 'utf8');
    assert.ok(source.endsWith(markdown), `Markdown input is stale: ${route}`);
    assert.equal(markdown, readFileSync(outputFile(`${prefix}/llms.txt`), 'utf8'));
    assert.deepEqual(extractLinks(document).map((link) => link.pathname), extractMarkdownLinks(markdown).map((link) => link.pathname), `HTML should preserve all Markdown navigation links: ${route}`);
    assert.doesNotMatch(document, /^# |\]\(\//m, `Map must be rendered HTML: ${route}`);
  }
  assert.match(maps.get('/agent-map/system-design/'), /Design questions and study references for specifying visibility after writes/);
});

test('all map links lead to published website output and expose no repository navigation', () => {
  assert.ok(links.length > 0);
  for (const link of links) {
    assert.equal(link.origin, origin, `Unexpected external navigation link: ${link}`);
    assert.ok(statSync(outputFile(link.pathname)).isFile(), `Missing destination: ${link}`);
  }
  for (const document of maps.values()) assert.doesNotMatch(document, /\/Users\/|SOURCE_NOTES|\.\.\/content\/|file:\/\//);
});

test('pages expose the main map in the footer and their collection map in metadata', () => {
  const pages = [
    ['index.html', '/agent-map/'],
    ['ai-engineering/working-assumptions/index.html', '/agent-map/ai-engineering/'],
    ['system-design/nfr/consistency/index.html', '/agent-map/system-design/'],
    ['blog/example-post/index.html', '/agent-map/'],
    ['agent-map/ai/index.html', '/agent-map/ai/']
  ];
  for (const [relative, mapRoute] of pages) {
    const html = readFileSync(path.join(output, relative), 'utf8');
    const footer = html.match(/<footer\b[\s\S]*?<\/footer>/)?.[0];
    assert.ok(footer?.includes('/agent-map/'), `Main map missing from footer: ${relative}`);
    assert.ok(footer?.includes('Agent map'), `Footer label missing: ${relative}`);
    const mapLinks = html.match(/<link\b[^>]*>/g) || [];
    assert.ok(mapLinks.some((link) => /rel=["']?sitemap["']?[\s>]/.test(link) && /type=["']?text\/html["']?[\s>]/.test(link) && extractLinks(link)[0]?.pathname === mapRoute), `HTML collection map missing from metadata: ${relative}`);
  }
});
