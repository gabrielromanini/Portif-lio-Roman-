import { useEffect, useRef } from "react";
import logoColorido from "@/assets/logo-colorido.png";
import logoMarrom from "@/assets/logo-marrom.png";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { CTAButton } from "@/components/site/CTAButton";
import { HEADER_H, INSTAGRAM_LABEL, INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/site";

const HEADER_SOLID_AFTER_PX = 40;

// Links do menu apontam para as seções da home ("/#…"): na home funcionam
// como antes (rolam até a seção); em outras páginas, voltam para a home.
const NAV = [
  { href: "/#inicio", label: "Início" },
  { href: "/ansiedade", label: "Ansiedade" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#sobre", label: "Sobre" },
  { href: "/#duvidas", label: "Dúvidas" },
  { href: "#contato", label: "Contato" }, // o rodapé (contato) existe em todas as páginas
];

export function Header({
  whatsappHref = WHATSAPP_URL,
  currentPath,
}: {
  whatsappHref?: string;
  /** Página atual (ex.: "/ansiedade"): o link dela fica destacado. */
  currentPath?: string;
}) {
  const headerRef = useRef<HTMLElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Um marcador invisível a 40px do topo: quando ele sai da tela, o header
  // vira "vidro fosco". Só muda um atributo no DOM ao cruzar o limite —
  // nada de estado do React nem listener a cada pixel rolado.
  useEffect(() => {
    const header = headerRef.current;
    const sentinel = sentinelRef.current;
    if (!header || !sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      header.dataset.scrolled = entry.isIntersecting ? "false" : "true";
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <>
    <div
      ref={sentinelRef}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 h-px w-px"
      style={{ top: HEADER_SOLID_AFTER_PX }}
    />
    <header
      ref={headerRef}
      className={`group/header sticky top-0 z-40 ${HEADER_H} border-b border-transparent bg-transparent transition-[background-color,border-color,box-shadow,backdrop-filter] duration-[400ms] ease-[ease] data-[scrolled=true]:border-border/40 data-[scrolled=true]:bg-[#F5EFE6]/80 data-[scrolled=true]:shadow-[0_4px_16px_-8px_rgba(46,47,42,0.12)] data-[scrolled=true]:backdrop-blur-[12px]`}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-4 px-4 md:px-6">
        <a href="/#inicio" className="flex items-center gap-3">
          {/* Crossfade: marrom no topo (header transparente, contraste
              sobre o bege) e colorido depois de rolar (fundo creme). */}
          <span className="relative block h-14 md:h-[70px]">
            <img
              src={logoColorido}
              alt="Yole Lopes — Psicóloga Online"
              width={1920}
              height={961}
              className="h-full w-auto opacity-0 transition-opacity duration-[400ms] ease-[ease] group-data-[scrolled=true]/header:opacity-100"
            />
            <img
              src={logoMarrom}
              alt=""
              aria-hidden="true"
              width={480}
              height={240}
              className="absolute inset-0 h-full w-auto opacity-100 transition-opacity duration-[400ms] ease-[ease] group-data-[scrolled=true]/header:opacity-0"
            />
          </span>
          <span className="sr-only">Yole Lopes Cortinhas — Psicóloga CRP 08/34622</span>
        </a>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={item.href === currentPath ? "page" : undefined}
              className="transition-colors hover:text-primary aria-[current=page]:text-foreground aria-[current=page]:underline aria-[current=page]:decoration-secondary aria-[current=page]:decoration-2 aria-[current=page]:underline-offset-8"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
        {/* No mobile o menu fica escondido: a página de Ansiedade ganha um link
            discreto aqui, ao lado do Instagram. */}
        {/* Celular: na página de ansiedade o link leva de volta para a home;
            nas outras páginas, leva para a de ansiedade. */}
        <a
          href={currentPath === "/ansiedade" ? "/" : "/ansiedade"}
          className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground md:hidden"
        >
          {currentPath === "/ansiedade" ? "Início" : "Ansiedade"}
        </a>
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={INSTAGRAM_LABEL}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full text-muted-foreground transition-colors duration-300 hover:bg-foreground/5 hover:text-foreground"
        >
          <InstagramIcon className="h-5 w-5" />
        </a>
        <CTAButton variant="whatsapp" href={whatsappHref} className="!px-4 !py-2 text-sm text-center max-md:hidden" ariaLabel="Agende uma conversa gratuita pelo WhatsApp">
          <WhatsAppIcon />
          <span className="hidden text-center leading-tight sm:inline">Agende uma conversa gratuita</span>
          <span className="text-center leading-tight sm:hidden">Conversa gratuita</span>
        </CTAButton>
        </div>
      </div>
    </header>
    </>
  );
}
