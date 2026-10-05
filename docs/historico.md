# Histórico de alterações e decisões

Registro do que foi pedido, o que foi feito, **o que foi testado e descartado** e **o que ficou pendente**. Serve para dar contexto antes de qualquer nova alteração. Como cada efeito funciona está em [efeitos-visuais.md](efeitos-visuais.md).

**Como a gente trabalha:**
- **Uma mudança visual de cada vez.** Revisar no navegador (`npm run dev`) antes da próxima.
- **Mudanças grandes de visual** (paleta, por exemplo) são feitas como teste, com cópia de segurança, para poder voltar.
- **Publicar:** commit + push na `main` → o Netlify publica sozinho em 1–2 minutos.

---

## 01/10/2026 — Página /ansiedade e card na home (em produção)

**Estrutura:** header, rodapé, botões e botão flutuante foram separados em `src/components/site/` para servir às duas páginas (a home ficou visualmente igual; links do menu passaram a `/#seção`). A pré-renderização ignora links com `#`.

**Página /ansiedade:**
| Parte | Resultado |
|---|---|
| Respiração | Exercício guiado com esfera, anel, folhas e foto de jardim. Ritmo final 3 s / 2 s / 5 s. "Vamos começar?" no lugar de "Pronto?" |
| Preocupação | Título "Preocupação" + botão "Quero conversar com a Psico Yole" |
| Características | Botão verde-escuro que abre 9 blocos (com "O coração acelera sozinho…"), revisados em português |
| Ciclo | Luz que percorre o círculo, acelera e esquenta; "Interromper o ciclo" leva a "Como a terapia…". No celular, luz descendo atrás dos ícones |
| Como a terapia ajuda | 6 cards centralizados, revisados, com hover de folhas e bloom |
| Fechamento | Título serifado, botão "Quero agendar uma conversa inicial", nota do CVV/SAMU em 14 px |
| Fundo | Foto do jardim no topo; imagem de folhas fixa da 2ª seção em diante; desce até a terra e o cacau |

**Home:**
- Card "Sentindo ansiedade agora?" logo abaixo do hero (sobreposto no desktop, abaixo da foto no celular), com mini esfera, folhas no hover e só o botão "Respirar agora" clicável. Texto: "Em 1 minuto, seu corpo pode começar a desacelerar. Depois, entenda mais sobre a ansiedade aqui." ("aqui" é texto comum, aponta para o botão).
- Degradê do fim do hero mais longo (~360 px) para não aparecer linha atrás do card.
- Botão "Entenda mais sobre a ansiedade" ao lado do "Agende uma consulta" e card "Ansiedade e preocupações constantes" clicável.
- Removidos os rótulos "Especialidades", "Passo a passo", "Dúvidas frequentes" e a linha "Resposta no horário comercial…".
- Header: "Ansiedade" no menu (depois de "Início"); no celular o link fixo alterna entre "Ansiedade" (home) e "Início" (/ansiedade). Rodapé: sem a linha duplicada do telefone e com "Ansiedade" na navegação.

**Testado:** home e /ansiedade em 320, 390, 768, 1024 e 1366 px — nada vaza, nenhum texto coberto ou cortado, sem erros de JavaScript. Português revisado. Contraste medido no fundo real de cada texto.

**Testado e descartado nesta rodada:**
- Onda animada na base da foto da respiração ("achei ruim").
- Paletas da /ansiedade: grama→terra verde, areia/rosé/taupe, neblina cinza-sálvia — voltou-se ao esquema da home com descida para a terra.
- Botão do card como pílula grande "Respire comigo por 1 minuto" com halo pulsando; card inteiro clicável; "aqui" como link.

---

## 30/09/2026 — Instagram e folhas

| Pedido | Resultado |
|---|---|
| Adicionar o Instagram (@yolepsico) | Componente `InstagramIcon` com o logo oficial. **Header:** ícone discreto à esquerda do botão verde; no mobile à direita do logo. **Sobre:** botão "Acompanhe no Instagram", contornado quando parado e com hover no padrão dos botões (oliva + folhinhas). **Rodapé:** trocado o ícone genérico pelo oficial. Todos com `target="_blank"`, `noopener`, `aria-label` e toque ≥ 44 px |
| Botões funcionando bem no mobile | Leve "afundar" ao tocar em todos os botões principais (`active:scale-[0.98]`). Toques testados: todos abrem o endereço certo e nada cobre os botões |
| Mais folhas no mobile | Até 7 por seção (antes 4), rajadas com o dobro da frequência, nascendo na parte visível da seção. Desktop inalterado |
| Folhas também no "Sobre" | Ritmo D (calmo e espaçado). Sem `overflow-hidden` na seção para não quebrar a foto "grudada" do desktop |
| Folhas sumindo "na linha" entre seções | Esmaecem nos últimos 90 px antes da borda e nascem a pelo menos 240 px do fim da seção. Vale para desktop e mobile |

**Testado e descartado nesta rodada:**
- **Folhas na frente dos cards no mobile** (para aparecerem mais) e, no "Sobre", atrás só da foto. Não agradou ver as folhas sobre os cards. Decisão: **folhas sempre atrás do conteúdo**, também no mobile.

**Confirmado:** a velocidade das folhas no desktop não mudou. A sensação de "mais folhas" vem da seção "Sobre", que ganhou folhas. A quantidade por seção no desktop continua a mesma e deve ser mantida.

---

## 29/09/2026 — remoção do eyebrow do "Sobre"

- Removido o "SOBRE MIM" acima do título "Sobre a psicóloga Yole Lopes", porque repetia a mesma ideia. Mesmo critério usado na seção 2.

## 29/09/2026 — commit `fced00a` (em produção)

### Efeitos e interações
| Pedido | Resultado |
|---|---|
| Folhas ao vento na seção Dores | Canvas com física de vento. A v1 "quicava" (parada, subindo e descendo, girando rápido) e a física foi reescrita com regras explícitas (v2 aprovada) |
| Replicar as folhas em outras seções, sem sincronizar | Especialidades (ritmo B) e Como funciona (ritmo C) |
| Hover nos cards de Dores | Card sobe, ícone ganha fundo sálvia, folhas surgem. Depois: folhas dos dois lados, 3 disposições alternadas sem vizinhos iguais |
| Mesmo hover nas seções 3 e 4 | Especialidades (versão `compact`) e Como funciona |
| Botões de WhatsApp com hover oliva e folhas | Verde WhatsApp parado, oliva no hover, folhinhas entrando pelos cantos. Primeira versão mostrava só a ponta das folhas e foi corrigida |
| Botão de Dores e botão "Tirar dúvidas" do Sobre | Passaram de marrom para verde WhatsApp (mesmo padrão) |
| Ícone do WhatsApp "amador" | Trocado pelo path oficial do Simple Icons, com `currentColor` e tamanho 1.1em |

### Hero
| Pedido | Resultado |
|---|---|
| Selo "Conversa inicial gratuita" | Primeiro virou oliva com folhas. Depois ficou sálvia claro, borda fina e glow que respira (4 s) |
| Entrada ao carregar | Palavra por palavra (CSS), ~1,5 s no total. Foto sem animação e com `fetchpriority="high"` |
| Manchas de luz + parallax | Três manchas desfocadas atrás da foto, só no desktop |
| Horário | "Seg a sex" → "Seg. a sex., 10h às 20h". A seção Horários continua "Das 10h às 20h" (chegou a ir para 8h e voltou: o certo é 10h) |
| Seção 2 | Removido o eyebrow "Quando buscar terapia", que repetia o título |

### Header
| Pedido | Resultado |
|---|---|
| Header transparente no topo, vidro fosco ao rolar | IntersectionObserver com marcador a 40 px. O hero passou a começar por baixo do header |
| Logo sem contraste no bege | O pedido era usar `logo-verde.png`, mas a medição mostrou contraste ainda pior (1,4:1). Testado verde escuro `#3D6A61` (4:1); **escolhido marrom `#5E4638`** (5,6:1). Crossfade para o colorido ao rolar. Logo 25% maior no desktop |

### Mobile (< 768 px)
- Header só com o logo; o botão "Conversa gratuita" fica escondido.
- Botão flutuante aparece só depois que o botão principal do hero sai da tela.
- Título do hero com 31 px.
- Textos pequenos do hero mais escuros (4,1:1 → 6,0:1).
- Selo sem hover nem cursor de clique.
- **Nada do desktop foi alterado** nesta etapa.

### Imagens
- Novas fotos `yole-1` (hero) e `yole-2` (Sobre). Vieram em PNG de ~2 MB, uma delas com nome `yole-1.jpg.png`, e foram convertidas para JPG de ~105–145 KB.
- `src/assets/` ficou só com o que o site usa. Fotos antigas, logo branco, logo verde, logo verde escuro e os PNGs originais foram para `imagens-nao-usadas/`.

---

## Testado e descartado (não repetir sem motivo)

| O quê | Por que saiu |
|---|---|
| Pacote de efeitos de uma vez (folhas SVG + parallax no scroll + seções surgindo com fade) | O resultado ficou ruim e foi desfeito inteiro. Daí a regra de uma mudança por vez |
| Folhas v1 (física por força/arrasto) | Pareciam quicar. Substituídas pela v2 |
| **Paleta areia + verde-sálvia** (fundo `#F5EFE6`, seções `#E3E8D8`, botões oliva `#5E6E45`) | Não agradou. Foi testada uma segunda variação (todos os botões `#1FA851` e destaque `#D3DACA`), também revertida. Voltou-se à paleta original |
| `logo-verde.png` no header transparente | Contraste de 1,4:1 no bege, pior que o colorido |
| Verde escuro `#3D6A61` no logo do header | Funcionava (4:1), mas o marrom foi preferido |
| Folhas na frente dos cards no mobile | Deixava as folhas visíveis, mas não agradou vê-las sobre os cards. Ficam sempre atrás |

---

## Pendências e pontos em aberto

- **Exemplos do ciclo da ansiedade** (`AnxietyCycle.tsx`, `STEPS`): rascunho, a Yole precisa revisar.
- **"consigo mesma"** em "Como a terapia pode ajudar" está no feminino.
- **Contraste abaixo do AA (decisão da usuária manter):** botões verdes do WhatsApp (2,7:1) e, no hero da home, "Um espaço para acolher…" (4,2:1) e "Terapia Cognitivo-Comportamental." (3,3:1).
- **Header em 768 px exatos:** apertado ("Como funciona" quebra e o botão verde fica com 4 linhas). Já existia.
- **Imagem de fundo da /ansiedade** é horizontal; uma versão vertical deixaria as folhas mais presentes no celular.

- **Botões fora do padrão verde:** "Tirar dúvidas" do FAQ (`outline`) e o botão do CTA final (`light`, branco). Ainda não foi decidido se ficam verdes.
- **Contraste no desktop:** os textos pequenos do hero (100% online, horário…) estão em 4,1:1, abaixo do AA. No mobile foi corrigido; no desktop foi mantido a pedido.
- **Contraste do verde WhatsApp:** texto branco sobre o verde dá ~2,7:1, abaixo do AA. Mantido de propósito ("não mudar as cores das iscas").
- **Logo colorido no header rolado:** o nome em rosado claro dá 2,2:1 sobre o creme. É possível gerar uma versão com o nome mais escuro.
- **Selo "Conversa inicial gratuita":** não é clicável. Foi oferecido transformar em link para o WhatsApp, sem resposta ainda.
- **Formatação (Prettier):** o lint aponta ~1000 avisos de formatação, na maior parte quebras de linha do Windows (CRLF) e linhas longas antigas. Não afetam o site nem o build do Netlify. Se for rodar `eslint --fix`, fazer num commit separado, só de formatação.
- **Avisos de Fast Refresh:** `WindLeaves.tsx` e `HeroGlow.tsx` exportam constantes junto com componentes. Só afeta o recarregamento no `npm run dev`.
