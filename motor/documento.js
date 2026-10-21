#!/usr/bin/env node
// Uso: node documento.js <pasta-do-projeto>
// Lê <projeto>/documento.json e gera um documento A4 (ebook, guia, manual, kit) na identidade do brand.json.
// Depois: python render.py <projeto>/saida/<arquivo>.pptx  -> PDF para distribuir + imagens para conferir.
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");
const { carregarBrand, prepararLogo, runs } = require("./tema");
const { cobrir } = require("./layouts");

const W = 8.27, H = 11.69, M = 0.75, CW = W - 2 * M;

(async () => {
  const dir = path.resolve(process.argv[2] || ".");
  const spec = JSON.parse(fs.readFileSync(path.join(dir, "documento.json"), "utf8"));
  const B = await prepararLogo(carregarBrand(path.resolve(dir, spec.meta.brand)));
  const { T } = B, F = B.fonte;
  const pres = new pptxgen();
  pres.defineLayout({ name: "A4", width: W, height: H });
  pres.layout = "A4";
  pres.title = spec.meta.titulo || "";
  pres.author = spec.meta.autor || "";
  pres.theme = { headFontFace: F, bodyFontFace: F };
  const rodape = [];
  if (B.rodape) rodape.push({ text: { text: B.rodape, options: { x: M, y: H - 0.55, w: 5.5, h: 0.25, fontFace: F, fontSize: 7.5, color: T.muted, charSpacing: 2, margin: 0 } } });
  if (B.logoData) rodape.push({ image: { data: B.logoData, x: W - M - 0.9, y: 0.35, w: 0.9, h: 0.3 } });
  pres.defineSlideMaster({ title: "PAG", background: { color: T.bg }, objects: rodape,
    slideNumber: { x: W - M - 0.5, y: H - 0.55, w: 0.5, h: 0.25, fontFace: F, fontSize: 7.5, color: T.muted, align: "right" } });
  pres.defineSlideMaster({ title: "CAPA", background: { color: T.bg }, objects: [] });

  const txt = (s, t, o) => s.addText(t, { fontFace: F, margin: 0, isTextBox: true, valign: "top", color: T.text2, fontSize: 11.5, ...o });
  const rot = (s, t, y = 0.8) => txt(s, String(t).toUpperCase(), { x: M, y, w: CW - 1.2, h: 0.25, fontSize: 9, bold: true, color: T.secondary, charSpacing: 3 });
  const tit = (s, t, y = 1.1, size = 24, h = 1.0) => txt(s, runs(t, B), { x: M, y, w: CW, h, fontSize: size, bold: true, lineSpacingMultiple: 1.05 });
  const caixa = (s, x, y, w, h, hi) => s.addShape("rect", { x, y, w, h, fill: { color: hi ? T.surface2 : T.surface }, line: { color: hi ? T.accent : T.border, width: 0.75 } });
  // parágrafos: cada item do array vira um parágrafo; **destaque** vira a cor de destaque
  const paras = (lista, size = 13.5) => lista.flatMap((p, i) => runs(p, B, T.text2).map((r, k, a) => ({ text: r.text, options: { ...r.options, fontSize: size,
    breakLine: k === a.length - 1 && i < lista.length - 1, paraSpaceAfter: k === a.length - 1 ? 10 : 0 } })));
  const bullets = (lista, size = 13) => lista.map((t, i) => ({ text: t, options: { bullet: { indent: 12 }, fontSize: size, color: T.text2, breakLine: i < lista.length - 1, paraSpaceAfter: 8 } }));

  const P = {
    async capa(s, p) {
      if (B.logoData) s.addImage({ data: B.logoData, x: M, y: 0.7, w: 1.2, h: 0.4 });
      if (p.rotulo) rot(s, p.rotulo, 2.0);
      tit(s, p.titulo, 2.4, 40, 2.6);
      if (p.subtitulo) txt(s, p.subtitulo, { x: M, y: 5.1, w: CW - 0.8, h: 1.4, fontSize: 14 });
      const foto = B.fotos.redonda || B.fotos.retrato;
      if (foto && p.autor) s.addImage({ data: await cobrir(foto, 1.2, 1.2, true), x: M, y: 8.9, w: 1.2, h: 1.2 });
      if (p.autor) txt(s, [{ text: p.autor + "\n", options: { fontSize: 14, bold: true, color: T.text, breakLine: true } }, { text: p.autorLinha || "", options: { fontSize: 10 } }],
        { x: M + (foto ? 1.4 : 0), y: 9.05, w: 5, h: 1.0 });
    },
    // seção de texto corrido: rótulo, título, parágrafos e lista opcional
    texto(s, p) {
      if (p.rotulo) rot(s, p.rotulo);
      tit(s, p.titulo, 1.1, p.tamanhoTitulo || 24, 1.2);
      let y = 2.45;
      if (p.paragrafos) { const h = p.alturaTexto || 3.2; txt(s, paras(p.paragrafos), { x: M, y, w: CW, h }); y += h + 0.25; }
      if (p.lista) { if (p.tituloLista) { txt(s, String(p.tituloLista).toUpperCase(), { x: M, y, w: CW, h: 0.3, fontSize: 8.5, bold: true, color: T.secondary, charSpacing: 2 }); y += 0.4; }
        txt(s, bullets(p.lista), { x: M, y, w: CW, h: H - y - 1.0 }); }
    },
    // passos numerados (instalação, fluxo)
    passos(s, p) {
      if (p.rotulo) rot(s, p.rotulo);
      tit(s, p.titulo, 1.1, 24, 1.0);
      const n = p.itens.length, passo = Math.min(1.35, (H - 3.4) / n);
      p.itens.forEach(([t, d], i) => {
        const y = 2.4 + i * passo;
        txt(s, String(i + 1).padStart(2, "0"), { x: M, y, w: 0.7, h: 0.5, fontSize: 22, bold: true, color: i === 0 ? T.accent : T.border });
        txt(s, [{ text: t + "\n", options: { fontSize: 14, bold: true, color: T.text, breakLine: true } }, { text: d, options: { fontSize: 12 } }],
          { x: M + 0.85, y: y + 0.02, w: CW - 0.85, h: passo - 0.1 });
      });
    },
    // cartões em grade (formatos, agentes, brandings)
    cards(s, p) {
      if (p.rotulo) rot(s, p.rotulo);
      tit(s, p.titulo, 1.1, 24, 1.0);
      if (p.intro) txt(s, p.intro, { x: M, y: 2.1, w: CW, h: 0.6, fontSize: 13 });
      const cols = p.colunas || 2, gap = 0.2, cw = (CW - gap * (cols - 1)) / cols, top = p.intro ? 2.85 : 2.4;
      const linhas = Math.ceil(p.itens.length / cols), ch = Math.min(2.2, (H - top - 1.0 - gap * (linhas - 1)) / linhas);
      p.itens.forEach(([t, d], i) => {
        const x = M + (i % cols) * (cw + gap), y = top + Math.floor(i / cols) * (ch + gap), hi = i === p.destaque;
        caixa(s, x, y, cw, ch, hi);
        txt(s, [{ text: t + "\n", options: { fontSize: 13.5, bold: true, color: hi ? T.accent : T.text, breakLine: true } }, { text: d, options: { fontSize: 11.5 } }],
          { x: x + 0.18, y: y + 0.15, w: cw - 0.36, h: ch - 0.3 });
      });
    },
    tabela(s, p) {
      if (p.rotulo) rot(s, p.rotulo);
      tit(s, p.titulo, 1.1, 22, 0.9);
      const n = p.linhas[0].length;
      s.addTable(p.linhas.map((r, i) => r.map((c, j) => ({ text: i === 0 ? String(c).toUpperCase() : c, options: i === 0
        ? { bold: true, color: T.secondary, fill: { color: T.bg }, fontSize: 8, charSpacing: 1 }
        : { color: j === 0 ? T.text : T.text2, bold: j === 0, fill: { color: i % 2 ? T.surface : T.bg }, fontSize: 11 } }))),
        { x: M, y: 2.2, w: CW, colW: p.larguras || Array(n).fill(CW / n), fontFace: F, valign: "middle", border: { type: "solid", pt: 0.5, color: T.border }, rowH: p.alturaLinha || 0.55, margin: 0.08 });
    },
    // frase de destaque em página própria
    frase(s, p) {
      if (p.rotulo) rot(s, p.rotulo, 3.4);
      tit(s, p.texto, 3.8, 30, 4.0);
      if (p.apoio) txt(s, p.apoio, { x: M, y: 8.0, w: CW, h: 1.2, fontSize: 14 });
    },
    // fechamento com contato do branding (rótulos; ignora vazio e "PREENCHER")
    async cta(s, p) {
      if (p.rotulo) rot(s, p.rotulo, 1.8);
      tit(s, p.titulo, 2.2, 30, 2.6);
      if (p.texto) txt(s, p.texto, { x: M, y: 5.0, w: CW, h: 1.2, fontSize: 13 });
      const ROT = { whatsapp: "WhatsApp", site: "Site", email: "E-mail", linkedin: "LinkedIn", instagram: "Instagram" };
      const contato = { ...(B.contato || {}), ...(p.contato || {}) };
      const linhas = Object.entries(contato).filter(([, v]) => v && !/^preencher$/i.test(String(v)));
      linhas.forEach(([k, v], i) => {
        caixa(s, M, 6.4 + i * 0.75, CW, 0.6, i === 0);
        txt(s, [{ text: (ROT[k] || k).toUpperCase() + "   ", options: { fontSize: 9, bold: true, color: T.secondary, charSpacing: 2 } }, { text: v, options: { fontSize: 14, bold: true, color: T.text } }],
          { x: M + 0.25, y: 6.4 + i * 0.75, w: CW - 0.5, h: 0.6, valign: "middle" });
      });
    },
  };

  for (const [i, p] of spec.paginas.entries()) {
    if (!P[p.tipo]) throw new Error(`Página ${i + 1}: tipo desconhecido "${p.tipo}" (use ${Object.keys(P).join(", ")}).`);
    await P[p.tipo](pres.addSlide({ masterName: p.tipo === "capa" ? "CAPA" : "PAG" }), p);
  }
  fs.mkdirSync(path.join(dir, "saida"), { recursive: true });
  const out = path.join(dir, "saida", (spec.meta.arquivo || "documento") + ".pptx");
  await pres.writeFile({ fileName: out });
  console.log(`ok ${out} (${spec.paginas.length} páginas)`);
})().catch(e => { console.error("ERRO:", e.message); process.exit(1); });
