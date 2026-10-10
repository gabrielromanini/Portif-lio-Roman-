# Histórico de alterações e decisões

O que foi pedido, o que foi feito, o que foi testado e não ficou, e o que está pendente. Vale ler antes de mexer em algo. Como cada efeito funciona está em [efeitos-visuais.md](efeitos-visuais.md).

Como a gente tem trabalhado:

- Uma mudança visual de cada vez, revisada no navegador antes da próxima.
- Os textos do site são impessoais ("estruturando", "desenvolvendo"). A exceção é "O que eu levo para o seu time", em primeira pessoa por escolha do Gabriel.
- Imagens novas vão em `src/assets/`, com nome minúsculo e sem espaço. No servidor, maiúscula e minúscula fazem diferença.

## 09/10/2026: pirâmide no Método e pilares com benefícios

- A pirâmide de testes subiu para dentro do Método, logo abaixo do texto de abertura; as abas vêm depois dela.
- Os pilares trocaram "Onde atua" por "Benefícios". Shift Left perdeu "Quality Champions" e ganhou "Prevenção de falhas". Testes funcionais ficou só com o texto e um botão "Conhecer mais", que leva à parte dos tipos de teste no Método. Automação ganhou o JMeter nas ferramentas; Quality Gates e IA aplicada ficaram sem ferramentas.
- Botão "Voltar ao topo" entre o Método e a Experiência.
- No topo, "Ver trajetória" virou "Conhecer meu método", levando ao Método.
- A pirâmide monta com menos rolagem: o pin caiu de 2,5 para 1,2 tela, e no celular ela termina de montar mais cedo.
- Trocar de aba no Método não faz mais a tela pular: a barra de abas fica no mesmo lugar.
- As bordas de cima e de baixo dos Pilares ficaram suaves (a névoa da cena terminava numa linha).
- O código de exemplo da aba Automação ficou em verde-petróleo.
- Aba Cultura: as barras viraram o time em pessoas (Produto, Design, Dev, QA, Liderança). No modelo tradicional só o QA acende; na cultura de qualidade todos acendem. Os quatro itens continuam embaixo.

## 07 a 09/10/2026: rolagem, profundidade e os Pilares em carrossel

Essa rodada mexeu no visual do site inteiro, com a ideia de usar mais interação ligada à rolagem (a referência inicial foi o site nfinitepaper.com), mantendo a paleta preta, prata e verde-petróleo.

O que ficou:

- Rolagem suave com Lenis, ligada ao relógio do GSAP (`src/lib/rolagem.ts`).
- A pirâmide de testes saiu da aba Estratégia e virou uma seção própria no fim do Método (`Camadas.tsx`). Ela fica presa na tela enquanto as camadas se montam. As camadas são vidro fosco com pontinhos verde-petróleo, saindo de um único triângulo para as laterais ficarem alinhadas. O título passou a ser "Estratégia inteligente, *menor custo*", já que o argumento da pirâmide é testar mais onde custa menos.
- Pilares em carrossel com colunas de vidro em 3D ao fundo. A ordem passou a ser Engenharia, Shift Left, Testes funcionais, Automação, Quality Gates, IA aplicada e Colaboração. O texto fica à esquerda, grande; a navegação é uma barra embaixo com setas e os nomes em botões; o carrossel passa sozinho a cada 7 s e pausa no hover. No celular, os pilares são cards em cascata com as colunas apagadas ao fundo.
- Sobre de volta ao formato simples original (título à esquerda, três parágrafos à direita).
- A seção "Por que um QA" virou "O que eu levo para o seu time", com textos escritos pelo Gabriel em primeira pessoa.
- Fundo da página com névoa em duas camadas (parallax) e grão de filme (`Profundidade.tsx`).
- O topo ganhou o fundo "Silver Arrow" atrás do menu também, o que tirou uma faixa preta que aparecia ali.
- Endereço sempre limpo (`gabrielromanini.com.br`, sem `#sobre` ao navegar pelo menu) e `canonical` no `<head>`. Links com `#seção` recebidos de fora continuam funcionando.
- Barra dos Pilares em tablets (768 a 1100px) vira o contador, porque os sete nomes não cabiam.
- Logo convertida para WebP (`logo-gr.webp`, 6 KB no lugar dos 545 KB do PNG).
- Saíram as texturas de fundo da Expertise (fibra de carbono) e do Método (grade de telemetria), e os divisores numerados do celular ("01 · Pilares" etc.).
- Expertise: "cultura de qualidade no time" virou "cultura de qualidade".

O que foi testado e descartado nessa rodada:

- Fundo de estrelas (canvas) e, depois, um bloom verde-petróleo que andava pela página. Testados duas vezes cada; o Gabriel preferiu sem.
- Grade de linhas no fundo da página toda.
- Linhas do topo espalhadas pelas outras seções.
- Para os Pilares, várias versões antes do carrossel: um "túnel" com os cards vindo do fundo, "cartas na mesa" espalhadas, cards em rodadas de 3, uma vista explodida em 3D e as colunas subindo com a rolagem. A rolagem presa ficava longa e cansativa.
- Para o Sobre: uma "janela de nave" com a Terra ao fundo, uma versão editorial com a Terra nascendo e uma janela de nave presa na tela. Voltou ao simples.
- Texto dos Pilares trocando de lado a cada pilar e uma faixa de luz atravessando o texto na troca.

## 07/10/2026: deploy na Netlify

O deploy publicava, mas mostrava "Page not found", porque o template do Lovable vinha preparado para a Cloudflare. Instalamos o plugin oficial `@netlify/vite-plugin-tanstack-start`, tiramos o `@cloudflare/vite-plugin` e desligamos o Nitro (`nitro: false`). O `netlify.toml` define o build (`npm run build`, publicando `dist/client`, Node 22). O build gera a página pré-renderizada e a função do servidor em `.netlify/v1/functions/`.

## 06/10/2026: títulos mais limpos, Método em abas e ajustes de celular

- Saíram os rótulos pequenos acima dos títulos. O "SOFTWARE QUALITY ENGINEER" acima do nome ficou, porque é o cargo.
- O Sobre virou um texto de venda em três partes: o caminho inverso (pensar em como o software falha antes do código), "Para empresas" e "Para quem está tirando uma ideia do papel".
- A Expertise passou a se chamar "Qualidade na *prática*".
- O Método foi reorganizado em abas reais, depois com a aba Cultura no fim. O "Ver no método" dos pilares abre a aba certa antes de rolar.
- Trajetória sem datas, com "Projetos Independentes" no topo.
- Saiu a seção de Ferramentas e Formação.
- O Contato foi reescrito para dois públicos: times e quem tem uma ideia.
- Menu com vidro escuro ao rolar, barra de progresso e item ativo marcado. O menu não ficava preso no topo por causa de um `overflow-x: hidden`; trocado por `clip`.
- No celular: menu em tela cheia, abas do Método com rolagem horizontal e cards que acendem ao entrar na tela.

## 05/10/2026: do site da Yole ao portfólio do Gabriel

O ponto de partida foi o commit `d3d5c42`, cópia do site da psicóloga Yole Lopes.

O conteúdo veio do currículo (Frota162, Autoforce, SóCarrão, Roit Bank, Mirum Brasil). O Método, que era uma página separada, virou seção da página única, porque parecia abrir outra aba. O contato é só o LinkedIn por enquanto; o telefone ficou de fora de propósito.

O visual foi para preto e prata, com referência em Mercedes-AMG e F1, e depois ganhou o verde-petróleo da Mercedes F1 como único destaque. Tudo o que era da Yole saiu, inclusive o Google Tag Manager dela (GTM-PFLC3XNT), que mandava as visitas do site do Gabriel para o analytics dela.

Coisas testadas que não ficaram nessa fase: números de destaque abaixo do topo (8+ anos, 5 squads...), textos em primeira pessoa, numeração dos pilares e do método, a página separada `/metodo`, reflexo passando sobre a foto, botões prata em todos os lugares e a luz dos títulos como camada por cima (clareava o fundo).

## Pendências

- Testar a cena 3D (colunas e pirâmide) no Safari, num Mac ou iPhone. O WebKit do Playwright no Windows não renderiza 3D.
- Contato direto: só há LinkedIn. Um botão de e-mail ou WhatsApp tende a converter mais, falta decidir qual.
- Imagem de compartilhamento (`og:image`) e link do GitHub no site.
- Arquivos sem uso em `src/assets/`: `logo-gr.png` (substituído pelo WebP), `pilares.png` e `BG.png` (original do fundo de traçados, mantido para gerar a versão leve).
- Expertise repete parte dos pilares; avaliar se continua.
- Métricas e heurísticas do Método: só o churn rate veio do currículo. Se houver números reais de antes e depois, vale destacar.
