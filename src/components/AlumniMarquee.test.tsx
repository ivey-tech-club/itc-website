import { render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import AlumniMarquee from "./AlumniMarquee";

const companies = [
  { id: "google", name: "Google", logoPath: "/logos/google.svg" },
  { id: "meta", name: "Meta", logoPath: "/logos/meta.svg" },
  { id: "nvidia", name: "NVIDIA", logoPath: "/logos/nvidia.svg" },
] as const;

describe("AlumniMarquee", () => {
  it("renders the original duplicated forward and reverse carousel tracks", async () => {
    const { container } = render(<AlumniMarquee companies={companies} />);

    await waitFor(() => {
      expect(container.querySelectorAll('[class*="marqueeViewport"]')).toHaveLength(2);
    });

    expect(container.querySelectorAll('[class*="marqueeTrack"]')).toHaveLength(2);
    expect(container.querySelectorAll('[class*="marqueeTrackReverse"]')).toHaveLength(1);
    expect(container.querySelectorAll("img")).toHaveLength(companies.length * 2);
    expect(container.querySelectorAll('[class*="duplicate"]')).toHaveLength(companies.length);
  });

  it("keeps every entry in the same mark-then-label layout", async () => {
    const { container } = render(
      <AlumniMarquee
        companies={[
          {
            id: "mckinsey",
            name: "McKinsey & Company",
            logoPath: "/company-logos/mckinsey-wordmark.png",
            logoVariant: "wordmark",
          },
          { id: "bell", name: "Bell" },
          {
            id: "salesforce",
            name: "Salesforce",
            logoPath: "/company-logos/salesforce.svg",
            logoVariant: "mark",
          },
        ]}
      />,
    );

    await waitFor(() => {
      expect(container.querySelectorAll('[class*="_marqueeLogo_"]')).toHaveLength(6);
    });

    const entries = Array.from(
      container.querySelectorAll('[class*="_marqueeLogo_"]'),
    );
    expect(
      entries.every(
        (entry) =>
          entry.querySelector('[class*="alumniMark"]') &&
          entry.querySelector('[class*="marqueeLogoName"]'),
      ),
    ).toBe(true);
    expect(container.querySelectorAll('[class*="alumniMarkFallback"]')).toHaveLength(2);
    expect(container.querySelectorAll("img")).toHaveLength(4);
  });
});
