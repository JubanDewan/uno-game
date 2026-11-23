// Service worker sederhana: jaringan dulu, cadangan dari cache. Permintaan Firebase tidak disentuh.
const V='uno-v11';
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
  e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(V).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r).then(m=>m||caches.match('./'))));
});
// Klik notifikasi sistem: fokus ke aplikasi dan arahkan ke sumber notifikasi
self.addEventListener('notificationclick',e=>{
  e.notification.close();const act=(e.notification.data||{}).act||'';
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(cl=>{
    if(cl.length){cl[0].postMessage({type:'go',act});return cl[0].focus()}
    return self.clients.openWindow('./?go='+encodeURIComponent(act))
  }))
});
