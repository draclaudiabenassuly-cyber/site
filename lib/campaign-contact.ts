const configuredNumber = process.env.NEXT_PUBLIC_CAMPAIGN_WHATSAPP_NUMBER ?? "";

export const CAMPAIGN_WHATSAPP_NUMBER = configuredNumber.replace(/\D/g, "");

export const whatsappMessages = {
  campaign: "Olá Cláudia Benassuly, quero conhecer a campanha.",
  more: "Olá Cláudia Benassuly, quero saber mais sobre a campanha.",
  commitment: "Olá Cláudia Benassuly, quero saber mais sobre este compromisso.",
};

export function campaignWhatsAppLink(message: string, number = CAMPAIGN_WHATSAPP_NUMBER) {
  const normalizedNumber = number.replace(/\D/g, "");
  const query = encodeURIComponent(message);
  return normalizedNumber
    ? `https://wa.me/${normalizedNumber}?text=${query}`
    : `https://wa.me/?text=${query}`;
}
