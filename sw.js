const CACHE='vader-v19';
const CORE=["./", "./index.html", "./peerjs.min.js", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./sounds/sounds.json", "./sounds/f01.mp3", "./sounds/f08.mp3", "./sounds/f10.mp3", "./sounds/f03.mp3", "./sounds/f17.mp3", "./sounds/f39.mp3", "./sounds/f31.mp3", "./sounds/f26.mp3", "./sounds/b1.mp3", "./sounds/marcha.mp3", "./sounds/saber.mp3"];
const CDN=[];
self.addEventListener('install',e=>{ e.waitUntil((async()=>{ const c=await caches.open(CACHE);
  await c.addAll(CORE);
  for(const u of CDN){ try{ await c.put(u, await fetch(u,{mode:'no-cors'})); }catch(_){} }
  self.skipWaiting(); })()); });
self.addEventListener('activate',e=>{ e.waitUntil((async()=>{ for(const k of await caches.keys()) if(k!==CACHE) await caches.delete(k); await self.clients.claim(); })()); });
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url);
  if(u.origin===location.origin && (u.pathname.endsWith('/')||u.pathname.endsWith('index.html')||u.pathname.endsWith('sounds.json'))){
    // primero la red (para recibir versiones nuevas), y si no hay internet, la copia guardada
    e.respondWith(fetch(r).then(res=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(r,cp)); return res; }).catch(()=>caches.match(r,{ignoreSearch:true})));
    return;
  }
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(hit=>hit||fetch(r).then(res=>{
    if(res && (res.ok||res.type==='opaque') && (u.origin===location.origin||/unpkg|fonts\.(googleapis|gstatic)/.test(u.host))){ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(r,cp)); }
    return res; })));
});
