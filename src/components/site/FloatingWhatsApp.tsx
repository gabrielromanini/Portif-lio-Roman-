import { useEffect, useRef } from "react";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { WHATSAPP_URL } from "@/lib/site";

/**
 * Botão flutuante do WhatsApp.
 *
 * No mobile ele só aparece depois que o botão principal da página (classe
 * `hero-cta`) sai da tela por cima (se a página não tiver esse botão, aparece
 * direto) e se esconde enquanto houver na tela um elemento marcado com
 * `data-hide-floating`. Só troca um atributo ao cruzar os limites. (No
 * desktop as classes max-md: não se aplicam: ele fica sempre visível.)
 */
export function FloatingWhatsApp({ href = WHATSAPP_URL }: { href?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // 1) só depois que o botão principal (hero-cta) sai da tela por cima;
    // 2) nunca enquanto um elemento marcado com data-hide-floating estiver na
    //    tela (ex.: o card "Sentindo ansiedade agora?"), para não cobri-lo.
    const heroCta = document.querySelector(".hero-cta");
    let passed = !heroCta;
    const visible = new Set<Element>();
    const update = () => {
      el.dataset.show = passed && visible.size === 0 ? "true" : "false";
    };
    const observers: IntersectionObserver[] = [];
    if (heroCta) {
      const io = new IntersectionObserver(([entry]) => {
        passed = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        update();
      });
      io.observe(heroCta);
      observers.push(io);
    }
    const avoid = document.querySelectorAll("[data-hide-floating]");
    if (avoid.length) {
      const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        update();
      });
      avoid.forEach((a) => io.observe(a));
      observers.push(io);
    }
    update();
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <a
      ref={ref}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Fale com a Yole no WhatsApp"
      className="fixed bottom-24 right-5 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-soft ring-1 ring-black/5 transition-[translate,scale,opacity,visibility] duration-300 hover:scale-110 hover:brightness-95 max-md:invisible max-md:translate-y-2 max-md:opacity-0 max-md:data-[show=true]:visible max-md:data-[show=true]:translate-y-0 max-md:data-[show=true]:opacity-100 md:bottom-28 md:right-7 md:h-16 md:w-16"
    >
      <WhatsAppIcon className="h-7 w-7 md:h-8 md:w-8" />
      <span className="sr-only">Abrir conversa no WhatsApp</span>
    </a>
  );
}
