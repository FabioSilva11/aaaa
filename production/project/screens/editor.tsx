// The project editor (DesignActivity): toolbar, the Design / Event /
// Component / Strings tabs, the widget palette, the view preview, the
// property panel and the bottom bar with the file card and the Run split
// button — after res/layout/design.xml and view_editor.xml.
//
// Everything is driven by absolute times in `t`; pass times far in the past
// (or omit them) for a settled, static editor (used in the montage).

import { Box, E, G, Icon, R, T, tw, type Key } from "../lib/core";
import { C, Ripple, StatusBar, SH, SW, d } from "../lib/ui";

export type EditorTimes = {
  /** staggered entrance of the editor chrome */
  appear?: number;
  /** widget drag starts and drops: image, text, edit, button */
  drag?: [number, number, number, number];
  drop?: [number, number, number, number];
  /** selection windows [from, to] */
  selText?: [number, number];
  selButton?: [number, number];
  selEdit?: [number, number];
  /** property edits */
  textValue?: number; textSize?: number; textColor?: number;
  btnText?: number; btnBg?: number;
  hint?: number;
  /** switch to the Event tab, tap on button1 › onClick */
  eventTab?: number;
  eventTap?: number;
  /** Run pressed; build progress until buildEnd */
  run?: number;
  buildEnd?: number;
};

const PAST = -100;
export const PV = { x: 110, y: 148, w: 232, h: 412 };

/** Widget boxes inside the preview (dp, preview-relative). */
export const WIDGET = {
  image: { x: 86, y: 60, w: 60, h: 60 },
  text: { x: 16, y: 132, w: 200, h: 40 },
  edit: { x: 14, y: 182, w: 204, h: 38 },
  button: { x: 14, y: 232, w: 204, h: 40 },
};

/** Screen-px centre of a preview widget. */
export function widgetCenter(k: keyof typeof WIDGET): [number, number] {
  const w = WIDGET[k];
  return [d(PV.x + w.x + w.w / 2), d(PV.y + w.y + w.h / 2)];
}

const PALETTE: { header?: string; icon?: string; label?: string; top: number }[] = [
  { header: "Layouts", top: 138 },
  { icon: "horizontal", label: "LinearLayout (H)", top: 154 },
  { icon: "vertical", label: "LinearLayout (V)", top: 202 },
  { header: "Widgets", top: 252 },
  { icon: "button", label: "Button", top: 268 },
  { icon: "input", label: "EditText", top: 316 },
  { icon: "text", label: "TextView", top: 364 },
  { icon: "image", label: "ImageView", top: 412 },
  { icon: "check_box", label: "CheckBox", top: 460 },
  { icon: "toggle", label: "Switch", top: 508 },
  { icon: "slider", label: "SeekBar", top: 556 },
  { icon: "list", label: "ListView", top: 604 },
  { icon: "chevron", label: "Spinner", top: 652 },
];

/** Screen-px centre of a palette item, by label. */
export function paletteCenter(label: string): [number, number] {
  const it = PALETTE.find((p) => p.label === label)!;
  return [d(46), d(it.top + 20)];
}

const TABS = ["Design", "Event", "Component", "Strings"];
/** Screen-px centre of tab i. */
export function tabCenter(i: number): [number, number] {
  const tab = tabLayout()[i]!;
  return [tab.x + tab.w / 2, d(108)];
}
function tabLayout() {
  let x = d(8);
  return TABS.map((label) => {
    const w = tw(label, d(14), 600) + d(28);
    const tab = { label, x, w, tw: tw(label, d(14), 600) };
    x += w;
    return tab;
  });
}

function stagger(t: number, i: number, dy = 14): { opacity: Key[]; offsetY: Key[] } {
  const s = t + i * 0.06;
  return { opacity: [[s, 0, E.out], [s + 0.35, 1]], offsetY: [[s, d(dy), E.out], [s + 0.5, 0]] };
}

const swap = (t: number, d0 = 0.25): { a: Key[]; b: Key[] } => ({
  a: [[t, 1, E.out], [t + d0, 0]],
  b: [[t, 0, E.out], [t + d0, 1]],
});

export function EditorScreen(p: { from: number; to: number; t?: EditorTimes; offsetX?: Key[] }) {
  const t = p.t ?? {};
  const appear = t.appear ?? PAST;
  const drop = t.drop ?? [PAST, PAST, PAST, PAST];
  const tabs = tabLayout();
  const evTab = t.eventTab ?? 1000;
  const run = t.run ?? 1000;
  const buildEnd = t.buildEnd ?? 1000;

  return (
    <G from={p.from} to={p.to} anim={p.offsetX ? { offsetX: p.offsetX } : undefined}>
      <R x={0} y={0} w={SW} h={SH} fill={C.surface} />
      <StatusBar />
      {/* toolbar */}
      <G anim={stagger(appear, 0)}>
        <Icon name="back" x={d(16)} y={d(46)} size={d(24)} />
        <T x={d(58)} y={d(36)} size={d(20)} weight={600} color={C.onSurface}>OlaApp</T>
        <T x={d(58)} y={d(62)} size={d(12)} color={C.variant}>606</T>
        <Icon name="undo" x={d(244)} y={d(46)} size={d(22)} opacity={0.75} />
        <Icon name="redo" x={d(282)} y={d(46)} size={d(22)} opacity={0.35} />
        <Icon name="more" x={d(318)} y={d(46)} size={d(22)} />
      </G>
      {/* tabs */}
      <G anim={stagger(appear, 1)}>
        {tabs.map((tab, i) => (
          <G>
            <T x={tab.x} y={d(90)} w={tab.w} h={d(36)} align="center" baseline="middle" size={d(14)} weight={600}
              color={i === 0 ? C.primary : C.variant}
              anim={i === 0 ? { opacity: [[evTab, 1, E.std], [evTab + 0.2, 0]] } : undefined}>{tab.label}</T>
            {i === 0 || i === 1 ? (
              <T x={tab.x} y={d(90)} w={tab.w} h={d(36)} align="center" baseline="middle" size={d(14)} weight={600}
                color={i === 0 ? C.variant : C.primary} opacity={0}
                anim={{ opacity: [[evTab, 0, E.std], [evTab + 0.2, 1]] }}>{tab.label}</T>
            ) : null}
          </G>
        ))}
        <R x={tabs[0]!.x + d(14)} y={d(126)} w={tabs[0]!.tw} h={d(3)} r={d(1.5)} fill={C.primary}
          anim={{
            x: [[evTab, tabs[0]!.x + d(14), E.std], [evTab + 0.35, tabs[1]!.x + d(14)]],
            width: [[evTab, tabs[0]!.tw, E.std], [evTab + 0.35, tabs[1]!.tw]],
          }} />
        <R x={0} y={d(129)} w={SW} h={d(1)} fill={C.outline} />
      </G>

      {/* ---------------- Design tab content ---------------- */}
      <G to={evTab + 0.25} anim={{ opacity: [[evTab, 1, E.std], [evTab + 0.25, 0]] }}>
        {/* palette */}
        <G anim={stagger(appear, 2, 0)}>
          <R x={0} y={d(130)} w={d(92)} h={d(574)} fill={C.high} />
          {PALETTE.map((it, i) =>
            it.header ? (
              <T x={d(10)} y={d(it.top)} size={d(10)} weight={700} color={C.variant} spacing={d(0.6)} upper anim={stagger(appear, 3 + i * 0.4, 6)}>{it.header}</T>
            ) : (
              <G anim={stagger(appear, 3 + i * 0.4, 6)}>
                <Icon name={it.icon!} x={d(34)} y={d(it.top + 4)} size={d(24)} />
                <T x={0} y={d(it.top + 30)} w={d(92)} h={d(14)} align="center" baseline="middle" size={d(9.5)} weight={500} color={C.onSurface}>{it.label!}</T>
              </G>
            ),
          )}
        </G>
        {/* canvas + preview */}
        <R x={d(92)} y={d(130)} w={d(268)} h={d(574)} fill="#ECECF2" anim={stagger(appear, 2, 0)} />
        <Box cx={d(PV.x + PV.w / 2)} cy={d(PV.y + PV.h / 2)} w={d(PV.w)} h={d(PV.h)}
          anim={{ scale: [[appear + 0.15, 0.9, E.out], [appear + 0.8, 1]], opacity: [[appear + 0.15, 0, E.out], [appear + 0.5, 1]] }}>
          <Preview t={t} drop={drop} />
        </Box>
        {/* drag ghosts */}
        {(t.drag ?? []).map((t0, i) => {
          const label = ["ImageView", "TextView", "EditText", "Button"][i]!;
          const icon = ["image", "text", "input", "button"][i]!;
          const key = (["image", "text", "edit", "button"] as const)[i]!;
          const [sx, sy] = paletteCenter(label);
          const [ex, ey] = widgetCenter(key);
          const t1 = drop[i]!;
          const w = d(30 + 12) + tw(label, d(13), 600);
          return (
            <Box cx={sx} cy={sy} w={w} h={d(40)} from={t0} to={t1 + 0.2}
              anim={{
                cx: [[t0 + 0.1, sx, E.inOut], [t1, ex]],
                cy: [[t0 + 0.1, sy, E.inOut], [t1, ey]],
                scale: [[t0, 0.7, E.back], [t0 + 0.25, 1.08, E.inOut], [t1 - 0.05, 1, E.in], [t1 + 0.2, 0.7]],
                rotation: [[t0, 0, E.out], [t0 + 0.2, -5, E.inOut], [t1, 0]],
                opacity: [[t0, 0, E.out], [t0 + 0.12, 1], [t1, 1, E.in], [t1 + 0.18, 0]],
              }}>
              <R x={0} y={0} w={w} h={d(40)} r={d(12)} fill={C.container} stroke={{ color: C.primary, width: d(1.5) }} shadow={{ blur: d(14), y: d(6), opacity: 0.25 }} />
              <Icon name={icon} tint="primary" x={d(10)} y={d(9)} size={d(22)} />
              <T x={d(38)} y={0} h={d(40)} baseline="middle" size={d(13)} weight={600} color={C.onSurface}>{label}</T>
            </Box>
          );
        })}
        <PropertyPanel t={t} />
      </G>

      {/* ---------------- Event tab content ---------------- */}
      <G from={evTab}>
        <EventsContent t0={evTab} tap={t.eventTap ?? 1000} />
      </G>

      {/* ---------------- build progress ---------------- */}
      <G from={run + 0.1} to={buildEnd + 0.4} anim={{ offsetY: [[run + 0.1, d(40), E.std], [run + 0.4, 0], [buildEnd + 0.1, 0, E.in], [buildEnd + 0.4, d(40)]] }}>
        <R x={0} y={d(658)} w={SW} h={d(46)} fill={C.container} />
        <R x={0} y={d(658)} w={SW} h={d(1)} fill={C.outline} />
        <T x={d(16)} y={d(666)} size={d(13)} color={C.onSurface}>Building your awesome app...</T>
        <R x={d(16)} y={d(692)} w={d(328)} h={d(4)} r={d(2)} fill={C.primaryContainer} />
        <R x={d(16)} y={d(692)} w={d(4)} h={d(4)} r={d(2)} fill={C.primary}
          anim={{ width: [[run + 0.3, d(4), "cubicBezier(0.3,0.1,0.3,1)"], [buildEnd, d(328)]] }} />
      </G>

      {/* bottom bar */}
      <G anim={stagger(appear, 4)}>
        <R x={0} y={d(704)} w={SW} h={d(56)} fill={C.container} />
        <R x={0} y={d(704)} w={SW} h={d(1)} fill={C.outline} />
        <R x={d(12)} y={d(712)} w={d(150)} h={d(40)} r={d(12)} fill={C.high} />
        <Icon name="phone" x={d(22)} y={d(721)} size={d(22)} />
        <T x={d(52)} y={d(712)} h={d(40)} baseline="middle" size={d(15)} weight={500} color={C.onSurface}>main</T>
        <Icon name="chevron" x={d(132)} y={d(721)} size={d(22)} />
        <R x={d(172)} y={d(712)} w={d(40)} h={d(40)} r={d(20)} fill={C.primaryContainer} />
        <Icon name="layers" tint="primary" x={d(181)} y={d(721)} size={d(22)} />
        <Box cx={d(266)} cy={d(732)} w={d(92)} h={d(40)} anim={{ scale: [[run - 0.06, 1, E.out], [run + 0.04, 0.94, E.out], [run + 0.3, 1]] }}>
          <R x={0} y={0} w={d(92)} h={d(40)} r={d(20)} rtr={d(5)} rbr={d(5)} fill={C.primary} />
          <Icon name="play" tint="white" x={d(16)} y={d(10)} size={d(20)} />
          <T x={d(42)} y={0} h={d(40)} baseline="middle" size={d(15)} weight={600} color="#FFFFFF">Run</T>
          <G>
            <Ripple x={d(46)} y={d(20)} t={run} size={d(160)} />
            <rect clipPath x={0} y={0} width={d(92)} height={d(40)} cornerRadius={d(20)} />
          </G>
        </Box>
        <R x={d(314)} y={d(712)} w={d(36)} h={d(40)} r={d(5)} rtr={d(20)} rbr={d(20)} fill={C.primary} />
        <Icon name="chevron" tint="white" x={d(321)} y={d(721)} size={d(22)} />
      </G>
    </G>
  );
}

/** The app being designed, inside the preview card. */
function Preview(p: { t: EditorTimes; drop: [number, number, number, number] }) {
  const t = p.t;
  const [dImg, dTxt, dEdit, dBtn] = p.drop;
  const W = d(PV.w);
  const pop = (t0: number): Key[] => [[t0, 0.5, E.back], [t0 + 0.45, 1]];
  const show = (t0: number): Key[] => [[t0, 0, E.out], [t0 + 0.15, 1]];
  const tv = t.textValue ?? PAST, ts = t.textSize ?? PAST, tc = t.textColor ?? PAST;
  const bt = t.btnText ?? PAST, bb = t.btnBg ?? PAST, hi = t.hint ?? PAST;
  const box = (k: keyof typeof WIDGET) => WIDGET[k];
  const at = (k: keyof typeof WIDGET) => ({ cx: d(box(k).x + box(k).w / 2), cy: d(box(k).y + box(k).h / 2), w: d(box(k).w), h: d(box(k).h) });
  return (
    <>
      <R x={0} y={0} w={W} h={d(PV.h)} r={d(10)} fill={C.container} shadow={{ blur: d(14), y: d(4), opacity: 0.12 }} />
      <R x={0} y={0} w={W} h={d(12)} r={d(10)} rbl={0} rbr={0} fill={C.primaryDark} />
      <R x={0} y={d(12)} w={W} h={d(36)} fill={C.primary} />
      <T x={d(12)} y={d(12)} h={d(36)} baseline="middle" size={d(13)} weight={600} color="#FFFFFF">Olá App</T>
      {/* ImageView */}
      <Box {...at("image")} from={dImg} anim={{ scale: pop(dImg), opacity: show(dImg) }}>
        <R x={0} y={0} w={d(60)} h={d(60)} r={d(30)} fill={C.primaryContainer} />
        <Icon name="wave" tint="primary" x={d(13)} y={d(13)} size={d(34)} />
      </Box>
      {/* TextView: "TextView" → "Olá!" → 26dp → violet */}
      <Box {...at("text")} from={dTxt} anim={{ scale: pop(dTxt), opacity: show(dTxt) }}>
        <T x={0} y={0} w={d(200)} h={d(40)} align="center" baseline="middle" size={d(14)} color={C.onSurface} to={tv + 0.25} anim={{ opacity: swap(tv).a }}>TextView</T>
        <Box cx={d(100)} cy={d(20)} w={d(200)} h={d(40)} from={tv} anim={{ opacity: swap(tv).b, scale: [[ts, 14 / 26, E.back], [ts + 0.45, 1]] }}>
          <T x={0} y={0} w={d(200)} h={d(40)} align="center" baseline="middle" size={d(26)} weight={800} color={C.onSurface}
            anim={{ color: [[tc, C.onSurface, E.out], [tc + 0.4, C.primary]] }}>Olá!</T>
        </Box>
      </Box>
      {/* EditText */}
      <Box {...at("edit")} from={dEdit} anim={{ scale: pop(dEdit), opacity: show(dEdit) }}>
        <T x={d(4)} y={0} h={d(32)} baseline="middle" size={d(13)} color={C.variant} to={hi + 0.25} anim={{ opacity: swap(hi).a }}>Edit Text</T>
        <T x={d(4)} y={0} h={d(32)} baseline="middle" size={d(13)} color={C.variant} from={hi} anim={{ opacity: swap(hi).b }}>Digite seu nome</T>
        <R x={0} y={d(33)} w={d(204)} h={d(1.5)} fill={C.variant} />
      </Box>
      {/* Button */}
      <Box {...at("button")} from={dBtn} anim={{ scale: pop(dBtn), opacity: show(dBtn) }}>
        <R x={0} y={0} w={d(204)} h={d(40)} r={d(5)} fill="#E0E0E3" shadow={{ blur: d(3), y: d(1), opacity: 0.2 }} />
        <R x={0} y={0} w={d(204)} h={d(40)} r={d(20)} fill={C.primary} opacity={0} anim={{ opacity: [[bb, 0, E.out], [bb + 0.35, 1]], cornerRadius: [[bb, d(5), E.out], [bb + 0.35, d(20)]] }} />
        <T x={0} y={0} w={d(204)} h={d(40)} align="center" baseline="middle" size={d(13)} weight={500} color={C.onSurface} to={bt + 0.25} anim={{ opacity: swap(bt).a }}>Button</T>
        <T x={0} y={0} w={d(204)} h={d(40)} align="center" baseline="middle" size={d(14)} weight={600} color={C.onSurface} from={bt}
          anim={{ opacity: swap(bt).b, color: [[bb, C.onSurface, E.out], [bb + 0.35, "#FFFFFF"]] }}>Saudar</T>
      </Box>
      {/* selection outlines */}
      {([["text", t.selText], ["button", t.selButton], ["edit", t.selEdit]] as const).map(([k, win]) =>
        win ? <Selection k={k} win={win} /> : null,
      )}
    </>
  );
}

function Selection(p: { k: keyof typeof WIDGET; win: [number, number] }) {
  const b = WIDGET[p.k];
  const [a, z] = p.win;
  const pad = d(3);
  const x = d(b.x) - pad, y = d(b.y) - pad, w = d(b.w) + pad * 2, h = d(b.h) + pad * 2;
  const hs = d(6);
  return (
    <G from={a} to={z} anim={{ opacity: [[a, 0, E.out], [a + 0.15, 1], [z - 0.15, 1, E.in], [z, 0]] }}>
      <R x={x} y={y} w={w} h={h} r={d(3)} fill={C.primary} opacity={0.08} />
      <R x={x} y={y} w={w} h={h} r={d(3)} fill="none" stroke={{ color: C.primary, width: d(1.5) }} />
      {[[x, y], [x + w, y], [x, y + h], [x + w, y + h]].map(([hx, hy]) => (
        <R x={hx! - hs / 2} y={hy! - hs / 2} w={hs} h={hs} r={d(1.5)} fill="#FFFFFF" stroke={{ color: C.primary, width: d(1.5) }} />
      ))}
    </G>
  );
}

/** One property card: label over value; value swaps at `change`. */
function PropCard(p: { x: number; label: string; before: string; after?: string; change?: number; swatch?: [string, string]; edit?: [number, number] }) {
  const y = d(612);
  const ch = p.change ?? 1000;
  const [e0, e1] = p.edit ?? [1000, 1001];
  return (
    <G>
      <R x={p.x} y={y} w={d(100)} h={d(76)} r={d(14)} fill={C.high} />
      <R x={p.x} y={y} w={d(100)} h={d(76)} r={d(14)} fill={C.primaryContainer} opacity={0}
        anim={{ opacity: [[e0, 0, E.out], [e0 + 0.15, 1], [e1, 1, E.out], [e1 + 0.3, 0]] }} />
      <R x={p.x} y={y} w={d(100)} h={d(76)} r={d(14)} fill="none" stroke={{ color: C.primary, width: d(1.5) }} opacity={0}
        anim={{ opacity: [[e0, 0, E.out], [e0 + 0.15, 1], [e1, 1, E.out], [e1 + 0.3, 0]] }} />
      <T x={p.x + d(12)} y={y + d(12)} size={d(11)} weight={500} color={C.variant}>{p.label}</T>
      {p.swatch ? (
        <>
          <R x={p.x + d(12)} y={y + d(38)} w={d(18)} h={d(18)} r={d(9)} fill={p.swatch[0]} stroke={{ color: C.outline, width: d(1) }} />
          <R x={p.x + d(12)} y={y + d(38)} w={d(18)} h={d(18)} r={d(9)} fill={p.swatch[1]} opacity={0} anim={{ opacity: [[ch, 0, E.out], [ch + 0.25, 1]] }} />
        </>
      ) : null}
      <T x={p.x + d(p.swatch ? 36 : 12)} y={y + d(36)} size={d(p.swatch ? 11.5 : 14)} weight={600} color={C.onSurface} to={ch + 0.2} anim={{ opacity: [[ch, 1, E.out], [ch + 0.2, 0]] }}>{p.before}</T>
      {p.after ? (
        <T x={p.x + d(p.swatch ? 36 : 12)} y={y + d(36)} size={d(p.swatch ? 11.5 : 14)} weight={600} color={C.primary} from={ch} anim={{ opacity: [[ch, 0, E.out], [ch + 0.25, 1]], offsetY: [[ch, d(6), E.out], [ch + 0.3, 0]] }}>{p.after}</T>
      ) : null}
    </G>
  );
}

function PropertyPanel(p: { t: EditorTimes }) {
  const t = p.t;
  if (!t.selText) return null;
  const open = t.selText[0];
  const close = (t.selEdit ?? t.selButton ?? t.selText)[1];
  const header = (id: string, type: string, icon: string, win: [number, number]) => (
    <G from={win[0]} to={win[1]} anim={{ opacity: [[win[0], 0, E.out], [win[0] + 0.2, 1], [win[1] - 0.2, 1, E.in], [win[1], 0]] }}>
      <R x={d(12)} y={d(578)} w={d(30)} h={d(26)} r={d(8)} fill={C.primaryContainer} />
      <Icon name={icon} tint="primary" x={d(18)} y={d(582)} size={d(18)} />
      <T x={d(50)} y={d(578)} h={d(26)} baseline="middle" size={d(14)} weight={700} color={C.onSurface}>{id}</T>
      <T x={d(50) + tw(id, d(14), 700) + d(8)} y={d(578)} h={d(26)} baseline="middle" size={d(12)} color={C.variant}>{type}</T>
    </G>
  );
  const sTxt = t.selText, sBtn = t.selButton!, sEdt = t.selEdit!;
  return (
    <G from={open} to={close + 0.4} anim={{ offsetY: [[open, d(140), E.std], [open + 0.4, 0], [close, 0, E.in], [close + 0.35, d(140)]] }}>
      <R x={0} y={d(566)} w={SW} h={d(138)} r={d(20)} rbl={0} rbr={0} fill={C.container} shadow={{ blur: d(16), y: d(-4), opacity: 0.12 }} />
      {header("textview1", "TextView", "text", sTxt)}
      <G from={sTxt[0]} to={sTxt[1]} anim={{ opacity: [[sTxt[1] - 0.2, 1, E.in], [sTxt[1], 0]] }}>
        <PropCard x={d(12)} label="text" before="TextView" after="Olá!" change={t.textValue} edit={[t.textValue! - 0.25, t.textValue! + 0.4]} />
        <PropCard x={d(118)} label="textSize" before="14" after="26" change={t.textSize} edit={[t.textSize! - 0.25, t.textSize! + 0.4]} />
        <PropCard x={d(224)} label="textColor" before="#000000" after="#6B5CE7" change={t.textColor} swatch={["#000000", C.primary]} edit={[t.textColor! - 0.25, t.textColor! + 0.4]} />
        <PropCard x={d(330)} label="layout_width" before="match_parent" />
      </G>
      {header("button1", "Button", "button", sBtn)}
      <G from={sBtn[0]} to={sBtn[1]} anim={{ opacity: [[sBtn[0], 0, E.out], [sBtn[0] + 0.2, 1], [sBtn[1] - 0.2, 1, E.in], [sBtn[1], 0]] }}>
        <PropCard x={d(12)} label="text" before="Button" after="Saudar" change={t.btnText} edit={[t.btnText! - 0.25, t.btnText! + 0.4]} />
        <PropCard x={d(118)} label="background" before="#E0E0E3" after="#6B5CE7" change={t.btnBg} swatch={["#E0E0E3", C.primary]} edit={[t.btnBg! - 0.25, t.btnBg! + 0.4]} />
        <PropCard x={d(224)} label="textColor" before="#000000" after="#FFFFFF" change={t.btnBg} swatch={["#000000", "#FFFFFF"]} />
        <PropCard x={d(330)} label="layout_width" before="match_parent" />
      </G>
      {header("edittext1", "EditText", "input", sEdt)}
      <G from={sEdt[0]} to={sEdt[1]} anim={{ opacity: [[sEdt[0], 0, E.out], [sEdt[0] + 0.2, 1], [sEdt[1] - 0.2, 1, E.in], [sEdt[1], 0]] }}>
        <PropCard x={d(12)} label="hint" before="Edit Text" after="Digite seu…" change={t.hint} edit={[t.hint! - 0.25, t.hint! + 0.4]} />
        <PropCard x={d(118)} label="textSize" before="14" />
        <PropCard x={d(224)} label="inputType" before="text" />
        <PropCard x={d(330)} label="lines" before="1" />
      </G>
    </G>
  );
}

/** Event tab: categories rail + the view events of this screen. */
function EventsContent(p: { t0: number; tap: number }) {
  const t0 = p.t0;
  const rail = [
    ["phone", "Activity"],
    ["tap", "View"],
    ["gear", "Component"],
    ["menu", "Drawer"],
    ["blocks", "More Block"],
  ];
  const card = (y: number, id: string, type: string, icon: string, ev: string, evIcon: string, i: number, tap?: number) => (
    <G anim={stagger(t0 + 0.1, i, 10)}>
      <R x={d(84)} y={y} w={d(264)} h={d(116)} r={d(18)} fill={C.container} shadow={{ blur: d(8), y: d(2), opacity: 0.06 }} />
      <R x={d(96)} y={y + d(12)} w={d(34)} h={d(34)} r={d(10)} fill={C.primaryContainer} />
      <Icon name={icon} tint="primary" x={d(102)} y={y + d(18)} size={d(22)} />
      <T x={d(140)} y={y + d(12)} size={d(15)} weight={700} color={C.onSurface}>{id}</T>
      <T x={d(140)} y={y + d(31)} size={d(11)} color={C.variant}>{type}</T>
      <G>
        <R x={d(96)} y={y + d(58)} w={d(240)} h={d(46)} r={d(12)} fill={C.high} />
        <Icon name={evIcon} tint="primary" x={d(108)} y={y + d(69)} size={d(24)} />
        <T x={d(142)} y={y + d(58)} h={d(46)} baseline="middle" size={d(14)} weight={600} color={C.onSurface}>{ev}</T>
        <Icon name="back" tint="gray" x={d(306)} y={y + d(71)} size={d(20)} opacity={0} />
        {tap !== undefined ? (
          <G>
            <Ripple x={d(180)} y={y + d(81)} t={tap} size={d(300)} color={C.primary} />
            <rect clipPath x={d(96)} y={y + d(58)} width={d(240)} height={d(46)} cornerRadius={d(12)} />
          </G>
        ) : null}
      </G>
    </G>
  );
  return (
    <G anim={{ opacity: [[t0, 0, E.std], [t0 + 0.25, 1]] }}>
      <R x={0} y={d(130)} w={SW} h={d(574)} fill={C.surface} />
      <R x={0} y={d(130)} w={d(76)} h={d(574)} fill={C.high} />
      {rail.map(([icon, label], i) => (
        <G>
          {i === 1 ? <R x={d(10)} y={d(146 + i * 64)} w={d(56)} h={d(32)} r={d(16)} fill={C.primaryContainer} /> : null}
          <Icon name={icon!} tint={i === 1 ? "primary" : "gray"} x={d(26)} y={d(150 + i * 64)} size={d(24)} />
          <T x={0} y={d(182 + i * 64)} w={d(76)} h={d(14)} align="center" baseline="middle" size={d(9.5)} weight={600} color={i === 1 ? C.onSurface : C.variant}>{label!}</T>
        </G>
      ))}
      <T x={d(88)} y={d(142)} size={d(12)} weight={700} color={C.variant} spacing={d(0.5)} upper>View events</T>
      {card(d(166), "button1", "Button", "button", "onClick", "tap", 0, p.tap)}
      {card(d(296), "edittext1", "EditText", "input", "onTextChanged", "text", 1)}
      {card(d(426), "imageview1", "ImageView", "image", "onClick", "tap", 2)}
    </G>
  );
}
