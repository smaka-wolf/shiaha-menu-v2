// Listen for service worker updates and reload the page
navigator.serviceWorker.addEventListener('controllerchange', () => {
  window.location.reload(); // Force app update when new service worker takes control
});
