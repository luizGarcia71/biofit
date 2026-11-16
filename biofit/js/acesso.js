/* Login e criação do acesso do administrador */
function authUI() {
  const novo = !db.user;
  $("#auth").innerHTML =
    `<h2 class="logo" style="font-size:30px">Bio<b>fit</b></h2><p class="mut">${novo ? "Crie o acesso do administrador para começar." : "Entre para gerenciar a academia."}</p>
  <form id="fa"><label>E-mail<input id="em" type="email" required autocomplete="username"></label>
  <label>Senha<input id="pw" type="password" required minlength="6" autocomplete="${novo ? "new-password" : "current-password"}"></label>
  <p class="err" id="ea"></p><button class="b" style="width:100%">${novo ? "Criar acesso" : "Entrar"}</button></form>${novo ? "" : '<p style="text-align:center"><button class="b g s" type="button" onclick="stuLogin()">Sou aluno</button></p>'}`;
  $("#fa").onsubmit = async (e) => {
    e.preventDefault();
    const em = $("#em").value.trim().toLowerCase(),
      h = await sha(em + ":" + $("#pw").value);
    if (!db.user) {
      db.user = { email: em, h };
      save();
    } else if (db.user.email !== em || db.user.h !== h)
      return ($("#ea").textContent = "E-mail ou senha inválidos.");
    logged = true;
    try {
      sessionStorage.setItem("ok", "1");
    } catch (x) {}
    start();
  };
}
function start() {
  $("#auth").hidden = true;
  $("#app").hidden = false;
  show();
}
function logout() {
  logged = false;
  try {
    sessionStorage.removeItem("ok");
    sessionStorage.removeItem("st");
  } catch (x) {}
  location.reload();
}
