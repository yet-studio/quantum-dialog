// Enregistrement du Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/src/scripts/sw.js')
      .then(registration => {
        console.log('ServiceWorker enregistré:', registration);
      })
      .catch(error => {
        console.error('Erreur d\'enregistrement du ServiceWorker:', error);
      });
  });
}

// Gestion de l'installation PWA
let deferredPrompt;
const installButton = document.getElementById('installPwa');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  
  if (installButton) {
    installButton.style.display = 'block';
    
    installButton.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`Installation ${outcome}`);
        deferredPrompt = null;
        installButton.style.display = 'none';
      }
    });
  }
});
