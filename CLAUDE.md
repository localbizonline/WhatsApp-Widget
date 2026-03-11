# WhatsApp Widget

## What It Is
A configurable WhatsApp chat widget that clients embed on their websites. Shows a floating WhatsApp button that opens a chat panel with company branding, a WhatsApp CTA, and an optional second CTA (booking link, phone call, or second WhatsApp number).

## How It Works
1. **Generator UI** (`generator.reachmax.app`) — internal admin tool to select a client from Airtable, configure widget settings (colors, text, icons, CTAs), preview live, and generate the embed code.
2. **Widget JS** (`widget.reachmax.app/widget.js`) — the embeddable script. Clients add a `<script>` tag with a `data-id` attribute (Airtable record ID). On load it fetches config from the worker API and renders the widget.
3. **Install page** (`widget.reachmax.app/install`) — client-facing install instructions page (WordPress, Shopify, HTML).
4. **API endpoints** on the worker handle config fetch, logo sync, and settings save.

## Hosting & Infrastructure
- **Cloudflare Worker** named `whatsapp-widget` — deployed on the **Local Pros** Cloudflare account (`CLOUDFLARE_ACCOUNT_ID: 9cae6404b337b12ce3820fd7b9b81d43`)
- **Custom domains:**
  - `widget.reachmax.app` — serves widget.js + API + install page
  - `generator.reachmax.app` — serves the generator/admin UI
- **Cloudflare R2 bucket** `widget-assets` — stores synced client logos at `widget-assets.reachmax.app/logos/{recordId}.{ext}`
- **Airtable** — all widget config lives in the **ReachMax Onboarding** base:
  - Base ID: `appkPuvsxFxEmy5fm`
  - Table ID: `tblnE0hIA1Z4LlXEz`
  - PAT stored as worker secret `AIRTABLE_TOKEN`

## Project Structure
```
worker/
  src/index.js        — Cloudflare Worker (main router + API)
  src/widget.txt      — widget JS source (imported as text)
  src/generator.html  — generator UI HTML
  src/install.html    — install instructions page
  wrangler.toml       — worker config (routes, R2 binding)
  dist/               — built output
```

Root-level `.html` and `.js` files are older standalone versions / demos (not deployed).

## API Routes (on widget.reachmax.app)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` or `/widget.js` | Serves the embeddable widget JS |
| GET | `/api/contacts` | Lists all clients from Airtable |
| POST | `/api/sync-logo` | Downloads logo from Airtable, uploads to R2, updates Airtable with permanent URL |
| POST | `/api/save-settings` | Saves widget config back to Airtable |
| GET | `/logos/*` | Serves logo images from R2 |
| GET | `/install` | Client-facing install instructions |

## Deploying
```bash
cd worker
npx wrangler deploy
```

## Key Notes
- Widget JS is stored as `widget.txt` so wrangler imports it as a text string (configured via `[[rules]]` in wrangler.toml)
- Logos are synced from Airtable's expiring CDN URLs to R2 for permanent hosting
- The `Widget WA Number Formatted` formula field is preferred over raw `Widget WA Number` for the phone number
