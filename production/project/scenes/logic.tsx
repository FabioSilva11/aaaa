// Scene 04 (21–31 s): events and blocks. The onClick event tapped on the
// phone opens the logic editor, which grows into a large panel; the
// program is assembled block by block, each snap on a sound, then the
// execution path lights up and the editor reports "Syntax OK".
// Also the program card of scene 05, which ties the tap in the running app
// to the blocks that answer it.

import { E, clamp, easeFn, lerp } from "../lib/core";
import { LogicPanel, PANEL, ProgramCard, buildProgram, type LogicTimes } from "../screens/logic";
import { APPT } from "./phone";

export const LG: LogicTimes = {
  open: 22.2,
  drag: {
    if: [22.95, 23.5],
    gt: [24.05, 24.55],
    len: [24.85, 25.3],
    get1: [25.55, 26.0],
    set: [26.6, 27.1],
    join: [27.35, 27.8],
    get2: [28.25, 28.7],
    toast: [28.95, 29.4],
  },
  fills: { zero: 26.25, ola: 28.0, toast: 29.6 },
  category: [[-100, 2], [24.0, 3], [25.5, 6], [27.3, 3], [28.2, 6], [28.9, 7]],
  flow: 29.95,
  ok: 30.25,
};

const ioc = easeFn(E.inOut);

// Program bounds (canvas coords) → framing. Close on the hat and the if-bar
// while the condition is built, then ease out to frame the whole program,
// centred, before the wide setText block arrives.
const PROG = buildProgram();
const CW = PANEL.w - PANEL.paletteW, CH = PANEL.h - PANEL.bar;
const R0 = Math.max(...PROG.filter((p) => ["hat", "if", "gt", "len", "get1"].includes(p.id)).map((p) => (p.c ? p.x + p.c.topW : p.x + p.w)));
const R1 = Math.max(...PROG.map((p) => p.x + p.w));
const B1 = Math.max(...PROG.map((p) => p.y + p.h));
const L = 48, TOP = 44, M = 46;
const S0 = Math.min(1.6, (CW - 2 * M) / (R0 - L));
const S1 = Math.min(1.35, (CW - 2 * M) / (R1 - L), (CH - 2 * M) / (B1 - TOP));
const OX0 = M - S0 * L, OY0 = M - S0 * TOP;
const OX1 = (CW - S1 * (R1 - L)) / 2 - S1 * L, OY1 = (CH - S1 * (B1 - TOP)) / 2 - S1 * TOP;

function canvasCam(t: number) {
  const k = ioc(clamp((t - 26.1) / (27.0 - 26.1)));
  const k2 = ioc(clamp((t - 29.8) / 1.0));
  const s = lerp(S0, S1, k) * (1 + 0.035 * k2);
  // keep the zoom-in of the flow centred on the program
  const cx = (L + R1) / 2, cy = (TOP + B1) / 2;
  const ox = lerp(OX0, OX1, k), oy = lerp(OY0, OY1, k);
  return { s, ox: ox - (s - lerp(S0, S1, k)) * cx, oy: oy - (s - lerp(S0, S1, k)) * cy };
}

export function LogicScene() {
  const c0 = { x: 1295, y: 374 };
  const c1 = { x: 1200, y: 540 };
  const c2 = { x: 1250, y: 600 };
  const open = 21.95;
  const close = 30.62;
  return (
    <LogicPanel from={open} to={close + 0.6} t={LG} cam={canvasCam} x={c1.x - PANEL.w / 2} y={c1.y - PANEL.h / 2}
      anim={{
        x: [[open, c0.x - PANEL.w / 2, E.inOut], [open + 0.6, c1.x - PANEL.w / 2], [close, c1.x - PANEL.w / 2, E.in], [close + 0.55, c2.x - PANEL.w / 2]],
        y: [[open, c0.y - PANEL.h / 2, E.inOut], [open + 0.6, c1.y - PANEL.h / 2], [close, c1.y - PANEL.h / 2, E.in], [close + 0.55, c2.y - PANEL.h / 2]],
        scale: [[open, 0.2, E.inOut], [open + 0.6, 1], [close, 1, E.in], [close + 0.55, 0.25]],
        opacity: [[open, 0, E.out], [open + 0.15, 1], [close + 0.3, 1, E.in], [close + 0.55, 0]],
      }} />
  );
}

/** Scene 05 overlay: the program next to the running app, lit on the tap. */
export function ConnectCard() {
  const from = 34.45;
  const to = 39.2;
  return (
    <ProgramCard x={546} y={352} scale={0.88} from={from} to={to} run={APPT.press + 0.06}
      anim={{
        offsetX: [[from, -140, E.out], [from + 0.7, 0], [38.6, 0, E.in], [39.15, -900]],
        opacity: [[from, 0, E.out], [from + 0.45, 1], [38.7, 1, E.in], [39.1, 0]],
      }} />
  );
}
