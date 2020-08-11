const kanji = 'kanjikakikikai';
const assets = [
  '/main.js',
  '/style.css',
  '/assets/trash.png',
  '/assets/loader.gif',
  '/assets/keshi.png',
  '/word-sets/jlpt-five.jscsrc',
  '/word-sets/jlpt-four.jscsrc',
  '/word-sets/jlpt-three.jscsrc',
  '/word-sets/jlpt-two.jscsrc',
  '/p5.min.js',
  '/edit-sets-script.js',
  '/views/index.ejs',
  '/views/settings.ejs',
  'views/about.ejs',
  'views/create-new-set.ejs',
  'views/edit-sets.ejs',
  'views/header.ejs',
  'views/login.ejs',
  'views/navbar.ejs',
  'views/signup.ejs',
  'components/about.css',
  'components/background.css',
  'components/bottom.css',
  'components/buttons.css',
  'components/canvas.css',
  'components/check-answer.css',
  'components/create-new-set.css',
  'components/editor-styles.css',
  'components/forms.css',
  'components/game-finished.css',
  'components/greeting.css',
  'components/hints.css',
  'components/practice.css',
  'components/range.css',
  'components/select.css',
  'components/settings.css',
  'components/tools.css'
];

self.addEventListener('install', (installEvent) => {
  installEvent.waitUntil(
    caches.open(kanji).then((cache) => {
      cache.addAll(assets);
    })
  );
});

self.addEventListener('fetch', (fetchEvent) => {
  fetchEvent.respondWith(
    caches.match(fetchEvent.request).then((res) => {
      return res || fetch(fetchEvent.request);
    })
  );
});
