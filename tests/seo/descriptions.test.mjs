import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repository = fileURLToPath(new URL('../../', import.meta.url));
const valid = 'A'.repeat(110);

function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'seo-descriptions-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const directory of ['content', 'config/_default', 'layouts/_partials/seo']) {
    mkdirSync(path.join(root, directory), { recursive: true });
  }
  copyFileSync(path.join(repository, 'config/_default/params.toml'), path.join(root, 'config/_default/params.toml'));
  for (const partial of ['description.html', 'description-value.html', 'validate-description.html']) {
    copyFileSync(path.join(repository, 'layouts/_partials/seo', partial), path.join(root, 'layouts/_partials/seo', partial));
  }
  writeFileSync(path.join(root, 'hugo.toml'), `
baseURL = "https://example.org/"
disableKinds = ["RSS", "sitemap"]
[outputs]
home = ["HTML"]
section = ["HTML"]
[taxonomies]
tag = "tags"
category = "categories"
contributor = "contributors"
`);
  for (const layout of ['home', 'single', 'section', 'taxonomy', 'term', '404']) {
    writeFileSync(path.join(root, 'layouts', `${layout}.html`), '<head>{{ partial "seo/description.html" . }}</head><main>{{ .Content }}</main>');
  }
  function page(filename, fields, body = '') {
    const target = path.join(root, 'content', filename);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, `---\n${JSON.stringify({ title: 'Fixture', ...fields })}\n---\n${body}`);
  }
  page('_index.md', { description: valid });
  return {
    page,
    html: (filename) => readFileSync(path.join(root, 'public', filename), 'utf8'),
    build: (level = 'error') => {
      const result = spawnSync('hugo', ['--environment', 'production', '--noBuildLock'], {
        cwd: root,
        encoding: 'utf8',
        env: { ...process.env, HUGOxPARAMSxSEOxDESCRIPTIONxLENGTHxERRORLEVEL: level },
      });
      if (result.error) throw result.error;
      return { status: result.status, output: result.stdout + result.stderr };
    },
  };
}

test('strict lint allows taxonomies, terms, 404, legal, empty sections, noindex, and explicit exemptions', (t) => {
  const site = fixture(t);
  site.page('article.md', { description: valid, tags: ['hugo'] });
  site.page('privacy.md', { type: 'legal', description: 'A short privacy summary.' });
  site.page('blog/_index.md', {});
  site.page('technical.md', { seo: { robots: 'NOINDEX, follow' } });
  site.page('private.md', { seo: { robots: 'none' } });
  site.page('demo.md', { description: 'Demo.', seo: { validateDescription: false } });
  const result = site.build();
  assert.equal(result.status, 0, result.output);
  assert.doesNotMatch(result.output, /Description too (short|long)/);
  assert.match(site.html('privacy/index.html'), /content="A short privacy summary\."/);
  for (const filename of ['404.html', 'tags/index.html', 'tags/hugo/index.html', 'blog/index.html']) {
    assert.doesNotMatch(site.html(filename), /name="description"/);
  }
});

test('articles, the homepage, and authored section introductions still fail strict lint', async (t) => {
  for (const [filename, fields, body] of [
    ['article.md', {}, ''],
    ['article.md', { description: 'Too short.' }, ''],
    ['_index.md', { description: 'Too short.' }, ''],
    ['collection/_index.md', { description: 'Too short.' }, ''],
    ['collection/_index.md', { seo: { description: 'Too short.' } }, ''],
    ['collection/_index.md', {}, 'An authored introduction.'],
    ['collection/_index.md', { summary: 'An authored summary.' }, ''],
  ]) {
    await t.test(`${filename}: ${JSON.stringify(fields)} ${body}`, (t) => {
      const site = fixture(t);
      site.page(filename, fields, body);
      const result = site.build();
      assert.notEqual(result.status, 0, result.output);
      assert.match(result.output, /Description too short/);
    });
  }
});

test('an explicit opt-in validates otherwise exempt landing and utility pages', async (t) => {
  for (const [filename, fields] of [
    ['collection/_index.md', {}],
    ['privacy.md', { type: 'legal' }],
    ['tags/_index.md', {}],
  ]) {
    await t.test(filename, (t) => {
      const site = fixture(t);
      site.page(filename, { ...fields, seo: { validateDescription: true } });
      const result = site.build();
      assert.notEqual(result.status, 0, result.output);
      assert.match(result.output, /Description too short/);
    });
  }
});

test('length limits count Unicode characters and accept both boundaries', async (t) => {
  for (const [length, succeeds] of [[55, false], [109, false], [110, true], [250, true], [251, false]]) {
    await t.test(`${length} characters`, (t) => {
      const site = fixture(t);
      site.page('article.md', { description: 'é'.repeat(length) });
      const result = site.build();
      assert.equal(result.status === 0, succeeds, result.output);
      if (!succeeds) assert.match(result.output, new RegExp(`${length} characters`));
    });
  }
});

test('SEO overrides, descriptions, and summary fallbacks retain their precedence', (t) => {
  const site = fixture(t);
  site.page('override.md', { description: 'Short.', summary: 'Short.', seo: { description: valid } });
  site.page('description.md', { description: valid, summary: 'Short.' });
  site.page('summary.md', { summary: `**${valid}**` });
  const result = site.build();
  assert.equal(result.status, 0, result.output);
  for (const name of ['override', 'description', 'summary']) {
    assert.match(site.html(`${name}/index.html`), new RegExp(`content="${valid}"`));
  }
});

test('regular builds warn without failing, while ignore suppresses validation', (t) => {
  const site = fixture(t);
  site.page('article.md', { description: 'Short.' });
  const warning = site.build('warning');
  assert.equal(warning.status, 0, warning.output);
  assert.match(warning.output, /WARN.*Description too short/);
  const ignored = site.build('ignore');
  assert.equal(ignored.status, 0, ignored.output);
  assert.doesNotMatch(ignored.output, /Description too short/);
});
