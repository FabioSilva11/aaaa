// Sketchware IA — promotional video (60 s, 1920×1080, 30 fps).
//
// A Diffusion Studio project: this file is the composition's entry. The
// story runs as one flow — idea → project → design → events → blocks →
// logic → test → result → brand — under one camera language and one
// soundtrack (assets/audio, synthesized by tools/audio/make_audio.py).
//
//   01 Opening        0–5   brand + "Transforme ideias em aplicativos."
//   02 Project        5–12  Projects → New Project → the editor opens
//   03 Design        12–21  widgets dragged in, properties edited
//   04 Events/blocks 21–31  onClick → the program assembled block by block
//   05 Comes alive   31–39  Run → type a name → tap → "Olá, Ana"
//   06 Platform      39–47  continuous move across the whole tool
//   07 Result        47–54  the app leaves the editor and works
//   08 Closing       54–60  brand hit on the downbeat of the music

import { Sfx } from "./lib/core";
import { Background, Caption, Closing, Opening } from "./scenes/brand";
import { APPT, ED, NP, PhoneShot } from "./scenes/phone";
import { ConnectCard, LG, LogicScene } from "./scenes/logic";
import { Montage, RES, Result } from "./scenes/montage";

/** Every sound effect, on the frame of the action it belongs to. */
function SoundDesign() {
  const s: { src: string; at: number; vol: number }[] = [];
  const add = (src: string, at: number, vol: number) => s.push({ src, at, vol });

  // 01 opening
  add("impact", 0.62, -20);
  add("shimmer", 0.68, -17);
  add("whoosh-soft", 1.1, -24);
  add("whoosh", 4.1, -14);
  // 02 project
  add("tap", 6.5, -11);
  add("whoosh-soft", NP.open, -22);
  add("tap", 7.25, -15);
  for (let i = 0; i < 7; i++) add("type", NP.type + i / 9, -17);
  add("tap", NP.create, -10);
  add("confirm", NP.create + 0.08, -17);
  add("whoosh-soft", 9.35, -19);
  add("select", ED.appear! + 0.2, -24);
  // 03 design
  ED.drag!.forEach((t) => add("select", t + 0.02, -21));
  ED.drop!.forEach((t) => add("pop", t, -12));
  for (const t of [ED.selText![0], ED.selButton![0], ED.selEdit![0]]) add("tap", t, -15);
  for (const t of [ED.textValue!, ED.textSize!, ED.textColor!, ED.btnText!, ED.btnBg!, ED.hint!]) add("click", t, -15);
  // 04 events + blocks
  add("tap", ED.eventTab!, -13);
  add("tap", ED.eventTap!, -12);
  add("whoosh", 21.95, -14);
  for (const [t0, t1] of Object.values(LG.drag!)) {
    add("select", t0 + 0.02, -25);
    add("snap", t1, -8);
  }
  for (const t of Object.values(LG.fills!)) add("type", t, -17);
  add("shimmer", LG.flow!, -19);
  add("confirm", LG.ok!, -14);
  add("whoosh", 30.6, -15);
  // 05 comes alive
  add("click", ED.run!, -11);
  add("whoosh-soft", APPT.launch, -17);
  add("tap", APPT.focus, -15);
  for (let i = 0; i < 3; i++) add("type", APPT.type + i / 8, -16);
  add("tap", APPT.press, -9);
  add("confirm", APPT.result, -12);
  add("whoosh", 38.7, -13);
  // 06 platform
  add("whoosh-soft", 39.55, -20);
  add("whoosh-soft", 41.55, -20);
  add("whoosh-soft", 43.55, -20);
  add("shimmer", 45.5, -21);
  // 07 result
  add("whoosh", 47.3, -16);
  add("tap", RES.focus, -16);
  for (let i = 0; i < 3; i++) add("type", RES.type + i / 8, -17);
  add("tap", RES.press, -10);
  add("confirm", RES.result, -14);
  add("riser", 50.5, -11);
  for (let i = 0; i < 5; i++) add("select", 51.9 + i * 0.42, -15);
  // 08 closing
  add("impact", 54.0, -5);
  add("shimmer", 55.0, -17);
  return <>{s.map((e) => <Sfx src={e.src} at={e.at} vol={e.vol} />)}</>;
}

export default function Project() {
  return (
    <stage>
      <scene id="promo" name="Sketchware IA — Promo" width={1920} height={1080} fill="#07060F" active>
        <Background />
        <Opening />
        <PhoneShot />
        <LogicScene />
        <ConnectCard />
        <Montage />
        <Result />
        <Closing />
        <Caption step="01" label="PROJETO" lines={["Comece um", "novo projeto"]} from={5.5} to={11.7} />
        <Caption step="02" label="DESIGN" lines={["Crie a interface", "visualmente"]} from={12.3} to={20.5} />
        <Caption step="03" label="LÓGICA" lines={["Crie a lógica", "visualmente"]} from={22.7} to={30.4} />
        <Caption step="04" label="TESTE" lines={["Seu app,", "ganha vida."]} from={33.3} to={38.4} />
        <Caption step="05" label="RESULTADO" lines={["Projeto criado,", "app funcionando."]} from={48.25} to={51.3} />
        <audio src="assets/audio/music/sketchware-ia-theme.wav" start={0} volume={-3.5} />
        <SoundDesign />
      </scene>
    </stage>
  );
}
