// Dados de contato e links usados em todas as páginas do site.

const WHATSAPP_NUMBER = "5541988964592";

/** Link do WhatsApp com mensagem pronta (cada página pode ter a sua). */
export function whatsappUrl(message: string) {
  // Codifica também ! ' ( ) * (encodeURIComponent deixa passar), para o link
  // ficar idêntico ao que sempre esteve no ar.
  const text = encodeURIComponent(message).replace(
    /[!'()*]/g,
    (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}

export const WHATSAPP_URL = whatsappUrl(
  "Olá, Yole! Vim pelo site e gostaria de agendar uma conversa gratuita.",
);

export const SITE_URL = "https://psicologayole.com.br";
export const INSTAGRAM_URL = "https://www.instagram.com/yolepsico/";
export const INSTAGRAM_LABEL = "Instagram da psicóloga Yole Lopes";

// Altura fixa do header: o primeiro bloco da página sobe exatamente isso
// (UNDER_HEADER) para ficar por baixo dele, e o fundo continua até o topo.
// Se mudar uma, mude a outra.
export const HEADER_H = "h-[72px] md:h-20";
export const UNDER_HEADER = "-mt-[72px] pt-[72px] md:-mt-20 md:pt-20";
