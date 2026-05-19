import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PROJECTS_DIR = path.join(process.cwd(), "public", "projects");
const ORIGINALS_DIR = path.join(PROJECTS_DIR, "originals");

/** Ancho máximo: lightbox ~1100px; 2× retina en galería ~960px → 1100px cubre ambos usos. */
const MAX_WIDTH = 1100;

async function main() {
  fs.mkdirSync(ORIGINALS_DIR, { recursive: true });

  const files = fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => f.toLowerCase().endsWith(".png"));

  for (const file of files) {
    const inputPath = path.join(PROJECTS_DIR, file);
    const originalBackupPath = path.join(ORIGINALS_DIR, file);

    if (!fs.existsSync(originalBackupPath)) {
      fs.copyFileSync(inputPath, originalBackupPath);
      console.log(`Backup: ${file}`);
    }

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
      .png({
        compressionLevel: 9,
        adaptiveFiltering: true,
        palette: false,
      })
      .toBuffer();

    fs.writeFileSync(inputPath, buffer);

    const outMeta = await sharp(buffer).metadata();
    const kb = (buffer.length / 1024).toFixed(0);
    console.log(
      `${file}: ${meta.width}x${meta.height} → ${outMeta.width}x${outMeta.height} (${kb} KB)`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
