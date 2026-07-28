export type PageSeo = {
  slug: string;
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  noindex?: boolean;
};

export const pageSeo: Record<string, PageSeo> = {
  home: {
    slug: "/",
    title: "Golmanska akademija Jorgačević | Treninzi golmana Beograd",
    description:
      "Individualni i grupni treninzi, škola golmana, fizička priprema i kampovi Golmanske akademije Jorgačević u Beogradu.",
    ogTitle: "Golmanska akademija Jorgačević",
    ogDescription:
      "Specijalizovani rad sa golmanima različitih uzrasta i nivoa — tehnika, odluka, pozicioniranje, igra nogom i kampovi.",
  },
  programi: {
    slug: "/programi",
    title: "Programi treninga golmana | Golmanska akademija Jorgačević",
    description:
      "Individualni i grupni golmanski treninzi, škola golmana, fizička priprema i dodatni rad za klupske i seniorske golmane u Beogradu.",
    ogTitle: "Programi rada sa golmanima",
    ogDescription:
      "Izaberite format rada prema uzrastu, iskustvu, cilju i obavezama golmana u matičnom klubu.",
  },
  kampovi: {
    slug: "/kampovi",
    title: "Golmanski kampovi | Golmanska akademija Jorgačević",
    description:
      "Golmanski kampovi sa specijalizovanim radom na tehnici, reakciji, pozicioniranju, igri nogom i fizičkoj pripremi.",
    ogTitle: "Golmanski kampovi akademije Jorgačević",
    ogDescription: "Intenzivan rad i iskustvo grupe koja deli isti zahtev — golmansku poziciju.",
  },
  akademija: {
    slug: "/o-akademiji",
    title: "O Golmanskoj akademiji Jorgačević i Bojanu Jorgačeviću",
    description:
      "Upoznajte pristup Golmanske akademije Jorgačević i karijeru osnivača Bojana Jorgačevića, nekadašnjeg reprezentativca Srbije.",
    ogTitle: "O Golmanskoj akademiji Jorgačević",
    ogDescription:
      "Profesionalno golmansko iskustvo prevedeno u specijalizovani rad sa golmanima različitih uzrasta i nivoa.",
  },
  kontakt: {
    slug: "/kontakt",
    title: "Kontakt | Golmanska akademija Jorgačević Beograd",
    description:
      "Kontaktirajte Golmansku akademiju Jorgačević za informacije o programima, aktuelnim terminima, lokacijama treninga i kampovima.",
    ogTitle: "Kontaktirajte Golmansku akademiju Jorgačević",
    ogDescription:
      "Pošaljite uzrast, iskustvo i cilj golmana kako bi prvi razgovor o programu bio konkretan.",
  },
  notFound: {
    slug: "/404",
    title: "Stranica nije pronađena | Golmanska akademija Jorgačević",
    description: "Stranica koju tražite ne postoji ili je promenila adresu.",
    ogTitle: "Stranica nije pronađena",
    ogDescription: "Vratite se na početnu ili otvorite pregled programa akademije.",
    noindex: true,
  },
  photoCredits: {
    slug: "/fotografije-i-licence",
    title: "Fotografije i licence | Golmanska akademija Jorgačević",
    description: "Pregled lokalno korišćenih fotografija i njihovih licenci.",
    ogTitle: "Fotografije i licence",
    ogDescription: "Pregled izvora i licenci za spoljne fotografije korišćene na sajtu.",
    noindex: true,
  },
};

const invalidSeoEntry = Object.values(pageSeo).find((entry) => !entry.title || !entry.description);

if (invalidSeoEntry) {
  throw new Error(`SEO podaci nedostaju za rutu ${invalidSeoEntry.slug}.`);
}
