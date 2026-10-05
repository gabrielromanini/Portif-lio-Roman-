import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/gabriel-hero.jpeg";
import bgHero3840 from "@/assets/bg-hero-3840.webp";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  GaugeCircle,
  GitBranch,
  GraduationCap,
  Linkedin,
  MapPin,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { LINKEDIN_URL, SITE_NAME } from "@/lib/site";
import { Eyebrow, FONTS_LINKS, PageShell } from "@/components/portfolio/Layout";
import { MetodoSections } from "@/components/portfolio/Metodo";
import { PilaresSection } from "@/components/portfolio/Pilares";
import {
  DiagonaisEspelhadas,
  FibraCarbono,
  GradeTelemetria,
  LinhaPista,
} from "@/components/portfolio/Fundos";

// Fundo de traçados da primeira dobra: só o lado esquerdo aparece (some antes
// da foto), apaga embaixo e abre um "buraco" suave atrás do texto.
const HERO_BG_MASK = {
  maskImage:
    "radial-gradient(ellipse 30% 42% at 27% 52%, transparent 55%, black 100%), linear-gradient(to bottom, black 75%, transparent), linear-gradient(to right, black 35%, transparent 55%)",
  maskComposite: "intersect",
} as const;

const EXPERTISE = [
  {
    icon: ShieldCheck,
    title: "Quality Engineering",
    text: "Estruturação de áreas de QA do zero: processos, governança, estratégia, roadmap e cultura de qualidade com Shift Left e Quality Champions.",
  },
  {
    icon: Bot,
    title: "IA aplicada a testes",
    text: "Evolução de frameworks internos com GenAI, LLM e MCP para gerar cenários, planos de teste e validações automatizadas com agentes inteligentes.",
  },
  {
    icon: Workflow,
    title: "Automação E2E",
    text: "Automações com Cypress e Playwright, testes de API com Postman e Cypress, e testes de carga com K6.",
  },
  {
    icon: GitBranch,
    title: "CI/CD & Observabilidade",
    text: "Testes integrados ao pipeline via Argo Workflows, com Allure Reports e Cypress Cloud para rastreabilidade e métricas de qualidade.",
  },
];

const EXPERIENCE = [
  {
    company: "Frota162",
    roles: [{ title: "Consultor de Qualidade de Software", period: "Jun 2025 — atual" }],
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
    roles: [
      { title: "QA Lead", period: "Dez 2023 — Set 2025" },
      { title: "QA Sênior", period: "Jun 2022 — Dez 2023" },
    ],
    points: [
      "Gestão e desenvolvimento do time de Qualidade de Software, com 5 QAs.",
      "Definição da estratégia, aplicação de Shift Left Testing e roadmap da área de QA.",
      "Testes E2E com Cypress, testes de API com Postman e Cypress, e testes de carga com K6.",
      "Análise de impacto, documentação técnica, relatórios de qualidade e apoio ao roadmap de produto.",
    ],
  },
  {
    company: "SóCarrão",
    roles: [{ title: "QA Analyst", period: "Jun 2021 — Jun 2022" }],
    points: [
      "Planejamento e levantamento de requisitos de testes.",
      "Automação com Cypress e testes de API com Postman.",
      "Testes de regressão, smoke, usabilidade e carga.",
    ],
  },
  {
    company: "Roit Bank",
    roles: [{ title: "QA Analyst", period: "Nov 2020 — Abr 2021" }],
    points: [
      "Testes funcionais, mobile e de API com Postman.",
      "Testes automatizados com Cypress.",
    ],
  },
  {
    company: "Mirum Brasil",
    roles: [{ title: "QA Analyst", period: "Jun 2018 — Nov 2020" }],
    points: [
      "Testes funcionais: regressão, exploratórios e smoke.",
      "Automação com Ruby e Cucumber, e testes de API com Postman.",
    ],
  },
];

const STACK = [
  "Cypress",
  "Playwright",
  "Postman",
  "K6",
  "Ruby + Cucumber",
  "Argo Workflows",
  "Allure Reports",
  "Cypress Cloud",
  "GenAI / LLM",
  "MCP",
  "Shift Left Testing",
  "Testes de API",
  "Testes mobile",
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: `${SITE_NAME} | Quality Engineering & QA Lead` },
      {
        name: "description",
        content:
          "Gabriel Romanini: mais de 8 anos em Qualidade de Software, Quality Engineering, automação E2E com Cypress e Playwright, e IA aplicada à engenharia de testes.",
      },
      { property: "og:title", content: `${SITE_NAME} | Quality Engineering & QA Lead` },
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
      {/* HERO: traçados cromados de fundo, ocupando a largura toda da tela */}
      <div className="relative">
        <img
          src={bgHero3840}
          alt=""
          aria-hidden
          width={3840}
          height={2160}
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[46%] w-full select-none object-cover opacity-25 mix-blend-screen md:top-0 md:h-full"
          style={HERO_BG_MASK}
        />
        {/* HERO */}
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 pb-24 pt-20 sm:px-6 md:grid-cols-[1.4fr_1fr] md:pt-28">
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
              liderando equipes de engenheiros de qualidade e aplicando Inteligência Artificial à
              engenharia de testes.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href="#trajetoria"
                className="btn-steel-dark inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium"
              >
                Ver trajetória <ArrowRight className="h-4 w-4" />
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
            <div className="frame-chrome absolute inset-0 rounded-[2rem]" />
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
        <DiagonaisEspelhadas />
        <PilaresSection />
      </div>

      {/* SOBRE */}
      <section id="sobre" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-28 sm:px-6">
        <div className="grid gap-12 md:grid-cols-[1fr_1.6fr]">
          <div>
            <Eyebrow>Sobre</Eyebrow>
            <h2 className="luz-passando mt-6 w-fit text-4xl leading-tight sm:text-5xl">
              Qualidade como <em className="text-chrome">estratégia</em>, não como etapa.
            </h2>
          </div>
          <div className="space-y-6 text-base font-light leading-relaxed text-muted-foreground sm:text-lg">
            <p>
              Atuação com foco em Quality Engineering, automação E2E e cultura de qualidade, com
              experiência estruturando áreas de QA do zero: definindo processos, governança e
              liderança técnica para várias squads ao mesmo tempo.
            </p>
            <p>
              Foco atual em integrar Inteligência Artificial (GenAI, LLM e MCP) à engenharia de
              testes: evolução de frameworks internos, automação de análises e geração de cenários e
              planos de teste com agentes inteligentes.
            </p>
            <p>
              Perfil hands-on e estratégico, combinando liderança técnica, automação com Cypress e
              Playwright, integração com CI/CD, testes manuais e disseminação da cultura de
              qualidade nos times.
            </p>
          </div>
        </div>
      </section>

      <div className="relative">
        <FibraCarbono />
        {/* EXPERTISE */}
        <section id="expertise" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-28 sm:px-6">
          <Eyebrow>Expertise</Eyebrow>
          <h2 className="luz-passando mt-6 w-fit text-4xl sm:text-5xl">O que é entregue</h2>
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
        <GradeTelemetria />
        <MetodoSections />
      </div>

      <div className="relative pt-16">
        <LinhaPista />
        {/* TRAJETÓRIA */}
        <section id="trajetoria" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-28 sm:px-6">
          <Eyebrow>Trajetória</Eyebrow>
          <h2 className="luz-passando mt-6 w-fit text-4xl sm:text-5xl">Experiência</h2>
          <ol className="relative mt-14 space-y-14 border-l border-white/10 pl-8 sm:pl-12">
            {EXPERIENCE.map((job) => (
              <li key={job.company} className="relative">
                <span className="absolute -left-[37px] top-2 h-2.5 w-2.5 rounded-full bg-silver shadow-[0_0_12px_oklch(0.85_0.01_250/0.8)] sm:-left-[53px]" />
                <h3 className="font-serif text-3xl text-chrome">{job.company}</h3>
                <div className="mt-2 space-y-1">
                  {job.roles.map((r) => (
                    <p
                      key={r.title}
                      className="flex flex-wrap items-baseline gap-x-3 text-sm uppercase tracking-[0.15em]"
                    >
                      <span className="text-foreground">{r.title}</span>
                      <span className="text-muted-foreground">{r.period}</span>
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

      {/* STACK + FORMAÇÃO */}
      <section className="mx-auto grid max-w-6xl gap-5 px-4 pb-28 sm:px-6 md:grid-cols-[1.6fr_1fr]">
        <div className="card-chrome rounded-2xl p-8">
          <div className="flex items-center gap-3">
            <GaugeCircle className="h-5 w-5 text-silver" strokeWidth={1.25} />
            <h3 className="text-sm uppercase tracking-[0.25em] text-foreground">Ferramentas</h3>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {STACK.map((s) => (
              <li
                key={s}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-muted-foreground"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-chrome rounded-2xl p-8">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-5 w-5 text-silver" strokeWidth={1.25} />
            <h3 className="text-sm uppercase tracking-[0.25em] text-foreground">Formação</h3>
          </div>
          <p className="mt-6 font-serif text-2xl text-foreground">
            Análise e Desenvolvimento de Sistemas
          </p>
          <p className="mt-2 text-sm uppercase tracking-[0.15em] text-muted-foreground">
            UniCesumar · 2017 — 2020
          </p>
        </div>
      </section>

      {/* CONTATO */}
      <section id="contato" className="scroll-mt-20 px-4 pb-28 sm:px-6">
        <div className="card-chrome relative isolate mx-auto max-w-4xl overflow-hidden rounded-[2rem] px-6 py-16 text-center sm:px-16">
          {/* Glow radial suave atrás do título, fechando a página */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[42%] -z-10 h-[460px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(225,232,242,0.13),rgba(225,232,242,0.04)_55%,transparent)]"
          />
          <div className="sheen absolute inset-0" />
          <Eyebrow center>Contato</Eyebrow>
          <h2 className="luz-passando mx-auto mt-6 w-fit text-4xl sm:text-6xl">
            Vamos elevar o <span className="text-chrome">padrão</span> de qualidade?
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-light text-muted-foreground">
            Aberto a conversas sobre Quality Engineering, liderança de QA e IA aplicada a testes.
          </p>
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
