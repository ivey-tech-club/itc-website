"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";

import {
  getClusterCompanySummary,
  type LocationCluster,
  type LocationClusterMember,
} from "./alumni-data";
import { getCompanyInitials, getCompanyLogo } from "./company-logos";
import styles from "./Alumni.module.css";
import { projectLocation } from "./map-projection";
import { CANADA_PROVINCE_PATHS, US_STATE_PATHS } from "./north-america-paths";

export { projectLocation } from "./map-projection";

const MARKER_COLORS = ["#004938", "#1f6755", "#3f786b", "#6a978b", "#2e5e52"] as const;
const MAP_FILL = "#507168";
const MAP_BORDER = "#f8f9f2";
const MAP_SIZE = 800;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const DRAG_THRESHOLD_PX = 3;
const ZOOM_STEP = 0.35;
const WHEEL_ZOOM_STEP = 0.25;

function roundCoordinate(value: number) {
  return Math.round(value * 1_000) / 1_000;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Pure pan math used by pointer drag (exported for unit tests). */
export function panViewBox(
  originX: number,
  originY: number,
  zoom: number,
  dxClient: number,
  dyClient: number,
  surfaceWidth: number,
  surfaceHeight: number,
): { zoom: number; x: number; y: number } {
  const width = surfaceWidth > 0 ? surfaceWidth : MAP_SIZE;
  const height = surfaceHeight > 0 ? surfaceHeight : MAP_SIZE;
  const scaleX = (MAP_SIZE / zoom) / width;
  const scaleY = (MAP_SIZE / zoom) / height;
  const nextWidth = MAP_SIZE / zoom;
  const nextHeight = MAP_SIZE / zoom;
  return {
    zoom,
    x: clamp(originX - dxClient * scaleX, 0, MAP_SIZE - nextWidth),
    y: clamp(originY - dyClient * scaleY, 0, MAP_SIZE - nextHeight),
  };
}

interface ViewState {
  zoom: number;
  x: number;
  y: number;
}

function fitView(zoom: number, centerX: number, centerY: number): ViewState {
  const viewWidth = MAP_SIZE / zoom;
  const viewHeight = MAP_SIZE / zoom;
  return {
    zoom,
    x: clamp(centerX - viewWidth / 2, 0, MAP_SIZE - viewWidth),
    y: clamp(centerY - viewHeight / 2, 0, MAP_SIZE - viewHeight),
  };
}

function markerRadius(count: number) {
  return count === 1 ? 9 : Math.min(16, 10 + Math.sqrt(count) * 2);
}

/**
 * Keep the visual marker anchored to the actual projected city. Labels and
 * company rails can share the point without relocating the geographic signal.
 */
export function getMarkerPositions(
  clusters: readonly LocationCluster[],
): ReadonlyMap<string, [number, number]> {
  return new Map(
    clusters.map((cluster) => [cluster.key, projectLocation(cluster.coordinates)]),
  );
}

function formatViewBox(view: ViewState) {
  const width = MAP_SIZE / view.zoom;
  const height = MAP_SIZE / view.zoom;
  return `${view.x} ${view.y} ${width} ${height}`;
}

interface AlumniMapProps {
  clusters: readonly LocationCluster[];
  activeLocation: string | null;
  selectedLocation: string | null;
  onActiveLocation: (location: string | null) => void;
  onSelectLocation: (location: string) => void;
}

function LogoBadge({
  company,
  logo,
  x,
  y,
  size = 24,
}: {
  company: string;
  logo: string | null;
  x: number;
  y: number;
  size?: number;
}) {
  const badgeSize = size + 6;

  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      <rect
        x={-badgeSize / 2}
        y={-badgeSize / 2}
        width={badgeSize}
        height={badgeSize}
        rx={4}
        fill="#f8f9f2"
        stroke="#ffffff"
        strokeWidth={1.5}
      />
      {logo ? (
        <image
          href={logo}
          x={-size / 2}
          y={-size / 2}
          width={size}
          height={size}
          preserveAspectRatio="xMidYMid meet"
        />
      ) : (
        <text
          textAnchor="middle"
          dominantBaseline="central"
          fill="#004938"
          fontSize={Math.max(7, size * 0.34)}
          fontWeight={700}
        >
          {getCompanyInitials(company)}
        </text>
      )}
    </g>
  );
}

function CompanyRail({
  companies,
  extraCompanies,
  y,
}: {
  companies: ReturnType<typeof getClusterCompanySummary>;
  extraCompanies: number;
  y: number;
}) {
  if (!companies.length) return null;

  const visibleCompanies = companies.slice(0, 3);
  const cellWidth = 25;
  const railPadding = 5;
  const railHeight = 27;
  const extraWidth = extraCompanies ? 22 : 0;
  const railWidth = railPadding * 2 + visibleCompanies.length * cellWidth + extraWidth;
  const firstX = -railWidth / 2 + railPadding + cellWidth / 2;

  return (
    <g transform={`translate(0 ${y})`} aria-hidden="true">
      <rect
        x={-railWidth / 2}
        y={-railHeight / 2}
        width={railWidth}
        height={railHeight}
        rx={5}
        fill="#f8f9f2"
        stroke="#ffffff"
        strokeWidth={1.5}
      />
      {visibleCompanies.map((company, index) => (
        <LogoBadge
          key={company.name}
          company={company.name}
          logo={getCompanyLogo(company.name)}
          x={firstX + index * cellWidth}
          y={0}
          size={16}
        />
      ))}
      {extraCompanies ? (
        <text
          x={railWidth / 2 - extraWidth / 2}
          y={1}
          textAnchor="middle"
          dominantBaseline="central"
          fill="#154d3c"
          fontSize="9"
          fontWeight={700}
        >
          +{extraCompanies}
        </text>
      ) : null}
    </g>
  );
}

function markerLabel(cluster: LocationCluster, member?: LocationClusterMember) {
  if (cluster.count === 1 && member) {
    const workplace = member.company ? ` at ${member.company}` : "";
    return `${cluster.label}: ${member.name}${workplace}. Show profiles.`;
  }

  const companies = getClusterCompanySummary(cluster)
    .map(({ name, count }) => (count > 1 ? `${name} (${count})` : name))
    .join(", ");
  return `${cluster.label}: ${cluster.count} alumni${companies ? `. Companies: ${companies}` : ""}. Show profiles.`;
}

export function formatMarkerLocationLabel(
  cluster: Pick<LocationCluster, "label" | "locations">,
) {
  const withoutRegion = (location: string) =>
    location.replace(/,\s*[A-Z]{2,}$/, "");
  const locations = cluster.locations
    ?.map(withoutRegion)
    .filter(Boolean);

  return locations?.length ? locations.join(" / ") : withoutRegion(cluster.label);
}

function estimatedLabelWidth(label: string) {
  return Math.min(190, Math.max(52, label.length * 7.4 + 14));
}

type PlacedLabel = {
  x: number;
  y: number;
  width: number;
};

function labelsOverlap(first: PlacedLabel, second: PlacedLabel) {
  const horizontalOverlap =
    Math.abs(first.x - second.x) < (first.width + second.width) / 2;
  return horizontalOverlap && Math.abs(first.y - second.y) < 22;
}

/**
 * Keep labels close to their exact city point while giving neighboring labels
 * a second row when their text would collide. The marker itself never moves.
 */
export function getMarkerLabelPositions(
  clusters: readonly LocationCluster[],
): ReadonlyMap<string, [number, number]> {
  const markerPositions = getMarkerPositions(clusters);
  const placedLabels: PlacedLabel[] = [];

  return new Map(
    clusters.map((cluster) => {
      const [markerX, markerY] = markerPositions.get(cluster.key) ?? [0, 0];
      const width = estimatedLabelWidth(formatMarkerLocationLabel(cluster));
      const baseY = markerY + markerRadius(cluster.count) + 26;
      const candidates = [
        [markerX, baseY],
        [markerX, baseY + 26],
        [markerX + width / 2 + 10, baseY],
        [markerX - width / 2 - 10, baseY],
        [markerX, markerY - markerRadius(cluster.count) - 20],
      ] as const;
      const [labelX, labelY] =
        candidates.find(([x, y]) =>
          !placedLabels.some((placed) => labelsOverlap({ x, y, width }, placed)),
        ) ?? candidates[0];

      placedLabels.push({ x: labelX, y: labelY, width });
      return [cluster.key, [roundCoordinate(labelX), roundCoordinate(labelY)]];
    }),
  );
}

export default function AlumniMap({
  clusters,
  activeLocation,
  selectedLocation,
  onActiveLocation,
  onSelectLocation,
}: AlumniMapProps) {
  const [view, setView] = useState<ViewState>(() => fitView(1, 400, 400));
  const viewRef = useRef(view);
  const [isDragging, setIsDragging] = useState(false);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{
    pointerId: number;
    startClientX: number;
    startClientY: number;
    originX: number;
    originY: number;
    moved: boolean;
    zoom: number;
    surfaceWidth: number;
    surfaceHeight: number;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const suppressClickTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const windowDragListenersRef = useRef<{
    onMove: (event: PointerEvent) => void;
    onUp: (event: PointerEvent) => void;
  } | null>(null);
  const dragPointRef = useRef<{ clientX: number; clientY: number } | null>(null);
  const dragFrameRef = useRef<{ mode: "raf" | "timeout"; id: number } | null>(null);

  useEffect(() => {
    return () => {
      if (suppressClickTimerRef.current) clearTimeout(suppressClickTimerRef.current);
    };
  }, []);

  const viewWidth = MAP_SIZE / view.zoom;
  const viewHeight = MAP_SIZE / view.zoom;
  const markerPositions = useMemo(() => getMarkerPositions(clusters), [clusters]);
  const markerLabelPositions = useMemo(
    () => getMarkerLabelPositions(clusters),
    [clusters],
  );

  const zoomBy = useCallback((delta: number, anchorX = 400, anchorY = 400) => {
    setView((current) => {
      const nextZoom = clamp(
        Math.round((current.zoom + delta) * 100) / 100,
        MIN_ZOOM,
        MAX_ZOOM,
      );
      if (nextZoom === current.zoom) return current;

      const currentWidth = MAP_SIZE / current.zoom;
      const currentHeight = MAP_SIZE / current.zoom;
      const nextWidth = MAP_SIZE / nextZoom;
      const nextHeight = MAP_SIZE / nextZoom;
      const ratioX = (anchorX - current.x) / currentWidth;
      const ratioY = (anchorY - current.y) / currentHeight;

      const nextView = {
        zoom: nextZoom,
        x: clamp(anchorX - ratioX * nextWidth, 0, MAP_SIZE - nextWidth),
        y: clamp(anchorY - ratioY * nextHeight, 0, MAP_SIZE - nextHeight),
      };
      viewRef.current = nextView;
      return nextView;
    });
  }, []);

  const clientToMapPoint = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return [400, 400] as const;
    const rect = svg.getBoundingClientRect();
    if (!rect.width || !rect.height) return [400, 400] as const;
    const current = viewRef.current;
    const localX = (clientX - rect.left) / rect.width;
    const localY = (clientY - rect.top) / rect.height;
    return [
      current.x + localX * (MAP_SIZE / current.zoom),
      current.y + localY * (MAP_SIZE / current.zoom),
    ] as const;
  }, []);

  const flushDrag = useCallback(() => {
    const drag = dragRef.current;
    const point = dragPointRef.current;
    if (!drag || !point) return;
    const svg = svgRef.current;
    if (!svg) return;

    const nextView = panViewBox(
      drag.originX,
      drag.originY,
      drag.zoom,
      point.clientX - drag.startClientX,
      point.clientY - drag.startClientY,
      drag.surfaceWidth,
      drag.surfaceHeight,
    );
    viewRef.current = nextView;
    svg.setAttribute("viewBox", formatViewBox(nextView));
    dragPointRef.current = null;
  }, []);

  const cancelDragFrame = useCallback(() => {
    const frame = dragFrameRef.current;
    if (!frame) return;

    if (frame.mode === "raf") {
      window.cancelAnimationFrame(frame.id);
    } else {
      window.clearTimeout(frame.id);
    }
    dragFrameRef.current = null;
  }, []);

  const scheduleDragFrame = useCallback(() => {
    if (dragFrameRef.current) return;

    const flush = () => {
      dragFrameRef.current = null;
      flushDrag();
    };

    if (typeof window.requestAnimationFrame === "function") {
      dragFrameRef.current = {
        mode: "raf",
        id: window.requestAnimationFrame(flush),
      };
      return;
    }

    dragFrameRef.current = {
      mode: "timeout",
      id: window.setTimeout(flush, 0),
    };
  }, [flushDrag]);

  const flushPendingDrag = useCallback(() => {
    cancelDragFrame();
    flushDrag();
  }, [cancelDragFrame, flushDrag]);

  const applyDrag = useCallback((clientX: number, clientY: number) => {
    const drag = dragRef.current;
    if (!drag) return;

    const dxClient = clientX - drag.startClientX;
    const dyClient = clientY - drag.startClientY;
    if (Math.hypot(dxClient, dyClient) > DRAG_THRESHOLD_PX) drag.moved = true;

    dragPointRef.current = { clientX, clientY };
    scheduleDragFrame();
  }, [scheduleDragFrame]);

  const finishDrag = useCallback(() => {
    const drag = dragRef.current;
    if (!drag) return;
    flushPendingDrag();
    setView(viewRef.current);
    if (drag.moved) {
      suppressClickRef.current = true;
      if (suppressClickTimerRef.current) clearTimeout(suppressClickTimerRef.current);
      suppressClickTimerRef.current = setTimeout(() => {
        suppressClickRef.current = false;
        suppressClickTimerRef.current = null;
      }, 0);
    }
    dragRef.current = null;
    dragPointRef.current = null;
    setIsDragging(false);
  }, [flushPendingDrag]);

  const detachWindowDrag = useCallback(() => {
    const listeners = windowDragListenersRef.current;
    if (!listeners) return;
    window.removeEventListener("pointermove", listeners.onMove);
    window.removeEventListener("pointerup", listeners.onUp);
    window.removeEventListener("pointercancel", listeners.onUp);
    windowDragListenersRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      detachWindowDrag();
      cancelDragFrame();
    };
  }, [cancelDragFrame, detachWindowDrag]);

  useEffect(() => {
    const el = surfaceRef.current;
    if (!el) return;

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const [anchorX, anchorY] = clientToMapPoint(event.clientX, event.clientY);
      const delta = event.deltaY > 0 ? -WHEEL_ZOOM_STEP : WHEEL_ZOOM_STEP;
      zoomBy(delta, anchorX, anchorY);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [clientToMapPoint, zoomBy]);

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    if ((event.target as HTMLElement).closest("button, [data-map-marker]")) return;

    const current = viewRef.current;
    const isTouchPointer = event.pointerType === "touch";
    if (!isTouchPointer || current.zoom > MIN_ZOOM) event.preventDefault();
    detachWindowDrag();
    const rect = svgRef.current?.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      originX: current.x,
      originY: current.y,
      moved: false,
      zoom: current.zoom,
      surfaceWidth: rect?.width ?? 0,
      surfaceHeight: rect?.height ?? 0,
    };
    setIsDragging(true);

    const onMove = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== event.pointerId) return;
      applyDrag(moveEvent.clientX, moveEvent.clientY);
    };
    const onUp = (upEvent: PointerEvent) => {
      if (upEvent.pointerId !== event.pointerId) return;
      finishDrag();
      detachWindowDrag();
    };
    windowDragListenersRef.current = { onMove, onUp };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // jsdom / older browsers may omit pointer capture
    }
  };

  const handleMarkerActivate = (key: string) => {
    if (suppressClickRef.current) {
      suppressClickRef.current = false;
      return;
    }
    onSelectLocation(key);
  };

  const handleMarkerKeyDown = (
    event: ReactKeyboardEvent<SVGGElement>,
    key: string,
  ) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    handleMarkerActivate(key);
  };

  return (
    <div
      ref={surfaceRef}
      className={`${styles.mapRegion}${view.zoom > MIN_ZOOM ? ` ${styles.mapRegionLocked}` : ""}${isDragging ? ` ${styles.mapSvgDragging}` : ""}`}
      aria-label="Alumni locations map"
      role="region"
      onPointerDown={onPointerDown}
      data-testid="alumni-map-surface"
    >
      <p className={styles.visuallyHidden}>
        Interactive map of North American alumni locations. Drag to pan, use the zoom
        controls or scroll wheel to zoom, and select a marker to see profiles.
      </p>
      <svg
        ref={svgRef}
        viewBox={`${view.x} ${view.y} ${viewWidth} ${viewHeight}`}
        className={styles.mapSvg}
        focusable="false"
      >
        <g
          fill={MAP_FILL}
          stroke={MAP_BORDER}
          strokeWidth={0.45}
          opacity={0.72}
          aria-hidden="true"
        >
          {US_STATE_PATHS.map((path, index) => (
            <path key={`us-${index}`} d={path} vectorEffect="non-scaling-stroke" />
          ))}
          {CANADA_PROVINCE_PATHS.map((path, index) => (
            <path key={`ca-${index}`} d={path} vectorEffect="non-scaling-stroke" />
          ))}
        </g>

        {clusters.map((cluster, index) => {
          const highlighted =
            cluster.key === activeLocation || cluster.key === selectedLocation;
          const radius = markerRadius(cluster.count);
          const color = MARKER_COLORS[index % MARKER_COLORS.length];
          const singleMember = cluster.count === 1 ? cluster.members[0] : undefined;
          const companySummary = getClusterCompanySummary(cluster, 3);
          const extraCompanies = Math.max(0, cluster.companies.length - companySummary.length);
          const [x, y] = markerPositions.get(cluster.key) ?? projectLocation(cluster.coordinates);
          const locationLabel = formatMarkerLocationLabel(cluster);
          const [labelX, labelY] =
            markerLabelPositions.get(cluster.key) ?? [x, y + radius + 26];

          return (
            <g key={cluster.key}>
              <g
                transform={`translate(${x}, ${y})`}
                className={styles.mapMarker}
                data-map-marker={cluster.key}
                role="button"
                tabIndex={0}
                aria-label={markerLabel(cluster, singleMember)}
                onMouseEnter={() => onActiveLocation(cluster.key)}
                onMouseLeave={() => onActiveLocation(null)}
                onFocus={() => onActiveLocation(cluster.key)}
                onBlur={() => onActiveLocation(null)}
                onClick={() => handleMarkerActivate(cluster.key)}
                onKeyDown={(event) => handleMarkerKeyDown(event, cluster.key)}
              >
                <title>
                  {cluster.count === 1
                    ? `${cluster.label}: ${singleMember?.name ?? "1 alum"}`
                    : `${cluster.label}: ${cluster.count} alumni`}
                </title>
                <circle
                  className={styles.markerFocusRing}
                  r={radius + 7}
                  fill="none"
                  stroke="#f8f9f2"
                  strokeWidth={highlighted ? 4 : 0}
                  opacity={highlighted ? 0.96 : 0}
                />
                <circle
                  r={radius + 3}
                  fill="none"
                  stroke={color}
                  strokeWidth={highlighted ? 3 : 2}
                  opacity={highlighted ? 0.84 : 0.52}
                />
                <circle
                  r={radius}
                  fill={cluster.count === 1 ? "#f8f9f2" : "#ffffff"}
                  stroke="#154d3c"
                  strokeWidth={1.5}
                  className={styles.markerDot}
                />
                {highlighted ? (
                  <CompanyRail
                    companies={companySummary}
                    extraCompanies={extraCompanies}
                    y={-(radius + 22)}
                  />
                ) : null}
                {cluster.count === 1 && singleMember ? (
                  <>
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#004938"
                      fontSize="10"
                      fontWeight={700}
                      pointerEvents="none"
                    >
                      {getCompanyInitials(singleMember.name)}
                    </text>
                  </>
                ) : null}
                {cluster.count > 1 ? (
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    className={styles.markerCount}
                    style={{ fontSize: Math.max(9, radius * 0.62) }}
                    aria-hidden="true"
                  >
                    {cluster.count}
                  </text>
                ) : null}
                <text
                  x={labelX - x}
                  y={labelY - y}
                  textAnchor="middle"
                  className={`${styles.markerLocation}${highlighted ? ` ${styles.markerLocationActive}` : ""}`}
                  pointerEvents="none"
                  aria-hidden="true"
                >
                  {locationLabel}
                </text>
              </g>
            </g>
          );
        })}
      </svg>

      <div className={styles.mapControls} aria-label="Map view controls">
        <div className={styles.mapZoomButtons} role="group" aria-label="Map zoom">
          <button
            type="button"
            aria-label="Zoom out"
            onClick={() => zoomBy(-ZOOM_STEP)}
          >
            −
          </button>
          <button
            type="button"
            aria-label="Zoom in"
            onClick={() => zoomBy(ZOOM_STEP)}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
