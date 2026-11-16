/* Tela Alunos: lista, cadastro, edição e exclusão */
function rowsA(q = "") {
  q = q.toLowerCase();
  return (
    db.alunos
      .filter((a) => a.nome.toLowerCase().includes(q) || a.cpf.includes(q))
      .sort((a, b) => a.nome.localeCompare(b.nome))
      .map((a) => {
        const [s, c] = situ(a);
        return `<tr class="${s === "Inadimplente" ? "late" : ""}"><td>${esc(a.nome)}</td><td>${esc(a.cpf)}</td><td>${esc(pl(a.planoId)?.nome || "—")}</td><td>${fd(a.venc)}</td><td class="tag ${c}">${s}</td>
  <td class="acts"><button class="b s" onclick="pg(${a.id})">Pagar</button><button class="b g s" onclick="hA(${a.id})">Histórico</button><button class="b g s" onclick="edA(${a.id})">Editar</button><button class="b g s" onclick="rmA(${a.id})">Excluir</button></td></tr>`;
      })
      .join("") ||
    '<tr><td colspan="6" class="mut">Nenhum aluno encontrado. Use “Novo aluno” para cadastrar.</td></tr>'
  );
}
function alunos() {
  return `<h2>Alunos</h2><div class="bar"><input placeholder="Buscar por nome ou CPF" oninput="$('#tb').innerHTML=rowsA(this.value)" aria-label="Buscar"><button class="b" onclick="edA()">Novo aluno</button></div>
  <div class="wrap"><table><thead><tr><th>Nome</th><th>CPF</th><th>Plano</th><th>Vencimento</th><th>Situação</th><th></th></tr></thead><tbody id="tb">${rowsA()}</tbody></table></div>`;
}
function pg(id) {
  const a = al(id),
    p = pl(a.planoId);
  if (!p) return toast("Aluno sem plano");
  const e = pagar(id, p.valor);
  if (e) return toast(e);
  toast("Pagamento de " + R.format(p.valor) + " registrado");
  show();
}
function edA(id) {
  if (!db.planos.length) return toast("Cadastre um plano primeiro");
  const a = id
    ? al(id)
    : {
        nome: "",
        cpf: "",
        telefone: "",
        email: "",
        planoId: db.planos[0].id,
        inicio: today(),
        status: "ATIVO",
        login: "",
        rotina: db.treinos.map((t) => t.id),
      };
  const opt = (arr, v) =>
    arr.map(([k, l]) => `<option value="${k}" ${k == v ? "selected" : ""}>${esc(l)}</option>`).join("");
  modal(
    id ? "Editar aluno" : "Novo aluno",
    f("Nome", "nome", a.nome, "required") +
      f("CPF", "cpf", a.cpf, 'required inputmode="numeric"') +
      f("Telefone", "telefone", a.telefone, 'type="tel"') +
      f("E-mail", "email", a.email, 'type="email"') +
      `<label>Plano<select name="planoId">${opt(
        db.planos.map((p) => [p.id, `${p.nome} — ${R.format(p.valor)}`]),
        a.planoId,
      )}</select></label>` +
      f("Início", "inicio", a.inicio, 'type="date" required') +
      `<label>Status<select name="status">${opt(
        [
          ["ATIVO", "Ativo"],
          ["INATIVO", "Inativo"],
        ],
        a.status,
      )}</select></label>` +
      f("Usuário de acesso do aluno", "login", a.login || "", 'autocomplete="off"') +
      f(
        id ? "Nova senha (vazio mantém a atual)" : "Senha do aluno",
        "senha",
        "",
        'type="password" minlength="6" autocomplete="new-password"',
      ) +
      `<label>Treinos da rotina</label>` +
      (db.treinos
        .map(
          (t) =>
            `<label class="ck"><input type="checkbox" name="rotina" value="${t.id}" ${(a.rotina || []).includes(t.id) ? "checked" : ""}>${esc(t.nome)}</label>`,
        )
        .join("") || '<p class="mut" style="font-size:13px">Cadastre treinos na aba Treinos.</p>'),
    "Salvar",
    (d, fd) => {
      if (d.cpf.replace(/\D/g, "").length !== 11) return "CPF deve ter 11 dígitos.";
      if (db.alunos.some((x) => x.cpf === d.cpf && x.id !== id)) return "CPF já cadastrado.";
      const lg = (d.login || "").trim().toLowerCase();
      if (lg && db.alunos.some((x) => x.login === lg && x.id !== id)) return "Este usuário já existe.";
      if (lg && !a.h && !(d.senha && d.senha.length >= 6))
        return "Defina uma senha com 6 ou mais caracteres.";
      d.planoId = Number(d.planoId);
      const n = a.id ? a : { id: nid() };
      const mudou = !a.id || a.planoId !== d.planoId || a.inicio !== d.inicio;
      const { senha, ...r } = d;
      Object.assign(n, r);
      n.login = (d.login || "").trim().toLowerCase();
      n.rotina = fd.getAll("rotina").map(Number);
      if (senha)
        sha(n.id + ":" + senha).then((h) => {
          n.h = h;
          save();
        });
      if (mudou) n.venc = addM(d.inicio, pl(d.planoId).meses);
      if (!a.id) db.alunos.push(n);
      save();
      toast("Aluno salvo");
    },
  );
}
function rmA(id) {
  const a = al(id);
  ask(`Excluir <b>${esc(a.nome)}</b> e o histórico de pagamentos dele?`, () => {
    db.alunos = db.alunos.filter((x) => x.id !== id);
    db.pagamentos = db.pagamentos.filter((p) => p.alunoId !== id);
    db.envios.filter((e) => e.alunoId === id).forEach((e) => mdel(e.mid));
    db.envios = db.envios.filter((e) => e.alunoId !== id);
    save();
    show();
  });
}
