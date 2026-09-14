from math import floor, pow, sin
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "src/assets/ivey-building-footer.png"
DESTINATION = ROOT / "public/ivey-building-halftone-monitor.svg"
PHONE_DESTINATION = ROOT / "public/ivey-building-halftone-phone.svg"
PNG_DESTINATION = ROOT / "public/ivey-building-halftone-monitor.png"
PHONE_PNG_DESTINATION = ROOT / "public/ivey-building-halftone-phone.png"

VIEWBOX_WIDTH = 1200
# The artwork is judged at normal monitor distance, not as a zoomed-in SVG.
# A tighter pitch lets the circles optically blend into the building instead
# of reading as a loose icon made from oversized beads.
GRID_COLUMNS = 300
MOBILE_GRID_COLUMNS = 144
MONITOR_RASTER_WIDTH = 2880
PHONE_RASTER_WIDTH = 1170
CROP_TOP = 0.0
DESKTOP_CROP_BOTTOM = 0.84
MOBILE_CROP_BOTTOM = 1.0


def noise(x: int, y: int, seed: int) -> float:
	value = sin((x + seed) * 12.9898 + (y + seed) * 78.233) * 43758.5453
	return value - floor(value)


def clamp(value: float) -> float:
	return max(0, min(1, value))


def smoothstep(start: float, end: float, value: float) -> float:
	if start == end:
		return 1 if value >= end else 0
	progress = clamp((value - start) / (end - start))
	return progress * progress * (3 - 2 * progress)


def soft_range(value: float, start: float, end: float, feather: float = 0.04) -> float:
	"""Return a feathered 0–1 range instead of a hard rectangular edge."""
	return smoothstep(start - feather, start + feather, value) * (
		1 - smoothstep(end - feather, end + feather, value)
	)


def soft_rectangle_mask(
	x: float,
	y: float,
	left: float,
	right: float,
	top: float,
	bottom: float,
	feather: float = 0.04,
) -> float:
	return soft_range(x, left, right, feather) * soft_range(y, top, bottom, feather)


def architecture_mask(x: float, y: float, crop_bottom: float) -> float:
	"""Approximate the facade zones so bright glass still has a readable signal."""
	# These values are expressed in the original photo's normalized y-space;
	# convert the cropped SVG coordinate back so widening the crop does not
	# move the architectural emphasis.
	source_y = y * crop_bottom + CROP_TOP
	left_glass = soft_rectangle_mask(x, source_y, 0.07, 0.36, 0.04, 0.55, 0.045)
	central_glass = soft_rectangle_mask(x, source_y, 0.34, 0.53, 0.16, 0.58, 0.045)
	brick_wing = soft_rectangle_mask(x, source_y, 0.47, 0.82, 0.28, 0.62, 0.045)
	right_glass = soft_rectangle_mask(x, source_y, 0.50, 1.0, 0.36, 0.68, 0.045)
	podium = soft_rectangle_mask(x, source_y, 0.0, 0.86, 0.51, 0.72, 0.05)
	return max(left_glass, central_glass, brick_wing, right_glass, podium)


def circle_tone(brightness: float, structure: float, building_zone: float) -> str:
	# Bright glass is still part of the facade. Keep it visibly green so the
	# windows do not disappear into the white paper at normal viewing distance.
	if building_zone > 0.30 and brightness > 0.52:
		return "#154d3c" if structure > 0.12 else "#3f765f"

	if structure > 0.28 and brightness > 0.5:
		return "#3f765f"

	if brightness < 0.26:
		return "#154d3c"

	if brightness < 0.48:
		return "#3f765f"

	if brightness < 0.7:
		return "#77a28b"

	return "#a7c5b5"


def hex_to_rgb(value: str) -> tuple[int, int, int]:
	return tuple(int(value[index : index + 2], 16) for index in (1, 3, 5))


def render_png(
	destination: Path,
	viewbox_height: int,
	raster_circles: list[tuple[float, float, float, str, float]],
	raster_width: int,
) -> None:
	"""Rasterize the circles once so the browser does not parse a huge SVG."""
	raster_height = round(raster_width * viewbox_height / VIEWBOX_WIDTH)
	canvas = Image.new("RGB", (raster_width, raster_height), "#ffffff")
	draw = ImageDraw.Draw(canvas)
	scale = raster_width / VIEWBOX_WIDTH

	for center_x, center_y, radius, tone, opacity in raster_circles:
		red, green, blue = hex_to_rgb(tone)
		blend = tuple(round(255 * (1 - opacity) + channel * opacity) for channel in (red, green, blue))
		left = round((center_x - radius) * scale)
		top = round((center_y - radius) * scale)
		right = round((center_x + radius) * scale)
		bottom = round((center_y + radius) * scale)
		draw.ellipse((left, top, right, bottom), fill=blend)

	canvas.save(destination, format="PNG", optimize=True)
	print(f"Generated {raster_width}x{raster_height} raster in {destination}")


def render(
	destination: Path,
	png_destination: Path,
	grid_columns: int,
	crop_bottom: float,
	raster_width: int,
	dot_scale: float = 1.0,
) -> None:
	"""dot_scale multiplies every circle radius; centers stay fixed."""
	image = Image.open(SOURCE).convert("RGB")
	image_width, image_height = image.size
	crop_top = round(image_height * CROP_TOP)
	crop_bottom_px = round(image_height * crop_bottom)
	image = image.crop((0, crop_top, image_width, crop_bottom_px))
	viewbox_height = round(VIEWBOX_WIDTH * image.height / image.width)
	grid_rows = round(grid_columns * viewbox_height / VIEWBOX_WIDTH)
	cell_size = VIEWBOX_WIDTH / grid_columns
	sample = image.resize((grid_columns, grid_rows), Image.Resampling.LANCZOS)
	# Detect edges before downsampling so the tall glass mullions survive the
	# reduction. A small max filter keeps those high-resolution lines present in
	# the final grid without making grass texture equally prominent.
	edge_high = (
		image.convert("L")
		.filter(ImageFilter.GaussianBlur(radius=0.85))
		.filter(ImageFilter.FIND_EDGES)
		.filter(ImageFilter.MaxFilter(size=5))
	)
	edge_sample = edge_high.resize((grid_columns, grid_rows), Image.Resampling.LANCZOS)

	circles = []
	raster_circles = []
	for row in range(grid_rows):
		for column in range(grid_columns):
			red, green, blue = sample.getpixel((column, row))
			luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255
			brightness = clamp(luminance)
			contrast_brightness = clamp((brightness - 0.52) * 1.55 + 0.52)
			edge_strength = edge_sample.getpixel((column, row)) / 255
			normalized_x = column / max(1, grid_columns - 1)
			normalized_y = row / max(1, grid_rows - 1)
			building_zone = architecture_mask(normalized_x, normalized_y, crop_bottom)
			base_structure = clamp((edge_strength - 0.04) * 2.65)
			# Structure has more weight inside the known facade zones and less weight
			# in the sky/ground, where texture would otherwise become visual noise.
			structure = clamp(base_structure * (0.52 + building_zone * 1.72) + building_zone * 0.045)
			ink = clamp(
				(0.86 - contrast_brightness) * 1.42
				+ structure * (0.34 + building_zone * 0.32)
				+ building_zone * (0.20 + brightness * 0.16)
			)
			if building_zone > 0.22:
				# Give the facade a readable low-frequency signal even where a
				# bright window has very little local edge contrast.
				ink = max(ink, 0.25 + building_zone * 0.10 + structure * 0.28)
			if building_zone > 0.18 and edge_strength > 0.09:
				ink = max(ink, 0.26 + structure * 0.52)

			# The right planting bed is useful context but too visually heavy at
			# normal viewing distance. Fade it progressively while protecting the
			# right-hand facade and its reflection.
			right_terrain_fade = (
				smoothstep(0.40, 0.82, normalized_x)
				* smoothstep(0.48, 0.80, normalized_y)
				* (1 - building_zone * 0.96)
			)
			foreground_fade = smoothstep(0.55, 0.82, normalized_y) * (1 - building_zone * 0.88)
			terrain_fade = max(right_terrain_fade, foreground_fade * 0.72)
			ink *= 1 - terrain_fade * 0.88

			# Keep a quiet base dot in every cell. A skipped cell made the old
			# rectangle masks look like arbitrary white holes; a continuous field
			# makes the fade feel intentional while preserving the white background.
			if ink < 0.04:
				x = (column + 0.5 + (noise(column, row, 19) - 0.5) * 0.08) * cell_size
				y = (row + 0.5 + (noise(column, row, 29) - 0.5) * 0.08) * cell_size
				background_radius = (
					cell_size
					* (0.055 + noise(column, row, 37) * 0.020)
					* dot_scale
				)
				background_opacity = 0.08 + noise(column, row, 41) * 0.04
				circles.append(
					f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{background_radius:.2f}" '
					f'fill="#a7c5b5" fill-opacity="{background_opacity:.3f}"/>'
				)
				raster_circles.append((x, y, background_radius, "#a7c5b5", background_opacity))
				continue

			variation = 0.78 + noise(column, row, 3) * 0.42
			radius = max(
				0.24,
				cell_size
				* (0.10 + pow(ink, 1.14) * (0.27 + structure * 0.06))
				* variation
				* (1 + building_zone * structure * 0.16)
				* (1 - terrain_fade * 0.34)
				* dot_scale,
			)
			opacity = min(
				0.94,
				0.18
				+ pow(ink, 0.78) * 0.75
				+ structure * 0.17
				+ (noise(column, row, 11) - 0.5) * 0.1,
			)
			if building_zone > 0.28:
				opacity = max(opacity, 0.55 + building_zone * 0.10)
				if structure > 0.16:
					opacity = max(opacity, 0.56 + min(0.20, structure * 0.20))
			else:
				opacity = min(opacity, 0.30 + structure * 0.04)
			opacity *= 1 - terrain_fade * 0.64
			x = (column + 0.5 + (noise(column, row, 19) - 0.5) * 0.08) * cell_size
			y = (row + 0.5 + (noise(column, row, 29) - 0.5) * 0.08) * cell_size
			tone = circle_tone(contrast_brightness, structure, building_zone)
			circles.append(
				f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{radius:.2f}" '
				f'fill="{tone}" fill-opacity="{opacity:.3f}"/>'
			)
			raster_circles.append((x, y, radius, tone, opacity))

	svg = "\n".join(
		[
			f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {VIEWBOX_WIDTH} {viewbox_height}" '
			'preserveAspectRatio="xMidYMid meet">',
			'<rect width="100%" height="100%" fill="#ffffff"/>',
			'<g shape-rendering="geometricPrecision">',
			*circles,
			"</g>",
			"</svg>",
		]
	)
	destination.write_text(svg + "\n", encoding="utf-8")
	print(f"Generated {len(circles):,} circles in {destination}")
	render_png(png_destination, viewbox_height, raster_circles, raster_width)


def main() -> None:
	import argparse

	parser = argparse.ArgumentParser(description="Generate footer halftone artwork.")
	parser.add_argument(
		"--dot-scale",
		type=float,
		default=1.1,
		help="Multiplier for dot radius (1.1 = current look). Dot positions never move.",
	)
	parser.add_argument(
		"--crop-bottom",
		type=float,
		default=None,
		help="Override the desktop bottom crop (1.0 keeps the full scene incl. pool).",
	)
	args = parser.parse_args()

	desktop_crop_bottom = DESKTOP_CROP_BOTTOM if args.crop_bottom is None else args.crop_bottom

	render(
		DESTINATION,
		PNG_DESTINATION,
		GRID_COLUMNS,
		desktop_crop_bottom,
		MONITOR_RASTER_WIDTH,
		dot_scale=args.dot_scale,
	)
	render(
		PHONE_DESTINATION,
		PHONE_PNG_DESTINATION,
		MOBILE_GRID_COLUMNS,
		MOBILE_CROP_BOTTOM,
		PHONE_RASTER_WIDTH,
		dot_scale=args.dot_scale,
	)


if __name__ == "__main__":
	main()
