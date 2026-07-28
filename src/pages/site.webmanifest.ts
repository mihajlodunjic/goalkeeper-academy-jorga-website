import type { APIRoute } from "astro";

export const GET: APIRoute = () => {
  const body = {
    name: "Golmanska akademija Jorgačević",
    short_name: "GA Jorga",
    lang: "sr-Latn",
    start_url: "/",
    display: "standalone",
    background_color: "#071523",
    theme_color: "#071523",
    icons: [
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon-64.png",
        sizes: "64x64",
        type: "image/png",
      },
    ],
  };

  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/manifest+json; charset=utf-8",
    },
  });
};
