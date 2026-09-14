export const CAREER_TRACKS = [
  "Product",
  "Engineering",
  "Strategy/Operations",
  "Financial Services",
  "Founder",
  "Growth",
] as const;

export type CareerTrack = (typeof CAREER_TRACKS)[number];

export interface AlumniCsvRecord {
  firstName: string;
  lastName: string;
  role: string;
  yearOnITC: string;
  company: string;
  jobPosition: string;
  city: string;
  state: string;
  gradYear: string;
  linkedin: string;
}

export interface AlumniProfile extends AlumniCsvRecord {
  id: string;
  cohorts: string[];
}

export interface AlumniFilters {
  query?: string;
  careerTracks?: ReadonlySet<CareerTrack>;
  locations?: ReadonlySet<string>;
  cohort?: string;
}

export interface LocationClusterMember {
  id: string;
  name: string;
  company: string;
}

export interface ClusterCompanySummary {
  name: string;
  count: number;
}

export interface LocationCluster {
  key: string;
  label: string;
  coordinates: [number, number];
  count: number;
  alumniIds: string[];
  companies: string[];
  members: LocationClusterMember[];
  /** Source city labels represented by a deliberately combined map marker. */
  locations?: string[];
}

interface CachedProfileFields {
  searchable: string;
  careerTrack: CareerTrack | null;
  cityKey: string;
  coordinates: [number, number] | null;
  clusterKey: string | null;
}

const PROFILE_FIELDS_CACHE = new WeakMap<AlumniProfile, CachedProfileFields>();

const CITY_ALIASES: Record<string, string> = {
  "new york": "New York City",
  "new york city": "New York City",
  nyc: "New York City",
};

const LOCATION_COORDINATES: Record<string, [number, number]> = {
  "calgary|ab": [-114.0719, 51.0447],
  "mountain view|ca": [-122.0838, 37.3861],
  "nairobi county|kenya": [36.8219, -1.2921],
  "new york city|ny": [-74.006, 40.7128],
  "redmond|wa": [-122.1215, 47.674],
  "san francisco|ca": [-122.4194, 37.7749],
  "seattle|wa": [-122.3321, 47.6062],
  "toronto|on": [-79.3832, 43.6532],
  "vancouver|bc": [-123.1207, 49.2827],
};

const REGION_LABELS: Record<string, string> = {
  ab: "Alberta",
  bc: "British Columbia",
  on: "Ontario",
  ca: "California",
  ny: "New York",
  wa: "Washington",
  kenya: "Kenya",
};

const NORTH_AMERICA_BOUNDS = {
  east: -50,
  north: 75,
  south: 15,
  west: -170,
} as const;

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function canonicalCity(city: string) {
  const normalized = normalizeText(city);
  return CITY_ALIASES[normalized.toLowerCase()] ?? normalized;
}

function normalizeRegionCode(state: string) {
  return normalizeText(state).toLowerCase();
}

/** Group key for map markers: city plus region, keeping nearby cities distinct. */
export function getMapClusterKey(alumni: Pick<AlumniCsvRecord, "city" | "state">): string | null {
  const city = canonicalCity(alumni.city).toLowerCase();
  const region = normalizeRegionCode(alumni.state);
  if (city && region) return `${city}|${region}`;
  return city || region || null;
}

function averageCoordinates(points: readonly [number, number][]): [number, number] {
  const total = points.reduce(
    (sum, [longitude, latitude]) => [sum[0] + longitude, sum[1] + latitude] as [number, number],
    [0, 0] as [number, number],
  );
  const count = points.length || 1;
  return [
    Math.round((total[0] / count) * 10_000) / 10_000,
    Math.round((total[1] / count) * 10_000) / 10_000,
  ];
}

function parseCsvRows(csv: string) {
  const rows: string[][] = [];
  let currentField = "";
  let currentRow: string[] = [];
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    const nextCharacter = csv[index + 1];

    if (character === '"' && quoted && nextCharacter === '"') {
      currentField += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      currentRow = [...currentRow, normalizeText(currentField)];
      currentField = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && nextCharacter === "\n") index += 1;
      rows.push([...currentRow, normalizeText(currentField)]);
      currentRow = [];
      currentField = "";
    } else {
      currentField += character;
    }
  }

  const hasTrailingRow = currentField.length > 0 || currentRow.length > 0;
  return hasTrailingRow
    ? [...rows, [...currentRow, normalizeText(currentField)]]
    : rows;
}

export function parseAlumniCsv(csv: string): AlumniCsvRecord[] {
  if (!csv.trim()) return [];

  return parseCsvRows(csv)
    .slice(1)
    .filter((fields) => fields.length >= 10 && Boolean(fields[0] || fields[1]))
    .map((fields) => ({
      firstName: fields[0] ?? "",
      lastName: fields[1] ?? "",
      role: fields[2] ?? "",
      yearOnITC: fields[3] ?? "",
      company: fields[4] ?? "",
      jobPosition: fields[5] ?? "",
      city: fields[6] ?? "",
      state: fields[7] ?? "",
      gradYear: fields[8] ?? "",
      linkedin: fields[9] ?? "",
    }));
}

export function getAlumniName(alumni: Pick<AlumniCsvRecord, "firstName" | "lastName">) {
  return normalizeText(`${alumni.firstName} ${alumni.lastName}`);
}

function profileIdentity(record: AlumniCsvRecord) {
  const linkedin = safeLinkedInUrl(record.linkedin).toLowerCase();
  return linkedin || getAlumniName(record).toLowerCase();
}

function profileId(identity: string) {
  const slug = identity
    .replace(/^https?:\/\//, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
  return slug || "alumni-profile";
}

function prefer(next: string, current: string) {
  return normalizeText(next) || current;
}

export function consolidateAlumni(records: readonly AlumniCsvRecord[]): AlumniProfile[] {
  const profiles = records.reduce<Record<string, AlumniProfile>>((currentProfiles, record) => {
    const identity = profileIdentity(record);
    if (!identity) return currentProfiles;

    const current = currentProfiles[identity];
    const cohorts = Array.from(
      new Set([...(current?.cohorts ?? []), record.yearOnITC].filter(Boolean)),
    ).sort();
    const nextProfile: AlumniProfile = current
      ? {
          ...current,
          firstName: prefer(record.firstName, current.firstName),
          lastName: prefer(record.lastName, current.lastName),
          role: prefer(record.role, current.role),
          yearOnITC: prefer(record.yearOnITC, current.yearOnITC),
          company: prefer(record.company, current.company),
          jobPosition: prefer(record.jobPosition, current.jobPosition),
          city: prefer(record.city, current.city),
          state: prefer(record.state, current.state),
          gradYear: prefer(record.gradYear, current.gradYear),
          linkedin: safeLinkedInUrl(record.linkedin) || current.linkedin,
          cohorts,
        }
      : {
          ...record,
          id: profileId(identity),
          linkedin: safeLinkedInUrl(record.linkedin),
          cohorts,
        };

    return { ...currentProfiles, [identity]: nextProfile };
  }, {});

  return Object.values(profiles).sort((left, right) =>
    getAlumniName(left).localeCompare(getAlumniName(right)),
  );
}

export function classifyCareerTrack(alumni: Pick<AlumniCsvRecord, "company" | "jobPosition">): CareerTrack | null {
  const job = alumni.jobPosition.toLowerCase();
  const company = alumni.company.toLowerCase();

  if (/founder|co-founder|\bceo\b/.test(job) || /founder|\bceo\b/.test(company)) return "Founder";
  if (/product\s*(manager|designer|solutions|manger)|associate product|\bapm\b/.test(job)) return "Product";
  if (/engineer|software|\bswe\b|platform|architect|developer/.test(job)) return "Engineering";
  if (/strateg|operations|consultant|implementation/.test(job)) return "Strategy/Operations";
  if (/financ|investor|trader|capital|deriv|principal|equity/.test(job)) return "Financial Services";
  if (/growth|marketing|communications/.test(job)) return "Growth";
  if (/product/.test(job)) return "Product";
  return null;
}

function getCachedProfileFields(profile: AlumniProfile): CachedProfileFields {
  const cached = PROFILE_FIELDS_CACHE.get(profile);
  if (cached) return cached;

  const fields: CachedProfileFields = {
    searchable: [
      getAlumniName(profile),
      profile.company,
      profile.jobPosition,
      profile.role,
      canonicalCity(profile.city),
      profile.state,
      ...profile.cohorts,
    ]
      .join(" ")
      .toLowerCase(),
    careerTrack: classifyCareerTrack(profile),
    cityKey: canonicalCity(profile.city).toLowerCase(),
    coordinates: getCoordinates(profile.city, profile.state),
    clusterKey: getMapClusterKey(profile),
  };

  PROFILE_FIELDS_CACHE.set(profile, fields);
  return fields;
}

export function isLocationListed(alumni: Pick<AlumniCsvRecord, "city" | "state">) {
  return Boolean(normalizeText(alumni.city) || normalizeText(alumni.state));
}

export function filterAlumni(alumni: readonly AlumniProfile[], filters: AlumniFilters) {
  const query = normalizeText(filters.query ?? "").toLowerCase();
  const careerTracks = filters.careerTracks ?? new Set<CareerTrack>();
  const locations = filters.locations ?? new Set<string>();
  const locationKeys = new Set(
    Array.from(locations, (location) => canonicalCity(location).toLowerCase()),
  );

  if (!query && !careerTracks.size && !locationKeys.size && !filters.cohort) {
    return [...alumni];
  }

  return alumni.filter((profile) => {
    const fields = getCachedProfileFields(profile);
    const matchesQuery = !query || fields.searchable.includes(query);
    const matchesCareer =
      careerTracks.size === 0 ||
      (fields.careerTrack !== null && careerTracks.has(fields.careerTrack));
    const matchesLocation =
      locationKeys.size === 0 || locationKeys.has(fields.cityKey);
    const matchesCohort = !filters.cohort || profile.cohorts.includes(filters.cohort);

    return matchesQuery && matchesCareer && matchesLocation && matchesCohort;
  });
}

function coordinateKey(city: string, state: string) {
  return `${canonicalCity(city).toLowerCase()}|${normalizeText(state).toLowerCase()}`;
}

export function getCoordinates(city: string, state: string): [number, number] | null {
  const coordinates = LOCATION_COORDINATES[coordinateKey(city, state)];
  return coordinates ? [...coordinates] : null;
}

export function formatLocation(alumni: Pick<AlumniCsvRecord, "city" | "state">) {
  const city = canonicalCity(alumni.city);
  const state = normalizeText(alumni.state);
  if (!city) return "Location not listed";
  return state ? `${city}, ${state}` : city;
}

export function formatClusterLabel(key: string, sample?: Pick<AlumniCsvRecord, "city" | "state">) {
  if (sample && normalizeText(sample.city)) return formatLocation(sample);
  if (REGION_LABELS[key]) return REGION_LABELS[key];
  if (key.length === 2) return key.toUpperCase();
  if (sample) return formatLocation(sample);
  return key;
}

function isInsideNorthAmerica([longitude, latitude]: [number, number]) {
  return (
    longitude >= NORTH_AMERICA_BOUNDS.west &&
    longitude <= NORTH_AMERICA_BOUNDS.east &&
    latitude >= NORTH_AMERICA_BOUNDS.south &&
    latitude <= NORTH_AMERICA_BOUNDS.north
  );
}

function distanceInKilometres(
  [firstLongitude, firstLatitude]: readonly [number, number],
  [secondLongitude, secondLatitude]: readonly [number, number],
) {
  const earthRadius = 6_371;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const latitudeDelta = toRadians(secondLatitude - firstLatitude);
  const longitudeDelta = toRadians(secondLongitude - firstLongitude);
  const firstLatitudeRadians = toRadians(firstLatitude);
  const secondLatitudeRadians = toRadians(secondLatitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(firstLatitudeRadians) *
      Math.cos(secondLatitudeRadians) *
      Math.sin(longitudeDelta / 2) ** 2;

  return 2 * earthRadius * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function getNearbyClusters(
  cluster: LocationCluster,
  clusters: readonly LocationCluster[],
  radiusInKilometres = 120,
) {
  return clusters
    .filter((candidate) => candidate.key !== cluster.key)
    .filter(
      (candidate) =>
        distanceInKilometres(cluster.coordinates, candidate.coordinates) <=
        radiusInKilometres,
    )
    .sort((left, right) => left.label.localeCompare(right.label));
}

export function getOutsideNorthAmericaProfiles(alumni: readonly AlumniProfile[]) {
  return alumni.filter((profile) => {
    const coordinates = getCoordinates(profile.city, profile.state);
    return coordinates !== null && !isInsideNorthAmerica(coordinates);
  });
}

export function buildLocationClusters(alumni: readonly AlumniProfile[]): LocationCluster[] {
  type Draft = {
    key: string;
    label: string;
    points: [number, number][];
    alumniIds: string[];
    companies: Set<string>;
    members: LocationClusterMember[];
  };

  const drafts = new Map<string, Draft>();

  for (const profile of alumni) {
    const { coordinates, clusterKey: key } = getCachedProfileFields(profile);
    if (!coordinates || !isInsideNorthAmerica(coordinates) || !key) continue;

    const member: LocationClusterMember = {
      id: profile.id,
      name: getAlumniName(profile),
      company: normalizeText(profile.company),
    };

    const existing = drafts.get(key);
    if (!existing) {
      drafts.set(key, {
        key,
        label: formatClusterLabel(key, profile),
        points: [coordinates],
        alumniIds: [profile.id],
        companies: new Set(profile.company ? [profile.company] : []),
        members: [member],
      });
      continue;
    }

    const companies =
      profile.company && !existing.companies.has(profile.company)
        ? new Set([...Array.from(existing.companies), profile.company])
        : existing.companies;
    drafts.set(key, {
      ...existing,
      points: [...existing.points, coordinates],
      alumniIds: [...existing.alumniIds, profile.id],
      companies,
      members: [...existing.members, member],
    });
  }

  return Array.from(drafts.values())
    .map((draft) => ({
      key: draft.key,
      label: draft.label,
      coordinates: averageCoordinates(draft.points),
      count: draft.alumniIds.length,
      alumniIds: draft.alumniIds,
      companies: Array.from(draft.companies).sort(),
      members: draft.members,
    }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
}

const MAP_METRO_GROUPS = [
  {
    key: "metro:seattle-area",
    label: "Seattle area",
    memberKeys: ["seattle|wa", "redmond|wa"],
    anchorKey: "redmond|wa",
  },
] as const;

/**
 * Combine only locations that are visually indistinguishable at the default map
 * scale. The underlying directory still retains each person's source city.
 */
export function mergeMapClusters(clusters: readonly LocationCluster[]): LocationCluster[] {
  const consumed = new Set<string>();
  const merged: LocationCluster[] = [];

  for (const cluster of clusters) {
    if (consumed.has(cluster.key)) continue;

    const group = MAP_METRO_GROUPS.find(({ memberKeys }) =>
      memberKeys.some((memberKey) => memberKey === cluster.key),
    );
    const groupedClusters = group
      ? clusters.filter((candidate) =>
          group.memberKeys.some((memberKey) => memberKey === candidate.key),
        )
      : [cluster];

    groupedClusters.forEach((candidate) => consumed.add(candidate.key));
    if (!group || groupedClusters.length < 2) {
      merged.push(cluster);
      continue;
    }

    const anchorCluster =
      groupedClusters.find((candidate) => candidate.key === group.anchorKey) ??
      groupedClusters[0];
    const companies = Array.from(
      new Set(groupedClusters.flatMap((candidate) => candidate.companies)),
    ).sort((left, right) => left.localeCompare(right));
    const locations = Array.from(
      new Set(groupedClusters.map((candidate) => candidate.label)),
    ).sort((left, right) => left.localeCompare(right));

    merged.push({
      key: group.key,
      label: group.label,
      // Keep the visual marker on a real source city instead of placing it at
      // an invented midpoint between nearby metro locations.
      coordinates: anchorCluster.coordinates,
      count: groupedClusters.reduce((total, candidate) => total + candidate.count, 0),
      alumniIds: groupedClusters.flatMap((candidate) => candidate.alumniIds),
      companies,
      members: groupedClusters.flatMap((candidate) => candidate.members),
      locations,
    });
  }

  return merged.sort(
    (left, right) => right.count - left.count || left.label.localeCompare(right.label),
  );
}

export function getClusterCompanySummary(
  cluster: Pick<LocationCluster, "members" | "companies">,
  limit = 4,
): ClusterCompanySummary[] {
  const counts = new Map<string, ClusterCompanySummary>();
  const memberCompanies = cluster.members.map((member) => member.company).filter(Boolean);
  const members = memberCompanies.length ? memberCompanies : cluster.companies;

  for (const company of members) {
    const name = normalizeText(company);
    if (!name) continue;
    const key = name.toLowerCase();
    const current = counts.get(key);
    counts.set(key, current ? { ...current, count: current.count + 1 } : { name, count: 1 });
  }

  return Array.from(counts.values())
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name))
    .slice(0, limit);
}

export function indexClustersByAlumniId(
  clusters: readonly LocationCluster[],
): ReadonlyMap<string, LocationCluster> {
  const index = new Map<string, LocationCluster>();

  for (const cluster of clusters) {
    for (const alumniId of cluster.alumniIds) {
      index.set(alumniId, cluster);
    }
  }

  return index;
}

export function getNetworkStats(alumni: readonly AlumniProfile[]) {
  const companies = new Set(alumni.map((profile) => normalizeText(profile.company).toLowerCase()).filter(Boolean));
  const cohorts = new Set(alumni.flatMap((profile) => profile.cohorts).filter(Boolean));

  return {
    people: alumni.length,
    companies: companies.size,
    cohorts: cohorts.size,
    mappedCities: buildLocationClusters(alumni).length,
  };
}

export function safeLinkedInUrl(value: string) {
  const candidate = value.trim();
  if (!candidate) return "";

  try {
    const url = new URL(candidate);
    const protocolAllowed = url.protocol === "https:" || url.protocol === "http:";
    const host = url.hostname.toLowerCase();
    const hostAllowed = host === "linkedin.com" || host.endsWith(".linkedin.com");
    return protocolAllowed && hostAllowed ? candidate : "";
  } catch {
    return "";
  }
}
