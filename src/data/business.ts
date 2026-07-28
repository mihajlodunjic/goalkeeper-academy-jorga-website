export type PhoneLink = {
  display: string;
  href: string;
};

export type ContactFormConfig = {
  enabled: boolean;
  endpoint: string | null;
};

const siteUrl = import.meta.env.SITE_URL || "http://localhost:4321";

export const business = {
  name: "Golmanska akademija Jorgačević",
  shortName: "Goalkeeper Academy Jorga",
  areaServed: "Beograd, Srbija",
  city: "Beograd",
  founder: "Bojan Jorgačević",
  lang: "sr-Latn",
  locale: "sr_RS",
  siteUrl,
  logoPath: "/images/brand/logo-goalkeeper-academy-jorga.png",
  logoWidth: 1254,
  logoHeight: 1254,
  summary:
    "Specijalizovani individualni i grupni rad sa golmanima, škola golmana, fizička priprema i kampovi.",
  phones: [
    { display: "+381 66 188 478", href: "tel:+38166188478" },
    { display: "+381 66 000 999", href: "tel:+38166000999" },
  ] satisfies PhoneLink[],
  instagram: {
    handle: "@goalkeeper_academy_jorga",
    url: "https://www.instagram.com/goalkeeper_academy_jorga/",
  },
  contactForm: {
    enabled: false,
    endpoint: null,
  } satisfies ContactFormConfig,
  flags: {
    showContactForm: false,
    showPhotoCreditsPage: false,
    showMap: false,
  },
} as const;

if (business.phones.length === 0 || business.phones.some((phone) => !phone.display || !phone.href)) {
  throw new Error("Business telefoni moraju biti definisani u jednom izvoru.");
}

if (!business.instagram.handle || !business.instagram.url) {
  throw new Error("Instagram podaci moraju biti definisani.");
}
