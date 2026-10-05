import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ButtonLeaves } from "@/components/decorative/ButtonLeaves";
import { CardLeaves } from "@/components/decorative/CardLeaves";

const SIGNS = [
  "Sua mente está sempre pensando no que pode dar errado.",
  "É difícil relaxar, mesmo quando não há nada urgente para resolver.",
  "Você pensa demais antes ou depois de tomar decisões.",
  "Pequenas situações geram uma preocupação muito maior do que você gostaria.",
  "Você se cobra para dar conta de tudo e sente que nunca faz o suficiente.",
  "Você tem dificuldade de lidar com erros, imprevistos ou situações que não consegue controlar.",
  "Você sente tensão, cansaço, irritabilidade ou outros sinais físicos da ansiedade.",
  "O coração acelera sozinho, você sente um calafrio no peito, muitas vezes acompanhado de enjoos.",
  "Mesmo quando as coisas estão bem, parece difícil simplesmente aproveitar o momento.",
];

/**
 * Principais características da ansiedade: um botão abre (animação suave)
 * uma lista de blocos simples. No hover, cada bloco sobe e ganha folhinhas,
 * como os cards da home. Nada é marcado, salvo ou enviado.
 */
export function AnxietySigns() {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex justify-center">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="group/cta relative inline-flex min-h-[56px] cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-full bg-olive px-8 py-4 text-center text-base font-medium text-white shadow-soft transition-all duration-500 ease-out hover:-translate-y-0.5 hover:bg-[#4E5C39] hover:shadow-[0_10px_28px_-10px_rgba(78,92,57,0.55)] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:hover:translate-y-0 sm:px-10"
        >
          <ButtonLeaves />
          <span className="relative">Entender as principais características da ansiedade</span>
          <ChevronDown
            aria-hidden="true"
            className={`relative h-5 w-5 shrink-0 transition-transform duration-500 ease-out ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Abre/fecha suave (altura via grid 0fr → 1fr). Fechado = inert. */}
      <div
        id={panelId}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-700 ease-out motion-reduce:transition-none ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        {/* padding interno para o hover (sobe 4px + sombra) não ser cortado */}
        <div className="-mx-2 overflow-hidden px-2">
          <ul className="space-y-3 pb-2 pt-8">
            {SIGNS.map((sign, i) => (
              <li
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-[#2E2F2A]/10 bg-white/70 px-5 py-4 text-left text-base leading-relaxed text-foreground shadow-card transition-[translate,border-color,box-shadow,background-color] duration-500 ease-out hover:-translate-y-1 hover:border-secondary/50 hover:bg-white/90 hover:shadow-soft motion-reduce:hover:translate-y-0"
              >
                <CardLeaves compact variant={i % 3} />
                <span className="relative">{sign}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
