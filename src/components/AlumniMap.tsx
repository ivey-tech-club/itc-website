"use client";

import React from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const US_STATES_URL = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const CANADA_PROVINCES_URL =
  "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/canada.geojson";

const markerColors = [
  "#035939",
  "#87D6B9",
  "#174F42",
  "#456A61",
  "#8BBEB2",
  "#0A7B5C",
  "#5FA393",
  "#2D8B6E",
];

export interface LocationCluster {
  key: string;
  coordinates: [number, number];
  count: number;
  alumniNames: string[];
}

interface AlumniMapProps {
  locationClusters: LocationCluster[];
  hoveredLocation: string | null;
  setHoveredLocation: (location: string | null) => void;
}

const MAP_FILL = "#507168";
const MAP_BORDER_STROKE = "#F8F9F2";

const geoStyle = {
  default: {
    fill: MAP_FILL,
    stroke: MAP_BORDER_STROKE,
    strokeWidth: 0.5,
    outline: "none",
  },
  hover: {
    fill: MAP_FILL,
    stroke: MAP_BORDER_STROKE,
    strokeWidth: 0.5,
    outline: "none",
  },
  pressed: {
    fill: MAP_FILL,
    stroke: MAP_BORDER_STROKE,
    strokeWidth: 0.5,
    outline: "none",
  },
};

const AlumniMap: React.FC<AlumniMapProps> = ({
  locationClusters,
  hoveredLocation,
  setHoveredLocation,
}) => {
  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        scale: 500,
        center: [-97, 50],
      }}
      width={800}
      height={800}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        backgroundColor: "transparent",
      }}
    >
      {/* US states with state boundary lines */}
      <Geographies geography={US_STATES_URL}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={MAP_FILL}
              stroke={MAP_BORDER_STROKE}
              strokeWidth={0.5}
              style={geoStyle}
              tabIndex={-1}
            />
          ))
        }
      </Geographies>

      {/* Canadian provinces with province boundary lines */}
      <Geographies geography={CANADA_PROVINCES_URL}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              key={geo.rsmKey}
              geography={geo}
              fill={MAP_FILL}
              stroke={MAP_BORDER_STROKE}
              strokeWidth={0.5}
              style={geoStyle}
              tabIndex={-1}
            />
          ))
        }
      </Geographies>

      {/* Alumni location markers */}
      {locationClusters.map((cluster, idx) => {
        const isHovered = hoveredLocation === cluster.key;
        const baseSize = cluster.count > 1 ? 6 + cluster.count * 1.2 : 4;
        const size = isHovered ? baseSize * 1.4 : baseSize;
        const color = markerColors[idx % markerColors.length];

        return (
          <Marker key={cluster.key} coordinates={cluster.coordinates}>
            {/* Outer glow */}
            <circle r={size + 2} fill={color} opacity={isHovered ? 0.4 : 0.2} />
            {/* Main dot */}
            <circle
              r={size}
              fill={color}
              stroke="#FFFFFF"
              strokeWidth={cluster.count > 1 ? 2 : 1}
              style={{
                cursor: "pointer",
                filter: isHovered
                  ? "drop-shadow(0px 4px 4px rgba(0,0,0,0.35))"
                  : "drop-shadow(0px 4px 4px rgba(0,0,0,0.25))",
              }}
              onMouseEnter={() => setHoveredLocation(cluster.key)}
              onMouseLeave={() => setHoveredLocation(null)}
            />
            {/* Count label for clusters */}
            {cluster.count > 1 && (
              <text
                textAnchor="middle"
                dominantBaseline="central"
                style={{
                  fontFamily: "Roboto, sans-serif",
                  fontWeight: 700,
                  fontSize: size * 0.8,
                  fill: "#FFFFFF",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {cluster.count}
              </text>
            )}
          </Marker>
        );
      })}
    </ComposableMap>
  );
};

export default AlumniMap;
