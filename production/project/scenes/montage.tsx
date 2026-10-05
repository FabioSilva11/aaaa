// Scene 06 (39–47 s): the platform at a glance — a continuous camera move
// over the screens seen so far (projects, new project, designer, logic,
// events, the running app), with "Design. Lógica. Desenvolvimento." on the
// beat. Scene 07 (47–54 s): the app leaves the editor, takes the centre and
// works; then DESIGN · EVENTOS · BLOCOS · LÓGICA · BUILD converge into the
// brand hit at 54 s.

import { Box, Camera, E, G, R, T, type Key, rise, sample } from "../lib/core";
import { C, Phone, SH, SW, Touch, d } from "../lib/ui";
import { HomeScreen, NewProjectScreen } from "../screens/start";
import { EditorScreen, PV } from "../screens/editor";
import { APP, AppScreen } from "../screens/app";
import { LogicPanel, PANEL } from "../screens/logic";

const M0 = 38.85;
const M1 = 47.05;

function Card(p: { cx: number; cy: number; s: number; r: number; w?: number; h?: number; children: unknown }) {
  const w = p.w ?? SW, h = p.h ?? SH;
  return (
    <Box cx={p.cx} cy={p.cy} w={w} h={h} scale={p.s} rotation={p.r}>
      <R x={0} y={0} w={w} h={h} r={90} fill={C.surface} shadow={{ blur: 120, y: 60, opacity: 0.55 }} />
      <G>
        {p.children as never}
        <rect clipPath x={0} y={0} width={w} height={h} cornerRadius={90} />
      </G>
      <R x={0} y={0} w={w} h={h} r={90} fill="none" stroke={{ color: "#FFFFFF", width: 6, opacity: 0.18 }} />
    </Box>
  );
}

export const LAST_CARD = { x: 3850, y: 560, s: 0.36 };

export function Montage() {
  const shots = [
    { t: M0, x: -200, y: 560, s: 0.72, r: -3 },
    { t: 45.75, x: 3420, y: 540, s: 0.8, r: 2, ease: "cubicBezier(0.4,0,0.6,1)" },
    { t: 46.65, x: LAST_CARD.x, y: LAST_CARD.y, s: 0.42 / LAST_CARD.s, r: 0, ease: E.inOut },
  ];
  return (
    <G from={M0} to={M1 + 0.1}>
      {/* far layer: glass panels drifting slower */}
      <G anim={{ x: sample((t) => -140 * (t - M0), M0, M1, 10), opacity: [[M0, 0, E.out], [M0 + 0.5, 1]] }}>
        {Array.from({ length: 14 }, (_, i) => {
          const x = 200 + i * 260 + (i % 3) * 40;
          const y = i % 2 ? 180 : 760;
          const s = 0.5 + (i % 4) * 0.12;
          return <R x={x} y={y} w={260 * s} h={520 * s} r={40 * s} fill="#FFFFFF" opacity={0.05} stroke={{ color: "#FFFFFF", width: 2, opacity: 0.12 }} rotation={i % 2 ? 6 : -5} />;
        })}
      </G>
      <G anim={{ opacity: [[M0, 0, E.out], [M0 + 0.35, 1], [46.85, 1, E.inOut], [47.1, 0]] }}>
        <Camera from={M0} to={M1 + 0.1} shots={shots}>
          <Card cx={420} cy={560} s={0.34} r={-4}><HomeScreen from={M0} to={M1} /></Card>
          <Card cx={900} cy={500} s={0.34} r={3}><NewProjectScreen from={M0} to={M1} open={-100} type={-100} create={-100} /></Card>
          <Card cx={1400} cy={570} s={0.36} r={-2}><EditorScreen from={M0} to={M1} /></Card>
          <Box cx={2150} cy={520} w={PANEL.w} h={PANEL.h} scale={0.52} rotation={2}>
            <LogicPanel from={M0} to={M1} t={{ ok: -100 }} x={0} y={0} />
          </Box>
          <Card cx={2880} cy={570} s={0.34} r={-3}><EditorScreen from={M0} to={M1} t={{ eventTab: -100 }} /></Card>
          <Card cx={3360} cy={500} s={0.36} r={3}><AppScreen from={M0} to={M1} /></Card>
          <Card cx={LAST_CARD.x} cy={LAST_CARD.y} s={LAST_CARD.s} r={0}><EditorScreen from={M0} to={M1} /></Card>
        </Camera>
      </G>
      {/* legibility vignette behind the words */}
      <R x={0} y={0} w={1920} h={1080} fill={{ radial: true, stops: [[0, "#07060F", 0.75], [0.6, "#07060F", 0.35], [1, "#07060F", 0]] }}
        opacity={0} anim={{ opacity: [[39.45, 0, E.out], [39.9, 1], [46.3, 1, E.in], [46.8, 0]] }} />
      <Word text="Design." at={39.6} until={41.45} />
      <Word text="Lógica." at={41.6} until={43.45} />
      <Word text="Desenvolvimento." at={43.6} until={45.35} />
      <G from={45.5} to={46.8}>
        <T x={0} y={500} w={1920} h={80} align="center" baseline="middle" size={64} weight={700} color="#FFFFFF" spacing={-1}
          anim={rise(45.5, 20, 0.6, 46.4, 0.35)}>Design. Lógica. Desenvolvimento.</T>
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

export const RES = { focus: 48.75, type: 48.95, press: 49.75, result: 49.9 };

export function Result() {
  const t0 = 46.7;
  // the editor card left by the montage, preview at its centre-right
  const cardS = 0.42;
  const pvCenter = { x: 960 + (d(PV.x + PV.w / 2) - SW / 2) * cardS, y: 540 + (d(PV.y + PV.h / 2) - SH / 2) * cardS };
  const k0 = (d(PV.w) * cardS) / SW;
  const grow = 47.35;
  const words = ["DESIGN", "EVENTOS", "BLOCOS", "LÓGICA", "BUILD"];
  const w0 = 51.9;
  const step = 0.42;
  return (
    <G from={t0} to={54.15}>
      <Box cx={960} cy={540} w={SW} h={SH} scale={cardS} from={t0} to={48.8}
        blur={[[grow, 0, E.inOut], [grow + 0.9, 12]]}
        anim={{ scale: [[grow, cardS, E.inOut], [grow + 0.9, 0.34]], opacity: [[t0, 0, E.inOut], [46.95, 1], [grow + 0.2, 1, E.inOut], [48.7, 0]] }}>
        <R x={0} y={0} w={SW} h={SH} r={90} fill={C.surface} shadow={{ blur: 120, y: 60, opacity: 0.55 }} />
        <G>
          <EditorScreen from={t0} to={48.8} />
          <rect clipPath x={0} y={0} width={SW} height={SH} cornerRadius={90} />
        </G>
      </Box>
      <Phone cx={pvCenter.x} cy={pvCenter.y} from={grow - 0.05} to={52.4}
        anim={{
          cx: [[grow, pvCenter.x, E.inOut], [grow + 0.95, 960]],
          cy: [[grow, pvCenter.y, E.inOut], [grow + 0.95, 540]],
          scale: [[grow, k0, E.inOut], [grow + 0.95, 0.5], [51.45, 0.55, E.in], [51.95, 0.36]],
          opacity: [[grow - 0.05, 0, E.out], [grow + 0.12, 1], [51.5, 1, E.in], [51.95, 0]],
        }}
        blur={[[51.45, 0, E.in], [51.95, 16]] as Key[]}>
        <AppScreen from={grow - 0.05} to={52.4} focus={RES.focus} type={RES.type} press={RES.press} result={RES.result} />
        <Touch from={48.35} to={50.3} size={d(30)}
          path={[[48.35, d(250), d(600)], [48.72, SW / 2, APP.edit.y + APP.edit.h / 2], [49.35, SW / 2, d(540)], [49.7, SW / 2, APP.button.y + APP.button.h / 2]]}
          taps={[RES.focus, RES.press]} />
      </Phone>
      {words.map((w, i) => (
        <Word text={w} at={w0 + i * step} until={w0 + (i + 1) * step - 0.12} size={170} spacing={14} color={i === words.length - 1 ? "#C9BEFF" : "#FFFFFF"} />
      ))}
    </G>
  );
}
