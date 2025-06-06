// Service Worker para APT Poker
// Versão do cache - altere quando quiser forçar atualização
const CACHE_NAME = 'apt-poker-v1';
const STATIC_CACHE_NAME = 'apt-poker-static-v1';

// Arquivos que queremos cachear (apenas assets estáticos)
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Vite vai gerar esses assets com hash, então vamos cachear dinamicamente
];

// Assets que NÃO devemos cachear (APIs, dados dinâmicos)
const EXCLUDE_FROM_CACHE = [
  '/api/',
  'supabase.co',
  'supabase.io',
  'googleapis.com',
  'gstatic.com'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Cacheando assets estáticos');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Instalação completa');
        // Força a ativação imediata
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Erro na instalação:', error);
      })
  );
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Ativando...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        // Remove caches antigos
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
              console.log('Service Worker: Removendo cache antigo:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Ativação completa');
        // Toma controle de todas as abas abertas
        return self.clients.claim();
      })
  );
});

// Interceptar requisições (Fetch)
self.addEventListener('fetch', (event) => {
  const requestURL = new URL(event.request.url);
  
  // Não cachear APIs e serviços externos
  const shouldExclude = EXCLUDE_FROM_CACHE.some(pattern => 
    requestURL.href.includes(pattern)
  );
  
  if (shouldExclude) {
    // Para APIs e Supabase, sempre buscar na rede
    event.respondWith(fetch(event.request));
    return;
  }
  
  // Estratégia: Network First com fallback para cache
  // Ideal para PWAs que dependem de dados online
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a resposta for bem-sucedida, cache apenas se for asset estático
        if (response.status === 200) {
          const responseClone = response.clone();
          
          // Cache apenas assets estáticos (JS, CSS, imagens, fonts)
          if (isStaticAsset(event.request.url)) {
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseClone);
              });
          }
        }
        
        return response;
      })
      .catch(() => {
        // Se falhar na rede, tenta buscar no cache
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response;
            }
            
            // Se não encontrar no cache e for uma navegação, retorna página offline
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            // Para outros recursos, retorna erro
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Função para verificar se é um asset estático
function isStaticAsset(url) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.svg', '.ico', '.woff', '.woff2', '.ttf'];
  return staticExtensions.some(ext => url.includes(ext)) || url.includes('/assets/');
}

// Listener para mensagens do app principal
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('Service Worker: Recebido comando para atualizar');
    self.skipWaiting();
  }
});

// Preparação para Push Notifications (futuro)
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push notification recebida');
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Nova notificação',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      tag: data.tag || 'default',
      requireInteraction: true,
      actions: [
        {
          action: 'open',
          title: 'Abrir App'
        },
        {
          action: 'close',
          title: 'Fechar'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'APT Poker', options)
    );
  }
});

// Click em notificações (futuro)
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notificação clicada');
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('Service Worker: Script carregado com sucesso');