// The logic editor (LogicEditorActivity) for button1 › onClick, shown as a
// large panel so the blocks are legible. Block texts, categories and colors
// are the app's own: hat "When button1 clicked" (#C88330), Control "if then
// else" (#E1A92A), Operator ">", "length of", "join … and …" (#5CB722), View
// "setText" / "getText" (#4A6CD4), Component "Toast" (#2CA5E2), and the
// palette categories Variable, List, Control, Operator, Math, File, View,
// Component, More Block.
//
// The program assembled in the video:
//
//   When button1 clicked
//     if  (length of (edittext1 getText)) > 0  then
//       textview1 setText (join "Olá, " and (edittext1 getText))
//     else
//       Toast "Digite seu nome"

import type { JSX } from "solid-js";
import { Box, E, G, Icon, R, T, clamp, easeFn, lerp, tw, type Key } from "../lib/core";
import { BLOCK, C } from "../lib/ui";

// ---------------------------------------------------------------------------
// block model + layout

type Part =
  | { k: "label"; text: string }
  | { k: "str" | "num" | "menu"; text: string; fill?: number }
  | { k: "rep"; id: string; color: string; parts: Part[]; bool?: boolean };

type Item =
  | { k: "label"; text: string; x: number; y: number; h: number; fs: number }
  | { k: "slot"; kind: "str" | "num" | "menu"; text: string; x: number; y: number; w: number; h: number; fs: number; color: string; fill?: number }
  | { k: "hole"; x: number; y: number; w: number; h: number; color: string; bool?: boolean; target: string };

export type Piece = {
  id: string; color: string; x: number; y: number; w: number; h: number;
  shape: "hat" | "cmd" | "rep" | "bool" | "c";
  items: Item[];
  /** for the c-block: geometry of the arms */
  c?: { topW: number; topH: number; b1: number; elseW: number; elseH: number; b2: number; bottomH: number; spine: number };
};

const CMD_H = 58;
const fsFor = (h: number) => (h >= 58 ? 21 : h >= 46 ? 19 : h >= 36 ? 17 : 15);
const GAP = 8;

function partW(p: Part, h: number): number {
  const fs = fsFor(h);
  switch (p.k) {
    case "label": return tw(p.text, fs, 600);
    case "str": case "num": return tw(p.text, fs - 1, 500) + 20;
    case "menu": return tw(p.text, fs - 1, 600) + 20 + 16;
    case "rep": return blockW(p.parts, h - 10, 10);
  }
}

function blockW(parts: Part[], h: number, pad: number): number {
  return pad * 2 + parts.reduce((s, p) => s + partW(p, h), 0) + GAP * (parts.length - 1);
}

/** Lays `parts` out in a row of height h at (x, y); nested reporters become pieces of their own. */
function row(parts: Part[], x: number, y: number, h: number, color: string, pad: number, pieces: Piece[]): Item[] {
  const items: Item[] = [];
  const fs = fsFor(h);
  let cx = x + pad;
  for (const p of parts) {
    const w = partW(p, h);
    if (p.k === "label") {
      items.push({ k: "label", text: p.text, x: cx, y, h, fs });
    } else if (p.k === "rep") {
      const rh = h - 10;
      const ry = y + 5;
      items.push({ k: "hole", x: cx, y: ry, w, h: rh, color, bool: p.bool, target: p.id });
      // parent before children: a piece is drawn under what plugs into it
      const piece: Piece = { id: p.id, color: p.color, x: cx, y: ry, w, h: rh, shape: p.bool ? "bool" : "rep", items: [] };
      pieces.push(piece);
      piece.items = row(p.parts, cx, ry, rh, p.color, 10, pieces);
    } else {
      const sh = Math.max(24, h - 14);
      items.push({ k: "slot", kind: p.k, text: p.text, x: cx, y: y + (h - sh) / 2, w, h: sh, fs: fs - 1, color, fill: p.fill });
    }
    cx += w + GAP;
  }
  return items;
}

/** Literal-value fill times (absolute), set by the scene before layout. */
export type LogicTimes = {
  open?: number;
  /** drag start / snap time per piece id */
  drag?: Record<string, [number, number]>;
  fills?: Record<string, number>;
  /** palette category per time: [t, categoryIndex][] */
  category?: [number, number][];
  /** flow highlight start, syntax-ok chip */
  flow?: number;
  ok?: number;
};

export function buildProgram(fills: Record<string, number> = {}) {
  const pieces: Piece[] = [];
  const X = 48, Y = 44;
  // hat
  const hatParts: Part[] = [{ k: "label", text: "When button1 clicked" }];
  const hatW = blockW(hatParts, CMD_H, 16);
  pieces.push({ id: "hat", color: BLOCK.hat, x: X, y: Y, w: hatW, h: CMD_H + 10, shape: "hat", items: row(hatParts, X, Y + 10, CMD_H, BLOCK.hat, 16, pieces) });

  // if … then … else
  const condParts: Part[] = [
    {
      k: "rep", id: "len", color: BLOCK.operator, parts: [
        { k: "label", text: "length of" },
        { k: "rep", id: "get1", color: BLOCK.view, parts: [{ k: "menu", text: "edittext1" }, { k: "label", text: "getText" }] },
      ],
    },
    { k: "label", text: ">" },
    { k: "num", text: "0", fill: fills.zero },
  ];
  const topParts: Part[] = [
    { k: "label", text: "if" },
    { k: "rep", id: "gt", color: BLOCK.operator, bool: true, parts: condParts },
    { k: "label", text: "then" },
  ];
  const cy = Y + CMD_H + 10;
  const topW = blockW(topParts, CMD_H, 16);
  const spine = 24;
  const setParts: Part[] = [
    { k: "menu", text: "textview1" },
    { k: "label", text: "setText" },
    {
      k: "rep", id: "join", color: BLOCK.operator, parts: [
        { k: "label", text: "join" },
        { k: "str", text: "Olá, ", fill: fills.ola },
        { k: "label", text: "and" },
        { k: "rep", id: "get2", color: BLOCK.view, parts: [{ k: "menu", text: "edittext1" }, { k: "label", text: "getText" }] },
      ],
    },
  ];
  const toastParts: Part[] = [{ k: "label", text: "Toast" }, { k: "str", text: "Digite seu nome", fill: fills.toast }];
  const elseH = 44, bottomH = 26;
  const b1 = CMD_H, b2 = CMD_H;
  const cPiece: Piece = {
    id: "if", color: BLOCK.control, x: X, y: cy, w: topW, h: CMD_H + b1 + elseH + b2 + bottomH, shape: "c",
    items: [], c: { topW, topH: CMD_H, b1, elseW: 150, elseH, b2, bottomH, spine },
  };
  pieces.push(cPiece);
  cPiece.items = row(topParts, X, cy, CMD_H, BLOCK.control, 16, pieces);
  cPiece.items.push({ k: "label", text: "else", x: X + 16, y: cy + CMD_H + b1, h: elseH, fs: 20 });

  const sx = X + spine;
  const sy = cy + CMD_H;
  const setW = blockW(setParts, CMD_H, 14);
  pieces.push({ id: "set", color: BLOCK.view, x: sx, y: sy, w: setW, h: CMD_H, shape: "cmd", items: [] });
  const setIdx = pieces.length - 1;
  pieces[setIdx]!.items = row(setParts, sx, sy, CMD_H, BLOCK.view, 14, pieces);

  const ty = cy + CMD_H + b1 + elseH;
  const toastW = blockW(toastParts, CMD_H, 14);
  pieces.push({ id: "toast", color: BLOCK.component, x: sx, y: ty, w: toastW, h: CMD_H, shape: "cmd", items: row(toastParts, sx, ty, CMD_H, BLOCK.component, 14, pieces) });
  return pieces;
}

// ---------------------------------------------------------------------------
// drawing

export function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.round(amt < 0 ? c * (1 + amt) : c + (255 - c) * amt);
  const r = f((n >> 16) & 255), g = f((n >> 8) & 255), b = f(n & 255);
  return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
}

function Items(p: { items: Item[]; dx: number; dy: number; holesUntil?: Record<string, number> }) {
  return (
    <>
      {p.items.map((it) => {
        const x = it.x - p.dx, y = it.y - p.dy;
        if (it.k === "label") return <T x={x} y={y} h={it.h} baseline="middle" size={it.fs} weight={600} color="#FFFFFF">{it.text}</T>;
        if (it.k === "hole") {
          const until = p.holesUntil?.[it.target] ?? 1000;
          return (
            <G to={until + 0.05}>
              <R x={x} y={y} w={it.w} h={it.h} r={it.bool ? 8 : it.h / 2} fill={shade(it.color, -0.28)} />
              <R x={x} y={y} w={it.w} h={it.h} r={it.bool ? 8 : it.h / 2} fill="none" stroke={{ color: "#FFFFFF", width: 2.5 }} opacity={0}
                anim={{ opacity: [[until - 0.45, 0, E.out], [until - 0.25, 0.9], [until, 0.9, E.out], [until + 0.05, 0]] }} />
            </G>
          );
        }
        const fill = it.fill ?? -100;
        const bg = it.kind === "menu" ? shade(it.color, -0.25) : "#FFFFFF";
        const fg = it.kind === "menu" ? "#FFFFFF" : C.onSurface;
        const r = it.kind === "num" ? it.h / 2 : 7;
        return (
          <G>
            <R x={x} y={y} w={it.w} h={it.h} r={r} fill={bg} />
            <T x={x + 10} y={y} h={it.h} baseline="middle" size={it.fs} weight={it.kind === "menu" ? 600 : 500} color={fg}
              from={fill} anim={{ opacity: [[fill, 0, E.out], [fill + 0.2, 1]] }}>{it.text}</T>
            {it.kind === "menu" ? <Icon name="chevron" tint="white" x={x + it.w - 26} y={y + it.h / 2 - 9} size={18} /> : null}
          </G>
        );
      })}
    </>
  );
}

/** One piece drawn at local origin (its own x, y subtracted). */
export function PieceView(p: { piece: Piece; holesUntil?: Record<string, number> }) {
  const pc = p.piece;
  const col = pc.color;
  const edge = shade(col, -0.22);
  const sh = { blur: 8, y: 3, opacity: 0.22 };
  let body: JSX.Element;
  if (pc.shape === "c" && pc.c) {
    const c = pc.c;
    const y1 = c.topH, y2 = c.topH + c.b1, y3 = y2 + c.elseH, y4 = y3 + c.b2;
    body = (
      <>
        <R x={0} y={0} w={c.topW} h={c.topH} r={8} rbl={0} fill={col} stroke={{ color: edge, width: 2 }} shadow={sh} />
        <R x={0} y={y1 - 2} w={c.spine} h={c.b1 + 4} fill={col} />
        <R x={0} y={y2} w={c.elseW} h={c.elseH} r={8} rtl={0} rbl={0} fill={col} stroke={{ color: edge, width: 2 }} />
        <R x={0} y={y3 - 2} w={c.spine} h={c.b2 + 4} fill={col} />
        <R x={0} y={y4} w={c.elseW} h={c.bottomH} r={8} rtl={0} fill={col} stroke={{ color: edge, width: 2 }} shadow={sh} />
        <R x={2} y={y1 - 3} w={c.spine - 2} h={c.b1 + 6} fill={col} />
        <R x={2} y={y3 - 3} w={c.spine - 2} h={c.b2 + 6} fill={col} />
        <R x={1} y={1} w={c.spine} h={y4 + c.bottomH - 2} fill="none" />
        <R x={0} y={0} w={2} h={y4 + c.bottomH} fill={edge} />
        <R x={20} y={0} w={34} h={5} r={2} fill={edge} opacity={0.6} />
      </>
    );
  } else if (pc.shape === "hat") {
    body = (
      <>
        <R x={0} y={0} w={pc.w} h={pc.h} r={20} rbl={8} rbr={8} fill={col} stroke={{ color: edge, width: 2 }} shadow={sh} />
        <R x={0} y={0} w={pc.w} h={10} r={20} rbl={0} rbr={0} fill={shade(col, 0.15)} opacity={0.6} />
      </>
    );
  } else if (pc.shape === "cmd") {
    body = (
      <>
        <R x={0} y={0} w={pc.w} h={pc.h} r={8} fill={col} stroke={{ color: edge, width: 2 }} shadow={sh} />
        <R x={20} y={0} w={34} h={5} r={2} fill={edge} opacity={0.6} />
      </>
    );
  } else {
    body = <R x={0} y={0} w={pc.w} h={pc.h} r={pc.shape === "bool" ? 8 : pc.h / 2} fill={col} stroke={{ color: edge, width: 2 }} />;
  }
  return (
    <>
      {body}
      <Items items={pc.items} dx={pc.x} dy={pc.y} holesUntil={p.holesUntil} />
    </>
  );
}

// ---------------------------------------------------------------------------
// the panel

export const PANEL = { w: 1280, h: 940, bar: 84, paletteW: 350 };
const CANVAS = { x: 0, y: PANEL.bar, w: PANEL.w - PANEL.paletteW, h: PANEL.h - PANEL.bar };
const CATS: [string, string][] = [
  ["Variable", BLOCK.variable], ["List", BLOCK.list], ["Control", BLOCK.control], ["Operator", BLOCK.operator],
  ["Math", BLOCK.math], ["File", BLOCK.file], ["View", BLOCK.view], ["Component", BLOCK.component], ["More Block", BLOCK.moreblock],
];
const CAT_INDEX: Record<string, number> = { control: 2, operator: 3, view: 6, component: 7 };

/** The palette's block list per category: label, shape, and which piece it supplies. */
const PALETTE_BLOCKS: Record<number, { text: string; shape: "cmd" | "rep" | "bool" | "c"; id?: string }[]> = {
  2: [{ text: "if   then", shape: "c" }, { text: "if   then   else", shape: "c", id: "if" }, { text: "repeat  10", shape: "c" }, { text: "forever", shape: "c" }, { text: "stop", shape: "cmd" }],
  3: [{ text: "  >  ", shape: "bool", id: "gt" }, { text: "length of", shape: "rep", id: "len" }, { text: "join   and", shape: "rep", id: "join" }, { text: "  =  ", shape: "bool" }, { text: "not", shape: "bool" }],
  6: [{ text: "setText", shape: "cmd", id: "set" }, { text: "getText", shape: "rep", id: "get1" }, { text: "setEnable", shape: "cmd" }, { text: "setVisible", shape: "cmd" }],
  7: [{ text: "Toast", shape: "cmd", id: "toast" }, { text: "copyToClipboard", shape: "cmd" }, { text: "setTitle", shape: "cmd" }],
};
const PAL_X = PANEL.w - PANEL.paletteW;
const CAT_W = 128;
const LIST_X = PAL_X + CAT_W + 16;
const LIST_Y0 = PANEL.bar + 70;
const LIST_DY = 74;

/** Where the palette shows the block supplying piece `id` (panel coords, centre). */
function paletteSpot(id: string): { x: number; y: number; cat: number } {
  const lookup = id === "get2" ? "get1" : id;
  for (const [cat, list] of Object.entries(PALETTE_BLOCKS)) {
    const i = list.findIndex((b) => b.id === lookup);
    if (i >= 0) return { x: LIST_X + 70, y: LIST_Y0 + i * LIST_DY + 22, cat: Number(cat) };
  }
  return { x: LIST_X + 70, y: LIST_Y0, cat: 2 };
}

/** Canvas camera: content scale/offset over time (panel coords = origin + s·p). */
export type CanvasCam = (t: number) => { s: number; ox: number; oy: number };

export function LogicPanel(p: { from: number; to: number; t: LogicTimes; cam?: CanvasCam; x: number; y: number; anim?: Record<string, Key[]>; static?: boolean }) {
  const t = p.t;
  const pieces = buildProgram(t.fills ?? {});
  const drag = t.drag ?? {};
  const cam: CanvasCam = p.cam ?? (() => ({ s: 1, ox: 0, oy: 0 }));
  const snapOf = (id: string) => (drag[id]?.[1] ?? -100);
  const holesUntil: Record<string, number> = {};
  for (const pc of pieces) holesUntil[pc.id] = snapOf(pc.id);
  const flow = t.flow ?? 1000;
  const flowOrder = ["hat", "if", "gt", "len", "get1", "set", "join", "get2"];

  // The canvas camera is applied to each piece (position + scale keys
  // sampled from `cam`) rather than through a big camera group, so the
  // panel's own box — and so its scale pivot — never changes.
  const toPanel = (tt: number, x: number, y: number) => {
    const c = cam(tt);
    return { x: c.ox + c.s * x, y: CANVAS.y + c.oy + c.s * y, s: c.s };
  };
  const popOf = (tt: number, snap: number) => {
    const k = clamp((tt - snap) / 0.3);
    return lerp(1.05, 1, easeFn(E.out)(k));
  };
  const timesFor = (snap: number): number[] => {
    const a = Math.max(p.from, snap);
    if (!p.cam) return [a, p.to];
    const out: number[] = [];
    for (let tt = a; tt < p.to; tt += 0.1) out.push(tt);
    for (const dt of [0.03, 0.07, 0.12, 0.18, 0.24, 0.3]) if (snap + dt > a && snap + dt < p.to) out.push(snap + dt);
    out.push(p.to);
    return out.sort((x, y) => x - y);
  };
  const cats = t.category ?? [[-100, 2]];
  const catAt = (i: number) => cats[i]!;

  return (
    <G from={p.from} to={p.to} x={p.x} y={p.y} anim={p.anim} bounds={[0, 0, PANEL.w, PANEL.h]}>
      <R x={0} y={0} w={PANEL.w} h={PANEL.h} r={34} fill="#F4F4F8" shadow={{ blur: 80, y: 40, opacity: 0.5 }} />
      {/* canvas: dot grid + the program, clipped to the canvas */}
      <G>
        {Array.from({ length: 21 * 20 }, (_, i) => {
          const gx = 22 + (i % 21) * 44, gy = CANVAS.y + 22 + Math.floor(i / 21) * 44;
          return <R x={gx} y={gy} w={4} h={4} r={2} fill="#D9D9E3" />;
        })}
        {pieces.map((pc) => {
          const snap = snapOf(pc.id);
          const flowAt = flow + Math.max(0, flowOrder.indexOf(pc.id)) * 0.09;
          const times = timesFor(snap);
          const fw = pc.c ? pc.c.topW : pc.w, fh = pc.c ? pc.c.topH : pc.h;
          return (
            <Box cx={pc.x + pc.w / 2} cy={pc.y + pc.h / 2} w={pc.w} h={pc.h} from={snap}
              anim={{
                cx: times.map((tt) => [tt, Math.round(toPanel(tt, pc.x + pc.w / 2, pc.y + pc.h / 2).x * 100) / 100] as Key),
                cy: times.map((tt) => [tt, Math.round(toPanel(tt, pc.x + pc.w / 2, pc.y + pc.h / 2).y * 100) / 100] as Key),
                scale: times.map((tt) => [tt, Math.round(cam(tt).s * popOf(tt, snap) * 1000) / 1000] as Key),
              }}>
              <PieceView piece={{ ...pc }} holesUntil={holesUntil} />
              {/* snap flash */}
              <R x={0} y={0} w={fw} h={fh} r={10} fill="#FFFFFF" opacity={0} from={snap} to={snap + 0.5}
                anim={{ opacity: [[snap, 0.55, E.out], [snap + 0.45, 0]] }} />
              {/* flow highlight */}
              {flowOrder.includes(pc.id) ? (
                <R x={2} y={2} w={fw - 4} h={fh - 4} r={9} fill="none" stroke={{ color: "#FFFFFF", width: 4 }} opacity={0}
                  from={flowAt} to={flowAt + 1.2} anim={{ opacity: [[flowAt, 0, E.out], [flowAt + 0.12, 1], [flowAt + 0.5, 1, E.in], [flowAt + 1.1, 0]] }} />
              ) : null}
            </Box>
          );
        })}
        <rect clipPath x={CANVAS.x} y={CANVAS.y} width={CANVAS.w} height={CANVAS.h} cornerRadiusBottomLeft={34} />
      </G>

      {/* toolbar */}
      <R x={0} y={0} w={PANEL.w} h={PANEL.bar} r={34} rbl={0} rbr={0} fill={C.container} />
      <R x={0} y={PANEL.bar - 1} w={PANEL.w} h={1} fill={C.outline} />
      <Icon name="back" x={30} y={28} size={30} />
      <T x={80} y={0} h={PANEL.bar} baseline="middle" size={28} weight={600} color={C.onSurface}>button1 : onClick</T>
      <Icon name="undo" x={PANEL.w - 150} y={28} size={28} opacity={0.75} />
      <Icon name="redo" x={PANEL.w - 100} y={28} size={28} opacity={0.35} />
      <Icon name="more" x={PANEL.w - 54} y={28} size={28} />
      {/* syntax ok */}
      {t.ok !== undefined ? (
        <Box cx={PANEL.w - 360} cy={PANEL.bar / 2} w={180} h={44} from={t.ok} anim={{ scale: [[t.ok, 0.6, E.back], [t.ok + 0.4, 1]], opacity: [[t.ok, 0, E.out], [t.ok + 0.2, 1]] }}>
          <R x={0} y={0} w={180} h={44} r={22} fill={C.nativeBg} />
          <Icon name="check" tint="green" x={14} y={9} size={26} />
          <T x={48} y={0} h={44} baseline="middle" size={19} weight={600} color={C.nativeText}>Syntax OK</T>
        </Box>
      ) : null}

      {/* palette drawer */}
      <R x={PAL_X} y={PANEL.bar} w={PANEL.paletteW} h={PANEL.h - PANEL.bar} r={34} rtl={0} rtr={0} rbl={0} fill={C.container} />
      <R x={PAL_X} y={PANEL.bar} w={1} h={PANEL.h - PANEL.bar} fill={C.outline} />
      <R x={PAL_X} y={PANEL.bar} w={CAT_W} h={PANEL.h - PANEL.bar} rbl={0} fill={C.high} />
      {CATS.map(([name, col], i) => (
        <G>
          <R x={PAL_X + 14} y={PANEL.bar + 22 + i * 58} w={8} h={34} r={4} fill={col} />
          <T x={PAL_X + 30} y={PANEL.bar + 22 + i * 58} h={34} baseline="middle" size={16} weight={600} color={C.onSurface}>{name}</T>
        </G>
      ))}
      {/* selected category highlight */}
      <R x={PAL_X + 6} y={PANEL.bar + 17 + 2 * 58} w={CAT_W - 12} h={44} r={12} fill={C.primary} opacity={0.12}
        anim={{ y: cats.flatMap(([tt, ci], i) => (i === 0 ? [[tt, PANEL.bar + 17 + ci * 58, E.std]] : [[tt, PANEL.bar + 17 + catAt(i - 1)[1] * 58, E.std], [tt + 0.3, PANEL.bar + 17 + ci * 58, E.std]]) as Key[]) }} />
      {/* block list of the selected category */}
      {cats.map(([tt, ci], i) => {
        const until = i < cats.length - 1 ? catAt(i + 1)[0] : 1000;
        const list = PALETTE_BLOCKS[ci] ?? [];
        const col = CATS[ci]![1];
        return (
          <G from={tt} to={until + 0.2} anim={{ opacity: [[tt, 0, E.out], [tt + 0.2, 1], [until, 1, E.in], [until + 0.2, 0]] }}>
            <T x={LIST_X} y={PANEL.bar + 24} size={15} weight={700} color={C.variant} spacing={0.6} upper>{CATS[ci]![0]}</T>
            {list.map((b, j) => {
              const w = Math.min(PANEL.paletteW - CAT_W - 34, tw(b.text, 17, 600) + (b.shape === "c" ? 40 : 30));
              const y = LIST_Y0 + j * LIST_DY;
              return (
                <G>
                  {b.shape === "c" ? (
                    <>
                      <R x={LIST_X} y={y} w={w} h={36} r={6} fill={col} />
                      <R x={LIST_X} y={y + 34} w={14} h={18} fill={col} />
                      <R x={LIST_X} y={y + 50} w={Math.min(w, 70)} h={12} r={6} rtl={0} fill={col} />
                    </>
                  ) : (
                    <R x={LIST_X} y={y} w={w} h={b.shape === "cmd" ? 40 : 36} r={b.shape === "rep" ? 18 : 7} fill={col} />
                  )}
                  <T x={LIST_X + 12} y={y} h={b.shape === "cmd" ? 40 : 36} baseline="middle" size={17} weight={600} color="#FFFFFF">{b.text}</T>
                </G>
              );
            })}
          </G>
        );
      })}

      {/* drag ghosts: from the palette to where the piece lands */}
      {pieces.map((pc) => {
        const dg = drag[pc.id];
        if (!dg) return null;
        const [t0, t1] = dg;
        const spot = paletteSpot(pc.id);
        const end = toPanel(t1, pc.x + pc.w / 2, pc.y + pc.h / 2);
        const s0 = 0.62;
        return (
          <Box cx={spot.x} cy={spot.y} w={pc.w} h={pc.h} from={t0} to={t1 + 0.02}
            anim={{
              cx: [[t0, LIST_X + (pc.w * s0) / 2, E.inOut], [t1, end.x]],
              cy: [[t0, spot.y, E.inOut], [t1, end.y]],
              scale: [[t0, s0 * 0.95, E.back], [t0 + 0.2, s0 * 1.08, E.inOut], [t1, end.s]],
              rotation: [[t0, 0, E.out], [t0 + 0.2, -4, E.inOut], [t1, 0]],
              opacity: [[t0, 0, E.out], [t0 + 0.1, 1]],
            }}>
            <G>
              <PieceView piece={{ ...pc }} holesUntil={holesUntil} />
            </G>
          </Box>
        );
      })}
    </G>
  );
}

export { CANVAS, CAT_INDEX };

/**
 * The finished program as a compact card (no editor chrome), with an
 * execution highlight running hat → if → setText from `run`.
 */
export function ProgramCard(p: { x: number; y: number; scale: number; from: number; to: number; run?: number; anim?: Record<string, Key[]> }) {
  const pieces = buildProgram();
  const run = p.run ?? 1000;
  const order: Record<string, number> = { hat: 0, if: 0.12, gt: 0.2, set: 0.34, join: 0.4 };
  const W = Math.max(...pieces.map((pc) => pc.x + pc.w)) + 40;
  const H = Math.max(...pieces.map((pc) => pc.y + pc.h)) + 36;
  return (
    <Box cx={p.x + (W * p.scale) / 2} cy={p.y + (H * p.scale) / 2} w={W} h={H} from={p.from} to={p.to} scale={p.scale} anim={p.anim}>
      <R x={0} y={0} w={W} h={H} r={40} fill="#F4F4F8" opacity={0.97} shadow={{ blur: 60, y: 30, opacity: 0.45 }} />
      <G x={-8} y={-6}>
        {pieces.map((pc) => {
          const at = order[pc.id];
          const tw0 = pc.c ? pc.c.topW : pc.w, th0 = pc.c ? pc.c.topH : pc.h;
          return (
            <G x={pc.x} y={pc.y}>
              <PieceView piece={pc} />
              {at !== undefined ? (
                <R x={-5} y={-5} w={tw0 + 10} h={th0 + 10} r={12} fill="none" stroke={{ color: "#FFFFFF", width: 5 }} opacity={0}
                  from={run + at} to={run + at + 1.4} anim={{ opacity: [[run + at, 0, E.out], [run + at + 0.1, 1], [run + at + 0.6, 1, E.in], [run + at + 1.3, 0]] }} />
              ) : null}
              {at !== undefined ? (
                <R x={0} y={0} w={tw0} h={th0} r={10} fill="#FFFFFF" opacity={0}
                  from={run + at} to={run + at + 0.6} anim={{ opacity: [[run + at, 0.45, E.out], [run + at + 0.5, 0]] }} />
              ) : null}
            </G>
          );
        })}
      </G>
    </Box>
  );
}
