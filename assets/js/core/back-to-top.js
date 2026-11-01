// Keep this action available independently of page and outline scroll positions.
document.addEventListener('DOMContentLoaded', function () {
    for (const button of document.querySelectorAll('[data-back-to-top]')) {
        button.addEventListener('click', function () {
            const popover = button.closest('[popover]');

            for (const panel of document.querySelectorAll('.site-toc-scroll')) panel.scrollTop = 0;

            window.scroll({
                top: 0,
                left: 0,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
            });
            if (popover?.matches(':popover-open')) popover.hidePopover();
        });
    }
});
