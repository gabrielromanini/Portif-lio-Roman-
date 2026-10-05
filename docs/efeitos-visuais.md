# Efeitos visuais e interações

Referência de **como funciona** cada efeito do site e **onde ajustar**. O histórico de decisões (o que foi pedido, testado, descartado e o que está pendente) fica em [historico.md](historico.md).

Estado: 05/10/2026, ainda não publicado.

---

## Mapa rápido

O site é **uma página só** (`src/routes/index.tsx`). Todo link do menu e dos pilares apenas rola até a seção (`#pilares`, `#metodo`…).

**Ordem:** Menu → Topo (nome + foto) → Pilares → Sobre → Expertise → Método (9 partes) → Trajetória → Ferramentas e Formação → Contato → Rodapé.

| Onde | Efeito | Arquivo principal |
|---|---|---|
| Menu | Vidro escuro fixo no topo; logo GR; botão LinkedIn em **prata escovado** | `Layout.tsx`, `.btn-chrome` |
| Topo | Fundo de traçados só à esquerda; nome com hierarquia; reflexo dentro do "Romanini"; linha verde-petróleo; foto com moldura cromada | `index.tsx`, `.text-chrome-reflexo`, `.frame-chrome` |
| Pilares | Traçados espelhados à direita; cards com canto chanfrado; modal com quadrados de aço escovado | `Pilares.tsx`, `Fundos.tsx` (`DiagonaisEspelhadas`) |
| Expertise | Textura de fibra de carbono (~3%) | `Fundos.tsx` (`FibraCarbono`), `.fibra-carbono` |
| Método | Grade de telemetria sutil | `Fundos.tsx` (`GradeTelemetria`), `.grade-telemetria` |
| Trajetória | Linha prata que "corre" a tela uma vez ao aparecer | `Fundos.tsx` (`LinhaPista`), `.linha-pista-*` |
| Contato | Glow radial atrás do título; reflexo que passa pelo card | `index.tsx` |
| Títulos (h2) | Faixa de luz que passa só dentro das letras | `.luz-passando` + `Layout.tsx` |
| Botões | Aço escovado preto com filete verde-petróleo; glow verde no hover | `.btn-steel-dark` |
| Cards clicáveis | Hover: sobe, borda e glow verde-petróleo, reflexo | `.card-chrome.group:hover`, `.sheen-hover` |

**Princípios que valem para tudo:**
- **Um acento só.** O verde-petróleo (`--teal`, #00A19C) aparece pouco: filete dos botões, hover de cards e botões, linha abaixo do nome e borda dos quadrados do modal.
- **Luz só dentro das letras.** Brilhos em texto são uma camada do próprio preenchimento (`background-clip: text`), nunca um `::before`/`::after` por cima (isso clareava o fundo).
- **Nunca use o atalho `background:`** em classes de texto com brilho (nem em hover ou keyframes): ele reseta o `background-clip` e o texto vira um retângulo. Use `background-image` e `background-position`.
- **Nada passa por cima da foto.** O reflexo que atravessava a foto foi removido a pedido.
- **`prefers-reduced-motion`** desliga todas as animações (reflexo, luz dos títulos, linha da pista, reflexo dos cards).
- **Conteúdo nunca depende de JS para aparecer.** O site é pré-renderizado; o JavaScript só dispara a linha da pista e alinha a luz dos títulos.

---

## Cores e tokens (`src/styles.css`, `:root`)

| Token | Valor | Uso |
|---|---|---|
| `--background` | grafite quase preto | Fundo da página |
| `--foreground` | branco levemente frio | Texto principal |
| `--muted-foreground` | cinza médio | Textos de apoio |
| `--silver` | prata | Ícones, linhas, pontos |
| `--teal` | #00A19C | O único acento |
| `--grad-chrome` | gradiente prata a 100° | Partes cromadas dos títulos (`.text-chrome`) |
| `--grad-chrome-vertical` | #fff → #e4e4e4 → #8a8a8a → #c9c9c9 | Cromado do "Romanini" |
| `--luz` | faixa branca a 105° | Luz que passa pelos títulos |

**Fontes:** Cormorant Garamond (títulos, inclusive itálico 500), Inter (texto) e JetBrains Mono (código do exemplo de Page Object). O link do Google Fonts fica em `Layout.tsx` (`FONTS_LINKS`).

---

## Topo

**Nome** (`index.tsx`, dentro do `<h1>`):
- "Gabriel": `clamp(48px, 6vw, 84px)`, peso 400, cor sólida #d4d4d4, sem efeito.
- "Romanini": `clamp(72px, 9vw, 128px)`, itálico 500, deslocado `0.3em` à direita, com `0.1em` de folga à direita para o itálico não cortar.
- Bloco: `line-height .9`, `letter-spacing -0.02em`, nunca quebra linha. Medido em 375 px: o "Romanini" termina em 291 px.
- Linha de acento: 180×2 px, #00A19C → transparente, com o mesmo `0.3em` do "Romanini" (por isso tem o mesmo `font-size`).

**Reflexo do "Romanini"** (`.text-chrome-reflexo`): duas camadas de `background-image`, a faixa (110°, branco .9) sobre o cromado vertical. `background-size: 250% 100%, 100% 100%`. A animação só mexe em `background-position`, de `150% 0` até `-50% 0`, em 4 s, `cubic-bezier(.2,.8,.2,1)`, com 1 s de atraso. Como o topo do cromado já é quase branco, o reflexo aparece mais na metade de baixo das letras.

**Texto acima do nome:** "SOFTWARE QUALITY ENGINEER" (componente `Eyebrow`).

**Fundo de traçados:** `<img>` com `bg-hero-3840.webp`, opacidade 25%, `mix-blend-mode: screen` (o preto da imagem some). A máscara `HERO_BG_MASK`, no topo de `index.tsx`, faz três coisas:
1. mostra só o lado esquerdo, sumindo entre 35% e 55% da largura;
2. apaga embaixo;
3. abre um "buraco" suave atrás do texto.

No celular a imagem ocupa só os 46% de baixo do topo, para nenhum risco de luz cruzar o nome.

**Foto:** moldura cromada (`.frame-chrome`), enquadramento `object-[50%_15%]` e sombra suave embaixo. Sem reflexo por cima.

---

## Pilares

**Cards** (`Pilares.tsx`): são `<button>`, então abrem o modal com teclado também. O primeiro, "Engenharia orientada à qualidade", ocupa 2 colunas. Cada card mostra ícone, nome e uma frase curta, **sem ferramentas** (regra: os pilares não são uma lista de ferramentas).

- **Canto chanfrado** (`CantoChanfrado`): SVG de tamanho fixo (340×240) no canto superior esquerdo, com duas linhas que se apagam nas pontas. É fixo para o ângulo não distorcer em cards de tamanhos diferentes. Por isso o texto começa mais abaixo (`pt-28`) e o ícone fica à direita.
- **Hover:** cursor de "mãozinha", o card sobe, acende em verde-petróleo e a seta do "Ver detalhes" dá um pulo.

**Modal** (Radix Dialog): fundo desfocado, zoom suave. Mostra a descrição, os tópicos em grade de 2 colunas, as ferramentas (discretas, só onde fazem sentido) e o botão "Ver no método". Esse botão fecha o modal e rola até a parte do método, com um pequeno atraso para a página já estar destravada.

**Quadrados do modal** (`.quadro-aco`, um único componente para os 7 modais):
- **Fundo:** riscos horizontais a .025 sobre o gradiente de #1c1d1f a #141516.
- **Borda superior:** 1 px em `rgba(0,161,156,.35)`.
- **Hover:** riscos a .04, gradiente de #232427 a #18191b e borda #00A19C, em .25 s.

A borda anima, mas o fundo troca de uma vez, porque navegadores não animam gradientes.

**Fundo da seção:** os mesmos traçados do topo, espelhados (`-scale-x-100`) para a direita. A máscara é aplicada antes do espelhamento, por isso "esquerda" no código vira direita na tela.

---

## Botões (`src/styles.css`)

| Classe | Onde | Acabamento |
|---|---|---|
| `.btn-chrome` | Só o LinkedIn do menu e o bloco "Produção" dos quality gates | Prata escovado: dois ritmos de riscos horizontais, reflexo vertical no meio, texto com leve efeito gravado, filete verde-petróleo de 2 px na base, glow verde no hover |
| `.btn-steel-dark` | Todos os outros (Ver trajetória, LinkedIn do topo, Falar no LinkedIn, Ver no método) | Aço grafite escovado, filete verde-petróleo na base; no hover a borda fica verde e solta glow |

Todo `<button>` tem cursor de "mãozinha" (regra em `@layer base`), porque o Tailwind 4 deixa botões com o cursor padrão.

---

## Cards (`.card-chrome`)

Vidro escuro com borda metálica fina (gradiente no `border-box`). Os cards com a classe `group` (pilares, Expertise, "Por que um QA" e Heurísticas) acendem no hover com borda, filete e glow verde-petróleo. Os outros (Ferramentas, Formação, Métricas) não reagem, para não parecerem clicáveis.

`.sheen-hover`: reflexo que atravessa o card uma vez no hover. `.sheen`: o mesmo reflexo passando sozinho a cada 8 s; hoje só no card de Contato.

---

## Luz dos títulos (`.luz-passando`)

Todos os `<h2>` de seção (Pilares, Sobre, Expertise, as 9 partes do Método, Trajetória e Contato) têm uma faixa de luz que passa **só dentro das letras**, a cada 9 s.

- **O título é um bloco de texto recortado:** a faixa (`--luz`) é a 1ª camada e a cor base (`--luz-base`, cinza-prata `oklch(0.8 …)`) é a 2ª. A cor base fica um pouco abaixo do branco de propósito: em texto branco, a faixa branca não aparece.
- **Partes cromadas do título** (`<em className="text-chrome">`) têm a faixa por cima do próprio cromado.
- **Para a faixa andar como uma só** pela parte cinza e pela parte cromada: `--luz-x` é registrada com `@property` e animada no título, e as partes herdam o valor. Cada parte desconta a própria distância até o início do título (`--dx`), medida por `useAlinharLuzDosTitulos` em `Layout.tsx`, que roda ao carregar, quando as fontes chegam e ao redimensionar a janela.
- **Os títulos têm `w-fit`**, para a faixa percorrer só a largura do texto. O de Contato tem `mx-auto`, para continuar centralizado.

**Descartado:** faixa presa à tela (`background-attachment: fixed`). No Chromium, combinada com `background-clip: text`, a luz simplesmente não aparecia.

---

## Fundos das seções (`src/components/portfolio/Fundos.tsx`)

Todos ficam atrás do conteúdo (`-z-10`) dentro de um `<div className="relative">` que ocupa a largura toda.

| Seção | Componente | Como funciona |
|---|---|---|
| Pilares | `DiagonaisEspelhadas` | Traçados do topo espelhados, 25%, só à direita, sumindo em cima e embaixo |
| Expertise | `FibraCarbono` | Padrão de sarja em CSS (`.fibra-carbono`), opacidade .03, apagando em cima e embaixo |
| Método | `GradeTelemetria` | Linhas de 1 px a cada 32 px (2,5%) e a cada 160 px (4,5%), sumindo nas bordas |
| Trajetória | `LinhaPista` | `IntersectionObserver`: quando a seção entra na tela, o trilho cresce da esquerda para a direita (1,8 s) com um "carro" de luz na ponta. Corre uma vez só |
| Contato | (em `index.tsx`) | Glow radial claro atrás do título; o card tem `isolate` para o glow ficar entre o fundo e o texto |

---

## Seção Método (`Metodo.tsx`)

Abre com "Como a qualidade é construída" e atalhos (chips) para as 9 partes:
1. Por que um QA (4 cards)
2. Shift Left (comparação "modelo tradicional × Shift Left")
3. Pirâmide (camadas desenhadas com `clip-path`)
4. Heurísticas (6 cards)
5. Tipos de teste (grade de 10)
6. Produto (citação + lista)
7. Métricas (Antes, Durante, Depois)
8. Quality Gates (Commit → Gate 1–4 → Produção + como são criados)
9. Automação (Page Objects + exemplo em Playwright)

Sem numeração visível (pedido: "não quero tudo enumerado").

---

## Como testar efeitos

Prints comuns do navegador sem janela (headless) **não são confiáveis** para este site. Eles capturam antes do JavaScript carregar e não disparam a rolagem; foi isso que fez a linha da pista e a máscara do topo parecerem quebradas. O que funcionou: controlar o Edge pelo protocolo DevTools (`--remote-debugging-port`) com um script em Node que:
- fixa o tamanho da tela com `Emulation.setDeviceMetricsOverride`;
- rola com `scrollBehavior = 'auto'` (o site usa rolagem suave);
- congela animações com um `<style>` injetado (`animation: none` + posição forçada) antes do print.
