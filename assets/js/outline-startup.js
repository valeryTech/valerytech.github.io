import { outline } from '@params';
import { initOutlineDisclosures } from './navigation/outline.mjs';

// Run after both outline copies, before deferred scripts and the first paint.
initOutlineDisclosures(outline.storageKey);
