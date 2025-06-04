document.addEventListener('DOMContentLoaded', async () => {
    // Initialize with stored language preference
    const currentLanguage = await LanguageManager.initializeLanguage();
  
    // Menu button functionality
    const menuButton = document.getElementById('menuButton');
    const menuOptions = document.getElementById('menuOptions');
    
    if (menuButton && menuOptions) {
      menuButton.addEventListener('click', (e) => {
        e.stopPropagation();
        menuOptions.classList.toggle('hidden');
      });
    
      // Prevent menu from closing when clicking inside it
      menuOptions.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  
    // Language switcher functionality
    const languageButton = document.getElementById('languageButton');
    const languageMenu = document.getElementById('languageMenu');
    const currentLang = document.getElementById('currentLang');
  
    if (languageButton && languageMenu && currentLang) {
      // Toggle language menu
      languageButton.addEventListener('click', (e) => {
        e.stopPropagation();
        languageMenu.classList.toggle('hidden');
      });
    
      // Close menus when clicking outside
      document.addEventListener('click', (e) => {
        if (!languageButton.contains(e.target) && !languageMenu.contains(e.target)) {
          languageMenu.classList.add('hidden');
        }
      });
    
      // Prevent menu from closing when clicking inside it
      languageMenu.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  
    // Close menuOptions when clicking outside
    if (menuButton && menuOptions) {
      document.addEventListener('click', (e) => {
        if (!menuButton.contains(e.target) && !menuOptions.contains(e.target)) {
          menuOptions.classList.add('hidden');
        }
      });
    }
  
    // Initialize Fuse.js for search
    let fuse = null;
    try {
      const response = await fetch('lang/flavors-en.json');
      const data = await response.json();
  
      // Flatten the flavors data into an array for Fuse.js
      const flattenFlavors = (data) => {
        const items = [];
        for (const categoryKey in data) {
          const category = data[categoryKey];
          if (category.flavors) {
            for (const flavorName in category.flavors) {
              const flavor = category.flavors[flavorName];
              if (typeof flavor === 'string') {
                items.push({
                  name: flavor,
                  section: categoryKey,
                  page: `${categoryKey.replace(/-/g, ' ')}.html`
                });
              } else if (typeof flavor === 'object') {
                items.push({
                  name: flavor.name || flavorName,
                  description: flavor.description || '',
                  section: categoryKey,
                  page: `${categoryKey.replace(/-/g, ' ')}.html`
                });
              }
            }
          } else if (category.brands) {
            for (const brandKey in category.brands) {
              const brand = category.brands[brandKey];
              if (brand.flavors) {
                for (const flavorName in brand.flavors) {
                  const flavor = brand.flavors[flavorName];
                  items.push({
                    name: flavor,
                    section: categoryKey,
                    page: `${categoryKey.replace(/-/g, ' ')}.html`
                  });
                }
              }
            }
          } else {
            // For signature-mix or other categories with direct flavors object
            for (const flavorKey in category) {
              const flavor = category[flavorKey];
              if (typeof flavor === 'string') {
                items.push({
                  name: flavor,
                  section: categoryKey,
                  page: `${categoryKey.replace(/-/g, ' ')}.html`
                });
              } else if (typeof flavor === 'object') {
                items.push({
                  name: flavor.name || flavorKey,
                  description: flavor.description || '',
                  section: categoryKey,
                  page: `${categoryKey.replace(/-/g, ' ')}.html`
                });
              }
            }
          }
        }
        return items;
      };
  
      const items = flattenFlavors(data);
  
      fuse = new Fuse(items, {
        keys: ['name', 'description'],
        threshold: 0.3,
        ignoreLocation: true,
      });
    } catch (error) {
      console.error('Error initializing search:', error);
    }
  
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
      if (currentLang && languageMenu) {
        currentLang.textContent = lang.toUpperCase();
        languageMenu.classList.add('hidden');
      }
      
      // Update language using Language Manager
      LanguageManager.switchLanguage(lang);
      await updatePageContent(lang);
    };
  
    // Search functionality
    if (searchButton && searchInput) {
      // Toggle search input visibility
      searchButton.addEventListener('click', (e) => {
        e.stopPropagation();
        console.log('Search button clicked. Input hidden:', searchInput.classList.contains('hidden'));
        searchInput.classList.toggle('hidden');
        if (!searchInput.classList.contains('hidden')) {
          searchInput.focus();
        } else {
          if (searchResults) {
            searchResults.classList.add('hidden');
          }
        }
      });
      console.log('Search button event listener attached');
  
      // Search input event listener
      searchInput.addEventListener('input', (e) => {
        console.log('Search input event fired with value:', e.target.value);
        const value = e.target.value;
        if (!value) {
          if (searchResults) {
            searchResults.classList.add('hidden');
          }
          return;
        }
  
        // Perform search
        const results = fuse ? fuse.search(value) : [];
  
        // Clear previous results
        if (searchResults) {
          searchResults.innerHTML = '';
        }
  
        if (results.length > 0) {
          // Create results list
          results.slice(0, 5).forEach(result => {
            const div = document.createElement('div');
            div.className = 'p-2 hover:bg-gray-100 cursor-pointer';
            // Create a span for flavor name with gray text color
            const nameSpan = document.createElement('span');
            nameSpan.className = 'text-gray-700';
            nameSpan.textContent = result.item.name;
            div.appendChild(nameSpan);
            if (result.item.description) {
              const small = document.createElement('small');
              small.className = 'block text-gray-500 text-xs mt-1';
              small.textContent = result.item.description;
              div.appendChild(small);
            }
  
            // Handle click on result
            div.addEventListener('click', () => {
              const section = document.getElementById(result.item.section);
              if (section) {
                section.scrollIntoView({ behavior: 'smooth' });
                searchInput.value = '';
                if (searchResults) {
                  searchResults.classList.add('hidden');
                }
                searchInput.classList.add('hidden');
  
                // Navigate to corresponding flavor page after scroll
                const pageMap = {
                  "arabic-style": "Arabic Flavors.html",
                  "turkish-style": "Turkish Flavors.html",
                  "russian-style": "rusian flavors.html",
                  "signature-mix": "Signature Mix Flavors.html"
                };
                setTimeout(() => {
                  if (result.item.section && pageMap[result.item.section]) {
                    window.location.href = pageMap[result.item.section];
                  } else if (result.item.page) {
                    window.location.href = result.item.page;
                  }
                }, 500);
              }
            });
  
            if (searchResults) {
              searchResults.appendChild(div);
            }
          });
  
          if (searchResults) {
            searchResults.classList.remove('hidden');
          }
        } else {
          if (searchResults) {
            searchResults.classList.add('hidden');
          }
        }
      });
  
      // Close search when clicking outside
      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchButton.contains(e.target)) {
          searchInput.classList.add('hidden');
          if (searchResults) {
            searchResults.classList.add('hidden');
          }
        }
      });
  
      console.log('Search button event listener attached');
    }
  
    // Initialize with current language
    await updatePageContent(currentLanguage);
  });
  