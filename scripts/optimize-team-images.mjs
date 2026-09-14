import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const projectRoot = process.cwd();
const inputDirectory = path.join(projectRoot, "src", "assets", "team");
const outputDirectory = path.join(inputDirectory, "optimized");
const names = [
  "affan",
  "ashiti",
  "audrey",
  "carina",
  "evan",
  "harvey",
  "jennifer",
  "jocelyn",
  "laura",
  "laurel",
  "lecia",
  "marianna",
  "pranav",
  "ronin",
  "sophia",
  "uttej",
];

await mkdir(outputDirectory, { recursive: true });

await Promise.all(
  names.map((name) =>
    sharp(path.join(inputDirectory, `${name}.jpg`))
      .resize({
        width: 640,
        height: 640,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 5 })
      .toFile(path.join(outputDirectory, `${name}.webp`)),
  ),
);

console.log(`Optimized ${names.length} team portraits into ${outputDirectory}`);
