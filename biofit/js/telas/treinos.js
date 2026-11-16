/* Tela Treinos: cadastro de treinos e exercícios */
function treinos() {
  const r =
    db.treinos
      .map(
        (t) =>
          `<tr><td>${esc(t.nome)}</td><td>${t.ex.length} exercícios</td><td>${db.alunos.filter((a) => (a.rotina || []).includes(t.id)).length} alunos</td><td class="acts"><button class="b g s" onclick="vT(${t.id})">Ver</button><button class="b g s" onclick="edT(${t.id})">Editar</button><button class="b g s" onclick="rmT(${t.id})">Excluir</button></td></tr>`,
      )
      .join("") ||
    '<tr><td colspan="4" class="mut">Nenhum treino. Crie o primeiro com “Novo treino”.</td></tr>';
  return `<h2>Treinos</h2><div class="bar"><button class="b" onclick="edT()">Novo treino</button></div><div class="wrap"><table><thead><tr><th>Treino</th><th>Exercícios</th><th>Em uso</th><th></th></tr></thead><tbody>${r}</tbody></table></div><p class="mut">Cada aluno recebe os treinos marcados no cadastro, distribuídos nos dias da semana conforme os treinos por semana do plano dele.</p>`;
}
function exRow(x) {
  x = x || {};
  const opt =
    '<option value="">Sem animação</option>' +
    Object.entries(AN)
      .map(([k, v]) => `<option value="${k}" ${k === x.a ? "selected" : ""}>${esc(v.n)}</option>`)
      .join("");
  return `<div class="exr">${f("Exercício", "exn", x.n || "", 'placeholder="Agachamento" autocomplete="off"')}<div class="exr2">${f("Séries e repetições", "exs", x.s || "", 'placeholder="3x12"')}<label>Animação<select name="exa">${opt}</select></label></div><button type="button" class="b g s" style="margin-top:8px" onclick="this.closest('.exr').remove()">Remover exercício</button></div>`;
}
function addEx() {
  $("#exl").insertAdjacentHTML("beforeend", exRow());
}
document.addEventListener("input", (e) => {
  if (e.target.name === "exn") {
    const r = e.target.closest(".exr"),
      sel = r && r.querySelector("[name=exa]");
    if (sel && !sel.value) {
      const g = guessAnim(e.target.value);
      if (g) sel.value = g;
    }
  }
});
function vT(id) {
  const t = tr(id);
  modal(esc(t.nome), exList(t), null, () => {});
  $("#cx").textContent = "Fechar";
  $("#dlg").style.width = "min(560px,94vw)";
  startAnims($("#dlg"));
}
function edT(id) {
  const t = id ? tr(id) : { nome: "", ex: [] };
  modal(
    id ? "Editar treino" : "Novo treino",
    f("Nome do treino", "nome", t.nome, 'required placeholder="Treino A"') +
      `<div id="exl">${(t.ex.length ? t.ex : [{}, {}]).map(exRow).join("")}</div><button type="button" class="b g s" style="margin-top:10px" onclick="addEx()">Adicionar exercício</button>`,
    "Salvar",
    (d, form) => {
      const N = form.getAll("exn"),
        S = form.getAll("exs"),
        Z = form.getAll("exa"),
        ex = N.map((nm, k) => ({ n: nm.trim(), s: (S[k] || "").trim(), a: Z[k] || "" })).filter((x) => x.n);
      if (!ex.length) return "Adicione ao menos um exercício.";
      const tt = id ? t : { id: nid() };
      tt.nome = d.nome.trim();
      tt.ex = ex;
      if (!id) db.treinos.push(tt);
      save();
      toast("Treino salvo");
    },
  );
}
function rmT(id) {
  ask("Excluir este treino? Ele sai da rotina dos alunos.", () => {
    db.treinos = db.treinos.filter((t) => t.id !== id);
    db.alunos.forEach((a) => (a.rotina = (a.rotina || []).filter((x) => x !== id)));
    save();
    show();
  });
}
