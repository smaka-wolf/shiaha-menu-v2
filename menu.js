document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menuButton');
  const menuOptions = document.getElementById('menuOptions');

  menuButton.addEventListener('click', () => {
    if (menuOptions.classList.contains('hidden')) {
      menuOptions.classList.remove('hidden');
    } else {
      menuOptions.classList.add('hidden');
    }
  });

  // Close menu if clicking outside
  document.addEventListener('click', (event) => {
    if (!menuButton.contains(event.target) && !menuOptions.contains(event.target)) {
      menuOptions.classList.add('hidden');
    }
  });
});
