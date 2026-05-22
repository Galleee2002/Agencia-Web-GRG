import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PROJECTS_DIR = path.join(process.cwd(), "public", "projects");
const ORIGINALS_DIR = path.join(PROJECTS_DIR, "originals");
const OUTPUT_DIR = path.join(PROJECTS_DIR, "resize-imgs");

/** Ancho máximo: lightbox ~1100px; 2× retina en galería ~960px → 1100px cubre ambos usos. */
const MAX_WIDTH = 1100;
const WEBP_QUALITY = 75;

async function main() {
  fs.mkdirSync(ORIGINALS_DIR, { recursive: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const sourceDir = fs.existsSync(ORIGINALS_DIR) ? ORIGINALS_DIR : PROJECTS_DIR;
  const files = fs
    .readdirSync(sourceDir)
    .filter((f) => /\.png$/i.test(f));

  for (const file of files) {
    const inputPath = path.join(sourceDir, file);
    const webpName = file.replace(/\.png$/i, ".webp");
    const outputPath = path.join(OUTPUT_DIR, webpName);

    const meta = await sharp(inputPath).metadata();
    const needsResize = (meta.width ?? 0) > MAX_WIDTH;

    let pipeline = sharp(inputPath);
    if (needsResize) {
      pipeline = pipeline.resize({
        width: MAX_WIDTH,
        withoutEnlargement: true,
      });
    }

    const buffer = await pipeline
      .webp({
        quality: WEBP_QUALITY,
        effort: 4,
      })
      .toBuffer();

    fs.writeFileSync(outputPath, buffer);

    const outMeta = await sharp(buffer).metadata();
    const kb = (buffer.length / 1024).toFixed(0);
    console.log(
      `${file} → ${webpName}: ${meta.width}x${meta.height} → ${outMeta.width}x${outMeta.height} (${kb} KB)`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
