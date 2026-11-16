/* Inicialização do app e registro do service worker */
load();
try {
  logged = sessionStorage.getItem("ok") === "1" && !!db.user;
} catch (e) {}
migra();
save();
let stuId = null;
try {
  stuId = Number(sessionStorage.getItem("st")) || null;
} catch (e) {}
if (stuId && al(stuId)) stuStart();
else if (logged) start();
else authUI();
if ("serviceWorker" in navigator && location.protocol.startsWith("http"))
  navigator.serviceWorker.register("sw.js").catch(() => {});
