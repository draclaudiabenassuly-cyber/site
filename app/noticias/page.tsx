"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import VlibrasWidget from "../components/VlibrasWidget";
import { defaultContent, defaultNews, type NewsItem, type SiteContent } from "../../lib/cms-defaults";

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>(defaultNews);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    fetch("/api/cms").then((response) => response.ok ? response.json() : null).then((payload) => {
      if (payload?.content) setSiteContent({ ...defaultContent, ...payload.content });
      if (payload?.news) setItems(payload.news);
    }).catch(() => undefined);
  }, []);

  return <main className="public-list-page"><header className="public-list-header"><Link href="/"><img src={siteContent.siteHeaderLogo} alt="Claudia Benassuly" /></Link><Link href="/">Voltar para o site</Link></header><section className="public-list-intro"><p className="eyebrow">Ideias em movimento</p><h1>Notícias da <em>campanha.</em></h1><p>Informação, propostas e registros da caminhada de Claudia Benassuly pelo Pará.</p></section><section className="public-news-grid">{items.map((item, index) => <article className="public-news-card" id={`news-${item.id ?? index}`} key={item.id ?? item.title}><div className="public-news-image"><img src={item.image} alt="" /></div><div><span>{item.category} · {item.publishedAt}</span><h2>{item.title}</h2><p>{item.excerpt}</p><small>{item.readTime}</small></div></article>)}</section><footer className="public-list-footer"><span>Novas publicações serão cadastradas pela equipe no CMS.</span><Link href="/agenda">Ver agenda pública</Link></footer><VlibrasWidget /></main>;
}
