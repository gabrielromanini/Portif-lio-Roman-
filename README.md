# Site Gabriel Romanini

Portfólio de Gabriel Romanini, Software Quality Engineer. É uma página única com a trajetória, os pilares de qualidade de software e o método de trabalho.

O visual é preto e prata, com referência em Mercedes-AMG e F1, e um único tom de destaque: o verde-petróleo #00A19C. O site fica hospedado na Netlify, que publica a partir da branch `main` no GitHub.

## Tecnologias

- React 19 com TypeScript
- Tailwind CSS 4
- TanStack Start (Vite), que faz o roteamento e pré-renderiza a página
- GSAP com ScrollTrigger, para as animações ligadas à rolagem (a pirâmide)
- Lenis, para a rolagem suave
- lucide-react, para os ícones
- `@netlify/vite-plugin-tanstack-start`, que adapta o build para a Netlify
- sharp, usado para converter e redimensionar imagens

O projeto nasceu como cópia do site da psicóloga Yole Lopes. Tudo o que era dela foi removido em 05/10/2026.

## Estrutura

```
site-gabriel/
├── src/
│   ├── routes/
│   │   ├── index.tsx        a página: topo, Sobre, Expertise, Trajetória, Contato e a ordem das seções
│   │   └── __root.tsx       <head> global e a classe "js" posta antes da pintura
│   ├── components/portfolio/
│   │   ├── Layout.tsx       menu, rodapé, fontes e o fundo da página
│   │   ├── Profundidade.tsx névoa em parallax e grão de filme do fundo
│   │   ├── Pilares.tsx      os 7 pilares: carrossel com colunas 3D (cards no celular)
│   │   ├── Metodo.tsx       "Como a qualidade é construída" (6 abas) e "O que eu levo para o seu time"
│   │   ├── Camadas.tsx      a pirâmide de testes que se monta ao rolar
│   │   └── Fundos.tsx       fundo do topo, linhas dos Pilares e a linha da Trajetória
│   ├── lib/
│   │   ├── rolagem.ts       GSAP, ScrollTrigger e Lenis
│   │   └── site.ts          nome e link do LinkedIn
│   ├── assets/              foto, logo e fundo do topo
│   └── styles.css           cores, fontes e todos os efeitos
├── public/                  favicon e ícones
└── docs/                    efeitos-visuais.md e historico.md
```

## Onde mexer

| O quê | Onde |
|---|---|
| Textos do topo, Sobre, Expertise, Trajetória e Contato | `src/routes/index.tsx` |
| Os 7 pilares (título, descrição, onde atua, ferramentas) | `src/components/portfolio/Pilares.tsx`, constante `PILARES` |
| Seção Método e "O que eu levo para o seu time" | `src/components/portfolio/Metodo.tsx` |
| Pirâmide de testes | `src/components/portfolio/Camadas.tsx` |
| Itens do menu | `Layout.tsx`, constante `NAV` |
| Nome e link do LinkedIn | `src/lib/site.ts` |
| Cores e efeitos | `src/styles.css` (detalhes em [docs/efeitos-visuais.md](docs/efeitos-visuais.md)) |
| Foto do topo | `src/assets/gabriel-hero.jpeg` (dá para trocar mantendo o nome) |
| Logo do menu | `src/assets/logo-gr.webp` |

Sobre os textos: o site fala de forma impessoal ("estruturando", "desenvolvendo"). A exceção é a seção "O que eu levo para o seu time", que o Gabriel escreveu em primeira pessoa de propósito.

## Rodar no computador

Precisa do Node.js 20 ou mais novo.

```bash
npm install
npm run dev
```

O site abre em `http://localhost:8080` (ou na próxima porta livre, que aparece no terminal).

Para ver a versão final, igual à publicada:

```bash
npm run build
npx vite preview
```

Depois de cada `npm run build`, reinicie o `vite preview`. Ele guarda a lista de arquivos do build anterior e passa a dar erro 404 nos novos.

## Trocar o fundo de traçados do topo

O topo hoje usa o fundo "Silver Arrow", desenhado em CSS. O fundo antigo, de traçados, continua disponível: basta trocar a constante `FUNDO_HERO` em `index.tsx` para `"tracados"`.

Para usar outra imagem de traçados, salve por cima de `src/assets/BG.png` (com fundo preto, de preferência em 3840×2160) e gere a versão leve:

```bash
node -e "require('sharp')('src/assets/BG.png').resize(3840).webp({quality:85}).toFile('src/assets/bg-hero-3840.webp')"
```

## Publicar

O `netlify.toml` já tem tudo o que a Netlify precisa:

| Campo | Valor |
|---|---|
| Build command | `npm run build` |
| Publish directory | `dist/client` |
| Node | 22 |

Com o repositório ligado à Netlify, cada `git push` na `main` publica o site.
