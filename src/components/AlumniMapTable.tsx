"use client";

import React, {
  useState,
  useMemo,
  useEffect,
  useRef,
  useCallback,
} from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import searchIcon from "../assets/search-icon.svg";
import alumniCsv from "../assets/data/alumni-data.csv";
import type { LocationCluster } from "./AlumniMap";

// Single dynamic import of the entire map component — keeps react-simple-maps
// context intact and avoids SSR issues with d3/topojson.
const AlumniMap = dynamic(() => import("./AlumniMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ backgroundColor: "rgba(135, 214, 185, 0.15)" }}
    >
      <span
        style={{
          fontFamily: "Roboto, sans-serif",
          color: "#004938",
          opacity: 0.4,
          fontSize: 14,
        }}
      >
        Loading map…
      </span>
    </div>
  ),
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Alumni {
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

// Role categories — map job positions into high-level buckets

const ROLE_CATEGORIES = [
  "Product",
  "Engineering",
  "Strategy/Operations",
  "Financial Services",
  "Founder",
  "Growth",
] as const;
type RoleCategory = (typeof ROLE_CATEGORIES)[number];

function classifyRole(alumni: Alumni): RoleCategory | null {
  const jp = alumni.jobPosition.toLowerCase();
  const company = alumni.company.toLowerCase();
  if (/founder|ceo/i.test(jp) || /founder|ceo/i.test(company)) return "Founder";
  if (
    /product\s*(manager|designer|solutions|manger)/i.test(jp) ||
    jp.includes("apm") ||
    jp.includes("associate product")
  )
    return "Product";
  if (/engineer|software|swe|platform/i.test(jp)) return "Engineering";
  if (
    /strateg|operations|consultant|implementation|solutions architect/i.test(jp)
  )
    return "Strategy/Operations";
  if (/financ|investor|trader|capital|deriv/i.test(jp))
    return "Financial Services";
  if (/growth|marketing/i.test(jp)) return "Growth";
  // Fallback heuristic
  if (/product/i.test(jp)) return "Product";
  return null;
}

// ---------------------------------------------------------------------------
// Location filter options
// ---------------------------------------------------------------------------

const LOCATION_OPTIONS = [
  "San Francisco",
  "Mountain View",
  "New York City",
  "Toronto",
  "Vancouver",
] as const;
type LocationOption = (typeof LOCATION_OPTIONS)[number];

function matchesLocationOption(alumni: Alumni, loc: LocationOption): boolean {
  const city = alumni.city.trim().toLowerCase();
  switch (loc) {
    case "San Francisco":
      return city === "san francisco";
    case "Mountain View":
      return city === "mountain view";
    case "New York City":
      return city === "new york" || city === "new york city" || city === "nyc";
    case "Toronto":
      return city === "toronto";
    case "Vancouver":
      return city === "vancouver";
    default:
      return false;
  }
}

// ---------------------------------------------------------------------------
// CSV parser
// ---------------------------------------------------------------------------

function parseCSV(csv: string): Alumni[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];

  const alumni: Alumni[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const fields: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        fields.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    fields.push(current.trim());

    if (fields.length >= 10) {
      alumni.push({
        firstName: fields[0] || "",
        lastName: fields[1] || "",
        role: fields[2] || "",
        yearOnITC: fields[3] || "",
        company: fields[4] || "",
        jobPosition: fields[5] || "",
        city: fields[6] || "",
        state: fields[7] || "",
        gradYear: fields[8] || "",
        linkedin: fields[9] || "",
      });
    }
  }

  return alumni;
}

const alumniRawData = parseCSV(alumniCsv);

// Geocoding – OpenStreetMap Nominatim

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const GEOCODE_CACHE_KEY = "alumni_geocode_cache_v1";

function loadCachedCoordinates(): Record<string, [number, number]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(GEOCODE_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCachedCoordinates(cache: Record<string, [number, number]>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(cache));
  } catch {
    // silently ignore
  }
}

async function geocodeLocation(
  query: string,
): Promise<[number, number] | null> {
  try {
    const url = `${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "IveyTechClubWebsite/1.0" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.length === 0) return null;
    return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
  } catch {
    return null;
  }
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Hook – resolves coordinates for every unique location

function useGeocodedLocations(alumni: Alumni[]) {
  const [coords, setCoords] = useState<Record<string, [number, number]>>({});
  const resolving = useRef(false);

  const locationKeys = useMemo(() => {
    const set = new Set<string>();
    alumni.forEach((a) => {
      if (a.city && a.state) set.add(`${a.city}, ${a.state}`);
    });
    return Array.from(set);
  }, [alumni]);

  const resolve = useCallback(async () => {
    if (resolving.current) return;
    resolving.current = true;

    const cache = loadCachedCoordinates();
    const already = { ...cache };
    const missing = locationKeys.filter((k) => !already[k]);

    if (missing.length === 0) {
      setCoords(already);
      resolving.current = false;
      return;
    }

    if (Object.keys(already).length > 0) {
      setCoords({ ...already });
    }

    for (const key of missing) {
      const result = await geocodeLocation(key);
      if (result) {
        already[key] = result;
        setCoords((prev) => ({ ...prev, [key]: result }));
      }
      if (missing.indexOf(key) < missing.length - 1) {
        await delay(1100);
      }
    }

    saveCachedCoordinates(already);
    resolving.current = false;
  }, [locationKeys]);

  useEffect(() => {
    resolve();
  }, [resolve]);

  return coords;
}

// Inline funnel / filter SVG icon

const FunnelIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M16.5 2.25H1.5L7.5 9.345V14.25L10.5 15.75V9.345L16.5 2.25Z"
      stroke="#CFF2E9"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Checkbox component for the filter panel

interface FilterCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({
  label,
  checked,
  onChange,
}) => (
  <label
    className="flex items-center gap-2 cursor-pointer select-none"
    onClick={() => onChange(!checked)}
  >
    <div
      className="flex items-center justify-center flex-shrink-0"
      style={{
        width: 14,
        height: 14,
        borderRadius: 2,
        border: "1px solid #e0ede8",
        backgroundColor: checked ? "#e0ede8" : "transparent",
        transition: "background-color 0.15s ease",
      }}
    >
      {checked && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <path
            d="M2 5.5L4 7.5L8 3"
            stroke="#456a61"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
    <span
      style={{
        fontFamily: "Roboto, sans-serif",
        fontWeight: 400,
        fontSize: 16,
        color: "#FFFFFF",
      }}
    >
      {label}
    </span>
  </label>
);

// Component

const AlumniMapTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Multi-select filter state
  const [selectedRoles, setSelectedRoles] = useState<Set<RoleCategory>>(
    new Set(),
  );
  const [selectedLocations, setSelectedLocations] = useState<
    Set<LocationOption>
  >(new Set());

  const filterRef = useRef<HTMLDivElement>(null);

  const cityCoordinates = useGeocodedLocations(alumniRawData);

  // Close filter dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilterDropdown(false);
      }
    }
    if (showFilterDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilterDropdown]);

  // Toggle helpers
  const toggleRole = (role: RoleCategory) => {
    setSelectedRoles((prev) => {
      const next = new Set(prev);
      if (next.has(role)) next.delete(role);
      else next.add(role);
      return next;
    });
  };

  const toggleLocation = (loc: LocationOption) => {
    setSelectedLocations((prev) => {
      const next = new Set(prev);
      if (next.has(loc)) next.delete(loc);
      else next.add(loc);
      return next;
    });
  };

  const hasActiveFilters = selectedRoles.size > 0 || selectedLocations.size > 0;

  const filteredAlumni = useMemo(() => {
    return alumniRawData.filter((alumni) => {
      // Search filter
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        `${alumni.firstName} ${alumni.lastName}`
          .toLowerCase()
          .includes(query) ||
        alumni.company.toLowerCase().includes(query) ||
        alumni.jobPosition.toLowerCase().includes(query) ||
        alumni.city.toLowerCase().includes(query);

      // Role filter (OR within group — if any selected role matches)
      let matchesRole = true;
      if (selectedRoles.size > 0) {
        const category = classifyRole(alumni);
        matchesRole = category !== null && selectedRoles.has(category);
      }

      // Location filter (OR within group)
      let matchesLocation = true;
      if (selectedLocations.size > 0) {
        matchesLocation = Array.from(selectedLocations).some((loc) =>
          matchesLocationOption(alumni, loc),
        );
      }

      return matchesSearch && matchesRole && matchesLocation;
    });
  }, [searchQuery, selectedRoles, selectedLocations]);

  const locationClusters: LocationCluster[] = useMemo(() => {
    const clusters: Record<
      string,
      {
        key: string;
        coordinates: [number, number];
        count: number;
        alumniNames: string[];
      }
    > = {};

    filteredAlumni.forEach((alumni) => {
      if (!alumni.city) return;
      const locationKey = `${alumni.city}, ${alumni.state}`;
      const coordinates = cityCoordinates[locationKey];
      if (!coordinates) return;

      if (!clusters[locationKey]) {
        clusters[locationKey] = {
          key: locationKey,
          coordinates,
          count: 0,
          alumniNames: [],
        };
      }
      clusters[locationKey].count++;
      clusters[locationKey].alumniNames.push(
        `${alumni.firstName} ${alumni.lastName}`,
      );
    });

    return Object.values(clusters);
  }, [filteredAlumni, cityCoordinates]);

  const getLocation = (alumni: Alumni) => {
    if (alumni.city) return alumni.city;
    return "—";
  };

  return (
    <section
      className="py-8 md:py-[74px] px-3 sm:px-4 md:px-[34px]"
      style={{ backgroundColor: "#F8F9F2" }}
    >
      {/* Grid: row 1 = search bar, row 2 = table + map (same height) */}
      <div
        className="mx-auto flex flex-col items-center gap-4 xl:grid xl:gap-x-[42px] xl:gap-y-4 xl:justify-center"
        style={{
          gridTemplateColumns: "minmax(0, 606px) minmax(0, 713px)",
          gridTemplateRows: "auto 1fr",
        }}
      >
        {/* Search Bar + Filter — grid row 1, col 1                          */}
        <div className="w-full max-w-[606px] xl:max-w-none xl:col-start-1 xl:row-start-1 relative z-10">
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div
              className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-[10px] flex-1 min-w-0"
              style={{
                background: "linear-gradient(90deg, #174F42 0%, #456A61 100%)",
                borderRadius: 24,
                border: "0.69px solid #004938",
                boxShadow: "0px 8px 12px 0px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Image
                src={searchIcon}
                alt="Search"
                width={21}
                height={21}
                className="flex-shrink-0"
              />
              <input
                type="text"
                placeholder="Search for a name or company"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent outline-none w-full text-xs sm:text-sm"
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontWeight: 400,
                  lineHeight: "1.17em",
                  color: "#CFF2E9",
                }}
              />
            </div>

            {/* Filter Button */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                className="flex items-center justify-center w-[38px] h-[38px] sm:w-[42px] sm:h-[42px] cursor-pointer relative flex-shrink-0"
                style={{
                  background:
                    "linear-gradient(90deg, #8BBEB2 0%, #456A61 100%)",
                  borderRadius: 24,
                  border: "0.69px solid #004938",
                  boxShadow: "0px 8px 12px 0px rgba(0, 0, 0, 0.2)",
                }}
              >
                <FunnelIcon />
                {/* Active filter indicator dot */}
                {hasActiveFilters && (
                  <div
                    className="absolute -top-1 -right-1"
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor: "#CFF2E9",
                      border: "2px solid #456A61",
                    }}
                  />
                )}
              </button>

              {/* Filter Dropdown Panel */}
              {showFilterDropdown && (
                <div
                  className="absolute right-0 top-full mt-2 z-50 flex flex-col justify-start items-start gap-3.5 overflow-hidden max-h-[80vh] overflow-y-auto"
                  style={{
                    width: 240,
                    paddingLeft: 32,
                    paddingRight: 32,
                    paddingTop: 24,
                    paddingBottom: 24,
                    background:
                      "linear-gradient(90deg, #8abdb1 0%, #456a61 100%)",
                    borderRadius: 24,
                    boxShadow: "0px 6.27px 6.27px 0px rgba(0, 0, 0, 0.25)",
                    outline: "1px solid #004938",
                    outlineOffset: -1,
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      fontFamily: "Roboto, sans-serif",
                      fontWeight: 600,
                      fontSize: 20,
                      color: "#FFFFFF",
                    }}
                  >
                    Filters
                  </div>

                  {/* Role section */}
                  <div className="flex flex-col justify-start items-start gap-[3.13px]">
                    <div
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontWeight: 500,
                        fontSize: 16,
                        color: "#FFFFFF",
                      }}
                    >
                      Role
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1 w-44">
                      {ROLE_CATEGORIES.map((role) => (
                        <FilterCheckbox
                          key={role}
                          label={role}
                          checked={selectedRoles.has(role)}
                          onChange={() => toggleRole(role)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Location section */}
                  <div className="flex flex-col justify-start items-start gap-[3.13px] w-40">
                    <div
                      style={{
                        fontFamily: "Roboto, sans-serif",
                        fontWeight: 500,
                        fontSize: 16,
                        color: "#FFFFFF",
                      }}
                    >
                      Location
                    </div>
                    <div className="flex flex-col justify-start items-start gap-1 w-44">
                      {LOCATION_OPTIONS.map((loc) => (
                        <FilterCheckbox
                          key={loc}
                          label={loc}
                          checked={selectedLocations.has(loc)}
                          onChange={() => toggleLocation(loc)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------- */}
        {/* Table — grid row 2, col 1                                        */}
        {/* ----------------------------------------------------------------- */}
        <div
          className="w-full max-w-[606px] xl:max-w-none xl:col-start-1 xl:row-start-2 px-3 sm:px-5 md:px-[38px] pt-5 sm:pt-[41px] pb-4 sm:pb-6 overflow-x-auto overflow-y-hidden"
          style={{
            background:
              "linear-gradient(109deg, rgba(224, 237, 232, 0.2) 0%, rgba(3, 89, 56, 0.2) 43%, rgba(135, 214, 184, 0.2) 100%)",
            borderRadius: 17,
            boxShadow: "7px 14px 14px 0px rgba(0, 0, 0, 0.08)",
          }}
        >
          {/* Table Header */}
          <div
            className="flex items-center mb-3 sm:mb-5 min-w-[380px]"
            style={{
              fontFamily: "Roboto, sans-serif",
              fontWeight: 700,
              lineHeight: "1.17em",
              color: "#004938",
            }}
          >
            <span className="w-[26%] text-sm sm:text-base md:text-[17px]">
              Name
            </span>
            <span className="w-[27%] text-sm sm:text-base md:text-[17px]">
              Role
            </span>
            <span className="w-[22%] text-sm sm:text-base md:text-[17px]">
              Company
            </span>
            <span className="w-[25%] text-left text-sm sm:text-base md:text-[17px]">
              Location
            </span>
          </div>

          {/* Table Rows */}
          <div className="flex flex-col gap-2 sm:gap-3 overflow-y-auto max-h-[50vh] sm:max-h-[60vh] xl:max-h-[590px] pr-4 sm:pr-6 alumni-scrollbar">
            {filteredAlumni.map((alumni, index) => (
              <React.Fragment
                key={`${alumni.firstName}-${alumni.lastName}-${index}`}
              >
                <a
                  href={alumni.linkedin || undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center py-[2px] min-w-[380px]"
                  style={{
                    fontFamily: "Roboto, sans-serif",
                    fontWeight: 400,
                    lineHeight: "1.17em",
                    color: "#004938",
                    cursor: alumni.linkedin ? "pointer" : "default",
                    textDecoration: "none",
                  }}
                  onMouseEnter={() => {
                    const locationKey =
                      alumni.city && alumni.state
                        ? `${alumni.city}, ${alumni.state}`
                        : null;
                    if (locationKey) setHoveredLocation(locationKey);
                  }}
                  onMouseLeave={() => setHoveredLocation(null)}
                >
                  <span className="w-[26%] truncate pr-2 text-xs sm:text-sm">
                    {alumni.firstName} {alumni.lastName}
                  </span>
                  <span className="w-[27%] truncate pr-2 text-xs sm:text-sm">
                    {alumni.jobPosition || "—"}
                  </span>
                  <span className="w-[22%] truncate pr-2 text-xs sm:text-sm">
                    {alumni.company || "—"}
                  </span>
                  <span className="w-[25%] truncate text-xs sm:text-sm">
                    {getLocation(alumni)}
                  </span>
                </a>
                {index < filteredAlumni.length - 1 && (
                  <div
                    className="w-full min-w-[380px]"
                    style={{
                      height: 0.69,
                      backgroundColor: "#7FB8AB",
                    }}
                  />
                )}
              </React.Fragment>
            ))}

            {filteredAlumni.length === 0 && (
              <div
                className="text-center py-8"
                style={{
                  fontFamily: "Roboto, sans-serif",
                  color: "#004938",
                  opacity: 0.6,
                  fontSize: 14,
                }}
              >
                No alumni found matching your search.
              </div>
            )}
          </div>
        </div>

        {/* Map — grid row 2, col 2 (same row as table = same height)        */}
        <div className="w-full max-w-[606px] xl:max-w-none xl:col-start-2 xl:row-start-2 relative overflow-hidden h-[280px] sm:h-[380px] md:h-[480px] xl:h-auto">
          <div className="w-full h-full">
            <AlumniMap
              locationClusters={locationClusters}
              hoveredLocation={hoveredLocation}
              setHoveredLocation={setHoveredLocation}
            />
          </div>

          {/* Tooltip for hovered location */}
          {hoveredLocation && (
            <div
              className="absolute bottom-4 left-4 px-4 py-3 z-20 pointer-events-none"
              style={{
                background: "linear-gradient(90deg, #174F42 0%, #456A61 100%)",
                borderRadius: 12,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
                maxWidth: 280,
              }}
            >
              <div
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#CFF2E9",
                  marginBottom: 4,
                }}
              >
                {hoveredLocation}
              </div>
              <div
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontWeight: 400,
                  fontSize: 12,
                  color: "rgba(207, 242, 233, 0.8)",
                }}
              >
                {locationClusters
                  .find((c) => c.key === hoveredLocation)
                  ?.alumniNames.join(", ")}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom scrollbar styles */}
      <style jsx global>{`
        .alumni-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .alumni-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 73, 56, 0.1);
          border-radius: 4px;
        }
        .alumni-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0, 73, 56, 0.3);
          border-radius: 4px;
        }
        .alumni-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(0, 73, 56, 0.5);
        }
        input::placeholder {
          color: rgba(220, 220, 220, 0.7) !important;
          opacity: 1;
        }
      `}</style>
    </section>
  );
};

export default AlumniMapTable;
