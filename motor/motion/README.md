# Motion (opcional)

Três animações em Remotion, com as cores do `brand.json`: `Tese`, `Contadores` e `Matriz`. Cada uma termina parada no mesmo quadro do slide estático correspondente.

```bash
cp <caminho>/brand.json ./brand.json     # cores do branding do material
npm install                               # primeira vez
npx remotion render src/index.ts Tese saida/tese.mp4 --codec h264 --crf 17 --props='{"linha1":"…","linha2":"…"}'
```

- **Conferência:** extraia quadros do início, do meio e do fim com ffmpeg e olhe antes de entregar.
- **LibreOffice Impress:** não embuta os vídeos no .pptx, porque trava. Entregue o MP4 separado e mantenha o slide estático.
- **Licença do Remotion:** grátis para pessoas físicas e empresas pequenas. Confira os termos atuais em remotion.dev/license.
