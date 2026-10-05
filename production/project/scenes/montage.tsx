// Scene 06 (38.85–46.65 s): the platform at a glance — one continuous camera
// move over REAL screens of Sketchware IA (the New Project form, the design
// editor, the Gravity edit, the Event tab, the block palette, the program,
// the build), with "Design. Lógica. Desenvolvimento." on the beat.
// Scene 07 (46.65–54 s): the design preview turns into the running app,
// which works; then DESIGN · EVENTOS · BLOCOS · LÓGICA · BUILD over real
// screens, on the beat, into the brand hit at 54.0.

import { Box, Camera, E, G, I, R, T, rise, type Key } from "../lib/core";
import { Footage, RealPhone, SCREEN_H, SRC_H, SRC_W, Window } from "../lib/footage";
import { APP_TEXT, RealApp } from "../screens/realapp";

const M0 = 38.85;
const M1 = 47.05;
const ST = (name: string) => `assets/stills/${name}`;

type CardItem =
  | { kind: "image"; src: string; full?: boolean }
  | { kind: "video"; before: string; after?: string; vFrom: number; vTo: number; sourceIn: number };

/** A real screen as a phone-shaped card (864×1684), r90. */
function Card(p: { cx: number; cy: number; s: number; r: number; item: CardItem }) {
  const it = p.item;
  return (
    <Box cx={p.cx} cy={p.cy} w={SRC_W} h={SCREEN_H} pad={2400} scale={p.s} rotation={p.r}>
      <R x={0} y={0} w={SRC_W} h={SCREEN_H} r={90} fill="#F8F9FB" shadow={{ blur: 120, y: 60, opacity: 0.55 }} />
      <G>
        {it.kind === "image" ? (
          <image src={it.src} x={0} y={0} width={SRC_W} height={it.full === false ? SCREEN_H : SRC_H} objectFit="fill" />
        ) : (
          <>
            <G from={M0} to={it.vFrom}><image src={it.before} x={0} y={0} width={SRC_W} height={SRC_H} objectFit="fill" /></G>
            <Footage from={it.vFrom} to={it.vTo} sourceIn={it.sourceIn} crop={{ x: 0, y: 0, w: SRC_W, h: SCREEN_H }} k={1} />
            {it.after ? <G from={it.vTo} to={M1 + 0.1}><image src={it.after} x={0} y={0} width={SRC_W} height={SRC_H} objectFit="fill" /></G> : null}
          </>
        )}
        <rect clipPath x={0} y={0} width={SRC_W} height={SCREEN_H} cornerRadius={90} />
      </G>
      <R x={0} y={0} w={SRC_W} h={SCREEN_H} r={90} fill="none" stroke={{ color: "#FFFFFF", width: 6, opacity: 0.18 }} />
    </Box>
  );
}

export const LAST_CARD = { x: 3850, y: 560, s: 0.36, src: ST("s_69.50_design-idle_admasked.png") };

export function Montage() {
  const shots = [
    { t: M0, x: -200, y: 560, s: 0.72, r: -3 },
    { t: 45.75, x: 3420, y: 540, s: 0.8, r: 2, ease: "cubicBezier(0.4,0,0.6,1)" },
    { t: 46.65, x: LAST_CARD.x, y: LAST_CARD.y, s: 0.42 / LAST_CARD.s, r: 0, ease: E.inOut },
  ];
  return (
    <G from={M0} to={M1 + 0.1}>
      {/* far layer: glass panels drifting slower */}
      <G anim={{ x: [[M0, 0], [M1, -140 * (M1 - M0)]], opacity: [[M0, 0, E.out], [M0 + 0.5, 1], [46.85, 1, E.inOut], [47.1, 0]] }}>
        {Array.from({ length: 14 }, (_, i) => {
          const x = 200 + i * 260 + (i % 3) * 40;
          const y = i % 2 ? 180 : 760;
          const s = 0.5 + (i % 4) * 0.12;
          return <R x={x} y={y} w={260 * s} h={520 * s} r={40 * s} fill="#FFFFFF" opacity={0.05} stroke={{ color: "#FFFFFF", width: 2, opacity: 0.12 }} rotation={i % 2 ? 6 : -5} />;
        })}
      </G>
      <G anim={{ opacity: [[M0, 0, E.out], [M0 + 0.35, 1], [46.85, 1, E.inOut], [47.1, 0]] }}>
        <Camera from={M0} to={M1 + 0.1} shots={shots}>
          <Card cx={-300} cy={520} s={0.34} r={3} item={{ kind: "image", src: "assets/screens/new-project-clean.jpg", full: false }} />
          <Card cx={420} cy={560} s={0.34} r={-4} item={{ kind: "image", src: "assets/screens/design-property-sheet.jpg" }} />
          <Card cx={900} cy={500} s={0.34} r={3} item={{ kind: "video", before: ST("s_28.40.png"), after: ST("s_30.06.png"), vFrom: 39.9, vTo: 41.56, sourceIn: 28.4 }} />
          <Card cx={1400} cy={570} s={0.36} r={-2} item={{ kind: "image", src: ST("s_38.45_event_admasked.png") }} />
          <Card cx={2150} cy={520} s={0.36} r={2} item={{ kind: "video", before: ST("s_45.70.png"), vFrom: 41.5, vTo: 45.5, sourceIn: 45.7 }} />
          <Window from={M0} to={M1 + 0.1} sourceIn={66.2} still={ST("s_66.20_blocks-final.png")} crop={{ x: 0, y: 206, w: 460, h: 190 }} cx={2880} cy={570} w={598} r={24}
            anim={{ rotation: [[M0, -3]] }} />
          <Card cx={3360} cy={500} s={0.36} r={3} item={{ kind: "video", before: ST("s_84.30.png"), vFrom: 43.0, vTo: 47.0, sourceIn: 84.3 }} />
          <Card cx={LAST_CARD.x} cy={LAST_CARD.y} s={LAST_CARD.s} r={0} item={{ kind: "image", src: LAST_CARD.src }} />
        </Camera>
      </G>
      {/* legibility vignette behind the words */}
      <R x={0} y={0} w={1920} h={1080} fill={{ radial: true, stops: [[0, "#07060F", 0.75], [0.6, "#07060F", 0.35], [1, "#07060F", 0]] }}
        opacity={0} anim={{ opacity: [[39.45, 0, E.out], [39.9, 1], [46.3, 1, E.in], [46.8, 0]] }} />
      <Word text="Design." at={39.6} until={41.45} />
      <Word text="Lógica." at={41.6} until={43.45} />
      <Word text="Desenvolvimento." at={43.6} until={45.2} />
      <G from={45.55} to={46.8}>
        <T x={0} y={500} w={1920} h={80} align="center" baseline="middle" size={64} weight={700} color="#FFFFFF" spacing={-1}
          shadow={{ blur: 30, y: 8, opacity: 0.5 }} anim={rise(45.55, 20, 0.6, 46.4, 0.35)}>Design. Lógica. Desenvolvimento.</T>
      </G>
    </G>
  );
}

function Word(p: { text: string; at: number; until: number; size?: number; spacing?: number; color?: string }) {
  const size = p.size ?? 150;
  return (
    <Box cx={960} cy={540} w={1920} h={size * 1.4} from={p.at} to={p.until + 0.3}
      blur={[[p.at, 14, E.out], [p.at + 0.35, 0], [p.until, 0, E.in], [p.until + 0.3, 10]]}
      anim={{
        scale: [[p.at, 1.18, E.out], [p.at + 0.6, 1], [p.until, 1, E.in], [p.until + 0.3, 0.94]],
        opacity: [[p.at, 0, E.out], [p.at + 0.25, 1], [p.until, 1, E.in], [p.until + 0.3, 0]],
      }}>
      <T x={0} y={0} w={1920} h={size * 1.4} align="center" baseline="middle" size={size} weight={800} spacing={p.spacing ?? -3}
        color={p.color ?? "#FFFFFF"} shadow={{ blur: 40, y: 10, opacity: 0.5 }}>{p.text}</T>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// 07 · result

const LAST_S = 0.42;
const CARD_LEFT = 960 - (SRC_W / 2) * LAST_S;
const CARD_TOP = 540 - (SCREEN_H / 2) * LAST_S;
const PREVIEW = { x: 280, y: 352, w: 558, h: 1212 }; // design preview in source px
const TV = { x: 559, y: 1044 }; // the grey "TextView" in the preview, source px
const PHONE_C = { x: 1200, y: 540 };
const PHONE_S = 0.58;
// push-in while the app works: larger, and lowered so the toolbar stays in frame
const END_S = 0.8;
const END_CY = 36 + ((SCREEN_H + 44) / 2) * END_S;

export const RES = { morph: 47.35, settle: 48.3, exit: 51.3 };

export function Result() {
  const t0 = 46.65;
  const m0 = RES.morph, m1 = RES.settle;
  const from = { x: CARD_LEFT + TV.x * LAST_S, y: CARD_TOP + TV.y * LAST_S }; // (1013, 625)
  const to = { x: PHONE_C.x, y: PHONE_C.y + (APP_TEXT.y - SCREEN_H / 2) * PHONE_S }; // (1200, 604)
  const pvRect0 = { x: CARD_LEFT + PREVIEW.x * LAST_S, y: CARD_TOP + PREVIEW.y * LAST_S, w: PREVIEW.w * LAST_S, h: PREVIEW.h * LAST_S, r: 6 };
  const pvRect1 = { x: PHONE_C.x - (SRC_W / 2) * PHONE_S, y: PHONE_C.y - (SCREEN_H / 2) * PHONE_S, w: SRC_W * PHONE_S, h: SCREEN_H * PHONE_S, r: 56 };
  const ease = E.inOut;
  const lin = (a: number, b: number): Key[] => [[m0, a, ease], [m1, b]];
  // A layer anchored at a point of its own content: a Box whose pivot is that
  // point (content offset by A - anchor inside a 2A box), so the point travels
  // from `from` to `to` while the layer scales.
  const A = 4000;
  const move = { cx: [[m0, from.x, ease], [m1, to.x]] as Key[], cy: [[m0, from.y, ease], [m1, to.y]] as Key[] };
  return (
    <G from={t0} to={54.15}>
      {/* the editor card handed over by the montage, blurring away */}
      <Box cx={960} cy={540} w={SRC_W} h={SCREEN_H} pad={2400} scale={LAST_S} from={t0} to={48.2}
        blur={[[m0, 0, E.inOut], [48.1, 12]]}
        anim={{ opacity: [[t0, 0, E.inOut], [46.9, 1], [m0, 1, E.inOut], [48.1, 0]] }}>
        <R x={0} y={0} w={SRC_W} h={SCREEN_H} r={90} fill="#F8F9FB" shadow={{ blur: 120, y: 60, opacity: 0.55 }} />
        <G>
          <image src={LAST_CARD.src} x={0} y={0} width={SRC_W} height={SRC_H} objectFit="fill" />
          <rect clipPath x={0} y={0} width={SRC_W} height={SCREEN_H} cornerRadius={90} />
        </G>
        <R x={0} y={0} w={SRC_W} h={SCREEN_H} r={90} fill="none" stroke={{ color: "#FFFFFF", width: 6, opacity: 0.18 }} />
      </Box>
      {/* morph: the preview grows into the app (layers anchored on the text) */}
      <G from={m0 - 0.02} to={m1 + 0.05}>
        <Box cx={from.x} cy={from.y} w={2 * A} h={2 * A} anim={{ ...move, scale: lin(LAST_S, 0.898), opacity: [[47.6, 1, E.inOut], [48.0, 0]] }}>
          <image src={LAST_CARD.src} x={A - TV.x} y={A - TV.y} width={SRC_W} height={SRC_H} objectFit="fill" />
        </Box>
        <Box cx={from.x} cy={from.y} w={2 * A} h={2 * A} opacity={0} anim={{ ...move, scale: lin(0.271, PHONE_S), opacity: [[47.55, 0, E.inOut], [47.95, 1]] }}>
          <G x={A - APP_TEXT.x} y={A - APP_TEXT.y}>
            <RealApp from={m0 - 0.02} to={m1 + 0.05} />
          </G>
        </Box>
        <rect clipPath x={pvRect0.x} y={pvRect0.y} width={pvRect0.w} height={pvRect0.h} cornerRadius={pvRect0.r}>
          {(["x", "y", "width", "height", "cornerRadius"] as const).map((prop) => {
            const k = { x: "x", y: "y", width: "w", height: "h", cornerRadius: "r" }[prop] as "x" | "y" | "w" | "h" | "r";
            return (
              <keyframeTrack property={prop}>
                <keyframe time={0.02} value={pvRect0[k]} easing={ease} />
                <keyframe time={m1 - m0 + 0.02} value={pvRect1[k]} />
              </keyframeTrack>
            );
          })}
        </rect>
      </G>
      {/* the phone with the running app */}
      <RealPhone cx={PHONE_C.x} cy={PHONE_C.y} from={47.95} to={51.6}
        anim={{
          opacity: [[47.95, 0, E.out], [48.3, 1], [RES.exit, 1, E.in], [51.5, 0]],
          scale: [[47.95, PHONE_S], [48.3, PHONE_S, E.inOut], [50.8, END_S], [RES.exit, END_S, E.in], [51.5, END_S * 0.85]],
          cy: [[48.3, 540, E.inOut], [50.8, END_CY]],
        }}
        blur={[[RES.exit, 0, E.in], [51.5, 16]]}>
        <RealApp from={47.95} to={51.6} bump={[48.6, 50.0]} />
      </RealPhone>
      {/* the program that made it */}
      <Window from={48.85} to={51.35} sourceIn={66.2} still={ST("s_66.20_blocks-final.png")} crop={{ x: 10, y: 262, w: 392, h: 118 }} cx={136 + 549 / 2} cy={690 + 165 / 2} w={549} r={18}
        anim={{ offsetY: [[48.9, 18, E.out], [49.4, 0]], opacity: [[48.9, 0, E.out], [49.3, 1], [51.0, 1, E.in], [51.3, 0]] }} />
      <Rings />
      {/* words on the beat, over real screens */}
      <BeatWord text="DESIGN" at={51.5} src={ST("s_37.40_design-textview.png")} cropY={300} />
      <BeatWord text="EVENTOS" at={52.0} src={ST("s_38.45_event_admasked.png")} cropY={230} />
      <BeatWord text="BLOCOS" at={52.5} src={ST("s_49.70_palette-widgets.png")} cropY={1300} />
      <BeatWord text="LÓGICA" at={53.0} src={ST("s_66.20_blocks-final.png")} cropY={150} />
      <BeatWord text="BUILD" at={53.5} src={ST("s_87.10_build-aapt2_admasked.png")} cropY={1198} color="#C9BEFF" last />
    </G>
  );
}

/** Rings on the app's "Olá mundo" and on the card's slot (48.6 and 50.0). */
function Rings() {
  const at = (t: number) => {
    // phone scale/centre at t (matches the RealPhone keys above)
    const k = t <= 48.3 ? 0 : t >= 50.8 ? 1 : (t - 48.3) / 2.5;
    const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    const s = PHONE_S + (END_S - PHONE_S) * e;
    const cy = 540 + (END_CY - 540) * e;
    return { x: PHONE_C.x, y: cy + (APP_TEXT.y - SCREEN_H / 2) * s, s };
  };
  // card slot: crop {10,262,392,118} at k 1.4, top-left (136,690); slot source x290–386, y333–361
  const slot = { x: 136 + (338 - 10) * 1.4, y: 690 + (347 - 262) * 1.4 };
  const ring = (t: number, x: number, y: number, w: number, h: number) => (
    <Box cx={x} cy={y} w={w} h={h} from={t} to={t + 0.55}
      anim={{ scale: [[t, 0.85, E.out], [t + 0.5, 1.2]], opacity: [[t, 0, E.out], [t + 0.06, 1], [t + 0.5, 0]] }}>
      <R x={0} y={0} w={w} h={h} r={h / 2} fill="none" stroke={{ color: "#B9AEFF", width: 4 }} />
    </Box>
  );
  const a = at(48.6), b = at(50.0);
  return (
    <>
      {ring(48.6, a.x, a.y, 260 * a.s / 0.58 * 0.9, 80)}
      {ring(50.0, b.x, b.y, 260 * b.s / 0.58 * 0.9, 90)}
      {ring(50.0, slot.x, slot.y, 170, 64)}
    </>
  );
}

/** A beat word over a full-bleed, darkened crop of a real screen. */
function BeatWord(p: { text: string; at: number; src: string; cropY: number; color?: string; last?: boolean }) {
  const k = 1920 / SRC_W; // 2.222: an 864×486 crop fills the frame
  const t0 = p.at, t1 = p.at + 0.5;
  return (
    <G from={t0} to={t1}>
      <Box cx={960} cy={540} w={1920} h={1080} pad={6000} anim={{ scale: [[t0, 1.06, E.out], [t1, 1.0]] }}
        blur={p.last ? [[t0, 6], [53.8, 6, E.in], [54.0, 14]] : 6}>
        <I src={p.src} x={0} y={-p.cropY * k} w={1920} h={SRC_H * k} fit="fill" />
        <rect clipPath x={0} y={0} width={1920} height={1080} />
      </Box>
      <R x={0} y={0} w={1920} h={1080} fill="#07060F" opacity={0.55} />
      <Box cx={960} cy={540} w={1920} h={240} anim={{ scale: [[t0, 1.15, E.out], [t0 + 0.3, 1]], opacity: [[t0, 0, E.out], [t0 + 0.08, 1], [t1 - 0.08, 1, E.in], [t1, p.last ? 0.9 : 0]] }}>
        <T x={0} y={0} w={1920} h={240} align="center" baseline="middle" size={170} weight={800} spacing={14} color={p.color ?? "#FFFFFF"}
          shadow={{ blur: 40, y: 10, opacity: 0.5 }}>{p.text}</T>
      </Box>
    </G>
  );
}
