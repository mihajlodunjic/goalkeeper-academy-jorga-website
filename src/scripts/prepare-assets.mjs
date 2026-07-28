import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();

const sourceLogo = path.join(root, "public", "images", "brand", "logo-goalkeeper-academy-jorga.png");
const heroImage = path.join(root, "src", "assets", "images", "home", "hero-goalkeeper.jpg");
const groupImage = path.join(root, "src", "assets", "images", "camps", "goalkeeper-training-group.jpg");
const programImage = path.join(root, "src", "assets", "images", "programs", "program-save.jpg");
const legsImage = path.join(root, "src", "assets", "images", "academy", "goalkeeper-legs.jpg");
const trainingGridImage = path.join(root, "src", "assets", "images", "camps", "training-grid.jpg");
const outputHeroMobile = path.join(root, "src", "assets", "images", "home", "hero-goalkeeper-mobile.jpg");
const outputGroupMobile = path.join(root, "src", "assets", "images", "camps", "goalkeeper-training-group-mobile.jpg");
const appleTouchIcon = path.join(root, "public", "apple-touch-icon.png");
const faviconPng = path.join(root, "public", "favicon-64.png");
const ogImage = path.join(root, "public", "images", "social", "og-default.png");
const faviconSvg = path.join(root, "public", "favicon.svg");

const ensureDir = async (targetPath) => {
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
};

const optimizeOriginal = async (inputPath, width, quality = 84) => {
  const tempPath = `${inputPath}.tmp`;
  const backupPath = `${inputPath}.bak`;
  await sharp(inputPath)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toFile(tempPath);
  await fs.rename(inputPath, backupPath);
  await fs.rename(tempPath, inputPath);
  await fs.rm(backupPath, { force: true });
};

const optimizeOriginals = async () => {
  await Promise.all([
    optimizeOriginal(heroImage, 2400, 84),
    optimizeOriginal(programImage, 2400, 84),
    optimizeOriginal(legsImage, 1800, 84),
    optimizeOriginal(trainingGridImage, 2400, 82),
    optimizeOriginal(groupImage, 1800, 84),
  ]);
};

const createMobileCrops = async () => {
  await ensureDir(outputHeroMobile);
  await sharp(heroImage)
    .resize(900, 1125, { fit: "cover", position: sharp.strategy.attention })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(outputHeroMobile);

  await sharp(groupImage)
    .resize(900, 1125, { fit: "cover", position: sharp.strategy.attention })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(outputGroupMobile);
};

const createIcons = async () => {
  await ensureDir(appleTouchIcon);
  await sharp(sourceLogo).resize(180, 180).png().toFile(appleTouchIcon);
  await sharp(sourceLogo).resize(64, 64).png().toFile(faviconPng);

  const iconBuffer = await fs.readFile(faviconPng);
  const logoBase64 = iconBuffer.toString("base64");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="Golmanska akademija Jorgačević">
  <rect width="96" height="96" rx="20" fill="#071523"/>
  <image href="data:image/png;base64,${logoBase64}" x="8" y="8" width="80" height="80" preserveAspectRatio="xMidYMid meet"/>
</svg>`;
  await fs.writeFile(faviconSvg, svg, "utf8");
};

const createOgImage = async () => {
  await ensureDir(ogImage);
  const svg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#071523"/>
    <rect x="632" y="84" width="480" height="462" rx="12" fill="#0c1e32" stroke="#28445D" stroke-width="2"/>
    <path d="M110 118V514H395" fill="none" stroke="#8FC8E8" stroke-opacity="0.36" stroke-width="2"/>
    <path d="M110 200H290" fill="none" stroke="#8FC8E8" stroke-opacity="0.36" stroke-width="2"/>
    <path d="M290 200V360" fill="none" stroke="#8FC8E8" stroke-opacity="0.36" stroke-width="2"/>
    <path d="M290 360H490" fill="none" stroke="#8FC8E8" stroke-opacity="0.36" stroke-width="2"/>
    <image href="${sourceLogo.replace(/\\/g, "/")}" x="92" y="108" width="148" height="148"/>
    <text x="92" y="315" fill="#8FC8E8" font-family="Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="3">BEOGRAD · GOLMANSKI RAD</text>
    <text x="92" y="390" fill="#FFFFFF" font-family="Georgia, serif" font-size="68" font-weight="700">Golman se ne priprema</text>
    <text x="92" y="460" fill="#FFFFFF" font-family="Georgia, serif" font-size="68" font-weight="700">kao ostatak tima.</text>
    <text x="92" y="528" fill="#D6E5EF" font-family="Arial, sans-serif" font-size="28">Programi, kampovi, pozicija, odluka i igra nogom.</text>
  </svg>`;

  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(ogImage);
};

await optimizeOriginals();
await Promise.all([createMobileCrops(), createIcons(), createOgImage()]);
