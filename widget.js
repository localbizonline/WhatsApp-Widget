(function () {
  "use strict";

  // ── Read config from script tag data attributes ─────────────────────
  const scriptTag =
    document.currentScript ||
    document.querySelector('script[data-phone][src*="widget"]');

  const CONFIG = {
    phone: scriptTag?.getAttribute("data-phone") || "",
    brand: scriptTag?.getAttribute("data-brand") || "Our Team",
    logo: scriptTag?.getAttribute("data-logo") || "",
    color: scriptTag?.getAttribute("data-color") || "#25D366",
    welcome: scriptTag?.getAttribute("data-welcome") || "How can we help you today?",
    demoUrl: scriptTag?.getAttribute("data-demo-url") || "",
    demoLabel: scriptTag?.getAttribute("data-demo-label") || "Book a Free Demo",
    demoSubtitle:
      scriptTag?.getAttribute("data-demo-subtitle") ||
      "15-minute personalized walkthrough",
    waLabel: scriptTag?.getAttribute("data-wa-label") || "Chat on WhatsApp",
    waSubtitle:
      scriptTag?.getAttribute("data-wa-subtitle") ||
      "We typically reply within minutes",
    message: scriptTag?.getAttribute("data-message") || "Hi! I'd like to know more.",
    position: scriptTag?.getAttribute("data-position") || "right",
    brandUrl: scriptTag?.getAttribute("data-brand-url") || "https://www.reachmax.app",
    poweredBy: scriptTag?.getAttribute("data-powered-by") || "ReachMax",
  };

  const WIDGET_ID = "rmx-wa-widget";

  // Prevent double-init
  if (document.getElementById(WIDGET_ID)) return;

  // ── Load Font ───────────────────────────────────────────────────────
  if (!document.querySelector('link[href*="Inter"]')) {
    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(font);
  }

  // ── Colour helpers ──────────────────────────────────────────────────
  function hexToRgb(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3)
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    const n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function darken(hex, pct) {
    const [r, g, b] = hexToRgb(hex);
    const f = 1 - pct;
    return `rgb(${Math.round(r * f)},${Math.round(g * f)},${Math.round(b * f)})`;
  }

  const colorDark = darken(CONFIG.color, 0.25);

  // ── SVG Icons ───────────────────────────────────────────────────────
  const waIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

  const closeIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;

  const chevronIcon = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`;

  const calendarIcon = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/></svg>`;

  // ── Styles ──────────────────────────────────────────────────────────
  const posRight = CONFIG.position === "left" ? "left: 24px;" : "right: 24px;";
  const posRightPanel =
    CONFIG.position === "left"
      ? "left: 0; right: auto;"
      : "right: 0; left: auto;";
  const originCorner =
    CONFIG.position === "left" ? "bottom left" : "bottom right";

  const styles = document.createElement("style");
  styles.textContent = `
    #${WIDGET_ID} {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      position: fixed;
      bottom: 24px;
      ${posRight}
      z-index: 2147483647;
      line-height: normal;
      letter-spacing: normal;
      text-transform: none;
      direction: ltr;
    }

    #${WIDGET_ID} *, #${WIDGET_ID} *::before, #${WIDGET_ID} *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: inherit;
      -webkit-font-smoothing: antialiased;
    }

    #${WIDGET_ID} a { text-decoration: none; color: inherit; }
    #${WIDGET_ID} button { font-family: inherit; border: none; background: none; cursor: pointer; -webkit-appearance: none; appearance: none; }

    /* ── FAB ────────────────────────────────────────────────── */
    #${WIDGET_ID} .rmx-fab {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: ${CONFIG.color};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(0,0,0,0.25);
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.2s;
      position: relative;
    }

    #${WIDGET_ID} .rmx-fab:hover {
      transform: scale(1.08);
      background: ${colorDark};
    }

    #${WIDGET_ID} .rmx-fab svg {
      width: 30px;
      height: 30px;
      color: #fff;
      transition: opacity 0.25s, transform 0.3s;
    }

    #${WIDGET_ID} .rmx-fab .rmx-icon-close {
      position: absolute;
      opacity: 0;
      transform: rotate(-90deg);
    }

    #${WIDGET_ID}.rmx-open .rmx-fab .rmx-icon-wa { opacity: 0; transform: rotate(90deg); }
    #${WIDGET_ID}.rmx-open .rmx-fab .rmx-icon-close { opacity: 1; transform: rotate(0); }

    /* Notification dot */
    #${WIDGET_ID} .rmx-dot {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 14px;
      height: 14px;
      background: #ef4444;
      border-radius: 50%;
      border: 2px solid #fff;
      transition: opacity 0.2s;
    }
    #${WIDGET_ID}.rmx-open .rmx-dot { opacity: 0; }

    /* ── Panel ──────────────────────────────────────────────── */
    #${WIDGET_ID} .rmx-panel {
      position: absolute;
      bottom: 72px;
      ${posRightPanel}
      width: 370px;
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 12px 48px rgba(0,0,0,0.18);
      overflow: hidden;
      opacity: 0;
      transform: translateY(12px) scale(0.96);
      transform-origin: ${originCorner};
      pointer-events: none;
      transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
    }

    #${WIDGET_ID}.rmx-open .rmx-panel {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    /* ── Header ─────────────────────────────────────────────── */
    #${WIDGET_ID} .rmx-header {
      background: linear-gradient(135deg, ${CONFIG.color} 0%, ${colorDark} 100%);
      padding: 28px 24px 24px;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    #${WIDGET_ID} .rmx-header-logo {
      width: 52px;
      height: 52px;
      border-radius: 14px;
      background: rgba(255,255,255,0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
    }

    #${WIDGET_ID} .rmx-header-logo img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 14px;
    }

    #${WIDGET_ID} .rmx-header-logo svg {
      width: 28px;
      height: 28px;
      color: #fff;
    }

    #${WIDGET_ID} .rmx-header-text {
      color: #fff;
    }

    #${WIDGET_ID} .rmx-header-text .rmx-welcome-label {
      font-size: 13px;
      opacity: 0.85;
      font-weight: 400;
      margin-bottom: 2px;
    }

    #${WIDGET_ID} .rmx-header-text .rmx-brand-name {
      font-size: 20px;
      font-weight: 700;
      line-height: 1.2;
    }

    /* ── Body ───────────────────────────────────────────────── */
    #${WIDGET_ID} .rmx-body {
      padding: 20px 20px 8px;
    }

    #${WIDGET_ID} .rmx-subtitle {
      font-size: 15px;
      color: #374151;
      text-align: center;
      margin-bottom: 16px;
      font-weight: 500;
    }

    /* ── Action Cards ──────────────────────────────────────── */
    #${WIDGET_ID} .rmx-action {
      display: flex;
      align-items: center;
      gap: 14px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 14px;
      padding: 16px;
      margin-bottom: 12px;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s, box-shadow 0.2s;
      width: 100%;
      text-align: left;
    }

    #${WIDGET_ID} .rmx-action:hover {
      background: #f3f4f6;
      border-color: #d1d5db;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
    }

    #${WIDGET_ID} .rmx-action-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    #${WIDGET_ID} .rmx-action-icon.rmx-wa-icon {
      background: rgba(37,211,102,0.12);
      color: #25D366;
    }

    #${WIDGET_ID} .rmx-action-icon.rmx-wa-icon svg {
      width: 22px;
      height: 22px;
    }

    #${WIDGET_ID} .rmx-action-icon.rmx-demo-icon {
      background: rgba(37,211,102,0.12);
      color: ${CONFIG.color};
    }

    #${WIDGET_ID} .rmx-action-icon.rmx-demo-icon svg {
      width: 22px;
      height: 22px;
    }

    #${WIDGET_ID} .rmx-action-content {
      flex: 1;
      min-width: 0;
    }

    #${WIDGET_ID} .rmx-action-title {
      font-size: 15px;
      font-weight: 600;
      color: #111827;
      line-height: 1.3;
    }

    #${WIDGET_ID} .rmx-action-subtitle {
      font-size: 13px;
      color: #6b7280;
      line-height: 1.3;
      margin-top: 2px;
    }

    #${WIDGET_ID} .rmx-action-chevron {
      color: #9ca3af;
      flex-shrink: 0;
    }

    /* ── Powered By ────────────────────────────────────────── */
    #${WIDGET_ID} .rmx-powered {
      text-align: center;
      padding: 12px 20px 16px;
      font-size: 12px;
      color: #9ca3af;
    }

    #${WIDGET_ID} .rmx-powered a {
      color: ${CONFIG.color};
      font-weight: 600;
      transition: opacity 0.2s;
    }

    #${WIDGET_ID} .rmx-powered a:hover { opacity: 0.8; }

    /* ── Responsive ────────────────────────────────────────── */
    @media (max-width: 440px) {
      #${WIDGET_ID} {
        bottom: 16px;
        right: 16px;
        left: 16px;
      }
      #${WIDGET_ID} .rmx-panel {
        width: auto;
        left: 0;
        right: 0;
      }
    }

    /* ── Animation ─────────────────────────────────────────── */
    @keyframes rmx-fade-up {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    #${WIDGET_ID}.rmx-open .rmx-action {
      animation: rmx-fade-up 0.35s cubic-bezier(0.34,1.56,0.64,1) both;
    }

    #${WIDGET_ID}.rmx-open .rmx-action:nth-child(1) { animation-delay: 0.08s; }
    #${WIDGET_ID}.rmx-open .rmx-action:nth-child(2) { animation-delay: 0.16s; }
  `;
  document.head.appendChild(styles);

  // ── Build DOM ───────────────────────────────────────────────────────
  const widget = document.createElement("div");
  widget.id = WIDGET_ID;

  const logoHtml = CONFIG.logo
    ? `<img src="${CONFIG.logo}" alt="${CONFIG.brand}" />`
    : waIcon;

  const demoCard = CONFIG.demoUrl
    ? `<button class="rmx-action rmx-action-demo">
        <div class="rmx-action-icon rmx-demo-icon">${calendarIcon}</div>
        <div class="rmx-action-content">
          <div class="rmx-action-title">${CONFIG.demoLabel}</div>
          <div class="rmx-action-subtitle">${CONFIG.demoSubtitle}</div>
        </div>
        <div class="rmx-action-chevron">${chevronIcon}</div>
      </button>`
    : "";

  widget.innerHTML = `
    <div class="rmx-panel">
      <div class="rmx-header">
        <div class="rmx-header-logo">${logoHtml}</div>
        <div class="rmx-header-text">
          <div class="rmx-welcome-label">Welcome to</div>
          <div class="rmx-brand-name">${CONFIG.brand}</div>
        </div>
      </div>
      <div class="rmx-body">
        <p class="rmx-subtitle">${CONFIG.welcome}</p>
        <button class="rmx-action rmx-action-wa">
          <div class="rmx-action-icon rmx-wa-icon">${waIcon}</div>
          <div class="rmx-action-content">
            <div class="rmx-action-title">${CONFIG.waLabel}</div>
            <div class="rmx-action-subtitle">${CONFIG.waSubtitle}</div>
          </div>
          <div class="rmx-action-chevron">${chevronIcon}</div>
        </button>
        ${demoCard}
      </div>
      <div class="rmx-powered">Powered by <a href="${CONFIG.brandUrl}" target="_blank" rel="noopener">${CONFIG.poweredBy}</a></div>
    </div>
    <button class="rmx-fab" aria-label="Open WhatsApp chat">
      <span class="rmx-icon-wa">${waIcon}</span>
      <span class="rmx-icon-close">${closeIcon}</span>
      <span class="rmx-dot"></span>
    </button>
  `;

  document.body.appendChild(widget);

  // ── Interactions ────────────────────────────────────────────────────
  const fab = widget.querySelector(".rmx-fab");
  const panel = widget.querySelector(".rmx-panel");
  const waBtn = widget.querySelector(".rmx-action-wa");
  const demoBtn = widget.querySelector(".rmx-action-demo");

  function toggle() {
    widget.classList.toggle("rmx-open");
  }

  function openWhatsApp() {
    const msg = encodeURIComponent(CONFIG.message);
    window.open(
      `https://wa.me/${CONFIG.phone}?text=${msg}`,
      "_blank",
      "noopener"
    );
  }

  function openDemo() {
    if (CONFIG.demoUrl) {
      window.open(CONFIG.demoUrl, "_blank", "noopener");
    }
  }

  fab.addEventListener("click", toggle);
  waBtn.addEventListener("click", openWhatsApp);
  if (demoBtn) demoBtn.addEventListener("click", openDemo);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && widget.classList.contains("rmx-open")) toggle();
  });

  document.addEventListener("click", function (e) {
    if (
      widget.classList.contains("rmx-open") &&
      !panel.contains(e.target) &&
      !fab.contains(e.target)
    ) {
      toggle();
    }
  });
})();
