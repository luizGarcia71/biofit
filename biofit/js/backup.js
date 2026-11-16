/* Backup e restauração dos dados */
function backup() {
  modal(
    "Backup dos dados",
    `<p class="mut" style="font-size:14px">Os dados ficam só neste navegador. Copie o texto abaixo para guardar uma cópia, ou cole uma cópia anterior para restaurar. Fotos e vídeos dos alunos não entram no backup.</p><textarea name="j" rows="8" spellcheck="false">${esc(JSON.stringify(db))}</textarea>`,
    "Restaurar",
    (d) => {
      try {
        const n = JSON.parse(d.j);
        if (!n.alunos || !n.planos || !n.pagamentos) throw 0;
        db = n;
        migra();
        save();
        toast("Dados restaurados");
      } catch (e) {
        return "Texto de backup inválido.";
      }
    },
  );
}
