// Scenes 02–05 cut from the REAL Sketchware IA: the user's New Project
// screenshot, the screen recording (assets/footage, source times in seconds
// of the recording) and the built app, recreated because the recording ends
// at the build. Shot list: production/footage/edit-plan.json (judge-panel
// EDL, every source point checked frame by frame).
//
//   02  4.3–12     New Project form → Create → the real editor → drag Linear(H)
//   03  12–21      linear1 drops · Edit Properties · Height = match_parent ·
//                  Gravity center_horizontal + center_vertical · TextView lands centred
//   04  21–30.55   Event › onCreate · block palette · View › setText · Select widget ·
//                  snap · Syntax OK · type "Olá mundo" · Save
//   05  30.55–38.85  Run (on the music break) · the real build steps · the app launches
//
// One RealPhone (screen 864×1684 source px — always cut above the test ad)
// under one Camera; detail beats lift a region of the same footage into an
// AnimWindow. Source frames that show the test ad, the screenshot popup, the
// system dialog or app freezes are never used.

import { Box, Camera, E, G, R, T, sample, type Key, type Shot } from "../lib/core";
import { AnimWindow, RealPhone, Screen, ScreenStill, TapPulse, windowPoint, type Geo, type Seg, SCREEN_H, SRC_W } from "../lib/footage";
import { RealApp } from "../screens/realapp";

/** Camera shot on a screen point (sx, sy) of the phone at zoom s, landing at frame x fx. */
const P = (t: number, sx: number, sy: number, s: number, fx: number, ease?: string, r?: number): Shot =>
  ({ t, x: 528 + sx, y: -302 + sy, s, fx, ease, r });
const HOME = (t: number, ease?: string) => P(t, 432, 842, 0.58, 1320, ease);

export const SHOTS: Shot[] = [
  P(4.3, 432, 842, 0.3, 1320, undefined, -9),
  P(5.0, 432, 842, 0.58, 1320, E.out, 0),
  P(6.0, 432, 842, 0.58, 1320, E.lin),
  P(6.4, 432, 470, 1.3, 1340),
  P(7.0, 432, 470, 1.33, 1340, E.lin),
  P(7.4, 432, 1260, 1.05, 1320),
  P(8.05, 432, 1260, 1.05, 1320, E.lin),
  P(8.5, 432, 842, 0.62, 960),
  P(9.0, 432, 842, 0.62, 960, E.lin),
  P(9.35, 432, 402, 1.25, 960),
  P(10.0, 432, 402, 1.25, 960, E.lin),
  P(10.4, 300, 640, 1.2, 960),
  P(11.0, 300, 640, 1.2, 960, E.lin),
  P(11.85, 420, 660, 1.3, 960, E.lin),
  P(12.12, 420, 660, 1.36, 960, E.out),
  HOME(12.5),
  HOME(13.12, E.lin),
  P(13.3, 431, 952, 1.25, 1320),
  P(14.05, 431, 952, 1.25, 1320, E.lin),
  HOME(14.34),
  HOME(15.0, E.lin),
  P(15.2, 559, 1000, 0.68, 1320, E.out),
  P(15.49, 559, 1000, 0.68, 1320, E.lin),
  P(15.5, 431, 952, 0.92, 960, E.lin),
  P(17.25, 431, 952, 0.98, 960, E.lin),
  P(17.3, 431, 952, 0.98, 960, E.lin),
  P(17.6, 432, 1000, 0.98, 960),
  P(17.74, 432, 1000, 0.98, 960, E.lin),
  P(17.75, 432, 900, 0.8, 960, E.lin),
  P(18.6, 432, 900, 0.8, 960, E.lin),
  P(19.0, 559, 1044, 1.35, 960),
  P(19.1, 559, 1044, 1.42, 960, E.out),
  P(19.5, 559, 1044, 1.35, 960),
  P(20.0, 559, 1044, 1.35, 960, E.lin),
  P(20.4, 432, 842, 0.8, 960),
  P(21.0, 432, 842, 0.8, 960, E.lin),
  P(21.35, 432, 560, 1.0, 1320),
  P(22.2, 432, 560, 1.0, 1320, E.lin),
  P(22.45, 640, 1412, 1.6, 1340, E.in),
  P(30.54, 640, 1412, 1.6, 1340, E.lin),
  P(30.55, 432, 842, 0.58, 1560, E.lin),
  HOME(30.85, E.out),
  HOME(35.0, E.lin),
  P(35.6, 432, 842, 0.62, 1340, E.out),
  P(36.0, 432, 842, 0.62, 1340, E.lin),
  P(36.35, 432, 952, 1.27, 1340),
  P(37.5, 432, 952, 1.27, 1340, E.lin),
  P(37.9, 432, 842, 0.58, 1340),
  P(38.55, 432, 842, 0.58, 1340, E.lin),
  P(39.0, 432, 842, 0.42, -500, E.in, -6),
];

/** The phone screen's footage cut list (absolute timeline, source seconds). */
const CUTS: { from: number; to: number; sourceIn: number; speed: number }[] = [
  { from: 11.0, to: 11.34, sourceIn: 1.9, speed: 1 },
  { from: 11.34, to: 11.82, sourceIn: 2.367, speed: 1 },
  { from: 11.82, to: 12.5, sourceIn: 4.36, speed: 1 },
  { from: 12.5, to: 13.0, sourceIn: 7.78, speed: 1.04 },
  { from: 13.0, to: 13.46, sourceIn: 11.3, speed: 1.739 },
  { from: 13.46, to: 14.34, sourceIn: 12.7, speed: 1.25 },
  { from: 14.34, to: 15.5, sourceIn: 14.99, speed: 1 },
  { from: 15.5, to: 16.5, sourceIn: 28.3, speed: 1.1 },
  { from: 16.5, to: 16.75, sourceIn: 29.4, speed: 1.6 },
  { from: 16.75, to: 17.25, sourceIn: 29.8, speed: 1.2 },
  { from: 17.25, to: 17.75, sourceIn: 30.4, speed: 1.1 },
  { from: 17.75, to: 18.75, sourceIn: 34.6, speed: 1.2 },
  { from: 18.75, to: 19.72, sourceIn: 36.65, speed: 1 },
  // 19.72–20.60: still of 37.40 (identical above y 1684)
  { from: 20.6, to: 21.08, sourceIn: 37.62, speed: 1 },
  { from: 21.08, to: 21.5, sourceIn: 38.1, speed: 1.19 },
  { from: 21.5, to: 21.85, sourceIn: 38.6, speed: 1 },
  // 21.85–22.45: recreated activity slide (below)
  // 22.45–30.55: phone hidden, the logic editor runs in the window
  { from: 30.55, to: 31.5, sourceIn: 78.02, speed: 1 },
  { from: 31.5, to: 32.0, sourceIn: 84.38, speed: 1 },
  { from: 32.0, to: 32.5, sourceIn: 85.04, speed: 1.3 },
  { from: 32.5, to: 33.0, sourceIn: 86.68, speed: 1.44 },
  { from: 33.0, to: 33.5, sourceIn: 87.4, speed: 2 },
  { from: 33.5, to: 34.0, sourceIn: 94.62, speed: 2.2 },
  { from: 34.0, to: 34.75, sourceIn: 110.02, speed: 1.6 },
  { from: 34.75, to: 35.45, sourceIn: 140.85, speed: 1 },
];

// ---------------------------------------------------------------------------

export function RealShot() {
  return (
    <Camera from={4.25} to={39.1} shots={SHOTS} drift={4}>
      <RealPhone cx={960} cy={540} from={4.25} to={39.1}
        anim={{ opacity: [[4.3, 0, E.out], [4.55, 1], [22.4, 1, E.in], [22.45, 0], [30.55, 0, E.out], [30.85, 1]] }}
        blur={[[22.25, 0, E.in], [22.45, 8], [30.55, 0], [30.85, 0, E.out], [31.05, 4], [34.85, 4, E.out], [35.0, 0]]}>
        <PhoneContent />
      </RealPhone>
    </Camera>
  );
}

function PhoneContent() {
  return (
    <>
      {/* 02 · the New Project form (screenshot, test ad sliced out) */}
      <G from={4.25} to={8.42} anim={{ offsetX: [[8.05, 0, E.std], [8.4, -216]] }}>
        <ScreenStill from={4.25} to={8.42} src="assets/screens/new-project-clean.jpg" />
        <R x={0} y={0} w={SRC_W} h={SCREEN_H} fill="#000000" opacity={0} anim={{ opacity: [[8.05, 0, E.std], [8.4, 0.35]] }} />
      </G>
      {/* Create: show-touches dot, press, pulse (the screenshot has no touch) */}
      <R x={450} y={1540} w={379} h={84} r={42} fill="#000000" opacity={0} from={7.95} to={8.15} anim={{ opacity: [[7.95, 0, E.out], [8.0, 0.12], [8.1, 0.12, E.in], [8.15, 0]] }} />
      <Box cx={640} cy={1582} w={72} h={72} from={7.9} to={8.3}
        anim={{ scale: [[7.92, 0.6, E.out], [8.0, 1]], opacity: [[7.92, 0, E.out], [7.98, 1], [8.1, 1, E.in], [8.25, 0]] }}>
        <R x={0} y={0} w={72} h={72} r={36} fill="#FFFFFF" opacity={0.5} stroke={{ color: "#9E9E9E", width: 2, opacity: 0.6 }} />
      </Box>
      <TapPulse x={640} y={1582} t={8.0} size={150} color="#FFFFFF" />

      {/* the real editor opens like an activity: slides in over the form */}
      <G from={8.05} to={11.0} anim={{ offsetX: [[8.05, SRC_W, E.std], [8.4, 0]] }}>
        <R x={-24} y={0} w={24} h={SCREEN_H} fill={{ stops: [[0, "#000000", 0], [1, "#000000", 0.25]] }} />
        <Screen from={8.05} to={11.0} sourceIn={0} speed={0.644} />
      </G>

      {/* the recording, cut on the beat */}
      {CUTS.map((c) => <Screen from={c.from} to={c.to} sourceIn={c.sourceIn} speed={c.speed} />)}
      <ScreenStill from={19.72} to={20.6} src="assets/stills/s_37.40_design-textview.png" full />

      {/* the TextView lands centred: highlight ring + centre guides */}
      <Box cx={559.5} cy={1044.5} w={95} h={57} from={18.98} to={19.95}
        anim={{ scale: [[19.0, 1.5, E.out], [19.35, 1]], opacity: [[19.0, 0, E.out], [19.08, 1], [19.55, 1, E.in], [19.9, 0]] }}>
        <R x={0} y={0} w={95} h={57} r={8} fill="none" stroke={{ color: "#B9AEFF", width: 3 }} />
      </Box>
      <G from={19.0} to={19.98} anim={{ opacity: [[19.0, 0, E.out], [19.1, 0.7], [19.7, 0.7, E.in], [19.95, 0]] }}>
        <R x={559.5 - 1} y={496} w={2} h={961} fill="#B9AEFF">
          <rect clipPath x={0} y={1044.5 - 496} width={2} height={0}>
            <keyframeTrack property="y">
              <keyframe time={0.02} value={1044.5 - 496} easing={E.out} />
              <keyframe time={0.3} value={0} />
            </keyframeTrack>
            <keyframeTrack property="height">
              <keyframe time={0.02} value={0} easing={E.out} />
              <keyframe time={0.3} value={961} />
            </keyframeTrack>
          </rect>
        </R>
        <R x={281} y={1044.5 - 1} w={556} h={2} fill="#B9AEFF">
          <rect clipPath x={559.5 - 281} y={0} width={0} height={2}>
            <keyframeTrack property="x">
              <keyframe time={0.02} value={559.5 - 281} easing={E.out} />
              <keyframe time={0.3} value={0} />
            </keyframeTrack>
            <keyframeTrack property="width">
              <keyframe time={0.02} value={0} easing={E.out} />
              <keyframe time={0.3} value={556} />
            </keyframeTrack>
          </rect>
        </R>
      </G>

      {/* Event › onCreate → the logic editor slides in (recreated; the real
          transition shows a "Now Loading" scrim) */}
      <G from={21.85} to={22.5} anim={{ offsetX: [[21.85, 0, E.std], [22.2, -216]] }}>
        <ScreenStill from={21.85} to={22.5} src="assets/stills/s_38.95.png" full />
        <R x={0} y={0} w={SRC_W} h={SCREEN_H} fill="#000000" opacity={0} anim={{ opacity: [[21.85, 0, E.std], [22.2, 0.3]] }} />
      </G>
      <G from={21.85} to={22.5} anim={{ offsetX: [[21.85, SRC_W, E.std], [22.2, 0]] }}>
        <R x={-24} y={0} w={24} h={SCREEN_H} fill={{ stops: [[0, "#000000", 0], [1, "#000000", 0.25]] }} />
        <Screen from={21.85} to={22.5} sourceIn={40.5} speed={0.5} />
      </G>

      {/* 05 · dim under the build window */}
      <R x={0} y={0} w={SRC_W} h={SCREEN_H} fill="#000000" opacity={0} from={30.8} to={35.05}
        anim={{ opacity: [[30.85, 0, E.out], [31.05, 0.45], [34.85, 0.45, E.out], [35.0, 0]] }} />

      {/* the app launches from the real Run button */}
      <G from={35.0} to={39.1}>
        <R x={0} y={0} w={SRC_W} h={SCREEN_H} fill="#FFFFFF" />
        <G anim={{ opacity: [[35.08, 0, E.out], [35.25, 1]] }}>
          <RealApp from={35.0} to={39.1} bump={[36.5]} />
        </G>
        <R x={0} y={0} w={SRC_W} h={SCREEN_H} fill="#6B5CE7" anim={{ opacity: [[35.0, 1, E.out], [35.15, 0]] }} />
        <rect clipPath x={530} y={1584} width={316} height={84} cornerRadius={42}>
          <keyframeTrack property="x"><keyframe time={0} value={530} easing={E.out} /><keyframe time={0.4} value={0} /></keyframeTrack>
          <keyframeTrack property="y"><keyframe time={0} value={1584} easing={E.out} /><keyframe time={0.4} value={0} /></keyframeTrack>
          <keyframeTrack property="width"><keyframe time={0} value={316} easing={E.out} /><keyframe time={0.4} value={SRC_W} /></keyframeTrack>
          <keyframeTrack property="height"><keyframe time={0} value={84} easing={E.out} /><keyframe time={0.4} value={SCREEN_H} /></keyframeTrack>
          <keyframeTrack property="cornerRadius"><keyframe time={0} value={42} easing={E.out} /><keyframe time={0.4} value={96} /></keyframeTrack>
        </rect>
      </G>
    </>
  );
}

// ---------------------------------------------------------------------------
// 04 · the logic editor, lifted out of the footage into one window that
// re-frames itself beat by beat; it ends parked as the program card (BC).

const C1 = (x: number, y: number, w: number, h: number) => ({ x, y, w, h });
const PAL = C1(0, 1150, 864, 670);
const DRAG = C1(0, 640, 864, 1180);
const DLG = C1(60, 683, 744, 539);
const SNAP = C1(0, 86, 864, 900);
const STACK = C1(0, 200, 440, 200);
const TYPE = C1(60, 426, 744, 441);

export const LW_GEO: Geo[] = [
  { t: 22.45, crop: PAL, k: 1.6, cx: 1340, cy: 540 },
  { t: 22.7, crop: PAL, k: 1.2, cx: 1340, cy: 540, ease: E.out },
  { t: 23.7, crop: PAL, k: 1.2, cx: 1340, cy: 540 },
  { t: 24.1, crop: PAL, k: 1.45, cx: 960, cy: 540 },
  { t: 25.0, crop: PAL, k: 1.45, cx: 960, cy: 540 },
  { t: 25.35, crop: DRAG, k: 0.86, cx: 960, cy: 540 },
  { t: 25.75, crop: DRAG, k: 0.86, cx: 960, cy: 540 },
  { t: 26.0, crop: DLG, k: 1.5, cx: 960, cy: 540 },
  { t: 26.8, crop: DLG, k: 1.5, cx: 960, cy: 540 },
  { t: 27.05, crop: SNAP, k: 1.1, cx: 960, cy: 540 },
  { t: 27.54, crop: SNAP, k: 1.1, cx: 960, cy: 540 },
  { t: 27.8, crop: STACK, k: 2.8, cx: 960, cy: 540, ease: E.out },
  { t: 28.0, crop: STACK, k: 2.8, cx: 960, cy: 540 },
  { t: 28.4999, crop: STACK, k: 2.86, cx: 960, cy: 540, ease: E.lin },
  { t: 28.5, crop: TYPE, k: 1.68, cx: 960, cy: 540, ease: "cut" },
  { t: 28.66, crop: TYPE, k: 1.6, cx: 960, cy: 540, ease: E.out },
  { t: 29.9599, crop: TYPE, k: 1.6, cx: 960, cy: 540 },
  { t: 29.96, crop: STACK, k: 2.8, cx: 960, cy: 540, ease: "cut" },
  { t: 30.55, crop: STACK, k: 2.9, cx: 960, cy: 540, ease: E.lin },
  { t: 30.9, crop: STACK, k: 1.6, cx: 400, cy: 840 },
  { t: 38.55, crop: STACK, k: 1.6, cx: 400, cy: 840 },
];

const LW_SEGS: Seg[] = [
  { from: 22.45, to: 23.0, sourceIn: 40.95 },
  { from: 23.0, to: 23.25, sourceIn: 42.2 },
  { from: 23.25, to: 23.4, sourceIn: 44.4 },
  { from: 23.4, to: 23.7, sourceIn: 45.62 },
  { from: 23.7, to: 24.5, sourceIn: 46.15, speed: 4.375 },
  { from: 24.5, to: 25.0, sourceIn: 49.65, speed: 1.5 },
  { from: 25.0, to: 25.75, sourceIn: 50.433, speed: 1.156 },
  { from: 25.75, to: 26.0, sourceIn: 51.5 },
  { from: 26.0, to: 26.5, sourceIn: 52.25, speed: 2.7 },
  { from: 26.5, to: 26.8, sourceIn: 53.6 },
  { from: 26.8, to: 27.54, sourceIn: 54.3, speed: 1.2857 },
  { from: 27.54, to: 28.0, sourceIn: 55.44 },
  { from: 28.0, to: 28.5, still: "assets/stills/s_55.90.png" },
  { from: 28.5, to: 29.7, sourceIn: 60.8, speed: 2.4167 },
  { from: 29.7, to: 29.96, sourceIn: 64.17 },
  { from: 29.96, to: 30.55, sourceIn: 64.8 },
  { from: 30.55, to: 38.95, still: "assets/stills/s_66.20_blocks-final.png" },
];

/** Source px of the "Olá mundo" slot in the finished block (measured on s_66.20). */
const SLOT = { x0: 290, y0: 333, x1: 386, y1: 361 };

export function LogicWindow() {
  const pt = (t: number, x: number, y: number) => windowPoint(LW_GEO, t, x, y);
  // Select widget: highlight behind "TextView : textview2"
  const [hx0, hy0] = pt(26.2, 100, 970), [hx1, hy1] = pt(26.2, 500, 1031);
  // snap flash over the stack
  const [fx0, fy0] = pt(27.5, 17, 222), [fx1, fy1] = pt(27.5, 394, 330);
  // window rect for the sheen
  const [sx0, sy0] = pt(30.2, 0, 200), [sx1, sy1] = pt(30.2, 440, 400);
  // the slot while parked
  const [bx0, by0] = pt(36, SLOT.x0, SLOT.y0), [bx1, by1] = pt(36, SLOT.x1, SLOT.y1);
  return (
    <AnimWindow from={22.45} to={38.95} geo={LW_GEO} segs={LW_SEGS}
      blur={[[22.45, 8, E.out], [22.7, 0]]}
      anim={{ offsetX: [[38.55, 0, E.in], [38.95, -900]], opacity: [[38.55, 1, E.in], [38.95, 0]] }}>
      <R x={hx0} y={hy0} w={hx1 - hx0} h={hy1 - hy0} r={14} fill="#6B5CE7" opacity={0} from={26.15} to={26.55}
        anim={{ opacity: [[26.15, 0, E.out], [26.22, 0.14], [26.45, 0.14, E.in], [26.55, 0]] }} />
      <R x={hx0} y={hy0} w={hx1 - hx0} h={hy1 - hy0} r={14} fill="none" stroke={{ color: "#8B6CFF", width: 2, opacity: 0.55 }} from={26.15} to={26.55}
        anim={{ opacity: [[26.15, 0, E.out], [26.22, 1], [26.45, 1, E.in], [26.55, 0]] }} />
      <R x={fx0} y={fy0} w={fx1 - fx0} h={fy1 - fy0} r={10} fill="#FFFFFF" opacity={0} from={27.5} to={27.65}
        anim={{ opacity: [[27.5, 0.25, E.out], [27.62, 0]] }} />
      {/* sheen across the finished program */}
      <G from={30.05} to={30.47}>
        <R x={sx0 - 160} y={sy0} w={160} h={sy1 - sy0} blend="screen" fill={{ stops: [[0, "#FFFFFF", 0], [0.5, "#FFFFFF", 0.3], [1, "#FFFFFF", 0]] }}
          anim={{ x: [[30.05, sx0 - 160, E.inOut], [30.45, sx1]] }} />
        <rect clipPath x={sx0} y={sy0} width={sx1 - sx0} height={sy1 - sy0} cornerRadius={28} />
      </G>
      {/* BC's text slot outlined while the link pulse leaves it */}
      <R x={bx0 - 4} y={by0 - 4} w={bx1 - bx0 + 8} h={by1 - by0 + 8} r={8} fill="none" stroke={{ color: "#B9AEFF", width: 2.5 }} opacity={0} from={35.95} to={36.65}
        anim={{ opacity: [[35.95, 0, E.out], [36.05, 1], [36.4, 1, E.in], [36.6, 0]] }} />
    </AnimWindow>
  );
}

// ---------------------------------------------------------------------------
// 05 · the build window (BW): the real build strip, step per beat.

const STRIP = C1(0, 1476, 864, 208);
const BW_GEO: Geo[] = [
  { t: 30.75, crop: STRIP, k: 0.58, cx: 1320, cy: 968, op: 0 },
  { t: 30.95, crop: STRIP, k: 1.25, cx: 1320, cy: 860, op: 1, ease: E.back },
  { t: 32.5, crop: STRIP, k: 1.25, cx: 1320, cy: 860 },
  { t: 33.0, crop: STRIP, k: 1.28, cx: 1320, cy: 860, ease: E.lin },
  { t: 33.2, crop: STRIP, k: 1.25, cx: 1320, cy: 860, ease: E.out },
  { t: 34.85, crop: STRIP, k: 1.25, cx: 1320, cy: 860 },
  { t: 35.0, crop: STRIP, k: 0.58, cx: 1320, cy: 968, op: 0, ease: E.in },
];
const BW_SEGS: Seg[] = [
  { from: 30.75, to: 31.5, sourceIn: 78.22 },
  { from: 31.5, to: 32.0, sourceIn: 84.38 },
  { from: 32.0, to: 32.5, sourceIn: 85.04, speed: 1.3 },
  { from: 32.5, to: 33.0, sourceIn: 86.68, speed: 1.44 },
  { from: 33.0, to: 33.5, sourceIn: 87.4, speed: 2 },
  { from: 33.5, to: 34.0, sourceIn: 94.62, speed: 2.2 },
  { from: 34.0, to: 34.75, sourceIn: 110.02, speed: 1.6 },
  { from: 34.75, to: 35.0, sourceIn: 140.85 },
];

export function BuildWindow() {
  return <AnimWindow from={30.75} to={35.02} geo={BW_GEO} segs={BW_SEGS} r={24} />;
}

// ---------------------------------------------------------------------------
// 05 · link pulse: the program's text slot → "Olá mundo" in the running app.

export function LinkPulse() {
  const [ax, ay] = windowPoint(LW_GEO, 36, (SLOT.x0 + SLOT.x1) / 2, (SLOT.y0 + SLOT.y1) / 2);
  const bx = 1340, by = 540; // the app text at the 36.35 camera shot
  const cx = 950, cy = 380;
  const path = (u: number) => [
    (1 - u) * (1 - u) * ax + 2 * (1 - u) * u * cx + u * u * bx,
    (1 - u) * (1 - u) * ay + 2 * (1 - u) * u * cy + u * u * by,
  ];
  const io = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
  const dot = (lag: number, size: number, op: number) => {
    const t0 = 36.0 + lag, t1 = 36.5 + lag;
    const u = (t: number) => io(Math.min(1, Math.max(0, (t - t0) / (t1 - t0))));
    return (
      <Box cx={ax} cy={ay} w={size} h={size} from={t0} to={t1 + 0.05}
        anim={{
          cx: sample((t) => path(u(t))[0]!, t0, t1, 30),
          cy: sample((t) => path(u(t))[1]!, t0, t1, 30),
          opacity: [[t0, 0, E.out], [t0 + 0.06, op], [t1 - 0.05, op, E.in], [t1 + 0.05, 0]] as Key[],
        }}>
        <R x={0} y={0} w={size} h={size} r={size / 2} fill="#B9AEFF" shadow={{ color: "#B9AEFF", blur: 30, opacity: 0.9 }} />
      </Box>
    );
  };
  return (
    <G from={35.95} to={37.1}>
      {dot(0.06, 6, 0.25)}
      {dot(0.04, 9, 0.45)}
      {dot(0.02, 11, 0.7)}
      {dot(0, 14, 1)}
      <Box cx={bx} cy={by} w={300} h={110} from={36.5} to={37.05}
        anim={{ scale: [[36.5, 0.8, E.out], [37.0, 1.25]], opacity: [[36.5, 0, E.out], [36.56, 1], [37.0, 0]] }}>
        <R x={0} y={0} w={300} h={110} r={55} fill="none" stroke={{ color: "#B9AEFF", width: 4 }} />
      </Box>
    </G>
  );
}
