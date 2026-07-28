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
    title: "Focused goalkeeper during a training session at a sunny outdoor soccer field.",
    author: "Franco Monsalvo",
    sourceUrl: "https://www.pexels.com/photo/goalkeeper-training-session-in-action-35779800/",
    licenseName: "Pexels License",
    licenseUrl: "https://www.pexels.com/license/",
    downloadDate: "2026-07-28",
    changes: "Lokalno preuzimanje, responsive optimizacija, odvojeni mobilni crop.",
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
    title: "Goalkeeper training.jpg",
    author: "Lutwamastevenkigongo",
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Goalkeeper_training.jpg",
    licenseName: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
    downloadDate: "2026-07-28",
    changes: "Lokalno preuzimanje preko Wikimedia redirect linka, responsive optimizacija i odvojeni mobilni crop za kamp/metod sekcije.",
    requiresPublicAttribution: true,
  },
];

export const requiresPublicPhotoCredits = photoCredits.some((item) => item.requiresPublicAttribution);
