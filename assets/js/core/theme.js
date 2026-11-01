// Cycle preferences while Hextra's head script applies the effective color scheme.
(function () {
    const themes = ['light', 'dark', 'system'];
    const defaultTheme = '{{ site.Params.theme.default | default "system" }}';
    const buttons = [...document.querySelectorAll('.hextra-theme-toggle')];
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
    let theme = defaultTheme;

    try {
        theme = localStorage.getItem('color-theme') || defaultTheme;
    } catch {}
    if (!themes.includes(theme)) theme = 'system';

    function nextTheme() {
        return themes[(themes.indexOf(theme) + 1) % themes.length];
    }

    function render() {
        setTheme(theme);
        for (const button of buttons) {
            button.parentElement.dataset.theme = theme;
            const label = (mode) => button.querySelector(`.site-theme-icon[data-theme-choice="${mode}"]`).dataset.themeLabel;
            const description = `Theme: ${label(theme)}. Switch to ${label(nextTheme())}.`;
            button.setAttribute('aria-label', description);
            button.title = description;
        }
    }

    for (const button of buttons) {
        button.addEventListener('click', () => {
            theme = nextTheme();
            try {
                localStorage.setItem('color-theme', theme);
            } catch {}
            render();
        });
    }

    systemTheme.addEventListener('change', () => {
        if (theme === 'system') setTheme(theme);
    });
    render();
})();
