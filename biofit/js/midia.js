/* Fotos e vídeos dos alunos guardados no IndexedDB */
const idb = new Promise((ok, no) => {
  try {
    const r = indexedDB.open("biofit_media", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("m");
    r.onsuccess = () => ok(r.result);
    r.onerror = () => no(r.error);
  } catch (e) {
    no(e);
  }
});
const mx = (mode, fn) =>
  idb.then(
    (d) =>
      new Promise((ok, no) => {
        const t = d.transaction("m", mode),
          q = fn(t.objectStore("m"));
        t.oncomplete = () => ok(q.result);
        t.onerror = () => no(t.error);
      }),
  );
const mput = (k, b) => mx("readwrite", (o) => o.put(b, k)),
  mget = (k) => mx("readonly", (o) => o.get(k)),
  mdel = (k) => mx("readwrite", (o) => o.delete(k)).catch(() => {});
function hydrate(root) {
  root.querySelectorAll("[data-m]").forEach(async (el) => {
    try {
      const b = await mget(el.dataset.m);
      if (!b) throw 0;
      const u = URL.createObjectURL(b);
      el.innerHTML = b.type.startsWith("video")
        ? `<video src="${u}" controls playsinline style="width:100%;border-radius:8px"></video>`
        : `<img src="${u}" alt="Prova do treino" style="width:100%;border-radius:8px">`;
    } catch (e) {
      el.textContent = "Arquivo não encontrado neste navegador.";
    }
  });
}
