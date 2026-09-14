const COMPANY_LOGOS: Record<string, string> = {
  aws: "/company-logos/amazonaws.svg",
  "aurora solar": "/company-logos/aurora-solar.svg",
  "bain capital ventures": "/company-logos/bain-capital-wordmark.png",
  bell: "/company-logos/bell.svg",
  "capital one": "/company-logos/capital-one.svg",
  cloudflare: "/company-logos/cloudflare.svg",
  coda: "/company-logos/coda.svg",
  commure: "/company-logos/commure.svg",
  "constellation data labs": "/company-logos/constellation-data-labs.png",
  doordash: "/company-logos/doordash.svg",
  "electric mind": "/company-logos/electric-mind.svg",
  "ensue, o1labs": "/company-logos/ensue-o1labs.svg",
  ey: "/company-logos/ey.svg",
  falconx: "/company-logos/falconx.svg",
  google: "/company-logos/google.svg",
  "guild ai": "/company-logos/guild-ai.png",
  instacart: "/company-logos/instacart.svg",
  "interlude studio": "/company-logos/interlude-studio.svg",
  lightrock: "/company-logos/lightrock.svg",
  lyft: "/company-logos/lyft.svg",
  mark43: "/company-logos/mark43.png",
  mastercard: "/company-logos/mastercard.svg",
  "mckinsey & company": "/company-logos/mckinsey-wordmark.png",
  meta: "/company-logos/meta.svg",
  microsoft: "/company-logos/microsoft.svg",
  netic: "/company-logos/netic.svg",
  nvidia: "/company-logos/nvidia.svg",
  pwc: "/company-logos/pwc.svg",
  rbc: "/company-logos/rbc.svg",
  roblox: "/company-logos/roblox.svg",
  salesforce: "/company-logos/salesforce.svg",
  "scene+": "/company-logos/scene-plus.svg",
  safetywing: "/company-logos/safetywing.ico",
  "schmidt futures": "/company-logos/schmidt-futures.svg",
  stackadapt: "/company-logos/stackadapt.svg",
  statsig: "/company-logos/statsig.svg",
  td: "/company-logos/td.svg",
  tiktok: "/company-logos/tiktok.svg",
  uber: "/company-logos/uber.svg",
  wealthsimple: "/company-logos/wealthsimple.svg",
};

const COMPANY_ALIASES: Record<string, string> = {
  "amazon web services": "aws",
  "consetellation data labs": "constellation data labs",
  "ensue, o1 labs": "ensue, o1labs",
  "ensue o1labs": "ensue, o1labs",
  "capital one, n.a.": "capital one",
  "mckinsey and company": "mckinsey & company",
  "mckinsey & co": "mckinsey & company",
  "nvidia corporation": "nvidia",
  "pwc canada": "pwc",
  "rbc royal bank": "rbc",
  "royal bank of canada": "rbc",
  "scene plus": "scene+",
  "scene+ entertainment": "scene+",
  "safety wing": "safetywing",
  td: "td",
  "td bank": "td",
  "td canada": "td",
  "td canada trust": "td",
  "toronto dominion": "td",
  "toronto dominion bank": "td",
  "wealthsimple financial": "wealthsimple",
  "wealthsimple inc.": "wealthsimple",
  "wealthsimple investments": "wealthsimple",
};

export function normalizeCompany(value: string) {
  const normalized = value.trim().replace(/\s+/g, " ").toLowerCase();
  return COMPANY_ALIASES[normalized] ?? normalized;
}

export function getCompanyLogo(company: string) {
  return COMPANY_LOGOS[normalizeCompany(company)] ?? null;
}

export function getCompanyMarqueeLogo(company: string) {
  return COMPANY_LOGOS[normalizeCompany(company)] ?? null;
}

export function getCompanyInitials(value: string, fallback = "ITC") {
  const result = value
    .split(/[\s&,.-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  return result || fallback;
}
