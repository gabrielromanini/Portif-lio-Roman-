import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import netlify from "@netlify/vite-plugin-tanstack-start";

export default defineConfig({
  // Deploy na Netlify: o plugin oficial gera o site em dist/client (ver netlify.toml).
  // O Nitro do Lovable (preset da Cloudflare) fica desligado para não competir com ele.
  nitro: false,
  plugins: [netlify()],
  tanstackStart: {
    prerender: {
      enabled: true,
      crawlLinks: true,
      // Links como "/#sobre" são a mesma página (só rolam até a seção):
      // não pré-renderizar de novo, senão o mesmo HTML é gerado várias vezes.
      filter: (page: { path: string }) => !page.path.includes("#"),
    },
    pages: [{ path: "/" }],
  },
});
