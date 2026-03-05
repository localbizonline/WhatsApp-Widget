(function () {
  "use strict";

  const CONFIG = {
    phoneNumber: "27787869161",
    brandName: "Reach",
    brandUrl: "https://www.reachmax.app/",
    greeting: "Hi there! 👋",
    subtitle: "Chat with us on WhatsApp",
    placeholder: "Type a message...",
    defaultMessage: "Hi! I'd like to know more.",
    colors: {
      primary: "#000000",
      primaryHover: "#333333",
      accent: "#D63A2F",
      background: "#FFFFFF",
      backgroundSecondary: "#F7F7F7",
      text: "#000000",
      textLight: "#FFFFFF",
      textMuted: "#888888",
      border: "#E6E6E6",
      whatsapp: "#25D366",
    },
  };

  const WIDGET_ID = "reach-wa-widget";

  // Prevent double-init
  if (document.getElementById(WIDGET_ID)) return;

  // ── Load Font ────────────────────────────────────────────────────────
  if (!document.querySelector('link[href*="DM+Sans"]')) {
    const font = document.createElement("link");
    font.rel = "stylesheet";
    font.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap";
    document.head.appendChild(font);
  }

  // ── Styles ──────────────────────────────────────────────────────────
  const styles = document.createElement("style");
  styles.textContent = `
    #${WIDGET_ID} {
      --wa-primary: ${CONFIG.colors.primary};
      --wa-primary-hover: ${CONFIG.colors.primaryHover};
      --wa-accent: ${CONFIG.colors.accent};
      --wa-bg: ${CONFIG.colors.background};
      --wa-bg-secondary: ${CONFIG.colors.backgroundSecondary};
      --wa-text: ${CONFIG.colors.text};
      --wa-text-light: ${CONFIG.colors.textLight};
      --wa-text-muted: ${CONFIG.colors.textMuted};
      --wa-border: ${CONFIG.colors.border};
      --wa-whatsapp: ${CONFIG.colors.whatsapp};
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      position: fixed;
      bottom: 24px;
      right: 24px;
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

    #${WIDGET_ID} a {
      text-decoration: none;
      color: inherit;
    }

    #${WIDGET_ID} button {
      font-family: inherit;
      border: none;
      background: none;
      cursor: pointer;
      -webkit-appearance: none;
      appearance: none;
    }

    #${WIDGET_ID} input {
      font-family: inherit;
      -webkit-appearance: none;
      appearance: none;
    }

    /* ── Trigger Button ─────────────────────────────────────────── */
    #${WIDGET_ID} .wa-trigger {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--wa-primary);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.2s ease;
      position: relative;
    }

    #${WIDGET_ID} .wa-trigger:hover {
      transform: scale(1.08);
      background: var(--wa-primary-hover);
    }

    #${WIDGET_ID} .wa-trigger svg {
      width: 32px;
      height: 32px;
      fill: var(--wa-text-light);
      transition: opacity 0.2s ease, transform 0.3s ease;
    }

    #${WIDGET_ID} .wa-trigger .wa-icon-close {
      position: absolute;
      opacity: 0;
      transform: rotate(-90deg);
    }

    #${WIDGET_ID}.wa-open .wa-trigger .wa-icon-wa {
      opacity: 0;
      transform: rotate(90deg);
    }

    #${WIDGET_ID}.wa-open .wa-trigger .wa-icon-close {
      opacity: 1;
      transform: rotate(0deg);
    }

    /* Notification dot */
    #${WIDGET_ID} .wa-trigger .wa-dot {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 14px;
      height: 14px;
      background: var(--wa-accent);
      border-radius: 50%;
      border: 2px solid var(--wa-bg);
      transition: opacity 0.2s ease;
    }

    #${WIDGET_ID}.wa-open .wa-trigger .wa-dot {
      opacity: 0;
    }

    /* ── Chat Panel ─────────────────────────────────────────────── */
    #${WIDGET_ID} .wa-panel {
      position: absolute;
      bottom: 72px;
      right: 0;
      width: 370px;
      max-height: 500px;
      background: var(--wa-bg);
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      opacity: 0;
      transform: translateY(16px) scale(0.95);
      transform-origin: bottom right;
      pointer-events: none;
      transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    #${WIDGET_ID}.wa-open .wa-panel {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: all;
    }

    /* Header */
    #${WIDGET_ID} .wa-header {
      background: var(--wa-primary);
      padding: 24px 24px 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    #${WIDGET_ID} .wa-header-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    #${WIDGET_ID} .wa-logo {
      height: 28px;
      filter: invert(1);
    }

    #${WIDGET_ID} .wa-header-wa-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      padding: 5px 12px 5px 8px;
    }

    #${WIDGET_ID} .wa-header-wa-badge svg {
      width: 16px;
      height: 16px;
      fill: var(--wa-whatsapp);
      opacity: 1;
      transform: none;
      position: static;
    }

    #${WIDGET_ID} .wa-header-wa-badge span {
      font-size: 11px;
      font-weight: 600;
      color: var(--wa-whatsapp);
      letter-spacing: 0.3px;
    }

    #${WIDGET_ID} .wa-header-subtitle {
      display: flex;
      align-items: center;
      gap: 0;
      margin: 0;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.3;
    }

    #${WIDGET_ID} .wa-online-dot {
      width: 8px;
      height: 8px;
      background: var(--wa-whatsapp);
      border-radius: 50%;
      display: inline-block;
      margin-right: 6px;
      flex-shrink: 0;
    }

    /* Chat Body */
    #${WIDGET_ID} .wa-body {
      padding: 20px 24px;
      background: var(--wa-bg-secondary);
      min-height: 100px;
    }

    #${WIDGET_ID} .wa-bubble {
      background: var(--wa-bg);
      padding: 12px 16px;
      border-radius: 0 12px 12px 12px;
      font-size: 14px;
      line-height: 1.5;
      color: var(--wa-text);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
      display: inline-block;
      max-width: 85%;
      position: relative;
      animation: wa-bubble-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
    }

    @keyframes wa-bubble-in {
      from {
        opacity: 0;
        transform: translateY(8px) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    #${WIDGET_ID} .wa-bubble-time {
      font-size: 11px;
      color: var(--wa-text-muted);
      margin-top: 6px;
    }

    /* Input Area */
    #${WIDGET_ID} .wa-input-area {
      padding: 16px 24px;
      background: var(--wa-bg);
      border-top: 1px solid var(--wa-border);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    #${WIDGET_ID} .wa-input {
      flex: 1;
      border: 1px solid var(--wa-border);
      border-radius: 24px;
      padding: 10px 18px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      background: var(--wa-bg-secondary);
      color: var(--wa-text);
      transition: border-color 0.2s ease;
    }

    #${WIDGET_ID} .wa-input::placeholder {
      color: var(--wa-text-muted);
    }

    #${WIDGET_ID} .wa-input:focus {
      border-color: var(--wa-primary);
    }

    #${WIDGET_ID} .wa-send-btn {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--wa-whatsapp);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: transform 0.2s ease, background 0.2s ease;
    }

    #${WIDGET_ID} .wa-send-btn:hover {
      transform: scale(1.06);
      background: #20bd5a;
    }

    #${WIDGET_ID} .wa-send-btn svg {
      width: 20px;
      height: 20px;
      fill: var(--wa-text-light);
    }

    /* Powered By */
    #${WIDGET_ID} .wa-powered {
      text-align: center;
      padding: 10px 24px 14px;
      background: var(--wa-bg);
      font-size: 11px;
      color: var(--wa-text-muted);
    }

    #${WIDGET_ID} .wa-powered a {
      color: var(--wa-text);
      text-decoration: none;
      font-weight: 600;
      transition: color 0.2s ease;
    }

    #${WIDGET_ID} .wa-powered a:hover {
      color: var(--wa-accent);
    }

    /* ── Responsive ──────────────────────────────────────────────── */
    @media (max-width: 440px) {
      #${WIDGET_ID} {
        bottom: 16px;
        right: 16px;
        left: 16px;
      }

      #${WIDGET_ID} .wa-panel {
        width: auto;
        left: 0;
        right: 0;
      }
    }
  `;
  document.head.appendChild(styles);

  // ── SVG Icons ───────────────────────────────────────────────────────
  const whatsappIcon = `<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

  const closeIcon = `<svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>`;

  const sendIcon = `<svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>`;

  const nicciLogo = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 1120 276" class="wa-logo"><g clip-path="url(#wa-clip)"><path fill="black" d="M347.887 211.771C347.887 211.57 347.203 211.089 347.282 210.387L347.808 209.505C366.317 192.088 383.269 172.244 401.798 154.968C411.509 145.913 427.102 130.402 440.89 141.06C448.478 146.926 449.341 157.665 449.053 166.639L443.489 194.103C446.891 191.867 449.996 188.428 452.803 185.47C464.775 172.806 487.391 144.048 503.361 139.566C517.645 135.556 538.723 145.192 538.287 162.027C537.533 190.835 493.194 227.263 493.095 249.382C493.065 255.76 498.193 259.63 504.313 258.607C513.489 257.063 538.931 231.193 546.916 223.463C572.895 198.295 596.979 171.292 621.678 144.871L665.55 140.729C665.838 141.903 665.243 142.494 664.846 143.397C661.077 151.92 653.181 162.548 648.311 171.051C634.682 194.895 619.019 222.791 608.376 247.999C600.748 266.057 609.308 263.831 620.854 255.348C662.505 224.716 714.551 146.204 766.459 141.582C780.078 140.369 798.16 145.061 801.93 160.423C806.185 177.729 792.933 192.339 775.386 184.999C760.904 178.942 770.744 153.323 785.335 156.522L784.898 154.206C773.114 151.097 764.663 157.926 757.432 166.298C745.658 179.915 715.791 231.033 714.016 247.999C712.815 259.409 714.75 265.767 727.496 263.881C736.87 262.488 754.744 248.48 762.62 242.233C784.938 224.565 803.299 203.328 823.633 183.585C846.408 161.485 869.39 140.78 903.989 143.758C921.972 145.302 933.141 160.392 925.206 177.97C919.423 190.784 899.247 191.797 893.931 178.742C889.249 167.261 899.952 160.202 909.573 157.655C912.668 155.549 904.842 153.654 903.255 153.654C901.668 153.654 898.444 154.777 896.936 155.409C877.365 163.561 851.685 216.554 843.233 236.488C839.91 244.319 831.568 258.276 842.579 263.741C854.779 269.797 870.144 257.775 879.429 250.515C917.657 220.645 950.232 182.512 984.364 148.28C995.275 148.129 1006.18 146.435 1017.05 145.974C1019.39 145.873 1023.08 145.713 1025.27 146.004C1026.3 146.144 1026.56 145.593 1026.36 147.117C1010.98 174.43 994.898 201.533 980.605 229.459C977.996 234.562 965.914 257.504 966.142 261.385C966.371 265.265 969.565 265.416 972.61 264.232C977.034 262.498 988.629 254.276 993.133 251.147C1009.38 239.847 1024.19 226.32 1039.41 213.686C1041.02 213.446 1040.29 213.927 1040.54 214.769C1042.82 222.47 1043.04 223.793 1037.55 229.108C1030.05 236.367 1019.11 244.599 1010.55 250.696C994.512 262.127 948.943 291.927 937.218 262.077C928.43 239.696 955.648 208.252 961.292 187.365C961.431 186.844 962.552 182.773 960.548 183.605C940.124 205.975 920.236 230.06 896.539 249.001C876.909 264.694 848.54 281.85 823.524 268.704C804.34 258.627 803.904 243.647 804.658 223.793C804.747 221.507 805.59 219.572 805.451 217.065C805.392 215.932 805.977 214.869 804.32 215.18C782.895 238.373 749.923 273.778 715.752 272.354C704.196 271.873 689.773 265.466 683.574 255.258C675.291 241.621 678.862 225.608 680.082 210.668C667.485 224.756 655.373 239.345 640.633 251.257C625.526 263.46 600.054 280.165 581.901 264.794C572.121 256.512 576.545 238.413 579.997 227.564C584.272 214.127 593.725 200.801 597.524 188.879C597.713 188.298 598.655 185.079 596.77 185.861C577.666 207.008 559.643 229.649 537.969 248.249C522.138 261.836 492.45 284.988 474.814 262.498C445.849 225.538 493.164 191.867 506.892 161.947C510.959 153.103 510.185 145.452 498.997 150.957C487.808 156.462 470.33 174.34 461.343 184.337C438.311 209.966 419.335 239.065 400.231 267.702C385.412 268.333 370.503 267.301 355.684 267.792C353.253 267.872 350.446 269.767 348.661 267.451C361.328 248.981 374.56 230.802 386.899 212.112C392.226 204.03 405.964 185.029 407.244 176.275C408.325 168.895 404.466 167.522 398.862 171.573C382.168 185.941 367.755 206.427 351.27 220.474C350.228 221.357 349.216 222.269 347.897 222.71C347.907 219.081 347.877 215.441 347.897 211.801L347.887 211.771Z"/><path fill="black" d="M1087.36 0.0802855L1085.91 36.8895C1095.83 38.4236 1105.98 38.6743 1115.92 40.0179C1116.57 40.1082 1120.79 40.6797 1119.35 42.1738L1076.17 70.3497L1063.56 107.249L1062.43 108.352L1036.36 88.0374L992.121 104.602L1019.54 67.9733L1004.78 36.1876L1049.45 35.0947C1059.02 26.7522 1067.71 17.427 1076.93 8.72358C1079.19 6.58783 1082.87 2.95804 1085.12 1.21334C1085.87 0.631772 1086.07 -0.240579 1087.36 0.0903125V0.0802855Z"/><path fill="black" d="M704.226 0.0803027L702.787 36.8895L736.949 41.0608L693.295 70.2394L680.796 107.62C679.884 108.884 680.013 108.021 679.289 107.65C674.111 104.993 656.435 88.3583 653.221 88.0575L609.001 104.602L637.152 68.0335L621.648 36.1776L666.324 35.0847C669.35 32.8186 672.157 30.1413 674.924 27.5945C683.494 19.7233 693.136 8.06182 701.984 1.20333C702.728 0.621762 702.926 -0.250589 704.216 0.0803027H704.226Z"/><path fill="black" d="M1084.19 229.619C1116.89 224.074 1122.86 266.528 1097.2 274.35C1077 280.506 1059.59 258.908 1070.23 240.318C1072.67 236.056 1079.3 230.441 1084.18 229.609L1084.19 229.619ZM1086.44 232.647C1072.24 234.743 1066.42 252.581 1074.39 263.992C1082.37 275.402 1101.16 273.999 1107.47 261.435C1115.08 246.274 1102.86 230.231 1086.44 232.657V232.647Z"/><path fill="black" d="M1082.9 242.223C1093.38 240.829 1105.13 244.389 1095.61 256.03L1099.27 261.024C1091.81 263.32 1094.2 254.606 1087.37 255.759V261.034H1082.9V242.233V242.223ZM1087.36 252.761C1096.88 253.674 1097.85 244.369 1087.36 245.983V252.761Z"/></g><path fill="black" d="M131.858 0.132062C237.377 -4.39863 308.315 108.536 258.379 202.078C210.477 291.81 83.8328 299.651 25.1927 216.36C-37.4789 127.349 23.7749 4.76754 131.858 0.125892V0.132062ZM129.201 5.74766C31.3446 10.6914 -25.7237 120.223 24.0153 204.525C74.7098 290.436 200.349 290.331 250.883 204.34C304.808 112.58 234.646 0.42178 129.201 5.74766Z"/><path fill="white" d="M129.2 5.74904C234.652 0.416997 304.806 112.581 250.882 204.342C200.348 290.338 74.7088 290.437 24.0143 204.526C-25.7309 120.225 31.3435 10.6989 129.2 5.74904ZM224.505 54.7607C225.029 54.3477 215.906 46.2233 215.179 45.6007C170.303 7.40721 104.482 7.40721 59.6064 45.6007C41.4836 61.0235 28.1443 82.0435 21.8876 105.048C32.6195 94.8034 43.2959 84.4784 55.0449 75.3492C67.2624 65.8563 88.6892 51.3087 104.556 52.1039C135.124 53.6326 132.141 87.3201 126.803 108.956C126.359 110.744 125.496 112.673 125.151 114.406C125.058 114.874 125.083 114.849 125.557 114.806C144.445 97.6636 163.967 79.886 185.782 66.4727C197.044 59.5441 210.913 52.4553 224.505 54.7607ZM207.245 76.4649C205.914 75.0903 203.738 75.0101 201.95 75.2567C192.279 76.582 171.943 93.8048 164.454 100.764C142.127 121.513 121.039 144.37 102.059 168.219C93.7808 178.618 86.2482 189.652 77.908 199.971C74.2588 204.483 67.4535 213.181 62.2201 215.338C58.1332 217.027 53.4052 216.799 49.1026 217.453C48.628 217.934 57.751 226.36 58.5647 227.069C88.7755 253.322 130.446 262.963 169.262 252.268C203.103 242.948 232.426 218.353 246.394 186.095C235.847 194.762 225.183 204.36 213.169 210.993C190.633 223.444 155.793 219.265 154.406 188.019C153.703 172.152 169.705 144.277 177.83 130.402C185.683 116.982 195.047 104.155 202.672 90.7597C203.96 88.4974 207.196 82.9743 207.745 80.7429C208.072 79.4052 208.263 77.5066 207.252 76.4649H207.245ZM80.9408 81.1928C80.2812 80.5086 78.5306 79.9785 77.5936 79.9353C70.3877 79.5778 57.5969 91.4932 52.345 96.326C40.6083 107.132 29.5621 118.739 17.8932 129.613C16.833 147.329 19.4651 165.378 26.4676 181.663C41.009 158.301 55.9387 135.099 69.5555 111.176C72.8657 105.363 82.5681 89.7056 81.9271 83.6154C81.8469 82.8325 81.4832 81.7661 80.9408 81.2052V81.1928ZM249.347 93.811C248.916 93.8665 248.854 94.2178 248.78 94.5692C247.27 101.775 246.425 106.663 243.571 113.617C234.06 136.776 219.13 157.37 206.999 179.093C204.311 183.901 193.086 202.646 206.697 199.496C212.091 198.245 219.666 191.495 224.049 187.865C234.719 179.019 245.02 169.267 254.901 159.558C259.382 137.694 257.083 114.64 249.341 93.811H249.347Z"/><path fill="black" d="M207.248 76.4629C208.253 77.5047 208.068 79.4094 207.741 80.7409C207.199 82.9723 203.957 88.4955 202.668 90.7577C195.049 104.159 185.686 116.98 177.826 130.4C169.702 144.275 153.7 172.156 154.402 188.017C155.789 219.269 190.623 223.442 213.166 210.991C225.174 204.358 235.844 194.76 246.391 186.093C232.417 218.351 203.094 242.946 169.258 252.266C130.448 262.955 88.7782 253.314 58.5613 227.067C57.7476 226.358 48.6245 217.932 49.0992 217.451C53.408 216.791 58.1298 217.025 62.2166 215.336C67.45 213.173 74.2615 204.481 77.9046 199.969C86.2447 189.65 93.7774 178.616 102.056 168.217C121.042 144.362 142.129 121.505 164.45 100.762C171.94 93.8028 192.275 76.58 201.947 75.2547C203.735 75.0082 205.911 75.0883 207.242 76.4629H207.248Z"/><path fill="black" d="M224.507 54.7585C210.915 52.4531 197.046 59.5419 185.783 66.4705C163.975 79.8838 144.446 97.6614 125.559 114.804C125.084 114.847 125.06 114.872 125.152 114.403C125.497 112.665 126.367 110.742 126.804 108.954C132.136 87.324 135.12 53.6304 104.558 52.1017C88.6848 51.3065 67.2642 65.8541 55.0467 75.347C43.2977 84.4762 32.6213 94.7951 21.8894 105.046C28.1461 82.0413 41.4854 61.0213 59.6082 45.5985C104.484 7.405 170.305 7.405 215.181 45.5985C215.908 46.2211 225.031 54.3455 224.507 54.7585Z"/><path fill="black" d="M80.9417 81.1913C81.4841 81.7522 81.8478 82.8248 81.9279 83.6015C82.5752 89.6917 72.8665 105.355 69.5564 111.162C55.9334 135.085 41.0099 158.293 26.4685 181.649C19.466 165.364 16.8338 147.321 17.8941 129.599C29.5691 118.731 40.6092 107.118 52.3459 96.3121C57.5916 91.4793 70.3885 79.5701 77.5945 79.9214C78.5376 79.9707 80.2821 80.4947 80.9417 81.1789V81.1913Z"/><path fill="black" d="M249.348 93.8093C257.084 114.638 259.384 137.692 254.908 159.557C245.027 169.265 234.727 179.017 224.057 187.863C219.674 191.494 212.098 198.25 206.704 199.495C193.094 202.645 204.325 183.899 207.006 179.091C219.137 157.369 234.067 136.768 243.579 113.615C246.433 106.662 247.277 101.773 248.787 94.5675C248.861 94.2162 248.923 93.8648 249.354 93.8093H249.348Z"/><defs><clipPath id="wa-clip"><rect transform="translate(347.272)" fill="white" height="275.422" width="772.38"/></clipPath></defs></svg>`;

  // ── Build DOM ───────────────────────────────────────────────────────
  const widget = document.createElement("div");
  widget.id = WIDGET_ID;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  widget.innerHTML = `
    <div class="wa-panel">
      <div class="wa-header">
        <div class="wa-header-top">
          ${nicciLogo}
          <div class="wa-header-wa-badge">
            ${whatsappIcon}
            <span>WhatsApp</span>
          </div>
        </div>
        <p class="wa-header-subtitle"><span class="wa-online-dot"></span>Typically replies instantly</p>
      </div>
      <div class="wa-body">
        <div class="wa-bubble">
          ${CONFIG.subtitle}<br>Tap the button below to start a conversation with us! 💬
          <div class="wa-bubble-time">${timeStr}</div>
        </div>
      </div>
      <div class="wa-input-area">
        <input
          type="text"
          class="wa-input"
          placeholder="${CONFIG.placeholder}"
          value="${CONFIG.defaultMessage}"
        />
        <button class="wa-send-btn" aria-label="Send on WhatsApp">${sendIcon}</button>
      </div>
      <div class="wa-powered">
        Powered by <a href="${CONFIG.brandUrl}" target="_blank" rel="noopener">${CONFIG.brandName}</a>
      </div>
    </div>
    <button class="wa-trigger" aria-label="Open WhatsApp chat">
      <span class="wa-icon-wa">${whatsappIcon}</span>
      <span class="wa-icon-close">${closeIcon}</span>
      <span class="wa-dot"></span>
    </button>
  `;

  document.body.appendChild(widget);

  // ── Interactions ────────────────────────────────────────────────────
  const trigger = widget.querySelector(".wa-trigger");
  const panel = widget.querySelector(".wa-panel");
  const input = widget.querySelector(".wa-input");
  const sendBtn = widget.querySelector(".wa-send-btn");

  function toggle() {
    widget.classList.toggle("wa-open");
    if (widget.classList.contains("wa-open")) {
      input.focus();
    }
  }

  function sendToWhatsApp() {
    const message = encodeURIComponent(input.value.trim() || CONFIG.defaultMessage);
    const url = `https://wa.me/${CONFIG.phoneNumber}?text=${message}`;
    window.open(url, "_blank", "noopener");
  }

  trigger.addEventListener("click", toggle);

  sendBtn.addEventListener("click", function (e) {
    e.preventDefault();
    sendToWhatsApp();
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendToWhatsApp();
    }
  });

  // Close on Escape
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && widget.classList.contains("wa-open")) {
      toggle();
    }
  });

  // Close on outside click
  document.addEventListener("click", function (e) {
    if (
      widget.classList.contains("wa-open") &&
      !panel.contains(e.target) &&
      !trigger.contains(e.target)
    ) {
      toggle();
    }
  });
})();
