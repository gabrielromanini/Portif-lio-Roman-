import { HeartHandshake, History, Repeat, Scale, Search, Waves } from "lucide-react";
import { useRevealOnScroll } from "@/components/anxiety/scroll";
import { CardLeaves } from "@/components/decorative/CardLeaves";

const ITEMS = [
  { icon: Search, text: "Identificar pensamentos e situações que ativam a ansiedade." },
  { icon: Repeat, text: "Compreender comportamentos que acabam mantendo esse ciclo." },
  { icon: Waves, text: "Desenvolver formas mais flexíveis de lidar com preocupações e incertezas." },
  { icon: HeartHandshake, text: "Aprender estratégias de regulação emocional." },
  {
    icon: Scale,
    text: "Trabalhar autocobrança, perfeccionismo e necessidade de controle, quando estiverem relacionados à ansiedade.",
  },
  {
    icon: History,
    text: "Compreender padrões construídos ao longo da história de vida que continuam influenciando o presente.",
  },
];

// Disposição das folhas do hover em cada card: vizinhos não repetem na
// grade de 3 colunas (0 1 2 / 1 2 0).
const LEAF_LAYOUTS = [0, 1, 2, 1, 2, 0];

export function TherapyHelp() {
  const cardsRef = useRevealOnScroll<HTMLUListElement>();

  return (
    <div className="mx-auto max-w-5xl">
      <h2 className="text-center text-3xl font-bold leading-tight text-foreground md:text-4xl">
        Como a terapia pode ajudar na ansiedade?
      </h2>
      {/* texto secundário um pouco mais escuro: o fundo desta seção é mais terroso (AA com folga) */}
      <div className="mx-auto mt-6 max-w-2xl space-y-4 text-center text-base leading-relaxed text-[#4A4440] md:text-lg">
        <p>Meu trabalho é baseado na Terapia Cognitivo-Comportamental (TCC) e na Terapia do Esquema.</p>
        <p>
          Ao longo do processo, podemos trabalhar tanto com aquilo que está mantendo a ansiedade hoje
          quanto compreender padrões mais antigos que podem estar relacionados à forma como você
          aprendeu a lidar consigo mesma, com os outros e com as suas emoções.
        </p>
      </div>

      <div className="relative mt-10">
        {/* Bloom bem suave atrás dos cards: luz sálvia e rosé que "respira"
            devagar. Parado com prefers-reduced-motion. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[4%] inset-y-[8%] rounded-[50%] opacity-70 blur-3xl animate-bloom motion-reduce:animate-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(160,185,140,0.45), transparent 60%), radial-gradient(ellipse at 72% 45%, rgba(214,176,160,0.4), transparent 60%)",
          }}
        />

        <ul ref={cardsRef} className="group/reveal relative grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map(({ icon: Icon, text }, i) => (
            // O <li> faz a entrada em cascata (com atraso); o card dentro faz
            // o hover (sem atraso), para um não atrapalhar o outro.
            <li
              key={i}
              className="group relative transition-[opacity,translate] duration-700 ease-out group-data-[reveal=wait]/reveal:translate-y-6 group-data-[reveal=wait]/reveal:opacity-0"
              style={{ transitionDelay: `${i * 140}ms` }}
            >
              {/* brilho que acende atrás do card no hover */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-3 rounded-[28px] opacity-0 blur-2xl transition-opacity duration-700 ease-out group-hover:opacity-100"
                style={{ background: "radial-gradient(ellipse, rgba(160,185,140,0.55), transparent 70%)" }}
              />
              <div className="relative flex h-full flex-col items-center overflow-hidden rounded-2xl border border-[#2E2F2A]/10 bg-white/75 px-6 py-7 text-center shadow-card transition-[translate,border-color,box-shadow,background-color] duration-500 ease-out group-hover:-translate-y-1 group-hover:border-secondary/50 group-hover:bg-white/90 group-hover:shadow-soft group-active:scale-[0.99] motion-reduce:group-hover:translate-y-0">
                <CardLeaves variant={LEAF_LAYOUTS[i]} />
                <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#D3DACA] text-[#2E2F2A] transition-colors duration-500 ease-out group-hover:bg-secondary/45">
                  <Icon aria-hidden="true" className="h-5 w-5" />
                </span>
                <span className="relative mt-4 text-base leading-relaxed text-foreground">{text}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
