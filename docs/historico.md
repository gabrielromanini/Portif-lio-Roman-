# Histórico de alterações e decisões

Registro do que foi pedido, o que foi feito, **o que foi testado e descartado** e **o que ficou pendente**. Serve para dar contexto antes de qualquer nova alteração. Como cada efeito funciona está em [efeitos-visuais.md](efeitos-visuais.md).

**Como a gente trabalha:**
- **Uma mudança visual de cada vez.** Revisar no navegador (`npm run dev`) antes da próxima.
- **Textos do site sem primeira pessoa:** "estruturando", "desenvolvendo", "Atuação com foco em…".
- **Fotos e imagens novas vão em `src/assets/`**, com nome sem espaço e em minúsculas (ex.: `gabriel-hero.jpeg`). No servidor, maiúscula e minúscula fazem diferença.

---

## 06/10/2026: títulos de seção mais limpos

- Removidos os rótulos pequenos acima dos títulos (Pilares, Sobre, Expertise, Método e as 9 partes dele, Trajetória, Contato). O título grande de cada seção ficou sozinho.
- Mantido o "SOFTWARE QUALITY ENGINEER" acima do nome, que é o cargo.
- Sobre: título mantido; os 3 parágrafos viraram um texto de venda em três partes: o caminho inverso (pensar em como falha antes do código), "Para empresas" e "Para quem está tirando uma ideia do papel" (esses dois trechos em branco, com o resto em cinza).
- Título da Expertise: "O que é entregue" virou "Qualidade na *prática*" (itálico cromado, como nos outros títulos).
- Método reorganizado em 5 abas reais (Estratégia, Testes, Produto, Métricas, Automação), juntando as partes sem apagar conteúdo; aba ativa em verde-petróleo. "Por que um QA" saiu das abas e virou seção própria logo depois do Sobre. O "Ver no método" dos pilares agora abre a aba certa antes de rolar.
- Nova aba "Cultura" no Método (depois movida para o fim, após Automação), com a mesma estrutura do Shift Left: papéis no lugar das fases, barra só em QA no modelo tradicional e em todos na cultura de qualidade.
- Aba Produto: a citação do primeiro card ficava colada embaixo; agora fica centralizada no espaço abaixo dos ícones.
- Trajetória: removidas as datas de cada cargo (a ordem das empresas continua a cronológica, da mais recente para a mais antiga).
- Trajetória: nova entrada no topo, "Projetos Independentes" (Desenvolvedor Front-end · Freelancer). Nomes das empresas com `lining-nums`, para os números de "Frota162" não ficarem desalinhados (a Cormorant usa números "de texto" por padrão).
- Removida a seção Ferramentas e Formação (lista de ferramentas e o card da UniCesumar).
- Resumo do topo: "liderando equipes de engenheiros de qualidade" encurtado para "liderando equipes".
- Contato reescrito para os dois públicos (vender também projetos, sem citar "sites" ou "sistemas"): título "Vamos construir algo com *qualidade*?" e duas colunas, "Para times" e "Para quem tem uma ideia".
- **Teste "Silver Arrow" no topo** (constante `FUNDO_HERO` em `index.tsx`; `"tracados"` volta ao fundo anterior): aço escovado escuro, faixa de luz verde-petróleo no canto inferior direito com 3 filetes a -14°, reflexo prateado no canto superior esquerdo, foto com sombra escura + toque petróleo. O fundo do topo desce 240px para dentro dos Pilares e apaga nos últimos 320px (antes terminava numa linha reta).
- Linhas dos Pilares redesenhadas em SVG (mesma geometria da imagem de traçados, espelhada): principal em verde-petróleo com glow e pontas apagadas; secundárias, tracejada e marcas em prata sutil.
- Contorno chanfrado dos cards: petróleo no chanfro indo a prata nas pontas; no hover, todo em #00A19C com glow.
- Reflexo do "Romanini" passou de branco para verde-petróleo (núcleo verde-água claro); os títulos continuam com a luz branca.
- Header: transparente no topo; depois de 40px vira vidro escuro (blur 14px, saturação 140%) e fica ~15% mais baixo. Barra de progresso de leitura petróleo na base (rAF + scaleX). Item do menu ativo em branco com traço petróleo (IntersectionObserver); no hover o traço cresce da esquerda. **Corrigido:** o menu não ficava preso no topo porque o contêiner da página usava `overflow-x: hidden` (virava contêiner de rolagem); trocado por `overflow-x: clip`. As seções já têm `scroll-margin-top` de 80px (`scroll-mt-20`); um `scroll-padding-top` extra no `html` foi testado e removido porque somava com ele (a seção parava a 160px do topo).
- **Celular (até 767px; desktop intocado, testado em 375, 393 e 1440px):**
  - Menu: só logo + botão de 2 linhas (vira X); painel em tela cheia com links em serifa 32px entrando em sequência, item atual com traço petróleo, LinkedIn no rodapé; fecha no link, no X ou no Esc; trava a rolagem e prende o foco.
  - Topo: 32px entre o menu e o "SOFTWARE QUALITY ENGINEER", com espaçamento entre letras .25em.
  - Abas do Método: scroll-snap, fade na borda com abas escondidas, aba ativa centralizada, deslize de dica uma vez, área de toque de 44px.
  - Títulos dos cards do Método (heurísticas, pirâmide, métricas): cor sólida #f0f0f0, 24px, peso 500, números alinhados.
  - Bloom: cards interativos acendem em petróleo quando 40% deles está na tela.
  - Espaçamento: seções com 56px em cima e embaixo, 24px entre título e primeiro parágrafo, sem padding somado entre as partes do Método.
  - Divisores entre seções ("01 · PILARES" … "06 · CONTATO"), com a linha crescendo do centro uma vez. "Por que um QA" conta como parte do Sobre (sem divisor entre os dois), e a linha de pista da Trajetória fica escondida no celular para não duplicar.
- Expertise ("O que é entregue") reescrita para quem não é da área de QA (o site também vai atender desenvolvedores e clientes de sites): Quality Engineering abrindo com "Software entregue com altíssima qualidade"; "Automação E2E" virou "Automação de testes", explicando o que é e o ganho; CI/CD sem citar Argo nem nomes de ferramentas de relatório.

---

## 05/10/2026: de site da Yole a portfólio do Gabriel (não publicado)

Ponto de partida: commit `d3d5c42`, cópia do site da psicóloga Yole Lopes.

### Conteúdo
- **Tema:** landing page pessoal / portfólio a partir do currículo (Frota162, Autoforce, SóCarrão, Roit Bank, Mirum Brasil; formação na UniCesumar).
- **Topo:** texto acima do nome "SOFTWARE QUALITY ENGINEER". Resumo: "Mais de 8 anos construindo qualidade de software em ambientes ágeis de alta escala: estruturando áreas de QA do zero, desenvolvendo software com ênfase em qualidade, liderando equipes de engenheiros de qualidade e aplicando Inteligência Artificial à engenharia de testes."
- **Pilares (7):** Engenharia orientada à qualidade, Automação de testes, IA aplicada à qualidade, Shift Left Testing, Testes funcionais, Quality Gates, Qualidade colaborativa. Cada um abre um modal com tópicos. Os textos de descrição e os 6 tipos de testes funcionais são do Gabriel; os demais tópicos foram sugeridos e aprovados. Em "Engenharia orientada", o 4º tópico é "O usuário no centro".
- **Método:** antes uma página separada (`/metodo`), virou seção da landing page porque "parecia abrir uma nova aba". Cobre por que contratar um QA, Shift Left, pirâmide, heurísticas, tipos de teste, comunicação com produto, métricas antes/depois, quality gates e automação com Page Objects.
- **Contato:** só LinkedIn por enquanto. O telefone do currículo ficou de fora de propósito.

### Visual
- **Paleta:** preto grafite + prata, inspirada em Mercedes-AMG/F1. Depois entrou um único acento verde-petróleo (#00A19C), da Mercedes F1, usado com parcimônia.
- **Nome:** hierarquia ("Gabriel" menor e sólido; "Romanini" maior, itálico, cromado vertical, deslocado), linha verde-petróleo abaixo e reflexo que passa só dentro do "Romanini".
- **Foto e logo:** foto de braços cruzados com moldura cromada; monograma GR prateado no menu.
- **Fundo do topo:** imagem de traçados gerada por IA, ampliada para 4K com o Upscayl, a 25%, só do lado esquerdo.
- **Pilares:** cards com contorno chanfrado (redesenhado em SVG a partir de uma imagem de referência) e modal com quadrados de aço escovado.
- **Botões:** aço escovado. Todos em grafite, menos o LinkedIn do menu (prata). Filete e hover em verde-petróleo.
- **Fundos por seção:** traçados espelhados (Pilares), fibra de carbono (Expertise), grade de telemetria (Método), linha de pista (Trajetória), glow radial (Contato).
- **Títulos:** faixa de luz que passa só dentro das letras.
- **Cards clicáveis:** hover com glow verde-petróleo e cursor de "mãozinha".

### Limpeza
- Removido tudo da Yole: a página `/ansiedade`, os componentes (`site/`, `anxiety/`, `decorative/`, `icons/`), o aviso de cookies, o link de WhatsApp, as imagens e a imagem de compartilhamento.
- **Removido o Google Tag Manager da Yole (GTM-PFLC3XNT):** as visitas do site do Gabriel estavam indo para o analytics dela.

### Testado
- `tsc` e `npm run build` sem erros.
- **Celular (375 px):** o nome não quebra linha nem estoura; a página não tem rolagem lateral.
- **No navegador controlado por script:**
  - a linha da Trajetória corre ao chegar na seção;
  - o modal dos pilares abre e fecha, e o "Ver no método" leva até a parte certa;
  - a máscara do topo está aplicada;
  - a luz dos títulos e o reflexo do "Romanini" ficam só dentro das letras;
  - os 4 quadrados do modal de "Engenharia orientada" estão idênticos.

### Testado e descartado
- **Números de destaque** abaixo do topo (8+ anos, 5 squads, ~23 devs, 5 QAs): não gostou.
- **Faixa de pilares** com texto prateado serifado: difícil de ler e com tamanhos diferentes.
- **Textos em primeira pessoa** ("Estruturo", "desenvolvo", "Como eu construo qualidade").
- **Numeração** dos pilares e das partes do método (01, 02…).
- **Página separada `/metodo`.**
- **Imagem de referência do contorno usada direto** como fundo dos cards: distorcia em cards de tamanhos diferentes. Foi redesenhada em SVG.
- **Primeira imagem de fundo** do topo, com fundo transparente e bordas "rasgadas": trocada por uma versão com fundo preto.
- **Traçados do topo do lado direito**, em volta da foto.
- **Botões prata polidos**, depois prata escovado em todos: ficaram em grafite escovado, menos o do menu.
- **Reflexo passando sobre a foto.**
- **Luz dos títulos como faixa por cima** (`::after` com `mix-blend-mode: overlay`): clareava o fundo fora das letras.
- **Luz dos títulos presa à tela** (`background-attachment: fixed`): não aparece no Chromium com texto recortado.

---

## Pendências

- **Contato direto:** hoje só há LinkedIn. Para vender projetos, um botão de e-mail ou WhatsApp ao lado tende a converter mais. Falta definir qual contato expor.

- **Salvar no git:** nada do dia foi commitado ainda. Também não há repositório remoto (GitHub) nem hospedagem configurados.
- **GitHub:** o link vai entrar no site depois.
- **Ícone da aba (favicon):** ainda é o da Yole. Gerar a partir do monograma GR.
- **Logo pesada:** `logo-gr.png` tem 545 KB para aparecer com 40 px de altura. Gerar uma versão leve.
- **Arquivos sem uso em `src/assets/`:**
  - `pilares.png` (1 MB, referência do contorno dos cards);
  - `BG.png` (2,1 MB, original do fundo do topo, mantido para gerar a versão leve).
- **Imagem de compartilhamento** (`og:image`) e domínio: inexistentes.
- **Modais com 3 tópicos** (Quality Gates e Qualidade colaborativa): sobra um espaço vazio na grade de 2 colunas. Falta um 4º tópico para cada.
- **Expertise × Pilares:** a seção Expertise repete parte dos pilares. Avaliar se sai.
- **Título "O que é entregue"** (Expertise): sugerido trocar por "Especialidades".
- **Reflexo do card de Contato:** ficou; perguntar se sai, como saiu o da foto.
- **Bloco "Produção"** dos quality gates: ainda prata; avaliar se fica grafite como os botões.
- **Métricas e heurísticas do Método:** só o churn rate veio do currículo; o resto foi sugerido. Se houver números reais de antes e depois, vale destacar.
