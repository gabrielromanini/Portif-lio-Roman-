import { useEffect, useRef, type CSSProperties } from "react";

// Manchas de névoa: posição (% da página), tamanho (px), lado e cor.
type Mancha = { topo: string; lado: string; tamanho: number; cor: string };
const PRATA = "rgba(175, 192, 200, 0.085)";
const PETROLEO = "rgba(0, 161, 156, 0.1)";

// Camada de trás: maiores e mais apagadas, andam devagar (parecem longe)
const FUNDO: Mancha[] = [
  { topo: "14%", lado: "62%", tamanho: 1300, cor: PRATA },
  { topo: "30%", lado: "-8%", tamanho: 1200, cor: PETROLEO },
  { topo: "47%", lado: "70%", tamanho: 1300, cor: PETROLEO },
  { topo: "63%", lado: "4%", tamanho: 1250, cor: PRATA },
  { topo: "80%", lado: "58%", tamanho: 1300, cor: PETROLEO },
];
// Camada da frente: menores, um pouco mais marcadas, andam mais rápido
const FRENTE: Mancha[] = [
  { topo: "20%", lado: "-4%", tamanho: 720, cor: PETROLEO },
  { topo: "38%", lado: "78%", tamanho: 680, cor: PRATA },
  { topo: "55%", lado: "-6%", tamanho: 700, cor: PETROLEO },
  { topo: "72%", lado: "80%", tamanho: 720, cor: PETROLEO },
  { topo: "90%", lado: "10%", tamanho: 680, cor: PRATA },
];

function Camada({
  manchas,
  camadaRef,
}: {
  manchas: Mancha[];
  camadaRef: React.Ref<HTMLDivElement>;
}) {
  return (
    <div ref={camadaRef} className="absolute inset-0 will-change-transform">
      {manchas.map((m) => (
        <div
          key={m.topo}
          className="absolute -translate-y-1/2 rounded-full"
          style={
            {
              top: m.topo,
              left: m.lado,
              width: m.tamanho,
              height: m.tamanho,
              background: `radial-gradient(circle closest-side, ${m.cor}, transparent)`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/**
 * Profundidade do fundo da página toda, atrás do conteúdo:
 * - Névoa em duas camadas: ao rolar, a de trás anda mais devagar que a da frente
 *   (parallax), o que o olho lê como distância. Só transform, só ao rolar.
 * - Grão de filme quase invisível (fixo), para o preto não ficar chapado.
 * - Movimento reduzido: a névoa fica parada.
 */
export function Profundidade() {
  const fundo = useRef<HTMLDivElement>(null);
  const frente = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let quadro = 0;
    const desenhar = () => {
      quadro = 0;
      const y = window.scrollY;
      // Descer junto com a rolagem = andar mais devagar que a página
      if (fundo.current)
        fundo.current.style.transform = `translate3d(0, ${(y * 0.35).toFixed(1)}px, 0)`;
      if (frente.current)
        frente.current.style.transform = `translate3d(0, ${(y * 0.12).toFixed(1)}px, 0)`;
    };
    const pedir = () => {
      if (!quadro) quadro = requestAnimationFrame(desenhar);
    };
    desenhar();
    window.addEventListener("scroll", pedir, { passive: true });
    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener("scroll", pedir);
    };
  }, []);

  return (
    <>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Camada manchas={FUNDO} camadaRef={fundo} />
        <Camada manchas={FRENTE} camadaRef={frente} />
      </div>
      <div aria-hidden className="grao pointer-events-none fixed inset-0 -z-10" />
    </>
  );
}
