import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

const origin = 'https://valery.tech';
export const generatedDirectory = '.generated/redirects';
const mapFile = 'data/redirects.json';
const historyFile = 'data/url-history.json';

export function normalizeRoute(value) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[?#\\]/.test(value)) {
    throw new Error(`Expected an absolute website path without queries or fragments: ${JSON.stringify(value)}`);
  }
  let decoded;
  try { decoded = decodeURIComponent(value); } catch { throw new Error(`Invalid URL encoding: ${value}`); }
  if (decoded.includes('//') || decoded.split('/').some((part) => part === '.' || part === '..') || /[\\\x00-\x1f]/.test(decoded)) {
    throw new Error(`Unsafe website path: ${value}`);
  }
  return decoded.replace(/\/index\.html$/, '').replace(/\/+$/, '') || '/';
}

export function routeFile(directory, route) {
  const normalized = normalizeRoute(route);
  return normalized.endsWith('.html') ? path.join(directory, normalized.slice(1)) : path.join(directory, normalized.slice(1), 'index.html');
}

// Hugo emits RFC 4180 CSV, including quoted titles with commas and newlines.
export function parseCSV(text) {
  const rows = []; let row = []; let value = ''; let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') {
      if (quoted && text[i + 1] === '"') { value += '"'; i++; } else quoted = !quoted;
    } else if (char === ',' && !quoted) { row.push(value); value = ''; }
    else if (char === '\n' && !quoted) { row.push(value.replace(/\r$/, '')); rows.push(row); row = []; value = ''; }
    else value += char;
  }
  if (value || row.length) { row.push(value.replace(/\r$/, '')); rows.push(row); }
  const headers = rows.shift() || [];
  return rows.filter((fields) => fields.some(Boolean)).map((fields) => Object.fromEntries(headers.map((key, i) => [key, fields[i]])));
}

function run(command, args, root, options = {}) {
  // The supported Docker toolchain runs with a different UID from the bind mount.
  if (command === 'git') args = ['-c', `safe.directory=${root}`, ...args];
  return execFileSync(command, args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, stdio: ['pipe', 'pipe', 'pipe'], ...options });
}

function inventory(root, clock) {
  const args = ['list', 'published', '--environment', 'production', '--logLevel', 'error'];
  if (clock) args.push('--clock', clock);
  return parseCSV(run('hugo', args, root)).filter((page) => page.path && !page.path.includes('content/agent-map/')).map((page) => ({
    route: normalizeRoute(new URL(page.permalink).pathname),
    source: page.path.replace(/^.*?content\//, 'content/'),
    title: page.title,
  }));
}

function recordRoutes(history, pages) {
  for (const { route, ...metadata } of pages) history.routes[route] = { ...history.routes[route], ...metadata };
}

function refreshHistory(root, history) {
  if (!existsSync(path.join(root, '.git'))) return;
  // A commit that only records this ledger must not make the ledger stale again.
  const head = run('git', ['log', '-1', '--format=%H', '--', 'content', 'config'], root).trim();
  if (history.through === head) return;
  const start = history.through || history.start;
  try { run('git', ['cat-file', '-e', `${start}^{commit}`], root); }
  catch { throw new Error(`URL history needs Git commit ${start}. Fetch full history (git fetch --unshallow); GitHub Actions must use fetch-depth: 0.`); }
  const range = history.through ? `${start}..${head}` : `${start}^..${head}`;
  const commits = run('git', ['rev-list', '--reverse', range, '--', 'content', 'config'], root).trim().split('\n').filter(Boolean);
  if (commits.length) console.log(`Reading published URLs from ${commits.length} Git snapshots…`);
  for (const revision of commits) {
    const snapshot = mkdtempSync(path.join(tmpdir(), 'site-url-history-'));
    try {
      const archive = run('git', ['archive', revision, 'content', 'config'], root, { encoding: 'buffer' });
      run('tar', ['-x', '-C', snapshot], root, { input: archive });
      for (const name of ['node_modules', 'layouts', 'assets', 'static', 'data']) {
        if (existsSync(path.join(root, name))) symlinkSync(path.join(root, name), path.join(snapshot, name), 'dir');
      }
      // Use the commit's config and clock: file names alone do not determine Hugo URLs.
      const clock = run('git', ['show', '-s', '--format=%cI', revision], root).trim();
      recordRoutes(history, inventory(snapshot, clock));
    } finally { rmSync(snapshot, { recursive: true, force: true }); }
  }
  history.through = head;
}

function outputExists(directory, route) {
  const normalized = normalizeRoute(route);
  const candidates = [path.join(directory, normalized.slice(1)), routeFile(directory, normalized)];
  return candidates.some((filename) => {
    try { return statSync(filename).isFile() && (!filename.endsWith('.html') || !readFileSync(filename, 'utf8').includes('data-legacy-redirect')); }
    catch { return false; }
  });
}

export function validateMappings(mappings, current, available) {
  const errors = []; const normalized = new Map();
  for (const [from, entry] of Object.entries(mappings)) {
    let route;
    try { route = normalizeRoute(from); } catch (error) { errors.push(error.message); continue; }
    if (normalized.has(route)) errors.push(`Duplicate redirect source: ${from}`);
    normalized.set(route, entry);
    if (!entry || typeof entry.comment !== 'string' || !entry.comment.trim()) errors.push(`${from}: add a nonempty comment explaining the move or replacement.`);
    if (!Array.isArray(entry?.to) || entry.to.length === 0) { errors.push(`${from}: to must contain at least one current website URL.`); continue; }
    if (current.has(route)) errors.push(`${from}: this URL is still published; a redirect must not replace a live page.`);
    const destinations = new Set();
    for (const target of entry.to) {
      try {
        const destination = normalizeRoute(target);
        if (destination === route) errors.push(`${from}: a redirect cannot point to itself.`);
        if (destinations.has(destination)) errors.push(`${from}: duplicate destination ${target}.`);
        destinations.add(destination);
        if (!current.has(destination) || !available(destination)) errors.push(`${from}: destination ${target} is not a current published page. Use its final URL, not another redirect.`);
      } catch (error) { errors.push(`${from}: ${error.message}`); }
    }
    if (available(route)) errors.push(`${from}: output already exists (possibly a Hugo alias). Remove the duplicate mapping or the alias.`);
  }
  if (errors.length) throw new Error(`Invalid ${mapFile}:\n${errors.map((error) => `- ${error}`).join('\n')}`);
  return normalized;
}

const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const publicURL = (route) => {
  const normalized = normalizeRoute(route);
  const encoded = normalized.split('/').map(encodeURIComponent).join('/');
  return normalized === '/' || normalized.endsWith('.html') ? encoded : `${encoded}/`;
};

export function renderRedirect(from, entry, current, template) {
  const single = entry.to.length === 1;
  const destination = publicURL(entry.to[0]);
  const title = single ? 'This page has moved' : 'This page has been reorganized';
  const links = entry.to.map((target) => {
    const metadata = current.get(normalizeRoute(target));
    return `<li><a href="${escapeHTML(publicURL(target))}">${escapeHTML(metadata.title || target)}</a><span>${escapeHTML(publicURL(target))}</span></li>`;
  }).join('\n');
  const values = {
    title: escapeHTML(title),
    redirect: single ? `<script>window.location.replace(${JSON.stringify(destination)} + window.location.search + window.location.hash);</script>\n<meta http-equiv="refresh" content="0; url=${escapeHTML(destination)}">\n<link rel="canonical" href="${escapeHTML(origin + destination)}">` : '',
    from: escapeHTML(publicURL(from)),
    comment: escapeHTML(entry.comment),
    intro: single ? 'You will be taken to its current location. You can also follow the link below.' : 'Related pages:',
    links,
  };
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => values[key] ?? match);
}

function htmlFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filename = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(filename) : entry.name.endsWith('.html') ? [filename] : [];
  });
}

function checkInternalLinks(directory, mappings, available) {
  const failures = new Map();
  for (const filename of htmlFiles(directory)) {
    const relative = path.relative(directory, filename).split(path.sep).join('/');
    const source = '/' + relative.replace(/index\.html$/, '');
    const html = readFileSync(filename, 'utf8');
    if (html.includes('data-legacy-redirect')) continue;
    for (const match of html.matchAll(/<a\b[^>]*\bhref=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
      let link;
      try { link = new URL((match[1] ?? match[2] ?? match[3]).replaceAll('&amp;', '&'), origin + source); } catch { continue; }
      if (!['http:', 'https:'].includes(link.protocol) || !['valery.tech', 'www.valery.tech', 'valerytech.github.io'].includes(link.hostname)) continue;
      let target;
      try { target = normalizeRoute(link.pathname); } catch { continue; }
      if (available(target) || mappings.has(target)) continue;
      const sources = failures.get(target) || new Set(); sources.add(source); failures.set(target, sources);
    }
  }
  return [...failures].map(([target, sources]) => ({ target, sources: [...sources] }));
}

export function buildRedirects({ root, publicDir, check = false }) {
  const filename = path.join(root, historyFile);
  const original = readFileSync(filename, 'utf8');
  const history = JSON.parse(original);
  refreshHistory(root, history);
  const pages = inventory(root);
  recordRoutes(history, pages);
  const current = new Map(pages.map(({ route, ...metadata }) => [route, metadata]));
  // Alias URLs are public contracts too; retain them if a future migration removes aliases.
  for (const htmlFile of htmlFiles(publicDir)) {
    const html = readFileSync(htmlFile, 'utf8');
    if (/http-equiv=["']?refresh\b/i.test(html) && !html.includes('data-legacy-redirect')) {
      const route = normalizeRoute('/' + path.relative(publicDir, htmlFile).split(path.sep).join('/').replace(/index\.html$/, ''));
      if (!/\/page\/\d+$/.test(route)) history.routes[route] ||= { title: 'Former published alias', source: 'Hugo alias' };
    }
  }
  const document = JSON.parse(readFileSync(path.join(root, mapFile), 'utf8'));
  if (document.version !== 1 || !document.redirects || typeof document.redirects !== 'object' || Array.isArray(document.redirects)) throw new Error(`Unsupported schema in ${mapFile}`);
  const availability = new Map();
  const available = (route) => {
    if (!availability.has(route)) availability.set(route, outputExists(publicDir, route));
    return availability.get(route);
  };
  const mappings = validateMappings(document.redirects, current, available);
  // Manually recovered shared links become durable contracts as well.
  for (const route of mappings.keys()) history.routes[route] ||= { title: 'Former published redirect', source: mapFile };
  history.routes = Object.fromEntries(Object.entries(history.routes).sort(([a], [b]) => a.localeCompare(b)));
  const serialized = JSON.stringify(history, null, 2) + '\n';
  if (!check && serialized !== original) writeFileSync(filename, serialized);
  const missing = Object.entries(history.routes).filter(([route]) => !available(route) && !mappings.has(route));
  const broken = checkInternalLinks(publicDir, mappings, available);
  if (missing.length || broken.length) {
    const report = {
      missing: Object.fromEntries(missing.map(([route, metadata]) => {
        const candidates = pages.filter((page) => page.title === metadata.title || page.source === metadata.source);
        return [publicURL(route), {
          to: candidates.length === 1 ? [publicURL(candidates[0].route)] : [],
          comment: `TODO: ${metadata.title} (${metadata.source}). Confirm the replacement page(s) and explain the move.`,
        }];
      })),
      broken_internal_links: broken,
    };
    const reportFile = path.join(root, '.generated/redirect-report.json');
    mkdirSync(path.dirname(reportFile), { recursive: true });
    writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n');
    const examples = missing.slice(0, 8).map(([route, metadata]) => `- ${publicURL(route)} — ${metadata.title} (${metadata.source})`);
    const links = broken.slice(0, 8).map(({ target, sources }) => `- ${target} linked from ${sources.join(', ')}`);
    throw new Error([
      `${missing.length} formerly published URLs need mappings in ${mapFile}.`,
      ...examples,
      `${broken.length} internal link destinations are missing. Fix the source link, or add a documented mapping if the page moved.`,
      ...links,
      'Add an entry such as: "/old-path/": { "to": ["/current-path/"], "comment": "Why this material moved" }',
      'Use multiple destinations when material was split; automatic redirects require a single destination.',
      'Full list and mapping stubs: .generated/redirect-report.json',
    ].join('\n'));
  }
  if (check && serialized !== original) throw new Error(`Published URL history is stale. Run make site-map and commit ${historyFile}.`);
  const generated = path.join(root, generatedDirectory);
  const template = readFileSync(path.join(root, 'scripts/redirect-page.html'), 'utf8');
  const documents = new Map([...mappings].map(([route, entry]) => [routeFile(generated, route), renderRedirect(route, entry, current, template)]));
  if (check) {
    const stale = [...documents].some(([filename, html]) => !existsSync(filename) || readFileSync(filename, 'utf8') !== html);
    const extra = existsSync(generated) && htmlFiles(generated).some((filename) => !documents.has(filename));
    if (stale || extra) throw new Error('Generated redirect pages are stale. Run make site-map to regenerate them.');
  } else {
    rmSync(generated, { recursive: true, force: true });
    mkdirSync(generated, { recursive: true });
    for (const [output, html] of documents) {
      mkdirSync(path.dirname(output), { recursive: true });
      writeFileSync(output, html);
    }
    rmSync(path.join(root, '.generated/redirect-report.json'), { force: true });
  }
  console.log(`Validated ${Object.keys(history.routes).length} historical URLs and ${mappings.size} redirect pages.`);
}
