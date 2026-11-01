import { outline } from '@params';
import { initOutlineDisclosures, markInitialOutline } from './navigation/outline.mjs';
import { placeHeaderToggle } from './navigation/header.mjs';
import { placePaneToggle } from './navigation/sidebar-visibility.mjs';

// Run after both outline copies and both rails, before deferred scripts and the first
// paint, so the pane headings and the current section do not change after the page appears.
initOutlineDisclosures(outline.storageKey);
markInitialOutline();
placePaneToggle('sidebar');
placePaneToggle('outline');
// After the outline toggle, so a collapsed outline's rail keeps its button order.
placeHeaderToggle();
