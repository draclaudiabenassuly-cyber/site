"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { defaultContent, type SiteContent } from "../../lib/cms-defaults";

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

  useEffect(() => {
    fetch("/api/cms")
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => payload?.content && setSiteContent({ ...defaultContent, ...payload.content }))
      .catch(() => undefined);
  }, []);

  return (
    <main className="legal-page">
      <header className="legal-page-header">
        <Link href="/" className="legal-page-brand" aria-label="Voltar para a campanha Claudia Benassuly">
          <img src={siteContent.siteHeaderLogo} alt="Claudia Benassuly" />
        </Link>
        <Link href="/" className="legal-page-back">Voltar para o site</Link>
      </header>

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
        <span>© 2026 Claudia Benassuly. Todos os direitos reservados.</span>
      </footer>
    </main>
  );
}
