/* Portal do aluno: login, semana, envio de prova e feedback */
function stuLogin() {
  $("#auth").innerHTML =
    `<h2 class="logo" style="font-size:30px">Bio<b>fit</b></h2><p class="mut">Acesso do aluno.</p><form id="fs"><label>Usuário<input id="su" required autocomplete="username"></label><label>Senha<input id="sp" type="password" required autocomplete="current-password"></label><p class="err" id="ea"></p><button class="b" style="width:100%">Entrar</button></form><p style="text-align:center"><button class="b g s" type="button" onclick="authUI()">Voltar</button></p>`;
  $("#fs").onsubmit = async (e) => {
    e.preventDefault();
    const u = $("#su").value.trim().toLowerCase(),
      a = db.alunos.find((x) => x.login && x.login === u);
    if (!a || !a.h || a.h !== (await sha(a.id + ":" + $("#sp").value)))
      return ($("#ea").textContent = "Usuário ou senha inválidos.");
    if (a.status === "INATIVO") return ($("#ea").textContent = "Cadastro inativo. Fale com a recepção.");
    stuId = a.id;
    try {
      sessionStorage.setItem("st", a.id);
    } catch (x) {}
    stuStart();
  };
}
function stuStart() {
  $("#auth").hidden = true;
  $("#app").hidden = true;
  $("#stu").hidden = false;
  stuShow();
}
function stuShow() {
  const a = al(stuId);
  if (!a || a.status === "INATIVO") return logout();
  const p = pl(a.planoId),
    h = today(),
    late = a.venc < h,
    wk = week(),
    sl = wk.map((d) => slot(a, d)),
    tot = sl.filter(Boolean).length,
    ok = wk.filter((d, i) => sl[i] && envOf(a, d)?.status === "APROVADO").length;
  const days = wk
    .map((d, i) => {
      const s = sl[i],
        e = envOf(a, d);
      let st,
        b = "";
      if (!s) st = '<span class="mut">Descanso</span>';
      else if (e && e.status === "APROVADO") st = '<span class="tag ok">Validado</span>';
      else if (e && e.status === "PENDENTE")
        st = '<span class="tag" style="color:var(--pri)">Em análise</span>';
      else {
        st = e
          ? '<span class="tag bad">Rejeitado, envie outro</span>'
          : d < h
            ? '<span class="tag bad">Não enviado</span>'
            : d === h
              ? '<span class="mut">Aguardando sua prova</span>'
              : '<span class="mut">Em breve</span>';
        if (d <= h && !late) b = `<button class="b s" onclick="env('${d}')">Enviar foto ou vídeo</button>`;
      }
      return `<div class="box day ${d === h ? "hoje" : ""}"><div class="k">${DN[parse(d).getDay()]}, ${d.slice(8)}/${d.slice(5, 7)}</div><div class="dn">${s ? esc(s.t?.nome || "Treino a definir") : "—"}</div>${st}${s ? fbH(e) : ""}${b}</div>`;
    })
    .join("");
  const L =
    (a.rotina || [])
      .map(tr)
      .filter(Boolean)
      .map(
        (t) =>
          `<details><summary>${esc(t.nome)} (${t.ex.length} ${t.ex.length === 1 ? "exercício" : "exercícios"})</summary>${exList(t)}</details>`,
      )
      .join("") || '<p class="mut">Seu instrutor ainda não definiu seus treinos.</p>';
  const sH = slot(a, h),
    hoje =
      sH && sH.t
        ? `<div class="box" style="margin-bottom:14px"><div class="k">Treino de hoje</div><div class="dn" style="font-size:20px">${esc(sH.t.nome)}</div>${exList(sH.t)}</div>`
        : "";
  $("#stu").innerHTML =
    `<header><span class="logo">Bio<b>fit</b></span><span class="mut" style="flex:1">Olá, ${esc(a.nome.split(" ")[0])}</span><button class="b g s" onclick="logout()">Sair</button></header><main><h2>Minha semana</h2>${late ? `<div class="box bad" style="margin-bottom:14px">Seu plano venceu em ${fd(a.venc)}. Procure a recepção para renovar e voltar a enviar treinos.</div>` : ""}
  <div class="box" style="margin-bottom:14px"><div class="k">Plano ${esc(p?.nome || "—")}, ${p?.freq || 3} treinos por semana. Vence em ${fd(a.venc)}.</div><div class="n">${ok} de ${tot} <span class="k">validados nesta semana</span></div><div class="prog"><i style="width:${tot ? (ok / tot) * 100 : 0}%"></i></div></div>
  ${hoje}<div class="cards">${days}</div><h2 style="margin-top:22px">Meu histórico</h2>${histUI(a)}<h2 style="margin-top:22px">Meus treinos</h2>${L}</main>`;
  startAnims($("#stu"));
}
function env(d) {
  modal(
    "Enviar prova do treino",
    `<p class="mut" style="font-size:14px">Treino de ${fd(d)}. Escolha uma foto ou um vídeo, até 50 MB.</p><label>Arquivo<input type="file" name="file" accept="image/*,video/*" required></label>`,
    "Enviar",
    (x) => {
      const f = x.file;
      if (!f || !f.size) return "Escolha um arquivo.";
      if (!/^(image|video)\//.test(f.type)) return "Envie uma foto ou um vídeo.";
      if (f.size > 50 * 2 ** 20) return "Arquivo acima de 50 MB.";
      const a = al(stuId),
        s = slot(a, d),
        k = "m" + nid();
      mput(k, f)
        .then(() => {
          db.envios.push({
            id: nid(),
            alunoId: a.id,
            data: d,
            treinoId: s?.t?.id || null,
            mid: k,
            tipo: f.type.slice(0, 5),
            status: "PENDENTE",
            ts: Date.now(),
          });
          save();
          stuShow();
          toast("Enviado para análise");
        })
        .catch(() => toast("Não foi possível guardar o arquivo"));
    },
  );
}
