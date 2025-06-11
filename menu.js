// Update page content with translations

// Global stores
  // Initialize Fuse with options
  const fuseOptions = {
    keys: ['name', 'description', 'originalName'],
    threshold: 0.3,
    minMatchCharLength: 2
  };

let translations = {};
let flavorTranslations = {};
let currentLanguage = 'en';

// Flavor data with sections
const flavors = [
  // Arabic Style
  { name: "Grape", section: "arabic-style", page: "Arabic Flavors.html" },
  { name: "Double Apple", section: "arabic-style", page: "Arabic Flavors.html" },
  { name: "Gum", section: "arabic-style", page: "Arabic Flavors.html" },
  { name: "Gum Mint", section: "arabic-style", page: "Arabic Flavors.html" },
  { name: "Mint", section: "arabic-style", page: "Arabic Flavors.html" },
  { name: "Gum Cinnamon", section: "arabic-style", page: "Arabic Flavors.html" },
  { name: "Orange", section: "arabic-style", page: "Arabic Flavors.html" },
  { name: "Lemon Mint", section: "arabic-style", page: "Arabic Flavors.html" },
  { name: "Watermelon", section: "arabic-style", page: "Arabic Flavors.html" },
  { name: "Melon", section: "arabic-style", page: "Arabic Flavors.html" },
  { name: "Peach", section: "arabic-style", page: "Arabic Flavors.html" },
  { name: "Blueberry", section: "arabic-style", page: "Arabic Flavors.html" },
  

  // Turkish Style
  { name: "Istanbul Night", section: "turkish-style", page: "Turkish Flavors.html" },
  { name: "Marbella", section: "turkish-style", page: "Turkish Flavors.html" },
  { name: "Lime Spice Peach", section: "turkish-style", page: "Turkish Flavors.html" },
  { name: "Love 66", section: "turkish-style", page: "Turkish Flavors.html" },
  { name: "Lady Killer", section: "turkish-style", page: "Turkish Flavors.html" },
  { name: "Watermelon tk", section: "turkish-style", page: "Turkish Flavors.html" },
 

  // Russian Style - Darkside
  { name: "Needles", section: "russian-style", page: "russian-flavors.html" },
  { name: "Lemon Blast", section: "russian-style", page: "russian-flavors.html" },
  { name: "Cola", section: "russian-style", page: "russian-flavors.html" },
  { name: "Supernova", section: "russian-style", page: "russian-flavors.html" },
  { name: "Cream soda", section: "russian-style", page: "russian-flavors.html" },
  { name: "Falling Star", section: "russian-style", page: "russian-flavors.html" },
  { name: "Ice crame", section: "russian-style", page: "russian-flavors.html" },
  { name: "Greyfrut", section: "russian-style", page: "russian-flavors.html" },
  
  // Russian Style - Starline
  { name: "Blueberry Crumble", section: "russian-style", page: "russian-flavors.html" },
  { name: "Belgium Waffles", section: "russian-style", page: "russian-flavors.html" },
  { name: "Strawberry Millefeuille", section: "russian-style", page: "russian-flavors.html" },
  { name: "Banana", section: "russian-style", page: "russian-flavors.html" },
  { name: "Respberry", section: "russian-style", page: "russian-flavors.html" },
  { name: "Pinacolada", section: "russian-style", page: "russian-flavors.html" },
  
  // Russian Style - Musthave
  { name: "Melonade", section: "russian-style", page: "russian-flavors.html" },
  { name: "Kiwi Smoothie", section: "russian-style", page: "russian-flavors.html" },
  { name: "Vanilla", section: "russian-style", page: "russian-flavors.html" },
  { name: "Garnet", section: "russian-style", page: "russian-flavors.html" },
  { name: "Coconut", section: "russian-style", page: "russian-flavors.html" },
  { name: "PineApple Rins", section: "russian-style", page: "russian-flavors.html" },
  { name: "Estragon", section: "russian-style", page: "russian-flavors.html" },
  { name: "Rocketman", section: "russian-style", page: "russian-flavors.html" },
  { name: "Pinkman", section: "russian-style", page: "russian-flavors.html" },

  // Russian Style - HOLSTER
  { name: "VIVA La fiesta", section: "russian-style", page: "russian-flavors.html" },
  { name: "watermelon Punch", section: "russian-style", page: "russian-flavors.html" },
  { name: "lemon Punch", section: "russian-style", page: "russian-flavors.html" },
  { name: "Unicron", section: "russian-style", page: "russian-flavors.html" },

  // Russian Style - BLACKBURN
  { name: "Epic Yogurt", section: "russian-style", page: "russian-flavors.html" },


  // Signature Mix
  { name: "Blume", section: "signature-mix", page: "Signature Mix Flavors.html", description: "Lady killer 25%, Watermelon 25%, Blueberry 50%" },
  { name: "Luxuria", section: "signature-mix", page: "Signature Mix Flavors.html", description: "Kiwi Smoothie 40%, Grape Mint 60%, Kiwi Juice 250 Ml" },
  { name: "Leonardo", section: "signature-mix", page: "Signature Mix Flavors.html", description: "Gum Mint 20%, Orange 30%, Vanilla 50%" },
  { name: "Exotic Dreams", section: "signature-mix", page: "Signature Mix Flavors.html", description: "Melon 40%, Banana 40%, Coconut 20%" },
  { name: "Moonlight", section: "signature-mix", page: "Signature Mix Flavors.html", description: "Falling Star 40%, Istanbul Night 50%, Supernova 10%" },
  { name: "Love Berry", section: "signature-mix", page: "Signature Mix Flavors.html", description: "Alternative Cherry 40%, Needles 20%, Pomegranate 40%" },
  { name: "Mr. AXA", section: "signature-mix", page: "Signature Mix Flavors.html", description: "Melon 50%, Melonade 45%, Supernova 5%" },
  { name: "Grandmother Cake", section: "signature-mix", page: "Signature Mix Flavors.html", description: "Belgium Waffles 20%, Melonade 20%, Blueberry Crumble 60%" },
  { name: "Olala", section: "signature-mix", page: "Signature Mix Flavors.html", description: "Cola 25%, Lemon Mint 75%" }
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

  // Language switcher functionality
  const languageButton = document.getElementById('languageButton');

  const languageMenu = document.getElementById('languageMenu');
  const currentLang = document.getElementById('currentLang');

  // Toggle language menu
  if (languageButton) {
    console.log('Language button found');
    languageButton.addEventListener('click', (e) => {
      console.log('Language button clicked');
      e.stopPropagation();
      if (languageMenu) {
        console.log('Language menu found');
        languageMenu.classList.toggle('hidden');
      } else {
        console.error('languageMenu is null');
      }
    });
  } else {
    console.log('Language button not found');
  }

  // Close language menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!languageButton || (!languageButton.contains(e.target) && !languageMenu.contains(e.target))) {
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
    currentLanguage = lang;
    updatePageContent(lang);
  };

  // Initial page load
  updatePageContent(currentLanguage);
});
