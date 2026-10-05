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
import { Box, E, G, R, easeFn, lerp, snap, type Anim, type Key } from "./core";

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
  /** a still (a whole 864×1920 recording frame) instead of the video */
  still?: string;
}) {
  // The clip is bounded by `end` (timeline time), not sourceOut: the runtime
  // rounds sourceOut in source frames and divides by the rate, which can end
  // a sped-up or slowed clip a frame early and flash an empty screen at the cut.
  const speed = p.speed ?? 1;
  const k = p.k;
  if (p.still) {
    return (
      <G from={p.from} to={p.to} x={p.x ?? 0} y={p.y ?? 0}>
        <image src={p.still} x={-p.crop.x * k} y={-p.crop.y * k} width={SRC_W * k} height={SRC_H * k} objectFit="fill" />
        <rect clipPath x={0} y={0} width={p.crop.w * k} height={p.crop.h * k} cornerRadius={p.r ?? 0} />
      </G>
    );
  }
  return (
    <G from={p.from} to={p.to} x={p.x ?? 0} y={p.y ?? 0}>
      <video
        src={SRC}
        x={-p.crop.x * k}
        y={-p.crop.y * k}
        width={SRC_W * k}
        height={SRC_H * k}
        start={0}
        end={snap(p.to) - snap(p.from)}
        sourceIn={p.sourceIn}
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
  from: number; to: number; sourceIn: number; speed?: number; crop: Crop; still?: string;
  cx: number; cy: number; w: number; r?: number; anim?: Anim; shadow?: boolean; blur?: number | Key[];
  children?: JSX.Element; border?: boolean;
}) {
  const k = p.w / p.crop.w;
  const h = p.crop.h * k;
  const r = p.r ?? 28;
  return (
    <Box cx={p.cx} cy={p.cy} w={p.w} h={h} pad={PAD} from={p.from} to={p.to} anim={p.anim} blur={p.blur}>
      {p.shadow !== false ? <R x={0} y={0} w={p.w} h={h} r={r} fill="#F8F9FB" shadow={{ blur: 70, y: 34, opacity: 0.5 }} /> : null}
      <Footage from={p.from} to={p.to} sourceIn={p.sourceIn} speed={p.speed} crop={p.crop} k={k} r={r} still={p.still} />
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

/**
 * A still on the RealPhone screen. `full`: the image is a whole 864×1920
 * recording frame (drawn at full height and cut by the screen at 1684);
 * otherwise it is already screen-shaped (864×1684, e.g. the cleaned
 * New Project screenshot).
 */
export function ScreenStill(p: { from: number; to: number; src: string; anim?: Anim; full?: boolean }) {
  return (
    <G from={p.from} to={p.to} anim={p.anim}>
      <image src={p.src} x={0} y={0} width={SRC_W} height={p.full ? SRC_H : SCREEN_H} objectFit="fill" />
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

// ---------------------------------------------------------------------------
// animated window: crop, zoom and position all keyframed, over a sequence of
// footage segments (or stills) that cut inside the same window.

export type Geo = {
  t: number; crop: Crop; k: number; cx: number; cy: number;
  /** easing of the move INTO this key; "cut" jumps at t */
  ease?: string; op?: number;
};
export type Seg = { from: number; to: number; sourceIn?: number; speed?: number; still?: string };

function geoAt(keys: Geo[], t: number) {
  const ks = [...keys].sort((a, b) => a.t - b.t);
  const pick = (g: Geo) => ({ x: g.crop.x, y: g.crop.y, w: g.crop.w, h: g.crop.h, k: g.k, cx: g.cx, cy: g.cy, op: g.op ?? 1 });
  if (t <= ks[0]!.t) return pick(ks[0]!);
  for (let i = 0; i < ks.length - 1; i++) {
    const a = ks[i]!, b = ks[i + 1]!;
    if (t < b.t) {
      if (b.ease === "cut") return pick(a);
      const e = easeFn(b.ease ?? E.inOut)((t - a.t) / Math.max(1e-6, b.t - a.t));
      const A = pick(a), B = pick(b);
      return {
        x: lerp(A.x, B.x, e), y: lerp(A.y, B.y, e), w: lerp(A.w, B.w, e), h: lerp(A.h, B.h, e),
        k: Math.exp(lerp(Math.log(A.k), Math.log(B.k), e)), cx: lerp(A.cx, B.cx, e), cy: lerp(A.cy, B.cy, e), op: lerp(A.op, B.op, e),
      };
    }
  }
  return pick(ks[ks.length - 1]!);
}

/** Frame position of a SOURCE pixel (sx, sy) shown in a window at time t. */
export function windowPoint(keys: Geo[], t: number, sx: number, sy: number): [number, number] {
  const g = geoAt(keys, t);
  const left = g.cx - (g.w * g.k) / 2, top = g.cy - (g.h * g.k) / 2;
  return [left + (sx - g.x) * g.k, top + (sy - g.y) * g.k];
}

/** Sample times for [a, b]: dense (30/s) while the geometry moves, sparse when it holds. */
function sampleTimes(keys: Geo[], a: number, b: number): number[] {
  const ks = [...keys].sort((x, y) => x.t - y.t);
  const marks = [a, ...ks.map((k) => k.t).filter((t) => t > a && t < b), b];
  const out: number[] = [];
  for (let i = 0; i < marks.length - 1; i++) {
    const s = marks[i]!, e = marks[i + 1]!;
    const nextKey = ks.find((k) => k.t >= e - 1e-6 && k.t <= e + 1e-6);
    const g0 = geoAt(keys, s + 1e-4), g1 = geoAt(keys, e - 1e-4);
    const moving = Math.abs(g0.k - g1.k) + Math.abs(g0.cx - g1.cx) + Math.abs(g0.cy - g1.cy) + Math.abs(g0.x - g1.x) + Math.abs(g0.y - g1.y) + Math.abs(g0.w - g1.w) + Math.abs(g0.h - g1.h) + Math.abs(g0.op - g1.op) > 0.01;
    const n = moving ? Math.max(1, Math.ceil((e - s) * 30)) : 1;
    for (let j = 0; j < n; j++) out.push(s + ((e - s) * j) / n);
    if (nextKey?.ease === "cut") out.push(e - 1 / 120);
  }
  out.push(b);
  return out;
}

/**
 * Keys at absolute times → a keyframe track. Keyframe time is the node's
 * SOURCE-local time: for sourceless nodes and stills that is (t - start);
 * for a <video> it is sourceIn + (t - start) · playbackRate.
 */
function Track(props: { property: string; keys: [number, number][]; start: number; sourceIn?: number; rate?: number }) {
  const off = props.sourceIn ?? 0, rate = props.rate ?? 1;
  return (
    <keyframeTrack property={props.property}>
      {props.keys.map(([t, v]) => <keyframe time={Math.round((off + (t - props.start) * rate) * 1000) / 1000} value={Math.round(v * 100) / 100} easing={E.lin} />)}
    </keyframeTrack>
  );
}

/**
 * A rounded card that shows footage segments (or stills) through an animated
 * crop: `geo` keys give, over time, the source crop, the zoom k (output px per
 * source px) and the card centre. Everything (card, clip, picture) is sampled
 * from the same geometry, so crop and picture never drift apart.
 */
export function AnimWindow(p: {
  from: number; to: number; geo: Geo[]; segs: Seg[]; r?: number; anim?: Anim; blur?: number | Key[];
  shadow?: boolean; border?: boolean; children?: JSX.Element;
}) {
  const from = snap(p.from), to = snap(p.to);
  const segs = p.segs.map((s) => ({ ...s, from: snap(s.from), to: snap(s.to) }));
  const r = p.r ?? 28;
  const rect = (t: number) => {
    const g = geoAt(p.geo, t);
    const W = g.w * g.k, H = g.h * g.k;
    return { left: g.cx - W / 2, top: g.cy - H / 2, W, H, g };
  };
  const card = sampleTimes(p.geo, from, to);
  const keysOf = (times: number[], f: (t: number) => number): [number, number][] => times.map((t) => [t, f(t)]);
  return (
    <G from={from} to={to} anim={p.anim} blur={p.blur}>
      <G anim={{ opacity: keysOf(card, (t) => rect(t).g.op).map(([t, v]) => [t, v] as Key) }}>
        {p.shadow !== false ? (
          <rect x={0} y={0} width={10} height={10} cornerRadius={r} fill="#F8F9FB" start={0} end={to - from}>
            <shadow color="#000000" blur={70} offsetY={34} opacity={0.5} />
            <Track property="x" keys={keysOf(card, (t) => rect(t).left)} start={from} />
            <Track property="y" keys={keysOf(card, (t) => rect(t).top)} start={from} />
            <Track property="width" keys={keysOf(card, (t) => rect(t).W)} start={from} />
            <Track property="height" keys={keysOf(card, (t) => rect(t).H)} start={from} />
          </rect>
        ) : null}
        {segs.map((s) => {
          const times = sampleTimes(p.geo, s.from, s.to);
          const speed = s.speed ?? 1;
          return (
            <G from={s.from} to={s.to}>
              {s.still ? (
                <image src={s.still} x={0} y={0} width={SRC_W} height={SRC_H} objectFit="fill" start={0} end={s.to - s.from}>
                  <Track property="x" keys={keysOf(times, (t) => rect(t).left - rect(t).g.x * rect(t).g.k)} start={s.from} />
                  <Track property="y" keys={keysOf(times, (t) => rect(t).top - rect(t).g.y * rect(t).g.k)} start={s.from} />
                  <Track property="width" keys={keysOf(times, (t) => SRC_W * rect(t).g.k)} start={s.from} />
                  <Track property="height" keys={keysOf(times, (t) => SRC_H * rect(t).g.k)} start={s.from} />
                </image>
              ) : (
                <video src={SRC} x={0} y={0} width={SRC_W} height={SRC_H} objectFit="fill" muted start={0}
                  end={s.to - s.from} sourceIn={s.sourceIn!} playbackRate={speed}>
                  <Track property="x" keys={keysOf(times, (t) => rect(t).left - rect(t).g.x * rect(t).g.k)} start={s.from} sourceIn={s.sourceIn} rate={speed} />
                  <Track property="y" keys={keysOf(times, (t) => rect(t).top - rect(t).g.y * rect(t).g.k)} start={s.from} sourceIn={s.sourceIn} rate={speed} />
                  <Track property="width" keys={keysOf(times, (t) => SRC_W * rect(t).g.k)} start={s.from} sourceIn={s.sourceIn} rate={speed} />
                  <Track property="height" keys={keysOf(times, (t) => SRC_H * rect(t).g.k)} start={s.from} sourceIn={s.sourceIn} rate={speed} />
                </video>
              )}
              <rect clipPath x={0} y={0} width={10} height={10} cornerRadius={r} start={0} end={s.to - s.from}>
                <Track property="x" keys={keysOf(times, (t) => rect(t).left)} start={s.from} />
                <Track property="y" keys={keysOf(times, (t) => rect(t).top)} start={s.from} />
                <Track property="width" keys={keysOf(times, (t) => rect(t).W)} start={s.from} />
                <Track property="height" keys={keysOf(times, (t) => rect(t).H)} start={s.from} />
              </rect>
            </G>
          );
        })}
        {p.border !== false ? (
          <rect x={0} y={0} width={10} height={10} cornerRadius={r} start={0} end={to - from}>
            <stroke color="#FFFFFF" width={3} opacity={0.22} />
            <Track property="x" keys={keysOf(card, (t) => rect(t).left)} start={from} />
            <Track property="y" keys={keysOf(card, (t) => rect(t).top)} start={from} />
            <Track property="width" keys={keysOf(card, (t) => rect(t).W)} start={from} />
            <Track property="height" keys={keysOf(card, (t) => rect(t).H)} start={from} />
          </rect>
        ) : null}
        {p.children}
      </G>
    </G>
  );
}
