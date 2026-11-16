/* Estado global, formatação de datas e valores, armazenamento local e utilitários */
const $ = (s) => document.querySelector(s),
  KEY = "biofit_gym_crm_v1";
let db,
  view = "dash",
  logged = false;
const R = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const esc = (s) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
const pad = (n) => String(n).padStart(2, "0");
const iso = (d) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const today = () => iso(new Date());
const parse = (s) => new Date(s + "T00:00:00");
const fd = (s) => (s ? parse(s).toLocaleDateString("pt-BR") : "—");
function addM(s, n) {
  const d = parse(s),
    day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  d.setDate(Math.min(day, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()));
  return iso(d);
}
function load() {
  try {
    db = JSON.parse(localStorage.getItem(KEY));
  } catch (e) {}
  if (!db)
    db = {
      user: null,
      seq: 4,
      planos: [
        { id: 1, nome: "Mensal", valor: 120, meses: 1 },
        { id: 2, nome: "Trimestral", valor: 300, meses: 3 },
        { id: 3, nome: "Anual", valor: 1000, meses: 12 },
      ],
      alunos: [],
      pagamentos: [],
    };
}
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch (e) {
    toast("Não foi possível salvar neste navegador");
  }
}
function toast(t) {
  const e = $("#toast");
  e.textContent = t;
  e.classList.add("on");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => e.classList.remove("on"), 2500);
}
const nid = () => db.seq++,
  pl = (id) => db.planos.find((p) => p.id == id),
  al = (id) => db.alunos.find((a) => a.id == id);
async function sha(s) {
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
}
