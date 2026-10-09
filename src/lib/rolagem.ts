import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };

/**
 * Rolagem suave (Lenis) ligada ao relógio do GSAP, para que as animações presas
 * ao scroll (ScrollTrigger) andem no mesmo quadro que a página.
 * Não liga com `prefers-reduced-motion`. Devolve a função que desliga.
 */
export function ligarRolagemSuave() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  // `anchors`: links "#secao" rolam pelo Lenis, respeitando o scroll-mt das seções.
  const lenis = new Lenis({ anchors: true, lerp: 0.1 });
  const quadro = (tempo: number) => lenis.raf(tempo * 1000);
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(quadro);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(quadro);
    lenis.destroy();
  };
}
