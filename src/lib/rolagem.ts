import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

let instancia: Lenis | null = null;

/**
 * Rola até `y` (px do topo da página): suave pelo Lenis quando ele está ligado;
 * direto com movimento reduzido ou com `imediato`.
 */
export function rolarAte(y: number, imediato = false) {
  if (instancia) instancia.scrollTo(y, { immediate: imediato, force: true });
  else window.scrollTo({ top: y, behavior: "auto" });
}

/**
 * Rolagem suave (Lenis) ligada ao relógio do GSAP, para que as animações presas
 * ao scroll (ScrollTrigger) andem no mesmo quadro que a página.
 * Não liga com `prefers-reduced-motion`. Devolve a função que desliga.
 */
export function ligarRolagemSuave() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  // Os links "#secao" não passam pelo Lenis: quem trata é useEnderecoLimpo (Layout.tsx),
  // que rola por rolarAte e mantém o endereço sem o #.
  const lenis = new Lenis({ lerp: 0.1 });
  instancia = lenis;
  const quadro = (tempo: number) => lenis.raf(tempo * 1000);
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(quadro);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(quadro);
    lenis.destroy();
    instancia = null;
  };
}
