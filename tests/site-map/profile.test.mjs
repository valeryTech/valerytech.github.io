import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repository = fileURLToPath(new URL('../../', import.meta.url));
const ids = ['investigation-composition', 'evaluation-evidence', 'uncertainty-utility-commitments'];

function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'profile-presentation-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const directory of ['content/contributions', 'layouts/partials/contributions', 'layouts/partials/main']) {
    mkdirSync(path.join(root, directory), { recursive: true });
  }
  for (const filename of ['contributions/records.html', 'contributions/preview.html', 'contributions/agent-summary.md', 'main/article-content.html', 'main/content-with-description.html', 'main/page-description.html']) {
    copyFileSync(path.join(repository, 'layouts/partials', filename), path.join(root, 'layouts/partials', filename));
  }
  // Reuse the real output-format override so the fixture catches its interaction
  // with Hugo's built-in root sitemap, not just a manually constructed XML file.
  const siteConfig = readFileSync(path.join(repository, 'config/_default/hugo.toml'), 'utf8');
  const sitemapFormat = siteConfig.match(/\[outputFormats\.SITEMAP\][\s\S]*?(?=\n\[sitemap\])/)[0];
  writeFileSync(path.join(root, 'hugo.toml'), `
baseURL = "https://example.org/"
disableKinds = ["taxonomy", "term", "RSS"]
[outputs]
home = ["HTML", "agentText"]
section = ["HTML", "SITEMAP"]
[outputFormats.agentText]
mediaType = "text/plain"
baseName = "llms"
isPlainText = true
${sitemapFormat}
`);
  writeFileSync(path.join(root, 'layouts/home.html'), '{{ partial "contributions/preview.html" . }}');
  writeFileSync(path.join(root, 'layouts/home.agenttext.txt'), '{{ partial "contributions/agent-summary.md" . }}');
  for (const layout of ['single', 'section']) {
    writeFileSync(path.join(root, `layouts/${layout}.html`), '<nav>Global navigation</nav><main>{{ partial "main/article-content.html" (dict "page" .) }}<nav>Next document</nav></main>');
  }
  function page(filename, fields, body = '') {
    const destination = path.join(root, 'content', filename);
    mkdirSync(path.dirname(destination), { recursive: true });
    writeFileSync(destination, `---\n${JSON.stringify({ title: 'Fixture', ...fields })}\n---\n${body}\n`);
  }
  page('_index.md', { title: 'Fixture' });
  page('contributions/_index.md', { title: 'Contribution records' });
  ids.forEach((id, index) => page(`contributions/${id}.md`, {
    title: `Record ${index + 1}`, description: `Canonical summary ${index + 1}.`,
    contribution_id: id, contribution_order: index + 1,
  }, '## Evidence\n\nSource and attribution.'));
  page('contributions/from-uncertainty-to-commitment.md', {
    title: 'From uncertainty to commitment', contribution_route_id: 'from-uncertainty-to-commitment',
  }, 'A reading route.');
  return {
    root, page,
    output: (filename) => readFileSync(path.join(root, 'public', filename), 'utf8'),
    build: () => {
      const result = spawnSync('hugo', ['--source', root, '--noBuildLock'], { encoding: 'utf8' });
      if (result.error) throw result.error;
      return { status: result.status, output: result.stdout + result.stderr };
    },
  };
}

test('homepage and agent text use the same published records and canonical summaries', (t) => {
  const site = fixture(t);
  const result = site.build();
  assert.equal(result.status, 0, result.output);
  const home = site.output('index.html');
  const agent = site.output('llms.txt');
  for (const [index, id] of ids.entries()) {
    assert.match(home, new RegExp(`/contributions/${id}/`));
    assert.match(agent, new RegExp(`/contributions/${id}/`));
    for (const output of [home, agent]) assert.ok(output.includes(`Canonical summary ${index + 1}.`));
  }
  assert.ok(home.indexOf('Record 1') < home.indexOf('Record 2'));
  assert.ok(home.indexOf('Record 2') < home.indexOf('Record 3'));
  assert.match(agent, /Reading route: From uncertainty to commitment/);
  assert.match(home, /\/contributions\/from-uncertainty-to-commitment\//);
});

test('unpublished or duplicate contribution identities fail instead of producing misleading navigation', async (t) => {
  for (const variant of ['draft', 'duplicate', 'missing-route']) {
    await t.test(variant, (t) => {
      const site = fixture(t);
      if (variant === 'draft') site.page(`contributions/${ids[0]}.md`, { contribution_id: ids[0], draft: true });
      if (variant === 'duplicate') site.page('contributions/duplicate.md', { contribution_id: ids[0], contribution_order: 1, description: 'Duplicate.' });
      if (variant === 'missing-route') rmSync(path.join(site.root, 'content/contributions/from-uncertainty-to-commitment.md'));
      const result = site.build();
      assert.notEqual(result.status, 0, result.output);
      assert.match(result.output, /Expected one published (contribution page|route)/);
    });
  }
});

test('articles get a missing title while authored headings and the content boundary are preserved', (t) => {
  const site = fixture(t);
  site.page('missing-title.md', { title: 'Article title', description: 'Article introduction.' }, '## A section\n\nBody text.');
  site.page('authored-title.md', { title: 'Metadata title', description: 'Article introduction.' }, '# Authored title\n\nBody text.');
  const result = site.build();
  assert.equal(result.status, 0, result.output);
  for (const name of ['missing-title', 'authored-title']) {
    const html = site.output(`${name}/index.html`);
    const article = html.match(/<article class="article-content"[^>]*>([\s\S]*?)<\/article>/)?.[1];
    assert.ok(article);
    assert.equal((article.match(/<h1\b/g) || []).length, 1);
    assert.match(article, /Article introduction\./);
    assert.doesNotMatch(article, /Global navigation|Next document/);
    assert.ok(article.indexOf('<h1') < article.indexOf('Article introduction.'));
  }
  assert.match(site.output('missing-title/index.html'), /<h1>Article title<\/h1>/);
  assert.match(site.output('authored-title/index.html'), /<h1[^>]*>Authored title<\/h1>/);
});

test('the configured output format still emits Hugo’s root sitemap', (t) => {
  const site = fixture(t);
  const result = site.build();
  assert.equal(result.status, 0, result.output);
  assert.ok(existsSync(path.join(site.root, 'public/sitemap.xml')), 'robots.txt advertises /sitemap.xml');
  const sitemap = site.output('sitemap.xml');
  assert.match(sitemap, /<urlset\b/);
  assert.match(sitemap, /<loc>https:\/\/example.org\/contributions\/evaluation-evidence\/<\/loc>/);
});
