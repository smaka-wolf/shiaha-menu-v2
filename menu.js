// Global stores
let translations = {};
let flavorTranslations = {};
let currentLanguage = 'en';

// Flavor data with sections
const flavors = [
  // Arabic Style
  { name: "Grape Mint", section: "arabic-style", page: "Arabic Flavors.html" },
  { name: "Grape", section: "arabic-style", page: "Arabic Flavors.html" },
  { name: "Double Apple", section: "arabic-style", page: "Arabic Flavors.html" },
  { name: "Gum", section: "arabic-style", page: "Arabic Flavors.html" },
  { name: "Gum Mint", section: "arabic-style", page: "Arabic Flavors.html" },
  { name: "Mint", section: "arabic-style", page: "Arabic Flavors.html" },
  { name: "Gum Cinnamon", section: "arabic-style", page: "Arabic Flavors.html" },
  { name: "Orange", section: "arabic-style", page: "Arabic Flavors.html" },
  { name: "Lemon Mint", section: "arabic-style", page: "Arabic Flavors.html" },

  // Turkish Style
  { name: "Istanbul Night", section: "turkish-style", page: "Turkish Flavors.html" },
  { name: "Marbella", section: "turkish-style", page: "Turkish Flavors.html" },
  { name: "Lime Spice Peach", section: "turkish-style", page: "Turkish Flavors.html" },
  { name: "Love 66", section: "turkish-style", page: "Turkish Flavors.html" },
  { name: "Lady Killer", section: "turkish-style", page: "Turkish Flavors.html" },
  { name: "Watermelon", section: "turkish-style", page: "Turkish Flavors.html" },
  { name: "Melon", section: "turkish-style", page: "Turkish Flavors.html" },
  { name: "Peach", section: "turkish-style", page: "Turkish Flavors.html" },
  { name: "Blueberry", section: "turkish-style", page: "Turkish Flavors.html" },
  { name: "Sweet Melon", section: "turkish-style", page: "Turkish Flavors.html" },

  // Russian Style - Darkside
  { name: "Needles", section: "russian-style", page: "rusianflavor.html" },
  { name: "Lemon Blast", section: "russian-style", page: "rusianflavor.html" },
  { name: "Cola", section: "russian-style", page: "rusianflavor.html" },
  { name: "Supernova", section: "russian-style", page: "rusianflavor.html" },
  { name: "Falling Star", section: "russian-style", page: "rusianflavor.html" },
  
  // Russian Style - Starline
  { name: "Blueberry Crumble", section: "russian-style", page: "rusianflavor.html" },
  { name: "Belgium Waffles", section: "russian-style", page: "rusianflavor.html" },
  { name: "Strawberry Millefeuille", section: "russian-style", page: "rusianflavor.html" },
  { name: "Banana", section: "russian-style", page: "rusianflavor.html" },
  
  // Russian Style - Musthave
  { name: "Ananas Shock", section: "russian-style", page: "rusianflavor.html" },
  { name: "Melonade", section: "russian-style", page: "rusianflavor.html" },
  { name: "Kiwi Smoothie", section: "russian-style", page: "rusianflavor.html" },
  { name: "Vanilla", section: "russian-style", page: "rusianflavor.html" },
  { name: "Garnet", section: "russian-style", page: "rusianflavor.html" },
  { name: "Coconut", section: "russian-style", page: "rusianflavor.html" },
  { name: "Raspberry", section: "russian-style", page: "rusianflavor.html" },
  { name: "Epic Yoghurt", section: "russian-style", page: "rusianflavor.html" },

  // Signature Mix
  { name: "Blume", section: "signature-mix", page: "signature mix.html", description: "Lady killer 25%, Watermelon 25%, Blueberry 50%" },
  { name: "Luxuria", section: "signature-mix", page: "signature mix.html", description: "Kiwi Smoothie 40%, Grape Mint 60%, Kiwi Juice 250 Ml" },
  { name: "Leonardo", section: "signature-mix", page: "signature mix.html", description: "Gum Mint 20%, Orange 30%, Vanilla 50%" },
  { name: "Exotic Dreams", section: "signature-mix", page: "signature mix.html", description: "Melon 40%, Banana 40%, Coconut 20%" },
  { name: "Moonlight", section: "signature-mix", page: "signature mix.html", description: "Falling Star 40%, Istanbul Night 50%, Supernova 10%" },
  { name: "Love Berry", section: "signature-mix", page: "signature mix.html", description: "Alternative Cherry 40%, Needles 20%, Pomegranate 40%" },
  { name: "Mr. AXA", section: "signature-mix", page: "signature mix.html", description: "Melon 50%, Melonade 45%, Supernova 5%" },
  { name: "Grandmother Cake", section: "signature-mix", page: "signature mix.html", description: "Belgium Waffles 20%, Melonade 20%, Blueberry Crumble 60%" },
  { name: "Olala", section: "signature-mix", page: "signature mix.html", description: "Cola 25%, Lemon Mint 75%" }
];

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize with stored language preference
  currentLanguage = await LanguageManager.initializeLanguage();

  // Load language data
  async function loadLanguageData(lang) {
    try {
      translations[lang] = await LanguageManager.loadTranslations(lang);
    } catch (error) {
      console.error(`Failed to load ${lang} translations:`, error);
    }
  }

  // Create translated flavors array
  function getTranslatedFlavors(lang) {
    if (lang === 'en') return flavors;
    
    return flavors.map(flavor => {
      const section = flavor.section;
      const translated = {
        ...flavor,
        originalName: flavor.name
      };

      if (translations[lang]?.flavors) {
        if (section === 'signature-mix') {
          const mixTranslation = translations[lang].flavors[section][flavor.name];
          if (mixTranslation) {
            translated.name = mixTranslation.name;
            translated.description = mixTranslation.description;
          }
        } else {
          const sectionTranslation = translations[lang].flavors[section];
          if (sectionTranslation && sectionTranslation[flavor.name]) {
            translated.name = sectionTranslation[flavor.name];
          }
        }
      }

      return translated;
    });
  }

  // Update page content with translations
  async function updatePageContent(lang) {
    await loadLanguageData(lang);
    const t = translations[lang];
    if (!t) return;

    // Update page title
    document.querySelector('h1').textContent = t.menu.title;

    // Update sections
    ['arabic', 'turkish', 'russian', 'signature'].forEach(style => {
      const section = document.getElementById(`${style}-style`);
      if (section) {
        const title = section.querySelector('h2');
        const price = section.querySelector('p');
        const badge = section.querySelector('.rotate-\\[-45deg\\]');
        const link = section.querySelector('.py-3');

        if (title) title.textContent = t.sections[style].title;
        if (price) price.textContent = t.sections[style].price;
        if (badge) badge.textContent = t.sections[style].badge;
        if (link) link.textContent = t.sections[style].link;
      }
    });

    // Update search placeholder
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.placeholder = t.search.placeholder;
    }

    // Update flavor categories in header
    const categoryLabels = document.querySelectorAll('.scrollbar-hide a span');
    categoryLabels.forEach((span, index) => {
      const keys = ['arabic', 'turkish', 'russian', 'signature'];
      if (span.classList.contains('text-xs')) {
        span.textContent = t.styles[keys[Math.floor(index/2)]];
      }
    });

    // Update search functionality with translated flavors
    const translatedFlavors = getTranslatedFlavors(lang);
    fuse = new Fuse(translatedFlavors, fuseOptions);
  }

  // Initialize Fuse with options
  const fuseOptions = {
    keys: ['name', 'description', 'originalName'],
    threshold: 0.3,
    minMatchCharLength: 2
  };
  let fuse = new Fuse(flavors, fuseOptions);

  // Language switcher functionality
  const languageButton = document.getElementById('languageButton');
  const languageMenu = document.getElementById('languageMenu');
  const currentLang = document.getElementById('currentLang');

  // Toggle language menu
  languageButton.addEventListener('click', (e) => {
    e.stopPropagation();
    languageMenu.classList.toggle('hidden');
  });

  // Close language menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!languageButton.contains(e.target) && !languageMenu.contains(e.target)) {
      languageMenu.classList.add('hidden');
    }
  });

  // Prevent menu from closing when clicking inside it
  languageMenu.addEventListener('click', (e) => {
    e.stopPropagation();
  });

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

  // Handle search input
  searchInput.addEventListener('input', (e) => {
    const value = e.target.value;
    if (!value) {
      searchResults.classList.add('hidden');
      return;
    }

    // Perform search
    const results = fuse.search(value);
    
    // Clear previous results
    searchResults.innerHTML = '';
    
    if (results.length > 0) {
      // Create results list
      results.slice(0, 5).forEach(result => {
        const div = document.createElement('div');
        div.className = 'p-2 hover:bg-gray-100 cursor-pointer';
        div.textContent = result.item.name;
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
            searchResults.classList.add('hidden');
            searchInput.classList.add('hidden');
            
            // Navigate to corresponding flavor page after scroll
            setTimeout(() => {
              if (result.item.page) {
                window.location.href = result.item.page;
              }
            }, 500);
          }
        });
        
        searchResults.appendChild(div);
      });
      
      searchResults.classList.remove('hidden');
    } else {
      searchResults.classList.add('hidden');
    }
  });

  // Close search when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchButton.contains(e.target) && !searchResults.contains(e.target)) {
      searchInput.classList.add('hidden');
      searchResults.classList.add('hidden');
    }
  });

  // Show results when focusing on input
  searchInput.addEventListener('focus', () => {
    if (searchInput.value) {
      searchResults.classList.remove('hidden');
    }
  });

  // Initialize with current language
  await updatePageContent(currentLanguage);
});