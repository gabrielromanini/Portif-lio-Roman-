import { Leaf } from "lucide-react";
import { CardLeaves } from "@/components/decorative/CardLeaves";

/**
 * Card "Sentindo ansiedade agora?" da home, que leva à página /ansiedade.
 *
 * Fica logo abaixo do hero, sobreposto à transição: metade sobre o fim do
 * hero, metade sobre "Quando buscar terapia online" (margens negativas).
 * Só o botão é link. À esquerda, uma mini esfera — a mesma da
 * respiração da /ansiedade — cresce e diminui devagar (4s), com glow.
 * Desktop: horizontal (esfera · texto · botão). Celular: empilhado.
 * prefers-reduced-motion: esfera parada.
 *
 * `data-hide-floating`: no celular, o botão flutuante do WhatsApp se esconde
 * enquanto o card está na tela, para não cobri-lo.
 */
export function BreatheInvite() {
  // Embaixo: ~80px (celular) / ~120px (desktop) até o título da seção
  // seguinte, no mesmo ritmo das outras seções.
  return (
    <div className="relative z-20 -mt-2 mb-4 px-4 md:-mt-10 md:mb-6">
      {/* O card não é clicável: só o botão leva à /ansiedade. No hover do
          card aparecem as folhas, como nos cards da home. */}
      <div
        data-hide-floating
        className="group relative mx-auto flex max-w-[760px] flex-col items-center gap-4 overflow-hidden rounded-3xl border border-[#E3E8D8] bg-white/85 p-6 text-center shadow-[0_12px_40px_-18px_rgba(46,47,42,0.25)] backdrop-blur-md transition-[translate,box-shadow,border-color] duration-500 ease-out hover:-translate-y-0.5 hover:border-secondary/50 hover:shadow-[0_18px_48px_-18px_rgba(46,47,42,0.3)] motion-reduce:hover:translate-y-0 md:flex-row md:gap-5 md:p-5 md:pr-6 md:text-left"
      >
        <CardLeaves compact variant={0} />
        <MiniOrb />
        <div className="relative flex-1">
          <p className="font-serif text-[22px] font-bold leading-tight text-[#2E2F2A]">
            Sentindo ansiedade agora?
          </p>
          {/* #2E2F2A a 75% sobre o card (branco 85%) ≈ 6,9:1 (AA) */}
          <p className="mt-1 text-sm leading-relaxed text-[#2E2F2A]/75 md:text-base">
            Em 1 minuto, seu corpo pode começar a desacelerar. Depois, entenda mais sobre a ansiedade{" "}
            {/* "aqui" é texto comum (mesma cor): só aponta para o botão ao lado */}
            aqui.
          </p>
        </div>
        {/* Botão: largura automática, sem borda, sálvia (nem oliva nem verde
            WhatsApp). Texto #2E2F2A: 8,4:1 no fundo e 7,5:1 no hover. */}
        <a
          href="/ansiedade"
          className="relative inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-full bg-[#C5D0B8] px-7 py-2.5 text-base font-semibold text-[#2E2F2A] shadow-[0_4px_14px_rgba(110,130,95,0.25)] transition-[translate,background-color] duration-300 ease-out hover:-translate-y-px hover:bg-[#B9C6AA] active:-translate-y-px active:bg-[#B9C6AA] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0"
        >
          <Leaf aria-hidden="true" className="h-4 w-4" />
          Respirar agora
        </a>
      </div>
    </div>
  );
}

/** Mini esfera: mesmo visual da esfera da respiração, em 56px, com glow. */
function MiniOrb() {
  return (
    <span aria-hidden="true" className="relative inline-flex h-14 w-14 shrink-0 items-center justify-center">
      <span
        className="absolute -inset-3 rounded-full blur-lg animate-orb-mini motion-reduce:animate-none"
        style={{ background: "radial-gradient(circle, rgba(157,176,138,0.35) 0%, transparent 70%)" }}
      />
      <span
        className="relative h-14 w-14 rounded-full animate-orb-mini motion-reduce:animate-none"
        style={{
          // gradiente sálvia mais presente, para destacar do fundo branco do card
          background: "radial-gradient(circle at 35% 30%, #E3E8D8 0%, #CED7C2 55%, #B9C6AA 100%)",
          boxShadow:
            "inset 0 -6px 14px rgba(110,130,95,0.25), inset 0 4px 10px rgba(255,255,255,0.55), 0 6px 18px rgba(157,176,138,0.35)",
        }}
      />
    </span>
  );
}
