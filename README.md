# Sketchware IA — vídeo promocional

Vídeo promocional de ~60 s (1920×1080, MP4) do **[Sketchware IA](https://github.com/FabioSilva11/Sketchware-IA)**,
produzido com o **[Diffusion Studio](https://github.com/diffusionstudio/editor)**.

- **Vídeo final:** [`production/output/sketchware-ia-promo.mp4`](production/output/sketchware-ia-promo.mp4)
- **Roteiro, timeline e decisões:** [`production/ROTEIRO.md`](production/ROTEIRO.md)

As telas do app vêm da **gravação de tela real** do Sketchware IA e das capturas enviadas pelo
usuário: recortadas, ampliadas, aceleradas e montadas no ritmo da música, sem o anúncio de teste.
Só o app rodando foi recriado, porque a gravação termina quando o APK fica pronto.

## Estrutura

```
production/
├── ROTEIRO.md                   roteiro, timeline cena a cena, material, áudio
├── footage/
│   ├── sketchware-ia-screenrecord.mp4   gravação de tela original (864x1920, 142 s)
│   ├── footage-log.json         log quadro a quadro: eventos, recortes, geometria da UI, regra do anúncio
│   └── edit-plan.json           EDL final (painel de 3 diretores + juiz), pontos de origem verificados
├── project/                     o projeto do Diffusion Studio (editável)
│   ├── index.tsx                entrada: cenas, legendas, trilha e sound design
│   ├── package.json             registro do projeto + exportação (diffusion.export.promo)
│   ├── lib/
│   │   ├── core.tsx             wrappers com tempo absoluto, curvas, câmera, métricas de texto
│   │   ├── footage.tsx          gravação como material: recortes, AnimWindow, RealPhone
│   │   ├── ui.tsx               cores e componentes de apoio da abertura
│   │   └── metrics.json         larguras dos glifos (Inter)
│   ├── scenes/
│   │   ├── brand.tsx            01 abertura, 08 encerramento, fundo, legendas
│   │   ├── real.tsx             02–05: projeto, design, eventos e blocos, build e app rodando
│   │   └── montage.tsx          06 visão geral, 07 resultado
│   ├── screens/realapp.tsx      o app "NewProject" rodando (recriado: tema #6176AD, "Olá mundo")
│   └── assets/
│       ├── footage/             proxy VP9 30 fps da gravação (decodificável headless)
│       ├── screens/             capturas do usuário (+ New Project sem anúncio)
│       ├── stills/              quadros da gravação usados como pausas e cartões
│       ├── brand/, icons/       marca e ícones (desenho original)
│       └── audio/               trilha e efeitos (sintetizados)
├── tools/
│   ├── audio/make_audio.py      sintetiza a trilha e os efeitos
│   ├── icons/make-icons.mjs     desenha os ícones e a marca
│   ├── measure/measure.mjs      mede as fontes → project/lib/metrics.json
│   └── render/                  renderização headless com os pacotes do Diffusion Studio
└── output/sketchware-ia-promo.mp4
```

## Abrir e editar no Diffusion Studio

A pasta `production/project` é um projeto do Diffusion Studio (uma pasta de JSX cujo `index.tsx`
exporta o `<stage>`). No app desktop: `diffusion open production/project`. A cena `promo` exporta
com as configurações de `package.json` (`diffusion export promo`).

## Renderizar sem o app (headless)

O renderizador em `production/tools/render` usa os pacotes do próprio Diffusion Studio — o
compilador de projeto (esbuild + babel-preset-solid em modo *universal* e os plugins do app), o
`@diffusionstudio/reconciler`, o `@diffusionstudio/runtime` e o `@diffusionstudio/encoder` — num
Chromium headless, do mesmo jeito que a exportação do app (`createCapture` + `createEncoder`).

```sh
# 1. Diffusion Studio (pacotes)
git clone https://github.com/diffusionstudio/editor ../diffusionstudio/editor
(cd ../diffusionstudio/editor && ELECTRON_SKIP_BINARY_DOWNLOAD=1 npm install)
export DS_EDITOR=$PWD/../diffusionstudio/editor

# 2. assets (opcional: já estão versionados)
python3 production/tools/audio/make_audio.py production/project/assets/audio   # numpy + scipy
node production/tools/icons/make-icons.mjs                                       # playwright
node production/tools/measure/measure.mjs                                        # playwright

# 3. host de exportação + render
(cd production/tools/render/harness && node $DS_EDITOR/node_modules/vite/bin/vite.js build --config vite.config.mjs)
node production/tools/render/render.mjs                  # → production/output/sketchware-ia-promo.mp4
node production/tools/render/render.mjs --from 21 --to 31 --out /tmp/trecho.mp4 --no-audio   # um trecho
```

As fontes (Inter, licença OFL) que o runtime pede ao Google Fonts são servidas de
`production/tools/render/font-cache/`, então o render não depende da rede; se alguma fonte não
carregar, o `render.mjs` falha em vez de entregar um vídeo com fonte substituta.

O Chromium do Playwright não traz codificador H.264, então o host grava um master VP9/Opus
(`*.master.webm`, 24 Mb/s) e o `render.mjs` gera a entrega H.264 High/AAC com ffmpeg.
