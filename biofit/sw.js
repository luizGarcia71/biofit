/* Service worker: guarda os arquivos do app para funcionar sem internet.
   Ao mudar qualquer arquivo do app, aumente o número da versão abaixo
   para os celulares baixarem a atualização. */
const VERSAO = "biofit-v5";

const ARQUIVOS = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "icon-192.png",
  "icon-512.png",
  "css/style.css",
  "js/base.js",
  "js/modal.js",
  "js/acesso.js",
  "js/regras.js",
  "js/midia.js",
  "js/animacoes.js",
  "js/navegacao.js",
  "js/telas/painel.js",
  "js/telas/alunos.js",
  "js/telas/planos.js",
  "js/telas/pagamentos.js",
  "js/telas/treinos.js",
  "js/telas/historico.js",
  "js/telas/relatorios.js",
  "js/telas/validacao.js",
  "js/portal-aluno.js",
  "js/backup.js",
  "js/main.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(VERSAO)
      .then((c) => c.addAll(ARQUIVOS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((k) => Promise.all(k.filter((x) => x !== VERSAO).map((x) => caches.delete(x))))
      .then(() => self.clients.claim()),
  );
});

/* Busca primeiro na internet; sem conexão, usa a cópia guardada. */
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then((r) => {
        const c = r.clone();
        caches.open(VERSAO).then((x) => x.put(e.request, c));
        return r;
      })
      .catch(() => caches.match(e.request).then((r) => r || caches.match("index.html"))),
  );
});
