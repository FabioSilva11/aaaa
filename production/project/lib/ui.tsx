// Building blocks of the Sketchware IA interface as it appears in the video.
//
// Colors are the app's own Material 3 scheme (res/values/m3_colors.xml:
// seed #6B5CE7 "Bright" light scheme) and its block palette
// (editor/logic/PaletteSelector.java, a/a/a/kq.java). Screens are laid out in
// dp at U px per dp, the way the app's XML layouts are.

import type { JSX } from "solid-js";
import { Box, E, G, R, T, tw, type Anim, type Key } from "./core";

export const U = 2.4;
export const d = (n: number) => n * U;

/** Phone screen in px (360×760 dp). */
export const SW = d(360);
export const SH = d(760);
export const BEZEL = 22;

export const C = {
  primary: "#6B5CE7",
  primaryDark: "#4F41C9",
  primaryContainer: "#EDE9FE",
  onPrimaryContainer: "#1C1C1E",
  surface: "#F8F9FA",
  container: "#FFFFFF",
  high: "#F2F2F7",
  highest: "#E5E5EA",
  onSurface: "#1C1C1E",
  variant: "#8E8E93",
  outline: "#E5E5EA",
  nativeBg: "#EAF7ED",
  nativeText: "#17613A",
  // night background of the film
  night: "#0A0918",
  night2: "#141033",
  lilac: "#B9AEFF",
  blue: "#4C7DFF",
  violet: "#8B6CFF",
};

/** Block colors by category, as the app assigns them. */
export const BLOCK = {
  hat: "#C88330",
  variable: "#EE7D16",
  list: "#CC5B22",
  control: "#E1A92A",
  operator: "#5CB722",
  math: "#23B9A9",
  file: "#A1887F",
  view: "#4A6CD4",
  component: "#2CA5E2",
  strings: "#7C83DB",
  moreblock: "#8A55D7",
};

// ---------------------------------------------------------------------------
// device

/**
 * The phone the app runs on, centred at (cx, cy) in its parent, at its
 * natural size (screen 864×1824 px). `children` are laid out in screen px.
 */
export function Phone(p: { cx: number; cy: number; from?: number; to?: number; anim?: Anim; opacity?: number; children?: JSX.Element; blur?: number | Key[] }) {
  const W = SW + BEZEL * 2;
  const H = SH + BEZEL * 2;
  return (
    <Box cx={p.cx} cy={p.cy} w={W} h={H} from={p.from} to={p.to} anim={p.anim} opacity={p.opacity} blur={p.blur}>
      <R x={0} y={0} w={W} h={H} r={128} fill="#0D0C14" stroke={{ color: "#3B3950", width: 4 }} shadow={{ color: "#000000", blur: 90, y: 50, opacity: 0.55 }} />
      <R x={6} y={6} w={W - 12} h={H - 12} r={122} fill="#16151F" />
      <G x={BEZEL} y={BEZEL}>
        <R x={0} y={0} w={SW} h={SH} r={104} fill={C.surface} />
        {p.children}
        <R x={SW / 2 - 15} y={20} w={30} h={30} r={15} fill="#07070A" />
        <rect clipPath x={0} y={0} width={SW} height={SH} cornerRadius={104} />
      </G>
    </Box>
  );
}

/** Android status bar: time on the left, signal/battery on the right. */
export function StatusBar(p: { dark?: boolean; bg?: string; from?: number; to?: number }) {
  const ink = p.dark ? "#FFFFFF" : C.onSurface;
  return (
    <G from={p.from} to={p.to}>
      {p.bg ? <R x={0} y={0} w={SW} h={d(30)} fill={p.bg} /> : null}
      <T x={d(26)} y={d(8)} size={d(13)} weight={600} color={ink}>9:41</T>
      {[0, 1, 2, 3].map((i) => (
        <R x={d(296) + i * d(4.5)} y={d(19) - d(3 + i * 2)} w={d(3)} h={d(3 + i * 2)} r={d(1)} fill={ink} />
      ))}
      <R x={d(318)} y={d(10)} w={d(20)} h={d(10)} r={d(3)} fill="none" stroke={{ color: ink, width: d(1.2) }} opacity={0.9} />
      <R x={d(320)} y={d(12)} w={d(14)} h={d(6)} r={d(1.5)} fill={ink} />
    </G>
  );
}

// ---------------------------------------------------------------------------
// interaction

/**
 * A finger-touch indicator: glides in, presses at each tap time, glides on.
 * `path` is [t, x, y] waypoints (absolute time, parent px); `taps` the press
 * times. Size in parent px.
 */
export function Touch(p: { path: [number, number, number][]; taps: number[]; size?: number; from: number; to: number }) {
  const s = p.size ?? 70;
  const x: Key[] = p.path.map(([t, px], i) => [t, px - s / 2, i ? E.inOut : E.inOut]);
  const y: Key[] = p.path.map(([t, , py]) => [t, py - s / 2, E.inOut]);
  const scale: Key[] = [[p.from, 1]];
  for (const t of p.taps) scale.push([t - 0.08, 1, E.out], [t, 0.78, E.out], [t + 0.22, 1]);
  const opacity: Key[] = [[p.from, 0, E.out], [p.from + 0.25, 1], [p.to - 0.25, 1, E.in], [p.to, 0]];
  return (
    <>
      {p.taps.map((t) => (
        <Box cx={0} cy={0} w={s} h={s} from={t} to={t + 0.6}
          anim={{
            cx: [[t, pointAt(p.path, t)[0]]], cy: [[t, pointAt(p.path, t)[1]]],
            scale: [[t, 0.6, E.out], [t + 0.6, 2.6]], opacity: [[t, 0.55, E.out], [t + 0.6, 0]],
          }}>
          <R x={0} y={0} w={s} h={s} r={s / 2} fill="#FFFFFF" />
        </Box>
      ))}
      <Box cx={0} cy={0} w={s} h={s} from={p.from} to={p.to}
        anim={{ cx: x.map(([t, v, e]) => [t, (v as number) + s / 2, e ?? E.inOut]), cy: y.map(([t, v, e]) => [t, (v as number) + s / 2, e ?? E.inOut]), scale, opacity }}>
        <R x={0} y={0} w={s} h={s} r={s / 2} fill="#FFFFFF" opacity={0.42} shadow={{ blur: 16, y: 4, opacity: 0.35 }} />
        <R x={s * 0.08} y={s * 0.08} w={s * 0.84} h={s * 0.84} r={s * 0.42} fill="none" stroke={{ color: C.primary, width: s * 0.06 }} />
      </Box>
    </>
  );
}

function pointAt(path: [number, number, number][], t: number): [number, number] {
  let best = path[0]!;
  for (const pt of path) if (pt[0] <= t + 1e-6) best = pt;
  return [best[1], best[2]];
}

/**
 * Text typed character by character from `t0` at `cps` chars per second,
 * with a blinking caret. Returns the time typing ends via `onEnd` math:
 * t0 + text.length / cps.
 */
export function Typed(p: {
  text: string; t0: number; cps?: number; to: number; x: number; y: number; size: number;
  weight?: number; color?: string; caret?: string; caretFrom?: number; caretTo?: number; family?: string;
}) {
  const cps = p.cps ?? 12;
  const chars = [...p.text];
  const caretFrom = p.caretFrom ?? p.t0 - 0.3;
  const caretTo = p.caretTo ?? p.t0 + chars.length / cps + 0.6;
  const blink: Key[] = [];
  for (let t = caretFrom; t < caretTo; t += 0.5) blink.push([t, 1, E.hold], [t + 0.3, 0, E.hold]);
  return (
    <>
      {chars.map((_, i) => {
        const from = p.t0 + i / cps;
        const to = i === chars.length - 1 ? p.to : p.t0 + (i + 1) / cps;
        return <T x={p.x} y={p.y} size={p.size} weight={p.weight ?? 400} color={p.color ?? C.onSurface} family={p.family} from={from} to={to}>{chars.slice(0, i + 1).join("")}</T>;
      })}
      {p.caret ? (
        <CaretBar text={p.text} p={p} cps={cps} from={caretFrom} to={caretTo} blink={blink} />
      ) : null}
    </>
  );
}

function CaretBar(props: { text: string; p: { t0: number; x: number; y: number; size: number; weight?: number; caret?: string; family?: string }; cps: number; from: number; to: number; blink: Key[] }) {
  const { p } = props;
  const chars = [...props.text];
  const x: Key[] = [[props.from, p.x, E.hold]];
  chars.forEach((_, i) => x.push([p.t0 + i / props.cps, p.x + tw(chars.slice(0, i + 1).join(""), p.size, p.weight ?? 400, p.family ?? "Inter") + 2, E.hold]));
  return <R x={p.x} y={p.y - p.size * 0.05} w={Math.max(2, p.size * 0.07)} h={p.size * 1.22} fill={p.caret!} from={props.from} to={props.to} anim={{ x, opacity: props.blink }} />;
}

/** A Material ripple expanding from (x, y) at time t inside a clipped parent. */
export function Ripple(p: { x: number; y: number; t: number; size: number; color?: string }) {
  return (
    <Box cx={p.x} cy={p.y} w={p.size} h={p.size} from={p.t} to={p.t + 0.55}
      anim={{ scale: [[p.t, 0.1, E.out], [p.t + 0.5, 1]], opacity: [[p.t, 0.35, E.out], [p.t + 0.55, 0]] }}>
      <R x={0} y={0} w={p.size} h={p.size} r={p.size / 2} fill={p.color ?? "#FFFFFF"} />
    </Box>
  );
}

/** A pill-shaped label (badge/chip). */
export function Chip(p: { x: number; y: number; text: string; size: number; bg: string; fg: string; weight?: number; padX?: number; h?: number; from?: number; to?: number; anim?: Anim; r?: number }) {
  const padX = p.padX ?? p.size * 0.7;
  const h = p.h ?? p.size * 1.9;
  const w = tw(p.text, p.size, p.weight ?? 600) + padX * 2;
  return (
    <G from={p.from} to={p.to} anim={p.anim}>
      <R x={p.x} y={p.y} w={w} h={h} r={p.r ?? h / 2} fill={p.bg} />
      <T x={p.x} y={p.y} w={w} h={h} align="center" baseline="middle" size={p.size} weight={p.weight ?? 600} color={p.fg}>{p.text}</T>
    </G>
  );
}

export const chipWidth = (text: string, size: number, weight = 600, padX?: number) => tw(text, size, weight) + (padX ?? size * 0.7) * 2;
