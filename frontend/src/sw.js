import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'
import { CacheFirst } from 'workbox-strategies'

precacheAndRoute(self.__WB_MANIFEST)

const handler = createHandlerBoundToURL('/index.html')
const navigationRoute = new NavigationRoute(handler)
registerRoute(navigationRoute)

self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING')
        self.skipWaiting()
})
self.addEventListener('install', (event) => {
    console.log('Service Worker installed')
})

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated')
})
registerRoute(
    ({ request }) => request.destination === 'image',
    new CacheFirst({
        cacheName: 'images-cache',
    })
)