import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { normalizeRoute, routeFile } from '../../scripts/redirects.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const output = path.join(root, 'public');
const mappings = JSON.parse(readFileSync(path.join(root, 'data/redirects.json'), 'utf8')).redirects;
const history = JSON.parse(readFileSync(path.join(root, 'data/url-history.json'), 'utf8'));

test('every mapped old URL has its physical HTML page and all choices exist', () => {
  for (const [from, entry] of Object.entries(mappings)) {
    const html = readFileSync(routeFile(output, from), 'utf8');
    assert.match(html, /<html[^>]+data-legacy-redirect/);
    assert.match(html, /noindex, follow/);
    if (entry.to.length === 1) assert.match(html, /http-equiv=(["']?)refresh\1/);
    else assert.doesNotMatch(html, /http-equiv=(["']?)refresh\1|location.replace/);
    for (const target of entry.to) {
      const destination = readFileSync(routeFile(output, target), 'utf8');
      assert.doesNotMatch(destination, /data-legacy-redirect/, `${from} points to another redirect`);
      assert.doesNotMatch(destination, /http-equiv=(["']?)refresh\1/, `${from} points to a Hugo alias`);
    }
  }
});

test('the final production artifact preserves every recorded published address', () => {
  for (const route of Object.keys(history.routes)) assert.ok(existsSync(routeFile(output, route)), `Retired URL has no output: ${route}`);
  const index = JSON.parse(readFileSync(path.join(output, 'search-index.json'), 'utf8'));
  const retired = new Set(Object.keys(mappings).map(normalizeRoute));
  assert.ok(index.every((entry) => !retired.has(normalizeRoute(entry.permalink))), 'Legacy utility pages must stay out of search results');
});
