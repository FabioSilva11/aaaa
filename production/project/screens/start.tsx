// Projects (home) and New Project screens, laid out from the app's
// res/layout/main.xml, myprojects_item.xml and myproject_setting.xml, with
// the app's own strings ("Search projects...", "New Project", "Create App",
// "Tap to change Icon", "Theme Presets", "Native").

import { Box, E, G, Icon, R, T, tw, type Anim } from "../lib/core";
import { C, Chip, Ripple, StatusBar, SH, SW, Typed, d } from "../lib/ui";

const PROJECTS = [
  { name: "Calculadora", app: "Calculadora (1.2)", pkg: "com.meuapp.calculadora", icon: "plus", from: "#FF9A5A", to: "#F0573C" },
  { name: "Lista de Tarefas", app: "Tarefas (1.0)", pkg: "com.meuapp.tarefas", icon: "check_box", from: "#34C79A", to: "#159A86" },
  { name: "Meu Portfólio", app: "Portfólio (2.1)", pkg: "com.meuapp.portfolio", icon: "image", from: "#5AB8FF", to: "#3D6BFF" },
];

export const FAB = (() => {
  const w = d(16 + 24 + 10 + 20) + tw("New Project", d(15), 600);
  return { x: d(344) - w, y: d(612), w, h: d(56), cx: d(344) - w / 2, cy: d(640) };
})();

/** Projects list with the "New Project" extended FAB; `tap` presses the FAB. */
export function HomeScreen(p: { from: number; to: number; tap?: number }) {
  const fabW = d(16 + 24 + 10 + 20) + tw("New Project", d(15), 600);
  const fabX = d(344) - fabW;
  const fabY = d(612);
  const tap = p.tap ?? -100;
  return (
    <G from={p.from} to={p.to}>
      <R x={0} y={0} w={SW} h={SH} fill={C.surface} />
      <StatusBar />
      {/* search bar card */}
      <R x={d(16)} y={d(40)} w={d(328)} h={d(54)} r={d(27)} fill={C.container} shadow={{ blur: d(10), y: d(2), opacity: 0.08 }} />
      <Icon name="menu" x={d(32)} y={d(55)} size={d(24)} />
      <T x={d(68)} y={d(40)} h={d(54)} baseline="middle" size={d(16)} color={C.variant}>Search projects...</T>
      <R x={d(298)} y={d(48)} w={d(38)} h={d(38)} r={d(19)} fill={C.primaryContainer} />
      <Icon name="user" tint="primary" x={d(306)} y={d(56)} size={d(22)} />
      {/* project cards */}
      {PROJECTS.map((pr, i) => {
        const y = d(110 + i * 100);
        const nameW = tw(pr.name, d(16), 600);
        return (
          <G>
            <R x={d(12)} y={y} w={d(336)} h={d(88)} r={d(20)} fill={C.container} shadow={{ blur: d(8), y: d(2), opacity: 0.06 }} />
            <R x={d(26)} y={y + d(16)} w={d(56)} h={d(56)} r={d(16)} fill={{ stops: [[0, pr.from], [1, pr.to]], rotation: 45 }} />
            <Icon name={pr.icon} tint="white" x={d(40)} y={y + d(30)} size={d(28)} />
            <T x={d(96)} y={y + d(15)} size={d(16)} weight={600} color={C.onSurface}>{pr.name}</T>
            <Chip x={d(102) + nameW} y={y + d(16)} text="Native" size={d(10)} bg={C.nativeBg} fg={C.nativeText} />
            <T x={d(96)} y={y + d(41)} size={d(13)} color={C.variant}>{pr.app}</T>
            <T x={d(96)} y={y + d(60)} size={d(12)} color={C.variant}>{pr.pkg}</T>
            <Icon name="more" tint="gray" x={d(316)} y={y + d(32)} size={d(22)} />
          </G>
        );
      })}
      {/* extended FAB */}
      <Box cx={fabX + fabW / 2} cy={fabY + d(28)} w={fabW} h={d(56)} anim={{ scale: [[tap - 0.06, 1, E.out], [tap + 0.04, 0.94, E.out], [tap + 0.3, 1]] }}>
        <R x={0} y={0} w={fabW} h={d(56)} r={d(18)} fill={C.primaryContainer} shadow={{ blur: d(12), y: d(4), opacity: 0.18 }} />
        <Icon name="plus" tint="primary" x={d(16)} y={d(16)} size={d(24)} />
        <T x={d(50)} y={0} h={d(56)} baseline="middle" size={d(15)} weight={600} color={C.primary}>New Project</T>
        <G>
          <Ripple x={fabW * 0.3} y={d(28)} t={tap} size={fabW * 1.6} color={C.primary} />
          <rect clipPath x={0} y={0} width={fabW} height={d(56)} cornerRadius={d(18)} />
        </G>
      </Box>
      {/* bottom navigation */}
      <R x={0} y={d(680)} w={SW} h={d(80)} fill={C.container} />
      <R x={0} y={d(680)} w={SW} h={d(1)} fill={C.outline} />
      {[
        ["list", "Projects"],
        ["layers", "Store"],
        ["code", "Web Service"],
        ["user", "Chat"],
      ].map(([icon, label], i) => {
        const cx = d(45 + i * 90);
        return (
          <G>
            {i === 0 ? <R x={cx - d(32)} y={d(692)} w={d(64)} h={d(32)} r={d(16)} fill={C.primaryContainer} /> : null}
            <Icon name={icon!} tint={i === 0 ? "primary" : "gray"} x={cx - d(12)} y={d(696)} size={d(24)} />
            <T x={cx - d(45)} y={d(730)} w={d(90)} h={d(16)} align="center" baseline="middle" size={d(12)} weight={i === 0 ? 600 : 500} color={i === 0 ? C.onSurface : C.variant}>{label!}</T>
          </G>
        );
      })}
    </G>
  );
}

function Field(p: { y: number; label: string; children?: unknown; focus?: [number, number]; from?: number }) {
  const [f0, f1] = p.focus ?? [-100, -99];
  const labelW = tw(p.label, d(12), 500) + d(8);
  return (
    <G>
      <R x={d(16)} y={p.y} w={d(328)} h={d(58)} r={d(12)} fill="none" stroke={{ color: "#C7C7CF", width: d(1) }} />
      <R x={d(16)} y={p.y} w={d(328)} h={d(58)} r={d(12)} fill="none" stroke={{ color: C.primary, width: d(2) }}
        opacity={0} anim={{ opacity: [[f0, 0, E.out], [f0 + 0.2, 1], [f1, 1, E.out], [f1 + 0.2, 0]] }} />
      <R x={d(26)} y={p.y - d(8)} w={labelW} h={d(16)} fill={C.surface} />
      <T x={d(30)} y={p.y - d(8)} h={d(16)} baseline="middle" size={d(12)} weight={500} color={C.variant}>{p.label}</T>
      <T x={d(30)} y={p.y - d(8)} h={d(16)} baseline="middle" size={d(12)} weight={500} color={C.primary}
        opacity={0} anim={{ opacity: [[f0, 0, E.out], [f0 + 0.2, 1], [f1, 1, E.out], [f1 + 0.2, 0]] }}>{p.label}</T>
      {p.children as never}
    </G>
  );
}

/**
 * New Project form. Times: `open` (slides up), `type` (app name typing
 * starts), `create` (Create App pressed).
 */
export function NewProjectScreen(p: { from: number; to: number; open: number; type: number; create: number }) {
  const appName = "Olá App";
  const cps = 9;
  const typedEnd = p.type + appName.length / cps;
  const anim: Anim = { offsetY: [[p.open, SH, E.std], [p.open + 0.5, 0]] };
  return (
    <G from={p.from} to={p.to} anim={anim}>
      <R x={0} y={0} w={SW} h={SH} fill={C.surface} />
      <StatusBar />
      <Icon name="back" x={d(16)} y={d(46)} size={d(24)} />
      <T x={d(58)} y={d(40)} h={d(36)} baseline="middle" size={d(22)} weight={500} color={C.onSurface}>New Project</T>
      {/* app icon */}
      <R x={d(132)} y={d(100)} w={d(96)} h={d(96)} r={d(28)} fill={{ stops: [[0, C.violet], [0.55, C.primary], [1, C.blue]], rotation: 45 }} shadow={{ blur: d(14), y: d(5), opacity: 0.25 }} />
      <Icon name="wave" tint="white" x={d(152)} y={d(120)} size={d(56)} />
      <T x={0} y={d(204)} w={SW} h={d(18)} align="center" baseline="middle" size={d(12)} color={C.variant}>Tap to change Icon</T>
      {/* fields */}
      <Field y={d(246)} label="Enter application name" focus={[p.type - 0.35, typedEnd + 0.25]}>
        <Typed text={appName} t0={p.type} cps={cps} to={p.to} x={d(32)} y={d(264)} size={d(16)} caret={C.primary} caretTo={typedEnd + 0.25} />
      </Field>
      <Field y={d(326)} label="Package name" focus={[typedEnd + 0.25, typedEnd + 0.9]}>
        <T x={d(32)} y={d(344)} size={d(16)} color={C.onSurface} from={typedEnd + 0.1} anim={{ opacity: [[typedEnd + 0.1, 0, E.out], [typedEnd + 0.4, 1]] }}>com.meuapp.olaapp</T>
      </Field>
      <Field y={d(406)} label="Project name" focus={[typedEnd + 0.5, typedEnd + 1.0]}>
        <T x={d(32)} y={d(424)} size={d(16)} color={C.onSurface} from={typedEnd + 0.3} anim={{ opacity: [[typedEnd + 0.3, 0, E.out], [typedEnd + 0.6, 1]] }}>OlaApp</T>
      </Field>
      {/* theme presets */}
      <T x={d(20)} y={d(492)} size={d(14)} weight={600} color={C.onSurface}>Theme Presets</T>
      {[C.primary, "#008DCD", "#26A59A", "#FF8700", "#E91E63", "#43A047"].map((col, i) => (
        <G>
          <R x={d(20 + i * 46)} y={d(522)} w={d(34)} h={d(34)} r={d(17)} fill={col} />
          {i === 0 ? <R x={d(16 + i * 46)} y={d(518)} w={d(42)} h={d(42)} r={d(21)} fill="none" stroke={{ color: C.primary, width: d(2) }} /> : null}
        </G>
      ))}
      {/* create */}
      <Box cx={SW / 2} cy={d(704)} w={d(328)} h={d(52)} anim={{ scale: [[p.create - 0.06, 1, E.out], [p.create + 0.04, 0.96, E.out], [p.create + 0.3, 1]] }}>
        <R x={0} y={0} w={d(328)} h={d(52)} r={d(26)} fill={C.primary} shadow={{ blur: d(10), y: d(4), opacity: 0.25, color: C.primary }} />
        <T x={0} y={0} w={d(328)} h={d(52)} align="center" baseline="middle" size={d(16)} weight={600} color="#FFFFFF">Create App</T>
        <G>
          <Ripple x={d(164)} y={d(26)} t={p.create} size={d(420)} />
          <rect clipPath x={0} y={0} width={d(328)} height={d(52)} cornerRadius={d(26)} />
        </G>
      </Box>
    </G>
  );
}
