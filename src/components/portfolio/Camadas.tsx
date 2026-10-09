import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/rolagem";

// Da base para o topo: é a ordem em que as camadas "assentam" ao rolar.
const CAMADAS = [
  {
    nome: "Unitários",
    texto:
      "A base: muitos, rápidos e baratos. Dão feedback em segundos para quem está desenvolvendo.",
    feedback: "milissegundos",
    recorte: "polygon(16.15% 67.69%, 83.85% 67.69%, 100% 100%, 0 100%)",
    contorno: "96.9,352 503.1,352 600,520 0,520",
    rotulo: "84%",
  },
  {
    nome: "Integração & API",
    texto:
      "Validam contratos, regras de negócio e a conversa entre serviços. Rápidos e muito estáveis.",
    feedback: "segundos",
    recorte: "polygon(33.47% 33.08%, 66.53% 33.08%, 82.7% 65.38%, 17.3% 65.38%)",
    contorno: "200.8,172 399.2,172 496.2,340 103.8,340",
    rotulo: "49.5%",
  },
  {
    nome: "E2E",
    texto: "Poucos e valiosos. Cobrem as jornadas críticas do usuário de ponta a ponta.",
    feedback: "minutos",
    recorte: "polygon(50% 0, 65.38% 30.77%, 34.62% 30.77%)",
    contorno: "300,0 392.3,160 207.7,160",
    rotulo: "21%",
  },
];

const MONO = "font-['JetBrains_Mono',ui-monospace,monospace]";
// Altura do menu depois de rolar (54px): o centro da área visível fica metade abaixo.
const MENU = 54;
const DESKTOP = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";
const CELULAR = "(max-width: 767.98px) and (prefers-reduced-motion: no-preference)";

/**
 * "Estratégia inteligente, menor custo": fechamento do Método. A pirâmide de testes se monta
 * camada por camada conforme a rolagem e termina no selo do quality gate.
 * - Desktop: o conteúdo fica preso, centralizado na área abaixo do menu, por 2,5
 *   telas de rolagem, e o texto da camada que está assentando acende do lado.
 *   Em telas baixas demais para centralizar, fica preso logo abaixo do menu.
 * - Celular: sem prender a tela; a pirâmide monta enquanto passa.
 * - Sem JS ou com movimento reduzido: tudo aparece pronto.
 */
export function CamadasSection() {
  const secaoRef = useRef<HTMLElement>(null);
  const contadorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const secao = secaoRef.current;
    if (!secao) return;
    const q = gsap.utils.selector(secao);
    const mm = gsap.matchMedia();

    function montar(prender: boolean) {
      // No HTML a pirâmide vem do topo para a base; aqui a ordem é a da montagem.
      const camadas = q("[data-camada]").reverse();
      const varreduras = q("[data-varredura]").reverse();
      const textos = q("[data-texto]");
      const palco = q("[data-palco]")[0];
      const cabeCentralizado = () => palco.offsetHeight + MENU <= window.innerHeight;
      const tl = gsap.timeline({
        defaults: { ease: "power2.out" },
        scrollTrigger: prender
          ? {
              trigger: palco,
              start: () => (cabeCentralizado() ? `center center+=${MENU / 2}` : `top ${MENU}px`),
              end: "+=250%",
              pin: true,
              scrub: 0.6,
              invalidateOnRefresh: true,
            }
          : // Celular: a montagem acontece com a pirâmide e o selo inteiros na tela
            // (começa quando o topo entra e termina com o selo ainda acima do rodapé).
            {
              trigger: q("[data-coluna-piramide]")[0],
              start: "top 85%",
              end: "bottom 80%",
              scrub: 0.6,
            },
      });

      if (prender) gsap.set(textos, { opacity: 0.22 });
      const chegadas: number[] = [];
      CAMADAS.forEach((_, i) => {
        const inicio = tl.duration();
        // A camada desce de cima e assenta; a varredura petróleo passa por ela.
        tl.from(camadas[i], { y: -140, opacity: 0, duration: 1 }, inicio);
        tl.fromTo(
          varreduras[i],
          { scaleX: 0, opacity: 1 },
          { scaleX: 1, duration: 0.5, ease: "none" },
          inicio + 0.7,
        );
        tl.to(varreduras[i], { opacity: 0, duration: 0.3 }, inicio + 1.2);
        if (prender) {
          tl.to(textos[i], { opacity: 1, duration: 0.4 }, inicio + 0.5);
          if (i > 0) tl.to(textos[i - 1], { opacity: 0.45, duration: 0.4 }, inicio + 0.5);
        }
        chegadas.push(inicio + 0.6);
      });

      // Quality gate: o halo atrás da pirâmide acende e o selo aparece. (O brilho é
      // um irmão das camadas, não um filter no contêiner, que apagaria o vidro.)
      const fim = tl.duration();
      tl.fromTo(q("[data-halo]"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, fim);
      tl.from(q("[data-selo]"), { y: 16, opacity: 0, duration: 0.6 }, fim + 0.2);
      if (prender) tl.to(textos, { opacity: 1, duration: 0.4 }, fim + 0.2);
      tl.to({}, { duration: 0.4 }); // respiro antes de soltar a tela

      // Contador "CAMADA 0X/03" segue a posição da animação, nos dois sentidos.
      tl.eventCallback("onUpdate", () => {
        const n = chegadas.filter((t) => tl.time() >= t).length;
        if (contadorRef.current) contadorRef.current.textContent = String(n).padStart(2, "0");
      });
    }

    mm.add(DESKTOP, () => montar(true));
    mm.add(CELULAR, () => montar(false));

    // As abas do Método (logo acima) mudam a altura da página: recalcula onde o
    // pin começa sempre que o conteúdo muda de tamanho.
    let espera = 0;
    const obs = new ResizeObserver(() => {
      clearTimeout(espera);
      espera = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    obs.observe(document.body);

    return () => {
      clearTimeout(espera);
      obs.disconnect();
      mm.revert();
    };
  }, []);

  return (
    <section ref={secaoRef} id="camadas" className="relative scroll-mt-20 pb-28 max-md:pb-14">
      <div
        data-palco
        className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 md:grid-cols-[1fr_1.1fr]"
      >
        <div>
          <p className={`${MONO} text-xs uppercase tracking-[0.2em] text-muted-foreground`}>
            Quality stack{" "}
            {/* Contador só no desktop, onde a seção trava; no celular a pirâmide fica
                depois da lista e o número não acompanharia nada na tela */}
            <span className="max-md:hidden">
              <span className="text-teal">·</span> camada{" "}
              <span ref={contadorRef} className="text-foreground">
                03
              </span>
              /03
            </span>
          </p>
          <h2 className="luz-passando mt-5 w-fit text-[38px] leading-[1.02] min-[400px]:text-5xl sm:text-6xl">
            {/* Uma ideia por linha: "Estratégia inteligente," inteira em cima */}
            <span className="whitespace-nowrap">Estratégia inteligente,</span>
            <br />
            <em className="text-chrome">menor custo</em>
          </h2>
          <ol className="mt-10 space-y-7">
            {CAMADAS.map((c, i) => (
              <li key={c.nome} data-texto className="border-l border-white/15 pl-6">
                <p className={`${MONO} text-[11px] uppercase tracking-[0.2em] text-teal`}>
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="titulo-card mt-1 font-serif text-2xl text-chrome">{c.nome}</h3>
                <p className="mt-2 font-light leading-relaxed text-muted-foreground">{c.texto}</p>
                <p
                  className={`${MONO} mt-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground/70`}
                >
                  Feedback em {c.feedback}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div data-coluna-piramide>
          {/* Um único triângulo fatiado na horizontal: as laterais das três camadas
              ficam na mesma reta. Desenhada do topo para a base (E2E primeiro); a
              animação segue a ordem inversa. */}
          <div data-piramide className="relative mx-auto aspect-[600/520] w-[min(560px,100%)]">
            <div data-halo aria-hidden className="piramide-halo" />
            {[...CAMADAS].reverse().map((c) => (
              <div key={c.nome} data-camada className="absolute inset-0">
                <div className="piramide-vidro" style={{ clipPath: c.recorte }}>
                  <span aria-hidden className="piramide-pontos" />
                  <span
                    data-varredura
                    aria-hidden
                    className="absolute inset-0 origin-left bg-[linear-gradient(90deg,transparent,rgba(0,161,156,0.4)_85%,rgba(190,255,252,0.7))] opacity-0"
                  />
                </div>
                <svg
                  aria-hidden
                  viewBox="0 0 600 520"
                  preserveAspectRatio="none"
                  className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                >
                  <polygon
                    points={c.contorno}
                    fill="none"
                    stroke="url(#piramide-borda)"
                    strokeWidth="1.2"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <span
                  className="piramide-rotulo absolute left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.18em] sm:text-sm"
                  style={{ top: c.rotulo }}
                >
                  {c.nome}
                </span>
              </div>
            ))}
            {/* Gradiente do contorno, compartilhado pelas três camadas */}
            <svg aria-hidden className="absolute h-0 w-0">
              <defs>
                <linearGradient id="piramide-borda" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#bff7ef" stopOpacity="0.9" />
                  <stop offset="1" stopColor="#00d2be" stopOpacity="0.35" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p
            data-selo
            className={`${MONO} mx-auto mt-8 flex w-fit items-center gap-2 rounded-full border border-teal/50 bg-teal/[0.06] px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-teal`}
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2} />
            Quality gate aprovado · pronto para produção
          </p>
        </div>
      </div>
    </section>
  );
}
