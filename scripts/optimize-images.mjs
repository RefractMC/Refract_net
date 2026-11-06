import sharp from "sharp";
import { join } from "node:path";
const root = "public/images/screenshots";
for (const name of ["library", "browse", "settings"]) {
  const result = await sharp(join(root, name + ".png")).webp({ quality: 92, effort: 6 }).toFile(join(root, name + ".webp"));
  console.log(`${name}.webp: ${Math.round(result.size / 1024)} KiB`);
  for (const width of [768, 1280]) {
    await sharp(join(root, name + ".png")).resize({ width }).webp({ quality: 90, effort: 6 }).toFile(join(root, `${name}-${width}.webp`));
  }
}
