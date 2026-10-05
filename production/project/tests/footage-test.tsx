import { E } from "../lib/core";
import { RealPhone, Screen, Window, TapPulse } from "../lib/footage";
import { RealApp } from "../screens/realapp";

export default function Project() {
  return (
    <stage>
      <scene name="T" width={1920} height={1080} fill="#101018" active>
        <RealPhone cx={480} cy={540} from={0} to={3} anim={{ scale: [[0, 0.4, E.inOut], [3, 0.55]], rotation: [[0, -8, E.inOut], [3, 0]] }}>
          <Screen from={0} to={1.5} sourceIn={1.8} />
          <RealApp from={1.5} to={3} launch={1.5} textAt={1.9} />
        </RealPhone>
        <Window from={0} to={3} sourceIn={64.8} crop={{ x: 0, y: 206, w: 864, h: 260 }} cx={1350} cy={420} w={900}
          anim={{ scale: [[0, 0.9, E.inOut], [3, 1.1]], rotation: [[0, 4, E.inOut], [3, 0]] }}>
          <TapPulse x={200} y={120} t={1.0} />
        </Window>
        <Window from={0} to={3} sourceIn={84.2} speed={2} crop={{ x: 0, y: 1478, w: 864, h: 106 }} cx={1350} cy={820} w={900} />
      </scene>
    </stage>
  );
}
