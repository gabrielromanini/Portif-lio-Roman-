import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/yole-1.jpg";
import sobreImg from "@/assets/yole-2.jpg";
import bemEstarImg from "@/assets/yole-3.jpg";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { WindLeaves, RHYTHM_B, RHYTHM_C, RHYTHM_D } from "@/components/decorative/WindLeaves";
import { CardLeaves } from "@/components/decorative/CardLeaves";
import { ButtonLeaves } from "@/components/decorative/ButtonLeaves";
import { CTAButton } from "@/components/site/CTAButton";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { BreatheInvite } from "@/components/site/BreatheInvite";
import { INSTAGRAM_LABEL, INSTAGRAM_URL, SITE_URL, UNDER_HEADER } from "@/lib/site";
import {
  HeroBlobs,
  useHeroParallax,
  parallaxStyle,
  PARALLAX_PHOTO_PX,
} from "@/components/decorative/HeroGlow";
import {
  ShieldCheck,
  Clock,
  Video,
  Brain,
  HeartPulse,
  Utensils,
  Sparkles,
  Activity,
  CloudRain,
  Users,
  Flame,
  Hourglass,
  Ghost,
  Waves,
  Compass,
  ChevronDown,
  Star,
  Leaf,
  ArrowRight,
} from "lucide-react";
import { Fragment, useRef, useState } from "react";

const HERO_IMAGE_URL = `${SITE_URL}/og-yole.jpg`;

const FAQS = [
  {
    q: "Como funciona a terapia online com a psicóloga Yole Lopes?",
    a: "Os atendimentos acontecem 100% online, por videochamada. Trabalho com Terapia Cognitivo-Comportamental (TCC) e Terapia do Esquema, em um espaço seguro de escuta e acolhimento. Cada processo é construído junto com você, respeitando seu tempo e sua história.",
  },
  {
    q: "Como faço para agendar uma consulta?",
    a: "O agendamento é feito pelo WhatsApp. Você me chama, conversamos sobre o que está buscando e eu envio as opções de horários disponíveis para você escolher.",
  },
  {
    q: "O atendimento é 100% online?",
    a: "Sim. Atendo exclusivamente online, por videochamada, o que dá mais praticidade, conforto e segurança para encaixar a terapia na sua rotina, de onde você estiver.",
  },
  {
    q: "A terapia online é sigilosa?",
    a: "Sim. O sigilo é um princípio ético da psicologia e é totalmente preservado também no atendimento online. Tudo o que você compartilha nas sessões é confidencial.",
  },
  {
    q: "Para quem a terapia é indicada?",
    a: "Atendo adolescentes a partir de 14 anos, adultos e idosos que buscam apoio psicológico, autoconhecimento ou um espaço seguro para falar sobre o que estão sentindo.",
  },
  {
    q: "Quais temas podem ser trabalhados na terapia?",
    a: "Trabalho temas como ansiedade, autoestima, autoimagem, burnout, procrastinação, traumas, fobias, conflitos familiares e conjugais, relação com a alimentação e o corpo, autoconhecimento e desenvolvimento pessoal.",
  },
  {
    q: "Quanto tempo dura uma sessão?",
    a: "As sessões têm duração média de 50 minutos e podem acontecer em frequência semanal ou quinzenal, conforme a necessidade do seu processo terapêutico.",
  },
  {
    q: "Como funciona o primeiro atendimento?",
    a: "O primeiro contato é uma conversa gratuita de cerca de 20 minutos. É um momento sem compromisso, para você conhecer meu trabalho e eu entender um pouco do seu momento atual.",
  },
  {
    q: "Posso tirar dúvidas pelo WhatsApp antes de agendar?",
    a: "Sim, claro. Você pode me chamar no WhatsApp para tirar qualquer dúvida sobre o atendimento antes de marcar a sua sessão.",
  },
  {
    q: "Você atende plano de saúde?",
    a: "Não. Meu atendimento é particular. Caso precise, posso emitir recibo para reembolso junto ao seu plano de saúde, conforme as regras da sua operadora.",
  },
];

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Yole Lopes Cortinhas",
  jobTitle: "Psicóloga",
  identifier: "CRP 08/34622",
  url: SITE_URL,
  image: HERO_IMAGE_URL,
  telephone: "+5541988964592",
  email: "yolepsico@gmail.com",
  sameAs: [INSTAGRAM_URL],
  knowsAbout: [
    "Psicologia",
    "Terapia Cognitivo-Comportamental",
    "Terapia do Esquema",
    "Atendimento psicológico online",
  ],
  areaServed: { "@type": "Country", name: "Brasil" },
  makesOffer: {
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: "Atendimento psicológico online",
      serviceType: "Psicoterapia online",
      provider: { "@type": "Person", name: "Yole Lopes Cortinhas" },
      areaServed: "BR",
      availableChannel: {
        "@type": "ServiceChannel",
        serviceUrl: SITE_URL,
        availableLanguage: "Portuguese",
      },
    },
  },
};

const webPageLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Psicóloga Online | Yole Lopes — Terapia Online",
  url: SITE_URL,
  inLanguage: "pt-BR",
  about: { "@type": "Person", name: "Yole Lopes Cortinhas" },
  description:
    "Atendimento psicológico online com a psicóloga Yole Lopes (CRP 08/34622). Terapia online com TCC e Terapia do Esquema.",
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Psicóloga Online | Yole Lopes — Terapia Online com Acolhimento" },
      {
        name: "description",
        content:
          "Atendimento psicológico online com a psicóloga Yole Lopes (CRP 08/34622). Terapia online com TCC e Terapia do Esquema. Agende sua conversa gratuita pelo WhatsApp.",
      },
      { property: "og:title", content: "Psicóloga Online | Yole Lopes — Terapia Online" },
      {
        property: "og:description",
        content:
          "Atendimento psicológico online com acolhimento, escuta e segurança. Agende sua conversa gratuita pelo WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: HERO_IMAGE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Psicóloga Online | Yole Lopes — Terapia Online" },
      {
        name: "twitter:description",
        content:
          "Atendimento psicológico online com a psicóloga Yole Lopes (CRP 08/34622). Agende sua conversa gratuita pelo WhatsApp.",
      },
      { name: "twitter:image", content: HERO_IMAGE_URL },
    ],
    links: [
      { rel: "canonical", href: SITE_URL },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(personLd) },
      { type: "application/ld+json", children: JSON.stringify(webPageLd) },
      { type: "application/ld+json", children: JSON.stringify(faqLd) },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <BreatheInvite />
        <Dores />
        <Especialidades />
        <ComoFunciona />
        <Sobre />
        <ProvaSocial />
        <Horarios />
        <FAQ />
        <CTAFinal />
      </main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

const HERO_TITLE = "Entender seus pensamentos é o primeiro passo para transformar sua vida.";
const HERO_IN_START_MS = 120; // primeira palavra (o selo entra em 0)
const HERO_IN_WORD_STEP_MS = 55; // intervalo entre palavras

function Hero() {
  const badges = [
    { icon: Video, label: "100% online" },
    { icon: Clock, label: "Seg. a sex., 10h às 20h" },
    { icon: ShieldCheck, label: "CRP 08/34622" },
    { icon: Brain, label: "TCC + Terapia do Esquema" },
  ];
  const sectionRef = useRef<HTMLElement>(null);
  useHeroParallax(sectionRef);
  const titleWords = HERO_TITLE.split(" ");
  // Sequência da entrada (~1,5s): selo, palavras do título, depois o resto.
  const afterTitle = HERO_IN_START_MS + titleWords.length * HERO_IN_WORD_STEP_MS;
  const inAt = (ms: number) => ({ animationDelay: `${ms}ms` });
  const heroIn = "animate-hero-in motion-reduce:animate-none";

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className={`relative overflow-hidden ${UNDER_HEADER}`}
      style={{
        backgroundImage:
          // Desbota ao longo de ~360px (com paradas intermediárias para a curva
          // ficar macia): o card "Sentindo ansiedade agora?" fica em cima desta
          // passagem e, com 140px, a divisa aparecia como uma linha.
          "linear-gradient(to bottom, var(--color-accent) 0, var(--color-accent) calc(100% - 360px), color-mix(in oklab, var(--color-accent) 70%, transparent) calc(100% - 240px), color-mix(in oklab, var(--color-accent) 35%, transparent) calc(100% - 120px), transparent 100%)",
      }}
    >
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:items-center md:gap-12 md:px-6 md:py-20 lg:py-24">
        <div>
          {/* Glow fixo como base; a animação só faz ele "respirar" por cima.
              Com prefers-reduced-motion fica só o glow fixo. */}
          <span style={inAt(0)} className={`${heroIn} group/cta relative inline-flex items-center overflow-hidden rounded-full max-md:pointer-events-none border border-[#D3DACA] bg-[#E3E8D8]/85 px-4 py-1.5 text-sm font-semibold text-[#2E2F2A] shadow-[0_0_20px_rgba(160,185,140,0.45)] animate-badge-glow transition-[translate] duration-500 ease-out hover:-translate-y-0.5 motion-reduce:animate-none motion-reduce:hover:translate-y-0 md:text-base`}>
            <ButtonLeaves />
            <span className="relative inline-flex items-center gap-2">
              <Sparkles className="h-4 w-4 animate-sparkle-breathe motion-reduce:animate-none md:h-5 md:w-5" />
              Conversa inicial gratuita
            </span>
          </span>
          <h1 className="mt-5 text-[31px] leading-[1.25] text-foreground md:text-5xl md:leading-[1.15]">
            {titleWords.map((word, i) => (
              <Fragment key={i}>
                <span
                  className={`${heroIn} inline-block`}
                  style={inAt(HERO_IN_START_MS + i * HERO_IN_WORD_STEP_MS)}
                >
                  {word}
                </span>{" "}
              </Fragment>
            ))}
          </h1>
          <p style={inAt(afterTitle)} className={`${heroIn} mt-5 text-sm leading-relaxed text-foreground/70 md:text-xl`}>
          Um espaço para acolher suas emoções e construir novas formas de viver.
          </p>
          <p style={inAt(afterTitle + 100)} className={`${heroIn} mt-3 text-sm leading-relaxed text-foreground/60 md:text-xl`}>
          Terapia Cognitivo-Comportamental.
          </p>

          <div style={inAt(afterTitle + 200)} className={`${heroIn} mt-7 flex flex-col gap-3 sm:flex-row`}>
            <CTAButton variant="whatsapp" className="hero-cta" ariaLabel="Falar agora com a psicóloga pelo WhatsApp">
              <WhatsAppIcon />
              Quero começar minha terapia agora
            </CTAButton>
          </div>

          <ul style={inAt(afterTitle + 320)} className={`${heroIn} mt-8 flex flex-wrap gap-x-5 gap-y-2`}>
            {badges.map((b) => (
              <li
                key={b.label}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground/70 max-md:text-foreground/85 md:text-sm"
              >
                <b.icon className="h-3.5 w-3.5 text-foreground/60 max-md:text-foreground/80 md:h-4 md:w-4" />
                {b.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Sem animação de entrada na foto: ela é o maior elemento da tela e
            precisa aparecer o quanto antes (fetchpriority alta, sem lazy). */}
        <div className="relative">
          <HeroBlobs />
          <div
            className="relative mx-auto overflow-hidden rounded-3xl border border-border/60 shadow-soft md:max-w-sm lg:max-w-sm"
            style={parallaxStyle(PARALLAX_PHOTO_PX)}
          >
            <img
              src={heroImg}
              alt="Yole Lopes, psicóloga online (CRP 08/34622), em ambiente acolhedor de atendimento"
              width={1085}
              height={1449}
              loading="eager"
              fetchPriority="high"
              className="aspect-[4/5] w-full object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// Disposição das folhas de cada card (2 de cada). Nessa ordem, cards vizinhos
// nunca repetem, nem lado a lado nem um embaixo do outro na grade de 3 colunas.
const DORES_LEAF_LAYOUTS = [0, 1, 2, 1, 2, 0];

function Dores() {
  const dores: { icon: typeof Activity; title: string; href?: string }[] = [
    { icon: Activity, title: "Ansiedade e preocupações constantes", href: "/ansiedade" },
    { icon: HeartPulse, title: "Baixa autoestima e dificuldade com autoimagem" },
    { icon: Hourglass, title: "Procrastinação e sensação de bloqueio" },
    { icon: Flame, title: "Burnout e esgotamento emocional" },
    { icon: Users, title: "Conflitos familiares ou conjugais" },
    { icon: Utensils, title: "Relação difícil com alimentação, corpo ou emagrecimento" },
  ];
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <WindLeaves />
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        {/* data-hide-floating: o botão flutuante não cobre este título no celular */}
        <div data-hide-floating>
        <SectionHeader
          title="Quando buscar terapia online"
          subtitle="Estes são alguns dos momentos em que a terapia online pode oferecer apoio. Se você se identifica com algum deles, podemos conversar."
        />
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dores.map((d, i) => (
            <li
              key={d.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-[translate,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:border-secondary/50 hover:shadow-soft motion-reduce:hover:translate-y-0"
            >
              <CardLeaves variant={DORES_LEAF_LAYOUTS[i]} />
              <div className="relative mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-primary transition-colors duration-500 ease-out group-hover:bg-secondary/45 group-hover:text-foreground">
                <d.icon className="h-5 w-5" />
              </div>
              {/* h3 sem "relative" quando é link: o ::after do link cobre o card */}
              <h3 className={`${d.href ? "" : "relative "}text-base font-medium leading-snug text-foreground`}>
                {d.href ? (
                  // o link cobre o card inteiro (after:inset-0), mantendo o
                  // texto como nome do link para leitores de tela
                  <a
                    href={d.href}
                    className="after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-ring"
                  >
                    {d.title}
                  </a>
                ) : (
                  d.title
                )}
              </h3>
              {d.href && (
                <span className="pointer-events-none relative mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#4A4440]">
                  Saiba mais <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              )}
            </li>
          ))}
        </ul>
        {/* WhatsApp + "Entenda mais sobre a ansiedade": lado a lado no desktop,
            empilhados e com a mesma largura no celular. */}
        <div className="mx-auto mt-10 flex max-w-sm flex-col items-stretch gap-4 sm:max-w-none sm:flex-row sm:items-center sm:justify-center">
          <CTAButton variant="whatsapp" ariaLabel="Agendar uma consulta pelo WhatsApp">
            <WhatsAppIcon />
            Agende uma consulta
          </CTAButton>
          {/* Sálvia (texto 8,4:1); no hover, o mesmo oliva do hover do WhatsApp
              com texto branco (5:1). */}
          <a
            href="/ansiedade"
            className="group/cta relative inline-flex min-h-[44px] items-center justify-center overflow-hidden rounded-full bg-[#C5D0B8] px-6 py-3.5 text-base font-semibold text-[#2E2F2A] shadow-[0_4px_14px_rgba(110,130,95,0.25)] transition-[background-color,color,translate] duration-300 ease-out hover:-translate-y-0.5 hover:bg-olive hover:text-white active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:hover:translate-y-0 max-[359px]:px-3 max-[359px]:text-sm"
          >
            {/* folhinhas no hover, como nos botões do WhatsApp */}
            <ButtonLeaves />
            <span className="relative inline-flex items-center gap-2 whitespace-nowrap">
              <Leaf aria-hidden="true" className="h-5 w-5" />
              Entenda mais sobre a ansiedade
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}

function Especialidades() {
  const items = [
    { icon: Activity, label: "Ansiedade" },
    { icon: CloudRain, label: "Depressão" },
    { icon: Utensils, label: "Transtornos alimentares" },
    { icon: HeartPulse, label: "Obesidade e emagrecimento" },
    { icon: Sparkles, label: "Autoestima e autoimagem" },
    { icon: Flame, label: "Burnout" },
    { icon: Hourglass, label: "Procrastinação" },
    { icon: Ghost, label: "Traumas" },
    { icon: Waves, label: "Fobias" },
    { icon: Brain, label: "Bipolaridade" },
    { icon: Users, label: "Conflitos familiares e conjugais" },
    { icon: Compass, label: "Autoconhecimento e desenvolvimento pessoal" },
  ];
  return (
    <section
      id="atendimento"
      className="relative overflow-hidden py-16 md:py-24"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, transparent 0, color-mix(in oklab, var(--color-accent) 40%, transparent) 120px, color-mix(in oklab, var(--color-accent) 40%, transparent) calc(100% - 120px), transparent 100%)",
      }}
    >
      <WindLeaves rhythm={RHYTHM_B} />
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeader
          title="Temas atendidos na terapia online"
          subtitle="Atendo demandas variadas em terapia online, sempre respeitando o tempo e a história de cada pessoa."
        />
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((it, i) => (
            <li
              key={it.label}
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl border border-border bg-card px-3 py-4 text-[13px] font-medium text-foreground shadow-card transition-[translate,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:border-secondary/50 hover:shadow-soft motion-reduce:hover:translate-y-0 sm:gap-3 sm:px-4 sm:text-sm"
            >
              {/* 3 disposições em sequência: vizinhos não repetem nas grades de 2 e 4 colunas */}
              <CardLeaves compact variant={i % 3} />
              {/* margem negativa: o fundo verde aparece no hover sem mudar o layout */}
              <span className="relative -m-1.5 inline-flex shrink-0 rounded-lg p-1.5 text-primary transition-colors duration-500 ease-out group-hover:bg-secondary/45 group-hover:text-foreground">
                <it.icon className="h-5 w-5" />
              </span>
              <span className="relative min-w-0 leading-snug">{it.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

// Grade de 2 colunas: 0 1 / 2 0 — nenhum card repete o vizinho.
const PASSOS_LEAF_LAYOUTS = [0, 1, 2, 0];

function ComoFunciona() {
  const steps = [
    {
      title: "Primeiro contato pelo WhatsApp",
      text: "Você me chama no WhatsApp para tirar dúvidas e ver os horários disponíveis.",
    },
    {
      title: "Conversa inicial gratuita (cerca de 20 min)",
      text: "Um momento para você conhecer meu trabalho e eu entender um pouco do seu momento atual, sem compromisso.",
    },
    {
      title: "Sessões online de 50 minutos",
      text: "Realizadas por videochamada, em frequência semanal ou quinzenal, conforme o seu processo terapêutico.",
    },
    {
      title: "Plano terapêutico construído junto",
      text: "A partir da escuta, do acolhimento e da compreensão da sua história, definimos juntos o melhor caminho.",
    },
  ];
  return (
    <section id="como-funciona" className="relative overflow-hidden py-16 md:py-24">
      <WindLeaves rhythm={RHYTHM_C} />
      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeader
          title="Como funciona a terapia online"
          subtitle="Um caminho simples, claro e acolhedor para você começar."
        />
        <ol className="relative grid gap-5 md:grid-cols-2">
          {steps.map((s, i) => (
            <li
              key={s.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-card transition-[translate,border-color,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:border-secondary/50 hover:shadow-soft motion-reduce:hover:translate-y-0"
            >
              <CardLeaves variant={PASSOS_LEAF_LAYOUTS[i]} />
              <div className="relative mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold transition-colors duration-500 ease-out group-hover:bg-secondary group-hover:text-foreground">
                {i + 1}
              </div>
              <h3 className="relative text-lg font-semibold text-foreground">{s.title}</h3>
              <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-10 flex justify-center">
          <CTAButton variant="whatsapp" ariaLabel="Agendar conversa gratuita pelo WhatsApp">
            <WhatsAppIcon />
            Agendar conversa gratuita
          </CTAButton>
        </div>
      </div>
    </section>
  );
}

function Sobre() {
  return (
    <section
      id="sobre"
      // Sem overflow-hidden aqui: ele quebraria a foto "grudada" (sticky) no
      // desktop. As folhas já ficam contidas na própria camada.
      className="relative py-16 md:py-24"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, transparent 0, color-mix(in oklab, var(--color-primary-soft) 30%, transparent) 140px, color-mix(in oklab, var(--color-primary-soft) 30%, transparent) calc(100% - 140px), transparent 100%)",
      }}
    >
      <WindLeaves rhythm={RHYTHM_D} />
      <div className="relative z-10 mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[1fr_1.3fr] md:items-start md:gap-14 md:px-6">
        <div className="order-1 md:order-1 md:sticky md:top-24">
          <div className="relative mx-auto max-w-md md:max-w-none">
            <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-secondary/30 to-primary/20 blur-2xl" />
            <div className="overflow-hidden rounded-3xl border border-border/60 shadow-soft">
              <img
                src={sobreImg}
                alt="Psicóloga Yole Lopes, especialista em terapia online com TCC e Terapia do Esquema"
                loading="lazy"
                width={1024}
                height={1280}
                className="aspect-[3/4] h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
        <div className="order-2">
          <h2 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">
            Sobre a psicóloga Yole Lopes
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
            Desde a adolescência, percebi em mim uma vontade genuína de ajudar as pessoas. Foi na psicologia que encontrei um caminho para transformar isso em escuta, cuidado e presença na vida de quem me procura.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Acredito que a vida não é sobre ser perfeita, mas sobre ser quem você é. E a terapia é um espaço para isso: um momento de pausa para se acolher, entender sua história e, aos poucos, construir uma vida que faça mais sentido para você.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Nas sessões, conduzo o processo de forma leve e próxima, respeitando o seu tempo. A conversa acontece de maneira natural, enquanto compreendemos padrões, emoções e possibilidades de mudança. Também compartilho com você minha leitura ao longo do processo, para que o caminho seja claro e construído em conjunto.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Meu trabalho é guiado por acolhimento, empatia, escuta ativa, respeito à sua história e ética profissional.
          </p>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            No meu trabalho, combino a <strong className="font-semibold text-foreground">Terapia Cognitivo-Comportamental (TCC)</strong>, com sua parte mais prática e cognitiva, com a <strong className="font-semibold text-foreground">Terapia do Esquema</strong>, que aprofunda o trabalho com as emoções e padrões mais antigos. Essa integração me permite oferecer um cuidado mais completo, técnico e humano ao mesmo tempo.
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-card px-4 py-2 text-sm font-semibold text-primary shadow-card">
            <ShieldCheck className="h-4 w-4" />
            CRP 08/34622
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <CTAButton variant="whatsapp" ariaLabel="Tirar dúvidas pelo WhatsApp">
              <WhatsAppIcon />
              Tirar dúvidas pelo WhatsApp
            </CTAButton>
            {/* Secundário: contornado quando parado (não concorre com o verde);
                no hover segue o padrão dos outros: oliva, sobe e folhinhas. */}
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Acompanhe no ${INSTAGRAM_LABEL}`}
              className="group/cta relative inline-flex min-h-[44px] items-center justify-center overflow-hidden rounded-full border border-foreground/20 bg-transparent px-6 py-3.5 text-base font-medium text-foreground transition-all duration-500 ease-out hover:-translate-y-0.5 hover:border-olive hover:bg-olive hover:text-white hover:shadow-soft active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <ButtonLeaves />
              <span className="relative inline-flex items-center justify-center gap-2">
                <InstagramIcon />
                Acompanhe no Instagram
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProvaSocial() {
  const reviews = [
    {
      name: "N. R.",
      meta: "3 avaliações · 2 anos atrás",
      initial: "N",
      text: "A Yole foi um presente na minha vida!!! Busquei seus serviços para melhorar a minha relação com a comida, mas com todo seu profissionalismo, acolhimento, empatia, respeito e acertividade consegui realmente enxergar o que estava por trás da fuga que eu estava fazendo com a comida. Hoje continuo nesse processo de auto conhecimento e gerenciamento das minhas emoções e decisões e de quebra ainda emagreci 7kgs!!! Super recomendo essa profissional incrível que mudou a minha vida com seu trabalho.",
    },
    {
      name: "G. P.",
      meta: "Local Guide · 14 avaliações",
      initial: "G",
      text: "A Yole é uma profissional super atenciosa e empática. Comecei meu acompanhamento com ela em Dezembro e estou amando. Foi gratificante iniciar minha jornada de auto conhecimento e ir aprendendo aos poucos a entender minhas emoções. Ela vem me ajudando DEMAIS com o burnout que tive no fim do ano passado, retirando muito o peso dos meus ombros no dia a dia. Indico de olhos fechados. Obrigada, dra!",
    },
    {
      name: "A. G.",
      meta: "1 avaliação · 2 semanas atrás",
      initial: "A",
      text: "Quando eu comecei a terapia com a Yole, eu estava destruída. Ela me ajudou a me encontrar, me conhecer, me valorizar, respeitar e a não viver segundo as expectativas dos outros. Eu sou muito grata pelas sessões, com o carinho e acolhimento dela comigo. Yole, sua vida fez diferença na minha… Obrigada por tanto!!",
    },
  ];
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeader
          eyebrow="Avaliações reais do Google"
          title="O que pacientes dizem sobre o processo terapêutico"
        />
        <ul className="grid gap-5 md:grid-cols-3">
          {reviews.map((r) => (
            <li
              key={r.name}
              className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-card"
            >
              <div className="mb-4 flex items-center gap-3">
                <div
                  aria-hidden
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-soft text-base font-semibold text-primary"
                  style={{ filter: "blur(3px)" }}
                >
                  {r.initial}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-foreground">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.meta}</p>
                </div>
              </div>
              <div className="mb-3 flex items-center gap-2">
                <div className="flex gap-0.5 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  via Google
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">"{r.text}"</p>
            </li>
          ))}
        </ul>
        <div className="mt-10 flex justify-center">
          <a
            href="https://www.google.com/search?sca_esv=251dd46310ce0ad5&rlz=1C5AJCO_enBR1193BR1195&cs=0&sxsrf=ANbL-n6GWllpmaJAr5J09jPZ4rQJDkQseQ:1778016303500&si=AL3DRZEsmMGCryMMFSHJ3StBhOdZ2-6yYkXd_doETEE1OR-qOd13ExxGoEZ9lnIlkoPz4sPpbFlCWRNBT0brQXI7BtU9vTdYNbToei_JXSHR2r75SgH8kbuKmyV5xwi8tn5_QWRPg0_c0u-zz2IohRpR-MUI6Jq65Q%3D%3D&q=Psic%C3%B3loga+Yole+Lopes+Coment%C3%A1rios&sa=X&ved=2ahUKEwivsbLxiqOUAxU8GLkGHaLvCLQQ0bkNegQIIxAF&biw=1440&bih=672&dpr=2"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full border border-primary/30 bg-card px-6 py-3 text-base font-medium text-primary shadow-card transition-all hover:-translate-y-0.5 hover:bg-primary-soft/50"
          >
            <Star className="h-4 w-4 fill-current text-amber-500" />
            Ver avaliações no Google
          </a>
        </div>
      </div>
    </section>
  );
}

function Horarios() {
  const items = [
    { icon: Video, label: "Formato", value: "100% online" },
    { icon: Clock, label: "Dias", value: "Segunda a sexta" },
    { icon: Hourglass, label: "Horários", value: "Das 10h às 20h" },
    { icon: WhatsAppIcon, label: "Agendamento", value: "Pelo WhatsApp" },
    { icon: ShieldCheck, label: "Remarcação", value: "Aviso com 24h de antecedência" },
    { icon: Brain, label: "Plano de saúde", value: "Atendimento particular" },
  ];
  return (
    <section
      className="py-16 md:py-24"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, transparent 0, color-mix(in oklab, var(--color-accent) 40%, transparent) 120px, color-mix(in oklab, var(--color-accent) 40%, transparent) calc(100% - 120px), transparent 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-primary">
              Praticidade e segurança
            </p>
            <h2 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">
              Atendimento psicológico online: como funciona na prática
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
              Atendimento 100% online por videochamada, com sigilo profissional, conforto e flexibilidade para a sua rotina. O agendamento é simples e direto pelo WhatsApp.
            </p>
            <div className="mt-7">
              <CTAButton variant="whatsapp" ariaLabel="Agendar atendimento online pelo WhatsApp">
                <WhatsAppIcon />
                Agendar atendimento online
              </CTAButton>
            </div>
          </div>
          <div className="relative">
            <div className="mx-auto overflow-hidden rounded-3xl border border-border/60 shadow-soft md:max-w-sm lg:max-w-md">
              <img
                src={bemEstarImg}
                alt="Atendimento psicológico online com acolhimento, escuta e segurança"
                loading="lazy"
                width={1280}
                height={1600}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
          </div>
        </div>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <li
              key={it.label}
              className="flex items-start gap-3 rounded-xl border border-border bg-card px-4 py-4 shadow-card"
            >
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                <it.icon className="h-4.5 w-4.5" />
              </span>
              <span className="leading-tight">
                <span className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {it.label}
                </span>
                <span className="block text-sm font-semibold text-foreground">{it.value}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="duvidas" className="py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <SectionHeader
          title="Perguntas frequentes sobre terapia online"
        />
        <ul className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <li
                key={f.q}
                className="overflow-hidden rounded-2xl border border-border bg-card shadow-card"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-primary-soft/30 min-h-[44px]"
                  aria-expanded={isOpen}
                >
                  <h3 className="text-base font-semibold text-foreground">{f.q}</h3>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-primary transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <div className="mt-10 flex justify-center">
          <CTAButton variant="outline" ariaLabel="Tirar dúvidas pelo WhatsApp">
            <WhatsAppIcon />
            Tirar dúvidas pelo WhatsApp
          </CTAButton>
        </div>
      </div>
    </section>
  );
}

function CTAFinal() {
  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      style={{
        backgroundImage:
          "linear-gradient(to bottom, transparent 0, var(--color-accent) 140px, var(--color-accent) 100%)",
      }}
    >
      <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
        <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl md:text-5xl">
          Agende sua consulta com a psicóloga Yole Lopes
        </h2>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          A primeira conversa é gratuita e sem compromisso. Fale comigo pelo WhatsApp para agendar seu atendimento psicológico online.
        </p>
        <div className="mt-8 flex justify-center">
          <CTAButton variant="light" className="!px-8 !py-4 text-lg" ariaLabel="Agendar conversa gratuita no WhatsApp">
            <WhatsAppIcon />
            Agendar conversa gratuita no WhatsApp
          </CTAButton>
        </div>
      </div>
    </section>
  );
}
