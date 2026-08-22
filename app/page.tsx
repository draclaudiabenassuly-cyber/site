"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import VlibrasWidget from "./components/VlibrasWidget";
import { defaultContent, type SiteContent } from "../lib/cms-defaults";

type AgendaItem = {
  id?: string;
  date: string;
  day: string;
  month: string;
  title: string;
  location: string;
  detail: string;
  tone: "teal" | "blue" | "gold";
};

type Post = {
  id?: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  image: string;
};

const whatsappLink =
  "https://wa.me/?text=Ol%C3%A1%20Claudia%20Benassuly%2C%20quero%20conhecer%20a%20campanha.";

const socialLinks = [
  {
    label: "Instagram da Claudia Benassuly",
    handle: "@claudiabenassuly",
    icon: "instagram",
    href: "https://www.instagram.com/claudiabenassuly?igsh=b3R4Z3ZqZzRyNjk1&igsi=b3R4Z3ZqZzRyNjk1",
  },
  {
    label: "Instagram do Cidadania Pará",
    handle: "@cidadania23para",
    icon: "instagram",
    href: "https://www.instagram.com/cidadania23para?igsh=MTI4aWQ3NzNiOTJ1cA==&igsi=MTI4aWQ3NzNiOTJ1cA==",
  },
  {
    label: "TikTok da Claudia Benassuly",
    handle: "@claudiabenassuly",
    icon: "tiktok",
    href: "https://www.tiktok.com/@claudiabenassuly?_r=1&_t=ZS-98xyNVe9sbk",
  },
];

const agenda: AgendaItem[] = [
  {
    date: "22 ago 2026",
    day: "22",
    month: "AGO",
    title: "Escuta com mulheres empreendedoras",
    location: "Ananindeua · Pará",
    detail: "Roda de conversa sobre crédito, autonomia e oportunidades para quem empreende.",
    tone: "teal",
  },
  {
    date: "29 ago 2026",
    day: "29",
    month: "AGO",
    title: "Encontro de lideranças femininas",
    location: "Belém · Pará",
    detail: "Uma conversa aberta sobre segurança, participação política e futuro.",
    tone: "blue",
  },
  {
    date: "05 set 2026",
    day: "05",
    month: "SET",
    title: "Café com a comunidade",
    location: "Região Metropolitana de Belém",
    detail: "A campanha vai até as pessoas para ouvir o que realmente precisa mudar.",
    tone: "gold",
  },
];

const posts: Post[] = [
  {
    category: "Autonomia econômica",
    title: "Creche em tempo integral também é liberdade para trabalhar",
    excerpt:
      "Quando uma mãe tem onde deixar seu filho com segurança, ela ganha tempo, renda e tranquilidade para construir seus planos.",
    readTime: "4 min de leitura",
    image: "/campaign/claudia-hero.jpeg",
  },
  {
    category: "Segurança e justiça",
    title: "Pensão alimentícia no bolso, sem enrolação",
    excerpt:
      "A defesa de mecanismos mais rápidos e digitais para garantir o direito de crianças e mães precisa sair do discurso.",
    readTime: "3 min de leitura",
    image: "/campaign/logo-transparent-footer.png",
  },
  {
    category: "Saúde da mulher",
    title: "Exame preventivo não pode esperar meses",
    excerpt:
      "A saúde da mulher merece prevenção, diagnóstico rápido e acolhimento em todas as fases da vida.",
    readTime: "5 min de leitura",
    image: "/campaign/logo-transparent-color.png",
  },
];

const axes = [
  {
    number: "01",
    title: "Autonomia econômica",
    copy: "Creches, crédito, inclusão digital e oportunidades para que cada mulher possa escolher o próprio caminho.",
    tag: "Trabalho & renda",
    icon: "columns",
  },
  {
    number: "02",
    title: "Segurança e justiça",
    copy: "Mais orçamento para proteger mulheres, combater a violência e fazer a justiça chegar mais rápido.",
    tag: "Proteção real",
    icon: "scales",
  },
  {
    number: "03",
    title: "Saúde integral",
    copy: "Prevenção, atendimento humanizado, saúde mental e cuidado para todas as fases da vida.",
    tag: "SUS que acolhe",
    icon: "health",
  },
  {
    number: "04",
    title: "Participação e inclusão",
    copy: "A política precisa refletir a vida de mulheres periféricas, negras, indígenas, ribeirinhas e rurais.",
    tag: "Voz & presença",
    icon: "ballot",
  },
];

const assistantClosing =
  "Se você deseja mais detalhes, entre em contato pelo WhatsApp aqui no site. Nossa equipe terá prazer em fornecer todas as informações mais completas e tirar suas dúvidas!";

const faq = [
  {
    keys: ["número", "numero", "votar", "23", "voto"],
    answer:
      "Claudia Benassuly concorre ao cargo de Deputada Federal pelo Cidadania. O número informado para a campanha é 2323.",
  },
  {
    keys: ["proposta", "pauta", "projeto", "defende", "prioridade"],
    answer:
      "As prioridades estão organizadas em quatro frentes: autonomia econômica, segurança e justiça, saúde integral da mulher e participação política com inclusão social.",
  },
  {
    keys: ["agenda", "evento", "encontro", "onde", "quando"],
    answer:
      "A agenda pública aparece na seção Compromissos. Ela será atualizada pela equipe sempre que novos encontros forem confirmados.",
  },
  {
    keys: ["whatsapp", "falar", "contato", "equipe"],
    answer:
      "Você pode falar com a campanha pelo botão de WhatsApp. A equipe recebe sugestões, dúvidas e pedidos de participação.",
  },
];

const assistantKnowledge = [
  ...faq,
  {
    keys: ["partido", "cidadania", "legenda"],
    answer:
      "Claudia Benassuly é pré-candidata pelo Cidadania, partido identificado pelo número 23. A campanha destaca a legenda e sua identidade de participação democrática. O número da candidata é 2323.",
  },
  {
    keys: ["aliados", "partidos aliados", "coligação", "coligacao", "federação", "federacao"],
    answer:
      "A coligação informada pela campanha apresenta Hanna 15 para Governador, Helder 151 para Senador, Antônia Brito 23334 para Deputado Estadual e Claudia Benassuly 2323 para Deputada Federal.",
  },
  {
    keys: ["quem é a claudia", "quem e a claudia", "história da claudia", "historia da claudia", "sobre a claudia"],
    answer:
      "Claudia Benassuly é uma mulher da vida real que coloca seu nome à disposição para levar ao Congresso a voz de quem cuida, trabalha, empreende e enfrenta os desafios do dia a dia. A pré-candidatura nasce da escuta e do compromisso com as mulheres do Pará.",
  },
  {
    keys: ["eixos", "quatro frentes", "prioridades da campanha", "propostas da campanha", "projetos da campanha"],
    answer:
      "O projeto está organizado em quatro frentes: autonomia econômica, empreendedorismo e cuidado; segurança, justiça e enfrentamento à violência; saúde integral da mulher e direitos reprodutivos; e participação política com inclusão social.",
  },
  {
    keys: ["creche", "creches", "tempo integral", "trabalhar em paz"],
    answer:
      "Claudia defende creches públicas em tempo integral, articuladas também por meio de emendas parlamentares. A proposta é garantir que mães tenham segurança para trabalhar, estudar e empreender, com seus filhos bem cuidados.",
  },
  {
    keys: ["empreendedora", "empreendedorismo", "crédito para mulher", "credito para mulher", "negócio de mulher", "negocio de mulher"],
    answer:
      "A campanha propõe linhas de crédito simplificadas e subsidiadas, em parceria com Caixa e Banco do Brasil, além de incentivo fiscal para empresas que adotem horários flexíveis para mães e cuidadoras. Também defende formação técnica e inclusão digital para empreendedoras das periferias e do interior.",
  },
  {
    keys: ["mãe atípica", "mae atipica", "mães de crianças", "maes de criancas", "neurodivergente", "deficiência", "deficiencia"],
    answer:
      "Claudia defende programas de apoio financeiro, psicológico e social para mães de crianças neurodivergentes ou com deficiência, reconhecendo a sobrecarga do cuidado e a necessidade de uma rede pública de apoio.",
  },
  {
    keys: ["igualdade salarial", "salário igual", "salario igual", "mercado de trabalho", "trabalho igual"],
    answer:
      "A campanha defende igualdade no mercado de trabalho e o cumprimento efetivo da remuneração igual para trabalho de igual valor, com fiscalização e responsabilidade para quem descumprir a regra.",
  },
  {
    keys: ["violência contra a mulher", "violencia contra a mulher", "segurança", "seguranca", "proteção", "protecao"],
    answer:
      "Na frente de segurança e justiça, Claudia defende mais orçamento para a proteção das mulheres, fortalecimento da rede de atendimento e políticas que façam a segurança chegar de verdade a quem precisa.",
  },
  {
    keys: ["orçamento mulher", "orcamento mulher", "casa da mulher", "casas da mulher", "deam", "delegacia da mulher"],
    answer:
      "A proposta é fortalecer o Orçamento Mulher, ampliar as Casas da Mulher Brasileira, apoiar Delegacias Especializadas de Atendimento à Mulher funcionando 24 horas e garantir centros de referência com atendimento acolhedor.",
  },
  {
    keys: ["pensão", "pensao", "pensão alimentícia", "pensao alimenticia", "alimentos", "filho sem pensão"],
    answer:
      "Claudia defende mecanismos mais rápidos e digitais para cobrar pensão alimentícia, inclusive com medidas que ajudem a identificar patrimônio escondido quando houver indícios de ocultação de bens. A ideia é fazer o direito chegar ao bolso de quem precisa, sem enrolação.",
  },
  {
    keys: ["violência digital", "violencia digital", "deepfake", "nudes", "imagem íntima", "imagem intima", "misoginia"],
    answer:
      "A campanha quer enfrentar a violência digital, a misoginia, o vazamento de imagens íntimas, os nudes e deepfakes não consentidos, além do assédio sistemático nas redes. O ambiente digital também precisa ser seguro e responsabilizar quem agride.",
  },
  {
    keys: ["saúde da mulher", "saude da mulher", "sus", "exame", "mamografia", "papanicolau", "preventivo", "ultrassom"],
    answer:
      "Na saúde, Claudia defende reduzir a espera e garantir mamografia, exame preventivo, ultrassons e outros cuidados pelo SUS. A prevenção precisa acontecer no tempo certo, sem que mulheres esperem meses por um diagnóstico.",
  },
  {
    keys: ["endometriose", "menopausa", "climatério", "climaterio"],
    answer:
      "A proposta inclui ampliar o diagnóstico e o tratamento da endometriose e fortalecer o cuidado com a saúde da mulher na menopausa e no climatério, fases que ainda recebem pouca atenção nas políticas públicas.",
  },
  {
    keys: ["violência obstétrica", "violencia obstetrica", "parto", "doulas", "equipe multidisciplinar"],
    answer:
      "Claudia defende o enfrentamento e a tipificação da violência obstétrica, a regulamentação da atuação de doulas e a presença de equipes multidisciplinares na rede pública, com parto seguro e respeito às escolhas e aos direitos das mulheres.",
  },
  {
    keys: ["pós-parto", "pos-parto", "pos parto", "saúde mental", "saude mental", "psicológico", "psicologico"],
    answer:
      "A campanha propõe apoio psicológico no pós-parto e atenção em saúde mental para mulheres em situação de vulnerabilidade. Cuidar de quem cuida também é uma responsabilidade pública.",
  },
  {
    keys: ["violência política", "violencia politica", "participação política", "participacao politica", "mulher na política", "mulher na politica"],
    answer:
      "Claudia defende o combate à violência política de gênero, com punição firme para ataques, agressões e tentativas de silenciar mulheres que ocupam espaços de poder. A democracia precisa da presença e da voz das mulheres.",
  },
  {
    keys: ["periférica", "periferica", "negra", "indígena", "indigena", "ribeirinha", "rural", "lbt"],
    answer:
      "A proposta de inclusão olha para mulheres periféricas, negras, indígenas, ribeirinhas, rurais e LBT. Cada território tem desafios próprios e precisa ser considerado na formulação das políticas públicas.",
  },
  {
    keys: ["participar", "voluntário", "voluntario", "apoiar", "fazer parte", "colaborar"],
    answer:
      "Você pode participar acompanhando a agenda, compartilhando as propostas, enviando sugestões, cadastrando seu e-mail no site ou falando com a equipe pelo WhatsApp. A campanha é construída com escuta e presença.",
  },
  {
    keys: ["conteúdo", "conteudo", "semana", "segunda", "terça", "terca", "quarta", "quinta", "sexta", "sábado", "sabado", "domingo"],
    answer:
      "O plano de conteúdo da campanha organiza a conversa ao longo da semana: autonomia econômica na segunda; histórias e escuta na terça; segurança e direitos na quarta; saúde da mulher na quinta; bastidores e participação na sexta; respostas às dúvidas no sábado; e inspiração e família no domingo.",
  },
];

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 15 15 5M7 5h8v8" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="m16 2 2.8 10.2L29 16l-10.2 3.8L16 30l-3.8-10.2L2 16l10.2-3.8L16 2Z" />
    </svg>
  );
}

function PolicyIcon({ type }: { type: string }) {
  if (type === "scales") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M4 7h24M16 7v19M11 27h10M8 7 3.5 16a4.5 4.5 0 0 0 9 0L8 7ZM24 7l-4.5 9a4.5 4.5 0 0 0 9 0L24 7Z" />
      </svg>
    );
  }
  if (type === "health") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="12" />
        <path d="M16 9v14M9 16h14" />
      </svg>
    );
  }
  if (type === "ballot") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 8h20v19H6zM10 13h12M10 18h12M10 23h7M9 5h14" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="m3 10 13-6 13 6M6 12v12M12 12v12M20 12v12M26 12v12M3 27h26M4 10h24" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 11.2a7.4 7.4 0 0 1-8 7.3 8.2 8.2 0 0 1-3.2-.7L4 19l1.4-3.8a7.1 7.1 0 0 1-1.3-4c0-4 3.5-7.2 7.9-7.2S20 7.2 20 11.2Z" />
      <path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.8" r="1" className="instagram-dot" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg className="tiktok-mark" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14.9 3.2c.5 2.5 1.9 4 4.6 4.2v3.2a7.1 7.1 0 0 1-4.5-1.4v5.4c0 3.7-2.4 6.1-5.8 6.1-3.2 0-5.5-2.1-5.5-5 0-3.2 2.6-5.6 6-5.6.5 0 .9.1 1.4.2v3.3a3.8 3.8 0 0 0-1.3-.2c-1.7 0-2.8.9-2.8 2.2 0 1.2.9 2 2.1 2 1.4 0 2.4-1 2.4-2.7V3.2h3.4Z" />
    </svg>
  );
}

export default function Home() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [activePost, setActivePost] = useState<Post | null>(null);
  const [activePhoto, setActivePhoto] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      from: "bot",
      text: `Olá! Eu sou a Claudia Digital. Posso explicar a história da Claudia, os projetos da campanha, os quatro eixos de propostas, a agenda e as formas de participar. ${assistantClosing}`,
    },
  ]);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSent, setNewsletterSent] = useState(false);
  const [editorMode, setEditorMode] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultContent);
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>(agenda);
  const [newsItems, setNewsItems] = useState<Post[]>(posts);

  useEffect(() => {
    fetch("/api/cms")
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => {
        if (!payload) return;
        if (payload.content) setSiteContent({ ...defaultContent, ...payload.content });
        if (Array.isArray(payload.agenda)) setAgendaItems(payload.agenda);
        if (Array.isArray(payload.news)) setNewsItems(payload.news);
      })
      .catch(() => undefined);
  }, []);

  const gallery = useMemo(
    () => [
      { src: siteContent.galleryImage1, label: "Apresentação da pré-candidatura", span: "wide" },
      { src: siteContent.galleryImage2, label: "Identidade visual oficial", span: "square" },
      { src: siteContent.galleryImage3, label: "Por ela. Por nós. Por todas.", span: "tall" },
      { src: siteContent.galleryImage4, label: "Aplicação para materiais claros", span: "square" },
      { src: siteContent.galleryImage5, label: "Versão com slogan", span: "wide" },
    ],
    [siteContent.galleryImage1, siteContent.galleryImage2, siteContent.galleryImage3, siteContent.galleryImage4, siteContent.galleryImage5],
  );

  function scrollTo(id: string) {
    setMobileMenu(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function sendChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const question = chatInput.trim();
    if (!question) return;
    const normalized = question
      .toLocaleLowerCase("pt-BR")
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
    const coalitionAnswer = {
      keys: ["coligação", "coligacao", "aliados", "governador", "senador", "antônia brito", "antonia brito"],
      answer: `${siteContent.coalitionName}: ${siteContent.coalitionParties}. Os nomes e números informados são ${siteContent.coalitionGovernorName} ${siteContent.coalitionGovernorNumber} para Governador, ${siteContent.coalitionSenatorName} ${siteContent.coalitionSenatorNumber} para Senador, ${siteContent.coalitionStateDeputyName} ${siteContent.coalitionStateDeputyNumber} para Deputado Estadual e ${siteContent.coalitionFederalDeputyName} ${siteContent.coalitionFederalDeputyNumber} para Deputada Federal.`,
    };
    const match = [coalitionAnswer, ...assistantKnowledge].find((item) =>
      item.keys.some((key) => {
        const normalizedKey = key
          .toLocaleLowerCase("pt-BR")
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "");
        return normalized.includes(normalizedKey);
      }),
    );
    const answer = `${
      match?.answer ??
      "Posso ajudar com os projetos, propostas, prioridades, agenda, história da Claudia, formas de participação e contato com a equipe. Ainda não encontrei uma resposta específica para essa pergunta no material oficial da campanha."
    }\n\n${assistantClosing}`;
    setChatMessages((current) => [
      ...current,
      { from: "user", text: question },
      { from: "bot", text: answer },
    ]);
    setChatInput("");
  }

  function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSent(true);
    setNewsletterEmail("");
  }

  return (
    <main className="campaign-shell">
      <div className="top-ribbon">
        <span className="ribbon-dot" />
        <span className="ribbon-label">Pré-candidata a Deputada Federal</span>
        <span className="ribbon-party">{siteContent.partyName}</span>
        <span className="ribbon-line" />
        <strong>{siteContent.candidateNumber}</strong>
        <span className="ribbon-end">{siteContent.partyName} 23</span>
      </div>

      <header className="site-header">
        <button className="brand-lockup" onClick={() => scrollTo("inicio")} aria-label="Voltar para o início">
          <img src={siteContent.siteHeaderLogo} alt="Claudia Benassuly" />
        </button>
        <nav className={mobileMenu ? "main-nav open" : "main-nav"} aria-label="Navegação principal">
          <button onClick={() => scrollTo("historia")}>A história</button>
          <button onClick={() => scrollTo("propostas")}>Propostas</button>
          <button onClick={() => scrollTo("compromissos")}>Compromissos</button>
          <button onClick={() => scrollTo("noticias")}>Notícias</button>
          <button onClick={() => scrollTo("galeria")}>Galeria</button>
          <a href="/santinho">Santinho digital</a>
          <a className="nav-contact" href={whatsappLink} target="_blank" rel="noreferrer">
            Fale com a campanha <ArrowUpRight />
          </a>
        </nav>
        <button className="mobile-menu" onClick={() => setMobileMenu((value) => !value)} aria-label="Abrir menu">
          <MenuIcon />
        </button>
      </header>

      <section id="inicio" className="hero-section">
        <div className="hero-gridline gridline-one" />
        <div className="hero-gridline gridline-two" />
        <div className="hero-copy">
          <p className="eyebrow"><span /> {siteContent.heroEyebrow}</p>
          <h1>
            {siteContent.heroTitle}
            <em>{siteContent.heroTitleEm}</em>
            <span>{siteContent.heroSubline}</span>
          </h1>
          <p className="hero-lede">
            {siteContent.heroLede}
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => scrollTo("propostas")}>
              Conheça as propostas <ArrowUpRight />
            </button>
            <button className="text-button" onClick={() => scrollTo("historia")}>
              Conheça Claudia <span>↓</span>
            </button>
          </div>
          <div className="hero-party-lockup"><span>Partido</span><div><img src={siteContent.partyLightLogo} alt={`${siteContent.partyName} 23`} /></div><small>número 23 · candidata {siteContent.candidateNumber}</small></div>
          <div className="hero-signature">
            <span className="signature-rule" />
            <span>{siteContent.slogan}</span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <div className="hero-photo-frame">
            <img src={siteContent.heroImage} alt="Claudia Benassuly sorrindo para a campanha" />
            <div className="photo-wash" />
          </div>
          <div className="hero-number"><small>Deputada Federal · {siteContent.partyName}</small><CandidateNumber value={siteContent.candidateNumber} /></div>
          <div className="hero-stamp"><SparkIcon /><span>presença<br />que cuida</span></div>
        </div>
        <div className="hero-scroll-note"><span /> Role para conhecer</div>
      </section>

      <section className="manifesto-strip">
        <div className="manifesto-kicker">A campanha é sobre</div>
        <div className="manifesto-words">{siteContent.manifestoWords.split("·").map((word, index) => <span key={`${word}-${index}`}>{word.trim()}</span>).flatMap((word, index, words) => index < words.length - 1 ? [word, <b key={`dot-${index}`}>·</b>] : [word])}</div>
        <div className="manifesto-mark"><SparkIcon /></div>
      </section>

      <section id="historia" className="story-section section-pad">
        <div className="section-intro">
          <p className="eyebrow"><span /> {siteContent.storyEyebrow}</p>
          <h2>{siteContent.storyTitle} <em>{siteContent.storyTitleEm}</em></h2>
        </div>
        <div className="story-layout">
          <div className="story-portrait">
            <div className="portrait-image"><img src={siteContent.storyImage} alt="Retrato de Claudia Benassuly" /></div>
            <div className="portrait-note">Uma mulher da vida real<br /><strong>pronta para fazer parte.</strong></div>
            <span className="portrait-index">01 / 04</span>
          </div>
          <div className="story-text">
            <p className="large-lede">{siteContent.storyLead}</p>
            <p>{siteContent.storyBody}</p>
            <p>É sobre transformar indignação em proposta, esperança em trabalho e presença em resultado.</p>
            <button className="outline-button" onClick={() => scrollTo("manifesto")}>Ler o manifesto completo <ArrowUpRight /></button>
          </div>
        </div>
      </section>

      <section id="manifesto" className="quote-section">
        <div className="quote-symbol">“</div>
        <blockquote>{siteContent.quote}<br /><em>{siteContent.quoteEm}</em></blockquote>
        <p>{siteContent.quoteDescription}</p>
        <div className="quote-line"><span /> <strong>Claudia Benassuly</strong> <span /></div>
      </section>

      <section id="propostas" className="axes-section section-pad">
        <div className="section-intro section-intro-wide">
          <p className="eyebrow"><span /> O que move esta candidatura</p>
          <h2>Quatro caminhos para uma política que <em>chega na vida real.</em></h2>
          <p className="intro-support">No Congresso, cada pauta precisa ter direção, orçamento e compromisso com quem mais precisa.</p>
        </div>
        <div className="axes-grid">
          {axes.map((axis) => (
            <article className="axis-card" key={axis.number}>
              <div className="axis-top"><span>{axis.number}</span><span className="axis-arrow">↗</span></div>
              <div className={`axis-icon ${axis.icon}`}><PolicyIcon type={axis.icon} /></div>
              <h3>{axis.title}</h3>
              <p>{axis.copy}</p>
              <span className="axis-tag">{axis.tag}</span>
            </article>
          ))}
        </div>
        <div className="plain-language">
          <div><span>Na linguagem técnica</span><strong>Políticas públicas com orçamento e fiscalização.</strong></div>
          <div className="plain-arrow">→</div>
          <div><span>Na linguagem da rua</span><strong>Creche para trabalhar em paz. Exame sem fila. Segurança de verdade.</strong></div>
        </div>
      </section>

      <section id="compromissos" className="agenda-section section-pad">
        <div className="agenda-heading">
          <div>
            <p className="eyebrow"><span /> Presença se faz de perto</p>
            <h2>Próximos <em>compromissos.</em></h2>
          </div>
          <p>Onde tem gente, tem escuta. Acompanhe os próximos encontros da campanha.</p>
        </div>
        <div className="agenda-list">
          {agendaItems.map((item) => (
            <article className="agenda-item" id={`event-${item.id ?? item.day}`} key={item.id ?? item.date}>
              <div className={`agenda-date ${item.tone}`}><strong>{item.day}</strong><span>{item.month}</span></div>
              <div className="agenda-details"><span>{item.date}</span><h3>{item.title}</h3><p>{item.location}</p></div>
              <p className="agenda-detail-copy">{item.detail}</p>
              <a className="agenda-action" aria-label={`Ver detalhes de ${item.title}`} href={`/agenda#event-${item.id ?? item.day}`}>Ver detalhes <ArrowUpRight /></a>
            </article>
          ))}
        </div>
        <div className="editorial-hint"><span className="live-dot" /> Agenda pública atualizada pela equipe da campanha <button onClick={() => setEditorMode(true)}>Abrir modo gestão</button></div>
      </section>

      <section id="coligacao" className="coalition-section section-pad">
        <div className="coalition-heading">
          <div>
            <p className="eyebrow"><span /> Coligação da Dra. Claudia</p>
            <p className="coalition-name">{siteContent.coalitionName}</p>
            <h2>Nomes e números para uma caminhada que <em>chega junto.</em></h2>
          </div>
          <div className="coalition-heading-note"><strong>Composição informada pela campanha</strong><p>{siteContent.coalitionParties}</p></div>
        </div>
        <div className="coalition-grid">
          <article className="coalition-card gold">
            <span>Governador</span>
            <strong>{siteContent.coalitionGovernorName}</strong>
            <b>{siteContent.coalitionGovernorNumber}</b>
          </article>
          <article className="coalition-card teal">
            <span>Senador</span>
            <strong>{siteContent.coalitionSenatorName}</strong>
            <b>{siteContent.coalitionSenatorNumber}</b>
          </article>
          <article className="coalition-card blue">
            <span>Deputado Estadual</span>
            <strong>{siteContent.coalitionStateDeputyName}</strong>
            <b>{siteContent.coalitionStateDeputyNumber}</b>
          </article>
          <article className="coalition-card navy">
            <span>Deputada Federal</span>
            <strong>{siteContent.coalitionFederalDeputyName}</strong>
            <b>{siteContent.coalitionFederalDeputyNumber}</b>
          </article>
        </div>
      </section>

      <section id="noticias" className="news-section section-pad">
        <div className="section-heading-row"><div><p className="eyebrow"><span /> Ideias em movimento</p><h2>Diário da <em>campanha.</em></h2></div><a className="outline-button small" href="/noticias">Ver todas as notícias <ArrowUpRight /></a></div>
        <div className="news-grid">
          {newsItems.map((post, index) => (
            <article className={`news-card news-${index + 1}`} key={post.id ?? post.title} onClick={() => setActivePost(post)}>
              <div className="news-image"><img src={post.image} alt="" /><span className="news-index">0{index + 1}</span><span className="news-open"><ArrowUpRight /></span></div>
              <div className="news-copy"><span>{post.category}</span><h3>{post.title}</h3><p>{post.excerpt}</p><small>{post.readTime}</small></div>
            </article>
          ))}
        </div>
      </section>

      <section id="galeria" className="gallery-section section-pad">
        <div className="section-heading-row"><div><p className="eyebrow"><span /> A campanha em movimento</p><h2>Galeria de <em>presença.</em></h2></div><p className="heading-note">Cada registro conta um pouco do caminho que estamos construindo juntas.</p></div>
        <div className="gallery-grid">
          {gallery.map((photo) => (
            <button className={`gallery-card ${photo.span}`} key={photo.src} onClick={() => setActivePhoto(photo.src)} aria-label={`Abrir foto: ${photo.label}`}>
              <img src={photo.src} alt={photo.label} /><span className="gallery-overlay"><small>{photo.label}</small><ArrowUpRight /></span>
            </button>
          ))}
        </div>
        <div className="gallery-footer"><span>Novos registros em breve</span><strong>Você também faz parte dessa história.</strong></div>
      </section>

      <section id="santinho" className="digital-card-section section-pad printable-santinho">
        <div className="digital-card-copy"><p className="eyebrow"><span /> {siteContent.santinhoEyebrow}</p><h2>{siteContent.santinhoTitle} <em>{siteContent.santinhoTitleEm}</em></h2><p>{siteContent.santinhoDescription}</p><div className="digital-actions"><a className="primary-button" href="/santinho">Abrir santinho digital <ArrowUpRight /></a><button className="text-button" onClick={() => { window.location.href = "/santinho?print=1"; }}>Salvar para imprimir <span>↓</span></button></div></div>
        <div className="digital-card-art"><div className="digital-glow" /><img src={siteContent.digitalCardLogo} alt={`Claudia Benassuly ${siteContent.candidateNumber}`} /><div className="card-chip"><SparkIcon /><span>Vote<br /><strong>{siteContent.candidateNumber}</strong></span></div></div>
      </section>

      <section className="join-section section-pad">
        <div className="join-panel"><div className="join-mark"><SparkIcon /></div><p className="eyebrow"><span /> Faça parte</p><h2>{siteContent.joinTitle} <em>{siteContent.joinTitleEm}</em></h2><p>{siteContent.joinDescription}</p><form className="join-form" onSubmit={subscribe}><input aria-label="Seu melhor e-mail" type="email" value={newsletterEmail} onChange={(event) => setNewsletterEmail(event.target.value)} placeholder="Seu melhor e-mail" required /><button className="primary-button" type="submit">Quero participar <ArrowUpRight /></button></form>{newsletterSent && <span className="form-success">Obrigada! A equipe vai manter você por perto.</span>}</div>
      </section>

      <section className="faq-section section-pad">
        <div className="faq-heading"><p className="eyebrow"><span /> Perguntas frequentes</p><h2>Transparência para <em>conversar.</em></h2></div>
        <div className="faq-list">{faq.map((item, index) => <button className={expandedFaq === index ? "faq-item active" : "faq-item"} key={item.answer} onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}><span>0{index + 1}</span><strong>{item.keys[0] === "número" ? "Qual é o número da Claudia?" : item.keys[0] === "proposta" ? "Quais são as principais propostas?" : item.keys[0] === "agenda" ? "Como acompanho a agenda?" : "Como posso falar com a campanha?"}</strong><i>{expandedFaq === index ? "−" : "+"}</i>{expandedFaq === index && <small>{item.answer}</small>}</button>)}</div>
      </section>

      <footer className="site-footer">
        <div className="footer-top"><div className="footer-brand"><img src={siteContent.siteFooterLogo} alt="Claudia Benassuly" /><p>{siteContent.slogan}</p><div className="party-footer-badge"><span>Partido</span><img src={siteContent.partyDarkLogo} alt="Cidadania 23" /></div><div className="social-links" aria-label="Redes sociais"><span>Redes oficiais</span>{socialLinks.map((social) => <a key={social.href} href={social.href} target="_blank" rel="noreferrer" aria-label={social.label}>{social.icon === "tiktok" ? <TikTokIcon /> : <InstagramIcon />}<span>{social.handle}</span></a>)}</div></div><div className="footer-links"><div><span>Explore</span><button onClick={() => scrollTo("historia")}>A história</button><button onClick={() => scrollTo("propostas")}>Propostas</button><button onClick={() => scrollTo("compromissos")}>Compromissos</button><button onClick={() => scrollTo("coligacao")}>Coligação</button><a href="/santinho">Santinho digital</a></div><div><span>Conecte-se</span><a href={whatsappLink} target="_blank" rel="noreferrer">WhatsApp da campanha</a><a href="/agenda">Agenda completa</a><a href="/noticias">Todas as notícias</a><button onClick={() => scrollTo("galeria")}>Galeria</button><a href="/politica-de-privacidade">Privacidade</a><a href="/cookies">Cookies</a><a href="/termos-de-uso">Termos de uso</a></div></div><div className="footer-number"><small>Deputada Federal · número de urna</small><strong>{siteContent.candidateNumber}</strong><span>Partido {siteContent.partyName}</span></div></div>
        <div className="footer-bottom"><span>Claudia Benassuly · Pará</span><span>Site oficial da pré-campanha</span><span>{siteContent.slogan}</span><span className="footer-credit">Desenvolvido com ♥ e maestria por <a href="https://douglasbragaoficial.com.br" target="_blank" rel="noreferrer">Douglas Braga</a></span></div>
        <div className="legal-footer"><strong>Informações legais</strong><span>Eleição Claudia de Fatima e Silva — Deputado Federal · CNPJ 68.553.373/0001-23</span><span>Av. Nazaré, 272, Ed. Clube de Engenharia, Sala 104 · Nazaré · Belém/PA · CEP 66.035-115</span><span>E-mail oficial: psdbpaestadual@gmail.com · Contato: draclaudiabenassuly@gmail.com</span><small>© 2026 Claudia Benassuly. Todos os direitos reservados.</small></div>
      </footer>

      <a className="whatsapp-float" href={whatsappLink} target="_blank" rel="noreferrer" aria-label="Falar com a campanha pelo WhatsApp"><ChatIcon /><span>Fale com a campanha</span></a>
      <button className="chat-float" onClick={() => setChatOpen((value) => !value)} aria-label="Abrir Claudia Digital"><span className="chat-pulse" /><ChatIcon /></button>
      <VlibrasWidget />

      {chatOpen && <div className="chat-panel"><div className="chat-head"><div className="bot-avatar"><SparkIcon /></div><div><strong>Claudia Digital</strong><span>Assistente da campanha · online</span></div><button onClick={() => setChatOpen(false)} aria-label="Fechar assistente">×</button></div><div className="chat-body">{chatMessages.map((message, index) => <div className={`chat-message ${message.from}`} key={`${message.text}-${index}`}>{message.text}</div>)}</div><form className="chat-form" onSubmit={sendChat}><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Pergunte sobre a campanha" aria-label="Pergunte sobre a campanha" /><button type="submit" aria-label="Enviar pergunta"><ArrowUpRight /></button></form><div className="chat-note">Respostas baseadas no material oficial da campanha.</div></div>}

      {activePost && <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setActivePost(null)}><article className="post-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setActivePost(null)} aria-label="Fechar notícia">×</button><img src={activePost.image} alt="" /><div><span>{activePost.category}</span><h2>{activePost.title}</h2><p>{activePost.excerpt}</p><p>Este espaço editorial será atualizado com artigos, vídeos e relatos da caminhada de Claudia Benassuly pelo Pará.</p><a href={whatsappLink} target="_blank" rel="noreferrer" className="primary-button">Conversar sobre este tema <ArrowUpRight /></a></div></article></div>}
      {activePhoto && <div className="modal-backdrop photo-modal-backdrop" role="dialog" aria-modal="true" onClick={() => setActivePhoto(null)}><button className="modal-close" onClick={() => setActivePhoto(null)} aria-label="Fechar galeria">×</button><img className="photo-modal" src={activePhoto} alt="Registro da campanha Claudia Benassuly" /></div>}
      {editorMode && <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setEditorMode(false)}><div className="editor-modal" onClick={(event) => event.stopPropagation()}><button className="modal-close" onClick={() => setEditorMode(false)} aria-label="Fechar modo gestão">×</button><p className="eyebrow"><span /> Área editorial</p><h2>Modo gestão da campanha</h2><p>Agenda, notícias e galeria foram estruturadas para receber atualizações da equipe. Nesta primeira versão, os conteúdos exibidos já estão organizados por data, categoria e publicação.</p><div className="editor-status"><span className="live-dot" /> Conteúdo público sincronizado</div><div className="editor-fields"><label>Próximo compromisso<input defaultValue="Escuta com mulheres empreendedoras" /></label><label>Local<input defaultValue="Ananindeua · Pará" /></label><label>Chamada da próxima notícia<input defaultValue="Creche em tempo integral também é liberdade para trabalhar" /></label></div><button className="primary-button" onClick={() => setEditorMode(false)}>Salvar estrutura editorial <ArrowUpRight /></button><small>Para publicar alterações definitivas, conecte a equipe ao painel de conteúdo do projeto.</small></div></div>}
    </main>
  );
}

function CandidateNumber({ value }: { value: string }) {
  const normalized = value.replace(/[\s.,-]+/g, "");
  const splitAt = normalized.length >= 4 ? 2 : Math.ceil(normalized.length / 2);
  return <strong className="candidate-number" aria-label={`Número ${normalized}`}><span>{normalized.slice(0, splitAt)}</span><i>{normalized.slice(splitAt)}</i></strong>;
}
