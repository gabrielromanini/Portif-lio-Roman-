import { useEffect } from "react";
import logoGr from "@/assets/logo-gr.png";
import { LINKEDIN_URL, SITE_NAME } from "@/lib/site";

// Links do menu: todos levam a seções da própria landing page.
const NAV = [
  { href: "#pilares", label: "Pilares" },
  { href: "#sobre", label: "Sobre" },
  { href: "#expertise", label: "Expertise" },
  { href: "#metodo", label: "Método" },
  { href: "#trajetoria", label: "Trajetória" },
  { href: "#contato", label: "Contato" },
];

export const FONTS_LINKS = [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap",
  },
];

export function Eyebrow({ children, center }: { children: React.ReactNode; center?: boolean }) {
  return (
    <p
      className={`flex items-center gap-3 ${center ? "justify-center" : ""} text-[11px] font-medium uppercase tracking-[0.35em] text-muted-foreground`}
    >
      <span className="h-px w-8 bg-gradient-to-r from-transparent to-silver" />
      {children}
    </p>
  );
}

/**
 * Mede a distância de cada parte cromada de um título até o início dele (--dx),
 * para a faixa de luz (.luz-passando, em styles.css) atravessar o título inteiro
 * como uma faixa só.
 */
function useAlinharLuzDosTitulos() {
  useEffect(() => {
    function alinhar() {
      document.querySelectorAll<HTMLElement>(".luz-passando").forEach((titulo) => {
        const inicio = titulo.getBoundingClientRect().left;
        titulo.querySelectorAll<HTMLElement>(".text-chrome").forEach((parte) => {
          parte.style.setProperty("--dx", `${parte.getBoundingClientRect().left - inicio}px`);
        });
      });
    }
    alinhar();
    document.fonts?.ready.then(alinhar);
    window.addEventListener("resize", alinhar);
    return () => window.removeEventListener("resize", alinhar);
  }, []);
}

export function PageShell({ children }: { children: React.ReactNode }) {
  useAlinharLuzDosTitulos();
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Reflexos de luz no fundo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.75_0.01_250/0.16),transparent_65%)]" />
        <div className="absolute top-[900px] -right-40 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,oklch(0.7_0.02_250/0.08),transparent_65%)]" />
      </div>

      <header className="sticky top-0 z-40 border-b border-white/5 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#top" aria-label={`${SITE_NAME}, página inicial`}>
            <img src={logoGr} alt="" width={1269} height={1240} className="h-10 w-auto" />
          </a>
          <nav className="hidden gap-8 md:flex">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                className="text-xs uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <a
              href="#metodo"
              className="text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:text-foreground md:hidden"
            >
              Método
            </a>
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-chrome hidden rounded-full px-5 py-2 text-xs uppercase tracking-[0.2em] sm:inline-flex"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </header>

      <main id="top">{children}</main>

      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-xs uppercase tracking-[0.2em] text-muted-foreground sm:flex-row sm:px-6">
          <span>
            © {new Date().getFullYear()} {SITE_NAME}
          </span>
          <span>Curitiba · PR</span>
        </div>
      </footer>
    </div>
  );
}
