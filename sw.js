const CACHE='vader-v14';
const CORE=["./", "./index.html", "./peerjs.min.js", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./sounds/sounds.json", "./sounds/b1.mp3", "./sounds/b2.mp3", "./sounds/b3.mp3", "./sounds/f01.mp3", "./sounds/f03.mp3", "./sounds/f08.mp3", "./sounds/f10.mp3", "./sounds/f41.mp3", "./sounds/f42.mp3", "./sounds/f31.mp3", "./sounds/f16.mp3", "./sounds/f17.mp3", "./sounds/f37.mp3", "./sounds/f39.mp3", "./sounds/f40.mp3", "./sounds/f24.mp3", "./sounds/f25.mp3", "./sounds/f34.mp3", "./sounds/f35.mp3", "./sounds/f11.mp3", "./sounds/f12.mp3", "./sounds/f13.mp3", "./sounds/f14.mp3", "./sounds/f02.mp3", "./sounds/f15.mp3", "./sounds/f29.mp3", "./sounds/f43.mp3", "./sounds/f20.mp3", "./sounds/f44.mp3", "./sounds/f18.mp3", "./sounds/f19.mp3", "./sounds/f21.mp3", "./sounds/f38.mp3", "./sounds/f30.mp3", "./sounds/f26.mp3", "./sounds/f06.mp3", "./sounds/f05.mp3", "./sounds/f04.mp3", "./sounds/f07.mp3", "./sounds/f09.mp3", "./sounds/f22.mp3", "./sounds/f23.mp3", "./sounds/f27.mp3", "./sounds/f28.mp3", "./sounds/f32.mp3", "./sounds/f33.mp3", "./sounds/marcha.mp3", "./sounds/saber.mp3"];
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
