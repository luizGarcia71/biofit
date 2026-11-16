/* Tela Painel */
function dash() {
  const h = today(),
    m = h.slice(0, 7),
    A = db.alunos.filter((a) => a.status === "ATIVO");
  const ativos = A.filter((a) => a.venc >= h).length,
    inad = A.filter((a) => a.venc < h).length,
    fat = db.pagamentos.filter((p) => p.data.startsWith(m)).reduce((s, p) => s + p.valor, 0),
    novos = db.alunos.filter((a) => a.inicio.startsWith(m)).length;
  const ms = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - i);
    const k = iso(d).slice(0, 7);
    ms.push({
      l: d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", ""),
      v: db.pagamentos.filter((p) => p.data.startsWith(k)).reduce((s, p) => s + p.valor, 0),
    });
  }
  const mx = Math.max(1, ...ms.map((x) => x.v));
  const bars = ms
    .map((x, i) => {
      const hh = (x.v / mx) * 120,
        X = 40 + i * 95;
      return `<rect x="${X}" y="${150 - hh}" width="60" height="${Math.max(hh, 2)}" rx="5"/><text class="v" x="${X + 30}" y="${142 - hh}" text-anchor="middle">${x.v ? R.format(x.v) : ""}</text><text x="${X + 30}" y="172" text-anchor="middle">${x.l}</text>`;
    })
    .join("");
  return `<h2>Painel</h2><div class="cards">
  <div class="box"><div class="k">Receita do mês</div><div class="n hot">${R.format(fat)}</div></div>
  <div class="box"><div class="k">Alunos em dia</div><div class="n">${ativos}</div></div>
  <div class="box"><div class="k">Inadimplentes</div><div class="n ${inad ? "bad" : ""}">${inad}</div></div>
  <div class="box"><div class="k">Novos no mês</div><div class="n">${novos}</div></div></div>
  <div class="box"><div class="k">Receita dos últimos 6 meses</div><svg viewBox="0 0 640 185" style="width:100%" role="img" aria-label="Receita mensal">${bars}</svg></div>`;
}
