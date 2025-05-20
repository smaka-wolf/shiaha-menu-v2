// Wait for DOM to be fully loaded
window.addEventListener('DOMContentLoaded', function() {
    try {
        // Check if we're on a page with menu elements
        const menuButton = document.getElementById('menuButton');
        const menuOptions = document.getElementById('menuOptions');
        
        // Only initialize menu if both elements exist
        if (menuButton && menuOptions) {
            // Menu button click handler
            menuButton.addEventListener('click', function(e) {
                e.preventDefault();
                menuOptions.classList.toggle('hidden');
            });

            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!menuButton.contains(e.target) && !menuOptions.contains(e.target)) {
                    menuOptions.classList.add('hidden');
                }
            });
        }
    } catch (error) {
        console.log('Menu initialization skipped - not a menu page');
    }
});
