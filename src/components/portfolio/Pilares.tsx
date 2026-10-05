import { useId, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  ArrowLeftToLine,
  ArrowUpRight,
  Bot,
  Code2,
  Handshake,
  ListChecks,
  ShieldCheck,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import { Eyebrow } from "@/components/portfolio/Layout";

type Pilar = {
  icon: LucideIcon;
  title: string;
  /** Uma linha no card: o que o pilar demonstra. */
  summary: string;
  description: string;
  topics: { name: string; text: string }[];
  /** Ferramentas aparecem só dentro do modal, em segundo plano. */
  tools?: string[];
  /** Seção do método com mais detalhes. */
  more?: string;
};

const PILARES: Pilar[] = [
  {
    icon: Code2,
    title: "Engenharia orientada à qualidade",
    summary: "A filosofia por trás de todo o trabalho.",
    description:
      "Qualidade não é uma etapa no fim do processo: é um critério de engenharia presente em cada decisão, do desenho da solução ao acompanhamento em produção.",
    topics: [
      {
        name: "Código pensado para ser testado",
        text: "Soluções desenhadas desde o início para serem verificáveis e fáceis de manter.",
      },
      {
        name: "Estratégia antes de ferramenta",
        text: "Testes escolhidos pelo risco que reduzem, seguindo a pirâmide de testes.",
      },
      {
        name: "Decisão com dados",
        text: "Métricas extraídas antes e depois de cada mudança de processo.",
      },
      {
        name: "O usuário no centro",
        text: "Fluxos, acessibilidade e performance tratados como requisito, desde a primeira linha.",
      },
    ],
    more: "#metodo",
  },
  {
    icon: Workflow,
    title: "Automação de testes",
    summary: "Testes confiáveis, rápidos e fáceis de manter.",
    description:
      "Automação tratada como código de produção: legível, reutilizável e integrada ao pipeline, cobrindo interface, API e performance.",
    topics: [
      {
        name: "E2E com Cypress e Playwright",
        text: "Jornadas críticas do usuário de ponta a ponta, organizadas com Page Objects.",
      },
      {
        name: "Testes de API com Postman",
        text: "Contratos, status, regras de negócio e dados validados direto nas APIs.",
      },
      {
        name: "Performance com k6",
        text: "Comportamento do sistema sob carga, antes que o usuário perceba.",
      },
      {
        name: "No pipeline",
        text: "Suítes rodando a cada entrega, com resultados visíveis para o time.",
      },
    ],
    tools: ["Cypress", "Playwright", "Postman", "k6"],
    more: "#automacao",
  },
  {
    icon: Bot,
    title: "IA aplicada à qualidade",
    summary: "LLMs, agentes e testes inteligentes.",
    description:
      "Utilização de IA, LLMs e agentes para apoiar a análise de requisitos, a geração de cenários, a criação de testes e a identificação estratégica de riscos.",
    topics: [
      {
        name: "Análise de requisitos",
        text: "Leitura assistida de histórias e critérios para encontrar lacunas e ambiguidades.",
      },
      {
        name: "Geração de cenários",
        text: "Cenários e planos de teste gerados com apoio de agentes inteligentes.",
      },
      {
        name: "Criação de testes",
        text: "Aceleração na escrita de testes automatizados e validações.",
      },
      {
        name: "Riscos estratégicos",
        text: "Identificação de pontos de maior risco para direcionar o esforço de teste.",
      },
    ],
    tools: ["GenAI", "LLMs", "Agentes", "MCP"],
  },
  {
    icon: ArrowLeftToLine,
    title: "Shift Left Testing",
    summary: "Qualidade desde o início.",
    description:
      "Antecipação da qualidade para as primeiras etapas do desenvolvimento, reduzindo riscos e custos de correção.",
    topics: [
      {
        name: "QA no refinamento",
        text: "Dúvidas e riscos levantados antes de qualquer linha de código.",
      },
      {
        name: "Critérios de aceite claros",
        text: "Todos com a mesma definição de pronto desde o começo.",
      },
      {
        name: "Quality Champions",
        text: "Referências de qualidade dentro de cada squad.",
      },
      {
        name: "Feedback rápido",
        text: "Testes rodando a cada pull request, enquanto corrigir ainda é barato.",
      },
    ],
    more: "#shift-left",
  },
  {
    icon: ListChecks,
    title: "Testes funcionais",
    summary: "Exploratórios, regressivos, smoke, usabilidade e mais.",
    description:
      "Cada risco pede um tipo de teste. A combinação certa garante que o produto faz o que deveria, do jeito que o usuário espera.",
    topics: [
      {
        name: "Exploratório",
        text: "Investigar o produto de forma estruturada para encontrar comportamentos inesperados e riscos não cobertos pelos testes existentes.",
      },
      {
        name: "Regressivo",
        text: "Garantir que alterações não introduzam problemas em funcionalidades existentes.",
      },
      {
        name: "Smoke",
        text: "Validar rapidamente se a aplicação está estável o suficiente para seguir para testes mais profundos.",
      },
      {
        name: "Sanidade",
        text: "Verificar se uma alteração específica funciona conforme esperado antes de uma validação mais ampla.",
      },
      {
        name: "Usabilidade",
        text: "Avaliar se a interface e os fluxos são compreensíveis e adequados para o usuário.",
      },
      {
        name: "Integração",
        text: "Validar a comunicação entre diferentes componentes, serviços e sistemas.",
      },
    ],
    more: "#tipos",
  },
  {
    icon: ShieldCheck,
    title: "Quality Gates",
    summary: "Qualidade integrada ao CI/CD.",
    description:
      "Critérios automatizados de qualidade integrados ao CI/CD para impedir que alterações com falhas conhecidas avancem no fluxo de entrega, desde o upstream até o downstream.",
    topics: [
      {
        name: "Do upstream ao downstream",
        text: "Verificações em cada etapa, do commit até a produção.",
      },
      {
        name: "Critérios objetivos",
        text: "Definidos com o time e com produto: o que bloqueia e o que só alerta.",
      },
      {
        name: "Resultados visíveis",
        text: "Relatórios acessíveis para todos acompanharem a saúde das entregas.",
      },
    ],
    tools: ["Git", "CI/CD", "Cypress", "Playwright", "Postman", "k6", "SonarQube", "Allure"],
    more: "#quality-gates",
  },
  {
    icon: Handshake,
    title: "Qualidade colaborativa",
    summary: "Produto, Dev, cliente e QA juntos.",
    description:
      "Comunicação é a soft skill mais importante de um engenheiro de software: tanto para entender o produto e o cliente quanto para antecipar possíveis problemas e economizar tempo.",
    topics: [
      {
        name: "Entender o produto e o cliente",
        text: "Saber o porquê de cada funcionalidade antes de decidir como testá-la.",
      },
      {
        name: "Antecipar problemas",
        text: "Boa parte dos bugs nasce de um mal-entendido, não de código.",
      },
      {
        name: "Economizar tempo",
        text: "Menos retrabalho quando todos se entendem cedo.",
      },
    ],
    more: "#produto",
  },
];

/**
 * Contorno chanfrado no canto superior esquerdo do card: duas linhas cromadas
 * que se apagam nas pontas. Tamanho fixo, para o ângulo nunca distorcer.
 */
function CantoChanfrado() {
  const id = useId();
  return (
    <svg
      aria-hidden
      width="340"
      height="240"
      viewBox="0 0 340 240"
      fill="none"
      className="pointer-events-none absolute left-0 top-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100"
    >
      <defs>
        <linearGradient
          id={`${id}-a`}
          x1="0"
          y1="240"
          x2="340"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.38" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="0.55" stopColor="#d7dadf" stopOpacity="0.6" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id={`${id}-b`}
          x1="0"
          y1="240"
          x2="340"
          y2="0"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0.1" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.42" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="0.85" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${id}-g`} cx="70" cy="40" r="120" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#fff" stopOpacity="0.07" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="340" height="240" fill={`url(#${id}-g)`} />
      <path
        d="M9 230 V98 Q9 86 18 78 L80 21 Q89 13 102 13 H340"
        stroke={`url(#${id}-a)`}
        strokeWidth="1.25"
      />
      <path
        d="M19 210 V104 Q19 94 27 87 L86 33 Q94 25 106 25 H300"
        stroke={`url(#${id}-b)`}
        strokeWidth="1"
      />
    </svg>
  );
}

export function PilaresSection() {
  // O índice fica guardado ao fechar, para o conteúdo não sumir durante a animação.
  const [indice, setIndice] = useState(0);
  const [aberto, setAberto] = useState(false);
  const pilar = PILARES[indice];

  // Fecha o modal e só depois rola, para a página já estar destravada.
  function irPara(hash: string) {
    setAberto(false);
    setTimeout(() => document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" }), 250);
  }

  return (
    <section id="pilares" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-28 pt-8 sm:px-6">
      <Eyebrow>Pilares</Eyebrow>
      <h2 className="luz-passando mt-6 w-fit max-w-3xl text-4xl leading-tight sm:text-5xl">
        Os pilares da <em className="text-chrome">qualidade de software</em>
      </h2>

      <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PILARES.map((p, i) => (
          <li key={p.title} className={i === 0 ? "sm:col-span-2" : ""}>
            <button
              type="button"
              onClick={() => {
                setIndice(i);
                setAberto(true);
              }}
              className="card-chrome group relative flex h-full w-full flex-col overflow-hidden rounded-2xl px-8 pb-7 pt-28 text-left transition-[transform,box-shadow] duration-300 hover:-translate-y-1"
            >
              <div className="sheen-hover absolute inset-0" />
              <CantoChanfrado />
              <p.icon className="absolute right-7 top-7 h-7 w-7 text-silver" strokeWidth={1.25} />
              <h3 className={`font-medium ${i === 0 ? "text-2xl" : "text-xl"}`}>{p.title}</h3>
              <p className="mt-2 font-light leading-relaxed text-muted-foreground">{p.summary}</p>
              <span className="mt-auto flex items-center gap-1.5 pt-6 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-foreground">
                Ver detalhes{" "}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <DialogPrimitive.Root open={aberto} onOpenChange={setAberto}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="card-chrome fixed left-1/2 top-1/2 z-50 max-h-[88vh] w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl p-7 shadow-[0_40px_120px_-30px_rgba(200,210,225,0.35)] duration-300 focus:outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:p-10">
            <>
              <div className="flex items-start justify-between gap-6">
                <pilar.icon className="h-8 w-8 text-silver" strokeWidth={1.25} />
                <DialogPrimitive.Close className="rounded-full border border-white/15 p-2 text-muted-foreground transition-colors hover:border-white/40 hover:text-foreground">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Fechar</span>
                </DialogPrimitive.Close>
              </div>

              <DialogPrimitive.Title className="mt-6 font-serif text-4xl leading-tight">
                {pilar.title}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-4 font-light leading-relaxed text-muted-foreground sm:text-lg">
                {pilar.description}
              </DialogPrimitive.Description>

              <ul className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2">
                {pilar.topics.map((t) => (
                  <li key={t.name} className="quadro-aco p-5">
                    <h4 className="text-sm font-medium uppercase tracking-[0.15em]">{t.name}</h4>
                    <p className="mt-2 text-sm font-light leading-relaxed text-muted-foreground">
                      {t.text}
                    </p>
                  </li>
                ))}
              </ul>

              {pilar.tools && (
                <div className="mt-8">
                  <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                    Ferramentas
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {pilar.tools.map((t) => (
                      <li
                        key={t}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1 text-xs text-muted-foreground"
                      >
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {pilar.more && (
                <button
                  type="button"
                  onClick={() => irPara(pilar.more!)}
                  className="btn-steel-dark mt-10 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium"
                >
                  Ver no método <ArrowUpRight className="h-4 w-4" />
                </button>
              )}
            </>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </section>
  );
}
