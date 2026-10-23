import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { normalizeRoute, parseCSV, renderRedirect, validateMappings } from '../../scripts/redirects.mjs';

const current = new Map([['/new', { title: 'Current note' }], ['/second', { title: 'Second note' }]]);
const available = (route) => current.has(route);
const template = readFileSync(new URL('../../scripts/redirect-page.html', import.meta.url), 'utf8');
const entry = { to: ['/new/'], comment: 'The note moved.' };

test('URL matching handles old slash variants, encoded paths and explicit index documents safely', () => {
  assert.equal(normalizeRoute('/old/'), '/old');
  assert.equal(normalizeRoute('/old/index.html'), '/old');
  assert.equal(normalizeRoute('/old%20name/'), '/old name');
  for (const value of ['https://evil.test/', '//evil.test/', '/%2fexample/', '/a/../b', '/a/%2e%2e/b', '/a\\b', '/a?x=1', '/bad%']) {
    assert.throws(() => normalizeRoute(value), undefined, value);
  }
});

test('Hugo inventory parsing preserves comma, quote and multiline titles', () => {
  const csv = 'path,title,permalink\r\ncontent/note.md,"First, ""quoted""\nsecond line",https://valery.tech/note/\r\n';
  assert.deepEqual(parseCSV(csv), [{ path: 'content/note.md', title: 'First, "quoted"\nsecond line', permalink: 'https://valery.tech/note/' }]);
});

test('bad destinations, chains, loops, duplicate routes and collisions stop generation', () => {
  for (const [mapping, error] of [
    [{ '/old/': { ...entry, to: ['/missing/'] } }, /not a current published page/],
    [{ '/old/': { ...entry, to: ['/old/'] } }, /cannot point to itself/],
    [{ '/old/': entry, '/older/': { ...entry, to: ['/old/'] } }, /not a current published page/],
    [{ '/old': entry, '/old/': entry }, /Duplicate redirect source/],
    [{ '/old': entry, '/old/index.html': entry }, /Duplicate redirect source/],
    [{ '/new/': { ...entry, to: ['/second/'] } }, /still published/],
    [{ '/old/': { ...entry, comment: '' } }, /nonempty comment/],
    [{ '/old/': { ...entry, to: [] } }, /at least one/],
    [{ '/old/': { ...entry, to: ['/new', '/new/'] } }, /duplicate destination/],
  ]) assert.throws(() => validateMappings(mapping, current, available), error);
  assert.throws(() => validateMappings({ '/alias/': entry }, current, () => true), /output already exists/);
});

test('a single destination has a no-JavaScript redirect, canonical URL and a working link', () => {
  const html = renderRedirect('/old', entry, current, template);
  assert.match(html, /http-equiv="refresh" content="0; url=\/new\/"/);
  assert.match(html, /rel="canonical" href="https:\/\/valery.tech\/new\/"/);
  assert.match(html, /window.location.replace\("\/new\/" \+ window.location.search \+ window.location.hash\)/);
  assert.match(html, /<a href="\/new\/">Current note<\/a>/);
  assert.match(html, /name="robots" content="noindex, follow"/);
});

test('a split note explains the choices without automatically selecting one', () => {
  const html = renderRedirect('/old', { to: ['/new/', '/second/'], comment: 'This draft became two notes.' }, current, template);
  assert.doesNotMatch(html, /http-equiv="refresh"|location.replace|rel="canonical"/);
  assert.match(html, /This draft became two notes\./);
  assert.match(html, /href="\/new\/"/);
  assert.match(html, /href="\/second\/"/);
});

test('comments and current page titles remain escaped text', () => {
  const html = renderRedirect('/old', { ...entry, comment: '<script>alert("x")</script>' }, new Map([['/new', { title: '<img src=x onerror=alert(1)>' }]]), template);
  assert.match(html, /&lt;script&gt;alert\(&quot;x&quot;\)&lt;\/script&gt;/);
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(html, /<img src=x|<script>alert/);
});
