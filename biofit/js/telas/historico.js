/* Histórico de frequência e pagamentos do aluno */
function histUI(a) {
  const h = today(),
    r = resumo(a),
    cols = [7, 6, 5, 4, 3, 2, 1, 0]
      .map((k) => {
        const w = weekOf(k),
          x = freq(a, w[0], w[6] < h ? w[6] : h);
        return `<div class="col"><div class="bar2" title="${x.pct == null ? "Sem treinos previstos" : x.pct + "%"}"><i style="height:${x.pct ?? 0}%"></i></div><span class="k">${x.pct == null ? "—" : x.ok + "/" + x.prev}</span><span class="k mut">${w[0].slice(8)}/${w[0].slice(5, 7)}</span></div>`;
      })
      .join(""),
    E = db.envios
      .filter((e) => e.alunoId === a.id)
      .sort((x, y) => y.ts - x.ts)
      .slice(0, 8),
    st = (e) =>
      e.status === "APROVADO"
        ? '<span class="tag ok">Validado</span>'
        : e.status === "REJEITADO"
          ? '<span class="tag bad">Rejeitado</span>'
          : '<span class="tag" style="color:var(--pri)">Em análise</span>';
  return `<div class="cards"><div class="box"><div class="k">Frequência (4 semanas)</div><div class="n sm ${pcc(r.f28.pct)}">${pc(r.f28.pct)}</div><div class="k">${r.f28.ok} de ${r.f28.prev} treinos</div></div>
  <div class="box"><div class="k">Sequência atual</div><div class="n sm">${r.seq}</div><div class="k">${r.seq === 1 ? "treino seguido" : "treinos seguidos"}</div></div>
  <div class="box"><div class="k">Treinos validados</div><div class="n sm">${r.total}</div><div class="k">Último: ${fd(r.ult)}</div></div></div>
  <div class="box"><div class="k">Últimas 8 semanas (validados de previstos)</div><div class="hist">${cols}</div></div>
  <h3 class="sub">Últimos envios</h3>${E.length ? `<ul class="lst">${E.map((e) => `<li><div style="min-width:0">${fd(e.data)}, ${esc(tr(e.treinoId)?.nome || "treino")}${fbH(e)}</div>${st(e)}</li>`).join("")}</ul>` : '<p class="mut">Nenhum envio ainda.</p>'}`;
}
function hA(id) {
  const a = al(id),
    P = db.pagamentos
      .filter((p) => p.alunoId === id)
      .sort((x, y) => y.data.localeCompare(x.data) || y.id - x.id)
      .slice(0, 5),
    [s, c] = situ(a);
  modal(
    esc(a.nome),
    `<p class="k">${esc(pl(a.planoId)?.nome || "Sem plano")}, vence em ${fd(a.venc)}. <span class="tag ${c}">${s}</span></p>${histUI(a)}
  <h3 class="sub">Últimos pagamentos</h3>${P.length ? `<ul class="lst">${P.map((p) => `<li><span>${fd(p.data)}</span><span>${R.format(p.valor)}</span></li>`).join("")}</ul>` : '<p class="mut">Nenhum pagamento registrado.</p>'}
  <p class="mut" style="font-size:13px">A frequência usa a rotina e o plano atuais do aluno.</p>`,
    null,
    () => {},
  );
  $("#cx").textContent = "Fechar";
  $("#dlg").style.width = "min(640px,94vw)";
}
