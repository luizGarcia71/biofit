/* Troca de abas do administrador */
function show() {
  if (stuId) return stuShow();
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("on", t.dataset.v === view));
  $("#v").innerHTML = { dash, alunos, planos, pags, treinos, valid, rel }[view]();
  hydrate($("#v"));
  const n = db.envios.filter((e) => e.status === "PENDENTE").length;
  document.querySelector('[data-v="valid"]').textContent = "Validação" + (n ? ` (${n})` : "");
}
document.querySelectorAll(".tab").forEach(
  (t) =>
    (t.onclick = () => {
      view = t.dataset.v;
      show();
    }),
);
