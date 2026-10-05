// The real Sketchware IA screen recording as composition material.
//
// Source: assets/footage/screenrecord.vp9.webm — the user's recording
// (864×1920, 30 fps VP9 proxy of production/footage/sketchware-ia-screenrecord.mp4).
// Every crop is given in SOURCE pixels (864×1920, origin top-left), the same
// coordinates as production/footage/footage-log.json.
//
// The recording has a Google TEST AD at y 1685–1819 on tab screens and the
// Android navigation bar below it, so the phone shows the screen cropped to
// y < 1684 ("SCREEN_H"): a 864×1684 screen.

import type { JSX } from "solid-js";
import { Box, E, G, R, type Anim, type Key } from "./core";

export const SRC = "assets/footage/screenrecord.vp9.webm";
export const SRC_W = 864;
export const SRC_H = 1920;
export const SCREEN_H = 1684;
export const BEZEL = 22;
/** pivot guard: larger than any footage overhang (1920 px × the largest zoom) */
const PAD = 12000;

export type Crop = { x: number; y: number; w: number; h: number };

/**
 * One footage clip, cropped to `crop` (source px) and drawn at scale `k`
 * (output px per source px) with its crop's top-left at (x, y) of the parent.
 * The clip plays source [sourceIn, sourceIn + (to - from) * speed] over the
 * timeline window [from, to].
 */
export function Footage(p: {
  from: number; to: number; sourceIn: number; speed?: number;
  crop: Crop; k: number; x?: number; y?: number; r?: number;
}) {
  const speed = p.speed ?? 1;
  const sourceOut = p.sourceIn + (p.to - p.from) * speed;
  const k = p.k;
  return (
    <G from={p.from} to={p.to} x={p.x ?? 0} y={p.y ?? 0}>
      <video
        src={SRC}
        x={-p.crop.x * k}
        y={-p.crop.y * k}
        width={SRC_W * k}
        height={SRC_H * k}
        start={0}
        sourceIn={p.sourceIn}
        sourceOut={sourceOut}
        playbackRate={speed}
        objectFit="fill"
        muted
      />
      <rect clipPath x={0} y={0} width={p.crop.w * k} height={p.crop.h * k} cornerRadius={p.r ?? 0} />
    </G>
  );
}

/**
 * A floating "UI window": a rounded card showing a footage crop, centred at
 * (cx, cy), `w` px wide (height follows the crop's aspect). Animatable via
 * `anim` (cx, cy, scale, rotation, opacity, offsetX/Y); scales about its centre.
 */
export function Window(p: {
  from: number; to: number; sourceIn: number; speed?: number; crop: Crop;
  cx: number; cy: number; w: number; r?: number; anim?: Anim; shadow?: boolean; blur?: number | Key[];
  children?: JSX.Element; border?: boolean;
}) {
  const k = p.w / p.crop.w;
  const h = p.crop.h * k;
  const r = p.r ?? 28;
  return (
    <Box cx={p.cx} cy={p.cy} w={p.w} h={h} pad={PAD} from={p.from} to={p.to} anim={p.anim} blur={p.blur}>
      {p.shadow !== false ? <R x={0} y={0} w={p.w} h={h} r={r} fill="#F8F9FB" shadow={{ blur: 70, y: 34, opacity: 0.5 }} /> : null}
      <Footage from={p.from} to={p.to} sourceIn={p.sourceIn} speed={p.speed} crop={p.crop} k={k} r={r} />
      {p.children}
      {p.border !== false ? <R x={0} y={0} w={p.w} h={h} r={r} fill="none" stroke={{ color: "#FFFFFF", width: 3, opacity: 0.22 }} /> : null}
    </Box>
  );
}

/**
 * A phone whose screen is 864×SCREEN_H source pixels at natural size (k = 1),
 * centred at (cx, cy) of its parent. `children` are laid out in screen px
 * (0..864, 0..SCREEN_H) and clipped to the screen.
 */
export function RealPhone(p: { cx: number; cy: number; from?: number; to?: number; anim?: Anim; opacity?: number; blur?: number | Key[]; children?: JSX.Element }) {
  const W = SRC_W + BEZEL * 2;
  const H = SCREEN_H + BEZEL * 2;
  return (
    <Box cx={p.cx} cy={p.cy} w={W} h={H} pad={PAD} from={p.from} to={p.to} anim={p.anim} opacity={p.opacity} blur={p.blur}>
      <R x={0} y={0} w={W} h={H} r={118} fill="#0D0C14" stroke={{ color: "#3B3950", width: 4 }} shadow={{ color: "#000000", blur: 90, y: 50, opacity: 0.55 }} />
      <R x={6} y={6} w={W - 12} h={H - 12} r={112} fill="#16151F" />
      <G x={BEZEL} y={BEZEL}>
        <R x={0} y={0} w={SRC_W} h={SCREEN_H} r={96} fill="#F8F9FB" />
        {p.children}
        <rect clipPath x={0} y={0} width={SRC_W} height={SCREEN_H} cornerRadius={96} />
      </G>
    </Box>
  );
}

/** Footage filling the RealPhone screen (no crop beyond the ad line). */
export function Screen(p: { from: number; to: number; sourceIn: number; speed?: number }) {
  return <Footage from={p.from} to={p.to} sourceIn={p.sourceIn} speed={p.speed} crop={{ x: 0, y: 0, w: SRC_W, h: SCREEN_H }} k={1} />;
}

/** A still image filling the RealPhone screen (e.g. a cleaned screenshot). */
export function ScreenStill(p: { from: number; to: number; src: string; anim?: Anim }) {
  return (
    <G from={p.from} to={p.to} anim={p.anim}>
      <image src={p.src} x={0} y={0} width={SRC_W} height={SCREEN_H} objectFit="fill" />
    </G>
  );
}

/** Ripple ring to emphasise a real tap in the footage (screen/window px). */
export function TapPulse(p: { x: number; y: number; t: number; size?: number; color?: string }) {
  const s = p.size ?? 120;
  return (
    <Box cx={p.x} cy={p.y} w={s} h={s} from={p.t - 0.05} to={p.t + 0.6}
      anim={{ scale: [[p.t - 0.05, 0.4, E.out], [p.t + 0.55, 1.6]], opacity: [[p.t - 0.05, 0, E.out], [p.t + 0.05, 0.9], [p.t + 0.55, 0]] }}>
      <R x={0} y={0} w={s} h={s} r={s / 2} fill="none" stroke={{ color: p.color ?? "#6B5CE7", width: s * 0.06 }} />
    </Box>
  );
}
