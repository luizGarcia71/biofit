/* Tela Validação: aprovar ou rejeitar envios e deixar feedback */
function valid() {
  const card = (e) =>
      `<div class="box"><b>${esc(al(e.alunoId)?.nome || "Aluno removido")}</b><div class="k">${fd(e.data)}, ${esc(tr(e.treinoId)?.nome || "treino")}</div><div data-m="${e.mid}" class="mut" style="margin:10px 0">Carregando…</div>${e.status === "PENDENTE" ? `<div class="acts"><button class="b s" onclick="rev(${e.id},1)">Aprovar</button><button class="b g s" onclick="rev(${e.id},0)">Rejeitar</button></div>` : `<span class="tag ${e.status === "APROVADO" ? "ok" : "bad"}">${e.status === "APROVADO" ? "Aprovado" : "Rejeitado"}</span>${fbH(e)}<div><button class="b g s" style="margin-top:8px" onclick="fbEd(${e.id})">${e.fb ? "Editar feedback" : "Deixar feedback"}</button></div>`}</div>`,
    P = db.envios.filter((e) => e.status === "PENDENTE").sort((a, b) => a.ts - b.ts),
    H = db.envios
      .filter((e) => e.status !== "PENDENTE")
      .sort((a, b) => b.ts - a.ts)
      .slice(0, 6);
  return `<h2>Validação de treinos</h2>${P.length ? `<div class="cards w">${P.map(card).join("")}</div>` : '<p class="mut">Nenhum envio aguardando análise.</p>'}${H.length ? `<h2 style="font-size:18px;margin-top:22px">Últimos analisados</h2><div class="cards w">${H.map(card).join("")}</div>` : ""}`;
}
const fbH = (e) =>
  e && e.fb && e.status !== "PENDENTE"
    ? `<div class="fb"><span class="k">Feedback do instrutor</span>${esc(e.fb)}</div>`
    : "";
function fbForm(e, ok) {
  return `<p class="mut" style="font-size:14px">${esc(al(e.alunoId)?.nome || "Aluno")}, treino de ${fd(e.data)}. O aluno lê este recado no portal dele.</p><label>Feedback para o aluno (opcional)<textarea name="fb" rows="4" maxlength="500" placeholder="${ok ? "Boa execução! Na próxima, desça um pouco mais no agachamento." : "A foto ficou escura. Envie outra mostrando o exercício inteiro."}">${esc(e.fb || "")}</textarea></label>`;
}
function rev(id, ok) {
  const e = db.envios.find((x) => x.id === id);
  modal(ok ? "Aprovar treino" : "Rejeitar envio", fbForm(e, ok), ok ? "Aprovar" : "Rejeitar", (d) => {
    e.status = ok ? "APROVADO" : "REJEITADO";
    e.fb = (d.fb || "").trim();
    e.fbTs = Date.now();
    save();
    toast(ok ? "Treino aprovado" : "Envio rejeitado");
  });
}
function fbEd(id) {
  const e = db.envios.find((x) => x.id === id);
  modal("Feedback do treino", fbForm(e, e.status === "APROVADO"), "Salvar", (d) => {
    e.fb = (d.fb || "").trim();
    e.fbTs = Date.now();
    save();
    toast("Feedback salvo");
  });
}

/* ---------- portal do aluno ---------- */
