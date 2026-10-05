import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    prerender: {
      enabled: true,
      crawlLinks: true,
      // Links como "/#sobre" são a mesma página (só rolam até a seção):
      // não pré-renderizar de novo, senão o mesmo HTML é gerado várias vezes.
      filter: (page: { path: string }) => !page.path.includes("#"),
    },
    // As demais páginas são encontradas pelos links (ex.: /ansiedade, no menu).
    pages: [{ path: "/" }],
  },
});
