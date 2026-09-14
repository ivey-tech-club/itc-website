import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import {
  getAlumniLogoVariant,
  getFeaturedAlumniWorkplaces,
} from "./company-showcase-data";
import showcase from "../data/json/company-showcase.json";

describe("getFeaturedAlumniWorkplaces", () => {
  it("keeps the requested workplace set in the homepage showcase", () => {
    expect(showcase.alumniWorkplaces).toMatchObject([
      { name: "Capital One", logoPath: "/company-logos/capital-one.svg" },
      { name: "RBC", logoPath: "/company-logos/rbc.svg" },
      { name: "Wealthsimple", logoPath: "/company-logos/wealthsimple.svg" },
      { name: "TD", logoPath: "/company-logos/td.svg" },
      { name: "Mastercard", logoPath: "/company-logos/mastercard.svg" },
      { name: "PwC", logoPath: "/company-logos/pwc.svg" },
      { name: "Scene+", logoPath: "/company-logos/scene-plus.svg" },
      { name: "Lyft", logoPath: "/company-logos/lyft.svg" },
    ]);
  });

  it("keeps every named alumni workplace and removes duplicates", () => {
    const alumni = [
      { company: "Tesla" },
      { company: "Google" },
      { company: "Google" },
      { company: "Nvidia" },
      { company: "Not in the logo catalog" },
    ];

    expect(getFeaturedAlumniWorkplaces(alumni)).toMatchObject([
      { id: "tesla", name: "Tesla", logoVariant: "text" },
      { id: "google", name: "Google", logoPath: "/company-logos/google.svg" },
      { id: "nvidia", name: "NVIDIA", logoPath: "/company-logos/nvidia.svg" },
      { id: "not-in-the-logo-catalog", name: "Not in the logo catalog", logoVariant: "text" },
    ]);
    expect(getFeaturedAlumniWorkplaces(alumni)).toHaveLength(4);
  });

  it("resolves the requested workplace logos locally", () => {
    const alumni = [
      { company: "Capital One" },
      { company: "RBC" },
      { company: "Wealthsimple" },
      { company: "TD" },
      { company: "Mastercard" },
      { company: "PwC" },
      { company: "Scene+" },
      { company: "Lyft" },
    ];

    expect(getFeaturedAlumniWorkplaces(alumni)).toMatchObject([
      { name: "Capital One", logoPath: "/company-logos/capital-one.svg" },
      { name: "RBC", logoPath: "/company-logos/rbc.svg" },
      { name: "Wealthsimple", logoPath: "/company-logos/wealthsimple.svg" },
      { name: "TD", logoPath: "/company-logos/td.svg" },
      { name: "Mastercard", logoPath: "/company-logos/mastercard.svg" },
      { name: "PwC", logoPath: "/company-logos/pwc.svg" },
      { name: "Scene+", logoPath: "/company-logos/scene-plus.svg" },
      { name: "Lyft", logoPath: "/company-logos/lyft.svg" },
    ]);
  });

  it("uses full wordmarks for the sponsor assets that are not icon-only marks", () => {
    const alumni = [
      { company: "Bain Capital Ventures" },
      { company: "McKinsey & Company" },
      { company: "Salesforce" },
    ];

    expect(getFeaturedAlumniWorkplaces(alumni)).toMatchObject([
      {
        id: "bain-capital-ventures",
        logoPath: "/company-logos/bain-capital-wordmark.png",
        logoVariant: "wordmark",
      },
      {
        id: "mckinsey-company",
        logoPath: "/company-logos/mckinsey-wordmark.png",
        logoVariant: "wordmark",
      },
      {
        id: "salesforce",
        logoPath: "/company-logos/salesforce.svg",
        logoVariant: "mark",
      },
    ]);

    expect(getAlumniLogoVariant("Google")).toBe("mark");
    expect(getAlumniLogoVariant("Capital One")).toBe("wordmark");
    expect(getAlumniLogoVariant("PwC")).toBe("wordmark");
    expect(getAlumniLogoVariant("Scene+")).toBe("wordmark");
    expect(getAlumniLogoVariant("Wealthsimple")).toBe("wordmark");
  });

  it("gives every current alumni workplace a visible logo asset", () => {
    const currentWorkplaces = [
      "Aurora Solar",
      "AWS",
      "Bain Capital Ventures",
      "Bell",
      "Cloudflare",
      "Coda",
      "Commure",
      "Constellation Data Labs",
      "DoorDash",
      "Electric Mind",
      "ensue, o1Labs",
      "EY",
      "FalconX",
      "Google",
      "Guild AI",
      "Instacart",
      "Interlude Studio",
      "Lightrock",
      "Mark43",
      "McKinsey & Company",
      "Meta",
      "Microsoft",
      "Netic",
      "Nvidia",
      "Roblox",
      "SafetyWing",
      "Salesforce",
      "Schmidt Futures",
      "StackAdapt",
      "Statsig",
      "Tiktok",
      "Uber",
    ];

    const workplaces = getFeaturedAlumniWorkplaces(
      currentWorkplaces.map((company) => ({ company })),
    );

    expect(workplaces).toHaveLength(currentWorkplaces.length);
    expect(workplaces.every((workplace) => workplace.logoPath?.startsWith("/company-logos/"))).toBe(true);
    expect(
      workplaces.every((workplace) =>
        workplace.logoPath
          ? existsSync(resolve(process.cwd(), "public", workplace.logoPath.slice(1)))
          : false,
      ),
    ).toBe(true);
    expect(workplaces.some((workplace) => workplace.logoPath?.startsWith("http"))).toBe(false);
  });

  it("merges the curated current-year workplaces with all alumni records once", () => {
    const workplaces = getFeaturedAlumniWorkplaces(
      [
        { company: "Bain Capital Ventures" },
        { company: "McKinsey & Company" },
        { company: "TD Bank" },
        { company: "TD" },
      ],
      showcase.alumniWorkplaces,
    );

    expect(workplaces.filter((workplace) => workplace.name === "TD")).toHaveLength(1);
    expect(workplaces).toEqual(
      expect.arrayContaining([
        { id: "bain-capital-ventures", name: "Bain Capital Ventures", logoPath: "/company-logos/bain-capital-wordmark.png", logoVariant: "wordmark" },
        { id: "mckinsey-company", name: "McKinsey & Company", logoPath: "/company-logos/mckinsey-wordmark.png", logoVariant: "wordmark" },
        { id: "td", name: "TD", logoPath: "/company-logos/td.svg", logoVariant: "mark" },
      ]),
    );
  });
});
