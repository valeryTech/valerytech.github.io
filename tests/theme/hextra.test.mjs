import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const output = fileURLToPath(new URL('../../public/', import.meta.url));
const html = (route) => readFileSync(path.join(output, route, 'index.html'), 'utf8');
const attr = (name, value) => new RegExp(`${name}=(?:"${value}"|'${value}'|${value}(?=[\\s>]))`);

test('Hextra renders one main landmark and title on the primary page types', () => {
  for (const route of ['', 'about', 'ai', 'engineering/topics/api', 'privacy', 'agent-map']) {
    const document = html(route);
    assert.match(document, /hextra-nav-container/);
    assert.match(document, /hextra-search-dialog/);
    assert.equal((document.match(/<main\b/g) || []).length, 1, route);
    assert.equal((document.match(/<h1\b/g) || []).length, 1, route);
    assert.doesNotMatch(document, /bootstrap(?:\.min)?\.js|doks-core/);
  }
});

test('imported notes retain the full breadcrumb chain and wiki heading targets', () => {
  const document = html('system-design/integrated-test-pages/migration-smoke');
  const breadcrumb = document.match(/<nav\b[^>]*class=["']?breadcrumb["']?[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert.ok(breadcrumb);
  assert.match(breadcrumb, /Home/);
  assert.match(breadcrumb, /\/system-design\//);
  assert.match(breadcrumb, /\/system-design\/integrated-test-pages\//);
  assert.match(breadcrumb, /aria-current=page|aria-current="page"/);
  assert.match(document, attr('id', 'local-smoke-heading'));
  assert.match(document, attr('href', '#local-smoke-heading'));
  assert.match(document, /\/system-design\/elements\/elements\/#cdn/);
  // H1 targets remain available too, including authored H1s that replace the title.
  const authored = html('engineering/topics/api');
  assert.match(authored, attr('id', 'api-design-research-topics'));
});

test('the importer callout syntax retains titles, severities, and rendered bodies', () => {
  const document = html('system-design/integrated-test-pages/callouts');
  for (const title of ['Note', 'Tip', 'Caution', 'Danger']) {
    assert.match(document, new RegExp(`site-callout-title[^>]*><strong>${title}</strong>`));
  }
  for (const color of ['blue', 'green', 'amber', 'red']) {
    assert.ok(document.includes(`hx:bg-${color}-100`), color);
  }
  assert.match(document, /First caution item/);
  assert.match(document, /<li>/);
});

test('search, math styles, reading fonts, and migrated image attachments are published locally', () => {
  const home = html('');
  assert.match(home, /vendor\/flexsearch\.[a-f0-9]+\.js/);
  for (const asset of ['vendor/katex/katex.min.css', 'vendor/katex/fonts/KaTeX_Main-Regular.woff2', 'fonts/jost-latin-400-normal.woff2']) {
    assert.ok(existsSync(path.join(output, asset)), asset);
  }
  const math = html('ai-engineering/approach/edd');
  assert.match(math, /class=katex|class="katex"/);
  assert.match(math, /\/vendor\/katex\/katex.min.css/);
  const illustrated = html('ai/design/workflow-design/jev-to-workflow');
  assert.match(illustrated, attr('src', '/ai/design/workflow-design/jev-to-workflow.assets/pasted-image-20261020224616.png'));
  assert.ok(existsSync(path.join(output, 'ai/design/workflow-design/jev-to-workflow.assets/pasted-image-20261020224616.png')));
});
