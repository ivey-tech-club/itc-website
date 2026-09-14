import type { AlumniCsvRecord } from "../features/alumni/alumni-data";
import {
  getCompanyMarqueeLogo,
  normalizeCompany,
} from "../features/alumni/company-logos";

export type AlumniLogoVariant = "mark" | "wordmark" | "text";

export interface AlumniWorkplace {
  id: string;
  name: string;
  logoPath?: string;
  logoVariant?: AlumniLogoVariant;
}

type AlumniWorkplaceSeed = Pick<AlumniWorkplace, "name"> &
  Partial<Pick<AlumniWorkplace, "id" | "logoPath" | "logoVariant">>;

const LOGO_VARIANTS: Partial<Record<string, Exclude<AlumniLogoVariant, "text">>> = {
  "aurora solar": "mark",
  "bain capital ventures": "wordmark",
  bell: "wordmark",
  "capital one": "wordmark",
  "mckinsey & company": "wordmark",
  commure: "wordmark",
  "constellation data labs": "wordmark",
  ey: "wordmark",
  falconx: "wordmark",
  "guild ai": "wordmark",
  "interlude studio": "wordmark",
  lightrock: "wordmark",
  mark43: "wordmark",
  netic: "wordmark",
  pwc: "wordmark",
  "scene+": "wordmark",
  statsig: "wordmark",
  wealthsimple: "wordmark",
};

export function getAlumniLogoVariant(value: string): Exclude<AlumniLogoVariant, "text"> {
  return LOGO_VARIANTS[normalizeCompany(value)] ?? "mark";
}

const DISPLAY_NAMES: Record<string, string> = {
  aws: "AWS",
  "aurora solar": "Aurora Solar",
  "bain capital ventures": "Bain Capital Ventures",
  bell: "Bell",
  "capital one": "Capital One",
  cloudflare: "Cloudflare",
  coda: "Coda",
  commure: "Commure",
  "constellation data labs": "Constellation Data Labs",
  doordash: "DoorDash",
  "electric mind": "Electric Mind",
  "ensue, o1labs": "ensue, o1Labs",
  ey: "EY",
  falconx: "FalconX",
  google: "Google",
  "guild ai": "Guild AI",
  instacart: "Instacart",
  "interlude studio": "Interlude Studio",
  lightrock: "Lightrock",
  lyft: "Lyft",
  mark43: "Mark43",
  mastercard: "Mastercard",
  "mckinsey & company": "McKinsey & Company",
  meta: "Meta",
  microsoft: "Microsoft",
  netic: "Netic",
  nvidia: "NVIDIA",
  pwc: "PwC",
  rbc: "RBC",
  roblox: "Roblox",
  salesforce: "Salesforce",
  "scene+": "Scene+",
  safetywing: "SafetyWing",
  "schmidt futures": "Schmidt Futures",
  stackadapt: "StackAdapt",
  statsig: "Statsig",
  td: "TD",
  tiktok: "TikTok",
  uber: "Uber",
  wealthsimple: "Wealthsimple",
};

function companyId(value: string) {
  return value.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
}

export function getFeaturedAlumniWorkplaces(
  alumni: readonly Pick<AlumniCsvRecord, "company">[],
  curatedWorkplaces: readonly AlumniWorkplaceSeed[] = [],
): AlumniWorkplace[] {
  const workplaces = new Map<string, AlumniWorkplace>();
  const sources: AlumniWorkplaceSeed[] = [
    ...curatedWorkplaces,
    ...alumni.map((profile) => ({ name: profile.company })),
  ];

  for (const source of sources) {
    const key = normalizeCompany(source.name);
    if (!key || workplaces.has(key)) continue;

    const logoPath = source.logoPath ?? getCompanyMarqueeLogo(key);
    const logoVariant = logoPath
      ? source.logoVariant ?? getAlumniLogoVariant(key)
      : "text";

    workplaces.set(key, {
      id: companyId(key),
      name: DISPLAY_NAMES[key] ?? source.name.trim().replace(/\s+/g, " "),
      ...(logoPath ? { logoPath } : {}),
      logoVariant,
    });
  }

  return Array.from(workplaces.values());
}
