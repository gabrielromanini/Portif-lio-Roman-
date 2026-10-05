# Site Psicóloga Yole Lopes

Landing page institucional de página única para a psicóloga Yole Lopes (CRP 08/34622), com foco em captação de pacientes para atendimento online.

Site ao vivo: [psicologayole.com.br](https://psicologayole.com.br)

---

## Tecnologias

- **React 19 + TypeScript** — interface
- **Tailwind CSS** — estilização
- **TanStack Start** (Vite) — bundler e roteamento
- **shadcn/ui** (Radix UI) — componentes de interface
- **Netlify** — hospedagem com deploy automático
- **GitHub** — controle de versão

---

## Estrutura do projeto

```
codigo-fonte/
├── src/
│   ├── routes/
│   │   ├── index.tsx        ← todo o conteúdo da página (textos, FAQ, SEO)
│   │   └── __root.tsx       ← <head> global, tags de analytics
│   ├── assets/              ← fotos e logos usados no site (yole-1 topo, yole-2 sobre, yole-3 horários)
│   └── styles.css           ← cores, fontes e tokens de design
├── public/                  ← favicon, imagem de compartilhamento (og:image) e folhas/
├── imagens-nao-usadas/      ← fotos antigas, logos alternativos e originais em PNG (não vão para o site)
├── docs/                    ← efeitos-visuais.md (como funciona) e historico.md (decisões e pendências)
└── site.pronto.2/           ← build anterior (não editar)
```

---

## Onde mexer

| O quê | Arquivo |
|---|---|
| Textos, FAQ, especialidades, depoimentos | `src/routes/index.tsx` |
| Tags de analytics, scripts do `<head>` | `src/routes/__root.tsx` |
| Cores e fontes | `src/styles.css` |
| Fotos e logos | `src/assets/` |
| Favicon e imagem de compartilhamento | `public/` |
| Folhas ao vento e transições entre seções | `src/components/decorative/WindLeaves.tsx` — ver [docs/efeitos-visuais.md](docs/efeitos-visuais.md) |

O número de WhatsApp, e-mail e URLs de redes sociais ficam no topo de `src/routes/index.tsx`, nas constantes `WHATSAPP_URL`, `SITE_URL` e `INSTAGRAM_URL`.

---

## Como rodar localmente

Requer Node.js 20 ou superior.

```bash
npm install
npm run dev
```

O site abre em `http://localhost:8080` (páginas: `/` e `/ansiedade`). Se essa porta estiver ocupada, o terminal mostra a próxima livre (ex.: 8081).

---

## Como publicar alterações

O deploy é automático via Netlify. Basta fazer push para a branch `main`:

```bash
git add .
git commit -m "descreva o que mudou"
git push
```

O Netlify detecta o push, roda `npm run build` automaticamente e publica em ~1-2 minutos.

---

## Medição e anúncios

O Google Tag Manager está instalado com o container **GTM-PFLC3XNT**:

- Script no `<head>` em `src/routes/__root.tsx`
- Noscript no `<body>` em `src/routes/__root.tsx`

Para adicionar tags (Google Analytics, Google Ads, Meta Pixel, etc.), configure dentro do painel do GTM — não é necessário alterar o código.

---

## Repositório e hospedagem

- **GitHub:** github.com/gabrielromanini/-site-yole
- **Netlify:** app.netlify.com — projeto `zippy-granita-24e05c`
- **Deploy automático:** commits na branch `main` publicam automaticamente
