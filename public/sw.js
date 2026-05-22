/**
 * Service worker vacío: evita 404 en /sw.js por registros huérfanos
 * (extensiones, PWA antigua, etc.). No cachea ni intercepta peticiones.
 */
self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
