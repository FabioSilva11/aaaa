// Scene 01 (opening, 0–5 s) and scene 08 (closing, 54–60 s), plus the
// shared background and the step captions.

import { Box, E, G, I, Icon, R, T, tw, type Key, rise, sample } from "../lib/core";
import { BLOCK, C } from "../lib/ui";

// ---------------------------------------------------------------------------
// background: deep indigo with two slow brand-colored glows

export function Background() {
  return (
    <G from={0} to={60}>
      <R x={0} y={0} w={1920} h={1080} fill={{ radial: true, stops: [[0, "#1A1542"], [0.55, "#100D27"], [1, "#07060F"]] }} />
      <Glow color={C.primary} size={1300} path={(t) => [520 + 160 * Math.sin(t * 0.11), 380 + 90 * Math.cos(t * 0.09)]} opacity={0.38} />
      <Glow color={C.blue} size={1100} path={(t) => [1500 + 140 * Math.cos(t * 0.08), 760 + 80 * Math.sin(t * 0.12)]} opacity={0.26} />
    </G>
  );
}

function Glow(p: { color: string; size: number; path: (t: number) => [number, number]; opacity: number }) {
  return (
    <R x={0} y={0} w={p.size} h={p.size} r={p.size / 2} opacity={p.opacity}
      fill={{ radial: true, stops: [[0, p.color, 1], [0.45, p.color, 0.35], [1, p.color, 0]] }}
      anim={{
        x: sample((t) => p.path(t)[0] - p.size / 2, 0, 60, 2),
        y: sample((t) => p.path(t)[1] - p.size / 2, 0, 60, 2),
      }} />
  );
}

// ---------------------------------------------------------------------------
// captions: "01 — PROJETO" + a short title, left column

export function Caption(p: { step: string; label: string; lines: string[]; from: number; to: number; y?: number }) {
  const y = p.y ?? 430;
  const size = 66;
  return (
    <G from={p.from} to={p.to + 0.5}>
      <G anim={rise(p.from, 18, 0.6, p.to, 0.4)}>
        <R x={140} y={y + 12} w={36} h={4} r={2} fill={C.violet} />
        <T x={190} y={y} size={22} weight={700} spacing={4} color={C.lilac}>{`${p.step}  ${p.label}`}</T>
      </G>
      {p.lines.map((line, i) => (
        <T x={136} y={y + 48 + i * (size * 1.12)} size={size} weight={700} spacing={-1.5} color="#FFFFFF"
          anim={rise(p.from + 0.12 + i * 0.1, 30, 0.7, p.to - 0.05 + i * 0.05, 0.4)}>{line}</T>
      ))}
    </G>
  );
}

// ---------------------------------------------------------------------------
// brand lockup

function Wordmark(p: { cx: number; y: number; size: number; reveal: number; from: number; to: number }) {
  const sp = p.size * 0.06;
  const a = "SKETCHWARE ";
  const b = "IA";
  const wa = tw(a, p.size, 800, "Inter", sp);
  const wb = tw(b, p.size, 800, "Inter", sp);
  const x0 = p.cx - (wa + wb) / 2;
  const h = p.size * 1.3;
  const clip: Key[] = [[p.reveal, 0, E.out], [p.reveal + 0.9, wa + wb + 40]];
  return (
    <G from={p.from} to={p.to}>
      <T x={x0} y={p.y} size={p.size} weight={800} spacing={sp} color="#FFFFFF" anim={{ offsetY: [[p.reveal, 16, E.out], [p.reveal + 0.8, 0]] }}>
        {a}
        <rect clipPath x={-20} y={-20} width={0} height={h + 40}>
          <keyframeTrack property="width">
            {clip.map(([t, v, e]) => <keyframe time={t - p.from} value={v} easing={e ?? E.lin} />)}
          </keyframeTrack>
        </rect>
      </T>
      <T x={x0 + wa} y={p.y} size={p.size} weight={800} spacing={sp}
        fill={{ stops: [[0, "#A895FF"], [1, "#5B8CFF"]], rotation: 0 }}
        anim={{ offsetY: [[p.reveal + 0.25, 16, E.out], [p.reveal + 1.0, 0]], opacity: [[p.reveal + 0.35, 0, E.out], [p.reveal + 0.8, 1]] }}>{b}</T>
    </G>
  );
}

function BrandTile(p: { cx: number; cy: number; size: number; at: number; from: number; to: number; anim?: Record<string, Key[]> }) {
  return (
    <Box cx={p.cx} cy={p.cy} w={p.size} h={p.size} from={p.from} to={p.to}
      anim={{ scale: [[p.at, 0.35, E.back], [p.at + 0.75, 1]], opacity: [[p.at, 0, E.out], [p.at + 0.25, 1]], rotation: [[p.at, -14, E.out], [p.at + 0.9, 0]], ...(p.anim ?? {}) }}>
      <I src="assets/brand/mark-tile.png" x={0} y={0} w={p.size} h={p.size} />
    </Box>
  );
}

function Halo(p: { cx: number; cy: number; size: number; at: number; from: number; to: number; strength?: number }) {
  const s = p.strength ?? 1;
  return (
    <Box cx={p.cx} cy={p.cy} w={p.size} h={p.size} from={p.from} to={p.to}
      anim={{ scale: [[p.at, 0.3, E.out], [p.at + 1.2, 1]], opacity: [[p.at, 0, E.out], [p.at + 0.25, 0.85 * s], [p.at + 1.6, 0.45 * s]] }}>
      <R x={0} y={0} w={p.size} h={p.size} r={p.size / 2} fill={{ radial: true, stops: [[0, "#8B6CFF", 0.9], [0.35, "#6B5CE7", 0.35], [1, "#6B5CE7", 0]] }} />
    </Box>
  );
}

// ---------------------------------------------------------------------------
// floating interface fragments of the opening

type Frag = { x: number; y: number; depth: number; kind: string; delay: number };
const FRAGS: Frag[] = [
  { x: 360, y: 290, depth: 0.9, kind: "button", delay: 0.15 },
  { x: 1560, y: 250, depth: 0.8, kind: "field", delay: 0.3 },
  { x: 330, y: 790, depth: 0.75, kind: "hat", delay: 0.45 },
  { x: 1580, y: 820, depth: 1.0, kind: "set", delay: 0.2 },
  { x: 720, y: 150, depth: 0.55, kind: "icon:text", delay: 0.55 },
  { x: 1240, y: 930, depth: 0.6, kind: "icon:image", delay: 0.4 },
  { x: 1760, y: 540, depth: 0.5, kind: "icon:blocks", delay: 0.6 },
  { x: 170, y: 540, depth: 0.55, kind: "icon:tap", delay: 0.5 },
  { x: 1140, y: 140, depth: 0.45, kind: "toggle", delay: 0.7 },
  { x: 760, y: 950, depth: 0.45, kind: "if", delay: 0.65 },
];

function FragView(p: { kind: string }) {
  const k = p.kind;
  if (k === "button") return (
    <>
      <R x={0} y={0} w={260} h={72} r={36} fill={C.primary} shadow={{ blur: 30, y: 12, opacity: 0.4, color: C.primary }} />
      <T x={0} y={0} w={260} h={72} align="center" baseline="middle" size={28} weight={600} color="#FFFFFF">Saudar</T>
    </>
  );
  if (k === "field") return (
    <>
      <R x={0} y={0} w={330} h={72} r={18} fill="#FFFFFF" shadow={{ blur: 30, y: 12, opacity: 0.35 }} />
      <T x={26} y={0} h={72} baseline="middle" size={24} color={C.variant}>Digite seu nome</T>
      <R x={24} y={58} w={282} h={3} r={1.5} fill={C.primary} />
    </>
  );
  if (k === "hat") return (
    <>
      <R x={0} y={0} w={330} h={68} r={20} rbl={8} rbr={8} fill={BLOCK.hat} shadow={{ blur: 24, y: 10, opacity: 0.35 }} />
      <T x={20} y={4} h={64} baseline="middle" size={22} weight={600} color="#FFFFFF">When button1 clicked</T>
    </>
  );
  if (k === "set") return (
    <>
      <R x={0} y={0} w={300} h={60} r={8} fill={BLOCK.view} shadow={{ blur: 24, y: 10, opacity: 0.35 }} />
      <R x={14} y={12} w={130} h={36} r={7} fill="#3A56AA" />
      <T x={26} y={12} h={36} baseline="middle" size={19} weight={600} color="#FFFFFF">textview1</T>
      <T x={158} y={0} h={60} baseline="middle" size={21} weight={600} color="#FFFFFF">setText</T>
    </>
  );
  if (k === "if") return (
    <>
      <R x={0} y={0} w={200} h={56} r={8} fill={BLOCK.control} shadow={{ blur: 24, y: 10, opacity: 0.35 }} />
      <T x={18} y={0} h={56} baseline="middle" size={22} weight={600} color="#FFFFFF">if</T>
      <R x={50} y={10} w={80} h={36} r={8} fill="#B48520" />
      <T x={142} y={0} h={56} baseline="middle" size={22} weight={600} color="#FFFFFF">then</T>
    </>
  );
  if (k === "toggle") return (
    <>
      <R x={0} y={0} w={120} h={64} r={32} fill={C.primary} shadow={{ blur: 24, y: 10, opacity: 0.35, color: C.primary }} />
      <R x={64} y={8} w={48} h={48} r={24} fill="#FFFFFF" />
    </>
  );
  const icon = k.split(":")[1]!;
  return (
    <>
      <R x={0} y={0} w={110} h={110} r={30} fill="#FFFFFF" shadow={{ blur: 26, y: 10, opacity: 0.35 }} />
      <Icon name={icon} tint="primary" x={27} y={27} size={56} />
    </>
  );
}

const FRAG_SIZE: Record<string, [number, number]> = {
  button: [260, 72], field: [330, 72], hat: [330, 68], set: [300, 60], if: [200, 56], toggle: [120, 64],
};

// ---------------------------------------------------------------------------

export function Opening() {
  const exit = 4.05;
  return (
    <G from={0} to={5.2}>
      {FRAGS.map((f) => {
        const [w, h] = FRAG_SIZE[f.kind] ?? [110, 110];
        const dx = f.x - 960, dy = f.y - 540;
        const t0 = 0.1 + f.delay;
        return (
          <Box cx={f.x} cy={f.y} w={w} h={h} from={0} to={5.2}
            blur={f.depth < 0.6 ? [[0, 6], [exit, 3], [exit + 0.6, 10]] : [[0, 0], [exit, 0, E.in], [exit + 0.6, 8]]}
            anim={{
              scale: [[t0, 0.7 * f.depth, E.out], [exit, 0.92 * f.depth, E.in], [exit + 0.7, 2.6 * f.depth]],
              cx: [[t0, 960 + dx * 0.82, E.out], [exit, 960 + dx * 1.0, E.in], [exit + 0.7, 960 + dx * 2.4]],
              cy: [[t0, 540 + dy * 0.82, E.out], [exit, 540 + dy * 1.0, E.in], [exit + 0.7, 540 + dy * 2.4]],
              opacity: [[t0, 0, E.out], [t0 + 0.6, f.depth < 0.6 ? 0.55 : 0.92], [exit + 0.2, f.depth < 0.6 ? 0.55 : 0.92, E.in], [exit + 0.65, 0]],
              rotation: [[t0, dx > 0 ? 8 : -8, E.out], [exit, dx > 0 ? 3 : -3]],
            }}>
            <FragView kind={f.kind} />
          </Box>
        );
      })}
      {/* centre lockup, pushed through on exit */}
      <Box cx={960} cy={540} w={1920} h={1080} from={0} to={5.2}
        blur={[[exit, 0, E.in], [exit + 0.6, 14]]}
        anim={{ scale: [[exit, 1, E.in], [exit + 0.7, 1.35]], opacity: [[exit + 0.15, 1, E.in], [exit + 0.65, 0]] }}>
        <Halo cx={960} cy={400} size={900} at={0.6} from={0} to={5.2} />
        <BrandTile cx={960} cy={390} size={210} at={0.65} from={0} to={5.2} />
        <Wordmark cx={960} y={540} size={100} reveal={1.15} from={0} to={5.2} />
        <T x={0} y={690} w={1920} h={60} align="center" baseline="middle" size={40} weight={500} color={C.lilac} anim={rise(1.95, 20, 0.8)}>Transforme ideias em aplicativos.</T>
      </Box>
    </G>
  );
}

export function Closing() {
  const t = 54.0;
  return (
    <G from={53.9} to={60}>
      {/* flash */}
      <R x={0} y={0} w={1920} h={1080} fill={{ radial: true, stops: [[0, "#B9AEFF", 0.9], [0.5, "#6B5CE7", 0.25], [1, "#6B5CE7", 0]] }} opacity={0}
        anim={{ opacity: [[t, 0.9, E.out], [t + 0.9, 0]] }} />
      <Halo cx={960} cy={390} size={1100} at={t} from={t} to={60} strength={1.1} />
      <BrandTile cx={960} cy={380} size={230} at={t} from={t} to={60} />
      <Wordmark cx={960} y={545} size={108} reveal={t + 0.3} from={t} to={60} />
      <T x={0} y={705} w={1920} h={60} align="center" baseline="middle" size={42} weight={500} spacing={1} color={C.lilac} from={t + 1.0} anim={rise(t + 1.0, 18, 0.8)}>Crie. Programe. Teste.</T>
      {/* end fade */}
      <R x={0} y={0} w={1920} h={1080} fill="#000000" opacity={0} from={58.6} anim={{ opacity: [[58.6, 0, E.inOut], [59.95, 1]] }} />
    </G>
  );
}
