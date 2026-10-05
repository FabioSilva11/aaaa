// "NewProject" running on the phone — the app built in the recording.
//
// The recording ends when the APK is built, before the app is opened, so the
// running app is recreated here from what the project defines: theme colour
// #6176AD (colorPrimary / colorPrimaryDark / colorAccent tiles of the New
// Project screen and the preview toolbar), an AppCompat toolbar with the app
// title, and linear1 (match_parent, gravity center_horizontal|center_vertical)
// holding textview2, whose text onCreate sets to "Olá mundo".
// Screen px: 864×1684 (360 dp × 701.7 dp at 2.4 px/dp), same as the footage.

import { Box, E, G, R, T } from "../lib/core";
import { SCREEN_H, SRC_W } from "../lib/footage";

export const THEME = "#6176AD";
const dp = (n: number) => n * 2.4;
export const APP_TEXT = { cx: SRC_W / 2, cy: dp(36) + dp(56) + (SCREEN_H - dp(36) - dp(56)) / 2 };

/** `launch`: Android-style launch zoom; `textAt`: when onCreate's setText shows "Olá mundo"; `textScale` enlarges the text for legibility. */
export function RealApp(p: { from: number; to: number; launch?: number; textAt?: number; textSize?: number }) {
  const launch = p.launch ?? -100;
  const textAt = p.textAt ?? -100;
  const size = p.textSize ?? dp(14);
  return (
    <Box cx={SRC_W / 2} cy={SCREEN_H / 2} w={SRC_W} h={SCREEN_H} from={p.from} to={p.to}
      anim={{ scale: [[launch, 0.86, E.out], [launch + 0.5, 1]], opacity: [[launch, 0, E.out], [launch + 0.22, 1]] }}>
      <R x={0} y={0} w={SRC_W} h={SCREEN_H} fill="#FFFFFF" />
      {/* status bar */}
      <R x={0} y={0} w={SRC_W} h={dp(36)} fill={THEME} />
      <T x={dp(22)} y={0} h={dp(36)} baseline="middle" size={dp(14)} weight={600} color="#FFFFFF">8:24</T>
      {[0, 1, 2, 3].map((i) => <R x={dp(292) + i * dp(5)} y={dp(24) - dp(3 + i * 2.2)} w={dp(3.2)} h={dp(3 + i * 2.2)} r={dp(1)} fill="#FFFFFF" />)}
      <R x={dp(318)} y={dp(12.5)} w={dp(22)} h={dp(11)} r={dp(3)} fill="#FFFFFF" />
      {/* toolbar */}
      <R x={0} y={dp(36)} w={SRC_W} h={dp(56)} fill={THEME} shadow={{ blur: dp(4), y: dp(2), opacity: 0.25 }} />
      <T x={dp(16)} y={dp(36)} h={dp(56)} baseline="middle" size={dp(20)} weight={500} color="#FFFFFF">NewProject</T>
      {/* linear1 → textview2 */}
      <G from={textAt}>
        <Box cx={APP_TEXT.cx} cy={APP_TEXT.cy} w={SRC_W} h={size * 1.6}
          anim={{ opacity: [[textAt, 0, E.out], [textAt + 0.25, 1]], scale: [[textAt, 0.85, E.back], [textAt + 0.45, 1]] }}>
          <T x={0} y={0} w={SRC_W} h={size * 1.6} align="center" baseline="middle" size={size} color="#000000">Olá mundo</T>
        </Box>
      </G>
    </Box>
  );
}
