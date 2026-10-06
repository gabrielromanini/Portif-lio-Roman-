# Site Gabriel Romanini

Landing page pessoal (portfólio) de Gabriel Romanini, Software Quality Engineer: trajetória, pilares da qualidade de software e o método de trabalho, numa página única.

Visual preto e prata, inspirado em Mercedes-AMG / F1, com um único acento verde-petróleo (#00A19C).

Hospedagem: **Netlify**, com deploy a partir do repositório no GitHub (ver [Publicar](#publicar-na-netlify)).

---

## Tecnologias

- **React 19 + TypeScript**: interface
- **Tailwind CSS 4**: estilização
- **TanStack Start** (Vite): bundler, roteamento e pré-renderização (SSR)
- **Radix UI**: o modal dos pilares
- **lucide-react**: ícones
- **@netlify/vite-plugin-tanstack-start**: adapta o build para a Netlify
- **sharp** (já vem nas dependências): usado para converter e redimensionar imagens

O projeto começou como cópia do site da psicóloga Yole Lopes. Tudo o que era dela (páginas, componentes, imagens, analytics) foi removido em 05/10/2026.

---

## Estrutura do projeto

```
site-gabriel/
├── src/
│   ├── routes/
│   │   ├── index.tsx        ← a landing page: topo, Sobre, Expertise, Trajetória, Contato (e a ordem das seções)
│   │   └── __root.tsx       ← <head> global (sem analytics)
│   ├── components/portfolio/
│   │   ├── Layout.tsx       ← menu, rodapé, Eyebrow, fontes e o alinhamento da luz dos títulos
│   │   ├── Pilares.tsx      ← os 7 pilares e o modal de cada um
│   │   ├── Metodo.tsx       ← "Como a qualidade é construída" (6 abas) e a seção "Por que um QA"
│   │   └── Fundos.tsx       ← fundos decorativos das seções
│   ├── lib/site.ts          ← nome e link do LinkedIn
│   ├── assets/              ← foto, logo e fundo do topo
│   └── styles.css           ← cores, fontes e todos os efeitos (cromado, aço escovado, luz…)
├── public/                  ← favicon (ainda o da Yole)
└── docs/                    ← efeitos-visuais.md (como funciona) e historico.md (decisões e pendências)
```

---

## Onde mexer

| O quê | Arquivo |
|---|---|
| Texto do topo, Sobre, Expertise, Trajetória, Contato | `src/routes/index.tsx` |
| Os 7 pilares (texto do card, tópicos e ferramentas do modal) | `src/components/portfolio/Pilares.tsx`, constante `PILARES` |
| Seção Método (Shift Left, pirâmide, heurísticas, quality gates…) | `src/components/portfolio/Metodo.tsx` |
| Itens do menu | `src/components/portfolio/Layout.tsx`, constante `NAV` |
| Nome e link do LinkedIn | `src/lib/site.ts` |
| Cores, gradientes e efeitos | `src/styles.css` (ver [docs/efeitos-visuais.md](docs/efeitos-visuais.md)) |
| Foto do topo | `src/assets/gabriel-hero.jpeg` (pode substituir mantendo o nome) |
| Logo do menu | `src/assets/logo-gr.png` |
| Fundo de traçados do topo | `src/assets/bg-hero-3840.webp`, gerado a partir de `src/assets/BG.png` |

**Textos do site:** sem primeira pessoa. Use "estruturando", "desenvolvendo", "Atuação com foco em…", nunca "eu estruturo".

---

## Como rodar localmente

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev
```

O site abre em `http://localhost:8080`. Se a porta estiver ocupada, o terminal mostra a próxima livre (ex.: 8081).

Para conferir a versão final (mais rápida, igual à publicada):

```bash
npm run build
npx vite preview
```

---

## Trocar o fundo de traçados do topo

1. Salve a imagem nova por cima de `src/assets/BG.png`, de preferência com **fundo preto** (não transparente) e em **3840×2160**.
2. Gere a versão leve que o site usa:

```bash
node -e "require('sharp')('src/assets/BG.png').resize(3840).webp({quality:85}).toFile('src/assets/bg-hero-3840.webp')"
```

O preto some sozinho no site (`mix-blend-mode: screen`), então não precisa remover o fundo.

---

## Publicar na Netlify

O projeto usa o plugin oficial `@netlify/vite-plugin-tanstack-start` (em `vite.config.ts`). O Nitro do Lovable, que gerava o build para a Cloudflare, fica desligado (`nitro: false`).

O `netlify.toml` já define tudo:

| Campo na Netlify | Valor |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist/client` |
| Node | 22 |

O build gera a página pré-renderizada em `dist/client` e a função do servidor em `.netlify/v1/functions/` (a Netlify pega essa pasta sozinha).

Com o repositório ligado à Netlify, cada `git push` na `main` publica o site.
