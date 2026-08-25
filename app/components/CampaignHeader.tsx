"use client";

import { useState } from "react";
import Link from "next/link";
import type { SiteContent } from "../../lib/cms-defaults";
import { campaignWhatsAppLink, whatsappMessages } from "../../lib/campaign-contact";
import { publicMediaSrc } from "../../lib/public-media";

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
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

export default function CampaignHeader({
  content,
  mediaRevision = 0,
  className = "",
}: {
  content: SiteContent;
  mediaRevision?: number;
  className?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const whatsappLink = campaignWhatsAppLink(
    content.whatsappMessageCampaign || whatsappMessages.campaign,
    content.whatsappNumber,
  );

  return (
    <header className={`site-header ${className}`.trim()}>
      <Link href="/" className="brand-lockup" onClick={closeMenu} aria-label="Voltar para o início">
        <img src={publicMediaSrc(content.siteHeaderLogo, mediaRevision)} alt="Cláudia Benassuly" />
      </Link>
      <nav id="campaign-main-navigation" className={menuOpen ? "main-nav open" : "main-nav"} aria-label="Navegação principal">
        <a href="/historia" onClick={closeMenu}>A história</a>
        <a href="/propostas" onClick={closeMenu}>Propostas</a>
        <a href="/compromissos" onClick={closeMenu}>Compromissos</a>
        <a href="/noticias" onClick={closeMenu}>Notícias</a>
        <a href="/galeria" onClick={closeMenu}>Galeria</a>
        <a href="/santinho" onClick={closeMenu}>Santinho digital</a>
        <a className="nav-contact" href={whatsappLink} target="_blank" rel="noreferrer" onClick={closeMenu}>
          Fale com a campanha <ArrowUpRight />
        </a>
      </nav>
      <button
        type="button"
        className="mobile-menu"
        onClick={() => setMenuOpen((value) => !value)}
        aria-expanded={menuOpen}
        aria-controls="campaign-main-navigation"
        aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
      >
        <MenuIcon />
      </button>
    </header>
  );
}
