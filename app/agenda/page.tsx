"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import VlibrasWidget from "../components/VlibrasWidget";
import { defaultAgenda, defaultContent, type AgendaItem, type SiteContent } from "../../lib/cms-defaults";

export default function AgendaPage() {
  const [items, setItems] = useState<AgendaItem[]>(defaultAgenda);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    fetch("/api/cms").then((response) => response.ok ? response.json() : null).then((payload) => {
      if (payload?.content) setSiteContent({ ...defaultContent, ...payload.content });
      if (payload?.agenda) setItems(payload.agenda);
    }).catch(() => undefined);
  }, []);

  return <main className="public-list-page"><header className="public-list-header"><Link href="/"><img src={siteContent.siteHeaderLogo} alt="Claudia Benassuly" /></Link><Link href="/">Voltar para o site</Link></header><section className="public-list-intro"><p className="eyebrow">Presença se faz de perto</p><h1>Agenda <em>pública.</em></h1><p>Acompanhe os próximos encontros, escutas e compromissos da campanha Claudia Benassuly.</p></section><section className="public-agenda-list">{items.map((item) => <article className="public-agenda-card" id={`event-${item.id ?? item.day}`} key={item.id ?? item.date}><div className={`public-agenda-date ${item.tone}`}><strong>{item.day}</strong><span>{item.month}</span></div><div><span>{item.date} · {item.location}</span><h2>{item.title}</h2><p>{item.detail}</p></div><a href="https://wa.me/?text=Olá%20Claudia%20Benassuly%2C%20quero%20saber%20mais%20sobre%20este%20compromisso." target="_blank" rel="noreferrer">Falar com a campanha ↗</a></article>)}</section><footer className="public-list-footer"><span>Agenda pública atualizada pela equipe da campanha.</span><Link href="/noticias">Ler notícias da campanha</Link></footer><VlibrasWidget /></main>;
}
