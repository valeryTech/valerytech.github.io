import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { buildRedirects, routeFile } from '../../scripts/redirects.mjs';

function fixture(t, mappings = {}) {
  const root = mkdtempSync(path.join(tmpdir(), 'redirect-regression-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const name of ['content', 'data', 'public/new', 'scripts']) mkdirSync(path.join(root, name), { recursive: true });
  writeFileSync(path.join(root, 'hugo.toml'), 'baseURL = "https://valery.tech/"\ntitle = "Fixture"\n');
  writeFileSync(path.join(root, 'content/new.md'), '---\ntitle: Current note\n---\nCurrent content.\n');
  writeFileSync(path.join(root, 'public/new/index.html'), '<h1>Current note</h1>');
  writeFileSync(path.join(root, 'data/url-history.json'), JSON.stringify({ version: 1, routes: { '/old': { title: 'Retired note', source: 'content/old.md' } } }));
  writeFileSync(path.join(root, 'data/redirects.json'), JSON.stringify({ version: 1, redirects: mappings }));
  writeFileSync(path.join(root, 'scripts/redirect-page.html'), readFileSync(new URL('../../scripts/redirect-page.html', import.meta.url)));
  return { root, publicDir: path.join(root, 'public') };
}

test('a removed published page fails with its title, source and a mapping stub', (t) => {
  const options = fixture(t);
  assert.throws(() => buildRedirects(options), /\/old\/ — Retired note \(content\/old.md\)/);
  const report = JSON.parse(readFileSync(path.join(options.root, '.generated/redirect-report.json'), 'utf8'));
  assert.deepEqual(report.missing['/old/'].to, []);
  assert.match(report.missing['/old/'].comment, /Retired note/);
});

test('generation preserves the retired address and check mode detects a stale explanation', (t) => {
  const options = fixture(t, { '/old/': { to: ['/new/'], comment: 'The article moved.' } });
  buildRedirects(options);
  const output = routeFile(path.join(options.root, '.generated/redirects'), '/old');
  assert.match(readFileSync(output, 'utf8'), /url=\/new\//);
  buildRedirects({ ...options, check: true });
  writeFileSync(path.join(options.root, 'data/redirects.json'), JSON.stringify({ version: 1, redirects: { '/old/': { to: ['/new/'], comment: 'A revised explanation.' } } }));
  assert.throws(() => buildRedirects({ ...options, check: true }), /redirect pages are stale/);
});

test('stale generated output cannot conceal a missing mapping', (t) => {
  const options = fixture(t);
  mkdirSync(path.join(options.publicDir, 'old'));
  writeFileSync(path.join(options.publicDir, 'old/index.html'), '<html data-legacy-redirect>Stale output</html>');
  assert.throws(() => buildRedirects(options), /formerly published URLs need mappings/);
});

test('an internal link to a never-published missing address also fails with its source', (t) => {
  const options = fixture(t, { '/old/': { to: ['/new/'], comment: 'The article moved.' } });
  writeFileSync(path.join(options.publicDir, 'new/index.html'), '<a href="/missing/">Broken link</a>');
  assert.throws(() => buildRedirects(options), /\/missing linked from \/new\//);
});

test('deleting a destination fails even when a stale redirect page still exists', (t) => {
  const options = fixture(t, { '/old/': { to: ['/new/'], comment: 'The article moved.' } });
  buildRedirects(options);
  rmSync(path.join(options.root, 'content/new.md'));
  assert.throws(() => buildRedirects(options), /destination \/new\/ is not a current published page/);
});
