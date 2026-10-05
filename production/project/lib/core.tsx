// Motion core of the composition: absolute-time wrappers around the Diffusion
// Studio elements, one easing vocabulary for the whole film, a camera rig and
// text metrics.
//
// Time. Every wrapper takes absolute times (seconds on the video's clock):
// `from`/`to` for its window and `[t, value, easing]` keys in `anim`. The
// wrappers convert them to what the runtime wants (a child's start is
// relative to its parent's, keyframes are relative to the node's own start),
// so the scenes read like a timeline.
//
// Pivot. The runtime scales and rotates a node about (width/2, height/2) of
// its box in local coordinates. A group's box is the union of its children,
// so a group that animates scale/rotation gets an invisible `bounds` rect at
// (0,0,w,h): the pivot is then its centre whatever its children do.

import { createContext, useContext } from "solid-js";
import type { JSX } from "solid-js";

import METRICS from "./metrics.json";

// ---------------------------------------------------------------------------
// easing — one motion language for the whole video

export const E = {
  /** entrances, settles: fast start, long soft landing */
  out: "cubicBezier(0.16,1,0.3,1)",
  /** camera moves and transforms between two rests */
  inOut: "cubicBezier(0.65,0,0.35,1)",
  /** exits */
  in: "cubicBezier(0.7,0,0.84,0)",
  /** pops with a moderate overshoot */
  back: "cubicBezier(0.34,1.45,0.64,1)",
  /** UI micro-interactions (Material standard) */
  std: "cubicBezier(0.2,0,0,1)",
  lin: "linear",
  hold: "steps(1)",
} as const;

function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x;
      const d = dx(t);
      if (Math.abs(e) < 1e-6 || Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    t = Math.min(1, Math.max(0, t));
    return sy(t);
  };
}

/** The JS twin of an easing string, for sampled (computed) motion. */
export function easeFn(name: string): (x: number) => number {
  const m = /cubicBezier\(([^)]+)\)/.exec(name);
  if (m) {
    const [a, b, c, d] = m[1]!.split(",").map(Number);
    return bezier(a!, b!, c!, d!);
  }
  return (x) => x;
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));

// ---------------------------------------------------------------------------
// time context

type Window = { from: number; to: number };
const Base = createContext<Window>({ from: 0, to: 60 });
export const useWindow = () => useContext(Base);

export type Key = [number, number | string] | [number, number | string, string];
export type Anim = Record<string, Key[]>;

/** Samples `fn(t)` (absolute time) into linear keys every 1/fps s. */
export function sample(fn: (t: number) => number, t0: number, t1: number, fps = 30): Key[] {
  const keys: Key[] = [];
  const n = Math.max(1, Math.round((t1 - t0) * fps));
  for (let i = 0; i <= n; i++) {
    const t = t0 + ((t1 - t0) * i) / n;
    keys.push([t, Math.round(fn(t) * 1000) / 1000]);
  }
  return keys;
}

function Tracks(props: { anim?: Anim; start: number }) {
  const entries = Object.entries(props.anim ?? {}).filter(([, keys]) => keys && keys.length);
  return (
    <>
      {entries.map(([property, keys]) => (
        <keyframeTrack property={property}>
          {[...keys]
            .sort((a, b) => a[0] - b[0])
            .map(([t, value, easing]) => (
              <keyframe time={Math.round((t - props.start) * 1000) / 1000} value={value} easing={easing ?? E.lin} />
            ))}
        </keyframeTrack>
      ))}
    </>
  );
}

/** Drops undefined props so the runtime keeps its defaults. */
function def<T extends Record<string, unknown>>(o: T): Partial<T> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(o)) if (v !== undefined) out[k] = v;
  return out as Partial<T>;
}

type Timed = { from?: number; to?: number; anim?: Anim };

function useSpan(p: Timed) {
  const base = useWindow();
  const from = p.from ?? base.from;
  const to = p.to ?? base.to;
  return { base, from, to, start: from - base.from, end: to - base.from };
}

// ---------------------------------------------------------------------------
// elements

type GroupProps = Timed & {
  x?: number; y?: number; scale?: number; rotation?: number; opacity?: number;
  /** invisible box fixing the pivot at its centre: [x, y, w, h] */
  bounds?: [number, number, number, number];
  blur?: number | Key[];
  children?: JSX.Element;
  name?: string;
};

export function G(p: GroupProps) {
  const s = useSpan(p);
  return (
    <group {...def({ name: p.name, x: p.x ?? 0, y: p.y ?? 0, scale: p.scale, rotation: p.rotation, opacity: p.opacity })} start={s.start} end={s.end}>
      {p.bounds ? <rect x={p.bounds[0]} y={p.bounds[1]} width={p.bounds[2]} height={p.bounds[3]} start={0} end={s.to - s.from} /> : null}
      <Base.Provider value={{ from: s.from, to: s.to }}>{p.children}</Base.Provider>
      {p.blur !== undefined ? <Blur value={p.blur} start={s.from} /> : null}
      <Tracks anim={p.anim} start={s.from} />
    </group>
  );
}

function Blur(p: { value: number | Key[]; start: number }) {
  if (typeof p.value === "number") return <effect type="blur" value={p.value} />;
  return (
    <effect type="blur" value={0}>
      <Tracks anim={{ value: p.value }} start={p.start} />
    </effect>
  );
}

/**
 * A group placed by its centre, scaling/rotating about it. `w`×`h` is its
 * box; children are laid out in 0..w, 0..h. `anim.cx`/`anim.cy` move the
 * centre.
 *
 * `pad` reserves an invisible margin around the box so that children that
 * reach outside it (a clipped video larger than its window, an off-screen
 * slide) do not move the pivot: the group's bounds are then the padded box,
 * whose centre is still the box centre.
 */
export function Box(p: GroupProps & { cx: number; cy: number; w: number; h: number; pad?: number }) {
  const pad = p.pad ?? 0;
  const anim: Anim = { ...(p.anim ?? {}) };
  if (anim.cx) { anim.x = anim.cx.map(([t, v, e]) => [t, (v as number) - p.w / 2 - pad, e ?? E.lin] as Key); delete anim.cx; }
  if (anim.cy) { anim.y = anim.cy.map(([t, v, e]) => [t, (v as number) - p.h / 2 - pad, e ?? E.lin] as Key); delete anim.cy; }
  return (
    <G {...p} x={p.cx - p.w / 2 - pad} y={p.cy - p.h / 2 - pad} bounds={[0, 0, p.w + 2 * pad, p.h + 2 * pad]} anim={anim}>
      {pad ? <G x={pad} y={pad}>{p.children}</G> : p.children}
    </G>
  );
}

type Fill = string | { stops: ([number, string] | [number, string, number])[]; rotation?: number; radial?: boolean };

type RectProps = Timed & {
  x?: number; y?: number; w: number; h: number; r?: number;
  fill?: Fill; opacity?: number; rotation?: number; scale?: number;
  stroke?: { color: string; width?: number; opacity?: number };
  shadow?: { color?: string; blur: number; y?: number; x?: number; opacity?: number };
  blur?: number | Key[];
  blend?: string;
  children?: JSX.Element;
  rtl?: number; rtr?: number; rbl?: number; rbr?: number;
};

function Paint(p: { fill?: Fill }) {
  if (!p.fill || typeof p.fill === "string") return null;
  const stops = p.fill.stops.map(([o, c, a]) => <colorStop offset={o} color={c} opacity={a ?? 1} />);
  return p.fill.radial
    ? <radialGradientPaint>{stops}</radialGradientPaint>
    : <linearGradientPaint rotation={p.fill.rotation ?? 0}>{stops}</linearGradientPaint>;
}

export function R(p: RectProps) {
  const s = useSpan(p);
  return (
    <rect
      {...def({
        x: p.x ?? 0, y: p.y ?? 0, width: p.w, height: p.h, cornerRadius: p.r,
        cornerRadiusTopLeft: p.rtl, cornerRadiusTopRight: p.rtr, cornerRadiusBottomLeft: p.rbl, cornerRadiusBottomRight: p.rbr,
        fill: typeof p.fill === "string" && p.fill !== "none" ? p.fill : undefined, opacity: p.opacity, rotation: p.rotation, scale: p.scale,
        blendMode: p.blend,
      })}
      start={s.start}
      end={s.end}
    >
      <Paint fill={p.fill} />
      {p.stroke ? <stroke color={p.stroke.color} width={p.stroke.width ?? 1} {...def({ opacity: p.stroke.opacity })} /> : null}
      {p.shadow ? <shadow color={p.shadow.color ?? "#000000"} blur={p.shadow.blur} offsetX={p.shadow.x ?? 0} offsetY={p.shadow.y ?? 0} opacity={p.shadow.opacity ?? 0.3} /> : null}
      {p.blur !== undefined ? <Blur value={p.blur} start={s.from} /> : null}
      <Base.Provider value={{ from: s.from, to: s.to }}>{p.children}</Base.Provider>
      <Tracks anim={p.anim} start={s.from} />
    </rect>
  );
}

type TextProps = Timed & {
  x?: number; y?: number; w?: number; h?: number;
  size: number; weight?: number; color?: string; family?: string;
  align?: "left" | "center" | "right"; baseline?: "top" | "middle" | "bottom" | "alphabetic";
  spacing?: number; leading?: number; opacity?: number; rotation?: number; scale?: number;
  upper?: boolean;
  fill?: Fill;
  shadow?: { color?: string; blur: number; y?: number; opacity?: number };
  blur?: number | Key[];
  children: string | JSX.Element;
};

export function T(p: TextProps) {
  const s = useSpan(p);
  // A text given a height but no width would wrap into a zero-width box:
  // give it its own measured width instead (also keeps group bounds tight).
  const w = p.w ?? (p.h !== undefined && typeof p.children === "string"
    ? Math.ceil(tw(p.children, p.size, p.weight ?? 400, p.family ?? "Inter", p.spacing ?? 0) * 1.04 + p.size * 0.6)
    : undefined);
  return (
    <text
      {...def({
        x: p.x ?? 0, y: p.y ?? 0, width: w, height: p.h, fontSize: p.size, fontWeight: p.weight ?? 400,
        fontFamily: p.family ?? "Inter", color: p.fill ? undefined : (p.color ?? "#FFFFFF"),
        textAlign: p.align, textBaseline: p.baseline, letterSpacing: p.spacing, leading: p.leading,
        opacity: p.opacity, rotation: p.rotation, scale: p.scale, textCase: p.upper ? "upper" : undefined,
      })}
      start={s.start}
      end={s.end}
    >
      {p.children}
      <Paint fill={p.fill} />
      {p.shadow ? <shadow color={p.shadow.color ?? "#000000"} blur={p.shadow.blur} offsetY={p.shadow.y ?? 0} opacity={p.shadow.opacity ?? 0.3} /> : null}
      {p.blur !== undefined ? <Blur value={p.blur} start={s.from} /> : null}
      <Tracks anim={p.anim} start={s.from} />
    </text>
  );
}

export function I(p: Timed & { src: string; x?: number; y?: number; w: number; h: number; r?: number; opacity?: number; fit?: "cover" | "contain" | "fill"; rotation?: number }) {
  const s = useSpan(p);
  return (
    <image
      src={p.src}
      {...def({ x: p.x ?? 0, y: p.y ?? 0, width: p.w, height: p.h, cornerRadius: p.r, opacity: p.opacity, objectFit: p.fit, rotation: p.rotation })}
      start={s.start}
      end={s.end}
    >
      <Tracks anim={p.anim} start={s.from} />
    </image>
  );
}

/** One of the promo's own icons (assets/icons/<name>-<tint>.png), `size` px square. */
export function Icon(p: Timed & { name: string; tint?: "dark" | "gray" | "primary" | "white" | "green"; x: number; y: number; size: number; opacity?: number }) {
  return <I src={`assets/icons/${p.name}-${p.tint ?? "dark"}.png`} x={p.x} y={p.y} w={p.size} h={p.size} fit="contain" from={p.from} to={p.to} opacity={p.opacity} anim={p.anim} />;
}

/** An audio clip at absolute time `at`. `vol` in dB. */
export function Sfx(p: { src: string; at: number; vol?: number }) {
  const base = useWindow();
  return <audio src={`assets/audio/sfx/${p.src}.wav`} start={p.at - base.from} volume={p.vol ?? -12} />;
}

/** A clip-path rect: clips its parent to x,y,w,h (animatable through anim). */
export function Clip(p: Timed & { x?: number; y?: number; w: number; h: number; r?: number }) {
  const s = useSpan(p);
  return (
    <rect clipPath {...def({ x: p.x ?? 0, y: p.y ?? 0, width: p.w, height: p.h, cornerRadius: p.r })} start={s.start} end={s.end}>
      <Tracks anim={p.anim} start={s.from} />
    </rect>
  );
}

// ---------------------------------------------------------------------------
// camera rig

export type Shot = { t: number; x: number; y: number; s: number; r?: number; ease?: string; /** frame x the target sits at (default 960) */ fx?: number };

/**
 * A 2D camera over `children`, which are laid out in world pixels. Each shot
 * says which world point sits at the frame centre, at what zoom and roll;
 * between shots the camera eases (zoom interpolated logarithmically, so a
 * push-in reads at constant speed). Sampled at 30 fps into x/y/scale/rotation
 * keys of one group whose pivot is pinned by its bounds.
 */
export function Camera(p: Timed & { shots: Shot[]; children: JSX.Element; drift?: number }) {
  const B = 100000;
  const P0 = { x: B / 2, y: B / 2 };
  // world origin sits at the bounds' centre so content at negative world
  // coordinates stays inside the box (and the pivot stays put)
  const C = { x: 960, y: 540 };
  const shots = [...p.shots].sort((a, b) => a.t - b.t);
  const at = (t: number) => {
    if (t <= shots[0]!.t) return { ...shots[0]!, r: shots[0]!.r ?? 0, fx: shots[0]!.fx ?? 960 };
    for (let i = 0; i < shots.length - 1; i++) {
      const a = shots[i]!, b = shots[i + 1]!;
      if (t <= b.t) {
        const k = easeFn(b.ease ?? E.inOut)((t - a.t) / Math.max(1e-6, b.t - a.t));
        return {
          x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k),
          s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), k)),
          r: lerp(a.r ?? 0, b.r ?? 0, k),
          fx: lerp(a.fx ?? 960, b.fx ?? 960, k),
        };
      }
    }
    const last = shots[shots.length - 1]!;
    return { ...last, r: last.r ?? 0, fx: last.fx ?? 960 };
  };
  const drift = p.drift ?? 0;
  const pose = (t: number) => {
    const v = at(t);
    const tx = v.x + drift * Math.sin(t * 0.7) / v.s;
    const ty = v.y + drift * Math.cos(t * 0.53) / v.s;
    const rad = (v.r * Math.PI) / 180;
    const dx = tx, dy = ty;
    const rx = Math.cos(rad) * dx - Math.sin(rad) * dy;
    const ry = Math.sin(rad) * dx + Math.cos(rad) * dy;
    return { x: v.fx - P0.x - v.s * rx, y: C.y - P0.y - v.s * ry, s: v.s, r: v.r };
  };
  const from = p.from ?? 0, to = p.to ?? 60;
  // Adaptive sampling: 20 keys/s while the camera moves between two
  // different shots, 4 keys/s while it holds (only the slow drift moves).
  const times: number[] = [];
  const bounds = [from, ...shots.map((s) => s.t).filter((t) => t > from && t < to), to];
  for (let i = 0; i < bounds.length - 1; i++) {
    const a = bounds[i]!, b = bounds[i + 1]!;
    const pa = at(a), pb = at(b);
    const moving = Math.abs(pa.x - pb.x) + Math.abs(pa.y - pb.y) + Math.abs(pa.s - pb.s) * 1000 + Math.abs(pa.r - pb.r) * 10 + Math.abs(pa.fx - pb.fx) > 0.5;
    const rate = moving ? 20 : drift ? 4 : 0;
    const n = rate ? Math.max(1, Math.round((b - a) * rate)) : 1;
    for (let k = 0; k < n; k++) times.push(a + ((b - a) * k) / n);
  }
  times.push(to);
  const keys = (f: (v: ReturnType<typeof pose>) => number): Key[] =>
    times.map((t) => [Math.round(t * 1000) / 1000, Math.round(f(pose(t)) * 1000) / 1000]);
  return (
    <G
      from={p.from}
      to={p.to}
      bounds={[0, 0, B, B]}
      anim={{ x: keys((v) => v.x), y: keys((v) => v.y), scale: keys((v) => v.s), rotation: keys((v) => v.r) }}
    >
      <G x={B / 2} y={B / 2}>{p.children}</G>
    </G>
  );
}

// ---------------------------------------------------------------------------
// text metrics

type Table = Record<string, number>;
const TABLES = METRICS as unknown as Record<string, Record<string, Table>>;

/** Advance width of `s` in px at `size`, from the measured Google Fonts files. */
export function tw(s: string, size: number, weight = 400, family = "Inter", spacing = 0): number {
  const fam = TABLES[family] ?? TABLES.Inter!;
  const weights = Object.keys(fam).map(Number);
  const w = weights.reduce((best, x) => (Math.abs(x - weight) < Math.abs(best - weight) ? x : best), weights[0]!);
  const table = fam[String(w)]!;
  let sum = 0;
  for (const ch of s) sum += table[ch] ?? table["n"]!;
  return (sum * size) / 100 + spacing * s.length;
}

// ---------------------------------------------------------------------------
// common motion recipes (absolute times)

/** Fade + rise in at t (and optionally out at t2). */
export function rise(t: number, dy = 24, d = 0.6, t2?: number, d2 = 0.35): Anim {
  const a: Anim = {
    opacity: [[t, 0, E.out], [t + d * 0.7, 1]],
    offsetY: [[t, dy, E.out], [t + d, 0]],
  };
  if (t2 !== undefined) {
    a.opacity!.push([t2, 1, E.in], [t2 + d2, 0]);
    a.offsetY!.push([t2, 0, E.in], [t2 + d2, -dy * 0.6]);
  }
  return a;
}

/** Opacity on at t, off at t2. */
export function fade(t: number, d = 0.4, t2?: number, d2 = 0.4, e = E.out): Key[] {
  const k: Key[] = [[t, 0, e], [t + d, 1]];
  if (t2 !== undefined) k.push([t2, 1, E.in], [t2 + d2, 0]);
  return k;
}

/** Scale pop at t: 0.6 → 1 with moderate overshoot. */
export function pop(t: number, d = 0.5, from = 0.6): Key[] {
  return [[t, from, E.back], [t + d, 1]];
}
