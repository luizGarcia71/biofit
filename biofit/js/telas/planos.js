/* Tela Planos */
function planos() {
  const r =
    db.planos
      .map(
        (
          p,
        ) => `<tr><td>${esc(p.nome)}</td><td>${R.format(p.valor)}</td><td>${p.meses} ${p.meses > 1 ? "meses" : "mês"}, ${p.freq || 3} treinos por semana</td><td>${db.alunos.filter((a) => a.planoId === p.id).length}</td>
  <td class="acts"><button class="b g s" onclick="edP(${p.id})">Editar</button><button class="b g s" onclick="rmP(${p.id})">Excluir</button></td></tr>`,
      )
      .join("") ||
    '<tr><td colspan="5" class="mut">Nenhum plano. Crie o primeiro com “Novo plano”.</td></tr>';
  return `<h2>Planos</h2><div class="bar"><button class="b" onclick="edP()">Novo plano</button></div><div class="wrap"><table><thead><tr><th>Nome</th><th>Valor</th><th>Duração</th><th>Alunos</th><th></th></tr></thead><tbody>${r}</tbody></table></div>`;
}
function edP(id) {
  const p = id ? pl(id) : { nome: "", valor: "", meses: 1, freq: 3 };
  modal(
    id ? "Editar plano" : "Novo plano",
    f("Nome", "nome", p.nome, "required") +
      f("Valor (R$)", "valor", p.valor, 'type="number" min="0.01" step="0.01" required') +
      f("Duração (meses)", "meses", p.meses, 'type="number" min="1" max="36" step="1" required') +
      f("Treinos por semana", "freq", p.freq || 3, 'type="number" min="1" max="7" step="1" required'),
    "Salvar",
    (d) => {
      const n = id ? p : { id: nid() };
      n.nome = d.nome.trim();
      n.valor = Number(d.valor);
      n.meses = Number(d.meses);
      n.freq = Number(d.freq);
      if (!id) db.planos.push(n);
      save();
      toast("Plano salvo");
    },
  );
}
function rmP(id) {
  const u = db.alunos.filter((a) => a.planoId === id).length;
  if (u) return toast(`Plano em uso por ${u} aluno(s). Mude o plano deles antes.`);
  ask("Excluir este plano?", () => {
    db.planos = db.planos.filter((p) => p.id !== id);
    save();
    show();
  });
}
