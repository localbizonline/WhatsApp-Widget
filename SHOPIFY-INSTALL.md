# WhatsApp Widget — Shopify Installation

## Option 1: Theme Editor (Easiest)

1. In Shopify Admin, go to **Online Store → Themes**
2. Click **Customize** on your active theme
3. In the left sidebar, click **App embeds** (or scroll to the bottom and find **Custom Liquid**)
4. Add a **Custom Liquid** section
5. Paste the following into the Liquid box:

```html
<script src="https://YOUR-CDN-URL/whatsapp-widget.js" defer></script>
```

6. Save

## Option 2: Edit theme code directly

1. In Shopify Admin, go to **Online Store → Themes**
2. Click **⋯ → Edit code**
3. Open **Layout → theme.liquid**
4. Just before the closing `</body>` tag, paste:

```html
<script src="https://YOUR-CDN-URL/whatsapp-widget.js" defer></script>
```

5. Save

## Option 3: Upload as a theme asset (no external hosting needed)

1. In Shopify Admin, go to **Online Store → Themes**
2. Click **⋯ → Edit code**
3. Under **Assets**, click **Add a new asset**
4. Upload the `whatsapp-widget.js` file
5. Open **Layout → theme.liquid**
6. Just before the closing `</body>` tag, paste:

```html
<script src="{{ 'whatsapp-widget.js' | asset_url }}" defer></script>
```

7. Save

---

**Option 3 is recommended** — it keeps everything within Shopify and doesn't depend on external hosting.
