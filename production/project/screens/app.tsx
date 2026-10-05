// "Olá App" — the app built in the video, running on the phone.
// Same four views as in the designer: ImageView, TextView (textview1),
// EditText (edittext1) and Button (button1).

import { Box, E, G, Icon, R, T } from "../lib/core";
import { C, Ripple, StatusBar, SH, SW, Typed, d } from "../lib/ui";

export const APP = {
  text: { cx: SW / 2, cy: d(304) },
  edit: { x: d(24), y: d(362), w: d(312), h: d(52) },
  button: { x: d(24), y: d(446), w: d(312), h: d(54) },
};

/**
 * `launch`: the launch zoom; `focus`: EditText tapped; `type`: "Ana" typed;
 * `press`: Saudar pressed (TextView becomes "Olá, Ana"). Times absolute;
 * pass a past `press` with `typed` for the settled state.
 */
export function AppScreen(p: { from: number; to: number; launch?: number; focus?: number; type?: number; press?: number; result?: number }) {
  const launch = p.launch ?? -100;
  const focus = p.focus ?? -100;
  const type = p.type ?? -100;
  const press = p.press ?? -100;
  const result = p.result ?? press + 0.08;
  return (
    <Box cx={SW / 2} cy={SH / 2} w={SW} h={SH} from={p.from} to={p.to}
      anim={{ scale: [[launch, 0.82, E.out], [launch + 0.55, 1]], opacity: [[launch, 0, E.out], [launch + 0.25, 1]] }}>
      <R x={0} y={0} w={SW} h={SH} fill={C.container} />
      <R x={0} y={0} w={SW} h={d(30)} fill={C.primaryDark} />
      <StatusBar dark />
      <R x={0} y={d(30)} w={SW} h={d(62)} fill={C.primary} />
      <T x={d(20)} y={d(30)} h={d(62)} baseline="middle" size={d(20)} weight={600} color="#FFFFFF">Olá App</T>
      {/* ImageView */}
      <R x={SW / 2 - d(60)} y={d(130)} w={d(120)} h={d(120)} r={d(60)} fill={C.primaryContainer} />
      <Icon name="wave" tint="primary" x={SW / 2 - d(34)} y={d(156)} size={d(68)} />
      {/* TextView */}
      <T x={0} y={APP.text.cy - d(28)} w={SW} h={d(56)} align="center" baseline="middle" size={d(34)} weight={800} color={C.primary}
        to={result + 0.04} anim={{ opacity: [[result - 0.08, 1, E.in], [result + 0.04, 0]] }}>Olá!</T>
      <Box cx={APP.text.cx} cy={APP.text.cy} w={SW} h={d(56)} from={result}
        anim={{ scale: [[result, 0.6, E.back], [result + 0.5, 1]], opacity: [[result, 0, E.out], [result + 0.12, 1]] }}>
        <T x={0} y={0} w={SW} h={d(56)} align="center" baseline="middle" size={d(34)} weight={800} color={C.primary}>Olá, Ana</T>
      </Box>
      {/* EditText */}
      <T x={APP.edit.x + d(4)} y={APP.edit.y} h={APP.edit.h} baseline="middle" size={d(17)} color={C.variant} to={type} >Digite seu nome</T>
      <Typed text="Ana" t0={type} cps={8} to={p.to} x={APP.edit.x + d(4)} y={APP.edit.y + d(15)} size={d(17)} caret={C.primary} caretFrom={focus} caretTo={press - 0.1} />
      <R x={APP.edit.x} y={APP.edit.y + APP.edit.h - d(2)} w={APP.edit.w} h={d(1.5)} fill={C.variant} />
      <R x={APP.edit.x} y={APP.edit.y + APP.edit.h - d(2.5)} w={APP.edit.w} h={d(2.5)} fill={C.primary} opacity={0}
        anim={{ opacity: [[focus, 0, E.out], [focus + 0.2, 1], [press - 0.1, 1, E.out], [press + 0.2, 0]] }} />
      {/* Button */}
      <Box cx={APP.button.x + APP.button.w / 2} cy={APP.button.y + APP.button.h / 2} w={APP.button.w} h={APP.button.h}
        anim={{ scale: [[press - 0.06, 1, E.out], [press + 0.04, 0.95, E.out], [press + 0.32, 1]] }}>
        <R x={0} y={0} w={APP.button.w} h={APP.button.h} r={d(27)} fill={C.primary} shadow={{ blur: d(10), y: d(4), opacity: 0.25, color: C.primary }} />
        <T x={0} y={0} w={APP.button.w} h={APP.button.h} align="center" baseline="middle" size={d(17)} weight={600} color="#FFFFFF">Saudar</T>
        <G>
          <Ripple x={APP.button.w * 0.55} y={APP.button.h / 2} t={press} size={d(420)} />
          <rect clipPath x={0} y={0} width={APP.button.w} height={APP.button.h} cornerRadius={d(27)} />
        </G>
      </Box>
      {/* keyboard hint while typing */}
      <G from={focus} to={press + 0.4} anim={{ offsetY: [[focus, d(8), E.std], [focus + 0.3, 0], [press, 0, E.in], [press + 0.3, d(8)]], opacity: [[focus, 0, E.std], [focus + 0.25, 1], [press, 1, E.in], [press + 0.3, 0]] }}>
        <R x={0} y={SH - d(250)} w={SW} h={d(250)} fill="#E9E9EF" />
        {[0, 1, 2].map((row) =>
          Array.from({ length: row === 2 ? 7 : row === 1 ? 9 : 10 }, (_, i) => {
            const n = row === 2 ? 7 : row === 1 ? 9 : 10;
            const kw = d(30), gap = d(5);
            const x0 = (SW - (n * kw + (n - 1) * gap)) / 2;
            return <R x={x0 + i * (kw + gap)} y={SH - d(236) + row * d(52)} w={kw} h={d(42)} r={d(6)} fill="#FFFFFF" shadow={{ blur: d(1), y: d(1), opacity: 0.15 }} />;
          }),
        )}
        <R x={d(80)} y={SH - d(80)} w={d(200)} h={d(42)} r={d(6)} fill="#FFFFFF" />
        {"qwertyuiop".split("").map((ch, i) => (
          <T x={(SW - (10 * d(30) + 9 * d(5))) / 2 + i * d(35)} y={SH - d(236)} w={d(30)} h={d(42)} align="center" baseline="middle" size={d(16)} color={C.onSurface}>{ch}</T>
        ))}
        {"asdfghjkl".split("").map((ch, i) => (
          <T x={(SW - (9 * d(30) + 8 * d(5))) / 2 + i * d(35)} y={SH - d(184)} w={d(30)} h={d(42)} align="center" baseline="middle" size={d(16)} color={C.onSurface}>{ch}</T>
        ))}
        {"zxcvbnm".split("").map((ch, i) => (
          <T x={(SW - (7 * d(30) + 6 * d(5))) / 2 + i * d(35)} y={SH - d(132)} w={d(30)} h={d(42)} align="center" baseline="middle" size={d(16)} color={C.onSurface}>{ch}</T>
        ))}
      </G>
      <R x={SW / 2 - d(60)} y={SH - d(14)} w={d(120)} h={d(5)} r={d(2.5)} fill={C.onSurface} opacity={0.3} />
    </Box>
  );
}
