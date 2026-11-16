/* Regras de negócio: situação do aluno, pagamentos, rotina semanal e frequência */
function situ(a) {
  if (a.status === "INATIVO") return ["Inativo", "mut"];
  return a.venc >= today() ? ["Em dia", "ok"] : ["Inadimplente", "bad"];
}
function pagar(alunoId, valor) {
  const a = al(alunoId),
    p = pl(a.planoId);
  if (!p) return "Aluno sem plano.";
  const base = a.venc && a.venc >= today() ? a.venc : today();
  a.venc = addM(base, p.meses);
  db.pagamentos.push({
    id: nid(),
    alunoId: a.id,
    planoId: p.id,
    valor: Number(valor),
    data: today(),
    status: "PAGO",
  });
  save();
}

const DN = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  PAT = {
    1: [3],
    2: [2, 4],
    3: [1, 3, 5],
    4: [1, 2, 4, 5],
    5: [1, 2, 3, 4, 5],
    6: [1, 2, 3, 4, 5, 6],
    7: [1, 2, 3, 4, 5, 6, 0],
  };
const tr = (id) => db.treinos.find((t) => t.id == id);
function weekOf(k) {
  const d = new Date();
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) - 7 * k);
  return [0, 1, 2, 3, 4, 5, 6].map((i) => {
    const x = new Date(d);
    x.setDate(d.getDate() + i);
    return iso(x);
  });
}
const week = () => weekOf(0);
function slot(a, date) {
  const p = pl(a.planoId);
  if (!p) return;
  const days = PAT[Math.min(7, Math.max(1, p.freq || 3))],
    i = days.indexOf(parse(date).getDay());
  if (i < 0) return;
  const r = a.rotina || [];
  return { t: r.length ? tr(r[i % r.length]) : null };
}
function envOf(a, date) {
  const l = db.envios.filter((e) => e.alunoId === a.id && e.data === date);
  return l.find((e) => e.status === "APROVADO") || l.find((e) => e.status === "PENDENTE") || l[l.length - 1];
}
function ago(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return iso(d);
}
function range(a, b) {
  const r = [],
    e = parse(b);
  for (let d = parse(a); d <= e; d.setDate(d.getDate() + 1)) r.push(iso(d));
  return r;
}
function freq(a, from, to) {
  const s = from < a.inicio ? a.inicio : from;
  if (s > to) return { prev: 0, ok: 0, pct: null };
  let prev = 0,
    ok = 0;
  range(s, to).forEach((d) => {
    if (slot(a, d)) {
      prev++;
      if (envOf(a, d)?.status === "APROVADO") ok++;
    }
  });
  return { prev, ok, pct: prev ? Math.round((ok / prev) * 100) : null };
}
function streak(a) {
  const h = today();
  let n = 0;
  for (const d of range(ago(120), h).reverse()) {
    if (d < a.inicio) break;
    if (!slot(a, d)) continue;
    if (envOf(a, d)?.status === "APROVADO") n++;
    else if (d !== h) break;
  }
  return n;
}
function resumo(a) {
  const h = today(),
    A = db.envios.filter((e) => e.alunoId === a.id && e.status === "APROVADO"),
    ds = [...new Set(A.map((e) => e.data))].sort();
  return {
    f28: freq(a, ago(27), h),
    total: ds.length,
    seq: streak(a),
    ult: ds.length ? ds[ds.length - 1] : null,
  };
}
const pc = (v) => (v == null ? "—" : v + "%"),
  pcc = (v) => (v == null ? "mut" : v >= 75 ? "ok" : v < 50 ? "bad" : "");
