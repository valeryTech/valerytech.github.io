import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Offline authoring tool; generated assets are committed, so Hugo/CI need no SVG renderer.
const root = fileURLToPath(new URL('../', import.meta.url));
const read = (file) => readFileSync(path.join(root, file), 'utf8');
const write = (file, value) => writeFileSync(path.join(root, file), value);
const source = read('assets/branding/v-mark.svg');
const geometry = source.match(/<svg\b[^>]*>([\s\S]*)<\/svg>/)?.[1].trim();
if (!geometry) throw new Error('The V mark must be a complete SVG.');

const tokens = read('assets/css/site/tokens/colors.css');
const light = tokens.match(/:root\s*\{([\s\S]*?)\}/)?.[1];
const dark = tokens.match(/\.dark\s*\{([\s\S]*?)\}/)?.[1];
function color(block, name) {
    const value = block?.match(new RegExp(`--site-${name}:\\s*(#[a-f\\d]+)\\s*;`, 'i'))?.[1];
    if (!value) throw new Error(`Expected a solid --site-${name} color in tokens/colors.css.`);
    return value;
}
const palette = Object.fromEntries(
    Object.entries({ light, dark }).map(([theme, block]) => [
        theme,
        {
            primary: color(block, 'foreground'),
            secondary: color(light, `link-color-${theme}`),
            surface: color(block, 'context-header')
        }
    ])
);
const title = read('config/_default/hugo.toml').match(/^title\s*=\s*"([^"]+)"/m)?.[1];
if (!title) throw new Error('The site title must be configured.');
const escapedTitle = title.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const rules = (colors) =>
    `.site-brand-primary{color:${colors.primary}}.site-brand-secondary{color:${colors.secondary}}.site-brand-tile{fill:${colors.surface}}`;

function svg({ theme = 'light', tile = false, rounded = true, scale = 1 } = {}) {
    const style = rules(palette[theme]);
    const inset = (100 - 100 * scale) / 2;
    const mark =
        scale === 1 ? geometry : (
            `<g transform="translate(${inset} ${inset}) scale(${scale})">${geometry}</g>`
        );
    return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 100 100" fill="none"><title>${escapedTitle} — V topology</title><style>${style}</style>${tile ? `<rect class="site-brand-tile" width="100" height="100" rx="${rounded ? 20 : 0}"/>` : ''}${mark}</svg>\n`;
}

// Fail before writing if the optional authoring tools are unavailable.
execFileSync('rsvg-convert', ['--version'], { stdio: 'ignore' });
execFileSync('magick', ['-version'], { stdio: 'ignore' });
mkdirSync(path.join(root, 'static/branding'), { recursive: true });
const temp = mkdtempSync(path.join(tmpdir(), 'valery-icons-'));
try {
    write('static/branding/mark-light.svg', svg());
    write('static/branding/mark-dark.svg', svg({ theme: 'dark' }));
    // One dark badge stays legible when the browser chooses or caches any format.
    write('static/favicon.svg', svg({ theme: 'dark', tile: true }));
    const monochrome = geometry.replaceAll(/ class="[^"]+"/g, '');
    write(
        'static/mask-icon.svg',
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" color="#000"><g transform="scale(.16)">${monochrome}</g></svg>\n`
    );

    function png(file, size, options) {
        const input = path.join(temp, 'icon.svg');
        writeFileSync(input, svg({ theme: 'dark', tile: true, ...options }));
        execFileSync('rsvg-convert', [
            '--width',
            String(size),
            '--height',
            String(size),
            '--output',
            path.join(root, 'static', file),
            input
        ]);
    }
    for (const size of [16, 32, 48]) png(`favicon-${size}x${size}.png`, size);
    png('favicon.png', 512);
    png('apple-touch-icon.png', 180, { rounded: false, scale: 0.85 });
    png('icon-192.png', 192, { rounded: false, scale: 0.85 });
    png('icon-512.png', 512, { rounded: false, scale: 0.85 });
    png('icon-maskable-512.png', 512, { rounded: false, scale: 0.7 });
    execFileSync(
        'magick',
        [16, 32, 48]
            .map((size) => path.join(root, `static/favicon-${size}x${size}.png`))
            .concat(path.join(root, 'static/favicon.ico'))
    );
    function manifestIcon(file, size, purpose = 'any') {
        const version = createHash('sha256')
            .update(readFileSync(path.join(root, 'static', file)))
            .digest('hex')
            .slice(0, 12);
        return {
            src: `${file}?v=${version}`,
            sizes: `${size}x${size}`,
            type: 'image/png',
            purpose
        };
    }
    write(
        'static/site.webmanifest',
        JSON.stringify(
            {
                name: title,
                short_name: 'valery.tech',
                start_url: '/',
                display: 'browser',
                icons: [
                    manifestIcon('icon-192.png', 192),
                    manifestIcon('icon-512.png', 512),
                    manifestIcon('icon-maskable-512.png', 512, 'maskable')
                ]
            },
            null,
            2
        ) + '\n'
    );
    // The HTML adapter reads this generated color; UI tokens remain the authority.
    write(
        'static/branding/palette.json',
        JSON.stringify({ maskColor: palette.light.secondary }, null, 2) + '\n'
    );
} finally {
    rmSync(temp, { recursive: true, force: true });
}
console.log('Built the V mark, light/dark icons, Safari mask, touch icon, and web manifest.');
