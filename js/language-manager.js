// Language Manager - Shared functionality for language handling
const LanguageManager = {
    // Constants
    STORAGE_KEY: 'preferred_language',
    DEFAULT_LANG: 'en',
  
    // Get stored language preference
    getStoredLanguage() {
      return localStorage.getItem(this.STORAGE_KEY) || this.DEFAULT_LANG;
    },
  
    // Save language preference
    setStoredLanguage(lang) {
      localStorage.setItem(this.STORAGE_KEY, lang);
    },
  
    // Initialize language based on stored preference
    async initializeLanguage() {
      const storedLang = this.getStoredLanguage();
      const currentLang = document.getElementById('currentLang');
      if (currentLang) {
        currentLang.textContent = storedLang.toUpperCase();
      }
      
      // Set initial direction - always keep LTR to maintain layout (reverting per user request)
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = storedLang;
  
      // Load initial translations if needed
      if (storedLang === 'ar') {
        await this.loadTranslations(storedLang);
      }
  
      return storedLang;
    },
  
    // Handle language switch
    async switchLanguage(lang) {
      this.setStoredLanguage(lang);
      // Always keep direction LTR to maintain layout (reverting per user request)
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = lang;
      
      
      // Load translations for all languages
      const translations = await this.loadTranslations(lang);
  
      // Apply translations to the page
      this.applyTranslations(translations);
  
      return lang;
    },
  
  
    // Load translations from JSON files
    async loadTranslations(lang) {
      try {
        // Remove any /ar/ prefix from the current path when constructing JSON paths
        const basePath = window.location.pathname.replace(/^\/ar\//, '/');
        
        // Load both translation files
        const [baseTranslations, flavorTranslations] = await Promise.all([
          fetch(`./lang/${lang}.json`).then(res => res.json()),
          fetch(`./lang/flavors-${lang}.json`).then(res => res.json()).catch(() => ({}))
        ]);
  
        // Merge translations
        return {
          ...baseTranslations,
          flavors: flavorTranslations
        };
      } catch (error) {
        console.error('Error loading translations:', error);
        return null;
      }
    },
  
    // Fix navigation links when language is Arabic
    fixNavigationLinks() {
      const currentLang = this.getStoredLanguage();
      if (currentLang === 'ar') {
        document.querySelectorAll('a[href], [onclick*="location.href"]').forEach(el => {
          if (el.hasAttribute('href')) {
            const href = el.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('#')) {
              el.setAttribute('href', href.replace(/^\/ar\//, '/'));
            }
          }
          if (el.hasAttribute('onclick')) {
            const onclick = el.getAttribute('onclick');
            if (onclick && onclick.includes('location.href')) {
              el.setAttribute('onclick', onclick.replace(/^\/ar\//, '/'));
            }
          }
        });
      }
    }
  };
  
  // Helper to get nested value by dot notation key from object
  function getNestedValue(obj, key) {
    return key.split('.').reduce((o, k) => (o && o[k] !== undefined) ? o[k] : null, obj);
  }

  // Apply translations to page elements by replacing text content only
  LanguageManager.applyTranslations = function(translations) {
    if (!translations) return;
    // For each element with data-i18n attribute, get nested translation value and replace text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = getNestedValue(translations, key);
      if (typeof translation === 'string') {
        el.textContent = translation;
      }
    });
  };

  // Export for use in other files
  window.LanguageManager = LanguageManager;
  
  // Fix navigation links when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    LanguageManager.fixNavigationLinks();
  });
  