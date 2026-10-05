# Histórico de alterações e decisões

Registro do que foi pedido, o que foi feito, **o que foi testado e descartado** e **o que ficou pendente**. Serve para dar contexto antes de qualquer nova alteração. Como cada efeito funciona está em [efeitos-visuais.md](efeitos-visuais.md).

**Como a gente trabalha:**
- **Uma mudança visual de cada vez.** Revisar no navegador (`npm run dev`) antes da próxima.
- **Textos do site sem primeira pessoa:** "estruturando", "desenvolvendo", "Atuação com foco em…".
- **Fotos e imagens novas vão em `src/assets/`**, com nome sem espaço e em minúsculas (ex.: `gabriel-hero.jpeg`). No servidor, maiúscula e minúscula fazem diferença.

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
- **Datas do currículo:** Autoforce até set/2025 e Frota162 desde jun/2025 se sobrepõem. Confirmar.
- **Métricas e heurísticas do Método:** só o churn rate veio do currículo; o resto foi sugerido. Se houver números reais de antes e depois, vale destacar.
