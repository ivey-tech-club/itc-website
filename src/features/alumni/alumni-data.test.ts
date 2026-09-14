import { describe, expect, it } from "vitest";

import {
  buildLocationClusters,
  classifyCareerTrack,
  consolidateAlumni,
  filterAlumni,
  formatClusterLabel,
  getClusterCompanySummary,
  getCoordinates,
  getNetworkStats,
  getNearbyClusters,
  getOutsideNorthAmericaProfiles,
  indexClustersByAlumniId,
  isLocationListed,
  mergeMapClusters,
  parseAlumniCsv,
  safeLinkedInUrl,
} from "./alumni-data";

const csv = `FirstName,LastName,Role,Year on ITC,Company,Job Position,City,State/Province,GradYear,LinkedIn
Alice,Chen,Exec,2020-2021,"Acme, Inc.","Product Manager, Growth",New York,NY,2022,https://www.linkedin.com/in/alice
Jordan,Lee,Exec,2019-2020,Northstar,Software Engineer,Toronto,ON,2021,https://www.linkedin.com/in/jordan
Jordan,Lee,Co-President,2020-2021,Northstar,Senior Software Engineer,Toronto,ON,2021,https://www.linkedin.com/in/jordan
"Dani","O""Neil",Exec,2021-2022,Launchpad,Founder,San Francisco,CA,2023,https://ca.linkedin.com/in/dani
short,row
`;

describe("parseAlumniCsv", () => {
  it("parses quoted commas and escaped quotes while skipping malformed rows", () => {
    const records = parseAlumniCsv(csv);

    expect(records).toHaveLength(4);
    expect(records[0]).toMatchObject({
      company: "Acme, Inc.",
      jobPosition: "Product Manager, Growth",
    });
    expect(records[3]).toMatchObject({ firstName: "Dani", lastName: `O"Neil` });
  });

  it("returns an empty array for a header-only or blank file", () => {
    expect(parseAlumniCsv("")).toEqual([]);
    expect(parseAlumniCsv("FirstName,LastName\n")).toEqual([]);
  });
});

describe("consolidateAlumni", () => {
  it("merges duplicate people and retains every ITC cohort", () => {
    const profiles = consolidateAlumni(parseAlumniCsv(csv));
    const jordan = profiles.find((profile) => profile.firstName === "Jordan");

    expect(profiles).toHaveLength(3);
    expect(jordan).toMatchObject({
      role: "Co-President",
      jobPosition: "Senior Software Engineer",
      cohorts: ["2019-2020", "2020-2021"],
    });
  });

  it("falls back to a normalized name when LinkedIn is absent", () => {
    const records = parseAlumniCsv(`FirstName,LastName,Role,Year on ITC,Company,Job Position,City,State/Province,GradYear,LinkedIn
 Sam , Rivera,Exec,2020-2021,One,Analyst,Toronto,ON,2022,
sam,Rivera,Exec,2021-2022,Two,Manager,Toronto,ON,2022,
`);

    expect(consolidateAlumni(records)).toHaveLength(1);
  });
});

describe("alumni classification and filtering", () => {
  const profiles = consolidateAlumni(parseAlumniCsv(csv));

  it.each([
    ["Founder", "Founder"],
    ["Software Engineer", "Engineering"],
    ["Product Manager", "Product"],
    ["Management Consultant", "Strategy/Operations"],
    ["Growth Equity Investor", "Financial Services"],
    ["Marketing Lead", "Growth"],
    ["Teacher", null],
  ] as const)("classifies %s as %s", (jobPosition, expected) => {
    expect(
      classifyCareerTrack({
        ...profiles[0],
        company: "Example",
        jobPosition,
      }),
    ).toBe(expected);
  });

  it("searches across people, companies, jobs, cities, and cohorts", () => {
    expect(filterAlumni(profiles, { query: "acme" })).toHaveLength(1);
    expect(filterAlumni(profiles, { query: "senior software" })).toHaveLength(1);
    expect(filterAlumni(profiles, { query: "san francisco" })).toHaveLength(1);
    expect(filterAlumni(profiles, { query: "2019-2020" })).toHaveLength(1);
  });

  it("combines career and location filters and leaves inputs immutable", () => {
    const careerTracks = new Set(["Engineering"] as const);
    const locations = new Set(["Toronto"]);

    const result = filterAlumni(profiles, { careerTracks, locations });

    expect(result.map((profile) => profile.firstName)).toEqual(["Jordan"]);
    expect(careerTracks).toEqual(new Set(["Engineering"]));
    expect(locations).toEqual(new Set(["Toronto"]));
  });

  it("treats a named city as listed even when the map has no coordinates", () => {
    expect(isLocationListed({ city: "", state: "" })).toBe(false);
    expect(isLocationListed({ city: "Nairobi County", state: "Kenya" })).toBe(true);
    expect(isLocationListed({ city: "Toronto", state: "" })).toBe(true);
  });
});

describe("map and network summaries", () => {
  const profiles = consolidateAlumni(parseAlumniCsv(csv));

  it("normalizes supported city aliases to coordinates", () => {
    expect(getCoordinates("New York City", "NY")).toEqual([-74.006, 40.7128]);
    expect(getCoordinates("NYC", "NY")).toEqual([-74.006, 40.7128]);
    expect(getCoordinates("Unknown", "ZZ")).toBeNull();
  });

  it("builds stable unique location clusters grouped by city", () => {
    const clusters = buildLocationClusters(profiles);

    expect(clusters).toHaveLength(3);
    expect(clusters.find((cluster) => cluster.key === "toronto|on")).toMatchObject({
      label: "Toronto, ON",
      count: 1,
      companies: ["Northstar"],
      alumniIds: [expect.any(String)],
    });
  });

  it("indexes every mapped alumni profile to its cluster", () => {
    const clusters = buildLocationClusters(profiles);
    const clusterByAlumniId = indexClustersByAlumniId(clusters);

    expect(clusterByAlumniId.get(profiles[0].id)).toBe(
      clusters.find((cluster) => cluster.alumniIds.includes(profiles[0].id)),
    );
    expect(clusterByAlumniId.get("missing-profile")).toBeUndefined();
  });

  it("keeps nearby cities separate even when they share a state", () => {
    const clusters = buildLocationClusters(
      consolidateAlumni(
        parseAlumniCsv(`FirstName,LastName,Role,Year on ITC,Company,Job Position,City,State/Province,GradYear,LinkedIn
Sam,Francis,Exec,2020-2021,Acme,Product Manager,San Francisco,CA,2022,
Morgan,View,Exec,2020-2021,Acme,Product Manager,Mountain View,CA,2022,
Pat,York,Exec,2020-2021,Beta,Engineer,New York,NY,2022,
`),
      ),
    );
    const sanFrancisco = clusters.find((cluster) => cluster.key === "san francisco|ca");
    const newYork = clusters.find((cluster) => cluster.key === "new york city|ny");

    expect(clusters.map((cluster) => cluster.key).sort()).toEqual([
      "mountain view|ca",
      "new york city|ny",
      "san francisco|ca",
    ]);
    expect(sanFrancisco).toMatchObject({
      label: "San Francisco, CA",
      count: 1,
      companies: ["Acme"],
    });
    expect(newYork).toMatchObject({ label: "New York City, NY", count: 1 });
    expect(getNearbyClusters(sanFrancisco!, clusters, 5000).map((c) => c.key)).toContain(
      "new york city|ny",
    );
  });

  it("combines Seattle and Redmond into one visual metro marker", () => {
    const clusters = buildLocationClusters(
      consolidateAlumni(
        parseAlumniCsv(`FirstName,LastName,Role,Year on ITC,Company,Job Position,City,State/Province,GradYear,LinkedIn
Sam,Francis,Exec,2020-2021,Statsig,Product Manager,Seattle,WA,2022,
Morgan,View,Exec,2020-2021,Microsoft,Engineer,Redmond,WA,2022,
Pat,York,Exec,2020-2021,Microsoft,Engineer,Redmond,WA,2022,
`),
      ),
    );
    const merged = mergeMapClusters(clusters);

    expect(merged).toHaveLength(1);
    expect(merged[0]).toMatchObject({
      key: "metro:seattle-area",
      label: "Seattle area",
      count: 3,
      companies: ["Microsoft", "Statsig"],
      locations: ["Redmond, WA", "Seattle, WA"],
      coordinates: [-122.1215, 47.674],
    });
  });

  it("ranks a location's companies by local representation and caps the marker at four", () => {
    const cluster = {
      key: "san francisco|ca",
      label: "San Francisco, CA",
      coordinates: [-122.4194, 37.7749] as [number, number],
      count: 6,
      alumniIds: ["1", "2", "3", "4", "5", "6"],
      companies: ["Google", "Meta", "Uber", "TikTok", "Netic"],
      members: [
        { id: "1", name: "A", company: "Uber" },
        { id: "2", name: "B", company: "Google" },
        { id: "3", name: "C", company: "Meta" },
        { id: "4", name: "D", company: "Uber" },
        { id: "5", name: "E", company: "TikTok" },
        { id: "6", name: "F", company: "Netic" },
      ],
    };

    expect(getClusterCompanySummary(cluster)).toEqual([
      { name: "Uber", count: 2 },
      { name: "Google", count: 1 },
      { name: "Meta", count: 1 },
      { name: "Netic", count: 1 },
    ]);
  });

  it("keeps cluster labels readable for region-only and incomplete locations", () => {
    expect(formatClusterLabel("ca")).toBe("California");
    expect(formatClusterLabel("zz")).toBe("ZZ");
    expect(formatClusterLabel("custom", { city: "", state: "" })).toBe(
      "Location not listed",
    );
    expect(formatClusterLabel("custom")).toBe("custom");
  });

  it("identifies known locations outside the North America map", () => {
    const profiles = consolidateAlumni(
      parseAlumniCsv(`FirstName,LastName,Role,Year on ITC,Company,Job Position,City,State/Province,GradYear,LinkedIn
Katherine,Tang,Exec,2018-2019,Lightrock,Investor,Nairobi County,Kenya,2022,
`),
    );

    expect(getOutsideNorthAmericaProfiles(profiles).map((profile) => profile.firstName)).toEqual([
      "Katherine",
    ]);
  });

  it("reports unique people, companies, cohorts, and mapped cities", () => {
    expect(getNetworkStats(profiles)).toEqual({
      people: 3,
      companies: 3,
      cohorts: 3,
      mappedCities: 3,
    });
  });
});

describe("safeLinkedInUrl", () => {
  it("allows LinkedIn HTTP(S) profiles and rejects other or unsafe URLs", () => {
    expect(safeLinkedInUrl("https://www.linkedin.com/in/alice")).toBe(
      "https://www.linkedin.com/in/alice",
    );
    expect(safeLinkedInUrl("http://ca.linkedin.com/in/alice")).toBe(
      "http://ca.linkedin.com/in/alice",
    );
    expect(safeLinkedInUrl("https://linkedin.example.com/in/alice")).toBe("");
    expect(safeLinkedInUrl("javascript:alert(1)")).toBe("");
    expect(safeLinkedInUrl("not a url")).toBe("");
  });
});
