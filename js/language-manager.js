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
      
      // Set initial direction
      document.documentElement.dir = storedLang === 'ar' ? 'rtl' : 'ltr';
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
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
      
      // Load translations
      if (lang === 'ar') {
        await this.loadTranslations(lang);
      }
  
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
  
  // Apply translations to page elements by replacing text content only
  LanguageManager.applyTranslations = function(translations) {
    if (!translations) return;
    // For each key in translations, find elements with data-i18n attribute matching the key and replace text content
    Object.keys(translations).forEach(key => {
      const elements = document.querySelectorAll(`[data-i18n="${key}"]`);
      elements.forEach(el => {
        if (typeof translations[key] === 'string') {
          el.textContent = translations[key];
        }
      });
    });
  };

  // Export for use in other files
  window.LanguageManager = LanguageManager;
  
  // Fix navigation links when DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    LanguageManager.fixNavigationLinks();
  });
  