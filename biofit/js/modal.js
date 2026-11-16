/* Janela modal, campos de formulário, confirmação e máscara de CPF */
function modal(title, body, ok, cb) {
  const d = $("#dlg");
  d.style.width = "";
  d.innerHTML = `<form><h3>${title}</h3>${body}<p class="err" id="er"></p><div class="row"><button type="button" class="b g" id="cx">Cancelar</button>${ok ? `<button class="b">${ok}</button>` : ""}</div></form>`;
  d.showModal();
  $("#cx").onclick = () => d.close();
  d.querySelector("form").onsubmit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target),
      r = cb(Object.fromEntries(fd), fd);
    if (r) $("#er").textContent = r;
    else {
      d.close();
      show();
    }
  };
}
const f = (l, n, v = "", a = "") => `<label>${l}<input name="${n}" value="${esc(v)}" ${a}></label>`;
function ask(msg, fn) {
  modal("Confirmar", `<p>${msg}</p>`, "Excluir", () => {
    fn();
    toast("Excluído");
  });
}
document.addEventListener("input", (e) => {
  if (e.target.name === "cpf") {
    const d = e.target.value.replace(/\D/g, "").slice(0, 11);
    e.target.value = d
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
});
