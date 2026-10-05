import { useEffect, useRef, useState } from "react";
import bgHero3840 from "@/assets/bg-hero-3840.webp";

// Fundos decorativos das seções. Todos ficam atrás do conteúdo (-z-10) e
// precisam de um pai com `relative`, ocupando a largura toda da tela.

/** Pilares: os mesmos traçados da primeira dobra, espelhados para o lado direito. */
export function DiagonaisEspelhadas() {
  return (
    <img
      src={bgHero3840}
      alt=""
      aria-hidden
      width={3840}
      height={2160}
      loading="lazy"
      // A máscara é aplicada antes do espelhamento: "lado esquerdo" aqui vira o direito na tela.
      style={{
        maskImage:
          "linear-gradient(to right, black 35%, transparent 55%), linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        maskComposite: "intersect",
      }}
      className="pointer-events-none absolute inset-0 -z-10 h-full w-full -scale-x-100 select-none object-cover opacity-25 mix-blend-screen"
    />
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
      className={`linha-pista pointer-events-none absolute inset-x-0 top-0 h-px ${correu ? "correu" : ""}`}
    >
      <span className="linha-pista-trilho" />
      <span className="linha-pista-carro" />
    </div>
  );
}
