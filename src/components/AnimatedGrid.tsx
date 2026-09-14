"use client";

import { useEffect, useRef } from "react";

import {
	getCellVisualStateFromModel,
	getGridRenderModel,
	type GridRenderModel,
} from "./animated-grid";

const MINT = "#d9e8dd";
const WHITE = "#ffffff";

function drawGrid(
	context: CanvasRenderingContext2D,
	model: GridRenderModel,
	elapsedMilliseconds: number,
) {
	const elapsedSeconds = elapsedMilliseconds / 1000;

	context.clearRect(0, 0, model.width, model.height);
	context.fillStyle = MINT;
	context.globalCompositeOperation = "source-over";

	for (const cell of model.cells) {
		const state = getCellVisualStateFromModel(cell, elapsedSeconds);

		context.globalAlpha = state.opacity;
			context.fillRect(cell.x, cell.y, model.cellSize, model.cellSize);

			if (state.speckleOpacity > 0.001) {
					const drawSpeckle = (
					positionX: number,
					positionY: number,
					radius: number,
					opacity: number,
				) => {
					const dotX = cell.x + model.cellSize * positionX;
					const dotY = cell.y + model.cellSize * positionY;

					context.globalAlpha = state.speckleOpacity * opacity;
					context.beginPath();
					context.arc(dotX, dotY, radius, 0, Math.PI * 2);
					context.fill();
				};

				context.fillStyle = WHITE;
				context.globalCompositeOperation = "screen";
			drawSpeckle(0.17, 0.28, 1, 0.9);
			drawSpeckle(0.68, 0.63, 0.8, 0.78);
			drawSpeckle(0.82, 0.19, 0.7, 0.72);
			context.globalCompositeOperation = "source-over";
		}

		context.fillStyle = WHITE;
		context.globalAlpha = 0.02;
		context.fillRect(cell.x, cell.y, model.cellSize, model.cellSize);
		context.fillStyle = MINT;
	}

	context.globalAlpha = 1;
}

function addMediaListener(mediaQuery: MediaQueryList, listener: () => void) {
	if (typeof mediaQuery.addEventListener === "function") {
		mediaQuery.addEventListener("change", listener);
		return () => mediaQuery.removeEventListener("change", listener);
	}

	mediaQuery.addListener(listener);
	return () => mediaQuery.removeListener(listener);
}

export default function AnimatedGrid() {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const context = canvas?.getContext("2d", { alpha: true });

		if (!canvas || !context) {
			return;
		}

		const compactMedia = window.matchMedia("(max-width: 1100px)");
		const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
		let compact = compactMedia.matches;
		let isVisible = true;
		let frameId: number | null = null;
		let dimensions = { width: 0, height: 0, pixelRatio: 1 };
		let renderModel: GridRenderModel | null = null;

		const shouldAnimate = () =>
			!reducedMotionMedia.matches && isVisible && document.visibilityState === "visible";

		const stopAnimation = () => {
			if (frameId !== null) {
				cancelAnimationFrame(frameId);
				frameId = null;
			}
		};

		const draw = (timestamp: number) => {
			if (!renderModel) {
				return;
			}

			context.setTransform(dimensions.pixelRatio, 0, 0, dimensions.pixelRatio, 0, 0);
			drawGrid(context, renderModel, timestamp);
		};

		const animate = (timestamp: number) => {
			frameId = null;

			if (!shouldAnimate()) {
				return;
			}

			draw(timestamp);
			frameId = requestAnimationFrame(animate);
		};

		const startAnimation = () => {
			if (frameId === null && shouldAnimate()) {
				frameId = requestAnimationFrame(animate);
			}
		};

		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			const width = Math.max(1, rect.width);
			const height = Math.max(1, rect.height);
			const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
			const pixelWidth = Math.max(1, Math.round(width * pixelRatio));
			const pixelHeight = Math.max(1, Math.round(height * pixelRatio));

			if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
				canvas.width = pixelWidth;
				canvas.height = pixelHeight;
			}

			dimensions = { width, height, pixelRatio };
			renderModel = getGridRenderModel({
				width,
				height,
				viewportWidth: window.innerWidth,
				compact,
			});
			draw(0);
			startAnimation();
		};

		const onVisibilityChange = () => {
			if (shouldAnimate()) {
				startAnimation();
			} else {
				stopAnimation();
			}
		};
		const onCompactChange = () => {
			compact = compactMedia.matches;
			resize();
		};
		const onMotionChange = () => {
			resize();
		};

		const resizeObserver =
			typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
		resizeObserver?.observe(canvas);
		if (!resizeObserver) {
			window.addEventListener("resize", resize);
		}

		const intersectionObserver =
			typeof IntersectionObserver === "undefined"
				? null
				: new IntersectionObserver(
						([entry]) => {
							isVisible = entry.isIntersecting;
							onVisibilityChange();
						},
						{ rootMargin: "80px" },
					);
		intersectionObserver?.observe(canvas);

		document.addEventListener("visibilitychange", onVisibilityChange);
		const removeCompactListener = addMediaListener(compactMedia, onCompactChange);
		const removeMotionListener = addMediaListener(reducedMotionMedia, onMotionChange);

		resize();

		return () => {
			stopAnimation();
			resizeObserver?.disconnect();
			intersectionObserver?.disconnect();
			window.removeEventListener("resize", resize);
			document.removeEventListener("visibilitychange", onVisibilityChange);
			removeCompactListener();
			removeMotionListener();
		};
	}, []);

	return <canvas ref={canvasRef} className="reference-grid" aria-hidden="true" />;
}
