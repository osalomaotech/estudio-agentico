import React from "react";
import { Composition } from "remotion";
import { Contadores, Matriz, Tese } from "./scenes";

const base = { fps: 30, width: 1920, height: 1080 };
// defaultProps só servem de exemplo; o conteúdo real vem por --props no render.
export const Root: React.FC = () => (
  <>
    <Composition id="Tese" component={Tese} durationInFrames={240} {...base}
      defaultProps={{ linha1: "A frase-tese do material aparece palavra por palavra.", linha2: "E esta é a virada." }} />
    <Composition id="Contadores" component={Contadores} durationInFrames={180} {...base}
      defaultProps={{ rotulo: "Números", numeros: [{ valor: 37, sufixo: "%", legenda: "legenda do primeiro número" }, { valor: 2, sufixo: "x", legenda: "legenda do segundo" }], texto: "A conclusão que liga os dois números.", fonte: "Fonte, data" }} />
    <Composition id="Matriz" component={Matriz} durationInFrames={360} {...base}
      defaultProps={{ rotulo: "Matriz", titulo: "Eixo A x", destaque: "eixo B", texto: "Como ler a matriz.", eixo: "BAIXO  →  ALTO",
        quadrantes: [{ titulo: "Quadrante 1", legenda: "baixo · baixo" }, { titulo: "Quadrante 2", legenda: "baixo · alto" }, { titulo: "Quadrante 3", legenda: "alto · baixo" }, { titulo: "Quadrante 4", legenda: "alto · alto" }],
        casos: [{ texto: "Exemplo 1", quadrante: 0 }, { texto: "Exemplo 2", quadrante: 3 }] }} />
  </>
);
