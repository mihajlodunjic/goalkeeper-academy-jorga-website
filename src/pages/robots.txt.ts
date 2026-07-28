import type { APIRoute } from "astro";
import { business } from "../data/business";

export const GET: APIRoute = () => {
  const sitemapUrl = new URL("/sitemap-index.xml", business.siteUrl).toString();
  const body = `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
