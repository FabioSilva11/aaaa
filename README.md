# Sketchware IA — vídeo promocional

Vídeo promocional de ~60 s (1920×1080, MP4) do **[Sketchware IA](https://github.com/FabioSilva11/Sketchware-IA)**,
produzido com o **[Diffusion Studio](https://github.com/diffusionstudio/editor)**.

- **Vídeo final:** [`production/output/sketchware-ia-promo.mp4`](production/output/sketchware-ia-promo.mp4)
- **Roteiro, timeline e decisões:** [`production/ROTEIRO.md`](production/ROTEIRO.md)

## Estrutura

```
production/
├── ROTEIRO.md                 roteiro, timeline cena a cena, identidade, áudio
├── project/                   o projeto do Diffusion Studio (editável)
│   ├── index.tsx              entrada da composição: cenas, legendas, trilha e sound design
│   ├── package.json           registro do projeto + configuração de exportação (diffusion.export.promo)
│   ├── lib/
│   │   ├── core.tsx           linguagem de movimento: wrappers com tempo absoluto, curvas, câmera, métricas de texto
│   │   ├── ui.tsx             cores do tema do app, aparelho, barra de status, toque, digitação
│   │   └── metrics.json       larguras dos glifos (Inter), para posicionamento exato
│   ├── screens/               telas do Sketchware IA recriadas a partir dos layouts do app
│   │   ├── start.tsx          Projects e New Project
│   │   ├── editor.tsx         editor: abas, paleta, pré-visualização, propriedades, Event, Run
│   │   ├── logic.tsx          editor de lógica e o sistema de blocos (layout + encaixe)
│   │   └── app.tsx            o "Olá App" em execução
│   ├── scenes/                as cenas do filme
│   │   ├── brand.tsx          01 abertura, 08 encerramento, fundo, legendas
│   │   ├── phone.tsx          02 projeto, 03 design, 04 (início), 05 teste — plano contínuo do celular
│   │   ├── logic.tsx          04 eventos e blocos; cartão do programa da cena 05
│   │   └── montage.tsx        06 visão geral da plataforma, 07 resultado
│   └── assets/
│       ├── brand/             marca (desenho original)
│       ├── icons/             ícones (desenho original, 5 tons)
│       └── audio/             trilha e efeitos (sintetizados)
├── tools/
│   ├── audio/make_audio.py    sintetiza a trilha e os efeitos
│   ├── icons/make-icons.mjs   desenha os ícones e a marca
│   ├── measure/measure.mjs    mede as fontes → project/lib/metrics.json
│   └── render/                renderização headless com os pacotes do Diffusion Studio
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

O Chromium do Playwright não traz codificador H.264, então o host grava um master VP9/Opus
(`*.master.webm`, 24 Mb/s) e o `render.mjs` gera a entrega H.264 High/AAC com ffmpeg.
