"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { defaultContent, type SiteContent } from "../../lib/cms-defaults";
import { publicMediaSrc } from "../../lib/public-media";

const whatsappLink =
  "https://wa.me/?text=Ol%C3%A1%20Cl%C3%A1udia%20Benassuly%2C%20quero%20conhecer%20a%20campanha.";

export default function SantinhoPage() {
  const [copied, setCopied] = useState(false);
  const [siteContent, setSiteContent] = useState<SiteContent>(defaultContent);
  const [cmsRevision, setCmsRevision] = useState(0);

  useEffect(() => {
    let disposed = false;
    const load = async () => {
      try {
        const response = await fetch(`/api/cms?public=1&v=${Date.now()}`, { cache: "no-store", credentials: "omit", headers: { "cache-control": "no-cache" } });
        if (!response.ok || disposed) return;
        const payload = await response.json();
        if (!payload?.content || disposed) return;
        setSiteContent({ ...defaultContent, ...payload.content });
        setCmsRevision(Date.now());
      } catch { /* keep the bundled santinho while the CMS is unavailable */ }
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
      title: `Cláudia Benassuly ${siteContent.candidateNumber}`,
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
          @page { size: A4 landscape; margin: 0; }

          html, body {
            width: 297mm !important;
            height: 210mm !important;
            min-height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: #fff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body.printing-santinho .card-page > * { display: none !important; }
          body.printing-santinho .card-page > .printable-santinho { display: block !important; }

          body.printing-santinho .card-page,
          body.printing-santinho .printable-santinho,
          body.printing-santinho .printable-santinho * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body.printing-santinho .card-page {
            width: 297mm !important;
            height: 210mm !important;
            min-height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: #fff !important;
          }

          /* Folha inteira: 192 mm de arte + 18 mm de faixa amarela inferior. */
          body.printing-santinho .printable-santinho {
            display: block !important;
            width: 297mm !important;
            max-width: 297mm !important;
            height: 210mm !important;
            min-height: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: 0 !important;
            overflow: hidden !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          body.printing-santinho .printable-santinho .digital-card-main {
            width: 297mm !important;
            height: 192mm !important;
            min-height: 192mm !important;
            max-height: 192mm !important;
            overflow: hidden !important;
            background: #071d4f !important;
            color: #fff !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          body.printing-santinho .printable-santinho .digital-card-topline,
          body.printing-santinho .printable-santinho .digital-card-bottom {
            background: #071d4f !important;
            color: #fff !important;
            border-color: rgba(255,255,255,.18) !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body.printing-santinho .printable-santinho .digital-card-content {
            width: 100% !important;
            height: 166mm !important;
            min-height: 166mm !important;
            max-height: 166mm !important;
            overflow: hidden !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          body.printing-santinho .printable-santinho .digital-card-copy-large {
            height: 166mm !important;
            min-height: 166mm !important;
            max-height: 166mm !important;
            padding: 8mm 9mm !important;
            overflow: hidden !important;
            background: #071d4f !important;
            color: #fff !important;
          }

          body.printing-santinho .printable-santinho .digital-card-photo {
            height: 166mm !important;
            min-height: 166mm !important;
            max-height: 166mm !important;
            overflow: hidden !important;
            background: #9fc8d3 !important;
          }

          body.printing-santinho .printable-santinho .digital-card-photo img {
            display: block !important;
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;
          }

          body.printing-santinho .printable-santinho .digital-card-topline,
          body.printing-santinho .printable-santinho .digital-card-bottom {
            min-height: 13mm !important;
            height: 13mm !important;
            padding: 4mm 7mm !important;
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

          body.printing-santinho .printable-santinho .santinho-coalition,
          body.printing-santinho .printable-santinho .santinho-coalition-label,
          body.printing-santinho .printable-santinho .santinho-coalition-list,
          body.printing-santinho .printable-santinho .santinho-coalition-list > span {
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          body.printing-santinho .printable-santinho .santinho-coalition { color: #d4deed !important; }
          body.printing-santinho .printable-santinho .santinho-coalition-label { color: #8fa5c4 !important; }
          body.printing-santinho .printable-santinho .santinho-coalition-list { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 3px 12px !important; }
          body.printing-santinho .printable-santinho .santinho-coalition-list > span { color: #8fa5c4 !important; }
          body.printing-santinho .printable-santinho .santinho-coalition-list b { color: #fff !important; }
          body.printing-santinho .printable-santinho .santinho-coalition-parties { display: block !important; color: #7189ad !important; }

          /* A faixa amarela faz parte da arte e precisa obrigatoriamente entrar no PDF. */
          body.printing-santinho .printable-santinho .card-page-note {
            display: flex !important;
            align-items: center !important;
            width: 297mm !important;
            height: 18mm !important;
            min-height: 18mm !important;
            max-height: 18mm !important;
            margin: 0 !important;
            padding: 3mm 7mm !important;
            overflow: hidden !important;
            background: #f0c64f !important;
            color: #071d4f !important;
            page-break-before: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          body.printing-santinho .printable-santinho .card-page-note span,
          body.printing-santinho .printable-santinho .card-page-note strong,
          body.printing-santinho .printable-santinho .card-page-note p { color: #071d4f !important; }

          /* VLibras jamais faz parte do documento impresso. */
          body.printing-santinho .vlibras-widget,
          body.printing-santinho [vw],
          body.printing-santinho [vw-access-button],
          body.printing-santinho [vw-plugin-wrapper],
          body.printing-santinho .vpw-container,
          body.printing-santinho .vpw-wrapper { display: none !important; visibility: hidden !important; }
        }
      `}</style>
      <header className="card-page-header">
        <Link href="/" className="card-page-brand" aria-label="Voltar para a campanha Cláudia Benassuly"><img src={publicMediaSrc(siteContent.siteHeaderLogo, cmsRevision)} alt="Cláudia Benassuly" /></Link>
        <Link href="/" className="card-page-back">Voltar para o site</Link>
      </header>
      <section className="card-page-intro">
        <p className="eyebrow"><span /> Compartilhe este link</p>
        <h1>O santinho da campanha, <em>agora digital.</em></h1>
        <p>Envie esta página para quem precisa conhecer a Cláudia, suas propostas e o número {siteContent.candidateNumber}.</p>
      </section>
      <section className="digital-card-stand printable-santinho" aria-label="Santinho digital Cláudia Benassuly">
        <div className="digital-card-main">
          <div className="digital-card-topline"><span>{siteContent.topRibbonLabel}</span><strong>{siteContent.candidateNumber}</strong></div>
          <div className="digital-card-content">
            <div className="digital-card-copy-large">
              <p className="card-kicker">{siteContent.santinhoKicker}</p>
              <img className="santinho-name-logo" src={publicMediaSrc(siteContent.santinhoLogo, cmsRevision)} alt="Cláudia Benassuly" />
              <p>{siteContent.santinhoBody}</p>
              <div className="santinho-vote-number"><span>Confirme na urna</span><strong>{siteContent.candidateNumber}</strong></div>
              <div className="party-card-lockup"><span>Partido:</span><img src={publicMediaSrc(siteContent.partyDarkLogo, cmsRevision)} alt={`${siteContent.partyName} 23`} /></div>
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
            <div className="digital-card-photo"><img src={publicMediaSrc(siteContent.santinhoImage, cmsRevision)} alt="Cláudia Benassuly sorrindo" /></div>
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
      <div className="card-page-footer"><Link href="/">Cláudia Benassuly</Link><span>Partido {siteContent.partyName} · candidata {siteContent.candidateNumber}</span><a href={whatsappLink} target="_blank" rel="noreferrer">WhatsApp da campanha</a><Link href="/politica-de-privacidade">Privacidade</Link><Link href="/cookies">Cookies</Link><Link href="/termos-de-uso">Termos de uso</Link><a href="https://douglasbragaoficial.com.br" target="_blank" rel="noreferrer">Desenvolvido por Douglas Braga</a></div>
      <div className="card-page-legal"><strong>Informações legais</strong><span>Eleição Claudia de Fatima e Silva — Deputado Federal · CNPJ 68.553.373/0001-23</span><span>Av. Nazaré, 272, Ed. Clube de Engenharia, Sala 104 · Nazaré · Belém/PA · CEP 66.035-115</span><span>E-mail oficial: psdbpaestadual@gmail.com · Contato: draclaudiabenassuly@gmail.com</span><small>© 2026 Cláudia Benassuly. Todos os direitos reservados.</small></div>
    </main>
  );
}
