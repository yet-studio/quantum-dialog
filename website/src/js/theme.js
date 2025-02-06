// Theme Toggle
const themeToggle = document.querySelector('.theme-toggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(isDark) {
    document.documentElement.classList.toggle('dark-theme', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Initialize theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme === 'dark');
} else {
    setTheme(prefersDark.matches);
}

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Watch for system theme changes
prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        setTheme(e.matches);
    }
});

// Language Selector
const langSelector = document.querySelector('.language-selector-button');
const langMenu = document.querySelector('.language-menu');

langSelector.addEventListener('click', () => {
    const isExpanded = langSelector.getAttribute('aria-expanded') === 'true';
    langSelector.setAttribute('aria-expanded', !isExpanded);
    langMenu.classList.toggle('is-open');
});

// Close language menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.language-selector')) {
        langSelector.setAttribute('aria-expanded', 'false');
        langMenu.classList.remove('is-open');
    }
});
