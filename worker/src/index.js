import WIDGET_JS from "./widget.txt";
import GENERATOR_HTML from "./generator.html";
import INSTALL_HTML from "./install.html";

const AIRTABLE_BASE_ID = "appkPuvsxFxEmy5fm";
const AIRTABLE_TABLE_ID = "tblnE0hIA1Z4LlXEz";
const R2_PUBLIC_BASE = "https://widget-assets.reachmax.app";

const WIDGET_FIELDS = [
  "Company name",
  "Contact number",
  "Company Logo",
  "Company website",
  "Short Company About",
  "Brand primary colour",
  "Widget Logo URL",
  "Widget Heading Text",
  "Widget Welcome Text",
  "Widget WA Label",
  "Widget WA Subtitle",
  "Widget WA Icon",
  "Widget Prefilled Message",
  "Widget Show Booking",
  "Widget CTA2 Type",
  "Widget Booking URL",
  "Widget CTA2 Phone",
  "Widget CTA2 Message",
  "Widget Booking Label",
  "Widget Booking Subtitle",
  "Widget Demo Icon",
  "Widget Position",
];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Max-Age": "86400",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

// ── Fetch all active contacts from Airtable ──────────────────
async function fetchContacts(env) {
  const params = new URLSearchParams();
  WIDGET_FIELDS.forEach((f) => params.append("fields[]", f));
  params.set("sort[0][field]", "Company name");
  params.set("sort[0][direction]", "asc");
  params.set("pageSize", "100");

  const allRecords = [];
  let offset = null;

  do {
    const p = new URLSearchParams(params);
    if (offset) p.set("offset", offset);

    const res = await fetch(
      `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}?${p}`,
      { headers: { Authorization: `Bearer ${env.AIRTABLE_TOKEN}` } }
    );
    const data = await res.json();
    if (data.records) {
      for (const r of data.records) {
        const f = r.fields;
        const logo = Array.isArray(f["Company Logo"]) && f["Company Logo"][0];
        allRecords.push({
          id: r.id,
          name: f["Company name"] || "",
          phone: (f["Contact number"] || "").replace(/[\s\n\r+]/g, ""),
          airtableLogo: logo ? logo.url : "",
          logoUrl: f["Widget Logo URL"] || "",
          color: f["Brand primary colour"] || "",
          heading: f["Widget Heading Text"] || "",
          welcome: f["Widget Welcome Text"] || "",
          waLabel: f["Widget WA Label"] || "",
          waSubtitle: f["Widget WA Subtitle"] || "",
          waIcon: f["Widget WA Icon"] || "",
          message: f["Widget Prefilled Message"] || "",
          showBooking: !!f["Widget Show Booking"],
          cta2Type: f["Widget CTA2 Type"] || "",
          bookingUrl: f["Widget Booking URL"] || "",
          cta2Phone: f["Widget CTA2 Phone"] || "",
          cta2Message: f["Widget CTA2 Message"] || "",
          bookingLabel: f["Widget Booking Label"] || "",
          bookingSubtitle: f["Widget Booking Subtitle"] || "",
          demoIcon: f["Widget Demo Icon"] || "",
          position: f["Widget Position"] || "right",
        });
      }
    }
    offset = data.offset || null;
  } while (offset);

  return allRecords;
}

// ── Sync logo: download from Airtable, upload to R2 ──────────
async function syncLogo(env, recordId, airtableUrl) {
  if (!airtableUrl) return { error: "No Airtable logo URL provided" };

  // Download the image from Airtable
  const imgRes = await fetch(airtableUrl);
  if (!imgRes.ok) return { error: "Failed to download image from Airtable" };

  const contentType = imgRes.headers.get("content-type") || "image/png";
  const ext = contentType.includes("svg") ? "svg"
    : contentType.includes("png") ? "png"
    : contentType.includes("webp") ? "webp"
    : "jpg";

  const key = `logos/${recordId}.${ext}`;
  const body = await imgRes.arrayBuffer();

  // Upload to R2
  await env.WIDGET_ASSETS.put(key, body, {
    httpMetadata: { contentType },
  });

  const publicUrl = `${R2_PUBLIC_BASE}/${key}`;

  // Update Airtable with permanent URL
  await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}/${recordId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${env.AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: { "Widget Logo URL": publicUrl },
      }),
    }
  );

  return { url: publicUrl };
}

// ── Save widget settings back to Airtable ─────────────────────
async function saveSettings(env, recordId, settings) {
  const fields = {};

  if (settings.phone !== undefined) fields["Contact number"] = settings.phone;
  if (settings.color !== undefined) fields["Brand primary colour"] = settings.color;
  if (settings.heading !== undefined) fields["Widget Heading Text"] = settings.heading;
  if (settings.welcome !== undefined) fields["Widget Welcome Text"] = settings.welcome;
  if (settings.waLabel !== undefined) fields["Widget WA Label"] = settings.waLabel;
  if (settings.waSubtitle !== undefined) fields["Widget WA Subtitle"] = settings.waSubtitle;
  if (settings.waIcon !== undefined) fields["Widget WA Icon"] = settings.waIcon;
  if (settings.message !== undefined) fields["Widget Prefilled Message"] = settings.message;
  if (settings.showBooking !== undefined) fields["Widget Show Booking"] = !!settings.showBooking;
  if (settings.cta2Type !== undefined) fields["Widget CTA2 Type"] = settings.cta2Type;
  if (settings.bookingUrl !== undefined) fields["Widget Booking URL"] = settings.bookingUrl;
  if (settings.cta2Phone !== undefined) fields["Widget CTA2 Phone"] = settings.cta2Phone;
  if (settings.cta2Message !== undefined) fields["Widget CTA2 Message"] = settings.cta2Message;
  if (settings.bookingLabel !== undefined) fields["Widget Booking Label"] = settings.bookingLabel;
  if (settings.bookingSubtitle !== undefined) fields["Widget Booking Subtitle"] = settings.bookingSubtitle;
  if (settings.demoIcon !== undefined) fields["Widget Demo Icon"] = settings.demoIcon;
  if (settings.position !== undefined) fields["Widget Position"] = settings.position === "left" ? "left" : "right";
  if (settings.embedCode !== undefined) fields["Widget Embed Code"] = settings.embedCode;
  if (settings.installLink !== undefined) fields["Widget Install Link"] = settings.installLink;

  const res = await fetch(
    `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}/${recordId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${env.AIRTABLE_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields }),
    }
  );

  const data = await res.json();
  if (data.error) return { error: data.error.message };
  return { ok: true };
}

// ── Serve R2 images publicly ──────────────────────────────────
async function serveR2(env, key) {
  const obj = await env.WIDGET_ASSETS.get(key);
  if (!obj) return new Response("Not found", { status: 404 });

  return new Response(obj.body, {
    headers: {
      "Content-Type": obj.httpMetadata?.contentType || "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
      ...corsHeaders,
    },
  });
}

// ── Main router ───────────────────────────────────────────────
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    // Generator UI (generator.reachmax.app)
    if (url.hostname === "generator.reachmax.app" && (url.pathname === "/" || url.pathname === "/index.html")) {
      return new Response(GENERATOR_HTML, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      });
    }

    // Install page
    if (url.pathname === "/install" || url.pathname === "/install.html") {
      return new Response(INSTALL_HTML, {
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-cache",
        },
      });
    }

    // Widget JS
    if (url.pathname === "/" || url.pathname === "/widget.js") {
      return new Response(WIDGET_JS, {
        headers: {
          "Content-Type": "application/javascript; charset=utf-8",
          ...corsHeaders,
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    // List contacts
    if (url.pathname === "/api/contacts" && request.method === "GET") {
      try {
        const contacts = await fetchContacts(env);
        return jsonResponse(contacts);
      } catch (err) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    // Sync logo to R2
    if (url.pathname === "/api/sync-logo" && request.method === "POST") {
      try {
        const { recordId, airtableUrl } = await request.json();
        if (!recordId || !airtableUrl) {
          return jsonResponse({ error: "recordId and airtableUrl required" }, 400);
        }
        const result = await syncLogo(env, recordId, airtableUrl);
        return jsonResponse(result, result.error ? 500 : 200);
      } catch (err) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    // Save settings to Airtable
    if (url.pathname === "/api/save-settings" && request.method === "POST") {
      try {
        const { recordId, settings } = await request.json();
        if (!recordId) return jsonResponse({ error: "recordId required" }, 400);
        const result = await saveSettings(env, recordId, settings);
        return jsonResponse(result, result.error ? 500 : 200);
      } catch (err) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    // Serve R2 assets (logos/*)
    if (url.pathname.startsWith("/logos/")) {
      return serveR2(env, url.pathname.slice(1));
    }

    return new Response("Not found", { status: 404 });
  },
};
