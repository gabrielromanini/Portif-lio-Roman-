import { Mail } from "lucide-react";
import logoColorido from "@/assets/logo-colorido.png";
import logoBranco from "@/assets/logo-branco.png";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { openConsentPreferences } from "@/lib/consent";
import { INSTAGRAM_LABEL, INSTAGRAM_URL, WHATSAPP_URL } from "@/lib/site";

/**
 * Rodapé do site. `tone="dark"` é a versão escura (logo branco, texto creme),
 * usada na página de ansiedade, onde o fundo desce até quase preto; o fundo
 * vem por `style`. Sem `tone`, é o rodapé claro de sempre (home).
 */
export function Footer({
  whatsappHref = WHATSAPP_URL,
  tone = "light",
  style,
}: {
  whatsappHref?: string;
  tone?: "light" | "dark";
  style?: React.CSSProperties;
}) {
  const dark = tone === "dark";
  // Classes que mudam entre as versões clara e escura.
  const t = dark
    ? {
        footer: "py-12 text-[#F5EFE6]",
        muted: "text-[#F5EFE6]/80",
        strong: "text-[#F5EFE6]",
        link: "text-[#F5EFE6]/80 transition-colors hover:text-white",
        border: "border-[#F5EFE6]/15",
      }
    : {
        footer: "border-t border-border bg-card py-12",
        muted: "text-muted-foreground",
        strong: "text-foreground",
        link: "text-muted-foreground transition-colors hover:text-primary",
        border: "border-border",
      };
  return (
    <footer id="contato" className={t.footer} style={style}>
      <div className="mx-auto grid max-w-6xl gap-8 px-4 md:grid-cols-3 md:px-6">
        <div>
          <img src={dark ? logoBranco : logoColorido} alt="Yole Lopes — Psicóloga Online" className="h-16 w-auto" />
          <p className={`mt-3 text-sm ${t.muted}`}>Yole Lopes Cortinhas | Psicóloga | CRP 08/34622</p>
          <p className={`mt-1 text-sm ${t.muted}`}>Atendimento psicológico online</p>
        </div>
        <div className="space-y-2 text-sm">
          <p className={`font-semibold ${t.strong}`}>Contato</p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 ${t.link}`}
          >
            <WhatsAppIcon className="text-whatsapp" /> WhatsApp: (41) 98896-4592
          </a>
          <a
            href="mailto:yolepsico@gmail.com"
            className={`flex items-center gap-2 ${t.link}`}
          >
            <Mail className="h-4 w-4" /> yolepsico@gmail.com
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${INSTAGRAM_LABEL} (@yolepsico)`}
            className={`flex items-center gap-2 ${t.link} max-md:min-h-11`}
          >
            <InstagramIcon /> @yolepsico
          </a>
        </div>
        <div className="space-y-2 text-sm">
          <p className={`font-semibold ${t.strong}`}>Navegação</p>
          <ul className={`space-y-1.5 ${t.muted}`}>
            <li><a href="/#inicio" className={dark ? "hover:text-white" : "hover:text-primary"}>Início</a></li>
            <li><a href="/ansiedade" className={dark ? "hover:text-white" : "hover:text-primary"}>Ansiedade</a></li>
            <li><a href="/#como-funciona" className={dark ? "hover:text-white" : "hover:text-primary"}>Como funciona</a></li>
            <li><a href="/#sobre" className={dark ? "hover:text-white" : "hover:text-primary"}>Sobre</a></li>
            <li><a href="/#duvidas" className={dark ? "hover:text-white" : "hover:text-primary"}>Dúvidas</a></li>
            <li><a href="#privacidade" className={dark ? "hover:text-white" : "hover:text-primary"}>Política de privacidade</a></li>
            <li><a href="#termos" className={dark ? "hover:text-white" : "hover:text-primary"}>Termos de uso</a></li>
            <li>
              <button
                type="button"
                onClick={() => openConsentPreferences()}
                className={`text-left ${dark ? "hover:text-white" : "hover:text-primary"}`}
              >
                Gerenciar cookies
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className={`mx-auto mt-10 max-w-6xl space-y-6 border-t px-4 pt-8 text-xs leading-relaxed md:px-6 ${t.border} ${t.muted}`}>
        <div id="privacidade">
          <p className={`mb-1 text-sm font-semibold ${t.strong}`}>Política de privacidade</p>
          <p>
            Os dados que você compartilha por WhatsApp, e-mail ou nas sessões são tratados com total sigilo profissional, conforme o Código de Ética do Psicólogo (CFP) e a Lei Geral de Proteção de Dados (LGPD). As informações são utilizadas apenas para o seu acompanhamento terapêutico e não são compartilhadas com terceiros sem autorização.
          </p>
          <p className="mt-2">
            Este site utiliza cookies e o Google Tag Manager para medir audiência e, mediante seu consentimento, para fins de análise e marketing. Por envolver um contexto de saúde mental, cookies de análise e marketing só são ativados após sua autorização explícita no banner de cookies, podendo ser alterada a qualquer momento em "Gerenciar cookies", no rodapé do site. Cookies estritamente necessários ao funcionamento do site não dependem de consentimento.
          </p>
        </div>
        <div id="termos">
          <p className={`mb-1 text-sm font-semibold ${t.strong}`}>Termos de uso</p>
          <p>
            Este site tem caráter informativo. As informações apresentadas não substituem uma avaliação psicológica individualizada. O atendimento psicológico é particular, realizado de forma online e mediante agendamento prévio pelo WhatsApp.
          </p>
        </div>
        <p>
          © {new Date().getFullYear()} Yole Lopes Cortinhas Vital. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
