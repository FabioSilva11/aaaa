// Sketchware IA — promotional video (60 s, 1920×1080, 30 fps).
//
// A Diffusion Studio project: this file is the composition's entry. The app
// is shown with REAL material — the user's screen recording of Sketchware IA
// (assets/footage) and screenshots (assets/screens) — cut, cropped, zoomed
// and speed-ramped on the music grid; only the finished app running is
// recreated (the recording ends when the APK is built). Shot list:
// production/footage/edit-plan.json; source log: production/footage/footage-log.json.
//
//   01 Opening        0–5      brand + "Transforme ideias em aplicativos."
//   02 Project        4.3–12   New Project → Create → the real editor → drag Linear(H)
//   03 Design         12–21    linear1 · Edit Properties · Height · Gravity · TextView centred
//   04 Events/blocks  21–30.55 Event › onCreate · palette · setText · textview2 · snap · Syntax OK · "Olá mundo"
//   05 Comes alive    30.55–38.85  Run on the break · the real build steps · the app launches
//   06 Platform       38.85–46.65  continuous move over real screens
//   07 Result         46.65–54 the preview becomes the app; DESIGN · EVENTOS · BLOCOS · LÓGICA · BUILD
//   08 Closing        54–60    brand hit on the downbeat of the music

import { Sfx } from "./lib/core";
import { Background, Caption, Closing, Opening } from "./scenes/brand";
import { BuildWindow, LinkPulse, LogicWindow, RealShot } from "./scenes/real";
import { Montage, Result } from "./scenes/montage";

/** Every sound effect, on the frame of the action it belongs to (edit-plan.json). */
const SFX: [string, number, number][] = [
  // 01 opening
  ["impact", 0.62, -20], ["shimmer", 0.68, -17], ["whoosh-soft", 1.1, -24], ["whoosh", 4.1, -14],
  // 02 project
  ["whoosh-soft", 4.35, -22], ["whoosh-soft", 6.0, -24], ["whoosh-soft", 7.0, -26],
  ["tap", 8.0, -10], ["confirm", 8.06, -17], ["whoosh-soft", 8.08, -20],
  ["whoosh-soft", 9.0, -24], ["whoosh-soft", 10.0, -24],
  ["select", 11.04, -20], ["whoosh-soft", 11.36, -26],
  // 03 design
  ["pop", 12.0, -11], ["whoosh-soft", 12.55, -22], ["tap", 13.05, -17], ["click", 13.5, -13], ["tap", 14.02, -13],
  ["whoosh-soft", 14.56, -22], ["shimmer", 15.0, -20], ["tap", 15.65, -17], ["click", 16.5, -13], ["click", 16.75, -13],
  ["tap", 17.25, -12], ["select", 18.08, -20], ["whoosh-soft", 18.28, -24], ["pop", 19.0, -10], ["shimmer", 19.04, -21],
  // 04 events + blocks
  ["whoosh", 20.7, -15], ["tap", 21.5, -13], ["whoosh-soft", 21.88, -19], ["whoosh", 22.3, -18],
  ["tap", 22.5, -13], ["whoosh-soft", 22.7, -24], ["tap", 23.0, -17], ["tap", 23.25, -17], ["select", 23.45, -19],
  ["whoosh", 23.7, -20], ["select", 24.87, -19], ["whoosh-soft", 25.05, -22], ["pop", 25.66, -14], ["tap", 25.92, -16],
  ["tap", 26.2, -16], ["click", 26.3, -18], ["tap", 26.5, -13], ["select", 26.88, -20], ["snap", 27.5, -8],
  ["tap", 27.75, -16], ["confirm", 28.0, -13],
  ["type", 28.58, -17], ["type", 28.66, -17], ["type", 28.75, -17], ["type", 29.0, -17], ["type", 29.33, -17],
  ["type", 29.49, -17], ["type", 29.57, -17], ["type", 29.66, -17],
  ["tap", 29.93, -12], ["confirm", 30.0, -14], ["shimmer", 30.05, -18],
  // 05 comes alive
  ["whoosh", 30.55, -15], ["click", 31.0, -9], ["select", 31.23, -18],
  ["click", 31.53, -21], ["click", 32.02, -21], ["click", 32.52, -21], ["click", 33.01, -21], ["click", 33.5, -21], ["click", 34.01, -21],
  ["confirm", 34.76, -16], ["whoosh-soft", 35.0, -16], ["confirm", 35.3, -13], ["shimmer", 36.0, -18], ["pop", 36.5, -12],
  ["whoosh", 38.65, -13],
  // 06 platform
  ["whoosh-soft", 39.55, -20], ["whoosh-soft", 41.55, -20], ["whoosh-soft", 43.55, -20], ["shimmer", 45.5, -21],
  // 07 result
  ["whoosh", 47.3, -16], ["shimmer", 47.95, -20], ["confirm", 48.6, -14], ["pop", 50.0, -16], ["riser", 50.5, -11],
  ["select", 51.5, -15], ["select", 52.0, -15], ["select", 52.5, -15], ["select", 53.0, -15], ["select", 53.5, -15],
  // 08 closing
  ["impact", 54.0, -5], ["shimmer", 55.0, -17],
];

export default function Project() {
  return (
    <stage>
      <scene id="promo" name="Sketchware IA — Promo" width={1920} height={1080} fill="#07060F" active>
        <Background />
        <Opening />
        <RealShot />
        <LogicWindow />
        <BuildWindow />
        <LinkPulse />
        <Montage />
        <Result />
        <Caption step="01" label="PROJETO" lines={["Comece um", "novo projeto"]} from={5.3} to={7.9} />
        <Caption step="02" label="DESIGN" lines={["Crie a interface", "visualmente"]} from={12.2} to={14.7} />
        <Caption step="03" label="LÓGICA" lines={["Crie a lógica", "visualmente"]} from={21.2} to={23.5} />
        <Caption step="04" label="TESTE" lines={["Seu app,", "ganha vida."]} from={33.0} to={38.4} y={300} />
        <Caption step="05" label="RESULTADO" lines={["Projeto criado,", "app funcionando."]} from={47.3} to={50.8} />
        <Closing />
        <audio src="assets/audio/music/sketchware-ia-theme.wav" start={0} volume={-3.5} />
        {SFX.map(([src, at, vol]) => <Sfx src={src} at={at} vol={vol} />)}
      </scene>
    </stage>
  );
}
