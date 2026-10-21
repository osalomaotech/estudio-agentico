#!/usr/bin/env node
// Uso: node carrossel.js <pasta-do-projeto>
// Lê <projeto>/carrossel.json e gera um carrossel 4:5 (1080x1350) na identidade do brand.json.
// LinkedIn: suba o PDF como documento. Instagram: exporte PNG por página (python render.py <pptx> --dpi 144).
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const { carregarBrand, runs } = require("./tema");
const { cobrir } = require("./layouts");

const W = 7.5, H = 9.375, M = 0.6;

(async () => {
  const dir = path.resolve(process.argv[2] || ".");
  const spec = JSON.parse(fs.readFileSync(path.join(dir, "carrossel.json"), "utf8"));
  const B = carregarBrand(path.resolve(dir, spec.meta.brand));
  const { T } = B, F = B.fonte;
  const pres = new pptxgen();
  pres.defineLayout({ name: "C45", width: W, height: H });
  pres.layout = "C45";
  pres.theme = { headFontFace: F, bodyFontFace: F };
  pres.defineSlideMaster({ title: "P", background: { color: T.bg }, objects: B.rodape ? [
    { text: { text: B.rodape, options: { x: M, y: H - 0.65, w: 5.5, h: 0.35, fontFace: F, fontSize: 11, color: T.text2, charSpacing: 2, margin: 0 } } }] : [],
    slideNumber: { x: W - M - 0.6, y: H - 0.65, w: 0.6, h: 0.35, fontFace: F, fontSize: 11, color: T.text2, align: "right" } });
  const txt = (s, t, o) => s.addText(t, { fontFace: F, margin: 0, isTextBox: true, valign: "top", color: T.text2, ...o });
  const rot = (s, t, y = 0.7) => txt(s, String(t).toUpperCase(), { x: M, y, w: W - 2 * M, h: 0.3, fontSize: 11, bold: true, color: T.secondary, charSpacing: 3 });

  const P = {
    capa: (s, p) => { if (p.rotulo) rot(s, p.rotulo, 1.0); txt(s, runs(p.titulo, B), { x: M, y: 1.6, w: W - 2 * M, h: 4.5, fontSize: 40, bold: true });
      if (p.texto) txt(s, p.texto + "  →", { x: M, y: 7.2, w: W - 2 * M, h: 0.9, fontSize: 16 }); },
    item: (s, p, i) => { txt(s, String(p.numero ?? i), { x: M, y: 0.7, w: 2.2, h: 2, fontSize: 140, bold: true, color: T.border });
      // um destaque por página: se o texto já tem **destaque**, o nome fica neutro
      if (p.rotulo) rot(s, p.rotulo, 3.0); txt(s, p.nome, { x: M, y: 3.4, w: W - 2 * M, h: 1, fontSize: 46, bold: true, color: String(p.texto).includes("**") ? T.text : T.accent });
      txt(s, runs(p.texto, B), { x: M, y: 4.8, w: W - 2 * M, h: 3, fontSize: 26, bold: true }); },
    lista: (s, p) => { if (p.rotulo) rot(s, p.rotulo); txt(s, runs(p.titulo, B), { x: M, y: 1.1, w: W - 2 * M, h: 1.4, fontSize: 32, bold: true });
      (p.itens || []).forEach((t, k) => { const y = 2.8 + k * 0.95, hi = k === p.destaque;
        s.addShape("rect", { x: M, y, w: W - 2 * M, h: 0.8, fill: { color: hi ? T.surface2 : T.surface }, line: { color: hi ? T.accent : T.border, width: 1 } });
        txt(s, t, { x: M + 0.25, y, w: W - 2 * M - 0.5, h: 0.8, fontSize: 16, bold: true, color: hi ? T.accent : T.text, valign: "middle" }); }); },
    matriz: (s, p) => { if (p.rotulo) rot(s, p.rotulo); txt(s, runs(p.titulo, B), { x: M, y: 1.1, w: W - 2 * M, h: 1.2, fontSize: 32, bold: true });
      const cw = (W - 2 * M - 0.25) / 2;
      (p.quadrantes || []).slice(0, 4).forEach((q, i) => { const x = M + (i % 2) * (cw + 0.25), y = 2.7 + Math.floor(i / 2) * 2.6, hi = i === 3;
        s.addShape("rect", { x, y, w: cw, h: 2.4, fill: { color: hi ? T.surface2 : T.surface }, line: { color: hi ? T.accent : T.border, width: 1 } });
        txt(s, [{ text: q.titulo + "\n", options: { fontSize: 17, bold: true, color: hi ? T.accent : T.text, breakLine: true } }, { text: q.legenda || "", options: { fontSize: 11, color: T.muted } }],
          { x: x + 0.2, y: y + 0.2, w: cw - 0.4, h: 2.0, valign: "bottom" }); }); },
    // dado com fonte: número grande, frase e a linha FONTE (o formato exige fonte em todo número)
    dado: (s, p) => { if (p.rotulo) rot(s, p.rotulo, 1.0);
      txt(s, p.valor, { x: M, y: 1.6, w: W - 2 * M, h: 2.2, fontSize: 110, bold: true, color: T.accent, valign: "bottom" });
      txt(s, runs(p.texto, B, T.text), { x: M, y: 4.1, w: W - 2 * M, h: 2.6, fontSize: 26, bold: true });
      if (p.fonte) txt(s, "FONTE  " + p.fonte, { x: M, y: H - 1.3, w: W - 2 * M, h: 0.5, fontSize: 12, color: T.text2 }); },
    pergunta: (s, p) => { if (p.rotulo) rot(s, p.rotulo, 1.0); txt(s, runs(p.texto, B), { x: M, y: 2.2, w: W - 2 * M, h: 5, fontSize: 36, bold: true }); },
    // CTA definido na entrevista (comentar palavra, link, mensagem...). A foto é opcional.
    cta: async (s, p) => { const foto = B.fotos.redonda || B.fotos.retrato;
      const dy = foto ? 0 : -1.9; // sem foto, o bloco sobe
      if (foto) s.addImage({ data: await cobrir(foto, 2.0, 2.0, true), x: M, y: 1.0, w: 2.0, h: 2.0 });
      if (p.nome) txt(s, p.nome, { x: M, y: 3.3 + dy, w: W - 2 * M, h: 0.6, fontSize: 26, bold: true, color: T.text });
      if (p.subtitulo) txt(s, p.subtitulo, { x: M, y: 3.95 + dy, w: W - 2 * M, h: 0.8, fontSize: 14 });
      txt(s, runs(p.texto, B), { x: M, y: 5.2 + dy, w: W - 2 * M, h: 2.5, fontSize: 28, bold: true }); },
  };

  for (const [i, p] of spec.paginas.entries()) {
    if (!P[p.tipo]) throw new Error(`Página ${i + 1}: tipo desconhecido "${p.tipo}" (use ${Object.keys(P).join(", ")}).`);
    await P[p.tipo](pres.addSlide({ masterName: "P" }), p, i + 1);
  }
  fs.mkdirSync(path.join(dir, "saida"), { recursive: true });
  const out = path.join(dir, "saida", (spec.meta.arquivo || "carrossel") + ".pptx");
  await pres.writeFile({ fileName: out });
  console.log(`ok ${out} (${spec.paginas.length} páginas)`);
})().catch(e => { console.error("ERRO:", e.message); process.exit(1); });
