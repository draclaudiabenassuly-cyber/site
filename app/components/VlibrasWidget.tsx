"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    VLibras?: {
      Widget: new (url: string) => unknown;
    };
  }
}

const vlibrasRootAttrs: Record<string, string> = { vw: "" };
const vlibrasButtonAttrs: Record<string, string> = { "vw-access-button": "" };
const vlibrasWrapperAttrs: Record<string, string> = { "vw-plugin-wrapper": "" };

export default function VlibrasWidget() {
  useEffect(() => {
    const pinPanel = () => {
      const root = document.querySelector<HTMLElement>('div[vw].vlibras-widget');
      const wrapper = root?.querySelector<HTMLElement>('[vw-plugin-wrapper]');
      if (root) root.dataset.vlibrasReady = "true";
      if (wrapper) wrapper.dataset.vlibrasPanel = "true";
      document.querySelectorAll<HTMLElement>('.vpw-container, .vpw-wrapper').forEach((panel) => {
        panel.dataset.vlibrasPanel = "true";
      });
    };

    const existingScript = document.querySelector('script[data-vlibras="true"]');
    if (existingScript) {
      if (window.VLibras) new window.VLibras.Widget("https://vlibras.gov.br/app");
      pinPanel();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    script.dataset.vlibras = "true";
    script.onload = () => {
      if (window.VLibras) new window.VLibras.Widget("https://vlibras.gov.br/app");
      pinPanel();
      window.setTimeout(pinPanel, 250);
      window.setTimeout(pinPanel, 1000);
    };
    document.body.appendChild(script);
    const observer = new MutationObserver(pinPanel);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <div {...vlibrasRootAttrs} className="enabled vlibras-widget" aria-label="Acessibilidade em Libras">
      <div {...vlibrasButtonAttrs} className="active" />
      <div {...vlibrasWrapperAttrs}>
        <div className="vw-plugin-top-wrapper" />
      </div>
    </div>
  );
}
