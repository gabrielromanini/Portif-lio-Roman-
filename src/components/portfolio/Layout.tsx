import { forwardRef, useEffect, useRef, useState, type RefObject } from "react";
import logoGr from "@/assets/logo-gr.webp";
import { ligarRolagemSuave, rolarAte } from "@/lib/rolagem";
import { LINKEDIN_URL, SITE_NAME } from "@/lib/site";
import { Profundidade } from "./Profundidade";

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
      className={`flex items-center gap-3 ${center ? "justify-center" : ""} text-[11px] font-medium uppercase tracking-[0.25em] text-muted-foreground md:tracking-[0.35em]`}
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

/**
 * Estado do menu:
 * - `rolado`: passou de 40px (fundo de vidro e altura menor);
 * - `barraRef`: barra de progresso de leitura, atualizada por requestAnimationFrame
 *   com transform: scaleX (sem estado do React a cada frame);
 * - `ativo`: seção do menu visível agora. Cada <section id> da página é ligada ao
 *   último item do menu que vem antes dela (ex.: as partes do Método contam como
 *   "Método"), e um IntersectionObserver olha uma faixa no meio da tela.
 */
function useMenuAoRolar() {
  const [rolado, setRolado] = useState(false);
  const [ativo, setAtivo] = useState<string | null>(null);
  const barraRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let quadro = 0;
    function atualizar() {
      quadro = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progresso = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      if (barraRef.current) barraRef.current.style.transform = `scaleX(${progresso})`;
      setRolado(window.scrollY > 40);
      // No fim da página o Contato pode não chegar ao meio da tela
      if (progresso > 0.99) setAtivo("#contato");
    }
    function aoRolar() {
      if (!quadro) quadro = requestAnimationFrame(atualizar);
    }
    atualizar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
    };
  }, []);

  useEffect(() => {
    const doMenu = new Set(NAV.map((n) => n.href.slice(1)));
    const itemDaSecao = new Map<Element, string | null>();
    let atual: string | null = null;
    document.querySelectorAll("main section[id]").forEach((secao) => {
      if (doMenu.has(secao.id)) atual = `#${secao.id}`;
      itemDaSecao.set(secao, atual);
    });
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) if (e.isIntersecting) setAtivo(itemDaSecao.get(e.target) ?? null);
      },
      // Faixa entre 40% e 45% da altura da tela
      { rootMargin: "-40% 0px -55% 0px" },
    );
    itemDaSecao.forEach((_, secao) => obs.observe(secao));
    return () => obs.disconnect();
  }, []);

  return { rolado, ativo, barraRef };
}

/**
 * Celular (só mobile, porque não há hover): o card "acende" em petróleo quando
 * 40% dele entra na tela, e apaga ao sair. A aparência fica em styles.css
 * (.card-chrome.bloom, dentro de um @media até 767px), então no desktop a
 * classe não tem efeito.
 */
/**
 * Endereço limpo: os links internos (menu, logo, "Ver trajetória"…) rolam até a
 * seção sem escrever "#sobre" no endereço, que fica sempre gabrielromanini.com.br.
 * A rolagem é feita aqui (pelo Lenis, ou direta com movimento reduzido), respeitando
 * o scroll-margin de cada seção; o logo (#top) volta ao início da página.
 * Links recebidos com #seção continuam funcionando ao abrir o site.
 */
function useEnderecoLimpo() {
  useEffect(() => {
    function aoClicar(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as HTMLElement).closest?.("a");
      const href = a?.getAttribute("href");
      if (!href?.startsWith("#")) return;
      const alvo = href === "#top" ? null : document.getElementById(href.slice(1));
      if (href !== "#top" && !alvo) return;
      e.preventDefault();
      const y = alvo
        ? alvo.getBoundingClientRect().top +
          window.scrollY -
          (parseFloat(getComputedStyle(alvo).scrollMarginTop) || 0)
        : 0;
      rolarAte(Math.max(0, y));
      if (window.location.hash) {
        history.replaceState(history.state, "", window.location.pathname + window.location.search);
      }
    }
    document.addEventListener("click", aoClicar);
    return () => document.removeEventListener("click", aoClicar);
  }, []);
}

function useBloomNosCards() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) e.target.classList.toggle("bloom", e.isIntersecting);
      },
      { threshold: 0.4 },
    );
    document.querySelectorAll(".card-chrome.group").forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, []);
}

/** Botão do menu mobile: 2 linhas finas que viram X. */
const BotaoMenu = forwardRef<HTMLButtonElement, { aberto: boolean; onClick: () => void }>(
  function BotaoMenu({ aberto, onClick }, ref) {
    const linha =
      "absolute left-1/2 h-px w-6 -translate-x-1/2 bg-foreground transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none";
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        aria-label={aberto ? "Fechar menu" : "Abrir menu"}
        aria-expanded={aberto}
        aria-controls="menu-mobile"
        className="relative h-11 w-11 md:hidden"
      >
        <span className={`${linha} top-[18px] ${aberto ? "translate-y-[3.5px] rotate-45" : ""}`} />
        <span
          className={`${linha} top-[25px] ${aberto ? "-translate-y-[3.5px] -rotate-45" : ""}`}
        />
      </button>
    );
  },
);

/**
 * Menu mobile em tela cheia. Fica atrás do header (z-30), que continua por cima
 * mostrando o logo e o X. Fecha no link, no X ou no Esc; trava a rolagem da
 * página e prende o foco entre o X e os itens do menu.
 */
function MenuMobile({
  aberto,
  ativo,
  fechar,
  botaoMenuRef,
}: {
  aberto: boolean;
  ativo: string | null;
  fechar: () => void;
  botaoMenuRef: RefObject<HTMLButtonElement | null>;
}) {
  const painelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const anterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    painelRef.current?.querySelector<HTMLElement>("a")?.focus();

    function teclado(e: KeyboardEvent) {
      if (e.key === "Escape") {
        fechar();
        botaoMenuRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const focaveis = [
        botaoMenuRef.current,
        ...(painelRef.current?.querySelectorAll<HTMLElement>("a") ?? []),
      ].filter(Boolean) as HTMLElement[];
      const i = focaveis.indexOf(document.activeElement as HTMLElement);
      const prox = e.shiftKey ? (i <= 0 ? focaveis.length - 1 : i - 1) : (i + 1) % focaveis.length;
      e.preventDefault();
      focaveis[prox]?.focus();
    }
    document.addEventListener("keydown", teclado);
    return () => {
      document.body.style.overflow = anterior;
      document.removeEventListener("keydown", teclado);
    };
  }, [aberto, fechar, botaoMenuRef]);

  return (
    <div
      id="menu-mobile"
      ref={painelRef}
      hidden={!aberto}
      className="fixed inset-0 z-30 flex flex-col bg-[rgba(8,8,9,0.92)] px-6 pb-10 pt-28 backdrop-blur-[16px] md:hidden"
    >
      <nav aria-label="Menu" className="flex flex-col gap-5">
        {NAV.map((n, i) => {
          const eAtivo = ativo === n.href;
          return (
            <a
              key={n.href}
              href={n.href}
              onClick={fechar}
              aria-current={eAtivo ? "location" : undefined}
              style={{ animationDelay: `${i * 40}ms` }}
              className={`menu-item relative w-fit rounded pl-4 pr-2 font-serif text-[32px] leading-tight outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-teal/60 ${
                eAtivo ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {eAtivo && <span aria-hidden className="absolute inset-y-1 left-0 w-px bg-teal" />}
              {n.label}
            </a>
          );
        })}
      </nav>
      <a
        href={LINKEDIN_URL}
        target="_blank"
        rel="noreferrer"
        onClick={fechar}
        style={{ animationDelay: `${NAV.length * 40}ms` }}
        className="menu-item btn-chrome mt-auto inline-flex w-fit rounded-full px-6 py-3 text-xs uppercase tracking-[0.2em]"
      >
        LinkedIn
      </a>
    </div>
  );
}

export function PageShell({ children }: { children: React.ReactNode }) {
  useEffect(() => ligarRolagemSuave(), []);
  useEnderecoLimpo();
  useAlinharLuzDosTitulos();
  const { rolado, ativo, barraRef } = useMenuAoRolar();
  const [menuAberto, setMenuAberto] = useState(false);
  const botaoMenuRef = useRef<HTMLButtonElement>(null);
  useBloomNosCards();
  const suave =
    "transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none";
  return (
    // overflow-x-clip (e não hidden): hidden transformaria este div num contêiner de
    // rolagem e o menu deixaria de ficar preso no topo (sticky).
    <div className="relative min-h-screen overflow-x-clip">
      {/* Profundidade do fundo: névoa em parallax e grão de filme */}
      <Profundidade />
      {/* Reflexos de luz no topo */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(0.75_0.01_250/0.16),transparent_65%)]" />
        <div className="absolute top-[900px] -right-40 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,oklch(0.7_0.02_250/0.08),transparent_65%)]" />
      </div>

      <header
        className={`sticky top-0 z-40 border-b ${suave} ${
          rolado
            ? "border-white/[0.06] bg-[rgba(8,8,9,0.72)] backdrop-blur-[14px] backdrop-saturate-[1.4]"
            : "border-transparent bg-transparent"
        }`}
      >
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 ${suave} ${
            rolado ? "h-[54px]" : "h-16"
          }`}
        >
          <a href="#top" aria-label={`${SITE_NAME}, página inicial`}>
            <img src={logoGr} alt="" width={123} height={120} className="h-10 w-auto" />
          </a>
          <nav className="hidden gap-8 md:flex">
            {NAV.map((n) => {
              const eAtivo = ativo === n.href;
              return (
                <a
                  key={n.href}
                  href={n.href}
                  aria-current={eAtivo ? "location" : undefined}
                  className={`group/item relative py-1 text-xs uppercase tracking-[0.25em] transition-colors hover:text-foreground ${
                    eAtivo ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {n.label}
                  {/* Traço petróleo: fixo no item ativo, cresce da esquerda no hover */}
                  <span
                    aria-hidden
                    className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-teal transition-transform duration-[250ms] motion-reduce:transition-none ${
                      eAtivo ? "scale-x-100" : "scale-x-0 group-hover/item:scale-x-100"
                    }`}
                  />
                </a>
              );
            })}
          </nav>
          <div className="flex items-center gap-3">
            <BotaoMenu
              aberto={menuAberto}
              onClick={() => setMenuAberto((v) => !v)}
              ref={botaoMenuRef}
            />
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-chrome hidden rounded-full px-5 py-2 text-xs uppercase tracking-[0.2em] md:inline-flex"
            >
              LinkedIn
            </a>
          </div>
        </div>
        {/* Progresso de leitura */}
        <span
          ref={barraRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-px h-[2px] origin-left scale-x-0 bg-[linear-gradient(90deg,#00a19c,#5fd3cf)] shadow-[0_0_8px_rgba(0,161,156,0.6)]"
        />
      </header>

      <MenuMobile
        aberto={menuAberto}
        ativo={ativo}
        fechar={() => setMenuAberto(false)}
        botaoMenuRef={botaoMenuRef}
      />

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
