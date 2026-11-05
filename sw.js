// core files are cached at install; every other image is cached the first time it is shown (cache-first)
const CACHE = "aetherion-bac6ededaaf5";
const CORE = ["./", "index.html", "manifest.json", "icon-192.png", "icon-512.png", "apple-touch-icon.png", "assets/cur_energy.webp", "assets/cur_gem.webp", "assets/cur_glory.webp", "assets/cur_guild.webp", "assets/cur_mana.webp", "assets/cur_ticket.webp", "assets/rank_1.webp", "assets/rank_2.webp", "assets/rank_3.webp", "assets/rank_4.webp", "assets/rank_5.webp", "assets/rank_6.webp", "assets/rank_7.webp", "assets/rank_8.webp", "assets/scroll_l.webp", "assets/scroll_ld.webp", "assets/scroll_m.webp", "assets/scroll_u.webp", "assets/sky_city.webp", "assets/splash.webp", "assets/world_map.webp"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // the page itself is network-first so a new release shows up on the next open; offline it falls back to the cache
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(res => { const cp = res.clone(); caches.open(CACHE).then(c => c.put("index.html", cp)); return res; }).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.open(CACHE).then(c => c.match(e.request).then(hit => hit || fetch(e.request).then(res => { if (res.ok && new URL(e.request.url).origin === location.origin) c.put(e.request, res.clone()); return res; }))));
});
