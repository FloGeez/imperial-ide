// Créer un nouveau fichier pour le service worker
const workerCode = `
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Envoyer l'URL au parent
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'urlChanged',
        path: url.pathname
      });
    });
  });
});
`;

// Créer un Blob avec le code du service worker
const workerBlob = new Blob([workerCode], { type: "text/javascript" });
export const workerUrl = URL.createObjectURL(workerBlob);
