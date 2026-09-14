/* eslint-disable @next/next/no-img-element */

import type { CSSProperties } from "react";

import { FOOTER_ART_SETTINGS, FOOTER_ART_VERSION } from "./footer-art-settings";

export default function HalftoneImage({
	alt,
	version = FOOTER_ART_VERSION,
}: {
	alt: string;
	version?: string;
}) {
	const query = `?v=${encodeURIComponent(version)}`;
	const objectPosition = `calc(50% + ${FOOTER_ART_SETTINGS.panX}px) calc(50% + ${FOOTER_ART_SETTINGS.panY}px)`;
	const imageStyle = { objectPosition } satisfies CSSProperties;

	return (
		<div className="halftone-image">
			<picture className="halftone-image__picture">
				<source
					media="(max-width: 760px)"
					srcSet={`/ivey-building-halftone-phone.png${query}`}
				/>
				<img
					draggable={false}
					className="halftone-image__asset"
					src={`/ivey-building-halftone-monitor.png${query}`}
					alt={alt}
					loading="eager"
					decoding="async"
					fetchPriority="high"
					style={imageStyle}
				/>
			</picture>
		</div>
	);
}
