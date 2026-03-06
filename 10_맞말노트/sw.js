const CACHE_NAME = 'matmal-note-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/main.css',
  '/main.js',
  '/manifest.json',
  '/assets/favicons/favicon-192x192.png',
  '/assets/favicons/favicon-512x512.png'
];

// 1. 설치 단계: 필요한 리소스를 미리 캐싱함
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('캐싱 중...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. 활성화 단계: 오래된 캐시 삭제
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('오래된 캐시 제거:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 3. 네트워크 요청 가로채기: 캐시된 게 있으면 캐시 사용, 없으면 네트워크 호출
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('t1.daumcdn.net')) {
    return fetch(event.request);
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});