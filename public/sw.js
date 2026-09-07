/*
 * Service worker INORGA — mode luring sungguhan.
 *
 * Strategi: network-first untuk dokumen (agar isi selalu segar bila ada
 * sinyal), cache-first untuk aset statis. Saat sinyal GOR hilang, halaman
 * yang pernah dibuka tetap terbuka dan panitia tetap bisa memanggil peserta —
 * state antrian hidup di localStorage, bukan di server.
 */
const CACHE = "inorga-v1";
const INTI = ["/", "/atlet", "/panitia", "/juri", "/klasemen", "/pemkot", "/perguruan", "/undian", "/manifest.webmanifest"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(INTI)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((k) => Promise.all(k.filter((n) => n !== CACHE).map((n) => caches.delete(n)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const { request } = e;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    e.respondWith(
      fetch(request)
        .then((res) => { const salin = res.clone(); caches.open(CACHE).then((c) => c.put(request, salin)); return res; })
        .catch(() => caches.match(request).then((r) => r || caches.match("/")))
    );
    return;
  }

  e.respondWith(
    caches.match(request).then((tersimpan) =>
      tersimpan ||
      fetch(request).then((res) => {
        if (res.ok) { const salin = res.clone(); caches.open(CACHE).then((c) => c.put(request, salin)); }
        return res;
      })
    )
  );
});
