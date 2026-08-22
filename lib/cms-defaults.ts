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
  heroImage: string;
  storyImage: string;
  santinhoImage: string;
  galleryImage1: string;
  galleryImage2: string;
  galleryImage3: string;
  galleryImage4: string;
  galleryImage5: string;
};

export const defaultContent: SiteContent = {
  heroEyebrow: "Uma nova voz para o Pará",
  heroTitle: "Política que",
  heroTitleEm: "escuta.",
  heroSubline: "Trabalho que transforma.",
  heroLede: "Claudia Benassuly coloca seu nome à disposição para levar a voz das mulheres da vida real ao Congresso Nacional.",
  slogan: "Por ela. Por nós. Por todas.",
  manifestoWords: "escuta · coragem · presença · futuro",
  storyEyebrow: "A história por trás do nome",
  storyTitle: "Quem conhece a realidade,",
  storyTitleEm: "sabe onde agir.",
  storyLead: "A mulher brasileira acorda antes do sol, cuida, trabalha, empreende e resolve. Mas as decisões que mudam a sua vida ainda são tomadas sem a sua voz.",
  storyBody: "Claudia chega para mudar essa lógica. Sua pré-candidatura nasce da escuta, do compromisso com as mulheres e da certeza de que política só faz sentido quando melhora a vida de quem está na ponta.",
  quote: "Esta pré-candidatura não é minha.",
  quoteEm: "Ela é nossa.",
  quoteDescription: "Uma mulher na política muda a sua história. Muitas mulheres na política mudam a história do país.",
  santinhoEyebrow: "Leve a mensagem com você",
  santinhoTitle: "O santinho agora é",
  santinhoTitleEm: "digital.",
  santinhoDescription: "Compartilhe a história, as propostas e o número 2323 da Claudia com quem precisa conhecer uma nova voz para o Pará.",
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
  coalitionStateDeputyNumber: "23334",
  coalitionFederalDeputyName: "Claudia Benassuly",
  coalitionFederalDeputyNumber: "2323",
  siteHeaderLogo: "/campaign/logo-transparent-color.png",
  siteFooterLogo: "/campaign/logo-transparent-footer.png",
  digitalCardLogo: "/campaign/logo-transparent-dark.png",
  santinhoLogo: "/campaign/logo-name-white.png",
  partyLightLogo: "/campaign/cidadania-logo-compact.png",
  partyDarkLogo: "/campaign/cidadania-logo-footer.png",
  heroImage: "/campaign/claudia-portrait-clean.jpg",
  storyImage: "/campaign/claudia-hero.jpeg",
  santinhoImage: "/campaign/claudia-hero.jpeg",
  galleryImage1: "/campaign/claudia-hero.jpeg",
  galleryImage2: "/campaign/logo-transparent-color.png",
  galleryImage3: "/campaign/logo-transparent-footer.png",
  galleryImage4: "/campaign/logo-slogan-color.png",
  galleryImage5: "/campaign/logo-slogan-color.png",
};

export const defaultAgenda: AgendaItem[] = [
  { id: "escuta-mulheres-empreendedoras", date: "22 ago 2026", day: "22", month: "AGO", title: "Escuta com mulheres empreendedoras", location: "Ananindeua · Pará", detail: "Roda de conversa sobre crédito, autonomia e oportunidades para quem empreende.", tone: "teal" },
  { id: "liderancas-femininas", date: "29 ago 2026", day: "29", month: "AGO", title: "Encontro de lideranças femininas", location: "Belém · Pará", detail: "Uma conversa aberta sobre segurança, participação política e futuro.", tone: "blue" },
  { id: "cafe-comunidade", date: "05 set 2026", day: "05", month: "SET", title: "Café com a comunidade", location: "Região Metropolitana de Belém", detail: "A campanha vai até as pessoas para ouvir o que realmente precisa mudar.", tone: "gold" },
];

export const defaultNews: NewsItem[] = [
  { id: "creche-tempo-integral", category: "Autonomia econômica", title: "Creche em tempo integral também é liberdade para trabalhar", excerpt: "Quando uma mãe tem onde deixar seu filho com segurança, ela ganha tempo, renda e tranquilidade para construir seus planos.", readTime: "4 min de leitura", image: "/campaign/claudia-hero.jpeg", publishedAt: "2026-08-01" },
  { id: "pensao-alimenticia", category: "Segurança e justiça", title: "Pensão alimentícia no bolso, sem enrolação", excerpt: "A defesa de mecanismos mais rápidos e digitais para garantir o direito de crianças e mães precisa sair do discurso.", readTime: "3 min de leitura", image: "/campaign/logo-transparent-footer.png", publishedAt: "2026-08-04" },
  { id: "saude-da-mulher", category: "Saúde da mulher", title: "Exame preventivo não pode esperar meses", excerpt: "A saúde da mulher merece prevenção, diagnóstico rápido e acolhimento em todas as fases da vida.", readTime: "5 min de leitura", image: "/campaign/logo-transparent-color.png", publishedAt: "2026-08-07" },
];
