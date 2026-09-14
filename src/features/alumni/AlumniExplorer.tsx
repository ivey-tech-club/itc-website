"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import {
  useEffect,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";

import AlumniProfileCard from "./AlumniProfileCard";
import { CloseIcon, FilterIcon, SearchIcon } from "./AlumniIcons";
import {
  buildLocationClusters,
  CAREER_TRACKS,
  filterAlumni,
  formatLocation,
  getAlumniName,
  getCoordinates,
  getNearbyClusters,
  indexClustersByAlumniId,
  isLocationListed,
  mergeMapClusters,
  safeLinkedInUrl,
  type AlumniProfile,
  type CareerTrack,
} from "./alumni-data";
import { getAlumniHeadshot } from "./alumni-headshots";
import styles from "./Alumni.module.css";

const AlumniMap = dynamic(() => import("./AlumniMap"), {
  ssr: false,
  loading: () => (
    <div className={styles.mapRegion} aria-busy="true" aria-label="Loading map">
      <p className={styles.mapLoading}>Loading map…</p>
    </div>
  ),
});

function toggleSetValue<T>(current: ReadonlySet<T>, value: T) {
  const values = Array.from(current);
  return current.has(value)
    ? new Set(values.filter((candidate) => candidate !== value))
    : new Set([...values, value]);
}

function FilterOption({
  checked,
  inputRef,
  label,
  onChange,
}: {
  checked: boolean;
  inputRef?: RefObject<HTMLInputElement>;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className={styles.filterOption}>
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span aria-hidden="true" />
      <span>{label}</span>
    </label>
  );
}

function DirectoryName({ alumni }: { alumni: AlumniProfile }) {
  const name = getAlumniName(alumni);
  const linkedin = safeLinkedInUrl(alumni.linkedin);
  const headshot = getAlumniHeadshot(alumni);

  return (
    <span className={styles.directoryPerson}>
      <span className={styles.directoryAvatar} aria-hidden="true">
        {headshot ? <Image src={headshot} alt="" width={30} height={30} /> : null}
      </span>
      {linkedin ? (
        <a
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} on LinkedIn (opens in a new tab)`}
        >
          {name}
        </a>
      ) : (
        <span>{name}</span>
      )}
    </span>
  );
}

export default function AlumniExplorer({ alumni }: { alumni: readonly AlumniProfile[] }) {
  const [query, setQuery] = useState("");
  const [careerTracks, setCareerTracks] = useState<Set<CareerTrack>>(new Set());
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeLocation, setActiveLocation] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const filterContainerRef = useRef<HTMLDivElement>(null);
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const firstFilterRef = useRef<HTMLInputElement>(null);
  const deferredQuery = useDeferredValue(query);

  const filteredAlumni = useMemo(
    () => filterAlumni(alumni, { query: deferredQuery, careerTracks }),
    [alumni, careerTracks, deferredQuery],
  );
  const hasSearchQuery = Boolean(deferredQuery.trim());
  const directoryAlumni = useMemo(
    () =>
      hasSearchQuery
        ? filteredAlumni
        : filteredAlumni.filter((profile) => isLocationListed(profile)),
    [filteredAlumni, hasSearchQuery],
  );
  const clusters = useMemo(
    () => mergeMapClusters(buildLocationClusters(filteredAlumni)),
    [filteredAlumni],
  );
  const clusterByAlumniId = useMemo(
    () => indexClustersByAlumniId(clusters),
    [clusters],
  );
  const selectedCluster = clusters.find(
    (cluster) => cluster.key === selectedLocation,
  );
  const selectedProfiles = selectedCluster
    ? filteredAlumni.filter(
        (profile) => clusterByAlumniId.get(profile.id) === selectedCluster,
      )
    : [];
  const nearbyClusters = selectedCluster
    ? getNearbyClusters(selectedCluster, clusters)
    : [];
  const activeFilterCount = careerTracks.size;
  const hasActiveControls = Boolean(query || activeFilterCount);

  useEffect(() => {
    if (selectedLocation && !clusters.some((cluster) => cluster.key === selectedLocation)) {
      setSelectedLocation(null);
    }
  }, [clusters, selectedLocation]);

  useEffect(() => {
    if (!filtersOpen) return;

    firstFilterRef.current?.focus();

    const closeOnOutsidePointer = (event: MouseEvent) => {
      if (!filterContainerRef.current?.contains(event.target as Node)) {
        setFiltersOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setFiltersOpen(false);
      filterButtonRef.current?.focus();
    };

    document.addEventListener("mousedown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [filtersOpen]);

  const reset = () => {
    setQuery("");
    setCareerTracks(new Set());
    setSelectedLocation(null);
    setActiveLocation(null);
  };

  return (
    <section
      className={styles.explorerSection}
      id="alumni-network"
      aria-labelledby="alumni-explorer-title"
    >
      <div className={styles.sectionUtilityRow}>
        <div>
          <p className={styles.sectionEyebrow}>01 / ALUMNI NETWORK</p>
          <h2 id="alumni-explorer-title" className={styles.explorerTitle}>
            Explore the network
          </h2>
        </div>
        <p className={styles.networkSummary}>
          {filteredAlumni.length} people · {clusters.length} map locations
        </p>
        {hasActiveControls ? (
          <div className={styles.resultActions}>
            {activeFilterCount ? <span>{activeFilterCount} filters</span> : null}
            <button
              type="button"
              onClick={reset}
              aria-label="Reset search and filters"
            >
              Reset
            </button>
          </div>
        ) : null}
      </div>

      <div className={styles.explorerGrid}>
        <div className={styles.directoryColumn}>
          <div className={styles.directoryWorkspaceHeader}>
            <div className={styles.controls}>
              <label className={styles.searchControl}>
                <span className={styles.visuallyHidden}>Search alumni</span>
                <SearchIcon aria-hidden="true" />
                <input
                  type="search"
                  placeholder="Search for a name or company"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                {query ? (
                  <button
                    type="button"
                    className={styles.clearSearch}
                    aria-label="Clear search"
                    onClick={() => setQuery("")}
                  >
                    <CloseIcon aria-hidden="true" />
                  </button>
                ) : null}
              </label>

              <div className={styles.filterControl} ref={filterContainerRef}>
                <button
                  ref={filterButtonRef}
                  className={styles.filterButton}
                  type="button"
                  aria-label="Filter alumni"
                  aria-expanded={filtersOpen}
                  aria-controls="alumni-filter-panel"
                  aria-haspopup="dialog"
                  onClick={() => setFiltersOpen((current) => !current)}
                >
                  <FilterIcon aria-hidden="true" />
                  {activeFilterCount ? (
                    <span aria-hidden="true">{activeFilterCount}</span>
                  ) : null}
                </button>

                {filtersOpen ? (
                  <div
                    className={styles.filterPanel}
                    id="alumni-filter-panel"
                    role="dialog"
                    aria-labelledby="alumni-filter-title"
                  >
                    <div className={styles.filterHeading}>
                      <h3 id="alumni-filter-title">Filters</h3>
                      {activeFilterCount ? (
                        <button type="button" onClick={() => setCareerTracks(new Set())}>
                          Clear all
                        </button>
                      ) : null}
                    </div>
                    <fieldset>
                      <legend>Role</legend>
                      {CAREER_TRACKS.map((track, index) => (
                        <FilterOption
                          key={track}
                          inputRef={index === 0 ? firstFilterRef : undefined}
                          label={track}
                          checked={careerTracks.has(track)}
                          onChange={() =>
                            setCareerTracks((current) => toggleSetValue(current, track))
                          }
                        />
                      ))}
                    </fieldset>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <div className={styles.tablePanel}>
            <div className={styles.tableScroller}>
              <table className={styles.directoryTable} aria-label="Alumni directory">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Role</th>
                    <th scope="col">Company</th>
                    <th scope="col">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {directoryAlumni.map((profile) => {
                    const coordinates = getCoordinates(profile.city, profile.state);
                    const location = formatLocation(profile);
                    const mapLocation = clusterByAlumniId.get(profile.id)?.key;

                    return (
                      <tr key={profile.id}>
                        <td data-label="Name">
                          <DirectoryName alumni={profile} />
                        </td>
                        <td data-label="Role">
                          {profile.jobPosition || profile.role || "Not listed"}
                        </td>
                        <td data-label="Company">
                          {profile.company || "Not listed"}
                        </td>
                        <td data-label="Location">
                          {coordinates && mapLocation ? (
                            <button
                              type="button"
                              onClick={() => setSelectedLocation(mapLocation)}
                              aria-label={`Show ${getAlumniName(profile)} on the map in ${location}`}
                            >
                              {location}
                            </button>
                          ) : (
                            location
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {directoryAlumni.length === 0 ? (
              <div className={styles.emptyState}>
                <p>
                  {filteredAlumni.length && !hasSearchQuery
                    ? "No alumni with a listed location match those filters."
                    : "No alumni match those filters."}
                </p>
                <button type="button" onClick={reset} aria-label="Reset empty state">
                  Reset search and filters
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className={styles.mapColumn}>
          <p
            className={styles.visuallyHidden}
            aria-live="polite"
            aria-atomic="true"
            data-testid="profile-selection-announcement"
          >
            {selectedCluster
              ? `${selectedCluster.count} ${selectedCluster.count === 1 ? "alumni profile" : "alumni profiles"} shown for ${selectedCluster.label}`
              : ""}
          </p>

          <div className={styles.mapPanel}>
            <div className={styles.mapPanelHeader}>
              <div>
                <p className={styles.sectionEyebrow}>WHERE THEY ARE</p>
                <h3>Locations</h3>
              </div>
              <span>{clusters.length} areas</span>
            </div>

            <AlumniMap
              clusters={clusters}
              activeLocation={activeLocation}
              selectedLocation={selectedLocation}
              onActiveLocation={setActiveLocation}
              onSelectLocation={setSelectedLocation}
            />

            {selectedCluster ? (
              <section
                className={styles.profileStack}
                role="region"
                aria-label={`Profiles in ${selectedCluster.label}`}
              >
                <div className={styles.profileStackHeader}>
                  <div>
                    <strong>{selectedCluster.label}</strong>
                    <span>{selectedCluster.count} alumni</span>
                  </div>
                  <button
                    type="button"
                    aria-label={`Close ${selectedCluster.label} profiles`}
                    onClick={() => setSelectedLocation(null)}
                  >
                    <CloseIcon aria-hidden="true" />
                  </button>
                </div>
                {nearbyClusters.length ? (
                  <div className={styles.nearbyCities}>
                    <span>Nearby cities</span>
                    <div>
                      {nearbyClusters.map((cluster) => (
                        <button
                          key={cluster.key}
                          type="button"
                          onClick={() => setSelectedLocation(cluster.key)}
                        >
                          {cluster.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className={styles.profileStackCards}>
                  {selectedProfiles.map((profile) => (
                    <AlumniProfileCard key={profile.id} alumni={profile} />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
