"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    VLibras?: {
      Widget: new (rootPath?: string, configUrl?: string, avatar?: string, position?: string) => unknown;
    };
    vlibras?: {
      changeAvatar?: (avatar: string) => void;
    };
    VLibrasWidget?: {
      avatar?: string;
      position?: string;
      initBtn?: HTMLElement;
      open?: () => void;
    };
    __claudiaVlibrasInitialized?: boolean;
  }
}

const WIDGET_SRC = "https://vlibras.gov.br/app";
const SCRIPT_SRC = "https://vlibras.gov.br/app/vlibras-plugin.js";
const SCRIPT_ID = "claudia-vlibras-script";

function setImportant(element: HTMLElement, property: string, value: string) {
  element.style.setProperty(property, value, "important");
}

function addShadowStyle(root: ShadowRoot, id: string, cssText: string) {
  let style = root.querySelector<HTMLStyleElement>(`#${id}`);
  if (!style) {
    style = document.createElement("style");
    style.id = id;
    root.appendChild(style);
  }
  style.textContent = cssText;
}

function setFemaleDefault() {
  // VLibras keeps the selected interpreter in localStorage. Seed the same
  // value used by the official player before it creates its iframe so the
  // first open already starts with Hosana, the female interpreter.
  try {
    const key = "@vlibras/player";
    const saved = JSON.parse(window.localStorage.getItem(key) || "{}") as Record<string, unknown>;
    const state = saved.state && typeof saved.state === "object" ? saved.state as Record<string, unknown> : {};
    window.localStorage.setItem(key, JSON.stringify({ ...saved, state: { ...state, avatar: "hosana" } }));
  } catch {
    // The constructor/global configuration below is still applied.
  }
}

function configureGlobals() {
  setFemaleDefault();
  if (window.VLibrasWidget) {
    window.VLibrasWidget.avatar = "hosana";
    window.VLibrasWidget.position = "l";
  }
}

function pinLegacyWidget() {
  const widget = document.querySelector<HTMLElement>("[vw]");
  if (!widget) return;

  for (const [property, value] of Object.entries({
    position: "fixed",
    left: "16px",
    right: "auto",
    top: "auto",
    bottom: "16px",
    width: "56px",
    height: "56px",
    margin: "0",
    transform: "none",
    overflow: "visible",
    pointerEvents: "none",
    zIndex: "2147483638",
  })) {
    setImportant(widget, property, value);
  }

  const access = widget.querySelector<HTMLElement>("[vw-access-button]");
  if (access) {
    for (const [property, value] of Object.entries({
      position: "absolute",
      left: "0",
      right: "auto",
      top: "0",
      bottom: "auto",
      width: "56px",
      height: "56px",
      margin: "0",
      transform: "none",
      pointerEvents: "auto",
      zIndex: "2147483640",
    })) setImportant(access, property, value);
  }

  const panel = widget.querySelector<HTMLElement>("[vw-plugin-wrapper]");
  if (panel) {
    for (const [property, value] of Object.entries({
      position: "absolute",
      left: "0",
      right: "auto",
      top: "auto",
      bottom: "calc(100% + 12px)",
      width: "min(380px, calc(100vw - 32px))",
      height: "min(620px, calc(100vh - 96px))",
      maxWidth: "calc(100vw - 32px)",
      maxHeight: "calc(100vh - 96px)",
      margin: "0",
      transform: "none",
      overflow: "hidden",
      pointerEvents: "auto",
      zIndex: "2147483639",
    })) setImportant(panel, property, value);
  }
}

function pinAccessButton() {
  const host = document.getElementById("vlibras-access-wrapper") as HTMLElement | null;
  if (!host) return;

  for (const [property, value] of Object.entries({
    position: "fixed",
    left: "0px",
    right: "auto",
    top: "auto",
    bottom: "0px",
    width: "60px",
    height: "60px",
    margin: "0",
    transform: "none",
    zIndex: "2147483639",
    pointerEvents: "none",
  })) setImportant(host, property, value);

  const root = host.shadowRoot;
  if (!root) return;
  addShadowStyle(root, "claudia-vlibras-access-style", `
    #vlibras-access {
      position: fixed !important;
      left: 16px !important;
      right: auto !important;
      top: auto !important;
      bottom: 16px !important;
      width: 56px !important;
      height: 56px !important;
      margin: 0 !important;
      transform: none !important;
      pointer-events: auto !important;
      z-index: 2147483640 !important;
    }
    #vlibras-button {
      position: absolute !important;
      left: 0 !important;
      right: auto !important;
      top: 0 !important;
      bottom: auto !important;
      width: 44px !important;
      height: 44px !important;
    }
  `);
}

function pinOpenedPanel() {
  const host = document.getElementById("vlibras-app-root") as HTMLElement | null;
  if (!host) return;

  const panelStyle = {
    position: "fixed",
    left: "76px",
    right: "auto",
    top: "auto",
    bottom: "16px",
    width: "min(380px, calc(100vw - 92px))",
    height: "min(620px, calc(100vh - 32px))",
    maxWidth: "calc(100vw - 92px)",
    maxHeight: "calc(100vh - 32px)",
    margin: "0",
    transform: "none",
    zIndex: "2147483640",
  };
  for (const [property, value] of Object.entries(panelStyle)) setImportant(host, property, value);

  const root = host.shadowRoot;
  if (!root) return;
  addShadowStyle(root, "claudia-vlibras-panel-style", `
    :host {
      position: fixed !important;
      left: 76px !important;
      right: auto !important;
      top: auto !important;
      bottom: 16px !important;
      width: min(380px, calc(100vw - 92px)) !important;
      height: min(620px, calc(100vh - 32px)) !important;
      max-width: calc(100vw - 92px) !important;
      max-height: calc(100vh - 32px) !important;
      margin: 0 !important;
      transform: none !important;
      z-index: 2147483640 !important;
    }
    #vlibras-app {
      position: fixed !important;
      top: auto !important;
      left: 76px !important;
      right: auto !important;
      bottom: 16px !important;
      transform: none !important;
      width: min(380px, calc(100vw - 92px)) !important;
      height: min(620px, calc(100vh - 32px)) !important;
      max-width: calc(100vw - 92px) !important;
      max-height: calc(100vh - 32px) !important;
      margin: 0 !important;
      z-index: 2147483640 !important;
    }
  `);

  const app = root.getElementById("vlibras-app") as HTMLElement | null;
  if (!app) return;
  for (const [property, value] of Object.entries(panelStyle)) setImportant(app, property, value);
}

function pinDetachedPanels() {
  const panelStyle = {
    position: "fixed",
    left: "76px",
    right: "auto",
    top: "auto",
    bottom: "16px",
    width: "min(380px, calc(100vw - 92px))",
    maxWidth: "calc(100vw - 92px)",
    maxHeight: "calc(100vh - 32px)",
    margin: "0",
    transform: "none",
    zIndex: "2147483640",
  };
  const panels = document.querySelectorAll<HTMLElement>("body > .vpw-container, body > .vpw-wrapper, body > [class*='vpw-container'], body > [class*='vpw-wrapper']");
  panels.forEach((panel) => { for (const [property, value] of Object.entries(panelStyle)) setImportant(panel, property, value); });
}

export default function VlibrasWidget() {
  useEffect(() => {
    const initializeWidget = () => {
      if (!window.VLibras || window.__claudiaVlibrasInitialized) return;
      configureGlobals();
      try {
        new window.VLibras.Widget(WIDGET_SRC);
        window.__claudiaVlibrasInitialized = true;
        window.vlibras?.changeAvatar?.("hosana");
      } catch {
        // The retry loop handles slow or partial widget loads.
      }
    };

    const pin = () => {
      pinLegacyWidget();
      pinAccessButton();
      pinOpenedPanel();
      pinDetachedPanels();
    };

    const script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
    const onScriptLoad = () => {
      configureGlobals();
      initializeWidget();
      pin();
    };
    const injectScript = () => {
      if (window.VLibras || document.getElementById(SCRIPT_ID)) return;
      const externalScript = document.createElement("script");
      externalScript.id = SCRIPT_ID;
      externalScript.src = `${SCRIPT_SRC}?v=1`;
      externalScript.async = true;
      externalScript.addEventListener("load", onScriptLoad, { once: true });
      externalScript.addEventListener("error", () => externalScript.remove(), { once: true });
      document.body.appendChild(externalScript);
    };
    configureGlobals();
    if (window.VLibras) {
      initializeWidget();
    } else if (script) {
      script.addEventListener("load", onScriptLoad, { once: true });
      script.addEventListener("error", () => script.remove(), { once: true });
    } else {
      injectScript();
    }

    const observer = new MutationObserver(pin);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "style", "data-active", "data-expanded"],
    });
    const retryTimer = window.setInterval(() => {
      injectScript();
      configureGlobals();
      initializeWidget();
      pin();
    }, 350);
    const stopRetryTimer = window.setTimeout(() => window.clearInterval(retryTimer), 30000);

    pin();
    return () => {
      observer.disconnect();
      window.clearInterval(retryTimer);
      window.clearTimeout(stopRetryTimer);
      script?.removeEventListener("load", onScriptLoad);
    };
  }, []);

  // The official player creates its own shadow hosts. Rendering the legacy
  // [vw] container here creates a second button and an invisible click layer.
  return null;
}
