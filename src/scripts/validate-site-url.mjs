const siteUrl = process.env.SITE_URL;

if (!siteUrl) {
  throw new Error("SITE_URL mora biti definisan za strogi produkcijski build.");
}

const fallbackHosts = ["localhost", "example.com", "example.invalid", "127.0.0.1"];
const parsed = new URL(siteUrl);

if (fallbackHosts.includes(parsed.hostname)) {
  throw new Error("SITE_URL ne sme biti demo ili lokalni domen.");
}
