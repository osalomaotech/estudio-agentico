// Tema: lê o brand.json do perfil/branding e expõe tokens, helpers de texto e o deck base.
// Tudo o que é visual vem do brand.json; nenhum valor de marca fica fixo no código.
const fs = require("fs");
const path = require("path");
const pptxgen = require("pptxgenjs");

const W = 10, H = 5.625, M = 0.6; // 16:9

function carregarBrand(brandPath) {
  // "herda": caminho de outro brand.json. Útil para ajuste por projeto (ex.: contato provisório)
  // sem mexer no branding salvo. Caminhos de ativos ficam absolutos em cada nível antes da mescla.
  const ler = p => {
    const j = JSON.parse(fs.readFileSync(p, "utf8")), d = path.dirname(p), abs = r => (r ? path.resolve(d, r) : r);
    if (j.logo) j.logo = abs(j.logo);
    if (j.fotos) for (const k of Object.keys(j.fotos)) j.fotos[k] = abs(j.fotos[k]);
    if (!j.herda) return j;
    const pai = ler(path.resolve(d, j.herda));
    return { ...pai, ...j, cores: { ...pai.cores, ...j.cores }, fotos: { ...pai.fotos, ...j.fotos }, contato: { ...pai.contato, ...j.contato } };
  };
  const b = ler(brandPath);
  const c = b.cores || {};
  const hex = v => String(v || "").replace("#", "").toUpperCase();
  // Só bg, text e accent são obrigatórios; o resto é derivado deles se não vier no brand.json.
  const mix = (a, b, t) => { const p = x => [0, 2, 4].map(i => parseInt(x.slice(i, i + 2), 16));
    const [A, Bb] = [p(a), p(b)]; return A.map((v, i) => Math.round(v + (Bb[i] - v) * t).toString(16).padStart(2, "0")).join("").toUpperCase(); };
  const bg = hex(c.bg || "#FFFFFF"), tx = hex(c.text || "#1B2430"), ac = hex(c.accent || "#0F8B7D");
  const T = {
    bg, text: tx, accent: ac,
    surface: hex(c.surface) || mix(bg, tx, 0.05), surface2: hex(c.surface2) || mix(bg, ac, 0.10),
    border: hex(c.border) || mix(bg, tx, 0.16), accentSoft: hex(c.accentSoft) || mix(ac, "FFFFFF", 0.2),
    secondary: hex(c.secondary) || mix(tx, bg, 0.3), text2: hex(c.text2) || mix(tx, bg, 0.25), muted: hex(c.muted) || mix(tx, bg, 0.42),
  };
  return {
    nome: b.nome || "Marca",
    T,
    fonte: b.fonte || "Arial", // fonte segura: existe em qualquer PowerPoint/Impress
    rodape: b.rodape || "",
    rotuloCaixaAlta: b.rotuloCaixaAlta !== false,
    fotos: { retrato: b.fotos?.retrato || null, redonda: b.fotos?.redonda || null, fundo: b.fotos?.fundo || null },
    logo: b.logo || null,
    logoEmTodos: !!b.logoEmTodos, // true: o logo também aparece na capa, nas frases e no fechamento
    contato: b.contato || null, // { site, whatsapp, linkedin, email } — só aparece onde o layout pedir
  };
}

// O logo é encaixado (contain) numa imagem com a proporção exata da caixa antes de entrar no .pptx,
// porque o Impress ignora o "sizing" e achata a imagem.
const LOGO = { w: 0.9, h: 0.3 };
async function prepararLogo(B) {
  if (!B.logo) return B;
  const sharp = require("sharp");
  const buf = await sharp(B.logo).resize(Math.round(LOGO.w * 300), Math.round(LOGO.h * 300), { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  B.logoData = "image/png;base64," + buf.toString("base64");
  return B;
}

// "Texto com **destaque**" -> runs com a cor de destaque (a gramática visual: um destaque por slide)
function runs(texto, B, base) {
  return String(texto).split("**").map((t, i) => ({ text: t, options: { color: i % 2 ? B.T.accent : (base || B.T.text) } })).filter(r => r.text);
}

function novoDeck(B, meta = {}) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.author = meta.autor || "";
  pres.title = meta.titulo || "";
  pres.theme = { headFontFace: B.fonte, bodyFontFace: B.fonte };
  const objetos = [];
  if (B.rodape) objetos.push({ text: { text: B.rodape, options: { x: M, y: H - 0.42, w: 6, h: 0.25, fontFace: B.fonte, fontSize: 7, color: B.T.muted, charSpacing: 2, margin: 0 } } });
  const logo = B.logoData ? [{ image: { data: B.logoData, x: W - M - LOGO.w, y: 0.32, w: LOGO.w, h: LOGO.h } }] : [];
  pres.defineSlideMaster({ title: "CONTEUDO", background: { color: B.T.bg }, objects: [...objetos, ...logo],
    slideNumber: { x: W - M - 0.5, y: H - 0.42, w: 0.5, h: 0.25, fontFace: B.fonte, fontSize: 7, color: B.T.muted, align: "right" } });
  pres.defineSlideMaster({ title: "LIMPO", background: { color: B.T.bg }, objects: B.logoEmTodos ? logo : [] });
  pres.defineSlideMaster({ title: "CAPA", background: { color: B.T.bg }, objects: [] }); // a capa desenha o próprio logo
  return pres;
}

function helpers(B) {
  const { T } = B, F = B.fonte;
  const txt = (s, text, o) => s.addText(text, { fontFace: F, margin: 0, isTextBox: true, valign: "top", color: T.text2, fontSize: 14, ...o });
  return {
    txt,
    rotulo: (s, t, o = {}) => txt(s, B.rotuloCaixaAlta ? String(t).toUpperCase() : t, { x: o.x ?? M, y: o.y ?? 0.45, w: o.w ?? 6, h: 0.25, fontSize: 8, bold: true, color: T.secondary, charSpacing: 3 }),
    titulo: (s, t, o = {}) => txt(s, runs(t, B, o.cor), { x: o.x ?? M, y: o.y ?? 0.8, w: o.w ?? W - 2 * M, h: o.h ?? 1.3, fontSize: o.size ?? 30, bold: true,
      valign: o.valign ?? "top", align: o.align ?? "left", lineSpacingMultiple: 1.05 }),
    corpo: (s, t, o = {}) => txt(s, runs(t, B, o.cor ?? T.text2), { x: o.x ?? M, y: o.y ?? 2.2, w: o.w ?? 6, h: o.h ?? 1, fontSize: o.size ?? 14 }),
    fonteRodape: (s, t) => t && txt(s, "FONTE  " + t, { x: M, y: H - 0.72, w: W - 2 * M, h: 0.22, fontSize: 7, color: T.muted }),
    card: (s, x, y, w, h, hi) => s.addShape("rect", { x, y, w, h, fill: { color: hi ? T.surface2 : T.surface }, line: { color: hi ? T.accent : T.border, width: 0.75 } }),
  };
}

module.exports = { W, H, M, LOGO, carregarBrand, prepararLogo, novoDeck, helpers, runs };
