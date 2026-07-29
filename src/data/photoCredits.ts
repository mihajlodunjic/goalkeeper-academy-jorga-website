export type PhotoCredit = {
  file: string;
  title: string;
  author: string;
  sourceUrl: string;
  licenseName: string;
  licenseUrl: string;
  downloadDate: string;
  changes: string;
  requiresPublicAttribution: boolean;
};

export const photoCredits: PhotoCredit[] = [
  {
    file: "src/assets/images/home/hero-goalkeeper.jpg",
    title: "Goalkeeper training on outdoor soccer field with green grass and empty stands.",
    author: "Володимир Король",
    sourceUrl: "https://www.pexels.com/photo/goalkeeper-training-with-soccer-ball-16543177/",
    licenseName: "Pexels License",
    licenseUrl: "https://www.pexels.com/license/",
    downloadDate: "2026-07-28",
    changes: "Lokalno preuzimanje, desktop crop 16/10, odvojeni mobilni crop 4/5 i responsive optimizacija.",
    requiresPublicAttribution: false,
  },
  {
    file: "src/assets/images/programs/program-save.jpg",
    title: "Goalkeeper skillfully defending the goal during a sunny outdoor soccer training session.",
    author: "Franco Monsalvo",
    sourceUrl: "https://www.pexels.com/photo/goalkeeper-in-action-during-soccer-training-32205618/",
    licenseName: "Pexels License",
    licenseUrl: "https://www.pexels.com/license/",
    downloadDate: "2026-07-28",
    changes: "Lokalno preuzimanje, responsive optimizacija, izvoz modernih formata tokom builda.",
    requiresPublicAttribution: false,
  },
  {
    file: "src/assets/images/academy/goalkeeper-legs.jpg",
    title: "Goalkeeper standing on green field, focused on legs with gear, during a sunny day soccer match.",
    author: "Markus Spiske",
    sourceUrl: "https://www.pexels.com/photo/grass-sport-game-football-112786/",
    licenseName: "Pexels License",
    licenseUrl: "https://www.pexels.com/license/",
    downloadDate: "2026-07-28",
    changes: "Lokalno preuzimanje, responsive optimizacija, korišćenje kao dokumentarni detalj opreme.",
    requiresPublicAttribution: false,
  },
  {
    file: "src/assets/images/camps/training-grid.jpg",
    title: "Agility ladder and marker cones set up on a grassy football field for training.",
    author: "Chris K",
    sourceUrl: "https://www.pexels.com/photo/agility-ladder-and-marker-cones-set-up-on-a-grassy-football-field-for-training-13204961/",
    licenseName: "Pexels License",
    licenseUrl: "https://www.pexels.com/license/",
    downloadDate: "2026-07-28",
    changes: "Lokalno preuzimanje, responsive optimizacija, korišćenje kao ilustracija pripreme prostora za rad.",
    requiresPublicAttribution: false,
  },
  {
    file: "src/assets/images/camps/goalkeeper-training-group.jpg",
    title: "Goalkeeper drill with coach on outdoor soccer field.",
    author: "Володимир Король",
    sourceUrl:
      "https://images.pexels.com/photos/16543167/pexels-photo-16543167.jpeg?cs=srgb&dl=pexels-535150482-16543167.jpg&fm=jpg",
    licenseName: "Pexels License",
    licenseUrl: "https://www.pexels.com/license/",
    downloadDate: "2026-07-28",
    changes: "Lokalno preuzimanje, desktop crop 4/3, odvojeni mobilni crop 4/5 i responsive optimizacija za kamp/metod sekcije.",
    requiresPublicAttribution: false,
  },
];

export const requiresPublicPhotoCredits = photoCredits.some((item) => item.requiresPublicAttribution);
