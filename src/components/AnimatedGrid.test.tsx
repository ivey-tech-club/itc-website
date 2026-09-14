import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import AnimatedGrid from "./AnimatedGrid";
import {
	getCellVisualState,
	getGridConfiguration,
	getGridLayout,
	getGridRenderModel,
	getCellRect,
} from "./animated-grid";

describe("animated grid rendering", () => {
	it("keeps the desktop and compact compositions at their intended density", () => {
		expect(getGridConfiguration(false)).toMatchObject({
			columns: 24,
			rows: 12,
			rowGap: 10,
		});
		expect(getGridConfiguration(true)).toMatchObject({
			columns: 6,
			rows: 12,
			rowGap: 12,
		});

		const desktop = getGridLayout({
			width: 1200,
			height: 600,
			viewportWidth: 1440,
			compact: false,
		});
		const compact = getGridLayout({
			width: 360,
			height: 640,
			viewportWidth: 360,
			compact: true,
		});

		expect(desktop.cellSize).toBeCloseTo(43.2);
		expect(compact.cellSize).toBeCloseTo(41.4);
		expect(getCellRect(desktop, 23, 11).x + desktop.cellSize).toBeCloseTo(1200);
		expect(getCellRect(compact, 5, 11).x + compact.cellSize).toBeCloseTo(360);
		expect(getCellRect(desktop, 0, 0).y).toBeGreaterThan(0);
		expect(getGridRenderModel({
			width: 1200,
			height: 600,
			viewportWidth: 1440,
			compact: false,
		}).cells).toHaveLength(288);
		expect(getGridRenderModel({
			width: 360,
			height: 640,
			viewportWidth: 360,
			compact: true,
		}).cells).toHaveLength(72);
	});

	it("uses available desktop height for additional rows", () => {
		const layout = getGridLayout({
			width: 1507.5,
			height: 764,
			viewportWidth: 1600,
			compact: false,
		});

		expect(layout.rows).toBe(13);
		expect(getCellRect(layout, 0, layout.rows - 1).y + layout.cellSize).toBeLessThanOrEqual(
			layout.height,
		);
		expect(getGridRenderModel({
			width: 1507.5,
			height: 764,
			viewportWidth: 1600,
			compact: false,
		}).cells).toHaveLength(24 * 13);
	});

	it("repeats its animation cleanly without per-cell DOM state", () => {
		const atStart = getCellVisualState(4, 3, 0, false);
		const atCycleEnd = getCellVisualState(4, 3, 8.6, false);

		expect(atStart).toEqual(atCycleEnd);
		expect(atStart.opacity).toBeGreaterThan(0);
		expect(atStart.opacity).toBeLessThan(1);
		expect(atStart.speckleOpacity).toBeGreaterThanOrEqual(0);
		expect(atStart.speckleOpacity).toBeLessThanOrEqual(1);
	});

	it("renders one composited surface instead of hundreds of animated cells", () => {
		const getContext = vi
			.spyOn(HTMLCanvasElement.prototype, "getContext")
			.mockReturnValue(null);

		const { container } = render(<AnimatedGrid />);

		expect(container.querySelectorAll("canvas.reference-grid")).toHaveLength(1);
		expect(container.querySelectorAll(".reference-grid__cell")).toHaveLength(0);

		getContext.mockRestore();
	});
});
