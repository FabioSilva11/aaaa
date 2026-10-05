// Scenes 02, 03, start of 04, and 05: one continuous shot of the phone
// running Sketchware IA, under a single camera.
//
//   02  5–12 s   Projects → New Project → editor opens
//   03 12–21 s   widgets dragged in, properties edited
//   04 21–22 s   Event tab → button1 › onClick (the logic panel takes over)
//   05 31–39 s   Run → the app launches → typed name → tap → "Olá, Ana"

import { Camera, E, G, type Shot } from "../lib/core";
import { SH, SW, Touch, Phone, d } from "../lib/ui";
import { FAB, HomeScreen, NewProjectScreen } from "../screens/start";
import { EditorScreen, paletteCenter, tabCenter, widgetCenter, type EditorTimes } from "../screens/editor";
import { APP, AppScreen } from "../screens/app";

/** Phone screen px → world px (phone centred at world 960,540). */
const W = (x: number, y: number): [number, number] => [960 - SW / 2 + x, 540 - SH / 2 + y];

export const ED: EditorTimes = {
  appear: 9.5,
  drag: [12.55, 13.35, 14.15, 14.95],
  drop: [13.15, 13.95, 14.75, 15.55],
  selText: [15.85, 17.75],
  textValue: 16.35, textSize: 16.85, textColor: 17.3,
  selButton: [17.75, 19.0],
  btnText: 18.2, btnBg: 18.6,
  selEdit: [19.0, 20.0],
  hint: 19.4,
  eventTab: 20.95,
  eventTap: 21.85,
  run: 31.6,
  buildEnd: 32.8,
};

export const NP = { open: 6.65, type: 7.55, create: 9.0 };
export const APPT = { launch: 32.9, focus: 33.8, type: 34.0, press: 35.3, result: 35.75 };

const PROP = (i: number): [number, number] => [d(12 + i * 106 + 50), d(650)];

export function PhoneShot() {
  const row = W(d(216), d(247));
  const shots: Shot[] = [
    { t: 4.3, x: 960, y: 540, s: 0.3, r: -9, fx: 1250 },
    { t: 5.7, x: 960, y: 540, s: 0.5, r: 0, fx: 1250, ease: E.out },
    { t: 6.75, x: 960, y: 540, s: 0.5, fx: 1250 },
    { t: 7.35, x: 960, y: W(0, d(356))[1], s: 0.82, fx: 1250 },
    { t: 8.45, x: 960, y: W(0, d(380))[1], s: 0.82, fx: 1250, ease: E.lin },
    { t: 8.95, x: 960, y: W(0, d(560))[1], s: 0.8, fx: 1250 },
    { t: 9.4, x: 960, y: W(0, d(565))[1], s: 0.8, fx: 1250, ease: E.lin },
    { t: 10.1, x: 960, y: 540, s: 0.5, fx: 1250 },
    { t: 11.9, x: 960, y: 540, s: 0.52, fx: 1250, ease: E.lin },
    { t: 12.55, x: W(d(206), 0)[0], y: W(0, d(400))[1], s: 0.86, fx: 1250 },
    { t: 15.6, x: W(d(212), 0)[0], y: W(0, d(410))[1], s: 0.88, fx: 1250, ease: E.lin },
    { t: 16.1, x: 960, y: W(0, d(430))[1], s: 0.74, fx: 1250 },
    { t: 19.9, x: 960, y: W(0, d(440))[1], s: 0.74, fx: 1250, ease: E.lin },
    { t: 20.6, x: 960, y: 540, s: 0.52, fx: 1250 },
    { t: 21.9, x: 960, y: 540, s: 0.53, fx: 1250, ease: E.lin },
    { t: 22.5, x: row[0], y: row[1], s: 1.35, fx: 1250, ease: E.in },
    { t: 30.6, x: row[0], y: row[1], s: 1.35, fx: 1250, ease: E.lin },
    { t: 31.25, x: 960, y: 540, s: 0.52, fx: 1250, ease: E.out },
    { t: 32.95, x: 960, y: 540, s: 0.53, fx: 1250, ease: E.lin },
    { t: 33.6, x: 960, y: W(0, d(370))[1], s: 0.7, fx: 1250 },
    { t: 34.35, x: 960, y: W(0, d(375))[1], s: 0.71, fx: 1250, ease: E.lin },
    { t: 35.0, x: 960, y: 540, s: 0.5, fx: 1400 },
    { t: 38.45, x: 960, y: 540, s: 0.52, fx: 1400, ease: E.lin },
    { t: 39.15, x: 960, y: 540, s: 0.42, fx: -500, r: -6, ease: E.in },
  ];

  // touch paths, screen px
  const fieldA: [number, number] = [d(180), d(275)];
  const create: [number, number] = [SW / 2, d(704)];
  const drags = ED.drag!;
  const drops = ED.drop!;
  const labels = ["ImageView", "TextView", "EditText", "Button"];
  const keys = ["image", "text", "edit", "button"] as const;
  const designPath: [number, number, number][] = [[12.2, d(150), d(520)]];
  drags.forEach((t0, i) => {
    const [px, py] = paletteCenter(labels[i]!);
    const [wx, wy] = widgetCenter(keys[i]!);
    designPath.push([t0, px, py], [drops[i]!, wx, wy]);
  });
  const [tx, ty] = widgetCenter("text");
  const [bx, by] = widgetCenter("button");
  const [ex, ey] = widgetCenter("edit");
  designPath.push(
    [ED.selText![0] - 0.02, tx, ty],
    [ED.textValue! - 0.05, ...PROP(0)], [ED.textSize! - 0.05, ...PROP(1)], [ED.textColor! - 0.05, ...PROP(2)],
    [ED.selButton![0] - 0.02, bx, by],
    [ED.btnText! - 0.05, ...PROP(0)], [ED.btnBg! - 0.05, ...PROP(1)],
    [ED.selEdit![0] - 0.02, ex, ey],
    [ED.hint! - 0.05, ...PROP(0)],
    [20.1, d(240), d(520)],
  );
  const designTaps = [
    ...drags.map((t) => t + 0.02),
    ED.selText![0], ED.textValue!, ED.textSize!, ED.textColor!,
    ED.selButton![0], ED.btnText!, ED.btnBg!,
    ED.selEdit![0], ED.hint!,
  ];
  const [evx, evy] = tabCenter(1);

  return (
    <Camera from={4.2} to={39.3} shots={shots} drift={4}>
      <Phone cx={960} cy={540} from={4.2} to={39.3}
        anim={{ opacity: [[4.3, 0, E.out], [4.9, 1], [22.15, 1, E.in], [22.55, 0], [30.6, 0, E.out], [31.0, 1]] }}>
        <HomeScreen from={4.2} to={7.3} tap={6.5} />
        <NewProjectScreen from={6.6} to={9.9} open={NP.open} type={NP.type} create={NP.create} />
        <G from={9.35} to={34.0} anim={{ offsetX: [[9.35, SW, E.std], [9.85, 0]] }}>
          <EditorScreen from={9.35} to={34.0} t={ED} />
        </G>
        <AppScreen from={32.85} to={39.3} launch={APPT.launch} focus={APPT.focus} type={APPT.type} press={APPT.press} result={APPT.result} />

        {/* the user's finger */}
        <Touch from={5.9} to={9.35} size={d(30)}
          path={[[5.9, d(290), d(760)], [6.42, FAB.cx, FAB.cy], [6.95, d(250), d(420)], [7.22, ...fieldA], [8.55, ...fieldA], [8.92, ...create]]}
          taps={[6.5, 7.25, NP.create]} />
        <Touch from={12.2} to={20.3} size={d(26)} path={designPath} taps={designTaps} />
        <Touch from={20.55} to={22.1} size={d(26)}
          path={[[20.55, d(250), d(300)], [20.9, evx, evy], [21.45, d(200), d(300)], [21.8, d(200), d(247)]]}
          taps={[ED.eventTab!, ED.eventTap!]} />
        <Touch from={31.2} to={32.0} size={d(26)} path={[[31.2, d(220), d(600)], [31.55, d(266), d(732)]]} taps={[ED.run!]} />
        <Touch from={33.45} to={35.7} size={d(30)}
          path={[[33.45, d(250), d(560)], [33.78, SW / 2, APP.edit.y + APP.edit.h / 2], [34.6, SW / 2, d(520)], [35.25, SW / 2, APP.button.y + APP.button.h / 2]]}
          taps={[APPT.focus, APPT.press]} />
      </Phone>
    </Camera>
  );
}
