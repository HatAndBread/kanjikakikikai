const kanji = 'kanjikakikikai';
const assets = [
  '/assets/trash.png',
  '/assets/loader.gif',
  '/assets/keshi.png',
  '/assets/iphonexsmax_splash.png',
  '/assets/ipad_splash.png',
  '/assets/ipadpro1_splash.png',
  '/assets/ipadpro2_splash.png',
  '/assets/ipadpro3_splash.png',
  '/assets/iphone5_splash.png',
  '/assets/iphone6_splash.png',
  '/assets/iphonex_splash.png',
  '/assets/iphonexr_splash.png',
  '/assets/umeboshi_.woff',
  '/assets/umeboshi_.ttf',
  '/word-sets/jlpt-five.jscsrc',
  '/word-sets/jlpt-four.jscsrc',
  '/word-sets/jlpt-three.jscsrc',
  '/word-sets/jlpt-two.jscsrc',
  '/p5.min.js'
];

self.addEventListener('install', (installEvent) => {
  installEvent.waitUntil(
    caches.open(kanji).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', (fetchEvent) => {
  self.skipWaiting(); // change this!!!
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
