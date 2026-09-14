"use client";

import AlumniNetworkMap from "../features/alumni/AlumniMap";

export interface LocationCluster {
  key: string;
  coordinates: [number, number];
  count: number;
  alumniNames: string[];
  companies: string[];
}

interface AlumniMapProps {
  locationClusters: LocationCluster[];
  hoveredLocation: string | null;
  setHoveredLocation: (location: string | null) => void;
  selectedLocation?: string | null;
  setSelectedLocation?: (location: string | null) => void;
}

/**
 * Compatibility adapter for the earlier alumni-map prototype. The live alumni
 * route uses the feature component directly, while this keeps its original API
 * available without loading a second geography implementation.
 */
export default function AlumniMap({
  locationClusters,
  hoveredLocation,
  setHoveredLocation,
  selectedLocation = null,
  setSelectedLocation,
}: AlumniMapProps) {
  const clusters = locationClusters.map((cluster) => ({
    key: cluster.key,
    label: cluster.key,
    coordinates: cluster.coordinates,
    count: cluster.count,
    alumniIds: [...cluster.alumniNames],
    companies: [...cluster.companies],
    members: cluster.alumniNames.map((name) => ({ id: name, name, company: "" })),
  }));

  return (
    <AlumniNetworkMap
      clusters={clusters}
      activeLocation={hoveredLocation}
      selectedLocation={selectedLocation}
      onActiveLocation={setHoveredLocation}
      onSelectLocation={(location) => setSelectedLocation?.(location)}
    />
  );
}
