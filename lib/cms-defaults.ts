export type AgendaItem = {
  id?: string;
  date: string;
  day: string;
  month: string;
  title: string;
  location: string;
  detail: string;
  tone: "teal" | "blue" | "gold";
};

export type NewsItem = {
  id?: string;
  category: string;
  title: string;
  excerpt: string;
  readTime: string;
  image: string;
  publishedAt?: string;
};

export type GalleryAlbum = {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover: string;
  publishedAt: string;
  featured: boolean;
  sortOrder: number;
};

export type GalleryPhoto = {
  id: string;
  albumId: string;
  title: string;
  caption: string;
  image: string;
  alt: string;
  publishedAt: string;
  featuredOnHome: boolean;
  sortOrder: number;
};

export type ProposalCard = {
  number: string;
  title: string;
  copy: string;
  tag: string;
  icon: string;
};

export type SiteContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroTitleEm: string;
  heroSubline: string;
  heroLede: string;
  slogan: string;
  manifestoWords: string;
  storyEyebrow: string;
  storyTitle: string;
  storyTitleEm: string;
  storyLead: string;
  storyBody: string;
  quote: string;
  quoteEm: string;
  quoteDescription: string;
  santinhoEyebrow: string;
  santinhoTitle: string;
  santinhoTitleEm: string;
  santinhoDescription: string;
  santinhoKicker: string;
  santinhoBody: string;
  santinhoMessageTitle: string;
  santinhoMessageBody: string;
  joinTitle: string;
  joinTitleEm: string;
  joinDescription: string;
  candidateNumber: string;
  partyName: string;
  coalitionName: string;
  coalitionParties: string;
  coalitionGovernorName: string;
  coalitionGovernorNumber: string;
  coalitionSenatorName: string;
  coalitionSenatorNumber: string;
  coalitionStateDeputyName: string;
  coalitionStateDeputyNumber: string;
  coalitionFederalDeputyName: string;
  coalitionFederalDeputyNumber: string;
  siteHeaderLogo: string;
  siteFooterLogo: string;
  digitalCardLogo: string;
  santinhoLogo: string;
  partyLightLogo: string;
  partyDarkLogo: string;
  ogImage: string;
  heroImage: string;
  storyImage: string;
  santinhoImage: string;
  galleryImage1: string;
  galleryImage2: string;
  galleryImage3: string;
  galleryImage4: string;
  galleryImage5: string;
  topRibbonLabel: string;
  heroPartyCaption: string;
  heroNumberLabel: string;
  storyPortraitNote: string;
  storyPortraitStrong: string;
  storyExtra: string;
  proposalsEyebrow: string;
  proposalsTitle: string;
  proposalsTitleEm: string;
  proposalsSupport: string;
  proposalsJson: string;
  technicalLanguage: string;
  streetLanguage: string;
  agendaEyebrow: string;
  agendaTitle: string;
  agendaTitleEm: string;
  agendaDescription: string;
  agendaHint: string;
  coalitionEyebrow: string;
  coalitionTitle: string;
  coalitionTitleEm: string;
  coalitionNote: string;
  newsEyebrow: string;
  newsTitle: string;
  newsTitleEm: string;
  newsDescription: string;
  galleryEyebrow: string;
  galleryTitle: string;
  galleryTitleEm: string;
  galleryDescription: string;
  galleryFooterLabel: string;
  galleryFooterTitle: string;
  footerCampaignLabel: string;
  footerExploreLabel: string;
  footerConnectLabel: string;
  signupRecipientEmail: string;
  galleryAlbumsJson: string;
  galleryPhotosJson: string;
};

export const defaultContent: SiteContent = {
  heroEyebrow: "Uma nova voz para o Pará",
  heroTitle: "Política que",
  heroTitleEm: "escuta.",
  heroSubline: "Trabalho que transforma.",
  heroLede: "Cláudia Benassuly coloca seu nome à disposição para levar a voz das mulheres da vida real ao Congresso Nacional.",
  slogan: "Por ela. Por nós. Por todas.",
  manifestoWords: "escuta · coragem · presença · futuro",
  storyEyebrow: "A história por trás do nome",
  storyTitle: "Quem conhece a realidade,",
  storyTitleEm: "sabe onde agir.",
  storyLead: "A mulher brasileira acorda antes do sol, cuida, trabalha, empreende e resolve. Mas as decisões que mudam a sua vida ainda são tomadas sem a sua voz.",
  storyBody: "Cláudia chega para mudar essa lógica. Sua candidatura nasce da escuta, do compromisso com as mulheres e da certeza de que política só faz sentido quando melhora a vida de quem está na ponta.",
  quote: "Esta candidatura não é minha.",
  quoteEm: "Ela é nossa.",
  quoteDescription: "Uma mulher na política muda a sua história. Muitas mulheres na política mudam a história do país.",
  santinhoEyebrow: "Leve a mensagem com você",
  santinhoTitle: "O santinho agora é",
  santinhoTitleEm: "digital.",
  santinhoDescription: "Compartilhe a história, as propostas e o número 2323 da Cláudia com quem precisa conhecer uma nova voz para o Pará.",
  santinhoKicker: "Por ela. Por nós. Por todas.",
  santinhoBody: "Uma nova voz para o Pará, com escuta, presença e compromisso com as mulheres da vida real.",
  santinhoMessageTitle: "Presença que cuida.",
  santinhoMessageBody: "Conheça as propostas e participe da construção desse projeto.",
  joinTitle: "Uma campanha forte começa quando",
  joinTitleEm: "você chega junto.",
  joinDescription: "Receba notícias, agenda e formas de participar da construção desse projeto.",
  candidateNumber: "2323",
  partyName: "Cidadania",
  coalitionName: "O PARÁ TÁ JUNTO",
  coalitionParties: "MDB · Federação UNIÃO BRASIL-PP · Federação PT-PCdoB-PV · Federação PSDB-Cidadania · PSD · PSB · REPUBLICANOS · AVANTE",
  coalitionGovernorName: "Hanna",
  coalitionGovernorNumber: "15",
  coalitionSenatorName: "Helder",
  coalitionSenatorNumber: "151",
  coalitionStateDeputyName: "Antônia Brito",
  coalitionStateDeputyNumber: "23222",
  coalitionFederalDeputyName: "Cláudia Benassuly",
  coalitionFederalDeputyNumber: "2323",
  siteHeaderLogo: "/campaign/logo-transparent-color.png",
  siteFooterLogo: "/campaign/logo-transparent-footer.png",
  digitalCardLogo: "/campaign/logo-transparent-dark.png",
  santinhoLogo: "/campaign/logo-name-white.png",
  partyLightLogo: "/campaign/cidadania-logo-compact.png",
  partyDarkLogo: "/campaign/cidadania-logo-footer.png",
  ogImage: "/og.png",
  heroImage: "/campaign/claudia-portrait-clean.jpg",
  storyImage: "/campaign/claudia-hero.jpeg",
  santinhoImage: "/campaign/claudia-hero.jpeg",
  galleryImage1: "/campaign/gallery-principal.jpg",
  galleryImage2: "/campaign/gallery-identidade.png",
  galleryImage3: "/campaign/gallery-saude.png",
  galleryImage4: "/campaign/gallery-justica.png",
  galleryImage5: "/campaign/gallery-autonomia.png",
  topRibbonLabel: "Candidata a Deputada Federal",
  heroPartyCaption: "número 23 · candidata 2323",
  heroNumberLabel: "Deputada Federal · Cidadania",
  storyPortraitNote: "Uma mulher da vida real",
  storyPortraitStrong: "pronta para fazer parte.",
  storyExtra: "É sobre transformar indignação em proposta, esperança em trabalho e presença em resultado.",
  proposalsEyebrow: "O que move esta candidatura",
  proposalsTitle: "Quatro caminhos para uma política que",
  proposalsTitleEm: "chega na vida real.",
  proposalsSupport: "No Congresso, cada pauta precisa ter direção, orçamento e compromisso com quem mais precisa.",
  proposalsJson: JSON.stringify([
    { number: "01", title: "Autonomia econômica", copy: "Creches, crédito, inclusão digital e oportunidades para que cada mulher possa escolher o próprio caminho.", tag: "Trabalho & renda", icon: "bank" },
    { number: "02", title: "Segurança e justiça", copy: "Mais orçamento para proteger mulheres, combater a violência e fazer a justiça chegar mais rápido.", tag: "Proteção real", icon: "scales" },
    { number: "03", title: "Saúde integral", copy: "Prevenção, atendimento humanizado, saúde mental e cuidado para todas as fases da vida.", tag: "SUS que acolhe", icon: "health" },
    { number: "04", title: "Participação e inclusão", copy: "A política precisa refletir a vida de mulheres periféricas, negras, indígenas, ribeirinhas e rurais.", tag: "Voz & presença", icon: "community" },
  ] satisfies ProposalCard[]),
  technicalLanguage: "Políticas públicas com orçamento e fiscalização.",
  streetLanguage: "Creche para trabalhar em paz. Exame sem fila. Segurança de verdade.",
  agendaEyebrow: "Presença se faz de perto",
  agendaTitle: "Próximos",
  agendaTitleEm: "compromissos.",
  agendaDescription: "Onde tem gente, tem escuta. Acompanhe os próximos encontros da campanha.",
  agendaHint: "Agenda pública atualizada pela equipe da campanha",
  coalitionEyebrow: "Coligação da Dra. Cláudia",
  coalitionTitle: "Nomes e números para uma caminhada que",
  coalitionTitleEm: "chega junto.",
  coalitionNote: "Composição informada pela campanha",
  newsEyebrow: "Ideias em movimento",
  newsTitle: "Diário da",
  newsTitleEm: "campanha.",
  newsDescription: "Informação, propostas e registros da caminhada de Cláudia Benassuly pelo Pará.",
  galleryEyebrow: "A campanha em movimento",
  galleryTitle: "Galeria de",
  galleryTitleEm: "presença.",
  galleryDescription: "Cada registro conta um pouco do caminho que estamos construindo juntas.",
  galleryFooterLabel: "Novos registros em breve",
  galleryFooterTitle: "Você também faz parte dessa história.",
  footerCampaignLabel: "Site oficial da campanha",
  footerExploreLabel: "Explore",
  footerConnectLabel: "Conecte-se",
  signupRecipientEmail: "draclaudiabenassuly@gmail.com",
  galleryAlbumsJson: JSON.stringify([{ id: "campanha-2026", title: "Campanha 2026", slug: "campanha-2026", description: "Identidade, propostas e registros da caminhada de Cláudia Benassuly.", cover: "/campaign/gallery-principal.jpg", publishedAt: "2026-08-24", featured: true, sortOrder: 0 }]),
  galleryPhotosJson: JSON.stringify([
    { id: "galeria-principal", albumId: "campanha-2026", title: "Registro principal", caption: "Por ela. Por nós. Por todas.", image: "/campaign/gallery-principal.jpg", alt: "Cláudia Benassuly em registro principal da campanha", publishedAt: "2026-08-24", featuredOnHome: true, sortOrder: 0 },
    { id: "galeria-identidade", albumId: "campanha-2026", title: "Identidade visual", caption: "A presença que identifica esta candidatura.", image: "/campaign/gallery-identidade.png", alt: "Retrato de Cláudia Benassuly em PNG transparente", publishedAt: "2026-08-24", featuredOnHome: true, sortOrder: 1 },
    { id: "galeria-saude", albumId: "campanha-2026", title: "Saúde da mulher", caption: "Exame preventivo não pode esperar meses.", image: "/campaign/gallery-saude.png", alt: "Arte da campanha sobre saúde da mulher", publishedAt: "2026-08-24", featuredOnHome: true, sortOrder: 2 },
    { id: "galeria-justica", albumId: "campanha-2026", title: "Segurança e justiça", caption: "Pensão alimentícia no bolso, sem enrolação.", image: "/campaign/gallery-justica.png", alt: "Arte da campanha sobre pensão alimentícia", publishedAt: "2026-08-24", featuredOnHome: true, sortOrder: 3 },
    { id: "galeria-autonomia", albumId: "campanha-2026", title: "Autonomia econômica", caption: "Creche em tempo integral também é liberdade para trabalhar.", image: "/campaign/gallery-autonomia.png", alt: "Arte da campanha sobre creche em tempo integral", publishedAt: "2026-08-24", featuredOnHome: true, sortOrder: 4 },
  ]),
};

export const defaultAgenda: AgendaItem[] = [
  { id: "escuta-mulheres-empreendedoras", date: "22 ago 2026", day: "22", month: "AGO", title: "Escuta com mulheres empreendedoras", location: "Ananindeua · Pará", detail: "Roda de conversa sobre crédito, autonomia e oportunidades para quem empreende.", tone: "teal" },
  { id: "liderancas-femininas", date: "29 ago 2026", day: "29", month: "AGO", title: "Encontro de lideranças femininas", location: "Belém · Pará", detail: "Uma conversa aberta sobre segurança, participação política e futuro.", tone: "blue" },
  { id: "cafe-comunidade", date: "05 set 2026", day: "05", month: "SET", title: "Café com a comunidade", location: "Região Metropolitana de Belém", detail: "A campanha vai até as pessoas para ouvir o que realmente precisa mudar.", tone: "gold" },
];

export const defaultNews: NewsItem[] = [
  { id: "creche-tempo-integral", category: "Autonomia econômica", title: "Creche em tempo integral também é liberdade para trabalhar", excerpt: "Quando uma mãe tem onde deixar seu filho com segurança, ela ganha tempo, renda e tranquilidade para construir seus planos.", readTime: "4 min de leitura", image: "/campaign/gallery-autonomia.png", publishedAt: "2026-08-01" },
  { id: "pensao-alimenticia", category: "Segurança e justiça", title: "Pensão alimentícia no bolso, sem enrolação", excerpt: "A defesa de mecanismos mais rápidos e digitais para garantir o direito de crianças e mães precisa sair do discurso.", readTime: "3 min de leitura", image: "/campaign/gallery-justica.png", publishedAt: "2026-08-04" },
  { id: "saude-da-mulher", category: "Saúde da mulher", title: "Exame preventivo não pode esperar meses", excerpt: "A saúde da mulher merece prevenção, diagnóstico rápido e acolhimento em todas as fases da vida.", readTime: "5 min de leitura", image: "/campaign/gallery-saude.png", publishedAt: "2026-08-07" },
];
