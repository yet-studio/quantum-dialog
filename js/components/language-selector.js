import i18n from '../i18n.js';

class LanguageSelector {
  constructor(element) {
    this.element = element;
    this.button = element.querySelector('.language-selector-button');
    this.menu = element.querySelector('.language-menu');
    this.options = element.querySelectorAll('.language-option');
    
    this.init();
  }

  init() {
    // Toggle menu on button click
    this.button.addEventListener('click', () => this.toggleMenu());

    // Handle option selection
    this.options.forEach(option => {
      option.addEventListener('click', (e) => this.selectLanguage(e));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.element.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMenu();
      }
    });

    // Update active state on locale change
    window.addEventListener('localeChanged', ({ detail }) => {
      this.updateActiveState(detail.locale);
    });

    // Set initial active state
    this.updateActiveState(i18n.currentLocale);
  }

  toggleMenu() {
    const isOpen = this.element.classList.toggle('open');
    
    if (isOpen) {
      // Set aria-expanded
      this.button.setAttribute('aria-expanded', 'true');
      
      // Focus first option
      const firstOption = this.menu.querySelector('.language-option');
      if (firstOption) firstOption.focus();
    } else {
      this.button.setAttribute('aria-expanded', 'false');
    }
  }

  closeMenu() {
    this.element.classList.remove('open');
    this.button.setAttribute('aria-expanded', 'false');
  }

  async selectLanguage(e) {
    const locale = e.target.dataset.locale;
    if (!locale) return;

    await i18n.setLocale(locale);
    this.closeMenu();
  }

  updateActiveState(locale) {
    this.options.forEach(option => {
      const isActive = option.dataset.locale === locale;
      option.classList.toggle('active', isActive);
      option.setAttribute('aria-selected', isActive);
    });
  }
}

// Initialize all language selectors on the page
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.language-selector').forEach(element => {
    new LanguageSelector(element);
  });
});
