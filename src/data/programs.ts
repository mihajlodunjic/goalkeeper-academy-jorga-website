export type ProgramSummary = {
  id: string;
  slug: string;
  number: string;
  name: string;
  tag: string;
  summary: string;
  linkLabel: string;
};

export type ProgramDetail = {
  id: string;
  number: string;
  metadata: string;
  name: string;
  shortDescription: string;
  description: string[];
  audience?: string[];
  focus?: string[];
  pathway?: string[];
  cta: string;
  alt: string;
};

export const programSummaries: ProgramSummary[] = [
  {
    id: "individualni-trening",
    slug: "individualni-trening",
    number: "01",
    name: "Individualni trening",
    tag: "Rad prema konkretnom cilju",
    summary:
      "Fokusiran rad sa korekcijama koje polaze od nivoa golmana, tehničkih potreba i situacija koje želi da unapredi.",
    linkLabel: "O individualnom radu",
  },
  {
    id: "grupni-trening",
    slug: "grupni-trening",
    number: "02",
    name: "Grupni trening",
    tag: "Specijalizovani rad u grupi",
    summary:
      "Vežbe koje povezuju tehniku, reakciju, komunikaciju i takmičarski ritam sa drugim golmanima.",
    linkLabel: "O grupnom radu",
  },
  {
    id: "skola-golmana",
    slug: "skola-golmana",
    number: "03",
    name: "Škola golmana",
    tag: "Kontinuitet razvoja",
    summary:
      "Sistematski rad od osnovnog stava, hvatanja i padova do složenijih situacija i zahteva savremene igre.",
    linkLabel: "O školi golmana",
  },
  {
    id: "fizicka-priprema",
    slug: "fizicka-priprema",
    number: "04",
    name: "Fizička priprema",
    tag: "Zahtevi golmanskog pokreta",
    summary:
      "Rad na eksplozivnosti, koordinaciji, agilnosti i mobilnosti koje golman koristi pri reakciji, padu, ustajanju i promeni pravca.",
    linkLabel: "O fizičkoj pripremi",
  },
  {
    id: "klupski-i-seniorski-golmani",
    slug: "klupski-i-seniorski-golmani",
    number: "05",
    name: "Klupski i seniorski golmani",
    tag: "Dodatni rad uz takmičarski ciklus",
    summary:
      "Usmeren rad za golmane kojima je potrebna dodatna priprema tokom sezone, pauze, povratka u klub ili pripreme za naredni izazov.",
    linkLabel: "O radu sa naprednim golmanima",
  },
];

export const programDetails: ProgramDetail[] = [
  {
    id: "individualni-trening",
    number: "01",
    metadata: "01 · Fokusirana korekcija",
    name: "Individualni golmanski trening",
    shortDescription:
      "Rad usmeren na konkretne tehničke, fizičke ili situacione potrebe jednog golmana.",
    description: [
      "Individualni format omogućava da trener više vremena posveti početnom stavu, položaju tela, radu ruku i nogu, pravcu kretanja i odluci koja prethodi intervenciji. Sadržaj se bira prema trenutnom nivou i cilju golmana.",
      "Ovaj format može da odgovara početniku kome je potrebna jasna osnova, golmanu iz mlađih kategorija koji želi dodatnu korekciju ili seniorskom golmanu koji radi na precizno određenoj situaciji.",
    ],
    audience: [
      "Početnicima kojima je potrebna tehnička osnova",
      "Golmanima mlađih kategorija uz klupske treninge",
      "Naprednim i seniorskim golmanima sa konkretnim ciljem",
    ],
    focus: ["Početni stav i kretanje", "Hvatanje, odbijanje, pad i bacanje", "Pozicioniranje i odluka", "Igra nogom"],
    cta: "Pošalji cilj individualnog rada",
    alt: "Golman i trener tokom individualne korekcije na treningu",
  },
  {
    id: "grupni-trening",
    number: "02",
    metadata: "02 · Specijalizovani rad u grupi",
    name: "Grupni golmanski trening",
    shortDescription:
      "Rad sa drugim golmanima uvodi ritam, komunikaciju i situacije koje se ne mogu svesti na izolovano ponavljanje.",
    description: [
      "Grupa omogućava da golman uči posmatrajući druge, smenjuje uloge u vežbi i reaguje u promenljivom tempu. Trener zadržava fokus na golmanskoj tehnici, dok se deo zadataka izvodi kroz saradnju i takmičarski odnos.",
      "Raspored grupa treba povezati sa uzrastom, iskustvom i opterećenjem u matičnom klubu. Aktuelnu grupu i termin akademija potvrđuje u direktnom razgovoru.",
    ],
    focus: ["Reakcija i ponavljanje u ritmu", "Komunikacija sa drugim golmanima", "Situacije jedan na jedan", "Visoke lopte i prostor"],
    cta: "Proveri odgovarajuću grupu",
    alt: "Grupa golmana tokom specijalizovane vežbe",
  },
  {
    id: "skola-golmana",
    number: "03",
    metadata: "03 · Kontinuitet razvoja",
    name: "Škola golmana",
    shortDescription: "Kontinuirani razvoj od osnovnih elemenata do složenijih zahteva igre.",
    description: [
      "Škola golmana povezuje tehničku osnovu sa navikom da se položaj, odluka i izvođenje stalno proveravaju. Cilj nije brzo preskakanje na atraktivne vežbe, već stabilan razvoj onoga što golman koristi iz treninga u trening.",
      "Kako iskustvo raste, sadržaj se širi na visoke lopte, situacije jedan na jedan, igru nogom, komunikaciju i odluku pod pritiskom.",
    ],
    pathway: ["Osnovni stav i bezbedan pad", "Hvatanje i odbijanje", "Kretanje i pozicioniranje", "Situaciona odluka", "Komunikacija i igra nogom"],
    cta: "Pošalji uzrast i iskustvo",
    alt: "Mladi golman tokom vežbe osnovne tehnike",
  },
  {
    id: "fizicka-priprema",
    number: "04",
    metadata: "04 · Osnova golmanskog pokreta",
    name: "Kondiciona i fitnes priprema",
    shortDescription:
      "Razvoj sposobnosti koje golman koristi u kratkoj reakciji, promeni pravca, odrazu, padu i ponovnom ustajanju.",
    description: [
      "Golmanska fizička priprema nije umanjena verzija treninga igrača iz polja. Naglasak je na eksplozivnosti, koordinaciji, agilnosti i mobilnosti u pokretima koji odgovaraju situacijama na golu.",
      "Obim dodatnog rada treba uskladiti sa uzrastom, trenutnom spremom, klupskim treninzima i takmičarskim rasporedom. Medicinska rehabilitacija nije predstavljena kao deo ovog programa.",
    ],
    focus: [
      "Prvi korak i promena pravca",
      "Odraz i kontrolisano prizemljenje",
      "Koordinacija ruku i nogu",
      "Mobilnost i stabilnost",
      "Povratak u poziciju posle intervencije",
    ],
    cta: "Pošalji podatke o opterećenju",
    alt: "Golman tokom vežbe koordinacije i promene pravca",
  },
  {
    id: "klupski-i-seniorski-golmani",
    number: "05",
    metadata: "05 · Rad uz takmičarski ciklus",
    name: "Dodatni rad za klupske i seniorske golmane",
    shortDescription:
      "Precizno usmeren trening uz obaveze u matičnom klubu, pripremni period ili povratak u takmičarski ritam.",
    description: [
      "Naprednom golmanu često nije potreban širi program već tačno određen sadržaj: korekcija jedne situacije, dodatna tehnička ponavljanja, igra nogom, priprema tokom pauze ili povratak u ritam rada.",
      "Pre dogovora potrebno je sagledati klupske treninge, utakmice, prethodno opterećenje i cilj dodatnog rada. Time se program uklapa u postojeći ciklus umesto da mu bude paralelan bez kontrole.",
    ],
    audience: [
      "Golmanima mlađih kategorija u takmičarskom sistemu",
      "Prvotimcima i seniorskim golmanima",
      "Golmanima u pripremnom ili međusezonskom periodu",
    ],
    cta: "Pošalji trenutni plan i cilj",
    alt: "Napredni golman tokom zahtevne situacione vežbe",
  },
];

if (programDetails.some((program) => !program.name || !program.cta || !program.alt)) {
  throw new Error("Svaki program mora imati naziv, CTA i alt tekst.");
}
