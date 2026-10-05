import type { ReactNode } from "react";
import { ButtonLeaves } from "@/components/decorative/ButtonLeaves";
import { WHATSAPP_URL } from "@/lib/site";

/** Botão de chamada para o WhatsApp. `href` permite uma mensagem própria por página. */
export function CTAButton({
  children,
  variant = "primary",
  className = "",
  ariaLabel,
  href = WHATSAPP_URL,
}: {
  children: ReactNode;
  variant?: "primary" | "outline" | "whatsapp" | "light";
  className?: string;
  ariaLabel?: string;
  href?: string;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-base font-medium transition-all min-h-[44px] active:scale-[0.98] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";
  const styles = {
    primary:
      "bg-primary text-primary-foreground hover:bg-primary/90 shadow-soft hover:-translate-y-0.5",
    whatsapp:
      "group/cta relative overflow-hidden bg-whatsapp text-whatsapp-foreground hover:bg-olive shadow-soft hover:-translate-y-0.5 duration-500 ease-out",
    outline:
      "border border-primary/30 text-primary hover:bg-primary-soft/50",
    light:
      "bg-card text-foreground hover:bg-card/90 shadow-soft hover:-translate-y-0.5 border border-border/60",
  };
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {variant === "whatsapp" ? (
        <>
          <ButtonLeaves />
          <span className="relative inline-flex items-center justify-center gap-2">{children}</span>
        </>
      ) : (
        children
      )}
    </a>
  );
}
