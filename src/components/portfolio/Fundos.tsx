import { useEffect, useId, useRef, useState } from "react";
import bgHero3840 from "@/assets/bg-hero-3840.webp";

// Fundos decorativos das seções. Todos ficam atrás do conteúdo (-z-10) e
// precisam de um pai com `relative`, ocupando a largura toda da tela.

// Fundo de traçados da primeira dobra: só o lado esquerdo aparece (some antes
// da foto), apaga embaixo e abre um "buraco" suave atrás do texto.
const TRACADOS_MASK = {
  maskImage:
    "radial-gradient(ellipse 30% 42% at 27% 52%, transparent 55%, black 100%), linear-gradient(to bottom, black 75%, transparent), linear-gradient(to right, black 35%, transparent 55%)",
  maskComposite: "intersect",
} as const;

/** Topo, versão 1: imagem de traçados cromados (gerada por IA), só à esquerda. */
export function TracadosHero() {
  return (
    <img
      src={bgHero3840}
      alt=""
      aria-hidden
      width={3840}
      height={2160}
      className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[46%] w-full select-none object-cover opacity-25 mix-blend-screen md:top-0 md:h-full"
      style={TRACADOS_MASK}
    />
  );
}

/**
 * Topo, versão 2 (teste): "Silver Arrow". Fundo de aço escovado escuro, faixa de
 * luz verde-petróleo no canto inferior direito com três filetes paralelos e um
 * reflexo prateado no canto superior esquerdo. Tudo desenhado em CSS.
 */
export function SilverArrowHero() {
  return (
    <div
      aria-hidden
      // Desce 240px para dentro da seção seguinte e apaga nos últimos 320px:
      // assim o brilho petróleo não termina numa linha reta no fim do topo.
      className="pointer-events-none absolute inset-x-0 top-0 -bottom-[240px] -z-10 overflow-hidden [mask-image:linear-gradient(to_bottom,black_calc(100%-320px),transparent)]"
    >
      {/* Base + aço escovado */}
      <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.018)_0_1px,transparent_1px_4px),linear-gradient(180deg,#0b0c0d,#060607)]" />
      {/* Reflexo prateado no canto superior esquerdo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_0_0,rgba(200,205,210,0.07),transparent_60%)]" />

      {/* Faixa de luz + filetes: mais fracos no celular, para não competir com o texto */}
      <div className="absolute inset-0 opacity-40 md:opacity-100">
        <div className="absolute -bottom-[260px] -right-[360px] h-[620px] w-[1300px] -rotate-[14deg] rounded-full bg-[radial-gradient(closest-side,rgba(0,161,156,0.32),transparent)] blur-[20px]" />

        <div className="absolute bottom-[150px] -right-[60px] w-[1000px] origin-right -rotate-[14deg] space-y-[14px]">
          {/* 1º filete: petróleo, com brilho que percorre a linha a cada 6 s */}
          <div className="filete-petroleo h-[2px] w-full" />
          {/* 2º e 3º: prata, mais curtos */}
          <div className="ml-auto h-px w-[72%] bg-[linear-gradient(90deg,transparent,rgba(220,220,220,0.35))]" />
          <div className="ml-auto h-px w-[52%] bg-[linear-gradient(90deg,transparent,rgba(220,220,220,0.18))]" />
        </div>
      </div>
    </div>
  );
}

/**
 * Pilares: as linhas que descem pelo lado direito, encontrando os filetes do topo
 * num "<". Redesenhadas em SVG com a mesma geometria da imagem de traçados
 * (coordenadas da imagem, 1672x941, espelhadas), para poderem ter cor própria:
 * linha principal em verde-petróleo com glow, as demais em prata sutil.
 */
export function DiagonaisEspelhadas() {
  const id = useId();
  const prata = (opacidade: number) => `rgba(220,220,220,${opacidade})`;
  return (
    <svg
      aria-hidden
      viewBox="0 0 1672 941"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      // A máscara é aplicada antes do espelhamento: "lado esquerdo" aqui vira o direito na tela.
      style={{
        maskImage:
          "linear-gradient(to right, black 35%, transparent 55%), linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        maskComposite: "intersect",
      }}
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full -scale-x-100 opacity-40 md:opacity-100"
    >
      <defs>
        {/* Principal: some nas duas pontas */}
        <linearGradient
          id={`${id}-p`}
          x1="1150"
          y1="45"
          x2="0"
          y2="446"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#00a19c" stopOpacity="0" />
          <stop offset="0.3" stopColor="#00a19c" stopOpacity="0.95" />
          <stop offset="0.75" stopColor="#00a19c" stopOpacity="0.95" />
          <stop offset="1" stopColor="#00a19c" stopOpacity="0" />
        </linearGradient>
        {/* Glow equivalente a box-shadow 0 0 14px rgba(0,161,156,.6) */}
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
          <feColorMatrix
            in="blur"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.6 0"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Secundárias e tracejada, em prata sutil (1px, como os filetes prata do topo) */}
      <g vectorEffect="non-scaling-stroke" strokeWidth="1">
        <path
          d="M1150 70 H476 Q456 70 442 86 L150 420"
          stroke={prata(0.25)}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0 122 H285 Q300 122 311 110 L360 57"
          stroke={prata(0.2)}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0 142 H290 Q305 142 316 130 L395 48"
          stroke={prata(0.18)}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0 650 L310 292 Q318 284 332 284 H460"
          stroke={prata(0.15)}
          vectorEffect="non-scaling-stroke"
        />
        <path d="M0 382 L275 190" stroke={prata(0.15)} vectorEffect="non-scaling-stroke" />
        <path d="M0 468 H255" stroke={prata(0.2)} vectorEffect="non-scaling-stroke" />
        <path
          d="M518 95 L160 452"
          stroke={prata(0.22)}
          strokeDasharray="3 7"
          vectorEffect="non-scaling-stroke"
        />
        {/* Marcas "//////" */}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path
            key={i}
            d={`M${98 + i * 28} 110 L${120 + i * 28} 86`}
            stroke={prata(0.25)}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>

      {/* Principal: verde-petróleo, 2px, com glow */}
      <path
        d="M1150 45 H488 Q466 45 450 62 L112 425 Q95 446 68 446 H0"
        stroke={`url(#${id}-p)`}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
        filter={`url(#${id}-glow)`}
      />
    </svg>
  );
}

/** Expertise: textura de fibra de carbono quase invisível. */
export function FibraCarbono() {
  return <div aria-hidden className="fibra-carbono pointer-events-none absolute inset-0 -z-10" />;
}

/** Método: grade fina de telemetria, como um overlay de dados da F1. */
export function GradeTelemetria() {
  return (
    <div aria-hidden className="grade-telemetria pointer-events-none absolute inset-0 -z-10" />
  );
}

/** Trajetória: linha prata que "corre" pela tela quando a seção aparece, como uma volta de pista. */
export function LinhaPista() {
  const ref = useRef<HTMLDivElement>(null);
  const [correu, setCorreu] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCorreu(true);
          obs.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`linha-pista pointer-events-none absolute inset-x-0 top-0 h-px max-md:hidden ${correu ? "correu" : ""}`}
    >
      <span className="linha-pista-trilho" />
      <span className="linha-pista-carro" />
    </div>
  );
}

/**
 * Divisor entre seções, só no celular: linha prata com o centro em petróleo e,
 * por cima, o rótulo "01 · PILARES". A linha cresce do centro para as bordas na
 * primeira vez que aparece (com redução de movimento, já aparece pronta).
 */
export function DivisorSecao({ numero, nome }: { numero: string; nome: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visto, setVisto] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVisto(true);
        obs.disconnect();
      }
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none relative flex justify-center px-4 md:hidden"
    >
      <span
        className={`absolute inset-x-4 top-1/2 h-px bg-[linear-gradient(90deg,transparent,rgba(220,220,220,0.2)_30%,#00a19c_50%,rgba(220,220,220,0.2)_70%,transparent)] transition-transform duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:scale-x-100 motion-reduce:transition-none ${
          visto ? "scale-x-100" : "scale-x-0"
        }`}
      />
      {/* Fundo da cor da página "corta" a linha; o padding da esquerda compensa o
          espaçamento que sobra depois da última letra */}
      <span className="relative bg-background py-1 pl-[calc(12px+0.35em)] pr-3 text-[10px] uppercase leading-none tracking-[0.35em] text-[#8a8a8a] lining-nums">
        {numero} · {nome}
      </span>
    </div>
  );
}
