import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme } from "./theme";

const C = theme.colors;
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Fundo da marca com malha sutil (o deck é #0E1B2E; o motion não pode destoar)
export const BgMesh: React.FC = () => {
  const f = useCurrentFrame();
  const d1 = Math.sin(f / 55) * 40, d2 = Math.cos(f / 70) * 30;
  return (
    <AbsoluteFill style={{ background: C.bg }}>
      <div style={{ position: "absolute", width: 1300, height: 1300, borderRadius: "50%", top: -600, left: -400 + d1,
        filter: "blur(60px)", background: `radial-gradient(circle, ${C.secondary}26, transparent 62%)` }} />
      <div style={{ position: "absolute", width: 1000, height: 1000, borderRadius: "50%", bottom: -500, right: -300 - d2,
        filter: "blur(80px)", background: `radial-gradient(circle, ${C.border}55, transparent 65%)` }} />
    </AbsoluteFill>
  );
};

export const Finish: React.FC = () => {
  const f = useCurrentFrame();
  const noise = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;
  return (
    <>
      <AbsoluteFill style={{ pointerEvents: "none", background: "linear-gradient(180deg, rgba(0,0,0,0.12), transparent 30%, transparent 70%, rgba(0,0,0,0.18))" }} />
      <AbsoluteFill style={{ pointerEvents: "none", backgroundImage: noise, backgroundSize: "220px",
        backgroundPosition: `${(f * 7) % 220}px ${(f * 13) % 220}px`, opacity: 0.06, mixBlendMode: "overlay" }} />
      <AbsoluteFill style={{ pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 58%, rgba(0,0,0,0.28) 100%)" }} />
    </>
  );
};

export const Label: React.FC<{ children: React.ReactNode; delay?: number; style?: React.CSSProperties }> = ({ children, delay = 0, style }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  const p = spring({ frame: f - delay, fps, config: theme.spring.smooth });
  return <div style={{ fontFamily: theme.font, fontWeight: 800, fontSize: 22, letterSpacing: 7, color: C.secondary,
    textTransform: "uppercase", opacity: p, transform: `translateY(${interpolate(p, [0, 1], [16, 0])}px)`, ...style }}>{children}</div>;
};

export const Words: React.FC<{ text: string; delay?: number; per?: number; color?: string; size?: number }> = ({ text, delay = 0, per = 3, color = C.text, size = 92 }) => {
  const f = useCurrentFrame(); const { fps } = useVideoConfig();
  return (
    <div style={{ display: "flex", flexWrap: "wrap", columnGap: size * 0.26, fontFamily: theme.font, fontWeight: 800, fontSize: size, lineHeight: 1.12, color }}>
      {text.split(" ").map((w, i) => {
        const p = spring({ frame: f - delay - i * per, fps, config: theme.spring.snappy });
        return <span key={i} style={{ display: "inline-block", opacity: p,
          transform: `translateY(${interpolate(p, [0, 1], [36, 0])}px) scale(${interpolate(p, [0, 1], [0.96, 1])})` }}>{w}</span>;
      })}
    </div>
  );
};

// Saída rápida aplicada à cena inteira
export const Exit: React.FC<{ children: React.ReactNode; at: number }> = ({ children, at }) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [at, at + 10], [1, 0], { ...clamp, easing: theme.ease.in });
  const y = interpolate(f, [at, at + 10], [0, -30], { ...clamp, easing: theme.ease.in });
  return <AbsoluteFill style={{ opacity: o, transform: `translateY(${y}px)` }}>{children}</AbsoluteFill>;
};
export { clamp };
