#!/usr/bin/env node
// Uso: node deck.js <pasta-do-projeto> [--curta]
// Lê <projeto>/slides.json, aplica o brand.json indicado em meta.brand e grava <projeto>/saida/<arquivo>.pptx.
// --curta tira os slides com "cortavel": true. As notas com negrito são aplicadas depois por notas.py.
const fs = require("fs");
const path = require("path");
const { carregarBrand, prepararLogo, novoDeck, helpers } = require("./tema");
const { L, LIMPOS } = require("./layouts");

(async () => {
  const dir = path.resolve(process.argv[2] || ".");
  const curta = process.argv.includes("--curta");
  const spec = JSON.parse(fs.readFileSync(path.join(dir, "slides.json"), "utf8"));
  const meta = spec.meta || {};
  if (!meta.brand) throw new Error("slides.json precisa de meta.brand (caminho do brand.json).");
  const B = await prepararLogo(carregarBrand(path.resolve(dir, meta.brand)));
  const pres = novoDeck(B, meta);
  const h = helpers(B);
  const ids = [];

  for (const [i, d] of spec.slides.entries()) {
    if (curta && d.cortavel) continue;
    const fn = L[d.layout];
    if (!fn) throw new Error(`Slide ${d.id || i + 1}: layout desconhecido "${d.layout}". Veja references/layouts.md.`);
    const s = pres.addSlide({ masterName: d.layout === "capa" ? "CAPA" : LIMPOS.has(d.layout) || d.limpo ? "LIMPO" : "CONTEUDO" });
    await fn(s, d, { B, h, dir });
    const id = d.id || `S${String(i + 1).padStart(2, "0")}`;
    s.addNotes(id); // provisório: notas.py grava a fala formatada
    ids.push(id);
  }

  const saida = path.join(dir, "saida");
  fs.mkdirSync(saida, { recursive: true });
  const base = (meta.arquivo || "apresentacao") + (curta ? "_curta" : "");
  const out = path.join(saida, base + ".pptx");
  await pres.writeFile({ fileName: out });
  fs.writeFileSync(out.replace(/\.pptx$/, ".ids.json"), JSON.stringify(ids));
  console.log(`ok ${out} (${ids.length} slides)`);
})().catch(e => { console.error("ERRO:", e.message); process.exit(1); });
