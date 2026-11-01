import { sections } from '@params';
import { initSectionNavigation, initSectionToggles } from './navigation/sections.mjs';
import { syncSidebarFade } from './navigation/reading-fade.mjs';

// Run beside the rendered sidebar, before deferred scripts and the first paint.
initSectionToggles(sections.storageKey);
initSectionNavigation();
syncSidebarFade();

// Breadcrumbs follow the sidebar in the HTML. Measure their wrapping as soon as
// they are parsed, rather than waiting for the deferred site bundle.
function includeContextHeader() {
    const breadcrumb = document.querySelector('.breadcrumb');
    if (!breadcrumb && document.readyState === 'loading') {
        requestAnimationFrame(includeContextHeader);
        return;
    }
    const height = breadcrumb?.getBoundingClientRect().height;
    if (height) document.documentElement.style.setProperty('--site-breadcrumb-card-height', `${height}px`);
    initSectionNavigation();
}
requestAnimationFrame(includeContextHeader);
