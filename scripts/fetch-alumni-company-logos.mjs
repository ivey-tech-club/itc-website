import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const logoSlugs = {
  amazonaws: "amazonaws",
  aurorasolar: "aurorasolar",
  baincapital: "baincapital",
  bell: "bell",
  cloudflare: "cloudflare",
  coda: "coda",
  commure: "commure",
  doordash: "doordash",
  ey: "ey",
  falconx: "falconx",
  google: "google",
  instacart: "instacart",
  lightrock: "lightrock",
  mckinseyandcompany: "mckinseyandcompany",
  microsoft: "microsoft",
  meta: "meta",
  nvidia: "nvidia",
  roblox: "roblox",
  safetywing: "safetywing",
  salesforce: "salesforce",
  stackadapt: "stackadapt",
  statsig: "statsig",
  tiktok: "tiktok",
  uber: "uber",
};

const logoColors = {
  amazonaws: "#232F3E",
  cloudflare: "#F38020",
  coda: "#F46A54",
  doordash: "#FF3008",
  google: "#4285F4",
  instacart: "#43B02A",
  meta: "#0866FF",
  microsoft: "#5E5E5E",
  nvidia: "#76B900",
  roblox: "#111111",
  salesforce: "#00A1E0",
  tiktok: "#111111",
  uber: "#000000",
};

const outputDirectory = path.join(process.cwd(), "public", "company-logos");
const sourceUrl = (slug) =>
  `https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/${slug}.svg`;

await mkdir(outputDirectory, { recursive: true });

const results = await Promise.all(
  Object.entries(logoSlugs).map(async ([fileName, slug]) => {
    const response = await fetch(sourceUrl(slug));
    if (!response.ok) {
      return { fileName, status: response.status, written: false };
    }

    const svg = await response.text();
    const color = logoColors[fileName];
    const coloredSvg = color ? svg.replace("<svg ", `<svg fill="${color}" `) : svg;

    await writeFile(
      path.join(outputDirectory, `${fileName}.svg`),
      coloredSvg,
      "utf8",
    );
    return { fileName, status: response.status, written: true };
  }),
);

const downloaded = results.filter((result) => result.written).map((result) => result.fileName);
const missing = results
  .filter((result) => !result.written)
  .map((result) => `${result.fileName} (${result.status})`);

console.log(`Downloaded ${downloaded.length} square company logos.`);
if (missing.length) console.log(`Unavailable logo slugs: ${missing.join(", ")}`);
