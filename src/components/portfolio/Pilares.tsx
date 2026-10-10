import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { gsap } from "@/lib/rolagem";
import { irParaMetodo } from "./Metodo";

const MONO = "font-['JetBrains_Mono',ui-monospace,monospace]";

type Pilar = {
  /** Nome curto, na barra de navegação. */
  curto: string;
  /** Título com a palavra-chave em <em> (prata, itálico). */
  titulo: ReactNode;
  descricao: string;
  /** O que o pilar traz para o produto e o time. */
  beneficios?: string[];
  /** Só os pilares que têm ferramentas cadastradas; nos outros o grupo não aparece. */
  ferramentas?: string[];
  /** Parte do Método aberta pelo botão "Conhecer mais" (só quando há). */
  conhecerMais?: string;
};

// Da esquerda (01) para a direita (07).
const PILARES: Pilar[] = [
  {
    curto: "Engenharia",
    titulo: (
      <>
        Engenharia orientada à <em>qualidade</em>
      </>
    ),
    descricao:
      "Qualidade não é uma etapa no fim do processo: é um critério de engenharia presente em cada decisão, do desenho da solução ao acompanhamento em produção.",
    beneficios: [
      "Código limpo e fácil de manter",
      "Menos bugs chegando ao usuário",
      "Software seguro e acessível desde o início",
      "Evolução sem quebrar o que já funciona",
      "Menos retrabalho e dívida técnica",
    ],
  },
  {
    curto: "Shift Left",
    titulo: (
      <>
        <em>Shift Left</em> Testing
      </>
    ),
    descricao:
      "Antecipação da qualidade para as primeiras etapas do desenvolvimento, reduzindo riscos e custos de correção.",
    beneficios: [
      "QA no refinamento",
      "Critérios de aceite claros",
      "Prevenção de falhas",
      "Feedback rápido",
    ],
  },
  {
    curto: "Testes funcionais",
    titulo: (
      <>
        Testes <em>funcionais</em>
      </>
    ),
    descricao:
      "Cada risco pede um tipo de teste. A combinação certa garante que o produto faz o que deveria, do jeito que o usuário espera.",
    conhecerMais: "tipos",
  },
  {
    curto: "Automação",
    titulo: (
      <>
        <em>Automação</em> de testes
      </>
    ),
    descricao:
      "Automação tratada como código de produção: legível, reutilizável e integrada ao pipeline, cobrindo interface, API e performance.",
    beneficios: [
      "Regressão em minutos, não em dias",
      "Feedback a cada pull request",
      "Entregas mais frequentes e seguras",
      "Mais tempo para testes exploratórios",
    ],
    ferramentas: ["Cypress", "Playwright", "Postman", "k6", "JMeter"],
  },
  {
    curto: "Quality Gates",
    titulo: (
      <>
        <em>Quality Gates</em>
      </>
    ),
    descricao:
      "Critérios automatizados de qualidade integrados ao CI/CD para impedir que alterações com falhas conhecidas avancem no fluxo de entrega, desde o upstream até o downstream.",
    beneficios: [
      "Erros barrados antes da produção",
      "Métricas de antes e depois dos gates",
      "Deploy com confiança",
      "Qualidade visível para todo o time",
    ],
  },
  {
    curto: "IA aplicada",
    titulo: (
      <>
        <em>IA</em> aplicada à qualidade
      </>
    ),
    descricao:
      "Utilização de IA, LLMs e agentes para apoiar a análise de requisitos, a geração de cenários, a criação de testes e a identificação estratégica de riscos.",
    beneficios: [
      "Geração de planos de teste",
      "Análise de requisitos",
      "Cenários e massa de dados",
      "Mapeamento de riscos",
      "Velocidade na automação de testes",
    ],
  },
  {
    curto: "Colaboração",
    titulo: (
      <>
        Qualidade <em>colaborativa</em>
      </>
    ),
    descricao:
      "Comunicação é a soft skill mais importante de um engenheiro de software: tanto para entender o produto e o cliente quanto para antecipar possíveis problemas e economizar tempo.",
    beneficios: [
      "Comunicação constante com o time",
      "Otimização do tempo de desenvolvimento e testes",
    ],
  },
];

const N = PILARES.length;
const dois = (i: number) => String(i + 1).padStart(2, "0");
// Tempo de cada pilar enquanto o carrossel passa sozinho (a linha da barra enche nele)
const TEMPO_PILAR = 7000;

/**
 * Caixa CSS 3D de 5 faces (frente, trás, laterais e topo), no material de vidro da
 * pirâmide. Medidas em CSS (aceitam var() e calc()); a base fica na origem do pai.
 */
function Caixa({
  w,
  h,
  d,
  className = "",
}: {
  w: string;
  h: string;
  d: string;
  className?: string;
}) {
  return (
    <div className={`cx ${className}`} style={{ "--bw": w, "--bh": h, "--bd": d } as CSSProperties}>
      <i className="cx-f" />
      <i className="cx-t" />
      <i className="cx-e" />
      <i className="cx-d" />
      <i className="cx-s" />
    </div>
  );
}

/**
 * Fundo: pontos e pequenos "x" brancos e verde-petróleo em 3 planos. Os de trás são
 * menores e mais lentos; todos derivam devagar e reagem à rolagem e ao giro da
 * câmera. Um canvas só da seção, desenhado só com ela na tela; devicePixelRatio ≤ 2.
 */
function ligarParticulas(canvas: HTMLCanvasElement, secao: HTMLElement, parado: boolean) {
  const ctx = canvas.getContext("2d");
  const PLANOS = [
    { n: 34, r: 2.2, a: 0.2, v: 1.5, rolagem: 0.03 },
    { n: 22, r: 3.4, a: 0.32, v: 3.5, rolagem: 0.07 },
    { n: 10, r: 5, a: 0.48, v: 6, rolagem: 0.13 },
  ];
  let largura = 0;
  let altura = 0;
  let pontos: { x: number; y: number; plano: number; cruz: boolean; teal: boolean }[] = [];
  let visivel = false;
  function desenhar() {
    if (!ctx || !largura) return;
    const t = parado ? 0 : performance.now() / 1000;
    const rolagem = parado ? 0 : window.scrollY;
    const giro = parado ? 0 : Number(getComputedStyle(secao).getPropertyValue("--ativo")) || 0;
    ctx.clearRect(0, 0, largura, altura);
    ctx.lineWidth = 1;
    for (const pt of pontos) {
      const pl = PLANOS[pt.plano];
      let x = (pt.x + t * pl.v - giro * pl.v * 6) % largura;
      let y = (pt.y - t * pl.v * 0.4 - rolagem * pl.rolagem) % altura;
      if (x < 0) x += largura;
      if (y < 0) y += altura;
      const cor = pt.teal ? "#00a19c" : "#e8f0f0";
      ctx.globalAlpha = pl.a;
      if (pt.cruz) {
        const m = pl.r / 2;
        ctx.strokeStyle = cor;
        ctx.beginPath();
        ctx.moveTo(x - m, y - m);
        ctx.lineTo(x + m, y + m);
        ctx.moveTo(x + m, y - m);
        ctx.lineTo(x - m, y + m);
        ctx.stroke();
      } else {
        ctx.fillStyle = cor;
        ctx.beginPath();
        ctx.arc(x, y, pl.r / 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
  function medir() {
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    largura = canvas.clientWidth;
    altura = canvas.clientHeight;
    canvas.width = Math.round(largura * dpr);
    canvas.height = Math.round(altura * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pontos = PLANOS.flatMap((pl, plano) =>
      Array.from({ length: pl.n }, () => ({
        x: Math.random() * largura,
        y: Math.random() * altura,
        plano,
        cruz: Math.random() < 0.45,
        teal: Math.random() < 0.4,
      })),
    );
    desenhar();
  }
  const quadro = () => {
    if (visivel) desenhar();
  };
  const obsTamanho = new ResizeObserver(medir);
  obsTamanho.observe(canvas);
  const obsVisivel = new IntersectionObserver(([e]) => (visivel = e.isIntersecting));
  obsVisivel.observe(canvas);
  if (!parado) gsap.ticker.add(quadro);
  return () => {
    gsap.ticker.remove(quadro);
    obsTamanho.disconnect();
    obsVisivel.disconnect();
  };
}

/**
 * Pilares em carrossel, com as colunas de vidro ao fundo.
 * - O texto do pilar fica à esquerda, por cima da cena, num véu escuro bem
 *   esfumado. Embaixo, centralizada, uma barra única de navegação: ‹ itens › (no
 *   celular, ‹ 03 / 07 ›), com a linha que enche até o próximo pilar.
 * - Passa sozinho; hover num item mostra aquele pilar (pausa) e clique fixa nele.
 * - A coluna do pilar acende lá atrás, com o número dela por cima; a câmera gira de
 *   leve na direção dela e "respira" devagar enquanto a seção está na tela.
 * - Celular: os 7 pilares em cards (cascata); as colunas ficam presas ao fundo,
 *   apagadas, e o card no meio da tela acende a coluna dele.
 * - Movimento reduzido: sem passar sozinho nem animar. Sem JS: os 7 em lista.
 */
export function PilaresSection() {
  const ref = useRef<HTMLElement>(null);
  const [ativo, setAtivo] = useState(0);
  const [pausado, setPausado] = useState(false);
  // Clique (ou setas): fixa no pilar escolhido, sem passar sozinho
  const [fixo, setFixo] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const ativoRef = useRef(0);

  const ir = useCallback((i: number) => {
    ativoRef.current = i;
    setAtivo(i);
  }, []);

  // Passa sozinho com a seção na tela, a aba visível e sem movimento reduzido.
  // Também liga as partículas e marca a seção como visível (a câmera respira).
  useEffect(() => {
    const secao = ref.current;
    if (!secao) return;
    const pode = window.matchMedia("(prefers-reduced-motion: no-preference)");
    const desktop = window.matchMedia("(min-width: 768px)");
    let naTela = false;
    const atualizar = () => {
      setAutoplay(pode.matches && desktop.matches && naTela && !document.hidden);
      secao.toggleAttribute("data-visivel", naTela);
    };
    const obs = new IntersectionObserver(([e]) => {
      naTela = e.isIntersecting;
      atualizar();
    });
    obs.observe(secao);
    pode.addEventListener("change", atualizar);
    desktop.addEventListener("change", atualizar);
    document.addEventListener("visibilitychange", atualizar);
    const parar = ligarParticulas(
      secao.querySelector("canvas") as HTMLCanvasElement,
      secao,
      !pode.matches,
    );
    return () => {
      obs.disconnect();
      pode.removeEventListener("change", atualizar);
      desktop.removeEventListener("change", atualizar);
      document.removeEventListener("visibilitychange", atualizar);
      parar();
    };
  }, []);

  useEffect(() => {
    if (!autoplay || pausado || fixo) return;
    const t = window.setTimeout(() => ir((ativoRef.current + 1) % N), TEMPO_PILAR);
    return () => clearTimeout(t);
  }, [autoplay, pausado, fixo, ativo, ir]);

  // Celular (cards em cascata): o card que passa pelo meio da tela vira o ativo
  useEffect(() => {
    const secao = ref.current;
    if (!secao) return;
    const celular = window.matchMedia("(max-width: 767.98px)");
    const cards = Array.from(secao.querySelectorAll<HTMLElement>(".pc-painel"));
    let obs: IntersectionObserver | null = null;
    const ligar = () => {
      obs?.disconnect();
      obs = null;
      if (!celular.matches) return;
      obs = new IntersectionObserver(
        (entradas) => {
          for (const e of entradas)
            if (e.isIntersecting) ir(cards.indexOf(e.target as HTMLElement));
        },
        { rootMargin: "-45% 0px -45% 0px" },
      );
      cards.forEach((c) => obs!.observe(c));
    };
    ligar();
    celular.addEventListener("change", ligar);
    return () => {
      obs?.disconnect();
      celular.removeEventListener("change", ligar);
    };
  }, [ir]);

  // Número sobre a coluna ativa: segue a âncora acima do capitel dela
  useEffect(() => {
    const secao = ref.current;
    if (!secao) return;
    const palco = secao.querySelector<HTMLElement>(".pc-palco")!;
    const marca = secao.querySelector<HTMLElement>(".pc-marca")!;
    const ancoras = Array.from(secao.querySelectorAll<HTMLElement>("[data-ancora]"));
    let visivel = false;
    const posicionar = () => {
      if (!visivel || getComputedStyle(marca).display === "none") return;
      const caixa = palco.getBoundingClientRect();
      const r = ancoras[ativoRef.current].getBoundingClientRect();
      marca.style.transform = `translate3d(${(r.left - caixa.left - marca.offsetWidth / 2).toFixed(1)}px, ${(r.top - caixa.top - marca.offsetHeight).toFixed(1)}px, 0)`;
    };
    const obs = new IntersectionObserver(([e]) => (visivel = e.isIntersecting));
    obs.observe(secao);
    gsap.ticker.add(posicionar);
    return () => {
      gsap.ticker.remove(posicionar);
      obs.disconnect();
    };
  }, []);

  // Barra: hover mostra (pausa), sair retoma; clique e setas fixam
  const entrar = (i: number) => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    setPausado(true);
    ir(i);
  };
  const sairDaBarra = () => {
    setPausado(false);
  };
  const fixar = (i: number) => {
    setFixo(true);
    ir(i);
  };
  const anterior = () => fixar((ativoRef.current - 1 + N) % N);
  const proximo = () => fixar((ativoRef.current + 1) % N);
  const teclar = (e: KeyboardEvent<HTMLElement>) => {
    const delta = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
    if (delta === undefined) return;
    e.preventDefault();
    const i = (ativoRef.current + delta + N) % N;
    fixar(i);
    ref.current?.querySelector<HTMLElement>(`[data-item="${i}"]`)?.focus();
  };

  const W = "var(--W)";
  const H = "var(--H)";
  const correndo = autoplay && !pausado && !fixo;

  return (
    <section
      ref={ref}
      id="pilares"
      className="pc scroll-mt-20"
      style={{ "--ativo": ativo } as CSSProperties}
    >
      <div className="pc-palco">
        {/* Fundo: cena, névoa e partículas. No celular fica preso atrás dos cards */}
        <div className="pc-fundo">
          <div className="pc-fundo-preso">
            <canvas aria-hidden className="pc-particulas" />
            <div aria-hidden className="pc-chao" />

            {/* Cena 3D: as colunas acompanham o carrossel */}
            <div aria-hidden className="pc-cena">
              <div className="pc-camera">
                <div className="pc-respira">
                  <div className="pc-piso" />
                  {[
                    { z: 7, h: 1.2, classe: "pc-fantasmas-1" },
                    { z: 15, h: 1.5, classe: "pc-fantasmas-2" },
                  ].map((f) => (
                    <div
                      key={f.z}
                      className={`pc-fantasmas ${f.classe}`}
                      style={{ "--z": f.z } as CSSProperties}
                    >
                      {Array.from({ length: 11 }, (_, j) => (
                        <div
                          key={j}
                          className="pc-fantasma"
                          style={{ "--j": j - 5 } as CSSProperties}
                        >
                          <Caixa w={W} h={`calc(${H} * ${f.h})`} d={W} />
                        </div>
                      ))}
                    </div>
                  ))}
                  {PILARES.map((p, i) => (
                    <div
                      key={p.curto}
                      className="pc-coluna"
                      style={{ "--i": i } as CSSProperties}
                      data-ativo={ativo === i ? "" : undefined}
                    >
                      <Caixa w={`calc(${W} * 1.6)`} h={`calc(${W} * 0.3)`} d={`calc(${W} * 1.6)`} />
                      <div className="pc-ergue">
                        <Caixa w={W} h={H} d={W} />
                        <div className="pc-topo">
                          <Caixa
                            w={`calc(${W} * 1.45)`}
                            h={`calc(${W} * 0.3)`}
                            d={`calc(${W} * 1.45)`}
                          />
                          <span data-ancora className="pc-ancora" />
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pc-viga">
                    <Caixa
                      w={`calc(var(--E) * 6 + ${W} * 2.2)`}
                      h={`calc(${W} * 0.55)`}
                      d={`calc(${W} * 1.6)`}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div aria-hidden className="pc-nevoa" />
            {/* Número sobre a coluna ativa (liga o texto à coluna) */}
            <span aria-hidden className={`pc-marca ${MONO}`}>
              {dois(ativo)}
            </span>
          </div>
        </div>

        {/* Texto do pilar */}
        <div
          role="region"
          aria-roledescription="carrossel"
          aria-label="Pilares da qualidade de software"
          className="pc-texto"
        >
          <p
            className={`${MONO} flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground`}
          >
            <span aria-hidden className="h-px w-8 bg-teal" />
            Pilares
          </p>
          <h2 className="pc-h2 mt-3 font-serif leading-[1.1]">
            Os pilares da <em className="text-chrome">qualidade de software</em>
          </h2>

          <div className="pc-paineis">
            {PILARES.map((p, i) => (
              <article
                key={p.curto}
                id={`pc-painel-${i}`}
                role="tabpanel"
                aria-roledescription="slide"
                aria-labelledby={`pc-item-${i}`}
                data-ativo={ativo === i ? "" : undefined}
                className="pc-painel"
              >
                <p
                  className={`pc-etapa pc-num ${MONO} text-[11px] uppercase tracking-[0.2em] text-muted-foreground`}
                >
                  Pilar {dois(i)} / 07
                </p>
                <h3 className="pc-etapa pc-titulo mt-3 font-serif">{p.titulo}</h3>
                <p className="pc-etapa pc-descricao mt-5 font-light text-muted-foreground">
                  {p.descricao}
                </p>
                {(p.beneficios || p.ferramentas) && (
                  <div className="pc-etapa pc-grupos mt-7">
                    {p.beneficios && (
                      <div>
                        <p className={`${MONO} pc-rotulo`}>Benefícios</p>
                        <ul className="pc-pills">
                          {p.beneficios.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {p.ferramentas && (
                      <div>
                        <p className={`${MONO} pc-rotulo`}>Ferramentas</p>
                        <ul className="pc-pills">
                          {p.ferramentas.map((t) => (
                            <li key={t}>{t}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                {p.conhecerMais && (
                  <div className="pc-etapa mt-8">
                    <button
                      type="button"
                      onClick={() => irParaMetodo(p.conhecerMais!)}
                      className="btn-steel-dark inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium"
                    >
                      Conhecer mais <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        {/* Navegação única, no rodapé do palco */}
        <nav aria-label="Navegação dos pilares" className="pc-nav">
          <button type="button" onClick={anterior} aria-label="Pilar anterior" className="pc-seta">
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <div role="tablist" aria-label="Pilares" className="pc-itens" onMouseLeave={sairDaBarra}>
            {PILARES.map((p, i) => (
              <button
                key={p.curto}
                type="button"
                role="tab"
                data-item={i}
                id={`pc-item-${i}`}
                aria-selected={ativo === i}
                aria-controls={`pc-painel-${i}`}
                tabIndex={ativo === i ? 0 : -1}
                onMouseEnter={() => entrar(i)}
                onClick={() => fixar(i)}
                onKeyDown={teclar}
                className="pc-item"
              >
                <span className={`${MONO} pc-item-num`}>{dois(i)}</span>
                <span className="pc-item-nome">{p.curto}</span>
                {/* Linha que enche até o próximo pilar */}
                <span aria-hidden className="pc-item-linha">
                  <i
                    key={`${ativo}-${correndo}`}
                    data-correndo={ativo === i && correndo ? "" : undefined}
                  />
                </span>
              </button>
            ))}
          </div>
          {/* Celular: só o contador e a linha */}
          <span aria-hidden className={`pc-contador ${MONO}`}>
            {dois(ativo)} / 07
            <span className="pc-item-linha">
              <i key={`c-${ativo}-${correndo}`} data-correndo={correndo ? "" : undefined} />
            </span>
          </span>
          <button type="button" onClick={proximo} aria-label="Próximo pilar" className="pc-seta">
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </nav>
      </div>
    </section>
  );
}
