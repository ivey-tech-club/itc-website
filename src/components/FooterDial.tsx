"use client";

import {
	useEffect,
	useRef,
	useState,
	type PointerEvent as ReactPointerEvent,
} from "react";

import { FOOTER_ART_SETTINGS } from "./footer-art-settings";

const STORAGE_KEY = "itc-footer-art-tuner";

interface ArtSettings {
	dotScale: number;
	zoom: number;
	panX: number;
	panY: number;
}

const DEFAULTS: ArtSettings = { ...FOOTER_ART_SETTINGS };

export default function FooterDial({ alt }: { alt: string }) {
	const [settings, setSettings] = useState<ArtSettings>(DEFAULTS);
	const [version, setVersion] = useState(0);
	const [status, setStatus] = useState<"idle" | "rendering" | "error">("idle");
	const [dragging, setDragging] = useState(false);
	const [size, setSize] = useState<{ w: number; h: number } | null>(null);
	const [aspect, setAspect] = useState<number | null>(null);

	const viewportRef = useRef<HTMLDivElement>(null);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const dragRef = useRef<{
		pointerId: number;
		startClientX: number;
		startClientY: number;
		originX: number;
		originY: number;
		maxX: number;
		maxY: number;
	} | null>(null);

	useEffect(() => {
		const stored = window.localStorage.getItem(STORAGE_KEY);
		if (!stored) return;
		try {
			const parsed = JSON.parse(stored) as Partial<ArtSettings>;
			setSettings({
				dotScale: parsed.dotScale ?? FOOTER_ART_SETTINGS.dotScale,
				zoom: Math.max(1, parsed.zoom ?? FOOTER_ART_SETTINGS.zoom),
				panX: parsed.panX ?? FOOTER_ART_SETTINGS.panX,
				panY: parsed.panY ?? FOOTER_ART_SETTINGS.panY,
			});
		} catch {
			// ignore malformed stored settings
		}
	}, []);

	useEffect(() => {
		const el = viewportRef.current;
		if (!el || typeof ResizeObserver === "undefined") return;
		const observer = new ResizeObserver(([entry]) => {
			setSize({
				w: entry.contentRect.width,
				h: entry.contentRect.height,
			});
		});
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, []);

	const persist = (next: ArtSettings) => {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
	};

	const update = (patch: Partial<ArtSettings>) => {
		setSettings((current) => {
			const next = { ...current, ...patch };
			persist(next);
			return next;
		});
	};

	const queueDotRender = (dotScale: number) => {
		update({ dotScale });
		if (timerRef.current) clearTimeout(timerRef.current);
		timerRef.current = setTimeout(async () => {
			setStatus("rendering");
			try {
				const response = await fetch(`/api/halftone?scale=${dotScale}`);
				if (!response.ok) throw new Error(await response.text());
				setVersion((current) => current + 1);
				setStatus("idle");
			} catch {
				setStatus("error");
			}
		}, 500);
	};

	// Displayed bitmap: cover the viewport at zoom >= 1, keeping the full raster
	// as the element box so no pixel is ever clipped away.
	let displayWidth = 0;
	if (size && aspect) {
		displayWidth = Math.max(size.w * settings.zoom, size.h * aspect);
	}
	const displayHeight = aspect ? displayWidth / aspect : 0;

	const limitsFor = () => {
		if (!size || !aspect) return { maxX: 0, maxY: 0 };
		const w = Math.max(size.w * settings.zoom, size.h * aspect);
		const h = w / aspect;
		return {
			maxX: Math.max(0, (w - size.w) / 2),
			maxY: Math.max(0, (h - size.h) / 2),
		};
	};

	const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
		if (event.button !== 0) return;
		if ((event.target as HTMLElement).closest(".footer-tuner")) return;
		event.preventDefault();
		const { maxX, maxY } = limitsFor();
		dragRef.current = {
			pointerId: event.pointerId,
			startClientX: event.clientX,
			startClientY: event.clientY,
			originX: settings.panX,
			originY: settings.panY,
			maxX,
			maxY,
		};
		event.currentTarget.setPointerCapture?.(event.pointerId);
		setDragging(true);
	};

	const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
		const drag = dragRef.current;
		if (!drag || drag.pointerId !== event.pointerId) return;
		update({
			panX: Math.round(
				Math.min(drag.maxX, Math.max(-drag.maxX, drag.originX + (event.clientX - drag.startClientX))),
			),
			panY: Math.round(
				Math.min(drag.maxY, Math.max(-drag.maxY, drag.originY + (event.clientY - drag.startClientY))),
			),
		});
	};

	const endDrag = () => {
		dragRef.current = null;
		setDragging(false);
	};

	const resetAll = () => {
		update(DEFAULTS);
		queueDotRender(DEFAULTS.dotScale);
	};

	return (
		<div
			ref={viewportRef}
			className={`footer-art-viewport${dragging ? " footer-art-viewport--dragging" : ""}`}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={endDrag}
			onPointerCancel={endDrag}
		>
			{size && aspect ? (
				<img
					className="footer-art-bitmap"
					src={`/ivey-building-halftone-monitor.png?v=${encodeURIComponent(`${settings.dotScale}-${version}`)}`}
					alt={alt}
					draggable={false}
					style={{
						width: `${displayWidth}px`,
						height: `${displayHeight}px`,
						transform: `translate(-50%, -50%) translate(${settings.panX}px, ${settings.panY}px)`,
					}}
				/>
			) : null}

			{/* Hidden probe to read the raster aspect ratio */}
			<img
				aria-hidden="true"
				alt=""
				className="footer-art-probe"
				src="/ivey-building-halftone-monitor.png"
				onLoad={(event) => {
					const img = event.currentTarget;
					if (img.naturalWidth && img.naturalHeight) {
						setAspect(img.naturalWidth / img.naturalHeight);
					}
				}}
			/>

			<div className="footer-tuner">
				<strong>Artwork tuner (temporary)</strong>

				<label>
					Dot size
					<input
						type="range"
						min={0.5}
						max={2.5}
						step={0.05}
						value={settings.dotScale}
						onChange={(event) => queueDotRender(Number(event.target.value))}
					/>
					<output>{settings.dotScale.toFixed(2)}×</output>
				</label>

				<label>
					Zoom
					<input
						type="range"
						min={1}
						max={3}
						step={0.05}
						value={settings.zoom}
						onChange={(event) => {
							const zoom = Number(event.target.value);
							const { maxX, maxY } = (() => {
								if (!size || !aspect) return { maxX: 0, maxY: 0 };
								const w = Math.max(size.w * zoom, size.h * aspect);
								const h = w / aspect;
								return {
									maxX: Math.max(0, (w - size.w) / 2),
									maxY: Math.max(0, (h - size.h) / 2),
								};
							})();
							update({
								zoom,
								panX: Math.round(Math.min(maxX, Math.max(-maxX, settings.panX))),
								panY: Math.round(Math.min(maxY, Math.max(-maxY, settings.panY))),
							});
						}}
					/>
					<output>{Math.round(settings.zoom * 100)}%</output>
				</label>

				<div className="footer-tuner__row">
					<span>Pan</span>
					<output>X {settings.panX}px · Y {settings.panY}px</output>
					<button type="button" onClick={() => update({ panX: 0, panY: 0 })}>
						Center
					</button>
					<button type="button" onClick={() => update({ zoom: 1, panX: 0, panY: 0 })}>
						Default view
					</button>
				</div>

				<div className="footer-tuner__values">
					<code>dotScale={settings.dotScale.toFixed(2)}</code>
					<code>zoom={settings.zoom.toFixed(2)}</code>
					<code>panX={settings.panX}</code>
					<code>panY={settings.panY}</code>
				</div>

				<div className="footer-tuner__row">
					<span className="footer-tuner__status">
						{status === "rendering"
							? "Rendering dots…"
							: status === "error"
								? "Render failed"
								: "Drag anywhere on the artwork"}
					</span>
					<button type="button" onClick={resetAll}>
						Reset all
					</button>
				</div>
			</div>
		</div>
	);
}
