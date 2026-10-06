import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import {
  BarChart3,
  Check,
  Compass,
  Gauge,
  Handshake,
  Layers,
  MessagesSquare,
  Rocket,
  ShieldCheck,
  Target,
  TrendingDown,
} from "lucide-react";
// Abas do Método: cada uma junta uma ou mais partes (as "seções" são os ids
// usados pelos links "Ver no método" dos pilares).
const ABAS = [
  { id: "estrategia", label: "Estratégia", secoes: ["shift-left", "piramide"] },
  { id: "testes", label: "Testes", secoes: ["heuristicas", "tipos"] },
  { id: "produto-aba", label: "Produto", secoes: ["produto"] },
  { id: "metricas-aba", label: "Métricas", secoes: ["metricas", "quality-gates"] },
  { id: "automacao-aba", label: "Automação", secoes: ["automacao"] },
  { id: "cultura-aba", label: "Cultura", secoes: ["cultura"] },
] as const;

type AbaId = (typeof ABAS)[number]["id"];

const EVENTO_METODO = "metodo:ir";

/**
 * Leva até uma parte do Método (ex.: "quality-gates"): abre a aba que contém
 * essa parte e rola até ela. "metodo" rola só até o início da seção.
 */
export function irParaMetodo(secao: string) {
  window.dispatchEvent(new CustomEvent(EVENTO_METODO, { detail: secao }));
}

const WHY = [
  {
    icon: TrendingDown,
    title: "Defeito barato é defeito cedo",
    text: "Um problema encontrado no refinamento custa uma conversa. O mesmo problema em produção custa retrabalho, suporte, reputação e às vezes clientes.",
  },
  {
    icon: Rocket,
    title: "Velocidade com segurança",
    text: "Qualidade não freia o time. Com testes confiáveis e critérios claros, o time entrega mais rápido porque para de apagar incêndio.",
  },
  {
    icon: Compass,
    title: "O olhar de quem usa",
    text: "O QA questiona o que ninguém perguntou: e se o usuário fizer diferente? E se a rede cair? E se o dado vier vazio? É aí que moram os bugs.",
  },
  {
    icon: BarChart3,
    title: "Decisão com dados",
    text: "Métricas de qualidade mostram onde está o risco real, e transformam a pergunta “está pronto para subir?” em algo objetivo.",
  },
];

const PHASES = [
  "Descoberta",
  "Refinamento",
  "Desenvolvimento",
  "Code review",
  "Deploy",
  "Produção",
];

const PAPEIS = ["Produto", "Design", "Desenvolvimento", "QA", "Liderança"];

const PYRAMID = [
  {
    name: "E2E",
    width: "w-[38%]",
    desc: "Poucos e valiosos. Cobrem as jornadas críticas do usuário de ponta a ponta, com Cypress ou Playwright.",
  },
  {
    name: "Integração & API",
    width: "w-[66%]",
    desc: "Validam contratos, regras de negócio e a conversa entre serviços. Rápidos e muito estáveis.",
  },
  {
    name: "Unitários",
    width: "w-full",
    desc: "A base: muitos, rápidos e baratos. Dão feedback em segundos para quem está desenvolvendo.",
  },
];

const HEURISTICS = [
  {
    name: "SFDPOT",
    text: "Estrutura, Função, Dados, Plataforma, Operações e Tempo: um roteiro para não esquecer nenhuma dimensão do produto.",
  },
  {
    name: "Valores-limite",
    text: "Os bugs gostam das bordas: o mínimo, o máximo, um a menos e um a mais.",
  },
  {
    name: "Classes de equivalência",
    text: "Agrupar entradas que se comportam igual e testar um representante de cada grupo, sem repetir esforço.",
  },
  {
    name: "CRUD",
    text: "Criar, ler, atualizar e apagar: cada dado precisa sobreviver ao ciclo de vida completo.",
  },
  {
    name: "Zero, um, muitos",
    text: "Lista vazia, um item só e milhares de itens costumam revelar comportamentos bem diferentes.",
  },
  {
    name: "Interrupções",
    text: "Voltar no navegador, perder a conexão, clicar duas vezes, sessão expirada: o mundo real não segue o caminho feliz.",
  },
];

const TEST_TYPES = [
  { name: "Funcional", text: "O sistema faz o que deveria fazer?" },
  { name: "Regressão", text: "O que já funcionava continua funcionando?" },
  { name: "Smoke", text: "O essencial está de pé depois do deploy?" },
  { name: "Exploratório", text: "Investigação guiada por heurísticas e curiosidade." },
  { name: "Integração", text: "As partes conversam bem entre si?" },
  { name: "API", text: "Contratos, status, regras e dados das APIs." },
  { name: "E2E", text: "A jornada completa, como o usuário vive." },
  { name: "Carga", text: "Como o sistema se comporta sob volume, com K6." },
  { name: "Usabilidade", text: "É claro e simples para quem usa?" },
  { name: "Mobile", text: "Telas, gestos e condições de rede do celular." },
];

const PRODUCT = [
  "Participação no refinamento junto com produto e desenvolvimento, antes de qualquer linha de código.",
  "Critérios de aceite claros e testáveis, escritos em conjunto, para que todos tenham a mesma definição de pronto.",
  "Riscos e cenários de borda levantados cedo, enquanto mudar ainda é barato.",
  "Dados de qualidade levados para as decisões de roadmap e de prioridade.",
];

const METRIC_STEPS = [
  {
    step: "Antes",
    title: "Medir o ponto de partida",
    text: "Antes de mudar qualquer processo, as métricas atuais do time são extraídas. Sem esse retrato, não dá para provar que algo melhorou.",
  },
  {
    step: "Durante",
    title: "Aplicar os quality gates",
    text: "Com o diagnóstico em mãos, os gates são definidos onde o risco é maior, acompanhando a adoção pelas squads.",
  },
  {
    step: "Depois",
    title: "Comparar e ajustar",
    text: "Antes e depois comparados com os mesmos indicadores, resultado apresentado ao time e ajustes no que não trouxe ganho.",
  },
];

const METRICS = [
  "Bugs encontrados em produção",
  "Taxa de reabertura de tarefas",
  "Churn rate das squads",
  "Tempo de ciclo até produção",
  "Cobertura de automação",
  "Estabilidade dos testes (flaky)",
];

const GATES = [
  { name: "Gate 1", title: "Código", text: "Lint, build e testes unitários" },
  { name: "Gate 2", title: "Integração", text: "Testes de API e contratos" },
  { name: "Gate 3", title: "Smoke E2E", text: "Jornadas críticas no pipeline" },
  { name: "Gate 4", title: "Release", text: "Regressão e critérios de aceite" },
];

const GATE_STEPS = [
  "Mapeamento dos riscos do produto e das métricas atuais.",
  "Definição, com o time e com produto, de critérios objetivos: o que bloqueia e o que só alerta.",
  "Automação dos gates no pipeline de CI/CD, com Argo Workflows.",
  "Publicação dos resultados em relatórios (Allure, Cypress Cloud) visíveis para todos.",
  "Revisão periódica dos gates, para que continuem úteis, e não burocráticos.",
];

const PAGE_OBJECT_CODE = `// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  email  = () => this.page.getByLabel("E-mail");
  senha  = () => this.page.getByLabel("Senha");
  entrar = () => this.page.getByRole("button", { name: "Entrar" });

  async login(email: string, senha: string) {
    await this.email().fill(email);
    await this.senha().fill(senha);
    await this.entrar().click();
  }
}

// tests/login.spec.ts
test("usuário acessa o painel", async ({ page }) => {
  const login = new LoginPage(page);

  await page.goto("/login");
  await login.login("qa@empresa.com", "********");

  await expect(page).toHaveURL(/painel/);
});`;

function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-28 max-md:pb-14 sm:px-6">
      <div>
        <div>
          <h2 className="luz-passando w-fit text-4xl leading-tight sm:text-5xl">{title}</h2>
          {intro && (
            <p className="mt-6 max-w-3xl text-base font-light leading-relaxed text-muted-foreground sm:text-lg">
              {intro}
            </p>
          )}
        </div>
      </div>
      <div className="mt-14">{children}</div>
    </section>
  );
}

const NO_CELULAR = "(max-width: 767.98px)";

/**
 * Abas no celular (até 767px; no desktop todas cabem e nada disto aparece):
 * - fade na borda que ainda tem abas escondidas (direita no início, esquerda no fim);
 * - a aba ativa é centralizada ao trocar;
 * - na primeira vez que as abas aparecem, elas deslizam 40px e voltam, como dica.
 */
function useAbasNoCelular(aba: string) {
  const ref = useRef<HTMLDivElement>(null);
  const [borda, setBorda] = useState<"cabe" | "inicio" | "meio" | "fim">("cabe");

  function aoRolar() {
    const el = ref.current;
    if (!el) return;
    const sobra = el.scrollWidth - el.clientWidth;
    if (sobra <= 1) setBorda("cabe");
    else if (el.scrollLeft <= 1) setBorda("inicio");
    else if (el.scrollLeft >= sobra - 1) setBorda("fim");
    else setBorda("meio");
  }

  useEffect(() => {
    aoRolar();
    window.addEventListener("resize", aoRolar);
    return () => window.removeEventListener("resize", aoRolar);
  }, []);

  // Centraliza a aba ativa (só no celular; scrollTo evita mexer na rolagem vertical)
  useEffect(() => {
    const el = ref.current;
    const ativa = el?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!el || !ativa || !window.matchMedia(NO_CELULAR).matches) return;
    el.scrollTo({
      left: ativa.offsetLeft - (el.clientWidth - ativa.offsetWidth) / 2,
      behavior: "smooth",
    });
  }, [aba]);

  // Dica de que dá para rolar: uma vez só
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        obs.disconnect();
        const sobra = el.scrollWidth - el.clientWidth > 1;
        const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (sobra && !reduzir && window.matchMedia(NO_CELULAR).matches)
          el.classList.add("dica-abas");
      },
      { threshold: 0.6 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const mascara = {
    cabe: "",
    inicio: "max-md:[mask-image:linear-gradient(to_right,black_calc(100%-48px),transparent)]",
    meio: "max-md:[mask-image:linear-gradient(to_right,transparent,black_48px,black_calc(100%-48px),transparent)]",
    fim: "max-md:[mask-image:linear-gradient(to_right,transparent,black_48px)]",
  }[borda];

  return { ref, aoRolar, mascara };
}

function Painel({ id, aba, children }: { id: AbaId; aba: AbaId; children: React.ReactNode }) {
  // Painéis fechados continuam no HTML (hidden), só não aparecem.
  return (
    <div role="tabpanel" id={`painel-${id}`} aria-labelledby={`aba-${id}`} hidden={aba !== id}>
      {children}
    </div>
  );
}

/** Seção "Método" da landing page: como a qualidade é construída, em 5 abas. */
export function MetodoSections() {
  const [aba, setAba] = useState<AbaId>("estrategia");
  const abas = useAbasNoCelular(aba);

  // Links "Ver no método" (e endereços com #parte): abre a aba certa e rola até a parte.
  useEffect(() => {
    function ir(secao: string) {
      const dona = ABAS.find((a) => (a.secoes as readonly string[]).includes(secao));
      if (dona) setAba(dona.id);
      if (!dona && secao !== "metodo") return;
      // Espera a aba aparecer antes de rolar.
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          document.getElementById(secao)?.scrollIntoView({ behavior: "smooth" }),
        ),
      );
    }
    const aoPedir = (e: Event) => ir((e as CustomEvent<string>).detail);
    window.addEventListener(EVENTO_METODO, aoPedir);
    if (window.location.hash) ir(window.location.hash.slice(1));
    return () => window.removeEventListener(EVENTO_METODO, aoPedir);
  }, []);

  // Setas do teclado trocam de aba, como em qualquer componente de abas.
  function mover(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const atual = ABAS.findIndex((a) => a.id === aba);
    const prox = ABAS[(atual + (e.key === "ArrowRight" ? 1 : ABAS.length - 1)) % ABAS.length];
    setAba(prox.id);
    document.getElementById(`aba-${prox.id}`)?.focus();
  }

  return (
    <>
      {/* ABERTURA DO MÉTODO */}
      <section
        id="metodo"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16 max-md:pt-14 sm:px-6"
      >
        <div>
          <h2 className="luz-passando w-fit max-w-4xl text-5xl leading-[1.02] sm:text-7xl">
            Como a <span className="text-chrome text-shine">qualidade</span> é construída
          </h2>
          <p className="mt-8 max-w-2xl text-lg font-light leading-relaxed text-muted-foreground">
            Qualidade não é uma fase no fim do projeto. É uma forma de construir software, do
            primeiro rascunho da ideia até o acompanhamento em produção. Este é o método aplicado no
            dia a dia dos times.
          </p>
        </div>
        <div
          ref={abas.ref}
          onScroll={abas.aoRolar}
          role="tablist"
          aria-label="Partes do método"
          className={`-mx-4 mt-12 flex gap-3 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0 max-md:snap-x max-md:snap-mandatory [&::-webkit-scrollbar]:hidden ${abas.mascara}`}
        >
          {ABAS.map((a) => {
            const ativa = a.id === aba;
            return (
              <button
                key={a.id}
                type="button"
                role="tab"
                id={`aba-${a.id}`}
                aria-selected={ativa}
                aria-controls={`painel-${a.id}`}
                tabIndex={ativa ? 0 : -1}
                onClick={() => setAba(a.id)}
                onKeyDown={mover}
                className={`shrink-0 whitespace-nowrap rounded-full border bg-white/[0.03] px-4 py-1.5 text-xs uppercase tracking-[0.15em] transition-colors max-md:inline-flex max-md:min-h-11 max-md:snap-center max-md:items-center ${
                  ativa
                    ? "border-teal text-teal"
                    : "border-white/10 text-muted-foreground hover:border-white/30 hover:text-foreground"
                }`}
              >
                {a.label}
              </button>
            );
          })}
        </div>
      </section>

      <Painel id="estrategia" aba={aba}>
        {/* 02 SHIFT LEFT */}
        <Section
          id="shift-left"
          title="Qualidade desde o primeiro dia"
          intro="Shift Left é trazer os testes para a esquerda da linha do tempo, ou seja, para o começo. Em vez de testar só quando tudo está pronto, a qualidade participa da descoberta, do refinamento e do desenvolvimento. Os problemas aparecem quando ainda são baratos de resolver."
        >
          <div className="card-chrome overflow-hidden rounded-2xl p-6 sm:p-10">
            <div className="grid grid-cols-6 gap-1 text-center text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">
              {PHASES.map((p) => (
                <span key={p} className="break-words">
                  {p}
                </span>
              ))}
            </div>

            <div className="mt-8 space-y-8">
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Modelo tradicional
                </p>
                <div className="relative h-2 rounded-full bg-white/5">
                  <div className="absolute inset-y-0 left-[66%] right-[17%] rounded-full bg-white/25" />
                </div>
                <p className="mt-3 text-sm font-light text-muted-foreground">
                  Testes concentrados no fim. Bugs chegam tarde, com mais retrabalho.
                </p>
              </div>
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-foreground">
                  Shift Left
                </p>
                <div className="relative h-2 rounded-full bg-white/5">
                  <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-[linear-gradient(90deg,#ffffff,#c9cdd3_45%,#6f747c)] shadow-[0_0_18px_rgba(220,225,235,0.45)]" />
                </div>
                <p className="mt-3 text-sm font-light text-muted-foreground">
                  Qualidade presente em todas as fases, mais forte no começo, onde evita mais custo.
                </p>
              </div>
            </div>

            <ul className="mt-10 grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-2">
              {[
                "QA no refinamento das histórias",
                "Critérios de aceite antes do código",
                "Quality Champions dentro das squads",
                "Testes rodando a cada pull request",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 font-light text-muted-foreground">
                  <Check className="h-4 w-4 shrink-0 text-silver" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* 03 PIRÂMIDE */}
        <Section
          id="piramide"
          title="A proporção certa de cada teste"
          intro="A pirâmide de testes organiza a estratégia de automação: muitos testes rápidos e baratos na base, e poucos testes lentos e caros no topo. Assim o feedback é rápido e a suíte continua estável."
        >
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="flex flex-col items-center gap-2">
              {PYRAMID.map((l, i) => (
                <div
                  key={l.name}
                  className={`${l.width} flex h-20 items-center justify-center text-center text-sm font-medium uppercase tracking-[0.18em] text-[#111316]`}
                  style={{
                    clipPath:
                      i === 0
                        ? "polygon(50% 0, 100% 100%, 0 100%)"
                        : "polygon(8% 0, 92% 0, 100% 100%, 0 100%)",
                    background: `linear-gradient(180deg, ${["#ffffff", "#dfe2e6", "#bfc4ca"][i]}, ${["#c9cdd3", "#aeb3ba", "#8f949c"][i]})`,
                    paddingTop: i === 0 ? "1.75rem" : undefined,
                  }}
                >
                  {l.name}
                </div>
              ))}
              <p className="mt-4 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
                + testes exploratórios em todas as camadas
              </p>
            </div>
            <div className="space-y-8">
              {PYRAMID.map((l) => (
                <div key={l.name} className="border-l border-white/15 pl-6">
                  <h3 className="titulo-card font-serif text-2xl text-chrome">{l.name}</h3>
                  <p className="mt-2 font-light leading-relaxed text-muted-foreground">{l.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </Section>
      </Painel>

      <Painel id="testes" aba={aba}>
        {/* 04 HEURÍSTICAS */}
        <Section
          id="heuristicas"
          title="Atalhos de quem sabe onde o bug se esconde"
          intro="Heurísticas são regras práticas, nascidas da experiência, que guiam o que testar e onde olhar. Não garantem que tudo será encontrado, mas tornam o teste exploratório mais rápido, mais completo e menos dependente da sorte."
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {HEURISTICS.map((h) => (
              <article
                key={h.name}
                className="card-chrome group relative overflow-hidden rounded-2xl p-7"
              >
                <div className="sheen-hover absolute inset-0" />
                <h3 className="titulo-card font-serif text-2xl text-chrome">{h.name}</h3>
                <p className="mt-3 font-light leading-relaxed text-muted-foreground">{h.text}</p>
              </article>
            ))}
          </div>
        </Section>

        {/* 05 TIPOS */}
        <Section
          id="tipos"
          title="Cada risco pede um tipo de teste"
          intro="Não existe um teste que cubra tudo. A combinação certa é escolhida conforme o risco, o momento do produto e o tempo disponível."
        >
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-5">
            {TEST_TYPES.map((t) => (
              <div
                key={t.name}
                className="bg-background p-6 transition-colors hover:bg-white/[0.03]"
              >
                <h3 className="text-sm font-medium uppercase tracking-[0.18em] text-foreground">
                  {t.name}
                </h3>
                <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">
                  {t.text}
                </p>
              </div>
            ))}
          </div>
        </Section>
      </Painel>

      <Painel id="produto-aba" aba={aba}>
        {/* 06 PRODUTO */}
        <Section
          id="produto"
          title={
            <>
              Perto de <em className="text-chrome">produto</em>, longe do retrabalho
            </>
          }
          intro="Boa parte dos bugs nasce de um mal-entendido, não de código. Por isso o trabalho é lado a lado com a pessoa de produto: quanto mais cedo todos se entendem, menos defeito chega no usuário."
        >
          <div className="grid gap-5 md:grid-cols-[1fr_1.4fr]">
            <div className="card-chrome flex flex-col gap-10 rounded-2xl p-8">
              <div className="flex gap-4 text-silver">
                <Handshake className="h-8 w-8" strokeWidth={1.25} />
                <MessagesSquare className="h-8 w-8" strokeWidth={1.25} />
              </div>
              {/* my-auto: citação centralizada no espaço abaixo dos ícones */}
              <p className="my-auto font-serif text-3xl leading-snug">
                “Qualidade é uma conversa contínua entre quem pensa, quem constrói e quem testa.”
              </p>
            </div>
            <ul className="card-chrome space-y-5 rounded-2xl p-8">
              {PRODUCT.map((p) => (
                <li key={p} className="flex gap-4 font-light leading-relaxed text-muted-foreground">
                  <Check className="mt-1 h-4 w-4 shrink-0 text-silver" /> {p}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </Painel>

      <Painel id="metricas-aba" aba={aba}>
        {/* 07 MÉTRICAS */}
        <Section
          id="metricas"
          title="Antes de mudar, medir"
          intro="Toda melhoria começa por um diagnóstico. As métricas são extraídas antes de aplicar qualquer quality gate e comparadas com o depois. Assim o ganho de qualidade fica visível para o time e para a liderança, sem achismo."
        >
          <div className="grid gap-5 md:grid-cols-3">
            {METRIC_STEPS.map((m) => (
              <article key={m.step} className="card-chrome relative rounded-2xl p-8">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{m.step}</p>
                <h3 className="titulo-card mt-5 font-serif text-2xl text-chrome">{m.title}</h3>
                <p className="mt-3 font-light leading-relaxed text-muted-foreground">{m.text}</p>
              </article>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-white/10 p-8">
            <div className="flex items-center gap-3">
              <Gauge className="h-5 w-5 text-silver" strokeWidth={1.25} />
              <h3 className="text-sm uppercase tracking-[0.25em]">O que acompanho</h3>
            </div>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {METRICS.map((m) => (
                <li
                  key={m}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-muted-foreground"
                >
                  {m}
                </li>
              ))}
            </ul>
          </div>
        </Section>

        {/* 08 QUALITY GATES */}
        <Section
          id="quality-gates"
          title="Portões que só abrem com qualidade"
          intro="Quality gates são pontos de verificação no caminho até a produção. Cada um tem critérios objetivos: se não forem atendidos, a entrega não avança. Isso tira a qualidade do campo da opinião e coloca no processo."
        >
          <div className="card-chrome overflow-hidden rounded-2xl p-6 sm:p-10">
            <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
              <div className="flex items-center justify-center rounded-xl border border-white/10 px-5 py-4 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Commit
              </div>
              {GATES.map((g) => (
                <div
                  key={g.name}
                  className="flex flex-1 flex-col gap-3 md:flex-row md:items-center"
                >
                  <span
                    aria-hidden
                    className="mx-auto h-5 w-px bg-white/20 md:mx-0 md:h-px md:w-5"
                  />
                  <div className="flex-1 rounded-xl border border-white/15 bg-white/[0.03] p-4">
                    <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                      <ShieldCheck className="h-3.5 w-3.5 text-silver" /> {g.name}
                    </p>
                    <p className="mt-2 font-medium">{g.title}</p>
                    <p className="mt-1 text-sm font-light text-muted-foreground">{g.text}</p>
                  </div>
                </div>
              ))}
              <span
                aria-hidden
                className="mx-auto h-5 w-px bg-white/20 md:mx-0 md:h-px md:w-5 md:self-center"
              />
              <div className="btn-chrome flex items-center justify-center rounded-xl px-5 py-4 text-xs font-medium uppercase tracking-[0.2em]">
                Produção
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-10 md:grid-cols-[1fr_1.4fr]">
            <h3 className="font-serif text-3xl leading-snug">
              Como os <span className="text-chrome">quality gates</span> são criados
            </h3>
            <ul className="space-y-5">
              {GATE_STEPS.map((s) => (
                <li key={s} className="flex gap-5">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-silver shadow-[0_0_10px_oklch(0.85_0.01_250/0.8)]" />
                  <p className="font-light leading-relaxed text-muted-foreground">{s}</p>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </Painel>

      <Painel id="automacao-aba" aba={aba}>
        {/* 09 AUTOMAÇÃO */}
        <Section
          id="automacao"
          title="Automação que dura"
          intro="Automatizar não é gravar cliques. É escrever código de teste com o mesmo cuidado do código de produção: legível, reutilizável e fácil de manter. Para isso, o padrão Page Objects é usado com Cypress e Playwright."
        >
          <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr]">
            <div className="space-y-6">
              {[
                {
                  icon: Layers,
                  title: "Page Objects",
                  text: "Cada tela vira uma classe com seus elementos e ações. O teste descreve o que o usuário faz, e a página sabe como fazer.",
                },
                {
                  icon: Target,
                  title: "Manutenção em um só lugar",
                  text: "Mudou um botão? O ajuste é feito em um ponto só e todos os testes que usam aquela tela continuam funcionando.",
                },
                {
                  icon: Rocket,
                  title: "Integrada ao pipeline",
                  text: "A suíte roda a cada entrega no CI/CD, com relatórios no Allure e no Cypress Cloud.",
                },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex gap-5">
                  <Icon className="mt-1 h-6 w-6 shrink-0 text-silver" strokeWidth={1.25} />
                  <div>
                    <h3 className="text-lg font-medium">{title}</h3>
                    <p className="mt-1 font-light leading-relaxed text-muted-foreground">{text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="card-chrome overflow-hidden rounded-2xl">
              <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="ml-3 text-xs text-muted-foreground">Playwright · Page Object</span>
              </div>
              <pre className="overflow-x-auto p-5 text-[12.5px] leading-relaxed text-[#d7dadf] font-['JetBrains_Mono',ui-monospace,monospace]">
                <code>{PAGE_OBJECT_CODE}</code>
              </pre>
            </div>
          </div>
        </Section>
      </Painel>

      <Painel id="cultura-aba" aba={aba}>
        <Section
          id="cultura"
          title={
            <>
              Qualidade é responsabilidade de <em className="text-chrome">todos</em>
            </>
          }
          intro={`Um QA sozinho não garante qualidade, e nem deveria. Qualidade de verdade acontece quando produto, design, desenvolvimento e liderança compartilham o mesmo critério do que é "pronto". O papel do engenheiro de qualidade é espalhar esse conhecimento pelo time, até que a qualidade deixe de depender de uma pessoa.`}
        >
          <div className="card-chrome overflow-hidden rounded-2xl p-6 sm:p-10">
            <div className="grid grid-cols-5 gap-1 text-center text-[10px] uppercase tracking-[0.12em] text-muted-foreground sm:text-xs">
              {PAPEIS.map((p) => (
                <span key={p} className="break-words">
                  {p}
                </span>
              ))}
            </div>

            <div className="mt-8 space-y-8">
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                  Modelo tradicional
                </p>
                <div className="relative h-2 rounded-full bg-white/5">
                  {/* Só a coluna QA (4ª de 5) */}
                  <div className="absolute inset-y-0 left-[60%] right-[20%] rounded-full bg-white/25" />
                </div>
                <p className="mt-3 text-sm font-light text-muted-foreground">
                  A qualidade fica com uma pessoa, e vira gargalo no fim do processo.
                </p>
              </div>
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-foreground">
                  Cultura de qualidade
                </p>
                <div className="relative h-2 rounded-full bg-white/5">
                  <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-[linear-gradient(90deg,#ffffff,#c9cdd3_45%,#6f747c)] shadow-[0_0_18px_rgba(220,225,235,0.45)]" />
                </div>
                <p className="mt-3 text-sm font-light text-muted-foreground">
                  Cada papel assume sua parte, e o QA atua como referência e multiplicador.
                </p>
              </div>
            </div>

            <ul className="mt-10 grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-2">
              {[
                "Workshops e treinamentos para o time",
                "Quality Champions em cada squad",
                'Critérios de "pronto" definidos em conjunto',
                "Boas práticas documentadas e acessíveis",
              ].map((t) => (
                <li key={t} className="flex items-center gap-3 font-light text-muted-foreground">
                  <Check className="h-4 w-4 shrink-0 text-silver" /> {t}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </Painel>
    </>
  );
}

/** "Por que ter um engenheiro de qualidade no time": seção própria, logo depois do Sobre. */
export function PorQueQaSection() {
  return (
    <Section
      id="por-que"
      title={
        <>
          Por que ter um <em className="text-chrome">engenheiro de qualidade</em> no time
        </>
      }
      intro="Um QA não está ali só para encontrar bugs. Está para evitar que eles nasçam, dar confiança para o time entregar e garantir que o software resolve o problema de quem usa."
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {WHY.map(({ icon: Icon, title, text }) => (
          <article
            key={title}
            className="card-chrome group relative overflow-hidden rounded-2xl p-8"
          >
            <div className="sheen-hover absolute inset-0" />
            <Icon className="h-7 w-7 text-silver" strokeWidth={1.25} />
            <h3 className="mt-6 text-xl font-medium">{title}</h3>
            <p className="mt-3 font-light leading-relaxed text-muted-foreground">{text}</p>
          </article>
        ))}
      </div>
    </Section>
  );
}
