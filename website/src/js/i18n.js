class I18n {
  constructor() {
    this.translations = {};
    this.currentLocale = 'fr';
    this.defaultLocale = 'fr';
    this.supportedLocales = ['fr', 'en'];
  }

  async init() {
    // Load saved locale preference
    const savedLocale = localStorage.getItem('locale');
    if (savedLocale && this.supportedLocales.includes(savedLocale)) {
      this.currentLocale = savedLocale;
    } else {
      // Detect browser language
      const browserLocale = navigator.language.split('-')[0];
      this.currentLocale = this.supportedLocales.includes(browserLocale) 
        ? browserLocale 
        : this.defaultLocale;
    }

    // Load translations
    await this.loadTranslations(this.currentLocale);
    this.updateUI();
  }

  async loadTranslations(locale) {
    try {
      const response = await fetch(`/i18n/${locale}.json`);
      this.translations[locale] = await response.json();
    } catch (error) {
      console.error(`Failed to load translations for ${locale}:`, error);
      // Fallback to default locale if not already trying to load it
      if (locale !== this.defaultLocale) {
        await this.loadTranslations(this.defaultLocale);
      }
    }
  }

  async setLocale(locale) {
    if (!this.supportedLocales.includes(locale)) {
      console.error(`Unsupported locale: ${locale}`);
      return;
    }

    // Load translations if not already loaded
    if (!this.translations[locale]) {
      await this.loadTranslations(locale);
    }

    this.currentLocale = locale;
    localStorage.setItem('locale', locale);
    this.updateUI();

    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('localeChanged', { detail: { locale } }));
  }

  translate(key, params = {}) {
    const keys = key.split('.');
    let value = this.translations[this.currentLocale];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Missing translation key: ${key}`);
        return key;
      }
    }

    // Replace parameters
    return value.replace(/\${(\w+)}/g, (_, param) => params[param] || '');
  }

  updateUI() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
      const key = element.dataset.i18n;
      element.textContent = this.translate(key);
    });

    // Update all elements with data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
      const key = element.dataset.i18nPlaceholder;
      element.placeholder = this.translate(key);
    });

    // Update html lang attribute
    document.documentElement.lang = this.currentLocale;

    // Update language selector if it exists
    const selector = document.querySelector('.language-selector');
    if (selector) {
      const button = selector.querySelector('.language-selector-button span');
      button.textContent = this.translations[this.currentLocale].meta.language;
    }
  }
}

// Initialize
const i18n = new I18n();
export default i18n;
