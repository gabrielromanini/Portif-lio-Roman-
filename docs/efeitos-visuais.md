# Efeitos visuais e interações

Como cada efeito funciona e onde ajustar. O que foi pedido, testado e descartado está em [historico.md](historico.md).

Estado em 09/10/2026.

## Visão geral

A página é uma só (`src/routes/index.tsx`) e os links do menu apenas rolam até a seção.

Ordem das seções: menu, topo, Pilares, Sobre, O que eu levo para o seu time, Expertise, Método, pirâmide de testes, Trajetória, Contato e rodapé.

| Onde | O que acontece | Arquivo |
|---|---|---|
| Menu | Transparente no topo; depois de 40px vira vidro escuro, fica mais baixo e mostra a barra de progresso de leitura | `Layout.tsx` (`useMenuAoRolar`) |
| Topo | Fundo "Silver Arrow" (aço escovado, faixa de luz e filetes), nome com reflexo no "Romanini", foto com moldura cromada | `index.tsx`, `Fundos.tsx` |
| Pilares | Carrossel com colunas de vidro em 3D ao fundo; no celular, cards em cascata | `Pilares.tsx` |
| Sobre | Título à esquerda e três parágrafos à direita | `index.tsx` |
| Método | 6 abas | `Metodo.tsx` |
| Pirâmide | Presa na tela enquanto as camadas se montam ao rolar | `Camadas.tsx` |
| Trajetória | Linha prata que corre a tela uma vez | `Fundos.tsx` (`LinhaPista`) |
| Fundo da página | Névoa em duas camadas com parallax e grão de filme | `Profundidade.tsx` |
| Títulos | Faixa de luz passando por dentro das letras | `.luz-passando` |

Algumas regras que valem para o site todo:

- O verde-petróleo (`--teal`) aparece pouco. Textos ficam em branco, prata e cinza; o verde é só detalhe.
- Brilho em texto é sempre uma camada do próprio preenchimento (`background-clip: text`). Um `::after` por cima clareia o fundo.
- Em classes de texto com brilho, nunca use o atalho `background:`. Ele zera o `background-clip` e o texto vira um retângulo. Use `background-image` e `background-position`.
- O contêiner da página usa `overflow-x: clip`. Com `hidden`, o menu deixa de ficar preso no topo.
- Nenhum ancestral de um elemento com `backdrop-filter` pode ter `opacity` menor que 1, `filter` ou `mask`, senão o desfoque deixa de enxergar o fundo.
- Com `prefers-reduced-motion`, as animações param e tudo aparece no estado final.
- O conteúdo nunca depende de JavaScript para aparecer. Sem JS, cada seção mostra o texto completo.

## Rolagem (`src/lib/rolagem.ts`)

O Lenis faz a rolagem suave e roda no mesmo relógio do GSAP, para que as animações presas à rolagem andem no mesmo quadro que a página. Com movimento reduzido, o Lenis não liga.

O `__root.tsx` põe a classe `js` no `<html>` antes da primeira pintura. O CSS usa essa classe para escolher entre a versão animada e a estática, então a página já nasce com a altura certa e não pula ao carregar.

## Pilares (`Pilares.tsx`)

No desktop é um carrossel. O texto do pilar fica à esquerda, sobre a cena, e embaixo há uma barra com setas e os sete nomes em botões. Sem interação, o carrossel passa sozinho a cada 7 segundos e a linha dentro do botão ativo mostra o tempo até o próximo. Passar o mouse num nome mostra aquele pilar e pausa; clicar fixa nele.

Ao fundo ficam sete colunas de vidro feitas em CSS 3D. Cada coluna é montada com "caixas" de cinco faces (componente `Caixa`) e usa o mesmo material da pirâmide: borda verde-água fina e pontinhos. A coluna do pilar atual acende, a câmera gira de leve na direção dela e, enquanto a seção está na tela, a cena "respira" com uma oscilação lenta de 2 graus. Atrás das colunas há duas fileiras de colunas-fantasma, só um gradiente que some para cima, além de névoa e partículas (pontos e pequenos "x") num canvas.

A troca de pilar tem um tempo próprio: o texto que sai some em 350 ms, subindo e desfocando, e o novo entra em 550 ms. Antes de mudar esses tempos, veja as regras `.pc-etapa` em `styles.css`.

No celular, os sete pilares viram cards em cascata. As colunas ficam presas ao fundo, apagadas, e o card que passa pelo meio da tela acende a coluna dele. Para isso o palco usa `overflow: clip` (com `hidden`, o fundo preso deixaria de funcionar).

Os pilares Engenharia, Shift Left, Testes funcionais e Colaboração ainda não têm ferramentas cadastradas, então o grupo "Ferramentas" não aparece neles.

## Pirâmide de testes (`Camadas.tsx`)

Título: "Estratégia inteligente, *menor custo*", com "Estratégia inteligente," sempre inteira na primeira linha.

A seção fica presa na tela (pin do ScrollTrigger) por 2,5 telas de rolagem, centralizada abaixo do menu. As três camadas descem e assentam da base para o topo, o texto da camada que está chegando acende ao lado, e no fim aparecem o brilho de trás e o selo "Quality gate aprovado".

As camadas saem de um único triângulo fatiado (`clip-path`), por isso as laterais ficam alinhadas. O material é vidro fosco (`backdrop-filter`) com pontinhos verde-petróleo mais densos na base, e o contorno é desenhado em SVG porque o `clip-path` corta a borda. No celular a pirâmide monta sem prender a tela.

## Fundo da página (`Profundidade.tsx`)

São duas camadas de manchas de luz bem difusas, em prata e verde-petróleo. Quando a página rola, a camada de trás anda mais devagar que a da frente, e é essa diferença que dá a sensação de profundidade. Por cima vai um grão de filme fixo a 6,5% de opacidade, gerado em SVG, para o preto não ficar chapado. As cores e posições das manchas ficam nas constantes `FUNDO` e `FRENTE`.

## Cores e fontes

Os tokens ficam em `:root`, no `styles.css`:

| Token | Uso |
|---|---|
| `--background` | Fundo da página (grafite quase preto) |
| `--foreground` | Texto principal |
| `--muted-foreground` | Textos de apoio |
| `--silver` | Ícones e linhas |
| `--teal` | O acento verde-petróleo, #00A19C |
| `--grad-chrome` | Partes cromadas dos títulos (`.text-chrome`) |

Fontes: Cormorant Garamond nos títulos, Inter no texto e JetBrains Mono nos detalhes técnicos (números, rótulos pequenos, exemplo de código). O link do Google Fonts fica em `Layout.tsx`.

## Topo

O nome tem hierarquia: "Gabriel" menor e sólido, "Romanini" maior, em itálico e cromado, deslocado para a direita, com uma linha verde-petróleo embaixo. O reflexo que passa pelo "Romanini" é uma camada do próprio texto e anima só o `background-position`.

O fundo "Silver Arrow" é todo em CSS: aço escovado escuro, uma faixa de luz verde-petróleo no canto inferior direito com três filetes e um reflexo prateado no canto oposto. Ele começa atrás do menu e desce 240px para dentro dos Pilares, apagando aos poucos.

## Luz dos títulos (`.luz-passando`)

Os títulos de seção têm uma faixa de luz que passa por dentro das letras a cada 9 segundos. Para a faixa atravessar a parte cinza e a parte cromada como se fosse uma só, cada parte desconta a própria distância até o início do título (`--dx`), medida por `useAlinharLuzDosTitulos` em `Layout.tsx`.

## Botões e cards

`.btn-steel-dark` é o aço grafite usado em quase todos os botões, com um filete verde-petróleo na base. `.btn-chrome`, prata escovado, fica só no LinkedIn do menu e no bloco "Produção" dos quality gates.

`.card-chrome` é o vidro escuro com borda metálica. Cards com a classe `group` acendem no hover; os outros não reagem, para não parecerem clicáveis.

## Método (`Metodo.tsx`)

São seis abas reais: Estratégia, Testes, Produto, Métricas, Automação e Cultura. Os painéis fechados continuam no HTML, então o conteúdo segue indexável. A função `irParaMetodo` abre a aba certa antes de rolar até uma parte; a lista de partes de cada aba fica em `ABAS`.

## Como testar

Uso o Playwright (`playwright-core`) com o Chromium para tirar prints e medir posições. Algumas coisas que aprendi:

- Teste em `npm run build` + `npx vite preview`, não no `dev`.
- Depois da rolagem, espere um pouco antes do print: o Lenis suaviza o movimento e a animação leva um instante para chegar.
- O WebKit do Playwright no Windows não renderiza CSS 3D, então as colunas e a pirâmide aparecem achatadas nele. Para o Safari, teste num Mac ou iPhone de verdade.
- O Chromium sem placa de vídeo mede menos quadros por segundo que um computador normal. Compare com uma seção simples antes de concluir que algo está pesado.
