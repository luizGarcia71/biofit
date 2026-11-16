/* Tela Relatórios e exportação CSV */
let relDias = 30;
function relRows() {
  const h = today(),
    from = ago(relDias - 1);
  return db.alunos
    .filter((a) => a.status === "ATIVO")
    .map((a) => {
      const r = freq(a, from, h),
        [s] = situ(a),
        u = db.envios
          .filter((e) => e.alunoId === a.id && e.status === "APROVADO")
          .map((e) => e.data)
          .sort()
          .pop();
      return { a, r, s, u, plano: pl(a.planoId)?.nome || "—" };
    })
    .sort((x, y) => (x.r.pct ?? 101) - (y.r.pct ?? 101) || x.a.nome.localeCompare(y.a.nome));
}
function rel() {
  const h = today(),
    from = ago(relDias - 1),
    L = relRows(),
    V = L.filter((x) => x.r.pct != null),
    med = V.length ? Math.round(V.reduce((s, x) => s + x.r.pct, 0) / V.length) : null,
    baixa = V.filter((x) => x.r.pct < 50).length,
    PG = db.pagamentos.filter((p) => p.data >= from),
    rec = PG.reduce((s, p) => s + p.valor, 0),
    pend = db.envios.filter((e) => e.status === "PENDENTE").length,
    G = {};
  PG.forEach((p) => {
    const n = pl(p.planoId ?? al(p.alunoId)?.planoId)?.nome || "—",
      g = G[n] || (G[n] = { q: 0, v: 0 });
    g.q++;
    g.v += p.valor;
  });
  const rows =
      L.map(
        ({ a, r, s, u, plano }) =>
          `<tr class="${s === "Inadimplente" ? "late" : ""}"><td>${esc(a.nome)}</td><td>${esc(plano)}</td><td>${r.prev}</td><td>${r.ok}</td><td class="tag ${pcc(r.pct)}">${pc(r.pct)}</td><td>${fd(u)}</td><td>${fd(a.venc)}</td><td class="tag ${s === "Em dia" ? "ok" : "bad"}">${s}</td></tr>`,
      ).join("") ||
      '<tr><td colspan="8" class="mut">Nenhum aluno ativo. Cadastre alunos na aba Alunos.</td></tr>',
    gr =
      Object.entries(G)
        .sort((x, y) => y[1].v - x[1].v)
        .map(([n, g]) => `<tr><td>${esc(n)}</td><td>${g.q}</td><td>${R.format(g.v)}</td></tr>`)
        .join("") || '<tr><td colspan="3" class="mut">Nenhum pagamento no período.</td></tr>';
  return `<h2>Relatórios</h2><div class="bar"><select onchange="relDias=Number(this.value);show()" style="width:auto" aria-label="Período">${[
    [7, "Últimos 7 dias"],
    [30, "Últimos 30 dias"],
    [90, "Últimos 90 dias"],
  ]
    .map(([v, l]) => `<option value="${v}" ${v === relDias ? "selected" : ""}>${l}</option>`)
    .join("")}</select><button class="b g" onclick="csv()">Exportar CSV</button></div>
  <div class="cards"><div class="box"><div class="k">Frequência média</div><div class="n ${pcc(med)}">${pc(med)}</div></div>
  <div class="box"><div class="k">Alunos abaixo de 50%</div><div class="n ${baixa ? "bad" : ""}">${baixa}</div></div>
  <div class="box"><div class="k">Receita no período</div><div class="n hot">${R.format(rec)}</div></div>
  <div class="box"><div class="k">Envios aguardando análise</div><div class="n">${pend}</div></div></div>
  <h3 class="sub">Frequência por aluno</h3><div class="wrap"><table><thead><tr><th>Aluno</th><th>Plano</th><th>Previstos</th><th>Validados</th><th>Frequência</th><th>Último treino</th><th>Vencimento</th><th>Situação</th></tr></thead><tbody>${rows}</tbody></table></div>
  <p class="mut" style="font-size:13px">Ordenado da menor para a maior frequência. Treinos previstos seguem a rotina e o plano atuais, a partir da data de início do aluno.</p>
  <h3 class="sub">Receita por plano</h3><div class="wrap"><table><thead><tr><th>Plano</th><th>Pagamentos</th><th>Receita</th></tr></thead><tbody>${gr}</tbody></table></div>`;
}
function csv() {
  const L = [
      [
        "Aluno",
        "Plano",
        "Previstos",
        "Validados",
        "Frequencia (%)",
        "Ultimo treino",
        "Vencimento",
        "Situacao",
      ],
    ].concat(
      relRows().map(({ a, r, s, u, plano }) => [
        a.nome,
        plano,
        r.prev,
        r.ok,
        r.pct ?? "",
        u || "",
        a.venc || "",
        s,
      ]),
    ),
    q = (c) => {
      c = String(c ?? "");
      if (/^[=+\-@]/.test(c)) c = "'" + c;
      return '"' + c.replace(/"/g, '""') + '"';
    },
    b = new Blob(["\ufeff" + L.map((r) => r.map(q).join(";")).join("\r\n")], {
      type: "text/csv;charset=utf-8",
    }),
    u = URL.createObjectURL(b),
    k = document.createElement("a");
  k.href = u;
  k.download = "frequencia-biofit-" + today() + ".csv";
  document.body.appendChild(k);
  k.click();
  k.remove();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
  toast("CSV exportado");
}
