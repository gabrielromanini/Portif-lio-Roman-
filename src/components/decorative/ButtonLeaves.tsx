/**
 * Folhinhas que surgem dentro do botão no hover. CSS puro: o botão pai
 * precisa das classes `group/cta relative overflow-hidden`, e o conteúdo do
 * botão precisa ficar por cima (`relative`).
 */

const LEAVES = [
  {
    src: "/folhas/folha1.webp",
    className:
      "left-1.5 bottom-0.5 h-7 w-7 -translate-x-8 translate-y-6 rotate-[30deg] delay-75 group-hover/cta:rotate-[10deg] group-hover/cta:opacity-80",
  },
  {
    src: "/folhas/folha3.webp",
    className:
      "right-2 top-0.5 h-6 w-6 translate-x-8 -translate-y-6 rotate-[-20deg] delay-200 group-hover/cta:rotate-[-45deg] group-hover/cta:opacity-70",
  },
];

const BASE =
  "pointer-events-none absolute select-none opacity-0 transition-[opacity,translate,rotate] duration-500 ease-out group-hover/cta:translate-x-0 group-hover/cta:translate-y-0 motion-reduce:translate-x-0 motion-reduce:translate-y-0 motion-reduce:transition-opacity";

export function ButtonLeaves() {
  return (
    <span aria-hidden="true">
      {LEAVES.map((leaf, i) => (
        <img
          key={i}
          src={leaf.src}
          alt=""
          loading="lazy"
          draggable={false}
          className={`${BASE} ${leaf.className}`}
        />
      ))}
    </span>
  );
}
