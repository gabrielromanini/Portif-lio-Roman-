/**
 * Folhas que surgem dentro de um card no hover. CSS puro: o card pai precisa
 * das classes `group relative overflow-hidden`.
 *
 * Cada folha começa fora do lugar (deslocada, girada, invisível) e, no hover
 * do card, desliza devagar até a posição final com opacidade baixa. Os atrasos
 * escalonados fazem elas chegarem uma depois da outra, como se o vento as
 * tivesse trazido. Há três disposições (0, 1, 2) para alternar entre cards,
 * e uma versão `compact` para cards baixos.
 */

interface LeafSpec {
  src: string;
  className: string; // posição, tamanho e estado inicial/final
}

const LAYOUTS: LeafSpec[][] = [
  [
    {
      src: "/folhas/folha1.webp",
      className:
        "-right-2 -bottom-2 h-12 w-12 translate-x-4 translate-y-4 rotate-[-35deg] delay-75 group-hover:rotate-[-10deg] group-hover:opacity-35",
    },
    {
      src: "/folhas/folha3.webp",
      className:
        "right-9 bottom-1 h-7 w-7 translate-x-6 translate-y-2 rotate-[20deg] delay-200 group-hover:rotate-[45deg] group-hover:opacity-25",
    },
    {
      src: "/folhas/folha2.webp",
      className:
        "right-3 top-3 h-6 w-6 translate-x-5 -translate-y-2 rotate-[60deg] delay-300 group-hover:rotate-[80deg] group-hover:opacity-20",
    },
    // lado esquerdo (evita o ícone, que fica no topo)
    {
      src: "/folhas/folha4.webp",
      className:
        "-left-3 -bottom-2 h-10 w-10 -translate-x-4 translate-y-4 rotate-[40deg] delay-150 group-hover:rotate-[15deg] group-hover:opacity-30",
    },
    {
      src: "/folhas/folha2.webp",
      className:
        "-left-1 top-1/2 h-6 w-6 -translate-x-5 translate-y-1 rotate-[-15deg] delay-[250ms] group-hover:rotate-[-40deg] group-hover:opacity-20",
    },
  ],
  [
    {
      src: "/folhas/folha4.webp",
      className:
        "-right-1 -bottom-3 h-11 w-11 translate-x-4 translate-y-4 rotate-[25deg] delay-75 group-hover:rotate-[5deg] group-hover:opacity-35",
    },
    {
      src: "/folhas/folha2.webp",
      className:
        "right-10 -bottom-1 h-6 w-6 translate-x-6 translate-y-3 rotate-[-30deg] delay-200 group-hover:rotate-[-55deg] group-hover:opacity-25",
    },
    {
      src: "/folhas/folha1.webp",
      className:
        "right-5 top-4 h-7 w-7 translate-x-5 -translate-y-2 rotate-[-70deg] delay-300 group-hover:rotate-[-45deg] group-hover:opacity-20",
    },
    // lado esquerdo (evita o ícone, que fica no topo)
    {
      src: "/folhas/folha3.webp",
      className:
        "-left-2 -bottom-3 h-11 w-11 -translate-x-4 translate-y-4 rotate-[-30deg] delay-150 group-hover:rotate-[-5deg] group-hover:opacity-30",
    },
    {
      src: "/folhas/folha1.webp",
      className:
        "left-8 -bottom-1 h-6 w-6 -translate-x-6 translate-y-3 rotate-[35deg] delay-[250ms] group-hover:rotate-[60deg] group-hover:opacity-20",
    },
  ],
  [
    {
      src: "/folhas/folha2.webp",
      className:
        "-right-3 top-1/3 h-11 w-11 translate-x-5 translate-y-2 rotate-[50deg] delay-75 group-hover:rotate-[20deg] group-hover:opacity-30",
    },
    {
      src: "/folhas/folha4.webp",
      className:
        "right-6 -bottom-2 h-8 w-8 translate-x-4 translate-y-4 rotate-[-10deg] delay-200 group-hover:rotate-[-35deg] group-hover:opacity-25",
    },
    {
      src: "/folhas/folha3.webp",
      className:
        "left-1/2 -bottom-2 h-6 w-6 translate-x-3 translate-y-4 rotate-[70deg] delay-300 group-hover:rotate-[95deg] group-hover:opacity-20",
    },
    // lado esquerdo (evita o ícone, que fica no topo)
    {
      src: "/folhas/folha1.webp",
      className:
        "-left-3 bottom-4 h-9 w-9 -translate-x-5 translate-y-2 rotate-[-45deg] delay-150 group-hover:rotate-[-20deg] group-hover:opacity-30",
    },
    {
      src: "/folhas/folha3.webp",
      className:
        "left-5 -bottom-3 h-7 w-7 -translate-x-4 translate-y-4 rotate-[15deg] delay-[250ms] group-hover:rotate-[-10deg] group-hover:opacity-20",
    },
  ],
];

// Versão para cards baixos (tipo "pílula", ex.: Especialidades): menos folhas
// e menores, para não cobrir o texto. Também três disposições.
const COMPACT_LAYOUTS: LeafSpec[][] = [
  [
    {
      src: "/folhas/folha1.webp",
      className:
        "-right-1 -bottom-2 h-8 w-8 translate-x-4 translate-y-3 rotate-[-35deg] delay-75 group-hover:rotate-[-10deg] group-hover:opacity-35",
    },
    {
      src: "/folhas/folha3.webp",
      className:
        "right-7 -top-1 h-5 w-5 translate-x-4 -translate-y-3 rotate-[20deg] delay-200 group-hover:rotate-[45deg] group-hover:opacity-20",
    },
    {
      src: "/folhas/folha4.webp",
      className:
        "-left-1 -bottom-2 h-6 w-6 -translate-x-4 translate-y-3 rotate-[40deg] delay-150 group-hover:rotate-[15deg] group-hover:opacity-25",
    },
  ],
  [
    {
      src: "/folhas/folha2.webp",
      className:
        "-right-2 top-1/4 h-7 w-7 translate-x-5 translate-y-1 rotate-[50deg] delay-75 group-hover:rotate-[20deg] group-hover:opacity-35",
    },
    {
      src: "/folhas/folha4.webp",
      className:
        "right-9 -bottom-2 h-5 w-5 translate-x-4 translate-y-3 rotate-[-10deg] delay-200 group-hover:rotate-[-35deg] group-hover:opacity-20",
    },
    {
      src: "/folhas/folha1.webp",
      className:
        "left-3 -bottom-2 h-5 w-5 -translate-x-4 translate-y-3 rotate-[-45deg] delay-150 group-hover:rotate-[-20deg] group-hover:opacity-25",
    },
  ],
  [
    {
      src: "/folhas/folha3.webp",
      className:
        "-right-1 -top-2 h-7 w-7 translate-x-4 -translate-y-3 rotate-[60deg] delay-75 group-hover:rotate-[80deg] group-hover:opacity-30",
    },
    {
      src: "/folhas/folha2.webp",
      className:
        "right-4 -bottom-2 h-6 w-6 translate-x-4 translate-y-3 rotate-[-30deg] delay-200 group-hover:rotate-[-55deg] group-hover:opacity-25",
    },
    {
      src: "/folhas/folha4.webp",
      className:
        "-left-2 -top-1 h-5 w-5 -translate-x-4 -translate-y-3 rotate-[15deg] delay-150 group-hover:rotate-[-10deg] group-hover:opacity-20",
    },
  ],
];

const BASE =
  "pointer-events-none absolute select-none opacity-0 transition-[opacity,translate,rotate] duration-700 ease-out group-hover:translate-x-0 group-hover:translate-y-0 motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:transition-opacity";

export function CardLeaves({
  variant = 0,
  compact = false,
}: {
  variant?: number;
  compact?: boolean;
}) {
  const layouts = compact ? COMPACT_LAYOUTS : LAYOUTS;
  const leaves = layouts[variant % layouts.length];
  return (
    <div aria-hidden="true">
      {leaves.map((leaf, i) => (
        <img
          key={i}
          src={leaf.src}
          alt=""
          loading="lazy"
          draggable={false}
          className={`${BASE} ${leaf.className}`}
        />
      ))}
    </div>
  );
}
