import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AlumniMap, {
  formatMarkerLocationLabel,
  getMarkerLabelPositions,
  getMarkerPositions,
  panViewBox,
  projectLocation,
} from "./AlumniMap";
import type { LocationCluster } from "./alumni-data";
import { CANADA_PROVINCE_PATHS, US_STATE_PATHS } from "./north-america-paths";

const clusters: LocationCluster[] = [
  {
    key: "Toronto, ON",
    label: "Toronto, ON",
    coordinates: [-79.3832, 43.6532],
    count: 1,
    alumniIds: ["one"],
    companies: ["Northstar"],
    members: [{ id: "one", name: "One Person", company: "Northstar" }],
  },
  {
    key: "San Francisco, CA",
    label: "San Francisco, CA",
    coordinates: [-122.4194, 37.7749],
    count: 4,
    alumniIds: ["two", "three", "four", "five"],
    companies: ["Acme"],
    members: [
      { id: "two", name: "Two Person", company: "Acme" },
      { id: "three", name: "Three Person", company: "Acme" },
      { id: "four", name: "Four Person", company: "Acme" },
      { id: "five", name: "Five Person", company: "Acme" },
    ],
  },
];

describe("AlumniMap", () => {
  it("keeps city names readable for exact and merged locations", () => {
    expect(formatMarkerLocationLabel({ label: "Toronto, ON" })).toBe("Toronto");
    expect(
      formatMarkerLocationLabel({
        label: "Seattle area",
        locations: ["Redmond, WA", "Seattle, WA"],
      }),
    ).toBe("Redmond / Seattle");
  });

  it("projects alumni coordinates into the generated 800px map space", () => {
    expect(projectLocation([-74.006, 40.7128])).toEqual([573.587, 535.526]);
    expect(projectLocation([-122.4194, 37.7749])).toEqual([102.422, 565.189]);
  });

  it("anchors every marker to its projected city coordinate", () => {
    const closeClusters: LocationCluster[] = [
      { ...clusters[1], key: "san francisco|ca", label: "San Francisco, CA" },
      {
        ...clusters[0],
        key: "mountain view|ca",
        label: "Mountain View, CA",
        count: 1,
        coordinates: [-122.0838, 37.3861],
      },
    ];
    const positions = getMarkerPositions(closeClusters);
    const sanFrancisco = positions.get("san francisco|ca")!;
    const mountainView = positions.get("mountain view|ca")!;

    expect(sanFrancisco).toEqual(projectLocation(clusters[1].coordinates));
    expect(mountainView).toEqual(projectLocation([-122.0838, 37.3861]));
  });

  it("moves only colliding labels into a nearby row", () => {
    const closeClusters: LocationCluster[] = [
      { ...clusters[1], key: "san francisco|ca", label: "San Francisco, CA" },
      {
        ...clusters[0],
        key: "mountain view|ca",
        label: "Mountain View, CA",
        coordinates: [-122.0838, 37.3861],
      },
    ];
    const markerPositions = getMarkerPositions(closeClusters);
    const labelPositions = getMarkerLabelPositions(closeClusters);

    expect(labelPositions.get("san francisco|ca")).not.toEqual(
      labelPositions.get("mountain view|ca"),
    );
    expect(labelPositions.get("san francisco|ca")).not.toEqual(
      markerPositions.get("san francisco|ca"),
    );
    expect(markerPositions.get("mountain view|ca")).toEqual(
      projectLocation([-122.0838, 37.3861]),
    );
  });

  it("falls back safely when every collision-free marker position is occupied", () => {
    const sameLocation = Array.from({ length: 10 }, (_, index) => ({
      ...clusters[1],
      key: `same-location-${index}`,
      count: 10,
    }));
    const positions = getMarkerPositions(sameLocation);

    expect(positions.get("same-location-9")).toEqual(
      projectLocation(clusters[1].coordinates),
    );
  });

  it("pans the view box from pointer deltas and clamps at edges", () => {
    // At zoom 1 the full map fills the viewport, so pan is clamped to origin.
    expect(panViewBox(0, 0, 1, -100, -50, 800, 800)).toEqual({
      zoom: 1,
      x: 0,
      y: 0,
    });
    // Zoomed in: dragging left/up moves the view origin right/down.
    expect(panViewBox(0, 0, 2, -100, -50, 800, 800)).toEqual({
      zoom: 2,
      x: 50,
      y: 25,
    });
    expect(panViewBox(0, 0, 2, 200, 200, 800, 800)).toEqual({
      zoom: 2,
      x: 0,
      y: 0,
    });
    expect(panViewBox(0, 0, 2, -100, -50, 0, 0)).toEqual({
      zoom: 2,
      x: 50,
      y: 25,
    });
  });

  it("keeps generated regions within the intended North America projection", () => {
    for (const path of [...US_STATE_PATHS, ...CANADA_PROVINCE_PATHS]) {
      const coordinates = Array.from(
        path.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g),
        (match) => [Number(match[1]), Number(match[2])] as const,
      );
      const xCoordinates = coordinates.map(([x]) => x);
      const yCoordinates = coordinates.map(([, y]) => y);

      expect(Math.max(...xCoordinates) - Math.min(...xCoordinates)).toBeLessThan(1200);
      expect(Math.max(...yCoordinates) - Math.min(...yCoordinates)).toBeLessThan(1200);
    }
  });

  it("renders the self-contained North America map and cluster counts", () => {
    const { container } = render(
      <AlumniMap
        clusters={clusters}
        activeLocation={null}
        selectedLocation={null}
        onActiveLocation={vi.fn()}
        onSelectLocation={vi.fn()}
      />,
    );

    expect(container.querySelectorAll("svg path")).toHaveLength(
      US_STATE_PATHS.length + CANADA_PROVINCE_PATHS.length,
    );
    expect(
      Array.from(container.querySelectorAll("text"), (element) => element.textContent),
    ).toContain("4");
    expect(container.querySelector("svg title")?.textContent).toBe("Toronto, ON: One Person");
    expect(screen.queryByRole("group", { name: "Map region" })).not.toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Map zoom" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Toronto, ON: One Person at Northstar. Show profiles.",
      }),
    ).toBeInTheDocument();
  });

  it("keeps the default map focused on locations and counts", () => {
    const { container } = render(
      <AlumniMap
        clusters={clusters}
        activeLocation={null}
        selectedLocation={null}
        onActiveLocation={vi.fn()}
        onSelectLocation={vi.fn()}
      />,
    );

    expect(container.querySelectorAll("[data-map-marker]")).toHaveLength(2);
    expect(container.querySelectorAll("image")).toHaveLength(0);
    expect(screen.getByText("Toronto")).toBeInTheDocument();
    expect(screen.getByText("San Francisco")).toBeInTheDocument();
  });

  it("renders local logos, initials fallbacks, and concise mixed-company labels", () => {
    const mixedCompanies: LocationCluster[] = [
      {
        ...clusters[0],
        key: "mixed-companies",
        label: "Mixed Companies",
        count: 2,
        alumniIds: ["google", "unknown"],
        companies: ["Google", "Unknown Brand"],
        members: [
          { id: "google", name: "Google Person", company: "Google" },
          { id: "unknown", name: "Unknown Person", company: "Unknown Brand" },
        ],
      },
      {
        ...clusters[0],
        key: "unreported-companies",
        label: "Unreported Companies",
        coordinates: [-74.006, 40.7128],
        count: 2,
        alumniIds: ["unreported-one", "unreported-two"],
        companies: [],
        members: [
          { id: "unreported-one", name: "Unreported One", company: "" },
          { id: "unreported-two", name: "Unreported Two", company: "" },
        ],
      },
    ];
    const { container } = render(
      <AlumniMap
        clusters={mixedCompanies}
        activeLocation="mixed-companies"
        selectedLocation={null}
        onActiveLocation={vi.fn()}
        onSelectLocation={vi.fn()}
      />,
    );

    expect(container.querySelector('image[href="/company-logos/google.svg"]')).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Mixed Companies: 2 alumni. Companies: Google, Unknown Brand. Show profiles.",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Unreported Companies: 2 alumni. Show profiles.",
      }),
    ).toBeInTheDocument();
  });

  it("mirrors map hover and selects a location without rendering a hover tooltip", () => {
    const onActiveLocation = vi.fn();
    const onSelectLocation = vi.fn();
    render(
      <AlumniMap
        clusters={clusters}
        activeLocation="Toronto, ON"
        selectedLocation="San Francisco, CA"
        onActiveLocation={onActiveLocation}
        onSelectLocation={onSelectLocation}
      />,
    );
    const marker = screen.getByRole("button", {
      name: "San Francisco, CA: 4 alumni. Companies: Acme (4). Show profiles.",
    });

    fireEvent.mouseEnter(marker);
    expect(onActiveLocation).toHaveBeenLastCalledWith("San Francisco, CA");
    fireEvent.mouseLeave(marker);
    expect(onActiveLocation).toHaveBeenLastCalledWith(null);
    fireEvent.focus(marker);
    expect(onActiveLocation).toHaveBeenLastCalledWith("San Francisco, CA");
    fireEvent.blur(marker);
    expect(onActiveLocation).toHaveBeenLastCalledWith(null);
    fireEvent.click(marker);
    expect(onSelectLocation).toHaveBeenCalledWith("San Francisco, CA");
  });

  it("supports keyboard activation on markers", () => {
    const onSelectLocation = vi.fn();
    render(
      <AlumniMap
        clusters={clusters}
        activeLocation={null}
        selectedLocation={null}
        onActiveLocation={vi.fn()}
        onSelectLocation={onSelectLocation}
      />,
    );

    const marker = screen.getByRole("button", {
      name: "Toronto, ON: One Person at Northstar. Show profiles.",
    });
    fireEvent.keyDown(marker, { key: "Enter" });
    expect(onSelectLocation).toHaveBeenCalledWith("Toronto, ON");
    fireEvent.keyDown(marker, { key: " " });
    expect(onSelectLocation).toHaveBeenCalledTimes(2);
  });

  it("supports zoom controls without region presets", () => {
    const { container } = render(
      <AlumniMap
        clusters={clusters}
        activeLocation={null}
        selectedLocation={null}
        onActiveLocation={vi.fn()}
        onSelectLocation={vi.fn()}
      />,
    );

    const svg = container.querySelector("svg");
    expect(screen.getByTestId("alumni-map-surface")).toBeInTheDocument();
    expect(svg?.getAttribute("viewBox")).toBe("0 0 800 800");

    fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
    const afterZoomIn = svg!.getAttribute("viewBox")!;
    const [, , widthAfterIn] = afterZoomIn.split(" ").map(Number);
    expect(widthAfterIn).toBeLessThan(800);

    fireEvent.click(screen.getByRole("button", { name: "Zoom out" }));
    const afterZoomOut = svg!.getAttribute("viewBox")!;
    const [, , widthAfterOut] = afterZoomOut.split(" ").map(Number);
    expect(widthAfterOut).toBeGreaterThan(widthAfterIn);

    expect(screen.queryByRole("group", { name: "Map region" })).not.toBeInTheDocument();
  });

  it("coalesces pointer drags into animation frames", () => {
    const frames: FrameRequestCallback[] = [];
    const requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
      frames.push(callback);
      return frames.length;
    });
    const cancelAnimationFrame = vi.fn();
    const previousRequestAnimationFrame = window.requestAnimationFrame;
    const previousCancelAnimationFrame = window.cancelAnimationFrame;
    Object.defineProperty(window, "requestAnimationFrame", {
      configurable: true,
      value: requestAnimationFrame,
    });
    Object.defineProperty(window, "cancelAnimationFrame", {
      configurable: true,
      value: cancelAnimationFrame,
    });

    try {
      const { container } = render(
        <AlumniMap
          clusters={clusters}
          activeLocation={null}
          selectedLocation={null}
          onActiveLocation={vi.fn()}
          onSelectLocation={vi.fn()}
        />,
      );

      const surface = screen.getByTestId("alumni-map-surface");
      const svg = container.querySelector("svg")!;
      const dispatchPointer = (
        target: EventTarget,
        type: "pointerdown" | "pointermove" | "pointerup",
        init: { button?: number; clientX: number; clientY: number; pointerId: number },
      ) => {
        const event = new MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          button: init.button ?? 0,
          clientX: init.clientX,
          clientY: init.clientY,
        });
        Object.defineProperty(event, "pointerId", { value: init.pointerId });
        Object.defineProperty(event, "pointerType", { value: "mouse" });
        target.dispatchEvent(event);
      };
      fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
      const beforeDrag = svg.getAttribute("viewBox");

      act(() => {
        dispatchPointer(surface, "pointerdown", {
          button: 0,
          clientX: 400,
          clientY: 400,
          pointerId: 1,
        });
      });
      act(() => {
        dispatchPointer(window, "pointermove", {
          clientX: 360,
          clientY: 360,
          pointerId: 1,
        });
        dispatchPointer(window, "pointermove", {
          clientX: 320,
          clientY: 320,
          pointerId: 1,
        });
      });

      expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
      expect(svg.getAttribute("viewBox")).toBe(beforeDrag);

      act(() => frames[0](0));
      expect(svg.getAttribute("viewBox")).not.toBe(beforeDrag);

      act(() => {
        dispatchPointer(window, "pointerup", {
          clientX: 320,
          clientY: 320,
          pointerId: 1,
        });
      });
      expect(cancelAnimationFrame).not.toHaveBeenCalled();
    } finally {
      Object.defineProperty(window, "requestAnimationFrame", {
        configurable: true,
        value: previousRequestAnimationFrame,
      });
      Object.defineProperty(window, "cancelAnimationFrame", {
        configurable: true,
        value: previousCancelAnimationFrame,
      });
    }
  });

  it("flushes a pending drag when requestAnimationFrame is unavailable", () => {
    const previousRequestAnimationFrame = window.requestAnimationFrame;
    const clearTimeoutSpy = vi.spyOn(window, "clearTimeout");
    Object.defineProperty(window, "requestAnimationFrame", {
      configurable: true,
      value: undefined,
    });

    try {
      const { container } = render(
        <AlumniMap
          clusters={clusters}
          activeLocation={null}
          selectedLocation={null}
          onActiveLocation={vi.fn()}
          onSelectLocation={vi.fn()}
        />,
      );

      const surface = screen.getByTestId("alumni-map-surface");
      const svg = container.querySelector("svg")!;
      const dispatchPointer = (
        target: EventTarget,
        type: "pointerdown" | "pointermove" | "pointerup",
        init: { button?: number; clientX: number; clientY: number; pointerId: number },
      ) => {
        const event = new MouseEvent(type, {
          bubbles: true,
          cancelable: true,
          button: init.button ?? 0,
          clientX: init.clientX,
          clientY: init.clientY,
        });
        Object.defineProperty(event, "pointerId", { value: init.pointerId });
        Object.defineProperty(event, "pointerType", { value: "mouse" });
        target.dispatchEvent(event);
      };
      fireEvent.click(screen.getByRole("button", { name: "Zoom in" }));
      const beforeDrag = svg.getAttribute("viewBox");

      act(() => {
        dispatchPointer(surface, "pointerdown", {
          button: 0,
          clientX: 400,
          clientY: 400,
          pointerId: 2,
        });
      });
      act(() => {
        dispatchPointer(window, "pointermove", {
          clientX: 320,
          clientY: 320,
          pointerId: 2,
        });
      });
      expect(svg.getAttribute("viewBox")).toBe(beforeDrag);

      act(() => {
        dispatchPointer(window, "pointerup", {
          clientX: 320,
          clientY: 320,
          pointerId: 2,
        });
      });
      expect(svg.getAttribute("viewBox")).not.toBe(beforeDrag);
      expect(clearTimeoutSpy).toHaveBeenCalled();
    } finally {
      Object.defineProperty(window, "requestAnimationFrame", {
        configurable: true,
        value: previousRequestAnimationFrame,
      });
      clearTimeoutSpy.mockRestore();
    }
  });

  it("supports an empty map without region preset controls", () => {
    render(
      <AlumniMap
        clusters={[]}
        activeLocation={null}
        selectedLocation={null}
        onActiveLocation={vi.fn()}
        onSelectLocation={vi.fn()}
      />,
    );

    expect(screen.getByRole("region", { name: "Alumni locations map" })).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(2);
  });
});
