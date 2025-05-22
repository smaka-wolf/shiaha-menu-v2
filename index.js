document.addEventListener('DOMContentLoaded', async () => {
    // Initialize with stored language preference
    const currentLanguage = await LanguageManager.initializeLanguage();
  
    // Menu button functionality
    const menuButton = document.getElementById('menuButton');
    const menuOptions = document.getElementById('menuOptions');
    
    menuButton.addEventListener('click', (e) => {
      e.stopPropagation();
      menuOptions.classList.toggle('hidden');
    });
  
    // Prevent menu from closing when clicking inside it
    menuOptions.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  
    // Language switcher functionality
    const languageButton = document.getElementById('languageButton');
    const languageMenu = document.getElementById('languageMenu');
    const currentLang = document.getElementById('currentLang');
  
    // Toggle language menu
    languageButton.addEventListener('click', (e) => {
      e.stopPropagation();
      languageMenu.classList.toggle('hidden');
    });
  
    // Close menus when clicking outside
    document.addEventListener('click', (e) => {
      if (!menuButton.contains(e.target) && !menuOptions.contains(e.target)) {
        menuOptions.classList.add('hidden');
      }
      if (!languageButton.contains(e.target) && !languageMenu.contains(e.target)) {
        languageMenu.classList.add('hidden');
      }
    });
  
    // Prevent menu from closing when clicking inside it
    languageMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  
    // Update page content with translations
    async function updatePageContent(lang) {
      try {
        const translations = await LanguageManager.loadTranslations(lang);
        if (!translations) return;
  
        // Update menu items
        document.querySelectorAll('#menuOptions a').forEach((link, index) => {
          const keys = ['food', 'beverage', 'shisha'];
          link.textContent = translations.menu[keys[index]];
        });
  
        // Update search placeholder
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
          searchInput.placeholder = translations.search.placeholder;
        }
  
        // Update search button aria-label
        const searchButton = document.getElementById('searchButton');
        if (searchButton) {
          searchButton.setAttribute('aria-label', translations.search.button);
        }
  
        // Update chat button aria-label
        const chatButton = document.querySelector('button[aria-label="Chat"]');
        if (chatButton) {
          chatButton.setAttribute('aria-label', translations.chat.button);
        }
  
        // Update menu button text
        const menuBtn = document.getElementById('menuButton');
        if (menuBtn) {
          menuBtn.textContent = translations.menu.button;
        }
      } catch (error) {
        console.error('Error updating content:', error);
      }
    }
  
    // Handle language switching
    window.switchLanguage = async (lang) => {
      currentLang.textContent = lang.toUpperCase();
      languageMenu.classList.add('hidden');
      
      // Update language using Language Manager
      LanguageManager.switchLanguage(lang);
      await updatePageContent(lang);
    };
  
    // Search functionality
    const searchButton = document.getElementById('searchButton');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
  
    // Toggle search input visibility
    searchButton.addEventListener('click', (e) => {
      e.stopPropagation();
      searchInput.classList.toggle('hidden');
      if (!searchInput.classList.contains('hidden')) {
        searchInput.focus();
      } else {
        searchResults.classList.add('hidden');
      }
    });
  
    // Close search when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !searchButton.contains(e.target)) {
        searchInput.classList.add('hidden');
        searchResults.classList.add('hidden');
      }
    });
  
    // Initialize with current language
    await updatePageContent(currentLanguage);
  });
  