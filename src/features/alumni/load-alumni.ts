import { readFile } from "node:fs/promises";
import path from "node:path";

import { consolidateAlumni, parseAlumniCsv } from "./alumni-data";

export async function loadAlumni() {
  const csvPath = path.join(
    process.cwd(),
    "src",
    "assets",
    "data",
    "alumni-data.csv",
  );
  const csv = await readFile(csvPath, "utf8");
  return consolidateAlumni(parseAlumniCsv(csv));
}
