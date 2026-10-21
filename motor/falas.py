"""Gera o roteiro de falas (PDF e .docx) a partir das notas do slides.json, slide a slide.

Uso: python falas.py <projeto> [--curta]
Saída: <projeto>/saida/ROTEIRO_FALAS[_CURTA].pdf e .docx (via LibreOffice).
Tempo estimado: 140 palavras por minuto + campo "segundosSemFala" de cada slide.
"""
import html
import json
import pathlib
import re
import sys

from notas import CORTA, paragrafos
from render import soffice


def fmt(t: str) -> str:
    return re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", html.escape(t)).replace("\n", "<br>")


def main() -> None:
    projeto = pathlib.Path(sys.argv[1])
    curta = "--curta" in sys.argv
    spec = json.loads((projeto / "slides.json").read_text(encoding="utf-8"))
    meta = spec.get("meta", {})
    blocos, palavras, silencio = [], 0, 0
    for i, s in enumerate(spec["slides"]):
        if curta and s.get("cortavel"):
            continue
        sid = s.get("id", f"S{i + 1:02d}")
        nome = s.get("nome") or s.get("titulo") or s.get("layout")
        blocos.append(f"<p class='slide'>▶ {sid} · {html.escape(re.sub(r'[*]', '', str(nome)))}</p>")
        paras = paragrafos(s.get("notas", ""), curta) or ["(sem fala neste slide)"]
        for p in paras:
            palavras += len(re.sub(r"[*()]", "", p).split())
            cls = "cut" if p.startswith(CORTA) else ("pausa" if p.strip() == "(pausa)" else "")
            blocos.append(f"<p class='fala {cls}'>{fmt(p)}</p>")
        silencio += s.get("segundosSemFala", 0)
    minutos = palavras / 140 + silencio / 60
    tempo = f"{int(minutos)}:{int(round((minutos % 1) * 60)):02d}"
    titulo = meta.get("titulo", "Apresentação")
    doc = f"""<html><head><meta charset="utf-8"><style>
body{{font-family:Arial;color:#111}} h1{{font-size:18pt}} .meta{{font-size:9pt;color:#777}}
.slide{{font-size:10pt;font-weight:bold;color:#2F6FA3;margin:18pt 0 6pt;border-top:1px solid #ddd;padding-top:6pt}}
.fala{{font-size:14pt;line-height:1.5;margin:0 0 10pt}} .cut{{color:#888}} .pausa{{font-size:10pt;font-style:italic}}
</style></head><body><h1>{html.escape(titulo)} · Falas{" (versão curta)" if curta else ""}</h1>
<p class='meta'>Tempo estimado: {tempo} · {palavras} palavras a 140/min · ▶ = slide no ar · negrito = ênfase · cinza = sai na versão curta</p>
{''.join(blocos)}</body></html>"""
    saida = projeto / "saida"
    saida.mkdir(exist_ok=True)
    h = saida / ("ROTEIRO_FALAS_CURTA.html" if curta else "ROTEIRO_FALAS.html")
    h.write_text(doc, encoding="utf-8")
    soffice(h, "pdf:writer_pdf_Export", saida)
    soffice(h, "docx:MS Word 2007 XML", saida)
    print(f"falas: {h.with_suffix('.pdf')} · tempo estimado {tempo}")


if __name__ == "__main__":
    main()
