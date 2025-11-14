// frontend/scripts/compress-images.js
// ESM-compatible image optimizer (WebP + AVIF + smaller WebP)
// Run from frontend/:  npm run compress:images

import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

const SRC_DIR = path.join(process.cwd(), "src", "assets");
const OUT_DIR = path.join(SRC_DIR, "optimized");
const EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];

const QualityWebP = 80;
const QualityAVIF = 50;

// ensure dir exists
async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function processFile(file) {
  const srcPath = path.join(SRC_DIR, file);
  const name = path.parse(file).name;
  const baseOut = path.join(OUT_DIR, name);

  try {
    // create WebP (max width 1600)
    await sharp(srcPath)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: QualityWebP })
      .toFile(`${baseOut}.webp`);

    // create AVIF
    await sharp(srcPath)
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .avif({ quality: QualityAVIF })
      .toFile(`${baseOut}.avif`);

    // create a smaller 800px webp for mobile
    await sharp(srcPath)
      .rotate()
      .resize({ width: 800, withoutEnlargement: true })
      .webp({ quality: Math.max(60, Math.round(QualityWebP * 0.7)) })
      .toFile(`${baseOut}-800.webp`);

    console.log("Converted:", file);
  } catch (err) {
    console.error("Failed to convert", file, err);
  }
}

async function main() {
  try {
    const dirEntries = await fs.readdir(SRC_DIR);
    const files = dirEntries.filter((f) => EXTENSIONS.includes(path.extname(f).toLowerCase()));

    if (!files.length) {
      console.error("No images found in", SRC_DIR);
      process.exit(1);
    }

    await ensureDir(OUT_DIR);

    for (const f of files) {
      await processFile(f);
    }

    console.log("DONE — optimized images written to", OUT_DIR);
  } catch (err) {
    console.error("Image compression failed:", err);
    process.exit(1);
  }
}

main();
