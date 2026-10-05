// "NewProject" running on the phone — the app built in the recording.
//
// The recording ends when the APK is built, before the app is opened, so the
// running app is recreated here from what the project defines: theme colour
// #6176AD (the colorAccent / colorPrimary / colorPrimaryDark tiles of the New
// Project screen and the design preview's toolbar), an AppCompat toolbar with
// the app title, and linear1 (match_parent, gravity center_horizontal |
// center_vertical) holding textview2, whose text onCreate sets to
// "Olá mundo" (Sketchware's default 12sp, black).
// Screen px: 864×1684 (the footage's screen, cut above the test ad), 2.4 px/dp.
// The status bar is the real one from the recording (white glyphs, 8:24).

import { Box, E, G, I, R, T } from "../lib/core";
import { SCREEN_H, SRC_W } from "../lib/footage";

export const THEME = "#6176AD";
const dp = (n: number) => n * 2.4;
const STATUS_H = 86;
const TOOLBAR_H = dp(56);
/** Centre of "Olá mundo" in screen px: centre of the content area below the toolbar. */
export const APP_TEXT = { x: SRC_W / 2, y: 952 };
export const TEXT_PX = 28.8;

/**
 * The running app at rest (onCreate has already run, so "Olá mundo" is there
 * from the first frame). `bump`: times at which the text gets a small
 * emphasis pulse (VFX for the link to the blocks, not an app feature).
 */
export function RealApp(p: { from: number; to: number; bump?: number[] }) {
  const s: [number, number, string?][] = [[p.from, 1]];
  for (const t of p.bump ?? []) s.push([t, 1, E.out], [t + 0.18, 1.08, E.back], [t + 0.5, 1]);
  return (
    <G from={p.from} to={p.to}>
      <R x={0} y={0} w={SRC_W} h={SCREEN_H} fill="#FFFFFF" />
      {/* status bar (real glyphs) on colorPrimaryDark */}
      <R x={0} y={0} w={SRC_W} h={STATUS_H} fill={THEME} />
      <I src="assets/stills/app-statusbar-white.png" x={0} y={0} w={SRC_W} h={STATUS_H} fit="fill" />
      {/* toolbar */}
      <R x={0} y={STATUS_H} w={SRC_W} h={TOOLBAR_H} fill={THEME} shadow={{ blur: 10, y: 5, opacity: 0.25 }} />
      <T x={38} y={STATUS_H} h={TOOLBAR_H} baseline="middle" size={48} weight={500} color="#FFFFFF">NewProject</T>
      {/* linear1 → textview2 */}
      <Box cx={APP_TEXT.x} cy={APP_TEXT.y} w={SRC_W} h={TEXT_PX * 2} anim={{ scale: s as never }}>
        <T x={0} y={0} w={SRC_W} h={TEXT_PX * 2} align="center" baseline="middle" size={TEXT_PX} color="#000000">Olá mundo</T>
      </Box>
    </G>
  );
}
