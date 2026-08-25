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
const LOCAL_PLAYER_SRC = "/api/vlibras/unity/index.html";
let draggedPanelPosition: { left: number; top: number } | null = null;
let preparedPanelHost: HTMLElement | null = null;
let accessButtonInteracted = false;

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

function isMobileViewport() {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 680px)").matches;
}

function getPanelLayout() {
  if (isMobileViewport()) {
    return {
      left: "68px",
      right: "auto",
      top: "auto",
      bottom: "16px",
      width: "min(300px, calc(100vw - 76px))",
      maxWidth: "calc(100vw - 76px)",
      maxHeight: "calc(100dvh - 32px)",
      height: "min(440px, calc(100dvh - 32px))",
    };
  }

  return {
    left: "76px",
    right: "auto",
    top: "auto",
    bottom: "16px",
    width: "min(380px, calc(100vw - 92px))",
    maxWidth: "calc(100vw - 92px)",
    maxHeight: "calc(100vh - 32px)",
    height: "min(440px, calc(100vh - 32px))",
  };
}

function clampPanelPosition(left: number, top: number, width: number, height: number) {
  const padding = isMobileViewport() ? 8 : 12;
  return {
    left: Math.max(padding, Math.min(left, window.innerWidth - width - padding)),
    top: Math.max(padding, Math.min(top, window.innerHeight - height - padding)),
  };
}

function applyDraggedPanelPosition(element: HTMLElement) {
  if (!draggedPanelPosition) return;
  const rect = element.getBoundingClientRect();
  const position = clampPanelPosition(
    draggedPanelPosition.left,
    draggedPanelPosition.top,
    rect.width,
    rect.height,
  );
  setImportant(element, "left", `${position.left}px`);
  setImportant(element, "top", `${position.top}px`);
  setImportant(element, "right", "auto");
  setImportant(element, "bottom", "auto");
  setImportant(element, "transform", "none");
}

function pinLegacyWidget() {
  const widget = document.querySelector<HTMLElement>("[vw]");
  if (!widget) return;
  const mobile = isMobileViewport();

  for (const [property, value] of Object.entries({
    position: "fixed",
    left: mobile ? "8px" : "16px",
    right: "auto",
    top: "auto",
    bottom: mobile ? "8px" : "16px",
    width: mobile ? "48px" : "56px",
    height: mobile ? "48px" : "56px",
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
      width: mobile ? "48px" : "56px",
      height: mobile ? "48px" : "56px",
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
      width: mobile ? "min(300px, calc(100vw - 24px))" : "min(380px, calc(100vw - 32px))",
      height: mobile ? "min(420px, calc(100dvh - 96px))" : "min(620px, calc(100vh - 96px))",
      maxWidth: mobile ? "calc(100vw - 24px)" : "calc(100vw - 32px)",
      maxHeight: mobile ? "calc(100dvh - 96px)" : "calc(100vh - 96px)",
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
  const mobile = isMobileViewport();

  for (const [property, value] of Object.entries({
    position: "fixed",
    left: "0px",
    right: "auto",
    top: "auto",
    bottom: "0px",
    width: mobile ? "56px" : "60px",
    height: mobile ? "56px" : "60px",
    margin: "0",
    transform: "none",
    zIndex: "2147483639",
    pointerEvents: "none",
  })) setImportant(host, property, value);

  const root = host.shadowRoot;
  if (!root) return;
  addShadowStyle(root, "claudia-vlibras-access-style", `
    #vlibras-access {
      display: flex !important;
      visibility: visible !important;
      opacity: 1 !important;
      position: fixed !important;
      left: 16px !important;
      right: auto !important;
      top: auto !important;
      bottom: ${mobile ? "16px" : "16px"} !important;
      width: ${mobile ? "48px" : "56px"} !important;
      height: ${mobile ? "48px" : "56px"} !important;
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
      width: ${mobile ? "40px" : "44px"} !important;
      height: ${mobile ? "40px" : "44px"} !important;
      overflow: hidden !important;
    }
    #vlibras-popup {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
  `);

  const button = root.getElementById("vlibras-button") as HTMLButtonElement | null;
  if (button && button.dataset.claudiaOpenBound !== "true") {
    button.dataset.claudiaOpenBound = "true";
    button.addEventListener("click", () => {
      const panel = document.getElementById("vlibras-app-root");
      const wasOpen = accessButtonInteracted && panel?.getAttribute("data-active") === "true";
      accessButtonInteracted = true;
      window.setTimeout(() => {
        const currentPanel = document.getElementById("vlibras-app-root");
        if (currentPanel) {
          currentPanel.setAttribute("data-active", wasOpen ? "false" : "true");
        }
        pinOpenedPanel();
      }, 0);
    });
  }
}

function pinOpenedPanel() {
  const host = document.getElementById("vlibras-app-root") as HTMLElement | null;
  if (!host) return;

  // The current VLibras script creates the shadow host already active. Keep
  // the panel visually closed until the visible access button is clicked,
  // while allowing the official player to finish loading in the background.
  if (preparedPanelHost !== host) {
    preparedPanelHost = host;
  }
  const isActive = accessButtonInteracted && host.getAttribute("data-active") === "true";
  const layout = getPanelLayout();

  const panelStyle = {
    position: "fixed",
    ...layout,
    margin: "0",
    transform: "none",
    translate: "none",
    animation: "none",
    transition: "none",
    zIndex: "2147483640",
  };
  for (const [property, value] of Object.entries(panelStyle)) setImportant(host, property, value);
  setImportant(host, "display", isActive ? "block" : "none");

  const root = host.shadowRoot;
  if (!root) return;
  const playerFrame = root.querySelector<HTMLIFrameElement>("iframe[title='vlibras-player']");
  if (playerFrame && playerFrame.getAttribute("src") !== LOCAL_PLAYER_SRC) {
    playerFrame.setAttribute("src", LOCAL_PLAYER_SRC);
  }
  addShadowStyle(root, "claudia-vlibras-panel-style", `
    :host {
      display: ${isActive ? "block" : "none"} !important;
      position: fixed !important;
      left: ${layout.left} !important;
      right: ${layout.right} !important;
      top: ${layout.top} !important;
      bottom: ${layout.bottom} !important;
      width: ${layout.width} !important;
      height: ${layout.height} !important;
      max-width: ${layout.maxWidth} !important;
      max-height: ${layout.maxHeight} !important;
      margin: 0 !important;
      transform: none !important;
      translate: none !important;
      animation: none !important;
      transition: none !important;
      z-index: 2147483640 !important;
    }
    #vlibras-app-content {
      opacity: 1 !important;
      visibility: visible !important;
    }
    #vlibras-app-content iframe {
      opacity: 1 !important;
      visibility: visible !important;
    }
    #vlibras-app {
      position: fixed !important;
      top: auto !important;
      left: ${layout.left} !important;
      right: ${layout.right} !important;
      bottom: ${layout.bottom} !important;
      transform: none !important;
      width: ${layout.width} !important;
      height: ${layout.height} !important;
      max-width: ${layout.maxWidth} !important;
      max-height: ${layout.maxHeight} !important;
      margin: 0 !important;
      z-index: 2147483640 !important;
    }
  `);

  const app = root.getElementById("vlibras-app") as HTMLElement | null;
  if (!app) return;
  for (const [property, value] of Object.entries(panelStyle)) setImportant(app, property, value);
  applyDraggedPanelPosition(host);
  applyDraggedPanelPosition(app);
  enablePanelDragging(root, host);
}

function enablePanelDragging(root: ShadowRoot, host: HTMLElement) {
  const handle = root.querySelector<HTMLElement>('#vlibras-app [class*="touch-none"]');
  if (!handle || handle.dataset.claudiaDragBound === "true") return;

  handle.dataset.claudiaDragBound = "true";
  handle.style.setProperty("touch-action", "none", "important");
  handle.style.setProperty("cursor", "move", "important");

  handle.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const rect = host.getBoundingClientRect();
    const start = { x: event.clientX, y: event.clientY, left: rect.left, top: rect.top };
    const onMove = (moveEvent: PointerEvent) => {
      const position = clampPanelPosition(
        start.left + moveEvent.clientX - start.x,
        start.top + moveEvent.clientY - start.y,
        rect.width,
        rect.height,
      );
      draggedPanelPosition = position;
      applyDraggedPanelPosition(host);
      const app = root.getElementById("vlibras-app") as HTMLElement | null;
      if (app) applyDraggedPanelPosition(app);
      moveEvent.preventDefault();
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };

    window.addEventListener("pointermove", onMove, { passive: false });
    window.addEventListener("pointerup", onUp, { once: true });
    window.addEventListener("pointercancel", onUp, { once: true });
    event.preventDefault();
  }, { passive: false });
}

function pinDetachedPanels() {
  const panelStyle = {
    position: "fixed",
    ...getPanelLayout(),
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
      if (!window.VLibras) {
        // Newer VLibras builds auto-create #vlibras-app-root and no longer
        // expose the legacy window.VLibras constructor.
        if (document.getElementById("vlibras-app-root")) {
          window.__claudiaVlibrasInitialized = true;
        }
        return;
      }
      if (window.__claudiaVlibrasInitialized) return;
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
      externalScript.src = `${SCRIPT_SRC}?v=2`;
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
      attributeFilter: ["class", "data-active", "data-expanded"],
    });
    const retryTimer = window.setInterval(() => {
      injectScript();
      configureGlobals();
      initializeWidget();
      pin();
    }, 350);
    const onViewportChange = () => pin();
    window.addEventListener("resize", onViewportChange);
    const stopRetryTimer = window.setTimeout(() => window.clearInterval(retryTimer), 30000);

    pin();
    return () => {
      observer.disconnect();
      window.clearInterval(retryTimer);
      window.clearTimeout(stopRetryTimer);
      window.removeEventListener("resize", onViewportChange);
      script?.removeEventListener("load", onScriptLoad);
      preparedPanelHost = null;
      accessButtonInteracted = false;
    };
  }, []);

  // The official player creates its own shadow hosts. Rendering the legacy
  // [vw] container here creates a second button and an invisible click layer.
  return null;
}
