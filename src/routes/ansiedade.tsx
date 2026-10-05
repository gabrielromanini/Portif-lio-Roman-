import { createFileRoute } from "@tanstack/react-router";
import { BreathingExercise } from "@/components/anxiety/BreathingExercise";
import { AnxietySigns } from "@/components/anxiety/AnxietySigns";
import { AnxietyCycle } from "@/components/anxiety/AnxietyCycle";
import { TherapyHelp } from "@/components/anxiety/TherapyHelp";
import { WindLeaves, type LeafSequence } from "@/components/decorative/WindLeaves";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { CTAButton } from "@/components/site/CTAButton";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { FloatingWhatsApp } from "@/components/site/FloatingWhatsApp";
import { SITE_URL, UNDER_HEADER, whatsappUrl } from "@/lib/site";
import jardimDesktop from "@/assets/jardim-1672.webp";
import jardimCelular from "@/assets/jardim-960.webp";
import fundoAnsiedade from "@/assets/fundo-ansiedade.webp";

const PAGE_URL = `${SITE_URL}/ansiedade`;
const OG_IMAGE = `${SITE_URL}/og-yole.jpg`;
const TITLE = "Terapia para ansiedade online | Psicóloga Yole Lopes";
const DESCRIPTION =
  "Comece agora com um exercício de respiração guiada e entenda como a terapia online com TCC e Terapia do Esquema pode ajudar na ansiedade. Psicóloga Yole Lopes, CRP 08/34622.";

// Folhas do topo: uma por vez, a cada 3 s, mais lentas e mais apagadas que
// na home. Ciclo de 8: 4 da esquerda, 2 do noroeste, 2 do nordeste.
const LEAF_SEQUENCE: LeafSequence = {
  order: ["left", "nw", "left", "ne", "left", "nw", "left", "ne"],
  intervalMs: 3000,
  firstDelayMs: 600,
  speedFactor: 0.6,
  alphaFactor: 0.6,
};

// ---- Fundo: mesmo esquema da home ----
// Da 2ª seção em diante, um fundo simples de folhas (FundoFolhas) fica fixo
// atrás do conteúdo. Fechamento + rodapé em cacau.
// Contraste: igual ao da home (texto secundário aqui é um pouco mais escuro,
// #4A4440). Creme #F5EFE6 sobre cacau = 7,8 (nota pequena a 80%: 5,7).
// Bege a 40% da home, já misturado com o fundo (cor sólida). É a cor em que
// a foto do topo se dissolve e a base por trás do fundo de folhas.
const BEIGE = "color-mix(in oklab, var(--color-accent) 40%, var(--color-background))";
const CACAU = "#5A463A"; // fechamento + rodapé — o ponto mais fundo, mais íntimo

// No fim, a página "desce para a terra": "Como a terapia pode ajudar" vai do
// fundo de folhas até um marrom claro, de onde a onda leva ao cacau. Assim o
// rodapé escuro faz sentido.
// Contraste no ponto mais escuro (#D3BBA0): título 7,7 / secundário 5,2.
const TERRA = "#D3BBA0";
// "Como a terapia pode ajudar": o fundo de folhas se dissolve na terra,
// de onde a onda leva ao cacau.
const PARA_A_TERRA = {
  backgroundImage: `linear-gradient(to bottom, transparent 0, transparent 35%, ${TERRA} 100%)`,
};
// Texto secundário das seções claras.
const SECONDARY = "text-[#4A4440]";

// Todos os botões de WhatsApp desta página avisam de onde a pessoa veio.
const WHATSAPP_ANSIEDADE = whatsappUrl(
  "Olá, Yole! Vim pela página sobre ansiedade e gostaria de conversar.",
);

export const Route = createFileRoute("/ansiedade")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "canonical", href: PAGE_URL },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  component: Ansiedade,
});

function Ansiedade() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <Header whatsappHref={WHATSAPP_ANSIEDADE} currentPath="/ansiedade" />
      <main>
        <Respiracao />
        <FundoFolhas>
          <PreocupacaoNaoDesliga />
          <SeraQueEAnsiedade />
          <CicloDaAnsiedade />
          <ComoATerapiaAjuda />
        </FundoFolhas>
        <Fechamento />
      </main>
      <Footer
        whatsappHref={WHATSAPP_ANSIEDADE}
        tone="dark"
        style={{
          backgroundColor: CACAU,
          // única separação entre o fechamento e o rodapé
          borderTop: "1px solid rgba(245,239,230,0.15)",
        }}
      />
      <FloatingWhatsApp href={WHATSAPP_ANSIEDADE} />
    </div>
  );
}

// ---- Fundo de folhas (da 2ª seção até "Como a terapia pode ajudar") ----
// A imagem fica fixa na tela (sticky) enquanto o conteúdo rola por cima: as
// folhas emolduram a tela o tempo todo. Suavizada por um véu creme, entra
// devagar saindo da foto do topo (máscara) e, embaixo, a última seção se
// dissolve na terra. A seção da respiração não muda.
function FundoFolhas({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative" style={{ backgroundColor: BEIGE }}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage: "linear-gradient(to bottom, transparent 0, black 260px)",
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0, black 260px)",
        }}
      >
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          {/* Desktop: imagem cobrindo a tela; máscara no topo para o galho do
              canto superior não encostar na foto da respiração (visível a ~33%). */}
          <img
            src={fundoAnsiedade}
            alt=""
            loading="lazy"
            decoding="async"
            className="hidden h-full w-full object-cover object-center md:block"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0, black 33%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0, black 33%)",
            }}
          />
          {/* Celular: a imagem é horizontal; em vez de recortar só o meio (quase
              todo creme), mostra a imagem inteira presa embaixo da tela, com as
              folhas dos dois cantos, esmaecendo para cima no creme. */}
          <img
            src={fundoAnsiedade}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-x-0 bottom-0 w-full md:hidden"
            style={{
              maskImage: "linear-gradient(to bottom, transparent 0, black 45%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0, black 45%)",
            }}
          />
          {/* Véu creme: deixa a imagem calma e garante a leitura dos textos
              (um pouco mais forte no celular). */}
          <div className="absolute inset-0 bg-[#F5EFE6]/55 md:bg-[#F5EFE6]/45" />
        </div>
      </div>
      {/* conteúdo acima do fundo */}
      <div className="relative">{children}</div>
    </div>
  );
}

// ---- Seção 1: o cuidado começa com a respiração ----
function Respiracao() {
  return (
    <section
      className={`relative overflow-hidden ${UNDER_HEADER}`}
      style={{
        backgroundImage:
          // o bege do topo se dissolve no bege da seção seguinte (sem faixa clara)
          `linear-gradient(to bottom, var(--color-accent) 0, var(--color-accent) calc(100% - 160px), ${BEIGE} 100%)`,
      }}
    >
      {/* Fundo de jardim: imagem desfocada + véu creme por cima (suaviza e
          garante o contraste dos textos). Embaixo ela esmaece para emendar
          com a próxima seção, sem linha. O navegador escolhe a versão leve
          do celular ou a do desktop. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage: "linear-gradient(to bottom, black 0, black calc(100% - 220px), transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0, black calc(100% - 220px), transparent 100%)",
        }}
      >
        <img
          src={jardimDesktop}
          srcSet={`${jardimCelular} 960w, ${jardimDesktop} 1672w`}
          sizes="100vw"
          alt=""
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[#F5EFE6]/60" />
      </div>

      {/* Folhas ao vento (atrás do conteúdo), em sequência calma. */}
      <WindLeaves sequence={LEAF_SEQUENCE} maxLeaves={{ desktop: 10, mobile: 6 }} />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-4 pb-16 pt-10 text-center md:px-6 md:pb-24 md:pt-14">
        <div>
          <h1 className="text-[34px] leading-[1.15] text-foreground md:text-6xl">
            Seu tratamento começa agora.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
            Antes de qualquer coisa, respire comigo por um minuto.
          </p>
        </div>

        <div className="mt-10 md:mt-12">
          <BreathingExercise />
        </div>

        <div className={`mx-auto mt-12 max-w-xl space-y-3 text-base leading-relaxed text-[#3F3A36] md:text-lg`}>
          <p>
            Quando a ansiedade aperta, a respiração fica curta e acelerada. Soltar o ar devagar pode
            ajudar o corpo a sair do estado de alerta e trazer alívio no momento.
          </p>
          <p>
            Para entender e transformar o que mantém a ansiedade, a psicoterapia é o caminho.
          </p>
        </div>
      </div>
    </section>
  );
}

// ---- Seção 2: quando a preocupação não desliga ----
function PreocupacaoNaoDesliga() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-2xl px-4 text-center md:px-6">
        <h2 className="text-3xl font-bold leading-tight text-foreground md:text-4xl">
          Preocupação
        </h2>
        <div className={`mt-6 space-y-4 text-base leading-relaxed ${SECONDARY} md:text-lg`}>
          <p>
            Quando a preocupação não desliga, a mente está sempre antecipando o que pode dar errado,
            e até descansar parece difícil.
          </p>
          <p>A ansiedade pode atrapalhar tanto sua vida pessoal quanto a profissional.</p>
          <p>
            A psicoterapia pode ajudar você a compreender o que mantém esse ciclo e a desenvolver
            novas formas de lidar com seus pensamentos, emoções e preocupações.
          </p>
        </div>
        <div className="mt-9 flex justify-center">
          <CTAButton
            variant="whatsapp"
            href={WHATSAPP_ANSIEDADE}
            ariaLabel="Quero conversar com a Psico Yole pelo WhatsApp"
          >
            <WhatsAppIcon />
            Quero conversar com a Psico Yole
          </CTAButton>
        </div>
      </div>
    </section>
  );
}

// ---- Seção 3: será que é ansiedade? ----
function SeraQueEAnsiedade() {
  return (
    <section className="px-4 py-16 md:px-6 md:py-24">
      <h2 className="mx-auto max-w-2xl text-center text-3xl font-bold leading-tight text-foreground md:text-4xl">
        A ansiedade faz parte da vida. Mas, em alguns momentos, ela começa a ocupar espaço demais.
      </h2>
      <div className="mt-9">
        <AnxietySigns />
      </div>
    </section>
  );
}

// ---- Seção 4: o ciclo da ansiedade ----
function CicloDaAnsiedade() {
  return (
    <section
      // overflow-hidden: o brilho atrás da lista (celular) não pode vazar para os lados
      className="overflow-hidden px-4 py-16 md:px-6 md:py-24"
    >
      <h2 className="mb-10 text-center text-3xl font-bold leading-tight text-foreground md:mb-12 md:text-4xl">
        O ciclo da ansiedade
      </h2>
      <AnxietyCycle />
    </section>
  );
}

// ---- Seção 5: como a terapia pode ajudar ----
function ComoATerapiaAjuda() {
  return (
    <section
      id="como-a-terapia-ajuda"
      className="scroll-mt-20 px-4 py-16 md:px-6 md:py-24"
      style={PARA_A_TERRA}
    >
      <TherapyHelp />
    </section>
  );
}

// ---- Seção 6: fechamento (terra profunda) ----
function Fechamento() {
  return (
    <section style={{ backgroundColor: CACAU }}>
      {/* Onda suave: a terra clara de cima "desce" e encontra o marrom escuro,
          numa transição curta (sem faixa de marrom médio). */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="block h-14 w-full md:h-20"
      >
        <path
          d="M0 0 H1440 V38 C1260 78 1080 86 900 62 C720 38 560 18 380 34 C220 48 110 70 0 60 Z"
          fill={TERRA}
        />
      </svg>
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 text-center text-[#F5EFE6] md:px-6 md:pb-24 md:pt-14">
        <h2 className="text-3xl font-bold leading-tight text-[#F5EFE6] sm:text-4xl md:text-5xl">
          Você não precisa esperar a ansiedade ficar insuportável para procurar ajuda.
        </h2>
        <div className="mt-6 text-base leading-relaxed md:text-lg">
          <p>
            Se as preocupações, a autocobrança ou a dificuldade de desligar têm ocupado espaço demais
            na sua vida, a psicoterapia pode ser um espaço para compreender o que está acontecendo e
            aprender novas formas de lidar com isso.
          </p>
        </div>
        <div className="mt-9 flex justify-center">
          <CTAButton
            variant="whatsapp"
            href={WHATSAPP_ANSIEDADE}
            ariaLabel="Quero agendar uma conversa inicial pelo WhatsApp"
            className="focus-visible:ring-offset-[#5A463A]"
          >
            <WhatsAppIcon />
            Quero agendar uma conversa inicial
          </CTAButton>
        </div>
        <p className="mx-auto mt-10 max-w-md text-sm leading-relaxed text-[#F5EFE6]/80">
          Se você estiver em uma crise intensa ou pensando em se machucar, procure ajuda imediata: CVV
          188 (24h) ou SAMU 192.
        </p>
      </div>
    </section>
  );
}
