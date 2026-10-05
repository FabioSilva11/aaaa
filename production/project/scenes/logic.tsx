// Scene 04 (21–31 s): events and blocks. The onClick event tapped on the
// phone opens the logic editor, which grows into a large panel; the
// program is assembled block by block, each snap on a sound, then the
// execution path lights up and the editor reports "Syntax OK".
// Also the program card of scene 05, which ties the tap in the running app
// to the blocks that answer it.

import { E, clamp, easeFn, lerp } from "../lib/core";
import { LogicPanel, PANEL, ProgramCard, type LogicTimes } from "../screens/logic";
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

/** Canvas camera: starts close on the hat, eases out as the stack grows. */
function canvasCam(t: number) {
  const k = ioc(clamp((t - 22.6) / (27.4 - 22.6)));
  const k2 = ioc(clamp((t - 29.8) / 1.0));
  const s = lerp(1.22, 0.98, k) + 0.04 * k2;
  return { s, ox: lerp(10, 18, k) - 20 * k2, oy: lerp(18, 34, k) - 8 * k2 };
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
    <ProgramCard x={600} y={360} scale={0.52} from={from} to={to} run={APPT.press + 0.06}
      anim={{
        offsetX: [[from, -140, E.out], [from + 0.7, 0], [38.6, 0, E.in], [39.15, -900]],
        opacity: [[from, 0, E.out], [from + 0.45, 1], [38.7, 1, E.in], [39.1, 0]],
      }} />
  );
}
