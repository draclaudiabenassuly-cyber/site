"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { defaultAgenda, defaultContent, defaultNews, type AgendaItem, type GalleryAlbum, type GalleryPhoto, type NewsItem, type ProposalCard, type SiteContent } from "../../lib/cms-defaults";
import { publicMediaSrc } from "../../lib/public-media";

export function useCmsData() {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [agenda, setAgenda] = useState<AgendaItem[]>(defaultAgenda);
  const [news, setNews] = useState<NewsItem[]>(defaultNews);
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [mediaRevision, setMediaRevision] = useState(0);
  useEffect(() => {
    let disposed = false;
    const load = async () => {
      try {
        const response = await fetch(`/api/cms?public=1&v=${Date.now()}`, { cache: "no-store", credentials: "omit", headers: { "cache-control": "no-cache" } });
        if (!response.ok || disposed) return;
        const payload = await response.json();
        if (!payload || disposed) return;
        if (payload.content) setContent({ ...defaultContent, ...payload.content });
        if (Array.isArray(payload.agenda)) setAgenda(payload.agenda);
        if (Array.isArray(payload.news)) setNews(payload.news);
        if (Array.isArray(payload.albums)) setAlbums(payload.albums);
        if (Array.isArray(payload.photos)) setPhotos(payload.photos);
        setMediaRevision(Date.now());
      } catch { /* pages keep bundled defaults while the CMS is unavailable */ }
      finally { if (!disposed) setLoading(false); }
    };
    void load();
    window.addEventListener("focus", load);
    const refresh = window.setInterval(load, 30_000);
    return () => {
      disposed = true;
      window.removeEventListener("focus", load);
      window.clearInterval(refresh);
    };
  }, []);
  return { content, agenda, news, albums, photos, loading, mediaRevision };
}

export function parseGallery(content: SiteContent) {
  let albums: GalleryAlbum[] = [];
  let photos: GalleryPhoto[] = [];
  try { albums = JSON.parse(content.galleryAlbumsJson || "[]") as GalleryAlbum[]; } catch { /* defaults are used below */ }
  try { photos = JSON.parse(content.galleryPhotosJson || "[]") as GalleryPhoto[]; } catch { /* defaults are used below */ }
  if (!albums.length) albums = [{ id: "campanha-2026", title: "Campanha 2026", slug: "campanha-2026", description: "Registros da campanha.", cover: content.galleryImage1, publishedAt: "2026-08-24", featured: true, sortOrder: 0 }];
  if (!photos.length) photos = [
    { id: "principal", albumId: albums[0].id, title: "Registro principal", caption: "Por ela. Por nós. Por todas.", image: content.galleryImage1, alt: "Registro principal da campanha", publishedAt: "2026-08-24", featuredOnHome: true, sortOrder: 0 },
    { id: "identidade", albumId: albums[0].id, title: "Identidade visual", caption: "A presença que identifica esta candidatura.", image: content.galleryImage2, alt: "Identidade visual da campanha", publishedAt: "2026-08-24", featuredOnHome: true, sortOrder: 1 },
    { id: "saude", albumId: albums[0].id, title: "Saúde da mulher", caption: "Exame preventivo não pode esperar meses.", image: content.galleryImage3, alt: "Arte da campanha sobre saúde da mulher", publishedAt: "2026-08-24", featuredOnHome: true, sortOrder: 2 },
    { id: "justica", albumId: albums[0].id, title: "Segurança e justiça", caption: "Pensão alimentícia no bolso, sem enrolação.", image: content.galleryImage4, alt: "Arte da campanha sobre segurança e justiça", publishedAt: "2026-08-24", featuredOnHome: true, sortOrder: 3 },
    { id: "autonomia", albumId: albums[0].id, title: "Autonomia econômica", caption: "Creche em tempo integral também é liberdade para trabalhar.", image: content.galleryImage5, alt: "Arte da campanha sobre autonomia econômica", publishedAt: "2026-08-24", featuredOnHome: true, sortOrder: 4 },
  ];
  return { albums, photos };
}

export function PublicHeader({ content, mediaRevision = 0 }: { content: SiteContent; mediaRevision?: number }) {
  return <header className="public-editorial-header"><Link href="/" className="public-editorial-brand"><img src={publicMediaSrc(content.siteHeaderLogo, mediaRevision)} alt="Cláudia Benassuly" /></Link><nav aria-label="Navegação principal"><Link href="/historia">A história</Link><Link href="/propostas">Propostas</Link><Link href="/compromissos">Compromissos</Link><Link href="/noticias">Notícias</Link><Link href="/galeria">Galeria</Link><Link href="/santinho">Santinho digital</Link></nav><Link href="/" className="public-editorial-back">Voltar à home</Link></header>;
}

export function PublicFooter({ content, mediaRevision = 0 }: { content: SiteContent; mediaRevision?: number }) {
  return <footer className="public-editorial-footer"><div><img src={publicMediaSrc(content.siteFooterLogo, mediaRevision)} alt="Cláudia Benassuly" /><p>{content.slogan}</p></div><div className="public-editorial-footer-links"><Link href="/historia">A história</Link><Link href="/propostas">Propostas</Link><Link href="/compromissos">Compromissos</Link><Link href="/noticias">Notícias</Link><Link href="/galeria">Galeria</Link><Link href="/santinho">Santinho</Link></div><div><strong>Fale com a campanha</strong><a href="https://wa.me/?text=Ol%C3%A1%20Cl%C3%A1udia%20Benassuly%2C%20quero%20saber%20mais%20sobre%20a%20campanha." target="_blank" rel="noreferrer">WhatsApp ↗</a><small>© 2026 Cláudia Benassuly · CNPJ 68.553.373/0001-23</small></div></footer>;
}

export function PublicFrame({ content, mediaRevision = 0, eyebrow, title, emphasis, description, children }: { content: SiteContent; mediaRevision?: number; eyebrow: string; title: string; emphasis: string; description: string; children: ReactNode }) {
  return <main className="public-editorial-page"><PublicHeader content={content} mediaRevision={mediaRevision} /><section className="public-editorial-hero"><p className="eyebrow"><span /> {eyebrow}</p><h1>{title} <em>{emphasis}</em></h1><p>{description}</p></section>{children}<PublicFooter content={content} mediaRevision={mediaRevision} /></main>;
}

export function HistoryPage() {
  const { content, mediaRevision } = useCmsData();
  return <PublicFrame content={content} mediaRevision={mediaRevision} eyebrow={content.storyEyebrow} title={content.storyTitle} emphasis={content.storyTitleEm} description={content.storyLead}><section className="public-editorial-split"><div className="public-editorial-image"><img src={publicMediaSrc(content.storyImage, mediaRevision)} alt="Retrato de Cláudia Benassuly" /></div><article><p className="large-lede">{content.storyLead}</p><p>{content.storyBody}</p><p>{content.storyExtra}</p><div className="public-editorial-quote">“{content.quote}<br /><em>{content.quoteEm}</em>”</div></article></section></PublicFrame>;
}

const defaultProposalCards: ProposalCard[] = [
  { number: "01", title: "Autonomia econômica", copy: "Creches, crédito, inclusão digital e oportunidades para que cada mulher possa escolher o próprio caminho.", tag: "Trabalho & renda", icon: "bank" },
  { number: "02", title: "Segurança e justiça", copy: "Mais orçamento para proteger mulheres, combater a violência e fazer a justiça chegar mais rápido.", tag: "Proteção real", icon: "scales" },
  { number: "03", title: "Saúde integral", copy: "Prevenção, atendimento humanizado, saúde mental e cuidado para todas as fases da vida.", tag: "SUS que acolhe", icon: "health" },
  { number: "04", title: "Participação e inclusão", copy: "A política precisa refletir a vida de mulheres periféricas, negras, indígenas, ribeirinhas e rurais.", tag: "Voz & presença", icon: "community" },
]; 

export function ProposalsPage() {
  const { content, mediaRevision } = useCmsData();
  const cards = useMemo(() => {
    try {
      const configured = JSON.parse(content.proposalsJson || "[]") as ProposalCard[];
      if (Array.isArray(configured) && configured.length) return configured;
    } catch { /* use defaults */ }
    return defaultProposalCards;
  }, [content.proposalsJson]);
  const images = ["/campaign/illustration-autonomia.png", "/campaign/illustration-justica.png", "/campaign/illustration-saude.png", "/campaign/gallery-identidade.png"];
  return <PublicFrame content={content} mediaRevision={mediaRevision} eyebrow={content.proposalsEyebrow} title={content.proposalsTitle} emphasis={content.proposalsTitleEm} description={content.proposalsSupport}><section className="public-proposal-grid">{cards.map((card, index) => <article className="public-proposal-card" key={card.number}><span>{card.number}</span><img src={publicMediaSrc(images[index % images.length], mediaRevision)} alt="" /><h2>{card.title}</h2><p>{card.copy}</p><small>{card.tag}</small></article>)}</section><section className="public-editorial-callout"><span>Na linguagem da rua</span><strong>{content.streetLanguage}</strong></section></PublicFrame>;
}

export function CommitmentsPage() {
  const { content, agenda, mediaRevision } = useCmsData();
  return <PublicFrame content={content} mediaRevision={mediaRevision} eyebrow={content.agendaEyebrow} title={content.agendaTitle} emphasis={content.agendaTitleEm} description={content.agendaDescription}><section className="public-commitments-list">{agenda.length ? agenda.map((item) => <article className="public-commitment-card" id={`event-${item.id ?? item.day}`} key={item.id ?? item.date}><div className={`public-agenda-date ${item.tone}`}><strong>{item.day}</strong><span>{item.month}</span></div><div><span>{item.date} · {item.location}</span><h2>{item.title}</h2><p>{item.detail}</p></div><a href="https://wa.me/?text=Ol%C3%A1%20Cl%C3%A1udia%20Benassuly%2C%20quero%20saber%20mais%20sobre%20este%20compromisso." target="_blank" rel="noreferrer">Falar com a campanha ↗</a></article>) : <div className="public-empty-state">Novos compromissos serão publicados em breve.</div>}</section></PublicFrame>;
}

export function NewsPage() {
  const { content, news, mediaRevision } = useCmsData();
  return <PublicFrame content={content} mediaRevision={mediaRevision} eyebrow={content.newsEyebrow} title={content.newsTitle} emphasis={content.newsTitleEm} description={content.newsDescription}><section className="public-news-grid">{news.map((item, index) => <article className="public-news-card" id={`news-${item.id ?? index}`} key={item.id ?? item.title}><div className="public-news-image"><img src={publicMediaSrc(item.image, mediaRevision)} alt="" /></div><div><span>{item.category} · {item.publishedAt}</span><h2>{item.title}</h2><p>{item.excerpt}</p><small>{item.readTime}</small></div></article>)}</section></PublicFrame>;
}

export function GalleryPage() {
  const { content, albums: cmsAlbums, photos: cmsPhotos, mediaRevision } = useCmsData();
  const fallback = useMemo(() => parseGallery(content), [content]);
  const albums = cmsAlbums.length ? cmsAlbums : fallback.albums;
  const photos = cmsPhotos.length ? cmsPhotos : fallback.photos;
  const [albumId, setAlbumId] = useState("all");
  const [active, setActive] = useState<GalleryPhoto | null>(null);
  const visible = photos.filter((photo) => albumId === "all" || photo.albumId === albumId).sort((a, b) => `${b.publishedAt}-${b.sortOrder}`.localeCompare(`${a.publishedAt}-${a.sortOrder}`));
  return <PublicFrame content={content} mediaRevision={mediaRevision} eyebrow={content.galleryEyebrow} title={content.galleryTitle} emphasis={content.galleryTitleEm} description={content.galleryDescription}><section className="public-gallery-toolbar"><button className={albumId === "all" ? "active" : ""} onClick={() => setAlbumId("all")}>Todos os registros</button>{albums.map((album) => <button className={albumId === album.id ? "active" : ""} onClick={() => setAlbumId(album.id)} key={album.id}>{album.title}</button>)}</section><section className="public-gallery-page-grid">{visible.map((photo) => <button key={photo.id} onClick={() => setActive({ ...photo, image: publicMediaSrc(photo.image, mediaRevision) })}><img src={publicMediaSrc(photo.image, mediaRevision)} alt={photo.alt} /><span><strong>{photo.title}</strong><small>{photo.caption}</small></span></button>)}</section>{active && <div className="modal-backdrop" role="dialog" aria-modal="true" onClick={() => setActive(null)}><button className="modal-close" onClick={() => setActive(null)} aria-label="Fechar imagem">×</button><figure className="gallery-lightbox"><img src={active.image} alt={active.alt} /><figcaption><strong>{active.title}</strong><span>{active.caption}</span></figcaption></figure></div>}</PublicFrame>;
}
