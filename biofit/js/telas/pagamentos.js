/* Tela Pagamentos */
function pags() {
  const r =
    [...db.pagamentos]
      .sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id)
      .map(
        (p) =>
          `<tr><td>${fd(p.data)}</td><td>${esc(al(p.alunoId)?.nome || "—")}</td><td>${R.format(p.valor)}</td><td class="tag ok">${p.status === "PAGO" ? "Pago" : p.status}</td></tr>`,
      )
      .join("") ||
    '<tr><td colspan="4" class="mut">Nenhum pagamento ainda. Registre o primeiro com “Novo pagamento”.</td></tr>';
  return `<h2>Pagamentos</h2><div class="bar"><button class="b" onclick="newPg()">Novo pagamento</button></div><div class="wrap"><table><thead><tr><th>Data</th><th>Aluno</th><th>Valor</th><th>Status</th></tr></thead><tbody>${r}</tbody></table></div>`;
}
function sv(s) {
  const a = al(s.value);
  $("#vl").value = a ? (pl(a.planoId)?.valor ?? "") : "";
}
function newPg() {
  if (!db.alunos.length) return toast("Cadastre um aluno primeiro");
  const a0 = db.alunos[0];
  modal(
    "Novo pagamento",
    `<label>Aluno<select name="alunoId" onchange="sv(this)">${db.alunos.map((a) => `<option value="${a.id}">${esc(a.nome)}</option>`).join("")}</select></label>
  <label>Valor (R$)<input id="vl" name="valor" type="number" min="0.01" step="0.01" required value="${pl(a0.planoId)?.valor ?? ""}"></label><p class="mut" style="font-size:13px">O vencimento avança pela duração do plano do aluno.</p>`,
    "Registrar",
    (d) => {
      const e = pagar(Number(d.alunoId), d.valor);
      if (e) return e;
      toast("Pagamento registrado");
    },
  );
}
