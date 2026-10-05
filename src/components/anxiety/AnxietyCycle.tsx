import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import {
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  HeartPulse,
  ListChecks,
  MapPin,
  MessageCircleQuestion,
  RotateCcw,
} from "lucide-react";
import { useScrollProgress } from "@/components/anxiety/scroll";

/**
 * O ciclo da ansiedade.
 *
 * Desktop (lg+): uma luz percorre o círculo etapa por etapa. Cada etapa
 * acende quando a luz chega e o centro mostra um exemplo do dia a dia.
 * A 1ª volta é lenta (para ler); depois a luz acelera de leve e a cor
 * esquenta (sálvia → rosé-terracota), como a ansiedade que se retroalimenta,
 * com teto de velocidade. Após a 1ª volta aparece "Interromper o ciclo":
 * a luz desacelera e para, o círculo se abre, uma folha sai pela abertura
 * e a página rola até "Como a terapia pode ajudar".
 *
 * - Só anda com a seção na tela (pausa fora dela).
 * - prefers-reduced-motion: a luz não anda sozinha; etapas por botões.
 * - Leitor de tela: lista com todas as etapas e exemplos (sem anúncios
 *   automáticos a cada troca).
 * - Celular/tablet: lista vertical estática com um brilho suave atrás.
 */

interface Step {
  icon: typeof MapPin;
  title: string;
  detail?: string;
  /** Exemplo do dia a dia (rascunho — revisar com a Yole). */
  example: string;
}

const STEPS: Step[] = [
  { icon: MapPin, title: "Situação", example: "Chega uma mensagem: “Podemos conversar amanhã?”" },
  {
    icon: MessageCircleQuestion,
    title: "Pensamentos:",
    detail: "“E se alguma coisa der errado?”",
    example: "“E se eu fiz algo errado? E se for algo grave?”",
  },
  { icon: HeartPulse, title: "Ansiedade e tensão", example: "Aperto no peito, dificuldade para dormir." },
  {
    icon: ListChecks,
    title: "Comportamentos:",
    detail: "tentar prever tudo • evitar • checar • buscar certeza • pensar excessivamente",
    example: "Reler a mensagem várias vezes, imaginar todos os cenários, pedir opinião a todo mundo.",
  },
  {
    icon: CloudSun,
    title: "Alívio temporário",
    example: "Alguém diz que não deve ser nada, e o alívio dura alguns minutos.",
  },
  {
    icon: RotateCcw,
    title: "A necessidade de controle aumenta a ansiedade novamente",
    example: "Na próxima mensagem inesperada, a preocupação volta mais forte.",
  },
];

// ---- Ritmo da luz (segundos por volta) ----
const LAP_SECONDS = [30, 24, 20, 18]; // a partir da 4ª volta fica em 18 s (teto)
const SPEED_SMOOTHING = 1.2; // 1/s, quão suave a velocidade muda
const STOP_DECAY = 2.4; // 1/s, desaceleração ao interromper
const OPEN_GAP_DEG = 46; // tamanho da abertura do círculo
const SCROLL_AFTER_OPEN_MS = 2800; // espera a folha sair pela abertura

// ---- Cor: sálvia → rosé-terracota (nunca vermelho) ----
const COOL = [143, 166, 126]; // #8fa67e
const WARM = [201, 143, 122]; // #c98f7a
const HEAT_FULL_LAP = 3; // na 3ª volta completa chega à cor mais quente

// ---- Geometria (desktop), em unidades do viewBox ----
const VB_W = 920;
const VB_H = 700;
const CX = 460;
const CY = 330;
const R = 210;
const ICON = 52;

type Phase = "running" | "stopping" | "open" | "manual";

/** Ponto no círculo; 0° = topo, sentido horário. */
const pointAt = (deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: CX + R * Math.cos(a), y: CY + R * Math.sin(a) };
};
const mix = (t: number) => `rgb(${COOL.map((c, i) => Math.round(c + (WARM[i] - c) * t)).join(",")})`;
const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function AnxietyCycle() {
  return (
    <>
      <CycleDesktop />
      <CycleMobile />
    </>
  );
}

// ======================= Desktop =======================

function CycleDesktop() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<SVGGElement>(null);
  const [step, setStep] = useState(0);
  const [lap, setLap] = useState(0);
  const [phase, setPhase] = useState<Phase>("running");
  const [heat, setHeat] = useState(0);

  // Estado do movimento fora do React (muda a cada frame).
  const theta = useRef(0); // 0–360 dentro da volta
  const lapRef = useRef(0);
  const speed = useRef(360 / LAP_SECONDS[0]); // graus/s
  const inView = useRef(false);
  const phaseRef = useRef<Phase>("running");
  phaseRef.current = phase;

  const placeLight = useCallback((deg: number, color: string) => {
    const g = lightRef.current;
    if (!g) return;
    const { x, y } = pointAt(deg);
    g.setAttribute("transform", `translate(${x} ${y})`);
    g.style.setProperty("--light", color);
  }, []);

  // reduced-motion: modo manual (a luz pula de etapa em etapa)
  useEffect(() => {
    if (prefersReduced()) setPhase("manual");
  }, []);

  // Só anda com a seção visível.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (inView.current = e.isIntersecting), {
      threshold: 0.35,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Loop da luz. React só é atualizado ao trocar de etapa/volta/cor.
  useEffect(() => {
    if (phase === "manual" || phase === "open") return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (inView.current) {
        if (phaseRef.current === "stopping") {
          speed.current *= Math.exp(-STOP_DECAY * dt);
          if (speed.current < 4) {
            setPhase("open");
            return;
          }
        } else {
          const target = 360 / LAP_SECONDS[Math.min(lapRef.current, LAP_SECONDS.length - 1)];
          speed.current += (target - speed.current) * (1 - Math.exp(-SPEED_SMOOTHING * dt));
        }
        theta.current += speed.current * dt;
        if (theta.current >= 360) {
          theta.current -= 360;
          lapRef.current += 1;
          setLap(lapRef.current);
        }
        // Esquenta a partir do fim da 1ª volta.
        const t = Math.min(1, Math.max(0, lapRef.current - 1 + theta.current / 360) / (HEAT_FULL_LAP - 1));
        placeLight(theta.current, mix(t));
        setHeat((h) => (Math.abs(h - t) > 0.04 || (t === 1 && h !== 1) ? t : h));
        const s = Math.floor(theta.current / 60) % 6;
        setStep((cur) => (cur === s ? cur : s));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase, placeLight]);

  // Abriu: depois de um instante, leva para "Como a terapia pode ajudar".
  useEffect(() => {
    if (phase !== "open") return;
    const reduce = prefersReduced();
    const t = window.setTimeout(
      () =>
        document
          .getElementById("como-a-terapia-ajuda")
          ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }),
      reduce ? 300 : SCROLL_AFTER_OPEN_MS,
    );
    return () => window.clearTimeout(t);
  }, [phase]);

  // Modo manual: posiciona a luz na etapa atual.
  useEffect(() => {
    if (phase === "manual") placeLight(step * 60, mix(0));
  }, [phase, step, placeLight]);

  function goTo(i: number) {
    theta.current = i * 60 + 0.01;
    setStep(i);
    if (phase === "manual") placeLight(i * 60, mix(0));
  }
  function interrupt() {
    setPhase(phase === "manual" ? "open" : "stopping");
  }
  function restart() {
    theta.current = 0;
    lapRef.current = 0;
    speed.current = 360 / LAP_SECONDS[0];
    setLap(0);
    setStep(0);
    setHeat(0);
    setPhase(prefersReduced() ? "manual" : "running");
  }

  const open = phase === "open";
  const explaining = phase === "manual" || lap === 0;
  const showInterrupt = (phase === "manual" || lap >= 1) && phase !== "stopping" && !open;
  const ringColor = mix(heat);
  const gap = open ? OPEN_GAP_DEG : 0;
  const current = STEPS[step];
  // A abertura fica à direita, entre "Pensamentos" (60°) e "Ansiedade e tensão" (120°).
  const exit = pointAt(90);

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto hidden w-full max-w-[920px] lg:block"
      style={{ aspectRatio: `${VB_W} / ${VB_H}` }}
    >
      {/* Leitor de tela: tudo de uma vez, sem anúncios automáticos. */}
      <ol className="sr-only">
        {STEPS.map((s, i) => (
          <li key={i}>
            {s.title} {s.detail} Exemplo: {s.example}
          </li>
        ))}
      </ol>

      <svg aria-hidden="true" viewBox={`0 0 ${VB_W} ${VB_H}`} className="absolute inset-0 h-full w-full">
        <defs>
          <filter id="cycle-light-blur" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        {/* Trilho do ciclo; abre à direita ao interromper. O círculo SVG começa
            às 3h (= 90° aqui), então a abertura fica centrada ali. */}
        <circle
          cx={CX}
          cy={CY}
          r={R}
          fill="none"
          stroke={ringColor}
          strokeOpacity="0.6"
          strokeWidth="2.5"
          strokeLinecap="round"
          pathLength={360}
          style={
            {
              strokeDasharray: `${360 - gap} ${gap}`,
              strokeDashoffset: -gap / 2,
              transition: "stroke-dasharray 1.4s ease-out, stroke-dashoffset 1.4s ease-out, stroke 1.5s linear",
            } as CSSProperties
          }
        />
        {/* Setas no sentido do ciclo (somem as que ficam na abertura). */}
        {STEPS.map((_, i) => {
          const { x, y } = pointAt(i * 60 + 30);
          return (
            <g
              key={i}
              transform={`translate(${x} ${y}) rotate(${i * 60 + 30})`}
              style={{ opacity: open && i === 1 ? 0 : 1, transition: "opacity .8s" }}
            >
              <path
                d="M-6 -7 L4 0 L-6 7"
                fill="none"
                stroke={ringColor}
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          );
        })}
        {/* A luz */}
        <g
          ref={lightRef}
          style={{ opacity: open ? 0 : 1, transition: "opacity 1s" } as CSSProperties}
          transform={`translate(${pointAt(0).x} ${pointAt(0).y})`}
        >
          <circle r="18" fill="var(--light, #8fa67e)" opacity="0.6" filter="url(#cycle-light-blur)" />
          <circle r="6" fill="#fffdf8" />
          <circle r="6" fill="none" stroke="var(--light, #8fa67e)" strokeWidth="2" />
        </g>
      </svg>

      {/* Folha que sai pela abertura ao interromper. */}
      {open && (
        <img
          src="/folhas/folha2.webp"
          alt=""
          aria-hidden="true"
          draggable={false}
          className="pointer-events-none absolute h-11 w-11 select-none animate-cycle-leaf-out motion-reduce:hidden"
          style={{
            left: `calc(${(exit.x / VB_W) * 100}% - 22px)`,
            top: `calc(${(exit.y / VB_H) * 100}% - 22px)`,
          }}
        />
      )}

      {/* Centro */}
      <div className="absolute left-1/2 top-[47%] flex w-[300px] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center">
        {open ? (
          <div key="open" className="animate-fade-in-slow">
            <p className="font-serif text-3xl leading-tight text-foreground">Ciclo interrompido.</p>
            <button
              type="button"
              onClick={restart}
              className="mt-3 cursor-pointer text-sm font-medium text-[#4A4440] underline underline-offset-4 hover:text-foreground"
            >
              Ver de novo
            </button>
          </div>
        ) : (
          <div key={`${step}-${explaining}`} className="animate-fade-in-slow">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#4A4440]">
              Etapa {step + 1} de 6
            </p>
            <p className={`mt-2 font-serif leading-tight text-foreground ${explaining ? "text-2xl" : "text-3xl"}`}>
              {current.title.replace(/:$/, "")}
            </p>
            {explaining && <p className="mt-3 text-base leading-relaxed text-[#4A4440]">{current.example}</p>}
          </div>
        )}

        {phase === "manual" && (
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              aria-label="Etapa anterior"
              onClick={() => goTo((step + 5) % 6)}
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#2E2F2A]/20 hover:bg-white/60"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Próxima etapa"
              onClick={() => goTo((step + 1) % 6)}
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-[#2E2F2A]/20 hover:bg-white/60"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}

        <div
          className={`mt-5 transition-opacity duration-700 ${showInterrupt ? "opacity-100" : "pointer-events-none opacity-0"}`}
        >
          <button
            type="button"
            onClick={interrupt}
            tabIndex={showInterrupt ? 0 : -1}
            className="min-h-[46px] cursor-pointer rounded-full bg-olive px-6 py-2.5 text-base font-medium text-white shadow-soft transition-all duration-500 ease-out hover:-translate-y-0.5 hover:bg-[#4E5C39] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Interromper o ciclo
          </button>
        </div>
      </div>

      {/* Etapas ao redor (clicáveis: levam a luz até a etapa). */}
      {STEPS.map((s, i) => {
        const angle = -90 + i * 60;
        const { x, y } = pointAt(i * 60);
        const left = (x / VB_W) * 100;
        const top = (y / VB_H) * 100;
        const side = angle === -90 ? "top" : angle === 90 ? "bottom" : x > CX ? "right" : "left";
        const layout: Record<string, string> = {
          top: "flex-col-reverse items-center text-center -translate-x-1/2 -translate-y-full",
          bottom: "flex-col items-center text-center -translate-x-1/2",
          right: "flex-row items-center text-left",
          left: "flex-row-reverse items-center text-right",
        };
        const pos: Record<string, CSSProperties> = {
          top: { left: `${left}%`, top: `calc(${top}% + ${ICON / 2}px)` },
          bottom: { left: `${left}%`, top: `calc(${top}% - ${ICON / 2}px)` },
          right: { left: `calc(${left}% - ${ICON / 2}px)`, top: `${top}%`, translate: "0 -50%" },
          left: { left: `calc(${left}% + ${ICON / 2}px)`, top: `${top}%`, translate: "-100% -50%" },
        };
        const active = i === step && !open;
        return (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Ver etapa ${i + 1}: ${s.title.replace(/:$/, "")}`}
            className={`absolute flex cursor-pointer gap-3 rounded-2xl transition-opacity duration-700 ${layout[side]} ${
              active ? "opacity-100" : "opacity-80 hover:opacity-100"
            }`}
            style={{ ...pos[side], width: side === "top" || side === "bottom" ? 300 : 280 }}
          >
            <span
              className="relative z-10 inline-flex shrink-0 items-center justify-center rounded-full border border-white/70 text-[#2E2F2A] shadow-card transition-all duration-700"
              style={{
                width: ICON,
                height: ICON,
                background: active ? `color-mix(in srgb, ${ringColor} 45%, #ffffff)` : "#D3DACA",
                transform: active ? "scale(1.12)" : "scale(1)",
                boxShadow: active
                  ? `0 0 0 6px color-mix(in srgb, ${ringColor} 22%, transparent), 0 8px 24px -8px ${ringColor}`
                  : undefined,
              }}
            >
              <s.icon aria-hidden="true" className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2E2F2A] text-[11px] font-semibold text-white">
                {i + 1}
              </span>
            </span>
            <span className="text-base leading-snug text-foreground">
              <span className="font-semibold">{s.title}</span>
              {s.detail && <span className="mt-0.5 block text-[#4A4440]">{s.detail}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ======================= Celular / tablet =======================

function CycleMobile() {
  const listRef = useScrollProgress<HTMLOListElement>({ start: 0.85, span: 0.8 });
  return (
    <div className="relative mx-auto max-w-md lg:hidden">
      {/* Brilho suave atrás da lista, respirando devagar. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-6 inset-y-10 rounded-[50%] opacity-70 blur-3xl animate-bloom motion-reduce:animate-none"
        style={{
          background:
            "radial-gradient(ellipse at 40% 35%, rgba(160,185,140,0.45), transparent 60%), radial-gradient(ellipse at 60% 75%, rgba(214,176,160,0.4), transparent 60%)",
        }}
      />
      <ol ref={listRef} className="relative">
        <span
          aria-hidden="true"
          className="absolute bottom-8 left-[25px] top-6 w-0.5 origin-top rounded-full bg-[#8fa67e]/70"
          style={{ transform: "scaleY(var(--p, 1))" }}
        />
        {/* Luz que desce pela linha (como a do círculo no desktop): some na
            última etapa e volta na primeira. Passa ATRÁS dos ícones (z-0; os
            ícones são z-10). Só CSS; escondida com prefers-reduced-motion. */}
        <span aria-hidden="true" className="absolute bottom-8 left-[25px] top-6 z-0 w-0.5 motion-reduce:hidden">
          <span
            className="absolute left-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#8fa67e] bg-[#fffdf8] animate-cycle-dot-down"
            style={{ boxShadow: "0 0 14px 4px rgba(143,166,126,0.75)" }}
          />
        </span>
        {STEPS.map((s, i) => (
          <li key={i} className="relative">
            <div className="flex items-start gap-4">
              <span
                className="relative z-10 inline-flex shrink-0 items-center justify-center rounded-full border border-white/70 bg-[#D3DACA] text-[#2E2F2A] shadow-card"
                style={{ width: ICON, height: ICON }}
              >
                <s.icon aria-hidden="true" className="h-6 w-6" />
                <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#2E2F2A] text-[11px] font-semibold text-white">
                  {i + 1}
                </span>
              </span>
              <div className="pt-2.5">
                <p className="text-base leading-snug text-foreground">
                  <span className="font-semibold">{s.title}</span>
                  {s.detail && <span className="mt-0.5 block text-[#4A4440]">{s.detail}</span>}
                </p>
                <p className="mt-1.5 text-sm italic leading-relaxed text-[#4A4440]">{s.example}</p>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <ArrowDown aria-hidden="true" className="my-2 ml-[15px] h-5 w-5 text-[#6f8a60]" />
            )}
          </li>
        ))}
        <li className="relative mt-3 flex items-center gap-4">
          <span className="relative inline-flex h-[52px] w-[52px] shrink-0 items-center justify-center">
            <RotateCcw aria-hidden="true" className="h-6 w-6 text-[#5f7a52]" />
          </span>
          <span className="sr-only">Volta para a etapa 1.</span>
        </li>
      </ol>
    </div>
  );
}
