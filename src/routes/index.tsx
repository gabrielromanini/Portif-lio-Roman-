import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/gabriel-hero.jpeg";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Bot,
  GitBranch,
  Linkedin,
  MapPin,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { LINKEDIN_URL, SITE_NAME } from "@/lib/site";
import { Eyebrow, FONTS_LINKS, PageShell } from "@/components/portfolio/Layout";
import { MetodoSections, PorQueQaSection } from "@/components/portfolio/Metodo";
import { PilaresSection } from "@/components/portfolio/Pilares";
import {
  SilverArrowHero,
  TracadosHero,
  DiagonaisEspelhadas,
  LinhaPista,
} from "@/components/portfolio/Fundos";

// Teste do fundo do topo: "silver-arrow" (novo) ou "tracados" (versão anterior).
// Para voltar, basta trocar para "tracados".
const FUNDO_HERO: "silver-arrow" | "tracados" = "silver-arrow";

const EXPERTISE = [
  {
    icon: ShieldCheck,
    title: "Quality Engineering",
    text: "Software entregue com altíssima qualidade: estratégia de testes, cultura de qualidade e testes bem implementados, do planejamento à produção.",
  },
  {
    icon: Bot,
    title: "IA aplicada a testes",
    text: "Evolução de frameworks internos com GenAI, LLM e MCP para gerar cenários, planos de teste e validações automatizadas com agentes inteligentes.",
  },
  {
    icon: Workflow,
    title: "Automação de testes",
    text: "Testes que rodam sozinhos, sem interação humana, sempre que o software muda. O ganho: erros encontrados em minutos, entregas mais rápidas e a segurança de que o que já funcionava continua funcionando.",
  },
  {
    icon: GitBranch,
    title: "CI/CD & Observabilidade",
    text: "Testes integrados ao pipeline de entrega: cada alteração é verificada automaticamente antes de ir para o ar, com relatórios que mostram a saúde do software e a evolução da qualidade ao longo do tempo.",
  },
];

const EXPERIENCE = [
  {
    company: "Projetos Independentes",
    roles: [{ title: "Desenvolvedor Front-end · Freelancer" }],
    points: [
      "Criação de websites e landing pages para clientes de diferentes segmentos, do levantamento de necessidades à publicação.",
      "Interfaces responsivas, pensadas primeiro para o celular.",
      "Performance, acessibilidade e boas práticas de SEO tratadas como requisito desde a estrutura.",
      "Código organizado e fácil de manter, validado com o olhar de engenharia de qualidade antes de cada entrega.",
    ],
  },
  {
    company: "Frota162",
    roles: [{ title: "Consultor de Qualidade de Software" }],
    points: [
      "Estruturação da área de QA com processos, governança e cultura de qualidade para 5 squads simultâneas.",
      "Referência de qualidade para cerca de 23 desenvolvedores, promovendo Shift Left Testing e Quality Champions.",
      "Evolução de framework interno baseado em GenAI/LLM/MCP para geração de cenários, planos de teste e validações.",
      "Automações E2E com Cypress e Playwright integradas ao CI/CD via Argo Workflows.",
      "Allure Reports e Cypress Cloud para rastreabilidade e acompanhamento de churn rate das squads.",
    ],
  },
  {
    company: "Autoforce",
    roles: [{ title: "QA Lead" }, { title: "QA Sênior" }],
    points: [
      "Gestão e desenvolvimento do time de Qualidade de Software, com 5 QAs.",
      "Definição da estratégia, aplicação de Shift Left Testing e roadmap da área de QA.",
      "Testes E2E com Cypress, testes de API com Postman e Cypress, e testes de carga com K6.",
      "Análise de impacto, documentação técnica, relatórios de qualidade e apoio ao roadmap de produto.",
    ],
  },
  {
    company: "SóCarrão",
    roles: [{ title: "QA Analyst" }],
    points: [
      "Planejamento e levantamento de requisitos de testes.",
      "Automação com Cypress e testes de API com Postman.",
      "Testes de regressão, smoke, usabilidade e carga.",
    ],
  },
  {
    company: "Roit Bank",
    roles: [{ title: "QA Analyst" }],
    points: [
      "Testes funcionais, mobile e de API com Postman.",
      "Testes automatizados com Cypress.",
    ],
  },
  {
    company: "Mirum Brasil",
    roles: [{ title: "QA Analyst" }],
    points: [
      "Testes funcionais: regressão, exploratórios e smoke.",
      "Automação com Ruby e Cucumber, e testes de API com Postman.",
    ],
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE_NAME} · Engenharia de Software & Qualidade` },
      {
        name: "description",
        content:
          "Gabriel Romanini: mais de 8 anos em Qualidade de Software, Quality Engineering, automação E2E com Cypress e Playwright, e IA aplicada à engenharia de testes.",
      },
      { property: "og:title", content: `${SITE_NAME} · Engenharia de Software & Qualidade` },
      {
        property: "og:description",
        content: "Quality Engineering, automação E2E e IA aplicada à engenharia de testes.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
    ],
    links: FONTS_LINKS,
  }),
  component: Index,
});

function Index() {
  return (
    <PageShell>
      {/* HERO: fundo decorativo ocupando a largura toda da tela */}
      <div className="relative">
        {FUNDO_HERO === "silver-arrow" ? <SilverArrowHero /> : <TracadosHero />}
        {/* HERO */}
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-24 pt-8 max-md:pb-14 sm:px-6 md:grid-cols-[1.4fr_1fr] md:pt-28">
          <div className="animate-fade-up">
            <Eyebrow>Software Quality Engineer</Eyebrow>
            <h1 className="mt-8 whitespace-nowrap leading-[0.9] tracking-[-0.02em]">
              <span className="block text-[clamp(48px,6vw,84px)] font-normal text-[#d4d4d4]">
                Gabriel
              </span>
              <span className="text-chrome-reflexo block w-fit pl-[0.3em] pr-[0.1em] text-[clamp(72px,9vw,128px)] font-medium italic">
                Romanini
              </span>
              {/* Linha de acento, alinhada ao deslocamento do "Romanini" (mesmo font-size, mesmo 0.3em) */}
              <span
                aria-hidden
                className="mt-6 ml-[0.3em] block h-[2px] w-[180px] bg-gradient-to-r from-teal to-transparent text-[clamp(72px,9vw,128px)]"
              />
            </h1>
            <p className="mt-8 max-w-xl text-lg font-light leading-relaxed text-muted-foreground">
              Mais de 8 anos construindo qualidade de software em ambientes ágeis de alta escala:
              estruturando áreas de QA do zero, desenvolvendo software com ênfase em qualidade,
              liderando equipes e aplicando Inteligência Artificial à engenharia de testes.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#metodo"
                className="btn-steel-dark inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium"
              >
                Conhecer meu método <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-steel-dark inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            </div>
            <p className="mt-10 flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" /> Curitiba · PR · Brasil
            </p>
          </div>

          {/* Foto com moldura cromada */}
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm animate-fade-up [animation-delay:150ms]">
            <div
              className={`frame-chrome absolute inset-0 rounded-[2rem] ${
                FUNDO_HERO === "silver-arrow"
                  ? "shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_50px_rgba(0,161,156,0.12)]"
                  : ""
              }`}
            />
            <div className="absolute inset-[1px] overflow-hidden rounded-[calc(2rem-1px)] bg-background">
              <img
                src={heroImg}
                alt="Gabriel Romanini"
                width={1024}
                height={1536}
                fetchPriority="high"
                className="h-full w-full object-cover object-[50%_15%]"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/60 to-transparent" />
            </div>
          </div>
        </section>
      </div>

      <div className="relative">
        {/* As linhas do topo descem só pela primeira tela: a seção dos Pilares agora é
            um trilho alto, e esticadas por ele elas ficariam enormes */}
        {/* Bem apagadas (8%), atrás das colunas: não cruzam a cena */}
        <div className="absolute inset-x-0 top-0 h-[100svh] opacity-[0.08]">
          <DiagonaisEspelhadas />
        </div>
        <PilaresSection />
      </div>

      {/* SOBRE */}
      <section
        id="sobre"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 py-28 max-md:py-14 sm:px-6"
      >
        <div className="grid gap-12 max-md:gap-6 md:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="luz-passando w-fit text-4xl leading-tight sm:text-5xl">
              Qualidade como <em className="text-chrome">estratégia</em>, não como etapa.
            </h2>
          </div>
          <div className="space-y-6 text-base font-light leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              A maioria dos softwares é construída primeiro e testada depois. Aqui, o caminho é o
              inverso: cada funcionalidade é pensada a partir de como pode falhar, antes da primeira
              linha de código. O resultado são entregas que chegam prontas, com menos retrabalho,
              menos surpresas e mais confiança para evoluir.
            </p>
            <p>
              <strong className="font-normal text-foreground">Para empresas</strong>, isso significa
              qualidade estruturada como parte da engenharia: processos sólidos, governança e times
              que entregam mais rápido sem abrir mão da estabilidade. Um trabalho potencializado por
              Inteligência Artificial (GenAI, LLM e MCP), que automatiza análises e acelera a
              criação de cenários de teste.
            </p>
            <p>
              <strong className="font-normal text-foreground">
                Para quem está tirando uma ideia do papel
              </strong>
              , significa desenvolvimento conduzido por um especialista em qualidade, com
              tranquilidade também depois da entrega. Projetos que nascem bem elaborados,
              acessíveis, seguros e fáceis de manter, porque são pensados desde o início por quem
              sabe onde o software costuma quebrar.
            </p>
          </div>
        </div>
      </section>

      <PorQueQaSection />

      <div className="relative">
        {/* EXPERTISE */}
        <section
          id="expertise"
          className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-28 max-md:py-14 sm:px-6"
        >
          <h2 className="luz-passando w-fit text-4xl sm:text-5xl">
            Qualidade na <em className="text-chrome">prática</em>
          </h2>
          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {EXPERTISE.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="card-chrome group relative overflow-hidden rounded-2xl p-8"
              >
                <div className="sheen-hover absolute inset-0" />
                <Icon className="h-7 w-7 text-silver" strokeWidth={1.25} />
                <h3 className="mt-6 text-xl font-medium text-foreground">{title}</h3>
                <p className="mt-3 font-light leading-relaxed text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </section>
      </div>

      <div className="relative">
        <MetodoSections />
      </div>

      {/* Voltar ao topo, entre o Método e a Experiência (o #top é tratado por useEnderecoLimpo) */}
      <div className="flex justify-center px-4 pb-16 max-md:pb-6">
        <a
          href="#top"
          className="btn-steel-dark inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium"
        >
          <ArrowUp className="h-4 w-4" /> Voltar ao topo
        </a>
      </div>

      <div className="relative pt-16 max-md:pt-0">
        <LinhaPista />
        {/* TRAJETÓRIA */}
        <section
          id="trajetoria"
          className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-28 max-md:py-14 sm:px-6"
        >
          <h2 className="luz-passando w-fit text-4xl sm:text-5xl">Experiência</h2>
          <ol className="relative mt-14 space-y-14 border-l border-white/10 pl-8 sm:pl-12">
            {EXPERIENCE.map((job) => (
              <li key={job.company} className="relative">
                <span className="absolute -left-[37px] top-2 h-2.5 w-2.5 rounded-full bg-silver shadow-[0_0_12px_oklch(0.85_0.01_250/0.8)] sm:-left-[53px]" />
                <h3 className="font-serif text-3xl text-chrome lining-nums">{job.company}</h3>
                <div className="mt-2 space-y-1">
                  {job.roles.map((r) => (
                    <p
                      key={r.title}
                      className="flex flex-wrap items-baseline gap-x-3 text-sm uppercase tracking-[0.15em]"
                    >
                      <span className="text-foreground">{r.title}</span>
                    </p>
                  ))}
                </div>
                <ul className="mt-5 max-w-3xl space-y-2.5 font-light leading-relaxed text-muted-foreground">
                  {job.points.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span className="mt-[0.7em] h-px w-3 shrink-0 bg-silver/60" />
                      {p}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* CONTATO */}
      <section id="contato" className="scroll-mt-20 px-4 pb-28 max-md:py-14 sm:px-6">
        <div className="card-chrome relative isolate mx-auto max-w-4xl overflow-hidden rounded-[2rem] px-6 py-16 text-center sm:px-16">
          {/* Glow radial suave atrás do título, fechando a página */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[42%] -z-10 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(225,232,242,0.13),rgba(225,232,242,0.04)_55%,transparent)]"
          />
          <div className="sheen absolute inset-0" />
          <h2 className="luz-passando mx-auto w-fit text-4xl sm:text-6xl">
            Vamos construir algo com <em className="text-chrome">qualidade</em>?
          </h2>
          {/* Os dois públicos, na mesma divisão do Sobre */}
          <div className="mx-auto mt-10 grid max-w-3xl gap-6 font-light leading-relaxed text-muted-foreground sm:grid-cols-2 sm:gap-10">
            <p>
              <strong className="font-normal text-foreground">Para times:</strong> estruturar ou
              elevar a qualidade do que já está em produção.
            </p>
            <p>
              <strong className="font-normal text-foreground">Para quem tem uma ideia:</strong>{" "}
              tirar o projeto do papel com quem sabe onde o software costuma quebrar, do primeiro
              rascunho à publicação.
            </p>
          </div>
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-steel-dark mt-10 inline-flex items-center gap-2 rounded-full px-8 py-3.5 text-sm font-medium"
          >
            Falar no LinkedIn <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </PageShell>
  );
}
