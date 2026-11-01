import { syncReadingFade } from './navigation/reading-fade.mjs';

// Run after the article and its fade, before deferred scripts and the first paint, so the
// fade over the article's bottom edge is in place when the page appears.
syncReadingFade();
