"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import VlibrasWidget from "../components/VlibrasWidget";
import { defaultContent, type SiteContent } from "../../lib/cms-defaults";

const whatsappLink =
  "https://wa.me/?text=Ol%C3%A1%20Claudia%20Benassuly%2C%20quero%20conhecer%20a%20campanha.";

export default function SantinhoPage() {
  const [copied, setCopied] = useState(false);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    fetch("/api/cms")
      .then((response) => response.ok ? response.json() : null)
      .then((payload) => payload?.content && setSiteContent({ ...defaultContent, ...payload.content }))
      .catch(() => undefined);
  }, []);

  function printCard() {
    document.body.classList.add("printing-santinho");
    const cleanup = () => {
      document.body.classList.remove("printing-santinho");
      window.removeEventListener("afterprint", cleanup);
    };
    window.addEventListener("afterprint", cleanup, { once: true });
    window.setTimeout(() => window.print(), 60);
  }

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("print") !== "1") return;
    const timer = window.setTimeout(printCard, 700);
    return () => window.clearTimeout(timer);
  }, []);

  async function shareCard() {
    const shareData = {
      title: `Claudia Benassuly ${siteContent.candidateNumber}`,
      text: "Por ela. Por nós. Por todas.",
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
  }

  return (
    <main className="card-page">
      <style>{`
        @media print {
          html, body, body.printing-santinho, body.printing-santinho .card-page,
          body.printing-santinho .printable-santinho,
          body.printing-santinho .digital-card-main,
          body.printing-santinho .digital-card-content,
          body.printing-santinho .digital-card-copy-large,
          body.printing-santinho .digital-card-photo,
          body.printing-santinho .digital-card-topline,
          body.printing-santinho .digital-card-bottom,
          body.printing-santinho .card-page-note {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body.printing-santinho .printable-santinho {
            background: #fff !important;
            color: #fff !important;
          }

          body.printing-santinho .printable-santinho .digital-card-main {
            background: #071d4f !important;
            color: #fff !important;
          }

          body.printing-santinho .printable-santinho .digital-card-copy-large {
            background: #071d4f !important;
            color: #fff !important;
          }

          body.printing-santinho .printable-santinho .digital-card-photo {
            background: #9fc8d3 !important;
          }

          body.printing-santinho .printable-santinho .digital-card-topline,
          body.printing-santinho .printable-santinho .digital-card-bottom {
            background: #071d4f !important;
            color: #fff !important;
            border-color: rgba(255,255,255,.18) !important;
          }

          body.printing-santinho .printable-santinho .digital-card-topline strong,
          body.printing-santinho .printable-santinho .digital-card-bottom strong,
          body.printing-santinho .printable-santinho .card-kicker,
          body.printing-santinho .printable-santinho .santinho-vote-number span,
          body.printing-santinho .printable-santinho .santinho-vote-number strong {
            color: #f0c64f !important;
          }

          body.printing-santinho .printable-santinho .digital-card-copy-large > p:not(.card-kicker) {
            color: #b8c8df !important;
          }

          body.printing-santinho .printable-santinho .party-card-lockup span,
          body.printing-santinho .printable-santinho .santinho-coalition-label,
          body.printing-santinho .printable-santinho .santinho-coalition-list > span {
            color: #8fa5c4 !important;
          }

          body.printing-santinho .printable-santinho .santinho-coalition-list b {
            color: #d4deed !important;
          }

          body.printing-santinho .printable-santinho .santinho-coalition-parties {
            color: #7189ad !important;
          }

          body.printing-santinho .printable-santinho .card-page-note {
            background: #f0c64f !important;
            color: #071d4f !important;
          }
        }
      `}</style>
      <header className="card-page-header">
        <Link href="/" className="card-page-brand" aria-label="Voltar para a campanha Claudia Benassuly">
          <img src={siteContent.siteHeaderLogo} alt="Claudia Benassuly" />
        </Link>
        <Link href="/" className="card-page-back">Voltar para o site</Link>
      </header>

      <section className="card-page-intro">
        <p className="eyebrow"><span /> Compartilhe este link</p>
        <h1>O santinho da campanha, <em>agora digital.</em></h1>
        <p>Envie esta página para quem precisa conhecer a Claudia, suas propostas e o número {siteContent.candidateNumber}.</p>
      </section>

      <section className="digital-card-stand printable-santinho" aria-label="Santinho digital Claudia Benassuly">
        <div className="digital-card-main">
          <div className="digital-card-topline"><span>Pré-candidata a Deputada Federal</span><strong>{siteContent.candidateNumber}</strong></div>
          <div className="digital-card-content">
            <div className="digital-card-copy-large">
              <p className="card-kicker">{siteContent.santinhoKicker}</p>
              <img className="santinho-name-logo" src={siteContent.santinhoLogo} alt="Claudia Benassuly" />
              <p>{siteContent.santinhoBody}</p>
              <div className="santinho-vote-number"><span>Confirme na urna</span><strong>{siteContent.candidateNumber}</strong></div>
              <div className="party-card-lockup"><span>Partido:</span><img src={siteContent.partyDarkLogo} alt={`${siteContent.partyName} 23`} /></div>
              <div className="santinho-coalition" aria-label="Coligação informada pela campanha">
                <span className="santinho-coalition-label">Coligação · {siteContent.coalitionName}</span>
                <div className="santinho-coalition-list">
                  <span>Governador <b>{siteContent.coalitionGovernorName} {siteContent.coalitionGovernorNumber}</b></span>
                  <span>Senador <b>{siteContent.coalitionSenatorName} {siteContent.coalitionSenatorNumber}</b></span>
                  <span>Deputado Estadual <b>{siteContent.coalitionStateDeputyName} {siteContent.coalitionStateDeputyNumber}</b></span>
                  <span>Deputada Federal <b>{siteContent.coalitionFederalDeputyName} {siteContent.coalitionFederalDeputyNumber}</b></span>
                </div>
                <small className="santinho-coalition-parties">{siteContent.coalitionParties}</small>
              </div>
            </div>
            <div className="digital-card-photo"><img src={siteContent.santinhoImage} alt="Claudia Benassuly sorrindo" /></div>
          </div>
          <div className="digital-card-bottom"><span>Deputada Federal</span><strong>{siteContent.candidateNumber}</strong><small>{siteContent.partyName} 23</small></div>
        </div>
        <div className="card-page-note"><span>Mensagem da campanha</span><strong>{siteContent.santinhoMessageTitle}</strong><p>{siteContent.santinhoMessageBody}</p></div>
      </section>

      <div className="card-page-actions">
        <button className="primary-button" onClick={shareCard}>{copied ? "Link copiado" : "Compartilhar santinho"}</button>
        <button className="outline-button" onClick={printCard}>Salvar para imprimir</button>
        <a className="text-button" href={whatsappLink} target="_blank" rel="noreferrer">Falar com a campanha <span>↗</span></a>
      </div>

      <div className="card-page-footer"><Link href="/">Claudia Benassuly</Link><span>Partido {siteContent.partyName} · candidata {siteContent.candidateNumber}</span><a href={whatsappLink} target="_blank" rel="noreferrer">WhatsApp da campanha</a><Link href="/politica-de-privacidade">Privacidade</Link><Link href="/cookies">Cookies</Link><Link href="/termos-de-uso">Termos de uso</Link><a href="https://douglasbragaoficial.com.br" target="_blank" rel="noreferrer">Desenvolvido por Douglas Braga</a></div>
      <div className="card-page-legal"><strong>Informações legais</strong><span>Eleição Claudia de Fatima e Silva — Deputado Federal · CNPJ 68.553.373/0001-23</span><span>Av. Nazaré, 272, Ed. Clube de Engenharia, Sala 104 · Nazaré · Belém/PA · CEP 66.035-115</span><span>E-mail oficial: psdbpaestadual@gmail.com · Contato: draclaudiabenassuly@gmail.com</span><small>© 2026 Claudia Benassuly. Todos os direitos reservados.</small></div>
      <VlibrasWidget />
    </main>
  );
}
