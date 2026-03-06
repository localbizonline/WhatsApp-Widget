import WIDGET_JS from "./widget.txt";

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (url.pathname === "/" || url.pathname === "/widget.js") {
      return new Response(WIDGET_JS, {
        headers: {
          "Content-Type": "application/javascript; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=3600, s-maxage=86400",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    return new Response("Not found", { status: 404 });
  },
};
