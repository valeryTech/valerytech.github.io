import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repository = fileURLToPath(new URL('../../', import.meta.url));

function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'section-index-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const filename of [
    '_default/section.html', '_partials/main/page.html', 'partials/main/article-content.html',
    'partials/main/content-with-description.html', 'partials/main/page-description.html',
    'partials/main/section-entry-page.html', 'partials/main/navigation-description.html',
    'partials/agent-map/status.html', 'partials/section-index/index.html',
    'partials/section-index/contents.html', 'partials/section-index/note.html',
    'partials/section-index/pages.html',
  ]) {
    const destination = path.join(root, 'layouts', filename);
    mkdirSync(path.dirname(destination), { recursive: true });
    copyFileSync(path.join(repository, 'layouts', filename), destination);
  }
  for (const name of ['sidebar', 'toc', 'breadcrumb']) {
    writeFileSync(path.join(root, 'layouts/_partials', `${name}.html`), '');
  }
  mkdirSync(path.join(root, 'layouts/partials/sidebar'), { recursive: true });
  writeFileSync(path.join(root, 'layouts/partials/sidebar/section-menu.html'), '');
  writeFileSync(path.join(root, 'layouts/baseof.html'), '{{ block "main" . }}{{ end }}');
  writeFileSync(path.join(root, 'layouts/home.html'), '{{ define "main" }}{{ end }}');
  writeFileSync(path.join(root, 'layouts/single.html'), '{{ define "main" }}<main>{{ .Content }}</main>{{ end }}');
  writeFileSync(path.join(root, 'hugo.toml'), `
baseURL = "https://example.org/"
disableKinds = ["taxonomy", "term", "RSS", "sitemap"]
[params.sectionIndexes]
"/notes/guide/" = "/notes/guide/reading"
`);
  function page(filename, fields, body = '') {
    const destination = path.join(root, 'content', filename);
    mkdirSync(path.dirname(destination), { recursive: true });
    writeFileSync(destination, `---\n${JSON.stringify(fields)}\n---\n${body}\n`);
  }
  page('_index.md', { title: 'Fixture' });
  page('notes/_index.md', { title: 'Notes', description: 'The collection introduction.' }, 'Authored section context.');
  return {
    page,
    output: (filename) => readFileSync(path.join(root, 'public', filename), 'utf8'),
    build: () => {
      const result = spawnSync('hugo', ['--source', root, '--noBuildLock'], { encoding: 'utf8' });
      if (result.error) throw result.error;
      assert.equal(result.status, 0, result.stdout + result.stderr);
    },
  };
}

test('a section keeps its introduction and links to its reading guide without reproducing the article', (t) => {
  const site = fixture(t);
  site.page('notes/guide/_index.md', { title: 'Guide', description: 'The guide section introduction.' }, 'The section context.');
  site.page('notes/guide/reading.md', { title: 'Reading guide', description: 'Choose a reading path.' }, '## Article-only heading\n\nThe full guide text.');
  site.build();
  const html = site.output('notes/guide/index.html');
  assert.equal((html.match(/<h1\b/g) || []).length, 1);
  assert.match(html, /<h1>Guide<\/h1>/);
  assert.match(html, /The guide section introduction\./);
  assert.match(html, /The section context\./);
  assert.match(html, /Start here/);
  assert.match(html, /Choose a reading path\./);
  assert.equal((html.match(/href="\/notes\/guide\/reading\/"/g) || []).length, 1);
  assert.doesNotMatch(html, /Article-only heading|The full guide text/);
  assert.match(site.output('notes/guide/reading/index.html'), /The full guide text/);
});

test('section maps assemble descriptions, retain document status and refresh when notes change', (t) => {
  const site = fixture(t);
  site.page('notes/evidence.md', {
    title: 'Evidence', description: 'Compare claims & evidence.', document_status: 'draft',
  }, 'A different body summary.');
  site.page('notes/history.md', { title: 'History', description: 'An earlier approach.', document_status: 'archived' });
  site.page('notes/summary.md', { title: 'Summary fallback', description: 'Default Description' }, 'A fallback from the note itself.');
  site.page('notes/excluded.md', { title: 'Excluded note', agent_map_exclude: true });
  site.page('notes/unpublished.md', { title: 'Unpublished note', draft: true });
  site.build();
  const html = site.output('notes/index.html');
  assert.match(html, /Authored section context\./);
  assert.match(html, /Explore this section/);
  assert.match(html, /Compare claims &amp; evidence\./);
  assert.match(html, /section-map-status">Draft/);
  assert.match(html, /section-map-status">Archived/);
  assert.match(html, /A fallback from the note itself\./);
  assert.doesNotMatch(html, /A different body summary|Default Description|Excluded note|Unpublished note/);

  site.page('notes/evidence.md', { title: 'Evidence', description: 'An updated description.' });
  site.page('notes/new.md', { title: 'New note', description: 'A newly published note.' });
  site.build();
  const updated = site.output('notes/index.html');
  assert.match(updated, /An updated description\./);
  assert.match(updated, /href="\/notes\/new\/"/);
  assert.match(updated, /A newly published note\./);
  assert.doesNotMatch(updated, /Compare claims/);
});

test('nested maps link to section overviews, open small groups and collapse large groups', (t) => {
  const site = fixture(t);
  site.page('notes/small/_index.md', { title: 'Small group', description: 'A focused topic.' });
  site.page('notes/small/one.md', { title: 'One', description: 'The first note.' });
  site.page('notes/large/_index.md', { title: 'Large group', description: 'A broader collection.' });
  site.page('notes/large/nested/_index.md', { title: 'Nested group', description: 'The nested topic.' });
  for (let i = 0; i < 4; i++) {
    site.page(`notes/large/nested/note-${i}.md`, { title: `Note ${i}`, description: `Description ${i}.` });
  }
  site.build();
  const html = site.output('notes/index.html');
  assert.match(html, /href="\/notes\/small\/"/);
  assert.match(html, /A focused topic\./);
  assert.match(html, /href="\/notes\/small\/"[\s\S]*?<details class="section-map-disclosure" open>/);
  assert.match(html, /href="\/notes\/large\/"[\s\S]*?<details class="section-map-disclosure">/);
  assert.match(html, /Browse 4 notes/);
  assert.match(html, /href="\/notes\/large\/nested\/note-3\/"/);
  assert.match(html, /Description 3\./);
  assert.match(site.output('notes/large/index.html'), /href="\/notes\/large\/nested\/"/);
});
