# Motor

Transforma `slides.json` + `brand.json` em .pptx com notas, versão curta, PDF, imagens para conferência e roteiro de falas.

**Requisitos:**
- Node 18+ e Python 3.10+, com `pip install python-pptx pymupdf pillow`;
- LibreOffice, para o PDF e as imagens.

**Na primeira vez:** rode `npm install` dentro desta pasta.

## Comandos (rode a partir desta pasta)
```bash
node deck.js <projeto>                                       # gera saida/<arquivo>.pptx
python notas.py <projeto> <projeto>/saida/<arquivo>.pptx     # grava as notas com negrito
node deck.js <projeto> --curta                               # versão curta (sem slides "cortavel")
python notas.py <projeto> <projeto>/saida/<arquivo>_curta.pptx --curta
python render.py <projeto>/saida/<arquivo>.pptx              # PDF + imagens + grades para olhar
python falas.py <projeto>                                    # ROTEIRO_FALAS.pdf/.docx + tempo estimado
python falas.py <projeto> --curta
node carrossel.js <projeto>                                  # carrossel 4:5 a partir de carrossel.json
python render.py <projeto>/saida/carrossel.pptx --px 1080    # PNG 1080x1350 por página (Instagram)
node documento.js <projeto>                                  # documento A4 (ebook, guia, kit) a partir de documento.json
python render.py <projeto>/saida/<arquivo>.pptx              # PDF para distribuir + imagens
```

## Teste rápido
```bash
node deck.js ../exemplos/catalogo-layouts && python render.py ../exemplos/catalogo-layouts/saida/catalogo_layouts.pptx
```
Deve gerar 18 slides, um por layout. Abra as grades em `catalogo_layouts_render/`.

## Arquivos
- `tema.js`: lê o brand.json e expõe as cores, o rodapé e os helpers de texto.
- `layouts.js`: catálogo de layouts (documentado em `../references/layouts.md`).
- `deck.js`, `carrossel.js`, `documento.js`: montagem (deck 16:9, carrossel 4:5, documento A4).
- `notas.py`, `falas.py`: notas e roteiro.
- `render.py`: conversão para PDF e imagens.
- `motion/`: projeto Remotion opcional para animações (ver o README de lá).
