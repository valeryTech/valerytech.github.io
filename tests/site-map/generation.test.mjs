import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repository = fileURLToPath(new URL('../../', import.meta.url));

test('map generation bootstraps clean checkouts and refreshes links after a page is removed', (t) => {
  const root = mkdtempSync(path.join(tmpdir(), 'site-map-generation-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const directory of ['content/ai', 'layouts', 'data', 'scripts']) {
    mkdirSync(path.join(root, directory), { recursive: true });
  }
  for (const script of ['site-map.mjs', 'redirects.mjs', 'redirect-page.html']) {
    copyFileSync(path.join(repository, 'scripts', script), path.join(root, 'scripts', script));
  }
  writeFileSync(path.join(root, 'hugo.toml'), `
baseURL = "https://valery.tech/"
title = "Fixture"
disableKinds = ["taxonomy", "term"]
[outputs]
home = ["HTML", "agentMap"]
section = ["HTML", "agentMap"]
[outputFormats.agentMap]
mediaType = "text/markdown"
baseName = "site-map"
isPlainText = true
`);
  writeFileSync(path.join(root, 'content/_index.md'), '---\ntitle: Fixture\n---\n');
  writeFileSync(path.join(root, 'content/ai/_index.md'), '---\ntitle: AI\n---\n');
  writeFileSync(path.join(root, 'content/ai/current.md'), '---\ntitle: Current\n---\nCurrent content.\n');
  for (const layout of ['home.html', 'section.html', 'single.html', 'agent-map.html']) {
    writeFileSync(path.join(root, 'layouts', layout), '<a href="/agent-map/">Main map</a>{{ .Content }}');
  }
  writeFileSync(path.join(root, 'layouts/home.agentmap.md'), '# Fixture map\n\n[AI map](/agent-map/ai/)\n');
  writeFileSync(path.join(root, 'layouts/section.agentmap.md'), '# {{ .Title }}\n\n{{ range .RegularPages }}[{{ .Title }}]({{ .RelPermalink }})\n{{ end }}');
  writeFileSync(path.join(root, 'data/url-history.json'), JSON.stringify({ version: 1, routes: {} }));
  writeFileSync(path.join(root, 'data/redirects.json'), JSON.stringify({ version: 1, redirects: {} }));
  writeFileSync(path.join(root, 'data/redirect-traffic.json'), JSON.stringify({ version: 1, sources: {}, routes: {} }));

  const generate = (...args) => execFileSync(process.execPath, ['scripts/site-map.mjs', ...args], { cwd: root, encoding: 'utf8' });
  generate();
  const collectionMap = path.join(root, 'content/agent-map/ai.md');
  assert.match(readFileSync(collectionMap, 'utf8'), /\[Current\]\(\/ai\/current\/\)/);

  rmSync(path.join(root, 'content/ai/current.md'));
  writeFileSync(path.join(root, 'content/ai/replacement.md'), '---\ntitle: Replacement\n---\nReplacement content.\n');
  generate();
  const updated = readFileSync(collectionMap, 'utf8');
  assert.match(updated, /\[Replacement\]\(\/ai\/replacement\/\)/);
  assert.doesNotMatch(updated, /\/ai\/current\//);
  assert.match(generate('--check'), /Markdown map sources are up to date/);
});
