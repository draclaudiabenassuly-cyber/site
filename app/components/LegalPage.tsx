"use client";

import { useEffect, useState, type ReactNode } from "react";
import { defaultContent, type SiteContent } from "../../lib/cms-defaults";
import { mediaRevisionFor } from "../../lib/public-media";
import { PublicHeader } from "./public-cms";
import CampaignContactTools from "./CampaignContactTools";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  intro: string;
  children: ReactNode;
};

const legalLinks = [
  { href: "/politica-de-privacidade", label: "Privacidade" },
  { href: "/cookies", label: "Cookies" },
  { href: "/termos-de-uso", label: "Termos de uso" },
];

export default function LegalPage({ eyebrow, title, intro, children }: LegalPageProps) {
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultContent);
  const [mediaRevision, setMediaRevision] = useState(() => mediaRevisionFor([defaultContent.siteHeaderLogo, defaultContent.siteFooterLogo]));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = () => {
      fetch(`/api/cms?public=1&v=${Date.now()}`, { cache: "no-store" })
        .then((response) => response.ok ? response.json() : null)
        .then((payload) => {
          if (!active || !payload?.content) return;
          const nextContent = { ...defaultContent, ...payload.content };
          setSiteContent(nextContent);
          setMediaRevision(mediaRevisionFor([nextContent.siteHeaderLogo, nextContent.siteFooterLogo]));
        })
        .catch(() => undefined)
        .finally(() => { if (active) setLoading(false); });
    };
    load();
    window.addEventListener("focus", load);
    const timer = window.setInterval(load, 30000);
    return () => {
      active = false;
      window.removeEventListener("focus", load);
      window.clearInterval(timer);
    };
  }, []);

  return (
    <main className={`legal-page${loading ? " is-hydrating" : ""}`} aria-busy={loading}>
      <PublicHeader content={siteContent} mediaRevision={mediaRevision} />

      <nav className="legal-page-nav" aria-label="Páginas legais">
        {legalLinks.map((link) => <a className={link.href.endsWith(title === "Política de Privacidade" ? "privacidade" : title === "Política de Cookies" ? "cookies" : "termos-de-uso") ? "active" : ""} href={link.href} key={link.href}>{link.label}</a>)}
      </nav>

      <article className="legal-page-article">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="legal-page-intro">{intro}</p>
        <div className="legal-page-content">{children}</div>
      </article>

      <footer className="legal-page-footer">
        <span>Eleição Claudia de Fatima e Silva — Deputado Federal · CNPJ 68.553.373/0001-23</span>
        <span>Av. Nazaré, 272, Ed. Clube de Engenharia, Sala 104 · Nazaré · Belém/PA · CEP 66.035-115</span>
        <span>E-mail oficial: psdbpaestadual@gmail.com · Contato: draclaudiabenassuly@gmail.com</span>
        <span>© 2026 Cláudia Benassuly. Todos os direitos reservados.</span>
      </footer>
      <CampaignContactTools content={siteContent} />
    </main>
  );
}
