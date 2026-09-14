import { describe, expect, it } from "vitest";

import { loadAlumni } from "./load-alumni";

describe("loadAlumni", () => {
  it("loads, parses, and consolidates the repository CSV on the server", async () => {
    const alumni = await loadAlumni();

    expect(alumni.length).toBeGreaterThan(40);
    expect(alumni.some((profile) => profile.firstName === "Lucille")).toBe(true);
    expect(new Set(alumni.map((profile) => profile.id)).size).toBe(alumni.length);
  });
});
