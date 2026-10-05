import * as React from "react";

/**
 * Manchas de luz atrás da foto do hero + parallax sutil do mouse.
 *
 * - As manchas derivam sozinhas por CSS (keyframes blob-drift-*).
 * - O mouse só ajusta duas variáveis CSS (--mx, --my, de -1 a 1) no
 *   elemento do hero; as manchas seguem o mouse e a foto vai no sentido
 *   contrário, poucos pixels. Nada de estado do React por frame.
 * - Só no desktop (tela larga + mouse de verdade) e nunca com
 *   prefers-reduced-motion. Fora disso as variáveis ficam em 0.
 */

// ---- Ajustes ----
const PARALLAX_MEDIA = "(min-width: 768px) and (hover: hover) and (pointer: fine)";
const SMOOTHING = 4; // 1/s, quão rápido acompanha o mouse (menor = mais preguiçoso)
const SETTLE_EPSILON = 0.001;

/** Deslocamento de cada camada, em px, quando o mouse está na borda. */
export const PARALLAX_BLOB_PX = [18, 12, 24];
export const PARALLAX_PHOTO_PX = -6; // negativo = sentido contrário

export function useHeroParallax(ref: React.RefObject<HTMLElement | null>) {
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia(PARALLAX_MEDIA).matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let rafId = 0;
    let last = 0;

    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const k = 1 - Math.exp(-SMOOTHING * dt);
      x += (targetX - x) * k;
      y += (targetY - y) * k;
      el!.style.setProperty("--mx", x.toFixed(4));
      el!.style.setProperty("--my", y.toFixed(4));
      if (Math.abs(targetX - x) > SETTLE_EPSILON || Math.abs(targetY - y) > SETTLE_EPSILON) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = 0;
      }
    }
    function kick() {
      if (rafId) return;
      last = performance.now();
      rafId = requestAnimationFrame(tick);
    }
    function onMove(e: PointerEvent) {
      const rect = el!.getBoundingClientRect();
      targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      targetY = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      kick();
    }
    function onLeave() {
      targetX = 0;
      targetY = 0;
      kick();
    }

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(rafId);
    };
  }, [ref]);
}

/** Estilo de uma camada que segue o mouse (usa --mx/--my do hero). */
export function parallaxStyle(px: number): React.CSSProperties {
  return {
    translate: `calc(var(--mx, 0) * ${px}px) calc(var(--my, 0) * ${px}px)`,
  };
}

const BLOBS = [
  // areia clara, grande, em cima à esquerda
  "left-[-12%] top-[-8%] h-[70%] w-[70%] bg-[#F5EFE6] opacity-80 animate-blob-1",
  // sálvia claro, embaixo à direita
  "right-[-14%] bottom-[-6%] h-[65%] w-[65%] bg-[#E3E8D8] opacity-90 animate-blob-2",
  // sálvia um pouco mais presente, pequena, no meio
  "left-[20%] top-[35%] h-[45%] w-[45%] bg-[#D3DACA] opacity-60 animate-blob-3",
];

export function HeroBlobs() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden md:block">
      {BLOBS.map((cls, i) => (
        <div key={i} className="absolute inset-0" style={parallaxStyle(PARALLAX_BLOB_PX[i])}>
          <div
            className={`absolute rounded-full blur-3xl motion-reduce:animate-none ${cls}`}
          />
        </div>
      ))}
    </div>
  );
}
