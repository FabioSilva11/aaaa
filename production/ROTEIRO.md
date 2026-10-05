# Sketchware IA — vídeo promocional (60 s)

**Produto apresentado:** Sketchware IA (https://github.com/FabioSilva11/Sketchware-IA)
**Ferramenta de produção:** Diffusion Studio (https://github.com/diffusionstudio/editor), só nos bastidores.

Formato: 1920×1080, 30 fps, 60 s, MP4 (H.264 High + AAC 48 kHz), −14 LUFS.

## Material: o app real

As telas do app vêm da **gravação de tela real** feita pelo usuário (`footage/sketchware-ia-screenrecord.mp4`,
864×1920, 142 s) e das **capturas de tela** dele (`project/assets/screens/`). Elas foram recortadas, ampliadas,
aceleradas e montadas no ritmo da música:

- **Anúncio de teste:** o banner ("Anúncio de teste / This is a … test ad") nunca aparece. O aparelho mostra a tela
  cortada em y < 1684 (o anúncio fica em y 1685–1819). Na captura *New Project*, o anúncio foi fatiado e o vão fechado.
- **Trechos evitados:** pop-up de captura de tela (127,8–130,6 s e 134,2–137,6 s), diálogo do sistema (138,5 s) e
  travamentos do app (3,4–4,5 s, 44,8–45,6 s, 88,4–94,5 s, 95,6–110 s). Todos foram cortados.
- **Única parte recriada:** o app rodando. A gravação termina quando o APK fica pronto, então "NewProject" rodando
  foi refeito com o que o projeto define: tema `#6176AD`, toolbar com o título, a barra de status real e
  `textview2` = "Olá mundo" centralizado (12sp, padrão do Sketchware).

O log quadro a quadro da gravação está em `footage/footage-log.json`. A lista de tomadas (EDL), com cada ponto de
origem verificado, está em `footage/edit-plan.json`. Ela foi escolhida por um painel de 3 diretores e um juiz.

## O app criado no vídeo

O mesmo da gravação: `linear1` (LinearLayout, `match_parent` × `match_parent`, gravity
`center_horizontal | center_vertical`) com `textview2` (TextView) dentro, e a lógica:

```
On activity create
  TextView : textview2  setText  "Olá mundo"
```

## Timeline

| Tempo | Cena | O que acontece (material real) | Texto |
|---|---|---|---|
| 0–5 s | 01 Abertura | Marca, fragmentos de UI em profundidade, push-through | SKETCHWARE IA · *Transforme ideias em aplicativos.* |
| 4,3–12 s | 02 Projeto | Captura *New Project* (campos, cores do tema, Theme Presets) → toque em **Create** → o editor real abre (NewProject 601, abas Design/Event/Component/Strings) → arrasta **Linear(H)** | 01 PROJETO · *Comece um novo projeto* |
| 12–21 s | 03 Design | linear1 cai no canvas · *Edit Properties* · diálogo **Height** → `match_parent` · diálogo **Gravity** → `center_horizontal` + `center_vertical` · TextView arrastado cai centralizado | 02 DESIGN · *Crie a interface visualmente* |
| 21–30,5 s | 04 Eventos e blocos | Aba **Event** → `onCreate` · paleta de blocos (Control, View) · arrasta **TextView : setText** · *Select widget* → `textview2` · encaixe sob *On activity create* · **✓ Syntax OK** · digita **"Olá mundo"** · Save | 03 LÓGICA · *Crie a lógica visualmente* |
| 30,5–38,9 s | 05 O app ganha vida | **Run** no break da música · janela com os passos reais do build: *Deleting temporary files → Generating source code → Extracting built-in libraries → Compiling/Linking resources with AAPT2 → Java is compiling → D8 is running → Run* · o app abre a partir do botão Run · pulso liga o bloco ao "Olá mundo" | 04 TESTE · *Seu app, ganha vida.* |
| 38,9–46,7 s | 06 Plataforma | Câmera contínua sobre telas reais (New Project, editor, Gravity, Event, paleta de blocos, programa, build) | *Design. · Lógica. · Desenvolvimento.* |
| 46,7–54 s | 07 Resultado | A pré-visualização do editor vira o app rodando · cartão do programa · DESIGN · EVENTOS · BLOCOS · LÓGICA · BUILD sobre telas reais, um por tempo | 05 RESULTADO · *Projeto criado, app funcionando.* |
| 54–60 s | 08 Encerramento | Impacto musical em 54,0 s, marca, frase final, fade | SKETCHWARE IA · *Crie. Programe. Teste.* |

## Linguagem de movimento

- **Curvas:** uma família só (`lib/core.tsx` → `E`): `out` para entradas, `inOut` para câmera e transformações,
  `in` para saídas, `back` para pops e `std` para microinterações.
- **Câmera:** câmera 2D com zoom logarítmico e drift sutil nas pausas, e um aparelho só durante as cenas 02–05.
- **Detalhes legíveis:** diálogos, paleta, *Select widget*, encaixe, *Syntax OK*, digitação e build saem da mesma
  gravação para uma **janela animada** (`AnimWindow`), com recorte, zoom e posição sincronizados.
- **Ritmo:** cada ação real cai no grid de 120 BPM. Exemplos: drop em 12,0, Height em 13,5, encaixe em 27,5,
  *Syntax OK* em 28,0, Run em 31,0 (break), um passo do build por tempo e lançamento em 35,0.

## Áudio

- **Trilha:** original, sintetizada (`tools/audio/make_audio.py`), 120 BPM. Tem intro discreta, groove a partir
  de 5 s, break curto em 31 s, *build* a partir de 50 s e acorde final com impacto em **54,0 s**.
- **Efeitos:** 12 efeitos sintetizados (clique, toque, seleção, pop, encaixe, teclado, whooshes, confirmação, brilho,
  riser e impacto). Cada um está no quadro da ação correspondente (`index.tsx` → `SFX`), abaixo da música.

## Ícones e marca

Desenhados do zero (`tools/icons/make-icons.mjs`). Nenhuma imagem do repositório do Sketchware IA foi extraída
ou convertida. As imagens do app vêm apenas da gravação e das capturas enviadas pelo usuário.
