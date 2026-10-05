import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ButtonLeaves } from "@/components/decorative/ButtonLeaves";

/**
 * Exercício de respiração guiada: "a folha que respira".
 *
 * - Nada se mexe até a pessoa clicar em "Começar a respirar".
 * - Ciclo: inspira (esfera cresce) → segura → solta devagar (esfera diminui
 *   e uma ou duas folhas se soltam e voam com o vento). Expirar mais longo
 *   que inspirar ajuda o corpo a desacelerar.
 * - 5 respirações (~50 s); depois uma mensagem e a opção de continuar.
 * - Camadas decorativas usam pointer-events-none: o brilho cresce além da
 *   esfera e, no celular, cobria o botão "Pausar".
 * - Pausa a qualquer momento. Vibração leve na troca de etapa (Android).
 * - prefers-reduced-motion: a esfera não muda de tamanho e não há folhas
 *   voando; o ritmo segue pelo texto, pela cor e pelo anel de progresso.
 * - Estado só na tela: nada é salvo nem enviado.
 */

// ---- Ritmo ----
const INHALE_MS = 3000;
const HOLD_MS = 2000;
const EXHALE_MS = 5000;
const CYCLES = 5;

// ---- Tamanho da esfera (escala) em cada etapa ----
const SCALE_REST = 0.76;
const SCALE_FULL = 1;
const SCALE_EMPTY = 0.64;

// ---- Interação com o mouse (só antes de começar e depois de terminar) ----
const HOVER_TILT_DEG = 8; // inclinação máxima da esfera em direção ao mouse
const HOVER_LEAF_PULL_PX = 14; // quanto as folhas pousadas se inclinam para o mouse
const LIGHT_REST = { x: 0.36, y: 0.3 }; // posição do brilho quando o mouse não está em cima

// ---- Folhas que voam ao expirar ----
const LEAVES_PER_EXHALE_MIN = 2;
const LEAVES_PER_EXHALE_MAX = 2;
const LEAF_SOURCES = ["/folhas/folha1.webp", "/folhas/folha2.webp", "/folhas/folha3.webp", "/folhas/folha4.webp"];

type Phase = "idle" | "inhale" | "hold" | "exhale" | "done";

const PHASE_MS: Record<"inhale" | "hold" | "exhale", number> = {
  inhale: INHALE_MS,
  hold: HOLD_MS,
  exhale: EXHALE_MS,
};

const PHASE_LABEL: Record<Phase, string> = {
  idle: "Vamos começar?",
  inhale: "Inspire…",
  hold: "Segure…",
  exhale: "Solte devagar…",
  done: "Muito bem",
};

interface FlyingLeaf {
  id: number;
  src: string;
  style: CSSProperties;
}

// Folhas pousadas ao redor da esfera (decorativas, só balançam).
const RESTING_LEAVES = [
  { src: "/folhas/folha1.webp", className: "left-[2%] top-[18%] h-10 w-10", r0: "-24deg", r1: "-14deg", delay: "0s" },
  { src: "/folhas/folha3.webp", className: "right-[0%] top-[30%] h-9 w-9", r0: "32deg", r1: "40deg", delay: "-2s" },
  { src: "/folhas/folha4.webp", className: "left-[12%] bottom-[8%] h-8 w-8", r0: "60deg", r1: "70deg", delay: "-4s" },
];

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export function BreathingExercise() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [cycle, setCycle] = useState(0); // respiração atual (1..CYCLES)
  const [paused, setPaused] = useState(false);
  const [leaves, setLeaves] = useState<FlyingLeaf[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const leafId = useRef(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = () => setReducedMotion(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const running = phase === "inhale" || phase === "hold" || phase === "exhale";
  const active = running && !paused;

  const releaseLeaves = useCallback(() => {
    const count = Math.round(rand(LEAVES_PER_EXHALE_MIN, LEAVES_PER_EXHALE_MAX));
    const fresh: FlyingLeaf[] = Array.from({ length: count }, () => {
      // Saem da borda direita/superior da esfera e o vento leva para a direita.
      const angle = rand(-80, 10) * (Math.PI / 180);
      const radius = 30; // % do tamanho da área (perto da borda da esfera)
      return {
        id: leafId.current++,
        src: LEAF_SOURCES[Math.floor(Math.random() * LEAF_SOURCES.length)],
        style: {
          left: `${50 + Math.cos(angle) * radius}%`,
          top: `${50 + Math.sin(angle) * radius}%`,
          // Sobem devagar com o vento, sem sair correndo da tela.
          ["--dx" as string]: `${Math.round(rand(40, 120))}px`,
          ["--dy" as string]: `${Math.round(rand(-170, -80))}px`,
          ["--rot" as string]: `${Math.round(rand(-160, 160))}deg`,
          animationDelay: `${Math.round(rand(0, 1200))}ms`,
        },
      };
    });
    setLeaves((prev) => [...prev, ...fresh]);
  }, []);

  // Avança as etapas. Só uma troca de estado por etapa (a cada 2–6 s).
  useEffect(() => {
    if (!active) return;
    navigator.vibrate?.(18);
    if (phase === "exhale" && !reducedMotion) releaseLeaves();
    const t = window.setTimeout(() => {
      if (phase === "inhale") setPhase("hold");
      else if (phase === "hold") setPhase("exhale");
      else if (cycle >= CYCLES) setPhase("done");
      else {
        setCycle((c) => c + 1);
        setPhase("inhale");
      }
    }, PHASE_MS[phase as "inhale" | "hold" | "exhale"]);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, active, cycle]);

  // A esfera convida ao clique antes de começar e depois de terminar.
  // Durante o exercício nada reage ao mouse, para não tirar a atenção.
  const interactive = phase === "idle" || phase === "done";
  const areaRef = useRef<HTMLDivElement>(null);

  function setPointer(x: number, y: number, hover: boolean) {
    const el = areaRef.current;
    if (!el) return;
    el.style.setProperty("--lx", x.toFixed(3));
    el.style.setProperty("--ly", y.toFixed(3));
    el.dataset.hover = hover ? "true" : "false";
  }
  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!interactive || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    if (reducedMotion) setPointer(LIGHT_REST.x, LIGHT_REST.y, true);
    else setPointer(x, y, true);
  }
  function onPointerLeave() {
    setPointer(LIGHT_REST.x, LIGHT_REST.y, false);
  }
  // Ao começar, solta o "hover" (a esfera volta ao normal para o exercício).
  useEffect(() => {
    if (!interactive) setPointer(LIGHT_REST.x, LIGHT_REST.y, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive]);

  function start() {
    setLeaves([]);
    setCycle(1);
    setPaused(false);
    setPhase("inhale");
  }
  function togglePause() {
    if (paused) {
      // Retoma do começo da respiração atual, com calma.
      setPaused(false);
      setPhase("inhale");
    } else {
      setPaused(true);
    }
  }

  // Escala e brilho da esfera em cada etapa.
  let scale = SCALE_REST;
  let glow = 0.35;
  let duration = 1200;
  if (active) {
    duration = PHASE_MS[phase as "inhale" | "hold" | "exhale"];
    if (phase === "inhale") [scale, glow] = [SCALE_FULL, 0.75];
    if (phase === "hold") [scale, glow] = [SCALE_FULL, 0.85];
    if (phase === "exhale") [scale, glow] = [SCALE_EMPTY, 0.25];
  }
  if (reducedMotion) scale = 0.86;

  const orbStyle: CSSProperties = {
    transform: reducedMotion ? `scale(${scale})` : phase === "idle" || paused ? undefined : `scale(${scale})`,
    transitionDuration: `${phase === "hold" ? 600 : duration}ms`,
  };
  const haloStyle: CSSProperties = {
    opacity: glow,
    transform: reducedMotion ? undefined : `scale(${phase === "idle" || paused ? 0.85 : scale * 1.15})`,
    transitionDuration: `${phase === "hold" ? 600 : duration}ms`,
  };

  return (
    <div className="flex flex-col items-center">
      {/* Área da esfera */}
      <div
        ref={areaRef}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        className="group/orb relative aspect-square w-[min(78vw,340px)]"
        style={{
          perspective: "900px",
          ["--lx" as string]: LIGHT_REST.x,
          ["--ly" as string]: LIGHT_REST.y,
        }}
      >
        {/* Folhas pousadas */}
        {RESTING_LEAVES.map((l, i) => (
          <img
            key={i}
            src={l.src}
            alt=""
            aria-hidden="true"
            draggable={false}
            className={`pointer-events-none absolute select-none opacity-70 transition-[translate,opacity] duration-700 ease-out animate-leaf-rest group-data-[hover=true]/orb:opacity-95 motion-reduce:animate-none ${l.className}`}
            style={{
              ["--r0" as string]: l.r0,
              ["--r1" as string]: l.r1,
              animationDelay: l.delay,
              transform: `rotate(${l.r0})`,
              // Inclinam na direção do mouse (vars --lx/--ly da área).
              translate: `calc((var(--lx) - 0.5) * ${HOVER_LEAF_PULL_PX * 2}px) calc((var(--ly) - 0.5) * ${HOVER_LEAF_PULL_PX * 2}px)`,
            }}
          />
        ))}

        {/* Halo de luz */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-14%] rounded-full blur-2xl transition-[opacity,transform] ease-in-out"
          style={{
            ...haloStyle,
            background: "radial-gradient(circle, rgba(160,185,140,0.75) 0%, rgba(211,218,202,0.4) 45%, transparent 70%)",
          }}
        />

        {/* Brilho extra quando o mouse está sobre a esfera */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-[-6%] rounded-full opacity-0 blur-2xl transition-opacity duration-700 ease-out group-data-[hover=true]/orb:opacity-70"
          style={{ background: "radial-gradient(circle, rgba(160,185,140,0.7) 0%, transparent 65%)" }}
        />

        {/* Anel de progresso da etapa */}
        <svg aria-hidden="true" viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 -rotate-90">
          <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(46,47,42,0.08)" strokeWidth="0.8" />
          {/* O anel acompanha a respiração: enche ao inspirar, fica PARADO e
              cheio no "segure" e esvazia devagar ao soltar. */}
          {active && (
            <circle
              key={`${cycle}-${phase}`}
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#8fa67e"
              strokeWidth="1"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray="100"
              strokeDashoffset={phase === "hold" ? 0 : undefined}
              className={
                phase === "inhale" ? "animate-ring-fill" : phase === "exhale" ? "animate-ring-drain" : ""
              }
              style={{ ["--ring-ms" as string]: `${PHASE_MS[phase as "inhale" | "hold" | "exhale"]}ms` }}
            />
          )}
        </svg>

        {/* Esfera (o invólucro inclina para o mouse e cresce um pouco no hover) */}
        <div
          className="pointer-events-none absolute inset-[9%] transition-[transform,scale] duration-700 ease-out group-data-[hover=true]/orb:scale-[1.06] motion-reduce:group-data-[hover=true]/orb:scale-100"
          style={{
            transform: `rotateX(calc((0.5 - var(--ly)) * ${HOVER_TILT_DEG * 2}deg)) rotateY(calc((var(--lx) - 0.5) * ${HOVER_TILT_DEG * 2}deg))`,
          }}
        >
        <div
          className={`absolute inset-0 overflow-hidden rounded-full transition-transform ease-in-out ${
            phase === "idle" || paused ? "animate-orb-idle-mobile md:animate-orb-idle motion-reduce:animate-none" : ""
          }`}
          style={{
            ...orbStyle,
            background:
              "radial-gradient(circle at 35% 30%, #ffffff 0%, #f1f3ec 30%, #dde3d3 62%, #c4cfb6 100%)",
            boxShadow:
              "inset 0 -14px 40px rgba(120,140,100,0.18), inset 0 10px 30px rgba(255,255,255,0.7), 0 20px 60px -20px rgba(94,110,69,0.35)",
          }}
        >
          {/* Luz que acompanha o mouse, como numa pérola */}
          <div
            aria-hidden="true"
            className="absolute h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 transition-[left,top,opacity] duration-700 ease-out group-data-[hover=true]/orb:opacity-100"
            style={{
              left: "calc(var(--lx) * 100%)",
              top: "calc(var(--ly) * 100%)",
              background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)",
            }}
          />
          <div className="absolute inset-[10%] rounded-full border border-white/60" />
        </div>
        </div>

        {/* Texto central (fora da esfera para não escalar junto) */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <p
            key={phase + (paused ? "p" : "")}
            className="animate-fade-in-slow font-serif text-[26px] text-[#2E2F2A] md:text-4xl"
          >
            {interactive ? (
              <span className="grid">
                {/* max-w em "ch": textos como "Vamos começar?" quebram em duas
                    linhas e cabem dentro da esfera em qualquer tela */}
                <span className="col-start-1 row-start-1 mx-auto max-w-[9ch] leading-[1.1] transition-opacity duration-500 group-data-[hover=true]/orb:opacity-0">
                  {PHASE_LABEL[phase]}
                </span>
                <span
                  aria-hidden="true"
                  className="col-start-1 row-start-1 text-[20px] opacity-0 transition-opacity duration-500 group-data-[hover=true]/orb:opacity-100 md:text-[24px]"
                >
                  {phase === "idle" ? "Clique para começar" : "Clique para continuar"}
                </span>
              </span>
            ) : paused ? (
              "Pausado"
            ) : (
              PHASE_LABEL[phase]
            )}
          </p>
          {running && (
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-[#2E2F2A]/70">
              {cycle} de {CYCLES}
            </p>
          )}
        </div>

        {/* Clicar/tocar na esfera inicia. É um atalho para mouse e toque: fica fora
            da navegação por teclado e do leitor de tela, que usam o botão abaixo. */}
        {interactive && (
          <div
            aria-hidden="true"
            onClick={start}
            className="absolute inset-[9%] cursor-pointer rounded-full"
          />
        )}

        {/* Folhas que voam ao expirar */}
        {leaves.map((leaf) => (
          <img
            key={leaf.id}
            src={leaf.src}
            alt=""
            aria-hidden="true"
            draggable={false}
            className="pointer-events-none absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 select-none opacity-0 animate-leaf-away"
            style={leaf.style}
            onAnimationEnd={() => setLeaves((prev) => prev.filter((l) => l.id !== leaf.id))}
          />
        ))}
      </div>

      {/* Anúncio para leitores de tela */}
      <p className="sr-only" aria-live="polite">
        {paused ? "Pausado" : running ? `${PHASE_LABEL[phase]} Respiração ${cycle} de ${CYCLES}.` : ""}
      </p>

      {/* Controles */}
      <div className="mt-8 flex min-h-[52px] flex-col items-center gap-3">
        {phase === "idle" && (
          <button
            type="button"
            onClick={start}
            className="group/cta relative min-h-[48px] cursor-pointer overflow-hidden rounded-full bg-olive px-8 py-3 text-base font-medium text-white shadow-soft transition-all duration-500 ease-out hover:-translate-y-0.5 hover:bg-[#4E5C39] hover:shadow-[0_10px_28px_-10px_rgba(78,92,57,0.55)] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ButtonLeaves />
            <span className="relative">Começar a respirar</span>
          </button>
        )}
        {running && (
          <button
            type="button"
            onClick={togglePause}
            className="min-h-[44px] cursor-pointer rounded-full border border-foreground/20 px-6 py-2.5 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/40 hover:bg-foreground/5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {paused ? "Continuar" : "Pausar"}
          </button>
        )}
        {phase === "done" && (
          <div className="flex animate-fade-in-slow flex-col items-center gap-3 text-center">
            <p className="max-w-sm text-base leading-relaxed text-foreground md:text-lg">
              Percebe a diferença? Se quiser, continue mais um pouco.
            </p>
            <button
              type="button"
              onClick={start}
              className="min-h-[44px] cursor-pointer rounded-full border border-foreground/20 px-6 py-2.5 text-sm font-medium text-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground/40 hover:bg-foreground/5 active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Continuar respirando
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
