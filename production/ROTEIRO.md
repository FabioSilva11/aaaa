# Sketchware IA — vídeo promocional (60 s)

**Produto apresentado:** Sketchware IA (https://github.com/FabioSilva11/Sketchware-IA)
**Ferramenta de produção:** Diffusion Studio (https://github.com/diffusionstudio/editor), só nos bastidores.

Formato: 1920×1080, 30 fps, ~60 s, MP4 (H.264 + AAC).

## A história

Um único fluxo, sem cortes aleatórios:

**ideia → projeto → interface → componentes → eventos → blocos → lógica → app funcionando → Sketchware IA**

O app criado no vídeo é o **"Olá App"**: uma ImageView, um TextView (`textview1`), um EditText
(`edittext1`) e um Button (`button1`). A lógica, montada com blocos reais do Sketchware IA:

```
When button1 clicked
  if  (length of (edittext1 getText)) > 0  then
    textview1 setText (join "Olá, " and (edittext1 getText))
  else
    Toast "Digite seu nome"
```

No teste, a pessoa digita "Ana", toca em **Saudar** e o texto muda de **"Olá!"** para **"Olá, Ana"**.

Nada de demonstração de IA: o vídeo mostra o uso normal da plataforma (designer, componentes,
propriedades, eventos, blocos, Run).

## Roteiro e timeline

| Tempo | Cena | O que acontece | Texto | Som |
|---|---|---|---|---|
| 0–5 s | 01 Abertura | Fragmentos de interface flutuam em profundidade (botão, campo, blocos, ícones); a marca entra com escala e brilho; o nome é revelado por máscara; a câmera "atravessa" tudo | SKETCHWARE IA · *Transforme ideias em aplicativos.* | trilha discreta, impacto sutil na marca, whoosh na saída |
| 5–12 s | 02 Projeto | O celular entra; tela **Projects** → toque em **New Project** → formulário (*Enter application name*, *Package name*, *Project name*, *Theme Presets*) com digitação de "Olá App" → **Create App** → o editor abre com entrada escalonada | 01 PROJETO · *Comece um novo projeto* | toques, teclado, confirmação |
| 12–21 s | 03 Design | Câmera aproxima da paleta; ImageView, TextView, EditText e Button são arrastados para a pré-visualização; painel de propriedades: `text` → "Olá!", `textSize` 14 → 26, `textColor` → #6B5CE7, botão "Saudar" com `background` violeta, `hint` "Digite seu nome" | 02 DESIGN · *Crie a interface visualmente* | seleção, pop ao soltar, cliques |
| 21–31 s | 04 Eventos e blocos | Aba **Event** → `button1` › `onClick`; o editor de lógica cresce a partir do toque; blocos chegam da paleta (Control, Operator, View, Component) e encaixam um a um; o caminho lógico acende e aparece **Syntax OK** | 03 LÓGICA · *Crie a lógica visualmente* | *snap* a cada encaixe, brilho, confirmação |
| 31–39 s | 05 O app ganha vida | O editor recolhe para o celular; **Run** → "Building your awesome app..." → o app abre; digita "Ana", toca **Saudar** → os blocos se iluminam no cartão ao lado → "Olá, Ana" | 04 TESTE · *Seu app, ganha vida.* | clique, teclado, toque, confirmação |
| 39–47 s | 06 Plataforma | Movimento de câmera contínuo por todas as telas (projetos, novo projeto, designer, lógica, eventos, app) com camada de fundo em paralaxe | *Design.* · *Lógica.* · *Desenvolvimento.* | whooshes no tempo da música |
| 47–54 s | 07 Resultado | A pré-visualização sai do editor e vira o celular no centro; o app funciona de novo; crescendo; palavras em ritmo: DESIGN · EVENTOS · BLOCOS · LÓGICA · BUILD | 05 RESULTADO · *Projeto criado, app funcionando.* | riser até o impacto |
| 54–60 s | 08 Encerramento | Impacto musical em 54,0 s (tempo forte do compasso 28); marca, nome e frase final; fade | SKETCHWARE IA · *Crie. Programe. Teste.* | impacto + acorde final |

## Identidade e fidelidade ao produto

Tudo que aparece foi recriado a partir do que existe no repositório do Sketchware IA:

- **Cores:** esquema Material 3 do app (`res/values/m3_colors.xml`, primária `#6B5CE7`, superfícies
  `#F8F9FA` / `#FFFFFF` / `#F2F2F7`, badge *Native* `#EAF7ED`/`#17613A`).
- **Telas:** `main.xml` (busca, cards de projeto, *New Project*, navegação *Projects / Store / Web
  Service / Chat*), `myproject_setting.xml` (*New Project*, *Create App*, *Tap to change Icon*),
  `design.xml` e `view_editor.xml` (abas *Design / Event / Component / Strings*, paleta *Layouts* /
  *Widgets*, arquivo `main`, botão **Run**, "Building your awesome app..."), `logic_editor.xml`
  (*Syntax OK*).
- **Blocos:** textos e cores reais (`strings.xml`, `PaletteSelector.java`, `kq.java`): evento
  `When button1 clicked` (#C88330), Control `if then else` (#E1A92A), Operator `>`, `length of`,
  `join … and …` (#5CB722), View `setText` / `getText` (#4A6CD4), Component `Toast` (#2CA5E2);
  categorias *Variable, List, Control, Operator, Math, File, View, Component, More Block*.

Ícones e marca foram **desenhados do zero** para o vídeo (`tools/icons/make-icons.mjs`); nenhuma
imagem do repositório do Sketchware IA foi extraída ou convertida. Trilha e efeitos sonoros são
**sintetizados** (`tools/audio/make_audio.py`), sem bancos de áudio externos.

## Linguagem de movimento

Uma única família de curvas para o filme inteiro (`lib/core.tsx` → `E`):

- `out` — entradas e assentamentos (início rápido, pouso longo);
- `inOut` — câmera e transformações entre dois repousos;
- `in` — saídas;
- `back` — *pops* com overshoot moderado;
- `std` — microinterações de UI (Material standard).

Câmera 2D (`Camera`): *push-in*, *pull-out*, *pan* e leve rotação, com zoom interpolado em escala
logarítmica (velocidade constante) e um *drift* sutil nas pausas.

## Áudio

- Trilha original de 60 s a 120 BPM (1 compasso = 2 s), Am–F–C–G, energia crescente: intro
  discreta → groove (5 s) → palmas na lógica (21 s) → *break* curto (31 s) → energia total na
  montagem (39 s) → *build* + caixa em crescendo (50 s) → acorde final e impacto em **54,0 s**.
- 12 efeitos: `click`, `tap`, `select`, `pop`, `snap`, `type`, `whoosh`, `whoosh-soft`, `confirm`,
  `shimmer`, `riser`, `impact` — cada um colocado no quadro da ação correspondente
  (`index.tsx` → `SoundDesign`), sempre abaixo da música.
