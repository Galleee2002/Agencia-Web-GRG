import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const PUBLIC = path.join(process.cwd(), "public");

async function optimizeWebp(inputPath, outputPath, { maxWidth, quality }) {
  const meta = await sharp(inputPath).metadata();
  let pipeline = sharp(inputPath);
  if (maxWidth && (meta.width ?? 0) > maxWidth) {
    pipeline = pipeline.resize({
      width: maxWidth,
      withoutEnlargement: true,
    });
  }
  const buffer = await pipeline.webp({ quality, effort: 4 }).toBuffer();
  fs.writeFileSync(outputPath, buffer);
  const outMeta = await sharp(buffer).metadata();
  const kb = (buffer.length / 1024).toFixed(0);
  console.log(
    `${path.basename(inputPath)} → ${path.basename(outputPath)}: ${meta.width}x${meta.height} → ${outMeta.width}x${outMeta.height} (${kb} KB)`,
  );
}

async function pngToWebp(inputPath, outputPath, { maxWidth, quality }) {
  const meta = await sharp(inputPath).metadata();
  let pipeline = sharp(inputPath);
  if (maxWidth && (meta.width ?? 0) > maxWidth) {
    pipeline = pipeline.resize({
      width: maxWidth,
      withoutEnlargement: true,
    });
  }
  const buffer = await pipeline.webp({ quality, effort: 4 }).toBuffer();
  fs.writeFileSync(outputPath, buffer);
  const kb = (buffer.length / 1024).toFixed(0);
  console.log(`${path.basename(inputPath)} → ${path.basename(outputPath)} (${kb} KB)`);
}

async function main() {
  const bannerIn = path.join(PUBLIC, "GRG-banner.webp");
  const bannerTmp = path.join(PUBLIC, "GRG-banner.opt.webp");
  await optimizeWebp(bannerIn, bannerTmp, { maxWidth: 1456, quality: 78 });
  fs.renameSync(bannerTmp, bannerIn);

  const workDir = path.join(PUBLIC, "work-with-us");
  for (const file of ["idea.png", "plan.png", "entrega.png"]) {
    const input = path.join(workDir, file);
    const out = path.join(workDir, file.replace(/\.png$/i, ".webp"));
    await pngToWebp(input, out, { maxWidth: 1200, quality: 80 });
  }

  const teamFiles = ["manuel-ilustracion.webp", "gael-ilustracion.webp"];
  for (const file of teamFiles) {
    const input = path.join(PUBLIC, "team", file);
    if (!fs.existsSync(input)) continue;
    const tmp = path.join(PUBLIC, "team", file.replace(".webp", ".opt.webp"));
    await optimizeWebp(input, tmp, { maxWidth: 1100, quality: 78 });
    fs.renameSync(tmp, input);
  }

  console.log("Done. Re-run: node scripts/resize-project-images.mjs (WEBP_QUALITY=75) for portfolio if needed.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
