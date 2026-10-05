# Efeitos visuais e interações

Referência de **como funciona** cada efeito do site e **onde ajustar**. O histórico de decisões (o que foi pedido, testado, descartado e o que está pendente) fica em [historico.md](historico.md).

Estado em produção: 01/10/2026 (ver o último commit em [historico.md](historico.md)).

---

## Mapa rápido

O site tem duas páginas: a **home** (`src/routes/index.tsx`) e **/ansiedade** (`src/routes/ansiedade.tsx`). Header, rodapé, botões e botão flutuante são compartilhados e ficam em `src/components/site/`. Contatos e links ficam em `src/lib/site.ts`.

**Home**, na ordem: Header → Hero → card "Sentindo ansiedade agora?" → Dores ("Quando buscar terapia") → Especialidades → Como funciona → Sobre → Prova social → Horários → FAQ → CTA final → Rodapé.

| Onde | Efeito | Arquivo principal |
|---|---|---|
| Header | Transparente no topo, vidro fosco ao rolar; logo marrom → colorido; link "Ansiedade"/"Início" no celular | `components/site/Header.tsx` |
| Hero | Entrada palavra por palavra; manchas de luz + parallax (desktop); selo com glow | `index.tsx` (`Hero`), `decorative/HeroGlow.tsx`, `styles.css` |
| Card "Sentindo ansiedade agora?" | Mini esfera que respira; folhas no hover; botão "Respirar agora" | `components/site/BreatheInvite.tsx` |
| Dores, Especialidades, Como funciona, Sobre | Folhas ao vento (ritmos A, B, C, D), sempre atrás do conteúdo | `decorative/WindLeaves.tsx` |
| Cards de Dores, Especialidades, Como funciona | Hover: sobe, ícone sálvia, folhas surgindo; o card "Ansiedade…" leva à /ansiedade | `decorative/CardLeaves.tsx` |
| Botões de WhatsApp | Verde → oliva no hover, com folhinhas; leve "afundar" ao tocar | `components/site/CTAButton.tsx`, `decorative/ButtonLeaves.tsx` |
| Botão "Entenda mais sobre a ansiedade" (Dores) | Sálvia → oliva no hover, com folhinhas | `index.tsx` (`Dores`) |
| Instagram | Ícone no header, botão contornado no Sobre, link no rodapé | `index.tsx`, `components/icons/InstagramIcon.tsx` |
| Botão flutuante | No celular só aparece depois do botão do hero e se esconde sobre o card de ansiedade | `components/site/FloatingWhatsApp.tsx` |
| Entre seções | Degradês de cor, sem linha dura | `style` inline de cada `<section>` |
| Ícones do WhatsApp e Instagram | Logos oficiais, herdam a cor do texto | `components/icons/` |

**/ansiedade:** ver a seção [Página /ansiedade](#página-ansiedade) mais abaixo.

**Princípios que valem para tudo:**
- **CSS puro sempre que possível.** JavaScript só onde é inevitável: física das folhas, parallax do mouse e detecção de rolagem.
- **Nada de estado do React por frame.** O JavaScript só muda variáveis CSS ou atributos `data-*`.
- **`prefers-reduced-motion`** respeitado em todos os efeitos.
- **Conteúdo nunca depende de JS para aparecer.** O site é pré-renderizado (SSR); animações de entrada são CSS e rodam sem hidratação.
- **Nada compete com o botão verde.** Os efeitos usam cores claras e opacidades baixas.

---

## Header

- **Topo (rolagem < 40 px):** fundo transparente, sem borda nem sombra; o bege do hero continua até o topo da tela.
- **Depois de 40 px:** em 0,4 s, fundo `#F5EFE6` a 80%, `backdrop-blur 12px`, sombra leve e borda sutil.
- **Como detecta:** um marcador invisível (`sentinelRef`) a 40 px do topo, observado por IntersectionObserver. Ao cruzar o limite, grava `data-scrolled="true|false"` no `<header>`. As classes `data-[scrolled=true]:…` fazem o resto.
- **Hero por baixo do header:** o header tem altura fixa (`HEADER_H`: 72 px mobile, 80 px desktop). O hero usa `UNDER_HEADER` (margem negativa + padding de mesmo valor) para começar atrás dele. **Se mudar a altura do header, mude as duas constantes juntas.**
- **Logo com crossfade** (`group/header` + `group-data-[scrolled=true]/header:`):
  - topo: `src/assets/logo-marrom.png` (desenho do logo em `#5E4638`, 5,6:1 no bege);
  - rolado: `logo-colorido.png`.
  - Tamanho: `h-14` (56 px) no mobile e `md:h-[70px]` no desktop.
- **Instagram:** ícone discreto (44×44 px, cor dos links do menu, hover escurece com fundo suave) à esquerda do botão verde. No mobile fica à direita do logo.
- **Mobile:** o botão "Conversa gratuita" do header fica escondido (`max-md:hidden`); ficam o logo e o ícone do Instagram.

## Hero

### Entrada ao carregar (~1,5 s)
- A animação `hero-in` (em `styles.css`) faz fade e sobe 0,4em em 0,5 s, com easing suave.
- A sequência vem do `animation-delay` inline:
  - selo em 0 ms;
  - palavras do título a partir de `HERO_IN_START_MS` (120 ms), a cada `HERO_IN_WORD_STEP_MS` (55 ms);
  - depois subtítulo, linha da TCC, botão e informações.
- O título está em `HERO_TITLE`. As palavras são separadas no JSX, então já saem separadas no HTML do servidor.
- **A foto não tem animação de entrada.** Ela usa `loading="eager"` e `fetchPriority="high"` para não atrasar o carregamento.

### Manchas de luz e parallax (só desktop)
- **Arquivo:** `decorative/HeroGlow.tsx`.
- **Manchas:** três, desfocadas (`blur-3xl`), em areia e sálvia claros. Cada uma deriva sozinha por CSS (`blob-drift-1/2/3`, ciclos de 19, 23 e 27 s).
- **Parallax:** `useHeroParallax` grava `--mx`/`--my` (de -1 a 1) no `<section>` conforme o mouse, com suavização.
  - As manchas seguem o mouse em 12 a 24 px (`PARALLAX_BLOB_PX`).
  - A foto vai 6 px no sentido contrário (`PARALLAX_PHOTO_PX`).
- **Quando liga:** só com tela ≥ 768 px, mouse de verdade (`hover: hover`, `pointer: fine`) e sem reduced-motion. No mobile as manchas nem são renderizadas (`hidden md:block`).

### Selo "Conversa inicial gratuita"
- **Visual:** fundo `#E3E8D8` a 85%, texto `#2E2F2A` e borda de 1 px `#D3DACA`.
- **Glow que respira:** `badge-glow`, ciclo de 4 s, ease-in-out, infinito. Com reduced-motion fica um glow fixo (`0 0 20px rgba(160,185,140,0.45)`).
- **Ícone de brilho:** pulsa e gira 10° junto (`sparkle-breathe`).
- **Desktop:** hover com leve subida e folhinhas.
- **Mobile:** `max-md:pointer-events-none`, sem hover e sem aparência de clicável, porque o selo não é um link.

### Ajustes só no mobile (< 768 px)
- **Título:** 31 px com line-height 1,25. No desktop continua `md:text-5xl` / 1,15.
- **Textos pequenos** (100% online, horário, CRP, TCC): `max-md:text-foreground/85`, 6,0:1 no bege.

## Folhas ao vento (`WindLeaves`)

**Uso:**
```tsx
<section className="relative overflow-hidden ...">
  <WindLeaves rhythm={RHYTHM_B} />   {/* sem prop = RHYTHM_A */}
  <div className="relative z-10 ...">conteúdo</div>
</section>
```
- As folhas ficam **sempre atrás do conteúdo**, no desktop e no mobile.
- A camada já recorta as próprias folhas, então o `overflow-hidden` na seção é opcional. **No "Sobre" ele não é usado de propósito:** quebraria a foto "grudada" (`sticky`) do desktop.

**Física** (constantes no topo de `WindLeaves.tsx`):

| Regra | Implementação | Constantes |
|---|---|---|
| Sempre anda para a direita | 40–90 px/s, ruído lento, nunca fora da faixa | `SPEED_X_*`, `WIND_NOISE_*` |
| Sem quique | Queda de 10–25 px/s + ondulação de 15–30 px, ciclo de 3–5 s | `FALL_SPEED_*`, `SWAY_*` |
| Giro de pêndulo | Inclina para onde vai, no máximo 30°/s | `ROT_*`, `TILT_FACTOR` |
| Capotar devagar | `scaleX` entre 0,4 e 1, ciclo de 2–4 s | `TUMBLE_*` |
| Suave | Lerp com `1 - e^(-taxa·dt)` + requestAnimationFrame | `VELOCITY_SMOOTHING`, `ROT_SMOOTHING` |

**Ritmos de rajada** (para as seções não parecerem sincronizadas):

| | A — Dores | B — Especialidades | C — Como funciona | D — Sobre |
|---|---|---|---|---|
| 1ª rajada | 0,5–2 s | 2,5–4,5 s | 1,2–3,2 s | 0,8–2,4 s |
| Folhas/rajada | 2–4 | 1–3 | 1–2 | 1–3 |
| Intervalo | 4–8 s | 5,5–9,5 s | 3–10 s | 5–8,5 s |
| Entre folhas | 0,4 s | 0,9 s | 0,65 s | 1,1 s |

- **Ritmo novo:** crie outro `GustRhythm` como constante de módulo. Um objeto criado a cada render reiniciaria a animação.
- **Desempenho:** até 8 folhas por seção no desktop e 7 no mobile. O loop só roda com a seção visível e respeita reduced-motion.

**Só no mobile (< 768 px)** — a tela é estreita e a seção fica alta (cards empilhados), então aparecia pouca folha:
- **Mais fluxo:** `MAX_LEAVES_MOBILE = 7` e intervalos entre rajadas pela metade (`MOBILE_GUST_INTERVAL_FACTOR = 0.5`). Cada ritmo mantém a sua proporção.
- **Nascem na parte visível** da seção, entre 5% e 70% dela (`MOBILE_VIEW_BAND_*`), e não espalhadas pela seção inteira.
- O desktop não é afetado: o site decide se é mobile pela largura da tela ao carregar.

**Bordas entre seções (desktop e mobile):** a camada termina no limite da seção, e uma folha que chegasse lá seria cortada numa linha reta, "denunciando" a divisão. Para evitar isso:
- **Esmaecem:** nos últimos `EDGE_FADE_PX = 90` px antes da borda de cima ou de baixo, folha e rastro vão ficando transparentes e somem.
- **Nascem longe da borda de baixo:** pelo menos `SPAWN_BOTTOM_CLEARANCE = 240` px acima dela.
- **Teste feito:** 25 s parado em cada divisa, lendo os pixels dos últimos 12 px antes da linha. Nenhuma folha encostou nela.
- **Imagens:** `public/folhas/folha1-4.webp`.

## Hover dos cards (`CardLeaves`)

- **Card:** `group relative overflow-hidden`; sobe 4 px em 0,5 s e a borda fica `secondary/50`.
- **Ícone:** fundo `bg-secondary/45` (sálvia) no hover.
  - Em Especialidades o ícone não tinha caixa: um `span` com margem negativa cria o fundo sem mexer no layout.
  - Em "Como funciona", o círculo do número vai de marrom a `bg-secondary`, com o número escuro.
- **Folhas:** entram deslizando e girando, com atrasos escalonados, e ficam com opacidade baixa (20–35%).
  - **Normal:** 3 disposições (0, 1, 2) com 5 folhas nos dois lados. Usada em Dores e Como funciona.
  - **`compact`:** 3 disposições com 3 folhas menores. Usada nos cards baixos de Especialidades.
- **Ordem das disposições** (vizinhos não repetem):
  - Dores: `DORES_LEAF_LAYOUTS = [0, 1, 2, 1, 2, 0]`, sem repetição na grade de 3 colunas nem no mobile.
  - Como funciona: `PASSOS_LEAF_LAYOUTS = [0, 1, 2, 0]`, grade de 2 colunas.
  - Especialidades: `i % 3`, sem repetição nas grades de 2 e 4 colunas.
- **Contexto:** `group-hover` do Tailwind v4 só existe em dispositivos com hover. No celular os cards ficam estáticos.

## Botões (`CTAButton`)

Todos os botões abrem o WhatsApp (`WHATSAPP_URL`). As variantes:

| Variante | Visual | Onde |
|---|---|---|
| `whatsapp` | Verde WhatsApp → **oliva** (`--olive`) no hover, sobe, folhinhas (`ButtonLeaves`) | Header, hero, Dores, Como funciona, Sobre, Horários |
| `outline` | Contorno marrom | FAQ ("Tirar dúvidas") |
| `light` | Branco | CTA final |
| `primary` | Marrom | (sem uso no momento) |

- **Folhinhas:** o botão usa `group/cta` e as folhas usam `group-hover/cta:`. O conteúdo vai num `span relative` para ficar por cima.
- **Toque/clique:** `active:scale-[0.98]`, um leve "afundar". Dá retorno no celular, onde não existe hover.
- **Botão do Instagram no Sobre:** não é `CTAButton`, porque abre o Instagram. Parado, fica contornado e transparente, para não concorrer com o verde. No hover segue o padrão (oliva, texto branco, sobe, folhinhas). No desktop fica ao lado do botão de WhatsApp e no mobile embaixo dele.
- **Botão flutuante:** sempre visível no desktop. No mobile começa invisível e ganha `data-show="true"` quando o botão principal do hero (classe `hero-cta`) sai da tela por cima. Aparece com fade e sobe em 0,3 s.

## Transições entre seções

Cada seção colorida tem um `linear-gradient` inline que vai de `transparent` à cor da seção e volta a `transparent`, para não haver corte entre seções. O hero só dissolve embaixo e o CTA final só em cima. As cores vêm das variáveis de `styles.css` (`--color-accent`, `--color-primary-soft`), então mudar a paleta lá já atualiza os degradês.

## Ícones do WhatsApp e do Instagram

- **Arquivos:** `components/icons/WhatsAppIcon.tsx` e `InstagramIcon.tsx`, com os paths oficiais do Simple Icons (licença CC0). Não usar o lucide para logos de marca.
- **Cor e tamanho:** `currentColor` e 1.1em por padrão, proporcional ao texto. Uma classe `h-*`/`w-*` sobrescreve, como no botão flutuante e no ícone do header.

## Links do Instagram

- **Endereço:** `INSTAGRAM_URL` no topo de `index.tsx`. Os três links usam `target="_blank"` e `rel="noopener noreferrer"`.
- **`aria-label`:** base `INSTAGRAM_LABEL` ("Instagram da psicóloga Yole Lopes"). Quando o link tem texto visível, o rótulo **inclui esse texto**: "Acompanhe no Instagram da psicóloga Yole Lopes" e "… (@yolepsico)". Sem isso, quem usa comando de voz não consegue acionar o link pelo que vê na tela.
- **Área de toque:** mínimo de 44×44 px no mobile (ícone do header, botão do Sobre e link do rodapé com `max-md:min-h-11`).

---

## Paleta atual (`src/styles.css`)

| Token | Cor | Uso |
|---|---|---|
| `--background` | off-white `#F7F5F2` | Fundo da página |
| `--foreground` | `#333333` | Texto |
| `--primary` | marrom `#5E4638` | Títulos pequenos, botões marrons |
| `--primary-soft` / `--accent` | bege `#D8CEC5` | Hero, seções alternadas, fundo de ícones |
| `--secondary` | sálvia `#7FAF9C` | Hover de ícones e bordas |
| `--whatsapp` | verde WhatsApp | Botões de WhatsApp |
| `--olive` | oliva `oklch(0.52 0.08 118)` | Hover dos botões de WhatsApp (branco 5:1) |

Cores fixas usadas no selo e no header: `#E3E8D8`, `#D3DACA`, `#2E2F2A`, `#F5EFE6`.

---

## Imagens

| Arquivo | Onde |
|---|---|
| `src/assets/yole-1.jpg` | Foto do hero (1085×1449, ~105 KB) |
| `src/assets/yole-2.jpg` | Foto do "Sobre mim" (1085×1450, ~143 KB) |
| `src/assets/yole-3.jpg` | Foto de "Horários" |
| `src/assets/logo-colorido.png` | Header rolado e rodapé |
| `src/assets/logo-marrom.png` | Header no topo (gerado a partir do logo verde) |
| `public/og-yole.jpg` | Imagem de compartilhamento (WhatsApp, redes) |
| `public/folhas/*.webp` | Folhas das animações |
| `imagens-nao-usadas/` | Fotos antigas, logos alternativos e PNGs originais. Não vai para o site |

**Trocar uma foto:** coloque a nova em `src/assets/` com outro nome e peça a conversão. Ela é otimizada (JPG, qualidade 82) e salva com o nome em uso. Assim o código não muda e a página não carrega arquivos de 2 MB. Cuidado com a extensão dupla (`yole-1.jpg.png`): no Windows, ative **Exibir → Mostrar → Extensões de nomes de arquivos**.

**Gerar variação de cor do logo** (mesmo desenho, outra cor), com o `sharp` que já está no projeto:
```js
const sharp = require('sharp');
const alpha = await sharp('imagens-nao-usadas/logo-verde.png').resize({ width: 480 }).ensureAlpha().extractChannel(3).toBuffer();
const { width, height } = await sharp(alpha).metadata();
await sharp({ create: { width, height, channels: 3, background: '#5E4638' } }).joinChannel(alpha).png().toFile('src/assets/logo-NOVA-COR.png');
```

---

## Como testar

- **Local:** `npm run dev` → `http://localhost:8080`. Se a porta estiver ocupada, o Vite usa a próxima (8081…) e mostra o endereço no terminal.
- **Fluxo:** toda alteração é testada primeiro aqui e só vai para produção (push na `main`) depois de aprovada.
- **Build de verificação:** `npm run build`, que gera `dist/` (ignorado pelo git). Use esse comando, e não `vite build --outDir` para outra pasta: a pré-renderização lê `dist/server`, e com outra pasta o HTML sai de um build antigo.
- **Mobile:** teste em 360 e 390 px de largura. Principais pontos: nada vaza para os lados, o header fica só com o logo e o botão flutuante aparece só depois do botão do hero.

---

## Página /ansiedade

Arquivos: `src/routes/ansiedade.tsx` (página, cores e textos) e `src/components/anxiety/` (respiração, características, ciclo, como a terapia ajuda e utilitários de rolagem).

**Ordem:** Respiração → Preocupação → "A ansiedade faz parte da vida…" (características) → O ciclo da ansiedade → Como a terapia pode ajudar → Fechamento (cacau) → Rodapé escuro.

**WhatsApp:** todos os botões da página abrem com "Olá, Yole! Vim pela página sobre ansiedade…" (`WHATSAPP_ANSIEDADE`), para saber a origem do contato.

### Fundo
- **Respiração:** foto do jardim (`assets/jardim-1672.webp` e `jardim-960.webp`) com véu creme, folhas ao vento em sequência calma (`LEAF_SEQUENCE`: uma a cada 3 s, mais lentas e mais apagadas) e esmaecimento no bege da seção seguinte.
- **Da 2ª seção até "Como a terapia…"** (`FundoFolhas`): imagem de folhas **fixa na tela** (`assets/fundo-ansiedade.webp`) enquanto o conteúdo rola. Máscara no topo para não encostar na foto da respiração; véu creme de 45% no desktop e 55% no celular. No celular a imagem aparece inteira, presa embaixo da tela, porque ela é horizontal.
- **Descida para a terra:** "Como a terapia…" vai até `#D3BBA0`; uma onda SVG leva ao cacau `#5A463A` do fechamento e do rodapé (bloco único, separados por uma linha fina).
- **Trocar a imagem de fundo:** coloque a nova em `src/assets` com qualquer nome e peça a conversão; ela é salva como `fundo-ansiedade.webp`.

### Respiração (`BreathingExercise.tsx`)
- Começa só com o clique ("Começar a respirar" ou na própria esfera). Ritmo: **inspira 3 s → segura 2 s → solta 5 s**, 5 respirações.
- Anel de progresso enche ao inspirar, **fica parado no "segure"** e esvazia ao soltar. Ao soltar, duas folhas se desprendem da esfera.
- Antes de começar, a esfera respira sozinha: no celular mais forte (70% → 84%, 4,5 s) para convidar ao toque.
- Hover (desktop): esfera cresce, luz de pérola segue o mouse, folhas reagem, texto vira "Clique para começar".
- Pausar/continuar em qualquer etapa. Camadas decorativas não capturam toque (o brilho cobria o "Pausar" no celular).
- Menos movimento: a esfera não muda de tamanho e não há folhas; o ritmo segue pelo texto e pelo anel.

### Características (`AnxietySigns.tsx`)
Botão verde-escuro "Entender as principais características da ansiedade" abre uma lista de blocos simples (sem marcação). Hover com folhas, como os cards da home.

### Ciclo da ansiedade (`AnxietyCycle.tsx`)
- **Desktop:** uma luz percorre o círculo. 1ª volta lenta (30 s) com o exemplo de cada etapa no centro; depois acelera até 18 s por volta e esquenta de sálvia para rosé-terracota (com teto). "Interromper o ciclo" aparece após a 1ª volta: a luz desacelera e para, o círculo se abre, uma folha sai e a página rola até "Como a terapia…". "Ver de novo" recomeça. Só anda com a seção na tela.
- **Celular:** lista vertical estática com brilho suave atrás e uma luz que desce pela linha **por trás dos ícones**.
- **Menos movimento:** a luz não anda sozinha; setas anterior/próxima.
- **Exemplos do dia a dia:** rascunho, no topo do arquivo (`STEPS`). **Revisar com a Yole.**

### Como a terapia pode ajudar (`TherapyHelp.tsx`)
Cards centralizados, entram em cascata ao rolar; hover sobe, ícone muda de tom, folhas aparecem e um brilho acende atrás. Bloom suave que respira atrás de todos (16 s).

### Tipografia
Títulos de seção em Cormorant negrito: 30 px no celular e 36 px no desktop (na home continuam 24 px no celular). Texto corrido Inter 18 px; blocos, ciclo e botões Inter 16 px.
