import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const repository = fileURLToPath(new URL('../../', import.meta.url));

function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), 'entry-presentation-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const filename of [
    'layouts/home.html', 'layouts/about/single.html', 'layouts/_shortcodes/link-card.html',
    'layouts/_partials/main/page.html', 'layouts/partials/main/article-content.html',
    'layouts/partials/main/page-description.html', 'layouts/partials/main/content-with-description.html',
  ]) {
    mkdirSync(path.dirname(path.join(root, filename)), { recursive: true });
    copyFileSync(path.join(repository, filename), path.join(root, filename));
  }
  mkdirSync(path.join(root, 'content'), { recursive: true });
  for (const name of ['sidebar', 'toc', 'breadcrumb', 'main/docs-navigation', 'main/mobile-toc']) {
    writeFileSync(path.join(root, 'layouts/_partials', `${name}.html`), '');
  }
  // Put a competing shortcode below the local mount to exercise precedence.
  mkdirSync(path.join(root, 'theme/_shortcodes'), { recursive: true });
  writeFileSync(path.join(root, 'theme/_shortcodes/link-card.html'), '<p>Shadowed theme card</p>');
  writeFileSync(path.join(root, 'hugo.toml'), `
baseURL = "https://example.org/"
disableKinds = ["taxonomy", "term", "RSS", "sitemap"]
[[module.mounts]]
source = "content"
target = "content"
[[module.mounts]]
source = "layouts"
target = "layouts"
[[module.mounts]]
source = "theme"
target = "layouts"
`);
  writeFileSync(path.join(root, 'layouts/baseof.html'), '<nav>Global navigation</nav>{{ block "main" . }}{{ end }}<footer>Global footer</footer>');
  writeFileSync(path.join(root, 'layouts/single.html'), '{{ define "main" }}<main>{{ .Content }}</main>{{ end }}');
  writeFileSync(path.join(root, 'layouts/_shortcodes/card-grid.html'), '<div class="card-nav">{{ .Inner }}</div>');
  const card = '{{< link-card title="Inspect code" description="Mechanism and evidence." href="/research/selected-implementations/" target="_blank" rel="noopener" class="fixture-card" >}}';
  writeFileSync(path.join(root, 'content/_index.md'), `---\ntitle: Research notebook\ndescription: Questions, arguments, and implementations.\n---\n\n## Research paths\n\n${card}\n\n{{< card-grid >}}\n${card}\n{{< /card-grid >}}\n`);
  writeFileSync(path.join(root, 'content/about.md'), '---\ntitle: About\ntype: about\ndescription: An engineering and research practice.\n---\n\n## What I work on\n\nResearch questions and source material.\n');
  writeFileSync(path.join(root, 'content/ordinary.md'), `---\ntitle: Ordinary page\n---\n${card}\n`);
  const result = spawnSync('hugo', ['--source', root, '--noBuildLock'], { encoding: 'utf8' });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, result.stdout + result.stderr);
  return (filename) => readFileSync(path.join(root, 'public', filename), 'utf8');
}

test('home and About expose one main landmark containing their content, excluding global navigation', (t) => {
  const output = fixture(t);
  for (const filename of ['index.html', 'about/index.html']) {
    const html = output(filename);
    assert.equal((html.match(/<main\b/g) || []).length, 1);
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
    assert.ok(main);
    assert.equal((main.match(/<h1\b/g) || []).length, 1);
    assert.doesNotMatch(main, /Global navigation|Global footer|\[image\]/);
  }
  assert.match(output('about/index.html'), /<article class="article-content about-content" aria-label="About">/);
});

test('homepage card titles use H3 while preserving non-home headings, card nesting and link attributes', (t) => {
  const output = fixture(t);
  const home = output('index.html');
  const ordinary = output('ordinary/index.html');
  assert.equal((home.match(/<h3>/g) || []).length, 2);
  assert.doesNotMatch(home, /<h5\b/);
  assert.match(ordinary, /<h4>/);
  assert.equal((home.match(/class="card-nav(?: d-flex flex-column flex-sm-row)?"/g) || []).length, 2);
  for (const html of [home, ordinary]) {
    assert.match(html, /href="\/research\/selected-implementations\/" target="_blank"[^>]*rel="noopener"/);
    assert.match(html, /class="hextra-card site-link-card fixture-card"/);
    assert.doesNotMatch(html, /Shadowed theme card/);
    assert.match(html, /Mechanism and evidence\./);
  }
});
