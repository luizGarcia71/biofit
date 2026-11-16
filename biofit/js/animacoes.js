/* Animações dos exercícios (bonecos em SVG) */
const rad = (d) => (d * Math.PI) / 180;
function limb(A, B, a, b, s) {
  const dx = B[0] - A[0],
    dy = B[1] - A[1],
    d = Math.min(Math.hypot(dx, dy), a + b - 0.01),
    g = Math.atan2(dy, dx),
    al = Math.acos(Math.max(-1, Math.min(1, (a * a + d * d - b * b) / (2 * a * d))));
  return [
    A,
    [A[0] + a * Math.cos(g + s * al), A[1] + a * Math.sin(g + s * al)],
    [A[0] + d * Math.cos(g), A[1] + d * Math.sin(g)],
  ];
}
const AN = {
  agachamento: {
    n: "Agachamento",
    tip: "Joelhos alinhados com os pés e coluna reta.",
    dur: 3.4,
    lb: (t) => (t < 0.5 ? "Descer" : "Subir"),
    f: (t) => {
      const s = 0.5 - 0.5 * Math.cos(2 * Math.PI * t),
        hip = [100 - 30 * s, 111 + 31 * s],
        le = 0.75 * s,
        sh = [hip[0] + 55 * Math.sin(le), hip[1] - 55 * Math.cos(le)],
        leg = limb(hip, [100, 188], 40, 40, -1),
        far = limb(hip, [94, 188], 40, 40, -1),
        ph = rad(80 - 80 * s),
        hand = [sh[0] + 52 * Math.cos(ph), sh[1] + 52 * Math.sin(ph)],
        head = [sh[0] + 16 * Math.sin(le * 0.8), sh[1] - 16 * Math.cos(le * 0.8)];
      return {
        lines: [
          { p: far.concat([[far[2][0] + 14, 188]]), c: "far" },
          { p: [hip, sh] },
          { p: leg.concat([[leg[2][0] + 14, 188]]) },
          { p: [sh, hand] },
        ],
        head: [head[0], head[1], 11],
        dots: [leg[1]],
      };
    },
  },
  flexao: {
    n: "Flexão de braço",
    tip: "Corpo em linha reta, cotovelos próximos do tronco.",
    dur: 3,
    lb: (t) => (t < 0.5 ? "Descer" : "Subir"),
    f: (t) => {
      const s = 0.5 - 0.5 * Math.cos(2 * Math.PI * t),
        toe = [30, 188],
        y = 133 + 37 * s,
        h = 188 - y,
        sh = [30 + Math.sqrt(16900 - h * h), y],
        arm = limb(sh, [148, 188], 28, 28, 1),
        u = [(sh[0] - toe[0]) / 130, (sh[1] - toe[1]) / 130],
        head = [sh[0] + 19 * u[0], sh[1] + 19 * u[1] + 2];
      return { lines: [{ p: [toe, sh] }, { p: arm }], head: [head[0], head[1], 11], dots: [arm[1]] };
    },
  },
  afundo: {
    n: "Afundo",
    tip: "Tronco ereto, joelho da frente sobre o tornozelo.",
    dur: 3.4,
    lb: (t) => (t < 0.5 ? "Descer" : "Subir"),
    f: (t) => {
      const s = 0.5 - 0.5 * Math.cos(2 * Math.PI * t),
        hip = [100, 120 + 26 * s],
        sh = [hip[0], hip[1] - 52],
        fr = limb(hip, [138, 188], 40, 40, -1),
        bk = limb(hip, [62, 186], 40, 40, -1),
        hand = [sh[0] + 8, sh[1] + 48];
      return {
        lines: [
          { p: bk.concat([[bk[2][0] + 9, 189]]), c: "far" },
          { p: [hip, sh] },
          { p: fr.concat([[fr[2][0] + 14, 188]]) },
          { p: [sh, hand] },
        ],
        head: [sh[0], sh[1] - 16, 11],
        dots: [fr[1]],
      };
    },
  },
  prancha: {
    n: "Prancha",
    tip: "Quadril alinhado, abdômen firme, respiração calma.",
    dur: 4,
    lb: () => "Segurar",
    f: (t) => {
      const b = 1.2 * Math.sin(2 * Math.PI * t),
        toe = [30, 188],
        sh = [150, 150 + b],
        el = [150, 187],
        u = [sh[0] - toe[0], sh[1] - toe[1]],
        n = Math.hypot(u[0], u[1]),
        head = [sh[0] + (19 * u[0]) / n, sh[1] + (19 * u[1]) / n + 2];
      return {
        lines: [{ p: [toe, sh] }, { p: [sh, el, [178, 187]] }],
        head: [head[0], head[1], 11],
        dots: [[90, 169 + b / 2]],
      };
    },
  },
  polichinelo: {
    n: "Polichinelo",
    tip: "Aterrisse leve, braços acima da cabeça.",
    dur: 1.3,
    lb: (t) => (t < 0.5 ? "Abrir" : "Fechar"),
    f: (t) => {
      const w = 2 * Math.PI * t,
        s = 0.5 - 0.5 * Math.cos(w),
        b = -9 * Math.abs(Math.sin(w)),
        dx = 6 + 32 * s,
        q = Math.sqrt(4900 - dx * dx),
        hy = 188 - q + b,
        sy = hy - 50,
        th = rad(15 + 140 * s),
        hx = 58 * Math.sin(th),
        hyy = sy + 58 * Math.cos(th);
      return {
        lines: [
          {
            p: [
              [100, hy],
              [100, sy],
            ],
          },
          {
            p: [
              [100, hy],
              [100 - dx, hy + q],
            ],
          },
          {
            p: [
              [100, hy],
              [100 + dx, hy + q],
            ],
          },
          {
            p: [
              [100, sy],
              [100 - hx, hyy],
            ],
          },
          {
            p: [
              [100, sy],
              [100 + hx, hyy],
            ],
          },
        ],
        head: [100, sy - 16, 11],
        dots: [
          [100 - hx, hyy],
          [100 + hx, hyy],
        ],
      };
    },
  },
  abdominal: {
    n: "Abdominal",
    tip: "Suba pelo abdômen, sem puxar o pescoço.",
    dur: 2.6,
    lb: (t) => (t < 0.5 ? "Subir" : "Descer"),
    f: (t) => {
      const s = 0.5 - 0.5 * Math.cos(2 * Math.PI * t),
        a = rad(40 * s),
        hip = [105, 178],
        foot = [150, 185],
        lg = limb(hip, foot, 40, 40, -1),
        sh = [hip[0] - 55 * Math.cos(a), hip[1] - 55 * Math.sin(a)],
        head = [sh[0] - 19 * Math.cos(a + 0.2), sh[1] - 19 * Math.sin(a + 0.2)];
      return {
        lines: [{ p: lg.concat([[160, 188]]) }, { p: [hip, sh] }, { p: [sh, [head[0] + 6, head[1] + 10]] }],
        head: [head[0], head[1], 11],
        dots: [sh],
      };
    },
  },
};
const NSV = "http://www.w3.org/2000/svg",
  ANREG = new Set(),
  anStill = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
let anRun = false,
  anLast = 0;
function guessAnim(nome) {
  const s = String(nome || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
  return /agach/.test(s)
    ? "agachamento"
    : /flex/.test(s)
      ? "flexao"
      : /afund/.test(s)
        ? "afundo"
        : /prancha/.test(s)
          ? "prancha"
          : /polich/.test(s)
            ? "polichinelo"
            : /abdom|crunch/.test(s)
              ? "abdominal"
              : "";
}
function migra() {
  db.treinos = db.treinos || [];
  db.envios = db.envios || [];
  db.treinos.forEach((t) => {
    t.ex = (t.ex || []).map((x) => (typeof x === "string" ? { n: x, s: "", a: guessAnim(x) } : x));
  });
  if (!db.seeded) {
    if (!db.treinos.length) {
      db.treinos.push(
        {
          id: nid(),
          nome: "Treino A",
          ex: [
            { n: "Agachamento", s: "3x12", a: "agachamento" },
            { n: "Flexão de braço", s: "3x10", a: "flexao" },
          ],
        },
        {
          id: nid(),
          nome: "Treino B",
          ex: [
            { n: "Afundo", s: "3x10 por perna", a: "afundo" },
            { n: "Prancha", s: "3x30 s", a: "prancha" },
          ],
        },
        {
          id: nid(),
          nome: "Treino C",
          ex: [
            { n: "Polichinelo", s: "3x30 s", a: "polichinelo" },
            { n: "Abdominal", s: "3x15", a: "abdominal" },
          ],
        },
      );
    }
    db.seeded = true;
  }
}
function exHTML(x) {
  const A = AN[x.a];
  return `<div class="ex"><div class="exf">${A ? `<svg class="fig" data-an="${x.a}" viewBox="0 0 200 200" role="img" aria-label="Animação: ${esc(A.n)}"><line x1="10" y1="190" x2="190" y2="190" stroke="var(--bd)" stroke-width="2" stroke-linecap="round"/><g class="gb"></g><g class="gd"></g></svg><span class="ph"></span>` : '<div class="mut" style="font-size:13px;padding:30px 0;text-align:center">Sem animação</div>'}</div><div class="exi"><b>${esc(x.n)}</b>${x.s ? `<div class="k">${esc(x.s)}</div>` : ""}${A ? `<div class="k">${esc(A.tip)}</div>` : ""}</div></div>`;
}
const exList = (t) => t.ex.map(exHTML).join("") || '<p class="mut">Este treino ainda não tem exercícios.</p>';
function anDraw(el) {
  const c = el._an,
    r = c.A.f(c.t),
    gb = el.querySelector(".gb"),
    gd = el.querySelector(".gd");
  while (c.paths.length < r.lines.length) {
    const p = document.createElementNS(NSV, "path");
    p.setAttribute("fill", "none");
    p.setAttribute("stroke", "var(--tx)");
    p.setAttribute("stroke-width", "5");
    p.setAttribute("stroke-linecap", "round");
    p.setAttribute("stroke-linejoin", "round");
    gb.insertBefore(p, c.head);
    c.paths.push(p);
  }
  r.lines.forEach((l, i) => {
    const p = c.paths[i];
    p.setAttribute("d", "M" + l.p.map((q) => q[0].toFixed(1) + " " + q[1].toFixed(1)).join("L"));
    p.setAttribute("opacity", l.c === "far" ? "0.4" : "1");
  });
  c.head.setAttribute("cx", r.head[0].toFixed(1));
  c.head.setAttribute("cy", r.head[1].toFixed(1));
  c.head.setAttribute("r", r.head[2]);
  while (c.dots.length < r.dots.length) {
    const d = document.createElementNS(NSV, "circle");
    d.setAttribute("r", "4.5");
    d.setAttribute("fill", "#f26b1d");
    gd.appendChild(d);
    c.dots.push(d);
  }
  r.dots.forEach((d, i) => {
    c.dots[i].setAttribute("cx", d[0].toFixed(1));
    c.dots[i].setAttribute("cy", d[1].toFixed(1));
  });
  const l = c.A.lb(c.t);
  if (l !== c.lab) {
    c.lab = l;
    if (c.ph) c.ph.textContent = l;
  }
}
function startAnims(root) {
  root.querySelectorAll("svg[data-an]").forEach((el) => {
    if (el._an) return;
    const A = AN[el.dataset.an];
    if (!A) return;
    const head = document.createElementNS(NSV, "circle");
    head.setAttribute("fill", "var(--card)");
    head.setAttribute("stroke", "var(--tx)");
    head.setAttribute("stroke-width", "4");
    el.querySelector(".gb").appendChild(head);
    el._an = { A, t: anStill ? 0.45 : 0, paths: [], dots: [], head, lab: "", ph: el.nextElementSibling };
    ANREG.add(el);
    anDraw(el);
  });
  if (!anRun && !anStill) {
    anRun = true;
    anLast = performance.now();
    requestAnimationFrame(anTick);
  }
}
function anTick(n) {
  const dt = Math.min(0.1, (n - anLast) / 1000);
  anLast = n;
  ANREG.forEach((el) => {
    if (!el.isConnected) {
      ANREG.delete(el);
      return;
    }
    if (!el.getClientRects().length) return;
    el._an.t = (el._an.t + dt / el._an.A.dur) % 1;
    anDraw(el);
  });
  requestAnimationFrame(anTick);
}
