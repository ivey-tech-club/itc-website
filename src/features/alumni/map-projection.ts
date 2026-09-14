const RADIANS = Math.PI / 180;
const HALF_TURN = Math.PI;
const FULL_TURN = Math.PI * 2;
const ROTATE_LONGITUDE = 96 * RADIANS;
const SCALE = 771.5526276244138;
const TRANSLATE_X = 364.33091516440294;
const TRANSLATE_Y = 570.0982284078148;

// These are the constants used by d3-geo's conicEqualAreaRaw([20°, 60°]).
const parallel20Sine = Math.sin(20 * RADIANS);
const cone = (parallel20Sine + Math.sin(60 * RADIANS)) / 2;
const projectionConstant = 1 + parallel20Sine * (2 * cone - parallel20Sine);
const centerRadius = Math.sqrt(projectionConstant) / cone;

function rawConicEqualArea(longitude: number, latitude: number) {
  const radius =
    Math.sqrt(projectionConstant - 2 * cone * Math.sin(latitude)) / cone;
  const angle = longitude * cone;

  return [radius * Math.sin(angle), centerRadius - radius * Math.cos(angle)] as const;
}

const center = rawConicEqualArea(0, 40 * RADIANS);

function rotateLongitude(longitude: number) {
  const rotated = longitude * RADIANS + ROTATE_LONGITUDE;
  if (rotated > HALF_TURN) return rotated - FULL_TURN;
  if (rotated < -HALF_TURN) return rotated + FULL_TURN;
  return rotated;
}

function roundCoordinate(value: number) {
  return Math.round(value * 1_000) / 1_000;
}

/** Project a location into the generated 800px map coordinate space. */
export function projectLocation(
  [longitude, latitude]: readonly [number, number],
): [number, number] {
  const projected = rawConicEqualArea(
    rotateLongitude(longitude),
    latitude * RADIANS,
  );

  return [
    roundCoordinate(TRANSLATE_X + SCALE * (projected[0] - center[0])),
    roundCoordinate(TRANSLATE_Y - SCALE * (projected[1] - center[1])),
  ];
}
