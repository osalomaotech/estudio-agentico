// Catálogo de layouts. Cada layout recebe (slide, dados do slides.json, contexto) e desenha.
// Campos de texto aceitam "**destaque**". Documentação de cada campo em references/layouts.md.
const path = require("path");
const sharp = require("sharp");
const QR = require("qrcode");
const { W, H, M } = require("./tema");

// Recorta a imagem na proporção exata do espaço antes de inserir.
// Motivo: o LibreOffice Impress ignora o recorte interno do .pptx e estica a foto.
async function cobrir(arquivo, w, h, redonda = false) {
  const px = 200, larg = Math.round(w * px), alt = Math.round(h * px);
  let img = sharp(arquivo).resize(larg, alt, { fit: "cover", position: "attention" });
  if (redonda) {
    const mascara = Buffer.from(`<svg width="${larg}" height="${alt}"><circle cx="${larg / 2}" cy="${alt / 2}" r="${Math.min(larg, alt) / 2}"/></svg>`);
    img = img.composite([{ input: mascara, blend: "dest-in" }]);
  }
  const buf = await img.png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}
// Imagem inteira, sem recorte, dentro de uma moldura (screenshots de fonte)
async function conter(arquivo, w, h) {
  const meta = await sharp(arquivo).metadata();
  const r = meta.width / meta.height;
  return r > w / h ? { w, h: w / r } : { w: h * r, h };
}

const L = {
  async capa(s, d, { B, h }) {
    const temFoto = d.foto !== false && B.fotos.retrato;
    const larg = temFoto ? 6.0 : W - 2 * M;
    if (B.logoData && B.logoEmTodos) s.addImage({ data: B.logoData, x: M, y: 0.55, w: 0.9, h: 0.3 }); // capa leva o logo à esquerda, longe da foto
    if (d.rotulo) h.rotulo(s, d.rotulo, { y: 1.3 });
    h.titulo(s, d.titulo, { y: 1.65, w: larg, h: 2.1, size: 32 });
    if (d.subtitulo) h.corpo(s, d.subtitulo, { y: 3.85, w: larg, h: 0.5, size: 16, cor: B.T.text });
    if (d.para) h.txt(s, "Para: " + d.para, { x: M, y: 4.4, w: larg, h: 0.4, fontSize: 12, color: B.T.muted }); // destinatário (propostas)
    if (temFoto) s.addImage({ data: await cobrir(B.fotos.retrato, 3.0, H), x: 7.0, y: 0, w: 3.0, h: H });
  },

  // Frase grande centralizada: pergunta, tese, virada, conclusão
  async frase(s, d, { B, h }) {
    if (d.sobretitulo) h.txt(s, B.rotuloCaixaAlta ? String(d.sobretitulo).toUpperCase() : d.sobretitulo, { x: 1, y: 1.0, w: 8, h: 0.3, fontSize: 10, bold: true, color: B.T.secondary, charSpacing: 3, align: "center" });
    h.titulo(s, d.texto, { x: 1, y: 1.5, w: 8, h: 2.6, size: d.tamanho || 32, align: "center", valign: "middle" });
  },

  // Tese alinhada à esquerda, com a segunda linha em destaque
  async tese(s, d, { h }) {
    h.titulo(s, d.texto, { y: 1.4, h: 2.6, size: 36, w: 8.2 });
  },

  async "case-evidencia"(s, d, { B, h, dir }) {
    h.rotulo(s, d.rotulo || "");
    h.titulo(s, d.titulo, { h: 1.0, size: 30 });
    if (d.imagem) {
      const arq = path.resolve(dir, d.imagem);
      const { w, h: ih } = await conter(arq, 5.2, 2.6);
      s.addShape("rect", { x: M, y: 2.0, w: w + 0.12, h: ih + 0.12, fill: { color: "FFFFFF" }, line: { color: B.T.border, width: 0.75 } });
      s.addImage({ path: arq, x: M + 0.06, y: 2.06, w, h: ih });
    }
    if (d.texto) h.corpo(s, d.texto, { x: d.imagem ? 6.35 : M, y: 2.0, w: d.imagem ? 3.05 : 8.8, h: 2.2 });
    h.fonteRodape(s, d.fonte);
  },

  // 1 ou 2 números grandes. Só o primeiro leva a cor de destaque.
  async stat(s, d, { B, h }) {
    if (d.rotulo) h.rotulo(s, d.rotulo);
    const n = d.numeros || [];
    n.slice(0, 2).forEach((x, i) => {
      const xx = M + i * 4.6;
      h.txt(s, x.valor, { x: xx, y: 0.9, w: 4.4, h: 1.2, fontSize: n.length === 1 ? 88 : 66, bold: true, color: i === 0 ? B.T.accent : B.T.text, valign: "bottom" });
      h.txt(s, x.legenda, { x: xx, y: 2.18, w: 4.2, h: 0.8, fontSize: 13 });
    });
    if (d.texto) h.corpo(s, d.texto, { y: 3.4, w: 8.8, h: 0.8, size: 15, cor: B.T.text });
    h.fonteRodape(s, d.fonte);
  },

  // Dois cards lado a lado (antes/depois, RPA/agente, problema/solução). O segundo é destaque.
  async contraste(s, d, { B, h }) {
    if (d.rotulo) h.rotulo(s, d.rotulo);
    (d.lados || []).slice(0, 2).forEach((l, i) => {
      const x = M + i * 4.5, hi = i === 1;
      h.card(s, x, 1.0, 4.2, 3.2, hi);
      if (l.rotulo) h.txt(s, String(l.rotulo).toUpperCase(), { x: x + 0.3, y: 1.25, w: 3.6, h: 0.3, fontSize: 9, bold: true, charSpacing: 3, color: B.T.secondary });
      h.txt(s, l.titulo, { x: x + 0.3, y: 1.6, w: 3.6, h: 1.3, fontSize: 28, bold: true, color: hi ? B.T.accent : B.T.text });
      if (l.texto) h.txt(s, l.texto, { x: x + 0.3, y: 3.0, w: 3.6, h: 1.0, fontSize: 13 });
    });
    h.fonteRodape(s, d.fonte);
  },

  // Abertura de seção numerada (lente, pilar, etapa) com um caso ou número-herói
  async secao(s, d, { B, h }) {
    h.txt(s, String(d.numero ?? ""), { x: M, y: 0.7, w: 1.3, h: 1.3, fontSize: 80, bold: true, color: B.T.border });
    if (d.rotulo) h.rotulo(s, d.rotulo, { x: 2.0, y: 0.85 });
    h.txt(s, d.nome, { x: 2.0, y: 1.1, w: 7, h: 0.7, fontSize: 34, bold: true, color: B.T.accent });
    if (d.linha) h.txt(s, d.linha, { x: 2.0, y: 1.85, w: 7, h: 0.4, color: B.T.text });
    if (d.destaque) h.titulo(s, d.destaque, { x: 2.0, y: 2.45, w: 7.4, h: 1.6, size: 34 });
    h.fonteRodape(s, d.fonte);
  },

  // Frase de "o que muda", definição ou aprendizado
  async afirmacao(s, d, { h }) {
    if (d.rotulo) h.rotulo(s, d.rotulo);
    h.titulo(s, d.texto, { y: 1.3, h: 2.8, w: 8.6, size: 28, valign: "middle" });
  },

  // Grade de 2 a 6 cards curtos; "destaque" = índice do card em laranja
  async "cards-grid"(s, d, { B, h }) {
    if (d.rotulo) h.rotulo(s, d.rotulo);
    const itens = d.itens || [], cols = itens.length <= 4 ? 2 : 3, cw = (W - 2 * M - 0.25 * (cols - 1)) / cols;
    const linhas = Math.ceil(itens.length / cols), ch = Math.min(1.5, (3.6 - 0.2 * (linhas - 1)) / linhas);
    itens.forEach((t, i) => {
      const x = M + (i % cols) * (cw + 0.25), y = 1.0 + Math.floor(i / cols) * (ch + 0.2), hi = i === d.destaque;
      h.card(s, x, y, cw, ch, hi);
      const [tt, sub] = String(t).split("|");
      h.txt(s, sub ? [{ text: tt + "\n", options: { bold: true, fontSize: 15, color: hi ? B.T.accent : B.T.text, breakLine: true } }, { text: sub, options: { fontSize: 11 } }] : tt,
        { x: x + 0.2, y, w: cw - 0.4, h: ch, fontSize: 16, bold: !sub, color: hi ? B.T.accent : B.T.text, valign: "middle" });
    });
  },

  // Etapas ligadas por setas, com título opcional acima
  async fluxo(s, d, { B, h }) {
    if (d.rotulo) h.rotulo(s, d.rotulo);
    if (d.titulo) h.titulo(s, d.titulo, { size: 26, h: 1.2 });
    const itens = d.itens || [], gap = 0.28, bw = (W - 2 * M - gap * (itens.length - 1)) / itens.length, bh = 0.85, y = d.titulo ? 2.6 : 2.2;
    itens.forEach((t, i) => {
      const x = M + i * (bw + gap), hi = i === d.destaque;
      h.card(s, x, y, bw, bh, hi);
      h.txt(s, String(t).toUpperCase(), { x, y, w: bw, h: bh, fontSize: itens.length > 4 ? 8 : 10, bold: true, align: "center", valign: "middle", color: hi ? B.T.accent : B.T.text, charSpacing: 1, margin: 2 });
      if (i < itens.length - 1) h.txt(s, "→", { x: x + bw, y, w: gap, h: bh, fontSize: 11, color: B.T.secondary, align: "center", valign: "middle" });
    });
    if (d.texto) h.corpo(s, d.texto, { y: y + 1.2, w: 8.8, h: 0.6, size: 13 });
  },

  async tabela(s, d, { B, h }) {
    if (d.rotulo) h.rotulo(s, d.rotulo);
    const rows = d.linhas || [];
    const n = rows[0]?.length || 3;
    const colW = d.larguras || (n === 3 ? [1.8, 2.4, 4.6] : Array(n).fill((W - 2 * M) / n));
    s.addTable(rows.map((r, i) => r.map((c, j) => ({ text: i === 0 ? String(c).toUpperCase() : c, options: i === 0
      ? { bold: true, color: B.T.secondary, fill: { color: B.T.bg }, fontSize: 9, charSpacing: 2 }
      : { color: j === 1 && n === 3 ? B.T.text2 : B.T.text, bold: j === 0, fill: { color: i % 2 ? B.T.surface : B.T.bg }, fontSize: 11 } }))),
      { x: M, y: 0.85, w: W - 2 * M, colW, fontFace: B.fonte, valign: "middle", border: { type: "solid", pt: 0.5, color: B.T.border }, rowH: Math.min(0.6, 3.9 / rows.length), margin: 0.08 });
  },

  // Item numerado de uma lista longa (técnica, passo, princípio)
  async item(s, d, { B, h }) {
    if (d.rotulo) h.rotulo(s, d.rotulo);
    h.txt(s, String(d.numero).padStart(2, "0"), { x: M, y: 1.2, w: 2.2, h: 1.6, fontSize: 96, bold: true, color: B.T.accent });
    h.titulo(s, d.titulo, { x: 3.0, y: 1.35, w: 6.4, h: 0.9, size: 30 });
    if (d.texto) h.corpo(s, d.texto, { x: 3.0, y: 2.35, w: 6.4, h: 1.4, size: 18 });
  },

  // Matriz 2x2 com legenda opcional por quadrante; o quadrante 4 leva destaque
  async "matriz-2x2"(s, d, { B, h }) {
    if (d.rotulo) h.rotulo(s, d.rotulo);
    h.titulo(s, d.titulo || "", { size: 26, h: 1.0, w: 4 });
    if (d.texto) h.corpo(s, d.texto, { y: 2.1, w: 3.8, h: 1.6, size: 13 });
    (d.quadrantes || []).slice(0, 4).forEach((q, i) => {
      const x = 4.9 + (i % 2) * 2.3, y = 0.55 + Math.floor(i / 2) * 2.05, hi = i === (d.destaque ?? 3);
      h.card(s, x, y, 2.15, 1.9, hi);
      if (q.exemplo) h.txt(s, q.exemplo, { x: x + 0.15, y: y + 0.15, w: 1.85, h: 0.6, fontSize: 9, italic: true, color: B.T.secondary });
      h.txt(s, [{ text: q.titulo + "\n", options: { fontSize: 12, bold: true, color: hi ? B.T.accent : B.T.text, breakLine: true } }, { text: q.legenda || "", options: { fontSize: 8, color: B.T.muted } }],
        { x: x + 0.15, y: y + 0.8, w: 1.85, h: 0.95, valign: "bottom" });
    });
    if (d.eixo) h.txt(s, d.eixo, { x: 4.9, y: 4.7, w: 4.45, h: 0.2, fontSize: 7, color: B.T.muted, charSpacing: 2 });
  },

  // Foto em coluna + linha do tempo (apresentação do autor)
  async "linha-do-tempo"(s, d, { B, h }) {
    const temFoto = B.fotos.retrato && d.foto !== false, x0 = temFoto ? 3.9 : M;
    if (temFoto) {
      s.addImage({ data: await cobrir(B.fotos.retrato, 3.4, H), x: 0, y: 0, w: 3.4, h: H });
      s.addShape("rect", { x: 3.4, y: 0, w: 0.04, h: H, fill: { color: B.T.accent }, line: { type: "none" } });
    }
    if (d.rotulo) h.rotulo(s, d.rotulo, { x: x0 });
    h.titulo(s, d.titulo || "", { x: x0, y: 0.7, w: 5.5, h: 0.5, size: 24 });
    const itens = d.itens || [], passo = Math.min(0.62, 3.4 / Math.max(itens.length, 1));
    itens.forEach(([ano, t], i) => {
      const yy = 1.45 + i * passo, ult = i === itens.length - 1;
      s.addShape("ellipse", { x: x0, y: yy + 0.07, w: 0.13, h: 0.13, fill: { color: ult ? B.T.accent : B.T.secondary }, line: { type: "none" } });
      const la = d.larguraAno || 0.9; // rótulos longos ("Semana 1") pedem coluna maior
      h.txt(s, ano, { x: x0 + 0.3, y: yy, w: la, h: 0.28, fontSize: 11, bold: true, color: ult ? B.T.accent : B.T.text });
      h.txt(s, t, { x: x0 + 0.3 + la, y: yy, w: W - x0 - 0.9 - la, h: passo, fontSize: 11 });
    });
  },

  // Até 6 números de autoridade; foto de fundo opcional (brand.fotos.fundo) a 55% de transparência
  async autoridade(s, d, { B, h }) {
    const comFundo = B.fotos.fundo && d.fundo !== false, cols = comFundo ? 2 : 3;
    if (comFundo) s.addImage({ data: await cobrir(B.fotos.fundo, 4.4, H), x: 5.6, y: 0, w: 4.4, h: H, transparency: 55 });
    if (d.rotulo) h.rotulo(s, d.rotulo);
    (d.numeros || []).slice(0, 6).forEach((n, i) => {
      const x = M + (i % cols) * (comFundo ? 2.5 : 2.95), y = (comFundo ? 0.95 : 1.2) + Math.floor(i / cols) * (comFundo ? 1.2 : 1.5);
      h.txt(s, n.valor, { x, y, w: 2.4, h: 0.5, fontSize: 24, bold: true, color: i === (d.destaque ?? 2) ? B.T.accent : B.T.text });
      h.txt(s, n.legenda, { x, y: y + 0.5, w: 2.3, h: 0.45, fontSize: 10 });
    });
  },

  // Proposta comercial: investimento em cards com valor
  async investimento(s, d, { B, h }) {
    if (d.rotulo) h.rotulo(s, d.rotulo);
    if (d.titulo) h.titulo(s, d.titulo, { size: 26, h: 0.9 });
    const op = d.opcoes || [], cw = (W - 2 * M - 0.25 * (op.length - 1)) / Math.max(op.length, 1);
    op.forEach((o, i) => {
      const x = M + i * (cw + 0.25), hi = i === d.destaque;
      h.card(s, x, 1.85, cw, 2.75, hi);
      h.txt(s, String(o.nome).toUpperCase(), { x: x + 0.2, y: 2.0, w: cw - 0.4, h: 0.3, fontSize: 9, bold: true, charSpacing: 2, color: hi ? B.T.accent : B.T.secondary });
      if (hi) { // selo da opção recomendada, acima do card
        s.addShape("rect", { x: x + 0.2, y: 1.57, w: 1.3, h: 0.28, fill: { color: B.T.accent }, line: { type: "none" } });
        h.txt(s, (d.selo || "Recomendado").toUpperCase(), { x: x + 0.2, y: 1.57, w: 1.3, h: 0.28, fontSize: 7, bold: true, charSpacing: 2, color: B.T.bg, align: "center", valign: "middle" });
      }
      h.txt(s, o.valor, { x: x + 0.2, y: 2.35, w: cw - 0.4, h: 0.6, fontSize: 24, bold: true, color: B.T.text });
      h.txt(s, (o.inclui || []).map((t, k, a) => ({ text: t, options: { bullet: { indent: 10 }, breakLine: k < a.length - 1, paraSpaceAfter: 3 } })),
        { x: x + 0.2, y: 3.05, w: cw - 0.4, h: 1.45, fontSize: 10 });
    });
    if (d.nota) h.txt(s, d.nota, { x: M, y: 4.75, w: W - 2 * M, h: 0.3, fontSize: 9, color: B.T.muted });
  },

  // Escopo: o que está incluído x o que fica fora (listas). O lado "incluído" leva destaque.
  async escopo(s, d, { B, h }) {
    if (d.rotulo) h.rotulo(s, d.rotulo);
    if (d.titulo) h.titulo(s, d.titulo, { size: 26, h: 0.8 });
    [[d.tituloIncluido || "Está incluído", d.incluido || [], true], [d.tituloFora || "Fica fora", d.fora || [], false]].forEach(([tt, itens, hi], i) => {
      const x = M + i * 4.5, y = d.titulo ? 1.6 : 1.0, hh = 4.6 - y;
      h.card(s, x, y, 4.2, hh, hi);
      h.txt(s, String(tt).toUpperCase(), { x: x + 0.25, y: y + 0.2, w: 3.7, h: 0.3, fontSize: 9, bold: true, charSpacing: 2, color: hi ? B.T.accent : B.T.secondary });
      h.txt(s, itens.map((t, k, a) => ({ text: t, options: { bullet: { indent: 12 }, breakLine: k < a.length - 1, paraSpaceAfter: 5 } })),
        { x: x + 0.25, y: y + 0.6, w: 3.7, h: hh - 0.8, fontSize: 13, color: B.T.text });
    });
  },

  // Fechamento com QR para o CTA (link definido na entrevista) e contato do branding
  async "cta-qr"(s, d, { B, h }) {
    if (d.url) {
      // QR precisa de cor escura sobre branco: usa o fundo se ele for escuro, senão a cor do texto
      const lum = c => { const n = parseInt(c, 16); return (0.3 * (n >> 16) + 0.59 * ((n >> 8) & 255) + 0.11 * (n & 255)) / 255; };
      const qr = await QR.toDataURL(d.url, { margin: 1, width: 600, color: { dark: "#" + (lum(B.T.bg) < 0.5 ? B.T.bg : B.T.text), light: "#FFFFFF" } });
      s.addImage({ data: qr, x: 6.4, y: 1.0, w: 3.0, h: 3.0 });
      h.txt(s, d.urlVisivel || d.url.replace(/^https?:\/\/(www\.)?/, ""), { x: 6.4, y: 4.1, w: 3.0, h: 0.3, fontSize: 10, color: B.T.muted, align: "center" });
    }
    if (B.fotos.redonda || B.fotos.retrato) s.addImage({ data: await cobrir(B.fotos.redonda || B.fotos.retrato, 1.1, 1.1, true), x: M, y: 0.6, w: 1.1, h: 1.1 });
    h.titulo(s, d.titulo, { y: 2.0, w: 5.4, h: 1.4, size: 24 });
    if (d.texto) h.corpo(s, d.texto, { y: 3.5, w: 5.4, h: 0.6, size: 15, cor: B.T.text });
    const contato = { ...(B.contato || {}), ...(d.contato || {}) }; // o slide pode sobrepor um campo
    const ROT = { whatsapp: "WhatsApp", site: "Site", email: "E-mail", linkedin: "LinkedIn", instagram: "Instagram" };
    const linhas = Object.entries(contato).filter(([, v]) => v && !/^preencher$/i.test(String(v))).map(([k, v]) => `${ROT[k] || k}: ${v}`);
    if (d.mostrarContato && linhas.length) h.txt(s, linhas.join("   ·   "), { x: M, y: 4.35, w: 5.6, h: 0.5, fontSize: 11, color: B.T.text2 });
  },
};

// Layouts que não levam rodapé/número (ficam limpos para dar peso à frase)
const LIMPOS = new Set(["capa", "frase", "tese", "cta-qr"]);

module.exports = { L, LIMPOS, cobrir };
