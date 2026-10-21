// Cores vêm do brand.json copiado para esta pasta (motor/motion/brand.json). Nunca inline.
import { Easing } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import brand from "../brand.json";

const { fontFamily } = loadFont("normal", { weights: ["400", "500", "800"], subsets: ["latin", "latin-ext"] });
const c = (brand as { cores: Record<string, string> }).cores;

export const theme = {
  colors: {
    bg: c.bg, bgDeep: c.bg, surface: c.surface, surface2: c.surface2, border: c.border,
    accent: c.accent, secondary: c.secondary, text: c.text, text2: c.text2, muted: c.muted,
  },
  font: fontFamily,
  ease: {
    out: Easing.bezier(0.16, 1, 0.3, 1),
    inOut: Easing.bezier(0.83, 0, 0.17, 1),
    in: Easing.bezier(0.7, 0, 0.84, 0),
  },
  spring: {
    snappy: { damping: 14, stiffness: 160, mass: 0.6 },
    smooth: { damping: 20, stiffness: 90, mass: 1 },
  },
} as const;
