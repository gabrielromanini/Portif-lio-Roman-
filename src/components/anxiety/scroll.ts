import { useEffect, useRef } from "react";

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Progresso de rolagem de um elemento, gravado como variável CSS (`--p`, de 0
 * a 1) no próprio elemento. Começa quando o topo do elemento chega a `start`
 * da altura da tela e termina depois de rolar `span` da altura do elemento.
 *
 * - Sem JavaScript (HTML do servidor) a variável não existe e o CSS usa o
 *   padrão 1: tudo aparece completo. A animação é só um enfeite.
 * - prefers-reduced-motion: fica em 1 (completo, parado).
 * - O listener de scroll só fica ligado enquanto o elemento está na tela, e
 *   atualiza no máximo uma vez por frame. Nada de estado do React.
 */
export function useScrollProgress<T extends HTMLElement>(
  { start = 0.85, span = 0.6, name = "--p" }: { start?: number; span?: number; name?: string } = {},
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      el.style.setProperty(name, "1");
      return;
    }
    let raf = 0;
    let listening = false;

    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = (window.innerHeight * start - r.top) / Math.max(1, r.height * span);
      el.style.setProperty(name, Math.min(1, Math.max(0, p)).toFixed(3));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !listening) {
        listening = true;
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
      } else if (!entry.isIntersecting && listening) {
        listening = false;
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
      update();
    });
    io.observe(el);
    update();

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [start, span, name]);

  return ref;
}

/**
 * Revelação em cascata: o grupo começa visível (HTML do servidor). Só se ele
 * estiver abaixo da tela quando o JavaScript carrega, os itens são escondidos
 * (`data-reveal="wait"`) e entram quando o grupo aparece (`data-reveal="in"`).
 * Use com as classes group/reveal + group-data-[reveal=wait]/reveal:… nos itens.
 */
export function useRevealOnScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.9) return; // já está na tela
    el.dataset.reveal = "wait";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = "in";
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return ref;
}
