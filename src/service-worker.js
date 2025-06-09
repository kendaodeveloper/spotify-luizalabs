/* eslint-disable no-restricted-globals, no-undef */

importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js',
);

if (!workbox) {
  console.error('Workbox failed to load');
} else {
  workbox.core.clientsClaim();

  workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

  const fileExtensionRegexp = new RegExp('/[^/?]+\\.[^/]+$');

  workbox.routing.registerRoute(({ request, url }) => {
    if (request.mode !== 'navigate') return false;
    if (url.pathname.startsWith('/_')) return false;
    if (url.pathname.match(fileExtensionRegexp)) return false;
    return true;
  }, workbox.precaching.createHandlerBoundToURL('/index.html'));

  workbox.routing.registerRoute(
    ({ url }) =>
      url.origin === self.location.origin && url.pathname.endsWith('.png'),
    new workbox.strategies.StaleWhileRevalidate({
      cacheName: 'images',
      plugins: [
        new workbox.expiration.ExpirationPlugin({ maxEntries: 50 }),
      ],
    }),
  );

  workbox.routing.registerRoute(
    ({ url }) => url.origin === 'https://api.spotify.com',
    new workbox.strategies.NetworkFirst({
      cacheName: 'spotify-api-cache',
      networkTimeoutSeconds: 3,
      plugins: [
        new workbox.expiration.ExpirationPlugin({
          maxEntries: 50,
          maxAgeSeconds: 60 * 60,
        }),
      ],
    }),
  );

  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
}
