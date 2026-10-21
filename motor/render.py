"""Converte o .pptx em PDF (plano B) e em imagens para a conferência visual.

Uso: python render.py <arquivo.pptx> [--dpi 60] [--px 1080]
Saída: <arquivo>.pdf, pasta <arquivo>_render/ com sNN.png e uma grade grade_N.png (12 slides por grade).
Abra as grades e olhe cada slide: texto estourando, sobreposição, foto distorcida, contraste.
"""
import pathlib
import shutil
import subprocess
import sys

CANDIDATOS = [
    shutil.which("soffice"), shutil.which("libreoffice"),
    r"C:\Program Files\LibreOffice\program\soffice.exe",
    "/Applications/LibreOffice.app/Contents/MacOS/soffice", "/usr/bin/soffice",
]


def soffice(arquivo: pathlib.Path, formato: str, outdir: pathlib.Path) -> None:
    exe = next((c for c in CANDIDATOS if c and pathlib.Path(c).exists()), None)
    if not exe:
        raise SystemExit("LibreOffice não encontrado. Instale-o para gerar PDF e imagens.")
    subprocess.run([exe, "--headless", "--convert-to", formato, "--outdir", str(outdir), str(arquivo)],
                   timeout=240, capture_output=True, check=False)


def main() -> None:
    import pymupdf
    from PIL import Image

    pptx = pathlib.Path(sys.argv[1]).resolve()
    dpi = int(sys.argv[sys.argv.index("--dpi") + 1]) if "--dpi" in sys.argv else 60
    px = int(sys.argv[sys.argv.index("--px") + 1]) if "--px" in sys.argv else None  # ex.: --px 1080 (Instagram)
    soffice(pptx, "pdf", pptx.parent)
    pdf = pptx.with_suffix(".pdf")
    pasta = pptx.parent / (pptx.stem + "_render")
    pasta.mkdir(exist_ok=True)
    doc = pymupdf.open(str(pdf))
    imgs = []
    for i, pg in enumerate(doc):
        f = pasta / f"s{i + 1:02d}.png"
        if px:  # largura exata; altura pela proporção da página, sem a linha extra do arredondamento
            alvo = (px, round(px * pg.rect.height / pg.rect.width))
            pg.get_pixmap(matrix=pymupdf.Matrix(px / pg.rect.width * 1.02, px / pg.rect.width * 1.02)).save(str(f))
            Image.open(f).resize(alvo, Image.LANCZOS).save(f)
        else:
            pg.get_pixmap(dpi=dpi).save(str(f))
        imgs.append(Image.open(f))
    w, h = imgs[0].size
    for k in range(0, len(imgs), 12):
        lote = imgs[k:k + 12]
        g = Image.new("RGB", (w * 3, h * ((len(lote) + 2) // 3)), "white")
        for j, im in enumerate(lote):
            g.paste(im, ((j % 3) * w, (j // 3) * h))
        g.save(pasta / f"grade_{k // 12 + 1}.png")
    print(f"pdf: {pdf}\nimagens: {pasta} ({len(imgs)} páginas)")


if __name__ == "__main__":
    main()
