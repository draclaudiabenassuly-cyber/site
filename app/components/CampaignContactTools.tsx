"use client";

import { FormEvent, useState } from "react";
import type { AssistantFaq, SiteContent } from "../../lib/cms-defaults";
import { campaignWhatsAppLink, whatsappMessages } from "../../lib/campaign-contact";

type ChatMessage = { from: "bot" | "user"; text: string };

const closing = "Se quiser, fale com a equipe pelo WhatsApp para receber mais detalhes.";

function normalize(value: string) {
  return value.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function ChatIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5Z" /><path d="M8.5 10.2c.6 1.6 1.7 2.7 3.3 3.3l1.1-1.1c.2-.2.5-.3.8-.1l1.5.7c.3.1.4.4.3.7-.2.8-.9 1.4-1.7 1.4-3.7-.2-6.3-2.8-6.5-6.5 0-.8.6-1.5 1.4-1.7.3-.1.6 0 .7.3l.7 1.5c.1.3.1.6-.1.8l-1.5.7Z" /></svg>;
}

function SparkIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7L12 2Zm7 14 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z" /></svg>;
}

function ArrowUpRight() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8" /></svg>;
}

function answerFor(question: string, content: SiteContent) {
  const value = normalize(question);
  let custom: AssistantFaq[] = [];
  try {
    const parsed = JSON.parse(content.assistantFaqJson || "[]") as unknown;
    if (Array.isArray(parsed)) custom = parsed.filter((item): item is AssistantFaq => Boolean(item && typeof item === "object" && (item as AssistantFaq).active && typeof (item as AssistantFaq).answer === "string" && Array.isArray((item as AssistantFaq).keys)));
  } catch { /* built-in answers remain available when the CMS field is invalid */ }
  const customAnswer = custom.find((item) => item.keys.some((key) => value.includes(normalize(key))))?.answer;
  if (customAnswer) return customAnswer;
  const answers = [
    { keys: ["numero", "votar", "voto", "2323"], answer: `Cláudia Benassuly concorre ao cargo de Deputada Federal pelo Cidadania. O número informado para a campanha é ${content.candidateNumber}.` },
    { keys: ["proposta", "propostas", "prioridade", "projeto"], answer: `As prioridades estão organizadas em quatro frentes: ${content.proposalsTitle}, ${content.agendaTitle}, saúde integral da mulher e participação com inclusão social.` },
    { keys: ["agenda", "evento", "encontro", "quando", "onde"], answer: "A agenda pública está na página Compromissos e é atualizada pela equipe sempre que novos encontros são confirmados." },
    { keys: ["historia", "quem e a claudia", "sobre a claudia"], answer: content.storyLead },
    { keys: ["galeria", "foto", "fotos", "imagem"], answer: "A Galeria reúne registros da campanha. Toque em um registro para abrir a imagem e use os filtros para escolher um álbum." },
    { keys: ["noticia", "noticias", "artigo"], answer: "Na página Notícias, toque em qualquer card para abrir o conteúdo completo." },
    { keys: ["santinho", "2323"], answer: `O santinho digital apresenta a candidatura e o número ${content.candidateNumber}. Ele pode ser compartilhado ou salvo para impressão em formato horizontal.` },
    { keys: ["whatsapp", "falar", "contato", "equipe"], answer: "Use o botão verde de WhatsApp para abrir uma conversa já com a mensagem da campanha." },
  ];
  return answers.find((item) => item.keys.some((key) => value.includes(normalize(key))))?.answer
    ?? "Posso ajudar com a história, propostas, agenda, notícias, galeria, santinho e formas de participar.";
}

export default function CampaignContactTools({ content }: { content: SiteContent }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { from: "bot", text: `Olá! Eu sou a Cláudia Digital. Posso explicar a campanha e suas páginas. ${closing}` },
  ]);

  function sendChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = chatInput.trim();
    if (!question) return;
    setChatMessages((current) => [...current, { from: "user", text: question }, { from: "bot", text: `${answerFor(question, content)}\n\n${closing}` }]);
    setChatInput("");
  }

  return <>
    <a className="whatsapp-float" href={campaignWhatsAppLink(content.whatsappMessageCampaign || whatsappMessages.campaign, content.whatsappNumber)} target="_blank" rel="noreferrer" aria-label={content.whatsappButtonLabel || "Falar com a campanha pelo WhatsApp"}><ChatIcon /><span>{content.whatsappButtonLabel || "Fale com a campanha"}</span></a>
    <button type="button" className="chat-float" onClick={() => setChatOpen((value) => !value)} aria-expanded={chatOpen} aria-label="Abrir Cláudia Digital"><span className="chat-pulse" /><ChatIcon /></button>
    {chatOpen && <div className="chat-panel" role="dialog" aria-label="Cláudia Digital"><div className="chat-head"><div className="bot-avatar"><SparkIcon /></div><div><strong>Cláudia Digital</strong><span>Assistente da campanha · online</span></div><button type="button" onClick={() => setChatOpen(false)} aria-label="Fechar assistente">×</button></div><div className="chat-body">{chatMessages.map((message, index) => <div className={`chat-message ${message.from}`} key={`${message.text}-${index}`}>{message.text}</div>)}</div><form className="chat-form" onSubmit={sendChat}><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Pergunte sobre a campanha" aria-label="Pergunte sobre a campanha" /><button type="submit" aria-label="Enviar pergunta"><ArrowUpRight /></button></form><div className="chat-note">Respostas baseadas no material oficial da campanha.</div></div>}
  </>;
}
