// Opens PDF links in place: activating a link loads PDF.js on first use and
// shows the document in a reader after the link's paragraph or list item.
// Activating the link again, Close or Escape removes it. Modified clicks keep
// normal navigation, and without JavaScript the link opens the file itself.
import { gcm } from '@noble/ciphers/aes.js';
import { pbkdf2Async } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';

const PDFJS_ROOT = '/vendor/pdfjs/';
const LINK_SELECTOR = 'a[data-pdf-reader]';
const COLOR_STORAGE_KEY = 'site-pdf-reader-colors';
// Theme and Sepia redraw text and lines in their colors and keep images;
// Inverted is a CSS filter over the whole page, images included.
const COLOR_MODES = [
    { id: 'original', label: 'Original' },
    {
        id: 'theme',
        label: 'Site theme',
        background: '--site-page-background',
        foreground: '--site-body-foreground'
    },
    {
        id: 'sepia',
        label: 'Sepia',
        background: '--site-pdf-reader-sepia-background',
        foreground: '--site-pdf-reader-sepia-foreground'
    },
    { id: 'invert', label: 'Inverted' }
];
// A reader spans the text column, or the whole article area when widened.
const WIDTH_STORAGE_KEY = 'site-pdf-reader-width';
const WIDTH_MODES = ['text', 'wide'];
// Widening is offered only when it adds at least this much room.
const MIN_WIDEN_PX = 64;
const LOCKED_SUFFIX = '.pdf.enc';
const LOCK_MAGIC = 'VTL1';
const LOCK_NONCE_BYTES = 12;
const LOCK_SLOT_COUNT = 60;
const LOCK_SLOT_BYTES = LOCK_NONCE_BYTES + 32 + 16;
const LOCK_SLOTS_START = 24;
const LOCK_BODY_START = LOCK_SLOTS_START + LOCK_SLOT_COUNT * LOCK_SLOT_BYTES;
// Kept until the tab closes.
const KEY_STORAGE_KEY = 'site-pdf-reader-key';

const template = document.getElementById('site-pdf-reader-template');
const readers = new Map();
let pdfjs;
let readerCount = 0;
let colorMode = readSaved(
    COLOR_STORAGE_KEY,
    COLOR_MODES.map((mode) => mode.id)
);
let widthMode = readSaved(WIDTH_STORAGE_KEY, WIDTH_MODES);

function readSaved(key, ids) {
    try {
        const saved = localStorage.getItem(key);
        if (ids.includes(saved)) return saved;
    } catch {}
    return ids[0];
}

function save(key, id) {
    try {
        localStorage.setItem(key, id);
    } catch {}
}

function rememberedKey() {
    try {
        const hex = sessionStorage.getItem(KEY_STORAGE_KEY);
        if (hex) return Uint8Array.from(hex.match(/../g), (byte) => parseInt(byte, 16));
    } catch {}
    return null;
}

function rememberKey(key) {
    try {
        const hex = Array.from(key, (byte) => byte.toString(16).padStart(2, '0')).join('');
        sessionStorage.setItem(KEY_STORAGE_KEY, hex);
    } catch {}
}

function forgetKey() {
    try {
        sessionStorage.removeItem(KEY_STORAGE_KEY);
    } catch {}
}

function loadPdfjs() {
    if (!pdfjs) {
        const stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.href = `${PDFJS_ROOT}web/pdf_viewer.css`;
        document.head.append(stylesheet);
        pdfjs = import(`${PDFJS_ROOT}build/pdf.min.mjs`).then(async (lib) => {
            lib.GlobalWorkerOptions.workerSrc = `${PDFJS_ROOT}build/pdf.worker.min.mjs`;
            // The viewer components read the library from this global.
            globalThis.pdfjsLib = lib;
            const viewer = await import(`${PDFJS_ROOT}web/pdf_viewer.mjs`);
            return { lib, viewer };
        });
        pdfjs.catch(() => {
            pdfjs = undefined;
        });
    }
    return pdfjs;
}

function insertReader(link, reader) {
    const cell = link.closest('td, th');
    if (cell) {
        (cell.closest('.site-table-scroll') ?? cell.closest('table')).after(reader);
        return;
    }
    const item = link.closest('li, dd');
    if (item) {
        item.append(reader);
        return;
    }
    (link.closest('p, blockquote, figure') ?? link).after(reader);
}

function part(reader, selector) {
    return reader.querySelector(selector);
}

function setStatus(reader, text) {
    part(reader, '.site-pdf-reader-status').textContent = text;
}

// PDF.js needs concrete colors, so resolve the tokens in the reader's context.
function resolveColor(reader, property) {
    const probe = document.createElement('span');
    probe.style.color = `var(${property})`;
    reader.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
}

function pageColorsFor(reader, id) {
    const mode = COLOR_MODES.find((candidate) => candidate.id === id);
    if (!mode?.background) return null;
    return {
        background: resolveColor(reader, mode.background),
        foreground: resolveColor(reader, mode.foreground)
    };
}

function labelColorButton(reader) {
    const index = COLOR_MODES.findIndex((mode) => mode.id === reader.dataset.colors);
    const next = COLOR_MODES[(index + 1) % COLOR_MODES.length];
    const label = `Page colors: ${COLOR_MODES[index].label}. Switch to ${next.label}`;
    const button = part(reader, '[data-pdf-action="colors"]');
    button.setAttribute('aria-label', label);
    button.title = label;
}

function applyColors(state) {
    const { reader, pdfViewer, pdf } = state;
    reader.dataset.colors = colorMode;
    labelColorButton(reader);
    const pageColors = pageColorsFor(reader, colorMode);
    if (!pdfViewer || JSON.stringify(pageColors) === JSON.stringify(pdfViewer.pageColors)) {
        return;
    }
    // The viewer reads its page colors when it sets up the document, so set it
    // up again and return to the same page and zoom.
    pdfViewer.pageColors = pageColors;
    if (pdf) {
        state.restore = {
            page: pdfViewer.currentPageNumber,
            scale: pdfViewer.currentScaleValue
        };
        pdfViewer.setDocument(pdf);
    }
}

function cycleColors() {
    const index = COLOR_MODES.findIndex((mode) => mode.id === colorMode);
    colorMode = COLOR_MODES[(index + 1) % COLOR_MODES.length].id;
    save(COLOR_STORAGE_KEY, colorMode);
    for (const state of readers.values()) applyColors(state);
}

function contentBox(element) {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
        left: rect.left + parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft),
        right: rect.right - parseFloat(style.borderRightWidth) - parseFloat(style.paddingRight)
    };
}

// The reader starts at the text's left edge even inside a list item or quote,
// and a widened reader runs on to the article area's right edge.
function fitWidth(state) {
    const { reader } = state;
    const parent = contentBox(reader.parentElement);
    const text = contentBox(reader.closest('.content') ?? reader.parentElement);
    const area = contentBox(reader.closest('main') ?? reader.parentElement);
    const start = Math.max(0, parent.left - text.left);
    const room = Math.max(0, area.right - parent.right);
    const canWiden = room >= MIN_WIDEN_PX;
    const wide = canWiden && widthMode === 'wide';
    reader.dataset.width = wide ? 'wide' : 'text';
    reader.style.setProperty('--site-pdf-reader-start', `${start}px`);
    reader.style.setProperty('--site-pdf-reader-end', `${wide ? room : 0}px`);

    const button = part(reader, '[data-pdf-action="width"]');
    const label = wide ? 'Fit the reader to the text' : 'Widen the reader';
    button.hidden = !canWiden;
    button.setAttribute('aria-pressed', String(wide));
    button.setAttribute('aria-label', label);
    button.title = label;
}

function toggleWidth() {
    widthMode = widthMode === 'wide' ? 'text' : 'wide';
    save(WIDTH_STORAGE_KEY, widthMode);
    for (const state of readers.values()) fitWidth(state);
}

function findQuery(state) {
    return part(state.reader, '.site-pdf-reader-find-input').value;
}

function setFindStatus(state, text) {
    part(state.reader, '.site-pdf-reader-find-status').textContent = text;
}

function showMatches(state, { current, total }) {
    if (total) {
        setFindStatus(state, `${current} of ${total}`);
    } else {
        setFindStatus(state, findQuery(state) ? 'No matches' : '');
    }
}

function runFind(state, type, findPrevious = false) {
    if (!state.eventBus) return;
    if (!findQuery(state)) {
        state.eventBus.dispatch('findbarclose', { source: state });
        setFindStatus(state, '');
        return;
    }
    state.eventBus.dispatch('find', {
        source: state,
        type,
        query: findQuery(state),
        caseSensitive: false,
        entireWord: false,
        highlightAll: true,
        findPrevious,
        matchDiacritics: false
    });
}

function toggleFind(state, open) {
    const bar = part(state.reader, '.site-pdf-reader-find');
    const input = part(state.reader, '.site-pdf-reader-find-input');
    bar.hidden = !open;
    part(state.reader, '[data-pdf-action="find"]').setAttribute('aria-expanded', String(open));
    if (open) {
        input.focus();
        input.select();
        runFind(state, '');
    } else {
        state.eventBus?.dispatch('findbarclose', { source: state });
        setFindStatus(state, '');
    }
}

function toggleOutline(state, open) {
    part(state.reader, '.site-pdf-reader-outline').hidden = !open;
    part(state.reader, '[data-pdf-action="outline"]').setAttribute('aria-expanded', String(open));
    if (open) part(state.reader, '.site-pdf-reader-outline button')?.focus();
}

function buildOutline(state, items) {
    const list = document.createElement('ul');
    for (const item of items) {
        const entry = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = item.title;
        button.addEventListener('click', () => {
            if (item.dest) {
                state.linkService.goToDestination(item.dest);
            } else if (item.url) {
                window.open(item.url, '_blank', 'noopener');
            }
            toggleOutline(state, false);
            part(state.reader, '.site-pdf-reader-scroller').focus({ preventScroll: true });
        });
        entry.append(button);
        if (item.items?.length) entry.append(buildOutline(state, item.items));
        list.append(entry);
    }
    return list;
}

async function showOutline(state) {
    const items = await state.pdf.getOutline();
    if (state.closed || !items?.length) return;
    part(state.reader, '.site-pdf-reader-outline').append(buildOutline(state, items));
    part(state.reader, '[data-pdf-action="outline"]').hidden = false;
}

function setUnlockStatus(state, text) {
    part(state.reader, '.site-pdf-reader-unlock-status').textContent = text;
}

function showProgress(state, percent) {
    const text = `Loading… ${percent}%`;
    if (state.reader.dataset.state !== 'locked') {
        setStatus(state.reader, text);
    } else if (state.unlocking) {
        setUnlockStatus(state, text);
    }
}

// An encrypted file arrives whole before it opens, so loading reports progress.
async function download(state) {
    const response = await fetch(state.link.href, { signal: state.abort.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const total = Number(response.headers.get('Content-Length'));
    const stream = response.body.getReader();
    const chunks = [];
    let received = 0;
    for (;;) {
        const { done, value } = await stream.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        if (total) showProgress(state, Math.min(100, Math.round((received / total) * 100)));
    }
    const bytes = new Uint8Array(received);
    let offset = 0;
    for (const chunk of chunks) {
        bytes.set(chunk, offset);
        offset += chunk.length;
    }
    if (new TextDecoder().decode(bytes.subarray(0, LOCK_MAGIC.length)) !== LOCK_MAGIC) {
        throw new Error('Not an encrypted PDF');
    }
    return bytes;
}

// Plain-HTTP pages, such as a preview opened from another device on the LAN,
// use the bundled fallback.
const subtle = globalThis.isSecureContext ? globalThis.crypto?.subtle : undefined;

async function deriveKey(password, salt, iterations) {
    const secret = new TextEncoder().encode(password);
    if (!subtle) return pbkdf2Async(sha256, secret, salt, { c: iterations, dkLen: 32 });
    const material = await subtle.importKey('raw', secret, 'PBKDF2', false, ['deriveBits']);
    const bits = await subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations }, material, 256);
    return new Uint8Array(bits);
}

async function decryptPart(rawKey, bytes, start, end = bytes.length) {
    const iv = bytes.slice(start, start + LOCK_NONCE_BYTES);
    const data = bytes.slice(start + LOCK_NONCE_BYTES, end);
    if (!subtle) return gcm(rawKey, iv).decrypt(data);
    const key = await subtle.importKey('raw', rawKey, 'AES-GCM', false, ['decrypt']);
    return new Uint8Array(await subtle.decrypt({ name: 'AES-GCM', iv }, key, data));
}

async function unwrapKey(bytes, password) {
    const wrappingKey = await deriveKey(password, bytes.slice(LOCK_MAGIC.length + 4, LOCK_SLOTS_START), new DataView(bytes.buffer, bytes.byteOffset).getUint32(LOCK_MAGIC.length));
    const minute = new Date().getMinutes();
    for (const slot of [minute, (minute + LOCK_SLOT_COUNT - 1) % LOCK_SLOT_COUNT]) {
        const start = LOCK_SLOTS_START + slot * LOCK_SLOT_BYTES;
        try {
            return await decryptPart(wrappingKey, bytes, start, start + LOCK_SLOT_BYTES);
        } catch {}
    }
    return null;
}

async function decryptPdf(bytes, rawKey) {
    return decryptPart(rawKey, bytes, LOCK_BODY_START);
}

function askPassword(state, downloaded) {
    const { reader } = state;
    const form = part(reader, '.site-pdf-reader-unlock');
    const input = part(reader, '.site-pdf-reader-unlock-input');
    reader.dataset.state = 'locked';
    setStatus(reader, 'Password required');
    form.hidden = false;
    input.focus({ preventScroll: true });
    return new Promise((resolve, reject) => {
        // A failed download shows the error without waiting for the password.
        downloaded.catch(reject);
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const password = input.value.trim();
            if (state.unlocking || !password) return;
            state.unlocking = true;
            setUnlockStatus(state, 'Checking…');
            try {
                const bytes = await downloaded;
                const key = await unwrapKey(bytes, password);
                if (!key) {
                    setUnlockStatus(state, 'Wrong password');
                    input.select();
                    return;
                }
                rememberKey(key);
                form.hidden = true;
                delete reader.dataset.state;
                setStatus(reader, 'Loading…');
                resolve(await decryptPdf(bytes, key));
            } catch (error) {
                reject(error);
            } finally {
                state.unlocking = false;
            }
        });
    });
}

// Opens at once if this tab already unlocked a PDF, or asks for the password
// while the file downloads.
async function unlockPdf(state) {
    const downloaded = download(state);
    downloaded.catch(() => {});
    const key = rememberedKey();
    if (key) {
        const bytes = await downloaded;
        try {
            return await decryptPdf(bytes, key);
        } catch {
            forgetKey();
        }
    }
    return askPassword(state, downloaded);
}

async function showDocument(link, state) {
    const libraries = loadPdfjs();
    const data = state.locked ? await unlockPdf(state) : null;
    const { lib, viewer } = await libraries;
    if (state.closed) return;

    const { reader } = state;
    if (data) {
        // The Blob keeps its own copy, since PDF.js takes over the bytes.
        state.objectUrl = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
        const open = part(reader, '[data-pdf-action="open"]');
        open.href = state.objectUrl;
        open.hidden = false;
    }
    const container = part(reader, '.site-pdf-reader-scroller');
    const eventBus = new viewer.EventBus();
    const linkService = new viewer.PDFLinkService({
        eventBus,
        externalLinkTarget: viewer.LinkTarget.BLANK,
        externalLinkRel: 'noopener noreferrer'
    });
    const findController = new viewer.PDFFindController({
        eventBus,
        linkService,
        updateMatchesCountOnProgress: true
    });
    const pdfViewer = new viewer.PDFViewer({
        container,
        eventBus,
        linkService,
        findController,
        l10n: new viewer.GenericL10n(),
        removePageBorders: true,
        pageColors: pageColorsFor(reader, colorMode)
    });
    linkService.setViewer(pdfViewer);
    Object.assign(state, { eventBus, linkService, pdfViewer });

    const showPage = () => {
        setStatus(reader, `Page ${pdfViewer.currentPageNumber} of ${pdfViewer.pagesCount}`);
    };
    eventBus.on('pagesinit', () => {
        const { restore } = state;
        state.restore = null;
        pdfViewer.currentScaleValue = restore?.scale ?? 'page-width';
        if (restore) pdfViewer.currentPageNumber = restore.page;
        showPage();
        if (!part(reader, '.site-pdf-reader-find').hidden) runFind(state, '');
    });
    eventBus.on('pagechanging', showPage);
    eventBus.on('updatefindmatchescount', ({ matchesCount }) => showMatches(state, matchesCount));
    eventBus.on('updatefindcontrolstate', ({ state: findState, matchesCount }) => {
        if (findState === viewer.FindState.PENDING) return;
        showMatches(state, matchesCount);
    });

    // Keep pages fitted to the reader's width until the reader zooms.
    state.resizeObserver = new ResizeObserver(() => {
        if (pdfViewer.pagesCount && pdfViewer.currentScaleValue === 'page-width') {
            pdfViewer.currentScaleValue = 'page-width';
        }
    });
    state.resizeObserver.observe(container);

    state.loadingTask = lib.getDocument({
        ...(data ? { data } : { url: link.href }),
        cMapUrl: `${PDFJS_ROOT}cmaps/`,
        cMapPacked: true,
        standardFontDataUrl: `${PDFJS_ROOT}standard_fonts/`,
        wasmUrl: `${PDFJS_ROOT}wasm/`,
        iccUrl: `${PDFJS_ROOT}iccs/`,
        isEvalSupported: false
    });
    const pdf = await state.loadingTask.promise;
    if (state.closed) return;
    state.pdf = pdf;
    pdfViewer.setDocument(pdf);
    linkService.setDocument(pdf, null);
    await showOutline(state);
}

function handleAction(state, action) {
    const { pdfViewer } = state;
    if (action === 'close') closeReader(state.link, { restoreFocus: true });
    if (action === 'zoom-in') pdfViewer?.increaseScale();
    if (action === 'zoom-out') pdfViewer?.decreaseScale();
    if (action === 'colors') cycleColors();
    if (action === 'width') toggleWidth();
    if (action === 'find') {
        toggleFind(state, part(state.reader, '.site-pdf-reader-find').hidden);
    }
    if (action === 'find-next') runFind(state, 'again');
    if (action === 'find-previous') runFind(state, 'again', true);
    if (action === 'find-close') {
        toggleFind(state, false);
        part(state.reader, '[data-pdf-action="find"]').focus();
    }
    if (action === 'outline') {
        toggleOutline(state, part(state.reader, '.site-pdf-reader-outline').hidden);
    }
}

function handleKeydown(state, event) {
    const { reader } = state;
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'f') {
        event.preventDefault();
        toggleFind(state, true);
        return;
    }
    if (event.key !== 'Escape') return;
    event.preventDefault();
    if (event.target.closest('.site-pdf-reader-find')) {
        handleAction(state, 'find-close');
    } else if (!part(reader, '.site-pdf-reader-outline').hidden) {
        toggleOutline(state, false);
        part(reader, '[data-pdf-action="outline"]').focus();
    } else {
        closeReader(state.link, { restoreFocus: true });
    }
}

function openReader(link) {
    const reader = template.content.firstElementChild.cloneNode(true);
    const title = link.textContent.trim();
    const locked = new URL(link.href).pathname.toLowerCase().endsWith(LOCKED_SUFFIX);
    const state = { link, reader, locked, closed: false, abort: new AbortController() };
    readerCount += 1;
    reader.id = `site-pdf-reader-${readerCount}`;
    reader.setAttribute('aria-label', `${title} (PDF)`);
    part(reader, '.site-pdf-reader-title').textContent = title;
    // An encrypted file opens in a new tab only once it is decrypted.
    const open = part(reader, '[data-pdf-action="open"]');
    if (locked) {
        open.hidden = true;
    } else {
        open.href = link.href;
    }

    reader.addEventListener('click', (event) => {
        const button = event.target.closest('button[data-pdf-action]');
        if (button) handleAction(state, button.dataset.pdfAction);
    });
    reader.addEventListener('keydown', (event) => handleKeydown(state, event));
    const input = part(reader, '.site-pdf-reader-find-input');
    input.addEventListener('input', () => runFind(state, ''));
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            runFind(state, 'again', event.shiftKey);
        }
    });

    insertReader(link, reader);
    readers.set(link, state);
    applyColors(state);
    fitWidth(state);
    // Hiding a side pane or resizing the window changes the room to widen into.
    state.layoutObserver = new ResizeObserver(() => fitWidth(state));
    state.layoutObserver.observe(reader.parentElement);
    state.layoutObserver.observe(reader.closest('main') ?? reader.parentElement);
    link.setAttribute('aria-expanded', 'true');
    link.setAttribute('aria-controls', reader.id);
    setStatus(reader, 'Loading…');

    showDocument(link, state).catch(() => {
        if (state.closed) return;
        reader.dataset.state = 'error';
        part(reader, '.site-pdf-reader-unlock').hidden = true;
        setStatus(reader, locked ? 'This PDF can’t be shown here.' : 'This PDF can’t be shown here. Open it in a new tab instead.');
    });
}

function closeReader(link, { restoreFocus = false } = {}) {
    const state = readers.get(link);
    if (!state) return;
    readers.delete(link);
    state.closed = true;
    state.abort.abort();
    if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
    state.resizeObserver?.disconnect();
    state.layoutObserver.disconnect();
    state.pdfViewer?.cleanup();
    state.loadingTask?.destroy();
    state.reader.remove();
    link.setAttribute('aria-expanded', 'false');
    if (restoreFocus) link.focus();
}

if (template) {
    // Capture runs before the analytics listener, so opening a reader is not
    // reported as a download.
    document.addEventListener(
        'click',
        (event) => {
            const link = event.target.closest?.(LINK_SELECTOR);
            if (!link || event.defaultPrevented || event.button !== 0) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            if (readers.has(link)) {
                closeReader(link);
            } else {
                openReader(link);
            }
        },
        true
    );

    // Site-theme pages follow Light/Dark switches while a reader is open.
    new MutationObserver(() => {
        for (const state of readers.values()) {
            if (colorMode === 'theme') applyColors(state);
        }
    }).observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style'] });
}
