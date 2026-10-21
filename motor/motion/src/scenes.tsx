import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";
import { BgMesh, Finish, Label, Words, clamp } from "./layers";

const C = theme.colors;
// Cada cena termina parada no quadro final, igual ao slide estático correspondente.
// O conteúdo vem por props (--props='{"..."}' no render), nunca fixo no código.

export type TeseProps = { linha1: string; linha2: string };
export const Tese: React.FC<TeseProps> = ({ linha1, linha2 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <BgMesh />
      <AbsoluteFill style={{ padding: "0 230px 0 115px", justifyContent: "center", transform: `scale(${1 + Math.sin(f / 26) * 0.004})` }}>
        <Words text={linha1} delay={Math.round(0.5 * fps)} per={4} size={92} />
        <div style={{ height: 24 }} />
        <Words text={linha2} delay={Math.round((0.7 + linha1.split(" ").length * 0.13) * fps)} per={5} size={92} color={C.accent} />
      </AbsoluteFill>
      <Finish />
    </AbsoluteFill>
  );
};

const Fade: React.FC<{ delay: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ delay, children, style }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: f - delay, fps, config: theme.spring.smooth });
  return <div style={{ opacity: p, transform: `translateY(${interpolate(p, [0, 1], [24, 0])}px)`, ...style }}>{children}</div>;
};

export type ContadoresProps = { rotulo: string; numeros: { valor: number; sufixo: string; legenda: string }[]; texto?: string; fonte?: string };
export const Contadores: React.FC<ContadoresProps> = ({ rotulo, numeros, texto, fonte }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return (
    <AbsoluteFill>
      <BgMesh />
      <AbsoluteFill style={{ padding: "86px 115px" }}>
        <Label>{rotulo}</Label>
        <div style={{ display: "flex", gap: 120, marginTop: 110 }}>
          {numeros.slice(0, 2).map((n, i) => {
            const d = Math.round((0.4 + i) * fps);
            const p = spring({ frame: f - d, fps, config: { damping: 30, stiffness: 60 } });
            const e = spring({ frame: f - d, fps, config: theme.spring.smooth });
            return (
              <div key={i}>
                <div style={{ fontFamily: theme.font, fontWeight: 800, fontSize: 210, lineHeight: 1, color: i === 0 ? C.accent : C.text, fontVariantNumeric: "tabular-nums",
                  opacity: e, transform: `translateY(${interpolate(e, [0, 1], [40, 0])}px)` }}>{Math.round(interpolate(p, [0, 1], [0, n.valor]))}{n.sufixo}</div>
                <Fade delay={d + Math.round(0.8 * fps)} style={{ fontFamily: theme.font, fontSize: 34, color: C.text2, marginTop: 18, maxWidth: 720 }}>{n.legenda}</Fade>
              </div>
            );
          })}
        </div>
        {texto && <Fade delay={Math.round(3.4 * fps)} style={{ fontFamily: theme.font, fontWeight: 500, fontSize: 40, color: C.text, marginTop: 90 }}>{texto}</Fade>}
        {fonte && <Fade delay={Math.round(3.9 * fps)} style={{ position: "absolute", left: 115, bottom: 92, fontFamily: theme.font, fontSize: 18, color: C.muted }}>FONTE  {fonte}</Fade>}
      </AbsoluteFill>
      <Finish />
    </AbsoluteFill>
  );
};

export type MatrizProps = { rotulo: string; titulo: string; destaque: string; texto: string; eixo?: string;
  quadrantes: { titulo: string; legenda: string }[]; casos: { texto: string; quadrante: number }[] };
const GX = 941, GY = 106, CW = 413, CH = 365, GAP = 29;
const cell = (i: number) => ({ x: GX + (i % 2) * (CW + GAP), y: GY + Math.floor(i / 2) * (CH + GAP) });
export const Matriz: React.FC<MatrizProps> = ({ rotulo, titulo, destaque, texto, eixo, quadrantes, casos }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const chega = (k: number) => Math.round((3.5 + k * 2.4) * fps);
  return (
    <AbsoluteFill>
      <BgMesh />
      <AbsoluteFill style={{ padding: "86px 115px" }}>
        <Label>{rotulo}</Label>
        <div style={{ marginTop: 26, width: 700 }}>
          <Words text={titulo} delay={8} size={56} />
          <Words text={destaque} delay={14} size={56} color={C.accent} />
        </div>
        <Fade delay={Math.round(1.2 * fps)} style={{ fontFamily: theme.font, fontSize: 30, lineHeight: 1.35, color: C.text2, width: 700, marginTop: 40 }}>{texto}</Fade>
      </AbsoluteFill>
      {quadrantes.slice(0, 4).map((q, i) => {
        const p = spring({ frame: f - 10 - i * 5, fps, config: theme.spring.smooth });
        const { x, y } = cell(i), hi = i === 3, lit = casos.some((c, k) => c.quadrante === i && f >= chega(k));
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, width: CW, height: CH, background: hi || lit ? C.surface2 : C.surface,
            border: `2px solid ${hi ? C.accent : lit ? C.secondary : C.border}`, opacity: p, transform: `translateY(${interpolate(p, [0, 1], [30, 0])}px)`,
            padding: 28, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
            <div style={{ fontFamily: theme.font, fontWeight: 800, fontSize: 30, color: hi ? C.accent : C.text }}>{q.titulo}</div>
            <div style={{ fontFamily: theme.font, fontSize: 18, color: C.muted, marginTop: 10 }}>{q.legenda}</div>
          </div>
        );
      })}
      {casos.map((c, k) => {
        const ini = chega(k) - Math.round(1.1 * fps);
        const pin = spring({ frame: f - ini, fps, config: theme.spring.snappy });
        const mv = interpolate(f, [ini + 12, chega(k)], [0, 1], { ...clamp, easing: theme.ease.inOut });
        const { x, y } = cell(c.quadrante);
        return (
          <div key={k} style={{ position: "absolute", left: interpolate(mv, [0, 1], [115, x + 28]), top: interpolate(mv, [0, 1], [760, y + 28]), opacity: pin,
            fontFamily: theme.font, fontWeight: 500, fontSize: interpolate(mv, [0, 1], [30, 20]), color: "#FFFFFF", background: C.secondary, padding: "10px 18px", borderRadius: 6,
            maxWidth: interpolate(mv, [0, 1], [760, CW - 56]) }}>{c.texto}</div>
        );
      })}
      {eixo && <Fade delay={Math.round(1.6 * fps)} style={{ position: "absolute", left: GX, top: GY + 2 * CH + GAP + 30, fontFamily: theme.font, fontSize: 16, letterSpacing: 5, color: C.muted }}>{eixo}</Fade>}
      <Finish />
    </AbsoluteFill>
  );
};
